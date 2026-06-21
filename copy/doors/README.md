# Trinity Doors Copy Deck

Three pages for the Doors section, per the locked IA (`../../site-audit/ARCHITECTURE-PROPOSAL.md` §B): a buyer's guide, a brands catalog that replaces the old 10 near-duplicate brand pages, and a brochures list. Written to the services voice rules (`../services/_VOICE-AND-RULES.md`): warm, honest, no dashes, no AI tells, nothing invented.

## Pages
| File | Page | URL | Words |
|---|---|---|---|
| `door-types.md` | Door Types & Styles (buyer's guide) | /doors/types/ | ~1,350 |
| `brands.md` | Brands We Carry (catalog) | /doors/brands/ | ~1,300 |
| `brochures.md` | Brochures | /doors/brochures/ | ~430 |

No standalone `/doors/` hub exists in the locked IA; the nav links the three pages directly. If a hub is wanted later (the NAVBAR-SPEC mentioned a "Browse Doors" CTA), the simplest move is to 301 `/doors/` to `/doors/types/`.

## The brands install-vs-service resolution (IMPORTANT, please confirm with Jason)
The old site contradicted itself: the brands hub said Trinity installs only Clopay + LiftMaster, but every brand detail page claimed full install. This deck resolves it, aligned with the already-approved `installation.md` (which says Trinity installs Clopay, C.H.I., Hörmann, and Amarr doors):

**Install & service (we sell new):**
- Doors: Clopay, C.H.I., Hörmann, Amarr
- Openers: LiftMaster (the professional line we install most)

**Service & repair (we fix it, we don't sell it new):**
- Openers: Chamberlain, Genie, Craftsman, Linear
- Wayne Dalton (its doors, and its discontinued openers)

## Brand facts corrected from the old site (verified by web research 2026-06-21)
- **Wayne Dalton is a DOOR maker, not an opener brand.** The old site listed it under openers. Wayne Dalton discontinued its openers (iDrive, etc.), so parts are scarce; we still service the old openers and their doors (TorqueMaster). Recategorize as a door brand.
- **Clopay makes doors only** (no openers); it pairs with LiftMaster.
- **LiftMaster and Chamberlain are the same company** (Chamberlain Group): LiftMaster is the pro/dealer-installed line, Chamberlain the retail/DIY line; both use the myQ app.
- **Craftsman openers are built by Chamberlain Group** under license.
- **Genie** uses Aladdin Connect, not myQ; **Hörmann** uses its own app, not myQ.
- **Linear** is mainly a gate/access-control brand that also makes garage operators.

## lib/site.ts changes this implies
The `BRANDS` array's `relationship` field needs to match the resolution above:
- Flip **C.H.I., Hörmann, Amarr** from `service` to `install`.
- **Wayne Dalton** stays `service`, but should be categorized as a DOOR brand. The array has no `category` field yet; add one (`door | opener | both`) so the catalog can filter by type the way the IA wants.
- For the catalog/cards, consider adding per brand: `category`, a short blurb, notable lines, and a `windRated` flag.

## Florida wind ratings (used in door-types and brands)
Tampa Bay (Hillsborough, Pinellas, Pasco) is a wind borne debris region under the Florida Building Code, so doors must be wind-load rated to the opening's design pressure. It is NOT the Miami Dade / Broward HVHZ, so the copy does not imply Miami Dade approvals are required here. No specific mph is quoted (it's site specific, looked up per address at permit time). The unsourced "garage doors cause X% of hurricane damage" stat is avoided; the copy describes the internal pressurization failure mechanism instead, which is well established.

## Quality checks
- Dash free page copy, no AI tells, no brand/city clichés. Verified by grep. The only hyphens are URL slugs, the license number GDI-09484, and a few manufacturer product names that keep their real spelling (e.g., Ultra-Grain).
- Nothing invented: brand facts verified by web research; no prices or warranty terms stated; no "authorized dealer" claim (we say "install and service").
- The brochures page lists only the PDFs we actually have on hand (Clopay, C.H.I., LiftMaster), and says so. Those PDFs need descriptive renames and cover thumbnails with alt text at build (see `../../public/brochures/README.md`).

## Next step
Doors completes the core copy set. Either hand the whole thing to the build (the `/doors/` routes, with the brands catalog as a data-driven component off `lib/site.ts`), or move to the remaining content (resources/blog, the conversion pages) or polishing.
