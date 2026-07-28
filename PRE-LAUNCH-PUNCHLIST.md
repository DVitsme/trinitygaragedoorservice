# PRE-LAUNCH PUNCH LIST — Trinity Garage Door

**Everything outstanding before public go-live, ranked by importance.** Compiled 2026-07-07,
grounded in the current code (not memory) and validated against live Google / Housecall Pro
docs and current SEO/ADA guidance.

- **This is the master "what's left" tracker.** For the exact key/command runbook see
  **`LAUNCH-CHECKLIST.md`**; for the client-decision detail see the `trinity-open-decisions`
  memory; for the two shelved features see `handoff/SERVICE-AREA-CHECKER-RESEARCH.md` and
  `handoff/BOOK-A-REPAIR-HCP-BRIEF.md`.

## What "launch" means here
The site is **already built and live for preview** on the Cloudflare Worker
(`https://trinity-garage-door.derrick-2fd.workers.dev`, all pages 200). "Launch" =
**public go-live on `trinitygaragedoorservice.com`, retiring the WordPress site.** Every page
is static and renders with zero keys — the items below switch on the interactive features,
correct the placeholder facts, and cover the cutover.

## How to read the priorities
| Tier | Meaning |
|---|---|
| 🔴 **P0 — Blocker** | Broken or non-functional today, or the site can't do its core job (capture leads) at launch. |
| 🟠 **P1 — Critical** | Wrong/placeholder facts that mislead customers or hurt SEO, and the keys that switch on core features. Settle before public launch. |
| 🟡 **P2 — Recommended** | Polish, SEO/ops, trust, accessibility. Do before or right at launch; not strictly blocking. |
| 🟢 **P3 — Post-launch** | Explicitly deferred; each needs an external account/key or is a future feature. |

**Owner:** `CLIENT` = needs Jason/Simone (a decision, an account, or real content) · `DEV` = we
can do it · `BOTH` = client provides input, we implement.

---

## 🔴 P0 — Launch blockers

### P0-1 · Build the `/resources/*` pages (live footer 404s)
The footer on **every page** links to four pages that **404 in production right now**:
`/resources/blog/`, `/resources/safety-tips/`, `/resources/troubleshooting/`, `/resources/faq/`
(`components/sections/site-footer.tsx:13-16`; `ROUTES.faq` also points there). Dead links on
every page hurt trust and SEO.
- **Fix:** build the four pages from existing copy (`copy/resources/` + 13 posts in
  `content/blog/`) with a generic template, OR temporarily remove the footer links.
- **Owner:** DEV (copy already written) · **Effort:** M · **Blocked by:** nothing — can start now.

### P0-2 · Make the lead form actually deliver in production
`components/contact-form.tsx` → `app/api/contact/route.ts` writes email + D1 **best-effort**
(never throws), so a misconfigured production Worker shows the visitor "success" while
**silently dropping the lead** — the one thing a lead-gen site cannot do.
- **Needs:** Resend account + **verified sending domain**; set `RESEND_API_KEY`,
  `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` as Worker secrets (`wrangler secret put`); confirm
  the **remote D1 `leads` table** exists (`pnpm db:migrate`; DB `trinity-leads` is already
  bound). Verify with `wrangler secret list` + a real test submission after deploy.
- **Email deliverability [HIGH-RISK]:** add **SPF + DKIM + DMARC** (`p=none` to start) on the
  sending domain, or Resend mail lands in spam and the lead notifications vanish.
- **Owner:** BOTH (client: Resend signup + DNS · dev: secrets, migration, test) · **Effort:** M.

---

## 🟠 P1 — Critical

### A. Client facts to settle (placeholder values shipping today)
These are encoded tentatively in `lib/site.ts` and the copy. Confirm before cutover so nothing
is redone. Full context in the `trinity-open-decisions` memory.

| # | Decision | Shipping now | Why it matters | Owner |
|---|---|---|---|---|
| P1-1 | **Phone** — single vs 3 county lines | single `(813) 279-6785` (`SITE.phoneDisplay`) | wrong/!split number = lost calls; the old site had Hillsborough / Pasco / Pinellas lines | CLIENT |
| P1-2 | **Founding year** — 2007 vs 2011 | `foundedYear: 2007`, `yearsLabel "18+"`, "since 2007" sitewide | factual accuracy; state records say 2011; drives the stat + tagline | CLIENT |
| P1-3 | **Canonical NAP / address** | none (JSON-LD omits address/geo on purpose; Contact leads with "we come to you") | needed for `LocalBusiness` schema, Contact, Privacy; **NAP consistency [HIGH-RISK] for local SEO** | CLIENT |
| P1-4 | **Provisional stats** | `12k+` doors, `4.9★`, `18+` yrs, `6` cities (`STATS`, homepage) | never invent numbers — confirm real figures or soften the copy | CLIENT |
| P1-5 | **Office hours + public email** | hours in code as tentative (Mon–Sat 7–9, closed Sun, 24/7 emerg.); no contact email | Contact/schema correctness | CLIENT |
| P1-6 | **Brands install-vs-service split** | **data already corrected** in `BRAND_CATALOG` and rendered correctly on `/doors/brands/` | just needs Jason's sign-off; then delete the stale `BRANDS` export (P2-11) | CLIENT confirm |

> ✅ **Reviews are NOT an issue** — the 15-day-old note about "fake testimonials" is resolved:
> the homepage renders 4 real Google reviews (`app/page.tsx:52`) and `/about/reviews/` renders
> the 8 real `GOOGLE_REVIEWS`. No fabricated names render anywhere.

### B. Core-feature keys & SEO for the cutover

| # | Item | State | What's needed | Owner |
|---|---|---|---|---|
| P1-7 | **Housecall Pro booking URL** | `NEXT_PUBLIC_BOOKING_URL` unset → every "Book a Repair" / "Book Online" / "Confirm Booking" CTA falls back to `#book` (does nothing). **Core conversion path is dead.** | Get the URL from HCP **Settings → Booking → Online Booking → Booking page Link**, set the env var, rebuild. (Modal embed = P3-2.) *No MAX plan needed — validated.* | BOTH |
| P1-8 | **Real Turnstile keys** | always-pass **test** keys → no real spam protection on the lead form | Create the widget in Cloudflare → Turnstile; set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | BOTH |
| P1-9 | **Legacy WordPress 301 map [HIGH-RISK]** | `next.config.ts` has only 4 redirects; the full old-URL → new-IA map is a `TODO` (line 18) | Export the old WP URL list, map 1:1 (no chains) in `redirects()`. Skipping this drops rankings + backlinks overnight | BOTH |
| P1-10 | **Sitemap is incomplete** | `app/sitemap.ts` declares only **2 of ~33** URLs (`/`, `/get-service/`) | Extend to all real routes before submitting to Search Console | DEV — can do now |
| P1-11 | **Canonical / site URL at cutover** | every page's `canonical` is hardcoded to `trinitygaragedoorservice.com` (good), but `metadataBase` / `NEXT_PUBLIC_SITE_URL` default to a stale `*.pages.dev` / `workers.dev` host → OG URLs point at the wrong host | Set `NEXT_PUBLIC_SITE_URL=https://trinitygaragedoorservice.com` in `.env.local` **before** `pnpm run deploy` (it's baked at build time) | DEV — at cutover |

---

## 🟡 P2 — Recommended before launch

- **P2-1 · Rework the homepage "booking" mock.** `app/page.tsx:328-376` renders a **fake
  calendar hardcoded to "June 2026"** (now a *past* month) with fake time slots; "Confirm
  Booking" → `#book` (dead until P1-7). It reads as a broken widget. Replace with the real HCP
  button/embed or a clean CTA, and point the hero's `#book` link (`app/page.tsx:98`) at
  `/book-a-repair/` for consistency. **DEV.**
- **P2-2 · Homepage ZIP "check your area" mock is non-functional.** The service-area block has a
  decorative ZIP input that does nothing. Either simplify it so it doesn't look broken, or build
  the real checker (P3-1). **DEV.**
- **P2-3 · Analytics + Search Console.** Nothing is wired. Add **Cloudflare Web Analytics**
  (cookieless, no banner) and/or **GA4**; track `tel:` taps + form-submit as conversions
  (a lead-gen site with no attribution can't tell what pays); verify **Google Search Console +
  Bing**. **DEV.**
- **P2-4 · Google Business Profile [HIGH-RISK].** Maps is usually the #1 lead source for local
  trades. Claim + optimize; keep NAP identical to the site. **CLIENT.**
- **P2-5 · Favicon + apple-touch-icon (180×180) + `theme-color`.** None exist anywhere — the
  browser tab shows a blank default. **DEV** (needs a source mark).
- **P2-6 · Open Graph + Twitter share image (1200×630).** `lib/seo.ts` sets no OG image, so
  texted/shared links show no preview (big for local word-of-mouth). **DEV** (+ one image).
- **P2-7 · Custom branded 404 page.** No `app/not-found.tsx` — uses the bare Next default. **DEV.**
- **P2-8 · Security headers.** None configured. Add CSP, `X-Content-Type-Options`,
  `Referrer-Policy`, `X-Frame-Options`, HSTS (Cloudflare rule / `_headers` / `next.config`). **DEV.**
- **P2-9 · Accessibility WCAG 2.1 AA pass [HIGH-RISK].** No small-business ADA exemption
  (~3,100 federal web suits in 2025, most opening with $10–25k demand letters). Cover alt text,
  labeled fields, keyboard focus + visible focus ring, 4.5:1 contrast, logical headings; publish
  an **accessibility statement**; the optional Radix NavigationMenu/Accordion a11y upgrade (G8)
  fits here. **Do NOT install an accessibility overlay widget** (plaintiffs specifically target
  overlay sites). **DEV.**
- **P2-10 · Core Web Vitals pass.** Lighthouse the key templates; watch the hero video weight
  and image sizing (target LCP ≤2.5s, INP ≤200ms, CLS ≤0.1). **DEV.**
- **P2-11 · Dead-code cleanup in `lib/site.ts`.** The stale `REVIEWS` (fabricated samples) and
  `BRANDS` (wrong install/service relationships) exports are now unused — remove them so they
  can't be reused by accident. **DEV.**
- **P2-12 · Privacy policy review.** Template needs the real mailing address, effective date,
  and a contact email; name what the form/analytics actually collect; US needs no GDPR banner,
  but disclose GA4 cookies if used. **BOTH** (client/legal review).
- **P2-13 · Imagery.** Owner headshot is an **AI placeholder** (`public/assets/owner-jason-*`);
  no real team photos; before/after section has only "after" shots. Swap in real photos. **CLIENT.**
- **P2-14 · Blog build TODOs** (`content/blog/README.md`): dates are approximate; canonicalize
  the two duplicate "noises" posts; decide the Lutz post (301 → `/service-areas/lutz/` vs keep);
  write featured-image alt text; confirm the Shutterstock image license for the new domain. **BOTH.**
- **P2-15 · Image alt-text audit.** New build mostly has alts; sweep to confirm none are empty
  (the old site had 229 empty-alt images). **DEV.**

---

## 🟢 P3 — Post-launch / deferred (each needs an external key or is a future feature)

- **P3-1 · Google "are you in our area?" address checker.** Replaces the homepage ZIP mock.
  Needs a Google Maps key (**Places API (New)** + Maps JS; **legacy Autocomplete is closed to
  new customers — validated**). Card-on-file required but real spend ≈ $0 (10,000 free
  Essentials calls/mo; the old $200 credit was retired Mar 2025). Build plan:
  `handoff/SERVICE-AREA-CHECKER-RESEARCH.md`.
- **P3-2 · Housecall Pro modal embed upgrade.** `components/book-online-button.tsx` currently
  opens the booking URL in a new tab; upgrade to HCP's on-page **modal** once their embed
  snippet is added (`TODO(HCP)` in that file). Needs the HCP login.
- **P3-3 · HCP back-office lead sync (optional).** A MAX-plan API key could push `/contact`
  leads into Housecall Pro as customers/jobs. **Validated: the API is back-office only — it has
  no customer availability endpoint, so it cannot power a live in-page booking calendar.** Not
  worth MAX for booking; only for data sync.
- **P3-4 · Domain cutover mechanics.** Add `trinitygaragedoorservice.com` (+ `www`) as a Worker
  Custom Domain, point DNS, set the real `NEXT_PUBLIC_SITE_URL`, redeploy, then submit the
  sitemap to Search Console and spot-check the 301s. (Pairs with P1-9/10/11.)

---

## ✅ Unblocked — Claude can start these now (no client input, no keys)
1. **P0-1** Build the four `/resources/*` pages (copy exists) — kills the live footer 404s.
2. **P1-10** Complete `app/sitemap.ts` (all ~33 routes).
3. **P2-1 / P2-2** Rework the fake booking calendar + ZIP mock so nothing reads as broken.
4. **P2-5 / P2-6 / P2-7** Favicon set, OG share image, branded 404.
5. **P2-8** Security headers.
6. **P2-11** Delete the dead `REVIEWS` / `BRANDS` exports.
7. **P2-15** Alt-text sweep.
8. **Housekeeping:** 2 local doc commits are still unpushed to GitHub (`git push origin main`).

## Owner split at a glance
- **CLIENT must provide/decide:** phone, founding year, NAP/address, stats, hours + contact
  email, brand-split sign-off (P1-1…6); the HCP booking URL and Turnstile widget and Resend
  account (P0-2, P1-7/8); real photos (P2-13); Google Business Profile (P2-4); privacy/legal
  review (P2-12); the old-URL list for redirects (P1-9).
- **DEV owns everything else** and can begin the "Unblocked" list immediately.

---
*Validation date 2026-07-07. Google Maps + Housecall Pro facts re-confirmed against current
official docs; SEO/ADA guidance per Google Search Central, web.dev, W3C-WAI, ADA.gov. The two
integration research briefs in `handoff/` remain accurate as of this date.*
