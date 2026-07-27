-- Allow trusted triggers to set unlock fields; clients may only update display fields.
drop trigger if exists profiles_protect_auth_fields on public.profiles;
drop function if exists public.protect_profile_auth_fields();

revoke update on table public.profiles from authenticated;
grant update (display_name, avatar_url, updated_at) on table public.profiles to authenticated;

create or replace function public.set_profile_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_profile_updated_at();
