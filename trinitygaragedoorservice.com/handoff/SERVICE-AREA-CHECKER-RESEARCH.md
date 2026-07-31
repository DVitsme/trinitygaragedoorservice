> ## ⛔ SUPERSEDED, do not build from this
>
> **Replaced by `SERVICE-AREA-REDESIGN.md` at the repo root, and already shipped 2026-07-28.**
>
> This document assumed the checker needed a **Google Maps Platform key**, a billing account and
> the Places API. It needed none of them. The shipped version runs entirely client side against
> `lib/service-area-zips.json` (verified 130/130 against Trinity's live Housecall Pro zone) in
> **1,818 bytes gzipped**, with no key, no billing and no runtime request. The map beside it is a
> server rendered SVG built from public domain US Census boundaries, not a map library.
>
> Kept only as a record of what was considered and why it was not chosen.

# Future feature — "Are you in our area?" address checker (Google) — RESEARCH (2026-06-22)

Replace the **ZIP input mock** in the home page's "We Cover the Whole Tampa Bay Area" section
(`app/page.tsx`, the service-area-map block; also reusable on `/service-areas/`) with a real
**Google address autocomplete** that tells the visitor whether their address is in Trinity's
service area, then routes them to **Book a Repair** or **call**.

## Short answer: yes, fully buildable with a Google Maps Platform API key.
This is a standard "service-area validator" pattern. Three pieces: (1) address autocomplete →
(2) get the address's coordinates + county → (3) test it against the service area, then show a
yes/no with a CTA. All doable; the only real decisions are how we define the area and whether
the area-test runs in the browser or in a Worker.

## What you set up on the Google side
1. A **Google Cloud project** + a **billing account** (card on file required even for free tiers;
   real spend at this traffic ≈ \$0 — see Cost).
2. Enable **Places API (New)** and the **Maps JavaScript API** (the **Geometry** library is part
   of Maps JS and is free — used for point-in-polygon / distance).
3. Create an **API key** and restrict it:
   - **Application restriction = HTTP referrers** → `https://trinitygaragedoorservice.com/*`
     (+ the workers.dev preview while testing).
   - **API restriction** → only Maps JavaScript API + Places API.
4. ⚠️ **Must use the NEW APIs.** As of **March 1, 2025** the legacy `google.maps.places.Autocomplete`
   and `AutocompleteService` are **not available to new customers** — a new key can only use
   **`PlaceAutocompleteElement`** (web component) / `AutocompleteSuggestion` (programmatic) from
   **Places API (New)**. Don't follow old tutorials that use `new google.maps.places.Autocomplete(...)`.

## The three pieces

**1. Address autocomplete — `PlaceAutocompleteElement` (Places API New).**
A web component the user types into; Google returns address predictions. On select it fires an
event with a `Place`. Request only the fields we need (`location`, `addressComponents`,
`formattedAddress`) to control cost. Use **session tokens** (the element handles this) so a
typing session is billed as one cheap unit, not per keystroke.

**2. Get the location from the selected place — no separate geocode needed.**
The selected `Place` gives you `place.location` (lat/lng) and `place.addressComponents`, from which
you read **county** = `administrative_area_level_2`, **state** = `administrative_area_level_1`,
**ZIP** = `postal_code`. (If we ever take a raw typed string instead of a picked suggestion, we'd
add a Geocoding API call — but with the picker we don't.)

**3. Is it in the service area? — pick one (or combine):**
- **County match (recommended primary).** True if `county ∈ {Hillsborough, Pasco, Pinellas}` and
  `state == Florida`. Matches exactly how Trinity describes coverage, is robust, covers the edge
  towns (Odessa, Carrollwood, etc.), needs **no polygon and no extra API**, runs client-side.
- **Point-in-polygon (most precise).** Define the area as a polygon (draw it once), then
  `google.maps.geometry.poly.containsLocation(place.location, polygon)` → boolean. Use if Trinity
  wants an exact boundary that doesn't follow county lines.
- **Radius (crudest).** `geometry.spherical.computeDistanceBetween(place.location, LUTZ)` < N miles.
  Easy, but a circle fits a real service area poorly.

Recommendation: **county match as the base**, optionally refined by a radius or a hand-drawn
polygon for the fuzzy edges. Store the county list / polygon in `lib/site.ts` (it's public data).

## Architecture on our stack (Next.js 16 / Cloudflare Worker)
- New client component `components/service-area-checker.tsx` (`"use client"`) that mounts the
  `PlaceAutocompleteElement`, listens for the select event, runs the in-area test, and renders the
  result + CTA. Drop it into the home "We Cover the Whole Tampa Bay Area" block (replacing the ZIP
  `<input>` + "Check" link) and reuse it on `/service-areas/`.
- Load Maps JS with the official **`@vis.gl/react-google-maps`** (Google's React library, supports
  the new components) **or** `@googlemaps/js-api-loader` directly, with `libraries: ["places","geometry"]`.
- Key from **`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`** (public on purpose; safe because it's referrer- +
  API-restricted — that's the documented pattern for the Maps JS key; never reuse a server key here).
- Result UX:
  - ✅ in area → "You're in our service area" + **Book a Repair** (`/book-a-repair/`).
  - ❓ just outside / unsure → "We may still reach you — call (813) 279-6785."
  - Always offer the phone as the fallback, and degrade gracefully if the API fails to load (show
    the phone + the existing area chips).
- **Optional hardening:** proxy the autocomplete/details through a Cloudflare Worker / Next API
  route with the key as a **server secret** (IP-restricted) so the key never ships to the browser.
  More work; the client-side referrer-restricted key is standard and sufficient for this use.

## Cost reality
Effectively **free** at a local-contractor traffic level. Places API (New) has monthly free tiers
(Essentials), and session-token autocomplete bills a whole typing session cheaply (first ~12
autocomplete requests/session billed, then free; the session + place-details is the efficient
path). A billing card is required, but real spend is ~\$0. **Re-confirm current pricing at build
time** — Google reworked Maps pricing in 2025 (moved off the old universal \$200/mo credit to
per-API free tiers).

## Build checklist (when we do it)
- [ ] Google Cloud: enable Places API (New) + Maps JS; create + restrict the key; put it in
      `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (Cloudflare var + `.dev.vars`).
- [ ] `lib/site.ts`: add the service-area definition (served counties, and/or a polygon/radius).
- [ ] `components/service-area-checker.tsx`: mount `PlaceAutocompleteElement`, read
      `location`/`addressComponents`, run the in-area test, render result + CTA, graceful fallback.
- [ ] Swap it into the home service-area block (and `/service-areas/`).
- [ ] Verify on the deployed Worker (referrer restriction must include the live domain).

## Sources
- Places Autocomplete legacy closed to new customers (use `PlaceAutocompleteElement`): https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete
- Autocomplete (New) + session pricing: https://developers.google.com/maps/documentation/places/web-service/session-pricing
- `containsLocation()` point-in-polygon: https://developers.google.com/maps/documentation/javascript/examples/poly-containsLocation
- Geometry library: https://developers.google.com/maps/documentation/javascript/geometry
- API key security / referrer restrictions: https://developers.google.com/maps/api-security-best-practices
