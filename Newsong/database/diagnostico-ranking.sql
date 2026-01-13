-- =====================================================
-- DIAGNÓSTICO DO RANKING
-- Execute este script para investigar problemas
-- =====================================================

-- 1. Verificar se as views existem
SELECT 'VERIFICANDO VIEWS...' as status;

SELECT 
  viewname as view_name,
  definition as view_definition
FROM pg_views 
WHERE viewname IN ('ranking_by_xp', 'ranking_by_streak')
ORDER BY viewname;

-- 2. Verificar usuários na tabela user_xp
SELECT 'USUÁRIOS NA TABELA user_xp:' as status;

SELECT 
  user_id,
  total_xp,
  level,
  current_streak,
  longest_streak,
  last_activity,
  created_at,
  updated_at
FROM user_xp
ORDER BY total_xp DESC
LIMIT 10;

-- 3. Verificar dados brutos do ranking
SELECT 'RANKING BRUTO (sem JOIN):' as status;

SELECT 
  ROW_NUMBER() OVER (ORDER BY ux.total_xp DESC, ux.created_at ASC) as rank,
  ux.user_id,
  ux.total_xp,
  ux.level,
  ux.current_streak
FROM user_xp ux
ORDER BY ux.total_xp DESC
LIMIT 10;

-- 4. Verificar JOIN com auth.users
SELECT 'RANKING COM EMAIL:' as status;

SELECT 
  ROW_NUMBER() OVER (ORDER BY ux.total_xp DESC, ux.created_at ASC) as rank,
  ux.user_id,
  ux.total_xp,
  ux.level,
  ux.current_streak,
  u.email
FROM user_xp ux
LEFT JOIN auth.users u ON ux.user_id = u.id
ORDER BY ux.total_xp DESC
LIMIT 10;

-- 5. Verificar JOIN com user_profiles
SELECT 'RANKING COM PERFIL:' as status;

SELECT 
  ROW_NUMBER() OVER (ORDER BY ux.total_xp DESC, ux.created_at ASC) as rank,
  ux.user_id,
  ux.total_xp,
  ux.level,
  ux.current_streak,
  u.email,
  up.nome,
  up.avatar_url,
  COALESCE(up.nome, u.email) as user_name
FROM user_xp ux
LEFT JOIN auth.users u ON ux.user_id = u.id
LEFT JOIN user_profiles up ON ux.user_id = up.id
ORDER BY ux.total_xp DESC
LIMIT 10;

-- 6. Testar a VIEW ranking_by_xp
SELECT 'TESTANDO VIEW ranking_by_xp:' as status;

SELECT * FROM ranking_by_xp LIMIT 10;

-- 7. Testar a VIEW ranking_by_streak
SELECT 'TESTANDO VIEW ranking_by_streak:' as status;

SELECT * FROM ranking_by_streak LIMIT 10;

-- 8. Verificar permissões nas views
SELECT 'PERMISSÕES DAS VIEWS:' as status;

SELECT 
  schemaname,
  viewname,
  viewowner
FROM pg_views
WHERE viewname IN ('ranking_by_xp', 'ranking_by_streak');

-- 9. Verificar se a função get_user_ranking existe
SELECT 'VERIFICANDO FUNÇÃO get_user_ranking:' as status;

SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines
WHERE routine_name = 'get_user_ranking';

-- 10. Contar registros
SELECT 'CONTAGEM DE REGISTROS:' as status;

SELECT 
  'user_xp' as tabela,
  COUNT(*) as total
FROM user_xp
UNION ALL
SELECT 
  'ranking_by_xp' as tabela,
  COUNT(*) as total
FROM ranking_by_xp
UNION ALL
SELECT 
  'ranking_by_streak' as tabela,
  COUNT(*) as total
FROM ranking_by_streak;

-- 11. Verificar histórico de XP (últimas ações)
SELECT 'ÚLTIMAS AÇÕES DE XP:' as status;

SELECT 
  xh.user_id,
  u.email,
  xh.xp_amount,
  xh.action_type,
  xh.description,
  xh.created_at
FROM xp_history xh
LEFT JOIN auth.users u ON xh.user_id = u.id
ORDER BY xh.created_at DESC
LIMIT 20;

-- 12. Verificar políticas RLS
SELECT 'POLÍTICAS RLS:' as status;

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('user_xp', 'xp_history')
ORDER BY tablename, policyname;

-- RESULTADO FINAL
SELECT '
=====================================================
DIAGNÓSTICO COMPLETO
=====================================================

Se você não vê dados nas views mas vê na tabela user_xp:
1. Execute o script fix-ranking-views.sql
2. Dê permissões: GRANT SELECT ON ranking_by_xp TO anon, authenticated;

Se você não vê dados na tabela user_xp:
1. Verifique se você está logado
2. Execute uma ação que dá XP (assistir vídeo, etc)
3. Verifique a tabela xp_history

Se você vê dados mas o frontend não mostra:
1. Abra o Console do navegador (F12)
2. Procure por erros em vermelho
3. Execute: RankingSystem.getRankingByXP(10)
4. Veja o resultado

' as instrucoes;
