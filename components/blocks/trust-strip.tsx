import Image from "next/image";
import { asset } from "@/lib/site";

/**
 * Dark trust strip — port of the design (handoff 02). Angi + Elite badges, Google rating,
 * red dividers, BBB A+ chip, license line.
 *
 * The rating is HAND MAINTAINED: Housecall Pro has no reviews endpoint, so nothing here can
 * refresh it. Checked 2026-07-28 against the Google Business Profile: 5.0 from 597 reviews
 * (the design shipped 4.9, which understated them). Re-check rating and count together.
 *
 * JSON-LD aggregateRating stays omitted on purpose (G6) — self-serving review markup is
 * ineligible, and the rating already shows in the Business Profile where searchers see it.
 */
export function TrustStrip() {
  return (
    <div className="bg-ink">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-[26px] gap-y-[14px] px-5 py-[22px] nav:px-8">
        <Image src={asset("badge-angi-super-service-2024.png")} alt="Angi Super Service Award 2024" width={296} height={310} className="h-[58px] w-auto" />
        <Image src={asset("badge-elite.png")} alt="HomeAdvisor Elite Service" width={162} height={160} className="h-12 w-auto" />
        <span className="inline-flex items-center gap-2 text-[15px] font-bold text-white">
          <span className="tracking-[1px] text-accent">★★★★★</span> 5.0 on Google, 597 reviews
        </span>
        <span className="h-[26px] w-[2px] bg-accent" />
        <span className="inline-flex items-center gap-2 text-[15px] font-extrabold text-white">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-[4px] bg-white text-[11px] font-black text-[#0a4ea2]">A+</span>
          BBB Accredited
        </span>
        <span className="h-[26px] w-[2px] bg-accent" />
        <span className="text-[13px] font-semibold tracking-[0.03em] text-[#9a9a9a]">LICENSED · BONDED · INSURED · FL GD13010 / GDI-09484</span>
      </div>
    </div>
  );
}
