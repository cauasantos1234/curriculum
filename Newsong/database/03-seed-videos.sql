-- ============================================
-- NEWSONG PLATFORM - VÍDEOS DOS PROFESSORES
-- Seed Data com Vídeos Completos
-- Versão: 1.0.0
-- Data: 2025-12-02
-- ============================================

-- ============================================
-- VÍDEOS DE MARIANA SILVA (Guitarra - Aula 1)
-- ============================================
INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Corpo da Guitarra',
  'Conheça as partes do corpo da guitarra: tampo, lateral, fundo e suas madeiras. Entenda como cada parte influencia no som final.',
  '5:23',
  'https://www.youtube.com/watch?v=example1',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  1250,
  98,
  '2024-10-25 10:00:00',
  true,
  1
FROM lessons l
CROSS JOIN users u
WHERE l.title = 'Partes da guitarra e suas funções' 
  AND u.email = 'mariana.silva@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Braço e Trastes',
  'Entenda o braço da guitarra, trastes, escala e como eles afetam o som e a tocabilidade.',
  '4:15',
  'https://www.youtube.com/watch?v=example2',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  980,
  75,
  '2024-10-26 10:00:00',
  true,
  2
FROM lessons l
CROSS JOIN users u
WHERE l.title = 'Partes da guitarra e suas funções' 
  AND u.email = 'mariana.silva@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Captadores e Controles',
  'Aprenda sobre captadores single coil e humbucker, controles de volume e tonalidade.',
  '6:30',
  'https://www.youtube.com/watch?v=example3',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  1120,
  89,
  '2024-10-27 10:00:00',
  true,
  3
FROM lessons l
CROSS JOIN users u
WHERE l.title = 'Partes da guitarra e suas funções' 
  AND u.email = 'mariana.silva@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Ponte e Cordas',
  'Conheça os tipos de ponte (fixa e tremolo) e como as cordas são fixadas.',
  '4:45',
  'https://www.youtube.com/watch?v=example4',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  890,
  67,
  '2024-10-28 10:00:00',
  true,
  4
FROM lessons l
CROSS JOIN users u
WHERE l.title = 'Partes da guitarra e suas funções' 
  AND u.email = 'mariana.silva@newsong.com';

-- ============================================
-- VÍDEOS DE CARLOS MENDES (Guitarra - Aula 2)
-- ============================================
INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Fender Stratocaster',
  'História e características da icônica Fender Stratocaster. Modelos e variações ao longo dos anos.',
  '6:30',
  'https://www.youtube.com/watch?v=example5',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  2100,
  165,
  '2024-10-20 10:00:00',
  true,
  1
FROM lessons l
CROSS JOIN users u
WHERE l.title LIKE '%Tipos de guitarras%'
  AND u.email = 'carlos.mendes@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Gibson Les Paul',
  'A lendária Les Paul: madeiras, captadores e o som característico do rock.',
  '5:45',
  'https://www.youtube.com/watch?v=example6',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  1850,
  142,
  '2024-10-21 10:00:00',
  true,
  2
FROM lessons l
CROSS JOIN users u
WHERE l.title LIKE '%Tipos de guitarras%'
  AND u.email = 'carlos.mendes@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Fender Telecaster',
  'A Telecaster: simplicidade e versatilidade. Ideal para country, blues e rock.',
  '5:20',
  'https://www.youtube.com/watch?v=example7',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  1650,
  128,
  '2024-10-23 10:00:00',
  true,
  3
FROM lessons l
CROSS JOIN users u
WHERE l.title LIKE '%Tipos de guitarras%'
  AND u.email = 'carlos.mendes@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Outros Modelos Populares',
  'SG, Jazzmaster, PRS e outros modelos populares. Encontre a guitarra perfeita para você!',
  '7:15',
  'https://www.youtube.com/watch?v=example8',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  1420,
  105,
  '2024-10-24 10:00:00',
  true,
  4
FROM lessons l
CROSS JOIN users u
WHERE l.title LIKE '%Tipos de guitarras%'
  AND u.email = 'carlos.mendes@newsong.com';

-- ============================================
-- VÍDEOS DE ANA COSTA (Guitarra - Aula 3)
-- ============================================
INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Postura Sentado',
  'Como sentar corretamente para tocar guitarra. Evite dores e lesões com a postura correta!',
  '4:20',
  'https://www.youtube.com/watch?v=example9',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  3200,
  245,
  '2024-10-15 10:00:00',
  true,
  1
FROM lessons l
CROSS JOIN users u
WHERE l.title LIKE '%Como segurar a guitarra%'
  AND u.email = 'ana.costa@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Postura em Pé',
  'Tocando em pé: altura da correia, equilíbrio e mobilidade no palco.',
  '4:10',
  'https://www.youtube.com/watch?v=example10',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  2980,
  223,
  '2024-10-16 10:00:00',
  true,
  2
FROM lessons l
CROSS JOIN users u
WHERE l.title LIKE '%Como segurar a guitarra%'
  AND u.email = 'ana.costa@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Posição do Braço e Mão',
  'Posicionamento correto do braço direito, mão esquerda e uso da palheta.',
  '5:30',
  'https://www.youtube.com/watch?v=example11',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  2650,
  198,
  '2024-10-18 10:00:00',
  true,
  3
FROM lessons l
CROSS JOIN users u
WHERE l.title LIKE '%Como segurar a guitarra%'
  AND u.email = 'ana.costa@newsong.com';

-- ============================================
-- VÍDEOS DE PEDRO SANTOS (Guitarra - Aula 4)
-- ============================================
INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Afinação Manual por Ouvido',
  'Aprenda a afinar sua guitarra usando o método tradicional de ouvido.',
  '6:45',
  'https://www.youtube.com/watch?v=example12',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  4500,
  342,
  '2024-10-10 10:00:00',
  true,
  1
FROM lessons l
CROSS JOIN users u
WHERE l.title LIKE '%Como afinar%'
  AND u.email = 'pedro.santos@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Usando Afinador Digital',
  'Como usar afinadores digitais de pedal e clip-on. Precisão e rapidez!',
  '4:30',
  'https://www.youtube.com/watch?v=example13',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  3800,
  285,
  '2024-10-11 10:00:00',
  true,
  2
FROM lessons l
CROSS JOIN users u
WHERE l.title LIKE '%Como afinar%'
  AND u.email = 'pedro.santos@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Apps de Afinação',
  'Os melhores aplicativos para afinar sua guitarra no celular. Grátis e práticos!',
  '5:15',
  'https://www.youtube.com/watch?v=example14',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  4100,
  312,
  '2024-10-13 10:00:00',
  true,
  3
FROM lessons l
CROSS JOIN users u
WHERE l.title LIKE '%Como afinar%'
  AND u.email = 'pedro.santos@newsong.com';

-- ============================================
-- VÍDEOS DE LUCAS OLIVEIRA (Guitarra - Aula 5)
-- ============================================
INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Limpeza da Guitarra',
  'Como limpar corpo, braço e hardware. Produtos recomendados e técnicas corretas.',
  '5:50',
  'https://www.youtube.com/watch?v=example15',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  2800,
  215,
  '2024-10-05 10:00:00',
  true,
  1
FROM lessons l
CROSS JOIN users u
WHERE l.title LIKE '%Cuidados e manutenção%'
  AND u.email = 'lucas.oliveira@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Troca de Cordas',
  'Passo a passo completo para trocar as cordas da sua guitarra corretamente.',
  '8:20',
  'https://www.youtube.com/watch?v=example16',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  3500,
  268,
  '2024-10-06 10:00:00',
  true,
  2
FROM lessons l
CROSS JOIN users u
WHERE l.title LIKE '%Cuidados e manutenção%'
  AND u.email = 'lucas.oliveira@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Armazenamento Correto',
  'Como guardar sua guitarra com segurança. Cases, suportes e controle de umidade.',
  '4:40',
  'https://www.youtube.com/watch?v=example17',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  2200,
  167,
  '2024-10-08 10:00:00',
  true,
  3
FROM lessons l
CROSS JOIN users u
WHERE l.title LIKE '%Cuidados e manutenção%'
  AND u.email = 'lucas.oliveira@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Manutenção Preventiva',
  'Checklist de manutenção periódica. Quando fazer setup e regular sua guitarra.',
  '6:10',
  'https://www.youtube.com/watch?v=example18',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  2600,
  198,
  '2024-10-09 10:00:00',
  true,
  4
FROM lessons l
CROSS JOIN users u
WHERE l.title LIKE '%Cuidados e manutenção%'
  AND u.email = 'lucas.oliveira@newsong.com';

-- ============================================
-- INICIALIZAR ESTATÍSTICAS DOS PROFESSORES
-- ============================================

-- Mariana Silva
INSERT INTO teacher_stats (user_id, videos_uploaded, total_views, total_likes)
SELECT 
  u.id,
  COUNT(v.id),
  SUM(v.views),
  SUM(v.likes)
FROM users u
LEFT JOIN videos v ON v.author_id = u.id
WHERE u.email = 'mariana.silva@newsong.com'
GROUP BY u.id
ON CONFLICT (user_id) DO UPDATE SET
  videos_uploaded = EXCLUDED.videos_uploaded,
  total_views = EXCLUDED.total_views,
  total_likes = EXCLUDED.total_likes;

-- Carlos Mendes
INSERT INTO teacher_stats (user_id, videos_uploaded, total_views, total_likes)
SELECT 
  u.id,
  COUNT(v.id),
  SUM(v.views),
  SUM(v.likes)
FROM users u
LEFT JOIN videos v ON v.author_id = u.id
WHERE u.email = 'carlos.mendes@newsong.com'
GROUP BY u.id
ON CONFLICT (user_id) DO UPDATE SET
  videos_uploaded = EXCLUDED.videos_uploaded,
  total_views = EXCLUDED.total_views,
  total_likes = EXCLUDED.total_likes;

-- Ana Costa
INSERT INTO teacher_stats (user_id, videos_uploaded, total_views, total_likes)
SELECT 
  u.id,
  COUNT(v.id),
  SUM(v.views),
  SUM(v.likes)
FROM users u
LEFT JOIN videos v ON v.author_id = u.id
WHERE u.email = 'ana.costa@newsong.com'
GROUP BY u.id
ON CONFLICT (user_id) DO UPDATE SET
  videos_uploaded = EXCLUDED.videos_uploaded,
  total_views = EXCLUDED.total_views,
  total_likes = EXCLUDED.total_likes;

-- Pedro Santos
INSERT INTO teacher_stats (user_id, videos_uploaded, total_views, total_likes)
SELECT 
  u.id,
  COUNT(v.id),
  SUM(v.views),
  SUM(v.likes)
FROM users u
LEFT JOIN videos v ON v.author_id = u.id
WHERE u.email = 'pedro.santos@newsong.com'
GROUP BY u.id
ON CONFLICT (user_id) DO UPDATE SET
  videos_uploaded = EXCLUDED.videos_uploaded,
  total_views = EXCLUDED.total_views,
  total_likes = EXCLUDED.total_likes;

-- Lucas Oliveira
INSERT INTO teacher_stats (user_id, videos_uploaded, total_views, total_likes)
SELECT 
  u.id,
  COUNT(v.id),
  SUM(v.views),
  SUM(v.likes)
FROM users u
LEFT JOIN videos v ON v.author_id = u.id
WHERE u.email = 'lucas.oliveira@newsong.com'
GROUP BY u.id
ON CONFLICT (user_id) DO UPDATE SET
  videos_uploaded = EXCLUDED.videos_uploaded,
  total_views = EXCLUDED.total_views,
  total_likes = EXCLUDED.total_likes;

-- ============================================
-- VERIFICAÇÃO E ESTATÍSTICAS
-- ============================================

-- Contar vídeos por professor
SELECT 
  u.name as professor,
  COUNT(v.id) as total_videos,
  SUM(v.views) as total_views,
  SUM(v.likes) as total_likes
FROM users u
LEFT JOIN videos v ON v.author_id = u.id
WHERE u.role = 'teacher'
GROUP BY u.id, u.name
ORDER BY total_videos DESC;

-- ============================================
-- MENSAGEM FINAL
-- ============================================
SELECT '✅ Vídeos dos professores inseridos com sucesso!' as status;
SELECT COUNT(*) || ' vídeos criados' as total FROM videos;
SELECT 'Próximo passo: Execute 04-functions-views.sql' as proximo;
