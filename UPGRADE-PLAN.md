# UPGRADE PLAN — Housecall Pro data, live integrations, and new pages

**The working document.** Everything we found by auditing the whole project against the client's
real Housecall Pro data. This supersedes scattered notes and is the plan of record.

Created **2026-07-28** · Live: https://trinity-garage-door.derrick-2fd.workers.dev
Companions: `HOUSECALL-PRO-API.md` (API reference) · `CLIENT-ASKS.md` · `CLIENT-NOTES.md` ·
`PRE-LAUNCH-PUNCHLIST.md`

> ### 👉 If you read one section, read **§4 — What the Housecall Pro deep dive unlocks**
> Nine upgrades, each with **what it actually buys the business**, plus five facts the API handed
> us that cost nothing to use, plus what we deliberately decided **not** to build and why.
> Everything there exists *because* we got API access — none of it was buildable before.
>
> The rest of this document is the audit that produced it: §2 and §5 are what was shipping false,
> §9 is the lead path, §12 is new pages, §13 is the five questions only the client can answer.

> **Priority key:** 🔴 **P0** shipping something false or losing leads · 🟠 **P1** wrong or
> materially incomplete · 🟡 **P2** real improvement · 🟢 **P3** opportunity, needs a decision
> **Effort:** S = under an hour · M = half a day · L = multi day

---

## ✅ Done 2026-07-28 — five of the seven false-information items

Build green, verified against the production server (not `next dev`).

| Fixed | Was | Now |
|---|---|---|
| Internal build note on the homepage | *"Figures provisional, final stats confirmed before launch"* shipping to customers | **deleted** |
| Doubled brand in every page title | spring repair at **103 chars**, Lutz 90, FAQ 85 | **73 / 60 / 55.** Removed the `template` in `app/layout.tsx`, since all 33 pages already carry the brand |
| Google rating | `4.9 on Google` in 3 places | **`5.0 on Google, 597 reviews`** |
| Coverage claim | `6 Cities Covered` ×2 + "across six cities" | **`5 Counties Covered`**, and the counties named in prose |
| Emergency page CTA | red button sent 3am visitors into a Mon-Fri 8-4 booking flow | **phone is now the red button**; booking demoted to secondary. Added `primaryCta: "phone"`. Other 7 detail pages unchanged, verified |
| "We don't share your info" | false, and FDUTPA carries fee shifting | *"We use your details to answer you and schedule the work, nothing else."* |

**Deliberately NOT touched — routed to `CLIENT-ASKS` #4 and #4b instead:**
the **contact page hours** and the **JSON-LD `openingHoursSpecification` claiming 24/7**. Both
could be intentional: a phone line genuinely answering around the clock is a different claim from
online booking hours, and only Jason knows which is true. Changing them on an assumption risks
deleting a real competitive advantage. **Ask first.**

Left alone on purpose: **"12k+ Doors Serviced"**. HCP records start Oct 2019, so nothing in this
audit can disprove a lifetime figure covering 2007 onward.

---

## 0. The headline

Their own CRM says the website is **not producing work**. Of the 300 most recent jobs, exactly
**one** carries the lead source "Trinity Website."

| Lead source | Share of 300 recent jobs |
|---|---|
| Repeat customer | **146 (49%)** |
| Google (Maps + Ads + organic + LSA) | 61 (20%) |
| Referral | 23 (8%) |
| Yelp | 14 |
| Angi | 13 |
| Trinity Sticker | 12 |
| **Trinity Website** | **1** |
| Chat GPT | 2 |

Two things follow. **Half their business is repeat customers**, so retention is the engine and
the site should serve returning customers as well as new ones. And **the website is close to a
standing start**, which means almost any improvement is upside, and we have a clean baseline to
measure against once tracking is on.

The `Chat GPT` entries are worth noting: AI search is already sending them work.

---

## 1. Verified facts (all live-tested 2026-07-28)

Everything in this section came from Trinity's own Housecall Pro account, so it is authoritative.

| Fact | Value | Beats |
|---|---|---|
| Address | 18125 US-41, Suite 208, Lutz FL 33549 | Unconfirmed guess |
| Geo | 28.1372004, -82.4625826 | Missing from schema |
| Phone | (813) 279-6785 | Matches the site ✅ |
| Email | trinitygaragedoorservice@gmail.com | "no public email" |
| **Booking hours** | **Mon to Fri 08:00 to 16:00, closed weekends** | Site says Mon to Sat 7am to 9pm ❌ |
| Arrival window | **120 minutes** | Unused on the site |
| Trip charge | **$0** | Unused on the site |
| Service area | **130 ZIPs · 41 cities · 5 counties** | Site claims 6 cities |
| Bookable services | Only **Install** and **Repair** | Site shows 6+ categories |
| Active techs | Jason, Tyler, Jonah, David, Bryce | — |
| Inactive | Simone Cameron, Barbara Fernandez, Joey Rodriguez | — |

**Volume:** 6,001 customers · 7,673 jobs · 8,211 invoices · 2,425 estimates · 259 leads.

### The "12k+ Doors Serviced" claim holds up
I set out to disprove it and could not. HCP's records **only start 2019-10-17**, and cover 7,673
jobs in the ~6.75 years since. The 2007 to 2019 period is not in the system at all. At even a
modest early rate, 12,000 lifetime is reachable, and a single job can service more than one door.
**Leave the claim as is.** Current run rate is ~956 jobs in 2026 so far.

### Job values justify a financing conversation
From 500 recent jobs: median **~$855**, and **36% are $1,000 or more** (135 of 366 charged jobs),
including 45 jobs above $2,500. Housecall Pro MAX already includes **Wisetack** consumer
financing at no extra cost. See §7.

---

## 2. 🔴 P0 — We are shipping false information right now

### P0-A · The hours on the live site are wrong · **S**
`app/contact/page.tsx:104` renders **"Mon to Sat, 7am to 9pm · Sun closed"**. Housecall Pro, the
system that actually takes their bookings, says **Mon to Fri 08:00 to 16:00, closed weekends**.
Verified live on the deployed site, not just locally.

> ⚠️ **A trap:** `lib/site.ts:196` has a `HOURS` export with the same wrong value, but it is
> **never imported anywhere**. Fixing that constant alone changes nothing. The contact page
> hardcodes the string. Fix both, and wire the page to the constant so they cannot drift again.

**Blocked on the client:** we now have three conflicting sources (Google, their front door, HCP).
`CLIENT-ASKS.md` #4. Do not guess. But the current value matches none of them.

### P0-B · "24/7" appears on roughly 30 pages · **S to fix, needs a client answer**
Grep finds `24/7` across ~30 locations including the homepage, contact, services hub, and four
city pages. Their booking system is open **weekdays 8 to 4**.

This is not automatically wrong. Many trades take emergency calls by phone outside booking hours.
But **we cannot verify it, and it is the single most repeated promise on the site.** Ask Jason
directly: is there genuinely someone answering at 2am on a Sunday? If yes, keep it and say so
plainly. If it means "we try hard," the wording has to change. Advertising 24/7 emergency service
that does not answer is the kind of thing that produces one furious review.

---

## 3. Services they actually sell that the website never mentions

This came out of their Housecall Pro **job tags** — the categories they file real work under.
These are not ideas; they are services with revenue already attached.

| Their tag | Mentions on site | Opportunity |
|---|---|---|
| **Hurricane Reinforcement Package** | **0 as a service** | 🟠 Big. In Florida. "Hurricane" appears 13 times but only as door-spec and educational copy, never as something you can buy. |
| **25 Point Garage Door Inspection** | **0** | 🟠 A named, concrete, sellable service. Perfect as the identity for the existing `/services/repair/tune-up/` page. |
| **Torsion Conversion w/ High Cycle Neoprene Rollers** | **0** | 🟡 A classic upsell from extension to torsion springs. Nothing on the site explains it. |
| **Rebuild Package / Extension Rebuild Package** | **0** | 🟡 Middle option between repair and replacement. |
| Springs & Bearings / Springs, Rollers & Bearings packages | partial | 🟡 The spring page covers springs, not the packaged offers. |
| Service Package | 0 | 🟢 Recurring revenue, and HCP supports recurring service plans on MAX. |

**Recommendation:** a **Hurricane Reinforcement** service page is the highest-value single page
on this list. Florida homeowners search for it seasonally, insurers ask about it, and they
already do the work.

---

## 4. What the Housecall Pro deep dive unlocks

**This is the section to read if you only read one.** Every item below exists *because* we got API
access; none of it was buildable before. The middle column is the point — what it actually buys
the business, not how clever it is.

### A. Build these

| # | Upgrade | **What it actually buys us** | Effort |
|---|---|---|---|
| 1 | **Booking modal** — `window.HCPWidget.openModal()` | Booking opens **on the page** instead of throwing the visitor into a new tab, which is where funnels leak. Paired with #4 it is also the first time a booking becomes **countable**. **Free bonus once the script is mounted:** any URL containing **`?booking`** auto-opens the modal, so email and ad campaigns can deep link straight into the booking flow at no extra cost. | **S** |
| 2 | **ZIP service-area checker + a real map** → **full plan in `SERVICE-AREA-REDESIGN.md`** | Answers the question every caller asks first, **"do you even come out here?"** — instantly, without a phone call. It also surfaces the **35 towns the site currently hides**, so a Spring Hill visitor stops bouncing. Fills the dead feature slot at `app/page.tsx:293-301`. Now scoped to also **replace the four fake CSS maps** with the real 130 ZIP footprint drawn from Census data: measured **1,051 bytes gzipped**, versus 499 KB for Mapbox GL JS. Checker lookup is another 783 bytes. No API key, no runtime call, **$0**. | **S/M** |
| 3 | **Lead sync** — `POST /leads` | Puts website leads **where Jason actually works**. Today a lead lands in an inbox that can spam-folder and a D1 table he will never open. In Job Inbox it **texts him** and sits beside his Angi and Yelp leads in the same workflow. The metric that matters is whether a truck gets dispatched, and this is the only thing that moves it. **Also makes the rebuild measurable**, via the "Trinity Website" lead source that already exists in his reporting. | **M** |
| 4 | **`/book-a-repair/thank-you/`** | **Right now bookings are completely unmeasured.** HCP fires **no completion event**, so the dashboard "booking redirect" to a page we own is the *only* supported way to know a booking happened. Without it, every future claim about whether the site works is a guess. | **S** |
| 5 | **Build-time data bake** (hours, service area, job types) | Kills the whole *class* of bug this audit is full of: facts hardcoded once and silently rotting. Wrong hours, "6 cities", stale counts. Same proven pattern as `generate-blog.mjs`, but **refresh-only, never chained to `build`**, so an HCP outage can never break a deploy. | **M** |
| 6 | **Service pages from their own job tags** — Hurricane Reinforcement, 25 Point Inspection, Torsion Conversion | **Proven revenue, not a guess.** These are services they already bill for, invisible on the site. **Hurricane Reinforcement in Florida** is the strongest single page available: seasonal demand, insurance relevance, and they already do the work. | **M** |
| 7 | **Per-page booking links** (HCP tracking attributes) | Per-page booking attribution, so "which page produces bookings" stops being unanswerable. **There is no API route to this** — only Jason generating the links. Costs him minutes. | **S** |
| 8 | **Financing page** (Wisetack, free on MAX) | **36% of their jobs are $1,000+**, median ~$855, so a third of the work is genuinely in financing territory — and they are already paying for the tool. Only 1 of 8 competitors does this well. | **M** |
| 9 | **County hubs**, then the city tranche | The site claims 6 cities against **41 served**. Their biggest competitor runs **150+ city pages**. County hubs are the unblocked version, and the tranche is now chosen from **real job counts** rather than guesswork. | **M / L** |
| 10 | **"Office open now / after hours" indicator** in the utility bar | Turns the site's most exposed liability into a selling point. The static `24/7 Emergency Service` dot becomes **true and specific**: "Office open now" during business hours, "After hours, emergency line open" otherwise. **Zero API calls** — bake the schedule from `/company/schedule_availability` and compute client side from the visitor's clock. ⚠️ **Blocked on `CLIENT-ASKS` #4/#4b**, and it must never render the word "Closed" beside a phone number we advertise as 24/7. | **M** |

### B. Facts the API handed us that cost nothing to use

Pure copy wins — no build, no integration, just true things we were not saying.

| Fact | Benefit |
|---|---|
| **120 minute arrival window** | Concrete instead of vague. A real Google review already describes it in the customer's own words, so it is double sourced. Currently `book-a-repair` **invents an example** instead of stating the real policy. |
| **$0 trip charge** | "We come to you, no trip charge" is a genuine differentiator, used nowhere. |
| **Verified address + geo** | Unblocks the LocalBusiness schema that has been waiting on a confirmed NAP, flagged HIGH-RISK for local SEO. |
| **5 counties, 41 cities, 130 zips** | Replaces an understated "6 cities" everywhere it appears. |
| **5.0 from 597 reviews** | The truth was better than the claim. ✅ shipped. |

### C. Deliberately NOT building

| Item | Why |
|---|---|
| **Live availability calendar** | Possible now, but it means **owning a booking UI we currently get free**, and our own test returned 96 windows all flagged `available: true` — the flag may not reflect booked work. Shipping a wrong "next available" is worse than none. Revisit only after validating against Jason's dispatch board. |
| Live job/review counters | A runtime dependency on a static page for a vanity number nobody reloads to watch. Bake it. |
| `Service` schema / `aggregateRating` / review widgets | See §8. Each has a specific, sourced reason. |

**The governing principle:** this site is static and cheap **because** it is static. Anything that
adds a **runtime** third-party call on page load trades that away. Prefer **build-time baking**
(proven by the blog) or **client-side on interaction** (the ZIP checker needs no network at all).

---

## 5. 🔴 P0 — The rest of the launch blockers

### P0-C · An internal build note is live on the homepage · **S**
`app/page.tsx:224` renders, to customers, directly under the stat block:

> *"Figures provisional, final stats confirmed before launch."*

**Confirmed live in the deployed HTML.** It undermines the four numbers above it. Delete it as
part of fixing the stats, not before.

### P0-D · Structured data tells Google they are open 24 hours, 7 days · **S**
`components/json-ld.tsx:27-34` publishes `opens: "00:00", closes: "23:59"` for all seven days.
Verified live. Housecall Pro says Mon to Fri 8 to 4.

This is the **only** place the site states hours in a machine-readable way, and it is the most
aggressive of the four conflicting answers now in play (site, Google, front door, HCP). Google
cross-checks this against the Business Profile. **Until Jason confirms, removing the block is
safer than publishing a claim we cannot support** — Google then falls back to the Business
Profile, which is correct by definition.

### P0-E · The emergency page sends 3am visitors into a weekday booking flow · **S**
`app/services/repair/emergency/page.tsx` never sets `primaryCta`, so
`components/blocks/repair-detail-layout.tsx:65` defaults it to **Book a Repair**. Someone whose
car is trapped at 11pm clicks the big red button and lands in a flow that offers **Monday 8am**.

The page's own copy says to call for a true emergency. **The phone should be the red button
here**, with booking demoted to secondary. Note `RepairDetailData` only allows
`"repair" | "estimate"` (`repair-detail-layout.tsx:31`), so a phone primary needs a small type
change, or just swap the two existing buttons.

### P0-F · License claims say "Florida" but may be county licenses · **M · CLIENT MUST CONFIRM**
`lib/site.ts:28` holds `"FL GD13010 / GDI-09484"`, and the string is **hardcoded across 25
files**. Several assert licensure *in Florida*:

> `app/resources/faq/page.tsx:51` — "fully licensed, bonded, and insured **in Florida** under
> GD13010 and GDI-09484" (also `app/about/our-story/page.tsx:50`)

An audit against their BBB profile indicates these are **county** licenses (Hillsborough and
Pasco), not Florida DBPR state licenses, and that the **Pasco one expires 2026-09-30** — about
nine weeks out. **I could not independently verify this** (web search budget exhausted), so treat
it as a serious flag rather than an established fact.

Two things follow regardless of how it resolves:
1. **Misstating a regulated credential is the one item here with legal exposure.** Everything
   else is marketing accuracy.
2. **If they are county licenses for Hillsborough and Pasco only, the site advertises them on
   Pinellas city pages** (Palm Harbor, Oldsmar) and now claims 5 counties of coverage.

**Do not edit the copy on a guess.** Ask Jason: which counties are you licensed in, is the Pasco
renewal filed, and do you hold a state DBPR license? Added to `CLIENT-ASKS.md`.

---

## 6. 🟠 P1 — Wrong or materially incomplete

### 6.1 The stats band understates them twice and overstates them once

| Stat | Shipping | Reality | Recommendation |
|---|---|---|---|
| Years of Service | `19+` derived ✅ | correct | leave |
| Doors Serviced | `12k+` | HCP proves 7,673 jobs **since Oct 2019 only** | **Defensible, but unprovable.** Consider **"6,000+ Homeowners Served"** — provable from `/customers`, rounds down, and reads more human |
| Average Rating | `4.9★` | **5.0 from 597 reviews** | **The truth is better.** `5.0★ · 597 Reviews`. A perfect score with volume reads real; without volume it reads fake |
| Cities Covered | `6` | **41 cities / 5 counties** | **`5 Counties Covered`** — bigger, unambiguous, and consistent with a nav that lists 6 cities |

Also hardcoded at `components/blocks/trust-strip.tsx:16` and `app/about/reviews/page.tsx:12,50`.
HCP has **no reviews endpoint**, so the 5.0/597 must be hand-maintained. Put the capture date in
a comment.

> ⚠️ **The trap that will waste an hour.** `STATS`, `HOURS`, `SERVICES` and `IG_TILES` in
> `lib/site.ts` have **zero importers**. The homepage keeps its own local copies
> (`app/page.tsx:30-35`, `:48-55`, `:66-73`). Editing `lib/site.ts` alone changes **nothing**.
> Fix the page, then collapse to one source.

### 6.2 The service area is understated in ten more places
"across Hillsborough, Pasco, and Pinellas" appears **10 times** — `app/services/page.tsx:190`,
`app/services/repair/page.tsx:141`, and the `whyTrinity.lead` on all 8 detail pages. HCP
dispatches **5** counties. Hernando and Polk customers are being told they are out of area.

The string is duplicated verbatim 8 times. **Lift it to `lib/site.ts` and fix once.**

### 6.3 Facts we own but never use
- **120 minute arrival window.** Double sourced: HCP's `default_arrival_window`, *and* a real
  Google review describing it in the customer's own words. Used on **zero** service pages, while
  `app/book-a-repair/page.tsx:54` **invents** an illustrative example instead. Replace the
  invention with the real policy.
- **$0 trip charge.** Confirmed in both service zones. Never mentioned. "We come to you, no trip
  charge" is a genuine differentiator.
- **Street address + geo.** Now confirmed, still missing from schema and the footer.

### 6.4 CTA intent bugs
| Bug | Location | Fix |
|---|---|---|
| Replacement sends replacement intent into **repair booking**, while its sibling Installation correctly sends to **estimate**. Same commercial motion, same HCP job type, and the page's own band is titled "Start With A Free Estimate" | `app/services/replacement/page.tsx:20` | one word → `"estimate"` |
| The `/services/` hub, top of funnel, has **no booking CTA at all** | `app/services/page.tsx:92` | add the primary |
| `/doors/brochures/` hero has **zero CTA** despite ending "we'll take it from there with a free estimate" | `app/doors/brochures/page.tsx:106-109` | add the button pair |
| Header CTA says "Book a Repair" on the two pages whose heroes say "Free Estimate" | `lib/site.ts:270` | extend `getNavConfig` |

### 6.5 Contradictions the audit caught
- **"Estimates during normal hours are free"** (`emergency:98`) vs **"free estimates every
  time"** ten lines later (`emergency:108`) and unconditionally on 8 other pages. Pick one.
- **Wayne Dalton listed as an opener brand** (`app/services/repair/page.tsx:215`) while
  `/doors/brands/` explicitly corrects that it is a door maker that stopped making openers.
- **"Same Day Service" badge on Replacement and Tune Up.** Replacement's own copy says "once
  your door is in" — that is weeks. Tune up is scheduled maintenance.
- **`BRAND_CATALOG.relationship` has no consumer.** `/doors/brands/` hardcodes a parallel copy,
  so when the client answers the install-vs-service question, updating `lib/site.ts` will change
  nothing on the page.

### 6.6 `BookOnlineButton` can silently do nothing
`components/book-online-button.tsx:34-40` — if `SITE.bookingHref` fails the `https?` test, in
production it does **nothing at all** (the warning is dev only), and the fallback `"#book"` fails
that test. `NEXT_PUBLIC_*` is inlined at **build** time, and `NEXT_PUBLIC_BOOKING_URL` is not in
`wrangler.jsonc`, so a deploy from a machine without a populated `.env.local` ships a dead
primary CTA with a green build and no error.

**Currently fine** — the URL is baked into the live bundle, verified. It is a latent trap.
**A booking button should never be able to do nothing** — fall back to a link.

---

## 7. What we learned about wiring the booking modal

**The modal is not wired anywhere.** `grep HCPWidget` returns zero hits repo-wide.

**`BookOnlineButton` is used on exactly 4 pages** — the homepage and `/book-a-repair/` ×3. **Every
other booking CTA sitewide is a plain link to the `/book-a-repair/` interstitial.** So "wire the
modal" does **not** make the header, sticky bar, or mobile drawer open a modal. Say this out loud
before anyone assumes otherwise.

**Free upgrade:** HCP's script auto-opens the modal when the page URL contains **`?booking`**. So
pointing those links at `/book-a-repair/?booking` keeps the interstitial *and* auto-opens the
modal, without touching the components.

**Two gotchas:**
- The baked URL is missing **`?v2=true`**, which the embed script hardcodes. The hosted-link path
  every visitor gets today may render a different booking UI than the modal will.
- When the planned CSP `script-src` pass lands it must allowlist
  `https://online-booking.housecallpro.com` and `frame-src https://book.housecallpro.com`, or
  booking breaks silently.

**Per service deep links are impossible via the API.** Tested live: passing a job type id as
`service_id` returns **404 "Service not found"**, and `/price_book/services` 404s on this
account. The only route to per-page attribution is Jason generating **tracking attribute links**
in HCP settings, one per page. That is `CLIENT-ASKS` #32.

---

## 8. What the audit says NOT to build

Recording these so nobody re-derives them.

| Idea | Verdict |
|---|---|
| **Live "next available" slot in the hero** | ❌ **Not yet.** All 96 windows returned `available: true`, zero unavailable — the flag may not reflect booked work. A wrong "next available" is worse than none. It would also drag in an R2/KV incremental cache this project does not have, turning a zero-invocation static page into a per-request Worker call against an API with no published rate limits. |
| **"Next available" on the emergency page** | ❌ **Actively harmful.** At 11pm it would render "Next available: Monday 8:00 AM" — the exact opposite of the page's promise. |
| **Live job/review counters** | ❌ Runtime dependency for a vanity number nobody reloads to watch. Bake it. |
| **Pulling reviews from HCP** | ❌ Impossible. No reviews endpoint. |
| **Surfacing `/events`** | 🚫 **Never.** Staff medical appointments and family commitments. |
| **Baking employees, customers, jobs or invoices into the repo** | 🚫 Never. PII, and 3 of 8 staff are inactive. |
| **`Service` schema on the service pages** | ❌ **Do not build.** Absent from Google's search gallery, and a Google structured-data engineer publicly declined the exact request, pointing at LocalBusiness/Organization instead — which this site already has. A controlled study of 1,885 pages found adding schema produced no uplift in AI citations. |
| **`aggregateRating`** | ❌ Keep omitting it. Ineligible by policy for self-serving markup, and the sourcing is separately restricted. |
| **A third-party review widget** | ❌ The ones showing more than 5 reviews are almost certainly caching Places content, which the terms prohibit — and we would be the party publishing it. |

**The governing principle:** this site is static and cheap because of it. Prefer **build-time
baking** (the blog already proves the pattern) or **client-side on interaction** (the ZIP checker
needs no network at all) over runtime API calls.

---

## 9. 🔴 The lead path — root cause found, and it is two lines

`PRE-LAUNCH-PUNCHLIST.md` P0-2 says a misconfigured Worker can show "success" while dropping the
lead. **We found exactly why, and it is smaller than expected.**

`app/api/contact/route.ts:92` returns:
```ts
return NextResponse.json({ ok: true, emailed });   // the route KNOWS if email failed
```
`components/contact-form.tsx:45` types the response as `{ error?: string }` and only checks
`res.ok`. **It never reads `emailed`.** The information needed to tell the truth is already
crossing the wire and being thrown away.

### The other confirmed defects on this path
| # | Finding | Verified |
|---|---|---|
| **1** | Client discards `emailed` and always shows the success card | `contact-form.tsx:45-51` |
| **2** | Every D1 error is swallowed (`route.ts:88`). If the remote migration never ran, **every** insert throws and **every** visitor still sees success | ✅ |
| **3** | **The phone is never validated.** `phone: "x"` passes. It is the only way this business calls anyone back, and it has weaker validation than the optional email field | `route.ts:24-28` |
| **4** | Turnstile **fails closed** — a Cloudflare siteverify outage returns 400 to every visitor and takes the whole form offline | `route.ts:111-113` |
| **5** | The client **hard-blocks submission** if the Turnstile token is absent, so an ad blocker silently makes the form unusable forever | `contact-form.tsx:26-30` |
| **6** | **Turnstile keys are `1x0000000000…`** — Cloudflare's documented **always-pass** dummies. Worse than no protection, because the code path, the widget and the punch list all read as "configured" | ✅ confirmed in `.env.local` |
| **7** | **`.dev.vars` does not exist.** `pnpm preview` — the only way to exercise the real Workers runtime locally — runs with zero secrets. The P0-2 failure has never been reproducible because the environment that reproduces it was never populated | ✅ |
| **8** | **No attribution.** `source` is hardcoded `"website"`. `ROUTES.estimate` is linked from **18 places** and every resulting lead is indistinguishable | `route.ts:83` |
| **9** | `app/get-service/page.tsx` was **never design ported** — legacy `bg-sand`/`font-heading` tokens, no breadcrumb, no phone, no trust strip. **18 CTAs land there.** The highest intent form on the site sits on its weakest page | ✅ |

### The fix, in order
1. **Make the response honest.** Per-sink status columns in D1, a real **503 with the phone
   number** when every durable sink fails, and a `GET /api/contact` health check returning
   `{d1, resend, turnstile, hcp}` so one curl proves the revenue path after a deploy.
2. **Validate the phone.** Ten to fifteen digits.
3. **Fail open on Turnstile outage**, fail closed only on an actual invalid verdict.

**This block stands alone, depends on nobody, and is worth more than the HCP integration.** Ship
it first.

### Then push leads to Housecall Pro — behind an interlock
`POST /leads` with an inline customer, `lead_source: "Trinity Website"`, landing in **Job Inbox →
New Lead** with a text to Jason. The real argument is not redundancy: **HCP is the only sink
Jason works out of.** Email can be spam foldered; D1 is invisible to him. The metric that matters
is whether a truck gets dispatched.

**The gate, and why it is structural rather than procedural:** only push when Turnstile both
passed *and* is using a non test key. With today's dummy keys that evaluates false, so the
integration can be **merged and deployed while still safely inert**. It switches itself on when
real keys land, and cannot be forgotten in a launch day scramble.

**Why spam here is unusually bad:** it texts Jason every time, there is **no DELETE endpoint** so
cleanup is manual forever, every spam lead **adds a customer record** to the 6,001 they mail
postcards to, and it **corrupts the "Trinity Website" lead source** — the exact number the client
will use to judge whether this rebuild worked.

**Retry policy matters more than usual.** No idempotency key plus no DELETE means a blind retry
can permanently duplicate a real person. Retry **only** where the response proves nothing was
written (422, 429). **Never on 5xx or timeout** — those are ambiguous.

Run the whole push after the response via `ctx.waitUntil`, so a slow CRM can never slow the form.

### ✅ Schema pre-flight is DONE — settled 2026-07-28 without a write
The three unknowns are resolved by inspecting existing leads read only. Detail in
`HOUSECALL-PRO-API.md` §11.

- **`lead_source` is a bare string.** Send `"Trinity Website"` directly. No id, no lookup call.
- **`tags` are neither required nor pre-existing.** Empty on every lead sampled. Omit the field.
- **A street-less address is accepted.** This was the riskiest one, because our form has no street
  field and a 422 would have failed the whole write. **41 of 100** leads with an address have no
  street. Normal in their data.
- Correction: `job_fields` uses **`job_type_uuid`**, not `job_type_id`.

So the schema work that would otherwise have meant trial and error against a live 6,001 customer
account is finished, and the account was never touched.

### ⛔ THE REMAINING GAP — one supervised test write, and it needs Jason

This is the **only** thing between here and lead sync going live, and **it cannot be closed by us
alone.**

**Why it is still a gap.** There is **no sandbox**, and **no DELETE endpoint** for customers,
jobs, leads or estimates. So the first real `POST /leads` is **permanent from our side** — the
only way to remove it is a human clicking Delete in the Housecall Pro web app. We can create the
test record; **we cannot clean it up.** That is the dependency.

**The procedure, in order:**

1. **Jason issues a separate website-only API key** (My Apps → API Key Management, Admin only).
   Do **not** reuse the key shared with the marketing agency, or revoking one breaks the other.
2. **Real Turnstile keys first.** The current ones are always-pass dummies. The push is gated on
   `humanVerified`, so it stays safely inert until then, but do not ungate it before this lands.
3. **One test lead, from `pnpm preview`, never from production:**
   - name `ZZ Test Website Lead`
   - phone **`(813) 555-0142`** — the reserved fictional range is **555-0100 to 555-0199**.
     **Not** 555-1212, which is real directory assistance.
   - email `test@example.com` (IANA reserved, cannot reach a real inbox)
   - **`notifications_enabled: false`**
4. **Verify** it lands in **Job Inbox → Pipeline → New Lead** under the "API Leads" channel with
   source "Trinity Website". Creating a lead notifies nobody, so this is safe to leave briefly.
5. **Jason deletes it** in the web app. Deletion there is soft, restorable, and does not notify
   the customer.
6. Only then enable the push in production.

**Before step 3, check My Apps for active Zapier or webhook automations.** A `lead.created`
automation could forward the test record into a second system that HCP cannot clean up either.

> **Do not skip step 5 and leave the record.** It would sit in the 6,001 customer database they
> mail postcards to, and it would show up in the "Trinity Website" lead source report — the exact
> number the client will use to judge whether this rebuild worked.

---

## 10. Sequenced plan

**Do these in order. Each block is independently shippable.**

| Block | What | Why this order |
|---|---|---|
| **1. Stop shipping false things** | Delete the "figures provisional" note · fix/remove the 24/7 JSON-LD hours · fix the contact page hours · correct the stats to 5.0/597 and 5 counties · fix the emergency page CTA · fix **"We don't share your info"** on the contact page · **fix the doubled brand in every page title** | All small, all live customer facing, none blocked on anyone. The title fix is the only one a searcher sees directly |
| **2. Ask Jason the questions** | Licences and counties · real hours · **is 24/7 genuinely staffed** · which service zone is current · **reviews per town** · per page booking links · is veteran owned true | Blocks copy we must not guess at. Send as one message |
| **1b. Fix the media** | Swap the 3 AI generated blog images for real job photos · pre optimise the 21 MB of blog images · resolve the 2 Shutterstock licences | Cheap, and the AI images undercut a promise the site makes elsewhere |
| **3. Make the lead path honest** | Per sink status, phone validation, 503 with phone number, health check endpoint | Stands alone, unblocks nothing else, worth the most |
| **4. Add the verified NAP** | Street, ZIP, geo into `SITE`, schema and footer. ⚠️ **Must also delete the stale placeholder on `/contact/`** ("Street address and map to be added once the business address is confirmed"), which is now visibly untrue. It carries a `⚠️ STALE PLACEHOLDER` comment in the file | Pure win, zero client input, already verified |
| **5. Wire the booking modal** | Mount script once · `window.HCPWidget.openModal()` with synchronous fallback · build `/book-a-repair/thank-you/` · set HCP's booking redirect | Small, contained, and finally makes booking measurable |
| **6. Ship the ZIP checker** | Client side against `lib/service-area-zips.json` | No key, no cost, no runtime call. Fills the dead slot at `app/page.tsx:293-301` |
| **7. Real Turnstile, then HCP lead sync** | Real keys first, then the gated push. **Ends with a supervised test lead that only Jason can delete** — see the gap in §9 and `CLIENT-ASKS` #34b | The interlock means 7 can be merged before the keys exist. But it cannot go LIVE without Jason on hand |
| **8. Collapse the duplicated data** | Merge `CITIES` into `AREAS`, delete the four dead exports, close the `ROUTES` leak | Housekeeping that stops the next editor wasting an hour |
| **9. Build the 3 county hubs** | `/service-areas/{hernando,polk,pinellas}/` | **Not blocked.** A county page can be honestly generic. Covers the two invisible counties without needing local reviews or photos |
| **10. Then the city pages** | Only once reviews and photos arrive | Highest revenue upside, genuinely blocked until then. Benchmark: Banko has **150+ city pages**, Trinity has 6 |
| **11. New service pages** | Hurricane Reinforcement first, then 25 Point Inspection, then financing | Hurricane is proven revenue from their own job tags, and it is seasonal in Florida |

---

## 10b. 🔴 Media integrity and page weight (new, and none of it was known)

### Three blog images are provably AI generated
Verified by reading the embedded **C2PA provenance manifests**:

| File | Manifest says |
|---|---|
| `public/blog/springs-break-florida.png` | `GPT-4o` · `OpenAI` · **`trainedAlgorithmicMedia`** |
| `public/blog/december-in-florida.png` | same |
| `public/blog/february-temperature-swings.png` | same |

`trainedAlgorithmicMedia` is the C2PA value that means **AI generated**. This is a public,
machine-readable standard that Google, LinkedIn and Meta already read and can surface as an
"AI generated" label.

Two reasons this matters more than it looks:
1. **`springs-break-florida.png` is the LCP image of `/resources/blog/`** — the lead post's hero,
   rendered with `priority`. The most prominent image on the blog is AI.
2. **`app/about/portfolio/page.tsx:84` promises "No stock photos, no catalog renders."** And this
   project already removed an AI owner photo on principle.

**Not our doing** — `git log` shows all 13 arrived in the "migrate blog 1-to-1 from old site"
commit. Frame it to Jason that way. **Cheap fix:** they have hundreds of real job photos. Swapping
three featured images fixes this and the weight problem below in one pass.

### A second Shutterstock image was never logged
`MEDIA-INVENTORY.md` records one. There are **two**, both carrying embedded Shutterstock
copyright: `strange-noise-goblin.jpg` (logged) and **`hurricane-ready-5-signs.jpg` (new)**.

**The real question is not "is it licensed" but "who is the licensee."** Shutterstock Standard
licences are per purchaser and **not transferable** — if the old agency bought them, the licence
stays with the agency and does not follow the images to the new site.

### `/resources/blog/` ships 21 MB of images
`next.config.ts:32` sets **`images: { unoptimized: true }`**, and there is no custom loader or
Cloudflare Images binding. So `next/image` does **not** resize on serve and full originals go to
the browser. Largest are 3.4 MB and 3.1 MB.

⚠️ This falsifies an assumption written into `content/blog/README.md`: *"next/image will resize on
serve."* **It does not, in this build.** Pre-optimise the sources instead: resize to ~1600px and
convert PNG to WebP. Roughly a 90% reduction.

---

## 11. SEO and structured data

**The good news first, measured not assumed:** all 33 routes declare `metadata`, **32 of 33
declare a canonical**, the build is green at 50 static pages, and a prior audit found 134 links
with 0 broken. The foundation is sound. The defects are specific.

### 🔴 P0 · The brand name is doubled in every page title · **S**
`app/layout.tsx:28` sets `template: "%s · Trinity Garage Door Service"`, and then each page's
own title **already includes the brand**. Measured on the live site:

| Page | Length | Rendered title |
|---|---|---|
| Home | 58 ✅ | *Garage Door Repair Tampa Bay \| Trinity Garage Door Service* |
| Spring repair | **103** ❌ | *…Repair & Replacement \| **Trinity Garage Door Service · Trinity Garage Door Service*** |
| Lutz | **90** ❌ | doubled |
| FAQ | **85** ❌ | doubled |
| Contact | **77** ❌ | doubled |

Google truncates around 60 characters, so **the visible portion is being spent on a brand name
printed twice.** Only the homepage escapes, because it uses `default` and bypasses the template.

**This is the single highest-value SEO fix available** — it is the only one that changes what a
human sees in the search result. Fix by dropping the brand from the page titles **or** dropping
the template, not both.

### 🟠 P1 · `app/sitemap.ts` ships fields Google ignores
It sets `priority` and `changeFrequency` on all 45 URLs. **Google ignores both.** `lastModified`
is a single build timestamp applied to every URL, and Google only uses it when *"consistently and
verifiably accurate"* — which one shared timestamp is not. Drop all three, or make `lastModified`
real.

### 🟠 P1 · `app/robots.ts` is not gated on the production host
Until it is, the `workers.dev` preview can be crawled while serving canonicals pointing at the
real domain. Gate it before the domain cutover.

### 🟡 P2 · FAQ rich results no longer exist — this site emits FAQPage on 10 files
**Google removed the FAQ rich result from Search on 7 May 2026** and deleted the documentation on
15 June 2026. It is absent from the current search gallery.

**Do not rip the markup out** — it truthfully describes visible accordions, so it breaks no
policy, costs nothing, and is still read by Bing and by LLM retrieval. **What must change is the
expectation**: stop counting those blocks as an SEO asset, and correct the comments in
`components/ui/faq-accordion.tsx` and `components/blocks/faq.tsx` that instruct future
contributors to pair accordions with `FaqJsonLd` for SEO value.

⚠️ **Do not "migrate" to `QAPage`.** That type is for **user-generated** question pages like
forums. Using it for a company FAQ would misrepresent the page.

**Keep the visible accordions regardless.** They were never valuable because of the schema — they
are good UX and they are the copy AI answer engines actually read.

| # | Finding | Where | P |
|---|---|---|---|
| 1 | **JSON-LD publishes 00:00 to 23:59, seven days.** Verified live. The only machine-readable hours claim on the site, and HCP contradicts it | `components/json-ld.tsx:27-34` | 🔴 |
| 2 | **No street address and no geo**, despite the comment saying "TODO once NAP is confirmed" — it **is** confirmed now | `components/json-ld.tsx:20-25` | 🟠 |
| 3 | **`areaServed` lists 6 cities** of 41 served | `components/json-ld.tsx:26` | 🟠 |
| 4 | **`/get-service/` is the one route with no canonical** — and 24 CTAs land there | `app/get-service/page.tsx` | 🟠 |
| 5 | **`telephone` hardcoded**, bypassing `SITE`, so a number change breaks schema silently | `components/json-ld.tsx:18` | 🟢 |
| 6 | **"Land O' Lakes" vs "Land O Lakes"** — two spellings ship, and the apostrophe version is the one that reaches structured data. USPS and HCP both use no apostrophe | `lib/site.ts:103` vs `:215` | 🟠 |

### On `aggregateRating`
The project deliberately omits it (rule G6) to avoid fake review markup. **Keep omitting it.**
Google has repeatedly penalised self-serving review markup, and the risk/reward is poor: the
rating already shows in the Google Business Profile, which is where local searchers actually see
it. The visible **"4.9 on Google"** text should still be corrected to **5.0 from 597** — that is
a copy fix, not a schema one.

### Recommended `openingHoursSpecification` shape
Do **not** collapse three different concepts into one. Office hours, online booking hours, and
the emergency line are genuinely different things, and schema can only express the first:

```
office    → when a human answers          (CLIENT-ASKS #4, unanswered)
booking   → Mon to Fri 08:00 to 16:00     (verified from HCP)
emergency → the 24/7 line                 (a marketing claim, NOT a schedulable window)
```

**Until Jason confirms, publish nothing rather than something false.** Google falls back to the
Business Profile, which is correct by definition.

---

## 11b. Privacy and legal — what actually applies

Researched properly, because two working assumptions were wrong.

**The Florida Digital Bill of Rights does NOT apply.** Its "controller" definition requires
meeting **all six** conditions cumulatively, including **over $1 billion in global annual
revenue**. Trinity misses that by three orders of magnitude. **Do not add FDBR scaffolding, a
"Do Not Sell" link, or CCPA notice-at-collection language** — a "Do Not Sell" link implies a data
sale that is not happening. (One narrow section, §501.715 on sensitive data, does reach any
Florida business, but it only bites if you *sell* sensitive data. They do not, so they comply by
doing nothing.)

**CalOPPA is the actual reason to post a policy.** It binds any commercial site collecting
personal info from a California visitor, with **no revenue or traffic threshold**, and it names
exactly what this form collects. It requires an **effective date**, third-party categories, a
material-changes process, and a **Do Not Track statement** — the last of which the policy is
missing entirely.

**FDUTPA is the sleeper risk.** It carries a **private right of action and prevailing-party
attorney's fees**. Once a policy is posted, every sentence becomes a representation they can be
sued over. Which makes this the worst sentence on the site:

> `app/contact/page.tsx:134` — **"We don't share your info."**

It is **already false** — Cloudflare, Turnstile and Resend all receive it, and the policy itself
says so two clicks away. It becomes plainly false the moment HCP is wired. 🟠 **Fix regardless of
the HCP work.**

**FTSA, if marketing texts are ever sent.** Florida's texting statute carries **$500 minimum per
message, trebled for willful violations, plus fees**. The saving grace is that **transactional
messages are excluded** — a form submission is an express request, and HCP's booking confirmations
are transactional. The exposure is **marketing blasts to the ~6,000-record CRM**, which would need
an unchecked-by-default consent checkbox with specific wording. `components/contact-form.tsx` has
no consent field today, and does not need one until someone proposes marketing texts.

**Privacy policy placeholders still live:** `[date you publish]`, `[contact email to confirm]`,
`[business mailing address to confirm]`. **The address is now answerable** — 18125 US Highway 41,
Suite 208, Lutz FL 33549.

**`/get-service/` has no privacy link at all**, and 24 CTAs land there. CalOPPA requires the
policy be conspicuously posted.

**When HCP lead sync ships, the policy must disclose it.** Good news on characterisation: routing
leads to HCP is **not a "sale"**, so they can still truthfully say they do not sell personal
information. HCP is a "third-party agent" — worth confirming the breach-notice terms exist in
that agreement, and in Resend's and Cloudflare's, because **an agent's notice failure is charged
to Trinity.**

---

## 11c. On pulling reviews live — the obvious route is the wrong one

**Do not use the Google Places API.** Three hard blockers:
1. Rating and review count are **Enterprise-tier billed fields**.
2. **Review text is capped at 5, with no pagination**, at any price tier.
3. **You may not cache the rating, count, or review text at all.** The Maps terms permit caching
   latitude/longitude for 30 days and place IDs indefinitely, and explicitly prohibit
   *"copy and save business names, addresses, or user reviews."* So the obvious "fetch nightly,
   write to JSON" design is outside the terms.

**The correct route is the Google Business Profile API** — returns **all** reviews plus the
average and total, **free**, because the data comes to Trinity as the owner rather than as
licensed Maps content. It needs a one-time access application and GBP access, which is
`CLIENT-ASKS` #28 and something we want anyway.

**Do not buy a review widget.** The ones that show more than 5 reviews from a pasted place ID are
almost certainly caching Places content, which is the prohibited conduct — and *we* would be the
party publishing it.

**For now: hand-correct 4.9 to 5.0 and add "597 reviews" with an "as of" date.** Transcribing a
public number is a factual statement and is not governed by API terms.

---

## 12. New pages and sections worth building

Ranked by evidence, not enthusiasm. **Two of these come from their own CRM**, so they are proven
revenue rather than guesses.

| Page | Case | Blocked by | P |
|---|---|---|---|
| **Hurricane Reinforcement service** | 🥇 **Strongest on the list.** They tag and bill real jobs against a "Hurricane Reinforcement Package". In Florida. "Hurricane" appears 13 times on the site but only ever as educational copy, never as something purchasable | nothing | 🟠 |
| **`/book-a-repair/thank-you/`** | HCP has **no booking-completed event**, so their dashboard "booking redirect" to a page we own is the *only* supported way to measure bookings. Must be `noindex` and stay out of the sitemap | nothing | 🟠 |
| **25 Point Inspection** | A named, concrete, sellable service with zero mentions. Best used as the identity for the existing tune up page rather than a new route | nothing | 🟡 |
| **ZIP checker section** | Fills the dead feature slot at `app/page.tsx:293-301`, where a ZIP input was removed for doing nothing. 1.2 KB gzipped | nothing | 🟡 |
| **Financing** | **36% of jobs are $1,000+**, median ~$855. Wisetack is already included free in their MAX plan | Reg Z constrains the copy. See the boundary below | 🟡 |
| **Commercial services** | They sell it, and have no page | **no commercial photos exist** | 🟡 |
| **Meet the team** | Real named techs, real photos exist | Roster must be client-confirmed. 3 of 8 in HCP are inactive, and `CLIENT-NOTES` named an "Andre" who is not in HCP at all | 🟡 |
| **Torsion Conversion / Rebuild packages** | Real tagged services, currently invisible | nothing | 🟢 |
| **Accessibility statement** | Cheap legal-risk mitigation. **Do not install an overlay widget** — plaintiffs target overlay sites | nothing | 🟢 |
| **City pages for missing markets** | The biggest revenue item on the project | **blocked, see below** | 🟠 |

### The financing copy boundary (Regulation Z)
Advertising credit terms triggers disclosure obligations. The safe line for a contractor:

- ❌ **No monthly payment amounts** ("as low as $89/month"), **no payment counts**, and **no
  down-payment percentages.** Any of those is a "triggering term" that drags in full disclosure.
- ✅ **Rate statements are fine** as long as **"annual percentage rate"** is spelled out in full.
- ✅ Safe framing: *"Financing available through Wisetack. Check your options with no impact to
  your credit score."*
- ✅ **Push every specific number into Wisetack's own hosted flow**, where the disclosures are
  already handled by the lender.

Competitive note: only 1 of 8 competitors does financing well, and the largest franchise publishes
no numbers at all. So a plain, honest financing page is differentiating even inside these limits.

### ⚠️ The city expansion is blocked on reviews, not on writing
`CityAreaData` requires `review: { quote, name }` per city. **The 6 existing city pages already
consume 6 of the 8 real Google reviews, one each.** Two remain, both one-liners ("Great work!
Thank you", "Great technician").

We never invent testimonials. So **we cannot build St. Petersburg, Clearwater, Lakeland, Spring
Hill, Largo, Brandon or Riverview until real reviews exist for them.** There are also **no
city-specific photos** — 33 images in `public/work/`, exactly one referencing a city.

**The fix is almost comic: they have 597 reviews and we have 8.** Google Business Profile access,
or a copy-paste of three or four reviews per town, unlocks the single largest growth item here.
`CLIENT-ASKS.md` #18b.

**Sequencing consequence: ask for the reviews now.** Everything else about the expansion is cheap
once they land, because the template already exists and the ZIP data is verified.

### 🟠 P1 · All six city pages claim photos were taken in that city
Every existing city page asserts a location in its `imageAlt` that we cannot support:

| Page | Alt text says | Actual file |
|---|---|---|
| Lutz | "…in Lutz" | `jobsite-tech-at-residential-garage.jpg` |
| Land O Lakes | "…in Land O' Lakes" | `jobsite-two-techs-on-ladder.jpg` |
| Oldsmar | "…in Oldsmar" | `jobsite-tech-crouching-repair.jpg` |
| Palm Harbor | "…in Palm Harbor" | `jobsite-tech-working-dusk.jpg` |
| Tampa | "…on a Tampa job" | `jobsite-opener-and-spring-hardware.jpg` |
| Wesley Chapel | "…in Wesley Chapel" | `jobsite-tech-installing-opener.jpg` |

The filenames carry no city provenance, and `CLIENT-ASKS.md` #17 states plainly that we do not
know which town any job photo is from. **This invents provenance**, which breaks the project's own
never-invent rule, and it does it in **alt text that is read aloud to screen reader users.**

**Fix:** describe the photo, not a location we cannot verify. *"A Trinity technician working on a
garage door."* Six one-line edits. It also means we cannot claim "real local photos" for any city
page today, existing or new.

### ✅ The unblock: build COUNTY hubs, not city pages
City pages are blocked because a credible one needs a local review and a local photo, and we have
neither. **A county page does not.** A page about Hernando County can honestly say "we cover
Spring Hill, Brooksville and the surrounding area" and be generically written **without being
thin or deceptive**, because a county genuinely is a broad area. That is the difference between
honest generality and a doorway page.

So: **`/service-areas/hernando/`, `/service-areas/polk/`, `/service-areas/pinellas/`** — three
pages, no client input needed, covering the two counties currently invisible plus the one where
coverage is understated. They capture the "garage door repair Spring Hill" style searches today,
and each becomes a parent for real city pages later, once reviews and photos arrive.

**This is the recommended path.** It converts a blocked item into a shippable one.

### ⭐ The city tranche, decided by where the work actually is

I pulled **1,198 recent jobs from HCP and counted them by customer city.** This is the honest
basis for the decision, and it **overturns** a Census-demographics ranking I nearly shipped.

| Rank | City | Share of real jobs | Has a page? |
|---|---|---:|---|
| 1 | Tampa | **22.5%** | ✅ |
| 2 | Lutz | **12.7%** | ✅ |
| 3 | Land O Lakes | **9.3%** | ✅ |
| 4 | Palm Harbor | 5.8% | ✅ |
| 5 | Wesley Chapel | 5.6% | ✅ |
| **6** | **New Port Richey** | **4.6%** | ❌ |
| **7** | **Zephyrhills** | **3.3%** | ❌ |
| **8** | **Odessa** | **3.3%** | ❌ |
| **9** | **Trinity** | **3.0%** | ❌ |
| 10 | Clearwater | 2.6% | ❌ |
| 11 | St. Petersburg | 2.5% | ❌ |
| 12 | Hudson | 2.1% | ❌ |
| 15 | Oldsmar | 1.8% | ✅ |

**Three things this settles:**

1. **The existing six pages were well chosen.** They cover five of the top six markets. Only
   **Oldsmar** is weak — it is their **15th** market at 1.8%, yet it got one of six pages.
2. **The demographics ranking was wrong, and I nearly used it.** It put St. Petersburg #1 (really
   2.5% of jobs), Spring Hill #2 (really **0.8%**), Riverview #3 (1.4%) and Brandon #4 (0.9%).
   Population and detached-housing counts measure *market size*; they do not measure **where this
   company actually works.** Census data would have sent us into four markets they barely serve.
3. **The demoted cities were the real opportunities.** New Port Richey was demoted to "hub only"
   on city-proper figures and is in fact their **#6 market**. That is exactly the ZIP-versus-city
   caveat, confirmed by real data.

**And the standout: "Trinity" is their #9 market at 3.0%, and the company is named Trinity Garage
Door Service.** There is no page for it. That is the most obvious page on this entire list.

**Recommended tranche, in order:** New Port Richey (fold in the Trinity area), Zephyrhills,
Odessa, then Clearwater and St. Petersburg.

### 💡 Unblocking the reviews without waiting on the client
**Mine the 597 public Google reviews for town mentions.** Reviewers routinely name their
neighbourhood, and any review naming a town is both a real review *and* local evidence — which
satisfies the per-city review requirement with no client input at all.

This works precisely because the tranche above comes from real job data: they genuinely work in
those towns, so reviews from them should exist.

### What the competition actually has (8 sites fetched directly)

**The one that matters: Banko Overhead Doors**, Trinity's biggest direct competitor, runs a
**county → city URL hierarchy across 12 Florida counties and 150+ city pages**, reaching past
Tampa Bay into Jacksonville and Orlando. That is not a national franchise's templated footprint;
it is a regional independent doing aggressive granular local SEO. **Trinity has 6 city pages.**
Benchmark against Banko, not against the national outliers.

**And in Hernando — the 9 ZIPs Trinity serves but never names — the local competitor is
`sunshinegaragedoor.com`: raw static HTML from a legacy site builder, no location pages, no
booking, no blog, and a nav bug where two links point at the same page.** Spring Hill and
Brooksville are the softest markets on the board.

### Four things nobody in the field has, that Trinity could

| Gap | Evidence | Trinity's position |
|---|---|---|
| **A working live review widget** | All 8 are static, outbound links, or broken. Precision's literally renders "No reviews added yet" | They have **5.0 from 597**. A real feed would lead the field |
| **Named technician bios with photos** | Not confirmed on any of the 8. Everyone stays generic, "background checked", "father son team" | They have **real named techs and real photos already staged** |
| **Veteran owned badging** | Several offer a military *discount*; **none claim veteran ownership** | Their Angi profile says veteran owned. **Unconfirmed** — `CLIENT-ASKS` #13 |
| **A published price** | Only 1 of 8 publishes any real number. The largest franchise **states a no-pricing policy outright** | Industry norm is opacity, so answering the question honestly is differentiating. Constrained by their unwillingness to quote |

**Also worth knowing:** door visualizers are broken across the board — Precision's Renoworks tool
errors, Overhead Door's "DoorDreamer" is marketed but unfindable. And **IDA membership**
(doors.org, which runs a consumer-facing verified-dealer directory) is used as a lead trust
signal by only 1 of 8. Both are cheap opportunities.

### On how many city pages to build
Google's spam policy names **"doorway abuse"** — *"multiple domain names or pages targeted at
specific regions or cities that funnel users to one page"* — and **"scaled content abuse"**. The
dividing line is not page count; it is whether each page is a real destination or a reskin with
the city name swapped.

So **do not build 41.** Run each city through a gate: do they genuinely work there daily, is
there real search demand, and does the town have distinct housing stock or local characteristics
worth writing about? The ones that pass get real pages; the rest get listed on the hub. That also
happens to be the only honest option given the review and photo constraints above.

---

## 13. The five questions that unblock the most

Everything below is cheap to implement and impossible to guess. **Send as one message.**

1. **Which counties are you licensed in, and is the Pasco renewal filed?** The site claims
   Florida state licensure on 25 pages. Legal exposure. `CLIENT-ASKS` #5b.
2. **What are the real office hours?** Three sources disagree and their own booking system is a
   fourth. `CLIENT-ASKS` #4.
3. **Is the 24/7 emergency line genuinely staffed?** It is the most repeated promise on the site
   and appears in FAQ structured data Google can republish.
4. **Can we have 3 or 4 Google reviews per town?** Unblocks the entire city expansion.
   `CLIENT-ASKS` #18b.
5. **Which service area is current, 130 ZIPs or 268?** `CLIENT-ASKS` #33.

---

## Changelog
- **2026-07-28** Created from a full-project audit against live Housecall Pro data. Verified every
  finding against the deployed site rather than source alone. Baseline confirmed green at 50
  static pages before any change.
