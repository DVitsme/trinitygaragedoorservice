import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The signature "01 / 02 / 03" index rows (handoff 02). `border-2 border-ink` list;
 * each row = big accent display label + title/desc + optional icon chip.
 * Used for repair-hub services, spring types, opener drives, off-track steps, etc.
 */
export function NumberedIndex({ rows }: { rows: { label: string; title: ReactNode; desc?: ReactNode; icon?: ReactNode }[] }) {
  return (
    <div className="overflow-hidden rounded-[10px] border-2 border-ink bg-white">
      {rows.map((r, i) => (
        <div
          key={i}
          className={cn(
            "grid items-center gap-4 p-6 nav:grid-cols-[104px_1fr_auto] max-nav:grid-cols-[64px_1fr]",
            i < rows.length - 1 && "border-b-2 border-ink",
          )}
        >
          <div className="font-display text-[clamp(30px,4vw,46px)] font-black uppercase leading-none text-accent">{r.label}</div>
          <div>
            <h3 className="font-display text-[18px] font-bold uppercase leading-[1.15] text-ink">{r.title}</h3>
            {r.desc && <p className="mt-1.5 text-[15px] leading-[1.55] text-body">{r.desc}</p>}
          </div>
          {r.icon && (
            <div className="grid h-[52px] w-[52px] place-items-center rounded-[8px] bg-[rgba(184,32,42,0.1)] text-accent max-nav:hidden">{r.icon}</div>
          )}
        </div>
      ))}
    </div>
  );
}

/** Dark callout strip that sits under a NumberedIndex (handoff 02). */
export function DarkCallout({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <div className="mt-5 flex items-start gap-3.5 rounded-[8px] bg-ink p-[22px] text-white">
      {icon && <div className="mt-0.5 flex-none text-accent">{icon}</div>}
      <p className="text-[15.5px] leading-[1.6] text-[#d8d8d8]">{children}</p>
    </div>
  );
}
