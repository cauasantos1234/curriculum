-- =====================================================
-- SISTEMA DE XP E RANKING - NewSong
-- =====================================================
-- Este arquivo cria tabelas e funções para o sistema de XP e ranking

-- =====================================================
-- TABELA: user_xp
-- Armazena XP total, nível e streak de cada usuário
-- =====================================================
CREATE TABLE IF NOT EXISTS user_xp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_xp INTEGER DEFAULT 0 NOT NULL,
  level INTEGER DEFAULT 1 NOT NULL,
  current_streak INTEGER DEFAULT 0 NOT NULL,
  longest_streak INTEGER DEFAULT 0 NOT NULL,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_xp_user_id ON user_xp(user_id);
CREATE INDEX IF NOT EXISTS idx_user_xp_total_xp ON user_xp(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_user_xp_current_streak ON user_xp(current_streak DESC);

-- =====================================================
-- TABELA: xp_transactions
-- Registra cada ganho de XP para auditoria e histórico
-- =====================================================
CREATE TABLE IF NOT EXISTS xp_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  xp_amount INTEGER NOT NULL,
  action_type VARCHAR(50) NOT NULL, -- 'video_watch', 'lesson_complete', 'daily_bonus', etc
  reference_id UUID, -- ID do vídeo, aula, etc
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_id ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_created_at ON xp_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_action_type ON xp_transactions(action_type);

-- =====================================================
-- FUNÇÃO: Calcular nível baseado em XP
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
DECLARE
  calculated_level INTEGER;
BEGIN
  -- Fórmula de níveis:
  -- Nível 1: 0-100 XP
  -- Nível 2: 101-300 XP
  -- Nível 3: 301-600 XP
  -- Nível 4: 601-1000 XP
  -- Nível 5: 1001-1500 XP
  -- Nível 6+: +500 XP por nível
  
  IF xp <= 100 THEN
    calculated_level := 1;
  ELSIF xp <= 300 THEN
    calculated_level := 2;
  ELSIF xp <= 600 THEN
    calculated_level := 3;
  ELSIF xp <= 1000 THEN
    calculated_level := 4;
  ELSIF xp <= 1500 THEN
    calculated_level := 5;
  ELSE
    calculated_level := 6 + FLOOR((xp - 1500) / 500);
  END IF;
  
  RETURN calculated_level;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNÇÃO: Adicionar XP ao usuário
-- =====================================================
CREATE OR REPLACE FUNCTION add_xp_to_user(
  p_user_id UUID,
  p_xp_amount INTEGER,
  p_action_type VARCHAR(50),
  p_reference_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_user_xp_record RECORD;
  v_new_total_xp INTEGER;
  v_new_level INTEGER;
  v_level_up BOOLEAN := FALSE;
BEGIN
  -- Buscar ou criar registro de XP do usuário
  SELECT * INTO v_user_xp_record FROM user_xp WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    -- Criar novo registro
    INSERT INTO user_xp (user_id, total_xp, level, last_activity_date)
    VALUES (p_user_id, 0, 1, CURRENT_DATE)
    RETURNING * INTO v_user_xp_record;
  END IF;
  
  -- Calcular novo total de XP
  v_new_total_xp := v_user_xp_record.total_xp + p_xp_amount;
  v_new_level := calculate_level(v_new_total_xp);
  
  -- Verificar se subiu de nível
  IF v_new_level > v_user_xp_record.level THEN
    v_level_up := TRUE;
  END IF;
  
  -- Atualizar XP do usuário
  UPDATE user_xp
  SET 
    total_xp = v_new_total_xp,
    level = v_new_level,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Registrar transação
  INSERT INTO xp_transactions (user_id, xp_amount, action_type, reference_id, description)
  VALUES (p_user_id, p_xp_amount, p_action_type, p_reference_id, p_description);
  
  -- Retornar resultado
  RETURN json_build_object(
    'success', TRUE,
    'xp_gained', p_xp_amount,
    'total_xp', v_new_total_xp,
    'level', v_new_level,
    'level_up', v_level_up
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNÇÃO: Atualizar streak (dias consecutivos)
-- =====================================================
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_user_xp_record RECORD;
  v_new_streak INTEGER;
  v_streak_bonus INTEGER := 0;
  v_is_new_day BOOLEAN := FALSE;
BEGIN
  -- Buscar registro do usuário
  SELECT * INTO v_user_xp_record FROM user_xp WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    -- Criar novo registro
    INSERT INTO user_xp (user_id, current_streak, longest_streak, last_activity_date)
    VALUES (p_user_id, 1, 1, CURRENT_DATE)
    RETURNING * INTO v_user_xp_record;
    
    RETURN json_build_object(
      'success', TRUE,
      'streak', 1,
      'bonus_xp', 0,
      'is_new_day', TRUE
    );
  END IF;
  
  -- Verificar se é um novo dia
  IF v_user_xp_record.last_activity_date IS NULL OR v_user_xp_record.last_activity_date < CURRENT_DATE THEN
    v_is_new_day := TRUE;
    
    -- Verificar se manteve o streak (atividade ontem)
    IF v_user_xp_record.last_activity_date = CURRENT_DATE - INTERVAL '1 day' THEN
      v_new_streak := v_user_xp_record.current_streak + 1;
    ELSE
      -- Streak quebrado
      v_new_streak := 1;
    END IF;
    
    -- Calcular bônus de streak
    IF v_new_streak = 3 THEN
      v_streak_bonus := 20;
    ELSIF v_new_streak = 7 THEN
      v_streak_bonus := 50;
    ELSIF v_new_streak = 30 THEN
      v_streak_bonus := 200;
    ELSIF v_new_streak = 100 THEN
      v_streak_bonus := 1000;
    END IF;
    
    -- Atualizar streak
    UPDATE user_xp
    SET 
      current_streak = v_new_streak,
      longest_streak = GREATEST(longest_streak, v_new_streak),
      last_activity_date = CURRENT_DATE,
      total_xp = CASE WHEN v_streak_bonus > 0 THEN total_xp + v_streak_bonus ELSE total_xp END,
      level = calculate_level(CASE WHEN v_streak_bonus > 0 THEN total_xp + v_streak_bonus ELSE total_xp END),
      updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Se ganhou bônus, registrar transação
    IF v_streak_bonus > 0 THEN
      INSERT INTO xp_transactions (user_id, xp_amount, action_type, description)
      VALUES (p_user_id, v_streak_bonus, 'streak_bonus', 'Bônus de ' || v_new_streak || ' dias consecutivos');
    END IF;
  ELSE
    v_new_streak := v_user_xp_record.current_streak;
  END IF;
  
  RETURN json_build_object(
    'success', TRUE,
    'streak', v_new_streak,
    'bonus_xp', v_streak_bonus,
    'is_new_day', v_is_new_day
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEW: Ranking Global por XP
-- =====================================================
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
$$ LANGUAGE plpgsql;

-- =====================================================
-- POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver seus próprios dados de XP
CREATE POLICY "Users can view own XP data"
  ON user_xp FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuários podem ver dados de XP de outros (para ranking)
CREATE POLICY "Users can view all XP data for ranking"
  ON user_xp FOR SELECT
  USING (true);

-- Política: Sistema pode inserir/atualizar XP (via funções)
CREATE POLICY "Service role can manage XP"
  ON user_xp FOR ALL
  USING (true);

-- Política: Usuários podem ver suas próprias transações
CREATE POLICY "Users can view own transactions"
  ON xp_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Sistema pode inserir transações
CREATE POLICY "Service role can insert transactions"
  ON xp_transactions FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- DADOS INICIAIS / SEED
-- =====================================================
-- Os dados de XP serão criados automaticamente conforme usuários ganham XP

COMMENT ON TABLE user_xp IS 'Armazena XP, nível e streak de cada usuário';
COMMENT ON TABLE xp_transactions IS 'Histórico de todas as transações de XP';
COMMENT ON FUNCTION add_xp_to_user IS 'Adiciona XP ao usuário e registra a transação';
COMMENT ON FUNCTION update_user_streak IS 'Atualiza streak de dias consecutivos e concede bônus';
COMMENT ON FUNCTION calculate_level IS 'Calcula o nível baseado no XP total';
