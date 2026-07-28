# Housecall Pro API — live test results and what the keys unlock

**Status: BOTH KEYS ARE LIVE AND WORK.** Tested 2026-07-28 against the real Trinity account.
This overturns several assumptions the project was carrying. Read the "What changed" section first.

> Companion docs: `CLIENT-ASKS.md` · `CLIENT-NOTES.md` · `PRE-LAUNCH-PUNCHLIST.md`
> Booking page design brief (historical): `trinitygaragedoorservice.com/handoff/BOOK-A-REPAIR-HCP-BRIEF.md`

---

## 1. The keys

Both live in `.env.local`. **Never** expose these to the browser, never prefix with `NEXT_PUBLIC_`.

| Env var | Length | Result |
|---|---|---|
| `HOUSE_CALL_PRO_APY_KEY` | 32 chars | ✅ **200 OK** — full access |
| `HOUSE_CALL_PRO_DRIVE_SOCIAL_API_KEY` | 32 chars | ✅ **200 OK** — full access |

- Base URL: `https://api.housecallpro.com`
- Auth header: `Authorization: Token <key>` — **`Bearer` also works**, both return 200.
- Both keys resolve to the **same company**, `Trinity Garage Door Service, Inc. - Lutz`
  (`40061931-f41f-4a0e-946e-70dcb62e0e81`).
- **No observable difference between the two keys.** Same read access, same write authorisation.
  The "Drive Social" key is not scoped down in any way we could detect.

### Write access — UNCONFIRMED, and deliberately not forced
`PUT /customers/cus_probe_does_not_exist` returned **404 "Customer not found"**, not 401/403.
That is *suggestive* of write permission, but it is **not proof**: the API may look the record up
before it checks permissions, in which case a read-only key would also 404.

**We stopped there on purpose.** The only way to settle it by API is to write to a real record in
a live account with 6,001 customers, and HCP's customer update uses `PUT` semantics that can blank
fields you omit. Not worth the risk to answer a question the dashboard answers for free.

**How to settle it properly:** Housecall Pro asks you to choose **"Full access" or "Read-only"**
when a key is generated, and the setting is visible in the dashboard. Ask Jason to look. Admin
role is required to see or create keys.

Nothing was written to the account at any point during this testing.

---

## 2. What changed vs what this project previously believed

| Previously recorded | Reality as of 2026-07-28 |
|---|---|
| "Public API is MAX plan only and we don't have it" | API is still MAX-gated — **so Trinity is already paying for MAX.** We have working access right now. |
| "There is no `/leads` resource" | **`/leads` exists and holds 259 records.** Wrong before. |
| "The API cannot power a live availability calendar" | ❌ **WRONG. It can.** `GET /company/schedule_availability/booking_windows` returns real bookable slots. See §10. |
| "Booking embed is a hosted link only" | Superseded — we now have the **`HCPWidget` modal snippet**. |
| "Zapier on Essentials is enough for lead sync" | Still true, but **moot** — MAX is already paid for, so use the API directly and skip the Zapier subscription. |

**The plan finding matters commercially.** HCP gates the public API behind MAX (~$299/mo). Working
API access means Trinity is on that tier already. Any advice that starts with "upgrade to unlock"
is wrong, and so is paying Zapier for something the paid-for API does natively.

---

## 3. What the keys can reach

Read-only `GET` sweep. Counts are real records in their live account.

| Endpoint | Status | Records |
|---|---|---|
| `/company` | 200 | business profile, address, service-area ZIPs |
| `/customers` | 200 | **6,001** |
| `/jobs` | 200 | **7,673** |
| `/invoices` | 200 | **8,211** |
| `/estimates` | 200 | **2,425** |
| `/leads` | 200 | **259** |
| `/employees` | 200 | 8 |
| `/lead_sources` | 200 | **70** |
| `/tags` | 200 | 25 |

Also live: **`/service_zones`** (2 zones) and **`/events`** (1,530). `/routes` returns 200 but is
empty — they don't use route planning.

**404 on this account:** `/materials`, `/material_categories`, `/price_forms`,
`/price_book/services`, `/job_appointments`, `/pipeline`, `/schedule`, `/lead_line_items`, `/me`.
HCP's docs list several as real resources, so they are likely **gated or not enabled on this
account** rather than nonexistent. `/checklists` exists but demands a job or estimate UUID filter.

> ⚠️ **Lesson: several endpoints are NESTED, and a root-level 404 proves nothing.** My first
> sweep called `/job_types` and `/schedule_availability` at the root, got 404s, and I wrongly
> concluded they did not exist. The real paths are **`/job_fields/job_types`** and
> **`/company/schedule_availability`**. Check the path shape before concluding a feature is
> missing.

No `RateLimit-*` headers are returned, and HCP publishes no numeric limits. Build with retry and
backoff. Responses carry `x-request-id`, useful for support tickets.

### Pagination
`?page=N&page_size=N` (max 100). Every list response includes `page`, `page_size`, `total_pages`,
`total_items`. **`per_page` is silently ignored** — pass it and you get the default 10 back, which
is an easy way to think you've set a limit when you haven't.

### `/service_zones` — two zones, only one is real
| Zone | ZIPs | Techs assigned | Trip charge |
|---|---|---|---|
| "Pasco, Hillsborough, Pinellas, Hernando" | **130** | 5 (Jason, David, Jonah, Tyler, Bryce) | $0 |
| "Zips" | **268** | 0 | $0 |

The 130-ZIP zone is the **operational** one — it has the techs attached and matches `/company`.
The 268-ZIP zone has nobody assigned and is probably legacy or aspirational. **Use the 130 list**
for any service-area feature, and ask Jason which is current before treating 268 as real.

Useful copy fact: **trip charge is $0** in both zones.

### `/events` is their internal calendar
1,530 records: supplier pickups, staff meetings, and **personal entries including medical
appointments and family commitments**. It is blocked time, not open slots. Irrelevant now that
the real availability endpoint is found (§10) — never try to reconstruct availability from this.

⚠️ **Do not surface any of this on the website**, and note it in the security conversation below:
this endpoint exposes employees' private lives, not just business data.

---

## 4. 🔒 The second key: Drive Social Media

`HOUSE_CALL_PRO_DRIVE_SOCIAL_API_KEY` belongs to **Drive Social Media** (drivesocialnow.com), a
real St. Louis marketing agency — ~200 to 500 staff, founded 2011, Inc. 5000 listed five years
running, BBB accredited with an A+ rating and only 4 complaints in 3 years. They are legitimate.

**What the key is almost certainly for:** their in-house attribution platform, **Marketing Milk**.
Their own marketing describes building *"custom API bridges"* from a client's CRM, POS and phone
systems so they can show *"dollar-in, dollar-out ROI"* on ad spend. Trinity's HCP job and invoice
data is exactly that input.

**Two things worth flagging, neither of them an accusation:**

1. **This is not an official Housecall Pro integration.** HCP publishes a partner list (Zapier,
   QuickBooks, CallRail, Podium, Angi, Yelp and ~25 others). Neither Drive Social Media nor
   Marketing Milk is on it. It is a DIY integration built on a client-issued key, so there is no
   HCP-side vetting of how the data is stored once it leaves the account.
2. **We do not know if that key is read-only, and read-only would not narrow it much.** HCP offers
   exactly two modes, and the toggle limits **writing, not visibility** — a read-only key still
   reads the entire account. HCP's own docs describe handing over a key as giving *"a backdoor to
   all of the data in your Housecall Pro account."*

**How much data that actually is, concretely.** Attribution reporting needs job counts, revenue
and lead sources. The key also reaches:

- **6,001 customer records** — names, home addresses, phone numbers, emails
- **8,211 invoices** and 2,425 estimates, with amounts
- **Staff personal calendar entries.** `/events` returned medical appointments and family
  commitments belonging to named employees. That is not business data by any reading.

There is also **no per-key usage log** in Housecall Pro — nobody can check whether a key was used,
when, or from where. So the access is broad, it covers private personal information, and it is
unauditable. That combination is worth one calm conversation, not an alarm.

**What to raise with Jason (framed as hygiene, not alarm):**
1. Check in HCP whether the Drive Social key is **Full access or Read-only**. If it is full, ask
   them to reissue it read-only. That is a normal, reasonable request.
2. If Drive Social is **no longer an active vendor, revoke the key.** Access persists until
   someone actively removes it.
3. Issue **a separate key for the website**, so either can be revoked without breaking the other.
   Never share one key between vendors.

> **Note on due diligence:** searching "Drive Social Media lawsuit" surfaces a large cluster of
> near-identical articles alleging FTC action and class actions. Those contain no case numbers,
> no plaintiffs, no courts, and contradict each other; nothing corroborates them on ftc.gov, the
> Missouri AG site, or court records. They appear to be auto-generated SEO content. **Do not
> repeat those claims to the client.** The real, sourced complaint pattern is ordinary agency
> contract and billing disputes.

---

## 5. What the company record settles (this is the valuable part)

`GET /company` is Trinity's own operational record — the data they actually dispatch trucks
from. It answers questions that were blocking launch.

| Field | Value | Impact |
|---|---|---|
| **Address** | 18125 US-41, Suite 208, Lutz FL 33549 | ✅ Confirms `CLIENT-ASKS #3`. Matches what we had. |
| **Geo** | 28.1372004, -82.4625826 | Can now add `geo` to LocalBusiness JSON-LD. |
| **Phone** | **(813) 279-6785** | ✅ Settles `P1-1`. The Pasco number we already use sitewide **is** their primary. |
| **Email** | trinitygaragedoorservice@gmail.com | ✅ Answers `CLIENT-ASKS #6`, though it is a Gmail. Worth proposing a domain address. |
| **Website** | http://www.trinitygaragedoorservice.com/ | Note `http` and `www`. Update after cutover. |
| **Time zone** | America/New_York | |
| **Arrival window** | **120 minutes** | Real, quotable fact for booking copy. |
| **Service area** | **130 ZIP codes** | See below. Big deal. |

### The service area is far larger than the site claims
130 ZIPs across **5 counties and 41 distinct cities**. The site has pages for **6**.

Full mapping saved to **`lib/service-area-zips.json`**, verified **130/130 against the live API**
with no gaps or extras.

| County | ZIPs | Anchor cities |
|---|---|---|
| Hillsborough | 47 | Tampa (27), Brandon, Riverview, Valrico, Plant City, Lutz, Odessa |
| Pinellas | 47 | St. Petersburg (16), Clearwater (9), Largo (5), Palm Harbor, Seminole |
| Pasco | 22 | New Port Richey (4), Wesley Chapel, Land O Lakes, Zephyrhills, Hudson |
| Hernando | 9 | Brooksville (5), Spring Hill (4) |
| Polk | 5 | Lakeland |

**Biggest markets with no page at all**, by ZIP count: St. Petersburg (16), Clearwater (9),
Largo (5), Lakeland (5), Brooksville (5), Spring Hill (4), New Port Richey (4). By population,
the standouts are **St. Petersburg (~357k), Clearwater (~183k), Lakeland (~161k), Spring Hill
(~115k)** and the fast-growing, install-heavy **Riverview** and **Wesley Chapel**.

Three ZIPs are **not real residential markets** and should be excluded from any city targeting:
`33620` (USF campus), `33621` (MacDill AFB), `33744` (Bay Pines VA, population 55).

**Two consequences:**
1. The "6 cities" stat **badly understates their coverage.** 35 cities are invisible to search.
2. **The service-area checker (`P3-1`) no longer needs a Google Maps API key.** A plain ZIP lookup
   against this list costs **$0** with no external dependency, no billing account, and no client
   account access. That supersedes the Places/geocoding plan in
   `handoff/SERVICE-AREA-CHECKER-RESEARCH.md`.

> Naming gotchas if we build address matching: USPS spells them **"Saint Petersburg"** and
> **"Land O Lakes"** (no apostrophe). ZIP `34655`'s USPS city is New Port Richey even though
> locals call it **Trinity** — notable given the client's own name. ZIP `33559` straddles the
> Hillsborough/Pasco line; we assign it Lutz/Hillsborough.

---

## 6. Team roster (from `/employees`)

| Name | Role | Active |
|---|---|---|
| Jason Grunder | admin | ✅ |
| Simone Cameron | admin | ❌ |
| Barbara Fernandez | admin | ❌ |
| Tyler Grunder | field tech | ✅ |
| Jonah Grunder | field tech | ✅ |
| David Keifer | field tech | ✅ |
| Bryce Diesz | field tech | ✅ |
| Joey Rodriguez | field tech | ❌ |

⚠️ `CLIENT-NOTES.md` currently lists the team as "Andre, David, Joey, Jonah". **Andre is not in
Housecall Pro at all, and Joey is inactive.** If we ever build a "meet the team" section, use
this roster and confirm with Jason first.

---

## 7. Lead attribution — already solved

`/lead_sources` holds **70** configured sources, and several are already website-related:

> **Trinity Website**, ONLINE, Website Builder, Google, Google Ads, Google Local Services,
> Google Maps, Reserve with Google, Facebook, Trinity FaceBook, Yelp, Angi Leads, BBB, Next Door,
> Bing, Referral, Repeat, Existing customer, Trinity Truck, Trinity Business Card, Thumbtack,
> HouseCall App, HouseCall Marketplace, Chat GPT, AI Google, CSR AI, Reddit

So when we push a website lead in, we can tag it **"Trinity Website"** and Jason's existing
reporting picks it up with no new setup. Their tracking discipline is genuinely good.

### The `/leads` object shape
```
id, number, customer, address, lead_source, status, pipeline_status,
tags, total_amount, assigned_employee, conversions, lost_at, job_fields,
company_name, company_id

customer -> id, first_name, last_name, email, mobile_number, home_number,
            work_number, company, notifications_enabled, lead_source, notes,
            kind, created_at, updated_at, tags
address  -> id, street, street_line_2, city, state, zip
```

This maps almost exactly onto our `/contact` form fields. **`P3-3` lead sync is now a small job,
not a Zapier subscription.**

### Where an API-created lead actually lands
**"API Leads" is a first-class Job Inbox channel** in Housecall Pro, alongside Online Booking,
Lead Form, Angi, Thumbtack, Yelp and Reserve with Google. So a lead we `POST` shows up in
**Job Inbox → Pipeline → New Lead**, and Jason gets a text notification — the same place and the
same workflow as every other lead he already handles. No new habits to learn. That is the whole
argument for doing this.

### Why we should NOT use Zapier here
HCP's certified Zapier integration is far narrower than its reputation suggests: **2 triggers
(job scheduled, job completed) and exactly 1 action — "Create Customer."** It cannot create a
Lead, a Job, or an Estimate, and it does not expose a Lead Source field. It would put a bare
contact record in the customer list, *not* a lead in the Job Inbox. Since MAX is already paid
for, going direct to the API is both cheaper and strictly more capable.

### Attribution for booking buttons: "Tracking Attributes"
There is **no documented query-parameter prefill** on `book.housecallpro.com` URLs. Attribution
works differently: in HCP you generate **multiple named booking links**, each carrying a tracking
attribute, and whatever books through a given link gets tagged with it.

**What that means for us:** if Jason generates one booking link per service page (repair,
installation, replacement, opener, spring, etc.), we can wire each page's Book Online button to
its own link and he gets per-page booking attribution for free. Worth asking for.

### HCP's own embeddable Lead Form
HCP has a native **Lead Form** (Settings → Leads) with a copy-paste embed. We are not using it —
our `/contact` form is on brand, validated, and already writes to D1 and Resend. Noted only so
nobody proposes replacing a working form with an iframe. One genuine gotcha if it ever comes up:
**every field you enable on HCP's form becomes required.**

### Plan pricing, confirmed from HCP's published page (2026)
Basic **$59/mo** · Essentials **$149/mo** · MAX **$299/mo** (annual billing; month to month is
$79 / $189 / $329). Open API access is a **MAX-only** line item, which is what pins Trinity to
that tier.

---

## 8. The booking widget (client supplied 2026-07-28)

```html
<button data-token="553b811f320d494ba49a5230d63fb168"
        data-orgname="Trinity-Garage-Door-Service-Inc---Lutz"
        class="hcp-button" onClick="HCPWidget.openModal()">Book online</button>
<script async src="https://online-booking.housecallpro.com/script.js?token=553b811f320d494ba49a5230d63fb168&orgName=Trinity-Garage-Door-Service-Inc---Lutz"></script>
```

Hosted fallback URL (note the new `?v2=true`):
`https://book.housecallpro.com/book/Trinity-Garage-Door-Service-Inc---Lutz/553b811f320d494ba49a5230d63fb168?v2=true`

This unblocks **`P3-2`**. We fetched and read `script.js` in full, so the following is verified
against the real source, not documentation.

### ⚠️ Our existing TODO names an API that does not exist
`components/book-online-button.tsx:33` currently guesses:
```ts
if (window.HousecallPro?.openBooking) return window.HousecallPro.openBooking();  // ❌ not real
```
**There is no `window.HousecallPro`.** The real global is `window.HCPWidget`, with exactly two
methods. Fix this comment when implementing.

| Method | Effect |
|---|---|
| `HCPWidget.openModal()` | Shows the overlay, posts `"hcp:open"` to the iframe |
| `HCPWidget.openModalWithParams(params)` | Same, but posts `{type:"hcp:open", params}`. The accepted keys are **opaque/undocumented** — cross-origin, would need probing. |

### How the script actually behaves
- It injects `<div class="hcp-widget">` into `<body>` containing an `<iframe class="hcp-iframe">`
  pointed at the booking URL, plus an **unscoped `<style>` tag** in `<head>`. It builds the
  iframe URL itself and **hardcodes `?v2=true`** — v2 is not a choice, it is simply what today's
  script produces. Verified: the booking page returns byte-identical HTML with or without the
  param, so `v2` is a client-side flag the SPA reads at runtime.
- **It does NOT auto-bind clicks.** Grepping the source for `"click"` returns zero matches. The
  `.hcp-button` class is only used to *read config* and to apply HCP's default blue-pill styling.
  So an explicit handler is required, and we keep our own button styling.
- `data-token` / `data-orgname` on the button are **optional** — the script falls back to the
  `?token=&orgName=` querystring on its own `<script src>`. So we can mount the script once in
  `app/layout.tsx` and no component needs those props.
- **A page URL containing `?booking` auto-opens the modal.** Useful for deep links and for email
  or ad campaigns that should land straight in the booking flow.
- `window.HCPWidget` is only assigned at the **end** of init, and init bails early if the token
  fails to resolve. So `window.HCPWidget.openModal()` can throw. **Keep the current
  `window.open(SITE.bookingHref)` as the fallback branch** — that makes the upgrade purely
  additive with no regression.

### postMessage traffic
Parent → iframe: `"hcp:open"`, `{type:"hcp:open", params}`.
Iframe → parent: `"hcp:close"`, `"hcp:iframe-loaded"`, `{type:"hcp:redirect", url}`.

**There is no "booking completed" event.** So for conversion tracking, do *not* try to listen for
one. Instead use HCP's dashboard setting **Online Booking → booking redirect**, point it at a
`/book-a-repair/thank-you/` page we build, and fire analytics there. Standard, robust, no
dependency on undocumented internals.

> Security note on HCP's script (theirs, not ours, and not fixable by us): its `message` handler
> **never checks `event.origin`**, and it turns `{type:"hcp:redirect", url}` into
> `window.location.href = url`. Any script that can post a message into our top window could
> force a navigation. Worth knowing; not a reason to avoid the widget.

### CSP: safe today, but note for later
Our current policy is only `frame-ancestors 'self'; base-uri 'self'; form-action 'self'`. None of
those govern loading their script or iframing their page, and `script-src`/`frame-src` are absent
(an absent directive is simply not enforced). **The widget works today.**
When the planned `script-src` pass lands it must allowlist:
- `script-src https://online-booking.housecallpro.com`
- `frame-src https://book.housecallpro.com`

### Prefill: not via URL parameters
We grepped the 651KB booking bundle. No `first_name`, `email`, `phone`, `lead_source` or
`prefill` parameter names appear; only weak hits for `source`/`campaign`. Combined with HCP's
docs describing pre-generated **tracking-attribute links** rather than query params, treat
URL prefill as **unsupported**. `openModalWithParams()` remains the only possible prefill route
and its schema is undocumented.

---

## 9. Key handling and safety rules

### How HCP keys are actually scoped (important)
- **Two permission levels only: Full access or Read-only.** Chosen at creation, account-wide.
- **There is no per-resource scoping.** No "customers only" or "jobs only" key.
- **Read-only still sees everything.** The toggle limits writing, not visibility. A read-only key
  still reads all 6,001 customer records. HCP's own docs describe handing over a key as giving
  *"a backdoor to all of the data in your Housecall Pro account."*
- Keys are **Admin-only** to create, at **My Apps → API Key Management**. You can create several,
  name them, and delete any one individually via the trash icon.
- **There is no per-key usage audit log.** You cannot self-serve check whether a key was used, by
  whom, or from where. Key hygiene is the only real control — worth telling the client plainly.
- **Card data is not reachable** (Stripe-tokenized, AES-256). Worst case on a leak is customer
  PII plus financial records, not payment credentials. Still serious.
- **Rate limits are undocumented.** Build with retry and backoff regardless.

### Storing it in this app
Treat it exactly like `RESEND_API_KEY` / `TURNSTILE_SECRET_KEY` already are:

```bash
# local dev
echo 'HOUSECALL_PRO_API_KEY=...' >> .dev.vars      # gitignored

# production
npx wrangler secret put HOUSECALL_PRO_API_KEY       # encrypted, not readable back
pnpm run deploy                                     # required for the Worker to pick it up
```

**Never `NEXT_PUBLIC_*`** — Next inlines those into the browser bundle at build time, which would
publish the key to every visitor. Read it from `process.env` **only inside a route handler**.

### Writing to the account
The account is **live production with 6,001 real customers, and there is no sandbox.**

- **Reads are safe. Writes are not, until proven.** Creating a customer or job may trigger a real
  SMS or email to a real person, and that cannot be recalled.
- Any test record must use the reserved fictional phone range (**555-01xx**), an obviously fake
  name, and notifications disabled.
- Search before create, or we will duplicate customers who already exist in their database.

---

---

## 10. ⭐ Live availability EXISTS — the biggest finding

This overturns a conclusion this project has carried since June. **A real, on-site booking
calendar backed by genuine open slots is buildable.**

### `GET /company/schedule_availability` — their configured booking hours
```
Mon to Fri  08:00 to 16:00      Sat + Sun  closed      availability_buffer_in_days: 0
```
⚠️ **This is a third answer on the hours question.** Google says Mon to Sat 7am to 9pm, their
front door says Mon to Fri 8am to 5:30pm, and the system that actually takes bookings says
**Mon to Fri 8am to 4pm**. Worth raising: whatever Jason says the hours are, HCP is what
governs real bookings.

### `GET /company/schedule_availability/booking_windows` — live open slots
Tested live with `?show_for_days=7`. Returned **96 bookable windows** of 30 minutes each.

```json
{ "start_time": "2026-07-28T12:00:00.000Z",
  "end_time":   "2026-07-28T12:30:00.000Z",
  "available":  true }
```

Times are **UTC**: `12:00Z` to `20:00Z` is exactly 08:00 to 16:00 Eastern, matching the
configured hours. HCP describes this as based on *"the organization's Online Booking settings and
actual open time slots per employee."*

Parameters: `show_for_days` (default 7), `start_date`, `service_id`, `service_duration`,
`price_form_id`, `employee_ids`.

**One caveat before anyone builds on it:** all 96 windows came back `available: true`, with zero
unavailable. That either means they genuinely have open capacity, or the flag is not reflecting
booked work in this call. **Re-test with `service_id` and `employee_ids` and compare against
their actual dispatch board before trusting it as live truth.**

### `/job_fields/job_types` — only two bookable services
`Install` (`jbt_7f83c5d116374e0a9f460316cd7dd074`) and `Repair`
(`jbt_b2adbe129a3442289143f91a71b58f66`). Note the path is nested under `job_fields`.

**What this unlocks:** a branded on-site booking flow showing real next-available times, rather
than handing visitors off to HCP's iframe. That is a materially better experience. It is also a
much larger build than the modal, and it means owning a booking UI we currently get for free.
**Recommendation: ship the modal first, then evaluate this as a separate, deliberate project.**

---

## 11. Write schemas (for lead sync)

Sourced from HCP's OpenAPI spec, cross-validated against live route probes. **Not yet exercised
with a real write.**

**`POST /leads` is the right endpoint for a contact-form submission.** Unlike jobs, it accepts an
**inline customer object**, so a brand-new lead is one call with no pre-existing customer needed:

```json
{ "customer": { "first_name": "Jane", "last_name": "Doe", "email": "…",
                "mobile_number": "…", "notifications_enabled": false,
                "addresses": [{ "street": "…", "city": "…", "state": "FL", "zip": "…" }] },
  "lead_source": "Trinity Website",
  "note": "Message from the contact form",
  "tags": ["Website Lead"] }
```

- `POST /jobs` requires an existing `customer_id` **and** `address_id` — wrong fit for a cold lead.
- `POST /leads/{id}/convert` with `{"type":"job"}` or `{"type":"estimate"}` handles conversion later.
- Lead `status` enum: `open` / `won` / `lost`. Live data shows **open (222) and won (37)**;
  `pipeline_status` mirrors it as "New Lead" / "Won".
- **Verified live:** `GET /customers?q=…` is the search param. `search=`, `email=` and `name=` are
  **silently ignored** and return all 6,001. `q=` matches on email and phone, so it works for
  dedupe. **There is no idempotency key** — always search before create.
- **`GET /leads` filters** work on `status`; `pipeline_status` is not a filter.

### Cleanup has no API path
**There is no `DELETE` for customers, jobs, leads or estimates.** Deleting a test record means a
human clicking in the HCP web app. Deletes there are soft and restorable, and none of them notify
the customer.

**Notification rules that matter:**
- Creating a customer or lead does **not** notify anyone.
- **Scheduling a job DOES text and email the customer.** Leave test jobs unscheduled.
- **Never "Cancel" a job** — it is the one action guaranteed to text and email.
- Use `notifications_enabled: false`, `@example.com`, and a phone in the reserved fictional range
  **555-0100 to 555-0199** (not 555-1212, which is real directory assistance).

### Webhooks
`POST /webhooks/subscription` exists, plus UI setup at Settings → My Apps → Webhooks, which issues
a signing secret. Events include `lead.created`, `lead.converted`, `job.created`, `job.completed`,
`invoice.paid` and ~35 more. The exact signature header and algorithm are **unverified** — confirm
against a real payload before writing verification code.

---

---

## 12. Useful queries (read only, already proven)

Auth: `Authorization: Token $KEY`, base `https://api.housecallpro.com`. All of these were run
during the audit — they work and they answer real business questions.

| Question | Query |
|---|---|
| Which marketing actually produces work | `GET /jobs?page_size=100&page=N` → count `lead_source` |
| **Where the trucks actually go** | `GET /jobs?page_size=100&page=N` → count `address.city`. **This is the honest basis for choosing city pages** — it inverted a Census-based ranking |
| Are jobs big enough to justify financing | `GET /jobs...` → bucket `total_amount` (it is in **cents**) |
| How far back the data goes | `GET /jobs?page_size=1&sort_by=created_at&sort_direction=asc` |
| Dedupe a lead before creating | `GET /customers?q=<email or phone>` |
| Their real booking hours | `GET /company/schedule_availability` |
| Live open slots | `GET /company/schedule_availability/booking_windows?show_for_days=7` |

**Aggregate, never retain.** These pull real customer records. Count and discard; do not write
customer rows into the repo or into any doc.

**What the queries showed (2026-07-28):** the website produced **1 of the 300 most recent jobs**;
repeat customers are **49%**; median job **~$855** with **36% over $1,000**; and the biggest
cities with no page are New Port Richey 4.6%, Zephyrhills 3.3%, Odessa 3.3%, **Trinity 3.0%**.
Full analysis in `UPGRADE-PLAN.md`.

---

## Changelog
- **2026-07-28** ⭐ **Correction: live availability DOES exist.** Found
  `/company/schedule_availability/booking_windows` (96 real slots) and `/job_fields/job_types`.
  An earlier sweep called the root-level paths, 404'd, and wrongly concluded the feature was
  absent. Also captured booking hours (Mon to Fri 8 to 4), write schemas, and the `?q=` search
  param.
- **2026-07-28** Created. Both keys verified live. Confirmed `/leads` exists, 130-ZIP service
  area, `/events` exposes staff personal calendars, and that a marketing agency holds
  full-access credentials.
