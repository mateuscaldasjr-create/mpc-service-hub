
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Profile, Client, Contract, Equipment, TicketCategory, TicketPriority } from '../types';
import { ArrowLeft, Save, Upload, AlertTriangle } from 'lucide-react';

interface TicketCreateProps {
  profile: Profile | null;
}

const TicketCreate: React.FC<TicketCreateProps> = ({ profile }) => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'outros' as TicketCategory,
    priority: 'normal' as TicketPriority,
    client_id: '',
    contract_id: '',
    equipment_id: '',
    location: ''
  });

  useEffect(() => {
    fetchClients();
  }, [profile]);

  useEffect(() => {
    if (formData.client_id) {
      fetchClientData(formData.client_id);
    }
  }, [formData.client_id]);

  const fetchClients = async () => {
    if (profile?.role === 'cliente' || profile?.role === 'fiscal') {
      setFormData(prev => ({ ...prev, client_id: profile.client_id || '' }));
      const { data } = await supabase.from('clients').select('*').eq('id', profile.client_id).single();
      if (data) setClients([data]);
    } else {
      const { data } = await supabase.from('clients').select('*');
      if (data) setClients(data);
    }
  };

  const fetchClientData = async (clientId: string) => {
    const [contractsRes, equipRes] = await Promise.all([
      supabase.from('contracts').select('*').eq('client_id', clientId),
      supabase.from('equipment').select('*').eq('client_id', clientId)
    ]);
    if (contractsRes.data) setContracts(contractsRes.data);
    if (equipRes.data) setEquipment(equipRes.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.client_id) {
      setError('Título e Cliente são campos obrigatórios.');
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.from('tickets').insert({
        ...formData,
        creator_id: profile?.id,
        status: 'aberto'
      });
      if (error) throw error;
      navigate('/chamados');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar chamado.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/chamados')}
          className="flex items-center text-zinc-500 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para lista
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-xl font-bold">Novo Chamado Técnico</h1>
          <p className="text-zinc-500 text-sm mt-1">Preencha as informações detalhadas sobre a ocorrência ou solicitação.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center text-sm">
              <AlertTriangle className="w-4 h-4 mr-3 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Cliente *</label>
                <select 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:ring-1 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
                  value={formData.client_id}
                  disabled={profile?.role === 'cliente' || profile?.role === 'fiscal'}
                  onChange={(e) => setFormData({...formData, client_id: e.target.value})}
                >
                  <option value="">Selecione o Cliente</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Contrato</label>
                <select 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  value={formData.contract_id}
                  onChange={(e) => setFormData({...formData, contract_id: e.target.value})}
                >
                  <option value="">Selecione o Contrato (opcional)</option>
                  {contracts.map(c => <option key={c.id} value={c.id}>{c.contract_number} - {c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Equipamento</label>
                <select 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  value={formData.equipment_id}
                  onChange={(e) => setFormData({...formData, equipment_id: e.target.value})}
                >
                  <option value="">Selecione o Equipamento (opcional)</option>
                  {equipment.map(e => <option key={e.id} value={e.id}>{e.name} ({e.model})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Localização Física</label>
                <input 
                  type="text" 
                  placeholder="Ex: Sala de Máquinas, Térreo..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Categoria</label>
                <select 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as TicketCategory})}
                >
                  <option value="gerador">Gerador</option>
                  <option value="subestacao">Subestação</option>
                  <option value="nobreak">Nobreak</option>
                  <option value="informatica">Informática</option>
                  <option value="ar_condicionado">Ar Condicionado</option>
                  <option value="rede">Rede</option>
                  <option value="transporte">Transporte</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Prioridade</label>
                <div className="flex space-x-2">
                  {(['baixa', 'normal', 'alta', 'critica'] as TicketPriority[]).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({...formData, priority: p})}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all capitalize
                        ${formData.priority === p 
                          ? 'bg-blue-600 border-blue-500 text-white' 
                          : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}
                      `}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Anexar Imagens</label>
                <div className="border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group">
                  <Upload className="w-8 h-8 text-zinc-600 mx-auto mb-3 group-hover:text-blue-500 transition-colors" />
                  <p className="text-sm text-zinc-400">Clique para fazer upload ou arraste arquivos</p>
                  <p className="text-[10px] text-zinc-600 mt-1">PNG, JPG ou PDF até 10MB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-zinc-800">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Título da Ocorrência *</label>
              <input 
                type="text" 
                placeholder="Resumo breve do problema..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 font-medium focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Descrição Detalhada</label>
              <textarea 
                rows={5}
                placeholder="Forneça o máximo de detalhes para agilizar o diagnóstico técnico..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4">
            <button 
              type="button"
              onClick={() => navigate('/chamados')}
              className="px-6 py-2.5 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-lg text-sm font-bold flex items-center shadow-xl shadow-blue-900/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Salvando...' : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Chamado
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketCreate;
