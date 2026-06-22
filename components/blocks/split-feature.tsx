import type { ReactNode } from "react";
import { SectionHeading } from "./primitives";

/**
 * Two-column media + text with an optional accent corner badge (handoff 02).
 * `side` = which side the media sits on at desktop; stacks on mobile.
 * Used for intro splits, "what we do", crew, owner, etc.
 */
export function SplitFeature({
  media,
  side = "right",
  eyebrow,
  title,
  intro,
  badge,
  dark = false,
  children,
}: {
  media: ReactNode;
  side?: "left" | "right";
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  badge?: ReactNode;
  dark?: boolean;
  children?: ReactNode;
}) {
  const mediaEl = (
    <div className="relative">
      <div className="overflow-hidden rounded-[10px] border-2 border-ink">{media}</div>
      {badge && (
        <div className="absolute -bottom-4 -right-4 border-2 border-ink bg-accent px-[18px] py-3 font-display text-[14px] font-extrabold uppercase leading-none text-white">
          {badge}
        </div>
      )}
    </div>
  );
  const textEl = (
    <div>
      <SectionHeading eyebrow={eyebrow} title={title} intro={intro} dark={dark} />
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
  return (
    <div className="grid items-center gap-10 nav:grid-cols-[1.05fr_1fr]">
      {side === "left" ? (
        <>
          {mediaEl}
          {textEl}
        </>
      ) : (
        <>
          {textEl}
          {mediaEl}
        </>
      )}
    </div>
  );
}

/** Accent check-row list for the "what we do" checklist (handoff 03 detail recipe). */
export function CheckList({ items, dark = false }: { items: ReactNode[]; dark?: boolean }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-0.5 grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-accent text-[13px] font-black text-white">✓</span>
          <span className={dark ? "text-[15.5px] leading-[1.55] text-[#d8d8d8]" : "text-[15.5px] leading-[1.55] text-body"}>{it}</span>
        </li>
      ))}
    </ul>
  );
}
