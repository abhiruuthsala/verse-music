import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPlaylist, renamePlaylist, removeSongFromPlaylist } from '../services/playlists';
import { SongRow } from '../components/SongRow';
import { usePlayer } from '../contexts/PlayerContext';
import type { Playlist, PlaylistSong } from '../types';

export default function PlaylistDetail() {
  const { id } = useParams<{ id: string }>();
  const { playSong } = usePlayer();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [tracks, setTracks] = useState<PlaylistSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchPlaylist(id).then((res) => {
      setPlaylist(res.playlist);
      setTracks(res.tracks);
      setNameDraft(res.playlist?.name ?? '');
      setLoading(false);
    });
  }, [id]);

  async function saveRename() {
    if (!id || !nameDraft.trim()) return;
    await renamePlaylist(id, nameDraft.trim());
    setPlaylist((p) => (p ? { ...p, name: nameDraft.trim() } : p));
    setEditingName(false);
  }

  async function handleRemove(rowId: string) {
    await removeSongFromPlaylist(rowId);
    setTracks((prev) => prev.filter((t) => t.id !== rowId));
  }

  const songs = tracks.map((t) => t.song!).filter(Boolean);

  if (loading) return <div className="text-cream-dim text-sm">Loading playlist…</div>;
  if (!playlist) return <div className="text-cream-dim text-sm">Playlist not found.</div>;

  return (
    <div className="flex flex-col gap-6">
      <Link to="/playlists" className="text-xs text-cream-dim hover:text-accent w-fit">← All playlists</Link>

      <div className="flex items-center gap-4">
        <img
          src={playlist.cover_url ?? 'https://picsum.photos/seed/playlist/300'}
          alt=""
          className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
        />
        <div className="min-w-0">
          {editingName ? (
            <div className="flex gap-2">
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveRename()}
                className="bg-ink-2 border border-line rounded-lg px-2 py-1 text-lg font-display font-semibold"
                autoFocus
              />
              <button onClick={saveRename} className="text-accent text-sm">Save</button>
            </div>
          ) : (
            <h1
              className="font-display text-2xl font-semibold truncate cursor-pointer hover:text-accent"
              onClick={() => setEditingName(true)}
              title="Click to rename"
            >
              {playlist.name}
            </h1>
          )}
          <p className="text-cream-dim text-sm mt-1">{songs.length} song{songs.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {songs.length > 0 && (
        <button
          onClick={() => playSong(songs[0], songs)}
          className="bg-accent text-ink font-semibold rounded-full px-6 py-2.5 text-sm w-fit hover:brightness-110"
        >
          ▶ Play all
        </button>
      )}

      {songs.length === 0 ? (
        <div className="text-cream-dim text-sm">No songs yet. Add some from Search or an Album page.</div>
      ) : (
        <div className="flex flex-col gap-1">
          {tracks.map((t, i) =>
            t.song ? (
              <SongRow
                key={t.id}
                song={t.song}
                index={i}
                queueContext={songs}
                rightSlot={
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(t.id);
                    }}
                    className="text-cream-dim hover:text-red-300 text-xs px-2"
                    title="Remove from playlist"
                  >
                    ✕
                  </button>
                }
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
