/**
 * Single source of truth for the homepage (and future pages). Nav/IA come from
 * site-audit/NAVBAR-SPEC.md; NAP/reviews from site-audit/01-homepage-and-company.md.
 *
 * UNCONFIRMED values (settle before the real-domain cutover — see SOURCE-MATERIAL-MAP.md):
 *   - phone: old site had 3 county numbers; this is the single number the live homepage uses
 *   - foundedYear: logo says 2007; state records say 2011
 *   - stats: provisional figures shown with a disclaimer
 */

export const SITE = {
  name: "Trinity Garage Door Service",
  legalName: "Trinity Garage Door Service, Inc.",
  phoneDisplay: "(813) 279-6785",
  phoneHref: "tel:18132796785",
  areaLabel: "Lutz · Tampa Bay, FL",
  license: "FL GD13010 / GDI-09484",
  foundedYear: 2007,
  yearsLabel: "18+",
  instagram: "https://www.instagram.com/trinitygaragedoorservice/",
  /** Real Housecall Pro booking URL comes from env; falls back to the #book anchor. */
  bookingHref: process.env.NEXT_PUBLIC_BOOKING_URL || "#book",
} as const;

/** Service types for the contact / free-estimate form. */
export const SERVICE_OPTIONS = [
  "Garage door repair",
  "Spring repair",
  "Opener repair",
  "Off-track repair",
  "New installation",
  "Door replacement",
  "Not sure / something else",
] as const;

/** Provisional homepage stats (shown with a "figures provisional" disclaimer). */
export const STATS = [
  { value: "18", accent: "+", label: "Years of Service" },
  { value: "12k", accent: "+", label: "Doors Serviced" },
  { value: "4.9", accent: "★", label: "Average Rating" },
  { value: "6", accent: "", label: "Cities Covered" },
] as const;

/** The six locked service-area cities (ARCHITECTURE-PROPOSAL.md). */
export const CITIES = [
  { name: "Lutz", slug: "lutz" },
  { name: "Land O' Lakes", slug: "land-o-lakes" },
  { name: "Wesley Chapel", slug: "wesley-chapel" },
  { name: "Palm Harbor", slug: "palm-harbor" },
  { name: "Oldsmar", slug: "oldsmar" },
  { name: "Tampa", slug: "tampa" },
] as const;

/** Services mega-menu (NAVBAR-SPEC.md). */
export const NAV_REPAIR = [
  { label: "24/7 Emergency Repair", href: "/services/repair/emergency/" },
  { label: "Spring Repair", href: "/services/repair/spring/" },
  { label: "Opener Repair", href: "/services/repair/opener/" },
  { label: "Off Track Repair", href: "/services/repair/off-track/" },
  { label: "Cables & Rollers", href: "/services/repair/cables-rollers/" },
  { label: "Maintenance / Tune Up", href: "/services/repair/tune-up/" },
] as const;

export const NAV_INSTALL = [
  { label: "New Installation", href: "/services/installation/" },
  { label: "Door Replacement", href: "/services/replacement/" },
] as const;

export const NAV_DOORS = [
  { label: "Door Types & Styles", href: "/doors/types/" },
  { label: "Brands (catalog)", href: "/doors/brands/" },
  { label: "Brochures", href: "/doors/brochures/" },
] as const;

export const NAV_ABOUT = [
  { label: "Our Story", href: "/about/our-story/" },
  { label: "Portfolio / Our Work", href: "/about/portfolio/" },
  { label: "Reviews", href: "/about/reviews/" },
] as const;

/**
 * 10 partner brands in carousel order. All render on uniform white cards (some logos
 * have baked-in colored blocks — see ASSET-PLACEMENT-GUIDE.md). `relationship` is for
 * the future /doors/brands/ catalog and is UNRESOLVED (hub said service-only, detail
 * pages claimed install) — confirm before that page ships.
 */
export const BRANDS = [
  { name: "Clopay", file: "brandlogo-clopay.png", relationship: "install" },
  { name: "C.H.I. Overhead Doors", file: "brandlogo-chi.png", relationship: "service" },
  { name: "Hörmann", file: "brandlogo-hormann.png", relationship: "service" },
  { name: "Amarr", file: "brandlogo-amarr.png", relationship: "service" },
  { name: "LiftMaster", file: "brandlogo-liftmaster.png", relationship: "install" },
  { name: "Chamberlain", file: "brandlogo-chamberlain.png", relationship: "service" },
  { name: "Genie", file: "brandlogo-genie.png", relationship: "service" },
  { name: "Craftsman", file: "brandlogo-craftsman.png", relationship: "service" },
  { name: "Linear", file: "brandlogo-linear.png", relationship: "service" },
  { name: "Wayne Dalton", file: "brandlogo-wayne-dalton.jpg", relationship: "service" },
] as const;

/**
 * Reviews. These are the placeholder SAMPLES the live homepage ships ("Live Google
 * reviews syncing soon"). The 8 real named Google reviews are in
 * site-audit/01-homepage-and-company.md — swap them in (or wire a live feed) later.
 */
export const REVIEWS = [
  { quote: "Called at 7am with a snapped spring, fixed by lunch. Fair price, no pressure.", name: "Sarah M.", city: "Lutz", initial: "S" },
  { quote: "Door came off the track and wouldn't budge. Same day fix, smoother than ever.", name: "Mike R.", city: "Tampa", initial: "M" },
  { quote: "New door looks fantastic and the crew cleaned up everything. Easy to schedule.", name: "Dana K.", city: "Oldsmar", initial: "D" },
  { quote: "Honest, on time, and the price quoted was the price I paid. Highly recommend.", name: "Carlos V.", city: "Wesley Chapel", initial: "C" },
] as const;

/** Instagram grid tiles (real job-site photos). */
export const IG_TILES = [
  { file: "jobsite-tech-at-residential-garage.jpg", alt: "Trinity tech at a residential garage" },
  { file: "jobsite-tech-installing-opener.jpg", alt: "Trinity tech installing an opener" },
  { file: "jobsite-two-techs-on-ladder.jpg", alt: "Two Trinity techs on a ladder" },
  { file: "jobsite-tech-crouching-repair.jpg", alt: "Trinity tech on a hands-on repair" },
  { file: "jobsite-tech-working-dusk.jpg", alt: "Trinity tech working at dusk" },
  { file: "team-with-branded-banner.jpg", alt: "Trinity team with branded banner" },
] as const;

/** Helper for files copied into public/assets/. */
export const asset = (file: string) => `/assets/${file}`;

/* ────────────────────────────────────────────────────────────────────────
   Design-handoff centralized data (handoff 02 + G13). New/additive exports
   used by the Bold Trade rebuild; the older exports above stay until the
   original homepage/sections are migrated to the new blocks.
   ──────────────────────────────────────────────────────────────────────── */

/** Every internal href in one place so a dead link can't slip through (handoff F2). */
export const ROUTES = {
  home: "/",
  services: "/services/",
  repair: "/services/repair/",
  emergency: "/services/repair/emergency/",
  spring: "/services/repair/spring/",
  opener: "/services/repair/opener/",
  offTrack: "/services/repair/off-track/",
  cablesRollers: "/services/repair/cables-rollers/",
  tuneUp: "/services/repair/tune-up/",
  installation: "/services/installation/",
  replacement: "/services/replacement/",
  serviceAreas: "/service-areas/",
  doorTypes: "/doors/types/",
  brands: "/doors/brands/",
  brochures: "/doors/brochures/",
  aboutStory: "/about/our-story/",
  portfolio: "/about/portfolio/",
  reviewsPage: "/about/reviews/",
  contact: "/contact/",
  privacy: "/privacy-policy/",
  faq: "/resources/faq/",
  bookRepair: "/get-service/?intent=repair",
  estimate: "/get-service/?intent=estimate",
} as const;

export const HOURS = {
  office: "Mon to Sat, 7am to 9pm",
  sunday: "Closed Sundays",
  emergency: "24/7 for emergencies",
} as const;

/** Services-hub cards (handoff 03 Services hub). Icons are lucide-react names. */
export const SERVICES = [
  { title: "Garage Door Installation", href: ROUTES.installation, blurb: "New doors for replacements and new builds, measured and set right.", icon: "Wrench" },
  { title: "Repair & Service", href: ROUTES.repair, blurb: "Springs, cables, rollers, tracks, and openers, fixed the same day.", icon: "Settings" },
  { title: "Off Track Repair", href: ROUTES.offTrack, blurb: "Doors that jumped the track, back on safely and balanced.", icon: "AlertTriangle" },
  { title: "Door Replacement", href: ROUTES.replacement, blurb: "When a door is past saving, an honest upgrade that fits your home.", icon: "DoorClosed" },
  { title: "Spring Repair", href: ROUTES.spring, blurb: "The most common break, done safely with the right tools.", icon: "Zap" },
  { title: "Opener Repair", href: ROUTES.opener, blurb: "Openers that quit, stutter, or won't listen to the remote.", icon: "Cpu" },
] as const;

/** Six service-area cities with county + one-line blurb (from copy/service-areas). */
export const AREAS = [
  { name: "Lutz", slug: "lutz", county: "Hillsborough", blurb: "Established neighborhoods and lakefront homes about fifteen miles north of Tampa." },
  { name: "Land O Lakes", slug: "land-o-lakes", county: "Pasco", blurb: "Pasco lake country, where newer master planned communities meet older waterfront homes." },
  { name: "Wesley Chapel", slug: "wesley-chapel", county: "Pasco", blurb: "One of the fastest growing parts of the bay, full of newer homes along the interstate." },
  { name: "Palm Harbor", slug: "palm-harbor", county: "Pinellas", blurb: "A Gulf coast community on St. Joseph Sound, where salt air is rough on door hardware." },
  { name: "Oldsmar", slug: "oldsmar", county: "Pinellas", blurb: "A bayfront city at the head of Old Tampa Bay, with plenty of waterfront and canal homes." },
  { name: "Tampa", slug: "tampa", county: "Hillsborough", blurb: "The heart of the bay, where historic Hyde Park and Ybor meet new construction and waterfront South Tampa." },
] as const;

/** The 8 real, verbatim Google reviews (handoff 02; keep names exactly, incl. "E R"). */
export const GOOGLE_REVIEWS = [
  { name: "E R", source: "Google", quote: "I can't rave enough about Trinity Garage Door Service. I first had them come out in 2022 for a few repairs. They were timely, reasonably priced and extremely professional. I had to call them out again yesterday because my door would not open. I am a Healthcare worker at a hospital and needed to get to work. I called them right at 7A.M. and spoke to a gentleman that insured a two hour window of 8 to 10. By 845 one of the techs, David, was at my door. Right away he knew exactly what the problem was, a broken spring, gave me a reasonable quote and started on the job. I was able to get to work at a reasonable hour. The job was completed in 30 minutes. David was professional and efficient. You could tell that he has a number of years in his profession and most importantly, was honest with his diagnosis and recommendations. I will definitely use Trinity Garage again for my future services." },
  { name: "Tracey Dominguez", source: "Google", quote: "I found Trinity Garage Door on a Google search. I read all the positive comments and called the company. The owner was friendly and helpful. He was able to schedule my appointment for the next day. I received both text and email confirmation and notification when they were on the way. Great work and the garage is working great again. Also I was able to pay with Zelle which I prefer. Thanks so much and I would definitely recommend the company!" },
  { name: "Lynn Rosenthal", source: "Google", quote: "I had an estimate done for replacement of garage doors in the Spring of 2024 for an insurance claim. Scheduled the work 9 months later. The original quote was honored. The work was scheduled and completed in the timeframe I needed. My installer Joey was on time, knowledgeable, professional but friendly. I would recommend Trinity Garage Doors." },
  { name: "Charles Cohn", source: "Google", quote: "Jason was great no high pressure sales and very good pricing. Joey did a great installation. Very professional. I would definitely use them again" },
  { name: "Jonathan B.", source: "Google", quote: "David was fast, knowledgeable, and professional on getting our garage door back in perfect working order." },
  { name: "Ron Sompels", source: "Google", quote: "Diagnosed the problem quickly and made simple repair." },
  { name: "Kay Bennett", source: "Google", quote: "Great work! Thank you" },
  { name: "Shilen Patel", source: "Google", quote: "Great technician" },
] as const;

/**
 * Brand catalog for /doors/brands/ (handoff 02). Corrects the old site:
 * install = Clopay, C.H.I., Hörmann, Amarr (doors) + LiftMaster (opener);
 * service = Chamberlain, Genie, Craftsman, Linear (openers), Wayne Dalton (door).
 */
export const BRAND_CATALOG = [
  { name: "Clopay", logo: "brandlogo-clopay.png", category: "door", relationship: "install", blurb: "North America's largest residential door maker. Value steel doors and custom faux wood carriage doors alike, with Intellicore insulation and WindCode rated models." },
  { name: "C.H.I. Overhead Doors", logo: "brandlogo-chi.png", category: "door", relationship: "install", blurb: "A dealer favorite known for solid build quality, with a convincing wood look on steel." },
  { name: "Hörmann", logo: "brandlogo-hormann.png", category: "door", relationship: "install", blurb: "A German maker building doors since 1935. The premium, design forward choice." },
  { name: "Amarr", logo: "brandlogo-amarr.png", category: "door", relationship: "install", blurb: "A mainstream brand with a big range of styles and hurricane rated models specified all over Florida." },
  { name: "LiftMaster", logo: "brandlogo-liftmaster.png", category: "opener", relationship: "install", blurb: "The professional opener we install most, with the myQ app and battery backup models." },
  { name: "Chamberlain", logo: "brandlogo-chamberlain.png", category: "opener", relationship: "service", blurb: "LiftMaster's retail sibling, made by the same company and running the same myQ app." },
  { name: "Genie", logo: "brandlogo-genie.png", category: "opener", relationship: "service", blurb: "A long running opener brand from the home stores. Uses Aladdin Connect rather than myQ." },
  { name: "Craftsman", logo: "brandlogo-craftsman.png", category: "opener", relationship: "service", blurb: "Built by the same company that makes Chamberlain and LiftMaster, so easy for us to service." },
  { name: "Linear", logo: "brandlogo-linear.png", category: "opener", relationship: "service", blurb: "Better known for gate openers and access control. We service their garage operators and gates." },
  { name: "Wayne Dalton", logo: "brandlogo-wayne-dalton.jpg", category: "door", relationship: "service", blurb: "Really a door maker, not an opener brand. They stopped making openers, so parts are scarce. We service their doors and older openers." },
] as const;
