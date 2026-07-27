-- Game parties backed by ephemeral Discord voice channels.
create table public.game_parties (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  game_title text not null,
  description text,
  party_max integer not null default 4
    check (party_max >= 2 and party_max <= 16),
  status text not null default 'provisioning'
    check (status in ('provisioning', 'active', 'ended')),
  voice_provider text not null default 'discord'
    check (voice_provider in ('discord')),
  discord_channel_id text,
  discord_invite_url text,
  discord_invite_code text,
  cover_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  ended_at timestamptz
);

comment on table public.game_parties is 'Nexus game parties; voice hosted in Discord private VCs.';

create index game_parties_host_id_idx on public.game_parties (host_id);
create index game_parties_status_idx on public.game_parties (status);
create index game_parties_discord_channel_id_idx on public.game_parties (discord_channel_id);

create table public.game_party_members (
  party_id uuid not null references public.game_parties (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  discord_id text,
  role text not null default 'member'
    check (role in ('host', 'member')),
  status text not null default 'joined'
    check (status in ('invited', 'joined', 'left')),
  in_voice boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (party_id, user_id)
);

comment on table public.game_party_members is 'Members and invites for game parties.';

create index game_party_members_user_id_idx on public.game_party_members (user_id);
create index game_party_members_status_idx on public.game_party_members (status);
create index game_party_members_discord_id_idx on public.game_party_members (discord_id);

alter table public.game_parties enable row level security;
alter table public.game_party_members enable row level security;

-- Parties visible to authenticated users (open lobby discovery later);
-- writes restricted to host / members via policies below.
create policy "game_parties_select_authenticated"
  on public.game_parties
  for select
  to authenticated
  using ( true );

create policy "game_parties_insert_host"
  on public.game_parties
  for insert
  to authenticated
  with check ( (select auth.uid()) = host_id );

create policy "game_parties_update_host"
  on public.game_parties
  for update
  to authenticated
  using ( (select auth.uid()) = host_id )
  with check ( (select auth.uid()) = host_id );

create policy "game_party_members_select_authenticated"
  on public.game_party_members
  for select
  to authenticated
  using ( true );

create policy "game_party_members_insert_self_or_host"
  on public.game_party_members
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    or exists (
      select 1
      from public.game_parties p
      where p.id = party_id
        and p.host_id = (select auth.uid())
        and p.status in ('provisioning', 'active')
    )
  );

create policy "game_party_members_update_self_or_host"
  on public.game_party_members
  for update
  to authenticated
  using (
    (select auth.uid()) = user_id
    or exists (
      select 1
      from public.game_parties p
      where p.id = party_id
        and p.host_id = (select auth.uid())
    )
  )
  with check (
    (select auth.uid()) = user_id
    or exists (
      select 1
      from public.game_parties p
      where p.id = party_id
        and p.host_id = (select auth.uid())
    )
  );

revoke all on table public.game_parties from anon;
revoke all on table public.game_party_members from anon;
grant select, insert, update on table public.game_parties to authenticated;
grant select, insert, update on table public.game_party_members to authenticated;
-- Service role (bot) bypasses RLS for voice sync + channel cleanup.
