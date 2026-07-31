import { SITE, CITIES, SOCIAL } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * LocalBusiness schema for local SEO. Rendered once in the root layout.
 *
 * Still NO `aggregateRating`: Google penalises unverified review markup, and we have 8 of their 597
 * reviews. That stays out until the reviews are pulled properly.
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
    areaServed: CITIES.map((c) => ({ "@type": "City", name: `${c.name}, FL` })),
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
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
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
