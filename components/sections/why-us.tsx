import { Clock, BadgeDollarSign, ShieldCheck, Zap } from "lucide-react";
import { Reveal } from "@/components/reveal";

const CARDS = [
  {
    Icon: Clock,
    title: "24/7 Response",
    body: "A real person picks up, day or night, when your door gives out at the worst time.",
  },
  {
    Icon: BadgeDollarSign,
    title: "Upfront Pricing",
    body: "You get a clear price before we start, so nothing surprises you when we finish.",
  },
  {
    Icon: ShieldCheck,
    title: "Licensed & Insured",
    body: "Florida licensed, bonded, and insured, under GD13010 and GDI-09484.",
  },
  {
    Icon: Zap,
    title: "Same Day Service",
    body: "Most repairs are done the same day, and often within a couple of hours.",
  },
];

export function WhyUs() {
  return (
    <div className="bg-ink">
      <div className="mx-auto max-w-[1200px] px-8 py-[92px]">
        <Reveal className="mx-auto max-w-[640px] text-center">
          <div className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">
            Why Homeowners Call Us First
          </div>
          <h2 className="m-0 mt-3 font-heading text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.04] text-white">
            Built Around Your Emergency, Not Ours
          </h2>
        </Reveal>
        <Reveal className="mt-[46px] grid grid-cols-2 gap-5 min-[921px]:grid-cols-4">
          {CARDS.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="rounded-lg border border-[#333] border-t-4 border-t-accent bg-[#222] px-6 py-7"
            >
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-lg bg-accent">
                <Icon className="h-[26px] w-[26px] text-white" strokeWidth={2} />
              </div>
              <h3 className="mt-[18px] font-heading text-[18px] font-bold uppercase text-white">
                {title}
              </h3>
              <p className="mt-2 text-[15px] leading-[1.55] text-[#a8a8a8]">{body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
