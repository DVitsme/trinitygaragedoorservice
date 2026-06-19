import { Reveal } from "@/components/reveal";
import { REVIEWS } from "@/lib/site";

export function Reviews() {
  return (
    <div className="border-t-2 border-ink bg-sand">
      <div className="mx-auto max-w-[1200px] px-8 py-[92px]">
        <Reveal className="mx-auto max-w-[640px] text-center">
          <div className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">Reviews</div>
          <h2 className="m-0 mt-3 font-heading text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.04] text-ink">
            Neighbors Who Trust Trinity
          </h2>
          <p className="mt-2.5 text-[13.5px] font-semibold text-[#8a8a8a]">
            Live Google reviews syncing soon. Samples shown for now.
          </p>
        </Reveal>
        <Reveal className="mt-[42px] grid grid-cols-2 gap-5 min-[921px]:grid-cols-4">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-lg border-2 border-ink bg-white px-[22px] py-6">
              <div className="text-[15px] tracking-[2px] text-accent">★★★★★</div>
              <p className="mt-3.5 text-[16px] font-semibold leading-[1.5] text-ink">&ldquo;{r.quote}&rdquo;</p>
              <div className="mt-[18px] flex items-center gap-[11px]">
                <span className="flex h-[38px] w-[38px] items-center justify-center rounded-md bg-ink text-[15px] font-extrabold text-white">
                  {r.initial}
                </span>
                <div>
                  <div className="text-[14px] font-extrabold text-ink">{r.name}</div>
                  <div className="text-[12px] font-semibold text-[#8a8a8a]">{r.city} · Google</div>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
