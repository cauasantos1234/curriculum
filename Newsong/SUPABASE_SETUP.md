# 🚀 Guia de Configuração do Supabase - NewSong

## Passo 1: Criar Conta no Supabase (5 minutos)

1. Acesse: https://supabase.com
2. Clique em **"Start your project"**
3. Faça login com GitHub ou email
4. É **100% GRATUITO** (até 500MB de banco de dados + 1GB de armazenamento)

## Passo 2: Criar Novo Projeto (2 minutos)

1. Clique em **"New Project"**
2. Preencha:
   - **Nome**: `newsong` (ou qualquer nome)
   - **Database Password**: Crie uma senha forte (ANOTE ESSA SENHA!)
   - **Region**: Escolha `South America (São Paulo)` para melhor performance
3. Clique em **"Create new project"**
4. Aguarde 2 minutos enquanto o projeto é criado

## Passo 3: Copiar Credenciais (1 minuto)

1. No painel do Supabase, vá em **Settings** (ícone de engrenagem) → **API**
2. Copie os seguintes valores:
   - **Project URL** (exemplo: `https://xxxxxxxxxxx.supabase.co`)
   - **anon/public key** (uma chave longa começando com `eyJ...`)

## Passo 4: Configurar no Projeto (2 minutos)

1. Abra o arquivo `supabase-config.js` (que eu vou criar)
2. Cole suas credenciais:
   ```javascript
   const SUPABASE_URL = 'SUA_URL_AQUI';
   const SUPABASE_KEY = 'SUA_CHAVE_AQUI';
   ```

## Passo 5: Criar Tabelas no Banco (5 minutos)

1. No Supabase, vá em **SQL Editor** (ícone de </> no menu lateral)
2. Clique em **"New query"**
3. Cole o SQL que está no arquivo `database/supabase-tables.sql`
4. Clique em **RUN** (botão verde)
5. Aguarde a mensagem de sucesso ✅

## Passo 6: Configurar Políticas de Segurança (3 minutos)

1. No mesmo **SQL Editor**, crie uma nova query
2. Cole o SQL que está no arquivo `database/supabase-policies.sql`
3. Clique em **RUN**

## Passo 7: Testar Conexão (1 minuto)

1. Abra o site no navegador
2. Abra o Console (F12)
3. Você deve ver: `✅ Supabase conectado com sucesso!`

---

## 📊 O que você terá depois:

### ✅ Banco de Dados Persistente
- Vídeos nunca mais serão perdidos
- Funciona em qualquer dispositivo
- Sincronização automática

### ✅ Estrutura de Tabelas

**1. `videos`** - Vídeos postados
```
- id, title, description, url, thumbnail
- instrument, module, lesson_id
- uploaded_by, uploaded_by_name
- created_at, views
```

**2. `saved_videos`** - Vídeos salvos por usuário
```
- id, user_id, video_id
- saved_at
```

**3. `video_views`** - Visualizações
```
- id, video_id, user_id, viewed_at
```

**4. `users`** - Perfis de usuários
```
- id, email, name, role (student/teacher)
- created_at
```

---

## 🆘 Problemas Comuns

### "Invalid API key"
- Verifique se copiou a chave **anon/public** (não a service_role)
- Certifique-se que não tem espaços extras

### "Tabelas não aparecem"
- Verifique se o SQL rodou sem erros
- No Supabase, vá em **Table Editor** para ver as tabelas criadas

### "Não consigo inserir dados"
- Execute o arquivo `supabase-policies.sql` para configurar permissões

---

## 📞 Próximos Passos

Depois de configurar, os arquivos JavaScript serão automaticamente atualizados para usar o Supabase!

**Tempo total: ~20 minutos** ⏱️
