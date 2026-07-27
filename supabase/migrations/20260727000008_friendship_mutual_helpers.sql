-- Mutual friends require reading friendships the caller is not on.
-- Keep SECURITY DEFINER narrow: only returns count / mutual profile snippets.

create or replace function public.mutual_friend_count(other_user uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  with me as (
    select auth.uid() as uid
  ),
  my_friends as (
    select case
      when f.requester_id = (select uid from me) then f.addressee_id
      else f.requester_id
    end as friend_id
    from public.friendships f
    where f.status = 'accepted'
      and (
        f.requester_id = (select uid from me)
        or f.addressee_id = (select uid from me)
      )
  ),
  their_friends as (
    select case
      when f.requester_id = other_user then f.addressee_id
      else f.requester_id
    end as friend_id
    from public.friendships f
    where f.status = 'accepted'
      and (f.requester_id = other_user or f.addressee_id = other_user)
  )
  select coalesce(count(*)::integer, 0)
  from my_friends m
  inner join their_friends t on t.friend_id = m.friend_id
  where other_user is distinct from (select uid from me)
    and (select uid from me) is not null;
$$;

create or replace function public.get_mutual_friends(
  other_user uuid,
  lim integer default 3
)
returns table (
  id uuid,
  display_name text,
  avatar_url text
)
language sql
stable
security definer
set search_path = ''
as $$
  with me as (
    select auth.uid() as uid
  ),
  my_friends as (
    select case
      when f.requester_id = (select uid from me) then f.addressee_id
      else f.requester_id
    end as friend_id
    from public.friendships f
    where f.status = 'accepted'
      and (
        f.requester_id = (select uid from me)
        or f.addressee_id = (select uid from me)
      )
  ),
  their_friends as (
    select case
      when f.requester_id = other_user then f.addressee_id
      else f.requester_id
    end as friend_id
    from public.friendships f
    where f.status = 'accepted'
      and (f.requester_id = other_user or f.addressee_id = other_user)
  ),
  mutuals as (
    select m.friend_id
    from my_friends m
    inner join their_friends t on t.friend_id = m.friend_id
  )
  select p.id, p.display_name, p.avatar_url
  from mutuals mu
  inner join public.profiles p on p.id = mu.friend_id
  where other_user is distinct from (select uid from me)
    and (select uid from me) is not null
  order by p.display_name nulls last
  limit greatest(coalesce(lim, 3), 0);
$$;

revoke all on function public.mutual_friend_count(uuid) from public;
revoke all on function public.mutual_friend_count(uuid) from anon;
revoke all on function public.get_mutual_friends(uuid, integer) from public;
revoke all on function public.get_mutual_friends(uuid, integer) from anon;
grant execute on function public.mutual_friend_count(uuid) to authenticated;
grant execute on function public.get_mutual_friends(uuid, integer) to authenticated;
