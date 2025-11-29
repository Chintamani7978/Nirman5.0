-- Enable the PostGIS extension if it's not already enabled.
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;

-- 1. Add the new 'location' column with the geography type.
-- It's nullable initially to allow for a two-step data migration.
ALTER TABLE public.problems
ADD COLUMN IF NOT EXISTS location geography(Point, 4326);

-- 2. Populate the new 'location' column from the existing latitude and longitude columns.
-- This statement runs only if the location column is present and empty for some rows.
UPDATE public.problems
SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
WHERE location IS NULL AND latitude IS NOT NULL AND longitude IS NOT NULL;

-- 3. (Optional but recommended) Drop the old latitude and longitude columns
-- You can uncomment these lines if you have verified the data migration is successful.
-- ALTER TABLE public.problems DROP COLUMN IF EXISTS latitude;
-- ALTER TABLE public.problems DROP COLUMN IF EXISTS longitude;

-- 4. Create the spatial index on the new 'location' column.
-- This was the step that failed in the previous migration.
CREATE INDEX IF NOT EXISTS problems_location_idx ON public.problems USING GIST (location);
