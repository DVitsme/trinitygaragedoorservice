import { Phone } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";

export function CtaBand() {
  return (
    <div className="bg-accent text-white">
      <Reveal className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-8 px-8 py-[72px]">
        <div>
          <h2 className="m-0 max-w-[620px] font-heading text-[clamp(27px,3.8vw,44px)] font-black uppercase leading-none">
            Don&apos;t Wait. Get Your Door Fixed Today.
          </h2>
          <p className="mt-3 text-[17px] font-medium text-white/[0.92]">
            Same day slots fill fast. Book online or call our 24/7 line.
          </p>
        </div>
        <div className="flex flex-wrap gap-[13px]">
          <a
            href={SITE.bookingHref}
            className="rounded-[7px] bg-white px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-accent no-underline"
          >
            Book a Repair
          </a>
          <a
            href={SITE.phoneHref}
            className="inline-flex items-center gap-2.5 rounded-[7px] border-2 border-white px-7 py-4 text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline"
          >
            <Phone className="h-[18px] w-[18px]" strokeWidth={2.2} />
            {SITE.phoneDisplay}
          </a>
        </div>
      </Reveal>
    </div>
  );
}
