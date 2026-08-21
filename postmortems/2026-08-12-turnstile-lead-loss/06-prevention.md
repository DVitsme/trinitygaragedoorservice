# 06 · Prevention: how this class of failure gets caught before a customer finds it

**Summary.** On 3 August 2026 a security fix made a missing Turnstile token a hard rejection. It was correct on its own terms and closed a real spam bypass. It also turned the only lead form the business has into one that could refuse a real person and keep no record of them, and nobody noticed for nine days. Turnstile's own dashboard had the number that would have exposed it sitting in plain sight the entire time: 38 percent of challenged real browsers never produced a token. The failure was not a bug in the ordinary sense. It was a change to a gate on the revenue path, shipped on the strength of careful reasoning rather than a measurement, with no way to observe its effect and no detector other than the client telephoning the owner. Every principle below is written to prevent that specific shape of mistake, and none of them are about Turnstile.

---

## 1. Never ship a change that can refuse a revenue action without first measuring the refusal rate

This is the whole post-mortem in one line.

A gate on a conversion path is not a normal code change. It has a false positive rate, that rate is a property of the real world rather than of your code, and you cannot reason your way to it. You have to measure it.

**What happened here.** Commits `4cb5cc1` and `1142198` changed a missing Turnstile token from "accept" to "reject". The reasoning in the commit and in the code comments was genuinely good: an attacker controls whether a token is present, an attacker does not control whether Cloudflare is up, therefore fail closed on the former and open on the latter. That reasoning is correct. What nobody asked was the empirical question sitting underneath it:

> How many real customers arrive without a token?

The answer, measurable at any point in the preceding week and measured after the fact from `turnstileAdaptiveGroups`, was **38 percent**. 141 challenges issued to real browsers between 6 and 12 August, 87 solved. Every one of the other 54 would have been refused.

**The rule.** Before any gate on a conversion path goes live:

1. Compute the verdict.
2. Do not act on it.
3. Log it.
4. Wait until you have enough real traffic to be meaningful.
5. Count how many submissions you *would* have refused, and inspect them by hand.
6. Only then decide whether to enforce.

**What that would have cost here.** One boolean, one log line, and a week. The route already called `verifyTurnstile` and already had the verdict in a variable. Turning that into a shadow deployment was a two line change:

```ts
const verdict = await verifyTurnstile(secret, data.token, ip);
if (verdict === "reject") {
  console.warn("[contact] WOULD REJECT", { codes, source: data.source });
  // and then carry on as though it passed
}
```

A week of that produces a number. The number decides the policy. Instead the policy was decided by an argument, and the argument was right about attackers and silent about customers.

**Generalise it.** This applies to every gate, not just spam gates:

| Gate | The false positive you must measure first |
|---|---|
| Bot / CAPTCHA check | Real humans who fail it |
| Rate limiting | Legitimate bursts, shared IPs, offices behind one NAT |
| Field validation | Real world formats you did not anticipate |
| Fraud scoring | Good customers scored bad |
| Geo or IP blocking | Customers on VPNs, corporate proxies, mobile carrier CGNAT |
| Email verification | Valid addresses your regex rejects |
| WAF rules | Anything with an apostrophe in it |

In every row, the cost of a false positive is a lost customer and the cost of a false negative is an annoyance. They are not symmetric, and the asymmetry should be reflected in how much evidence you demand before switching a gate to enforcing.

---

## 2. Shadow mode is the standard rollout for any gate, not a special case

Principle 1 says measure first. This is how you build the capability so that measuring first is the path of least resistance rather than an extra task somebody skips under deadline.

**Every gate ships with a three state switch from day one.**

```ts
type GateMode = "off" | "log" | "enforce";
```

| Mode | Verdict computed | Verdict acted on | Verdict logged | Use |
|---|---|---|---|---|
| `off` | no | no | no | local dev, incident rollback |
| `log` | yes | **no** | yes | default for the first N days of any new or changed gate |
| `enforce` | yes | yes | yes | only after the numbers justify it |

**Implementation notes that matter:**

- **The switch lives in version control, not in an environment variable.** This project already learned that lesson with `BOOKING_MODE` in `lib/booking.ts` and with the GTM id, for the same reason: `NEXT_PUBLIC_*` is inlined at build time, so a build that missed the variable ships the wrong behaviour with no error. A hardcoded constant that must be edited, committed and reviewed cannot be silently absent. Runtime secrets are for values, not for behaviour.
- **Log the verdict with enough context to triage it.** The error codes, the source, and whether the submission looked reachable. In this incident the code logged `[contact] Turnstile rejected the token: ["missing-input-response"]`, which was excellent and is the single reason the investigation resolved in hours rather than days. What it did not log was the submission itself, which is principle 3.
- **Log in `log` mode too, in exactly the same shape.** The point is that flipping to `enforce` changes nothing about your observability.

**What you look at before advancing from `log` to `enforce`:**

1. The refusal rate as a percentage of total submissions.
2. The refusal rate as a percentage of submissions that *look human* (has a reachable phone or email, plausible message, non hosting ASN).
3. A hand read of every refused submission in the window. At this business's volume, roughly one genuine submission every 1.6 days, that is a handful of rows and takes ten minutes.
4. Whether the refusals cluster on anything: a browser, a device class, a referrer, a time of day, an entry path.

Point 4 is the one that would have caught this incident before it happened, because the cluster was real and visible: mobile browsers reaching the form by client side navigation.

---

## 3. A rejection path must never discard user input. This one is absolute

There is no version of this that is a judgement call.

**The cost asymmetry is the entire argument.** At Trinity:

- A captured spam row costs somebody about ten seconds to glance at and ignore.
- A discarded real lead costs the mean website job value, **$2,330**. Website leads run about 2.7 times the median job.

That is a ratio of roughly one to eight thousand. There is no plausible spam volume at this business's scale, five junk rows in eleven days, at which discarding beats capturing. The maths does not become close. It does not become close at a hundred times the spam volume.

**What happened here.** Every gate in `app/api/contact/route.ts` returned before `storeLead()` and `sendEmail()` were reached. A refused submission read the visitor's name, phone, email, zip and message off the request and threw all of it away. Six submissions from one real customer produced **zero rows in D1 and zero records in Resend**. We know his town, his phone model, his ISP and the second he pressed the button. We do not know his name or his number. He is unrecoverable from our side.

**The rule.** Persist first, judge second. In order:

1. Read and normalise the submission.
2. **Write it somewhere durable.**
3. Run the gates.
4. Promote it, quarantine it, or leave it quarantined.

**Quarantine, do not tag.** Write refused submissions to a separate table rather than adding a `status` column to the real one. The reasoning generalises well beyond this project:

- Everything downstream already reads the main table meaning "this is real". A CRM sync, a client facing export, a dashboard, an ad platform upload. Every one of them now needs a filter, and the one that forgets is the one that pushes spam into a system you cannot easily clean. Here that system is Housecall Pro, which holds 6,000 real customers and has **no DELETE endpoint**.
- If a quarantined row carries an id in the real table, any interlock keyed on that id is one careless edit away from being wrong. A separate table makes the mistake structurally impossible rather than merely discouraged.
- Retention differs. Real leads are kept forever. Refusals should prune, and nobody should ever be writing a `DELETE` against the real leads table.

**Name it for the failure you are guarding against, not for what you assume the rows are.** The table here is `unverified_leads`, not `spam`. Whoever opens it should start from "this person may be waiting for a call", because that is precisely the case it exists to catch. A table called `spam` gets ignored, which recreates the bug one level up.

**Bound the abuse surface, and say so out loud.** A capture path does I/O where the refusal path previously did none, so it shares a write budget with your real data. Bound it: only write when the submission carries a reachable phone or email, cap free text length, and prune on a schedule. Then note explicitly that this bounds the damage from a flood but does not prevent one, and put real rate limiting on the list.

---

## 4. Verify at the layer the user experiences

Everything green, form dead.

**What said this form worked, right up until a customer said otherwise:**

| Signal | Verdict | Why it was blind |
|---|---|---|
| `pnpm build` | green | Compiles the code, never runs the widget |
| `tsc` typecheck | green | The widget's absence is not a type error |
| `pnpm lint` | (in fact broken, see below) | Would not have caught it anyway |
| `next start` + direct page load | worked | The one path that was never broken |
| Cloudflare dashboard | all configured | Configuration was correct throughout |
| `GET /api/contact` health check | all true | Reported that a secret existed, not that it worked |
| Code review of the diff | reasoning correct | The bug is an interaction, not a line |

**What actually found it:** driving a real browser through a client side navigation and counting widget mount attempts.

```
A. hard load of /get-service/          mounts: 1
B. click through to /get-service/repair/  mounts: 0   <- dead form
C. click away and back                  mounts: 0   <- dead form
```

That test takes about forty lines of Playwright and thirty seconds to run. It was the difference between an explanation and a guess.

**This project has now been bitten by the same principle twice.** The other time is recorded in the `opennext-dynamicparams-404` memory: `export const dynamicParams = false` made `pnpm build`, `tsc` and `next start` all green while every one of eight routes returned 404 on the actual Cloudflare Worker. Only `pnpm preview`, which runs the real `workerd` runtime, caught it.

**The rule, stated generally:** the further your verification is from the user's actual runtime, the less it proves. Rank your checks honestly:

1. **A real browser against the real runtime.** Proves the most. `pnpm preview` plus Playwright here.
2. **A real browser against a near runtime.** `next start` plus Playwright. Misses platform differences.
3. **The real runtime without a browser.** `pnpm preview` plus curl. Misses everything client side, which is where this bug lived.
4. **A build.** Proves it compiles.
5. **A type check.** Proves the types agree with each other.

For anything on the revenue path, you need level 1. For this codebase specifically, `next start` being green is not sufficient evidence for a Cloudflare deploy, and a build being green is not sufficient evidence for anything a user touches.

**And do the navigation, not just the load.** The single highest value addition to this project's QA is that the browser check must *click* rather than only *visit*. Every existing screenshot QA recipe in `.claude/skills/verify-page` loads a URL directly. Every one of them would have passed on a form that could not be submitted.

---

## 5. Validate the instrument before you trust a null result

An empty result has at least three meanings and only one of them is "nothing happened".

**This investigation produced false nulls repeatedly:**

| Empty result | What it actually meant |
|---|---|
| Turnstile widget config returned `Authentication error` | The wrangler OAuth token has no Turnstile scope. The data was there. |
| Workers Logs query returned 0 events | **Adaptive sampling.** The identical query re-run immediately returned 14. |
| Zone settings returned `9109 Unauthorized` | Missing permission, not missing configuration. Still unread today. |
| No D1 rows for the failed attempts | This one was true, and it was only trustworthy because the same query returned the two known good leads. |

Look at the last row. That is the pattern. The D1 null was believable **because the same query, over the same window, returned two records we already knew existed**. The instrument proved itself on a known good case before we accepted its answer on the unknown one.

**The rule.** Before concluding "there is nothing there":

1. Run the same query against a case where you already know the answer.
2. If it returns the known good result, your null is evidence.
3. If it does not, you have an instrument problem, not a data problem.

**Corollaries worth internalising:**

- **A 404 on an unfamiliar API proves nothing about whether the resource exists.** This project already wrote that down about the Housecall Pro API, where root level probes 404ed and the real endpoints were nested under `/company/`. The same trap recurred here with the Cloudflare observability endpoints.
- **Sampled telemetry lies quietly.** Cloudflare's analytics adaptively sample, and the sampling is invisible in the response shape. Chunk wide time ranges into smaller ones and cross check totals. A single query over a three day window is not a measurement.
- **Say which it was in your write up.** "Unread" and "clear" are different findings. This post-mortem still records the zone WAF settings as *unread*, not as *clear*, because the credential was refused. That honesty is what stops a future reader treating a gap as a check.

---

## 6. Third party widgets in a client side routed app are their own hazard class

This is the mechanism that actually broke the form, and it generalises much further than CAPTCHAs.

**The pattern.** A vendor script scans the DOM for its mount points **once, when the script executes**. Your framework then swaps the page contents without a document load. The script never runs again. The container is present, the vendor's global is present, and nothing connects them.

**How it presented here.** Turnstile's implicit rendering scans for `.cf-turnstile` on load. `next/script` dedupes by `src`, so navigating from one form page to another never re-executed `api.js`. The div rendered, `window.turnstile` was defined, and the widget did not exist. The form then posted with an empty token field, and the hardened gate refused it.

The telemetry showed the fingerprint clearly once we knew to look:

- The lost customer: **7 page loads, 2 challenges issued.**
- A different visitor: **2 page loads, 15 challenges issued.**

Neither ratio is 1:1, and neither is close.

**The diagnostic, and it is cheap.** For any third party widget on a critical path, compare **initialisations to page views**. If widget mounts do not track page views, the widget is broken on some navigation path. You can read this off most vendors' own dashboards without instrumenting anything. Nobody looked.

**Others in the same family.** Assume every one of these is broken on soft navigation until you have watched it work:

| Widget class | Typical failure |
|---|---|
| CAPTCHA / bot checks | No token, submissions refused |
| Analytics auto tracking | Page views undercounted, funnels wrong |
| Chat / support widgets | Absent on the page where someone needed help |
| Payment iframes (Stripe Elements, PayPal buttons) | Checkout renders empty |
| Ad slots | Unfilled inventory, lost revenue |
| Consent management platforms | No banner, and a compliance problem |
| Lazy image / video loaders | Blank media below the fold |
| Review and social embeds | Missing trust content |
| Heatmap and session recording | Silent partial coverage |

**The fix pattern is always the same shape.** Prefer the vendor's **explicit** rendering API over implicit auto scanning, drive it from a mount effect, make it idempotent, and clean up on unmount. In this codebase that meant `api.js?render=explicit`, an idempotent `turnstile.render()` driven from `next/script`'s `onReady` rather than `onLoad`, a readiness poll as a backstop, and `turnstile.remove()` on unmount.

**One detail worth carrying forward:** `onLoad` fires on the load event and **does not fire again** when the component remounts in the same document. `onReady` does. If a vendor integration hangs off `onLoad`, it is broken on client side navigation by construction.

---

## 7. Comments record intent. Only telemetry records behaviour

This one is uncomfortable, because this codebase's commenting is genuinely excellent and the comments are part of why it went wrong.

**Read what was sitting in `contact-form.tsx` throughout the incident:**

> The client still does NOT block on a missing token; the server decides. What changed on 2026-08-03 is the server's answer: in production a missing token is now a REJECT.
>
> Which makes the reset below load bearing. A `cf-turnstile-response` is redeemed exactly ONCE. If the server rejects and the visitor presses submit again, the browser still holds the spent token and Cloudflare answers `timeout-or-duplicate`, so a real customer would be locked out by their own retry. Every path that lets them retry has to mint a fresh token first.

That comment identifies the exact risk, names the exact failure mode, and explains the mitigation. It is better than most production code ever gets. And it is **wrong in a way that mattered**: the reset does clear the token synchronously, so the replay it worried about could not happen. What it created instead was a roughly 2.1 second window in which the field is empty. Measured:

```
before reset()        21 chars
immediately after      0 chars   <- a submit here posts nothing
repopulated after   2082 ms (WebKit) / 2215 ms (Chromium)
```

The customer's three submissions at 21:39:48, 21:39:50 and 21:39:51 all landed inside it. He was locked out by his own retry after all, through the door the comment was not watching.

**The lesson.** A well argued comment feels like evidence and is not. It is a record of what somebody believed at the time. In a codebase that comments this carefully there is a specific trap: the quality of the prose raises everyone's confidence, including the author's, and confidence substitutes for measurement.

**The rule.** When a comment makes a claim about runtime behaviour, one of two things has to be true:

1. There is a test or a measurement that proves it, referenced from the comment, or
2. The comment says explicitly that it is an assumption and names how you would check it.

Applied to the comment above, that would have read: *"Assumption: `turnstile.reset()` mints a replacement synchronously. Not verified. If it does not, a retry inside the gap posts an empty token."* That sentence would have been enough for anyone to spend the five minutes that measures it.

**A smaller instance of the same thing, and it went on to prove the principle twice over.**

> **Resolved 2026-08-13, after it cost real data.** The first fix added `NODE_ENV === "production"`
> to the guard and was recorded as closed. It did not work, because `next start` and `pnpm preview`
> both set `NODE_ENV=production` and those are the two commands used for visual QA here. Roughly ten
> headless page loads then fired real pageviews into the client's container. Tags are now OFF by
> default and only the `deploy` and `upload` scripts turn them on. Full account in
> [`05-known-gaps.md`](05-known-gaps.md) under gap 14. The paragraph below is left as written,
> because it was accurate when written and it is the better illustration of the principle.

**A smaller instance of the same thing, still live.** `app/layout.tsx` carries a comment saying GTM is "Off in local dev and in any build that sets `NEXT_PUBLIC_GTM_DISABLE`". The first half is simply false: there is no dev guard, only the variable, and that variable is set **nowhere in the repository**. Every local build fires real Google Ads conversions into the client's live account unless somebody remembers a flag that is not written down. The comment describes the intent perfectly and the code has never done it.

---

## 8. "A customer phones the owner" is not monitoring

**The detection chain for this incident, in full:**

1. A customer failed six times over eleven hours.
2. He left a voicemail.
3. Jason listened to it and emailed at 01:57.
4. Nothing happened.
5. The same customer failed again at 07:12.
6. Jason emailed again at 07:16, pushing harder.
7. Investigation began.

Every link in that chain is a person choosing to make an effort on our behalf. Remove any one and the form is still broken today, still refusing 38 percent of challenged visitors, and still silent.

**Be honest about what that means.** The form had been in this state for nine days. In that window it captured five genuine leads. We have no idea how many it refused, because the refusals were discarded, and that number is permanently unknowable. That is the real cost of principle 3: not just the leads lost, but the fact that we can never quantify them, which also means we can never prove to the client that it is fixed.

**What monitoring actually requires.** Three independent things, and they are not substitutes:

| Layer | Question it answers | Failure it catches |
|---|---|---|
| **Liveness** | Is the endpoint up and correctly wired? | Deploy broke something, migration missing, secret unset |
| **Behaviour** | Does a submission actually succeed end to end? | The pipeline is up but produces nothing |
| **Anomaly** | Is the outcome distribution normal? | Refusal rate climbing, solve rate dropping, volume gone |

This project now has the first, in the `?deep=1` health check. It does not yet have the second or third. The second is hard here because a synthetic submission emails real people and could reach a CRM with no delete. The third is hard because at one lead every 1.6 days, a 48 hour silence is a normal Tuesday and any threshold you pick either cries wolf or sleeps through the outage.

**Which is why, at this volume, the alert has to be on the failure rather than on the absence.** Do not try to detect "no leads arrived". Detect "a submission was refused", which is a discrete event with a timestamp, and put the customer's details in the alert so the alert is also the recovery. That is the design that fits a low volume business, and it is what the patch implements.

**One more honest note.** The Turnstile analytics dashboard has been showing a 62 percent solve rate since 3 August. It is two clicks from the Cloudflare home page. Nobody opened it, because nobody had a reason to and nothing pointed there. Monitoring is not only about having the data. It is about something putting the data in front of you when it changes.

---

## 9. Every rejection must name its cause to the person who can fix it

Added 2026-08-21 after applying this document elsewhere; see
[`11-applied-to-a-second-site.md`](11-applied-to-a-second-site.md) §4.

Principles 1 through 8 are thorough about making refusals visible to the OPERATOR: capture,
alerting, logs, counters. They say nothing about making them actionable for the VISITOR, and both
sites failed on exactly that. This incident told a customer to "refresh and try again" for a
failure that was deterministic for him. The second site said "check the highlighted fields" while
highlighting none, on a form whose server was computing field-level errors, returning them in the
response, and rendering them nowhere.

The test: for every rejection your form can emit, can the person who received it identify what to
change? If the answer is no, the refusal is silent from their side even when it is fully logged on
yours, and they leave. A refusal the operator can see and the visitor cannot act on is still a lost
lead.

---

## The short version

If you remember nothing else from this document:

1. **Measure the false positive rate of any gate before you enforce it.** Shadow mode, one week, count what you would have refused.
2. **Never discard user input on a rejection path.** Quarantine it. The cost asymmetry is not close.
3. **Test the navigation, not just the page load.** Click through to the form the way a customer does.
4. **Prove your instrument on a known good case before trusting a null.**
5. **Count third party widget initialisations against page views.**
6. **A comment is not a measurement, however well argued.**
7. **If the only detector is the client, you have no detector.**
8. **Every rejection must tell the visitor what to change**, not just tell you that it happened.
