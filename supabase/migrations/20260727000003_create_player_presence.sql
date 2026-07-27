create table public.player_presence (
  discord_id text primary key,
  user_id uuid references public.profiles (id) on delete set null,
  status text not null default 'offline',
  activity_name text,
  activity_type integer,
  activity_state text,
  client_status jsonb,
  updated_at timestamptz not null default now()
);

create index player_presence_user_id_idx on public.player_presence (user_id);
create index player_presence_updated_at_idx on public.player_presence (updated_at desc);

comment on table public.player_presence is 'Latest Discord presence per Discord user, written by the presence bot.';

alter table public.player_presence enable row level security;

create policy "player_presence_select_authenticated"
  on public.player_presence
  for select
  to authenticated
  using ( true );

revoke all on table public.player_presence from anon;
grant select on table public.player_presence to authenticated;
