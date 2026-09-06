import { NavLink } from 'react-router-dom';

const links = [
  { to: '/home', label: 'Home', icon: 'M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z' },
  { to: '/search', label: 'Search', icon: 'M11 4a7 7 0 105.29 12.29l4.21 4.2 1.4-1.4-4.2-4.21A7 7 0 0011 4zm0 2a5 5 0 110 10 5 5 0 010-10z' },
  { to: '/library', label: 'Your Library', icon: 'M4 4h4v16H4zM10 4h4v16h-4zM16 4h4v16h-4z' },
  { to: '/liked', label: 'Liked Songs', icon: 'M12 21s-7.5-4.6-10-9.1C.5 8.6 2 5 5.6 5 8 5 9.5 6.3 12 9c2.5-2.7 4-4 6.4-4C22 5 23.5 8.6 22 11.9 19.5 16.4 12 21 12 21z' },
  { to: '/playlists', label: 'Playlists', icon: 'M3 6h13M3 12h13M3 18h7M18 9v10m0 0l-3-3m3 3l3-3' }
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-line px-4 py-6 shrink-0">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-ink font-display font-bold text-sm">VM</div>
        <span className="font-display font-bold text-lg">Verse Music</span>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-ink-2 text-accent' : 'text-cream-dim hover:text-cream hover:bg-ink-2'
              }`
            }
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d={l.icon} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
