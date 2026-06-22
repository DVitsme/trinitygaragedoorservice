import type { ReactNode } from "react";
import { AutoplayVideo } from "@/components/autoplay-video";
import { cn } from "@/lib/utils";

/**
 * Full-bleed hero shell (handoff 02). Media + dark gradient overlay (driven by --ov)
 * + content (breadcrumb, eyebrow row, then page-supplied H1/lead/buttons as children).
 */
export function PhotoHero({
  media,
  breadcrumb,
  eyebrow,
  children,
  className,
}: {
  media: ReactNode;
  breadcrumb?: ReactNode;
  eyebrow?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden border-b-[5px] border-accent px-6 py-[112px] max-nav:py-[84px]", className)}>
      <div className="absolute inset-0 z-0">{media}</div>
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgb(10 10 10 / calc(var(--ov) * .78)) 0%, rgb(10 10 10 / calc(var(--ov) * .9)) 55%, rgb(10 10 10 / var(--ov)) 100%)",
        }}
      />
      <div className="relative z-[2] mx-auto max-w-[1200px]">
        {breadcrumb}
        {eyebrow && (
          <div className="mt-4 flex items-center gap-3.5">
            <span className="h-1 w-[52px] bg-accent" />
            <span className="font-sans text-[13px] font-extrabold uppercase tracking-[0.22em] text-white">{eyebrow}</span>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/** PhotoHero with an autoplaying muted/looped background video (home + stats clip). */
export function VideoHero({
  src,
  poster,
  breadcrumb,
  eyebrow,
  children,
  className,
}: {
  src: string;
  poster?: string;
  breadcrumb?: ReactNode;
  eyebrow?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <PhotoHero
      media={<AutoplayVideo src={src} poster={poster} className="h-full w-full object-cover" />}
      breadcrumb={breadcrumb}
      eyebrow={eyebrow}
      className={className}
    >
      {children}
    </PhotoHero>
  );
}
