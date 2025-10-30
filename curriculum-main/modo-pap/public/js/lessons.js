// lessons.js - Display lessons list for instrument and level
(function(){
  // Estrutura de 6 módulos vazios para cada nível
  const lessons = {
    guitar:{
      beginner:[
        // Módulo 1
        {id:1, moduleNumber:1, moduleName:'Módulo 1', title:'Introdução à Guitarra', lessons:[
          {id:101, title:'Partes da guitarra e suas funções', duration:'15:30', author:'Mariana Silva', progress:0, difficulty:'Fácil'},
          {id:102, title:'Tipos de guitarras (Strat, Les Paul, Tele, etc.)', duration:'18:45', author:'Carlos Mendes', progress:0, difficulty:'Fácil'},
          {id:103, title:'Como segurar a guitarra corretamente', duration:'10:20', author:'Ana Costa', progress:0, difficulty:'Fácil'},
          {id:104, title:'Como afinar a guitarra (manual e por app)', duration:'12:15', author:'Pedro Santos', progress:0, difficulty:'Fácil'},
          {id:105, title:'Cuidados e manutenção básica', duration:'14:40', author:'Lucas Oliveira', progress:0, difficulty:'Fácil'}
        ]},
        // Módulo 2
        {id:2, moduleNumber:2, moduleName:'Módulo 2', title:'Módulo 2', lessons:[]},
        // Módulo 3
        {id:3, moduleNumber:3, moduleName:'Módulo 3', title:'Módulo 3', lessons:[]},
        // Módulo 4
        {id:4, moduleNumber:4, moduleName:'Módulo 4', title:'Módulo 4', lessons:[]},
        // Módulo 5
        {id:5, moduleNumber:5, moduleName:'Módulo 5', title:'Módulo 5', lessons:[]},
        // Módulo 6
        {id:6, moduleNumber:6, moduleName:'Módulo 6', title:'Módulo 6', lessons:[]}
      ],
      intermediate:[
        {id:7, moduleNumber:1, moduleName:'Módulo 1', title:'Módulo 1', lessons:[]},
        {id:8, moduleNumber:2, moduleName:'Módulo 2', title:'Módulo 2', lessons:[]},
        {id:9, moduleNumber:3, moduleName:'Módulo 3', title:'Módulo 3', lessons:[]},
        {id:10, moduleNumber:4, moduleName:'Módulo 4', title:'Módulo 4', lessons:[]},
        {id:11, moduleNumber:5, moduleName:'Módulo 5', title:'Módulo 5', lessons:[]},
        {id:12, moduleNumber:6, moduleName:'Módulo 6', title:'Módulo 6', lessons:[]}
      ],
      advanced:[
        {id:13, moduleNumber:1, moduleName:'Módulo 1', title:'Módulo 1', lessons:[]},
        {id:14, moduleNumber:2, moduleName:'Módulo 2', title:'Módulo 2', lessons:[]},
        {id:15, moduleNumber:3, moduleName:'Módulo 3', title:'Módulo 3', lessons:[]},
        {id:16, moduleNumber:4, moduleName:'Módulo 4', title:'Módulo 4', lessons:[]},
        {id:17, moduleNumber:5, moduleName:'Módulo 5', title:'Módulo 5', lessons:[]},
        {id:18, moduleNumber:6, moduleName:'Módulo 6', title:'Módulo 6', lessons:[]}
      ]
    },
    drums:{
      beginner:[
        {id:19, moduleNumber:1, moduleName:'Módulo 1', title:'Módulo 1', lessons:[]},
        {id:20, moduleNumber:2, moduleName:'Módulo 2', title:'Módulo 2', lessons:[]},
        {id:21, moduleNumber:3, moduleName:'Módulo 3', title:'Módulo 3', lessons:[]},
        {id:22, moduleNumber:4, moduleName:'Módulo 4', title:'Módulo 4', lessons:[]},
        {id:23, moduleNumber:5, moduleName:'Módulo 5', title:'Módulo 5', lessons:[]},
        {id:24, moduleNumber:6, moduleName:'Módulo 6', title:'Módulo 6', lessons:[]}
      ],
      intermediate:[
        {id:25, moduleNumber:1, moduleName:'Módulo 1', title:'Módulo 1', lessons:[]},
        {id:26, moduleNumber:2, moduleName:'Módulo 2', title:'Módulo 2', lessons:[]},
        {id:27, moduleNumber:3, moduleName:'Módulo 3', title:'Módulo 3', lessons:[]},
        {id:28, moduleNumber:4, moduleName:'Módulo 4', title:'Módulo 4', lessons:[]},
        {id:29, moduleNumber:5, moduleName:'Módulo 5', title:'Módulo 5', lessons:[]},
        {id:30, moduleNumber:6, moduleName:'Módulo 6', title:'Módulo 6', lessons:[]}
      ],
      advanced:[
        {id:31, moduleNumber:1, moduleName:'Módulo 1', title:'Módulo 1', lessons:[]},
        {id:32, moduleNumber:2, moduleName:'Módulo 2', title:'Módulo 2', lessons:[]},
        {id:33, moduleNumber:3, moduleName:'Módulo 3', title:'Módulo 3', lessons:[]},
        {id:34, moduleNumber:4, moduleName:'Módulo 4', title:'Módulo 4', lessons:[]},
        {id:35, moduleNumber:5, moduleName:'Módulo 5', title:'Módulo 5', lessons:[]},
        {id:36, moduleNumber:6, moduleName:'Módulo 6', title:'Módulo 6', lessons:[]}
      ]
    },
    keyboard:{
      beginner:[
        {id:37, moduleNumber:1, moduleName:'Módulo 1', title:'Módulo 1', lessons:[]},
        {id:38, moduleNumber:2, moduleName:'Módulo 2', title:'Módulo 2', lessons:[]},
        {id:39, moduleNumber:3, moduleName:'Módulo 3', title:'Módulo 3', lessons:[]},
        {id:40, moduleNumber:4, moduleName:'Módulo 4', title:'Módulo 4', lessons:[]},
        {id:41, moduleNumber:5, moduleName:'Módulo 5', title:'Módulo 5', lessons:[]},
        {id:42, moduleNumber:6, moduleName:'Módulo 6', title:'Módulo 6', lessons:[]}
      ],
      intermediate:[
        {id:43, moduleNumber:1, moduleName:'Módulo 1', title:'Módulo 1', lessons:[]},
        {id:44, moduleNumber:2, moduleName:'Módulo 2', title:'Módulo 2', lessons:[]},
        {id:45, moduleNumber:3, moduleName:'Módulo 3', title:'Módulo 3', lessons:[]},
        {id:46, moduleNumber:4, moduleName:'Módulo 4', title:'Módulo 4', lessons:[]},
        {id:47, moduleNumber:5, moduleName:'Módulo 5', title:'Módulo 5', lessons:[]},
        {id:48, moduleNumber:6, moduleName:'Módulo 6', title:'Módulo 6', lessons:[]}
      ],
      advanced:[
        {id:49, moduleNumber:1, moduleName:'Módulo 1', title:'Módulo 1', lessons:[]},
        {id:50, moduleNumber:2, moduleName:'Módulo 2', title:'Módulo 2', lessons:[]},
        {id:51, moduleNumber:3, moduleName:'Módulo 3', title:'Módulo 3', lessons:[]},
        {id:52, moduleNumber:4, moduleName:'Módulo 4', title:'Módulo 4', lessons:[]},
        {id:53, moduleNumber:5, moduleName:'Módulo 5', title:'Módulo 5', lessons:[]},
        {id:54, moduleNumber:6, moduleName:'Módulo 6', title:'Módulo 6', lessons:[]}
      ]
    },
    viola:{
      beginner:[
        {id:55, moduleNumber:1, moduleName:'Módulo 1', title:'Módulo 1', lessons:[]},
        {id:56, moduleNumber:2, moduleName:'Módulo 2', title:'Módulo 2', lessons:[]},
        {id:57, moduleNumber:3, moduleName:'Módulo 3', title:'Módulo 3', lessons:[]},
        {id:58, moduleNumber:4, moduleName:'Módulo 4', title:'Módulo 4', lessons:[]},
        {id:59, moduleNumber:5, moduleName:'Módulo 5', title:'Módulo 5', lessons:[]},
        {id:60, moduleNumber:6, moduleName:'Módulo 6', title:'Módulo 6', lessons:[]}
      ],
      intermediate:[
        {id:61, moduleNumber:1, moduleName:'Módulo 1', title:'Módulo 1', lessons:[]},
        {id:62, moduleNumber:2, moduleName:'Módulo 2', title:'Módulo 2', lessons:[]},
        {id:63, moduleNumber:3, moduleName:'Módulo 3', title:'Módulo 3', lessons:[]},
        {id:64, moduleNumber:4, moduleName:'Módulo 4', title:'Módulo 4', lessons:[]},
        {id:65, moduleNumber:5, moduleName:'Módulo 5', title:'Módulo 5', lessons:[]},
        {id:66, moduleNumber:6, moduleName:'Módulo 6', title:'Módulo 6', lessons:[]}
      ],
      advanced:[
        {id:67, moduleNumber:1, moduleName:'Módulo 1', title:'Módulo 1', lessons:[]},
        {id:68, moduleNumber:2, moduleName:'Módulo 2', title:'Módulo 2', lessons:[]},
        {id:69, moduleNumber:3, moduleName:'Módulo 3', title:'Módulo 3', lessons:[]},
        {id:70, moduleNumber:4, moduleName:'Módulo 4', title:'Módulo 4', lessons:[]},
        {id:71, moduleNumber:5, moduleName:'Módulo 5', title:'Módulo 5', lessons:[]},
        {id:72, moduleNumber:6, moduleName:'Módulo 6', title:'Módulo 6', lessons:[]}
      ]
    },
    bass:{
      beginner:[
        {id:73, moduleNumber:1, moduleName:'Módulo 1', title:'Módulo 1', lessons:[]},
        {id:74, moduleNumber:2, moduleName:'Módulo 2', title:'Módulo 2', lessons:[]},
        {id:75, moduleNumber:3, moduleName:'Módulo 3', title:'Módulo 3', lessons:[]},
        {id:76, moduleNumber:4, moduleName:'Módulo 4', title:'Módulo 4', lessons:[]},
        {id:77, moduleNumber:5, moduleName:'Módulo 5', title:'Módulo 5', lessons:[]},
        {id:78, moduleNumber:6, moduleName:'Módulo 6', title:'Módulo 6', lessons:[]}
      ],
      intermediate:[
        {id:79, moduleNumber:1, moduleName:'Módulo 1', title:'Módulo 1', lessons:[]},
        {id:80, moduleNumber:2, moduleName:'Módulo 2', title:'Módulo 2', lessons:[]},
        {id:81, moduleNumber:3, moduleName:'Módulo 3', title:'Módulo 3', lessons:[]},
        {id:82, moduleNumber:4, moduleName:'Módulo 4', title:'Módulo 4', lessons:[]},
        {id:83, moduleNumber:5, moduleName:'Módulo 5', title:'Módulo 5', lessons:[]},
        {id:84, moduleNumber:6, moduleName:'Módulo 6', title:'Módulo 6', lessons:[]}
      ],
      advanced:[
        {id:85, moduleNumber:1, moduleName:'Módulo 1', title:'Módulo 1', lessons:[]},
        {id:86, moduleNumber:2, moduleName:'Módulo 2', title:'Módulo 2', lessons:[]},
        {id:87, moduleNumber:3, moduleName:'Módulo 3', title:'Módulo 3', lessons:[]},
        {id:88, moduleNumber:4, moduleName:'Módulo 4', title:'Módulo 4', lessons:[]},
        {id:89, moduleNumber:5, moduleName:'Módulo 5', title:'Módulo 5', lessons:[]},
        {id:90, moduleNumber:6, moduleName:'Módulo 6', title:'Módulo 6', lessons:[]}
      ]
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

  const instrument = instruments[instrumentId];
  const moduleData = modulesInfo[level];
  const lessonsList = lessons[instrumentId] ? lessons[instrumentId][level] || [] : [];

  // Elements
  const moduleIcon = document.getElementById('moduleIcon');
  const moduleName = document.getElementById('moduleName');
  const lessonCount = document.getElementById('lessonCount');
  const lessonsListContainer = document.getElementById('lessonsList');
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

    lessonsList.forEach((module, index) => {
      const item = document.createElement('div');
      item.className = 'lesson-list-item';
      
      item.innerHTML = `
        <div class="lesson-list-bullet"></div>
        <div class="lesson-list-content">
          <div class="lesson-list-number">${module.moduleNumber} - </div>
          <div class="lesson-list-info">
            <h4 class="lesson-list-title">${module.moduleName}</h4>
          </div>
        </div>
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
