import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Phase 3 (SEO/go-live): add redirects() from site-audit/ARCHITECTURE-PROPOSAL.md §6
  // to 301 the legacy WordPress URLs, e.g.
  //   /services/garage-door-spring-repair-and-replacement/ -> /services/repair/spring/
  //   /home/ -> /
};

export default nextConfig;

// Sets up the Cloudflare platform (D1 + env bindings via getCloudflareContext()) for
// `next dev`. It is a no-op during `next build`, so calling it unconditionally is safe.
initOpenNextCloudflareForDev();
