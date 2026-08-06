"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { USE_REQUEST_FORM, requestHref } from "@/lib/booking";

/**
 * The primary conversion CTA, and the single mount point for Housecall Pro's booking embed.
 *
 * It has two modes, chosen by `BOOKING_MODE` in `lib/booking.ts`:
 *
 * **`"form"` (current, since 2026-08-04)** — renders a link to one of our own request form pages.
 * No modal, no third party, no script. The client asked for the Housecall Pro integration to come
 * out, and said they will want it back later, so none of it was deleted.
 *
 * **`"housecall-pro"`** — the original behaviour, preserved below in full and still type checked.
 * Housecall Pro owns and hosts the booking experience (service, real time arrival windows, address,
 * contact, optional deposit, confirmations); this button only *launches* it. It opens HCP's modal
 * **over the page**, which is where the funnel used to leak: a new tab drops the visitor out of the
 * site entirely. The embed script is mounted once in `app/layout.tsx`, behind the same flag.
 *
 * Notes that only matter in `"housecall-pro"` mode, kept because they cost an hour to learn:
 *
 * ⚠️ The global is `window.HCPWidget`, NOT `window.HousecallPro` (an earlier TODO here guessed the
 * latter; it does not exist). Verified against their real script source. It exposes exactly two
 * methods, `openModal()` and `openModalWithParams()`, and the accepted params are undocumented and
 * cross-origin, so prefill is not available to us.
 *
 * ⚠️ **The fallback is load bearing, do not remove it.** `window.HCPWidget` is assigned only at the
 * very END of their init, and their init bails early if the token fails to resolve. So the global
 * can legitimately be missing: script still loading, blocked by an ad blocker, offline, or a bad
 * token. In every one of those cases we still have to be able to take a booking, so we fall back
 * to opening the hosted page. That makes the modal purely additive with no regression.
 *
 * Free bonus from their script: any page URL containing `?booking` auto-opens the modal, so email
 * and ad campaigns can deep link straight into booking with no extra work.
 *
 * The `.bt-book-btn` class adds the design's subtle red pulse (paused on hover, disabled under
 * prefers-reduced-motion via globals.css). Pass `className` for the per-context styling and
 * `children` for the label/icon so each placement matches the design.
 */
declare global {
  interface Window {
    HCPWidget?: { openModal?: () => void };
  }
}

export function BookOnlineButton({
  className,
  children,
  topic,
  "aria-label": ariaLabel,
}: {
  className?: string;
  children?: ReactNode;
  /**
   * Which request form to send this CTA to, e.g. `"repair"` or `"spring-repair"`. Ignored in
   * `"housecall-pro"` mode, where every button opens the same modal. Omit when the intent is
   * genuinely unknown.
   */
  topic?: string;
  "aria-label"?: string;
}) {
  /*
    FORM MODE. A plain link, and deliberately NOT a click tracked one.

    The old `book_online_click` event existed because the modal produced no navigation to measure:
    a click was the only observable thing. A link to a real page does produce one, so the form
    page's own page_view is the signal, and it is a better one (Google Ads' Landing Page report and
    GA4 both key on URL, and a dataLayer push racing a navigation is a known way to lose events).
    Which form page a conversion came from is exactly what the request form pages exist to answer.

    `book_online_click` stays in the TrackEvent union in lib/analytics.ts on purpose. The ads
    specialist's GTM tag for it already exists, and leaving the member costs nothing and makes the
    switch back free.
  */
  if (USE_REQUEST_FORM) {
    /*
      `inline-flex` is the BASE, not the final word. Every call site passes its own display class
      (`block w-full`, `flex w-full`), and `cn()` is tailwind-merge, so the caller's wins. It only
      applies where a call site sets none, which matters because this used to be a <button> and is
      now an <a>: an inline anchor ignores vertical padding, so without a display class the sizing
      quietly collapses. No `aria-label` is defaulted here either, since the visible text is now the
      accessible name and overriding it with a different one is worse than leaving it alone.
    */
    return (
      <Link
        href={requestHref(topic)}
        aria-label={ariaLabel}
        className={cn("bt-book-btn inline-flex items-center justify-center no-underline", className)}
      >
        {children ?? "Request Service"}
      </Link>
    );
  }

  const openBooking = () => {
    track({ event: "book_online_click", link_location: ariaLabel ?? "Book online" });
    // Preferred path: HCP's modal, over the page. Wrapped because their script assigns the global
    // at the end of init and can throw if the token did not resolve; a booking is too valuable to
    // lose to an exception.
    try {
      if (typeof window.HCPWidget?.openModal === "function") {
        window.HCPWidget.openModal();
        return;
      }
    } catch (err) {
      console.error("[BookOnlineButton] HCPWidget.openModal() threw, falling back:", err);
    }

    // Fallback: the hosted booking page. Reached when the script has not loaded yet, was blocked,
    // or failed to initialise.
    const url = SITE.bookingHref;
    if (url && /^https?:\/\//.test(url)) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (process.env.NODE_ENV !== "production") {
      // Not wired yet: set NEXT_PUBLIC_BOOKING_URL to Trinity's Housecall Pro booking URL.
      console.warn("[BookOnlineButton] NEXT_PUBLIC_BOOKING_URL is not set — no booking URL to open.");
    }
  };

  return (
    <button type="button" onClick={openBooking} aria-label={ariaLabel ?? "Book online"} className={cn("bt-book-btn", className)}>
      {children ?? "Book Online"}
    </button>
  );
}
