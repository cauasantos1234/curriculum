// upload.js - Video upload functionality
(function(){

  // Lessons structure (same as in videos.js)
  const lessonsStructure = {
    guitar: {
      beginner: [
        {id:101, title:'Partes da guitarra e suas funções'},
        {id:102, title:'Tipos de guitarras (Strat, Les Paul, Tele, etc.)'},
        {id:103, title:'Como segurar a guitarra corretamente'},
        {id:104, title:'Como afinar a guitarra (manual e por app)'},
        {id:105, title:'Cuidados e manutenção básica'}
      ],
      intermediate: [
        {id:201, title:'Técnicas de palhetada alternada'},
        {id:202, title:'Power chords e progressões'},
        {id:203, title:'Escalas pentatônicas'}
      ],
      advanced: [
        {id:301, title:'Sweep picking'},
        {id:302, title:'Tapping avançado'},
        {id:303, title:'Improvisação modal'}
      ]
    },
    drums: {
      beginner: [
        {id:11, title:'Ritmos Básicos'},
        {id:12, title:'Coordenação Inicial'},
        {id:13, title:'Leitura de partituras simples'}
      ],
      intermediate: [
        {id:111, title:'Fills e variações'},
        {id:112, title:'Ritmos de rock e pop'}
      ],
      advanced: [
        {id:211, title:'Técnicas de jazz'},
        {id:212, title:'Coordenação avançada'}
      ]
    },
    keyboard: {
      beginner: [
        {id:21, title:'Escalas Simples'},
        {id:22, title:'Postura e Técnica'},
        {id:23, title:'Leitura de cifras'}
      ],
      intermediate: [
        {id:121, title:'Acordes complexos'},
        {id:122, title:'Improvisação básica'}
      ],
      advanced: [
        {id:221, title:'Jazz e harmonia avançada'},
        {id:222, title:'Técnicas de performance'}
      ]
    },
    viola: {
      beginner: [
        {id:31, title:'Dedilhado Básico'},
        {id:32, title:'Acordes Abertos'},
        {id:33, title:'Ritmos fundamentais'}
      ],
      intermediate: [
        {id:131, title:'Pestana e acordes com pestana'},
        {id:132, title:'Fingerstyle intermediário'}
      ],
      advanced: [
        {id:231, title:'Técnicas de flamenco'},
        {id:232, title:'Arranjos complexos'}
      ]
    },
    bass: {
      beginner: [
        {id:41, title:'Walking Bass Simples'},
        {id:42, title:'Técnica de Mão Direita'},
        {id:43, title:'Fundamentos de groove'}
      ],
      intermediate: [
        {id:141, title:'Slap e pop'},
        {id:142, title:'Linhas de funk'}
      ],
      advanced: [
        {id:241, title:'Técnicas de jazz'},
        {id:242, title:'Solo e improviso'}
      ]
    }
  };

  // Elements - verificação robusta
  let uploadForm, btnYouTube, btnFileUpload, youtubeSection, fileSection;
  let videoUrl, videoPreview, videoPreviewContainer;
  let videoFile, fileUploadArea, fileInfo, fileName, fileSize, removeFile;
  let instrumentSelect, moduleSelect, lessonSelect;
  let cancelBtn, modalBackdrop, modalBody;
  let thumbnailFile, thumbnailUploadArea, thumbnailPreview, thumbnailImage, removeThumbnail;
  let selectedThumbnail = null;
  let videoDuration = null;
  
  function getElements() {
    uploadForm = document.getElementById('uploadVideoForm');
    btnYouTube = document.getElementById('btnYouTube');
    btnFileUpload = document.getElementById('btnFileUpload');
    youtubeSection = document.getElementById('youtubeSection');
    fileSection = document.getElementById('fileSection');
    videoUrl = document.getElementById('videoUrl');
    videoPreview = document.getElementById('videoPreview');
    videoPreviewContainer = document.getElementById('videoPreviewContainer');
    videoFile = document.getElementById('videoFile');
    fileUploadArea = document.getElementById('fileUploadArea');
    fileInfo = document.getElementById('fileInfo');
    fileName = document.getElementById('fileName');
    fileSize = document.getElementById('fileSize');
    removeFile = document.getElementById('removeFile');
    instrumentSelect = document.getElementById('videoInstrument');
    moduleSelect = document.getElementById('videoModule');
    lessonSelect = document.getElementById('videoLesson');
    cancelBtn = document.getElementById('cancelBtn');
    modalBackdrop = document.getElementById('modalBackdrop');
    modalBody = document.getElementById('modalBody');
    thumbnailFile = document.getElementById('thumbnailFile');
    thumbnailUploadArea = document.getElementById('thumbnailUploadArea');
    thumbnailPreview = document.getElementById('thumbnailPreview');
    thumbnailImage = document.getElementById('thumbnailImage');
    removeThumbnail = document.getElementById('removeThumbnail');
    
    console.log('📦 Elementos carregados:', {
      uploadForm: !!uploadForm,
      videoUrl: !!videoUrl,
      videoPreview: !!videoPreview
    });
  }

  let currentUploadType = 'youtube';
  let selectedFile = null;
  let dbInitialized = false;

  // Initialize
  async function init(){
    console.log('🎬 Iniciando página de upload...');
    
    // Aguardar DOM estar pronto
    if (document.readyState === 'loading') {
      console.log('⏳ Aguardando DOM...');
      await new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', resolve);
      });
    }
    
    console.log('✅ DOM pronto, carregando elementos...');
    getElements();
    
    // Preencher nome do professor automaticamente
    loadProfessorName();
    
    // Initialize IndexedDB
    try{
      await VideoStorage.init();
      dbInitialized = true;
      console.log('✅ IndexedDB inicializado');
    }catch(e){
      console.error('❌ Erro ao inicializar IndexedDB:', e);
      dbInitialized = false;
    }
    
    // Setup de funcionalidades
    console.log('⚙️ Configurando funcionalidades...');
    setupNavigation();
    setupUploadTypeSelector();
    setupFileUpload();
    setupThumbnailUpload();
    setupFormSelects();
    setupVideoUrlPreview();
    setupFormSubmit();
    setupCancelButton();
    initThemeToggle();
    updateStats();
    showStorageInfo();
    
    console.log('✅ Página de upload totalmente inicializada!');
    console.log('💡 Teste a pré-visualização com: testPreview("https://www.youtube.com/watch?v=dQw4w9WgXcQ")');
  }

  // Carregar nome do professor automaticamente
  function loadProfessorName(){
    const session = JSON.parse(localStorage.getItem('ns-session') || 'null');
    const authorInput = document.getElementById('videoAuthor');
    
    if(session && session.name && authorInput){
      authorInput.value = session.name;
      authorInput.readOnly = true;
      authorInput.style.background = 'var(--glass)';
      authorInput.style.cursor = 'not-allowed';
      console.log('✅ Nome do professor preenchido automaticamente:', session.name);
    } else {
      console.warn('⚠️ Sessão não encontrada ou nome ausente');
    }
  }

  // Navigation
  function setupNavigation(){
    console.log('🧭 Configurando navegação...');
    
    // Sidebar setup
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
      'lessons': 'app.html',
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
    
    console.log('✅ Navegação configurada');
  }

  // Upload type selector
  function setupUploadTypeSelector(){
    if(btnYouTube){
      btnYouTube.addEventListener('click', () => switchUploadType('youtube'));
    }
    
    if(btnFileUpload){
      btnFileUpload.addEventListener('click', () => switchUploadType('file'));
    }
  }

  function switchUploadType(type){
    currentUploadType = type;
    
    // Update buttons
    btnYouTube.classList.toggle('active', type === 'youtube');
    btnFileUpload.classList.toggle('active', type === 'file');
    
    // Toggle sections
    youtubeSection.classList.toggle('active', type === 'youtube');
    fileSection.classList.toggle('active', type === 'file');
    
    // Clear the other option
    if(type === 'youtube'){
      selectedFile = null;
      if(videoFile) videoFile.value = '';
      if(fileInfo) fileInfo.style.display = 'none';
    } else {
      if(videoUrl) videoUrl.value = '';
      if(videoPreview) videoPreview.style.display = 'none';
    }
  }

  // File upload functionality
  function setupFileUpload(){
    if(fileUploadArea && videoFile){
      fileUploadArea.addEventListener('click', () => videoFile.click());
      videoFile.addEventListener('change', handleFileSelect);
      
      // Drag and drop
      fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.classList.add('dragover');
      });
      
      fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.classList.remove('dragover');
      });
      
      fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if(files.length > 0){
          videoFile.files = files;
          handleFileSelect();
        }
      });
    }
    
    if(removeFile){
      removeFile.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedFile = null;
        if(videoFile) videoFile.value = '';
        if(fileInfo) fileInfo.style.display = 'none';
      });
    }
  }

  function handleFileSelect(){
    const file = videoFile.files[0];
    if(!file) return;
    
    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
    if(!validTypes.includes(file.type)){
      openModal('❌ Tipo de Arquivo Inválido', 
        '<p>Por favor, selecione um arquivo de vídeo válido.</p><p style="margin-top:12px;font-size:14px;color:var(--muted)">Formatos aceitos: MP4, WebM, OGG, MOV</p>');
      videoFile.value = '';
      return;
    }
    
    // With IndexedDB, we can handle larger files (up to 100MB recommended)
    const maxSize = 100 * 1024 * 1024; // 100MB max
    const recommendedSize = 50 * 1024 * 1024; // 50MB recommended
    
    if(file.size > maxSize){
      openModal('❌ Arquivo Muito Grande', 
        '<p>O vídeo não pode exceder 100MB.</p><p style="margin-top:12px;font-size:14px;color:var(--muted)">Tamanho atual: ' + formatFileSize(file.size) + '</p><p style="margin-top:12px;font-size:14px;color:var(--accent)">💡 Para vídeos maiores, use o YouTube</p>');
      videoFile.value = '';
      return;
    }
    
    // Warn for files larger than recommended size
    if(file.size > recommendedSize){
      openModal('⚠️ Arquivo Grande Detectado', 
        `<div style="text-align:left">
          <p style="margin-bottom:16px">Seu arquivo possui <strong>${formatFileSize(file.size)}</strong>. Arquivos muito grandes podem levar mais tempo para processar.</p>
          <p style="margin-bottom:16px;color:var(--muted)"><strong>💡 Dica:</strong> Para vídeos acima de 50MB, recomendamos usar o YouTube para melhor desempenho.</p>
          <div style="display:flex;gap:12px;justify-content:center;margin-top:24px">
            <button class="btn btn-secondary" onclick="document.getElementById('modalBackdrop').style.display='none'">
              Continuar com Upload
            </button>
            <button class="btn btn-primary" onclick="document.getElementById('modalBackdrop').style.display='none';document.getElementById('btnYouTube').click()">
              Usar YouTube
            </button>
          </div>
        </div>`);
    }
    
    selectedFile = file;
    
    // Show file info
    if(fileName) fileName.textContent = file.name;
    if(fileSize) fileSize.textContent = formatFileSize(file.size);
    if(fileInfo) fileInfo.style.display = 'flex';
    
    // Auto-detect video duration
    detectVideoDuration(file);
  }

  // Auto-detect video duration from file
  function detectVideoDuration(file) {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = function() {
      window.URL.revokeObjectURL(video.src);
      const duration = Math.floor(video.duration);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      const durationInput = document.getElementById('videoDuration');
      if (durationInput) {
        durationInput.value = durationStr;
        videoDuration = durationStr;
        console.log('✅ Duração detectada automaticamente:', durationStr);
      }
    };
    
    video.src = URL.createObjectURL(file);
  }

  function formatFileSize(bytes){
    if(bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Thumbnail Upload
  function setupThumbnailUpload() {
    if (thumbnailUploadArea && thumbnailFile) {
      thumbnailUploadArea.addEventListener('click', () => thumbnailFile.click());
      thumbnailFile.addEventListener('change', handleThumbnailSelect);
      
      // Drag and drop
      thumbnailUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        thumbnailUploadArea.classList.add('dragover');
      });
      
      thumbnailUploadArea.addEventListener('dragleave', () => {
        thumbnailUploadArea.classList.remove('dragover');
      });
      
      thumbnailUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        thumbnailUploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          thumbnailFile.files = files;
          handleThumbnailSelect();
        }
      });
    }
    
    if (removeThumbnail) {
      removeThumbnail.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedThumbnail = null;
        if (thumbnailFile) thumbnailFile.value = '';
        if (thumbnailPreview) thumbnailPreview.style.display = 'none';
        if (thumbnailUploadArea) thumbnailUploadArea.style.display = 'block';
      });
    }
  }

  function handleThumbnailSelect() {
    const file = thumbnailFile.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      openModal('❌ Tipo de Arquivo Inválido', 
        '<p>Por favor, selecione uma imagem válida.</p><p style="margin-top:12px;font-size:14px;color:var(--muted)">Formatos aceitos: JPG, PNG, WEBP</p>');
      thumbnailFile.value = '';
      return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      openModal('❌ Imagem Muito Grande', 
        '<p>A thumbnail não pode exceder 5MB.</p><p style="margin-top:12px;font-size:14px;color:var(--muted)">Tamanho atual: ' + formatFileSize(file.size) + '</p>');
      thumbnailFile.value = '';
      return;
    }
    
    selectedThumbnail = file;
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
      if (thumbnailImage) {
        thumbnailImage.src = e.target.result;
        thumbnailPreview.style.display = 'block';
        thumbnailUploadArea.style.display = 'none';
        console.log('✅ Thumbnail carregada:', file.name);
      }
    };
    reader.readAsDataURL(file);
  }

  // Form selects (cascading dropdowns)
  function setupFormSelects(){
    if(instrumentSelect){
      instrumentSelect.addEventListener('change', updateLessonOptions);
    }
    
    if(moduleSelect){
      moduleSelect.addEventListener('change', updateLessonOptions);
    }
  }

  function updateLessonOptions(){
    const selectedInstrument = instrumentSelect?.value;
    const selectedModule = moduleSelect?.value;
    
    console.log('🔄 Atualizando opções de aula...', {
      instrumento: selectedInstrument,
      modulo: selectedModule
    });
    
    if(!selectedInstrument || !selectedModule || !lessonSelect) {
      console.warn('⚠️ Faltam dados para atualizar aulas');
      return;
    }
    
    lessonSelect.disabled = false;
    lessonSelect.innerHTML = '<option value="">Selecione uma aula</option>';
    
    const moduleMap = {
      'bronze': 'beginner',
      'silver': 'intermediate',
      'gold': 'advanced'
    };
    
    const levelKey = moduleMap[selectedModule];
    const lessonsList = lessonsStructure[selectedInstrument]?.[levelKey] || [];
    
    console.log('📚 Aulas encontradas:', lessonsList.length);
    
    if(lessonsList.length === 0){
      lessonSelect.innerHTML = '<option value="">Nenhuma aula disponível para este nível</option>';
      lessonSelect.disabled = true;
      console.warn('⚠️ Nenhuma aula disponível para:', {instrumento: selectedInstrument, nivel: levelKey});
      return;
    }
    
    lessonsList.forEach(lesson => {
      const option = document.createElement('option');
      option.value = lesson.id;
      option.textContent = lesson.title;
      lessonSelect.appendChild(option);
    });
    
    console.log('✅ Aulas carregadas com sucesso no select');
  }

  // Video URL preview
  function setupVideoUrlPreview(){
    if(!videoUrl) {
      console.warn('⚠️ Elemento videoUrl não encontrado');
      return;
    }
    
    console.log('📺 Configurando pré-visualização de vídeo...');
    
    let previewTimeout;
    
    const triggerPreview = () => {
      clearTimeout(previewTimeout);
      previewTimeout = setTimeout(() => {
        console.log('🔄 Atualizando preview...');
        updateVideoPreview();
      }, 500);
    };
    
    // Event listeners
    videoUrl.addEventListener('input', (e) => {
      console.log('✏️ Input detectado:', e.target.value.substring(0, 30) + '...');
      triggerPreview();
    });
    
    videoUrl.addEventListener('change', (e) => {
      console.log('🔄 Change detectado:', e.target.value.substring(0, 30) + '...');
      triggerPreview();
    });
    
    videoUrl.addEventListener('paste', (e) => {
      console.log('📋 Paste detectado');
      setTimeout(() => {
        console.log('📋 Valor após paste:', videoUrl.value.substring(0, 30) + '...');
        updateVideoPreview();
      }, 100);
    });
    
    videoUrl.addEventListener('blur', () => {
      const val = videoUrl.value.trim();
      if(val) {
        console.log('👁️ Blur com valor, atualizando:', val.substring(0, 30) + '...');
        updateVideoPreview();
      }
    });
    
    // Evento de foco para debug
    videoUrl.addEventListener('focus', () => {
      console.log('🎯 Campo de URL focado');
    });
    
    // Teste inicial
    if(videoUrl.value.trim()){
      console.log('🔍 Valor inicial detectado:', videoUrl.value.substring(0, 30) + '...');
      updateVideoPreview();
    }
    
    console.log('✅ Pré-visualização configurada');
  }

  function updateVideoPreview(){
    console.log('📺 Atualizando pré-visualização...');
    
    try {
      const url = videoUrl?.value?.trim();
      
      if(!videoPreview || !videoPreviewContainer) {
        console.error('❌ Elementos não encontrados:', {
          videoPreview: !!videoPreview,
          videoPreviewContainer: !!videoPreviewContainer
        });
        return;
      }
      
      if(!url || url.length === 0){
        console.log('❎ URL vazia, ocultando preview');
        videoPreview.style.display = 'none';
        videoPreviewContainer.innerHTML = '';
        return;
      }
      
      console.log('🔍 Processando URL:', url.substring(0, 50) + '...');
      const videoId = extractYouTubeId(url);
      
      if(videoId){
        console.log('✅ ID extraído:', videoId);
        videoPreview.style.display = 'block';
        
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
        
        console.log('🎬 Criando iframe:', embedUrl);
        
        const iframeHTML = `
          <iframe 
            id="youtubePreviewFrame"
            width="100%" 
            height="100%" 
            src="${embedUrl}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen
            style="border-radius:12px;border:none;">
          </iframe>
          <div id="embedInfo" style="position:absolute;bottom:0;left:0;right:0;background:rgba(22,33,62,0.95);border-top:2px solid #d4af37;padding:12px;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
              <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:#d4af37;flex:1;">
                <span>ℹ️</span>
                <span><strong>Vídeo:</strong> ${videoId}</span>
              </div>
              <a href="${youtubeUrl}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:6px;padding:6px 12px;background:#d4af37;color:#000;text-decoration:none;border-radius:6px;font-size:12px;font-weight:600;white-space:nowrap;">
                <span>▶️</span>
                <span>Ver no YouTube</span>
              </a>
            </div>
          </div>
        `;
        
        videoPreviewContainer.innerHTML = iframeHTML;
        console.log('✅ Preview renderizado com sucesso!');
        
      } else {
        console.warn('⚠️ ID não extraído, mostrando erro');
        videoPreview.style.display = 'block';
        videoPreviewContainer.innerHTML = `
          <div style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center;background:var(--bg-2);">
            <div style="font-size:48px;margin-bottom:12px;">⚠️</div>
            <p style="color:var(--text);font-weight:600;margin-bottom:8px;">URL inválida</p>
            <p style="color:var(--muted);font-size:14px;">Cole uma URL válida do YouTube</p>
            <div style="margin-top:16px;font-size:12px;color:var(--muted);text-align:left;background:var(--glass);padding:12px;border-radius:8px;max-width:300px;">
              <p style="margin-bottom:8px;font-weight:600;color:#d4af37;">Exemplos válidos:</p>
              <p style="font-family:monospace;margin-bottom:4px;">• youtube.com/watch?v=xxxxx</p>
              <p style="font-family:monospace;">• youtu.be/xxxxx</p>
            </div>
          </div>
        `;
      }
    } catch(err) {
      console.error('❌ Erro ao atualizar preview:', err);
      if(videoPreview) videoPreview.style.display = 'none';
    }
  }

  function extractYouTubeId(url){
    // Remove espaços em branco
    url = url.trim();
    
    // Padrões para diferentes formatos de URL do YouTube
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,           // youtube.com/watch?v=xxxxx
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,                       // youtu.be/xxxxx
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,             // youtube.com/embed/xxxxx
      /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,                 // youtube.com/v/xxxxx
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,            // youtube.com/shorts/xxxxx
      /(?:youtube\.com\/watch\?.*&v=)([a-zA-Z0-9_-]{11})/,        // youtube.com/watch?feature=...&v=xxxxx
    ];
    
    for(const pattern of patterns){
      const match = url.match(pattern);
      if(match && match[1]) {
        console.log('✅ YouTube ID extraído:', match[1]);
        return match[1];
      }
    }
    
    console.warn('⚠️ Não foi possível extrair ID do YouTube da URL:', url);
    return null;
  }



  // Form submission
  function setupFormSubmit(){
    if(!uploadForm) return;
    
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Collect form data
      const formData = {
        title: document.getElementById('videoTitle')?.value,
        description: document.getElementById('videoDescription')?.value,
        duration: document.getElementById('videoDuration')?.value,
        author: document.getElementById('videoAuthor')?.value,
        instrument: instrumentSelect?.value,
        module: moduleSelect?.value,
        lesson: lessonSelect?.value,
        uploadType: currentUploadType
      };
      
      // Debug: mostrar valores capturados
      console.log('📋 Dados do formulário:', formData);
      console.log('🎯 Módulo selecionado:', moduleSelect?.value);
      console.log('📚 Aula selecionada:', lessonSelect?.value);
      console.log('🔧 Lesson select disabled?', lessonSelect?.disabled);
      console.log('⏱️ Duração capturada:', formData.duration);
      console.log('📹 Tipo de upload:', currentUploadType);
      
      // Validate required fields (básicos) - DURAÇÃO NÃO É OBRIGATÓRIA AINDA
      if(!formData.title || !formData.author || !formData.instrument){
        openModal('❌ Campos Obrigatórios', 
          '<p>Por favor, preencha todos os campos básicos marcados com <span style="color:#ef4444">*</span></p>' +
          '<p style="margin-top:12px;font-size:14px;color:var(--muted)">Faltando: ' + 
          [
            !formData.title ? 'Título' : null,
            !formData.author ? 'Professor' : null,
            !formData.instrument ? 'Instrumento' : null
          ].filter(Boolean).join(', ') + '</p>');
        return;
      }
      
      // Validate module (nível)
      if(!formData.module){
        openModal('❌ Nível Obrigatório', 
          '<p>Por favor, selecione o <strong>nível</strong> do vídeo.</p>' +
          '<p style="margin-top:12px;font-size:14px;color:var(--muted)">Escolha: Bronze (Iniciante), Prata (Intermediário) ou Ouro (Avançado)</p>');
        return;
      }
      
      // Validate lesson (aula)
      if(!formData.lesson){
        openModal('❌ Aula Obrigatória', 
          '<p>Por favor, selecione uma <strong>aula</strong> para associar este vídeo.</p>' +
          '<p style="margin-top:12px;font-size:14px;color:var(--muted)">💡 Dica: Certifique-se de ter selecionado o instrumento e o nível primeiro, depois escolha a aula na lista.</p>');
        return;
      }
      
      // Validate thumbnail
      if(!selectedThumbnail){
        openModal('❌ Thumbnail Obrigatória', 
          '<p>Por favor, faça upload de uma imagem de capa para o vídeo.</p>');
        return;
      }
      
      // Validate duration - Flexível para permitir preenchimento manual se necessário
      if(!formData.duration || formData.duration === 'Será detectado automaticamente' || formData.duration.trim() === ''){
        // Para upload de arquivo, a duração deve ser detectada
        if(currentUploadType === 'file'){
          openModal('⏱️ Duração Não Detectada', 
            '<p>Aguarde a detecção automática da duração do vídeo.</p>' +
            '<p style="margin-top:12px;font-size:14px;color:var(--muted)">💡 Dica: A duração é detectada automaticamente quando você seleciona o arquivo de vídeo. Aguarde alguns segundos.</p>');
          return;
        }
        
        // Para YouTube, perguntar se quer preencher manualmente
        const shouldContinue = confirm(
          '⏱️ Duração não detectada automaticamente.\n\n' +
          'Você gostaria de:\n' +
          '• OK = Preencher a duração manualmente agora\n' +
          '• Cancelar = Voltar e aguardar detecção automática'
        );
        
        if(!shouldContinue){
          return;
        }
        
        // Abrir campo de duração para preenchimento manual
        const durationInput = document.getElementById('videoDuration');
        if(durationInput){
          durationInput.removeAttribute('readonly');
          durationInput.focus();
          durationInput.placeholder = 'Ex: 5:30 (5 minutos e 30 segundos)';
          openModal('✏️ Preencha a Duração', 
            '<p>Por favor, preencha a duração do vídeo manualmente.</p>' +
            '<p style="margin-top:12px;font-size:14px;color:var(--muted)">Formato: MM:SS (ex: 5:30 para 5 minutos e 30 segundos)</p>');
        }
        return;
      }
      
      // Validate video source
      if(currentUploadType === 'youtube'){
        const url = videoUrl?.value?.trim();
        if(!url){
          openModal('❌ URL Obrigatória', 
            '<p>Por favor, insira a URL do YouTube.</p>');
          return;
        }
        
        const videoId = extractYouTubeId(url);
        if(!videoId){
          openModal('❌ URL Inválida', 
            '<p>Por favor, insira uma URL válida do YouTube.</p><p style="margin-top:12px;font-size:14px;color:var(--muted)">Exemplos válidos:<br>• https://www.youtube.com/watch?v=xxxxx<br>• https://youtu.be/xxxxx</p>');
          return;
        }
        
        // Verificar se o vídeo existe (teste simples)
        console.log('✅ URL do YouTube validada:', url);
        console.log('✅ ID extraído:', videoId);
        console.log('ℹ️ Nota: Erros na pré-visualização não impedem o salvamento');
        
        formData.url = url;
        formData.videoId = videoId;
      } else {
        if(!selectedFile){
          openModal('❌ Arquivo Obrigatório', 
            '<p>Por favor, selecione um arquivo de vídeo.</p>');
          return;
        }
        
        formData.file = selectedFile;
        formData.fileName = selectedFile.name;
        formData.fileSize = selectedFile.size;
      }
      
      // Save to localStorage
      saveVideoToStorage(formData);
    });
  }

  async function saveVideoToStorage(videoData){
    try{
      // Get current session to save teacher email
      const session = JSON.parse(localStorage.getItem('ns-session') || 'null');
      
      // Create new video object
      const newVideo = {
        title: videoData.title,
        description: videoData.description,
        duration: videoData.duration,
        author: videoData.author,
        teacherEmail: session?.email || videoData.author, // IMPORTANTE: salvar email do professor
        instrument: videoData.instrument,
        module: videoData.module,
        lesson: videoData.lesson,
        uploadedAt: new Date().toISOString(),
        uploadType: videoData.uploadType,
        views: 0,
        likes: 0,
        rating: 0,
        ratings: [],
        postedDate: new Date().toISOString()
      };
      
      console.log('💾 Salvando vídeo com email:', newVideo.teacherEmail);
      
      // Convert thumbnail to base64
      if(selectedThumbnail){
        const thumbnailBase64 = await fileToBase64(selectedThumbnail);
        newVideo.thumbnail = thumbnailBase64;
      }
      
      if(videoData.uploadType === 'youtube'){
        newVideo.url = videoData.url;
        newVideo.videoId = videoData.videoId;
        
        // Save to IndexedDB
        if(dbInitialized){
          await VideoStorage.save(newVideo);
        } else {
          // Fallback to localStorage for YouTube videos
          const existingVideos = JSON.parse(localStorage.getItem('newsong-videos') || '[]');
          newVideo.id = Date.now();
          existingVideos.push(newVideo);
          localStorage.setItem('newsong-videos', JSON.stringify(existingVideos));
        }
        
        showSuccessAndRedirect(videoData.title);
      } else {
        // For file uploads, use IndexedDB
        if(!dbInitialized){
          openModal('❌ Banco de Dados Não Disponível', 
            `<div style="text-align:left">
              <p style="margin-bottom:16px">O armazenamento avançado não está disponível no seu navegador.</p>
              <p style="margin-bottom:16px;color:var(--muted)"><strong>Soluções:</strong></p>
              <ul style="margin-left:20px;color:var(--muted);line-height:1.8">
                <li>📹 Use a opção "Link do YouTube"</li>
                <li>� Recarregue a página e tente novamente</li>
                <li>🌐 Use um navegador moderno (Chrome, Firefox, Edge)</li>
              </ul>
              <div style="display:flex;gap:12px;justify-content:center;margin-top:24px">
                <button class="btn btn-primary" onclick="document.getElementById('modalBackdrop').style.display='none';document.getElementById('btnYouTube').click()">
                  Usar YouTube
                </button>
              </div>
            </div>`);
          return;
        }
        
        // Show loading indicator with progress
        openModal('⏳ Processando Vídeo...', 
          `<div style="text-align:center">
            <div style="font-size:48px;margin-bottom:16px">⚙️</div>
            <p>Carregando <strong>${formatFileSize(videoData.fileSize)}</strong></p>
            <p style="color:var(--muted);font-size:14px;margin-top:8px">Por favor aguarde...</p>
            <div style="width:100%;height:4px;background:var(--glass);border-radius:2px;margin-top:20px;overflow:hidden">
              <div id="uploadProgress" style="width:0%;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent-2));transition:width 0.3s"></div>
            </div>
          </div>`);
        
        // Simulate progress for better UX
        let progress = 0;
        const progressBar = document.getElementById('uploadProgress');
        const progressInterval = setInterval(() => {
          progress += 10;
          if(progress >= 90) clearInterval(progressInterval);
          if(progressBar) progressBar.style.width = progress + '%';
        }, 200);
        
        // Convert file to base64
        const reader = new FileReader();
        reader.onload = async function(e){
          try{
            newVideo.fileData = e.target.result;
            newVideo.fileName = videoData.fileName;
            newVideo.fileSize = videoData.fileSize;
            newVideo.fileType = videoData.file.type;
            
            // Save to IndexedDB
            await VideoStorage.save(newVideo);
            
            clearInterval(progressInterval);
            if(progressBar) progressBar.style.width = '100%';
            
            setTimeout(() => {
              closeModal();
              showSuccessAndRedirect(videoData.title);
            }, 500);
          }catch(e){
            clearInterval(progressInterval);
            console.error('Error saving to IndexedDB:', e);
            openModal('❌ Erro ao Salvar', 
              `<div style="text-align:left">
                <p style="margin-bottom:16px">Não foi possível salvar o vídeo.</p>
                <p style="margin-bottom:16px;color:var(--muted)"><strong>Possíveis causas:</strong></p>
                <ul style="margin-left:20px;color:var(--muted);line-height:1.8">
                  <li>� Espaço de armazenamento insuficiente</li>
                  <li>� Navegação anônima/privada ativa</li>
                  <li>� Arquivo muito grande para o navegador</li>
                </ul>
                <p style="margin-top:16px;color:var(--accent)"><strong>💡 Solução:</strong> Use o YouTube para vídeos grandes</p>
                <div style="display:flex;gap:12px;justify-content:center;margin-top:24px">
                  <button class="btn btn-primary" onclick="document.getElementById('modalBackdrop').style.display='none';document.getElementById('btnYouTube').click()">
                    Usar YouTube
                  </button>
                </div>
              </div>`);
          }
        };
        
        reader.onerror = function(){
          clearInterval(progressInterval);
          openModal('❌ Erro ao Ler Arquivo', 
            '<p>Não foi possível ler o arquivo. Por favor, tente novamente.</p>');
        };
        
        reader.readAsDataURL(videoData.file);
      }
    }catch(e){
      console.error('Error saving video:', e);
      openModal('❌ Erro ao Salvar', 
        '<p>Ocorreu um erro ao salvar seu vídeo. Por favor, tente novamente.</p>');
    }
  }

  function showSuccessAndRedirect(videoTitle){
    openModal('✅ Vídeo Publicado com Sucesso!', 
      `<div style="text-align:center">
        <div style="font-size:64px;margin-bottom:16px">🎉</div>
        <p style="font-size:16px;margin-bottom:12px">Seu vídeo <strong>"${videoTitle}"</strong> foi adicionado à plataforma!</p>
        <p style="color:var(--muted);font-size:14px;margin-bottom:24px">Os alunos já podem assistir na página de vídeos.</p>
        <button class="btn btn-primary" onclick="window.location.href='app.html'">
          <span>🏠</span>
          <span>Voltar ao Início</span>
        </button>
      </div>`);
    
    // Reset form
    uploadForm.reset();
    selectedFile = null;
    if(videoPreview) videoPreview.style.display = 'none';
    if(videoPreviewContainer) videoPreviewContainer.innerHTML = '';
    if(fileInfo) fileInfo.style.display = 'none';
    if(lessonSelect){
      lessonSelect.disabled = true;
      lessonSelect.innerHTML = '<option value="">Selecione instrumento e nível primeiro</option>';
    }
    
    switchUploadType('youtube');
    updateStats();
  }

  // Cancel button
  function setupCancelButton(){
    if(cancelBtn){
      cancelBtn.addEventListener('click', () => {
        const hasContent = 
          document.getElementById('videoTitle')?.value ||
          document.getElementById('videoDescription')?.value ||
          document.getElementById('videoDuration')?.value ||
          document.getElementById('videoAuthor')?.value ||
          videoUrl?.value ||
          selectedFile;
        
        if(hasContent){
          openModal('⚠️ Cancelar Upload', 
            `<p>Você tem alterações não salvas. Deseja realmente cancelar?</p>
            <div style="display:flex;gap:12px;justify-content:center;margin-top:20px">
              <button class="btn btn-secondary" onclick="document.getElementById('modalBackdrop').style.display='none'">
                Continuar Editando
              </button>
              <button class="btn btn-primary" onclick="window.location.href='app.html'">
                Sim, Cancelar
              </button>
            </div>`);
        } else {
          window.location.href = 'app.html';
        }
      });
    }
  }

  // Update stats
  async function updateStats(){
    try{
      let totalVideos = 0;
      
      if(dbInitialized){
        const videos = await VideoStorage.getAll();
        totalVideos = videos.length;
      } else {
        const videos = JSON.parse(localStorage.getItem('newsong-videos') || '[]');
        totalVideos = videos.length;
      }
      
      const totalVideosEl = document.getElementById('totalVideos');
      const totalViewsEl = document.getElementById('totalViews');
      
      if(totalVideosEl) totalVideosEl.textContent = totalVideos;
      if(totalViewsEl) totalViewsEl.textContent = '0'; // Views not implemented yet
    }catch(e){
      console.error('Error updating stats:', e);
    }
  }

  // Show storage information
  async function showStorageInfo(){
    try{
      const estimate = await VideoStorage.getStorageEstimate();
      if(estimate.quota && estimate.usage){
        const usedMB = (estimate.usage / (1024 * 1024)).toFixed(2);
        const totalMB = (estimate.quota / (1024 * 1024)).toFixed(2);
        const percentage = ((estimate.usage / estimate.quota) * 100).toFixed(1);
        
        console.log(`💾 Armazenamento: ${usedMB}MB / ${totalMB}MB (${percentage}% usado)`);
        
        // Show warning if storage is getting full
        if(percentage > 80){
          console.warn('⚠️ Armazenamento quase cheio! Considere remover vídeos antigos.');
        }
      }
    }catch(e){
      console.error('Error getting storage estimate:', e);
    }
  }

  // Modal functions
  function openModal(title, content){
    if(!modalBackdrop) return;
    modalBackdrop.style.display = 'flex';
    modalBackdrop.setAttribute('aria-hidden', 'false');
    modalBody.innerHTML = `
      <h3 style="margin:0 0 16px 0;font-size:24px;text-align:center">${title}</h3>
      <div>${content}</div>
    `;
  }

  function closeModal(){
    if(!modalBackdrop) return;
    modalBackdrop.style.display = 'none';
    modalBackdrop.setAttribute('aria-hidden', 'true');
    modalBody.innerHTML = '';
  }

  if(modalBackdrop){
    modalBackdrop.addEventListener('click', e => {
      if(e.target === modalBackdrop) closeModal();
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

  // Helper function to convert file to base64
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  // Expor funções de debug globalmente
  window.testPreview = function(testUrl){
    console.log('🧪 Testando pré-visualização com URL:', testUrl);
    const urlInput = document.getElementById('videoUrl');
    const preview = document.getElementById('videoPreview');
    const container = document.getElementById('videoPreviewContainer');
    
    if(urlInput && preview && container){
      urlInput.value = testUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      
      // Extrai ID
      const id = extractYouTubeId(urlInput.value);
      if(id){
        preview.style.display = 'block';
        container.innerHTML = `
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/${id}?rel=0" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen
            style="border-radius:12px;border:none;">
          </iframe>
        `;
        console.log('✅ Pré-visualização atualizada! ID:', id);
      } else {
        console.error('❌ Não foi possível extrair ID da URL');
      }
    } else {
      console.error('❌ Elementos não encontrados!');
    }
  };
  
  window.testYouTubeId = function(url){
    const id = extractYouTubeId(url);
    console.log('📝 URL:', url);
    console.log('🎯 ID extraído:', id);
    return id;
  };

  // Initialize everything when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already loaded
    init();
  }
  
  // Expor para debug
  window.uploadDebug = {
    getElements,
    updateVideoPreview,
    extractYouTubeId,
    testPreview: window.testPreview,
    testYouTubeId: window.testYouTubeId
  };
  
  console.log('📦 Upload.js carregado. Use window.uploadDebug para debug');
})();
