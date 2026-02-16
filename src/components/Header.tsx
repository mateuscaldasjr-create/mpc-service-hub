
import React from 'react';
import { Search, Bell, User, MonitorPlay } from 'lucide-react';
import { Profile } from '../types';

interface HeaderProps {
  profile: Profile | null;
  isDemo?: boolean;
}

const Header: React.FC<HeaderProps> = ({ profile, isDemo }) => {
  return (
    <header className="h-16 bg-zinc-900/50 backdrop-blur border-b border-zinc-800 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="relative w-64 md:w-96 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Pesquisar chamados, contratos..." 
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-zinc-100"
          />
        </div>
        
        {isDemo && (
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full animate-pulse">
            <MonitorPlay className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Modo Demo</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l border-zinc-800 pl-4 ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-zinc-100">{profile?.full_name || 'Usuário'}</p>
            <p className="text-xs text-zinc-500 capitalize">{profile?.role}</p>
          </div>
          <div className="w-9 h-9 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
            <User className="w-5 h-5 text-zinc-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
