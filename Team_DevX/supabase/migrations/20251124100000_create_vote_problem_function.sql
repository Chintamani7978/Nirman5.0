CREATE OR REPLACE FUNCTION public.vote_problem(
    p_problem_id uuid,
    p_vote_type vote_type
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id uuid := auth.uid();
    existing_vote public.votes%ROWTYPE;
BEGIN
    -- Check for an existing vote by the current user on the specified problem
    SELECT *
    INTO existing_vote
    FROM public.votes
    WHERE user_id = v_user_id
      AND votable_type = 'problem'
      AND votable_id = p_problem_id;

    -- If a vote already exists
    IF FOUND THEN
        -- If the new vote is the same as the old one, the user is toggling it off.
        IF existing_vote.vote_type = p_vote_type THEN
            DELETE FROM public.votes
            WHERE id = existing_vote.id;
        -- If the new vote is different, the user is changing their vote (e.g., from upvote to downvote).
        ELSE
            UPDATE public.votes
            SET vote_type = p_vote_type
            WHERE id = existing_vote.id;
        END IF;
    -- If no vote exists, create a new one.
    ELSE
        INSERT INTO public.votes (user_id, votable_type, votable_id, vote_type)
        VALUES (v_user_id, 'problem', p_problem_id, p_vote_type);
    END IF;
END;
$$;
