import { ShieldAlert, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function Header({ isDarkMode, toggleDarkMode }: HeaderProps) {
  return (
    <header className="bg-danger text-black px-6 py-3 flex justify-between items-center border-b-2 border-black z-10">
      <div className="flex items-center gap-4">
        <ShieldAlert size={28} strokeWidth={3} />
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none">
          Civilian Defense Alert: Szczecin
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden sm:block bg-black text-white px-3 py-1 text-[11px] font-black tracking-widest rounded-sm">
          OSM ENGINE ACTIVE
        </div>
        <button 
          onClick={toggleDarkMode}
          className="p-1.5 border-2 border-black hover:bg-black hover:text-danger transition-all"
          title={isDarkMode ? 'Tryb Dzienny' : 'Tryb Nocny'}
        >
          {isDarkMode ? <Sun size={18} strokeWidth={3} /> : <Moon size={18} strokeWidth={3} />}
        </button>
      </div>
    </header>
  );
}
