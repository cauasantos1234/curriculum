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
    users.push(data); localStorage.setItem('ns-users', JSON.stringify(users));
  }

  if(loginForm){
    loginForm.addEventListener('submit', e=>{
      e.preventDefault();
      const email = document.getElementById('email').value;
      const pass = document.getElementById('password').value;
      const users = JSON.parse(localStorage.getItem('ns-users')||'[]');
      const match = users.find(u=>u.email===email && u.password===pass);
      if(match){ 
        localStorage.setItem('ns-session', JSON.stringify({
          email: match.email,
          name: match.name,
          role: match.role || 'student'
        })); 
        window.location.href = 'app.html'; 
      } else { 
        showNotification(
          'Erro ao fazer login',
          'Usuário não encontrado. Verifique suas credenciais ou crie uma nova conta.',
          'error'
        );
      }
    });
  }

  if(registerForm){
    registerForm.addEventListener('submit', e=>{
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const pass = document.getElementById('password').value;
      const accountType = document.querySelector('input[name="accountType"]:checked').value;
      
      // Verificar se o email já existe
      const users = JSON.parse(localStorage.getItem('ns-users')||'[]');
      const emailExists = users.find(u => u.email === email);
      
      if (emailExists) {
        showNotification(
          'Email já cadastrado',
          'Este email já está registrado. Por favor, faça login ou use outro email.',
          'error'
        );
        return;
      }
      
      saveUser({name,email,password:pass,role:accountType});
      
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
    });
  }
})();