# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚩 START HERE (updated 2026-07-28)

**Read `UPGRADE-PLAN.md` first.** It is the plan of record: a full-project audit against the
client's live Housecall Pro data, with every finding verified against the **deployed** site rather
than source. Everything below in this file is still true but predates it.

**We now have working Housecall Pro API access.** Two keys in `.env.local`
(`HOUSE_CALL_PRO_APY_KEY`, `HOUSE_CALL_PRO_DRIVE_SOCIAL_API_KEY`), both full access, both live.
Reference: **`HOUSECALL-PRO-API.md`**. Three things that file corrects, which older notes get wrong:
- **Live availability EXISTS** — `GET /company/schedule_availability/booking_windows`. Earlier
  notes say it does not. They probed **root-level** paths; the real ones are nested under
  `/company/`. **A root-level 404 proves nothing on this API.**
- **`/leads` exists** and accepts an inline customer, so a contact-form lead is one POST.
- The booking widget global is **`window.HCPWidget.openModal()`**, not `window.HousecallPro`. ⚠️ Still
  true, but **that widget no longer loads** — booking was switched off on 2026-08-04. See the Booking
  section below.

**Their account is live production: 6,001 customers, no sandbox, and NO DELETE endpoint for
customers/jobs/leads/estimates.** Reads are safe. Any write is effectively permanent and cleanup
is a human clicking in the HCP web app. Scheduling a job texts the real customer.

⚠️ **Never surface `GET /events`** — it returns employees' medical appointments and family
commitments.

### Facts now verified from their own system
Address **18125 US-41 Ste 208, Lutz FL 33549** · geo **28.1372004, -82.4625826** · phone
**(813) 279-6785** (matches the site) · **booking hours Mon-Fri 08:00-16:00** · arrival window
**120 min** · trip charge **$0** · service area **130 zips / 41 cities / 5 counties**
(`lib/service-area-zips.json`, verified 130/130) · only **two** job types, Install and Repair.

### The two business facts that should drive priorities
1. **The website produces few jobs, but big ones.** ⚠️ **Remeasured 2026-08-04 and the old figure
   here was wrong.** The previous note said "1 of the 300 most recent jobs". A sweep of **all 7,698
   jobs** finds **12** carrying the "Trinity Website" lead source, 10 completed, **11 of the 12
   created in 2026**, worth **$23,298** at a mean of **$2,330**, which is about 2.7x their median
   job. Few leads, large tickets. Half their jobs are still repeat customers.
   - **Revenue by source is now readable**, because lead source tagging went from 92% null before
     2023 to **0% null on July 2026's 93 paid invoices** ($149,800). That month: Repeat 46%
     ($80,264), Google Maps $15,431, "Google" $23,051, **Google Ads $5,674**, Angi $5,259.
   - **The money arrives by PHONE.** Repeat plus Maps plus organic dwarfs form fills, which is why
     call measurement, not form measurement, is the largest tracking gap on the account.
   - **We have never actually pushed a lead into HCP.** All 272 leads there are Angi or Yelp; those
     12 website jobs were tagged by hand in the office. `HCP_LEAD_SYNC_ENABLED` is still off.
   - How to reproduce: there is **no lead source filter on `/jobs`**. Start from
     `GET /invoices?status[]=paid&paid_at_min=…&paid_at_max=…&page_size=200`, then resolve each
     `invoice.job_id` via `GET /jobs/{id}` and read `job.lead_source`. ~94 calls per month.
2. **They serve 41 cities and have 6 city pages.** Ranked by *real job volume*, the biggest gaps
   are New Port Richey (4.6%), Zephyrhills (3.3%), Odessa (3.3%) and **Trinity (3.0%)** — the
   company is named Trinity Garage Door Service and has no page for the town.

### Do not "fix" these, they are deliberate
- **The 24/7 claims and the JSON-LD `openingHoursSpecification`** are untouched **on purpose**,
  pending `CLIENT-ASKS` #4b. A phone line answering around the clock is a different claim from
  online booking hours; both can be true. **Ask, do not assume.**
- **"12k+ Doors Serviced"** stays. HCP records start Oct 2019, so nothing available can disprove
  a lifetime figure covering 2007 onward.

### Traps that will waste an hour
- **`HOURS`, `STATS`, `SERVICES` and `IG_TILES` in `lib/site.ts` have ZERO importers.** The
  homepage keeps local copies. Editing `lib/site.ts` alone changes nothing on the page.
- **`next.config.ts` sets `images: { unoptimized: true }`** — `next/image` does NOT resize on
  serve here, whatever `content/blog/README.md` claims. The blog ships 21 MB.
- **Prefer real data over inference.** A Census-based city ranking put Spring Hill at #2; actual
  HCP job counts put it near the bottom at 0.8%. The API can answer these questions directly.
- **Booking CTAs: never hardcode a path and never link `ROUTES.bookRepair`.** Call `requestHref()`
  from `lib/booking.ts`, which follows `BOOKING_MODE`. Setting `NEXT_PUBLIC_BOOKING_URL` alone does
  **not** turn booking back on — `BOOKING_MODE` is the switch, and it lives in version control.

## 🩸 THE LEAD FORM REFUSED A REAL CUSTOMER SIX TIMES (2026-08-12)

**Read `postmortems/2026-08-12-turnstile-lead-loss/` before touching the contact form, the
Turnstile config, or anything that can reject a submission.** It is the most expensive lesson on
this project and it is written to stop a repeat.

What happened: a homeowner arrived on a **paid** Google Ads click, tried six times over eleven
hours, and was refused every time with a 400. His details were discarded at the gate and are gone.
Site wide, **38% of challenged real browsers were producing no token** and every one was turned
away, silently, for nine days. Fixed in `408f7db`.

The three rules that came out of it, in order of how much they will cost you to relearn:

1. **A rejection path must NEVER discard what the visitor typed.** A captured spam row costs
   Barbara ten seconds. A discarded real lead costs the $2,330 mean website job. Refusals now go to
   the `unverified_leads` quarantine table via `refuse()` in `app/api/contact/route.ts`, which every
   gate calls on its way out. Keep it that way.
2. **Turnstile must stay on `?render=explicit`.** Implicit rendering scans for `.cf-turnstile` once,
   when `api.js` executes, and `next/script` dedupes by `src`, so on a client side navigation the
   widget never mounts and the form posts with no token. Measured: hard load mounted it, clicking
   through to a second form page mounted nothing. This applies to ANY third party script that
   self initialises by scanning the DOM.
3. **Never ship a gate on the revenue path without measuring its false positive rate first.** The
   38% was measurable the whole time. The change shipped on reasoning, the reasoning was careful,
   and it was still wrong. Log only first, then enforce.

⚠️ **Still open, see `05-known-gaps.md`:** `UNVERIFIED_ALERT_TO` is unset, so refusals are captured
but nobody is told and the visitor still sees the red error rather than the calm card. Nobody reads
`unverified_leads`. And `alertConfigured()` checks that an alert address exists, not that the alert
was delivered, so `captured: true` currently means "queued".

`06-prevention.md` and `07-day-one-checklist.md` are written client agnostic. **Copy them into the
next project.**

## ✅ DESIGN-PORT BUILD COMPLETE (2026-06-22)

The 1:1 design → Next.js build is **done**. Every approved `*.dc.html` "Bold Trade" design (in `trinitygaragedoorservice.com/`) is now a live Next.js page, each `pnpm build`-green and **production-screenshot-verified 1:1**. Final build: **32 static pages, 0 errors**. **~27 commits ahead of origin/main, UNPUSHED** — the user pushes via `! git push origin main` (the auto-mode classifier blocks me from pushing to main).

**Built (all under `app/`):** `/` home (bespoke), `/services/` hub, `/services/repair/` hub (bespoke), the 6 repair detail pages + `/services/replacement/` + `/services/installation/` (via `components/blocks/repair-detail-layout.tsx` `RepairDetailData`), `/service-areas/` hub + 6 city pages (via `components/blocks/city-area-layout.tsx` `CityAreaData`), `/doors/{types,brands,brochures}/`, `/about/{our-story,portfolio,reviews}/`, `/contact/` (wraps the existing Resend/D1/Turnstile `ContactForm`), `/privacy-policy/`. Foundation: `app/globals.css` Bold Trade `@theme` tokens (`accent/ink/cream` + `--font-display`/`--font-body`; **custom breakpoints `nav`=920px, `xs`=560px** — use `max-nav:`/`nav:`/`max-xs:`, NOT `md:`/`lg:`); `lib/site.ts` (`ROUTES`, `SERVICES`, `AREAS`, `GOOGLE_REVIEWS`, `BRAND_CATALOG`, `getNavConfig`); reusable blocks in `components/blocks/` incl. `service-area-map-mock.tsx`.

**Conventions baked into every page (keep if extending):** dash-free copy (no em/en/hyphen); reviews use the 8 verbatim `GOOGLE_REVIEWS` (never invent testimonials); client unknowns kept as **visible** placeholders (G16); per-route `metadata` + Breadcrumb/FAQ JSON-LD (no `aggregateRating` per G6).

**⚠️ VERIFY VIA PRODUCTION, NOT `next dev`** (cost ~30 min to learn): in `next dev` (Turbopack) headless Chrome intermittently fails to load CSS chunks (`ChunkLoadError`), so `nav:`/`max-nav:` media-query grids silently render **stacked** — a phantom regression that is NOT in the code. Always `pnpm build` → `pnpm exec next start -p 3000` (Bash `run_in_background:true`) → screenshot that. Crop with PIL (no ImageMagick here). Full recipe + page status in **`trinitygaragedoorservice.com/handoff/BUILD-PROGRESS.md`**.

**Remaining work is NOT design-port:** (1) ~~dead-code cleanup~~ ✅ **DONE** — the 12 unused old-home files in `components/sections/` were deleted; only `utility-bar, site-footer, sticky-mobile-bar` remain (imported by `layout.tsx`). (2) Build `/resources/{blog,safety-tips,troubleshooting,faq}/` from existing copy (`copy/resources/`, `content/blog/`) with a generic template (never designed). (3) Settle the launch-blocking client decisions in the `trinity-open-decisions` memory. (4) Optional Radix `NavigationMenu`/`Accordion` a11y upgrade (G8).

> The sections below describe the PRE-design-port state and are mostly historical now (the old `app/page.tsx`+`components/sections/` homepage was replaced). The **Gotchas** section still fully applies (esp. Archivo Expanded via `<link>` not `next/font/google`, `@/*`→repo root, keep the Turnstile/Resend/D1 infra). The `components/blocks/` + `accent/ink/cream` + `font-display/font-body` system is now the only architecture.

## 🔖 Booking — Housecall Pro is SWITCHED OFF, not deleted (2026-08-04)

**Read `lib/booking.ts` first. It is the centre of this.** The client asked for online booking to
come out and said they will want it back later, so **nothing was deleted, it is gated**.

**One constant reverses the whole thing: `BOOKING_MODE` in `lib/booking.ts`, currently `"form"`.**
Set it to `"housecall-pro"`, confirm `NEXT_PUBLIC_BOOKING_URL` is still in `.env.local`, rebuild, and
that restores the modal, the widget `<Script>` in `app/layout.tsx`, the `/book-a-repair/` page, its
sitemap entry, and removes the redirect. It is a hardcoded constant, **not** an env var, for the same
reason as the GTM id: `NEXT_PUBLIC_*` is inlined at BUILD time, so a build that missed the variable
would silently ship the wrong behaviour with no error. `next.config.ts` imports it too, so
**`lib/booking.ts` must stay dependency free.**

Still present and still type checked: the whole `HCPWidget.openModal()` path plus its hosted URL
fallback in `components/book-online-button.tsx`, the `app/book-a-repair/` page (it still builds), and
`bookingHref` / `bookingWidgetSrc` in `lib/site.ts`. Designer brief: `handoff/BOOK-A-REPAIR-HCP-BRIEF.md`.

**What `"form"` mode does today:**
- Every booking CTA is a `<Link>` from `requestHref(topic?)`, and every label that promised a calendar
  now reads "Request Service" / "Request a Repair" (`requestLabel`). ⚠️ **Flipping the mode back does
  NOT restore the old labels, on purpose** — a callback form is not a calendar. Grep `requestLabel`.
- `app/get-service/[topic]/page.tsx` statically generates **8** request form pages from
  `REQUEST_FORMS`: `repair, spring-repair, opener-repair, off-track, cables-and-rollers, tune-up,
  replacement, emergency`. **`dynamicParams = false`** is load bearing: an invented slug 404s instead
  of turning the route into a doorway page generator. They share
  `components/blocks/request-form-layout.tsx` with `/get-service/`, so the form is identical
  everywhere; only the hero copy and the lead source differ.
- ⚠️ **`/get-service/` and `/get-service/?intent=estimate` did not move, and must not.** Both are in
  the verified 301 map, in the sitemap, and in Lloyd's Google Ads final URLs. The `[topic]` pages are
  additions beneath that URL, never a replacement for it.
- `/book-a-repair/` **307s** to `/get-service/repair/` (`permanent: false` **on purpose** — a 308
  cannot be taken back out of other people's caches and the client expects booking back) and is out of
  the sitemap. `/schedule-a-repair/` 301s **straight** to `/get-service/repair/`, so there is no chain.
- `/book-a-repair/thank-you/` is untouched, still `noindex`, still out of the sitemap.

**Measurement, which is the point of having 8 pages:** each one posts a distinct `source`
(`spring-repair-form`, and so on) to `/api/contact`, which reaches the D1 `leads` row, the office lead
email (as "Came from", alongside Zip) and the `generate_lead` dataLayer event as `lead_source`.
**`book_online_click` no longer fires** — a link produces a navigation to measure where a modal click
did not — but the member stays in the `TrackEvent` union so the ads specialist's existing GTM tag
survives the switch back. See `GTM-NOTES.md`.

**Researched HCP options (2026-06-22), kept for when booking returns:**
- **Website embeds (no MAX needed):** (1) "Book Online" button → **modal overlay** (documented, recommended); (2) **hosted link**; (3) Reserve with Google. There is **no official inline-iframe widget**, BUT `book.housecallpro.com` returns **no `X-Frame-Options` / no CSP `frame-ancestors`** (checked via `curl -I`), so a DIY inline `<iframe>` of the hosted URL *does* render — unsupported, height/scroll-fragile; test the real URL before relying on it.
- **Public API = MAX plan only** (API key / OAuth, **server-side only — never put it in the browser**). **KEY FINDING:** the API is **back-office** (create customers / jobs / appointments, update job schedule + arrival windows, invoices, payments) and **does NOT expose a customer-facing bookable-availability endpoint**. So a MAX key **cannot** cleanly power a true live-availability calendar — you'd have to recompute availability yourself (rebuild HCP's scheduler; fragile). Realistic API-native option = a branded **"request a window, we confirm"** form (POST a job), NOT a live calendar. The better use of the MAX API = **back-office lead/data sync** (push `/contact` + estimate-form leads into HCP).

**When booking comes back, the reversal checklist:** flip `BOOKING_MODE`, confirm `NEXT_PUBLIC_BOOKING_URL`, rebuild, then decide deliberately what the CTA labels should say (`requestLabel`), and re-check `LAUNCH-TODO` **1.5** (the thank you page) and `CLIENT-ASKS` **#35** (Jason's booking redirect), both of which are on hold rather than closed.

## 📋 LIVING CLIENT DOCS — keep these current (they are used in meetings)

Two glanceable docs at the repo root that the user reads **during client meetings**. They are
deliberately written in plain language, no jargon, short lines.

- **`CLIENT-ASKS.md`** — everything we need FROM Jason/Simone (decisions, accounts, photos),
  grouped by urgency with tick boxes.
- **`CLIENT-NOTES.md`** — what to TELL them (wins, problems found, advice worth giving).

**Whenever work surfaces a new client decision, blocker, or finding, add it to the right doc,
bump the "Last updated" date, and append a one-line changelog entry.** When an item is answered
or resolved, tick it and move it out rather than leaving it stale. These summarise; the depth
lives in `PRE-LAUNCH-PUNCHLIST.md`, `MEDIA-INVENTORY.md`, and `LAUNCH-CHECKLIST.md`.

## Project skills (`.claude/skills/`) — invoke by name, or they auto-trigger by description

Repeatable workflows + hard-won knowledge, pulled out of this file so they load on demand and can run
bundled scripts. All self-contained (no MCP required; each notes where Chrome DevTools MCP would slot
in later). Shared design DNA: `.claude/skills/shared/bold-trade-design-system.md`.

- **`verify-page`** — screenshot QA at all four breakpoints from the PRODUCTION server (never `next
  dev` — Turbopack drops CSS chunks in headless Chrome). Bundles `screenshot.sh` + `crop.py`.
- **`new-page`** — scaffold an on-brand route from `copy/**` with the block library (undesigned pages
  like Resources).
- **`port-design`** — port a `.dc.html` design 1:1 (new claude.ai/design pages).
- **`launch-audit`** — broken-links + WCAG + perf/SEO against the local prod build (`audit.sh` wraps
  linkinator + pa11y-ci + unlighthouse). Feeds `PRE-LAUNCH-PUNCHLIST.md`.
- **`copy-voice`** — lint/write copy to the voice rules (no dashes, no AI tells, never invent);
  bundles `lint-copy.sh`.
- **`deploy`** — the safe Cloudflare deploy (`pnpm run deploy`, baked `NEXT_PUBLIC_*`, secrets, D1).

`.shots/` and `.audit/` are throwaway output dirs (git-ignored). Outstanding launch work lives in
`PRE-LAUNCH-PUNCHLIST.md`.

## What this is

Marketing site for **Trinity Garage Door Service** (Tampa Bay garage-door company). It is a
rebuild of a homepage that currently ships as a hand-built static page on Cloudflare Pages
(`trinity-garage-bold-trade.pages.dev`), now being rebuilt as a **Next.js 16 / React 19 app
deployed to Cloudflare via OpenNext (a Worker, not Pages, not Vercel)**.

**Read first when planning work:**
- `NEXTJS-MIGRATION-PLAN.md` — the phased build plan, locked decisions, and the punch-list of facts to settle before launch.
- `SOURCE-MATERIAL-MAP.md` — which source folder feeds which build piece ("for X, read Y").

Current state: **the homepage is built**; inner pages are not. Nav/footer already link to
future routes (`/services/...`, `/doors/...`, `/service-areas/...`, `/about/...`,
`/resources/...`) that **404 until built** — this is expected, not a bug.

## Commands

Package manager is **pnpm** (Node 22). There is **no test suite**; verify with `build` +
visual QA (and Lighthouse per the migration plan).

```bash
pnpm dev                 # next dev (Turbopack) — local development
pnpm build               # production build (run this to verify changes compile + typecheck)
pnpm lint                # eslint (next/core-web-vitals + next/typescript)

pnpm preview             # opennextjs-cloudflare build && preview — exercises the WORKERS runtime
                         # locally; catches nodejs_compat / binding issues that `pnpm dev` hides
pnpm run deploy          # build + deploy the Worker to Cloudflare
                         # (MUST be `pnpm run deploy` — `pnpm deploy` is a reserved pnpm builtin)
pnpm cf-typegen          # regenerate cloudflare-env.d.ts from wrangler.jsonc (gitignored, ~540KB)

pnpm db:migrate:local    # apply db/migrations/* to the LOCAL D1 (SQLite) — works offline
pnpm db:migrate          # apply migrations to the REMOTE D1 (needs `wrangler login`)
```

Inspect leads locally: `wrangler d1 execute DB --local --command "SELECT * FROM leads"`.

There is pre-existing standing approval to spin up the dev server and screenshot it with
headless Chrome for visual QA (see project memory). A green `pnpm build` is not sufficient —
verify visually for UI work.

## Architecture

**Cloudflare/OpenNext platform.** `next.config.ts` calls `initOpenNextCloudflareForDev()`
(no-op during build). Bindings live in `wrangler.jsonc`: `ASSETS`, and the D1 database `DB`
(`trinity-leads`, real `database_id` already wired). In route handlers, **secrets come from
`process.env`** and **D1 comes from `getCloudflareContext().env.DB`**.

**`lib/site.ts` is the single source of truth** for all content/config — NAP, nav/IA arrays
(`NAV_REPAIR`/`NAV_INSTALL`/`NAV_DOORS`/`NAV_ABOUT`), `CITIES`, `BRANDS`, `REVIEWS`, `STATS`,
`SERVICE_OPTIONS`, and the `asset()` path helper. **Change site content here, not in
components.** `SITE.bookingHref` reads `NEXT_PUBLIC_BOOKING_URL` (the Housecall Pro URL;
falls back to `#book`).

**Layout owns the shared chrome.** `app/layout.tsx` renders `UtilityBar` → `SiteHeader` →
`{children}` → `SiteFooter` → `StickyMobileBar`, plus `<LocalBusinessJsonLd />` and the
Archivo-Expanded font `<link>`. Pages only render their own content. `app/page.tsx` composes
the homepage from `components/sections/*` (one component per band).

**Server components by default.** Only four are `"use client"`: `Reveal`, `AutoplayVideo`,
`ContactForm`, `MobileMenu`. The first two replace the old design-tool ("dc-runtime")
behaviors — `Reveal` = Motion `whileInView` scroll-reveal; `AutoplayVideo` = iOS/Safari-safe
muted autoplay. Use them instead of re-implementing.

**Navigation is hand-rolled CSS, not Radix.** `SiteHeader` builds the desktop mega-menus with
`group`/`group-hover`/`group-focus-within` Tailwind classes (despite the plan mentioning
`NavigationMenu`). The mobile drawer is the separate `MobileMenu` client component (the
original static page had no working mobile menu). Nav structure spec: `site-audit/NAVBAR-SPEC.md`.

**Lead pipeline** (`components/contact-form.tsx` → `app/api/contact/route.ts`): client posts
JSON to `/api/contact`, which (1) validates name+phone, (2) verifies **Cloudflare Turnstile**
*only if* `TURNSTILE_SECRET_KEY` is set (graceful skip in dev), (3) sends a Resend email via
the `emails/lead-email.tsx` React template, (4) inserts into D1. **Email and D1 writes are
best-effort** (wrapped in try/catch, logged, never thrown) — a provider hiccup must not lose
the lead. `app/get-service/page.tsx` reads `?intent=estimate` to retitle/repurpose the form.

**Foundation primitives** in `components/ui/` (`Section`, `Cta`/`Button` via cva, `prose`,
`breadcrumbs`, `faq-accordion`) and SEO helpers (`lib/seo.ts` `pageMetadata()`/`absoluteUrl()`,
`components/json-ld.tsx`) exist for the upcoming inner pages. **The homepage sections do NOT
use them** — they hand-roll Tailwind to match the original pixel design. Don't assume a section
uses a primitive; check first.

## Styling

- **Tailwind 4, CSS-first.** Tokens are in `app/globals.css` under `@theme` — there is **no
  `tailwind.config.js`**. Brand tokens: `--color-ink` `#1a1a1a`, `--color-accent` `#b8202a`,
  `--color-sand` `#f2f0ec`; fonts `--font-sans` (Hanken Grotesk) / `--font-heading` (Archivo
  Expanded). Use as utilities: `bg-accent`, `text-ink`, `bg-sand`, `font-heading`.
- **Pixel-faithful design** → sections use lots of arbitrary values (`text-[15px]`, `py-[92px]`)
  to match the source mockup; match that style when extending.
- **Custom breakpoints**, not the defaults: the nav/layout switch at `min-[921px]:` /
  `max-[920px]:` (and `min-[561px]:` elsewhere). Forms use standard `sm:`.
- Compose classes with `cn()` from `lib/utils.ts` (clsx + tailwind-merge).
- Icons: **lucide-react for generic glyphs only.** lucide 1.x **dropped brand icons** — get
  Instagram/Facebook/etc. from `components/social-icons.tsx`, never from lucide.

## Gotchas (expensive to rediscover)

- **`@/*` maps to the repo ROOT** (`tsconfig` `"@/*": ["./*"]`), not `src/`. Import as
  `@/components/...`, `@/lib/...`.
- **"Archivo Expanded" is NOT in `next/font/google`** (only base "Archivo"). It loads via a
  Google Fonts `<link>` in `app/layout.tsx`. Do **not** "fix" this to `next/font/google` — the
  build will fail. (Hanken Grotesk does use `next/font`.)
- **Route-handler env in `pnpm dev` comes from `.env.local`/wrangler, NOT the parent shell.**
  Overriding a var in the shell won't affect `/api/*`; edit `.env.local`.
- **`.env.example` is stale** (lists Stripe, reCAPTCHA, shadcnblocks — none are used). The
  accurate env contract is **`.dev.vars.example`**: Resend (`RESEND_API_KEY`,
  `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`), Turnstile (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`,
  `TURNSTILE_SECRET_KEY`), `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BOOKING_URL`. Spam protection
  is **Turnstile, not reCAPTCHA**. Production secrets go in via `wrangler secret put`.
- **Source folders are reference-only, excluded from the build** (`tsconfig`/eslint ignore
  `mockup/`; eslint also ignores `public/`): `mockup/` (the design being ported),
  `design-assets/` (curated asset library), `copy/` (finished marketing copy),
  `research/` (raw old-site discovery), `site-audit/` (old-site audit + locked IA). Don't edit
  them to change the live site; they feed it. Build assets live in `public/assets/`.
- **D1 migrations are local-first**: `pnpm db:migrate:local` works with no network/login;
  remote needs `wrangler login`.
- 🔴 **NEVER set `export const dynamicParams = false` on a dynamic route. It 404s the whole route on
  Cloudflare.** It makes Next write `fallback: false` into `prerender-manifest.json`, and OpenNext's
  router then fails to match the prerendered paths even though the pages ARE in `.open-next/cache/`
  and listed as static routes in that same manifest. Cost: all 8 `/get-service/[topic]/` pages
  returned 404 on the Worker while `pnpm build` was green and `next start` served them fine.
  `app/resources/blog/[slug]/` is unaffected only because it leaves the flag at its default.
  **To reject unknown slugs, call `notFound()` inside the page instead** (verified working on the
  Worker). This is the canonical reason `pnpm preview` exists: see [[measure-dont-infer]].

## Content & copy rules

When writing or editing user-facing copy, follow `copy/services/_VOICE-AND-RULES.md`. The
hard rules that bite: **(1) no dashes of any kind** (no em/en/hyphen — write "same day",
"off track", "family owned"); **(2) no AI tells** (no "not just X, it's Y"; no "whether…or…";
no "from…to…"; no buzzwords like seamless/robust/peace of mind); **(3) never invent** prices,
warranties, guarantees, or stats. Finished, on-voice copy for the homepage + 7 service pages
is in `copy/`; other pages need copy written. Tagline: "Opening Doors Since 2007."

## Unsettled facts (don't hardcode silently; see `NEXTJS-MIGRATION-PLAN.md`)

Several values are **unconfirmed picks**, flagged in `lib/site.ts`: the single phone
`(813) 279-6785` (the old site had 3 county lines), `foundedYear` 2007 (state records say
2011), and the provisional `STATS`. Reviews on the homepage are **placeholder samples** (8 real
named Google reviews are in `site-audit/01-homepage-and-company.md`). `LocalBusinessJsonLd`
deliberately **omits street address/geo and `aggregateRating`** until the canonical NAP and
real reviews are confirmed — do not add fake review markup.
