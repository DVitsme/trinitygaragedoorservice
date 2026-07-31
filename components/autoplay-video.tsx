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
    const go = () => {
      v.play().catch(() => {});
    };
    go();
    v.addEventListener("canplay", go, { once: true });
    return () => v.removeEventListener("canplay", go);
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
