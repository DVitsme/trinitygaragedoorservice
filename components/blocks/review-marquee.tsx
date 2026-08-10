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

const ROWS = 3;
/**
 * How many of the 60 curated reviews the marquee renders. 45, not 60, and the number is structural
 * rather than taste:
 *
 * The two copy loop needs one set to be at least as wide as the widest viewport, or an empty gap
 * shows at the loop point. At 340px cards + 20px gaps, 15 cards make a 5,380px set, which clears a
 * 5,120px super ultrawide with margin (a 4K monitor at 100% scaling is 3,840, so the true floor is
 * 11). The first version rendered all 60, which made the marquee 61% of the homepage DOM and ~51MB
 * of GPU layers for cards nobody could ever see at once; a viewer watches maybe 15 seconds and
 * sees 8 to 10 cards. Measured before trimming: card count had no visible frame rate cost (the
 * edge fade did), so this cut is about DOM weight and layer memory, not fps.
 *
 * The unrendered 15 are NOT dead data: /about/reviews/ shows the full 60, and rotating which 45
 * appear here is a one line change.
 */
const RENDER_COUNT = 45;
const REVIEWS = ALL.slice(0, RENDER_COUNT);
/** Per row, so the three rows drift out of phase instead of marching in lockstep. ~45 to 61 px/s. */
const DURATIONS = ["100s", "120s", "88s"];
/**
 * Negative delays start every row mid cycle. Without them all three rows begin at translateX(0)
 * with equal card widths, so the first paint is a grid marching in step, and it takes the duration
 * mismatch a minute to break the pattern. Fractions of each duration chosen to spread the phases:
 * 0.13, 0.34, 0.76 of a cycle.
 */
const DELAYS = ["-13s", "-41s", "-67s"];

function ReviewCard({ r }: { r: Review }) {
  return (
    <li className="flex h-[312px] w-[340px] flex-none flex-col rounded-[8px] border-2 border-ink bg-white p-[24px_22px] shadow-[0_6px_0_rgba(26,26,26,0.06)]">
      <div className="text-[15px] tracking-[2px] text-accent" role="img" aria-label="Rated 5 out of 5 stars">
        ★★★★★
      </div>
      {/*
        Fixed height plus a clamp keeps every row level, so nothing shifts as the fonts load.
        ⚠️ The width, height and clamp are tuned together against the longest curated quote (221
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
        <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[6px] bg-ink text-[14px] font-extrabold uppercase text-white">
          {r.name[0]}
        </span>
        <div className="min-w-0">
          <div className="truncate text-[14px] font-extrabold text-ink">{r.name}</div>
          <div className="text-[12px] font-semibold text-[#8a8a8a]">via Google</div>
        </div>
      </div>
    </li>
  );
}

function Row({ items, reverse, duration, delay, className }: { items: Review[]; reverse: boolean; duration: string; delay: string; className?: string }) {
  return (
    <div className={className ? `bt-reviews-viewport ${className}` : "bt-reviews-viewport"}>
      <div className="bt-reviews-track">
        {/*
          TWO copies, not one. The animation moves a single <ul> by `calc(-100% - gap)`, so when the
          first set finishes travelling its own width the second is sitting exactly where it began
          and the loop is invisible. Two copies are enough because one set (15 cards, 5,380px) out
          spans any viewport, including a 5,120px super ultrawide. A row of only a handful of cards
          would need three copies or the loop shows a gap on wide monitors.
        */}
        {[0, 1].map((copy) => (
          <ul
            key={copy}
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
          <Row
            key={i}
            items={items}
            reverse={i === 1}
            duration={DURATIONS[i]}
            delay={DELAYS[i]}
            // Three rows of 340px cards are ~1,000px of marquee on a phone, which is most of a
            // screen and a third of the GPU layers on exactly the devices with the least to spare.
            // Two rows still read as plenty; display:none removes the row's layers entirely.
            className={i === 2 ? "max-xs:hidden" : undefined}
          />
        ))}
      </div>
    </ReviewWall>
  );
}
