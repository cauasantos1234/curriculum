// supabase-config.js - Configuração do Supabase para NewSong

// 🔧 INSTRUÇÕES:
// 1. Crie uma conta em https://supabase.com (GRÁTIS)
// 2. Crie um novo projeto
// 3. Vá em Settings → API
// 4. Copie a URL e a chave anon/public
// 5. Cole abaixo substituindo os valores

const SUPABASE_URL = 'https://wbzaktlcxgmctocgtifj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiemFrdGxjeGdtY3RvY2d0aWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NjEzNTEsImV4cCI6MjA4MTMzNzM1MX0.i3I01z8CT1l6kBPhNwk8bgRwJP4Jq5MO3Rn2dEsoJSM';

// Aguardar que a biblioteca do Supabase carregue
let supabaseClient = null;

if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
  console.error('❌ Biblioteca do Supabase não carregada');
}

// API de conveniência
window.SupabaseAPI = {
  getClient: function() {
    return supabaseClient;
  }
};
