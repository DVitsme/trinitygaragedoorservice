/**
 * Rate limiting for the contact endpoint, shipped in shadow mode.
 *
 * ## Why this file exists at all
 *
 * The refusal path used to do zero I/O. It now writes to D1, and once the write ahead submission
 * log lands it will write on EVERY request, before any gate, unconditionally. D1's daily rows
 * written quota is account wide and shared with the `leads` table, so an unthrottled flood on the
 * archive could exhaust the quota and take out real lead capture. That is the failure this guards
 * against: not a bill, a lead outage caused by the thing built to stop lead loss.
 *
 * See `postmortems/2026-08-12-turnstile-lead-loss/08-storage-decision.md`.
 *
 * ## Why it refuses nobody today
 *
 * Because we wrote the rule down and then have to follow it. `06-prevention.md`, principle 1:
 * never ship a gate that can refuse a revenue action without first measuring how often it would
 * refuse a real one. The Turnstile hardening on 2026-08-03 skipped that step, was argued carefully,
 * and still turned away 31.5% of challenged visitors for nine days.
 *
 * So this ships as `"log"`. It counts, it logs, and it lets everything through. After a week of
 * real traffic the log says how many genuine submissions would have been blocked, and only then
 * does anyone get to flip it.
 *
 * ## A hardcoded constant, not an environment variable
 *
 * Same reasoning as `BOOKING_MODE` in `lib/booking.ts`. A switch that governs whether the only
 * lead form on the site can reject people belongs in version control, where changing it is a
 * reviewable diff with a commit message, not in a dashboard where it can be changed at 2am with no
 * record. It is also one less thing that can be absent at runtime and fail in the wrong direction.
 */

/**
 * `off`     the limiter is not called at all
 * `log`     the limiter is called and the verdict is logged, but nothing is ever refused
 * `enforce` an over limit request is refused with a 429
 */
export type RateLimitMode = "off" | "log" | "enforce";

/**
 * ⚠️ **Currently `"log"`. Do not move this to `"enforce"` without doing the measurement first.**
 *
 * The criteria for advancing, so this is a decision and not a mood:
 *   1. At least seven days of `"log"` on real traffic.
 *   2. Zero log lines where a submission that went on to be ACCEPTED was over the limit. A real
 *      lead tripping the limiter means the threshold is wrong, and the threshold moves, not the
 *      mode.
 *   3. Evidence in the log that something was actually counted, so we know the binding works and
 *      an empty result means "nobody was over" rather than "the limiter never ran". Validate the
 *      instrument before trusting the null.
 *
 * If all three hold, flip to `"enforce"` in its own commit that references the log evidence.
 */
export const RATE_LIMIT_MODE: RateLimitMode = "log";

/** Mirrors `simple.limit` and `simple.period` in `wrangler.jsonc`. Kept here for the log line. */
export const RATE_LIMIT_RULE = { limit: 10, periodSeconds: 60 } as const;

export type RateLimitVerdict = {
  /** True when the caller should be refused. Always false unless the mode is `enforce`. */
  refuse: boolean;
  /** True when the request was over the limit, whatever the mode. This is the measurement. */
  overLimit: boolean;
  /** Why the limiter did not produce a verdict, when it did not. */
  skipped?: "mode_off" | "no_binding" | "no_ip" | "error";
};

const ALLOW: RateLimitVerdict = { refuse: false, overLimit: false };

/**
 * Ask the limiter about this client.
 *
 * ⚠️ **This function never throws and never fails closed.** Every error path returns "allow". A
 * limiter that is broken, unbound, or unavailable must not be able to reject a customer, because
 * the entire point of the exercise is that our own defences stop costing us leads. The worst case
 * for a broken limiter is that a flood gets through, which is the situation we are in today anyway.
 *
 * The key is the client IP. Not a cookie, which an attacker controls, and not the phone number,
 * which would let one person lock out another by guessing theirs.
 */
export async function checkRateLimit(
  limiter: { limit: (o: { key: string }) => Promise<{ success: boolean }> } | undefined,
  ip: string | null,
): Promise<RateLimitVerdict> {
  if (RATE_LIMIT_MODE === "off") return { ...ALLOW, skipped: "mode_off" };
  if (!limiter) return { ...ALLOW, skipped: "no_binding" };

  /*
    No IP means no key. Cloudflare always sets `cf-connecting-ip` on a real request, so this is
    either a local run or something odd, and neither is a reason to reject anybody.
  */
  if (!ip) return { ...ALLOW, skipped: "no_ip" };

  try {
    const { success } = await limiter.limit({ key: `contact:${ip}` });
    const overLimit = !success;
    return { refuse: overLimit && RATE_LIMIT_MODE === "enforce", overLimit };
  } catch (err) {
    // Deliberately swallowed. See the note above about never failing closed.
    console.error("[contact] rate limiter unavailable, allowing:", String(err));
    return { ...ALLOW, skipped: "error" };
  }
}
