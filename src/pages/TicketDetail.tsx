import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Monitor, 
  User,
  Calendar,
  Tag
} from 'lucide-react';
import { supabase } from '../supabase';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicket();
  }, [id]);

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
      alert('Erro ao carregar chamado: ' + err.message);
      navigate('/chamados');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(newStatus: string) {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      fetchTicket(); // Atualiza a tela
      alert('Status atualizado!');
    } catch (err: any) {
      alert('Erro ao atualizar: ' + err.message);
    }
  }

  if (loading) return <div className="p-20 text-white">Carregando detalhes...</div>;
  if (!ticket) return <div className="p-20 text-white">Chamado não encontrado.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/chamados')} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Voltar para a lista
        </button>
        <div className="flex gap-2">
          {ticket.status === 'open' && (
            <button onClick={() => updateStatus('in_progress')} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
              <Clock className="w-4 h-4" /> Iniciar Atendimento
            </button>
          )}
          {ticket.status !== 'completed' && (
            <button onClick={() => updateStatus('completed')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Finalizar Chamado
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal: Informações do Chamado */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-left">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${ticket.status === 'open' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                {ticket.status === 'open' ? 'Aberto' : 'Finalizado'}
              </span>
              <span className="text-zinc-500 text-xs font-mono">ID #{ticket.id.slice(0, 8)}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">{ticket.title}</h1>
            <p className="text-zinc-400 leading-relaxed mb-8">{ticket.description || 'Sem descrição detalhada fornecida.'}</p>

            {/* IMAGEM ANEXADA */}
            {ticket.image_url && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Evidência Fotográfica</h3>
                <div className="rounded-xl overflow-hidden border border-zinc-800">
                  <img src={ticket.image_url} alt="Evidência" className="w-full h-auto object-cover max-h-[500px]" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Coluna Lateral: Dados Técnicos */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-left space-y-6">
            <h3 className="text-sm font-bold text-white border-b border-zinc-800 pb-4">Detalhes Técnicos</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-zinc-500 mt-1" />
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Cliente</p>
                  <p className="text-sm text-zinc-200">{ticket.clients?.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Monitor className="w-4 h-4 text-zinc-500 mt-1" />
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Equipamento</p>
                  <p className="text-sm text-zinc-200">{ticket.equipment?.name || 'Não especificado'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-zinc-500 mt-1" />
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Localização</p>
                  <p className="text-sm text-zinc-200">{ticket.location || 'Não informada'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Tag className="w-4 h-4 text-zinc-500 mt-1" />
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Categoria</p>
                  <p className="text-sm text-zinc-200">{ticket.category}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-zinc-500 mt-1" />
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Prioridade</p>
                  <p className={`text-sm font-bold ${ticket.priority === 'Crítica' ? 'text-red-500' : 'text-blue-500'}`}>{ticket.priority}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
