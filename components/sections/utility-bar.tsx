import { Phone, MapPin } from "lucide-react";
import { SITE } from "@/lib/site";

export function UtilityBar() {
  return (
    <div className="hidden bg-accent text-[13.5px] font-semibold text-white min-[921px]:block">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-8 py-[9px]">
        <div className="flex flex-wrap items-center gap-[18px]">
          <span className="inline-flex items-center gap-2 uppercase tracking-[0.05em]">
            <span className="h-[7px] w-[7px] rounded-full bg-white" />
            Phones Answered Till 9pm
          </span>
          <span className="opacity-45">|</span>
          <a
            href={SITE.phoneHref}
            className="inline-flex items-center gap-[7px] text-white no-underline"
          >
            <Phone className="h-3.5 w-3.5" strokeWidth={2.2} />
            {SITE.phoneDisplay}
          </a>
        </div>
        <div className="inline-flex items-center gap-2 uppercase tracking-[0.05em]">
          <MapPin className="h-3.5 w-3.5" strokeWidth={2.2} />
          {SITE.areaLabel}
        </div>
      </div>
    </div>
  );
}
