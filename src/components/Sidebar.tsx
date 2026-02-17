
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  FileText, 
  HardDrive, 
  Users, 
  Settings,
  LogOut,
  Building2
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, onLogout }) => {
  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'tecnico', 'cliente', 'fiscal'] },
    { label: 'Chamados', icon: Ticket, path: '/chamados', roles: ['admin', 'tecnico', 'cliente', 'fiscal'] },
    { label: 'Contratos', icon: FileText, path: '/contratos', roles: ['admin', 'tecnico', 'cliente', 'fiscal'] },
    { label: 'Equipamentos', icon: HardDrive, path: '/equipamentos', roles: ['admin', 'tecnico', 'cliente', 'fiscal'] },
    { label: 'Clientes', icon: Building2, path: '/clientes', roles: ['admin'] },
    { label: 'Usuários', icon: Users, path: '/usuarios', roles: ['admin'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col hidden md:flex shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-500 tracking-tight">MPC SERVICE HUB</h1>
        <p className="text-[10px] uppercase text-zinc-500 font-semibold mt-1">Gestão de Infraestrutura</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
              ${isActive 
                ? 'bg-blue-600/10 text-blue-400' 
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'}
            `}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800 space-y-2">
        <button className="flex w-full items-center px-4 py-3 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors">
          <Settings className="w-5 h-5 mr-3" />
          Configurações
        </button>
        <button 
          onClick={onLogout}
          className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
