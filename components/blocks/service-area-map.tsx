import geo from "@/lib/service-area-geo.json";
import { cn } from "@/lib/utils";

/**
 * The real Tampa Bay service area, drawn from Trinity's actual Housecall Pro zone.
 *
 * Replaces the old `ServiceAreaMapMock`, which was a decorative CSS panel (grid lines, two
 * rotated bars as "roads", a blue wedge as "water", pins at hardcoded percentages) that depicted
 * nothing. This is the dissolved outline of all 130 zip codes they actually cover, built from
 * public-domain US Census boundaries by `scripts/generate-service-area-geo.mjs`.
 *
 * Costs ~1 KB gzipped and **zero client JavaScript**: the paths arrive already projected to
 * viewBox coordinates, so no map library, no tiles, no API key and no runtime request. For scale,
 * Mapbox GL JS v3 is 499 KB gzipped before drawing a single pixel.
 *
 * ── Accessibility ──────────────────────────────────────────────────────────────────────────
 * The SVG is `aria-hidden` and the pins are deliberately NOT links. That is the documented
 * pattern for a decorative graphic: pair it with a real text list nearby (the city links that sit
 * under this map in every placement) which serves as the 1.1.1 text alternative. Making the pins
 * interactive would duplicate those links for screen reader users and risks the nested-interactive
 * conflict that `aria-hidden` on focusable content creates (a WCAG 4.1.2 failure). There are no
 * zoom or pan controls, so there is no keyboard trap and no scroll capture on mobile either.
 *
 * ⚠️ Never mark this `role="img"` and then add links inside it. Pick one.
 */
export function ServiceAreaMap({
  className,
  showLabels = true,
  caption = true,
  children,
}: {
  className?: string;
  /** City labels. Turn off where the map renders small enough that they would collide. */
  showLabels?: boolean;
  /** The corner badge. Off for tight placements. */
  caption?: boolean;
  /**
   * Overlay slot, for `ServiceAreaMapMarker`. Anything here is positioned against this root, whose
   * padding box matches the SVG exactly, so an overlay using the same viewBox lines up to the
   * pixel. Putting the marker outside this component instead would offset it by the 2px border.
   */
  children?: React.ReactNode;
}) {
  /**
   * Label placement, tuned by hand for these six towns. Land O' Lakes anchors right-to-left so it
   * does not run into Wesley Chapel, which sits at almost the same latitude 120 units east.
   */
  const anchors: Record<string, "start" | "end"> = { "Land O' Lakes": "end" };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[10px] border-2 border-ink bg-[#15161a]",
        className,
      )}
    >
      <svg viewBox={geo.viewBox} className="block h-auto w-full" aria-hidden="true" focusable="false">
        {/* County lines, drawn under the fill so the internal divisions stay legible through it */}
        {geo.counties.map((c) => (
          <path key={c.name} d={c.d} fill="none" stroke="#ffffff" strokeOpacity="0.13" strokeWidth="2.5" />
        ))}

        {/* The service area itself: all 130 zips dissolved into one outline */}
        <path
          d={geo.footprint}
          fill="#b8202a"
          fillOpacity="0.3"
          stroke="#b8202a"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {geo.cities.map((c) => {
          const anchor = anchors[c.name] ?? "start";
          const dx = anchor === "end" ? -22 : 22;
          return (
            <g key={c.slug}>
              <circle
                cx={c.x}
                cy={c.y}
                r={"hq" in c && c.hq ? 18 : 12}
                fill={"hq" in c && c.hq ? "#ffffff" : "#b8202a"}
                stroke={"hq" in c && c.hq ? "#b8202a" : "#ffffff"}
                strokeWidth={"hq" in c && c.hq ? 6 : 4}
              />
              {showLabels && (
                <text
                  x={c.x + dx}
                  y={c.y + 10}
                  textAnchor={anchor}
                  className="font-body"
                  fontSize="31"
                  fontWeight="700"
                  fill="#ffffff"
                  stroke="#15161a"
                  strokeWidth="5"
                  paintOrder="stroke"
                >
                  {c.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {children}

      {caption && (
        // Bottom RIGHT, not left: the Pinellas peninsula runs down the bottom left of the real
        // footprint, and a badge there sits on top of it.
        <div className="absolute bottom-3.5 right-3.5 flex items-center gap-2 rounded-[6px] border-2 border-accent bg-ink px-3.5 py-[9px] text-[12.5px] font-extrabold uppercase tracking-[0.04em] text-white">
          <span className="h-2 w-2 rounded-full bg-accent" /> 130 Zip Codes, 5 Counties
        </div>
      )}
    </div>
  );
}
