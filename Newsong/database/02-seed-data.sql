-- ============================================
-- NEWSONG PLATFORM - DADOS INICIAIS
-- Seed Data para Popular o Banco de Dados
-- Versão: 1.0.0
-- Data: 2025-12-02
-- ============================================

-- ============================================
-- 1. INSTRUMENTOS
-- ============================================
INSERT INTO instruments (name, slug, icon, description, total_lessons, total_modules, is_active) VALUES
('Guitarra', 'guitar', '🎸', 'Elétrica e acústica - do rock ao jazz', 24, 3, true),
('Bateria', 'drums', '🥁', 'Ritmo e grooves - a base de qualquer banda', 18, 3, true),
('Piano', 'keyboard', '🎹', 'Clássico e contemporâneo - harmonia e melodia', 21, 3, true),
('Violão', 'viola', '🪕', 'Acústico e dedilhado - o instrumento brasileiro', 27, 3, true),
('Baixo', 'bass', '🎸', 'Groove e harmonia - a fundação musical', 15, 3, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 2. MÓDULOS/NÍVEIS
-- ============================================
INSERT INTO modules (name, slug, level, icon, color, description, order_index) VALUES
('Nível Bronze', 'bronze', 'beginner', '🥉', '#cd7f32', 'Fundamentos e técnicas básicas para iniciantes', 1),
('Módulo Prata', 'silver', 'intermediate', '🥈', '#c0c0c0', 'Desenvolvimento de habilidades intermediárias', 2),
('Módulo Ouro', 'gold', 'advanced', '🥇', '#ffd700', 'Técnicas profissionais e avançadas', 3)
ON CONFLICT (slug, level) DO NOTHING;

-- ============================================
-- 3. AULAS DE GUITARRA - NÍVEL BRONZE
-- ============================================
INSERT INTO lessons (instrument_id, module_id, title, description, duration, difficulty, order_index, is_published) 
SELECT 
  i.id,
  m.id,
  'Partes da guitarra e suas funções',
  'Conheça todas as partes da guitarra: corpo, braço, captadores, ponte e controles',
  '20:00',
  'Fácil',
  1,
  true
FROM instruments i, modules m
WHERE i.slug = 'guitar' AND m.level = 'beginner'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (instrument_id, module_id, title, description, duration, difficulty, order_index, is_published)
SELECT 
  i.id,
  m.id,
  'Tipos de guitarras (Strat, Les Paul, Tele, etc.)',
  'Aprenda sobre os principais modelos de guitarra e suas características',
  '25:00',
  'Fácil',
  2,
  true
FROM instruments i, modules m
WHERE i.slug = 'guitar' AND m.level = 'beginner';

INSERT INTO lessons (instrument_id, module_id, title, description, duration, difficulty, order_index, is_published)
SELECT 
  i.id,
  m.id,
  'Como segurar a guitarra corretamente',
  'Postura correta sentado e em pé, posicionamento das mãos',
  '15:00',
  'Fácil',
  3,
  true
FROM instruments i, modules m
WHERE i.slug = 'guitar' AND m.level = 'beginner';

INSERT INTO lessons (instrument_id, module_id, title, description, duration, difficulty, order_index, is_published)
SELECT 
  i.id,
  m.id,
  'Como afinar a guitarra (manual e por app)',
  'Técnicas de afinação manual e usando aplicativos',
  '18:00',
  'Fácil',
  4,
  true
FROM instruments i, modules m
WHERE i.slug = 'guitar' AND m.level = 'beginner';

INSERT INTO lessons (instrument_id, module_id, title, description, duration, difficulty, order_index, is_published)
SELECT 
  i.id,
  m.id,
  'Cuidados e manutenção básica',
  'Limpeza, troca de cordas, armazenamento e manutenção preventiva',
  '25:00',
  'Fácil',
  5,
  true
FROM instruments i, modules m
WHERE i.slug = 'guitar' AND m.level = 'beginner';

-- ============================================
-- 4. USUÁRIOS - PROFESSORES
-- ============================================

-- Professores de Guitarra
INSERT INTO users (email, password_hash, name, role, bio, phone, is_active, created_at) VALUES
('mariana.silva@newsong.com', crypt('senha123', gen_salt('bf')), 'Mariana Silva', 'teacher', 'Guitarrista profissional com 15 anos de experiência. Especialista em guitarra elétrica e técnicas modernas.', '(11) 98765-1001', true, '2024-01-15'),
('carlos.mendes@newsong.com', crypt('senha123', gen_salt('bf')), 'Carlos Mendes', 'teacher', 'Professor de guitarra e luthier. Conhecimento profundo sobre diferentes modelos e marcas de guitarras.', '(11) 98765-1002', true, '2024-01-20'),
('ana.costa@newsong.com', crypt('senha123', gen_salt('bf')), 'Ana Costa', 'teacher', 'Instrutora certificada com foco em postura e ergonomia musical. Previna lesões e toque melhor!', '(11) 98765-1003', true, '2024-02-01'),
('pedro.santos@newsong.com', crypt('senha123', gen_salt('bf')), 'Pedro Santos', 'teacher', 'Técnico de instrumentos e professor. Especialista em afinação e setup de guitarras.', '(11) 98765-1004', true, '2024-02-10'),
('lucas.oliveira@newsong.com', crypt('senha123', gen_salt('bf')), 'Lucas Oliveira', 'teacher', 'Luthier e professor. Ensina manutenção e cuidados para prolongar a vida do seu instrumento.', '(11) 98765-1005', true, '2024-02-15'),

-- Professores de Bateria
('paulo.drums@newsong.com', crypt('senha123', gen_salt('bf')), 'Paulo Drums', 'teacher', 'Baterista profissional de bandas de rock. Especialista em ritmos e grooves modernos.', '(11) 98765-1006', true, '2024-03-01'),
('carla.beats@newsong.com', crypt('senha123', gen_salt('bf')), 'Carla Beats', 'teacher', 'Professora de bateria com foco em coordenação e independência dos membros.', '(11) 98765-1007', true, '2024-03-10'),

-- Professores de Piano
('sofia.piano@newsong.com', crypt('senha123', gen_salt('bf')), 'Sofia Piano', 'teacher', 'Pianista clássica com 20 anos de carreira. Ensina teoria e prática com excelência.', '(11) 98765-1008', true, '2024-03-15'),
('helena.keys@newsong.com', crypt('senha123', gen_salt('bf')), 'Helena Keys', 'teacher', 'Professora de piano e teclado. Especialista em técnica e postura para pianistas.', '(11) 98765-1009', true, '2024-03-20'),

-- Professores de Violão
('gabriel.violao@newsong.com', crypt('senha123', gen_salt('bf')), 'Gabriel Violão', 'teacher', 'Violonista fingerstyle. Ensina dedilhado e técnicas avançadas de violão solo.', '(11) 98765-1010', true, '2024-04-01'),
('larissa.acoustic@newsong.com', crypt('senha123', gen_salt('bf')), 'Larissa Acoustic', 'teacher', 'Cantora e violonista. Foco em acompanhamento vocal e acordes para iniciantes.', '(11) 98765-1011', true, '2024-04-10'),

-- Professores de Baixo
('rodrigo.bass@newsong.com', crypt('senha123', gen_salt('bf')), 'Rodrigo Bass', 'teacher', 'Baixista de jazz e música brasileira. Ensina walking bass e técnicas de improviso.', '(11) 98765-1012', true, '2024-04-15'),
('patricia.groove@newsong.com', crypt('senha123', gen_salt('bf')), 'Patrícia Groove', 'teacher', 'Baixista funk e soul. Especialista em slap e técnicas de groove.', '(11) 98765-1013', true, '2024-04-20')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 5. USUÁRIOS - ALUNOS DE TESTE
-- ============================================
INSERT INTO users (email, password_hash, name, role, bio, phone, is_active) VALUES
('aluno1@newsong.com', crypt('senha123', gen_salt('bf')), 'João Silva', 'student', 'Estudante de guitarra iniciante', '(11) 99999-0001', true),
('aluno2@newsong.com', crypt('senha123', gen_salt('bf')), 'Maria Santos', 'student', 'Aprendendo piano', '(11) 99999-0002', true),
('aluno3@newsong.com', crypt('senha123', gen_salt('bf')), 'Pedro Oliveira', 'student', 'Baterista em desenvolvimento', '(11) 99999-0003', true)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 6. CONQUISTAS/ACHIEVEMENTS
-- ============================================

-- Conquistas para Alunos
INSERT INTO achievements (code, name, description, icon, requirement_type, requirement_value, role_type) VALUES
('first_lesson', 'Primeira Aula', 'Complete sua primeira aula', '🎓', 'lessons', 1, 'student'),
('lessons_10', '10 Aulas Concluídas', 'Complete 10 aulas', '⭐', 'lessons', 10, 'student'),
('lessons_50', '50 Aulas Concluídas', 'Complete 50 aulas', '🌟', 'lessons', 50, 'student'),
('streak_7', 'Semana Completa', 'Estude por 7 dias seguidos', '🔥', 'streak', 7, 'student'),
('streak_30', 'Mês Dedicado', 'Estude por 30 dias seguidos', '💪', 'streak', 30, 'student'),
('videos_watched_20', 'Cinéfilo Musical', 'Assista 20 vídeos completos', '📺', 'videos', 20, 'student'),

-- Conquistas para Professores
('first_upload', 'Primeiro Vídeo', 'Envie seu primeiro vídeo-aula', '🎥', 'uploads', 1, 'teacher'),
('uploads_5', '5 Vídeos', 'Envie 5 vídeo-aulas', '📹', 'uploads', 5, 'teacher'),
('uploads_10', '10 Vídeos', 'Envie 10 vídeo-aulas', '🎬', 'uploads', 10, 'teacher'),
('uploads_50', 'Criador de Conteúdo', 'Envie 50 vídeo-aulas', '👑', 'uploads', 50, 'teacher'),
('views_100', '100 Visualizações', 'Alcance 100 visualizações', '👁️', 'views', 100, 'teacher'),
('views_1000', '1000 Visualizações', 'Alcance 1000 visualizações', '🌟', 'views', 1000, 'teacher'),
('views_10000', 'Influenciador', 'Alcance 10000 visualizações', '🔥', 'views', 10000, 'teacher'),
('students_50', '50 Alunos', 'Ajude 50 alunos', '🎓', 'students', 50, 'teacher'),
('high_rating', 'Bem Avaliado', 'Mantenha avaliação 4.5+', '⭐', 'rating', 45, 'teacher')
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- MENSAGEM FINAL
-- ============================================
SELECT '✅ Dados iniciais inseridos com sucesso!' as status;
SELECT 'Instrumentos: 5' as instrumentos;
SELECT 'Módulos: 3' as modulos;
SELECT 'Aulas: 5 (guitarra bronze)' as aulas;
SELECT 'Professores: 13' as professores;
SELECT 'Alunos: 3' as alunos;
SELECT 'Conquistas: 15' as conquistas;
SELECT 'Próximo passo: Execute 03-seed-videos.sql' as proximo;
