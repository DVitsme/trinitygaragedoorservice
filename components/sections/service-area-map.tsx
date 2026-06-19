import { Reveal } from "@/components/reveal";
import { CITIES } from "@/lib/site";

const PINS = [
  { left: "29%", top: "34%" },
  { left: "51%", top: "27%" },
  { left: "44%", top: "53%" },
  { left: "64%", top: "60%" },
  { left: "38%", top: "72%" },
];

function Pin({ left, top }: { left: string; top: string }) {
  return (
    <span className="absolute -translate-x-1/2 -translate-y-full" style={{ left, top }}>
      <span className="flex h-[26px] w-[26px] rotate-45 items-center justify-center rounded-[50%_50%_50%_0] border-2 border-white bg-accent shadow-[0_5px_12px_rgba(0,0,0,0.5)]">
        <span className="h-2 w-2 -rotate-45 rounded-full bg-white" />
      </span>
    </span>
  );
}

export function ServiceAreaMap() {
  return (
    <div id="areas" className="bg-white">
      <div className="mx-auto max-w-[1200px] px-8 py-[92px]">
        <Reveal className="grid grid-cols-1 items-center gap-11 min-[921px]:grid-cols-[1.25fr_1fr]">
          {/* Decorative stylized map */}
          <div className="relative h-[440px] overflow-hidden rounded-lg border-2 border-ink bg-[#15161a]">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_68px),repeating-linear-gradient(0deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_68px)]" />
            <div className="absolute -left-[10%] top-[20%] h-3.5 w-[120%] -rotate-[9deg] bg-[#26282f]" />
            <div className="absolute -left-[10%] top-[60%] h-2.5 w-[120%] rotate-[6deg] bg-[#26282f]" />
            <div className="absolute -right-[12%] -top-[10%] h-[120%] w-[46%] rotate-[12deg] bg-[rgba(40,80,110,0.4)]" />
            <div className="absolute left-1/2 top-[52%] h-[64%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-[1.5px] border-dashed border-accent/60 bg-accent/10" />
            {PINS.map((p, i) => (
              <Pin key={i} left={p.left} top={p.top} />
            ))}
            <div className="absolute bottom-4 left-4 flex items-center gap-[9px] rounded-md border-2 border-accent bg-ink px-[15px] py-2.5 text-[13px] font-extrabold uppercase tracking-[0.04em] text-white">
              <span className="h-[9px] w-[9px] rounded-full bg-accent" />
              Tampa Bay Service Area
            </div>
          </div>

          <div>
            <div className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">Service Areas</div>
            <h2 className="m-0 mt-3 font-heading text-[clamp(26px,3.2vw,38px)] font-extrabold uppercase leading-[1.04] text-ink">
              We Cover the Whole Tampa Bay Area
            </h2>
            <p className="mt-3.5 text-[16.5px] leading-[1.58] text-[#4a4a4a]">
              Being based in Lutz means shorter drive times and same day arrival across all six cities.
            </p>
            <div className="mt-[22px] flex flex-wrap gap-[9px]">
              {CITIES.map((c) => (
                <span key={c.slug} className="rounded-md border-2 border-ink px-4 py-[9px] text-[14px] font-bold text-ink">
                  {c.name}
                </span>
              ))}
            </div>
            <div className="mt-6 flex max-w-[400px] gap-2.5">
              <input
                placeholder="ENTER YOUR ZIP CODE"
                aria-label="Enter your ZIP code"
                className="flex-1 rounded-md border-2 border-ink px-4 py-[13px] text-[14px] font-bold uppercase tracking-[0.03em] outline-none"
              />
              <button
                type="button"
                className="rounded-md bg-accent px-[22px] py-[13px] text-[14px] font-extrabold uppercase tracking-[0.04em] text-white"
              >
                Check
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
