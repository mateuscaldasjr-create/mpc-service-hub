
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Contract, Profile } from '../types';
import { FileText, Search, Plus } from 'lucide-react';

interface ContractListProps {
  profile: Profile | null;
}

const ContractList: React.FC<ContractListProps> = ({ profile }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContracts();
  }, [profile]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      let query = supabase.from('contracts').select('*, client:clients(name)');
      
      if (profile?.role === 'cliente' || profile?.role === 'fiscal') {
        query = query.eq('client_id', profile.client_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setContracts(data as any[]);
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
          <h1 className="text-2xl font-bold">Gestão de Contratos</h1>
          <p className="text-zinc-500 text-sm">Controle de vigência e escopo de serviços contratados.</p>
        </div>
        {profile?.role === 'admin' && (
          <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Contrato
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-zinc-500">Carregando contratos...</div>
        ) : contracts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-zinc-500">Nenhum contrato ativo encontrado.</div>
        ) : (
          contracts.map((contract) => (
            <div key={contract.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  contract.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {contract.status}
                </span>
              </div>
              <h3 className="text-lg font-bold truncate">{contract.name}</h3>
              <p className="text-zinc-500 text-xs font-mono mt-1"># {contract.contract_number}</p>
              
              <div className="mt-6 space-y-3 border-t border-zinc-800 pt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Cliente:</span>
                  <span className="text-zinc-300 font-medium">{(contract as any).client?.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Início:</span>
                  <span className="text-zinc-300 font-medium">{new Date(contract.start_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Término:</span>
                  <span className="text-zinc-300 font-medium">{contract.end_date ? new Date(contract.end_date).toLocaleDateString() : 'Indeterminado'}</span>
                </div>
              </div>
              
              <button className="w-full mt-6 py-2 bg-zinc-800 text-zinc-400 rounded-lg text-xs font-bold hover:bg-zinc-700 hover:text-white transition-all">
                Ver Documentação
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContractList;
