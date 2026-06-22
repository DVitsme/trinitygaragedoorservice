import type { Metadata } from "next";
import { CityAreaLayout, type CityAreaData } from "@/components/blocks/city-area-layout";

export const metadata: Metadata = {
  title: "Garage Door Repair in Palm Harbor, FL | Trinity Garage Door Service",
  description:
    "Garage door repair and replacement in Palm Harbor, FL. Coastal homes get salt air wear, and we know how to handle it. Free estimates. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/service-areas/palm-harbor/" },
};

const data: CityAreaData = {
  slug: "palm-harbor",
  name: "Palm Harbor",
  counties: "Pinellas County",
  heroLead:
    "Palm Harbor sits up in the northwest corner of Pinellas County, right on St. Joseph Sound. It's a Gulf coast community with a real range of homes, from the golf neighborhoods around East Lake to the older waterfront streets near Ozona. We work on garage doors across all of it.",
  intro: {
    title: "Salt Air & Coastal Wear",
    paras: [
      "Living near the water here looks great and comes with one catch for your garage. Salt in the air is hard on metal, and a garage door is full of metal. Springs, rollers, hinges, cables, and the fasteners holding it all together corrode faster near the coast than they do inland.",
      "We see it constantly on Palm Harbor homes. Springs rust and weaken before their time. Hinges and rollers seize up. The bottom edge of a steel door starts to show rust. When we work on a coastal home, we can fit corrosion resistant hardware and galvanized springs that stand up to the salt longer.",
    ],
    image: "jobsite-tech-working-dusk.jpg",
    imageAlt: "Trinity technician working on a garage door at dusk in Palm Harbor",
  },
  review: { quote: "My installer Joey was on time, knowledgeable, professional but friendly.", name: "Lynn Rosenthal" },
  nearby: {
    title: "Around The North Pinellas Coast",
    lead: "If you're anywhere around the north Pinellas coast, we can help. We also serve:",
    chips: [
      { label: "Oldsmar", href: "/service-areas/oldsmar/" },
      { label: "Dunedin" },
      { label: "Tarpon Springs" },
      { label: "East Lake" },
      { label: "Clearwater" },
    ],
  },
  closingLead:
    "Call (813) 279-6785 for same day garage door service in Palm Harbor, or book a repair or free estimate online. Family owned, licensed and insured under FL GD13010 and GDI-09484, serving Tampa Bay since 2007.",
};

export default function PalmHarborPage() {
  return <CityAreaLayout d={data} />;
}
