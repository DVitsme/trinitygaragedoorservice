import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight, Zap } from "lucide-react";
import { SITE, ROUTES, asset } from "@/lib/site";
import { PhotoHero } from "@/components/blocks/hero";
import { Breadcrumb } from "@/components/blocks/primitives";
import { TrustStrip } from "@/components/blocks/trust-strip";
import { FaqAccordion } from "@/components/blocks/faq";
import { FaqJsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/blocks/reveal";

export const metadata: Metadata = {
  title: "Garage Door Types & Styles | Trinity Garage Door Service Tampa Bay",
  description:
    "A plain buyer's guide to garage door types, materials, styles, insulation, and Florida wind ratings. Free estimates. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/doors/types/" },
};

const ico = (paths: ReactNode) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths}</svg>
);

const breadcrumb = [{ label: "Home", href: "/" }, { label: "Doors", href: ROUTES.doorTypes }, { label: "Types & Styles" }];

const opensRows = [
  { label: "Sectional", size: "text-[34px]", badge: "Most Popular", body: "The standard garage door in the United States, and what we install most. Horizontal panels hinged together ride on rollers in a track, bending back to tuck under the ceiling. It takes openers well and is the easiest type to build for wind and impact ratings, which matters a lot in Florida." },
  { label: "Roll Up", size: "text-[26px]", body: "Narrow slats coil around a drum above the opening, with no track running back into the garage. Mostly seen on commercial buildings, though they work on homes too, especially where there's little ceiling room to work with." },
  { label: "Older Styles", size: "text-[22px] leading-[1.05]", body: "Side hinged doors swing out like barn doors, slide to the side doors run along the wall, and tilt up doors are a single solid slab that pivots up. Rare in new construction now. One piece tilt up doors are hard to insulate, seal, and rate for wind, which is another reason sectional doors took over down here." },
];

const materials = [
  { name: "Steel", body: "The most common choice, and a good one. Strong, affordable, barely any upkeep, and the usual starting point for an impact rated door. Smooth, raised panel, or pressed to look like wood. Near the coast, go galvanized and well coated, since steel can rust where it gets scratched." },
  { name: "Wood", body: "Nothing matches real wood for warmth and custom looks. The catch is upkeep, and Florida is hard on it. Sun, humidity, and salt swell and warp wood and fade the finish, so it needs regular sealing. Gorgeous if you'll maintain it, frustrating if you won't." },
  { name: "Aluminum & Glass", body: "Light, modern, and full of daylight, with slim frames around glass panels. The big plus near the water is that aluminum doesn't rust, so it shrugs off salt air better than steel. It dents more easily, and in a storm zone the glass has to be impact rated to meet code." },
  { name: "Composite & Faux Wood", body: "The wood look without the wood headaches. Composite and fiberglass give you real grain and color over a core that won't rot, warp, or corrode, a genuine win in our climate. Quality matters since fiberglass can fade over many years, but for a lot of folks who want the wood look, this is the smart pick." },
];

const looks = [
  { icon: ico(<><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M4 10h16M4 15h16M12 4v16" /></>), name: "Raised Panel", img: "doorstyle-raised-panel-traditional.jpg", imgAlt: "A traditional raised panel garage door", body: "The classic look, rows of rectangular panels, clean and easy to live with. Fits Colonial, ranch, and most traditional homes, which is to say most of the street." },
  { icon: ico(<><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M12 4v16M4 9h16" /><circle cx="8" cy="6.5" r=".6" fill="currentColor" /><circle cx="16" cy="6.5" r=".6" fill="currentColor" /></>), name: "Carriage House", img: "doorstyle-carriage-house.jpg", imgAlt: "A carriage house style garage door with decorative hardware", body: "Mimics old swing open barn doors, usually with decorative hardware and a row of windows up top. Almost always sectional doors styled to look the part, so you get the charm without the swing. Great on Craftsman, farmhouse, and Spanish homes." },
  { icon: ico(<><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M4 12h16" /></>), name: "Modern", img: "doorstyle-contemporary-wood-glass.jpg", imgAlt: "A contemporary garage door in wood and glass", body: "Clean and simple, either a smooth flush face or a full view door of glass and aluminum that floods the garage with light. A natural fit for contemporary and midcentury homes, and popular for shops and indoor outdoor spaces." },
];

const insulation = [
  { tier: "Single Layer", title: "One Skin Of Steel", body: "No insulation. Cheapest and loudest, fine for a detached garage you don't spend time in." },
  { tier: "Double Layer", title: "A Board Of Insulation", body: "Adds insulation behind the skin. A solid middle ground for most attached garages." },
  { tier: "Triple Layer", title: "Foam Between Two Skins", body: "Highest R value, quietest, and the most solid and dent resistant." },
];

const storm: { strong: string; rest: string }[] = [
  { strong: "Florida code sets a wind rating", rest: "for every garage door based on where your house sits. The door has to be rated for the pressure at your address." },
  { strong: "Much of Tampa Bay is a wind borne debris zone,", rest: "not only the coast. There, the opening also has to handle flying debris, which means an impact rated door or a standard door with approved storm protection." },
  { strong: "Impact rated is not the same as wind rated.", rest: "A wind rated door resists pressure. An impact rated door resists pressure and a debris strike. Insulation has nothing to do with either." },
  { strong: "Bracing kits aren't a real substitute.", rest: "A brace stiffens against pressure but won't stop debris, and most come off after the storm. An impact rated door is built for both, stays up year round, and can earn a wind mitigation insurance credit." },
];

const faqs = [
  { q: "What's the most popular type of garage door?", a: "An insulated sectional steel door, by a wide margin. It's affordable and low maintenance, it takes any style, and it's easy to wind and impact rate." },
  { q: "What's the best door material for Florida?", a: "It depends on the look you want and how close you are to the water. Insulated steel is the all around favorite. Right on the coast, aluminum and composite resist salt and humidity better. Wood is beautiful but needs the most upkeep in our climate." },
  { q: "Do I really need an insulated door?", a: "If your garage is attached or has living space above or beside it, yes, it's worth it for comfort and your AC bill. For a standalone garage you barely use, you can skip it." },
  { q: "Does my garage door have to be impact rated?", a: "In much of Tampa Bay, your opening has to handle wind borne debris, which usually means an impact rated door or approved storm protection. We'll tell you what your address requires before you buy." },
  { q: "Steel or aluminum if I live near the water?", a: "Aluminum won't rust, which is a real plus by the coast, but it dents easier. A well coated steel door with good upkeep also holds up fine. We'll walk you through the trade off for your spot." },
];

const eyebrowCls = "text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent";
const h2Cls = "mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03]";

export default function DoorTypesPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: breadcrumb.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: `https://trinitygaragedoorservice.com${c.href}` } : {}) })) }) }} />

      <PhotoHero
        media={<Image src={asset("door-after-brown-wood-sectional.jpg")} alt="A wood look sectional garage door installed by Trinity" fill sizes="100vw" priority className="object-cover" />}
        breadcrumb={<Breadcrumb items={breadcrumb} />}
        eyebrow="A Buyer's Guide"
      >
        <h1 className="m-0 mt-[18px] max-w-[920px] font-display text-[clamp(34px,5.6vw,64px)] font-black uppercase leading-[0.98] tracking-[-0.015em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
          Garage Door Types <span className="inline-block bg-accent px-3 text-white">&amp; Styles</span>
        </h1>
        <p className="mt-6 max-w-[680px] text-[clamp(17px,2.1vw,21px)] font-medium leading-[1.55] text-white/90">Shopping for a door comes down to three questions: how it opens, what it&apos;s made of, and how you want it to look. Down here there&apos;s a fourth, how well it stands up to a storm. Here&apos;s a plain walk through so you show up to your estimate knowing what you want.</p>
        <div className="mt-[30px] flex flex-wrap gap-[13px]">
          <Link href={ROUTES.estimate} className="rounded-[7px] bg-accent px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline shadow-[0_12px_26px_rgba(184,32,42,0.4)] hover:bg-accent-dark">Request a Free Estimate</Link>
          <Link href={ROUTES.brochures} className="inline-flex items-center gap-2.5 rounded-[7px] bg-white px-[30px] py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline">
            Browse Brochures <ArrowRight className="h-[17px] w-[17px] text-accent" strokeWidth={2.6} />
          </Link>
        </div>
      </PhotoHero>

      <TrustStrip />

      {/* HOW THE DOOR OPENS (index, word labels) */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-[88px] nav:px-8">
          <Reveal>
            <div className="max-w-[700px]">
              <div className={eyebrowCls}>How The Door Opens</div>
              <h2 className={`${h2Cls} text-ink`}>Three Ways A Door Moves</h2>
              <p className="mt-3.5 text-[16.5px] leading-[1.6] text-body">Almost every modern home uses the same kind, but here&apos;s the rundown anyway.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[38px] overflow-hidden rounded-[10px] border-2 border-ink bg-white">
              {opensRows.map((r, i) => (
                <div key={i} className={`grid items-center gap-6 p-[26px_28px] nav:grid-cols-[140px_1fr_auto] max-nav:grid-cols-[120px_1fr] ${i < opensRows.length - 1 ? "border-b-2 border-ink" : ""}`}>
                  <span className={`font-display font-black uppercase leading-none text-accent ${r.size}`}>{r.label}</span>
                  <p className="text-[15px] leading-[1.55] text-body">{r.body}</p>
                  {r.badge ? (
                    <span className="self-start whitespace-nowrap rounded-[5px] bg-accent px-2.5 py-[5px] font-display text-[11px] font-extrabold uppercase tracking-[0.05em] text-white max-nav:hidden">{r.badge}</span>
                  ) : (
                    <span className="w-[52px] max-nav:hidden" />
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT IT'S MADE OF */}
      <section className="bg-cream border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[88px] nav:px-8">
          <Reveal>
            <div className="max-w-[700px]">
              <div className={eyebrowCls}>What It&apos;s Made Of</div>
              <h2 className={`${h2Cls} text-ink`}>Four Materials, The Honest Take</h2>
              <p className="mt-3.5 text-[16.5px] leading-[1.6] text-body">The material sets the look, the upkeep, and how the door handles our heat, humidity, and salt air.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[38px] grid gap-[18px] grid-cols-2 max-xs:grid-cols-1">
              {materials.map((m) => (
                <div key={m.name} className="rounded-[8px] border-2 border-ink border-t-4 border-t-accent bg-white p-[28px_26px]">
                  <h3 className="m-0 font-display text-[20px] font-bold uppercase text-ink">{m.name}</h3>
                  <p className="mt-2.5 text-[15.5px] leading-[1.58] text-body">{m.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[18px] rounded-[8px] border-2 border-ink bg-white p-[16px_20px] text-[15px] font-medium text-body">
              <strong className="text-ink">Rough budget:</strong> a plain single layer steel door is the budget end, insulated steel and composite sit in the middle, and real wood and full glass aluminum doors run the highest.
            </div>
          </Reveal>
        </div>
      </section>

      {/* THE LOOK */}
      <section className="bg-white border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[88px] nav:px-8">
          <Reveal>
            <div className="max-w-[700px]">
              <div className={eyebrowCls}>The Look</div>
              <h2 className={`${h2Cls} text-ink`}>The Face It Shows The Street</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[38px] grid gap-[18px] grid-cols-3 max-nav:grid-cols-1">
              {looks.map((l) => (
                <div key={l.name} className="overflow-hidden rounded-[8px] border-2 border-ink bg-cream">
                  {/* Real photo of the style, so the reader can see what the words describe. */}
                  <div className="relative h-[168px] border-b-2 border-ink bg-ink">
                    <Image src={asset(l.img)} alt={l.imgAlt} fill sizes="(max-width:920px) 100vw, 380px" className="object-cover" />
                  </div>
                  <div className="p-[26px]">
                    <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[8px] bg-accent text-white">{l.icon}</div>
                    <h3 className="mt-4 font-display text-[18px] font-bold uppercase text-ink">{l.name}</h3>
                    <p className="mt-2 text-[15px] leading-[1.55] text-body">{l.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* INSULATION (dark) */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[88px] nav:px-8">
          <Reveal>
            <div className="max-w-[700px]">
              <div className={eyebrowCls}>Insulation &amp; R Value</div>
              <h2 className={`${h2Cls} text-white`}>Why It Earns Its Keep Here</h2>
              <p className="mt-3.5 text-[16px] leading-[1.6] text-[#a8a8a8]">A higher R value means more resistance to heat. Doors come in three builds.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[38px] grid gap-[18px] grid-cols-3 max-nav:grid-cols-1">
              {insulation.map((it) => (
                <div key={it.tier} className="rounded-[8px] border border-[#333] border-t-4 border-t-accent bg-[#222] p-[28px_26px]">
                  <div className="font-display text-[15px] font-black uppercase tracking-[0.06em] text-accent">{it.tier}</div>
                  <h3 className="mt-2 font-display text-[18px] font-bold uppercase text-white">{it.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.55] text-[#a8a8a8]">{it.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[18px] flex items-start gap-3.5 rounded-[8px] border border-[#333] bg-[#222] p-[20px_22px]">
              <span className="mt-0.5 flex-none text-accent">{ico(<><circle cx="12" cy="12" r="10" /><path d="M12 8v5M12 16h.01" /></>)}</span>
              <p className="m-0 text-[15px] font-medium leading-[1.6] text-[#cfcfcf]">If your garage is attached, shares a wall, or has a room above it, an insulated door keeps heat out and takes a load off your AC. One honest note: the R value on the sticker is measured at the center of the panel, so the whole installed door performs a bit lower. It&apos;s a good way to compare doors, just not a promise.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* BUILT FOR FLORIDA STORMS */}
      <section className="bg-white border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[88px] nav:px-8">
          <Reveal>
            <div className="max-w-[720px]">
              <span className="inline-flex items-center gap-2.5 rounded-full bg-accent px-3.5 py-[7px] text-[13px] font-extrabold uppercase tracking-[0.14em] text-white">
                <Zap className="h-[15px] w-[15px]" strokeWidth={2.4} /> Built For Florida Storms
              </span>
              <h2 className="mt-4 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03] text-ink">Your Door Does Real Structural Work</h2>
              <p className="mt-3.5 text-[16.5px] leading-[1.6] text-body">A garage door is usually the biggest opening on the house, so it&apos;s a weak point in a hurricane. If a door blows in, wind gets inside and pushes up on the roof and out on the walls. That&apos;s how a bad day turns into a roof off the house.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[34px] grid gap-[18px] grid-cols-2 max-nav:grid-cols-1">
              {storm.map((s, i) => (
                <div key={i} className="flex items-start gap-3.5 rounded-[8px] border-2 border-ink bg-cream p-[22px]">
                  <span className="mt-px flex h-6 w-6 flex-none items-center justify-center bg-accent">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </span>
                  <p className="m-0 text-[15.5px] font-medium leading-[1.55] text-[#2a2a2a]"><strong className="text-ink">{s.strong}</strong> {s.rest}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[18px] flex items-start gap-3.5 rounded-[8px] bg-ink p-[20px_22px]">
              <span className="mt-0.5 flex-none text-accent">{ico(<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>)}</span>
              <p className="m-0 text-[15px] font-medium leading-[1.6] text-[#cfcfcf]">One thing we&apos;ll clear up: the strictest hurricane rules, the ones that require Miami Dade approvals, apply to Miami Dade and Broward counties, not Tampa Bay. Our doors meet Florida code for this area, which is what your home needs. Replacing a door here almost always needs a permit, and we handle that paperwork as part of the job. Our <Link href={ROUTES.installation} className="font-bold text-white underline">installation page</Link> has more on how that goes.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* NOT SURE / CROSS LINKS */}
      <section className="bg-cream border-t-2 border-ink">
        <Reveal>
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-7 px-5 py-[70px] nav:px-8">
            <div className="max-w-[620px]">
              <h2 className="m-0 font-display text-[clamp(22px,2.8vw,32px)] font-extrabold uppercase leading-[1.05] text-ink">Not Sure What&apos;s Right For Your House?</h2>
              <p className="mt-3 text-[16.5px] leading-[1.6] text-body">That&apos;s normal, and it&apos;s what we&apos;re for. Browse the brands we carry and flip through brochures to get ideas, then we&apos;ll meet you at the house for a free estimate.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={ROUTES.brands} className="rounded-[7px] bg-ink px-6 py-3.5 text-[14px] font-extrabold uppercase tracking-[0.04em] text-white no-underline">Brands We Carry</Link>
              <Link href={ROUTES.brochures} className="rounded-[7px] border-2 border-ink bg-white px-[22px] py-3 text-[14px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline">Brochures</Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="bg-white border-t-2 border-ink">
        <div className="mx-auto max-w-[880px] px-5 py-[88px] nav:px-8">
          <Reveal>
            <div className="mx-auto max-w-[680px] text-center">
              <div className={eyebrowCls}>Common Questions About Door Types</div>
              <h2 className={`${h2Cls} text-ink`}>Frequently Asked</h2>
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
            <h2 className="m-0 font-display text-[clamp(28px,4vw,46px)] font-black uppercase leading-none">Let&apos;s Find Your Door</h2>
            <p className="mx-auto mt-4 max-w-[640px] text-[17.5px] font-medium leading-[1.55] text-white/90">Call Trinity at (813) 279-6785 or request a free estimate, and we&apos;ll help you pick a door that looks right and stands up to Florida. Family owned, licensed and insured, serving Tampa Bay since 2007.</p>
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
