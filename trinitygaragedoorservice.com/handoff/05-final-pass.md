# 05 — Final Pass (newly found, after studying the built files)

Deep‑read of one page per archetype (home, repair detail, doors‑brands, contact, legal) plus a link audit surfaced these — none are in 00–04.

## 🔴 New must‑fix

### F1. `trailingSlash: true`
**Every** internal route in the designs ends with a slash (`/services/repair/spring/`, `/about/our-story/`, …). Next.js default emits non‑slash URLs → canonical/link/redirect mismatch and possible double‑routing. Set `trailingSlash: true` in `next.config.ts` and make all `<Link href>` + sitemap + canonical use the trailing slash consistently.

### F2. Referenced‑but‑unbuilt routes (dead links to resolve)
Confirmed by audit. Decide build / 301 / remove for each before launch:
| Referenced from | Target | Status |
|---|---|---|
| Footer "Resources" col | `/resources/blog/`, `…/safety-tips/`, `…/troubleshooting/`, `…/faq/` (rendered as `href="#"`) | **No pages.** Build later or point to real URLs; don't ship `#`. |
| Footer socials | Facebook / LinkedIn / Yelp / Google / BBB = `href="#"` (only Instagram is real) | Fill real profile URLs or hide the empty ones. |
| Nav "All Service Areas", hub cards | `/service-areas/{wesley-chapel,palm-harbor,oldsmar,tampa}/` | Pages not built — use the city template + copy. |
| Nav mega, hub card | `/services/installation/` | Not designed — build from `installation.md` or 301 to `/services/replacement/`. |
| About dropdown has no `/about/` index; Doors has no `/doors/` index | `/about/`, `/doors/` | 301 `/about/` → `/about/our-story/`, `/doors/` → `/doors/types/`. |
| All CTAs | `/get-service/?intent=repair` and `…=estimate` | **Existing app flow / out of scope** for this design port — keep the links and the `intent` query; don't rebuild it. |
Centralize every internal href as a constant in `lib/site.ts` so a dead link can't slip through.

### F3. `not-found.tsx` + `error.tsx`
Not designed. Build both on the site chrome (header + footer + sticky bar) with a Bold‑Trade 404 ("page not found", Call + Home buttons, on `#161616` with red accent) so error states aren't unbranded. Add a root `loading.tsx` only if you introduce async data.

## 🟠 New should‑fix / clarity

### F4. The Home page is bespoke — do NOT genericize these blocks
Home (`Hi-Fi B`) is the only page with these one‑off sections; build them as page‑local components, not shared blocks:
- **VideoHero** with `hero-video.mp4` (the only autoplay‑video hero; detail pages are photo heroes).
- **`<LogoMarquee>`** "Who We Work With" (10 brands, infinite scroll, masked edges).
- **Stats band** (4 big display numbers) immediately followed by the **`clip-door-opening.mp4`** clip card.
- **Before & After** 3‑card gallery (3 `door-after-*`, tag + caption + "See Our Work").
- **Housecall Pro booking card** — a *visual mock* (service select, day chips, time chips, Confirm). Replace with the real scheduler embed/link; don't ship the fake calendar as functional.
- **3‑card Reviews** strip (distinct from the `/about/reviews/` masonry).
- Home uses the **social‑row footer** + shows the red utility bar.

### F5. Two Brands‑page sub‑blocks worth their own components
- **`<BrandHighlight>`** — the LiftMaster wide card: `grid [240px 1fr]`, white logo panel (border‑r‑2 ink) + dark body with an accent "Openers · Install & Service" badge. One‑off but distinct from `<BrandCard>`.
- **`<BrandCard>`** carries a top **logo tile** (`h-[96px] border-b-2 ink`, logo `max-h-full max-w-[80%] contain`) + body + a category **badge pill** (install = `bg-[#FBEDED] text-accent`, service = `bg-[#E7E2D8] text-[#555]`). The "Got Another Brand?" dark card is a sibling in the same grid.

### F6. `<LinkCard>` ("bt-do") — formalize it
Used on **city pages** ("What we do in <city>") and **Our Story** ("What we do"): `flex items-center gap-[14px] bg-white border-2 border-ink rounded-[8px] px-5 py-[18px]` → `44px` icon chip (`bg-cream`, accent stroke; turns red on hover) + bold label; whole card links to a service route; `hover:-translate-y-[3px]+shadow`. Icon+label+href must stay paired (a prior build bug scrambled these — see the LOL page; verify each pairing).

### F7. Section‑background alternation is load‑bearing
The white → `#F2F0EC` cream → white → `#1A1A1A` dark cadence (with `border-t-2 border-ink` light breaks and `border-t-[5px] border-accent` before dark blocks) is part of the design, not decoration. Don't normalize backgrounds — read the exact order from each `.dc.html`. Dark sections flip text to white + `--body-dim` grays.

### F8. Stacking + misc fidelity
- Z‑index: sticky header `z-50`, mega panels & mobile sticky bar `z-60`. Mega panels are **centered** under the bar (`left-1/2 -translate-x-1/2`), not left‑aligned to their trigger.
- The hero "red‑box keyword" wrap must stay inline within the H1 (`bg-accent px-3 inline-block`) and wrap naturally on mobile.
- Map heroes (Service Areas) and the dark Reviews/Brands/Brochures/Contact heroes have **no photo** — pure CSS (grid + radial glow + pins). Keep them CSS, not images.
- Inputs/selects: `border-2 border-ink rounded-[7px]`, focus `border-accent`; the contact Select needs a custom chevron (Radix Select already provides one — restyle).

## ✅ Confidence check (what's already solid in 00–04)
Tokens, fonts, breakpoints (920/560), header/active‑CTA matrix, footer variants, the `RepairDetailLayout` data‑driven recommendation, metadata/JSON‑LD/sitemap/redirects, Cloudflare image + form infra, reduced‑motion, and the per‑page section inventory. With 05's additions (trailing slash, dead‑link resolution, 404/error, home‑is‑bespoke, the three extra components, background cadence), the guide is launch‑complete — the only true unknowns are client decisions (founding year, NAP, real PDFs/headshot, scheduler) already flagged.
