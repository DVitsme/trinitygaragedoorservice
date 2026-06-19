import { Phone, Check, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";

// Phase 2: point SITE.bookingHref at the real Housecall Pro scheduler URL, or replace this
// panel with the HCP embed widget. The #book anchor stays the target of every CTA.
const INCLUDES = [
  "Garage door repair",
  "Spring or opener replacement",
  "New door or a free estimate",
];

export function BookingBand() {
  return (
    <div id="book" className="border-t-[5px] border-accent bg-ink">
      <div className="mx-auto max-w-[1200px] px-8 py-[92px]">
        <Reveal className="grid grid-cols-1 items-center gap-[50px] min-[921px]:grid-cols-2">
          <div>
            <div className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">Book Now</div>
            <h2 className="m-0 mt-3 font-heading text-[clamp(28px,3.8vw,46px)] font-extrabold uppercase leading-none text-white">
              Book Your Repair in Under a Minute
            </h2>
            <p className="mt-4 max-w-[430px] text-[17.5px] leading-[1.58] text-[#a8a8a8]">
              Pick a time that works for you and a local tech will be there, usually the same day.
            </p>
            <a
              href={SITE.phoneHref}
              className="mt-[26px] inline-flex items-center gap-3.5 rounded-lg border-2 border-[#333] bg-[#222] px-5 py-4 no-underline"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[7px] bg-accent">
                <Phone className="h-[22px] w-[22px] text-white" strokeWidth={2} />
              </span>
              <span>
                <span className="block text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-[#9a9a9a]">
                  Prefer to call? 24/7
                </span>
                <span className="block font-heading text-[23px] font-extrabold text-white">
                  {SITE.phoneDisplay}
                </span>
              </span>
            </a>
          </div>

          <div className="rounded-lg border-2 border-ink bg-white p-[26px]">
            <div className="flex items-center justify-between">
              <h3 className="m-0 font-heading text-[19px] font-extrabold uppercase text-ink">Book Online</h3>
              <span className="text-[12px] font-bold text-[#8a8a8a]">Housecall Pro</span>
            </div>
            <p className="mt-3.5 text-[15px] leading-[1.55] text-[#4a4a4a]">
              Choose a service and a time that works for you. You&apos;ll get an instant
              confirmation and a reminder before we arrive.
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {INCLUDES.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-accent">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={SITE.bookingHref}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-[7px] bg-accent px-4 py-[15px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline"
            >
              Open the Scheduler
              <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.6} />
            </a>
            <p className="mt-3 text-center text-[12px] font-semibold text-[#8a8a8a]">
              Powered by Housecall Pro · secure online booking
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
