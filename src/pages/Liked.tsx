import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchLikedSongs, unlikeSong } from '../services/likes';
import { SongRow } from '../components/SongRow';
import { usePlayer } from '../contexts/PlayerContext';
import type { Song } from '../types';

export default function Liked() {
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const [rows, setRows] = useState<{ id: string; song: Song }[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'title'>('recent');

  useEffect(() => {
    if (!user) return;
    fetchLikedSongs(user.id).then((res) => {
      setRows(res.rows);
      setLoading(false);
    });
  }, [user]);

  const songs = rows.map((r) => r.song);
  const sorted = sortBy === 'title' ? [...songs].sort((a, b) => a.title.localeCompare(b.title)) : songs;

  async function handleUnlike(songId: string) {
    if (!user) return;
    await unlikeSong(user.id, songId);
    setRows((prev) => prev.filter((r) => r.song.id !== songId));
  }

  if (loading) return <div className="text-cream-dim text-sm">Loading liked songs…</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Liked Songs</h1>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'recent' | 'title')}
          className="bg-ink-2 border border-line rounded-lg text-xs px-2 py-1.5 focus:outline-none"
        >
          <option value="recent">Recently liked</option>
          <option value="title">Title A–Z</option>
        </select>
      </div>

      {sorted.length === 0 ? (
        <div className="text-cream-dim text-sm">Songs you like will show up here.</div>
      ) : (
        <div className="flex flex-col gap-1">
          {sorted.map((s, i) => (
            <SongRow
              key={s.id}
              song={s}
              index={i}
              queueContext={sorted}
              rightSlot={
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnlike(s.id);
                  }}
                  className="text-cream-dim hover:text-red-300 text-xs px-2"
                  title="Remove from Liked Songs"
                >
                  ✕
                </button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
