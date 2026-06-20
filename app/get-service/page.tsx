import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Book a Repair or Free Estimate",
  description:
    "Tell us what your garage door needs and a local Trinity tech will get back to you, usually the same day.",
};

export default async function GetServicePage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;
  const isEstimate = intent === "estimate";

  return (
    <section className="bg-sand">
      <div className="mx-auto max-w-[760px] px-6 py-16">
        <div className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">
          {isEstimate ? "Free Estimate" : "Get Service"}
        </div>
        <h1 className="mt-3 font-heading text-[clamp(28px,4vw,44px)] font-black uppercase leading-none text-ink">
          {isEstimate ? "Request a Free Estimate" : "Tell Us What You Need"}
        </h1>
        <p className="mt-4 max-w-[520px] text-[16.5px] leading-[1.58] text-[#4a4a4a]">
          {isEstimate
            ? "Share a few details about your project and we'll get you a fair, no-pressure estimate."
            : "Broken spring, door off the track, opener acting up? Send it over and a local tech will reach out, usually the same day."}
        </p>
        <div className="mt-8 rounded-lg border-2 border-ink bg-white p-6 sm:p-8">
          <ContactForm intent={intent} />
        </div>
      </div>
    </section>
  );
}
