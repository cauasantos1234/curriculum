-- =====================================================
-- SCRIPT PARA POPULAR XP DE USUÁRIOS EXISTENTES
-- =====================================================
-- Este script calcula e atribui XP aos usuários baseado em suas atividades existentes

-- Função para popular XP inicial dos usuários existentes
CREATE OR REPLACE FUNCTION populate_existing_users_xp()
RETURNS TEXT AS $$
DECLARE
  v_user RECORD;
  v_total_xp INTEGER;
  v_result TEXT := '';
  v_count INTEGER := 0;
BEGIN
  -- Iterar por todos os usuários que ainda não têm registro de XP
  FOR v_user IN 
    SELECT DISTINCT u.id, u.email
    FROM auth.users u
    LEFT JOIN user_xp ux ON u.id = ux.user_id
    WHERE ux.user_id IS NULL
  LOOP
    v_total_xp := 0;
    
    -- Calcular XP baseado em visualizações de vídeos
    -- Assumindo que cada visualização completa = 25 XP
    SELECT COUNT(*) * 25 INTO v_total_xp
    FROM video_views vv
    WHERE vv.user_id = v_user.id;
    
    -- Adicionar XP por vídeos salvos (2 XP cada)
    v_total_xp := v_total_xp + (
      SELECT COUNT(*) * 2
      FROM saved_videos sv
      WHERE sv.user_id = v_user.id
    );
    
    -- Adicionar XP por avaliações de professores (5 XP cada)
    v_total_xp := v_total_xp + (
      SELECT COUNT(*) * 5
      FROM teacher_ratings tr
      WHERE tr.user_id = v_user.id
    );
    
    -- Se o usuário tem alguma atividade, criar registro de XP
    IF v_total_xp > 0 THEN
      -- Criar registro de XP
      INSERT INTO user_xp (user_id, total_xp, level, current_streak, longest_streak, last_activity_date)
      VALUES (
        v_user.id,
        v_total_xp,
        calculate_level(v_total_xp),
        0, -- Streak inicial
        0, -- Maior streak inicial
        CURRENT_DATE
      );
      
      -- Registrar transação inicial
      INSERT INTO xp_transactions (user_id, xp_amount, action_type, description)
      VALUES (
        v_user.id,
        v_total_xp,
        'initial_migration',
        'XP inicial calculado baseado em atividades existentes'
      );
      
      v_count := v_count + 1;
      v_result := v_result || 'Usuário ' || v_user.email || ': ' || v_total_xp || ' XP | ';
    ELSE
      -- Criar registro com XP inicial de boas-vindas (10 XP)
      INSERT INTO user_xp (user_id, total_xp, level, current_streak, longest_streak, last_activity_date)
      VALUES (
        v_user.id,
        10,
        1,
        0,
        0,
        CURRENT_DATE
      );
      
      INSERT INTO xp_transactions (user_id, xp_amount, action_type, description)
      VALUES (
        v_user.id,
        10,
        'welcome_bonus',
        'Bônus de boas-vindas'
      );
      
      v_count := v_count + 1;
      v_result := v_result || 'Usuário ' || v_user.email || ': 10 XP (bônus) | ';
    END IF;
  END LOOP;
  
  RETURN 'Total de ' || v_count || ' usuários processados. ' || v_result;
END;
$$ LANGUAGE plpgsql;

-- Executar a função para popular XP dos usuários existentes
-- SELECT populate_existing_users_xp();

-- =====================================================
-- SCRIPT ALTERNATIVO: Popular XP manualmente para usuários específicos
-- =====================================================

-- Exemplo: Adicionar XP baseado em contagem de atividades
-- Descomentar e ajustar conforme necessário

/*
-- Para cada usuário com vídeos assistidos
INSERT INTO user_xp (user_id, total_xp, level, current_streak, longest_streak, last_activity_date)
SELECT 
  user_id,
  COUNT(*) * 25 as total_xp, -- 25 XP por vídeo assistido
  calculate_level(COUNT(*) * 25) as level,
  0 as current_streak,
  0 as longest_streak,
  CURRENT_DATE as last_activity_date
FROM video_views
GROUP BY user_id
ON CONFLICT (user_id) DO NOTHING;

-- Registrar transação para cada usuário
INSERT INTO xp_transactions (user_id, xp_amount, action_type, description)
SELECT 
  user_id,
  COUNT(*) * 25 as xp_amount,
  'initial_migration' as action_type,
  'XP inicial por vídeos assistidos' as description
FROM video_views
GROUP BY user_id;
*/

-- =====================================================
-- VERIFICAR RESULTADOS
-- =====================================================

-- Ver todos os usuários com XP
/*
SELECT 
  u.email,
  ux.total_xp,
  ux.level,
  ux.current_streak,
  ux.longest_streak
FROM user_xp ux
JOIN auth.users u ON ux.user_id = u.id
ORDER BY ux.total_xp DESC;
*/

-- Ver ranking atual
-- SELECT * FROM ranking_by_xp LIMIT 10;

-- Ver transações de XP
/*
SELECT 
  u.email,
  xt.xp_amount,
  xt.action_type,
  xt.description,
  xt.created_at
FROM xp_transactions xt
JOIN auth.users u ON xt.user_id = u.id
ORDER BY xt.created_at DESC
LIMIT 20;
*/

COMMENT ON FUNCTION populate_existing_users_xp IS 'Popula XP inicial para usuários existentes baseado em suas atividades';
