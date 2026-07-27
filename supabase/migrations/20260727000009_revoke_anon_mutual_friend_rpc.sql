revoke all on function public.mutual_friend_count(uuid) from public;
revoke all on function public.mutual_friend_count(uuid) from anon;
revoke all on function public.get_mutual_friends(uuid, integer) from public;
revoke all on function public.get_mutual_friends(uuid, integer) from anon;
grant execute on function public.mutual_friend_count(uuid) to authenticated;
grant execute on function public.get_mutual_friends(uuid, integer) to authenticated;
