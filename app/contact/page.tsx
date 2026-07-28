import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE, ROUTES, COUNTY_PHONES } from "@/lib/site";
import { Breadcrumb } from "@/components/blocks/primitives";
import { ServiceAreaMapMock } from "@/components/blocks/service-area-map-mock";
import { Reveal } from "@/components/blocks/reveal";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact Trinity Garage Door Service | Tampa Bay",
  description:
    "Call, book online, or send a message. Family owned garage door service across Tampa Bay, 24/7 for emergencies. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/contact/" },
};

const payments = ["Cash", "Check", "Card", "Debit", "Google Pay", "Zelle"];

const areaChips = [
  { label: "Lutz", href: "/service-areas/lutz/" },
  { label: "Land O' Lakes", href: "/service-areas/land-o-lakes/" },
  { label: "Wesley Chapel", href: "/service-areas/wesley-chapel/" },
  { label: "Palm Harbor", href: "/service-areas/palm-harbor/" },
  { label: "Oldsmar", href: "/service-areas/oldsmar/" },
  { label: "Tampa", href: "/service-areas/tampa/" },
];

const steps: { n: string; title: string; body: string }[] = [
  { n: "1", title: "A Real Person Replies", body: "When you call or send a message, a real person gets back to you fast, not an auto responder." },
  { n: "2", title: "You Get Confirmation", body: "Once you're on the schedule, we send a text and email confirmation so you know it's set." },
  { n: "3", title: "We're On The Way", body: "We let you know when your technician is headed your way, so you're not stuck waiting around." },
];

const eyebrowCls = "text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent";

export default function ContactPage() {
  return (
    <>
      {/* HEADER BAND */}
      <section className="relative overflow-hidden border-b-[5px] border-accent bg-[#161616] px-6 pb-16 pt-[72px]">
        <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(circle at 84% 26%, rgba(184,32,42,0.3), transparent 48%)" }} />
        <div className="relative z-[2] mx-auto max-w-[1200px]">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
          <div className="mt-4 flex items-center gap-3.5">
            <span className="h-1 w-[52px] bg-accent" />
            <span className="text-[13px] font-extrabold uppercase tracking-[0.22em] text-white">A Real Person, Not A Call Center</span>
          </div>
          <h1 className="m-0 mt-[18px] max-w-[920px] font-display text-[clamp(34px,5.6vw,62px)] font-black uppercase leading-[0.98] tracking-[-0.015em] text-white">Get In Touch</h1>
          <p className="mt-[22px] max-w-[680px] text-[clamp(17px,2.1vw,21px)] font-medium leading-[1.55] text-white/90">
            Call, book online, or send us a message, whatever is easiest. We&apos;re family owned and local, so you&apos;re talking to folks right here in Tampa Bay, not a call center three states away.
          </p>
        </div>
      </section>

      {/* CONTACT METHODS + FORM */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-[70px] nav:px-8">
          <Reveal>
            <div className="grid items-start gap-11 nav:grid-cols-[1fr_1.05fr]">
              {/* LEFT: ways to reach us */}
              <div>
                {/* The three county lines. Each row is tap-to-call on mobile. */}
                <div className="overflow-hidden rounded-[12px] border-2 border-ink bg-ink">
                  <div className="flex items-center gap-4 border-b border-[#333] px-6 py-[18px]">
                    <span className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-[10px] bg-accent text-white">
                      <Phone className="h-[22px] w-[22px]" strokeWidth={2} />
                    </span>
                    <span>
                      <span className="block text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-[#9a9a9a]">Call us 24/7 for emergencies</span>
                      <span className="block font-display text-[16px] font-extrabold uppercase text-white">Dial the line for your county</span>
                    </span>
                  </div>
                  {COUNTY_PHONES.map((p, i) => (
                    <a
                      key={p.county}
                      href={p.href}
                      aria-label={`Call our ${p.county} County line, ${p.display}`}
                      className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-6 py-[17px] no-underline transition-colors hover:bg-[#222] ${i > 0 ? "border-t border-[#2a2a2a]" : ""}`}
                    >
                      <span>
                        <span className="block font-display text-[14px] font-extrabold uppercase tracking-[0.04em] text-white">{p.county} County</span>
                        <span className="block text-[13px] text-[#9a9a9a]">{p.cities}</span>
                      </span>
                      <span className="whitespace-nowrap font-display text-[21px] font-black text-accent-on-dark">{p.display}</span>
                    </a>
                  ))}
                </div>

                <div className="mt-3.5 grid grid-cols-2 gap-3 max-xs:grid-cols-1">
                  <Link href={ROUTES.bookRepair} className="flex items-center justify-center rounded-[9px] bg-accent px-4 py-4 text-[14px] font-extrabold uppercase tracking-[0.04em] text-white no-underline">Book a Repair</Link>
                  <Link href={ROUTES.estimate} className="flex items-center justify-center rounded-[9px] border-2 border-ink bg-white px-4 py-3.5 text-[14px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline">Free Estimate</Link>
                </div>

                {/* Hours */}
                <div className="mt-5 overflow-hidden rounded-[12px] border-2 border-ink">
                  <div className="flex items-center gap-2.5 border-b-2 border-ink bg-cream px-5 py-3.5">
                    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                    <span className="font-display text-[15px] font-extrabold uppercase text-ink">Hours</span>
                  </div>
                  <div className="flex flex-col gap-3 px-5 py-[18px]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[15px] font-bold text-ink">Office</span>
                      <span className="text-[14.5px] font-semibold text-body">Mon to Sat, 7am to 9pm · Sun closed</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-[#ececec] pt-3">
                      <span className="text-[15px] font-bold text-ink">Emergencies</span>
                      <span className="inline-flex items-center gap-1.5 text-[14.5px] font-extrabold text-accent">
                        <span className="h-2 w-2 rounded-full bg-accent" /> 24/7, every day
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payments */}
                <div className="mt-4 rounded-[12px] border-2 border-ink bg-cream px-5 py-[18px]">
                  <div className="font-display text-[13px] font-extrabold uppercase tracking-[0.04em] text-ink">We Accept</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {payments.map((p) => (
                      <span key={p} className="rounded-[6px] border-[1.5px] border-[#d8cfc1] bg-white px-3 py-1.5 text-[13px] font-bold text-[#3a3a3a]">{p}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: message form (wired to /api/contact) */}
              <div className="rounded-[14px] border-2 border-ink bg-white p-[30px] shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
                <h2 className="m-0 font-display text-[24px] font-extrabold uppercase text-ink">Send Us A Message</h2>
                <p className="mt-2 text-[15px] leading-[1.55] text-body">Rather put it in writing? Fill out a few details about your door and what&apos;s going on, and we&apos;ll get back to you quickly.</p>
                <div className="mt-[22px]">
                  <ContactForm />
                </div>
                <p className="mt-3 text-center text-[12.5px] font-medium text-[#8a8a8a]">
                  {/*
                    Was "We don't share your info", which is not true and is the kind of absolute
                    claim FDUTPA lets customers sue over (it carries fee shifting). The form data
                    already reaches Cloudflare, Turnstile and Resend, and the privacy policy says
                    so. This wording is accurate today and stays accurate when leads start going
                    into Housecall Pro.
                  */}
                  A real person gets back to you fast. We use your details to answer you and schedule the work, nothing else. See our{" "}
                  <Link href={ROUTES.privacy} className="font-bold text-accent no-underline">privacy policy</Link>.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHERE WE WORK */}
      <section className="bg-cream border-t-2 border-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-20 nav:px-8">
          <Reveal>
            <div className="grid items-center gap-11 nav:grid-cols-2">
              <div>
                <div className={eyebrowCls}>Where We Work</div>
                <h2 className="m-0 mt-3 font-display text-[clamp(24px,3vw,36px)] font-extrabold uppercase leading-[1.04] text-ink">We&apos;re Mobile, So We Come To You</h2>
                <p className="mt-3.5 text-[16.5px] leading-[1.6] text-body">
                  We cover Tampa Bay across Hillsborough, Pasco, and Pinellas counties, plus the towns nearby. Find yours on our{" "}
                  <Link href={ROUTES.serviceAreas} className="font-bold text-accent no-underline">service areas</Link> page.
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {areaChips.map((a) => (
                    <Link key={a.label} href={a.href} className="rounded-[6px] border-2 border-ink px-4 py-2.5 text-[14px] font-bold text-ink no-underline transition-colors hover:bg-ink hover:text-white">
                      {a.label}
                    </Link>
                  ))}
                </div>
                <div className="mt-[18px] text-[13px] font-semibold text-[#8a8a8a]">Street address &amp; map to be added once the business address is confirmed.</div>
              </div>
              <ServiceAreaMapMock className="h-[320px]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT HAPPENS AFTER (dark) */}
      <section className="bg-ink border-t-[5px] border-accent">
        <div className="mx-auto max-w-[1200px] px-5 py-20 nav:px-8">
          <Reveal>
            <div className="mx-auto max-w-[680px] text-center">
              <div className={eyebrowCls}>What Happens After You Reach Out</div>
              <h2 className="m-0 mt-3 font-display text-[clamp(24px,3vw,38px)] font-extrabold uppercase leading-[1.04] text-white">No Black Hole Here</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-11 grid gap-5 grid-cols-3 max-nav:grid-cols-1">
              {steps.map((s, i) => (
                <div key={i} className="rounded-[8px] border border-[#333] border-t-4 border-t-accent bg-[#222] p-[28px_26px]">
                  <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[8px] bg-accent font-display text-[30px] font-black text-white">{s.n}</div>
                  <h3 className="mt-[18px] font-display text-[18px] font-bold uppercase text-white">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.55] text-[#a8a8a8]">{s.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-accent text-white">
        <Reveal>
          <div className="mx-auto max-w-[1200px] px-5 py-[74px] text-center nav:px-8">
            <h2 className="m-0 font-display text-[clamp(28px,4vw,46px)] font-black uppercase leading-none">Let&apos;s Get Your Door Handled</h2>
            <p className="mx-auto mt-4 max-w-[640px] text-[17.5px] font-medium leading-[1.55] text-white/90">
              However you reach us, we&apos;ll take care of it. Call the line for your county, book online, or send a message and we&apos;ll take it from there. Family owned and local since 2007, licensed and insured.
            </p>
            <div className="mt-[30px] flex flex-wrap justify-center gap-[13px]">
              <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 rounded-[7px] bg-white px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-accent no-underline">
                <Phone className="h-[18px] w-[18px] text-accent" strokeWidth={2.2} /> Call {SITE.phoneDisplay}
              </a>
              <Link href={ROUTES.bookRepair} className="rounded-[7px] border-2 border-white px-7 py-4 text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline hover:bg-white hover:text-ink">
                Book a Repair
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
