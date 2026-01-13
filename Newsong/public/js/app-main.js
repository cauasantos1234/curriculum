
// app-main.js - render instruments, modules and lessons
(function(){
  // Usa dados compartilhados do shared-data.js
  const instruments = [
    {...SHARED_INSTRUMENTS.guitar, lessons:24, modules:3, desc:'Elétrica e acústica'},
    {...SHARED_INSTRUMENTS.drums, lessons:18, modules:3},
    {...SHARED_INSTRUMENTS.keyboard, lessons:21, modules:3, desc:'Clássico e contemporâneo'},
    {...SHARED_INSTRUMENTS.viola, lessons:27, modules:3, desc:'Acústico e dedilhado'},
    {...SHARED_INSTRUMENTS.bass, lessons:15, modules:3, desc:'Groove e harmonia'}
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
        {id:9,title:'Improvisation Avançada',duration:'30:12',author:'Bruno Cardoso',progress:5,difficulty:'Difícil'}
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
    }
  };

  // Usa dados compartilhados
  const modulesInfo = SHARED_MODULES_INFO;

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
    
    // Define background images for each instrument
    const instrumentImages = {
      guitar: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800&h=600&fit=crop&q=85',
      drums: 'https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=800&h=600&fit=crop&q=85',
      keyboard: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=600&fit=crop&q=85',
      viola: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800&h=600&fit=crop&q=90',
      bass: 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800&h=600&fit=crop&q=90'
    };
    
    instruments.forEach(inst=>{
      const el = document.createElement('div');
      el.className = 'instrument-card-enhanced';
      el.dataset.instrumentId = inst.id;
      
      // Get background image for current instrument
      const bgImage = instrumentImages[inst.id];
      
      el.innerHTML = `
        <div class="instrument-card-background">
          <img src="${bgImage}" 
               alt="Pessoa tocando ${inst.name.toLowerCase()}"
               onerror="this.src='https://via.placeholder.com/400x300/1a1a2e/ffd76b?text=${encodeURIComponent(inst.name)}'">
        </div>
        <div class="instrument-card-overlay">
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
      const levelLabel = level === 'beginner' ? 'Bronze' : level === 'intermediate' ? 'Prata' : 'Ouro';
      
      html += `
        <div class="compact-module-item" data-instrument="${inst.id}" data-level="${level}">
          <div class="compact-module-icon">${moduleData.icon}</div>
          <div class="compact-module-info">
            <div class="compact-module-name">${levelLabel}</div>
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
    
    // Update selection visual with new advanced effects
    document.querySelectorAll('.instrument-card-enhanced').forEach(card=>{
      const isSelected = card.dataset.instrumentId === inst.id;
      
      if(isSelected){
        card.classList.add('selected', 'expanded', 'glow-effect');
        card.style.transform = 'scale(1.05) translateY(-10px)';
        card.style.zIndex = '100';
        
        // Animate modules appearance with stagger effect
        const modulesDetails = card.querySelector('.instrument-card-modules-details');
        if(modulesDetails){
          modulesDetails.style.display = 'block';
          modulesDetails.style.opacity = '0';
          modulesDetails.style.transform = 'translateY(20px)';
          
          setTimeout(()=>{
            modulesDetails.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            modulesDetails.style.opacity = '1';
            modulesDetails.style.transform = 'translateY(0)';
          }, 100);
          
          // Stagger animation for each module item
          const moduleItems = modulesDetails.querySelectorAll('.compact-module-item');
          moduleItems.forEach((item, index)=>{
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px) scale(0.9)';
            setTimeout(()=>{
              item.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
              item.style.opacity = '1';
              item.style.transform = 'translateX(0) scale(1)';
            }, 200 + (index * 100));
          });
        }
      } else {
        card.classList.remove('selected', 'expanded', 'glow-effect');
        card.style.transform = 'scale(0.95)';
        card.style.opacity = '1';
        card.style.filter = 'none';
        card.style.zIndex = '1';
        
        // Hide modules with fade out
        const modulesDetails = card.querySelector('.instrument-card-modules-details');
        if(modulesDetails){
          modulesDetails.style.transition = 'all 0.3s ease-out';
          modulesDetails.style.opacity = '0';
          modulesDetails.style.transform = 'translateY(-10px)';
          setTimeout(()=>{
            modulesDetails.style.display = 'none';
          }, 300);
        }
      }
    });
    
    // Hide info and modules area below
    if(selectedInstrumentInfo) selectedInstrumentInfo.style.display = 'none';
    if(modulesArea) modulesArea.innerHTML = '';
    if(lessonsArea) lessonsArea.innerHTML = '';
    if(emptyState) emptyState.style.display = 'none';
    
    // Smooth scroll to selected card
    const selectedCard = document.querySelector(`.instrument-card-enhanced[data-instrument-id="${inst.id}"]`);
    if(selectedCard){
      setTimeout(()=>{
        selectedCard.scrollIntoView({behavior:'smooth', block:'center'});
      }, 300);
    }
    
    // Attach event listeners to compact module buttons
    attachModuleButtonListeners();
  }
  
  function attachModuleButtonListeners(){
    // Handle buttons in the compact modules (old style)
    document.querySelectorAll('.compact-module-btn').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        e.stopPropagation();
        const instrumentId = btn.dataset.instrument;
        const level = btn.dataset.level;
        const inst = instruments.find(i => i.id === instrumentId);
        
        if(inst){
          currentLevel = level;
          window.location.href = `lessons.html?instrument=${instrumentId}&level=${level}`;
        }
      });
    });
    
    // Handle module level cards in modal
    document.querySelectorAll('.module-level-card').forEach(card=>{
      card.addEventListener('click', ()=>{
        const instrumentId = card.dataset.instrument;
        const level = card.dataset.level;
        
        if(instrumentId && level){
          // Close modal and redirect
          closeInstrumentModuleModal();
          window.location.href = `lessons.html?instrument=${instrumentId}&level=${level}`;
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
          <div class="module-level-badge ${level}">${level === 'beginner' ? 'Bronze' : level === 'intermediate' ? 'Prata' : 'Ouro'}</div>
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
      <div class="lessons-list-container">
        <div class="lessons-list-header">
          <button class="btn-back-modules" id="btnBackToModules">
            <span>←</span>
          </button>
          <div class="lessons-list-header-content">
            <h3 class="lessons-list-title">
              <span>${moduleData.icon}</span>
              <span>${inst.name} - ${moduleData.title}</span>
            </h3>
            <p class="lessons-list-count">${lessonsList.length} aulas</p>
          </div>
        </div>
      </div>
    `;
    
    // Add event listener to back button
    const btnBack = document.getElementById('btnBackToModules');
    if(btnBack){
      btnBack.addEventListener('click', () => {
        if(lessonsArea) lessonsArea.innerHTML = '';
        if(currentInstrument){
          selectInstrument(currentInstrument);
          // Scroll back to instrument
          const instrumentCard = document.querySelector(`.instrument-card-enhanced[data-instrument-id="${currentInstrument.id}"]`);
          if(instrumentCard){
            instrumentCard.scrollIntoView({behavior:'smooth', block:'center'});
          }
        }
      });
    }
    
    if(lessonsList.length === 0){
      const container = lessonsArea.querySelector('.lessons-list-container');
      container.innerHTML += '<div class="empty-state"><div class="empty-state-icon">📭</div><h3>Nenhuma aula disponível</h3><p>Este módulo ainda não possui aulas cadastradas.</p></div>';
      return;
    }
    
    const listContainer = lessonsArea.querySelector('.lessons-list-container');
    const list = document.createElement('div');
    list.className = 'lessons-list';
    
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
        // Redireciona para a página de vídeos filtrada por esta aula específica
        window.location.href = `videos.html?instrument=${inst.id}&level=${level}&lesson=${lesson.id}`;
      });
      
      list.appendChild(item);
    });
    
    listContainer.appendChild(list);
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
    
    // Reset all cards with smooth animation
    document.querySelectorAll('.instrument-card-enhanced').forEach(card=>{
      card.classList.remove('selected', 'expanded', 'glow-effect');
      card.style.transition = 'all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)';
      card.style.transform = 'scale(1)';
      card.style.opacity = '1';
      card.style.filter = 'none';
      card.style.zIndex = 'auto';
      
      // Hide modules
      const modulesDetails = card.querySelector('.instrument-card-modules-details');
      if(modulesDetails){
        modulesDetails.style.transition = 'all 0.3s ease-out';
        modulesDetails.style.opacity = '0';
        setTimeout(()=>{
          modulesDetails.style.display = 'none';
        }, 300);
      }
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

  // Função para verificar acesso de professor
  function checkTeacherAccess() {
    const session = JSON.parse(localStorage.getItem('ns-session') || '{}');
    return session.role === 'teacher';
  }

  // Função para mostrar modal de acesso restrito
  function showAccessDeniedModal() {
    const modal = document.createElement('div');
    modal.className = 'completion-confirmation-modal';
    modal.innerHTML = `
      <div class="completion-confirmation-overlay"></div>
      <div class="completion-confirmation-content" style="max-width: 500px;">
        <div class="completion-confirmation-header">
          <h2>🔒 Acesso Restrito</h2>
        </div>
        
        <div class="lesson-complete-video" style="font-size: 15px; color: #d4af37; margin-bottom: 20px;">
          Esta área é exclusiva para professores
        </div>
        
        <div class="completion-question">
          <p style="margin-bottom: 16px;">Apenas usuários com perfil de <strong>professor</strong> podem enviar vídeos e criar conteúdo na plataforma.</p>
          <p style="font-size: 14px; color: var(--muted); margin: 0;">Se você é professor e deseja compartilhar suas aulas, entre em contato com a administração ou crie uma nova conta selecionando "Professor" no registro.</p>
        </div>
        
        <div class="completion-confirmation-footer">
          <button class="btn-confirm-completion" id="btnCloseAccess">Entendi</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    const closeModal = () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 200);
    };
    
    modal.querySelector('.completion-confirmation-overlay').addEventListener('click', closeModal);
    document.getElementById('btnCloseAccess').addEventListener('click', closeModal);
    
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    });
  }

  // Nav buttons
  document.querySelectorAll('[data-nav]').forEach(btn=>btn.addEventListener('click', ()=>{
    const navValue = btn.dataset.nav;
    
    // Handle navigation
    if(navValue === 'upload'){
      // Verificar se é professor
      if (!checkTeacherAccess()) {
        showAccessDeniedModal();
        return;
      }
      // Redirect to upload page
      window.location.href = 'upload.html';
      return;
    }
    
    if(navValue === 'stats'){
      // Verificar se é professor
      if (!checkTeacherAccess()) {
        showAccessDeniedModal();
        return;
      }
      // Redirect to stats page
      window.location.href = 'stats.html';
      return;
    }
    
    if(navValue === 'saved'){
      // Redirect to saved videos page
      window.location.href = 'saved.html';
      return;
    }
    
    document.querySelectorAll('[data-nav]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    
    // Hide all sections
    document.getElementById('homeSection').style.display = 'none';
    document.getElementById('lessonsSection').style.display = 'none';
    
    // Show the selected section
    if(navValue === 'home'){
      document.getElementById('homeSection').style.display = '';
    } else if(navValue === 'lessons'){
      document.getElementById('lessonsSection').style.display = '';
    }
    
    // Reset lessons section when navigating away
    if(navValue !== 'lessons'){
      clearInstrumentSelection();
    }
  }));

  // Profile button (no longer in header, now in sidebar menu)
  const profileMenuBtn = document.getElementById('profileMenuBtn');
  if(profileMenuBtn){
    profileMenuBtn.addEventListener('click', () => {
      // Redirect to profile page
      window.location.href = 'profile.html';
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn){
    logoutBtn.addEventListener('click', () => {
      const confirmLogout = confirm('Deseja realmente sair?');
      if (confirmLogout) {
        // Limpar cache de progresso antes de sair
        if(window.UserProgress && window.UserProgress.clearProgressCache){
          window.UserProgress.clearProgressCache();
        }
        
        // Clear any stored data
        localStorage.removeItem('newsong-user');
        localStorage.removeItem('newsong-auth');
        localStorage.removeItem('ns-session');
        
        // Redirect to login page
        window.location.href = 'login.html';
      }
    });
  }

  // Search functionality (removed - not used in current page structure)

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
    
    // Check if navigated to lessons section
    if(window.location.hash === '#lessons'){
      // Show lessons section and hide home section
      const homeSection = document.getElementById('homeSection');
      const lessonsSection = document.getElementById('lessonsSection');
      if(homeSection) homeSection.style.display = 'none';
      if(lessonsSection) lessonsSection.style.display = '';
      
      // Highlight the lessons nav button
      document.querySelectorAll('[data-nav]').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('[data-nav="lessons"]').forEach(b=>b.classList.add('active'));
      
      setTimeout(() => {
        if(lessonsSection){
          lessonsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
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

  // Continue Learning button handler
  const continueLearningBtn = document.getElementById('continueLearningBtn');
  if(continueLearningBtn){
    continueLearningBtn.addEventListener('click', ()=>{
      openModal('Seguir Carreira', 'Escolha sua carreira musical e siga um caminho estruturado de aprendizado com módulos progressivos e certificação profissional.');
    });
  }

  // Certified button handler
  const certifiedBtn = document.getElementById('certifiedBtn');
  if(certifiedBtn){
    certifiedBtn.addEventListener('click', ()=>{
      openModal('Certificados', 'Obtenha certificados reconhecidos ao concluir cada módulo de aprendizado. Compartilhe suas conquistas e valide suas habilidades musicais.');
    });
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
    
    if(themeIcon){
      themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }

  // Initialize theme toggle
  initThemeToggle();

  // ===== INSTRUMENT MODULE MODAL =====
  window.openInstrumentModuleModal = function(instrument){
    console.log('Opening side panel for:', instrument.name);
    
    const sidePanel = document.getElementById('instrumentSidePanel');
    const sidePanelOverlay = document.getElementById('sidePanelOverlay');
    const sidePanelIcon = document.getElementById('sidePanelIcon');
    const sidePanelTitle = document.getElementById('sidePanelTitle');
    const sidePanelModules = document.getElementById('sidePanelModules');
    
    console.log('Side panel element:', sidePanel);
    
    if(!sidePanel || !sidePanelIcon || !sidePanelTitle || !sidePanelModules){
      console.error('Side panel elements not found!');
      return;
    }
    
    // Set instrument info
    sidePanelIcon.textContent = instrument.icon;
    sidePanelTitle.textContent = instrument.name;
    
    // Add progress indicator
    const progressIndicator = `
      <div class="side-panel-progress-indicator">
        <div class="progress-dot bronze"></div>
        <div class="progress-line"></div>
        <div class="progress-dot prata"></div>
        <div class="progress-line"></div>
        <div class="progress-dot ouro"></div>
      </div>
    `;
    sidePanelModules.innerHTML = progressIndicator;
    
    // Render modules
    sidePanelModules.insertAdjacentHTML('beforeend', renderModulesForModal(instrument));
    
    console.log('Adding active class to side panel');
    
    // Show overlay and side panel with animation
    if(sidePanelOverlay){
      sidePanelOverlay.classList.add('active');
    }
    
    requestAnimationFrame(() => {
      sidePanel.classList.add('active');
    });
    
    // Add info tooltip at the bottom
    const infoTooltip = `
      <div class="side-panel-info">
        <div class="info-tooltip-icon">💡</div>
        <div>
          <p class="info-tooltip-text">
            <strong>Dica:</strong> Escolha o nível que melhor corresponde à sua experiência atual. 
            Cada módulo contém várias aulas progressivas que vão te ajudar a dominar o instrumento.
          </p>
        </div>
      </div>
    `;
    sidePanelModules.insertAdjacentHTML('beforeend', infoTooltip);
    
    // Attach button listeners
    setTimeout(() => {
      attachModuleButtonListeners();
    }, 100);
  }
  
  window.renderModulesForModal = function(instrument){
    let html = '';
    
    // Bronze Level
    const beginnerLessons = lessons[instrument.id]?.beginner || [];
    const beginnerDuration = beginnerLessons.length > 0 ? '~2 meses' : 'Em breve';
    html += `
      <div class="module-level-card bronze" data-instrument="${instrument.id}" data-level="beginner">
        <div class="module-level-header">
          <div class="module-level-badge">🥉</div>
          <div class="module-level-info">
            <div class="module-level-name-section">
              <span class="module-level-type">MÓDULO BRONZE</span>
            </div>
            <h3 class="module-level-name">Iniciante</h3>
            <p class="module-level-description">Fundamentos e técnicas básicas para começar sua jornada musical</p>
          </div>
        </div>
        <div class="module-level-stats">
          <div class="module-stat-item">
            <span class="module-stat-icon">📚</span>
            <span>${beginnerLessons.length} aulas</span>
          </div>
          <div class="module-stat-item">
            <span class="module-stat-icon">⏱️</span>
            <span>${beginnerDuration}</span>
          </div>
        </div>
        <button class="module-level-button">
          <span>Começar Jornada</span>
          <span class="button-arrow">→</span>
        </button>
      </div>
    `;
    
    // Silver Level
    const intermediateLessons = lessons[instrument.id]?.intermediate || [];
    const intermediateDuration = intermediateLessons.length > 0 ? '~3 meses' : 'Em breve';
    html += `
      <div class="module-level-card prata" data-instrument="${instrument.id}" data-level="intermediate">
        <div class="module-level-header">
          <div class="module-level-badge">🥈</div>
          <div class="module-level-info">
            <div class="module-level-name-section">
              <span class="module-level-type">MÓDULO PRATA</span>
            </div>
            <h3 class="module-level-name">Intermediário</h3>
            <p class="module-level-description">Desenvolvimento de habilidades e técnicas mais complexas</p>
          </div>
        </div>
        <div class="module-level-stats">
          <div class="module-stat-item">
            <span class="module-stat-icon">📚</span>
            <span>${intermediateLessons.length} aulas</span>
          </div>
          <div class="module-stat-item">
            <span class="module-stat-icon">⏱️</span>
            <span>${intermediateDuration}</span>
          </div>
        </div>
        <button class="module-level-button">
          <span>Evoluir Habilidades</span>
          <span class="button-arrow">→</span>
        </button>
      </div>
    `;
    
    // Gold Level
    const advancedLessons = lessons[instrument.id]?.advanced || [];
    const advancedDuration = advancedLessons.length > 0 ? '~4 meses' : 'Em breve';
    html += `
      <div class="module-level-card ouro" data-instrument="${instrument.id}" data-level="advanced">
        <div class="module-level-header">
          <div class="module-level-badge">🥇</div>
          <div class="module-level-info">
            <div class="module-level-name-section">
              <span class="module-level-type">MÓDULO OURO</span>
            </div>
            <h3 class="module-level-name">Avançado</h3>
            <p class="module-level-description">Técnicas profissionais e domínio completo do instrumento</p>
          </div>
        </div>
        <div class="module-level-stats">
          <div class="module-stat-item">
            <span class="module-stat-icon">📚</span>
            <span>${advancedLessons.length} aulas</span>
          </div>
          <div class="module-stat-item">
            <span class="module-stat-icon">⏱️</span>
            <span>${advancedDuration}</span>
          </div>
        </div>
        <button class="module-level-button">
          <span>Dominar Técnicas</span>
          <span class="button-arrow">→</span>
        </button>
      </div>
    `;
    
    return html;
  }
  
  window.closeInstrumentModuleModal = function(){
    const sidePanel = document.getElementById('instrumentSidePanel');
    const sidePanelOverlay = document.getElementById('sidePanelOverlay');
    
    if(!sidePanel) return;
    
    sidePanel.classList.remove('active');
    
    if(sidePanelOverlay){
      sidePanelOverlay.classList.remove('active');
    }
  }
  
  // Close side panel on close button click
  const closeSidePanelBtn = document.getElementById('closeSidePanel');
  if(closeSidePanelBtn){
    closeSidePanelBtn.addEventListener('click', window.closeInstrumentModuleModal);
  }
  
  // Close side panel on overlay click
  const sidePanelOverlay2 = document.getElementById('sidePanelOverlay');
  if(sidePanelOverlay2){
    sidePanelOverlay2.addEventListener('click', window.closeInstrumentModuleModal);
  }
  
  // Close side panel on ESC key
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      const sidePanel = document.getElementById('instrumentSidePanel');
      if(sidePanel && sidePanel.classList.contains('active')){
        window.closeInstrumentModuleModal();
      }
    }
  });

  // Menu Toggle (Hamburguer)
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const closeSidebar = document.getElementById('closeSidebar');

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

  // Close sidebar after clicking menu item
  document.querySelectorAll('.sidebar .menu button').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(closeSidebarMenu, 300);
    });
  });

  // Hide teacher-only buttons for students
  function hideTeacherButtons() {
    const sessionData = localStorage.getItem('ns-session');
    if (!sessionData) return;
    
    const session = JSON.parse(sessionData);
    if (session && session.role !== 'teacher') {
      const uploadBtn = document.getElementById('uploadMenuBtn');
      const statsBtn = document.getElementById('statsMenuBtn');
      
      if (uploadBtn) {
        uploadBtn.style.display = 'none';
      }
      if (statsBtn) {
        statsBtn.style.display = 'none';
      }
    }
  }
  
  // Verificar autenticação e inicializar progresso
  function checkAuthAndInitProgress() {
    const sessionData = localStorage.getItem('ns-session');
    if (!sessionData) {
      console.warn('Usuário não autenticado, redirecionando para login...');
      window.location.href = 'login.html';
      return false;
    }
    
    const session = JSON.parse(sessionData);
    console.log('Usuário autenticado:', session.email, '- Tipo:', session.role);
    
    // Garantir que o usuário tenha progresso inicializado
    if (window.UserProgress && window.UserProgress.ensureUserProgress) {
      window.UserProgress.ensureUserProgress();
      console.log('Progresso verificado e inicializado para', session.email);
    }
    
    return true;
  }

  // Initialize on page load
  checkAuthAndInitProgress();
  hideTeacherButtons();

})();

