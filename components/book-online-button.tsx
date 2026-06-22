"use client";

import type { ReactNode } from "react";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * "Book Online" trigger — the mount point for Housecall Pro's online-booking embed.
 *
 * Housecall Pro owns and hosts the actual booking experience (service, real-time arrival
 * windows, address, contact, optional deposit, confirmations). This button only *launches*
 * it; we never build a calendar or form on our side.
 *
 * Current behavior: opens Trinity's hosted booking page (`NEXT_PUBLIC_BOOKING_URL`, exposed as
 * `SITE.bookingHref`). To upgrade to HCP's on-page **modal** embed, load HCP's embed script
 * (e.g. via `next/script`) and call its open API inside `openBooking()` — see TODO below.
 *
 * The `.bt-book-btn` class adds the design's subtle red pulse (paused on hover, disabled under
 * prefers-reduced-motion via globals.css). Pass `className` for the per-context styling and
 * `children` for the label/icon so each placement matches the design.
 */
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
    // TODO(HCP): once Trinity's Housecall Pro embed script is loaded, open the modal instead, e.g.
    //   if (window.HousecallPro?.openBooking) return window.HousecallPro.openBooking();
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
