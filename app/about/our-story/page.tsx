import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { SITE, ROUTES, asset } from "@/lib/site";
import { PhotoHero } from "@/components/blocks/hero";
import { Breadcrumb } from "@/components/blocks/primitives";
import { TrustStrip } from "@/components/blocks/trust-strip";
import { FaqAccordion } from "@/components/blocks/faq";
import { FaqJsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/blocks/reveal";

export const metadata: Metadata = {
  title: "Our Story | Trinity Garage Door Service Tampa Bay",
  description:
    "Trinity Garage Door Service is a family owned Tampa Bay company, opening doors since 2007. Honest work, upfront pricing, licensed and insured. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/about/our-story/" },
};

const ico = (paths: ReactNode) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths}</svg>
);

const breadcrumb = [{ label: "Home", href: "/" }, { label: "About", href: ROUTES.aboutStory }, { label: "Our Story" }];

const steps = [
  { n: "1", title: "The Truth, Not The Sale", body: "We tell you what's actually wrong, not what's easiest to sell. If a spring will fix it, we fix the spring." },
  { n: "2", title: "A Price That Holds", body: "You get a clear price before any work starts, so the number never moves on you halfway through." },
  { n: "3", title: "Done Right, Cleaned Up", body: "We do the job right, test it, and clean up before we leave. If the door's past saving, we show you why." },
];

const doCards: { label: string; href: string; icon: ReactNode }[] = [
  { label: "Repair: springs, openers, cables & rollers", href: ROUTES.repair, icon: ico(<path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 1 5.4-5.4l-2.5 2.5-2-2z" />) },
  { label: "Doors that have jumped the track", href: ROUTES.offTrack, icon: ico(<path d="M7 3v18M17 3v18M7 8h10M7 14l10-4" />) },
  { label: "New installation & full replacement", href: ROUTES.installation, icon: ico(<path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-7h6v7" />) },
  { label: "Opener repair & replacement", href: ROUTES.opener, icon: ico(<><rect x="4" y="5" width="16" height="10" rx="1" /><path d="M12 15v4M8 21h8" /></>) },
  { label: "24/7 emergency repair", href: ROUTES.emergency, icon: ico(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>) },
  { label: "See all services", href: ROUTES.services, icon: ico(<path d="M4 6h16M4 12h16M4 18h16" />) },
];

const cities = [
  ["Lutz", "lutz"], ["Land O' Lakes", "land-o-lakes"], ["Wesley Chapel", "wesley-chapel"],
  ["Palm Harbor", "palm-harbor"], ["Oldsmar", "oldsmar"], ["Tampa", "tampa"],
];

const faqs = [
  { q: "Are you really family owned?", a: "Yes. Trinity is family owned and run right here in Tampa Bay. We're not a franchise of a national brand." },
  { q: "Do you charge for estimates?", a: "No. Estimates are free. We'll come look at the job and give you a real number with no obligation to book." },
  { q: "Are you licensed and insured?", a: "Yes, fully licensed, bonded, and insured in Florida under GD13010 and GDI-09484." },
  { q: "Do you offer emergency service?", a: "We do, 24/7. A broken spring or a door stuck halfway doesn't wait for business hours, so neither do we." },
  { q: "How soon can you come out?", a: "Often the same day. Call early and there's a good chance we can have a technician at your house within a couple of hours." },
];

const eyebrowInline = "inline-flex items-center gap-2.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent";
const eyebrowCls = "text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent";

export default function OurStoryPage() {
  return (
    <>
      <FaqJsonLd faqs={faqs} />

      <PhotoHero
        media={<Image src={"/team/team-in-office.jpg"} alt="The Trinity Garage Door team in their Tampa Bay showroom" fill sizes="100vw" priority className="object-cover" />}
        breadcrumb={<Breadcrumb items={breadcrumb} />}
        eyebrow="Family Owned Since 2007"
      >
        <h1 className="m-0 mt-[18px] max-w-[920px] font-display text-[clamp(34px,5.6vw,64px)] font-black uppercase leading-[0.98] tracking-[-0.015em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
          Show Up, Tell The Truth, <span className="inline-block bg-accent px-3 text-white">Do It Right</span>
        </h1>
        <p className="mt-6 max-w-[660px] text-[clamp(17px,2.1vw,21px)] font-medium leading-[1.55] text-white/90">Trinity is a family owned company, and we&apos;ve kept Tampa Bay&apos;s garage doors moving since 2007. No call center, no runaround, no script to read off of. Just honest work at a fair price.</p>
        <div className="mt-[30px] flex flex-wrap gap-[13px]">
          <Link href={ROUTES.bookRepair} className="rounded-[7px] bg-accent px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline shadow-[0_12px_26px_rgba(184,32,42,0.4)] hover:bg-accent-dark">Book a Repair</Link>
          <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 rounded-[7px] bg-white px-[30px] py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline">
            <Phone className="h-[18px] w-[18px] text-accent" strokeWidth={2.2} /> Call {SITE.phoneDisplay}
          </a>
        </div>
      </PhotoHero>

      <TrustStrip />

      {/* OWNER SPLIT */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-[90px] nav:px-8">
          <Reveal>
            <div className="grid items-center gap-14 nav:grid-cols-[1fr_1.05fr]">
              <div className="relative max-nav:order-last">
                <Image src={"/team/owner-jason-grunder.jpg"} alt="Jason, owner of Trinity Garage Door Service" width={580} height={440} className="h-[440px] w-full rounded-[8px] border-2 border-ink bg-[#e7eaec] object-cover object-top" />
                <div className="absolute -bottom-4 -left-4 rounded-[8px] border-2 border-accent bg-ink px-[18px] py-3">
                  <div className="font-display text-[16px] font-extrabold uppercase tracking-[0.02em] text-white">Jason</div>
                  <div className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#9a9a9a]">Owner</div>
                </div>
              </div>
              <div>
                <div className={eyebrowInline}><span className="h-[3px] w-[30px] bg-accent" /> Local, And We Mean It</div>
                <h2 className="mt-4 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03] tracking-[-0.01em] text-ink">Not A Chain With A Local Sounding Name</h2>
                <p className="mt-5 text-[17.5px] leading-[1.64] text-body">When you call Trinity, you reach people who live in the same towns you do. We drive the same roads, sit in the same traffic, and sweat through the same Florida summers that wear your door out. So when we look at your garage, we&apos;re thinking about how it holds up here, not in some other state.</p>
                <p className="mt-4 text-[17.5px] leading-[1.64] text-body">A lot of our customers end up talking to Jason, the owner, directly. He answers questions straight, and he&apos;ll tell you when a repair makes more sense than a replacement, even when the bigger job would pay us more. That kind of honesty is the whole reason people call us back and send their neighbors our way.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW WE WORK (dark) */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[90px] nav:px-8">
          <Reveal>
            <div className="mx-auto max-w-[680px] text-center">
              <div className={eyebrowCls}>How We Work</div>
              <h2 className="mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.04] text-white">We Keep It Plain</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[46px] grid gap-5 grid-cols-3 max-nav:grid-cols-1">
              {steps.map((s, i) => (
                <div key={i} className="rounded-[8px] border border-[#333] border-t-4 border-t-accent bg-[#222] p-[30px_26px]">
                  <div className="flex h-[54px] w-[54px] items-center justify-center rounded-[8px] bg-accent font-display text-[30px] font-black text-white">{s.n}</div>
                  <h3 className="mt-[18px] font-display text-[18px] font-bold uppercase text-white">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.55] text-[#a8a8a8]">{s.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CREW SPLIT */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-[90px] nav:px-8">
          <Reveal>
            <div className="grid items-center gap-14 nav:grid-cols-[1.05fr_1fr]">
              <div>
                <div className={eyebrowInline}><span className="h-[3px] w-[30px] bg-accent" /> The Crew</div>
                <h2 className="mt-4 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03] text-ink">Folks You&apos;ll Remember By Name</h2>
                <p className="mt-5 text-[17.5px] leading-[1.64] text-body">Our technicians have been doing this for years, and our customers tend to remember them by name. Read through our reviews and you&apos;ll see the same folks come up again and again, David and Joey among them, usually right next to words like honest and professional. We take that personally, in a good way.</p>
                <Link href={ROUTES.reviewsPage} className="mt-7 inline-flex items-center gap-2.5 rounded-[7px] bg-ink px-6 py-3.5 text-[14px] font-extrabold uppercase tracking-[0.04em] text-white no-underline">
                  Read The Reviews <ArrowRight className="h-[17px] w-[17px] text-accent" strokeWidth={2.6} />
                </Link>
              </div>
              <div className="relative">
                <Image src={"/team/team-lineup-named.jpg"} alt="The Trinity team, David, Joey, Jason, Andre and Jonah" width={580} height={400} className="h-[400px] w-full rounded-[8px] border-2 border-ink object-cover" />
                <div className="absolute -right-4 -top-4 rounded-[8px] border-2 border-ink bg-accent px-[18px] py-3 font-display text-[14px] font-extrabold uppercase tracking-[0.03em] text-white">Honest &amp; Pro</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT WE DO (cream, bt-do grid) */}
      <section className="bg-cream border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[90px] nav:px-8">
          <Reveal>
            <div className="max-w-[680px]">
              <div className={eyebrowCls}>What We Do</div>
              <h2 className="mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03] text-ink">The Whole Door, Quick Repairs &amp; Full Installs</h2>
              <p className="mt-3.5 text-[16.5px] leading-[1.6] text-body">We install and service doors from Clopay, C.H.I., Hörmann, and Amarr, along with openers from LiftMaster, Genie, Chamberlain, and others.</p>
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

      {/* FLORIDA + AREAS + CREDENTIALS */}
      <section className="bg-white border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[90px] nav:px-8">
          <Reveal>
            <div className="grid gap-12 nav:grid-cols-2">
              <div>
                <div className={eyebrowCls}>We Know Florida Doors</div>
                <h2 className="mt-3 font-display text-[clamp(24px,2.8vw,34px)] font-extrabold uppercase leading-[1.05] text-ink">Built For Heat, Humidity &amp; Salt Air</h2>
                <p className="mt-3.5 text-[16.5px] leading-[1.62] text-body">Heat, humidity, and salt air are rough on springs and hardware, and storm season is rough on the door itself. We&apos;ve spent years working on doors in exactly these conditions, so we know which parts hold up around here and which ones quit early. When we fix or install a door, we do it with our weather in mind.</p>
                <div className="mt-6">
                  <div className="mb-3 text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">Where We Work</div>
                  <div className="flex flex-wrap gap-2.5">
                    {cities.map(([name, slug]) => (
                      <Link key={slug} href={`/service-areas/${slug}/`} className="rounded-[6px] border-2 border-ink px-[15px] py-2 text-[13.5px] font-bold text-ink no-underline transition-colors hover:bg-ink hover:text-white">{name}</Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-[10px] border-2 border-ink bg-ink p-[34px_32px] text-white">
                <div className="font-display text-[20px] font-extrabold uppercase">Licensed, Bonded &amp; Insured</div>
                <p className="mt-3 text-[15.5px] leading-[1.6] text-[#a8a8a8]">Trinity is fully licensed, bonded, and insured in Florida. The credentials matter because they mean the work is done to code and you&apos;re protected if anything ever goes wrong.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="min-w-[130px] flex-1 rounded-[8px] border border-[#333] bg-[#222] p-4">
                    <div className="font-display text-[13px] font-extrabold uppercase text-white">FL Licenses</div>
                    <div className="mt-1.5 text-[15px] font-semibold text-[#cfcfcf]">GD13010<br />GDI-09484</div>
                  </div>
                  <div className="min-w-[130px] flex-1 rounded-[8px] border border-[#333] bg-[#222] p-4">
                    <div className="font-display text-[13px] font-extrabold uppercase text-white">Recognition</div>
                    <div className="mt-1.5 text-[15px] font-semibold text-[#cfcfcf]">BBB A+ Rated<br />Angi Super Service 2024</div>
                  </div>
                </div>
                <div className="mt-[22px] flex items-center gap-4 border-t border-[#333] pt-[22px]">
                  <Image src={asset("badge-angi-super-service-2024.png")} alt="Angi Super Service Award 2024" width={296} height={310} className="h-[54px] w-auto" />
                  <Image src={asset("badge-elite.png")} alt="HomeAdvisor Elite Service" width={162} height={160} className="h-[46px] w-auto" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream border-t-2 border-ink">
        <div className="mx-auto max-w-[880px] px-5 py-[90px] nav:px-8">
          <Reveal>
            <div className="mx-auto max-w-[680px] text-center">
              <div className={eyebrowCls}>A Few Questions We Hear A Lot</div>
              <h2 className="mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03] text-ink">Frequently Asked</h2>
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
            <h2 className="m-0 font-display text-[clamp(28px,4vw,46px)] font-black uppercase leading-none">Let&apos;s Get Your Door Handled</h2>
            <p className="mx-auto mt-4 max-w-[640px] text-[17.5px] font-medium leading-[1.55] text-white/90">Call Trinity at (813) 279-6785 to talk to a real person, or book a repair or a free estimate online. Family owned, licensed and insured, serving Tampa Bay since 2007.</p>
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
