// Debug Supabase users (runs in Node, not browser)
// Usage (PowerShell):
//   $env:SUPABASE_SERVICE_ROLE="<sua_service_role_key>"; node debug-users.js
// Requer: npm install @supabase/supabase-js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wbzaktlcxgmctocgtifj.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE;

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Defina a variável de ambiente SUPABASE_SERVICE_ROLE com a service_role key.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
  console.log('🔍 Listando usuários do Supabase...');
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 200 });
  if (error) {
    console.error('❌ Erro ao listar usuários:', error.message);
    process.exit(1);
  }

  if (!data || !data.users || data.users.length === 0) {
    console.log('Nenhum usuário encontrado.');
    return;
  }

  console.log(`Encontrados ${data.users.length} usuário(s).`);
  data.users.forEach((u, idx) => {
    const role = u.user_metadata?.role || 'n/d';
    const name = u.user_metadata?.name || u.email?.split('@')[0] || 'sem nome';
    const confirmed = u.email_confirmed_at ? 'sim' : 'não';
    console.log(`\n${idx + 1}. ${name}`);
    console.log(`   Email: ${u.email}`);
    console.log(`   Tipo: ${role}`);
    console.log(`   Confirmado: ${confirmed}`);
    console.log(`   Criado em: ${u.created_at}`);
    if (u.last_sign_in_at) console.log(`   Último login: ${u.last_sign_in_at}`);
    console.log(`   ID: ${u.id}`);
  });
}

main().catch((err) => {
  console.error('❌ Erro inesperado:', err);
  process.exit(1);
});
