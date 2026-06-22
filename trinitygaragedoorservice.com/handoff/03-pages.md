# 03 — Pages (per‑route section inventory)

Each page = `<TopUtilityBar>` + `<SiteHeader activeNav headerCta>` + sections + `<SiteFooter>` + `<MobileStickyBar>` (the first three + last two come from `layout.tsx`). Below is the section stack per page, in order, with the block to use. **Open the matching `.dc.html` (see 00‑README map) for exact copy, images, breadcrumb, and inline values.** Don't paraphrase copy.

## Shared "detail page recipe" (all `/services/repair/*` + replacement + installation)
`activeNav="services"`, `headerCta="repair"`. Stack:
1. **`<PhotoHero>`** — breadcrumb `Home / Services / Repair / <Page>` (repair sub‑pages) or `Home / Services / <Page>`; eyebrow; H1 with red‑box word; lead; Book a Repair + Call buttons. (Replacement/installation use `headerCta` Free Estimate variants per their `.dc.html`.)
2. **`<TrustStrip>`** (dark).
3. **`<SplitFeature>`** intro ("the short version") — photo + 2 paragraphs.
4. **`<CardGrid>` "Signs/Situations"** on cream — 5 `<IconCard>` + 1 dark note card (6 cells).
5. **`<NumberedIndex>`** topical section (types/steps/what‑you‑gain) + dark callout under it.
6. **`<RedBand>`** mid‑page emphasis (same‑day / 24‑7 / estimate).
7. **`<SplitFeature>` "what we do"** on dark — photo + checklist (accent check rows) + trailing line.
8. **`<CardGrid>` "Why Trinity"** on dark — 4 `<IconCard>` (honest / fast / licensed / pricing).
9. **`<FaqAccordion>`** on cream — 5 Q&As.
10. **`<RedBand>` closing CTA** (centered) — Call + Free Estimate.

Pages following this recipe (copy/sections differ only in text & the index contents):
- **Spring** (`/services/repair/spring/`): index = Torsion/Extension (2 rows) + "why springs wear here".
- **Opener** (`/services/repair/opener/`): index = 5 drive types (chain/belt/screw/wall‑mount/smart) + repair‑or‑replace note.
- **Off‑Track** (`/services/repair/off-track/`): signs = 6 causes; index = 5 on‑site steps; note = "please don't force it".
- **Replacement** (`/services/replacement/`): signs = "how to tell it's time" (7→5 cards+note); index = "what you gain" (5); RedBand eyebrow "Free Estimate".
- **Emergency** (`/services/repair/emergency/`): signs = "when it can't wait" (5+note); index = "what to do until we get there" (3 steps); note = storm season.
- **Cables & Rollers** (`/services/repair/cables-rollers/`): signs = "signs a cable is going" (5+note); index = 3 roller types (Steel/Nylon/Sealed Bearing); note = Florida hardware.
- **Tune‑Up** (`/services/repair/tune-up/`): signs = "what's in a tune‑up" (5+safety note); index = 2 safety systems (Photo Eyes / Auto Reverse); note = Florida upkeep; "what we do" block = **DIY homeowner tips** (incl. "skip WD‑40", "don't grease tracks").
- **Installation** (`/services/installation/`): **not designed** — assemble from `installation.md` copy using this recipe, or 301 to replacement. Flag.

## Repair hub `/services/repair/`
Source: `…Repair & Service (Variation B - Index)…`. Same recipe but the hub's **NumberedIndex is the 6 repair services 01–06** (the editorial index that won approval). `activeNav="services"`.

## Services hub `/services/`
Source: `…Services Hub…`. Sections: PhotoHero (breadcrumb `Home / Services`, eyebrow "Garage Door Services", H1 "Garage Door Services **In Tampa Bay**", "Explore Services" + Call) → TrustStrip → centered intro `<SectionHeading>` → **`<CardGrid>` of 6 `<ServiceCard>`** (Installation, Repair & Service, Off‑Track, Replacement, Spring, Opener — each a full‑card link with a hover "Learn More" footer bar) → full‑width **emergency callout** link card (dark, MapPin/alert, "When It Can't Wait" → `/services/repair/emergency/`) → "Why People Call Us" 4‑card dark grid → `<ServiceAreaMapMock>` split → closing RedBand "Get In Touch". `headerCta="repair"`.

## Home `/`
Source: `…Hi-Fi B (Bold Trade)…`. `activeNav` none. Sections in order: **VideoHero** (`hero-video.mp4`, ~0.8 overlay, headline + Book/Call) → TrustStrip → **About split** (team showroom photo + "Doors That Just Work") with owner badge → **`<LogoMarquee>` "Who We Work With"** (10 brands) → "Why homeowners call us first" 4‑card dark grid → **stat band** (4 numbers) + **VideoHero‑style clip** (`clip-door-opening.mp4`) → **Before & After 3‑card gallery** (3 `door-after-*` images, tags, captions) + "See Our Work" → **Service‑area map** split (ZIP field) → **Reviews** 3‑card → **Housecall Pro booking** card mock (the calendar/time chips are visual; wire real scheduler) → final **RedBand** "Don't Wait" → footer (social variant). This is the richest page — port section by section from the `.dc.html`.

## Service Areas
- **Hub `/service-areas/`** (`activeNav="areas"`): **`<MapHero>`** (no photo) → TrustStrip → intro → **6 town `<Card>`s** (MapPin icon, blurb, "<City> Service" hover bar → `/service-areas/<slug>/`) → "Not sure you're in our area?" callout (→ `tel:`) → "Why people call us" dark 4‑card → `<ServiceAreaMapMock>` split → closing CTA.
- **City pages `/service-areas/lutz/`, `/service-areas/land-o-lakes/`** (template — reuse for the 4 unbuilt cities): **`<MapHero>`** w/ labeled city pin, eyebrow "Service Area · <county>" → TrustStrip → **`<SplitFeature>` "what we see in <city>"** → **"What we do in <city>"** 6 small link‑cards (`<bt-do>`: icon chip + label → service pages) → **review pull‑quote band** (one Google review, big) → **nearby areas** chips → closing CTA. Verify the LOL "what we do" cards: each link/label/icon must match (installation, repair, opener, off‑track, tune‑up, emergency).

## About (`activeNav="about"`, `headerCta="repair"`)
- **Our Story `/about/our-story/`**: PhotoHero (team‑showroom) → TrustStrip → **owner `<SplitFeature>`** (Jason placeholder photo + "Local, and we mean it") → "How we work" 3 number‑step dark cards → **crew `<SplitFeature>`** (team‑banner photo, "Read the reviews" → reviews) → "What we do" cream `<bt-do>` 6‑link grid → **Florida + areas + credentials** split (left areas chips, right dark credentials card w/ license chips + badges) → **`<FaqAccordion>`** (5) → closing RedBand. (Footer = About variant.)
- **Reviews `/about/reviews/`**: dark **quote‑themed hero** (giant faint ★, 4.9 + BBB chips, no photo) → intro → **`<ReviewCard>` masonry** of the **8 verbatim reviews** (`columns-3`) → awards dark split → closing RedBand "Had Us Out To Your Place?". Keep review text/byline exactly (E R, Tracey Dominguez, Lynn Rosenthal, Charles Cohn, Jonathan B., Ron Sompels, Kay Bennett, Shilen Patel).
- **Portfolio `/about/portfolio/`**: PhotoHero (`door-after-white-2car-home`) → TrustStrip → **"New installs & replacements"** `<GalleryGrid>` (4 `door-after-*`, tag + caption overlay) → **"Repairs that brought a door back"** gallery on cream (6 `jobsite-*`) + honesty note → closing RedBand. Captions are general/honest (no invented cities) — keep as written.

## Doors (`activeNav="services"`, `headerCta="estimate"` — header + sticky use **Free Estimate**)
- **Types & Styles `/doors/types/`**: PhotoHero (`door-after-brown-wood-sectional`, "Browse Brochures" 2nd btn) → TrustStrip → **"How the door opens"** `<NumberedIndex>` (Sectional/Roll‑Up/Older — word labels not numbers) → **"What it's made of"** 2×2 card grid (Steel/Wood/Aluminum&Glass/Composite) + budget note → **"The look"** 3 cards → **Insulation** dark 3 cards + R‑value note → **"Built for Florida storms"** section (red pill heading + 2×2 check cards + Miami‑Dade clarification dark note) → cross‑link strip (Brands / Brochures) → `<FaqAccordion>` (5) → closing RedBand.
- **Brands `/doors/brands/`**: dark hero (no photo) → TrustStrip → **"Doors we install & service"** 2×2 `<BrandCard>` (Clopay/C.H.I./Hörmann/Amarr, logos) → **LiftMaster** wide highlight card → **"Brands we service & repair"** 3‑col `<BrandCard>` (Chamberlain/Genie/Craftsman/Linear/Wayne Dalton + a dark "got another brand?" card) → "Why no single brand" + Florida wind split → `<FaqAccordion>` (5) → closing RedBand. Use `lib/site.ts BRANDS` + real `brandlogo-*` images.
- **Brochures `/doors/brochures/`**: dark hero → dark intro note → **Clopay** `<PdfList>` (Residential 8 + Commercial 4) → **C.H.I.** list (6) on cream → **LiftMaster** list (7) + "placeholder links" note → "Not sure where to start?" closing RedBand. PDF links are placeholders.

## Contact `/contact/`
`activeNav="contact"`. Dark header band (no photo, red glow) → **two‑col**: left = big red **call card** + Book/Estimate buttons + **Hours** card (Mon–Sat 7am–9pm; 24/7 emergencies) + **payments** chips (Cash/Check/Card/Debit/Google Pay/Zelle); right = **`<ContactForm>`** (Name/Phone/Email/City/What‑you‑need select/Message) → **"Where we work"** split (area chips + `<ServiceAreaMapMock>`, "mobile, we come to you" + address‑pending note) → **"What happens after you reach out"** 3 number‑step dark cards → closing RedBand. Footer = Privacy/Contact variant.

## Privacy Policy `/privacy-policy/`
`activeNav` none. **No marketing blocks** — dark header band (breadcrumb + title + effective‑date chip placeholder) → a `max-w-[860px]` **legal prose** column (`<LegalBody>`: `h2` = Archivo Expanded uppercase w/ top hairline rule, `p`/`ul` styled per the `.dc.html`) with a "review with counsel" callout at top and bracketed placeholders highlighted (`bt-ph` = `bg-[#FBEDED] text-[#8f1820] rounded px-[7px]`) → dark **Contact Us** block (placeholders for email/address) → footer (Privacy/Contact variant). Mark `robots` per client choice (legal pages usually indexed).

---
### Verification
For each route, open the page in the app next to its `.dc.html` and check: hero media + overlay, breadcrumb, eyebrow/H1/H2 text, every card/index row, the red bands, FAQ accordion behavior, footer variant, mobile (<920px) nav + sticky bar, and scroll‑reveal. Pixel‑match the borders (2px ink), radii, and the accent red `#b8202a`.
