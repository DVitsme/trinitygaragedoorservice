import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/**
 * Security headers. Set here rather than in `public/_headers`, which is a Cloudflare PAGES
 * convention and is not honored by the Worker this project deploys to.
 *
 * The CSP is deliberately limited to the directives that cannot break rendering. A full
 * `script-src` policy needs nonce plumbing through Next's inline bootstrap scripts, Google Fonts,
 * and the Turnstile widget, so it is left for a dedicated pass.
 */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; form-action 'self'" },
];

/** The 10 old WordPress brand pages all collapse into the single brands catalog. */
const LEGACY_BRANDS = [
  "amarr", "chamberlain", "chi", "clopay", "craftsman",
  "genie", "hormann", "liftmaster", "linear", "wayne-dalton",
];

const nextConfig: NextConfig = {
  // Designs use trailing-slash URLs everywhere (handoff F1).
  trailingSlash: true,
  // next/image optimization doesn't run on Cloudflare Workers by default (handoff G4).
  images: { unoptimized: true },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  async redirects() {
    return [
      // ── Canonical/internal tidy-ups ────────────────────────────────────────
      { source: "/services/off-track/", destination: "/services/repair/off-track/", permanent: true },
      { source: "/about/", destination: "/about/our-story/", permanent: true },
      { source: "/doors/", destination: "/doors/types/", permanent: true },
      // No /resources/ hub exists in the IA; send it to the blog.
      { source: "/resources/", destination: "/resources/blog/", permanent: true },

      // ── Legacy WordPress 301 map (site-audit/ARCHITECTURE-PROPOSAL.md §6) ──
      // Preserves rankings + backlinks at the domain cutover. Old inventory: site-audit/00-INDEX.md.
      { source: "/home/", destination: "/", permanent: true },
      { source: "/about-us/", destination: "/about/our-story/", permanent: true },
      { source: "/portfolio/", destination: "/about/portfolio/", permanent: true },

      // Services (old descriptive slugs → new nested IA)
      { source: "/services/garage-door-repair-and-service/", destination: "/services/repair/", permanent: true },
      { source: "/services/garage-door-spring-repair-and-replacement/", destination: "/services/repair/spring/", permanent: true },
      { source: "/services/garage-door-opener-repair-and-replacement/", destination: "/services/repair/opener/", permanent: true },
      { source: "/services/garage-door-off-track-repair-and-replacement/", destination: "/services/repair/off-track/", permanent: true },
      { source: "/services/garage-door-installation/", destination: "/services/installation/", permanent: true },
      { source: "/services/garage-door-replacement/", destination: "/services/replacement/", permanent: true },

      // Brands: hub + the 10 per-brand pages → the single catalog
      { source: "/brands/", destination: "/doors/brands/", permanent: true },
      ...LEGACY_BRANDS.map((b) => ({
        source: `/brands/${b}/`,
        destination: "/doors/brands/",
        permanent: true,
      })),

      // Doors + resources
      { source: "/garage-door-types/", destination: "/doors/types/", permanent: true },
      { source: "/brochure/", destination: "/doors/brochures/", permanent: true },
      { source: "/garage-door-safety-tips/", destination: "/resources/safety-tips/", permanent: true },
      { source: "/diy-garage-door-troubleshooting-guide/", destination: "/resources/troubleshooting/", permanent: true },

      // Conversion pages. The old "schedule a repair" form could not actually schedule; the real
      // Housecall Pro booking now lives on /book-a-repair/.
      { source: "/schedule-a-repair/", destination: "/book-a-repair/", permanent: true },
      { source: "/request-an-estimate/", destination: "/get-service/?intent=estimate", permanent: true },
      // TODO(client): no /specials/ page exists. Confirm whether promos return; until then → contact.
      { source: "/promo-discounts/", destination: "/contact/", permanent: true },

      // Blog: slugs are unchanged, only the prefix moves (/blogs/ → /resources/blog/).
      { source: "/blogs/", destination: "/resources/blog/", permanent: true },
      { source: "/blogs/:slug/", destination: "/resources/blog/:slug/", permanent: true },
    ];
  },
};

export default nextConfig;

// Sets up the Cloudflare platform (D1 + env bindings via getCloudflareContext()) for
// `next dev`. It is a no-op during `next build`, so calling it unconditionally is safe.
initOpenNextCloudflareForDev();
