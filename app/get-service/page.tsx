import type { Metadata } from "next";
import { RequestFormLayout } from "@/components/blocks/request-form-layout";

/**
 * The lead capture page, and the general one: this is where a CTA lands when we do not know what
 * the visitor needs (the header, the footer, the 404 page).
 *
 * **24 CTAs across the site land here**, more than any other destination, and it now has company.
 * Since 2026-08-04, when Housecall Pro's booking modal was switched off, the booking CTAs land on
 * the per intent forms under `app/get-service/[topic]/`. Those exist so the thank you page can say
 * which form a conversion came from; see `lib/booking.ts`.
 *
 * ⚠️ **This URL must not move**, and neither must `?intent=estimate`. Both are in the verified 301
 * map, in the sitemap, and in Google Ads final URLs. The `[topic]` pages were added underneath it
 * rather than replacing it for exactly that reason.
 *
 * ⚠️ `source` is deliberately NOT passed here, so this page keeps emitting the `contact-form` and
 * `estimate-form` values that are already in the client's lead data and in the ads specialist's
 * container. Only the new pages introduce new source values.
 */
export const metadata: Metadata = {
  title: "Request a Callback | Trinity Garage Door Service Tampa Bay",
  description:
    "Tell us what your garage door needs and a local Trinity technician calls you back, usually the same day. Family owned in Tampa Bay since 2007.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/get-service/" },
};

export default async function GetServicePage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;
  const isEstimate = intent === "estimate";

  return (
    <RequestFormLayout
      intent={intent}
      eyebrow={isEstimate ? "Free Estimate" : "Request Service"}
      h1={isEstimate ? "Request a Free Estimate" : "Tell Us What's Going On"}
      blurb={
        isEstimate
          ? "Tell us about the project and we'll come take a look. The estimate is free and the advice is honest."
          : "Broken spring, door off the track, opener that quit? Send it over and a local technician will call you back, usually the same day."
      }
    />
  );
}
