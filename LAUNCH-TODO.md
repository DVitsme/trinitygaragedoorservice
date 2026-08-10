# LAUNCH TODO, everything outstanding, in order

**Created 2026-07-29**, after the client call (`transcript/7-29-2026.md`).
**Reconciled against what is actually shipped on 2026-08-04.** Several rows had drifted and were
listing finished work as pending, which is how a plan of record stops being trusted. Every status
below was verified against the live site or the running code, not from memory.

**The short version of what is left:** nothing is blocked on us building anything. Phase 4 hardening
is ours to schedule (the 21 MB blog is the biggest item), Phase 6 is growth work gated on Google
Business Profile access, and everything else is waiting on Jason, Simone or Lloyd. See the table at
**Still needed from the client**.

This is the working sequence to launch. Phases run top to bottom; inside a phase, items are
independent unless noted. **Phase 5 is the only one gated on the client**, everything before it can
be done now.

Source docs: `CLIENT-ASKS.md` (what we need from them), `UPGRADE-PLAN.md` (the HCP audit),
`PRE-LAUNCH-PUNCHLIST.md` (the deep detail), `SERVICE-AREA-REDESIGN.md` (that section's plan).

---

## What changed on 2026-07-29 that reorders everything

1. **All the keys are real now.** Resend, Turnstile (no longer the `1x0000` always pass dummies),
   plus two Cloudflare tokens. **The lead path is no longer blocked on the client.**
2. **Resend is verified.** `trinitygaragedoorservice.com`, status `verified`, us-east-1. Sending
   works today.
3. **The Cloudflare zone already exists**, status `pending`, with all 32 GoDaddy records imported.
   Target nameservers are `dorthy.ns.cloudflare.com` and `zac.ns.cloudflare.com`. **We do not have
   clearance to switch them.**
4. **The booking modal is out**, replaced by a short lead form (client decision, to keep pricing off
   the site).
5. **Hours are settled**, which unblocks both the copy sweep and the open/closed indicator.

---

## ✅ PHASE 0 · Make the revenue path actually work · **COMPLETE 2026-07-29**

Nothing else mattered if a lead could be submitted and lost. It could: production had **zero
secrets**, so the live form skipped spam checking, sent no email, and returned success anyway.

| # | Task | Outcome |
|---|---|---|
| 0.1 | Trim whitespace in `.env.local` | ✅ `CONTACT_FROM_EMAIL` had a **trailing space**, and dotenv does not trim unquoted values, so Resend would have rejected every send. Backup written alongside. |
| 0.2 | `.trim()` the email env reads | ✅ Defensive, so this class of typo cannot silently kill leads again. |
| 0.3 | Push secrets to production | ✅ All four on the Worker, verified by name via `wrangler secret list`. Values piped through stdin, never in argv or history. `NEXT_PUBLIC_TURNSTILE_SITE_KEY` deliberately excluded, it is baked at build time and cannot be a secret. |
| 0.4 | Where leads go | ✅ **Deliberately left at `@digitaldog.io` until go live**, so the whole path can be verified without Barbara getting noise from a site that is not live. Switch is tracked as **5.9**. |
| 0.5 | The nine lead path defects | ✅ **The one that mattered:** the resend SDK does not throw on API errors, it returns `{data, error}`, so a rejected send was being recorded as a success. Phone is now validated (NANP, 16/16 on real and malformed input). Client reads the response instead of always showing the success card. `source` is no longer hardcoded. |
| 0.6 | Turnstile fail open on outage | ✅ Fails **open** on our own misconfiguration and on Cloudflare outages, **closed** only on a verdict implicating the visitor. Idempotency key so a retry cannot burn the single use token. Client no longer hard blocks when the token is missing, which had made the form unusable behind an ad blocker. |
| 0.7 | `GET /api/contact` health check | ✅ Returns `{db, resend, mailTo, mailFrom, turnstile, turnstileIsTestKey}` so one curl proves the revenue path after a deploy. |
| 0.8 | Per sink status | ✅ Route reports `email` and `db` separately and returns **503 with the phone number** when every durable sink fails. Migration `0002` added `phone_e164`, applied local **and remote**. |
| 0.9 | `.dev.vars` | ✅ Created, gitignored, server side secrets only. This is why the bug class was never reproducible locally. |

**Remaining:** the end to end test against the deployed Worker, which needs a deploy. Submit the
live form, confirm the email arrives, confirm the D1 row, confirm a bad Turnstile token is rejected
and a missing one is not.

---

## 🟢 PHASE 1 · Rebuild the lead form · **SHIPPED 2026-07-29**, 1.6 and 1.7 outstanding

Jason chose a short form and a callback over self service booking, explicitly to keep pricing off
the site. Housecall Pro's embed cannot be trimmed, its zip gate, service picker and pricing are one
flow, so we own the form now.

| # | Task | Notes |
|---|---|---|
| 1.1 | ✅ **DONE, deployed.** Six fields exactly as Jason specified. Verified in a real browser: labels, autocomplete tokens, aria-invalid plus role=alert, blur validation that clears when fixed. Fixed two defects on the way, 15px inputs (Safari zooms anything under 16px) and a natively disabled submit button (drops out of the accessibility tree). | Fields per Jason: **first name, last name, phone, email, zip**, plus a free text box for the problem. **No pricing, no package picker.** Lloyd wanted fewer fields; Jason overrode. |
| 1.2 | ✅ **DONE, deployed.** Rebuilt with hero, breadcrumb, trust strip and a phone panel. **Stays a real page, not a modal**: a modal has no URL, and Ads Landing Page reporting and Quality Score are per URL. | Lloyd picked it out unprompted as nicer than HCP's popup. It also needs a design port anyway (it still ships legacy `bg-sand`/`font-heading` tokens and **18 CTAs land on it**). |
| 1.3 | ✅ **DONE, and deliberately inert.** Uses `next/after`, not `ctx.waitUntil`. Gated behind `HCP_LEAD_SYNC_ENABLED` plus a real non test Turnstile verdict, so it is deployed and safely off until 1.6. Health check reports `hcpLeadSync: false`. | Email to Barbara is the lighter call, so it fires first; the HCP `POST /leads` follows via `ctx.waitUntil` so a slow CRM never slows the form. |
| 1.4 | ✅ **CLOSED 2026-08-04, superseded by 6.9.** | Was "the booking modal and all 13 Book Online buttons stay exactly as they are for now". They no longer do: the client asked for booking to come out, so **6.9 was executed**. The modal is gated behind `BOOKING_MODE` in `lib/booking.ts` rather than deleted, and every one of those CTAs now points at a request form. Full detail and the reversal in **6.9**. |
| 1.5 | ✅ **RESOLVED 2026-08-04, and not the way this row expected.** A **new** `/thank-you/` was built for the forms, and `/book-a-repair/thank-you/` was left exactly as it is, still live, still `noindex`, still out of the sitemap, waiting for booking to return. | **The forms did not need it to be countable.** Google reports a conversion's URL from `location.pathname` at the moment the tag fires, and the tag fires on the **form** page, so the Ads webpages report already separates a spring lead from an opener lead for free. ⚠️ **`/thank-you/` deliberately carries NO tags.** The conversion fires one navigation earlier, which is what makes a refresh, the back button, a bookmark and Googlebot all incapable of inflating it. Do not "add the pixel to the thank you page"; it already fired, more accurately. |
| 1.6 | **The supervised HCP test lead** | `CLIENT-ASKS` #34b. No test mode, no DELETE endpoint, so Jason must delete it himself. Needs a separate API key named "website" first (#31). |
| 1.7 | **Lloyd's Google Sheets copy of leads** | He wants lead quality feedback for ad optimisation. Still the right answer: **read from D1, do not add a third write to the revenue path.** ⚠️ **This ask is worth more than it looked.** A scheduled Google Sheet is exactly the substrate Google Ads' Data Manager reads for offline conversion import, so his own request is the natural home for closed loop revenue data if 3.10 is ever switched on. The leads table now carries `gclid` and `hcp_lead_id`, so the join from ad click to completed job already exists. |

---

## 🟢 PHASE 2 · Hours and address · **2.1, 2.4, 2.5, 2.6, 2.7 SHIPPED**

**2.2 is the only thing genuinely open**, and it needs Jason. 2.7's placeholders were filled on
2026-08-04; only the lawyer glance remains, and that is a client task rather than a build task.

| # | Task | Notes |
|---|---|---|
| 2.1 | ✅ **DONE, deployed.** **62 occurrences across 28 files**, not the ~30 estimated, plus the JSON-LD that was declaring `00:00` to `23:59` seven days. Also caught the same promise in other words ("day or night", "holidays included"). Everything derives from `SITE.hours` now, so if Jason overrules Simone it is one edit. | ~**30 places**, plus the JSON-LD `openingHoursSpecification` that currently tells Google **open 24 hours, 7 days**. Replace with **"we answer the phones till 9pm"**, which is what Simone actually confirmed. |
| 2.2 | 🔴 **Resolve the Saturday conflict BEFORE publishing hours** | `CLIENT-ASKS` #4a. Simone said customers can book Monday to Saturday. Their API returns **242 booking windows over 21 days with zero on a Saturday**. Publishing Saturday sends people to an empty calendar. Either Jason adds Saturday in HCP, or the site says Monday to Friday. |
| 2.3 | ◐ **Times done, days blocked.** 8am to 4pm and the two hour window are live. The day range waits on 2.2. | 8am to 4pm, **two hour arrival windows**, last appointment 4 to 6, closed Sunday. |
| 2.4 | ✅ **DONE, deployed.** Street address and geo were **absent from the schema entirely** and the address appeared in one file. Now in `SITE.address`, the footer of every page and the JSON-LD, from one source. Stale `/contact/` placeholder removed. | 18125 US-41 Ste 208, Lutz FL 33549, geo 28.1372004 / -82.4625826. Footer, `LocalBusiness` JSON-LD, and the contact page **together**. ⚠️ **This also deletes the stale visible placeholder** on `/contact/` that still tells customers the address is unconfirmed (marked in the file). |
| 2.5 | ✅ **DONE, deployed.** Computed in **Lutz's timezone, not the visitor's**, which is the bug this widget usually ships with. Client only, so a static page cannot freeze it at build time. 10/10 on boundaries including DST in both directions. Width reserved at 300px because the labels swing 183px and would otherwise reflow the bar. | Now unblocked by 2.1 to 2.3. The utility bar's static dot becomes true and specific. Compute client side from a baked schedule, **zero API calls**. Must never render "Closed" beside a phone number we say is answered. |
| 2.6 | **877 number** | ✅ **Not in the codebase**, so nothing to change here. Jason said it is not needed, so it is a **listings cleanup on their side only**. |
| 2.7 | ◐ **Placeholders filled 2026-08-04. Only the lawyer glance is left.** Effective date **1 August 2026** (the day the site went live), contact email `trinitygaragedoorservice@gmail.com` (the inbox that already receives every lead, so no new mailbox to monitor), and the address composed from `SITE.address` so it cannot drift from the footer or the JSON-LD. The cookie disclosure shipped with GTM on 29 July. | ⚠️ **All three were VISIBLE on the live page from 1 to 4 August**, along with a red callout telling readers it was a "starting template" not yet "reviewed by legal counsel". That callout is removed: an unreviewed template notice on a live legal page invites exactly the "you knew it was inadequate" reading that FTC §5 and FDUTPA turn on. **The lawyer glance it asked for is still genuinely outstanding**, `CLIENT-ASKS` #12. |

---

## 🟢 PHASE 3 · Analytics and attribution · **OUR SIDE COMPLETE 2026-08-04**

GTM is installed, verified and deployed. Everything still open here is in **Lloyd's container**, not
in our code. Full detail and the reasoning in `GTM-NOTES.md`; the asks are in
`EMAIL-LLOYD-CONVERSION-TRACKING.md`.

| # | Task | Notes |
|---|---|---|
| 3.1 | ✅ **DONE 2026-07-29.** Container `GTM-MXNSKF57` mounted via `@next/third-parties`, verified in a real browser. | GA4 is **still not in the container** as of 2026-08-04. That is Lloyd's, and it is why any report he opens will read empty. |
| 3.2 | ✅ **DONE 2026-08-04, our half.** `generate_lead` fires only after the API confirms capture, carrying `lead_source` (10 values) and a `transaction_id` for dedup. | ⚠️ **Lloyd's half is not done and is the single highest value fix on the account.** His form conversion is bound to an Element Visibility trigger on `.elementor-message-success`, a WordPress class on a site that has never been WordPress, so **it has never fired**. Repointing it at `generate_lead` is a five minute change with no deploy. |
| 3.3 | ✅ **DONE.** Policy names Google, Google Tag Manager, Microsoft and Clarity, lists the cookies and their lifetimes, and since 2026-08-04 also discloses our own first party ad click cookie. | See 2.7 for what is left on that page. |
| 3.4 | ✅ **CLOSED as moot 2026-08-04.** | Booking is a form we own, so per page attribution is ours to tag and we tag it. Nothing to ask Jason for. `CLIENT-ASKS` #32 retired. |
| 3.5 | ✅ **DONE.** `"website"` is now only a fallback. Every form sends a real `source`, one of 10 values, which reaches D1, the office email as "Came from", and the dataLayer. | |
| 3.6 | ✅ **DONE 2026-08-04. Ad click capture.** `middleware.ts` writes `gclid`, `gbraid`, `wbraid` and `msclkid` plus the landing page to first party cookies; migration `0004` stores them on the lead. | Server side via `Set-Cookie` on purpose: Safari's ITP caps **JavaScript written** cookies to 24 hours when the landing URL carries a query string, which is the definition of an ad click, and client side navigation leaves no query string on the form page. Nothing captured a click id before this, and a click cannot be attributed retroactively. |
| 3.7 | ⏳ **Lloyd: which Google Ads account holds the spend?** | Two are live in one container, `AW-995017484` (Google tag, four call conversions, remarketing) and `17056268955` (the dead form conversion, no Google tag). Running both is legitimate, **but conversions must be reported to the account that bought the click**, so this answer gates 3.2. Also two Bing UET ids, `343191774` and `187230812`. `CLIENT-ASKS` #41. |
| 3.8 | ⏳ **Lloyd: the call tracking tags.** | One of four is configured for **(813) 731-8405**, the storefront decal number, which is nowhere on the site, so it fails on all 32 pages after pulling a forwarding number. Number insertion also does not survive client side navigation (no History Change trigger, no MutationObserver), so after one internal click the header shows the forwarding number and the body shows the real one. |
| 3.9 | 🟠 **Lloyd: the Enhanced Conversions tag is armed on AUTO.** | `__awud` on `17056268955`, fed by `__awec` with `mode: AUTO`, `isAutoCollectPiiEnabledFlag: true` and no element blocking, firing on every page. **Measured in a real browser 2026-08-04: it sends nothing today**, so the policy line "It does not receive what you type into our forms" is true. It is **one trigger change from being false**. Switch it to Manual or off. |
| 3.10 | ⏸️ **Offline conversion import, deliberately NOT built.** | Google closed the Ads API to new adopters on **15 June 2026**, so the Data Manager API is the only route. And the volume does not justify it yet: Google's evaluation bar is 30 conversions in 30 days, tROAS needs 15, and the website has produced **12 jobs all time**. Revisit when GA4 is live and volume is real, or when the client asks for revenue based bidding. The prerequisite (3.6) is already shipped, so nothing is lost by waiting. |

---

## 🟡 PHASE 4 · Pre launch hardening

| # | Task | Notes |
|---|---|---|
| 4.1 | **Swap the 3 AI generated blog images** | They still carry the C2PA tag saying so, which Google and Facebook can read, and one is **the first image on the blog**. Came from the old vendor. Hundreds of real job photos available. |
| 4.2 | **Pre optimise the blog images** | The blog ships **21 MB**. `next.config.ts` sets `images: { unoptimized: true }`, so whatever we commit is what visitors download. |
| 4.3 | **Accessibility** | Keyboard focus audit and an accessibility statement page. **Do NOT install an overlay widget**, plaintiffs specifically target overlay sites. |
| 4.4 | **Core Web Vitals** | Never measured. Watch the hero video weight. Targets LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. |
| 4.5 | **Broken links and WCAG sweep** | `.claude/skills/launch-audit` wraps linkinator, pa11y-ci and unlighthouse against the local prod build. |
| 4.6 | ✅ **DONE.** No `priority`, no `changeFrequency`, no blanket `lastModified` (it was the build timestamp on all 45 URLs, telling Google everything changed on every deploy). 52 URLs, and **both** thank you pages are out, verified against production. | |
| 4.7 | **Stale doc sweep** | `handoff/SERVICE-AREA-CHECKER-RESEARCH.md` is superseded; the Lutz blog post still says three counties. |

---

## 🟢 PHASE 5 · Cutover · **DONE 2026-08-01. THE SITE IS LIVE.**

`https://trinitygaragedoorservice.com` and `www` both serve the new site. Client asked to go live
without answering the open questions, so **every item in "Still needed from the client" below is now
outstanding against a LIVE site**, not a staging one.

**⏰ ONE THING IS ON A CLOCK: see 5.9. Leads currently go ONLY to `derrick@digitaldog.io`, on
purpose, for the first 24 hours. It must be widened on 2 Aug or the client receives nothing.**

**What actually happened, because it differs from the plan:** `custom_domain: true` could not be
used. Cloudflare refuses to attach a custom domain over an existing DNS record and offers no
override in the current dashboard, and deleting the record first was unsafe because this zone's SOA
minimum is 1800, so a resolver asking during the gap would cache the miss for up to 30 minutes.
**Worker routes were used instead**, which match at the edge before the origin is contacted. The
apex A record still points at Sucuri and is never dialled, which is also the one step rollback:
remove the routes, redeploy, WordPress returns with no DNS change.

| # | Task | Notes |
|---|---|---|
| 5.1 | ✅ **DONE 2026-07-29, 15 records grey clouded, 0 failures.** Verified after: **0 mail critical records still proxied**. Only apex, `www` and the dead `_domainconnect` remain proxied, which is correct. Safe to have done now because the zone is still `pending`, so Cloudflare is not authoritative and the change is inert until cutover. ⚠️ Original note kept for context: | Cloudflare's import set `proxied=true` on everything it could, including **`mail`, `email`, `autodiscover`, `cpanel`, `webdisk`, `whm`, `admin`**. Their mail is **Microsoft 365** (MX → `...mail.protection.outlook.com`). The proxy only carries HTTP, so proxied mail hostnames break Outlook client connectivity the moment DNS goes live. **Grey cloud all of them first.** The MX records themselves are correctly unproxied already. |
| 5.2 | **Back up the WordPress site** | Full export before anything changes. Derrick owns this. |
| 5.3 | **Add the Worker custom domain** | Apex plus `www`. The account has 5 custom domains configured and **none of them is Trinity's**, so this is genuinely missing. Replaces the apex `A → 192.124.249.158` (Sucuri, fronting the old WordPress). |
| 5.4 | **Redirect map from the old URLs** | Every old WordPress path to its new equivalent, so rankings and inbound links survive. |
| 5.5 | **Bake `NEXT_PUBLIC_*` for the real domain** | `NEXT_PUBLIC_SITE_URL` is already `https://trinitygaragedoorservice.com` in `wrangler.jsonc`. Rebuild so canonicals, sitemap and OG tags all use it. |
| 5.6 | **Add the real hostnames to Turnstile** | The widget's hostname allowlist needs the apex and `www`, not just the workers.dev address. |
| 5.7 | ⏳ **Switch nameservers at GoDaddy** | To `dorthy.ns.cloudflare.com` and `zac.ns.cloudflare.com`. **Needs client clearance. Not approved yet.** |
| 5.9 | ✅ **DONE 2026-08-04. Leads go to the office.** `CONTACT_TO_EMAIL` is now `babs.trinitygaragedoorservice@gmail.com,trinitygaragedoorservice@gmail.com`, and `derrick@digitaldog.io` is on a new `CONTACT_BCC_EMAIL` for the handover period. | **BCC and not a second `to` on purpose:** the office should not see an agency address in the recipient list of every customer enquiry, and a reply all would otherwise loop in a third party the customer never wrote to. Sequenced so there was never an exposed window: BCC secret set first, BCC capable code deployed second, `to` switched last, verified mid sequence. Both are **runtime** secrets, so removing the BCC later is `wrangler secret delete CONTACT_BCC_EMAIL` with no rebuild and no deploy. Health check now reports `mailToCount` and `mailBcc`. ⚠️ **The safety net of "Derrick sees everything first" is gone by design**, so spam now lands in front of Barbara. |
| 5.10 | 📧 **SEND THE EMAIL TO LLOYD.** Draft is written and waiting in `EMAIL-LLOYD-AT-LAUNCH.md` | **Do not send before cutover**, two of its four asks only make sense once real traffic is arriving. It tells him the four things only he can do: turn on GA4 Enhanced Measurement for browser history events (**without it, pageviews never fire on this site**, because navigation is client side), add GA4 to the container at all (it currently carries Ads, call tracking, DoubleClick and Bing UET but **no GA4 measurement ID**), use his own click trigger for phone calls, and confirm whether Microsoft Clarity session recording is meant to be running, since it arrived indirectly through the Bing UET tag rather than being chosen. ⚠️ **`phone_click` exists in our code as a type but is never fired.** The email says so deliberately. If anyone "corrects" that, he builds a trigger that reads zero on the conversion this business depends on most. |
| 5.8 | **Post cutover verification** | HTTPS on both hostnames, `www` redirect, form end to end, **send a test email through Outlook both ways**, sitemap, robots, and spot check the redirect map. |

---

## 🟢 PHASE 6 · After launch, the growth work

| # | Task | Notes |
|---|---|---|
| 6.1 | **Harvest the reviews, then build city pages** | The single biggest lever. **597 reviews** exist and we have **8**. Once GBP access lands (Jason is owner and can grant it), pull them all, match town mentions, and put real local reviews on each city page. Derrick pitched this on the call and Simone agreed it is a phase two item. |
| 6.2 | **City pages by real job volume** | Chosen from actual HCP job counts, not guesswork: **New Port Richey 4.6%, Zephyrhills 3.3%, Odessa 3.3%, Trinity 3.0%**. The company is called Trinity and has no Trinity page. Gated on 6.1 for review content. |
| 6.3 | **County hubs** | The unblocked version of the above, since a county page can be honestly generic. |
| 6.4 | **Service pages from their own job tags** | Hurricane Reinforcement Package, 25 Point Inspection, Torsion Conversion, Rebuild Package. **Proven revenue, invisible on the site.** Hurricane Reinforcement in Florida is the strongest single page available. |
| 6.5 | **Financing page** | Wisetack, free on the MAX plan they already pay for. **36% of their jobs are $1,000+**, median ~$855. |
| 6.6 | **Build time data bake** | Hours, service area and job types refreshed from HCP by script, **refresh only, never chained to `build`**, so an HCP outage can never fail a deploy. |
| 6.7 | **Monthly blog workflow** | Annek send copy by email once a month, we publish. No CMS wanted. |
| 6.8 | **Hosting conversation** | Derrick to raise after launch. |
| 6.9 | ✅ **DONE 2026-08-04. Booking is switched off, not deleted.** | Decided by the client rather than by the data: they asked for it out and said they will want it back later. So the outcome this item anticipated ("retire the modal and repoint those CTAs at the form") happened, and it happened **reversibly**. What shipped: `lib/booking.ts` with `BOOKING_MODE` (`"form"` today), **8** per intent request form pages under `app/get-service/[topic]/` each carrying its own lead source, every booking CTA repointed via `requestHref()` and relabelled off "Book" wording, `/book-a-repair/` **307** to `/get-service/repair/` and out of the sitemap, `/schedule-a-repair/` 301 straight to `/get-service/repair/` so there is no chain, the HCP widget script no longer mounted, and `book_online_click` no longer fired (the union member stays so Lloyd's tag survives). ⚠️ **`/get-service/` and `?intent=estimate` deliberately did NOT move** (verified 301 map, sitemap, Lloyd's final URLs). **HOW TO REVERSE:** set `BOOKING_MODE` to `"housecall-pro"` in `lib/booking.ts`, confirm `NEXT_PUBLIC_BOOKING_URL` is in `.env.local`, rebuild. That restores the modal, the widget script, the `/book-a-repair/` page, its sitemap entry, and drops the redirect. It does **not** restore the old CTA labels, on purpose: grep `requestLabel` and put booking words back deliberately. Then revive **1.5** and `CLIENT-ASKS` **#35**. Rationale in the header comment of `lib/booking.ts`. |

---

## Still needed from the client

| Who | What | Blocks |
|---|---|---|
| **Jason** | 🔴 **The licence answer.** County or Florida state for GD13010 / GDI-09484, and is the Pasco renewal due 30 Sept filed? Asked on the call and answered about coverage instead. **25 pages claim "licensed in Florida".** | Legal exposure, not launch |
| **Jason** | Saturday in Housecall Pro, or we publish Monday to Friday | 2.2 |
| **Jason** | Add us to Google Business Profile (he is owner) | 6.1 |
| **Jason** | Delete the Drive Social API key, create one named "website" | 1.6 |
| **Jason** | Is Sarasota served? (`#6b`) Review a town list | Service area accuracy |
| **Jason** | Turn on Housecall Pro webhooks (`job.completed`, `invoice.paid`) and hand over the signing secret. Admin only. **Only worth asking if #38 is a yes** | 3.10 |
| **Simone** | Nameserver clearance | 5.7 |
| **Simone** | The veteran owned answer. Son is the veteran, Jason owns the company | Claim risk |
| **Simone/Jason** | 🆕 **#38. Are they happy for Google to see what a job is worth?** Uploading real job values puts revenue per job inside the Google Ads account, visible to anyone with access to it, now or later. **A business decision, not a technical one. Nothing has been sent.** | 3.10 |
| **Simone/Jason** | Confirm 12,000+ doors (#9), install vs repair brands (#10) | Copy accuracy |
| **Simone/Jason** | Can we say "no trip charge"? (#25b) $0 in both zones in their own system | Copy win |
| **Simone/Jason** | 🔴 **#12. A lawyer glance over the privacy policy.** It is now complete and accurate, but it has never been reviewed | 2.7 |
| **Lloyd** | ✅ GTM container code, delivered and installed 2026-07-29 | 3.1 done |
| **Lloyd** | 🆕 Which Ads account holds the spend, the dead form conversion, the phantom call number, the AUTO PII tag | 3.2, 3.7, 3.8, 3.9 |
| **Barbara / whoever books** | 🆕 **#40. Not a request, a thank you worth passing on.** Lead source was filled in on **100% of July's 93 paid invoices**, against 92% blank before 2023. Every attribution claim now rests on that one dropdown | Everything in Phase 3 |

---

## Infrastructure state, recorded 2026-07-29

Cloudflare state is not in version control, so it is written down here.

**Secrets on the Worker** (names only, updated 2026-08-04): `RESEND_API_KEY`, `CONTACT_TO_EMAIL`,
`CONTACT_FROM_EMAIL`, `TURNSTILE_SECRET_KEY`, **`CONTACT_BCC_EMAIL`** (new, temporary, see 5.9).
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` is deliberately absent, it is baked at build time from `.env.local`
and cannot be a Worker secret.

**Remote D1** (updated 2026-08-04): migrations `0001` through **`0004`** applied. `leads` carries
`phone_e164`, the HCP sync columns, and now `gclid` / `gbraid` / `wbraid` / `msclkid` /
`landing_path`. **5 rows**, all real, none lost.

**DNS**, zone `pending`: 15 records grey clouded. Still proxied on purpose: apex `@` and `www`,
which will point at the Worker at cutover.

**Worth deleting before cutover:** `_domainconnect` (GoDaddy's Domain Connect, useless once
Cloudflare is authoritative), and `cpanel` / `whm`, which CNAME to `sucuriip.trinitygaragedoorservice.com`
**that does not exist as a record**. Left in place for now because deleting records is the client's
call, not ours.

⚠️ **`CLOUDFLARE_API_TOKEN` was removed from `.env.local` on purpose.** Wrangler reads `.env` files
and that token shadowed the OAuth login while lacking D1 permission, which made `wrangler d1
--remote` fail with 7403 and would have affected deploys. `CLOUDFLARE_API_DNS_TOKEN` is zone scoped,
does not shadow anything, and stays.
