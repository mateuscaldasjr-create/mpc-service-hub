import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Monitor
} from 'lucide-react';

interface SidebarProps {
  role: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, onLogout }) => {
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/chamados', icon: ClipboardList, label: 'Chamados' },
    { path: '/clientes', icon: Users, label: 'Clientes' }, // ADICIONADO AQUI!
    { path: '/contratos', icon: FileText, label: 'Contratos' },
    { path: '/equipamentos', icon: Monitor, label: 'Equipamentos' },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-500 tracking-tight">MPC SERVICE HUB</h1>
        <p className="text-[10px] text-zinc-500 uppercase font-semibold mt-1">Gestão de Infraestrutura</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-500' 
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-900 space-y-1">
        <button className="flex items-center gap-3 px-3 py-2 w-full text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Configurações</span>
        </button>
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
