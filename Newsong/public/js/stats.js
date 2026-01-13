// stats.js - Statistics page for teachers
(function() {
  console.log('📊 Stats page loaded');

  // Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  
  function updateTheme() {
    const currentTheme = body.getAttribute('data-theme');
    const icon = themeToggle.querySelector('.theme-icon');
    icon.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateTheme();
    });
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateTheme();
  }

  // Sidebar and Navigation
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

  // Hide teacher-only buttons for students (stats is teacher-only so won't happen)
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

  // Check authentication and teacher access
  function checkAuth() {
    const sessionData = localStorage.getItem('ns-session');
    if (!sessionData) {
      window.location.href = 'login.html';
      return null;
    }
    
    const session = JSON.parse(sessionData);
    
    // Check if user is a teacher
    if (session.role !== 'teacher') {
      alert('Esta página é exclusiva para professores.');
      window.location.href = 'app.html';
      return null;
    }
    
    return session;
  }

  const session = checkAuth();
  if (!session) return;

  // Generate statistics from videos array
  function generateStatisticsFromVideos(videos) {
    
    // Calculate statistics with REAL view data from VideoViews system
    const totalVideos = videos.length;
    
    // Get real views from VideoViews system
    let totalViews = 0;
    let totalLikes = 0;
    let totalDislikes = 0;
    let totalCompletions = 0;
    
    videos.forEach(v => {
      // Real views
      if (window.VideoViews) {
        const viewStats = window.VideoViews.getVideoViewStats(v.id);
        totalViews += viewStats.totalViews || 0;
      }
      
      // Real likes/dislikes
      if (window.VideoUnified) {
        const likeStats = window.VideoUnified.getVideoStats(v.id);
        totalLikes += likeStats.likes || 0;
        totalDislikes += likeStats.dislikes || 0;
      }
      
      // Real completions
      if (window.UserProgress) {
        const completions = window.UserProgress.getVideoCompletions(v.id);
        totalCompletions += completions;
        
        console.log(`📊 Vídeo ${v.id} - "${v.title}":`, {
          views: window.VideoViews ? window.VideoViews.getVideoViewStats(v.id).totalViews : 0,
          likes: window.VideoUnified ? window.VideoUnified.getVideoStats(v.id).likes : 0,
          completions: completions
        });
      }
    });
    
    // Get real ratings from TeacherRatingSystem
    let totalRatings = 0;
    let avgRating = 0;
    
    if (window.TeacherRatingSystem) {
      // TeacherRatingSystem usa o NOME do professor, não email
      const teacherStats = window.TeacherRatingSystem.getTeacherStats(session.name);
      totalRatings = teacherStats.totalRatings || 0;
      avgRating = teacherStats.avgRating || 0;
    }
    
    // Calculate students (unique viewers from VideoViews)
    let totalStudents = 0;
    if (window.VideoViews) {
      const uniqueViewers = new Set();
      videos.forEach(v => {
        const viewStats = window.VideoViews.getVideoViewStats(v.id);
        // VideoViews doesn't track individual users, so estimate
        totalStudents += viewStats.uniqueViewers || 0;
      });
    }
    
    // Calculate completion rate (real data)
    const completionRate = totalViews > 0 ? Math.floor((totalCompletions / totalViews) * 100) : 0;
    
    // Calculate engagement rate (real data based on likes and views)
    const engagementRate = totalViews > 0 ? Math.floor((totalLikes / totalViews) * 100) : 0;
    
    // This month videos
    const now = new Date();
    const thisMonth = videos.filter(v => {
      const videoDate = new Date(v.uploadDate || now);
      return videoDate.getMonth() === now.getMonth() && 
             videoDate.getFullYear() === now.getFullYear();
    }).length;
    
    // Last month videos
    const lastMonth = videos.filter(v => {
      const videoDate = new Date(v.uploadDate || now);
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
      return videoDate.getMonth() === lastMonthDate.getMonth() && 
             videoDate.getFullYear() === lastMonthDate.getFullYear();
    }).length;
    
    // This week views (real data from videos uploaded this week)
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeekVideos = videos.filter(v => {
      const videoDate = new Date(v.uploadDate || now);
      return videoDate >= oneWeekAgo;
    });
    
    let viewsThisWeek = 0;
    if (window.VideoViews) {
      thisWeekVideos.forEach(v => {
        const stats = window.VideoViews.getVideoViewStats(v.id);
        viewsThisWeek += stats.totalViews || 0;
      });
    }
    
    // Average views per video
    const avgViewsPerVideo = totalVideos > 0 ? Math.floor(totalViews / totalVideos) : 0;
    
    return {
      totalVideos,
      totalViews,
      totalRatings,
      avgRating: avgRating.toFixed(1),
      totalStudents,
      completionRate,
      engagementRate,
      thisMonth,
      lastMonth,
      viewsThisWeek,
      avgViewsPerVideo,
      satisfaction: avgRating > 0 ? Math.floor((avgRating / 5) * 100) : 0
    };
  }

  // Migrar vídeos antigos que não têm teacherEmail
  async function migrateOldVideos() {
    try {
      console.log('🔄 Iniciando migração de vídeos antigos...');
      const allVideos = await window.VideoStorage.getAllVideos();
      let migrated = 0;
      
      for(const video of allVideos) {
        if(!video.teacherEmail && video.author) {
          // Tentar associar pelo nome do autor
          if(video.author === session.name) {
            console.log(`📝 Migrando vídeo: ${video.title}`);
            video.teacherEmail = session.email;
            
            // Atualizar no banco
            await window.VideoStorage.update(video.id, video);
            migrated++;
          }
        }
      }
      
      if(migrated > 0) {
        console.log(`✅ ${migrated} vídeo(s) migrado(s) com sucesso!`);
      } else {
        console.log('ℹ️ Nenhum vídeo precisou ser migrado');
      }
      
      return migrated;
    } catch(error) {
      console.error('❌ Erro na migração:', error);
      return 0;
    }
  }

  // Get teacher's videos
  function getTeacherVideos() {
    // Try to get from VideoStorage API first (IndexedDB)
    if(window.VideoStorage && typeof window.VideoStorage.getAllVideos === 'function') {
      // VideoStorage returns a promise
      return []; // Placeholder - will be loaded async
    }
    
    // Fallback to localStorage
    const videos = JSON.parse(localStorage.getItem('uploadedVideos') || '[]');
    const teacherVideos = videos.filter(v => v.teacherEmail === session.email);
    
    console.log(`📹 Vídeos do professor ${session.email}:`, teacherVideos.length);
    return teacherVideos;
  }

  // Load teacher videos from IndexedDB (async)
  async function loadTeacherVideosAsync() {
    if(!window.VideoStorage || typeof window.VideoStorage.getAllVideos !== 'function') {
      console.log('📦 VideoStorage não disponível, usando localStorage');
      return getTeacherVideos(); // Fallback to localStorage
    }

    try {
      console.log('📂 Carregando vídeos do IndexedDB...');
      const allVideos = await window.VideoStorage.getAllVideos();
      console.log('📹 Total de vídeos no banco:', allVideos.length);
      console.log('👤 Email do professor atual:', session.email);
      
      // Debug: mostrar emails dos vídeos
      if(allVideos.length > 0) {
        console.log('📧 Emails nos vídeos:', allVideos.map(v => v.teacherEmail || 'SEM EMAIL'));
      }
      
      const teacherVideos = allVideos.filter(v => v.teacherEmail === session.email);
      console.log(`✅ Vídeos filtrados do professor ${session.email}:`, teacherVideos.length);
      
      if(teacherVideos.length === 0 && allVideos.length > 0) {
        console.warn('⚠️ ATENÇÃO: Existem vídeos no banco mas nenhum está associado ao seu email!');
        console.warn('Possível causa: Vídeos foram enviados sem o campo teacherEmail');
      }
      
      return teacherVideos;
    } catch(error) {
      console.error('❌ Erro ao carregar vídeos do IndexedDB:', error);
      return getTeacherVideos(); // Fallback to localStorage
    }
  }

  // Load statistics (async)
  async function loadStatistics() {
    console.log('📊 Carregando estatísticas...');
    
    // Usar sistema unificado se disponível
    let videos = [];
    
    if (window.VideoUnified && window.VideoUnified.getTeacherVideoStats) {
      console.log('🎯 Usando sistema unificado de vídeos');
      videos = await window.VideoUnified.getTeacherVideoStats(session.email);
      console.log(`✅ ${videos.length} vídeos carregados com estatísticas unificadas`);
    } else {
      console.log('⚠️ Sistema unificado não disponível, usando método tradicional');
      videos = await loadTeacherVideosAsync();
      
      // Adicionar estatísticas manualmente
      videos = videos.map(video => {
        const stats = window.VideoUnified ? 
          window.VideoUnified.getVideoStats(video.id) : 
          { likes: video.likes || 0, dislikes: video.dislikes || 0, views: video.views || 0 };
        
        return {
          ...video,
          likes: stats.likes,
          dislikes: stats.dislikes,
          views: stats.views
        };
      });
    }
    
    // Se não houver vídeos, tentar migração
    if(videos.length === 0 && window.VideoStorage) {
      console.log('🔄 Tentando migrar vídeos antigos...');
      await migrateOldVideos();
      // Recarregar após migração
      if (window.VideoUnified && window.VideoUnified.getTeacherVideoStats) {
        videos = await window.VideoUnified.getTeacherVideoStats(session.email);
      } else {
        videos = await loadTeacherVideosAsync();
      }
      
      if(videos.length > 0) {
        console.log('✅ Migração bem-sucedida!');
      }
    }
    
    console.log('📹 Total de vídeos para estatísticas:', videos.length);
    
    const stats = generateStatisticsFromVideos(videos);
    
    // Update overview cards
    document.getElementById('totalVideos').textContent = stats.totalVideos;
    document.getElementById('videosThisMonth').textContent = stats.thisMonth;
    document.getElementById('videosLastMonth').textContent = stats.lastMonth;
    
    document.getElementById('totalViews').textContent = formatNumber(stats.totalViews);
    document.getElementById('viewsThisWeek').textContent = formatNumber(stats.viewsThisWeek);
    document.getElementById('avgViewsPerVideo').textContent = stats.avgViewsPerVideo;
    
    document.getElementById('avgRating').textContent = stats.avgRating;
    document.getElementById('totalRatings').textContent = formatNumber(stats.totalRatings);
    document.getElementById('satisfaction').textContent = stats.satisfaction + '%';
    
    document.getElementById('totalStudents').textContent = formatNumber(stats.totalStudents);
    document.getElementById('completionRate').textContent = stats.completionRate + '%';
    document.getElementById('engagementRate').textContent = stats.engagementRate + '%';
    
    // Update trends
    updateTrends(stats);
    
    // Animate numbers
    animateNumbers();
    
    // Load grid and table
    await loadVideosGrid();
    await loadTopLessonsTable();
  }

  // Update trend indicators
  function updateTrends(stats) {
    // Videos trend
    const trendVideos = document.getElementById('trendVideos');
    if(trendVideos) {
      const diff = stats.thisMonth - stats.lastMonth;
      const arrow = diff > 0 ? '↑' : diff < 0 ? '↓' : '→';
      const sign = diff > 0 ? '+' : '';
      trendVideos.innerHTML = `<span>${arrow}</span><span>${sign}${diff} este mês</span>`;
    }
    
    // Views trend (this week vs last week estimate)
    const trendViews = document.getElementById('trendViews');
    if(trendViews) {
      const percentChange = stats.totalViews > 0 ? Math.floor((stats.viewsThisWeek / stats.totalViews) * 100) : 0;
      const arrow = percentChange > 0 ? '↑' : '→';
      trendViews.innerHTML = `<span>${arrow}</span><span>+${percentChange}% vs. semana passada</span>`;
    }
    
    // Ratings trend
    const trendRatings = document.getElementById('trendRatings');
    if(trendRatings) {
      const arrow = stats.totalRatings > 0 ? '↑' : '→';
      trendRatings.innerHTML = `<span>${arrow}</span><span>+${stats.totalRatings} novas avaliações</span>`;
    }
    
    // Students trend
    const trendStudents = document.getElementById('trendStudents');
    if(trendStudents) {
      const arrow = stats.totalStudents > 0 ? '↑' : '→';
      trendStudents.innerHTML = `<span>${arrow}</span><span>+${stats.totalStudents} novos alunos</span>`;
    }
  }

  // Format large numbers
  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  // Animate number counters
  function animateNumbers() {
    const counters = document.querySelectorAll('.stat-card-value');
    
    counters.forEach(counter => {
      const target = counter.textContent.replace(/[^0-9.]/g, '');
      if (!target || isNaN(target)) return;
      
      const targetNum = parseFloat(target);
      const duration = 1500;
      const steps = 60;
      const increment = targetNum / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetNum) {
          counter.textContent = counter.textContent.replace(/[0-9.]+/, targetNum.toFixed(targetNum % 1 === 0 ? 0 : 1));
          clearInterval(timer);
        } else {
          counter.textContent = counter.textContent.replace(/[0-9.]+/, Math.floor(current).toString());
        }
      }, duration / steps);
    });
  }

  // Load videos grid (async)
  async function loadVideosGrid() {
    const videos = await loadTeacherVideosAsync();
    const videosGrid = document.getElementById('videosGrid');
    const emptyState = document.getElementById('emptyVideosState');
    
    if (videos.length === 0) {
      videosGrid.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }
    
    videosGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    // Add stats with REAL view data from VideoViews
    const videosWithStats = videos.map(v => {
      let realViews = 0;
      let uniqueViewers = 0;
      let realLikes = 0;
      let realDislikes = 0;
      let realCompletions = 0;
      
      // Get real views if VideoViews is available
      if (window.VideoViews) {
        const stats = window.VideoViews.getVideoViewStats(v.id);
        realViews = stats.totalViews || 0;
        uniqueViewers = stats.uniqueViewers || 0;
      }
      
      // Get real likes/dislikes from VideoUnified
      if (window.VideoUnified) {
        const likeStats = window.VideoUnified.getVideoStats(v.id);
        realLikes = likeStats.likes || 0;
        realDislikes = likeStats.dislikes || 0;
      }
      
      // Get real completions from UserProgress
      if (window.UserProgress) {
        realCompletions = window.UserProgress.getVideoCompletions(v.id);
      }
      
      console.log(`📹 ${v.title}:`, {
        views: realViews,
        likes: realLikes,
        dislikes: realDislikes,
        completions: realCompletions
      });
      
      return {
        ...v,
        views: realViews,
        likes: realLikes,
        dislikes: realDislikes,
        completions: realCompletions,
        uniqueViewers: uniqueViewers
      };
    }).sort((a, b) => b.views - a.views);
    
    videosGrid.innerHTML = videosWithStats.map(video => {
      const instrumentEmoji = getInstrumentEmoji(video.instrument);
      
      // Gerar thumbnail do vídeo real
      let thumbnailHTML = '';
      
      if (video.uploadType === 'youtube' && video.videoId) {
        // Thumbnail do YouTube
        thumbnailHTML = `
          <img src="https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg" 
               alt="${video.title}"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
               style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">
          <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 80px;">
            ${instrumentEmoji}
          </div>
        `;
      } else if (video.uploadType === 'file' && video.fileData) {
        // Player de vídeo para arquivos
        thumbnailHTML = `
          <video 
            src="${video.fileData}" 
            style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;"
            muted
            preload="metadata"
            onmouseover="this.play()"
            onmouseout="this.pause(); this.currentTime=0;">
          </video>
        `;
      } else if (video.url) {
        // Tentar extrair ID do YouTube da URL
        const youtubeMatch = video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        if (youtubeMatch) {
          const videoId = youtubeMatch[1];
          thumbnailHTML = `
            <img src="https://img.youtube.com/vi/${videoId}/mqdefault.jpg" 
                 alt="${video.title}"
                 style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">
          `;
        } else {
          // Fallback para emoji
          thumbnailHTML = `<div style="font-size: 80px; display: flex; align-items: center; justify-content: center; height: 100%;">${instrumentEmoji}</div>`;
        }
      } else {
        // Fallback para emoji
        thumbnailHTML = `<div style="font-size: 80px; display: flex; align-items: center; justify-content: center; height: 100%;">${instrumentEmoji}</div>`;
      }
      
      return `
        <div class="video-stat-card" onclick="openVideoPreview('${video.id}', '${(video.title || '').replace(/'/g, "\\'")}', '${video.uploadType}', '${video.videoId || ''}', '${(video.fileData || '').replace(/'/g, "\\'")}', '${video.url || ''}')">
          <div class="video-stat-thumbnail">
            ${thumbnailHTML}
            <div class="video-stat-duration">${video.duration || '0:00'}</div>
            <div class="video-play-overlay">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          <div class="video-stat-content">
            <h3 class="video-stat-title">${video.title}</h3>
            <div class="video-stat-meta">
              <div class="video-stat-meta-item">
                <span>🎸</span>
                <span>${formatInstrumentName(video.instrument)}</span>
              </div>
              <div class="video-stat-meta-item">
                <span>🏅</span>
                <span>${formatModuleName(video.module)}</span>
              </div>
            </div>
            <div class="video-stat-metrics">
              <div class="video-metric">
                <div class="video-metric-value">${formatNumber(video.views)}</div>
                <div class="video-metric-label">Views</div>
              </div>
              <div class="video-metric">
                <div class="video-metric-value">${video.likes}</div>
                <div class="video-metric-label">Likes</div>
              </div>
              <div class="video-metric">
                <div class="video-metric-value">${video.completions}</div>
                <div class="video-metric-label">Conclusões</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Load top performing lessons table (async)
  async function loadTopLessonsTable() {
    const videos = await loadTeacherVideosAsync();
    const table = document.getElementById('topLessonsTable');
    
    if (videos.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding:40px; color:var(--muted);">
            Nenhuma aula publicada ainda
          </td>
        </tr>
      `;
      return;
    }
    
    // Add stats with REAL views
    const videosWithStats = videos.map(v => {
      let realViews = 0;
      let realLikes = 0;
      let realCompletions = 0;
      let realRating = 0;
      
      // Get real views if VideoViews is available
      if (window.VideoViews) {
        const stats = window.VideoViews.getVideoViewStats(v.id);
        realViews = stats.totalViews || 0;
      }
      
      // Get real likes from VideoUnified
      if (window.VideoUnified) {
        const likeStats = window.VideoUnified.getVideoStats(v.id);
        realLikes = likeStats.likes || 0;
      }
      
      // Get real completions from UserProgress
      if (window.UserProgress) {
        realCompletions = window.UserProgress.getVideoCompletions(v.id);
      }
      
      // Get real rating from TeacherRatings
      if (window.TeacherRatingSystem) {
        // Precisa do nome do autor do vídeo, não do email
        const teacherName = v.author || session.name;
        const teacherStats = window.TeacherRatingSystem.getTeacherStats(teacherName);
        realRating = teacherStats.avgRating || 0;
      }
      
      return {
        ...v,
        views: realViews,
        completions: realCompletions,
        likes: realLikes,
        rating: realRating > 0 ? realRating.toFixed(1) : '0.0'
      };
    }).sort((a, b) => b.views - a.views).slice(0, 5);
    
    table.innerHTML = videosWithStats.map(video => {
      const completionRate = Math.floor((video.completions / video.views) * 100);
      const instrumentEmoji = getInstrumentEmoji(video.instrument);
      
      return `
        <tr>
          <td>
            <div class="lesson-title-cell">
              <div class="lesson-icon">${instrumentEmoji}</div>
              <div class="lesson-info">
                <h4>${video.title}</h4>
                <p>${formatInstrumentName(video.instrument)} • ${formatModuleName(video.module)}</p>
              </div>
            </div>
          </td>
          <td><strong>${formatNumber(video.views)}</strong></td>
          <td><strong>${video.completions}</strong></td>
          <td>
            <div style="display:flex; align-items:center; gap:12px;">
              <div class="progress-bar-mini" style="width:100px;">
                <div class="progress-bar-mini-fill" style="width:${completionRate}%"></div>
              </div>
              <span style="font-weight:700;">${completionRate}%</span>
            </div>
          </td>
          <td>
            <div class="badge-pill">
              ⭐ ${video.rating}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Helper functions
  function getInstrumentEmoji(instrument) {
    const emojis = {
      guitar: '🎸',
      drums: '🥁',
      keyboard: '🎹',
      viola: '🪕',
      bass: '🎸'
    };
    return emojis[instrument] || '🎵';
  }

  function formatInstrumentName(instrument) {
    const names = {
      guitar: 'Guitarra',
      drums: 'Bateria',
      keyboard: 'Piano',
      viola: 'Violão',
      bass: 'Baixo'
    };
    return names[instrument] || instrument;
  }

  function formatModuleName(module) {
    const names = {
      bronze: 'Bronze',
      silver: 'Prata',
      gold: 'Ouro'
    };
    return names[module] || module;
  }
  
  // Função para abrir preview do vídeo
  window.openVideoPreview = function(videoId, title, uploadType, youtubeId, fileData, url) {
    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'video-preview-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 20px;
    `;
    
    let playerHTML = '';
    
    if (uploadType === 'youtube' && youtubeId) {
      playerHTML = `
        <iframe 
          width="100%" 
          height="100%" 
          src="https://www.youtube.com/embed/${youtubeId}?autoplay=1" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
          style="border-radius: 12px;">
        </iframe>
      `;
    } else if (uploadType === 'file' && fileData) {
      playerHTML = `
        <video 
          width="100%" 
          height="100%" 
          controls 
          autoplay
          style="border-radius: 12px; max-height: 80vh;">
          <source src="${fileData}">
        </video>
      `;
    } else if (url) {
      const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      if (youtubeMatch) {
        playerHTML = `
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            style="border-radius: 12px;">
          </iframe>
        `;
      }
    }
    
    modal.innerHTML = `
      <div style="max-width: 1200px; width: 100%; background: #000; border-radius: 16px; overflow: hidden; border: 2px solid rgba(212,175,55,0.3);">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background: rgba(212,175,55,0.1); border-bottom: 1px solid rgba(212,175,55,0.3);">
          <h3 style="margin: 0; color: #d4af37; font-size: 20px;">${title}</h3>
          <button onclick="this.closest('.video-preview-modal').remove()" style="background: none; border: none; color: #fff; font-size: 28px; cursor: pointer; padding: 0; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='none'">×</button>
        </div>
        <div style="aspect-ratio: 16/9; background: #000;">
          ${playerHTML}
        </div>
      </div>
    `;
    
    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    // Fechar com ESC
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
    
    document.body.appendChild(modal);
  };

  // Filter buttons
  const filterButtons = document.querySelectorAll('.stats-filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      // In a real app, this would filter the videos
      console.log('Filter:', filter);
    });
  });

  // Adicionar listener para atualização em tempo real
  window.addEventListener('videoLikeChanged', (e) => {
    console.log('🔄 Evento de like detectado, recarregando estatísticas...');
    setTimeout(() => loadStatistics(), 500);
  });
  
  window.addEventListener('lessonCompleted', (e) => {
    console.log('🔄 Aula concluída detectada, recarregando estatísticas...');
    setTimeout(() => loadStatistics(), 500);
  });
  
  // Recarregar a cada 30 segundos para pegar novas interações
  setInterval(() => {
    console.log('🔄 Atualização automática de estatísticas...');
    loadStatistics();
  }, 30000);

  // Initialize page (async)
  (async function init() {
    console.log('📊 Inicializando página de estatísticas...');
    
    // Inicializar IndexedDB primeiro
    if(window.VideoStorage && typeof window.VideoStorage.init === 'function') {
      try {
        console.log('🗄️ Inicializando IndexedDB...');
        await window.VideoStorage.init();
        console.log('✅ IndexedDB inicializado com sucesso');
      } catch(error) {
        console.error('❌ Erro ao inicializar IndexedDB:', error);
      }
    } else {
      console.warn('⚠️ VideoStorage não disponível');
    }
    
    // Carregar estatísticas
    await loadStatistics();
    console.log('✅ Stats page initialized');
    
    // Adicionar listener para atualizações em tempo real
    if(window.VideoUnified) {
      window.addEventListener('videoLikeChanged', async (e) => {
        console.log('🔄 Atualização detectada em stats.js:', e.detail);
        // Recarregar estatísticas
        await loadStatistics();
      });
      
      console.log('✅ VideoUnified: Listener de eventos em tempo real ativado em stats');
    }
  })();
})();
