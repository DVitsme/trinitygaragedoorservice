# 07 · The day one checklist for the next lead site

**Summary.** This is the build list to work through at the start of the next project, before the first client lead ever arrives. Every item on it is here because its absence either caused the 12 August incident, hid it for nine days, or made it harder to investigate than it needed to be. The organising idea is that a small business lead form is a **payment system that happens to collect phone numbers**: one submission is worth $2,330 at this client, arrivals are rare enough that a silent outage looks exactly like a quiet week, and the business owner is the only person who will ever notice. Build it with the paranoia you would give a checkout, not the casualness you would give a contact form. Costs below are honest estimates of doing it at the start versus retrofitting after an incident.

---

## A. Lead capture

The non negotiable core. If you build nothing else on this list, build A1.

### ☐ A1. Persist every submission attempt before any gate runs

**What.** The very first thing the endpoint does after parsing and normalising the request is write a durable row. Validation, spam checks, and everything else happen after that write.

**Why.** In this incident six real submissions were read off the wire and thrown away, because every rejection path returned before the storage call. We know the customer's town, ISP, phone model and the second he pressed send. We do not know his name or number, and never will.

**Two viable shapes, and they are not equivalent:**

| Shape | When to use | Tradeoff |
|---|---|---|
| **One `submission_attempts` table**, with an `outcome` column, and real leads read through a view or promoted into `leads` | **A new project.** Recommended. | Cleanest data model. One row per attempt, complete history, trivially answers "what happened to this person". Requires every downstream consumer to be written against the view from the start. |
| **A separate `unverified_leads` quarantine table** alongside the existing `leads` | **Retrofitting an existing system.** What this project did. | Structurally safer when consumers already exist and assume `leads` means real. Costs you a UNION whenever you want the full picture. |

The second was correct here specifically because a CRM sync, a client facing export and the project's own documentation all already read `leads` meaning "real", and the CRM in question has **no DELETE endpoint** and holds 6,000 real customer records. On a fresh build with no such consumers, take the first.

**Fields to capture, minimum:**

```sql
-- identity, all nullable: the rows that land here are the ones that failed a check,
-- so the table cannot demand the fields whose absence put them there
name, phone, phone_e164, email, zip, city, service, message,

-- provenance: a click id cannot be reconstructed after the visit ends
source, page_path, referer, landing_path,
gclid, gbraid, wbraid, msclkid,
user_agent, ip,

-- what happened
outcome,          -- 'captured' | 'refused' | 'error'
gate,             -- which check refused it, null when captured
gate_detail,      -- vendor error codes, as JSON

-- what the visitor was told (see A3)
response_status,
response_message,
client_error_code,

-- sink outcomes (see A2)
email_status, email_error,
db_status,
crm_status, crm_id, crm_error,
alert_status, alert_error
```

**Retention and abuse bounds.** Refused rows prune on a schedule, 30 days is reasonable. Captured leads are kept. Bound the write path so a flood cannot consume the write budget your real data shares: only persist when the submission carries a reachable phone or email, cap free text length, and run the prune opportunistically in the same batch as the insert so retention maintains itself. **Say out loud that this bounds the damage and does not prevent a flood**, and put real rate limiting on the list (D5).

**Cost now:** one migration and about 40 lines. Half a day.
**Cost later:** this incident. Nine days of unknowable losses, a full forensic investigation across seven agents, a patch of 919 lines, and a customer who is permanently unrecoverable.

---

### ☐ A2. Save failed emails, and make them replayable

**What.** When a notification send fails, persist the rendered payload and the provider's error, mark it retryable, and alert. Not just the fact of failure, the **content**, so it can be re sent without reconstructing it.

**Why.** Two things this project got genuinely right and one it did not.

Right: email and database writes were **independent best effort sinks**, each wrapped so neither could fail the other, and the endpoint only reports total failure when both die. That decision is why the two real leads on 11 and 12 August survived, and it should be copied verbatim into every future build.

Right: the SDK's error object is actually checked. `resend.emails.send()` does **not** throw on API errors, it returns `{ data, error }`. An earlier version of this code only had a try/catch, so a rejected send resolved normally and was recorded as success while the lead vanished. Always check the returned error, never assume a rejected API call throws.

Wrong: when a send fails there is nothing to retry **from**. The payload is gone. The row in the database has the fields, but the rendered email, the recipient list at the time, and the reason for failure are not preserved, so recovery is a manual reconstruction.

**Design:**

```
1. Render the email payload.
2. Attempt the send.
3. On failure: write { payload_json, recipients, provider_error, attempts, next_retry_at }
   to an outbox row, and alert.
4. A scheduled job or the next request retries pending rows with backoff.
5. Cap attempts, then leave it visible and stop.
```

**Two traps worth knowing before you hit them:**

- **Idempotency keys silently suppress sends.** This project keys on `hash(phone|name|message)`, honoured for 24 hours, so the same person resubmitting with a different service selected produced the *same key* with a *different payload*, and the provider replayed the original response while the office never got the second email. The fix is to hash over **everything the email renders**. Check this the moment you introduce an idempotency key.
- **An alert about a failed lead email must not share the lead email's idempotency key.** If it does, a customer who is refused and then succeeds within the dedupe window gets their real lead email suppressed by the earlier alert. The fix in this codebase was a distinct key prefix. This is a bug that would have been caused *by* the fix.

**Cost now:** a table and a retry function. Half a day.
**Cost later:** every failed send is a lead that is in your database and not in anyone's inbox, and nobody finds out until the client asks why a customer says they were never called back.

---

### ☐ A3. Persist what the customer was actually shown

**What.** Store the HTTP status, the exact message string the visitor saw, and any client side error code, on the same row as the attempt.

**Why.** This is the single biggest remaining hole in the current patch, and it is worth being blunt about it.

Throughout the entire investigation we could **never determine the client side Turnstile error code**. The widget's `error-callback` writes to `console.warn` and sets a message on screen. Neither reaches the server. That code is the difference between two completely different diagnoses:

| Code family | Meaning | Correct response |
|---|---|---|
| `200500` | The challenge iframe could not load at all | A blocker or DNS filter. Tell them to disable it. |
| `110200` | Domain not on the widget's allowlist | **Our configuration is broken.** Fix it, do not blame the browser. |
| `300xxx` / `600xxx` | The widget ran and the client failed the check | Neither. Offer the phone. |

We only saw `110200` at all because Derrick pasted his browser console into the chat by hand during testing. That is not a monitoring strategy.

There is a live bug attached to this. The handler branches on `c.startsWith("200")` to choose between "a browser extension is blocking it" and the generic message. **`110200` does not start with `200`**, so a genuine misconfiguration on our side is reported to the customer as their own browser's fault. It is still in the code after the patch.

**Design.** POST the client error code to the endpoint alongside the submission, or to a small beacon route, and store it. Store the response message too, verbatim. Then "what did this person actually see" is a column, not an archaeology exercise.

**Cost now:** one field on the request body, one column, ten lines. An hour.
**Cost later:** an entire class of failure is invisible from the server, and every investigation into it depends on a user being able to describe a console they never opened.

---

### ☐ A4. Never let the client block itself out of a retry

**What.** After a failed submission, if you reset a token or a nonce, the UI must wait for the replacement before it will submit again.

**Why.** `resetWidget()` cleared the token field synchronously while the replacement took **2082 ms** in WebKit and **2215 ms** in Chromium to arrive. The customer's three submissions at 21:39:48, 21:39:50 and 21:39:51 all landed inside that window and all posted nothing. The reset was added deliberately to prevent a *spent* token being replayed, and created a guaranteed *empty* token window instead.

**Cost now:** a `verifying` state and an awaited promise. An hour.
**Cost later:** every user who retries quickly, which is every frustrated user, is guaranteed to fail again.

### ☐ A5. Email the person back the moment they submit

**What.** Any public form that a member of the public fills in should send that person an email
straight away. It does not need to be clever. It needs to say thank you, confirm you have their
request, and tell them a human will get back to them. Nothing else is required.

**Why.** Three separate reasons, and only the first is the obvious one.

**It closes the loop for the customer.** Somebody who has just typed their phone number into a
stranger's website has no idea whether it worked. A thank you page is seen for four seconds and then
the tab is closed. An email sits in their inbox as proof, with a phone number in it, and it is
findable a week later when they wonder whether they ever actually contacted you.

**It is a detector, and this is the part people miss.** If the form silently stops working, a
customer who expected an email and did not get one has a reason to chase. That is a real monitoring
channel and it costs nothing. In this incident the only detector in the entire system was a customer
choosing to phone the owner twice, and if he had been told to expect an email he would have had a
much clearer reason to say something the first time.

**It surfaces the customer's own typo.** Read their phone number and email back to them in the
message. A wrong digit is the single most common way a genuine lead becomes uncontactable, and the
sender is the only person who can spot it. Give them a monitored address to correct it at, and
**name that address in the text** rather than relying on a Reply-To they cannot see.

**Rules that are not optional:**

- **Send it only on the ACCEPTED path, after the spam gate.** Before the gate, the form becomes a
  way for anyone to make your domain send mail to a stranger who never asked for it. This is the
  one hard constraint in this item.
- **Send it deferred and best effort.** It must never delay the response or fail the submission.
  Losing it costs the customer a nicety; losing the record costs you the customer.
- **Give it its own idempotency key.** If you reuse the key from the internal notification, Resend
  and most providers scope idempotency to the account rather than the recipient, treat the second
  send as a replay of the first, return success, and deliver nothing. This trap caught this project
  twice.
- **Do not promise a time, a price, or a warranty.** Say a person will be in touch. Anything more
  specific is a claim somebody has to keep.
- **No unsubscribe footer.** It is a transactional reply to somebody who asked to be contacted, not
  marketing, and dressing it as a mailing list invites spam reports on the domain that also carries
  your internal lead notifications.
- **Any image is decoration.** Mail clients block remote images by default, so nothing the reader
  needs may live inside one. Host it rather than inlining base64: Gmail clips a message over 102 KB
  and will hide whatever sits below the fold, which is usually the phone number.

**Cost now:** a template and about twenty lines in the handler. Half a day including review.
**Cost later:** every customer who is not sure whether their message arrived phones you to ask, or
worse, phones somebody else. And you lose a free detector for the day the form breaks.

---

## B. Spam defence

### ☐ B1. Choose the weakest defence that actually stops your spam

**What.** Before reaching for a CAPTCHA, size the actual problem and try cheaper defences first.

**Why.** Be honest about what the spam here looked like. The submission that triggered the 3 August hardening arrived with **no token at all**, a California area code, a throwaway email domain and an SEO pitch in the message box. It never engaged the widget. Lifetime volume was roughly five junk rows in eleven days.

A honeypot field and a time to submit check would have caught that submission, cost nothing, and refused zero real customers. Instead the response was to make the CAPTCHA gate fail closed, which refused 38 percent of challenged real browsers.

**Escalation order, cheapest and safest first:**

| Defence | Stops | False positive risk | Cost |
|---|---|---|---|
| Honeypot field | Naive bots, form fillers | Near zero | 15 min |
| Time to submit floor (< 2s is a bot) | Scripted posts | Near zero | 15 min |
| Server side rate limit per IP | Floods | Low, watch shared NAT | 1 hr |
| Platform rate limiting rule | Floods, before your code runs | Low | 30 min, dashboard |
| CAPTCHA, non interactive | Scored bots | **Real** | 2 hr |
| CAPTCHA, managed / interactive | More bots | **High and silent** | 2 hr |

Only climb the ladder when the rung below it demonstrably failed.

### ☐ B2. If you use a CAPTCHA, start non interactive

**What.** Never ship a managed or interactive mode CAPTCHA on a sole conversion path without watching the solve rate first.

**Why.** Managed mode can escalate to a checkbox. Reproduced in a real browser here, that state fires **no error callback, no expired callback, no timeout callback**, shows no message, and leaves the submit button fully enabled. The visitor sees a form that looks ready and a button that works. This is the most user hostile failure in the entire incident and it is the vendor's default.

### ☐ B3. Every gate ships in log only mode

See `06-prevention.md` §2. Three state switch, in version control, default `log`, promote on evidence.

### ☐ B4. Validate the vendor's configuration, not just its presence

**What.** Assert the response fields the vendor gives you back, and check the config values themselves.

**Why.** The route validates `action` on the siteverify response but reads and ignores `hostname`. Two consequences: a hostname question that could have been answered from logs in seconds instead took an agent and a documentation read, and adding `localhost` to the allowlist for testing would have created a genuine bypass, because anyone could mint a token on their own machine and post it to production.

Also add a config assertion to the health check (C1): a **test** site key against a real secret rejects 100 percent of visitors while every dashboard reads as correctly configured.

---

## C. Observability and alerting

### ☐ C1. A health endpoint that asserts behaviour, not configuration

**What.** One authenticated or lightly gated URL that answers "is the revenue path actually working", not "are the environment variables present".

**Why.** The original endpoint on this project reported this:

```json
{ "db": true, "resend": true, "turnstile": true, "turnstileIsTestKey": false }
```

Every field was true throughout the outage. It reported that a Turnstile **secret existed**. It could not report that the secret **worked**, that the site key was real, that the widget rendered, or that the schema matched the code.

The patched version asserts:

| Check | Catches |
|---|---|
| `SELECT 1` | Binding broken |
| `pragma_table_info` against a required column list | **Migration not applied.** Otherwise shows up as an INSERT throwing at 2am on a real lead |
| Quarantine table exists | Same |
| Site key looks real, not a vendor test key | A build that rejects 100 percent of visitors while looking configured |
| `?deep=1` posts a bogus token to the vendor and asserts the *expected rejection code* | The secret is live and the vendor is reachable **from the server**, which is different from reachable from your laptop |
| Alert address configured | Refusals are being stored but nobody is being told, which is halfway back to the original bug |

That last row is the pattern to copy generally: **health checks should report the state of your safety nets, not only your happy path.**

**Gate the expensive checks behind a parameter** so a crawler cannot make you hammer a vendor API on every hit of a public URL.

**Cost now:** two hours.
**Cost later:** you find out from a customer.

### ☐ C2. Alert on the failure event, with the details in the alert

**What.** When a submission is refused, email or message a human immediately, and put the customer's name, phone, email and message **in the alert body**.

**Why.** At one genuine lead every 1.6 days, anomaly detection on volume is useless: a 48 hour silence is a normal Tuesday, and any threshold either cries wolf or sleeps through the outage. The tractable signal is the discrete event, not the absence.

Putting the details in the alert means **the alert is the recovery**. Somebody reads it and calls the customer. Without that, the alert is only a prompt to go and run a query, which is a step people skip.

**Point it at the agency first, not the client's office.** Until you know the spam ratio, an untriaged stream into the client's inbox recreates, from their side, the annoyance the spam gate existed to prevent. Make it a runtime secret so widening it later needs no rebuild and no deploy.

**Send it after the response, not before.** The durable write is what the visitor waits for. The notification is not.

### ☐ C3. Turn on platform logging before you need it, and know its retention

**What.** Enable structured logs on day one, and write down how long they are kept.

**Why.** `observability: { enabled: true }` in `wrangler.jsonc` is the single reason this incident was solvable. Without it there would have been no `missing-input-response`, no six timestamps, no request body sizes, and the investigation would have ended at "we cannot reproduce it".

Retention is roughly **three days**. The incident began on 11 August and was investigated on 12 August. A weekend, or a client who waited to mention it, and the evidence would have expired. **Log retention is an incident response deadline.** If your client reports something, pull the logs before you start theorising.

**Know that the query API samples.** A first query here returned 0 events and an identical re-run returned 14. Chunk time ranges and cross check.

### ☐ C4. Log the vendor decision, not just your own outcome

`[contact] Turnstile rejected the token: ["missing-input-response"]` resolved this case. Without the error code array we would have known submissions were refused and not why, and `missing-input-response` versus `invalid-input-response` versus `timeout-or-duplicate` are three completely different bugs.

### ☐ C5. Count third party widget initialisations against page views

See `06-prevention.md` §6. Free on most vendor dashboards, and it is the metric that exposes soft navigation breakage.

### ☐ C6. Synthetic end to end monitoring, with honest limits

**What.** A scheduled job that submits the form and asserts a lead lands.

**Why, and why it is genuinely hard here.** A real synthetic submission on this system emails real people and, once CRM sync is enabled, writes to a system with **no DELETE endpoint**. So:

| Approach | Verdict |
|---|---|
| Full synthetic POST against production | **No.** Creates real rows and real emails, and pollutes the client's lead source data |
| Synthetic POST with a reserved test phone number (555-0100..0199) and a recognisable name, plus a scheduled cleanup | Workable if the CRM sync is off and the office is warned |
| Synthetic POST against a staging deployment with the same code and separate sinks | **Best.** Costs a second Worker and a second database |
| Deep health check on a schedule (C1) plus refusal alerting (C2) | **The pragmatic minimum.** What this project has now |

Pick deliberately, and record which one you chose and what it does not cover. The current answer here is the last row, and it does not cover "the widget renders in a real browser", which remains a manual check.

---

## D. Deploy safety and configuration

### ☐ D1. Know which of your switches are baked at build time

**The trap, stated precisely.** `NEXT_PUBLIC_*` values are **inlined by the bundler at build time**, everywhere they appear, server code included. Consequences that have all nearly bitten this project:

- A build that runs **without** the variable ships the fallback silently. No error, no warning.
- A build that runs **with** a stray variable ships that instead. During this session a preview build was deliberately run with `NEXT_PUBLIC_GTM_DISABLE=1`, and running the production deploy in the same shell would have shipped a live site with **all conversion tracking dead** and nothing anywhere reporting a problem.
- Setting the variable in the Cloudflare dashboard does **nothing** for client code, because that is runtime and the value was already baked.

**The rule:**

| Kind of setting | Where it belongs | Why |
|---|---|---|
| **Behaviour switches** (booking on/off, gate mode, feature flags) | A hardcoded constant in version control | Cannot be silently absent. Requires an edit, a commit and a review. |
| **Secrets** (API keys, recipient addresses) | Runtime secrets | Changeable without a rebuild, never in the bundle |
| **Public identifiers** (analytics ids, public site keys) | Version control, with a health check asserting they are real | Baked anyway, so make them visible and assert them |

This project already applies that rule to `BOOKING_MODE` and the GTM id, with the reasoning written down. Extend it to every gate mode.

**Add a health check field for every baked value that matters.** `turnstileSiteKeyLooksReal` exists precisely because a build without the site key is invisible everywhere else.

**Deploy from a clean shell.** Add it to the checklist as a literal step.

### ☐ D2. The deploy checklist ends with a conversion path smoke test, including a soft navigation

**What.** After every deploy touching the lead path:

1. `curl` the deep health check. All flags expected true, vendor probe `ok`.
2. Confirm the analytics container is present in the shipped HTML.
3. Confirm the real vendor keys, not test keys, are in the shipped bundle.
4. **Load a form page in a real browser, then click a CTA through to a *different* form page, and confirm the widget renders on the second one.**
5. Submit once and confirm the lead arrives.

**Step 4 is the one this incident exists to add.** Every existing QA recipe in this repo loads URLs directly. Every one of them passes on a form that cannot be submitted. There were **10 pages carrying this form and 24 CTAs pointing into them**, and the only reliably working path was a direct load.

### ☐ D3. Verify on the real runtime, not a near one

`pnpm preview` runs the actual `workerd` runtime. `next start` does not. This project has now had two incidents where a build was green and the deployed Worker was broken: the `dynamicParams` 404 and this one. Preview is not optional for anything touching the money path.

### ☐ D4. Staged rollout for the money path

**What.** For anything that can refuse a conversion: ship it in log only mode, watch it, enforce it, and keep a one step reversal that does not require a deploy.

**Why.** The 3 August change went straight to enforce, and the reversal would have required a code change, a build and a deploy. The one genuinely fast mitigation available during this incident, flipping the widget from managed to non interactive, was a dashboard toggle with no deploy, and it was reversible in one click. **Prefer reversals that do not need a build.**

### ☐ D5. Rate limiting before the capture path has been live long

Once a rejection path does durable I/O, it shares a write budget with your real data. Put a platform level rate limit on the endpoint. It runs before your code and costs nothing to add.

### ☐ D6. Analytics and tags must be off outside production

**What.** Gate the tag container on `NODE_ENV === "production"`, not only on an opt out variable somebody has to remember.

**Why.** `app/layout.tsx` here carries a comment claiming GTM is "Off in local dev". It is not. The only guard is `NEXT_PUBLIC_GTM_DISABLE !== "1"`, and that variable is set **nowhere in the repository**. Every `pnpm dev` run, every preview, and every screenshot QA pass fires real conversions into the client's live Google Ads account, and the session recording tool in the same container records localhost.

Belt and braces: the `NODE_ENV` guard, plus `NEXT_PUBLIC_GTM_DISABLE=1` committed to a `.env.development`, plus a health check field reporting whether the container was baked in.

### ☐ D7. Fix your linter and keep it fixed

`pnpm lint` is currently broken in this repo, with `@eslint/eslintrc` throwing a circular structure error on clean `main`. It did not cause this incident and it would not have caught it. But a lint step that nobody can run is a check everybody believes is happening.

---

## E. Client communication

### ☐ E1. Make it easy for the client to report a problem, and treat it as monitoring

**What.** Tell the client explicitly, at handover: *if a customer ever says the website did not work, forward it immediately with the time and any voicemail, and do not wait to see if it happens again.*

**Why.** Jason chasing this **twice** is the only reason it was found. His first email at 01:57 could easily have been read as a one off. His second at 07:16, four minutes after the customer's final failed attempt, is what turned it into an investigation. A client who reports problems is doing free monitoring on the only detector that existed, and the correct response is to make that channel effortless and to visibly act on it.

Ask for three things when it happens: **roughly when**, **what device**, and **the voicemail or message itself**. Those three collapse an investigation. The 9:30 to 9:45pm window in Jason's email matched attempts logged at 21:37 and 21:39 and confirmed the identification immediately.

### ☐ E2. Set expectations about what the form can and cannot tell you

Say plainly at handover which failures are visible and which are not. Had that conversation happened here, "a refused submission leaves no record" would have been said out loud, and somebody would probably have asked why.

### ☐ E3. When it is your fault, say so first and in plain words

The honest version of this incident is that a change we made to stop spam started turning away real customers, silently, for nine days. Leading with that costs nothing and buys the credibility you need for the next recommendation. Leading with the fix and burying the cause is how a client stops forwarding voicemails.

### ☐ E4. Record the unknowable, and do not round it to zero

We cannot say how many leads were lost between 3 and 12 August, because the refusals were discarded. The right thing to tell a client is "we cannot count it, and here is why, and here is the change that means we could count it next time". The wrong thing is to imply the count was one because one is the number we can name.

---

## The five that matter most

If the next project gets a short deadline and this list gets cut, these five survive:

1. **A1** · Persist every attempt before any gate runs.
2. **B3 / D4** · Every gate ships in log only mode and is promoted on measured evidence.
3. **C2** · Alert on refusals, with the customer's details in the alert.
4. **D2 step 4** · The deploy smoke test clicks through to a second form page.
5. **C1** · A health check that asserts behaviour, including the state of your safety nets.

Items 1 and 3 together mean that even when something like this happens again, and it will, the customer gets a call back the same day and the incident is a phone call rather than a forensic investigation.
