# Trinity Services Copy Deck

Ten pages of new website copy for the Services section, written in Trinity's real voice (warm, honest, local, family owned), then QA'd for tone and rules. Total: about 12,000 words. The original seven were drafted by three agents from the discovery research and the live site. The three repair sub pages (emergency, cables and rollers, tune up) were added later from confirmed technical research, and they complete the repair mega menu. The Services section is now content complete.

Voice and rules these were written to: see `_VOICE-AND-RULES.md`.

## Pages
| File | Page | Words |
|---|---|---|
| `00-services-overview.md` | Services hub (/services/) | 748 |
| `installation.md` | Garage Door Installation | 1,344 |
| `repair-and-service.md` | Garage Door Repair & Service (repair hub) | 1,217 |
| `off-track.md` | Off Track Repair & Replacement | 1,246 |
| `replacement.md` | Garage Door Replacement | 972 |
| `spring-repair.md` | Spring Repair & Replacement | 1,478 |
| `opener-repair.md` | Opener Repair & Replacement | 1,350 |
| `emergency-repair.md` | 24/7 Emergency Repair | 976 |
| `cables-and-rollers.md` | Cable & Roller Repair | 1,445 |
| `tune-up.md` | Tune Up & Maintenance | 1,173 |

Each file has: page title, URL slug, meta title, meta description, then the body with section headers and 3 to 5 FAQs, closing on the phone number and a free estimate prompt.

> **Routing note.** The three newest files (`emergency-repair.md`, `cables-and-rollers.md`, `tune-up.md`) use the new nested IA routes the nav already points at: `/services/repair/emergency/`, `/services/repair/cables-rollers/`, `/services/repair/tune-up/`. The older seven still carry their old live site slugs in their front matter for the 301 map (e.g. `/services/garage-door-spring-repair-and-replacement/`); remap those to the new IA routes (`/services/repair/spring/`, etc.) at build. The new pages already cross link to each other and to spring, off track, and installation using the new routes.

## Quality checks done
- Prose is 100% dash free. No em dashes, no en dashes, no pause hyphens, no hyphenated compounds (we write "same day," "off track," "family owned," "salt air," "sealed bearing," "tune up," etc.).
- No AI tell phrases ("it's not just X it's Y," "whether you need X or Y," "from X to Y," three item flourishes) and none of the banned buzzwords (seamless, robust, peace of mind, rest assured, elevate, look no further, etc.). Verified by grep.
- Bullets use `*`. The only `-` characters in the deck are in the phone number, the license number (GDI-09484), and URL slugs, all standard identifiers.
- The three repair sub pages (emergency, cables and rollers, tune up) meet the same bar, verified dash free and AI tell free by grep. Their technical claims (roller types, cable mechanics, the tune up checklist, the two opener safety systems, the Florida wind code points) were checked against research, and they avoid the common myths (no WD 40, don't grease the tracks, and Tampa Bay is a wind borne debris region but NOT the Miami Dade HVHZ, so no Miami Dade rules are implied).

## Decisions to settle sitewide (copy reflects a choice; confirm or change)
1. **Founding year.** Copy says "since 2007" (the logo tagline and About page). State records show 2011. Pick one and we'll make it consistent everywhere.
2. **Phone number.** Copy uses (813) 279-6785. The live site lists three county numbers, so confirm this is the one for these pages, or whether each routes by area. (This is also the open question on the service area pages.)
3. **Wayne Dalton.** Listed among openers (matching the old site) though it is primarily a door maker. Phrased as "service and repair" to stay accurate. Confirm before publishing.
4. **Provisional stats.** The homepage uses 18+ years, 12k+ doors, 4.9 stars, 6 cities. These are not stated as hard numbers in the service copy, but confirm the real figures before they go live anywhere.
5. **No prices or warranty terms** are stated, per the no invent rule. Add them once known. Free estimates are mentioned.
6. **Dashes in identifiers.** If you want even the phone, license, and slugs to drop hyphens, say so. Standard practice keeps them.
7. **Slug remap.** Settle the old vs new service slugs (see the routing note above) so the 301 map and the live routes line up.

## Next step
The Services section copy is complete (hub plus installation, replacement, the repair hub, spring, opener, off track, emergency, cables and rollers, and tune up). Next: write the Doors copy (types, brands catalog, brochures), or hand the finished copy to the build (the `/services/` routes, with `FaqJsonLd` on the detail pages).
