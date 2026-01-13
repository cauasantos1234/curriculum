-- supabase-policies.sql - Políticas de segurança (RLS - Row Level Security)
-- Execute este SQL no Supabase SQL Editor DEPOIS de criar as tabelas

-- ============================================================================
-- HABILITAR RLS (Row Level Security)
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLÍTICAS PARA TABELA USERS
-- ============================================================================

-- Qualquer um pode criar uma conta (registro)
CREATE POLICY "Permitir inserção pública de usuários"
ON users FOR INSERT
WITH CHECK (true);

-- Usuários podem ver seu próprio perfil
CREATE POLICY "Usuários podem ver próprio perfil"
ON users FOR SELECT
USING (true); -- Por enquanto, todos podem ver todos (como rede social)

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Usuários podem atualizar próprio perfil"
ON users FOR UPDATE
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- ============================================================================
-- POLÍTICAS PARA TABELA VIDEOS
-- ============================================================================

-- Todos podem ver vídeos ativos
CREATE POLICY "Todos podem ver vídeos ativos"
ON videos FOR SELECT
USING (is_active = true);

-- Apenas professores podem inserir vídeos
CREATE POLICY "Apenas professores podem postar vídeos"
ON videos FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    AND role = 'teacher'
  )
);

-- Professores podem atualizar apenas seus próprios vídeos
CREATE POLICY "Professores podem atualizar próprios vídeos"
ON videos FOR UPDATE
USING (
  uploaded_by_email = current_setting('request.jwt.claims', true)::json->>'email'
);

-- Professores podem deletar apenas seus próprios vídeos
CREATE POLICY "Professores podem deletar próprios vídeos"
ON videos FOR DELETE
USING (
  uploaded_by_email = current_setting('request.jwt.claims', true)::json->>'email'
);

-- ============================================================================
-- POLÍTICAS PARA TABELA SAVED_VIDEOS
-- ============================================================================

-- Usuários podem ver apenas seus próprios salvos
CREATE POLICY "Usuários veem apenas próprios salvos"
ON saved_videos FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = saved_videos.user_id
    AND users.email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);

-- Usuários podem salvar vídeos
CREATE POLICY "Usuários podem salvar vídeos"
ON saved_videos FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = saved_videos.user_id
    AND users.email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);

-- Usuários podem remover apenas seus próprios salvos
CREATE POLICY "Usuários podem remover próprios salvos"
ON saved_videos FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = saved_videos.user_id
    AND users.email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);

-- ============================================================================
-- POLÍTICAS PARA TABELA VIDEO_VIEWS
-- ============================================================================

-- Qualquer um pode registrar uma visualização
CREATE POLICY "Permitir registro de visualizações"
ON video_views FOR INSERT
WITH CHECK (true);

-- Usuários podem ver apenas suas próprias visualizações
CREATE POLICY "Usuários veem apenas próprias visualizações"
ON video_views FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = video_views.user_id
    AND users.email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);

-- ============================================================================
-- POLÍTICAS PARA TABELA USER_PROGRESS
-- ============================================================================

-- Usuários podem ver apenas seu próprio progresso
CREATE POLICY "Usuários veem apenas próprio progresso"
ON user_progress FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = user_progress.user_id
    AND users.email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);

-- Usuários podem inserir seu próprio progresso
CREATE POLICY "Usuários podem registrar próprio progresso"
ON user_progress FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = user_progress.user_id
    AND users.email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);

-- Usuários podem atualizar apenas seu próprio progresso
CREATE POLICY "Usuários podem atualizar próprio progresso"
ON user_progress FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = user_progress.user_id
    AND users.email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);

-- ============================================================================
-- POLÍTICAS PÚBLICAS (SEM AUTENTICAÇÃO)
-- ============================================================================
-- Para permitir acesso sem autenticação inicialmente, vamos criar políticas públicas

-- Política pública para leitura de vídeos (sem autenticação)
CREATE POLICY "Acesso público a vídeos"
ON videos FOR SELECT
TO anon
USING (is_active = true);

-- Política pública para inserção de vídeos (temporária para testes)
CREATE POLICY "Acesso público para postar vídeos (TEMPORÁRIO)"
ON videos FOR INSERT
TO anon
WITH CHECK (true);

-- Política pública para visualizações
CREATE POLICY "Acesso público para registrar views"
ON video_views FOR INSERT
TO anon
WITH CHECK (true);

-- ============================================================================
-- FUNÇÕES ÚTEIS PARA ESTATÍSTICAS
-- ============================================================================

-- Função para obter total de vídeos salvos de um usuário
CREATE OR REPLACE FUNCTION get_user_saved_count(user_email TEXT)
RETURNS INTEGER AS $$
DECLARE
  user_uuid UUID;
  saved_count INTEGER;
BEGIN
  SELECT id INTO user_uuid FROM users WHERE email = user_email;
  SELECT COUNT(*) INTO saved_count FROM saved_videos WHERE user_id = user_uuid;
  RETURN saved_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter vídeos mais populares
CREATE OR REPLACE FUNCTION get_popular_videos(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  video_id UUID,
  title TEXT,
  views INTEGER,
  saves_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.title,
    v.views,
    COUNT(sv.id) as saves_count
  FROM videos v
  LEFT JOIN saved_videos sv ON v.id = sv.video_id
  WHERE v.is_active = true
  GROUP BY v.id, v.title, v.views
  ORDER BY v.views DESC, saves_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SUCESSO!
-- ============================================================================
-- ✅ Políticas de segurança configuradas!
-- ✅ RLS (Row Level Security) habilitado
-- ✅ Permissões públicas temporárias criadas
-- 
-- IMPORTANTE: As políticas públicas (TO anon) são TEMPORÁRIAS para facilitar
-- o desenvolvimento inicial. Depois implemente autenticação completa!
-- 
-- Próximo passo: Configure o arquivo supabase-config.js com suas credenciais
-- ============================================================================