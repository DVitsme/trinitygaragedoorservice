-- The write ahead submission log. Every attempt, before any gate, unconditionally.
--
-- Apply with `pnpm db:migrate:local` first, then `pnpm db:migrate` for the remote D1.
--
-- WHY THIS EXISTS. `unverified_leads` (0005) catches submissions the gates refuse, but only three
-- named gates and only when `isReachable` passes. A malformed body still writes nothing, because
-- the JSON parse fails and returns before the submission object is built. A submission with no
-- dialable phone and no valid email still writes nothing, because it cannot go on a callback
-- worklist. So "what happened to my form submission" was still unanswerable for a whole class of
-- request, and the owner's requirement is that it never be unanswerable again: "I would rather
-- have a file filled with spam than have nothing."
--
-- This table answers it. It is written FIRST, from the raw request text, before validation, before
-- the spam gate, before anything can return. Nothing filters it.
--
-- WHY D1 AND NOT R2. The owner asked for plain text files in year folders, which is object storage
-- shaped, so R2 was the obvious answer and it was built and measured before being rejected. R2
-- `put` silently discards on a key collision, reporting success twenty times while keeping one
-- record. Its compaction job destroyed a real record on the first race test. Wrangler cannot list
-- R2 objects at all, so the log would be write only from the CLI between compactions. And one null
-- byte in one spam message makes an entire month unsearchable by grep while `file` still calls it
-- ASCII text. Full comparison and the measurements in
-- `postmortems/2026-08-12-turnstile-lead-loss/08-storage-decision.md`.
--
-- The monthly plain text file is still exactly what the owner asked for. It is generated from this
-- table on demand rather than being the storage itself, so it can never be half written, can never
-- lose a record to a race, and is always current.
--
-- THE DECISIVE PROPERTY, and the one R2 cannot provide: a write ahead log is written BEFORE the
-- gates, so on its own it can only say a submission arrived. The requirement is what HAPPENED to
-- it. A row can be updated with the outcome once it is known. An immutable object cannot.

CREATE TABLE IF NOT EXISTS submission_log (
  -- AUTOINCREMENT, not plain rowid, and this is load bearing. A gap in a monotonic counter is
  -- EVIDENCE that a record is missing. A gap in a timestamp series is invisible, because a write
  -- that never happened leaves nothing behind. AUTOINCREMENT also guarantees ids are never reused.
  -- Caveat for whoever reads a gap later: a rolled back insert burns an id, so a gap is evidence
  -- and not proof.
  id            INTEGER PRIMARY KEY AUTOINCREMENT,

  -- Unique per ATTEMPT, unlike `leads.leadRef` which is a content hash and is deliberately
  -- IDENTICAL for a duplicate submission so Google Ads can collapse it. Reusing that here would
  -- have collapsed the six Wesley Chapel attempts into one line, which is exactly the information
  -- the investigation needed. Echoed into leads, unverified_leads, the office email and the
  -- response body, so one reference resolves across every system.
  attempt_id    TEXT NOT NULL UNIQUE,

  -- UTC, ISO 8601. NOT a month bucket baked into a filename: a Worker computing "2026/08" from the
  -- clock rolls the month at midnight UTC, which is 8pm the previous day in Tampa, and the offset
  -- moves twice a year at the DST transitions. Stored as an instant, bucketed at read time, so the
  -- boundary stays a decision we can change our mind about.
  received_at   TEXT NOT NULL DEFAULT (datetime('now')),

  -- The join key to Cloudflare's own telemetry: httpRequestsAdaptiveGroups, firewallEventsAdaptive
  -- and turnstileAdaptiveGroups all carry it. Nothing in the 2026-08-12 investigation captured it,
  -- and it is the single field that would most have shortened that work.
  ray           TEXT,

  ip            TEXT,
  user_agent    TEXT,
  referer       TEXT,
  host          TEXT,
  country       TEXT,

  -- The request exactly as it arrived, unparsed and unvalidated, capped. This is the whole point:
  -- record what was sent, not our interpretation of it. A malformed body lands here and nowhere
  -- else, which is the gap 0005 could not close.
  raw_body      TEXT,
  body_bytes    INTEGER,

  -- Whether a Turnstile token was present and how long it was. NEVER the token itself: it is a
  -- single use credential, roughly a kilobyte, worthless after the request. The LENGTH is the part
  -- that carries diagnostic value, because 202 to 302 byte bodies against 1003 to 1187 was the
  -- independent proof the token was missing in the incident.
  token_len     INTEGER,
  -- The client side Turnstile error code, when the browser reported one. 200500 means the iframe
  -- was blocked outright; the 300 and 600 families mean the widget ran and the client failed. Those
  -- need opposite fixes and the investigation could never tell them apart.
  client_error  TEXT,

  -- Best effort extractions, all nullable, purely so a human can scan the table without parsing
  -- raw_body. raw_body is the source of truth; if these disagree with it, believe raw_body.
  name          TEXT,
  phone         TEXT,
  email         TEXT,
  zip           TEXT,
  service       TEXT,
  source        TEXT,

  -- Written by a SECOND statement at the end of the request, once the answer is known.
  --
  -- ⚠️ `outcome IS NULL` is a real and useful state: it means we began handling this request and
  -- never finished. An isolate killed mid flight, an uncaught throw, a CPU limit. Nobody had that
  -- signal before, and it would have made the incident visible on day one. Do not backfill it with
  -- a default and do not treat NULL as "unknown, ignore".
  outcome       TEXT,      -- accepted | refused | invalid | rate_limited | error | NULL
  gate          TEXT,      -- turnstile_reject | name_required | phone_invalid | invalid_json | ...
  status        INTEGER,   -- the HTTP status actually returned
  lead_id       INTEGER,   -- leads.id when it became a real lead
  unverified_id INTEGER,   -- unverified_leads.id when it went on the callback worklist

  -- Set when this row represents a COLLAPSED burst rather than one request. See the note on
  -- write shedding below.
  collapsed     INTEGER NOT NULL DEFAULT 0
);

-- received_at for the monthly export and any "what happened on the 11th" question.
CREATE INDEX IF NOT EXISTS idx_submission_log_received ON submission_log (received_at);
-- ip for "show me everything this person or bot ever sent".
CREATE INDEX IF NOT EXISTS idx_submission_log_ip ON submission_log (ip);
-- outcome for the weekly digest counts, and specifically for finding the NULLs.
CREATE INDEX IF NOT EXISTS idx_submission_log_outcome ON submission_log (outcome);

-- WRITE SHEDDING, and why it is here rather than left to rate limiting.
--
-- This table is written on EVERY request, and D1's daily rows written quota is account wide and
-- SHARED with the `leads` table. An unthrottled flood on the archive could exhaust the quota and
-- take out real lead capture, which would be the archive built to stop lead loss causing it.
--
-- Rate limiting exists (`lib/rate-limit.ts`) but ships in shadow mode, so it refuses nobody and
-- provides no protection yet. The limiter still computes `overLimit` truthfully in every mode
-- though, so the route uses that signal to write ONE collapsed row per IP per hour instead of one
-- row per request once a client is over the limit. Every request is still accounted for, which is
-- the requirement, but a flood costs 24 writes a day rather than unbounded.
--
-- A collapsed row carries `collapsed = 1` and a count in `body_bytes`. Do not read a collapsed row
-- as a single submission.
CREATE UNIQUE INDEX IF NOT EXISTS idx_submission_log_collapse
  ON submission_log (ip, substr(received_at, 1, 13)) WHERE collapsed = 1;

-- Correlation columns on the two existing tables. Nullable and additive, so existing rows are
-- untouched and nothing that reads those tables needs to change.
ALTER TABLE leads            ADD COLUMN attempt_id TEXT;
ALTER TABLE unverified_leads ADD COLUMN attempt_id TEXT;
CREATE INDEX IF NOT EXISTS idx_leads_attempt      ON leads (attempt_id);
CREATE INDEX IF NOT EXISTS idx_unverified_attempt ON unverified_leads (attempt_id);
