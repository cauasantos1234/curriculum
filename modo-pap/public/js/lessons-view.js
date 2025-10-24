// lessons-view.js - Display lessons for a specific instrument and level
(function(){
  const lessons = {
    guitar:{
      beginner:[
        {id:1,title:'Acordes Básicos - Parte 1',duration:'12:34',author:'Mariana Silva',progress:45,difficulty:'Fácil'},
        {id:2,title:'Posição das Mãos',duration:'08:15',author:'Carlos Mendes',progress:100,difficulty:'Fácil'},
        {id:3,title:'Primeiros Ritmos',duration:'15:22',author:'Ana Costa',progress:20,difficulty:'Fácil'}
      ],
      intermediate:[
        {id:4,title:'Power Chords Avançados',duration:'18:45',author:'Pedro Santos',progress:60,difficulty:'Médio'},
        {id:5,title:'Escalas Pentatônicas',duration:'22:10',author:'Lucas Oliveira',progress:30,difficulty:'Médio'},
        {id:6,title:'Técnicas de Bend',duration:'16:33',author:'Rafael Lima',progress:0,difficulty:'Médio'}
      ],
      advanced:[
        {id:7,title:'Solos Complexos',duration:'25:18',author:'João Alves',progress:15,difficulty:'Difícil'},
        {id:8,title:'Sweep Picking',duration:'20:45',author:'Diego Martins',progress:0,difficulty:'Difícil'},
        {id:9,title:'Improvização Avançada',duration:'30:12',author:'Bruno Cardoso',progress:5,difficulty:'Difícil'}
      ]
    }
  };

  const modulesInfo = {
    beginner:{title:'Módulo Bronze',desc:'Fundamentos e técnicas básicas',icon:'🥉',color:'#cd7f32'},
    intermediate:{title:'Módulo Prata',desc:'Desenvolvimento de habilidades',icon:'🥈',color:'#c0c0c0'},
    advanced:{title:'Módulo Ouro',desc:'Técnicas profissionais',icon:'🥇',color:'#ffd700'}
  };

  const instruments = {
    guitar: {id:'guitar',name:'Guitarra',symbol:'guitar',desc:'Elétrica e acústica',icon:'🎸'}
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
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalBody = document.getElementById('modalBody');
  const btnBack = document.getElementById('btnBackToModules');
  const backToApp = document.getElementById('backToApp');

  // Render page
  function init(){
    if(moduleIcon) moduleIcon.textContent = moduleData.icon;
    if(moduleName) moduleName.textContent = `${instrument.name} - ${moduleData.title}`;
    if(lessonCount) lessonCount.textContent = `${lessonsList.length} aulas`;

    renderLessonsList();
    initThemeToggle();
  }

  function renderLessonsList(){
    if(!lessonsListContainer) return;

    if(lessonsList.length === 0){
      lessonsListContainer.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><h3>Nenhuma aula disponível</h3><p>Este módulo ainda não possui aulas cadastradas.</p></div>';
      return;
    }

    lessonsListContainer.innerHTML = '';

    lessonsList.forEach((lesson, index) => {
      const item = document.createElement('div');
      item.className = 'lesson-list-item';
      
      item.innerHTML = `
        <div class="lesson-list-bullet"></div>
        <div class="lesson-list-content">
          <div class="lesson-list-number">${index + 1} - </div>
          <div class="lesson-list-info">
            <h4 class="lesson-list-title">${lesson.title}</h4>
          </div>
        </div>
      `;
      
      item.addEventListener('click', () => {
        openLessonModal(lesson);
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
      window.location.href = 'app.html';
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
    const themeText = themeToggle?.querySelector('.theme-text');
    
    if(themeIcon){
      themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
    
    if(themeText){
      themeText.textContent = theme === 'dark' ? 'Modo Escuro' : 'Modo Claro';
    }
  }

  // Initialize
  init();
})();
