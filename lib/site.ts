/**
 * Single source of truth for the homepage (and future pages). Nav/IA come from
 * site-audit/NAVBAR-SPEC.md; NAP/reviews from site-audit/01-homepage-and-company.md.
 *
 * UNCONFIRMED values (settle before the real-domain cutover — see SOURCE-MATERIAL-MAP.md):
 *   - phone: old site had 3 county numbers; this is the single number the live homepage uses
 *   - foundedYear: SETTLED 2026-07-28, the client confirmed 2007
 *   - stats: provisional figures shown with a disclaimer
 */

/**
 * Founding year. **Client decision 2026-07-28: 2007 is the answer, use it everywhere.**
 * It is the year on the logo lockup ("Opening Doors Since 2007") and on the truck livery.
 * Note for the record: BBB and Florida state records list incorporation as 2011, and Yelp says
 * 2010. The client has confirmed 2007 as the date the business started trading, so that is what
 * the site says.
 *
 * Anything expressing "years in business" must derive from this, never hardcode a number.
 */
const FOUNDED_YEAR = 2007;

export const SITE = {
  name: "Trinity Garage Door Service",
  legalName: "Trinity Garage Door Service, Inc.",
  phoneDisplay: "(813) 279-6785",
  phoneHref: "tel:18132796785",
  areaLabel: "Lutz · Tampa Bay, FL",
  license: "FL GD13010 / GDI-09484",

  /**
   * Verified 2026-07-28 from Trinity's own Housecall Pro company record, which is the address they
   * dispatch from, so it is authoritative. `CLIENT-ASKS` #3, answered.
   */
  address: {
    street: "18125 US-41 Ste 208",
    city: "Lutz",
    region: "FL",
    postalCode: "33549",
    country: "US",
    lat: 28.1372004,
    lng: -82.4625826,
  },

  /**
   * Every physical location, in the order they should be listed.
   *
   * ⚠️ **`address` above stays the PRIMARY and is not derived from this array.** It is read by the
   * LocalBusiness JSON-LD, the privacy policy and the contact page, and it is the one verified from
   * Trinity's own Housecall Pro dispatch record. Changing which entry is primary is a local SEO
   * decision, not a formatting one, so it is deliberately not a `.find(l => l.primary)` lookup that
   * somebody could flip by reordering this list.
   *
   * Oldsmar and Tampa were added 2026-08-13 at the client's request. They correspond to the second
   * and third Google Business Profiles found in the 2026-08-10 export, which between them hold 108
   * of the business's 706 reviews. Publishing a consistent name, address and phone for them is the
   * thing most likely to help Google tie those listings to this entity.
   *
   * ⚠️ **No `lat`/`lng` on the two branches, and that is deliberate.** Coordinates were never
   * supplied for them and inventing them would put a wrong pin in structured data, which is worse
   * than no pin. Add them only from a verified source.
   *
   * ⚠️ **All three carry the SAME phone**, the one number confirmed by Jason on 2026-07-29. The
   * county lines further down this file, (813) 447-3874 for Hillsborough and (727) 314-5062 for
   * Pinellas, are inherited from the old WordPress site and are listed in CLAUDE.md as UNSETTLED.
   * Do not attach them to a location here until somebody confirms they ring the right desk: a wrong
   * number in NAP data is the one mistake that actively costs calls.
   */
  locations: [
    { label: "Lutz", street: "18125 US-41 Ste 208", city: "Lutz", region: "FL", postalCode: "33549", primary: true },
    { label: "Oldsmar", street: "105 Dunbar Ave Suite H", city: "Oldsmar", region: "FL", postalCode: "34677", primary: false },
    { label: "Tampa", street: "14056 N Florida Ave", city: "Tampa", region: "FL", postalCode: "33613", primary: false },
  ],

  /**
   * ⚠️ **THE HOURS LIVE HERE AND NOWHERE ELSE. Change them here, never in a page.**
   *
   * Settled on the 2026-07-29 call. The site previously claimed **24/7 in 62 places** and its
   * JSON-LD told Google the business was open 00:00 to 23:59, seven days. Jason's position was that
   * 24/7 meant the phone gets answered, not that anyone is dispatched; Simone, with him on the
   * phone, gave the practical answer and Derrick confirmed the exact wording with her: **say the
   * phones are answered till 9pm**.
   *
   * There is residual disagreement between the two of them, which is precisely why every phrase is
   * derived from these constants. If Jason insists it really is 24/7, it is one edit here.
   *
   * ⚠️ **`bookingDays` is deliberately Monday to Friday**, not Saturday. Simone said customers can
   * book Monday to Saturday; their own API returns **242 booking windows over 21 days with zero on
   * a Saturday**. Publishing Saturday would send people to an empty calendar. Blocked on
   * `CLIENT-ASKS` #4a: either Jason adds Saturday hours in Housecall Pro, or this stays as is.
   *
   * ✅ **`opens` corrected 08:00 to 07:00 on 2026-08-10**, from the client's own Google Business
   * Profile Takeout export. **All three of their Google listings publish 07:00 to 21:00, Monday to
   * Saturday.** Two things follow:
   *   1. `closes` and `schemaDays` were already right, so only the open time was wrong. It was
   *      understating them by an hour against the listing Google itself cross-checks us on.
   *   2. It is independently corroborated by a real review in that same export: *"I called them
   *      right at 7A.M. and spoke to a gentleman"*.
   *
   * ⚠️ **The user facing wording was NOT changed.** "We answer the phones till 9pm" is the exact
   * phrasing Derrick confirmed with Simone, and 7am is an unadvertised selling point rather than a
   * correction. Raising it is `CLIENT-ASKS` #4c. Do not reword these strings without asking.
   *
   * ⚠️ **Saturday is now a live contradiction, not an open question.** Google publicly says they
   * are open Saturday 07:00 to 21:00. Housecall Pro has zero Saturday booking windows. Both cannot
   * be right, and the schema follows Google because that is the public claim they already make.
   */
  hours: {
    /** When a human answers the phone. Short form, for badges and inline CTAs. */
    phoneShort: "till 9pm",
    /** Long form, for prose and cards. */
    phoneLong: "We answer the phones till 9pm",
    /** When a customer can actually book a slot online. */
    bookingLabel: "8am to 4pm",
    bookingDays: "Monday to Friday",
    /** For JSON-LD. 24 hour clock. Matches all three Google Business Profile listings. */
    opens: "07:00",
    closes: "21:00",
    schemaDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as string[],
  },
  foundedYear: FOUNDED_YEAR,
  /** Derived, so it can never drift out of date. Recomputed on every build. */
  yearsLabel: `${new Date().getFullYear() - FOUNDED_YEAR}+`,
  instagram: "https://www.instagram.com/trinitygaragedoorservice/",
  /** Real Housecall Pro booking URL comes from env; falls back to the #book anchor. */
  bookingHref: process.env.NEXT_PUBLIC_BOOKING_URL || "#book",
  /**
   * Housecall Pro's embed script, derived from the SAME booking URL so one env var drives both the
   * modal and its fallback link and they can never point at different accounts.
   *
   * Their hosted URL is `.../book/{orgName}/{token}`, and the script takes those as query params.
   * Neither is a secret: both ship in the client supplied public snippet and in the booking link
   * already on every page. Returns "" if the URL is unset or an unexpected shape, which simply
   * means no script mounts and every Book Online button keeps its `window.open` behaviour.
   *
   * Measured cost of mounting this site wide: 5,197 bytes. It creates its iframe with
   * `loading="lazy"` behind `display:none`, so the heavy booking app is NOT fetched until the
   * modal actually opens.
   */
  bookingWidgetSrc: (() => {
    const m = (process.env.NEXT_PUBLIC_BOOKING_URL || "").match(/\/book\/([^/]+)\/([^/?#]+)/);
    return m ? `https://online-booking.housecallpro.com/script.js?token=${m[2]}&orgName=${m[1]}` : "";
  })(),
  /**
   * Google Tag Manager container, supplied by Annek's ads specialist 2026-07-29.
   *
   * Hardcoded rather than read from an env var on purpose: it is public (it ships in the page
   * source of every site that uses GTM), and a `NEXT_PUBLIC_` var is baked at BUILD time, so a
   * build that happened to miss it would silently ship a site with no tracking and no error. In
   * version control it cannot go missing.
   *
   * ⚠️ Measured 2026-07-29: `gtm.js` for this container is **158 KB gzipped while EMPTY**, and its
   * GA4 tag pulls a further ~149 KB when it fires. The site's entire third party weight before this
   * was 5,197 bytes. Browsers have partitioned the HTTP cache per site since 2020, so there is no
   * shared CDN saving. This is a real cost accepted deliberately for attribution.
   *
   * Set `NEXT_PUBLIC_GTM_DISABLE=1` to turn it off locally, so screenshot QA and dev work do not
   * fire real conversions into the client's Google Ads account.
   */
  gtmId: "GTM-MXNSKF57",
} as const;

/**
 * Public business profiles. Verified 2026-07-28 from Trinity's own listings.
 *
 * These replaced the four dead `href="#"` links the footer used to ship on every page. Facebook
 * was confirmed by rendering the page ("Trinity Garage Door Service, LLC | Lutz FL"); the Yelp URL
 * is the one supplied by the client. BBB, Angi and HomeAdvisor sit behind bot protection so they
 * cannot be re-checked by script, but each was sourced from a page that rendered successfully and
 * served that business's own images.
 *
 * NOTE: there is no LinkedIn *company* page. Jason has a personal profile
 * (linkedin.com/in/jason-grunder-1419a53a) which is deliberately NOT linked as a business profile.
 * Two duplicate listings exist (a second Yelp page and a second Facebook page) and should be
 * claimed/merged by the client, since split listings dilute local SEO.
 */
export const SOCIAL = {
  instagram: "https://www.instagram.com/trinitygaragedoorservice/",
  facebook: "https://www.facebook.com/TrinityGarageDoorServiceLLC/",
  google: "https://maps.google.com/?cid=10290920847269897858",
  yelp: "https://www.yelp.com/biz/trinity-garage-door-service-inc-lutz-3",
  bbb: "https://www.bbb.org/us/fl/lutz/profile/garage-doors/trinity-garage-door-service-inc-0653-90160231",
  angi: "https://www.angi.com/companylist/us/fl/lutz/trinity-garage-door-service-inc-reviews-6578196.htm",
  /** Not linked in the footer today, kept here so it is not lost. */
  homeAdvisor: "https://www.homeadvisor.com/rated.TrinityGarageDoor.89828475.html",
  nextdoor: "https://nextdoor.com/pages/trinity-garage-door-service-inc-tampa-fl/",
  /** Deep link that opens the Google review form for this place. */
  googleWriteReview: "https://search.google.com/local/writereview?placeid=ChIJC6icp3C5wogRgiYvqfyx0I4",
} as const;

/**
 * The three county lines, printed on Trinity's own Nextdoor flyer and listed on BBB.
 *
 * `SITE.phoneDisplay` (the Pasco line) is still the single number used sitewide. Whether the site
 * should route by county everywhere is an open client decision, so for now these are surfaced on
 * the Contact page only. See CLIENT-ASKS.md item 1.
 *
 * Cities are mapped from AREAS below: Tampa + Lutz = Hillsborough, Land O Lakes + Wesley Chapel =
 * Pasco, Palm Harbor + Oldsmar = Pinellas. (Lutz straddles Hillsborough and Pasco.)
 */
export const COUNTY_PHONES = [
  { county: "Hillsborough", cities: "Tampa, Lutz", display: "(813) 447-3874", href: "tel:18134473874" },
  { county: "Pasco", cities: "Land O Lakes, Wesley Chapel", display: "(813) 279-6785", href: "tel:18132796785" },
  { county: "Pinellas", cities: "Palm Harbor, Oldsmar", display: "(727) 314-5062", href: "tel:17273145062" },
] as const;

/** Service types for the contact / free-estimate form. */
/**
 * The optional "what do you need help with" select on the lead form.
 *
 * Agreed on the 2026-07-29 call and then missed in the build. Derrick at 12:28: *"Do you want to
 * add in then a small section, a select about what they want, just not make it required?"* Lloyd had
 * asked for it a few minutes earlier: *"maybe their concerns are repair or maybe installations."*
 * Wired up for the first time on 2026-08-01; until then this constant had zero importers.
 *
 * ⚠️ **No prices, and not a package picker.** That is Jason's line and it is specifically about
 * price on screen: *"I don't want to scare people... they may just call around and say what are you
 * charging."* Naming a service is fine. Attaching a number to it is not.
 *
 * "Off track" was hyphenated here while nothing rendered it. It is user facing now, so it follows
 * the no dashes rule in `copy/services/_VOICE-AND-RULES.md` like the rest of the site.
 */
/**
 * ⚠️ Order and wording are deliberate. The first version led with "Garage door repair", which is a
 * SUPERSET of the three options under it. Combined with primacy effects that one entry would have
 * quietly absorbed the specific picks, and the field would have reported almost nothing beyond
 * "repair", which we already knew from the CTA. The specific causes now come first, most common
 * break first, and the catch all sits after them as "Another repair".
 */
export const SERVICE_OPTIONS = [
  "Spring repair",
  "Opener repair",
  "Off track repair",
  "Another repair",
  "New installation",
  "Door replacement",
  "Not sure / something else",
] as const;

/** Provisional homepage stats (shown with a "figures provisional" disclaimer). */
export const STATS = [
  { value: String(new Date().getFullYear() - FOUNDED_YEAR), accent: "+", label: "Years of Service" },
  { value: "12k", accent: "+", label: "Doors Serviced" },
  { value: "5.0", accent: "★", label: "Average Rating" },
  { value: "6", accent: "", label: "Cities Covered" },
] as const;

/**
 * Counties for `areaServed` in the LocalBusiness schema.
 *
 * Source: the client's own Google Business Profile export, 2026-08-10. Their **Tampa** listing
 * declares its service area as exactly these five counties, which is the most authoritative public
 * statement of coverage that exists, and it is the record Google cross-checks our markup against.
 *
 * Replaces an `areaServed` of six cities, which described 6 of the 44 towns actually covered.
 *
 * ⚠️ **Manatee is deliberately ABSENT**, even though the site now has a North Manatee page. None of
 * their three Google listings names Manatee or Sarasota anywhere, so asserting it here would put our
 * markup in direct conflict with their own Google record. Add it once `CLIENT-ASKS` #6b is answered
 * and the listings are updated to match, not before.
 */
export const COUNTIES_SERVED = [
  "Hillsborough County",
  "Pinellas County",
  "Pasco County",
  "Hernando County",
  "Polk County",
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
  { label: "Emergency Repair", href: "/services/repair/emergency/" },
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

/*
 * Removed 2026-07-27: the `BRANDS` and `REVIEWS` exports.
 *   - BRANDS was superseded by BRAND_CATALOG (below), which carries the corrected
 *     install-vs-service split plus a door/opener category.
 *   - REVIEWS held four fabricated sample quotes and was superseded by GOOGLE_REVIEWS,
 *     the 8 real named Google reviews.
 * Both had zero importers. They are gone rather than left as competing second sources of
 * truth for brand and review content, which is a live footgun when editing copy.
 */

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
  blog: "/resources/blog/",
  safetyTips: "/resources/safety-tips/",
  troubleshooting: "/resources/troubleshooting/",
  /**
   * ⚠️ **Do not link to this directly.** With `BOOKING_MODE` set to `"form"` in `lib/booking.ts`
   * the route 301s away and its page is unreachable, so a CTA pointing here costs a redirect hop
   * and lands somewhere the label did not promise. Call `requestHref()` instead: it follows the
   * mode, so the same call site works in both. This constant is what `requestHref` and the sitemap
   * return to when booking comes back.
   */
  bookRepair: "/book-a-repair/",
  /**
   * The primary nav CTA since 2026-08-01. Labelled "Request Service": it names the action, matches
   * the destination's own "Request My Callback" button, and avoids promising a calendar the way
   * "Book a Repair" does now that this leads to a callback form rather than to booking.
   *
   * ⚠️ The URL deliberately stays `/get-service/`. Only the wording changed. Renaming the route
   * would break the verified 301 map, the sitemap, and every Google Ads final URL Lloyd is running.
   * Same page as `estimate` below, without the `?intent=estimate` flag that retitles it.
   */
  getStarted: "/get-service/",
  estimate: "/get-service/?intent=estimate",
} as const;

export const HOURS = {
  office: "Mon to Sat, 7am to 9pm",
  sunday: "Closed Sundays",
  emergency: "Phones answered till 9pm",
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
  /**
   * ⚠ The only entry here that is NOT from the verified Housecall Pro zone. Added 2026-08-10 by
   * client direction, and scoped to the three zips north of the Manatee River only. See the
   * _source note in lib/service-area-zips.json and CLIENT-ASKS #6b.
   */
  { name: "North Manatee", slug: "manatee-county", county: "Manatee", blurb: "The towns north of the Manatee River, Palmetto, Parrish and Ellenton, where new construction has come in fast." },
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

/** Per-route chrome config (handoff G10/G11): active nav, header/sticky CTA, footer variant. */
export type NavConfig = {
  activeNav: "services" | "areas" | "about" | "contact" | null;
  headerCta: "repair" | "estimate";
  footerLinks: "services" | "doors";
  footerBottom: "social" | "legal";
};

export function getNavConfig(pathname: string): NavConfig {
  const p = pathname || "/";
  const isDoors = p.startsWith("/doors");
  const isServices = p.startsWith("/services") || isDoors;
  const isAreas = p.startsWith("/service-areas");
  const isAbout = p.startsWith("/about");
  const isContact = p.startsWith("/contact");
  return {
    activeNav: isAreas ? "areas" : isAbout ? "about" : isContact ? "contact" : isServices ? "services" : null,
    headerCta: isDoors ? "estimate" : "repair",
    footerLinks: isDoors ? "doors" : "services",
    footerBottom: p === "/" || isAbout ? "social" : "legal",
  };
}
