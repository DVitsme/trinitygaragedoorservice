-- Phase 0: store a canonical phone alongside the human readable one.
--
-- The API now validates phone structure (NANP, 10 digits, no N11 area code or exchange) and stores
-- E.164 as well, so numbers dedupe cleanly and drop straight into a tel: link. The existing `phone`
-- column keeps the formatted version, because office staff read these out of an email.
--
-- Applied with `pnpm db:migrate:local` then `pnpm db:migrate` for remote.

ALTER TABLE leads ADD COLUMN phone_e164 TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_phone_e164 ON leads (phone_e164);
