# 08 · Where the write ahead log lives: R2 versus D1

**Summary.** After the incident the owner asked for every submission to be recorded, spam and
malformed included, before any gate runs, as plain text in monthly files under year folders. He said
"Cloudflare's DB" while describing a filesystem, so the first job was resolving that. Three
independent analyses ran: paper research on the Cloudflare docs recommended **R2**, an independent
second opinion recommended **D1**, and a hands on spike that built both on the real `workerd` runtime
recommended **D1**. **The verdict is D1**, with the plain text monthly file produced as a derived
export rather than stored. The decision was not made on latency or cost, which are a tie. It was made
on failure modes: R2's `put` silently discards on key collision and reports success, Wrangler cannot
enumerate R2 objects at all, and a single null byte from one spammer makes an entire month's text
file silently unsearchable. The strongest surviving argument for R2, that D1's write quota is shared
with the real `leads` table, is unmeasured and is the reason rate limiting has to land before the WAL
rather than after.

---

## 1. Separate the artifact from the engine

The owner's requirement, in his words: *"I cannot allow another situation where I cannot tell the
client that I do not know what happened to the form submissions. I would rather have a file filled
with spam than have nothing."*

That is two things, and only one of them is the file.

- **The requirement** is a lookup guarantee. Someone will name a person or a day, and he needs an
  answer, six months later, without calling anyone.
- **The file** is his mental model of how that guarantee is made durable. It is a good instinct,
  because a file cannot be broken by a query he does not know how to write.

The file was never really a storage question. The spike proved this directly: the D1 export and the
R2 compaction produced **byte identical** monthly output, 114,380 bytes from each, for the same 100
records. Whatever wins on storage, he gets the same artifact.

**One correction to the premise, stated once so it is on the record.** D1 is a SQL database. It
stores rows, not files, and there is no way to put a monthly text file "inside" it that makes it a
text file. R2 is Cloudflare's object storage and does give literal `.txt` objects under literal
`2026/08/` prefixes. So the choice was real, and the phrasing in the original request did not settle
it either way.

---

## 2. The three analyses, and where they split

| Analysis | Method | Verdict |
|---|---|---|
| Storage research | Cloudflare docs, no code | **R2**, one object per submission, monthly file generated on demand |
| Independent second opinion | Reasoned from the requirement, no code, no sight of the other two | **D1**, `submission_log` table, monthly file generated on demand |
| Hands on spike | Built both, ran both under `pnpm preview` on real `workerd` | **D1**, monthly file by export |

They converged on more than they disagreed on, and the convergence is worth recording because it
holds regardless of which store you pick:

1. **The monthly append design is broken.** All three rejected it independently.
2. **The write must be awaited, not deferred to `after()`.**
3. **The monthly file should be generated on demand, not stored** as a continuously mutated object.
4. **`req.json()` must become `req.text()` plus `JSON.parse`**, or a malformed body is unrecoverable.
5. **The original bug was ordering, not storage.** Every gate returned before any sink. Changing
   which product the bytes land in does not fix a `return` in the wrong place.

Point 5 deserves emphasis because it is the one most likely to be forgotten. **Do the ordering fix
first. It is independent of this entire document.**

The split was on which store is primary. The paper research weighted sink independence and human
legibility. The second opinion and the spike weighted failure modes and the read path.

---

## 3. The R2 append problem, documented so nobody proposes it again

The owner asked for one file per month, appended to. That is not buildable on R2, and the reasons are
structural rather than inconvenient.

**Objects are immutable and there is no append operation.** `put()` replaces the entire object. The
[Workers API reference](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/)
lists `head`, `get`, `put`, `delete`, `list`, and the multipart methods, with no append. The
[S3 compatibility matrix](https://developers.cloudflare.com/r2/api/s3/api/) has no append either.

**Read modify write races, and it is documented.**
[R2 consistency](https://developers.cloudflare.com/r2/reference/consistency/): *"In the event two
clients are writing to the same key, the last writer to complete wins."* You can make it safe with a
compare and swap using `onlyIf: { etagMatches }` and a retry loop, but you have then put a
distributed systems retry loop on the front of the only revenue path, and every retry burns against
the limit below.

**There is a hard 1 write per second per key limit.** From
[R2 limits](https://developers.cloudflare.com/r2/platform/limits/), verified verbatim:

```
Maximum concurrent writes to the same object name (key)     1 per second
Concurrent writes to the same object name (key) at a higher rate
return HTTP 429 (rate limited) responses.
```

The monthly append design funnels every submission in a calendar month through one key. Two
submissions in the same second is not exotic: one customer double clicking, one bot loop, one
campaign spike. And the loss is **correlated with the events you most need to see**, because bursts
are exactly when floods and incidents happen. The log goes blind precisely when it matters.

**Multipart upload is not an append mechanism here.** From
[uploading objects](https://developers.cloudflare.com/r2/objects/upload-objects/), verified verbatim:

```
Minimum part size: 5 MiB (except for the last part)
All parts except the last must be the same size
```

At roughly 1.1 KB per record you need about 4,700 submissions to fill one part, which at this
business's volume is several years. Undersized parts are rejected. Records are variable length so
"all parts the same size" would require padding. And the object does not exist until the upload is
completed, so an in progress month would be unreadable, which destroys the entire purpose.

**Therefore, if R2 is used at all, it is one object per submission.** Unique keys make the 1 per
second limit structurally unreachable and the blast radius of any single failure is exactly one
record. That is the only defensible R2 shape, and it is the shape the spike tested.

---

## 4. What the spike measured

Both paths built, both run under `pnpm preview` (real `workerd` via Miniflare), local only, no bucket
created, no deploy. Record size 1,156 to 1,158 bytes: a header line, twelve indented fields, an
indented free text message.

### 4.1 Latency is a tie, and the first measurement was wrong by 20x

First run, after roughly 100 requests and three hot reloads on one long lived preview session:

| | min | p50 | p95 | mean |
|---|---|---|---|---|
| R2 put | 11 | **125** | 211 | 143.7 |
| D1 insert | 8 | **114** | 194 | 117.9 |

`workerd` was sitting at 96% CPU while idle. After killing it and restarting the preview, the
identical code gave:

| | min | p50 | p95 | mean |
|---|---|---|---|---|
| R2 put | 3 | **5** | 56 | 12.4 |
| D1 insert | 2 | **5** | 59 | 12.6 |

Three confirmation runs of n=50 each: R2 p50 7 / 7 / 4, D1 p50 5 / 6 / 3.

**A long lived `wrangler dev` session degrades and silently multiplies every storage timing by about
twenty.** Restart the preview before any benchmark. This is the single most expensive gotcha in the
spike, and it is a good example of principle 5 in [`06-prevention.md`](06-prevention.md): the
instrument was lying and the number looked plausible enough to publish.

Corrected conclusion: **R2 `put` and D1 `INSERT` are indistinguishable locally**, p50 around 5ms,
both with a tail to roughly 60ms. Neither is a reason to pick the other, and neither predicts
production.

### 4.2 Twenty concurrent writes to distinct keys: no losses either way

```
R2: wallMs 194  fulfilled 20  rejected 0  objects persisted 20
D1: wallMs 231  fulfilled 20  rejected 0  rows persisted 20
    idOrder: 000,001,002,...,019
```

The perfect id ordering is a **local artifact**. Miniflare serialises D1 through one Durable Object.
Production D1 is a network service and concurrent inserts carry no ordering guarantee. **Order by
`received_at`, never by `id`.**

### 4.3 The collision result, which is what actually decided this

Throughput was never the risk. Two attempts landing on the same key is. Twenty writes, same key:

```json
"r2": { "put_fulfilled": 20, "put_rejected": 0, "objectsAtKey": 1,
        "survivingBody": "body number 19", "recordsLost": 19 }
"d1": { "insert_fulfilled": 1, "insert_rejected": 19,
        "firstError": "D1_ERROR: UNIQUE constraint failed: attempt_log.attempt_id: SQLITE_CONSTRAINT" }
```

**R2 reported success twenty times and kept one record.** D1 kept one and raised nineteen errors.

For a log whose entire purpose is that nothing is ever silently dropped, R2's `put` has the wrong
failure mode by default, and the
[Workers binding API](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/)
offers no conditional put if absent to correct it with. `onlyIf` supports etag and time based
preconditions, which help with read modify write, not with "refuse if this key already exists".

A collision requires a duplicate key, which a good id generator makes unlikely. That is not the
point. The point is what happens *when* the unlikely thing happens: one store tells you, the other
does not.

### 4.4 Compaction has three separate bugs and the spike hit all three

Cost first, on a fresh server: 100 objects compacted in `listCalls 1, readMs 62, putMs 6, total
72ms`. At 1,200 objects: `listCalls 2, readMs 643, putMs 124, total 865ms`. There is no bulk get, so
it is one round trip per object. The D1 equivalent is one query, 82ms.

**Bug 1: the race destroys records.** Compaction lists 20 objects, stalls 6 seconds, a real
submission arrives at t+2, then the job deletes by re-listing the prefix:

```json
{"objects":20, "deletedNaive":21, "survivorsUnderPrefix":0, "monthlyBytes":22860}
monthly file: 20 records.  RACER-VICTIM present: 0
```

The submission was written to R2, deleted by the compactor, and appears in no monthly file. Gone. The
same submission on the D1 side was intact.

**Bug 2: the obvious fix causes a worse one.** Delete only the keys captured in step 1 and the racer
survives. But R2 has no append, so `put` replaces the whole object. Re-running compaction with one
loose object left:

```json
{"objects":1, "monthlyBytes":692}
```

The monthly file went from **22,860 bytes and 20 records to 692 bytes and 1 record**. A second run of
the scheduled job, in the same month, destroyed twenty records. Correct compaction has to read the
existing monthly object and merge, which is a read modify write on a growing object that is itself
racy between two compactor runs.

**Bug 3, latent.** Inputs live at `2026/08/...` and the output at `2026/2026-08.txt`. Both are under
`2026/`. A compactor that lists `2026/` instead of `2026/08/` folds the monthly file into itself and
doubles it on every run.

Also: R2 `list` caps at 1,000 keys per call and must be paginated. Key ordering is load bearing,
because lexicographic sort is chronological only while the timestamps stay fixed width and always
`Z` suffixed.

### 4.5 `wrangler r2 object list` does not exist

```
$ wrangler r2 object list trinity-attempt-log --prefix 2026/08/ --local
✘ [ERROR] Unknown arguments: prefix, local, list, trinity-attempt-log
```

`wrangler r2 object` has exactly `get`, `put`, `delete`
([Wrangler commands](https://developers.cloudflare.com/workers/wrangler/commands/)).
`wrangler r2 bucket list` lists buckets, not objects. **Wrangler cannot enumerate R2 objects.**

That is not cosmetic. A key looks like `2026/08/2026-08-12T17-26-20.160Z-seed-0000.txt`, so to `get`
one you need the exact millisecond and the attempt id. You cannot guess it. **Between compaction
runs an R2 attempt log is write only from the CLI**, and that window is exactly the one the six lost
submissions were in. The whole point of this system is answering "what happened to this person's
submission, right now."

Once the monthly file exists both are fine. Same question, both stores:

```
$ wrangler d1 execute DB --local --json \
    --command "SELECT body FROM attempt_log WHERE body LIKE '%<search term>%'" \
  | jq -r '.[0].results[0].body'
real  0m7.050s
```

```
$ wrangler r2 object get trinity-attempt-log/2026/2026-08.txt --local --pipe > 2026-08.txt
real  0m4.744s      (114380 bytes)
$ grep -B4 -A1 "<search term>" 2026-08.txt
```

Two ergonomic notes. `wrangler d1 execute` prints the body as a JSON string with escaped newlines, so
`--json | jq -r` is required or it is unreadable as text. And local R2 stores no folder tree: the
`2026/08/` "folders" are a key prefix in a flat namespace, both locally and in production, so nothing
can be `ls`'d or `grep -r`'d.

### 4.6 Torture tests: storage is fine, the text format is not

| Case | Rendered | R2 round trip | D1 round trip | SQLite `length()` |
|---|---|---|---|---|
| newlines in a field | 255 B | identical | identical | 255 |
| `=== ATTEMPT` in message | 346 B | identical | identical | 346 |
| 64 KB message | 65,704 B | identical | identical | 65,704 |
| unicode, emoji, RTL | 391 B | identical | identical | 318 |
| null byte | 189 B | identical | identical | **96** |
| lone surrogate | 243 B | **not identical** | **not identical** | 239 |
| `=== ATTEMPT` in **name** | 328 B | identical | identical | 328 |

**Boundary forgery works, through the `name` field.** The message field survived only by luck: the
renderer indents every line of the message by four spaces, so a forged marker lands at column five.
The single line fields get no such treatment. Seven submissions stored, and the compacted file
presents eight `^=== ATTEMPT` boundaries:

```
36:=== ATTEMPT 2026-08-12T17:22:18.872Z  id=t-forge2 ===
37-  source      : torture
38-  name        : Mallory
39-=== ATTEMPT 1999-01-01T00:00:00.000Z  id=FORGED ===
40-  name        : Fake Person
41-  phone       : (000) 000-0000
42---- END FORGED ---
43-  phone       : (813) 555-0100
```

A complete, well formed, entirely fabricated record, indistinguishable from a real one to a parser or
to a person reading the file.

**Three null bytes blind grep across an entire month.** One spam submission carrying NULs, inside a
181,520 byte file:

```
$ grep -c "<search term>" 2026-08-torture.txt
   exit=1                    <- prints nothing. Identical to "not found".
$ grep -ac "<search term>" 2026-08-torture.txt
11                           <- it was there all along
$ tr -dc '\000' < file | wc -c
3
```

`file` still reports "ASCII text". The owner's actual workflow, open the file and search for a phone
number, returns silence for **all 106 records**, not just the poisoned one. This is the failure this
whole project exists to prevent, reproduced by the fix.

**D1's version of the same problem is narrower.** SQLite terminates string operations at the first
NUL, so `length()` reports 96 rather than 189 and a `LIKE` on text after the NUL does not match. But
the bytes are intact, an export recovers everything, and only that one row is affected. **R2's blast
radius is the whole month. D1's is one record.**

**Lone surrogate corrupts on both paths.** 243 bytes in, 255 out, characters replaced. Neither store
can promise byte exactness for arbitrary browser input unless you store bytes rather than text.

**Size ceilings**, local, quotas not enforced: R2 accepted everything up to 8 MB; D1 accepted 2 MB and
failed at 4 MB with `D1_ERROR: string or blob too big: SQLITE_TOOBIG`.

---

## 5. The argument for R2 that was genuinely good, and why it lost

**Sink independence.** The incident was "the one recording path had a hole in it." Putting the safety
net in the same database, reached through the same `getCloudflareContext().env`, written by the same
handler, means it fails in correlated ways with the thing it insures. That is a real anti pattern and
it is not answered by "D1 is reliable", because the incident was not caused by unreliability. It was
caused by a confident argument with a case missing.

Cloudflare's own guidance also points that way:
[storage options](https://developers.cloudflare.com/workers/platform/storage-options/) lists log and
event data under R2.

**Why it lost.** The independence is thinner than it looks. Both bindings live in the same Worker,
the same `wrangler.jsonc`, the same deploy, the same account, the same billing state. A suspended
account, a botched deploy, or a `main` pointing at a stale bundle takes out R2 and D1 together.

**The genuinely independent sink already exists, and it is Resend.** It is a different vendor on a
different network with a different failure mode, and it is the reason both real leads survived on 11
and 12 August while D1 and the Worker were doing whatever they were doing. If you want blast radius
diversity, the highest value move is not swapping Cloudflare products, it is making sure the email
path fires on the WAL write too.

Two smaller R2 arguments, recorded honestly:

- **Append only by construction.** No `UPDATE`, no schema, no migration, and
  [bucket locks](https://developers.cloudflare.com/r2/buckets/bucket-locks/) can prevent deletion and
  overwriting for a set period or indefinitely. D1 has no equivalent. This is a real advantage for
  tamper evidence, and it is also in direct tension with section 7 below, because an immutable record
  cannot be stamped with the outcome.
- **Plain text survives people, not just processes.** True, and undercut by section 4.5: getting to
  an R2 object requires exactly as much tooling and account access as a D1 query, and Wrangler cannot
  even list them.

---

## 6. The argument against D1 that is still unresolved

**D1's write quota is account wide and shared with the real `leads` table.**

The [D1 limits page](https://developers.cloudflare.com/d1/platform/limits/) and
[D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/) put the Workers Free allowance at
100,000 rows written per day across the account. Index writes count, so a table with two indexes
costs roughly three rows written per insert. Exceeding the quota does not degrade to read only; the
D1 API returns errors, which takes out **every database on the account**, including real lead capture.

Migration `0005` already anticipated this in its own comment:

> *"…writing it would hand anyone with a loop a way to consume the daily D1 write allowance that the
> real `leads` table shares."*

A WAL that writes on **every** request, before any gate, is precisely that loop with the safety
catch removed. R2 has no shared quota with D1, so this argument is real and it is the strongest
surviving case for R2.

**It is unmeasured.** The spike could not exercise production D1 quotas, and the Workers plan for this
account was inferred rather than confirmed (the 3 day Workers Logs retention observed during the
investigation matches the Free plan figure on
[Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/); Paid is 7
days). Confirm the plan in the dashboard before relying on any of the numbers above.

**The mitigation, and it is a sequencing requirement not a nice to have: rate limiting must land
before the WAL, not after.** Options are
[rate limiting rules](https://developers.cloudflare.com/waf/rate-limiting-rules/), which on a Free
zone are heavily restricted, and the
[Workers rate limiting binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/),
which is per colo and eventually consistent with a `period` of 10 or 60 seconds. Test which is
actually available on this account rather than designing around an assumption.

A second mitigation worth building regardless: submissions with no name, no plausible phone and no
plausible email get **counted, not stored**, as an hourly aggregate row. That keeps faith with
"account for every request" while making a flood cost one write an hour instead of one per request.
Capture everything is not the same as store every byte of everything.

---

## 7. The structural point that matters more than the storage choice

**A write ahead log is written before the gates. An immutable store therefore cannot record what
happened to the submission.**

This is the part that no amount of storage tuning fixes, and it is why R2 as primary fails the actual
requirement rather than merely being awkward.

The owner's sentence is *"I cannot tell the client what happened to the form submissions."* Not "a
submission arrived." **What happened to it.** Was it refused, and by which gate. Did the office email
send. Is there a `leads` row. Was anyone told.

None of that is known at the moment the WAL entry is written, because the WAL is deliberately
upstream of every gate. So the record has to be updated afterwards, and R2 objects are immutable:
`put()` replaces the whole object, which reintroduces read modify write and everything in section 3.

D1 permits a second `UPDATE` at the end of the request stamping `outcome`, `gate`,
`response_status`, `lead_id` and `unverified_id`. That gives a fourth state nobody currently has:

```
outcome IS NULL   →  "we began handling this request and never finished it"
```

That state would have made the incident visible on day one. Six requests arriving, six entries
written, and either six refusals stamped or six rows left NULL. Either way somebody would have had a
number to look at instead of waiting nine days for a voicemail.

Two related consequences:

- **A missing R2 monthly file is an ambiguous null.** No submissions that month, or the binding was
  dropped in a refactor, or the write threw and was swallowed, or the key was computed wrong. `SELECT
  COUNT(*)` returning `0` is an affirmative statement that the instrument ran and found nothing.
  Principle 5 of [`06-prevention.md`](06-prevention.md) is exactly this, and the file design
  reproduces the epistemics of the incident.
- **A gap in `INTEGER PRIMARY KEY AUTOINCREMENT` is evidence of loss. A gap in a timestamp series is
  invisible.** You cannot prove a text log is complete. Note the caveat: a rolled back insert burns an
  id, so gaps are evidence rather than proof. Evidence is still infinitely more than nothing.

---

## 8. What the spike could not settle

Recorded so nobody mistakes the local results for production facts.

| Unknown | Why it matters |
|---|---|
| **Production latency** | Everything measured was Miniflare on one loaded laptop. Real R2 is object storage over the network, real D1 is a hop to a single primary whose distance from the edge varies. The local tie predicts nothing about the production ordering. |
| **Workers subrequest limit against compaction** | Each R2 operation is a subrequest, and [Workers limits](https://developers.cloudflare.com/workers/platform/limits/) cap these per invocation. 1,200 objects compacted fine locally only because **Miniflare does not enforce the limit**. A busy month could fail the compaction job outright. This is the strongest unmeasured argument against R2. |
| **Production D1 quotas** | The 2 MB local ceiling is plain SQLite. Production row and statement limits are stricter and were not exercised. |
| **Cost at real volume** | No pricing comparison was run. Both are $0 at this volume by inspection of [R2 pricing](https://developers.cloudflare.com/r2/pricing/) and [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), but that was not measured. |
| **R2 S3 API and dashboard** | Both can list objects in production and would soften section 4.5 considerably. Neither is reachable from local Miniflare. |
| **Backup and retention** | [D1 Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/) and [R2 object lifecycles](https://developers.cloudflare.com/r2/buckets/object-lifecycles/) were not exercised. Note Time Travel cannot be disabled, which matters for deletion requests. |

---

## 9. The chosen design

### 9.1 Table

```sql
-- db/migrations/0006_submission_log.sql
CREATE TABLE IF NOT EXISTS submission_log (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,  -- gaps are evidence of loss
  attempt_id    TEXT NOT NULL UNIQUE,               -- see hardening rule 1
  received_at   TEXT NOT NULL DEFAULT (datetime('now')),  -- UTC, always
  ray           TEXT,        -- cf-ray: the join key into Cloudflare's own telemetry
  ip            TEXT,
  user_agent    TEXT,
  referer       TEXT,
  host          TEXT,        -- apex vs www; settled a live theory during the investigation
  raw_body      TEXT,        -- capped, unparsed, unvalidated, unfiltered
  -- best effort extractions, all nullable:
  name TEXT, phone TEXT, email TEXT, zip TEXT, source TEXT,
  -- stamped by a second UPDATE at the end of the request:
  outcome         TEXT,      -- 'accepted' | 'refused' | 'error' | NULL = never finished
  gate            TEXT,
  response_status INTEGER,
  lead_id         INTEGER,
  unverified_id   INTEGER
);
CREATE INDEX IF NOT EXISTS idx_submission_log_received ON submission_log(received_at);
```

Also add a nullable `attempt_id TEXT` to `leads` and `unverified_leads` so the three join, and echo it
into the office email and the HTTP response as a support reference.

**`attempt_id` is not `leadRef`.** `leadRef` is a content hash used as the Google Ads
`transaction_id`, deliberately identical for a duplicate submission so Google collapses it. The WAL
needs an id that is unique per attempt. Reusing `leadRef` would have collapsed the six refusals into
one line, which is the exact information that was needed.

### 9.2 Placement in the request lifecycle

```ts
export async function POST(req: Request) {
  // Cap before reading, or an attacker makes the Worker buffer megabytes per request.
  if (Number(req.headers.get("content-length") ?? 0) > 64 * 1024) { /* reject */ }

  // req.json() consumes the body, so a malformed payload is unrecoverable after it.
  const raw = await req.text();
  const rec = beginAttempt(req, raw);          // sync, no I/O
  console.info("[contact] attempt", rec.attemptId);   // crash net, costs nothing

  try {
    return await handle(req, raw, rec);        // every existing gate lives in here
  } catch (err) {
    rec.outcome = "error"; rec.error = String(err);
    return /* 500 */;
  } finally {
    await recordAttempt(rec);                  // runs on EVERY path, including throws
  }
}
```

**`finally`, and awaited.** `finally` runs on every return path and on uncaught exceptions, and by
then the outcome is known, so it is one complete entry rather than two partial ones. Awaited because
[`ctx.waitUntil`](https://developers.cloudflare.com/workers/runtime-apis/context/), which is what
Next's [`after()`](https://nextjs.org/docs/app/api-reference/functions/after) compiles to on
Cloudflare, is explicitly best effort and can be cancelled. This is the one write in the system that
cannot be best effort. `after()` remains correct for the HCP push and the refusal alert, because
losing those loses a notification rather than the phone number.

The latency is affordable. Measured production POSTs on this route were 287ms on the refusal path and
927ms on the success path, against a `verifyTurnstile` call that already carries a 4,000ms timeout
budget. A 5 to 50ms insert is noise.

`recordAttempt` must swallow every error, carry a timeout of about 1.5 seconds, and on failure
`console.error` the entire rendered record so Workers Logs holds it for the retention window. There is
exactly one fallback level and no infinite regress.

### 9.3 The monthly file

Generated, never stored as a continuously mutated object. Either:

- **an authenticated route**, `GET /admin/log/2026/08.txt`, rendering from D1 on request, which is
  always current and has no job that can silently stop, or
- **a scheduled export** writing `2026/2026-08.txt` into R2 as a pure output sink, where none of
  section 3 applies because nothing reads it back.

A day route matters more than a month route: *"what happened on 11 August"* is literally a day query.

If a browsable view is ever built it needs real auth, and it must not be bolted onto
`GET /api/contact`, which is public today.

### 9.4 The four hardening rules

Straight from the spike, and each one maps to a test it failed:

1. **Keep the `UNIQUE` index on `attempt_id`.** This is what turns a silent overwrite into a loud
   error. It is the single line that most distinguishes D1 from R2 here.
2. **Strip or escape control characters at render time**, U+0000 through U+001F, keeping only
   newline and tab. One null byte silently blinded grep across a whole month. In JavaScript the
   range is written `/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g`.
3. **Indent or escape every field value, not just the message.** Boundary forgery succeeded through
   `name` because only the message was indented. Alternatively store NDJSON and render prose on
   export, which makes forgery structurally impossible because `JSON.stringify` escapes newlines and
   control characters by construction.
4. **Cap record size well under the D1 ceiling and record the truncation in the record.** The shipped
   code truncates `message` at `MAX_STORED_TEXT` with no marker, so a customer writing a long
   description has it silently cut. Render `message >>> (truncated from 12043 bytes)`.

Two more worth carrying:

- **Order by `received_at`, never by `id`.** Production D1 gives no ordering guarantee on concurrent
  inserts; the perfect local ordering was a Miniflare artifact.
- **Store the month boundary as a column, not a filename.** A Worker computing `2026/08` from
  `Date.now()` rolls the month at midnight UTC, which is 8pm the previous evening in Tampa, and the
  offset moves twice a year. Baked into a filename that is unfixable retroactively; in a column it is
  a `WHERE` clause you can change your mind about.

### 9.5 Seed the archive with what it cannot tell you

Whatever the store, the first record must state its own start date:

```
This log begins <date>. Nothing before that date was recorded anywhere.
In particular, six refused submissions on 11 and 12 August 2026 are permanently lost.
Absence of an entry before <date> does not mean absence of a submission.
```

Without it a future reader concludes "no submissions in July" when the truth is the log did not exist,
which is the same misreading this whole exercise exists to prevent.

---

## 10. What this does not fix

**The ordering fix is the whole fix.** Every gate returned before any sink; that is why the six
submissions vanished. Moving the write to a different product does not make it harder to write a
`return` above it. Only the code structure does, so the wrapper in 9.2 and a lint rule or test
asserting the WAL call is the first statement after the body read are worth more than this entire
document.

**And the WAL only records what reaches the Worker.** If Cloudflare blocks a request at the edge, or
a WAF rule fires, or the Worker is never invoked, nothing is recorded. That is a smaller hole than the
one being closed, but it is not zero, and the client should hear it from us rather than discover it.

---

## Sources

Cloudflare R2:
[Workers API reference](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/) ·
[limits](https://developers.cloudflare.com/r2/platform/limits/) ·
[uploading objects and multipart](https://developers.cloudflare.com/r2/objects/upload-objects/) ·
[consistency](https://developers.cloudflare.com/r2/reference/consistency/) ·
[S3 compatibility](https://developers.cloudflare.com/r2/api/s3/api/) ·
[pricing](https://developers.cloudflare.com/r2/pricing/) ·
[object lifecycles](https://developers.cloudflare.com/r2/buckets/object-lifecycles/) ·
[bucket locks](https://developers.cloudflare.com/r2/buckets/bucket-locks/) ·
[public buckets](https://developers.cloudflare.com/r2/buckets/public-buckets/) ·
[data location](https://developers.cloudflare.com/r2/reference/data-location/)

Cloudflare D1:
[limits](https://developers.cloudflare.com/d1/platform/limits/) ·
[pricing](https://developers.cloudflare.com/d1/platform/pricing/) ·
[Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/)

Cloudflare Workers:
[limits](https://developers.cloudflare.com/workers/platform/limits/) ·
[storage options](https://developers.cloudflare.com/workers/platform/storage-options/) ·
[ctx.waitUntil](https://developers.cloudflare.com/workers/runtime-apis/context/) ·
[Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/) ·
[Wrangler commands](https://developers.cloudflare.com/workers/wrangler/commands/) ·
[rate limiting rules](https://developers.cloudflare.com/waf/rate-limiting-rules/) ·
[rate limiting binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)

Other storage primitives considered and rejected:
[KV limits](https://developers.cloudflare.com/kv/platform/limits/) (eventually consistent, 1,000
writes per day to distinct keys on Free) ·
[Analytics Engine limits](https://developers.cloudflare.com/analytics/analytics-engine/limits/)
(3 month retention, sampled, cannot hold a customer message) ·
[Queues pricing](https://developers.cloudflare.com/queues/platform/pricing/) (asynchronous, so the
response leaves before the record is durable)

Framework:
[Next.js `after()`](https://nextjs.org/docs/app/api-reference/functions/after) ·
[OpenNext bindings](https://opennext.js.org/cloudflare/bindings) ·
[OpenNext custom worker](https://opennext.js.org/cloudflare/howtos/custom-worker) (required for a
`scheduled` handler, which is why the digest belongs in a separate Worker)

All URLs verified reachable on 2026-08-12. The two load bearing R2 quotes in section 3 were checked
verbatim against the live pages on that date.
