import type { Metadata } from "next";
import { CityAreaLayout, type CityAreaData } from "@/components/blocks/city-area-layout";

export const metadata: Metadata = {
  title: "Garage Door Repair in Lutz, FL | Trinity Garage Door Service",
  description:
    "Garage door repair, springs, openers, and new doors in Lutz, FL. Family owned, same day service, free estimates, 24/7 emergencies. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/service-areas/lutz/" },
};

const data: CityAreaData = {
  slug: "lutz",
  name: "Lutz",
  counties: "Pasco & Hillsborough",
  heroLead:
    "Lutz still feels a little bit country, even though Tampa is only about fifteen miles south. We work on garage doors all over Lutz, on the older established streets and the newer houses going up near the county line.",
  intro: {
    title: "Older Doors, Bigger Lots",
    paras: [
      "Because so much of Lutz has been settled for years, a lot of what we do here is bringing older doors and openers back to life, or replacing the ones that have finally earned their retirement. If your door is loud, slow, or sagging, it's probably not your imagination.",
      "Older doors wear out in predictable ways. Springs lose their tension and snap after years of daily use. Openers from ten or fifteen years ago start skipping or quitting. Rollers and hinges dry out and get noisy. On the bigger lots out here, we also see more detached garages and wider door openings, and we're happy to work on those too.",
    ],
    image: "jobsite-tech-at-residential-garage.jpg",
    imageAlt: "Trinity technician working on a garage door in Lutz",
  },
  review: { quote: "Diagnosed the problem quickly and made simple repair.", name: "Ron Sompels" },
  nearby: {
    title: "Around The County Line",
    lead: "Lutz sits across the Hillsborough and Pasco line, so wherever you are around there, just ask. We also take care of homeowners in:",
    chips: [
      { label: "Land O' Lakes", href: "/service-areas/land-o-lakes/" },
      { label: "Wesley Chapel", href: "/service-areas/wesley-chapel/" },
      { label: "Odessa" },
      { label: "Carrollwood" },
      { label: "North Tampa", href: "/service-areas/tampa/" },
    ],
  },
  closingLead:
    "Call (813) 279-6785 for same day garage door service in Lutz, or book a repair or free estimate online. Family owned, licensed and insured under FL GD13010 and GDI-09484, serving Tampa Bay since 2007.",
};

export default function LutzPage() {
  return <CityAreaLayout d={data} />;
}
