ALTER TABLE public.profiles ADD COLUMN email TEXT;

-- backfill emails from auth.users
UPDATE public.profiles
SET email = (
  SELECT raw_user_meta_data->>'email'
  FROM auth.users
  WHERE auth.users.id = public.profiles.id
);
