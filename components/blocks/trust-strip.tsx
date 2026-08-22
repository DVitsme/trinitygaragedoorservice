import Image from "next/image";
import Link from "next/link";
import { asset, ROUTES } from "@/lib/site";

/**
 * Dark trust strip — port of the design (handoff 02). Angi + Elite badges, Google rating,
 * red dividers, BBB A+ chip, license line.
 *
 * ⚠️ **The rating and the count now come from DIFFERENT sources. Re-check them SEPARATELY.**
 * An older version of this comment said to re-check them together, which was true when both were
 * the Lutz Google listing and is wrong now.
 *
 * **`5.0` is GOOGLE ONLY** and must never be presented as an average across platforms. Verified
 * 2026-08-10 from the client's own Google Business Profile Takeout export. Both are hand
 * maintained: Housecall Pro has no reviews endpoint, so nothing here can refresh itself.
 *
 * **`1,000+ reviews online` is a cross platform COUNT**, spanning Google, Yelp, Angi, BBB,
 * Facebook and Nextdoor. It replaced "598 reviews" on 2026-08-13 at the client's request.
 *
 * An older version of this comment ended "Do not correct this to 706", which was correct advice
 * for a Google only claim and is now superseded: the number is deliberately no longer a Google
 * figure at all. It is a threshold rather than an exact total on purpose, because a customer who
 * reviews on two platforms is counted twice and there is no way to dedupe, so an exact figure
 * would imply a precision nobody has.
 *
 * ⚠️ **This strip renders on 36 pages**, counted from the built output rather than estimated (12
 * direct importers plus `city-area-layout`, `repair-detail-layout` and `request-form-layout`), and
 * NONE of them name the six platforms.
 * That is why the count is a LINK to `/about/reviews/`, where the breakdown is stated. If you ever
 * un-link it, the claim stops being checkable from most of the site.
 *
 * JSON-LD aggregateRating stays omitted on purpose (G6) — self-serving review markup is
 * ineligible, and the rating already shows in the Business Profile where searchers see it.
 */
export function TrustStrip() {
  return (
    <div className="bg-ink">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-[26px] gap-y-[14px] px-5 py-[22px] nav:px-8">
        <Image src={asset("badge-angi-super-service-2024.png")} alt="Angi Super Service Award 2024" width={296} height={310} className="h-[58px] w-auto" />
        <Image src={asset("badge-elite.png")} alt="HomeAdvisor Elite Service" width={162} height={160} className="h-12 w-auto" />
        {/*
          ⚠️ **Plain inline text, NOT `inline-flex`. Do not "tidy" this back into a flex row.**

          It was `inline-flex items-center gap-2`, which makes the stars, the rating text and the
          link three flex items that each wrap INTERNALLY rather than the sentence reflowing. At
          320 to 372px, which includes 360px and therefore most Android phones, that rendered:

              5.0 on   |  1,000+ reviews
              ★★★★★
              Google,  |  online

          A reader sees "5.0 on 1,000+ reviews", which is the exact false claim this whole change
          exists to prevent, and it was doing it on 36 pages. Measured: badge height 45px at 360px
          against 22.5px at 375px.

          As plain text the sentence wraps like a sentence. `whitespace-nowrap` on the link keeps
          the count and the word "online" together so the claim can never be split across a line
          break either.

          The word "and" is also load bearing. Without it the construction is
          "5.0 on Google, 1,000+ reviews online", which is grammatically identical to the old
          "5.0 on Google, 598 reviews" and therefore still reads as "5.0 FROM 1,000+". The rating
          is Google only; the count is across six platforms. They are two facts, so the sentence
          has to join them like two facts.
        */}
        <span className="text-center text-[15px] font-bold text-white">
          <span className="mr-2 tracking-[1px] text-accent">★★★★★</span>
          5.0 on Google, and{" "}
          {/*
            Underline is white at 70%, not the accent red. Measured: accent `#b8202a` on the `#1a1a1a`
            strip is 2.72:1, which fails the 3:1 WCAG non text contrast threshold, and since the link
            text is the same white as the sentence around it the underline is carrying the entire
            link affordance on its own. White at 70% measures 6.90:1.
          */}
          <Link href={ROUTES.reviewsPage} className="whitespace-nowrap text-white underline decoration-white/70 decoration-2 underline-offset-[3px] hover:decoration-white">
            1,000+ reviews online
          </Link>
        </span>
        <span className="h-[26px] w-[2px] bg-accent" />
        <span className="inline-flex items-center gap-2 text-[15px] font-extrabold text-white">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-[4px] bg-white text-[11px] font-black text-[#0a4ea2]">A+</span>
          BBB Accredited
        </span>
        <span className="h-[26px] w-[2px] bg-accent" />
        <span className="text-[13px] font-semibold tracking-[0.03em] text-[#9a9a9a]">LICENSED · BONDED · INSURED · FL GD13010 / GDI-09484</span>
      </div>
    </div>
  );
}
