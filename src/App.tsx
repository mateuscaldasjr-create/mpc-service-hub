import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importação dos Componentes Base (Sidebar/Header)
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Importação das Páginas (Conforme sua estrutura no GitHub)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList';
import TicketCreate from './pages/TicketCreate';
import ClientList from './pages/ClientList';
import ContractList from './pages/ContractList';
import EquipmentList from './pages/EquipmentList';
import UserList from './pages/UserList';
import Landing from './pages/Landing';

// Componente de Layout para manter o Header e Sidebar em todas as páginas internas
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  // Nota: Aqui futuramente adicionaremos a lógica de proteção de rota com o Supabase
  return (
    <Router>
      <Routes>
        {/* Rota Pública (Landing Page e Login) */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas Internas da MPC SERVICE HUB (Protegidas pelo Layout) */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/chamados" element={<Layout><TicketList /></Layout>} />
        <Route path="/chamados/novo" element={<Layout><TicketCreate /></Layout>} />
        <Route path="/clientes" element={<Layout><ClientList /></Layout>} />
        <Route path="/contratos" element={<Layout><ContractList /></Layout>} />
        <Route path="/equipamentos" element={<Layout><EquipmentList /></Layout>} />
        <Route path="/usuarios" element={<Layout><UserList /></Layout>} />

        {/* Redirecionamento de segurança */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
