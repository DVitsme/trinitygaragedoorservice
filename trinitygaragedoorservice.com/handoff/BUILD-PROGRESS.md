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
- [~] assets copied · `next.config` · `globals.css` tokens+breakpoints · `lib/site.ts` data
- [ ] fonts wired in layout · chrome (utility/header+megamenu/footer/sticky) · shadcn primitives reskinned
- [ ] block library + `RepairDetailLayout` · JSON-LD/sitemap/robots/404/error

**Phase B — Prove the system**
- [ ] `/` home (bespoke) · [ ] `/services/repair/spring/` · [ ] `/privacy-policy/` · [ ] `/contact/`

**Phase C — Services** (detail recipe / RepairDetailLayout)
- [ ] `/services/` · [ ] `/services/repair/` · [ ] `/services/repair/opener/` · [ ] `/services/repair/off-track/` · [ ] `/services/repair/cables-rollers/` · [ ] `/services/repair/tune-up/` · [ ] `/services/replacement/` · [ ] `/services/installation/` (build from copy)

**Phase D — Service Areas**
- [ ] `/service-areas/` · [ ] `/lutz/` · [ ] `/land-o-lakes/` · [ ] `/wesley-chapel/` · [ ] `/palm-harbor/` · [ ] `/oldsmar/` · [ ] `/tampa/` (last 4 = template + copy)

**Phase E — About + Doors**
- [ ] `/about/our-story/` · [ ] `/about/portfolio/` · [ ] `/about/reviews/` · [ ] `/doors/types/` · [ ] `/doors/brands/` · [ ] `/doors/brochures/`

**Out of scope here (not designed):** `/resources/{blog,safety-tips,troubleshooting,faq}/` — copy exists (`copy/resources/`, `content/blog/`); build later with a generic template. Footer links to them must not ship as `#` (F2).

## Per-route acceptance checklist (04)
Hero media+overlay · breakpoints 920/560 · metadata title/desc/canonical · FAQ JSON-LD where present · header active+CTA (G10) · footer variant · `next/link` internal · 2px-ink borders / 7px radius / `#b8202a` · reduced-motion · mobile nav + sticky bar · no invented stats/prices/ratings · screenshot matches `.dc.html`.

## Verification recipe (per page)
1. `pnpm exec next dev -p 3000 > /tmp/devserver.log 2>&1 &` ; wait for 200 via `curl --retry`.
2. Screenshot the route with `/usr/bin/google-chrome-stable --headless=new --no-sandbox --disable-gpu --hide-scrollbars --virtual-time-budget=25000 --window-size=1440,9000 --screenshot=/tmp/shots/<route>.png http://localhost:3000<route>` (mobile: `--window-size=414,12000`).
3. Open the matching `.dc.html` in the browser the same way for side-by-side (strip the `<x-dc>`/`support.js` wrapper if it doesn't render standalone; else compare to the design intent in `03`). Read both PNGs; fix diffs. `pnpm build` must stay green.
