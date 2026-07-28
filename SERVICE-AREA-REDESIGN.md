# Service Areas section — redesign plan of record

**Created 2026-07-28.** Supersedes `handoff/SERVICE-AREA-CHECKER-RESEARCH.md` (which assumed a
Google Maps key). Referenced from `UPGRADE-PLAN.md` §4 item 2.

---

## 0. The decision, in one paragraph

**Stop treating this as a map section. It is an answer section.** Build a real, server rendered
SVG of Trinity's actual 130 zip footprint (measured: **1,051 bytes gzipped**, zero JavaScript,
zero API keys, zero recurring cost), and put a **zip code checker** in the right column as the
primary interface. The map stops being decoration and becomes the proof surface that reacts when
someone checks. A match routes into Housecall Pro booking; a miss captures a lead instead of
dead ending. Real city links stay on the page as crawlable text, because they are the only part
of this section carrying any search value.

---

## 1. What is wrong with the section today

`app/page.tsx:271-315`, and the shared `components/blocks/service-area-map-mock.tsx` used on
`/services/`, `/service-areas/` and `/contact/`.

| Problem | Evidence |
|---|---|
| **The map is fake.** Grid lines, two rotated grey bars as "roads", a blue wedge as "water", five pins at hardcoded percentages | `app/page.tsx:277-288`. The shared component is even marked `aria-hidden="true"`, admitting it carries no information |
| **It is the biggest thing in the band** and conveys nothing | Occupies the `1.25fr` of a `1.25fr_1fr` grid |
| **Four copies exist.** Three import the shared mock, the homepage has a hand copied fourth | `grep ServiceAreaMapMock` |
| **35 of 41 towns are invisible.** A Spring Hill or New Port Richey visitor sees six chips, none theirs, and concludes we do not come out | `lib/service-area-zips.json` = 41 cities |
| **Zero interactivity.** A zip input used to sit here and was removed for doing nothing | Comment at `app/page.tsx:302-304` |
| **Sitewide contradiction.** 16 files still say "Hillsborough, Pasco, and Pinellas", three counties. The homepage stat block says **5 Counties Covered** | Verified zone includes Hernando (9 zips) and Polk (5 zips) |

---

## 2. Why this shape, and not a Google or Mapbox embed

### Cost of the map, measured rather than estimated

| Option | JS shipped | Cost at 20k views/mo | Brand exact |
|---|---|---|---|
| Mapbox GL JS v3 | **499 KB** gzip | $0 | yes |
| MapLibre + self hosted Protomaps | 245 KB gzip | $0 | yes |
| Google Maps JS | ~100 KB+ streamed at runtime | **~$70/mo** | no, always Google's basemap |
| **Server rendered SVG (chosen)** | **0 KB** | **$0 forever** | pixel exact `#b8202a` |

The commonly quoted "Mapbox is about 200 KB" is stale v1 folklore. Half a megabyte of WebGL would
ship on four marketing pages so that nobody can pan a map they did not ask to pan.

### The three research findings that shaped the layout

1. **Nine of nine competitors use a plain zip or address field, not a map.** Precision Door,
   Roto Rooter, Mr. Rooter, ARS, Aire Serv. The only audited exception is Google Fiber, where
   coverage is genuinely patchy so a map actually informs. Sunrun and Aptive use a zip field as a
   pure commitment device that does not even return a real answer.
2. **A map has no SEO value.** Google's local ranking is relevance, distance and prominence from
   the Business Profile. Map tiles render no crawlable text, so a map that *replaces* city links
   is a straight loss. The links stay.
3. **Never dead end a miss.** Precision Garage Door returns "we apologize, no locations found"
   and nothing else. Roto Rooter keeps the phone visible whatever the outcome. Trinity has no
   sister franchise to hand off to, so a miss must read "call us, we probably still reach you",
   which is also **literally true**: the 130 zips are the online booking zone, and a second
   268 zip zone exists in their account.

### Why keep a map at all

Because it is now honest and effectively free, it makes the "yes" *feel* true when it lights up,
and it is reused on three other pages where a checker does not belong but a real map does.
It earns its place at 1 KB. It would not at 499 KB.

---

## 3. The design

### Layout, desktop

The columns swap. Copy and the checker move **left**, the map moves **right**, at `1fr 1fr`.
Reason: the action reads first in natural order, and the homepage booking band directly below
already uses copy left / card right, so the page becomes internally consistent.

```
SERVICE AREAS
WE COVER 41 TOWNS ACROSS TAMPA BAY
Based in Lutz, so drive times stay short. 130 zip codes across
five counties, and no trip charge to come take a look.

┌─ CHECK YOUR ZIP ──────────────┐   ┌─ real SVG, dark ────────────┐
│ ┌──────────┐  ┌───────────┐   │   │  dissolved 130 zip footprint│
│ │  33549   │  │   CHECK   │   │   │  in accent red              │
│ └──────────┘  └───────────┘   │   │  5 county outlines behind   │
│                               │   │  Lutz marked as home base   │
│  ✓ Good news. We cover Lutz.  │   │                             │
│    No trip charge.            │   │  ← a pin drops on the       │
│    Two hour arrival window.   │   │    matched zip when checked │
│  [BOOK ONLINE]  [CALL]        │   │                             │
└───────────────────────────────┘   └─────────────────────────────┘

Towns we cover in depth:  Lutz · Land O' Lakes · Wesley Chapel ·
                          Palm Harbor · Oldsmar · Tampa      ← real links
Also serving:  Odessa, New Port Richey, Zephyrhills, Trinity,
               Clearwater, St. Petersburg, ... (35 more)     ← plain text
```

The two link rows are deliberate and come straight from the SEO research: **link only the six
routes that exist**, and list the remaining 35 as plain text. Fabricating anchors to pages that
do not exist is the doorway pattern Google names explicitly. Plain text coverage statements are
fine.

### The three result states

| State | Copy | Action |
|---|---|---|
| **Match** (in the 130) | "Good news. We cover {City}." plus "No trip charge" and "Two hour arrival window" | **Book Online** (HCP modal) and **Call**. No lead capture here, booking is worth more |
| **Miss** | "We do not book {zip} online, but we cover a lot of ground in between. Call and we will tell you straight." | **Call**, and "or leave your number" which expands to name + phone and posts a lead |
| **Invalid** | Inline, five digits required | none |

Both facts in the match state are verified live from Housecall Pro: `trip_charge: 0` on both
zones, `default_arrival_window: 120`.

### Accessibility, which rules out the obvious approach

An interactive map widget is a WCAG trap: `aria-hidden="true"` on anything still focusable (a
live map's own zoom controls) is itself a **4.1.2 failure**, and removing it leaves a keyboard
trap under 2.1.2. The SVG sidesteps this entirely. It has no zoom controls, city pins are real
`<a>` elements that are natively focusable, and the adjacent text list is the 1.1.1 alternative.

---

## 4. Data pipeline, run once and committed

No new runtime or dev dependency. Everything below is `npx`, run once, output committed.

| Input | Source | License |
|---|---|---|
| County outlines | `cb_2025_us_county_500k.zip`, filtered to FIPS 12057, 12101, 12103, 12053, 12105 | Census, public domain |
| Zip footprint | `cb_2020_us_zcta520_500k.zip`, filtered to the 130 zips. **All 130 matched, zero holes** | Census, public domain |
| City coordinates | `2024_gaz_place_12.txt` Census Gazetteer. 39 of 41 match directly | Census, public domain |

Two manual coordinate fixes: **Land O' Lakes** needs the apostrophe to match "Land O' Lakes CDP",
and **Clearwater Beach** has no separate Census record.

Order matters, dissolve **before** simplify:

```
mapshaper zcta130.geojson -dissolve -simplify dp 5% -o precision=0.0001 footprint.geojson
mapshaper county5.geojson -simplify dp 3% -o precision=0.0001 counties.geojson
```

Dissolve first gives **2.9 KB**; simplify first gives 6.0 KB for a worse looking result. The
union has 4 disjoint parts and 3 genuine interior holes, which is real geography, not an artifact.

A one off script then projects to SVG coordinates and emits **path `d` strings**, not GeoJSON, so
no projection library ever reaches the browser.

**Measured output, the whole map:**

| Piece | Size |
|---|---|
| Footprint path | 1,452 chars |
| County paths | 1,058 chars |
| **Committed JSON, gzipped** | **1,051 bytes** |
| Zip lookup table, gzipped | 783 bytes |
| **Total for the entire feature** | **under 2 KB** |

A proof render is at `.shots/` guidance below. It reads unmistakably as Tampa Bay: the Pinellas
peninsula, the bay cut out of the middle, the Polk spur east.

---

## 5. The phases

Each phase ships on its own and is useful alone. Phases 1 and 2 have **no external dependency**
and can go out immediately.

### Phase 1 · The real map · **M** · ✅ **DONE 2026-07-28**

Replaced four fake maps with one honest component.

- [x] `scripts/generate-service-area-geo.mjs` → `lib/service-area-geo.json`, wired as `pnpm geo:gen`.
      Pure `npx mapshaper`, **no new dependency, runtime or dev**. Sources cached in `.geo-cache/`
      (gitignored). All **130 of 130** zips matched a ZCTA polygon, dissolved into one outline
- [x] `components/blocks/service-area-map.tsx`, a server component
- [x] Deleted `service-area-map-mock.tsx`, swapped all four call sites including the homepage's
      hand copied duplicate
- [x] County contradiction fixed across **14 files**
- [x] Verified at all four breakpoints from the production build. `pnpm build` green, 55 pages

**Measured on the deployed HTML, not estimated:** the inlined map is **2,239 bytes gzipped**.
Mapbox GL JS v3 is 499 KB before it draws anything.

**Verified accessibility rather than assumed it:** the rendered SVG carries
`aria-hidden="true" focusable="false"` and contains **zero** links and **zero** focusable
elements, so there is no keyboard trap and no `aria-hidden`-on-focusable 4.1.2 conflict. The
crawlable city links sit beside it as the text alternative.

#### What changed against the plan

**The real footprint is portrait, about 1000 x 1200.** Their zone runs further north to south
than east to west, so the map could not drop into the old landscape slot. Rather than crop real
coverage to fit a stock shape, the layout adapted: the homepage grid went
`[1.25fr_1fr]` map-left → **`[1.15fr_0.85fr]` copy-left, map-right**, which also matches the
booking band directly below it. The other three pages cap the map at `max-w-[380px]`.

Two things only visible once rendered: the outline touched the panel edges and read as clipped
(padding raised from 18 to 34), and the corner badge sat on top of the Pinellas peninsula, so it
moved to the **bottom right** where the real geography leaves empty space.

#### Follow-ups this surfaced, deliberately not done here

| Item | Why it was left |
|---|---|
| `app/contact/page.tsx` still shows *"Street address and map to be added once the business address is confirmed"* | The address **is** confirmed now. Removing the placeholder properly means rolling the verified NAP into the footer and the schema together, which is `UPGRADE-PLAN.md` §10 item 4, not this phase. Half shipping it would leave a worse inconsistency |
| `content/blog/how-a-new-garage-door-can-boost-your-homes-curb-appeal.md` still says three counties | Live blog post, outside the `app/` sweep |
| `pnpm lint` fails | **Pre-existing**, verified by stashing this work and re-running on a clean tree. An ESLint 9 config error ("Converting circular structure to JSON"), unrelated to this change |

### Phase 2 · The zip checker · **S/M** · ✅ **DONE 2026-07-28**

- [x] `lib/service-area-lookup.json`, baked by the same `pnpm geo:gen`
- [x] `components/service-area-checker.tsx`, `"use client"`, **no network call at all**
- [x] Three result states per §3. Every state keeps a way to reach a human on screen
- [x] The map reacts: a ring drops on the matched zip
- [x] On the homepage and `/service-areas/`. Not on `/services/` or `/contact/`

**Client cost: about 3.8 KB gzipped**, of which the 130 zip lookup is 1,818 bytes.

#### Two data files, on purpose

`service-area-geo.json` (2,367 gzipped) holds every SVG path and is **server only**.
`service-area-lookup.json` (1,818 gzipped) holds `zip -> [cityIdx, countyIdx, x, y]` and is the
only one the client component imports. Verified after building: **zero client chunks contain the
map geometry**, and the lookup is present as expected. Importing the geo file from a `"use client"`
module would ship the whole map to every visitor, so both files carry a header comment saying so.

The `x, y` are viewBox coordinates rounded to whole units, matching the map's own viewBox, so the
marker overlay lines up exactly with no runtime projection. One unit is under half a pixel at the
sizes this renders, so the decimals were only costing bytes.

#### Verified by driving real Chrome, not by eye

Screenshots cannot prove a form works. Node 22 ships a `WebSocket`, so a dependency free CDP
script (`scratchpad/cdp-test.mjs`) typed into the real input through React's native value setter
and read the live DOM back:

| Input | Result | Marker |
|---|---|---|
| `33549` | "Good news. We cover Lutz." + Hillsborough County + Book Online + Call | ✅ shown |
| `90210` | "Let's check 90210 by phone." + Call | not shown |
| `335` | "Enter a five digit zip code." | not shown |

Logic also unit checked across the whole table: all **130/130** zips resolve to a valid city,
county and map point, and `33549-1234`, ` 33549 ` and `3354 9` all normalise to a match while
`abcde` and `335` correctly read as typos rather than as "we do not serve you".

#### Decisions worth keeping

- **The marker is hollow rings, not a filled dot.** A matched zip usually sits under an existing
  city pin. Check `33549` and it lands on Lutz, and a solid marker hid both the pin and its label.
- **A miss captures nothing yet.** The plan called for "or leave your number" here, but that posts
  into the lead path that `UPGRADE-PLAN.md` §9 documents nine defects in, with Turnstile on always
  pass dummy keys. Sending fresh traffic into it would be worse than a phone number. Marked
  `TODO(Phase 4)` in the file.
- **"No trip charge" is still held back** pending `CLIENT-ASKS` #25b. The match state ships the
  **two hour arrival window** instead, which is equally verified and is not a price promise.

⚠️ **QA gotcha, cost a cycle:** these sections are wrapped in `<Reveal>` (Motion `whileInView`), so
they sit at `opacity: 0` until scrolled into view. Capturing with `captureBeyondViewport` therefore
photographs an invisible section. Scroll it into view first. The bundled `screenshot.sh` is immune
because its very tall window puts everything in view.

### Phase 3 · Match routes into Housecall Pro booking · **S** · ✅ **DONE 2026-07-28**

- [x] Embed script mounted **once** in `app/layout.tsx`, `strategy="afterInteractive"`
- [x] `components/book-online-button.tsx` calls `window.HCPWidget.openModal()`, keeping the
      `window.open` fallback
- [x] The match state's Book Online opens the modal in place. **All 13 Book Online buttons on the
      site were upgraded at once**, since that component is the single mount point
- [ ] Still to ask Jason: a booking link tagged to this section, for attribution (`CLIENT-ASKS` #32)

The script src is derived from `NEXT_PUBLIC_BOOKING_URL` in `lib/site.ts`, so one env var drives
both the modal and its fallback and they can never point at different accounts. If the variable is
unset the script simply does not mount and every button keeps its old behaviour.

#### Measured before committing to mounting it site wide

The worry was shipping a booking app to every visitor. Probed with CDP:

| | housecallpro bytes |
|---|---|
| Page load, nobody clicks | **5,197** (just `script.js`) |
| Opening the modal | the booking app, and only then |

HCP creates its iframe with `loading="lazy"` behind `display:none`, so the heavy booking bundle is
**not** fetched until someone opens it. That is what makes a site wide mount cheap.

#### Verified, including the paths that are easy to assume

| Check | Result |
|---|---|
| Modal opens over the page | ✅ `.hcp-widget` goes `none` → `flex`, no new tab |
| From the zip checker's match card | ✅ same, end to end from typing `33549` |
| **`?booking` deep link** | ✅ auto-opens with no click and no code of ours |
| **Script blocked** (ad blocker, offline, bad token) | ✅ falls back to the correct hosted URL |
| **Their unscoped `<style>` injection** | ✅ 1,604 chars, **every** selector namespaced `.hcp-*`, nothing leaks into our design |

The fallback matters more than it looks: `window.HCPWidget` is assigned only at the **end** of
their init and their init bails early on a bad token, so the global can legitimately be missing.
It is wrapped in `try/catch` as well, because a booking is too valuable to lose to an exception.

#### ⚠️ Finding: the modal asks for the zip code too

HCP's booking flow **opens with its own zip gate**, "Let us check if we operate in your area". So a
visitor who checks `33549` with us is asked again a moment later.

Not fixable from our side: prefill via URL is unsupported (we grepped their 651 KB bundle for
`first_name`, `email`, `phone`, `prefill` and found nothing), and `openModalWithParams()` takes an
undocumented cross origin schema. **Do not build on it without probing first.**

Left as is, because the checker earns its place anyway:
1. It answers **before** the visitor loads a third party app at all.
2. **Out of area visitors never reach HCP's gate.** They get our phone number instead, which is
   exactly the Precision Garage Door dead end the research warned about.

*Not established:* what HCP actually shows for an out of area zip. Driving their cross origin
iframe from the parent CDP target did not work, and it was not worth more time on someone else's
product.

### Phase 4 · The miss captures a lead · **M** · blocked on the lead path

- [ ] **Blocked on `UPGRADE-PLAN.md` §9.** That path has nine confirmed defects, including
      Turnstile running Cloudflare's documented always pass dummy keys and the client discarding
      the `emailed` flag. Sending new traffic into it would be irresponsible
- [ ] Once fixed: name + phone + zip posts to `/api/contact` with a distinct `source`
- [ ] Then push to Housecall Pro `POST /leads` behind the same interlock §9 defines

**Validated by their own data:** of 100 sampled existing leads, **41% are zip only**, no street
and no city. A zip plus phone lead is the normal shape in their workflow, not a degraded one. And
`lead_source` currently holds only "Angi Leads" (169) and "Yelp" (90), so "Trinity Website" would
be cleanly measurable from its first entry.

⚠️ Write side nests the address under `customer.addresses[]`; read side returns a top level
`address`. Easy to trip on.

---

## 6. Deliberately not building

| Item | Why |
|---|---|
| **"Next available: Tuesday 8am"** | A 30 day pull returned **365 windows, every one `available: true`**, 16 slots every weekday. Refiltering to one named technician's `employee_ids` returned a **byte for byte identical** response. The flag reflects configured office hours, not capacity. Shipping it would be fiction |
| **Per address availability** | Does not exist. `/company/service_zones/check`, `/service_area/check` and friends all 404, and `zip=` passed to `booking_windows` is **silently ignored**, returning an identical response |
| **A boundary drawn from HCP** | `GET /service_zones` returns `coverage_type: "zone"` with a flat `zip_codes[]` and no coordinates anywhere. Geometry has to come from Census |
| **An interactive pan/zoom map** | §2. Cost, accessibility, and nine of nine competitors |
| **`areaServed` / `GeoShape` schema as an SEO play** | Semantically valid, but Google's own LocalBusiness documentation never mentions it. Add it as cheap hygiene if convenient, do not sell it as a ranking lever |

---

## 7. What to ask the client

1. **Which zone is current, 130 zips or 268?** (`CLIENT-ASKS` #33.) The 130 has all five
   technicians assigned so we treat it as live. If the 268 is real, the miss state can be
   warmer for those zips: "that is in our extended area" rather than a flat call us.
2. **A booking link tagged to this section** (`CLIENT-ASKS` #32), so bookings from the checker
   are attributable.
3. **Is "no trip charge" safe to advertise?** It is `0` on both zones in their own system, but it
   is a pricing promise and worth one confirmation before it goes on the homepage.

---

## 8. Sizes worth remembering

| | |
|---|---|
| **Map, as delivered in the HTML, gzipped** | **2,239 bytes** |
| **Checker, client JavaScript, gzipped** | **~3,800 bytes** (1,818 of it the zip lookup) |
| **Both phases together** | **~6 KB**, no API key, no runtime request, $0 |
| Mapbox GL JS v3, before drawing anything | 499 KB |
| MapLibre GL JS | 245 KB |
| Google Maps at 20k views/mo | ~$70/mo |
