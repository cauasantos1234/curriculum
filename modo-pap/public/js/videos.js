// videos.js - Display videos with advanced filtering
(function(){
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
  
  if(instrumentVideos && instrumentVideos[level]){
    Object.keys(instrumentVideos[level]).forEach(lessonKey => {
      const videos = instrumentVideos[level][lessonKey];
      allVideos = allVideos.concat(videos);
    });
  }

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
  const backToApp = document.getElementById('backToApp');
  
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

  async function init(){
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
    
    // Load uploaded videos from IndexedDB asynchronously
    await loadAndMergeVideos();
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
          renderFilterTabs();
          renderVideos();
        }
      });
    }
    
    if(nextBtn){
      nextBtn.addEventListener('click', () => {
        if(currentLessonIndex < totalLessons - 1){
          currentFilter = parseInt(sortedLessonIds[currentLessonIndex + 1]);
          renderFilterTabs();
          renderVideos();
        }
      });
    }
  }

  function renderVideos(){
    if(!videosGrid) return;

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
        const card = document.createElement('div');
        card.className = 'video-card';
        
        card.innerHTML = `
          <div class="video-card-thumbnail">
            <svg class="video-thumbnail-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
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
                <span class="video-author-name">${video.author}</span>
              </div>
              <div class="video-stats">
                <span class="video-stat">
                  <svg class="video-stat-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>${formatViews(video.views)}</span>
                </span>
              </div>
            </div>
            ${currentFilter === 'all' ? `<div class="video-lesson-badge">${video.lessonTitle}</div>` : ''}
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
      } else if(video.videoId){
        // Show YouTube embed
        playerContent = `
          <iframe 
            width="100%" 
            height="450" 
            src="https://www.youtube.com/embed/${video.videoId}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            style="border-radius:12px">
          </iframe>
        `;
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
              <button class="btn-action">
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
                <span class="info-value">${video.author}</span>
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
              <span class="info-icon">📅</span>
              <div class="info-content">
                <span class="info-label">Postado</span>
                <span class="info-value">${formatDate(video.postedDate)}</span>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">👁️</span>
              <div class="info-content">
                <span class="info-label">Visualizações</span>
                <span class="info-value">${video.views.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div class="video-modal-actions">
            <button class="btn-mark-watched">
              <span>✓</span>
              <span>Marcar como Assistido</span>
            </button>
          </div>
        </div>
        
        <!-- Right Column: Comments -->
        <div class="video-modal-right">
          <div class="comments-section">
            <div class="comments-header">
              <h4 class="comments-title">💬 Comentários</h4>
              <span class="comments-count" id="commentsCount-${video.id}">0</span>
            </div>
            
            <div class="comment-input-area">
              <div class="comment-user-avatar">
                <span>👤</span>
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
                    <span>💬</span>
                    <span>Comentar</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="comments-list" id="commentsList-${video.id}">
              <!-- Comments will be rendered here -->
              <div class="empty-comments">
                <div class="empty-comments-icon">💭</div>
                <p>Seja o primeiro a comentar!</p>
                <p class="empty-comments-subtitle">Compartilhe suas impressões sobre esta aula</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Initialize likes/dislikes from localStorage
    initializeVideoInteractions(video.id);
  }
  
  // Video Interaction Functions (Likes/Dislikes)
  window.handleLike = function(videoId){
    const likeBtn = document.querySelector(`.btn-like[data-video-id="${videoId}"]`);
    const dislikeBtn = document.querySelector(`.btn-dislike[data-video-id="${videoId}"]`);
    const likeCountEl = document.getElementById(`likeCount-${videoId}`);
    
    const storageKey = `video-${videoId}-interaction`;
    let interaction = JSON.parse(localStorage.getItem(storageKey) || '{"likes":0,"dislikes":0,"userAction":null}');
    
    if(interaction.userAction === 'like'){
      // Remove like
      interaction.likes--;
      interaction.userAction = null;
      likeBtn.classList.remove('active');
    } else {
      // Add like
      if(interaction.userAction === 'dislike'){
        interaction.dislikes--;
        dislikeBtn.classList.remove('active');
      }
      interaction.likes++;
      interaction.userAction = 'like';
      likeBtn.classList.add('active');
    }
    
    localStorage.setItem(storageKey, JSON.stringify(interaction));
    likeCountEl.textContent = interaction.likes;
    document.getElementById(`dislikeCount-${videoId}`).textContent = interaction.dislikes;
  };
  
  window.handleDislike = function(videoId){
    const likeBtn = document.querySelector(`.btn-like[data-video-id="${videoId}"]`);
    const dislikeBtn = document.querySelector(`.btn-dislike[data-video-id="${videoId}"]`);
    const dislikeCountEl = document.getElementById(`dislikeCount-${videoId}`);
    
    const storageKey = `video-${videoId}-interaction`;
    let interaction = JSON.parse(localStorage.getItem(storageKey) || '{"likes":0,"dislikes":0,"userAction":null}');
    
    if(interaction.userAction === 'dislike'){
      // Remove dislike
      interaction.dislikes--;
      interaction.userAction = null;
      dislikeBtn.classList.remove('active');
    } else {
      // Add dislike
      if(interaction.userAction === 'like'){
        interaction.likes--;
        likeBtn.classList.remove('active');
      }
      interaction.dislikes++;
      interaction.userAction = 'dislike';
      dislikeBtn.classList.add('active');
    }
    
    localStorage.setItem(storageKey, JSON.stringify(interaction));
    dislikeCountEl.textContent = interaction.dislikes;
    document.getElementById(`likeCount-${videoId}`).textContent = interaction.likes;
  };
  
  function initializeVideoInteractions(videoId){
    const storageKey = `video-${videoId}-interaction`;
    const interaction = JSON.parse(localStorage.getItem(storageKey) || '{"likes":0,"dislikes":0,"userAction":null}');
    
    document.getElementById(`likeCount-${videoId}`).textContent = interaction.likes;
    document.getElementById(`dislikeCount-${videoId}`).textContent = interaction.dislikes;
    
    if(interaction.userAction === 'like'){
      document.querySelector(`.btn-like[data-video-id="${videoId}"]`).classList.add('active');
    } else if(interaction.userAction === 'dislike'){
      document.querySelector(`.btn-dislike[data-video-id="${videoId}"]`).classList.add('active');
    }
    
    // Load comments
    loadComments(videoId);
  }
  
  // Comment Functions
  window.postComment = function(videoId){
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
      author: 'Usuário', // Could be replaced with actual user name
      date: new Date().toISOString(),
      likes: 0
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
    
    commentsList.innerHTML = comments.map(comment => `
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
            <button class="comment-like-btn" onclick="likeComment(${videoId}, ${comment.id})">
              <span>👍</span>
              <span class="comment-like-count">${comment.likes || 0}</span>
            </button>
            <button class="comment-reply-btn">
              <span>↩️</span>
              <span>Responder</span>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  window.likeComment = function(videoId, commentId){
    const storageKey = `video-${videoId}-comments`;
    const comments = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const comment = comments.find(c => c.id === commentId);
    if(comment){
      comment.likes = (comment.likes || 0) + 1;
      localStorage.setItem(storageKey, JSON.stringify(comments));
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

  if(backToApp){
    backToApp.addEventListener('click', () => {
      window.location.href = 'app.html';
    });
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
    const themeText = themeToggle?.querySelector('.theme-text');
    
    if(themeIcon){
      themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
    
    if(themeText){
      themeText.textContent = theme === 'dark' ? 'Modo Escuro' : 'Modo Claro';
    }
  }

  init();
})();
