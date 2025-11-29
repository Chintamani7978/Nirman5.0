-- 1. Create the Materialized View to store correlation results.
-- This view will hold the pre-computed correlation scores between problem categories within specific regions.
CREATE MATERIALIZED VIEW IF NOT EXISTS public.problem_correlations AS
SELECT
    NULL::text AS region_id,
    NULL::problem_category AS category_a,
    NULL::problem_category AS category_b,
    NULL::bigint AS count_a,
    NULL::bigint AS count_b,
    NULL::bigint AS co_occurrence,
    NULL::float AS correlation_score,
    NULL::timestamptz AS last_updated_at
WITH NO DATA;

-- Create an index for faster querying by region and score
CREATE UNIQUE INDEX IF NOT EXISTS idx_problem_correlations_unique ON public.problem_correlations(region_id, category_a, category_b);
CREATE INDEX IF NOT EXISTS idx_problem_correlations_score ON public.problem_correlations(correlation_score);


-- 2. Create the function to calculate and refresh the materialized view.
CREATE OR REPLACE FUNCTION public.calculate_problem_correlations()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    grid_size float := 0.05; -- Approx. 5.5 km at the equator
BEGIN
    -- Step 1: Create a temporary table to hold problems snapped to a grid
    CREATE TEMP TABLE problems_in_grid AS
    SELECT
        p.id,
        p.category,
        ST_SnapToGrid(p.location, grid_size) as grid_cell
    FROM
        public.problems p
    WHERE
        p.location IS NOT NULL;

    -- Step 2: Create a temporary table for category counts within each grid cell
    CREATE TEMP TABLE category_counts_in_grid AS
    SELECT
        grid_cell,
        category,
        COUNT(id) as problem_count
    FROM
        problems_in_grid
    GROUP BY
        grid_cell,
        category;

    -- Step 3: Refresh the materialized view with the new correlation data
    TRUNCATE TABLE public.problem_correlations;

    INSERT INTO public.problem_correlations (
        region_id,
        category_a,
        category_b,
        count_a,
        count_b,
        co_occurrence,
        correlation_score,
        last_updated_at
    )
    WITH pairwise_counts AS (
        -- Create pairs of problems that co-occur in the same grid cell
        SELECT
            a.grid_cell,
            a.category AS category_a,
            b.category AS category_b
        FROM
            problems_in_grid a
        JOIN
            problems_in_grid b ON a.grid_cell = b.grid_cell AND a.category < b.category -- self-join to create pairs, ensuring a < b to avoid duplicates
    ),
    co_occurrence_counts AS (
        -- Count how many times each pair of categories appears together
        SELECT
            grid_cell,
            category_a,
            category_b,
            COUNT(*) as intersection_count
        FROM
            pairwise_counts
        GROUP BY
            grid_cell,
            category_a,
            category_b
    )
    -- Final calculation and insertion
    SELECT
        ST_AsText(coc.grid_cell) AS region_id,
        coc.category_a,
        coc.category_b,
        cat_a.problem_count AS count_a,
        cat_b.problem_count AS count_b,
        coc.intersection_count AS co_occurrence,
        -- Correlation Score Formula: intersection / sqrt(total_A * total_B)
        coc.intersection_count / sqrt(cat_a.problem_count * cat_b.problem_count) AS correlation_score,
        now() AS last_updated_at
    FROM
        co_occurrence_counts coc
    JOIN
        category_counts_in_grid cat_a ON coc.grid_cell = cat_a.grid_cell AND coc.category_a = cat_a.category
    JOIN
        category_counts_in_grid cat_b ON coc.grid_cell = cat_b.grid_cell AND coc.category_b = cat_b.category
    WHERE
        -- Ensure there's a valid calculation to be made
        cat_a.problem_count > 0 AND cat_b.problem_count > 0;

    -- Clean up temporary tables
    DROP TABLE problems_in_grid;
    DROP TABLE category_counts_in_grid;
END;
$$;

-- 3. Grant SELECT access to the materialized view to anon and authenticated roles
GRANT SELECT ON public.problem_correlations TO anon, authenticated;

-- Grant usage to the function
GRANT EXECUTE ON FUNCTION public.calculate_problem_correlations() TO postgres, service_role;
