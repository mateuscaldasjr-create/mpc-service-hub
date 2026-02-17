import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Profile } from '../types';
import { UserPlus, Search, X, Loader2, Save, User, Shield, Mail, Lock } from 'lucide-react';

export default function UserList() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modais
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form Novo Usuário
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'cliente' as any,
    client_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [uRes, cRes] = await Promise.all([
        supabase.from('profiles').select('*').order('full_name'),
        supabase.from('clients').select('id, name').order('name')
      ]);
      setUsers(uRes.data || []);
      setClients(cRes.data || []);
    } finally {
      setLoading(false);
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: { data: { full_name: newUser.full_name } }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            role: newUser.role,
            client_id: newUser.role === 'cliente' ? newUser.client_id : null
          })
          .eq('id', authData.user.id);
        
        if (profileError) throw profileError;
      }

      alert('Usuário criado com sucesso!');
      setIsAddModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert('Erro: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: selectedUser.role,
          client_id: selectedUser.role === 'cliente' ? selectedUser.client_id : null
        })
        .eq('id', selectedUser.id);

      if (error) throw error;
      setIsEditModalOpen(false);
      fetchData();
      alert('Acesso atualizado!');
    } catch (err: any) {
      alert('Erro ao atualizar: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Gestão de Acessos</h1>
          <p className="text-zinc-500 text-sm font-medium">Controle de permissões da MPC Service Hub.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-black text-sm transition-all"
        >
          <UserPlus className="w-4 h-4" /> Novo Usuário
        </button>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" placeholder="Buscar por nome ou e-mail..." 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-800/50">
                <th className="px-6 py-4 text-left">Usuário</th>
                <th className="px-6 py-4 text-left">Nível</th>
                <th className="px-6 py-4 text-left">Empresa</th>
                <th className="px-6 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                <tr><td colSpan={4} className="py-20 text-center text-zinc-500 uppercase text-xs animate-pulse">Carregando...</td></tr>
              ) : filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-zinc-800/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                        <User className="w-5 h-5 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{u.full_name || 'Usuário'}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                      u.role === 'admin' ? 'border-blue-600/30 text-blue-500 bg-blue-500/5' : 'border-zinc-700 text-zinc-500'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-bold text-zinc-400">
                    {u.role === 'cliente' ? (clients.find(c => c.id === u.client_id)?.name || 'Sem vínculo') : 'MPC Interno'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setSelectedUser(u); setIsEditModalOpen(true); }} className="text-[10px] font-black text-blue-500 hover:text-white uppercase transition-colors">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL NOVO USUÁRIO */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-md p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Novo Acesso</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-600 hover:text-white"><X /></button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nome Completo</label>
                <input required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-blue-500" onChange={e => setNewUser({...newUser, full_name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">E-mail</label>
                <input type="email" required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-blue-500" onChange={e => setNewUser({...newUser, email: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Senha</label>
                <input type="password" required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-blue-500" onChange={e => setNewUser({...newUser, password: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Cargo</label>
                  <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white outline-none focus:border-blue-500" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as any})}>
                    <option value="cliente">Cliente</option><option value="tecnico">Técnico</option><option value="admin">Admin</option>
                  </select>
                </div>
                {newUser.role === 'cliente' && (
                  <div>
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Empresa</label>
                    <select required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white" onChange={e => setNewUser({...newUser, client_id: e.target.value})}>
                      <option value="">Vincular...</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <button type="submit" disabled={actionLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-black uppercase text-xs tracking-widest mt-4">
                {actionLoading ? 'Criando...' : 'Criar Usuário'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-md p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Editar Acesso</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-600 hover:text-white"><X /></button>
            </div>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                <p className="text-sm font-bold text-white">{selectedUser.full_name}</p>
                <p className="text-[10px] text-zinc-500 font-mono">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Cargo</label>
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white" value={selectedUser.role} onChange={e => setSelectedUser({...selectedUser, role: e.target.value as any})}>
                  <option value="admin">Admin</option><option value="tecnico">Técnico</option><option value="cliente">Cliente</option>
                </select>
              </div>
              {selectedUser.role === 'cliente' && (
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Empresa</label>
                  <select required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white" value={selectedUser.client_id || ''} onChange={e => setSelectedUser({...selectedUser, client_id: e.target.value})}>
                    <option value="">Vincular...</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}
              <button type="submit" disabled={actionLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-black uppercase text-xs tracking-widest">
                {actionLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
