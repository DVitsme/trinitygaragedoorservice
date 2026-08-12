# 01 - What happened

**Summary.** On the evening of 11 August 2026 a homeowner in Wesley Chapel clicked a Google Ads link that Trinity paid for, browsed five pages including the service area page for his own town, and tried six times across eleven hours to send a repair request. Every attempt was rejected with HTTP 400 by our own spam gate, because the Cloudflare Turnstile widget never produced a verification token in his browser. The rejection path returned before anything was written to disk, so his name, phone number, email and message were discarded. We have no way to contact him. The regression that caused this shipped nine days earlier, on 3 August, in two commits that were correct about the spam problem they were solving and wrong about the collateral damage. Site wide, Turnstile analytics for 6 to 12 August show 141 challenges issued to real browsers and 87 solved: **38 percent of challenged real visitors were producing no token**, and since 3 August every one of them had been refused.

---

## 1. How the report arrived

Two emails from Jason, the owner, on the morning of 12 August. Verbatim:

**01:57 EDT:**

> Also just heard a customers voicemail they said they tried sending a request online and it came back. They sent around 9:30-9:45pm. Please advise

**07:16 EDT:**

> This same guy tried it again this morning and it didnt go through. Please correct as we might be losing work. Thank you

Two details about this report matter more than they look.

**"It came back" was ambiguous and nearly sent the investigation sideways.** A non technical caller relaying a problem to their contractor could mean the form returned an error, or could mean an email they sent bounced. Both readings were live for the first hour. The bounce reading was eventually eliminated by the Resend API (18 emails sent lifetime, all delivered, zero bounces ever recorded) and by the fact that the site sends the customer nothing at all, so there was never an address for them to reply to. But it consumed a whole agent to close, and it was worth closing rather than assuming.

**The framing pointed at the wrong customer.** Derrick had saved the two lead emails that bracketed the failure window and noted that a lead came in before and after. The natural inference, which I made, was that the complainant was one of those two people, most likely the second, who arrived at 08:10 EDT shortly after the failed morning attempt. That was wrong. Both bracketing leads were unrelated customers who submitted successfully on their first try. The actual complainant never appears in any database, which is precisely the point of the incident. See section 6.

---

## 2. Timeline

All times below are given as `UTC / EDT`. EDT is UTC minus four. Every line is drawn from a system of record, not reconstructed.

### Tuesday 11 August

| UTC | EDT | Event |
|---|---|---|
| 15:55:19 | 11:55 | Deploy, Worker version `37183998-7290-4077-9021-908e33c1bfa0` |
| 18:41:43 | 14:41 | `POST /api/contact` **200**. Lead captured: customer A, Oldsmar, "Door will not open", source `repair-form`, Windows Chrome. D1 row id 19. Lead email delivered to both office inboxes. |

### The first session

| UTC | EDT | Event |
|---|---|---|
| 01:33:00 | 21:33 | Visitor lands on `/` from a **paid Google Ads click** |
| 01:33-01:37 | 21:33-21:37 | `/` → `/about/our-story/` → `/service-areas/` → `/service-areas/wesley-chapel/` → `/get-service/` |
| 01:36, 01:37 | 21:36, 21:37 | Reloads `/get-service/` |
| **01:37:26** | **21:37:26** | `POST /api/contact` **400**, body 244 bytes |
| **01:37:42** | **21:37:42** | `POST /api/contact` **400**, body 244 bytes |
| 01:37:46 | 21:37:46 | Reloads `/get-service/` again. This is him following the instruction in our own error message. |
| 01:39 | 21:39 | Moves to `/get-service/repair/` |
| **01:39:48** | **21:39:48** | `POST /api/contact` **400**, body 302 bytes |
| **01:39:50** | **21:39:50** | `POST /api/contact` **400**, body 302 bytes |
| **01:39:51** | **21:39:51** | `POST /api/contact` **400**, body 302 bytes |
| ~01:40 | ~21:40 | Gives up |
| 03:20:43 | 23:20 | Deploy, Worker version `bb0ff638-423d-4917-8bb7-905200881ba7`. Unrelated (a homepage photo swap). |

### Wednesday 12 August

| UTC | EDT | Event |
|---|---|---|
| 05:57 | 01:57 | Jason's first email |
| 11:09:58 | 07:09:58 | Same visitor returns from Google onto `/get-service/repair/`, browses three minutes |
| **11:12:47** | **07:12:47** | `POST /api/contact` **400**, body 202 bytes. Sixth and final attempt. |
| 11:16 | 07:16 | Jason's second email, four minutes after the attempt |
| 12:10:02 | 08:10:02 | `POST /api/contact` **200**. Lead captured: customer B, Palm Harbor, spring repair, source `contact-form`, macOS Safari. D1 row id 20. **A different person.** |

Jason said "around 9:30-9:45pm". The attempts were at 21:37 and 21:39. He said "this morning" in an email sent at 07:16; the attempt was at 07:12:47. The match is to the minute in both cases, which is what confirmed this visitor was the complainant.

**Deploys are not the variable.** Failures span both Worker versions (five on `37183998`, one on `bb0ff638`) and so do successes (customer A on `37183998`, customer B on `bb0ff638`). Whatever caused this was live on both.

---

## 3. The evidence

### The log line

Every one of the six rejections emitted the same line from `verifyTurnstile` in `app/api/contact/route.ts`:

```
[contact] Turnstile rejected the token: [ 'missing-input-response' ]
```

`missing-input-response` is Cloudflare's code for "the `response` field of your siteverify call was empty". It is not `invalid-input-response` (a malformed or forged token), not `timeout-or-duplicate` (an expired or already redeemed token). It means the browser sent **nothing**.

This was confirmed independently against the live siteverify endpoint with the real production secret:

```
$ curl -s -X POST https://challenges.cloudflare.com/turnstile/v0/siteverify \
       -d "secret=$TURNSTILE_SECRET_KEY" -d "response="
{"error-codes":["missing-input-response"],"success":false,"messages":[]}
```

### The request body sizes

An independent corroboration that needs no interpretation. A Turnstile token is roughly a kilobyte of text, so its presence or absence is visible in the content length of the POST:

```
failed    244  244  302  302  302  202   bytes
succeeded  1003  1018  1135  1187        bytes
```

The four successes in the retention window are 1003 to 1187 bytes. The six failures are 202 to 302. The token is simply not in those payloads.

Note also the internal structure of the failures: `244, 244` from `/get-service/`, then `302, 302, 302` from `/get-service/repair/`. The 58 byte jump is him adding text to the message box between the two pages. He was editing his enquiry and trying again, not hammering a button at random.

### The device

Verbatim user agent on all six failing requests:

```
Mozilla/5.0 (iPhone; CPU iPhone OS 26_6_0 like Mac OS X) AppleWebKit/605.1.15
(KHTML, like Gecko) CriOS/151.0.7922.112 Mobile/15E148 Safari/604.1
```

An iPhone on iOS 26.6 running Chrome for iOS 151. IP `47.197.x.x`, AS5650 (Frontier), Wesley Chapel, Florida.

For contrast, the macOS Safari user who succeeded at 12:10:02 and who I wrongly believed was the complainant:

```
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15
(KHTML, like Gecko) Version/26.6 Safari/605.1.15
```

### Turnstile analytics

`turnstileAdaptiveGroups`, 15 minute buckets, filtered to the failing IP and device:

```
2026-08-12T01:30Z  x2  challenge_issued   Chrome Mobile iOS/151  iOS  apex  asn5650  47.197.x.x
                        ^^ ZERO solved events in this bucket
2026-08-12T11:00Z  x1  challenge_issued   Chrome Mobile iOS/151  iOS  apex  asn5650  47.197.x.x
2026-08-12T11:00Z  x1  challenge_non_interactive_solved
2026-08-12T12:00Z  x4  challenge_issued   Safari/26  Mac OS X  apex  47.202.x.x
2026-08-12T12:00Z  x1  challenge_interactive_solved
2026-08-12T12:00Z  x1  challenge_interactive_siteverify_solved   <-- the captured lead
```

`challenge_issued` is a **server side** Cloudflare event. Its presence proves that `api.js` loaded, the widget mounted, and it successfully reached `challenges.cloudflare.com`. That single fact eliminates every "something blocked the script" hypothesis at once.

One honest ambiguity, recorded rather than papered over: the `challenge_non_interactive_solved` event in the 11:00Z bucket. Either it belongs to a different visitor in the same 15 minute window, or it belongs to him and he submitted a few seconds before his own token landed. The telemetry cannot separate those. It does not change the diagnosis, and it strengthens the argument for making the client wait for a token rather than posting hopefully.

### Site wide rates

Turnstile solve rates 6 to 12 August, excluding AdsBot, Googlebot, HeadlessChrome and other automated traffic:

| Cohort | Issued | Solved | Rate |
|---|---|---|---|
| Chrome Mobile WebView / Android | 42 | 34 | 81% |
| Chrome Mobile / Android | 28 | 8 | 29% |
| Chrome / Windows | 21 | 9 | 43% |
| Mobile Safari / iOS | 13 | 10 | 77% |
| Facebook in-app / iOS | 11 | 11 | 100% |
| Mobile Safari WKWebView / iOS | 9 | 7 | 78% |
| Safari / Mac OS X | 4 | 1 | 25% |
| **All real browsers** | **141** | **87** | **62%** |

A warning for anyone reading the raw dashboard later: the 28 day solve rate reads about 9 percent, and that number is an artefact. 11,343 of 12,765 challenges in that period came from `HeadlessChrome / Linux` with zero solves between 29 July and 5 August, which is the `launch-audit` tooling, plus a Chrome/Windows beacon solving 12 to 13 per hour around the clock that never submits anything, which looks like an uptime monitor. Use 6 August onward. The honest real browser figure is 62 percent.

### The navigation path and the paid click

The landing request at 01:33:00Z carried:

```
referer: https://www.google.com/
?gad_source=1
&gad_campaignid=23089568597
&gclid=Cj0KCQ...[click id redacted]
```

This was a paid click. Trinity spent money to put this person on the site, `middleware.ts` correctly captured the `gclid` into a first party cookie so the lead could later be attributed to the click, and then the form refused him six times and threw the cookie away along with everything else. In Google Ads this appears as a click with no conversion and no explanation.

The `01:37:46` reload deserves its own mention. Our 400 response body said:

> We could not verify that request. Please refresh and try again, or call us at (813) 279-6785 and we will take the details over the phone.

He refreshed and tried again. He did exactly what we told him to do, and it could not work, because the failure was not transient.

---

## 4. Which instrument established which fact

This is the section to read first if a similar incident happens again. The order below is roughly the order of usefulness.

**Cloudflare Workers Logs, via the observability telemetry API.** This is what broke the case. `wrangler.jsonc` has `observability: { enabled: true }`, so the `console.warn` lines from the route were retained and queryable. Endpoint:

```
POST /accounts/{account_id}/workers/observability/telemetry/query
body: {queryId, timeframe:{from,to} in epoch MILLISECONDS, limit, view:"events",
       dry:false, parameters:{datasets:["cloudflare-workers"], filters:[...]}}
```

Three traps. First, **the wrangler OAuth token cannot read this**; it 403s the whole `/workers/observability/*` prefix, and `workers_tail:read` does not gate the product. What worked was a commented out `CLOUDFLARE_API_TOKEN` on line 16 of `.env.local`. Second, **the API adaptively samples**: an identical query returned 0 events on one run and 14 on the next. Chunk the window into one or two hour slices and cross check totals. A single empty result is not evidence. Third, retention is about three days, so this evidence expires. Pull it immediately.

**Cloudflare GraphQL analytics.** `https://api.cloudflare.com/client/v4/graphql`. `turnstileAdaptiveGroups` (account scope) gave the challenge and solve counts by device and IP. `httpRequestsAdaptiveGroups` (zone scope) gave status codes per path, unsampled for this volume. `firewallEventsAdaptive` cleared the WAF. Note the range caps: the zone dataset allows one day per query and the account Turnstile dataset one week, so both need chunked aliases. The `CLOUDFLARE_API_DNS_TOKEN` in `.env.local` is accepted here even though the wrangler OAuth token is not.

**D1, queried directly.** `npx wrangler d1 execute DB --remote --command "..."`. This proved the negative: nothing was written for the failed attempts. The decisive detail was `sqlite_sequence.seq` for `leads` equalling `MAX(id)` equalling 20, which proves no row was ever written and later deleted. Confirm the timezone before trusting any timestamp: `created_at` is `TEXT NOT NULL DEFAULT (datetime('now'))`, and `datetime('now')` and `datetime('now','localtime')` returned identical values, so everything is UTC.

**The Resend API.** `GET https://api.resend.com/emails`. 18 emails lifetime, all `delivered`, zero bounces. This closed the "it came back means a bounce" reading and independently confirmed the 17.5 hour gap between the two successful leads.

**The Turnstile widget configuration API.** `GET /accounts/{acct}/challenges/widgets/{sitekey}`. Returned `mode: "managed"` and `domains: ["trinitygaragedoorservice.com", "www.trinitygaragedoorservice.com"]`, which killed the hostname theory outright. Neither the wrangler OAuth token nor the DNS token can read this; only the broader `cfut_` token could.

**Local reproduction against a production build.** The mechanism itself was only ever going to be provable in a browser. Two measurements mattered, both run with Playwright against `pnpm build && next start`:

```
A. HARD load of /get-service/          widget MOUNT attempts: 1
B. SOFT nav to /get-service/repair/    widget MOUNT attempts: 0   <-- NEVER MOUNTED
C. SOFT nav away and back              widget MOUNT attempts: 0   <-- NEVER MOUNTED
```

and

```
token length before turnstile.reset(): 21
immediately after reset():             0
repopulated after:                     2082ms (WebKit) / 2215ms (Chromium)
```

The instrument for test B is worth stealing: `localhost` is not in the widget's allowlist, so every genuine mount emits `[Cloudflare Turnstile] Error: 110200` to the console. Counting those errors counts mount attempts. A failure mode became a measurement tool.

**Health endpoint.** `GET /api/contact` already reported configuration booleans. It said everything was fine, and everything *was* fine, because it only checked that the settings existed. See `05-known-gaps.md` and `07-day-one-checklist.md` on why that is not the same as checking they work.

---

## 5. False starts, honestly

I got the mechanism right in the end. I got the *subject* wrong twice, and both times I was confident. The reasoning failures are more instructive than the answer.

### False start one: desktop Safari

**What I claimed.** After the D1 dump came back, I told Derrick the standout finding was the browser: the successful 08:10 lead was on desktop Safari 26.6 on macOS, and it was the only Safari submission in the entire 13 row lead table. I wrote that this was "the shape of the answer" and that a browser specific failure explained why one visitor failed while Chrome users sailed through. I then redirected two running agents onto Safari specific mechanisms: bfcache restoring a spent token, ITP and storage partitioning, iCloud Private Relay causing a `remoteip` mismatch between token mint and siteverify.

**Why it was wrong.** The user agent I built all of that on belonged to customer B, in Palm Harbor, who submitted successfully on the first attempt and was never the complainant. I had inferred he was the complainant from circumstantial fit: he was an existing customer referencing a spring Trinity fitted two years earlier, exactly the kind of person who leaves a voicemail, and his submission landed 54 minutes after the second failed attempt. The D1 agent flagged this correctly, writing that the identification was "circumstantial evidence" and that the honest statement was that 12:10 was his *first successful* submission, not his third attempt. I read that caveat and proceeded on the inference anyway.

**What killed it.** The Workers Logs, which showed the six failures came from an iPhone running Chrome for iOS at a different IP in a different county. And the analytics, which showed Safari and WebKit solving Turnstile at 69 percent against Chrome's 57 percent. Safari was not merely innocent, it was performing better than average.

**Why it was seductive.** Because it was a real anomaly. One Safari lead out of thirteen genuinely is unusual looking, and browser specific Turnstile failures are a real and well documented class of bug. The pattern matched a plausible story so well that I stopped asking whether the premise was established.

**What would have killed it faster.** Getting the failing request's user agent before theorising about the succeeding request's user agent. The whole detour existed because I reasoned from the only user agent I had rather than waiting forty minutes for the one that mattered. The rule this teaches: **when the subject of an investigation is not yet identified, do not characterise them from adjacent data.** An unidentified subject is a blank, not a nearby record.

### False start two: www versus apex

**What I claimed.** I noticed that `https://trinitygaragedoorservice.com/contact/` and `https://www.trinitygaragedoorservice.com/contact/` both return 200 with no redirect between them, and that `wrangler.jsonc` binds the Worker to both. I reasoned that if the Turnstile widget's allowlist contained only one hostname, visitors on the other would get a widget that fails with error 110200 and mints no token, which produces exactly the `missing-input-response` signature we were seeing. I called this "a very strong hypothesis", said it "would explain everything", and sent it to two agents as the highest priority question in the investigation.

**Why it was wrong.** The allowlist contained both hostnames. Reading the widget config directly took one API call and about thirty seconds once the right credential was available:

```json
"mode": "managed",
"domains": ["trinitygaragedoorservice.com", "www.trinitygaragedoorservice.com"]
```

Independently, all six failures were on the apex, and the single `www` submission in the logs *succeeded*. And the decisive pair: a 400 at 11:12:47Z and a 200 at 12:10:03Z, 57 minutes apart, same hostname, same Worker version, same form page. No hostname configuration can produce that.

**Why it was seductive.** It had the right shape. It explained per visitor intermittency, which was the hardest thing to explain, and it explained it through a configuration error rather than a code path, which felt like the sort of thing that goes unnoticed for nine days. It also cost real time: one agent's entire brief was rewritten around it, and a second was told it was now "the central question".

**What would have killed it faster.** Asking for the `Host` header on the failing requests before building a theory that depended on it. That field was in the logs the whole time and took one follow up query to retrieve. I should have asked for it in the first log query rather than the second.

There is also a documentation answer that would have closed it with no telemetry at all: Cloudflare's hostname management page states that adding a hostname authorises "that exact hostname and all of its subdomains". `LAUNCH-CHECKLIST.md` line 20 records the intent as adding a widget for the apex, and under that documented behaviour `www` is covered automatically. The theory was refutable from a doc page and a checklist line.

### The pattern in both

Both detours share one structure: **I generated a hypothesis that explained the observations, then looked for evidence to develop it, rather than looking for the one cheap measurement that would falsify it.** In both cases the falsifying measurement was small, available, and skipped. The Safari theory needed the failing user agent. The hostname theory needed the failing `Host` header. Both were single fields in a dataset I was already querying.

The corrective habit is not "think harder before theorising". It is: **before spending effort developing a hypothesis, name the single cheapest observation that would kill it, and go get that first.**

### One thing that went right, for balance

The instrument validation discipline held throughout, and it mattered. When the Turnstile widget config endpoint returned `10000 Authentication error`, I did not record "config unreadable" and move on; I ran a control call to `/accounts/{id}/workers/scripts`, got the seven script names back, and concluded the token was alive and the failure was scope. That distinction is what led to trying a different credential and eventually reading the config. The same discipline caught the sampling problem in the observability API (0 events then 14 on an identical query) and caught my own `pgrep` self match twice, where a command matched the shell running it and reported a server as still running after it had stopped. Null results were treated as untrustworthy until the instrument was proven. That is the one habit from this investigation worth keeping unchanged.

---

## 6. The ten eliminated hypotheses

| Hypothesis | What killed it |
|---|---|
| A bad deployment | Failures span both Worker versions (`37183998` and `bb0ff638`); so do successes. Deploy times do not bracket the failure window. |
| Email bouncing back to the customer | Resend: 18 emails lifetime, all delivered, zero bounces ever. The site sends the customer nothing, so there is no address to reply to. The only published address anywhere on the site is Barbara's Gmail in the privacy policy, which accepts mail (`250 2.1.5` at RCPT TO). |
| The lead database | Healthy throughout. Both bracketing leads written correctly. `GET /api/contact` reported `db: true`. |
| The email provider | Sending domain `verified`, sending `enabled`, 18 lifetime sends against a 10 req/s API rate limit. Nowhere near any cap. |
| `www` versus the apex | Widget allowlist contains both. All six failures on the apex; the one `www` submission succeeded. A 400 and a 200 on the same host 57 minutes apart. |
| Firewall, WAF or bot protection | 53 firewall events across three days, 100 percent `action = block`, all WordPress and React exploit scans (`CVE-2026-63030`, `/wp-config.php`). Zero events on `/api/*`. Zero challenge type actions of any kind. The zone is on the Free plan with no Bot Management entitlement. |
| A Cloudflare incident | No Turnstile or Workers incident on 10, 11 or 12 August. The only overlap was "Cloudflare Analytics Delays" on 11 August 14:22 to 16:26Z, a reporting delay outside both windows. |
| An ad blocker or DNS filter on his phone | `challenge_issued` fired for his device. A blocked `challenges.cloudflare.com` cannot produce a server side challenge event. |
| A stale bookmark to the old WordPress site | He reached current URLs (`/get-service/`, `/get-service/repair/`) and his POSTs reached the current API. Nothing 404ed. |
| Name, phone or email validation rejecting him | Those paths return **422**, not 400, and `httpRequestsAdaptiveGroups` recorded zero 422s in the entire window. Confirmed by local reproduction: a 7 digit number and a number with an extension both produce 422 with a specific message. The phone mask caps input at 10 digits, so the browser cannot produce either. |

Two more were eliminated during the code audit rather than from telemetry:

- **Token expiry, replay, bfcache, `remoteip` mismatch and iCloud Private Relay.** All dead by `missing-input-response`, which means no token at all rather than a stale one. Measured separately: WebKit and Chromium both re init the widget on back navigation (`pageshow persisted=false`, token length 0), so a stale token is never reposted.
- **A `data-action` mismatch.** Only one place in the codebase sets it (`components/contact-form.tsx:514` pre fix) and it matches `TURNSTILE_ACTION` in the route.

---

## 7. What it cost

- **Six refused submissions** from one visitor, unrecoverable. No name, no phone, no email, no message. The only trace of him anywhere is an IP address and a user agent in a log with three day retention.
- **One paid Google Ads click wasted**, campaign `23089568597`. Trinity bought the visit and the form destroyed the outcome.
- **Nine days of unmeasured exposure** between the 3 August regression and the 12 August fix. The number of other refused visitors in that period is **unknowable**, because refusals wrote nothing. It cannot be recovered by any query.
- **A measured 38 percent** of challenged real browsers producing no token site wide, all of whom were being refused.

For scale: the site produces roughly one genuine lead every 1.6 days, and a website sourced job runs at a mean of $2,330 against a median job about 2.7 times smaller. One lost lead is a material fraction of a week's web volume and roughly two thousand dollars of work.
