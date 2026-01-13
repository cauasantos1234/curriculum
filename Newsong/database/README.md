# 🗄️ Guia de Setup do Banco de Dados - NewSong

Este guia ensina como configurar o banco de dados Supabase para o projeto NewSong.

---

## 📋 Pré-requisitos

- [ ] Conta no Supabase (gratuita): https://supabase.com
- [ ] Node.js instalado (v16+)
- [ ] Git instalado

---

## 🚀 Passo 1: Criar Projeto no Supabase

### 1.1. Acessar Supabase
1. Acesse: https://supabase.com/dashboard
2. Clique em "New Project"
3. Preencha:
   - **Project Name**: `newsong`
   - **Database Password**: Crie uma senha forte (anote!)
   - **Region**: Escolha a mais próxima (ex: São Paulo)
   - **Pricing Plan**: Free (suficiente para começar)

4. Clique em "Create new project"
5. Aguarde 2-3 minutos para provisionar

### 1.2. Obter Credenciais
1. No dashboard do projeto, vá em **Settings** → **API**
2. Anote:
   - **Project URL**: `https://xxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: (⚠️ Mantenha SECRETO!)

---

## 🗃️ Passo 2: Executar Schema SQL

### 2.1. Abrir SQL Editor
1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em "New Query"

### 2.2. Copiar e Executar Schema
1. Abra o arquivo: `database/schema.sql`
2. Copie TODO o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** (ou pressione `Ctrl+Enter`)
5. Aguarde ~30 segundos
6. Verifique se apareceu "Success. No rows returned"

### 2.3. Verificar Tabelas Criadas
Execute esta query para confirmar:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Você deve ver 14 tabelas:
- achievements
- comments
- favorites
- instruments
- lessons
- modules
- notifications
- user_achievements
- user_progress
- user_streaks
- users
- video_ratings
- video_views
- videos

---

## 📦 Passo 3: Configurar Storage (Armazenamento)

### 3.1. Executar Storage Setup
1. No SQL Editor, crie uma **New Query**
2. Abra o arquivo: `database/storage-setup.sql`
3. Copie TODO o conteúdo
4. Cole e execute (**Run**)

### 3.2. Verificar Buckets
1. Vá em **Storage** no menu lateral
2. Você deve ver 3 buckets criados:
   - ✅ `videos` (para vídeos)
   - ✅ `thumbnails` (para miniaturas)
   - ✅ `avatars` (para fotos de perfil)

### 3.3. Configurar Limites de Tamanho
1. Clique em cada bucket
2. Vá em **Settings**
3. Configure:
   - **videos**: Max file size = 100MB
   - **thumbnails**: Max file size = 5MB
   - **avatars**: Max file size = 2MB

---

## 🔑 Passo 4: Configurar Autenticação

### 4.1. Ativar Providers
1. Vá em **Authentication** → **Providers**
2. Ative:
   - ✅ **Email** (já vem ativo)
   - ✅ **Google** (opcional, mas recomendado)

### 4.2. Configurar Email Templates
1. Vá em **Authentication** → **Email Templates**
2. Personalize os templates:
   - Confirm Signup
   - Reset Password
   - Magic Link

### 4.3. Configurar Redirect URLs
1. Vá em **Authentication** → **URL Configuration**
2. Adicione suas URLs:
```
Site URL: http://localhost:8000
Redirect URLs: 
  http://localhost:8000/app.html
  http://localhost:8000/login.html
```

---

## ⚙️ Passo 5: Atualizar Código do Projeto

### 5.1. Instalar Dependências
```bash
cd modo-pap
npm install @supabase/supabase-js
```

### 5.2. Criar arquivo .env
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5.3. Atualizar supabase-config.js
Abra `database/supabase-config.js` e substitua:
```javascript
url: 'YOUR_SUPABASE_URL', // Cole a URL do seu projeto
anonKey: 'YOUR_SUPABASE_ANON_KEY', // Cole a anon key
```

---

## 🧪 Passo 6: Testar Conexão

### 6.1. Criar arquivo de teste
Crie `database/test-connection.js`:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'SUA_URL_AQUI',
  'SUA_ANON_KEY_AQUI'
)

async function testConnection() {
  // Testar query simples
  const { data, error } = await supabase
    .from('instruments')
    .select('*')
    
  if (error) {
    console.error('❌ Erro:', error)
  } else {
    console.log('✅ Conexão OK! Instrumentos:', data)
  }
}

testConnection()
```

### 6.2. Executar teste
```bash
node database/test-connection.js
```

Deve retornar os 5 instrumentos (Guitarra, Bateria, etc.)

---

## 📊 Passo 7: Popular Dados Iniciais

### 7.1. Dados já incluídos no schema.sql
Ao executar o schema, já foram criados:
- ✅ 5 Instrumentos
- ✅ 3 Módulos (Bronze, Prata, Ouro)
- ✅ 5 Aulas de Guitarra (Módulo 1)
- ✅ 6 Conquistas/Badges
- ✅ 2 Usuários de teste

### 7.2. Usuários de teste
**Email**: `test@newsong.com`  
**Senha**: `test123`

**Email**: `teacher@newsong.com`  
**Senha**: `test123`

⚠️ **IMPORTANTE**: Troque as senhas em produção!

---

## 🔐 Passo 8: Configurar Row Level Security (RLS)

As políticas RLS já foram criadas no schema.sql. Para verificar:

1. Vá em **Authentication** → **Policies**
2. Você deve ver políticas para:
   - users (ver e editar próprios dados)
   - user_progress (gerenciar próprio progresso)
   - videos (ver públicos, criar próprios)
   - comments (criar e gerenciar próprios)

---

## 📈 Passo 9: Verificar Dashboard

### 9.1. Acessar Table Editor
1. Vá em **Table Editor**
2. Clique em cada tabela
3. Verifique os dados iniciais

### 9.2. Verificar Storage
1. Vá em **Storage**
2. Clique em `videos`
3. Tente fazer upload de um arquivo de teste

---

## 🎯 Passo 10: Próximos Passos

### Para Desenvolvimento:
- [ ] Integrar autenticação no frontend
- [ ] Criar funções de upload de vídeo
- [ ] Implementar sistema de progresso
- [ ] Criar dashboard de analytics

### Para Produção:
- [ ] Configurar domínio customizado
- [ ] Ativar backups automáticos
- [ ] Configurar alertas de uso
- [ ] Implementar rate limiting
- [ ] Adicionar monitoring (Sentry, etc)

---

## 📚 Recursos Úteis

### Documentação Oficial
- Supabase Docs: https://supabase.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Supabase JS Client: https://supabase.com/docs/reference/javascript

### Tutoriais Recomendados
- Auth com Supabase: https://supabase.com/docs/guides/auth
- Storage: https://supabase.com/docs/guides/storage
- Realtime: https://supabase.com/docs/guides/realtime

### Queries SQL Prontas
- Veja: `database/useful-queries.sql`

---

## ⚠️ Troubleshooting

### Erro: "relation already exists"
**Solução**: Você já executou o schema antes. Opções:
1. Deletar todas as tabelas e executar novamente
2. Ou executar apenas as partes que faltam

### Erro: "permission denied for table"
**Solução**: Verifique as políticas RLS em Authentication → Policies

### Storage não funciona
**Solução**: 
1. Verifique se os buckets foram criados
2. Confirme as políticas de storage
3. Veja o console do navegador (F12) para erros

### Não consigo fazer login
**Solução**:
1. Verifique se o email está confirmado
2. Vá em Authentication → Users e confirme manualmente
3. Ou desative confirmação de email em Settings

---

## 💰 Limites do Free Tier

| Recurso | Limite Free | O que fazer se exceder |
|---------|-------------|------------------------|
| Database | 500MB | Upgrade para Pro ($25/mês) |
| Storage | 1GB | Deletar vídeos antigos ou usar YouTube |
| Bandwidth | 2GB/mês | Otimizar queries, usar CDN |
| Auth Users | Ilimitado | ✅ Sem limite |
| API Requests | 50,000/mês | Implementar cache |

---

## 🎉 Setup Completo!

Se você chegou até aqui, seu banco de dados está pronto! 🚀

**Próximo passo**: Integrar o Supabase no código JavaScript do frontend.

Veja o arquivo `database/integration-guide.md` para instruções de integração.

---

## 📞 Suporte

- Discord do Supabase: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase/issues
- Stack Overflow: Tag `supabase`

---

**Criado por**: NewSong Development Team  
**Última atualização**: 03/11/2025  
**Versão do Schema**: 1.0.0
