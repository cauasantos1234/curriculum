# 🎯 Todas as Metas de Estudo Disponíveis

## 📊 Total: 11 Metas para Escolher

O usuário pode selecionar **até 3 metas simultâneas** dentre as 11 opções disponíveis:

---

## 📚 Categoria: Estudo Regular

### 1. ✅ Estudar 30 min por dia
- **Tipo:** Diária
- **Meta:** 7 dias consecutivos
- **Descrição:** Prática diária de 30 minutos
- **Progresso:** Baseado na sequência de estudo (`studyStreak`)

### 2. 📅 Estudar 3x por semana
- **Tipo:** Semanal
- **Meta:** 3 dias/semana
- **Descrição:** Pelo menos 3 sessões de estudo por semana
- **Progresso:** Manual (atualizado pelo usuário)

### 3. 🎹 Praticar escalas diariamente
- **Tipo:** Diária
- **Meta:** 14 dias consecutivos
- **Descrição:** Praticar escalas por 14 dias seguidos
- **Progresso:** Baseado na sequência de estudo (`studyStreak`)

---

## 🎓 Categoria: Conclusão de Aulas

### 4. 📚 Completar Módulo Iniciante
- **Tipo:** Aulas
- **Meta:** 20 aulas
- **Descrição:** Concluir todas as aulas do módulo iniciante
- **Progresso:** Baseado em aulas concluídas (`completedLessonsCount`)

### 5. 📺 Assistir 15 vídeo-aulas
- **Tipo:** Vídeos
- **Meta:** 15 vídeos
- **Descrição:** Completar 15 vídeo-aulas completas
- **Progresso:** Baseado em aulas concluídas (`completedLessonsCount`)

---

## 🎸 Categoria: Habilidades Musicais

### 6. 🎸 Aprender 5 músicas
- **Tipo:** Músicas
- **Meta:** 5 músicas
- **Descrição:** Dominar 5 músicas completas
- **Progresso:** Manual (atualizado pelo usuário)

### 7. 🎼 Dominar 10 técnicas
- **Tipo:** Técnicas
- **Meta:** 10 técnicas
- **Descrição:** Aprender e dominar 10 técnicas musicais
- **Progresso:** Manual (atualizado pelo usuário)

### 8. 📖 Estudar teoria musical
- **Tipo:** Teoria
- **Meta:** 10 lições
- **Descrição:** Completar 10 lições de teoria musical
- **Progresso:** Manual (atualizado pelo usuário)

---

## ⏱️ Categoria: Tempo de Prática

### 9. ⏱️ Acumular 10h de prática
- **Tipo:** Tempo
- **Meta:** 600 minutos (10 horas)
- **Descrição:** Total de 10 horas de prática
- **Progresso:** Baseado no tempo acumulado (`studyTime`)

### 10. 🔥 Manter sequência de 30 dias
- **Tipo:** Sequência
- **Meta:** 30 dias
- **Descrição:** Estudar por 30 dias consecutivos
- **Progresso:** Baseado na sequência (`studyStreak`)

---

## 🎤 Categoria: Registro e Avaliação

### 11. 🎤 Gravar 5 práticas
- **Tipo:** Gravações
- **Meta:** 5 gravações
- **Descrição:** Gravar e revisar 5 sessões de prática
- **Progresso:** Manual (atualizado pelo usuário)

---

## 📊 Tabela Resumida

| # | Ícone | Meta | Objetivo | Tipo de Progresso |
|---|-------|------|----------|-------------------|
| 1 | ✅ | Estudar 30 min/dia | 7 dias | Automático (streak) |
| 2 | 📅 | Estudar 3x/semana | 3 dias/sem | Manual |
| 3 | 📚 | Completar Módulo Iniciante | 20 aulas | Automático (aulas) |
| 4 | 🎸 | Aprender 5 músicas | 5 músicas | Manual |
| 5 | ⏱️ | Acumular 10h prática | 600 mins | Automático (tempo) |
| 6 | 🔥 | Sequência 30 dias | 30 dias | Automático (streak) |
| 7 | 🎼 | Dominar 10 técnicas | 10 técnicas | Manual |
| 8 | 🎹 | Praticar escalas | 14 dias | Automático (streak) |
| 9 | 📺 | Assistir 15 vídeos | 15 vídeos | Automático (aulas) |
| 10 | 🎤 | Gravar 5 práticas | 5 gravações | Manual |
| 11 | 📖 | Estudar teoria | 10 lições | Manual |

---

## 🎯 Como Selecionar

No editor de metas, o usuário verá um **grid visual** com todas as 11 opções:

```
┌─────────────────────────────────────────────┐
│  🎯 Editar Metas de Estudo              ✕   │
├─────────────────────────────────────────────┤
│                                             │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│  │ ✅ │ │ 📅 │ │ 📚 │ │ 🎸 │              │
│  └────┘ └────┘ └────┘ └────┘              │
│                                             │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐              │
│  │ ⏱️ │ │ 🔥 │ │ 🎼 │ │ 🎹 │              │
│  └────┘ └────┘ └────┘ └────┘              │
│                                             │
│  ┌────┐ ┌────┐ ┌────┐                      │
│  │ 📺 │ │ 🎤 │ │ 📖 │                      │
│  └────┘ └────┘ └────┘                      │
│                                             │
│  Escolha até 3 metas!                      │
│                                             │
├─────────────────────────────────────────────┤
│              [Cancelar] [💾 Salvar Metas]   │
└─────────────────────────────────────────────┘
```

---

## 📈 Tipos de Progresso

### 🤖 Progresso Automático
Calculado automaticamente pelo sistema:
- ✅ **Estudo diário** - Via `studyStreak`
- 🎹 **Praticar escalas** - Via `studyStreak`
- 📚 **Completar módulo** - Via `completedLessonsCount`
- 📺 **Assistir vídeos** - Via `completedLessonsCount`
- ⏱️ **Tempo de prática** - Via `studyTime`
- 🔥 **Sequência de dias** - Via `studyStreak`

### 👤 Progresso Manual
Atualizado pelo usuário (funcionalidade futura):
- 📅 **Estudar 3x/semana**
- 🎸 **Aprender músicas**
- 🎼 **Dominar técnicas**
- 🎤 **Gravar práticas**
- 📖 **Estudar teoria**

---

## 🎨 Exemplos Visuais

### Meta com Progresso Alto (80%+)
```
┌─────────────────────────────────┐
│ 🔥 Manter sequência de 30 dias  │
│    25/30 dias                   │
│    ▓▓▓▓▓▓▓▓░░ 83%              │
└─────────────────────────────────┘
```

### Meta com Progresso Médio (40-60%)
```
┌─────────────────────────────────┐
│ 📚 Completar Módulo Iniciante   │
│    12/20 aulas                  │
│    ▓▓▓▓▓░░░░░ 60%              │
└─────────────────────────────────┘
```

### Meta Iniciando (0-20%)
```
┌─────────────────────────────────┐
│ 🎸 Aprender 5 músicas           │
│    1/5 músicas                  │
│    ▓░░░░░░░░░ 20%              │
└─────────────────────────────────┘
```

---

## 💡 Sugestões de Combinações

### 🔰 Iniciante
- ✅ Estudar 30 min por dia (7 dias)
- 📚 Completar Módulo Iniciante (20 aulas)
- 🎸 Aprender 5 músicas

### 🎯 Intermediário
- 🔥 Manter sequência de 30 dias
- 🎼 Dominar 10 técnicas
- ⏱️ Acumular 10h de prática

### 🏆 Avançado
- 📺 Assistir 15 vídeo-aulas
- 🎤 Gravar 5 práticas
- 📖 Estudar teoria musical (10 lições)

### 🎹 Foco em Técnica
- 🎹 Praticar escalas diariamente (14 dias)
- 🎼 Dominar 10 técnicas
- 📖 Estudar teoria musical

### 🎸 Foco em Repertório
- 🎸 Aprender 5 músicas
- 🎤 Gravar 5 práticas
- 📺 Assistir 15 vídeo-aulas

---

## 🚀 Próximos Passos

Para implementar atualização manual de progresso:

```javascript
// Adicionar botões de incremento nas metas manuais
function updateManualGoalProgress(goalId, increment = 1) {
  const goals = loadUserGoals();
  const goal = goals.find(g => g.id === goalId);
  
  if(goal) {
    goal.progress = (goal.progress || 0) + increment;
    saveUserGoals(goals);
    loadStudyGoals(); // Atualizar visualização
  }
}
```

---

## ✅ Resumo

- ✅ **11 metas disponíveis** (era 6, adicionamos 5)
- ✅ **Seleção de até 3 metas** simultâneas
- ✅ **6 tipos diferentes** de progresso
- ✅ **Progresso automático** para 6 metas
- ✅ **Progresso manual** para 5 metas
- ✅ **Interface visual** elegante
- ✅ **Categorias variadas**: estudo, habilidades, tempo, gravação

**O sistema agora oferece muito mais opções para personalização!** 🎉🎯🎶
