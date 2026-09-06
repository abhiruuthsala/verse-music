import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';
import type { Song } from '../types';

interface PlayerContextValue {
  queue: Song[];
  currentIndex: number;
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
  playSong: (song: Song, queueContext?: Song[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  addToQueue: (song: Song) => void;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

// A single <audio> element lives here for the whole app lifetime, so
// playback survives navigating between pages/routes.
export function PlayerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastLoggedSongId = useRef<string | null>(null);

  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off');

  if (!audioRef.current) {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
  }

  const currentSong = currentIndex >= 0 ? queue[currentIndex] ?? null : null;

  useEffect(() => {
    const audio = audioRef.current!;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded = () => handleEnded();
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, queue, repeat, shuffle]);

  useEffect(() => {
    if (!currentSong) return;
    const audio = audioRef.current!;
    if (audio.src !== currentSong.audio_url) {
      audio.src = currentSong.audio_url;
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      logRecentlyPlayed(currentSong.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong]);

  async function logRecentlyPlayed(songId: string) {
    if (!user) return;
    if (lastLoggedSongId.current === songId) return; // avoid duplicate spam on quick re-triggers
    lastLoggedSongId.current = songId;
    await supabase.from('recently_played').insert({ user_id: user.id, song_id: songId });
  }

  function handleEnded() {
    if (repeat === 'one') {
      audioRef.current!.currentTime = 0;
      audioRef.current!.play();
      return;
    }
    playNext();
  }

  function playSong(song: Song, queueContext?: Song[]) {
    if (queueContext && queueContext.length) {
      setQueue(queueContext);
      setCurrentIndex(queueContext.findIndex((s) => s.id === song.id));
    } else {
      setQueue((prev) => {
        const exists = prev.find((s) => s.id === song.id);
        if (exists) return prev;
        return [...prev, song];
      });
      setCurrentIndex((prevIndex) => {
        const idx = queue.findIndex((s) => s.id === song.id);
        return idx >= 0 ? idx : queue.length;
      });
    }
  }

  function addToQueue(song: Song) {
    setQueue((prev) => [...prev, song]);
  }

  function togglePlay() {
    const audio = audioRef.current!;
    if (!currentSong) return;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  function nextIndex(): number {
    if (queue.length === 0) return -1;
    if (shuffle) return Math.floor(Math.random() * queue.length);
    if (currentIndex < queue.length - 1) return currentIndex + 1;
    return repeat === 'all' ? 0 : -1;
  }

  function playNext() {
    const idx = nextIndex();
    if (idx === -1) {
      setIsPlaying(false);
      return;
    }
    setCurrentIndex(idx);
  }

  function playPrev() {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }

  function seekTo(seconds: number) {
    if (audioRef.current) audioRef.current.currentTime = seconds;
  }

  function setVolume(v: number) {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  }

  function toggleShuffle() {
    setShuffle((s) => !s);
  }

  function cycleRepeat() {
    setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'));
  }

  return (
    <PlayerContext.Provider
      value={{
        queue,
        currentIndex,
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        shuffle,
        repeat,
        playSong,
        togglePlay,
        playNext,
        playPrev,
        seekTo,
        setVolume,
        toggleShuffle,
        cycleRepeat,
        addToQueue
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
}
