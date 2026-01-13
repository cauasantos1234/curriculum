-- supabase-tables.sql - Estrutura de tabelas para NewSong
-- Execute este SQL no Supabase SQL Editor

-- ============================================================================
-- 1. TABELA DE USUÁRIOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student', -- 'student' ou 'teacher'
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================================================
-- 2. TABELA DE VÍDEOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Informações básicas
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL, -- URL do YouTube ou caminho do arquivo
  thumbnail_url TEXT,
  duration TEXT, -- Formato: "12:34"
  
  -- Categorização
  instrument TEXT NOT NULL, -- 'guitar', 'drums', 'keyboard', 'viola', 'bass'
  module TEXT NOT NULL, -- 'beginner', 'intermediate', 'advanced'
  lesson_id INTEGER NOT NULL,
  lesson_title TEXT,
  
  -- Autor
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  uploaded_by_name TEXT NOT NULL,
  uploaded_by_email TEXT,
  
  -- Métricas
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Tipo de vídeo
  video_type TEXT DEFAULT 'youtube', -- 'youtube' ou 'upload'
  file_size BIGINT, -- Tamanho em bytes (para uploads)
  
  -- Status
  is_active BOOLEAN DEFAULT true
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_videos_instrument ON videos(instrument);
CREATE INDEX IF NOT EXISTS idx_videos_module ON videos(module);
CREATE INDEX IF NOT EXISTS idx_videos_lesson ON videos(lesson_id);
CREATE INDEX IF NOT EXISTS idx_videos_uploaded_by ON videos(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_views ON videos(views DESC);

-- ============================================================================
-- 3. TABELA DE VÍDEOS SALVOS (FAVORITOS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS saved_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Evitar duplicatas
  UNIQUE(user_id, video_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_saved_user ON saved_videos(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_video ON saved_videos(video_id);
CREATE INDEX IF NOT EXISTS idx_saved_date ON saved_videos(saved_at DESC);

-- ============================================================================
-- 4. TABELA DE VISUALIZAÇÕES
-- ============================================================================
CREATE TABLE IF NOT EXISTS video_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  watch_duration INTEGER, -- Tempo assistido em segundos
  completed BOOLEAN DEFAULT false -- Se assistiu até o fim
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_views_video ON video_views(video_id);
CREATE INDEX IF NOT EXISTS idx_views_user ON video_views(user_id);
CREATE INDEX IF NOT EXISTS idx_views_date ON video_views(viewed_at DESC);

-- ============================================================================
-- 5. TABELA DE PROGRESSO DO USUÁRIO
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  instrument TEXT NOT NULL,
  module TEXT NOT NULL,
  lesson_id INTEGER NOT NULL,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  progress_percentage INTEGER DEFAULT 0, -- 0-100
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Evitar duplicatas
  UNIQUE(user_id, video_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_video ON user_progress(video_id);
CREATE INDEX IF NOT EXISTS idx_progress_instrument ON user_progress(instrument, module);

-- ============================================================================
-- 6. FUNÇÕES ÚTEIS
-- ============================================================================

-- Função para atualizar contador de visualizações
CREATE OR REPLACE FUNCTION increment_video_views(video_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE videos SET views = views + 1 WHERE id = video_uuid;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar timestamp de updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. VIEWS ÚTEIS
-- ============================================================================

-- View de vídeos com estatísticas
CREATE OR REPLACE VIEW videos_with_stats AS
SELECT 
  v.*,
  COUNT(DISTINCT sv.user_id) as saves_count,
  COUNT(DISTINCT vw.id) as total_views,
  AVG(vw.watch_duration) as avg_watch_duration
FROM videos v
LEFT JOIN saved_videos sv ON v.id = sv.video_id
LEFT JOIN video_views vw ON v.id = vw.video_id
GROUP BY v.id;

-- View de vídeos populares
CREATE OR REPLACE VIEW popular_videos AS
SELECT * FROM videos_with_stats
WHERE is_active = true
ORDER BY views DESC, saves_count DESC
LIMIT 50;

-- ============================================================================
-- SUCESSO!
-- ============================================================================
-- ✅ Tabelas criadas com sucesso!
-- ✅ Índices criados para melhor performance
-- ✅ Funções e triggers configurados
-- 
-- Próximo passo: Execute o arquivo supabase-policies.sql para configurar permissões
-- ============================================================================
