// saved.js - Página de vídeos salvos
(function(){
  // Elements
  const savedContent = document.getElementById('savedContent');
  const savedEmpty = document.getElementById('savedEmpty');
  const savedEmptySearch = document.getElementById('savedEmptySearch');
  const searchInput = document.getElementById('searchSavedInput');
  const sortSelect = document.getElementById('sortSavedSelect');
  const themeToggle = document.getElementById('themeToggle');
  const goToLessons = document.getElementById('goToLessons');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalBody = document.getElementById('modalBody');
  const closeModalBtn = document.getElementById('closeModalBtn');

  // State
  let allSavedVideos = [];
  let currentFilter = 'all';
  let currentSearch = '';
  let currentSort = 'recent';

  // Module data
  const moduleData = {
    beginner: { title: 'Nível Bronze', icon: '🥉', color: '#cd7f32' },
    intermediate: { title: 'Nível Prata', icon: '🥈', color: '#c0c0c0' },
    advanced: { title: 'Nível Ouro', icon: '🥇', color: '#ffd700' }
  };

  const instrumentNames = {
    guitar: 'Guitarra',
    bass: 'Baixo',
    drums: 'Bateria',
    keyboard: 'Teclado'
  };

  // Initialize
  function init(){
    // Verificar se usuário está logado
    checkUserAuth();
    initThemeToggle();
    loadSavedVideos();
    setupEventListeners();
    displayUserInfo();
  }

  // Verificar autenticação
  function checkUserAuth(){
    const session = localStorage.getItem('ns-session');
    if(!session){
      // Redirecionar para login se não estiver logado
      alert('⚠️ Você precisa estar logado para acessar seus vídeos salvos!');
      window.location.href = 'login.html';
      return;
    }

    try {
      const user = JSON.parse(session);
      if(!user || !user.email){
        alert('⚠️ Sessão inválida. Por favor, faça login novamente.');
        window.location.href = 'login.html';
      }
    } catch(error){
      console.error('Erro ao verificar sessão:', error);
      alert('⚠️ Erro ao verificar autenticação. Por favor, faça login novamente.');
      window.location.href = 'login.html';
    }
  }

  // Exibir informações do usuário
  function displayUserInfo(){
    const user = window.SavedVideos.getCurrentUserInfo();
    if(user){
      console.log(`👤 Usuário logado: ${user.name} (${user.email})`);
      console.log(`📁 Salvos carregados da conta: ${user.email}`);
    }
  }

  // Load saved videos
  function loadSavedVideos(){
    if(!window.SavedVideos){
      console.error('SavedVideos API não carregada');
      return;
    }

    allSavedVideos = window.SavedVideos.getSavedVideos();
    console.log('📹 Vídeos salvos carregados:', allSavedVideos.length);

    updateStatistics();
    updateFilterCounts();
    renderVideos();
  }

  // Update statistics
  function updateStatistics(){
    const stats = window.SavedVideos.getStatistics();
    
    document.getElementById('totalSavedVideos').textContent = stats.totalVideos;
    document.getElementById('totalSavedLessons').textContent = stats.totalLessons;
    document.getElementById('totalInstruments').textContent = stats.totalInstruments;
  }

  // Update filter counts
  function updateFilterCounts(){
    const stats = window.SavedVideos.getStatistics();
    
    // Update folder counts if elements exist
    const folderCountAll = document.getElementById('folderCountAll');
    if(folderCountAll) folderCountAll.textContent = stats.totalVideos;
  }

  // Render videos
  function renderVideos(){
    if(allSavedVideos.length === 0){
      savedEmpty.style.display = 'flex';
      savedContent.style.display = 'none';
      savedEmptySearch.style.display = 'none';
      return;
    }

    // Filter videos
    let filteredVideos = [...allSavedVideos];

    // Filter by instrument
    if(currentFilter !== 'all'){
      filteredVideos = filteredVideos.filter(v => (v.instrument || 'guitar') === currentFilter);
    }

    // Filter by search
    if(currentSearch){
      filteredVideos = filteredVideos.filter(v => 
        v.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
        (v.lessonTitle && v.lessonTitle.toLowerCase().includes(currentSearch.toLowerCase())) ||
        (v.description && v.description.toLowerCase().includes(currentSearch.toLowerCase()))
      );
    }

    // Sort videos
    filteredVideos = sortVideos(filteredVideos);

    // Check if empty after filters
    if(filteredVideos.length === 0){
      savedEmpty.style.display = 'none';
      savedContent.style.display = 'none';
      savedEmptySearch.style.display = 'flex';
      return;
    }

    savedEmpty.style.display = 'none';
    savedEmptySearch.style.display = 'none';
    savedContent.style.display = 'block';

    // Group by lesson
    const groupedVideos = groupVideosByLesson(filteredVideos);

    // Render
    savedContent.innerHTML = groupedVideos.map(group => `
      <div class="saved-lesson-group-pro">
        <div class="saved-lesson-header">
          <div class="saved-lesson-info">
            <div class="saved-lesson-badge">
              <span class="saved-lesson-icon">${getInstrumentIcon(group.instrument)}</span>
              <span class="saved-lesson-instrument">${instrumentNames[group.instrument] || 'Guitarra'}</span>
            </div>
            <h3 class="saved-lesson-title">${group.lessonTitle}</h3>
            <div class="saved-lesson-meta">
              <span class="saved-lesson-count">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                ${group.videos.length} ${group.videos.length === 1 ? 'vídeo' : 'vídeos'}
              </span>
              <span class="saved-lesson-level">
                ${moduleData[group.level || 'beginner'].icon}
                ${moduleData[group.level || 'beginner'].title}
              </span>
            </div>
          </div>
        </div>

        <div class="saved-videos-grid-pro">
          ${group.videos.map(video => renderVideoCard(video)).join('')}
        </div>
      </div>
    `).join('');

    // Add event listeners
    addVideoCardListeners();
  }

  // Group videos by lesson
  function groupVideosByLesson(videos){
    const grouped = {};

    videos.forEach(video => {
      const key = video.lessonId || 'unknown';
      if(!grouped[key]){
        grouped[key] = {
          lessonId: video.lessonId,
          lessonTitle: video.lessonTitle || 'Aula sem título',
          instrument: video.instrument || 'guitar',
          level: video.level || 'beginner',
          videos: []
        };
      }
      grouped[key].videos.push(video);
    });

    return Object.values(grouped);
  }

  // Render video card
  function renderVideoCard(video){
    const savedDate = new Date(video.savedAt);
    const formattedDate = formatSavedDate(savedDate);

    // Get real views
    let realViews = video.views || 0;
    if(window.VideoViews && video.id){
      const stats = window.VideoViews.getVideoViewStats(video.id);
      if(stats.totalViews > 0){
        realViews = stats.totalViews;
      }
    }

    return `
      <div class="saved-video-card-pro" data-video-id="${video.id}">
        <div class="saved-video-thumbnail-pro">
          ${video.videoId ? `
            <img src="https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg" 
                 alt="${video.title}"
                 onerror="this.parentElement.innerHTML='<div class=\\'thumbnail-placeholder\\'>${video.thumbnail || '🎸'}</div>'">
          ` : `
            <div class="thumbnail-placeholder">${video.thumbnail || '🎸'}</div>
          `}
          <div class="saved-video-duration">${video.duration || '0:00'}</div>
          <button class="saved-video-unsave" data-video-id="${video.id}" title="Remover dos salvos">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
        </div>

        <div class="saved-video-content-pro">
          <h4 class="saved-video-title-pro">${video.title}</h4>
          
          <div class="saved-video-meta">
            <span class="saved-video-author">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              ${video.author}
            </span>
            <span class="saved-video-views">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              ${formatViews(realViews)}
            </span>
          </div>

          <div class="saved-video-date">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Salvo ${formattedDate}
          </div>

          <button class="saved-video-play-btn" data-video-id="${video.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>Assistir</span>
          </button>
        </div>
      </div>
    `;
  }

  // Add event listeners to video cards
  function addVideoCardListeners(){
    // Play buttons
    document.querySelectorAll('.saved-video-play-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const videoId = parseInt(btn.dataset.videoId);
        const video = allSavedVideos.find(v => v.id === videoId);
        if(video) openVideoModal(video);
      });
    });

    // Card click
    document.querySelectorAll('.saved-video-card-pro').forEach(card => {
      card.addEventListener('click', (e) => {
        if(e.target.closest('.saved-video-unsave')) return;
        const videoId = parseInt(card.dataset.videoId);
        const video = allSavedVideos.find(v => v.id === videoId);
        if(video) openVideoModal(video);
      });
    });

    // Unsave buttons
    document.querySelectorAll('.saved-video-unsave').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const videoId = parseInt(btn.dataset.videoId);
        unsaveVideo(videoId);
      });
    });
  }

  // Unsave video
  function unsaveVideo(videoId){
    if(!confirm('Deseja remover este vídeo dos salvos?')) return;

    const result = window.SavedVideos.unsaveVideo(videoId);
    
    if(result.success){
      showNotification('Vídeo removido dos salvos!', 'success');
      loadSavedVideos();
    } else {
      showNotification(result.message, 'error');
    }
  }

  // Sort videos
  function sortVideos(videos){
    switch(currentSort){
      case 'recent':
        return videos.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
      case 'oldest':
        return videos.sort((a, b) => new Date(a.savedAt) - new Date(b.savedAt));
      case 'lesson':
        return videos.sort((a, b) => (a.lessonId || 0) - (b.lessonId || 0));
      case 'title':
        return videos.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return videos;
    }
  }

  // Format views
  function formatViews(views){
    if(views >= 1000) return (views / 1000).toFixed(1) + 'k';
    return views.toString();
  }

  // Format saved date
  function formatSavedDate(date){
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if(diffMins < 1) return 'agora';
    if(diffMins < 60) return `há ${diffMins} min`;
    if(diffHours < 24) return `há ${diffHours}h`;
    if(diffDays < 7) return `há ${diffDays}d`;
    
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }

  // Get instrument icon
  function getInstrumentIcon(instrument){
    const icons = {
      guitar: '🎸',
      bass: '🎸',
      drums: '🥁',
      keyboard: '🎹'
    };
    return icons[instrument] || '🎸';
  }

  // Open video modal
  function openVideoModal(video){
    console.log('🎬 Abrindo modal do vídeo:', video.title);

    // Register view if VideoViews is available
    if(window.VideoViews && video.id){
      const viewResult = window.VideoViews.registerView(video.id);
      console.log('📹 View result:', viewResult);
    }

    modalBackdrop.style.display = 'flex';
    modalBackdrop.setAttribute('aria-hidden', 'false');

    // Get module data
    const level = video.level || 'beginner';
    const modData = moduleData[level];

    // Build player
    let playerContent = '';
    if(video.uploadedVideo && video.uploadedVideo.url){
      playerContent = `
        <video 
          controls 
          autoplay
          style="width:100%;height:450px;border-radius:12px;background:#000;">
          <source src="${video.uploadedVideo.url}" type="${video.uploadedVideo.type || 'video/mp4'}">
          Seu navegador não suporta vídeo HTML5.
        </video>
      `;
    } else if(video.videoId){
      playerContent = `
        <iframe 
          width="100%" 
          height="450" 
          src="https://www.youtube.com/embed/${video.videoId}?rel=0&autoplay=1" 
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
          <p class="video-player-text">Player de vídeo</p>
        </div>
      `;
    }

    modalBody.innerHTML = `
      <div class="video-modal-layout">
        <div class="video-modal-left">
          <div class="video-modal-player">${playerContent}</div>
          
          <h2 class="video-modal-title">${video.title}</h2>
          
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
              <span class="info-icon">${modData.icon}</span>
              <div class="info-content">
                <span class="info-label">Módulo</span>
                <span class="info-value">${modData.title}</span>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">📚</span>
              <div class="info-content">
                <span class="info-label">Aula</span>
                <span class="info-value">${video.lessonTitle || 'N/A'}</span>
              </div>
            </div>
          </div>

          <button class="btn-remove-saved" onclick="removeFromModalAndReload(${video.id})">
            <span>✕</span>
            <span>Remover dos Salvos</span>
          </button>
        </div>
      </div>
    `;
  }

  // Remove from modal and reload
  window.removeFromModalAndReload = function(videoId){
    if(!confirm('Deseja remover este vídeo dos salvos?')) return;

    const result = window.SavedVideos.unsaveVideo(videoId);
    
    if(result.success){
      modalBackdrop.style.display = 'none';
      showNotification('Vídeo removido dos salvos!', 'success');
      loadSavedVideos();
    } else {
      showNotification(result.message, 'error');
    }
  };

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
  }

  // Setup event listeners
  function setupEventListeners(){
    // Initialize sidebar
    initSidebar();

    // Go to lessons button
    if(goToLessons){
      goToLessons.addEventListener('click', () => {
        window.location.href = 'lessons.html';
      });
    }

    // Search
    if(searchInput){
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim();
        renderVideos();
      });
    }

    // Sort
    if(sortSelect){
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderVideos();
      });
    }

    // Instrument filter dropdown
    const instrumentFilter = document.getElementById('instrumentFilter');
    if(instrumentFilter){
      instrumentFilter.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        renderVideos();
      });
    }

    // Folder filter buttons
    document.querySelectorAll('.folder-item').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.folder-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const folder = btn.dataset.folder;
        if(folder === 'all'){
          currentFilter = 'all';
          renderVideos();
        }
      });
    });

    // Close modal
    if(closeModalBtn){
      closeModalBtn.addEventListener('click', () => {
        modalBackdrop.style.display = 'none';
      });
    }

    if(modalBackdrop){
      modalBackdrop.addEventListener('click', (e) => {
        if(e.target === modalBackdrop){
          modalBackdrop.style.display = 'none';
        }
      });
    }
  }

  // Theme toggle
  function initThemeToggle(){
    if(!themeToggle) return;

    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme){
    const icon = themeToggle.querySelector('.theme-icon');
    if(icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }

  // Show notification
  function showNotification(message, type = 'success'){
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Initialize
  init();
})();
