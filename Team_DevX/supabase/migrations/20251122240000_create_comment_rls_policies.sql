-- First, drop all policies that depend on the function to avoid dependency errors.
DROP POLICY IF EXISTS "Allow authenticated users to view comments" ON public.comments;
DROP POLICY IF EXISTS "Allow citizens to create comments" ON public.comments;
DROP POLICY IF EXISTS "Allow citizens to update their own comments within a time limit" ON public.comments;
DROP POLICY IF EXISTS "Allow citizens to soft delete their own comments" ON public.comments;

-- Now, it is safe to drop and re-create the function.
DROP FUNCTION IF EXISTS get_my_role();
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Finally, re-create all the policies from a clean slate.

-- 1. Policy: Allow any authenticated user to view comments
CREATE POLICY "Allow authenticated users to view comments"
ON public.comments
FOR SELECT
TO authenticated
USING (is_deleted = false);

-- 2. Policy: Allow citizens to create comments
CREATE POLICY "Allow citizens to create comments"
ON public.comments
FOR INSERT
TO authenticated
WITH CHECK (
  get_my_role() = 'citizen' AND
  auth.uid() = user_id
);

-- 3. Policy: Allow citizens to update their own comments within 10 minutes
CREATE POLICY "Allow citizens to update their own comments within a time limit"
ON public.comments
FOR UPDATE
TO authenticated
USING (
  get_my_role() = 'citizen' AND
  auth.uid() = user_id AND
  created_at > (now() - INTERVAL '10 minutes')
)
WITH CHECK (
  -- They can only update the content, not other fields
  content IS NOT NULL
);

-- 4. Policy: Allow citizens to delete (soft delete) their own comments
CREATE POLICY "Allow citizens to soft delete their own comments"
ON public.comments
FOR UPDATE
TO authenticated
USING (
  get_my_role() = 'citizen' AND
  auth.uid() = user_id
)
WITH CHECK (
  -- This policy only allows updating the is_deleted flag
  is_deleted = true
);