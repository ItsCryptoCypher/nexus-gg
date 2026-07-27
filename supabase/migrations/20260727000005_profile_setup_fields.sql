alter table public.profiles
  add column if not exists discord_connections jsonb not null default '[]'::jsonb,
  add column if not exists activity_status_confirmed boolean not null default false,
  add column if not exists setup_dismissed_at timestamptz;

comment on column public.profiles.discord_connections is 'Cached Discord linked accounts from OAuth connections scope.';
comment on column public.profiles.activity_status_confirmed is 'User confirmed Activity Status is enabled in Discord (or we detected a Playing activity).';

revoke update on table public.profiles from authenticated;
grant update (display_name, avatar_url, updated_at, activity_status_confirmed, setup_dismissed_at) on table public.profiles to authenticated;
