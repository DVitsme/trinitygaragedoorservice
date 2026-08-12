# 05 · Known gaps after the patch

**Summary.** The patch shipped as `408f7db` fixes the three faults that caused the incident. It does
not make the lead path safe, and reading it as "done" would be the second mistake in this sequence.
Fourteen gaps are recorded below, ordered by how likely each is to cost a lead. Several are things
the patch introduced rather than inherited, and two are pre-existing faults that this work simply
did not touch.

⚠️ **This summary describes the state at `408f7db`. Read the status section immediately below it
first**, because a second fix has since shipped as `b187eed` and nine of the fourteen are closed.
The line that used to stand here, that the customer facing half of the fix was switched off in
production, is **no longer true**: a refused visitor now sees a message saying their details are
saved rather than the red "refresh and try again" that emptied the Wesley Chapel customer's form.
What remains off is the notification to a human, which is gap 1.

---

## Status, updated 2026-08-12 evening

Work continued after this file was written, and a second fix has now **shipped and been verified
against production**: commit `b187eed`, Worker version `268527c3`.

**The soft navigation fix is confirmed in a real browser on the live site**, which was the one check
that could not be automated (headless browsing the live site fires the client's Google Ads and Bing
tags). Method, worth reusing on any third party widget in a client routed app:

```js
// on the first form page, after a hard load
window.__t = document.querySelector('input[name="cf-turnstile-response"]').value.slice(0,24)
// then CLICK a nav link to a second form page, and run
const now = document.querySelector('input[name="cf-turnstile-response"]')?.value?.slice(0,24)
console.log({ before: window.__t, after: now, freshMint: !!now && now !== window.__t })
```

Result on 2026-08-12, `/get-service/` then `/get-service/off-track/` via the nav bar:
`{ before: '1.8j4iP7...', after: '1.gBEemX...', freshMint: true }`. Two distinct tokens, so the
widget re-mounted and minted fresh on a client side navigation. Before the fix the second read
returned nothing at all.

⚠️ **Comparing token LENGTH is not sufficient.** Tokens for one site key run to a consistent length,
so equal lengths are equally consistent with a fresh mint and with a stale token carried over. The
comparison has to be on the value.

Also verified end to end against production: a real submission wrote a `leads` row and delivered to
both office inboxes with `Reply-To` correctly populated, and a ten digit typo with no email was
captured into `unverified_leads` where the previous deploy discarded it. Both test records were
deleted afterwards; `leads` is back to 13 rows with `max_id` 20.

Nine of the fourteen are now closed. The five that remain are gaps 1, 4, 6, 7 and 12, and the two
that matter are **6, rate limiting, which now blocks the write ahead log**, and **1, alerting, which
is a single `wrangler secret put` once the recipient is decided**.

| # | Gap | Status |
|---|---|---|
| 1 | Alerting off, calm card dormant | **Open.** Still `alertTo: false` in production |
| 2 | The calm card can promise falsely | **Shipped in `b187eed`.** `refuse()` now returns `{ stored, notified }`, three states instead of two. `captured` keeps its old meaning so a cached bundle degrades safely |
| 3 | `alert_error` never written | **Shipped in `b187eed`** |
| 4 | Nobody reads `unverified_leads` | **Designed, not built.** Weekly digest Worker, see [`09-measurement-and-monitoring.md`](09-measurement-and-monitoring.md) |
| 5 | The gate captures the least | **Shipped in `b187eed`, and verified against production.** See below |
| 6 | Refusal path is an abuse surface | **Open, and now blocking.** Rate limiting must land *before* the write ahead log, not after |
| 7 | The 38% is unmeasured | **Baseline corrected**, see below. Post fix sample is n=1 and means nothing |
| 8 | Client side Turnstile error code invisible | **Shipped in `b187eed`.** Now posted with the submission and logged server side |
| 9 | Error branch misroutes config errors | **Shipped in `b187eed`.** `startsWith("200")` was wrong in *both* directions |
| 10 | `json.hostname` never validated | **Shipped in `b187eed`.** Nearly reintroduced the incident, see below |
| 11 | `leadRef` comment factually wrong | **Shipped in `b187eed`** |
| 12 | Silent message truncation | **Made observable, not restructured.** It now logs when it fires |
| 13 | `pnpm lint` broken | **Fixed in `b187eed`.** Root cause found, see below |
| 14 | GTM guard does not match its comment | **Shipped in `b187eed`** |

### Gap 5 fired in production eleven minutes after the deploy

The only `POST /api/contact` since `408f7db` went live was a **422 at 2026-08-12T15:48:54Z**, and
`unverified_leads` still holds **zero rows**. That refusal was discarded exactly as this gap
predicted, for exactly the reason described: the deployed `isReachable` requires a valid email, and
a `phone_invalid` refusal can never carry a `phoneE164` because `toE164` returns null when
`isValidPhone` fails.

This was no longer a theoretical gap, it was a measured ongoing loss, and it is why the defects
patch was deployed ahead of all the storage work.

**Closed and verified against production on 2026-08-12.** A POST carrying a ten digit phone with a
bad area code and no email address, the exact shape that was being discarded, returned 422 and wrote
a row to `unverified_leads`. The test row was deleted afterwards.

### Gap 7: the 38% baseline was not reproducible, and the corrected figure is 31.5%

The 62% solve rate (141 issued, 87 solved) quoted throughout this post-mortem is a **dashboard**
number. It cannot be reproduced through the GraphQL API. The numerator reconciles exactly, the
denominator does not: GraphQL reports 154 issued across all user agents, or **127 with bot
`browserName` values excluded, giving 87/127 = 68.5% solved and 31.5% refused**. Every window
boundary and bot subset was tried and no combination produces 141. The dashboard applies
Cloudflare's own bot classification; GraphQL exposes only `browserName`.

**68.5% is the reproducible baseline.** A post fix GraphQL figure compared against the 62%
dashboard figure would be measuring the difference between two instruments, not the effect of the
fix. Full detail and the runnable queries are in
[`09-measurement-and-monitoring.md`](09-measurement-and-monitoring.md).

### Gap 10 nearly became the incident, a second time

The straightforward hostname check rejects a mismatch in production. But `next start` and
`pnpm preview` both set `NODE_ENV=production`, and Cloudflare's test secret returns
`hostname: "example.com"`. Shipped as written, it would have **rejected every local test
submission**, including the exact workflow used to verify the patch an hour earlier. Caught during
testing and exempted via `isTurnstileTestSecret`. The accept path was exercised; the reject path
was not, because producing a genuinely valid token from a non allowlisted host is not possible
locally.

This is the third time in one day that a change intended to protect the form turned out to be
capable of refusing legitimate submissions. That rate is itself the finding.

### Gap 13: the root cause, recorded so nobody rediscovers it

`eslint-config-next@16` ships **flat** configs, but `eslint.config.mjs` wrapped them in
`FlatCompat.extends()`, which translates *legacy* eslintrc. It walked a structure that
self references through `plugins.react` and `JSON.stringify` threw before a single file was linted.
Fixed by importing the flat configs directly. Lint now runs and reports **39 errors and 3 warnings,
all pre-existing**, 37 of them `react/no-unescaped-entities` apostrophes across eight marketing
pages. Those were deliberately left for their own commit rather than buried in a security patch.

Note for whoever fixes them: the `@next/next/no-page-custom-font` warning on `app/layout.tsx` is the
Archivo Expanded `<link>` that CLAUDE.md says must **not** be converted to `next/font`. It needs an
inline disable comment pointing at CLAUDE.md so nobody "fixes" it and breaks the build.

### Four gaps that were not in the original fourteen

Found by reading the shipped code rather than the summary of it, and all now shipped in `b187eed`.
They are described in [`04-implementation.md`](04-implementation.md) and were the reason this file
was revised:

- **`alertConfigured()` tests configuration, not delivery**, so `captured: true` would have meant
  "an email was queued" the moment alerting was switched on.
- **`isReachable` was backwards relative to risk**, which is gap 5 above.
- **`alert_error` was a dead column**, gap 3.
- **The `leadRef` comments described a three field hash** when the code hashes eight.

### Two claims in this post-mortem that were wrong

Corrected here rather than quietly edited, because being wrong in the record is the point of
keeping one:

- **The `/api/contact` 308 redirect does not happen on production.** `trailingSlash: true` is set
  and the client does post without the slash, but a live POST returns its status directly. The 308
  was a `next start` behaviour that OpenNext does not reproduce.
- **The dangling JS chunk was a local Turbopack artefact.** All twelve chunks referenced by the
  live page return 200.

### Two near misses that were not code at all

Both caught before anything was pushed, both now fixed, both recorded in
[`10-privacy-and-retention.md`](10-privacy-and-retention.md):

- **`emails/email-reports/` was untracked and NOT gitignored**, holding raw office lead emails with
  real customer names, phone numbers, email addresses and IP addresses, in a **public** repository.
  One `git add -A` would have published them.
- **The first draft of the post-mortem commit carried two customers' IP addresses**, their user
  agents, ISP, town and request timestamps. Caught while still unpushed and amended out.

Neither was a bug. Both were a process with nothing in it that would notice, which is the same
shape as the incident this folder documents.

---

## 1 · The calm card is dormant in production. Alerting is off.

Confirmed on the deployed health check after `a1d68ba7`:

```
"alertTo": false
```

`UNVERIFIED_ALERT_TO` is not set. The consequence chain is exact:

```ts
const alerting = reason === "turnstile_reject" && alertConfigured();
…
return id !== null && alerting;        // ← this is `captured`
```

`alertConfigured()` requires `RESEND_API_KEY`, `UNVERIFIED_ALERT_TO` and `CONTACT_FROM_EMAIL`
together. With the alert address unset, `captured` is **always false**, so:

- the row is written to `unverified_leads` (good, the details are safe)
- nobody is emailed (bad)
- and the visitor gets the old copy: *"We could not verify that request. Please refresh and try
  again…"* rather than *"We have your details… someone will call you back."*

That old copy is the exact string the customer followed at 21:37:46 when he reloaded the page. Until
the secret is set, **we have fixed the data loss and not the customer experience.** One command,
no rebuild, no deploy:

```
wrangler secret put UNVERIFIED_ALERT_TO
```

This is a deliberate staging decision, not an oversight, but it is a decision with a live cost and
it should not be left open for more than a few days.

## 2 · The promise in the calm card can still be false

Once alerting *is* on, `captured` becomes true the moment the row is written and the alert is
*queued*. `alertConfigured()` checks environment variables, not delivery. The alert is sent inside
`after()`, so if Resend rejects it the visitor has already been told *"Someone will call you back."*

The failure is recorded:

```ts
await markAlert(id, status);   // "ok" | "failed" | "skipped"
```

…and nothing reads it. A row sitting at `alert_status = 'failed'` is a person who was promised a
callback that nobody knows to make. That is a smaller version of the original bug, one level up, and
it is exactly the shape the migration comment warns about.

**What would close it:** the periodic digest in gap 4 must query
`WHERE alert_status IN ('failed','pending')` first and loudest.

## 3 · A dead column: `alert_error` is never written

The migration creates it and comments explain its purpose. `markAlert` only ever sets
`alert_status`:

```sql
UPDATE unverified_leads SET alert_status = ? WHERE id = ?
```

So when an alert fails we record *that* it failed and never *why*. The Resend error name and message
go to `console.error` and nowhere durable. Minor, but it means diagnosing a broken alert path
requires Workers Logs within the 3 day retention window rather than a `SELECT`.

## 4 · Nobody reads `unverified_leads`

There is no dashboard, no digest, no report, and no routine. Production currently holds:

```
n: 0,  pending: null
```

Zero rows, so nothing is being missed yet. But a quarantine table that nobody queries is only
marginally better than discarding, and it is worse in one specific way: it creates a *belief* that
refusals are handled. The alert email is the only thing that surfaces a row today, and per gap 1 the
alert is off.

**Minimum viable fix:** a weekly `SELECT` in a calendar reminder. Better: a scheduled digest. The
query that matters is one line.

```sql
SELECT created_at, reason, name, phone, email, zip, source, alert_status
FROM unverified_leads ORDER BY id DESC;
```

## 5 · The gate most likely to catch a real customer captures the least

`isReachable` is the bar for keeping a refused submission:

```ts
return Boolean(s.phoneE164) || isValidEmail(s.email);
```

`phoneE164` is only set when `isValidPhone` passed. So on the **`phone_invalid`** gate it is
*by definition* undefined, and the row survives only if the email is valid.

That is backwards relative to risk. A visitor who mistypes their phone number is far more likely to
be a genuine fat fingered customer than a bot, and they are the one cohort whose capture depends
entirely on having filled in a second field. The client form marks email required, so most will
clear it, but the server does not require email and a direct POST need not include it.

Worth reconsidering: for `phone_invalid` specifically, storing the raw typed digits would let
someone squint at `8135551234` missing a digit and work it out. Today those are dropped with a log
line and nothing else.

## 6 · The refusal path is now an abuse surface it never used to be

Before the patch, a refused POST performed **zero I/O**. It now performs a D1 `batch()` of a DELETE
plus an INSERT, awaited before the response, sharing the daily write allowance with the real `leads`
table.

Three bounds exist: the reachability bar above, `MAX_STORED_TEXT = 4000` on the message, and the
prune riding in the same batch. They bound the damage. **They do not stop a flood.** A loop posting
distinct valid looking phone numbers writes a row every time.

The code comment says so plainly, which is right:

> ⚠️ This is NOT a substitute for a rate limiting rule on the zone. It bounds the damage; it does
> not stop a determined flood.

**No Cloudflare rate limiting rule exists on `/api/contact` today.** The zone is on the **Free
plan**, which constrains the options. This was P2 in the remediation and it should be promoted now
that the write path is live, because the exposure was created by this very patch.

## 7 · The 38% is reduced by an unknown amount, not fixed

The headline number, 141 challenges issued and 87 solved between 6 and 12 August with bots excluded,
was the state *before* the fix. The patch addresses the three known mechanisms, but there is no
post-deploy measurement yet and no reason to assume the residual is zero. Some fraction of that 38%
was people on hostile browser configurations that will still fail.

**Measure this, and put a date on it.** Two weeks after deploy, pull `turnstileAdaptiveGroups` for
the site key and compute solved over issued for real browsers, excluding `HeadlessChrome`,
`AdsBot`, `Googlebot` and the Chrome/Windows uptime beacon that runs around the clock. Compare
against 62%.

Decision rule agreed in `03-options-considered.md`: if the residual non solve rate is around one
percent, Turnstile is earning its place. If it is still in double figures, replace it with a
honeypot plus a time to submit check plus an edge rate limit.

Two traps when reading those numbers. The 28 day solve rate looks like 9% and is an artefact of
11,343 headless challenges during a crawl. And `challenge_siteverify_failed_invalid_token` climbed
during this investigation because of our own `?deep=1` probes, not customers.

## 8 · We still cannot see the client side Turnstile error code

The error callback writes to the browser console and nowhere else:

```ts
"error-callback": (code: unknown) => {
  const c = String(code ?? "");
  console.warn("[contact] Turnstile error", c);
  …
}
```

So Workers Logs still cannot distinguish:

- **200500**, the challenge iframe was blocked outright, a content blocker or DNS filter
- **300xxx / 600xxx**, the widget ran and the client failed the check
- **110200**, the hostname is not on the allowlist, which is our misconfiguration

Those need different responses, and during the incident this was the one fact the server side
evidence structurally could not supply. It is still missing. Posting the code to `/api/contact` as a
field, or to a tiny beacon endpoint, would close it and would have shortened this investigation
considerably.

## 9 · The error code branch still misroutes configuration errors

Unchanged by the patch, verified at `components/contact-form.tsx:251`:

```ts
c.startsWith("200")
  ? "The verification box could not load, which usually means a browser extension is blocking it…"
  : "Your browser could not finish the verification…"
```

**110200** (domain not allowed) and **200100** do not start with `200`, so a genuine configuration
error on our side is reported to the visitor as a problem with *their* browser. This was observed
live during preview testing on localhost, which produced 110200 and showed the generic message.

The patch did improve the copy: neither message now tells anyone to give up, and both say the form
can still be sent. So the severity is lower than it was. The misrouting itself remains.

## 10 · `json.hostname` is still never validated

`verifyTurnstile` destructures it and ignores it:

```ts
const json = (await res.json()) as {
  success: boolean;
  hostname?: string;      // ← read into the type, never checked
  action?: string;
  "error-codes"?: string[];
};

if (json.success) {
  if (json.action && json.action !== TURNSTILE_ACTION) { … return "reject"; }
  return "pass";
}
```

`action` is checked; `hostname` is not. Today this is theoretical, because the allowlist contains
only the apex and `www`. **It stops being theoretical the moment anyone adds `localhost` to the
widget's allowed domains for testing**, which is a completely natural thing to want to do and was
explicitly considered during this session. At that point anyone can serve a page on their own
machine with our site key, solve the widget legitimately, and post the token to production.

Two lines would close it permanently and remove the trap for whoever comes next.

## 11 · The `leadRef` comment is now factually wrong

Doc rot introduced by this patch. `app/api/contact/route.ts` around line 324 still says:

> Second, the semantics are already exactly right. This hash is `phoneE164|name|message` …
> It is still joinable to D1 without storing anything new: recompute the hash from a row's
> `phone_e164`, `name` and `message`.

The key is now eight fields. Anyone who tries to recompute a `leadRef` from three columns to join
Google Ads conversions back to D1 rows will get a hash that matches nothing and will waste an
afternoon. The comment immediately above the key computation is correct; this one, 80 lines later,
is not.

## 12 · Message truncation now silently applies to real leads

`MAX_STORED_TEXT = 4000` is applied once, when `submission` is assembled, which is *before* the
gates and therefore before the happy path too:

```ts
message: data.message?.trim().slice(0, MAX_STORED_TEXT) || undefined,
```

The cap exists to bound the refusal path's D1 writes, but it now also truncates a genuine customer's
message in the office email and the `leads` row. Four thousand characters is far more than anyone
has typed into "what is going on", so the practical risk is near zero. It is recorded because it is
a behaviour change to the success path that the commit message does not mention, and because
"a limit added for reason A silently applying to path B" is exactly the kind of thing that surfaces
two years later as a mystery.

## 13 · `pnpm lint` has been broken since before this work

Verified on clean `main`, before the patch:

```
ConfigArrayFactory._loadExtendedShareableConfig …
@eslint/eslintrc@3.3.5 … circular structure
ELIFECYCLE  Command failed with exit code 2
```

**Nothing in this repository is being linted right now.** That is relevant to this post-mortem
specifically because `next/core-web-vitals` and `next/typescript` would plausibly have flagged at
least one thing in the changed code, and because it means the only quality gates currently operating
are `tsc` via `pnpm build` and human review.

## 14 · The GTM guard does not do what its comment says

`app/layout.tsx:44-49`:

```ts
/**
 * Off in local dev and in any build that sets NEXT_PUBLIC_GTM_DISABLE, so screenshot QA and
 * `next dev` never fire real conversions into the client's live Google Ads account.
 */
const gtmEnabled = Boolean(SITE.gtmId) && process.env.NEXT_PUBLIC_GTM_DISABLE !== "1";
```

There is **no dev check**. The comment claims a behaviour the code does not implement, and
`NEXT_PUBLIC_GTM_DISABLE` is set nowhere: not in `.env.local`, not in `.env.example`, not in
`.dev.vars.example`, not in `package.json`, not in `next.config.ts`. So `pnpm dev` and `pnpm preview`
both load the real container `GTM-MXNSKF57` and fire real conversions into Lloyd's account unless
whoever is running them remembers the flag by hand. During this session the first preview build was
started without it and had to be killed and rebuilt.

And the inverse risk is worse, because `NEXT_PUBLIC_*` is inlined at build time:

```
NEXT_PUBLIC_GTM_DISABLE=1 pnpm run deploy
```

…would ship production with **no conversion tracking at all**, silently, with a green build and no
error anywhere. Nothing in the pipeline would report it.

**Fix:** add `process.env.NODE_ENV === "production"` to the condition so the comment becomes true,
or commit `NEXT_PUBLIC_GTM_DISABLE=1` to a `.env.development`. Either makes the safe case the
default instead of a thing to remember.

---

## Smaller notes, recorded rather than actioned

**The health endpoint is public and mildly informative.** `GET /api/contact` reveals whether HCP
sync is enabled, whether a BCC exists, how many office recipients there are, and whether Turnstile
is running on a test key. `turnstileIsTestKey: true` would tell a passer by that the form is
unprotected. It leaks no addresses or values and the tradeoff was made deliberately, but it is
reconnaissance an attacker does not otherwise get for free.

**`?deep=1` is an unauthenticated outbound amplifier.** Anyone who knows the URL can make the Worker
call `challenges.cloudflare.com` on demand. Low severity, siteverify is free and generously rate
limited, and the query parameter gate stops crawlers hitting it incidentally. Worth a shared secret
if this pattern is reused somewhere more exposed.

**The readiness poll stops after 20 seconds.** On a connection slow enough that `api.js` has not
loaded by then, the widget never mounts, `awaitToken` waits its 12 seconds, and the form posts
without a token. That degrades to a captured refusal rather than a loss, which is the right
behaviour, but it is a real path and it is not instrumented.

**`giveUp` is referenced before assignment** inside `awaitToken`'s promise executor. It is safe at
runtime because `onToken` cannot be called before the assignment completes, and it compiles. It is
the kind of thing a working linter would have opinions about, which loops back to gap 13.
