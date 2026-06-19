# Trinity Garage Door — Next.js Migration Plan

## Context

The Bold Trade homepage is **live today as a static page** on Cloudflare Pages
(`https://trinity-garage-bold-trade.pages.dev/`). It is a single hand-built file —
`mockup/v3/dist/index.html` (≈550 lines, all inline styles) wrapped in a `<x-dc>`
element and hydrated by a design-tool runtime (`support.js` / `DCLogic`). That runtime
does only three things we need to keep: set theme CSS vars (`--accent`, `--ov`),
reveal-on-scroll via `IntersectionObserver`, and autoplay muted/looped `<video>`.

We are converting it into a real **Next.js 16 + React 19** app deployed to **Cloudflare
via OpenNext**, using the stack proven in the example `package.json` (the `kevincameron`
project) **minus Stripe**. This gives us a maintainable codebase, a working
contact/estimate flow, proper SEO for local search, and room to grow into the full site
IA (services, service areas, doors, about) that the homepage nav already points at.

**Source material:** the full project research now lives in the repo — see
`SOURCE-MATERIAL-MAP.md` for which source to read for each build piece. The locked IA and
navbar are in `site-audit/ARCHITECTURE-PROPOSAL.md` and `site-audit/NAVBAR-SPEC.md`; their
*WordPress* and *Calendly* choices are **superseded by this plan**, but everything else
(sitemap, intent model, navbar, brands catalog, 301 map) stands.

## Decisions locked (2026-06-19)

| Topic | Decision |
|---|---|
| **Booking flow** | "Book a Repair" → real **Housecall Pro** scheduler (embed/link). A separate **contact / free-estimate form** posts to a Next API route → **Resend** email (+ reCAPTCHA). |
| **v1 scope** | **Homepage only**, then iterate. Full parity + working form + SEO/schema + Cloudflare deploy. Routes/nav scaffolded; inner pages are later phases. |
| **Lead storage** | **Email + Cloudflare D1.** Each submission emails via Resend *and* inserts into a D1 `leads` table. |
| **Go-live** | **Replace the current Cloudflare deploy** (ship to a `*.workers.dev` URL like the present pages.dev one). Real-domain cutover from WordPress deferred. |

## Target stack (from the example `package.json`, Stripe removed)

**Keep:** `next@16`, `react@19`, `react-dom@19`, `@opennextjs/cloudflare`, `wrangler`,
`tailwindcss@4` + `@tailwindcss/postcss`, `shadcn` + `radix-ui` + `class-variance-authority`
+ `clsx` + `tailwind-merge` + `tw-animate-css`, `lucide-react` (icons), `motion`
(scroll reveal), `embla-carousel-react` (carousels), `resend` + `@react-email/components`
+ `@react-email/render` (transactional email).

**Drop:** `@stripe/react-stripe-js`, `@stripe/stripe-js`, `stripe` (no payments);
`recharts` (no charts on this site — re-add only if a data viz is wanted); `yaml` and the
`scripts/block-vendor/*` tooling are optional (only if we later vendor shadcnblocks).

**Add:** D1 binding (no new package — uses `wrangler` + `getCloudflareContext()`).

> Note: the live site is on Cloudflare **Pages** (static). OpenNext deploys a **Worker**,
> so go-live produces a new `*.workers.dev` URL. We can name the Worker to mirror the
> current hostname or attach a custom subdomain later.

## Repository layout

The Next app lives at the **repo root** (replacing the placeholder `package.json`).
Existing folders stay as source-of-truth references and are outside the build:

```
/                      ← Next app root (app/, public/, lib/, components/, db/, *.config)
  app/                 ← App Router
  components/          ← UI + section components
  lib/                 ← site config, helpers, cn()
  db/migrations/       ← D1 SQL migrations
  public/assets/       ← images + video copied from design-assets/ & mockup/v3/assets
  copy/                ← (source) finished copy for inner pages — Phase 2 input
  design-assets/       ← (source) curated asset pack + ASSET-PLACEMENT-GUIDE.md
  research/            ← (source) raw discovery pack (old-site copy, media inventories)
  site-audit/          ← (source) old-site audit + LOCKED IA & navbar spec + 301 map
  mockup/v3/dist/      ← (source) the page we are porting (reference only)
  SOURCE-MATERIAL-MAP.md  ← which source to read for each build piece
```

- `git init` the repo (it is not currently under version control); branch before committing.
- Extend `.gitignore` with `.next/`, `.open-next/`, `.wrangler/`, `node_modules/`,
  `.dev.vars`, `.env*`.

---

## Phase 0 — Scaffold & infrastructure

1. **Init project at root:** Next 16 App Router + TypeScript. Rewrite root `package.json`
   (name `trinity-garage-door`) with the scripts from the example: `dev`, `build`,
   `preview`/`deploy`/`upload` via `opennextjs-cloudflare`, `cf-typegen`, and the
   `db:migrate(:local)` / `db:seed` D1 scripts.
2. **Tailwind 4 + tokens:** `app/globals.css` with `@import "tailwindcss";` and a
   `@theme` block for brand tokens pulled from the live page:
   accent `#b8202a`, ink `#1A1A1A`, sand `#F2F0EC`, plus fonts. Load **Archivo Expanded**
   (display) + **Hanken Grotesk** (body) via `next/font/google` (self-hosted, no CLS).
3. **shadcn init:** `npx shadcn@latest init` (Tailwind 4 / React 19). Adds `components.json`,
   `lib/utils.ts` (`cn`). Pull primitives as needed: `button`, `navigation-menu` (desktop
   mega-menu), `sheet` (mobile drawer), `input`, `textarea`, `label`, `select`.
4. **OpenNext + Cloudflare config:**
   - `next.config.ts` → call `initOpenNextCloudflareForDev()` from `@opennextjs/cloudflare`.
   - `open-next.config.ts` → `defineCloudflareConfig({})`.
   - `wrangler.jsonc` → `main: .open-next/worker.js`, a current `compatibility_date`,
     `compatibility_flags: ["nodejs_compat"]`, `assets` binding, and the **D1 binding**
     `DB`.
   - `pnpm cf-typegen` → generate `cloudflare-env.d.ts`.
5. **Environment** (carry over from `.env.local`, drop Stripe):
   - Keep: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`,
     `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`, `CLOUDFLARE_ACCOUNT_ID`,
     and `NEXT_PUBLIC_SITE_URL` (the deploy URL for now).
   - Local dev secrets go in `.dev.vars`; production secrets via `wrangler secret put`
     (`RESEND_API_KEY`, `RECAPTCHA_SECRET_KEY`). Read server secrets in route handlers via
     `getCloudflareContext().env` (falls back to `process.env` in plain `next dev`).
   - Delete all `STRIPE_*`, `STRIPE_WEBHOOK_*`, `STITCH_WITHGOOGLE_API_KEY`, `NEXTJS_ENV`.
6. **Assets:** copy the real files into `public/assets/` — logo, badges, all `brandlogo-*`,
   `jobsite-*`, `door-after-*`, `team-*`, `owner-jason-placeholder.png`, and the videos.
   Use the **new `hero-26-v1.mp4` (6.96 MB)** for the hero (not the 19.9 MB original) and
   `clip-door-opening.mp4` for the stats clip. Follow `design-assets/ASSET-PLACEMENT-GUIDE.md`
   — note the brand-logo "white card" caveat (some logos have baked-in colored blocks).

## Phase 1 — Port the homepage to React

Goal: pixel-faithful parity with the live page. Convert inline-styled HTML → componentized
JSX with Tailwind. Replace the three `DCLogic` behaviors natively. Build `app/page.tsx`
from these section components (one file each under `components/sections/`):

| # | Section | Component notes |
|---|---|---|
| 1 | Utility bar | red top strip, phone + location (hidden on mobile) |
| 2 | **Header / nav** | `next/image` logo (kept **large**, owner request). Desktop **mega-menu** → Radix `NavigationMenu`. **Build the mobile menu** → `Sheet` drawer — *currently the hamburger button has no handler; this is a real gap, not a port.* Full spec: `site-audit/NAVBAR-SPEC.md` (mega-menu columns, mobile accordion, sticky bar). |
| 3 | Hero | `<video>` (new clip, `muted/loop/playsinline/autoPlay`, poster), gradient overlay, headline, dual CTA |
| 4 | Trust strip | badges (`next/image`) + Google/BBB/license text |
| 5 | About split | team photo, owner card (AI placeholder — flag), stats badge |
| 6 | Partner logos | CSS marquee (keep keyframes) or Embla auto-scroll; logos on white cards |
| 7 | Why-us (4 cards) | lucide icons replace inline SVG |
| 8 | Stats band + clip | 4 stat tiles (provisional) + looped clip video |
| 9 | Before/After (3) | AFTER images present; **BEFORE are placeholders** — keep "coming soon" slot |
| 10 | Service-area map | stylized CSS map + city pills; ZIP form (see below) |
| 11 | Reviews (4) | sample data for now; render from `lib` so real Google reviews swap in later |
| 12 | **Booking band** | replace the fake "Housecall Pro" calendar with the **real HCP scheduler** embed/link (decision) |
| 13 | Instagram grid (6) | `next/image` tiles linking to the IG profile |
| 14 | Big red CTA | book + call |
| 15 | Footer | logo, links (some `#` placeholders), socials, license line |
| — | Sticky mobile bar | fixed call/book bar < 920px |

**Replace the `DCLogic` runtime:**
- *Theme vars* → Tailwind tokens / CSS variables in `globals.css` (no JS needed).
- *Scroll reveal* (`.reveal` + IntersectionObserver) → `motion`'s `whileInView` (or a tiny
  `useInView` hook), preserving the fade-up.
- *Video autoplay priming* → native `muted autoPlay loop playsInline` + a small client
  component that calls `.play()` on mount for Safari/iOS reliability.
- *Icons* → swap every inline `<svg>` for `lucide-react` (phone, map-pin, chevron, check,
  clock, shield, zap, arrow-right, instagram, facebook, etc.).

**Centralize content** in `lib/site.ts` so nav, footer, schema, and future pages share one
source: NAP (`(813) 279-6785` / `tel:+18132796785`), license `GD13010 / GDI-09484`, the
six cities (Lutz, Land O' Lakes, Wesley Chapel, Palm Harbor, Oldsmar, Tampa), services
(slug/title/blurb), brands (logo path + alt + needs-white-card flag), sample reviews, and
social links. Real values — the **8 named Google reviews**, the per-brand **install-vs-service**
flag, and the **NAP to standardize** — come from `site-audit/` (see `SOURCE-MATERIAL-MAP.md`).
Note the homepage's single phone `(813) 279-6785` and "2007" founding year are **unconfirmed
picks**, not verified facts — settle before the domain cutover.

## Phase 2 — Dynamic features

1. **Housecall Pro booking:** embed the HCP online-booking widget (script/iframe) in the
   booking band, or link the CTAs straight to the HCP booking URL. Keep the `#book` anchor
   target so every "Book a Repair" CTA still lands there.
2. **Contact / free-estimate form** (the `/get-service` + contact entry points):
   - Client form: name, phone, email, city (the six), service type, message. Lightweight
     (no `react-hook-form` needed to match the lean stack; add zod validation server-side).
   - `app/api/contact/route.ts` (Edge/Workers): verify **reCAPTCHA** (`RECAPTCHA_SECRET_KEY`
     fetch), then **send via Resend** using a `@react-email/components` template
     (`CONTACT_FROM_EMAIL` → `CONTACT_TO_EMAIL`), then **insert into D1**.
3. **D1 lead store:** `wrangler d1 create trinity-leads` → put `database_id` in
   `wrangler.jsonc` (`DB` binding). Migration `db/migrations/0001_leads.sql`:
   `leads(id, created_at, name, phone, email, city, service, message, source)`. Apply with
   `pnpm db:migrate:local` / `pnpm db:migrate`. In the route, write via
   `getCloudflareContext().env.DB.prepare(...).bind(...).run()`.

## Phase 3 — SEO & metadata (high value for local search)

- **Per-route metadata** via the Next Metadata API; `metadataBase = NEXT_PUBLIC_SITE_URL`,
  title template, description, Open Graph + a homepage OG image.
- **`LocalBusiness` JSON-LD** in `app/layout.tsx` (or a `<JsonLd>` component): name, logo,
  url, `telephone +18132796785`, `address` (PostalAddress), `geo`, `areaServed` = the six
  cities, 24/7 `openingHoursSpecification`, license, `sameAs` (Instagram/Facebook),
  `aggregateRating` (4.9 — **mark provisional**, see open items).
- **`app/sitemap.ts`** and **`app/robots.ts`** (Next conventions).
- **301 redirects:** wire the old→new URL map from `site-audit/ARCHITECTURE-PROPOSAL.md §6`
  into `next.config` `redirects()` (e.g. `/services/garage-door-spring-repair-and-replacement/`
  → `/services/repair/spring/`, `/home/` → `/`) so legacy WordPress URLs keep their SEO at
  the eventual domain cutover. Build the map now; it's harmless on the `*.workers.dev` URL.
- Keep the page's already-good `alt` text (the old WordPress site's empty alt text was a
  flagged problem; the new markup fixed it — preserve that).

## Phase 4 — Build, preview & deploy

1. `pnpm dev` — local parity check against the live pages.dev page.
2. `pnpm preview` — `opennextjs-cloudflare build && preview` to exercise the **Workers
   runtime** locally (catches `nodejs_compat` / binding issues the dev server hides).
3. `pnpm deploy` — build + deploy the Worker. Set production secrets
   (`wrangler secret put RESEND_API_KEY`, `RECAPTCHA_SECRET_KEY`), apply remote D1
   migration (`pnpm db:migrate`), confirm env vars. This **replaces the current deploy**
   as the live URL; real-domain cutover stays deferred.

---

## Verification (end-to-end)

- **Visual:** side-by-side with `trinity-garage-bold-trade.pages.dev` at desktop, tablet,
  and mobile widths; confirm the **mobile menu** (new) and **sticky bar** work.
- **Form:** submit the contact form → (a) email lands at `CONTACT_TO_EMAIL`, (b) a row
  appears in D1 (`wrangler d1 execute DB --local --command "SELECT * FROM leads"`),
  (c) reCAPTCHA rejects an empty/failed token.
- **Booking:** every "Book a Repair" CTA reaches the Housecall Pro scheduler.
- **Lighthouse (mobile):** watch LCP/perf (hero video weight, `next/image` sizing), a11y,
  and SEO; validate JSON-LD in Google's Rich Results Test.
- **Workers preview** passes before `deploy`; after deploy, smoke-test the live URL and do
  one real form submission (remote D1 + email).

## Decisions to settle before launch (from `copy/services/README.md` + asset guide)

- **Founding year:** copy/logo say "since 2007"; state records say 2011 — pick one sitewide.
- **Phone:** confirm `(813) 279-6785` is the single number (old site listed three by county).
- **Provisional stats:** 18+ yrs, 12k+ doors, 4.9★, 6 cities — confirm real figures (the
  page even shows a "figures provisional" disclaimer).
- **No prices/warranty** stated yet (per the no-invent rule) — add when known.
- **Placeholders to replace:** owner AI image → real headshot; missing **before** photos;
  `#` footer links (Blog/Safety/DIY/FAQ, Facebook/LinkedIn/Yelp/Google/BBB); reviews are
  samples pending a real Google-reviews feed; Wayne Dalton listed under openers (it's a
  door maker) — phrased as "service & repair," confirm.

## Later phases (not in v1)

Inner pages built on the centralized `lib` data + finished `copy/`:
**Services** (`/services/` hub + installation, repair + spring/opener/off-track,
replacement — copy already written; emergency, cables-rollers, tune-up need copy),
**Service areas** (6 city pages — need copy), **Doors** (types/brands/brochures),
**About** (our-story/portfolio/reviews), plus real Google reviews, real before/after
photos, and the resources/blog. Real-domain cutover from WordPress when approved.
