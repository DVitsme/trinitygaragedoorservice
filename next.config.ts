import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Designs use trailing-slash URLs everywhere (handoff F1).
  trailingSlash: true,
  // next/image optimization doesn't run on Cloudflare Workers by default (handoff G4).
  images: { unoptimized: true },
  async redirects() {
    return [
      // Canonical off-track slug — repair IA wins (handoff G2).
      { source: "/services/off-track/", destination: "/services/repair/off-track/", permanent: true },
      // Section parents with no index page (handoff F2).
      { source: "/about/", destination: "/about/our-story/", permanent: true },
      { source: "/doors/", destination: "/doors/types/", permanent: true },
      // Old-site duplicate home.
      { source: "/home/", destination: "/", permanent: true },
      // TODO (handoff G7): add the full legacy WordPress -> new IA 301 map once
      // the destination pages exist (e.g. /garage-door-types/ -> /doors/types/).
    ];
  },
};

export default nextConfig;

// Sets up the Cloudflare platform (D1 + env bindings via getCloudflareContext()) for
// `next dev`. It is a no-op during `next build`, so calling it unconditionally is safe.
initOpenNextCloudflareForDev();
