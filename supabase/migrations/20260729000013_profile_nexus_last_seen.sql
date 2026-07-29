-- Nexus web presence heartbeat (client updates only their own row).
alter table public.profiles
  add column if not exists nexus_last_seen_at timestamptz;

comment on column public.profiles.nexus_last_seen_at is
  'Last Nexus app heartbeat; used to show Online on Nexus when Discord is offline.';

revoke update on table public.profiles from authenticated;
grant update (
  display_name,
  avatar_url,
  updated_at,
  activity_status_confirmed,
  setup_dismissed_at,
  nexus_last_seen_at
) on table public.profiles to authenticated;
