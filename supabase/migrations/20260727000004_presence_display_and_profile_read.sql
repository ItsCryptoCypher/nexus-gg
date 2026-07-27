drop policy if exists "profiles_select_own" on public.profiles;

create policy "profiles_select_authenticated"
  on public.profiles
  for select
  to authenticated
  using ( true );

alter table public.player_presence
  add column if not exists display_name text,
  add column if not exists avatar_url text;
