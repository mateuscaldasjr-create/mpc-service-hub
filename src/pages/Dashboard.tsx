import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, AlertCircle, Clock, CheckCircle2, History } from 'lucide-react';
import { supabase } from '../supabase';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, open: 0, progress: 0, closed: 0 });
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { data: tickets } = await supabase
          .from('tickets')
          .select('*')
          .order('created_at', { ascending: false });

        if (tickets) {
          setStats({
            total: tickets.length,
            open: tickets.filter(t => t.status === 'open').length,
            progress: tickets.filter(t => t.status === 'in_progress').length,
            closed: tickets.filter(t => t.status === 'completed').length,
          });
          setRecentTickets(tickets.slice(0, 5));
        }
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // FUNÇÃO PARA CONSERTAR A DATA
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não disponível';
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? 'Data inválida' 
      : new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(date);
  };

  const statCards = [
    { label: 'Total de Chamados', value: stats.total, icon: ClipboardList, color: 'zinc', trend: '+12% desde ontem' },
    { label: 'Em Aberto', value: stats.open, icon: AlertCircle, color: 'blue', trend: '+12% desde ontem' },
    { label: 'Em Andamento', value: stats.progress, icon: Clock, color: 'yellow', trend: '+12% desde ontem' },
    { label: 'Finalizados', value: stats.closed, icon: CheckCircle2, color: 'green', trend: '+12% desde ontem' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-white">Olá,</h1>
          <p className="text-zinc-500 text-sm">Bem-vindo ao MPC Service Hub. Aqui está o resumo operacional de hoje.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-lg text-sm font-medium hover:text-white transition-colors">Baixar Relatório</button>
          <button onClick={() => navigate('/chamados/novo')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">Novo Chamado</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{card.label}</span>
              <card.icon className={`w-5 h-5 text-${card.color}-500`} />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{card.value}</div>
            <div className={`text-[10px] text-${card.color}-500/80 font-medium`}>↗ {card.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-6 text-left">Distribuição de Chamados</h2>
          <div className="h-64 flex items-end justify-between px-4">
             {/* Simulação de gráfico simples para o dashboard */}
             <div className="w-full h-full flex items-end gap-4">
                <div className="flex-1 bg-blue-600/20 border-t-2 border-blue-600 rounded-t-lg" style={{height: `${(stats.open/stats.total)*100 || 10}%`}}></div>
                <div className="flex-1 bg-yellow-600/20 border-t-2 border-yellow-600 rounded-t-lg" style={{height: `${(stats.progress/stats.total)*100 || 5}%`}}></div>
                <div className="flex-1 bg-green-600/20 border-t-2 border-green-600 rounded-t-lg" style={{height: `${(stats.closed/stats.total)*100 || 5}%`}}></div>
             </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-white text-left">Chamados Recentes</h2>
            <History className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="space-y-4">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="text-left group cursor-pointer" onClick={() => navigate(`/chamados/${ticket.id}`)}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span className="text-sm font-medium text-zinc-200 group-hover:text-blue-400 transition-colors"># - {ticket.title}</span>
                </div>
                <p className="text-[10px] text-zinc-500 ml-4">Aberto em {formatDate(ticket.created_at)}</p>
              </div>
            ))}
            <button onClick={() => navigate('/chamados')} className="w-full py-2 mt-4 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-800 transition-colors">Ver Todos os Chamados</button>
          </div>
        </div>
      </div>
    </div>
  );
}
