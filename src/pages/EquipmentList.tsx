import React, { useState, useEffect } from 'react';
import { Plus, Loader2, Monitor, Trash2 } from 'lucide-react';
import { supabase } from '../supabase';

export default function EquipmentList() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    model: '',
    serial_number: '',
    location: '',
    client_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [eqRes, clRes] = await Promise.all([
        supabase.from('equipment').select('*, clients(name)').order('created_at', { ascending: false }),
        supabase.from('clients').select('id, name').order('name')
      ]);
      if (eqRes.data) setEquipment(eqRes.data);
      if (clRes.data) setClients(clRes.data);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('equipment').insert([formData]);
      if (error) throw error;
      setShowModal(false);
      setFormData({ name: '', model: '', serial_number: '', location: '', client_id: '' });
      fetchData();
    } catch (err: any) {
      alert('Erro ao salvar: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white text-left">Inventário de Equipamentos</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Equipamento
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-zinc-950 text-zinc-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Equipamento</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Série / Local</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {equipment.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-10 text-center text-zinc-500">Nenhum equipamento cadastrado.</td></tr>
              ) : (
                equipment.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/50">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{item.name}</div>
                      <div className="text-xs text-zinc-500">{item.model}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">{item.clients?.name}</td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">
                      {item.serial_number} <br/> <span className="text-xs">{item.location}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-left">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-6">Cadastrar Equipamento</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Nome (Ex: Ar-condicionado)</label>
                <input required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Cliente Responsável</label>
                <select required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white"
                  value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})}>
                  <option value="">Selecione o Cliente</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Modelo" className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white" 
                  value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
                <input placeholder="Nº de Série" className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white" 
                  value={formData.serial_number} onChange={e => setFormData({...formData, serial_number: e.target.value})} />
              </div>
              <input placeholder="Localização (Ex: Recepção)" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white" 
                value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-zinc-800 text-white rounded-lg">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
