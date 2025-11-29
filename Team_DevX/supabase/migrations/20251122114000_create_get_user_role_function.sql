create or replace function public.get_user_role(p_user_id uuid)
returns text
language sql
security definer
stable
as $$
  select role from public.profiles where id = p_user_id;
$$;
