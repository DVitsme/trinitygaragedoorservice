"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * FAQ accordion (handoff 02) with the custom plus->minus indicator: a 26px square
 * bordered accent; the vertical bar disappears and the square fills red when open.
 * Pair with <FaqJsonLd> (components/json-ld.tsx) at the page level for FAQPage schema.
 * (Keyboard-accessible via native <button>; full Radix Accordion is a tracked polish.)
 */
export function FaqAccordion({ items }: { items: { q: string; a: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="mx-auto max-w-[880px]">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="mb-[14px] rounded-[8px] border-2 border-ink bg-white">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-[22px] py-5 text-left font-display text-[16px] font-bold uppercase text-ink"
            >
              <span>{it.q}</span>
              <span
                className={cn(
                  "relative grid h-[26px] w-[26px] flex-none place-items-center rounded-[6px] border-2 border-accent transition-colors",
                  isOpen && "bg-accent",
                )}
                aria-hidden="true"
              >
                <span className={cn("absolute h-[2px] w-[12px]", isOpen ? "bg-white" : "bg-accent")} />
                <span className={cn("absolute h-[12px] w-[2px] transition-opacity", isOpen ? "opacity-0" : "bg-accent")} />
              </span>
            </button>
            {isOpen && <div className="px-[22px] pb-[22px] text-[16px] leading-[1.62] text-body">{it.a}</div>}
          </div>
        );
      })}
    </div>
  );
}
