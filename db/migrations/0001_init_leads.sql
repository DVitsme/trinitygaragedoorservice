-- Leads captured from the contact / free-estimate form (Phase 2).
-- Applied with `pnpm db:migrate:local` (local SQLite) or `pnpm db:migrate` (remote D1).

CREATE TABLE IF NOT EXISTS leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT,
  city        TEXT,
  service     TEXT,
  message     TEXT,
  source      TEXT NOT NULL DEFAULT 'website',
  user_agent  TEXT,
  ip          TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at);
