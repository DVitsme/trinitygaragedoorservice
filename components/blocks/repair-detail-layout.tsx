import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE, ROUTES, asset } from "@/lib/site";
import { FaqJsonLd } from "@/components/json-ld";
import { cn } from "@/lib/utils";
import { PhotoHero } from "./hero";
import { Breadcrumb } from "./primitives";
import { TrustStrip } from "./trust-strip";
import { NumberedIndex, DarkCallout } from "./numbered-index";
import { FaqAccordion } from "./faq";
import { Reveal } from "./reveal";

/* ── Data shape the 8 detail pages fill (spring/opener/off-track/cables/tune-up/
   replacement/installation/repair-hub). The `.dc.html` is the visual source. ── */
type Crumb = { label: string; href?: string };
type SignCard = { icon: ReactNode; title: string; body: string };
type IdxRow = { label: string; title: string; desc: string; icon?: ReactNode };
type Check = { strong: string; rest: string };
type Faq = { q: string; a: string };

export type RepairDetailData = {
  canonicalPath: string;
  breadcrumb: Crumb[];
  heroEyebrow: string;
  heroImage: string;
  heroImageAlt: string;
  h1: ReactNode; // includes the red-box keyword span
  heroLead: string;
  primaryCta?: "repair" | "estimate"; // default repair
  intro: { eyebrow: string; title: string; paras: string[]; image: string; imageAlt: string; badge: string };
  signs: { eyebrow: string; title: string; lead?: string; cards: SignCard[]; note: { icon: ReactNode; title: string; body: string } };
  index?: { eyebrow: string; title: string; lead?: string; rows: IdxRow[]; calloutIcon?: ReactNode; callout: ReactNode };
  redBand: { badge: string; title: string; lead: string };
  whatWeDo: { eyebrow: string; title: string; image: string; imageAlt: string; badge: string; items: Check[]; trailing?: string };
  whyTrinity: { eyebrow: string; title: string; lead?: string; cards: SignCard[] };
  faqHeading?: { eyebrow: string; title: string };
  faqs: Faq[];
  closing: { title: string; lead: string };
};

const SITE_URL = "https://trinitygaragedoorservice.com";
const eyebrowCls = "flex items-center gap-2.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent";
const h2Cls = "m-0 mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03]";

function Band({ bg, topRule, narrow, children }: { bg: "white" | "cream" | "ink" | "accent"; topRule?: "ink" | "accent"; narrow?: boolean; children: ReactNode }) {
  const bgc = { white: "bg-white text-ink", cream: "bg-cream text-ink", ink: "bg-ink text-white", accent: "bg-accent text-white" }[bg];
  const rule = topRule === "ink" ? "border-t-2 border-ink" : topRule === "accent" ? "border-t-[5px] border-accent" : "";
  return (
    <section className={cn(bgc, rule)}>
      <div className={cn("mx-auto px-5 py-[90px] nav:px-8", narrow ? "max-w-[880px]" : "max-w-[1200px]")}>{children}</div>
    </section>
  );
}

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div className={eyebrowCls}>
    <span className="h-[3px] w-[30px] flex-none bg-accent" />
    {children}
  </div>
);

export function RepairDetailLayout({ d }: { d: RepairDetailData }) {
  const primary = d.primaryCta === "estimate" ? { href: ROUTES.estimate, label: "Free Estimate" } : { href: ROUTES.bookRepair, label: "Book a Repair" };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: d.breadcrumb.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <FaqJsonLd faqs={d.faqs.map((f) => ({ q: f.q, a: f.a }))} />

      {/* HERO (photo) */}
      <PhotoHero
        media={<Image src={asset(d.heroImage)} alt={d.heroImageAlt} fill sizes="100vw" priority className="object-cover" />}
        breadcrumb={<Breadcrumb items={d.breadcrumb} />}
        eyebrow={d.heroEyebrow}
      >
        <h1 className="m-0 mt-[18px] max-w-[920px] font-display text-[clamp(34px,5.6vw,64px)] font-black uppercase leading-[0.98] tracking-[-0.015em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
          {d.h1}
        </h1>
        <p className="mt-6 max-w-[660px] text-[clamp(17px,2.1vw,21px)] font-medium leading-[1.55] text-white/90">{d.heroLead}</p>
        <div className="mt-[30px] flex flex-wrap gap-[13px]">
          <Link href={primary.href} className="rounded-[7px] bg-accent px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline shadow-[0_12px_26px_rgba(184,32,42,0.4)] hover:bg-accent-dark">
            {primary.label}
          </Link>
          <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 rounded-[7px] bg-white px-[30px] py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline">
            <Phone className="h-[18px] w-[18px] text-accent" strokeWidth={2.2} /> Call {SITE.phoneDisplay}
          </a>
        </div>
      </PhotoHero>

      <TrustStrip />

      {/* INTRO split (white) */}
      <Band bg="white">
        <Reveal>
          <div className="grid items-center gap-14 nav:grid-cols-[1.05fr_1fr]">
            <div>
              <Eyebrow>{d.intro.eyebrow}</Eyebrow>
              <h2 className={cn(h2Cls, "text-ink")}>{d.intro.title}</h2>
              {d.intro.paras.map((p, i) => (
                <p key={i} className="mt-5 text-[17.5px] leading-[1.64] text-body">{p}</p>
              ))}
            </div>
            <div className="relative">
              <Image src={asset(d.intro.image)} alt={d.intro.imageAlt} width={620} height={380} className="h-[380px] w-full rounded-[8px] border-2 border-ink object-cover" />
              <div className="absolute -bottom-4 -right-4 rounded-[8px] border-2 border-ink bg-accent px-[18px] py-3 font-display text-[14px] font-extrabold uppercase tracking-[0.03em] text-white">{d.intro.badge}</div>
            </div>
          </div>
        </Reveal>
      </Band>

      {/* SIGNS (cream) */}
      <Band bg="cream" topRule="ink">
        <Reveal>
          <div className="max-w-[680px]">
            <div className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">{d.signs.eyebrow}</div>
            <h2 className={cn(h2Cls, "mt-3 text-ink")}>{d.signs.title}</h2>
            {d.signs.lead && <p className="mt-3.5 text-[16.5px] leading-[1.6] text-body">{d.signs.lead}</p>}
          </div>
        </Reveal>
        <Reveal>
          <div className="mt-10 grid gap-[18px] grid-cols-3 max-nav:grid-cols-2 max-xs:grid-cols-1">
            {d.signs.cards.map((c, i) => (
              <div key={i} className="rounded-[8px] border-2 border-ink bg-white p-6">
                <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[8px] bg-[rgba(184,32,42,0.1)] text-accent">{c.icon}</div>
                <h3 className="mt-3.5 font-display text-[16px] font-bold uppercase text-ink">{c.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.5] text-body">{c.body}</p>
              </div>
            ))}
            <div className="flex flex-col justify-center rounded-[8px] border-2 border-ink bg-ink p-6">
              <div className="flex items-center gap-2.5 text-accent">
                {d.signs.note.icon}
                <span className="font-display text-[15px] font-bold uppercase text-white">{d.signs.note.title}</span>
              </div>
              <p className="mt-2.5 text-[15px] font-medium leading-[1.5] text-[#cfcfcf]">{d.signs.note.body}</p>
            </div>
          </div>
        </Reveal>
      </Band>

      {/* INDEX (white) */}
      {d.index && (
        <Band bg="white" topRule="ink">
          <Reveal>
            <div className="max-w-[680px]">
              <div className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">{d.index.eyebrow}</div>
              <h2 className={cn(h2Cls, "mt-3 text-ink")}>{d.index.title}</h2>
              {d.index.lead && <p className="mt-3.5 text-[16.5px] leading-[1.6] text-body">{d.index.lead}</p>}
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-10">
              <NumberedIndex rows={d.index.rows} />
            </div>
          </Reveal>
          <Reveal>
            <DarkCallout icon={d.index.calloutIcon}>{d.index.callout}</DarkCallout>
          </Reveal>
        </Band>
      )}

      {/* MID red band */}
      <section className="bg-accent text-white">
        <Reveal>
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-8 px-5 py-16 nav:px-8">
            <div className="max-w-[680px]">
              <span className="inline-flex items-center gap-2.5 rounded-full bg-[rgba(0,0,0,0.18)] px-3.5 py-[7px] text-[13px] font-extrabold uppercase tracking-[0.14em] text-white">
                <span className="h-2 w-2 rounded-full bg-white" />
                {d.redBand.badge}
              </span>
              <h2 className="m-0 mt-4 font-display text-[clamp(26px,3.6vw,42px)] font-black uppercase leading-none">{d.redBand.title}</h2>
              <p className="mt-3.5 text-[17px] font-medium leading-[1.58] text-white/90">{d.redBand.lead}</p>
            </div>
            <a href={SITE.phoneHref} className="inline-flex flex-none items-center gap-3.5 rounded-[8px] bg-white px-[26px] py-5 no-underline">
              <Phone className="h-[26px] w-[26px] text-accent" strokeWidth={2} />
              <span>
                <span className="block text-[11.5px] font-extrabold uppercase tracking-[0.06em] text-accent-dark">Call the 24/7 line</span>
                <span className="block font-display text-[24px] font-black text-accent">{SITE.phoneDisplay}</span>
              </span>
            </a>
          </div>
        </Reveal>
      </section>

      {/* WHAT WE DO (dark) */}
      <Band bg="ink">
        <Reveal>
          <div className="grid items-center gap-[50px] nav:grid-cols-[1fr_1.05fr]">
            <div className="relative">
              <Image src={asset(d.whatWeDo.image)} alt={d.whatWeDo.imageAlt} width={620} height={420} className="h-[420px] w-full rounded-[8px] border-2 border-black object-cover" />
              <div className="absolute -bottom-4 -left-4 rounded-[8px] border-2 border-black bg-accent px-[18px] py-3 font-display text-[14px] font-extrabold uppercase tracking-[0.03em] text-white">{d.whatWeDo.badge}</div>
            </div>
            <div>
              <div className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">{d.whatWeDo.eyebrow}</div>
              <h2 className={cn(h2Cls, "mt-3 text-white")}>{d.whatWeDo.title}</h2>
              <div className="mt-[22px] flex flex-col gap-3.5">
                {d.whatWeDo.items.map((it, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-px flex h-6 w-6 flex-none items-center justify-center bg-accent">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                    <span className="text-[15.5px] font-medium text-[#d8d8d8]">
                      <strong className="text-white">{it.strong}</strong> {it.rest}
                    </span>
                  </div>
                ))}
              </div>
              {d.whatWeDo.trailing && <p className="mt-[22px] text-[15.5px] leading-[1.6] text-[#a8a8a8]">{d.whatWeDo.trailing}</p>}
            </div>
          </div>
        </Reveal>
      </Band>

      {/* WHY TRINITY (dark) */}
      <Band bg="ink" topRule="accent">
        <Reveal>
          <div className="mx-auto max-w-[680px] text-center">
            <div className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">{d.whyTrinity.eyebrow}</div>
            <h2 className={cn(h2Cls, "mt-3 text-white")}>{d.whyTrinity.title}</h2>
            {d.whyTrinity.lead && <p className="mt-3.5 text-[16px] leading-[1.6] text-[#a8a8a8]">{d.whyTrinity.lead}</p>}
          </div>
        </Reveal>
        <Reveal>
          <div className="mt-[46px] grid gap-5 grid-cols-4 max-nav:grid-cols-2 max-xs:grid-cols-1">
            {d.whyTrinity.cards.map((c, i) => (
              <div key={i} className="rounded-[8px] border border-panel-border border-t-4 border-t-accent bg-panel p-7">
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[8px] bg-accent text-white">{c.icon}</div>
                <h3 className="mt-[18px] font-display text-[18px] font-bold uppercase text-white">{c.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.55] text-[#a8a8a8]">{c.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Band>

      {/* FAQ (cream) */}
      <Band bg="cream" narrow>
        <Reveal>
          <div className="mx-auto max-w-[680px] text-center">
            <div className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">{d.faqHeading?.eyebrow ?? "Questions"}</div>
            <h2 className={cn(h2Cls, "mt-3 text-ink")}>{d.faqHeading?.title ?? "Frequently Asked"}</h2>
          </div>
        </Reveal>
        <Reveal>
          <div className="mt-9">
            <FaqAccordion items={d.faqs.map((f) => ({ q: f.q, a: f.a }))} />
          </div>
        </Reveal>
      </Band>

      {/* CLOSING CTA (red, centered) */}
      <section className="bg-accent text-white">
        <Reveal>
          <div className="mx-auto max-w-[1200px] px-5 py-[74px] text-center nav:px-8">
            <h2 className="m-0 font-display text-[clamp(28px,4vw,46px)] font-black uppercase leading-none">{d.closing.title}</h2>
            <p className="mx-auto mt-4 max-w-[640px] text-[17.5px] font-medium leading-[1.55] text-white/90">{d.closing.lead}</p>
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
