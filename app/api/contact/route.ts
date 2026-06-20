import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Resend } from "resend";
import { LeadEmail } from "@/emails/lead-email";

type Payload = {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  service?: string;
  message?: string;
  token?: string;
};

export async function POST(req: Request) {
  let data: Payload;
  try {
    data = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = data.name?.trim();
  const phone = data.phone?.trim();
  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone are required." }, { status: 422 });
  }

  // Cloudflare Turnstile — skipped when no secret is configured (e.g. local dev w/o keys).
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (secret) {
    const ok = await verifyTurnstile(secret, data.token, req.headers.get("cf-connecting-ip"));
    if (!ok) {
      return NextResponse.json({ error: "Could not verify the request. Please try again." }, { status: 400 });
    }
  }

  const lead = {
    name,
    phone,
    email: data.email?.trim() || undefined,
    city: data.city?.trim() || undefined,
    service: data.service?.trim() || undefined,
    message: data.message?.trim() || undefined,
  };

  // Send the notification email (best-effort; dormant until a Resend domain is verified).
  let emailed = false;
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (apiKey && to && from) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to,
        replyTo: lead.email,
        subject: `New ${lead.service ?? "garage door"} lead — ${lead.name}`,
        react: LeadEmail(lead),
      });
      emailed = true;
    } catch (err) {
      console.error("[contact] Resend send failed:", err);
    }
  }

  // Persist to D1 (best-effort — a DB hiccup must not lose the request).
  try {
    const { env } = getCloudflareContext();
    await env.DB.prepare(
      `INSERT INTO leads (name, phone, email, city, service, message, source, user_agent, ip)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        lead.name,
        lead.phone,
        lead.email ?? null,
        lead.city ?? null,
        lead.service ?? null,
        lead.message ?? null,
        "website",
        req.headers.get("user-agent") ?? null,
        req.headers.get("cf-connecting-ip") ?? null,
      )
      .run();
  } catch (err) {
    console.error("[contact] D1 insert failed:", err);
  }

  return NextResponse.json({ ok: true, emailed });
}

async function verifyTurnstile(
  secret: string,
  token: string | undefined,
  ip: string | null,
): Promise<boolean> {
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const json = (await res.json()) as { success: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}
