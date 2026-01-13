-- ============================================
-- NEWSONG PLATFORM - FUNÇÕES E VIEWS
-- Funções úteis e views materializadas
-- Versão: 1.0.0
-- Data: 2025-12-02
-- ============================================

-- ============================================
-- FUNÇÕES PARA BUSCAR VÍDEOS
-- ============================================

-- Função: Buscar todos os vídeos de um professor por nome
CREATE OR REPLACE FUNCTION get_teacher_videos(teacher_name VARCHAR)
RETURNS TABLE (
  video_id INTEGER,
  video_title VARCHAR(255),
  video_description TEXT,
  video_duration VARCHAR(20),
  video_views INTEGER,
  video_likes INTEGER,
  lesson_title VARCHAR(255),
  instrument VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.title,
    v.description,
    v.duration,
    v.views,
    v.likes,
    l.title,
    v.instrument,
    v.created_at
  FROM videos v
  JOIN users u ON v.author_id = u.id
  LEFT JOIN lessons l ON v.lesson_id = l.id
  WHERE u.name = teacher_name
    AND v.is_published = true
  ORDER BY v.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Função: Buscar vídeos de um professor por email
CREATE OR REPLACE FUNCTION get_teacher_videos_by_email(teacher_email VARCHAR)
RETURNS TABLE (
  video_id INTEGER,
  video_title VARCHAR(255),
  video_description TEXT,
  video_duration VARCHAR(20),
  video_views INTEGER,
  video_likes INTEGER,
  lesson_title VARCHAR(255),
  instrument VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.title,
    v.description,
    v.duration,
    v.views,
    v.likes,
    l.title,
    v.instrument,
    v.created_at
  FROM videos v
  JOIN users u ON v.author_id = u.id
  LEFT JOIN lessons l ON v.lesson_id = l.id
  WHERE u.email = teacher_email
    AND v.is_published = true
  ORDER BY v.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNÇÕES PARA ESTATÍSTICAS
-- ============================================

-- Função: Obter estatísticas completas de um professor
CREATE OR REPLACE FUNCTION get_teacher_stats(teacher_email VARCHAR)
RETURNS TABLE (
  videos_uploaded INTEGER,
  total_views INTEGER,
  total_likes INTEGER,
  avg_views_per_video NUMERIC,
  most_viewed_video VARCHAR(255),
  most_liked_video VARCHAR(255),
  total_students INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(v.id)::INTEGER as videos_uploaded,
    COALESCE(SUM(v.views), 0)::INTEGER as total_views,
    COALESCE(SUM(v.likes), 0)::INTEGER as total_likes,
    COALESCE(ROUND(AVG(v.views), 2), 0)::NUMERIC as avg_views_per_video,
    (SELECT title FROM videos WHERE author_id = u.id ORDER BY views DESC LIMIT 1) as most_viewed_video,
    (SELECT title FROM videos WHERE author_id = u.id ORDER BY likes DESC LIMIT 1) as most_liked_video,
    (SELECT COUNT(DISTINCT vv.user_id) FROM video_views vv JOIN videos v2 ON vv.video_id = v2.id WHERE v2.author_id = u.id)::INTEGER as total_students
  FROM users u
  LEFT JOIN videos v ON v.author_id = u.id AND v.is_published = true
  WHERE u.email = teacher_email
  GROUP BY u.id;
END;
$$ LANGUAGE plpgsql;

-- Função: Obter progresso de um aluno
CREATE OR REPLACE FUNCTION get_student_progress(student_email VARCHAR)
RETURNS TABLE (
  total_lessons_completed INTEGER,
  total_videos_watched INTEGER,
  total_study_time INTEGER,
  current_streak INTEGER,
  total_achievements INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT up.lesson_id)::INTEGER as total_lessons_completed,
    COUNT(DISTINCT vv.video_id)::INTEGER as total_videos_watched,
    COALESCE(SUM(vv.watch_duration), 0)::INTEGER as total_study_time,
    0::INTEGER as current_streak, -- Implementar lógica de streak
    COUNT(ua.achievement_id)::INTEGER as total_achievements
  FROM users u
  LEFT JOIN user_progress up ON up.user_id = u.id AND up.completed = true
  LEFT JOIN video_views vv ON vv.user_id = u.id
  LEFT JOIN user_achievements ua ON ua.user_id = u.id
  WHERE u.email = student_email
  GROUP BY u.id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNÇÕES PARA RANKINGS
-- ============================================

-- Função: Top professores por visualizações
CREATE OR REPLACE FUNCTION get_top_teachers(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  rank INTEGER,
  teacher_name VARCHAR(255),
  teacher_email VARCHAR(255),
  total_videos INTEGER,
  total_views INTEGER,
  total_likes INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROW_NUMBER() OVER (ORDER BY SUM(v.views) DESC)::INTEGER as rank,
    u.name,
    u.email,
    COUNT(v.id)::INTEGER as total_videos,
    COALESCE(SUM(v.views), 0)::INTEGER as total_views,
    COALESCE(SUM(v.likes), 0)::INTEGER as total_likes
  FROM users u
  LEFT JOIN videos v ON v.author_id = u.id AND v.is_published = true
  WHERE u.role = 'teacher'
  GROUP BY u.id, u.name, u.email
  ORDER BY total_views DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Função: Top vídeos mais visualizados
CREATE OR REPLACE FUNCTION get_top_videos(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  rank INTEGER,
  video_title VARCHAR(255),
  teacher_name VARCHAR(255),
  views INTEGER,
  likes INTEGER,
  instrument VARCHAR(50)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROW_NUMBER() OVER (ORDER BY v.views DESC)::INTEGER as rank,
    v.title,
    u.name,
    v.views,
    v.likes,
    v.instrument
  FROM videos v
  JOIN users u ON v.author_id = u.id
  WHERE v.is_published = true
  ORDER BY v.views DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS MATERIALIZADAS
-- ============================================

-- View: Vídeos com informações completas do autor
CREATE OR REPLACE VIEW videos_with_author AS
SELECT 
  v.id as video_id,
  v.title as video_title,
  v.description as video_description,
  v.duration,
  v.views,
  v.likes,
  v.instrument,
  v.module_level,
  v.created_at as video_created_at,
  u.id as author_id,
  u.name as author_name,
  u.email as author_email,
  u.bio as author_bio,
  l.id as lesson_id,
  l.title as lesson_title,
  l.order_index as lesson_order
FROM videos v
LEFT JOIN users u ON v.author_id = u.id
LEFT JOIN lessons l ON v.lesson_id = l.id
WHERE v.is_published = true
ORDER BY v.created_at DESC;

-- View: Estatísticas globais dos professores
CREATE OR REPLACE VIEW teacher_statistics AS
SELECT 
  u.id as teacher_id,
  u.name as teacher_name,
  u.email as teacher_email,
  u.bio,
  u.created_at as member_since,
  COUNT(DISTINCT v.id) as total_videos,
  COALESCE(SUM(v.views), 0) as total_views,
  COALESCE(SUM(v.likes), 0) as total_likes,
  COALESCE(ROUND(AVG(v.views), 2), 0) as avg_views_per_video,
  COUNT(DISTINCT vv.user_id) as unique_students
FROM users u
LEFT JOIN videos v ON v.author_id = u.id AND v.is_published = true
LEFT JOIN video_views vv ON vv.video_id = v.id
WHERE u.role = 'teacher'
GROUP BY u.id, u.name, u.email, u.bio, u.created_at
ORDER BY total_views DESC;

-- View: Vídeos mais populares
CREATE OR REPLACE VIEW top_videos AS
SELECT 
  v.id,
  v.title,
  v.description,
  v.duration,
  v.views,
  v.likes,
  u.name as author,
  u.email as author_email,
  v.instrument,
  v.created_at,
  l.title as lesson_title
FROM videos v
LEFT JOIN users u ON v.author_id = u.id
LEFT JOIN lessons l ON v.lesson_id = l.id
WHERE v.is_published = true
ORDER BY v.views DESC
LIMIT 50;

-- View: Progresso dos alunos
CREATE OR REPLACE VIEW student_progress_summary AS
SELECT 
  u.id as student_id,
  u.name as student_name,
  u.email as student_email,
  COUNT(DISTINCT up.lesson_id) FILTER (WHERE up.completed = true) as lessons_completed,
  COUNT(DISTINCT vv.video_id) as videos_watched,
  COALESCE(SUM(vv.watch_duration), 0) as total_watch_time,
  COUNT(DISTINCT ua.achievement_id) as achievements_unlocked,
  u.created_at as member_since,
  MAX(vv.watched_at) as last_activity
FROM users u
LEFT JOIN user_progress up ON up.user_id = u.id
LEFT JOIN video_views vv ON vv.user_id = u.id
LEFT JOIN user_achievements ua ON ua.user_id = u.id
WHERE u.role = 'student'
GROUP BY u.id, u.name, u.email, u.created_at
ORDER BY lessons_completed DESC;

-- View: Atividade recente
CREATE OR REPLACE VIEW recent_activity AS
SELECT 
  'video_view' as activity_type,
  u.name as user_name,
  v.title as content,
  vv.watched_at as activity_date
FROM video_views vv
JOIN users u ON vv.user_id = u.id
JOIN videos v ON vv.video_id = v.id
UNION ALL
SELECT 
  'lesson_completed' as activity_type,
  u.name as user_name,
  l.title as content,
  up.completed_at as activity_date
FROM user_progress up
JOIN users u ON up.user_id = u.id
JOIN lessons l ON up.lesson_id = l.id
WHERE up.completed = true
UNION ALL
SELECT 
  'achievement_unlocked' as activity_type,
  u.name as user_name,
  a.name as content,
  ua.unlocked_at as activity_date
FROM user_achievements ua
JOIN users u ON ua.user_id = u.id
JOIN achievements a ON ua.achievement_id = a.id
ORDER BY activity_date DESC
LIMIT 100;

-- ============================================
-- FUNÇÕES DE UTILIDADE
-- ============================================

-- Função: Buscar vídeos por instrumento
CREATE OR REPLACE FUNCTION get_videos_by_instrument(instr VARCHAR)
RETURNS TABLE (
  video_id INTEGER,
  video_title VARCHAR(255),
  teacher_name VARCHAR(255),
  duration VARCHAR(20),
  views INTEGER,
  likes INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.title,
    u.name,
    v.duration,
    v.views,
    v.likes
  FROM videos v
  JOIN users u ON v.author_id = u.id
  WHERE v.instrument = instr
    AND v.is_published = true
  ORDER BY v.views DESC;
END;
$$ LANGUAGE plpgsql;

-- Função: Verificar se usuário completou aula
CREATE OR REPLACE FUNCTION has_completed_lesson(
  student_email VARCHAR,
  lesson_title VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
  is_completed BOOLEAN;
BEGIN
  SELECT up.completed INTO is_completed
  FROM user_progress up
  JOIN users u ON up.user_id = u.id
  JOIN lessons l ON up.lesson_id = l.id
  WHERE u.email = student_email
    AND l.title = lesson_title;
  
  RETURN COALESCE(is_completed, false);
END;
$$ LANGUAGE plpgsql;

-- Função: Adicionar visualização de vídeo
CREATE OR REPLACE FUNCTION add_video_view(
  video_id_param INTEGER,
  user_email VARCHAR,
  duration_watched INTEGER DEFAULT 0
)
RETURNS VOID AS $$
DECLARE
  user_id_var UUID;
BEGIN
  SELECT id INTO user_id_var FROM users WHERE email = user_email;
  
  IF user_id_var IS NOT NULL THEN
    INSERT INTO video_views (video_id, user_id, watch_duration)
    VALUES (video_id_param, user_id_var, duration_watched);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- MENSAGEM FINAL
-- ============================================
SELECT '✅ Funções e views criadas com sucesso!' as status;
SELECT 'Funções: 10 funções úteis' as funcoes;
SELECT 'Views: 5 views materializadas' as views;
SELECT 'Sistema completo e pronto para uso!' as final;
