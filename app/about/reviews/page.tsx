import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE, ROUTES, GOOGLE_REVIEWS, asset } from "@/lib/site";
import { Breadcrumb } from "@/components/blocks/primitives";
import { Reveal } from "@/components/blocks/reveal";

export const metadata: Metadata = {
  title: "Reviews | Trinity Garage Door Service Tampa Bay",
  description:
    "Real Google reviews from Tampa Bay homeowners after Trinity worked on their garage doors. 4.9 on Google, BBB A+ accredited. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/about/reviews/" },
};

const SITE_URL = "https://trinitygaragedoorservice.com";
const breadcrumb = [
  { label: "Home", href: "/" },
  { label: "About", href: ROUTES.aboutStory },
  { label: "Reviews" },
];

export default function ReviewsPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}) })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* HERO (dark, review themed) */}
      <section className="relative overflow-hidden border-b-[5px] border-accent bg-[#161616] px-6 py-24">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 82% 26%, rgba(184,32,42,0.32), transparent 48%)" }} />
        <div className="absolute right-[6%] top-[18%] font-display font-black leading-[0.8] text-white/[0.04]" style={{ fontSize: "clamp(120px,22vw,260px)" }} aria-hidden="true">★</div>
        <div className="relative z-[2] mx-auto max-w-[1200px]">
          <Breadcrumb items={breadcrumb} />
          <div className="mt-4 flex items-center gap-3.5">
            <span className="h-1 w-[52px] bg-accent" />
            <span className="text-[13px] font-extrabold uppercase tracking-[0.22em] text-white">Reviews</span>
          </div>
          <h1 className="m-0 mt-[18px] max-w-[920px] font-display text-[clamp(34px,5.6vw,64px)] font-black uppercase leading-[0.98] tracking-[-0.015em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
            We&apos;d Rather Let Our <span className="inline-block bg-accent px-3 text-white">Customers Talk</span>
          </h1>
          <p className="mt-6 max-w-[660px] text-[clamp(17px,2.1vw,21px)] font-medium leading-[1.55] text-white/90">Here&apos;s what people around Tampa Bay have said after we worked on their doors. Every one of these is a real Google review, in their own words.</p>
          <div className="mt-7 flex flex-wrap items-center gap-[18px]">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.08] px-[18px] py-2.5">
              <span className="text-[16px] tracking-[2px] text-accent">★★★★★</span>
              <span className="text-[15px] font-extrabold text-white">4.9 on Google</span>
            </div>
            <div className="inline-flex items-center gap-2.5 text-[14px] font-bold text-white">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-[4px] bg-white text-[11px] font-black text-[#0a4ea2]">A+</span>
              BBB Accredited
            </div>
          </div>
        </div>
      </section>

      {/* INTRO + REVIEWS (cream masonry) */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1200px] px-5 py-[84px] nav:px-8">
          <Reveal>
            <div className="max-w-[680px]">
              <div className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">What Your Neighbors Say</div>
              <h2 className="mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03] text-ink">In Their Own Words</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[42px] gap-5 [column-count:3] max-nav:[column-count:2] max-xs:[column-count:1]">
              {GOOGLE_REVIEWS.map((r, i) => (
                <div key={i} className="mb-5 break-inside-avoid rounded-[10px] border-2 border-ink bg-white p-[24px_22px] shadow-[0_6px_0_rgba(26,26,26,0.06)]">
                  <div className="text-[15px] tracking-[2px] text-accent">★★★★★</div>
                  <p className="mt-[13px] text-[15.5px] font-medium leading-[1.6] text-[#2a2a2a]">&ldquo;{r.quote}&rdquo;</p>
                  <div className="mt-[18px] flex items-center gap-[11px] border-t-2 border-[#eee] pt-4">
                    <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[6px] bg-ink text-[14px] font-extrabold text-white">{r.name[0]}</span>
                    <div>
                      <div className="text-[14px] font-extrabold text-ink">{r.name}</div>
                      <div className="text-[12px] font-semibold text-[#8a8a8a]">via {r.source}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-2 text-[12.5px] font-semibold text-[#8a8a8a]">Real Google reviews, reproduced verbatim. A live Google feed can keep these current.</div>
          </Reveal>
        </div>
      </section>

      {/* AWARDS BAND (dark) */}
      <section className="bg-ink border-t-[5px] border-accent">
        <div className="mx-auto max-w-[1200px] px-5 py-20 nav:px-8">
          <Reveal>
            <div className="grid items-center gap-12 nav:grid-cols-2">
              <div>
                <div className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">Awards &amp; Ratings</div>
                <h2 className="mt-3 font-display text-[clamp(24px,3vw,36px)] font-extrabold uppercase leading-[1.04] text-white">Earned The Slow Way</h2>
                <p className="mt-3.5 text-[16.5px] leading-[1.6] text-[#a8a8a8]">Trinity holds a BBB A+ rating and won the Angi Super Service Award in 2024. We&apos;ve built our reputation one honest job at a time, and the reviews above are the proof we&apos;re proudest of.</p>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-[18px] max-nav:justify-start">
                <div className="flex items-center gap-4 rounded-[10px] border border-[#333] bg-[#222] p-[22px]">
                  <Image src={asset("badge-angi-super-service-2024.png")} alt="Angi Super Service Award 2024" width={160} height={64} className="h-16 w-auto" />
                  <Image src={asset("badge-elite.png")} alt="HomeAdvisor Elite Service" width={130} height={52} className="h-[52px] w-auto" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-accent text-white">
        <Reveal>
          <div className="mx-auto max-w-[1200px] px-5 py-[74px] text-center nav:px-8">
            <h2 className="m-0 font-display text-[clamp(28px,4vw,46px)] font-black uppercase leading-none">Had Us Out To Your Place?</h2>
            <p className="mx-auto mt-4 max-w-[640px] text-[17.5px] font-medium leading-[1.55] text-white/90">A quick Google review really helps a small local company like ours, and we read every one. And if your door is giving you trouble right now, don&apos;t wait it out. Call (813) 279-6785. We answer 24/7.</p>
            <div className="mt-[30px] flex flex-wrap justify-center gap-[13px]">
              <a href={SITE.phoneHref} className="inline-flex items-center gap-2.5 rounded-[7px] bg-white px-8 py-[17px] text-[15px] font-extrabold uppercase tracking-[0.04em] text-accent no-underline">
                <Phone className="h-[18px] w-[18px] text-accent" strokeWidth={2.2} /> Call {SITE.phoneDisplay}
              </a>
              <Link href={ROUTES.bookRepair} className="rounded-[7px] border-2 border-white px-7 py-4 text-[15px] font-extrabold uppercase tracking-[0.04em] text-white no-underline hover:bg-white hover:text-ink">Book a Repair</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
