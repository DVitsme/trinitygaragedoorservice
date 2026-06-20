import { Hero } from "@/components/sections/hero";
import { TrustStrip } from "@/components/sections/trust-strip";
import { AboutSplit } from "@/components/sections/about-split";
import { PartnerMarquee } from "@/components/sections/partner-marquee";
import { WhyUs } from "@/components/sections/why-us";
import { StatsClip } from "@/components/sections/stats-clip";
import { BeforeAfter } from "@/components/sections/before-after";
import { ServiceAreaMap } from "@/components/sections/service-area-map";
import { Reviews } from "@/components/sections/reviews";
import { BookingBand } from "@/components/sections/booking-band";
import { InstagramGrid } from "@/components/sections/instagram-grid";
import { CtaBand } from "@/components/sections/cta-band";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <AboutSplit />
      <PartnerMarquee />
      <WhyUs />
      <StatsClip />
      <BeforeAfter />
      <ServiceAreaMap />
      <Reviews />
      <BookingBand />
      <InstagramGrid />
      <CtaBand />
    </>
  );
}
