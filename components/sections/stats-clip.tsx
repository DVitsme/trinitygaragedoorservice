import { AutoplayVideo } from "@/components/autoplay-video";
import { Reveal } from "@/components/reveal";
import { STATS, asset } from "@/lib/site";

export function StatsClip() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1200px] px-8 py-20">
        <Reveal className="grid grid-cols-4 overflow-hidden rounded-lg border-2 border-ink">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`px-4 py-[30px] text-center ${
                i < STATS.length - 1 ? "border-r-2 border-ink" : ""
              }`}
            >
              <div className="font-heading text-[clamp(32px,4vw,46px)] font-black leading-none text-ink">
                {s.value}
                <span className="text-accent">{s.accent}</span>
              </div>
              <div className="mt-2 text-[12.5px] font-extrabold uppercase tracking-[0.06em] text-[#666]">
                {s.label}
              </div>
            </div>
          ))}
        </Reveal>
        <Reveal className="relative mt-10 overflow-hidden rounded-lg border-2 border-ink">
          <AutoplayVideo
            src={asset("clip-door-opening.mp4")}
            poster={asset("door-after-white-2car-home.jpg")}
            className="block h-[clamp(280px,46vw,440px)] w-full object-cover"
          />
          <span className="absolute bottom-[18px] left-0 bg-accent px-4 py-[9px] text-[12.5px] font-extrabold uppercase tracking-[0.06em] text-white">
            Watch a finished door open smoothly
          </span>
        </Reveal>
        <div className="mt-3.5 text-center text-[12.5px] font-semibold text-[#999]">
          Figures provisional. Final stats confirmed before launch.
        </div>
      </div>
    </div>
  );
}
