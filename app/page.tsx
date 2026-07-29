import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { SITE, ROUTES, BRAND_CATALOG, asset } from "@/lib/site";
import { AutoplayVideo } from "@/components/autoplay-video";
import { BookOnlineButton } from "@/components/book-online-button";
import { TrustStrip } from "@/components/blocks/trust-strip";
import { ServiceAreaMap } from "@/components/blocks/service-area-map";
import { ServiceAreaProvider, ServiceAreaChecker, ServiceAreaMapMarker } from "@/components/service-area-checker";
import { Reveal } from "@/components/blocks/reveal";

export const metadata: Metadata = {
  title: "Garage Door Repair Tampa Bay | Trinity Garage Door Service",
  description:
    "Fast, honest garage door repair across Tampa Bay. Broken springs, off track doors, and dead openers fixed same day, often within hours. Family owned since 2007. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/" },
};

const ico = (size: number, paths: ReactNode, sw: number | string = 2) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{paths}</svg>
);

const whyCards: { icon: ReactNode; title: string; body: string }[] = [
  { icon: ico(26, (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>)), title: "24/7 Response", body: "A real person day or night for emergencies." },
  { icon: ico(26, (<><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7-7V3h6.6l7.4 7.4a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" /></>)), title: "Upfront Pricing", body: "A clear price before we start; no surprises." },
  { icon: ico(26, (<><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>)), title: "Licensed & Insured", body: "FL GD13010 / GDI-09484, bonded & insured." },
  { icon: ico(26, <path d="M13 2L4 14h6l-1 8 9-12h-6z" />), title: "Same Day Service", body: "Most repairs done the same day, often within hours." },
];

/**
 * Homepage stats. Every figure here must be defensible:
 *  - Years:  derived from SITE.foundedYear, so it cannot go stale.
 *  - 12k+:   lifetime figure. Housecall Pro only holds records from Oct 2019 (7,673 jobs since),
 *            so it neither proves nor disproves this. Left as the client's own claim.
 *  - 5.0★:   Google Business Profile, checked 2026-07-28. HCP has no reviews endpoint, so this
 *            is hand maintained. Re-check the rating AND the count together before each launch.
 *  - 5:      counties in Trinity's real Housecall Pro service zone (130 zips, 41 cities).
 *            Counties rather than cities so the number stays consistent with a nav that lists 6.
 */
const stats = [
  { v: <>{new Date().getFullYear() - SITE.foundedYear}<span className="text-accent">+</span></>, label: "Years of Service" },
  { v: <>12k<span className="text-accent">+</span></>, label: "Doors Serviced" },
  { v: <>5.0<span className="text-accent">★</span></>, label: "From 597 Reviews" },
  { v: <>5</>, label: "Counties Covered" },
];

/**
 * Real before/after pairs from the client's own job archive (public/work/). This band previously
 * shipped a visible "Before photo coming soon" placeholder because no before shots were on hand;
 * the pairs were recovered by splitting the original side-by-side and stacked composites.
 */
const beforeAfter = [
  { title: "Dated Door Replaced", base: "ba-dark-to-white", alt: "a dated dark garage door replaced with a white sectional" },
  { title: "Boarded Up To Finished", base: "ba-boarded-to-new", alt: "a boarded up garage opening finished with a new white door" },
  { title: "Dented Panels Replaced", base: "ba-dented-to-new", alt: "a dented garage door replaced with a straight new door" },
];

const cities: { name: string; slug: string }[] = [
  { name: "Lutz", slug: "lutz" },
  { name: "Land O' Lakes", slug: "land-o-lakes" },
  { name: "Wesley Chapel", slug: "wesley-chapel" },
  { name: "Palm Harbor", slug: "palm-harbor" },
  { name: "Oldsmar", slug: "oldsmar" },
  { name: "Tampa", slug: "tampa" },
];

// Real Google reviews (verbatim) — replaces the design's sample placeholders (content rule: never invent).
const reviews = [
  { quote: "David was fast, knowledgeable, and professional on getting our garage door back in perfect working order.", name: "Jonathan B." },
  { quote: "Jason was great no high pressure sales and very good pricing. Joey did a great installation. Very professional. I would definitely use them again", name: "Charles Cohn" },
  { quote: "Diagnosed the problem quickly and made simple repair.", name: "Ron Sompels" },
  { quote: "The original quote was honored. The work was scheduled and completed in the timeframe I needed. My installer Joey was on time, knowledgeable, professional but friendly.", name: "Lynn Rosenthal" },
];

/** Actual posts from the Trinity Instagram feed (public/social/), so the grid matches the profile. */
const igTiles = [
  { img: "/social/ig-crew-on-site.jpg", alt: "Trinity crew on a job in branded shirts" },
  { img: "/social/ig-tech-hardware-repair.jpg", alt: "Trinity technician repairing garage door hardware" },
  { img: "/social/ig-tech-on-ladder.jpg", alt: "Trinity technician on a ladder servicing a door" },
  { img: "/social/ig-tech-carrying-spring.jpg", alt: "Trinity technician carrying a replacement torsion spring" },
  { img: "/social/ig-dark-door-home.jpg", alt: "A dark garage door on a Tampa Bay home" },
  { img: "/social/ig-black-doors-home.jpg", alt: "Black garage doors on a Florida home" },
];

const eyebrowCls = "text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent";

export default function HomePage() {
  const IG = "https://www.instagram.com/trinitygaragedoorservice/";
  return (
    <>
      {/* HERO (video) */}
      <section className="relative overflow-hidden border-b-[5px] border-accent px-6 py-[128px] max-nav:py-[92px]">
        <div className="absolute inset-0 z-0">
          <AutoplayVideo src={asset("hero-video.mp4")} poster={asset("door-after-brown-dusk-2car.jpg")} className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(180deg, rgb(10 10 10 / calc(var(--ov) * .72)) 0%, rgb(10 10 10 / calc(var(--ov) * .9)) 55%, rgb(10 10 10 / var(--ov)) 100%)" }} />
        <div className="relative z-[2] mx-auto max-w-[1000px] text-center">
          <div className="flex items-center justify-center gap-3.5">
            <span className="h-1 w-[52px] bg-accent" />
            <span className="text-[13px] font-extrabold uppercase tracking-[0.22em] text-white">Opening Doors Since 2007 · Tampa Bay</span>
            <span className="h-1 w-[52px] bg-accent" />
          </div>
          <h1 className="mt-[22px] font-display text-[clamp(34px,5.6vw,64px)] font-black uppercase leading-[0.98] tracking-[-0.01em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
            Garage Door Won&apos;t Open?<br />We&apos;ll Be There <span className="inline-block bg-accent px-3 text-white">Fast</span>
          </h1>
          <p className="mx-auto mt-[22px] max-w-[640px] text-[clamp(17px,2.1vw,20px)] font-medium leading-[1.55] text-white/90">
            Fast, honest garage door repair across Tampa Bay, broken springs, off track doors, and dead openers fixed same day, often within hours.
          </p>
          <div className="mt-[30px] flex flex-wrap justify-center gap-[13px]">
            <Link href={ROUTES.bookRepair} className="rounded-[7px] bg-accent px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline shadow-[0_12px_26px_rgba(184,32,42,0.4)] hover:bg-accent-dark">Book a Repair</Link>
            <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 rounded-[7px] bg-white px-[30px] py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline">
              <Phone className="h-[18px] w-[18px] text-accent" strokeWidth={2.2} /> Call {SITE.phoneDisplay}
            </a>
          </div>
          <div className="mt-[26px] text-[12.5px] font-extrabold uppercase tracking-[0.12em] text-white/[0.78]">Licensed &amp; Insured · Same Day Service · 5 Counties Covered</div>
        </div>
      </section>

      <TrustStrip />

      {/* ABOUT / INTRO SPLIT */}
      <section id="about" className="bg-white scroll-mt-24">
        <div className="mx-auto max-w-[1200px] px-5 py-[92px] nav:px-8">
          <Reveal>
            <div className="grid items-center gap-14 nav:grid-cols-[1fr_1.05fr]">
              <div>
                <div className="inline-flex items-center gap-2.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">
                  <span className="h-[3px] w-[30px] bg-accent" /> About Trinity
                </div>
                <h2 className="mt-4 font-display text-[clamp(27px,3.6vw,42px)] font-extrabold uppercase leading-[1.02] tracking-[-0.01em] text-ink">Doors That Just Work, From People Who Show Up</h2>
                <p className="mt-5 max-w-[480px] text-[17.5px] leading-[1.62] text-body">
                  Trinity Garage Door Service is a family owned team that&apos;s kept Tampa Bay&apos;s garage doors running since 2007. No call centers, no pressure, just licensed local technicians, upfront pricing, and work we stand behind.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  {["Family owned, local techs, no call center runaround", "Upfront pricing before any work begins"].map((t, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="mt-px flex h-6 w-6 flex-none items-center justify-center bg-accent">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      </span>
                      <span className="text-[16.5px] font-semibold text-ink">{t}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-7">
                  <Link href={ROUTES.aboutStory} className="inline-flex items-center gap-2.5 rounded-[7px] bg-ink px-[26px] py-[15px] text-[14px] font-extrabold uppercase tracking-[0.04em] text-white no-underline">
                    Learn Our Story <ArrowRight className="h-[17px] w-[17px] text-accent" strokeWidth={2.6} />
                  </Link>
                </div>
              </div>
              <div className="relative">
                {/* Same file as the /about/our-story/ hero, deliberately. It is the same
                    photograph (verified pixel wise, mean difference ~1/255), so shipping a second
                    copy would have cost 200 KB for nothing.
                    next.config.ts sets images.unoptimized, so this file IS what the visitor
                    downloads. Re-encoding was tested at several sizes and qualities and every
                    attempt came out LARGER, so it is committed exactly as supplied. */}
                {/* The height drops below the nav breakpoint on purpose. A fixed 430px against a
                    ~350px wide phone makes a PORTRAIT box for a landscape photo, and object-cover
                    then throws away the sides: at 430px two of the six people are cropped out
                    entirely and a third is cut in half. 260px puts the box back near the photo's
                    own 1.5 aspect, so almost nothing is lost. */}
                <Image src={"/team/team-in-office.jpg"} alt="The Trinity Garage Door Service team in their Lutz office" width={2048} height={1366} className="h-[430px] w-full rounded-[8px] border-2 border-ink object-cover max-nav:h-[260px]" priority={false} />
                <div className="absolute -right-4 -top-4 rounded-[8px] border-2 border-ink bg-accent px-[18px] py-3.5 text-center">
                  <div className="font-display text-[32px] font-black leading-none text-white">{SITE.yearsLabel}</div>
                  <div className="mt-[3px] text-[10.5px] font-extrabold uppercase leading-tight tracking-[0.06em] text-white">Years in<br />Tampa Bay</div>
                </div>
                <div className="absolute -bottom-[34px] -left-[26px] w-[168px] rounded-[8px] border-2 border-accent bg-ink p-2.5 max-nav:hidden">
                  {/* width MUST equal the parent's content box or next/image warns that one
                      dimension was modified and the other was not: 168px wide, less the 2px
                      border each side, less p-2.5 (10px) each side = 144. */}
                  <Image src={"/team/owner-jason-grunder.jpg"} alt="Jason, Owner" width={144} height={190} className="block h-[190px] w-full rounded-[6px] bg-[#2a2a2a] object-cover object-top" />
                  <div className="mt-2 text-center text-[15px] font-extrabold uppercase tracking-[0.03em] text-white">Jason · Owner</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PARTNER LOGOS MARQUEE */}
      <section id="services" className="border-y-2 border-ink bg-cream scroll-mt-24">
        <div className="mx-auto max-w-[1200px] py-14">
          <Reveal>
            <div className="px-8 text-center">
              <div className={eyebrowCls}>Who We Work With</div>
              <h2 className="mt-2.5 font-display text-[clamp(24px,3vw,34px)] font-extrabold uppercase leading-[1.05] text-ink">Trusted Brands &amp; Partners</h2>
            </div>
          </Reveal>
          <div className="bt-marquee-mask mt-[34px] overflow-hidden">
            <div className="bt-marquee">
              {[...BRAND_CATALOG, ...BRAND_CATALOG].map((b, i) => (
                <span key={i} aria-hidden={i >= BRAND_CATALOG.length} className="flex h-[88px] w-[172px] flex-none items-center justify-center rounded-[8px] border-2 border-ink bg-white p-4">
                  <Image src={asset(b.logo)} alt={i >= BRAND_CATALOG.length ? "" : b.name} width={130} height={56} className="max-h-full w-auto object-contain" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY US (dark) */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[92px] nav:px-8">
          <Reveal>
            <div className="mx-auto max-w-[640px] text-center">
              <div className={eyebrowCls}>Why Homeowners Call Us First</div>
              <h2 className="mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.04] text-white">Built Around Your Emergency, Not Ours</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[46px] grid gap-5 grid-cols-4 max-nav:grid-cols-2 max-xs:grid-cols-1">
              {whyCards.map((c, i) => (
                <div key={i} className="rounded-[8px] border border-[#333] border-t-4 border-t-accent bg-[#222] p-[28px_24px]">
                  <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[8px] bg-accent text-white">{c.icon}</div>
                  <h3 className="mt-[18px] font-display text-[18px] font-bold uppercase text-white">{c.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.55] text-[#a8a8a8]">{c.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS + CLIP */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-20 nav:px-8">
          <Reveal>
            <div className="grid grid-cols-4 overflow-hidden rounded-[8px] border-2 border-ink max-xs:grid-cols-2">
              {stats.map((s, i) => (
                <div key={i} className={`px-4 py-[30px] text-center ${i < stats.length - 1 ? "border-r-2 border-ink" : ""} max-xs:[&:nth-child(2)]:border-r-0 max-xs:[&:nth-child(-n+2)]:border-b-2 max-xs:border-ink`}>
                  <div className="font-display text-[clamp(32px,4vw,46px)] font-black leading-none text-ink">{s.v}</div>
                  <div className="mt-2 text-[12.5px] font-extrabold uppercase tracking-[0.06em] text-[#666]">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="relative mt-10 overflow-hidden rounded-[8px] border-2 border-ink">
              <AutoplayVideo src={asset("clip-door-opening.mp4")} poster={asset("door-after-white-2car-home.jpg")} className="block h-[clamp(280px,46vw,440px)] w-full object-cover" />
              <span className="absolute bottom-[18px] left-0 bg-accent px-4 py-[9px] text-[12.5px] font-extrabold uppercase tracking-[0.06em] text-white">Watch a finished door open smoothly</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* BEFORE / AFTER (dark) */}
      <section className="bg-ink border-t-[5px] border-accent">
        <div className="mx-auto max-w-[1200px] px-5 py-[92px] nav:px-8">
          <Reveal>
            <div className="mx-auto max-w-[640px] text-center">
              <div className={eyebrowCls}>Real Jobs, Real Results</div>
              <h2 className="mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.04] text-white">Before &amp; After, Around Tampa Bay</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[46px] grid gap-[22px] grid-cols-3 max-nav:grid-cols-1">
              {beforeAfter.map((b, i) => (
                <div key={i} className="overflow-hidden rounded-[8px] border border-[#333] bg-[#222]">
                  <div className="px-[18px] pt-4"><div className="font-display text-[17px] font-bold uppercase text-white">{b.title}</div></div>
                  <div className="px-[18px] pt-3">
                    <div className="relative h-[150px] overflow-hidden rounded-[6px]">
                      <Image src={`/work/${b.base}-before.jpg`} alt={`Before: ${b.alt}`} fill sizes="(max-width:920px) 100vw, 380px" className="object-cover" />
                      <span className="absolute left-2 top-2 bg-black px-2 py-[3px] text-[10px] font-extrabold tracking-[0.06em] text-white">BEFORE</span>
                    </div>
                  </div>
                  <div className="my-1.5 text-center text-[20px] text-accent">↓</div>
                  <div className="px-[18px] pb-[18px]">
                    <div className="relative h-[150px] overflow-hidden rounded-[6px]">
                      <Image src={`/work/${b.base}-after.jpg`} alt={`After: ${b.alt}`} fill sizes="(max-width:920px) 100vw, 380px" className="object-cover" />
                      <span className="absolute left-2 top-2 bg-accent px-2 py-[3px] text-[10px] font-extrabold tracking-[0.06em] text-white">AFTER</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICE AREA MAP */}
      <section id="areas" className="bg-white scroll-mt-24">
        <div className="mx-auto max-w-[1200px] px-5 py-[92px] nav:px-8">
          <Reveal>
            {/* Copy leads, map supports. The real footprint is portrait (taller than wide), which
                is the actual shape of their zone, so the map column is the narrower one.
                The provider is only sharing the checked zip between the checker and the map
                marker; the map itself stays a server component passed through as children. */}
            <ServiceAreaProvider>
              <div className="grid items-center gap-11 nav:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <div className={eyebrowCls}>Service Areas</div>
                  <h2 className="mt-3 font-display text-[clamp(26px,3.2vw,38px)] font-extrabold uppercase leading-[1.04] text-ink">We Cover the Whole Tampa Bay Area</h2>
                  <p className="mt-3.5 text-[16.5px] leading-[1.58] text-body">Local techs based in Lutz means shorter drive times across Hillsborough, Pinellas, Pasco, Hernando and Polk. That is 130 zip codes and 41 towns.</p>
                  <ServiceAreaChecker className="mt-[22px]" />
                  <div className="mt-[22px] flex flex-wrap gap-2.5">
                    {cities.map((c) => (
                      <Link key={c.slug} href={`/service-areas/${c.slug}/`} className="rounded-[6px] border-2 border-ink px-4 py-2.5 text-[14px] font-bold text-ink no-underline transition-colors hover:bg-ink hover:text-white">{c.name}</Link>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Link href={ROUTES.serviceAreas} className="text-[14.5px] font-bold text-accent no-underline hover:underline">See all service areas</Link>
                    <span className="text-[14.5px] font-medium text-body">
                      or call <a href={SITE.phoneHref} className="font-bold text-accent no-underline">{SITE.phoneDisplay}</a>
                    </span>
                  </div>
                </div>
                <ServiceAreaMap className="max-w-[430px] max-nav:mx-auto">
                  <ServiceAreaMapMarker />
                </ServiceAreaMap>
              </div>
            </ServiceAreaProvider>
          </Reveal>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-cream border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[92px] nav:px-8">
          <Reveal>
            <div className="mx-auto max-w-[640px] text-center">
              <div className={eyebrowCls}>Reviews</div>
              <h2 className="mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.04] text-ink">Neighbors Who Trust Trinity</h2>
              <p className="mt-2.5 text-[13.5px] font-semibold text-[#8a8a8a]">A few of the reviews folks have left us on Google. <Link href={ROUTES.reviewsPage} className="font-bold text-accent no-underline">Read more</Link>.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[42px] grid items-start gap-5 grid-cols-4 max-nav:grid-cols-2 max-xs:grid-cols-1">
              {reviews.map((r, i) => (
                <div key={i} className="rounded-[8px] border-2 border-ink bg-white p-[24px_22px]">
                  <div className="text-[15px] tracking-[2px] text-accent">★★★★★</div>
                  <p className="mt-3.5 text-[16px] font-semibold leading-[1.5] text-ink">&ldquo;{r.quote}&rdquo;</p>
                  <div className="mt-[18px] flex items-center gap-[11px]">
                    <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[6px] bg-ink text-[15px] font-extrabold text-white">{r.name[0]}</span>
                    <div>
                      <div className="text-[14px] font-extrabold text-ink">{r.name}</div>
                      <div className="text-[12px] font-semibold text-[#8a8a8a]">Google</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* BOOKING BAND (dark) */}
      <section id="book" className="bg-ink border-t-[5px] border-accent scroll-mt-20">
        <div className="mx-auto max-w-[1200px] px-5 py-[92px] nav:px-8">
          <Reveal>
            <div className="grid items-center gap-[50px] nav:grid-cols-2">
              <div>
                <div className={eyebrowCls}>Book Now</div>
                <h2 className="mt-3 font-display text-[clamp(28px,3.8vw,46px)] font-extrabold uppercase leading-none text-white">Book Your Repair in Under a Minute</h2>
                <p className="mt-4 max-w-[430px] text-[17.5px] leading-[1.58] text-[#a8a8a8]">Pick a time that works for you and a local tech will be there, usually the same day.</p>
                <a href={SITE.phoneHref} className="mt-[26px] inline-flex items-center gap-3.5 rounded-[8px] border-2 border-[#333] bg-[#222] px-5 py-4 no-underline">
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-[7px] bg-accent text-white"><Phone className="h-[22px] w-[22px]" strokeWidth={2} /></span>
                  <span>
                    <span className="block text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-[#9a9a9a]">Prefer to call? 24/7</span>
                    <span className="block font-display text-[23px] font-extrabold text-white">{SITE.phoneDisplay}</span>
                  </span>
                </a>
              </div>
              {/* Real booking hand-off. This used to render a mock calendar hardcoded to a fixed
                  month with fake time slots, which went stale and read as a broken widget. Live
                  availability comes from Housecall Pro, so we frame it and hand off. */}
              <div className="rounded-[8px] border-2 border-ink bg-white p-[26px]">
                <div className="flex items-center justify-between">
                  <h3 className="m-0 font-display text-[19px] font-extrabold uppercase text-ink">Book Online</h3>
                  <span className="rounded-[5px] bg-cream px-2.5 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.06em] text-[#6a6a6a]">Housecall Pro</span>
                </div>
                <p className="mt-3 text-[15px] leading-[1.55] text-body">
                  Real availability from our schedule. Pick the service and a window that suits you, and you get a confirmation straight away.
                </p>
                <ol className="mt-[18px] flex list-none flex-col gap-3 p-0">
                  {[
                    { t: "Tell us what is going on", d: "Repair, tune up, opener, or a new door." },
                    { t: "Pick your time", d: "Live openings, including same day when we have it." },
                    { t: "We confirm and show up", d: "Text and email confirmation, no phone tag." },
                  ].map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-[6px] bg-accent font-display text-[13px] font-extrabold text-white">{i + 1}</span>
                      <span>
                        <span className="block text-[14.5px] font-extrabold text-ink">{s.t}</span>
                        <span className="block text-[13.5px] leading-[1.5] text-body">{s.d}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <BookOnlineButton className="mt-[22px] block w-full rounded-[7px] bg-accent py-[15px] text-center text-[15px] font-extrabold uppercase tracking-[0.04em] text-white">
                  Book Online Now
                </BookOnlineButton>
                <Link href={ROUTES.bookRepair} className="mt-3 block text-center text-[13.5px] font-bold text-[#6a6a6a] no-underline hover:text-accent">
                  See how booking works
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* INSTAGRAM GRID */}
      <section className="bg-white border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[92px] nav:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-[18px]">
              <div>
                <div className="inline-flex items-center gap-2.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" /></svg> Follow Us
                </div>
                <h2 className="mt-2 font-display text-[clamp(22px,3vw,34px)] font-extrabold uppercase leading-[1.04] text-ink">@trinitygaragedoorservice</h2>
              </div>
              <a href={IG} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-[7px] bg-ink px-6 py-3.5 text-[14px] font-extrabold uppercase tracking-[0.04em] text-white no-underline">
                Follow on Instagram <ArrowRight className="h-4 w-4" strokeWidth={2.6} />
              </a>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[30px] grid grid-cols-6 gap-3 max-nav:grid-cols-3 max-xs:grid-cols-2">
              {igTiles.map((t, i) => (
                <a key={i} href={IG} target="_blank" rel="noopener noreferrer" className="relative block aspect-square overflow-hidden rounded-[8px] border-2 border-ink">
                  <Image src={t.img} alt={t.alt} fill sizes="(max-width:560px) 50vw, (max-width:920px) 33vw, 180px" className="object-cover" />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* BIG RED CTA */}
      <section className="bg-accent text-white">
        <Reveal>
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-8 px-5 py-[72px] nav:px-8">
            <div>
              <h2 className="m-0 max-w-[620px] font-display text-[clamp(27px,3.8vw,44px)] font-black uppercase leading-none">Don&apos;t Wait, Get Your Door Fixed Today</h2>
              <p className="mt-3 text-[17px] font-medium text-white/90">Same day slots fill fast, book online or call our 24/7 line.</p>
            </div>
            <div className="flex flex-wrap gap-[13px]">
              <Link href={ROUTES.bookRepair} className="rounded-[7px] bg-white px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-accent no-underline">Book a Repair</Link>
              <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 rounded-[7px] border-2 border-white px-7 py-4 text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline hover:bg-white hover:text-accent">
                <Phone className="h-[18px] w-[18px]" strokeWidth={2.2} /> {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
