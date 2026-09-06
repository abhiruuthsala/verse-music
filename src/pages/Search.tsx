import { useEffect, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { searchAll } from '../services/songs';
import { SongRow } from '../components/SongRow';
import { Card } from '../components/Card';
import type { Song, Artist, Album } from '../types';

type Filter = 'all' | 'songs' | 'artists' | 'albums' | 'playlists';

export default function Search() {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 350);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    if (!debounced.trim()) {
      setSongs([]); setArtists([]); setAlbums([]); setPlaylists([]);
      return;
    }
    setLoading(true);
    searchAll(debounced.trim())
      .then((res) => {
        setSongs(res.songs);
        setArtists(res.artists);
        setAlbums(res.albums);
        setPlaylists(res.playlists);
      })
      .finally(() => setLoading(false));
  }, [debounced]);

  const hasResults = songs.length || artists.length || albums.length || playlists.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="relative max-w-xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs, artists, albums, playlists…"
          className="w-full bg-ink-2 border border-line rounded-lg pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-accent"
        />
        <svg viewBox="0 0 24 24" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-dim" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M11 4a7 7 0 105.29 12.29l4.21 4.2 1.4-1.4-4.2-4.21A7 7 0 0011 4z" />
        </svg>
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream-dim hover:text-cream">
            ✕
          </button>
        )}
      </div>

      {query.trim() && (
        <div className="flex gap-2">
          {(['all', 'songs', 'artists', 'albums', 'playlists'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs capitalize border ${
                filter === f ? 'bg-accent text-ink border-accent' : 'border-line text-cream-dim hover:text-cream'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {loading && <div className="text-cream-dim text-sm">Searching…</div>}

      {!loading && query.trim() && !hasResults && (
        <div className="text-cream-dim text-sm">No results for "{query}".</div>
      )}

      {!loading && (filter === 'all' || filter === 'songs') && songs.length > 0 && (
        <section>
          <h2 className="font-display font-semibold mb-2">Songs</h2>
          <div className="flex flex-col gap-1">
            {songs.map((s) => (
              <SongRow key={s.id} song={s} queueContext={songs} />
            ))}
          </div>
        </section>
      )}

      {!loading && (filter === 'all' || filter === 'artists') && artists.length > 0 && (
        <section>
          <h2 className="font-display font-semibold mb-2">Artists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {artists.map((a) => (
              <Card key={a.id} to={`/artist/${a.id}`} image={a.image_url} title={a.name} round />
            ))}
          </div>
        </section>
      )}

      {!loading && (filter === 'all' || filter === 'albums') && albums.length > 0 && (
        <section>
          <h2 className="font-display font-semibold mb-2">Albums</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albums.map((a) => (
              <Card key={a.id} to={`/album/${a.id}`} image={a.cover_url} title={a.title} subtitle={a.artist?.name} />
            ))}
          </div>
        </section>
      )}

      {!loading && (filter === 'all' || filter === 'playlists') && playlists.length > 0 && (
        <section>
          <h2 className="font-display font-semibold mb-2">Playlists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {playlists.map((p) => (
              <Card key={p.id} to={`/playlist/${p.id}`} image={p.cover_url} title={p.name} subtitle="Playlist" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
