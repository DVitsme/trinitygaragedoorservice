# Post-mortem: the contact form refused a real customer six times

**Incident date:** 11 to 12 August 2026
**Regression introduced:** 3 August 2026, commits `4cb5cc1` and `1142198`
**Detected:** by the client's owner, relaying a customer voicemail, nine days later
**Fixed:** 12 August 2026, commit `408f7db`, Worker version `a1d68ba7`
**Written:** 12 August 2026

---

## The short version

A homeowner in Wesley Chapel clicked a Google ad Trinity paid for, browsed five pages
including the one about his own town, and tried to send a garage door repair request six
times across eleven hours. Every attempt was refused with an HTTP 400. His name, phone
number, email and zip were discarded at the point of refusal and exist nowhere. We know he
tried, what device he used and which ad he came from. We cannot call him back.

The immediate cause was that Cloudflare Turnstile produced no verification token in his
browser. The reason that mattered was a change we shipped nine days earlier which turned a
missing token into a hard rejection.

**The root cause was neither of those.** It was that we deployed a change capable of
refusing customers, to the only revenue path the business has, without measuring how many
legitimate submissions it would refuse and without any way to observe the refusals
afterwards. Site wide, **38% of real visitors who were challenged never produced a token**,
and every one of them was turned away silently for nine days.

The only detector in the entire system was a customer choosing to phone the owner, and the
owner choosing to chase it twice.

---

## A note on redaction

**This repository is public.** Customer IP addresses, email addresses, phone numbers, names
and the ad click id have been redacted throughout. Two real customers appear as "customer A"
(Oldsmar) and "customer B" (Palm Harbor); neither is the person this incident is about.

The unredacted values are in the D1 `leads` table and in Cloudflare's logs, which is where
they belong. If you are reconstructing the timeline, join on the timestamps, which are exact.

Redacting this was itself a near miss. The first version of this commit carried both customers'
full IP addresses to a public GitHub repo, and `emails/email-reports/` was sitting untracked
and unignored with raw lead emails in it. Both were caught before anything was pushed. That is
the same class of error as the incident: something quietly one step away from causing harm,
with nothing in the process set up to notice.

---

## Read in this order

| File | What it covers | Read it when |
|---|---|---|
| [`01-what-happened.md`](01-what-happened.md) | The forensic account: timeline, evidence, which instrument proved what, and an honest record of the two hypotheses I chased that were wrong | You want the facts, or you are debugging something similar and want the investigation method |
| [`02-why-it-happened.md`](02-why-it-happened.md) | The three stacked mechanisms, the decision chain that produced them, and why carefully argued code comments still got it wrong | You want to understand the failure well enough to predict it elsewhere |
| [`03-options-considered.md`](03-options-considered.md) | Six decision points with the rejected alternatives argued properly first | You are making the same calls on a new project |
| [`04-implementation.md`](04-implementation.md) | What actually shipped, read off disk rather than from a summary, with every verification output | You are reimplementing this, or auditing what we did |
| [`05-known-gaps.md`](05-known-gaps.md) | Fourteen things the patch does not fix, ordered by likelihood of costing a lead | Before you assume this is finished. It is not |
| [`06-prevention.md`](06-prevention.md) | Eight principles that generalise past this stack and past Turnstile | You are about to ship anything that can reject a user |
| [`07-day-one-checklist.md`](07-day-one-checklist.md) | The build list for the next project, grouped and tickable | Starting a new lead capture site |
| [`08-storage-decision.md`](08-storage-decision.md) | R2 versus D1 for the write ahead log. Three analyses, one hands on spike, and the failure modes that decided it | Choosing where an audit log lives on Cloudflare |
| [`09-measurement-and-monitoring.md`](09-measurement-and-monitoring.md) | The reproducible baseline, runnable queries, the traps in each instrument, and the monitoring that should exist | Proving a fix worked, or building observability from scratch |
| [`10-privacy-and-retention.md`](10-privacy-and-retention.md) | What the data actually contains, which laws reach a business this size, retention, and the two near misses | Before storing customer data anywhere, especially in a public repo |
| [`REFERENCES.md`](REFERENCES.md) | Every external source used, grouped by topic, with what each establishes | You need the citation without rereading the argument |

---

## The five things worth remembering

**1. A gate on a revenue path needs a measured false positive rate before it goes live.**
The 38% was measurable the whole time. Nobody measured it. The change shipped on reasoning,
and the reasoning was good, and it was still wrong. Ship gates in log only mode first.

**2. A rejection path must never discard what the user typed.**
The cost asymmetry decides it. A captured spam row costs Barbara ten seconds. A discarded
real lead costs the mean website job value, which for this client is $2,330. That is a ratio
of roughly one to eight thousand. There is no version of that arithmetic where discarding
wins.

**3. Comments record intent. Only telemetry records behaviour.**
The comments in `app/api/contact/route.ts` are the most carefully argued in the codebase.
They explicitly reasoned about a real customer arriving with no token. They built a mechanism
to distinguish that case. And they still landed on a policy that refused 38% of challenged
visitors, because the argument had two cases in it, attacker and outage, and reality had a
third: our own widget failing to mount for an honest person. Prose confidence and empirical
confidence look identical on the page.

**4. Verify at the layer the user experiences.**
`pnpm build` was green. TypeScript was green. `next start` served the form correctly. The
only thing that found this was driving a real browser through a client side navigation and
counting widget mounts. This is the second time on this project that a green build hid a
production failure; the first was `dynamicParams` 404ing an entire route on the Worker.

**5. Validate the instrument before trusting a null.**
This investigation produced four false nulls: an OAuth token with no observability scope, an
adaptively sampled query returning 0 events then 14 on a re-run, a Turnstile endpoint
rejecting both available credentials, and a zone settings API that is still unread. Each one
would have read as "nothing happened" to anyone who did not check that their query worked on
a known good case first.

---

## What this cost, stated plainly

- Six refused submissions from one visitor, arriving on a **paid Google Ads click**
  (campaign `23089568597`).
- One customer permanently unrecoverable from our side. Only the voicemail on Jason's phone
  can reach him.
- An unknown number of other refusals between 3 and 12 August. Unknowable by construction,
  because refusals wrote nothing anywhere.
- Nine days of a 38% refusal rate on the business's sole inbound web channel.

---

## Status at the time of writing

Fixed and deployed:

- Turnstile widget switched from **Managed** to **Non-Interactive** (dashboard, no deploy).
- Explicit widget rendering, so the form works after a client side navigation.
- Refused submissions captured to a quarantine table instead of discarded.
- The retry race closed.
- Two silent office email losses fixed (`replyTo` validation, widened idempotency key).

**Decided since, with the research recorded rather than repeated:**

- **The write ahead log goes in D1, not R2.** The monthly plain text file is a derived export. Three
  analyses ran and disagreed; a hands on spike settled it on failure modes, not performance. R2's
  `put` silently discards on key collision, its compaction job destroyed a real record on the first
  race test, `wrangler` cannot list R2 objects at all, and one null byte makes an entire month
  unsearchable by grep while `file` still calls it ASCII text. See
  [`08-storage-decision.md`](08-storage-decision.md).
- **The 62% solve rate in these documents is a dashboard figure and is not reproducible via the
  API.** The reproducible baseline is **68.5% solved, 31.5% refused**. Comparing a fresh API number
  against 62% would invent a six point improvement out of a methodology difference. See
  [`09-measurement-and-monitoring.md`](09-measurement-and-monitoring.md).
- **Retention should be 90 days**, matching the click id lifetime already justified in
  `middleware.ts`, and the privacy policy's unconditional deletion promise is the one clean self
  inflicted liability in it. See [`10-privacy-and-retention.md`](10-privacy-and-retention.md).

**Not yet done, and the reason `05-known-gaps.md` exists:**

- `UNVERIFIED_ALERT_TO` is unset, so `alertTo: false` in production. Refusals are captured
  but nobody is told, and because `captured` is computed as `id !== null && alerting`, the
  visitor still sees the red error rather than the calm card. **The customer facing half of
  the fix is dormant.**
- Nobody reads `unverified_leads`. A quarantine table with no reader is only marginally
  better than a discard.
- No post deploy measurement of whether the 38% actually moved.

---

## A note on who found this

Jason found it. He listened to a voicemail at one in the morning, emailed, and when nothing
had visibly changed by breakfast he emailed again. His second message, sent at 7:16am, landed
four minutes after the customer's final failed attempt at 7:12am.

If he had only sent the first email, or accepted a reassuring answer, this would still be
running. A client who reports a problem twice is doing free monitoring for you. The correct
response is to make it easier for them to do, not to build a system that depends on it.
