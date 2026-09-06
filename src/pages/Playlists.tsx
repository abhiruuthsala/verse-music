import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserPlaylists, createPlaylist, deletePlaylist } from '../services/playlists';
import { Link } from 'react-router-dom';
import type { Playlist } from '../types';

export default function Playlists() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchUserPlaylists(user.id).then((res) => {
      setPlaylists(res.playlists);
      setLoading(false);
    });
  }, [user]);

  async function handleCreate() {
    if (!user || !newName.trim()) return;
    const { playlist } = await createPlaylist(user.id, newName.trim());
    if (playlist) setPlaylists((prev) => [playlist, ...prev]);
    setNewName('');
  }

  async function handleDelete(id: string) {
    await deletePlaylist(id);
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) return <div className="text-cream-dim text-sm">Loading playlists…</div>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold">Your Playlists</h1>

      <div className="flex gap-2 max-w-md">
        <input
          type="text"
          placeholder="New playlist name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          className="flex-1 bg-ink-2 border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
        />
        <button onClick={handleCreate} className="bg-accent text-ink text-sm font-semibold rounded-lg px-4 hover:brightness-110">
          Create
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="text-cream-dim text-sm">No playlists yet — create one above.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((p) => (
            <div key={p.id} className="group relative bg-ink-2/60 hover:bg-ink-3 transition-colors rounded-xl2 p-3">
              <Link to={`/playlist/${p.id}`}>
                <img
                  src={p.cover_url ?? 'https://picsum.photos/seed/playlist/300'}
                  alt=""
                  className="w-full aspect-square object-cover rounded-lg mb-3"
                />
                <div className="text-sm font-medium truncate group-hover:text-accent">{p.name}</div>
                <div className="text-xs text-cream-dim mt-0.5">{p.is_public ? 'Public' : 'Private'}</div>
              </Link>
              <button
                onClick={() => handleDelete(p.id)}
                className="absolute top-4 right-4 text-cream-dim hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-ink/80 rounded-full w-6 h-6 flex items-center justify-center"
                title="Delete playlist"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
