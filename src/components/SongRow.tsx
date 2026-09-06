import { Song } from '../types';
import { usePlayer } from '../contexts/PlayerContext';
import { Link } from 'react-router-dom';

interface Props {
  song: Song;
  queueContext?: Song[];
  index?: number;
  rightSlot?: React.ReactNode;
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = String(s % 60).padStart(2, '0');
  return `${m}:${sec}`;
}

export function SongRow({ song, queueContext, index, rightSlot }: Props) {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const isActive = currentSong?.id === song.id;

  return (
    <div
      className={`group flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition-colors ${
        isActive ? 'bg-ink-2' : 'hover:bg-ink-2'
      }`}
      onClick={() => playSong(song, queueContext)}
    >
      {typeof index === 'number' && (
        <div className="w-5 text-xs text-cream-dim flex-shrink-0 text-center">
          {isActive && isPlaying ? '♪' : index + 1}
        </div>
      )}
      <img
        src={song.cover_url ?? 'https://picsum.photos/seed/verse/100'}
        alt=""
        className="w-11 h-11 rounded-md object-cover flex-shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className={`text-sm font-medium truncate ${isActive ? 'text-accent' : ''}`}>{song.title}</div>
        <div className="text-xs text-cream-dim truncate">
          {song.artist ? (
            <Link to={`/artist/${song.artist.id}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>
              {song.artist.name}
            </Link>
          ) : (
            'Unknown artist'
          )}
        </div>
      </div>
      {rightSlot}
      <div className="text-xs text-cream-dim w-10 text-right flex-shrink-0">{formatDuration(song.duration_seconds)}</div>
    </div>
  );
}
