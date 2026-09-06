import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserPlaylists } from '../services/playlists';
import { fetchLikedSongs } from '../services/likes';
import { fetchRecentlyPlayed } from '../services/songs';
import { Card } from '../components/Card';
import { SongRow } from '../components/SongRow';
import { Link } from 'react-router-dom';
import type { Playlist, Song } from '../types';

type Tab = 'playlists' | 'liked' | 'recent';

export default function Library() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('playlists');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [liked, setLiked] = useState<Song[]>([]);
  const [recent, setRecent] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([fetchUserPlaylists(user.id), fetchLikedSongs(user.id), fetchRecentlyPlayed(user.id, 20)]).then(
      ([pl, lk, rc]) => {
        setPlaylists(pl.playlists);
        setLiked(lk.rows.map((r) => r.song));
        setRecent(rc.songs);
        setLoading(false);
      }
    );
  }, [user]);

  if (loading) return <div className="text-cream-dim text-sm">Loading your library…</div>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold">Your Library</h1>

      <div className="flex gap-2">
        {(['playlists', 'liked', 'recent'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-full text-xs capitalize border ${
              tab === t ? 'bg-accent text-ink border-accent' : 'border-line text-cream-dim hover:text-cream'
            }`}
          >
            {t === 'recent' ? 'Recently played' : t}
          </button>
        ))}
      </div>

      {tab === 'playlists' &&
        (playlists.length === 0 ? (
          <div className="text-cream-dim text-sm">
            No playlists yet. <Link to="/playlists" className="text-accent hover:underline">Create one</Link>.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {playlists.map((p) => (
              <Card key={p.id} to={`/playlist/${p.id}`} image={p.cover_url} title={p.name} subtitle="Playlist" />
            ))}
          </div>
        ))}

      {tab === 'liked' &&
        (liked.length === 0 ? (
          <div className="text-cream-dim text-sm">No liked songs yet.</div>
        ) : (
          <div className="flex flex-col gap-1">
            {liked.map((s, i) => (
              <SongRow key={s.id} song={s} index={i} queueContext={liked} />
            ))}
          </div>
        ))}

      {tab === 'recent' &&
        (recent.length === 0 ? (
          <div className="text-cream-dim text-sm">Nothing played yet.</div>
        ) : (
          <div className="flex flex-col gap-1">
            {recent.map((s, i) => (
              <SongRow key={s.id} song={s} index={i} queueContext={recent} />
            ))}
          </div>
        ))}
    </div>
  );
}
