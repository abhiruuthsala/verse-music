import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) {
    return <div className="flex items-center justify-center h-screen text-cream-dim">Loading…</div>;
  }
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
