# 09 · Measurement and monitoring

**Summary.** This is the runbook for answering "did the fix actually work" and for building the
monitoring that should have existed. Read section 1 before you run anything: **the 62% solve rate
quoted throughout the rest of this post-mortem is a dashboard figure and cannot be reproduced in
the GraphQL API.** The reproducible baseline is **68.5%**, and comparing a fresh GraphQL number
against the dashboard's 62% will manufacture a fake improvement of six points. Everything after
that is the queries, the three measured traps in the instruments, the decision rule with real
sample sizes, and the monitoring design. Every number below was measured read-only against the
live account on 12 August 2026. The one number that matters most, the post-fix solve rate, is
**n=1 and means nothing yet**; section 9 says so plainly rather than dressing it up.

---

## 1 · The baseline correction. Read this first.

`01-what-happened.md` and `05-known-gaps.md` cite **141 challenges issued, 87 solved, 62%** for
6 to 12 August. That figure came from the Turnstile dashboard
([Turnstile analytics](https://developers.cloudflare.com/turnstile/turnstile-analytics/)). It is
not reproducible through the
[GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/).

The numerator reconciles **exactly**, which is what proves the instrument is pointed at the right
data:

| Check | Dashboard | GraphQL | Match |
|---|---|---|---|
| Total solved, 6 to 12 Aug | 87 | 87 | ✅ |
| Mobile Safari / iOS | 10 of 13 | 10 of 13 | ✅ |

The denominator does not:

| Definition | Issued | Solved | Rate |
|---|---|---|---|
| Dashboard, "bots excluded" | 141 | 87 | 62.0% |
| GraphQL, all user agents | 154 | 87 | 56.5% |
| **GraphQL, bot `browserName` excluded** | **127** | **87** | **68.5%** |

Every window boundary in the data was brute-forced against every subset of bot browser names.
**No combination yields 141.** Chrome Mobile on Android is 13 issued / 9 solved in GraphQL against
"8 of 28" on the dashboard.

The cause is that the dashboard applies Cloudflare's own bot classification, while
`turnstileAdaptiveGroups` exposes only `browserName`. Same numerator, different denominator, and
the two are not convertible.

> **Rule: 68.5% solve / 31.5% refusal is the baseline. Never compare a GraphQL post-fix number
> against the dashboard's 62%.** Doing so invents a six point improvement out of a methodology
> difference. If you want to use the dashboard, compare dashboard to dashboard.

---

## 2 · The canonical queries

Both go to `https://api.cloudflare.com/client/v4/graphql` with
`Authorization: Bearer <token>`. Use the token on **line 16 of `.env.local`** (it is commented
out; read the value in a subshell, do **not** uncomment it, because an active
`CLOUDFLARE_API_TOKEN` in that file shadows the wrangler OAuth login and breaks D1 and deploys).

`<ACCOUNT_TAG>` is `CLOUDFLARE_ACCOUNT_ID` from `.env.local`. `<ZONE_TAG>` comes from
`GET /zones?name=trinitygaragedoorservice.com`.

### 2.1 Turnstile solve rate (account scoped)

Turnstile analytics is an **account** dataset, not a zone dataset.

```graphql
{
  viewer {
    accounts(filter: {accountTag: "<ACCOUNT_TAG>"}) {
      turnstileAdaptiveGroups(
        limit: 10000
        filter: {
          siteKey:      "0x4AAAAAAEBKd2inJHyABmFZ"
          datetime_geq: "<FROM>"
          datetime_lt:  "<TO>"
        }
        orderBy: [count_DESC]
      ) {
        count
        avg { sampleInterval }
        dimensions { eventType browserName osName asn hostname action }
      }
    }
  }
}
```

The site key is safe to record here: it is inlined into the client bundle and served to every
visitor. The **secret** never appears in this document or in any query.

### 2.2 Form page views (zone scoped) — currently unavailable

```graphql
{
  viewer {
    zones(filter: {zoneTag: "<ZONE_TAG>"}) {
      httpRequestsAdaptiveGroups(
        limit: 5000
        filter: {
          datetime_geq: "<FROM>", datetime_lt: "<TO>"
          clientRequestPath_like: "/get-service%"
          clientRequestHTTPMethodName: "GET"
          edgeResponseStatus: 200
          botScore_gt: 30
        }
        orderBy: [count_DESC]
      ) {
        count
        avg { sampleInterval }
        dimensions { clientRequestPath userAgentBrowser userAgentOS botScoreSrcName }
      }
    }
  }
}
```

Two things to know:

- The field is **`clientRequestHTTPMethodName`**, not `clientRequestHTTPMethod`. The latter does
  not exist and returns `unknown field`.
- **This query cannot run today.** The token lacks
  `com.cloudflare.api.account.zone.analytics.read`, and both `httpRequestsAdaptiveGroups` and
  `httpRequests1dGroups` were refused. **Add `Zone Analytics: Read` scoped to
  `trinitygaragedoorservice.com`**
  ([API token permissions](https://developers.cloudflare.com/fundamentals/api/reference/permissions/)).
  Until then the primary metric in section 6 is **unread, not clear**, and that distinction is the
  whole of prevention principle 5.

`botScore` is available as a dimension on Free zones even though Bot Management as a product is
not ([bot score](https://developers.cloudflare.com/bots/concepts/bot-score/)), which is what makes
`botScore_gt: 30` usable here.

---

## 3 · Classification rules

Four `eventType` values count as a solve. Missing any of them undercounts:

```
challenge_solved
challenge_non_interactive_solved
challenge_interactive_solved
challenge_siteverify_solved            (and the interactive/non-interactive variants)
```

```python
solved  = "solved" in eventType
issued  = eventType == "challenge_issued"

# exclusions, applied client side
drop if asn == 0 and browserName == ""                                   # siteverify probes
drop if asn == 701 and browserName == "Chrome" and osName == "Windows"   # uptime beacon
drop if browserName in {AdsBot-Google, Googlebot, crawler, HeadlessChrome,
                        bingbot, Applebot, PetalBot, YandexBot}

assert max(sampleInterval) == 1.0
```

> **Do the exclusions in your script, not in the GraphQL filter, and print what you dropped on
> every run.** Expressing `NOT (asn=701 AND browser=Chrome AND os=Windows)` in Cloudflare's filter
> grammar is possible and unreadable, and an exclusion list buried in a query string is an
> exclusion list nobody audits. A printed line reading `excluded: beacon 29/29 | probes 1` keeps
> the exclusions visible as an operational fact.

---

## 4 · Three traps in the instruments, each measured

### 4.1 `turnstileAdaptiveGroups` window cap and sampling

The dataset **rejects any range wider than `1w1h`**, so every comparison must be chunked.

`avg { sampleInterval }` is **not always 1**. Measured values of **1.0357 and 1.0385** appeared
over 3 to 8 August. Small, but it proves the field is live, and a wider or busier window can
inflate it ([sampling](https://developers.cloudflare.com/analytics/graphql-api/sampling/)).

**Assert `sampleInterval == 1.0` on every response and discard the window otherwise.**

### 4.2 The uptime beacon, which is a live problem and not only a measurement one

Isolated precisely:

```
ASN 701 (Verizon Business) · Philadelphia · colo EWR
UA: Chrome 150 and 151 alternating, Windows NT 10.0
hostname: trinitygaragedoorservice.com   action: contact-form
cadence: exactly 2 challenges per 5 minutes   solve rate: 100%
```

History: ran 3 to 5 August at roughly 13/hour, stopped 5 August around 20:00Z, and **restarted at
15:45Z on 12 August, eight minutes after the fix deployed.** It is absent from the 6 to 12 August
baseline, which is why that window is clean and why the post-mortem's choice of window was right.

At **288 challenges a day against roughly 21 genuine ones it is 14x the real traffic.** Left in the
denominator it drives any post-fix solve rate to about 99% regardless of whether the fix worked.
This is the single largest threat to the measurement.

**It is also a problem beyond measurement.** It solves Turnstile, which means it executes
JavaScript on the production site. But it made only **1** request to the Trinity Worker in an hour
while generating **31** challenges, because prerendered pages are served from Cloudflare's edge
cache and never invoke the Worker. So it is loading real pages, running the real bundle, and
therefore **firing GTM, Google Ads and Bing UET roughly 288 times a day against about 34 genuine
form page views.** That is roughly eight synthetic page views for every real one, polluting the
client's conversion data continuously.

> **Action: find whoever owns this monitor and switch it to an HTTP-only check.** See section 13
> for why a browser check must never be pointed at this site.

### 4.3 The siteverify probe artefact is cleanly separable

Every single `challenge_siteverify_failed_invalid_token` event in the entire pull, 3 August through
now, has `asn == 0` and `browserName == ""`. **No real browser event carries that signature.**

Two independent defences, and the first is structural:

1. Those events are **not** `challenge_issued`, so they never enter the solve-rate denominator at
   all. The artefact only corrupts a naive `failures ÷ (solved + failures)` metric. **Do not
   compute that metric.**
2. Filter on `asn == 0 && browserName == ""` and print the dropped count.

This is the counter that `05-known-gaps.md` warns climbs when someone runs siteverify by hand. It
is now bounded and accounted for.

---

## 5 · The confound that cannot be resolved

Two changes shipped 76 minutes apart:

| Time (UTC) | Change |
|---|---|
| 14:21:25Z | Turnstile widget mode: Managed → Non-Interactive (dashboard, no deploy) |
| 15:37:29Z | Code fix deployed, Worker version `a1d68ba7` |

Separable in principle. Not in practice:

```
mode-only window 14:22Z → 15:37Z:  1 issued, 1 solved   (n = 1)
```

At roughly 21 real challenges a day, isolating the mode change would need about a week in a
half-fixed state. Nobody is leaving a revenue path partly broken for a week to satisfy an
attribution question.

> **Report the combined effect and say so in writing:** "Non-Interactive mode plus explicit
> rendering together moved the refusal rate from 31.5% to X." That is the decision-relevant
> number. If Turnstile is later replaced (see `03-options-considered.md`), the attribution
> question becomes moot.

---

## 6 · The metric the original plan was blind to

`05-known-gaps.md` gap 7 proposes measuring solved ÷ issued. **That metric structurally cannot see
the bug that caused this incident.**

When the widget fails to mount, no challenge is issued, so the visitor never enters the
denominator. **A form that mounts the widget for nobody reports a perfect 100% solve rate.**

The post-mortem knows this in prose — the lost customer generated 7 page loads and only 2
challenges issued — but the proposed metric does not capture it. So:

> **Primary metric: challenges issued ÷ form page views. Expected ≈ 1.0.**

Two measured obstacles:

**Bot contamination in the denominator is severe, and user-agent filtering does not fix it.** Of
294 GETs to `/get-service*` in one six-hour window, **142 were Googlebot Smartphone**, which sends
a genuine mobile UA string (`Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X …)`). Filtering on the
**`Accept: text/html` header** instead cuts 294 down to **13 genuine navigations**.

**Workers Logs cannot supply the denominator.** Prerendered pages are served from edge cache and
never invoke the Worker. The beacon proved it: 31 challenges, 1 Worker request. The denominator has
to come from zone-level analytics, which is the query in section 2.2 that the token cannot
currently run.

---

## 7 · Workers Logs, the strongest instrument

Better than the Turnstile proxy, because it records **actual form outcomes**. Status codes decode
as:

| Status | Meaning |
|---|---|
| `200` | Lead captured |
| `400` | Turnstile reject |
| `422` | Name or phone validation reject |

```
POST /api/contact — 12 Aug, abr_level 1 (unsampled)
  01:37:26Z  400        01:39:51Z  400
  01:37:42Z  400        11:12:47Z  400
  01:39:48Z  400        12:10:02Z  200
  01:39:50Z  400        15:48:54Z  422   ← the only post-fix POST
```

Those six 400s are the incident customer's six refusals, to the second. **The instrument
reproduces a known-good case exactly, which is what makes its nulls trustworthy.**

Query via `POST /accounts/<ACCOUNT_TAG>/workers/observability/telemetry/query`
([Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)):

```json
{"queryId":"contact","timeframe":{"from":<ms>,"to":<ms>},"limit":200,"view":"events",
 "parameters":{"datasets":["cloudflare-workers"],
  "filters":[
    {"key":"$workers.event.request.path","operation":"includes","value":"/api/contact","type":"string"},
    {"key":"$workers.event.request.method","operation":"eq","value":"POST","type":"string"}]}}
```

### Two traps, both measured

**`operation` must be `includes`, not `eq`.** The logged path is `/api/contact` with **no trailing
slash**. An `eq` on `/api/contact/` returns zero events, which is a textbook false null that looks
exactly like "nobody submitted anything".

**`statistics.abr_level` must be 1.** The identical filter returned **abr_level 10 and zero
events** over 3 days, 1 day and 12 hours, but **abr_level 1 and 15 events** over 17 hours of
same-day data. The driver is `rows_read`: under roughly 2.2M gives abr 1, above it gives abr 10 and
rare events are dropped entirely.

> **Chunk to 6 hours or less and assert `abr_level == 1`.** Validate any null by running the same
> query shape over a window with known traffic.

**Retention is 3 days on Workers Free, 7 on Paid, and 7 is the maximum on any plan.** This is a
same-day instrument, not a historical record. That is precisely why capture has to happen at write
time, and why the pre-fix refusal count between 3 and 12 August is permanently unknowable. Zone
Logpush is Enterprise only
([Logpush](https://developers.cloudflare.com/workers/observability/logs/logpush/)).

---

## 8 · Decision rule

**Comparison window:** 19 Aug 00:00Z → 26 Aug 00:00Z, pulled as one 7-day chunk (the maximum the
API allows), against the baseline 6 Aug 00:00Z → 12 Aug 00:00Z.

Start the clock on **19 August, a week after deploy, not on 12 August.** The days immediately after
a fix are contaminated by the fixer's own testing: 12 August alone carries 8 manual siteverify
probes and a beacon restart.

### Sample sizes, from the baseline rate of 21.2 real challenges/day at 31.5% failure

| Question | Evidence needed | Time at 21/day |
|---|---|---|
| Rule out "no change" (still 31.5% failing) | **8 consecutive clean solves** | ~9 hours |
| 95% upper bound of 5% residual | 60 challenges, zero failures | ~3 days |
| 95% upper bound of 2% residual | 150 challenges, zero failures | **~7 days** |

Eight clean solves already rules out the old rate at 95% confidence, because `0.685^8 = 0.047`. The
seven days is needed only for the stronger claim that `03-options-considered.md` requires before
keeping Turnstile.

### Verdict bands

Over **≥60 real challenges**, with `sampleInterval == 1` and the three exclusions applied:

| Solve rate | Verdict | Action |
|---|---|---|
| **≥ 95%** | Fix worked | Keep Turnstile. Fold the number into the weekly digest as a trend line. |
| 85 – 94% | Partial | Break down by `browserName` × `osName`. The baseline's worst cohort was Chrome Mobile on Android. Clustering on one cohort is a bug; spread evenly is hostile browser configuration. |
| **≤ 84%** | Did not work | Execute the replacement in `03-options-considered.md`: honeypot plus time-to-submit plus edge rate limit. Turnstile is not earning its place. |

### Secondary gate, and it is not optional

**Challenges issued ÷ form page views must be ≥ 0.9.** If the solve rate is 98% but that ratio is
0.4, the widget is still failing to mount for most visitors and the solve rate is measuring only
the minority for whom it works. That is the original bug wearing a good number.

---

## 9 · Current numbers, with the honesty they require

Run with the query and exclusions above:

```
##### BASELINE (6 Aug 00:00Z → 12 Aug 00:00Z) #####
max sampleInterval  1.0
REAL BROWSERS       solved 87 / issued 127 = 68.5%
excluded            beacon 0/0 | siteverify probes 0

##### TODAY, PRE-FIX (12 Aug 00:00Z → 15:37Z) #####
max sampleInterval  1.0
REAL BROWSERS       solved 9 / issued 32 = 28.1%
excluded            beacon 0/0 | siteverify probes 8

##### MODE-ONLY (14:22Z → 15:37Z) #####
REAL BROWSERS       solved 1 / issued 1 = 100%      n = 1

##### POST-FIX (15:38Z → 17:00Z) #####
max sampleInterval  1.0
REAL BROWSERS       solved 1 / issued 1 = 100%      n = 1
excluded            beacon 29/29 | siteverify probes 1
```

> **The post-fix sample is one challenge, from one in-app browser on Android, over 82 minutes. It
> means nothing.** The 100% is arithmetic, not evidence. Anyone quoting it as "the fix worked" is
> making the same category of mistake this post-mortem is about.

What **is** informative: **today pre-fix ran at 28.1%, well below the 68.5% six-day baseline.** The
form was in its worst measured state in the hours before the fix, which corroborates the incident
rather than contradicting it.

Also recorded: `challenge_issued` currently carries `action: contact-form` and `hostname` of the
apex or `www` only. The widget's allowed-domains list is apex plus `www` with **no `localhost`**,
so the gap 10 trap has not been sprung.

---

## 10 · The routine that makes someone look

The business, read from D1 on 12 August:

```
leads total   13     (since launch, 2026-08-01)
last 7 days    7
unverified     0
last lead      2026-08-12 12:10:03
```

Fewer than one real lead a day, zero refusals captured so far, a two person office, and an agency
owner who lives in email. **Anything that requires someone to remember to visit a place will not
survive a month.** `unverified_leads` proves it: it works correctly and nothing has ever queried
it.

| Option | Verdict |
|---|---|
| Protected dashboard route | **No.** Needs someone to remember to look, which is the detector that already failed. Empty most weeks, which teaches people it is never worth visiting. |
| Scheduled export to Sheets | **No.** Same problem, plus an OAuth token to rotate and a second failure mode nobody monitors. |
| Piggyback on the office lead email | **Supplement only.** If the form is dead there are no lead emails, so the carrier vanishes exactly when the signal is needed. |
| **Weekly digest from a Cron Trigger Worker** | **Yes**, with one reframe. |

### The reframe matters more than the mechanism

**A refusal digest is empty most weeks and will be filtered to a folder within a month.** So do not
build a refusal digest. Build the **weekly website report** that Derrick partly writes by hand
already, and carry the anomalies inside it. The leads make it worth opening; the anomalies ride
along and get seen for free.

### It must be a separate Worker

Three reasons:

1. OpenNext generates the Worker entrypoint. Adding a `scheduled()` export means patching generated
   output or maintaining a custom wrapper, which breaks on adapter upgrades
   ([OpenNext custom worker](https://opennext.js.org/cloudflare/howtos/custom-worker)). There are
   no `triggers` in `wrangler.jsonc` today.
2. A bug in the digest must never be able to break the lead form.
3. It has to be able to report that the site Worker is broken. Same script, same deploy, one bad
   deploy takes out both.

```
workers/weekly-digest/
  wrangler.jsonc     name: trinity-digest
                     triggers: { crons: ["0 13 * * 1"] }   # 09:00 ET Monday
                     d1_databases: [{ binding: "DB", database_name: "trinity-leads" }]
  src/index.ts       ~120 lines, scheduled() handler
  secrets            RESEND_API_KEY, DIGEST_TO
```

([Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/))

Monday 09:00 ET so it is read at the start of a working week, not lost on a Friday afternoon.

### Subject line carries the answer

```
Trinity website: 7 leads last week, 1 needs a callback
Trinity website: 7 leads last week, all clear
```

Always a number that changes weekly, so a stale or duplicated send is visible without opening it.

### Four sections, in this order

**1 · NEEDS ACTION** — rendered only when non-empty, and it is what changes the subject line.

```sql
SELECT created_at, reason, name, phone, email, zip, city, service, source,
       alert_status, alert_error, substr(message,1,200) AS message
FROM unverified_leads
WHERE created_at > datetime('now','-7 day') AND reason <> 'healthcheck'
ORDER BY (alert_status <> 'ok') DESC, id DESC;
```

Rows where `alert_status <> 'ok'` sort first and are flagged. Those are people who were promised a
callback that nobody was told to make, which is gaps 2 and 3. One sentence of instruction, no
jargon: *"Call these people. They tried to reach you and the spam check stopped them."* The phone
number is in the row, so acting on it needs no other system.

**2 · LEADS** — the week's real leads: name, phone, service, source, landing path, whether a click
id was present. This is the section that earns the open.

**3 · HEALTH** — one line, printing only flags **not** in their expected state. The cron fetches
`GET /api/contact/?deep=1` once per week, which is the only scheduled deep probe in the design and
therefore adds one predictable siteverify artefact per week rather than 24 a day. Expected: `db`,
`leadsSchema`, `unverifiedTable`, `resend`, `mailTo`, `mailFrom`, `turnstile`,
`turnstileSiteKeyLooksReal`, `alertTo` all true; `turnstileIsTestKey` false; `siteverify: "ok"`.

**4 · TURNSTILE** — solved ÷ issued for the week with the three exclusions applied, plus the
trailing four weeks as a sparkline of numbers. A trend, not a threshold: at 21 challenges a day any
fixed threshold either cries wolf or sleeps through the outage, but a human reading
`68% · 96% · 97% · 71%` sees the fourth number immediately.

**Footer:** `Week 34. Previous digest sent 2026-08-17.` A missing week becomes visible in the next
one.

### Rules that keep it worth opening

- The leads are the payload; anomalies are a section inside it. **Never invert this.**
- Send every week even when clean, because absence is a signal. But never let "all clear" be the
  entire content.
- Cap at one screen. Over 10 quarantine rows, print 10 and a count.
- **Weekly, not daily.** At about 1 lead/day and about 0 refusals/week, daily is 7x the volume for
  the same information and trains exactly the ignoring behaviour this is meant to prevent.
  Individual-refusal latency is covered by the inline alert; the digest is the safety net.

**Free supplement, about five lines:** append one line to the footer of every office lead email —
`Quarantine: 0 refused submissions waiting.` It costs nothing, puts the number in front of the
office on every real lead, and on the day it reads `1 waiting` somebody sees it hours before
Monday.

---

## 11 · Alerting

**Inline email from the request path is the right mechanism for this business** — a refusal is a
person waiting, weekly is far too slow for the primary path, the alert *is* the recovery because it
carries the phone number, and at a handful of refusals a week the request-path cost is irrelevant.

Three changes, in priority order:

**1 · Set `UNVERIFIED_ALERT_TO` now.** Production reports `"alertTo": false`, so `captured` is
always false and a refused visitor still reads the string the incident customer followed at
21:37:46. One command, no rebuild, no deploy:

```
wrangler secret put UNVERIFIED_ALERT_TO
```

**Recipient: the agency only, for the first month.** We do not yet know the refusal volume of the
new gate, and dumping unknown-volume spam on a two person office is how the office learns to ignore
lead mail, including real lead mail. After a month of measured volume, add the office. Put the
review date in `CLIENT-ASKS.md`.

**2 · Base the customer-facing promise on `stored`, not `stored && notified`.** The row is a
verified durable fact written before the response; the email is an intention. See
`05-known-gaps.md` gap 2. Let `notified` drive logging only.

**3 · Write `alert_error`** and make `alert_status <> 'ok'` the first and loudest query in the
digest. That is the only thing that catches an evicted `after()`.

If refusal volume ever rises enough that inline sending matters, the upgrade is Cloudflare Queues,
not a larger `after()`.

---

## 12 · Synthetic checks, and one trap

### The reserved 555-0100 test number is a trap. Do not use it.

`isValidPhone` requires NPA and NXX to match `[2-9]\d\d` and to not be N11 codes. **`555` passes
both.** So a synthetic submission using `(813) 555-0123` is accepted as a completely ordinary lead.

Four reasons it fails:

1. It is **indistinguishable from a real lead** until a filter catches it. It gets written to
   `leads`, emailed to the office, and becomes eligible for the Housecall Pro push, into an account
   with 6,001 real customers and **no DELETE endpoint**.
2. **Put the filter before the writes and the test stops testing anything.** The only reason to run
   a synthetic is to prove the D1 insert and the Resend send work.
3. **Put the filter after the writes and you need a `DELETE` against `leads`**, the one operation
   migration 0005 says nobody should ever write.
4. **A magic value that silently swallows submissions is the same bug class as this post-mortem.**
   A real customer transposing digits onto a reserved number gets a lead discarded with no trace.

### What a safe synthetic can and cannot cover

`GET /api/contact/?deep=1` already proves: D1 binding alive, `leads` schema complete,
`unverified_leads` present, Resend key set, to/from/bcc set, alert address set, Turnstile secret
live and not a test key, site key present and real-looking, and siteverify reachable **from the
Worker** with the secret accepted.

It cannot prove: the widget renders in a browser, Resend delivers, the D1 `INSERT` succeeds, or a
human reads the mail. Split those across three checks:

**(i) Widget mount, in CI, never against production.** The highest-value check in the design,
because it is the one that would have caught the original bug. Playwright against `pnpm preview`
(real `workerd`), with `NEXT_PUBLIC_GTM_DISABLE=1`:

```
hard load  /get-service/                → cf-turnstile-response non-empty within 15s, mounts == 1
click through to /get-service/repair/   → same
navigate away and back                  → same
```

About 40 lines. Runs on every PR and nightly, because `api.js` is remote code that changes without
us. Two constraints that will bite otherwise: it **must** be `pnpm preview`, not `next dev`
(Turbopack drops CSS chunks in headless Chrome), and `NEXT_PUBLIC_GTM_DISABLE=1` **must** be set or
the run fires real conversions into the client's Ads account. That flag is currently set nowhere in
the repo and the guard in `app/layout.tsx` has no dev check, so gap 14 needs fixing first.

**(ii) Write round-trip, server side, no fake lead.** Extend `?deep=1` to `INSERT` / `SELECT` /
`DELETE` a single row in `unverified_leads` with `reason = 'healthcheck'`. That table already has a
sanctioned `DELETE` (the 30-day prune rides in every insert batch), so this adds no new dangerous
pattern, and it proves the write path that `SELECT 1` cannot. Two conditions: the digest and every
alert filter `reason <> 'healthcheck'`, and `?deep=1` moves behind a shared-secret header since it
is currently an unauthenticated outbound amplifier. **Never do this against `leads`.**

**(iii) Resend delivery, observed not synthesised.** The weekly digest is itself a Resend send to a
mailbox someone reads. If it arrives, Resend works. `CONTACT_BCC_EMAIL` is already set, so the
agency receives a copy of every real lead email, which is live delivery proof on real traffic at
zero cost.

**Uncovered, stated plainly:** nothing proves the office *reads* the mail, and nothing proves a real
visitor's browser in the wild mounts the widget. The second is what the issued ÷ page views ratio
in section 6 is for, and it is why that metric matters more than solve rate.

---

## 13 · External uptime monitor

It must live **off Cloudflare and off this account**, because alerting from inside the route cannot
report that the route is down.

> ⚠️ **HTTP and keyword checks only. Never a browser check.** A plain HTTP GET does not execute
> JavaScript, so it cannot fire GTM, Google Ads or Bing UET. Enabling any "real browser" or
> "browser rendering" mode turns the monitor into the exact conversion pollution described in
> section 4.2, where something is already doing this 288 times a day.

| # | Check | Interval | Assertion |
|---|---|---|---|
| 1 | `GET /api/contact` | 5 min | **Body keywords, not just 200.** Require `"db":true`, `"leadsSchema":true`, `"unverifiedTable":true`, `"resend":true`, `"mailTo":true`, `"mailFrom":true`, `"turnstile":true`, `"turnstileSiteKeyLooksReal":true`, `"turnstileIsTestKey":false`, and once set `"alertTo":true` |
| 2 | `GET /api/contact?deep=1` | **60 min** | `"siteverify":"ok"` |
| 3 | `GET /get-service/` | 5 min | 200, and the HTML contains both the Turnstile script src and the widget container |
| 4 | TLS expiry and DNS, **apex and www as separate monitors** | daily | cert ≥ 14 days, both hostnames resolve and serve |
| 5 | Heartbeat from the digest Worker | 8-day window | dead-man's switch |

Notes on the choices:

- **Check 1 is the most valuable item on the list.** A 200 with `"db":false` is the failure that
  matters, and a status-only monitor sleeps straight through it. This turns a silent config
  regression — an unapplied migration, a deleted secret, a build shipped without the site key —
  into a page within five minutes.
- **Check 2 is hourly on purpose.** Each call makes the Worker hit siteverify and emits one
  `challenge_siteverify_failed_invalid_token`. Hourly is a predictable 24/day that the section 3
  filter removes. Five-minutely would be 288/day and would look like an incident in the dashboard.
- **Check 3 catches what `?deep=1` structurally cannot.** The health endpoint reports the
  build-time env var, not the rendered markup. A build that ships the form page without the widget
  container passes check 1 and fails check 3.
- **Check 4 monitors both hostnames separately** because `wrangler.jsonc` needs a distinct route
  pattern for the apex. A route regression shows up as one hostname failing while the other passes.
- **Check 5 exists because the digest is the thing that catches everything else.** If it silently
  stops, every safety net in section 10 goes with it and nothing says so.

Escalate to the agency by email and SMS. **Not to the office** — they cannot fix a Worker, and
paging them at 2am about something they cannot act on is how a monitor gets muted.

---

## 14 · Live finding: the patch is not deployed, and gap 5 has already fired

The deployed Worker is `408f7db`. The working tree carries the fixes for gaps 5 and 8 and they are
**not live**.

```ts
// deployed (408f7db) — gap 5 is live in production
function isReachable(s) { return Boolean(s.phoneE164) || isValidEmail(s.email); }

// working tree — fixed, not deployed
function isReachable(s) { return Boolean(s.phoneE164) || hasPlausiblePhone(s.phone) || isValidEmail(s.email); }
```

**It fired within 11 minutes of the deploy.** The only post-fix POST was the **422 at 15:48:54Z**,
and `unverified_leads` still contains **0 rows**. So that refusal was still discarded, because the
deployed `isReachable` requires a valid email and a `phone_invalid` refusal can never carry a
`phoneE164` by construction.

> **A refused submission was thrown away 11 minutes after we shipped the fix for throwing away
> refused submissions.** Deploy the follow-up patch before the next real customer mistypes a digit.

---

## Sources

Cloudflare, all read 12 August 2026:

- [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/)
- [GraphQL sampling](https://developers.cloudflare.com/analytics/graphql-api/sampling/)
- [Turnstile analytics](https://developers.cloudflare.com/turnstile/turnstile-analytics/)
- [Turnstile server side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
- [Workers Logpush](https://developers.cloudflare.com/workers/observability/logs/logpush/)
- [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)
- [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- [API token permissions](https://developers.cloudflare.com/fundamentals/api/reference/permissions/)
- [Bot score](https://developers.cloudflare.com/bots/concepts/bot-score/)
- [D1 limits](https://developers.cloudflare.com/d1/platform/limits/)
- [OpenNext custom worker](https://opennext.js.org/cloudflare/howtos/custom-worker)

All figures in this file were measured read-only against the live account on 12 August 2026. No
production writes, no deploys, no configuration changes were made to obtain them.
