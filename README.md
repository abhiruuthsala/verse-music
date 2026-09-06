# Verse Music

A functional music streaming web app: authentication, a persistent bottom
player, playlists, liked songs, recently played history, search across
songs/artists/albums, and artist/album pages — built with React, TypeScript,
Vite, Tailwind CSS, and Supabase.

## 1. Install Node.js

Download and install the LTS version from nodejs.org if you don't have it.

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

A `.env` file is already included with your Supabase project URL and anon
key filled in. If you ever need to redo it:

```bash
cp .env.example .env
```
Then fill in:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```
The anon/publishable key is meant to be public in frontend code — safety
comes from Row Level Security (RLS), not from hiding this key. **Never**
put your Supabase service_role key anywhere in this project.

## 4. Set up the database

In your Supabase project dashboard:
1. Go to **SQL Editor → New query**
2. Paste in and run **`supabase_schema.sql`** — creates all tables, the
   auto-profile-on-signup trigger, and RLS policies.
3. Paste in and run **`supabase_seed.sql`** — adds demo artists, albums,
   and songs so the app isn't empty on first run. These use openly
   available instrumental test tracks (SoundHelix), not copyrighted music
   — swap in your own legally obtained `audio_url` values whenever you're
   ready; the schema doesn't need to change.

Optional but recommended for local testing: **Authentication → Providers
→ Email** → turn off "Confirm email" so new accounts can sign in
immediately without clicking an email link.

## 5. Run it

```bash
npm run dev
```
Visit the URL it prints (usually `http://localhost:5173`).

## 6. Adding your own music

- **Add an artist**: insert a row into `artists` (name, image_url, bio) —
  either via Supabase's Table Editor UI or SQL.
- **Add an album**: insert into `albums`, referencing the artist's `id`.
- **Add a song**: insert into `songs`, referencing `artist_id` and
  `album_id`, with a real `audio_url` you have the legal right to stream
  and a `duration_seconds` value.
- **Add a genre**: insert into `genres`, then reference its `id` from a
  song's `genre_id`.

Since `songs`/`artists`/`albums` are admin-write-only (see RLS policies in
`supabase_schema.sql`), you'll either edit these tables directly in the
Supabase Table Editor (using your own account, which bypasses RLS there),
or set your own profile's `role` column to `'admin'` so your logged-in
account can write to these tables from a future admin UI you build.

## 7. Creating playlists (as a user)

Once logged in, go to **Playlists → Create**, then use the **+** style
"add to playlist" actions on song rows (or extend the UI further) to build
them out. Playlists and liked songs are fully live against Supabase with
RLS, so each user only ever sees their own.

## 8. Deploying the website

This is a static Vite build (no custom backend server needed — Supabase
handles the "backend" parts), so it deploys well to:

- **Vercel**: import the GitHub repo, framework preset "Vite", add the two
  `VITE_...` environment variables in the dashboard, deploy.
- **Netlify**: same idea — build command `npm run build`, publish
  directory `dist`, add environment variables in site settings.
- **GitHub Pages**: works too, but needs a bit of extra config for client-
  side routing (a `404.html` fallback) since this uses React Router.

Steps for Vercel (recommended, simplest):
1. Push this project to a GitHub repo.
2. Go to vercel.com → New Project → import the repo.
3. Framework preset: Vite. Build command: `npm run build`. Output dir: `dist`.
4. Add environment variables `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_PUBLISHABLE_KEY` in the project settings.
5. Deploy — you'll get a live `.vercel.app` URL immediately, with no
   cold-start/sleep behavior since it's a static site.
6. In Supabase → Authentication → URL Configuration, add your live URL as
   an allowed redirect URL (needed for password reset emails to work).

## What's implemented vs. what's a starting point

**Fully working**: sign up/login/logout/forgot-password/reset-password,
persistent profile creation, a real audio player that survives page
navigation (queue, shuffle, repeat, seek, volume), search with debounce
across songs/artists/albums/playlists, liked songs, playlists (create/
rename/delete/add/remove songs/play all), recently played history, artist
follow/unfollow, artist and album pages, responsive layout with a
collapsing sidebar and mobile bottom nav, and a PWA manifest + minimal
service worker so the site can be installed.

**Structural, not a full UI yet**: the `role` column and RLS policies
support an admin/user split, but there's no dedicated `/admin` dashboard
screen in this pass — for now, manage `artists`/`albums`/`songs`/`genres`
directly in Supabase's Table Editor. The PWA manifest and service worker
are in place and installable, but the service worker doesn't do offline
caching yet (deliberately, to avoid ever caching private user data
insecurely) — that's a reasonable next step if you want true offline
playback later.

## Notes on the demo audio

The seeded `audio_url` values point to SoundHelix's publicly available
instrumental test tracks, which are commonly used exactly for this purpose
(demoing music players) and are not copyrighted commercial releases.
Replace them with your own legally obtained audio whenever you're ready —
no schema or code changes needed, just update the `audio_url` column.
