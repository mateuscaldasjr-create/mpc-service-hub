import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificação simples para te avisar no console se algo estiver errado
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Atenção: Variáveis do Supabase não encontradas. Verifique o painel da Vercel.");
}

// Usamos a 'anon key' para garantir que as regras de segurança (RLS) funcionem
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
