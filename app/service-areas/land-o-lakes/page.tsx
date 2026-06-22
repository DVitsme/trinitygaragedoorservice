import type { Metadata } from "next";
import { CityAreaLayout, type CityAreaData } from "@/components/blocks/city-area-layout";

export const metadata: Metadata = {
  title: "Garage Door Repair in Land O' Lakes, FL | Trinity Garage Door Service",
  description:
    "Garage door service and new door installation across Land O' Lakes, FL. Family owned, same day repairs, free estimates, 24/7 emergencies. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/service-areas/land-o-lakes/" },
};

const data: CityAreaData = {
  slug: "land-o-lakes",
  name: "Land O' Lakes",
  counties: "Pasco County",
  heroLead:
    "Land O' Lakes earned its name honestly, with more than fifty lakes around here and the town grown up around them. You'll find brand new master planned neighborhoods a few minutes from older homes that have sat on the water for decades. We work on garage doors across all of it.",
  intro: {
    title: "New Builds & Lakefront Homes",
    paras: [
      "That mix means two kinds of calls. Newer homes need their first real service once the builder grade door has a few years on it, and the older lakefront houses need repairs and replacements as their doors age. We handle both.",
      "A lot of newer homes here came with builder grade doors and openers, which are fine until the springs and rollers start showing their miles. That's usually the first repair a new house needs. On the older homes near the lakes, we see the normal wear that comes with time, plus the occasional door that's ready for a full upgrade.",
    ],
    image: "jobsite-two-techs-on-ladder.jpg",
    imageAlt: "Trinity technicians working on a garage door in Land O' Lakes",
  },
  review: { quote: "David was fast, knowledgeable, and professional on getting our garage door back in perfect working order.", name: "Jonathan B." },
  nearby: {
    title: "Up And Down Highway 41",
    lead: "Land O' Lakes runs along Highway 41, so if you're anywhere up and down that stretch, give us a call. We also serve:",
    chips: [
      { label: "Lutz", href: "/service-areas/lutz/" },
      { label: "Wesley Chapel", href: "/service-areas/wesley-chapel/" },
      { label: "Odessa" },
      { label: "North Tampa", href: "/service-areas/tampa/" },
    ],
  },
  closingLead:
    "Call (813) 279-6785 for same day garage door service in Land O' Lakes, or book a repair or free estimate online. Family owned, licensed and insured under FL GD13010 and GDI-09484, serving Tampa Bay since 2007.",
};

export default function LandOLakesPage() {
  return <CityAreaLayout d={data} />;
}
