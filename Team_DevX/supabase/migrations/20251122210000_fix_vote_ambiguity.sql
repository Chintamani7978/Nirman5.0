-- First, drop the existing trigger and function
DROP TRIGGER IF EXISTS on_vote_change ON public.votes;
DROP FUNCTION IF EXISTS public.update_votes_count();

-- Then, re-create the function with the corrected, unambiguous query
CREATE OR REPLACE FUNCTION public.update_votes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF (NEW.votable_type = 'problem') THEN
      UPDATE public.problems
      SET votes_count = votes_count + (CASE WHEN NEW.vote_type = 'upvote' THEN 1 ELSE -1 END)
      WHERE id = NEW.votable_id;
    ELSIF (NEW.votable_type = 'solution') THEN
      UPDATE public.solutions
      SET votes_count = votes_count + (CASE WHEN NEW.vote_type = 'upvote' THEN 1 ELSE -1 END)
      WHERE id = NEW.votable_id;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
    IF (OLD.votable_type = 'problem') THEN
      UPDATE public.problems
      SET votes_count = votes_count - (CASE WHEN OLD.vote_type = 'upvote' THEN 1 ELSE -1 END)
      WHERE id = OLD.votable_id;
    ELSIF (OLD.votable_type = 'solution') THEN
      UPDATE public.solutions
      SET votes_count = votes_count - (CASE WHEN OLD.vote_type = 'upvote' THEN 1 ELSE -1 END)
      WHERE id = OLD.votable_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$;

-- Finally, re-create the trigger
CREATE TRIGGER on_vote_change
  AFTER INSERT OR DELETE ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.update_votes_count();
