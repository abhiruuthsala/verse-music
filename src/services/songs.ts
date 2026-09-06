import { supabase } from '../lib/supabaseClient';
import type { Song, Artist, Album } from '../types';

export async function fetchHomeSections() {
  const [{ data: popular }, { data: newReleases }, { data: artists }] = await Promise.all([
    supabase.from('songs').select('*, artist:artists(*), album:albums(*)').order('created_at', { ascending: false }).limit(10),
    supabase.from('albums').select('*, artist:artists(*)').order('release_date', { ascending: false }).limit(10),
    supabase.from('artists').select('*').limit(10)
  ]);
  return {
    popular: (popular ?? []) as Song[],
    newReleases: (newReleases ?? []) as Album[],
    artists: (artists ?? []) as Artist[]
  };
}

export async function fetchRecentlyPlayed(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from('recently_played')
    .select('played_at, song:songs(*, artist:artists(*), album:albums(*))')
    .eq('user_id', userId)
    .order('played_at', { ascending: false })
    .limit(limit);
  if (error) return { songs: [] as Song[], error: error.message };
  const songs = (data ?? []).map((r: any) => r.song).filter(Boolean) as Song[];
  return { songs, error: null };
}

export async function searchAll(query: string) {
  const like = `%${query}%`;
  const [{ data: songs }, { data: artists }, { data: albums }, { data: playlists }] = await Promise.all([
    supabase.from('songs').select('*, artist:artists(*), album:albums(*)').ilike('title', like).limit(20),
    supabase.from('artists').select('*').ilike('name', like).limit(20),
    supabase.from('albums').select('*, artist:artists(*)').ilike('title', like).limit(20),
    supabase.from('playlists').select('*').ilike('name', like).eq('is_public', true).limit(20)
  ]);
  return {
    songs: (songs ?? []) as Song[],
    artists: (artists ?? []) as Artist[],
    albums: (albums ?? []) as Album[],
    playlists: playlists ?? []
  };
}

export async function fetchArtist(id: string) {
  const { data: artist } = await supabase.from('artists').select('*').eq('id', id).single();
  const { data: songs } = await supabase
    .from('songs')
    .select('*, artist:artists(*), album:albums(*)')
    .eq('artist_id', id)
    .order('created_at', { ascending: false });
  const { data: albums } = await supabase.from('albums').select('*, artist:artists(*)').eq('artist_id', id);
  return { artist: artist as Artist | null, songs: (songs ?? []) as Song[], albums: (albums ?? []) as Album[] };
}

export async function fetchAlbum(id: string) {
  const { data: album } = await supabase.from('albums').select('*, artist:artists(*)').eq('id', id).single();
  const { data: songs } = await supabase
    .from('songs')
    .select('*, artist:artists(*), album:albums(*)')
    .eq('album_id', id)
    .order('created_at', { ascending: true });
  return { album: album as Album | null, songs: (songs ?? []) as Song[] };
}

export async function isFollowingArtist(userId: string, artistId: string) {
  const { data } = await supabase
    .from('artist_follows')
    .select('id')
    .eq('user_id', userId)
    .eq('artist_id', artistId)
    .maybeSingle();
  return !!data;
}

export async function followArtist(userId: string, artistId: string) {
  return supabase.from('artist_follows').insert({ user_id: userId, artist_id: artistId });
}

export async function unfollowArtist(userId: string, artistId: string) {
  return supabase.from('artist_follows').delete().eq('user_id', userId).eq('artist_id', artistId);
}
