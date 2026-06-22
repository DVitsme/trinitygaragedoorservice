import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE, ROUTES, asset } from "@/lib/site";
import { Breadcrumb } from "@/components/blocks/primitives";
import { Reveal } from "@/components/blocks/reveal";

export const metadata: Metadata = {
  title: "Door & Opener Brochures | Trinity Garage Door Service",
  description:
    "Manufacturer brochures and spec sheets for Clopay and C.H.I. doors and LiftMaster openers. Browse the options, then get a free estimate. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/doors/brochures/" },
};

const SITE_URL = "https://trinitygaragedoorservice.com";
const breadcrumb = [{ label: "Home", href: "/" }, { label: "Doors", href: ROUTES.doorTypes }, { label: "Brochures" }];

// Placeholder spec-sheet titles (PDFs not yet wired — see note; rendered as non-link cards so no dead # links ship).
const clopayResidential = ["Classic Steel Premium", "Classic Steel, value series", "Canyon Ridge, faux wood carriage", "Ultra Grain, wood look finish", "The Gallery Steel", "Modern Steel", "Extreme Series", "Make a Statement, style guide"];
const clopayCommercial = ["Commercial 520 & 520S", "Commercial 524, 524V, 524S", "Commercial CESD10", "Commercial VS904 & VS904U"];
const chiDocs = ["2250 Raised Panel", "Carriage House", "Contemporary", "Full View, aluminum & glass", "Recessed Panel", "Timeless"];
const liftmasterDocs = ["Model 8160", "Model 8165", "Model 84505", "Model 85870", "Model 87504", "Model 87802", "Model 98022"];

function PdfRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[8px] border-2 border-ink bg-white p-[14px_16px]">
      <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[7px] bg-cream font-display text-[10px] font-extrabold text-accent">PDF</span>
      <span className="text-[14.5px] font-bold text-ink">{label}</span>
    </div>
  );
}

const groupLabel = "font-display text-[12px] font-extrabold uppercase tracking-[0.1em] text-accent";
const pdfGrid = "mt-[22px] grid gap-3 grid-cols-3 max-nav:grid-cols-2 max-xs:grid-cols-1";

function BrandHeader({ logo, alt, title, blurb, logoBg }: { logo: string; alt: string; title: string; blurb: string; logoBg: string }) {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className={`flex h-16 items-center rounded-[8px] border-2 border-ink px-[18px] py-3 ${logoBg}`}>
        <Image src={asset(logo)} alt={alt} width={140} height={38} className="max-h-[38px] w-auto object-contain" />
      </div>
      <div>
        <h2 className="m-0 font-display text-[clamp(22px,2.8vw,30px)] font-extrabold uppercase text-ink">{title}</h2>
        <p className="mt-[5px] text-[15px] text-body">{blurb}</p>
      </div>
    </div>
  );
}

export default function BrochuresPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}) })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* HERO (dark) */}
      <section className="relative overflow-hidden border-b-[5px] border-accent bg-[#161616] px-6 py-[88px]">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 84% 26%, rgba(184,32,42,0.28), transparent 48%)" }} />
        <div className="relative z-[2] mx-auto max-w-[1200px]">
          <Breadcrumb items={breadcrumb} />
          <div className="mt-4 flex items-center gap-3.5">
            <span className="h-1 w-[52px] bg-accent" />
            <span className="text-[13px] font-extrabold uppercase tracking-[0.22em] text-white">Brochures &amp; Spec Sheets</span>
          </div>
          <h1 className="m-0 mt-[18px] max-w-[920px] font-display text-[clamp(34px,5.6vw,62px)] font-black uppercase leading-[0.98] tracking-[-0.015em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
            See The Options <span className="inline-block bg-accent px-3 text-white">For Yourself</span>
          </h1>
          <p className="mt-6 max-w-[700px] text-[clamp(17px,2.1vw,20px)] font-medium leading-[1.55] text-white/90">A new garage door is a lot easier to pick when you can see the options. These are the manufacturer brochures and spec sheets for the doors and openers we work with, the same catalogs we&apos;d hand you at the kitchen table. Have a look, mark what catches your eye, and we&apos;ll take it from there with a free estimate.</p>
        </div>
      </section>

      {/* INTRO NOTE */}
      <section className="bg-ink">
        <Reveal>
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-3.5 px-5 py-[26px] text-center nav:px-8">
            <span className="max-w-[820px] text-[15px] font-medium text-[#cfcfcf]">
              These cover <strong className="text-white">Clopay</strong> and <strong className="text-white">C.H.I.</strong> doors and <strong className="text-white">LiftMaster</strong> openers. After a different brand? Call us and we&apos;ll track down the right info. See everyone we work with on our <Link href={ROUTES.brands} className="font-semibold text-white underline">brands page</Link>.
            </span>
          </div>
        </Reveal>
      </section>

      {/* CLOPAY */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 pb-5 pt-[72px] nav:px-8">
          <Reveal><BrandHeader logo="brandlogo-clopay.png" alt="Clopay" title="Clopay Doors" blurb="The largest residential garage door maker in North America. Main residential lines, plus a few commercial models." logoBg="bg-cream" /></Reveal>
          <Reveal><div className={`mt-[30px] ${groupLabel}`}>Residential</div></Reveal>
          <Reveal><div className={pdfGrid}>{clopayResidential.map((d) => <PdfRow key={d} label={d} />)}</div></Reveal>
          <Reveal><div className={`mt-[26px] ${groupLabel}`}>Commercial</div></Reveal>
          <Reveal><div className={pdfGrid}>{clopayCommercial.map((d) => <PdfRow key={d} label={d} />)}</div></Reveal>
        </div>
      </section>

      {/* C.H.I. */}
      <section className="bg-cream border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-16 nav:px-8">
          <Reveal><BrandHeader logo="brandlogo-chi.png" alt="C.H.I. Overhead Doors" title="C.H.I. Doors" blurb="A clean, well built lineup that covers most of the looks people ask for." logoBg="bg-white" /></Reveal>
          <Reveal><div className={pdfGrid.replace("mt-[22px]", "mt-[26px]")}>{chiDocs.map((d) => <PdfRow key={d} label={d} />)}</div></Reveal>
        </div>
      </section>

      {/* LIFTMASTER */}
      <section className="bg-white border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-16 nav:px-8">
          <Reveal><BrandHeader logo="brandlogo-liftmaster.png" alt="LiftMaster" title="LiftMaster Openers" blurb="Spec sheets for popular models of the professional grade opener we install most. Want help matching one to your door? Just ask." logoBg="bg-cream" /></Reveal>
          <Reveal><div className={pdfGrid.replace("mt-[22px]", "mt-[26px]")}>{liftmasterDocs.map((d) => <PdfRow key={d} label={d} />)}</div></Reveal>
          <Reveal><div className="mt-5 text-[12.5px] font-semibold text-[#8a8a8a]">Brochure links are placeholders. At build, swap in the real PDFs with descriptive filenames, cover thumbnails, and alt text.</div></Reveal>
        </div>
      </section>

      {/* NOT SURE CTA */}
      <section className="bg-accent text-white">
        <Reveal>
          <div className="mx-auto max-w-[1200px] px-5 py-[74px] text-center nav:px-8">
            <h2 className="m-0 font-display text-[clamp(28px,4vw,44px)] font-black uppercase leading-none">Not Sure Where To Start?</h2>
            <p className="mx-auto mt-4 max-w-[660px] text-[17.5px] font-medium leading-[1.55] text-white/90">Most folks couldn&apos;t tell a Canyon Ridge from a Modern Steel, and that&apos;s perfectly fine. Tell us about your house, the look you want, and your budget, and we&apos;ll narrow it down quickly and bring real options to your free estimate. Call (813) 279-6785.</p>
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
