import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-ink-2 border border-line rounded-xl2 p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-ink font-display font-bold text-sm">VM</div>
          <span className="font-display font-bold text-lg">Verse Music</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
