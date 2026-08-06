import type { Metadata } from "next";
import { CityAreaLayout, type CityAreaData } from "@/components/blocks/city-area-layout";

export const metadata: Metadata = {
  title: "Garage Door Repair in Tampa, FL | Trinity Garage Door Service",
  description:
    "Garage door repair, replacement, and installation across Tampa, FL. Family owned, same day service, free estimates, phones answered till 9pm. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/service-areas/tampa/" },
};

const data: CityAreaData = {
  slug: "tampa",
  name: "Tampa",
  counties: "Hillsborough County",
  heroLead:
    "Tampa is the big one, and the housing here covers everything, from cigar worker cottages in Ybor to hundred year old homes in Hyde Park, high rise condos downtown, newer suburbs in New Tampa, and waterfront estates along Bayshore. We work on garage doors across the whole city.",
  intro: {
    title: "Every Kind Of Door",
    paras: [
      "That range means we do a little of everything here. Historic homes often have older wood or carriage style doors that need careful repair or a faithful replacement. The waterfront neighborhoods deal with salt air off the bay. And new construction keeps adding homes that will need their first service before long.",
      "It depends on the neighborhood. Older parts of town have aging doors and openers, and sometimes original wood doors that owners want to keep looking right. Along the water in South Tampa, salt air corrodes springs and hardware faster. Out in the newer suburbs, it's mostly builder grade doors hitting their first repairs.",
    ],
    image: "jobsite-opener-and-spring-hardware.jpg",
    imageAlt: "Garage door opener and spring hardware on a Tampa job",
  },
  review: { quote: "David was professional and efficient.", name: "E R" },
  nearby: {
    title: "All Around The Bay",
    lead: "Tampa is a big place, so wherever you are in the city, we can usually get to you the same day. We also serve:",
    chips: [
      { label: "Lutz", href: "/service-areas/lutz/" },
      { label: "Oldsmar", href: "/service-areas/oldsmar/" },
      { label: "Carrollwood" },
      { label: "Westchase" },
    ],
  },
  closingLead:
    "Call (813) 279-6785 for same day garage door service in Tampa, or request service or a free estimate online. Family owned, licensed and insured under FL GD13010 and GDI-09484, serving Tampa Bay since 2007.",
};

export default function TampaPage() {
  return <CityAreaLayout d={data} />;
}
