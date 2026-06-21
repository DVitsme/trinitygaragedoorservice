import { SITE, CITIES } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * LocalBusiness schema for local SEO. Rendered once in the root layout.
 * TODO once NAP is confirmed: add street address + geo. Do NOT add aggregateRating
 * until reviews are real (Google penalizes unverified review markup).
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
      addressLocality: "Lutz",
      addressRegion: "FL",
      addressCountry: "US",
    },
    areaServed: CITIES.map((c) => ({ "@type": "City", name: `${c.name}, FL` })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    sameAs: [SITE.instagram],
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
