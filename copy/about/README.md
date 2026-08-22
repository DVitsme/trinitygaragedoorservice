# Trinity About Copy Deck

> ⚠️ **REVIEW FIGURES IN THIS FILE ARE SUPERSEDED. Do not copy them into a page.**
> Any `4.9`, `598` or "Average Rating" below is stale. The live claims are, as of 2026-08-13:
> **`5.0 on Google`** (a Google only RATING, never presented as a cross platform average) and
> **`1,000+ reviews online`** (a cross platform COUNT across Google, Yelp, Angi, BBB, Facebook and
> Nextdoor). Source of truth: `components/blocks/trust-strip.tsx` and the `stats` array in
> `app/page.tsx`. Any page that states the count must leave the reader one click from
> `/about/reviews/`, where the platform breakdown is stated.

Three pages of new About section copy, written in Trinity's voice (warm, honest, local, family owned), to the same rules as the services deck. Voice and rules: `../services/_VOICE-AND-RULES.md`.

## Pages
| File | Page | URL |
|---|---|---|
| `our-story.md` | Our Story (main About page) | /about/our-story/ |
| `portfolio.md` | Portfolio / Our Work | /about/portfolio/ |
| `reviews.md` | Reviews | /about/reviews/ |

Each file opens with page title, slug, meta title, and meta description, then the body with section headers. `our-story.md` includes five FAQs (pair with `FaqJsonLd`). `portfolio.md` and `reviews.md` end with a clearly marked "Build notes" section that is guidance for the build, not page copy.

## Sources used
- Company facts and the owner's name (Jason Grunder) from `research/business-summary.md` and the old About page `research/web-copy/about-us.md`.
- The eight real, named Google reviews are reproduced verbatim from `research/web-copy/about-us.md` (also catalogued in `site-audit/01-homepage-and-company.md`).
- House style and voice from `copy/services/_VOICE-AND-RULES.md`.

## Quality checks
- Dash free in all page copy. No em dashes, no en dashes, no pause hyphens, no hyphenated compounds (we write "family owned," "wood look," "same day," "sun faded," "high pressure"). The only hyphens are in the license number GDI-09484 and the URL slugs, which are standard identifiers. The customer review quotes are reproduced verbatim and contain no dashes either.
- No AI tell phrases ("not just X, it's Y," "whether X or Y," "from X to Y," three item flourishes) and none of the banned buzzwords (seamless, robust, peace of mind, rest assured, elevate, etc.).
- Nothing invented. The owner (Jason) and the two technicians (David, Joey) are named only because real, published reviews already name them. No made up prices, warranties, stats, locations, or staff.

## Decisions to settle (carry over from the services deck, plus About specific)
1. **Founding year.** Copy says since 2007 (the logo tagline and the old About page). State records show 2011. Pick one sitewide.
2. **Team naming.** `our-story.md` and the reviews name Jason (owner), David, and Joey, drawn from real reviews. Confirm they're current team members before publishing, or we keep the crew section general.
3. **Owner and team photos.** The only owner image we have (`design-assets/owner-jason-grunder-AI-PLACEHOLDER.png`) is an AI placeholder. Our Story reads far better with a real photo of Jason and the crew. Get a real headshot and a team photo.
4. **Portfolio captions and before shots.** The ~30 photos in `public/portfolio/` have no captions or alt text, and most have no matching "before" photo. Write specific, honest captions per image before launch; present as finished work unless a real before and after pair exists.
5. **Google rating and review count.** The homepage uses 4.9. Confirm the live figure, or wire a live Google feed, before stating a hard number on the reviews page. (Ties to the JSON-LD `aggregateRating`, which is intentionally omitted until reviews are real.)
6. **`/about/` landing.** The locked IA and the navbar dropdown link straight to the three pages above, with no standalone `/about/` index. Simplest option is to 301 `/about/` to `/about/our-story/`. Flag if you want a real hub page instead.

## Next step
Either hand this to the build (type into the `app/about/our-story`, `/portfolio`, `/reviews` routes using the `components/ui` primitives, with `FaqJsonLd` on Our Story), or write the next copy set: service areas (6 cities + hub), doors (types, brands, brochures), or the three missing service pages (emergency, cables and rollers, tune up).
