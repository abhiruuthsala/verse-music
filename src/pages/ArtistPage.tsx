import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArtist, isFollowingArtist, followArtist, unfollowArtist } from '../services/songs';
import { useAuth } from '../contexts/AuthContext';
import { SongRow } from '../components/SongRow';
import { Card } from '../components/Card';
import type { Artist, Song, Album } from '../types';

export default function ArtistPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchArtist(id).then((res) => {
      setArtist(res.artist);
      setSongs(res.songs);
      setAlbums(res.albums);
      setLoading(false);
    });
    if (user) isFollowingArtist(user.id, id).then(setFollowing);
  }, [id, user]);

  async function toggleFollow() {
    if (!user || !id) return;
    if (following) {
      await unfollowArtist(user.id, id);
      setFollowing(false);
    } else {
      await followArtist(user.id, id);
      setFollowing(true);
    }
  }

  if (loading) return <div className="text-cream-dim text-sm">Loading artist…</div>;
  if (!artist) return <div className="text-cream-dim text-sm">Artist not found.</div>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-6">
        <img src={artist.image_url ?? 'https://picsum.photos/seed/artist/300'} alt="" className="w-32 h-32 rounded-full object-cover flex-shrink-0" />
        <div>
          <h1 className="font-display text-3xl font-semibold">{artist.name}</h1>
          {artist.bio && <p className="text-cream-dim text-sm mt-2 max-w-lg">{artist.bio}</p>}
          <button
            onClick={toggleFollow}
            className={`mt-4 text-sm font-semibold rounded-full px-5 py-2 border ${
              following ? 'border-accent text-accent' : 'border-line text-cream hover:border-accent hover:text-accent'
            }`}
          >
            {following ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>

      {songs.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold mb-3">Popular</h2>
          <div className="flex flex-col gap-1">
            {songs.slice(0, 10).map((s, i) => (
              <SongRow key={s.id} song={s} index={i} queueContext={songs} />
            ))}
          </div>
        </section>
      )}

      {albums.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold mb-3">Albums</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albums.map((a) => (
              <Card key={a.id} to={`/album/${a.id}`} image={a.cover_url} title={a.title} subtitle={artist.name} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
