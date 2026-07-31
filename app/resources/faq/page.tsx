import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE, ROUTES } from "@/lib/site";
import { Breadcrumb } from "@/components/blocks/primitives";
import { FaqAccordion } from "@/components/blocks/faq";
import { FaqJsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/blocks/reveal";

export const metadata: Metadata = {
  title: "Garage Door FAQ | Trinity Garage Door Service Tampa Bay",
  description:
    "Answers to common garage door questions about repairs, springs, openers, new doors, pricing, and our Tampa Bay service. Family owned. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/resources/faq/" },
};

const SITE_URL = "https://trinitygaragedoorservice.com";
const breadcrumb = [{ label: "Home", href: "/" }, { label: "FAQ" }];

const eyebrowCls = "text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent";
const h2Cls = "m-0 mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03]";

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} className="font-semibold text-accent underline">{children}</Link>
);

/**
 * `a` renders in the accordion (may contain links); `plain` is the same answer as a flat string
 * for FAQPage schema, which requires text. Keep the two in sync when editing.
 */
type Q = { q: string; a: ReactNode; plain: string };
type Group = { title: string; items: Q[] };

const groups: Group[] = [
  {
    title: "About Trinity",
    items: [
      {
        q: "Are you really family owned?",
        a: <>Yes. Trinity is family owned and run right here in Tampa Bay since 2007. When you call, you reach a real person, not a call center.</>,
        plain: "Yes. Trinity is family owned and run right here in Tampa Bay since 2007. When you call, you reach a real person, not a call center.",
      },
      {
        q: "What areas do you serve?",
        a: <>We cover Tampa Bay across Hillsborough, Pinellas, Pasco, Hernando and Polk counties, including Lutz, Land O Lakes, Wesley Chapel, Palm Harbor, Oldsmar, and Tampa, plus the towns in between. See our <A href={ROUTES.serviceAreas}>service areas</A> page.</>,
        plain: "We cover Tampa Bay across Hillsborough, Pinellas, Pasco, Hernando and Polk counties, including Lutz, Land O Lakes, Wesley Chapel, Palm Harbor, Oldsmar, and Tampa, plus the towns in between.",
      },
      {
        q: "Are you licensed and insured?",
        a: <>Yes, fully licensed, bonded, and insured in Florida under GD13010 and GDI-09484.</>,
        plain: "Yes, fully licensed, bonded, and insured in Florida under GD13010 and GDI-09484.",
      },
      {
        q: "Do you charge for an estimate?",
        a: <>No. Estimates are free, with no obligation to book.</>,
        plain: "No. Estimates are free, with no obligation to book.",
      },
      {
        q: "How soon can you come out?",
        a: <>Often the same day. Call early and there&apos;s a good chance we can have a technician at your house within a couple of hours. For emergencies we answer till 9pm.</>,
        plain: "Often the same day. Call early and there's a good chance we can have a technician at your house within a couple of hours. For emergencies we answer till 9pm.",
      },
      {
        q: "Do you offer emergency service?",
        a: <>We do. A broken spring or a door stuck open does not wait for business hours, so we keep the phones answered till 9pm. Here&apos;s our <A href={ROUTES.emergency}>emergency repair</A> page.</>,
        plain: "We do. A broken spring or a door stuck open does not wait for business hours, so we keep the phones answered till 9pm.",
      },
    ],
  },
  {
    title: "Repairs",
    items: [
      {
        q: "A spring broke. Can I still use the door?",
        a: <>Please don&apos;t. With a spring gone, the door is far heavier than the opener was built to lift, and running it can burn out the motor or bring the door down hard. Leave it closed and call us. More on our <A href={ROUTES.spring}>spring repair</A> page.</>,
        plain: "Please don't. With a spring gone, the door is far heavier than the opener was built to lift, and running it can burn out the motor or bring the door down hard. Leave it closed and call us.",
      },
      {
        q: "Do I have to replace both springs if only one broke?",
        a: <>On a two spring door, we recommend it. Both springs are the same age and the same amount of worn, so doing both keeps the door balanced and saves you a second service call soon. On a single spring door, we just replace the one.</>,
        plain: "On a two spring door, we recommend it. Both springs are the same age and the same amount of worn, so doing both keeps the door balanced and saves you a second service call soon. On a single spring door, we just replace the one.",
      },
      {
        q: "How long do springs and openers last?",
        a: <>Springs usually run about seven to ten years and openers about ten to fifteen, depending on how often you use the door. Our heat, humidity, and salt air can shorten both, so don&apos;t be surprised if yours wear a little sooner.</>,
        plain: "Springs usually run about seven to ten years and openers about ten to fifteen, depending on how often you use the door. Our heat, humidity, and salt air can shorten both, so don't be surprised if yours wear a little sooner.",
      },
      {
        q: "My door came off the track. What should I do?",
        a: <>Stop using it. Don&apos;t hit the opener and don&apos;t try to force it back, since the door can fall or do more damage. Leave it be and call us. Here&apos;s our <A href={ROUTES.offTrack}>off track repair</A> page.</>,
        plain: "Stop using it. Don't hit the opener and don't try to force it back, since the door can fall or do more damage. Leave it be and call us.",
      },
      {
        q: "Why is my garage door so loud?",
        a: <>Usually worn rollers, dry hinges, and loose hardware. Switching to nylon or sealed bearing rollers and a good tune up quiets most doors right down. See <A href={ROUTES.cablesRollers}>cable and roller repair</A> and <A href={ROUTES.tuneUp}>tune up and maintenance</A>.</>,
        plain: "Usually worn rollers, dry hinges, and loose hardware. Switching to nylon or sealed bearing rollers and a good tune up quiets most doors right down.",
      },
      {
        q: "Can you fix a brand you didn't install?",
        a: <>Yes. We service and repair every major door and opener brand, even ones we don&apos;t sell new.</>,
        plain: "Yes. We service and repair every major door and opener brand, even ones we don't sell new.",
      },
    ],
  },
  {
    title: "New doors and replacement",
    items: [
      {
        q: "Should I repair my door or replace it?",
        a: <>It depends on the door&apos;s age and what&apos;s wrong. We&apos;ll give you an honest read and never push a new door when a repair will do. Our <A href={ROUTES.replacement}>replacement</A> page walks through how to make the call.</>,
        plain: "It depends on the door's age and what's wrong. We'll give you an honest read and never push a new door when a repair will do.",
      },
      {
        q: "How long does a new door installation take?",
        a: <>Most single doors go in within a day. Bigger, custom, or double doors can take longer. We&apos;ll give you the timeline when we quote it.</>,
        plain: "Most single doors go in within a day. Bigger, custom, or double doors can take longer. We'll give you the timeline when we quote it.",
      },
      {
        q: "Do I need a permit for a new door?",
        a: <>In most of Tampa Bay, yes, and the permit confirms the door meets the wind rating for your area. We pull it and handle the inspection.</>,
        plain: "In most of Tampa Bay, yes, and the permit confirms the door meets the wind rating for your area. We pull it and handle the inspection.",
      },
      {
        q: "Does my new door have to be wind rated?",
        a: <>Much of Tampa Bay is a wind borne debris zone, so your opening usually needs a door rated for the pressure at your address. We&apos;ll tell you what your home requires before you buy. See our <A href={ROUTES.doorTypes}>door types and styles</A> page.</>,
        plain: "Much of Tampa Bay is a wind borne debris zone, so your opening usually needs a door rated for the pressure at your address. We'll tell you what your home requires before you buy.",
      },
      {
        q: "Does a new door come with an opener?",
        a: <>The opener is separate from the door. If yours still works well, we can reconnect it. If it&apos;s old or you want smart features, we can install a new one.</>,
        plain: "The opener is separate from the door. If yours still works well, we can reconnect it. If it's old or you want smart features, we can install a new one.",
      },
    ],
  },
  {
    title: "Doors and brands",
    items: [
      {
        q: "Which brands do you carry?",
        a: <>We install Clopay, C.H.I., Hörmann, and Amarr doors and LiftMaster openers, and we service and repair every major brand. See our <A href={ROUTES.brands}>brands</A> page.</>,
        plain: "We install Clopay, C.H.I., Hörmann, and Amarr doors and LiftMaster openers, and we service and repair every major brand.",
      },
      {
        q: "What door material is best for Florida?",
        a: <>Insulated steel is the all around favorite. Right on the coast, aluminum and composite hold up better against salt and humidity. Wood is beautiful but needs the most upkeep in our climate.</>,
        plain: "Insulated steel is the all around favorite. Right on the coast, aluminum and composite hold up better against salt and humidity. Wood is beautiful but needs the most upkeep in our climate.",
      },
    ],
  },
  {
    title: "Pricing and payment",
    items: [
      {
        q: "Why don't you list prices online?",
        a: <>Every door and every repair is a little different, so a real price comes from looking at the job. Estimates are free, and you get a clear price before any work starts, with no surprises at the end.</>,
        plain: "Every door and every repair is a little different, so a real price comes from looking at the job. Estimates are free, and you get a clear price before any work starts, with no surprises at the end.",
      },
      {
        q: "What payment methods do you take?",
        a: <>Cash, check, bank transfer, debit, credit, Google Pay, and Zelle.</>,
        plain: "Cash, check, bank transfer, debit, credit, Google Pay, and Zelle.",
      },
    ],
  },
];

export default function FaqPage() {
  const allFaqs = groups.flatMap((g) => g.items.map((i) => ({ q: i.q, a: i.plain })));

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
      <FaqJsonLd faqs={allFaqs} />

      {/* HERO */}
      <section className="relative overflow-hidden border-b-[5px] border-accent bg-[#161616] px-6 py-[88px]">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 84% 26%, rgba(184,32,42,0.28), transparent 48%)" }} />
        <div className="relative z-[2] mx-auto max-w-[1200px]">
          <Breadcrumb items={breadcrumb} />
          <div className="mt-4 flex items-center gap-3.5">
            <span className="h-1 w-[52px] bg-accent" />
            <span className="text-[13px] font-extrabold uppercase tracking-[0.22em] text-white">Common Questions</span>
          </div>
          <h1 className="m-0 mt-[18px] max-w-[920px] font-display text-[clamp(34px,5.6vw,62px)] font-black uppercase leading-[0.98] tracking-[-0.015em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
            Garage Door <span className="inline-block bg-accent px-3 text-white">FAQ</span>
          </h1>
          <p className="mt-6 max-w-[700px] text-[clamp(17px,2.1vw,20px)] font-medium leading-[1.55] text-white/90">
            A quick rundown of the questions we hear most. Don&apos;t see yours? Call us at {SITE.phoneDisplay} and we&apos;ll answer it straight.
          </p>
        </div>
      </section>

      {/* JUMP LINKS */}
      <section className="border-b-2 border-ink bg-ink">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-2.5 px-5 py-[22px] nav:px-8">
          {groups.map((g) => (
            <a key={g.title} href={`#${slug(g.title)}`} className="rounded-full border border-white/20 bg-white/[0.08] px-[15px] py-2 text-[13px] font-semibold text-white no-underline transition-colors hover:bg-accent hover:border-accent">
              {g.title}
            </a>
          ))}
        </div>
      </section>

      {/* GROUPS */}
      {groups.map((g, gi) => (
        <section key={g.title} id={slug(g.title)} className={`scroll-mt-24 ${gi % 2 === 0 ? "bg-white" : "bg-cream border-t-2 border-ink"}`}>
          <div className="mx-auto max-w-[880px] px-5 py-[64px] nav:px-8">
            <Reveal>
              <div className="text-center">
                <div className={eyebrowCls}>{`0${gi + 1}`}</div>
                <h2 className={`${h2Cls} text-ink`}>{g.title}</h2>
              </div>
            </Reveal>
            <Reveal>
              <div className="mt-8">
                <FaqAccordion items={g.items.map((i) => ({ q: i.q, a: i.a }))} />
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      {/* CLOSING CTA */}
      <section className="bg-accent text-white">
        <Reveal>
          <div className="mx-auto max-w-[1200px] px-5 py-[74px] text-center nav:px-8">
            <h2 className="m-0 font-display text-[clamp(28px,4vw,44px)] font-black uppercase leading-none">Still Have A Question?</h2>
            <p className="mx-auto mt-4 max-w-[660px] text-[17.5px] font-medium leading-[1.55] text-white/90">
              Call Trinity at {SITE.phoneDisplay} or request a free estimate, and we&apos;ll get you a straight answer. Family owned, licensed and insured, serving Tampa Bay since {SITE.foundedYear}.
            </p>
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

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
