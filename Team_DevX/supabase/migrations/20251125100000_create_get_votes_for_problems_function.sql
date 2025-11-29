CREATE OR REPLACE FUNCTION public.get_votes_for_problems(
    p_problem_ids uuid[]
)
RETURNS TABLE (
    problem_id uuid,
    upvotes bigint,
    downvotes bigint
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        votable_id as problem_id,
        COUNT(*) FILTER (WHERE vote_type = 'upvote') as upvotes,
        COUNT(*) FILTER (WHERE vote_type = 'downvote') as downvotes
    FROM public.votes
    WHERE votable_type = 'problem'
      AND votable_id = ANY(p_problem_ids)
    GROUP BY votable_id;
$$;
