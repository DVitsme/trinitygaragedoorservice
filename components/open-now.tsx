"use client";

import { useEffect, useState } from "react";
import { getOpenState, type OpenState } from "@/lib/business-hours";
import { SITE } from "@/lib/site";

/**
 * Width is reserved so the text swap cannot shift the phone number beside it.
 *
 * Measured in the real bar: the labels run from 102px ("Opens at 8am") to 285px ("Open now, phones
 * answered till 9pm"), a 183px swing. Without a floor, every visitor would see the utility bar
 * reflow a few seconds after load, which is both visible and a Cumulative Layout Shift hit on a
 * bar that sits at the very top of the page. 300px covers the widest label plus the dot and gap.
 */
const wrapCls =
  "inline-flex min-w-[300px] items-center gap-2 uppercase tracking-[0.05em]";

/**
 * "Open now" / "Opens at 8am" for the utility bar.
 *
 * ⚠️ **Client only, and that is the whole design.** Every page on this site is statically
 * generated, so anything computed on the server is frozen at build time and would tell a visitor on
 * Tuesday evening whatever happened to be true when the site was last deployed. It renders the
 * static, always true fallback first, then replaces it after mount, which also avoids a hydration
 * mismatch.
 *
 * It never renders the bare word "Closed". Beside a phone number that reads as "do not bother
 * calling", when the honest and more useful message is when somebody is back.
 */
export function OpenNow() {
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const tick = () => setState(getOpenState());
    tick();
    // Re-check every minute so someone reading the page at 8:59pm sees it flip rather than a stale
    // "open now" that was true when the tab was opened.
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);

  // Before hydration: the plain fact, which is true at every hour of every day.
  if (!state) {
    return (
      <span className={wrapCls}>
        <span className="h-[7px] w-[7px] rounded-full bg-white" />
        {SITE.hours.phoneLong}
      </span>
    );
  }

  return (
    <span className={wrapCls}>
      <span
        className={`h-[7px] w-[7px] rounded-full ${state.open ? "bg-white" : "bg-white/45"}`}
        aria-hidden="true"
      />
      {state.label}
    </span>
  );
}
