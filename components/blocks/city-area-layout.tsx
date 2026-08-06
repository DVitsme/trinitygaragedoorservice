import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE, ROUTES, asset } from "@/lib/site";
import { requestHref, requestLabel } from "@/lib/booking";
import { Breadcrumb } from "./primitives";
import { TrustStrip } from "./trust-strip";
import { Reveal } from "./reveal";

/* Data shape for the 6 service-area city pages (lutz/land-o-lakes designed; the rest
   reuse this template with their own copy). The dark map-hero + the 6 "what we do"
   service cards are uniform; only the per-city copy/review/nearby differs. */
export type CityAreaData = {
  slug: string;
  name: string; // "Lutz", "Land O' Lakes"
  counties: string; // hero eyebrow, e.g. "Pasco & Hillsborough"
  heroLead: string;
  intro: { title: string; paras: string[]; image: string; imageAlt: string };
  review: { quote: string; name: string };
  nearby: { title: string; lead: string; chips: { label: string; href?: string }[] };
  closingLead: string;
};

const SITE_URL = "https://trinitygaragedoorservice.com";
const ico = (paths: ReactNode) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths}</svg>
);

// Uniform "what we do" cards on every city page (handoff: links to the service pages).
const doCards: { label: string; href: string; icon: ReactNode }[] = [
  { label: "Repair: springs, cables & rollers", href: ROUTES.repair, icon: ico(<path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 1 5.4-5.4l-2.5 2.5-2-2z" />) },
  { label: "Doors off the track", href: ROUTES.offTrack, icon: ico(<path d="M7 3v18M17 3v18M7 8h10M7 14l10-4" />) },
  { label: "Opener repair & replacement", href: ROUTES.opener, icon: ico(<><rect x="4" y="5" width="16" height="10" rx="1" /><path d="M12 15v4M8 21h8" /></>) },
  { label: "New installation & replacement", href: ROUTES.installation, icon: ico(<path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-7h6v7" />) },
  { label: "Tune ups to keep it running longer", href: ROUTES.tuneUp, icon: ico(<path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 1 5.4-5.4l-2.5 2.5-2-2z" />) },
  { label: "Emergency repair", href: ROUTES.emergency, icon: ico(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>) },
];

export function CityAreaLayout({ d }: { d: CityAreaData }) {
  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: "Service Areas", href: ROUTES.serviceAreas },
    { label: d.name },
  ];
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}) })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* HERO (dark, labeled city pin) */}
      <section className="relative overflow-hidden border-b-[5px] border-accent bg-[#161616] px-6 py-[108px]">
        <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(90deg,rgba(255,255,255,.045) 0 1px,transparent 1px 72px),repeating-linear-gradient(0deg,rgba(255,255,255,.045) 0 1px,transparent 1px 72px)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 80% 24%, rgba(184,32,42,0.4), transparent 46%)" }} />
        <div className="absolute left-[-5%] top-[64%] h-3 w-[110%] bg-white/[0.045]" style={{ transform: "rotate(-7deg)" }} />
        <div className="absolute left-[44%] top-[-10%] h-[120%] w-2.5 bg-white/[0.045]" style={{ transform: "rotate(10deg)" }} />
        <span className="absolute right-[14%] top-[30%] flex flex-col items-center gap-[5px] max-nav:hidden">
          <span className="h-[18px] w-[18px] border-2 border-white bg-accent shadow-[0_0_0_7px_rgba(184,32,42,0.16)]" style={{ borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)" }} />
          <span className="rounded-[5px] bg-black/35 px-2 py-[3px] font-display text-[11px] font-extrabold uppercase tracking-[0.1em] text-white">{d.name}</span>
        </span>
        <span className="absolute right-[30%] top-[54%] h-3 w-3 border-2 border-white bg-white/50 max-nav:hidden" style={{ borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)" }} />
        <span className="absolute right-[20%] top-[72%] h-3 w-3 border-2 border-white bg-white/50 max-nav:hidden" style={{ borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)" }} />
        <div className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(110deg, rgba(22,22,22,.94) 0%, rgba(22,22,22,.58) 55%, rgba(22,22,22,.2) 100%)" }} />
        <div className="relative z-[2] mx-auto max-w-[1200px]">
          <Breadcrumb items={breadcrumb} />
          <div className="mt-4 flex items-center gap-3.5">
            <span className="h-1 w-[52px] bg-accent" />
            <span className="text-[13px] font-extrabold uppercase tracking-[0.22em] text-white">Service Area · {d.counties}</span>
          </div>
          <h1 className="m-0 mt-[18px] max-w-[920px] font-display text-[clamp(34px,5.6vw,64px)] font-black uppercase leading-[0.98] tracking-[-0.015em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
            Garage Door Repair <span className="inline-block bg-accent px-3 text-white">In {d.name}</span>
          </h1>
          <p className="mt-6 max-w-[660px] text-[clamp(17px,2.1vw,21px)] font-medium leading-[1.55] text-white/90">{d.heroLead}</p>
          <div className="mt-[30px] flex flex-wrap gap-[13px]">
            <Link href={requestHref("repair")} className="rounded-[7px] bg-accent px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline shadow-[0_12px_26px_rgba(184,32,42,0.4)] hover:bg-accent-dark">{requestLabel}</Link>
            <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 rounded-[7px] bg-white px-[30px] py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline">
              <Phone className="h-[18px] w-[18px] text-accent" strokeWidth={2.2} /> Call {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* INTRO SPLIT */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-[90px] nav:px-8">
          <Reveal>
            <div className="grid items-center gap-14 nav:grid-cols-[1.05fr_1fr]">
              <div>
                <div className="inline-flex items-center gap-2.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">
                  <span className="h-[3px] w-[30px] bg-accent" /> What We See In {d.name}
                </div>
                <h2 className="mt-4 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03] tracking-[-0.01em] text-ink">{d.intro.title}</h2>
                {d.intro.paras.map((p, i) => (
                  <p key={i} className="mt-5 text-[17.5px] leading-[1.64] text-body">{p}</p>
                ))}
              </div>
              <div className="relative">
                <Image src={asset(d.intro.image)} alt={d.intro.imageAlt} width={620} height={400} className="h-[400px] w-full rounded-[8px] border-2 border-ink object-cover" />
                <div className="absolute -bottom-4 -right-4 rounded-[8px] border-2 border-ink bg-accent px-[18px] py-3 font-display text-[14px] font-extrabold uppercase tracking-[0.03em] text-white">Same Day Service</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT WE DO (cream, 6 link-cards) */}
      <section className="bg-cream border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[90px] nav:px-8">
          <Reveal>
            <div className="max-w-[680px]">
              <div className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">What We Do In {d.name}</div>
              <h2 className="mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03] text-ink">The Whole Door, Start To Finish</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-9 grid gap-4 grid-cols-3 max-nav:grid-cols-2 max-xs:grid-cols-1">
              {doCards.map((c, i) => (
                <Link key={i} href={c.href} className="group flex items-center gap-3.5 rounded-[8px] border-2 border-ink bg-white p-[18px_20px] no-underline transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_14px_28px_rgba(0,0,0,0.14)]">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[8px] bg-cream text-accent transition-colors group-hover:bg-accent group-hover:text-white">{c.icon}</span>
                  <span className="text-[15.5px] font-bold text-ink">{c.label}</span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* REVIEW PULL QUOTE (dark) */}
      <section className="bg-ink border-t-[5px] border-accent">
        <Reveal>
          <div className="mx-auto max-w-[900px] px-5 py-20 text-center nav:px-8">
            <div className="text-[18px] tracking-[3px] text-accent">★★★★★</div>
            <blockquote className="m-0 mt-[18px] font-display text-[clamp(22px,3vw,32px)] font-bold uppercase leading-[1.2] text-white">&ldquo;{d.review.quote}&rdquo;</blockquote>
            <div className="mt-5 text-[15px] font-semibold text-[#a8a8a8]">{d.review.name} <span className="text-[#6a6a6a]">· via Google</span></div>
          </div>
        </Reveal>
      </section>

      {/* NEARBY AREAS */}
      <section className="bg-white border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[70px] nav:px-8">
          <Reveal>
            <div className="max-w-[680px]">
              <div className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">Nearby Areas We Cover</div>
              <h2 className="mt-3 font-display text-[clamp(22px,2.8vw,32px)] font-extrabold uppercase leading-[1.05] text-ink">{d.nearby.title}</h2>
              <p className="mt-3.5 text-[16.5px] leading-[1.6] text-body">{d.nearby.lead}</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[22px] flex flex-wrap gap-2.5">
              {d.nearby.chips.map((c, i) =>
                c.href ? (
                  <Link key={i} href={c.href} className="rounded-[6px] border-2 border-ink px-[18px] py-2.5 text-[14px] font-bold text-ink no-underline transition-colors hover:bg-ink hover:text-white">{c.label}</Link>
                ) : (
                  <span key={i} className="rounded-[6px] border-2 border-ink px-[18px] py-2.5 text-[14px] font-bold text-ink">{c.label}</span>
                ),
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-accent text-white">
        <Reveal>
          <div className="mx-auto max-w-[1200px] px-5 py-[74px] text-center nav:px-8">
            <h2 className="m-0 font-display text-[clamp(28px,4vw,46px)] font-black uppercase leading-none">Garage Door Trouble In {d.name}?</h2>
            <p className="mx-auto mt-4 max-w-[640px] text-[17.5px] font-medium leading-[1.55] text-white/90">{d.closingLead}</p>
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
