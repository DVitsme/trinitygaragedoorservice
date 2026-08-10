import reviewData from "@/lib/google-reviews.json";
import { ReviewWall } from "./review-wall";

/**
 * The homepage review wall: rows of real Google reviews scrolling in alternating directions.
 *
 * Replaces a static grid of 4 hardcoded quotes. The point is volume: Jason asked for "a lot more"
 * reviews on the page, and continuous motion past 60 cards reads as abundance in a way a 4 card
 * grid never can.
 *
 * ── Where the reviews come from ─────────────────────────────────────────────────────────────
 * `lib/google-reviews.json`, curated from Trinity's OWN Google Business Profile Takeout export.
 * Verbatim and unedited. That provenance is what makes republishing them legal: the Google Places
 * API forbids caching review text, but this is the owner's own data, not licensed Maps content.
 * See `UPGRADE-PLAN.md` §11c. **Never edit a quote, and never add one that is not in that file.**
 *
 * ── Server component on purpose ─────────────────────────────────────────────────────────────
 * Every card renders here, on the server. Only the pause button is client side, and the cards
 * reach it as `children`, which React streams as already rendered output. Rendering cards inside
 * `ReviewWall` instead would ship the whole review set to the browser a second time.
 *
 * The animation is pure CSS (`.bt-reviews-*` in `app/globals.css`) so it costs no JavaScript.
 */

type Review = { name: string; quote: string; rating: number; date: string };
const ALL = reviewData.reviews as Review[];

const ROWS = 2;
/**
 * How many of the 60 curated reviews the marquee renders. Two rows of 15, by client direction
 * 2026-08-10 (was three rows of 15).
 *
 * Since the marquee is now clipped by the 1200px page container rather than running full bleed,
 * the loop's structural floor collapsed: one set only has to out span the ~1,136px scroller, which
 * 4 cards would satisfy. 15 per row is kept for repeat cadence, not geometry: at ~54px/s a
 * 5,400px cycle means ~100 seconds before anyone sees the same card twice, so the wall never
 * reads as a short loop. The unrendered 30 are NOT dead data: /about/reviews/ shows the full 60,
 * and rotating which 30 appear here is a one line change.
 */
const RENDER_COUNT = 30;
const REVIEWS = ALL.slice(0, RENDER_COUNT);
/**
 * Per row, so the two rows drift out of phase instead of marching in lockstep. ~45 to 54 px/s.
 * ⚠️ DURATIONS and DELAYS are coupled to ROWS by index: a row beyond their length silently falls
 * back to the CSS defaults (100s, 0s) and marches in phase with row one. Extend both if ROWS grows.
 */
const DURATIONS = ["100s", "120s"];
/**
 * Negative delays start every row mid cycle. Without them both rows begin at translateX(0) with
 * equal card widths, so the first paint is a grid marching in step, and it takes the duration
 * mismatch a minute to break the pattern. Fractions chosen to spread the phases: 0.13 and 0.34.
 */
const DELAYS = ["-13s", "-41s"];

function ReviewCard({ r }: { r: Review }) {
  return (
    <li className="flex h-[312px] w-[340px] flex-none flex-col rounded-[8px] border-2 border-ink bg-white p-[24px_22px] shadow-[0_6px_0_rgba(26,26,26,0.06)]">
      {/* Derived from the data, not hardcoded, so a future curation change cannot make the
          markup lie. Every review in the file is FIVE star today; this keeps it honest if that
          ever changes. */}
      <div className="text-[15px] tracking-[2px] text-accent" role="img" aria-label={`Rated ${r.rating} out of 5 stars`}>
        {"★".repeat(r.rating)}
      </div>
      {/*
        Fixed height plus a clamp keeps every row level, so nothing shifts as the fonts load.
        ⚠️ The width, height and clamp are tuned together against the longest curated quote (218
        characters). At 340px a line holds ~40 characters, so seven lines clears every review in
        the file with room spare. An earlier pass at 300px and six lines clipped 23 of the 60
        mid sentence, which made real reviews look like truncated filler. If you change the card
        width, the font size or the review length cap, re-measure rather than assume.
        The card deliberately does NOT shrink on mobile. A narrower card fits fewer characters per
        line, so it re-introduced the clipping at 390px that the extra width just fixed. One width
        everywhere is simpler and the card is a marquee item, not a grid cell, so a near full width
        card on a phone reads correctly.
      */}
      <p className="mt-3.5 line-clamp-7 text-[15.5px] font-medium leading-[1.6] text-[#2a2a2a]">
        &ldquo;{r.quote}&rdquo;
      </p>
      <div className="mt-auto flex items-center gap-[11px] border-t-2 border-[#eee] pt-4">
        {/* aria-hidden: the initial is decoration that otherwise reads as an orphan letter
            before every name ("A. Ann Pasquino"). */}
        <span aria-hidden="true" className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[6px] bg-ink text-[14px] font-extrabold uppercase text-white">
          {r.name[0]}
        </span>
        <div className="min-w-0">
          <div className="truncate text-[14px] font-extrabold text-ink">{r.name}</div>
          <div className="text-[12px] font-semibold text-[#6a6a6a]">via Google</div>
        </div>
      </div>
    </li>
  );
}

function Row({ items, reverse, duration, delay }: { items: Review[]; reverse: boolean; duration: string; delay: string }) {
  return (
    <div className="bt-reviews-viewport">
      <div className="bt-reviews-track">
        {/*
          TWO copies, not one. The animation moves a single <ul> by `calc(-100% - gap)`, so when the
          first set finishes travelling its own width the second is sitting exactly where it began
          and the loop is invisible. Two copies are enough because one set (15 cards, 5,380px) out
          spans the 1200px container that now clips the marquee many times over.
        */}
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            // role="list" restores list semantics that `list-style: none` strips in WebKit, so
            // VoiceOver still announces "list, 15 items".
            role="list"
            className={copy === 0 ? "bt-reviews-set" : "bt-reviews-set bt-reviews-clone"}
            // The clone is decoration. Without this every review is announced twice, and Google
            // would see each one duplicated on the page.
            aria-hidden={copy === 1 || undefined}
            inert={copy === 1 || undefined}
            style={
              {
                "--bt-rv-duration": duration,
                "--bt-rv-direction": reverse ? "reverse" : "normal",
                "--bt-rv-delay": delay,
              } as React.CSSProperties
            }
          >
            {items.map((r, i) => (
              <ReviewCard key={i} r={r} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function ReviewMarquee() {
  const per = Math.ceil(REVIEWS.length / ROWS);
  const rows = Array.from({ length: ROWS }, (_, i) => REVIEWS.slice(i * per, (i + 1) * per));

  return (
    <ReviewWall>
      <div className="flex flex-col gap-5">
        {rows.map((items, i) => (
          <Row key={i} items={items} reverse={i === 1} duration={DURATIONS[i]} delay={DELAYS[i]} />
        ))}
      </div>
    </ReviewWall>
  );
}
