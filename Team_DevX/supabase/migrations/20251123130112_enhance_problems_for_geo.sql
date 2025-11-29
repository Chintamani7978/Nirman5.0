-- Add city, region, and pincode columns to the problems table if they don't exist
ALTER TABLE public.problems
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS pincode TEXT;

-- First, ensure the helper function is up-to-date.
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      (SELECT role FROM public.user_profiles WHERE user_id = auth.uid()),
      'anon'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to the function
GRANT EXECUTE ON FUNCTION get_my_role() TO authenticated, anon;


-- We will modify the existing update policy to be more permissive for owners.
-- It's better to have one clear UPDATE policy than multiple ones that can conflict.

-- Let's drop any potentially conflicting or old update policies first to ensure a clean slate.
-- Note: Replace "Your existing update policy name" with the actual name if you have one.
-- For this example, I'll assume a common naming convention.
DROP POLICY IF EXISTS "Allow users to update their own problems" ON public.problems;
DROP POLICY IF EXISTS "Allow users to update their own problem details" ON public.problems;


-- Create a single, comprehensive UPDATE policy.
CREATE POLICY "Allow users to update their own problems"
ON public.problems
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
    auth.uid() = user_id AND
    (get_my_role() = 'admin' OR get_my_role() = 'user')
);

-- Note on column-level security:
-- The policy above grants permission to update the *row*. The application layer
-- should be responsible for controlling *which columns* a non-admin user can edit
-- (e.g., title, description, city, region, pincode, but not status or upvote count).
-- RLS in PostgreSQL does not have a simple `WITH CHECK` syntax for specific columns.
-- The application should only send the fields that are permissible for the user to change.
