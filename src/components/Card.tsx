import { Link } from 'react-router-dom';

interface Props {
  to: string;
  image: string | null;
  title: string;
  subtitle?: string;
  round?: boolean;
}

export function Card({ to, image, title, subtitle, round }: Props) {
  return (
    <Link to={to} className="group block bg-ink-2/60 hover:bg-ink-3 transition-colors rounded-xl2 p-3">
      <img
        src={image ?? 'https://picsum.photos/seed/verse/300'}
        alt=""
        className={`w-full aspect-square object-cover mb-3 ${round ? 'rounded-full' : 'rounded-lg'}`}
      />
      <div className="text-sm font-medium truncate group-hover:text-accent transition-colors">{title}</div>
      {subtitle && <div className="text-xs text-cream-dim truncate mt-0.5">{subtitle}</div>}
    </Link>
  );
}
