-- ============================================
-- SEED DATA: Professores e Vídeos
-- NewSong Platform
-- Data: 2025-12-02
-- ============================================

-- ============================================
-- 1. INSERIR PROFESSORES (TEACHERS)
-- ============================================

-- Limpar dados anteriores (opcional - cuidado em produção!)
-- DELETE FROM video_views WHERE video_id IN (SELECT id FROM videos);
-- DELETE FROM videos;
-- DELETE FROM users WHERE role = 'teacher';

-- Inserir professores
INSERT INTO users (email, password_hash, name, role, bio, phone, is_active, created_at) VALUES
('mariana.silva@newsong.com', '$2a$10$dummyhash1', 'Mariana Silva', 'teacher', 'Guitarrista profissional com 15 anos de experiência. Especialista em guitarra elétrica e técnicas modernas.', '(11) 98765-1001', true, '2024-01-15'),
('carlos.mendes@newsong.com', '$2a$10$dummyhash2', 'Carlos Mendes', 'teacher', 'Professor de guitarra e luthier. Conhecimento profundo sobre diferentes modelos e marcas de guitarras.', '(11) 98765-1002', true, '2024-01-20'),
('ana.costa@newsong.com', '$2a$10$dummyhash3', 'Ana Costa', 'teacher', 'Instrutora certificada com foco em postura e ergonomia musical. Previna lesões e toque melhor!', '(11) 98765-1003', true, '2024-02-01'),
('pedro.santos@newsong.com', '$2a$10$dummyhash4', 'Pedro Santos', 'teacher', 'Técnico de instrumentos e professor. Especialista em afinação e setup de guitarras.', '(11) 98765-1004', true, '2024-02-10'),
('lucas.oliveira@newsong.com', '$2a$10$dummyhash5', 'Lucas Oliveira', 'teacher', 'Luthier e professor. Ensina manutenção e cuidados para prolongar a vida do seu instrumento.', '(11) 98765-1005', true, '2024-02-15'),
('paulo.drums@newsong.com', '$2a$10$dummyhash6', 'Paulo Drums', 'teacher', 'Baterista profissional de bandas de rock. Especialista em ritmos e grooves modernos.', '(11) 98765-1006', true, '2024-03-01'),
('carla.beats@newsong.com', '$2a$10$dummyhash7', 'Carla Beats', 'teacher', 'Professora de bateria com foco em coordenação e independência dos membros.', '(11) 98765-1007', true, '2024-03-10'),
('sofia.piano@newsong.com', '$2a$10$dummyhash8', 'Sofia Piano', 'teacher', 'Pianista clássica com 20 anos de carreira. Ensina teoria e prática com excelência.', '(11) 98765-1008', true, '2024-03-15'),
('helena.keys@newsong.com', '$2a$10$dummyhash9', 'Helena Keys', 'teacher', 'Professora de piano e teclado. Especialista em técnica e postura para pianistas.', '(11) 98765-1009', true, '2024-03-20'),
('gabriel.violao@newsong.com', '$2a$10$dummyhash10', 'Gabriel Violão', 'teacher', 'Violonista fingerstyle. Ensina dedilhado e técnicas avançadas de violão solo.', '(11) 98765-1010', true, '2024-04-01'),
('larissa.acoustic@newsong.com', '$2a$10$dummyhash11', 'Larissa Acoustic', 'teacher', 'Cantora e violonista. Foco em acompanhamento vocal e acordes para iniciantes.', '(11) 98765-1011', true, '2024-04-10'),
('rodrigo.bass@newsong.com', '$2a$10$dummyhash12', 'Rodrigo Bass', 'teacher', 'Baixista de jazz e música brasileira. Ensina walking bass e técnicas de improviso.', '(11) 98765-1012', true, '2024-04-15'),
('patricia.groove@newsong.com', '$2a$10$dummyhash13', 'Patrícia Groove', 'teacher', 'Baixista funk e soul. Especialista em slap e técnicas de groove.', '(11) 98765-1013', true, '2024-04-20');

-- ============================================
-- 2. INSERIR VÍDEOS
-- ============================================

-- Obter IDs dos usuários (professores)
-- Nota: Ajuste os IDs conforme necessário após a inserção

-- Vídeos de Mariana Silva (Guitarra - Aula 101)
INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index) 
SELECT 
  l.id,
  'Corpo da Guitarra',
  'Conheça as partes do corpo da guitarra: tampo, lateral, fundo e suas madeiras.',
  '5:23',
  'https://www.youtube.com/watch?v=dummyvideo1',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  1250,
  98,
  '2024-10-25',
  true,
  1
FROM lessons l, users u
WHERE l.title LIKE '%Partes da guitarra%' AND u.email = 'mariana.silva@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Braço e Trastes',
  'Entenda o braço da guitarra, trastes, escala e como eles afetam o som.',
  '4:15',
  'https://www.youtube.com/watch?v=dummyvideo2',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  980,
  75,
  '2024-10-26',
  true,
  2
FROM lessons l, users u
WHERE l.title LIKE '%Partes da guitarra%' AND u.email = 'mariana.silva@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Captadores e Controles',
  'Aprenda sobre captadores single coil e humbucker, controles de volume e tonalidade.',
  '6:30',
  'https://www.youtube.com/watch?v=dummyvideo3',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  1120,
  89,
  '2024-10-27',
  true,
  3
FROM lessons l, users u
WHERE l.title LIKE '%Partes da guitarra%' AND u.email = 'mariana.silva@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Ponte e Cordas',
  'Conheça os tipos de ponte (fixa e tremolo) e como as cordas são fixadas.',
  '4:45',
  'https://www.youtube.com/watch?v=dummyvideo4',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  890,
  67,
  '2024-10-28',
  true,
  4
FROM lessons l, users u
WHERE l.title LIKE '%Partes da guitarra%' AND u.email = 'mariana.silva@newsong.com';

-- Vídeos de Carlos Mendes (Guitarra - Aula 102)
INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Fender Stratocaster',
  'História e características da icônica Fender Stratocaster. Modelos e variações.',
  '6:30',
  'https://www.youtube.com/watch?v=dummyvideo5',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  2100,
  165,
  '2024-10-20',
  true,
  1
FROM lessons l, users u
WHERE l.title LIKE '%Tipos de guitarras%' AND u.email = 'carlos.mendes@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Gibson Les Paul',
  'A lendária Les Paul: madeiras, captadores e o som característico do rock.',
  '5:45',
  'https://www.youtube.com/watch?v=dummyvideo6',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  1850,
  142,
  '2024-10-21',
  true,
  2
FROM lessons l, users u
WHERE l.title LIKE '%Tipos de guitarras%' AND u.email = 'carlos.mendes@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Fender Telecaster',
  'A Telecaster: simplicidade e versatilidade. Ideal para country, blues e rock.',
  '5:20',
  'https://www.youtube.com/watch?v=dummyvideo7',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  1650,
  128,
  '2024-10-23',
  true,
  3
FROM lessons l, users u
WHERE l.title LIKE '%Tipos de guitarras%' AND u.email = 'carlos.mendes@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Outros Modelos Populares',
  'SG, Jazzmaster, PRS e outros modelos populares. Encontre a guitarra perfeita para você!',
  '7:15',
  'https://www.youtube.com/watch?v=dummyvideo8',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  1420,
  105,
  '2024-10-24',
  true,
  4
FROM lessons l, users u
WHERE l.title LIKE '%Tipos de guitarras%' AND u.email = 'carlos.mendes@newsong.com';

-- Vídeos de Ana Costa (Guitarra - Aula 103)
INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Postura Sentado',
  'Como sentar corretamente para tocar guitarra. Evite dores e lesões!',
  '4:20',
  'https://www.youtube.com/watch?v=dummyvideo9',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  3200,
  245,
  '2024-10-15',
  true,
  1
FROM lessons l, users u
WHERE l.title LIKE '%Como segurar a guitarra%' AND u.email = 'ana.costa@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Postura em Pé',
  'Tocando em pé: altura da correia, equilíbrio e mobilidade no palco.',
  '4:10',
  'https://www.youtube.com/watch?v=dummyvideo10',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  2980,
  223,
  '2024-10-16',
  true,
  2
FROM lessons l, users u
WHERE l.title LIKE '%Como segurar a guitarra%' AND u.email = 'ana.costa@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Posição do Braço e Mão',
  'Posicionamento correto do braço direito, mão esquerda e uso da palheta.',
  '5:30',
  'https://www.youtube.com/watch?v=dummyvideo11',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  2650,
  198,
  '2024-10-18',
  true,
  3
FROM lessons l, users u
WHERE l.title LIKE '%Como segurar a guitarra%' AND u.email = 'ana.costa@newsong.com';

-- Vídeos de Pedro Santos (Guitarra - Aula 104)
INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Afinação Manual por Ouvido',
  'Aprenda a afinar sua guitarra usando o método tradicional de ouvido.',
  '6:45',
  'https://www.youtube.com/watch?v=dummyvideo12',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  4500,
  342,
  '2024-10-10',
  true,
  1
FROM lessons l, users u
WHERE l.title LIKE '%Como afinar%' AND u.email = 'pedro.santos@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Usando Afinador Digital',
  'Como usar afinadores digitais de pedal e clip-on. Precisão e rapidez!',
  '4:30',
  'https://www.youtube.com/watch?v=dummyvideo13',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  3800,
  285,
  '2024-10-11',
  true,
  2
FROM lessons l, users u
WHERE l.title LIKE '%Como afinar%' AND u.email = 'pedro.santos@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Apps de Afinação',
  'Os melhores aplicativos para afinar sua guitarra no celular. Grátis e práticos!',
  '5:15',
  'https://www.youtube.com/watch?v=dummyvideo14',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  4100,
  312,
  '2024-10-13',
  true,
  3
FROM lessons l, users u
WHERE l.title LIKE '%Como afinar%' AND u.email = 'pedro.santos@newsong.com';

-- Vídeos de Lucas Oliveira (Guitarra - Aula 105)
INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Limpeza da Guitarra',
  'Como limpar corpo, braço e hardware. Produtos recomendados e técnicas corretas.',
  '5:50',
  'https://www.youtube.com/watch?v=dummyvideo15',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  2800,
  215,
  '2024-10-05',
  true,
  1
FROM lessons l, users u
WHERE l.title LIKE '%Cuidados e manutenção%' AND u.email = 'lucas.oliveira@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Troca de Cordas',
  'Passo a passo completo para trocar as cordas da sua guitarra corretamente.',
  '8:20',
  'https://www.youtube.com/watch?v=dummyvideo16',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  3500,
  268,
  '2024-10-06',
  true,
  2
FROM lessons l, users u
WHERE l.title LIKE '%Cuidados e manutenção%' AND u.email = 'lucas.oliveira@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Armazenamento Correto',
  'Como guardar sua guitarra com segurança. Cases, suportes e controle de umidade.',
  '4:40',
  'https://www.youtube.com/watch?v=dummyvideo17',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  2200,
  167,
  '2024-10-08',
  true,
  3
FROM lessons l, users u
WHERE l.title LIKE '%Cuidados e manutenção%' AND u.email = 'lucas.oliveira@newsong.com';

INSERT INTO videos (lesson_id, title, description, duration, video_url, thumbnail_url, author_id, instrument, module_level, views, likes, created_at, is_published, order_index)
SELECT 
  l.id,
  'Manutenção Preventiva',
  'Checklist de manutenção periódica. Quando fazer setup e regular sua guitarra.',
  '6:10',
  'https://www.youtube.com/watch?v=dummyvideo18',
  '🎸',
  u.id,
  'guitar',
  'beginner',
  2600,
  198,
  '2024-10-09',
  true,
  4
FROM lessons l, users u
WHERE l.title LIKE '%Cuidados e manutenção%' AND u.email = 'lucas.oliveira@newsong.com';

-- ============================================
-- COMMIT E MENSAGEM FINAL
-- ============================================

-- Verificar quantos professores foram inseridos
SELECT COUNT(*) as total_professores FROM users WHERE role = 'teacher';

-- Verificar quantos vídeos foram inseridos
SELECT COUNT(*) as total_videos FROM videos;

-- Listar vídeos por professor
SELECT 
  u.name as professor,
  COUNT(v.id) as total_videos,
  SUM(v.views) as total_visualizacoes
FROM users u
LEFT JOIN videos v ON v.author_id = u.id
WHERE u.role = 'teacher'
GROUP BY u.id, u.name
ORDER BY total_videos DESC;

-- Mensagem final
SELECT '✅ Seed de professores e vídeos concluído com sucesso!' as status;
