# 04 · How the fix was implemented

> ⚠️ **This file describes the state at `408f7db` / Worker `a1d68ba7`, which is no longer what is
> deployed.** Three further deploys landed the same day: `b187eed` (four defects this
> implementation introduced), `91966c6` (rate limiting, shadow mode) and `48be8c3` (the write ahead
> submission log, migration `0006`). It is kept as the record of what the first fix actually did,
> because four of its defects were only found by reading it against the shipped code. For the
> current state see [`05-known-gaps.md`](05-known-gaps.md).

**Summary.** Commit `408f7db`, five files, +919/-89, deployed as Worker version `a1d68ba7`. Three
independent faults were fixed plus two unrelated silent losses found on the way past. The single
most important structural change is that the `submission` object is now assembled **before** any
gate runs, which is what makes it possible for a refused submission to be captured instead of
dropped on the floor. Everything else follows from that ordering. This document describes what is
actually on disk after the commit, not what was planned; where the two differ it says so.

---

## 1 · The request lifecycle, end to end

```
                          components/contact-form.tsx
  <Script src="…/api.js?render=explicit" onReady={mountWidget} />
                     │
                     ├── mountWidget()          idempotent, guarded by widgetId.current
                     │      └── turnstile.render(boxRef, { callback, expired, timeout, error })
                     ├── readiness poll, 200ms, up to 20s
                     └── cleanup: turnstile.remove(widgetId)  on unmount
                     │
  onSubmit ──► client field validation
            ──► setStatus("verifying")
            ──► awaitToken()            2.5s → "One more step" prompt
                                        12s  → give up, post anyway
            ──► setStatus("submitting")
            ──► POST /api/contact
                     │
                          app/api/contact/route.ts  POST
                     │
            ──► parse JSON                       400 invalid_json
            ──► build `submission`               ⚠️ BEFORE the gates. This is the fix.
            ──► gate: name                       refuse(…, "name_required")   → 422
            ──► gate: isValidPhone               refuse(…, "phone_invalid")   → 422
            ──► gate: verifyTurnstile            refuse(…, "turnstile_reject") → 400 + captured flag
                     │
            ──► hashKey(8 fields)  → idempotencyKey
            ──► Promise.all([ sendEmail(), storeLead() ])
            ──► after(): pushLeadToHcp()         still gated off
            ──► 503 if BOTH sinks failed
            ──► 200 { ok, email, db, leadRef }
                     │
  client ──► track("generate_lead") ──► router.push(THANK_YOU)
```

The `refuse()` calls at each gate are the whole point of the change. Before this commit each of
those three gates did a bare `return NextResponse.json(...)` while the customer's name, phone,
email and zip were still loose local variables, and they were garbage collected.

### The ordering change that enables everything

```ts
/**
 * ⚠️ **Assembled BEFORE the gates, and that ordering is the entire point of this block.**
 * …
 * Assembling the submission first means each gate can hand it to `refuse()` on its way out
 * instead of dropping it on the floor. **Do not move any gate above this object.**
 */
const submission: Submission = {
  name, firstName, lastName,
  zip: data.zip?.trim() || undefined,
  phone: formatPhone(phone),
  phoneE164: toE164(phone) ?? undefined,
  email: data.email?.trim() || undefined,
  city: data.city?.trim() || undefined,
  service: data.service?.trim() || undefined,
  message: data.message?.trim().slice(0, MAX_STORED_TEXT) || undefined,
  source: data.source?.trim() || "website",
  ...clickIds(req),
};
```

`formatPhone` and `toE164` are both safe on a bad number: the first returns whatever it was given,
the second returns `null`. That matters, because this object has to survive being built from a
submission that is about to fail phone validation.

A new `Submission` type was introduced alongside the existing `lead` shape, with `name` and
`phoneE164` **optional**, because a submission that failed a gate is exactly one that may be
missing them. The narrowed `lead` is derived after the gates with `const lead = { ...submission, name }`.

---

## 2 · Explicit rendering

### The constant, and why it is load bearing

```ts
const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
```

With implicit rendering, Turnstile scans the document for `.cf-turnstile` elements once, when
`api.js` executes. `next/script` dedupes by `src`, so on a client side navigation from one form
page to another the script does **not** run again, the newly mounted container is never scanned,
and the widget never appears. No error, no console warning, an empty box, and every submission from
that page arrives with no token.

### The mount function

```ts
const mountWidget = useCallback(() => {
  if (!TURNSTILE_SITE_KEY || widgetId.current || !boxRef.current) return;
  const api = turnstileApi();
  if (!api) return; // api.js has not finished loading; the poll below will come back around
  widgetId.current = api.render(boxRef.current, {
    sitekey: TURNSTILE_SITE_KEY,
    action: "contact-form",
    theme: "light",
    "refresh-expired": "auto",
    callback: (value: string) => { setTsError(""); setNeedsCheck(false); settleToken(value); },
    "expired-callback": () => settleToken(""),
    "timeout-callback": () => {
      settleToken("");
      try { api.reset(widgetId.current ?? undefined); } catch { /* already gone */ }
    },
    "error-callback": (code: unknown) => { /* … */ },
  });
}, [settleToken]);
```

Three details worth copying to another project:

**`widgetId.current` is the idempotency guard.** `mountWidget` is called from three places: the
script's `onReady`, the mount effect, and the readiness poll. Without the guard, a re-render stacks
duplicate widgets, each minting tokens into a different hidden input, and the form reads the wrong
one.

**`onReady`, not `onLoad`.** This is the specific line that fixes the client navigation case:

```tsx
<Script src={TURNSTILE_SRC} strategy="afterInteractive" onReady={mountWidget} />
```

`next/script` caches by `src`. On a second form page in the same document `onLoad` never fires
again, because the script was already loaded. `onReady` runs on the load event the first time **and
on every subsequent mount**. It is the documented hook for exactly this, and it is why the `<Script>`
tag can stay inside the component instead of being hoisted into the layout.

**The readiness poll is belt to that braces.**

```ts
const poll = setInterval(() => {
  if (widgetId.current) clearInterval(poll);
  else mountWidget();
}, 200);
const stopPolling = setTimeout(() => clearInterval(poll), 20000);
```

Justified in the code comment on the grounds that this form is the only way the business takes a
lead online and it has now been broken twice by a script lifecycle assumption. Polling for
`window.turnstile` costs nothing and does not care which path got there first. That is a reasonable
instinct to generalise: when a component is the single revenue path, pay for a redundant recovery
mechanism.

**Cleanup on unmount:**

```ts
const api = turnstileApi();
if (api && widgetId.current) {
  try { api.remove(widgetId.current); } catch { /* already removed */ }
}
widgetId.current = null;
token.current = "";
waiters.current = [];
```

Without `remove()`, navigating away from the form leaves an orphaned widget holding a container
React has already detached.

**The container carries no `cf-turnstile` class and no `data-*` attributes.** That is deliberate and
easy to get wrong: those are the markers for *implicit* rendering, and leaving them in place would
let a stray implicit scan render a second widget into the same box.

```tsx
<div ref={boxRef} className="sm:col-span-2" />
```

---

## 3 · The token as owned state, not a DOM read

Before the patch the submit handler did `fd.get("cf-turnstile-response")` at the instant of the
click and posted whatever was there. Now the component holds the token:

```ts
const token = useRef("");
const waiters = useRef<Array<(t: string) => void>>([]);

const settleToken = useCallback((value: string) => {
  token.current = value;
  const queued = waiters.current;
  waiters.current = [];
  for (const resolve of queued) resolve(value);
}, []);
```

`awaitToken()` resolves with a token or with `""` once the budget runs out:

```ts
const awaitToken = useCallback(() => {
  if (token.current) return Promise.resolve(token.current);
  const existing = widgetId.current ? turnstileApi()?.getResponse(widgetId.current) : undefined;
  if (existing) { token.current = existing; return Promise.resolve(existing); }
  return new Promise<string>((resolve) => {
    const prompt = setTimeout(() => setNeedsCheck(true), TOKEN_PROMPT_AFTER_MS);
    let giveUp: ReturnType<typeof setTimeout>;
    const onToken = (value: string) => { clearTimeout(prompt); clearTimeout(giveUp); resolve(value); };
    giveUp = setTimeout(() => {
      clearTimeout(prompt);
      waiters.current = waiters.current.filter((w) => w !== onToken);
      resolve("");
    }, TOKEN_GIVE_UP_AFTER_MS);
    waiters.current.push(onToken);
  });
}, []);
```

It reads `getResponse()` as well as its own state because the two can legitimately disagree for a
moment: `refresh-expired: auto` re-mints without our callback having fired in some paths.

Two timeouts, 2500ms and 12000ms:

```ts
const TOKEN_PROMPT_AFTER_MS = 2500;
const TOKEN_GIVE_UP_AFTER_MS = 12000;
```

The first covers the mechanical gaps, a slow solve and the reset hole. Past that the likely
explanation is a managed challenge waiting for a click nobody noticed, so the UI says so:

```tsx
{needsCheck && (
  <p role="status" className="text-[15px] font-semibold text-ink sm:col-span-2">
    One more step. Please finish the quick check just above this button.
  </p>
)}
```

`role="status"` and not `role="alert"`: nothing has gone wrong yet, and interrupting a screen reader
mid submit to say "still working" is noise.

**When the wait runs out the form submits anyway.** That is the correct call and it is worth being
explicit about: withholding the request is the one thing that guarantees the details are lost. Since
the capture path landed, a tokenless POST is no longer a black hole.

### The reset race

```ts
const resetWidget = useCallback(() => {
  settleToken("");
  try { turnstileApi()?.reset(widgetId.current ?? undefined); } catch { /* not mounted */ }
}, [settleToken]);
```

The code comment records a correction worth preserving. Commit `4cb5cc1` added the reset because it
worried about a **spent token being replayed**. That is not what happened. `turnstile.reset()`
already blanked the hidden input synchronously, so replay was never possible. What it created
instead was a window where the field was empty:

```
token length before reset()   21
immediately after reset()     0        ← a submit here posts NO token
repopulated after             2082ms (WebKit) / 2215ms (Chromium)
```

The production log shows POSTs at 01:39:48, 01:39:50 and 01:39:51, all inside that hole. The fix is
not to shorten the window but to stop reading the DOM at click time: the next submit finds no token,
waits through `awaitToken`, and sends the new one.

A new `"verifying"` status was added to the state union and to the double submit guard:

```ts
if (status === "submitting" || status === "verifying") return;
```

Without `verifying` in that guard, a visitor tapping through the wait fires one request per tap,
which is precisely the three-in-four-seconds pattern the incident log shows.

---

## 4 · The capture path

### The migration

`db/migrations/0005_unverified_leads.sql`, 88 lines, most of it comment. The table:

```sql
CREATE TABLE IF NOT EXISTS unverified_leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  reason      TEXT NOT NULL,
  name        TEXT,
  phone       TEXT,
  phone_e164  TEXT,
  email       TEXT,
  zip         TEXT,
  city        TEXT,
  service     TEXT,
  message     TEXT,
  source      TEXT,
  user_agent  TEXT,
  ip          TEXT,
  gclid        TEXT,
  gbraid       TEXT,
  wbraid       TEXT,
  msclkid      TEXT,
  landing_path TEXT,
  alert_status TEXT NOT NULL DEFAULT 'pending',
  alert_error  TEXT
);

CREATE INDEX IF NOT EXISTS idx_unverified_created_at   ON unverified_leads (created_at);
CREATE INDEX IF NOT EXISTS idx_unverified_alert_status ON unverified_leads (alert_status);
```

Design notes that matter on a reimplementation:

- **`name` and `phone` are nullable here and `NOT NULL` in `leads`.** The rows that land here are
  the ones that failed a validity check, so the table cannot demand the fields whose absence put
  them here. Copying the `leads` schema wholesale would have made the capture throw.
- **`reason` is free text, not a `CHECK` constraint.** A `CHECK` that rejects an unknown reason
  would throw away the very row the table exists to keep, and adding a gate would need a migration.
- **Click ids are carried through.** A recovered lead should be attributable to the click that paid
  for it, and a `gclid` cannot be reconstructed after the visit ends.
- **`alert_status` mirrors `hcp_status` from migration 0003.** The alert is sent in background work
  after the response, so its failure is invisible to the visitor by design and must not also be
  invisible to us. A table full of `pending` means the alert path is broken.

### `refuse()`

```ts
async function refuse(submission: Submission, req: Request, reason: RefusalReason): Promise<boolean> {
  if (!isReachable(submission)) {
    console.warn("[contact] refused, nothing to call back on, dropped", { reason });
    return false;
  }
  const alerting = reason === "turnstile_reject" && alertConfigured();
  const id = await storeUnverified(submission, req, reason, alerting ? "pending" : "skipped");
  console.warn("[contact] refused submission captured", { reason, id, source: submission.source });

  if (id !== null && alerting) {
    after(async () => {
      const status = await alertUnverified(submission, reason);
      await markAlert(id, status);
    });
  }
  return id !== null && alerting;
}
```

**The reachability bar:**

```ts
function isReachable(s: { phoneE164?: string; email?: string }): boolean {
  return Boolean(s.phoneE164) || isValidEmail(s.email);
}
```

`phoneE164` is only ever set when `isValidPhone` passed, so this reads as "a number that could
actually be dialled" rather than "the field was not empty". Two jobs: a refusal with neither is not
a lead anyone could recover, and writing it would hand anyone with a loop a way to consume the daily
D1 write allowance that the real `leads` table shares.

**Only a Turnstile rejection raises a human.** The two 422 gates write a row but do not alert. The
reasoning in the code is that the client validates name and phone with the same functions the server
does and the form cannot submit without JavaScript, so a 422 reaching the server did not come from a
person using the form. The rows are still written, because they are how we would learn that client
and server had drifted apart, or that someone is probing the endpoint.

**The text cap** is applied once, on the way in, at `MAX_STORED_TEXT = 4000`. Note this affects the
happy path too: a message over 4000 characters is now truncated in the real lead email as well.

**The prune rides in the same D1 batch as the insert:**

```ts
const [, inserted] = await env.DB.batch<{ id: number }>([
  env.DB.prepare(`DELETE FROM unverified_leads WHERE created_at < datetime('now', ?)`)
    .bind(`-${UNVERIFIED_RETENTION_DAYS} days`),
  env.DB.prepare(`INSERT INTO unverified_leads (…) VALUES (…) RETURNING id`).bind(…),
]);
return inserted.results?.[0]?.id ?? null;
```

One round trip, and with `idx_unverified_created_at` the DELETE is an index seek matching nothing on
almost every call. Retention maintains itself rather than depending on somebody remembering a
command, which is the correct instinct: **a cleanup job that needs a human is a cleanup job that
does not happen.**

`storeUnverified` never throws. A failed capture must not turn a 400 into a 500.

### The alert

Plain text, no React template, deliberately:

```
A submission was refused by the spam check and never reached the leads table.
This person may be sitting waiting for a call. Treat it as real until it obviously is not.

Refused by: turnstile_reject
Name:       …
Phone:      …
Email:      …
Zip:        …
Service:    …
Came from:  …

What they wrote:
…

It is saved in the unverified_leads table for 30 days.
```

A text body cannot be broken by whatever the visitor typed, and it keeps this path from sharing a
failure mode with the office lead email it is a backstop for. There is deliberately **no `replyTo`**:
the address on a refused submission is the least trustworthy field on the page.

---

## 5 · The idempotency trap that nearly recreated the bug

This is the subtlest part of the change and the one most worth remembering.

The refusal alert uses a **different** idempotency key namespace from the office lead email:

```ts
const key = await hashKey(
  `unverified|${reason}|${s.phoneE164 ?? ""}|${s.name ?? ""}|${s.message ?? ""}`,
);
```

Resend's idempotency window is 24 hours and keys on the key alone. If the refused attempt and the
same person's later successful attempt had shared a key, Resend would have replayed the alert's
response and **the real lead email would never have been sent**.

That is not hypothetical. It is precisely the incident: the customer was refused at 01:37 and got
through at 11:12 the same morning, nine and a half hours inside the window. A naive implementation
of this fix would have caused a new silent lead loss in exactly the scenario it was written for.

The `unverified` prefix keeps the namespaces apart while still collapsing duplicate alerts from
someone pressing submit three times in four seconds.

---

## 6 · The two unrelated silent losses in `sendEmail`

Both had the same shape: the office receives nothing, D1 still succeeds, the route still returns 200,
and the customer still sees the success card. A lost lead with a happy face on it.

**Unvalidated `replyTo`.** Resend validates `reply_to` and answers 422 **before creating the email
object**, so one malformed address killed the whole send.

```ts
...(isValidEmail(lead.email) ? { replyTo: lead.email } : {}),
```

`isValidEmail` already existed in `lib/lead-validation.ts` and is what the client checks with; the
route simply never imported it. What the office loses when it is dropped: Reply goes to the sending
address instead of the customer. Nothing becomes unreachable, because the Email row in the body is
still a `mailto:` link.

**An idempotency key narrower than the email it guards.** The key was `phoneE164|name|message` while
`LeadEmail` also renders email, zip, city, service and source. The same person submitting, changing
the service dropdown and submitting again inside 24 hours produced the same key.

```ts
const idempotencyKey = await hashKey(
  [lead.phoneE164, lead.name, lead.email, lead.zip,
   lead.city, lead.service, lead.source, lead.message]
    .map((v) => v ?? "").join("|"),
);
```

The rule now: **if it appears in the email, it is in the key.**

A third, smaller fix went in alongside: `oneLine()` flattens CR and LF out of the subject. Not a
header injection risk through Resend's JSON API, but the same dull failure, a rejected send and a
200 response.

---

## 7 · The health check

`GET /api/contact` gained five fields and an optional deep probe.

```json
{
  "db": true,
  "leadsSchema": true,
  "unverifiedTable": true,
  "resend": true,
  "mailTo": true,
  "mailToCount": 2,
  "mailFrom": true,
  "mailBcc": true,
  "alertTo": false,
  "turnstile": true,
  "turnstileIsTestKey": false,
  "turnstileSiteKey": true,
  "turnstileSiteKeyLooksReal": true,
  "siteverify": "ok",
  "hcpLeadSync": false
}
```

**`leadsSchema`** reads `pragma_table_info('leads')` and compares against a `REQUIRED_LEAD_COLUMNS`
list. `SELECT 1` proves the *binding*, not the schema, and migrations are a separate step from a
deploy with no gate between them. Without this, a missing column shows up as an INSERT throwing at
2am on a real lead. Note the table valued form is used because D1 only accepts a short allowlist of
bare `PRAGMA` statements.

**`turnstileSiteKeyLooksReal`** is the most valuable addition and the least obvious. The existing
check only covered the *secret*. The opposite failure is worse:

> A dummy SITE key paired with a real secret means the widget mints `XXXX.DUMMY.TOKEN.XXXX`,
> siteverify answers `invalid-input-response`, and **every single submission is rejected** while
> every dashboard and secret list still reads as correctly configured.

It is checked by prefix (`0x` real, `1x`/`2x`/`3x` testing) rather than against a list, because
Cloudflare has added testing keys before and a hardcoded list would quietly stop matching.

Critically, this reads a `NEXT_PUBLIC_*` value, so it reports **the value the widget was compiled
with**, not whatever the Worker environment happens to hold. That build time versus runtime
distinction is the entire point of the field.

**`?deep=1`** is the one check that exercises the half of the pipeline that actually failed:

```ts
body: new URLSearchParams({ secret, response: "health-check-not-a-real-token" }),
…
if (codes.includes("invalid-input-secret") || codes.includes("missing-input-secret")) return "bad-secret";
if (codes.includes("invalid-input-response")) return "ok";
return "unexpected";
```

A working setup answers `invalid-input-response`, meaning "your secret is fine, that token is not".
A broken secret answers `invalid-input-secret`. That single word is the difference between "the form
is fine" and "every customer is being turned away", and it is provable from the Worker with no
browser, no widget and no token. It is gated behind the query parameter so a crawler cannot make us
hammer siteverify.

---

## 8 · What was actually verified

### Widget mount, before and after

Instrument: localhost is not on the widget's allowlist, so every real mount emits
`[Cloudflare Turnstile] Error: 110200`. A mount attempt is therefore directly observable.

**Before the patch:**

```
[A. HARD load of /get-service/]        widget MOUNT attempts: 1   (widget rendered)
[B. SOFT nav to /get-service/repair/]  widget MOUNT attempts: 0   ← WIDGET NEVER MOUNTED
[C. SOFT nav away and back]            widget MOUNT attempts: 0   ← WIDGET NEVER MOUNTED
```

**After the patch:**

```
[A. HARD load of /get-service/]        widget MOUNT attempts: 1   (widget rendered)
[B. SOFT nav to /get-service/repair/]  widget MOUNT attempts: 1   (widget rendered)
[C. SOFT nav away and back]            widget MOUNT attempts: 1   (widget rendered)
```

### Workers runtime, via `pnpm preview`

`next start` cannot prove any of this. The repo has already been bitten once by
`dynamicParams = false` 404ing an entire route on Cloudflare while `pnpm build`, `tsc` and
`next start` all stayed green.

Refusal path, real Turnstile secret, localhost not allowlisted so no token is possible:

```
POST /api/contact 400
{"error":"verification_failed","captured":false,"message":"We could not verify that request…"}

unverified_leads  id 4, name "test", reason "turnstile_reject", alert_status "skipped"
leads             0 rows
```

With `UNVERIFIED_ALERT_TO` configured, `captured` flips and the copy changes:

```
{"error":"verification_failed","captured":true,
 "message":"We could not finish the security check, so a person is picking this one up by hand…"}
```

Success path, with Cloudflare's always-pass test keys:

```
POST /api/contact 200 OK (927ms)
GET  /thank-you/  200 OK

leads  id 3, name "test", service "Opener repair", source "contact-form"
```

And the email arrived, with the `replyTo` fix visible in the headers:

```
From:     noreply@trinitygaragedoorservice.com
To:       derrick@digitaldog.io
Reply-To: derrick@digitaldog.io
Subject:  New Opener repair lead: test, (255) 544-4568
dkim=pass (×2)  spf=pass  dmarc=pass
```

Alert write-back was exercised in all three states: `skipped` when alerting is unconfigured,
`skipped` when the Resend key was blanked, and `failed` when the send was attempted with an invalid
key. That last one proves `markAlert` actually writes back.

Every route on the site was also walked during the preview session and returned 200, which is the
regression check that the patch broke no page.

### The remote migration

```
🚣 Executed 4 commands in 1.10ms
0005_unverified_leads.sql  ✅

leads: 13,  max_id: 20      ← nothing lost
unverified: 0
```

### Production, after deploy

```
version a1d68ba7-7e89-4961-964b-43074e546eb6

siteverify                "ok"
unverifiedTable           true
turnstileSiteKeyLooksReal true
mailToCount               2

api.js?render=explicit    present in /_next/static/chunks/1nybtwt9vgtha.js
0x4AAAAAAEBKd2inJHyABmFZ  present in the same chunk   ← real key, not the test one
GTM-MXNSKF57              present in the HTML         ← conversion tracking survived
```

---

## 9 · Two corrections to claims made during the investigation

Recorded because a post-mortem that quietly drops its wrong turns is less useful than one that keeps
them.

**The `/api/contact` 308 does not happen on production.** An investigating agent reported that
`trailingSlash: true` causes every submission to be redirected from `/api/contact` to
`/api/contact/`, costing a round trip. `next.config.ts:32` does set `trailingSlash: true`, and the
client at `contact-form.tsx:473` does post to `/api/contact` without the slash. But a live POST
against the deployed Worker returns **422 directly**, not a 308. The redirect is a `next start`
behaviour that the OpenNext router does not reproduce. No fix is needed; the concern was real but
the conclusion was wrong.

**The dangling JS chunk was a local artefact.** A local production build served `/get-service/` with
a `<script>` reference to a chunk that had never been emitted, returning 500 and killing the page
with a `ChunkLoadError`. All 12 chunks referenced by the live page return 200. It was a Turbopack
artefact of an incremental local build, not a shipped fault.
