/**
 * The write ahead submission log.
 *
 * Every attempt at the contact endpoint is recorded here, before any gate, unconditionally,
 * including malformed bodies and including submissions with nothing usable in them at all. The
 * owner's requirement, in his words: "I cannot allow another situation where I cannot tell the
 * client that I do not know what happened to the form submissions. I would rather have a file
 * filled with spam than have nothing."
 *
 * Schema and the full reasoning: `db/migrations/0006_submission_log.sql`.
 * Why D1 and not R2: `postmortems/2026-08-12-turnstile-lead-loss/08-storage-decision.md`.
 *
 * ⚠️ **Nothing in this file may ever throw, and nothing may ever reject a request.** Every entry
 * point swallows its own errors. A broken archive must not become a new way to lose a lead, which
 * would be an unusually stupid way to fail given what it is for.
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";

/** Hard ceiling on a stored request body. Well under D1's 2 MB row limit, generous for a form. */
export const MAX_RAW_BODY = 32 * 1024;

/** What the route knows before it has parsed anything. */
export type AttemptContext = {
  attemptId: string;
  ray: string | null;
  ip: string | null;
  userAgent: string | null;
  referer: string | null;
  host: string | null;
  country: string | null;
};

/** What the route learns as it goes. All optional: a row is written even if none of it is known. */
export type AttemptDetail = {
  rawBody?: string;
  bodyBytes?: number;
  tokenLen?: number;
  clientError?: string;
  name?: string;
  phone?: string;
  email?: string;
  zip?: string;
  service?: string;
  source?: string;
};

export type AttemptOutcome = {
  outcome: "accepted" | "refused" | "invalid" | "rate_limited" | "error";
  gate?: string;
  status?: number;
  leadId?: number | null;
  unverifiedId?: number | null;
};

/**
 * A per attempt identifier, time sortable so a plain string sort is chronological.
 *
 * Deliberately NOT the existing `leadRef`. That is a content hash and is identical for a duplicate
 * submission on purpose, because Google Ads uses it as a `transaction_id` to collapse duplicates.
 * Reusing it here would have merged the six Wesley Chapel attempts into one line, which is exactly
 * the information the investigation needed to see.
 */
export function newAttemptId(): string {
  const t = Date.now().toString(36).toUpperCase().padStart(9, "0");
  const r = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `${t}${r}`;
}

/** Everything the route can know before it touches the body. */
export function beginAttempt(req: Request): AttemptContext {
  const h = req.headers;
  return {
    attemptId: newAttemptId(),
    ray: h.get("cf-ray"),
    ip: h.get("cf-connecting-ip"),
    userAgent: h.get("user-agent"),
    referer: h.get("referer"),
    host: h.get("host"),
    // `req.cf` is present on the Worker and absent under `next start`. Neither is worth a throw.
    country: (req as Request & { cf?: { country?: string } }).cf?.country ?? null,
  };
}

function db() {
  return getCloudflareContext().env.DB;
}

/**
 * Insert the row. Returns the row id, or null if anything at all went wrong.
 *
 * ⚠️ **Awaited by the caller, not deferred.** `after()` compiles to `waitUntil`, which is best
 * effort and is dropped if the isolate goes away. This is the one write in the system that cannot
 * be best effort, so the visitor waits for it. Measured cost is single digit milliseconds against
 * a request that already spends up to 4000ms on siteverify.
 */
export async function recordAttempt(
  ctx: AttemptContext,
  detail: AttemptDetail,
): Promise<number | null> {
  try {
    const row = await db()
      .prepare(
        `INSERT INTO submission_log
           (attempt_id, ray, ip, user_agent, referer, host, country,
            raw_body, body_bytes, token_len, client_error,
            name, phone, email, zip, service, source)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) RETURNING id`,
      )
      .bind(
        ctx.attemptId, ctx.ray, ctx.ip, ctx.userAgent, ctx.referer, ctx.host, ctx.country,
        detail.rawBody?.slice(0, MAX_RAW_BODY) ?? null,
        detail.bodyBytes ?? null,
        detail.tokenLen ?? null,
        detail.clientError ?? null,
        detail.name ?? null, detail.phone ?? null, detail.email ?? null,
        detail.zip ?? null, detail.service ?? null, detail.source ?? null,
      )
      .first<{ id: number }>();
    return row?.id ?? null;
  } catch (err) {
    /*
      LAST RESORT. Workers Logs is a different system with different failure modes, so if D1 is
      down the request is still recoverable by hand from here for the retention window. The whole
      body goes inline on purpose: a truncated log line is worse than a long one.
    */
    console.error("[contact] WAL WRITE FAILED, attempt follows", {
      attemptId: ctx.attemptId, ip: ctx.ip, err: String(err), rawBody: detail.rawBody,
    });
    return null;
  }
}

/**
 * Stamp the outcome onto a row written earlier.
 *
 * ⚠️ **This is the half that makes the log answer the actual question.** Without it the archive can
 * only say a submission arrived. "What happened to it" is the thing the owner could not answer, and
 * it is the reason an immutable object store was rejected for this job.
 */
export async function finishAttempt(id: number | null, out: AttemptOutcome): Promise<void> {
  if (id === null) return;
  try {
    await db()
      .prepare(
        `UPDATE submission_log
            SET outcome = ?, gate = ?, status = ?, lead_id = ?, unverified_id = ?
          WHERE id = ?`,
      )
      .bind(out.outcome, out.gate ?? null, out.status ?? null, out.leadId ?? null, out.unverifiedId ?? null, id)
      .run();
  } catch (err) {
    // A row with a NULL outcome is still a useful record, and it is an honest one: it says we
    // started and did not finish. Losing the stamp is not worth failing a request over.
    console.error("[contact] WAL outcome stamp failed", { id, err: String(err) });
  }
}

/**
 * Write shedding for a client that is over the rate limit.
 *
 * One row per IP per clock hour instead of one per request, so a flood costs 24 writes a day
 * rather than unbounded. The unique index in migration 0006 does the collapsing: the first request
 * of the hour inserts, every later one bumps a counter.
 *
 * Every request is still accounted for, which is the requirement. What is lost is the individual
 * body of each request in a burst, which is the correct thing to give up: a flood is one actor
 * repeating themselves, and the count is the information, not the thousandth copy of the payload.
 */
export async function recordCollapsed(ctx: AttemptContext, sample: string | undefined): Promise<void> {
  try {
    await db()
      .prepare(
        `INSERT INTO submission_log (attempt_id, ip, user_agent, country, raw_body, body_bytes, collapsed, outcome, gate)
         VALUES (?,?,?,?,?,1,1,'rate_limited','over_limit')
         ON CONFLICT (ip, substr(received_at, 1, 13)) WHERE collapsed = 1
         DO UPDATE SET body_bytes = body_bytes + 1`,
      )
      .bind(ctx.attemptId, ctx.ip, ctx.userAgent, ctx.country, sample?.slice(0, 2048) ?? null)
      .run();
  } catch (err) {
    console.error("[contact] WAL collapsed write failed", { ip: ctx.ip, err: String(err) });
  }
}
