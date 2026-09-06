import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function Profile() {
  const { profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMessage(null);
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName, avatar_url: avatarUrl || null, updated_at: new Date().toISOString() })
      .eq('id', profile.id);
    setSaving(false);
    if (!error) {
      setMessage('Profile updated.');
      refreshProfile();
    }
  }

  if (!profile) return <div className="text-cream-dim text-sm">Loading profile…</div>;

  return (
    <div className="max-w-md flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold">Profile</h1>

      <div className="flex items-center gap-4">
        <img
          src={avatarUrl || 'https://picsum.photos/seed/user/200'}
          alt=""
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <div className="font-medium">{profile.username}</div>
          <div className="text-xs text-cream-dim">@{profile.username}</div>
        </div>
      </div>

      {message && <div className="bg-accent-soft border border-accent/30 text-accent text-sm rounded-lg px-3 py-2">{message}</div>}

      <form onSubmit={handleSave} className="flex flex-col gap-3">
        <label className="text-xs text-cream-dim">Display name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="bg-ink-2 border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
        />
        <label className="text-xs text-cream-dim">Avatar image URL</label>
        <input
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://…"
          className="bg-ink-2 border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
        />
        <button disabled={saving} className="bg-accent text-ink font-semibold rounded-lg py-2.5 text-sm mt-2 hover:brightness-110 disabled:opacity-60">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
