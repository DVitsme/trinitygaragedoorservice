/**
 * Absolute-URL helper for sitemap.ts, robots.ts, and JSON-LD.
 *
 * The fallback is the real production origin on purpose: if NEXT_PUBLIC_SITE_URL is missing at
 * BUILD time, a staging fallback would publish a sitemap and structured data on the wrong host
 * while page canonicals point at the live domain, which is exactly the mismatch that breaks
 * indexing. NEXT_PUBLIC_* are inlined at build time, so set it in .env.local before deploying.
 *
 * (A `pageMetadata()` helper used to live here. Every route declares its own `metadata` literal
 * with a hardcoded canonical, so the helper had zero callers and was removed rather than left as
 * a competing second pattern.)
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://trinitygaragedoorservice.com";

export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}
