# 🎓 Sistema de Interações do Aluno

## 📋 Resumo
Sistema completo de interações para alunos em vídeos: visualizações únicas, likes/dislikes únicos por usuário, sistema de comentários com respostas.

---

## ✅ Funcionalidades Implementadas

### 1. 👁️ Contador de Visualizações no Modal
**Localização:** Dentro do modal do vídeo (seção de informações)

**Como funciona:**
- Quando abre o vídeo, o contador exibe as visualizações reais do sistema VideoViews
- Atualiza automaticamente após registrar a visualização do usuário
- Mostra o número total de visualizações únicas

**Código:**
```javascript
// Busca visualizações reais e atualiza o modal
if(window.VideoViews && video.id){
  const stats = window.VideoViews.getVideoViewStats(video.id);
  const modalViewCount = document.getElementById(`modalViewCount-${video.id}`);
  if(modalViewCount && stats.totalViews > 0){
    modalViewCount.textContent = stats.totalViews.toLocaleString();
  }
}
```

---

### 2. 👍👎 Sistema de Likes Únicos (Vídeo)
**Regras:**
- ✅ Cada usuário pode dar **apenas 1 like** por vídeo
- ✅ Cada usuário pode dar **apenas 1 dislike** por vídeo
- ✅ Ao dar like, remove automaticamente o dislike (e vice-versa)
- ❌ **NÃO é possível remover** - uma vez curtido, permanece curtido
- 🔐 Requer login para interagir

**Armazenamento:**
```javascript
// Chaves no localStorage por usuário
video-{videoId}-like-{userEmail} = "liked"
video-{videoId}-dislike-{userEmail} = "disliked"

// Estatísticas gerais
video-{videoId}-interaction = {
  "likes": 5,
  "dislikes": 2
}
```

**Mensagens de Feedback:**
- "Você já curtiu este vídeo!" - Se tentar curtir novamente
- "Você já deu dislike neste vídeo!" - Se tentar dar dislike novamente
- "Você precisa estar logado para curtir!" - Se não estiver logado

---

### 3. 💬 Sistema de Comentários e Respostas

#### 3.1 Comentários Principais
**Recursos:**
- ✅ Exibe nome do usuário logado (da sessão)
- ✅ Data relativa ("há 5 min", "há 2h", "há 3d")
- ✅ Sistema de likes únicos por comentário
- ✅ Botão de responder funcional
- 🔐 Requer login para comentar

**Formato do Comentário:**
```javascript
{
  id: 1234567890,           // timestamp único
  text: "Ótima aula!",      // conteúdo
  author: "João Silva",     // nome da sessão
  date: "2025-11-27...",    // ISO timestamp
  likes: 5,                 // contador de likes
  replies: [...]            // array de respostas
}
```

#### 3.2 Sistema de Respostas
**Como funciona:**
1. Clique em "Responder" no comentário
2. Abre caixa de texto para resposta
3. Digite a resposta
4. Clique em "Responder" para enviar ou "Cancelar" para fechar
5. Resposta aparece indentada abaixo do comentário original

**Visual das Respostas:**
- 📏 Indentação de 40px à esquerda
- 🟣 Borda roxa no lado esquerdo
- 👤 Avatar menor (32px vs 40px)
- 📝 Texto um pouco menor

**Formato da Resposta:**
```javascript
{
  id: 1234567891,
  text: "Obrigado!",
  author: "Professor Diego",
  date: "2025-11-27..."
}
```

#### 3.3 Likes em Comentários
**Regras:**
- ✅ Cada usuário pode dar **apenas 1 like** por comentário
- ❌ Não é possível remover o like
- 🎨 Botão fica destacado após curtir (roxo)
- 🔐 Requer login

**Armazenamento:**
```javascript
// Chave única por usuário e comentário
comment-{commentId}-like-{userEmail} = "liked"
```

---

## 🎨 Estilos CSS Implementados

### Estados dos Botões

**Like Ativo (Vídeo):**
```css
.btn-action.active {
  background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1));
  border-color: rgba(124,58,237,0.4);
  color: var(--accent);
}
```

**Like Ativo (Comentário):**
```css
.comment-like-btn.active {
  background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1));
  border-color: rgba(124,58,237,0.4);
  color: var(--accent);
}
```

### Caixa de Resposta
```css
.reply-box {
  margin-top: 12px;
  padding: 12px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
}

.reply-input {
  width: 100%;
  padding: 12px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  min-height: 60px;
}
```

### Container de Respostas
```css
.replies-container {
  margin-top: 12px;
  margin-left: 40px;
  border-left: 2px solid rgba(124,58,237,0.2);
  padding-left: 12px;
}
```

---

## 📊 Fluxo de Dados

### Inicialização do Modal
```
1. openVideoModal(video)
2. Registra visualização (VideoViews)
3. Atualiza contador no modal
4. Carrega likes/dislikes do usuário
5. Carrega comentários e respostas
6. Inicializa botão de concluir aula
```

### Like em Vídeo
```
1. Usuário clica em 👍
2. Verifica se está logado
3. Verifica se já curtiu (chave no localStorage)
4. Se já curtiu → Mostra alerta
5. Se não curtiu:
   - Remove dislike se existir
   - Adiciona like
   - Salva chave do usuário
   - Atualiza contador
   - Aplica estilo .active
```

### Comentário com Resposta
```
1. Usuário clica em "Responder"
2. Abre caixa de resposta (toggleReplyBox)
3. Usuário digita e clica em "Responder"
4. Verifica login
5. Adiciona resposta ao array replies[] do comentário
6. Salva no localStorage
7. Recarrega comentários
8. Fecha caixa de resposta
```

---

## 🔧 Funções JavaScript Principais

### Gerenciamento de Likes (Vídeo)
```javascript
window.handleLike(videoId)          // Adiciona like no vídeo
window.handleDislike(videoId)       // Adiciona dislike no vídeo
initializeVideoInteractions(videoId) // Carrega estado atual
```

### Gerenciamento de Comentários
```javascript
window.postComment(videoId)                 // Posta novo comentário
window.clearComment(videoId)                // Limpa caixa de texto
window.likeComment(videoId, commentId)      // Curte comentário
loadComments(videoId)                       // Carrega todos os comentários
formatCommentDate(dateString)               // Formata data relativa
```

### Sistema de Respostas
```javascript
window.toggleReplyBox(commentId)            // Abre/fecha caixa de resposta
window.postReply(videoId, commentId)        // Envia resposta
```

---

## 🧪 Como Testar

### Teste 1: Contador de Visualizações no Modal
1. Abra um vídeo
2. Verifique o número de visualizações na seção de informações
3. Feche o modal
4. Abra o mesmo vídeo novamente
5. ✅ O contador deve manter o mesmo valor (não conta 2x)

### Teste 2: Likes Únicos no Vídeo
1. Faça login como Aluno
2. Abra um vídeo
3. Clique em 👍 (like)
4. ✅ Botão fica roxo, contador aumenta
5. Clique novamente em 👍
6. ✅ Mostra alerta "Você já curtiu este vídeo!"
7. Clique em 👎 (dislike)
8. ✅ Remove like, adiciona dislike

### Teste 3: Comentários e Respostas
1. Faça login como Aluno
2. Abra um vídeo
3. Digite um comentário e envie
4. ✅ Comentário aparece com seu nome
5. Clique em "Responder" no comentário
6. ✅ Caixa de resposta abre
7. Digite e envie resposta
8. ✅ Resposta aparece indentada abaixo
9. Clique em 👍 no comentário
10. ✅ Botão fica roxo
11. Tente curtir novamente
12. ✅ Mostra alerta "Você já curtiu este comentário!"

### Teste 4: Multi-usuário
1. Faça login com conta A
2. Curta um vídeo e comente
3. Faça logout
4. Faça login com conta B
5. ✅ Pode curtir o mesmo vídeo (contador aumenta)
6. ✅ Pode curtir o comentário da conta A
7. ✅ Pode responder o comentário

---

## 📦 Arquivos Modificados

### JavaScript
- `public/js/videos.js`
  - `openVideoModal()` - Atualiza contador de views no modal
  - `handleLike()` - Sistema de likes únicos com email do usuário
  - `handleDislike()` - Sistema de dislikes únicos
  - `initializeVideoInteractions()` - Verifica likes do usuário atual
  - `postComment()` - Usa nome da sessão
  - `likeComment()` - Likes únicos por comentário
  - `loadComments()` - Renderiza com respostas e estado de like
  - `toggleReplyBox()` - Novo
  - `postReply()` - Novo

### CSS
- `public/css/styles.css`
  - `.comment-like-btn.active` - Estado ativo do like
  - `.reply-box` - Container da caixa de resposta
  - `.reply-input` - Campo de texto da resposta
  - `.reply-actions` - Botões da resposta
  - `.btn-cancel-reply` - Botão cancelar
  - `.btn-post-reply` - Botão enviar resposta
  - `.replies-container` - Container das respostas
  - `.reply-item` - Item de resposta

### HTML
- `public/videos.html`
  - Modal já tem estrutura de comentários
  - Botão de fechar agora tem ID para event listener

---

## 🎯 Diferenças: Aluno vs Professor

### Conta de Aluno (Atual)
- ✅ Visualiza vídeos e conta views
- ✅ Pode curtir/dar dislike (1x por vídeo)
- ✅ Pode comentar
- ✅ Pode responder comentários
- ✅ Pode curtir comentários (1x por comentário)
- ✅ Pode concluir aulas

### Conta de Professor (Futuro)
- ✅ Pode ver estatísticas detalhadas
- ✅ Pode ver quem curtiu/comentou
- ✅ Pode responder alunos
- ✅ Pode fixar comentários
- ✅ Pode moderar comentários
- ❌ Visualizações não contam
- 🔜 A ser implementado separadamente

---

## 🔒 Segurança e Validações

### Validações Implementadas
1. ✅ Verifica se usuário está logado antes de interagir
2. ✅ Usa email do usuário como chave única
3. ✅ Valida texto antes de postar comentário/resposta
4. ✅ Previne múltiplos likes/dislikes por usuário
5. ✅ Armazena dados no localStorage por segurança local

### Mensagens de Erro
- "Você precisa estar logado para curtir!"
- "Você precisa estar logado para dar dislike!"
- "Você precisa estar logado para comentar!"
- "Você precisa estar logado para responder!"
- "Você já curtiu este vídeo!"
- "Você já deu dislike neste vídeo!"
- "Você já curtiu este comentário!"
- "Por favor, escreva um comentário antes de enviar."
- "Por favor, escreva uma resposta antes de enviar."

---

## 📝 Exemplo de Dados no localStorage

### Likes do Vídeo
```javascript
// Usuário aluno1@teste.com curtiu vídeo 10101
"video-10101-like-aluno1@teste.com": "liked"

// Usuário aluno2@teste.com deu dislike no vídeo 10101
"video-10101-dislike-aluno2@teste.com": "disliked"

// Estatísticas do vídeo 10101
"video-10101-interaction": {
  "likes": 5,
  "dislikes": 2
}
```

### Comentários
```javascript
"video-10101-comments": [
  {
    "id": 1732723200000,
    "text": "Ótima aula! Aprendi muito sobre as partes da guitarra.",
    "author": "João Silva",
    "date": "2025-11-27T14:00:00.000Z",
    "likes": 3,
    "replies": [
      {
        "id": 1732723500000,
        "text": "Que bom que gostou! Continue praticando!",
        "author": "Professor Diego",
        "date": "2025-11-27T14:05:00.000Z"
      }
    ]
  }
]
```

### Likes em Comentários
```javascript
// Usuário aluno1@teste.com curtiu comentário 1732723200000
"comment-1732723200000-like-aluno1@teste.com": "liked"
```

---

## ✨ Melhorias Futuras (Sugestões)

### Para Alunos
- [ ] Editar/deletar próprio comentário
- [ ] Notificações quando alguém responde
- [ ] Marcar comentário como "Respondido"
- [ ] Ordenar comentários (mais recentes, mais curtidos)
- [ ] Buscar comentários

### Para Professores
- [ ] Dashboard de comentários
- [ ] Resposta destacada do professor
- [ ] Fixar comentários importantes
- [ ] Moderar/deletar comentários
- [ ] Ver lista de quem curtiu
- [ ] Estatísticas de engajamento

### Sistema
- [ ] Backend real (Supabase)
- [ ] Notificações em tempo real
- [ ] Sistema de menções (@usuario)
- [ ] Upload de imagens nos comentários
- [ ] Markdown nos comentários

---

## 🐛 Debug e Logs

### Console Logs Implementados
```javascript
// Ao atualizar views no modal
console.log('👁️ Visualizações atualizadas no modal:', totalViews);

// Ao registrar visualização
console.log('📹 Registrando visualização:', videoId);
console.log('✅ View registrada:', result);
```

### Como Debugar
1. Abra DevTools (F12)
2. Vá para Console
3. Execute comandos:
```javascript
// Ver likes de um vídeo
localStorage.getItem('video-10101-interaction')

// Ver comentários
localStorage.getItem('video-10101-comments')

// Ver se usuário curtiu
localStorage.getItem('video-10101-like-seuemail@teste.com')

// Limpar todos os likes (debug)
Object.keys(localStorage).filter(k => k.includes('-like-')).forEach(k => localStorage.removeItem(k))
```

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique o console (F12) para erros
2. Verifique se está logado (`localStorage.getItem('ns-session')`)
3. Limpe o cache (Ctrl+F5)
4. Verifique se os scripts estão carregando na ordem correta

**Ordem de Scripts em `videos.html`:**
```html
<script src="js/user-progress.js"></script>
<script src="js/video-storage.js"></script>
<script src="js/video-views.js"></script>
<script src="js/videos.js"></script>
```

---

✅ **Sistema Completo e Funcional!** 🎉
