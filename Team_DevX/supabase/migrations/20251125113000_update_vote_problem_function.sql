-- Ensure vote_problem keeps problems.votes_count synchronized with net votes
DROP FUNCTION IF EXISTS public.vote_problem(uuid, vote_type);

CREATE OR REPLACE FUNCTION public.vote_problem(
    p_problem_id uuid,
    p_vote_type vote_type
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id uuid := auth.uid();
    existing_vote public.votes%ROWTYPE;
    new_total integer;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to vote';
    END IF;

    SELECT *
      INTO existing_vote
      FROM public.votes
     WHERE user_id = v_user_id
       AND votable_type = 'problem'
       AND votable_id = p_problem_id;

    IF FOUND THEN
        IF existing_vote.vote_type = p_vote_type THEN
            DELETE FROM public.votes WHERE id = existing_vote.id;
        ELSE
            UPDATE public.votes
               SET vote_type = p_vote_type
             WHERE id = existing_vote.id;
        END IF;
    ELSE
        INSERT INTO public.votes (user_id, votable_type, votable_id, vote_type)
        VALUES (v_user_id, 'problem', p_problem_id, p_vote_type);
    END IF;

    SELECT COALESCE(SUM(CASE vote_type WHEN 'upvote' THEN 1 WHEN 'downvote' THEN -1 ELSE 0 END), 0)
      INTO new_total
      FROM public.votes
     WHERE votable_type = 'problem'
       AND votable_id = p_problem_id;

    UPDATE public.problems
       SET votes_count = new_total
     WHERE id = p_problem_id;

    RETURN new_total;
END;
$$;
