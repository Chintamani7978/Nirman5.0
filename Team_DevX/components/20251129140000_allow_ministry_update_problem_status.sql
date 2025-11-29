-- Allow ministry and admin users to update problem status
DROP POLICY IF EXISTS "Ministry can update problem status" ON public.problems;

CREATE POLICY "Ministry can update problem status"
  ON public.problems FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('ministry', 'admin')
  )
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('ministry', 'admin')
  );
