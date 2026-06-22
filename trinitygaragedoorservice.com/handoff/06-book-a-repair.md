# 06 — Book a Repair page (`/book-a-repair/`)

Source design: `Trinity Book a Repair (Bold Trade).dc.html`. This page is unusual: its whole job is to **frame, reassure, and launch the Housecall Pro (HCP) booking modal** — it is **not** a booking form. Build it on the standard chrome + blocks from `02`, plus the HCP specifics below.

`activeNav` = none. Header + sticky + footer (Services/Company/Contact column variant) as usual.

## The one hard rule
**No calendar, no date/time picker, no custom booking form on this page.** All of that lives inside HCP's modal. Every element styled as **"Book Online"** is a *mount point* for HCP's embedded button — the real button + modal are owned/hosted by Housecall Pro and open in a popup over this page. The customer never leaves the site.

## The HCP embed (how to wire it)
1. Load HCP's embed script once (per Trinity's HCP account snippet) — in this route's layout via `next/script` (`strategy="afterInteractive"`), or a small client component that injects it. Use Trinity's real account/token from env (`NEXT_PUBLIC_HCP_TOKEN` or whatever the snippet provides); do not hardcode.
2. HCP renders its own **"Book Online" button** into a target element. We may **not** be able to fully restyle the inside of HCP's button/modal — so treat the button as a **fixed object we frame**, not a component we control.
3. **Design approach used in the `.dc.html`:** there are 4 visually-identical red "Book Online" buttons (hero launch card, mid red band, closing CTA, mobile sticky bar). In the build, pick **one** primary mount (the hero launch card is best) for HCP's actual button; the other three should **trigger the same HCP modal** (call HCP's open function / click the hidden HCP button), OR, if the embed only supports a single rendered button, make the others scroll to / focus the hero button. Keep all four visually as designed. Document whichever HCP supports.
4. If HCP exposes only its own button markup (no JS open API), render the styled wrapper from the design as the **container** HCP injects into, and hide any duplicate buttons on mobile rather than faking a second trigger.

> Build note: the design's buttons are `<button class="bt-book-btn">` with a subtle red pulse (`@keyframes bt-pulse`, paused on hover). Keep the pulse on the primary CTA; it's a deliberate attention cue. Respect `prefers-reduced-motion` (disable it).

## Section stack (port copy verbatim from the `.dc.html`)
1. **Hero (split, photo bg)** — left: breadcrumb `Home / Book a Repair`, eyebrow "Book Online · 24/7", H1 "Book Your Repair In **A Few Taps**", lead, 3 check proof points. Right: **launch card** (white, `border-2 border-ink`, big shadow) = "Schedule Online" header, one line of reassurance, the **HCP Book Online button** (primary mount), "Secure scheduling powered by Housecall Pro" microcopy, an "or" divider, and a dark **Call (813) 279-6785** fallback. Note the hero uses a **left-weighted** gradient (`110deg`) so the left text stays legible; card is `order:-1` on mobile (shows first).
2. **TrustStrip** (dark) — shared block.
3. **"After You Tap Book Online" → "Here's How It Goes"** — 4 `<NumberStepCard>` (Pick the service · Choose an arrival window · Add your details · We confirm) + a cream note card: **"Need to change or cancel? Just call us."** (HCP has no online cancel — this caveat is required.)
4. **Mid `<RedBand>`** — "Real-Time Availability / Ready When You Are" + a white **Book Online** trigger.
5. **"Why book with a local crew"** — dark 4-card grid (same-day / honest & local / licensed / clear confirmation).
6. **"Rather Not Self-Book?" → two other ways** — 3 link cards: Call 24/7 (`tel:`), Request a Free Estimate (`/get-service/?intent=estimate`), Send a Message (`/contact/`).
7. **FAQ** — shadcn Accordion, 5 Q&As (account, arrival window vs exact time, deposit, change/cancel by phone, emergency→call).
8. **Closing `<RedBand>`** (centered) — Book Online + Call.

## Routing / links
- Canonical route: **`/book-a-repair/`** (trailing slash per `05` F1).
- Update the site-wide CTA target: nav "Book a Repair", footer, and home/section "Book a Repair" buttons should point here (this page replaces the old `/get-service/?intent=repair` landing for the *repair-booking* intent). Keep `/get-service/?intent=estimate` for the estimate flow. Add a 301 from `/get-service/?intent=repair` → `/book-a-repair/` if that old URL was live. (Reconcile with `02`/`03` which still reference `/get-service/?intent=repair` — booking now lands here.)
- "Free Estimate" still routes to `/get-service/?intent=estimate`; "Send a Message" → `/contact/`.

## What NOT to duplicate (HCP owns it)
Service selection, ZIP service-area check, arrival windows + real-time availability, address, contact fields, optional deposit, confirmation emails/SMS, and dropping the job on the schedule — all inside the modal. This page only motivates the tap and sets expectations. Never invent prices, deposit amounts, or guarantees.

## Metadata / SEO
Title + description from the booking copy (dash-free). This is a conversion page — index it. Optional `FAQPage` JSON-LD from the 5 booking FAQs (same `<FaqJsonLd>` helper as `04` G6). No `Reservation`/`Offer` schema (HCP owns the transaction).

## Acceptance checks
HCP script loads once · primary Book Online mounts HCP's real button · secondary Book Online triggers the same modal (or scrolls to it) · no calendar/form rendered by us · change/cancel-by-phone caveat present · call + estimate + message alternatives present · pulse respects reduced-motion · mobile sticky "Book Online" works · 2px-ink/7px-radius/`#b8202a` fidelity vs the `.dc.html`.
