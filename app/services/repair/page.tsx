import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE, ROUTES, BRAND_CATALOG, asset } from "@/lib/site";
import { FaqJsonLd } from "@/components/json-ld";
import { PhotoHero } from "@/components/blocks/hero";
import { Breadcrumb } from "@/components/blocks/primitives";
import { TrustStrip } from "@/components/blocks/trust-strip";
import { FaqAccordion } from "@/components/blocks/faq";
import { Reveal } from "@/components/blocks/reveal";

export const metadata: Metadata = {
  title: "Garage Door Repair & Service Tampa Bay | Trinity Garage Door Service",
  description:
    "Same day garage door repair across Tampa Bay. Springs, cables, rollers, tracks, openers, and tune ups. Family owned, honest pricing, free estimates. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/services/repair/" },
};

const SITE_URL = "https://trinitygaragedoorservice.com";

const ico = (size: number, paths: ReactNode, sw: number | string = 2) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {paths}
  </svg>
);

const breadcrumb = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services/" },
  { label: "Repair & Service" },
];

const signs: { icon: ReactNode; body: string }[] = [
  { icon: ico(24, (<><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>)), body: "A loud bang from the garage, almost like a gunshot, often a spring letting go." },
  { icon: ico(24, (<><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M4 8h16M4 13h16" /></>)), body: "The door won't open at all, or it lifts a few inches and stops." },
  { icon: ico(24, (<><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" /></>)), body: "The opener hums or runs, but the door just sits there." },
  { icon: ico(24, <path d="M2 12h3l3-8 4 16 3-8h7" />), body: "Grinding, squealing, or a rattle that keeps getting louder." },
  { icon: ico(24, <path d="M3 17 9 7l5 6 3-4 4 8z" />), body: "The door moves in a jerk, or one side rides higher than the other." },
  { icon: ico(24, (<><path d="M3 6h18M3 12h18" /><path d="M5 18h14" strokeDasharray="2 3" /></>)), body: "A gap at the bottom when the door is shut, or a panel that sags." },
];

const parts: { num: string; title: ReactNode; href: string; desc: string; icon: ReactNode }[] = [
  { num: "01", title: "Springs", href: ROUTES.spring, desc: "The springs do the heavy lifting and fail most. We replace torsion and extension springs, balance the door, and test it. Please don't DIY this one, the tension can cause serious injury.", icon: ico(26, (<><path d="M5 3v18" /><path d="M5 5c5-3 9 3 14 0M5 9c5-3 9 3 14 0M5 13c5-3 9 3 14 0M5 17c5-3 9 3 14 0" /></>)) },
  { num: "02", title: "Cables", href: ROUTES.cablesRollers, desc: "Cables work with the springs to raise and lower the door. When one frays or snaps the door hangs crooked, we replace and reset them so it pulls evenly again.", icon: ico(26, (<><path d="M9 7a4 4 0 0 1 0 10h-1" /><path d="M15 17a4 4 0 0 1 0-10h1" /></>)) },
  { num: "03", title: "Rollers", href: ROUTES.cablesRollers, desc: "Worn rollers make a door loud and rough, and a seized one can pull it off track. We swap them out, the difference in noise is usually night and day.", icon: ico(26, (<><circle cx="7" cy="12" r="4" /><circle cx="17" cy="12" r="4" /></>)) },
  { num: "04", title: "Tracks", href: ROUTES.offTrack, desc: "A bent or loose track makes the door bind, stick, or jump. We straighten what we can and replace what we can't.", icon: ico(26, (<><path d="M7 3v18M17 3v18" /><path d="M7 8h10M7 14h10" /></>)) },
  { num: "05", title: "Openers", href: ROUTES.opener, desc: "Motor runs but the door won't move? Remote acting up? We repair openers, sensors, and wiring, chain, belt, screw, and smart units alike.", icon: ico(26, (<><rect x="4" y="5" width="16" height="10" rx="1" /><path d="M12 15v4M8 21h8" /></>)) },
  { num: "06", title: "Hinges & Hardware", href: ROUTES.tuneUp, desc: "Loose hinges, bolts, and brackets are small parts that cause big rattles. We tighten and replace them so the door moves quietly again.", icon: ico(26, <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 1 5.4-5.4l-2.5 2.5-2-2z" />) },
];

const tuneUpChecks = [
  "Lubricate the moving parts",
  "Tighten the hardware",
  "Check springs & cables for wear",
  "Run a balance test",
  "Test the safety sensors",
];

const steps = [
  { n: "1", title: "We Look It Over", body: "A technician shows up, looks the door over, and tells you what's actually wrong in plain words." },
  { n: "2", title: "Clear Price First", body: "You get a clear price before any work starts, so nothing surprises you when we're done." },
  { n: "3", title: "Fixed Same Visit", body: "Most repairs are finished in the same visit, no waiting around for a second trip." },
  { n: "4", title: "Tested & Tidy", body: "We run the door, make sure it works right, and clean up after ourselves before we go." },
];

const whyCards: { icon: ReactNode; title: string; body: string }[] = [
  { icon: ico(26, <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />), title: "Family Owned", body: "The same family has run this company since 2007." },
  { icon: ico(26, (<><path d="M3 7h13l5 5v5h-3M3 7v10h2" /><circle cx="8" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></>)), title: "Same Day Service", body: "Most repairs done the same day, often within hours." },
  { icon: ico(26, (<><path d="M12 2v6M12 16v6M2 12h6M16 12h6" /><circle cx="12" cy="12" r="3" /></>)), title: "Free Estimates", body: "We'll look, tell you what it needs, and price it, no pressure." },
  { icon: ico(26, (<><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>)), title: "Licensed & Insured", body: "Bonded & insured under FL GD13010 / GDI-09484." },
];

const faqs = [
  { q: "One of my springs broke. Can I still use the door?", a: "Please don't. With a spring gone, the door is far heavier than the opener was built to lift, and running it can burn out the motor or bring the door down hard. Leave it shut and give us a call." },
  { q: "Can I replace a spring myself?", a: "We'd really rather you didn't. Garage door springs hold a tremendous amount of tension, and they can hurt you badly if they let go while you're working on them. This is a job for someone with the right tools and the training to use them." },
  { q: "How long should my springs and opener last?", a: "Springs usually run about seven to ten years, depending on how often you use the door and how well it's kept up. Openers tend to go ten to fifteen. Florida's climate can shorten both, so don't be surprised if yours wear a little sooner." },
  { q: "Do you charge for an estimate?", a: "No. Estimates are free. We'll look at the door, tell you what it needs, and give you a price with no pressure to book on the spot." },
  { q: "How fast can you get here?", a: "Often the same day. For emergencies we're around the clock, so call us and we'll tell you the soonest we can be there." },
];

const eyebrowCls = "text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent";
const h2Cls = "m-0 mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03]";

export default function RepairHubPage() {
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
      <FaqJsonLd faqs={faqs.map((f) => ({ q: f.q, a: f.a }))} />

      {/* HERO */}
      <PhotoHero
        media={<Image src={asset("svc-offtrack-frame-kneeling.jpg")} alt="Trinity technician on a hands on garage door repair" fill sizes="100vw" priority className="object-cover" />}
        breadcrumb={<Breadcrumb items={breadcrumb} />}
        eyebrow="Garage Door Repair"
      >
        <h1 className="m-0 mt-[18px] max-w-[920px] font-display text-[clamp(36px,6.4vw,76px)] font-black uppercase leading-[0.96] tracking-[-0.015em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
          Garage Door Repair <span className="inline-block bg-accent px-3 text-white">&amp; Service</span>
        </h1>
        <p className="mt-6 max-w-[600px] text-[clamp(17px,2.1vw,21px)] font-medium leading-[1.55] text-white/90">
          Same day garage door repair across Tampa Bay, springs, cables, rollers, tracks, openers, and tune ups. Family owned, honest pricing, free estimates.
        </p>
        <div className="mt-[30px] flex flex-wrap gap-[13px]">
          <Link href={ROUTES.bookRepair} className="rounded-[7px] bg-accent px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline shadow-[0_12px_26px_rgba(184,32,42,0.4)] hover:bg-accent-dark">
            Book a Repair
          </Link>
          <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 rounded-[7px] bg-white px-[30px] py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline">
            <Phone className="h-[18px] w-[18px] text-accent" strokeWidth={2.2} /> Call {SITE.phoneDisplay}
          </a>
        </div>
      </PhotoHero>

      <TrustStrip />

      {/* INTRO SPLIT */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-[90px] nav:px-8">
          <Reveal>
            <div className="grid items-center gap-14 nav:grid-cols-[1.05fr_1fr]">
              <div>
                <div className="flex items-center gap-2.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">
                  <span className="h-[3px] w-[30px] flex-none bg-accent" /> The Short Version
                </div>
                <h2 className={`${h2Cls} text-ink`}>When Your Garage Door Quits On You</h2>
                <p className="mt-5 text-[17.5px] leading-[1.64] text-body">
                  Most days you don't think about your garage door. You hit the button, it rolls up, and you get on with your morning. Then one day it won't move, or it makes a sound you've never heard before, and suddenly it's the only thing you can think about.
                </p>
                <p className="mt-4 text-[17.5px] leading-[1.64] text-body">
                  That's usually when people call us. We're Trinity Garage Door Service, a family owned company that's been fixing doors around Tampa Bay since 2007. We cover Hillsborough, Pasco, and Pinellas counties, and most of the time we can get a technician out to you the same day.
                </p>
              </div>
              <div className="relative">
                <Image src={asset("svc-spring-torsion-shaft.jpg")} alt="Garage door opener motor and spring hardware" width={620} height={380} className="h-[380px] w-full rounded-[8px] border-2 border-ink object-cover" />
                <div className="absolute -bottom-4 -right-4 rounded-[8px] border-2 border-ink bg-accent px-[18px] py-3 font-display text-[14px] font-extrabold uppercase tracking-[0.03em] text-white">Same Day Service</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SIGNS */}
      <section className="bg-cream border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[90px] nav:px-8">
          <Reveal>
            <div className="max-w-[680px]">
              <div className={eyebrowCls}>Signs Something's Wrong</div>
              <h2 className={`${h2Cls} text-ink`}>A Door Rarely Breaks Without Warning</h2>
              <p className="mt-3.5 text-[16.5px] leading-[1.6] text-body">Here are the things our customers tell us about most.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-10 grid gap-[18px] grid-cols-3 max-nav:grid-cols-2 max-xs:grid-cols-1">
              {signs.map((s, i) => (
                <div key={i} className="rounded-[8px] border-2 border-ink bg-white p-6">
                  <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[8px] bg-[rgba(184,32,42,0.1)] text-accent">{s.icon}</div>
                  <p className="mt-4 text-[16px] font-semibold leading-[1.5] text-ink">{s.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-6 flex items-start gap-3.5 rounded-[8px] bg-ink p-[20px_22px]">
              <span className="mt-0.5 flex-none text-accent">{ico(22, (<><circle cx="12" cy="12" r="10" /><path d="M12 8v5M12 16h.01" /></>), 2.2)}</span>
              <p className="m-0 text-[15.5px] font-medium leading-[1.6] text-[#cfcfcf]">
                Some of these are small. Some are not. A door that's off balance or running on a tired spring puts a lot of strain on the rest of the system, so it pays to have someone look before a cheap fix turns into a big one.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT WE REPAIR (index + brands) */}
      <section className="bg-white border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[90px] nav:px-8">
          <Reveal>
            <div className="max-w-[680px]">
              <div className={eyebrowCls}>What We Repair</div>
              <h2 className={`${h2Cls} text-ink`}>A Handful of Parts That Take a Beating</h2>
              <p className="mt-3.5 text-[16.5px] leading-[1.6] text-body">When one part goes, the whole door stops cooperating. Here's what we work on.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-10 overflow-hidden rounded-[10px] border-2 border-ink bg-white">
              {parts.map((p, i) => (
                <Link
                  key={i}
                  href={p.href}
                  className={`group grid items-center gap-6 p-[26px_28px] no-underline transition-colors hover:bg-[rgba(184,32,42,0.045)] nav:grid-cols-[104px_1fr_auto] max-nav:grid-cols-[64px_1fr] ${i < parts.length - 1 ? "border-b-2 border-ink" : ""}`}
                >
                  <span className="font-display text-[clamp(30px,4vw,44px)] font-black uppercase leading-none text-accent">{p.num}</span>
                  <div>
                    <h3 className="m-0 font-display text-[20px] font-bold uppercase leading-[1.15] text-ink transition-colors group-hover:text-accent">{p.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-[1.55] text-body">{p.desc}</p>
                  </div>
                  <div className="grid h-[52px] w-[52px] place-items-center rounded-[8px] bg-cream text-accent max-nav:hidden">{p.icon}</div>
                </Link>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-11 text-center">
              <p className="mx-auto max-w-[760px] text-[16px] font-medium leading-[1.6] text-body">
                We service all the major brands, doors and openers both, Clopay, C.H.I., Hörmann, and Amarr doors, plus LiftMaster, Chamberlain, Genie, Craftsman, Linear, and Wayne Dalton openers. Not sure what you've got? No worries, we'll figure it out when we get there.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3.5">
                {BRAND_CATALOG.map((b) => (
                  <span key={b.name} className="flex h-[82px] w-[150px] items-center justify-center rounded-[8px] border-2 border-ink bg-white p-3.5">
                    <Image src={asset(b.logo)} alt={b.name} width={120} height={54} className="max-h-full w-auto object-contain" />
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MID RED BAND (centered) */}
      <section className="bg-accent text-white">
        <Reveal>
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-7 px-5 py-16 text-center nav:px-8">
            <div className="max-w-[760px]">
              <span className="inline-flex items-center gap-2.5 rounded-full bg-[rgba(0,0,0,0.18)] px-3.5 py-[7px] text-[13px] font-extrabold uppercase tracking-[0.14em] text-white">
                <span className="h-2 w-2 rounded-full bg-white" /> Same Day &amp; 24/7
              </span>
              <h2 className="m-0 mt-4 font-display text-[clamp(26px,3.6vw,42px)] font-black uppercase leading-none">It Always Breaks at the Worst Moment</h2>
              <p className="mt-3.5 text-[17px] font-medium leading-[1.58] text-white/90">
                Your car is stuck inside and you're already late, or it's nine at night and the door won't close and you can't leave the house wide open. We keep same day spots open for exactly that, and we run a 24/7 emergency line for the calls that can't wait until morning.
              </p>
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

      {/* TUNE-UPS (dark split) */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[90px] nav:px-8">
          <Reveal>
            <div className="grid items-center gap-[50px] nav:grid-cols-[1fr_1.05fr]">
              <div className="relative">
                <Image src={asset("svc-opener-unit-in-hand.jpg")} alt="Trinity technician servicing a garage door opener" width={620} height={420} className="h-[420px] w-full rounded-[8px] border-2 border-black object-cover" />
                <div className="absolute -bottom-4 -left-4 rounded-[8px] border-2 border-black bg-accent px-[18px] py-3 font-display text-[14px] font-extrabold uppercase tracking-[0.03em] text-white">Twice a Year</div>
              </div>
              <div>
                <div className={eyebrowCls}>Tune Ups &amp; Maintenance</div>
                <h2 className={`${h2Cls} text-white`}>The Cheapest Repair Is the One You Head Off Early</h2>
                <p className="mt-3.5 text-[16.5px] leading-[1.6] text-[#a8a8a8]">A yearly tune up keeps a door running smooth and catches the small stuff before it strands you. When we service a door, we:</p>
                <div className="mt-5 grid gap-3 grid-cols-2 max-xs:grid-cols-1">
                  {tuneUpChecks.map((c, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="mt-px flex h-[22px] w-[22px] flex-none items-center justify-center bg-accent">
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      </span>
                      <span className="text-[15px] font-semibold text-white">{c}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-[15.5px] leading-[1.6] text-[#a8a8a8]">
                  This matters more here than up north. Our heat, humidity, and salt air are hard on metal, springs and cables rust and tire out sooner, rollers stiffen, and tracks pick up corrosion, especially near the coast. A little attention twice a year goes a long way in this climate.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT TO EXPECT (4 steps) */}
      <section className="bg-white border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[90px] nav:px-8">
          <Reveal>
            <div className="mx-auto max-w-[680px] text-center">
              <div className={eyebrowCls}>What to Expect</div>
              <h2 className={`${h2Cls} text-ink`}>No Mystery To It</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-11 grid gap-5 grid-cols-4 max-nav:grid-cols-2 max-xs:grid-cols-1">
              {steps.map((s, i) => (
                <div key={i} className="rounded-[8px] border-2 border-ink bg-white p-[26px_24px]">
                  <div className="flex h-[54px] w-[54px] items-center justify-center rounded-[8px] bg-accent font-display text-[32px] font-black leading-none text-white">{s.n}</div>
                  <h3 className="mt-[18px] font-display text-[17px] font-bold uppercase text-ink">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.55] text-body">{s.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHY TRINITY (dark) */}
      <section className="bg-ink border-t-[5px] border-accent">
        <div className="mx-auto max-w-[1200px] px-5 py-[90px] nav:px-8">
          <Reveal>
            <div className="mx-auto max-w-[680px] text-center">
              <div className={eyebrowCls}>Why Folks Call Trinity</div>
              <h2 className={`${h2Cls} text-white`}>Local, And We Answer to Our Neighbors</h2>
              <p className="mt-3.5 text-[16px] leading-[1.6] text-[#a8a8a8]">That keeps us honest. We won't talk you into a part you don't need, and if a quick fix will hold, we'll tell you so.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[46px] grid gap-5 grid-cols-4 max-nav:grid-cols-2 max-xs:grid-cols-1">
              {whyCards.map((c, i) => (
                <div key={i} className="rounded-[8px] border border-[#333] border-t-4 border-t-accent bg-[#222] p-7">
                  <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[8px] bg-accent text-white">{c.icon}</div>
                  <h3 className="mt-[18px] font-display text-[18px] font-bold uppercase text-white">{c.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.55] text-[#a8a8a8]">{c.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[880px] px-5 py-[90px] nav:px-8">
          <Reveal>
            <div className="mx-auto max-w-[680px] text-center">
              <div className={eyebrowCls}>A Few Questions We Hear A Lot</div>
              <h2 className={`${h2Cls} text-ink`}>Frequently Asked</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-9">
              <FaqAccordion items={faqs.map((f) => ({ q: f.q, a: f.a }))} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-accent text-white">
        <Reveal>
          <div className="mx-auto max-w-[1200px] px-5 py-[74px] text-center nav:px-8">
            <h2 className="m-0 font-display text-[clamp(28px,4vw,46px)] font-black uppercase leading-none">Let&apos;s Get Your Door Working Again</h2>
            <p className="mx-auto mt-4 max-w-[640px] text-[17.5px] font-medium leading-[1.55] text-white/90">
              If your garage door is acting up, call Trinity at (813) 279-6785 and we'll point a technician your way. You can also request a free estimate online, we'll follow up quickly.
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
