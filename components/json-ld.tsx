import { SITE, CITIES, COUNTIES_SERVED, SOCIAL } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * LocalBusiness schema for local SEO. Rendered once in the root layout.
 *
 * ⚠️ **Still NO `aggregateRating`, and the case for leaving it out got STRONGER on 2026-08-13, not
 * weaker.** The site now claims "1,000+ reviews online" across six platforms. Do not be tempted to
 * put that number in markup because it is bigger: self serving review markup is ineligible for rich
 * results, and a total aggregated across platforms we do not own is LESS eligible than a single
 * platform figure, not more. The rating already shows in the Business Profile where searchers see
 * it.
 *
 * `sameAs` below is the machine readable version of the cross platform claim and it is enough. It
 * already lists all six named platforms plus two more.
 *
 * ✅ **NAP completed 2026-07-28/29.** Street address and geo now present, sourced from their own
 * Housecall Pro company record. Their absence was the HIGH-RISK local SEO gap in the punch list:
 * `LocalBusiness` without a street address is a much weaker entity signal, and this is a business
 * whose customers overwhelmingly arrive through local search.
 *
 * ✅ **Opening hours corrected.** This block previously declared `00:00` to `23:59`, seven days,
 * which told Google the business was **open 24 hours a day**. It is structured data Google can
 * republish, so it was the most exposed version of the 24/7 claim on the whole site. Hours now come
 * from `SITE.hours` and match what the client actually confirmed.
 */
export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${absoluteUrl("/")}#business`,
    name: SITE.legalName,
    image: absoluteUrl("/assets/logo-trinity-primary.png"),
    logo: absoluteUrl("/assets/logo-trinity-primary.png"),
    url: absoluteUrl("/"),
    telephone: "+18132796785",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.address.lat,
      longitude: SITE.address.lng,
    },
    // Counties first, then the towns with their own page. The counties come from the client's own
    // Google Business Profile service area, so this markup agrees with their Google record instead
    // of describing 6 towns out of 44. See COUNTIES_SERVED in lib/site.ts for why Manatee is absent.
    areaServed: [
      ...COUNTIES_SERVED.map((c) => ({ "@type": "AdministrativeArea", name: `${c}, FL` })),
      ...CITIES.map((c) => ({ "@type": "City", name: `${c.name}, FL` })),
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: SITE.hours.schemaDays,
        opens: SITE.hours.opens,
        closes: SITE.hours.closes,
      },
    ],
    // Every verified profile, so Google can tie these listings to one entity. Only profiles
    // confirmed to belong to this business are listed; Jason's personal LinkedIn is excluded.
    sameAs: [
      SOCIAL.instagram,
      SOCIAL.facebook,
      SOCIAL.google,
      SOCIAL.yelp,
      SOCIAL.bbb,
      SOCIAL.angi,
      SOCIAL.homeAdvisor,
      SOCIAL.nextdoor,
    ],
  };

  /**
   * The two branch locations, added 2026-08-13 alongside the footer change.
   *
   * ⚠️ **The Lutz entity above is untouched.** It holds the `@id` every other node references, the
   * geo, the hours, the areaServed and the sameAs profile list, which is the accumulated signal. A
   * branch must never be allowed to compete with it for canonical status, so each one below is a
   * separate node that points UP at Lutz via `parentOrganization`. That is the relationship Google
   * documents for a multi location business, and it is what keeps one entity with three addresses
   * from reading as three unrelated businesses.
   *
   * ⚠️ **Three things are deliberately absent from the branches, and each absence is a decision:**
   *
   * - **No `geo`.** Coordinates were never supplied for Oldsmar or Tampa. A guessed pin is worse
   *   than no pin, because Google will happily show it and a customer will drive to it.
   * - **No `openingHoursSpecification`.** `SITE.hours` describes when the phones are answered, which
   *   is a company wide fact, not a statement about a door being unlocked at either branch.
   *   Declaring hours for a location nobody has confirmed is staffed is exactly the claim that gets
   *   a listing suspended.
   * - **No `sameAs`.** Those profile URLs belong to the primary listing. Repeating them on a branch
   *   would tell Google all three nodes are the same profile.
   *
   * They DO carry `telephone`, using the one number Jason confirmed. See the note in
   * `SITE.locations` about why the county specific lines are not used here.
   */
  const branches = SITE.locations
    .filter((loc) => !loc.primary)
    .map((loc) => ({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${absoluteUrl("/")}#business-${loc.label.toLowerCase()}`,
      name: `${SITE.legalName} ${loc.label}`,
      parentOrganization: { "@id": `${absoluteUrl("/")}#business` },
      url: absoluteUrl("/"),
      telephone: "+18132796785",
      address: {
        "@type": "PostalAddress",
        streetAddress: loc.street,
        addressLocality: loc.city,
        addressRegion: loc.region,
        postalCode: loc.postalCode,
        addressCountry: SITE.address.country,
      },
    }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      {branches.map((b) => (
        <script
          key={b["@id"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(b) }}
        />
      ))}
    </>
  );
}

/** FAQPage schema — pair with <FaqAccordion> on service/resource pages. */
export function FaqJsonLd({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
