import { usePlayer } from '../contexts/PlayerContext';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { isSongLiked, likeSong, unlikeSong } from '../services/likes';

function formatTime(s: number) {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = String(Math.floor(s % 60)).padStart(2, '0');
  return `${m}:${sec}`;
}

export function PlayerBar() {
  const { currentSong, isPlaying, currentTime, duration, volume, shuffle, repeat, togglePlay, playNext, playPrev, seekTo, setVolume, toggleShuffle, cycleRepeat } = usePlayer();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && currentSong) {
      isSongLiked(user.id, currentSong.id).then(setLiked);
    }
  }, [user, currentSong]);

  if (!currentSong) return null;

  async function toggleLike() {
    if (!user || !currentSong) return;
    if (liked) {
      await unlikeSong(user.id, currentSong.id);
      setLiked(false);
    } else {
      await likeSong(user.id, currentSong.id);
      setLiked(true);
    }
  }

  return (
    <div className="fixed left-0 right-0 bottom-14 md:bottom-0 h-20 bg-ink-2 border-t border-line flex items-center gap-4 px-4 md:px-6 z-40">
      <img
        src={currentSong.cover_url ?? 'https://picsum.photos/seed/verse/100'}
        alt=""
        className="w-12 h-12 rounded-md object-cover flex-shrink-0"
      />
      <div className="w-32 md:w-48 flex-shrink-0 min-w-0">
        <div className="text-sm font-medium truncate">{currentSong.title}</div>
        <div className="text-xs text-cream-dim truncate">{currentSong.artist?.name ?? 'Unknown artist'}</div>
      </div>

      <button onClick={toggleLike} className="hidden sm:flex text-cream-dim hover:text-accent flex-shrink-0" title="Like">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
          <path d="M12 21s-7.5-4.6-10-9.1C.5 8.6 2 5 5.6 5 8 5 9.5 6.3 12 9c2.5-2.7 4-4 6.4-4C22 5 23.5 8.6 22 11.9 19.5 16.4 12 21 12 21z" className={liked ? 'text-accent' : ''} />
        </svg>
      </button>

      <div className="hidden md:flex items-center gap-4 flex-shrink-0">
        <button onClick={toggleShuffle} className={`text-cream-dim hover:text-accent ${shuffle ? 'text-accent' : ''}`} title="Shuffle">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 6h4l10 12h2M4 18h4l3.5-4.2M15 6h5v5M20 6l-5.5 6.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button onClick={playPrev} className="text-cream hover:text-accent" title="Previous">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
        </button>
        <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-accent text-ink flex items-center justify-center" title="Play/Pause">
          {isPlaying ? (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
        <button onClick={playNext} className="text-cream hover:text-accent" title="Next">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M16 6h2v12h-2zM6 6v12l8.5-6z" /></svg>
        </button>
        <button onClick={cycleRepeat} className={`text-cream-dim hover:text-accent ${repeat !== 'off' ? 'text-accent' : ''}`} title="Repeat">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 2l4 4-4 4M3 12v-2a4 4 0 014-4h14M7 22l-4-4 4-4M21 12v2a4 4 0 01-4 4H3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          {repeat === 'one' && <span className="absolute text-[8px] -mt-3 ml-2">1</span>}
        </button>
      </div>

      {/* mobile play/pause only */}
      <button onClick={togglePlay} className="md:hidden w-9 h-9 rounded-full bg-accent text-ink flex items-center justify-center flex-shrink-0 ml-auto" title="Play/Pause">
        {isPlaying ? (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        )}
      </button>

      <div className="hidden md:flex flex-1 items-center gap-2 min-w-0">
        <span className="text-xs text-cream-dim w-9 flex-shrink-0">{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={(e) => seekTo(Number(e.target.value))}
          className="flex-1 accent-accent h-1"
        />
        <span className="text-xs text-cream-dim w-9 flex-shrink-0 text-right">{formatTime(duration)}</span>
      </div>

      <div className="hidden lg:flex items-center gap-2 w-28 flex-shrink-0">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-cream-dim flex-shrink-0" fill="currentColor"><path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2A4.5 4.5 0 0015 8.5v7a4.5 4.5 0 001.5-3.5z" /></svg>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 accent-accent h-1"
        />
      </div>
    </div>
  );
}
