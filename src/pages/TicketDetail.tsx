
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Ticket, TicketUpdate, Profile } from '../types';
import { ArrowLeft, Clock, User, Building, MapPin, Send, History } from 'lucide-react';

interface TicketDetailProps {
  profile: Profile | null;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ profile }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [updates, setUpdates] = useState<TicketUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUpdate, setNewUpdate] = useState('');
  const [statusChange, setStatusChange] = useState('');

  useEffect(() => {
    if (id) fetchTicketData();
  }, [id]);

  const fetchTicketData = async () => {
    try {
      setLoading(true);
      const [ticketRes, updatesRes] = await Promise.all([
        supabase.from('tickets').select('*, client:clients(*), technician:profiles(*), equipment:equipment(*)').eq('id', id).single(),
        supabase.from('ticket_updates').select('*, user:profiles(*)').eq('ticket_id', id).order('created_at', { ascending: false })
      ]);

      if (ticketRes.error) throw ticketRes.error;
      setTicket(ticketRes.data as any);
      setUpdates(updatesRes.data || []);
      setStatusChange(ticketRes.data.status);
    } catch (err) {
      console.error(err);
      navigate('/chamados');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdate && statusChange === ticket?.status) return;

    try {
      const { error } = await supabase.from('ticket_updates').insert({
        ticket_id: id,
        user_id: profile?.id,
        content: newUpdate || `Status alterado para ${statusChange}`,
        new_status: statusChange
      });

      if (error) throw error;

      if (statusChange !== ticket?.status) {
        await supabase.from('tickets').update({ status: statusChange }).eq('id', id);
      }

      setNewUpdate('');
      fetchTicketData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Carregando detalhes do chamado...</div>;
  if (!ticket) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <button 
        onClick={() => navigate('/chamados')}
        className="flex items-center text-zinc-500 hover:text-zinc-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para a lista
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-zinc-500 font-mono text-xs">#{ticket.number}</span>
                <h1 className="text-2xl font-bold mt-1">{ticket.title}</h1>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                ticket.status === 'aberto' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {ticket.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-zinc-400 text-sm whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
          </div>

          {/* Timeline / Chat */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-4 bg-zinc-900/50 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-bold flex items-center">
                <History className="w-4 h-4 mr-2 text-blue-500" />
                Histórico de Atualizações
              </h3>
            </div>
            
            <div className="p-6 space-y-8 max-h-[500px] overflow-y-auto">
              {updates.length === 0 ? (
                <p className="text-center text-zinc-500 py-10 text-sm italic">Nenhuma atualização registrada.</p>
              ) : (
                updates.map((update) => (
                  <div key={update.id} className="relative pl-8 border-l border-zinc-800">
                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700"></div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-zinc-100">{update.user?.full_name}</span>
                      <span className="text-[10px] text-zinc-500">{new Date(update.created_at).toLocaleString()}</span>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
                      <p className="text-sm text-zinc-400 whitespace-pre-wrap">{update.content}</p>
                      {update.new_status && (
                        <div className="mt-3 pt-3 border-t border-zinc-900 flex items-center text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                          Status alterado para: <span className="text-blue-500 ml-2">{update.new_status.replace('_', ' ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleUpdate} className="p-4 bg-zinc-950 border-t border-zinc-800">
              <textarea 
                rows={3}
                placeholder="Escreva uma atualização ou nota técnica..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none mb-3"
                value={newUpdate}
                onChange={(e) => setNewUpdate(e.target.value)}
              ></textarea>
              <div className="flex items-center justify-between">
                <select 
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none"
                  value={statusChange}
                  onChange={(e) => setStatusChange(e.target.value)}
                >
                  <option value="aberto">Aberto</option>
                  <option value="em_atendimento">Em Atendimento</option>
                  <option value="aguardando">Aguardando</option>
                  <option value="finalizado">Finalizado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center transition-all"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold mb-6 text-zinc-500 text-xs uppercase tracking-widest">Detalhes Operacionais</h3>
            <div className="space-y-5">
              <div className="flex items-start">
                <Building className="w-4 h-4 mt-0.5 text-zinc-500 mr-3 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Cliente</p>
                  <p className="text-sm text-zinc-200">{ticket.client?.name}</p>
                </div>
              </div>
              <div className="flex items-start">
                <User className="w-4 h-4 mt-0.5 text-zinc-500 mr-3 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Técnico Responsável</p>
                  <p className="text-sm text-zinc-200">{ticket.technician?.full_name || 'Não atribuído'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mt-0.5 text-zinc-500 mr-3 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Localização</p>
                  <p className="text-sm text-zinc-200">{ticket.location || 'Não informada'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-4 h-4 mt-0.5 text-zinc-500 mr-3 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Data de Abertura</p>
                  <p className="text-sm text-zinc-200">{new Date(ticket.opened_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold mb-4 text-zinc-500 text-xs uppercase tracking-widest">Ações Rápidas</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all">Imprimir Ordem de Serviço</button>
              <button className="w-full text-left p-3 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all">Anexar Fotos do Local</button>
              <button className="w-full text-left p-3 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all">Cancelar Chamado</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
