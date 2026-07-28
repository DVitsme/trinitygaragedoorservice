"use client";

import type { ReactNode } from "react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * "Book Online" trigger — the single mount point for Housecall Pro's online-booking embed.
 *
 * Housecall Pro owns and hosts the actual booking experience (service, real-time arrival
 * windows, address, contact, optional deposit, confirmations). This button only *launches*
 * it; we never build a calendar or form on our side.
 *
 * Opens HCP's **modal over the page**, which is where the funnel used to leak: a new tab drops
 * the visitor out of the site entirely. The embed script is mounted once in `app/layout.tsx`.
 *
 * ⚠️ The global is `window.HCPWidget`, NOT `window.HousecallPro` (an earlier TODO here guessed the
 * latter; it does not exist). Verified against their real script source. It exposes exactly two
 * methods, `openModal()` and `openModalWithParams()`, and the accepted params are undocumented and
 * cross-origin, so prefill is not available to us.
 *
 * **The fallback is load bearing, do not remove it.** `window.HCPWidget` is assigned only at the
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
  "aria-label": ariaLabel = "Book online",
}: {
  className?: string;
  children?: ReactNode;
  "aria-label"?: string;
}) {
  const openBooking = () => {
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
    <button type="button" onClick={openBooking} aria-label={ariaLabel} className={cn("bt-book-btn", className)}>
      {children ?? "Book Online"}
    </button>
  );
}
