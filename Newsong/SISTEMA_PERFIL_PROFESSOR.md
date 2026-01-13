# Sistema de Perfil para Professores 🎓

## Visão Geral

O sistema de perfil foi expandido para suportar **professores** além dos alunos existentes, mantendo o mesmo layout visual mas adaptando as funcionalidades para refletir atividades de ensino.

## Características do Perfil do Professor

### 📊 Estatísticas Principais

Os professores visualizam 4 cards de estatísticas personalizadas:

1. **Vídeos Enviados** 🎥
   - Quantidade total de vídeo-aulas publicadas
   - Indicador de produtividade

2. **Visualizações** 👁️
   - Total de views em todos os vídeos
   - Métrica de alcance do conteúdo

3. **Alunos Ajudados** 🎓
   - Número de estudantes impactados
   - Baseado em alunos únicos que assistiram as aulas

4. **Avaliação Média** ⭐
   - Nota média de 0.0 a 5.0
   - Feedback de qualidade do conteúdo

### 🏆 Sistema de Níveis para Professores

Os professores progridem através de níveis baseados na quantidade de vídeos enviados:

- **Professor Iniciante** 🎓: 0-4 vídeos
- **Professor Bronze** 🥉: 5-19 vídeos
- **Professor Prata** 🥈: 20-49 vídeos
- **Professor Ouro** 👑: 50+ vídeos

### 🎯 Conquistas de Professores

9 conquistas específicas para atividades de ensino:

| Conquista | Ícone | Descrição | Requisito |
|-----------|-------|-----------|-----------|
| Primeiro Vídeo | 🎥 | Envie seu primeiro vídeo-aula | 1 vídeo |
| 5 Vídeos | 📹 | Envie 5 vídeo-aulas | 5 vídeos |
| 10 Vídeos | 🎬 | Envie 10 vídeo-aulas | 10 vídeos |
| 100 Visualizações | 👁️ | Alcance 100 visualizações | 100 views |
| 1000 Visualizações | 🌟 | Alcance 1000 visualizações | 1000 views |
| 50 Alunos | 🎓 | Ajude 50 alunos | 50 alunos |
| Bem Avaliado | ⭐ | Mantenha avaliação 4.5+ | Rating 4.5+ |
| Professor Atencioso | 💬 | Responda 30 comentários | 30 respostas |
| Semana de Ensino | 🔥 | Ensine por 7 dias consecutivos | 7 dias |

**Progresso das Conquistas:** Cada conquista bloqueada mostra o progresso atual em um tooltip ao passar o mouse, indicando quanto falta para desbloquear.

### 🎯 Metas de Estudo para Professores

11 metas disponíveis para professores escolherem (até 3 ativas):

1. **Enviar 10 vídeo-aulas** 🎥
   - Meta: 10 vídeos
   - Tipo: uploads

2. **Alcançar 1000 visualizações** 👁️
   - Meta: 1000 views
   - Tipo: views

3. **Responder 50 comentários** 💬
   - Meta: 50 respostas
   - Tipo: comments

4. **Postar 1 vídeo por semana** 📅
   - Meta: 4 semanas
   - Tipo: weekly_upload

5. **Manter nota média 4.5+** ⭐
   - Meta: 45 pontos (4.5 * 10)
   - Tipo: rating

6. **Ajudar 100 alunos** 🎯
   - Meta: 100 alunos
   - Tipo: students_helped

7. **Criar conteúdo de 3 instrumentos** 🎸
   - Meta: 3 instrumentos
   - Tipo: instruments

8. **Acumular 100h de visualização** ⏱️
   - Meta: 6000 minutos
   - Tipo: watch_time

9. **Ensinar por 30 dias consecutivos** 🔥
   - Meta: 30 dias
   - Tipo: streak

10. **Criar curso completo** 📚
    - Meta: 1 curso
    - Tipo: courses

11. **Mentorar 5 novos professores** 👨‍🏫
    - Meta: 5 professores
    - Tipo: mentorship

## 🗄️ Estrutura de Dados

### LocalStorage

As estatísticas e conquistas de professores são armazenadas localmente:

```javascript
// Estatísticas
localStorage.setItem('newsong-teacher-stats-{email}', JSON.stringify({
  videosUploaded: 0,
  totalViews: 0,
  studentsHelped: 0,
  avgRating: '0.0',
  commentsReplied: 0,
  coursesCreated: 0,
  teachingStreak: 0,
  totalWatchTime: 0
}));

// Conquistas desbloqueadas
localStorage.setItem('newsong-teacher-achievements-{email}', JSON.stringify({
  'first_upload': true,
  'uploads_5': false,
  // ...
}));

// Metas selecionadas
localStorage.setItem('newsong-study-goals-{email}', JSON.stringify([
  { id: 'upload_videos', progress: 0 },
  { id: 'reach_views', progress: 0 },
  { id: 'student_engagement', progress: 0 }
]));
```

### Banco de Dados (SQL)

#### Tabela: `teacher_stats`
Armazena estatísticas gerais do professor:

```sql
CREATE TABLE teacher_stats (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  videos_uploaded INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_watch_time INTEGER DEFAULT 0,
  students_helped INTEGER DEFAULT 0,
  comments_replied INTEGER DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 0.0,
  total_ratings INTEGER DEFAULT 0,
  courses_created INTEGER DEFAULT 0,
  instruments_taught INTEGER DEFAULT 0,
  teachers_mentored INTEGER DEFAULT 0,
  teaching_streak INTEGER DEFAULT 0,
  longest_teaching_streak INTEGER DEFAULT 0,
  last_teaching_date DATE,
  total_teaching_days INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabela: `teacher_achievements`
Define conquistas disponíveis para professores:

```sql
CREATE TABLE teacher_achievements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  badge_type VARCHAR(50),
  requirement_type VARCHAR(50),
  requirement_value INTEGER,
  points INTEGER DEFAULT 0
);
```

#### Tabela: `user_teacher_achievements`
Registra conquistas desbloqueadas:

```sql
CREATE TABLE user_teacher_achievements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  achievement_id INTEGER REFERENCES teacher_achievements(id),
  earned_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabela: `teacher_goals`
Armazena metas ativas do professor:

```sql
CREATE TABLE teacher_goals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  goal_type VARCHAR(50) NOT NULL,
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 Implementação Técnica

### Detecção de Tipo de Usuário

O sistema detecta automaticamente o tipo de usuário através da sessão:

```javascript
const session = JSON.parse(localStorage.getItem('ns-session') || '{}');
const userInfo = {
  role: session.role || 'student', // 'student' ou 'teacher'
  // ...
};
```

### Renderização Condicional

O perfil adapta o conteúdo baseado no role:

```javascript
if(userInfo.role === 'teacher'){
  // Carregar estatísticas de professor
  // Mostrar conquistas de professor
  // Exibir metas de professor
} else {
  // Carregar estatísticas de aluno
  // Mostrar conquistas de aluno
  // Exibir metas de aluno
}
```

### Funções Principais

#### Para Professores:

```javascript
getTeacherStats()           // Obter estatísticas do localStorage
saveTeacherStats(stats)     // Salvar estatísticas
checkTeacherAchievements()  // Verificar conquistas desbloqueadas
getTeacherAchievementProgress() // Obter conquistas desbloqueadas
```

## 🎨 Interface Visual

O layout mantém a mesma estrutura visual para ambos os tipos de usuário:

- **Cabeçalho do Perfil**: Avatar, nome, badge de nível e data de cadastro
- **Cards de Estatísticas**: 4 cards com métricas principais (conteúdo diferente)
- **Seção Principal**: Informações pessoais, instrumentos, progresso e atividades
- **Sidebar**: Conquistas, metas e preferências

### Elementos Dinâmicos

- **Badge de Nível**: `#profileBadge`, `#profileBadgeIcon`, `#profileBadgeText`
- **Grid de Estatísticas**: `#profileStatsGrid` (gerado dinamicamente)
- **Grid de Conquistas**: `.achievements-grid` (conteúdo adaptado)
- **Lista de Metas**: `.study-goals-list` (metas específicas)

## 📱 Editor de Metas

O modal de edição de metas funciona igual para ambos os roles:

- Permite selecionar até 3 metas
- Mostra progresso atual de cada meta disponível
- Salva no localStorage específico do usuário
- Notificação de sucesso/erro

## 🔄 Sincronização Futura

Para sincronizar com o banco de dados Supabase:

1. Ao fazer login, carregar `teacher_stats` do banco
2. Atualizar `teacher_stats` quando o professor enviar vídeos
3. Recalcular conquistas após cada ação
4. Salvar metas no banco via `teacher_goals`

## 🚀 Próximos Passos

1. **Integração com Upload de Vídeos**: Incrementar estatísticas automaticamente
2. **Sistema de Notificações**: Avisar sobre novas conquistas
3. **Ranking de Professores**: Leaderboard baseado em visualizações/avaliações
4. **Analytics Detalhado**: Gráficos de crescimento e engajamento
5. **Certificados**: Emitir certificados para professores destaque

## 📋 Exemplo de Uso

### Para Testar como Professor:

1. Fazer login com uma conta de professor (role='teacher')
2. Acessar a página de perfil
3. O sistema automaticamente:
   - Mostra estatísticas de professor
   - Exibe conquistas de ensino
   - Permite selecionar metas de professor
   - Adapta o badge de nível

### Simulação de Dados:

Para testar, você pode adicionar dados simulados no localStorage:

```javascript
// Simular estatísticas de professor
localStorage.setItem('newsong-teacher-stats-professor@newsong.com', JSON.stringify({
  videosUploaded: 12,
  totalViews: 1500,
  studentsHelped: 75,
  avgRating: '4.7',
  commentsReplied: 45,
  coursesCreated: 2,
  teachingStreak: 15,
  totalWatchTime: 3000
}));

// Desbloquear algumas conquistas
localStorage.setItem('newsong-teacher-achievements-professor@newsong.com', JSON.stringify({
  'first_upload': true,
  'uploads_5': true,
  'uploads_10': true,
  'views_100': true,
  'views_1000': true
}));
```

## 📖 Referências

- `public/profile.html` - Template HTML do perfil
- `public/js/profile.js` - Lógica do perfil (alunos e professores)
- `database/schema.sql` - Estrutura do banco de dados
- `SISTEMA_PROGRESSO_README.md` - Sistema de progresso para alunos

---

**Versão:** 1.0  
**Data:** 25 de Novembro de 2025  
**Autor:** NewSong Development Team
