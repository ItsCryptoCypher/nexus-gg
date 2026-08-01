alter table public.player_presence
  add column if not exists activity_details text,
  add column if not exists activity_started_at timestamptz,
  add column if not exists party_size integer,
  add column if not exists party_max integer;

comment on column public.player_presence.activity_details is 'Discord activity.details (what the player is doing).';
comment on column public.player_presence.activity_started_at is 'Discord activity.timestamps.start for elapsed display.';
comment on column public.player_presence.party_size is 'Discord activity.party.size current count.';
comment on column public.player_presence.party_max is 'Discord activity.party.size max capacity.';
