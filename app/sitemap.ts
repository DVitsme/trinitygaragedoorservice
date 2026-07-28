import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { ROUTES, AREAS } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";

/**
 * Every indexable route. Derived from ROUTES / AREAS / the blog index rather than hand listed, so
 * a new page cannot silently go missing from the sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries: Array<{ path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }> = [
    { path: ROUTES.home, priority: 1, changeFrequency: "weekly" },

    // Services
    { path: ROUTES.services, priority: 0.9, changeFrequency: "monthly" },
    { path: ROUTES.repair, priority: 0.9, changeFrequency: "monthly" },
    { path: ROUTES.emergency, priority: 0.9, changeFrequency: "monthly" },
    { path: ROUTES.spring, priority: 0.9, changeFrequency: "monthly" },
    { path: ROUTES.opener, priority: 0.9, changeFrequency: "monthly" },
    { path: ROUTES.offTrack, priority: 0.9, changeFrequency: "monthly" },
    { path: ROUTES.cablesRollers, priority: 0.8, changeFrequency: "monthly" },
    { path: ROUTES.tuneUp, priority: 0.8, changeFrequency: "monthly" },
    { path: ROUTES.installation, priority: 0.9, changeFrequency: "monthly" },
    { path: ROUTES.replacement, priority: 0.9, changeFrequency: "monthly" },

    // Service areas
    { path: ROUTES.serviceAreas, priority: 0.8, changeFrequency: "monthly" },
    ...AREAS.map((a) => ({ path: `/service-areas/${a.slug}/`, priority: 0.8, changeFrequency: "monthly" as const })),

    // Doors
    { path: ROUTES.doorTypes, priority: 0.8, changeFrequency: "monthly" },
    { path: ROUTES.brands, priority: 0.7, changeFrequency: "monthly" },
    { path: ROUTES.brochures, priority: 0.6, changeFrequency: "monthly" },

    // About
    { path: ROUTES.aboutStory, priority: 0.7, changeFrequency: "monthly" },
    { path: ROUTES.portfolio, priority: 0.6, changeFrequency: "monthly" },
    { path: ROUTES.reviewsPage, priority: 0.7, changeFrequency: "monthly" },

    // Convert
    { path: ROUTES.bookRepair, priority: 0.9, changeFrequency: "monthly" },
    { path: ROUTES.contact, priority: 0.8, changeFrequency: "monthly" },
    { path: "/get-service/", priority: 0.7, changeFrequency: "monthly" },

    // Resources
    { path: ROUTES.blog, priority: 0.7, changeFrequency: "weekly" },
    { path: ROUTES.faq, priority: 0.7, changeFrequency: "monthly" },
    { path: ROUTES.safetyTips, priority: 0.6, changeFrequency: "monthly" },
    { path: ROUTES.troubleshooting, priority: 0.6, changeFrequency: "monthly" },

    // Legal
    { path: ROUTES.privacy, priority: 0.3, changeFrequency: "yearly" },
  ];

  const posts = getAllPosts().map((p) => ({
    path: `${ROUTES.blog}${p.slug}/`,
    priority: 0.5,
    changeFrequency: "monthly" as const,
  }));

  return [...entries, ...posts].map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
