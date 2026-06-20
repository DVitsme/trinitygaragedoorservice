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
