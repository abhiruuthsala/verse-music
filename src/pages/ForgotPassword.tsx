import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPassword() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await sendPasswordReset(email);
    setLoading(false);
    if (error) setError(error);
    else setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center py-6">
        <h1 className="font-display text-lg font-semibold mb-2">Check your email</h1>
        <p className="text-sm text-cream-dim mb-6">We sent a password reset link to <span className="text-cream">{email}</span>.</p>
        <Link to="/login" className="text-accent text-sm hover:underline">Back to sign in</Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-xl font-semibold mb-1">Reset your password</h1>
      <p className="text-sm text-cream-dim mb-6">We'll email you a link to set a new one.</p>
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
        <button disabled={loading} className="bg-accent text-ink font-semibold rounded-lg py-2.5 text-sm mt-2 hover:brightness-110 disabled:opacity-60">
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
      <p className="text-sm text-cream-dim text-center mt-6">
        <Link to="/login" className="text-accent hover:underline">Back to sign in</Link>
      </p>
    </>
  );
}
