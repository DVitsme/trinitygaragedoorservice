import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RepairDetailLayout, type RepairDetailData } from "@/components/blocks/repair-detail-layout";

export const metadata: Metadata = {
  title: "Garage Door Tune Up & Maintenance in Tampa Bay | Trinity",
  description:
    "A yearly garage door tune up keeps it running safely and quietly. Trinity services and maintains doors across Tampa Bay. Free estimates. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/services/repair/tune-up/" },
};

const ico = (size: number, paths: ReactNode, sw: number | string = 2) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {paths}
  </svg>
);

const tuneUp: RepairDetailData = {
  canonicalPath: "/services/repair/tune-up/",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/" },
    { label: "Repair", href: "/services/repair/" },
    { label: "Tune Up" },
  ],
  heroEyebrow: "Tune Up & Maintenance",
  heroImage: "svc-tuneup-rail-check.jpg",
  heroImageAlt: "Trinity technician checking the rail and hardware on a tune up",
  h1: (
    <>
      Garage Door <span className="inline-block bg-accent px-3 text-white">Tune Up</span>
    </>
  ),
  heroLead:
    "Nobody thinks about a garage door that's working right. A tune up is how you keep it that way. It's the heaviest moving thing in most homes and runs thousands of times a year, so a little upkeep keeps it quiet and reliable. We tune up doors all over Tampa Bay.",
  formTopic: "tune-up",
  intro: {
    eyebrow: "The Short Version",
    title: "A Little Upkeep Heads Off The Breakdowns",
    paras: [
      "A yearly tune up keeps the door running smooth and catches the small stuff before it strands you with your car inside. When we service a door, we go through the whole system, not only the squeaky part.",
      "The good news is a little attention goes a long way, and a well kept door lasts many years longer than a neglected one. We'll tell you honestly what your door needs and what it doesn't.",
    ],
    image: "svc-opener-service-tech.jpg",
    imageAlt: "Trinity technician servicing a ceiling mounted garage door opener",
    badge: "Same Day Service",
  },
  signs: {
    eyebrow: "What's In A Trinity Tune Up",
    title: "The Whole System, Not One Squeaky Part",
    lead: "When we service a door, we go through all of it. Here's what's included.",
    cards: [
      { icon: ico(24, (<><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M4 9h16" /></>)), title: "Lubricate", body: "Rollers, hinges, springs, bearings, and the opener's drive, all with the right garage door lubricant so nothing runs dry." },
      { icon: ico(24, (<><path d="M3 12h3l2-6 4 12 2-6h3" /><path d="M18 5l3 3-3 3" /></>)), title: "Tighten Hardware", body: "All that movement shakes bolts and brackets loose over time. We snug up the hinges, track brackets, and opener mounts." },
      { icon: ico(24, (<><path d="M3 8c4-2 6 2 9 0M3 14c4-2 6 2 9 0" /><path d="M15 11h6" /></>)), title: "Springs & Balance", body: "We look the springs over for wear and rust, then test that the door is balanced and not leaning on the opener to do the springs' job." },
      { icon: ico(24, (<><path d="M12 3v12M7 10l5 5 5-5" /><path d="M5 21h14" /></>)), title: "Cables, Rollers & Hinges", body: "We catch fraying cables, worn rollers, and loose hinges while they're still cheap to deal with." },
      { icon: ico(24, <path d="M4 7l16 4M4 7v10l16 4V11" />), title: "Opener, Tracks & Seal", body: "We check the force and travel settings, then look over the track for dents and the bottom seal for cracks that let in water, bugs, and heat." },
    ],
    note: {
      icon: ico(22, (<><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>), 2.2),
      title: "Test The Safety Systems",
      body: "The big one. Your opener has two separate safety features, and we test both every time. More on those just below.",
    },
  },
  index: {
    eyebrow: "The Two Safety Systems We Always Test",
    title: "Photo Eyes & Auto Reverse",
    lead: "Your opener has two separate safety features, and a lot of people don't realize they're different. Both have been required since the early 1990s, and both need to work.",
    rows: [
      { label: "01", title: "Photo Eyes", desc: "Those little sensors near the floor send an invisible beam across the opening. Break the beam while the door is closing, with a foot, a bag, or a pet, and the door should stop and head back up.", icon: ico(26, <path d="M2 12h2M4 6c4-2 6 4 10 2s6-4 8-2M4 18c4-2 6 4 10 2s6-4 8-2" />) },
      { label: "02", title: "Auto Reverse", desc: "This is the opener's sense of touch. If the door meets something solid on the way down, it should reverse on its own, even if nothing crossed the beam. If a door doesn't reverse the way it should, that's a fix it now problem, especially with kids or pets.", icon: ico(26, <path d="M4 4v16M4 7c3-1 3 2 0 3M4 12c3-1 3 2 0 3M20 4v16" />) },
    ],
    calloutIcon: ico(22, (<><path d="M12 2v6M12 16v6M2 12h6M16 12h6" /><circle cx="12" cy="12" r="3" /></>), 2.2),
    callout: (
      <>
        <strong className="text-white">Why upkeep matters more in Florida.</strong> Heat breaks down cheap lubricant faster, so parts run dry and wear. Humidity rusts springs, cables, and bearings. And near the coast, salt air speeds all of it up. A door that might cruise on once a year service up north often wants a look twice a year down here, especially close to the water.
      </>
    ),
  },
  redBand: {
    badge: "Yearly Upkeep",
    title: "How Often Should You Do It?",
    lead: "For a normal household, once a year is a good rhythm. If you run the door constantly, or you live near the coast, twice a year is smarter. A quick monthly look on your own helps a lot between visits.",
  },
  whatWeDo: {
    eyebrow: "A Few Things You Can Do Yourself",
    title: "Honest Homeowner Maintenance",
    image: "svc-strut-hardware-detail.jpg",
    imageAlt: "Close up of a garage door strut and hinge, the hardware checked on every tune up",
    badge: "Twice A Year",
    items: [
      { strong: "The balance test.", rest: "With the door closed, pull the manual release, then lift it by hand to about waist height and let go. A healthy door mostly stays put. If it slides down or drifts up, the springs are out of balance, time to call." },
      { strong: "The safety test.", rest: "Lay a flat piece of two by four in the doorway and close the door. It should touch the wood and reverse within a second or two. Then wave something through the photo eye beam and watch it reverse." },
      { strong: "Light lubrication.", rest: "A little garage door lube on the rollers, hinges, and springs every few months keeps things quiet." },
      { strong: "Skip the WD 40.", rest: "Don't use a spray oil like WD 40, since it dries out and attracts grit. Use a proper garage door lubricant instead." },
      { strong: "Don't grease the tracks.", rest: "Just wipe them clean. The rollers ride the track, they don't need it slick. The spring tension and cable work are where you'll want a tech." },
    ],
    trailing: "If any of those checks feel off, that's when to call us. Estimates are free, and we tune up every major brand of door and opener.",
  },
  whyTrinity: {
    eyebrow: "Why Folks In Tampa Bay Call Trinity",
    title: "A Family Shop, Not A Call Center",
    lead: "We've been opening doors around here since 2007, across Hillsborough, Pinellas, Pasco, Hernando, Polk and the north end of Manatee.",
    cards: [
      { icon: ico(26, <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 7-5s7 2 7 5M17 11l2 2 4-4" />), title: "No Invented Problems", body: "We'll tell you honestly what your door needs and what it doesn't, and we won't invent problems to run up the bill." },
      { icon: ico(26, <path d="M13 2L4 14h6l-1 8 9-12h-6z" />), title: "Fast & Same Day", body: "Same day help, and the phones are answered till 9pm when your door quits at a bad hour." },
      { icon: ico(26, (<><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>)), title: "Licensed & Insured", body: "Bonded and insured under FL GD13010 and GDI-09484." },
      { icon: ico(26, (<><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></>)), title: "Fair, Upfront Pricing", body: "A price you hear up front, with free estimates every time." },
    ],
  },
  faqHeading: { eyebrow: "Tune Up Questions", title: "Frequently Asked" },
  faqs: [
    { q: "How often should my garage door be serviced?", a: "Once a year for most homes, twice if you use the door a lot or live near the coast. A quick monthly check on your own helps between visits." },
    { q: "What's the point if nothing's broken?", a: "That's exactly the point. A tune up keeps things from breaking, and it keeps the safety features working. It's a lot cheaper than an emergency call when a worn part finally gives out." },
    { q: "Can a tune up fix my broken spring?", a: "No. A broken spring is a repair, not maintenance. We can replace it on the same trip, though. See our spring repair page, or our repair and service page for everything else." },
    { q: "Can I just maintain it myself?", a: "You can handle the basics, and we'll show you how. The lubrication, the balance test, and the safety test are all fair game. The spring tension and cable work are where you'll want a tech, since those parts are under heavy load." },
    { q: "Do you service doors you didn't install?", a: "Of course. We tune up any major brand of door and opener, no matter who put it in." },
  ],
  closing: {
    title: "Keep Your Door Running Its Best",
    lead: "A little maintenance saves a lot of headaches. Call Trinity at (813) 279-6785 or request a free estimate, and we'll get your door on a tune up schedule that keeps it running safely and quietly for years.",
  },
};

export default function TuneUpPage() {
  return <RepairDetailLayout d={tuneUp} />;
}
