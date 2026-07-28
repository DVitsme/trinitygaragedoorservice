import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE, ROUTES } from "@/lib/site";
import { PhotoHero } from "@/components/blocks/hero";
import { Breadcrumb } from "@/components/blocks/primitives";
import { TrustStrip } from "@/components/blocks/trust-strip";
import { Reveal } from "@/components/blocks/reveal";

export const metadata: Metadata = {
  title: "Portfolio | Trinity Garage Door Service Tampa Bay",
  description:
    "Real garage door installs, replacements, and repairs by Trinity around Tampa Bay. No stock photos, just our work. Free estimates. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/about/portfolio/" },
};

const breadcrumb = [{ label: "Home", href: "/" }, { label: "About", href: ROUTES.aboutStory }, { label: "Portfolio" }];

/**
 * Real job photography from public/work/, curated from the client's own archive. The hero on this
 * page promises "no stock photos", so everything below is an actual Trinity job. The before/after
 * pairs were recovered by splitting the original side-by-side and stacked composites.
 */
const work = (f: string) => `/work/${f}`;

const installs = [
  { img: "work-black-long-panel-2car.jpg", alt: "A new black long panel two car garage door on a Tampa Bay home", tag: "New Install", cap: "Black long panel, two car" },
  { img: "work-white-window-row.jpg", alt: "A white garage door with a row of windows across the top panel", tag: "New Install", cap: "White door with window row" },
  { img: "work-brown-raised-panel.jpg", alt: "A brown raised panel garage door on a Tampa Bay home", tag: "Replacement", cap: "Brown raised panel" },
  { img: "work-white-on-blue-home.jpg", alt: "A fresh white garage door on a blue Florida home", tag: "New Install", cap: "White door, blue home" },
  { img: "work-black-long-panel-shrubs.jpg", alt: "A black long panel garage door framed by shrubs", tag: "Replacement", cap: "Black long panel" },
  { img: "work-white-on-green-home.jpg", alt: "A new white garage door on a green sided home", tag: "New Install", cap: "White door, green siding" },
  { img: "work-brown-raised-panel-wide.jpg", alt: "A wide brown raised panel garage door on a brick home", tag: "Replacement", cap: "Brown raised panel, wide" },
  { img: "work-white-2car-clean.jpg", alt: "A clean white two car garage door on a Florida home", tag: "New Install", cap: "White two car door" },
  { img: "work-white-dark-trim.jpg", alt: "A white garage door set against dark exterior trim", tag: "Replacement", cap: "White door, dark trim" },
  { img: "work-white-2car-brick-drive.jpg", alt: "A white two car garage door above a brick paver driveway", tag: "New Install", cap: "White door, brick driveway" },
  { img: "work-two-doors-brick-drive.jpg", alt: "Two white garage doors on a home with a brick paver driveway", tag: "New Install", cap: "Matching pair of doors" },
  { img: "work-white-on-blue-block.jpg", alt: "A white garage door on a blue block Florida home", tag: "Replacement", cap: "White door, block home" },
];

const repairs = [
  { img: "work-interior-opener.jpg", alt: "A garage door opener unit mounted above a finished white door", tag: "Opener", cap: "Opener install, inside view" },
  { img: "work-interior-track-rails.jpg", alt: "Garage door track and rail hardware inside a finished garage", tag: "Hardware", cap: "New track and rails" },
  { img: "work-interior-window-panels.jpg", alt: "The inside of a garage door with a row of window panels", tag: "Install", cap: "Window panel door, inside" },
  { img: "work-interior-open-door.jpg", alt: "An open garage door showing the rail and rollers from inside", tag: "Repair", cap: "Rollers and rail, open" },
  { img: "work-newbuild-framing.jpg", alt: "A new construction garage opening framed and ready for a door", tag: "New Build", cap: "New construction opening" },
  { img: "work-white-wood-frame.jpg", alt: "A white garage door fitted into a timber framed opening", tag: "Install", cap: "Fitted to timber frame" },
];

/** Genuine before/after pairs from the same job, recovered from the client's composites. */
const beforeAfter = [
  { base: "ba-dark-to-white", cap: "Dated dark door to a clean white sectional", alt: "garage door replaced with a white sectional door" },
  { base: "ba-boarded-to-new", cap: "Boarded up opening to a finished door", alt: "boarded up garage opening replaced with a finished white door" },
  { base: "ba-dented-to-new", cap: "Dented panels to a straight new door", alt: "dented garage door replaced with a straight new door" },
  { base: "ba-carport-to-new", cap: "Open carport to an enclosed garage", alt: "open carport converted to an enclosed garage with a new door" },
];

const eyebrowCls = "text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent";

function GalleryCard({ img, alt, tag, cap }: { img: string; alt: string; tag: string; cap: string }) {
  return (
    <div className="group relative h-[260px] overflow-hidden rounded-[10px] border-2 border-ink bg-ink">
      <Image src={work(img)} alt={alt} fill sizes="(max-width:560px) 100vw, (max-width:920px) 50vw, 380px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(10,10,10,0.85))] px-[18px] pb-3.5 pt-[30px]">
        <span className="mb-[7px] inline-block rounded-[4px] bg-accent px-2 py-[3px] font-display text-[10px] font-extrabold uppercase tracking-[0.06em] text-white">{tag}</span>
        <b className="block text-[15px] font-bold text-white">{cap}</b>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <>
      <PhotoHero
        media={<Image src={work("work-black-long-panel-2car.jpg")} alt="A finished Trinity garage door installation in Tampa Bay" fill sizes="100vw" priority className="object-cover" />}
        breadcrumb={<Breadcrumb items={breadcrumb} />}
        eyebrow="Our Work"
      >
        <h1 className="m-0 mt-[18px] max-w-[920px] font-display text-[clamp(34px,5.6vw,64px)] font-black uppercase leading-[0.98] tracking-[-0.015em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
          Real Doors, <span className="inline-block bg-accent px-3 text-white">Real Driveways</span>
        </h1>
        <p className="mt-6 max-w-[660px] text-[clamp(17px,2.1vw,21px)] font-medium leading-[1.55] text-white/90">Every photo on this page is a real job our crew did somewhere around Tampa Bay. No stock photos, no catalog renders. Doors we&apos;ve installed, replaced, and repaired across Lutz, Wesley Chapel, Tampa, and the rest of the bay.</p>
        <div className="mt-[30px] flex flex-wrap gap-[13px]">
          <Link href={ROUTES.estimate} className="rounded-[7px] bg-accent px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline shadow-[0_12px_26px_rgba(184,32,42,0.4)] hover:bg-accent-dark">Request a Free Estimate</Link>
          <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 rounded-[7px] bg-white px-[30px] py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline">
            <Phone className="h-[18px] w-[18px] text-accent" strokeWidth={2.2} /> Call {SITE.phoneDisplay}
          </a>
        </div>
      </PhotoHero>

      <TrustStrip />

      {/* NEW INSTALLS & REPLACEMENTS */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 pb-10 pt-[84px] nav:px-8">
          <Reveal>
            <div className="max-w-[720px]">
              <div className={eyebrowCls}>New Installs &amp; Replacements</div>
              <h2 className="mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03] text-ink">When A Door Changes The Whole House</h2>
              <p className="mt-3.5 text-[16.5px] leading-[1.6] text-body">Some on new builds, some in place of a door that finally gave out. Steel, wood look, carriage style, single and double, we&apos;ve worked on most of what Tampa Bay puts on a garage. Weighing a new door? Our <Link href={ROUTES.doorTypes} className="font-bold text-accent no-underline">door types and styles</Link> page breaks down the looks.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-9 grid gap-[18px] grid-cols-3 max-nav:grid-cols-2 max-xs:grid-cols-1">
              {installs.map((g, i) => <GalleryCard key={i} {...g} />)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* REPAIRS THAT BROUGHT A DOOR BACK */}
      <section className="bg-cream border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[84px] nav:px-8">
          <Reveal>
            <div className="max-w-[720px]">
              <div className={eyebrowCls}>Repairs That Brought A Door Back</div>
              <h2 className="mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03] text-ink">Not Every Job Is A New Door</h2>
              <p className="mt-3.5 text-[16.5px] leading-[1.6] text-body">A fresh set of springs, a realigned track, an opener that finally runs quiet again. The door you already have is often worth saving, and these are some of the ones we saved.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-9 grid gap-[18px] grid-cols-3 max-nav:grid-cols-2 max-xs:grid-cols-1">
              {repairs.map((g, i) => <GalleryCard key={i} {...g} />)}
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[18px] text-[12.5px] font-semibold text-[#8a8a8a]">Real jobs around Tampa Bay. Captions are kept general where the exact city or door model isn&apos;t confirmed.</div>
          </Reveal>
        </div>
      </section>

      {/* BEFORE & AFTER (real pairs, same job) */}
      <section className="border-t-2 border-ink bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-[84px] nav:px-8">
          <Reveal>
            <div className="max-w-[720px]">
              <div className={eyebrowCls}>Before &amp; After</div>
              <h2 className="mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03] text-ink">Same Driveway, Different Day</h2>
              <p className="mt-3.5 text-[16.5px] leading-[1.6] text-body">These are the same house photographed twice, once before we started and once after we finished. Nothing staged and nothing swapped out.</p>
            </div>
          </Reveal>
          <div className="mt-9 grid gap-7 grid-cols-2 max-nav:grid-cols-1">
            {beforeAfter.map((b, i) => (
              <Reveal key={b.base} delay={(i % 2) * 0.05}>
                <figure className="m-0 overflow-hidden rounded-[10px] border-2 border-ink bg-white">
                  <div className="grid grid-cols-2">
                    {(["before", "after"] as const).map((side) => (
                      <div key={side} className={`relative h-[210px] max-xs:h-[170px] ${side === "before" ? "border-r-2 border-ink" : ""}`}>
                        <Image
                          src={work(`${b.base}-${side}.jpg`)}
                          alt={`${side === "before" ? "Before" : "After"}: ${b.alt}`}
                          fill
                          sizes="(max-width:920px) 50vw, 290px"
                          className="object-cover"
                        />
                        <span className={`absolute left-2.5 top-2.5 rounded-[4px] px-2 py-[3px] font-display text-[10px] font-extrabold uppercase tracking-[0.06em] text-white ${side === "before" ? "bg-ink/85" : "bg-accent"}`}>
                          {side}
                        </span>
                      </div>
                    ))}
                  </div>
                  <figcaption className="border-t-2 border-ink px-[18px] py-3.5 text-[14.5px] font-bold text-ink">{b.cap}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-accent text-white">
        <Reveal>
          <div className="mx-auto max-w-[1200px] px-5 py-[74px] text-center nav:px-8">
            <h2 className="m-0 font-display text-[clamp(28px,4vw,46px)] font-black uppercase leading-none">See A Door You Like?</h2>
            <p className="mx-auto mt-4 max-w-[640px] text-[17.5px] font-medium leading-[1.55] text-white/90">If something here looks right for your house, we can help you get there. Call (813) 279-6785 for a free estimate, or send us a few photos of your current door and we&apos;ll tell you what your options are.</p>
            <div className="mt-[30px] flex flex-wrap justify-center gap-[13px]">
              <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 rounded-[7px] bg-white px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-accent no-underline">
                <Phone className="h-[18px] w-[18px] text-accent" strokeWidth={2.2} /> Call {SITE.phoneDisplay}
              </a>
              <Link href={ROUTES.estimate} className="rounded-[7px] border-2 border-white px-7 py-4 text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline hover:bg-white hover:text-ink">Request a Free Estimate</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
