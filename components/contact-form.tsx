"use client";

import Script from "next/script";
import { useState, type FormEvent } from "react";
import { CITIES, SERVICE_OPTIONS } from "@/lib/site";

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
    // Cloudflare Turnstile injects this hidden field into the form once solved.
    const token = fd.get("cf-turnstile-response")?.toString();
    if (TURNSTILE_SITE_KEY && !token) {
      setError("Please wait a moment for the security check to finish, then try again.");
      setStatus("error");
      return;
    }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          phone: fd.get("phone"),
          email: fd.get("email"),
          city: fd.get("city"),
          service: fd.get("service"),
          message: fd.get("message"),
          token,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please call us instead.");
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
        <h3 className="font-heading text-[22px] font-extrabold uppercase text-ink">
          Thanks — we&apos;ve got it.
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
          <input id="phone" name="phone" type="tel" required className={fieldCls} />
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
          <div className="cf-turnstile sm:col-span-2" data-sitekey={TURNSTILE_SITE_KEY} data-theme="light" />
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
