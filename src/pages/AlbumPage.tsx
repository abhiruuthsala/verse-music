import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAlbum } from '../services/songs';
import { usePlayer } from '../contexts/PlayerContext';
import { SongRow } from '../components/SongRow';
import type { Album, Song } from '../types';

export default function AlbumPage() {
  const { id } = useParams<{ id: string }>();
  const { playSong } = usePlayer();
  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchAlbum(id).then((res) => {
      setAlbum(res.album);
      setSongs(res.songs);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="text-cream-dim text-sm">Loading album…</div>;
  if (!album) return <div className="text-cream-dim text-sm">Album not found.</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-6">
        <img src={album.cover_url ?? 'https://picsum.photos/seed/album/300'} alt="" className="w-32 h-32 rounded-lg object-cover flex-shrink-0" />
        <div>
          <h1 className="font-display text-3xl font-semibold">{album.title}</h1>
          {album.artist && (
            <Link to={`/artist/${album.artist.id}`} className="text-cream-dim text-sm hover:text-accent">
              {album.artist.name}
            </Link>
          )}
          {album.release_date && <p className="text-cream-dim text-xs mt-1">{new Date(album.release_date).getFullYear()}</p>}
        </div>
      </div>

      {songs.length > 0 && (
        <button
          onClick={() => playSong(songs[0], songs)}
          className="bg-accent text-ink font-semibold rounded-full px-6 py-2.5 text-sm w-fit hover:brightness-110"
        >
          ▶ Play album
        </button>
      )}

      <div className="flex flex-col gap-1">
        {songs.map((s, i) => (
          <SongRow key={s.id} song={s} index={i} queueContext={songs} />
        ))}
      </div>
    </div>
  );
}
