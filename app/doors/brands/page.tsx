import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight, Zap } from "lucide-react";
import { SITE, ROUTES, asset } from "@/lib/site";
import { Breadcrumb } from "@/components/blocks/primitives";
import { TrustStrip } from "@/components/blocks/trust-strip";
import { FaqAccordion } from "@/components/blocks/faq";
import { FaqJsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/blocks/reveal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Garage Door Brands We Install & Service | Trinity Tampa Bay",
  description:
    "Trinity installs Clopay, C.H.I., Hörmann, and Amarr doors plus LiftMaster openers, and services every major brand across Tampa Bay. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/doors/brands/" },
};

const SITE_URL = "https://trinitygaragedoorservice.com";
const breadcrumb = [{ label: "Home", href: "/" }, { label: "Doors", href: ROUTES.doorTypes }, { label: "Brands" }];

const Badge = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span className={cn("inline-block rounded-[5px] px-[9px] py-1 font-display text-[10px] font-extrabold uppercase tracking-[0.06em]", className)}>{children}</span>
);

const installDoors = [
  { name: "Clopay", logo: "brandlogo-clopay.png", blurb: "The largest residential garage door maker in North America, and our go to for good reason. Value steel doors and custom faux wood carriage doors alike. Ask about Intellicore insulation and WindCode rated models. The Canyon Ridge and Coachman lines nail the carriage look." },
  { name: "C.H.I.", logo: "brandlogo-chi.png", blurb: "A dealer favorite known for solid build quality, made in Illinois. Great if you want the wood look without the wood. Their Accents Woodtones steel doors use a printed grain that holds up to a close look, and the Planks line gives a clean modern wood look." },
  { name: "Hörmann", logo: "brandlogo-hormann.png", blurb: "The premium, design forward choice. A German maker that's built doors since 1935, and the engineering shows in the insulation, security, and smooth quiet operation. It costs more with fewer dealers around, but if you want a high end door it's worth a look." },
  { name: "Amarr", logo: "brandlogo-amarr.png", blurb: "A well regarded mainstream brand with a big range of styles and several insulation tiers. Amarr's hurricane and wind rated models get specified all over Florida, so it's a dependable, easy choice. The Classica carriage line and Lincoln traditional line are popular sellers." },
];

const serviceBrands = [
  { name: "Chamberlain", logo: "brandlogo-chamberlain.png", tag: "Opener", blurb: "LiftMaster's retail sibling, made by the same company and running the same myQ app. A little lighter duty, and we service and repair it all the time." },
  { name: "Genie", logo: "brandlogo-genie.png", tag: "Opener", blurb: "A long running opener brand you'll find at the home stores. Genie uses its own Aladdin Connect smart app rather than myQ. We repair and replace them either way." },
  { name: "Craftsman", logo: "brandlogo-craftsman.png", tag: "Opener", blurb: "The familiar Craftsman openers are built by the same company that makes Chamberlain and LiftMaster, so they're a known quantity for us to service and find parts for." },
  { name: "Linear", logo: "brandlogo-linear.png", tag: "Opener / Gate", blurb: "Better known for gate openers and access control, Linear shows up on a lot of gated properties. We service their garage operators and can help with gate setups too." },
  { name: "Wayne Dalton", logo: "brandlogo-wayne-dalton.jpg", tag: "Door", blurb: "Worth clearing up: Wayne Dalton is really a door maker, not an opener brand, and they stopped making openers. If you have an older iDrive, parts are scarce, so we'll fix it if we can and talk replacement if we can't. We also service their TorqueMaster doors." },
];

const faqs = [
  { q: "Do I have to pick a brand you install?", a: "Not at all. If you want a new door or opener, we'll point you to the lines we install and trust. If you already own another brand, we'll service and repair it just the same." },
  { q: "Which garage door brand is best?", a: "There's no single best. The right door depends on your house, your budget, and how close you are to the coast. Clopay and Amarr cover most needs really well, C.H.I. is great for a wood look, and Hörmann is the premium pick. We'll help you sort it out." },
  { q: "Do you only install LiftMaster openers?", a: "LiftMaster is what we install most, because it's the professional grade line and it holds up. If you have another brand, we service and repair it, and we can talk options if you want something specific." },
  { q: "Can you fix my opener even if you didn't install it?", a: "Yes. We repair every major opener brand, including Chamberlain, Genie, Craftsman, Linear, and older Wayne Dalton units, and we carry common parts on the truck." },
  { q: "Is Wayne Dalton a door or an opener brand?", a: "A door brand. They used to make openers but stopped, so if your Wayne Dalton opener dies, replacement parts can be hard to find. We'll fix what we can and help you replace it if we can't." },
];

const eyebrowCls = "text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent";
const h2Cls = "font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03] text-ink";

export default function BrandsPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}) })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <FaqJsonLd faqs={faqs} />

      {/* HERO (dark) */}
      <section className="relative overflow-hidden border-b-[5px] border-accent bg-[#161616] px-6 py-24">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 82% 28%, rgba(184,32,42,0.3), transparent 48%)" }} />
        <div className="relative z-[2] mx-auto max-w-[1200px]">
          <Breadcrumb items={breadcrumb} />
          <div className="mt-4 flex items-center gap-3.5">
            <span className="h-1 w-[52px] bg-accent" />
            <span className="text-[13px] font-extrabold uppercase tracking-[0.22em] text-white">Brands We Carry</span>
          </div>
          <h1 className="m-0 mt-[18px] max-w-[920px] font-display text-[clamp(34px,5.6vw,64px)] font-black uppercase leading-[0.98] tracking-[-0.015em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
            We&apos;re Not A <span className="inline-block bg-accent px-3 text-white">Single Brand Dealer</span>
          </h1>
          <p className="mt-6 max-w-[680px] text-[clamp(17px,2.1vw,21px)] font-medium leading-[1.55] text-white/90">We install the door and opener lines we trust and stand behind, and we service and repair just about every brand out there. So when you ask us what to buy, you get an honest answer for your house and your budget, not a pitch for the one product we&apos;re stuck selling.</p>
        </div>
      </section>

      <TrustStrip />

      {/* DOORS WE INSTALL */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 pb-10 pt-[84px] nav:px-8">
          <Reveal>
            <div className="max-w-[720px]">
              <Badge className="bg-accent text-white">Install &amp; Service</Badge>
              <h2 className={cn(h2Cls, "mt-3.5")}>Doors We Install &amp; Service</h2>
              <p className="mt-3.5 text-[16.5px] leading-[1.6] text-body">The four door brands we install most. All four offer insulated and wind rated models, which matters in our part of Florida.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-9 grid gap-[18px] grid-cols-2 max-xs:grid-cols-1">
              {installDoors.map((b) => (
                <div key={b.name} className="flex flex-col overflow-hidden rounded-[10px] border-2 border-ink bg-white">
                  <div className="flex h-24 items-center justify-center border-b-2 border-ink bg-white p-5">
                    <Image src={asset(b.logo)} alt={b.name} width={180} height={56} className="max-h-full w-auto object-contain" />
                  </div>
                  <div className="p-[22px_22px_24px]">
                    <div className="flex items-center justify-between gap-2.5">
                      <h3 className="m-0 font-display text-[19px] font-bold uppercase text-ink">{b.name}</h3>
                      <Badge className="bg-[#FBEDED] text-accent">Doors</Badge>
                    </div>
                    <p className="mt-2.5 text-[15px] leading-[1.58] text-body">{b.blurb}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* OPENERS WE INSTALL (LiftMaster highlight) */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 pb-[70px] pt-5 nav:px-8">
          <Reveal>
            <div className="grid overflow-hidden rounded-[12px] border-2 border-ink bg-ink nav:grid-cols-[240px_1fr] max-nav:grid-cols-1">
              <div className="flex items-center justify-center border-r-2 border-ink bg-white p-7 max-nav:border-b-2 max-nav:border-r-0">
                <Image src={asset("brandlogo-liftmaster.png")} alt="LiftMaster" width={180} height={80} className="max-h-20 w-auto max-w-[80%] object-contain" />
              </div>
              <div className="p-[28px_30px] text-white">
                <Badge className="bg-accent text-white">Openers · Install &amp; Service</Badge>
                <h3 className="mt-3 font-display text-[22px] font-extrabold uppercase text-white">LiftMaster</h3>
                <p className="mt-2.5 max-w-[720px] text-[15.5px] leading-[1.6] text-[#cfcfcf]">The opener we install most, and the one most pros trust. LiftMaster is the professional, dealer installed line, built heavier than the versions on a store shelf. You get the myQ app to open, close, and check your door from your phone, and battery backup models so the door still works in an outage. When we put in a new opener, this is usually the one.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* BRANDS WE SERVICE */}
      <section className="bg-cream border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[84px] nav:px-8">
          <Reveal>
            <div className="max-w-[720px]">
              <Badge className="bg-ink text-white">Service &amp; Repair</Badge>
              <h2 className={cn(h2Cls, "mt-3.5")}>Brands We Service &amp; Repair</h2>
              <p className="mt-3.5 text-[16.5px] leading-[1.6] text-body">We fix doors and openers from every major brand, even the ones we don&apos;t sell new. If you&apos;ve got one of these, we can almost always get the parts and get it running again.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-9 grid gap-[18px] grid-cols-3 max-nav:grid-cols-2 max-xs:grid-cols-1">
              {serviceBrands.map((b) => (
                <div key={b.name} className="flex flex-col overflow-hidden rounded-[10px] border-2 border-ink bg-white">
                  <div className="flex h-24 items-center justify-center border-b-2 border-ink bg-white p-5">
                    <Image src={asset(b.logo)} alt={b.name} width={150} height={52} className="max-h-full w-auto object-contain" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="m-0 font-display text-[17px] font-bold uppercase text-ink">{b.name}</h3>
                      <Badge className="bg-[#E7E2D8] text-[#555]">{b.tag}</Badge>
                    </div>
                    <p className="mt-2.5 text-[14.5px] leading-[1.55] text-body">{b.blurb}</p>
                  </div>
                </div>
              ))}
              <div className="flex flex-col justify-center rounded-[10px] border-2 border-ink bg-ink p-6">
                <h3 className="m-0 font-display text-[17px] font-bold uppercase text-white">Got Another Brand?</h3>
                <p className="mt-2.5 text-[14.5px] leading-[1.55] text-[#a8a8a8]">We carry common parts on the truck and can almost always get yours running again. Tell us what you&apos;ve got.</p>
                <a href={SITE.phoneHref} className="mt-3.5 inline-flex items-center gap-2 text-[13.5px] font-extrabold uppercase tracking-[0.04em] text-white no-underline">
                  Call us <ArrowRight className="h-[15px] w-[15px] text-accent" strokeWidth={2.6} />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHY NO SINGLE BRAND + WIND */}
      <section className="bg-white border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[84px] nav:px-8">
          <Reveal>
            <div className="grid gap-11 nav:grid-cols-2">
              <div>
                <div className={eyebrowCls}>Why We Don&apos;t Push One Brand</div>
                <h2 className="mt-3 font-display text-[clamp(24px,2.8vw,34px)] font-extrabold uppercase leading-[1.05] text-ink">No Badge On The Truck Telling Us What To Recommend</h2>
                <p className="mt-3.5 text-[16.5px] leading-[1.6] text-body">Plenty of companies are locked into one manufacturer and sell you that no matter what. We&apos;d rather earn the call by being straight with you. We install the lines we believe in, we repair whatever you already own, and if your door or opener is past saving, we&apos;ll help you choose a replacement that actually fits your home and budget.</p>
              </div>
              <div className="rounded-[10px] border-2 border-ink bg-ink p-[30px_28px] text-white">
                <span className="inline-flex items-center gap-2.5 rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-extrabold uppercase tracking-[0.1em] text-white">
                  <Zap className="h-3.5 w-3.5" strokeWidth={2.4} /> A Word On Florida Wind Ratings
                </span>
                <p className="mt-3.5 text-[15.5px] leading-[1.6] text-[#cfcfcf]">If you&apos;re replacing a door, ask us about wind rated models. Much of Tampa Bay sits in a wind borne debris zone, so your opening needs a door rated for the pressure at your address. Clopay calls their system WindCode, and Amarr, C.H.I., and Hörmann all offer rated lines.</p>
                <div className="mt-[18px] flex flex-wrap gap-3">
                  <Link href={ROUTES.doorTypes} className="rounded-[7px] bg-white px-[18px] py-2.5 text-[13px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline">How Ratings Work</Link>
                  <Link href={ROUTES.brochures} className="rounded-[7px] border-2 border-[#3a3a3a] px-4 py-[9px] text-[13px] font-extrabold uppercase tracking-[0.04em] text-white no-underline">Brochures</Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream border-t-2 border-ink">
        <div className="mx-auto max-w-[880px] px-5 py-[84px] nav:px-8">
          <Reveal>
            <div className="mx-auto max-w-[680px] text-center">
              <div className={eyebrowCls}>Brand Questions</div>
              <h2 className={cn(h2Cls, "mt-3")}>Frequently Asked</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-9"><FaqAccordion items={faqs} /></div>
          </Reveal>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-accent text-white">
        <Reveal>
          <div className="mx-auto max-w-[1200px] px-5 py-[74px] text-center nav:px-8">
            <h2 className="m-0 font-display text-[clamp(28px,4vw,46px)] font-black uppercase leading-none">Let&apos;s Find The Right Brand For You</h2>
            <p className="mx-auto mt-4 max-w-[640px] text-[17.5px] font-medium leading-[1.55] text-white/90">Need a new door, a new opener, or a repair on the one you&apos;ve got? Call Trinity at (813) 279-6785 or request a free estimate. We&apos;ll give you honest options and get the job done right.</p>
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
