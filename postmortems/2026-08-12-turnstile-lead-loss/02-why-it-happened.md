# 02 - Why it happened

**Summary.** Three independent technical faults stacked to refuse this customer, and all three were survivable on their own. What made them fatal was a fourth thing that is not a bug in any file: on 3 August we shipped a security change to the single revenue path of the business without measuring how many legitimate submissions it would refuse, and without leaving any way to observe the refusals afterwards. The change was correct about the spam it was closing. The code comments around it are unusually careful, argue the fail open versus fail closed tradeoff explicitly, and still got this wrong, because they framed "no token" as a binary of attacker or outage and never considered the third case: our own widget failing to mount for an ordinary visitor. That blind spot cost nine days of invisible losses, and the only detector in the entire system turned out to be a customer phoning the owner at ten at night.

---

## 1. The three mechanisms

They are independent. Fixing any one alone would still have lost this customer.

### Mechanism 1: implicit Turnstile rendering does not survive client side navigation

**This is the widest one and the one most likely to recur on a different project.**

Turnstile has two rendering modes. Implicit rendering is the default: you load `api.js`, and when the script executes it scans the document for elements with class `cf-turnstile` and renders a widget into each. Explicit rendering requires `api.js?render=explicit` and a manual `turnstile.render(container, options)` call.

The pre fix code used implicit rendering, with the script tag inside the form component:

```tsx
// components/contact-form.tsx:414 (pre fix)
{TURNSTILE_SITE_KEY && (
  <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
)}
```

```tsx
// components/contact-form.tsx:509-517 (pre fix)
{TURNSTILE_SITE_KEY && (
  <div
    className="cf-turnstile sm:col-span-2"
    data-sitekey={TURNSTILE_SITE_KEY}
    data-theme="light"
    data-action="contact-form"
    data-error-callback="__trinityTurnstileError"
  />
)}
```

This is the documented, idiomatic pattern and it works perfectly on a full page load. The failure is the interaction of two behaviours neither of which is a bug in itself:

1. **Turnstile's implicit scan runs once**, at script execution time. It is not a `MutationObserver`. A `cf-turnstile` element that appears in the DOM later is never picked up.
2. **`next/script` deduplicates by `src`.** Once a script URL has been loaded in the document, mounting the same `<Script>` again does not re append or re execute it. This is correct and desirable behaviour, and it is the whole point of the component.

Put them together in an App Router app where navigation is client side and does not tear down the document, and you get: the first form page mounts, the script loads, the scan finds the div, the widget renders. Navigate to a second page that also hosts the form. React mounts a new `cf-turnstile` div. `next/script` sees `api.js` is already loaded and does nothing. Nothing ever scans the new div. **The form renders with the container present, `window.turnstile` defined and available, and no widget connecting them.**

Measured against a local production build, counting mounts via the `110200` console error that every genuine mount emits on a non allowlisted host:

```
A. HARD load of /get-service/                     widget MOUNT attempts: 1
B. SOFT nav to /get-service/repair/               widget MOUNT attempts: 0   <-- NEVER MOUNTED
   .cf-turnstile div in DOM   : true
   api.js <script> tags       : 1
   window.turnstile available : true
C. SOFT nav away to /services/repair/ and back    widget MOUNT attempts: 0   <-- NEVER MOUNTED
```

Everything looks correct in the DOM. The div is there. The API is there. The connection between them is not.

**Blast radius.** This site has ten pages carrying the form (`/contact/`, `/get-service/`, and eight `/get-service/[topic]/` pages) and twenty four CTAs pointing into them. The header CTA and the sticky mobile bar both target `ROUTES.getStarted = "/get-service/"` and appear on every page. So the broken path is not an edge case, it is the common path: any visitor who reaches a second form page in the same session, or leaves a form page and returns via a link, gets a form that physically cannot be submitted. Only a hard document load directly onto a form page reliably works.

This exactly matches the customer's session: he submitted twice from `/get-service/` where the widget had mounted and a challenge was issued, then navigated to `/get-service/repair/` and submitted three more times where no widget existed at all.

It also explains the odd telemetry that was otherwise inexplicable: he generated seven page loads and only two `challenge_issued` events.

**How to predict this in a different codebase.** The general rule is that **any third party script whose initialisation is a one time DOM scan is incompatible with client side routing**, unless it is either loaded per navigation or driven explicitly. Turnstile, reCAPTCHA v2, some analytics libraries, some payment element libraries and most "just drop this div in" widgets all have this shape. Cloudflare documents SPAs as precisely the reason `?render=explicit` exists. The tell to look for: a widget that works when you paste the URL into the address bar and does not work when you click a link to the same page.

### Mechanism 2: managed mode fails with no callback and no visible signal

The widget was configured `mode: "managed"`, read directly from the Cloudflare API:

```json
{
  "sitekey": "0x4AAAAAAEBKd2inJHyABmFZ",
  "mode": "managed",
  "domains": ["trinitygaragedoorservice.com", "www.trinitygaragedoorservice.com"],
  "bot_fight_mode": false,
  "clearance_level": "no_clearance"
}
```

Managed mode lets Cloudflare escalate to an interactive challenge, a checkbox the visitor must tick, when its automated signals are inconclusive. That is the intended design. The problem is what the failure looks like from the page when the visitor does not tick it.

Reproduced with Cloudflare's forced interactive test sitekey `3x00000000000000000000FF` in real WebKit and in Chromium:

```
time from load to first token : NEVER (no token after 15s)
value the form would post     : ""
events fired                  : none  (no error-callback, no expired-callback, no timeout-callback)
submit button                 : still fully enabled
```

**No callback of any kind fires.** The form has an error callback wired, and it is genuinely good that it does. But an unsolved interactive challenge is not an error condition as far as the widget is concerned; it is a challenge waiting to be completed. So no handler runs, no message appears, and the submit button stays enabled and clickable.

The customer's first two attempts fall here. Cloudflare issued him a challenge, he never solved it, nothing on the page told him there was anything to solve, and the button worked.

Five submits in four seconds is the behaviour of someone hammering a button that appears functional, not someone ignoring a visible checkbox.

**How to predict this in a different codebase.** Ask, for every third party verification widget: *what does the page look like in the state where the widget is working correctly but has not yet produced a value, and can the user submit from that state?* If the answer is "it looks identical to ready" and "yes", you have this bug regardless of vendor.

### Mechanism 3: the reset creates a guaranteed empty token window

Pre fix, on any non ok response the client called `resetWidget()` and set an error:

```tsx
// components/contact-form.tsx:265-272 (pre fix)
/** Fresh token for the next attempt. Safe to call when the widget never mounted. */
const resetWidget = () => {
  try {
    (window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset();
  } catch {
    /* widget not mounted (blocked or still loading); nothing to reset */
  }
};
```

The intent, stated in the comment above it, was to prevent a spent token being replayed. That intent was sound and the mechanism does work: a Turnstile token is redeemable exactly once, and resubmitting a spent one returns `timeout-or-duplicate`.

What it also does, which was not considered, is clear the hidden input **synchronously** while the replacement takes about two seconds to arrive. Measured:

```
token length before turnstile.reset() : 21
reset() threw                         : no
immediately after reset()             : 0     <-- a submit here posts NO token
repopulated after                     : 2082ms (WebKit) / 2215ms (Chromium)
```

Any retry inside that roughly 2.1 second window posts an empty token and is refused for a *different* reason with an *identical* outcome. There was no UI state preventing it: the button was enabled, `status` had been set back to `"error"`, and the double submit guard only covered `"submitting"`.

The production triple at `01:39:48`, `01:39:50` and `01:39:51` sits entirely inside that window.

The bitter detail: the fix for one replay problem created a different tokenless problem with the same user visible result. The customer was locked out by his own retry after all, exactly as the comment feared, just through the other door.

---

## 2. The decision chain

This is the part worth studying. Nothing here was careless.

**3 August, roughly 17:00 EDT.** Spam arrives through the contact form. D1 row id 8: a California area code (805), a throwaway email domain, zip 91360 (Thousand Oaks), and an SEO pitch in the message box. A second spam row, id 9, was written and later deleted by hand; the permanent gap in the `AUTOINCREMENT` sequence is the evidence, since a rolled back insert would have restored the counter.

**The diagnosis was correct and non obvious.** Cloudflare's dashboard was warning that siteverify was not being called, while the code demonstrably rejected bad tokens. Those two facts look contradictory. The resolution was sharp: almost nothing was arriving *with* a token, so the code path that calls siteverify was never being reached. The early return on a missing token meant tokenless submissions were never verified at all. That is a genuine bypass and a genuinely good piece of debugging.

**17:39 EDT, commit `4cb5cc1`**, "fix(security): a missing Turnstile token is now a reject, which is how spam got in".

**18:01 EDT, commit `1142198`**, "fix(security): close the missing-input-response bypass, keep outage resilience". This second commit is subtle and correct: it removed `missing-input-response` and `bad-request` from the fail open list, on the reasoning that both are provoked by the `response` field, which is the one part of the siteverify call an attacker controls.

Twenty two minutes between the two commits. No staged rollout, no measurement window, no canary. Straight to production on the only lead form the business has.

### The reasoning that was right

The comments left behind are better than most production code ever gets. The function header:

```
 * Fail OPEN on our own misconfiguration and on Cloudflare outages; fail CLOSED only on a verdict
 * that actually implicates the visitor.
 *
 * The reasoning, since Cloudflare publishes no guidance either way (their sample code fails
 * closed): a config error or an outage hits 100% of visitors and does not self heal, so failing
 * closed there takes the entire lead form offline for everyone. Letting some spam through for the
 * length of an incident is the cheaper mistake for a business whose leads arrive this way.
```

That is a correct and well argued position, and it is arguing for exactly the right thing: protecting the lead form from being taken offline by our own infrastructure problems.

The fail open list has a stated rule that is genuinely excellent:

```
    The rule for this list: fail open only on states the attacker CANNOT create. A wrong secret
    is ours. An empty response is theirs.
```

And the author explicitly refused to take the easy shortcut of rejecting a missing token before calling siteverify:

```
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
```

Read that carefully. The author *did* consider the case of a real customer arriving with no token. They considered it, took it seriously, and built a mechanism to detect it. The mechanism works exactly as described.

### The precise reasoning error

The error is in this line:

```
   *   reachable, replies `missing-input-response` → the client really sent nothing → reject
```

The inference `the client really sent nothing → reject` is where it breaks. The premise is true. The conclusion does not follow.

The whole analysis is built on a two case model of the world:

1. The visitor is an attacker who chose not to send a token. Fail closed.
2. Cloudflare is down, so nobody can get a token. Fail open.

Case 1 is characterised as attacker controlled and case 2 as infrastructure. The distinction is stated crisply and repeatedly: *"an attacker controls whether a token is present. An attacker does NOT control whether Cloudflare is up or whether our secret is right."*

There is a third case, and it is the one that actually happened:

3. **An ordinary, honest visitor whose browser produced no token because our own widget failed to mount, or presented a challenge they could not see.**

In case 3, "the client really sent nothing" is true, Cloudflare is up, siteverify is reachable, the secret is right, and the visitor is not an attacker. The two case model has no slot for it, so it falls through into case 1 and gets treated as hostile.

And note the asymmetry in how the two cases were reasoned about. The Cloudflare outage case was treated as a *systemic* failure affecting everyone, and therefore worth protecting against. The missing token case was treated as an *individual* choice by a bad actor. Nobody asked the obvious follow up: **how many honest visitors currently arrive with no token, and why?** That is a measurable question. The answer, once measured nine days later, was 38 percent.

The comment even says, correctly, that a config error or outage "hits 100% of visitors and does not self heal". The unexamined assumption is that anything short of 100 percent must be attackers. A failure affecting 38 percent of real browsers is neither an outage nor an attack; it is a bug, and the model had no room for bugs.

### The one line that should have triggered a measurement

From the same block:

```
 * The previous version returned "pass" here so an ad blocker could not make the form unusable.
```

The pre existing code contained a written record that someone had once been worried about exactly this: that a legitimate visitor might arrive without a token for a non malicious reason. That worry was dismissed on the grounds that the old implementation was a bypass, which it was. But the *concern* and the *implementation* were two separate things, and only the implementation was wrong. Discarding the implementation was correct. Discarding the concern was not.

When you remove a safeguard, the argument has to cover the thing the safeguard was protecting against, not just the flaw in how it protected.

---

## 3. The actual root cause

Above all three mechanisms, and above the reasoning error, sits this:

> **A change that could refuse customers was shipped to the single revenue path of the business with no measurement of its false positive rate and no instrumentation to observe refusals after deploy.**

Everything else follows from that. The three technical faults are ordinary bugs of a kind that any codebase accumulates. What turned ordinary bugs into nine days of silent revenue loss is that the system had no way to tell anyone it was rejecting people.

Three properties made it invisible:

**Refusals wrote nothing, anywhere.** The reject returned at `app/api/contact/route.ts:101-112` (pre fix), before `storeLead()` and before `sendEmail()`:

```ts
  const verdict = await verifyTurnstile(secret, data.token, req.headers.get("cf-connecting-ip"));
  if (verdict === "reject") {
    return NextResponse.json(
      {
        error: "verification_failed",
        message:
          "We could not verify that request. Please refresh and try again, or call us at (813) 279-6785 and we will take the details over the phone.",
      },
      { status: 400 },
    );
  }
```

No database row, no email, no metric, no counter. The `console.warn` inside `verifyTurnstile` was the only artefact, and it is a log line with three day retention that nobody was reading. The name, phone, email and message the customer had already typed were held in memory for the length of the request and then garbage collected. This is why the count of leads lost between 3 and 12 August is not merely unknown but **unknowable**.

**The signal to noise ratio of the business hides it.** Genuine leads arrive at roughly one every 1.6 days. There were zero row days on 7, 8 and 10 August, all of them normal. A gap of any plausible length is statistically indistinguishable from a quiet week. Even in hindsight, with the incident fully understood, the daily volume table shows 11 and 12 August each producing exactly one genuine lead, which is *at* the running rate. The volume data has no power to detect this and never will.

**The only detector was a human being.** The failure was discovered because a customer left a voicemail, the owner listened to it at one in the morning, and emailed twice. If that customer had done what most people do, which is give up and call the next company on the search results page, nothing would have surfaced. The detection path depended entirely on an unusually persistent customer and an unusually attentive owner.

---

## 4. Contributing factors

**No staged rollout and no canary.** Twenty two minutes from first commit to second, both straight to production. For a change whose entire purpose is to start refusing requests, there was no period of running it in report only mode, no sampling, no "log what we would have rejected" phase. That phase would have surfaced the 38 percent immediately and at zero cost to customers.

**No alerting on the refusal path.** Not even a counter. The system could not distinguish "no spam today" from "we refused nine people today".

**Comments documented intent, not measured behaviour.** This is the most transferable lesson in the whole incident, because the comments here are genuinely excellent by normal standards and still did not help. They record what the author believed and why, in careful detail. They record no numbers. There is no line saying "measured: X percent of submissions currently arrive without a token". Had anyone written that line, they would have had to go and measure it, and the measurement would have stopped the deploy.

Prose confidence and empirical confidence read identically on the page. A future reader, including the author, cannot tell from a well argued comment whether the claim was verified or merely reasoned. The fix is to require a number, a date and a method next to any claim about how the system behaves in the field.

**A stale comment actively misled the next reader.** At `components/contact-form.tsx:253-262` (pre fix), sitting directly above the token read:

```
    /*
      The client still does NOT block on a missing token; the server decides. What changed on
      2026-08-03 is the server's answer: in production a missing token is now a REJECT, because that
      branch returned before siteverify was ever called and is how spam was getting in.

      ⚠️ Which makes the reset below load bearing. A cf-turnstile-response is redeemed exactly ONCE.
      If the server rejects and the visitor presses submit again, the browser still holds the spent
      token and Cloudflare answers `timeout-or-duplicate`, so a real customer would be locked out by
      their own retry. Every path that lets them retry has to mint a fresh token first.
    */
```

The first sentence describes the client's behaviour accurately and frames it as a deliberate, safe design decision. It *was* a deliberate decision, and it *was* safe, right up until the server's answer changed in the same paragraph the comment describes. The comment documents the change to the server and does not notice that the change invalidates the client side policy it opens with.

This is what made the bug read as intentional to anyone reviewing the file afterwards, including me on first pass. A confident comment explaining why something is fine is a strong signal to stop looking, which is exactly what you do not want at the site of a live defect.

**The health check checked configuration, not function.** `GET /api/contact` reported `turnstile: true` and `turnstileIsTestKey: false` throughout the incident, and both were accurate. The secret existed and was not a test key. It reported nothing about whether the widget could actually produce a token in a real browser, which was the thing that was broken. A green health check across a nine day outage is worse than no health check, because it is actively reassuring.

**The customer facing error message gave advice that could not work.** "Please refresh and try again" is correct advice for a transient failure. This failure was deterministic for that visitor and that navigation path. He refreshed at `01:37:46` and tried again, and the log shows him doing it. The message was written for the failure mode the author imagined (a blocked widget, transient) rather than the one that occurred.

---

## 5. What it cost, stated plainly

- Six refused submissions from one visitor, all details unrecoverable.
- One paid Google Ads click bought and destroyed, campaign `23089568597`. The gclid was captured correctly by `middleware.ts` and then thrown away with the rest of the submission.
- Nine days between regression and fix, during which the number of refused honest visitors is unknowable.
- A measured 38 percent of challenged real browsers producing no token site wide (141 issued, 87 solved, 6 to 12 August, bots excluded).
- Against a business that produces roughly one genuine lead every 1.6 days at a mean website job value of $2,330.

The uncomfortable arithmetic: if the 38 percent refusal rate applied evenly across the nine days at the observed lead rate, the expected loss is on the order of two to three genuine enquiries. One of them is the man from Wesley Chapel. We know about him only because he was stubborn enough to try six times and then pick up the phone.
