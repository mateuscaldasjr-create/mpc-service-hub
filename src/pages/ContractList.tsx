import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Contract, Profile } from '../types';
import { FileText, Plus, X, Loader2, Calendar, Briefcase } from 'lucide-react';

interface ContractListProps {
  profile: Profile | null;
}

const ContractList: React.FC<ContractListProps> = ({ profile }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    contract_number: '',
    client_id: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    status: 'active'
  });

  useEffect(() => {
    fetchData();
  }, [profile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Busca Contratos
      let query = supabase.from('contracts').select('*, client:clients(name)');
      if (profile?.role === 'cliente' || profile?.role === 'fiscal') {
        query = query.eq('client_id', profile.client_id);
      }
      const { data: contractData } = await query.order('created_at', { ascending: false });
      
      // Busca Clientes para o select (apenas para Admin)
      if (profile?.role === 'admin') {
        const { data: clientData } = await supabase.from('clients').select('id, name').order('name');
        setClients(clientData || []);
      }

      setContracts(contractData as any[] || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('contracts').insert([formData]);
      if (error) throw error;
      setShowModal(false);
      setFormData({ name: '', contract_number: '', client_id: '', start_date: new Date().toISOString().split('T')[0], end_date: '', status: 'active' });
      fetchData();
    } catch (err: any) {
      alert('Erro ao salvar contrato: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Contratos</h1>
          <p className="text-zinc-500 text-sm">Controle de vigência e escopo de serviços da MPC.</p>
        </div>
        {profile?.role === 'admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4 mr-2" /> Cadastrar Contrato
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-zinc-500"><Loader2 className="animate-spin mx-auto w-8 h-8 text-blue-500" /></div>
        ) : contracts.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-zinc-900/30 border border-dashed border-zinc-800 rounded-3xl text-zinc-500">
            Nenhum contrato ativo encontrado.
          </div>
        ) : (
          contracts.map((contract) => (
            <div key={contract.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4">
                  <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter ${
                    contract.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {contract.status === 'active' ? 'Ativo' : 'Encerrado'}
                  </span>
               </div>
               
              <div className="p-3 bg-zinc-800 w-fit rounded-xl mb-4 group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              
              <h3 className="text-lg font-bold text-white truncate pr-10">{contract.name}</h3>
              <p className="text-zinc-500 text-xs font-mono mt-1">Nº {contract.contract_number}</p>
              
              <div className="mt-6 space-y-3 border-t border-zinc-800 pt-4">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500 flex items-center gap-1"><Briefcase className="w-3 h-3"/> Cliente:</span>
                  <span className="text-zinc-200 font-semibold">{(contract as any).client?.name}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500 flex items-center gap-1"><Calendar className="w-3 h-3"/> Vigência:</span>
                  <span className="text-zinc-200">
                    {new Date(contract.start_date).toLocaleDateString('pt-BR')} até {contract.end_date ? new Date(contract.end_date).toLocaleDateString('pt-BR') : 'Final'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Cadastro */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Novo Contrato</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white"><X /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase">Nome do Contrato</label>
                <input required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                  placeholder="Ex: Manutenção Mensal TI" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase">Nº Contrato</label>
                  <input required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                    placeholder="001/2026" value={formData.contract_number} onChange={e => setFormData({...formData, contract_number: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase">Cliente</label>
                  <select required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-blue-500"
                    value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})}>
                    <option value="">Selecione</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase">Início</label>
                  <input type="date" required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white"
                    value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase">Término</label>
                  <input type="date" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white"
                    value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
                </div>
              </div>
              <button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold mt-4">
                {saving ? 'Salvando...' : 'Salvar Contrato'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractList;
