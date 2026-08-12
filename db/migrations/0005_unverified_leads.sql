-- Submissions the gates refused, kept so a real customer is never turned away without a trace.
--
-- Apply with `pnpm db:migrate:local` first, then `pnpm db:migrate` for the remote D1.
--
-- WHY THIS EXISTS. On 2026-08-03 a missing Turnstile token became a hard reject, which was the
-- correct fix for real spam. It also turned the only lead form this business has into one that can
-- refuse a real person and keep NO record of it: every gate in `app/api/contact/route.ts` returned
-- before `storeLead` and `sendEmail` were reached, so the name, phone, email, zip and message were
-- read off the request and thrown away. A repeat customer hit that path twice and nothing existed
-- afterwards, in D1 or in Resend, to call him back with. He tried again eleven hours later and got
-- through on his own. Nobody would have known otherwise, and at a mean website job of $2,330 that
-- silence is the expensive part, not the rejection.
--
-- WHY A SEPARATE TABLE AND NOT `leads.status = 'quarantined'`. The column looks simpler and is
-- worse here, for three reasons:
--
--   1. `leads` currently means "a lead we believe is real", and several things already read it on
--      exactly that assumption: the Housecall Pro sweep keys off `hcp_status`, the ads specialist
--      is due a Google Sheets export of it (LAUNCH-TODO 1.7), and CLAUDE.md documents
--      `SELECT * FROM leads` as the way to inspect them. Putting refused submissions in there means
--      every one of those has to learn a filter, and the one that forgets is the one that pushes
--      spam into a CRM holding 6,000 real customers with NO DELETE ENDPOINT.
--   2. The Housecall Pro interlock is `verdict === "pass" && leadId !== null`. If a quarantined row
--      carried a `leads.id`, that guard is one careless edit away from being wrong. With a separate
--      table the push path never learns the row id at all, so the mistake cannot be made.
--   3. Retention differs. Real leads are kept. These are pruned at 30 days, and nobody should ever
--      be writing a DELETE against `leads`.
--
-- ⚠️ THE NAME IS DELIBERATELY NOT "SPAM". The failure this table exists to catch is a REAL customer
-- being refused, so whoever reads a row should start from "this person may be waiting for a call",
-- not from "this is junk". Unverified is the literal truth: the spam gate could not verify the
-- submission, which is a statement about the check and not about the person.
--
-- ⚠️ NOT EVERY REFUSAL LANDS HERE. The route only writes a row when the submission carries a way to
-- reach someone, meaning a structurally valid phone or a plausible email. A refusal with neither is
-- not a lead that could ever be recovered, and writing it would hand anyone with a loop a way to
-- consume the daily D1 write allowance that the real `leads` table shares.

CREATE TABLE IF NOT EXISTS unverified_leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),

  -- Which gate refused it: 'turnstile_reject', 'name_required' or 'phone_invalid'. Free text rather
  -- than a CHECK constraint so adding a gate never needs a migration, and because a CHECK that
  -- rejects an unknown reason would throw away the very row this table exists to keep.
  reason      TEXT NOT NULL,

  -- ⚠️ `name` and `phone` are nullable here and NOT NULL in `leads`, and that is the point. The
  -- rows that land here are the ones that failed a validity check, so the table cannot demand the
  -- fields whose absence put them here.
  name        TEXT,
  phone       TEXT,
  phone_e164  TEXT,
  email       TEXT,
  zip         TEXT,
  city        TEXT,
  service     TEXT,
  message     TEXT,
  source      TEXT,
  user_agent  TEXT,
  ip          TEXT,

  -- Click attribution, same columns and same reasoning as migration 0004. Carried here rather than
  -- dropped because a recovered lead should be attributable to the click that paid for it in
  -- exactly the way a captured one is, and a gclid cannot be reconstructed after the visit ends.
  gclid        TEXT,
  gbraid       TEXT,
  wbraid       TEXT,
  msclkid      TEXT,
  landing_path TEXT,

  -- Whether the human alert for this row went out. Mirrors `hcp_status` from 0003 and exists for
  -- the same reason: the alert is sent in background work after the response, so its failure is
  -- invisible to the visitor by design, and it must not also be invisible to us. A table full of
  -- 'pending' means the alert path is broken, which is the failure that would recreate the original
  -- bug one level up.
  alert_status TEXT NOT NULL DEFAULT 'pending',
  alert_error  TEXT
);

-- Drives the 30 day prune, which runs opportunistically in the same D1 batch as each insert. With
-- this index the DELETE is an index seek that matches nothing on almost every call, so it costs a
-- flooded endpoint nothing extra.
CREATE INDEX IF NOT EXISTS idx_unverified_created_at ON unverified_leads (created_at);

-- "Did anything get refused that we never looked at" is the only routine query, and it is the one
-- the health check and any future digest both run.
CREATE INDEX IF NOT EXISTS idx_unverified_alert_status ON unverified_leads (alert_status);
