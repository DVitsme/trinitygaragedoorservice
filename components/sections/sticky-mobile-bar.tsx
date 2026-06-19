import { Phone } from "lucide-react";
import { SITE } from "@/lib/site";

export function StickyMobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex gap-2.5 border-t-[3px] border-accent bg-[#111] px-3 py-2.5 min-[921px]:hidden">
      <a
        href={SITE.phoneHref}
        className="flex flex-1 items-center justify-center gap-2 rounded-[7px] bg-white py-3.5 text-[14px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline"
      >
        <Phone className="h-[17px] w-[17px] text-accent" strokeWidth={2.2} />
        Call
      </a>
      <a
        href={SITE.bookingHref}
        className="flex flex-1 items-center justify-center rounded-[7px] bg-accent py-3.5 text-[14px] font-extrabold uppercase tracking-[0.04em] text-white no-underline"
      >
        Book a Repair
      </a>
    </div>
  );
}
