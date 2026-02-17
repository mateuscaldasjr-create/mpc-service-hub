import { createClient } from '@supabase/supabase-js';

// Função auxiliar para obter variáveis de ambiente de forma segura
// Evita erro "Cannot read properties of undefined" se import.meta.env não existir
const getEnvVar = (key: string, fallback: string): string => {
  try {
    // Casting import.meta to any to avoid TypeScript errors for Vite-specific properties
    const meta = import.meta as any;
    if (typeof meta !== 'undefined' && meta.env) {
      return meta.env[key] || fallback;
    }
  } catch (e) {
    // Silencioso: usa o fallback
  }
  return fallback;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'https://tnhkoafxzqvxfwdacxrn.supabase.co');
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuaGtvYWZ4enF2eGZ3ZGFjeHJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTIzOTMyOSwiZXhwIjoyMDg2ODE1MzI5fQ.0OUsUytgZS2TQoCiiKLzKBu7xuOhKq9hGUV0ktEdGUs');

export const supabase = createClient(supabaseUrl, supabaseKey);
