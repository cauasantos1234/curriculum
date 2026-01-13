-- NewSong - Configuração do Supabase Storage
-- Execute este SQL no SQL Editor do Supabase Dashboard

-- ============================================
-- 1. CRIAR BUCKET PARA VÍDEOS
-- ============================================

-- Criar bucket público para vídeos
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true);

-- ============================================
-- 2. POLÍTICAS DE STORAGE PARA VÍDEOS
-- ============================================

-- Permitir que qualquer pessoa VISUALIZE vídeos aprovados
CREATE POLICY "Public Access to Videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

-- Permitir que usuários autenticados façam UPLOAD
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'videos' 
  AND auth.role() = 'authenticated'
);

-- Permitir que usuários atualizem APENAS seus próprios vídeos
CREATE POLICY "Users can update own videos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir que usuários deletem APENAS seus próprios vídeos
CREATE POLICY "Users can delete own videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- 3. CRIAR BUCKET PARA THUMBNAILS
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true);

-- Políticas para thumbnails (similar aos vídeos)
CREATE POLICY "Public Access to Thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'thumbnails' 
  AND auth.role() = 'authenticated'
);

-- ============================================
-- 4. CRIAR BUCKET PARA AVATARES
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Políticas para avatares
CREATE POLICY "Public Access to Avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- ESTRUTURA DE PASTAS RECOMENDADA
-- ============================================

-- Videos:
-- /videos/{user_id}/{video_id}.mp4

-- Thumbnails:
-- /thumbnails/{user_id}/{video_id}.jpg

-- Avatars:
-- /avatars/{user_id}/avatar.jpg

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

-- 1. Limites do Supabase Free Tier:
--    - Storage: 1GB
--    - Bandwidth: 2GB/mês
--    - Para mais, considere upgrade

-- 2. Tipos de arquivo permitidos (configure no bucket):
--    Videos: .mp4, .webm, .mov, .ogg
--    Images: .jpg, .jpeg, .png, .gif, .webp

-- 3. Tamanho máximo por arquivo:
--    Free tier: 50MB recomendado
--    Pro tier: até 5GB

-- 4. Para vídeos grandes, recomenda-se:
--    - Usar YouTube e salvar apenas o link
--    - Ou usar serviço especializado (Vimeo, Mux, etc)
