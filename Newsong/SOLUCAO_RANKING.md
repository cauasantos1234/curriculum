# 🔧 Correção do Sistema de Ranking

## Problema Identificado
O ranking não está funcionando devido a possíveis problemas:
1. ✅ Views do banco de dados (`ranking_by_xp`, `ranking_by_streak`) podem não estar criadas
2. ✅ Função `get_user_ranking()` pode não estar criada
3. ✅ Ordem de carregamento dos scripts corrigida
4. ✅ Tratamento de erros melhorado

## Arquivos Modificados
- ✅ [app.html](public/app.html) - Melhorado carregamento do ranking
- ✅ [ranking-system.js](public/js/ranking-system.js) - Adicionados logs de debug
- ✅ [fix-ranking-views.sql](database/fix-ranking-views.sql) - Script de correção (NOVO)

## 📋 Passo a Passo para Corrigir

### 1. Executar Script SQL no Supabase

1. Acesse o Supabase Dashboard: https://app.supabase.com
2. Vá para o seu projeto
3. Clique em **SQL Editor** no menu lateral
4. Clique em **New Query**
5. Copie todo o conteúdo do arquivo `database/fix-ranking-views.sql`
6. Cole no editor SQL
7. Clique em **RUN** (ou pressione Ctrl+Enter)

**O que o script faz:**
- ✅ Recria as views `ranking_by_xp` e `ranking_by_streak`
- ✅ Recria a função `get_user_ranking()`
- ✅ Testa as views e mostra quantos usuários existem
- ✅ Exibe os Top 5 de cada ranking

### 2. Verificar se Funcionou

Após executar o script, você verá mensagens como:
```
View ranking_by_xp criada com X registros
View ranking_by_streak criada com Y registros
```

Se aparecer **0 registros**, significa que:
- Não há usuários na tabela `user_xp`
- Você precisa popular os dados primeiro

### 3. Popular Dados de Teste (Se Necessário)

Se não houver usuários no ranking, execute um dos scripts:

**Opção A - Dados de Teste Rápidos:**
```sql
-- Execute no SQL Editor do Supabase
\i database/09-popular-ranking-rapido.sql
```

**Opção B - Usar Dados Existentes:**
```sql
-- Execute no SQL Editor do Supabase
\i database/08-populate-existing-users-xp.sql
```

### 4. Testar no Navegador

1. Abra o arquivo [app.html](public/app.html) no navegador
2. Abra o **Console do Desenvolvedor** (F12)
3. Procure por mensagens de log:
   - ✅ `Sistemas de ranking carregados`
   - ✅ `Carregando ranking tipo: xp`
   - ✅ `Rankings carregados: X usuários`

**Se ver erros como:**
- ❌ `relation "ranking_by_xp" does not exist` → Execute o fix-ranking-views.sql
- ❌ `function get_user_ranking(uuid) does not exist` → Execute o fix-ranking-views.sql
- ❌ `Rankings carregados: 0 usuários` → Popular dados de teste

### 5. Configurar Permissões (Se Necessário)

Se aparecer erro de permissão, execute no Supabase:

```sql
-- Permitir acesso anônimo às views de ranking
GRANT SELECT ON ranking_by_xp TO anon, authenticated;
GRANT SELECT ON ranking_by_streak TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_user_ranking(UUID) TO anon, authenticated;
```

## 🧪 Como Testar

### Teste 1: Verificar Views no Supabase
```sql
SELECT * FROM ranking_by_xp LIMIT 5;
SELECT * FROM ranking_by_streak LIMIT 5;
```

### Teste 2: Testar Função de Ranking
```sql
-- Substitua USER_ID_AQUI pelo ID de um usuário real
SELECT get_user_ranking('USER_ID_AQUI');
```

### Teste 3: No Console do Navegador
```javascript
// Teste 1: Verificar se sistemas carregaram
console.log('RankingSystem:', typeof RankingSystem);
console.log('XPSystem:', typeof XPSystem);
console.log('supabase:', typeof supabase);

// Teste 2: Buscar ranking
RankingSystem.getRankingByXP(5).then(data => {
  console.log('Ranking:', data);
});

// Teste 3: Buscar posição do usuário (se logado)
RankingSystem.getCurrentUserRanking().then(data => {
  console.log('Meu Ranking:', data);
});
```

## 📊 Estrutura Esperada dos Dados

### ranking_by_xp
```
rank | user_id | total_xp | level | user_name | current_streak
-----|---------|----------|-------|-----------|---------------
  1  | uuid... | 5000     |   6   | João      | 15
  2  | uuid... | 3500     |   5   | Maria     | 8
  3  | uuid... | 2100     |   4   | Pedro     | 3
```

### ranking_by_streak
```
rank | user_id | current_streak | total_xp | user_name
-----|---------|----------------|----------|----------
  1  | uuid... | 30             | 4000     | Ana
  2  | uuid... | 15             | 5000     | João
  3  | uuid... | 12             | 2800     | Carlos
```

## ❓ Problemas Comuns

### 1. "Nenhum usuário no ranking"
**Solução:** Execute o script de popular dados:
```bash
database/09-popular-ranking-rapido.sql
```

### 2. "Erro ao buscar ranking"
**Possíveis causas:**
- Views não criadas → Execute fix-ranking-views.sql
- Sem permissão → Execute GRANT acima
- Supabase offline → Verifique conexão

### 3. "Card do usuário não aparece"
**Solução:** 
- Faça login primeiro
- Certifique-se que seu usuário tem dados em `user_xp`

### 4. Ranking aparece vazio mas há usuários
**Solução:**
- Verifique se a coluna `user_name` está NULL
- Execute: 
```sql
UPDATE user_profiles 
SET nome = email 
WHERE nome IS NULL OR nome = '';
```

## 🎯 Checklist Final

- [ ] Executei fix-ranking-views.sql no Supabase
- [ ] Vejo mensagens de sucesso no SQL Editor
- [ ] Testei SELECT * FROM ranking_by_xp
- [ ] Há pelo menos 1 usuário no resultado
- [ ] Abri app.html no navegador
- [ ] Abri o Console (F12)
- [ ] Vejo logs de "Rankings carregados"
- [ ] O ranking aparece na tela
- [ ] Posso alternar entre "Por XP" e "Por Streak"

## 📞 Ainda com Problemas?

Se após seguir todos os passos o ranking ainda não funcionar:

1. **Tire um print do Console do navegador** (F12 → aba Console)
2. **Tire um print do resultado** de:
   ```sql
   SELECT * FROM ranking_by_xp LIMIT 3;
   SELECT * FROM user_xp LIMIT 3;
   ```
3. **Verifique se há erros** na aba Network do DevTools
