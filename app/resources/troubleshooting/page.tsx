import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Phone, Unplug, Wrench, Glasses, TriangleAlert, Check } from "lucide-react";
import { SITE, ROUTES } from "@/lib/site";
import { Breadcrumb } from "@/components/blocks/primitives";
import { Reveal } from "@/components/blocks/reveal";

export const metadata: Metadata = {
  title: "DIY Garage Door Troubleshooting Guide | Trinity Garage Door",
  description:
    "A homeowner's guide to common garage door problems: what you can safely fix yourself and what needs a pro. Serving Tampa Bay. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/resources/troubleshooting/" },
};

const SITE_URL = "https://trinitygaragedoorservice.com";
const breadcrumb = [{ label: "Home", href: "/" }, { label: "DIY Troubleshooting" }];

const eyebrowCls = "text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent";
const h2Cls = "m-0 mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.03]";
const eyebrowOnDark = eyebrowCls.replace("text-accent", "text-white");

/* "Safe to try" green. Written out in full everywhere below, never interpolated,
   so the Tailwind v4 scanner can see the arbitrary-value class. */

/* ---------------------------------------------------------------- data */

type SafetyRule = { icon: ReactNode; label: string; body?: string; danger?: boolean };

const SAFETY: SafetyRule[] = [
  {
    icon: <Unplug className="h-[21px] w-[21px]" strokeWidth={2.1} />,
    label: "Cut the power.",
    body: "Unplug the opener so it cannot start while you work.",
  },
  {
    icon: <Wrench className="h-[21px] w-[21px]" strokeWidth={2.1} />,
    label: "Use the right tools.",
    body: "Keep a screwdriver, a wrench, and a good garage door lubricant handy.",
  },
  {
    icon: <Glasses className="h-[21px] w-[21px]" strokeWidth={2.1} />,
    label: "Wear eye protection and gloves.",
  },
  {
    icon: <TriangleAlert className="h-[21px] w-[21px]" strokeWidth={2.1} />,
    label: "Leave the springs and cables alone.",
    body: "They are under high tension and can hurt you badly. Do not touch them unless you are trained.",
    danger: true,
  },
];

type DiyFix = { title: string; notice: string; steps: string[] };

const DIY_FIXES: DiyFix[] = [
  {
    title: "Noisy door",
    notice: "grinding, squeaking, or rattling when the door runs.",
    steps: [
      "Tighten any loose bolts and screws on the door and the tracks.",
      "Coat the hinges, rollers, and springs with a good garage door lubricant for smoother, quieter operation.",
      "Skip the plastic parts, since lube can damage them, and wipe the tracks clean rather than greasing them.",
    ],
  },
  {
    title: "Door won't close all the way",
    notice: "the door starts down, then reverses before it reaches the floor.",
    steps: [
      "Wipe the safety sensors near the bottom of the tracks with a soft cloth.",
      "Make sure both sensors line up and nothing is blocking the beam.",
      "Clear any dirt or debris in the door's path.",
    ],
  },
  {
    title: "Remote not working",
    notice: "the door ignores the remote.",
    steps: [
      "Put fresh batteries in the remote.",
      "Reprogram it using the manufacturer's steps.",
      "Get within range and make sure nothing is blocking the signal.",
    ],
  },
  {
    title: "Door opens or closes unevenly",
    notice: "one side rides higher or lower than the other.",
    steps: [
      "Check for debris in the tracks.",
      "Make sure the tracks are snug and aligned.",
      "Use a level to confirm.",
    ],
  },
  {
    title: "Door runs slowly",
    notice: "the door moves slower than it used to.",
    steps: [
      "Lubricate the rollers and hinges.",
      "Clear any debris from the tracks.",
      "Check the opener's speed setting if it has one.",
    ],
  },
];

type ProJob = {
  title: string;
  notice: string;
  leaveAlone?: ReactNode;
  tryFirst?: ReactNode;
  ifThat?: ReactNode;
  maybeDiy?: ReactNode;
};

const proLink = "font-bold text-white underline decoration-accent decoration-2 underline-offset-[3px] hover:text-accent hover:decoration-white";

const PRO_JOBS: ProJob[] = [
  {
    title: "Broken springs",
    notice: "a loud bang, and the door is suddenly heavy and won't open.",
    leaveAlone: (
      <>
        springs are under huge tension and are dangerous to handle. Call us for a safe replacement. Here&apos;s our{" "}
        <Link href={ROUTES.spring} className={proLink}>spring repair</Link> page.
      </>
    ),
  },
  {
    title: "Snapped or frayed cables",
    notice: "the door hangs crooked or won't lift evenly.",
    leaveAlone: (
      <>
        the cables connect to the high tension springs. Don&apos;t handle a broken one. See our{" "}
        <Link href={ROUTES.cablesRollers} className={proLink}>cable and roller repair</Link> page.
      </>
    ),
  },
  {
    title: "Opener runs but the door won't move",
    notice: "the motor hums or runs, but nothing happens.",
    tryFirst: <>check that the door is still connected to the trolley, and make sure the opener has power.</>,
    ifThat: (
      <>
        it&apos;s likely the opener, the sensors, or the wiring. See our{" "}
        <Link href={ROUTES.opener} className={proLink}>opener repair</Link> page.
      </>
    ),
  },
  {
    title: "Door off the track",
    notice: "the door is crooked or has jumped out of the tracks.",
    leaveAlone: (
      <>
        don&apos;t force it back on. A door off its track can fall. Call us to realign it safely. Here&apos;s our{" "}
        <Link href={ROUTES.offTrack} className={proLink}>off track repair</Link> page.
      </>
    ),
  },
  {
    title: "Damaged panels or dents",
    notice: "visible damage that affects how the door looks or works.",
    maybeDiy: <>a small dent can sometimes be tapped out with a block of wood and a mallet. For anything more, a panel may need replacing.</>,
  },
];

/* ------------------------------------------------------------ elements */

const CHIP_TONES = {
  outline: "border-ink bg-transparent text-ink",
  green: "border-[#15703f] bg-[#15703f] text-white",
  ghost: "border-white/30 bg-transparent text-white/75",
  accent: "border-accent bg-accent text-white",
  maybe: "border-[#3f9c6d] bg-transparent text-[#7cd6a4]",
} as const;

function Chip({ tone, children }: { tone: keyof typeof CHIP_TONES; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-[5px] border-2 px-[9px] py-[5px] font-display text-[10px] font-extrabold uppercase leading-none tracking-[0.14em] ${CHIP_TONES[tone]}`}>
      {children}
    </span>
  );
}

function Num({ n, tone }: { n: number; tone: "ink" | "accent" }) {
  return (
    <span className={`flex h-[36px] w-[36px] flex-none items-center justify-center rounded-[6px] font-display text-[13px] font-extrabold text-white ${tone === "ink" ? "bg-ink" : "bg-accent"}`}>
      {String(n).padStart(2, "0")}
    </span>
  );
}

/** One note on a "call a pro" card: chip label + prose. Keeps the two odd blocks (try first / maybe DIY) on the same rails. */
function Note({ tone, label, children }: { tone: keyof typeof CHIP_TONES; label: string; children: ReactNode }) {
  return (
    <div>
      <Chip tone={tone}>{label}</Chip>
      <p className="m-0 mt-[11px] text-[15px] leading-[1.6] text-[#c6c6c6]">{children}</p>
    </div>
  );
}

const cardShell = "grid overflow-hidden rounded-[8px] nav:grid-cols-[minmax(0,350px)_1fr]";
const padCls = "p-[26px] max-xs:p-[20px]";

function DiyCard({ n, fix }: { n: number; fix: DiyFix }) {
  return (
    <article className={`${cardShell} border-2 border-ink bg-white`}>
      <div className={`${padCls} border-b-2 border-ink bg-cream nav:border-b-0 nav:border-r-2`}>
        <div className="flex items-center gap-3">
          <Num n={n} tone="ink" />
          <h3 className="m-0 font-display text-[clamp(17px,2.1vw,21px)] font-extrabold uppercase leading-[1.1] text-ink">{fix.title}</h3>
        </div>
        <div className="mt-[20px]">
          <Chip tone="outline">What you notice</Chip>
        </div>
        <p className="m-0 mt-[10px] text-[15px] leading-[1.6] text-body">{fix.notice}</p>
      </div>
      <div className={padCls}>
        <Chip tone="green">Try this</Chip>
        <ul className="m-0 mt-[15px] list-none space-y-[12px] p-0">
          {fix.steps.map((s) => (
            <li key={s} className="flex gap-[11px]">
              <span className="mt-[3px] flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full bg-[#15703f]">
                <Check className="h-[11px] w-[11px] text-white" strokeWidth={3.4} />
              </span>
              <span className="text-[15px] leading-[1.6] text-body">{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function ProCard({ n, job }: { n: number; job: ProJob }) {
  return (
    <article className={`${cardShell} border-2 border-l-[6px] border-[#333] border-l-accent bg-[#1b1b1b]`}>
      <div className={`${padCls} border-b-2 border-[#333] bg-[#232323] nav:border-b-0 nav:border-r-2`}>
        <div className="flex items-center gap-3">
          <Num n={n} tone="accent" />
          <h3 className="m-0 font-display text-[clamp(17px,2.1vw,21px)] font-extrabold uppercase leading-[1.1] text-white">{job.title}</h3>
        </div>
        <div className="mt-[20px]">
          <Chip tone="ghost">What you notice</Chip>
        </div>
        <p className="m-0 mt-[10px] text-[15px] leading-[1.6] text-[#c6c6c6]">{job.notice}</p>
      </div>
      <div className={`${padCls} flex flex-col gap-[20px]`}>
        {job.tryFirst && <Note tone="ghost" label="Try first">{job.tryFirst}</Note>}
        {job.leaveAlone && <Note tone="accent" label="Leave it alone">{job.leaveAlone}</Note>}
        {job.ifThat && <Note tone="accent" label="If that doesn't do it">{job.ifThat}</Note>}
        {job.maybeDiy && <Note tone="maybe" label="Maybe DIY">{job.maybeDiy}</Note>}
      </div>
    </article>
  );
}

const jumpCls = "inline-flex items-center gap-2.5 rounded-[7px] border-2 px-[18px] py-[11px] text-[12.5px] font-extrabold uppercase tracking-[0.1em] no-underline transition-colors";

/* ---------------------------------------------------------------- page */

export default function TroubleshootingPage() {
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
            <span className="text-[13px] font-extrabold uppercase tracking-[0.22em] text-white">DIY Troubleshooting</span>
          </div>
          <h1 className="m-0 mt-[18px] max-w-[920px] font-display text-[clamp(34px,5.6vw,62px)] font-black uppercase leading-[0.98] tracking-[-0.015em] text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
            DIY Garage Door <span className="inline-block bg-accent px-3 text-white">Troubleshooting</span> Guide
          </h1>
          <p className="mt-6 max-w-[740px] text-[clamp(17px,2.1vw,20px)] font-medium leading-[1.55] text-white/90">Your garage door plays a big role in your home&apos;s security and convenience. Some problems you can sort out yourself with a little know how. Others are best left to a professional. This guide helps you tell the difference, with simple fixes for the small stuff and honest advice on when to call us.</p>
          <div className="mt-[30px] flex flex-wrap gap-3">
            <a href="#fix-it-yourself" className={`${jumpCls} border-white/30 bg-white/[0.06] text-white hover:border-white hover:bg-white hover:text-ink`}>
              <span className="h-[9px] w-[9px] flex-none rounded-full bg-[#35c07a]" /> Fix it yourself
            </a>
            <a href="#call-a-pro" className={`${jumpCls} border-white/30 bg-white/[0.06] text-white hover:border-accent hover:bg-accent hover:text-white`}>
              <span className="h-[9px] w-[9px] flex-none rounded-full bg-accent" /> Call a pro
            </a>
          </div>
        </div>
      </section>

      {/* SAFETY */}
      <section className="border-b-2 border-ink bg-cream-2">
        <div className="mx-auto max-w-[1200px] px-5 py-[64px] nav:px-8">
          <Reveal>
            <div className="max-w-[760px]">
              <div className={`flex items-center gap-2.5 ${eyebrowCls}`}>
                <span className="h-[3px] w-[30px] bg-accent" />
                Before You Start
              </div>
              <h2 className={`${h2Cls} text-ink`}>A quick word on safety</h2>
              <p className="mt-4 text-[16.5px] leading-[1.6] text-body">A garage door is a complex system: springs, cables, rollers, tracks, and an opener, all working together under tension. Before you try any fix:</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-[30px] grid grid-cols-1 gap-[18px] xs:grid-cols-2 nav:grid-cols-4">
              {SAFETY.map((r) => (
                <div
                  key={r.label}
                  className={`flex h-full flex-col gap-[13px] rounded-[8px] border-2 border-ink p-[22px] ${r.danger ? "bg-ink" : "bg-white"}`}
                >
                  <span className={`flex h-[42px] w-[42px] items-center justify-center rounded-[7px] border-2 ${r.danger ? "border-accent bg-accent text-white" : "border-ink bg-cream text-accent"}`}>
                    {r.icon}
                  </span>
                  <p className={`m-0 font-display text-[14.5px] font-extrabold uppercase leading-[1.2] ${r.danger ? "text-white" : "text-ink"}`}>{r.label}</p>
                  {r.body && <p className={`m-0 text-[14.5px] leading-[1.55] ${r.danger ? "text-white/80" : "text-body"}`}>{r.body}</p>}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* DIY */}
      <section id="fix-it-yourself" className="scroll-mt-[90px] bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-[72px] nav:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div className="max-w-[720px]">
                <div className={`flex items-center gap-2.5 ${eyebrowCls}`}>
                  <span className="h-[3px] w-[30px] bg-accent" />
                  Homeowner Fixes
                </div>
                <h2 className={`${h2Cls} text-ink`}>Small problems you can usually fix yourself</h2>
              </div>
              <span className="inline-flex items-center gap-2.5 rounded-[7px] border-2 border-[#15703f] bg-white px-[15px] py-[10px] font-display text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#15703f]">
                <span className="h-[9px] w-[9px] flex-none rounded-full bg-[#15703f]" /> Power off first
              </span>
            </div>
          </Reveal>
          <div className="mt-[30px] flex flex-col gap-[22px]">
            {DIY_FIXES.map((fix, i) => (
              <Reveal key={fix.title}>
                <DiyCard n={i + 1} fix={fix} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CALL A PRO */}
      <section id="call-a-pro" className="scroll-mt-[90px] border-t-[5px] border-accent bg-ink">
        <div className="mx-auto max-w-[1200px] px-5 py-[72px] nav:px-8">
          <Reveal>
            <div className="max-w-[760px]">
              <div className={`flex items-center gap-2.5 ${eyebrowOnDark}`}>
                <span className="h-[3px] w-[30px] bg-accent" />
                Leave It To Us
              </div>
              <h2 className={`${h2Cls} text-white`}>Bigger problems that need a pro</h2>
              <p className="mt-4 text-[16.5px] leading-[1.6] text-[#b6b6b6]">Some repairs carry real risk and call for a trained technician. If you run into any of these, leave it to us.</p>
            </div>
          </Reveal>
          <div className="mt-[30px] flex flex-col gap-[22px]">
            {PRO_JOBS.map((job, i) => (
              <Reveal key={job.title}>
                <ProCard n={i + 1} job={job} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHEN TO CALL TRINITY */}
      <section className="bg-accent text-white">
        <Reveal>
          <div className="mx-auto max-w-[1200px] px-5 py-[74px] text-center nav:px-8">
            <h2 className="m-0 font-display text-[clamp(28px,4vw,44px)] font-black uppercase leading-none">When to call Trinity</h2>
            <p className="mx-auto mt-4 max-w-[720px] text-[17.5px] font-medium leading-[1.55] text-white/90">We&apos;re all for fixing the small stuff yourself. But your safety and the life of your door come first. If you hit one of the bigger problems above, or you just are not sure, give us a call at (813) 279-6785. Most repairs are same day, and the phones are answered till 9pm. Family owned, licensed and insured (GD13010 and GDI-09484), serving Tampa Bay since 2007.</p>
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
