# 02 — Components

> ⚠️ **REVIEW FIGURES IN THE .dc.html DESIGNS ARE SUPERSEDED. Do not port them 1:1.**
> Any `4.9`, `598` or "Average Rating" below is stale. The live claims are, as of 2026-08-13:
> **`5.0 on Google`** (a Google only RATING, never presented as a cross platform average) and
> **`1,000+ reviews online`** (a cross platform COUNT across Google, Yelp, Angi, BBB, Facebook and
> Nextdoor). Source of truth: `components/blocks/trust-strip.tsx` and the `stats` array in
> `app/page.tsx`. Any page that states the count must leave the reader one click from
> `/about/reviews/`, where the platform breakdown is stated.

Build these once; every page composes them. Styling = the tokens/values in `01`. For exact markup of any block, open the page's `.dc.html` — the structure below tells you what to extract and how to make it reusable. All components are Server Components unless they need state/interaction (marked **client**).

## Chrome (in `app/layout.tsx`, wraps every page)

### `<TopUtilityBar>` (red)
`bg-accent text-white text-[13.5px] font-[600]`. Left: red‑dot + "24/7 Emergency Service" | phone link (Phone icon) `(813) 279-6785`. Right: MapPin + "Lutz · Tampa Bay, FL". Container `max-w-[1200px] px-8 py-[9px] flex justify-between`. Hidden < 920px (`hidden md:flex` — but note design hides it on mobile via `.bt-util`).

### `<SiteHeader>` **client** — sticky nav + mega menu
- Wrapper: `sticky top-0 z-50 bg-white border-b-2 border-ink`. Inner `max-w-[1200px] px-8 py-3 flex items-center justify-between`.
- Left: logo `logo-trinity-primary.png` h‑[60px], links to `/`.
- Center: nav. Use **Radix `NavigationMenu`** (shadcn) for the three dropdowns + plain links.
  - **Services** → mega panel `w-[700px]` grid `3 cols (1.1fr 1fr 1fr)`: col 1 "Repair" (red‑tinted `#FBF3F3` border `#F0DCDC`) with the 6 repair links + "All Repair Services" (accent, ArrowRight) + a red **Book a Repair** CTA; col 2 "Install & Replace" (New Installation, Door Replacement, + outline Free Estimate CTA); col 3 "Doors & Brands" (Door Types & Styles, Brands, Brochures). Data from `lib/site.ts`.
  - **Service Areas** → panel `w-[260px]`: 6 cities + "All Service Areas".
  - **About** → panel `w-[240px]` (right‑aligned): Our Story, Portfolio / Our Work, Reviews.
  - **Contact** → plain link `/contact/`.
  - Trigger style: `font-[800] text-[14px] tracking-[.04em] uppercase`, hover accent; caret `ChevronDown` rotates 180° when open; **active page's trigger** gets `text-accent border-b-[3px] border-accent`.
  - Panels: `bg-white border-2 border-ink rounded-[8px] shadow-[0_26px_50px_rgba(0,0,0,.22)]`, **centered under the bar** (the design centers all panels: `left-1/2 -translate-x-1/2`). Menu item rows: `bt-mli` = `flex gap-[7px] px-[10px] py-2 rounded-[6px] font-[600] text-[14.5px] text-[#3a3a3a] hover:bg-cream hover:text-accent`.
- Right: phone `(813) 279-6785` (font-display) + primary CTA (**Book a Repair** on most pages; **Free Estimate** on Doors pages) + a `Menu` button shown < 920px.
- **Mobile (<920px):** hide center links + right CTAs, show the hamburger → a Sheet/drawer (shadcn `Sheet`) listing the same nav. The bottom sticky bar (below) covers the primary actions.

Pass `activeNav` ("services" | "areas" | "about" | "contact") and `headerCta` ("repair" | "estimate") as props per page.

### `<SiteFooter>` (dark `#111`)
`max-w-[1200px] px-8 pt-[60px]`. 4‑col grid (`1.5fr 1fr 1fr 1fr`, collapses to 1 on mobile): brand (logo on white chip + blurb) · a links column (Services **or** Doors depending on page) · a Company/About column · Contact (phone font-display, hours/area). Bottom bar: `border-t-2 border-[#2a2a2a]`, left © line `© 2026 Trinity Garage Door Service Inc. · Licensed & Insured · FL GD13010 / GDI-09484`, right either social icon row (home/IG pages) or `Privacy · Contact` links. Keep the exact footer variant each page uses (open its `.dc.html`).

### `<MobileStickyBar>` (fixed bottom, < 920px only)
`fixed inset-x-0 bottom-0 z-[60] bg-[#111] border-t-[3px] border-accent p-[10px] gap-[10px] flex` → two buttons: white **Call** (Phone) `tel:` + red **Book a Repair** (or **Free Estimate** on doors). Add `pb-[92px]` spacer to the hero/last section on mobile so content isn't covered (designs add `.bt-pad-b`).

## Section blocks (`components/blocks/`)

### `<Reveal>` **client** (scroll‑in wrapper)
Wrap any section's inner content. `motion/react`:
```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";
export function Reveal({children, className}:{children:React.ReactNode;className?:string}) {
  const r = useReducedMotion();
  return <motion.div className={className}
    initial={r?false:{opacity:0,y:16}} whileInView={{opacity:1,y:0}}
    viewport={{once:true,margin:"0px 0px -6% 0px"}} transition={{duration:.45,ease:"easeOut"}}>
    {children}</motion.div>;
}
```

### `<SectionHeading eyebrow title intro? align?>`
Eyebrow (accent, see 01) + H2 + optional intro `<p>`. Left‑aligned by default; centered variant for hero‑of‑section and FAQ/why blocks. Many eyebrows include a `30px×3px` red bar before the text.

### `<PhotoHero>` / `<VideoHero>` **client (video)**
Full‑bleed media + gradient overlay + content. Structure: relative `overflow-hidden border-b-[5px] border-accent py-[112px] px-6`. Media `absolute inset-0 object-cover z-0`; overlay `absolute inset-0 z-1` gradient `linear-gradient(180deg, rgb(10 10 10 / calc(var(--ov)*.78)) 0%, … var(--ov) 100%)`. Content `relative z-2 max-w-[1200px] mx-auto`: breadcrumb · eyebrow row (red bar + label) · H1 (with red‑box keyword) · lead `<p>` · button row.
- **VideoHero**: `<video autoPlay muted loop playsInline poster=…>`; in a `useEffect` force `v.muted=true; v.play().catch(()=>{})` and re‑try on `canplay` (browsers drop the bare attrs otherwise). Home hero (`hero-video.mp4`) and the stats clip (`clip-door-opening.mp4`) use this.
- Home `--ov` ≈ .8, detail pages .82.

### `<MapHero>` (Service Areas only — **no photo**)
Distinct dark map look: `bg-[#161616]` + grid lines (`repeating-linear-gradient` 72px) + red radial glow top‑right + two faint "roads" + a few `MapPin`‑shaped markers (rotated `border-radius:50% 50% 50% 0`), with a **left‑weighted** gradient `linear-gradient(110deg, rgba(22,22,22,.94)…)` so left text stays legible. City pages add one labeled accent pin. Copy the exact markup from `Service Areas - Hub`.

### `<TrustStrip>` (dark)
`bg-ink` centered row: Angi badge, Elite badge, `★★★★★ 4.9 on Google`, divider, BBB `A+` chip + "BBB Accredited", divider, license line. `flex flex-wrap gap-[14px_26px] justify-center py-[22px]`.

### `<SplitFeature media side eyebrow title body…>`
Two‑col `1.05fr 1fr` (or `1fr 1fr`) image + text with a small accent corner badge on the image (`absolute -right-4 -bottom-4 bg-accent border-2 border-ink px-[18px] py-3 font-display uppercase`). Used for intro splits, "what we do", crew, owner, etc. On mobile stack with `.bt-mediaorder` controlling which goes first.

### `<CardGrid>` + `<IconCard>` / `<NumberStepCard>`
3‑ or 4‑col grids (`bt-g3`/`bt-g4`, collapse to 2 then 1). Light card = `bg-white border-2 border-ink rounded-[8px] p-6`, icon chip `46px rounded-[8px] bg-[rgba(184,32,42,.1)]` with accent stroke icon, H3, body. Dark card = `bg-panel border border-panel-border border-t-4 border-accent`. Number variant uses a `52px` red square with a big white display numeral.

### `<NumberedIndex>` (the signature "01/02/03" rows)
`border-2 border-ink rounded-[10px]` list; each row = grid `104px 1fr auto`, big accent display number/word + title+desc + a `52px` icon chip. Rows divided by `border-b-2 border-ink` (last none). Used for: repair‑hub services, spring types, opener drive types, off‑track steps, replacement "what you gain", door "how it opens", door "two safety systems", emergency "what to do", cables "roller types". Below it, a **dark callout** strip (`bg-ink rounded-[8px] p-[22px]`, accent icon + `<strong>` lead).

### `<RedBand cta>`
Full‑width `bg-accent text-white` band: left text (eyebrow pill `bg-[rgba(0,0,0,.18)] rounded-full`, H2, lead), right a white phone card. Reused as the mid‑page emphasis on detail pages and as the closing CTA (centered variant) on most pages.

### `<FaqAccordion items>` **client**
Replace the design's `<details>` with **shadcn `Accordion`** (Radix). Style to match exactly: each item `border-2 border-ink rounded-[8px] bg-white mb-[14px]`; trigger `font-display font-[700] uppercase text-[16px] px-[22px] py-5` with a **custom plus→minus** indicator: a `26px` square `border-2 border-accent rounded-[6px]` whose inner `+` (two accent bars) loses its vertical bar and fills red when open. Body `px-[22px] pb-[22px] text-[16px] leading-[1.62] text-body`. Center the heading above; container `max-w-[880px]`.

### `<LogoMarquee>` **client** (home "Who We Work With")
Infinite horizontal scroll of the 10 brand logos on white card tiles, edges masked to transparent (`mask-image: linear-gradient(90deg,transparent,#000 9%,#000 91%,transparent)`). Use a CSS `@keyframes` translateX(-50%) with the list duplicated, or `motion`. Tiles `w-[172px] h-[88px] border-2 border-ink rounded-[8px] bg-white p-4 grid place-items-center`.

### `<GalleryGrid>` (Portfolio) & `<BrandCard>` (Doors/Brands) & `<ReviewCard>`/masonry (Reviews) & `<PdfList>` (Brochures) & `<ContactForm>` (Contact)
One‑off but simple — copy structure from the respective `.dc.html`. `<ReviewCard>` masonry = CSS `columns-3` (→2→1) with `break-inside-avoid`. `<BrandCard>` = white logo tile over body + a category badge pill. `<ContactForm>` fields: Name, Phone, Email, City, "What you need" (Select), Message (Textarea) → wire to Resend/D1; use shadcn `Input`/`Select`/`Textarea`/`Button`.

### `<ServiceAreaMapMock>`
The stylized Tampa Bay map (grid + water shape + dashed coverage ellipse + accent pins + label chip). Pure CSS/SVG; copy from `Service Areas - Hub` or `Contact`. Not a real map (a real Google/Mapbox embed can replace it later).

## `lib/site.ts` (data to centralize)
- `PHONE = "(813) 279-6785"`, `PHONE_HREF="tel:18132796785"`, licenses `GD13010`, `GDI-09484`, founding `2007` (flag), hours, counties/cities.
- `NAV` (the mega‑menu tree above).
- `BRANDS`: `{name, logo, category:"door"|"opener", relationship:"install"|"service", blurb}` — **install:** Clopay, C.H.I., Hörmann, Amarr (doors) + LiftMaster (opener); **service:** Chamberlain, Genie, Craftsman, Linear (openers), Wayne Dalton (door). (See `Doors - Brands` page; this corrects the old site.)
- `SERVICE_AREAS`: 6 cities w/ slug + one‑line blurb.
- `REVIEWS`: the 8 verbatim Google reviews `{quote, name, source:"Google"}` (from `About - Reviews`). Keep names exactly (incl. "E R").
- `SERVICES`: the cards for the Services hub (title, href, blurb, icon).
