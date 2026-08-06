-- Ad click attribution on leads.
--
-- Apply with `pnpm db:migrate:local` first, then `pnpm db:migrate` for the remote D1.
--
-- WHY: until now nothing anywhere in this codebase captured a click identifier. Every paid click
-- that produced a lead was permanently unattributable, and unlike almost everything else in the
-- lead pipeline this cannot be backfilled: a gclid exists only in the URL of the click that
-- happened, and once that visit is over it is gone.
--
-- These are populated by `middleware.ts`, which writes them to first party cookies on the landing
-- request, and read back in `app/api/contact/route.ts` when the form is submitted.
--
-- ⚠️ `gclid` is CASE SENSITIVE. Never lowercase it, and never let a spreadsheet autoformat it.
--
-- ⚠️ Every column is nullable and none carry NOT NULL. SQLite's ALTER TABLE ADD COLUMN requires
-- either nullable or a default, which is why 0002 and 0003 look the same way. Expect a large share
-- of NULLs and do not treat that as a fault: organic visitors, repeat customers and anyone who
-- arrives without clicking an ad legitimately have no click id, and about half of Trinity's jobs
-- are repeat customers.
--
-- The join key to real revenue already exists as `hcp_lead_id` from 0003, so a lead can in
-- principle be followed from an ad click all the way to a completed Housecall Pro job.

ALTER TABLE leads ADD COLUMN gclid TEXT;
ALTER TABLE leads ADD COLUMN gbraid TEXT;
ALTER TABLE leads ADD COLUMN wbraid TEXT;
ALTER TABLE leads ADD COLUMN msclkid TEXT;

-- The page the ad click actually landed on. Google Ads' Landing Page report covers this for clicks
-- it knows about, but it is lost once you are looking at a conversion in your own database, and it
-- is the thing that answers which page the ad money bought.
ALTER TABLE leads ADD COLUMN landing_path TEXT;

-- Partial index: the overwhelming majority of rows will have a NULL gclid, and the only query that
-- matters is "leads that came from a paid click", so there is no reason to index the NULLs.
CREATE INDEX IF NOT EXISTS idx_leads_gclid ON leads (gclid) WHERE gclid IS NOT NULL;
