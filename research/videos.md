# Video Inventory — Trinity Garage Door Service

**Captured:** 2026-06-17 · **Scope:** all 44 page URLs of trinitygaragedoorservice.com, rendered with a headless browser (JavaScript executed).

> ⚠️ **Correction (supersedes an earlier draft).** An initial pass reported "no videos." That was **wrong.** The site's videos are injected by JavaScript (Elementor), so they don't exist in the raw HTML — and the tool used for the first capture converts pages to markdown, which drops `<video>` elements. Re-auditing with a **headless Chrome render of every page** surfaced the real videos. See "Method" at the bottom.

## Result: 2 videos, used on 2 pages

| # | Video file | Length | Resolution | Used on | How it's embedded |
|---|---|---|---|---|---|
| 1 | `ca875904-b91e-4f6f-ac79-e767651d29b3.mp4` | ~3 min (184s) | 640×368 | **/about-us/** and **/services/** | Elementor **lightbox/modal** "hosted video" — click a play button, video opens in a popup and **autoplays** |
| 2 | `0bf57e65-87c4-4cc4-b8b5-72f3a14823e0.mp4` | 13 sec | 1024×576 | **/about-us/** | Inline **click-to-play** player (`<video controls>`, no autoplay) |

The other **42 pages have no video.** Both files are hosted on Trinity's own WordPress media library (`/wp-content/uploads/2024/09/`, uploaded Sep 19 2024). No YouTube/Vimeo/Wistia/external video anywhere.

---

### Video 1 — Company promo / "technicians at work" (~3 min)
- **Live URL:** https://trinitygaragedoorservice.com/wp-content/uploads/2024/09/ca875904-b91e-4f6f-ac79-e767651d29b3.mp4
- **Local copy:** `videos/assets/ca875904-technician-promo-3min.mp4`
- **Specs:** 184 s · 640×368 · HEVC · 19.9 MB
- **Appears on:** About Us (lightbox) and Services overview (lightbox, autoplay-on-open)
- **What it shows** (from sampled frames in `videos/assets/frames/ca875904-*.jpg`): real Trinity technicians performing actual jobs on Florida homes —
  1. a brick home with a **broken / off-track white door** (problem scenario);
  2. a tech **installing/wiring a garage-door opener** on the ceiling;
  3. close-up of a tech **drilling/assembling the door track** (gray Trinity logo tee);
  4. a tech doing **overhead spring/top-of-door work** (palm trees visible outside).
- **Role:** the company's flagship brand/overview video — demonstrates expertise across install, opener, track, and spring work. This is the most reusable real-footage asset on the site for a redesign.

### Video 2 — Finished door showcase (13 sec)
- **Live URL:** https://trinitygaragedoorservice.com/wp-content/uploads/2024/09/0bf57e65-87c4-4cc4-b8b5-72f3a14823e0.mp4
- **Local copy:** `videos/assets/0bf57e65-finished-door-opening-13s.mp4`
- **Specs:** 13.4 s · 1024×576 · HEVC · 1.8 MB
- **Appears on:** About Us (inline click-to-play player)
- **What it shows** (frames `videos/assets/frames/0bf57e65-*.jpg`): a completed **brown, wood-look sectional door with a top row of windows** on a Florida home (house #4109), white-painted brick, paver driveway — the **door opening** to reveal the garage. A clean "after"/result demo clip.
- **Role:** social-proof / curb-appeal showcase of a finished installation.

---

## Per-page result (all 44 pages)

| Section | Pages | Videos |
|---|---|---|
| Core / company | 8 | **About Us: 2** (both above); all others 0 |
| Services + resources | 10 | **Services overview: 1** (ca875904); all others 0 |
| Brands | 11 | 0 |
| Blog (index + 13 posts) | 14 | 0 |
| Other page URLs in sitemap (e.g., /home/) | 1 | 0 |

## Implication for the redesign
The two existing videos are genuinely useful (real job-site footage + a finished-door demo) but are **buried**: the promo only plays from a click-to-open lightbox on two pages, and neither is on the homepage. Recommendations: surface the technician promo on the homepage hero; trim/caption it; add the short door-showcase loop to the portfolio; and expand into the obvious gaps (noise-diagnosis explainer, manual-release-during-outage, hurricane bracing, "meet the real team" — the site currently uses AI-generated owner images).

---

## Method (so this is reproducible and the earlier miss is clear)
- **Why the first pass missed them:** videos are added by Elementor via JavaScript, so they are absent from the server-sent HTML; additionally the initial capture converted pages to markdown (which has no representation for `<video>`/lightbox widgets). A raw-HTML grep also missed the About Us videos for the same reason (only `/services/` carries the promo URL in static HTML).
- **What works:** rendering each page with headless Google Chrome (`--dump-dom` after JS execution), then extracting `.mp4/.webm/.mov` and YouTube/Vimeo/Wistia URLs from the rendered DOM. Run **sequentially** — a parallel run caused the video-heavy pages (incl. About Us) to time out and under-report.
- **Confidence:** all 44 sitemap URLs rendered successfully on the sequential run. This covers embedded/player videos. It does **not** enumerate unused files sitting in the media library that aren't placed on any page.
