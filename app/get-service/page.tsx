import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { ContactForm } from "@/components/contact-form";
import { Breadcrumb } from "@/components/blocks/primitives";
import { TrustStrip } from "@/components/blocks/trust-strip";
import { Reveal } from "@/components/blocks/reveal";

/**
 * The lead capture page. **24 CTAs across the site land here**, more than any other destination,
 * and until now it was a 38 line page still using pre design port tokens (`bg-sand`,
 * `font-heading`) with no breadcrumb, no phone number and no trust strip. The highest intent page
 * on the site was its least finished one.
 *
 * ⚠️ **This stays a real page and does NOT become a modal**, despite the ads specialist asking for
 * a popup. A modal has no URL, and Google Ads' Landing Page report and Quality Score are evaluated
 * per URL, so a modal only form is invisible to exactly the attribution this rebuild exists to
 * provide. What he actually asked for was something nicer than the Housecall Pro popup, and the
 * answer to that is to make the page nicer, which is what this is.
 */
export const metadata: Metadata = {
  title: "Request a Callback | Trinity Garage Door Service Tampa Bay",
  description:
    "Tell us what your garage door needs and a local Trinity technician calls you back, usually the same day. Family owned in Tampa Bay since 2007.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/get-service/" },
};

const reasons = [
  "A real person calls you back, usually the same day",
  "Two hour arrival windows, not an all day wait",
  "Licensed and insured, FL GD13010 and GDI-09484",
  "Family owned in Tampa Bay since 2007",
];

export default async function GetServicePage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;
  const isEstimate = intent === "estimate";

  return (
    <>
      <section className="border-b-[5px] border-accent bg-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[64px] nav:px-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: isEstimate ? "Free Estimate" : "Get Started" }]} />
          <div className="mt-4 flex items-center gap-3.5">
            <span className="h-1 w-[52px] bg-accent" />
            <span className="text-[13px] font-extrabold uppercase tracking-[0.22em] text-white">
              {isEstimate ? "Free Estimate" : "Get Started"}
            </span>
          </div>
          <h1 className="m-0 mt-[18px] max-w-[820px] font-display text-[clamp(30px,4.8vw,54px)] font-black uppercase leading-[1.0] text-white">
            {isEstimate ? "Request a Free Estimate" : "Tell Us What's Going On"}
          </h1>
          <p className="mt-5 max-w-[620px] text-[clamp(16.5px,2vw,19px)] leading-[1.58] text-[#a8a8a8]">
            {isEstimate
              ? "Tell us about the project and we'll come take a look. The estimate is free and the advice is honest."
              : "Broken spring, door off the track, opener that quit? Send it over and a local technician will call you back, usually the same day."}
          </p>
        </div>
      </section>

      <TrustStrip />

      <section className="bg-cream">
        <div className="mx-auto max-w-[1200px] px-5 py-[64px] nav:px-8">
          <Reveal>
            <div className="grid items-start gap-11 nav:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[10px] border-2 border-ink bg-white p-[28px_26px] max-xs:p-[22px_18px]">
                <ContactForm intent={intent} />
              </div>

              {/* Trust sits BESIDE the form, not inside it, so it cannot add friction to the fields. */}
              <div>
                <h2 className="m-0 font-display text-[22px] font-extrabold uppercase leading-[1.1] text-ink">
                  Rather Just Call?
                </h2>
                <p className="mt-2.5 text-[16px] leading-[1.55] text-body">
                  Most people do, and it is usually faster. The phones are answered until 9pm.
                </p>
                <a
                  href={SITE.phoneHref}
                  className="mt-4 inline-flex items-center gap-3.5 rounded-[8px] border-2 border-ink bg-white px-5 py-4 no-underline"
                >
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-[7px] bg-accent text-white">
                    <Phone className="h-[22px] w-[22px]" strokeWidth={2} />
                  </span>
                  <span>
                    <span className="block text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-[#8a8a8a]">
                      Call Trinity
                    </span>
                    <span className="block font-display text-[21px] font-extrabold text-ink">
                      {SITE.phoneDisplay}
                    </span>
                  </span>
                </a>

                <ul className="mt-8 list-none space-y-3 p-0">
                  {reasons.map((r) => (
                    <li key={r} className="flex items-start gap-3">
                      <span className="mt-px flex h-6 w-6 flex-none items-center justify-center bg-accent">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                      <span className="text-[16px] leading-[1.5] text-ink">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
