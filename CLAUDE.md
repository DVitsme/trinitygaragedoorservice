# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ✅ DESIGN-PORT BUILD COMPLETE (2026-06-22)

The 1:1 design → Next.js build is **done**. Every approved `*.dc.html` "Bold Trade" design (in `trinitygaragedoorservice.com/`) is now a live Next.js page, each `pnpm build`-green and **production-screenshot-verified 1:1**. Final build: **32 static pages, 0 errors**. **~27 commits ahead of origin/main, UNPUSHED** — the user pushes via `! git push origin main` (the auto-mode classifier blocks me from pushing to main).

**Built (all under `app/`):** `/` home (bespoke), `/services/` hub, `/services/repair/` hub (bespoke), the 6 repair detail pages + `/services/replacement/` + `/services/installation/` (via `components/blocks/repair-detail-layout.tsx` `RepairDetailData`), `/service-areas/` hub + 6 city pages (via `components/blocks/city-area-layout.tsx` `CityAreaData`), `/doors/{types,brands,brochures}/`, `/about/{our-story,portfolio,reviews}/`, `/contact/` (wraps the existing Resend/D1/Turnstile `ContactForm`), `/privacy-policy/`. Foundation: `app/globals.css` Bold Trade `@theme` tokens (`accent/ink/cream` + `--font-display`/`--font-body`; **custom breakpoints `nav`=920px, `xs`=560px** — use `max-nav:`/`nav:`/`max-xs:`, NOT `md:`/`lg:`); `lib/site.ts` (`ROUTES`, `SERVICES`, `AREAS`, `GOOGLE_REVIEWS`, `BRAND_CATALOG`, `getNavConfig`); reusable blocks in `components/blocks/` incl. `service-area-map-mock.tsx`.

**Conventions baked into every page (keep if extending):** dash-free copy (no em/en/hyphen); reviews use the 8 verbatim `GOOGLE_REVIEWS` (never invent testimonials); client unknowns kept as **visible** placeholders (G16); per-route `metadata` + Breadcrumb/FAQ JSON-LD (no `aggregateRating` per G6).

**⚠️ VERIFY VIA PRODUCTION, NOT `next dev`** (cost ~30 min to learn): in `next dev` (Turbopack) headless Chrome intermittently fails to load CSS chunks (`ChunkLoadError`), so `nav:`/`max-nav:` media-query grids silently render **stacked** — a phantom regression that is NOT in the code. Always `pnpm build` → `pnpm exec next start -p 3000` (Bash `run_in_background:true`) → screenshot that. Crop with PIL (no ImageMagick here). Full recipe + page status in **`trinitygaragedoorservice.com/handoff/BUILD-PROGRESS.md`**.

**Remaining work is NOT design-port:** (1) ~~dead-code cleanup~~ ✅ **DONE** — the 12 unused old-home files in `components/sections/` were deleted; only `utility-bar, site-footer, sticky-mobile-bar` remain (imported by `layout.tsx`). (2) Build `/resources/{blog,safety-tips,troubleshooting,faq}/` from existing copy (`copy/resources/`, `content/blog/`) with a generic template (never designed). (3) Settle the launch-blocking client decisions in the `trinity-open-decisions` memory. (4) Optional Radix `NavigationMenu`/`Accordion` a11y upgrade (G8).

> The sections below describe the PRE-design-port state and are mostly historical now (the old `app/page.tsx`+`components/sections/` homepage was replaced). The **Gotchas** section still fully applies (esp. Archivo Expanded via `<link>` not `next/font/google`, `@/*`→repo root, keep the Turnstile/Resend/D1 infra). The `components/blocks/` + `accent/ink/cream` + `font-display/font-body` system is now the only architecture.

## 🔖 Booking / Housecall Pro integration — SHELVED, revisit with the HCP login + real data (2026-06-22)

The **Book a Repair** page (`app/book-a-repair/`, ported from `handoff/06-book-a-repair.md` + `handoff/Trinity Book a Repair (Bold Trade).dc.html`) is built. Its whole job is to **frame + launch HCP's booking** — no calendar/form on our side. Designer knowledge brief: `handoff/BOOK-A-REPAIR-HCP-BRIEF.md`.

**Mechanism = the HCP embed: a "Book Online" button → modal popup over the page. No MAX plan needed.** `components/book-online-button.tsx` is the single mount point for all four "Book Online" buttons; today it opens the hosted booking URL (`NEXT_PUBLIC_BOOKING_URL` → `SITE.bookingHref`), with a documented `TODO(HCP)` to call HCP's modal open-API once their embed script is added. `ROUTES.bookRepair` now → `/book-a-repair/` (every site-wide "Book a Repair" CTA lands there). **To go live:** set `NEXT_PUBLIC_BOOKING_URL` to Trinity's HCP booking URL (HCP → Online Booking → Share), then drop in HCP's embed script + wire `openBooking()`.

**Researched HCP options (2026-06-22), so we don't re-derive:**
- **Website embeds (no MAX needed):** (1) "Book Online" button → **modal overlay** (documented, recommended); (2) **hosted link**; (3) Reserve with Google. There is **no official inline-iframe widget**, BUT `book.housecallpro.com` returns **no `X-Frame-Options` / no CSP `frame-ancestors`** (checked via `curl -I`), so a DIY inline `<iframe>` of the hosted URL *does* render — unsupported, height/scroll-fragile; test the real URL before relying on it.
- **Public API = MAX plan only** (API key / OAuth, **server-side only — never put it in the browser**). **KEY FINDING:** the API is **back-office** (create customers / jobs / appointments, update job schedule + arrival windows, invoices, payments) and **does NOT expose a customer-facing bookable-availability endpoint**. So a MAX key **cannot** cleanly power a true live-availability calendar — you'd have to recompute availability yourself (rebuild HCP's scheduler; fragile). Realistic API-native option = a branded **"request a window, we confirm"** form (POST a job), NOT a live calendar. The better use of the MAX API = **back-office lead/data sync** (push `/contact` + estimate-form leads into HCP).

**REVISIT after we have the Housecall Pro login + account data:** grab the real booking URL + embed snippet, decide modal vs inline-iframe, and evaluate whether MAX is worth it for lead sync. Until then the Book a Repair buttons open `bookingHref` (set the env var to make them live).

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
pnpm deploy              # build + deploy the Worker to Cloudflare
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
