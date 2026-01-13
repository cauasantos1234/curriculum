# 🎯 Sistema de Metas de Estudo - NewSong

## ✨ Funcionalidades Implementadas

### Editor de Metas Interativo

O sistema permite que os usuários personalizem suas metas de estudo, escolhendo entre 6 opções pré-definidas:

## 📋 Metas Disponíveis

| Ícone | Meta | Tipo | Objetivo | Descrição |
|-------|------|------|----------|-----------|
| ✅ | **Estudar 30 min por dia** | Diária | 7 dias consecutivos | Prática diária de 30 minutos |
| 📅 | **Estudar 3x por semana** | Semanal | 3 dias/semana | Pelo menos 3 sessões de estudo por semana |
| 📚 | **Completar Módulo Iniciante** | Aulas | 20 aulas | Concluir todas as aulas do módulo iniciante |
| 🎸 | **Aprender 5 músicas** | Músicas | 5 músicas | Dominar 5 músicas completas |
| ⏱️ | **Acumular 10h de prática** | Tempo | 600 minutos | Total de 10 horas de prática |
| 🔥 | **Manter sequência de 30 dias** | Sequência | 30 dias | Estudar por 30 dias consecutivos |

## 🎨 Interface

### Modal de Edição

Ao clicar em **"Editar"** na seção de Metas de Estudo:

```
┌────────────────────────────────────────┐
│  🎯 Editar Metas de Estudo         ✕  │
├────────────────────────────────────────┤
│                                        │
│  Escolha até 3 metas para acompanhar  │
│  seu progresso. Selecione as que mais │
│  combinam com seus objetivos musicais! │
│                                        │
│  ┌──────────┐  ┌──────────┐           │
│  │ ✅       │  │ 📚       │           │
│  │ Estudar  │  │ Completar│           │
│  │ 30 min   │  │ Módulo   │  ...      │
│  │ por dia  │  │ Iniciante│           │
│  └──────────┘  └──────────┘           │
│                                        │
├────────────────────────────────────────┤
│              [Cancelar] [💾 Salvar]   │
└────────────────────────────────────────┘
```

### Visualização no Perfil

As metas selecionadas aparecem com:
- ✅ **Ícone** visual da meta
- 📊 **Barra de progresso** animada
- 📈 **Contador** atual/objetivo
- 🎯 **Porcentagem** de conclusão

```
┌─────────────────────────────────────┐
│ ✅ Estudar 30 min por dia           │
│    7/7 dias                         │
│    ▓▓▓▓▓▓▓▓▓▓ 100%                │
├─────────────────────────────────────┤
│ 📚 Completar Módulo Iniciante       │
│    12/20 aulas                      │
│    ▓▓▓▓▓░░░░░ 60%                 │
├─────────────────────────────────────┤
│ 🎸 Aprender 5 músicas               │
│    2/5 músicas                      │
│    ▓▓▓░░░░░░░ 40%                 │
└─────────────────────────────────────┘
```

## 🔧 Como Funciona

### 1. Armazenamento

As metas são salvas no `localStorage`:

```javascript
// Key: 'newsong-study-goals'
[
  { id: 'daily_study', progress: 0 },
  { id: 'complete_module', progress: 0 },
  { id: 'learn_songs', progress: 0 }
]
```

### 2. Cálculo de Progresso Automático

O sistema calcula automaticamente o progresso baseado em:

| Tipo de Meta | Fonte de Dados |
|--------------|----------------|
| **Diária/Sequência** | `UserProgress.studyStreak` |
| **Aulas** | `UserProgress.completedLessonsCount` |
| **Tempo** | `UserProgress.studyTime` (em minutos) |
| **Músicas** | Progresso manual do usuário |

### 3. Atualização em Tempo Real

```javascript
// O progresso é recalculado automaticamente quando:
- Uma aula é concluída
- O tempo de estudo aumenta
- A sequência de dias é atualizada
```

## 🎯 Limite de Metas

- ✅ **Mínimo:** 1 meta
- ✅ **Máximo:** 3 metas simultâneas
- ⚠️ Se tentar selecionar mais de 3, recebe notificação

## 🎨 Design Responsivo

### Desktop
- Cards em **grid de 3 colunas**
- Modal centralizado (900px largura)
- Animações suaves de hover

### Mobile
- Cards em **coluna única**
- Modal adaptado (90% largura)
- Botões empilhados verticalmente

## 📝 Exemplo de Uso

### Passo 1: Abrir Editor
1. Acesse a página de **Perfil**
2. Role até **"Metas de Estudo"**
3. Clique em **"✏️ Editar"**

### Passo 2: Selecionar Metas
1. Clique em **até 3 cards** de metas
2. Cards selecionados ficam **dourados** com **✓**
3. Veja o badge **"Meta: X unidades"**

### Passo 3: Salvar
1. Clique em **"💾 Salvar Metas"**
2. Receba notificação de **sucesso**
3. Veja as metas atualizadas no perfil

## 🔄 Atualizações Dinâmicas

O progresso das metas é **atualizado automaticamente** quando:

```javascript
// Ao concluir uma aula
window.dispatchEvent(new Event('lessonCompleted'));

// O perfil detecta e atualiza:
loadStudyGoals(); // Recalcula tudo
```

## 🎨 Estados Visuais

### Card Normal
```css
border: 2px solid var(--border);
background: var(--card);
```

### Card Hover
```css
border-color: rgba(212,175,55,0.5);
transform: translateY(-4px);
box-shadow: 0 8px 24px rgba(212,175,55,0.2);
```

### Card Selecionado
```css
border-color: #d4af37;
background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05));
box-shadow: 0 0 30px rgba(212,175,55,0.3);
```

## 📊 Estrutura de Dados

### Definição de Meta
```javascript
{
  id: 'daily_study',           // Identificador único
  icon: '✅',                   // Emoji visual
  title: 'Estudar 30 min por dia',  // Título
  type: 'daily',               // Tipo (daily, lessons, time, etc.)
  target: 7,                   // Objetivo numérico
  unit: 'dias',                // Unidade de medida
  description: 'Prática diária de 30 minutos'  // Descrição
}
```

### Meta do Usuário
```javascript
{
  id: 'daily_study',    // Referência à definição
  progress: 5           // Progresso atual (calculado ou manual)
}
```

## 🚀 Funcionalidades Avançadas

### Validação
- ✅ Impede selecionar mais de 3 metas
- ✅ Exige pelo menos 1 meta selecionada
- ✅ Mostra notificações de erro/sucesso

### Animações
- ✅ Fade in/out do modal
- ✅ Scale animation do conteúdo
- ✅ Rotação do botão fechar
- ✅ Barra de progresso animada

### Acessibilidade
- ✅ Botões com `aria-label`
- ✅ Fechar com **ESC**
- ✅ Fechar clicando no **overlay**
- ✅ Cores contrastantes

## 🎯 Integração com Sistema de Progresso

```javascript
// As metas usam dados do UserProgress
const progress = window.UserProgress.loadProgress();
const stats = window.UserProgress.getUserStats();

// Exemplo: Meta de aulas
currentProgress = stats.completedLessonsCount;  // 12
targetValue = 20;                               // 20
percentage = (12/20) * 100;                     // 60%
```

## 📱 Notificações

### Sucesso
```javascript
showNotification(
  'Metas atualizadas!',
  'Você selecionou 3 meta(s). Continue praticando! 🎉',
  'success'
);
```

### Erro
```javascript
showNotification(
  'Limite atingido',
  'Você pode selecionar no máximo 3 metas.',
  'error'
);
```

## ✅ Checklist de Teste

- [ ] Abrir editor de metas
- [ ] Selecionar 1 meta (funciona)
- [ ] Selecionar 3 metas (funciona)
- [ ] Tentar selecionar 4ª meta (bloqueia)
- [ ] Desmarcar uma meta
- [ ] Salvar metas
- [ ] Ver metas atualizadas no perfil
- [ ] Ver barra de progresso animada
- [ ] Fechar modal com X
- [ ] Fechar modal com overlay
- [ ] Fechar modal com ESC
- [ ] Verificar responsividade mobile

## 🎉 Resultado Final

**Sistema completo de metas de estudo:**
- ✅ 6 metas pré-definidas
- ✅ Editor visual interativo
- ✅ Limite de 3 metas simultâneas
- ✅ Progresso calculado automaticamente
- ✅ Barras de progresso animadas
- ✅ Notificações elegantes
- ✅ Design responsivo
- ✅ Persistência no localStorage

**O usuário pode personalizar completamente suas metas de aprendizado!** 🎯🎶
