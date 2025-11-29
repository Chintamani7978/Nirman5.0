ALTER POLICY "Authenticated users can create problems" ON public.problems
WITH CHECK (auth.uid() = user_id);
