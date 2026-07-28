import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RepairDetailLayout, type RepairDetailData } from "@/components/blocks/repair-detail-layout";

export const metadata: Metadata = {
  title: "Off Track Garage Door Repair in Tampa Bay | Trinity",
  description:
    "Garage door off its track? Trinity gets it back on safely and often the same day across Tampa Bay. Family owned, honest pricing, free estimates.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/services/repair/off-track/" },
};

const ico = (size: number, paths: ReactNode, sw: number | string = 2) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {paths}
  </svg>
);

const offTrack: RepairDetailData = {
  canonicalPath: "/services/repair/off-track/",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/" },
    { label: "Repair", href: "/services/repair/" },
    { label: "Off Track Repair" },
  ],
  heroEyebrow: "Off Track Repair & Replacement",
  heroImage: "svc-offtrack-frame-kneeling.jpg",
  heroImageAlt: "Trinity technician repairing an off-track garage door",
  h1: (
    <>
      Garage Door Off Track <span className="inline-block bg-accent px-3 text-white">Repair</span>
    </>
  ),
  heroLead:
    "An off track door sits crooked, leans into the garage, and won't run right. It's unsettling to walk out to, and it's not one to put off. Getting doors back on their tracks is one of our most common calls, and we can usually be out the same day.",
  intro: {
    eyebrow: "The Short Version",
    title: "When Your Door Jumps The Track",
    paras: [
      "You'll know it when you see it. One side hangs lower than the other, a roller or two has popped out of the metal track, and the whole door looks like it's leaning in. Sometimes it's stuck wide open, sometimes jammed halfway and won't go either way.",
      "It's not a problem to put off. We're family owned and based right here in Tampa Bay, and we keep a 24/7 line for the ones that can't wait, like a door stuck open overnight.",
    ],
    image: "svc-offtrack-top-seal.jpg",
    imageAlt: "Trinity technicians realigning a garage door",
    badge: "Same Day Service",
  },
  signs: {
    eyebrow: "Why It Happens",
    title: "How A Door Comes Off Track",
    lead: "A door rides up and down on a roller and track system, and stays put as long as everything's lined up and under the right tension. A few things throw it off.",
    cards: [
      { icon: ico(24, (<><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M4 9h16" /></>)), title: "Broken Cable", body: "The cables keep the door balanced as it moves. When one snaps or slips off its drum, that side drops and the door twists out of the track." },
      { icon: ico(24, (<><path d="M3 12h3l2-6 4 12 2-6h3" /><path d="M18 5l3 3-3 3" /></>)), title: "Worn Rollers", body: "Rollers that are cracked, rusted, or coming apart don't sit in the track the way they should, and eventually one jumps out." },
      { icon: ico(24, (<><path d="M3 8c4-2 6 2 9 0M3 14c4-2 6 2 9 0" /><path d="M15 11h6" /></>)), title: "Bent Track", body: "If the track gets knocked out of shape, or the brackets holding it work loose, the rollers have nowhere good to go." },
      { icon: ico(24, (<><path d="M12 3v12M7 10l5 5 5-5" /><path d="M5 21h14" /></>)), title: "An Impact", body: "Somebody backs into the door, or a ladder or trailer clips it, and the track bends just enough to derail the whole thing." },
      { icon: ico(24, <path d="M4 7l16 4M4 7v10l16 4V11" />), title: "A Broken Spring", body: "When a spring lets go, the door can come down hard and uneven, and that sudden jolt is often enough to knock it off track." },
    ],
    note: {
      icon: ico(22, (<><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>), 2.2),
      title: "Junk & Salt Air",
      body: "Dirt, a stray bolt, or built up grease can block a roller and force it off. And our salt air and humidity seize rollers and corrode tracks faster near the water.",
    },
  },
  index: {
    eyebrow: "What We Do On The Visit",
    title: "More Than Popping It Back In",
    lead: "We don't just pop the rollers back in and call it done. That fixes the symptom and skips the cause. Here's how we work it.",
    rows: [
      { label: "01", title: "We Find Out Why", desc: "The technician checks the rollers, cables, springs, track, and hardware to see what actually let go. Popping the roller back without finding the cause just buys you another off track door next week.", icon: ico(26, (<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>)) },
      { label: "02", title: "We Realign It", desc: "If the track is sound, we reset the rollers, straighten the door, and bring it back into line so it runs square again.", icon: ico(26, <path d="M4 7h16M4 12h16M4 17h16M8 4v16" />) },
      { label: "03", title: "We Replace What's Bad", desc: "Bad rollers, a frayed cable, a damaged section of track, we swap out whatever caused the trouble so it doesn't happen again.", icon: ico(26, (<><path d="M21 2v6h-6M3 22v-6h6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 12a9 9 0 0 1-15 6.7L3 16" /></>)) },
      { label: "04", title: "We Reset The Balance", desc: "A door that comes off track is almost always out of balance. We get the springs and cables pulling evenly again.", icon: ico(26, <path d="M12 3v18M5 8l7-5 7 5M3 12h4l-2 5H1zM17 12h4l-2 5h-4z" />) },
      { label: "05", title: "We Test It All", desc: "Before we leave, we run the door up and down, check that it holds in place on its own, and make sure the safety sensors reverse it the way they should.", icon: ico(26, (<><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></>)) },
    ],
    calloutIcon: ico(22, (<><path d="M12 2v6M12 16v6M2 12h6M16 12h6" /><circle cx="12" cy="12" r="3" /></>), 2.2),
    callout: (
      <>
        <strong className="text-white">Please don't force it.</strong> The instinct is to shove it back or keep tapping the opener. Don't. Hit the opener and you can drag the door further off, bend the track worse, snap a cable, or bring the whole thing down. Leave it where it is, keep kids and cars clear, and call us. We do this safely every day.
      </>
    ),
  },
  redBand: {
    badge: "Same Day & 24/7",
    title: "Stuck Open Or Jammed Shut?",
    lead: "An off track door can't wait, especially one stuck wide open overnight. We keep a 24/7 line for exactly that, and we'll come ready to get your car out safely if it's trapped inside.",
  },
  whatWeDo: {
    eyebrow: "When You Need A New Track",
    title: "Realign It, Or Replace The Track",
    image: "svc-offtrack-ladder-top-section.jpg",
    imageAlt: "Trinity technician working on a garage door track",
    badge: "Realign Or Replace",
    items: [
      { strong: "Most doors just need a realign.", rest: "A reset and a few new parts, worn rollers or a frayed cable, and the door runs true again." },
      { strong: "Some tracks are too far gone.", rest: "Badly bent, kinked, crushed, or rusted through, straightening won't hold, and we'll tell you straight." },
      { strong: "A new track is the honest fix then.", rest: "It means the door runs true again and you're not back to the same problem in a month." },
      { strong: "We leave the choice with you.", rest: "We walk you through what we're seeing. If a repair will do, we repair it. We won't sell you a track you don't need." },
      { strong: "Every major brand.", rest: "Door or opener, it doesn't matter what you've got hanging in your garage, we work on it." },
    ],
    trailing: "Many off track doors are back in service in a single visit. If it needs a part we have to grab, we'll let you know up front and get it sorted as quick as we can.",
  },
  whyTrinity: {
    eyebrow: "Why Folks In Tampa Bay Call Trinity",
    title: "A Family Shop, Not A Call Center",
    lead: "We've been opening doors around here since 2007, across Hillsborough, Pasco, and Pinellas.",
    cards: [
      { icon: ico(26, <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 7-5s7 2 7 5M17 11l2 2 4-4" />), title: "Honest Diagnosis", body: "If a simple repair will hold, that's what we'll do. We don't pad the bill." },
      { icon: ico(26, <path d="M13 2L4 14h6l-1 8 9-12h-6z" />), title: "Fast & Same Day", body: "Same day help, plus a 24/7 line for when your door quits at a bad hour." },
      { icon: ico(26, (<><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>)), title: "Licensed & Insured", body: "Bonded and insured under FL GD13010 and GDI-09484." },
      { icon: ico(26, (<><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></>)), title: "Fair, Upfront Pricing", body: "A price you hear up front, with free estimates every time." },
    ],
  },
  faqHeading: { eyebrow: "Off Track Questions", title: "Frequently Asked" },
  faqs: [
    { q: "My door is off track. Is it safe to use until you get here?", a: "No. Don't run the opener, and don't try to open it by hand. Every time it moves, an off track door can do more damage to itself or to whatever is underneath it. Leave it be and we'll handle it." },
    { q: "Can I just put the roller back in myself?", a: "We really don't recommend it. The door is heavy and the springs are under high tension, and a door that drops while you're working on it can hurt you. Even if you got the roller back in, whatever knocked it out is still there." },
    { q: "Do I need a whole new track, or can it be repaired?", a: "Most of the time it's a repair. We can realign a track that's still in good shape and replace the worn rollers or cable that caused the trouble. We only point you toward a new track when the old one is too bent or corroded to trust, and we'll show you which one you're dealing with." },
    { q: "Can you get my car out if it's trapped inside?", a: "Usually, yes. Tell us when you call and we'll come ready to open the door safely so you can get your vehicle out." },
    { q: "How long does the repair take?", a: "Many off track doors are back in service in a single visit. If it needs a part we have to grab, we'll let you know up front and get it sorted as quick as we can." },
  ],
  closing: {
    title: "Get Your Door Back On Track",
    lead: "If your garage door has come off its track, call Trinity at (813) 279-6785 and we'll get someone out to you, often the same day. Prefer to start online? Request a free estimate and we'll reach out right away.",
  },
};

export default function OffTrackRepairPage() {
  return <RepairDetailLayout d={offTrack} />;
}
