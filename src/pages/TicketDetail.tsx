import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, User, Monitor, MapPin, Tag, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase';

export default function TicketDetail({ profile }: { profile: any }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTicket() {
      try {
        const { data, error } = await supabase
          .from('tickets')
          .select('*, clients(name), equipment(name, model)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setTicket(data);
      } catch (err: any) {
        alert('Erro ao carregar: ' + err.message);
        navigate('/chamados');
      } finally {
        setLoading(false);
      }
    }
    fetchTicket();
  }, [id, navigate]);

  async function updateStatus(newStatus: string) {
    const { error } = await supabase.from('tickets').update({ status: newStatus }).eq('id', id);
    if (!error) {
      alert('Status atualizado!');
      window.location.reload();
    }
  }

  if (loading) return <div className="p-10 text-white">Carregando detalhes do chamado...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left">
      <button onClick={() => navigate('/chamados')} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-white mb-2">{ticket.title}</h1>
            <p className="text-zinc-400 mb-8">{ticket.description || 'Sem descrição.'}</p>
            
            {ticket.image_url && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-zinc-500 uppercase">Evidência Anexada</p>
                <img src={ticket.image_url} alt="Evidência" className="rounded-xl border border-zinc-800 w-full" />
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white border-b border-zinc-800 pb-2">Resumo Técnico</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-zinc-300"><User className="w-4 h-4 text-zinc-500"/> {ticket.clients?.name}</div>
            <div className="flex items-center gap-2 text-sm text-zinc-300"><Monitor className="w-4 h-4 text-zinc-500"/> {ticket.equipment?.name || 'Geral'}</div>
            <div className="flex items-center gap-2 text-sm text-zinc-300"><MapPin className="w-4 h-4 text-zinc-500"/> {ticket.location || 'Não informada'}</div>
            <div className="flex items-center gap-2 text-sm text-zinc-300"><Tag className="w-4 h-4 text-zinc-500"/> {ticket.category}</div>
            <div className={`text-sm font-bold ${ticket.priority === 'Crítica' ? 'text-red-500' : 'text-blue-500'}`}>Prioridade: {ticket.priority}</div>
          </div>
          
          <div className="pt-4 space-y-2">
            {ticket.status === 'open' && (
              <button onClick={() => updateStatus('in_progress')} className="w-full bg-yellow-600 p-2 rounded-lg text-white font-bold text-sm">Atender Chamado</button>
            )}
            <button onClick={() => updateStatus('completed')} className="w-full bg-green-600 p-2 rounded-lg text-white font-bold text-sm">Finalizar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
