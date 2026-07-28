import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE, ROUTES } from "@/lib/site";
import { Breadcrumb } from "@/components/blocks/primitives";
import { Reveal } from "@/components/blocks/reveal";
import { TrustStrip } from "@/components/blocks/trust-strip";

export const metadata: Metadata = {
  title: "Garage Door Safety Tips for Homeowners | Trinity Garage Door",
  description:
    "Simple garage door safety tips for Tampa Bay homeowners: sensors, the manual release, keeping kids safe, and yearly maintenance. Questions? Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/resources/safety-tips/" },
};

const SITE_URL = "https://trinitygaragedoorservice.com";
const breadcrumb = [{ label: "Home", href: "/" }, { label: "Safety Tips" }];

const eyebrowCls = "text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent";
const h2Cls = "m-0 mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03]";

/** Copy is verbatim from copy/resources/safety-tips.md. The heading numbers are rendered as design, not text. */
type Tip = { n: number; title: string; why: string; tip: ReactNode };

const tips: Tip[] = [
  {
    n: 1,
    title: "Check the safety sensors regularly",
    why: "Safety sensors keep the garage door from closing on a person or an object. They sit near the bottom of the door tracks and send an invisible beam across the opening to catch anything in the door's path.",
    tip: "Check the sensors once a month to make sure they are clean and lined up. If the door does not reverse when it meets an object, have a professional like Trinity take a look.",
  },
  {
    n: 2,
    title: "Learn how to use the manual controls",
    why: "Knowing how to open your door by hand during a power outage or bad weather is important.",
    tip: "Find the red manual release cord. It hangs from the door's trolley and is easy to spot. Learn how the pull disconnects the opener so you can lift the door by hand.",
  },
  {
    n: 3,
    title: "Master the emergency release",
    why: "The emergency release can save a life if someone is ever trapped under a door.",
    tip: "Make sure every adult in the house knows how to use it, and test it now and then so you know it moves freely.",
  },
  {
    n: 4,
    title: "Never stand under a moving door",
    why: "A door that is opening or closing can cause serious injury.",
    tip: "Make it a house rule that no one, especially children, stands near the door while it moves. Wait until the door is all the way open before you walk or drive through.",
  },
  {
    n: 5,
    title: "Keep the openers out of reach",
    why: "Kids are curious, and a remote can look like a toy.",
    tip: "Store remotes and key fobs somewhere children cannot get to them, and keep wall buttons out of their reach too.",
  },
  {
    n: 6,
    title: "Mount wall controls at a safe height",
    why: "Wall buttons should be high enough that a child cannot reach them by accident.",
    tip: "Mount the wall control at least five feet off the floor, where adults can reach it easily but kids cannot.",
  },
  {
    n: 7,
    title: "Teach children about door safety",
    why: "A garage door is not a toy, and misuse can lead to a serious accident.",
    tip: "Teach your kids that the door is never for games, and that they should stay well clear of it while it moves.",
  },
  {
    n: 8,
    title: "Watch the door until it closes",
    why: "Do not count on the door to close safely on its own.",
    tip: "Keep an eye on it until it is all the way down, so nobody and nothing gets caught underneath.",
  },
  {
    n: 9,
    title: "Keep fingers away from the door sections",
    why: "The seams where the panels meet can pinch fingers as the door moves.",
    tip: "Teach everyone to keep their hands off the sections and the moving parts. Many newer doors have pinch resistant panels, so ask us about upgrading if yours does not.",
  },
  {
    n: 10,
    title: "Use the door handle",
    why: "Handles are there to make lifting and lowering the door safer.",
    tip: "Use the handle to move the door by hand instead of grabbing the edges or the seams.",
  },
  {
    n: 11,
    title: "Reinforce the door",
    why: "A reinforced door holds up better against accidents, break ins, and storms.",
    tip: "Make sure your door is solid and properly braced. Trinity can reinforce a door so it stands up to wear and to our Florida weather.",
  },
  {
    n: 12,
    title: "Keep your garage code secure",
    why: "A loose garage code can put your home and family at risk, especially when the garage connects to the house.",
    tip: "Do not share your code unless you have to, and change it now and then to keep it secure.",
  },
  {
    n: 13,
    title: "Keep up with maintenance",
    why: "Regular maintenance keeps a door working safely and smoothly.",
    tip: (
      <>
        Schedule a yearly inspection so a technician can check the springs, cables, rollers, and sensors. A little upkeep prevents bigger problems down the road. See our{" "}
        <Link href={ROUTES.tuneUp} className="font-bold text-accent underline underline-offset-2 hover:text-accent-dark">tune up and maintenance</Link> page for what we check.
      </>
    ),
  },
];

const [featured, ...rest] = tips;

const tipLabel = "font-display text-[11px] font-extrabold uppercase tracking-[0.18em] text-accent";

function TipCard({ n, title, why, tip }: Tip) {
  return (
    <article className="flex w-full flex-col rounded-[8px] border-2 border-ink bg-white p-[28px_30px] max-xs:p-[22px_20px]">
      <div className="flex items-start gap-4">
        <span className="flex h-[50px] w-[50px] flex-none items-center justify-center rounded-[7px] bg-accent font-display text-[23px] font-black leading-none text-white">{n}</span>
        <h3 className="m-0 mt-[9px] font-display text-[18.5px] font-extrabold uppercase leading-[1.14] tracking-[-0.005em] text-ink">{title}</h3>
      </div>
      <p className="mt-[18px] text-[15.5px] leading-[1.62] text-body">{why}</p>
      <div className="mt-auto pt-[18px]">
        <div className="rounded-[7px] border-l-[5px] border-accent bg-cream p-[16px_18px]">
          <div className={tipLabel}>Tip</div>
          <p className="mt-[7px] text-[15px] font-medium leading-[1.55] text-ink">{tip}</p>
        </div>
      </div>
    </article>
  );
}

export default function SafetyTipsPage() {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}) })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* HERO (dark) */}
      <section className="relative overflow-hidden border-b-[5px] border-accent bg-[#161616] px-6 py-[88px]">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 84% 26%, rgba(184,32,42,0.28), transparent 48%)" }} />
        <div className="relative z-[2] mx-auto max-w-[1200px]">
          <Breadcrumb items={breadcrumb} />
          <div className="mt-4 flex items-center gap-3.5">
            <span className="h-1 w-[52px] bg-accent" />
            <span className="text-[13px] font-extrabold uppercase tracking-[0.22em] text-white">Safety Tips</span>
          </div>
          <h1 className="m-0 mt-[18px] max-w-[920px] font-display text-[clamp(34px,5.6vw,62px)] font-black uppercase leading-[0.98] tracking-[-0.015em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
            Garage Door <span className="inline-block bg-accent px-3 text-white">Safety Tips</span> for Homeowners
          </h1>
          <p className="mt-6 max-w-[720px] text-[clamp(17px,2.1vw,20px)] font-medium leading-[1.55] text-white/90">Garage doors are a big part of most homes. They give you convenience, security, and easy access. But like any mechanical system, a garage door can be dangerous if it is not used and serviced properly. At Trinity, we care about doors that look great and stay safe to use.</p>
          <p className="mt-4 max-w-[720px] text-[clamp(16px,2vw,18px)] font-medium leading-[1.55] text-white/90">Here are some simple tips to help you keep your garage door safe and avoid accidents that could put your family at risk.</p>
        </div>
      </section>

      <TrustStrip />

      {/* THE 13 TIPS */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1200px] px-5 py-[80px] nav:px-8">
          <Reveal>
            <div className="mx-auto max-w-[720px] text-center">
              <div className={eyebrowCls}>The Checklist</div>
              <h2 className={`${h2Cls} text-ink`}>13 Ways To Keep Your Door Safe</h2>
            </div>
          </Reveal>

          <div className="mt-[46px] grid gap-5 grid-cols-2 max-nav:grid-cols-1">
            {/* Tip 1, the sensors, gets the anchor slot across the top of the grid */}
            <Reveal className="nav:col-span-2">
              <article className="rounded-[8px] border-2 border-ink bg-ink p-[36px_38px] max-xs:p-[26px_22px]">
                <div className="grid gap-8 nav:grid-cols-[1.05fr_1fr] nav:items-center">
                  <div>
                    <div className="flex items-start gap-[18px]">
                      <span className="flex h-[60px] w-[60px] flex-none items-center justify-center rounded-[8px] bg-accent font-display text-[28px] font-black leading-none text-white">{featured.n}</span>
                      <h3 className="m-0 mt-2 font-display text-[clamp(20px,2.6vw,27px)] font-extrabold uppercase leading-[1.1] tracking-[-0.01em] text-white">{featured.title}</h3>
                    </div>
                    <p className="mt-5 text-[16px] leading-[1.62] text-[#b0b0b0]">{featured.why}</p>
                  </div>
                  <div className="rounded-[8px] border-l-[5px] border-accent bg-[#242424] p-[20px_22px]">
                    <div className={tipLabel}>Tip</div>
                    <p className="mt-2 text-[15.5px] font-medium leading-[1.58] text-white">{featured.tip}</p>
                  </div>
                </div>
              </article>
            </Reveal>

            {rest.map((t) => (
              <Reveal key={t.n} className="flex">
                <TipCard {...t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEED A HAND (CTA) */}
      <section className="bg-accent text-white">
        <Reveal>
          <div className="mx-auto max-w-[1200px] px-5 py-[74px] text-center nav:px-8">
            <h2 className="m-0 font-display text-[clamp(28px,4vw,44px)] font-black uppercase leading-none">Need a hand?</h2>
            <p className="mx-auto mt-4 max-w-[680px] text-[17.5px] font-medium leading-[1.55] text-white/90">A safe door is a well maintained door. If any of these checks turns up a problem, or you would like a yearly safety inspection, call Trinity at (813) 279-6785. Family owned, licensed and insured (GD13010 and GDI-09484), serving Tampa Bay since 2007.</p>
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
