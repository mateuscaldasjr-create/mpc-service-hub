import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../supabase';

export default function TicketList() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      setLoading(true);
      // Busca chamados e traz o nome do cliente associado
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/10 text-blue-500';
      case 'in_progress': return 'bg-yellow-500/10 text-yellow-500';
      case 'completed': return 'bg-green-500/10 text-green-500';
      default: return 'bg-zinc-500/10 text-zinc-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Crítica': return 'text-red-500';
      case 'Alta': return 'text-orange-500';
      case 'Normal': return 'text-blue-500';
      default: return 'text-zinc-500';
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold text-white">Gerenciamento de Chamados</h1>
          <p className="text-zinc-500 text-sm">Acompanhe todos os atendimentos técnicos em aberto e finalizados.</p>
        </div>
        <button 
          onClick={() => navigate('/chamados/novo')}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
        >
          <Plus className="w-4 h-4" /> Novo Chamado
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text"
            placeholder="Pesquisar por número ou título..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg hover:text-white">
          <Filter className="w-4 h-4" /> Filtros
        </button>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-950 text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Título / Descrição</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Prioridade</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-zinc-500">Carregando chamados...</td></tr>
              ) : filteredTickets.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-zinc-500">Nenhum chamado encontrado.</td></tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-zinc-800/30 transition-colors cursor-pointer" onClick={() => navigate(`/chamados/${ticket.id}`)}>
                    <td className="px-6 py-4 text-xs font-mono text-zinc-500">#{ticket.id.slice(0, 5)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{ticket.title}</span>
                        {ticket.image_url && <ImageIcon className="w-3 h-3 text-blue-500" title="Possui anexo" />}
                      </div>
                      <div className="text-xs text-zinc-500 truncate max-w-[200px]">{ticket.description || 'Sem descrição'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">{ticket.clients?.name || 'Cliente removido'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(ticket.status)}`}>
                        {ticket.status === 'open' ? 'Aberto' : ticket.status === 'in_progress' ? 'Em Atend.' : 'Finalizado'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-xs font-bold ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </td>
                    <td className="px-6 py-4 text-right">
  <button 
    onClick={(e) => {
      e.stopPropagation(); // Evita clicar na linha e no botão ao mesmo tempo
      navigate(`/chamados/${ticket.id}`);
    }}
    className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-zinc-700"
  >
    Visualizar
  </button>
</td>
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
}
