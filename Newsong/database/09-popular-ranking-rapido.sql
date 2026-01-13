-- =====================================================
-- SOLUÇÃO RÁPIDA: Popular Ranking com Dados de Exemplo
-- =====================================================

-- PASSO 1: Dar XP para TODOS os usuários existentes
-- Execute este comando para dar XP inicial a todos os usuários

INSERT INTO user_xp (user_id, total_xp, level, current_streak, longest_streak, last_activity_date)
SELECT 
  id as user_id,
  FLOOR(RANDOM() * 500 + 100)::INTEGER as total_xp, -- XP aleatório entre 100-600
  1 as level,
  FLOOR(RANDOM() * 10)::INTEGER as current_streak, -- Streak aleatório 0-10
  FLOOR(RANDOM() * 15)::INTEGER as longest_streak,
  CURRENT_DATE as last_activity_date
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- PASSO 2: Atualizar os níveis baseado no XP
UPDATE user_xp
SET level = calculate_level(total_xp);

-- PASSO 3: Registrar transações iniciais
INSERT INTO xp_transactions (user_id, xp_amount, action_type, description)
SELECT 
  user_id,
  total_xp,
  'initial_setup',
  'XP inicial do sistema'
FROM user_xp
WHERE user_id NOT IN (
  SELECT DISTINCT user_id FROM xp_transactions WHERE action_type = 'initial_setup'
);

-- PASSO 4: Verificar o ranking
SELECT * FROM ranking_by_xp LIMIT 10;

-- =====================================================
-- OU USE ESTA VERSÃO MAIS REALISTA:
-- =====================================================

/*
-- Dar XP baseado em quando o usuário foi criado (mais antigo = mais XP)
INSERT INTO user_xp (user_id, total_xp, level, current_streak, longest_streak, last_activity_date)
SELECT 
  id as user_id,
  CASE 
    WHEN created_at < NOW() - INTERVAL '30 days' THEN 800
    WHEN created_at < NOW() - INTERVAL '14 days' THEN 500
    WHEN created_at < NOW() - INTERVAL '7 days' THEN 300
    ELSE 100
  END as total_xp,
  1 as level,
  CASE 
    WHEN created_at < NOW() - INTERVAL '7 days' THEN FLOOR(RANDOM() * 5 + 3)::INTEGER
    ELSE FLOOR(RANDOM() * 3)::INTEGER
  END as current_streak,
  FLOOR(RANDOM() * 20)::INTEGER as longest_streak,
  CURRENT_DATE as last_activity_date
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- Atualizar níveis
UPDATE user_xp SET level = calculate_level(total_xp);

-- Registrar transações
INSERT INTO xp_transactions (user_id, xp_amount, action_type, description)
SELECT user_id, total_xp, 'initial_setup', 'XP inicial baseado em antiguidade'
FROM user_xp
WHERE user_id NOT IN (SELECT DISTINCT user_id FROM xp_transactions WHERE action_type = 'initial_setup');
*/

-- =====================================================
-- VERIFICAÇÕES
-- =====================================================

-- Ver quantos usuários têm XP
SELECT COUNT(*) as total_usuarios_com_xp FROM user_xp;

-- Ver o ranking completo
SELECT 
  rank,
  user_name,
  total_xp,
  level,
  current_streak
FROM ranking_by_xp;

-- Ver detalhes de um usuário específico (substitua o email)
SELECT 
  u.email,
  ux.total_xp,
  ux.level,
  ux.current_streak
FROM user_xp ux
JOIN auth.users u ON ux.user_id = u.id
WHERE u.email = 'seu_email@exemplo.com'; -- ALTERE AQUI
