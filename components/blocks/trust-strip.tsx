import Image from "next/image";
import { asset } from "@/lib/site";

/**
 * Dark trust strip — exact port of the design (handoff 02). Angi + Elite badges,
 * 4.9 on Google, red dividers, BBB A+ chip, license line. The 4.9 is the design's
 * visual text; JSON-LD aggregateRating is omitted until reviews are real (G6).
 */
export function TrustStrip() {
  return (
    <div className="bg-ink">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-[26px] gap-y-[14px] px-5 py-[22px] nav:px-8">
        <Image src={asset("badge-angi-super-service-2024.png")} alt="Angi Super Service Award 2024" width={150} height={58} className="h-[58px] w-auto" />
        <Image src={asset("badge-elite.png")} alt="HomeAdvisor Elite Service" width={120} height={48} className="h-12 w-auto" />
        <span className="inline-flex items-center gap-2 text-[15px] font-bold text-white">
          <span className="tracking-[1px] text-accent">★★★★★</span> 4.9 on Google
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
