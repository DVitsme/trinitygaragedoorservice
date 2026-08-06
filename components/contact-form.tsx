"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useState, useId, useRef, useEffect, type FormEvent, type InputHTMLAttributes, type FocusEvent, type ChangeEvent } from "react";
import { THANK_YOU } from "@/lib/booking";
import { isValidPhone, isValidEmail, normalizePhone, maskPhoneDisplay, caretAfterDigit, maskZip } from "@/lib/lead-validation";
import { track, type LeadSource } from "@/lib/analytics";
// Costs nothing extra in the bundle: lib/site.ts is already client side via mobile-menu and open-now.
import { SERVICE_OPTIONS } from "@/lib/site";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Status = "idle" | "submitting" | "success" | "error";
type Field = "firstName" | "phone" | "email" | "zip";

const FIELDS: Field[] = ["firstName", "phone", "email", "zip"];

/**
 * The lead form.
 *
 * Fields agreed on the 2026-07-29 call, quoting the transcript rather than memory, because an
 * earlier note recorded this wrong and we shipped a field the client had asked us to remove.
 *
 * **Last name is deliberately ABSENT.** Simone at 12:18: *"I don't know if we need their last
 * name... Barbara, who answers the phones, gets these forms. Once she calls them, she can get the
 * rest of these details. However, first name is required, phone number, email address, zip code is
 * required. That's it."* Derrick agreed on the call: *"we can drop off the last."*
 *
 * **Zip IS required**, and that was contested. Lloyd wanted only name, email and phone, arguing
 * people forget their zip. Simone kept it for Jason's team: *"they're going to want to know where
 * they're located"*, so the office does not spend time on a caller in Atlanta.
 *
 * **No pricing.** Jason: *"I don't want to scare people... they may just call around and say what
 * are you charging. I'd rather just them fill out the information, we call them back."* That rules
 * out HCP's package picker, which carries prices. It does NOT rule out the service select below.
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
/**
 * ⚠️ **No `outline-none` here.** It was removed after a keyboard audit: the only focus signal was
 * the border changing from ink to accent, which is a colour-only cue on a border that is already
 * there. That is weak for anyone tabbing through, and colour alone fails 1.4.1. There is now a real
 * offset outline as well, which is the thing you can actually see.
 */
const fieldBase =
  "w-full rounded-md border-2 bg-white px-4 py-3 text-[16px] text-ink scroll-mb-[96px] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const okCls = `${fieldBase} border-ink focus:border-accent`;
const errCls = `${fieldBase} border-accent`;

export function ContactForm({ intent, source }: { intent?: string; source?: LeadSource }) {
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const uid = useId();
  const router = useRouter();
  const successRef = useRef<HTMLDivElement>(null);
  const isEstimate = intent === "estimate";

  // See the note on the success card below: focus is what actually announces it, and what stops
  // focus being dropped on the floor when the form unmounts.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  /**
   * Which door this lead came in by. Written to the `source` column, shown on the office's lead
   * email, and sent as `lead_source` on `generate_lead`.
   *
   * The `?? ` fallback keeps `/get-service/` emitting the two values that already exist in the
   * client's data. Only the per intent request form pages under `/get-service/[topic]/` pass a
   * `source`, and they exist precisely so this value can tell them apart.
   *
   * ⚠️ This is NOT used to preselect the service dropdown below, even though the topic pages know
   * the intent. Preselecting would make "skipped the field" and "chose this service" identical in
   * the data, which is the one signal that answers whether that optional field earns its place.
   * `source` records what they clicked; `service` records what they told us. Two different facts.
   */
  const leadSource: LeadSource = source ?? (isEstimate ? "estimate-form" : "contact-form");

  const fid = (f: string) => `${uid}-${f}`;
  const eid = (f: Field) => `${uid}-${f}-err`;

  function validate(f: Field, v: string): string {
    const s = v.trim();
    if (f === "firstName" && !s) return "Please enter your first name.";
    if (f === "phone" && !isValidPhone(s)) return "Enter a 10 digit phone number so we can call you back.";
    if (f === "email" && !isValidEmail(s)) return "Enter a valid email address.";
    if (f === "zip" && !/^\d{5}$/.test(s.replace(/\D/g, "").slice(0, 5))) return "Enter your 5 digit zip code.";
    return "";
  }

  /** On blur, not per keystroke. Per keystroke errors fire while someone is still typing. */
  const onBlur = (f: Field) => (e: FocusEvent<HTMLInputElement>) =>
    setErrors((p) => ({ ...p, [f]: validate(f, e.target.value) || undefined }));

  /**
   * Live `(813) 279-6785` masking.
   *
   * ⚠️ **Deliberately UNCONTROLLED.** The DOM owns the value and we rewrite it in place. If this JS
   * ever fails, the field degrades to a plain working `<input type="tel">`. A controlled input whose
   * state stopped updating would refuse typing altogether, and this is the only way the business
   * ever contacts a customer, so an unformatted number beats a dead field every time.
   *
   * Runs on React's onChange, which maps to the native `input` event and therefore fires on
   * AUTOFILL as well as typing. Never move this to keydown: autofill does not fire key events, and
   * Android IME keyboards report `event.key` as "Unidentified".
   */
  /**
   * Turnstile error handler. **Required, not optional.** Without a `data-error-callback` the widget
   * throws an UNCAUGHT exception when it fails, which on this form means the visitor sees nothing
   * happen and the lead is silently lost.
   *
   * The error families need opposite advice, and telling the wrong one to disable their blocker is
   * useless because it demonstrably does not fix their case:
   *   `200500`      the iframe could not load at all, so something blocked challenges.cloudflare.com
   *   `300*`/`600*` the widget loaded and ran, and the client was scored. Blockers are irrelevant;
   *                 this is the Firefox strict / Lockdown Mode / Brave on ARM tail. Offer the phone.
   */
  const [tsError, setTsError] = useState("");
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    w.__trinityTurnstileError = (code: unknown) => {
      const c = String(code ?? "");
      console.warn("[contact] Turnstile error", c);
      setTsError(
        c.startsWith("200")
          ? "The verification box could not load, which usually means a browser extension is blocking it. Turn the blocker off for this page, or call us at (813) 279-6785."
          : "Your browser could not complete the verification. Please call us at (813) 279-6785 and we will take the details over the phone.",
      );
    };
    return () => { delete w.__trinityTurnstileError; };
  }, []);

  const prevDigits = useRef("");

  function maskPhone(e: ChangeEvent<HTMLInputElement>) {
    const el = e.currentTarget;
    const native = e.nativeEvent as InputEvent;
    if (native?.isComposing) return; // let an IME finish composing first

    const caret = el.selectionStart ?? el.value.length;
    let before = normalizePhone(el.value.slice(0, caret)).length;
    let digits = el.value.replace(/\D/g, "");

    // A NANP area code can never begin with 1, so a leading 1 is unambiguously a trunk/country
    // code. Handles someone pasting or autofilling "+1 813 279 6785".
    if (digits.length > 1 && digits[0] === "1") {
      digits = digits.slice(1);
      if (before > 0) before -= 1;
    }

    // Deleting a SEPARATOR leaves the digit stream identical, so a naive reformat would be a no-op
    // and the key would appear dead. Remove the digit the user was actually aiming at instead.
    // Keyed off inputType rather than event.key, per the Android IME note above.
    const sameLength = digits.length === prevDigits.current.length;
    if (sameLength && native?.inputType === "deleteContentBackward" && before > 0) {
      digits = digits.slice(0, before - 1) + digits.slice(before);
      before -= 1;
    } else if (sameLength && native?.inputType === "deleteContentForward" && before < digits.length) {
      digits = digits.slice(0, before) + digits.slice(before + 1);
    }

    // Capped here and NOT with a maxLength attribute: maxLength truncates a pasted or autofilled
    // "+18132796785" before this code ever sees it, so the country code could never be stripped.
    digits = digits.slice(0, 10);
    before = Math.min(before, digits.length);

    const next = maskPhoneDisplay(digits);
    prevDigits.current = digits;

    /**
     * ⚠️ **Only touch the DOM when the mask actually changes something.**
     *
     * Writing `el.value` and re-seating the caret on EVERY keystroke, even when the text is already
     * correct, is what turns a cooperating browser extension into a fight. Writing assistants and
     * translators attach to inputs, write to them, and dispatch their own events; if we also rewrite
     * on every event the two can ping pong, and the field appears to freeze and then snap back.
     *
     * Nothing changed means nothing to do, so leave the caret exactly where the browser put it.
     */
    if (el.value === next) return;

    el.value = next;
    try {
      const pos = caretAfterDigit(next, before);
      el.setSelectionRange(pos, pos);
    } catch {
      // setSelectionRange throws on type="number"/"email". This field is type="tel", so this is
      // belt and braces; the displayed value is already correct either way.
    }
  }

  /**
   * Digits only, five max. Same "only write when something changed" rule as the phone, for the same
   * reason: rewriting on every keystroke is what makes a masked field fight a browser extension.
   *
   * Simpler caret maths than the phone because the output is pure digits, so the character index and
   * the digit count are the same number.
   */
  function maskZipField(e: ChangeEvent<HTMLInputElement>) {
    const el = e.currentTarget;
    const caret = el.selectionStart ?? el.value.length;
    const before = el.value.slice(0, caret).replace(/\D/g, "").length;
    const next = maskZip(el.value);
    if (el.value === next) return;
    el.value = next;
    try {
      const pos = Math.min(before, next.length);
      el.setSelectionRange(pos, pos);
    } catch {
      /* not selectable; the value is still correct */
    }
  }

  /** Clear the moment it is fixed, rather than making them submit again to find out. */
  const onChange = (f: Field) => (e: ChangeEvent<HTMLInputElement>) => {
    if (f === "phone") maskPhone(e);
    if (f === "zip") maskZipField(e);
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

    /*
      The client still does NOT block on a missing token; the server decides. What changed on
      2026-08-03 is the server's answer: in production a missing token is now a REJECT, because that
      branch returned before siteverify was ever called and is how spam was getting in.

      ⚠️ Which makes the reset below load bearing. A cf-turnstile-response is redeemed exactly ONCE.
      If the server rejects and the visitor presses submit again, the browser still holds the spent
      token and Cloudflare answers `timeout-or-duplicate`, so a real customer would be locked out by
      their own retry. Every path that lets them retry has to mint a fresh token first.
    */
    const token = fd.get("cf-turnstile-response")?.toString();

    /** Fresh token for the next attempt. Safe to call when the widget never mounted. */
    const resetWidget = () => {
      try {
        (window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset();
      } catch {
        /* widget not mounted (blocked or still loading); nothing to reset */
      }
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: get("firstName"),
          phone: get("phone"),
          email: get("email"),
          zip: get("zip"),
          message: get("message"),
          /*
            ONLY what the customer actually picked. Deliberately NOT falling back to a value derived
            from the CTA.

            The first version wrote a skipped dropdown as "Repair", which made "skipped" and "chose
            a repair" indistinguishable in the data, destroying the one signal that answers whether
            this optional field earns its place. `source` below already records which door they came
            in by, so nothing is lost: that is the field for CTA intent, and this is the field for
            what the customer told us. The lead email renders rows conditionally, so an empty
            service simply omits the row rather than showing a blank one.
          */
          service: get("service") || undefined,
          source: leadSource,
          token,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string; leadRef?: string };
      if (!res.ok) {
        resetWidget();
        setFormError(json.message ?? "Something went wrong. Please call us at (813) 279-6785.");
        setStatus("error");
        return;
      }
      /*
        ⚠️ **The conversion fires HERE, on the form page, and nothing fires on the thank you page.**
        That is the whole design, and it is what makes the thank you page safe:

          - refresh it            nothing fires
          - press Back onto it    nothing fires
          - bookmark or share it  nothing fires
          - Googlebot crawls it   nothing fires

        The only way to record a conversion is to actually submit a form and get a 200 back. A tag
        bound to the thank you URL would fire on every one of those, and GTM's History Change
        trigger fires on `popstate` too, so Back would double count. Do not "improve" this by moving
        the push onto the thank you page.

        A useful side effect: Google Ads reports the conversion URL from `location.pathname` at the
        moment the tag fires, which is this form page. So the Ads webpages report already breaks
        conversions down per form, with no extra configuration and no per form thank you URLs.

        `track()` before `router.push()` needs no callback. A `router.push` is a SAME document
        navigation, so nothing is torn down and the dataLayer, GTM's data model and any in flight
        tag request all survive it. Only a `location.assign()` would need `eventCallback`.
      */
      track({ event: "generate_lead", lead_source: leadSource, transaction_id: json.leadRef });
      // Rendered for the moment before the route resolves, and the fallback if it never does.
      setStatus("success");
      router.push(THANK_YOU);
    } catch {
      resetWidget();
      setFormError("Network error. Please call us at (813) 279-6785.");
      setStatus("error");
    }
  }

  /**
   * The fallback confirmation, shown while `/thank-you/` resolves and left standing if it never
   * does (a chunk that will not load, a navigation blocked by an extension). The lead is already in
   * D1 and the office email is already sent by this point, so this can never be the difference
   * between capturing a lead and losing one. It is only about whether the person believes it worked.
   *
   * ⚠️ **The `tabIndex`/`focus()` pair is load bearing, not decoration.** MDN is explicit that a
   * live region has to exist first and be populated in a SECOND step to be announced; a `role`
   * region that arrives already containing its text generally is not. This element replaces the
   * whole form in one render, so it is exactly the case MDN warns about. Moving focus to it is what
   * actually gets it read out. It also fixes the second half of the bug: the submit button held
   * focus and is unmounted here, which drops focus to `document.body`, so the next Tab restarted
   * from the top of the page with no sign anything had happened.
   */
  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <h3 className="font-display text-[22px] font-extrabold uppercase text-ink">Thanks, we&apos;ve got it.</h3>
        <p className="mx-auto mt-2 max-w-[430px] text-[16px] leading-[1.55] text-body">
          A real person will call you back, usually the same day. Need us sooner? Call{" "}
          <a href="tel:18132796785" className="font-bold text-accent">(813) 279-6785</a>.
        </p>
      </div>
    );
  }

  /**
   * `hint` serves WCAG 3.3.2, which asks for the data format to be stated. The mask now uses the
   * customary US format, so this is no longer strictly required, but it is kept because it warns
   * that the field REFORMATS AS YOU TYPE. That is the surprising part, and the one GOV.UK objection
   * to masking that still applies here: someone transcribing a number off another screen wants to
   * check what they typed against the source, and characters appearing that they did not type makes
   * that harder. Saying so up front costs one line.
   *
   * It is a persistent element, NOT a placeholder, because a placeholder vanishes on the first
   * keystroke and so cannot serve as an instruction. Stated up front rather than announced on
   * change: an aria-live region here would fire on every single keystroke.
   */
  const field = (f: Field, label: string, extra: InputHTMLAttributes<HTMLInputElement>, hint?: string) => {
    const hid = `${uid}-${f}-hint`;
    const describedBy = [errors[f] ? eid(f) : null, hint ? hid : null].filter(Boolean).join(" ");
    return (
      <div>
        <label className={labelCls} htmlFor={fid(f)}>{label}</label>
        <input
          id={fid(f)}
          name={f}
          required
          aria-required="true"
          aria-invalid={errors[f] ? true : undefined}
          aria-describedby={describedBy || undefined}
          onBlur={onBlur(f)}
          onChange={onChange(f)}
          className={errors[f] ? errCls : okCls}
          {...extra}
        />
        {hint && !errors[f] && (
          <p id={hid} className="mt-1.5 text-[13px] leading-[1.4] text-[#777]">{hint}</p>
        )}
        {errors[f] && (
          <p id={eid(f)} role="alert" className="mt-1.5 text-[14px] font-semibold text-accent">{errors[f]}</p>
        )}
      </div>
    );
  };

  return (
    <>
      {TURNSTILE_SITE_KEY && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      )}
      {/* 3.3.2 is satisfied by an instruction, which avoids five asterisks on a six field form. */}
      <p className="mb-4 text-[14.5px] text-body">All fields are needed except where noted.</p>
      <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {field("firstName", "First name", { type: "text", autoComplete: "given-name" })}
        {/* NO maxLength here, on purpose. See the note in maskPhone: it would truncate an autofilled
            "+18132796785" before the country code could be stripped.

            ⚠️ The `data-gramm*` attributes and `spellCheck={false}` opt this field out of Grammarly
            and the browser's spell checker. A phone number has nothing to grammar check, and writing
            assistants attach to inputs, inject an overlay and dispatch their own events, which is a
            known way for a masked field to appear to freeze and then reset. Reported from a real
            browser on 2026-08-01 whose console showed exactly that kind of injected overlay. */}
        {field(
          "phone",
          "Phone",
          {
            type: "tel",
            inputMode: "tel",
            autoComplete: "tel",
            spellCheck: false,
            autoCorrect: "off",
            autoCapitalize: "off",
            ...({ "data-gramm": "false", "data-gramm_editor": "false", "data-enable-grammarly": "false" } as Record<string, string>),
          },
          "10 digit US number. Formats as you type.",
        )}
        {field("email", "Email", { type: "email", inputMode: "email", autoComplete: "email" })}
        {/* NEVER type="number" for a zip: it strips leading zeros and adds spinner arrows. */}
        {field("zip", "Zip code", {
          // maxLength 5, matching the US standard. ZIP+4 is not collected: the service area is
          // matched on the 5 digit zip and the office does not need the +4.
          type: "text", inputMode: "numeric", pattern: "[0-9]*", maxLength: 5, autoComplete: "postal-code",
          // Same reasoning as the phone field: a zip code has nothing to spell check or grammar check.
          spellCheck: false, autoCorrect: "off", autoCapitalize: "off",
          ...({ "data-gramm": "false", "data-gramm_editor": "false", "data-enable-grammarly": "false" } as Record<string, string>),
        })}

        {/*
          Optional service select. Agreed on the 2026-07-29 call and missed in the original build.

          A NATIVE <select>, not a custom listbox: it gets the platform picker on mobile for free,
          which is the control this audience already knows, and it is keyboard and screen reader
          correct without us reimplementing anything.

          ⚠️ 16px, same as the inputs. Safari zooms any focused form control under 16px, and this
          sits directly above the submit button on the page 24 CTAs land on.

          The empty first option is deliberate. Preselecting a service would put words in the
          customer's mouth and quietly skew what the office sees, on a field nobody has to answer.
        */}
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor={fid("service")}>
            What do you need help with? <span className="normal-case text-[#888]">(optional)</span>
          </label>
          <select
            id={fid("service")}
            name="service"
            defaultValue=""
            className={`${okCls} appearance-none pr-11`}
            /*
              Inline style, not a Tailwind arbitrary value. `bg-[url("data:...")]` silently produced
              NO arrow, because Tailwind needs spaces in arbitrary values written as underscores and
              this data URI is full of them. It compiled clean and shipped a select that looked
              exactly like a text input, which a build can never catch. Caught by screenshotting it.
            */
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%231a1a1a' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 14px center",
              backgroundSize: "18px",
            }}
          >
            <option value="">Choose one, or leave this blank</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

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
            data-error-callback="__trinityTurnstileError"
          />
        )}

        {tsError && (
          <p role="alert" className="text-[15px] font-semibold text-accent sm:col-span-2">{tsError}</p>
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
