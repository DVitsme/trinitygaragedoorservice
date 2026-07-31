"use client";

/**
 * The one way this site talks to Google Tag Manager.
 *
 * Division of responsibility with the ads specialist, so his container and our code never fight:
 * **we push named business events, he owns every generic pageview and every tag.** That means he
 * can add, rename or retire tags in the GTM UI forever without a deploy, and we never guess at
 * marketing config.
 *
 * ⚠️ **No `value` or `currency` is sent on purpose.** Their median job is about $855, but hardcoding
 * a revenue figure here would silently drive Smart Bidding from a number buried in the codebase.
 * Conversion value belongs in the Ads/GA4 UI where it can be changed by the person accountable for
 * it. We emit the fact that a lead happened; he decides what it is worth.
 *
 * ⚠️ **We deliberately do NOT push a `page_view`.** GA4 Enhanced Measurement already fires one on
 * App Router client navigations via the History API, so pushing our own would double count. See
 * `GTM-NOTES.md` for the one setting that has to be on for that to work.
 */

/** Every event this site can emit. Adding one here is the only way to add one at a call site. */
export type TrackEvent =
  | { event: "generate_lead"; lead_source: "contact-form" | "estimate-form" }
  | { event: "phone_click"; link_location: string }
  | { event: "book_online_click"; link_location: string }
  | { event: "zip_check"; zip_result: "in_area" | "out_of_area"; zip: string };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Push an event to the dataLayer.
 *
 * Safe in every case that matters: no-ops during server rendering, and the `|| []` guard means a
 * push that lands BEFORE gtm.js has loaded is queued in the array and drained when it arrives.
 * Nothing is lost to a slow script, and nothing throws if GTM is blocked entirely.
 */
export function track(payload: TrackEvent): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}
