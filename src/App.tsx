
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase';
import { Profile, UserRole } from './types';

// Layouts & Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList';
import TicketDetail from './pages/TicketDetail';
import TicketCreate from './pages/TicketCreate';
import ContractList from './pages/ContractList';
import EquipmentList from './pages/EquipmentList';
import ClientList from './pages/ClientList';
import UserList from './pages/UserList';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        if (!isDemo) setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isDemo]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    setLoading(true);
    setIsDemo(true);
    const mockProfile: Profile = {
      id: 'demo-user-id',
      email: `${role}@mpc.com.br`,
      full_name: `Usuário ${role.charAt(0).toUpperCase() + role.slice(1)} (DEMO)`,
      role: role,
      created_at: new Date().toISOString(),
      client_id: role === 'cliente' ? 'demo-client-id' : undefined
    };
    
    setSession({ user: { id: 'demo-user-id' } });
    setProfile(mockProfile);
    setLoading(false);
  };

  const handleLogout = async () => {
    if (isDemo) {
      setIsDemo(false);
      setSession(null);
      setProfile(null);
    } else {
      await supabase.auth.signOut();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!session && !isDemo) return <Navigate to="/login" replace />;
    
    return (
      <div className="flex h-screen bg-zinc-950 overflow-hidden text-zinc-200">
        <Sidebar role={profile?.role || 'cliente'} onLogout={handleLogout} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header profile={profile} isDemo={isDemo} />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    );
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route 
          path="/login" 
          element={session ? <Navigate to="/dashboard" replace /> : <Login onDemoLogin={handleDemoLogin} />} 
        />

        <Route path="/dashboard" element={<ProtectedLayout><Dashboard profile={profile} /></ProtectedLayout>} />
        <Route path="/chamados" element={<ProtectedLayout><TicketList profile={profile} /></ProtectedLayout>} />
        <Route path="/chamados/novo" element={<ProtectedLayout><TicketCreate profile={profile} /></ProtectedLayout>} />
        <Route path="/chamados/:id" element={<ProtectedLayout><TicketDetail profile={profile} /></ProtectedLayout>} />
        <Route path="/contratos" element={<ProtectedLayout><ContractList profile={profile} /></ProtectedLayout>} />
        <Route path="/equipamentos" element={<ProtectedLayout><EquipmentList profile={profile} /></ProtectedLayout>} />
        <Route path="/clientes" element={<ProtectedLayout><ClientList profile={profile} /></ProtectedLayout>} />
        <Route path="/usuarios" element={<ProtectedLayout><UserList profile={profile} /></ProtectedLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
