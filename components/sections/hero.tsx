import { Phone } from "lucide-react";
import { AutoplayVideo } from "@/components/autoplay-video";
import { SITE, asset } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b-[5px] border-accent px-6 pb-[134px] pt-32 max-[920px]:pb-[92px]">
      <AutoplayVideo
        src={asset("hero-26-v1.mp4")}
        poster={asset("door-after-brown-dusk-2car.jpg")}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(10,10,10,0.58)_0%,rgba(10,10,10,0.72)_55%,rgba(10,10,10,0.8)_100%)]" />
      <div className="relative z-[2] mx-auto max-w-[1000px] text-center">
        <div className="flex items-center justify-center gap-3.5">
          <span className="h-1 w-[52px] bg-accent" />
          <span className="font-sans text-[13px] font-extrabold uppercase tracking-[0.22em] text-white">
            Opening Doors Since {SITE.foundedYear} · Tampa Bay
          </span>
          <span className="h-1 w-[52px] bg-accent" />
        </div>
        <h1 className="m-0 mt-[22px] font-heading text-[clamp(34px,5.6vw,64px)] font-black uppercase leading-[0.98] tracking-[-0.01em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
          Garage Door Won&apos;t Open?
          <br />
          We&apos;ll Be There{" "}
          <span className="inline-block bg-accent px-3 text-white">Fast</span>
        </h1>
        <p className="mx-auto mt-[22px] max-w-[640px] text-[clamp(17px,2.1vw,20px)] font-medium leading-[1.55] text-white/90">
          Broken springs, doors off the track, openers that quit. We fix it, usually the
          same day and often within a couple of hours, right here across Tampa Bay.
        </p>
        <div className="mt-[30px] flex flex-wrap justify-center gap-[13px]">
          <a
            href={SITE.bookingHref}
            className="rounded-[7px] bg-accent px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline shadow-[0_12px_26px_rgba(184,32,42,0.4)]"
          >
            Book a Repair
          </a>
          <a
            href={SITE.phoneHref}
            className="inline-flex items-center gap-2.5 rounded-[7px] bg-white px-[30px] py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline"
          >
            <Phone className="h-[18px] w-[18px] text-accent" strokeWidth={2.2} />
            Call {SITE.phoneDisplay}
          </a>
        </div>
        <div className="mt-[26px] text-[12.5px] font-extrabold uppercase tracking-[0.12em] text-white/[0.78]">
          Licensed and Insured · Same Day Service · Serving 6 Cities
        </div>
      </div>
    </section>
  );
}
