import Image from "next/image";
import { SITE, asset } from "@/lib/site";

/**
 * Dark trust strip (handoff 02): Angi + Elite badges, 4.9 on Google, BBB A+ chip,
 * license line. The 4.9 is the design's visual text; aggregateRating is intentionally
 * omitted from JSON-LD until reviews are real (handoff G6).
 */
export function TrustStrip() {
  return (
    <div className="bg-ink">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-[26px] gap-y-[14px] px-5 py-[22px] text-[13px] font-semibold text-white nav:px-8">
        <Image src={asset("badge-angi-super-service-2024.png")} alt="Angi Super Service Award 2024" width={120} height={40} className="h-10 w-auto" />
        <Image src={asset("badge-elite.png")} alt="Elite Service" width={70} height={40} className="h-10 w-auto" />
        <span className="inline-flex items-center gap-1.5">
          <span className="tracking-[0.05em] text-accent">★★★★★</span> 4.9 on Google
        </span>
        <span className="h-4 w-px bg-white/20" />
        <span className="inline-flex items-center gap-2">
          <span className="rounded bg-[#0a4ea2] px-1.5 py-0.5 text-[12px] font-extrabold text-white">A+</span> BBB Accredited
        </span>
        <span className="h-4 w-px bg-white/20" />
        <span className="text-white/70">Licensed, Bonded &amp; Insured · {SITE.license}</span>
      </div>
    </div>
  );
}
