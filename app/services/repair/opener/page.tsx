import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RepairDetailLayout, type RepairDetailData } from "@/components/blocks/repair-detail-layout";

export const metadata: Metadata = {
  title: "Garage Door Opener Repair & Replacement | Trinity Garage Door Service",
  description:
    "Garage door opener trouble in Tampa Bay? Trinity repairs and replaces chain, belt, screw, and smart WiFi openers. Free estimates. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/services/repair/opener/" },
};

const ico = (size: number, paths: ReactNode, sw: number | string = 2) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {paths}
  </svg>
);

const opener: RepairDetailData = {
  canonicalPath: "/services/repair/opener/",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/" },
    { label: "Repair", href: "/services/repair/" },
    { label: "Opener Repair" },
  ],
  heroEyebrow: "Opener Repair & Replacement",
  heroImage: "svc-opener-rail-work.jpg",
  heroImageAlt: "Trinity technician servicing a garage door opener",
  h1: (
    <>
      Garage Door Opener <span className="inline-block bg-accent px-3 text-white">Repair</span>
    </>
  ),
  heroLead:
    "When the opener quits, the whole morning stops. The good news is most opener trouble is fixable, and a fair amount turns out to be a quick fix once you know what's wrong. We repair and replace openers all over Tampa Bay, every major brand.",
  formTopic: "opener-repair",
  intro: {
    eyebrow: "The Short Version",
    title: "Most Opener Trouble Is Fixable",
    paras: [
      "You're sitting in the driveway pressing the button, the door won't budge, and you're already running late. Sometimes it's the opener itself. Sometimes it's a dead remote battery or a sensor knocked out of line.",
      "We work on every major brand, chain, belt, screw, and smart WiFi units alike. We'll figure out what's actually wrong, then tell you straight whether it's a quick repair or time for a new unit.",
    ],
    image: "svc-opener-unit-in-hand.jpg",
    imageAlt: "Trinity technician at a residential garage opener",
    badge: "Same Day Service",
  },
  signs: {
    eyebrow: "Common Opener Problems",
    title: "How Openers Usually Fail",
    lead: "Openers tend to fail in pretty recognizable ways. These are the ones we hear about most.",
    cards: [
      { icon: ico(24, (<><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M4 9h16" /></>)), title: "Won't Respond", body: "You press the remote or wall button and nothing happens. Could be power, a dead remote battery, the wall switch, or the logic board inside." },
      { icon: ico(24, (<><path d="M3 12h3l2-6 4 12 2-6h3" /><path d="M18 5l3 3-3 3" /></>)), title: "Reverses On Its Own", body: "It starts down, then backs up before it reaches the floor. Nine times out of ten that's the safety sensors, knocked out of line or with a dirty lens." },
      { icon: ico(24, (<><path d="M3 8c4-2 6 2 9 0M3 14c4-2 6 2 9 0" /><path d="M15 11h6" /></>)), title: "Grinding Or Rattling", body: "A worn gear or sprocket, a loose chain, or a tired motor makes an opener loud. That noise usually warns you something's about to give." },
      { icon: ico(24, (<><path d="M12 3v12M7 10l5 5 5-5" /><path d="M5 21h14" /></>)), title: "Remote Won't Connect", body: "Dead batteries are the easy one. Past that, remotes can need reprogramming, or the antenna or receiver on the opener may be the trouble." },
      { icon: ico(24, <path d="M4 7l16 4M4 7v10l16 4V11" />), title: "Runs But Won't Move", body: "The motor hums and the carriage travels, but the door stays put. That can be a stripped gear, a broken trolley, or a disconnected arm." },
    ],
    note: {
      icon: ico(22, (<><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>), 2.2),
      title: "Try The Easy Stuff",
      body: "A few you can rule out yourself, like swapping a remote battery or wiping the sensor eyes. If it's more than that, we'll sort it out.",
    },
  },
  index: {
    eyebrow: "The Main Types Of Opener",
    title: "Chain, Belt, Screw & More",
    lead: "If you're replacing an opener, the drive type is the big decision. Each one moves the door a little differently.",
    rows: [
      { label: "01", title: "Chain Drive", desc: "A metal chain, sort of like a bike chain, pulls the door up. It's the workhorse, tough and affordable. The tradeoff is noise, so if your garage sits under a bedroom, you'll hear it.", icon: ico(26, (<><circle cx="7" cy="7" r="3" /><circle cx="17" cy="17" r="3" /><path d="M10 7h7M7 10v7" /></>)) },
      { label: "02", title: "Belt Drive", desc: "Swaps the chain for a reinforced rubber belt. Much quieter and smoother, which is why people pick it for attached garages and rooms over the garage. It costs a bit more than a chain.", icon: ico(26, (<><rect x="3" y="9" width="18" height="6" rx="3" /><path d="M7 9v6M11 9v6M15 9v6" /></>)) },
      { label: "03", title: "Screw Drive", desc: "Turns a threaded steel rod to move the door. Fewer moving parts and not much upkeep. These sit in the middle on noise and handle our heat fine.", icon: ico(26, <path d="M5 12h14M5 8h14M5 16h14M3 12h.01" />) },
      { label: "04", title: "Wall Mount", desc: "Also called a jackshaft opener, it mounts on the wall beside the door instead of up on the ceiling. It frees the ceiling for storage and runs nice and quiet, a great fit for high or cathedral style ceilings.", icon: ico(26, (<><rect x="5" y="8" width="8" height="8" rx="1" /><path d="M13 12h6M19 9v6" /></>)) },
      { label: "05", title: "Smart & WiFi", desc: "Open, close, and check the door from your phone, wherever you are. A lot run through the myQ app and alert you when the door's left up. Many newer LiftMaster and Chamberlain units build this in, and we can add it to plenty of existing setups too.", icon: ico(26, (<><path d="M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0" /><circle cx="12" cy="20" r="1" /></>)) },
    ],
    calloutIcon: ico(22, (<><path d="M12 2v6M12 16v6M2 12h6M16 12h6" /><circle cx="12" cy="12" r="3" /></>), 2.2),
    callout: (
      <>
        <strong className="text-white">Repair it or replace it?</strong> Plenty of opener problems are a straightforward repair, a new gear, a sensor realignment, a logic board, a fresh remote. Replacement makes more sense when the unit is around ten to fifteen years old, it keeps breaking, it has no safety sensors, or you want features it can't do like quiet operation, phone control, or battery backup for storm season. You'll get an honest call either way.
      </>
    ),
  },
  redBand: {
    badge: "Same Day Service",
    title: "When The Opener Quits, The Morning Stops",
    lead: "Most repairs are done the same visit, and a new opener install usually wraps up the same day. We keep common parts on the truck, so you're not left waiting with a door that won't open.",
  },
  whatWeDo: {
    eyebrow: "What We Do On A Service Call",
    title: "We Check The Whole System",
    image: "svc-opener-overhead-install.jpg",
    imageAlt: "Trinity technicians servicing a garage door opener",
    badge: "Every Brand",
    items: [
      { strong: "We go over everything.", rest: "The opener, the sensors, the wiring, the springs, and the door balance, instead of only eyeballing the part that's acting up." },
      { strong: "We tell you straight what it needs.", rest: "An honest read and a clear price before we start. No pressure, no selling you parts that are still fine." },
      { strong: "A struggling opener is often worn springs.", rest: "When the door is too heavy, the opener works overtime. We check that the door isn't the real problem." },
      { strong: "We work on every major brand.", rest: "LiftMaster, Chamberlain, Genie, Craftsman, Linear, and Wayne Dalton, so you don't have to track down a specialist." },
      { strong: "Smart setup if you want it.", rest: "We can install a WiFi opener you run from your phone, or add the feature to many units you already have." },
    ],
    trailing: "Most repairs are done the same visit, and a new install usually wraps up the same day. You get a clear explanation and a price before we touch anything, and a free estimate every time.",
  },
  whyTrinity: {
    eyebrow: "Why Folks In Tampa Bay Call Trinity",
    title: "A Family Shop, Not A Call Center",
    lead: "We've been opening doors around here since 2007, across Hillsborough, Pinellas, Pasco, Hernando, Polk and the north end of Manatee.",
    cards: [
      { icon: ico(26, <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 7-5s7 2 7 5M17 11l2 2 4-4" />), title: "No Guesswork", body: "We fix what's broken and leave the rest alone. No pressure and no upsell." },
      { icon: ico(26, <path d="M13 2L4 14h6l-1 8 9-12h-6z" />), title: "Fast & Same Day", body: "Same day help, and the phones are answered till 9pm when your door quits at a bad hour." },
      { icon: ico(26, (<><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>)), title: "Licensed & Insured", body: "Bonded and insured under FL GD13010 and GDI-09484." },
      { icon: ico(26, (<><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></>)), title: "Fair, Upfront Pricing", body: "A price you hear up front, with free estimates every time." },
    ],
  },
  faqHeading: { eyebrow: "Opener Repair Questions", title: "Frequently Asked" },
  faqs: [
    { q: "My garage door won't close and the opener light keeps blinking. What's wrong?", a: "That blinking light is usually the safety sensors. The two little eyes near the floor need a clear line of sight to each other. Check for a bin or box in the way, wipe the lenses, and nudge them back into line until the lights hold steady. If it still won't close, give us a call." },
    { q: "Is it worth repairing an old opener, or should I just replace it?", a: "Depends on the unit. If it's under ten years old and the fix is small, repair it. If it's pushing fifteen years, breaking often, or has no safety sensors, a new opener is usually the better money. We'll walk you through the honest math." },
    { q: "How long should a garage door opener last?", a: "About ten to fifteen years for most units. How often you use it and a little routine maintenance both make a difference. Keeping the door itself balanced helps too, since the opener isn't fighting a heavy door every cycle." },
    { q: "Can I control a new opener from my phone?", a: "Yep. Smart openers connect to WiFi and run through an app like myQ, so you can open or close the door and get alerts from anywhere. We can install a smart opener, or in a lot of cases add the feature to the one you already have." },
    { q: "Do you work on my brand?", a: "Most likely. We service LiftMaster, Chamberlain, Genie, Craftsman, Linear, and Wayne Dalton, among others. Tell us what you've got when you call and we'll come prepared." },
  ],
  closing: {
    title: "Let's Get That Door Opening Again",
    lead: "A cranky opener doesn't get better on its own. Call Trinity at (813) 279-6785 or request a free estimate, and we'll get a tech out, usually the same day, to fix what you've got or set you up with a new one.",
  },
};

export default function OpenerRepairPage() {
  return <RepairDetailLayout d={opener} />;
}
