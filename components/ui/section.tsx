import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const BG = {
  white: "bg-white",
  ink: "bg-ink",
  sand: "bg-sand",
  accent: "bg-accent text-white",
} as const;

/** A full-bleed band with the standard centered 1200px container + vertical padding. */
export function Section({
  bg = "white",
  id,
  className,
  innerClassName,
  children,
}: {
  bg?: keyof typeof BG;
  id?: string;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn(BG[bg], className)}>
      <div className={cn("mx-auto max-w-[1200px] px-8 py-[92px]", innerClassName)}>{children}</div>
    </section>
  );
}

/** The eyebrow + uppercase H2 pattern used across the site. */
export function SectionHeading({
  eyebrow,
  title,
  dark = false,
  center = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  dark?: boolean;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(center && "mx-auto max-w-[640px] text-center", className)}>
      {eyebrow && (
        <div className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-accent">{eyebrow}</div>
      )}
      <h2
        className={cn(
          "m-0 mt-3 font-heading text-[clamp(26px,3.4vw,40px)] font-extrabold uppercase leading-[1.04]",
          dark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
    </div>
  );
}
