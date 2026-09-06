import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { user, updatePassword, signOut } = useAuth();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const { error } = await updatePassword(password);
    if (error) setError(error);
    else {
      setMessage('Password updated.');
      setPassword('');
    }
  }

  return (
    <div className="max-w-md flex flex-col gap-8">
      <h1 className="font-display text-2xl font-semibold">Settings</h1>

      <section>
        <h2 className="font-display font-semibold mb-2">Account</h2>
        <p className="text-sm text-cream-dim">Signed in as {user?.email}</p>
      </section>

      <section>
        <h2 className="font-display font-semibold mb-2">Change password</h2>
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-3 py-2 mb-3">{error}</div>}
        {message && <div className="bg-accent-soft border border-accent/30 text-accent text-sm rounded-lg px-3 py-2 mb-3">{message}</div>}
        <form onSubmit={handlePasswordChange} className="flex gap-2">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 bg-ink-2 border border-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
          />
          <button className="bg-accent text-ink text-sm font-semibold rounded-lg px-4 hover:brightness-110">Update</button>
        </form>
      </section>

      <section>
        <button onClick={signOut} className="text-sm text-red-300 hover:text-red-200 border border-red-500/30 rounded-lg px-4 py-2 w-fit">
          Log out
        </button>
      </section>
    </div>
  );
}
