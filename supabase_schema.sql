-- Verse Music — Supabase schema
-- Run this once in Supabase Dashboard -> SQL Editor -> New query -> Run.

create extension if not exists pgcrypto;

-- ---------- profiles ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)) || '_' || substr(new.id::text, 1, 4),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- music metadata ----------
create table if not exists genres (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

create table if not exists artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  bio text,
  created_at timestamptz not null default now()
);

create table if not exists albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist_id uuid references artists(id) on delete set null,
  cover_url text,
  release_date date,
  created_at timestamptz not null default now()
);

create table if not exists songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist_id uuid references artists(id) on delete set null,
  album_id uuid references albums(id) on delete set null,
  genre_id uuid references genres(id) on delete set null,
  cover_url text,
  audio_url text not null,
  duration_seconds int not null default 0,
  release_date date,
  explicit boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_songs_artist on songs(artist_id);
create index if not exists idx_songs_album on songs(album_id);
create index if not exists idx_albums_artist on albums(artist_id);

-- ---------- playlists ----------
create table if not exists playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  cover_url text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists playlist_songs (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid not null references playlists(id) on delete cascade,
  song_id uuid not null references songs(id) on delete cascade,
  position int not null default 0,
  added_at timestamptz not null default now()
);
create index if not exists idx_playlist_songs_playlist on playlist_songs(playlist_id);

-- ---------- liked songs ----------
create table if not exists liked_songs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  song_id uuid not null references songs(id) on delete cascade,
  liked_at timestamptz not null default now(),
  unique (user_id, song_id)
);

-- ---------- recently played ----------
create table if not exists recently_played (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  song_id uuid not null references songs(id) on delete cascade,
  played_at timestamptz not null default now()
);
create index if not exists idx_recently_played_user on recently_played(user_id, played_at desc);

-- ---------- follows ----------
create table if not exists artist_follows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  artist_id uuid not null references artists(id) on delete cascade,
  followed_at timestamptz not null default now(),
  unique (user_id, artist_id)
);

create table if not exists user_follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references auth.users(id) on delete cascade,
  followed_id uuid not null references auth.users(id) on delete cascade,
  followed_at timestamptz not null default now(),
  unique (follower_id, followed_id)
);

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
alter table profiles enable row level security;
alter table genres enable row level security;
alter table artists enable row level security;
alter table albums enable row level security;
alter table songs enable row level security;
alter table playlists enable row level security;
alter table playlist_songs enable row level security;
alter table liked_songs enable row level security;
alter table recently_played enable row level security;
alter table artist_follows enable row level security;
alter table user_follows enable row level security;

-- Public read access to music metadata (anyone signed in can browse)
create policy "Public read genres" on genres for select using (true);
create policy "Public read artists" on artists for select using (true);
create policy "Public read albums" on albums for select using (true);
create policy "Public read songs" on songs for select using (true);

-- Only admins can write music metadata
create policy "Admins write genres" on genres for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins update genres" on genres for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins delete genres" on genres for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins write artists" on artists for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins update artists" on artists for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins delete artists" on artists for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins write albums" on albums for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins update albums" on albums for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins delete albums" on albums for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins write songs" on songs for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins update songs" on songs for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins delete songs" on songs for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Profiles: readable by anyone (for public playlists/profile pages), editable only by owner
create policy "Public read profiles" on profiles for select using (true);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);

-- Playlists: owners manage their own; public playlists are readable by everyone
create policy "Users manage own playlists" on playlists for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Anyone can read public playlists" on playlists for select
  using (is_public = true or auth.uid() = user_id);

-- Playlist songs: follow the parent playlist's ownership/visibility
create policy "Manage songs in own playlists" on playlist_songs for all
  using (exists (select 1 from playlists p where p.id = playlist_songs.playlist_id and p.user_id = auth.uid()))
  with check (exists (select 1 from playlists p where p.id = playlist_songs.playlist_id and p.user_id = auth.uid()));
create policy "Read songs in public playlists" on playlist_songs for select
  using (exists (select 1 from playlists p where p.id = playlist_songs.playlist_id and (p.is_public = true or p.user_id = auth.uid())));

-- Liked songs: strictly private to the owner
create policy "Users manage own likes" on liked_songs for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Recently played: strictly private to the owner
create policy "Users manage own history" on recently_played for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Follows: users manage their own follow relationships; follow counts readable by all
create policy "Users manage own artist follows" on artist_follows for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Public read artist follows" on artist_follows for select using (true);

create policy "Users manage own user follows" on user_follows for all
  using (auth.uid() = follower_id) with check (auth.uid() = follower_id);
create policy "Public read user follows" on user_follows for select using (true);
