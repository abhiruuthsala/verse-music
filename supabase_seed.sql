-- Verse Music — demo seed data
-- Run AFTER supabase_schema.sql. Safe to re-run (uses fixed UUIDs, upserts).
--
-- Audio files are SoundHelix's openly available instrumental test tracks —
-- commonly used for exactly this purpose (demoing music players) and free
-- of copyright restriction. Replace audio_url / cover_url with your own
-- legally obtained files whenever you're ready; the schema doesn't change.

insert into genres (id, name) values
  ('11111111-1111-1111-1111-111111111101', 'Electronic'),
  ('11111111-1111-1111-1111-111111111102', 'Lo-fi'),
  ('11111111-1111-1111-1111-111111111103', 'Ambient')
on conflict (id) do nothing;

insert into artists (id, name, image_url, bio) values
  ('22222222-2222-2222-2222-222222222201', 'Nova Horizon', 'https://picsum.photos/seed/nova/400', 'Demo artist for Verse Music placeholder content.'),
  ('22222222-2222-2222-2222-222222222202', 'Glass Hollow', 'https://picsum.photos/seed/glasshollow/400', 'Demo artist for Verse Music placeholder content.'),
  ('22222222-2222-2222-2222-222222222203', 'Paper Static', 'https://picsum.photos/seed/paperstatic/400', 'Demo artist for Verse Music placeholder content.')
on conflict (id) do nothing;

insert into albums (id, title, artist_id, cover_url, release_date) values
  ('33333333-3333-3333-3333-333333333301', 'Afterglow', '22222222-2222-2222-2222-222222222201', 'https://picsum.photos/seed/afterglow/400', '2025-03-14'),
  ('33333333-3333-3333-3333-333333333302', 'Slow Static', '22222222-2222-2222-2222-222222222202', 'https://picsum.photos/seed/slowstatic/400', '2025-06-01'),
  ('33333333-3333-3333-3333-333333333303', 'Paper Moons', '22222222-2222-2222-2222-222222222203', 'https://picsum.photos/seed/papermoons/400', '2025-08-22')
on conflict (id) do nothing;

insert into songs (id, title, artist_id, album_id, genre_id, cover_url, audio_url, duration_seconds, release_date) values
  ('44444444-4444-4444-4444-444444444401', 'Afterglow (Intro)', '22222222-2222-2222-2222-222222222201', '33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111101', 'https://picsum.photos/seed/afterglow/400', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 429, '2025-03-14'),
  ('44444444-4444-4444-4444-444444444402', 'Neon Tide', '22222222-2222-2222-2222-222222222201', '33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111101', 'https://picsum.photos/seed/afterglow/400', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 372, '2025-03-14'),
  ('44444444-4444-4444-4444-444444444403', 'Slow Static', '22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111102', 'https://picsum.photos/seed/slowstatic/400', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 301, '2025-06-01'),
  ('44444444-4444-4444-4444-444444444404', 'Room Tone', '22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111103', 'https://picsum.photos/seed/slowstatic/400', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 288, '2025-06-01'),
  ('44444444-4444-4444-4444-444444444405', 'Paper Moons', '22222222-2222-2222-2222-222222222203', '33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111102', 'https://picsum.photos/seed/papermoons/400', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 355, '2025-08-22'),
  ('44444444-4444-4444-4444-444444444406', 'Static Bloom', '22222222-2222-2222-2222-222222222203', '33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111103', 'https://picsum.photos/seed/papermoons/400', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 401, '2025-08-22')
on conflict (id) do nothing;
