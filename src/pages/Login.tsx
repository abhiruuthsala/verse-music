import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) setError(error);
    else navigate('/home');
  }

  return (
    <>
      <h1 className="font-display text-xl font-semibold mb-1">Welcome back</h1>
      <p className="text-sm text-cream-dim mb-6">Sign in to keep listening.</p>
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-ink-3 border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
        />
        <Link to="/forgot-password" className="text-xs text-cream-dim hover:text-accent self-end -mt-1">
          Forgot password?
        </Link>
        <button
          disabled={loading}
          className="bg-accent text-ink font-semibold rounded-lg py-2.5 text-sm mt-2 hover:brightness-110 disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="text-sm text-cream-dim text-center mt-6">
        Don't have an account? <Link to="/signup" className="text-accent hover:underline">Create one</Link>
      </p>
    </>
  );
}
