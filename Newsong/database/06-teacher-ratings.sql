-- ============================================
-- SISTEMA DE AVALIAÇÕES DE PROFESSORES
-- Tabela para armazenar avaliações com estrelas
-- Data: 2025-12-04
-- ============================================

-- Criar tabela de avaliações
CREATE TABLE IF NOT EXISTS teacher_ratings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL,
  teacher_name VARCHAR(255) NOT NULL,
  lesson_id INTEGER NOT NULL,
  video_id INTEGER,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir que cada usuário avalie apenas uma vez por professor/aula
  UNIQUE(user_email, teacher_name, lesson_id)
);

-- Índices para melhorar performance
CREATE INDEX idx_teacher_ratings_teacher ON teacher_ratings(teacher_name);
CREATE INDEX idx_teacher_ratings_user ON teacher_ratings(user_email);
CREATE INDEX idx_teacher_ratings_lesson ON teacher_ratings(lesson_id);
CREATE INDEX idx_teacher_ratings_rating ON teacher_ratings(rating);
CREATE INDEX idx_teacher_ratings_created ON teacher_ratings(created_at DESC);

-- ============================================
-- FUNÇÃO: Calcular média de avaliações do professor
-- ============================================
CREATE OR REPLACE FUNCTION calculate_teacher_avg_rating(p_teacher_name VARCHAR)
RETURNS NUMERIC AS $$
DECLARE
  v_avg NUMERIC;
BEGIN
  SELECT COALESCE(AVG(rating), 0)
  INTO v_avg
  FROM teacher_ratings
  WHERE teacher_name = p_teacher_name;
  
  RETURN ROUND(v_avg, 2);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNÇÃO: Obter estatísticas de avaliação do professor
-- ============================================
CREATE OR REPLACE FUNCTION get_teacher_rating_stats(p_teacher_name VARCHAR)
RETURNS TABLE(
  avg_rating NUMERIC,
  total_ratings BIGINT,
  rating_5 BIGINT,
  rating_4 BIGINT,
  rating_3 BIGINT,
  rating_2 BIGINT,
  rating_1 BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    calculate_teacher_avg_rating(p_teacher_name) as avg_rating,
    COUNT(*) as total_ratings,
    COUNT(*) FILTER (WHERE rating = 5) as rating_5,
    COUNT(*) FILTER (WHERE rating = 4) as rating_4,
    COUNT(*) FILTER (WHERE rating = 3) as rating_3,
    COUNT(*) FILTER (WHERE rating = 2) as rating_2,
    COUNT(*) FILTER (WHERE rating = 1) as rating_1
  FROM teacher_ratings
  WHERE teacher_name = p_teacher_name;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Atualizar teacher_stats quando avaliação é adicionada
-- ============================================
CREATE OR REPLACE FUNCTION update_teacher_stats_on_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar avg_rating na tabela teacher_stats
  UPDATE teacher_stats
  SET 
    avg_rating = calculate_teacher_avg_rating(NEW.teacher_name),
    updated_at = NOW()
  WHERE user_id = (
    SELECT id FROM users WHERE name = NEW.teacher_name LIMIT 1
  );
  
  -- Se não existir registro, criar um
  IF NOT FOUND THEN
    INSERT INTO teacher_stats (user_id, avg_rating, updated_at)
    SELECT id, calculate_teacher_avg_rating(NEW.teacher_name), NOW()
    FROM users
    WHERE name = NEW.teacher_name
    LIMIT 1;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_teacher_stats_on_rating
AFTER INSERT OR UPDATE ON teacher_ratings
FOR EACH ROW
EXECUTE FUNCTION update_teacher_stats_on_rating();

-- ============================================
-- VIEW: Avaliações recentes
-- ============================================
CREATE OR REPLACE VIEW recent_teacher_ratings AS
SELECT 
  tr.id,
  tr.teacher_name,
  tr.user_email,
  tr.rating,
  tr.comment,
  tr.lesson_id,
  tr.created_at,
  u.name as user_name,
  u.avatar_url as user_avatar
FROM teacher_ratings tr
LEFT JOIN users u ON tr.user_id = u.id
ORDER BY tr.created_at DESC
LIMIT 100;

-- ============================================
-- CONSULTAS ÚTEIS
-- ============================================

-- Ver todas as avaliações de um professor
-- SELECT * FROM teacher_ratings WHERE teacher_name = 'Mariana Silva' ORDER BY created_at DESC;

-- Ver estatísticas de um professor
-- SELECT * FROM get_teacher_rating_stats('Mariana Silva');

-- Ver média de avaliação de um professor
-- SELECT calculate_teacher_avg_rating('Mariana Silva');

-- Listar professores com melhor avaliação
-- SELECT 
--   teacher_name,
--   calculate_teacher_avg_rating(teacher_name) as avg_rating,
--   COUNT(*) as total_ratings
-- FROM teacher_ratings
-- GROUP BY teacher_name
-- HAVING COUNT(*) >= 3
-- ORDER BY avg_rating DESC;

-- Ver distribuição de estrelas de um professor
-- SELECT 
--   rating,
--   COUNT(*) as count,
--   ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
-- FROM teacher_ratings
-- WHERE teacher_name = 'Mariana Silva'
-- GROUP BY rating
-- ORDER BY rating DESC;

COMMENT ON TABLE teacher_ratings IS 'Armazena avaliações com estrelas (1-5) dos professores pelos alunos';
COMMENT ON COLUMN teacher_ratings.rating IS 'Avaliação de 1 a 5 estrelas';
COMMENT ON COLUMN teacher_ratings.comment IS 'Comentário opcional do aluno sobre o professor';
COMMENT ON FUNCTION calculate_teacher_avg_rating IS 'Calcula a média de avaliações de um professor';
COMMENT ON FUNCTION get_teacher_rating_stats IS 'Retorna estatísticas completas de avaliação de um professor';
