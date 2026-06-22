import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE, ROUTES, asset } from "@/lib/site";
import { FaqJsonLd } from "@/components/json-ld";
import { Breadcrumb } from "@/components/blocks/primitives";
import { TrustStrip } from "@/components/blocks/trust-strip";
import { FaqAccordion } from "@/components/blocks/faq";
import { Reveal } from "@/components/blocks/reveal";
import { BookOnlineButton } from "@/components/book-online-button";

export const metadata: Metadata = {
  title: "Book a Repair Online | Trinity Garage Door Service Tampa Bay",
  description:
    "Book your Tampa Bay garage door repair online in about a minute. Pick a service and an arrival window with real time availability, often same day. Or call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/book-a-repair/" },
};

const SITE_URL = "https://trinitygaragedoorservice.com";
const ico = (size: number, paths: ReactNode, sw: number | string = 2) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{paths}</svg>
);
const calCheck = (size: number) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18M8 2v4M16 2v4M9 16l2 2 4-4" /></svg>
);
const check = <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>;

const breadcrumb = [{ label: "Home", href: "/" }, { label: "Book a Repair" }];

const steps = [
  { n: "1", title: "Pick The Service", body: "Choose what's going on, a broken spring, a dead opener, an off track door, or a tune up. Not sure? Pick the closest and we'll sort it out." },
  { n: "2", title: "Choose An Arrival Window", body: "You'll see live openings and pick a window that works, like 10am to 12pm. Same day slots show up when they're available." },
  { n: "3", title: "Add Your Details", body: "Your address and contact info, so we know where to come and how to reach you. Some jobs take a small deposit to hold the slot." },
  { n: "4", title: "We Confirm", body: "You get a confirmation by text and email, and the job lands on our schedule. We'll let you know when your tech is on the way." },
];

const whyCards: { icon: ReactNode; title: string; body: string }[] = [
  { icon: ico(26, (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>)), title: "Same Day Help", body: "Most repairs can go on the schedule for the same day, with 24/7 for true emergencies." },
  { icon: ico(26, <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 7-5s7 2 7 5M17 11l2 2 4-4" />), title: "Honest & Local", body: "Family owned in Tampa Bay since 2007. We tell you what it needs, not what's easiest to sell." },
  { icon: ico(26, (<><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>)), title: "Licensed & Insured", body: "Bonded and insured under FL GD13010 and GDI-09484. Your home and your door are protected." },
  { icon: ico(26, (<><path d="M4 4h16v12H5.2L4 17.2z" /><path d="M8 9h8M8 12h5" /></>)), title: "Clear Confirmation", body: "A text and email the moment you book, and a heads up when your tech is on the way." },
];

const otherWays: { icon: ReactNode; title: string; body: string; href: string; foot: ReactNode }[] = [
  { icon: ico(26, <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />), title: "Call Us 24/7", body: "Talk to a real person any time, day or night. Best for emergencies or when you'd rather explain it out loud.", href: SITE.phoneHref, foot: <span className="font-display text-[18px] font-extrabold text-accent">{SITE.phoneDisplay}</span> },
  { icon: ico(26, (<><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></>)), title: "Request A Free Estimate", body: "Weighing a new door or a bigger job? We'll come take a look and give you an honest number, no pressure.", href: ROUTES.estimate, foot: "Get Started" },
  { icon: ico(26, <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />), title: "Send A Message", body: "Put it in writing and we'll get back to you fast. Tell us about your door and what's going on.", href: ROUTES.contact, foot: "Contact Us" },
];

const faqs = [
  { q: "Do I have to create an account to book?", a: "No. You just pick a service and an arrival window, then enter your address and contact details. The whole thing takes about a minute, right here on this page." },
  { q: "Will I get an exact arrival time?", a: "You'll choose an arrival window, like 10am to 12pm, rather than an exact minute. That gives our techs room for traffic and the job before yours, and we'll let you know when your tech is on the way." },
  { q: "Is there a deposit?", a: "Some jobs take a small card deposit to hold your slot, and you'll see that clearly before you confirm. Plenty of bookings don't require one at all." },
  { q: "How do I change or cancel?", a: "Just call us at (813) 279-6785. Changes and cancellations are handled by phone so nothing slips through, and we're happy to find you a better time." },
  { q: "It's an emergency. Should I book online or call?", a: "For a true emergency, like a broken spring with your car trapped or a door stuck open, call us at (813) 279-6785. Our line is open 24/7 and we'll get someone headed your way fast." },
];

const eyebrowCls = "text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent";
const h2Cls = "mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.04]";
const arrow = <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;

export default function BookARepairPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}) })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <FaqJsonLd faqs={faqs} />

      {/* HERO — frame + launch */}
      <section className="relative overflow-hidden border-b-[5px] border-accent px-6 pb-[88px] pt-[84px]">
        <Image src={asset("jobsite-tech-at-residential-garage.jpg")} alt="Trinity technician arriving at a Tampa Bay home" fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(110deg, rgba(10,10,10,.93) 0%, rgba(10,10,10,.72) 52%, rgba(10,10,10,.42) 100%)" }} />
        <div className="relative z-[2] mx-auto max-w-[1200px]">
          <div className="grid items-center gap-12 nav:grid-cols-[1.05fr_.95fr]">
            {/* left */}
            <div>
              <Breadcrumb items={breadcrumb} />
              <div className="mt-4 flex items-center gap-3.5">
                <span className="h-1 w-[52px] bg-accent" />
                <span className="text-[13px] font-extrabold uppercase tracking-[0.22em] text-white">Book Online · 24/7</span>
              </div>
              <h1 className="m-0 mt-[18px] max-w-[640px] font-display text-[clamp(34px,5.4vw,60px)] font-black uppercase leading-[0.98] tracking-[-0.015em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
                Book Your Repair In <span className="inline-block bg-accent px-3 text-white">A Few Taps</span>
              </h1>
              <p className="mt-[22px] max-w-[540px] text-[clamp(17px,2.1vw,20px)] font-medium leading-[1.55] text-white/90">
                Pick a service, choose an arrival window, and tell us where to come. It takes about a minute, and a local Trinity tech is on the way, often the same day. Real time availability, no phone tag.
              </p>
              <div className="mt-[26px] flex flex-wrap items-center gap-[18px]">
                {["Same day windows", "Licensed & insured", "Family owned since 2007"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 text-[14.5px] font-semibold text-white">
                    <span className="text-accent">{check}</span> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* launch card */}
            <div className="rounded-[16px] border-2 border-ink bg-white p-[30px] shadow-[0_26px_60px_rgba(0,0,0,0.45)] max-nav:order-first">
              <div className="flex items-center gap-2.5 font-display text-[13px] font-extrabold uppercase tracking-[0.04em] text-ink">
                <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] bg-accent text-white">{ico(18, (<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18M8 2v4M16 2v4" /></>))}</span>
                Schedule Online
              </div>
              <p className="mt-4 text-[15.5px] leading-[1.55] text-body">Tap below to open our booking window. You&apos;ll see live openings and lock in an arrival time right here, no calls, no waiting.</p>

              {/* HCP embed mount point */}
              <BookOnlineButton className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-[11px] bg-accent p-5 font-display text-[18px] font-extrabold uppercase tracking-[0.03em] text-white">
                {calCheck(20)} Book Online
              </BookOnlineButton>
              <div className="mt-3 text-center text-[12px] font-semibold uppercase tracking-[0.04em] text-[#9a9a9a]">Secure scheduling powered by Housecall Pro</div>

              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-[#e7e0d6]" />
                <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#9a9a9a]">or</span>
                <span className="h-px flex-1 bg-[#e7e0d6]" />
              </div>

              <a href={SITE.phoneHref} className="flex items-center justify-center gap-3 rounded-[11px] bg-ink p-4 no-underline">
                <Phone className="h-5 w-5 text-accent" strokeWidth={2.2} />
                <span className="font-display text-[17px] font-extrabold text-white">{SITE.phoneDisplay}</span>
              </a>
              <div className="mt-2.5 text-center text-[13px] font-semibold text-[#6a6a6a]">Prefer to talk it through? We answer 24/7.</div>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* HOW IT WORKS */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-[88px] nav:px-8">
          <Reveal>
            <div className="mx-auto max-w-[680px] text-center">
              <div className={eyebrowCls}>After You Tap Book Online</div>
              <h2 className={`${h2Cls} text-ink`}>Here&apos;s How It Goes</h2>
              <p className="mt-3.5 text-[16.5px] leading-[1.6] text-body">The booking window opens right on this page. Four quick steps and you&apos;re on the schedule.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[46px] grid gap-5 grid-cols-4 max-nav:grid-cols-2 max-xs:grid-cols-1">
              {steps.map((s, i) => (
                <div key={i} className="rounded-[8px] border-2 border-ink bg-white p-[28px_24px]">
                  <div className="flex h-[54px] w-[54px] items-center justify-center rounded-[8px] bg-accent font-display text-[30px] font-black text-white">{s.n}</div>
                  <h3 className="mt-[18px] font-display text-[18px] font-bold uppercase text-ink">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.55] text-body">{s.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-6 flex items-start gap-3.5 rounded-[8px] border-2 border-ink bg-cream p-[20px_22px]">
              <span className="mt-0.5 flex-none text-accent">{ico(22, (<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>), 2.2)}</span>
              <p className="m-0 text-[15.5px] font-medium leading-[1.6] text-[#2a2a2a]">
                Need to change or cancel? Just give us a call at <a href={SITE.phoneHref} className="font-bold text-accent no-underline">{SITE.phoneDisplay}</a>. Online booking is the fastest way to get on the schedule, and we handle any changes by phone so nothing falls through the cracks.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MID RED BAND */}
      <section className="bg-accent text-white">
        <Reveal>
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-8 px-5 py-[60px] nav:px-8">
            <div className="max-w-[660px]">
              <span className="inline-flex items-center gap-2.5 rounded-full bg-[rgba(0,0,0,0.18)] px-3.5 py-[7px] text-[13px] font-extrabold uppercase tracking-[0.14em] text-white">
                <span className="h-2 w-2 rounded-full bg-white" /> Real Time Availability
              </span>
              <h2 className="m-0 mt-4 font-display text-[clamp(26px,3.6vw,40px)] font-black uppercase leading-none">Ready When You Are</h2>
              <p className="mt-3.5 text-[17px] font-medium leading-[1.58] text-white/90">The booking window shows you exactly what&apos;s open and lets you grab it. Most repairs can be scheduled for the same day.</p>
            </div>
            <BookOnlineButton className="inline-flex flex-none items-center gap-2.5 rounded-[11px] bg-white px-[30px] py-5 font-display text-[17px] font-extrabold uppercase tracking-[0.03em] text-accent">
              {calCheck(20)} Book Online
            </BookOnlineButton>
          </div>
        </Reveal>
      </section>

      {/* WHY BOOK WITH TRINITY */}
      <section className="bg-ink border-t-[5px] border-accent">
        <div className="mx-auto max-w-[1200px] px-5 py-[88px] nav:px-8">
          <Reveal>
            <div className="mx-auto max-w-[680px] text-center">
              <div className={eyebrowCls}>Booking With A Local Crew</div>
              <h2 className={`${h2Cls} text-white`}>It&apos;s Still Us On The Other End</h2>
              <p className="mt-3.5 text-[16px] leading-[1.6] text-[#a8a8a8]">Booking online is quick and easy, but a real Trinity person, not a call center, takes it from there.</p>
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

      {/* OTHER WAYS */}
      <section className="bg-cream border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[84px] nav:px-8">
          <Reveal>
            <div className="mx-auto max-w-[680px] text-center">
              <div className={eyebrowCls}>Rather Not Book It Yourself?</div>
              <h2 className={`${h2Cls} text-ink`}>A Few Other Easy Ways</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[42px] grid gap-[18px] grid-cols-3 max-nav:grid-cols-1">
              {otherWays.map((w, i) => {
                const inner = (
                  <>
                    <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[8px] bg-accent text-white">{w.icon}</div>
                    <h3 className="mt-4 font-display text-[19px] font-bold uppercase text-ink">{w.title}</h3>
                    <p className="mb-3.5 mt-2 text-[15px] leading-[1.55] text-body">{w.body}</p>
                    {typeof w.foot === "string" ? (
                      <span className="inline-flex items-center gap-2 font-display text-[14px] font-extrabold uppercase tracking-[0.04em] text-ink">{w.foot} <span className="text-accent">{arrow}</span></span>
                    ) : (
                      w.foot
                    )}
                  </>
                );
                const cls = "group block rounded-[10px] border-2 border-ink bg-white p-[30px_26px] no-underline transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_16px_32px_rgba(0,0,0,0.12)]";
                return w.href.startsWith("/") ? (
                  <Link key={i} href={w.href} className={cls}>{inner}</Link>
                ) : (
                  <a key={i} href={w.href} className={cls}>{inner}</a>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-t-2 border-ink">
        <div className="mx-auto max-w-[880px] px-5 py-[84px] nav:px-8">
          <Reveal>
            <div className="mx-auto max-w-[680px] text-center">
              <div className={eyebrowCls}>Booking Questions</div>
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
            <h2 className="m-0 font-display text-[clamp(28px,4vw,46px)] font-black uppercase leading-none">Let&apos;s Get Your Door Fixed</h2>
            <p className="mx-auto mt-4 max-w-[640px] text-[17.5px] font-medium leading-[1.55] text-white/90">Book online in about a minute and pick the arrival window that works for you, or call us 24/7. Family owned, licensed and insured, serving Tampa Bay since 2007.</p>
            <div className="mt-[30px] flex flex-wrap justify-center gap-[13px]">
              <BookOnlineButton className="inline-flex items-center gap-2.5 rounded-[9px] bg-white px-[34px] py-[18px] font-display text-[16px] font-extrabold uppercase tracking-[0.03em] text-accent">
                {calCheck(19)} Book Online
              </BookOnlineButton>
              <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 rounded-[9px] border-2 border-white px-7 py-4 text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline hover:bg-white hover:text-accent">
                <Phone className="h-[18px] w-[18px]" strokeWidth={2.2} /> {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
