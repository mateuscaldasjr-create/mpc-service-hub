import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, AlertCircle, Clock, CheckCircle2, History, ArrowUpRight } from 'lucide-react';
import { supabase } from '../supabase';

export default function Dashboard({ profile }: { profile: any }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, open: 0, progress: 0, closed: 0 });
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { data: tickets } = await supabase
          .from('tickets')
          .select('*, clients(name)')
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

  const statCards = [
    { label: 'Total de Chamados', value: stats.total, icon: ClipboardList, color: 'blue' },
    { label: 'Em Aberto', value: stats.open, icon: AlertCircle, color: 'blue' },
    { label: 'Em Atendimento', value: stats.progress, icon: Clock, color: 'blue' },
    { label: 'Finalizados', value: stats.closed, icon: CheckCircle2, color: 'blue' },
  ];

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Olá, {profile?.full_name?.split(' ')[0]}</h1>
          <p className="text-zinc-500 text-sm font-medium">Bem-vindo ao centro de operações da MPC Service Hub.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-zinc-900 text-zinc-400 rounded-xl text-sm font-bold hover:text-white transition-all border border-zinc-800">Relatórios</button>
          <button onClick={() => navigate('/chamados/novo')} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">Novo Chamado</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <card.icon className="w-12 h-12 text-blue-500" />
            </div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{card.label}</p>
            <div className="text-4xl font-black text-white">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 relative">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Atividade de Chamados</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-600" /><span className="text-[10px] text-zinc-500 font-bold uppercase">Volume</span></div>
            </div>
          </div>
          <div className="h-64 flex items-end gap-3">
             {/* Gráfico Estilizado MPC */}
             <div className="flex-1 bg-gradient-to-t from-blue-600/20 to-blue-600/5 rounded-t-xl border-t-2 border-blue-600" style={{height: '60%'}}></div>
             <div className="flex-1 bg-zinc-800/20 rounded-t-xl border-t-2 border-zinc-800" style={{height: '40%'}}></div>
             <div className="flex-1 bg-gradient-to-t from-blue-600/20 to-blue-600/5 rounded-t-xl border-t-2 border-blue-600" style={{height: '85%'}}></div>
             <div className="flex-1 bg-zinc-800/20 rounded-t-xl border-t-2 border-zinc-800" style={{height: '55%'}}></div>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Recentes</h2>
            <History className="w-4 h-4 text-zinc-600" />
          </div>
          <div className="space-y-6">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="group cursor-pointer" onClick={() => navigate(`/chamados/${ticket.id}`)}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-zinc-200 group-hover:text-blue-500 transition-colors uppercase tracking-tight">{ticket.title}</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-blue-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">{ticket.clients?.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
