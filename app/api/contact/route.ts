import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Resend } from "resend";
import { LeadEmail } from "@/emails/lead-email";
import { after } from "next/server";
import { isValidPhone, toE164, formatPhone, isTurnstileTestSecret } from "@/lib/lead-validation";
import { pushLeadToHcp, HcpPermanentError } from "@/lib/housecall-pro";
import { SITE } from "@/lib/site";

type Payload = {
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  email?: string;
  zip?: string;
  city?: string;
  service?: string;
  message?: string;
  source?: string;
  token?: string;
};

/** Sink outcomes, so the response can tell the truth instead of always claiming success. */
type SinkStatus = "ok" | "failed" | "skipped";

const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
/** Cloudflare publishes no number here, only "do not wait indefinitely". This is our choice. */
const SITEVERIFY_TIMEOUT_MS = 4000;
/** Bind a token to this form, so one minted elsewhere on the site cannot be replayed here. */
const TURNSTILE_ACTION = "contact-form";

export async function POST(req: Request) {
  let data: Payload;
  try {
    data = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "invalid_json", message: "Invalid request." }, { status: 400 });
  }

  const firstName = data.firstName?.trim() ?? "";
  const lastName = data.lastName?.trim() ?? "";
  // `name` stays supported so any older cached client bundle keeps working through a deploy.
  const name = (data.name?.trim() || `${firstName} ${lastName}`.trim()) || undefined;
  const phone = data.phone?.trim();

  if (!name) {
    return NextResponse.json(
      { error: "name_required", message: "Please tell us your name." },
      { status: 422 },
    );
  }
  // Previously ANY non-empty string passed, so `phone: "x"` was accepted and stored. The phone is
  // the only way this business calls anyone back, so it had weaker validation than optional email.
  if (!isValidPhone(phone)) {
    return NextResponse.json(
      {
        error: "phone_invalid",
        message:
          "That doesn't look like a complete US phone number. Please double check the area code and number.",
      },
      { status: 422 },
    );
  }

  // ---------------------------------------------------------------- spam gate
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const verdict = await verifyTurnstile(secret, data.token, req.headers.get("cf-connecting-ip"));
  if (verdict === "reject") {
    return NextResponse.json(
      {
        error: "verification_failed",
        // Names the phone number on purpose. If the widget is being blocked outright, "try again"
        // is advice that cannot work, and this is the only form the business has.
        message:
          "We could not verify that request. Please refresh and try again, or call us at (813) 279-6785 and we will take the details over the phone.",
      },
      { status: 400 },
    );
  }

  const lead = {
    name,
    firstName,
    lastName,
    zip: data.zip?.trim() || undefined,
    phone: formatPhone(phone),
    phoneE164: toE164(phone) ?? undefined,
    email: data.email?.trim() || undefined,
    city: data.city?.trim() || undefined,
    service: data.service?.trim() || undefined,
    message: data.message?.trim() || undefined,
    // Was hardcoded "website", which made every lead from the 18 CTAs pointing at the estimate form
    // indistinguishable. Now the form says where it came from.
    source: data.source?.trim() || "website",
  };

  /**
   * A stable key derived from the lead, NOT random, so a retry of the same submission cannot send
   * the office a second copy. Resend honours it for 24 hours.
   */
  const idempotencyKey = await hashKey(`${lead.phoneE164}|${lead.name}|${lead.message ?? ""}`);

  const [emailStatus, leadId] = await Promise.all([
    sendEmail(lead, idempotencyKey),
    storeLead(lead, req),
  ]);
  const dbStatus: SinkStatus = leadId === null ? "failed" : "ok";

  /**
   * Push to Housecall Pro AFTER responding, so a CRM that takes 0.4 to 1.7 seconds never makes the
   * visitor wait and a CRM outage can never fail a submission that already succeeded.
   *
   * ⚠️ **Deliberately inert until two things happen**, see CLIENT-ASKS #31 and #34b. HCP has no test
   * mode and no DELETE endpoint, so the FIRST push is permanent and only Jason can remove it. He
   * also needs to create a separate API key named "website" so this can be switched off without
   * breaking the marketing company's access. Setting HCP_LEAD_SYNC_ENABLED=1 is the switch, which
   * means this ships merged, deployed and safely off, and cannot be forgotten in a launch scramble.
   *
   * The Turnstile interlock is the second gate: never push spam into a system where cleanup is a
   * human clicking, every spam lead adds a customer record to the 6,000 they mail postcards to, and
   * spam would corrupt the "Trinity Website" lead source the client will judge this rebuild by.
   */
  const hcpKey = process.env.HOUSE_CALL_PRO_APY_KEY?.trim();
  const hcpEnabled =
    process.env.HCP_LEAD_SYNC_ENABLED === "1" &&
    Boolean(hcpKey) &&
    Boolean(secret) &&
    !isTurnstileTestSecret(secret) &&
    verdict === "pass" &&
    leadId !== null;

  if (hcpEnabled) {
    after(async () => {
      try {
        const { id } = await pushLeadToHcp(
          { firstName, lastName, phone: phone!, email: lead.email, zip: lead.zip, message: lead.message },
          hcpKey!,
        );
        // Recorded immediately. With no idempotency key on their side, this row IS our guard: if
        // hcp_lead_id is set, the push happened and must never be repeated.
        await markHcp(leadId!, "sent", { hcpLeadId: id });
      } catch (err) {
        const permanent = err instanceof HcpPermanentError;
        console.error("[contact] HCP push failed", { leadId, permanent, err: String(err) });
        await markHcp(leadId!, permanent ? "rejected" : "failed", { error: String(err) });
      }
    });
  }

  // The whole point: if EVERY durable sink failed, the lead is gone. Say so and give them the
  // phone number, instead of showing a success card over a lost customer.
  if (emailStatus !== "ok" && dbStatus !== "ok") {
    console.error("[contact] every sink failed, lead not captured", { emailStatus, dbStatus });
    return NextResponse.json(
      {
        error: "not_captured",
        message: `We could not save your request. Please call us at ${SITE.phoneDisplay}.`,
        email: emailStatus,
        db: dbStatus,
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, email: emailStatus, db: dbStatus });
}

/**
 * Health check, so one curl proves the revenue path after a deploy instead of waiting for a
 * customer to discover it is broken. Reports configuration only, never values.
 */
export async function GET() {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  let db = false;
  try {
    const { env } = getCloudflareContext();
    await env.DB.prepare("SELECT 1").first();
    db = true;
  } catch {
    db = false;
  }
  return NextResponse.json({
    db,
    resend: Boolean(process.env.RESEND_API_KEY?.trim()),
    mailTo: Boolean(process.env.CONTACT_TO_EMAIL?.trim()),
    mailFrom: Boolean(process.env.CONTACT_FROM_EMAIL?.trim()),
    turnstile: Boolean(secret),
    // Loud on purpose. A dummy key makes the form LOOK protected while accepting everything.
    turnstileIsTestKey: isTurnstileTestSecret(secret),
    // Expected FALSE until Jason is on hand: HCP has no test mode and no delete, so the first push
    // is permanent. See CLIENT-ASKS #31 and #34b.
    hcpLeadSync: process.env.HCP_LEAD_SYNC_ENABLED === "1" && Boolean(process.env.HOUSE_CALL_PRO_APY_KEY?.trim()),
  });
}

// ---------------------------------------------------------------------------- sinks

async function sendEmail(
  lead: { name: string; phone: string; email?: string; service?: string },
  idempotencyKey: string,
): Promise<SinkStatus> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  if (!apiKey || !to || !from) return "skipped";

  try {
    const resend = new Resend(apiKey);
    // ⚠️ The resend-node SDK does NOT throw on API errors, it returns { data, error }. The old code
    // only had a try/catch, so a rejected send (a malformed from address, an unverified domain, a
    // rate limit) resolved normally and was recorded as a SUCCESS while the lead vanished. Checking
    // `error` is the actual fix; the try/catch below only catches genuine network throws.
    const { error } = await resend.emails.send(
      {
        // Comma separated, so the office and we can both receive during launch week.
        to: to.split(",").map((t) => t.trim()).filter(Boolean),
        from,
        replyTo: lead.email,
        // Phone in the subject on purpose: the office can call back from the notification list
        // without opening anything. Commas rather than dashes, per the house copy rule.
        subject: `New ${lead.service ?? "garage door"} lead: ${lead.name}, ${lead.phone}`,
        react: LeadEmail(lead),
      },
      { idempotencyKey },
    );
    if (error) {
      console.error("[contact] Resend rejected the send:", error.name, error.message);
      return "failed";
    }
    return "ok";
  } catch (err) {
    console.error("[contact] Resend threw:", err);
    return "failed";
  }
}

/** Returns the new row id, or null on failure. The id is what the HCP push updates afterwards. */
async function storeLead(
  lead: {
    name: string; phone: string; phoneE164?: string; email?: string;
    zip?: string; city?: string; service?: string; message?: string; source: string;
  },
  req: Request,
): Promise<number | null> {
  try {
    const { env } = getCloudflareContext();
    const row = await env.DB.prepare(
      `INSERT INTO leads (name, phone, phone_e164, email, zip, city, service, message, source, user_agent, ip)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
    )
      .bind(
        lead.name,
        lead.phone,
        lead.phoneE164 ?? null,
        lead.email ?? null,
        lead.zip ?? null,
        lead.city ?? null,
        lead.service ?? null,
        lead.message ?? null,
        lead.source,
        req.headers.get("user-agent") ?? null,
        req.headers.get("cf-connecting-ip") ?? null,
      )
      .first<{ id: number }>();
    return row?.id ?? null;
  } catch (err) {
    console.error("[contact] D1 insert failed:", err);
    return null;
  }
}

/** Records the outcome of the background HCP push, so a silent failure is still discoverable. */
async function markHcp(
  leadId: number,
  status: "sent" | "failed" | "rejected",
  opts: { hcpLeadId?: string; error?: string } = {},
): Promise<void> {
  try {
    const { env } = getCloudflareContext();
    await env.DB.prepare(
      `UPDATE leads SET hcp_status = ?, hcp_lead_id = COALESCE(?, hcp_lead_id),
         hcp_attempts = hcp_attempts + 1, hcp_last_error = ? WHERE id = ?`,
    )
      .bind(status, opts.hcpLeadId ?? null, opts.error ?? null, leadId)
      .run();
  } catch (err) {
    console.error("[contact] could not record HCP outcome:", err);
  }
}

// ------------------------------------------------------------------------ turnstile

type Verdict = "pass" | "reject";

/**
 * Fail OPEN on our own misconfiguration and on Cloudflare outages; fail CLOSED only on a verdict
 * that actually implicates the visitor.
 *
 * The reasoning, since Cloudflare publishes no guidance either way (their sample code fails
 * closed): a config error or an outage hits 100% of visitors and does not self heal, so failing
 * closed there takes the entire lead form offline for everyone. Letting some spam through for the
 * length of an incident is the cheaper mistake for a business whose leads arrive this way.
 */
async function verifyTurnstile(
  secret: string | undefined,
  token: string | undefined,
  ip: string | null,
): Promise<Verdict> {
  if (!secret) return "pass"; // not configured, e.g. local dev

  if (isTurnstileTestSecret(secret) && process.env.NODE_ENV === "production") {
    console.error("[contact] TURNSTILE_SECRET_KEY is a Cloudflare TEST key in production. The form is unprotected.");
  }

  /**
   * ⚠️ **A MISSING TOKEN IS A REJECT IN PRODUCTION.** Changed 2026-08-03 after this exact path let
   * spam through.
   *
   * The previous version returned "pass" here so an ad blocker could not make the form unusable.
   * That reasoning had a hole: this branch returns BEFORE siteverify is ever called, so a submission
   * with no token was never verified at all. Cloudflare's dashboard was right to warn that
   * "siteverify isn't being called" while the code demonstrably rejected bad tokens: almost nothing
   * was arriving WITH a token, so the verify call was never reached.
   *
   * The spam that prompted this arrived with no token, a California area code, a throwaway email
   * domain and an SEO pitch in the message box.
   *
   * The distinction that matters: **an attacker controls whether a token is present. An attacker
   * does NOT control whether Cloudflare is up or whether our secret is right.** So this branch fails
   * closed, and the outage branches below stay fail open. Closing the door someone can walk through
   * without adding a new way to lose real leads.
   *
   * Dev keeps the old behaviour so a local run without a widget still works.
   */
  if (!token) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[contact] no Turnstile token present, REJECTING");
      return "reject";
    }
    console.warn("[contact] no Turnstile token present, accepting (non production)");
    return "pass";
  }

  // One UUID per logical attempt, reused across the retry, so retrying cannot burn the token.
  const idempotencyKey = crypto.randomUUID();

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const body = new URLSearchParams({ secret, response: token, idempotency_key: idempotencyKey });
      if (ip) body.set("remoteip", ip);

      const res = await fetch(SITEVERIFY, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        signal: AbortSignal.timeout(SITEVERIFY_TIMEOUT_MS),
      });
      const json = (await res.json()) as {
        success: boolean;
        hostname?: string;
        action?: string;
        "error-codes"?: string[];
      };

      if (json.success) {
        // Defence in depth. The dashboard allowlist governs where a token can be MINTED; this
        // governs what we accept, which is what stops a replayed or mis-wired token.
        if (json.action && json.action !== TURNSTILE_ACTION) {
          console.error("[contact] Turnstile action mismatch:", json.action);
          return "reject";
        }
        return "pass";
      }

      const codes = json["error-codes"] ?? [];
      // Our misconfiguration. Deterministic, affects everyone, will not self heal. Log loudly and
      // let the lead through rather than silently rejecting every customer.
      if (codes.some((c) =>
        ["missing-input-secret", "invalid-input-secret", "bad-request", "missing-input-response"].includes(c),
      )) {
        console.error("[contact] Turnstile is MISCONFIGURED, failing open:", codes);
        return "pass";
      }
      // Cloudflare's side. Documented as retryable.
      if (codes.includes("internal-error") && attempt === 0) continue;
      if (codes.includes("internal-error")) {
        console.error("[contact] Turnstile internal-error, failing open");
        return "pass";
      }
      // invalid-input-response / timeout-or-duplicate: this submission is not verifiable.
      console.warn("[contact] Turnstile rejected the token:", codes);
      return "reject";
    } catch (err) {
      if (attempt === 0) continue; // network blip or timeout, retry once with the same key
      console.error("[contact] Turnstile unreachable, failing open:", err);
      return "pass";
    }
  }
  return "pass";
}

/** Short stable hash for the Resend idempotency key. */
async function hashKey(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf).slice(0, 16))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
