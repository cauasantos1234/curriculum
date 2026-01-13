-- ============================================
-- NEWSONG PLATFORM - GUIA DE IMPORTAÇÃO
-- Instruções completas para importar o banco de dados
-- Versão: 1.0.0
-- Data: 2025-12-02
-- ============================================

-- ============================================
-- ORDEM DE EXECUÇÃO DOS SCRIPTS
-- ============================================

/*
Execute os scripts SQL nesta ordem exata:

1. 01-complete-schema.sql      → Cria estrutura de 15 tabelas
2. 02-seed-data.sql            → Popula dados iniciais (instrumentos, módulos, usuários)
3. 03-seed-videos.sql          → Adiciona vídeos dos professores
4. 04-functions-views.sql      → Cria funções úteis e views
5. 05-test-validation.sql      → Valida a instalação (este arquivo)
*/

-- ============================================
-- COMANDOS PARA IMPORTAR
-- ============================================

/*
=== OPÇÃO 1: Usando psql (Terminal) ===

psql -U seu_usuario -d newsong -f 01-complete-schema.sql
psql -U seu_usuario -d newsong -f 02-seed-data.sql
psql -U seu_usuario -d newsong -f 03-seed-videos.sql
psql -U seu_usuario -d newsong -f 04-functions-views.sql
psql -U seu_usuario -d newsong -f 05-test-validation.sql


=== OPÇÃO 2: Usando pgAdmin ===

1. Abra pgAdmin
2. Conecte ao seu banco de dados
3. Clique com botão direito no banco → Query Tool
4. Abra cada arquivo .sql e execute em ordem


=== OPÇÃO 3: Usando Supabase ===

1. Acesse https://supabase.com/dashboard
2. Vá em SQL Editor
3. Clique em "New Query"
4. Cole o conteúdo de cada arquivo e execute em ordem


=== OPÇÃO 4: Usando DBeaver ===

1. Abra DBeaver
2. Conecte ao PostgreSQL
3. SQL Editor → Open SQL Script
4. Execute cada arquivo em ordem
*/

-- ============================================
-- TESTES DE VALIDAÇÃO
-- ============================================

-- Teste 1: Verificar se todas as tabelas foram criadas
SELECT 
  'TABELAS CRIADAS' as tipo,
  COUNT(*) as quantidade
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';

-- Listar todas as tabelas
SELECT 
  table_name as tabela
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Teste 2: Verificar dados iniciais
SELECT '==== INSTRUMENTOS ====' as secao;
SELECT * FROM instruments ORDER BY id;

SELECT '==== MÓDULOS ====' as secao;
SELECT * FROM modules ORDER BY order_index;

-- Teste 3: Contar usuários por role
SELECT 
  role,
  COUNT(*) as total
FROM users
GROUP BY role
ORDER BY role;

-- Teste 4: Verificar professores cadastrados
SELECT 
  name as professor,
  email,
  bio
FROM users
WHERE role = 'teacher'
ORDER BY name;

-- Teste 5: Contar vídeos por professor
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

-- Teste 6: Verificar aulas cadastradas
SELECT 
  i.name as instrumento,
  m.name as modulo,
  COUNT(l.id) as total_aulas
FROM lessons l
JOIN instruments i ON l.instrument_id = i.id
JOIN modules m ON l.module_id = m.id
GROUP BY i.name, m.name
ORDER BY i.name, m.name;

-- Teste 7: Verificar conquistas
SELECT 
  role_type,
  COUNT(*) as total_conquistas
FROM achievements
GROUP BY role_type
ORDER BY role_type;

-- Teste 8: Testar funções criadas
SELECT '==== TESTANDO FUNÇÃO: get_teacher_videos ====' as teste;
SELECT * FROM get_teacher_videos('Mariana Silva') LIMIT 5;

SELECT '==== TESTANDO FUNÇÃO: get_teacher_stats ====' as teste;
SELECT * FROM get_teacher_stats('mariana.silva@newsong.com');

SELECT '==== TESTANDO FUNÇÃO: get_top_teachers ====' as teste;
SELECT * FROM get_top_teachers(5);

SELECT '==== TESTANDO FUNÇÃO: get_top_videos ====' as teste;
SELECT * FROM get_top_videos(10);

-- Teste 9: Verificar views
SELECT '==== TESTANDO VIEW: teacher_statistics ====' as teste;
SELECT * FROM teacher_statistics LIMIT 5;

SELECT '==== TESTANDO VIEW: top_videos ====' as teste;
SELECT * FROM top_videos LIMIT 10;

-- Teste 10: Verificar triggers funcionando
SELECT 
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- Teste 11: Estatísticas gerais do sistema
SELECT 
  (SELECT COUNT(*) FROM users WHERE role = 'teacher') as total_professores,
  (SELECT COUNT(*) FROM users WHERE role = 'student') as total_alunos,
  (SELECT COUNT(*) FROM videos WHERE is_published = true) as total_videos,
  (SELECT SUM(views) FROM videos) as total_visualizacoes,
  (SELECT COUNT(*) FROM lessons) as total_aulas,
  (SELECT COUNT(*) FROM achievements) as total_conquistas;

-- Teste 12: Verificar integridade dos dados
SELECT '==== VERIFICANDO INTEGRIDADE ====' as teste;

-- Vídeos sem autor
SELECT 'Vídeos sem autor' as problema, COUNT(*) as quantidade
FROM videos WHERE author_id IS NULL;

-- Vídeos sem aula
SELECT 'Vídeos sem aula' as problema, COUNT(*) as quantidade
FROM videos WHERE lesson_id IS NULL;

-- Aulas sem instrumento
SELECT 'Aulas sem instrumento' as problema, COUNT(*) as quantidade
FROM lessons WHERE instrument_id IS NULL;

-- Aulas sem módulo
SELECT 'Aulas sem módulo' as problema, COUNT(*) as quantidade
FROM lessons WHERE module_id IS NULL;

-- Teste 13: Top 5 vídeos mais populares
SELECT 
  v.title as video,
  u.name as professor,
  v.views as visualizacoes,
  v.likes as curtidas,
  v.instrument as instrumento
FROM videos v
JOIN users u ON v.author_id = u.id
WHERE v.is_published = true
ORDER BY v.views DESC
LIMIT 5;

-- Teste 14: Distribuição de vídeos por instrumento
SELECT 
  instrument as instrumento,
  COUNT(*) as total_videos,
  SUM(views) as total_views
FROM videos
WHERE is_published = true
GROUP BY instrument
ORDER BY total_videos DESC;

-- ============================================
-- RESULTADOS ESPERADOS
-- ============================================

/*
RESULTADOS ESPERADOS APÓS A IMPORTAÇÃO:

✅ 15 tabelas criadas
✅ 5 instrumentos cadastrados
✅ 3 módulos/níveis cadastrados
✅ 5+ aulas cadastradas
✅ 13 professores cadastrados
✅ 3 alunos de teste
✅ 18+ vídeos publicados
✅ 15 conquistas disponíveis
✅ 10 funções SQL funcionando
✅ 5 views materializadas
✅ 3 triggers ativos

TOTAL DE REGISTROS:
- Usuários: ~16 (13 professores + 3 alunos)
- Vídeos: ~18
- Visualizações totais: ~50,000
- Curtidas totais: ~3,000
*/

-- ============================================
-- TROUBLESHOOTING
-- ============================================

/*
ERROS COMUNS E SOLUÇÕES:

1. ERRO: "relation already exists"
   SOLUÇÃO: Deletar tabelas existentes primeiro
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;

2. ERRO: "role does not exist"
   SOLUÇÃO: Criar usuário PostgreSQL
   CREATE USER seu_usuario WITH PASSWORD 'sua_senha';
   GRANT ALL PRIVILEGES ON DATABASE newsong TO seu_usuario;

3. ERRO: "database does not exist"
   SOLUÇÃO: Criar banco de dados
   CREATE DATABASE newsong;

4. ERRO: "permission denied"
   SOLUÇÃO: Dar permissões ao usuário
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO seu_usuario;
   GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO seu_usuario;

5. ERRO: "function does not exist"
   SOLUÇÃO: Certifique-se de executar 04-functions-views.sql

6. ERRO: "foreign key violation"
   SOLUÇÃO: Execute os scripts na ordem correta (1→2→3→4→5)
*/

-- ============================================
-- LIMPEZA COMPLETA (CUIDADO!)
-- ============================================

/*
Para resetar completamente o banco de dados:

-- ⚠️ ATENÇÃO: Isso apaga TODOS os dados!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Depois execute novamente:
-- 01-complete-schema.sql
-- 02-seed-data.sql
-- 03-seed-videos.sql
-- 04-functions-views.sql
*/

-- ============================================
-- QUERIES ÚTEIS PARA O DIA A DIA
-- ============================================

-- Buscar vídeos de um professor
-- SELECT * FROM get_teacher_videos('Mariana Silva');

-- Estatísticas de um professor
-- SELECT * FROM get_teacher_stats('mariana.silva@newsong.com');

-- Top 10 professores
-- SELECT * FROM get_top_teachers(10);

-- Top 20 vídeos
-- SELECT * FROM get_top_videos(20);

-- Vídeos de guitarra
-- SELECT * FROM get_videos_by_instrument('guitar');

-- Progresso de um aluno
-- SELECT * FROM get_student_progress('aluno1@newsong.com');

-- Adicionar visualização
-- SELECT add_video_view(1, 'aluno1@newsong.com', 180);

-- ============================================
-- BACKUP E RESTORE
-- ============================================

/*
=== FAZER BACKUP ===
pg_dump -U seu_usuario -d newsong -F c -b -v -f newsong_backup.dump

=== RESTAURAR BACKUP ===
pg_restore -U seu_usuario -d newsong -v newsong_backup.dump

=== EXPORTAR PARA SQL ===
pg_dump -U seu_usuario -d newsong > newsong_backup.sql

=== IMPORTAR SQL ===
psql -U seu_usuario -d newsong < newsong_backup.sql
*/

-- ============================================
-- MENSAGEM FINAL
-- ============================================
SELECT '✅ VALIDAÇÃO COMPLETA!' as status;
SELECT 'Se todos os testes passaram, seu banco está pronto!' as mensagem;
SELECT 'Agora você pode usar o sistema NewSong!' as proximo_passo;
