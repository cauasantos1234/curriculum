// app-main.js - render instruments, modules and lessons
(function(){
  const instruments = [
    {id:'guitar',name:'Guitarra',symbol:'guitar',desc:'Elétrica e acústica',icon:'🎸',lessons:24,modules:3},
    {id:'drums',name:'Bateria',symbol:'drums',desc:'Ritmo e grooves',icon:'🥁',lessons:18,modules:3},
    {id:'keyboard',name:'Teclado',symbol:'keyboard',desc:'Piano e sintetizadores',icon:'🎹',lessons:21,modules:3},
    {id:'viola',name:'Violão',symbol:'viola',desc:'Acústico e dedilhado',icon:'🪕',lessons:27,modules:3},
    {id:'bass',name:'Baixo',symbol:'bass',desc:'Groove e harmonia',icon:'🎸',lessons:15,modules:3},
  ];

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
    },
    drums:{
      beginner:[
        {id:11,title:'Ritmos Básicos',duration:'10:20',author:'Paulo Drums',progress:80,difficulty:'Fácil'},
        {id:12,title:'Coordenação Inicial',duration:'14:55',author:'Carla Beats',progress:50,difficulty:'Fácil'}
      ],
      intermediate:[
        {id:13,title:'Fills e Transições',duration:'19:30',author:'André Percussion',progress:25,difficulty:'Médio'},
        {id:14,title:'Grooves de Rock',duration:'17:40',author:'Marina Rhythm',progress:40,difficulty:'Médio'}
      ],
      advanced:[
        {id:15,title:'Polirritmia',duration:'28:15',author:'Gustavo Pro',progress:0,difficulty:'Difícil'},
        {id:16,title:'Jazz Drumming',duration:'32:00',author:'Roberto Jazz',progress:10,difficulty:'Difícil'}
      ]
    },
    keyboard:{
      beginner:[
        {id:21,title:'Escalas Simples',duration:'11:45',author:'Sofia Piano',progress:70,difficulty:'Fácil'},
        {id:22,title:'Postura e Técnica',duration:'09:30',author:'Helena Keys',progress:90,difficulty:'Fácil'}
      ],
      intermediate:[
        {id:23,title:'Acompanhamentos Pop',duration:'20:15',author:'Fernando Music',progress:35,difficulty:'Médio'},
        {id:24,title:'Acordes Complexos',duration:'18:50',author:'Juliana Teclado',progress:20,difficulty:'Médio'}
      ],
      advanced:[
        {id:25,title:'Improvisação Jazz',duration:'26:40',author:'Ricardo Jazz',progress:5,difficulty:'Difícil'},
        {id:26,title:'Composição Avançada',duration:'35:20',author:'Beatriz Composer',progress:0,difficulty:'Difícil'}
      ]
    },
    viola:{
      beginner:[
        {id:31,title:'Dedilhado Básico',duration:'13:25',author:'Gabriel Violão',progress:65,difficulty:'Fácil'},
        {id:32,title:'Acordes Abertos',duration:'10:50',author:'Larissa Acoustic',progress:85,difficulty:'Fácil'}
      ],
      intermediate:[
        {id:33,title:'Ritmos Brasileiros',duration:'21:05',author:'Thiago MPB',progress:40,difficulty:'Médio'},
        {id:34,title:'Bossa Nova Básica',duration:'19:20',author:'Amanda Bossa',progress:25,difficulty:'Médio'}
      ],
      advanced:[
        {id:35,title:'Arranjos Complexos',duration:'29:35',author:'Daniel Arrange',progress:8,difficulty:'Difícil'},
        {id:36,title:'Fingerstyle Avançado',duration:'31:50',author:'Isabela Fingers',progress:0,difficulty:'Difícil'}
      ]
    },
    bass:{
      beginner:[
        {id:41,title:'Walking Bass Simples',duration:'12:10',author:'Rodrigo Bass',progress:55,difficulty:'Fácil'},
        {id:42,title:'Técnica de Mão Direita',duration:'11:30',author:'Patrícia Groove',progress:75,difficulty:'Fácil'}
      ],
      intermediate:[
        {id:43,title:'Slap Básico',duration:'17:55',author:'Marcelo Funk',progress:30,difficulty:'Médio'},
        {id:44,title:'Linhas de Funk',duration:'20:30',author:'Camila Funky',progress:15,difficulty:'Médio'}
      ],
      advanced:[
        {id:45,title:'Linhas Complexas Jazz',duration:'27:45',author:'Leonardo Jazz',progress:0,difficulty:'Difícil'},
        {id:46,title:'Técnicas Avançadas',duration:'33:10',author:'Vanessa Pro',progress:5,difficulty:'Difícil'}
      ]
    },
  };

  const modulesInfo = {
    beginner:{title:'Módulo Iniciante',desc:'Fundamentos e técnicas básicas',icon:'🌱',color:'#22c55e'},
    intermediate:{title:'Módulo Intermediário',desc:'Desenvolvimento de habilidades',icon:'🎯',color:'#eab308'},
    advanced:{title:'Módulo Avançado',desc:'Técnicas profissionais',icon:'🏆',color:'#ef4444'}
  };

  const instrumentsGrid = document.getElementById('instrumentsGrid');
  const modulesArea = document.getElementById('modulesArea');
  const lessonsArea = document.getElementById('lessonsArea');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalBody = document.getElementById('modalBody');
  const selectedInstrumentInfo = document.getElementById('selectedInstrumentInfo');
  const emptyState = document.getElementById('emptyState');
  const levelFilter = document.getElementById('levelFilter');
  const lessonSearch = document.getElementById('lessonSearch');

  let currentInstrument = null;
  let currentLevel = null;

  function renderInstruments(){
    if(!instrumentsGrid) return;
    instrumentsGrid.innerHTML = '';
    instrumentsGrid.className = 'instruments-grid-enhanced';
    
    instruments.forEach(inst=>{
      const el = document.createElement('div');
      el.className = 'instrument-card-enhanced';
      el.dataset.instrumentId = inst.id;
      el.innerHTML = `
        <div class="instrument-card-icon">${inst.icon}</div>
        <h3 class="instrument-card-name">${inst.name}</h3>
        <p class="instrument-card-desc">${inst.desc}</p>
        <div class="instrument-card-stats">
          <div class="instrument-stat">
            <span class="instrument-stat-value">${inst.lessons}</span>
            <span class="instrument-stat-label">Aulas</span>
          </div>
          <div class="instrument-stat">
            <span class="instrument-stat-value">${inst.modules}</span>
            <span class="instrument-stat-label">Módulos</span>
          </div>
        </div>
        <div class="instrument-card-modules">
          <span class="module-badge">Iniciante</span>
          <span class="module-badge">Intermediário</span>
          <span class="module-badge">Avançado</span>
        </div>
        <div class="instrument-card-modules-details" style="display:none">
          <div class="modules-list-compact">
            ${renderCompactModules(inst)}
          </div>
        </div>
      `;
      
      el.addEventListener('click', ()=>{
        selectInstrument(inst);
      });
      
      instrumentsGrid.appendChild(el);
    });
  }

  function renderCompactModules(inst){
    let html = '';
    Object.keys(modulesInfo).forEach(level=>{
      const moduleData = modulesInfo[level];
      const lessonsList = lessons[inst.id][level] || [];
      const levelLabel = level === 'beginner' ? 'Iniciante' : level === 'intermediate' ? 'Intermediário' : 'Avançado';
      
      html += `
        <div class="compact-module-item" data-instrument="${inst.id}" data-level="${level}">
          <div class="compact-module-icon">${moduleData.icon}</div>
          <div class="compact-module-info">
            <div class="compact-module-name">${levelLabel}</div>
            <div class="compact-module-count">${lessonsList.length} aulas</div>
          </div>
          <button class="compact-module-btn" data-instrument="${inst.id}" data-level="${level}">
            Ver Aulas →
          </button>
        </div>
      `;
    });
    return html;
  }

  function selectInstrument(inst){
    currentInstrument = inst;
    
    // Update selection visual - collapse others, expand clicked
    document.querySelectorAll('.instrument-card-enhanced').forEach(card=>{
      const isSelected = card.dataset.instrumentId === inst.id;
      card.classList.toggle('selected', isSelected);
      
      // Toggle modules details visibility
      const modulesDetails = card.querySelector('.instrument-card-modules-details');
      if(modulesDetails){
        modulesDetails.style.display = isSelected ? 'block' : 'none';
      }
    });
    
    // Hide info and modules area below
    if(selectedInstrumentInfo) selectedInstrumentInfo.style.display = 'none';
    if(modulesArea) modulesArea.innerHTML = '';
    if(lessonsArea) lessonsArea.innerHTML = '';
    if(emptyState) emptyState.style.display = 'none';
    
    // Attach event listeners to compact module buttons
    attachModuleButtonListeners();
  }
  
  function attachModuleButtonListeners(){
    document.querySelectorAll('.compact-module-btn').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        e.stopPropagation();
        const instrumentId = btn.dataset.instrument;
        const level = btn.dataset.level;
        const inst = instruments.find(i => i.id === instrumentId);
        
        if(inst){
          currentLevel = level;
          renderLessons(inst, level);
          
          // Scroll to lessons
          if(lessonsArea){
            lessonsArea.scrollIntoView({behavior:'smooth', block:'start'});
          }
        }
      });
    });
  }

  function renderModules(inst){
    if(!modulesArea) return;
    modulesArea.innerHTML = '<h3 class="section-title"><span class="title-icon">📚</span><span>Módulos Disponíveis</span></h3>';
    
    const grid = document.createElement('div');
    grid.className = 'modules-grid';
    
    Object.keys(modulesInfo).forEach(level=>{
      const moduleData = modulesInfo[level];
      const lessonsList = lessons[inst.id][level] || [];
      
      const card = document.createElement('div');
      card.className = 'module-card-enhanced';
      card.innerHTML = `
        <div class="module-card-header">
          <div class="module-level-badge ${level}">${level === 'beginner' ? 'Iniciante' : level === 'intermediate' ? 'Intermediário' : 'Avançado'}</div>
        </div>
        <div style="font-size:40px;margin-bottom:12px">${moduleData.icon}</div>
        <h4 class="module-card-title">${moduleData.title}</h4>
        <p class="module-card-desc">${moduleData.desc}</p>
        <div class="module-card-footer">
          <div class="module-lessons-count">${lessonsList.length} aulas</div>
          <button class="btn-view-lessons">Ver Aulas</button>
        </div>
      `;
      
      card.addEventListener('click', ()=>{
        currentLevel = level;
        renderLessons(inst, level);
        
        // Scroll to lessons
        if(lessonsArea){
          lessonsArea.scrollIntoView({behavior:'smooth', block:'start'});
        }
      });
      
      grid.appendChild(card);
    });
    
    modulesArea.appendChild(grid);
  }

  function renderLessons(inst, level){
    if(!lessonsArea) return;
    
    const moduleData = modulesInfo[level];
    const lessonsList = lessons[inst.id][level] || [];
    
    lessonsArea.innerHTML = `
      <h3 class="lessons-area-title">
        <span>${moduleData.icon}</span>
        <span>${inst.name} - ${moduleData.title}</span>
      </h3>
    `;
    
    if(lessonsList.length === 0){
      lessonsArea.innerHTML += '<div class="empty-state"><div class="empty-state-icon">📭</div><h3>Nenhuma aula disponível</h3><p>Este módulo ainda não possui aulas cadastradas.</p></div>';
      return;
    }
    
    const grid = document.createElement('div');
    grid.className = 'lessons-grid-enhanced';
    
    lessonsList.forEach(lesson=>{
      const card = document.createElement('div');
      card.className = 'lesson-card-enhanced';
      card.innerHTML = `
        <div class="lesson-card-thumbnail">
          <div class="lesson-play-btn">▶</div>
        </div>
        <div class="lesson-card-body">
          <div class="lesson-card-meta">
            <div class="lesson-meta-item">⏱️ ${lesson.duration}</div>
            <div class="lesson-meta-item">📊 ${lesson.difficulty}</div>
          </div>
          <h4 class="lesson-card-title">${lesson.title}</h4>
          <div class="lesson-card-author">
            <div class="lesson-author-avatar">${lesson.author.charAt(0)}</div>
            <div class="lesson-author-name">Por ${lesson.author}</div>
          </div>
          <div class="lesson-card-progress">
            <div class="lesson-progress-label">
              <span>Progresso</span>
              <span>${lesson.progress}%</span>
            </div>
            <div class="lesson-progress-bar">
              <div class="lesson-progress-fill" style="width:${lesson.progress}%"></div>
            </div>
          </div>
        </div>
      `;
      
      card.addEventListener('click', ()=>{
        openLessonModal(lesson, inst);
      });
      
      grid.appendChild(card);
    });
    
    lessonsArea.appendChild(grid);
  }

  function openLessonModal(lesson, inst){
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
          <button class="btn" onclick="this.closest('.modal-backdrop').style.display='none'">Fechar</button>
          <button class="btn" style="background:linear-gradient(135deg,#22c55e,#16a34a)">Marcar como Concluída</button>
        </div>
      </div>
    `;
  }

  function clearInstrumentSelection(){
    currentInstrument = null;
    currentLevel = null;
    
    document.querySelectorAll('.instrument-card-enhanced').forEach(card=>{
      card.classList.remove('selected');
    });
    
    if(selectedInstrumentInfo) selectedInstrumentInfo.style.display = 'none';
    if(modulesArea) modulesArea.innerHTML = '';
    if(lessonsArea) lessonsArea.innerHTML = '';
    if(emptyState) emptyState.style.display = 'block';
  }

  function openModal(title,content){
    if(!modalBackdrop) return; 
    modalBackdrop.style.display='flex'; 
    modalBackdrop.setAttribute('aria-hidden','false');
    modalBody.innerHTML = `<h3 class='title'>${title}</h3><div style='margin-top:8px'>${content}</div><div style="margin-top:16px"><button class="btn" onclick="this.closest('.modal-backdrop').style.display='none'">Fechar</button></div>`;
  }
  
  function closeModal(){ 
    if(!modalBackdrop) return; 
    modalBackdrop.style.display='none'; 
    modalBackdrop.setAttribute('aria-hidden','true'); 
    modalBody.innerHTML=''; 
  }
  
  if(modalBackdrop) modalBackdrop.addEventListener('click', e=>{ 
    if(e.target===modalBackdrop) closeModal(); 
  });

  // Nav buttons
  document.querySelectorAll('[data-nav]').forEach(btn=>btn.addEventListener('click', ()=>{
    document.querySelectorAll('[data-nav]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.nav === 'home' ? 'homeSection' : 'lessonsSection';
    document.getElementById('homeSection').style.display = target === 'homeSection' ? '' : 'none';
    document.getElementById('lessonsSection').style.display = target === 'lessonsSection' ? '' : 'none';
    
    // Reset lessons section when navigating away
    if(target !== 'lessonsSection'){
      clearInstrumentSelection();
    }
  }));

  // Clear instrument button
  const clearInstrumentBtn = document.getElementById('clearInstrument');
  if(clearInstrumentBtn){
    clearInstrumentBtn.addEventListener('click', clearInstrumentSelection);
  }

  // Level filter
  if(levelFilter){
    levelFilter.addEventListener('change', (e)=>{
      const selectedLevel = e.target.value;
      if(!currentInstrument) return;
      
      if(selectedLevel === 'all'){
        renderModules(currentInstrument);
        if(lessonsArea) lessonsArea.innerHTML = '';
      } else {
        renderLessons(currentInstrument, selectedLevel);
      }
    });
  }

  // Search functionality
  if(lessonSearch){
    lessonSearch.addEventListener('input', (e)=>{
      const searchTerm = e.target.value.toLowerCase().trim();
      
      if(!searchTerm){
        // Reset to show all
        if(currentInstrument && currentLevel){
          renderLessons(currentInstrument, currentLevel);
        } else if(currentInstrument){
          renderModules(currentInstrument);
        }
        return;
      }
      
      // Search across all lessons for current instrument
      if(!currentInstrument) return;
      
      const allLessons = [];
      Object.keys(lessons[currentInstrument.id]).forEach(level=>{
        lessons[currentInstrument.id][level].forEach(lesson=>{
          if(lesson.title.toLowerCase().includes(searchTerm) || 
             lesson.author.toLowerCase().includes(searchTerm)){
            allLessons.push({...lesson, level});
          }
        });
      });
      
      // Render search results
      if(lessonsArea){
        lessonsArea.innerHTML = `
          <h3 class="lessons-area-title">
            <span>🔍</span>
            <span>Resultados da Busca: "${searchTerm}"</span>
          </h3>
        `;
        
        if(allLessons.length === 0){
          lessonsArea.innerHTML += '<div class="empty-state"><div class="empty-state-icon">🔍</div><h3>Nenhum resultado encontrado</h3><p>Tente buscar com outros termos.</p></div>';
          return;
        }
        
        const grid = document.createElement('div');
        grid.className = 'lessons-grid-enhanced';
        
        allLessons.forEach(lesson=>{
          const card = document.createElement('div');
          card.className = 'lesson-card-enhanced';
          card.innerHTML = `
            <div class="lesson-card-thumbnail">
              <div class="lesson-play-btn">▶</div>
            </div>
            <div class="lesson-card-body">
              <div class="lesson-card-meta">
                <div class="lesson-meta-item">⏱️ ${lesson.duration}</div>
                <div class="lesson-meta-item">📊 ${lesson.difficulty}</div>
                <div class="lesson-meta-item module-level-badge ${lesson.level}" style="padding:4px 8px">${lesson.level === 'beginner' ? 'Iniciante' : lesson.level === 'intermediate' ? 'Intermediário' : 'Avançado'}</div>
              </div>
              <h4 class="lesson-card-title">${lesson.title}</h4>
              <div class="lesson-card-author">
                <div class="lesson-author-avatar">${lesson.author.charAt(0)}</div>
                <div class="lesson-author-name">Por ${lesson.author}</div>
              </div>
              <div class="lesson-card-progress">
                <div class="lesson-progress-label">
                  <span>Progresso</span>
                  <span>${lesson.progress}%</span>
                </div>
                <div class="lesson-progress-bar">
                  <div class="lesson-progress-fill" style="width:${lesson.progress}%"></div>
                </div>
              </div>
            </div>
          `;
          
          card.addEventListener('click', ()=>{
            openLessonModal(lesson, currentInstrument);
          });
          
          grid.appendChild(card);
        });
        
        lessonsArea.appendChild(grid);
      }
    });
  }

  // logout (no redirect for prototyping)
  const logoutBtn = document.getElementById('logoutBtn'); 
  if(logoutBtn) logoutBtn.addEventListener('click', ()=>{ 
    localStorage.removeItem('ns-session'); 
    alert('Sessão encerrada (modo protótipo).'); 
  });

  // init
  function init(){
    // auth disabled for prototyping/editor convenience
    renderInstruments();
    // inject equalizer into hero visual
    const heroVisual = document.querySelector('.hero .visual');
    if(heroVisual) heroVisual.innerHTML = renderEqualizerSVG();
    
    // Initialize enhanced home page features
    initCarousel();
    initStatsCounter();
    initNewsletterForm();
    initTourButton();
  }
  init();

  // ===== ENHANCED HOME PAGE FEATURES =====

  // Carousel functionality
  function initCarousel(){
    const slides = document.querySelectorAll('.carousel-slide-enhanced');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let currentSlide = 0;
    let carouselInterval;

    function showSlide(index){
      slides.forEach((slide,i)=>{
        slide.classList.toggle('active', i === index);
      });
      indicators.forEach((ind,i)=>{
        ind.classList.toggle('active', i === index);
      });
    }

    function nextSlide(){
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }

    function prevSlide(){
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    }

    function startAutoPlay(){
      carouselInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay(){
      clearInterval(carouselInterval);
    }

    if(prevBtn) prevBtn.addEventListener('click', ()=>{
      stopAutoPlay();
      prevSlide();
      startAutoPlay();
    });

    if(nextBtn) nextBtn.addEventListener('click', ()=>{
      stopAutoPlay();
      nextSlide();
      startAutoPlay();
    });

    indicators.forEach((ind,i)=>{
      ind.addEventListener('click', ()=>{
        stopAutoPlay();
        currentSlide = i;
        showSlide(currentSlide);
        startAutoPlay();
      });
    });

    // Start autoplay
    if(slides.length > 0) startAutoPlay();
  }

  // Animated stats counter
  function initStatsCounter(){
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateCounter(el){
      const target = parseInt(el.dataset.target) || 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      function updateCounter(){
        current += increment;
        if(current < target){
          el.textContent = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target + (el.dataset.target === '98' ? '%' : '');
        }
      }
      updateCounter();
    }

    function checkVisibility(){
      if(animated) return;
      
      const statsSection = document.querySelector('.stats-section');
      if(!statsSection) return;

      const rect = statsSection.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if(isVisible){
        animated = true;
        stats.forEach(stat => animateCounter(stat));
      }
    }

    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Check on load
  }

  // Newsletter form handler
  function initNewsletterForm(){
    const subscribeBtn = document.getElementById('subscribeBtn');
    const emailInput = document.getElementById('newsletterEmail');

    if(subscribeBtn){
      subscribeBtn.addEventListener('click', ()=>{
        const email = emailInput?.value?.trim();
        if(!email){
          alert('Por favor, insira seu email.');
          return;
        }
        if(!isValidEmail(email)){
          alert('Por favor, insira um email válido.');
          return;
        }
        
        // Simulate subscription
        subscribeBtn.innerHTML = '<span>✓ Inscrito!</span>';
        subscribeBtn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
        subscribeBtn.disabled = true;
        
        if(emailInput) emailInput.value = '';
        
        setTimeout(()=>{
          subscribeBtn.innerHTML = '<span>Assinar Grátis</span><span class="btn-icon">→</span>';
          subscribeBtn.style.background = '';
          subscribeBtn.disabled = false;
        }, 3000);
      });
    }
  }

  function isValidEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Tour button handler
  function initTourButton(){
    const tourBtn = document.getElementById('exploreTourBtn');
    if(tourBtn){
      tourBtn.addEventListener('click', ()=>{
        openModal('Tour Guiado', 'Bem-vindo ao NewSong! Esta é uma plataforma colaborativa para aprender música com instrutores da comunidade. Navegue pelas seções usando o menu lateral: Início, Aulas e muito mais.');
      });
    }
  }

  // --- helpers: render SVG icons and equalizer ---
  function renderSVG(name){
    // simple symbolic SVGs — placeholders with gold gradient
    return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="goldGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#d4af37" />
            <stop offset="1" stop-color="#ffd76b" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" rx="12" fill="rgba(0,0,0,0.02)" />
        <g class="gold-fill">
          `+iconPath(name)+`
        </g>
      </svg>
    `;
  }

  function iconPath(name){
    // very simple stylized paths to represent instruments
    switch(name){
      case 'guitar': return `<path d="M30 70c6-6 10-10 16-10s10 4 16 10 18-10 22-22-10-28-22-22-20 18-32 10-10 30 0 34z" fill="url(#goldGrad)"/>`;
      case 'drums': return `<circle cx="50" cy="48" r="18" fill="url(#goldGrad)"/>`;
      case 'keyboard': return `<rect x="20" y="40" width="60" height="20" rx="3" fill="url(#goldGrad)"/>`;
      case 'viola': return `<path d="M30 70c8-4 12-8 18-8s10 4 18 8 10-16 6-24-18-8-24 0-18 8-18 24z" fill="url(#goldGrad)"/>`;
      case 'bass': return `<path d="M28 68c6-6 12-8 18-8s10 6 18 8 14-14 12-24-20-4-26 0-18 8-20 24z" fill="url(#goldGrad)"/>`;
      default: return `<circle cx="50" cy="50" r="20" fill="url(#goldGrad)"/>`;
    }
  }

  function renderEqualizerSVG(){
    return `
      <svg class="equalizer" viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="20" width="18" height="60" class="bar eq-anim-1"/> 
        <rect x="36" y="30" width="12" height="50" class="bar2 eq-anim-2"/> 
        <rect x="56" y="16" width="16" height="64" class="bar eq-anim-3"/> 
        <rect x="80" y="28" width="12" height="52" class="bar2 eq-anim-4"/> 
        <rect x="102" y="36" width="12" height="44" class="bar eq-anim-5"/> 
      </svg>
    `;
  }

  // ===== THEME TOGGLE FUNCTIONALITY =====
  function initThemeToggle(){
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const THEME_STORAGE_KEY = 'newsong-theme';

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);

    if(themeToggle){
      themeToggle.addEventListener('click', ()=>{
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Add transition class
        body.classList.add('theme-transition');
        
        // Apply theme
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        updateThemeButton(newTheme);
        
        // Remove transition class after animation
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

  // Initialize theme toggle
  initThemeToggle();

})();
