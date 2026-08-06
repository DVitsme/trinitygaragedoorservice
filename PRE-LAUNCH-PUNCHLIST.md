# PRE-LAUNCH PUNCH LIST — Trinity Garage Door

**What is still outstanding before public go-live.** Living document.
Last updated: **2026-08-04** · Live preview: https://trinity-garage-door.derrick-2fd.workers.dev

> **This file lists only what is LEFT.** Finished work moves to the [Cleared log](#cleared-log) at
> the bottom so this stays a true to-do list.
>
> Companion docs: **`CLIENT-ASKS.md`** (what we need from Jason/Simone, meeting friendly) ·
> **`CLIENT-NOTES.md`** (what to tell them) · **`LAUNCH-CHECKLIST.md`** (exact keys and commands) ·
> **`MEDIA-INVENTORY.md`** (photo/video status and gaps).

## Status
Site is **built, deployed and healthy**: 50 pages, build green, **134 links / 0 broken**.
Nothing is broken on the site itself. **Everything remaining is either a client decision, an
external account/key, or optional polish.**

| Tier | Meaning |
|---|---|
| 🔴 **P0** | Site cannot do its core job (capture leads) at launch |
| 🟠 **P1** | Wrong or placeholder facts that mislead customers or hurt SEO |
| 🟡 **P2** | Polish, ops, trust, accessibility |
| 🟢 **P3** | Deferred; needs an external key or is a future feature |

**Owner:** `CLIENT` = needs Jason/Simone · `DEV` = we can do it · `BOTH` = client input, we implement

---

## 🔴 P0 — Launch blockers

### P0-2 · Make the lead form actually deliver
`components/contact-form.tsx` → `app/api/contact/route.ts` writes email and D1 **best-effort**
(never throws), so a misconfigured Worker shows the visitor "success" while **silently dropping
the lead** — the one thing a lead-gen site cannot do.
- **Needs:** Resend account + **verified sending domain**; `RESEND_API_KEY`, `CONTACT_TO_EMAIL`,
  `CONTACT_FROM_EMAIL` as Worker secrets; remote D1 table via `pnpm db:migrate`.
- **[HIGH-RISK] deliverability:** add **SPF + DKIM + DMARC** (`p=none` to start) or Resend mail
  lands in spam and the notifications vanish.
- **Owner:** BOTH · **Blocked by:** client Resend signup + DNS access (`CLIENT-ASKS` #5)

---

## 🟠 P1 — Critical

### A. Client facts still to settle
Encoded tentatively in `lib/site.ts`. Plain-language versions live in **`CLIENT-ASKS.md`**.

| # | Decision | Shipping now | Owner |
|---|---|---|---|
| P1-1 | **Phone — which number leads sitewide** | Contact page lists **all three county lines** ✅. Everywhere else still uses the Pasco number, while their trucks and BBB lead with Hillsborough. | CLIENT |
| P1-3 | **Canonical NAP / address** | JSON-LD omits address/geo on purpose. **Now verified from Trinity's own Housecall Pro record (2026-07-28): 18125 US-41 Ste 208, Lutz FL 33549, geo 28.1372004 / -82.4625826.** **[HIGH-RISK] for local SEO.** ⚠️ When this ships it must ALSO remove the now stale visible placeholder on `/contact/` ("Street address and map to be added once the business address is confirmed"), which currently tells customers the address is unknown when it is not. Marked with a `⚠️ STALE PLACEHOLDER` comment in `app/contact/page.tsx`. | CLIENT |
| P1-4 | **Provisional stats** | `12k+` doors, `4.9★`, `6` cities (years now derived from 2007 ✅). Note Google now shows **5.0 from 597 reviews**. | CLIENT |
| P1-5 | **Office hours + public email** | Hours conflict: Google says Mon–Sat 7am–9pm, their door says Mon–Fri 8am–5:30pm. No public email exists. | CLIENT |
| P1-6 | **Brand install-vs-service split** | Data already corrected in `BRAND_CATALOG` and rendering correctly. Needs sign-off only. | CLIENT |

### B. Keys still needed

| # | Item | State | Owner |
|---|---|---|---|
| P1-8 | **Real Turnstile keys** | Always-pass **test** keys, so no real spam protection on the form. Needs a widget in Cloudflare → Turnstile. | BOTH |

---

## 🟡 P2 — Recommended before launch

- **P2-3 · Analytics + Search Console.** Nothing is wired, so they cannot tell which marketing
  works. Add **Cloudflare Web Analytics** (cookieless, no banner) and/or GA4; track `tel:` taps and
  form submits as conversions; verify Search Console + Bing. **BOTH** (needs account access).
- **P2-4 · Google Business Profile [HIGH-RISK].** Usually the #1 lead source for local trades, and
  they already have **5.0 from 597 reviews**. Claim, optimise, keep NAP identical to the site. **CLIENT.**
- **P2-9 · Accessibility, broader WCAG 2.1 AA pass [HIGH-RISK].** Contrast failures are fixed;
  still to do: keyboard focus audit, an **accessibility statement** page, and the optional Radix
  NavigationMenu/Accordion upgrade (G8). **Do NOT install an accessibility overlay widget** —
  plaintiffs specifically target overlay sites. **DEV.**
- **P2-10 · Core Web Vitals pass.** Not yet measured. Watch the hero video weight and image sizing
  (target LCP ≤2.5s, INP ≤200ms, CLS ≤0.1). **DEV.**
- **P2-12 · Privacy policy review.** Needs the real mailing address, effective date and a contact
  email; should name what the form and analytics collect. **BOTH** (client/legal).
- **P2-15 · 🔴 There is no analytics on the site. None.** Verified 2026-07-28: zero `gtag`,
  `cloudflareinsights`, Plausible, Fathom, PostHog or anything else, in source or on the deployed
  Worker. At that point the only two scripts we loaded were Turnstile and the Housecall Pro booking
  widget. ⚠️ **Both halves of that sentence have since changed.** GTM shipped 2026-07-29
  (`GTM-NOTES.md`), and on 2026-08-04 booking was switched off, so **the HCP widget script is no
  longer mounted at all** (`app/layout.tsx` gates it on `BOOKING_MODE` in `lib/booking.ts`).
  **Consequence: nothing about this site is measurable** — not bookings, not the ZIP checker, not
  which pages produce leads. It is the reason `/book-a-repair/thank-you/` can only be counted
  roughly from server traffic rather than as a real conversion.
  **Recommendation: Cloudflare Web Analytics.** Free, the site already runs on Cloudflare, no
  cookies, no consent banner, no measurable speed cost, and it reports per path, which is exactly
  what the thank-you page needs. Blocked only on Cloudflare account access (**P1-x / `CLIENT-ASKS`
  #7**), decision at `CLIENT-ASKS` #36.
  ⚠️ **Ships together with a P2-12 edit**: the privacy policy currently promises *"if we add website
  analytics or advertising tools in the future, we will update this policy to describe them."*
  Turning analytics on without that edit makes the policy untrue. **DEV + CLIENT.**
- **P2-14 · Blog follow-ups.** Featured-image alt text is written ✅. Still open: real publish dates
  (ours are approximate month-precision, so `BlogPosting` schema deliberately omits
  `datePublished`); canonicalise the two near-duplicate "noises" posts; the Lutz post decision;
  confirm the Shutterstock licence covers the new domain. **BOTH.**

---

## 🟢 P3 — Post-launch / deferred

- ~~**P3-1 · Google "are you in our area?" address checker.**~~ ✅ **SHIPPED 2026-07-28, and
  deliberately NOT the way this said.** It needed no Google Maps key, no billing account and no
  runtime request: the check runs client side against `lib/service-area-zips.json` (verified
  130/130 against their live HCP zone) in 1,818 bytes gzipped. The old plan in
  `handoff/SERVICE-AREA-CHECKER-RESEARCH.md` is superseded by `SERVICE-AREA-REDESIGN.md`.
- ~~**P3-2 · Housecall Pro modal embed.**~~ ✅ Shipped 2026-07-28, then ⏸️ **SWITCHED OFF 2026-08-04**
  at the client's request. The code is intact and gated, not deleted: `book-online-button.tsx` still
  holds the whole `window.HCPWidget.openModal()` path and its `window.open` fallback, and the script
  mount is still in `app/layout.tsx`. It just does not load, so the 5,197 bytes it cost are no longer
  being spent. `BOOKING_MODE` in `lib/booking.ts` brings all of it back. See `LAUNCH-TODO` **6.9**.
- **P3-3 · HCP back-office lead sync (optional).** Zapier on the Essentials plan can push contact
  form leads into HCP. **The MAX API cannot power a live booking calendar** — validated.
- **P3-4 · Domain cutover.** Add `trinitygaragedoorservice.com` (+ `www`) as a Worker Custom
  Domain, point DNS, set the real `NEXT_PUBLIC_SITE_URL`, redeploy, submit the sitemap, spot-check
  the 301s.

---

## 🔧 Dev housekeeping (not launch blocking)

- **Unpushed commits.** Several local commits are not on GitHub yet (`git push origin main`).
- **Project skills are gitignored.** `.gitignore` ignores `/.claude/skills/`, so the 6 skills we
  built do not travel with the repo. Un-ignore if they should.
- **`/promo-discounts/`** currently 301s to `/contact/`; no `/specials/` page exists. Confirm.
- **`.env.local` carries ~11 dead keys** (Stripe, reCAPTCHA, shadcn, Stitch) left over from an
  older stack. Harmless but worth pruning.

---

## Cleared log

### 2026-07-28 — Real photography and profile links
| Item | Result |
|---|---|
| **P1-2** Founding year | **SETTLED.** Client confirmed **2007**. `FOUNDED_YEAR` in `lib/site.ts` is now the single source and the years-in-business figure derives from it, so it cannot go stale. Fixed a live bug: the site showed **18+** when 2026 minus 2007 is **19**. |
| **P2-13** Imagery | **DONE.** The **AI-generated owner photo is gone**, replaced with Jason's real studio portrait. Real team, fleet, job and technician photos placed sitewide. 53 curated images. Detail + remaining gaps: `MEDIA-INVENTORY.md`. |
| Before/after photos | **DONE.** Recovered 25 genuine pairs by splitting the client's fused composites. Homepage "Before photo coming soon" placeholder is gone. |
| Photo repetition | **DONE.** Six photos previously covered 13 pages; every page now has its own. |
| Footer profile links | **DONE.** Instagram, Facebook, Google, Yelp, BBB, Angi wired. `sameAs` schema went 1 → 8 profiles. |
| Contact phone lines | **DONE.** All three county numbers listed with their cities, tap-to-call. |

### 2026-07-27 — Resources build + launch-blocking fixes
Verified: build green (50 pages), linkinator **134 links / 0 broken**, all 17 new routes 200.

| Item | Result |
|---|---|
| **P0-1** Resources pages | **DONE + re-verified 2026-07-28.** `/resources/{faq,safety-tips,troubleshooting,blog}/` all return 200 live, the footer links to all four, and **13/13 blog posts return 200**. The sitewide footer 404s are gone. |
| **P1-7** Housecall Pro booking | ⚠️ **REVERSED 2026-08-04 at the client's request, and this row is now history.** Was: "real booking URL wired; every Book Online / Book a Repair CTA works." **Booking is switched off**, gated behind `BOOKING_MODE` in `lib/booking.ts` rather than deleted, and every one of those CTAs now points at a request form under `/get-service/`. `/book-a-repair/` 307s to `/get-service/repair/`. Reversal and full detail: `LAUNCH-TODO` **6.9**. |
| **P1-9** Legacy 301 map | **DONE.** Full WordPress map in `next.config.ts`. |
| **P1-10** Sitemap | **DONE.** 2 URLs → 45, derived from `ROUTES`/`AREAS`/posts. |
| **P1-11** Canonical / site URL | **DONE.** Was publishing a staging domain in robots/sitemap/JSON-LD while canonicals said the live domain. |
| **P2-1 / P2-2** Homepage mocks | **DONE.** Fake calendar (stuck on a past month) and dead ZIP input both replaced. |
| **P2-5 / P2-6 / P2-7** Brand assets | **DONE.** Favicon set, 1200×630 OG + Twitter image, branded 404. |
| **P2-8** Security headers | **DONE.** HSTS, nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy, conservative CSP. |
| **P2-9** Contrast | **PARTIAL → see P2-9 above.** All real axe failures fixed; remaining reports are false positives (axe cannot resolve the gradient hero). |
| **P2-11** Dead code | **DONE.** `REVIEWS`, `BRANDS`, `pageMetadata()` removed. |
| **P2-15** Alt text | **DONE (already clean).** 33 images, all with good alts. |
| Dead footer links | **DONE.** 4 dead `href="#"` socials + dead BBB link fixed; Privacy Policy link added. |
| Blog on Workers | **DONE.** Posts baked at build time; `fs` reads fail in the Worker. |

---
*Facts validated 2026-07-07 against Google Search Central, web.dev, W3C-WAI, ADA.gov, and current
Google Maps + Housecall Pro docs. Media and business-listing facts validated 2026-07-28.*
