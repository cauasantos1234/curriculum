// shared-menu.js - Menu Hambúrguer compartilhado entre páginas
(function() {
  'use strict';
  
  // Inject menu HTML
  function injectMenu() {
    // Check if menu already exists (manually added in HTML)
    const existingMenu = document.getElementById('sideMenu');
    if (existingMenu) {
      return;
    }
    
    const menuHTML = `
      <!-- Botão Hambúrguer -->
      <button class="hamburger-btn" id="hamburgerBtn" aria-label="Menu">
        <div class="hamburger-line"></div>
        <div class="hamburger-line"></div>
        <div class="hamburger-line"></div>
      </button>

      <!-- Overlay -->
      <div class="menu-overlay" id="menuOverlay"></div>

      <!-- Menu Lateral -->
      <nav class="side-menu" id="sideMenu">
        <!-- Header -->
        <div class="menu-header">
          <div class="menu-logo">
            <div class="menu-logo-icon">NS</div>
            <div class="menu-logo-text">
              <h2>NewSong</h2>
              <p>Comunidade Musical</p>
            </div>
          </div>

          <!-- Perfil -->
          <a href="profile.html" class="menu-profile" id="menuProfile">
            <div class="menu-profile-avatar" id="menuAvatar">A</div>
            <div class="menu-profile-info">
              <h3 id="menuUserName">Usuário</h3>
              <p id="menuUserEmail">usuario@exemplo.com</p>
            </div>
          </a>
        </div>

        <!-- Divisor -->
        <div class="menu-divider"></div>

        <!-- Itens do Menu -->
        <div class="menu-items" id="menuItems">
          <a href="app.html" class="menu-item" data-page="home">
            <span class="menu-item-icon">🏠</span>
            <span class="menu-item-text">Início</span>
          </a>
          <a href="app.html#lessons" class="menu-item" data-page="lessons">
            <span class="menu-item-icon">📚</span>
            <span class="menu-item-text">Aulas</span>
          </a>
          <a href="saved.html" class="menu-item" data-page="saved">
            <span class="menu-item-icon">⭐</span>
            <span class="menu-item-text">Salvos</span>
          </a>
        </div>

        <!-- Footer -->
        <div class="menu-footer">
          <button class="menu-logout" id="menuLogout">
            <span>🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </nav>
    `;
    
    // Insert menu at the beginning of container
    const container = document.querySelector('.container');
    if (container) {
      container.insertAdjacentHTML('afterbegin', menuHTML);
    }
  }
  
  // Initialize menu functionality
  function initMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuLogout = document.getElementById('menuLogout');
    
    if (!hamburgerBtn || !sideMenu || !menuOverlay) {
      console.warn('Menu elements not found');
      return;
    }
    
    // Toggle menu
    function toggleMenu() {
      hamburgerBtn.classList.toggle('active');
      sideMenu.classList.toggle('active');
      menuOverlay.classList.toggle('active');
      document.body.style.overflow = sideMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    // Close menu
    function closeMenu() {
      hamburgerBtn.classList.remove('active');
      sideMenu.classList.remove('active');
      menuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    // Event listeners
    hamburgerBtn.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', closeMenu);
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
        closeMenu();
      }
    });
    
    // Logout
    if (menuLogout) {
      menuLogout.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja sair?')) {
          localStorage.removeItem('ns-session');
          window.location.href = 'login.html';
        }
      });
    }
    
    // Load user info and configure menu
    loadUserInfo();
    highlightActivePage();
    
    // Attach menu item listeners
    attachMenuItemListeners();
    
    // Update highlight when hash changes
    window.addEventListener('hashchange', highlightActivePage);
  }
  
  // Load user information
  function loadUserInfo() {
    const session = JSON.parse(localStorage.getItem('ns-session') || 'null');
    
    if (!session) {
      // Redirect to login if not logged in (except for login/register pages)
      const currentPage = window.location.pathname.split('/').pop();
      if (currentPage !== 'login.html' && currentPage !== 'register.html') {
        window.location.href = 'login.html';
      }
      return;
    }
    
    const menuUserName = document.getElementById('menuUserName');
    const menuUserEmail = document.getElementById('menuUserEmail');
    const menuUserLevel = document.getElementById('menuUserLevel');
    const menuAvatar = document.getElementById('menuAvatar');
    const menuItems = document.getElementById('menuItems');
    
    if (menuUserName) menuUserName.textContent = session.name;
    if (menuUserEmail) menuUserEmail.textContent = session.email;
    if (menuUserLevel) menuUserLevel.textContent = session.role === 'teacher' ? 'Professor' : 'Nível Bronze';
    if (menuAvatar) menuAvatar.textContent = session.name.charAt(0).toUpperCase();
    
    // Configure menu based on user role
    if (session.role === 'teacher' && menuItems) {
      // Menu para professores
      menuItems.innerHTML = `
        <a href="app.html" class="menu-item" data-page="home">
          <span class="menu-item-icon">🏠</span>
          <span class="menu-item-text">Início</span>
        </a>
        <a href="upload.html" class="menu-item" data-page="upload">
          <span class="menu-item-icon">📤</span>
          <span class="menu-item-text">Enviar Vídeo</span>
        </a>
        <a href="stats.html" class="menu-item" data-page="stats">
          <span class="menu-item-icon">📊</span>
          <span class="menu-item-text">Estatísticas</span>
        </a>
        <a href="saved.html" class="menu-item" data-page="saved">
          <span class="menu-item-icon">⭐</span>
          <span class="menu-item-text">Salvos</span>
        </a>
      `;
      
      // Re-attach event listeners after dynamic menu creation
      attachMenuItemListeners();
    } else if (menuItems) {
      // Menu para alunos
      menuItems.innerHTML = `
        <a href="app.html" class="menu-item" data-page="home">
          <span class="menu-item-icon">🏠</span>
          <span class="menu-item-text">Início</span>
        </a>
        <a href="app.html#lessons" class="menu-item" data-page="lessons">
          <span class="menu-item-icon">📚</span>
          <span class="menu-item-text">Aulas</span>
        </a>
        <a href="saved.html" class="menu-item" data-page="saved">
          <span class="menu-item-icon">⭐</span>
          <span class="menu-item-text">Salvos</span>
        </a>
      `;
      
      // Re-attach event listeners after dynamic menu creation
      attachMenuItemListeners();
    }
  }
  
  // Attach event listeners to menu items
  function attachMenuItemListeners() {
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    
    function closeMenu() {
      if (hamburgerBtn) hamburgerBtn.classList.remove('active');
      if (sideMenu) sideMenu.classList.remove('active');
      if (menuOverlay) menuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const href = item.getAttribute('href');
        
        // If clicking on lessons link and already on app.html
        if (href === 'app.html#lessons' && window.location.pathname.includes('app.html')) {
          e.preventDefault();
          closeMenu();
          
          // Show lessons section
          const homeSection = document.getElementById('homeSection');
          const lessonsSection = document.getElementById('lessonsSection');
          if(homeSection) {
            homeSection.style.display = 'none';
          }
          if(lessonsSection) {
            lessonsSection.style.display = '';
            setTimeout(() => {
              lessonsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }
          
          // Update URL hash
          window.location.hash = 'lessons';
          
          // Activate lessons button
          document.querySelectorAll('[data-nav]').forEach(b=>b.classList.remove('active'));
          document.querySelectorAll('[data-nav="lessons"]').forEach(b=>b.classList.add('active'));
        } else {
          // Normal navigation, just close menu
          closeMenu();
        }
      });
    });
  }
  
  // Highlight active page in menu
  function highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'app.html';
    const currentHash = window.location.hash;
    
    document.querySelectorAll('.menu-item').forEach(item => {
      const href = item.getAttribute('href');
      item.classList.remove('active');
      
      if (href === currentPage) {
        item.classList.add('active');
      } else if (currentPage === 'app.html' && href === 'app.html') {
        // Only highlight home if not on #lessons
        if(currentHash !== '#lessons') {
          item.classList.add('active');
        }
      } else if (currentPage === 'app.html' && href === 'app.html#lessons' && currentHash === '#lessons') {
        // Highlight lessons when on app.html#lessons
        item.classList.add('active');
      } else if (currentPage.includes('lesson') && href === 'app.html#lessons') {
        // Highlight "Aulas" when in lesson pages
        if (item.getAttribute('data-page') === 'lessons') {
          item.classList.add('active');
        }
      } else if (currentPage.includes('video') && href === 'app.html#lessons') {
        // Highlight "Aulas" when in video pages
        if (item.getAttribute('data-page') === 'lessons') {
          item.classList.add('active');
        }
      }
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        injectMenu();
        initMenu();
      }, 100);
    });
  } else {
    setTimeout(() => {
      injectMenu();
      initMenu();
    }, 100);
  }
})();
