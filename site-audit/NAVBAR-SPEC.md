# Trinity Garage Door Service — Navbar Spec (locked 2026-06-15, trimmed for conversion)

> **Structure:** Services mega-menu + **Service Areas** (single link) + **About** dropdown, with a loud **24/7 phone**, a **trust cue**, and the single primary **[ Book a Repair ]** button. Repair-led. Booking = Calendly (placeholder). Platform = WordPress (brand refresh).
> **Conversion trim (from the 4-item version):** **Resources** moved to the footer (content is an organic-landing asset, not an on-site nav path); **Service Areas** collapsed from a 6-city dropdown to one link. Result: **3 top-level items (1 mega-menu + 2 links) + phone + 1 primary button** — down from the original 14 flat items.

---

## Desktop top bar
```
[ Trinity logo ]   Services ▾   Service Areas   About ▾        ☎ 24/7: (813) 279-6785   ·   [ Angi '24 ★ ]   [ Book a Repair ]
```
- **Logo** → `/` (replaces the old "Home" item).
- **Phone** → always visible, loud, tap-to-call (`tel:`). Single 24/7 number. *Confirm the canonical tracking number during NAP cleanup (audit found mismatched displayed vs. dialed numbers).*
- **Trust cue** → small badge/strip beside the button: Angi Super Service Award 2024 / "Licensed since 2007" / Google star rating *(once the number is confirmed)*. Social proof at the decision point.
- **[ Book a Repair ]** → the one primary button, high-contrast (brand-refresh accent). Opens **Calendly** (placeholder until the real dispatch tool is chosen).
- **Free Estimate** → secondary CTA only; lives inside the Services mega-menu and page heroes (kept off the bar so it never competes with Book a Repair).
- Sticky header; condenses on scroll.

---

## 1) Services ▾ — mega-menu (the workhorse)
Three columns, Repair first (priority path). Each column has its own CTA.

| **REPAIR** *(priority)* | **INSTALL & REPLACE** | **DOORS & BRANDS** |
|---|---|---|
| 24/7 Emergency Repair → `/services/repair/emergency/` | New Installation → `/services/installation/` | Door Types & Styles → `/doors/types/` |
| Spring Repair → `/services/repair/spring/` | Door Replacement → `/services/replacement/` | Brands (catalog) → `/doors/brands/` |
| Opener Repair → `/services/repair/opener/` | | Brochures → `/doors/brochures/` |
| Off-Track Repair → `/services/repair/off-track/` | | |
| Cables & Rollers → `/services/repair/cables-rollers/` | | |
| Maintenance / Tune-Up → `/services/repair/tune-up/` | | |
| **[ Book a Repair ▸ ]** (Calendly) | **[ Free Estimate ▸ ]** → `/get-service/?intent=estimate` | **[ Browse Doors ▸ ]** → `/doors/` |
| *All Repair Services →* `/services/repair/` | | |

- Optional 4th panel (brand-refresh visual): featured image / "Door broke? We're open 24/7" promo slot.

## 2) Service Areas → single link
- **Service Areas** → `/service-areas/` (no dropdown). The hub page lists all six cities; the full city list also lives in the footer for internal linking + local SEO.
- City pages still exist and rank as organic landing pages: Lutz, Land O' Lakes, Wesley Chapel, Palm Harbor, Oldsmar, Tampa.

## 3) About ▾
- Our Story → `/about/our-story/` (since 2007, owner Jason Grunder, licenses, "why hire us")
- Portfolio / Our Work → `/about/portfolio/` (labeled before/after)
- Reviews → `/about/reviews/` *(the trust card — keep it surfaced)*

---

## Mobile
- **Hamburger** → full-screen accordion: **Services** (expands to the 3 sections) · **Service Areas** (link) · **About** (expands). Resources links appear at the bottom of the menu + in the footer.
- **Sticky bottom bar** (always visible): `[ ☎ Call ]   [ Book a Repair ]`.

## Footer (absorbs the demoted items)
- **Resources** → Blog · Safety Tips · DIY Troubleshooting · FAQ.
- **Specials / Promos** → shown **only when a real offer is active** (CMS-managed); no permanent slot, no dead links.
- Full **service list** + full **brand list** (all 10 names for SEO) + full **service-area / city list**.
- About links, social, **standardized NAP**, hours, licenses (GD13010 / GDI-09484), Angi 2024 / Elite badges, payment methods.

---

## Behavior / accessibility
- Desktop mega-menu opens on hover **and** click/focus; closes on ESC and outside-click.
- Keyboard navigable (Tab in, arrows within mega-menu); `aria-haspopup` / `aria-expanded`; visible focus states; section headers are non-link labels.
- Descriptive link text; maintain repair-first order everywhere (menu, mobile, footer).

## What each of the old 14 items became
Home→logo · About Us→**About ▾** · Services(+6)→**Services mega-menu** · Brochure→Services▸Doors & Brands · Brands(+10)→Services▸Brands catalog · Door Types→Services▸Doors & Brands · Service Areas→**single link** · Safety Tips→footer (Resources) · Troubleshooting→footer (Resources) · Blogs→footer (Resources) · Portfolio→**About ▾** · Promo/Discounts→footer (contextual) · Request an Estimate→**Free Estimate** (secondary CTA) · Schedule a Repair→**[ Book a Repair ]** button.
