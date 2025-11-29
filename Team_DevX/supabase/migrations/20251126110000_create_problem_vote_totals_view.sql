-- View that keeps aggregated vote stats per problem so the client can always read fresh totals
CREATE OR REPLACE VIEW public.problem_vote_totals AS
SELECT
    votable_id AS problem_id,
    COALESCE(SUM(CASE vote_type WHEN 'upvote' THEN 1 WHEN 'downvote' THEN -1 ELSE 0 END), 0) AS net_votes,
    COUNT(*) FILTER (WHERE vote_type = 'upvote') AS upvotes,
    COUNT(*) FILTER (WHERE vote_type = 'downvote') AS downvotes,
    COUNT(*) AS total_votes,
    MAX(created_at) AS last_activity_at
FROM public.votes
WHERE votable_type = 'problem'
GROUP BY votable_id;

COMMENT ON VIEW public.problem_vote_totals IS 'Aggregated vote counters for each problem (net/up/down)';
