# 01 — Design System ("Bold Trade")

Port these into Tailwind v4 (`@theme` in `globals.css`) + `next/font`. Every page uses only these tokens; nothing else.

## Fonts (`next/font/google`)
- **Display:** Archivo Expanded — weights 600 700 800 900. Used for all headings, eyebrow numerals, buttons-as-display, stat numbers. Always UPPERCASE (`uppercase`) with tight tracking on big sizes (`tracking-[-.015em]`).
- **Body:** Hanken Grotesk — weights 400 500 600 700 800 900. Everything else.

```ts
// app/fonts.ts
import { Archivo_Expanded, Hanken_Grotesk } from "next/font/google";
export const display = Archivo_Expanded({ subsets:["latin"], weight:["600","700","800","900"], variable:"--font-display" });
export const body = Hanken_Grotesk({ subsets:["latin"], weight:["400","500","600","700","800","900"], variable:"--font-body" });
```
Apply both `variable`s on `<html>` and set `font-family` via the theme below. Body default = Hanken Grotesk.

## Color tokens
| Token | Value | Use |
|---|---|---|
| `--accent` | `#b8202a` | the red — CTAs, eyebrows, rules, highlights, hovers |
| `--accent-dark` | `#8f1820` | red hover/darker text on red |
| `--ink` | `#1A1A1A` | near‑black: text, 2px borders, dark sections |
| `--ink-2` | `#161616` | dark hero / map backgrounds |
| `--ink-3` | `#111111` | footer bg |
| `--panel` | `#222222` | dark cards (on `#1A1A1A`) |
| `--panel-border` | `#333333` | dark card borders |
| `--cream` | `#F2F0EC` | the warm off‑white alternating section bg |
| `--cream-2` | `#FBF3F3` / `#FBEDED` | faint red‑tinted panel (repair mega col, badges) |
| `--paper` | `#ffffff` | white sections / cards |
| `--body` | `#4a4a4a` | body copy on light |
| `--body-muted` | `#6a6a6a`,`#8a8a8a`,`#9a9a9a` | secondary/muted on light/dark |
| `--body-dim` | `#a8a8a8`,`#cfcfcf`,`#d8d8d8` | body copy on dark |
| `--hairline` | `#ececec`,`#e7e0d6`,`#EDE6DB` | subtle light borders |
| BBB blue | `#0a4ea2` | only the BBB "A+" chip |
| Florida/map | `rgba(40,80,110,.4)` water, `#26282f` roads | service‑area map mock |

```css
/* globals.css — Tailwind v4 */
@import "tailwindcss";
@theme {
  --color-accent: #b8202a;
  --color-accent-dark: #8f1820;
  --color-ink: #1A1A1A;
  --color-ink-2: #161616;
  --color-ink-3: #111111;
  --color-panel: #222222;
  --color-panel-border: #333333;
  --color-cream: #F2F0EC;
  --color-paper: #ffffff;
  --color-body: #4a4a4a;
  --font-display: var(--font-display), "Archivo Expanded", sans-serif;
  --font-body: var(--font-body), "Hanken Grotesk", system-ui, sans-serif;
}
html { scroll-behavior: smooth; }
body { background:#fff; color: var(--color-ink); font-family: var(--font-body); margin:0; }
::selection { background:#b8202a; color:#fff; }
```
> The designs also support runtime‑tweakable `--accent` and a hero overlay `--ov` (default `.82`). Keep `--accent` as a CSS var so a future theme switch is trivial. `--ov` is only used inside hero gradient overlays.

## Type scale (exact, from the designs)
- **H1 (hero):** `font-display font-[900] uppercase leading-[.98] tracking-[-.015em] text-[clamp(34px,5.6vw,64px)]`, white on hero. A key word is wrapped in a red box: `bg-accent text-white px-3 inline-block`.
- **H2 (section):** `font-display font-[800] uppercase leading-[1.03] text-[clamp(26px,3.4vw,40px)]`.
- **H3 (card):** `font-display font-[700] uppercase text-[18px–20px]`.
- **Eyebrow:** `font-[800] text-[13px] tracking-[.16em] uppercase text-accent`. Hero eyebrow uses `tracking-[.22em]` and sits next to a `52px×4px` red bar.
- **Body:** `text-[16.5px] leading-[1.6] text-body` (hero lead `clamp(17px,2.1vw,21px)`; card body `15px`).
- **Stat numbers:** `font-display font-[900] text-[clamp(32px,4vw,46px)]`, the `+`/`★` in accent.

## Spacing & layout
- **Container:** `max-w-[1200px] mx-auto px-8` (px-5 on mobile). Some text blocks use `max-w-[880px]`/`max-w-[860px]`.
- **Section vertical padding:** `py-[84px]`→`py-[92px]` desktop, `py-[60px]` mobile. FAQ/legal use `max-w-[880px]`.
- **Section rhythm:** white → cream `#F2F0EC` → white → dark `#1A1A1A` → … alternating. Dark sections often get a `border-t-[5px] border-accent` top rule; light section breaks use `border-t-2 border-ink`.
- **Radii:** buttons `rounded-[7px]`; cards `rounded-[8px]`–`rounded-[12px]`; pills `rounded-full`.
- **Borders:** the signature look is **`border-2 border-ink`** (2px near‑black) on cards, inputs, the nav bottom, mega menu, map, index. Dark cards: `border border-panel-border` + `border-t-4 border-accent`.
- **Shadows:** subtle — buttons `shadow-[0_12px_26px_rgba(184,32,42,.4)]` (red), cards `shadow-[0_12px_30px_rgba(0,0,0,.05)]` or `0_18px_40px_rgba(0,0,0,.08)`. Mega menu `shadow-[0_26px_50px_rgba(0,0,0,.22)]`.

## Buttons (exact)
- **Primary (red):** `bg-accent text-white font-[800] text-[15px] tracking-[.04em] uppercase px-8 py-[17px] rounded-[7px] shadow-[0_12px_26px_rgba(184,32,42,.4)] hover:bg-accent-dark`.
- **On‑light secondary:** `bg-white text-ink border-2 border-ink …` (or `bg-ink text-white`).
- **On‑dark / on‑red secondary:** `bg-white text-accent` or `bg-transparent text-white border-2 border-white`.
- **Nav CTA (smaller):** `px-[22px] py-[13px] text-[13.5px]`.
- Phone links are `tel:18132796785`, display `(813) 279-6785`, often `font-display font-[800/900]`.

## Motion
- **Scroll reveal:** sections start `opacity-0 translate-y-4`, animate to `opacity-100 translate-y-0` over ~0.45s ease when entering viewport (~10% threshold, one‑shot). Implement with `motion/react` `whileInView` — `<Reveal>` in 02.
- **Hover micro‑interactions:** cards `hover:-translate-y-[3px]` + stronger shadow; nav caret rotates 180°; mega‑menu fades/slides up; gallery images `hover:scale-[1.05]`; "Learn More" bars turn red on card hover; partner‑logo marquee scrolls infinitely (see `<LogoMarquee>`).
- Respect `prefers-reduced-motion` (disable reveal/marquee).

## Iconography
Inline SVGs in the designs → **lucide-react**. Common mappings: phone→`Phone`, pin→`MapPin`, clock→`Clock`, shield‑check→`ShieldCheck`, bolt→`Zap`, wrench→`Wrench`, alert‑triangle→`AlertTriangle`, check→`Check`, arrow‑right→`ArrowRight`, chevron‑down→`ChevronDown`, chevron‑right→`ChevronRight`, search→`Search`, menu→`Menu`, instagram→`Instagram`, facebook→`Facebook`, linkedin→`Linkedin`, star (filled text `★`) keep as text or `Star`. Where a custom SVG has no clean lucide match (spring coil, roller, door‑opener, garage), keep the **exact inline SVG** from the `.dc.html`.
