-- Nexus friend graph: pending requests + accepted inner circle.
create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  addressee_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint friendships_no_self check (requester_id <> addressee_id)
);

comment on table public.friendships is 'Nexus friend requests and accepted friendships between profiles.';

create unique index friendships_pair_uidx
  on public.friendships (
    least(requester_id, addressee_id),
    greatest(requester_id, addressee_id)
  );

create index friendships_requester_id_idx on public.friendships (requester_id);
create index friendships_addressee_id_idx on public.friendships (addressee_id);
create index friendships_status_idx on public.friendships (status);

alter table public.friendships enable row level security;

create policy "friendships_select_participant"
  on public.friendships
  for select
  to authenticated
  using (
    (select auth.uid()) = requester_id
    or (select auth.uid()) = addressee_id
  );

create policy "friendships_insert_as_requester"
  on public.friendships
  for insert
  to authenticated
  with check (
    (select auth.uid()) = requester_id
    and status = 'pending'
  );

-- Addressee accepts/declines; requester may cancel pending; either may block later.
create policy "friendships_update_participant"
  on public.friendships
  for update
  to authenticated
  using (
    (select auth.uid()) = requester_id
    or (select auth.uid()) = addressee_id
  )
  with check (
    (select auth.uid()) = requester_id
    or (select auth.uid()) = addressee_id
  );

create policy "friendships_delete_participant"
  on public.friendships
  for delete
  to authenticated
  using (
    (select auth.uid()) = requester_id
    or (select auth.uid()) = addressee_id
  );

revoke all on table public.friendships from anon;
grant select, insert, update, delete on table public.friendships to authenticated;
