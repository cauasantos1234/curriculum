-- NewSong - Queries Úteis
-- Copie e cole estas queries conforme necessário

-- ============================================
-- QUERIES DE CONSULTA
-- ============================================

-- 1. Listar todos os vídeos de uma aula específica
SELECT 
  v.id,
  v.title,
  v.description,
  v.duration,
  v.views,
  v.likes,
  v.upload_type,
  v.youtube_video_id,
  v.file_url,
  u.name as uploader_name,
  u.avatar_url,
  v.created_at
FROM videos v
LEFT JOIN users u ON v.user_id = u.id
WHERE v.lesson_id = 101 -- Substitua pelo ID da aula
  AND v.is_approved = true
ORDER BY v.created_at DESC;

-- 2. Buscar progresso de um usuário em todas as aulas
SELECT 
  i.name as instrument,
  m.name as module,
  l.title as lesson,
  up.progress_percent,
  up.completed,
  up.last_watched_at
FROM user_progress up
JOIN lessons l ON up.lesson_id = l.id
JOIN instruments i ON l.instrument_id = i.id
JOIN modules m ON l.module_id = m.id
WHERE up.user_id = 'USER_UUID_HERE'
ORDER BY up.last_watched_at DESC;

-- 3. Top 10 vídeos mais assistidos
SELECT 
  v.title,
  v.views,
  v.likes,
  u.name as uploader,
  l.title as lesson_title
FROM videos v
LEFT JOIN users u ON v.user_id = u.id
LEFT JOIN lessons l ON v.lesson_id = l.id
WHERE v.is_approved = true
ORDER BY v.views DESC
LIMIT 10;

-- 4. Estatísticas de um usuário
SELECT 
  u.name,
  u.email,
  COUNT(DISTINCT up.lesson_id) as total_lessons_started,
  COUNT(DISTINCT up.lesson_id) FILTER (WHERE up.completed = true) as lessons_completed,
  COUNT(DISTINCT ua.achievement_id) as achievements_earned,
  us.current_streak,
  us.longest_streak,
  us.total_study_hours
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
LEFT JOIN user_streaks us ON u.id = us.user_id
WHERE u.id = 'USER_UUID_HERE'
GROUP BY u.id, u.name, u.email, us.current_streak, us.longest_streak, us.total_study_hours;

-- 5. Listar comentários de um vídeo com respostas
SELECT 
  c.id,
  c.content,
  c.likes,
  c.parent_id,
  u.name as author_name,
  u.avatar_url,
  c.created_at,
  c.is_edited
FROM comments c
JOIN users u ON c.user_id = u.id
WHERE c.video_id = 'VIDEO_UUID_HERE'
  AND c.is_approved = true
ORDER BY c.created_at DESC;

-- 6. Ranking de alunos por aulas concluídas
SELECT 
  u.name,
  COUNT(up.id) FILTER (WHERE up.completed = true) as completed_lessons,
  us.current_streak,
  us.total_study_hours / 60 as total_study_hours
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN user_streaks us ON u.id = us.user_id
WHERE u.role = 'student'
GROUP BY u.id, u.name, us.current_streak, us.total_study_hours
ORDER BY completed_lessons DESC, current_streak DESC
LIMIT 20;

-- 7. Vídeos pendentes de aprovação
SELECT 
  v.id,
  v.title,
  v.upload_type,
  u.name as uploader,
  l.title as lesson,
  v.created_at
FROM videos v
JOIN users u ON v.user_id = u.id
JOIN lessons l ON v.lesson_id = l.id
WHERE v.is_approved = false
ORDER BY v.created_at DESC;

-- 8. Notificações não lidas de um usuário
SELECT 
  n.id,
  n.type,
  n.title,
  n.message,
  n.created_at
FROM notifications n
WHERE n.user_id = 'USER_UUID_HERE'
  AND n.is_read = false
ORDER BY n.created_at DESC;

-- 9. Média de avaliação por vídeo
SELECT 
  v.title,
  ROUND(AVG(vr.rating), 2) as avg_rating,
  COUNT(vr.id) as total_ratings,
  v.views
FROM videos v
LEFT JOIN video_ratings vr ON v.id = vr.video_id
WHERE v.is_approved = true
GROUP BY v.id, v.title, v.views
HAVING COUNT(vr.id) > 0
ORDER BY avg_rating DESC, total_ratings DESC;

-- 10. Analytics de visualizações por dia (última semana)
SELECT 
  DATE(vv.viewed_at) as date,
  COUNT(*) as total_views,
  COUNT(DISTINCT vv.user_id) as unique_viewers,
  AVG(vv.completion_percent) as avg_completion
FROM video_views vv
WHERE vv.viewed_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(vv.viewed_at)
ORDER BY date DESC;

-- ============================================
-- QUERIES DE ATUALIZAÇÃO
-- ============================================

-- 11. Marcar vídeo como aprovado
UPDATE videos 
SET is_approved = true, updated_at = NOW()
WHERE id = 'VIDEO_UUID_HERE';

-- 12. Incrementar likes de um vídeo
UPDATE videos 
SET likes = likes + 1, updated_at = NOW()
WHERE id = 'VIDEO_UUID_HERE';

-- 13. Marcar aula como concluída
UPDATE user_progress
SET 
  progress_percent = 100,
  completed = true,
  completed_at = NOW(),
  last_watched_at = NOW()
WHERE user_id = 'USER_UUID_HERE' 
  AND lesson_id = 101;

-- 14. Marcar notificação como lida
UPDATE notifications
SET is_read = true, read_at = NOW()
WHERE id = 'NOTIFICATION_UUID_HERE';

-- ============================================
-- QUERIES DE INSERÇÃO
-- ============================================

-- 15. Inserir novo progresso
INSERT INTO user_progress (user_id, lesson_id, progress_percent, time_watched)
VALUES ('USER_UUID_HERE', 101, 25, 300)
ON CONFLICT (user_id, lesson_id) 
DO UPDATE SET 
  progress_percent = EXCLUDED.progress_percent,
  time_watched = EXCLUDED.time_watched,
  last_watched_at = NOW();

-- 16. Registrar visualização de vídeo
INSERT INTO video_views (video_id, user_id, watched_duration, completion_percent, device_type)
VALUES ('VIDEO_UUID_HERE', 'USER_UUID_HERE', 120, 50, 'desktop');

-- 17. Adicionar comentário
INSERT INTO comments (video_id, user_id, content)
VALUES ('VIDEO_UUID_HERE', 'USER_UUID_HERE', 'Excelente aula!');

-- 18. Dar nota a um vídeo
INSERT INTO video_ratings (video_id, user_id, rating, review)
VALUES ('VIDEO_UUID_HERE', 'USER_UUID_HERE', 5, 'Muito didático!')
ON CONFLICT (video_id, user_id)
DO UPDATE SET 
  rating = EXCLUDED.rating,
  review = EXCLUDED.review,
  updated_at = NOW();

-- 19. Adicionar aos favoritos
INSERT INTO favorites (user_id, video_id)
VALUES ('USER_UUID_HERE', 'VIDEO_UUID_HERE')
ON CONFLICT DO NOTHING;

-- ============================================
-- QUERIES DE DELEÇÃO
-- ============================================

-- 20. Remover dos favoritos
DELETE FROM favorites
WHERE user_id = 'USER_UUID_HERE' 
  AND video_id = 'VIDEO_UUID_HERE';

-- 21. Deletar comentário (soft delete - apenas marcar)
UPDATE comments
SET is_approved = false, updated_at = NOW()
WHERE id = 'COMMENT_UUID_HERE'
  AND user_id = 'USER_UUID_HERE';

-- ============================================
-- QUERIES ADMINISTRATIVAS
-- ============================================

-- 22. Total de usuários por tipo
SELECT 
  role,
  COUNT(*) as total
FROM users
GROUP BY role;

-- 23. Estatísticas gerais da plataforma
SELECT 
  (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
  (SELECT COUNT(*) FROM users WHERE role = 'teacher') as total_teachers,
  (SELECT COUNT(*) FROM videos WHERE is_approved = true) as total_videos,
  (SELECT COUNT(*) FROM lessons WHERE is_published = true) as total_lessons,
  (SELECT COUNT(*) FROM comments WHERE is_approved = true) as total_comments,
  (SELECT SUM(views) FROM videos) as total_views;

-- 24. Usuários mais ativos (por comentários)
SELECT 
  u.name,
  COUNT(c.id) as total_comments,
  COUNT(DISTINCT c.video_id) as videos_commented
FROM users u
JOIN comments c ON u.id = c.user_id
WHERE c.is_approved = true
GROUP BY u.id, u.name
ORDER BY total_comments DESC
LIMIT 10;

-- 25. Limpar dados de teste
-- ⚠️ CUIDADO: Isso vai deletar TODOS os dados!
-- DELETE FROM video_views;
-- DELETE FROM video_ratings;
-- DELETE FROM favorites;
-- DELETE FROM comments;
-- DELETE FROM notifications;
-- DELETE FROM user_achievements;
-- DELETE FROM user_progress;
-- DELETE FROM user_streaks;
-- DELETE FROM videos;
-- DELETE FROM users WHERE email LIKE '%test%';

-- ============================================
-- QUERIES DE MANUTENÇÃO
-- ============================================

-- 26. Recalcular total de views de todos os vídeos
UPDATE videos v
SET views = (
  SELECT COUNT(*) 
  FROM video_views vv 
  WHERE vv.video_id = v.id
);

-- 27. Encontrar vídeos órfãos (sem aula associada)
SELECT v.id, v.title, v.created_at
FROM videos v
LEFT JOIN lessons l ON v.lesson_id = l.id
WHERE l.id IS NULL;

-- 28. Verificar integridade dos dados
SELECT 
  'Users without streaks' as issue,
  COUNT(*) as count
FROM users u
LEFT JOIN user_streaks us ON u.id = us.user_id
WHERE us.id IS NULL AND u.role = 'student'
UNION ALL
SELECT 
  'Videos without lessons',
  COUNT(*)
FROM videos v
LEFT JOIN lessons l ON v.lesson_id = l.id
WHERE l.id IS NULL;

-- 29. Backup de tabelas importantes (exportar para JSON)
-- Execute no Supabase Dashboard → SQL Editor
-- SELECT json_agg(row_to_json(t)) FROM (SELECT * FROM users) t;
-- SELECT json_agg(row_to_json(t)) FROM (SELECT * FROM videos) t;
-- SELECT json_agg(row_to_json(t)) FROM (SELECT * FROM user_progress) t;

-- 30. Verificar tamanho das tabelas
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
