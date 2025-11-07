# 🗺️ Diagrama do Banco de Dados - NewSong

## Estrutura Visual das Tabelas e Relacionamentos

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          BANCO DE DADOS NEWSONG                          │
│                          PostgreSQL (Supabase)                           │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│     USERS        │ ◄──────────┐
├──────────────────┤            │
│ id (UUID) PK     │            │
│ email            │            │
│ password_hash    │            │
│ name             │            │
│ avatar_url       │            │
│ role             │            │
│ created_at       │            │
└────────┬─────────┘            │
         │                      │
         │                      │
         │ (user_id)            │ (user_id)
         │                      │
         ▼                      │
┌──────────────────┐            │
│  USER_PROGRESS   │            │
├──────────────────┤            │
│ id (UUID) PK     │            │
│ user_id FK ──────┼────────────┘
│ lesson_id FK ────┼────────┐
│ progress_percent │        │
│ completed        │        │
│ time_watched     │        │
│ started_at       │        │
│ completed_at     │        │
└──────────────────┘        │
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         │ (lesson_id)      │ (lesson_id)      │
         │                  │                  │
         ▼                  ▼                  │
┌──────────────────┐  ┌──────────────────┐    │
│   INSTRUMENTS    │  │     LESSONS      │ ◄──┘
├──────────────────┤  ├──────────────────┤
│ id PK            │  │ id PK            │
│ name             │  │ instrument_id FK ├──┐
│ slug             │  │ module_id FK ────┼─┐│
│ icon             │  │ title            │ ││
│ description      │  │ description      │ ││
│ total_lessons    │  │ duration         │ ││
└────────┬─────────┘  │ difficulty       │ ││
         │            │ order_index      │ ││
         │            │ is_published     │ ││
         └────────────┤ created_at       │ ││
         (instrument_id)                 │ ││
                      └────────┬─────────┘ ││
                               │           ││
                               │           ││
                               ▼           ││
                      ┌──────────────────┐ ││
                      │     VIDEOS       │ ││
                      ├──────────────────┤ ││
                      │ id (UUID) PK     │ ││
                      │ lesson_id FK ────┼─┘│
                      │ user_id FK       │  │
                      │ title            │  │
                      │ description      │  │
                      │ duration         │  │
                      │ upload_type      │  │
                      │ youtube_url      │  │
                      │ youtube_video_id │  │
                      │ file_url         │  │
                      │ views            │  │
                      │ likes            │  │
                      │ is_approved      │  │
                      │ created_at       │  │
                      └────────┬─────────┘  │
                               │            │
         ┌─────────────────────┼────────────┼────────────┐
         │                     │            │            │
         │ (video_id)          │ (video_id) │ (video_id) │
         │                     │            │            │
         ▼                     ▼            ▼            │
┌──────────────────┐  ┌──────────────────┐ ┌──────────────────┐
│  VIDEO_VIEWS     │  │   COMMENTS       │ │  VIDEO_RATINGS   │
├──────────────────┤  ├──────────────────┤ ├──────────────────┤
│ id (UUID) PK     │  │ id (UUID) PK     │ │ id (UUID) PK     │
│ video_id FK ─────┼──┘ video_id FK      │ │ video_id FK      │
│ user_id FK       │    │ user_id FK       │ │ user_id FK       │
│ watched_duration │    │ parent_id FK     │ │ rating (1-5)     │
│ completion_%     │    │ content          │ │ review           │
│ ip_address       │    │ likes            │ │ created_at       │
│ device_type      │    │ is_approved      │ └──────────────────┘
│ viewed_at        │    │ created_at       │
└──────────────────┘    └──────────────────┘
                                 │
                                 │ (parent_id - self join)
                                 └──────┐
                                        │
                                        ▼
                               (permite respostas
                                aos comentários)

┌──────────────────┐
│     MODULES      │
├──────────────────┤
│ id PK            │
│ name             │
│ slug             │
│ level            │ (beginner/intermediate/advanced)
│ icon             │
│ color            │
│ description      │
│ order_index      │
└────────┬─────────┘
         │
         │ (module_id)
         │
         └──────────────────┐
                            │
                            ▼
                      (Liga às LESSONS)

┌──────────────────┐
│  ACHIEVEMENTS    │
├──────────────────┤
│ id PK            │
│ name             │
│ description      │
│ icon             │
│ badge_type       │
│ requirement_type │
│ requirement_value│
│ points           │
└────────┬─────────┘
         │
         │ (achievement_id)
         │
         ▼
┌──────────────────┐
│USER_ACHIEVEMENTS │
├──────────────────┤
│ id (UUID) PK     │
│ user_id FK       │
│ achievement_id FK│
│ earned_at        │
└──────────────────┘
         ▲
         │
         │ (user_id)
         │
┌────────┴─────────┐
│   USER_STREAKS   │
├──────────────────┤
│ id (UUID) PK     │
│ user_id FK       │
│ current_streak   │
│ longest_streak   │
│ last_activity    │
│ total_study_days │
│ total_study_hours│
└──────────────────┘

┌──────────────────┐
│  NOTIFICATIONS   │
├──────────────────┤
│ id (UUID) PK     │
│ user_id FK       │
│ type             │
│ title            │
│ message          │
│ video_id FK      │
│ comment_id FK    │
│ achievement_id FK│
│ is_read          │
│ created_at       │
└──────────────────┘

┌──────────────────┐
│    FAVORITES     │
├──────────────────┤
│ id (UUID) PK     │
│ user_id FK       │
│ video_id FK      │
│ created_at       │
└──────────────────┘
```

---

## 📊 Relacionamentos Principais

### 1️⃣ Users → Videos (1:N)
- Um usuário pode enviar VÁRIOS vídeos
- Um vídeo pertence a UM usuário

### 2️⃣ Lessons → Videos (1:N)
- Uma aula pode ter VÁRIOS vídeos
- Um vídeo pertence a UMA aula

### 3️⃣ Users → User_Progress (1:N)
- Um usuário tem VÁRIOS registros de progresso
- Cada progresso pertence a UM usuário e UMA aula

### 4️⃣ Videos → Comments (1:N)
- Um vídeo pode ter VÁRIOS comentários
- Um comentário pertence a UM vídeo

### 5️⃣ Comments → Comments (Self Join)
- Um comentário pode ter VÁRIAS respostas
- Permite threads de discussão

### 6️⃣ Instruments → Lessons (1:N)
- Um instrumento tem VÁRIAS aulas
- Uma aula pertence a UM instrumento

### 7️⃣ Modules → Lessons (1:N)
- Um módulo tem VÁRIAS aulas
- Uma aula pertence a UM módulo

---

## 🎯 Tabelas por Categoria

### 👤 Autenticação e Usuários
- `users` - Dados dos usuários
- `user_streaks` - Sequência de dias estudando

### 📚 Conteúdo Educacional
- `instruments` - Guitarra, Bateria, etc
- `modules` - Bronze, Prata, Ouro
- `lessons` - Aulas de cada instrumento/módulo
- `videos` - Vídeos das aulas

### 📈 Progresso e Analytics
- `user_progress` - Progresso por aula
- `video_views` - Visualizações detalhadas
- `video_ratings` - Avaliações (1-5 estrelas)

### 💬 Interação Social
- `comments` - Comentários nos vídeos
- `favorites` - Vídeos favoritos
- `notifications` - Notificações do sistema

### 🏆 Gamificação
- `achievements` - Conquistas/badges disponíveis
- `user_achievements` - Conquistas ganhas

---

## 🔑 Chaves e Constraints

### Primary Keys (PK)
- `UUID` para tabelas de usuário/vídeos/etc
- `SERIAL` (auto-increment) para dados estáticos

### Foreign Keys (FK)
Todas têm `ON DELETE CASCADE` ou `SET NULL`:
- `CASCADE`: Deleta registros relacionados
- `SET NULL`: Mantém registro mas remove referência

### Unique Constraints
- `users.email` - Email único
- `user_progress(user_id, lesson_id)` - Um progresso por aula
- `video_ratings(video_id, user_id)` - Uma avaliação por vídeo
- `favorites(user_id, video_id)` - Um favorito por vídeo

### Check Constraints
- `progress_percent` entre 0-100
- `rating` entre 1-5
- `completion_percent` entre 0-100
- Email válido (regex)

---

## 📐 Índices para Performance

### Índices Simples
```sql
CREATE INDEX idx_videos_lesson ON videos(lesson_id);
CREATE INDEX idx_videos_user ON videos(user_id);
CREATE INDEX idx_comments_video ON comments(video_id);
```

### Índices Compostos
```sql
CREATE INDEX idx_lessons_instrument_module 
  ON lessons(instrument_id, module_id);
  
CREATE INDEX idx_videos_lesson_approved 
  ON videos(lesson_id, is_approved);
```

### Índices para Ordenação
```sql
CREATE INDEX idx_videos_views ON videos(views DESC);
CREATE INDEX idx_videos_created ON videos(created_at DESC);
```

---

## 🔐 Row Level Security (RLS)

### Políticas Ativas

**users**
- ✅ Usuários veem apenas seus próprios dados
- ✅ Usuários editam apenas seus próprios dados

**user_progress**
- ✅ Usuários gerenciam apenas seu progresso
- ✅ Admin pode ver tudo

**videos**
- ✅ Todos veem vídeos aprovados
- ✅ Apenas criador edita/deleta

**comments**
- ✅ Todos veem comentários aprovados
- ✅ Apenas autor edita/deleta

---

## 📦 Storage Buckets

```
videos/
├── {user_id}/
│   ├── {video_id}.mp4
│   ├── {video_id}.webm
│   └── ...

thumbnails/
├── {user_id}/
│   ├── {video_id}.jpg
│   └── ...

avatars/
├── {user_id}/
│   └── avatar.jpg
```

---

## 🎨 Views Criadas

### video_stats
Estatísticas completas de vídeos
```sql
SELECT * FROM video_stats WHERE id = 'video_uuid';
```

### user_progress_by_instrument
Progresso por instrumento
```sql
SELECT * FROM user_progress_by_instrument 
WHERE user_id = 'user_uuid';
```

### top_videos_week
Top 10 vídeos da semana
```sql
SELECT * FROM top_videos_week;
```

---

## 🔄 Triggers Automáticos

### update_updated_at_column()
Atualiza `updated_at` automaticamente em:
- users
- lessons
- videos
- comments

### increment_video_views()
Incrementa contador de views ao inserir em `video_views`

### update_user_streak()
Atualiza streak ao completar aula

---

## 💾 Tamanho Estimado

| Tabela | Registros | Tamanho Aprox |
|--------|-----------|---------------|
| users | 1,000 | ~500KB |
| lessons | 200 | ~100KB |
| videos | 5,000 | ~50MB (metadados) |
| comments | 10,000 | ~5MB |
| user_progress | 50,000 | ~10MB |
| video_views | 100,000 | ~20MB |
| **TOTAL** | | **~85MB** |

*Nota: Arquivos de vídeo ficam no Storage, não no BD*

---

**Diagrama criado por**: NewSong Dev Team  
**Última atualização**: 03/11/2025
