import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** 3- or 4-col grid that collapses 3->2->1 / 4->2->1 at 920/560 (handoff 02 + G1). */
export function CardGrid({ cols = 3, className, children }: { cols?: 3 | 4; className?: string; children: ReactNode }) {
  const g = cols === 4 ? "grid-cols-4 max-nav:grid-cols-2 max-xs:grid-cols-1" : "grid-cols-3 max-nav:grid-cols-2 max-xs:grid-cols-1";
  return <div className={cn("grid gap-5", g, className)}>{children}</div>;
}

/** Icon card (handoff 02): 46px accent-tinted chip + uppercase H3 + body. Light or dark. */
export function IconCard({ icon, title, children, dark = false }: { icon: ReactNode; title: ReactNode; children?: ReactNode; dark?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[8px] p-6 transition-transform hover:-translate-y-[3px]",
        dark
          ? "border border-panel-border border-t-4 border-t-accent bg-panel"
          : "border-2 border-ink bg-white hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]",
      )}
    >
      <div className="grid h-[46px] w-[46px] place-items-center rounded-[8px] bg-[rgba(184,32,42,0.1)] text-accent">{icon}</div>
      <h3 className={cn("mt-4 font-display text-[18px] font-bold uppercase leading-[1.15]", dark ? "text-white" : "text-ink")}>{title}</h3>
      {children && <p className={cn("mt-2 text-[15px] leading-[1.55]", dark ? "text-[#a8a8a8]" : "text-body")}>{children}</p>}
    </div>
  );
}

/** Number-step card (handoff 02): 52px red square with a big display numeral. */
export function NumberStepCard({ n, title, children, dark = true }: { n: number | string; title: ReactNode; children?: ReactNode; dark?: boolean }) {
  return (
    <div className={cn("rounded-[8px] p-6", dark ? "border border-panel-border bg-panel" : "border-2 border-ink bg-white")}>
      <div className="grid h-[52px] w-[52px] place-items-center rounded-[8px] bg-accent font-display text-[22px] font-black text-white">{n}</div>
      <h3 className={cn("mt-4 font-display text-[18px] font-bold uppercase leading-[1.15]", dark ? "text-white" : "text-ink")}>{title}</h3>
      {children && <p className={cn("mt-2 text-[15px] leading-[1.55]", dark ? "text-[#a8a8a8]" : "text-body")}>{children}</p>}
    </div>
  );
}
