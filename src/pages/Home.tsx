import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePlayer } from '../contexts/PlayerContext';
import { fetchHomeSections, fetchRecentlyPlayed } from '../services/songs';
import { Card } from '../components/Card';
import { SongRow } from '../components/SongRow';
import type { Song, Album, Artist } from '../types';

export default function Home() {
  const { user, profile } = useAuth();
  const { playSong } = usePlayer();
  const [popular, setPopular] = useState<Song[]>([]);
  const [newReleases, setNewReleases] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [recent, setRecent] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const sections = await fetchHomeSections();
        setPopular(sections.popular);
        setNewReleases(sections.newReleases);
        setArtists(sections.artists);
        if (user) {
          const { songs } = await fetchRecentlyPlayed(user.id, 6);
          setRecent(songs);
        }
      } catch (e: any) {
        setError('Could not load your home page right now.');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) return <div className="text-cream-dim text-sm">Loading your music…</div>;
  if (error) return <div className="text-red-300 text-sm">{error}</div>;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-2xl font-semibold">
          Welcome{profile?.display_name ? `, ${profile.display_name}` : ''}
        </h1>
        <p className="text-cream-dim text-sm mt-1">Here's what's new and what you've been playing.</p>
      </div>

      {recent.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold mb-3">Recently played</h2>
          <div className="flex flex-col gap-1">
            {recent.map((s) => (
              <SongRow key={s.id} song={s} queueContext={recent} />
            ))}
          </div>
        </section>
      )}

      {popular.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold mb-3">Popular right now</h2>
          <div className="flex flex-col gap-1">
            {popular.map((s) => (
              <SongRow key={s.id} song={s} queueContext={popular} />
            ))}
          </div>
        </section>
      )}

      {newReleases.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold mb-3">New releases</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {newReleases.map((a) => (
              <Card key={a.id} to={`/album/${a.id}`} image={a.cover_url} title={a.title} subtitle={a.artist?.name} />
            ))}
          </div>
        </section>
      )}

      {artists.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold mb-3">Popular artists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {artists.map((a) => (
              <Card key={a.id} to={`/artist/${a.id}`} image={a.image_url} title={a.name} round />
            ))}
          </div>
        </section>
      )}

      {popular.length === 0 && newReleases.length === 0 && (
        <div className="text-cream-dim text-sm">
          No music yet — run <code className="text-cream">supabase_seed.sql</code> in your Supabase SQL editor to add demo tracks.
        </div>
      )}
    </div>
  );
}
