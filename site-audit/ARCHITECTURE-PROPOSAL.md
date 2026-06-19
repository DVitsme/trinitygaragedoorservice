# Trinity Garage Door Service — IA Assessment & Proposed New Architecture (Draft v1)

> Companion to `00-INDEX.md`. Grounded in the six audit reports. Finding numbers (e.g. *F7*) reference "Consolidated cross-cutting findings" in the index.

## ✅ Direction locked (2026-06-15)
| Decision | Choice | Effect on IA |
|----------|--------|--------------|
| **Lead-gen priority** | **Repair & emergency** | Homepage + nav lead with "Book a Repair"; Repair is the first menu and primary button |
| **Local SEO** | **A few key cities** | Templated pages for the 6 named towns (Lutz, Land O' Lakes, Wesley Chapel, Palm Harbor, Oldsmar, Tampa) |
| **Brands** | **Filterable catalog** | Retire the 10 duplicate pages; one data-driven catalog |
| **Booking** | **Real online scheduling** | Pick-a-slot centerpiece; **Calendly placeholder** until dispatch tool chosen |
| **Platform** | **WordPress** (rebuild) | New theme/blocks, keep CMS + the 26 PDFs |
| **Design** | **Brand refresh** | New visual identity within WordPress |
| **Navbar** | **Services mega-menu — trimmed to 3 top-level items** | Resources → footer; Service Areas → single link. Spec in `NAVBAR-SPEC.md` |

*Still open: pricing posture — see §8.*

---

## 1. Current architecture in one line
A WordPress site with a **deep, flat ~14-item nav**, a **duplicate homepage**, a real services hub but **siloed, overlapping** service pages, **10 near-duplicate brand pages**, useful but **AI-rough resource content**, a **Florida-hurricane blog** with no taxonomy, and **two identical lead forms** plus an **empty/broken promo page** — all wrapped in a footer so heavy it's larger than most pages' unique content.

**The good** (keep & amplify): 18-yr tenure (since 2007), licensing, Angi 2024 / Elite trust stack, owner story, real job photography, 8 named reviews, 26 manufacturer brochures, genuinely useful education, and a differentiated **Florida storm/hurricane** content angle.

**The core problem:** the site is organized around *the business's page list*, not *the customer's intent*. A panicked "my spring just snapped" visitor and a considered "I want a beautiful new door" visitor get the same flat menu and the same generic form.

---

## 2. Design principles for the rebuild
1. **Organize by customer intent**, not by internal page taxonomy: *Repair now* · *Replace/Upgrade* · *Research* · *Trust*.
2. **Two clear conversion paths, one smart form:** "Book a Repair" (service/urgent) and "Get a Free Estimate" (sales/considered) → a single intent-aware flow.
3. **Componentize the chrome:** reviews, brand logos, badges, NAP, hours = shared blocks from one data source (fixes F3, F9).
4. **Data-driven catalogs, not hand-built duplicate pages** (brands, door types, service areas) (fixes F4).
5. **Local-first SEO:** real service-area structure + consistent NAP (fixes F9, leverages the Tampa Bay focus).
6. **Earn the click with content, then convert:** pillar→cluster education wired to service pages and booking (fixes F6, F11, F14).
7. **Accessibility & trust by default:** alt text, FAQ schema, working CTAs, honest pricing posture (fixes F7, F8, F10).

---

## 3. Top-level navigation — LOCKED (trimmed for conversion; full detail in `NAVBAR-SPEC.md`)
```
[Logo]  Services ▾  Service Areas  About ▾      ☎ 24/7 (813) 279-6785  ·  [ Angi '24 ★ ]  [ Book a Repair ]
```
- **Services ▾** — mega-menu, 3 columns: **Repair** *(priority — Emergency · Spring · Opener · Off-Track · Cables/Rollers · Tune-Up)* · **Install & Replace** *(New Installation · Door Replacement · Free Estimate)* · **Doors & Brands** *(Door Types · Brands catalog · Brochures)*
- **Service Areas** — single link → `/service-areas/` (cities listed on the hub + footer)
- **About ▾** — Our Story · Portfolio · Reviews
- **CTAs:** primary **[Book a Repair]** (Calendly) + loud 24/7 phone + a trust cue; **Free Estimate** stays secondary (mega-menu + heroes). **Resources** (Blog/Safety/Troubleshooting/FAQ) + Specials live in the footer. Mobile: sticky bottom bar (Call · Book a Repair).

Reduces 14 flat items to **3 top-level items (1 mega-menu + 2 links) + phone + 1 primary action**.

---

## 4. Proposed sitemap
```
/                                   Home (single canonical; retire /home/)            ← F1
/services/                          Services overview (intent split: Repair vs Replace)
  /services/repair/                 Repair hub — PRIORITY PATH, 24/7 emergency front-and-center
    /services/repair/emergency/     24/7 emergency repair (SEO: "emergency garage door repair near me")
    /services/repair/spring/
    /services/repair/opener/
    /services/repair/off-track/
    /services/repair/cables-rollers/
    /services/repair/tune-up/       (maintenance / safety inspection)
  /services/installation/           New door installation
  /services/replacement/            Door replacement
/doors/
  /doors/types/                     6 operating styles (+ materials done right)        ← fixes F12 mismatch
  /doors/brands/                    Filterable catalog (Doors | Openers, Install | Service) ← F4
  /doors/brochures/                 26 PDFs, grouped + searchable, soft lead capture
/service-areas/                     Hub (map + county list)                            ← F9
  /service-areas/lutz/              (migrate the Lutz blog post here)                  ← F14
  /service-areas/land-o-lakes/   /service-areas/wesley-chapel/   /service-areas/palm-harbor/
  /service-areas/oldsmar/        /service-areas/tampa/        (6 key cities — templated, data-driven)
/about/
  /about/our-story/                 Since 2007, team, licenses, "why hire us"
  /about/portfolio/                 Labeled before/after galleries                     ← F10
  /about/reviews/                   Aggregated reviews + schema
/resources/
  /resources/blog/                  Categories: Hurricane Prep · Springs · Diagnostics · Maintenance · Buying Guides
  /resources/safety-tips/
  /resources/troubleshooting/
  /resources/faq/                   New — consolidates FAQ-shaped content + schema     ← F11
/get-service/                       Online scheduling — real slots (Repair) + Free estimate/consult ← F5,F7
/specials/                          CMS-managed; only renders when offers are live     ← F8
/contact/
```

---

## 5. Key IA moves (what changes and why)

**A. Services: reorganize by intent, interlink, de-overlap.** Split into **Repair** vs **Install/Replace** hubs. Keep the strong per-service copy but (1) turn the "common issues / signs / parts" bullets into **inline links** to the specific service page, (2) add a "Related services" + "Recommended brands" module to each, (3) point footer "Services" links at the **detail pages**, not `/services/#anchors`. Merge the two Installation/Replacement content twins enough to differentiate them. *(F6)*

**B. Brands: 10 pages → 1 filterable catalog.** Replace the duplicate template pages with a data-driven catalog filterable by **Doors/Openers** and **We Install & Service / We Service**. One source-of-truth `relationship` field ends the hub-vs-detail contradiction. Per-brand detail becomes a generated card/section (logo, blurb, top models, brochure link, "Get an estimate"). 301 the old `/brands/<x>/` URLs to filtered/anchored catalog views. *(F4)*

**C. Booking: real online scheduling (decided — the centerpiece).** Merge Schedule + Estimate into `/get-service/` with an **intent toggle**:
- *Book a Repair* → issue type (spring/opener/off-track/…), urgency, **pick a real appointment slot**, address, optional photo → calendar/dispatch integration + automated confirmation & reminders.
- *Free Estimate* → project type, door style/brand (linked to Door Types/Brochures), budget range, address, optional photo → booked consult slot or scheduled callback.
Shared: name, email, phone, zip. Required markers, validation, confirmation state. **This is the fastest path from "my door broke" to a booked truck — the core of the repair-priority strategy.** *(F5, F7)*

**D. Service Areas: focused local-SEO layer (decided — 6 key cities).** Hub + **templated, data-driven city pages** for the towns named in copy: **Lutz, Land O' Lakes, Wesley Chapel, Palm Harbor, Oldsmar, Tampa**. Each: local intro, services offered, nearby areas, local reviews, NAP, map, and a repair-booking CTA. **Standardize NAP first** (one address per location, one correct phone per county). The template makes adding more towns cheap later if you expand. *(F9)*

**E. Blog: pillar → cluster.** Create pillar hubs (**Hurricane/Storm Prep**, **Springs**, **Noises/Diagnostics**, **Seasonal Maintenance**, **Buying/Upgrade**) that link down to posts and across to the matching service pages. **Consolidate the two duplicate "noises" posts** (301 one → the survivor). Add visible **dates, authors, categories**, real per-post imagery, and move the **Lutz** post to `/service-areas/lutz/`. *(F6, F12, F14)*

**F. Fix the trust/lead leaks now (pre-redesign quick wins).** Canonical homepage; correct & unify **phone/NAP**; either populate `/specials/` with real dated offers (code/amount/terms) or hide it and fix the dead CTA; add form fields + required + confirmation; bulk **alt text** + descriptive filenames. *(F1, F7, F8, F9, F10)*

**G. Componentize + design system.** Reviews, brand strip, badges, hours, NAP, CTAs become reusable components from one CMS source. Lightens every page (footer currently dominates), enables consistent updates, and sets up a refreshed visual design.

---

## 6. Migration / redirect notes (URLs change — plan 301s)
Representative mappings (full map to be generated from the 44-URL inventory):
| Old | New | Type |
|-----|-----|------|
| `/home/` | `/` | 301 |
| `/services/garage-door-repair-and-service/` | `/services/repair/` | 301 |
| `/services/garage-door-spring-repair-and-replacement/` | `/services/repair/spring/` | 301 |
| `/services/garage-door-opener-…/` | `/services/repair/opener/` | 301 |
| `/services/garage-door-off-track-…/` | `/services/repair/off-track/` | 301 |
| `/services/garage-door-installation/` | `/services/installation/` | 301 |
| `/services/garage-door-replacement/` | `/services/replacement/` | 301 |
| `/brands/<brand>/` (×10) | `/doors/brands/?b=<brand>` (or anchored) | 301 |
| `/garage-door-types/` | `/doors/types/` | 301 |
| `/brochure/` | `/doors/brochures/` | 301 |
| `/garage-door-safety-tips/` | `/resources/safety-tips/` | 301 |
| `/diy-garage-door-troubleshooting-guide/` | `/resources/troubleshooting/` | 301 |
| `/schedule-a-repair/` + `/request-an-estimate/` | `/get-service/` (intent deep-links preserved) | 301 |
| `/promo-discounts/` | `/specials/` (or → `/contact/` if no offers) | 301 |
| `/blogs/…/professional-…-in-lutz/` | `/service-areas/lutz/` | 301 |
| duplicate "noises" post | surviving post | 301 |

---

## 7. Suggested phasing
- **Phase 0 — Stop the bleeding (days):** fix phone/NAP, promo page + dead CTA, form fields/required/confirmation, canonical homepage. (Can ship on the current site.)
- **Phase 1 — IA & templates:** new nav, services restructure + interlinking, brands catalog, unified booking, service-area hub + first city pages, component-ize chrome.
- **Phase 2 — Content & SEO:** pillar/cluster blog + taxonomy, FAQ + schema, copy rewrite (de-AI), portfolio labeling, sitewide alt text/filenames, redirect map.
- **Phase 3 — Design system & polish:** visual refresh, performance, accessibility pass, analytics/conversion tracking.

---

## 8. Decisions & remaining questions

**Decided 2026-06-15:**
1. ✅ **Priority:** Repair & emergency-led.
2. ✅ **Local SEO:** A few key cities — the 6 named towns (templated).
3. ✅ **Brands:** One filterable catalog (retire the 10 duplicate pages).
4. ✅ **Booking:** Real online scheduling (pick-a-slot) — **Calendly placeholder** until the dispatch tool is finalized.
5. ✅ **Platform:** **WordPress** rebuild (new theme/blocks, keep CMS + 26 PDFs).
6. ✅ **Design:** **Brand refresh** (new identity within WordPress).
7. ✅ **Navbar:** Services mega-menu, trimmed to 3 top-level items (Resources → footer, Service Areas → single link) — see `NAVBAR-SPEC.md`.

**Still open (next):**
8. **Pricing posture** — introduce **"from $X" / a service-call fee / real promos**, or stay estimate-only? (Affects homepage, repair pages, and the `/specials/` page.)
9. **Scheduling tool (final)** — keep Calendly, or later integrate a field-service platform (Housecall Pro / ServiceTitan / Jobber)?
