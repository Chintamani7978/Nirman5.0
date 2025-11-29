create table
  public.audit_logs (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    user_id uuid null,
    action character varying not null,
    target_type character varying null,
    target_id character varying null,
    details jsonb null,
    constraint audit_logs_pkey primary key (id),
    constraint audit_logs_user_id_fkey foreign key (user_id) references profiles (id) on delete set null
  ) tablespace pg_default;

-- Enable RLS
alter table public.audit_logs enable row level security;

-- Create policies
create policy "Allow ministry and admin to read audit logs" on public.audit_logs
as permissive for select
to authenticated
using (get_user_role(auth.uid()) in ('ministry', 'admin'));
