// Dentro do componente Sidebar, filtre os links conforme o cargo
const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'tecnico', 'cliente', 'fiscal'] },
  { label: 'Chamados', icon: Ticket, path: '/chamados', roles: ['admin', 'tecnico', 'cliente', 'fiscal'] },
  { label: 'Clientes', icon: Users, path: '/clientes', roles: ['admin'] },
  { label: 'Equipamentos', icon: Monitor, path: '/equipamentos', roles: ['admin', 'tecnico', 'cliente'] },
  { label: 'Contratos', icon: FileText, path: '/contratos', roles: ['admin', 'cliente', 'fiscal'] },
  { label: 'Usuários', icon: Shield, path: '/usuarios', roles: ['admin'] },
];

// No seu .map() de renderização, adicione:
{menuItems
  .filter(item => item.roles.includes(profile?.role))
  .map((item) => (
    <NavLink key={item.path} to={item.path} ... />
  ))}
