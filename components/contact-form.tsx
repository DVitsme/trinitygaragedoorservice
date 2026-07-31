"use client";

import Script from "next/script";
import { useState, type FormEvent } from "react";
import { CITIES, SERVICE_OPTIONS } from "@/lib/site";
import { isValidPhone } from "@/lib/lead-validation";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Status = "idle" | "submitting" | "success" | "error";

const fieldCls =
  "w-full rounded-md border-2 border-ink bg-white px-4 py-3 text-[15px] text-ink outline-none focus:border-accent";
const labelCls = "mb-1.5 block text-[12px] font-extrabold uppercase tracking-[0.06em] text-[#666]";

export function ContactForm({ intent }: { intent?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const fd = new FormData(e.currentTarget);

    // Validate before the round trip so a typo is caught instantly rather than by the server.
    const phoneRaw = fd.get("phone")?.toString();
    if (!isValidPhone(phoneRaw)) {
      setError("That doesn't look like a complete US phone number. Please double check it.");
      setStatus("error");
      return;
    }

    // Cloudflare Turnstile injects this hidden field into the form once solved.
    // We deliberately do NOT block submission when it is absent. An ad blocker or a blocked script
    // used to make this form permanently unusable for a real customer, with no way for them to
    // know why. The server decides what to do about a missing token; it fails open on purpose.
    const token = fd.get("cf-turnstile-response")?.toString();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          phone: phoneRaw,
          email: fd.get("email"),
          city: fd.get("city"),
          service: fd.get("service"),
          message: fd.get("message"),
          source: intent === "estimate" ? "estimate-form" : "contact-form",
          token,
        }),
      });
      // The route reports each sink separately. Previously this typed the body as `{error?}`,
      // never read the result, and showed the success card no matter what happened, which is how a
      // lost lead looked identical to a captured one.
      const json = (await res.json().catch(() => ({}))) as {
        message?: string;
        email?: string;
        db?: string;
      };
      if (!res.ok) {
        setError(json.message ?? "Something went wrong. Please call us at (813) 279-6785.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setError("Network error. Please call us at (813) 279-6785.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <h3 className="font-display text-[22px] font-extrabold uppercase text-ink">
          Thanks, we&apos;ve got it.
        </h3>
        <p className="mt-2 text-[15px] text-[#4a4a4a]">
          A Trinity team member will reach out shortly. Need us now? Call{" "}
          <a href="tel:18132796785" className="font-bold text-accent">
            (813) 279-6785
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      {TURNSTILE_SITE_KEY && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      )}
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="name">Name *</label>
          <input id="name" name="name" required className={fieldCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="phone">Phone *</label>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required className={fieldCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className={fieldCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="city">City</label>
          <select id="city" name="city" defaultValue="" className={fieldCls}>
            <option value="" disabled>Select your city</option>
            {CITIES.map((c) => (
              <option key={c.slug} value={c.name}>{c.name}</option>
            ))}
            <option value="Other">Other / nearby</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="service">What do you need?</label>
          <select
            id="service"
            name="service"
            defaultValue={intent === "estimate" ? "New installation" : ""}
            className={fieldCls}
          >
            <option value="" disabled>Select a service</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="message">Tell us what&apos;s going on</label>
          <textarea id="message" name="message" rows={4} className={fieldCls} />
        </div>

        {TURNSTILE_SITE_KEY && (
          <div
            className="cf-turnstile sm:col-span-2"
            data-sitekey={TURNSTILE_SITE_KEY}
            data-theme="light"
            data-action="contact-form"
          />
        )}

        {status === "error" && (
          <p className="text-[14px] font-semibold text-accent sm:col-span-2">{error}</p>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-[7px] bg-accent px-6 py-4 text-[15px] font-extrabold uppercase tracking-[0.04em] text-white disabled:opacity-60"
          >
            {status === "submitting"
              ? "Sending…"
              : intent === "estimate"
                ? "Request My Free Estimate"
                : "Send Request"}
          </button>
        </div>
      </form>
    </>
  );
}
