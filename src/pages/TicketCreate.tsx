import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Upload, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';

export default function TicketCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);

  // Estado do formulário
  const [formData, setFormData] = useState({
    client_id: '',
    category: 'Outros',
    priority: 'Normal',
    title: '',
    description: '',
    location: '',
    equipment_id: ''
  });

  // 1. Carregar Clientes do banco de dados
  useEffect(() => {
    async function loadClients() {
      const { data } = await supabase.from('clients').select('id, name').order('name');
      if (data) setClients(data);
    }
    loadClients();
  }, []);

  // 2. Carregar Equipamentos vinculados ao cliente selecionado
  useEffect(() => {
    if (formData.client_id) {
      async function loadEquipment() {
        const { data } = await supabase
          .from('equipment')
          .select('id, name, model')
          .eq('client_id', formData.client_id);
        if (data) setEquipment(data);
      }
      loadEquipment();
    } else {
      setEquipment([]);
    }
  }, [formData.client_id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('tickets').insert([formData]);
      if (error) throw error;
      
      alert('Chamado aberto com sucesso!');
      navigate('/chamados');
    } catch (err: any) {
      alert('Erro ao salvar chamado: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white text-left">Novo Chamado</h1>
        <button onClick={() => navigate('/chamados')} className="text-zinc-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
        {/* Seleção de Cliente */}
        <div className="space-y-2 text-left">
          <label className="text-xs font-bold text-zinc-500 uppercase">Cliente *</label>
          <select 
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-blue-500"
            value={formData.client_id}
            onChange={(e) => setFormData({...formData, client_id: e.target.value})}
          >
            <option value="">Selecione o Cliente</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Categoria */}
        <div className="space-y-2 text-left">
          <label className="text-xs font-bold text-zinc-500 uppercase">Categoria</label>
          <select 
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-blue-500"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option>Infraestrutura</option>
            <option>Redes</option>
            <option>Software</option>
            <option>Outros</option>
          </select>
        </div>

        {/* Equipamento */}
        <div className="space-y-2 text-left">
          <label className="text-xs font-bold text-zinc-500 uppercase">Equipamento</label>
          <select 
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 disabled:opacity-50"
            disabled={!formData.client_id}
            value={formData.equipment_id}
            onChange={(e) => setFormData({...formData, equipment_id: e.target.value})}
          >
            <option value="">Selecione o Equipamento (opcional)</option>
            {equipment.map(e => <option key={e.id} value={e.id}>{e.name} - {e.model}</option>)}
          </select>
        </div>

        {/* Prioridade */}
        <div className="space-y-2 text-left">
          <label className="text-xs font-bold text-zinc-500 uppercase">Prioridade</label>
          <div className="flex gap-2">
            {['Baixa', 'Normal', 'Alta', 'Crítica'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setFormData({...formData, priority: p})}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  formData.priority === p ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-zinc-950 text-zinc-500 border border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Localização */}
        <div className="md:col-span-2 space-y-2 text-left">
          <label className="text-xs font-bold text-zinc-500 uppercase">Localização Física</label>
          <input 
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-blue-500"
            placeholder="Ex: Sala de Máquinas, Térreo..."
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
        </div>

        {/* Título */}
        <div className="md:col-span-2 space-y-2 border-t border-zinc-800 pt-6 text-left">
          <label className="text-xs font-bold text-zinc-500 uppercase">Título da Ocorrência *</label>
          <input 
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-blue-500"
            placeholder="Resumo breve do problema..."
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        {/* Descrição */}
        <div className="md:col-span-2 space-y-2 text-left">
          <label className="text-xs font-bold text-zinc-500 uppercase">Descrição Detalhada</label>
          <textarea 
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 h-32 resize-none"
            placeholder="Forneça o máximo de detalhes..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-4 pt-6">
          <button type="button" onClick={() => navigate('/chamados')} className="px-6 py-3 text-zinc-400 font-medium hover:text-white">Cancelar</button>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Save className="w-5 h-5" /> Salvar Chamado</>}
          </button>
        </div>
      </form>
    </div>
  );
}
