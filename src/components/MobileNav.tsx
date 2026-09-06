import { NavLink } from 'react-router-dom';

const links = [
  { to: '/home', label: 'Home' },
  { to: '/search', label: 'Search' },
  { to: '/library', label: 'Library' }
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-ink-2 border-t border-line flex z-30">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          className={({ isActive }) =>
            `flex-1 flex items-center justify-center text-xs ${isActive ? 'text-accent' : 'text-cream-dim'}`
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
  );
}
