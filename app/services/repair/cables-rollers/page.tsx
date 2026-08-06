import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RepairDetailLayout, type RepairDetailData } from "@/components/blocks/repair-detail-layout";

export const metadata: Metadata = {
  title: "Garage Door Cable & Roller Repair in Tampa Bay | Trinity",
  description:
    "Frayed cable or noisy, worn rollers? Trinity repairs and replaces garage door cables and rollers across Tampa Bay. Same day service, free estimates. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/services/repair/cables-rollers/" },
};

const ico = (size: number, paths: ReactNode, sw: number | string = 2) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {paths}
  </svg>
);

const cablesRollers: RepairDetailData = {
  canonicalPath: "/services/repair/cables-rollers/",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/" },
    { label: "Repair", href: "/services/repair/" },
    { label: "Cables & Rollers" },
  ],
  heroEyebrow: "Cable & Roller Repair",
  heroImage: "svc-cables-rail-tool.jpg",
  heroImageAlt: "Garage door cables, drum, and spring hardware",
  h1: (
    <>
      Cable & Roller <span className="inline-block bg-accent px-3 text-white">Repair</span>
    </>
  ),
  heroLead:
    "Cables and rollers are the small parts that do a lot of quiet work. When they wear out, the door gets loud, rough, or crooked, and sometimes stops moving altogether. We replace both, all over Tampa Bay, often the same day.",
  formTopic: "cables-and-rollers",
  intro: {
    eyebrow: "The Short Version",
    title: "The Small Parts That Do Quiet Work",
    paras: [
      "A steel cable runs down each side of your door. They work with the springs to carry the weight, a few hundred pounds, and keep both sides moving together. The bottom of each cable hooks to a bracket at the lower corner, then winds around a drum at the end of the spring shaft.",
      "Because the cables carry that load all the time, they sit under real tension, even when the door is just closed and quiet. That's why the bottom bracket and the cables are not something to poke at, it's a job for the right tools and training.",
    ],
    image: "svc-cables-track-interior.jpg",
    imageAlt: "Trinity technician replacing a garage door cable",
    badge: "Same Day Service",
  },
  signs: {
    eyebrow: "Signs A Cable Is Going",
    title: "Before It Snaps",
    lead: "A failing cable usually shows itself before it snaps. If you see any of these, stop using the door.",
    cards: [
      { icon: ico(24, (<><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M4 9h16" /></>)), title: "Crooked Door", body: "The door looks crooked, with one side lower than the other. A cable on one side has slipped or stretched." },
      { icon: ico(24, (<><path d="M3 12h3l2-6 4 12 2-6h3" /><path d="M18 5l3 3-3 3" /></>)), title: "Hanging Loose", body: "A cable is hanging loose or coiled up beside the door instead of wound neatly on the drum." },
      { icon: ico(24, (<><path d="M3 8c4-2 6 2 9 0M3 14c4-2 6 2 9 0" /><path d="M15 11h6" /></>)), title: "Lifts Unevenly", body: "The door lifts unevenly or feels like it's binding on one side as it moves." },
      { icon: ico(24, (<><path d="M12 3v12M7 10l5 5 5-5" /><path d="M5 21h14" /></>)), title: "Dust Or Shavings", body: "Fine brown dust or metal shavings near the drum or down the track. That's a cable starting to fray." },
      { icon: ico(24, <path d="M4 7l16 4M4 7v10l16 4V11" />), title: "A Snap, Then A Drop", body: "You hear a snap, and the door drops or jams. A door running on a broken cable can pull itself off the track." },
    ],
    note: {
      icon: ico(22, (<><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>), 2.2),
      title: "Stop Using It",
      body: "A door running on a frayed or broken cable can drop or pull itself off the track. If you spot the signs, stop using it and give us a call.",
    },
  },
  index: {
    eyebrow: "What Your Rollers Do",
    title: "And Why The Type Matters",
    lead: "Rollers are the little wheels that ride inside the track and carry the door. A typical door has around ten of them, and not all rollers are the same.",
    rows: [
      { label: "Steel", title: "Cheap, But Loud", desc: "What a lot of builders use. They run steel against steel, so they're loud, they rust, and they tend to wear out in just a few years.", icon: ico(26, (<><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2" /></>)) },
      { label: "Nylon", title: "Quieter, Longer Lasting", desc: "Quieter and smoother, they don't rust, and they usually last far longer than steel. A big step up for not much money.", icon: ico(26, (<><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="3" /></>)) },
      { label: "Sealed Bearing", title: "The Best Of The Bunch", desc: "The bearings are packed and sealed against dirt and moisture, so they run quiet and smooth and basically take care of themselves. The biggest upgrade you can make.", icon: ico(26, (<><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" fill="currentColor" /></>)) },
    ],
    calloutIcon: ico(22, (<><path d="M12 2v6M12 16v6M2 12h6M16 12h6" /><circle cx="12" cy="12" r="3" /></>), 2.2),
    callout: (
      <>
        <strong className="text-white">Florida is hard on this hardware.</strong> Cables and roller bearings are steel, and steel and salt air don't get along. Near the coast, and in our humidity just about everywhere, cables rust and fray sooner and roller bearings seize up faster than they would up north. That's a big reason we like sealed bearing rollers and good hardware down here, they hold up a lot longer in this climate.
      </>
    ),
  },
  redBand: {
    badge: "Same Day Service",
    title: "Crooked, Loud, Or Rough?",
    lead: "If your door is crooked, loud, or rough, it usually means a worn cable or tired rollers. We keep cables and rollers stocked on the truck, so most of these are a one visit fix.",
  },
  whatWeDo: {
    eyebrow: "What We Do On The Visit",
    title: "Worked Safely, All The Way Through",
    image: "svc-rollers-hardware-bench.jpg",
    imageAlt: "New rollers, hinges and roller brackets laid out before a Trinity replacement",
    badge: "Quiet & Smooth",
    items: [
      { strong: "We lock out the opener and secure the door.", rest: "Nothing can move while we work, since this hardware sits under spring tension." },
      { strong: "We replace cables in matched pairs.", rest: "If one is worn, the other is the same age and headed the same way. Doing both keeps the door balanced and saves a second trip." },
      { strong: "We replace or upgrade the rollers.", rest: "Usually all at once, since they wear together. Happy to put in nylon or sealed bearing rollers if you want the quiet." },
      { strong: "We check the springs while we're in there.", rest: "Cables, springs, and rollers wear on the same clock. If the springs are close to done, we'll show you, so you're not back next month." },
      { strong: "We lubricate, realign, and test.", rest: "We tighten the hardware, cycle the door, check the balance, and make sure the safety reverse works before we leave." },
    ],
    trailing: "A garage door is one connected system, and the parts age together. We replace in pairs and check the springs so we fix it once and it holds. Estimates are free before any work starts.",
  },
  whyTrinity: {
    eyebrow: "Why Folks In Tampa Bay Call Trinity",
    title: "A Family Shop, Not A Call Center",
    lead: "We've been opening doors around here since 2007, across Hillsborough, Pinellas, Pasco, Hernando and Polk.",
    cards: [
      { icon: ico(26, <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 7-5s7 2 7 5M17 11l2 2 4-4" />), title: "We Fix It Once", body: "We tell you what's actually worn and don't sell you parts that are still good. We'd rather fix it once and have it hold." },
      { icon: ico(26, <path d="M13 2L4 14h6l-1 8 9-12h-6z" />), title: "Fast & Same Day", body: "Same day help, and the phones are answered till 9pm when your door quits at a bad hour." },
      { icon: ico(26, (<><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>)), title: "Licensed & Insured", body: "Bonded and insured under FL GD13010 and GDI-09484." },
      { icon: ico(26, (<><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></>)), title: "Fair, Upfront Pricing", body: "A price you hear up front, with free estimates every time." },
    ],
  },
  faqHeading: { eyebrow: "Cable And Roller Questions", title: "Frequently Asked" },
  faqs: [
    { q: "Can you just replace the one cable that broke?", a: "We replace them in pairs. The other cable is the same age and just as worn, so doing both keeps the door balanced and saves you a second visit in a few weeks." },
    { q: "Are nylon or sealed bearing rollers worth the upgrade?", a: "For most people, yes. They're much quieter, they last a lot longer, and sealed bearing rollers shrug off our humidity. It's one of the best small upgrades you can make to a door." },
    { q: "My door is really loud. Is that the rollers?", a: "Often, yes. Worn steel rollers are a common cause of a noisy door. Dry hinges and loose hardware can add to it, and a tune up usually quiets all of it down." },
    { q: "Is it safe to use the door with a frayed cable?", a: "We'd rather you didn't. A frayed cable can snap, and then the door drops or jumps the track. Leave it be and give us a call." },
    { q: "Can you come out the same day?", a: "Usually. We keep cables and rollers stocked on the truck, so most of these are a one visit fix. Call (813) 279-6785 and we'll find you a slot." },
  ],
  closing: {
    title: "Get Your Door Running Smooth Again",
    lead: "If your door is crooked, loud, or rough, call Trinity at (813) 279-6785 or request a free estimate online. We'll get the cables and rollers sorted and your door gliding the way it should.",
  },
};

export default function CablesRollersRepairPage() {
  return <RepairDetailLayout d={cablesRollers} />;
}
