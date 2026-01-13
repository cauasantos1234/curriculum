// supabase-config.js - Configuração do Supabase para NewSong
// ============================================================
// ⚠️ NOTA IMPORTANTE SOBRE SEGURANÇA:
// A chave ANON do Supabase é PÚBLICA e pode estar no front-end.
// A segurança real vem do RLS (Row Level Security) configurado no Supabase.
// Para máxima segurança, configure políticas RLS no painel do Supabase.

// Configuração do Supabase
// Em produção, substitua estas credenciais pelas suas
const SUPABASE_CONFIG = {
  url: 'https://wbzaktlcxgmctocgtifj.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiemFrdGxjeGdtY3RvY2d0aWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NjEzNTEsImV4cCI6MjA4MTMzNzM1MX0.i3I01z8CT1l6kBPhNwk8bgRwJP4Jq5MO3Rn2dEsoJSM'
};

// Cliente Supabase (inicializado quando a biblioteca carregar)
let supabaseClient = null;

// Inicializar Supabase quando a biblioteca estiver disponível
function initSupabase() {
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(
      SUPABASE_CONFIG.url, 
      SUPABASE_CONFIG.anonKey
    );
    console.log('✅ Supabase inicializado com sucesso');
    return true;
  } else {
    console.warn('⚠️ Biblioteca Supabase ainda não carregada');
    return false;
  }
}

// Tentar inicializar imediatamente
if (!initSupabase()) {
  // Se falhar, aguardar um pouco e tentar novamente
  setTimeout(initSupabase, 500);
}

// API de conveniência
window.SupabaseAPI = {
  getClient: function() {
    if (!supabaseClient) {
      initSupabase();
    }
    return supabaseClient;
  },
  getConfig: function() {
    return SUPABASE_CONFIG;
  },
  isReady: function() {
    return supabaseClient !== null;
  }
};
