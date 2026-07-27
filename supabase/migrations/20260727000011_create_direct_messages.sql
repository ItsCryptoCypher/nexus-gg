-- 1:1 direct messages between accepted Nexus friends.

create or replace function public.are_accepted_friends(a uuid, b uuid)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1
    from public.friendships f
    where f.status = 'accepted'
      and (
        (f.requester_id = a and f.addressee_id = b)
        or (f.requester_id = b and f.addressee_id = a)
      )
  );
$$;

comment on function public.are_accepted_friends(uuid, uuid) is
  'True when the two profiles have an accepted friendship.';

revoke all on function public.are_accepted_friends(uuid, uuid) from public;
revoke all on function public.are_accepted_friends(uuid, uuid) from anon;
grant execute on function public.are_accepted_friends(uuid, uuid) to authenticated;

create table public.direct_conversations (
  id uuid primary key default gen_random_uuid(),
  user_low uuid not null references public.profiles (id) on delete cascade,
  user_high uuid not null references public.profiles (id) on delete cascade,
  last_message_at timestamptz,
  last_message_preview text,
  user_low_last_read_at timestamptz not null default 'epoch'::timestamptz,
  user_high_last_read_at timestamptz not null default 'epoch'::timestamptz,
  created_at timestamptz not null default now(),
  constraint direct_conversations_ordered check (user_low < user_high)
);

comment on table public.direct_conversations is
  '1:1 DM threads between two profiles (user_low/user_high ordered).';

create unique index direct_conversations_pair_uidx
  on public.direct_conversations (user_low, user_high);

create index direct_conversations_last_message_at_idx
  on public.direct_conversations (last_message_at desc nulls last);

create table public.direct_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null
    references public.direct_conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

comment on table public.direct_messages is
  'Messages inside a direct conversation. Sender must be a participant.';

create index direct_messages_conversation_created_idx
  on public.direct_messages (conversation_id, created_at desc);

create index direct_messages_sender_id_idx
  on public.direct_messages (sender_id);

-- Keep conversation preview / read cursors in sync with new messages.
create or replace function public.tg_direct_message_inserted()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.direct_conversations
  set
    last_message_at = new.created_at,
    last_message_preview = left(new.body, 160),
    user_low_last_read_at = case
      when new.sender_id = user_low then new.created_at
      else user_low_last_read_at
    end,
    user_high_last_read_at = case
      when new.sender_id = user_high then new.created_at
      else user_high_last_read_at
    end
  where id = new.conversation_id;
  return new;
end;
$$;

create trigger direct_messages_after_insert
  after insert on public.direct_messages
  for each row
  execute function public.tg_direct_message_inserted();

alter table public.direct_conversations enable row level security;
alter table public.direct_messages enable row level security;

create policy "direct_conversations_select_participant"
  on public.direct_conversations
  for select
  to authenticated
  using (
    (select auth.uid()) = user_low
    or (select auth.uid()) = user_high
  );

create policy "direct_conversations_insert_friend"
  on public.direct_conversations
  for insert
  to authenticated
  with check (
    user_low < user_high
    and (
      (select auth.uid()) = user_low
      or (select auth.uid()) = user_high
    )
    and public.are_accepted_friends(user_low, user_high)
  );

create policy "direct_conversations_update_participant"
  on public.direct_conversations
  for update
  to authenticated
  using (
    (select auth.uid()) = user_low
    or (select auth.uid()) = user_high
  )
  with check (
    (select auth.uid()) = user_low
    or (select auth.uid()) = user_high
  );

create policy "direct_messages_select_participant"
  on public.direct_messages
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.direct_conversations c
      where c.id = conversation_id
        and (
          (select auth.uid()) = c.user_low
          or (select auth.uid()) = c.user_high
        )
    )
  );

create policy "direct_messages_insert_sender_friend"
  on public.direct_messages
  for insert
  to authenticated
  with check (
    (select auth.uid()) = sender_id
    and exists (
      select 1
      from public.direct_conversations c
      where c.id = conversation_id
        and (
          (select auth.uid()) = c.user_low
          or (select auth.uid()) = c.user_high
        )
        and public.are_accepted_friends(c.user_low, c.user_high)
    )
  );

revoke all on table public.direct_conversations from anon;
revoke all on table public.direct_messages from anon;
grant select, insert, update on table public.direct_conversations to authenticated;
grant select, insert on table public.direct_messages to authenticated;

-- Live message delivery for open threads.
alter publication supabase_realtime add table public.direct_messages;
