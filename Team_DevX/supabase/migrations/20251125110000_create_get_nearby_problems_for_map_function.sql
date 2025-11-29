CREATE OR REPLACE FUNCTION public.get_nearby_problems_for_map(
    p_lat double precision,
    p_lng double precision,
    p_radius_meters double precision
)
RETURNS TABLE (
    id uuid,
    created_at timestamptz,
    title text,
    description text,
    category public.problem_category,
    status public.problem_status,
    latitude numeric,
    longitude numeric,
    user_id uuid,
    city text,
    pincode text,
    region text
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        p.id,
        p.created_at,
        p.title,
        p.description,
        p.category,
        p.status,
        p.latitude,
        p.longitude,
        p.user_id,
        p.city,
        p.pincode,
        p.region
    FROM public.problems p
    WHERE ST_DWithin(
        p.location,
        ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
        p_radius_meters
    )
    ORDER BY p.created_at DESC
    LIMIT 200;
$$;
