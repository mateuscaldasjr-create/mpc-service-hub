import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabase';

// A linha abaixo é a que resolve o erro da Vercel!
export default function TicketCreate({ profile }: { profile: any }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    client_id: '',
    category: 'Outros',
    priority: 'Normal',
    title: '',
    description: '',
    location: '',
    equipment_id: '',
    contract_id: '',
    image_url: '' 
  });

  // Carregar lista de clientes
  useEffect(() => {
    async function loadClients() {
      const { data } = await supabase.from('clients').select('id, name').order('name');
      if (data) setClients(data);
    }
    loadClients();
  }, []);

  // Carregar Equipamentos e Contratos quando o cliente for selecionado
  useEffect(() => {
    if (formData.client_id) {
      async function loadRelatedData() {
        const [eqRes, ctRes] = await Promise.all([
          supabase.from('equipment').select('id, name, model').eq('client_id', formData.client_id),
          supabase.from('contracts').select('id, name').eq('client_id', formData.client_id).eq('status', 'active')
        ]);
        if (eqRes.data) setEquipment(eqRes.data);
        if (ctRes.data) setContracts(ctRes.data);
      }
      loadRelatedData();
    }
  }, [formData.client_id]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error: any) {
      alert('Erro no upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('tickets').insert([formData]);
      if (error) throw error;
      alert('Chamado aberto com sucesso!');
      navigate('/dashboard');
    } catch (err: any) {
      alert('Erro ao salvar chamado: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10 text-left">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Novo Chamado</h1>
        <button onClick={() => navigate('/dashboard')} className="text-zinc-400 hover:text-white"><X /></button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
        {/* Cliente */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase">Cliente *</label>
          <select required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white"
            value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})}>
            <option value="">Selecione o Cliente</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Categoria */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase">Categoria</label>
          <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white"
            value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option>Infraestrutura</option><option>Redes</option><option>Software</option><option>Outros</option>
          </select>
        </div>

        {/* Equipamento */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase">Equipamento</label>
          <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white disabled:opacity-50"
            disabled={!formData.client_id} value={formData.equipment_id} onChange={e => setFormData({...formData, equipment_id: e.target.value})}>
            <option value="">Selecione o Equipamento</option>
            {equipment.map(eq => <option key={eq.id} value={eq.id}>{eq.name} - {eq.model}</option>)}
          </select>
        </div>

        {/* Contrato */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase">Contrato Vinculado</label>
          <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white disabled:opacity-50"
            disabled={!formData.client_id} value={formData.contract_id} onChange={e => setFormData({...formData, contract_id: e.target.value})}>
            <option value="">Selecione o Contrato</option>
            {contracts.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
          </select>
        </div>

        {/* Upload de Imagem */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase">Anexar Imagens</label>
          <div className={`relative border-2 border-dashed rounded-2xl p-8 transition-all text-center ${formData.image_url ? 'border-green-500/50 bg-green-500/5' : 'border-zinc-800 hover:border-blue-500/50'}`}>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploading} />
            <div className="flex flex-col items-center gap-2">
              {uploading ? <Loader2 className="w-8 h-8 animate-spin text-blue-500" /> : 
               formData.image_url ? <CheckCircle2 className="w-8 h-8 text-green-500" /> : 
               <Upload className="w-8 h-8 text-zinc-500" />}
              <p className="text-sm text-zinc-400">
                {uploading ? 'Subindo imagem...' : formData.image_url ? 'Imagem anexada!' : 'Clique para anexar evidência fotográfica'}
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2 border-t border-zinc-800 pt-6">
          <label className="text-xs font-bold text-zinc-500 uppercase">Título da Ocorrência *</label>
          <input required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white" 
            placeholder="Resumo breve do problema..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase">Descrição Detalhada</label>
          <textarea className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white h-32 resize-none" 
            placeholder="Forneça o máximo de detalhes..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>

        <div className="md:col-span-2 flex justify-end gap-4 pt-6">
          <button type="submit" disabled={loading || uploading} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Save className="w-5 h-5" /> Salvar Chamado</>}
          </button>
        </div>
      </form>
    </div>
  );
}
