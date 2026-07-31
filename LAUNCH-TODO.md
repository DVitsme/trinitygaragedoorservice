# LAUNCH TODO, everything outstanding, in order

**Created 2026-07-29**, after the client call (`transcript/7-29-2026.md`).

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

## 🟠 PHASE 1 · Rebuild the lead form (the call's main decision)

Jason chose a short form and a callback over self service booking, explicitly to keep pricing off
the site. Housecall Pro's embed cannot be trimmed, its zip gate, service picker and pricing are one
flow, so we own the form now.

| # | Task | Notes |
|---|---|---|
| 1.1 | **Build the form** | Fields per Jason: **first name, last name, phone, email, zip**, plus a free text box for the problem. **No pricing, no package picker.** Lloyd wanted fewer fields; Jason overrode. |
| 1.2 | **Reuse the `/get-service/` design** | Lloyd picked it out unprompted as nicer than HCP's popup. It also needs a design port anyway (it still ships legacy `bg-sand`/`font-heading` tokens and **18 CTAs land on it**). |
| 1.3 | **Send email first, then push to HCP** | Email to Barbara is the lighter call, so it fires first; the HCP `POST /leads` follows via `ctx.waitUntil` so a slow CRM never slows the form. |
| 1.4 | ⏸️ **DEFERRED to after launch, on purpose** | The booking modal and all 13 Book Online buttons **stay exactly as they are for now**. The client chose the form as the primary path, but self service booking still works and costs nothing to leave in place, and they may want a version of it back later. Revisit once real lead volume shows whether anyone was using it. See **6.9**. |
| 1.5 | ⏸️ **DEFERRED to after launch** | `/book-a-repair/thank-you/` stays live and `noindex`, catching HCP's booking redirect if Jason switches it on. It is not wasted either way: if booking is later retired it becomes the form thank you page instead. See **6.9**. |
| 1.6 | **The supervised HCP test lead** | `CLIENT-ASKS` #34b. No test mode, no DELETE endpoint, so Jason must delete it himself. Needs a separate API key named "website" first (#31). |
| 1.7 | **Lloyd's Google Sheets copy of leads** | He wants lead quality feedback for ad optimisation. Reasonable, but decide the mechanism: a Sheets append is another failure point on the revenue path. **Recommend reading from D1 or HCP instead of adding a third sink.** |

---

## 🟠 PHASE 2 · Make the site tell the truth about hours and address

All settled facts now, no client input needed.

| # | Task | Notes |
|---|---|---|
| 2.1 | 🔴 **Remove the 24/7 claim** | ~**30 places**, plus the JSON-LD `openingHoursSpecification` that currently tells Google **open 24 hours, 7 days**. Replace with **"we answer the phones till 9pm"**, which is what Simone actually confirmed. |
| 2.2 | 🔴 **Resolve the Saturday conflict BEFORE publishing hours** | `CLIENT-ASKS` #4a. Simone said customers can book Monday to Saturday. Their API returns **242 booking windows over 21 days with zero on a Saturday**. Publishing Saturday sends people to an empty calendar. Either Jason adds Saturday in HCP, or the site says Monday to Friday. |
| 2.3 | **Booking hours copy** | 8am to 4pm, **two hour arrival windows**, last appointment 4 to 6, closed Sunday. |
| 2.4 | **Roll out the verified NAP** | 18125 US-41 Ste 208, Lutz FL 33549, geo 28.1372004 / -82.4625826. Footer, `LocalBusiness` JSON-LD, and the contact page **together**. ⚠️ **This also deletes the stale visible placeholder** on `/contact/` that still tells customers the address is unconfirmed (marked in the file). |
| 2.5 | **Add the open/closed indicator** | Now unblocked by 2.1 to 2.3. The utility bar's static dot becomes true and specific. Compute client side from a baked schedule, **zero API calls**. Must never render "Closed" beside a phone number we say is answered. |
| 2.6 | **877 number** | ✅ **Not in the codebase**, so nothing to change here. Jason said it is not needed, so it is a **listings cleanup on their side only**. |
| 2.7 | **Privacy policy** | Needs the mailing address (#11), an effective date, a contact email, **and a cookie disclosure** because GA is going on (see 3.3). Then a lawyer glance (#12). |

---

## 🟡 PHASE 3 · Analytics and attribution

Blocked only on Lloyd sending the GTM container.

| # | Task | Notes |
|---|---|---|
| 3.1 | ⏳ **Embed the GTM container** | Waiting on Lloyd. He creates a **separate GA property** for the new site and owns the tags; we just mount the container and make sure it server renders. |
| 3.2 | **Fire a conversion on form submit** | Now genuinely possible, because we own the form (Phase 1). This was impossible with HCP's cross origin iframe. |
| 3.3 | 🔴 **Privacy policy must ship WITH analytics, same day** | The policy currently promises *"if we add website analytics or advertising tools in the future, we will update this policy."* GA uses cookies, unlike the Cloudflare option we had proposed, so this now needs a real cookie line. |
| 3.4 | **Per page booking attribution** | `CLIENT-ASKS` #32. Likely **moot** now that booking is a form we control, since we can tag the source ourselves. Confirm before asking Jason for anything. |
| 3.5 | **Kill `source: "website"`** | Hardcoded at `route.ts:83`. `ROUTES.estimate` is linked from **18 places** and every resulting lead is currently indistinguishable. |

---

## 🟡 PHASE 4 · Pre launch hardening

| # | Task | Notes |
|---|---|---|
| 4.1 | **Swap the 3 AI generated blog images** | They still carry the C2PA tag saying so, which Google and Facebook can read, and one is **the first image on the blog**. Came from the old vendor. Hundreds of real job photos available. |
| 4.2 | **Pre optimise the blog images** | The blog ships **21 MB**. `next.config.ts` sets `images: { unoptimized: true }`, so whatever we commit is what visitors download. |
| 4.3 | **Accessibility** | Keyboard focus audit and an accessibility statement page. **Do NOT install an overlay widget**, plaintiffs specifically target overlay sites. |
| 4.4 | **Core Web Vitals** | Never measured. Watch the hero video weight. Targets LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. |
| 4.5 | **Broken links and WCAG sweep** | `.claude/skills/launch-audit` wraps linkinator, pa11y-ci and unlighthouse against the local prod build. |
| 4.6 | **Sitemap** | Drop the fields Google ignores (`UPGRADE-PLAN` §11). Confirm `/book-a-repair/thank-you/` stays out. |
| 4.7 | **Stale doc sweep** | `handoff/SERVICE-AREA-CHECKER-RESEARCH.md` is superseded; the Lutz blog post still says three counties. |

---

## 🔴 PHASE 5 · Cutover · **GATED: no clearance to change nameservers**

The zone is staged and waiting. Do 5.1 **before** anyone touches nameservers.

| # | Task | Notes |
|---|---|---|
| 5.1 | ✅ **DONE 2026-07-29, 15 records grey clouded, 0 failures.** Verified after: **0 mail critical records still proxied**. Only apex, `www` and the dead `_domainconnect` remain proxied, which is correct. Safe to have done now because the zone is still `pending`, so Cloudflare is not authoritative and the change is inert until cutover. ⚠️ Original note kept for context: | Cloudflare's import set `proxied=true` on everything it could, including **`mail`, `email`, `autodiscover`, `cpanel`, `webdisk`, `whm`, `admin`**. Their mail is **Microsoft 365** (MX → `...mail.protection.outlook.com`). The proxy only carries HTTP, so proxied mail hostnames break Outlook client connectivity the moment DNS goes live. **Grey cloud all of them first.** The MX records themselves are correctly unproxied already. |
| 5.2 | **Back up the WordPress site** | Full export before anything changes. Derrick owns this. |
| 5.3 | **Add the Worker custom domain** | Apex plus `www`. The account has 5 custom domains configured and **none of them is Trinity's**, so this is genuinely missing. Replaces the apex `A → 192.124.249.158` (Sucuri, fronting the old WordPress). |
| 5.4 | **Redirect map from the old URLs** | Every old WordPress path to its new equivalent, so rankings and inbound links survive. |
| 5.5 | **Bake `NEXT_PUBLIC_*` for the real domain** | `NEXT_PUBLIC_SITE_URL` is already `https://trinitygaragedoorservice.com` in `wrangler.jsonc`. Rebuild so canonicals, sitemap and OG tags all use it. |
| 5.6 | **Add the real hostnames to Turnstile** | The widget's hostname allowlist needs the apex and `www`, not just the workers.dev address. |
| 5.7 | ⏳ **Switch nameservers at GoDaddy** | To `dorthy.ns.cloudflare.com` and `zac.ns.cloudflare.com`. **Needs client clearance. Not approved yet.** |
| 5.9 | 🔴 **Point `CONTACT_TO_EMAIL` at Barbara** | Held at `@digitaldog.io` on purpose until go live (see 0.4). At cutover set it to `trinitygaragedoorservice@gmail.com`, or both addresses comma separated for the first week so we can still see what arrives. `wrangler secret put CONTACT_TO_EMAIL`, no rebuild needed. **If this is forgotten, the client never receives a single lead.** |
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
| 6.9 | 🔔 **REMINDER: decide the fate of online booking** | Deferred from Phase 1 (**1.4** and **1.5**) at the client's request, so a version of it can be brought back if they want one. Everything is still in place and working: the HCP booking modal, all **13** Book Online buttons, `/book-a-repair/`, and the `noindex` thank you page. **What to look at before deciding:** once the lead form has real volume, compare form submissions against actual HCP online bookings. If nobody books online, retire the modal and repoint those 13 CTAs at the form, and the thank you page becomes the form's confirmation, which is strictly better because our own form CAN fire a conversion event where HCP's cross origin iframe could not. If people DO book online, keep both and stop treating it as a decision. |

---

## Still needed from the client

| Who | What | Blocks |
|---|---|---|
| **Jason** | 🔴 **The licence answer.** County or Florida state for GD13010 / GDI-09484, and is the Pasco renewal due 30 Sept filed? Asked on the call and answered about coverage instead. **25 pages claim "licensed in Florida".** | Legal exposure, not launch |
| **Jason** | Saturday in Housecall Pro, or we publish Monday to Friday | 2.2 |
| **Jason** | Add us to Google Business Profile (he is owner) | 6.1 |
| **Jason** | Delete the Drive Social API key, create one named "website" | 1.6 |
| **Jason** | Is Sarasota served? (`#6b`) Review a town list | Service area accuracy |
| **Lloyd** | The GTM container code | 3.1 |
| **Simone** | Nameserver clearance | 5.7 |
| **Simone** | The veteran owned answer. Son is the veteran, Jason owns the company | Claim risk |
| **Simone/Jason** | Confirm 12,000+ doors (#9), install vs repair brands (#10), mailing address (#11) | 2.7 |
| **Simone/Jason** | Can we say "no trip charge"? (#25b) $0 in both zones in their own system | Copy win |

---

## Infrastructure state, recorded 2026-07-29

Cloudflare state is not in version control, so it is written down here.

**Secrets on the Worker** (names only): `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`,
`TURNSTILE_SECRET_KEY`. `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is deliberately absent, it is baked at
build time from `.env.local` and cannot be a Worker secret.

**Remote D1**: migrations `0001` and `0002` applied. `leads` now has `phone_e164`. **0 rows**, so
nothing has ever been lost.

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
