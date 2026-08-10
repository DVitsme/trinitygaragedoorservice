import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RepairDetailLayout, type RepairDetailData } from "@/components/blocks/repair-detail-layout";

export const metadata: Metadata = {
  title: "Garage Door Installation Tampa Bay | Trinity Garage Door Service",
  description:
    "New garage door installation across Tampa Bay for replacements and new builds. Doors from Clopay, C.H.I., Hörmann, and Amarr. Free estimates, call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/services/installation/" },
};

const ico = (size: number, paths: ReactNode, sw: number | string = 2) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {paths}
  </svg>
);

const installation: RepairDetailData = {
  canonicalPath: "/services/installation/",
  primaryCta: "estimate",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/" },
    { label: "Installation" },
  ],
  heroEyebrow: "Garage Door Installation",
  heroImage: "svc-install-moving-panel.jpg",
  heroImageAlt: "A new Trinity garage door at dusk",
  h1: (
    <>
      Garage Door <span className="inline-block bg-accent px-3 text-white">Installation</span>
    </>
  ),
  heroLead:
    "Maybe your old door gave out. Maybe you're building and the garage is a blank opening waiting for a door. Either way, we put in new doors across Tampa Bay, and we put them in right.",
  intro: {
    eyebrow: "The Short Version",
    title: "A New Door, Put In Right",
    paras: [
      "Maybe your old door finally gave out. Maybe you're building and the garage is a blank opening waiting for a door. Either way, this is the page about getting a new garage door put in, and put in right.",
      "We install new doors for homeowners all over Tampa Bay, on existing houses and new construction both. You pick the door. We measure, set it, connect the opener, and make sure it runs smooth and quiet before we pack up.",
    ],
    image: "svc-install-panel-lift.jpg",
    imageAlt: "A newly installed white garage door on a Tampa Bay home",
    badge: "New Builds & Replacements",
  },
  signs: {
    eyebrow: "Start With the Material",
    title: "Four Ways to Build a Door",
    lead: "The right door comes down to the look you want, your budget, and how much upkeep you're willing to do. Here's the honest rundown.",
    cards: [
      { icon: ico(24, (<><rect x="3" y="4" width="18" height="16" rx="1" /><path d="M3 10h18M3 15h18" /></>)), title: "Steel", body: "The most common choice. Strong, affordable, and it barely needs maintenance. You can get it insulated, painted, or pressed to look like wood grain. Thin steel can dent, so we'll point you to a gauge that holds up." },
      { icon: ico(24, (<><path d="M12 2 6 9h3l-3 5h12l-3-5h3z" /><path d="M12 14v8" /></>)), title: "Wood", body: "Nothing else looks quite like real wood. It can be stained or built custom and suits certain homes beautifully. The trade off is upkeep, since Florida sun and humidity are hard on it." },
      { icon: ico(24, (<><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M12 3v18M4 12h16" /></>)), title: "Aluminum & Glass", body: "Light, rust proof, and modern. Big glass panels let daylight pour into the garage, great for shops, gyms, and clean contemporary fronts." },
      { icon: ico(24, (<><path d="M12 2 2 7l10 5 10-5z" /><path d="M2 12l10 5 10-5M2 17l10 5 10-5" /></>)), title: "Composite", body: "The wood look without the wood headaches. Real grain and color over a tougher core that shrugs off moisture, rot, and bugs. A genuine advantage in our climate." },
    ],
    note: {
      icon: ico(22, (<><path d="M12 2v6M12 16v6M2 12h6M16 12h6" /><circle cx="12" cy="12" r="3" /></>), 2.2),
      title: "Then the Style",
      body: "Material is what the door is made of. Style is the face it shows the street. Carriage house, raised panel, or modern and full view, we'll bring you options that actually fit your house instead of talking you into the priciest thing on the truck.",
    },
  },
  index: {
    eyebrow: "How the Install Goes",
    title: "No Surprises, Start to Finish",
    lead: "Here's the order of events, from the first call to the last test.",
    rows: [
      { label: "01", title: "Free Estimate & Consult", desc: "We come look at the opening, talk through what you want, and give you a real number. No pressure to decide on the spot.", icon: ico(26, (<><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4h6v3H9zM9 12h6M9 16h4" /></>)) },
      { label: "02", title: "Measure", desc: "We measure the opening, the headroom, and the side room so the door and tracks fit right. New construction gets checked against the framing.", icon: ico(26, (<><rect x="2" y="9" width="20" height="6" rx="1" /><path d="M6 9v3M10 9v3M14 9v3M18 9v3" /></>)) },
      { label: "03", title: "Out With the Old", desc: "If there's an existing door, we take it down and haul it off. You don't deal with the old one.", icon: ico(26, <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />) },
      { label: "04", title: "Install", desc: "We set the tracks, panels, springs, and hardware, then mount or reconnect the opener.", icon: ico(26, <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 1 5.4-5.4l-2.5 2.5-2-2z" />) },
      { label: "05", title: "Test & Clean Up", desc: "We balance the door, test the safety reverse and the opener, and run it a few times to be sure it's quiet and smooth. Then we take the mess with us.", icon: ico(26, (<><circle cx="12" cy="12" r="9" /><path d="M9 12l2 2 4-4" /></>)) },
    ],
    calloutIcon: ico(22, (<><path d="M12 2v6M12 16v6M2 12h6M16 12h6" /><circle cx="12" cy="12" r="3" /></>), 2.2),
    callout: (
      <>
        <strong className="text-white">The brands we install.</strong> We put in doors from Clopay, C.H.I., Hörmann, and Amarr, the names that hold up in our experience, with insulation options, wind rated models, and finishes that last. We service and repair plenty of other brands too, so you're never stuck.
      </>
    ),
  },
  redBand: {
    badge: "Free Estimate",
    title: "Start With a Free Estimate",
    lead: "The easiest way to get a real number is to let us look at the opening. The estimate is free, the advice is honest, and there's no pressure to decide on the spot.",
  },
  whatWeDo: {
    eyebrow: "Built for Florida Weather",
    title: "Heat and Wind, Handled",
    image: "door-white-window-row.jpg",
    imageAlt: "A freshly installed Trinity garage door",
    badge: "Permit Handled",
    items: [
      { strong: "Insulated against the heat.", rest: "An insulated door slows the heat coming through what is, on a lot of houses, the biggest uninsulated surface they own, and it takes some load off the AC." },
      { strong: "Wind rated for storm season.", rest: "Florida code sets a wind rating by location, and the garage is usually the largest opening on the house. A wind rated door is built heavier and anchored to hold." },
      { strong: "Permit and inspection handled.", rest: "Most door swaps around here need a permit confirming the door is rated for your address. We pull it and handle the paperwork as part of the job." },
      { strong: "Quieter, too.", rest: "Foam filled doors run quieter, since the panel is more solid." },
      { strong: "An opener to match.", rest: "Reconnect a good opener, or set up a new one you can run from your phone if you want it." },
    ],
    trailing: "Most single door installs wrap up in a day. We'll give you a straight timeline when we quote it, not after.",
  },
  whyTrinity: {
    eyebrow: "Why Folks In Tampa Bay Call Trinity",
    title: "A Family Shop, Not A Call Center",
    lead: "We've been opening doors around here since 2007, across Hillsborough, Pinellas, Pasco, Hernando, Polk and the north end of Manatee.",
    cards: [
      { icon: ico(26, <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 7-5s7 2 7 5M17 11l2 2 4-4" />), title: "Honest Advice", body: "We bring you options that fit your house, not the priciest thing on the truck." },
      { icon: ico(26, <path d="M13 2L4 14h6l-1 8 9-12h-6z" />), title: "Clear Timeline", body: "Quick scheduling and a straight timeline, so you know when your door goes in." },
      { icon: ico(26, (<><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>)), title: "Licensed & Insured", body: "Bonded and insured under FL GD13010 and GDI-09484." },
      { icon: ico(26, (<><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></>)), title: "Fair, Upfront Pricing", body: "A price you hear up front, with free estimates every time." },
    ],
  },
  faqHeading: { eyebrow: "Installation Questions", title: "Frequently Asked" },
  faqs: [
    { q: "Do you install on new construction, or only replacements?", a: "Both. We do new builds and replacements all the time. On new construction we check the door against your framing; on a replacement we take down and haul off the old door." },
    { q: "How long does an install take?", a: "Most single doors go in within a day. Bigger, custom, or double doors can take longer. We'll tell you the timeline when we give you the estimate, not after." },
    { q: "Do I need a permit?", a: "In most of Tampa Bay, a door install or replacement needs a permit, and it confirms the door meets the wind rating for your area. We pull it and handle the inspection so you don't have to." },
    { q: "Will a new door come with an opener?", a: "The opener is separate from the door. If yours still works well, we can reconnect it. If it's old or you want smart features, we can install a new one and set it up." },
    { q: "Can you match a specific look I have in mind?", a: "Usually, yes. Between steel, wood, aluminum and glass, and composite, and the styles each brand offers, there's a lot of room. Show us a photo and we'll find something close." },
  ],
  closing: {
    title: "Ready for a New Door?",
    lead: "Call Trinity at (813) 279-6785 for a free estimate, or send us a message and we'll get you on the schedule. Family owned, licensed and insured under FL GD13010 and GDI-09484, serving Tampa Bay since 2007.",
  },
};

export default function InstallationPage() {
  return <RepairDetailLayout d={installation} />;
}
