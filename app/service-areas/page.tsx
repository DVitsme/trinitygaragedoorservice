import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE, ROUTES } from "@/lib/site";
import { Breadcrumb } from "@/components/blocks/primitives";
import { TrustStrip } from "@/components/blocks/trust-strip";
import { ServiceAreaMap } from "@/components/blocks/service-area-map";
import { Reveal } from "@/components/blocks/reveal";

export const metadata: Metadata = {
  title: "Service Areas | Trinity Garage Door Service Tampa Bay",
  description:
    "Garage door service across Tampa Bay: Lutz, Land O' Lakes, Wesley Chapel, Palm Harbor, Oldsmar, and Tampa. Same day, family owned. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/service-areas/" },
};

const SITE_URL = "https://trinitygaragedoorservice.com";
const ico = (size: number, paths: ReactNode, sw: number | string = 2) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{paths}</svg>
);
const pin = ico(26, (<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>));
const arrow = <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;

const breadcrumb = [{ label: "Home", href: "/" }, { label: "Service Areas" }];

const towns = [
  { name: "Lutz", slug: "lutz", blurb: "Established neighborhoods and lakefront homes about fifteen miles north of downtown Tampa, where a lot of doors have some age on them." },
  { name: "Land O' Lakes", slug: "land-o-lakes", blurb: "Pasco lake country, where newer master planned communities sit next to older waterfront homes. We service both." },
  { name: "Wesley Chapel", slug: "wesley-chapel", blurb: "One of the fastest growing parts of the bay, full of newer homes along the interstate that are hitting their first real service." },
  { name: "Palm Harbor", slug: "palm-harbor", blurb: "A Gulf coast community on St. Joseph Sound, where salt air is rough on door hardware and rollers seize sooner." },
  { name: "Oldsmar", slug: "oldsmar", blurb: "A bayfront city at the head of Old Tampa Bay, with plenty of waterfront and canal homes that take a beating from the humidity." },
  { name: "Tampa", slug: "tampa", blurb: "The heart of the bay, where historic Hyde Park and Ybor sit alongside new construction and waterfront South Tampa." },
];

const whyCards: { icon: ReactNode; title: string; body: string }[] = [
  { icon: ico(26, <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 7-5s7 2 7 5M17 11l2 2 4-4" />), title: "Honest & Low Pressure", body: "We don't sell you what you don't need. If a repair will do, we tell you so." },
  { icon: ico(26, <path d="M13 2L4 14h6l-1 8 9-12h-6z" />), title: "Fast & Same Day", body: "We show up when we say we will, and knock out same day repairs whenever we can." },
  { icon: ico(26, (<><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>)), title: "Licensed & Insured", body: "Florida GD13010 and GDI-09484, bonded and insured." },
  { icon: ico(26, (<><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></>)), title: "Free Estimates", body: "We'll come look and give you a real number before you commit to anything." },
];

const eyebrowCls = "text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent";
const h2Cls = "m-0 mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03]";

export default function ServiceAreasHubPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}) })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* HERO (dark map-decorated, no photo) */}
      <section className="relative overflow-hidden border-b-[5px] border-accent bg-[#161616] px-6 py-[108px]">
        <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,.045) 0 1px,transparent 1px 72px),repeating-linear-gradient(0deg,rgba(255,255,255,.045) 0 1px,transparent 1px 72px)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 80% 24%, rgba(184,32,42,0.4), transparent 46%)" }} />
        <div className="absolute left-[-5%] top-[64%] h-3 w-[110%] bg-white/[0.045]" style={{ transform: "rotate(-7deg)" }} />
        <div className="absolute left-[44%] top-[-10%] h-[120%] w-2.5 bg-white/[0.045]" style={{ transform: "rotate(10deg)" }} />
        {/* decorative pins */}
        <span className="absolute right-[13%] top-[23%] h-[17px] w-[17px] border-2 border-white bg-accent shadow-[0_0_0_7px_rgba(184,32,42,0.16)]" style={{ borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)" }} />
        <span className="absolute right-[28%] top-[46%] h-[13px] w-[13px] border-2 border-white bg-white/55" style={{ borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)" }} />
        <span className="absolute right-[19%] top-[70%] h-[13px] w-[13px] border-2 border-white bg-white/55" style={{ borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)" }} />
        <span className="absolute right-[40%] top-[60%] h-[11px] w-[11px] border-2 border-white bg-white/40" style={{ borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)" }} />
        <div className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(110deg, rgba(22,22,22,.94) 0%, rgba(22,22,22,.58) 55%, rgba(22,22,22,.2) 100%)" }} />
        <div className="relative z-[2] mx-auto max-w-[1200px]">
          <Breadcrumb items={breadcrumb} />
          <div className="mt-4 flex items-center gap-3.5">
            <span className="h-1 w-[52px] bg-accent" />
            <span className="text-[13px] font-extrabold uppercase tracking-[0.22em] text-white">Service Areas</span>
          </div>
          <h1 className="m-0 mt-[18px] max-w-[920px] font-display text-[clamp(34px,5.6vw,66px)] font-black uppercase leading-[0.98] tracking-[-0.015em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
            Garage Door Service <span className="inline-block bg-accent px-3 text-white">Across Tampa Bay</span>
          </h1>
          <p className="mt-6 max-w-[660px] text-[clamp(17px,2.1vw,21px)] font-medium leading-[1.55] text-white/90">
            Trinity is based right here in Tampa Bay, and we cover a good stretch of it. If your garage door quits in Hillsborough, Pinellas, Pasco, Hernando or Polk county, there&apos;s a strong chance we can be at your house the same day. Here&apos;s where we work and how to tell if you&apos;re in range.
          </p>
          <div className="mt-[30px] flex flex-wrap gap-[13px]">
            <a href="#towns" className="rounded-[7px] bg-accent px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline shadow-[0_12px_26px_rgba(184,32,42,0.4)] hover:bg-accent-dark">See The Towns</a>
            <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 rounded-[7px] bg-white px-[30px] py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline">
              <Phone className="h-[18px] w-[18px] text-accent" strokeWidth={2.2} /> Call {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* INTRO */}
      <section className="bg-white">
        <div className="mx-auto max-w-[900px] px-5 pb-2.5 pt-20 text-center nav:px-8">
          <Reveal>
            <div className={eyebrowCls}>The Towns We Cover</div>
            <h2 className={`${h2Cls} text-ink`}>Six Towns, Plus The Neighborhoods Around Them</h2>
            <p className="mx-auto mt-4 max-w-[640px] text-[17.5px] leading-[1.62] text-body">We focus on six towns and the areas around each one. Find yours below to see what we handle where you live, or call and we&apos;ll tell you straight whether you&apos;re in range.</p>
          </Reveal>
        </div>
      </section>

      {/* TOWN CARDS */}
      <section id="towns" className="bg-white scroll-mt-24">
        <div className="mx-auto max-w-[1200px] px-5 pb-[60px] pt-9 nav:px-8">
          <Reveal>
            <div className="grid gap-5 grid-cols-3 max-nav:grid-cols-2 max-xs:grid-cols-1">
              {towns.map((t) => (
                <Link key={t.slug} href={`/service-areas/${t.slug}/`} className="group flex flex-col overflow-hidden rounded-[10px] border-2 border-ink bg-white no-underline transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(0,0,0,0.16)]">
                  <div className="px-[26px] pt-[26px]">
                    <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[8px] bg-accent text-white">{pin}</div>
                    <h3 className="mt-4 font-display text-[19px] font-bold uppercase text-ink">{t.name}</h3>
                    <p className="mb-[18px] mt-2 text-[15px] leading-[1.55] text-body">{t.blurb}</p>
                  </div>
                  <span className="mt-auto flex items-center justify-between gap-2 bg-cream px-[26px] py-3.5 text-[13px] font-extrabold uppercase tracking-[0.04em] text-ink transition-[background-color,gap] duration-200 group-hover:gap-3 group-hover:bg-accent group-hover:text-white">
                    {t.name} Service {arrow}
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>

          {/* not-sure callout */}
          <Reveal>
            <a href={SITE.phoneHref} className="mt-5 flex flex-wrap items-center justify-between gap-6 rounded-[10px] border-2 border-ink bg-ink p-[28px_32px] no-underline">
              <div className="flex items-center gap-5">
                <span className="flex h-14 w-14 flex-none items-center justify-center rounded-[10px] bg-accent text-white">{ico(28, (<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>))}</span>
                <div>
                  <h3 className="m-0 font-display text-[21px] font-extrabold uppercase text-white">Not Sure You&apos;re In Our Area?</h3>
                  <p className="mt-1.5 max-w-[560px] text-[15.5px] leading-[1.5] text-[#a8a8a8]">If your town isn&apos;t on the list, call us anyway. We cover a lot of the ground in between, including Odessa, Carrollwood, Westchase, and New Tampa, and we&apos;ll tell you straight whether we can get to you.</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-[7px] bg-accent px-6 py-[15px] text-[14px] font-extrabold uppercase tracking-[0.04em] text-white">Call {SITE.phoneDisplay} {arrow}</span>
            </a>
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
                <p className="mt-3.5 text-[16.5px] leading-[1.6] text-body">We cover Hillsborough, Pinellas, Pasco, Hernando and Polk counties, and the towns around them. Not sure you&apos;re in range? Give us a call and ask.</p>
                <div className="mt-[22px] flex flex-wrap gap-2.5">
                  {[towns[5], towns[0], towns[1], towns[2], towns[3], towns[4]].map((a) => (
                    <Link key={a.slug} href={`/service-areas/${a.slug}/`} className="rounded-[6px] border-2 border-ink px-4 py-2.5 text-[14px] font-bold text-ink no-underline transition-colors hover:bg-ink hover:text-white">{a.name}</Link>
                  ))}
                </div>
              </div>
              <ServiceAreaMap className="mx-auto max-w-[380px]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-accent text-white">
        <Reveal>
          <div className="mx-auto max-w-[1200px] px-5 py-[74px] text-center nav:px-8">
            <h2 className="m-0 font-display text-[clamp(28px,4vw,46px)] font-black uppercase leading-none">Get In Touch</h2>
            <p className="mx-auto mt-4 max-w-[640px] text-[17.5px] font-medium leading-[1.55] text-white/90">Call Trinity at (813) 279-6785, or send us a message and we&apos;ll get back to you fast. The estimate is free and the advice is honest, and our emergency line runs around the clock. Opening doors in Tampa Bay since 2007.</p>
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
