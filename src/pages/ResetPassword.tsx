import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) setError(error);
    else navigate('/home');
  }

  return (
    <>
      <h1 className="font-display text-xl font-semibold mb-1">Set a new password</h1>
      <p className="text-sm text-cream-dim mb-6">Choose a new password for your account.</p>
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="password"
          required
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-ink-3 border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
        />
        <button disabled={loading} className="bg-accent text-ink font-semibold rounded-lg py-2.5 text-sm mt-2 hover:brightness-110 disabled:opacity-60">
          {loading ? 'Saving…' : 'Save new password'}
        </button>
      </form>
    </>
  );
}
