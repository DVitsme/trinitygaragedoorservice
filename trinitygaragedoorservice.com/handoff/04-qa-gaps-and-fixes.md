# 04 — Stress Test: Gaps, Risks & Fixes

A second pass over `00–03` surfaced real gaps that would break a true 1:1 build or a clean launch. Address these before/while building. Grouped by severity.

## 🔴 Must‑fix (will cause wrong output or broken routes)

### G1. Custom breakpoints — Tailwind defaults DO NOT match the design
The designs break at **920px** and **560px** (not Tailwind's 640/768/1024). If you use `md:`/`lg:` the layout will shift at the wrong widths. Define the design's breakpoints in Tailwind v4:
```css
@theme {
  --breakpoint-nav: 920px;   /* header collapses, sticky bar appears, grids → 1 col */
  --breakpoint-xs: 560px;    /* 2‑col grids → 1 col */
}
```
Then use `max-nav:hidden`, `nav:flex`, `max-xs:grid-cols-1`, etc. Map every design `@media(max-width:920px)` → `max-nav:` and `@media(max-width:560px)` → `max-xs:`. Also note grid collapse order in the designs: `bt-g3` goes 3→2(`<920`)→1(`<560`); `bt-g4` 4→2→1; the mega menu/sticky toggle at 920.

### G2. Off‑Track route is inconsistent in the designs — pick one + 301
The nav mega‑menu links **`/services/repair/off-track/`**, but the Off‑Track page's own breadcrumb and the Services‑hub card link **`/services/off-track/`**. Pick the canonical (recommend `/services/repair/off-track/` to match the repair IA), make the page live there, update the hub card + breadcrumb, and 301 the other. Audit every internal link for this slug. (Same family: confirm `replacement` is `/services/replacement/` everywhere — it is.)

### G3. Page `<head>` metadata is unspecified
Every copy `.md` opens with **page title, meta title, meta description, slug** (and some `robots`). None of that is in `00–03`. For each route add App Router metadata:
```ts
export const metadata: Metadata = {
  title: "…meta title from the copy deck…",
  description: "…meta description…",
  alternates: { canonical: "https://trinitygaragedoorservice.com<route>" },
  openGraph: { title, description, url, siteName:"Trinity Garage Door Service", images:["/og/<route>.png"] },
};
```
Pull the exact title/description from each page's copy file (they were written dash‑free and length‑checked). Add a root `metadataBase`, default OG image, and `icons`/favicon from the logo. Privacy Policy `robots`: client's call (legal pages are usually indexable).

### G4. Cloudflare (`@opennextjs/cloudflare`) image handling
`next/image` optimization does not run on Workers by default. Either set `images: { unoptimized: true }` or configure a Cloudflare‑compatible loader (Cloudflare Images / a custom `loader`). Decide before using `<Image>` site‑wide, or you'll get broken/un‑optimized images in prod. The hero **`<video>`** is a plain tag (not `<Image>`) — keep `poster`, `muted loop playsInline`, and the JS `.play()` kick (autoplay attrs get dropped otherwise).

### G5. Contact form is real infra, not just UI
`package.json` shows **Resend + D1 + (Turnstile)**. The design's Contact form and the home "booking" card are visual mocks. Wire Contact → a Server Action / route handler that validates, runs **Turnstile**, writes to **D1**, and emails via **Resend/react‑email**. Add the Turnstile widget to the form (privacy policy already discloses Cloudflare/Turnstile/Resend). The home **Housecall Pro booking** card must link to/embed the real scheduler — it is NOT a working calendar.

## 🟠 Should‑fix (SEO/quality/perf)

### G6. Structured data (JSON‑LD)
- `LocalBusiness`/`HVACBusiness`‑style org schema in root layout (name, phone, areaServed = the 3 counties/6 cities, license, sameAs socials). **Omit `aggregateRating`** until reviews are real (the copy deck says so — don't invent 4.9/count).
- `FAQPage` JSON‑LD on every page that has the FAQ accordion (Spring/Opener/Off‑Track/Replacement/Emergency/Cables/Tune‑Up/Our‑Story/Doors‑Types/Doors‑Brands) — build a `<FaqJsonLd items={…}>` that emits the script from the same data feeding `<FaqAccordion>`.
- `BreadcrumbList` from each page's breadcrumb.
- Reviews page: individual `Review` items are fine (verbatim), still no aggregate.

### G7. `sitemap.ts` + `robots.ts`
Add `app/sitemap.ts` (all routes incl. the 6 city pages once built) and `app/robots.ts`. Coordinate with the **301 map** for retired old‑site slugs (the copy decks reference legacy slugs like `/services/garage-door-spring-repair-and-replacement/` → new IA). Centralize redirects in `next.config.ts` `redirects()` (or Cloudflare rules).

### G8. Internal links + a11y
- Use **`next/link`** for all internal navigation (the designs use `<a href>`); keep `tel:`/external as `<a>`.
- Add a skip‑to‑content link; ensure the Radix `NavigationMenu`/`Accordion` give real keyboard + focus‑visible states (the designs were hover‑only). Maintain landmarks (`<header><main><footer>`), `aria-current="page"` on the active nav item, and the alt text already in the designs.
- Honor `prefers-reduced-motion` for `<Reveal>` and `<LogoMarquee>` (disable transform/animation).

### G9. LCP / fonts / CLS
- Hero `<video>` poster should be an optimized image; preconnect to font origin; `next/font` with `display:"swap"`. The big `clamp()` H1s are fine but reserve space to avoid CLS. Mark the home hero media `priority`/eager; lazy‑load below‑fold galleries and the marquee.

## 🟡 Polish / consistency

- **G10. Header CTA + active state matrix** (so it's unambiguous):
  | Section | `activeNav` | header & sticky CTA |
  |---|---|---|
  | Home | — | Book a Repair |
  | Services + Repair + all repair sub‑pages + Replacement | services | Book a Repair |
  | Doors (Types/Brands/Brochures) | services | **Free Estimate** |
  | Service Areas (hub + cities) | areas | Book a Repair |
  | About (Story/Portfolio/Reviews) | about | Book a Repair |
  | Contact | contact | Book a Repair |
  | Privacy | — | Book a Repair |
  (Confirm against each `.dc.html`; Doors + the Types/Brochures heroes use Estimate‑first.)
- **G11. Footer variants** differ by page (Services/Doors/About/Company columns; social row vs Privacy·Contact links). Don't ship one footer — parameterize columns + bottom‑right slot and set per page from the `.dc.html`.
- **G12. shadcn v4 + Tailwind v4 + Next 16 setup checklist**: `npx shadcn@latest init` (new‑york or default to taste, but **override component styles to match the Bold Trade tokens** — shadcn defaults are rounded/soft; the brand is 2px‑ink borders, 7px radius, uppercase). Add `tw-animate-css` (already a dep). Only pull the primitives used: `navigation-menu`, `accordion`, `sheet` (mobile nav), `select`, `input`, `textarea`, `button`, `carousel` (embla — optional, the marquee is custom CSS). Re‑skin each to the design; don't accept stock shadcn look.
- **G13. Centralize the NAP/legal once** in `lib/site.ts` and render everywhere from it (phone, licenses GD13010 / GDI‑09484, founding year, hours, counties). Then the "founding year 2007 vs 2011" and "single phone vs per‑county" decisions are one‑line changes. Privacy/Contact placeholders (email, mailing address, effective date) should be obvious `TODO` constants.
- **G14. Reduced‑duplication for repair sub‑pages**: they share the exact "detail page recipe" (03). Build **one `RepairDetailLayout`** that takes structured content (hero, intro, signs[], index{rows,note}, redband, whatWeDo[], whyTrinity[], faqs[], cta) and render each page as data. Big maintainability win and guarantees pixel‑consistency. The copy lives in per‑page data objects sourced from the `.md`/`.dc.html`.
- **G15. Image inventory check**: confirm every `assets/*` referenced across the 20 pages exists in `public/assets/` before build (logo, 2 badges, 10 `brandlogo-*`, 6 `jobsite-*`, 4 `door-after-*`, 2 team, owner placeholder, `hero-video.mp4`, `clip-door-opening.mp4`). The brand logos sit on **white tiles** because several have baked‑in backgrounds — keep the tile.
- **G16. Don't ship placeholders silently**: brochure PDF links (`#`), owner AI headshot, Contact map/address, Privacy date/email/address — render a visible build‑time `TODO` or keep the design's inline "to be confirmed" notes so they aren't forgotten.

## Quick acceptance checklist (per route)
Hero media+overlay ✓ · breakpoints at 920/560 ✓ · metadata title/desc/canonical ✓ · FAQ JSON‑LD where present ✓ · header active state + CTA per G10 ✓ · footer variant per page ✓ · internal links via `next/link` ✓ · 2px‑ink borders / 7px radius / `#b8202a` ✓ · reduced‑motion ✓ · mobile nav + sticky bar ✓ · no invented stats/prices/ratings ✓.
