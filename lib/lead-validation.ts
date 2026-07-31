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
