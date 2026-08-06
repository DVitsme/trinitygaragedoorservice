"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { SITE, ROUTES, getNavConfig } from "@/lib/site";

export function StickyMobileBar() {
  const cfg = getNavConfig(usePathname() || "/");
  const estimate = cfg.headerCta === "estimate";
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex gap-2.5 border-t-[3px] border-accent bg-ink-3 px-3 py-2.5 nav:hidden">
      <a
        href={SITE.phoneHref}
        className="flex flex-1 items-center justify-center gap-2 rounded-[7px] bg-white py-3.5 text-[14px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline"
      >
        <Phone className="h-[17px] w-[17px] text-accent" strokeWidth={2.2} />
        Call
        {/*
          ⚠️ **The number has to be in this anchor's TEXT, not only in its href.**

          Google Ads call tracking works by walking text nodes for the configured number, rewriting
          the visible text, and only THEN climbing to the enclosing anchor to rewrite its `href`. No
          matching text means it never climbs, so this anchor kept the real number forever and every
          call placed from it was invisible to Google Ads. This is the persistent call button on
          every mobile page, on a business whose money arrives by phone, so it was the single most
          expensive omission on the site.

          `sr-only` rather than visible, because at 390px the bar is two equal buttons and
          "Call (813) 279-6785" will not fit. It is a real text node either way, which is all the
          tag walker cares about, and it doubles as an accessibility fix: "Call" alone is a vague
          link name, and this gives it a real one.
        */}
        <span className="sr-only"> {SITE.phoneDisplay}</span>
      </a>
      <Link
        href={estimate ? ROUTES.estimate : ROUTES.getStarted}
        className="flex flex-1 items-center justify-center rounded-[7px] bg-accent py-3.5 text-[14px] font-extrabold uppercase tracking-[0.04em] text-white no-underline"
      >
        {estimate ? "Free Estimate" : "Request Service"}
        <span className="sr-only">{estimate ? " on a new garage door" : " for your garage door"}</span>
      </Link>
    </div>
  );
}
