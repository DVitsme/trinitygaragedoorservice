# LAUNCH CHECKLIST — Trinity Garage Door (Next.js + OpenNext on Cloudflare)

Operational runbook for going live. The **site renders with zero keys** (every page is static) —
these only switch on the interactive features. Worker name: `trinity-garage-door`.
Live (preview) today: https://trinity-garage-door.derrick-2fd.workers.dev

> Deploy command is **`pnpm run deploy`** (NOT `pnpm deploy`, which is a reserved pnpm builtin).
> Wrangler is logged in as `derrick@digitaldog.io` (workers + d1 write).

---

## 1. Three external sign-ups (the only real API keys)

### A. Resend — sends the contact/estimate leads  *(required for form delivery)*
- Create an account at resend.com → **API Key** (`re_…`).
- **Verify a sending domain** (add the DNS records to Cloudflare) so the "from" address is on your domain.
- Decide the two addresses: `CONTACT_FROM_EMAIL` (on the verified domain, e.g. `no-reply@trinitygaragedoorservice.com`) and `CONTACT_TO_EMAIL` (where Jason/office receives leads).

### B. Cloudflare Turnstile — form spam protection  *(strongly recommended)*
- Cloudflare dashboard → **Turnstile** → add a widget for `trinitygaragedoorservice.com` → copy the **Site key** (public) and **Secret key**.
- Same Cloudflare account, no extra cost. (The current build uses Cloudflare's *test* keys — swap in the real ones.)

### C. Google Maps Platform — the address "are you in our area?" checker  *(required for that feature)*
- Google Cloud project + **billing account** (card on file; real spend ≈ \$0 at this traffic).
- Enable **Places API (New)** and **Maps JavaScript API**.
- Create an **API key**, then restrict it: **Application = HTTP referrers** → `https://trinitygaragedoorservice.com/*` (+ the workers.dev URL while testing); **API restriction** → Maps JS + Places only.
- ⚠️ Must use **Places API (New)** / `PlaceAutocompleteElement` — legacy Autocomplete is closed to new customers. See `trinitygaragedoorservice.com/handoff/SERVICE-AREA-CHECKER-RESEARCH.md`.

### NOT needed
- **Housecall Pro API key** — booking uses the *embed/URL*, not the API (the MAX-plan API is shelved; see CLAUDE.md). You only need the **booking URL** (below).
- **Stripe**, **reCAPTCHA** — unused (reCAPTCHA was replaced by Turnstile).

---

## 2. Every env var, where it goes, and the exact command

**Two kinds, and the difference matters:**
- 🌐 **`NEXT_PUBLIC_*` = baked in at BUILD time.** Put them in **`.env.local` BEFORE `pnpm run deploy`**. Setting them as Cloudflare runtime vars *after* a build will NOT reach the browser code.
- 🔒 **Server secrets/config = runtime.** Set on the Worker with `wrangler secret put` — **no rebuild needed**.

### 🌐 Build-time (in `.env.local`, then `pnpm run deploy`)
```ini
NEXT_PUBLIC_SITE_URL=https://trinitygaragedoorservice.com
NEXT_PUBLIC_BOOKING_URL=<Housecall Pro hosted booking URL — HCP → Online Booking → Share>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<Turnstile site key>
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<restricted Maps key>   # when the checker is built
```

### 🔒 Runtime secrets (set on the Worker)
```bash
pnpm exec wrangler secret put RESEND_API_KEY
pnpm exec wrangler secret put TURNSTILE_SECRET_KEY
pnpm exec wrangler secret put CONTACT_TO_EMAIL
pnpm exec wrangler secret put CONTACT_FROM_EMAIL
# verify what's set:
pnpm exec wrangler secret list
```
(`CONTACT_*` aren't secret, but `secret put` keeps the office email out of the committed repo.)

---

## 3. Cloudflare D1 (lead storage — already provisioned)
DB `trinity-leads` is wired in `wrangler.jsonc` (`database_id ef9d8b27-9eb3-4141-9127-da70f5260a14`). Create the leads table on the **remote** DB once:
```bash
pnpm db:migrate           # applies db/migrations/* to remote (needs wrangler login)
# inspect later:  pnpm exec wrangler d1 execute DB --command "SELECT * FROM leads"
```
(Email + D1 writes are best-effort — a provider hiccup never loses the lead, but until Resend + the table exist, the form shows success without delivering.)

## 4. Deploy
```bash
pnpm run deploy           # opennextjs-cloudflare build (bakes NEXT_PUBLIC_* from .env.local) + publish
```

## 5. Domain cutover (when retiring WordPress)
- Cloudflare → the `trinity-garage-door` Worker → **Custom Domains** → add `trinitygaragedoorservice.com` (and `www`).
- Point DNS at the Worker; set `NEXT_PUBLIC_SITE_URL` to the real domain and **redeploy** (it's build-time).
- The 301 redirect map from the old WordPress URLs lives in `site-audit/NAVBAR-SPEC.md` / `next.config.ts`.

---

## Go-live order (quick)
1. Resend key + verified domain + the two emails.
2. Turnstile widget (site + secret).
3. `wrangler secret put` the 4 runtime values; `.env.local` the NEXT_PUBLIC_* (Site URL + Booking URL + Turnstile site key).
4. `pnpm db:migrate` (remote leads table).
5. `pnpm run deploy` → test the contact form actually emails + stores.
6. (When built) Google Maps key → set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, redeploy.
7. Booking URL from HCP → set `NEXT_PUBLIC_BOOKING_URL`, redeploy → Book Online buttons go live.
8. Custom domain + DNS cutover; set real `NEXT_PUBLIC_SITE_URL`; redeploy.

## Still-open content decisions before launch (not keys)
Confirm phone/NAP/founding-year/real reviews — see the `trinity-open-decisions` project memory and CLAUDE.md "Unsettled facts".
