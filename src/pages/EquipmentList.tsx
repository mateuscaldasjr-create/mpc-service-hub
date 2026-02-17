
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Equipment, Profile } from '../types';
import { HardDrive, Search, Plus, MapPin, Tag } from 'lucide-react';

interface EquipmentListProps {
  profile: Profile | null;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ profile }) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipment();
  }, [profile]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      let query = supabase.from('equipment').select('*, client:clients(name)');
      
      if (profile?.role === 'cliente' || profile?.role === 'fiscal') {
        query = query.eq('client_id', profile.client_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setEquipment(data as any[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Base de Equipamentos</h1>
          <p className="text-zinc-500 text-sm">Inventário completo de ativos técnicos sob manutenção.</p>
        </div>
        {(profile?.role === 'admin' || profile?.role === 'tecnico') && (
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Novo Equipamento
          </button>
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 bg-zinc-900/50 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Buscar por serial, modelo ou nome..." 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/30">
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Equipamento</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Tipo / Categoria</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Número de Série</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Localização</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Proprietário</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-zinc-500">Carregando inventário...</td></tr>
              ) : equipment.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-zinc-500">Nenhum equipamento cadastrado.</td></tr>
              ) : (
                equipment.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-zinc-800 rounded-lg">
                          <HardDrive className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-100">{item.name}</p>
                          <p className="text-xs text-zinc-500">{item.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-xs text-zinc-400">
                        <Tag className="w-3 h-3 mr-1" />
                        {item.type}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-zinc-500">{item.serial_number || 'S/N'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-xs text-zinc-400">
                        <MapPin className="w-3 h-3 mr-1" />
                        {item.location || 'Não informado'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-300">
                      {(item as any).client?.name}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-zinc-500 hover:text-white text-xs font-bold transition-colors underline">Detalhes</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EquipmentList;
