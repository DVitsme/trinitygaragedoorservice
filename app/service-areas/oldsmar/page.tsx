import type { Metadata } from "next";
import { CityAreaLayout, type CityAreaData } from "@/components/blocks/city-area-layout";

export const metadata: Metadata = {
  title: "Garage Door Repair in Oldsmar, FL | Trinity Garage Door Service",
  description:
    "Garage door repair, springs, openers, and new doors in Oldsmar, FL. Family owned, same day service, free estimates, phones answered till 9pm. Call (813) 279-6785.",
  alternates: { canonical: "https://trinitygaragedoorservice.com/service-areas/oldsmar/" },
};

const data: CityAreaData = {
  slug: "oldsmar",
  name: "Oldsmar",
  counties: "Pinellas & Hillsborough",
  heroLead:
    "Oldsmar is a small city at the head of Old Tampa Bay, laid out back in 1916 by the man behind the Oldsmobile. Today it's established tree lined streets, waterfront and canal homes, and newer gated communities mixed in. We cover all of it.",
  intro: {
    title: "Bayfront, And Built To Last",
    paras: [
      "Because Oldsmar sits right on the bay, the homes closest to the water deal with salt air the same way the Gulf coast towns do. And since a good part of town has been around for decades, we also do a steady amount of replacing older doors and openers that have simply run their course.",
      "On the waterfront and canal homes, salt air wears out springs, rollers, and hardware faster, so we fit corrosion resistant parts when it makes sense. On the older inland streets, it's the usual story of doors and openers aging out and needing repair or replacement.",
    ],
    image: "jobsite-tech-crouching-repair.jpg",
    imageAlt: "Trinity technician on a garage door repair in Oldsmar",
  },
  review: { quote: "Great work and the garage is working great again.", name: "Tracey Dominguez" },
  nearby: {
    title: "Where Pinellas Meets Hillsborough",
    lead: "Oldsmar sits right where Pinellas meets Hillsborough, so we cover both sides of that line. We also serve:",
    chips: [
      { label: "Palm Harbor", href: "/service-areas/palm-harbor/" },
      { label: "Safety Harbor" },
      { label: "Westchase" },
      { label: "Citrus Park" },
      { label: "Clearwater" },
    ],
  },
  closingLead:
    "Call (813) 279-6785 for same day garage door service in Oldsmar, or request service or a free estimate online. Family owned, licensed and insured under FL GD13010 and GDI-09484, serving Tampa Bay since 2007.",
};

export default function OldsmarPage() {
  return <CityAreaLayout d={data} />;
}
