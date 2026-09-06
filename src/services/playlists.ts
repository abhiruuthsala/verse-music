import { supabase } from '../lib/supabaseClient';
import type { Playlist, PlaylistSong } from '../types';

export async function fetchUserPlaylists(userId: string) {
  const { data, error } = await supabase
    .from('playlists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { playlists: (data ?? []) as Playlist[], error: error?.message ?? null };
}

export async function createPlaylist(userId: string, name: string, description?: string) {
  const { data, error } = await supabase
    .from('playlists')
    .insert({ user_id: userId, name, description: description ?? null })
    .select()
    .single();
  return { playlist: data as Playlist | null, error: error?.message ?? null };
}

export async function renamePlaylist(playlistId: string, name: string) {
  return supabase.from('playlists').update({ name, updated_at: new Date().toISOString() }).eq('id', playlistId);
}

export async function deletePlaylist(playlistId: string) {
  return supabase.from('playlists').delete().eq('id', playlistId);
}

export async function fetchPlaylist(playlistId: string) {
  const { data: playlist } = await supabase.from('playlists').select('*').eq('id', playlistId).single();
  const { data: tracks, error } = await supabase
    .from('playlist_songs')
    .select('*, song:songs(*, artist:artists(*), album:albums(*))')
    .eq('playlist_id', playlistId)
    .order('position', { ascending: true });
  return {
    playlist: playlist as Playlist | null,
    tracks: (tracks ?? []) as PlaylistSong[],
    error: error?.message ?? null
  };
}

export async function addSongToPlaylist(playlistId: string, songId: string) {
  const { count } = await supabase
    .from('playlist_songs')
    .select('id', { count: 'exact', head: true })
    .eq('playlist_id', playlistId);
  return supabase.from('playlist_songs').insert({ playlist_id: playlistId, song_id: songId, position: count ?? 0 });
}

export async function removeSongFromPlaylist(playlistSongRowId: string) {
  return supabase.from('playlist_songs').delete().eq('id', playlistSongRowId);
}

export async function reorderPlaylistSongs(rows: { id: string; position: number }[]) {
  // Simple sequential update — fine for typical playlist sizes.
  await Promise.all(rows.map((r) => supabase.from('playlist_songs').update({ position: r.position }).eq('id', r.id)));
}
