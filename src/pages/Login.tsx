import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      alert('Erro ao entrar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      {/* Efeito de fundo sutil */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[20%] w-[70%] h-[70%] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[20%] w-[70%] h-[70%] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Área da Logomarca */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/logo.png" 
            alt="MPC Service Hub Logo" 
            className="h-16 md:h-20 mb-4 object-contain"
            onError={(e) => {
              // Fallback caso a imagem não seja encontrada
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML += `<h1 class="text-3xl font-black text-white tracking-tighter">MPC <span class="text-blue-600">SERVICE HUB</span></h1>`;
            }}
          />
          <p className="text-zinc-400 text-sm text-center">Gestão Inteligente de Manutenção e Serviços</p>
        </div>

        {/* Formulário de Login */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 p-8 rounded-2xl shadow-2xl shadow-black/50 relative overflow-hidden">
          {/* Borda superior azul brilhante */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 opacity-80" />
          
          <h2 className="text-xl font-bold text-white mb-6 text-left">Acessar Conta</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-zinc-500 uppercase ml-1">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-xs font-bold text-zinc-500 uppercase ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all mt-6 shadow-lg shadow-blue-900/30"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Entrar no Sistema <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        </div>
        
        <p className="text-center text-zinc-500 text-xs mt-6">
          © {new Date().getFullYear()} MPC Comercio e Serviços. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
