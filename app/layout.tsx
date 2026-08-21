import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Hanken_Grotesk } from "next/font/google";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { USE_REQUEST_FORM } from "@/lib/booking";
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
  /**
   * NO `template` here, deliberately. Every page file already ends its own title with
   * "| Trinity Garage Door Service", so a template appended the brand a SECOND time:
   * the spring repair page rendered at 103 characters as
   *   "Garage Door Spring Repair & Replacement | Trinity Garage Door Service · Trinity Garage Door Service"
   * Google truncates around 60, so the visible result was spent on a repeated brand name.
   *
   * If you ever reinstate a template, strip the brand out of all 33 page titles first.
   */
  title: "Trinity Garage Door Service | Tampa Bay Garage Door Repair & Installation",
  description:
    "Family owned garage door repair, replacement, and installation across Tampa Bay. Same day repairs, phones answered till 9pm, licensed and insured.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  /**
   * Google Tag Manager, on in production builds only.
   *
   * ⚠️ **`NODE_ENV === "production"` is the load bearing half and it was missing.** The comment here
   * used to claim GTM was "off in local dev" while the code checked nothing but
   * `NEXT_PUBLIC_GTM_DISABLE`, a variable that was set in no file anywhere in this repository. So
   * `pnpm dev` and `pnpm preview` both loaded the real container and fired real conversions into the
   * client's live Google Ads account from localhost, unless whoever ran them happened to remember a
   * flag nothing told them about. During the 2026-08-12 post mortem the first preview build was
   * started without it and had to be killed and rebuilt.
   *
   * The inverse direction is worse and is why the env var is kept as well as the NODE_ENV check
   * rather than replaced by it. `NEXT_PUBLIC_*` is inlined at BUILD time, so a stray
   * `NEXT_PUBLIC_GTM_DISABLE=1` in a deploy shell would ship production with **no conversion
   * tracking at all**, silently, with a green build and no error anywhere. That is now a deliberate
   * two step: you have to be in a production build AND not have set the escape hatch.
   *
   * ⚠️ **Do not "simplify" this by dropping either half.** NODE_ENV alone removes the ability to
   * disable tags in a production build for a screenshot pass; the env var alone is what shipped the
   * bug above. `next build` sets NODE_ENV to production, `next dev` sets it to development, and
   * `pnpm preview` runs a production build, which is why the escape hatch still has to exist.
   */
  /**
   * ⚠️ **Tags are OFF by default and the DEPLOY turns them on. Do not invert this back.**
   *
   * This was `NODE_ENV === "production" && NEXT_PUBLIC_GTM_DISABLE !== "1"`, and the comment above
   * it claimed that meant tags were off in local dev. That was true of `next dev` and of nothing
   * else. **`next start` and `pnpm preview` both set `NODE_ENV=production`**, and those are the two
   * commands this project actually uses to verify UI work, because CLAUDE.md says never to trust
   * `next dev` for visual QA. So the guard protected the one path nobody uses.
   *
   * It cost real data on 2026-08-13: a plain `pnpm build` followed by roughly ten headless page
   * loads for screenshots fired that many Google Ads and Bing UET pageviews into the client's live
   * container. Silent, and not reversible.
   *
   * **Why opt in rather than a better opt out.** Both directions can fail silently, so the question
   * is which failure you can see. A forgotten disable pollutes the client's analytics invisibly and
   * permanently. A forgotten enable ships production with no tracking, which is loud the moment
   * anybody looks at the rendered HTML, and it is checked after every deploy.
   *
   * **The flag lives in the `deploy` and `upload` scripts in `package.json`, not in a shell or a
   * dashboard**, so it travels with the only two commands that can put this in front of a customer
   * and it cannot be left out of a hurried release. `preview` deliberately does NOT set it.
   *
   * ⚠️ **The residual risk, stated plainly:** if somebody runs `pnpm build` and then deploys that
   * artifact by some other route, production ships with no tracking. The post deploy check is what
   * catches it, so do not remove that step:
   *
   *     curl -s https://trinitygaragedoorservice.com/get-service/ | grep -c GTM-
   *
   * It must be non zero. Zero means the tags are gone and Lloyd's conversion data has stopped.
   */
  const gtmEnabled = Boolean(SITE.gtmId) && process.env.NEXT_PUBLIC_GTM_ENABLE === "1";

  return (
    <html lang="en" className={hanken.variable}>
      {/*
        Google Tag Manager, via Next's official component rather than the raw snippet the ads
        specialist supplied. Verified against the package source: it emits a byte equivalent
        dataLayer init, the same `gtm.start` timestamp and the same `event: 'gtm.js'` push, so his
        tags and triggers behave exactly as they would with his paste. The difference is that it
        loads `afterInteractive` instead of blocking head parse, which is what keeps the speed he
        complimented. Placement as a sibling of <body> is what Next's own example does.
      */}
      {gtmEnabled && <GoogleTagManager gtmId={SITE.gtmId} />}
      <body>
        {/*
          The <noscript> fallback, which @next/third-parties does NOT include. Google still ships it
          as standard and GOV.UK measured JS failing on about 1.1% of visits, so it is worth the two
          lines. Safe in React: <noscript> contents are inert, there is nothing to hydrate.
        */}
        {gtmEnabled && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${SITE.gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
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
        {/*
          Housecall Pro's booking widget, mounted ONCE for the whole site.

          ⚠️ **Not mounted today.** `BOOKING_MODE` in lib/booking.ts is "form", so booking CTAs are
          links to our own request form pages and this script would load for nothing. The mount is
          kept, not deleted: the client expects to want booking back, and flipping that one constant
          (plus NEXT_PUBLIC_BOOKING_URL) restores this and every button with it.

          ⚠️ The `USE_REQUEST_FORM` guard is what actually stops it, NOT the absence of the env var.
          `NEXT_PUBLIC_BOOKING_URL` is still set in .env.local, so `bookingWidgetSrc` is still a real
          URL and this shipped the script, plus a `<link rel="preload">` for it, on every page after
          the buttons had already stopped using it. Caught by grepping the built HTML rather than the
          source, which is the only place it was visible.

          When it IS mounted: every "Book Online" button goes through
          components/book-online-button.tsx, which calls the global this defines; without it those
          buttons still work, they just open a new tab instead.

          `afterInteractive` rather than `lazyOnload`: it is only 5,197 bytes and it creates its
          iframe with loading="lazy" behind display:none, so the booking app itself is not fetched
          until someone opens the modal. Loading it early costs almost nothing and avoids a window
          where an early click falls back to a new tab.

          The script reads its own token and orgName off this src, so buttons need no data-* props.
          It does NOT bind any click handlers of its own (verified against their source), which is
          why our button keeps its own handler and styling.
        */}
        {!USE_REQUEST_FORM && SITE.bookingWidgetSrc && (
          <Script src={SITE.bookingWidgetSrc} strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
