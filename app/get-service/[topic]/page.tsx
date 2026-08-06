import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { REQUEST_FORMS, getRequestForm } from "@/lib/booking";
import { RequestFormLayout } from "@/components/blocks/request-form-layout";

/**
 * The per intent request forms, one static page per entry in `REQUEST_FORMS`.
 *
 * Added 2026-08-04 when Housecall Pro's booking modal was switched off and every booking CTA was
 * repointed here. **The reason there is more than one of these is measurement.** With a single
 * shared form page, every conversion looks identical: the thank you page cannot say whether someone
 * arrived from the spring repair page or the homepage, so nobody can tell which part of the site
 * actually produces work. That question is the whole reason this rebuild exists, given 1 of the
 * client's 300 most recent jobs carried the "Trinity Website" lead source.
 *
 * Each page therefore gives three things a shared page cannot:
 *   - a distinct URL, which is what Google Ads' Landing Page report and GA4 both key on
 *   - a distinct `leadSource`, which reaches the lead email, the D1 row and the dataLayer
 *   - a headline that says back what the visitor just clicked
 *
 * ⚠️ **These are additions beneath `/get-service/`, not a replacement for it.** That URL, and
 * `?intent=estimate`, are in the verified 301 map, the sitemap and Lloyd's Google Ads final URLs.
 * Neither may move.
 *
 * ## ⚠️ Do NOT add `export const dynamicParams = false;` here. It breaks the site on Cloudflare.
 *
 * It was here, and it took all eight of these pages down to **404 on the deployed Worker** while
 * they served fine under `next start`. `dynamicParams = false` makes Next write `fallback: false`
 * for this route into `prerender-manifest.json`, and OpenNext's router then fails to match the
 * prerendered paths, even though the pages are present in `.open-next/cache/` and listed as static
 * routes in that same manifest. The blog's `[slug]` route is unaffected because it leaves
 * `dynamicParams` at its default and gets `fallback: null`.
 *
 * This is exactly the class of bug `pnpm preview` exists to catch: a green `pnpm build` and a green
 * `next start` both said the pages were fine.
 *
 * **The doorway page protection it was providing is not lost**, it just moved one layer in. The
 * `notFound()` call below rejects any slug that is not in `REQUEST_FORMS`, verified on the Workers
 * runtime: `/get-service/nonsense/` returns 404 while all eight real slugs return 200. The only
 * difference is that an invented slug now costs one Worker invocation to reject instead of being
 * refused at the edge. `requestHref()` in `lib/booking.ts` also falls back to the generic repair
 * form rather than trusting a caller's string, so a typo at a CTA cannot produce a 404 either.
 */

export function generateStaticParams() {
  return REQUEST_FORMS.map((f) => ({ topic: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const f = getRequestForm(topic);
  if (!f) return {};
  return {
    title: f.title,
    description: f.description,
    alternates: { canonical: `https://trinitygaragedoorservice.com/get-service/${f.slug}/` },
  };
}

export default async function RequestFormPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const f = getRequestForm(topic);
  /*
    ⚠️ **This is the only thing stopping `/get-service/anything/` from rendering a real form.** It
    used to be belt and braces behind `dynamicParams = false`; that flag had to come out because it
    404s the whole route on Cloudflare (see the note at the top), so this line now carries the job
    on its own. Verified on the Workers runtime, not just `next start`.
  */
  if (!f) notFound();

  return (
    <RequestFormLayout eyebrow={f.eyebrow} h1={f.h1} blurb={f.blurb} source={f.leadSource} />
  );
}
