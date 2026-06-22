# Trinity Garage Door — Design → Next.js Handoff

You (Claude Code) are converting a finished, approved set of HTML designs into this Next.js app **1:1**. The visual result must match the designs exactly: same layout, spacing, type, color, borders, hover states, scroll reveals, and copy.

## Source of truth
The designs live as `*.dc.html` files in the project root (the "Bold Trade" set). Each is a self‑contained HTML page. **Open the relevant `.dc.html` and copy the exact markup, inline styles, and text** when building a page — these guides tell you HOW to convert and WHERE each page's content lives; the `.dc.html` is the literal pixel spec.

> Ignore the `<x-dc>`, `<helmet>`, `support.js`, and the `<script data-dc-script>` wrapper — those are the design tool's runtime. You only care about the markup inside `#bt-root` and the `<style>` block in `<helmet>`.

### Canonical file → route map
| Route | Source `.dc.html` |
|---|---|
| `/` (home) | `Trinity Homepage - Hi-Fi B (Bold Trade).dc.html` |
| `/services/` | `Trinity Service Page - Services Hub (Bold Trade).dc.html` |
| `/services/repair/` | `Trinity Service Page - Repair & Service (Variation B - Index).dc.html` ⟵ **use this one** |
| `/services/repair/spring/` | `Trinity Service Page - Spring Repair (Bold Trade).dc.html` |
| `/services/repair/opener/` | `Trinity Service Page - Opener Repair (Bold Trade).dc.html` |
| `/services/repair/off-track/` | `Trinity Service Page - Off-Track Repair (Bold Trade).dc.html` |
| `/services/repair/cables-rollers/` | `Trinity Service Page - Cables & Rollers (Bold Trade).dc.html` |
| `/services/repair/tune-up/` | `Trinity Service Page - Tune-Up (Bold Trade).dc.html` |
| `/services/replacement/` | `Trinity Service Page - Garage Door Replacement (Bold Trade).dc.html` |
| `/services/installation/` | **NOT YET DESIGNED** — see "Gaps" below |
| `/service-areas/` | `Trinity Service Areas - Hub (Bold Trade).dc.html` |
| `/service-areas/lutz/` | `Trinity Service Areas - Lutz (Bold Trade).dc.html` |
| `/service-areas/land-o-lakes/` | `Trinity Service Areas - Land O Lakes (Bold Trade).dc.html` |
| `/about/our-story/` | `Trinity About - Our Story (Bold Trade).dc.html` |
| `/about/portfolio/` | `Trinity About - Portfolio (Bold Trade).dc.html` |
| `/about/reviews/` | `Trinity About - Reviews (Bold Trade).dc.html` |
| `/doors/types/` | `Trinity Doors - Types & Styles (Bold Trade).dc.html` |
| `/doors/brands/` | `Trinity Doors - Brands (Bold Trade).dc.html` |
| `/doors/brochures/` | `Trinity Doors - Brochures (Bold Trade).dc.html` |
| `/contact/` | `Trinity Contact (Bold Trade).dc.html` |
| `/privacy-policy/` | `Trinity Legal - Privacy Policy (Bold Trade).dc.html` |

**Ignore** these older/alternate files: `Trinity Classic *`, `Trinity Homepage - Classic *`, `Trinity Homepage - Hi-Fi A (Warm Premium)`, `Trinity Service Page - Repair & Service (Bold Trade)` and `… v2 (Bold Trade)`. They are superseded drafts.

## Recommended architecture (App Router)
Build a **shared component library first**, then assemble pages from it. Every page is the same chrome (header, footer, sticky bar) wrapping a stack of section blocks.

```
app/
  layout.tsx                 # fonts, <SiteHeader/>, <MobileStickyBar/>, <SiteFooter/> wrap {children}
  globals.css                # Tailwind v4 @theme tokens (see 01-design-system.md)
  page.tsx                   # /
  services/page.tsx
  services/repair/page.tsx
  services/repair/spring/page.tsx
  ...(one folder per route above)
  contact/page.tsx
  privacy-policy/page.tsx
components/
  site-header.tsx            # sticky nav + mega menu (Radix NavigationMenu)
  top-utility-bar.tsx
  site-footer.tsx
  mobile-sticky-bar.tsx
  ui/...                     # shadcn primitives (accordion, etc.) + project atoms
  blocks/                    # one component per reusable section pattern (see 02-components.md)
lib/
  site.ts                    # nav data, brands, service-areas, reviews, hours, NAP
public/assets/...            # copy the images referenced by the designs (see "Assets")
```

This is a guide, not a mandate — if a different split is cleaner, use it, but **keep the rendered output identical**.

## Global build rules
1. **Match the design exactly.** When in doubt, open the `.dc.html` and read the inline styles. Do not "improve" spacing, colors, or copy.
2. **Tailwind v4** is the styling system. Port the inline styles to Tailwind utility classes (or `style={{}}` for one‑off exact values like `clamp()` font sizes and arbitrary percentages). Arbitrary values are fine: `text-[clamp(34px,5.6vw,64px)]`, `bg-[#1A1A1A]`, `tracking-[.22em]`.
3. **Use the theme tokens** from `01-design-system.md` for the repeated values (accent red, near‑black, cream, fonts) so the whole site is consistent and tweakable.
4. **shadcn/radix + lucide** for interactive primitives (mega menu, accordion, select). The designs hand‑rolled these with `<details>`/hover CSS; replace with the proper accessible primitives but keep identical styling. SVG icons in the designs map to **lucide-react** equivalents (see 02-components.md).
5. **Scroll reveal**: the designs fade/translate sections in on scroll (`.reveal → .in` via IntersectionObserver). Reproduce with **`motion`** (`motion/react`) using `whileInView` — see 02-components.md `<Reveal>`.
6. **Copy is final and dash‑free.** Reproduce text verbatim from the `.dc.html` (including the intentional "same day", "family owned", no em/en dashes house style). Do not rewrite.
7. **Forms** (Contact, the booking card mock): wire to the existing `contact-form.tsx` / Resend + D1 flow per the app's conventions. The designs only show the visual; keep the visual, attach real handlers.
8. **Accessibility**: keep the semantic landmarks, `aria-label`s, and alt text from the designs; upgrade hover‑only menus to keyboard‑accessible Radix components.

## Assets
The designs reference `assets/…` images (logo, badges, brand logos, jobsite photos, door‑after photos, hero video). Copy the project's `assets/` folder into `public/assets/` (or wire to your real CMS/media). Key files: `logo-trinity-primary.png`, `badge-angi-super-service-2024.png`, `badge-elite.png`, `brandlogo-*.{png,jpg}` (10), `jobsite-*.jpg` (6), `door-after-*.jpg` (4), `team-*.jpg`, `owner-jason-placeholder.png`, `hero-video.mp4`, `clip-door-opening.mp4`. Hero video autoplay must be `muted loop playsinline` (set the props in JS too — see 02-components `<VideoHero>`).

## Gaps / launch flags (carry forward, do not invent)
- **`/services/installation/` page is not designed.** It's linked from nav/cards. Either build it from `installation.md` copy by reusing the detail‑page block stack (see 03-pages "Detail page recipe"), or 301 to `/services/replacement/` until designed. Flag to the client.
- **City pages**: only Lutz + Land O' Lakes are designed. Wesley Chapel, Palm Harbor, Oldsmar, Tampa reuse the **same city template** (02/03) with their own copy when available.
- **Placeholders to fill**: Privacy Policy effective date / contact email / mailing address; Contact street address + map; brochure PDF links + thumbnails; owner Jason real headshot (currently AI placeholder); founding year (copy says 2007, state records 2011 — confirm); single phone vs per‑county routing.
- **`/get-service/?intent=repair|estimate`** is the existing booking/estimate flow — all "Book a Repair" / "Free Estimate" buttons link there. The booking calendar shown on the home page is a **visual mock**; wire to the real scheduler (Housecall Pro) or link out.

## Build order
1. `01-design-system.md` → `globals.css` + fonts + tokens.
2. `02-components.md` → header, footer, sticky bar, section blocks, atoms.
3. `lib/site.ts` data (nav, brands, areas, reviews).
4. Pages, simplest first: `/privacy-policy/`, `/contact/`, then a detail page (`/services/repair/spring/`) to prove the block library, then the rest.
5. Verify each page against its `.dc.html` side by side.

See `01-design-system.md`, `02-components.md`, `03-pages.md`.
