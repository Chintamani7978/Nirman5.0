-- This migration schedules the `problem_correlations` materialized view to be refreshed daily.
-- This avoids the performance overhead of refreshing the view on every single API call.

-- 1. Enable pg_cron if it's not already enabled.
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Grant usage to the cron schema to the postgres role
-- This is necessary to allow the postgres user to schedule jobs.
GRANT USAGE ON SCHEMA cron TO postgres;

-- 3. Schedule the refresh function to run once every day at midnight.
-- The `cron.schedule` function takes two arguments:
-- The first is the cron schedule string. '0 0 * * *' means at minute 0 of hour 0 every day.
-- The second is the SQL command to execute.
-- We use a DO block to call our existing function.
SELECT cron.schedule(
  'refresh-correlations-daily',
  '0 0 * * *',
  $$
  BEGIN
    PERFORM public.calculate_problem_correlations();
  END;
  $$
);
