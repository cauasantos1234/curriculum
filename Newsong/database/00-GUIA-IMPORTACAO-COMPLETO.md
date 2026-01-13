# 📊 GUIA COMPLETO DE IMPORTAÇÃO - NEWSONG PLATFORM

## 🗂️ ARQUIVOS DE BANCO DE DADOS

Todos os arquivos SQL estão prontos para exportar e importar no PostgreSQL/Supabase:

### Lista de Arquivos:

1. **`01-complete-schema.sql`** (15 tabelas + triggers)
   - Estrutura completa do banco de dados
   - 15 tabelas principais
   - Índices otimizados
   - 3 triggers automáticos

2. **`02-seed-data.sql`** (Dados iniciais)
   - 5 instrumentos
   - 3 módulos/níveis
   - 5 aulas de guitarra
   - 13 professores
   - 3 alunos de teste
   - 15 conquistas

3. **`03-seed-videos.sql`** (Vídeos dos professores)
   - 18 vídeos distribuídos
   - 5 professores com conteúdo
   - Estatísticas inicializadas

4. **`04-functions-views.sql`** (Funções úteis)
   - 10 funções SQL
   - 5 views materializadas
   - Helpers para queries

5. **`05-test-validation.sql`** (Validação e testes)
   - Queries de verificação
   - Troubleshooting
   - Guia de uso

---

## 🚀 COMO IMPORTAR

### OPÇÃO 1: PostgreSQL Local (psql)

```bash
# Criar banco de dados
createdb newsong

# Importar em ordem
psql -U postgres -d newsong -f 01-complete-schema.sql
psql -U postgres -d newsong -f 02-seed-data.sql
psql -U postgres -d newsong -f 03-seed-videos.sql
psql -U postgres -d newsong -f 04-functions-views.sql
psql -U postgres -d newsong -f 05-test-validation.sql
```

### OPÇÃO 2: pgAdmin (Interface Gráfica)

1. Abra pgAdmin
2. Conecte ao servidor PostgreSQL
3. Clique com botão direito no banco → **Query Tool**
4. Abra cada arquivo .sql
5. Execute em ordem: 01 → 02 → 03 → 04 → 05

### OPÇÃO 3: Supabase (Cloud)

1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Clique em **"New Query"**
5. Cole o conteúdo de cada arquivo
6. Execute em ordem

### OPÇÃO 4: DBeaver

1. Conecte ao PostgreSQL
2. **SQL Editor** → **Open SQL Script**
3. Selecione cada arquivo
4. Execute com **Ctrl+Enter** ou **Execute SQL Script**

### OPÇÃO 5: Script Bash Automático

```bash
#!/bin/bash
DB_NAME="newsong"
DB_USER="postgres"

echo "🚀 Importando NewSong Database..."

for file in 01-complete-schema.sql 02-seed-data.sql 03-seed-videos.sql 04-functions-views.sql 05-test-validation.sql
do
  echo "📥 Executando $file..."
  psql -U $DB_USER -d $DB_NAME -f $file
  if [ $? -eq 0 ]; then
    echo "✅ $file importado com sucesso!"
  else
    echo "❌ Erro ao importar $file"
    exit 1
  fi
done

echo "🎉 Importação concluída!"
```

---

## 📋 ORDEM DE EXECUÇÃO

**IMPORTANTE:** Execute na ordem exata!

```
1. Schema    → Cria estrutura (tabelas, índices, triggers)
2. Data      → Popula dados iniciais (instrumentos, usuários)
3. Videos    → Adiciona vídeos dos professores
4. Functions → Cria funções úteis e views
5. Tests     → Valida instalação
```

---

## ✅ VALIDAÇÃO PÓS-IMPORTAÇÃO

Após importar, execute estas queries para validar:

### 1. Verificar Tabelas

```sql
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';
-- Esperado: 15 tabelas
```

### 2. Verificar Dados

```sql
SELECT 
  (SELECT COUNT(*) FROM users WHERE role = 'teacher') as professores,
  (SELECT COUNT(*) FROM users WHERE role = 'student') as alunos,
  (SELECT COUNT(*) FROM videos) as videos,
  (SELECT COUNT(*) FROM lessons) as aulas;
-- Esperado: 13 professores, 3 alunos, 18 vídeos, 5 aulas
```

### 3. Testar Funções

```sql
-- Buscar vídeos de uma professora
SELECT * FROM get_teacher_videos('Mariana Silva');

-- Estatísticas de um professor
SELECT * FROM get_teacher_stats('mariana.silva@newsong.com');

-- Top professores
SELECT * FROM get_top_teachers(5);
```

### 4. Verificar Views

```sql
-- Ver estatísticas dos professores
SELECT * FROM teacher_statistics;

-- Top vídeos
SELECT * FROM top_videos LIMIT 10;
```

---

## 📊 ESTRUTURA DO BANCO DE DADOS

### Tabelas Principais:

| Tabela | Descrição | Registros Iniciais |
|--------|-----------|-------------------|
| `users` | Usuários (alunos e professores) | 16 |
| `videos` | Vídeo-aulas | 18 |
| `lessons` | Aulas/módulos | 5 |
| `instruments` | Instrumentos musicais | 5 |
| `modules` | Níveis de aprendizado | 3 |
| `achievements` | Conquistas/badges | 15 |
| `video_views` | Visualizações de vídeos | 0 |
| `user_progress` | Progresso dos alunos | 0 |
| `teacher_stats` | Estatísticas dos professores | 5 |
| `saved_videos` | Vídeos salvos pelos alunos | 0 |
| `comments` | Comentários nos vídeos | 0 |
| `study_goals` | Metas de estudo | 0 |
| `user_achievements` | Conquistas desbloqueadas | 0 |
| `notifications` | Notificações do sistema | 0 |

### Funções Disponíveis:

- `get_teacher_videos(nome)` - Busca vídeos de um professor
- `get_teacher_stats(email)` - Estatísticas completas
- `get_student_progress(email)` - Progresso do aluno
- `get_top_teachers(limit)` - Ranking de professores
- `get_top_videos(limit)` - Vídeos mais populares
- `get_videos_by_instrument(instrumento)` - Filtrar por instrumento
- `has_completed_lesson(email, aula)` - Verificar conclusão
- `add_video_view(video_id, email, duration)` - Registrar visualização

### Views Materializadas:

- `videos_with_author` - Vídeos com dados do autor
- `teacher_statistics` - Estatísticas globais dos professores
- `top_videos` - Top 50 vídeos mais visualizados
- `student_progress_summary` - Resumo do progresso dos alunos
- `recent_activity` - Atividades recentes do sistema

---

## 🔧 TROUBLESHOOTING

### Erro: "relation already exists"

```sql
-- Deletar e recriar
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Depois reimporte tudo
```

### Erro: "permission denied"

```sql
-- Dar permissões
GRANT ALL PRIVILEGES ON DATABASE newsong TO seu_usuario;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO seu_usuario;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO seu_usuario;
```

### Erro: "database does not exist"

```bash
# Criar banco de dados
createdb newsong
# ou
CREATE DATABASE newsong;
```

### Erro: "foreign key violation"

- **Causa:** Executou os scripts fora de ordem
- **Solução:** Execute na ordem correta: 01 → 02 → 03 → 04 → 05

### Erro: "function does not exist"

- **Causa:** Não executou `04-functions-views.sql`
- **Solução:** Execute o arquivo 04

---

## 💾 BACKUP E RESTORE

### Fazer Backup:

```bash
# Backup completo (formato comprimido)
pg_dump -U postgres -d newsong -F c -b -v -f newsong_backup.dump

# Backup em SQL puro
pg_dump -U postgres -d newsong > newsong_backup.sql
```

### Restaurar Backup:

```bash
# Restaurar do dump
pg_restore -U postgres -d newsong -v newsong_backup.dump

# Restaurar do SQL
psql -U postgres -d newsong < newsong_backup.sql
```

---

## 📈 DADOS DE EXEMPLO

### Professores Cadastrados:

| Nome | Instrumento | Email | Total Vídeos |
|------|-------------|-------|--------------|
| Mariana Silva | Guitarra | mariana.silva@newsong.com | 4 |
| Carlos Mendes | Guitarra | carlos.mendes@newsong.com | 4 |
| Ana Costa | Guitarra | ana.costa@newsong.com | 3 |
| Pedro Santos | Guitarra | pedro.santos@newsong.com | 3 |
| Lucas Oliveira | Guitarra | lucas.oliveira@newsong.com | 4 |
| Paulo Drums | Bateria | paulo.drums@newsong.com | 0 |
| Carla Beats | Bateria | carla.beats@newsong.com | 0 |
| Sofia Piano | Piano | sofia.piano@newsong.com | 0 |
| Helena Keys | Piano | helena.keys@newsong.com | 0 |
| Gabriel Violão | Violão | gabriel.violao@newsong.com | 0 |
| Larissa Acoustic | Violão | larissa.acoustic@newsong.com | 0 |
| Rodrigo Bass | Baixo | rodrigo.bass@newsong.com | 0 |
| Patrícia Groove | Baixo | patricia.groove@newsong.com | 0 |

**Senha padrão para todos:** `senha123` (criptografada com bcrypt)

### Alunos de Teste:

| Nome | Email | Senha |
|------|-------|-------|
| João Silva | aluno1@newsong.com | senha123 |
| Maria Santos | aluno2@newsong.com | senha123 |
| Pedro Oliveira | aluno3@newsong.com | senha123 |

---

## 🎯 PRÓXIMOS PASSOS

Após importar o banco de dados:

1. ✅ **Conectar o Frontend**
   - Atualizar variáveis de ambiente
   - Configurar conexão com PostgreSQL

2. ✅ **Testar Autenticação**
   - Login com professores
   - Login com alunos
   - Verificar permissões

3. ✅ **Validar Perfis**
   - Acessar perfil de professor
   - Verificar se vídeos aparecem
   - Testar estatísticas

4. ✅ **Adicionar Mais Conteúdo**
   - Upload de novos vídeos
   - Criar novas aulas
   - Adicionar mais instrumentos

---

## 📞 SUPORTE

Se encontrar problemas:

1. Execute `05-test-validation.sql` para diagnóstico
2. Verifique logs do PostgreSQL
3. Confirme versão do PostgreSQL (recomendado: 13+)
4. Verifique permissões do usuário

---

## ✅ CHECKLIST FINAL

- [ ] PostgreSQL instalado (versão 13+)
- [ ] Banco de dados "newsong" criado
- [ ] Executou 01-complete-schema.sql
- [ ] Executou 02-seed-data.sql
- [ ] Executou 03-seed-videos.sql
- [ ] Executou 04-functions-views.sql
- [ ] Executou 05-test-validation.sql
- [ ] Todas as queries de teste passaram
- [ ] 15 tabelas criadas
- [ ] 16 usuários cadastrados
- [ ] 18 vídeos inseridos
- [ ] Funções e views funcionando
- [ ] Frontend conectado ao banco
- [ ] Login funcionando
- [ ] Perfis exibindo vídeos

---

**🎉 Parabéns! Seu banco de dados está completo e pronto para uso!**

---

**NewSong Platform Database**  
**Versão:** 1.0.0  
**Data:** 02/12/2025  
**PostgreSQL:** 13+
