# Trinity Garage Door Service — Redesign Discovery Research

Discovery pack capturing **what the business is, what it does, and who it serves**, gathered before any redesign work begins. Everything here is sourced from the live site (trinitygaragedoorservice.com) on **2026-06-17** plus third-party records.

## 👉 Start here
- **[business-summary.md](business-summary.md)** — the synthesis: services, products, brands, audience, geography, positioning/voice, trust signals, pricing, and a redesign watch-list of issues found.

## How this was built
Four agents ran in parallel, each capturing one section of the site into verbatim copy + an image catalog + a video catalog. A separate external pass pulled third-party reputation/ownership records. Findings were then synthesized into the top-level files.

## Folder map

```
research/
├── README.md              ← this file (index)
├── business-summary.md    ← START HERE — the business synthesis
├── videos.md              ← master video inventory (2 videos: About Us & Services)
├── external-research.md   ← third-party facts (BBB, Yelp, owner, licenses, founding)
├── web-copy/   (43 files) ← verbatim copy of every page
├── images/     (4 files)  ← catalog of 229 images w/ descriptions, by section
└── videos/  (4 md + assets/) ← per-section lists; actual video files + frames in videos/assets/
```

### `web-copy/` — verbatim page copy (43 files)
- **Company (8):** `home`, `about-us`, `service-areas`, `portfolio`, `brochure`, `promo-discounts`, `schedule-a-repair`, `request-an-estimate`
- **Services (7):** `services-overview`, `service-installation`, `service-repair-and-service`, `service-off-track`, `service-replacement`, `service-spring`, `service-opener`
- **Resources (3):** `garage-door-types`, `garage-door-safety-tips`, `diy-troubleshooting-guide`
- **Brands (11):** `brands-overview` + `brand-{clopay, chi, hormann, amarr, chamberlain, craftsman, genie, liftmaster, linear, wayne-dalton}`
- **Blog (14):** `blogs-index` + 13 `blog-*` posts

Each file: page URL + capture date, the full verbatim copy (headings preserved), an "Images on this page" list, and a "Videos on this page" note.

### `images/` — image catalogs (229 images total)
`images-core.md`, `images-services.md`, `images-brands.md`, `images-blogs.md`. Each image: URL, alt text (note: the site uses **no alt text** — every entry is empty), filename, and a description of what it depicts + its role (hero / logo / product / gallery / badge / icon), inferred from filename and page context.

### `videos/` — video catalogs + assets
`videos-{core,services,brands,blogs}.md` — core & services list the site's **2 videos**; brands & blogs confirm none. The downloaded video files and sample frames are in **`videos/assets/`**. Consolidated in `../videos.md`.
> Note: the site's videos are JavaScript-injected (Elementor), so the initial markdown capture missed them; they were found by re-rendering every page in a headless browser.

## Headline takeaways
1. **Family-owned Tampa Bay garage-door service company** (owner Jason Grunder; ~15 yrs) — install, repair, replace, maintain; 24/7 emergency. Primarily residential, some commercial.
2. **6 services**, **4 door brands** (Clopay, C.H.I., Hörmann, Amarr) + **6 opener brands**; serves **Hillsborough, Pasco & Pinellas** counties.
3. **Positioning:** honest, low-pressure, local, "Most Trusted Name in Garage Doors." Strong **Florida hurricane/heat** angle — but only in the blog, not the main site.
4. **Solid trust base:** BBB A+, Angi 2024 award, licensed/bonded/insured, real customer reviews.
5. **Biggest redesign opportunities:** video is underused (only 2 clips, buried on 2 pages, none on the homepage); no pricing/warranty transparency; empty alt text on all 229 images; generic/AI imagery with no real team or job-site photos; heavily templated, sometimes error-laden copy; and several data inconsistencies (founding year, two Tampa addresses, a stray phone number). See `business-summary.md` §10 for the full list.
