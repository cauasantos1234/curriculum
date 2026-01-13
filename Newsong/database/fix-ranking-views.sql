-- =====================================================
-- Script de correção para Views de Ranking
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- Verificar se as views existem
DO $$
BEGIN
  RAISE NOTICE 'Verificando views de ranking...';
END $$;

-- =====================================================
-- VIEW: Ranking Global por XP
-- =====================================================
DROP VIEW IF EXISTS ranking_by_xp CASCADE;

CREATE OR REPLACE VIEW ranking_by_xp AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY ux.total_xp DESC, ux.created_at ASC) as rank,
  ux.user_id,
  ux.total_xp,
  ux.level,
  ux.current_streak,
  ux.longest_streak,
  COALESCE(up.nome, u.email) as user_name,
  u.email as user_email,
  up.avatar_url
FROM user_xp ux
LEFT JOIN auth.users u ON ux.user_id = u.id
LEFT JOIN user_profiles up ON ux.user_id = up.id
ORDER BY ux.total_xp DESC, ux.created_at ASC
LIMIT 100;

-- =====================================================
-- VIEW: Ranking por Streak
-- =====================================================
DROP VIEW IF EXISTS ranking_by_streak CASCADE;

CREATE OR REPLACE VIEW ranking_by_streak AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY ux.current_streak DESC, ux.total_xp DESC) as rank,
  ux.user_id,
  ux.current_streak,
  ux.longest_streak,
  ux.total_xp,
  ux.level,
  COALESCE(up.nome, u.email) as user_name,
  u.email as user_email,
  up.avatar_url
FROM user_xp ux
LEFT JOIN auth.users u ON ux.user_id = u.id
LEFT JOIN user_profiles up ON ux.user_id = up.id
WHERE ux.current_streak > 0
ORDER BY ux.current_streak DESC, ux.total_xp DESC
LIMIT 100;

-- =====================================================
-- FUNÇÃO: Buscar ranking do usuário
-- =====================================================
DROP FUNCTION IF EXISTS get_user_ranking(UUID);

CREATE OR REPLACE FUNCTION get_user_ranking(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_xp_rank INTEGER;
  v_streak_rank INTEGER;
  v_user_data RECORD;
BEGIN
  -- Buscar dados do usuário
  SELECT * INTO v_user_data FROM user_xp WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', FALSE, 'error', 'User not found');
  END IF;
  
  -- Calcular posição no ranking de XP
  SELECT COUNT(*) + 1 INTO v_xp_rank
  FROM user_xp
  WHERE total_xp > v_user_data.total_xp
     OR (total_xp = v_user_data.total_xp AND created_at < v_user_data.created_at);
  
  -- Calcular posição no ranking de streak
  SELECT COUNT(*) + 1 INTO v_streak_rank
  FROM user_xp
  WHERE current_streak > v_user_data.current_streak
     OR (current_streak = v_user_data.current_streak AND total_xp > v_user_data.total_xp);
  
  RETURN json_build_object(
    'success', TRUE,
    'xp_rank', v_xp_rank,
    'streak_rank', v_streak_rank,
    'total_xp', v_user_data.total_xp,
    'level', v_user_data.level,
    'current_streak', v_user_data.current_streak,
    'longest_streak', v_user_data.longest_streak
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Testar as views
-- =====================================================
DO $$
DECLARE
  v_xp_count INTEGER;
  v_streak_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_xp_count FROM ranking_by_xp;
  SELECT COUNT(*) INTO v_streak_count FROM ranking_by_streak;
  
  RAISE NOTICE 'View ranking_by_xp criada com % registros', v_xp_count;
  RAISE NOTICE 'View ranking_by_streak criada com % registros', v_streak_count;
  
  IF v_xp_count = 0 THEN
    RAISE WARNING 'Nenhum usuário encontrado no ranking por XP!';
  END IF;
  
  IF v_streak_count = 0 THEN
    RAISE WARNING 'Nenhum usuário com streak ativo encontrado!';
  END IF;
END $$;

-- Verificar dados de exemplo
SELECT 'Top 5 do Ranking por XP:' as info;
SELECT rank, user_name, total_xp, level, current_streak 
FROM ranking_by_xp 
LIMIT 5;

SELECT 'Top 5 do Ranking por Streak:' as info;
SELECT rank, user_name, current_streak, total_xp, level 
FROM ranking_by_streak 
LIMIT 5;

-- =====================================================
-- Mensagem final
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Views de ranking criadas/atualizadas com sucesso!';
  RAISE NOTICE '✅ Função get_user_ranking criada/atualizada com sucesso!';
  RAISE NOTICE '📊 Execute SELECT * FROM ranking_by_xp; para ver o ranking';
END $$;
