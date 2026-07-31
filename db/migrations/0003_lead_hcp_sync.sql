-- Phase 1: track the Housecall Pro push per lead.
--
-- WHY THESE COLUMNS EXIST. HCP has no idempotency key and no DELETE endpoint, so a blind retry can
-- permanently duplicate a real person in an account with 6,000+ customers that they mail postcards
-- to. `hcp_lead_id` is therefore our own idempotency guard: if it is set, the push succeeded and
-- must never be repeated, whatever the logs say.
--
-- The push runs in background work after the response is already sent, so a failure is invisible
-- to the visitor by design. It must not also be invisible to us, which is what `hcp_status` and
-- `hcp_last_error` are for.
--
-- Applied with `pnpm db:migrate:local` then `pnpm db:migrate` for remote.

ALTER TABLE leads ADD COLUMN hcp_status     TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE leads ADD COLUMN hcp_lead_id    TEXT;
ALTER TABLE leads ADD COLUMN hcp_attempts   INTEGER NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN hcp_last_error TEXT;
ALTER TABLE leads ADD COLUMN zip            TEXT;

-- Finds the leads a retry sweep should pick up, and is cheap on a table this size.
CREATE INDEX IF NOT EXISTS idx_leads_hcp_status ON leads (hcp_status);
