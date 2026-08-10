import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RepairDetailLayout, type RepairDetailData } from "@/components/blocks/repair-detail-layout";

export const metadata: Metadata = {
  title: "Emergency Garage Door Repair in Tampa Bay | Trinity",
  description:
    "Garage door stuck, broken, or off track? Trinity answers the phones till 9pm across Tampa Bay. A real person answers and we come fast. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/services/repair/emergency/" },
};

const ico = (size: number, paths: ReactNode, sw: number | string = 2) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {paths}
  </svg>
);

const emergency: RepairDetailData = {
  canonicalPath: "/services/repair/emergency/",
  // Phone leads here, not the form. The form is a callback request, so it answers a 2am emergency
  // with "someone will ring you", which is the wrong answer for a door stuck open. The phones are
  // answered till 9pm. This page's own copy already tells people to call for a true emergency; the
  // buttons agree with it. (The original reason was Housecall Pro only seating appointments Mon to
  // Fri 8 to 4. Booking is switched off now, and the conclusion survives the reason.)
  primaryCta: "phone",
  formTopic: "emergency",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/" },
    { label: "Repair", href: "/services/repair/" },
    { label: "Emergency Repair" },
  ],
  heroEyebrow: "Emergency Repair",
  heroImage: "svc-emergency-night-call.jpg",
  heroImageAlt: "Trinity technician on an after hours emergency garage door call, lit garage at night",
  h1: (
    <>
      Emergency Garage Door <span className="inline-block bg-accent px-3 text-white">Repair</span>
    </>
  ),
  heroLead:
    "A garage door never breaks at a convenient time, the morning you're late, the night you're locking up, or right after a storm. You don't want a voicemail and a callback next week. Trinity answers right up to 9pm, with a real person and a tech on the way.",
  intro: {
    eyebrow: "The Short Version",
    title: "A Real Person, A Tech On The Way",
    paras: [
      "That's what our emergency line is for. We keep room in the schedule for the calls that can't wait, and a real person answers, not a machine, even at two in the morning.",
      "We're family owned and based right here in Tampa Bay, so help is usually close by. Our trucks carry the common parts, so most emergencies are fixed in a single visit, often within a couple of hours.",
    ],
    image: "svc-crew-branded-polo.jpg",
    imageAlt: "Trinity crew on site, phone number on the back of the polo",
    badge: "Same Day Service",
  },
  signs: {
    eyebrow: "When It Can't Wait",
    title: "These Usually Can't",
    lead: "Some garage door problems can sit until morning. These usually can't.",
    cards: [
      { icon: ico(24, (<><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M4 9h16" /></>)), title: "Spring, Car Trapped", body: "When a spring snaps, the door becomes dead weight the opener can't lift, and your car is trapped behind it. Our most common after hours call." },
      { icon: ico(24, (<><path d="M3 12h3l2-6 4 12 2-6h3" /><path d="M18 5l3 3-3 3" /></>)), title: "Stuck Wide Open", body: "An open garage is an open house. Your tools, cars, and everything in there are sitting out for the weather and anyone walking by. We'll get it closed and secure." },
      { icon: ico(24, (<><path d="M3 8c4-2 6 2 9 0M3 14c4-2 6 2 9 0" /><path d="M15 11h6" /></>)), title: "Off The Track", body: "A door hanging crooked or jammed in the opening can fall or do more damage every time it moves. Leave it alone and let us handle it." },
      { icon: ico(24, (<><path d="M12 3v12M7 10l5 5 5-5" /><path d="M5 21h14" /></>)), title: "Snapped Cable", body: "The door drops on one side, hangs at an angle, and isn't safe to run. Best to stop and call before it does more damage." },
      { icon: ico(24, <path d="M4 7l16 4M4 7v10l16 4V11" />), title: "Storm Damage", body: "A door that took debris, got pushed in by wind, or won't close with weather coming. We'll get it secured and back in shape." },
    ],
    note: {
      icon: ico(22, (<><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>), 2.2),
      title: "Keep Everyone Clear",
      body: "Keep people, pets, and cars clear of any door that's stuck, leaning, or partway open until we get there.",
    },
  },
  index: {
    eyebrow: "What To Do Until We Get There",
    title: "A Few Minutes Of Patience",
    lead: "A little care while you wait on us can save you a much bigger repair.",
    rows: [
      { label: "01", title: "Stop Hitting The Opener", desc: "Forcing a jammed or unbalanced door can burn out the motor, snap a cable, or bend the panels and track. One or two tries is plenty, then leave it.", icon: ico(26, (<><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></>)) },
      { label: "02", title: "Don't Force A Broken Spring Or Cable", desc: "That's exactly when a door comes down hard. If you think a spring or cable is gone, leave the door closed and call us.", icon: ico(26, (<><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>)) },
      { label: "03", title: "Use The Manual Release Carefully", desc: "That red cord disconnects the door from the opener, but only pull it when the door is all the way down. Pulling it with the door up, or with a broken spring, can let the door crash. If it feels really heavy or sits crooked after you release it, stop and wait for us.", icon: ico(26, (<><path d="M12 3v9" /><circle cx="12" cy="15" r="3" /></>)) },
    ],
    calloutIcon: ico(22, (<><path d="M12 2v6M12 16v6M2 12h6M16 12h6" /><circle cx="12" cy="12" r="3" /></>), 2.2),
    callout: (
      <>
        <strong className="text-white">Storm season in Florida.</strong> Hurricane season runs June through November, and your garage door is the biggest opening on most houses. When wind gets behind a weak or damaged door, the trouble can spread to the roof and walls fast. If your door took a hit, won't close with a storm coming, or quit working after one, call us and we'll get it secured and back in shape.
      </>
    ),
  },
  redBand: {
    badge: "Same Day Service",
    title: "A Garage Door Emergency Won't Wait",
    lead: "It's the morning you have to be somewhere, or the night you can't leave the house wide open. A real person answers till 9pm, the trucks carry common parts, and most emergencies are fixed on the first visit.",
  },
  whatWeDo: {
    eyebrow: "What To Expect From An Emergency Call",
    title: "A Real Person, Then A Fast Fix",
    image: "svc-track-header-branded.jpg",
    imageAlt: "Trinity technician working the door header on a call out",
    badge: "Fixed Fast",
    items: [
      { strong: "A person answers, not a machine.", rest: "Right up to 9pm. You reach someone who can get a technician headed your way." },
      { strong: "The trucks carry common parts.", rest: "Springs, cables, rollers, and brackets, so most emergencies are fixed in a single visit, often within a couple of hours." },
      { strong: "You hear the price first.", rest: "Even at two in the morning, you get the number before we start. No surprises on the bill." },
      { strong: "We'll tell you if it can wait.", rest: "If the problem can safely hold until regular hours and save you a little, we'll say so. We won't use a late night call to pad the bill." },
      { strong: "We get your car out.", rest: "Trapped behind a dead door? Tell us when you call and we'll come ready to open it safely so you can get going." },
    ],
    trailing: "Estimates during normal hours are free, and we're licensed, bonded, and insured under GD13010 and GDI-09484. We answer when it matters and we fix it right.",
  },
  whyTrinity: {
    eyebrow: "Why Folks In Tampa Bay Call Trinity",
    title: "A Family Shop, Not A Call Center",
    lead: "We've been opening doors around here since 2007, across Hillsborough, Pinellas, Pasco, Hernando, Polk and the north end of Manatee.",
    cards: [
      { icon: ico(26, <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 7-5s7 2 7 5M17 11l2 2 4-4" />), title: "We Answer When It Matters", body: "A real person picks up the phone till 9pm. We won't use a late call to pad the bill." },
      { icon: ico(26, <path d="M13 2L4 14h6l-1 8 9-12h-6z" />), title: "Fast & Same Day", body: "Same day help, and the phones are answered till 9pm when your door quits at a bad hour." },
      { icon: ico(26, (<><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>)), title: "Licensed & Insured", body: "Bonded and insured under FL GD13010 and GDI-09484." },
      { icon: ico(26, (<><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></>)), title: "Fair, Upfront Pricing", body: "A price you hear up front, with free estimates every time." },
    ],
  },
  faqHeading: { eyebrow: "Emergency Questions We Hear A Lot", title: "Frequently Asked" },
  faqs: [
    { q: "How late can I call?", a: "The phones are answered till 9pm. Call (813) 279-6785 and you'll reach a real person, not a machine, who can tell you the soonest we can get a technician to you." },
    { q: "My car is stuck in the garage. Can you get it out?", a: "Usually, yes. Tell us when you call and we'll come ready to open the door safely so you can get your vehicle out." },
    { q: "The door won't close and I have to leave. What now?", a: "Call us right away. If we can't be there before you go, we'll talk you through securing it as best you can so the house isn't left wide open." },
    { q: "Should I try to fix it myself in the meantime?", a: "For anything involving the springs or cables, please don't. They hold enough tension to hurt you badly. Keep clear of the door and let a technician handle it." },
    { q: "Is an after hours call more than a regular visit?", a: "We'll always give you the price before any work starts, so there are no surprises. If the problem can safely wait for normal hours, we'll tell you that too." },
  ],
  closing: {
    title: "Call Us Now",
    lead: "If your garage door can't wait, call Trinity at (813) 279-6785 up to 9pm. We'll get a technician to you fast and get your door working and your house secure again.",
  },
};

export default function EmergencyRepairPage() {
  return <RepairDetailLayout d={emergency} />;
}
