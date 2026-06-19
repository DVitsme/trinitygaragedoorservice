import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default Cloudflare adapter config. Incremental cache / tag cache (R2/D1/KV) can be
// added here later if we adopt ISR; not needed for the static-first homepage.
export default defineCloudflareConfig({});
