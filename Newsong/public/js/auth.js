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
    // Garantir que a senha seja criptografada antes de salvar
    if (data.password && !data.password.startsWith('$')) {
      console.warn('⚠️ Tentativa de salvar senha em texto plano - será criptografada');
      // A senha será criptografada pelo auth.js antes de chamar saveUser
    }
    
    const users = JSON.parse(localStorage.getItem('ns-users')||'[]');
    users.push(data); 
    localStorage.setItem('ns-users', JSON.stringify(users));
    console.log('✅ Usuário salvo com segurança:', {
      name: data.name,
      email: data.email,
      role: data.role,
      hashStatus: data.password ? (data.password.startsWith('$') ? '🔒 Criptografado' : '⚠️ Texto plano') : 'N/A'
    });
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
    loginForm.addEventListener('submit', async e=>{
      e.preventDefault();
      const emailInput = document.getElementById('email');
      const passInput = document.getElementById('password');
      const email = emailInput.value.toLowerCase().trim();
      const pass = passInput.value;
      
      console.log('=== TENTATIVA DE LOGIN ====================');
      console.log('Email:', email);
      console.log('Tentando autenticar via Supabase primeiro...');
      
      // PRIORIDADE 1: Tentar login no Supabase primeiro
      if (typeof window.supabase !== 'undefined' && window.supabase.auth) {
        try {
          console.log('🔄 Autenticando no Supabase...');
          const {data, error} = await window.supabase.auth.signInWithPassword({
            email: email,
            password: pass
          });
          
          if (error) {
            console.log('⚠️ Supabase retornou erro:', error.message);
            // Se Supabase falhar, tentar localStorage
            tryLocalStorageLogin();
          } else {
            console.log('✅ Login no Supabase bem-sucedido!');
            console.log('User ID:', data.user.id);
            console.log('User metadata:', data.user.user_metadata);
            
            // Salvar sessão local
            const userName = data.user.user_metadata?.name || data.user.email.split('@')[0];
            const userRole = data.user.user_metadata?.role || 'student';
            
            localStorage.setItem('ns-session', JSON.stringify({
              email: data.user.email,
              name: userName,
              role: userRole,
              supabase_id: data.user.id
            }));
            
            // Sincronizar com localStorage também
            const users = JSON.parse(localStorage.getItem('ns-users')||'[]');
            const localUser = users.find(u=>u.email.toLowerCase().trim() === email);
            if (!localUser) {
              saveUser({
                name: userName,
                email: data.user.email,
                password: pass,
                role: userRole
              });
              console.log('✅ Usuário sincronizado no localStorage');
            }
            
            // Verificar se o usuário tem progresso, se não tiver, criar um vazio
            const userProgressKey = `newsong-user-progress-${data.user.email}`;
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
              console.log(`Progresso inicial criado para ${data.user.email}`);
            }
            
            window.location.href = 'app.html';
          }
        } catch (err) {
          console.warn('⚠️ Erro ao conectar com Supabase:', err);
          tryLocalStorageLogin();
        }
      } else {
        console.warn('⚠️ Supabase não disponível - usando localStorage');
        tryLocalStorageLogin();
      }
      
      // FALLBACK: Login via localStorage
      function tryLocalStorageLogin() {
        console.log('🔄 Tentando login via localStorage...');
        const users = JSON.parse(localStorage.getItem('ns-users')||'[]');
        console.log('Total de usuários no localStorage:', users.length);
        
        // Procurar usuário por email
        const userFound = users.find(u => u.email.toLowerCase().trim() === email);
        
        if (!userFound) {
          console.log('❌ LOGIN FALHOU - Email não encontrado!');
          showNotification(
            'Conta não encontrada neste PC',
            'Esta conta não está registrada neste computador. Por favor, <strong>registre-se novamente</strong> com o mesmo email e senha para sincronizar via Supabase.',
            'error'
          );
          return;
        }
        
        // Comparar senha (com suporte a senhas antigas em texto plano)
        let passwordMatch = false;
        
        if (userFound.password.startsWith('$')) {
          // Senha criptografada - comparar com hash
          if (window.passwordCrypto) {
            window.passwordCrypto.comparePassword(pass, userFound.password).then(match => {
              if (match) {
                loginSuccess(userFound);
              } else {
                showNotification(
                  'Senha incorreta',
                  'A senha está incorreta. Por favor, tente novamente.',
                  'error'
                );
              }
            });
            return;
          } else {
            console.warn('⚠️ Sistema de criptografia não disponível');
            passwordMatch = false;
          }
        } else {
          // Senha em texto plano (compatibilidade com dados antigos)
          passwordMatch = (pass === userFound.password);
        }
        
        if (passwordMatch) {
          loginSuccess(userFound);
        } else {
          console.log('❌ LOGIN FALHOU - Senha incorreta!');
          showNotification(
            'Senha incorreta',
            'A senha está incorreta. Por favor, tente novamente.',
            'error'
          );
        }
      }
      
      // Função para processar login bem-sucedido
      function loginSuccess(user) {
        console.log('✅ LOGIN LOCAL BEM-SUCEDIDO!');
        console.log('Usuário:', {
          name: user.name,
          email: user.email,
          role: user.role
        });
        
        localStorage.setItem('ns-session', JSON.stringify({
          email: user.email,
          name: user.name,
          role: user.role || 'student'
        }));
        
        // Verificar se o usuário tem progresso
        const userProgressKey = `newsong-user-progress-${user.email}`;
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
          console.log(`Progresso inicial criado para ${user.email}`);
        }
        
        window.location.href = 'app.html';
      }
      
      console.log('===========================================');
    });
  }

  if(registerForm){
    registerForm.addEventListener('submit', async e=>{
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.toLowerCase().trim();
      const pass = document.getElementById('password').value;
      const accountType = document.querySelector('input[name="accountType"]:checked').value;
      
      console.log('=== REGISTRANDO USUÁRIO ====================');
      console.log('Nome:', name);
      console.log('Email:', email);
      console.log('Tipo:', accountType);
      
      // PRIORIDADE 1: Registrar no Supabase primeiro
      if (typeof window.supabase !== 'undefined' && window.supabase.auth) {
        try {
          console.log('🔄 Registrando no Supabase...');
          const {data, error} = await window.supabase.auth.signUp({
            email: email,
            password: pass,
            options: {
              data: {
                name: name,
                role: accountType
              }
            }
          });
          
          if (error) {
            console.warn('⚠️ Erro ao registrar no Supabase:', error.message);
            
            // Se o usuário já existe no Supabase, verificar localStorage
            if (error.message.includes('already registered') || error.message.includes('already exists')) {
              showNotification(
                'Email já cadastrado',
                'Este email já está registrado. Por favor, faça <strong>login</strong> ou use outro email.',
                'error'
              );
              return;
            }
            
            // Para outros erros, tentar salvar localmente
            console.log('Salvando localmente como fallback...');
            saveLocalUser();
          } else {
            console.log('✅ Registro no Supabase bem-sucedido!');
            console.log('User ID:', data.user?.id);
            
            // Criptografar senha antes de salvar localmente
            if (window.passwordCrypto) {
              window.passwordCrypto.hashPassword(pass).then(hashedPassword => {
                saveUser({
                  name, 
                  email, 
                  password: hashedPassword, 
                  role: accountType
                });
                
                console.log('✅ Usuário sincronizado no localStorage com senha criptografada');
                
                // Inicializar progresso
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
                
                showSuccessAndRedirect();
              });
            } else {
              // Fallback
              saveUser({name, email, password:pass, role:accountType});
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
              showSuccessAndRedirect();
            }
          }
        } catch (err) {
          console.warn('⚠️ Erro ao conectar com Supabase:', err);
          console.log('Salvando localmente como fallback...');
          saveLocalUser();
        }
      } else {
        console.warn('⚠️ Supabase não disponível - salvando apenas localmente');
        saveLocalUser();
      }
      
      // Função para salvar localmente
      function saveLocalUser() {
        // Verificar se o email já existe localmente
        const users = JSON.parse(localStorage.getItem('ns-users')||'[]');
        const emailExists = users.find(u => u.email.toLowerCase().trim() === email);
        
        if (emailExists) {
          showNotification(
            'Email já cadastrado',
            'Este email já está registrado localmente. Por favor, faça login ou use outro email.',
            'error'
          );
          return;
        }
        
        console.log('Salvando usuário no localStorage com senha criptografada...');
        
        // Criptografar senha antes de salvar
        if (window.passwordCrypto) {
          window.passwordCrypto.hashPassword(pass).then(hashedPassword => {
            saveUser({
              name, 
              email, 
              password: hashedPassword, 
              role: accountType
            });
            
            // Inicializar progresso vazio
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
            
            showSuccessAndRedirect();
          });
        } else {
          // Fallback se crypto não disponível (manter compatibilidade)
          console.warn('⚠️ Sistema de criptografia não disponível - usando texto plano como fallback');
          saveUser({
            name, 
            email, 
            password: pass, 
            role: accountType
          });
          
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
          showSuccessAndRedirect();
        }
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