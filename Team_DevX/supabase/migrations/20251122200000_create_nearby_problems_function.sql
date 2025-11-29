CREATE OR REPLACE FUNCTION public.nearby_problems(lat double precision, lng double precision)
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  title text,
  description text,
  category problem_category,
  status problem_status,
  votes_count integer,
  latitude numeric,
  longitude numeric,
  media_url text,
  user_id uuid,
  distance_km double precision
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.created_at,
    p.title,
    p.description,
    p.category,
    p.status,
    p.votes_count,
    p.latitude,
    p.longitude,
    p.media_url,
    p.user_id,
    (
      6371 * acos(
        cos(radians(lat)) * cos(radians(CAST(p.latitude AS double precision))) *
        cos(radians(CAST(p.longitude AS double precision)) - radians(lng)) +
        sin(radians(lat)) * sin(radians(CAST(p.latitude AS double precision)))
      )
    )::double precision AS distance_km
  FROM
    public.problems p
  WHERE p.latitude IS NOT NULL AND p.longitude IS NOT NULL
  ORDER BY
    distance_km
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;
