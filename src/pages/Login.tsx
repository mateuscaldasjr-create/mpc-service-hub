
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { LogIn, Lock, Mail, AlertCircle, ShieldCheck, Wrench, Building2 } from 'lucide-react';
import { UserRole } from '../types';

interface LoginProps {
  onDemoLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onDemoLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Falha na autenticação. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 bg-blue-600 rounded-2xl items-center justify-center font-bold text-3xl shadow-2xl shadow-blue-900/40 mb-6 text-white">M</div>
          <h1 className="text-3xl font-bold tracking-tight text-white">MPC SERVICE HUB</h1>
          <p className="text-zinc-500 mt-2">Portal de Gerenciamento de Infraestrutura</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mr-3 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="email" 
                  required
                  placeholder="admin@mpc.com.br"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between pl-1 pr-1">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Sua Senha</label>
                <a href="#" className="text-xs text-blue-500 hover:text-blue-400 font-medium">Esqueceu?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {loading ? 'Acessando...' : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar no Sistema
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-800">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center mb-4">Acesso de Demonstração</p>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => onDemoLogin('admin')}
                className="flex flex-col items-center justify-center p-3 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-red-500/50 hover:bg-red-500/5 group transition-all"
              >
                <ShieldCheck className="w-5 h-5 text-zinc-500 group-hover:text-red-500 mb-2" />
                <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white uppercase">Admin</span>
              </button>
              <button 
                onClick={() => onDemoLogin('tecnico')}
                className="flex flex-col items-center justify-center p-3 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/5 group transition-all"
              >
                <Wrench className="w-5 h-5 text-zinc-500 group-hover:text-blue-500 mb-2" />
                <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white uppercase">Técnico</span>
              </button>
              <button 
                onClick={() => onDemoLogin('cliente')}
                className="flex flex-col items-center justify-center p-3 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-amber-500/50 hover:bg-amber-500/5 group transition-all"
              >
                <Building2 className="w-5 h-5 text-zinc-500 group-hover:text-amber-500 mb-2" />
                <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white uppercase">Cliente</span>
              </button>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-zinc-600 text-xs">
          © 2024 MPC Comércio e Serviços LTDA. <br/>
          Tecnologia aplicada à manutenção.
        </p>
      </div>
    </div>
  );
};

export default Login;
