import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE, ROUTES } from "@/lib/site";
import { TrustStrip } from "@/components/blocks/trust-strip";
import { Reveal } from "@/components/blocks/reveal";

/**
 * Booking confirmation page. **This page exists to be measurable, not to be found.**
 *
 * Housecall Pro fires **no "booking completed" event** of any kind: we read their whole embed
 * script and there is nothing to listen for, and the booking itself happens inside a cross origin
 * iframe we cannot see into. Their dashboard setting **Online Booking → booking redirect**,
 * pointed at a page we own, is the ONLY supported way to know a booking happened. Without it every
 * future claim about whether this site produces work is a guess. That matters here more than most
 * places: 1 of their 300 most recent jobs carried the "Trinity Website" lead source.
 *
 * ⚠️ **Jason has to switch the redirect on in Housecall Pro.** Until he does, this page is correct
 * but unreachable. See `CLIENT-ASKS` #35.
 *
 * Rules for this route, all deliberate:
 *  - `robots: index false` — a confirmation page in search results is a bad result for everyone,
 *    and it would let people land here without booking, corrupting the number it exists to produce.
 *  - **Not in `app/sitemap.ts`.** That file is hand enumerated from ROUTES, so this is excluded by
 *    default. Do not add it.
 *  - Not linked from the nav or footer. The only way in is HCP's redirect.
 *  - No `canonical`, since there is nothing to canonicalise to.
 *
 * ⚠️ There is **no analytics on this site yet** (the privacy policy says so explicitly). This page
 * gives a distinct URL that can be counted, and it is where a conversion event goes the moment
 * analytics lands. It is necessary for measurement, not by itself sufficient.
 */
export const metadata: Metadata = {
  title: "You're Booked | Trinity Garage Door Service",
  description: "Your garage door appointment with Trinity is confirmed.",
  robots: { index: false, follow: false },
};

const ico = (size: number, paths: ReactNode, sw: number | string = 2) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{paths}</svg>
);

/**
 * Every claim here is verified from Trinity's own Housecall Pro account, read only on 2026-07-28:
 * the 120 minute arrival window is `default_arrival_window`, and the text plus email confirmation
 * is HCP's own behaviour. The $0 trip charge is true in both service zones but is deliberately NOT
 * stated yet, because it is a pricing promise pending `CLIENT-ASKS` #25b.
 */
const next: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: ico(26, (<><path d="M4 4h16v12H5.2L4 17.2z" /><path d="M8 9h8M8 12h5" /></>)),
    title: "Check Your Texts And Email",
    body: "A confirmation is on its way with your service, the day, and your arrival window. If it has not shown up in a few minutes, have a look in your spam folder.",
  },
  {
    icon: ico(26, (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>)),
    title: "We Come In A Two Hour Window",
    body: "You picked a window rather than an exact minute, which gives your tech room for traffic and the job before yours. We will let you know when they are on the way.",
  },
  {
    icon: ico(26, (<><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>)),
    title: "A Real Technician Shows Up",
    body: "Licensed, insured, and local. They will look at the door, tell you what it needs, and give you a price before any work starts.",
  },
];

const eyebrowCls = "text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent";

export default function BookingThankYouPage() {
  return (
    <>
      {/* CONFIRMATION */}
      <section className="border-b-[5px] border-accent bg-ink">
        <div className="mx-auto max-w-[820px] px-5 py-[104px] text-center nav:px-8">
          <Reveal>
            <span className="mx-auto flex h-[74px] w-[74px] items-center justify-center rounded-full bg-accent text-white">
              {ico(38, <path d="M20 6L9 17l-5-5" />, 2.6)}
            </span>
            <h1 className="m-0 mt-7 font-display text-[clamp(32px,5vw,54px)] font-black uppercase leading-[0.98] text-white">
              You&apos;re Booked
            </h1>
            <p className="mx-auto mt-5 max-w-[560px] text-[clamp(16.5px,2vw,19px)] leading-[1.58] text-[#a8a8a8]">
              Thanks for choosing Trinity. Your appointment is on our schedule and a confirmation is
              on its way to you now.
            </p>
            <a
              href={SITE.phoneHref}
              className="mt-8 inline-flex items-center gap-3.5 rounded-[8px] border-2 border-[#333] bg-[#222] px-5 py-4 no-underline"
            >
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-[7px] bg-accent text-white">
                <Phone className="h-[22px] w-[22px]" strokeWidth={2} />
              </span>
              <span className="text-left">
                <span className="block text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-[#9a9a9a]">
                  Need to change something?
                </span>
                <span className="block font-display text-[21px] font-extrabold text-white">{SITE.phoneDisplay}</span>
              </span>
            </a>
          </Reveal>
        </div>
      </section>

      <TrustStrip />

      {/* WHAT HAPPENS NEXT */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-[84px] nav:px-8">
          <Reveal>
            <div className="mx-auto max-w-[620px] text-center">
              <div className={eyebrowCls}>What Happens Next</div>
              <h2 className="m-0 mt-3 font-display text-[clamp(26px,3.4vw,38px)] font-extrabold uppercase leading-[1.04] text-ink">
                Here&apos;s How It Goes From Here
              </h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[46px] grid gap-5 grid-cols-3 max-nav:grid-cols-1">
              {next.map((c) => (
                <div key={c.title} className="rounded-[10px] border-2 border-ink bg-white p-[28px_26px]">
                  <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[8px] bg-accent text-white">{c.icon}</div>
                  <h3 className="mt-[18px] font-display text-[18px] font-bold uppercase leading-[1.15] text-ink">{c.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.55] text-body">{c.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHILE YOU WAIT */}
      <section className="border-t-2 border-ink bg-cream">
        <div className="mx-auto max-w-[1200px] px-5 py-[74px] nav:px-8">
          <Reveal>
            <div className="mx-auto max-w-[620px] text-center">
              <div className={eyebrowCls}>While You Wait</div>
              <h2 className="m-0 mt-3 font-display text-[clamp(24px,3vw,34px)] font-extrabold uppercase leading-[1.04] text-ink">
                A Few Things Worth A Look
              </h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="mx-auto mt-9 flex max-w-[760px] flex-wrap justify-center gap-3">
              <Link href={ROUTES.safetyTips} className="rounded-[7px] border-2 border-ink bg-white px-6 py-3.5 text-[14.5px] font-extrabold uppercase tracking-[0.03em] text-ink no-underline transition-colors hover:bg-ink hover:text-white">
                Garage Door Safety Tips
              </Link>
              <Link href={ROUTES.troubleshooting} className="rounded-[7px] border-2 border-ink bg-white px-6 py-3.5 text-[14.5px] font-extrabold uppercase tracking-[0.03em] text-ink no-underline transition-colors hover:bg-ink hover:text-white">
                Troubleshooting
              </Link>
              <Link href={ROUTES.reviewsPage} className="rounded-[7px] border-2 border-ink bg-white px-6 py-3.5 text-[14.5px] font-extrabold uppercase tracking-[0.03em] text-ink no-underline transition-colors hover:bg-ink hover:text-white">
                Reviews
              </Link>
              <Link href={ROUTES.home} className="rounded-[7px] border-2 border-ink bg-white px-6 py-3.5 text-[14.5px] font-extrabold uppercase tracking-[0.03em] text-ink no-underline transition-colors hover:bg-ink hover:text-white">
                Back To Home
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
