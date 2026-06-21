# Trinity Service Areas Copy Deck

Seven pages for the local SEO layer: a hub plus six city pages. Written to the services voice rules (warm, honest, local, no dashes, no AI tells, nothing invented). Page shape follows the locked IA in `../../site-audit/ARCHITECTURE-PROPOSAL.md` §D (local intro, what we see, services, nearby areas, a review, NAP, CTA).

## Pages
| File | Page | URL | County | Local angle |
|---|---|---|---|---|
| `00-service-areas-overview.md` | Service Areas hub | /service-areas/ | all three | overview + city links |
| `lutz.md` | Lutz | /service-areas/lutz/ | Hillsborough (+ a bit of Pasco) | established, older doors, larger lots |
| `land-o-lakes.md` | Land O Lakes | /service-areas/land-o-lakes/ | Pasco | new master planned + lakefront |
| `wesley-chapel.md` | Wesley Chapel | /service-areas/wesley-chapel/ | Pasco | new construction boom |
| `palm-harbor.md` | Palm Harbor | /service-areas/palm-harbor/ | Pinellas | coastal salt air (strongest) |
| `oldsmar.md` | Oldsmar | /service-areas/oldsmar/ | Pinellas (incorporated city) | bayfront salt air + established mix |
| `tampa.md` | Tampa | /service-areas/tampa/ | Hillsborough | do it all (historic + new + waterfront) |

## How these avoid templated city-page slop
The voice rules ban cookie cutter local copy (no "nestled," "bustling," "vibrant," etc.). Each page is differentiated on real, verified facts (county, location, housing character, gathered by web search 2026-06-21), not invented landmarks or stats. Three honest angles:
- **Coastal salt air** corrodes door hardware faster: Palm Harbor (St. Joseph Sound), Oldsmar (Old Tampa Bay), and the waterfront parts of Tampa.
- **New construction corridor**, builder grade doors hitting first service: Wesley Chapel and Land O Lakes.
- **Established and inland**, older doors due for repair or replacement: Lutz.

Real anchors used (all verified): Connerton and Bexley, Wiregrass Ranch and the Epperson lagoon, Innisbrook and Ozona, the Ransom Olds founding of Oldsmar, Ybor City and Hyde Park. No invented populations, subdivisions, or job counts. City pages cross link to each other and to the matching service pages (fixes finding F6).

## Per city data for the build (put in lib/site.ts)
Treat the city pages as one template plus per city data (matches §D "templated, data driven"). Counties and ZIP codes, verified, for the ZIP checker and the LocalBusiness `areaServed`:
- **Lutz** (Hillsborough, small Pasco slice): 33548, 33549, 33558, 33559
- **Land O Lakes** (Pasco): 34637, 34638, 34639
- **Wesley Chapel** (Pasco): 33543, 33544, 33545
- **Palm Harbor** (Pinellas): 34683, 34684, 34685
- **Oldsmar** (Pinellas): 34677
- **Tampa** (Hillsborough): ~58 ZIPs; representative 33602, 33606, 33609, 33629, 33620

Shared template sections (same each city, pull from lib): the services list, the why Trinity line, the review block, NAP and hours, the CTA. Per city data (what each file uniquely provides): meta, the local intro, the "what we see here" angle, and the nearby areas list.

## Reviews note
Each city page features one real Google review, rotated so no two pages repeat. They're framed neutrally ("From our reviews") and do NOT claim the reviewer lives in that city, because our reviews are not geo tagged. If you wire a live Google feed later that exposes a city, show true local reviews then.

## Sources
- Page shape and IA: `../../site-audit/ARCHITECTURE-PROPOSAL.md` §D.
- Company facts, counties, the six cities: `../../research/business-summary.md`.
- Verified local facts per city (county, ZIPs, coastal vs inland, character, landmarks): web search, 2026-06-21.
- Voice and house style: `../services/_VOICE-AND-RULES.md`.
- The old `/service-areas/` page (`../../research/web-copy/service-areas.md`) was thin and generic; not reused beyond confirming the area and brands. The old Lutz blog post (`../../research/web-copy/blog-lutz-repair.md`) is the one the IA says to 301 into `/service-areas/lutz/`; this page replaces it with real brand voice.

## Quality checks
- Dash free page copy. No em dashes, en dashes, pause hyphens, or hyphenated compounds (we write "salt air," "new construction," "builder grade," "corrosion resistant," "Gulf coast," "tree lined," "same day," "tune up"). Highway numbers are spelled out (Highway 41, Interstate 75, State Road 54 and 56) to keep prose hyphen free. The only hyphens are the license number GDI-09484 and URL slugs. Verified by grep.
- No AI tell phrases or banned buzzwords. Specifically avoided the local-page clichés: nestled, bustling, vibrant, charming, hidden gem, thriving, boasts.
- Real facts only, verified by search. Nothing invented.

## Decisions to settle
1. **Phone by county (the big one for this section).** The old site used three county lines: Hillsborough (813) 447-3874, Pasco (813) 279-6785, Pinellas (727) 314-5062. Every page here uses only (813) 279-6785 to match the rest of the build. But Palm Harbor and Oldsmar are Pinellas and Tampa is Hillsborough, so the number shown won't match the county. Decide: one number sitewide, or route the phone by county on these pages.
2. **NAP and map per area.** §D calls for NAP and a map on each city page. The old site listed Oldsmar, Lutz, and a conflicting Tampa address. Pick the canonical address(es) and which to show where. The copy shows no street address yet.
3. **Founding year** 2007 vs 2011, same sitewide call as the other decks.
4. **More towns later.** The template makes adding towns cheap (Odessa, Carrollwood, Westchase, New Tampa, Safety Harbor all show up as nearby). Out of scope for v1; flag if wanted.

## Next step
Hand to the build (the `/service-areas/` hub + six city routes, data driven from lib/site.ts), or write the next copy set: the three missing service pages (emergency, cables and rollers, tune up), or Doors (types, brands, brochures).
