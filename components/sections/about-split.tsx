import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { asset, SITE } from "@/lib/site";

const BULLETS = [
  "Family owned and local, so there is no call center runaround",
  "A clear price before any work begins",
];

export function AboutSplit() {
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto max-w-[1200px] px-8 py-[92px]">
        <Reveal className="grid grid-cols-1 items-center gap-14 min-[921px]:grid-cols-[1fr_1.05fr]">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">
              <span className="h-[3px] w-[30px] bg-accent" />
              About Trinity
            </div>
            <h2 className="m-0 mt-4 font-heading text-[clamp(27px,3.6vw,42px)] font-extrabold uppercase leading-[1.02] tracking-[-0.01em] text-ink">
              Doors That Just Work, From People Who Show Up
            </h2>
            <p className="mt-5 max-w-[480px] text-[17.5px] leading-[1.62] text-[#4a4a4a]">
              Trinity is a family owned garage door company that has kept Tampa Bay&apos;s
              doors moving since {SITE.foundedYear}. No call center and no pressure. We tell
              you what is actually wrong, give you a fair price before we start, and stand
              behind the work once it is done.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              {BULLETS.map((t) => (
                <div key={t} className="flex items-start gap-3">
                  <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center bg-accent">
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </span>
                  <span className="text-[16.5px] font-semibold text-ink">{t}</span>
                </div>
              ))}
            </div>
            <div className="mt-7">
              <a
                href="/about/our-story/"
                className="inline-flex items-center gap-2.5 rounded-[7px] bg-ink px-[26px] py-[15px] text-[14px] font-extrabold uppercase tracking-[0.04em] text-white no-underline"
              >
                Learn Our Story
                <ArrowRight className="h-[17px] w-[17px] text-accent" strokeWidth={2.6} />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[430px] overflow-hidden rounded-lg border-2 border-ink">
              <Image
                src={asset("team-group-in-showroom.jpg")}
                alt="The Trinity Garage Door team in their Tampa Bay showroom"
                fill
                sizes="(max-width: 920px) 100vw, 560px"
                className="object-cover"
              />
            </div>
            <div className="absolute -right-4 -top-4 rounded-lg border-2 border-ink bg-accent px-[18px] py-3.5 text-center">
              <div className="font-heading text-[32px] font-black leading-none text-white">
                {SITE.yearsLabel}
              </div>
              <div className="mt-[3px] text-[10.5px] font-extrabold uppercase tracking-[0.06em] text-white">
                Years in
                <br />
                Tampa Bay
              </div>
            </div>
            <div className="absolute -bottom-[34px] -left-[26px] w-[168px] rounded-lg border-2 border-accent bg-ink p-2.5 max-[920px]:static max-[920px]:mt-4">
              <div className="relative h-[190px] overflow-hidden rounded-md bg-[#2a2a2a]">
                <Image
                  src={asset("owner-jason-placeholder.png")}
                  alt="Jason, Owner"
                  fill
                  sizes="168px"
                  className="object-cover object-top"
                />
              </div>
              <div className="mt-2.5 text-center text-[15px] font-extrabold uppercase tracking-[0.03em] text-white">
                Jason · Owner
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
