-- Migration: Add rating and feedback columns to problems, ensure status values and RLS policy
-- Run this in your Supabase/Postgres instance

BEGIN;

ALTER TABLE IF EXISTS public.problems
  ADD COLUMN IF NOT EXISTS rating integer,
  ADD COLUMN IF NOT EXISTS feedback text;

-- Ensure status accepts required values. If a constraint exists, this will add another check.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'problems_status_check'
  ) THEN
    ALTER TABLE public.problems
      ADD CONSTRAINT problems_status_check CHECK (status IN ('Pending','In-Progress','Resolved','Solved','Re-Opened'));
  END IF;
END$$;

-- Enable RLS if not already enabled
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

-- Policy: allow the original reporter (user_id) to update their own problem row (to submit rating/feedback)
-- This policy allows authenticated users to update rows where they are the reporter.
DROP POLICY IF EXISTS allow_reporter_update_rating ON public.problems;
CREATE POLICY allow_reporter_update_rating ON public.problems
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

COMMIT;
