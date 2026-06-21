"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type Faq = { q: string; a: string };

/** Expand/collapse FAQ list. Pair with <FaqJsonLd faqs={...}/> for schema. */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="overflow-hidden rounded-lg border-2 border-ink bg-white">
      {faqs.map((f, i) => (
        <div key={f.q} className={cn(i > 0 && "border-t-2 border-ink/10")}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-heading text-[16px] font-bold uppercase text-ink"
          >
            {f.q}
            <ChevronDown
              className={cn("h-5 w-5 shrink-0 transition-transform", open === i && "rotate-180")}
              strokeWidth={2.4}
            />
          </button>
          {open === i && (
            <div className="px-5 pb-5 text-[15.5px] leading-[1.6] text-[#4a4a4a]">{f.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
