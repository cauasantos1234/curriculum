-- ============================================
-- NEWSONG PLATFORM - SCHEMA COMPLETO
-- Database: PostgreSQL / Supabase
-- Versão: 1.0.0
-- Data: 2025-12-02
-- ============================================

-- Limpar base de dados (CUIDADO EM PRODUÇÃO!)
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

-- ============================================
-- 1. EXTENSÕES NECESSÁRIAS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 2. TABELA DE USUÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
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
  location VARCHAR(255),
  birthdate DATE,
  
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_role CHECK (role IN ('student', 'teacher', 'admin'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_active ON users(is_active);

-- ============================================
-- 3. TABELA DE INSTRUMENTOS
-- ============================================
CREATE TABLE IF NOT EXISTS instruments (
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

CREATE INDEX idx_instruments_slug ON instruments(slug);
CREATE INDEX idx_instruments_active ON instruments(is_active);

-- ============================================
-- 4. TABELA DE MÓDULOS/NÍVEIS
-- ============================================
CREATE TABLE IF NOT EXISTS modules (
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

CREATE INDEX idx_modules_level ON modules(level);
CREATE INDEX idx_modules_order ON modules(order_index);

-- ============================================
-- 5. TABELA DE AULAS (LESSONS)
-- ============================================
CREATE TABLE IF NOT EXISTS lessons (
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
CREATE INDEX idx_lessons_order ON lessons(order_index);

-- ============================================
-- 6. TABELA DE VÍDEOS
-- ============================================
CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration VARCHAR(20), -- Formato: "5:23"
  video_url TEXT, -- URL do YouTube ou caminho do arquivo
  thumbnail_url TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  instrument VARCHAR(50), -- 'guitar', 'drums', 'keyboard', 'viola', 'bass'
  module_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_published BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  
  -- Metadados adicionais
  file_type VARCHAR(50), -- 'youtube', 'file', 'vimeo'
  file_size BIGINT, -- Tamanho em bytes
  upload_type VARCHAR(20) -- 'youtube' ou 'file'
);

CREATE INDEX idx_videos_lesson ON videos(lesson_id);
CREATE INDEX idx_videos_author ON videos(author_id);
CREATE INDEX idx_videos_instrument ON videos(instrument);
CREATE INDEX idx_videos_module ON videos(module_level);
CREATE INDEX idx_videos_published ON videos(is_published);
CREATE INDEX idx_videos_created ON videos(created_at DESC);
CREATE INDEX idx_videos_views ON videos(views DESC);

-- ============================================
-- 7. TABELA DE VISUALIZAÇÕES DE VÍDEOS
-- ============================================
CREATE TABLE IF NOT EXISTS video_views (
  id SERIAL PRIMARY KEY,
  video_id INTEGER REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  watch_duration INTEGER, -- Segundos assistidos
  completed BOOLEAN DEFAULT false, -- Se assistiu até o final
  
  UNIQUE(video_id, user_id, watched_at)
);

CREATE INDEX idx_video_views_video ON video_views(video_id);
CREATE INDEX idx_video_views_user ON video_views(user_id);
CREATE INDEX idx_video_views_date ON video_views(watched_at DESC);

-- ============================================
-- 8. TABELA DE PROGRESSO DO USUÁRIO
-- ============================================
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  progress_percentage INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_progress_lesson ON user_progress(lesson_id);
CREATE INDEX idx_progress_completed ON user_progress(completed);

-- ============================================
-- 9. TABELA DE CONQUISTAS/BADGES
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  requirement_type VARCHAR(50), -- 'lessons', 'videos', 'streak', 'uploads'
  requirement_value INTEGER,
  role_type VARCHAR(50), -- 'student', 'teacher', 'both'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_achievements_code ON achievements(code);
CREATE INDEX idx_achievements_role ON achievements(role_type);

-- ============================================
-- 10. TABELA DE CONQUISTAS DOS USUÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON user_achievements(achievement_id);

-- ============================================
-- 11. TABELA DE METAS DE ESTUDO
-- ============================================
CREATE TABLE IF NOT EXISTS study_goals (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal_type VARCHAR(100) NOT NULL,
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_study_goals_user ON study_goals(user_id);
CREATE INDEX idx_study_goals_active ON study_goals(is_active);
CREATE INDEX idx_study_goals_completed ON study_goals(completed);

-- ============================================
-- 12. TABELA DE VÍDEOS SALVOS
-- ============================================
CREATE TABLE IF NOT EXISTS saved_videos (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  video_id INTEGER REFERENCES videos(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  
  UNIQUE(user_id, video_id)
);

CREATE INDEX idx_saved_videos_user ON saved_videos(user_id);
CREATE INDEX idx_saved_videos_video ON saved_videos(video_id);

-- ============================================
-- 13. TABELA DE COMENTÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  video_id INTEGER REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE, -- Para respostas
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_edited BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0
);

CREATE INDEX idx_comments_video ON comments(video_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_comments_created ON comments(created_at DESC);

-- ============================================
-- 14. TABELA DE ESTATÍSTICAS DO PROFESSOR
-- ============================================
CREATE TABLE IF NOT EXISTS teacher_stats (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  videos_uploaded INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  students_helped INTEGER DEFAULT 0,
  avg_rating NUMERIC(3,2) DEFAULT 0.0,
  comments_replied INTEGER DEFAULT 0,
  courses_created INTEGER DEFAULT 0,
  teaching_streak INTEGER DEFAULT 0,
  total_watch_time INTEGER DEFAULT 0, -- em minutos
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_teacher_stats_user ON teacher_stats(user_id);

-- ============================================
-- 15. TABELA DE NOTIFICAÇÕES
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50), -- 'achievement', 'video', 'comment', 'system'
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Incrementar views automaticamente
CREATE OR REPLACE FUNCTION increment_video_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE videos 
  SET views = views + 1 
  WHERE id = NEW.video_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_views
AFTER INSERT ON video_views
FOR EACH ROW
EXECUTE FUNCTION increment_video_views();

-- Trigger: Atualizar estatísticas do professor ao adicionar vídeo
CREATE OR REPLACE FUNCTION update_teacher_stats_on_video()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_published THEN
    INSERT INTO teacher_stats (user_id, videos_uploaded, updated_at)
    VALUES (NEW.author_id, 1, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      videos_uploaded = teacher_stats.videos_uploaded + 1,
      updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_teacher_stats
AFTER INSERT ON videos
FOR EACH ROW
EXECUTE FUNCTION update_teacher_stats_on_video();

-- ============================================
-- MENSAGEM FINAL
-- ============================================
SELECT '✅ Schema completo criado com sucesso!' as status;
SELECT 'Total de tabelas: 15' as info;
SELECT 'Triggers: 3 configurados' as triggers;
SELECT 'Próximo passo: Execute 02-seed-data.sql' as proximo;
