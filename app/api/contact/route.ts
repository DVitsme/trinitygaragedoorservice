import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Resend } from "resend";
import { LeadEmail } from "@/emails/lead-email";
import { after } from "next/server";
import {
  isValidPhone,
  isValidEmail,
  toE164,
  formatPhone,
  isTurnstileTestSecret,
  isRealTurnstileSiteKey,
} from "@/lib/lead-validation";
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

/** What `middleware.ts` stashed about the ad click, if there was one. */
type ClickIds = {
  gclid?: string; gbraid?: string; wbraid?: string; msclkid?: string; landingPath?: string;
};

/**
 * Everything we managed to read off the request, before any gate has had an opinion about it.
 *
 * `name` and `phoneE164` are optional here and are not optional on the `lead` this narrows into,
 * because a submission that failed a gate is precisely one that may be missing them.
 */
type Submission = {
  name?: string;
  firstName: string;
  lastName: string;
  zip?: string;
  phone: string;
  phoneE164?: string;
  email?: string;
  city?: string;
  service?: string;
  message?: string;
  source: string;
} & ClickIds;

/** Which gate turned a submission away. Stored verbatim in `unverified_leads.reason`. */
type RefusalReason = "turnstile_reject" | "name_required" | "phone_invalid";

/**
 * How long a refused submission is kept before the next insert prunes it.
 *
 * Thirty days rather than the ninety used for click ids. This table exists so a real customer can
 * be phoned back within hours; a row that has sat here for a month has already failed at its only
 * job, and the rows hold the personal details of people who may never have been customers, so
 * keeping them longer costs privacy and buys nothing.
 */
const UNVERIFIED_RETENTION_DAYS = 30;

/**
 * Hard cap on the free text we will store, applied on the way in.
 *
 * The happy path is gated by Turnstile, so nobody could push arbitrary volume into `leads`. The
 * refusal path is by definition NOT gated, so without a cap a loop could write megabyte rows into
 * D1 all day. Four thousand characters is far more than anyone has ever typed into a "what is going
 * on" box, so no real customer can feel this.
 */
const MAX_STORED_TEXT = 4000;

/**
 * Pull the click identifiers back off the cookies middleware set.
 *
 * ⚠️ Values are passed through untouched. `gclid` is **case sensitive** and any normalisation here
 * would silently break every offline conversion upload that uses it, months later, with no error.
 */
function clickIds(req: Request): ClickIds {
  const header = req.headers.get("cookie");
  if (!header) return {};
  const jar = new Map(
    header.split(";").map((part) => {
      const i = part.indexOf("=");
      return i === -1
        ? ([part.trim(), ""] as const)
        : ([part.slice(0, i).trim(), decodeURIComponent(part.slice(i + 1).trim())] as const);
    }),
  );
  const get = (name: string) => jar.get(name) || undefined;
  return {
    gclid: get("tgd_gclid"),
    gbraid: get("tgd_gbraid"),
    wbraid: get("tgd_wbraid"),
    msclkid: get("tgd_msclkid"),
    landingPath: get("tgd_landing"),
  };
}

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

  /**
   * ⚠️ **Assembled BEFORE the gates, and that ordering is the entire point of this block.**
   *
   * Every rejection below used to `return` while these values were still loose local variables, so
   * a refused submission left nothing anywhere: no D1 row, no Resend record, no way to phone the
   * person back, no way to even know they had tried. A real repeat customer hit that path six times
   * across two visits on 2026-08-11 and the only reason anyone found out is that he rang the owner.
   *
   * Assembling the submission first means each gate can hand it to `refuse()` on its way out
   * instead of dropping it on the floor. **Do not move any gate above this object.**
   *
   * `formatPhone` and `toE164` are both safe on a bad number: the first hands back whatever it was
   * given and the second returns null, which is exactly the signal `isReachable` reads.
   */
  const submission: Submission = {
    name,
    firstName,
    lastName,
    zip: data.zip?.trim() || undefined,
    phone: formatPhone(phone),
    phoneE164: toE164(phone) ?? undefined,
    email: data.email?.trim() || undefined,
    city: data.city?.trim() || undefined,
    service: data.service?.trim() || undefined,
    // Capped on the way in. See MAX_STORED_TEXT: the refusal path below is not behind the spam
    // gate, so this is the only thing standing between a loop and unbounded D1 storage.
    message: data.message?.trim().slice(0, MAX_STORED_TEXT) || undefined,
    // Was hardcoded "website", which made every lead from the 18 CTAs pointing at the estimate form
    // indistinguishable. Now the form says where it came from.
    source: data.source?.trim() || "website",
    /*
      Ad click attribution, read from the first party cookies `middleware.ts` set on the landing
      request. NOT read from the request body: the browser attaches these automatically to this
      same origin POST, so they cannot be spoofed by editing the form, and they survive the client
      side navigation between the ad's landing page and whichever form the visitor eventually used.

      Expect most of these to be null. Organic visitors and repeat customers have no click id, and
      about half of Trinity's jobs are repeat customers. A null here is not a fault.
    */
    ...clickIds(req),
  };

  if (!name) {
    await refuse(submission, req, "name_required");
    return NextResponse.json(
      { error: "name_required", message: "Please tell us your name." },
      { status: 422 },
    );
  }
  // Previously ANY non-empty string passed, so `phone: "x"` was accepted and stored. The phone is
  // the only way this business calls anyone back, so it had weaker validation than optional email.
  if (!isValidPhone(phone)) {
    await refuse(submission, req, "phone_invalid");
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
    const captured = await refuse(submission, req, "turnstile_reject");
    return NextResponse.json(
      {
        error: "verification_failed",
        /**
         * Read by the client to choose between a calm confirmation and a red error.
         *
         * True ONLY when the row was written and an alert is already on its way to a person, which
         * is the exact condition under which the message below is allowed to say someone will call.
         * If the alert address is not configured, this is false and the visitor gets the old copy,
         * which promises nothing. Never widen this to mean "we stored it somewhere".
         */
        captured,
        message: captured
          ? `We could not finish the security check, so a person is picking this one up by hand. Someone will call you back. If you need us sooner, call ${SITE.phoneDisplay}.`
          // Names the phone number on purpose. If the widget is being blocked outright, "try again"
          // is advice that cannot work, and this is the only form the business has.
          : `We could not verify that request. Please refresh and try again, or call us at ${SITE.phoneDisplay} and we will take the details over the phone.`,
      },
      /**
       * ⚠️ **Still a 400 even when the details were captured, on purpose.** The client fires
       * `generate_lead` only on `res.ok`, so returning a 2xx here would report every refused
       * submission to Google Ads as a conversion and feed Smart Bidding on spam. The good news
       * travels in the body, where only our own client reads it, and never in the status line.
       */
      { status: 400 },
    );
  }

  const lead = { ...submission, name };

  /**
   * A stable key derived from the lead, NOT random, so a retry of the same submission cannot send
   * the office a second copy. Resend honours it for 24 hours.
   *
   * ⚠️ **It has to cover every field the email renders, and it did not.** The key was
   * `phoneE164|name|message` while `LeadEmail` also prints email, zip, city, service and source. So
   * one person who submitted, changed the service dropdown and submitted again inside 24 hours
   * produced the SAME key: Resend replayed the first response, **the office email was never sent**,
   * the D1 write still succeeded, and the customer saw the success card. Another silent loss with a
   * happy face on it, and in the one direction nobody would think to check.
   *
   * The rule now: if it appears in the email, it is in the key. It stays joinable to D1 without
   * storing anything new, because every part of it is a column on the row.
   */
  const idempotencyKey = await hashKey(
    [
      lead.phoneE164, lead.name, lead.email, lead.zip,
      lead.city, lead.service, lead.source, lead.message,
    ]
      .map((v) => v ?? "")
      .join("|"),
  );

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

  /*
    `leadRef` becomes the Google Ads `transaction_id` on the `generate_lead` event. Google dedupes
    conversions that share one: "if there are 2 conversions for the same conversion action with the
    same transaction ID, Google Ads will know the second conversion is a duplicate". That is a
    different mechanism from the Count setting, and Google says to use both.

    ⚠️ It is the **idempotency key, not the D1 row id**, for two reasons.

    First, the row id is a sequential integer, so returning it would tell anyone who submits the
    form roughly how many leads this business has ever taken. Free information to give away, no
    reason to give it.

    Second, the semantics are already exactly right. This hash is `phoneE164|name|message`, so a
    double submit of the same enquiry produces the SAME reference and Google collapses it, which is
    what we want, while a genuinely new enquiry produces a new one. It is the same key Resend
    already uses to stop the office getting two copies, so both dedupe on one definition of "the
    same submission" rather than on two that could drift apart.

    It is still joinable to D1 without storing anything new: recompute the hash from a row's
    `phone_e164`, `name` and `message`.
  */
  return NextResponse.json({ ok: true, email: emailStatus, db: dbStatus, leadRef: idempotencyKey });
}

/**
 * Health check, so one curl proves the revenue path after a deploy instead of waiting for a
 * customer to discover it is broken. Reports configuration only, never values.
 */
export async function GET(req: Request) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

  /**
   * ⚠️ **This is the BUILD time answer, not a runtime one, and that is exactly why it earns its
   * place.** `NEXT_PUBLIC_*` is inlined by the bundler wherever it appears, server code included,
   * so what lands here is the value the widget was compiled with rather than whatever the Worker
   * happens to have in its environment.
   *
   * That distinction is the whole point. If a build ever runs without this variable the widget
   * never renders, every submission arrives with no token, and the hardened gate refuses **one
   * hundred percent of real customers** while every dashboard and secret list still reads as
   * correctly configured. Nothing else in the pipeline can see that state. One curl now can.
   */
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

  let db = false;
  let leadsSchema = false;
  let unverifiedTable = false;
  try {
    const { env } = getCloudflareContext();
    await env.DB.prepare("SELECT 1").first();
    db = true;
    /*
      `SELECT 1` proves the BINDING, which is not the same thing as proving the schema. Migrations
      are a separate step from a deploy and there is no gate that stops one shipping without the
      other, so a missing column shows up as an INSERT that throws at 2am on a real lead. Reading
      the column list is cheap and turns that into a boolean anyone can curl.

      The table valued form of the pragma is used rather than `PRAGMA table_info(leads)` because D1
      only accepts a short allowlist of bare PRAGMA statements.
    */
    const cols = await env.DB.prepare("SELECT name FROM pragma_table_info('leads')").all<{ name: string }>();
    const present = new Set((cols.results ?? []).map((r) => r.name));
    leadsSchema = REQUIRED_LEAD_COLUMNS.every((c) => present.has(c));

    const found = await env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'unverified_leads'",
    ).first();
    unverifiedTable = Boolean(found);
  } catch {
    // Leave every flag false. A thrown query here IS the finding.
  }

  /**
   * `?deep=1` only, so a crawler cannot make us hammer siteverify on every hit of a public URL.
   *
   * This is the one check that exercises the half of the pipeline that actually failed. It proves
   * the secret is live and that Cloudflare is reachable **from the Worker**, which is different
   * from it being reachable from a laptop, and it does so without a browser, a widget or a token.
   */
  const deep = new URL(req.url).searchParams.get("deep") === "1";

  return NextResponse.json({
    db,
    // False here means a migration has not been applied to whichever D1 this Worker is bound to.
    leadsSchema,
    unverifiedTable,
    resend: Boolean(process.env.RESEND_API_KEY?.trim()),
    mailTo: Boolean(process.env.CONTACT_TO_EMAIL?.trim()),
    // Counts only, never the addresses. Enough to prove the handover landed without printing
    // anyone's inbox into a public endpoint.
    mailToCount: (process.env.CONTACT_TO_EMAIL?.split(",").filter((s) => s.trim()).length ?? 0),
    mailFrom: Boolean(process.env.CONTACT_FROM_EMAIL?.trim()),
    // Temporary monitoring copy. Expected TRUE for a few weeks after handover, then removed with
    // `wrangler secret delete CONTACT_BCC_EMAIL` (runtime only, no deploy needed).
    mailBcc: Boolean(process.env.CONTACT_BCC_EMAIL?.trim()),
    // Where a refused submission raises a human. FALSE means refusals are still being stored but
    // nobody is being told, which is halfway back to the bug this was built to close.
    alertTo: Boolean(process.env.UNVERIFIED_ALERT_TO?.trim()),
    turnstile: Boolean(secret),
    // Loud on purpose. A dummy key makes the form LOOK protected while accepting everything.
    turnstileIsTestKey: isTurnstileTestSecret(secret),
    // The opposite failure, and the more expensive one. See isRealTurnstileSiteKey: a test SITE key
    // against a real secret rejects every visitor. Expected TRUE.
    turnstileSiteKey: Boolean(siteKey),
    turnstileSiteKeyLooksReal: isRealTurnstileSiteKey(siteKey),
    ...(deep && secret ? { siteverify: await probeSiteverify(secret) } : {}),
    // Expected FALSE until Jason is on hand: HCP has no test mode and no delete, so the first push
    // is permanent. See CLIENT-ASKS #31 and #34b.
    hcpLeadSync: process.env.HCP_LEAD_SYNC_ENABLED === "1" && Boolean(process.env.HOUSE_CALL_PRO_APY_KEY?.trim()),
  });
}

/**
 * The columns `storeLead` names in its INSERT. Kept beside the health check rather than beside the
 * insert so that adding a column without adding it here is a visible omission in review.
 */
const REQUIRED_LEAD_COLUMNS = [
  "name", "phone", "phone_e164", "email", "zip", "city", "service", "message", "source",
  "user_agent", "ip", "gclid", "gbraid", "wbraid", "msclkid", "landing_path",
  "hcp_status", "hcp_lead_id", "hcp_attempts", "hcp_last_error",
] as const;

/**
 * Ask siteverify a question whose answer proves our secret is live, without involving a visitor.
 *
 * Deliberately sends an obviously bogus response value. A working setup answers
 * `invalid-input-response`, which is the reply that says "your secret is fine, that token is not".
 * A broken secret answers `invalid-input-secret` instead, and that single word is the difference
 * between "the form is fine" and "every customer is being turned away".
 */
async function probeSiteverify(
  secret: string,
): Promise<"ok" | "bad-secret" | "unreachable" | "unexpected"> {
  try {
    const res = await fetch(SITEVERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: "health-check-not-a-real-token" }),
      signal: AbortSignal.timeout(SITEVERIFY_TIMEOUT_MS),
    });
    const json = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    const codes = json["error-codes"] ?? [];
    if (codes.includes("invalid-input-secret") || codes.includes("missing-input-secret")) return "bad-secret";
    if (codes.includes("invalid-input-response")) return "ok";
    return "unexpected";
  } catch {
    return "unreachable";
  }
}

// ---------------------------------------------------------------------------- sinks

/**
 * ⚠️ **This signature must list every field the email actually renders.**
 *
 * It used to declare only `name`, `phone`, `email` and `service`, while the call site handed it the
 * whole `lead` object. Excess property checks do not apply when you pass a variable, so it compiled,
 * and `LeadEmail(lead)` rendered `zip`, `city` and `source` at runtime that the type said were not
 * there. Harmless until someone reads this signature, concludes the zip never reaches the office,
 * and "fixes" it, or destructures the parameter and silently drops three rows off the email nobody
 * is checking. The type now tells the truth.
 */
async function sendEmail(
  lead: {
    name: string; phone: string; email?: string; service?: string;
    zip?: string; city?: string; message?: string; source?: string;
  },
  idempotencyKey: string,
): Promise<SinkStatus> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  if (!apiKey || !to || !from) return "skipped";

  /**
   * Silent monitoring copy, added 2026-08-04 when leads were handed over to the office.
   *
   * **Deliberately BCC and not a second `to`.** The office should see their own inbox and each
   * other, not an agency address sitting in the recipient list of every customer enquiry. Reply all
   * from Barbara would otherwise loop in a third party the customer never wrote to.
   *
   * ⚠️ **This is temporary.** It exists so the handover can be watched for a few weeks. It is a
   * runtime secret, not baked at build time, so removing it is `wrangler secret delete
   * CONTACT_BCC_EMAIL` with **no rebuild and no deploy**. Comma separated, same as `to`.
   */
  const bcc = process.env.CONTACT_BCC_EMAIL?.trim();
  const addresses = (v: string) => v.split(",").map((t) => t.trim()).filter(Boolean);

  try {
    const resend = new Resend(apiKey);
    // ⚠️ The resend-node SDK does NOT throw on API errors, it returns { data, error }. The old code
    // only had a try/catch, so a rejected send (a malformed from address, an unverified domain, a
    // rate limit) resolved normally and was recorded as a SUCCESS while the lead vanished. Checking
    // `error` is the actual fix; the try/catch below only catches genuine network throws.
    const { error } = await resend.emails.send(
      {
        // Comma separated, so the whole office receives every lead.
        to: addresses(to),
        ...(bcc ? { bcc: addresses(bcc) } : {}),
        from,
        /**
         * ⚠️ **Conditional, because an unvalidated reply-to loses the whole email.**
         *
         * This was `replyTo: lead.email` with no server side check. Resend validates `reply_to`
         * and answers 422 **before creating the email object**, so one malformed address meant the
         * send failed, the office received nothing, the D1 write still succeeded, the route still
         * returned 200 and the customer still saw the success card. A lead lost silently, and only
         * for the leads that bothered to fill in the optional email field.
         *
         * `isValidEmail` already existed in `lib/lead-validation.ts` and is what the client form
         * checks with; this file simply never imported it. It is deliberately loose, so it will not
         * reject a real address, and Resend's parser is stricter than it, which is the case this
         * guard now absorbs.
         *
         * **What the office loses when it is dropped:** hitting Reply goes to the sending address
         * instead of the customer. Nothing becomes unreachable, because the Email row in the body
         * is still a `mailto:` link they can click. One extra click on one lead, against losing the
         * notification for that lead entirely.
         */
        ...(isValidEmail(lead.email) ? { replyTo: lead.email } : {}),
        // Phone in the subject on purpose: the office can call back from the notification list
        // without opening anything. Commas rather than dashes, per the house copy rule.
        //
        // `oneLine` is not cosmetic. `lead.name` and `lead.service` are visitor controlled, and a
        // carriage return inside a header is the same defect as the reply-to above: Resend rejects
        // the send, the office gets nothing, and the route still answers 200.
        subject: oneLine(`New ${lead.service ?? "garage door"} lead: ${lead.name}, ${lead.phone}`),
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
  } & ClickIds,
  req: Request,
): Promise<number | null> {
  try {
    const { env } = getCloudflareContext();
    const row = await env.DB.prepare(
      `INSERT INTO leads (name, phone, phone_e164, email, zip, city, service, message, source, user_agent, ip,
                          gclid, gbraid, wbraid, msclkid, landing_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
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
        lead.gclid ?? null,
        lead.gbraid ?? null,
        lead.wbraid ?? null,
        lead.msclkid ?? null,
        lead.landingPath ?? null,
      )
      .first<{ id: number }>();
    return row?.id ?? null;
  } catch (err) {
    console.error("[contact] D1 insert failed:", err);
    return null;
  }
}

// -------------------------------------------------------------------- the safety net

/**
 * Everything that happens when a gate turns a submission away.
 *
 * ## Why this exists at all
 *
 * The spam hardening of 2026-08-03 was correct and is not being undone here. What it lacked was any
 * compensating capture, so the cost of a false positive went from "the visitor retries" to "the
 * business never learns a customer tried". Those are different orders of magnitude for a company
 * that takes roughly one web lead every day and a half at a mean of $2,330 a job. This closes the
 * second half of that change without reopening the first: nothing written here reaches `leads`, the
 * office lead email, the `generate_lead` conversion, or Housecall Pro.
 *
 * ## Why the reachability bar
 *
 * Writing a row for every refused POST hands anyone with a loop a way to burn the daily D1 write
 * allowance that the real `leads` table shares, which would turn a spam nuisance into a lead outage.
 * A refusal with no phone and no email is also not a lead anyone could ever recover, so keeping it
 * buys nothing to pay for that risk with. A structurally valid phone or a plausible email is the
 * whole test, and every real customer clears it, including the one this was built for.
 *
 * ⚠️ This is NOT a substitute for a rate limiting rule on the zone. It bounds the damage; it does
 * not stop a determined flood. See the note in the remediation plan.
 *
 * Returns true only when the details are stored **and** an alert is already on its way to a person,
 * because that is the exact condition under which the caller is allowed to tell a visitor that
 * someone will call them back.
 */
async function refuse(submission: Submission, req: Request, reason: RefusalReason): Promise<boolean> {
  if (!isReachable(submission)) {
    console.warn("[contact] refused, nothing to call back on, dropped", { reason });
    return false;
  }

  /**
   * ⚠️ **Only a Turnstile rejection raises a human, and the other two deliberately do not.**
   *
   * The client validates name and phone with the same `lib/lead-validation` functions this route
   * does, and the form cannot submit at all without JavaScript, so a 422 reaching here did not come
   * from a person using our form. Alerting on those would be a free email amplifier pointed at the
   * same Resend account that carries the real leads. The rows are still written, because they are
   * how we would find out if the client and the server ever drifted apart, or if someone is probing
   * the endpoint. Widen this from the table's own data, not from a hunch.
   */
  const alerting = reason === "turnstile_reject" && alertConfigured();
  const id = await storeUnverified(submission, req, reason, alerting ? "pending" : "skipped");
  console.warn("[contact] refused submission captured", { reason, id, source: submission.source });

  if (id !== null && alerting) {
    // After the response, exactly like the HCP push: the durable write is what the visitor waits
    // for, the notification is not. The details are already safe by this point either way.
    after(async () => {
      const status = await alertUnverified(submission, reason);
      await markAlert(id, status);
    });
  }
  return id !== null && alerting;
}

/** Is there any way at all to get back to this person? The bar for keeping a refused submission. */
function isReachable(s: { phoneE164?: string; email?: string }): boolean {
  // `phoneE164` is only ever set when `isValidPhone` passed, so this reads as "a number that could
  // actually be dialled" rather than "the field was not empty".
  return Boolean(s.phoneE164) || isValidEmail(s.email);
}

/** Whether a refusal can reach a human at all. Checked before promising anyone a call back. */
function alertConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.UNVERIFIED_ALERT_TO?.trim() &&
      process.env.CONTACT_FROM_EMAIL?.trim(),
  );
}

/** Returns the new row id, or null on failure. Never throws: a failed capture must not 500. */
async function storeUnverified(
  s: Submission,
  req: Request,
  reason: RefusalReason,
  alertStatus: "pending" | "skipped",
): Promise<number | null> {
  try {
    const { env } = getCloudflareContext();
    /*
      The prune rides along in the same batch as the insert, so retention maintains itself instead
      of depending on someone remembering a command. One D1 round trip, and with
      `idx_unverified_created_at` the DELETE is an index seek that matches nothing on almost every
      call, so it costs a flooded endpoint nothing measurable.
    */
    const [, inserted] = await env.DB.batch<{ id: number }>([
      env.DB.prepare(
        `DELETE FROM unverified_leads WHERE created_at < datetime('now', ?)`,
      ).bind(`-${UNVERIFIED_RETENTION_DAYS} days`),
      env.DB.prepare(
        `INSERT INTO unverified_leads (reason, name, phone, phone_e164, email, zip, city, service,
                                       message, source, user_agent, ip,
                                       gclid, gbraid, wbraid, msclkid, landing_path, alert_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
      ).bind(
        reason,
        s.name ?? null,
        s.phone || null,
        s.phoneE164 ?? null,
        s.email ?? null,
        s.zip ?? null,
        s.city ?? null,
        s.service ?? null,
        s.message ?? null,
        s.source,
        req.headers.get("user-agent") ?? null,
        req.headers.get("cf-connecting-ip") ?? null,
        s.gclid ?? null,
        s.gbraid ?? null,
        s.wbraid ?? null,
        s.msclkid ?? null,
        s.landingPath ?? null,
        alertStatus,
      ),
    ]);
    return inserted.results?.[0]?.id ?? null;
  } catch (err) {
    console.error("[contact] could not capture a refused submission:", err);
    return null;
  }
}

/**
 * Tells a person, within a minute, that someone was turned away.
 *
 * **Plain text, and no `react` template.** An alert does not need branding, a text body cannot be
 * broken by whatever the visitor typed, and it keeps this path from sharing a failure mode with the
 * office lead email it is supposed to be a backstop for.
 *
 * **Aimed at the agency and not the office by default.** We do not yet know how much of this traffic
 * is spam, and pointing an untriaged stream at Barbara's inbox on day one would undo, from her point
 * of view, the fix that started all of this. `UNVERIFIED_ALERT_TO` is comma separated exactly like
 * `CONTACT_TO_EMAIL`, so adding the office once there is a week of real volume to look at is
 * `wrangler secret put` with **no rebuild and no deploy**. Same pattern, and same reasoning, as
 * `CONTACT_BCC_EMAIL`.
 */
async function alertUnverified(s: Submission, reason: RefusalReason): Promise<SinkStatus> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.UNVERIFIED_ALERT_TO?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  if (!apiKey || !to || !from) return "skipped";

  /**
   * ⚠️ **This key MUST NOT be the one the office lead email uses, and the reason is a trap.**
   *
   * Resend's idempotency window is 24 hours and keys on the key alone. If a refused attempt and the
   * same person's later successful attempt shared a key, Resend would replay the alert's response
   * and **the real lead email would never be sent**. That is exactly the scenario this whole change
   * exists for: the customer in the incident was refused at 01:37 and got through at 11:12 the same
   * morning, nine and a half hours inside the window. The `unverified` prefix and the reason keep
   * the two namespaces apart, while still collapsing the duplicate alerts from someone pressing
   * submit three times in four seconds, which is what the incident actually looked like.
   */
  const key = await hashKey(
    `unverified|${reason}|${s.phoneE164 ?? ""}|${s.name ?? ""}|${s.message ?? ""}`,
  );

  const lines = [
    "A submission was refused by the spam check and never reached the leads table.",
    "This person may be sitting waiting for a call. Treat it as real until it obviously is not.",
    "",
    `Refused by: ${reason}`,
    `Name:       ${s.name ?? "not given"}`,
    `Phone:      ${s.phone || "not given"}`,
    `Email:      ${s.email ?? "not given"}`,
    `Zip:        ${s.zip ?? "not given"}`,
    `Service:    ${s.service ?? "not given"}`,
    `Came from:  ${s.source}`,
    "",
    s.message ? `What they wrote:\n${s.message}` : "No message.",
    "",
    `It is saved in the unverified_leads table for ${UNVERIFIED_RETENTION_DAYS} days.`,
  ];

  try {
    const resend = new Resend(apiKey);
    // Same `{ data, error }` trap as the office email: the SDK does not throw on API errors.
    const { error } = await resend.emails.send(
      {
        to: to.split(",").map((t) => t.trim()).filter(Boolean),
        from,
        // ⚠️ No replyTo. The address on a refused submission is the least trustworthy field on the
        // page, and this email is internal.
        subject: oneLine(`Refused submission, may need a call back: ${s.name ?? "no name"}, ${s.phone || "no phone"}`),
        text: lines.join("\n"),
      },
      { idempotencyKey: key },
    );
    if (error) {
      console.error("[contact] Resend rejected the refusal alert:", error.name, error.message);
      return "failed";
    }
    return "ok";
  } catch (err) {
    console.error("[contact] refusal alert threw:", err);
    return "failed";
  }
}

/** Records whether the alert actually went out, so a broken alert path is not itself silent. */
async function markAlert(id: number, status: SinkStatus): Promise<void> {
  try {
    const { env } = getCloudflareContext();
    await env.DB.prepare(`UPDATE unverified_leads SET alert_status = ? WHERE id = ?`)
      .bind(status, id)
      .run();
  } catch (err) {
    console.error("[contact] could not record the refusal alert outcome:", err);
  }
}

/**
 * Flatten anything visitor controlled that is about to become an email header.
 *
 * A CR or LF in a subject line is not a header injection risk through Resend's JSON API, it is
 * something worse and duller: the send is rejected, the office receives nothing, and the route
 * still answers 200. Identical shape to the reply-to defect above, so it gets the same treatment.
 */
function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
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
  /**
   * ⚠️ **We deliberately do NOT short circuit here. A missing token still goes to siteverify.**
   *
   * Rejecting immediately looks simpler and is subtly wrong. If Cloudflare itself is down, the
   * widget script never loads, so a REAL customer also arrives with no token. An early reject would
   * turn a Cloudflare outage into "nobody can contact this business", which is the failure the
   * original fail open was written to avoid.
   *
   * Calling siteverify with an empty response separates the two cases, because the answer tells us
   * which world we are in:
   *   reachable, replies `missing-input-response` → the client really sent nothing → reject
   *   unreachable, or replies `internal-error`    → Cloudflare is down → fail open, below
   *
   * Costs one request against an endpoint built for exactly this, and buys back outage resilience
   * without leaving the door open.
   */
  if (!token && process.env.NODE_ENV !== "production") {
    console.warn("[contact] no Turnstile token present, accepting (non production)");
    return "pass";
  }

  // One UUID per logical attempt, reused across the retry, so retrying cannot burn the token.
  const idempotencyKey = crypto.randomUUID();

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const body = new URLSearchParams({ secret, response: token ?? "", idempotency_key: idempotencyKey });
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
      /*
        OUR misconfiguration ONLY, and the list is deliberately short.

        ⚠️ `missing-input-response` and `bad-request` used to be here and that was a live bypass:
        both are provoked by the `response` field, which is the one part of this call an ATTACKER
        controls. A tokenless or malformed submission produced `missing-input-response`, matched this
        branch, and was waved through as "our misconfiguration".

        The rule for this list: fail open only on states the attacker CANNOT create. A wrong secret
        is ours. An empty response is theirs.
      */
      if (codes.some((c) =>
        ["missing-input-secret", "invalid-input-secret"].includes(c),
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
