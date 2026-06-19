"use client";

import { useEffect, useRef } from "react";

/**
 * Muted, looping background video that reliably autoplays on iOS/Safari — replaces the
 * dc-runtime `primeVideos()` behavior (force muted + call play() on mount and canplay).
 */
export function AutoplayVideo({
  src,
  poster,
  className,
}: {
  src: string;
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
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
