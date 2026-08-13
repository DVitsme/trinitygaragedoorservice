import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE, ROUTES } from "@/lib/site";
import { TrustStrip } from "@/components/blocks/trust-strip";
import { Reveal } from "@/components/blocks/reveal";

/**
 * Where every lead form lands after a successful submission.
 *
 * ## ⚠️ There is deliberately NO tracking on this page. Do not add any.
 *
 * The `generate_lead` event fires on the FORM page, in `components/contact-form.tsx`, the moment
 * the API confirms the lead was captured. Nothing fires here. That is not an oversight, it is the
 * entire reason this page is safe to have:
 *
 *   - refresh it              nothing fires
 *   - press Back onto it      nothing fires
 *   - bookmark or share it    nothing fires
 *   - Googlebot crawls it     nothing fires
 *
 * The only way to record a conversion on this site is to actually submit a form and get a 200 back.
 * A tag bound to this URL would fire on every one of those cases, and GTM's History Change trigger
 * fires on `popstate`, so pressing Back would double count. Next's App Router also keeps only one
 * bfcache entry, so Back re-mounts this component and would re-run any `useEffect` push.
 *
 * If someone asks for a conversion pixel "on the thank you page", the answer is that it already
 * fired, more accurately, one navigation earlier.
 *
 * ## One page, not one per form
 *
 * Google Ads reports a conversion's URL from `location.pathname` **at the moment the tag fires**,
 * which is the form page. So the Ads webpages report already separates `/get-service/spring-repair/`
 * from `/get-service/opener-repair/` for free. Ten thank you URLs would be ten `noindex` surfaces
 * to maintain in exchange for a report we already have.
 *
 * ## Rules for this route
 *  - `robots: index false` — a confirmation page in search results is a bad result for everyone.
 *  - **Not in `app/sitemap.ts`.** That file is hand enumerated, so this is excluded by default.
 *  - Not linked from the nav or the footer. The only way in is submitting a form.
 *  - No `canonical`, since there is nothing to canonicalise to.
 *
 * ## Every claim here has to survive contact with reality
 *
 * ⚠️ **Updated 2026-08-12: we DO now email the customer, and we still do not text them.**
 * `app/api/contact/route.ts` sends two emails on an accepted submission: the lead to the office,
 * and a first touch acknowledgement to the customer (`emails/customer-ack-email.tsx`), sent in
 * `after()` so it can never delay or fail the request. There is still **no SMS**, so any copy
 * promising a text is still false. The acknowledgement is also best effort: people mistype their
 * own email address, so this page must not tell anyone to go and look for it.
 * The older `/book-a-repair/thank-you/` page tells people to check their texts and email and to look
 * in their spam folder, which was true of Housecall Pro's booking flow and is false of this one.
 * That page is left alone for the day booking returns; this one must never repeat those lines.
 *
 * The two hour window is real: it is `default_arrival_window` on Trinity's own Housecall Pro
 * account, read 2026-07-28. The $0 trip charge is also true in both service zones but is
 * deliberately NOT stated, because it is a pricing promise pending `CLIENT-ASKS` #25b.
 */
export const metadata: Metadata = {
  title: "Thanks, We've Got It | Trinity Garage Door Service",
  description: "We have your request and a real person will call you back, usually the same day.",
  robots: { index: false, follow: false },
};

const ico = (size: number, paths: ReactNode, sw: number | string = 2) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{paths}</svg>
);

const next: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: ico(26, <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />),
    title: "A Real Person Calls You Back",
    body: "Usually the same day, from our office in Lutz. Not a call centre and not a robot. They will ask what the door is doing and work out what it needs.",
  },
  {
    icon: ico(26, (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>)),
    title: "We Find You A Two Hour Window",
    body: "Once we know what the job is, we book a two hour arrival window rather than an exact minute, which gives your tech room for traffic and the job before yours.",
  },
  {
    icon: ico(26, (<><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>)),
    title: "A Real Technician Shows Up",
    body: "Licensed, insured, and local. They will look at the door, tell you what it needs, and give you a price before any work starts.",
  },
];

const eyebrowCls = "text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent";
const linkCls = "rounded-[7px] border-2 border-ink bg-white px-6 py-3.5 text-[14.5px] font-extrabold uppercase tracking-[0.03em] text-ink no-underline transition-colors hover:bg-ink hover:text-white";

export default function ThankYouPage() {
  return (
    <>
      {/* CONFIRMATION */}
      <section className="border-b-[5px] border-accent bg-ink">
        <div className="mx-auto max-w-[820px] px-5 py-[104px] text-center nav:px-8">
          <Reveal>
            <span className="mx-auto flex h-[74px] w-[74px] items-center justify-center rounded-full bg-accent text-white">
              {ico(38, <path d="M20 6L9 17l-5-5" />, 2.6)}
            </span>
            {/*
              The h1 is the first thing a screen reader lands on after the navigation, and it is the
              whole message. It says what happened, not what will happen, because what happens next
              is the section below.
            */}
            <h1 className="m-0 mt-7 font-display text-[clamp(32px,5vw,54px)] font-black uppercase leading-[0.98] text-white">
              Thanks, We&apos;ve Got It
            </h1>
            <p className="mx-auto mt-5 max-w-[560px] text-[clamp(16.5px,2vw,19px)] leading-[1.58] text-[#a8a8a8]">
              Your request is with us and a real person will call you back, usually the same day.
              Nothing else is needed from you right now.
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
                  Need us sooner? Phones answered till 9pm
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
              <Link href={ROUTES.safetyTips} className={linkCls}>Garage Door Safety Tips</Link>
              <Link href={ROUTES.troubleshooting} className={linkCls}>Troubleshooting</Link>
              <Link href={ROUTES.reviewsPage} className={linkCls}>Reviews</Link>
              <Link href={ROUTES.home} className={linkCls}>Back To Home</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
