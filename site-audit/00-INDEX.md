# Trinity Garage Door Service — Current Site Content Map (Master Index)

> **What this is:** a single-source map of the *existing* site (trinitygaragedoorservice.com) — every page, its purpose, copy themes, images, and how pages interlink — compiled from the six detailed audit reports in this folder. Captured **2026-06-15**.
> **Use it for:** planning the redesigned information architecture (see `ARCHITECTURE-PROPOSAL.md`).

## Detailed reports (read these for full copy + image tables)
| File | Covers |
|------|--------|
| `01-homepage-and-company.md` | Homepage `/`, `/home/`, About, Portfolio, Service Areas |
| `02-services.md` | Services hub + 6 service detail pages |
| `03-brands.md` | Brands hub + 10 brand pages |
| `04-resources-and-conversion.md` | Door Types, Safety Tips, Troubleshooting, Brochure + Schedule, Estimate, Promo |
| `05-blog-part1.md` | Blog index + posts 1–7 |
| `06-blog-part2.md` | Blog posts 8–13 |

## Quick stats
- **~44 URLs total:** 1 homepage (duplicated as `/` and `/home/`), 5 company/proof pages, 1 services hub + 6 service pages, 1 brands hub + 10 brand pages, 4 resource pages, 3 conversion pages, 1 blog index + 13 posts.
- **Company:** Trinity Garage Door Service, Inc. — Tampa Bay, FL (Hillsborough, Pasco, Pinellas). In business **since 2007**. Owner: **Jason Grunder**. Licensed/Bonded/Insured (**GD13010**, **GDI-09484**). Angi Super Service Award 2024 + "Elite" badges.
- **Platform:** WordPress. Two primary conversions everywhere: **Request an Estimate** (sales) and **Schedule a Repair / CALL NOW** (service).
- **Tone:** friendly, reassuring, "trusted local expert," with urgency on emergencies and a heavy **Florida climate / hurricane** angle in the blog.

---

## Global elements (repeat on every page)
- **Header nav:** Home · About Us · Services (+6) · Brochure · Brands (+10) · Door Types · Safety Tips · Troubleshooting · Service Areas · Blogs · Portfolio · Promo/Discounts · Request an Estimate · Schedule a Repair. → *Deep, flat, ~14 top-level items — a primary IA problem.*
- **Shared footer (the bulk of every page):** "Happy Customers" (same 8 Google reviews) · two brand-logo strips ("Brands we do Installation, Repair and Maintenance" / "Brands we Service, Repair and Maintain") · "Connect with Us" contact form (Name/Email/Message) · Business Hours (Mon–Sat 7am–9pm, Sun closed) · Licensed/Bonded/Insured + license #s · 3 locations · payments (incl. Zelle/Google Pay) · social · Angi/Elite badges.
- **Consequence:** on most pages the footer/chrome is larger than the unique content. Reviews, brand logos, badges, and NAP should become **shared components driven by one data source** in the rebuild.

---

## Full page inventory

### Homepage & company (`01`)
| URL | Type | Purpose / key copy | Primary CTA |
|-----|------|--------------------|-------------|
| `/` | Homepage | "The Most Trusted Name in Garage Doors" + "24/7 Emergency Repair." Trust → educate (curb appeal/security/efficiency) → FAQ → prove (reviews) → convert. | Estimate / Schedule / CALL |
| `/home/` | **Duplicate homepage** | Near-identical to `/` (adds 6 service tiles w/ "Learn More"). Canonicalization issue. | Estimate / Schedule |
| `/about-us/` | About | "Meet Our Team" — since 2007, licensed techs, 7 numbered "why hire us" reasons, "more than a dozen branches in Florida." | CALL / Estimate |
| `/portfolio/` | Proof gallery | ~31 before/after project photos. "See the quality and craftsmanship." | Estimate / CALL |
| `/service-areas/` | Local SEO | Tampa Bay + Hillsborough/Pasco/Pinellas; names brands + parts in stock. | Call Us Now / Estimate |

### Services (`02`)
| URL | Type | Purpose / key copy | Primary CTA |
|-----|------|--------------------|-------------|
| `/services/` | Services hub | Real hub: teaser + photo per service, "3 Simple Steps," "Why Choose Us." (H1 is brand copy, not a directory heading.) | Estimate / Schedule |
| `/services/garage-door-installation/` | Service | New-door install; materials (steel/wood/aluminum-glass/composite), ROI, warranty-preservation. Content twin of Replacement. | Estimate / CALL |
| `/services/garage-door-repair-and-service/` | Service | Catch-all repair + maintenance; same-day 24/7; "over 15 years." Acts as a soft secondary hub (re-covers spring/off-track/opener). | CALL / Estimate |
| `/services/garage-door-off-track-repair-and-replacement/` | Service | Off-track = safety hazard; strongest budget/affordability framing. | CALL / Estimate |
| `/services/garage-door-replacement/` | Service | Whole-door replacement; 6-step hassle-free process; parts replacement. Content twin of Installation. | Estimate / CALL |
| `/services/garage-door-spring-repair-and-replacement/` | Service | Springs = most dangerous failure; "don't DIY"; high-cycle upgrade. Structural twin of Opener. | CALL / Estimate |
| `/services/garage-door-opener-repair-and-replacement/` | Service | Opener repair + smart/Wi-Fi upgrade. Structural twin of Spring. | CALL / Estimate |

### Brands (`03`) — 10 near-identical template pages
| URL | Category | Notes |
|-----|----------|-------|
| `/brands/` | Hub | Buckets brands into "install" (Clopay, LiftMaster + 1) vs "service-only" (rest). |
| `/brands/clopay/` `/brands/chi/` `/brands/hormann/` `/brands/amarr/` | **Door** brands | Shared template (hero → history → residential/commercial → 5 "top-selling" models → reasons → testimonials → form). Clopay/Amarr fullest. |
| `/brands/chamberlain/` `/brands/craftsman/` `/brands/genie/` `/brands/liftmaster/` `/brands/linear/` `/brands/wayne-dalton/` | **Opener** brands | Same template, thinner. Wayne Dalton thinnest. Mostly stock/generic imagery (Amarr hero isn't even an Amarr door). |

### Resources (`04`)
| URL | Type | Content |
|-----|------|---------|
| `/garage-door-types/` | Education | 6 operating styles: Roll-Up, Sectional, Side-Hinged, Slide-to-the-Side, Tilt-Up Canopy, Tilt-Up Retractable. (Closing paragraph oddly references wood/metal/carriage materials not covered.) |
| `/garage-door-safety-tips/` | Education | 13 homeowner safety tips (sensors, manual release, kids, reinforcement, annual inspection). Duplicate "Keep Fingers Away" heading. |
| `/diy-garage-door-troubleshooting-guide/` | Education | 5 DIY-fixable issues + 5 "call a pro" issues (springs/cables/off-track). Strongest education→conversion bridge. |
| `/brochure/` | Catalog | 26 downloadable manufacturer PDFs: **6 C.H.I., 12 Clopay, 7 LiftMaster** doors/openers. Direct file links, no viewer, non-descriptive thumbnail names. |

### Conversion (`04`)
| URL | Type | Content |
|-----|------|---------|
| `/schedule-a-repair/` | Booking form | Fields: First, Last, Email, Phone, Zip, "Custom Type" radio (new/existing/other), Message → "Send." **All optional. No service type, date/time, or address — can't actually schedule.** |
| `/request-an-estimate/` | Estimate form | Same form but single "Name." **No project type, brand/style, budget, address, or photos — can't actually quote.** Near-duplicate of Schedule. |
| `/promo-discounts/` | Promotions | **Empty + broken:** says "we do not have any active promotions" under a "Limited-Time Discounts" headline; only CTA "Grab Now!" is a dead `#` link. |

### Blog (`05`, `06`) — index + 13 posts, no visible dates/authors
| Cluster | Posts |
|---------|-------|
| **Springs** | why-garage-door-springs-break-more-often-in-florida · floridas-february-temperature-swings-and-your-garage-door |
| **Noises / diagnostics** ⚠️ duplicate pair | what-those-garage-door-noises-actually-mean · what-that-strange-garage-door-noise-really-means-and-no-its-not-a-goblin |
| **Seasonal / holiday** | december-in-florida-garage-door · holiday-ready-homes-time-to-tune-up-your-garage-door |
| **Hurricane / storm prep** (largest cluster) | top-3-mistakes-...-storms · dont-let-your-garage-door-be-the-weak-link-this-hurricane-season · why-routine-...-during-storm-season · is-your-garage-door-hurricane-ready-5-signs-its-time-for-an-upgrade |
| **Curb appeal / upgrade** | how-a-new-garage-door-can-boost-your-homes-curb-appeal |
| **Local SEO** | professional-garage-door-repair-services-in-lutz (city landing page living inside the editorial blog) |
| **Educational pillar** | understanding-garage-doors-and-garage-door-repair (broad/evergreen, but not wired as a pillar) |

---

## Site relationship graph (current)
```
/  ≈  /home/   (DUPLICATE — pick one canonical)
│
├── About Us ─────── reuses global reviews/badges
├── Services (hub) ──┬── Installation ⟷ Replacement      (content twins, no inline cross-links)
│                    ├── Repair & Service  (re-covers ↓ but only links via nav)
│                    ├── Off-Track ─┐
│                    ├── Spring ────┤ structural twins; topics also live on Repair page
│                    └── Opener ────┘
│        (footer "Services" links point to /services/#anchors, NOT the detail pages ⚠️)
│
├── Brands (hub) ──── 10 thin template pages (doors vs openers); install-vs-service label
│                     contradicts detail-page claims; names brands but no inline brand links
│                     from service pages
│
├── Resources: Door Types · Safety Tips · Troubleshooting · Brochure(26 PDFs)
│        └─ all funnel to → Schedule / Estimate
│
├── Service Areas ─── single page (Tampa Bay + 3 counties); overlaps Brands + Services
│
├── Portfolio ─────── ~31 photos, no alt text / no labels
│
├── Blog (13 posts) ─ Florida climate / hurricane editorial calendar; every post → Schedule + Estimate
│
└── Conversions: Schedule a Repair · Request an Estimate · Promo (empty/broken)
         (Schedule ≈ Estimate: same generic form, two URLs)
```

---

## Consolidated cross-cutting findings (carry into redesign)

**Structural / IA**
1. **Duplicate homepage** `/` vs `/home/` — canonicalize/redirect to one.
2. **Bloated flat nav** (~14 top-level items) — needs grouping into a shallow, intent-based menu.
3. **Heavy shared footer = most of every page** — convert reviews, brand logos, badges, NAP into shared, data-driven components.
4. **10 near-duplicate brand pages** — collapse into one filterable Brands catalog from structured data.
5. **Booking duplication** — Schedule and Estimate are the same form at two URLs; unify into one intent-aware flow.
6. **Internal-linking gaps** — service pages name brands/related services but never inline-link to them; footer "Services" links resolve to hub anchors, not detail pages; blog/pillar not wired as pillar→cluster.

**Conversion-blocking bugs (fix first)**
7. **Forms can't do their job** — neither captures service type, date/time, address, budget, or photos; nothing is required → weak/junk leads, manual phone follow-up always needed.
8. **Promo page is empty + dead CTA** (`Grab Now!` → `#`) yet homepage/blog drive traffic to it.
9. **NAP / phone inconsistencies** — Tampa address differs by page (14056 N Florida Ave 33613 vs 4900 N Florida Ave Ste 301 33603); a displayed Pasco number **(727) 388-7898** links to **tel:813-279-6785**; "Call Us Now!" on Service Areas dials the Hillsborough line. Standardize NAP (local-SEO + trust + lead-routing risk).

**Content / SEO / quality**
10. **Almost no image alt text** sitewide (~31 portfolio photos, all service icons/photos, brand logos, brochure thumbs) + non-descriptive filenames ("Screenshot_19.jpg", "Image-12.png", "layer1.png").
11. **No FAQ schema** despite abundant FAQ-shaped content ("signs," "when to repair vs replace," "DIY vs pro").
12. **Duplicate/AI-rough copy** — two near-identical "noises" blog posts; grammatically rough resource copy; template artifacts (Spring page's closing CTA mislabeled "Replacement"; a "Spring Replacement" bullet on the Replacement page; duplicate safety-tip heading).
13. **No pricing anywhere** — only "FREE Estimate"; a gap if competitors advertise "$ off / from $X."
14. **Blog has no dates/authors/categories** and shallow internal linking; a Lutz city landing page is mixed into the editorial blog.

**Assets worth keeping**
- Strong trust stack (since 2007, licenses, Angi 2024, Elite, owner imagery, 8 named reviews).
- Real job photography (portfolio + per-service photos) — needs labeling/alt + before/after pairing.
- 26 manufacturer brochure PDFs (Clopay/C.H.I./LiftMaster) — good product-research asset.
- Genuinely useful educational content (door types, 13 safety tips, DIY troubleshooting) and a differentiated Florida-hurricane content angle.

---

## Image inventory (summary)
- **Site chrome (every page):** `Trinity_Garage.png` logo · 8 brand logos · 3 badges (`Ad_Listing_Option_Flyer…`, `elite-solid-border.png`, `angi-super-service-award-2024.png`) · repeated safety graphic `Keep-Garage-Door-Openers-Out-of-Reach.png`.
- **Owner/brand:** Jason Grunder portrait(s) (2026/02 uploads).
- **Service pages:** real job photos (`/uploads/2024/09/`) + benefit/process icon sets (`/uploads/2025/02/`).
- **Portfolio:** ~31 project photos (`Group-*.jpg`).
- **Door Types:** 1–3 photos per style.
- **Brochure:** 26 PDF files + JPG cover thumbnails.
- **Blog:** featured "title-card" heroes (mostly branded), one Shutterstock photo, one DSC job photo; **no unique inline imagery** — bodies are text-only.
- Full per-image URLs + alt + placement are in the six detailed reports. (All can be bulk-downloaded into an `assets/` folder on request.)
