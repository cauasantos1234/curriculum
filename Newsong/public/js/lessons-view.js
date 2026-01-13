// lessons-view.js - Display lessons for instrument and level
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
  const moduleId = parseInt(urlParams.get('module')) || 1;

  const instrument = instruments[instrumentId];
  const moduleData = modulesInfo[level];
  const allModules = lessons[instrumentId] ? lessons[instrumentId][level] || [] : [];
  
  // Encontrar o módulo específico
  const currentModule = allModules.find(m => m.id === moduleId);
  const lessonsList = currentModule ? currentModule.lessons : [];

  // Elements
  const moduleIcon = document.getElementById('moduleIcon');
  const moduleName = document.getElementById('moduleName');
  const lessonCount = document.getElementById('lessonCount');
  const lessonsListContainer = document.getElementById('lessonsList');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalBody = document.getElementById('modalBody');
  const btnBack = document.getElementById('btnBackToModules');
  const backToApp = document.getElementById('backToApp');

  // Render page
  function init(){
    if(moduleIcon) moduleIcon.textContent = moduleData.icon;
    if(moduleName) moduleName.textContent = `${instrument.name} - ${currentModule ? currentModule.title : 'Módulo'}`;
    if(lessonCount) lessonCount.textContent = `${lessonsList.length} aulas`;

    renderLessonsList();
    initThemeToggle();
  }

  // Verificar se uma aula foi concluída
  function isLessonCompleted(lessonId){
    // Verificar com UserProgress
    if(window.UserProgress){
      return window.UserProgress.isLessonCompleted(lessonId);
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

    lessonsList.forEach(async (lesson, index) => {
      const item = document.createElement('div');
      item.className = 'lesson-list-item';
      
      const isCompleted = isLessonCompleted(lesson.id);
      console.log(`Aula ${lesson.id} (${lesson.title}) - Completa: ${isCompleted}`);
      
      // Para professores, buscar contagem de vídeos
      let videoBadgeHTML = '';
      if(isTeacher && window.VideoStorage){
        try {
          const videoCount = await window.VideoStorage.countVideosByLesson(instrumentId, level, lesson.id);
          if(videoCount > 0){
            const videoText = videoCount === 1 ? '1 vídeo' : `${videoCount} vídeos`;
            videoBadgeHTML = `<div class="teacher-video-badge"><span class="video-icon">●</span><span class="video-text">${videoText}</span></div>`;
          }
        } catch(e) {
          console.error('Erro ao contar vídeos da aula:', e);
        }
      }
      
      item.innerHTML = `
        <div class="lesson-list-bullet"></div>
        <div class="lesson-list-content">
          <div class="lesson-list-number">${index + 1} - </div>
          <div class="lesson-list-info">
            <h4 class="lesson-list-title">${lesson.title}</h4>
            <span class="lesson-duration">${lesson.duration}</span>
          </div>
        </div>
        ${!isTeacher && isCompleted ? '<div class="lesson-completed-badge"><span class="completed-icon">✓</span><span class="completed-text">COMPLETO</span></div>' : ''}
        ${isTeacher ? videoBadgeHTML : ''}
      `;
      
      item.addEventListener('click', () => {
        window.location.href = `videos.html?instrument=${instrumentId}&level=${level}&lesson=${lesson.id}`;
      });
      
      lessonsListContainer.appendChild(item);
    });
  }

  function openLessonModal(lesson){
    if(!modalBackdrop || !modalBody) return;
    
    modalBackdrop.style.display = 'flex';
    modalBackdrop.setAttribute('aria-hidden', 'false');
    
    modalBody.innerHTML = `
      <div style="text-align:center;padding:20px">
        <h3 style="color:var(--gold-2);margin:0 0 12px 0;font-size:24px">${lesson.title}</h3>
        <p style="color:var(--muted);margin:0 0 20px 0">Por ${lesson.author} • ${lesson.duration}</p>
        <div style="background:linear-gradient(135deg, rgba(212,175,55,0.15), rgba(255,255,255,0.05));height:300px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:20px">
          <div style="font-size:80px">▶️</div>
        </div>
        <p style="color:var(--muted);margin:0 0 20px 0">Player de vídeo (protótipo)</p>
        <div style="display:flex;gap:12px;justify-content:center">
          <button class="btn" onclick="document.getElementById('modalBackdrop').style.display='none'">Fechar</button>
          <button class="btn" style="background:linear-gradient(135deg,#22c55e,#16a34a)">Marcar como Concluída</button>
        </div>
      </div>
    `;
  }

  function closeModal(){ 
    if(!modalBackdrop) return; 
    modalBackdrop.style.display='none'; 
    modalBackdrop.setAttribute('aria-hidden','true'); 
    modalBody.innerHTML=''; 
  }

  // Close modal on backdrop click
  if(modalBackdrop){
    modalBackdrop.addEventListener('click', e => { 
      if(e.target === modalBackdrop) closeModal(); 
    });
  }

  // Back button
  if(btnBack){
    btnBack.addEventListener('click', () => {
      window.location.href = `lessons.html?instrument=${instrumentId}&level=${level}`;
    });
  }

  if(backToApp){
    backToApp.addEventListener('click', () => {
      window.location.href = 'app.html';
    });
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
