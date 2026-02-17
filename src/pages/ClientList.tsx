import React, { useState, useEffect } from 'react';
import { Plus, Search, Building2, Mail, Phone, MapPin, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../supabase';

export default function ClientList() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('clients').insert([formData]);
      if (error) throw error;
      
      setShowModal(false);
      setFormData({ name: '', document: '', email: '', phone: '', address: '' });
      fetchClients(); // Atualiza a lista
    } catch (err) {
      alert('Erro ao salvar o cliente. Verifique o banco de dados.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Carteira de Clientes</h1>
          <p className="text-zinc-400 text-sm">Gerencie as empresas e contratos da MPC.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all"
        >
          <Plus className="w-5 h-5" /> Novo Cliente
        </button>
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-950 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Razão Social / Nome</th>
                  <th className="px-6 py-4 font-semibold">Documento</th>
                  <th className="px-6 py-4 font-semibold">Contato</th>
                  <th className="px-6 py-4 font-semibold">Localização</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-zinc-500">Nenhum cliente cadastrado.</td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-white">{client.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 font-mono text-sm">{client.document}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-zinc-300">{client.email}</div>
                        <div className="text-xs text-zinc-500">{client.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {client.address}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Cadastro */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white">Adicionar Novo Cliente</h2>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Nome / Razão Social *</label>
                  <input required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-all" 
                    placeholder="Ex: Empresa de Manutenção LTDA"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">CNPJ / CPF</label>
                    <input className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none" 
                      placeholder="00.000.000/0001-00"
                      value={formData.document} onChange={e => setFormData({...formData, document: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Telefone</label>
                    <input className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none" 
                      placeholder="(71) 99999-9999"
                      value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">E-mail de Contato</label>
                  <input type="email" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none" 
                    placeholder="contato@empresa.com"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Endereço Completo</label>
                  <textarea className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none h-20 resize-none" 
                    placeholder="Rua, Número, Bairro, Cidade - UF"
                    value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 font-medium transition-colors">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="animate-spin w-5 h-5" /> : 'Cadastrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
