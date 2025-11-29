CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id,
          COALESCE(new.raw_user_meta_data->>'full_name', 'Anonymous User'),
          new.email);
  RETURN new;
END;
$$;
