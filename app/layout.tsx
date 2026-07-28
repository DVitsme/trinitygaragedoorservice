import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { UtilityBar } from "@/components/sections/utility-bar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { StickyMobileBar } from "@/components/sections/sticky-mobile-bar";
import { LocalBusinessJsonLd } from "@/components/json-ld";

// Body font: self-hosted + optimized via next/font. The display face "Archivo Expanded"
// is NOT in next/font's Google catalog (only base "Archivo"), so it loads via the <link>
// below — the same way the live mockup loads it. React 19 hoists the <link> into <head>.
// (Upgrade path: self-host Archivo Expanded via next/font/local for zero external requests.)
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://trinitygaragedoorservice.com",
  ),
  title: {
    default: "Trinity Garage Door Service | Tampa Bay Garage Door Repair & Installation",
    template: "%s · Trinity Garage Door Service",
  },
  description:
    "Family owned garage door repair, replacement, and installation across Tampa Bay. 24/7 emergency service, same day repairs, licensed and insured.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={hanken.variable}>
      <body>
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[100] focus:rounded-[7px] focus:bg-ink focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo+Expanded:wght@600;700;800;900&display=swap"
        />
        <LocalBusinessJsonLd />
        <UtilityBar />
        <SiteHeader />
        <main id="content" tabIndex={-1} className="overflow-x-clip bg-white pb-[76px] nav:pb-0">{children}</main>
        <SiteFooter />
        <StickyMobileBar />
      </body>
    </html>
  );
}
