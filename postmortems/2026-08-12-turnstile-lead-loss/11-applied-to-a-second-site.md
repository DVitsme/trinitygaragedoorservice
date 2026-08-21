# 11 · Applied to a second site, nine days later

**Summary.** On 2026-08-21 this post-mortem was read cover to cover and applied to an unrelated
project: a different client, a different stack (Next.js server actions on Cloudflare Workers, R2
instead of D1), the same Turnstile widget in front of the only online intake the business has. The
prescriptions transferred. Two of them found real defects within an hour. But the most expensive
thing found on that site was **not** the one this document would have predicted, the measurement
instruments had two traps this document does not record, and the investigator repeated the exact
reasoning error catalogued in `01-what-happened.md` §5 while holding this document open.

Nothing here identifies the second client. The mechanisms are the point; the site is not.

---

## 1 · What transferred cleanly

**Principle 3 (never discard user input) found a live hole immediately.** The second site's contact
and careers actions both did this:

```ts
const turnstile = await checkTurnstile(formData);
if (turnstile === "fail" && process.env.NODE_ENV === "production") {
  return { status: "error", error: "captcha" };   // nothing captured, nothing logged
}
```

The striking part: that project already had a full durable-capture failsafe, built a month earlier
for a different reason (email-send failures), writing to R2 with alerting and background retry.
Every other failure path used it. The spam gate was the one branch that returned bare — and the
normalised submission object was already assembled **eleven lines above** the gate and simply went
unused on that path.

**The generalisable lesson, which this document does not state plainly enough: having a capture
mechanism is not the same as every rejection path using it.** Grep for every `return` that ends a
request before the persistence call, and check each one individually. A failsafe with one uncovered
branch reads as "we handle this" right up until the uncovered branch is the one that fires.

**Principle 1 (measure before you enforce) produced a comparable number.** Using the canonical
GraphQL query in `09-measurement-and-monitoring.md` §2.1 with the §3 classification rules, over the
maximum window available: **104 challenges issued to real browsers, 80 solved — 76.9% solve, 23.1%
refusal.** Against this incident's reproducible baseline of 68.5% / 31.5%, a second independent site
on the same product lands in the same band. Two sites is not a trend, but it is one more data point
than a single incident, and it argues the ~25–30% figure is not an artefact of one bad integration.

**The verdict bands in §8 worked as written.** 76.9% falls in the ≤84% "Turnstile is not earning its
place" band, on a sample of 104 which clears the ≥60 minimum.

---

## 2 · Three traps in the instruments, not recorded in §09

Offered as direct additions to `09-measurement-and-monitoring.md` §4.

### 2.1 `turnstileAdaptiveGroups` retention is ~30 days, and it is a hard error

§4.1 records the `1w1h` **window width** cap. It does not record the **retention** cap. A query
reaching further back than about 4w2d fails outright:

```
account ... cannot request data older than 4w2d, but your query requests
data from 5w2d19h53m36s ago     [extensions.code: "quota"]
```

Consequence for this incident's own §8 comparison plan: the 6–12 August baseline **expires around
7 September**. Anyone re-running the comparison after that date cannot reproduce the baseline at
all, only the post-fix number. Snapshot the raw GraphQL response to a file now, or the decision rule
becomes unrunnable.

### 2.2 Solves and issues do not pair 1:1 inside a window

Per-cohort figures from the second site's pull:

```
Chrome / Windows     issued 70  solved 57
Edge / Windows       issued  7  solved  8     <-- 114% solve rate
```

`challenge_issued` and the `*_solved` events are independent rows. A challenge issued at 23:58 and
solved at 00:02 lands its two halves in different windows. At this volume that is a large
proportional error on small cohorts, and it means **the headline denominator carries error of
unknown direction too**.

This does not invalidate §1's baseline correction — the numerator reconciled exactly against the
dashboard, which is what proved the instrument was pointed at the right data. It does mean cohort
breakdowns below ~30 issued should be treated as directional only, and a solve rate above 100% is
the instrument talking, not a miracle.

### 2.3 `console.error` can be invisible in local `wrangler`/OpenNext preview

This incident's investigation was cracked by a retained `console.warn`. On the second project,
adding log lines to the refusal path produced **nothing** in local preview. Diagnosed by putting a
`console.log` and a `console.error` on adjacent lines in the same function and rebuilding:

```
console.log   probe present in output : 1
console.error line present in output  : 0
failsafe's own console.log            : 1
```

Same code path, same request, same build. `console.log` surfaced, `console.error` did not. The
strings were confirmed present in the built bundle first, so this is the log pipeline, not the
compiler.

The practical warning: **local preview cannot be used to confirm that your error logging works**,
and that applies to every pre-existing `console.error` in the project, not just new ones. Production
Workers Logs with `observability.enabled` is the only place to check. Do not conclude "the log line
does not fire" from a local run — that is a §4-class false null, and it nearly caused a working
diagnostic to be ripped out and replaced.

---

## 3 · The reasoning error in §5, repeated while reading §5

`01-what-happened.md` §5 concludes: *"before spending effort developing a hypothesis, name the single
cheapest observation that would kill it, and go get that first."*

The second investigation generated a hypothesis that fit beautifully. That project used
`<Script onLoad>` to gate its Turnstile mount. `next/script` caches by `src`, so on a client-side
navigation back to a form page `onLoad` should not refire, the ready flag should stay false, and
`render()` should never be called — mechanism 1 of this incident, arriving through a different door.
It was reported to the client as **confirmed**.

It was wrong. Building both versions and running the same test showed the widget mounting correctly
on a hard load **and** after navigating away and back, before and after the change.

The "confirmation" was two instrument failures stacked:

1. **A selector that could not match.** Mount detection used
   `iframe[src*="challenges.cloudflare.com"]`. Turnstile injects a `<div>` plus a hidden
   `cf-chl-widget-*_response` input, and its iframe `src` does not match that pattern. Every real
   mount read as zero. This is §4's "validate the instrument on a known good case" — the check was
   never run against a page where the widget was known to be working.
2. **A stale server.** A `pkill` had not actually killed the previous `next start`, so the "after"
   measurement was served by the old process returning 500s for chunks a rebuild had replaced. The
   port was never checked.

Both were cheap to falsify and neither was falsified before the claim went out. The corrective this
document already prescribes is right; **reading it is not the same as executing it**, and the
failure mode is specifically that a hypothesis which matches a documented prior feels like it has
already been checked.

The fix shipped anyway, because the *other* defect it addressed was real (see §4), but the code
comment was rewritten to record the disproof. A comment asserting an unverified mechanism is exactly
what `02-why-it-happened.md` §4 warns about: a confident explanation is a strong signal to stop
looking.

---

## 4 · What this document would not have found

The second site's largest silent lead-loss defect had nothing to do with Turnstile, and this
post-mortem contains no principle that points at it.

The contact form's optional "what are you interested in" dropdown used the ordinary pattern of a
placeholder option:

```html
<select name="interest" defaultValue="">
  <option value="" disabled>Are You Interested in...</option>
```

Per the HTML form-data construction algorithm, a `select` contributes an entry only for an option
that is **selected and not disabled**. The placeholder is selected by default and disabled, so an
untouched dropdown submits **no key at all** — not `""`. The server-side schema required the field
without marking it optional, received `undefined`, and rejected the entire submission.

The visitor got *"Please check the highlighted fields and try again"* with nothing highlighted, on a
field carrying no visible label, no `required` attribute and no asterisk. There is no path from that
message to a successful submission except guessing which field is wrong.

Every visitor who ignored an optional-looking dropdown was refused. It had been live since the form
shipped, and it is plausibly a larger source of lost enquiries than the 23% Turnstile figure that
prompted the review.

**Two things generalise:**

**Disabled placeholder options are a silent-rejection pattern.** The markup is idiomatic and appears
in tutorials. Combined with any server-side schema that requires the field, it produces a form that
refuses a subset of honest users with an unactionable message. Worth its own grep across any project
with forms: `<option value="" disabled`.

**A new principle this incident's §06 is missing — "every rejection must name its cause to the
person who can fix it."** This post-mortem is thorough on making refusals visible to *the operator*
(capture, alerting, logs). It says nothing about making them actionable for *the visitor*. Both
sites failed this: this incident told a customer to "refresh and try again" for a deterministic
failure, and the second site said "check the highlighted fields" while highlighting none. In both
cases the operator-facing telemetry and the user-facing message were designed for different failure
modes than the ones that occurred. On the second project, field-level validation errors were being
computed by the server, returned in the response, and rendered nowhere — the information existed and
never reached the one person who could act on it.

---

## 5 · A note on the copy that follows a mode change

`03-options-considered.md` decision 2 chose non-interactive over managed. The second site made the
same change mid-review. It immediately invalidated three user-facing strings that told the visitor
to "complete the verification just below" — in non-interactive mode there is nothing to complete, so
that is an instruction which cannot be followed.

That is the same class of defect as this incident's *"Please refresh and try again"*: advice written
for the failure mode the author imagined. Worth adding to decision 2 as a checklist item — **a
widget mode change is also a copy change**, and the coupling should be recorded next to the strings
so a later flip back does not silently reintroduce the mismatch.

---

## 6 · Net assessment

Of the eight principles in `06-prevention.md`, applied to a genuinely different codebase:

| Principle | Outcome on the second site |
|---|---|
| 1. Measure the refusal rate before enforcing | Produced 76.9% / 23.1% on a 104-challenge sample. Worked as written |
| 2. Shadow mode as the standard rollout | Not exercised; no new gate was shipped |
| 3. A rejection path must never discard input | **Found a live hole in under an hour.** Highest-value principle in the document |
| 4. Verify at the layer the user experiences | Found the real defect (submit not gated on a token) and disproved the false one |
| 5. Validate the instrument before trusting a null | **Violated twice**, both times producing a confident wrong answer. See §3 |
| 6. Third-party widgets in client-routed apps | Correctly flagged as a hazard class; the specific mechanism did not reproduce |
| 7. Comments record intent, only telemetry records behaviour | Caught a comment asserting an unverified mechanism, before it shipped |
| 8. "A customer phones the owner" is not monitoring | Still true on the second site: captured refusals have no reader and no alert channel configured |

The document's own thesis survives contact with a second codebase. The principle that earned its
place twice over is number 3. The one most easily read and not executed is number 5.

---

## Sources

All findings are from applying this post-mortem to a second production site on 2026-08-21. The
measurement method is this folder's `09-measurement-and-monitoring.md` §2.1 and §3, unchanged.
Retention cap, event-pairing behaviour and the `console.error` visibility finding were each observed
directly and are reproducible from the queries in §2.
