# Sistema de Autenticação - NewSong

## 📋 Visão Geral

O sistema de autenticação do NewSong utiliza **localStorage** para armazenar informações de usuários e sessões, permitindo login, registro e perfil personalizado.

## 🔐 Como Funciona

### 1. Registro de Usuário (`register.html`)

Quando um usuário se registra:
- Nome completo
- Email
- Senha
- Tipo de conta (aluno ou professor)

**Armazenamento:**
```javascript
localStorage.setItem('ns-users', JSON.stringify([
  {
    name: "João Silva",
    email: "joao@exemplo.com", 
    password: "senha123",
    role: "student"
  }
]));
```

### 2. Login (`login.html`)

Ao fazer login, o sistema:
1. Verifica se email e senha existem no array `ns-users`
2. Se válido, cria uma sessão em `ns-session`:

```javascript
localStorage.setItem('ns-session', JSON.stringify({
  email: "joao@exemplo.com",
  name: "João Silva",
  role: "student"
}));
```

3. Redireciona para `app.html`

### 3. Perfil do Usuário (`profile.html`)

A página de perfil **busca automaticamente** os dados da sessão:

```javascript
const session = JSON.parse(localStorage.getItem('ns-session') || '{}');
const userInfo = {
  name: session.name || 'Usuário',
  email: session.email || 'usuario@exemplo.com',
  // ... outras informações
};
```

**Dados exibidos:**
- ✅ **Nome completo** do usuário
- ✅ **Email** cadastrado
- ✅ **Avatar** com iniciais do nome
- ✅ **Estatísticas** de progresso
- ✅ **Conquistas** desbloqueadas

## 📊 Estrutura de Dados

### localStorage Keys

| Key | Descrição | Formato |
|-----|-----------|---------|
| `ns-users` | Lista de todos os usuários cadastrados | Array de objetos |
| `ns-session` | Dados do usuário logado atualmente | Objeto |
| `newsong-progress` | Progresso individual do usuário | Objeto |
| `newsong-theme` | Tema escolhido (dark/light) | String |

### Exemplo de Sessão Ativa

```json
{
  "email": "maria@exemplo.com",
  "name": "Maria Santos",
  "role": "student"
}
```

## 🎯 Fluxo de Autenticação

```
┌─────────────┐
│  register   │
│   .html     │
└──────┬──────┘
       │ Cria usuário
       │ em ns-users
       ▼
┌─────────────┐
│   login     │
│   .html     │
└──────┬──────┘
       │ Valida e cria
       │ sessão em
       │ ns-session
       ▼
┌─────────────┐
│    app      │
│   .html     │  ◄── Página principal
└─────────────┘
       │
       │ Usuário acessa
       │ o perfil
       ▼
┌─────────────┐
│  profile    │
│   .html     │  ◄── Busca dados de ns-session
└─────────────┘
```

## 🔍 Como Verificar o Email Logado

### No Console do Navegador

```javascript
// Ver usuário logado
const session = JSON.parse(localStorage.getItem('ns-session'));
console.log('Usuário:', session.name);
console.log('Email:', session.email);

// Ver todos os usuários cadastrados
const users = JSON.parse(localStorage.getItem('ns-users'));
console.log('Usuários:', users);
```

### Na Interface

1. Acesse a página de perfil (`profile.html`)
2. O **nome** e **email** do usuário logado aparecem no topo
3. O **avatar** mostra as iniciais do nome

## 🎨 Personalização Automática

### Avatar com Iniciais

```javascript
// Pega as iniciais do nome
const initials = userInfo.name.split(' ')
  .map(word => word.charAt(0))
  .slice(0, 2)
  .join('')
  .toUpperCase();

// Exemplo: "João Silva" → "JS"
```

### Badges de Nível

O nível do usuário é calculado com base no progresso:
- **Bronze**: 0-19 aulas concluídas
- **Prata**: 20-49 aulas concluídas  
- **Ouro**: 50+ aulas concluídas

## 🔧 Funções Principais

### `auth.js`

```javascript
// Salvar novo usuário
function saveUser(data){
  const users = JSON.parse(localStorage.getItem('ns-users')||'[]');
  users.push(data);
  localStorage.setItem('ns-users', JSON.stringify(users));
}

// Criar sessão
localStorage.setItem('ns-session', JSON.stringify({
  email: match.email,
  name: match.name,
  role: match.role || 'student'
}));
```

### `profile.js`

```javascript
// Carregar dados da sessão
const session = JSON.parse(localStorage.getItem('ns-session') || '{}');
const userInfo = {
  name: session.name || 'Usuário',
  email: session.email || 'usuario@exemplo.com',
  // ...
};

// Exibir informações
function loadPersonalInfo(){
  document.getElementById('profileName').textContent = userInfo.name;
  document.getElementById('profileEmail').textContent = userInfo.email;
  // ...
}
```

## 🚀 Exemplo Prático

### Criar e Logar um Novo Usuário

1. **Registro** (`register.html`):
   - Nome: `Ana Costa`
   - Email: `ana.costa@email.com`
   - Senha: `senha123`
   - Tipo: Aluno

2. **Login** (`login.html`):
   - Email: `ana.costa@email.com`
   - Senha: `senha123`

3. **Resultado** no perfil:
   - Nome exibido: **Ana Costa**
   - Email exibido: **ana.costa@email.com**
   - Avatar: **AC**
   - Badge: **Nível Bronze** (iniciante)

## 📝 Observações

- ✅ O sistema é **totalmente funcional** com localStorage
- ✅ **Não requer backend** para funcionar
- ✅ Dados persistem no navegador
- ⚠️ Limpar cache/localStorage remove os dados
- ⚠️ Senha armazenada em texto simples (apenas protótipo)

## 🎓 Para Desenvolvimento Futuro

Para produção, considere:
- Usar **autenticação real** (Firebase, Supabase, etc.)
- **Criptografar senhas** (bcrypt)
- **Tokens JWT** para sessões
- **Validação server-side**
- **Proteção contra XSS**

---

**Sistema implementado e funcionando! 🎉**
