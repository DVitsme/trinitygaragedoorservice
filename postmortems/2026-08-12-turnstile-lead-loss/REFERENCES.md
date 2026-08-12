# References

Every external source used across this investigation, consolidated so nobody re-derives it.

Each entry gives the URL, what it establishes, and which post-mortem file relies on it. Entries marked
**⚠ UNVERIFIED** support a claim that could not be confirmed at the time of writing; treat those as
leads, not facts, and re-check before relying on them.

Docs move. Where a claim matters, the finding is restated in the post-mortem body so it survives a dead
link.

---

## Cloudflare R2

| Source | Establishes | Used by |
|---|---|---|
| [Workers API reference](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/) | `put()` is full object replacement. **There is no append operation.** Also documents `onlyIf: { etagMatches }` conditional put | 03, 08 |
| [Platform limits](https://developers.cloudflare.com/r2/platform/limits/) | **Maximum 1 concurrent write per second to the same object key**, HTTP 429 beyond it. The fact that killed the monthly append design | 03, 08, 10 |
| [Multipart objects](https://developers.cloudflare.com/r2/objects/multipart-objects/) | Minimum part size **5 MiB** except the last; all parts must be equal size; the object does not exist until `complete()`. Three independent reasons multipart cannot be used as an append mechanism | 03, 08 |
| [Consistency model](https://developers.cloudflare.com/r2/reference/consistency/) | Strongly consistent. Concurrent writers are **"last writer to complete wins"**, which is the silent overwrite the spike measured | 08 |
| [Pricing](https://developers.cloudflare.com/r2/pricing/) | $0.015/GB-month, $4.50/M Class A, $0.36/M Class B. Free tier 10 GB, 1M Class A, 10M Class B per month | 03, 08 |
| [Data location](https://developers.cloudflare.com/r2/reference/data-location/) | Location hints are honoured **only at bucket creation** and cannot be changed later. `enam` for Florida traffic | 03 |
| [Bucket locks](https://developers.cloudflare.com/r2/buckets/bucket-locks/) | Can make objects undeletable for a period or indefinitely. D1 has no equivalent; the strongest point in R2's favour | 03, 08 |
| [Object lifecycles](https://developers.cloudflare.com/r2/buckets/object-lifecycles/) | `Expiration: { Days: N }` rules by prefix. How retention would be enforced if R2 were used | 08, 10 |
| [Public buckets](https://developers.cloudflare.com/r2/buckets/public-buckets/) | Private by default, **but attaching a custom domain makes a bucket public by default**, and `r2.dev` requests bypass WAF, Bot Management and Access | 10 |
| [Presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/) | Maximum expiry **7 days**. Requires separate S3 access keys | 10 |
| [S3 API compatibility](https://developers.cloudflare.com/r2/api/s3/api/) | Confirms no append operation exists anywhere in the S3-compatible surface | 03 |
| [Get started](https://developers.cloudflare.com/r2/get-started/) | R2 requires completing a subscription checkout before use. **⚠ UNVERIFIED** whether a payment method is required for the free tier | 03, 08 |
| [Protecting R2 with Cloudflare Access](https://developers.cloudflare.com/r2/tutorials/cloudflare-access/) | The supported way to put auth in front of a bucket | 10 |
| R2 object versioning | **⚠ UNVERIFIED.** The documentation path `/r2/buckets/object-versioning/` returned 404 and no authoritative page was found. The analysis therefore **assumes an R2 overwrite is unrecoverable**. Re-check before relying on versioning as a safety net | 08 |

## Cloudflare D1

| Source | Establishes | Used by |
|---|---|---|
| [Platform limits](https://developers.cloudflare.com/d1/platform/limits/) | 2 MB max row, 500 MB per database on Free, 10 GB on Paid, 5 GB total free storage. **100,000 rows written per day on Free, account wide** | 08, 10 |
| [Pricing](https://developers.cloudflare.com/d1/platform/pricing/) | Free tier allowances and what exceeding them does: the D1 API returns errors across **every database on the account** | 08, 10 |
| [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/) | Point in time restore, always on, free. 7 days on Free, 30 on Paid. **Cannot be disabled**, which is a caveat for erasure requests | 08, 10 |
| [wrangler d1 commands](https://developers.cloudflare.com/workers/wrangler/commands/d1/) | `wrangler d1 execute` syntax. Needs `--json \| jq -r` or plain text arrives JSON escaped | 08 |

## Workers platform and limits

| Source | Establishes | Used by |
|---|---|---|
| [Workers limits](https://developers.cloudflare.com/workers/platform/limits/) | **10 ms CPU on Free**, 30 s on Paid. 50 subrequests on Free but **1,000 to internal services** (R2, KV, D1). 5 Cron Triggers per account | 03, 08 |
| [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) | Plan tiers referenced throughout | 08 |
| [`ctx.waitUntil()`](https://developers.cloudflare.com/workers/runtime-apis/context/) | Extends execution up to **30 seconds after the response is sent**, shared across all `waitUntil` calls, and tasks beyond that **are cancelled**. The reason the write ahead log must be awaited, not deferred | 03, 04, 08 |
| [Next.js `after()`](https://nextjs.org/docs/app/api-reference/functions/after) | Compiles to `waitUntil` on Cloudflare, so it inherits the best effort semantics above | 04, 08 |
| [Storage options](https://developers.cloudflare.com/workers/platform/storage-options/) | Cloudflare's own product guidance lists "log and event data" under R2. Cited honestly as a point **against** the D1 recommendation | 08 |
| [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/) | How a scheduled compaction or digest job would be wired | 03, 08, 09 |
| [Queues pricing](https://developers.cloudflare.com/queues/platform/pricing/) | Free tier 10,000 ops/day, 24 hour retention. Rejected: a queue is asynchronous, so the response leaves before the record is durable | 03 |
| [Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/) | SQLite backed DOs are on the Free plan. Considered for serialising writes, rejected as overkill at ~100 writes/month | 03 |
| [KV limits](https://developers.cloudflare.com/kv/platform/limits/) | Eventually consistent, **1,000 writes/day to distinct keys on Free**. Disqualified as a durable record of record | 03 |
| [Workers rate limiting binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) | GA 19 Sept 2025. `period` must be 10 or 60 seconds, per colo, eventually consistent. **⚠ UNVERIFIED** whether it is available on the Free plan; test on the account before designing around it | 05, 10 |
| [WAF rate limiting rules](https://developers.cloudflare.com/waf/rate-limiting-rules/) | Free plan gets **one rule, 10 second period only, IP grouping only, Path matching only**. 1 minute windows need Pro | 05, 10 |

## Workers observability and analytics

| Source | Establishes | Used by |
|---|---|---|
| [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/) | **3 day retention on Free, 7 on Paid, 7 is the maximum on any plan.** Why Workers Logs cannot be the archive, and why the pre-fix refusal count is permanently unknowable | 01, 05, 09, 10 |
| [Workers Logpush](https://developers.cloudflare.com/workers/observability/logs/logpush/) | **"This product is available on the Workers Paid plan."** Removes the zero code "logs straight into R2" option | 03, 09 |
| [Analytics Engine limits](https://developers.cloudflare.com/analytics/analytics-engine/limits/) | 250 data points per invocation, 20 blobs, 16 KB total, **3 month retention**. A metrics product; disqualified for storing customer messages | 03, 09 |

The **Workers Observability telemetry query API** (`POST /accounts/{id}/workers/observability/telemetry/query`)
is not well documented publicly; the working request shape in `01-what-happened.md` was derived
empirically. Two traps recorded there: the API **adaptively samples** (identical queries returned 0
then 14 events), and `operation` must be `includes` rather than `eq` because the logged path carries no
trailing slash.

## Cloudflare Turnstile

| Source | Establishes | Used by |
|---|---|---|
| [Server side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) | The siteverify contract and the `error-codes` array. `missing-input-response` means the browser sent **no token at all** | 01, 02 |
| [Client side rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/) | Implicit rendering scans for `.cf-turnstile` **only when `api.js` executes**. Names SPAs as the reason to use `?render=explicit` with `turnstile.render()`. **The single most important source in this investigation** | 02, 04, 06 |
| [Widget configurations](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/) | `data-action`, `data-callback`, `data-expired-callback`, `data-error-callback`, `refresh-expired` behaviour | 02, 04 |
| [Client side error codes](https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/error-codes/) | The documented code families. **`110200` is domain not allowed and `200100` is clock skew, both OUR misconfigurations**, which the old `startsWith("200")` branch misrouted as the visitor's browser problem | 05 |
| [Hostname management](https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/) | **"When you add a hostname, the widget will work on that exact hostname and all of its subdomains."** Wildcards unsupported; the relation is one directional, so adding `www.` does not authorise the apex. Killed the www vs apex theory | 01 |
| [Community: Turnstile on Chrome for iOS 16.5](https://community.cloudflare.com/t/turnstile-not-working-con-chrome-for-ios-16-5/507030) | Prior reports of Turnstile failing specifically on Chrome for iOS, the incident visitor's browser | 02 |
| [Community: Turnstile fails in mobile Chrome desktop mode](https://community.cloudflare.com/t/turnstile-always-fails-if-desktop-site-option-checked-in-mobile-chrome/523918) | A second mobile Chrome failure mode, "Request desktop site" | 02 |

Turnstile **test keys** used in reproduction, from the docs above: site key `1x00000000000000000000AA` and
secret `1x0000000000000000000000000000000AA` always pass; `3x00000000000000000000FF` forces an
interactive challenge. Note the always-pass secret returns `hostname: "example.com"`, which is why the
`json.hostname` check needed a test-secret exemption (see `05-known-gaps.md`).

The **Turnstile widget configuration API**
(`GET /accounts/{id}/challenges/widgets/{sitekey}`) is what returned `mode: "managed"` and the
two-hostname allowlist. It requires a token with Turnstile read permission; neither the wrangler OAuth
token nor the DNS token had it.

## Cloudflare GraphQL Analytics

The endpoint is `https://api.cloudflare.com/client/v4/graphql`. Datasets used:
`turnstileAdaptiveGroups` (account scope, **rejects ranges wider than 1w1h**),
`httpRequestsAdaptiveGroups` (zone scope, capped at a 1 day range, needs Zone Analytics Read),
`firewallEventsAdaptive`, and `workersInvocationsAdaptive`. Field naming trap recorded in `08`:
`clientRequestHTTPMethodName`, not `clientRequestHTTPMethod`.

[Cloudflare status incidents API](https://www.cloudflarestatus.com/api/v2/incidents.json) was used to
rule out a platform incident on 11 and 12 August 2026.

## OpenNext

| Source | Establishes | Used by |
|---|---|---|
| [Bindings](https://opennext.js.org/cloudflare/bindings) | How a Worker binding is reached from a route handler via `getCloudflareContext().env` | 03, 08 |
| [Custom worker entrypoint](https://opennext.js.org/cloudflare/howtos/custom-worker) | Required to add a `scheduled()` handler, because OpenNext generates the entrypoint. The reason the digest is recommended as a **separate** Worker | 03, 08, 09 |
| [opennextjs-cloudflare #652](https://github.com/opennextjs/opennextjs-cloudflare/issues/652) | `getCloudflareContext()` breaks at module scope and in static contexts | 03 |
| [opennextjs-cloudflare #458](https://github.com/opennextjs/opennextjs-cloudflare/issues/458) | Call order relative to `cookies()` and `headers()` matters | 03 |

## Florida and US privacy statutes

| Source | Establishes | Used by |
|---|---|---|
| [Fla. Stat. 501.702](https://www.flsenate.gov/Laws/Statutes/2024/501.702) | FDBR definitions. The **six conjunctive controller prongs including $1 billion revenue**, and "precise geolocation" at (22) as a **1,750 foot radius** | 10 |
| [Fla. Stat. 501.715](https://www.flsenate.gov/Laws/Statutes/2024/501.715) | The sensitive data provision. **Cross references only prongs 1 to 3, omitting the revenue floor.** The correction to the common assumption that 501.71 is the relevant section | 10 |
| [Fla. Stat. 501.72](https://www.flsenate.gov/Laws/Statutes/2024/501.72) | FDBR enforcement is DLA exclusive; expressly strips FDUTPA's private right of action | 10 |
| [Fla. Stat. 501.171](https://www.flsenate.gov/Laws/Statutes/2024/501.171) | Breach notification. "Personal information" needs **first name or initial AND last name** plus an enumerated element. (8) requires reasonable disposal. (10) establishes **no private cause of action**. Elements (VI) biometric and (VII) "any geolocation" added by SB 262 eff. 1 July 2024 | 10 |
| [Fla. Stat. 501.719](https://www.flsenate.gov/Laws/Statutes/2024/501.719) | (3) retention schedule benchmark: no longer than the initial purpose or **two years after last interaction**. Quotable, not binding here | 10 |
| [Fla. Stat. 501.204](http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0500-0599/0501/Sections/0501.204.html) | FDUTPA. No revenue floor, imports the federal deception standard | 10 |
| [Fla. Stat. 501.211](https://www.flsenate.gov/Laws/Statutes/2024/501.211) | (1) injunctive relief needs **no damages at all** | 10 |
| [Fla. Stat. 501.2105](http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0500-0599/0501/Sections/0501.2105.html) | Two way fee shifting, which is what makes an economically small FDUTPA claim viable for a plaintiff firm | 10 |
| [Texas HB 4 §541.002](https://capitol.texas.gov/tlodocs/88R/billtext/html/HB00004F.HTM) | No revenue threshold but exempts SBA small businesses. NAICS 238290 carries a $22.0M standard | 10 |
| [CCPA threshold, CPI adjusted](https://www.cppa.ca.gov/regulations/cpi_adjustment.html) | **$26,625,000** effective January 2025 | 10 |
| [Cal. B&P 22575 (CalOPPA)](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=22575) | Threshold free: any commercial site collecting from California residents must post a privacy policy | 10 |
| [15 U.S.C. 45(a)(2)](https://www.law.cornell.edu/uscode/text/15/45) | FTC Act §5. **No small business exemption**, so the doctrine reaches them even though the realistic probability is low | 10 |
| [FL AG Digital Bill of Rights annual report, Feb 2026](https://www.myfloridalegal.com/sites/default/files/2026-02/digital-bill-of-rights-annual-report.pdf) | **Zero penalties issued or collected in 2025** | 10 |

## FTC and case law

| Source | Establishes | Used by |
|---|---|---|
| [FTC 2023 Privacy and Data Security Update](https://www.ftc.gov/news-events/news/press-releases/2024/03/ftc-releases-2023-privacy-data-security-update) | **97 privacy cases since 1999**, roughly four a year across the whole US economy. The calibration for "real doctrine, low realistic probability" | 10 |
| [LabMD v. FTC, 891 F.3d 1286 (11th Cir. 2018)](http://media.ca11.uscourts.gov/opinions/pub/files/201616270.pdf) | **Governing circuit for Florida.** Vacated an FTC order for resting on "an indeterminable standard of reasonableness". Cuts both ways: the FTC pursued a small business for five years and LabMD was defunct by the time it won | 10 |

FDUTPA damages doctrine cited in `10` (market value diminution per *Rollins v. Heller*, consequential
damages excluded per *Urling v. Helms*) is stated from the privacy review and **⚠ UNVERIFIED** against
primary sources. Confirm with counsel if it ever matters.

## Telephony consent

| Source | Establishes | Used by |
|---|---|---|
| [Fla. Stat. 501.059 (FTSA)](https://www.flsenate.gov/Laws/Statutes/2024/501.059) | (8)(a) prohibits *unsolicited* sales calls using automated dialling or recorded messages, and **expressly excludes calls made "in response to an express request of the person called"**. A manual callback answering a genuine enquiry is fine. Damages $500 per message, trebled to $1,500 for willful, private right of action | 10 |
| [47 C.F.R. 64.1200](https://www.law.cornell.edu/cfr/text/47/64.1200) | (f)(5) an established business relationship arising from an **inquiry lasts only three months**. (d)(6) do not call requests must be honoured for **5 years**, so a suppression list must never be pruned | 10 |
| [Insurance Marketing Coalition v. FCC, No. 24-10277 (11th Cir. 2025)](https://media.ca11.uscourts.gov/opinions/pub/files/202410277.pdf) | Vacated the FCC one to one consent rule. **Does not touch the FTSA** | 10 |
| [FCC Order DA 25-621](https://docs.fcc.gov/public/attachments/DA-25-621A1.pdf) | July 2025, formally repealed the vacated rule | 10 |

## Performance and third party benchmarks

| Source | Establishes | Used by |
|---|---|---|
| [Tigris small object benchmark](https://www.tigrisdata.com/blog/benchmark-small-objects/) | R2 p90 PUT ~340 ms for 1 KB objects. **⚠ Vendor benchmark from a direct R2 competitor.** Treat as directional only. Cloudflare publishes no official figure | 03, 08 |
| [Community: extreme R2 latency spikes from a Worker](https://community.cloudflare.com/t/extreme-r2-latency-spikes-from-worker/607793) | 400 to 600 ms tails on ~10% of requests after idle periods. Anecdotal | 03 |

Neither was needed in the end: the hands on spike measured R2 and D1 as **indistinguishable locally at
p50 ~5 ms**, and separately found that a long lived `wrangler dev` session silently multiplies all
storage timings by roughly 20x. Production latency for both remains **unmeasured**.

---

## Internal sources

Not external, but the investigation leaned on these and they are the fastest route back into it:

| Path | What it holds |
|---|---|
| `CLAUDE.md` | Stack traps. The `dynamicParams` 404, `@/*` mapping to repo root, Archivo Expanded via `<link>`, and the pointer to this folder |
| `GTM-NOTES.md` | The prior FDBR threshold analysis, independently reached and confirmed here |
| `db/migrations/0005_unverified_leads.sql` | The 30 day retention reasoning that the archive would silently override |
| `middleware.ts` | The 90 day click id lifetime and the three Google reasons behind it, which the retention recommendation reuses |
| `app/privacy-policy/page.tsx` | Lines 26, 27, 42, 50, 65, 69 and 71 are the ones that change |
| `LAUNCH-TODO.md` 1.7 | The committed Google Sheets export, which is why spreadsheet formula injection is in scope |
| `CLIENT-ASKS.md` #12 | The outstanding privacy policy legal review, now worth more than it was |
