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

  // Elements
  const uploadForm = document.getElementById('uploadVideoForm');
  const btnYouTube = document.getElementById('btnYouTube');
  const btnFileUpload = document.getElementById('btnFileUpload');
  const youtubeSection = document.getElementById('youtubeSection');
  const fileSection = document.getElementById('fileSection');
  const videoUrl = document.getElementById('videoUrl');
  const videoPreview = document.getElementById('videoPreview');
  const videoPreviewContainer = document.getElementById('videoPreviewContainer');
  const videoFile = document.getElementById('videoFile');
  const fileUploadArea = document.getElementById('fileUploadArea');
  const fileInfo = document.getElementById('fileInfo');
  const fileName = document.getElementById('fileName');
  const fileSize = document.getElementById('fileSize');
  const removeFile = document.getElementById('removeFile');
  const instrumentSelect = document.getElementById('videoInstrument');
  const moduleSelect = document.getElementById('videoModule');
  const lessonSelect = document.getElementById('videoLesson');
  const cancelBtn = document.getElementById('cancelBtn');
  const backToApp = document.getElementById('backToApp');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalBody = document.getElementById('modalBody');

  let currentUploadType = 'youtube';
  let selectedFile = null;
  let dbInitialized = false;

  // Initialize
  async function init(){
    // Initialize IndexedDB
    try{
      await VideoStorage.init();
      dbInitialized = true;
      console.log('IndexedDB initialized successfully');
    }catch(e){
      console.error('Failed to initialize IndexedDB:', e);
      dbInitialized = false;
    }
    
    setupUploadTypeSelector();
    setupFileUpload();
    setupFormSelects();
    setupVideoUrlPreview();
    setupFormSubmit();
    setupCancelButton();
    updateStats();
    initThemeToggle();
    showStorageInfo();
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
  }

  function formatFileSize(bytes){
    if(bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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
    
    if(!selectedInstrument || !selectedModule || !lessonSelect) return;
    
    lessonSelect.disabled = false;
    lessonSelect.innerHTML = '<option value="">Selecione uma aula</option>';
    
    const moduleMap = {
      'bronze': 'beginner',
      'silver': 'intermediate',
      'gold': 'advanced'
    };
    
    const levelKey = moduleMap[selectedModule];
    const lessonsList = lessonsStructure[selectedInstrument]?.[levelKey] || [];
    
    if(lessonsList.length === 0){
      lessonSelect.innerHTML = '<option value="">Nenhuma aula disponível para este nível</option>';
      lessonSelect.disabled = true;
      return;
    }
    
    lessonsList.forEach(lesson => {
      const option = document.createElement('option');
      option.value = lesson.id;
      option.textContent = lesson.title;
      lessonSelect.appendChild(option);
    });
  }

  // Video URL preview
  function setupVideoUrlPreview(){
    if(!videoUrl) return;
    
    let previewTimeout;
    videoUrl.addEventListener('input', () => {
      clearTimeout(previewTimeout);
      previewTimeout = setTimeout(updateVideoPreview, 500);
    });
  }

  function updateVideoPreview(){
    const url = videoUrl?.value?.trim();
    if(!url || !videoPreview || !videoPreviewContainer) return;
    
    const videoId = extractYouTubeId(url);
    
    if(videoId){
      videoPreview.style.display = 'block';
      videoPreviewContainer.innerHTML = `
        <iframe 
          width="100%" 
          height="100%" 
          src="https://www.youtube.com/embed/${videoId}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
          style="border-radius:12px">
        </iframe>
      `;
    } else {
      videoPreview.style.display = 'none';
      videoPreviewContainer.innerHTML = '';
    }
  }

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
      
      // Validate required fields
      if(!formData.title || !formData.duration || !formData.author || 
         !formData.instrument || !formData.module || !formData.lesson){
        openModal('❌ Campos Obrigatórios', 
          '<p>Por favor, preencha todos os campos marcados com <span style="color:#ef4444">*</span></p>');
        return;
      }
      
      // Validate duration format
      if(!/^[0-9]+:[0-9]{2}$/.test(formData.duration)){
        openModal('❌ Formato de Duração Inválido', 
          '<p>Por favor, use o formato minutos:segundos (ex: 8:45)</p>');
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
      // Create new video object
      const newVideo = {
        title: videoData.title,
        description: videoData.description,
        duration: videoData.duration,
        author: videoData.author,
        instrument: videoData.instrument,
        module: videoData.module,
        lesson: videoData.lesson,
        uploadedAt: new Date().toISOString(),
        uploadType: videoData.uploadType,
        views: 0,
        postedDate: new Date().toISOString()
      };
      
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
    
    if(backToApp){
      backToApp.addEventListener('click', () => {
        window.location.href = 'app.html';
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
    const themeText = themeToggle?.querySelector('.theme-text');
    
    if(themeIcon){
      themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
    
    if(themeText){
      themeText.textContent = theme === 'dark' ? 'Modo Escuro' : 'Modo Claro';
    }
  }

  // Initialize everything
  init();
})();
