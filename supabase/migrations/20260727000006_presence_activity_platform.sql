alter table public.player_presence
  add column if not exists activity_platform text;

comment on column public.player_presence.activity_platform is 'Discord activity.platform (xbox, ps5, desktop, etc.) when present.';
