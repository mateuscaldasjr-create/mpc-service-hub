
import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  History
} from 'lucide-react';
import { supabase } from '../supabase';
import { Profile } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  profile: Profile | null;
}

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    ongoing: 0,
    completed: 0
  });
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [profile]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('tickets').select('*', { count: 'exact' });
      
      if (profile?.role === 'cliente' || profile?.role === 'fiscal') {
        query = query.eq('client_id', profile.client_id);
      }

      const { data, count, error } = await query;
      if (error) throw error;

      const tickets = data || [];
      setStats({
        total: count || 0,
        open: tickets.filter(t => t.status === 'aberto').length,
        ongoing: tickets.filter(t => t.status === 'em_atendimento' || t.status === 'aguardando').length,
        completed: tickets.filter(t => t.status === 'finalizado').length
      });

      setRecentTickets(tickets.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Abertos', value: stats.open, color: '#3b82f6' },
    { name: 'Em Atend.', value: stats.ongoing, color: '#f59e0b' },
    { name: 'Finalizados', value: stats.completed, color: '#10b981' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Olá, {profile?.full_name?.split(' ')[0]}</h1>
          <p className="text-zinc-500">Bem-vindo ao MPC Service Hub. Aqui está o resumo operacional de hoje.</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Baixar Relatório
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Novo Chamado
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total de Chamados', value: stats.total, icon: Ticket, color: 'text-zinc-400', bg: 'bg-zinc-900' },
          { label: 'Em Aberto', value: stats.open, icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Em Andamento', value: stats.ongoing, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Finalizados', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ].map((item) => (
          <div key={item.label} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-3 ${item.bg} rounded-bl-2xl`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{item.label}</p>
            <h3 className="text-3xl font-bold mt-2">{item.value}</h3>
            <div className="mt-4 flex items-center text-xs text-emerald-500 font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+12% desde ontem</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="font-bold mb-6 flex items-center">
            Distribuição de Chamados
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#18181b'}}
                  contentStyle={{backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#fff'}}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold">Chamados Recentes</h3>
            <History className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="space-y-4">
            {recentTickets.length === 0 ? (
              <p className="text-center text-zinc-500 py-10 text-sm italic">Nenhum chamado registrado.</p>
            ) : (
              recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer group">
                  <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                    ticket.status === 'aberto' ? 'bg-blue-500' :
                    ticket.status === 'finalizado' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}></div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-blue-400 transition-colors">
                      #{ticket.number} - {ticket.title}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Aberto em {new Date(ticket.opened_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="w-full mt-6 py-2.5 text-xs font-bold text-zinc-400 hover:text-white border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-all">
            Ver Todos os Chamados
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
