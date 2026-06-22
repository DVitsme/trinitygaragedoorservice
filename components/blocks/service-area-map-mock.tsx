import { cn } from "@/lib/utils";

/**
 * Decorative "Tampa Bay service area" map mock (handoff 02/03). NOT a real map — a
 * stylized dark panel: faint grid, a road, a water wedge, a dashed coverage circle,
 * four teardrop pins, and a corner label. Reused on the Services hub, Contact, About,
 * and home. Purely visual; pair it with a real map/scheduler when wired.
 */
export function ServiceAreaMapMock({ className }: { className?: string }) {
  const pins = [
    { left: "30%", top: "38%" },
    { left: "52%", top: "30%" },
    { left: "46%", top: "56%" },
    { left: "64%", top: "60%" },
  ];
  return (
    <div className={cn("relative h-[300px] overflow-hidden rounded-[10px] border-2 border-ink bg-[#15161a]", className)} aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 1px,transparent 1px 64px),repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0 1px,transparent 1px 64px)",
        }}
      />
      <div className="absolute left-[-10%] top-[24%] h-3 w-[120%] bg-[#26282f]" style={{ transform: "rotate(-8deg)" }} />
      <div className="absolute right-[-12%] top-[-10%] h-[120%] w-[44%] bg-[rgba(40,80,110,0.4)]" style={{ transform: "rotate(12deg)" }} />
      <div className="absolute left-1/2 top-[52%] h-[66%] w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-dashed border-[rgba(184,32,42,0.6)] bg-[rgba(184,32,42,0.12)]" />
      {pins.map((p, i) => (
        <span
          key={i}
          className="absolute h-[22px] w-[22px] border-2 border-white bg-accent shadow-[0_5px_12px_rgba(0,0,0,0.5)]"
          style={{ left: p.left, top: p.top, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)" }}
        />
      ))}
      <div className="absolute bottom-3.5 left-3.5 flex items-center gap-2 rounded-[6px] border-2 border-accent bg-ink px-3.5 py-[9px] text-[12.5px] font-extrabold uppercase tracking-[0.04em] text-white">
        <span className="h-2 w-2 rounded-full bg-accent" /> Tampa Bay Service Area
      </div>
    </div>
  );
}
