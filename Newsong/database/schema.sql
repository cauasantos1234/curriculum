-- NewSong Database Schema
-- Supabase PostgreSQL Database
-- Created: 2025-11-03

-- ============================================
-- 1. TABELA DE USUÁRIOS
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  role VARCHAR(50) DEFAULT 'student', -- 'student', 'teacher', 'admin'
  bio TEXT,
  phone VARCHAR(50),
  
  -- Índices para busca rápida
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- ============================================
-- 2. TABELA DE INSTRUMENTOS
-- ============================================
CREATE TABLE instruments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(10),
  description TEXT,
  total_lessons INTEGER DEFAULT 0,
  total_modules INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dados iniciais de instrumentos
INSERT INTO instruments (name, slug, icon, description, total_lessons, total_modules) VALUES
('Guitarra', 'guitar', '🎸', 'Elétrica e acústica', 24, 3),
('Bateria', 'drums', '🥁', 'Ritmo e grooves', 18, 3),
('Piano', 'keyboard', '🎹', 'Clássico e contemporâneo', 21, 3),
('Violão', 'viola', '🪕', 'Acústico e dedilhado', 27, 3),
('Baixo', 'bass', '🎸', 'Groove e harmonia', 15, 3);

-- ============================================
-- 3. TABELA DE MÓDULOS/NÍVEIS
-- ============================================
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  level VARCHAR(50) NOT NULL, -- 'beginner', 'intermediate', 'advanced'
  icon VARCHAR(10),
  color VARCHAR(7),
  description TEXT,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(slug, level)
);

-- Dados iniciais de módulos
INSERT INTO modules (name, slug, level, icon, color, description, order_index) VALUES
('Nível Bronze', 'bronze', 'beginner', '🥉', '#cd7f32', 'Fundamentos e técnicas básicas', 1),
('Módulo Prata', 'silver', 'intermediate', '🥈', '#c0c0c0', 'Desenvolvimento de habilidades', 2),
('Módulo Ouro', 'gold', 'advanced', '🥇', '#ffd700', 'Técnicas profissionais', 3);

-- ============================================
-- 4. TABELA DE AULAS (LESSONS)
-- ============================================
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  instrument_id INTEGER REFERENCES instruments(id) ON DELETE CASCADE,
  module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration VARCHAR(20), -- Formato: "15:30"
  difficulty VARCHAR(50), -- 'Fácil', 'Médio', 'Difícil'
  order_index INTEGER,
  thumbnail_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_lessons_instrument ON lessons(instrument_id);
CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_lessons_published ON lessons(is_published);

-- Dados iniciais - Aulas de Guitarra Bronze (Módulo 1)
INSERT INTO lessons (instrument_id, module_id, title, description, duration, difficulty, order_index, is_published) VALUES
(1, 1, 'Partes da guitarra e suas funções', 'Aprenda sobre corpo, braço, captadores e controles', '15:30', 'Fácil', 1, true),
(1, 1, 'Tipos de guitarras (Strat, Les Paul, Tele, etc.)', 'Conheça os principais modelos de guitarra', '18:45', 'Fácil', 2, true),
(1, 1, 'Como segurar a guitarra corretamente', 'Postura sentado e em pé', '10:20', 'Fácil', 3, true),
(1, 1, 'Como afinar a guitarra (manual e por app)', 'Técnicas de afinação', '12:15', 'Fácil', 4, true),
(1, 1, 'Cuidados e manutenção básica', 'Limpeza, troca de cordas e armazenamento', '14:40', 'Fácil', 5, true);

-- ============================================
-- 5. TABELA DE VÍDEOS
-- ============================================
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Quem enviou
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration VARCHAR(20) NOT NULL,
  
  -- Tipo de upload
  upload_type VARCHAR(20) NOT NULL, -- 'youtube' ou 'file'
  
  -- Para YouTube
  youtube_url TEXT,
  youtube_video_id VARCHAR(100),
  
  -- Para upload de arquivo
  file_url TEXT, -- URL no storage (S3, Supabase Storage, etc)
  file_name VARCHAR(255),
  file_size BIGINT, -- em bytes
  file_type VARCHAR(100),
  
  -- Estatísticas
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  
  -- Controle
  is_approved BOOLEAN DEFAULT false, -- Para moderação
  is_featured BOOLEAN DEFAULT false,
  thumbnail_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_upload_type CHECK (upload_type IN ('youtube', 'file'))
);

CREATE INDEX idx_videos_lesson ON videos(lesson_id);
CREATE INDEX idx_videos_user ON videos(user_id);
CREATE INDEX idx_videos_approved ON videos(is_approved);
CREATE INDEX idx_videos_views ON videos(views DESC);
CREATE INDEX idx_videos_created ON videos(created_at DESC);

-- ============================================
-- 6. TABELA DE PROGRESSO DO USUÁRIO
-- ============================================
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  
  -- Progresso
  progress_percent INTEGER DEFAULT 0, -- 0-100
  time_watched INTEGER DEFAULT 0, -- segundos assistidos
  completed BOOLEAN DEFAULT false,
  
  -- Controle
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, lesson_id),
  CONSTRAINT valid_progress CHECK (progress_percent >= 0 AND progress_percent <= 100)
);

CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_progress_lesson ON user_progress(lesson_id);
CREATE INDEX idx_progress_completed ON user_progress(completed);

-- ============================================
-- 7. TABELA DE VISUALIZAÇÕES DE VÍDEOS
-- ============================================
CREATE TABLE video_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Analytics
  watched_duration INTEGER DEFAULT 0, -- segundos assistidos
  completion_percent INTEGER DEFAULT 0, -- % do vídeo assistido
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
  
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_completion CHECK (completion_percent >= 0 AND completion_percent <= 100)
);

CREATE INDEX idx_video_views_video ON video_views(video_id);
CREATE INDEX idx_video_views_user ON video_views(user_id);
CREATE INDEX idx_video_views_date ON video_views(viewed_at DESC);

-- ============================================
-- 8. TABELA DE COMENTÁRIOS
-- ============================================
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- Para respostas
  
  content TEXT NOT NULL,
  
  -- Moderação
  is_approved BOOLEAN DEFAULT true,
  is_edited BOOLEAN DEFAULT false,
  
  -- Interações
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT content_not_empty CHECK (LENGTH(TRIM(content)) > 0)
);

CREATE INDEX idx_comments_video ON comments(video_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_comments_created ON comments(created_at DESC);

-- ============================================
-- 9. TABELA DE AVALIAÇÕES DE VÍDEOS
-- ============================================
CREATE TABLE video_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  rating INTEGER NOT NULL, -- 1-5 estrelas
  review TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(video_id, user_id),
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5)
);

CREATE INDEX idx_ratings_video ON video_ratings(video_id);
CREATE INDEX idx_ratings_user ON video_ratings(user_id);

-- ============================================
-- 10. TABELA DE CONQUISTAS/BADGES
-- ============================================
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  badge_type VARCHAR(50), -- 'bronze', 'silver', 'gold', 'special'
  requirement_type VARCHAR(50), -- 'lessons_completed', 'hours_watched', 'streak_days'
  requirement_value INTEGER,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dados iniciais de conquistas
INSERT INTO achievements (name, description, icon, badge_type, requirement_type, requirement_value, points) VALUES
('Primeira Aula', 'Complete sua primeira aula', '🎯', 'bronze', 'lessons_completed', 1, 10),
('Dedicado', 'Assista 5 aulas', '📚', 'bronze', 'lessons_completed', 5, 25),
('Estudioso', 'Assista 10 aulas', '🎓', 'silver', 'lessons_completed', 10, 50),
('Mestre', 'Complete 25 aulas', '👑', 'gold', 'lessons_completed', 25, 100),
('Streak 7 dias', 'Estude 7 dias seguidos', '🔥', 'silver', 'streak_days', 7, 75),
('Maratonista', 'Assista 10 horas de conteúdo', '⏱️', 'gold', 'hours_watched', 600, 150);

-- ============================================
-- 11. TABELA DE CONQUISTAS DO USUÁRIO
-- ============================================
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
  
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON user_achievements(achievement_id);

-- ============================================
-- 12. TABELA DE NOTIFICAÇÕES
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL, -- 'new_video', 'comment_reply', 'achievement', 'reminder'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Referências opcionais
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  comment_id UUID REFERENCES comments(id) ON DELETE SET NULL,
  achievement_id INTEGER REFERENCES achievements(id) ON DELETE SET NULL,
  
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================
-- 13. TABELA DE STREAK (SEQUÊNCIA DE DIAS)
-- ============================================
CREATE TABLE user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  
  total_study_days INTEGER DEFAULT 0,
  total_study_hours INTEGER DEFAULT 0, -- em minutos
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_streaks_user ON user_streaks(user_id);
CREATE INDEX idx_streaks_current ON user_streaks(current_streak DESC);

-- ============================================
-- 13B. TABELA DE ESTATÍSTICAS DE PROFESSORES
-- ============================================
CREATE TABLE teacher_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  
  -- Estatísticas de conteúdo
  videos_uploaded INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_watch_time INTEGER DEFAULT 0, -- em minutos
  
  -- Engajamento
  students_helped INTEGER DEFAULT 0,
  comments_replied INTEGER DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 0.0, -- 0.00 a 5.00
  total_ratings INTEGER DEFAULT 0,
  
  -- Produtividade
  courses_created INTEGER DEFAULT 0,
  instruments_taught INTEGER DEFAULT 0,
  teachers_mentored INTEGER DEFAULT 0,
  
  -- Streaks
  teaching_streak INTEGER DEFAULT 0,
  longest_teaching_streak INTEGER DEFAULT 0,
  last_teaching_date DATE,
  total_teaching_days INTEGER DEFAULT 0,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_teacher_stats_user ON teacher_stats(user_id);
CREATE INDEX idx_teacher_stats_views ON teacher_stats(total_views DESC);
CREATE INDEX idx_teacher_stats_rating ON teacher_stats(avg_rating DESC);

-- ============================================
-- 13C. TABELA DE CONQUISTAS DE PROFESSORES
-- ============================================
CREATE TABLE teacher_achievements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  badge_type VARCHAR(50), -- 'bronze', 'silver', 'gold', 'special'
  requirement_type VARCHAR(50), -- 'videos_uploaded', 'views_reached', 'students_helped', etc.
  requirement_value INTEGER,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dados iniciais de conquistas para professores
INSERT INTO teacher_achievements (name, description, icon, badge_type, requirement_type, requirement_value, points) VALUES
('Primeiro Vídeo', 'Envie seu primeiro vídeo-aula', '🎥', 'bronze', 'videos_uploaded', 1, 10),
('5 Vídeos', 'Envie 5 vídeo-aulas', '📹', 'bronze', 'videos_uploaded', 5, 25),
('10 Vídeos', 'Envie 10 vídeo-aulas', '🎬', 'silver', 'videos_uploaded', 10, 50),
('100 Visualizações', 'Alcance 100 visualizações', '👁️', 'silver', 'views_reached', 100, 30),
('1000 Visualizações', 'Alcance 1000 visualizações', '🌟', 'gold', 'views_reached', 1000, 100),
('50 Alunos', 'Ajude 50 alunos diferentes', '🎓', 'silver', 'students_helped', 50, 75),
('Bem Avaliado', 'Mantenha avaliação média 4.5+', '⭐', 'gold', 'avg_rating', 45, 150),
('Professor Atencioso', 'Responda 30 comentários', '💬', 'silver', 'comments_replied', 30, 60),
('Semana de Ensino', 'Ensine por 7 dias consecutivos', '🔥', 'bronze', 'teaching_streak', 7, 40);

-- ============================================
-- 13D. TABELA DE CONQUISTAS DESBLOQUEADAS (PROFESSORES)
-- ============================================
CREATE TABLE user_teacher_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id INTEGER REFERENCES teacher_achievements(id) ON DELETE CASCADE,
  
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_teacher_achievements_user ON user_teacher_achievements(user_id);
CREATE INDEX idx_user_teacher_achievements_achievement ON user_teacher_achievements(achievement_id);

-- ============================================
-- 13E. TABELA DE METAS DE PROFESSORES
-- ============================================
CREATE TABLE teacher_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal_type VARCHAR(50) NOT NULL, -- 'uploads', 'views', 'students', 'rating', etc.
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_teacher_goals_user ON teacher_goals(user_id);
CREATE INDEX idx_teacher_goals_completed ON teacher_goals(is_completed);

-- ============================================
-- 14. TABELA DE FAVORITOS
-- ============================================
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, video_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_video ON favorites(video_id);

-- ============================================
-- TRIGGERS E FUNÇÕES
-- ============================================

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em tabelas relevantes
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Incrementar views ao criar video_view
CREATE OR REPLACE FUNCTION increment_video_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE videos SET views = views + 1 WHERE id = NEW.video_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_views_trigger AFTER INSERT ON video_views
  FOR EACH ROW EXECUTE FUNCTION increment_video_views();

-- Atualizar streak do usuário
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_date DATE;
  current_date DATE := CURRENT_DATE;
BEGIN
  -- Buscar último registro de streak
  SELECT last_activity_date INTO last_date
  FROM user_streaks WHERE user_id = NEW.user_id;
  
  IF last_date IS NULL THEN
    -- Primeiro registro
    INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date, total_study_days)
    VALUES (NEW.user_id, 1, 1, current_date, 1);
  ELSIF last_date = current_date THEN
    -- Mesma data, não faz nada
    RETURN NEW;
  ELSIF last_date = current_date - INTERVAL '1 day' THEN
    -- Dia consecutivo
    UPDATE user_streaks 
    SET current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        last_activity_date = current_date,
        total_study_days = total_study_days + 1
    WHERE user_id = NEW.user_id;
  ELSE
    -- Quebrou o streak
    UPDATE user_streaks 
    SET current_streak = 1,
        last_activity_date = current_date,
        total_study_days = total_study_days + 1
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_streak_trigger AFTER INSERT ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_user_streak();

-- ============================================
-- VIEWS ÚTEIS
-- ============================================

-- View: Estatísticas de vídeos
CREATE OR REPLACE VIEW video_stats AS
SELECT 
  v.id,
  v.title,
  v.views,
  v.likes,
  v.dislikes,
  COUNT(DISTINCT c.id) as total_comments,
  AVG(r.rating) as avg_rating,
  COUNT(DISTINCT r.id) as total_ratings,
  u.name as uploader_name,
  l.title as lesson_title,
  i.name as instrument_name
FROM videos v
LEFT JOIN comments c ON v.id = c.video_id
LEFT JOIN video_ratings r ON v.id = r.video_id
LEFT JOIN users u ON v.user_id = u.id
LEFT JOIN lessons l ON v.lesson_id = l.id
LEFT JOIN instruments i ON l.instrument_id = i.id
GROUP BY v.id, u.name, l.title, i.name;

-- View: Progresso do usuário por instrumento
CREATE OR REPLACE VIEW user_progress_by_instrument AS
SELECT 
  u.id as user_id,
  u.name as user_name,
  i.id as instrument_id,
  i.name as instrument_name,
  COUNT(DISTINCT l.id) as total_lessons,
  COUNT(DISTINCT up.lesson_id) FILTER (WHERE up.completed = true) as completed_lessons,
  ROUND(
    (COUNT(DISTINCT up.lesson_id) FILTER (WHERE up.completed = true)::DECIMAL / 
     NULLIF(COUNT(DISTINCT l.id), 0)) * 100, 2
  ) as completion_percentage
FROM users u
CROSS JOIN instruments i
LEFT JOIN lessons l ON l.instrument_id = i.id AND l.is_published = true
LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = u.id
GROUP BY u.id, u.name, i.id, i.name;

-- View: Top vídeos da semana
CREATE OR REPLACE VIEW top_videos_week AS
SELECT 
  v.id,
  v.title,
  COUNT(vv.id) as views_this_week,
  v.likes,
  u.name as uploader
FROM videos v
LEFT JOIN video_views vv ON v.id = vv.video_id 
  AND vv.viewed_at >= NOW() - INTERVAL '7 days'
LEFT JOIN users u ON v.user_id = u.id
WHERE v.is_approved = true
GROUP BY v.id, v.title, v.likes, u.name
ORDER BY views_this_week DESC
LIMIT 10;

-- ============================================
-- POLÍTICAS RLS (Row Level Security) - Supabase
-- ============================================

-- Ativar RLS em tabelas sensíveis
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para user_progress
CREATE POLICY "Users can view their own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para vídeos (todos podem ver aprovados)
CREATE POLICY "Anyone can view approved videos" ON videos
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Authenticated users can upload videos" ON videos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para comentários
CREATE POLICY "Anyone can view approved comments" ON comments
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Authenticated users can post comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para teacher_stats
ALTER TABLE teacher_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own teacher stats" ON teacher_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own teacher stats" ON teacher_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own teacher stats" ON teacher_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para teacher_goals
ALTER TABLE teacher_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own teacher goals" ON teacher_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own teacher goals" ON teacher_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own teacher goals" ON teacher_goals
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- ============================================

-- Índices compostos para queries comuns
CREATE INDEX idx_lessons_instrument_module ON lessons(instrument_id, module_id);
CREATE INDEX idx_videos_lesson_approved ON videos(lesson_id, is_approved);
CREATE INDEX idx_progress_user_completed ON user_progress(user_id, completed);
CREATE INDEX idx_comments_video_approved ON comments(video_id, is_approved);

-- Índices para ordenação
CREATE INDEX idx_videos_created_desc ON videos(created_at DESC);
CREATE INDEX idx_comments_created_desc ON comments(created_at DESC);

-- ============================================
-- DADOS DE TESTE (OPCIONAL)
-- ============================================

-- Usuário de teste (senha: test123)
-- Hash bcrypt de 'test123': $2a$10$XQd9YfqmkH.Bp.Vh3KxEsuDfRqN8.fO5qZlULR4k0Zr6gHqZ8mRyC
INSERT INTO users (email, password_hash, name, role) VALUES
('test@newsong.com', '$2a$10$XQd9YfqmkH.Bp.Vh3KxEsuDfRqN8.fO5qZlULR4k0Zr6gHqZ8mRyC', 'Usuário Teste', 'student'),
('teacher@newsong.com', '$2a$10$XQd9YfqmkH.Bp.Vh3KxEsuDfRqN8.fO5qZlULR4k0Zr6gHqZ8mRyC', 'Professor Teste', 'teacher');

-- ============================================
-- FIM DO SCHEMA
-- ============================================

-- Para verificar todas as tabelas criadas:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Para verificar todos os índices:
-- SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename, indexname;
