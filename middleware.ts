import { NextResponse, type NextRequest } from "next/server";

/**
 * Ad click capture. This exists so that a lead in D1 can be traced back to the click that paid
 * for it, which is the one thing about a paid click that **cannot be reconstructed later**.
 *
 * ## Why middleware, and not three lines of JavaScript in the form
 *
 * The obvious implementation is to read `?gclid` off `window.location` when the form mounts and
 * post it. It fails twice on this site, both times silently, which is the worst way to fail:
 *
 * 1. **Client side navigation eats the query string.** A visitor lands on
 *    `/services/repair/spring/?gclid=...`, reads the page, then clicks a CTA. That is a `<Link>`,
 *    so the URL is replaced without a document load and `window.location.search` on the form page
 *    is empty. Their real path is almost always multi hop, so a form side read would capture close
 *    to nothing while appearing to work.
 * 2. **Safari caps JavaScript written cookies at 24 hours in exactly this scenario.** WebKit's ITP
 *    policy: when a page is navigated to from a classified domain (googleadservices.com) and the
 *    landing URL carries a query string, "the expiry of persistent client side cookies created on
 *    that page is 24 hours". That is the definition of an ad click. It applies to Google's own
 *    `_gcl_aw` too, because gtag writes it with `document.cookie`.
 *
 * A cookie set by an **HTTP `Set-Cookie` header from the real first party origin** is subject to
 * neither. Middleware runs on the initial document request, before any client routing exists, and
 * the browser then attaches the cookie to the same origin `POST /api/contact` automatically. It
 * also survives ad blockers, because nothing here depends on gtag having loaded.
 *
 * ⚠️ **This runs on the Cloudflare Worker, and it does run.** `wrangler.jsonc` leaves
 * `run_worker_first` at its default of false, which would normally mean static assets bypass the
 * Worker, but `.open-next/assets/` contains **zero `.html` files**: prerendered pages are served
 * *through* the Worker from OpenNext's incremental cache. Verified in the build output.
 *
 * ⚠️ **Do not add `export const config = { runtime: "nodejs" }`.** The Cloudflare adapter does not
 * support Node runtime middleware. The default edge runtime is required.
 *
 * ## Deliberate choices
 *
 * - **`httpOnly`.** No client code needs these, and it keeps them out of Microsoft Clarity's
 *   session recordings, which are running on this site as a side effect of the Bing UET tag.
 * - **90 days.** Three independent Google limits land on the same number: `_gcl_aw`'s own lifespan,
 *   the maximum click through conversion window, and the upload deadline for offline conversions.
 *   Longer is wasted storage, shorter throws away leads Google would still credit.
 * - **Last touch, not first touch.** Each new click overwrites. Google attributes to the LAST click
 *   and measures its 90 day deadline from the last click, so overwriting is the correct semantic.
 * - **`gclid` is case sensitive.** It is never lowercased, trimmed into, or normalised.
 * - **`wbraid`, not `gbraid`, is the one to expect here.** `gbraid` is for clicks that land in an
 *   iOS *app*; Trinity has no app. `wbraid` is for a click inside an iOS app that lands on a *web*
 *   page. Both are captured anyway because the column costs nothing.
 * - **`msclkid`** is Microsoft's equivalent. Bing UET is live in the same GTM container.
 */

/** The click identifiers we persist, mapped to their cookie names. */
const CLICK_IDS = {
  gclid: "tgd_gclid",
  gbraid: "tgd_gbraid",
  wbraid: "tgd_wbraid",
  msclkid: "tgd_msclkid",
} as const;

/** Cookie holding the page the ad actually landed on. No Google report will tell you this later. */
const LANDING_COOKIE = "tgd_landing";

/** 90 days, in seconds. See the note above on why this exact number. */
const MAX_AGE = 60 * 60 * 24 * 90;

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const params = req.nextUrl.searchParams;

  let sawClick = false;
  for (const [param, cookie] of Object.entries(CLICK_IDS)) {
    const value = params.get(param);
    // Length capped so a hostile or malformed URL cannot push a huge value into a cookie that is
    // then sent on every subsequent request. Real identifiers are well under this.
    if (!value || value.length > 200) continue;
    sawClick = true;
    res.cookies.set(cookie, value, {
      maxAge: MAX_AGE,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  }

  /*
    The landing page is only recorded alongside a click, not on every visit. On its own it is just
    analytics we already have; next to a click id it answers "which page did the ad money actually
    buy a visit to", which nothing in Google Ads reports once the conversion is attributed.
  */
  if (sawClick) {
    res.cookies.set(LANDING_COOKIE, req.nextUrl.pathname, {
      maxAge: MAX_AGE,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  }

  return res;
}

/**
 * Document requests only.
 *
 * Everything excluded here either cannot carry an ad click or must not pay for the check:
 * `/api/*` is same origin fetch, `_next/*` is build output, and the file extension guard covers
 * images, videos, PDFs and the brochure downloads. Running on those would burn Worker time on
 * requests that never have a query string worth reading.
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.[\\w]+$).*)"],
};
