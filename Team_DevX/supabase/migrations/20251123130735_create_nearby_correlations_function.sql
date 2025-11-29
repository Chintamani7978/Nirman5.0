-- This function finds problem correlations within a specified radius from a given point.
CREATE OR REPLACE FUNCTION public.get_nearby_correlations(
    lat double precision,
    long double precision,
    radius_meters double precision
)
RETURNS TABLE (
    region_id text,
    category_a problem_category,
    category_b problem_category,
    correlation_score double precision,
    co_occurrence bigint,
    center_point_wkt text
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        pc.region_id,
        pc.category_a,
        pc.category_b,
        pc.correlation_score,
        pc.co_occurrence,
        ST_AsText(ST_Centroid(ST_GeomFromText(pc.region_id))) as center_point_wkt
    FROM
        public.problem_correlations pc
    WHERE
        -- Check if the correlation's region (grid cell) is within the specified radius
        ST_DWithin(
            ST_GeomFromText(pc.region_id),
            ST_SetSRID(ST_MakePoint(long, lat), 4326)::geography,
            radius_meters
        )
    ORDER BY
        pc.correlation_score DESC;
END;
$$;

-- Grant execute permission to the function
GRANT EXECUTE ON FUNCTION public.get_nearby_correlations(double precision, double precision, double precision) TO authenticated, anon;
