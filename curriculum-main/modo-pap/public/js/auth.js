// auth.js - front-end auth simulation
(function(){
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

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
        localStorage.setItem('ns-session', JSON.stringify({email})); 
        window.location.href = 'app.html'; 
      } else { 
        alert('Usuário não encontrado. Registre-se ou use credenciais de teste.');
      }
    });
  }

  if(registerForm){
    registerForm.addEventListener('submit', e=>{
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const pass = document.getElementById('password').value;
      saveUser({name,email,password:pass});
      alert('Conta criada. Agora faça login.');
      window.location.href = 'login.html';
    });
  }
})();