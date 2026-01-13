// auth.js - front-end auth simulation
(function(){
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  // Função para criar modal de notificação personalizado
  function showNotification(title, message, type = 'success') {
    // Remove notificação anterior se existir
    const existing = document.querySelector('.custom-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.innerHTML = `
      <div class="notification-content ${type}">
        <div class="notification-header">
          <div class="notification-icon">
            ${type === 'success' ? `
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            ` : `
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            `}
          </div>
          <h2>${title}</h2>
        </div>
        <div class="notification-body">
          <p>${message}</p>
        </div>
        <div class="notification-footer">
          <button class="notification-btn" onclick="this.closest('.custom-notification').remove()">
            <span>Entendi</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Adicionar estilos
    const style = document.createElement('style');
    style.textContent = `
      .custom-notification {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.4s ease;
        padding: 20px;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .notification-content {
        background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
        border: 3px solid rgba(212,175,55,0.4);
        border-radius: 28px;
        padding: 0;
        max-width: 600px;
        width: 100%;
        box-shadow: 0 25px 80px rgba(212,175,55,0.3), 0 0 100px rgba(212,175,55,0.1);
        animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        overflow: hidden;
        position: relative;
      }
      
      .notification-content::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 6px;
        background: linear-gradient(90deg, var(--gold-1, #d4af37), var(--gold-2, #ffd700), var(--gold-1, #d4af37));
        background-size: 200% 100%;
        animation: gradientMove 3s ease infinite;
      }
      
      @keyframes gradientMove {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      
      @keyframes slideUp {
        from { 
          transform: translateY(50px) scale(0.95); 
          opacity: 0; 
        }
        to { 
          transform: translateY(0) scale(1); 
          opacity: 1; 
        }
      }
      
      .notification-header {
        padding: 48px 48px 32px;
        text-align: center;
        background: linear-gradient(180deg, rgba(212,175,55,0.08) 0%, transparent 100%);
      }
      
      .notification-content.success .notification-icon {
        color: var(--gold-1, #d4af37);
      }
      
      .notification-content.error .notification-icon {
        color: #ff4444;
      }
      
      .notification-icon {
        margin: 0 auto 24px;
        width: 100px;
        height: 100px;
        background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse 2.5s ease infinite;
        border: 3px solid rgba(212,175,55,0.3);
        box-shadow: 0 0 40px rgba(212,175,55,0.2);
      }
      
      @keyframes pulse {
        0%, 100% { 
          transform: scale(1);
          box-shadow: 0 0 40px rgba(212,175,55,0.2);
        }
        50% { 
          transform: scale(1.05);
          box-shadow: 0 0 60px rgba(212,175,55,0.4);
        }
      }
      
      .notification-content h2 {
        font-size: 36px;
        font-weight: 900;
        background: linear-gradient(135deg, var(--gold-1, #d4af37), var(--gold-2, #ffd700));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0;
        letter-spacing: -0.5px;
        line-height: 1.2;
      }
      
      .notification-body {
        padding: 0 48px 32px;
        text-align: center;
      }
      
      .notification-body p {
        font-size: 17px;
        color: rgba(255,255,255,0.8);
        line-height: 1.7;
        margin: 0;
      }
      
      .notification-body p strong {
        color: var(--gold-1, #d4af37);
        font-weight: 700;
      }
      
      .notification-body p em {
        display: block;
        margin-top: 20px;
        font-size: 14px;
        color: rgba(255,255,255,0.5);
        font-style: normal;
      }
      
      .notification-footer {
        padding: 0 48px 48px;
        text-align: center;
      }
      
      .notification-btn {
        padding: 18px 56px;
        background: linear-gradient(135deg, var(--gold-1, #d4af37), var(--gold-2, #ffd700));
        border: none;
        border-radius: 14px;
        color: #0a0a0a;
        font-size: 17px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 10px 30px rgba(212,175,55,0.4);
        display: inline-flex;
        align-items: center;
        gap: 10px;
        letter-spacing: 0.5px;
      }
      
      .notification-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 40px rgba(212,175,55,0.6);
      }
      
      .notification-btn:active {
        transform: translateY(-1px);
      }
      
      .notification-btn svg {
        transition: transform 0.3s ease;
      }
      
      .notification-btn:hover svg {
        transform: translateX(4px);
      }
      
      /* Responsivo */
      @media (max-width: 600px) {
        .notification-content {
          border-radius: 20px;
          margin: 20px;
        }
        
        .notification-header {
          padding: 32px 24px 24px;
        }
        
        .notification-body {
          padding: 0 24px 24px;
        }
        
        .notification-footer {
          padding: 0 24px 32px;
        }
        
        .notification-content h2 {
          font-size: 28px;
        }
        
        .notification-body p {
          font-size: 15px;
        }
        
        .notification-icon {
          width: 80px;
          height: 80px;
        }
        
        .notification-icon svg {
          width: 48px;
          height: 48px;
        }
        
        .notification-btn {
          padding: 16px 40px;
          font-size: 16px;
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
  }

  function saveUser(data){
    const users = JSON.parse(localStorage.getItem('ns-users')||'[]');
    users.push(data); 
    localStorage.setItem('ns-users', JSON.stringify(users));
    console.log('Usuário salvo:', data);
    console.log('Total de usuários:', users.length);
  }
  
  // Funções de debug disponíveis no console
  window.debugAuth = {
    listarUsuarios: () => {
      const users = JSON.parse(localStorage.getItem('ns-users')||'[]');
      console.table(users.map(u => ({
        nome: u.name,
        email: u.email,
        tipo: u.role,
        senha: u.password
      })));
      return users;
    },
    limparUsuarios: () => {
      localStorage.removeItem('ns-users');
      console.log('✅ Todos os usuários foram removidos!');
    },
    criarProfessorTeste: () => {
      const testTeacher = {
        name: 'Professor Teste',
        email: 'professor@gmail.com',
        password: '123456',
        role: 'teacher'
      };
      saveUser(testTeacher);
      console.log('✅ Professor de teste criado!');
      console.log('Email: professor@gmail.com');
      console.log('Senha: 123456');
    },
    criarAlunoTeste: () => {
      const testStudent = {
        name: 'Aluno Teste',
        email: 'aluno@gmail.com',
        password: '123456',
        role: 'student'
      };
      saveUser(testStudent);
      console.log('✅ Aluno de teste criado!');
      console.log('Email: aluno@gmail.com');
      console.log('Senha: 123456');
    },
    sessaoAtual: () => {
      const session = JSON.parse(localStorage.getItem('ns-session')||'null');
      console.log('Sessão atual:', session);
      return session;
    }
  };
  
  console.log('🔧 Debug Auth disponível!');
  console.log('Digite "debugAuth.listarUsuarios()" para ver todos os usuários');
  console.log('Digite "debugAuth.criarProfessorTeste()" para criar um professor de teste');

  if(loginForm){
    loginForm.addEventListener('submit', e=>{
      e.preventDefault();
      const emailInput = document.getElementById('email');
      const passInput = document.getElementById('password');
      const email = emailInput.value.toLowerCase().trim();
      const pass = passInput.value;
      const users = JSON.parse(localStorage.getItem('ns-users')||'[]');
      
      console.log('=== TENTATIVA DE LOGIN ====================');
      console.log('Email digitado (original):', emailInput.value);
      console.log('Email processado (lowercase + trim):', email);
      console.log('Senha digitada:', pass);
      console.log('Comprimento da senha:', pass.length);
      console.log('Total de usuários registrados:', users.length);
      console.log('===========================================');
      
      console.log('Comparando com usuários registrados:');
      users.forEach((u, index) => {
        const userEmailProcessed = u.email.toLowerCase().trim();
        console.log(`\nUsuário ${index + 1}:`, {
          nome: u.name,
          email_original: u.email,
          email_processado: userEmailProcessed,
          senha: u.password,
          tipo: u.role,
          email_match: userEmailProcessed === email,
          senha_match: u.password === pass,
          login_valido: (userEmailProcessed === email && u.password === pass)
        });
      });
      
      const match = users.find(u=>u.email.toLowerCase().trim() === email && u.password === pass);
      
      if(match){ 
        console.log('\n✅ LOGIN BEM-SUCEDIDO!');
        console.log('Usuário autenticado:', match);
        localStorage.setItem('ns-session', JSON.stringify({
          email: match.email,
          name: match.name,
          role: match.role || 'student'
        }));
        
        // Verificar se o usuário tem progresso, se não tiver, criar um vazio
        const userProgressKey = `newsong-user-progress-${match.email}`;
        if(!localStorage.getItem(userProgressKey)){
          const emptyProgress = {
            completedLessons: [],
            studyTime: 0,
            lastStudyDate: null,
            studyStreak: 0,
            achievements: [],
            instrumentProgress: {},
            startDate: new Date().toISOString()
          };
          localStorage.setItem(userProgressKey, JSON.stringify(emptyProgress));
          console.log(`Progresso inicial criado para ${match.email} no login`);
        } else {
          console.log(`Progresso existente carregado para ${match.email}`);
        }
        
        // NOVO: Login no Supabase também
        if (typeof window.supabase !== 'undefined' && window.supabase.auth) {
          console.log('🔄 Fazendo login no Supabase também...');
          window.supabase.auth.signInWithPassword({
            email: email,
            password: pass
          }).then(({data, error}) => {
            if (error) {
              console.warn('⚠️ Erro ao fazer login no Supabase (isso é normal se o usuário não existe lá ainda):', error.message);
              // Não bloqueia o login - continua mesmo se Supabase falhar
              window.location.href = 'app.html';
            } else {
              console.log('✅ Login no Supabase bem-sucedido!');
              console.log('User ID no Supabase:', data.user.id);
              window.location.href = 'app.html';
            }
          }).catch(err => {
            console.warn('⚠️ Erro ao conectar com Supabase:', err);
            // Continua mesmo se Supabase falhar
            window.location.href = 'app.html';
          });
        } else {
          console.warn('⚠️ Supabase não disponível - pulando autenticação Supabase');
          window.location.href = 'app.html';
        } 
      } else { 
        console.log('\n❌ LOGIN FALHOU!');
        
        // Verificar se o email existe
        const emailExists = users.find(u=>u.email.toLowerCase().trim() === email);
        
        if (emailExists) {
          console.log('Email encontrado mas senha incorreta');
          console.log('Usuário encontrado:', emailExists);
          showNotification(
            'Senha incorreta',
            'A senha está incorreta. Por favor, tente novamente ou clique em "Esqueceu a senha?".',
            'error'
          );
        } else {
          console.log('Email não encontrado no sistema');
          showNotification(
            'Usuário não encontrado',
            'Não encontramos uma conta com este email. Verifique se digitou corretamente ou <strong>crie uma nova conta</strong>.',
            'error'
          );
        }
      }
      
      console.log('===========================================');
    });
  }

  if(registerForm){
    registerForm.addEventListener('submit', e=>{
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.toLowerCase().trim();
      const pass = document.getElementById('password').value;
      const accountType = document.querySelector('input[name="accountType"]:checked').value;
      
      // Verificar se o email já existe
      const users = JSON.parse(localStorage.getItem('ns-users')||'[]');
      const emailExists = users.find(u => u.email.toLowerCase().trim() === email);
      
      if (emailExists) {
        showNotification(
          'Email já cadastrado',
          'Este email já está registrado. Por favor, faça login ou use outro email.',
          'error'
        );
        return;
      }
      
      console.log('Registrando usuário:', {name, email, role: accountType});
      saveUser({name,email,password:pass,role:accountType});
      
      // Inicializar progresso vazio para o novo usuário
      const newUserProgressKey = `newsong-user-progress-${email}`;
      const emptyProgress = {
        completedLessons: [],
        studyTime: 0,
        lastStudyDate: null,
        studyStreak: 0,
        achievements: [],
        instrumentProgress: {},
        startDate: new Date().toISOString()
      };
      localStorage.setItem(newUserProgressKey, JSON.stringify(emptyProgress));
      console.log(`Progresso inicial criado para ${email}`);
      
      // NOVO: Registrar no Supabase também
      if (typeof window.supabase !== 'undefined' && window.supabase.auth) {
        console.log('🔄 Registrando no Supabase também...');
        window.supabase.auth.signUp({
          email: email,
          password: pass,
          options: {
            data: {
              name: name,
              role: accountType
            }
          }
        }).then(({data, error}) => {
          if (error) {
            console.warn('⚠️ Erro ao registrar no Supabase:', error.message);
            // Não bloqueia o registro - continua mesmo se Supabase falhar
          } else {
            console.log('✅ Registro no Supabase bem-sucedido!');
            console.log('User ID no Supabase:', data.user?.id);
          }
          
          // Continua com a notificação independentemente do Supabase
          showSuccessAndRedirect();
        }).catch(err => {
          console.warn('⚠️ Erro ao conectar com Supabase:', err);
          // Continua mesmo se Supabase falhar
          showSuccessAndRedirect();
        });
      } else {
        console.warn('⚠️ Supabase não disponível - pulando registro Supabase');
        showSuccessAndRedirect();
      }
      
      function showSuccessAndRedirect() {
        // Mensagens personalizadas por tipo de conta
        let welcomeTitle, welcomeMessage;
        
        if (accountType === 'teacher') {
          welcomeTitle = '🎓 Bem-vindo, Professor!';
          welcomeMessage = `Parabéns, ${name.split(' ')[0]}! 🎉<br><br>
            Sua conta de <strong>professor</strong> foi criada com sucesso! 🎸🎹🥁<br><br>
            Agora você pode fazer login e começar a compartilhar seu conhecimento musical com alunos do mundo todo. 
            Prepare suas aulas, grave vídeos incríveis e inspire a próxima geração de músicos! 🌟<br><br>
            <em>Você será redirecionado para a página de login em instantes...</em>`;
        } else {
          welcomeTitle = '🎉 Bem-vindo ao NewSong!';
          welcomeMessage = `Parabéns, ${name.split(' ')[0]}! 🎊<br><br>
            Sua conta foi criada com sucesso! 🎸🎹🥁<br><br>
            Agora você pode fazer login e começar sua jornada musical com os melhores instrutores. 
            Desenvolva suas habilidades, aprenda novos instrumentos e alcance seus objetivos musicais! 🚀<br><br>
            <em>Você será redirecionado para a página de login em instantes...</em>`;
        }
        
        showNotification(
          welcomeTitle,
          welcomeMessage,
          'success'
        );
        
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 4000);
      }
    });
  }
})();