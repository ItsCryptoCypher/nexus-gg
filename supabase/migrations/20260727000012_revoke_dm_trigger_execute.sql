-- Trigger helper should not be callable via the Data API.
revoke all on function public.tg_direct_message_inserted() from public;
revoke all on function public.tg_direct_message_inserted() from anon;
revoke all on function public.tg_direct_message_inserted() from authenticated;
