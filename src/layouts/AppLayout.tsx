import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { MobileNav } from '../components/MobileNav';
import { PlayerBar } from '../components/PlayerBar';
import { usePlayer } from '../contexts/PlayerContext';

export function AppLayout() {
  const { currentSong } = usePlayer();
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main
          className="flex-1 overflow-y-auto px-4 md:px-8 py-6"
          style={{ paddingBottom: currentSong ? '140px' : '80px' }}
        >
          <Outlet />
        </main>
      </div>
      <PlayerBar />
      <MobileNav />
    </div>
  );
}
