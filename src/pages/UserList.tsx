import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Profile } from '../types';
import { UserPlus, Shield, User, Search, X, Loader2, Save } from 'lucide-react';

interface UserListProps {
  profile: Profile | null;
}

const UserList: React.FC<UserListProps> = ({ profile: adminProfile }) => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para o Modal de Edição
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, clientsRes] = await Promise.all([
        supabase.from('profiles').select('*').order('full_name'),
        supabase.from('clients').select('id, name').order('name')
      ]);
      
      if (usersRes.data) setUsers(usersRes.data);
      if (clientsRes.data) setClients(clientsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: selectedUser.role,
          client_id: selectedUser.role === 'cliente' ? selectedUser.client_id : null
        })
        .eq('id', selectedUser.id);

      if (error) throw error;
      
      setIsModalOpen(false);
      fetchData();
      alert('Permissões atualizadas com sucesso!');
    } catch (err: any) {
      alert('Erro ao atualizar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-red-500/10 text-red-400 border-red-500/20',
      tecnico: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      cliente: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
      fiscal: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[role] || styles.cliente}`}>
        {role || 'Pendente'}
      </span>
    );
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Acessos</h1>
          <p className="text-zinc-500 text-sm">Configure quem pode acessar a plataforma da MPC.</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 bg-zinc-900/50 border-b border-zinc-800">
           <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou e-mail..." 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/30">
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Usuário</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Nível de Acesso</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Empresa Vinculada</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-zinc-500">Sincronizando base de usuários...</td></tr>
              ) : filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 border border-zinc-700">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-100">{u.full_name || 'Usuário Novo'}</p>
                        <p className="text-xs text-zinc-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(u.role)}</td>
                  <td className="px-6 py-4 text-xs text-zinc-400">
                    {u.role === 'cliente' ? (clients.find(c => c.id === u.client_id)?.name || 'Nenhum vínculo') : 'Acesso Interno'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => { setSelectedUser(u); setIsModalOpen(true); }}
                      className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors"
                    >
                      Editar Acesso
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE EDIÇÃO DE USUÁRIO */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Configurar Acesso</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X /></button>
            </div>
            
            <div className="mb-6 p-4 bg-zinc-800/50 rounded-xl border border-zinc-800">
              <p className="text-sm font-bold text-white">{selectedUser.full_name}</p>
              <p className="text-xs text-zinc-500">{selectedUser.email}</p>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase">Nível de Permissão</label>
                <select 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white mt-1 outline-none focus:border-blue-500"
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value as any})}
                >
                  <option value="admin">Administrador (Mateus/Sócios)</option>
                  <option value="tecnico">Técnico de Campo</option>
                  <option value="cliente">Cliente (Visualização limitada)</option>
                  <option value="fiscal">Fiscal (Relatórios)</option>
                </select>
              </div>

              {selectedUser.role === 'cliente' && (
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase">Vincular a qual Cliente?</label>
                  <select 
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white mt-1 outline-none focus:border-blue-500"
                    value={selectedUser.client_id || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, client_id: e.target.value})}
                  >
                    <option value="">Selecione a Empresa</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <p className="text-[10px] text-zinc-500 mt-2 italic">O usuário só verá chamados e equipamentos desta empresa.</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold mt-4 flex items-center justify-center gap-2 transition-all"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
