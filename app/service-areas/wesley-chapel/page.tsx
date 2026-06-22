import type { Metadata } from "next";
import { CityAreaLayout, type CityAreaData } from "@/components/blocks/city-area-layout";

export const metadata: Metadata = {
  title: "Garage Door Repair in Wesley Chapel, FL | Trinity Garage Door Service",
  description:
    "Garage door repair, springs, openers, and new installs in Wesley Chapel, FL. Family owned, same day service, free estimates. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/service-areas/wesley-chapel/" },
};

const data: CityAreaData = {
  slug: "wesley-chapel",
  name: "Wesley Chapel",
  counties: "Pasco County",
  heroLead:
    "Wesley Chapel has boomed in just a few years, with thousands of new homes around Wiregrass Ranch and along the State Road 54 and 56 corridors. We spend a lot of time out here, on brand new houses and on the ones that were new a few years ago and are now due for their first repairs.",
  intro: {
    title: "Newer Homes, First Repairs",
    paras: [
      "If you bought a newer home in Wesley Chapel, your garage door is probably the original builder model. Those hold up fine for a while, then the springs and the opener start to wear right around the time the house stops feeling new. We can fix or upgrade either one.",
      "With so many newer homes, the most common call here is a builder grade door hitting its first round of real wear. Worn springs, a tired opener, rollers that have gotten loud. We also handle plenty of new door installs, both on new construction and for owners who want to trade up from the basic door the builder put on.",
    ],
    image: "jobsite-tech-installing-opener.jpg",
    imageAlt: "Trinity technician servicing a garage door opener in Wesley Chapel",
  },
  review: { quote: "Jason was great no high pressure sales and very good pricing.", name: "Charles Cohn" },
  nearby: {
    title: "Along The I-75 Corridor",
    lead: "Wesley Chapel runs right along Interstate 75, so we can usually get to you quickly no matter which neighborhood you're in. We also serve:",
    chips: [
      { label: "Land O' Lakes", href: "/service-areas/land-o-lakes/" },
      { label: "Lutz", href: "/service-areas/lutz/" },
      { label: "New Tampa", href: "/service-areas/tampa/" },
      { label: "Zephyrhills" },
    ],
  },
  closingLead:
    "Call (813) 279-6785 for same day garage door service in Wesley Chapel, or book a repair or free estimate online. Family owned, licensed and insured under FL GD13010 and GDI-09484, serving Tampa Bay since 2007.",
};

export default function WesleyChapelPage() {
  return <CityAreaLayout d={data} />;
}
