# 03 · Options considered

**Summary.** Six real decisions sat behind the patch shipped as `408f7db`, and none of them was
obvious at the time. The biggest one, whether to keep Turnstile at all, came closest to going the
other way: the spam that triggered the whole hardening on 3 August arrived with **no token**, which
means it never engaged the widget, which means the widget did not catch it and a honeypot probably
would have. Turnstile stayed anyway, and the reasoning below is honest about how thin that margin
is. The other five decisions were about where to store refusals, what status code to return, which
layer to fix the widget at, which alerting mechanism to use, and which widget mode to run. Each
section states the alternatives properly before concluding, because a post-mortem that presents
every chosen path as self-evident teaches nothing.

---

## Decision 1 · Keep Turnstile, or replace it

### The numbers this decision has to survive

| Fact | Value |
|---|---|
| Genuine leads | roughly one every 1.6 days |
| Spam rows captured in 11 days | about 5 of 13 total rows |
| Turnstile solve rate, real browsers, 08-06 to 08-12 | 87 of 141 = **62%** |
| Visitors challenged who never produced a token | **38%** |
| Mean value of a website job | **$2,330** |

Put plainly: the spam check was refusing roughly two out of every five challenged humans on a form
that produces about four genuine leads a week, each worth over two thousand dollars, in order to
block roughly one junk row every two days.

### The alternatives, taken seriously

**A honeypot field.** A hidden input that a human never fills and a naive bot fills every time.
Zero friction, zero third party, zero failure modes for real users, no token to be missing. Its
weakness is well known: it stops dumb bots and does nothing against a targeted script or a human
spammer. Against *this* site's actual spam profile it would have worked. The 3 August spam that
caused all of this was an SEO pitch with a California area code and a throwaway email domain, and
critically it **arrived with no Turnstile token at all**, which is the signature of something
POSTing directly at the endpoint rather than driving the form. A honeypot on the endpoint would
have caught it just as well, because a direct POST does not know which field is the trap either.

**A time to submit check.** Reject anything submitted within a second or two of the page loading.
Cheap, invisible, and effective against automation. Fails against anything that waits, and risks
rejecting a fast returning customer with autofill. Best as one signal among several, not alone.

**Server side IP rate limiting.** Bounds volume rather than judging intent. Would not have stopped
a single hand crafted spam submission, and would not have hurt any real customer. Complementary,
not a replacement.

**Cloudflare rate limiting rules at the zone.** Same reasoning, but enforced at the edge before the
Worker runs, which is strictly better for cost and abuse. The zone is on the **Free plan**, which
limits what is available, and no rule exists today. This is listed as P2 in the remediation and
remains genuinely outstanding.

### Why Turnstile stayed

Three reasons, in descending order of honesty.

1. **The failure was in how we wired it, not in the product.** The 38% non solve rate was
   overwhelmingly caused by our own defects: implicit rendering that never re-ran on client side
   navigation, a reset race, and a managed mode challenge nobody was told about. Ripping out a tool
   because our integration of it was wrong is how you end up making the same class of mistake in the
   replacement. Fix the integration first, then measure, then decide.
2. **Removing it re-opens a real hole.** The route now writes refused submissions to D1. Without
   *some* gate, every direct POST becomes a durable write. The spam gate and the capture path are
   load bearing for each other.
3. **The decision is reversible and cheap to revisit.** After a fortnight of post-fix solve rate
   data we will know whether the residual non solve rate is one percent or fifteen. At one percent
   Turnstile is free. At fifteen it should go, and a honeypot plus a time check plus an edge rate
   limit should replace it.

### The honest counterargument

If this had been a greenfield decision on 29 July, with the volume numbers known in advance, a
honeypot plus a time to submit check plus an edge rate limiting rule would have been the better
engineering call for a form taking four leads a week. It has no third party dependency, no script
to fail to load, no challenge to go unnoticed, no token to be missing, and no 38% tail. Turnstile
is the right tool for a form taking four thousand submissions a week where spam is an operational
cost. At four a week the arithmetic runs the other way, and the entire incident is a consequence of
using a high assurance gate on a low volume, high value funnel.

**We kept it. Note that we kept it partly because it was already there.** That is a real reason and
it is not a good one, and it is written down here so the next decision starts from the arithmetic
rather than the inventory.

---

## Decision 2 · Widget mode: managed, non-interactive, or invisible

The widget was created on 29 July in **Managed** mode. Configuration read directly from the
Cloudflare API during the investigation:

```
mode:            "managed"
domains:         ["trinitygaragedoorservice.com", "www.trinitygaragedoorservice.com"]
bot_fight_mode:  false
clearance_level: "no_clearance"
region:          "world"
```

**Managed** lets Cloudflare decide, and it can escalate to a visible interactive checkbox. That
escalation is exactly what hit the customer on his first two attempts. Reproduced in real WebKit
using Cloudflare's forced interactive test key `3x00000000000000000000FF`:

```
time from load to first token   NEVER  (none after 15s)
value the form would post       ""
callbacks fired                 none  (no error, no expired, no timeout)
submit button                   still fully enabled
```

No callback fires. Nothing appears on the page from our side. The submit button works. From the
visitor's chair the form is ready and the button is broken.

**Non-interactive** shows a spinner and never demands a click. It still runs the same client side
analysis and still fails clients that look automated, but it removes the "waiting for a tick nobody
noticed" state entirely. What it gives up: the subset of visitors who would have been offered a
checkbox and passed by clicking it now simply fail.

**Invisible** shows nothing at all. Best conversion, least signal to the visitor about why a
failure happened, and the same scoring underneath.

**Chosen: non-interactive**, switched in the Cloudflare dashboard on 12 August during this session,
before the code deploy.

The reasoning that decided it: the escalation to a checkbox was **not what caught the spam**. The
3 August spam carried no token, so it never reached a challenge to be escalated. Managed mode was
therefore paying a conversion cost for protection it was not delivering on the only attack this
site has actually seen.

The counterargument, which is real: with the patch applied, the form now shows *"One more step.
Please finish the quick check just above this button"* after 2.5 seconds of waiting. That prompt
makes a managed checkbox survivable in a way it was not before, so managed mode is no longer the
silent killer it was. Non-interactive is still the right default here, but the case is narrower
after the patch than it was before it, and if the post-fix solve rate on non-interactive turns out
worse than expected, going back to managed **with** the prompt in place is a legitimate experiment
rather than a regression.

---

## Decision 3 · Where refused submissions go

### The alternative: a `status` column on `leads`

Genuinely simpler. One table, one schema, one place to look, no duplicated column list, no second
migration, and every existing query keeps working if it learns a `WHERE status = 'ok'` filter. If
this were a greenfield app with no downstream consumers, the column is the better design and the
separate table is over-engineering.

### Why the separate table won anyway

Three reasons, and only the second is decisive.

1. **`leads` already means something.** Several things read it on the assumption that a row is a
   real lead: the Housecall Pro sweep keys off `hcp_status`, the ads specialist is due a Google
   Sheets export of it, and `CLAUDE.md` documents `SELECT * FROM leads` as the way to inspect
   leads. Every one of those would have to learn a filter. This is an argument about diligence, and
   diligence arguments are weak on their own.

2. **The Housecall Pro interlock keys off a `leads` row id.** The guard is
   `verdict === "pass" && leadId !== null`. If a quarantined row carried a `leads.id`, that guard is
   one careless edit from pushing unverified submissions into a production CRM holding 6,000 real
   customers **with no DELETE endpoint**. With a separate table the push path never learns the row
   id at all, so the mistake is not merely unlikely, it is structurally impossible. This is the
   reason that actually decides it: the failure mode is unrecoverable and the cost of prevention is
   one migration.

3. **Retention differs.** Real leads are kept. These prune at 30 days. Nobody should ever be
   writing a `DELETE` against `leads`, and a shared table would require exactly that.

The naming was also deliberate. The table is `unverified_leads`, **not** `spam` or `rejected`. The
failure it exists to catch is a real customer being refused, so whoever opens a row should start
from "this person may be waiting for a call", not from "this is junk". The word describes the check,
not the person.

---

## Decision 4 · Does a captured refusal return 2xx or stay 400?

Returning 200 with a body saying "captured" is tempting. The details are safe, a human has been
alerted, and semantically something did succeed.

**It stays 400.** The client fires the Google Ads conversion on `res.ok`:

```ts
track({ event: "generate_lead", lead_source: leadSource, transaction_id: json.leadRef });
```

A 2xx would report **every refused submission to Google Ads as a conversion** and feed Smart
Bidding on spam. Given this account's whole problem is that its conversion data is already thin and
partly wrong, poisoning it to make an HTTP status read more pleasantly is a bad trade.

The good news travels in the response body instead, where only our own client reads it:

```json
{ "error": "verification_failed", "captured": true, "message": "..." }
```

The client branches on `json.captured` and renders a calm confirmation card, with **no `track()`
call on that branch**. Status line for machines, body for our own UI. The one cost is that anyone
reading raw HTTP logs sees a 400 for something that partially succeeded, which is why the reason is
written into a comment directly above the status code in `route.ts`.

---

## Decision 5 · Fix the widget at the render layer or the submit layer

This is the decision most worth internalising, because the obvious fix would not have worked.

**The submit layer fix** is "before posting, wait for a token; if none arrives, say so". It is the
fix that first suggests itself, and the original remediation brief asked for exactly it.

**It would not have saved this customer on attempts 3, 4 and 5.** Those attempts were made on
`/get-service/repair/`, reached by a `<Link>` click from `/get-service/`. On that page **there was
no widget at all**. Turnstile's implicit rendering scans for `.cf-turnstile` once, when `api.js`
executes; `next/script` dedupes by `src`, so the script never ran again and the newly mounted
container was never scanned. Measured on the production build:

```
A. HARD load of /get-service/          widget mount attempts: 1
B. SOFT nav to /get-service/repair/    widget mount attempts: 0   ← never mounted
C. SOFT nav away and back              widget mount attempts: 0   ← never mounted
```

Waiting for a token from a widget that does not exist waits forever. The submit layer fix would
have converted an instant failure into a twelve second failure.

**Chosen: both, with the render fix as the primary.** `render=explicit` plus an idempotent
`mountWidget()` fixes the structural fault. The submit layer wait is still needed, because it is the
**only** thing that can do anything about the managed interactive challenge, which fires no callback
at all. Neither fix subsumes the other:

| Fault | Render fix | Submit fix |
|---|---|---|
| Widget missing after client navigation | ✅ fixes | ❌ waits forever |
| Managed challenge awaiting a click | ❌ no help | ✅ prompts after 2.5s |
| Two second hole after `reset()` | ❌ no help | ✅ waits for the new token |

The general lesson: **when a fix is proposed at the layer where the symptom appears, check whether
the cause is one layer up.** The symptom was "the POST has no token". The cause was "there is no
widget on this page". Those need different fixes and only one of them is visible from the submit
handler.

---

## Decision 6 · How to alert a human

Five options were costed against a business that receives roughly one genuine lead every 1.6 days.

**Chosen: an inline plain text email at the moment of refusal**, sent in `after()` so the visitor
never waits, addressed by the `UNVERIFIED_ALERT_TO` runtime secret, with the outcome written back to
`unverified_leads.alert_status`.

It wins on one property the others lack: **the alert carries the customer's details, so the alert
is the recovery.** Every other option tells you to go and look something up. At this volume, the
thing you want at 9:40pm is Barbara's replacement reading a name and a phone number, not a metric
crossing a threshold.

Why the others lose:

- **Workers Logs alerting.** Cloudflare has no first class alerting on arbitrary log strings. You
  need Logpush into a sink, then something watching the sink. Most infrastructure, least value, and
  the log line contains no PII so you would still have to go and find the row.
- **A Tail Worker.** Works, and is the "proper" answer at scale. It is a second Worker to deploy,
  version and monitor, doing in a separate process what one function call already does inline.
- **Analytics Engine.** Excellent for rates and trends, deliberately holds no PII, and **cannot
  alert on its own**. The `unverified_leads` table already answers "how many and why" for free.
- **A scheduled anomaly Worker.** The only option that catches *total silence*, which is a real
  blind spot in the chosen approach. It loses on false positives: at 0.6 leads a day, a 48 hour gap
  with no submissions is a completely normal Tuesday, and an alert that cries wolf trains you to
  ignore it. Also awkward to schedule under OpenNext.

**Two things the chosen option genuinely cannot do**, both of which are recorded in
`05-known-gaps.md`: it cannot alert when the route itself is down, and it cannot alert on the
absence of traffic. An external uptime monitor on `GET /api/contact` covers the first. Nothing
currently covers the second.

The alert was also aimed at **the agency and not the office** by default. Until there is a week of
real rows nobody knows what fraction of refusals are spam, and pointing an untriaged stream at
Barbara's inbox on day one would undo the fix from her point of view. Adding the office later is
`wrangler secret put` with no rebuild and no deploy.
