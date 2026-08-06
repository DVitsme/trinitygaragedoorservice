/**
 * Where a "book / schedule / request service" CTA sends people, and the pages it can send them to.
 *
 * ## Why this file exists
 *
 * Until 2026-08-04 every booking CTA opened Housecall Pro's booking modal. It is now switched off
 * and those CTAs land on our own callback form instead. `LAUNCH-TODO` 6.9 anticipated exactly this
 * ("retire the modal and repoint those CTAs at the form"), and the client has said they will want
 * booking back later, so **nothing about the Housecall Pro path was deleted.** It is gated, not
 * removed:
 *
 *   - `components/book-online-button.tsx` still contains the whole `HCPWidget.openModal()` path and
 *     its hosted URL fallback.
 *   - `app/layout.tsx` still contains the widget script mount.
 *   - `app/book-a-repair/` is still a complete, building page.
 *   - `lib/site.ts` still derives `bookingHref` and `bookingWidgetSrc` from `NEXT_PUBLIC_BOOKING_URL`.
 *
 * **To put Housecall Pro back:** set `BOOKING_MODE` to `"housecall-pro"`, confirm
 * `NEXT_PUBLIC_BOOKING_URL` is set in `.env.local`, and rebuild. That one constant restores the
 * modal, the script tag, the `/book-a-repair/` page and its sitemap entry, and removes the redirect.
 * The CTA labels are the one thing it does NOT revert; see the note on `BOOKING_MODE` below.
 *
 * ## Why a hardcoded constant and not an env var
 *
 * Same reasoning as the GTM container id in `lib/site.ts`: `NEXT_PUBLIC_*` is inlined at BUILD time,
 * so a build that happened to miss the variable would silently ship the wrong behaviour with no
 * error. Which mode the site is in is a product decision, it belongs in version control where it
 * cannot go missing, and it is read by `next.config.ts` as well as by components.
 *
 * ⚠️ **This module must stay dependency free.** `next.config.ts` imports it, so anything it pulls in
 * has to be loadable outside the Next runtime.
 */

/**
 * `"form"`  — every booking CTA is a link to one of the `REQUEST_FORMS` pages below.
 * `"housecall-pro"` — every booking CTA opens Housecall Pro's modal, as it did before 2026-08-04.
 *
 * ⚠️ Flipping this back does **not** rewrite the CTA labels. They were changed from "Book Online" and
 * "Book a Repair" to "Request Service" wording on purpose, because a label has to match what happens
 * when you press it: a callback form is not a calendar. The site already made this exact call once,
 * for the header CTA (see `ROUTES.getStarted`). If booking returns, search for `requestLabel` and
 * put the booking words back deliberately rather than having a constant do it silently.
 */
export const BOOKING_MODE: "form" | "housecall-pro" = "form";

/** True when booking CTAs should point at our own form rather than Housecall Pro. */
export const USE_REQUEST_FORM = BOOKING_MODE === "form";

/**
 * One request form page per intent.
 *
 * These are **not** doorway pages. Each one is a real destination for a specific CTA, it says back
 * to the visitor what they just clicked, and it carries its own `leadSource` so the office and the
 * ads specialist can both see which door a lead came in by. That last part is the point: with a
 * single shared form page, every conversion looks identical and the thank you page cannot say where
 * anyone came from.
 *
 * They render through `app/get-service/[topic]/page.tsx`, which sets `dynamicParams = false`, so a
 * slug that is not in this table 404s rather than generating a thin page.
 *
 * ⚠️ **`/get-service/` itself is not in here and must not move.** That URL is in the verified 301
 * map, in the sitemap, and in every Google Ads final URL Lloyd is running. These are additions
 * beneath it, not a replacement for it. Same for `/get-service/?intent=estimate`.
 */
export type RequestForm = {
  /** URL segment under `/get-service/`. Hyphens are fine here; this is a URL, not prose. */
  slug: string;
  /** Breadcrumb leaf and the small uppercase eyebrow above the h1. */
  eyebrow: string;
  /** The h1. Title case, because every other h1 on the site is. */
  h1: string;
  /** The sentence under the h1. */
  blurb: string;
  /** `<title>`. */
  title: string;
  /** Meta description. */
  description: string;
  /**
   * Written to the lead's `source` column, shown on the lead email, and sent as `lead_source` on
   * the `generate_lead` dataLayer event. Kept in the same shape as the two that already exist
   * (`contact-form`, `estimate-form`) so nothing downstream has to special case these.
   *
   * Structurally the `LeadSource` type from `lib/analytics.ts`, written out rather than imported to
   * keep the promise at the top of this file: `next.config.ts` imports this module, so it stays
   * free of everything, including erasable imports from a `"use client"` file.
   */
  leadSource: `${string}-form`;
};

const form = (
  slug: string,
  eyebrow: string,
  h1: string,
  blurb: string,
  title: string,
  description: string,
): RequestForm => ({ slug, eyebrow, h1, blurb, title, description, leadSource: `${slug}-form` });

export const REQUEST_FORMS: RequestForm[] = [
  form(
    "repair",
    "Request a Repair",
    "Tell Us What Needs Fixing",
    "Broken spring, door off the track, opener that quit? Send it over and a local technician will call you back, usually the same day.",
    "Request a Garage Door Repair | Trinity Garage Door Service Tampa Bay",
    "Tell us what your garage door is doing and a local Trinity technician calls you back, usually the same day. Family owned in Tampa Bay since 2007.",
  ),
  form(
    "spring-repair",
    "Spring Repair",
    "Request Your Spring Repair",
    "A broken spring is the most common failure and the one you should leave alone. Send us the details and a technician calls you back, usually the same day.",
    "Request Garage Door Spring Repair | Trinity Garage Door Service",
    "Broken or worn garage door spring in Tampa Bay? Send us the details and a Trinity technician calls you back, usually the same day.",
  ),
  form(
    "opener-repair",
    "Opener Repair",
    "Request Your Opener Repair",
    "Opener dead, stuttering, or ignoring the remote? Tell us what it is doing and a technician will call you back, usually the same day.",
    "Request Garage Door Opener Repair | Trinity Garage Door Service",
    "Garage door opener that quit or will not respond? Tell us what it is doing and a Trinity technician calls you back, usually the same day.",
  ),
  form(
    "off-track",
    "Off Track Repair",
    "Request Off Track Repair",
    "A door that has jumped its track is heavy and unpredictable. Leave it where it is, send us the details, and we will call you straight back.",
    "Request Off Track Garage Door Repair | Trinity Garage Door Service",
    "Garage door off its track in Tampa Bay? Leave it alone and send us the details. A Trinity technician calls you back, usually the same day.",
  ),
  form(
    "cables-and-rollers",
    "Cables and Rollers",
    "Request Cable Or Roller Repair",
    "Frayed cables and worn rollers make a door grind, bind, or sit crooked. Tell us what you are seeing and we will call you back.",
    "Request Cable and Roller Repair | Trinity Garage Door Service",
    "Frayed cables or worn rollers on your garage door? Tell us what you are seeing and a Trinity technician calls you back, usually the same day.",
  ),
  form(
    "tune-up",
    "Tune Up",
    "Request A Tune Up",
    "A yearly service keeps a door running quietly and catches the parts that are about to go. Send us your details and we will find you a time.",
    "Request a Garage Door Tune Up | Trinity Garage Door Service",
    "Request a garage door tune up in Tampa Bay. Send us your details and a Trinity technician calls you back to find you a time.",
  ),
  form(
    "replacement",
    "Door Replacement",
    "Request A Door Replacement",
    "When a door is past saving, we will tell you so and give you an honest number. Send us the details and we will come take a look.",
    "Request a Garage Door Replacement | Trinity Garage Door Service",
    "Ready to replace your garage door in Tampa Bay? Send us the details and a Trinity technician calls you back to come take a look.",
  ),
  form(
    "emergency",
    "Emergency Repair",
    "Tell Us What Happened",
    "Car stuck inside, door stuck open, spring gone? Calling is faster and the phones are answered till 9pm. If you would rather write it down, this reaches the same people.",
    "Emergency Garage Door Repair Request | Trinity Garage Door Service",
    "Garage door emergency in Tampa Bay? Call (813) 279-6785, answered till 9pm, or send the details here and we will call you straight back.",
  ),
];

/**
 * Where a successful form submission lands.
 *
 * **One page, not one per form, and that is deliberate.** Per form thank you URLs would buy nothing
 * here: Google Ads reports a conversion's URL from `location.pathname` at the moment the tag fires,
 * and the tag fires on the FORM page, so the Ads webpages report already separates
 * `/get-service/spring-repair/` from `/get-service/opener-repair/` with no extra work. Ten thank you
 * URLs would be ten `noindex` surfaces to maintain for a report we already get.
 *
 * ⚠️ **Nothing analytics related may ever be attached to this page.** The conversion fires on the
 * form page, which is what makes refresh, Back, bookmarking and crawling all harmless here. See the
 * long note at the submit handler in `components/contact-form.tsx`.
 */
export const THANK_YOU = "/thank-you/";

const BY_SLUG = new Map(REQUEST_FORMS.map((f) => [f.slug, f]));

export const getRequestForm = (slug: string): RequestForm | undefined => BY_SLUG.get(slug);

/**
 * The href for a booking CTA.
 *
 * Call this at every CTA rather than hardcoding a path, so the whole site follows `BOOKING_MODE`.
 * In `"housecall-pro"` mode it returns the interstitial that frames and launches the modal; in
 * `"form"` mode it returns the matching request form, falling back to the generic repair form for
 * any slug that has no page of its own.
 *
 * `undefined` means "no particular intent", which is the right answer for the header, the footer and
 * the 404 page, where we genuinely do not know what the visitor needs.
 */
export function requestHref(slug?: string): string {
  if (!USE_REQUEST_FORM) return "/book-a-repair/";
  if (!slug) return "/get-service/";
  return BY_SLUG.has(slug) ? `/get-service/${slug}/` : "/get-service/repair/";
}

/**
 * The default label for a booking CTA, so no button promises a calendar we do not have.
 *
 * Call sites that read better with something more specific ("Request Spring Repair") should just
 * write that; this is the generic answer, and the thing to grep for when booking comes back.
 */
export const requestLabel = USE_REQUEST_FORM ? "Request Service" : "Book a Repair";
