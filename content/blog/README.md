# Blog — verbatim 1-to-1 migration from the old site

13 posts migrated **verbatim** (no rewriting) from `https://trinitygaragedoorservice.com/blogs/`. This is the client's own content. Each file is YAML frontmatter + the exact article body. Featured images were captured to `public/blog/`.

## How this was produced
- **Bodies** were transferred verbatim from the discovery captures (`research/web-copy/blog-*.md`, captured 2026-06-17), extracted programmatically (byte-faithful, no retyping). The **only** things removed were non-article artifacts: standalone button labels (e.g. `[CTA: Schedule a Repair]`), the `[CTA: ...]` wrappers around inline link text (the link text itself is kept), and one capturer note line in the February post. No prose was reworded.
- **Images** were downloaded full-size from the live WordPress site into `public/blog/` before WP is retired (they existed nowhere else). 10 came from the post thumbnails (de-suffixed to the original); the 3 older posts' images came from their live `og:image`.

## Posts (newest first; dates approximate — see note 1)
| Slug | Category | Date (approx) | Image |
|---|---|---|---|
| why-garage-door-springs-break-more-often-in-florida | Springs | 2026-03 | springs-break-florida.png |
| floridas-february-temperature-swings-and-your-garage-door-why-your-springs-matter-more-than-you-think | Springs | 2026-02 | february-temperature-swings.png |
| what-those-garage-door-noises-actually-mean | Diagnostics | 2026-01 | noises-actually-mean.png |
| december-in-florida-garage-door | Maintenance | 2025-12 | december-in-florida.png |
| holiday-ready-homes-time-to-tune-up-your-garage-door | Maintenance | 2025-11 | holiday-ready-homes.png |
| what-that-strange-garage-door-noise-really-means-and-no-its-not-a-goblin | Diagnostics | 2025-10 | strange-noise-goblin.jpg |
| top-3-mistakes-homeowners-make-when-preparing-garage-doors-for-storms | Hurricane Prep | 2025-09 | top-3-storm-mistakes.jpg |
| dont-let-your-garage-door-be-the-weak-link-this-hurricane-season | Hurricane Prep | 2025-08 | weak-link-hurricane.png |
| why-routine-garage-door-maintenance-matters-more-during-storm-season | Hurricane Prep | 2025-07 | maintenance-storm-season.png |
| is-your-garage-door-hurricane-ready-5-signs-its-time-for-an-upgrade | Hurricane Prep | 2025-06 | hurricane-ready-5-signs.jpg |
| how-a-new-garage-door-can-boost-your-homes-curb-appeal | Buying Guides | 2025-05 | curb-appeal.png |
| professional-garage-door-repair-services-in-lutz | Repair | ~2024-09 | lutz-repair.jpeg |
| understanding-garage-doors-and-garage-door-repair | Buying Guides | ~2024-09 | understanding-repair.jpeg |

## Frontmatter fields
`title`, `slug`, `date`, `dateApprox: true`, `category`, `featuredImage`, `featuredImageAlt` (empty, needs writing), `sourceUrl`, `status`.

## Routes & 301s
New routes: `/resources/blog/` (index) and `/resources/blog/<slug>/` (posts). Slugs match the old `/blogs/<slug>/` exactly, so the 301 map is simply `/blogs/<slug>/` → `/resources/blog/<slug>/`.

## Build notes / decisions (please confirm)
1. **Dates are approximate.** The live site shows no publish dates; these were inferred from the WordPress image upload paths (`/YYYY/MM/`). `dateApprox: true` on every post. Confirm real dates with the client, or show month/year only.
2. **Two near-duplicate "noises" posts** (`what-those-garage-door-noises-actually-mean`, Jan; and `...not-its-not-a-goblin`, Oct). Both were transferred verbatim per the 1-to-1 instruction. To avoid SEO cannibalization, set a canonical at build (point one at the other) or noindex one. That's an SEO setting, not a content change.
3. **Lutz post** (`professional-garage-door-repair-services-in-lutz`). The locked IA recommends 301'ing this to `/service-areas/lutz/` (we already wrote that page). Decide: keep it as a blog post or 301 it. Transferred here for now.
4. **Featured image alt text is empty** (the old site had none). Write descriptive alt per image before launch.
5. **Images are large** (~0.9–3.5 MB full-size originals). `next/image` will resize on serve; optionally pre-optimize.
6. **The "goblin" image is a licensed Shutterstock photo** (`shutterstock_2628478273`). Confirm the license covers the new domain, or swap it.
7. **A few posts open with a heading that repeats the title** (e.g. understanding-repair); the build can suppress the duplicate.
8. **Categories** assigned here: Springs, Diagnostics, Maintenance, Hurricane Prep, Buying Guides, Repair. Adjust to taste; the audit suggested Hurricane Prep · Springs · Diagnostics · Maintenance · Buying Guides.

## Pillar / cluster (later, optional)
The audit suggests pillar hubs (Hurricane Prep, Springs, Noises/Diagnostics, Seasonal Maintenance, Buying Guides) that link down to posts and across to the matching service pages. Phase 2 structure, not required for the 1-to-1 transfer.
