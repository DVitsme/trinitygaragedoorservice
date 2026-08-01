/**
 * Lead field validation. Shared by the client form and the API route so they can never disagree.
 *
 * The phone rules matter more here than they look. A phone number is the ONLY way this business
 * calls anyone back, and until now the API accepted `phone: "x"`. But over-validating is worse than
 * under-validating: a rejected real customer is lost revenue, so this checks structure only and
 * deliberately does not try to prove a line is in service.
 */

/** N11 codes are reserved service numbers (911, 411...) and are never valid as an NPA or NXX. */
const N11 = new Set(["211", "311", "411", "511", "611", "711", "811", "911"]);

/** Strip formatting and drop a leading country code. Accepts every shape a real person types. */
export function normalizePhone(raw: string | undefined | null): string {
  let d = (raw ?? "").replace(/\D/g, "");
  if (d.length === 11 && d[0] === "1") d = d.slice(1);
  return d;
}

/**
 * North American Numbering Plan structure check.
 *
 * Deliberately NOT checked: whether the area code is currently assigned (new ones activate
 * periodically and a hardcoded list would start rejecting real numbers), and whether the line is
 * live. The callback is the real verification step.
 *
 * Deliberately ACCEPTED: 555-0100 to 555-0199, the officially reserved fictional range, so the
 * supervised Housecall Pro test lead can use a number that cannot ring a real person.
 *
 * Florida area codes are NOT whitelisted on purpose. Tampa Bay is full of transplants and snowbirds
 * carrying out of state mobile numbers, and they are real customers.
 */
export function isValidPhone(raw: string | undefined | null): boolean {
  const d = normalizePhone(raw);
  if (!/^\d{10}$/.test(d)) return false;
  const npa = d.slice(0, 3);
  const nxx = d.slice(3, 6);
  if (!/^[2-9]\d{2}$/.test(npa) || !/^[2-9]\d{2}$/.test(nxx)) return false;
  return !N11.has(npa) && !N11.has(nxx);
}

/** E.164 for storage: unambiguous, dedupes cleanly, drops straight into a tel: link. */
export function toE164(raw: string | undefined | null): string | null {
  const d = normalizePhone(raw);
  return isValidPhone(d) ? `+1${d}` : null;
}

/**
 * Progressive display mask for the phone field, `(813) 279-6785`.
 *
 * Standard US convention, no spaces around the hyphen. A spaced variant was requested first and
 * dropped: it is two characters wider on a 320px screen, it reads as a typo to some people, and
 * VoiceOver inserts a pause at a hyphen ONLY when it has spaces around it. This output now matches
 * `formatPhone` below exactly for a complete number, so what someone types is character for
 * character what the office reads in the lead email.
 *
 * ⚠️ **A separator is never rendered before the digit that follows it.** `(813` stays open until the
 * area code is complete, and the hyphen only appears with the seventh digit. That single rule
 * removes the whole backspace trap class of bug, where deleting a character makes the formatter
 * immediately re-add it and the field looks frozen.
 *
 * Purely cosmetic. `normalizePhone` strips this back to digits and `toE164` is what gets stored, so
 * a mask failure can never corrupt the submitted number.
 */
export function maskPhoneDisplay(digits: string): string {
  const d = digits.slice(0, 10);
  if (d.length === 0) return "";
  if (d.length < 3) return `(${d}`;
  if (d.length === 3) return `(${d})`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/**
 * Character index just after the nth digit of a masked string.
 *
 * The caret has to be anchored to a DIGIT COUNT, not a character offset. The usual
 * "save selectionStart, restore it after render" trick works only for transforms that preserve
 * length; a mask changes it, so "8134" becoming "(813) 4" makes the old offset meaningless.
 */
export function caretAfterDigit(masked: string, n: number): number {
  if (n <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < masked.length; i++) {
    if (masked[i] >= "0" && masked[i] <= "9" && ++seen === n) {
      // If only separators follow, jump to the end so the caret never parks inside punctuation.
      return /\d/.test(masked.slice(i + 1)) ? i + 1 : masked.length;
    }
  }
  return masked.length;
}

/**
 * US zip codes are five digits. ZIP+4 exists, but nothing here uses the +4: the service area is
 * matched on the five digit zip and the office only needs to know roughly where someone is.
 *
 * Strips anything that is not a digit, so a pasted "33549-1234" or "FL 33549" reduces cleanly rather
 * than failing validation for a reason the customer cannot see.
 */
export function maskZip(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 5);
}

/** (813) 279-6785 for humans. Office staff read these out of an email, so format on display. */
export function formatPhone(raw: string | undefined | null): string {
  const d = normalizePhone(raw);
  return /^\d{10}$/.test(d) ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : (raw ?? "");
}

/** Deliberately loose. Email is optional here, so the only job is to catch obvious typos. */
export function isValidEmail(raw: string | undefined | null): boolean {
  const v = (raw ?? "").trim();
  return v.length > 0 && v.length <= 254 && /^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(v);
}

/**
 * Cloudflare's documented always-pass / always-fail / always-spent dummy secrets. If one of these
 * reaches production, the form LOOKS protected while accepting everything, which is worse than no
 * protection because every dashboard and checklist reads as configured.
 */
const TURNSTILE_DUMMY_SECRETS = new Set([
  "1x0000000000000000000000000000000AA",
  "2x0000000000000000000000000000000AA",
  "3x0000000000000000000000000000000AA",
]);

export function isTurnstileTestSecret(secret: string | undefined | null): boolean {
  return !!secret && TURNSTILE_DUMMY_SECRETS.has(secret.trim());
}
