import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  FileText, 
  Monitor, 
  Shield, 
  LogOut,
  Settings
} from 'lucide-react';
import { Profile } from '../types';

interface SidebarProps {
  role: string;
  onLogout: () => void;
}

export default function Sidebar({ role, onLogout }: SidebarProps) {
  // Configuração de visibilidade por cargo
  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'tecnico', 'cliente', 'fiscal'] },
    { label: 'Chamados', icon: Ticket, path: '/chamados', roles: ['admin', 'tecnico', 'cliente', 'fiscal'] },
    { label: 'Clientes', icon: Users, path: '/clientes', roles: ['admin'] },
    { label: 'Equipamentos', icon: Monitor, path: '/equipamentos', roles: ['admin', 'tecnico', 'cliente'] },
    { label: 'Contratos', icon: FileText, path: '/contratos', roles: ['admin', 'cliente', 'fiscal'] },
    { label: 'Usuários', icon: Shield, path: '/usuarios', roles: ['admin'] },
  ];

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col h-full text-left">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white leading-none uppercase tracking-tighter">MPC Service Hub</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Gestão de Infraestrutura</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems
            .filter(item => item.roles.includes(role))
            .map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20' 
                      : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-1 border-t border-zinc-900">
        <NavLink
          to="/configuracoes"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all"
        >
          <Settings className="w-5 h-5" />
          Configurações
        </NavLink>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sair do Sistema
        </button>
      </div>
    </div>
  );
}
