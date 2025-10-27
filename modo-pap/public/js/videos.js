// videos.js - Display all videos for Bronze level with automatic filtering
(function(){
  // Database de todos os vídeos organizados por instrumento e aula
  const videosDatabase = {
    guitar: {
      beginner: {
        // Aula 101: Partes da guitarra e suas funções
        lesson101: [
          {id:10101, lessonId:101, lessonTitle:'Partes da guitarra e suas funções', title:'Corpo da Guitarra', duration:'5:23', author:'Mariana Silva', thumbnail:'🎸', order:1},
          {id:10102, lessonId:101, lessonTitle:'Partes da guitarra e suas funções', title:'Braço e Trastes', duration:'4:15', author:'Mariana Silva', thumbnail:'🎸', order:2},
          {id:10103, lessonId:101, lessonTitle:'Partes da guitarra e suas funções', title:'Captadores e Controles', duration:'6:30', author:'Mariana Silva', thumbnail:'🎸', order:3},
          {id:10104, lessonId:101, lessonTitle:'Partes da guitarra e suas funções', title:'Ponte e Cordas', duration:'4:45', author:'Mariana Silva', thumbnail:'🎸', order:4}
        ],
        // Aula 102: Tipos de guitarras
        lesson102: [
          {id:10201, lessonId:102, lessonTitle:'Tipos de guitarras (Strat, Les Paul, Tele, etc.)', title:'Fender Stratocaster', duration:'6:30', author:'Carlos Mendes', thumbnail:'🎸', order:1},
          {id:10202, lessonId:102, lessonTitle:'Tipos de guitarras (Strat, Les Paul, Tele, etc.)', title:'Gibson Les Paul', duration:'5:45', author:'Carlos Mendes', thumbnail:'🎸', order:2},
          {id:10203, lessonId:102, lessonTitle:'Tipos de guitarras (Strat, Les Paul, Tele, etc.)', title:'Fender Telecaster', duration:'5:20', author:'Carlos Mendes', thumbnail:'🎸', order:3},
          {id:10204, lessonId:102, lessonTitle:'Tipos de guitarras (Strat, Les Paul, Tele, etc.)', title:'Outros Modelos Populares', duration:'7:15', author:'Carlos Mendes', thumbnail:'🎸', order:4}
        ],
        // Aula 103: Como segurar a guitarra corretamente
        lesson103: [
          {id:10301, lessonId:103, lessonTitle:'Como segurar a guitarra corretamente', title:'Postura Sentado', duration:'4:20', author:'Ana Costa', thumbnail:'🎸', order:1},
          {id:10302, lessonId:103, lessonTitle:'Como segurar a guitarra corretamente', title:'Postura em Pé', duration:'4:10', author:'Ana Costa', thumbnail:'🎸', order:2},
          {id:10303, lessonId:103, lessonTitle:'Como segurar a guitarra corretamente', title:'Posição do Braço e Mão', duration:'5:30', author:'Ana Costa', thumbnail:'🎸', order:3}
        ],
        // Aula 104: Como afinar a guitarra
        lesson104: [
          {id:10401, lessonId:104, lessonTitle:'Como afinar a guitarra (manual e por app)', title:'Afinação Manual por Ouvido', duration:'6:45', author:'Pedro Santos', thumbnail:'🎸', order:1},
          {id:10402, lessonId:104, lessonTitle:'Como afinar a guitarra (manual e por app)', title:'Usando Afinador Digital', duration:'4:30', author:'Pedro Santos', thumbnail:'🎸', order:2},
          {id:10403, lessonId:104, lessonTitle:'Como afinar a guitarra (manual e por app)', title:'Apps de Afinação', duration:'5:15', author:'Pedro Santos', thumbnail:'🎸', order:3}
        ],
        // Aula 105: Cuidados e manutenção básica
        lesson105: [
          {id:10501, lessonId:105, lessonTitle:'Cuidados e manutenção básica', title:'Limpeza da Guitarra', duration:'5:50', author:'Lucas Oliveira', thumbnail:'🎸', order:1},
          {id:10502, lessonId:105, lessonTitle:'Cuidados e manutenção básica', title:'Troca de Cordas', duration:'8:20', author:'Lucas Oliveira', thumbnail:'🎸', order:2},
          {id:10503, lessonId:105, lessonTitle:'Cuidados e manutenção básica', title:'Armazenamento Correto', duration:'4:40', author:'Lucas Oliveira', thumbnail:'🎸', order:3},
          {id:10504, lessonId:105, lessonTitle:'Cuidados e manutenção básica', title:'Manutenção Preventiva', duration:'6:10', author:'Lucas Oliveira', thumbnail:'🎸', order:4}
        ]
      }
    },
    drums: {
      beginner: {
        lesson11: [
          {id:1101, lessonId:11, lessonTitle:'Ritmos Básicos', title:'Batida Básica', duration:'4:20', author:'Paulo Drums', thumbnail:'🥁', order:1},
          {id:1102, lessonId:11, lessonTitle:'Ritmos Básicos', title:'Coordenação das Mãos', duration:'5:10', author:'Paulo Drums', thumbnail:'🥁', order:2}
        ],
        lesson12: [
          {id:1201, lessonId:12, lessonTitle:'Coordenação Inicial', title:'Exercícios de Coordenação', duration:'6:55', author:'Carla Beats', thumbnail:'🥁', order:1},
          {id:1202, lessonId:12, lessonTitle:'Coordenação Inicial', title:'Independência dos Membros', duration:'8:00', author:'Carla Beats', thumbnail:'🥁', order:2}
        ]
      }
    },
    keyboard: {
      beginner: {
        lesson21: [
          {id:2101, lessonId:21, lessonTitle:'Escalas Simples', title:'Escala de Dó Maior', duration:'5:45', author:'Sofia Piano', thumbnail:'🎹', order:1},
          {id:2102, lessonId:21, lessonTitle:'Escalas Simples', title:'Escala de Sol Maior', duration:'6:00', author:'Sofia Piano', thumbnail:'🎹', order:2}
        ],
        lesson22: [
          {id:2201, lessonId:22, lessonTitle:'Postura e Técnica', title:'Postura ao Piano', duration:'4:30', author:'Helena Keys', thumbnail:'🎹', order:1},
          {id:2202, lessonId:22, lessonTitle:'Postura e Técnica', title:'Posição dos Dedos', duration:'5:00', author:'Helena Keys', thumbnail:'🎹', order:2}
        ]
      }
    },
    viola: {
      beginner: {
        lesson31: [
          {id:3101, lessonId:31, lessonTitle:'Dedilhado Básico', title:'Padrões de Dedilhado', duration:'6:25', author:'Gabriel Violão', thumbnail:'🪕', order:1},
          {id:3102, lessonId:31, lessonTitle:'Dedilhado Básico', title:'Exercícios de Dedilhado', duration:'7:00', author:'Gabriel Violão', thumbnail:'🪕', order:2}
        ],
        lesson32: [
          {id:3201, lessonId:32, lessonTitle:'Acordes Abertos', title:'Acordes Básicos Abertos', duration:'5:50', author:'Larissa Acoustic', thumbnail:'🪕', order:1},
          {id:3202, lessonId:32, lessonTitle:'Acordes Abertos', title:'Transição entre Acordes', duration:'5:00', author:'Larissa Acoustic', thumbnail:'🪕', order:2}
        ]
      }
    },
    bass: {
      beginner: {
        lesson41: [
          {id:4101, lessonId:41, lessonTitle:'Walking Bass Simples', title:'Conceito de Walking Bass', duration:'6:10', author:'Rodrigo Bass', thumbnail:'🎸', order:1},
          {id:4102, lessonId:41, lessonTitle:'Walking Bass Simples', title:'Exercícios de Walking Bass', duration:'6:00', author:'Rodrigo Bass', thumbnail:'🎸', order:2}
        ],
        lesson42: [
          {id:4201, lessonId:42, lessonTitle:'Técnica de Mão Direita', title:'Técnicas de Palhetada', duration:'5:30', author:'Patrícia Groove', thumbnail:'🎸', order:1},
          {id:4202, lessonId:42, lessonTitle:'Técnica de Mão Direita', title:'Exercícios de Mão Direita', duration:'6:00', author:'Patrícia Groove', thumbnail:'🎸', order:2}
        ]
      }
    }
  };

  const modulesInfo = {
    beginner:{title:'Módulo Bronze',desc:'Fundamentos e técnicas básicas',icon:'🥉',color:'#cd7f32'},
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
  const lessonId = urlParams.get('lesson'); // Se especificado, filtra por aula específica

  const instrument = instruments[instrumentId];
  const moduleData = modulesInfo[level];
  
  // Get all videos for this instrument and level
  let allVideos = [];
  const instrumentVideos = videosDatabase[instrumentId];
  
  if(instrumentVideos && instrumentVideos[level]){
    Object.keys(instrumentVideos[level]).forEach(lessonKey => {
      const videos = instrumentVideos[level][lessonKey];
      allVideos = allVideos.concat(videos);
    });
  }

  // Elements
  const instrumentName = document.getElementById('instrumentName');
  const moduleIcon = document.getElementById('moduleIcon');
  const moduleName = document.getElementById('moduleName');
  const lessonName = document.getElementById('lessonName');
  const lessonNameBreadcrumb = document.getElementById('lessonNameBreadcrumb');
  const lessonSeparator = document.getElementById('lessonSeparator');
  const filterTabs = document.getElementById('filterTabs');
  const videosGrid = document.getElementById('videosGrid');
  const emptyState = document.getElementById('emptyState');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalBody = document.getElementById('modalBody');
  const backToApp = document.getElementById('backToApp');

  // Se veio da página de aulas com filtro, já inicia filtrado
  let currentFilter = lessonId ? parseInt(lessonId) : 'all';

  // Render page
  function init(){
    // Update header info
    if(instrumentName) instrumentName.textContent = instrument.name;
    if(moduleIcon) moduleIcon.textContent = moduleData.icon;
    if(moduleName) moduleName.textContent = moduleData.title;

    // If specific lesson is selected, show in breadcrumb
    if(lessonId && allVideos.length > 0){
      const firstVideo = allVideos.find(v => v.lessonId === parseInt(lessonId));
      if(firstVideo && lessonName && lessonNameBreadcrumb && lessonSeparator){
        lessonName.textContent = firstVideo.lessonTitle;
        lessonNameBreadcrumb.style.display = 'inline';
        lessonSeparator.style.display = 'inline';
      }
    }

    renderFilterTabs();
    renderVideos();
    initThemeToggle();
  }

  function renderFilterTabs(){
    if(!filterTabs) return;

    // Group videos by lesson
    const lessonGroups = {};
    allVideos.forEach(video => {
      if(!lessonGroups[video.lessonId]){
        lessonGroups[video.lessonId] = {
          title: video.lessonTitle,
          videos: []
        };
      }
      lessonGroups[video.lessonId].videos.push(video);
    });

    // Build tabs HTML
    let tabsHTML = `
      <button class="filter-tab ${currentFilter === 'all' ? 'active' : ''}" data-lesson="all">
        <span class="filter-tab-icon">📚</span>
        <span>Todas as Aulas</span>
        <span class="filter-tab-count">${allVideos.length}</span>
      </button>
    `;

    // Sort lessons by ID
    const sortedLessonIds = Object.keys(lessonGroups).sort((a,b) => parseInt(a) - parseInt(b));
    
    sortedLessonIds.forEach(lessonId => {
      const lesson = lessonGroups[lessonId];
      const isActive = currentFilter === parseInt(lessonId);
      
      tabsHTML += `
        <button class="filter-tab ${isActive ? 'active' : ''}" data-lesson="${lessonId}">
          <span class="filter-tab-icon">📹</span>
          <span>${lesson.title}</span>
          <span class="filter-tab-count">${lesson.videos.length}</span>
        </button>
      `;
    });

    filterTabs.innerHTML = tabsHTML;

    // Attach event listeners
    filterTabs.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const lessonFilter = tab.dataset.lesson;
        currentFilter = lessonFilter === 'all' ? 'all' : parseInt(lessonFilter);
        
        // Update active state
        filterTabs.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        renderVideos();
      });
    });
  }

  function renderVideos(){
    if(!videosGrid) return;

    // Filter videos
    let filteredVideos = allVideos;
    if(currentFilter !== 'all'){
      filteredVideos = allVideos.filter(v => v.lessonId === currentFilter);
    }

    // Sort by lesson and order
    filteredVideos.sort((a, b) => {
      if(a.lessonId !== b.lessonId) return a.lessonId - b.lessonId;
      return a.order - b.order;
    });

    if(filteredVideos.length === 0){
      videosGrid.style.display = 'none';
      if(emptyState) emptyState.style.display = 'block';
      return;
    }

    videosGrid.style.display = 'grid';
    if(emptyState) emptyState.style.display = 'none';
    videosGrid.innerHTML = '';

    // Group by lesson for better organization
    const groupedByLesson = {};
    filteredVideos.forEach(video => {
      if(!groupedByLesson[video.lessonId]){
        groupedByLesson[video.lessonId] = {
          title: video.lessonTitle,
          videos: []
        };
      }
      groupedByLesson[video.lessonId].videos.push(video);
    });

    // Render videos grouped by lesson
    Object.keys(groupedByLesson).sort((a,b) => parseInt(a) - parseInt(b)).forEach(lessonId => {
      const group = groupedByLesson[lessonId];
      
      // Add lesson header if showing all lessons
      if(currentFilter === 'all'){
        const lessonHeader = document.createElement('div');
        lessonHeader.className = 'lesson-group-header';
        lessonHeader.innerHTML = `
          <h3 class="lesson-group-title">
            <span class="lesson-group-icon">📖</span>
            <span>${group.title}</span>
          </h3>
          <div class="lesson-group-count">${group.videos.length} vídeos</div>
        `;
        videosGrid.appendChild(lessonHeader);
      }

      // Render videos
      group.videos.forEach(video => {
        const card = document.createElement('div');
        card.className = 'video-card';
        
        card.innerHTML = `
          <div class="video-card-thumbnail">
            <div class="video-thumbnail-icon">${video.thumbnail}</div>
            <div class="video-play-overlay">
              <div class="video-play-btn">▶</div>
            </div>
            <div class="video-duration">${video.duration}</div>
          </div>
          <div class="video-card-body">
            <h4 class="video-card-title">${video.title}</h4>
            <div class="video-card-meta">
              <div class="video-author">
                <div class="video-author-avatar">${video.author.charAt(0)}</div>
                <span class="video-author-name">${video.author}</span>
              </div>
              ${currentFilter === 'all' ? `<div class="video-lesson-badge">${video.lessonTitle}</div>` : ''}
            </div>
          </div>
        `;
        
        card.addEventListener('click', () => {
          openVideoModal(video);
        });
        
        videosGrid.appendChild(card);
      });
    });
  }

  function openVideoModal(video){
    if(!modalBackdrop || !modalBody) return;
    
    modalBackdrop.style.display = 'flex';
    modalBackdrop.setAttribute('aria-hidden', 'false');
    
    modalBody.innerHTML = `
      <div class="video-modal-content">
        <div class="video-modal-header">
          <div>
            <h3 class="video-modal-title">${video.title}</h3>
            <p class="video-modal-lesson">${video.lessonTitle}</p>
          </div>
        </div>
        
        <div class="video-modal-player">
          <div class="video-player-placeholder">
            <div class="video-player-icon">▶️</div>
            <p class="video-player-text">Player de vídeo (protótipo)</p>
          </div>
        </div>
        
        <div class="video-modal-info">
          <div class="video-modal-meta">
            <div class="video-meta-item">
              <span class="video-meta-icon">👤</span>
              <span>Por ${video.author}</span>
            </div>
            <div class="video-meta-item">
              <span class="video-meta-icon">⏱️</span>
              <span>${video.duration}</span>
            </div>
            <div class="video-meta-item">
              <span class="video-meta-icon">${moduleData.icon}</span>
              <span>${moduleData.title}</span>
            </div>
          </div>
          
          <div class="video-modal-actions">
            <button class="btn" onclick="document.getElementById('modalBackdrop').style.display='none'">
              Fechar
            </button>
            <button class="btn btn-success">
              <span>✓</span>
              <span>Marcar como Assistido</span>
            </button>
          </div>
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
