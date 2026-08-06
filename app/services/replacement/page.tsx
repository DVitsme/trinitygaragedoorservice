import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RepairDetailLayout, type RepairDetailData } from "@/components/blocks/repair-detail-layout";

export const metadata: Metadata = {
  title: "Garage Door Replacement Tampa Bay | Trinity Garage Door Service",
  description:
    "Worn out garage door? Trinity helps Tampa Bay homeowners decide when to replace, then handles the swap. Free estimates, honest advice. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/services/replacement/" },
};

const ico = (size: number, paths: ReactNode, sw: number | string = 2) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {paths}
  </svg>
);

const replacement: RepairDetailData = {
  canonicalPath: "/services/replacement/",
  primaryCta: "repair",
  formTopic: "replacement",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/" },
    { label: "Replacement" },
  ],
  heroEyebrow: "Garage Door Replacement",
  heroImage: "door-white-2car-clean.jpg",
  heroImageAlt: "A new Trinity garage door installation",
  h1: (
    <>
      Garage Door <span className="inline-block bg-accent px-3 text-white">Replacement</span>
    </>
  ),
  heroLead:
    "Every door reaches a point where fixing it again stops making sense. We'll help you make the honest call between repair and replace, and if a new door is the right move, we handle the whole swap across Tampa Bay.",
  intro: {
    eyebrow: "The Short Version",
    title: "Keep Repairing, Or Replace?",
    paras: [
      "Every garage door reaches a point where fixing it again stops making sense. Maybe you've had somebody out three times this year. Maybe it sounds like it's coming apart, it's dented from a storm, or it just looks tired next to the rest of the house.",
      "This page is about that decision. We'll help you make the honest call, and if a new door is the right move, we handle the whole swap, old door out and new door in.",
    ],
    image: "door-brown-raised-panel.jpg",
    imageAlt: "A new wood look garage door by Trinity",
    badge: "Same Day Service",
  },
  signs: {
    eyebrow: "Repair Or Replace?",
    title: "How To Tell It's Time",
    lead: "A lot of problems are a quick fix. Replacing the whole door is a bigger decision. These are the signs it's worth weighing.",
    cards: [
      { icon: ico(24, (<><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M4 9h16" /></>)), title: "Repairs Keep Coming", body: "One fix is normal. But when you're calling every few months and the bills stack up, you're renting time on a door that's on its way out." },
      { icon: ico(24, (<><path d="M3 12h3l2-6 4 12 2-6h3" /><path d="M18 5l3 3-3 3" /></>)), title: "It's Old", body: "Doors last a long time with care, but parts fatigue and older doors miss modern safety features. A couple of decades up there is fair reason to think ahead." },
      { icon: ico(24, (<><path d="M3 8c4-2 6 2 9 0M3 14c4-2 6 2 9 0" /><path d="M15 11h6" /></>)), title: "It's Damaged", body: "Big dents, cracked or warped panels, rust, rot on a wood door, storm damage. Some is cosmetic, some actually weakens the door. We'll tell you which." },
      { icon: ico(24, (<><path d="M12 3v12M7 10l5 5 5-5" /><path d="M5 21h14" /></>)), title: "It's Loud", body: "Grinding, banging, or rattling can mean worn rollers or loose hardware. But a door that's still loud after a service call is often just old and tired." },
      { icon: ico(24, <path d="M4 7l16 4M4 7v10l16 4V11" />), title: "The Garage Bakes", body: "A thin, uninsulated door lets Florida heat pour straight in. If the garage bakes or the energy bill keeps creeping up, an insulated door makes a real difference." },
    ],
    note: {
      icon: ico(22, (<><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>), 2.2),
      title: "Dated & Not Storm Ready",
      body: "If the door drags down the front of the house, a new one is the quickest way to freshen the exterior. And older doors often aren't wind rated, a weak point when the wind picks up in Tampa Bay.",
    },
  },
  index: {
    eyebrow: "What You Gain",
    title: "What A New Door Buys You",
    lead: "When replacing is the right move, here's what a new door actually buys you.",
    rows: [
      { label: "01", title: "Quiet", desc: "New rollers, fresh hardware, and a modern opener give you a door you barely hear from inside the house.", icon: ico(26, (<><path d="M11 5 6 9H2v6h4l5 4z" /><path d="M22 9l-6 6M16 9l6 6" /></>)) },
      { label: "02", title: "Lower Heat & Energy", desc: "An insulated door keeps the garage cooler and eases the load on your AC through the Florida summer.", icon: ico(26, (<><path d="M12 2a7 7 0 0 0-4 12.7V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-3.3A7 7 0 0 0 12 2z" /><path d="M12 6v6" /></>)) },
      { label: "03", title: "Better Safety", desc: "Newer doors have photo eye sensors and auto reverse, so the door stops and backs off if something's underneath it.", icon: ico(26, (<><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>)) },
      { label: "04", title: "Built For The Weather", desc: "You can move up to a wind rated door made for our storm season, since the garage is the biggest opening on most houses.", icon: ico(26, <path d="M3 12h13a3 3 0 1 0-3-3M3 16h17a3 3 0 1 1-3 3" />) },
      { label: "05", title: "A Fresh Front", desc: "A clean new door changes how the whole house looks from the curb. It's one of the quickest ways to freshen the exterior.", icon: ico(26, <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-7h6v7" />) },
    ],
    calloutIcon: ico(22, (<><path d="M12 2v6M12 16v6M2 12h6M16 12h6" /><circle cx="12" cy="12" r="3" /></>), 2.2),
    callout: (
      <>
        <strong className="text-white">We'll tell you straight.</strong> A lot of doors don't need replacing. If yours has good bones and a repair will get you a few more solid years, we'll say so. We're not going to push you into a new door you don't need. That honesty is where most of our repeat customers and referrals come from.
      </>
    ),
  },
  redBand: {
    badge: "Free Estimate",
    title: "Start With A Free Estimate",
    lead: "The easiest way to settle the repair or replace question is to let us look at it. The estimate is free, the opinion is honest, and there's no pressure in either direction.",
  },
  whatWeDo: {
    eyebrow: "How We Handle The Swap",
    title: "Old Door Out, New Door In",
    image: "svc-install-barn-door.jpg",
    imageAlt: "A freshly installed Trinity garage door",
    badge: "Hauled Away",
    items: [
      { strong: "We measure.", rest: "We get exact measurements so your new door fits right the first time." },
      { strong: "We order your door.", rest: "You pick the material, style, and brand, and we order it in for you." },
      { strong: "Old door out, hauled away.", rest: "We take the old door and hardware down and haul the mess off. You don't touch it." },
      { strong: "We install the new one.", rest: "The same careful install we lay out on our garage door installation page." },
      { strong: "We test and clean up.", rest: "We run the door, make sure it works right, and leave the garage tidy before we go." },
    ],
    trailing: "Most replacements are done in a day once your door is in. Custom or double doors can run a little longer, and we tell you that upfront.",
  },
  whyTrinity: {
    eyebrow: "Why Folks In Tampa Bay Call Trinity",
    title: "A Family Shop, Not A Call Center",
    lead: "We've been opening doors around here since 2007, across Hillsborough, Pinellas, Pasco, Hernando and Polk.",
    cards: [
      { icon: ico(26, <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 7-5s7 2 7 5M17 11l2 2 4-4" />), title: "Honest Diagnosis", body: "A lot of doors don't need replacing. If a repair gets you a few more solid years, we'll say so." },
      { icon: ico(26, <path d="M13 2L4 14h6l-1 8 9-12h-6z" />), title: "Fast & Same Day", body: "Same day help, and the phones are answered till 9pm when your door quits at a bad hour." },
      { icon: ico(26, (<><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>)), title: "Licensed & Insured", body: "Bonded and insured under FL GD13010 and GDI-09484." },
      { icon: ico(26, (<><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></>)), title: "Fair, Upfront Pricing", body: "A price you hear up front, with free estimates every time." },
    ],
  },
  faqHeading: { eyebrow: "Replacement Questions", title: "Frequently Asked" },
  faqs: [
    { q: "How do I know whether to repair or replace?", a: "Have us out for a free look. The rough rule: if the door has solid structure and one part failed, we repair it. If it's old, damaged, or you keep repairing it, replacing is usually the smarter money. We'll give you the real answer for your door." },
    { q: "Can you reuse my existing opener?", a: "Often, yes, if it's in good shape. If it's worn out or you want smart features, we'll talk about a new one. Our opener repair and replacement service covers that." },
    { q: "How long does a replacement take?", a: "Most are done in a day once your door is in. Custom or double doors can run a little longer, and we tell you that upfront." },
    { q: "Do I need a permit to replace my door?", a: "In most of Tampa Bay, yes. The permit confirms the new door meets the wind rating for your area. We pull it and handle the inspection." },
    { q: "Will a new door really lower my energy bill?", a: "If you're going from a thin uninsulated door to an insulated one, you'll feel it in the garage, especially in summer. We won't promise you a dollar figure, but the comfort gain is real and the AC works less to fight it." },
  ],
  closing: {
    title: "Thinking About A New Door?",
    lead: "Call Trinity at (813) 279-6785 for a free estimate and an honest opinion on whether to repair or replace. Family owned, licensed and insured under FL GD13010 and GDI-09484, serving Tampa Bay since 2007.",
  },
};

export default function ReplacementPage() {
  return <RepairDetailLayout d={replacement} />;
}
