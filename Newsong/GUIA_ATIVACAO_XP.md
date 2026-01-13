# 🚀 Guia Rápido - Ativação do Sistema de XP e Ranking

## ⚡ Passos para Ativar

### 1️⃣ Executar SQL no Supabase (IMPORTANTE!)

1. Acesse seu projeto Supabase
2. Vá em **SQL Editor**
3. Crie uma nova query
4. Copie TODO o conteúdo do arquivo `database/07-xp-ranking-system.sql`
5. Cole no editor e clique em **Run**
6. Aguarde a execução (deve aparecer "Success")

**Verificar se funcionou:**
```sql
-- Execute esta query para verificar
SELECT * FROM user_xp LIMIT 1;
SELECT * FROM xp_transactions LIMIT 1;
```

### 1.5️⃣ Popular XP dos Usuários Existentes (NOVO!)

**OPÇÃO 1 - RÁPIDA (Recomendada para testar):**

Execute este SQL no Supabase para dar XP a todos os usuários imediatamente:

```sql
-- Copie e execute TODO este código de uma vez:

INSERT INTO user_xp (user_id, total_xp, level, current_streak, longest_streak, last_activity_date)
SELECT 
  id as user_id,
  FLOOR(RANDOM() * 500 + 100)::INTEGER as total_xp,
  1 as level,
  FLOOR(RANDOM() * 10)::INTEGER as current_streak,
  FLOOR(RANDOM() * 15)::INTEGER as longest_streak,
  CURRENT_DATE as last_activity_date
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

UPDATE user_xp SET level = calculate_level(total_xp);

INSERT INTO xp_transactions (user_id, xp_amount, action_type, description)
SELECT user_id, total_xp, 'initial_setup', 'XP inicial do sistema'
FROM user_xp;
```

**OPÇÃO 2 - BASEADA EM ATIVIDADES (Mais realista):**

1. No **SQL Editor** do Supabase
2. Copie o conteúdo de `database/08-populate-existing-users-xp.sql`
3. Cole e execute
4. Execute a função para popular os dados:

```sql
SELECT populate_existing_users_xp();
```

Isso vai:
- ✅ Calcular XP baseado em vídeos assistidos (25 XP cada)
- ✅ Adicionar XP por vídeos salvos (2 XP cada)  
- ✅ Adicionar XP por avaliações (5 XP cada)
- ✅ Criar registros de XP para todos os usuários
- ✅ Dar bônus de 10 XP para novos usuários

**Ver o resultado:**
```sql
-- Ver ranking atualizado
SELECT * FROM ranking_by_xp LIMIT 10;

-- Ver XP de todos os usuários
SELECT 
  u.email,
  ux.total_xp,
  ux.level
FROM user_xp ux
JOIN auth.users u ON ux.user_id = u.id
ORDER BY ux.total_xp DESC;
```

### 2️⃣ Verificar Arquivos (Já está pronto!)

Os seguintes arquivos já foram criados/modificados:

✅ `public/js/xp-system.js` - Sistema de XP
✅ `public/js/ranking-system.js` - Sistema de ranking  
✅ `public/css/styles.css` - Estilos adicionados no final
✅ `public/app.html` - Seção de ranking + scripts incluídos
✅ `public/js/user-progress.js` - Integração com XP
✅ `public/js/saved-videos.js` - Integração com XP

### 3️⃣ Testar o Sistema

1. **Faça login** na plataforma
   - Você ganhará automaticamente **10 XP** (bônus diário)

2. **Vá para a página inicial** (app.html)
   - Role até a seção "🏆 Ranking dos Melhores"
   - Você deve ver:
     - Seu card pessoal com XP e nível
     - Tabela de ranking (pode estar vazia se for o primeiro usuário)

3. **Teste ganhar XP:**
   - Assista um vídeo até o final → **+25 XP**
   - Salve um vídeo → **+2 XP**
   - Complete uma aula → **+50 XP**
   
4. **Observe as notificações:**
   - Uma notificação dourada aparecerá no canto superior direito
   - Mostra "+X XP" quando você ganha pontos
   - Se subir de nível, mostra notificação especial 🎉

### 4️⃣ Testar Streak (Dias Consecutivos)

1. Faça login hoje
2. Faça logout
3. No dia seguinte, faça login novamente
4. Seu streak deve aumentar para 1 dia
5. Continue fazendo login diariamente para aumentar o streak

**Bônus de Streak:**
- 3 dias seguidos → +20 XP 🔥
- 7 dias seguidos → +50 XP 🔥
- 30 dias seguidos → +200 XP 🔥
- 100 dias seguidos → +1000 XP 🔥

### 5️⃣ Verificar Ranking

Para aparecer no ranking, você precisa:
1. Ter XP > 0 (feito ao fazer login)
2. Outros usuários precisam ter XP para comparação

**Ver seu ranking:**
- Vá para a página inicial
- Encontre a seção "🏆 Ranking dos Melhores"
- Seu card mostra sua posição global

## 🎮 Como os Usuários Ganham XP

| Ação | XP Ganho |
|------|----------|
| Login diário (primeira atividade do dia) | +10 XP |
| Assistir 25% de um vídeo | +5 XP |
| Assistir 50% de um vídeo | +10 XP |
| Assistir 75% de um vídeo | +15 XP |
| Assistir vídeo completo (100%) | +25 XP |
| Completar uma aula | +50 XP |
| Completar módulo inteiro | +200 XP |
| Salvar um vídeo | +2 XP |
| Avaliar um professor | +5 XP |
| Streak de 3 dias | +20 XP (bônus) |
| Streak de 7 dias | +50 XP (bônus) |
| Streak de 30 dias | +200 XP (bônus) |
| Streak de 100 dias | +1000 XP (bônus) |

## 🎯 Níveis

| Nível | Nome | XP Necessário |
|-------|------|---------------|
| 1 | Iniciante | 0-100 |
| 2 | Aprendiz | 101-300 |
| 3 | Estudante | 301-600 |
| 4 | Dedicado | 601-1000 |
| 5 | Expert | 1001-1500 |
| 6+ | Mestre | +500 XP por nível |

## 🔍 Troubleshooting

### ❌ Problema: "Ranking não aparece"

**Solução:**
1. Abra o console do navegador (F12)
2. Verifique se há erros
3. Confirme que executou o SQL no Supabase
4. Recarregue a página (Ctrl + F5)

### ❌ Problema: "Não ganho XP ao fazer ações"

**Solução:**
1. Verifique se está logado
2. Abra o console (F12) e procure por erros
3. Confirme que o Supabase está conectado
4. Execute esta query no Supabase para testar:
```sql
SELECT * FROM user_xp WHERE user_id = 'SEU_USER_ID';
```

### ❌ Problema: "Notificações não aparecem"

**Solução:**
1. Confirme que `xp-system.js` está carregado (veja em app.html)
2. Verifique console do navegador
3. Teste manualmente no console:
```javascript
XPSystem.showXPNotification({ xp_gained: 10, total_xp: 100, level: 1, level_up: false });
```

### ❌ Problema: "Erro 'PGRST...' no console"

**Solução:**
1. Provavelmente as tabelas não foram criadas
2. Execute o SQL `07-xp-ranking-system.sql` novamente no Supabase
3. Verifique as políticas RLS no Supabase

## 📊 Monitoramento

### Ver todos os usuários com XP:
```sql
SELECT 
  u.email,
  ux.total_xp,
  ux.level,
  ux.current_streak
FROM user_xp ux
JOIN auth.users u ON ux.user_id = u.id
ORDER BY ux.total_xp DESC;
```

### Ver histórico de XP de um usuário:
```sql
SELECT 
  action_type,
  xp_amount,
  description,
  created_at
FROM xp_transactions
WHERE user_id = 'SEU_USER_ID'
ORDER BY created_at DESC
LIMIT 20;
```

### Ver ranking atual:
```sql
SELECT * FROM ranking_by_xp LIMIT 10;
```

## ✅ Checklist Final

- [ ] SQL executado no Supabase sem erros
- [ ] Arquivos JavaScript carregam sem erro no console
- [ ] Login dá bônus de 10 XP
- [ ] Notificação aparece ao ganhar XP
- [ ] Ranking aparece na página inicial
- [ ] Card pessoal mostra seus dados corretamente
- [ ] Completar aula dá 50 XP
- [ ] Salvar vídeo dá 2 XP

## 🎉 Pronto!

Se todos os itens acima estão funcionando, o sistema está 100% operacional!

Os usuários agora terão:
- Notificações visuais ao ganhar XP
- Sistema de níveis motivacional
- Ranking competitivo
- Streaks para engajamento diário
- Gamificação completa da plataforma

---

**Dúvidas?** Consulte `SISTEMA_XP_RANKING_README.md` para documentação completa.
