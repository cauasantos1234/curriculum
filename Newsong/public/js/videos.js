// videos.js - Display videos with advanced filtering
(function(){
  // Edge/Browser compatibility fixes
  (function initBrowserCompatibility() {
    // Detect Edge
    const isEdge = /Edge/.test(navigator.userAgent) || /Edg/.test(navigator.userAgent);
    
    if (isEdge) {
      console.log('🌐 Edge detectado - aplicando compatibilidade');
      document.documentElement.classList.add('is-edge');
      
      // Force repaint on transitions
      document.addEventListener('transitionend', function(e) {
        if (e.target.style) {
          e.target.style.transform = e.target.style.transform;
        }
      });
      
      // Smooth scroll polyfill for Edge
      if (!('scrollBehavior' in document.documentElement.style)) {
        const originalScrollTo = window.scrollTo;
        window.scrollTo = function(options) {
          if (typeof options === 'object') {
            originalScrollTo.call(window, options.left || 0, options.top || 0);
          } else {
            originalScrollTo.apply(window, arguments);
          }
        };
      }
    }
    
    // Force hardware acceleration
    document.body.style.transform = 'translateZ(0)';
  })();
  
  // Função para aguardar o UserProgress carregar
  function waitForUserProgress(callback, maxAttempts = 50){
    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      if(window.UserProgress){
        clearInterval(checkInterval);
        console.log('UserProgress API carregada com sucesso!');
        callback();
      } else if(attempts >= maxAttempts){
        clearInterval(checkInterval);
        console.error('UserProgress API não carregada após múltiplas tentativas!');
      }
    }, 100);
  }

  // Função principal que será executada após UserProgress carregar
  function initVideos(){
  // Variável para armazenar o vídeo atual do modal
  let currentModalVideo = null;
  
  // Database de todos os vídeos organizados por instrumento e aula
  const videosDatabase = {
    guitar: {
      beginner: {
        // Aula 101: Partes da guitarra e suas funções
        lesson101: [
          {id:10101, lessonId:101, lessonTitle:'Partes da guitarra e suas funções', title:'Corpo da Guitarra', duration:'5:23', author:'Mariana Silva', thumbnail:'🎸', order:1, postedDate:'2024-10-25', views:1250},
          {id:10102, lessonId:101, lessonTitle:'Partes da guitarra e suas funções', title:'Braço e Trastes', duration:'4:15', author:'Mariana Silva', thumbnail:'🎸', order:2, postedDate:'2024-10-26', views:980},
          {id:10103, lessonId:101, lessonTitle:'Partes da guitarra e suas funções', title:'Captadores e Controles', duration:'6:30', author:'Mariana Silva', thumbnail:'🎸', order:3, postedDate:'2024-10-27', views:1120},
          {id:10104, lessonId:101, lessonTitle:'Partes da guitarra e suas funções', title:'Ponte e Cordas', duration:'4:45', author:'Mariana Silva', thumbnail:'🎸', order:4, postedDate:'2024-10-28', views:890}
        ],
        // Aula 102: Tipos de guitarras
        lesson102: [
          {id:10201, lessonId:102, lessonTitle:'Tipos de guitarras (Strat, Les Paul, Tele, etc.)', title:'Fender Stratocaster', duration:'6:30', author:'Carlos Mendes', thumbnail:'🎸', order:1, postedDate:'2024-10-20', views:2100},
          {id:10202, lessonId:102, lessonTitle:'Tipos de guitarras (Strat, Les Paul, Tele, etc.)', title:'Gibson Les Paul', duration:'5:45', author:'Carlos Mendes', thumbnail:'🎸', order:2, postedDate:'2024-10-21', views:1850},
          {id:10203, lessonId:102, lessonTitle:'Tipos de guitarras (Strat, Les Paul, Tele, etc.)', title:'Fender Telecaster', duration:'5:20', author:'Carlos Mendes', thumbnail:'🎸', order:3, postedDate:'2024-10-23', views:1650},
          {id:10204, lessonId:102, lessonTitle:'Tipos de guitarras (Strat, Les Paul, Tele, etc.)', title:'Outros Modelos Populares', duration:'7:15', author:'Carlos Mendes', thumbnail:'🎸', order:4, postedDate:'2024-10-24', views:1420}
        ],
        // Aula 103: Como segurar a guitarra corretamente
        lesson103: [
          {id:10301, lessonId:103, lessonTitle:'Como segurar a guitarra corretamente', title:'Postura Sentado', duration:'4:20', author:'Ana Costa', thumbnail:'🎸', order:1, postedDate:'2024-10-15', views:3200},
          {id:10302, lessonId:103, lessonTitle:'Como segurar a guitarra corretamente', title:'Postura em Pé', duration:'4:10', author:'Ana Costa', thumbnail:'🎸', order:2, postedDate:'2024-10-16', views:2980},
          {id:10303, lessonId:103, lessonTitle:'Como segurar a guitarra corretamente', title:'Posição do Braço e Mão', duration:'5:30', author:'Ana Costa', thumbnail:'🎸', order:3, postedDate:'2024-10-18', views:2650}
        ],
        // Aula 104: Como afinar a guitarra
        lesson104: [
          {id:10401, lessonId:104, lessonTitle:'Como afinar a guitarra (manual e por app)', title:'Afinação Manual por Ouvido', duration:'6:45', author:'Pedro Santos', thumbnail:'🎸', order:1, postedDate:'2024-10-10', views:4500},
          {id:10402, lessonId:104, lessonTitle:'Como afinar a guitarra (manual e por app)', title:'Usando Afinador Digital', duration:'4:30', author:'Pedro Santos', thumbnail:'🎸', order:2, postedDate:'2024-10-11', views:3800},
          {id:10403, lessonId:104, lessonTitle:'Como afinar a guitarra (manual e por app)', title:'Apps de Afinação', duration:'5:15', author:'Pedro Santos', thumbnail:'🎸', order:3, postedDate:'2024-10-13', views:4100}
        ],
        // Aula 105: Cuidados e manutenção básica
        lesson105: [
          {id:10501, lessonId:105, lessonTitle:'Cuidados e manutenção básica', title:'Limpeza da Guitarra', duration:'5:50', author:'Lucas Oliveira', thumbnail:'🎸', order:1, postedDate:'2024-10-05', views:2800},
          {id:10502, lessonId:105, lessonTitle:'Cuidados e manutenção básica', title:'Troca de Cordas', duration:'8:20', author:'Lucas Oliveira', thumbnail:'🎸', order:2, postedDate:'2024-10-06', views:3500},
          {id:10503, lessonId:105, lessonTitle:'Cuidados e manutenção básica', title:'Armazenamento Correto', duration:'4:40', author:'Lucas Oliveira', thumbnail:'🎸', order:3, postedDate:'2024-10-08', views:2200},
          {id:10504, lessonId:105, lessonTitle:'Cuidados e manutenção básica', title:'Manutenção Preventiva', duration:'6:10', author:'Lucas Oliveira', thumbnail:'🎸', order:4, postedDate:'2024-10-09', views:2600}
        ]
      }
    },
    drums: {
      beginner: {
        lesson11: [
          {id:1101, lessonId:11, lessonTitle:'Ritmos Básicos', title:'Batida Básica', duration:'4:20', author:'Paulo Drums', thumbnail:'🥁', order:1, postedDate:'2024-10-22', views:1800},
          {id:1102, lessonId:11, lessonTitle:'Ritmos Básicos', title:'Coordenação das Mãos', duration:'5:10', author:'Paulo Drums', thumbnail:'🥁', order:2, postedDate:'2024-10-23', views:1650}
        ],
        lesson12: [
          {id:1201, lessonId:12, lessonTitle:'Coordenação Inicial', title:'Exercícios de Coordenação', duration:'6:55', author:'Carla Beats', thumbnail:'🥁', order:1, postedDate:'2024-10-18', views:2100},
          {id:1202, lessonId:12, lessonTitle:'Coordenação Inicial', title:'Independência dos Membros', duration:'8:00', author:'Carla Beats', thumbnail:'🥁', order:2, postedDate:'2024-10-19', views:1980}
        ]
      }
    },
    keyboard: {
      beginner: {
        lesson21: [
          {id:2101, lessonId:21, lessonTitle:'Escalas Simples', title:'Escala de Dó Maior', duration:'5:45', author:'Sofia Piano', thumbnail:'🎹', order:1, postedDate:'2024-10-14', views:2500},
          {id:2102, lessonId:21, lessonTitle:'Escalas Simples', title:'Escala de Sol Maior', duration:'6:00', author:'Sofia Piano', thumbnail:'🎹', order:2, postedDate:'2024-10-15', views:2350}
        ],
        lesson22: [
          {id:2201, lessonId:22, lessonTitle:'Postura e Técnica', title:'Postura ao Piano', duration:'4:30', author:'Helena Keys', thumbnail:'🎹', order:1, postedDate:'2024-10-10', views:3100},
          {id:2202, lessonId:22, lessonTitle:'Postura e Técnica', title:'Posição dos Dedos', duration:'5:00', author:'Helena Keys', thumbnail:'🎹', order:2, postedDate:'2024-10-11', views:2900}
        ]
      }
    },
    viola: {
      beginner: {
        lesson31: [
          {id:3101, lessonId:31, lessonTitle:'Dedilhado Básico', title:'Padrões de Dedilhado', duration:'6:25', author:'Gabriel Violão', thumbnail:'🪕', order:1, postedDate:'2024-10-08', views:2700},
          {id:3102, lessonId:31, lessonTitle:'Dedilhado Básico', title:'Exercícios de Dedilhado', duration:'7:00', author:'Gabriel Violão', thumbnail:'🪕', order:2, postedDate:'2024-10-09', views:2550}
        ],
        lesson32: [
          {id:3201, lessonId:32, lessonTitle:'Acordes Abertos', title:'Acordes Básicos Abertos', duration:'5:50', author:'Larissa Acoustic', thumbnail:'🪕', order:1, postedDate:'2024-10-05', views:3200},
          {id:3202, lessonId:32, lessonTitle:'Acordes Abertos', title:'Transição entre Acordes', duration:'5:00', author:'Larissa Acoustic', thumbnail:'🪕', order:2, postedDate:'2024-10-06', views:2950}
        ]
      }
    },
    bass: {
      beginner: {
        lesson41: [
          {id:4101, lessonId:41, lessonTitle:'Walking Bass Simples', title:'Conceito de Walking Bass', duration:'6:10', author:'Rodrigo Bass', thumbnail:'🎸', order:1, postedDate:'2024-10-12', views:1900},
          {id:4102, lessonId:41, lessonTitle:'Walking Bass Simples', title:'Exercícios de Walking Bass', duration:'6:00', author:'Rodrigo Bass', thumbnail:'🎸', order:2, postedDate:'2024-10-13', views:1750}
        ],
        lesson42: [
          {id:4201, lessonId:42, lessonTitle:'Técnica de Mão Direita', title:'Técnicas de Palhetada', duration:'5:30', author:'Patrícia Groove', thumbnail:'🎸', order:1, postedDate:'2024-10-07', views:2300},
          {id:4202, lessonId:42, lessonTitle:'Técnica de Mão Direita', title:'Exercícios de Mão Direita', duration:'6:00', author:'Patrícia Groove', thumbnail:'🎸', order:2, postedDate:'2024-10-08', views:2150}
        ]
      }
    }
  };

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

  const urlParams = new URLSearchParams(window.location.search);
  const instrumentId = urlParams.get('instrument') || 'guitar';
  const level = urlParams.get('level') || 'beginner';
  const lessonId = urlParams.get('lesson');

  const instrument = instruments[instrumentId];
  const moduleData = modulesInfo[level];
  
  // Get all videos for this instrument and level
  let allVideos = [];
  const instrumentVideos = videosDatabase[instrumentId];
  
  console.log('📊 Carregando vídeos para:', instrumentId, level);
  console.log('📁 instrumentVideos existe?', !!instrumentVideos);
  console.log('📂 instrumentVideos[level] existe?', instrumentVideos ? !!instrumentVideos[level] : 'N/A');
  
  if(instrumentVideos && instrumentVideos[level]){
    Object.keys(instrumentVideos[level]).forEach(lessonKey => {
      const videos = instrumentVideos[level][lessonKey];
      allVideos = allVideos.concat(videos);
    });
  }
  
  console.log(`✅ Total de vídeos fixos carregados: ${allVideos.length}`);

  // Load uploaded videos from IndexedDB and localStorage
  async function loadUploadedVideos(){
    try{
      let uploadedVideos = [];
      
      // Try to load from IndexedDB first
      if(window.VideoStorage){
        try{
          await VideoStorage.init();
          uploadedVideos = await VideoStorage.getAll();
          console.log('Loaded videos from IndexedDB:', uploadedVideos.length);
        }catch(e){
          console.warn('IndexedDB not available, trying localStorage:', e);
        }
      }
      
      // Fallback to localStorage if IndexedDB fails or is empty
      if(uploadedVideos.length === 0){
        uploadedVideos = JSON.parse(localStorage.getItem('newsong-videos') || '[]');
        console.log('Loaded videos from localStorage:', uploadedVideos.length);
      }
      
      // Filter by current instrument and module
      const moduleMap = {
        'bronze': 'beginner',
        'silver': 'intermediate',
        'gold': 'advanced'
      };
      
      return uploadedVideos
        .filter(v => v.instrument === instrumentId && moduleMap[v.module] === level)
        .map(v => ({
          id: v.id,
          lessonId: parseInt(v.lesson),
          lessonTitle: '', // Will be filled later
          title: v.title,
          duration: v.duration,
          author: v.author,
          thumbnail: v.uploadType === 'file' ? '📹' : '🎬',
          order: 999,
          postedDate: v.uploadedAt ? v.uploadedAt.split('T')[0] : v.postedDate,
          views: v.views || 0,
          description: v.description,
          videoId: v.videoId,
          uploadType: v.uploadType,
          fileData: v.fileData,
          fileType: v.fileType,
          fileName: v.fileName,
          isUploaded: true
        }));
    }catch(e){
      console.error('Error loading uploaded videos:', e);
      return [];
    }
  }
  
  // Merge uploaded videos with existing videos
  // This will be populated asynchronously
  let uploadedVideos = [];
  
  // Load and merge uploaded videos asynchronously
  async function loadAndMergeVideos(){
    console.log('🔄 Carregando vídeos enviados...');
    uploadedVideos = await loadUploadedVideos();
    console.log('✅ Vídeos carregados:', uploadedVideos.length);
    
    const beforeCount = allVideos.length;
    allVideos = allVideos.concat(uploadedVideos);
    console.log(`📊 Total de vídeos: ${beforeCount} (fixos) + ${uploadedVideos.length} (enviados) = ${allVideos.length}`);
    
    // Re-render after videos are loaded
    populateTeacherFilter();
    renderFilterTabs();
    renderVideos();
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
  
  // Context card elements
  const contextIcon = document.getElementById('contextIcon');
  const contextTitle = document.getElementById('contextTitle');
  const contextSubtitle = document.getElementById('contextSubtitle');
  const contextInstrument = document.getElementById('contextInstrument');
  const contextLevel = document.getElementById('contextLevel');
  const contextModule = document.getElementById('contextModule');
  const contextLesson = document.getElementById('contextLesson');
  
  // Advanced filter elements
  const searchInput = document.getElementById('searchInput');
  const teacherFilter = document.getElementById('teacherFilter');
  const sortFilter = document.getElementById('sortFilter');
  const clearFiltersBtn = document.getElementById('clearFilters');
  const activeFilters = document.getElementById('activeFilters');
  const activeFiltersTags = document.getElementById('activeFiltersTags');

  let currentFilter = lessonId ? parseInt(lessonId) : 'all';
  let currentSearchTerm = '';
  let currentTeacher = 'all';
  let currentSort = 'recent';

  // Update context info card
  function updateContextCard(){
    // contextIcon agora é SVG fixo, não precisa atualizar
    
    // Update title and subtitle
    if(contextTitle){
      contextTitle.textContent = instrument.name;
    }
    
    if(contextSubtitle){
      contextSubtitle.textContent = instrument.desc;
    }
    
    // Update instrument
    if(contextInstrument){
      contextInstrument.textContent = instrument.name;
    }
    
    // Update level
    if(contextLevel){
      const levelNames = {
        beginner: 'Bronze (Iniciante)',
        intermediate: 'Prata (Intermediário)',
        advanced: 'Ouro (Avançado)'
      };
      contextLevel.textContent = levelNames[level] || moduleData.title;
    }
    
    // Update module - show module number instead of repeating level
    if(contextModule){
      const moduleNumbers = {
        beginner: 'Módulo 1 - Bronze',
        intermediate: 'Módulo 2 - Prata',
        advanced: 'Módulo 3 - Ouro'
      };
      contextModule.textContent = moduleNumbers[level] || moduleData.title;
    }
    
    // Update lesson
    if(contextLesson){
      if(lessonId && allVideos.length > 0){
        const firstVideo = allVideos.find(v => v.lessonId === parseInt(lessonId));
        if(firstVideo){
          contextLesson.textContent = firstVideo.lessonTitle;
        } else {
          contextLesson.textContent = 'Todas as Aulas';
        }
      } else {
        contextLesson.textContent = 'Todas as Aulas';
      }
    }
  }
  
  // Update only the lesson in context card (when switching tabs)
  function updateContextCardLesson(){
    if(!contextLesson) return;
    
    if(currentFilter === 'all'){
      contextLesson.textContent = 'Todas as Aulas';
    } else if(allVideos.length > 0){
      const firstVideo = allVideos.find(v => v.lessonId === currentFilter);
      if(firstVideo){
        contextLesson.textContent = firstVideo.lessonTitle;
      } else {
        contextLesson.textContent = 'Todas as Aulas';
      }
    }
  }

  async function init(){
    // Update context card
    updateContextCard();
    
    // Update breadcrumb with instrument name
    if(instrumentName) instrumentName.textContent = instrument.name;
    
    // Update breadcrumb with module name
    if(moduleName) moduleName.textContent = moduleData.title;

    // Update breadcrumb with lesson name if a specific lesson is selected
    if(lessonId && allVideos.length > 0){
      const firstVideo = allVideos.find(v => v.lessonId === parseInt(lessonId));
      if(firstVideo && lessonName && lessonNameBreadcrumb && lessonSeparator){
        lessonName.textContent = firstVideo.lessonTitle;
        lessonNameBreadcrumb.style.display = 'inline';
        lessonSeparator.style.display = 'inline';
      }
    } else {
      // If no specific lesson, hide the lesson breadcrumb
      if(lessonNameBreadcrumb) lessonNameBreadcrumb.style.display = 'none';
      if(lessonSeparator) lessonSeparator.style.display = 'none';
    }

    setupAdvancedFilters();
    initThemeToggle();
    initSidebar();
    setupModalCloseHandler();
    
    // Load uploaded videos from IndexedDB asynchronously
    await loadAndMergeVideos();
  }

  // Setup modal close handler to refresh videos
  function setupModalCloseHandler(){
    const modalBackdrop = document.getElementById('modalBackdrop');
    const closeBtn = document.getElementById('closeModalBtn');
    
    const closeModal = () => {
      if(modalBackdrop){
        modalBackdrop.style.display = 'none';
        console.log('🔄 Modal fechado - recarregando vídeos para atualizar contadores');
        // Reload videos to update view counters
        renderVideos();
      }
    };
    
    if(closeBtn){
      closeBtn.addEventListener('click', closeModal);
    }
    
    if(modalBackdrop){
      modalBackdrop.addEventListener('click', (e) => {
        if(e.target === modalBackdrop){
          closeModal();
        }
      });
    }
  }

  // Populate teacher filter dropdown
  function populateTeacherFilter(){
    if(!teacherFilter) return;
    
    const teachers = [...new Set(allVideos.map(v => v.author))].sort();
    
    teachers.forEach(teacher => {
      const option = document.createElement('option');
      option.value = teacher;
      option.textContent = teacher;
      teacherFilter.appendChild(option);
    });
  }

  // Setup advanced filters event listeners
  function setupAdvancedFilters(){
    if(searchInput){
      searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase().trim();
        renderVideos();
        updateActiveFilters();
      });
    }

    if(teacherFilter){
      teacherFilter.addEventListener('change', (e) => {
        currentTeacher = e.target.value;
        renderVideos();
        updateActiveFilters();
      });
    }

    if(sortFilter){
      sortFilter.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderVideos();
      });
    }

    if(clearFiltersBtn){
      clearFiltersBtn.addEventListener('click', () => {
        clearAllFilters();
      });
    }
  }

  function clearAllFilters(){
    currentSearchTerm = '';
    currentTeacher = 'all';
    currentSort = 'recent';
    
    if(searchInput) searchInput.value = '';
    if(teacherFilter) teacherFilter.value = 'all';
    if(sortFilter) sortFilter.value = 'recent';
    
    renderVideos();
    updateActiveFilters();
  }

  function updateActiveFilters(){
    if(!activeFilters || !activeFiltersTags) return;
    
    const filters = [];
    
    if(currentSearchTerm){
      filters.push({
        type: 'search',
        label: `Busca: "${currentSearchTerm}"`,
        clear: () => {
          currentSearchTerm = '';
          if(searchInput) searchInput.value = '';
          renderVideos();
          updateActiveFilters();
        }
      });
    }
    
    if(currentTeacher !== 'all'){
      filters.push({
        type: 'teacher',
        label: `Professor: ${currentTeacher}`,
        clear: () => {
          currentTeacher = 'all';
          if(teacherFilter) teacherFilter.value = 'all';
          renderVideos();
          updateActiveFilters();
        }
      });
    }
    
    if(filters.length > 0){
      activeFilters.style.display = 'flex';
      activeFiltersTags.innerHTML = filters.map(filter => `
        <div class="filter-tag">
          <span>${filter.label}</span>
          <span class="filter-tag-remove" data-type="${filter.type}">✕</span>
        </div>
      `).join('');
      
      // Add event listeners to remove buttons
      activeFiltersTags.querySelectorAll('.filter-tag-remove').forEach((btn, index) => {
        btn.addEventListener('click', () => {
          filters[index].clear();
        });
      });
    } else {
      activeFilters.style.display = 'none';
      activeFiltersTags.innerHTML = '';
    }
  }

  function formatDate(dateString){
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateOnly = new Date(date.toDateString());
    const todayOnly = new Date(today.toDateString());
    const yesterdayOnly = new Date(yesterday.toDateString());
    
    if(dateOnly.getTime() === todayOnly.getTime()){
      return 'Hoje';
    } else if(dateOnly.getTime() === yesterdayOnly.getTime()){
      return 'Ontem';
    } else {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }

  function formatViews(views){
    if(views >= 1000){
      return (views / 1000).toFixed(1) + 'k';
    }
    return views.toString();
  }

  function renderFilterTabs(){
    if(!filterTabs) return;

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

    const sortedLessonIds = Object.keys(lessonGroups).sort((a,b) => parseInt(a) - parseInt(b));
    const totalLessons = sortedLessonIds.length;
    
    // Find current lesson index
    let currentLessonIndex = -1;
    if(currentFilter !== 'all'){
      currentLessonIndex = sortedLessonIds.findIndex(id => parseInt(id) === currentFilter);
    }

    let tabsHTML = `
      <button class="filter-tab ${currentFilter === 'all' ? 'active' : ''}" data-lesson="all">
        <svg class="filter-tab-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
        <span>Todas as Aulas</span>
      </button>
    `;

    // Navigation arrows (only show when a specific lesson is selected)
    if(currentFilter !== 'all' && currentLessonIndex !== -1){
      const hasPrevious = currentLessonIndex > 0;
      const hasNext = currentLessonIndex < totalLessons - 1;
      
      tabsHTML += `
        <div class="lesson-navigation">
          <button class="lesson-nav-btn ${!hasPrevious ? 'disabled' : ''}" 
                  id="prevLesson" 
                  ${!hasPrevious ? 'disabled' : ''}>
            <span>←</span>
          </button>
          
          <div class="current-lesson-display">
            <span class="lesson-number">Aula ${currentLessonIndex + 1}</span>
            <span class="lesson-separator">·</span>
            <span class="lesson-title">${lessonGroups[sortedLessonIds[currentLessonIndex]].title}</span>
          </div>
          
          <button class="lesson-nav-btn ${!hasNext ? 'disabled' : ''}" 
                  id="nextLesson"
                  ${!hasNext ? 'disabled' : ''}>
            <span>→</span>
          </button>
        </div>
      `;
    } else {
      // Show all lesson tabs when "Todas as Aulas" is selected
      sortedLessonIds.forEach((lessonId, index) => {
        const lesson = lessonGroups[lessonId];
        const isActive = currentFilter === parseInt(lessonId);
        const lessonNumber = index + 1;
        
        tabsHTML += `
          <button class="filter-tab ${isActive ? 'active' : ''}" data-lesson="${lessonId}">
            <svg class="filter-tab-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
            <span>Aula ${lessonNumber}</span>
          </button>
        `;
      });
    }

    filterTabs.innerHTML = tabsHTML;

    // Event listeners for lesson tabs
    filterTabs.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const lessonFilter = tab.dataset.lesson;
        currentFilter = lessonFilter === 'all' ? 'all' : parseInt(lessonFilter);
        
        // Update context card with new lesson info
        updateContextCardLesson();
        
        renderFilterTabs(); // Re-render to show navigation
        renderVideos();
      });
    });
    
    // Event listeners for navigation arrows
    const prevBtn = document.getElementById('prevLesson');
    const nextBtn = document.getElementById('nextLesson');
    
    if(prevBtn){
      prevBtn.addEventListener('click', () => {
        if(currentLessonIndex > 0){
          currentFilter = parseInt(sortedLessonIds[currentLessonIndex - 1]);
          updateContextCardLesson();
          renderFilterTabs();
          renderVideos();
        }
      });
    }
    
    if(nextBtn){
      nextBtn.addEventListener('click', () => {
        if(currentLessonIndex < totalLessons - 1){
          currentFilter = parseInt(sortedLessonIds[currentLessonIndex + 1]);
          updateContextCardLesson();
          renderFilterTabs();
          renderVideos();
        }
      });
    }
  }

  function renderVideos(){
    console.log('🎨 renderVideos() chamado');
    console.log('📦 Total de vídeos em allVideos:', allVideos.length);
    console.log('🎯 videosGrid elemento:', videosGrid);
    
    if(!videosGrid) {
      console.error('❌ ERRO: elemento videosGrid não encontrado!');
      return;
    }

    let filteredVideos = allVideos;
    
    // Apply lesson filter
    if(currentFilter !== 'all'){
      filteredVideos = filteredVideos.filter(v => v.lessonId === currentFilter);
    }
    
    // Apply search filter
    if(currentSearchTerm){
      filteredVideos = filteredVideos.filter(v => 
        v.title.toLowerCase().includes(currentSearchTerm) ||
        v.lessonTitle.toLowerCase().includes(currentSearchTerm) ||
        v.author.toLowerCase().includes(currentSearchTerm)
      );
    }
    
    // Apply teacher filter
    if(currentTeacher !== 'all'){
      filteredVideos = filteredVideos.filter(v => v.author === currentTeacher);
    }
    
    // Apply sorting
    filteredVideos = [...filteredVideos].sort((a, b) => {
      switch(currentSort){
        case 'recent':
          return new Date(b.postedDate) - new Date(a.postedDate);
        case 'oldest':
          return new Date(a.postedDate) - new Date(b.postedDate);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'duration':
          const aDuration = a.duration.split(':').reduce((acc, time) => (60 * acc) + +time);
          const bDuration = b.duration.split(':').reduce((acc, time) => (60 * acc) + +time);
          return bDuration - aDuration;
        default:
          if(a.lessonId !== b.lessonId) return a.lessonId - b.lessonId;
          return a.order - b.order;
      }
    });

    if(filteredVideos.length === 0){
      videosGrid.style.display = 'none';
      if(emptyState) {
        emptyState.style.display = 'block';
        emptyState.innerHTML = `
          <svg class="empty-state-icon" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <h3>Nenhum vídeo encontrado</h3>
          <p>Tente ajustar os filtros de pesquisa.</p>
        `;
      }
      return;
    }

    videosGrid.style.display = 'grid';
    if(emptyState) emptyState.style.display = 'none';
    videosGrid.innerHTML = '';

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

    Object.keys(groupedByLesson).sort((a,b) => {
      // Maintain lesson order when showing all
      if(currentFilter === 'all' && currentSort === 'recent'){
        return parseInt(a) - parseInt(b);
      }
      return parseInt(a) - parseInt(b);
    }).forEach(lessonId => {
      const group = groupedByLesson[lessonId];
      
      if(currentFilter === 'all'){
        const lessonHeader = document.createElement('div');
        lessonHeader.className = 'lesson-group-header';
        lessonHeader.innerHTML = `
          <h3 class="lesson-group-title">
            <svg class="lesson-group-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span>${group.title}</span>
          </h3>
          <div class="lesson-group-count">${group.videos.length} vídeos</div>
        `;
        videosGrid.appendChild(lessonHeader);
      }

      group.videos.forEach(video => {
        // Debug: verificar se tem thumbnail
        if(video.thumbnailData) {
          console.log(`📸 Vídeo "${video.title}" tem thumbnail (${video.thumbnailData.substring(0, 50)}...)`);
        } else {
          console.log(`⚠️ Vídeo "${video.title}" SEM thumbnail`);
        }
        
        const card = document.createElement('div');
        card.className = 'video-card';
        
        // 👁️ BUSCAR VIEWS REAIS do sistema VideoViews
        let realViews = video.views || 0;
        if (window.VideoViews && video.id) {
          const stats = window.VideoViews.getVideoViewStats(video.id);
          if (stats.totalViews > 0) {
            realViews = stats.totalViews;
          }
        }
        
        const hasThumbnail = video.thumbnailData && video.thumbnailData.length > 0;
        
        card.innerHTML = `
          <div class="video-card-thumbnail" style="${hasThumbnail ? `background-image: url('${video.thumbnailData}'); background-size: cover; background-position: center;` : ''}">
            ${!hasThumbnail ? `<svg class="video-thumbnail-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>` : ''}
            <div class="video-play-overlay">
              <div class="video-play-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            </div>
            <div class="video-duration">${video.duration}</div>
            <div class="video-date-badge">${formatDate(video.postedDate)}</div>
          </div>
          <div class="video-card-body">
            <h4 class="video-card-title">${video.title}</h4>
            <div class="video-card-meta">
              <div class="video-author">
                <div class="video-author-avatar">${video.author.charAt(0)}</div>
                <span class="video-author-name" data-author="${video.author}">${video.author}</span>
              </div>
              <div class="video-stats">
                <span class="video-stat">
                  <svg class="video-stat-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>${formatViews(realViews)}</span>
                </span>
              </div>
            </div>
            ${currentFilter === 'all' ? `<div class="video-lesson-badge">${video.lessonTitle}</div>` : ''}
          </div>
        `;
        
        card.addEventListener('click', () => {
          openVideoModal(video);
        });
        
        // Adicionar evento de clique no nome do professor
        const authorName = card.querySelector('.video-author-name');
        authorName.style.cursor = 'pointer';
        authorName.addEventListener('click', (e) => {
          e.stopPropagation(); // Impede que abra o modal do vídeo
          const author = e.target.dataset.author;
          window.location.href = `profile.html?user=${encodeURIComponent(author)}`;
        });
        
        videosGrid.appendChild(card);
      });
    });
  }

  function openVideoModal(video){
    if(!modalBackdrop || !modalBody) return;
    
    // Armazenar vídeo atual globalmente para uso na função de salvar
    currentModalVideo = video;
    
    // 👁️ REGISTRAR VISUALIZAÇÃO DO VÍDEO
    console.log('🎬 Abrindo vídeo:', video.id, video.title);
    console.log('📊 VideoViews disponível?', !!window.VideoViews);
    
    if(window.VideoViews && video.id){
      console.log('✅ Registrando visualização para vídeo ID:', video.id);
      const viewResult = window.VideoViews.registerView(video.id);
      
      console.log('📈 Resultado:', viewResult);
      
      if(viewResult.counted){
        console.log(`✅ NOVA VISUALIZAÇÃO! Total: ${viewResult.totalViews} views`);
        console.log(`👥 Visualizadores únicos: ${viewResult.uniqueViewers}`);
      } else {
        console.log(`ℹ️ Você já visualizou este vídeo. Total: ${viewResult.totalViews} views`);
      }
    } else {
      console.error('❌ VideoViews não disponível ou ID do vídeo inválido!');
      console.log('Video object:', video);
    }
    
    modalBackdrop.style.display = 'flex';
    modalBackdrop.setAttribute('aria-hidden', 'false');
    
    // Create player content - either YouTube embed, file player, or placeholder
    let playerContent;
    if(video.isUploaded){
      if(video.uploadType === 'file' && video.fileData){
        // Show uploaded file video
        playerContent = `
          <video 
            width="100%" 
            height="450" 
            controls
            style="border-radius:12px;background:#000">
            <source src="${video.fileData}" type="${video.fileType || 'video/mp4'}">
            Seu navegador não suporta a reprodução de vídeos.
          </video>
        `;
      } else if(video.uploadType === 'youtube' && video.videoId){
        // Show YouTube embed for uploaded YouTube videos
        playerContent = `
          <iframe 
            width="100%" 
            height="450" 
            src="https://www.youtube.com/embed/${video.videoId}?rel=0" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen
            style="border-radius:12px">
          </iframe>
        `;
      } else if(video.url){
        // Fallback: try to extract videoId from URL
        const videoId = extractYouTubeId(video.url);
        if(videoId){
          playerContent = `
            <iframe 
              width="100%" 
              height="450" 
              src="https://www.youtube.com/embed/${videoId}?rel=0" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowfullscreen
              style="border-radius:12px">
            </iframe>
          `;
        } else {
          playerContent = `
            <div class="video-player-placeholder">
              <div class="video-player-icon">❌</div>
              <p class="video-player-text">Erro ao carregar vídeo</p>
              <p style="font-size:12px;color:var(--muted);margin-top:8px">URL inválida</p>
            </div>
          `;
        }
      } else {
        playerContent = `
          <div class="video-player-placeholder">
            <div class="video-player-icon">▶️</div>
            <p class="video-player-text">Player de vídeo (protótipo)</p>
          </div>
        `;
      }
    } else {
      playerContent = `
        <div class="video-player-placeholder">
          <div class="video-player-icon">▶️</div>
          <p class="video-player-text">Player de vídeo (protótipo)</p>
        </div>
      `;
    }
    
    // Helper function to extract YouTube ID
    function extractYouTubeId(url){
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
        /youtube\.com\/embed\/([^&\s]+)/
      ];
      
      for(const pattern of patterns){
        const match = url.match(pattern);
        if(match) return match[1];
      }
      return null;
    }
    
    modalBody.innerHTML = `
      <div class="video-modal-layout">
        <!-- Left Column: Video and Info -->
        <div class="video-modal-left">
          <div class="video-modal-player">
            ${playerContent}
          </div>
          
          <div class="video-modal-header">
            <h3 class="video-modal-title">${video.title}</h3>
            <p class="video-modal-lesson">📚 ${video.lessonTitle}</p>
          </div>
          
          <!-- Like/Dislike Actions -->
          <div class="video-actions-bar">
            <div class="video-actions-left">
              <button class="btn-action btn-like" data-video-id="${video.id}" onclick="handleLike(${video.id})">
                <span class="action-icon">👍</span>
                <span class="action-count" id="likeCount-${video.id}">0</span>
              </button>
              <button class="btn-action btn-dislike" data-video-id="${video.id}" onclick="handleDislike(${video.id})">
                <span class="action-icon">👎</span>
                <span class="action-count" id="dislikeCount-${video.id}">0</span>
              </button>
            </div>
            <div class="video-actions-right">
              <button class="btn-action">
                <span class="action-icon">📤</span>
                <span>Compartilhar</span>
              </button>
              <button class="btn-action btn-save" data-video-id="${video.id}" data-lesson-id="${video.lessonId}" onclick="handleSaveVideo(${video.id})">
                <span class="action-icon">⭐</span>
                <span>Salvar</span>
              </button>
            </div>
          </div>
          
          ${video.description ? `
          <div class="video-description-section">
            <h4 class="section-subtitle">📝 Descrição</h4>
            <p class="video-modal-description">${video.description}</p>
          </div>
          ` : ''}
          
          <div class="video-info-grid">
            <div class="info-item">
              <span class="info-icon">👤</span>
              <div class="info-content">
                <span class="info-label">Professor</span>
                <span class="info-value clickable-author" data-author="${video.author}" style="cursor: pointer; transition: color 0.2s ease;" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color=''">${video.author}</span>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">⏱️</span>
              <div class="info-content">
                <span class="info-label">Duração</span>
                <span class="info-value">${video.duration}</span>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">${moduleData.icon}</span>
              <div class="info-content">
                <span class="info-label">Módulo</span>
                <span class="info-value">${moduleData.title}</span>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </span>
              <div class="info-content">
                <span class="info-label">Postado</span>
                <span class="info-value">${formatDate(video.postedDate)}</span>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </span>
              <div class="info-content">
                <span class="info-label">Visualizações</span>
                <span class="info-value" id="modalViewCount-${video.id}">${video.views.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div class="video-modal-actions">
            <button class="btn-mark-watched" id="btnCompleteLesson-${video.lessonId}" data-lesson-id="${video.lessonId}" data-duration="${video.duration}" data-instrument="${instrumentId}" data-level="${level}">
              <span>✓</span>
              <span>Concluir Aula</span>
            </button>
          </div>
        </div>
        
        <!-- Right Column: Comments -->
        <div class="video-modal-right">
          <div class="comments-section">
            <div class="comments-header">
              <h4 class="comments-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Comentários
              </h4>
              <span class="comments-count" id="commentsCount-${video.id}">0</span>
            </div>
            
            <div class="comment-input-area">
              <div class="comment-user-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div class="comment-input-wrapper">
                <textarea 
                  class="comment-input" 
                  id="commentInput-${video.id}"
                  placeholder="Adicione um comentário...
Compartilhe suas dúvidas, aprendizados ou dicas sobre esta aula!"
                  rows="3"></textarea>
                <div class="comment-input-actions">
                  <button class="btn-cancel-comment" onclick="clearComment(${video.id})">Cancelar</button>
                  <button class="btn-post-comment" onclick="postComment(${video.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>Comentar</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="comments-list" id="commentsList-${video.id}">
              <!-- Comments will be rendered here -->
              <div class="empty-comments">
                <div class="empty-comments-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <p>Seja o primeiro a comentar!</p>
                <p class="empty-comments-subtitle">Compartilhe suas impressões sobre esta aula</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Update view count in modal with real data
    if(window.VideoViews && video.id){
      const stats = window.VideoViews.getVideoViewStats(video.id);
      const modalViewCount = document.getElementById(`modalViewCount-${video.id}`);
      if(modalViewCount && stats.totalViews > 0){
        modalViewCount.textContent = stats.totalViews.toLocaleString();
        console.log('👁️ Visualizações atualizadas no modal:', stats.totalViews);
      }
    }
    
    // Initialize likes/dislikes from localStorage
    initializeVideoInteractions(video.id);
    
    // Initialize complete lesson button
    initializeCompleteLessonButton(video);
    
    // Adicionar evento de clique no nome do professor no modal
    const clickableAuthor = document.querySelector('.clickable-author');
    if(clickableAuthor){
      clickableAuthor.addEventListener('click', (e) => {
        const author = e.target.dataset.author;
        window.location.href = `profile.html?user=${encodeURIComponent(author)}`;
      });
    }
  }
  
  // Inicializar botão de concluir aula
  function initializeCompleteLessonButton(video){
    const btn = document.getElementById(`btnCompleteLesson-${video.lessonId}`);
    if(!btn) return;
    
    // Verificar se já foi concluída
    if(window.UserProgress && window.UserProgress.isLessonCompleted(video.lessonId)){
      btn.innerHTML = '<span>✓</span><span>Aula Concluída</span>';
      btn.classList.add('completed');
      btn.disabled = true;
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      btn.style.cursor = 'not-allowed';
      btn.style.opacity = '0.8';
      return;
    }
    
    // Adicionar event listener
    btn.addEventListener('click', () => {
      handleCompleteLesson(video, btn);
    });
  }
  
  // Handler para concluir aula
  function handleCompleteLesson(video, btn){
    if(!window.UserProgress){
      alert('Sistema de progresso não está disponível.');
      return;
    }
    
    // Mostrar modal de confirmação elegante
    showCompletionConfirmation(video, btn);
  }
  
  // Modal de confirmação de conclusão de aula
  function showCompletionConfirmation(video, btn){
    const modal = document.createElement('div');
    modal.className = 'completion-confirmation-modal';
    modal.innerHTML = `
      <div class="completion-confirmation-overlay"></div>
      <div class="completion-confirmation-content">
        <div class="completion-confirmation-header">
          <h2>Concluir Aula</h2>
        </div>
        
        <div class="lesson-complete-video">${video.title}</div>
        
        <div class="completion-question">
          <p>Você assistiu e compreendeu o conteúdo?</p>
        </div>
        
        <div class="completion-confirmation-footer">
          <button class="btn-cancel-completion" id="btnCancelCompletion">Não</button>
          <button class="btn-confirm-completion" id="btnConfirmCompletion">Sim, concluir</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => modal.classList.add('show'), 10);
    
    const closeModal = () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 200);
    };
    
    document.getElementById('btnCancelCompletion').addEventListener('click', closeModal);
    modal.querySelector('.completion-confirmation-overlay').addEventListener('click', closeModal);
    
    document.getElementById('btnConfirmCompletion').addEventListener('click', () => {
      // Marcar como concluída
      const lessonId = parseInt(btn.dataset.lessonId);
      const duration = btn.dataset.duration;
      const instrument = btn.dataset.instrument;
      const level = btn.dataset.level;
      
      const progress = window.UserProgress.completeLesson(lessonId, duration, instrument, level);
      
      // Atualizar botão
      btn.innerHTML = '<span>✓</span><span>Aula Concluída!</span>';
      btn.classList.add('completed');
      btn.disabled = true;
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      btn.style.cursor = 'not-allowed';
      btn.style.opacity = '0.8';
      
      // Fechar modal de confirmação
      closeModal();
      
      // Mostrar feedback visual
      setTimeout(() => {
        showCompletionFeedback(video);
      }, 300);
      
      // 🌟 MOSTRAR MODAL DE AVALIAÇÃO DO PROFESSOR após 1 segundo
      setTimeout(() => {
        if (window.showTeacherRatingModal && video.author) {
          window.showTeacherRatingModal(
            video.author,
            lessonId,
            video.lessonTitle,
            video.id
          );
        }
      }, 1500);
      
      console.log('Aula concluída:', video.lessonTitle, progress);
    });
    
    // Fechar com ESC
    const handleEsc = (e) => {
      if(e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
  }
  
  // Mostrar feedback de conclusão
  function showCompletionFeedback(video){
    const feedback = document.createElement('div');
    feedback.className = 'completion-feedback';
    feedback.innerHTML = `
      <div class="completion-feedback-content">
        <div class="completion-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div class="completion-text">
          <div class="completion-title">Parabéns!</div>
          <div class="completion-message">Aula concluída com sucesso!</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      feedback.classList.remove('show');
      setTimeout(() => feedback.remove(), 300);
    }, 3000);
  }
  
  // Video Interaction Functions (Likes/Dislikes)
  window.handleLike = function(videoId){
    const session = JSON.parse(localStorage.getItem('ns-session'));
    if(!session || !session.email){
      alert('Você precisa estar logado para curtir!');
      return;
    }
    
    const likeBtn = document.querySelector(`.btn-like[data-video-id="${videoId}"]`);
    const dislikeBtn = document.querySelector(`.btn-dislike[data-video-id="${videoId}"]`);
    const likeCountEl = document.getElementById(`likeCount-${videoId}`);
    
    const userKey = `video-${videoId}-like-${session.email}`;
    const statsKey = `video-${videoId}-interaction`;
    
    // Check if user already liked
    if(localStorage.getItem(userKey) === 'liked'){
      alert('Você já curtiu este vídeo!');
      return;
    }
    
    // Load stats
    let stats = JSON.parse(localStorage.getItem(statsKey) || '{"likes":0,"dislikes":0}');
    
    // Remove dislike if exists
    const dislikeKey = `video-${videoId}-dislike-${session.email}`;
    if(localStorage.getItem(dislikeKey) === 'disliked'){
      stats.dislikes--;
      localStorage.removeItem(dislikeKey);
      dislikeBtn.classList.remove('active');
    }
    
    // Add like
    stats.likes++;
    localStorage.setItem(userKey, 'liked');
    localStorage.setItem(statsKey, JSON.stringify(stats));
    likeBtn.classList.add('active');
    
    likeCountEl.textContent = stats.likes;
    document.getElementById(`dislikeCount-${videoId}`).textContent = stats.dislikes;
  };
  
  window.handleDislike = function(videoId){
    const session = JSON.parse(localStorage.getItem('ns-session'));
    if(!session || !session.email){
      alert('Você precisa estar logado para dar dislike!');
      return;
    }
    
    const likeBtn = document.querySelector(`.btn-like[data-video-id="${videoId}"]`);
    const dislikeBtn = document.querySelector(`.btn-dislike[data-video-id="${videoId}"]`);
    const dislikeCountEl = document.getElementById(`dislikeCount-${videoId}`);
    
    const userKey = `video-${videoId}-dislike-${session.email}`;
    const statsKey = `video-${videoId}-interaction`;
    
    // Check if user already disliked
    if(localStorage.getItem(userKey) === 'disliked'){
      alert('Você já deu dislike neste vídeo!');
      return;
    }
    
    // Load stats
    let stats = JSON.parse(localStorage.getItem(statsKey) || '{"likes":0,"dislikes":0}');
    
    // Remove like if exists
    const likeKey = `video-${videoId}-like-${session.email}`;
    if(localStorage.getItem(likeKey) === 'liked'){
      stats.likes--;
      localStorage.removeItem(likeKey);
      likeBtn.classList.remove('active');
    }
    
    // Add dislike
    stats.dislikes++;
    localStorage.setItem(userKey, 'disliked');
    localStorage.setItem(statsKey, JSON.stringify(stats));
    dislikeBtn.classList.add('active');
    
    dislikeCountEl.textContent = stats.dislikes;
    document.getElementById(`likeCount-${videoId}`).textContent = stats.likes;
  };
  
  function initializeVideoInteractions(videoId){
    const session = JSON.parse(localStorage.getItem('ns-session'));
    const statsKey = `video-${videoId}-interaction`;
    const stats = JSON.parse(localStorage.getItem(statsKey) || '{"likes":0,"dislikes":0}');
    
    document.getElementById(`likeCount-${videoId}`).textContent = stats.likes;
    document.getElementById(`dislikeCount-${videoId}`).textContent = stats.dislikes;
    
    // Check if current user has liked or disliked
    if(session && session.email){
      const likeKey = `video-${videoId}-like-${session.email}`;
      const dislikeKey = `video-${videoId}-dislike-${session.email}`;
      
      if(localStorage.getItem(likeKey) === 'liked'){
        document.querySelector(`.btn-like[data-video-id="${videoId}"]`).classList.add('active');
      } else if(localStorage.getItem(dislikeKey) === 'disliked'){
        document.querySelector(`.btn-dislike[data-video-id="${videoId}"]`).classList.add('active');
      }
    }
    
    // Load comments
    loadComments(videoId);
    
    // Initialize save button
    initializeSaveButton(videoId);
  }

  // Initialize save button state
  function initializeSaveButton(videoId){
    if(!window.SavedVideos) return;
    
    const saveBtn = document.querySelector(`.btn-save[data-video-id="${videoId}"]`);
    if(!saveBtn) return;
    
    const isSaved = window.SavedVideos.isSaved(videoId);
    if(isSaved){
      saveBtn.classList.add('active', 'saved');
      saveBtn.innerHTML = `
        <span class="action-icon">✓</span>
        <span>Salvo</span>
      `;
    }
  }

  // Handle save video
  window.handleSaveVideo = function(videoId){
    console.log('🎯 handleSaveVideo chamado com videoId:', videoId);
    
    if(!window.SavedVideos){
      console.error('❌ SavedVideos não está disponível!');
      showSaveNotification('Sistema de salvos não disponível. Verifique se você está logado.', 'error');
      return;
    }
    
    console.log('✅ SavedVideos disponível');
    
    // Verificar se usuário está logado
    const user = window.SavedVideos.getCurrentUserInfo();
    if(!user || !user.email){
      console.error('❌ Usuário não logado');
      showSaveNotification('Você precisa estar logado para salvar vídeos!', 'error');
      // Opcional: redirecionar para login
      setTimeout(() => {
        if(confirm('Você precisa fazer login para salvar vídeos. Deseja ir para a página de login?')){
          window.location.href = 'login.html';
        }
      }, 1500);
      return;
    }
    
    console.log('✅ Usuário logado:', user.email);

    const saveBtn = document.querySelector(`.btn-save[data-video-id="${videoId}"]`);
    if(!saveBtn){
      console.error('❌ Botão de salvar não encontrado para videoId:', videoId);
      return;
    }
    
    console.log('✅ Botão encontrado');

    // Check if already saved
    if(window.SavedVideos.isSaved(videoId)){
      console.log('📌 Vídeo já salvo, removendo...');
      // Unsave
      const result = window.SavedVideos.unsaveVideo(videoId);
      if(result.success){
        saveBtn.classList.remove('active', 'saved');
        saveBtn.innerHTML = `
          <span class="action-icon">⭐</span>
          <span>Salvar</span>
        `;
        showSaveNotification('Vídeo removido dos salvos', 'info');
        console.log('✅ Vídeo removido com sucesso');
      } else {
        console.error('❌ Erro ao remover:', result.message);
        showSaveNotification(result.message, 'error');
      }
    } else {
      console.log('💾 Salvando vídeo...');
      
      // Usar o vídeo armazenado do modal em vez de tentar extrair do DOM
      if(!currentModalVideo){
        console.error('❌ Dados do vídeo não encontrados');
        showSaveNotification('Erro: dados do vídeo não encontrados', 'error');
        return;
      }
      
      console.log('📋 currentModalVideo completo:', currentModalVideo);
      
      // Usar os dados do vídeo atual do modal
      const video = {
        id: videoId,
        title: currentModalVideo.title || 'Sem título',
        author: currentModalVideo.author || 'Desconhecido',
        duration: currentModalVideo.duration || '00:00',
        views: currentModalVideo.views || 0,
        lessonTitle: currentModalVideo.lessonTitle || '',
        lessonId: currentModalVideo.lessonId || parseInt(saveBtn.getAttribute('data-lesson-id')) || 0,
        thumbnail: currentModalVideo.thumbnail || '🎸',
        instrument: currentModalVideo.instrument || instrumentId,
        level: currentModalVideo.level || level,
        postedDate: currentModalVideo.postedDate || new Date().toISOString().split('T')[0],
        // Preservar dados de upload se existirem
        isUploaded: currentModalVideo.isUploaded || false,
        uploadType: currentModalVideo.uploadType || null,
        videoId: currentModalVideo.videoId || null,
        fileData: currentModalVideo.fileData || null,
        fileType: currentModalVideo.fileType || null,
        fileName: currentModalVideo.fileName || null,
        thumbnailData: currentModalVideo.thumbnailData || null,
        description: currentModalVideo.description || ''
      };
      
      console.log('📦 Dados do vídeo preparados para salvar:', video);

      try {
        const result = window.SavedVideos.saveVideo(video);
        console.log('💾 Resultado do SavedVideos.saveVideo:', result);
        
        if(result.success){
          saveBtn.classList.add('active', 'saved');
          saveBtn.innerHTML = `
            <span class="action-icon">✓</span>
            <span>Salvo</span>
          `;
          showSaveNotification('Vídeo salvo com sucesso! 🎉', 'success');
          console.log('✅ Vídeo salvo com sucesso!');
        } else {
          console.error('❌ Erro ao salvar:', result.message);
          showSaveNotification(result.message || 'Erro ao salvar vídeo', 'error');
        }
      } catch(error) {
        console.error('❌ Exceção ao salvar vídeo:', error);
        showSaveNotification('Erro ao salvar vídeo: ' + error.message, 'error');
      }
    }
  };

  // Show save notification
  function showSaveNotification(message, type = 'success'){
    const notification = document.createElement('div');
    notification.className = `save-notification save-notification-${type}`;
    notification.innerHTML = `
      <div class="save-notification-content">
        <span class="save-notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
        <span class="save-notification-text">${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  // Comment Functions
  window.postComment = function(videoId){
    const session = JSON.parse(localStorage.getItem('ns-session'));
    if(!session || !session.email){
      alert('Você precisa estar logado para comentar!');
      return;
    }
    
    const input = document.getElementById(`commentInput-${videoId}`);
    const commentText = input.value.trim();
    
    if(!commentText){
      alert('Por favor, escreva um comentário antes de enviar.');
      return;
    }
    
    const storageKey = `video-${videoId}-comments`;
    const comments = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const newComment = {
      id: Date.now(),
      text: commentText,
      author: session.name || 'Usuário',
      date: new Date().toISOString(),
      likes: 0,
      replies: []
    };
    
    comments.unshift(newComment);
    localStorage.setItem(storageKey, JSON.stringify(comments));
    
    input.value = '';
    loadComments(videoId);
  };
  
  window.clearComment = function(videoId){
    const input = document.getElementById(`commentInput-${videoId}`);
    input.value = '';
  };
  
  function loadComments(videoId){
    const storageKey = `video-${videoId}-comments`;
    const comments = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const commentsList = document.getElementById(`commentsList-${videoId}`);
    const commentsCount = document.getElementById(`commentsCount-${videoId}`);
    
    commentsCount.textContent = comments.length;
    
    if(comments.length === 0){
      commentsList.innerHTML = `
        <div class="empty-comments">
          <div class="empty-comments-icon">💭</div>
          <p>Seja o primeiro a comentar!</p>
          <p class="empty-comments-subtitle">Compartilhe suas impressões sobre esta aula</p>
        </div>
      `;
      return;
    }
    
    commentsList.innerHTML = comments.map(comment => {
      const session = JSON.parse(localStorage.getItem('ns-session'));
      const likeKey = `comment-${comment.id}-like-${session?.email || ''}`;
      const hasLiked = localStorage.getItem(likeKey) === 'liked';
      
      const repliesHtml = (comment.replies || []).map(reply => `
        <div class="comment-item reply-item">
          <div class="comment-avatar">
            <span>👤</span>
          </div>
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-author">${reply.author}</span>
              <span class="comment-date">${formatCommentDate(reply.date)}</span>
            </div>
            <p class="comment-text">${reply.text}</p>
          </div>
        </div>
      `).join('');
      
      return `
        <div class="comment-item">
          <div class="comment-avatar">
            <span>👤</span>
          </div>
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-author">${comment.author}</span>
              <span class="comment-date">${formatCommentDate(comment.date)}</span>
            </div>
            <p class="comment-text">${comment.text}</p>
            <div class="comment-actions">
              <button class="comment-like-btn ${hasLiked ? 'active' : ''}" onclick="likeComment(${videoId}, ${comment.id})">
                <span>👍</span>
                <span class="comment-like-count">${comment.likes || 0}</span>
              </button>
              <button class="comment-reply-btn" onclick="toggleReplyBox(${comment.id})">
                <span>↩️</span>
                <span>Responder</span>
              </button>
            </div>
            <div class="reply-box" id="replyBox-${comment.id}" style="display:none;">
              <textarea class="reply-input" id="replyInput-${comment.id}" placeholder="Escreva sua resposta..."></textarea>
              <div class="reply-actions">
                <button class="btn-cancel-reply" onclick="toggleReplyBox(${comment.id})">Cancelar</button>
                <button class="btn-post-reply" onclick="postReply(${videoId}, ${comment.id})">
                  <span>💬</span>
                  <span>Responder</span>
                </button>
              </div>
            </div>
            ${repliesHtml ? `<div class="replies-container">${repliesHtml}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }
  
  window.likeComment = function(videoId, commentId){
    const session = JSON.parse(localStorage.getItem('ns-session'));
    if(!session || !session.email){
      alert('Você precisa estar logado para curtir comentários!');
      return;
    }
    
    const likeKey = `comment-${commentId}-like-${session.email}`;
    
    // Check if user already liked this comment
    if(localStorage.getItem(likeKey) === 'liked'){
      alert('Você já curtiu este comentário!');
      return;
    }
    
    const storageKey = `video-${videoId}-comments`;
    const comments = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const comment = comments.find(c => c.id === commentId);
    if(comment){
      comment.likes = (comment.likes || 0) + 1;
      localStorage.setItem(likeKey, 'liked');
      localStorage.setItem(storageKey, JSON.stringify(comments));
      loadComments(videoId);
    }
  };
  
  window.toggleReplyBox = function(commentId){
    const replyBox = document.getElementById(`replyBox-${commentId}`);
    if(replyBox){
      replyBox.style.display = replyBox.style.display === 'none' ? 'block' : 'none';
    }
  };
  
  window.postReply = function(videoId, commentId){
    const session = JSON.parse(localStorage.getItem('ns-session'));
    if(!session || !session.email){
      alert('Você precisa estar logado para responder!');
      return;
    }
    
    const replyInput = document.getElementById(`replyInput-${commentId}`);
    const replyText = replyInput.value.trim();
    
    if(!replyText){
      alert('Por favor, escreva uma resposta antes de enviar.');
      return;
    }
    
    const storageKey = `video-${videoId}-comments`;
    const comments = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const comment = comments.find(c => c.id === commentId);
    if(comment){
      if(!comment.replies) comment.replies = [];
      
      comment.replies.push({
        id: Date.now(),
        text: replyText,
        author: session.name || 'Usuário',
        date: new Date().toISOString()
      });
      
      localStorage.setItem(storageKey, JSON.stringify(comments));
      replyInput.value = '';
      toggleReplyBox(commentId);
      loadComments(videoId);
    }
  };
  
  function formatCommentDate(dateString){
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if(diffMins < 1) return 'agora';
    if(diffMins < 60) return `há ${diffMins} min`;
    if(diffHours < 24) return `há ${diffHours}h`;
    if(diffDays < 7) return `há ${diffDays}d`;
    
    return date.toLocaleDateString('pt-BR');
  }

  function closeModal(){ 
    if(!modalBackdrop) return; 
    modalBackdrop.style.display='none'; 
    modalBackdrop.setAttribute('aria-hidden','true'); 
    modalBody.innerHTML=''; 
  }

  if(modalBackdrop){
    modalBackdrop.addEventListener('click', e => { 
      if(e.target === modalBackdrop) closeModal(); 
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
      'lessons': 'lessons-view.html',
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
      if(theme === 'dark'){
        themeIcon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>`;
      } else {
        themeIcon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>`;
      }
    }
  }

  // Adicionar estilos para feedback de conclusão
  const style = document.createElement('style');
  style.textContent = `
    .completion-feedback {
      position: fixed;
      top: 100px;
      right: -400px;
      background: linear-gradient(135deg, rgba(34,197,94,0.95), rgba(22,163,74,0.95));
      color: white;
      padding: 20px 24px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      z-index: 10000;
      transition: right 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      min-width: 320px;
    }
    
    .completion-feedback.show {
      right: 24px;
    }
    
    .completion-feedback-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .completion-icon {
      font-size: 48px;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
    }
    
    .completion-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    
    .completion-message {
      font-size: 16px;
      font-weight: 600;
    }
    
    @media (max-width: 768px) {
      .completion-feedback {
        min-width: 280px;
        right: -350px;
      }
      
      .completion-feedback.show {
        right: 16px;
      }
    }
  `;
  document.head.appendChild(style);

  init();
  
  // Verificar se SavedVideos está disponível
  setTimeout(() => {
    if(window.SavedVideos){
      console.log('✅ SavedVideos disponível e pronto para uso');
    } else {
      console.error('❌ ERRO: SavedVideos não está disponível! Funcionalidade de salvos não funcionará.');
    }
  }, 1000);
  
  } // Fim da função initVideos

  // Aguardar UserProgress carregar antes de inicializar
  if(window.UserProgress){
    initVideos();
  } else {
    waitForUserProgress(initVideos);
  }
})();
