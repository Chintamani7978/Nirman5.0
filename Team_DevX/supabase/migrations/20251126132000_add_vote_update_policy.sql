-- Allow authenticated citizens to switch vote direction without RLS errors
DROP POLICY IF EXISTS "Users can update their own votes" ON public.votes;
CREATE POLICY "Users can update their own votes"
  ON public.votes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
