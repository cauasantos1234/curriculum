-- ============================================
-- TABELA DE VÍDEOS - SCHEMA COMPLETO
-- NewSong Platform
-- ============================================

-- Deletar tabela se já existir (CUIDADO EM PRODUÇÃO!)
-- DROP TABLE IF EXISTS video_views CASCADE;
-- DROP TABLE IF EXISTS videos CASCADE;

-- ============================================
-- TABELA DE VÍDEOS
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
  file_size BIGINT, -- Tamanho em bytes (para uploads de arquivo)
  upload_type VARCHAR(20) -- 'youtube' ou 'file'
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_videos_lesson ON videos(lesson_id);
CREATE INDEX IF NOT EXISTS idx_videos_author ON videos(author_id);
CREATE INDEX IF NOT EXISTS idx_videos_instrument ON videos(instrument);
CREATE INDEX IF NOT EXISTS idx_videos_module ON videos(module_level);
CREATE INDEX IF NOT EXISTS idx_videos_published ON videos(is_published);
CREATE INDEX IF NOT EXISTS idx_videos_created ON videos(created_at DESC);

-- ============================================
-- TABELA DE VISUALIZAÇÕES DE VÍDEOS
-- ============================================
CREATE TABLE IF NOT EXISTS video_views (
  id SERIAL PRIMARY KEY,
  video_id INTEGER REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  watch_duration INTEGER, -- Segundos assistidos
  completed BOOLEAN DEFAULT false, -- Se assistiu até o final
  
  UNIQUE(video_id, user_id, watched_at) -- Prevenir duplicatas
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_video_views_video ON video_views(video_id);
CREATE INDEX IF NOT EXISTS idx_video_views_user ON video_views(user_id);
CREATE INDEX IF NOT EXISTS idx_video_views_date ON video_views(watched_at DESC);

-- ============================================
-- TRIGGER PARA ATUALIZAR CONTAGEM DE VIEWS
-- ============================================
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

-- ============================================
-- FUNÇÃO PARA BUSCAR VÍDEOS DE UM PROFESSOR
-- ============================================
CREATE OR REPLACE FUNCTION get_teacher_videos(teacher_name VARCHAR)
RETURNS TABLE (
  video_id INTEGER,
  video_title VARCHAR(255),
  video_duration VARCHAR(20),
  video_views INTEGER,
  lesson_title VARCHAR(255),
  instrument VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.title,
    v.duration,
    v.views,
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

-- ============================================
-- FUNÇÃO PARA OBTER ESTATÍSTICAS DO PROFESSOR
-- ============================================
CREATE OR REPLACE FUNCTION get_teacher_stats(teacher_email VARCHAR)
RETURNS TABLE (
  videos_uploaded INTEGER,
  total_views INTEGER,
  total_likes INTEGER,
  avg_views_per_video NUMERIC,
  most_viewed_video VARCHAR(255)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(v.id)::INTEGER as videos_uploaded,
    COALESCE(SUM(v.views), 0)::INTEGER as total_views,
    COALESCE(SUM(v.likes), 0)::INTEGER as total_likes,
    COALESCE(AVG(v.views), 0)::NUMERIC as avg_views_per_video,
    (SELECT title FROM videos WHERE author_id = u.id ORDER BY views DESC LIMIT 1) as most_viewed_video
  FROM users u
  LEFT JOIN videos v ON v.author_id = u.id AND v.is_published = true
  WHERE u.email = teacher_email
  GROUP BY u.id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS ÚTEIS
-- ============================================

-- View: Vídeos com informações do autor
CREATE OR REPLACE VIEW videos_with_author AS
SELECT 
  v.id,
  v.title as video_title,
  v.description,
  v.duration,
  v.views,
  v.likes,
  v.instrument,
  v.module_level,
  v.created_at,
  u.name as author_name,
  u.email as author_email,
  l.title as lesson_title,
  l.order_index as lesson_order
FROM videos v
LEFT JOIN users u ON v.author_id = u.id
LEFT JOIN lessons l ON v.lesson_id = l.id
WHERE v.is_published = true
ORDER BY v.created_at DESC;

-- View: Top vídeos mais visualizados
CREATE OR REPLACE VIEW top_videos AS
SELECT 
  v.id,
  v.title,
  v.views,
  v.likes,
  u.name as author,
  v.instrument,
  v.created_at
FROM videos v
LEFT JOIN users u ON v.author_id = u.id
WHERE v.is_published = true
ORDER BY v.views DESC
LIMIT 50;

-- ============================================
-- EXEMPLOS DE QUERIES ÚTEIS
-- ============================================

-- Buscar todos os vídeos de um professor específico
-- SELECT * FROM get_teacher_videos('Mariana Silva');

-- Obter estatísticas de um professor
-- SELECT * FROM get_teacher_stats('mariana.silva@newsong.com');

-- Listar vídeos mais populares de guitarra
-- SELECT * FROM videos WHERE instrument = 'guitar' AND is_published = true ORDER BY views DESC LIMIT 10;

-- Contar vídeos por instrumento
-- SELECT instrument, COUNT(*) as total FROM videos WHERE is_published = true GROUP BY instrument;

-- Professores com mais vídeos publicados
-- SELECT u.name, COUNT(v.id) as total_videos 
-- FROM users u 
-- LEFT JOIN videos v ON v.author_id = u.id 
-- WHERE u.role = 'teacher' 
-- GROUP BY u.id, u.name 
-- ORDER BY total_videos DESC;

-- ============================================
-- MENSAGEM FINAL
-- ============================================
SELECT '✅ Schema de vídeos criado com sucesso!' as status;
SELECT 'Tabelas: videos, video_views' as tabelas_criadas;
SELECT 'Funções: get_teacher_videos(), get_teacher_stats()' as funcoes_criadas;
SELECT 'Views: videos_with_author, top_videos' as views_criadas;
