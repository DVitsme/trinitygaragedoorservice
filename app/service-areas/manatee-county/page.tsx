import type { Metadata } from "next";
import { CityAreaLayout, type CityAreaData } from "@/components/blocks/city-area-layout";

/**
 * North Manatee County. The one service-area page that is NOT drawn from the verified Housecall
 * Pro zone: it was added 2026-08-10 by client direction and covers only the three zips north of
 * the Manatee River (34221 Palmetto, 34219 Parrish, 34222 Ellenton). Everything else in the county
 * is south of the river and deliberately excluded, so the copy and the zip checker agree.
 *
 * ✅ Licence coverage ANSWERED 2026-08-10: Derrick confirmed the licence covers all of Manatee,
 * so the closing line now carries FL GD13010 and GDI-09484 like every other city page. CLIENT-ASKS
 * #6c is closed; #5b (whether those are county or state licences) remains open but no longer
 * blocks this page.
 */
export const metadata: Metadata = {
  title: "Garage Door Repair in Palmetto, Parrish & Ellenton FL | Trinity Garage Door Service",
  description:
    "Garage door repair, springs, openers and new doors in north Manatee County: Palmetto, Parrish and Ellenton. Family owned, free estimates, phones answered till 9pm. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/service-areas/manatee-county/" },
};

const data: CityAreaData = {
  slug: "manatee-county",
  name: "North Manatee County",
  counties: "Manatee County",
  heroLead:
    "Palmetto, Parrish and Ellenton sit north of the Manatee River, at the southern end of the ground we cover. It is about an hour down the interstate from our shop in Lutz, and we come out for the work that is worth the drive.",
  intro: {
    title: "Where The New Builds Are",
    paras: [
      "Parrish has gone up fast. North River Ranch alone is planned for more than six thousand homes, with Del Webb neighborhoods filling in around it, and Palmetto and Ellenton have picked up the overflow. New doors do not stay new. The calls we get from neighborhoods like these are usually an opener that has started skipping, or rollers and hinges that have gone noisy after a few Florida summers.",
      "Manatee also sits in a wind borne debris region, which is not true of every county we work in. A garage door here has to carry a Florida Product Approval rated for the local wind speed, and a replacement needs a permit. That is worth knowing before you buy a door on price alone, because the door is one of the largest openings in the house. Debby, Helene and Milton all came through in the autumn of 2024, and Milton alone accounted for more than three hundred million dollars of property damage in unincorporated Manatee.",
    ],
    /*
     * Swapped 2026-08-10 on client feedback: the previous pick (an interior ladder shot with no
     * person in frame) read as random and unbranded. This one is from Trinity's own Google
     * Business Profile posts (cached in .media-hunt/google/), resized from the 1572x2096 original.
     * Alt text describes only what is in frame; it makes no claim about where it was taken, which
     * keeps the never invent provenance rule the six older city pages break (punchlist P1).
     */
    image: "jobsite-crew-installing-door-trinity-polo.jpg",
    imageAlt: "Trinity technicians in branded shirts installing a garage door, one holding a drill",
  },
  review: { quote: "Quick response, clear communication, reasonable price.", name: "Mike Oehler" },
  nearby: {
    title: "North Of The River",
    lead: "We cover the Manatee zip codes north of the river: 34221, 34219 and 34222. If you are south of it, in Bradenton or out toward Lakewood Ranch, call and ask first rather than assume, because that is past the area we normally run.",
    chips: [
      { label: "Palmetto" },
      { label: "Parrish" },
      { label: "Ellenton" },
      { label: "Terra Ceia" },
      { label: "Rubonia" },
      { label: "Tampa", href: "/service-areas/tampa/" },
    ],
  },
  closingLead:
    "Call (813) 279-6785 for garage door service in Palmetto, Parrish or Ellenton, or request service or a free estimate online. Family owned, licensed and insured under FL GD13010 and GDI-09484, and opening doors around Tampa Bay since 2007.",
};

export default function ManateeCountyPage() {
  return <CityAreaLayout d={data} />;
}
