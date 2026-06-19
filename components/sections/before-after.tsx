import Image from "next/image";
import { Camera } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { asset } from "@/lib/site";

const JOBS = [
  { title: "White Door · New Build", after: "door-after-white-on-blue-home.jpg", alt: "Finished white garage door on a blue home" },
  { title: "Sectional Replacement", after: "door-after-brown-wood-sectional.jpg", alt: "Finished brown wood-look sectional garage door" },
  { title: "Two Car Upgrade", after: "door-after-white-2car-home.jpg", alt: "Finished white two-car garage door" },
];

export function BeforeAfter() {
  return (
    <div className="border-t-[5px] border-accent bg-ink">
      <div className="mx-auto max-w-[1200px] px-8 py-[92px]">
        <Reveal className="mx-auto max-w-[640px] text-center">
          <div className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">
            Real Jobs, Real Results
          </div>
          <h2 className="m-0 mt-3 font-heading text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.04] text-white">
            Before &amp; After, Around Tampa Bay
          </h2>
        </Reveal>
        <Reveal className="mt-[46px] grid grid-cols-1 gap-[22px] min-[921px]:grid-cols-3">
          {JOBS.map((j) => (
            <div key={j.title} className="overflow-hidden rounded-lg border border-[#333] bg-[#222]">
              <div className="px-[18px] pt-4">
                <div className="font-heading text-[17px] font-bold uppercase text-white">{j.title}</div>
              </div>
              <div className="px-[18px] pt-3">
                <div className="relative flex h-[150px] flex-col items-center justify-center gap-[7px] rounded-md border border-dashed border-[#4a4a4a] bg-[#2a2a2a] text-[#6f6f6f]">
                  <Camera className="h-6 w-6" strokeWidth={1.8} />
                  <span className="text-[12px] font-bold uppercase tracking-[0.04em]">Before photo coming soon</span>
                  <span className="absolute left-2 top-2 bg-black px-2 py-[3px] text-[10px] font-extrabold tracking-[0.06em] text-white">BEFORE</span>
                </div>
              </div>
              <div className="my-1.5 text-center text-[20px] text-accent">↓</div>
              <div className="px-[18px] pb-[18px]">
                <div className="relative h-[150px] overflow-hidden rounded-md">
                  <Image src={asset(j.after)} alt={j.alt} fill sizes="(max-width: 920px) 100vw, 380px" className="object-cover" />
                  <span className="absolute left-2 top-2 bg-accent px-2 py-[3px] text-[10px] font-extrabold tracking-[0.06em] text-white">AFTER</span>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
