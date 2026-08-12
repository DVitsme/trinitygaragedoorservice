"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useState, useId, useRef, useEffect, useCallback, type FormEvent, type InputHTMLAttributes, type FocusEvent, type ChangeEvent } from "react";
import { THANK_YOU } from "@/lib/booking";
import { isValidPhone, isValidEmail, normalizePhone, maskPhoneDisplay, caretAfterDigit, maskZip } from "@/lib/lead-validation";
import { track, type LeadSource } from "@/lib/analytics";
// Costs nothing extra in the bundle: lib/site.ts is already client side via mobile-menu and open-now.
import { SERVICE_OPTIONS } from "@/lib/site";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * ⚠️ **`render=explicit` is load bearing. Do not drop it back to a bare `api.js`.**
 *
 * With implicit rendering, Turnstile scans the document for `.cf-turnstile` elements once, when
 * `api.js` executes. `next/script` dedupes by `src`, so on a client side navigation from one form
 * page to another the script does NOT run again, the newly mounted container is never scanned, and
 * **the widget simply never appears**. No error, no console warning, an empty box, and every
 * submission from that page arrives with no token and is refused by the server.
 *
 * Measured on the production build on 2026-08-12: a fresh document load of `/get-service/repair/`
 * produced a token in 1.9 to 4.9 seconds, while a `<Link>` click from `/get-service/` to
 * `/get-service/repair/` left the container with zero children and no `cf-turnstile-response` input
 * after 25 seconds. It matches the telemetry from the incident exactly, where one visitor generated
 * seven page loads and only two challenges.
 *
 * This site reaches its forms by `<Link>` from 24 CTAs, including the header button and the sticky
 * mobile bar, which are on every page. So the broken case was the common case.
 */
const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/**
 * How long a submit waits for a token before giving up and posting without one.
 *
 * Two phases on purpose. The first covers the mechanical gaps: a widget still solving on a slow
 * connection, and the roughly two second hole after `turnstile.reset()` where the response field
 * has been cleared and the replacement has not landed. Past that, the likely explanation is a
 * managed interactive challenge sitting on the page waiting for a click nobody noticed, so the
 * second phase says so in words and gives them time to do it.
 *
 * ⚠️ **When the wait runs out we submit ANYWAY.** Withholding the request is the one thing that
 * guarantees the details are lost. The server can tell a Cloudflare outage from a tokenless client
 * and, since the capture path landed, it records a refused submission rather than discarding it.
 * The client's job here is to maximise the chance of a clean pass, never to decide not to try.
 */
const TOKEN_PROMPT_AFTER_MS = 2500;
const TOKEN_GIVE_UP_AFTER_MS = 12000;

/** The slice of Cloudflare's global we use. Typed here so nothing reaches for `any`. */
type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
  getResponse: (id?: string) => string | undefined;
};
const turnstileApi = (): TurnstileApi | undefined =>
  (window as unknown as { turnstile?: TurnstileApi }).turnstile;

type Status = "idle" | "verifying" | "submitting" | "success" | "captured" | "error";
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
    if (status === "success" || status === "captured") successRef.current?.focus();
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
   * Turnstile error text. The two families need opposite advice, and telling the wrong one to
   * disable their blocker is useless because it demonstrably does not fix their case:
   *   `200500`      the iframe could not load at all, so something blocked challenges.cloudflare.com
   *   `300*`/`600*` the widget loaded and ran, and the client was scored. Blockers are irrelevant;
   *                 this is the Firefox strict / Lockdown Mode / Brave on ARM tail.
   *
   * ⚠️ Neither message tells anyone to give up any more. Both now say the form can still be sent,
   * because it can: a submission with no token reaches the server, which records it and puts it in
   * front of a person instead of discarding it. The old copy turned a recoverable problem into a
   * closed door, which is how the incident on 2026-08-11 ended.
   */
  const [tsError, setTsError] = useState("");
  /** Set when the wait for a token runs long, which usually means a challenge is awaiting a click. */
  const [needsCheck, setNeedsCheck] = useState(false);

  // ------------------------------------------------------------------ Turnstile, rendered by us
  /**
   * ## Why this component owns the widget lifecycle now
   *
   * The old version handed the whole job to Cloudflare's implicit rendering: a `.cf-turnstile` div
   * with `data-*` attributes, scanned once when `api.js` ran. Three separate failures came out of
   * that, and only the first one was ever visible:
   *
   *   1. **Managed mode can present an interactive challenge and then say nothing.** Reproduced in
   *      real WebKit with Cloudflare's forced interactive test key: no token after fifteen seconds,
   *      **no error callback, no expired callback, no timeout callback**, nothing on the page, and
   *      a submit button that stayed fully enabled. So a callback based fix alone cannot cover this.
   *      Only our own timeout can, which is what `awaitToken` below is.
   *   2. **Implicit rendering does not survive a client side navigation.** See `TURNSTILE_SRC`.
   *   3. **`reset()` clears the token synchronously and the replacement takes about two seconds.**
   *      Measured at 2082ms in WebKit and 2215ms in Chromium. The production log shows three POSTs
   *      at 01:39:48, 01:39:50 and 01:39:51, all of which land inside that hole.
   *
   * Owning `render` fixes 2, owning the callback fixes 3 by making the token something we know we
   * hold rather than something we read out of the DOM and hope about, and owning the timeout is the
   * only thing that can do anything at all about 1.
   */
  const boxRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const token = useRef("");
  /** Submits parked waiting for a token. Drained by the widget callback, cleared on reset. */
  const waiters = useRef<Array<(t: string) => void>>([]);

  const settleToken = useCallback((value: string) => {
    token.current = value;
    const queued = waiters.current;
    waiters.current = [];
    for (const resolve of queued) resolve(value);
  }, []);

  /**
   * Idempotent. Safe to call repeatedly, from the script's ready hook, from mount, and from the
   * readiness poll, which is deliberate: whichever of them wins, exactly one widget is created.
   * Without the `widgetId.current` guard a re-render would stack duplicate widgets, each minting
   * tokens into a different hidden input.
   */
  const mountWidget = useCallback(() => {
    if (!TURNSTILE_SITE_KEY || widgetId.current || !boxRef.current) return;
    const api = turnstileApi();
    if (!api) return; // api.js has not finished loading; the poll below will come back around
    widgetId.current = api.render(boxRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      // Binds the token to this form, so one minted elsewhere on the site cannot be replayed here.
      // The server checks the same string.
      action: "contact-form",
      theme: "light",
      // Cloudflare's default, stated rather than assumed: a token that expires while someone is
      // still typing is re-minted instead of leaving the form quietly unsubmittable.
      "refresh-expired": "auto",
      callback: (value: string) => {
        setTsError("");
        setNeedsCheck(false);
        settleToken(value);
      },
      // A token is good for 300 seconds. Someone filling this in slowly is normal, so drop ours the
      // moment it goes stale rather than posting a token the server will reject as duplicate.
      "expired-callback": () => settleToken(""),
      "timeout-callback": () => {
        settleToken("");
        try { api.reset(widgetId.current ?? undefined); } catch { /* already gone */ }
      },
      "error-callback": (code: unknown) => {
        const c = String(code ?? "");
        console.warn("[contact] Turnstile error", c);
        settleToken("");
        setTsError(
          c.startsWith("200")
            ? "The verification box could not load, which usually means a browser extension is blocking it. Turn the blocker off for this page, then send the form again, or call us at (813) 279-6785."
            : "Your browser could not finish the verification. You can still send this form, or call us at (813) 279-6785 and we will take the details over the phone.",
        );
      },
    });
  }, [settleToken]);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    mountWidget();
    /*
      The readiness poll is the belt to next/script's braces. `onReady` fires on the load event the
      first time and immediately from cache afterwards, which covers the client navigation case,
      but this form is the only way the business takes a lead online and it has now been broken
      twice by a script lifecycle assumption. Polling for `window.turnstile` costs nothing and does
      not care which of the two paths got there first.
    */
    const poll = setInterval(() => {
      if (widgetId.current) clearInterval(poll);
      else mountWidget();
    }, 200);
    const stopPolling = setTimeout(() => clearInterval(poll), 20000);

    return () => {
      clearInterval(poll);
      clearTimeout(stopPolling);
      // Removing on unmount is what stops an orphaned widget being left behind by a client side
      // navigation away from the form, still holding a container that React has already detached.
      const api = turnstileApi();
      if (api && widgetId.current) {
        try { api.remove(widgetId.current); } catch { /* already removed */ }
      }
      widgetId.current = null;
      token.current = "";
      waiters.current = [];
    };
  }, [mountWidget]);

  /**
   * Resolve with a token, or with "" once the budget runs out.
   *
   * Reads `getResponse` as well as our own state, because the two can legitimately disagree for a
   * moment: `refresh-expired` re-mints without our callback having fired yet in some paths.
   */
  const awaitToken = useCallback(() => {
    if (token.current) return Promise.resolve(token.current);
    const existing = widgetId.current ? turnstileApi()?.getResponse(widgetId.current) : undefined;
    if (existing) {
      token.current = existing;
      return Promise.resolve(existing);
    }
    return new Promise<string>((resolve) => {
      const prompt = setTimeout(() => setNeedsCheck(true), TOKEN_PROMPT_AFTER_MS);
      let giveUp: ReturnType<typeof setTimeout>;
      const onToken = (value: string) => {
        clearTimeout(prompt);
        clearTimeout(giveUp);
        resolve(value);
      };
      giveUp = setTimeout(() => {
        clearTimeout(prompt);
        waiters.current = waiters.current.filter((w) => w !== onToken);
        resolve("");
      }, TOKEN_GIVE_UP_AFTER_MS);
      waiters.current.push(onToken);
    });
  }, []);

  /**
   * Throw away the current token and ask for another.
   *
   * ⚠️ **Clearing our copy is the half that was missing.** `turnstile.reset()` already blanked the
   * hidden input synchronously, so the spent token replay that commit 4cb5cc1 worried about was not
   * what happened; what happened is that the field was empty for the next two seconds and a visitor
   * pressing submit again in that window got refused for a second reason with the same result.
   * Now the next submit finds no token, waits for the new one through `awaitToken`, and sends that.
   */
  const resetWidget = useCallback(() => {
    settleToken("");
    try { turnstileApi()?.reset(widgetId.current ?? undefined); } catch { /* not mounted */ }
  }, [settleToken]);

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
    // The button stays enabled for assistive tech, so the double submit guard lives here instead.
    // "verifying" is in the guard for a concrete reason: the incident log shows three POSTs in four
    // seconds, and without this a visitor tapping through the wait would fire one request per tap.
    if (status === "submitting" || status === "verifying") return;
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

    setFormError("");

    /*
      ⚠️ **We WAIT for a token here rather than reading one out of the DOM and hoping.**

      The comment that used to sit here said the client does not block on a missing token because
      the server decides, and that the reset above is enough. Both halves stopped being true on
      2026-08-03, when a missing token became a hard refusal in production. What the code actually
      did from that day was read `cf-turnstile-response` at the exact instant of the click and post
      whatever was there, which on this site is very often nothing:

        - a managed challenge still waiting for the visitor to tick a box, which announces itself
          through no callback at all,
        - the roughly two second hole after a reset,
        - and, until `render=explicit` landed above, every form page reached by a link.

      Cloudflare's own numbers for this site between 08-06 and 08-12, bots excluded: 141 challenges
      issued, 87 solved. Thirty eight percent of challenged visitors never produced a token, and
      every one of them was refused and left with a red error.

      So: ask for the token, wait a bounded time, say something useful if the wait runs long, and
      then post either way. Posting without a token is no longer a black hole, because the route
      records refused submissions and raises a person. Never skip the request to avoid a refusal.
    */
    setStatus("verifying");
    const verified = await awaitToken();
    setStatus("submitting");

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
          token: verified || undefined,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        message?: string;
        leadRef?: string;
        captured?: boolean;
      };
      if (!res.ok) {
        resetWidget();
        /*
          `captured` means the server has the name, phone, email, zip and message on file and has
          already put them in front of a person. That is a different outcome from a failure and it
          gets different words: a red alert telling someone to refresh is what sent a real customer
          away twice, and refreshing would have thrown away everything he had typed.

          ⚠️ No `track()` call on this branch, deliberately. A refused submission is not a
          conversion, and reporting it as one would feed Smart Bidding on spam.
        */
        if (json.captured) {
          setNeedsCheck(false);
          setStatus("captured");
          return;
        }
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
   * The security check did not finish, and the details were saved and handed to a person anyway.
   *
   * ⚠️ **This card is only ever reached when the SERVER says it captured the submission.** It is not
   * an optimistic message and it must never become one. The route sets `captured` true only when
   * the row was written and an alert is already on its way to somebody, so "someone will call you
   * back" is a statement about what has happened, not a hope.
   *
   * It stays visibly distinct from the success card above rather than pretending nothing went
   * wrong. There is no `/thank-you/` navigation and no conversion, because neither is true here.
   */
  if (status === "captured") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <h3 className="font-display text-[22px] font-extrabold uppercase text-ink">We have your details.</h3>
        <p className="mx-auto mt-2 max-w-[430px] text-[16px] leading-[1.55] text-body">
          The security check on this page did not finish, so a person is picking this one up by hand.
          Someone will call you back. If you would rather not wait, call{" "}
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
        /*
          `onReady` rather than `onLoad`, and that is the difference that fixes the client side
          navigation case. next/script caches by src, so on a second form page in the same document
          `onLoad` never fires again, while `onReady` runs on the load event the first time AND on
          every subsequent mount. It is the documented hook for exactly this, and it is why the
          script tag can stay where it is instead of moving into the layout.
        */
        <Script src={TURNSTILE_SRC} strategy="afterInteractive" onReady={mountWidget} />
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
          /*
            ⚠️ No `cf-turnstile` class and no `data-*` here on purpose. Those are the markers for
            IMPLICIT rendering, and leaving them on would let a stray implicit scan render a SECOND
            widget into this same container. `mountWidget` fills it explicitly; this is just the box.
          */
          <div ref={boxRef} className="sm:col-span-2" />
        )}

        {/*
          Shown when a token has taken longer than a moment to arrive, which in managed mode almost
          always means there is a challenge on the page waiting to be clicked. Cloudflare fires no
          callback for that state, so this timing based nudge is the only thing that can point at
          it. Not a `role="alert"`: nothing has gone wrong yet, and interrupting a screen reader
          mid submit to say "still working" is noise.
        */}
        {needsCheck && (
          <p role="status" className="text-[15px] font-semibold text-ink sm:col-span-2">
            One more step. Please finish the quick check just above this button.
          </p>
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
            aria-disabled={status === "submitting" || status === "verifying"}
            aria-busy={status === "submitting" || status === "verifying"}
            className="w-full rounded-[7px] bg-accent px-6 py-4 text-[16px] font-extrabold uppercase tracking-[0.04em] text-white hover:bg-accent-dark aria-disabled:opacity-60"
          >
            {status === "verifying" ? "Checking" : status === "submitting" ? "Sending" : "Request My Callback"}
          </button>
          <p className="mt-3 text-center text-[14px] leading-[1.5] text-body">
            A real person calls you back. We use your details to answer you and schedule the work,
            nothing else.
          </p>
        </div>

        <div aria-live="polite" className="sr-only">
          {status === "verifying"
            ? "Running a quick security check"
            : status === "submitting"
              ? "Sending your request"
              : ""}
        </div>
      </form>
    </>
  );
}
