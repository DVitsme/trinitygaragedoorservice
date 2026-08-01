"use client";

import { useEffect, useRef } from "react";

/**
 * Muted, looping background video that reliably autoplays on iOS/Safari, replacing the dc-runtime
 * `primeVideos()` behaviour (force muted, then call play() on mount and on canplay).
 *
 * ⚠️ **Offer WebM first, then MP4.** The hero previously shipped a single 18.94 MB **HEVC** file.
 * Chrome and Firefox largely cannot decode HEVC, so most visitors downloaded 19 MB and saw nothing
 * but the poster, while the download saturated the connection and pushed LCP to **14.4 seconds** on
 * a throttled phone. Browsers pick the first `<source>` they can play, so the order matters.
 *
 * `preload="metadata"` is deliberate: a background loop is decoration, and it must not compete with
 * the text and the phone number for bandwidth on a mobile connection.
 */
export function AutoplayVideo({
  src,
  webm,
  poster,
  className,
}: {
  /** MP4 (H.264) fallback. Must be H.264, never HEVC, or most browsers cannot play it. */
  src: string;
  /** Optional WebM, offered first because it is smaller where supported. */
  webm?: string;
  poster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;

    /**
     * ⚠️ **Respect prefers-reduced-motion.** A silent, looping, full bleed background video is
     * exactly the kind of continuous motion that triggers symptoms for people with vestibular
     * disorders, and it runs behind the text they are trying to read. When the OS setting is on we
     * never call play(), so the poster shows as a still image and the page is completely usable.
     *
     * Wired as a listener, not a one time read, so toggling the OS setting takes effect without a
     * reload. Older Safari only has addListener, hence the fallback.
     */
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      if (mq.matches) {
        v.pause();
        // Back to the first frame, so it matches the poster rather than freezing mid motion.
        try { v.currentTime = 0; } catch { /* not seekable yet, harmless */ }
      } else {
        v.play().catch(() => {});
      }
    };

    sync();
    v.addEventListener("canplay", sync, { once: true });
    if (mq.addEventListener) mq.addEventListener("change", sync);
    else mq.addListener(sync);

    return () => {
      v.removeEventListener("canplay", sync);
      if (mq.removeEventListener) mq.removeEventListener("change", sync);
      else mq.removeListener(sync);
    };
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
      preload="metadata"
      aria-hidden="true"
      className={className}
    >
      {webm && <source src={webm} type="video/webm" />}
      <source src={src} type="video/mp4" />
    </video>
  );
}
