(function(){
  'use strict';

  // Small helper selectors
  const $ = sel => document.querySelector(sel);
  const $all = sel => Array.from(document.querySelectorAll(sel));

  // Elements
  const app = $('#app');
  const modalBackdrop = $('#modalBackdrop');
  const totalProgressEl = $('#totalProgress');
  const pathsGrid = $('#pathsGrid');
  const lessonsGrid = $('#lessonsGrid');
  const instrumentsGrid = $('#instrumentsGrid');
  const searchInput = $('#search');
  const pathDetail = $('#pathDetail');

  const STORE_THEME = 'pap-theme';
  const STORE_PROGRESS = 'pap-progress';

  // Sample data (static for prototype)
  const samplePaths = [
    {id:1,title:'Violão: Iniciante ao Intermediário',lessons:5,desc:'Acordes básicos, ritmos e primeiras músicas',progress:20},
    {id:2,title:'Guitarra elétrica: Bases do rock',lessons:8,desc:'Power chords, pentatônicas e solos simples',progress:10},
    {id:3,title:'Piano para iniciantes',lessons:6,desc:'Posições, escalas e leitura simples',progress:40},
  ];

  const sampleInstruments = [
    {id:'guitar',name:'Guitarra',desc:'Elétrica e acústica',icon:'🎸'},
    {id:'viola',name:'Violão',desc:'Acústico, dedilhado',icon:'🪕'},
    {id:'piano',name:'Piano',desc:'Teclado e teoria',icon:'🎹'},
    {id:'drums',name:'Bateria',desc:'Ritmo e grooves',icon:'🥁'},
  ];

  const STORE_INSTRUMENT = 'pap-instrument';

  const sampleLessons = [
    {id:101,title:'Acordes maiores e menores',instrument:'viola',duration:'8:12',author:'Mariana',progress:30},
    {id:102,title:'Ritmo básico (strumming)',instrument:'viola',duration:'6:03',author:'Lucas',progress:0},
    {id:103,title:'Introdução à pentatônica',instrument:'guitar',duration:'10:24',author:'Rafael',progress:55},
    {id:104,title:'Primeiras escalas no piano',instrument:'piano',duration:'9:11',author:'Ana',progress:70},
    {id:105,title:'Parada e fills na bateria',instrument:'drums',duration:'7:20',author:'Pedro',progress:0},
    {id:106,title:'Acompanhamento para cantores',instrument:'viola',duration:'5:42',author:'Sofia',progress:15},
  ];

  // Persistence helpers
  function loadProgressMap(){
    try{ return JSON.parse(localStorage.getItem(STORE_PROGRESS) || '{}'); }
    catch(e){ return {}; }
  }
  function saveProgressMap(map){ localStorage.setItem(STORE_PROGRESS, JSON.stringify(map)); }

  function applyStoredProgress(){
    const map = loadProgressMap();
    sampleLessons.forEach(l=>{ if(map[l.id] !== undefined) l.progress = map[l.id]; });
  }

  // Renderers
  function renderPaths(){
    if(!pathsGrid) return;
    pathsGrid.innerHTML = '';
    samplePaths.forEach(p=>{
      const card = document.createElement('div'); card.className = 'card reveal';
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-weight:700">${escapeHtml(p.title)}</div>
            <div class="muted">${escapeHtml(p.desc)}</div>
          </div>
          <div class="pill">${p.lessons} aulas</div>
        </div>
        <div class="spacer"></div>
        <div class="progress"><i style="width:${p.progress}%"></i></div>
      `;
      pathsGrid.appendChild(card);
    });
  }

  function renderLessons(filter){
    if(!lessonsGrid) return;
    const q = (filter||'').toLowerCase();
    const list = sampleLessons.filter(l=>{
      if(!q) return true;
      return (l.title||'').toLowerCase().includes(q) || (l.author||'').toLowerCase().includes(q) || (l.instrument||'').toLowerCase().includes(q);
    });
    lessonsGrid.innerHTML = '';
    list.forEach(l=>{
      const card = document.createElement('div'); card.className = 'card lesson-card reveal';
      card.innerHTML = `
        <div class="thumb">
          <div class="play" aria-hidden="true">▶</div>
        </div>
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-weight:700">${escapeHtml(l.title)}</div>
              <div class="muted">${escapeHtml(l.author)} • ${escapeHtml(l.duration)}</div>
            </div>
            <div>
              <button class="ghost" data-open="${l.id}" aria-label="Ver ${escapeHtml(l.title)}">Ver</button>
            </div>
          </div>
          <div class="spacer"></div>
          <div class="progress"><i style="width:${l.progress}%"></i></div>
        </div>
      `;
      lessonsGrid.appendChild(card);
    });
  }

  function renderInstruments(){
    if(!instrumentsGrid) return;
    instrumentsGrid.innerHTML = '';
    const selected = loadSelectedInstrument();
    sampleInstruments.forEach(i=>{
      const card = document.createElement('div');
      card.className='card center reveal instrument-card';
      card.style.flexDirection='column';
      card.tabIndex = 0; // make focusable
      card.setAttribute('role','button');
      card.setAttribute('aria-pressed', String(selected === i.id));
      card.dataset.instrumentId = i.id;
      if(selected === i.id) card.classList.add('selected');
      card.innerHTML = `
        <div class="icon xlarge">${escapeHtml(i.icon)}</div>
        <div style="font-weight:700;margin-top:8px">${escapeHtml(i.name)}</div>
        <div class="muted">${escapeHtml(i.desc)}</div>
        <button class="start-btn" data-start="${escapeHtml(i.id)}">Começar aula</button>
      `;
      instrumentsGrid.appendChild(card);
    });
    // attach listeners
    instrumentsGrid.querySelectorAll('.instrument-card').forEach(el=>{
      el.addEventListener('click', e=>{
        // if click on start button, ignore selection click and let button handler run
        if(e.target && e.target.dataset && e.target.dataset.start) return;
        selectInstrument(el.dataset.instrumentId);
      });
      el.addEventListener('keydown', e=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); selectInstrument(el.dataset.instrumentId); } });
      el.addEventListener('mouseover', ()=>el.classList.add('hover'));
      el.addEventListener('mouseout', ()=>el.classList.remove('hover'));
    });

    // start buttons
    instrumentsGrid.querySelectorAll('.start-btn').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const instId = btn.dataset.start;
        // find first lesson for this instrument
        const lesson = sampleLessons.find(s=>s.instrument === instId) || null;
        if(lesson){
          openModal(lesson.title, `${lesson.author} • ${lesson.duration}`, lesson.id);
        } else {
          openModal('Sem aulas disponíveis', `Ainda não há aulas cadastradas para ${instId}.`, null);
        }
        e.stopPropagation();
      });
    });
  }

  function loadSelectedInstrument(){
    try{ return localStorage.getItem(STORE_INSTRUMENT) || null; }catch(e){ return null; }
  }
  function saveSelectedInstrument(id){ try{ localStorage.setItem(STORE_INSTRUMENT, id); }catch(e){} }
  function selectInstrument(id){
    // update UI
    instrumentsGrid.querySelectorAll('.instrument-card').forEach(c=>{
      c.classList.toggle('selected', c.dataset.instrumentId === String(id));
      c.setAttribute('aria-pressed', String(c.dataset.instrumentId === String(id)));
    });
    saveSelectedInstrument(id);
  }

  // Simple escape to avoid injecting unexpected HTML in this prototype
  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; });
  }

  // Navigation
  $all('[data-nav]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const name = a.dataset.nav;
      showSection(name);
    });
  });

  function showSection(name){
    const sections = ['home','instruments','paths','upload','settings'];
    sections.forEach(s=>{
      const el = document.getElementById(s);
      if(!el) return;
      el.style.display = (s===name) ? '' : 'none';
    });
    const target = document.getElementById(name);
    if(target){
      // ensure focusable but avoid scrolling the page when focusing
      const hadTab = target.hasAttribute('tabindex');
      if(!hadTab) target.setAttribute('tabindex','-1');
      try{
        // modern browsers support preventScroll
        target.focus({preventScroll:true});
      }catch(e){
        // fallback: temporarily save scroll, focus, restore scroll
        const x = window.scrollX, y = window.scrollY;
        target.focus();
        window.scrollTo(x,y);
      }
      if(!hadTab) target.removeAttribute('tabindex');
    }
  }

  // Modal handling
  let currentModalLessonId = null;
  function openModal(title, sub, lessonId){
    const titleEl = $('#modalTitle');
    const subEl = $('#modalSub');
    if(titleEl) titleEl.textContent = title || '';
    if(subEl) subEl.textContent = sub || '';
    if(modalBackdrop){ modalBackdrop.style.display = 'flex'; modalBackdrop.setAttribute('aria-hidden','false'); }
    currentModalLessonId = lessonId || null;
    const closeBtn = $('#closeModal'); if(closeBtn) closeBtn.focus();
    document.addEventListener('keydown', onKeyDown);
  }
  function closeModal(){ if(modalBackdrop){ modalBackdrop.style.display='none'; modalBackdrop.setAttribute('aria-hidden','true'); } currentModalLessonId = null; document.removeEventListener('keydown', onKeyDown); }
  function onKeyDown(e){ if(e.key === 'Escape') closeModal(); }
  const closeBtn = $('#closeModal'); if(closeBtn) closeBtn.addEventListener('click', closeModal);
  if(modalBackdrop) modalBackdrop.addEventListener('click', e=>{ if(e.target===modalBackdrop) closeModal(); });

  // Click delegation
  document.addEventListener('click', e=>{
    const openId = e.target && e.target.dataset && e.target.dataset.open;
    if(openId){
      const lesson = sampleLessons.find(x=>String(x.id) === String(openId));
      if(lesson) openModal(lesson.title, `${lesson.author} • ${lesson.duration}`, lesson.id);
      return;
    }
    const inst = e.target && e.target.dataset && e.target.dataset.instrument;
    if(inst){
      const p = samplePaths.find(x=>x.title.toLowerCase().includes(inst)) || {title:'Caminho: '+inst,desc:'Sequência criada pela comunidade',lessons:6,progress:0};
      if(pathDetail) pathDetail.innerHTML = `\n        <div class="card">\n          <div style="display:flex;justify-content:space-between">\n            <div>\n              <div style=\"font-weight:700\">${escapeHtml(p.title)}</div>\n              <div class=\"muted\">${escapeHtml(p.desc)}</div>\n            </div>\n            <div class=\"pill\">${p.lessons} aulas</div>\n          </div>\n          <div class=\"spacer\"></div>\n          <div class=\"lesson-list\">\n            ${Array.from({length:p.lessons}).map((_,i)=>`<div class=\"lesson-row\"><div class=\"small\">Aula ${i+1}</div><div style=\"flex:1;font-weight:600\">Tópico ${i+1} — exemplo</div><div class=\"muted\">10:${i+2}</div></div>`).join('')}\n          </div>\n        </div>\n      `;
      showSection('paths');
      return;
    }
  });

  // Search
  if(searchInput) searchInput.addEventListener('input', e=>{ renderLessons(e.target.value); });

  // Quick instruments under brand
  document.querySelectorAll('.quick-inst').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.dataset.instrument;
      // show instruments section and select
      showSection('instruments');
      // small timeout to ensure instruments rendered
      setTimeout(()=>{
        const grid = document.getElementById('instrumentsGrid');
        if(grid){
          // call renderInstruments if empty
          if(!grid.children.length) renderInstruments();
          selectInstrument(id);
          // try to focus the selected card
          const sel = grid.querySelector(`[data-instrument-id="${id}"]`);
          if(sel) sel.focus();
        }
      },80);
    });
  });

  // Theme toggles (persist + preference + aria sync)
  function enableThemeTransition(){
    try{
      document.documentElement.classList.add('theme-transition');
      window.setTimeout(()=>document.documentElement.classList.remove('theme-transition'), 320);
    }catch(e){}
  }

  function updateThemeButtons(theme){
    const isLight = theme === 'light';
    const b1 = $('#themeToggle');
    const b2 = $('#themeToggle2');
    if(b1) b1.setAttribute('aria-pressed', String(isLight));
    if(b2) b2.setAttribute('aria-pressed', String(isLight));
  }

  function setTheme(t){
    if(!app) return; enableThemeTransition();
    app.setAttribute('data-theme', t);
    try{ localStorage.setItem(STORE_THEME, t);}catch(e){}
    updateThemeButtons(t);
  }

  const themeBtn = $('#themeToggle'); if(themeBtn) themeBtn.addEventListener('click', ()=> setTheme(app.getAttribute('data-theme')==='dark'?'light':'dark'));
  const themeBtn2 = $('#themeToggle2'); if(themeBtn2) themeBtn2.addEventListener('click', ()=> setTheme(app.getAttribute('data-theme')==='dark'?'light':'dark'));

  // Onboarding opener
  const openOnboard = $('#openOnboard'); if(openOnboard) openOnboard.addEventListener('click', ()=>{
    openModal('Bem-vindo!','Aqui estão algumas dicas para começar:\n- Escolha um instrumento\n- Siga um caminho\n- Assista aulas e marque progresso');
  });

  // Mark complete
  const markBtn = $('#markCompleteBtn'); if(markBtn) markBtn.addEventListener('click', ()=>{
    if(!currentModalLessonId) return; const lesson = sampleLessons.find(l=>l.id==currentModalLessonId); if(!lesson) return; lesson.progress = 100; const map = loadProgressMap(); map[lesson.id] = 100; saveProgressMap(map); renderLessons(searchInput?searchInput.value:''); computeOverallProgress(); closeModal();
  });

  // Compute overall progress
  function computeOverallProgress(){
    const avg = Math.round((sampleLessons.reduce((s,l)=>s+(l.progress||0),0) / sampleLessons.length) || 0);
    if(totalProgressEl) totalProgressEl.textContent = avg + '%';
  }

  // Init
  function init(){
    // apply theme if stored
    try{
      const saved = localStorage.getItem(STORE_THEME);
      if(saved && app) { app.setAttribute('data-theme', saved); updateThemeButtons(saved); }
      else {
        // fallback to system preference
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        const sys = prefersLight ? 'light' : 'dark';
        setTheme(sys);
      }
    }catch(e){}
    applyStoredProgress();
    renderPaths(); renderLessons(); renderInstruments(); computeOverallProgress();
  }

  init();

  // Attach quick-instrument handlers that might be inside the instruments section
  function bindQuickInstruments(){
    document.querySelectorAll('#instruments .quick-inst').forEach(b=>{
      // avoid duplicating listeners
      b.removeEventListener('click', quickInstClick);
      b.addEventListener('click', quickInstClick);
    });
  }
  function quickInstClick(e){
    const b = e.currentTarget;
    const id = b.dataset.instrument;
    showSection('instruments');
    setTimeout(()=>{
      const grid = document.getElementById('instrumentsGrid');
      if(grid){
        if(!grid.children.length) renderInstruments();
        selectInstrument(id);
        const sel = grid.querySelector(`[data-instrument-id="${id}"]`);
        if(sel) sel.focus();
      }
    },80);
  }
  // bind now and also when instruments are rendered
  bindQuickInstruments();

})();
