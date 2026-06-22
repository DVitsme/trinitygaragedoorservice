import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { SITE, ROUTES, BRAND_CATALOG, asset } from "@/lib/site";
import { AutoplayVideo } from "@/components/autoplay-video";
import { TrustStrip } from "@/components/blocks/trust-strip";
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

const stats = [
  { v: <>18<span className="text-accent">+</span></>, label: "Years of Service" },
  { v: <>12k<span className="text-accent">+</span></>, label: "Doors Serviced" },
  { v: <>4.9<span className="text-accent">★</span></>, label: "Average Rating" },
  { v: <>6</>, label: "Cities Covered" },
];

const beforeAfter = [
  { title: "White Door · New Build", img: "door-after-white-on-blue-home.jpg", alt: "Finished white garage door on a blue home" },
  { title: "Sectional Replacement", img: "door-after-brown-wood-sectional.jpg", alt: "Finished brown wood look sectional garage door" },
  { title: "Two Car Upgrade", img: "door-after-white-2car-home.jpg", alt: "Finished white two car garage door" },
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

const igTiles = [
  { img: "jobsite-tech-at-residential-garage.jpg", alt: "Trinity tech at a residential garage" },
  { img: "jobsite-tech-installing-opener.jpg", alt: "Trinity tech installing an opener" },
  { img: "jobsite-two-techs-on-ladder.jpg", alt: "Two Trinity techs on a ladder" },
  { img: "jobsite-tech-crouching-repair.jpg", alt: "Trinity tech on a hands on repair" },
  { img: "jobsite-tech-working-dusk.jpg", alt: "Trinity tech working at dusk" },
  { img: "team-with-branded-banner.jpg", alt: "Trinity team with branded banner" },
];

const mapPins = [
  { left: "29%", top: "34%" }, { left: "51%", top: "27%" }, { left: "44%", top: "53%" },
  { left: "64%", top: "60%" }, { left: "38%", top: "72%" },
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
            <a href="#book" className="rounded-[7px] bg-accent px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline shadow-[0_12px_26px_rgba(184,32,42,0.4)] hover:bg-accent-dark">Book a Repair</a>
            <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 rounded-[7px] bg-white px-[30px] py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline">
              <Phone className="h-[18px] w-[18px] text-accent" strokeWidth={2.2} /> Call {SITE.phoneDisplay}
            </a>
          </div>
          <div className="mt-[26px] text-[12.5px] font-extrabold uppercase tracking-[0.12em] text-white/[0.78]">Licensed &amp; Insured · Same Day Service · 6 Cities Covered</div>
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
                <Image src={asset("team-group-in-showroom.jpg")} alt="The Trinity Garage Door team in their Tampa Bay showroom" width={620} height={430} className="h-[430px] w-full rounded-[8px] border-2 border-ink object-cover" />
                <div className="absolute -right-4 -top-4 rounded-[8px] border-2 border-ink bg-accent px-[18px] py-3.5 text-center">
                  <div className="font-display text-[32px] font-black leading-none text-white">18+</div>
                  <div className="mt-[3px] text-[10.5px] font-extrabold uppercase leading-tight tracking-[0.06em] text-white">Years in<br />Tampa Bay</div>
                </div>
                <div className="absolute -bottom-[34px] -left-[26px] w-[168px] rounded-[8px] border-2 border-accent bg-ink p-2.5 max-nav:hidden">
                  <Image src={asset("owner-jason-placeholder.png")} alt="Jason, Owner" width={148} height={190} className="block h-[190px] w-full rounded-[6px] bg-[#2a2a2a] object-cover object-top" />
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
          <div className="mt-3.5 text-center text-[12.5px] font-semibold text-[#999]">Figures provisional, final stats confirmed before launch.</div>
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
                    <div className="relative flex h-[150px] flex-col items-center justify-center gap-[7px] rounded-[6px] border border-dashed border-[#4a4a4a] bg-[#2a2a2a] text-[#6f6f6f]">
                      {ico(24, (<><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></>), 1.8)}
                      <span className="text-[12px] font-bold uppercase tracking-[0.04em]">Before photo coming soon</span>
                      <span className="absolute left-2 top-2 bg-black px-2 py-[3px] text-[10px] font-extrabold tracking-[0.06em] text-white">BEFORE</span>
                    </div>
                  </div>
                  <div className="my-1.5 text-center text-[20px] text-accent">↓</div>
                  <div className="px-[18px] pb-[18px]">
                    <div className="relative h-[150px] overflow-hidden rounded-[6px]">
                      <Image src={asset(b.img)} alt={b.alt} fill sizes="(max-width:920px) 100vw, 380px" className="object-cover" />
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
            <div className="grid items-center gap-11 nav:grid-cols-[1.25fr_1fr]">
              <div className="relative h-[440px] overflow-hidden rounded-[8px] border-2 border-ink bg-[#15161a] max-nav:h-[340px]">
                <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 1px,transparent 1px 68px),repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0 1px,transparent 1px 68px)" }} />
                <div className="absolute left-[-10%] top-[20%] h-3.5 w-[120%] bg-[#26282f]" style={{ transform: "rotate(-9deg)" }} />
                <div className="absolute left-[-10%] top-[60%] h-2.5 w-[120%] bg-[#26282f]" style={{ transform: "rotate(6deg)" }} />
                <div className="absolute right-[-12%] top-[-10%] h-[120%] w-[46%] bg-[rgba(40,80,110,0.4)]" style={{ transform: "rotate(12deg)" }} />
                <div className="absolute left-1/2 top-[52%] h-[64%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-dashed border-[rgba(184,32,42,0.6)] bg-[rgba(184,32,42,0.12)]" />
                {mapPins.map((p, i) => (
                  <span key={i} className="absolute" style={{ left: p.left, top: p.top, transform: "translate(-50%,-100%)" }}>
                    <span className="flex h-[26px] w-[26px] items-center justify-center border-2 border-white bg-accent shadow-[0_5px_12px_rgba(0,0,0,0.5)]" style={{ borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)" }}>
                      <span className="h-2 w-2 rounded-full bg-white" style={{ transform: "rotate(45deg)" }} />
                    </span>
                  </span>
                ))}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-[6px] border-2 border-accent bg-ink px-[15px] py-2.5 text-[13px] font-extrabold uppercase tracking-[0.04em] text-white">
                  <span className="h-[9px] w-[9px] rounded-full bg-accent" /> Tampa Bay Service Area
                </div>
              </div>
              <div>
                <div className={eyebrowCls}>Service Areas</div>
                <h2 className="mt-3 font-display text-[clamp(26px,3.2vw,38px)] font-extrabold uppercase leading-[1.04] text-ink">We Cover the Whole Tampa Bay Area</h2>
                <p className="mt-3.5 text-[16.5px] leading-[1.58] text-body">Local techs based in Lutz means shorter drive times and same day arrival across six cities.</p>
                <div className="mt-[22px] flex flex-wrap gap-2.5">
                  {cities.map((c) => (
                    <Link key={c.slug} href={`/service-areas/${c.slug}/`} className="rounded-[6px] border-2 border-ink px-4 py-2.5 text-[14px] font-bold text-ink no-underline transition-colors hover:bg-ink hover:text-white">{c.name}</Link>
                  ))}
                </div>
                <div className="mt-6 flex max-w-[400px] gap-2.5">
                  <input placeholder="ENTER YOUR ZIP CODE" aria-label="Enter your ZIP code" className="flex-1 rounded-[6px] border-2 border-ink px-4 py-3 text-[14px] font-bold uppercase tracking-[0.03em] outline-none placeholder:text-[#999]" />
                  <Link href={ROUTES.serviceAreas} className="rounded-[6px] bg-accent px-[22px] py-3 text-[14px] font-extrabold uppercase tracking-[0.04em] text-white no-underline">Check</Link>
                </div>
              </div>
            </div>
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
              {/* Booking mock (visual; Confirm links to the real scheduler) */}
              <div className="rounded-[8px] border-2 border-ink bg-white p-[26px]">
                <div className="flex items-center justify-between">
                  <h3 className="m-0 font-display text-[19px] font-extrabold uppercase text-ink">Book Online</h3>
                  <span className="text-[12px] font-bold text-[#8a8a8a]">Housecall Pro</span>
                </div>
                <div className="mt-[18px] text-[12.5px] font-extrabold uppercase tracking-[0.04em] text-[#666]">What do you need?</div>
                <div className="mt-[7px] flex items-center justify-between rounded-[6px] border-2 border-ink px-[15px] py-3 text-[15px] font-semibold text-ink">
                  Garage door repair
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
                </div>
                <div className="mt-[18px] flex items-center justify-between">
                  <span className="text-[12.5px] font-extrabold uppercase tracking-[0.04em] text-[#666]">Pick a day</span>
                  <span className="text-[13px] font-extrabold text-ink">June 2026</span>
                </div>
                <div className="mt-2 grid grid-cols-5 gap-[7px]">
                  {[["MON", "16"], ["TUE", "17"], ["WED", "18"], ["THU", "19"], ["FRI", "20"]].map(([d, n], i) => (
                    <div key={i} className={`rounded-[6px] py-[9px] text-center ${i === 1 ? "border-2 border-accent bg-accent" : "border-2 border-[#e3e0da]"}`}>
                      <div className={`text-[10px] font-extrabold ${i === 1 ? "text-white/85" : "text-[#999]"}`}>{d}</div>
                      <div className={`font-display text-[16px] font-extrabold ${i === 1 ? "text-white" : "text-ink"}`}>{n}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-[12.5px] font-extrabold uppercase tracking-[0.04em] text-[#666]">Available times</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {([["8:00 AM", false], ["10:30 AM", true], ["1:00 PM", false], ["3:30 PM", false]] as const).map(([t, sel], i) => (
                    <span key={i} className={`rounded-[6px] px-[15px] py-[9px] text-[14px] ${sel ? "border-2 border-accent bg-[rgba(184,32,42,0.08)] font-extrabold text-accent" : "border-2 border-[#e3e0da] font-bold text-ink"}`}>{t}</span>
                  ))}
                </div>
                <a href={SITE.bookingHref} className="mt-[22px] block w-full rounded-[7px] bg-accent py-[15px] text-center text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline">Confirm Booking</a>
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
                  <Image src={asset(t.img)} alt={t.alt} fill sizes="(max-width:560px) 50vw, (max-width:920px) 33vw, 180px" className="object-cover" />
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
              <a href="#book" className="rounded-[7px] bg-white px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-accent no-underline">Book a Repair</a>
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
