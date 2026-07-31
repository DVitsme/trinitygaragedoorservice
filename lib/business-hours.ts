import { SITE } from "@/lib/site";

/**
 * Is someone there right now?
 *
 * ⚠️ **Computed in the BUSINESS's timezone, never the visitor's.** This is the bug this kind of
 * widget almost always ships with. A visitor in California at 7pm sees their own clock inside
 * business hours while it is 10pm in Lutz and nobody is there. Trinity is in Florida, so everything
 * below resolves against America/New_York, which also handles daylight saving for free because
 * `Intl` knows the rules and a hardcoded UTC offset would be wrong for half the year.
 *
 * Zero network calls. The schedule is baked from `SITE.hours`, so this cannot drift from the copy
 * or from the JSON-LD.
 */

export const BUSINESS_TZ = "America/New_York";

/** Sunday = 0, matching Date.getDay(). */
const DAY_INDEX: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6,
};
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const openMinutes = toMinutes(SITE.hours.opens);
const closeMinutes = toMinutes(SITE.hours.closes);
/** The days the phones are answered, as day numbers. Derived from the same list the schema uses. */
const OPEN_DAYS = new Set(SITE.hours.schemaDays.map((d) => DAY_INDEX[d]).filter((n) => n !== undefined));

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Wall clock time in Lutz, whatever the visitor's own clock says. */
function nowInBusinessTz(now: Date): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TZ,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  // "24" appears at midnight in some environments; normalise it to 0.
  const hour = Number(get("hour")) % 24;
  return { day: DAY_INDEX[get("weekday")] ?? 0, minutes: hour * 60 + Number(get("minute")) };
}

function label12(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12}${suffix}` : `${h12}:${String(m).padStart(2, "0")}${suffix}`;
}

export type OpenState = { open: boolean; label: string };

/**
 * `null` means "do not claim anything yet", which is what renders on the server and before
 * hydration. Every page here is statically generated, so a server computed answer would be frozen
 * at build time and confidently wrong for most visitors.
 */
export function getOpenState(now: Date = new Date()): OpenState {
  const { day, minutes } = nowInBusinessTz(now);

  if (OPEN_DAYS.has(day) && minutes >= openMinutes && minutes < closeMinutes) {
    return { open: true, label: `Open now, phones answered till ${label12(closeMinutes)}` };
  }

  // Closed. Never say the word on its own beside a phone number: say when someone is back.
  if (OPEN_DAYS.has(day) && minutes < openMinutes) {
    return { open: false, label: `Opens at ${label12(openMinutes)}` };
  }
  for (let ahead = 1; ahead <= 7; ahead++) {
    const next = (day + ahead) % 7;
    if (OPEN_DAYS.has(next)) {
      const when = ahead === 1 ? "tomorrow" : DAY_NAMES[next];
      return { open: false, label: `Opens ${when} at ${label12(openMinutes)}` };
    }
  }
  return { open: false, label: `Opens at ${label12(openMinutes)}` };
}
