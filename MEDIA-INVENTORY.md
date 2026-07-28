# MEDIA INVENTORY — Trinity Garage Door

Real photography and video gathered from the client's own channels and placed across the site.
Compiled 2026-07-28. Live: https://trinity-garage-door.derrick-2fd.workers.dev

> **The AI-generated owner headshot is gone.** It has been replaced sitewide with the real studio
> portrait of Jason Grunder found in Trinity's own WordPress media library.

## What was gathered

**1,449 files / 751 MB** staged in `.media-hunt/` (gitignored working set; the curated subset lives
in `public/`).

| Source | Files | Notes |
|---|---:|---|
| Their website (WP media library) | 452 | Authoritative: the WP REST endpoint exposed all 569 library assets. **284 were unused on any live page.** Contains the professional studio shoot. |
| Instagram (via Picnob) | 690 | 457 posts, pre-sorted into `owner-jason`, `team`, `technicians-and-staff`, `trucks-and-branding`, `completed-doors`, `before-after`, `ai-illustrations` |
| Video | 138 | 2 site videos + 96 Instagram clips + posters |
| Directories (Angi, Facebook, Nextdoor, BBB, HomeAdvisor) | 45 | **Angi holds the highest-resolution originals anywhere**, up to 6649×4433 |
| Google Business Profile | 29 | 14 owner-posted / 15 customer-posted, provenance determined via the "By owner" tab |
| Yelp | 1 | Hard-blocked by DataDome; only the logo was retrievable |

## What was placed

**53 curated, web-optimised images** now ship in `public/` (`work/`, `team/`, `social/`, plus
service photos in `assets/`).

| Site area | What it now shows |
|---|---|
| **Owner (home + About)** | Real studio portrait of Jason Grunder. Both AI files deleted from the repo. |
| **About / Our Story** | Team in the office; the five-person lineup with name cards (David, Joey, Jason, Andre, Jonah) |
| **Portfolio** | 21 real job photos + **4 genuine before/after pairs**. The page promised "no stock photos" and now delivers. |
| **Homepage before/after** | Real pairs replacing the "Before photo coming soon" placeholder |
| **Homepage Instagram grid** | Actual Instagram posts (crew, techs, finished doors) |
| **Doors → Types & Styles** | Real photos on the Raised Panel / Carriage House / Modern cards (were icons only) |
| **8 service detail pages** | Topic-matched photos of real technicians: torsion shafts, opener rails, track/frame work, night call-outs |
| **Services hub, repair hub, Book a Repair** | Distinct technician photography |

**Before/after pairs were recovered**, not shot: the client's archive stored them as fused
side-by-side and stacked composites. Splitting 30 files yielded **55 usable images including 25
genuine pairs** — the project previously recorded that no before/after pairs existed.

**Repetition fixed:** six generic photos previously covered 13 pages (one appeared on six). Each
page now carries its own imagery.

**Housekeeping:** 30 unused raw originals moved out of `public/` to `media-archive/` (they were
being deployed but never served); four duplicate/AI assets deleted.

---

## Gaps — locations with no confident best fit

| # | Location | Why no best fit | Suggested fix |
|---|---|---|---|
| 1 | **Homepage hero video** | The only landscape clip in existence is **1024×576 and HEVC-encoded** (Chrome/Firefox largely refuse HEVC). All 96 Instagram clips are vertical 720×1280 and crop to ~720×400 of real detail, too soft for a full-bleed hero. | Ask Jason for the **camera originals** of the 3:04 promo and the 13s door clip. Highest-value single ask. |
| 2 | **About / Our Story feature video** | The only long-form asset is the 3:04 promo at **640×368**, too low to embed as a feature. No HD owner-to-camera footage exists. | Request the original, or cut a 45–60s piece from the 720×1280 vertical clips. |
| 3 | **6 service-area city pages** (Lutz, Land O Lakes, Wesley Chapel, Palm Harbor, Oldsmar, Tampa) | Plenty of job photos exist, but **none are geotagged or captioned by city**, so we cannot honestly claim a given door is in a given town. Currently using generic technician photos. | Ask Jason to identify 2–3 jobs per city, or shoot/label going forward. |
| 4 | **Customer / reviews imagery** | Google and Yelp customer-uploaded photos are **owned by the reviewer, not the client** — not licensed for the client's marketing site. | Leave as-is (text reviews only), or ask customers for permission. |
| 5 | **Yelp gallery (47 photos)** | `yelp.com` returns **403 from DataDome** on every access method tried. No archive snapshots exist. | Ask Jason for the originals — cleanest path, since customer-uploaded Yelp photos aren't licensed anyway. |
| 6 | **Commercial work** | No photos of commercial installations were found anywhere. The site sells commercial doors via brochures. | Ask whether commercial jobs exist to photograph. |
| 7 | **Manufacturer / catalogue imagery** (75 files found) | Supplier product imagery — **licensing for the client's site is unverified**. Used only where already on their old site. | Confirm dealer rights with Clopay / C.H.I. / LiftMaster before wider use. |
| 8 | **Blog featured image ("goblin" post)** | Licensed **Shutterstock** asset (`shutterstock_2628478273`); the licence may not cover the new domain. | Confirm licence or swap the image. |
| 9 | **Showroom / storefront** | Three shots exist but **no page has a slot for them**. | Optional: add to Contact or Our Story if desired. |
| 10 | **Individual tech headshots** (Andre, David, Jonah, Joey) | Placed in `public/team/` and ready, but the approved design has **no "meet the team" grid** to hold them. | Optional: add a team section to Our Story. |

### ⚠️ Do not use
- **6 AI caricatures** in `.media-hunt/instagram/ai-illustrations/` — stylised portraits captioned as
  real staff (Jonah, Tyler, Barbara, Joey, Jason). Easy to mistake for photos at thumbnail size.
- **`facebook-post-black-carriage-door.png`** — reads as a manufacturer catalogue image they
  reposted, not their work. Do not caption it as a Trinity job.
- **`nextdoor-post-1.jpg`** — genuinely theirs, but the technician pictured is a **stock model**.

---

## Business facts uncovered (feed `trinity-open-decisions`)

- **Phone:** the three county lines are confirmed on their own Nextdoor flyer — Hillsborough
  **(813) 447-3874**, Pasco **(813) 279-6785**, Pinellas **(727) 314-5062**. The site leads with the
  **Pasco** number while their **trucks and BBB lead with Hillsborough**. BBB lists nine numbers
  total; a storefront decal adds a "call or text" line, **(813) 731-8405**.
- **Founding year, now four sources:** site/truck livery say **2007**; Yelp says **2010**; BBB and
  Sunbiz say **2011**. Likely trading since 2007, incorporated 2011. Needs a client answer.
- **NAP:** 18125 N US Highway 41, Ste 208, Lutz, FL 33549. Google: Mon–Sat 7am–9pm — but the
  **physical door reads Mon–Fri 8am–5:30pm**. One is wrong.
- **Google: 5.0 stars across 597 reviews** — far stronger than the 8 hardcoded quotes. Place ID
  `ChIJC6icp3C5wogRgiYvqfyx0I4`; review link and profile URL captured.
- **"Veteran owned and operated"** appears on Angi but **nowhere on the site**. Worth confirming.
- **Duplicate listings to claim/merge:** a second Yelp page and a second Facebook page.
- **Footer social URLs — now wired.** Instagram, Facebook, Google Business Profile and Yelp render
  as icons; BBB and Angi as wordmark chips. All eight profiles (incl. HomeAdvisor and Nextdoor)
  are in `SOCIAL` in `lib/site.ts` and are listed in the `LocalBusiness` `sameAs` array so Google
  can tie the listings to one entity. **LinkedIn is deliberately excluded** — there is no company
  page, only Jason's personal profile.

## Provenance note
Everything placed on the site comes from **Trinity's own channels** (their website media library,
their Instagram, their Angi/Google/Nextdoor business listings). Customer-uploaded photos were
identified and deliberately excluded. Where a source could not be verified as theirs, it was left
out rather than guessed.
