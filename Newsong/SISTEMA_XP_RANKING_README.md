# Sistema de XP e Ranking - NewSong

## 📋 Visão Geral

Sistema completo de gamificação com XP, níveis, streaks (dias consecutivos) e ranking de usuários para a plataforma NewSong.

## 🎯 Funcionalidades

### Sistema de XP
- **Ganho de XP por atividades:**
  - Assistir 25% do vídeo: 5 XP
  - Assistir 50% do vídeo: 10 XP
  - Assistir 75% do vídeo: 15 XP
  - Assistir 100% do vídeo: 25 XP
  - Completar aula: 50 XP
  - Completar módulo: 200 XP
  - Salvar vídeo: 2 XP
  - Avaliar professor: 5 XP
  - Bônus diário: 10 XP

### Sistema de Níveis
- Nível 1 (Iniciante): 0-100 XP
- Nível 2 (Aprendiz): 101-300 XP
- Nível 3 (Estudante): 301-600 XP
- Nível 4 (Dedicado): 601-1000 XP
- Nível 5 (Expert): 1001-1500 XP
- Nível 6+ (Mestre): +500 XP por nível

### Sistema de Streak
- **Bônus por dias consecutivos:**
  - 3 dias: +20 XP
  - 7 dias: +50 XP
  - 30 dias: +200 XP
  - 100 dias: +1000 XP

### Sistema de Ranking
- **Ranking por XP Total:** Top 10 usuários com mais XP
- **Ranking por Streak:** Top 10 usuários com maior streak ativo
- **Card pessoal:** Mostra sua posição, nível e progresso

## 🗄️ Estrutura do Banco de Dados

### Tabelas Criadas

#### `user_xp`
Armazena XP, nível e streak de cada usuário.

```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key -> auth.users)
- total_xp: INTEGER
- level: INTEGER
- current_streak: INTEGER
- longest_streak: INTEGER
- last_activity_date: DATE
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `xp_transactions`
Registra histórico de todas as transações de XP.

```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key -> auth.users)
- xp_amount: INTEGER
- action_type: VARCHAR(50)
- reference_id: UUID (opcional)
- description: TEXT
- created_at: TIMESTAMP
```

### Funções SQL

- `calculate_level(xp)` - Calcula nível baseado no XP
- `add_xp_to_user()` - Adiciona XP e registra transação
- `update_user_streak()` - Atualiza streak e concede bônus
- `get_user_ranking()` - Retorna posição do usuário nos rankings

### Views

- `ranking_by_xp` - Top 100 usuários por XP
- `ranking_by_streak` - Top 100 usuários por streak ativo

## 📁 Arquivos do Sistema

### Backend (SQL)
- `database/07-xp-ranking-system.sql` - Schema completo do sistema

### Frontend (JavaScript)
- `public/js/xp-system.js` - Sistema de XP e notificações
- `public/js/ranking-system.js` - Sistema de ranking

### Estilos (CSS)
- `public/css/styles.css` - Estilos do ranking e notificações (final do arquivo)

### HTML
- `public/app.html` - Seção de ranking adicionada

## 🚀 Instalação

### 1. Executar SQL no Supabase

No Supabase SQL Editor, execute:

```sql
-- Executar o arquivo 07-xp-ranking-system.sql
```

### 2. Verificar Scripts no HTML

Certifique-se de que `app.html` contém:

```html
<script src="js/xp-system.js"></script>
<script src="js/ranking-system.js"></script>
```

### 3. Integração Automática

O sistema já está integrado com:
- ✅ Conclusão de aulas (`user-progress.js`)
- ✅ Salvamento de vídeos (`saved-videos.js`)
- ✅ Login diário (bônus automático)

## 💻 Uso no Código

### Adicionar XP Manualmente

```javascript
// Adicionar XP por uma ação customizada
await XPSystem.addXP('custom_action', 50, referenceId, 'Descrição');
```

### Buscar Dados do Usuário

```javascript
// Buscar XP do usuário
const userXP = await XPSystem.getUserXP();
console.log(userXP.total_xp, userXP.level, userXP.current_streak);

// Buscar ranking do usuário
const ranking = await XPSystem.getUserRanking();
console.log(ranking.xp_rank, ranking.streak_rank);
```

### Buscar Rankings

```javascript
// Top 10 por XP
const topXP = await RankingSystem.getRankingByXP(10);

// Top 10 por Streak
const topStreak = await RankingSystem.getRankingByStreak(10);
```

## 🎨 Notificações

O sistema exibe automaticamente notificações quando:
- ✨ Ganha XP (canto superior direito)
- 🎉 Sobe de nível (notificação especial)
- 🔥 Atinge milestone de streak (bônus)

As notificações aparecem por 3-5 segundos e desaparecem automaticamente.

## 📊 Interface do Ranking

Na página inicial (`app.html`), a seção de ranking mostra:

1. **Tabs:** Alternar entre ranking por XP e Streak
2. **Card do Usuário:** Sua posição, nível, XP e progresso
3. **Tabela Top 10:** Lista dos melhores usuários
4. **Badges:** 🥇 🥈 🥉 para top 3

## 🔧 Personalização

### Ajustar Valores de XP

Edite `xp-system.js`:

```javascript
const XP_CONFIG = {
  VIDEO_WATCH_100: 25, // Altere para o valor desejado
  LESSON_COMPLETE: 50,
  // ...
};
```

### Ajustar Níveis

Edite a função `calculate_level()` em `07-xp-ranking-system.sql`.

### Customizar Notificações

Edite as funções em `xp-system.js`:
- `showXPNotification()`
- `showLevelUpNotification()`
- `showStreakBonusNotification()`

## 🐛 Troubleshooting

### Notificações não aparecem
- Verifique se `xp-system.js` está carregado
- Verifique console do navegador por erros
- Confirme que o Supabase está conectado

### Ranking não carrega
- Verifique se executou o SQL no Supabase
- Confirme que as tabelas `user_xp` e views existem
- Verifique políticas RLS (Row Level Security)

### XP não está sendo adicionado
- Verifique se o usuário está autenticado
- Confirme que a função `add_xp_to_user` existe no Supabase
- Verifique logs do console

## 📝 Notas Importantes

1. **Primeiro Login:** Ao fazer login pela primeira vez após instalação, o sistema cria automaticamente o registro de XP do usuário.

2. **Streak Diário:** O streak é atualizado automaticamente ao fazer login. Se passar mais de 1 dia sem atividade, o streak é resetado.

3. **Performance:** As views de ranking são otimizadas com índices. Para grandes volumes de dados, considere cache.

4. **Segurança:** As políticas RLS garantem que usuários só podem ver dados públicos e modificar seus próprios dados via funções.

## 🎯 Próximas Melhorias Sugeridas

- [ ] Badges/Conquistas visuais
- [ ] Histórico de XP em gráfico
- [ ] Ranking semanal/mensal
- [ ] Recompensas por XP (desbloquear conteúdo)
- [ ] Sistema de ligas/divisões
- [ ] Batalhas/Desafios entre usuários
- [ ] Notificações push quando alguém te ultrapassar no ranking

## 📄 Licença

Parte do projeto NewSong - Plataforma de Ensino Musical
