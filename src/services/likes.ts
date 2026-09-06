import { supabase } from '../lib/supabaseClient';
import type { Song } from '../types';

export async function fetchLikedSongs(userId: string) {
  const { data, error } = await supabase
    .from('liked_songs')
    .select('id, liked_at, song:songs(*, artist:artists(*), album:albums(*))')
    .eq('user_id', userId)
    .order('liked_at', { ascending: false });
  if (error) return { rows: [] as { id: string; song: Song }[], error: error.message };
  const rows = (data ?? []).map((r: any) => ({ id: r.id, song: r.song as Song })).filter((r) => r.song);
  return { rows, error: null };
}

export async function isSongLiked(userId: string, songId: string) {
  const { data } = await supabase
    .from('liked_songs')
    .select('id')
    .eq('user_id', userId)
    .eq('song_id', songId)
    .maybeSingle();
  return !!data;
}

export async function likeSong(userId: string, songId: string) {
  return supabase.from('liked_songs').insert({ user_id: userId, song_id: songId });
}

export async function unlikeSong(userId: string, songId: string) {
  return supabase.from('liked_songs').delete().eq('user_id', userId).eq('song_id', songId);
}
