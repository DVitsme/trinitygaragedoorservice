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

## 🔴 PHASE 0 · Make the revenue path actually work

Nothing else matters if a lead can be submitted and lost. **Zero secrets are currently set on the
production Worker** (`wrangler secret list` returns `[]`), so today the live form skips spam
checking, sends no email, and returns success regardless.

| # | Task | Notes |
|---|---|---|
| 0.1 | ✅ **Trim whitespace in `.env.local`** | Done 2026-07-29. `CONTACT_FROM_EMAIL` had a **trailing space**, and dotenv does not trim unquoted values, so Resend would have rejected every send. Backup written alongside. |
| 0.2 | ✅ **`.trim()` the three email env reads in `route.ts`** | Done. Defensive, so this class of typo cannot silently kill leads again. |
| 0.3 | 🔴 **Push the secrets to production** | `wrangler secret put` for `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `TURNSTILE_SECRET_KEY`. **`NEXT_PUBLIC_TURNSTILE_SITE_KEY` is NOT a secret**, it is baked at build time, so it needs a rebuild and redeploy instead. |
| 0.4 | 🔴 **Decide where leads actually go** | `CONTACT_TO_EMAIL` currently points at **`@digitaldog.io`**, not Barbara. The call decided **`trinitygaragedoorservice@gmail.com`**. Recommend **both** during launch week: Barbara handles, we monitor. Resend accepts a comma separated list. |
| 0.5 | 🔴 **Fix the nine lead path defects** | `UPGRADE-PLAN.md` §9. The two that bite hardest: the client **discards the `emailed` flag** and always shows success (`contact-form.tsx:45`), and **the phone is never validated** (`phone: "x"` passes), which is the only way this business calls anyone back. |
| 0.6 | 🔴 **Turnstile must fail OPEN on outage, closed on a real verdict** | Today a Cloudflare siteverify outage returns 400 to every visitor and takes the whole form offline (`route.ts:111`). Also stop hard blocking submission when the token is absent (`contact-form.tsx:26`), which makes an ad blocker silently break the form forever. |
| 0.7 | **Add `GET /api/contact` health check** | Returns `{d1, resend, turnstile}` so one curl proves the revenue path after any deploy. |
| 0.8 | **Per sink status columns in D1** | So a partial failure is visible instead of swallowed. Remote D1 already has the `leads` table and holds **0 rows**, so nothing has been lost yet. |
| 0.9 | **Create `.dev.vars`** | It does not exist, so `pnpm preview` (the only way to exercise the real Workers runtime locally) runs with no secrets. This is why the failure has never been reproducible locally. |

**Exit test:** submit the live form, confirm the email lands, confirm the D1 row, confirm a bad
Turnstile token is rejected and a missing one is not.

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
| 1.4 | **Retire the booking modal** | Supersedes the `window.HCPWidget.openModal()` work shipped 2026-07-28. **Keep the ZIP checker** — Lloyd's actual complaint was HCP demanding a zip with no skip, and ours answers that before anyone reaches a form. |
| 1.5 | **Decide the thank you page's fate** | `/book-a-repair/thank-you/` exists only to catch HCP's booking redirect. If booking is gone, it becomes the **form** thank you page instead, which is better: our own form CAN fire a conversion event, where HCP's iframe could not. |
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
| 5.1 | 🔴🔴 **Unproxy the non website DNS records, or their EMAIL BREAKS at cutover** | Cloudflare's import set `proxied=true` on everything it could, including **`mail`, `email`, `autodiscover`, `cpanel`, `webdisk`, `whm`, `admin`**. Their mail is **Microsoft 365** (MX → `...mail.protection.outlook.com`). The proxy only carries HTTP, so proxied mail hostnames break Outlook client connectivity the moment DNS goes live. **Grey cloud all of them first.** The MX records themselves are correctly unproxied already. |
| 5.2 | **Back up the WordPress site** | Full export before anything changes. Derrick owns this. |
| 5.3 | **Add the Worker custom domain** | Apex plus `www`. The account has 5 custom domains configured and **none of them is Trinity's**, so this is genuinely missing. Replaces the apex `A → 192.124.249.158` (Sucuri, fronting the old WordPress). |
| 5.4 | **Redirect map from the old URLs** | Every old WordPress path to its new equivalent, so rankings and inbound links survive. |
| 5.5 | **Bake `NEXT_PUBLIC_*` for the real domain** | `NEXT_PUBLIC_SITE_URL` is already `https://trinitygaragedoorservice.com` in `wrangler.jsonc`. Rebuild so canonicals, sitemap and OG tags all use it. |
| 5.6 | **Add the real hostnames to Turnstile** | The widget's hostname allowlist needs the apex and `www`, not just the workers.dev address. |
| 5.7 | ⏳ **Switch nameservers at GoDaddy** | To `dorthy.ns.cloudflare.com` and `zac.ns.cloudflare.com`. **Needs client clearance. Not approved yet.** |
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
