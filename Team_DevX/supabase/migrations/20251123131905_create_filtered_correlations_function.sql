-- This migration enhances the correlation engine by adding powerful filtering capabilities
-- for the Ministry Dashboard. It rebuilds the materialized view to include date information
-- and creates a new function to query based on various criteria.

-- Step 1: Drop the old function and view to rebuild them.
-- It's safe to drop them as the view is designed to be rebuilt from scratch.
DROP FUNCTION IF EXISTS public.get_nearby_correlations(double precision, double precision, double precision);
DROP FUNCTION IF EXISTS public.calculate_problem_correlations();
DROP MATERIALIZED VIEW IF EXISTS public.problem_correlations;

-- Step 2: Re-create the Materialized View with a new 'latest_problem_date' column.
CREATE MATERIALIZED VIEW public.problem_correlations AS
SELECT
    NULL::text AS region_id,
    NULL::text AS city,
    NULL::text AS region,
    NULL::problem_category AS category_a,
    NULL::problem_category AS category_b,
    NULL::bigint AS count_a,
    NULL::bigint AS count_b,
    NULL::bigint AS co_occurrence,
    NULL::float AS correlation_score,
    NULL::timestamptz AS latest_problem_date, -- New column for date filtering
    NULL::timestamptz AS last_updated_at
WITH NO DATA;

-- Create indexes for faster querying
CREATE UNIQUE INDEX IF NOT EXISTS idx_problem_correlations_unique ON public.problem_correlations(region_id, category_a, category_b);
CREATE INDEX IF NOT EXISTS idx_problem_correlations_score ON public.problem_correlations(correlation_score);
CREATE INDEX IF NOT EXISTS idx_problem_correlations_date ON public.problem_correlations(latest_problem_date);
CREATE INDEX IF NOT EXISTS idx_problem_correlations_city ON public.problem_correlations(city);


-- Step 3: Re-create the calculation function to populate the new columns.
CREATE OR REPLACE FUNCTION public.calculate_problem_correlations()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    grid_size float := 0.05; -- Approx. 5.5 km
BEGIN
    CREATE TEMP TABLE problems_in_grid AS
    SELECT
        p.id,
        p.category,
        p.city,
        p.region,
        p.created_at,
        ST_SnapToGrid(p.location, grid_size) as grid_cell
    FROM public.problems p
    WHERE p.location IS NOT NULL;

    CREATE TEMP TABLE category_counts_in_grid AS
    SELECT grid_cell, category, COUNT(id) as problem_count
    FROM problems_in_grid
    GROUP BY grid_cell, category;

    TRUNCATE TABLE public.problem_correlations;

    INSERT INTO public.problem_correlations (
        region_id, city, region, category_a, category_b, count_a, count_b,
        co_occurrence, correlation_score, latest_problem_date, last_updated_at
    )
    WITH pairwise_counts AS (
        SELECT
            a.grid_cell,
            a.category AS category_a,
            b.category AS category_b,
            GREATEST(a.created_at, b.created_at) as latest_date,
            -- Use the city/region from one of the pairs (assuming they are in the same grid)
            MAX(a.city) as city,
            MAX(a.region) as region
        FROM problems_in_grid a
        JOIN problems_in_grid b ON a.grid_cell = b.grid_cell AND a.category < b.category
        GROUP BY a.grid_cell, a.category, b.category, GREATEST(a.created_at, b.created_at)
    ),
    co_occurrence_counts AS (
        SELECT
            grid_cell, category_a, category_b, city, region,
            COUNT(*) as intersection_count,
            MAX(latest_date) as max_problem_date
        FROM pairwise_counts
        GROUP BY grid_cell, category_a, category_b, city, region
    )
    SELECT
        ST_AsText(coc.grid_cell) AS region_id,
        coc.city,
        coc.region,
        coc.category_a,
        coc.category_b,
        cat_a.problem_count AS count_a,
        cat_b.problem_count AS count_b,
        coc.intersection_count AS co_occurrence,
        coc.intersection_count / sqrt(cat_a.problem_count * cat_b.problem_count) AS correlation_score,
        coc.max_problem_date,
        now() AS last_updated_at
    FROM co_occurrence_counts coc
    JOIN category_counts_in_grid cat_a ON coc.grid_cell = cat_a.grid_cell AND coc.category_a = cat_a.category
    JOIN category_counts_in_grid cat_b ON coc.grid_cell = cat_b.grid_cell AND coc.category_b = cat_b.category
    WHERE cat_a.problem_count > 0 AND cat_b.problem_count > 0;

    DROP TABLE problems_in_grid;
    DROP TABLE category_counts_in_grid;
END;
$$;

-- Step 4: Re-create the nearby correlations function (no logic change, just for dependency)
CREATE OR REPLACE FUNCTION public.get_nearby_correlations(
    lat double precision,
    long double precision,
    radius_meters double precision
)
RETURNS TABLE (
    region_id text, category_a problem_category, category_b problem_category,
    correlation_score double precision, co_occurrence bigint, center_point_wkt text
)
LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT pc.region_id, pc.category_a, pc.category_b, pc.correlation_score, pc.co_occurrence,
           ST_AsText(ST_Centroid(ST_GeomFromText(pc.region_id))) as center_point_wkt
    FROM public.problem_correlations pc
    WHERE ST_DWithin(
        ST_GeomFromText(pc.region_id),
        ST_SetSRID(ST_MakePoint(long, lat), 4326)::geography,
        radius_meters
    )
    ORDER BY pc.correlation_score DESC;
END;
$$;


-- Step 5: Create the NEW advanced filtering function for the Ministry dashboard
CREATE OR REPLACE FUNCTION public.get_filtered_correlations(
    start_date timestamptz DEFAULT NULL,
    end_date timestamptz DEFAULT NULL,
    cat_filter problem_category[] DEFAULT NULL,
    city_filter text DEFAULT NULL
)
RETURNS SETOF public.problem_correlations
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.problem_correlations pc
    WHERE
        (start_date IS NULL OR pc.latest_problem_date >= start_date) AND
        (end_date IS NULL OR pc.latest_problem_date <= end_date) AND
        (cat_filter IS NULL OR pc.category_a = ANY(cat_filter) OR pc.category_b = ANY(cat_filter)) AND
        (city_filter IS NULL OR pc.city ILIKE city_filter);
END;
$$;

-- Step 6: Grant permissions for the new and updated functions
GRANT EXECUTE ON FUNCTION public.calculate_problem_correlations() TO postgres, service_role;
GRANT EXECUTE ON FUNCTION public.get_nearby_correlations(double precision, double precision, double precision) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_filtered_correlations(timestamptz, timestamptz, problem_category[], text) TO authenticated;

