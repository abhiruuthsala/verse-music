import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, username);
    setLoading(false);
    if (error) setError(error);
    else setDone(true);
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <h1 className="font-display text-lg font-semibold mb-2">Check your email</h1>
        <p className="text-sm text-cream-dim mb-6">
          We sent a confirmation link to <span className="text-cream">{email}</span>. Confirm it, then come back and sign in.
        </p>
        <button onClick={() => navigate('/login')} className="text-accent text-sm hover:underline">
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-xl font-semibold mb-1">Create your account</h1>
      <p className="text-sm text-cream-dim mb-6">Start building playlists and saving songs.</p>
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          required
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-ink-3 border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-ink-3 border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
        />
        <input
          type="password"
          required
          placeholder="Password (min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-ink-3 border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
        />
        <button
          disabled={loading}
          className="bg-accent text-ink font-semibold rounded-lg py-2.5 text-sm mt-2 hover:brightness-110 disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="text-sm text-cream-dim text-center mt-6">
        Already have an account? <Link to="/login" className="text-accent hover:underline">Sign in</Link>
      </p>
    </>
  );
}
