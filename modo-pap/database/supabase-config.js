// Configuração do Supabase para NewSong
// Documentação: https://supabase.com/docs

export const supabaseConfig = {
  // ⚠️ IMPORTANTE: Substitua com suas credenciais do Supabase
  // 1. Acesse: https://supabase.com/dashboard
  // 2. Crie um novo projeto
  // 3. Vá em Settings → API
  // 4. Copie a URL e anon/public key
  
  url: 'YOUR_SUPABASE_URL', // Ex: https://xxxxxxxxxxx.supabase.co
  anonKey: 'YOUR_SUPABASE_ANON_KEY', // Key pública
  
  // Configurações de Storage
  storage: {
    bucketName: 'videos', // Nome do bucket para vídeos
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg']
  },
  
  // Configurações de Auth
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
};

// Para usar no código:
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
//   auth: supabaseConfig.auth
// })
