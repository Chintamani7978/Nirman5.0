-- Moderation audit log table
CREATE TABLE IF NOT EXISTS moderation_audit (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  row_id UUID NOT NULL,
  action TEXT NOT NULL,
  reason TEXT,
  quality_score FLOAT,
  moderated_at TIMESTAMPTZ DEFAULT now()
);
