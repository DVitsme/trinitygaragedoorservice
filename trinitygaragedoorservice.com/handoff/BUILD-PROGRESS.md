# BUILD-PROGRESS — Design → Next.js (durable tracker)

Converting the approved `*.dc.html` "Bold Trade" designs into this Next.js app **1:1**. This file is the source of truth for the build across sessions/agents. Read `00`–`05` for the spec; this tracks plan, status, and the standing rules.

## Standing permissions (from the user, apply to EVERY phase)
- Build perfect 1:1 copies of each designed page from its `.dc.html` (the literal pixel spec).
- Use as many **agents** as helpful (parallelize page builds once the foundation is frozen).
- **Web search** allowed for best practices / research.
- After each page, run a **screenshot stress-test** vs its `.dc.html` (dev server + headless Chrome; see Verification).
- Take the time it takes. Commit at green boundaries; the **user pushes** (`! git push origin main`) — Claude is blocked from pushing to main by the auto-mode classifier.

## Architecture & conventions (from handoff 01–05)
- Tailwind v4 `@theme` tokens (01) in `app/globals.css`; **custom breakpoints `nav`=920px, `xs`=560px** (G1) — use `max-nav:`/`max-xs:`, NOT `md:`/`lg:`.
- `next.config.ts`: **`trailingSlash: true`** (F1), `images: { unoptimized: true }` for CF Workers (G4), `redirects()` (off-track canonical G2; `/about/`→`/about/our-story/`, `/doors/`→`/doors/types/`; full legacy 301 map G7 later).
- **Fonts:** Hanken Grotesk via `next/font` (`--font-hanken`); **Archivo Expanded via Google `<link>`** in layout — it is NOT in `next/font/google` (corrects handoff 01; verified by a prior failed build).
- Centralize everything in `lib/site.ts` (G13): NAP, licenses, hours, founding year, nav tree, brands (corrected install/service), areas, the 8 real reviews, services, and **every internal href as a `ROUTES` constant** (F2 — no dead links).
- Chrome in `layout.tsx`: `<TopUtilityBar>` `<SiteHeader activeNav headerCta>` `<MobileStickyBar>` `<SiteFooter variant>`. Header CTA/active matrix = G10. Footer variants = G11.
- Block library in `components/blocks/`; **data-driven `RepairDetailLayout`** for the 8 repair/detail pages (G14). Home is **bespoke** — page-local components, not shared (F4).
- Keep the existing **infra**: `app/api/contact` (Resend+D1+Turnstile), `/get-service/` flow, `components/contact-form.tsx`. Wire the design's Contact form + booking mock to it (G5); home booking card links to the real scheduler (Housecall Pro).
- SEO: per-route `metadata` from the copy decks (G3); `LocalBusiness` + `FAQPage` + `BreadcrumbList` JSON-LD (G6, omit aggregateRating); `sitemap.ts`/`robots.ts` (G7).
- a11y: `next/link` internal, skip link, Radix keyboard states, `aria-current`, `prefers-reduced-motion` (G8). Background alternation white→cream→white→ink is load-bearing (F7).
- Keep visible TODOs for client unknowns; don't ship silent placeholders (G16) or `#` links (F2).

## Open client decisions → defaults used (keep visible, confirm before launch)
Founding year **2007** (copy) · single phone **(813) 279-6785** · NAP/address pending (Contact "we come to you") · off-track canonical **`/services/repair/off-track/`** · installation **built** from `installation.md` via the detail recipe · scheduler = Housecall Pro link (mock calendar not functional) · brochure PDFs, owner headshot, privacy email/date/address = placeholders. Full list: [[trinity-open-decisions]] memory.

## Phases & page status  ( [ ] todo · [~] in progress · [x] done+verified )
**Phase A — Foundation**
- [x] assets · `next.config` (trailingSlash/images/redirects) · `globals.css` tokens + 920/560 breakpoints · `lib/site.ts` data + `getNavConfig`
- [x] chrome: utility bar · header (CSS mega-menu, activeNav/headerCta, Contact link, next/link) · sticky bar · mobile drawer · layout skip-link — build green, screenshot-verified
- [x] block library CORE (`components/blocks/`): Section/SectionHeading/Cta/Button/Breadcrumb/Reveal · PhotoHero/VideoHero · TrustStrip · RedBand (split+center) · CardGrid/IconCard/NumberStepCard · SplitFeature/CheckList · NumberedIndex/DarkCallout · FaqAccordion (hand-rolled plus->minus) — build green
- [ ] remaining blocks build WITH their pages (Phase B+): `RepairDetailLayout`, LogoMarquee, MapHero, GalleryGrid, BrandCard/BrandHighlight, ReviewCard masonry, PdfList, LinkCard (bt-do), ServiceAreaMapMock, home-bespoke (stats/before-after/booking)
- [ ] footer variants · Contact-form Select · JSON-LD (FAQ/Breadcrumb) · sitemap/robots · 404/error
- [ ] (polish) Radix NavigationMenu + Accordion a11y upgrade (G8) — CSS/hand-rolled used for now

**Phase B — Prove the system**
- [x] `/services/repair/spring/` + `RepairDetailLayout` (data-driven, reused by 8 detail pages) — screenshot-verified 1:1, committed
- [x] `/privacy-policy/` (LegalBody) · [x] `/contact/` (form wired) · [x] `/` **home** (bespoke, 13 sections: VideoHero, about split w/ owner+18yr badges, logo marquee `.bt-marquee`, why-us, stats+clip, before/after, big service-area map [5 pins/2 roads, inline], **real Google reviews** [4 verbatim, not the design's fake samples], booking mock [Confirm → `SITE.bookingHref`], Instagram grid, CTA) — built 1:1, prod-verified, committed. **Phase B COMPLETE.**

**Phase C — Services** (parallel agents write page-data objects; orchestrator builds + screenshots centrally to avoid .next clashes — PROVEN workflow)
- [x] opener, off-track, cables-rollers, tune-up, emergency, replacement — parallel-built, build green, all 6 screenshot-verified 1:1, committed
- [x] `/services/repair/` hub — **bespoke** (diverges from RepairDetailLayout: 6-icon signs grid + dark note, 6-part index w/ rows LINKING to service pages + brand-logo strip, centered red band, tune-up dark split, 4-step "No Mystery", why-us) — built, prod-screenshot-verified 1:1, committed
- [x] `/services/installation/` (from `installation.md`, not designed) — `RepairDetailData` object via RepairDetailLayout, primaryCta=estimate; materials/install-steps/Florida-weather; built, prod-verified, committed
- [x] `/services/` hub (card grid archetype) — built 1:1, prod-verified desktop+mobile, committed. Added reusable **`components/blocks/service-area-map-mock.tsx`** (`<ServiceAreaMapMock />` — the decorative Tampa Bay map panel; reuse on Contact/About/home). Service cards built page-local (icon chip + title + desc + hover "Learn More" bar that turns accent).

RESOLVED style decisions (apply to ALL pages, built + remaining): (1) **dash-free** house style — strip the design's prose compound hyphens ("Same Day", "Off Track", "wood look") — done on the 7 detail pages; (2) **tailor any copy that bled from the Spring template** in claude.ai/design (e.g. spring-flavored lines on opener/emergency) so each page reads for its own topic. Bake both into every remaining page.

**Remaining pages** (~13 designed + 4 template cities). Workflow: detail-recipe pages (reuse RepairDetailLayout) → parallel write-only agents + central build/screenshot (proven). New-archetype pages (need their own blocks) → one fork at a time (builds + screenshots in the main tree as sole builder; no .next clash):
- Services: ✅ repair hub + installation DONE. Remaining: `/services/` hub (card grid archetype — build its ServiceCard + ServiceAreaMapMock; one fork). NOTE: I did **not** add `href` to the shared `NumberedIndex` (kept it untouched so the 7 verified detail pages stay byte-stable); the repair hub builds its linked index **inline** (cream icon chip + whole-row `<Link>` + subtle hover, mapping each part to its service page).
- Phase B archetypes: ✅ `/privacy-policy/` + `/contact/` DONE (contact reuses `<ContactForm/>` inside the design's card with a11y labels, + `<ServiceAreaMapMock className="h-[320px]"/>`). Remaining: `/` home (bespoke: VideoHero, LogoMarquee, stats, before/after, booking mock, reviews)
- Phase D Service Areas: hub (MapHero) + lutz + land-o-lakes (designed) + wesley-chapel/palm-harbor/oldsmar/tampa (city template) — needs MapHero, LinkCard, ServiceAreaMapMock blocks
- Phase E Doors: types (buyer's guide) · brands (BrandCard/BrandHighlight catalog) · brochures (PdfList). About: our-story · portfolio (GalleryGrid) · reviews (ReviewCard masonry)

**Phase C — Services** (detail recipe / RepairDetailLayout)
- [x] `/services/` · [x] `/services/repair/` · [x] `/services/repair/opener/` · [x] `/services/repair/off-track/` · [x] `/services/repair/cables-rollers/` · [x] `/services/repair/tune-up/` · [x] `/services/replacement/` · [x] `/services/installation/` (built from copy)

**Phase D — Service Areas**
- [x] `/service-areas/` hub · [x] `/lutz/` · [x] `/land-o-lakes/` · [x] `/wesley-chapel/` · [x] `/palm-harbor/` · [x] `/oldsmar/` · [x] `/tampa/` — **Phase D COMPLETE.** All 6 cities via data-driven **`components/blocks/city-area-layout.tsx`** (`CityAreaData`): dark labeled-pin hero + intro split + uniform 6 service link-cards + review pull-quote + nearby chips + CTA. Lutz/LOL match their designs exactly; the other 4 use the template + `copy/service-areas/*.md`. Pull-quotes use real Google reviews (verbatim excerpts). Built green, prod-verified (Lutz + Palm Harbor screenshot-checked).

**Phase E — About + Doors**
- [ ] `/about/our-story/` · [ ] `/about/portfolio/` · [ ] `/about/reviews/` · [ ] `/doors/types/` · [ ] `/doors/brands/` · [ ] `/doors/brochures/`

**Dead code to remove (cleanup):** now that `app/page.tsx` is the new Bold Trade home, the 12 OLD home-section files in `components/sections/` are unused: `hero, trust-strip, about-split, partner-marquee, why-us, stats-clip, before-after, service-area-map, reviews, booking-band, instagram-grid, cta-band`. **Keep** `utility-bar, site-footer, sticky-mobile-bar` (still imported by `layout.tsx`). Safe to delete the 12 (grep-confirmed only the old page imported them). Defer to a cleanup pass.

**Out of scope here (not designed):** `/resources/{blog,safety-tips,troubleshooting,faq}/` — copy exists (`copy/resources/`, `content/blog/`); build later with a generic template. Footer links to them must not ship as `#` (F2).

## Per-route acceptance checklist (04)
Hero media+overlay · breakpoints 920/560 · metadata title/desc/canonical · FAQ JSON-LD where present · header active+CTA (G10) · footer variant · `next/link` internal · 2px-ink borders / 7px radius / `#b8202a` · reduced-motion · mobile nav + sticky bar · no invented stats/prices/ratings · screenshot matches `.dc.html`.

## Verification recipe (per page)
1. **Screenshot the PRODUCTION server, not `next dev`.** `pnpm build` (must be green) → `pnpm exec next start -p 3000` (use Bash `run_in_background:true` so it survives the turn) → wait for 200 via `curl --retry`. **Why:** in `next dev` (Turbopack) headless Chrome intermittently fails to load HMR/CSS chunks (`ChunkLoadError` in the log), so `nav:`/`max-nav:` media-query utilities silently don't apply and every responsive grid renders **stacked** — a phantom "bug" that is NOT in your code. `next start` serves one optimized CSS file and renders true. (Wasted ~30 min here chasing this; the index 3-col grid was correct all along.)
2. Screenshot: `/usr/bin/google-chrome-stable --headless=new --no-sandbox --disable-gpu --hide-scrollbars --virtual-time-budget=20000 --window-size=1440,9000 --screenshot=/tmp/shots/<route>.png http://localhost:3000<route>` (mobile: `--window-size=414,11000`). Crop with **PIL** (`from PIL import Image; im.crop((0,y0,w,y1))`) for close reads — ImageMagick `convert` is NOT installed here.
3. Open the matching `.dc.html` for side-by-side (strip the `<x-dc>`/`support.js` wrapper if it doesn't render standalone; else compare to the design intent in `03`). Read both PNGs; fix diffs. `pnpm build` must stay green.
4. Restart note: after `pnpm build`, the `.next` dir holds the production build; a subsequent `next dev` reuses/overlays it and can leave dev chunks stale — another reason to verify via `next start`.
