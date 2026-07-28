import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE, ROUTES, asset } from "@/lib/site";
import { PhotoHero } from "@/components/blocks/hero";
import { Breadcrumb } from "@/components/blocks/primitives";
import { TrustStrip } from "@/components/blocks/trust-strip";
import { ServiceAreaMapMock } from "@/components/blocks/service-area-map-mock";
import { Reveal } from "@/components/blocks/reveal";

export const metadata: Metadata = {
  title: "Garage Door Services Tampa Bay | Trinity Garage Door Service",
  description:
    "Garage door installation, repair, replacement, springs, openers, and off track repair across Tampa Bay. Family owned, licensed, 24/7 emergency. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/services/" },
};

const SITE_URL = "https://trinitygaragedoorservice.com";

const ico = (size: number, paths: ReactNode, sw: number | string = 2) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {paths}
  </svg>
);

const breadcrumb = [{ label: "Home", href: "/" }, { label: "Services" }];

const serviceCards: { icon: ReactNode; title: string; href: string; desc: string }[] = [
  { icon: ico(26, (<><path d="M3 21h18M5 21V8l7-5 7 5v13" /><path d="M9 21v-7h6v7" /></>)), title: "Garage Door Installation", href: ROUTES.installation, desc: "A brand new door, on an existing house or new construction. We help you pick the material, style, and brand, then install it and make sure it runs right." },
  { icon: ico(26, <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 1 5.4-5.4l-2.5 2.5-2-2z" />), title: "Repair & Service", href: ROUTES.repair, desc: "The catch all for a door that's acting up: noisy, slow, jerky, a remote that won't respond, a door that sticks halfway. We track down the cause and fix it, often same day." },
  { icon: ico(26, (<><path d="M7 3v18M17 3v18" /><path d="M7 8h10M7 14l10-4" /></>)), title: "Off Track Repair", href: ROUTES.offTrack, desc: "When a door jumps its track it can jam, hang crooked, or come down hard. We get it back on track or replace bent track, and figure out what knocked it off." },
  { icon: ico(26, (<><path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /></>)), title: "Garage Door Replacement", href: ROUTES.replacement, desc: "When repairing the old door stops being worth it, we help you decide and handle the swap. Old door out, new door in, mess hauled away. We'll tell you straight if it's really time." },
  { icon: ico(26, (<><path d="M5 3v18" /><path d="M5 5c5-3 9 3 14 0M5 9c5-3 9 3 14 0M5 13c5-3 9 3 14 0M5 17c5-3 9 3 14 0" /></>)), title: "Spring Repair", href: ROUTES.spring, desc: "The springs carry the weight of the whole door and usually last seven to ten years. A broken spring is the number one reason a door won't open, and it's not a DIY job." },
  { icon: ico(26, (<><rect x="4" y="5" width="16" height="10" rx="1" /><path d="M12 15v4M8 21h8" /></>)), title: "Opener Repair", href: ROUTES.opener, desc: "If the door is fine but the opener isn't, that's its own fix. We repair motors, sensors, gears, and remotes, and replace worn out openers. Chain, belt, and screw drive units." },
];

const whyCards: { icon: ReactNode; title: string; body: string }[] = [
  { icon: ico(26, <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 7-5s7 2 7 5M17 11l2 2 4-4" />), title: "Honest & Low Pressure", body: "We don't sell you what you don't need. If a repair will do, we tell you so." },
  { icon: ico(26, <path d="M13 2L4 14h6l-1 8 9-12h-6z" />), title: "Fast & Same Day", body: "We show up when we say we will, and knock out same day repairs whenever we can." },
  { icon: ico(26, (<><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>)), title: "Licensed & Insured", body: "Florida GD13010 and GDI-09484, bonded and insured." },
  { icon: ico(26, (<><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></>)), title: "Free Estimates", body: "We'll come look and give you a real number before you commit to anything." },
];

const areaChips = [
  { label: "Tampa", href: "/service-areas/tampa/" },
  { label: "Lutz", href: "/service-areas/lutz/" },
  { label: "Land O' Lakes", href: "/service-areas/land-o-lakes/" },
  { label: "Wesley Chapel", href: "/service-areas/wesley-chapel/" },
  { label: "Palm Harbor", href: "/service-areas/palm-harbor/" },
  { label: "Oldsmar", href: "/service-areas/oldsmar/" },
];

const eyebrowCls = "text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent";
const h2Cls = "m-0 mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03]";
const learnMoreArrow = (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function ServicesHubPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* HERO */}
      <PhotoHero
        media={<Image src={asset("svc-opener-rail-work.jpg")} alt="Trinity technician at a Tampa Bay home" fill sizes="100vw" priority className="object-cover" />}
        breadcrumb={<Breadcrumb items={breadcrumb} />}
        eyebrow="Garage Door Services"
      >
        <h1 className="m-0 mt-[18px] max-w-[920px] font-display text-[clamp(34px,5.6vw,66px)] font-black uppercase leading-[0.98] tracking-[-0.015em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
          Garage Door Services <span className="inline-block bg-accent px-3 text-white">In Tampa Bay</span>
        </h1>
        <p className="mt-6 max-w-[660px] text-[clamp(17px,2.1vw,21px)] font-medium leading-[1.55] text-white/90">
          We install new doors, fix the ones that quit on you, replace the ones past saving, and handle the springs, cables, rollers, tracks, and openers that make a door work. Some jobs are planned. A lot are &ldquo;the door won&apos;t open and I have to get to work.&rdquo; We do both.
        </p>
        <div className="mt-[30px] flex flex-wrap gap-[13px]">
          <a href="#services" className="rounded-[7px] bg-accent px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline shadow-[0_12px_26px_rgba(184,32,42,0.4)] hover:bg-accent-dark">
            Explore Services
          </a>
          <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 rounded-[7px] bg-white px-[30px] py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline">
            <Phone className="h-[18px] w-[18px] text-accent" strokeWidth={2.2} /> Call {SITE.phoneDisplay}
          </a>
        </div>
      </PhotoHero>

      <TrustStrip />

      {/* INTRO (centered) */}
      <section className="bg-white">
        <div className="mx-auto max-w-[900px] px-5 pb-2.5 pt-20 text-center nav:px-8">
          <Reveal>
            <div className={eyebrowCls}>What We Do</div>
            <h2 className={`${h2Cls} text-ink`}>Everything We Handle</h2>
            <p className="mx-auto mt-4 max-w-[640px] text-[17.5px] leading-[1.62] text-body">
              Find what&apos;s going on with your door and click through for the details. Not sure which one fits? Call us and we&apos;ll point you the right way.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section id="services" className="bg-white scroll-mt-24">
        <div className="mx-auto max-w-[1200px] px-5 pb-[60px] pt-9 nav:px-8">
          <Reveal>
            <div className="grid gap-5 grid-cols-3 max-nav:grid-cols-2 max-xs:grid-cols-1">
              {serviceCards.map((c, i) => (
                <Link key={i} href={c.href} className="group flex flex-col overflow-hidden rounded-[10px] border-2 border-ink bg-white no-underline transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(0,0,0,0.16)]">
                  <div className="px-[26px] pt-[26px]">
                    <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[8px] bg-accent text-white">{c.icon}</div>
                    <h3 className="mt-4 font-display text-[19px] font-bold uppercase text-ink">{c.title}</h3>
                    <p className="mb-[18px] mt-2 text-[15px] leading-[1.55] text-body">{c.desc}</p>
                  </div>
                  <span className="mt-auto flex items-center justify-between gap-2 bg-cream px-[26px] py-3.5 text-[13px] font-extrabold uppercase tracking-[0.04em] text-ink transition-[background-color,gap] duration-200 group-hover:gap-3 group-hover:bg-accent group-hover:text-white">
                    Learn More {learnMoreArrow}
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>

          {/* Emergency callout */}
          <Reveal>
            <Link href={ROUTES.emergency} className="mt-5 flex flex-wrap items-center justify-between gap-6 rounded-[10px] border-2 border-ink bg-ink p-[28px_32px] no-underline">
              <div className="flex items-center gap-5">
                <span className="flex h-14 w-14 flex-none items-center justify-center rounded-[10px] bg-accent text-white">
                  {ico(28, (<><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z" /><path d="M12 6v4M12 13h.01" /></>))}
                </span>
                <div>
                  <h3 className="m-0 font-display text-[21px] font-extrabold uppercase text-white">When It Can&apos;t Wait</h3>
                  <p className="mt-1.5 max-w-[560px] text-[15.5px] leading-[1.5] text-[#a8a8a8]">
                    A broken spring the morning of work, or a door stuck wide open overnight. We run a 24/7 emergency line for exactly that. Call it and we&apos;ll get someone headed your way.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-[7px] bg-accent px-6 py-[15px] text-[14px] font-extrabold uppercase tracking-[0.04em] text-white">
                24/7 Emergency Repair {learnMoreArrow}
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* WHY PEOPLE CALL US (dark) */}
      <section className="bg-ink border-t-[5px] border-accent">
        <div className="mx-auto max-w-[1200px] px-5 py-[90px] nav:px-8">
          <Reveal>
            <div className="mx-auto max-w-[680px] text-center">
              <div className={eyebrowCls}>Why People Call Us</div>
              <h2 className={`${h2Cls} text-white`}>Family Owned, And We Live Here Too</h2>
              <p className="mt-3.5 text-[16px] leading-[1.6] text-[#a8a8a8]">Most of our work comes from repeat customers and the neighbors they tell. Here&apos;s what they say back to us.</p>
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

      {/* SERVICE AREA (cream split) */}
      <section className="bg-cream border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-20 nav:px-8">
          <Reveal>
            <div className="grid items-center gap-11 nav:grid-cols-2">
              <div>
                <div className={eyebrowCls}>Where We Work</div>
                <h2 className={`${h2Cls} text-ink`}>All Over Tampa Bay</h2>
                <p className="mt-3.5 text-[16.5px] leading-[1.6] text-body">We cover Hillsborough, Pasco, and Pinellas counties, and the towns around them. Not sure you&apos;re in range? Give us a call and ask.</p>
                <div className="mt-[22px] flex flex-wrap gap-2.5">
                  {areaChips.map((a) => (
                    <Link key={a.label} href={a.href} className="rounded-[6px] border-2 border-ink px-4 py-2.5 text-[14px] font-bold text-ink no-underline transition-colors hover:bg-ink hover:text-white">
                      {a.label}
                    </Link>
                  ))}
                </div>
              </div>
              <ServiceAreaMapMock />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-accent text-white">
        <Reveal>
          <div className="mx-auto max-w-[1200px] px-5 py-[74px] text-center nav:px-8">
            <h2 className="m-0 font-display text-[clamp(28px,4vw,46px)] font-black uppercase leading-none">Get In Touch</h2>
            <p className="mx-auto mt-4 max-w-[640px] text-[17.5px] font-medium leading-[1.55] text-white/90">
              Call Trinity at (813) 279-6785, or send us a message and we&apos;ll get back to you fast. The estimate is free and the advice is honest, and our emergency line runs around the clock. Opening doors in Tampa Bay since 2007.
            </p>
            <div className="mt-[30px] flex flex-wrap justify-center gap-[13px]">
              <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 rounded-[7px] bg-white px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-accent no-underline">
                <Phone className="h-[18px] w-[18px] text-accent" strokeWidth={2.2} /> Call {SITE.phoneDisplay}
              </a>
              <Link href={ROUTES.estimate} className="rounded-[7px] border-2 border-white px-7 py-4 text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline hover:bg-white hover:text-ink">
                Request a Free Estimate
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
