import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../supabase';

export default function TicketList() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Carrega os chamados do banco de dados ao abrir a página
  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      setLoading(true);
      // Busca os tickets e faz o JOIN com a tabela de clientes para pegar o nome
      const { data, error } = await supabase
        .from('tickets')
        .select('*, clients(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar chamados:', error.message);
    } finally {
      setLoading(false);
    }
  }

  // 2. Helpers visuais para status e prioridade
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'open': return { label: 'Aberto', color: 'bg-blue-500/10 text-blue-500' };
      case 'in_progress': return { label: 'Em Atend.', color: 'bg-yellow-500/10 text-yellow-500' };
      case 'completed': return { label: 'Finalizado', color: 'bg-green-500/10 text-green-500' };
      default: return { label: status, color: 'bg-zinc-500/10 text-zinc-500' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Crítica': return 'text-red-500';
      case 'Alta': return 'text-orange-500';
      case 'Normal': return 'text-blue-500';
      case 'Baixa': return 'text-zinc-500';
      default: return 'text-zinc-400';
    }
  };

  // 3. Filtro de busca por Título ou Nome do Cliente
  const filteredTickets = tickets.filter(t => 
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Cabeçalho com alinhamento à esquerda conforme seu dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gerenciamento de Chamados</h1>
          <p className="text-zinc-500 text-sm">Acompanhe a fila de atendimentos da MPC em tempo real.</p>
        </div>
        <button 
          onClick={() => navigate('/chamados/novo')}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-5 h-5" /> Novo Chamado
        </button>
      </div>

      {/* Barra de Pesquisa */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text"
            placeholder="Pesquisar por cliente ou problema..."
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white outline-none focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-xl hover:text-white transition-colors">
          <Filter className="w-4 h-4" /> Filtros
        </button>
      </div>

      {/* Tabela de Chamados */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-950 text-zinc-500 text-[10px] uppercase font-bold tracking-widest border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Título / Ocorrência</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Prioridade</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-20 text-center"><div className="flex justify-center"><AlertCircle className="animate-pulse text-blue-500" /></div></td></tr>
              ) : filteredTickets.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-20 text-center text-zinc-500 font-medium">Nenhum chamado encontrado na base.</td></tr>
              ) : (
                filteredTickets.map((ticket) => {
                  const status = getStatusInfo(ticket.status);
                  return (
                    <tr 
                      key={ticket.id} 
                      className="hover:bg-zinc-800/40 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/chamados/${ticket.id}`)}
                    >
                      <td className="px-6 py-4 text-[10px] font-mono text-zinc-600">#{ticket.id.slice(0, 5)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">{ticket.title}</span>
                          {ticket.image_url && <ImageIcon className="w-3.5 h-3.5 text-blue-500" />}
                        </div>
                        <div className="text-xs text-zinc-500 truncate max-w-[250px] mt-0.5">{ticket.description || 'Sem descrição adicional'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">{ticket.clients?.name || 'Cliente Geral'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tight ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-[11px] font-bold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/chamados/${ticket.id}`); }}
                          className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
