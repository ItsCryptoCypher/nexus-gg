-- Profiles linked to auth.users; Discord unlocks features.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  discord_id text unique,
  features_unlocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'App profile per auth user. features_unlocked is set only by trusted triggers.';
comment on column public.profiles.features_unlocked is 'True when the user has a Discord identity. Not client-writable.';

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using ( (select auth.uid()) = id );

create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

-- Prevent clients from forging unlock / discord_id via Data API updates.
create or replace function public.protect_profile_auth_fields()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.id := old.id;
  new.discord_id := old.discord_id;
  new.features_unlocked := old.features_unlocked;
  new.created_at := old.created_at;
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_protect_auth_fields
  before update on public.profiles
  for each row
  execute function public.protect_profile_auth_fields();

-- Create profile on signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  discord_user_id text;
  has_discord boolean := false;
begin
  select i.provider_id
  into discord_user_id
  from auth.identities i
  where i.user_id = new.id
    and i.provider = 'discord'
  limit 1;

  has_discord := discord_user_id is not null;

  if not has_discord
     and coalesce(new.raw_app_meta_data->>'provider', '') = 'discord' then
    has_discord := true;
    discord_user_id := new.raw_user_meta_data->>'provider_id';
  end if;

  insert into public.profiles (
    id,
    display_name,
    avatar_url,
    discord_id,
    features_unlocked
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'preferred_username',
      new.raw_user_meta_data->>'user_name',
      split_part(coalesce(new.email, 'player'), '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url',
    discord_user_id,
    has_discord
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Unlock when Discord is linked later.
create or replace function public.handle_discord_identity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.provider = 'discord' then
    update public.profiles
    set
      discord_id = new.provider_id,
      features_unlocked = true,
      avatar_url = coalesce(
        avatar_url,
        new.identity_data->>'avatar_url'
      ),
      display_name = coalesce(
        nullif(display_name, ''),
        new.identity_data->>'full_name',
        new.identity_data->>'name',
        new.identity_data->>'preferred_username'
      ),
      updated_at = now()
    where id = new.user_id;
  end if;

  return new;
end;
$$;

create trigger on_discord_identity_created
  after insert on auth.identities
  for each row
  execute function public.handle_discord_identity();

revoke all on table public.profiles from anon;
grant select, update on table public.profiles to authenticated;
