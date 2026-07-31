"use client";

import Script from "next/script";
import { useState, useId, type FormEvent, type InputHTMLAttributes, type FocusEvent, type ChangeEvent } from "react";
import { isValidPhone, isValidEmail } from "@/lib/lead-validation";
import { track } from "@/lib/analytics";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Status = "idle" | "submitting" | "success" | "error";
type Field = "firstName" | "lastName" | "phone" | "email" | "zip";

const FIELDS: Field[] = ["firstName", "lastName", "phone", "email", "zip"];

/**
 * The lead form.
 *
 * Fields chosen by Jason on the 2026-07-29 call: first name, last name, phone, email, zip, plus a
 * free text box. **No pricing and no service picker**, deliberately, because he does not want a
 * price on screen before a conversation. His ads specialist wanted fewer fields; Jason overrode
 * him, because the office needs to know where someone is before calling back.
 *
 * **Single step, not chunked.** The multi step evidence people quote is drawn from long forms; at
 * six fields the difference is noise. Showing everything at once is also the direct fix for the
 * complaint that started this: Housecall Pro's widget demanded a zip with no way to skip and no
 * sight of what came next.
 *
 * ⚠️ Inputs are **16px minimum**. Safari zooms any focused input under 16px, and the previous 15px
 * caused a zoom on every mobile visit to the most important form on the site.
 */
const labelCls = "mb-1.5 block text-[13px] font-extrabold uppercase tracking-[0.06em] text-[#555]";
const fieldBase =
  "w-full rounded-md border-2 bg-white px-4 py-3 text-[16px] text-ink outline-none scroll-mb-[96px]";
const okCls = `${fieldBase} border-ink focus:border-accent`;
const errCls = `${fieldBase} border-accent`;

export function ContactForm({ intent }: { intent?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const uid = useId();
  const isEstimate = intent === "estimate";

  const fid = (f: string) => `${uid}-${f}`;
  const eid = (f: Field) => `${uid}-${f}-err`;

  function validate(f: Field, v: string): string {
    const s = v.trim();
    if (f === "firstName" && !s) return "Please enter your first name.";
    if (f === "lastName" && !s) return "Please enter your last name.";
    if (f === "phone" && !isValidPhone(s)) return "Enter a 10 digit phone number so we can call you back.";
    if (f === "email" && !isValidEmail(s)) return "Enter a valid email address.";
    if (f === "zip" && !/^\d{5}$/.test(s.replace(/\D/g, "").slice(0, 5))) return "Enter your 5 digit zip code.";
    return "";
  }

  /** On blur, not per keystroke. Per keystroke errors fire while someone is still typing. */
  const onBlur = (f: Field) => (e: FocusEvent<HTMLInputElement>) =>
    setErrors((p) => ({ ...p, [f]: validate(f, e.target.value) || undefined }));

  /** Clear the moment it is fixed, rather than making them submit again to find out. */
  const onChange = (f: Field) => (e: ChangeEvent<HTMLInputElement>) => {
    if (errors[f] && !validate(f, e.target.value)) setErrors((p) => ({ ...p, [f]: undefined }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return; // the button stays enabled for AT, so guard here instead
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => (fd.get(k)?.toString() ?? "").trim();

    const found: Partial<Record<Field, string>> = {};
    for (const f of FIELDS) {
      const msg = validate(f, get(f));
      if (msg) found[f] = msg;
    }
    if (Object.keys(found).length) {
      setErrors(found);
      setFormError("Please check the highlighted fields.");
      setStatus("error");
      document.getElementById(fid(Object.keys(found)[0]))?.focus();
      return;
    }

    setStatus("submitting");
    setFormError("");

    // Deliberately NOT blocking on a missing token. An ad blocker used to make this form
    // permanently unusable. The server decides, and it fails open.
    const token = fd.get("cf-turnstile-response")?.toString();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: get("firstName"),
          lastName: get("lastName"),
          phone: get("phone"),
          email: get("email"),
          zip: get("zip"),
          message: get("message"),
          // Derived from the CTA they arrived through, not asked. The service picker was dropped,
          // but the office still benefits from knowing which door the lead came in.
          service: isEstimate ? "Free estimate" : "Repair",
          source: isEstimate ? "estimate-form" : "contact-form",
          token,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setFormError(json.message ?? "Something went wrong. Please call us at (813) 279-6785.");
        setStatus("error");
        return;
      }
      // Only once the API confirms capture, so the conversion count matches reality.
      track({ event: "generate_lead", lead_source: isEstimate ? "estimate-form" : "contact-form" });
      setStatus("success");
    } catch {
      setFormError("Network error. Please call us at (813) 279-6785.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="text-center">
        <h3 className="font-display text-[22px] font-extrabold uppercase text-ink">Thanks, we&apos;ve got it.</h3>
        <p className="mx-auto mt-2 max-w-[430px] text-[16px] leading-[1.55] text-body">
          A real person will call you back, usually the same day. Need us sooner? Call{" "}
          <a href="tel:18132796785" className="font-bold text-accent">(813) 279-6785</a>.
        </p>
      </div>
    );
  }

  const field = (f: Field, label: string, extra: InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label className={labelCls} htmlFor={fid(f)}>{label}</label>
      <input
        id={fid(f)}
        name={f}
        required
        aria-required="true"
        aria-invalid={errors[f] ? true : undefined}
        aria-describedby={errors[f] ? eid(f) : undefined}
        onBlur={onBlur(f)}
        onChange={onChange(f)}
        className={errors[f] ? errCls : okCls}
        {...extra}
      />
      {errors[f] && (
        <p id={eid(f)} role="alert" className="mt-1.5 text-[14px] font-semibold text-accent">{errors[f]}</p>
      )}
    </div>
  );

  return (
    <>
      {TURNSTILE_SITE_KEY && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      )}
      {/* 3.3.2 is satisfied by an instruction, which avoids five asterisks on a six field form. */}
      <p className="mb-4 text-[14.5px] text-body">All fields are needed except where noted.</p>
      <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field("firstName", "First name", { type: "text", autoComplete: "given-name" })}
        {field("lastName", "Last name", { type: "text", autoComplete: "family-name" })}
        {field("phone", "Phone", { type: "tel", inputMode: "tel", autoComplete: "tel" })}
        {field("email", "Email", { type: "email", inputMode: "email", autoComplete: "email" })}
        {/* NEVER type="number" for a zip: it strips leading zeros and adds spinner arrows. */}
        {field("zip", "Zip code", {
          type: "text", inputMode: "numeric", pattern: "[0-9]*", maxLength: 10, autoComplete: "postal-code",
        })}

        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor={fid("message")}>
            What&apos;s going on? <span className="normal-case text-[#888]">(optional)</span>
          </label>
          <textarea
            id={fid("message")}
            name="message"
            rows={4}
            placeholder="e.g. door won't open, spring looks broken, opener is dead"
            className={okCls}
          />
        </div>

        {TURNSTILE_SITE_KEY && (
          <div
            className="cf-turnstile sm:col-span-2"
            data-sitekey={TURNSTILE_SITE_KEY}
            data-theme="light"
            data-action="contact-form"
          />
        )}

        {status === "error" && formError && (
          <p role="alert" className="text-[15px] font-semibold text-accent sm:col-span-2">{formError}</p>
        )}

        <div className="sm:col-span-2">
          {/*
            aria-disabled, NOT disabled. A native disabled button leaves the tab order and the
            accessibility tree, so a screen reader never hears that the form is sending. The double
            submit guard is at the top of onSubmit instead.
          */}
          <button
            type="submit"
            aria-disabled={status === "submitting"}
            aria-busy={status === "submitting"}
            className="w-full rounded-[7px] bg-accent px-6 py-4 text-[16px] font-extrabold uppercase tracking-[0.04em] text-white hover:bg-accent-dark aria-disabled:opacity-60"
          >
            {status === "submitting" ? "Sending" : "Request My Callback"}
          </button>
          <p className="mt-3 text-center text-[14px] leading-[1.5] text-body">
            A real person calls you back. We use your details to answer you and schedule the work,
            nothing else.
          </p>
        </div>

        <div aria-live="polite" className="sr-only">
          {status === "submitting" ? "Sending your request" : ""}
        </div>
      </form>
    </>
  );
}
