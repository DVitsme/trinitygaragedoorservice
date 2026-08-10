"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/**
 * Pause control for the homepage review marquee.
 *
 * ⚠️ **This exists for WCAG 2.2.2 (Pause, Stop, Hide, Level A)**, which applies to anything that
 * moves automatically, runs longer than five seconds, and sits alongside other content. All three
 * are true of the review wall, so a real in page mechanism is required.
 *
 * `prefers-reduced-motion` does **not** satisfy it. That is a user agent preference, not a control
 * on the page, and most people who would benefit have never set it. CSS `:hover` does not satisfy
 * it either: it is unavailable on touch and unreachable by keyboard. Both are still implemented in
 * `globals.css` because they are good behaviour, but this button is the compliant part. Do not
 * remove it to "simplify".
 *
 * ── Why a wrapper that takes `children` ──────────────────────────────────────────────────────
 * The cards are passed in as `children` from the server component. Children rendered on the server
 * and handed to a client component are streamed as already rendered output, so the 60 reviews stay
 * out of the client JavaScript bundle. Rendering the cards inside this file instead would ship all
 * of `lib/google-reviews.json` to the browser twice, once in the HTML and once in the RSC payload.
 * Keep the card markup on the server side of this boundary.
 */
export function ReviewWall({ children }: { children: React.ReactNode }) {
  const [paused, setPaused] = useState(false);
  /**
   * Compositor animations keep ticking while scrolled out of view, and this band lives below the
   * fold, so on load it would animate unseen from the first frame. The observer pauses the rows
   * whenever the band is out of view, which is pure GPU and battery hygiene. Starts `false` so the
   * server HTML and the first client render agree; the observer corrects it immediately after
   * hydration. 200px of rootMargin restarts the rows just before they scroll in, so they are
   * already moving when seen.
   */
  const rootRef = useRef<HTMLDivElement>(null);
  const [offscreen, setOffscreen] = useState(false);
  /**
   * Start switch for the animations. The sets are created `animation-play-state: paused` and this
   * single post hydration flip unpauses all four in one style recalc, so they share one start
   * time. Without it, streamed HTML let a clone's animation clock start a few frames after its
   * primary on some loads, leaving a permanent seam offset in that row. See globals.css.
   */
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    // Read the LAST queued entry: IO delivers crossings in chronological order, and taking the
    // first can land the state inverted after a fast scroll flick crosses the boundary twice.
    const io = new IntersectionObserver(
      (entries) => setOffscreen(!entries[entries.length - 1].isIntersecting),
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="bt-reviews flex flex-col" data-reviews-ready={ready} data-reviews-paused={paused} data-reviews-offscreen={offscreen}>
      {/*
        The pause control comes FIRST in the DOM and is pushed below the rows visually with flex
        `order`. Screen reader and magnifier users then learn the control exists before wading
        through 30 cards of moving content, which is the W3C carousel guidance. Tab order is
        unaffected (nothing inside the cards is focusable).

        No `aria-pressed`. The label itself already changes between "Pause reviews" and "Play
        reviews", and adding the state attribute on top makes a screen reader announce the same
        fact twice ("Play reviews, toggle button, not pressed").
      */}
      <div className="bt-reviews-pause order-2 mt-7 flex justify-center">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-[6px] border-2 border-ink bg-white px-[18px] py-2.5 text-[13px] font-extrabold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-white"
        >
          {paused ? <Play className="h-[15px] w-[15px]" strokeWidth={2.6} aria-hidden /> : <Pause className="h-[15px] w-[15px]" strokeWidth={2.6} aria-hidden />}
          {paused ? "Play reviews" : "Pause reviews"}
        </button>
      </div>
      <div className="order-1">{children}</div>
    </div>
  );
}
