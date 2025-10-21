// app-main.js - render instruments, modules and lessons
(function(){
  const instruments = [
    {id:'guitar',name:'Guitarra',symbol:'guitar'},
    {id:'drums',name:'Bateria',symbol:'drums'},
    {id:'keyboard',name:'Teclado',symbol:'keyboard'},
    {id:'viola',name:'Violão',symbol:'viola'},
    {id:'bass',name:'Baixo',symbol:'bass'},
  ];

  const lessons = {
    guitar:{beginner:[{id:1,title:'Acordes básicos'}],intermediate:[{id:2,title:'Power chords'}],advanced:[{id:3,title:'Solos simples'}]},
    drums:{beginner:[{id:11,title:'Batidas básicas'}],intermediate:[{id:12,title:'Fills'}],advanced:[{id:13,title:'Grooves complexos'}]},
    keyboard:{beginner:[{id:21,title:'Escalas simples'}],intermediate:[{id:22,title:'Acompanhamentos'}],advanced:[{id:23,title:'Improvisação'}]},
    viola:{beginner:[{id:31,title:'Dedilhado'}],intermediate:[{id:32,title:'Ritmos'}],advanced:[{id:33,title:'Composição'}]},
    bass:{beginner:[{id:41,title:'Walking bass'}],intermediate:[{id:42,title:'Slap'}],advanced:[{id:43,title:'Linhas complexas'}]},
  };

  const instrumentsGrid = document.getElementById('instrumentsGrid');
  const modulesArea = document.getElementById('modulesArea');
  const lessonsArea = document.getElementById('lessonsArea');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalBody = document.getElementById('modalBody');

  function renderInstruments(){
    if(!instrumentsGrid) return;
    instrumentsGrid.innerHTML = '';
    instruments.forEach(inst=>{
  const el = document.createElement('div'); el.className='instrument fade-up';
  el.innerHTML = `\n        <div class="svg-icon">${renderSVG(inst.symbol)}</div>\n        <h3>${inst.name}</h3>\n        <p class="small-muted">Explore módulos e aulas</p>\n        <div class="modules">\n          <div class="module" data-inst="${inst.id}" data-level="beginner">Iniciante</div>\n          <div class="module" data-inst="${inst.id}" data-level="intermediate">Intermediário</div>\n          <div class="module" data-inst="${inst.id}" data-level="advanced">Avançado</div>\n        </div>\n      `;
      instrumentsGrid.appendChild(el);
    });
    // attach module handlers
    document.querySelectorAll('.module').forEach(m=>{
      m.addEventListener('click', ()=>{
        const inst = m.dataset.inst; const level = m.dataset.level;
        renderLessonsFor(inst,level);
      });
    });
  }

  function renderLessonsFor(inst,level){
    if(!lessonsArea) return;
    lessonsArea.innerHTML = `<h3 class='gold-text'>${inst} — ${level}</h3>`;
    const list = (lessons[inst] && lessons[inst][level]) || [];
    if(!list.length) lessonsArea.innerHTML += '<div class="card">Nenhuma aula encontrada.</div>';
    list.forEach(l=>{
      const el = document.createElement('div'); el.className='lesson-card fade-up';
      el.innerHTML = `<div style="flex:1"><h4>${l.title}</h4><small class='small-muted'>Duração estimada</small></div><div><button class='btn small' data-lesson='${l.id}'>Abrir</button></div>`;
      lessonsArea.appendChild(el);
    });
    // bind open
    document.querySelectorAll('[data-lesson]').forEach(b=>b.addEventListener('click', ()=>{
      const id = b.dataset.lesson; openModal(`Aula ${id}`, 'Player protótipo');
    }));
  }

  function openModal(title,content){
    if(!modalBackdrop) return; modalBackdrop.style.display='flex'; modalBackdrop.setAttribute('aria-hidden','false');
    modalBody.innerHTML = `<h3 class='title'>${title}</h3><div style='margin-top:8px'>${content}</div>`;
  }
  function closeModal(){ if(!modalBackdrop) return; modalBackdrop.style.display='none'; modalBackdrop.setAttribute('aria-hidden','true'); modalBody.innerHTML=''; }
  if(modalBackdrop) modalBackdrop.addEventListener('click', e=>{ if(e.target===modalBackdrop) closeModal(); });

  // Nav buttons
  document.querySelectorAll('[data-nav]').forEach(btn=>btn.addEventListener('click', ()=>{
    document.querySelectorAll('[data-nav]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.nav === 'home' ? 'homeSection' : 'lessonsSection';
    document.getElementById('homeSection').style.display = target === 'homeSection' ? '' : 'none';
    document.getElementById('lessonsSection').style.display = target === 'lessonsSection' ? '' : 'none';
  }));

  // logout (no redirect for prototyping)
  const logoutBtn = document.getElementById('logoutBtn'); if(logoutBtn) logoutBtn.addEventListener('click', ()=>{ localStorage.removeItem('ns-session'); alert('Sessão encerrada (modo protótipo).'); });

  // init
  function init(){
    // auth disabled for prototyping/editor convenience
    renderInstruments();
    // inject equalizer into hero visual
    const heroVisual = document.querySelector('.hero .visual');
    if(heroVisual) heroVisual.innerHTML = renderEqualizerSVG();
  }
  init();

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
})();
