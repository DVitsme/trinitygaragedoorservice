import type { Metadata } from "next";
import { CityAreaLayout, type CityAreaData } from "@/components/blocks/city-area-layout";

/**
 * North Manatee County. The one service-area page that is NOT drawn from the verified Housecall
 * Pro zone: it was added 2026-08-10 by client direction and covers only the three zips north of
 * the Manatee River (34221 Palmetto, 34219 Parrish, 34222 Ellenton). Everything else in the county
 * is south of the river and deliberately excluded, so the copy and the zip checker agree.
 *
 * ⚠ The closing line on every other city page cites FL GD13010 and GDI-09484. Those are the
 * Hillsborough and Pasco county licences, so they are NOT repeated here. CLIENT-ASKS #5b (are
 * these county or state licences?) has to be answered before this page can make a licensing claim
 * in a sixth county. Do not "restore consistency" by pasting the other pages' closing line in.
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
    image: "jobsite-ladder-install-in-progress.jpg",
    imageAlt: "A garage door raised on its tracks during a Trinity job, seen from inside the garage",
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
    "Call (813) 279-6785 for garage door service in Palmetto, Parrish or Ellenton, or request service or a free estimate online. Family owned, and opening doors around Tampa Bay since 2007.",
};

export default function ManateeCountyPage() {
  return <CityAreaLayout d={data} />;
}
