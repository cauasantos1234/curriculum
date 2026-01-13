// lessons.js - Display lessons list for instrument and level
(function(){
  // Use shared lessons data
  const lessons = window.SHARED_LESSONS || {};

  const modulesInfo = {
    beginner:{title:'Nível Bronze',desc:'Fundamentos e técnicas básicas',icon:'🥉',color:'#cd7f32'},
    intermediate:{title:'Módulo Prata',desc:'Desenvolvimento de habilidades',icon:'🥈',color:'#c0c0c0'},
    advanced:{title:'Módulo Ouro',desc:'Técnicas profissionais',icon:'🥇',color:'#ffd700'}
  };

  const instruments = {
    guitar: {id:'guitar',name:'Guitarra',symbol:'guitar',desc:'Elétrica e acústica',icon:'🎸'},
    drums: {id:'drums',name:'Bateria',symbol:'drums',desc:'Ritmo e grooves',icon:'🥁'},
    keyboard: {id:'keyboard',name:'Piano',symbol:'keyboard',desc:'Clássico e contemporâneo',icon:'🎹'},
    viola: {id:'viola',name:'Violão',symbol:'viola',desc:'Acústico e dedilhado',icon:'🪕'},
    bass: {id:'bass',name:'Baixo',symbol:'bass',desc:'Groove e harmonia',icon:'🎸'}
  };

  // Get parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const instrumentId = urlParams.get('instrument') || 'guitar';
  const level = urlParams.get('level') || 'beginner';

  const instrument = instruments[instrumentId];
  const moduleData = modulesInfo[level];
  const lessonsList = lessons[instrumentId] ? lessons[instrumentId][level] || [] : [];

  // Elements
  const moduleIcon = document.getElementById('moduleIcon');
  const moduleName = document.getElementById('moduleName');
  const lessonCount = document.getElementById('lessonCount');
  const lessonsListContainer = document.getElementById('lessonsList');
  const btnBack = document.getElementById('btnBackToModules');

  // Render page
  function init(){
    if(moduleIcon) moduleIcon.textContent = moduleData.icon;
    if(moduleName) moduleName.textContent = `${instrument.name} - ${moduleData.title}`;
    if(lessonCount) lessonCount.textContent = `${lessonsList.length} aulas`;

    renderLessonsList();
    initSidebar();
    initThemeToggle();
  }

  // Verificar se um módulo está completo
  function isModuleCompleted(moduleId){
    // Verificar se todas as aulas do módulo foram concluídas
    const module = lessonsList.find(m => m.id === moduleId);
    if(!module || !module.lessons || module.lessons.length === 0) return false;
    
    // Se UserProgress estiver disponível, usar para verificar
    if(window.UserProgress){
      const moduleProgress = window.UserProgress.getInstrumentProgress(instrumentId, level);
      const moduleCompletedLessons = module.lessons.filter(lesson => 
        moduleProgress.completedLessons.includes(lesson.id)
      );
      const isComplete = moduleCompletedLessons.length === module.lessons.length;
      console.log(`Módulo ${moduleId} - Aulas completas: ${moduleCompletedLessons.length}/${module.lessons.length} - Completo: ${isComplete}`);
      return isComplete;
    }
    
    return false;
  }

  function renderLessonsList(){
    if(!lessonsListContainer) return;

    if(lessonsList.length === 0){
      lessonsListContainer.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><h3>Nenhuma aula disponível</h3><p>Este módulo ainda não possui aulas cadastradas.</p></div>';
      return;
    }

    // Verificar se é professor
    const session = JSON.parse(localStorage.getItem('ns-session') || 'null');
    const isTeacher = session && session.role === 'teacher';

    lessonsListContainer.innerHTML = '';

    lessonsList.forEach(async (module, index) => {
      const item = document.createElement('div');
      item.className = 'lesson-list-item';
      
      const isCompleted = isModuleCompleted(module.id);
      console.log(`Renderizando Módulo ${module.moduleNumber} (ID: ${module.id}) - Completo: ${isCompleted}`);
      
      // Para professores, buscar contagem de vídeos
      let videoBadgeHTML = '';
      if(isTeacher && window.VideoStorage){
        try {
          const videoCount = await window.VideoStorage.countVideosByModule(instrumentId, level, module.id);
          if(videoCount > 0){
            const videoText = videoCount === 1 ? '1 vídeo' : `${videoCount} vídeos`;
            videoBadgeHTML = `<div class="teacher-video-badge"><span class="video-icon">●</span><span class="video-text">${videoText}</span></div>`;
          }
        } catch(e) {
          console.error('Erro ao contar vídeos do módulo:', e);
        }
      }
      
      item.innerHTML = `
        <div class="lesson-list-bullet"></div>
        <div class="lesson-list-content">
          <div class="lesson-list-number">${module.moduleNumber} - </div>
          <div class="lesson-list-info">
            <h4 class="lesson-list-title">${module.moduleName}</h4>
          </div>
        </div>
        ${!isTeacher && isCompleted ? '<div class="module-completed-badge"><span class="completed-icon">✓</span><span class="completed-text">COMPLETO</span></div>' : ''}
        ${isTeacher ? videoBadgeHTML : ''}
      `;
      
      item.addEventListener('click', () => {
        window.location.href = `lessons-view.html?instrument=${instrumentId}&level=${level}&module=${module.id}`;
      });
      
      lessonsListContainer.appendChild(item);
    });
  }

  // Back button
  if(btnBack){
    btnBack.addEventListener('click', () => {
      window.location.href = 'app.html';
    });
  }

  // Sidebar Navigation
  function initSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const closeSidebar = document.getElementById('closeSidebar');
    const logoutBtn = document.getElementById('logoutBtn');

    function openSidebar() {
      sidebar.classList.add('active');
      sidebarOverlay.classList.add('active');
    }

    function closeSidebarMenu() {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
    }

    if (menuToggle) {
      menuToggle.addEventListener('click', openSidebar);
    }

    if (closeSidebar) {
      closeSidebar.addEventListener('click', closeSidebarMenu);
    }

    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', closeSidebarMenu);
    }

    // Close sidebar on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        closeSidebarMenu();
      }
    });

    // Navigation buttons
    const navButtons = {
      'home': 'app.html',
      'lessons': 'app.html',
      'saved': 'saved.html',
      'upload': 'upload.html',
      'stats': 'stats.html'
    };

    document.querySelectorAll('.sidebar .menu button[data-nav]').forEach(btn => {
      btn.addEventListener('click', () => {
        const nav = btn.getAttribute('data-nav');
        if (navButtons[nav]) {
          window.location.href = navButtons[nav];
        }
      });
    });

    // Profile button
    const profileBtn = document.getElementById('profileMenuBtn');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        window.location.href = 'profile.html';
      });
    }

    // Logout button - volta para página inicial
    if (logoutBtn) {
      logoutBtn.textContent = '← Voltar';
      logoutBtn.addEventListener('click', () => {
        window.location.href = 'app.html';
      });
    }

    // Hide teacher-only buttons for students
    const sessionData = localStorage.getItem('ns-session');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      if (session && session.role !== 'teacher') {
        const uploadBtn = document.getElementById('uploadMenuBtn');
        const statsBtn = document.getElementById('statsMenuBtn');
        
        if (uploadBtn) uploadBtn.style.display = 'none';
        if (statsBtn) statsBtn.style.display = 'none';
      }
    }
  }

  // Theme toggle
  function initThemeToggle(){
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const THEME_STORAGE_KEY = 'newsong-theme';

    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);

    if(themeToggle){
      themeToggle.addEventListener('click', ()=>{
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.classList.add('theme-transition');
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        updateThemeButton(newTheme);
        
        setTimeout(() => {
          body.classList.remove('theme-transition');
        }, 400);
      });
    }
  }

  function updateThemeButton(theme){
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    
    if(themeIcon){
      themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }

  // Initialize
  init();
})();
