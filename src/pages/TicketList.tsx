
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { Ticket, Profile } from '../types';
import { Search, Filter, Plus, ChevronRight, MoreHorizontal } from 'lucide-react';

interface TicketListProps {
  profile: Profile | null;
}

const TicketList: React.FC<TicketListProps> = ({ profile }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [profile]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('tickets')
        .select('*, client:clients(name), technician:profiles(full_name)')
        .order('opened_at', { ascending: false });

      if (profile?.role === 'cliente' || profile?.role === 'fiscal') {
        query = query.eq('client_id', profile.client_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTickets(data as any[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      aberto: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      em_atendimento: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      aguardando: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
      finalizado: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      cancelado: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || styles.aguardando}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      critica: 'text-red-500',
      alta: 'text-orange-500',
      normal: 'text-blue-500',
      baixa: 'text-zinc-500',
    };
    return (
      <span className={`font-medium ${styles[priority]}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Chamados</h1>
          <p className="text-zinc-500 text-sm">Acompanhe todos os atendimentos técnicos em aberto e finalizados.</p>
        </div>
        <Link 
          to="/chamados/novo"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Chamado
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Pesquisar por número ou título..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/30">
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">ID</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Título / Descrição</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Cliente</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Prioridade</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Data</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">Carregando chamados...</td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">Nenhum chamado encontrado.</td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-zinc-400 font-mono text-xs">#{ticket.number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col max-w-xs md:max-w-md lg:max-w-lg">
                        <span className="text-sm font-bold text-zinc-100 truncate group-hover:text-blue-400 transition-colors">{ticket.title}</span>
                        <span className="text-xs text-zinc-500 truncate">{ticket.description || 'Sem descrição'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">
                      {ticket.client?.name || 'Interno'}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {getPriorityBadge(ticket.priority)}
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500 whitespace-nowrap">
                      {new Date(ticket.opened_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/chamados/${ticket.id}`}
                        className="p-2 hover:bg-zinc-700 rounded-lg inline-flex items-center justify-center transition-colors text-zinc-400 hover:text-white"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <span>Exibindo {tickets.length} resultados</span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-50" disabled>Anterior</button>
            <button className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-50" disabled>Próximo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketList;
