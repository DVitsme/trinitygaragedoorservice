# Source Material Map — how to use & reference the project research

This repo now contains all of the project's source material. This doc explains **what each
source is and how it feeds the Next.js build** (see `NEXTJS-MIGRATION-PLAN.md`). It exists
because the strategy/IA work was done before the build, in separate folders, and the build
needs one place that says "for X, read Y."

## What was just brought in: `site-audit/`

Copied from the sibling folder `../site-audit/` into the repo root (verified identical) so
the project is **self-contained** before we `git init`. It is a 9-file audit of the
**existing** `trinitygaragedoorservice.com` (the WordPress site we're replacing), captured
2026-06-15, plus the **locked IA and navbar spec** the live homepage was built against.

```
site-audit/
  00-INDEX.md                 Master content map of the old site (~44 URLs) + 14 cross-cutting findings (F1–F14)
  01-homepage-and-company.md  Home, /home/ (dup), About, Portfolio, Service Areas — full copy + image tables
  02-services.md              Services hub + 6 service detail pages — full copy + image tables
  03-brands.md                Brands hub + 10 brand pages — copy, models, the install-vs-service contradiction
  04-resources-and-conversion.md  Door Types, Safety Tips, Troubleshooting, 26 Brochure PDFs, Schedule/Estimate/Promo
  05-blog-part1.md            Blog index + posts 1–7 (full audit)
  06-blog-part2.md            Blog posts 8–13 (full audit)
  ARCHITECTURE-PROPOSAL.md    ★ LOCKED new IA: sitemap, intent model, brands-catalog decision, 301 redirect map, phasing
  NAVBAR-SPEC.md              ★ LOCKED navbar: Services mega-menu + mobile accordion + sticky bar spec
```

> The two ★ files are **build contracts**, not just analysis — the shipped homepage's nav
> hrefs (`/services/repair/emergency/`, `/doors/brands/`, `/service-areas/lutz/`, …) come
> straight from them. Keep all nine files together; they cross-reference each other by bare
> filename.

## ⚠️ Reconciliation — what the audit locked that we have SINCE overridden

`ARCHITECTURE-PROPOSAL.md` / `NAVBAR-SPEC.md` were locked **2026-06-15**. Two of their
decisions are now superseded by decisions made **2026-06-19** (in `NEXTJS-MIGRATION-PLAN.md`).
When the audit and the migration plan disagree, **the migration plan wins** on these two:

| Topic | Audit says (2026-06-15) | Current decision (2026-06-19) |
|---|---|---|
| **Platform** | WordPress rebuild | **Next.js 16 + OpenNext on Cloudflare** |
| **Booking** | Calendly placeholder | **Housecall Pro** scheduler + Resend contact/estimate form |

**Everything else in the audit still stands** — the sitemap, the intent-based IA, the
navbar structure, the brands-catalog decision, the service-area strategy, the 301 map, the
findings, and all the page copy/asset inventories. Read the audit through that lens.

## File-by-file: what we use it for

| Source | Used for | Build phase |
|---|---|---|
| `NAVBAR-SPEC.md` | **The spec for the nav** — incl. the **mobile menu that the live page never implemented** (hamburger has no handler). Build the desktop mega-menu + mobile accordion + sticky bar from here. | Phase 1 (homepage) |
| `ARCHITECTURE-PROPOSAL.md` §3–4 | The route tree / `app/` folder structure and the nav data in `lib/site.ts`. | Phase 1, then inner pages |
| `ARCHITECTURE-PROPOSAL.md` §6 | The **301 redirect map** (old WP URLs → new). Wire into `next.config` `redirects()` (or middleware) **before the real-domain cutover** to preserve SEO. | Go-live (deferred) |
| `00-INDEX.md` findings F1–F14 | The "don't repeat these mistakes" checklist: canonical home, real NAP, working forms, alt text, FAQ schema, no empty promo page. | Phases 1–3 |
| `02-services.md`, `03-brands.md`, `04-…md` | Source **content + per-page meta + image URLs** for the inner pages (services, brands catalog, door types, resources). Pair with the *rewritten* copy in `copy/`. | Phase 2 (inner pages) |
| `05/06-blog-*.md` | Blog **pillar→cluster** plan (Hurricane / Springs / Noises / Seasonal-Maintenance + the "Understanding Garage Doors" pillar), the ~monthly editorial calendar, and the two duplicate "noises" posts to consolidate. | Phase 2+ |
| `01-homepage-and-company.md` | Cross-check homepage facts; source the **8 real named reviews** and the **~31 portfolio photos** list. | Phase 1 / Phase 2 |

## Concrete build inputs the audit unlocks (the gold)

Pull these into `lib/site.ts` (one source of truth) and the schema/SEO work:

- **NAP — needs a decision, then standardize everywhere.** The old site is inconsistent and
  the live homepage already made unverified choices:
  - **Phone:** old site shows 3 county lines — Hillsborough (813) 447-3874 · Pasco (813)
    279-6785 · Pinellas (727) 314-5062 — plus a stray (727) 388-7898 and mismatched `tel:`
    links. The new homepage uses **only (813) 279-6785**. Confirm: one number, or route by
    county? (`NAVBAR-SPEC.md` flags this too.)
  - **Address:** 3 locations (Oldsmar 34677, Lutz 33549, Tampa) with the **Tampa address
    conflicting** (14056 N Florida Ave 33613 vs 4900 N Florida Ave Ste 301 33603). The new
    footer shows no street address. **LocalBusiness JSON-LD needs a canonical address** —
    pick one (or mark Lutz as primary).
  - **Hours:** old site = Mon–Sat 7am–9pm, Sun closed; brand promises **24/7 emergency**.
    Model both in schema (office hours + 24/7 emergency line).
- **Founding year:** old site says **2007** consistently (homepage uses 2007); state records
  say 2011. One sitewide answer (still open).
- **Brands (10) + the install-vs-service truth.** 4 doors (Clopay, C.H.I., Hörmann, Amarr)
  + 6 openers (Chamberlain, Craftsman, Genie, LiftMaster, Linear, Wayne Dalton). The old hub
  said most are "service-only" but **every brand detail page claimed full install** — a
  contradiction. Resolve once into a `relationship` field per brand (Install/Sell vs
  Service-only) feeding the future `/doors/brands/` catalog. Model lists per brand are in
  `03-brands.md`.
- **Service areas (6 cities), locked:** Lutz, Land O' Lakes, Wesley Chapel, Palm Harbor,
  Oldsmar, Tampa. Matches the homepage. Templated city pages later.
- **Reviews:** 8 **real named** Google reviews (Shilen Patel, Kay Bennett, Ron Sompels,
  Charles Cohn, E R, Lynn Rosenthal, Tracey Dominguez, Jonathan B.) in
  `01-homepage-and-company.md` — replace the 4 placeholder samples on the live homepage.
- **Pricing data point:** the only price on the entire old site — Tampa-area repair **$65–$600**
  (in the "Understanding Garage Doors" blog post). Relevant to the still-open *pricing
  posture* decision.
- **Seasonal promos** found in the blog (December: Broken Springs Special + $100 off
  LiftMaster; August: 10% off + $100 off hurricane-rated doors) — inputs for a future
  CMS-managed `/specials/` page (shown only when an offer is live; fixes finding F8).
- **301 redirect map** — in `ARCHITECTURE-PROPOSAL.md §6`.

## How `site-audit/` relates to the other source folders

All four describe the same business at different stages — don't confuse them:

| Folder | What it is | Authority |
|---|---|---|
| `research/` | **Raw** discovery: business summary, external research, the old site's copy transcribed page-by-page (`web-copy/`), and media inventories (`images/`, `videos/`). | Raw reference |
| `site-audit/` | **Analysis** of that same old site + the **locked new IA/navbar**. | IA/strategy (minus the 2 superseded decisions above) |
| `copy/` | The **new, finished, rewritten** marketing copy (home + 7 service pages + voice rules). Dash-free, de-AI'd. | ★ Primary copy for the build |
| `design-assets/` + `mockup/v3/` | The **curated assets** + the **shipped Bold Trade design** we're porting. | ★ Primary design |

Rule of thumb when building a page: **layout** from `mockup/v3` + `NAVBAR-SPEC.md`,
**words** from `copy/`, **structure/SEO/asset URLs** from `site-audit/`, **raw fallback**
from `research/`.

## Asset capture — ✅ DONE (2026-06-19)

Pulled the old-site assets that would have vanished when WordPress is retired:

- **`public/brochures/`** — **25 manufacturer PDFs** (6 C.H.I. · 12 Clopay · 7 LiftMaster),
  71 MB, all verified. For the future `/doors/brochures/`. The links were Elementor-JS-injected
  (not in static HTML), so URLs came from `site-audit/04-resources-and-conversion.md`. The
  audit's "26" was an off-by-one (itemized list = 25). See `public/brochures/README.md` for
  the filename→product manifest.
- **`public/portfolio/`** — **30 finished-job photos** (full-res), 21 MB, for `/about/portfolio/`.
  One exact re-upload duplicate and two stray logo PNGs were dropped; responsive thumbnails
  collapsed to the full-size original. See `public/portfolio/README.md` for caveats (no alt
  text, no paired "before" shots, a few low-res).

**Still external (capture if/when wanted):** per-service and door-style job photos and brand
product shots remain on the old site (catalogued in `site-audit/` + `research/images/`); most
are lower-value than the curated `design-assets/`, so they were left for now.

---

**See also:** `NEXTJS-MIGRATION-PLAN.md` (the build plan). This map is its companion: the
plan says *how to build*, this says *which source to read for each piece*.
