import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RepairDetailLayout, type RepairDetailData } from "@/components/blocks/repair-detail-layout";

export const metadata: Metadata = {
  title: "Garage Door Spring Repair & Replacement | Trinity Garage Door Service",
  description:
    "Broken garage door spring in Tampa Bay? Trinity replaces torsion and extension springs fast. Family owned and licensed, free estimates. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/services/repair/spring/" },
};

const ico = (size: number, paths: ReactNode, sw: number | string = 2) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {paths}
  </svg>
);

const spring: RepairDetailData = {
  canonicalPath: "/services/repair/spring/",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/" },
    { label: "Repair", href: "/services/repair/" },
    { label: "Spring Repair" },
  ],
  heroEyebrow: "Spring Repair & Replacement",
  heroImage: "svc-spring-torsion-shaft.jpg",
  heroImageAlt: "Garage door torsion spring and hardware",
  h1: (
    <>
      Garage Door Spring <span className="inline-block bg-accent px-3 text-white">Repair</span>
    </>
  ),
  heroLead:
    "The spring does the heavy lifting on your door, and we mean that literally. When it goes, the whole door usually quits with it. We replace garage door springs all over Tampa Bay, often the same day you call.",
  intro: {
    eyebrow: "The Short Version",
    title: "It Carries The Weight Of The Whole Door",
    paras: [
      "The spring carries the weight of a door that can run a few hundred pounds, so when a spring goes, the whole door usually quits with it. You might hear a loud bang from the garage, find the door stuck shut, or watch it drop faster than it should.",
      "That's a job for a tech, not a Saturday project. Running the opener against a broken spring can burn out the motor and bend the door panels, so if you spot the signs, stop using the door and give us a call.",
    ],
    image: "svc-spring-winding-bar.jpg",
    imageAlt: "Trinity technician replacing a garage door spring",
    badge: "Same Day Service",
  },
  signs: {
    eyebrow: "Signs Your Spring Is Going",
    title: "Or Already Gone",
    lead: "Springs usually drop a hint or two before they quit for good. Keep an eye out for these.",
    cards: [
      { icon: ico(24, (<><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M4 9h16" /></>)), title: "Won't Open", body: "The opener runs and strains, but the door barely lifts or won't move at all. A broken spring is the usual reason." },
      { icon: ico(24, (<><path d="M3 12h3l2-6 4 12 2-6h3" /><path d="M18 5l3 3-3 3" /></>)), title: "A Loud Bang", body: "People say it sounded like a gunshot or firecracker. That's often a torsion spring snapping, even when nothing looked wrong." },
      { icon: ico(24, (<><path d="M3 8c4-2 6 2 9 0M3 14c4-2 6 2 9 0" /><path d="M15 11h6" /></>)), title: "A Gap In The Coil", body: "Look at the spring above the door. If you see a two inch gap where the coil separated, it's broken." },
      { icon: ico(24, (<><path d="M12 3v12M7 10l5 5 5-5" /><path d="M5 21h14" /></>)), title: "Heavy Or Drops Fast", body: "Lift it by hand. If it fights you the whole way or crashes down, the spring isn't carrying the weight anymore." },
      { icon: ico(24, <path d="M4 7l16 4M4 7v10l16 4V11" />), title: "Hangs Crooked", body: "One side hangs lower or the door rises at an angle. That points to a spring or cable problem on one side." },
    ],
    note: {
      icon: ico(22, (<><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>), 2.2),
      title: "Stop Using It",
      body: "If any of that sounds familiar, stop running the opener. Forcing it against a broken spring damages the motor and the panels.",
    },
  },
  index: {
    eyebrow: "The Two Kinds Of Spring",
    title: "Torsion Or Extension",
    lead: "Just about every door uses one of two setups, and it helps to know which one you've got.",
    rows: [
      { label: "01", title: "Torsion Springs", desc: "They sit on a metal shaft above the door. As the door moves, the spring winds and unwinds, and that force runs through cables and drums to raise and lower the door. More common on newer doors. It runs smoother, lasts longer, and handles a heavy door better.", icon: ico(26, <path d="M2 12h2M4 6c4-2 6 4 10 2s6-4 8-2M4 18c4-2 6 4 10 2s6-4 8-2" />) },
      { label: "02", title: "Extension Springs", desc: "They run along the horizontal tracks on each side, up near the ceiling. They stretch as the door closes and pull back as it opens. More common on older or lighter doors. They cost less but wear out sooner, and a snapped one can whip loose without a safety cable.", icon: ico(26, <path d="M4 4v16M4 7c3-1 3 2 0 3M4 12c3-1 3 2 0 3M20 4v16" />) },
    ],
    calloutIcon: ico(22, (<><path d="M12 2v6M12 16v6M2 12h6M16 12h6" /><circle cx="12" cy="12" r="3" /></>), 2.2),
    callout: (
      <>
        <strong className="text-white">Why springs wear faster down here.</strong> A spring is rated in cycles, not years, and a standard one is built for around 10,000 cycles, roughly seven to ten years of normal use. Florida humidity rusts bare steel, and rust adds friction and weakens the coils, so a spring can give out early. Salt air near the coast speeds it up more. That's why we talk with a lot of homeowners about high cycle springs, built to take more cycles before they fail.
      </>
    ),
  },
  redBand: {
    badge: "Same Day Service",
    title: "A Broken Spring Won't Wait",
    lead: "It usually goes at the worst moment, the morning you have to be somewhere. A broken spring is one of the most common calls we get, and we keep common springs stocked on the truck, so there's normally no waiting around for parts.",
  },
  whatWeDo: {
    eyebrow: "What We Do On A Spring Call",
    title: "More Than Swapping A Part",
    image: "svc-spring-shaft-detail.jpg",
    imageAlt: "Trinity technician balancing a garage door",
    badge: "Balanced & Tested",
    items: [
      { strong: "We check the whole system.", rest: "Springs, cables, rollers, drums, and balance. A broken spring is sometimes a symptom of something bigger." },
      { strong: "We tell you straight what it needs.", rest: "An honest read and a clear price before we start. No pressure, no selling you parts that are still fine." },
      { strong: "We replace springs in pairs.", rest: "On a two spring door, the other is the same age and not far behind. Doing both keeps it balanced and saves a second call." },
      { strong: "We offer a high cycle option.", rest: "If you want longer stretches between repairs, we can put in springs rated for more cycles." },
      { strong: "We balance and safety test.", rest: "We check the door holds at the halfway point and that the opener and auto reverse work right before we leave." },
    ],
    trailing: "Most spring replacements are a same day job and usually wrap up within a couple of hours. You'll get a free estimate before any work starts.",
  },
  whyTrinity: {
    eyebrow: "Why Folks In Tampa Bay Call Trinity",
    title: "A Family Shop, Not A Call Center",
    lead: "We've been opening doors around here since 2007, across Hillsborough, Pinellas, Pasco, Hernando and Polk.",
    cards: [
      { icon: ico(26, <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 7-5s7 2 7 5M17 11l2 2 4-4" />), title: "Honest Diagnosis", body: "If your spring is fine, we'll say so. We don't sell repairs you don't need." },
      { icon: ico(26, <path d="M13 2L4 14h6l-1 8 9-12h-6z" />), title: "Fast & Same Day", body: "Same day help, and the phones are answered till 9pm when a spring breaks at a bad hour." },
      { icon: ico(26, (<><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>)), title: "Licensed & Insured", body: "Bonded and insured under FL GD13010 and GDI-09484." },
      { icon: ico(26, (<><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></>)), title: "Fair, Upfront Pricing", body: "A price you hear up front, with free estimates every time." },
    ],
  },
  faqHeading: { eyebrow: "Spring Repair Questions", title: "Frequently Asked" },
  faqs: [
    { q: "My door won't open and the opener just hums. Is it the spring?", a: "Usually, yes. When a spring breaks, the opener is suddenly trying to lift the full weight of the door and can't. Don't keep hitting the button, because that can damage the motor. Call us and we'll take a look." },
    { q: "Do I really need to replace both springs if only one broke?", a: "On a two spring door, we recommend it. Both springs have the same age and the same wear, so the second one is usually close behind. Doing both at once keeps the door balanced and saves you another trip charge down the road. On a single spring door, we just replace the one." },
    { q: "How long do garage door springs last?", a: "Most run about seven to ten years, depending on how often you use the door. Since springs are rated in cycles, a busy household wears them out sooner. Our humidity and salt air can cut into that too." },
    { q: "What are high cycle springs?", a: "They're springs built to handle more open and close cycles before they wear out. If you use your door a lot, or you just want longer gaps between repairs, they're worth asking about. We'll tell you whether they make sense for your door." },
    { q: "Can you come out today?", a: "Usually. A broken spring is one of the most common calls we get, and we keep common springs stocked on the truck. Call (813) 279-6785 and we'll find the soonest window that works for you." },
  ],
  closing: {
    title: "Get Your Door Working Again",
    lead: "A broken spring doesn't fix itself, and the door isn't safe to use until it's handled. Call Trinity at (813) 279-6785 or request a free estimate, and we'll get a tech out to you, often the same day.",
  },
};

export default function SpringRepairPage() {
  return <RepairDetailLayout d={spring} />;
}
