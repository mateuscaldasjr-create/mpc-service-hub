
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Client, Profile } from '../types';
import { Building2, Search, Plus, Mail, Phone, ExternalLink } from 'lucide-react';

interface ClientListProps {
  profile: Profile | null;
}

const ClientList: React.FC<ClientListProps> = ({ profile }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('clients').select('*').order('name');
      if (error) throw error;
      setClients(data || []);
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
          <h1 className="text-2xl font-bold">Base de Clientes</h1>
          <p className="text-zinc-500 text-sm">Gerenciamento de empresas e órgãos públicos atendidos pela MPC.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Cadastrar Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-zinc-500">Carregando carteira de clientes...</div>
        ) : clients.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500">Nenhum cliente cadastrado.</div>
        ) : (
          clients.map((client) => (
            <div key={client.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-all flex flex-col md:flex-row gap-6">
              <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-700">
                <Building2 className="w-8 h-8 text-zinc-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold truncate pr-4">{client.name}</h3>
                    <p className="text-xs text-zinc-500 font-mono">{client.document || 'SEM CNPJ'}</p>
                  </div>
                  <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center text-xs text-zinc-400">
                    <Mail className="w-3.5 h-3.5 mr-2" />
                    <span className="truncate">{client.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-xs text-zinc-400">
                    <Phone className="w-3.5 h-3.5 mr-2" />
                    {client.phone || 'N/A'}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center space-x-4">
                  <div className="text-center px-4 border-r border-zinc-800">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Chamados</p>
                    <p className="text-sm font-bold">--</p>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Contratos</p>
                    <p className="text-sm font-bold">--</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientList;
