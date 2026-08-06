import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { ROUTES, AREAS } from "@/lib/site";
import { REQUEST_FORMS, USE_REQUEST_FORM } from "@/lib/booking";
import { getAllPosts } from "@/lib/blog";

/**
 * Every indexable route. Derived from ROUTES / AREAS / the blog index rather than hand listed, so
 * a new page cannot silently go missing from the sitemap.
 *
 * ⚠️ **No `priority`, no `changeFrequency`, and no blanket `lastModified`.** Google has stated
 * publicly that it ignores the first two, so they were pure noise. `lastModified` was worse than
 * noise: it was set to the build timestamp for EVERY url, which told Google that all 45 pages
 * changed every time we deployed. Google only trusts lastmod when it is consistently accurate, so a
 * value that is always "now" teaches it to disregard ours. Blog posts carry their real date; every
 * other page omits it rather than lying.
 *
 * ⚠️ `/book-a-repair/thank-you/` is deliberately absent. It is `noindex` and exists only to catch
 * Housecall Pro's booking redirect. Do not add it.
 *
 * ⚠️ **`/book-a-repair/` is absent too, and conditionally so.** With `BOOKING_MODE` set to `"form"`
 * that route 301s to the repair request form, and a URL that redirects has no business in a
 * sitemap: it tells Google to crawl something we have already told it not to have. The request form
 * pages take its place below. Flip the constant back and the entry returns with the page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Plain paths. Nothing else, because nothing else survives to the output.
  const paths: string[] = [
    ROUTES.home,

    // Services
    ROUTES.services, ROUTES.repair, ROUTES.emergency, ROUTES.spring, ROUTES.opener,
    ROUTES.offTrack, ROUTES.cablesRollers, ROUTES.tuneUp, ROUTES.installation, ROUTES.replacement,

    // Service areas
    ROUTES.serviceAreas,
    ...AREAS.map((a) => `/service-areas/${a.slug}/`),

    // Doors
    ROUTES.doorTypes, ROUTES.brands, ROUTES.brochures,

    // About
    ROUTES.aboutStory, ROUTES.portfolio, ROUTES.reviewsPage,

    // Convert
    ROUTES.contact, "/get-service/",
    ...(USE_REQUEST_FORM
      ? REQUEST_FORMS.map((f) => `/get-service/${f.slug}/`)
      : [ROUTES.bookRepair]),

    // Resources
    ROUTES.blog, ROUTES.faq, ROUTES.safetyTips, ROUTES.troubleshooting,

    // Legal
    ROUTES.privacy,
  ];

  // Blog posts DO get a lastmod, because we have a real date for them. `date` is month precision
  // ("2026-03"), which is honest: it is the month the post was published, not a fabricated instant.
  const posts = getAllPosts().map((p) => ({
    url: absoluteUrl(`${ROUTES.blog}${p.slug}/`),
    ...(p.date ? { lastModified: new Date(`${p.date}-01`) } : {}),
  }));

  return [...paths.map((path) => ({ url: absoluteUrl(path) })), ...posts];
}
