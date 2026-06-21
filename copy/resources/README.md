# Trinity Resources + Legal Copy Deck

The Resources section (Safety Tips, DIY Troubleshooting, FAQ) plus a Privacy Policy. Together with the migrated blog (`content/blog/`), this closes the footer's "Resources" links, which were pointing at four dead routes.

## Pages
| File | Page | URL | How it was produced |
|---|---|---|---|
| `safety-tips.md` | Garage Door Safety Tips | /resources/safety-tips/ | **Light cleanup** of the client's existing page |
| `troubleshooting.md` | DIY Troubleshooting Guide | /resources/troubleshooting/ | **Light cleanup** of the client's existing page |
| `faq.md` | Garage Door FAQ | /resources/faq/ | **New**, brand voice (the old site had no FAQ) |
| `../legal/privacy-policy.md` | Privacy Policy | /privacy-policy/ | **New**, tailored template (the old site had none) |

## What "light cleanup" meant (safety-tips, troubleshooting)
Confirmed both pages still exist live (HTTP 200, in the Rank Math sitemap) and pulled from our verbatim discovery captures in `../../research/web-copy/`. Then: kept the content, structure, and SEO; stripped the repeated testimonials/brands/contact-form/footer boilerplate; fixed the rough grammar; and added inline links to the matching service pages (helps finding F6). Specific fixes:
- Safety Tips: tip 8 was mislabeled "Keep Fingers Away from Door Sections" (a duplicate of tip 9) but its content is about supervising the door as it closes, so it was retitled "Watch the door until it closes." Grammar tidied ("or even worst" -> "or worse," "specially" -> "especially," "accidently" -> "by accident").
- The old pages claimed "over 15 years"; reconciled to "since 2007" to match the rest of the site (see the founding-year decision).
- Not a full rewrite, per your choice. The prose stays close to the client's original.

## New pages
- **FAQ** is assembled in brand voice from the FAQs already written across the service, about, and doors decks, grouped (About Trinity / Repairs / New doors / Doors and brands / Pricing and payment). Pair it with `FaqJsonLd` to add FAQ schema (fixes finding F11). Group headings can become collapsible.
- **Privacy Policy** is a starting template tailored to what the site actually collects: the contact/estimate form (name, phone, email, city, service, message), storage in Cloudflare D1, Cloudflare Turnstile spam protection, and Resend email delivery. **It is not legal advice.**

## Routes & 301s
- `/garage-door-safety-tips/` -> `/resources/safety-tips/`
- `/diy-garage-door-troubleshooting-guide/` -> `/resources/troubleshooting/`
- FAQ and Privacy Policy are new (no old URL to redirect).
- No `/resources/` hub exists in the IA; the footer links the children directly. 301 `/resources/` to one of them if you want the bare path to resolve.

## Decisions / to do before launch
1. **Privacy Policy needs legal review.** Fill the bracketed placeholders (contact email, mailing address — tied to the open NAP decision) and the effective date. Update it if you add analytics, the Housecall Pro booking embed, or other third party tools. **Link it from the footer** (the footer currently has no privacy link).
2. **Footer links.** Once these ship, the footer's Resources column (Blog, Safety Tips, DIY Troubleshooting, FAQ) resolves. Add a Privacy Policy link to the footer legal line.
3. **Founding year** (2007 vs 2011) still applies here, same as the other decks.
4. **Icons.** The old Safety Tips and Troubleshooting pages used a small icon per item (captured in `../../research/images/`). Optional to recreate; not required.

## Status
With this, every footer/IA content gap is filled: Resources (blog + safety tips + troubleshooting + FAQ) and a Privacy Policy. Remaining optional pages: Terms of Service, Accessibility statement, a `/specials/` page (only when an offer is live), and a `/contact/` page (currently covered by `/get-service/` + phone).
