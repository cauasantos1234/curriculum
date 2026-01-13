// profile.js - Gerenciamento da página de perfil
(function(){
  // Função para aguardar o UserProgress carregar
  function waitForUserProgress(callback, maxAttempts = 50){
    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      if(window.UserProgress){
        clearInterval(checkInterval);
        console.log('UserProgress API carregada com sucesso!');
        callback();
      } else if(attempts >= maxAttempts){
        clearInterval(checkInterval);
        console.error('UserProgress API não carregada após múltiplas tentativas!');
        alert('Sistema de progresso não está disponível. Por favor, recarregue a página.');
      }
    }, 100);
  }

  // Função principal que será executada após UserProgress carregar
  function initProfile(){
    // Verificar se está visualizando perfil de outro usuário
    const urlParams = new URLSearchParams(window.location.search);
    const viewingUser = urlParams.get('user'); // Nome do usuário a ser visualizado
    const isViewMode = !!viewingUser; // true se está visualizando perfil de outro usuário
    
    // Buscar informações do usuário logado da sessão
    const session = JSON.parse(localStorage.getItem('ns-session') || '{}');
    
    // Verificar se há usuário autenticado
    if(!isViewMode && !session.email){
      console.error('Usuário não autenticado!');
      alert('Você precisa estar logado para acessar o perfil.');
      window.location.href = 'login.html';
      return;
    }
    
    // Garantir que o usuário tenha progresso inicializado
    if(!isViewMode && window.UserProgress && window.UserProgress.ensureUserProgress){
      window.UserProgress.ensureUserProgress();
      console.log('Progresso do usuário verificado e inicializado se necessário');
    }
    
  let userInfo;
  
  if(isViewMode){
    // Está visualizando perfil de outro usuário (professor)
    userInfo = {
      name: viewingUser,
      email: `${viewingUser.toLowerCase().replace(/\s+/g, '.')}@newsong.com`,
      role: 'teacher', // Assumindo que é um professor
      phone: '(11) 98765-4321',
      location: 'São Paulo, SP',
      birthdate: '15/03/1995',
      level: 'Professor',
      instruments: ['guitar', 'keyboard'],
      joinDate: '2024-01-15'
    };
  } else {
    // Está visualizando seu próprio perfil
    userInfo = {
      name: session.name || 'Usuário',
      email: session.email || 'usuario@exemplo.com',
      role: session.role || 'student', // 'student' ou 'teacher'
      phone: '(11) 98765-4321',
      location: 'São Paulo, SP',
      birthdate: '15/03/1995',
      level: 'Iniciante',
      instruments: ['guitar', 'keyboard'],
      joinDate: '2024-01-15'
    };
  }

  // Metas disponíveis para ALUNOS
  const STUDENT_GOALS = [
    {
      id: 'daily_study',
      icon: '✅',
      title: 'Estudar 30 min por dia',
      type: 'daily',
      target: 7,
      unit: 'dias',
      description: 'Prática diária de 30 minutos'
    },
    {
      id: 'weekly_study',
      icon: '📅',
      title: 'Estudar 3x por semana',
      type: 'weekly',
      target: 3,
      unit: 'dias/semana',
      description: 'Pelo menos 3 sessões de estudo por semana'
    },
    {
      id: 'complete_module',
      icon: '📚',
      title: 'Completar Módulo Iniciante',
      type: 'lessons',
      target: 20,
      unit: 'aulas',
      description: 'Concluir todas as aulas do módulo iniciante'
    },
    {
      id: 'learn_songs',
      icon: '🎸',
      title: 'Aprender 5 músicas',
      type: 'songs',
      target: 5,
      unit: 'músicas',
      description: 'Dominar 5 músicas completas'
    },
    {
      id: 'practice_time',
      icon: '⏱️',
      title: 'Acumular 10h de prática',
      type: 'time',
      target: 600,
      unit: 'minutos',
      description: 'Total de 10 horas de prática'
    },
    {
      id: 'streak_30',
      icon: '🔥',
      title: 'Manter sequência de 30 dias',
      type: 'streak',
      target: 30,
      unit: 'dias',
      description: 'Estudar por 30 dias consecutivos'
    },
    {
      id: 'master_technique',
      icon: '🎼',
      title: 'Dominar 10 técnicas',
      type: 'techniques',
      target: 10,
      unit: 'técnicas',
      description: 'Aprender e dominar 10 técnicas musicais'
    },
    {
      id: 'practice_scales',
      icon: '🎹',
      title: 'Praticar escalas diariamente',
      type: 'daily',
      target: 14,
      unit: 'dias',
      description: 'Praticar escalas por 14 dias seguidos'
    },
    {
      id: 'watch_tutorials',
      icon: '📺',
      title: 'Assistir 15 vídeo-aulas',
      type: 'lessons',
      target: 15,
      unit: 'vídeos',
      description: 'Completar 15 vídeo-aulas completas'
    },
    {
      id: 'record_practice',
      icon: '🎤',
      title: 'Gravar 5 práticas',
      type: 'recordings',
      target: 5,
      unit: 'gravações',
      description: 'Gravar e revisar 5 sessões de prática'
    },
    {
      id: 'learn_theory',
      icon: '📖',
      title: 'Estudar teoria musical',
      type: 'theory',
      target: 10,
      unit: 'lições',
      description: 'Completar 10 lições de teoria musical'
    }
  ];

  // Metas disponíveis para PROFESSORES
  const TEACHER_GOALS = [
    {
      id: 'upload_videos',
      icon: '🎥',
      title: 'Enviar 10 vídeo-aulas',
      type: 'uploads',
      target: 10,
      unit: 'vídeos',
      description: 'Contribuir com conteúdo de qualidade'
    },
    {
      id: 'reach_views',
      icon: '👁️',
      title: 'Alcançar 1000 visualizações',
      type: 'views',
      target: 1000,
      unit: 'views',
      description: 'Suas aulas sendo assistidas'
    },
    {
      id: 'student_engagement',
      icon: '💬',
      title: 'Responder 50 comentários',
      type: 'comments',
      target: 50,
      unit: 'respostas',
      description: 'Interagir com seus alunos'
    },
    {
      id: 'weekly_content',
      icon: '📅',
      title: 'Postar 1 vídeo por semana',
      type: 'weekly_upload',
      target: 4,
      unit: 'semanas',
      description: 'Manter um cronograma regular de postagens'
    },
    {
      id: 'quality_rating',
      icon: '⭐',
      title: 'Manter nota média 4.5+',
      type: 'rating',
      target: 45,
      unit: 'pontos',
      description: 'Receber avaliações positivas'
    },
    {
      id: 'help_students',
      icon: '🎯',
      title: 'Ajudar 100 alunos',
      type: 'students_helped',
      target: 100,
      unit: 'alunos',
      description: 'Impactar positivamente os estudantes'
    },
    {
      id: 'diverse_content',
      icon: '🎸',
      title: 'Criar conteúdo de 3 instrumentos',
      type: 'instruments',
      target: 3,
      unit: 'instrumentos',
      description: 'Ensinar múltiplos instrumentos'
    },
    {
      id: 'total_watch_time',
      icon: '⏱️',
      title: 'Acumular 100h de visualização',
      type: 'watch_time',
      target: 6000,
      unit: 'minutos',
      description: 'Tempo total que suas aulas foram assistidas'
    },
    {
      id: 'monthly_streak',
      icon: '🔥',
      title: 'Ensinar por 30 dias consecutivos',
      type: 'streak',
      target: 30,
      unit: 'dias',
      description: 'Manter consistência no ensino'
    },
    {
      id: 'create_course',
      icon: '📚',
      title: 'Criar curso completo',
      type: 'courses',
      target: 1,
      unit: 'curso',
      description: 'Desenvolver um curso estruturado'
    },
    {
      id: 'mentor_teachers',
      icon: '👨‍🏫',
      title: 'Mentorar 5 novos professores',
      type: 'mentorship',
      target: 5,
      unit: 'professores',
      description: 'Ajudar outros educadores a crescer'
    }
  ];

  // Selecionar metas baseado no role
  const AVAILABLE_GOALS = userInfo.role === 'teacher' ? TEACHER_GOALS : STUDENT_GOALS;

  // Obter chave de armazenamento específica do usuário para metas
  function getUserGoalsKey(){
    if(session.email){
      return `newsong-study-goals-${session.email}`;
    }
    return 'newsong-study-goals';
  }

  // Carregar metas do localStorage
  function loadUserGoals(){
    const storageKey = getUserGoalsKey();
    const saved = localStorage.getItem(storageKey);
    if(saved){
      return JSON.parse(saved);
    }
    // Metas padrão
    return [
      {id: 'daily_study', progress: 0},
      {id: 'complete_module', progress: 0},
      {id: 'learn_songs', progress: 0}
    ];
  }

  // Salvar metas no localStorage
  function saveUserGoals(goals){
    const storageKey = getUserGoalsKey();
    localStorage.setItem(storageKey, JSON.stringify(goals));
    console.log(`Metas salvas para ${session.email}:`, goals);
  }

  // Mapear instrumentos
  const instrumentsMap = {
    guitar: { name: 'Guitarra', icon: '🎸' },
    drums: { name: 'Bateria', icon: '🥁' },
    keyboard: { name: 'Teclado', icon: '🎹' },
    viola: { name: 'Violão', icon: '🪕' },
    bass: { name: 'Baixo', icon: '🎸' }
  };

  // Carregar estatísticas do usuário
  function loadUserStats(){
    const statsGrid = document.getElementById('profileStatsGrid');
    if(!statsGrid) return {};

    // Limpar grid
    statsGrid.innerHTML = '';

    let stats = {};

    if(userInfo.role === 'teacher'){
      // Estatísticas de PROFESSOR
      stats = getTeacherStats();
      
      // Card 1: Vídeos Enviados
      statsGrid.innerHTML += `
        <div class="profile-stat-card">
          <div class="profile-stat-icon">🎥</div>
          <div class="profile-stat-value">${stats.videosUploaded}</div>
          <div class="profile-stat-label">Vídeos Enviados</div>
        </div>
      `;

      // Card 2: Total de Visualizações
      statsGrid.innerHTML += `
        <div class="profile-stat-card">
          <div class="profile-stat-icon">👁️</div>
          <div class="profile-stat-value">${stats.totalViews}</div>
          <div class="profile-stat-label">Visualizações</div>
        </div>
      `;

      // Card 3: Alunos Impactados
      statsGrid.innerHTML += `
        <div class="profile-stat-card">
          <div class="profile-stat-icon">🎓</div>
          <div class="profile-stat-value">${stats.studentsHelped}</div>
          <div class="profile-stat-label">Alunos Ajudados</div>
        </div>
      `;

      // Card 4: Avaliação Média
      statsGrid.innerHTML += `
        <div class="profile-stat-card">
          <div class="profile-stat-icon">⭐</div>
          <div class="profile-stat-value">${stats.avgRating}</div>
          <div class="profile-stat-label">Avaliação Média</div>
        </div>
      `;

    } else {
      // Estatísticas de ALUNO
      stats = window.UserProgress.getUserStats();
      
      // Card 1: Aulas Concluídas
      statsGrid.innerHTML += `
        <div class="profile-stat-card">
          <div class="profile-stat-icon">🎓</div>
          <div class="profile-stat-value">${stats.completedLessonsCount}</div>
          <div class="profile-stat-label">Aulas Concluídas</div>
        </div>
      `;

      // Card 2: Tempo de Estudo
      statsGrid.innerHTML += `
        <div class="profile-stat-card">
          <div class="profile-stat-icon">⏱️</div>
          <div class="profile-stat-value">${stats.studyTimeFormatted}</div>
          <div class="profile-stat-label">Tempo de Estudo</div>
        </div>
      `;

      // Card 3: Dias Consecutivos
      statsGrid.innerHTML += `
        <div class="profile-stat-card">
          <div class="profile-stat-icon">🔥</div>
          <div class="profile-stat-value">${stats.studyStreak}</div>
          <div class="profile-stat-label">Dias Consecutivos</div>
        </div>
      `;

      // Card 4: Conquistas
      statsGrid.innerHTML += `
        <div class="profile-stat-card">
          <div class="profile-stat-icon">🏅</div>
          <div class="profile-stat-value">${stats.achievementsCount}</div>
          <div class="profile-stat-label">Conquistas</div>
        </div>
      `;
    }

    // Atualizar badge de nível
    updateUserLevel(stats);

    return stats;
  }

  // Obter estatísticas do professor do localStorage
  function getTeacherStats(){
    const storageKey = `newsong-teacher-stats-${userInfo.email}`;
    const saved = localStorage.getItem(storageKey);
    
    if(saved){
      return JSON.parse(saved);
    }
    
    // Dados padrão
    return {
      videosUploaded: 0,
      totalViews: 0,
      studentsHelped: 0,
      avgRating: '0.0',
      commentsReplied: 0,
      coursesCreated: 0,
      teachingStreak: 0,
      totalWatchTime: 0
    };
  }

  // Salvar estatísticas do professor
  function saveTeacherStats(stats){
    const storageKey = `newsong-teacher-stats-${userInfo.email}`;
    localStorage.setItem(storageKey, JSON.stringify(stats));
  }
  
  // Renderizar avaliações do professor
  function renderTeacherRatings(){
    if(userInfo.role !== 'teacher') return;
    
    const ratingSection = document.getElementById('teacherRatingSection');
    if(!ratingSection) return;
    
    // Verificar se o sistema de avaliações está disponível
    if(!window.TeacherRatingSystem){
      console.error('Sistema de avaliações não está disponível');
      return;
    }
    
    // Obter estatísticas do professor
    const stats = window.TeacherRatingSystem.getTeacherStats(userInfo.name);
    
    if(stats.totalRatings === 0){
      ratingSection.style.display = 'none';
      return;
    }
    
    // Mostrar seção
    ratingSection.style.display = 'block';
    
    // Renderizar média de avaliação
    const avgElement = document.getElementById('teacherRatingAverage');
    avgElement.textContent = stats.avgRating.toFixed(1);
    
    // Renderizar estrelas visuais
    const starsVisual = document.getElementById('teacherRatingStarsVisual');
    starsVisual.innerHTML = renderStarsVisual(stats.avgRating);
    
    // Renderizar contagem
    const countElement = document.getElementById('teacherRatingCount');
    countElement.textContent = `${stats.totalRatings} avaliação${stats.totalRatings > 1 ? 'ões' : ''}`;
    
    // Renderizar barras de distribuição
    const barsContainer = document.getElementById('teacherRatingBars');
    barsContainer.innerHTML = '';
    
    for(let star = 5; star >= 1; star--){
      const count = stats.ratings[star] || 0;
      const percentage = stats.totalRatings > 0 ? (count / stats.totalRatings * 100) : 0;
      
      const barRow = document.createElement('div');
      barRow.className = 'rating-bar-row';
      barRow.innerHTML = `
        <div class="rating-bar-label">
          <svg viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          ${star} ${star > 1 ? 'estrelas' : 'estrela'}
        </div>
        <div class="rating-bar-container">
          <div class="rating-bar-fill" style="width: ${percentage}%"></div>
        </div>
        <div class="rating-bar-count">${count}</div>
      `;
      barsContainer.appendChild(barRow);
    }
    
    // Atualizar card de estatísticas também
    updateTeacherRatingInStats(stats.avgRating);
  }
  
  // Renderizar estrelas visuais
  function renderStarsVisual(rating){
    let html = '<svg style="display: none;"><defs><linearGradient id="halfGradient"><stop offset="50%" stop-color="#d4af37"/><stop offset="50%" stop-color="transparent" stop-opacity="0"/></linearGradient></defs></svg>';
    
    for(let i = 1; i <= 5; i++){
      const diff = rating - i;
      let starClass = '';
      
      if(diff >= 0){
        starClass = 'filled';
      } else if(diff > -1){
        starClass = 'half-filled';
      }
      
      html += `
        <svg class="${starClass}" viewBox="0 0 24 24">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      `;
    }
    
    return html;
  }
  
  // Atualizar avaliação no card de stats
  function updateTeacherRatingInStats(avgRating){
    const statsGrid = document.getElementById('profileStatsGrid');
    if(!statsGrid) return;
    
    const statCards = statsGrid.querySelectorAll('.profile-stat-card');
    statCards.forEach(card => {
      const label = card.querySelector('.profile-stat-label');
      if(label && label.textContent === 'Avaliação Média'){
        const valueElement = card.querySelector('.profile-stat-value');
        if(valueElement){
          valueElement.textContent = avgRating.toFixed(1);
        }
      }
    });
  }

  // Atualizar nível do usuário baseado no progresso
  function updateUserLevel(stats){
    const badgeElement = document.getElementById('profileBadge');
    const badgeIcon = document.getElementById('profileBadgeIcon');
    const badgeText = document.getElementById('profileBadgeText');
    
    if(!badgeElement || !badgeIcon || !badgeText) return;

    let level = '';
    let icon = '';
    let levelClass = 'bronze';
    
    if(userInfo.role === 'teacher'){
      // Níveis para PROFESSORES baseado em vídeos enviados
      const videos = stats.videosUploaded || 0;
      
      if(videos >= 50){
        level = 'Professor Ouro';
        icon = '👑';
        levelClass = 'gold';
      } else if(videos >= 20){
        level = 'Professor Prata';
        icon = '🥈';
        levelClass = 'silver';
      } else if(videos >= 5){
        level = 'Professor Bronze';
        icon = '🥉';
        levelClass = 'bronze';
      } else {
        level = 'Professor Iniciante';
        icon = '🎓';
        levelClass = 'beginner';
      }
    } else {
      // Níveis para ALUNOS baseado em aulas concluídas
      const lessons = stats.completedLessonsCount || 0;
      
      if(lessons >= 50){
        level = 'Nível Ouro';
        icon = '👑';
        levelClass = 'gold';
      } else if(lessons >= 20){
        level = 'Nível Prata';
        icon = '🥈';
        levelClass = 'silver';
      } else {
        level = 'Nível Bronze';
        icon = '🥉';
        levelClass = 'bronze';
      }
    }

    badgeIcon.textContent = icon;
    badgeText.textContent = level;
    badgeElement.className = `profile-badge ${levelClass}`;
  }

  // Carregar informações pessoais
  function loadPersonalInfo(){
    document.getElementById('profileName').textContent = userInfo.name;
    document.getElementById('profileEmail').textContent = userInfo.email;
    
    // Pegar as iniciais do nome (primeira letra de cada palavra)
    const initials = userInfo.name.split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2) // Pegar no máximo 2 iniciais
      .join('')
      .toUpperCase();
    document.getElementById('profileAvatar').textContent = initials;
    
    document.getElementById('infoFullName').textContent = userInfo.name;
    document.getElementById('infoEmail').textContent = userInfo.email;
    document.getElementById('infoPhone').textContent = userInfo.phone;
    document.getElementById('infoLocation').textContent = userInfo.location;
    document.getElementById('infoBirthdate').textContent = userInfo.birthdate;
    document.getElementById('infoLevel').textContent = userInfo.level;
    
    // Atualizar data de membro
    const joinDateElement = document.querySelector('.profile-join-date');
    if(joinDateElement){
      const joinDate = new Date(userInfo.joinDate);
      const options = { year: 'numeric', month: 'long' };
      const formattedDate = joinDate.toLocaleDateString('pt-BR', options);
      joinDateElement.innerHTML = `<span>📅</span> Membro desde ${formattedDate}`;
    }
  }

  // Carregar instrumentos do usuário
  function loadInstruments(){
    const instrumentsList = document.getElementById('instrumentsList');
    if(!instrumentsList) return;

    instrumentsList.innerHTML = '';

    userInfo.instruments.forEach(instId => {
      const inst = instrumentsMap[instId];
      if(!inst) return;

      const tag = document.createElement('div');
      tag.className = 'instrument-tag';
      tag.innerHTML = `
        <span>${inst.icon}</span>
        <span>${inst.name}</span>
      `;
      instrumentsList.appendChild(tag);
    });
  }

  // Carregar progresso de aprendizado
  function loadLearningProgress(){
    const progressList = document.querySelector('.progress-list');
    if(!progressList) return;

    progressList.innerHTML = '';

    userInfo.instruments.forEach(instId => {
      const inst = instrumentsMap[instId];
      if(!inst) return;

      // Calcular progresso para iniciante
      const progress = window.UserProgress.getInstrumentProgress(instId, 'beginner');
      const totalLessons = 30; // Estimativa de aulas por módulo
      const completed = progress.completedLessons.length;
      const percentage = Math.min(100, Math.round((completed / totalLessons) * 100));

      const item = document.createElement('div');
      item.className = 'progress-item';
      item.innerHTML = `
        <div class="progress-header">
          <span class="progress-name">${inst.icon} ${inst.name} - Nível Iniciante</span>
          <span class="progress-percentage">${percentage}%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width: ${percentage}%"></div>
        </div>
      `;
      
      progressList.appendChild(item);
    });

    // Animar barras
    setTimeout(() => {
      document.querySelectorAll('.progress-bar-fill').forEach(bar => {
        bar.style.transition = 'width 1s ease';
      });
    }, 100);
  }

  // Definir conquistas para PROFESSORES
  const TEACHER_ACHIEVEMENTS = [
    {
      id: 'first_upload',
      name: 'Primeiro Vídeo',
      description: 'Envie seu primeiro vídeo-aula',
      icon: '🎥',
      requirement: 1
    },
    {
      id: 'uploads_5',
      name: '5 Vídeos',
      description: 'Envie 5 vídeo-aulas',
      icon: '📹',
      requirement: 5
    },
    {
      id: 'uploads_10',
      name: '10 Vídeos',
      description: 'Envie 10 vídeo-aulas',
      icon: '🎬',
      requirement: 10
    },
    {
      id: 'views_100',
      name: '100 Visualizações',
      description: 'Alcance 100 visualizações',
      icon: '👁️',
      requirement: 100
    },
    {
      id: 'views_1000',
      name: '1000 Visualizações',
      description: 'Alcance 1000 visualizações',
      icon: '🌟',
      requirement: 1000
    },
    {
      id: 'students_50',
      name: '50 Alunos',
      description: 'Ajude 50 alunos',
      icon: '🎓',
      requirement: 50
    },
    {
      id: 'high_rating',
      name: 'Bem Avaliado',
      description: 'Mantenha avaliação 4.5+',
      icon: '⭐',
      requirement: 45
    },
    {
      id: 'responsive_teacher',
      name: 'Professor Atencioso',
      description: 'Responda 30 comentários',
      icon: '💬',
      requirement: 30
    },
    {
      id: 'streak_teacher_7',
      name: 'Semana de Ensino',
      description: 'Ensine por 7 dias consecutivos',
      icon: '🔥',
      requirement: 7
    }
  ];

  // Carregar conquistas
  function loadAchievements(){
    const achievementsGrid = document.querySelector('.achievements-grid');
    if(!achievementsGrid) return;

    achievementsGrid.innerHTML = '';

    if(userInfo.role === 'teacher'){
      // Conquistas de PROFESSOR
      const teacherStats = getTeacherStats();
      const teacherProgress = getTeacherAchievementProgress();
      
      TEACHER_ACHIEVEMENTS.forEach(achievement => {
        const isUnlocked = teacherProgress[achievement.id] || false;
        
        const card = document.createElement('div');
        card.className = 'achievement-card';
        card.style.opacity = isUnlocked ? '1' : '0.4';
        card.style.cursor = 'pointer';
        card.style.position = 'relative';
        
        let progressText = '';
        if(!isUnlocked){
          let current = 0;
          
          if(achievement.id === 'first_upload' || achievement.id === 'uploads_5' || achievement.id === 'uploads_10'){
            current = teacherStats.videosUploaded;
          } else if(achievement.id === 'views_100' || achievement.id === 'views_1000'){
            current = teacherStats.totalViews;
          } else if(achievement.id === 'students_50'){
            current = teacherStats.studentsHelped;
          } else if(achievement.id === 'high_rating'){
            current = Math.round(parseFloat(teacherStats.avgRating) * 10);
          } else if(achievement.id === 'responsive_teacher'){
            current = teacherStats.commentsReplied;
          } else if(achievement.id === 'streak_teacher_7'){
            current = teacherStats.teachingStreak;
          }
          
          progressText = `<div class="tooltip-progress">Progresso: ${current}/${achievement.requirement}</div>`;
        }
        
        const tooltip = document.createElement('div');
        tooltip.className = 'achievement-tooltip';
        tooltip.innerHTML = `
          <div class="tooltip-header">
            <span class="tooltip-icon">${achievement.icon}</span>
            <span class="tooltip-title">${achievement.name}</span>
          </div>
          <div class="tooltip-description">${achievement.description}</div>
          ${progressText}
          <div class="tooltip-status ${isUnlocked ? 'unlocked' : 'locked'}">
            ${isUnlocked ? '✓ Desbloqueado!' : '🔒 Bloqueado'}
          </div>
        `;
        
        card.innerHTML = `
          <div class="achievement-hover-indicator">ℹ️</div>
          <div class="achievement-icon">${achievement.icon}</div>
          <p class="achievement-name">${isUnlocked ? achievement.name : 'Bloqueado'}</p>
        `;
        
        card.appendChild(tooltip);
        achievementsGrid.appendChild(card);
      });
      
    } else {
      // Conquistas de ALUNO (código original)
      const stats = window.UserProgress.getUserStats();
      const unlockedIds = stats.achievements.map(a => a.id);

      stats.allAchievements.forEach(achievement => {
        const isUnlocked = unlockedIds.includes(achievement.id);
        
        const card = document.createElement('div');
        card.className = 'achievement-card';
        card.style.opacity = isUnlocked ? '1' : '0.4';
        card.style.cursor = 'pointer';
        card.style.position = 'relative';
        
        // Calcular progresso para emblemas bloqueados
        let progressText = '';
        if(!isUnlocked){
          const progress = window.UserProgress.loadProgress();
          
          if(achievement.id === 'first_lesson'){
            progressText = `<div class="tooltip-progress">Progresso: ${progress.completedLessons.length}/1 aulas</div>`;
          } else if(achievement.id === 'lessons_10'){
            progressText = `<div class="tooltip-progress">Progresso: ${progress.completedLessons.length}/10 aulas</div>`;
          } else if(achievement.id === 'lessons_25'){
            progressText = `<div class="tooltip-progress">Progresso: ${progress.completedLessons.length}/25 aulas</div>`;
          } else if(achievement.id === 'lessons_50'){
            progressText = `<div class="tooltip-progress">Progresso: ${progress.completedLessons.length}/50 aulas</div>`;
          } else if(achievement.id === 'streak_7'){
            progressText = `<div class="tooltip-progress">Progresso: ${progress.studyStreak}/7 dias consecutivos</div>`;
          } else if(achievement.id === 'streak_30'){
            progressText = `<div class="tooltip-progress">Progresso: ${progress.studyStreak}/30 dias consecutivos</div>`;
          } else if(achievement.id === 'time_5h'){
            const hours = Math.floor(progress.studyTime / 60);
            const mins = progress.studyTime % 60;
            progressText = `<div class="tooltip-progress">Progresso: ${hours}h ${mins}m / 5h</div>`;
          } else if(achievement.id === 'time_10h'){
            const hours = Math.floor(progress.studyTime / 60);
            const mins = progress.studyTime % 60;
            progressText = `<div class="tooltip-progress">Progresso: ${hours}h ${mins}m / 10h</div>`;
          } else if(achievement.id === 'time_50h'){
            const hours = Math.floor(progress.studyTime / 60);
            const mins = progress.studyTime % 60;
            progressText = `<div class="tooltip-progress">Progresso: ${hours}h ${mins}m / 50h</div>`;
          }
        }
        
        // Criar tooltip com informações de como desbloquear
        const tooltip = document.createElement('div');
        tooltip.className = 'achievement-tooltip';
        tooltip.innerHTML = `
          <div class="tooltip-header">
            <span class="tooltip-icon">${achievement.icon}</span>
            <span class="tooltip-title">${achievement.name}</span>
          </div>
          <div class="tooltip-description">${achievement.description}</div>
          ${progressText}
          <div class="tooltip-status ${isUnlocked ? 'unlocked' : 'locked'}">
            ${isUnlocked ? '✓ Desbloqueado!' : '🔒 Bloqueado'}
          </div>
        `;
        
        card.innerHTML = `
          <div class="achievement-hover-indicator">ℹ️</div>
          <div class="achievement-icon">${achievement.icon}</div>
          <p class="achievement-name">${isUnlocked ? achievement.name : 'Bloqueado'}</p>
        `;
        
        card.appendChild(tooltip);
        achievementsGrid.appendChild(card);
      });
    }
  }

  // Obter progresso de conquistas do professor
  function getTeacherAchievementProgress(){
    const storageKey = `newsong-teacher-achievements-${userInfo.email}`;
    const saved = localStorage.getItem(storageKey);
    
    if(saved){
      return JSON.parse(saved);
    }
    
    return {};
  }

  // Salvar progresso de conquistas do professor
  function saveTeacherAchievementProgress(progress){
    const storageKey = `newsong-teacher-achievements-${userInfo.email}`;
    localStorage.setItem(storageKey, JSON.stringify(progress));
  }

  // Verificar e desbloquear conquistas do professor
  function checkTeacherAchievements(){
    const stats = getTeacherStats();
    const progress = getTeacherAchievementProgress();
    let newAchievements = [];

    TEACHER_ACHIEVEMENTS.forEach(achievement => {
      if(progress[achievement.id]) return; // Já desbloqueado

      let current = 0;
      
      if(achievement.id === 'first_upload' || achievement.id === 'uploads_5' || achievement.id === 'uploads_10'){
        current = stats.videosUploaded;
      } else if(achievement.id === 'views_100' || achievement.id === 'views_1000'){
        current = stats.totalViews;
      } else if(achievement.id === 'students_50'){
        current = stats.studentsHelped;
      } else if(achievement.id === 'high_rating'){
        current = Math.round(parseFloat(stats.avgRating) * 10);
      } else if(achievement.id === 'responsive_teacher'){
        current = stats.commentsReplied;
      } else if(achievement.id === 'streak_teacher_7'){
        current = stats.teachingStreak;
      }

      if(current >= achievement.requirement){
        progress[achievement.id] = true;
        newAchievements.push(achievement);
      }
    });

    if(newAchievements.length > 0){
      saveTeacherAchievementProgress(progress);
      
      // Mostrar notificações
      newAchievements.forEach(achievement => {
        showAchievementNotification(achievement);
      });
    }
  }

  // Carregar atividade recente
  function loadRecentActivity(){
    const activityList = document.querySelector('.activity-list');
    if(!activityList) return;

    const progress = window.UserProgress.loadProgress();
    
    // Pegar últimas 5 aulas concluídas
    const recentLessons = progress.completedLessons.slice(-5).reverse();
    
    activityList.innerHTML = '';

    // Adicionar atividades
    if(recentLessons.length > 0){
      recentLessons.forEach((lessonId, index) => {
        const hoursAgo = index + 1;
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
          <div class="activity-icon">✅</div>
          <div class="activity-content">
            <p class="activity-text">Completou a aula <strong>ID ${lessonId}</strong></p>
            <p class="activity-time">Há ${hoursAgo === 1 ? '1 hora' : hoursAgo + ' horas'}</p>
          </div>
        `;
        activityList.appendChild(item);
      });
    } else {
      activityList.innerHTML = `
        <div class="activity-item">
          <div class="activity-icon">📚</div>
          <div class="activity-content">
            <p class="activity-text">Comece a estudar para ver suas atividades aqui!</p>
            <p class="activity-time">Nenhuma atividade ainda</p>
          </div>
        </div>
      `;
    }

    // Adicionar conquistas recentes
    const stats = window.UserProgress.getUserStats();
    if(stats.achievements.length > 0){
      const lastAchievement = stats.achievements[stats.achievements.length - 1];
      const achievementItem = document.createElement('div');
      achievementItem.className = 'activity-item';
      achievementItem.innerHTML = `
        <div class="activity-icon">🎯</div>
        <div class="activity-content">
          <p class="activity-text">Conquistou o badge <strong>"${lastAchievement.name}"</strong></p>
          <p class="activity-time">Recentemente</p>
        </div>
      `;
      activityList.insertBefore(achievementItem, activityList.firstChild);
    }
  }

  // Carregar metas de estudo
  function loadStudyGoals(){
    const goalsContainer = document.querySelector('.study-goals-list');
    if(!goalsContainer) return;

    const userGoals = loadUserGoals();
    goalsContainer.innerHTML = '';

    if(userInfo.role === 'teacher'){
      // Metas de PROFESSOR
      const teacherStats = getTeacherStats();
      
      userGoals.forEach(userGoal => {
        const goalDef = AVAILABLE_GOALS.find(g => g.id === userGoal.id);
        if(!goalDef) return;

        let currentProgress = 0;
        let targetValue = goalDef.target;

        switch(goalDef.type){
          case 'uploads':
            currentProgress = teacherStats.videosUploaded;
            break;
          case 'views':
            currentProgress = teacherStats.totalViews;
            break;
          case 'comments':
            currentProgress = teacherStats.commentsReplied;
            break;
          case 'students_helped':
            currentProgress = teacherStats.studentsHelped;
            break;
          case 'rating':
            currentProgress = Math.round(parseFloat(teacherStats.avgRating) * 10);
            break;
          case 'watch_time':
            currentProgress = teacherStats.totalWatchTime;
            break;
          case 'streak':
            currentProgress = teacherStats.teachingStreak;
            break;
          case 'courses':
          case 'instruments':
          case 'mentorship':
          case 'weekly_upload':
            currentProgress = userGoal.progress || 0;
            break;
        }

        const percentage = Math.min(100, Math.round((currentProgress / targetValue) * 100));
        const progressText = `${currentProgress}/${targetValue} ${goalDef.unit}`;

        const item = document.createElement('div');
        item.className = 'activity-item goal-item';
        item.innerHTML = `
          <div class="activity-icon">${goalDef.icon}</div>
          <div class="activity-content">
            <p class="activity-text"><strong>${goalDef.title}</strong></p>
            <p class="activity-time">${progressText}</p>
            <div class="goal-progress-bar">
              <div class="goal-progress-fill" style="width: ${percentage}%"></div>
            </div>
          </div>
        `;
        
        goalsContainer.appendChild(item);
      });
      
    } else {
      // Metas de ALUNO (código original)
      const stats = window.UserProgress.getUserStats();
      const progress = window.UserProgress.loadProgress();
      
      userGoals.forEach(userGoal => {
        const goalDef = AVAILABLE_GOALS.find(g => g.id === userGoal.id);
        if(!goalDef) return;

        // Calcular progresso real
        let currentProgress = 0;
        let targetValue = goalDef.target;

        switch(goalDef.type){
          case 'daily':
          case 'streak':
            currentProgress = progress.studyStreak;
            break;
          case 'lessons':
            currentProgress = stats.completedLessonsCount;
            break;
          case 'time':
            currentProgress = progress.studyTime;
            break;
          case 'songs':
          case 'techniques':
          case 'recordings':
          case 'theory':
            currentProgress = userGoal.progress || 0;
            break;
        }

        const percentage = Math.min(100, Math.round((currentProgress / targetValue) * 100));
        const progressText = `${currentProgress}/${targetValue} ${goalDef.unit}`;

        const item = document.createElement('div');
        item.className = 'activity-item goal-item';
        item.innerHTML = `
          <div class="activity-icon">${goalDef.icon}</div>
          <div class="activity-content">
            <p class="activity-text"><strong>${goalDef.title}</strong></p>
            <p class="activity-time">${progressText}</p>
            <div class="goal-progress-bar">
              <div class="goal-progress-fill" style="width: ${percentage}%"></div>
            </div>
          </div>
        `;
        
        goalsContainer.appendChild(item);
      });
    }
  }

  // Carregar vídeos do professor
  async function loadTeacherVideos(){
    const teacherVideosCard = document.getElementById('teacherVideosCard');
    const teacherVideosList = document.getElementById('teacherVideosList');
    
    if(!teacherVideosCard || !teacherVideosList) return;
    
    // Só mostrar se for professor ou se estiver visualizando perfil de professor
    if(userInfo.role !== 'teacher'){
      teacherVideosCard.style.display = 'none';
      return;
    }
    
    teacherVideosCard.style.display = 'block';
    teacherVideosList.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--muted);">Carregando vídeos...</div>';
    
    try {
      // Database de todos os vídeos organizados por instrumento e aula
      const videosDatabase = {
        guitar: {
          beginner: {
            lesson101: [
              {id:10101, lessonId:101, lessonTitle:'Partes da guitarra e suas funções', title:'Corpo da Guitarra', duration:'5:23', author:'Mariana Silva', thumbnail:'🎸', order:1, postedDate:'2024-10-25', views:1250},
              {id:10102, lessonId:101, lessonTitle:'Partes da guitarra e suas funções', title:'Braço e Trastes', duration:'4:15', author:'Mariana Silva', thumbnail:'🎸', order:2, postedDate:'2024-10-26', views:980},
              {id:10103, lessonId:101, lessonTitle:'Partes da guitarra e suas funções', title:'Captadores e Controles', duration:'6:30', author:'Mariana Silva', thumbnail:'🎸', order:3, postedDate:'2024-10-27', views:1120},
              {id:10104, lessonId:101, lessonTitle:'Partes da guitarra e suas funções', title:'Ponte e Cordas', duration:'4:45', author:'Mariana Silva', thumbnail:'🎸', order:4, postedDate:'2024-10-28', views:890}
            ],
            lesson102: [
              {id:10201, lessonId:102, lessonTitle:'Tipos de guitarras', title:'Fender Stratocaster', duration:'6:30', author:'Carlos Mendes', thumbnail:'🎸', order:1, postedDate:'2024-10-20', views:2100},
              {id:10202, lessonId:102, lessonTitle:'Tipos de guitarras', title:'Gibson Les Paul', duration:'5:45', author:'Carlos Mendes', thumbnail:'🎸', order:2, postedDate:'2024-10-21', views:1850},
              {id:10203, lessonId:102, lessonTitle:'Tipos de guitarras', title:'Fender Telecaster', duration:'5:20', author:'Carlos Mendes', thumbnail:'🎸', order:3, postedDate:'2024-10-23', views:1650},
              {id:10204, lessonId:102, lessonTitle:'Tipos de guitarras', title:'Outros Modelos', duration:'7:15', author:'Carlos Mendes', thumbnail:'🎸', order:4, postedDate:'2024-10-24', views:1420}
            ],
            lesson103: [
              {id:10301, lessonId:103, lessonTitle:'Como segurar a guitarra', title:'Postura Sentado', duration:'4:20', author:'Ana Costa', thumbnail:'🎸', order:1, postedDate:'2024-10-15', views:3200},
              {id:10302, lessonId:103, lessonTitle:'Como segurar a guitarra', title:'Postura em Pé', duration:'4:10', author:'Ana Costa', thumbnail:'🎸', order:2, postedDate:'2024-10-16', views:2980},
              {id:10303, lessonId:103, lessonTitle:'Como segurar a guitarra', title:'Posição do Braço', duration:'5:30', author:'Ana Costa', thumbnail:'🎸', order:3, postedDate:'2024-10-18', views:2650}
            ],
            lesson104: [
              {id:10401, lessonId:104, lessonTitle:'Como afinar a guitarra', title:'Afinação Manual', duration:'6:45', author:'Pedro Santos', thumbnail:'🎸', order:1, postedDate:'2024-10-10', views:4500},
              {id:10402, lessonId:104, lessonTitle:'Como afinar a guitarra', title:'Afinador Digital', duration:'4:30', author:'Pedro Santos', thumbnail:'🎸', order:2, postedDate:'2024-10-11', views:3800},
              {id:10403, lessonId:104, lessonTitle:'Como afinar a guitarra', title:'Apps de Afinação', duration:'5:15', author:'Pedro Santos', thumbnail:'🎸', order:3, postedDate:'2024-10-13', views:4100}
            ],
            lesson105: [
              {id:10501, lessonId:105, lessonTitle:'Cuidados e manutenção', title:'Limpeza da Guitarra', duration:'5:50', author:'Lucas Oliveira', thumbnail:'🎸', order:1, postedDate:'2024-10-05', views:2800},
              {id:10502, lessonId:105, lessonTitle:'Cuidados e manutenção', title:'Troca de Cordas', duration:'8:20', author:'Lucas Oliveira', thumbnail:'🎸', order:2, postedDate:'2024-10-06', views:3500},
              {id:10503, lessonId:105, lessonTitle:'Cuidados e manutenção', title:'Armazenamento', duration:'4:40', author:'Lucas Oliveira', thumbnail:'🎸', order:3, postedDate:'2024-10-08', views:2200},
              {id:10504, lessonId:105, lessonTitle:'Cuidados e manutenção', title:'Manutenção Preventiva', duration:'6:10', author:'Lucas Oliveira', thumbnail:'🎸', order:4, postedDate:'2024-10-09', views:2600}
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
              {id:1201, lessonId:12, lessonTitle:'Coordenação Inicial', title:'Exercícios', duration:'6:55', author:'Carla Beats', thumbnail:'🥁', order:1, postedDate:'2024-10-18', views:2100},
              {id:1202, lessonId:12, lessonTitle:'Coordenação Inicial', title:'Independência', duration:'8:00', author:'Carla Beats', thumbnail:'🥁', order:2, postedDate:'2024-10-19', views:1980}
            ]
          }
        },
        keyboard: {
          beginner: {
            lesson21: [
              {id:2101, lessonId:21, lessonTitle:'Escalas Simples', title:'Dó Maior', duration:'5:45', author:'Sofia Piano', thumbnail:'🎹', order:1, postedDate:'2024-10-14', views:2500},
              {id:2102, lessonId:21, lessonTitle:'Escalas Simples', title:'Sol Maior', duration:'6:00', author:'Sofia Piano', thumbnail:'🎹', order:2, postedDate:'2024-10-15', views:2350}
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
              {id:3101, lessonId:31, lessonTitle:'Dedilhado Básico', title:'Padrões', duration:'6:25', author:'Gabriel Violão', thumbnail:'🪕', order:1, postedDate:'2024-10-08', views:2700},
              {id:3102, lessonId:31, lessonTitle:'Dedilhado Básico', title:'Exercícios', duration:'7:00', author:'Gabriel Violão', thumbnail:'🪕', order:2, postedDate:'2024-10-09', views:2550}
            ],
            lesson32: [
              {id:3201, lessonId:32, lessonTitle:'Acordes Abertos', title:'Básicos', duration:'5:50', author:'Larissa Acoustic', thumbnail:'🪕', order:1, postedDate:'2024-10-05', views:3200},
              {id:3202, lessonId:32, lessonTitle:'Acordes Abertos', title:'Transição', duration:'5:00', author:'Larissa Acoustic', thumbnail:'🪕', order:2, postedDate:'2024-10-06', views:2950}
            ]
          }
        },
        bass: {
          beginner: {
            lesson41: [
              {id:4101, lessonId:41, lessonTitle:'Walking Bass', title:'Conceito', duration:'6:10', author:'Rodrigo Bass', thumbnail:'🎸', order:1, postedDate:'2024-10-12', views:1900},
              {id:4102, lessonId:41, lessonTitle:'Walking Bass', title:'Exercícios', duration:'6:00', author:'Rodrigo Bass', thumbnail:'🎸', order:2, postedDate:'2024-10-13', views:1750}
            ],
            lesson42: [
              {id:4201, lessonId:42, lessonTitle:'Técnica Mão Direita', title:'Palhetada', duration:'5:30', author:'Patrícia Groove', thumbnail:'🎸', order:1, postedDate:'2024-10-07', views:2300},
              {id:4202, lessonId:42, lessonTitle:'Técnica Mão Direita', title:'Exercícios', duration:'6:00', author:'Patrícia Groove', thumbnail:'🎸', order:2, postedDate:'2024-10-08', views:2150}
            ]
          }
        }
      };

      // Coletar todos os vídeos do autor
      let allVideos = [];
      
      // Buscar nos vídeos do banco de dados
      Object.keys(videosDatabase).forEach(instrument => {
        Object.keys(videosDatabase[instrument]).forEach(level => {
          Object.keys(videosDatabase[instrument][level]).forEach(lessonKey => {
            const videos = videosDatabase[instrument][level][lessonKey];
            const authorVideos = videos.filter(v => v.author === userInfo.name);
            allVideos = allVideos.concat(authorVideos);
          });
        });
      });
      
      // Buscar nos vídeos enviados (localStorage e IndexedDB)
      let uploadedVideos = [];
      
      // Tentar carregar do IndexedDB primeiro
      if(window.VideoStorage){
        try{
          await VideoStorage.init();
          uploadedVideos = await VideoStorage.getAll();
          console.log('Vídeos carregados do IndexedDB:', uploadedVideos.length);
        }catch(e){
          console.warn('IndexedDB não disponível, tentando localStorage:', e);
        }
      }
      
      // Fallback para localStorage se IndexedDB falhar
      if(uploadedVideos.length === 0){
        uploadedVideos = JSON.parse(localStorage.getItem('newsong-videos') || '[]');
        console.log('Vídeos carregados do localStorage:', uploadedVideos.length);
      }
      
      // Filtrar vídeos do autor
      const authorUploadedVideos = uploadedVideos.filter(v => v.author === userInfo.name);
      
      // Converter vídeos enviados para o formato padrão
      const formattedUploadedVideos = authorUploadedVideos.map(v => ({
        id: v.id,
        title: v.title,
        duration: v.duration,
        author: v.author,
        thumbnail: v.uploadType === 'file' ? '📹' : '🎬',
        views: v.views || 0,
        postedDate: v.uploadedAt ? v.uploadedAt.split('T')[0] : v.postedDate,
        isUploaded: true
      }));
      
      // Combinar todos os vídeos
      allVideos = allVideos.concat(formattedUploadedVideos);
      
      // Ordenar por data (mais recente primeiro)
      allVideos.sort((a, b) => {
        const dateA = new Date(a.postedDate);
        const dateB = new Date(b.postedDate);
        return dateB - dateA;
      });
      
      console.log(`Vídeos encontrados para ${userInfo.name}:`, allVideos.length);
      
      if(allVideos.length === 0){
        teacherVideosList.innerHTML = `
          <div class="no-videos-message">
            <div class="no-videos-message-icon">🎥</div>
            <p>Nenhum vídeo publicado ainda.</p>
            <p style="font-size: 12px; margin-top: 8px;">Comece a compartilhar seu conhecimento!</p>
          </div>
        `;
        return;
      }
      
      // Renderizar vídeos
      teacherVideosList.innerHTML = '';
      allVideos.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.className = 'teacher-video-item';
        videoItem.innerHTML = `
          <div class="teacher-video-thumbnail">${video.thumbnail}</div>
          <div class="teacher-video-info">
            <div class="teacher-video-title">${video.title}</div>
            <div class="teacher-video-meta">
              <span class="teacher-video-duration">⏱️ ${video.duration}</span>
              <span class="teacher-video-views">👁️ ${video.views} visualizações</span>
            </div>
          </div>
        `;
        
        // Adicionar evento de clique para ir para o vídeo
        videoItem.addEventListener('click', () => {
          // Redirecionar para a página de vídeos
          window.location.href = `videos.html`;
        });
        
        teacherVideosList.appendChild(videoItem);
      });
      
      // Atualizar estatísticas do professor
      const teacherStats = getTeacherStats();
      teacherStats.videosUploaded = allVideos.length;
      teacherStats.totalViews = allVideos.reduce((sum, v) => sum + v.views, 0);
      saveTeacherStats(teacherStats);
      
      // Atualizar cards de estatísticas
      loadUserStats();
      
    } catch(e){
      console.error('Erro ao carregar vídeos do professor:', e);
      teacherVideosList.innerHTML = `
        <div class="no-videos-message">
          <div class="no-videos-message-icon">❌</div>
          <p>Erro ao carregar vídeos.</p>
        </div>
      `;
    }
  }

  // Inicializar página
  function init(){
    console.log('Inicializando página de perfil...');
    
    loadPersonalInfo();
    const stats = loadUserStats();
    loadInstruments();
    loadLearningProgress();
    loadAchievements();
    loadRecentActivity();
    loadStudyGoals();
    loadTeacherVideos(); // Carregar vídeos do professor
    renderTeacherRatings(); // Renderizar avaliações do professor

    console.log('Estatísticas do usuário:', stats);
  }

  // Ouvir evento de aula concluída para atualizar em tempo real
  window.addEventListener('lessonCompleted', () => {
    console.log('Aula concluída! Atualizando perfil...');
    init();
  });

  // Ouvir evento de conquistas desbloqueadas
  window.addEventListener('achievementsUnlocked', (e) => {
    const achievements = e.detail.achievements;
    console.log('Novas conquistas desbloqueadas:', achievements);
    
    // Mostrar notificação
    achievements.forEach(achievement => {
      showAchievementNotification(achievement);
    });
  });

  // Mostrar notificação de conquista
  function showAchievementNotification(achievement){
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-notification-content">
        <div class="achievement-notification-icon">${achievement.icon}</div>
        <div>
          <div class="achievement-notification-title">Nova Conquista!</div>
          <div class="achievement-notification-name">${achievement.name}</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
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

  // Profile button (already on profile page)
  const profileBtn = document.getElementById('profileMenuBtn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      // Already on profile page, do nothing or reload
      window.location.reload();
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

  // Ocultar botões de edição se estiver em modo de visualização
  if(isViewMode){
    const editInfoBtn = document.getElementById('editInfoBtn');
    const editInstrumentsBtn = document.getElementById('editInstrumentsBtn');
    const editGoalsBtn = document.getElementById('editGoalsBtn');
    
    if(editInfoBtn) editInfoBtn.style.display = 'none';
    if(editInstrumentsBtn) editInstrumentsBtn.style.display = 'none';
    if(editGoalsBtn) editGoalsBtn.style.display = 'none';
  }

  // Botões de edição (placeholder)
  document.getElementById('editInfoBtn')?.addEventListener('click', () => {
    alert('Funcionalidade de edição será implementada em breve!');
  });
  
  document.getElementById('editInstrumentsBtn')?.addEventListener('click', () => {
    alert('Funcionalidade de adicionar instrumentos será implementada em breve!');
  });
  
  document.getElementById('editGoalsBtn')?.addEventListener('click', () => {
    openGoalsEditor();
  });

  // Editor de metas
  function openGoalsEditor(){
    const userGoals = loadUserGoals();
    
    const modal = document.createElement('div');
    modal.className = 'goals-editor-modal';
    modal.innerHTML = `
      <div class="goals-editor-overlay"></div>
      <div class="goals-editor-content">
        <div class="goals-editor-header">
          <h2>🎯 Editar Metas de Estudo</h2>
          <button class="goals-editor-close" aria-label="Fechar">×</button>
        </div>
        <div class="goals-editor-body">
          <p class="goals-editor-description">
            Escolha até 3 metas para acompanhar seu progresso. Selecione as que mais combinam com seus objetivos musicais!
          </p>
          <div class="goals-editor-grid" id="goalsEditorGrid"></div>
        </div>
        <div class="goals-editor-footer">
          <button class="btn-cancel-goals">Cancelar</button>
          <button class="btn-save-goals">
            <span>💾</span>
            <span>Salvar Metas</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Renderizar opções de metas
    const grid = document.getElementById('goalsEditorGrid');
    AVAILABLE_GOALS.forEach(goal => {
      const isSelected = userGoals.some(g => g.id === goal.id);
      
      const card = document.createElement('div');
      card.className = `goal-option-card ${isSelected ? 'selected' : ''}`;
      card.dataset.goalId = goal.id;
      
      card.innerHTML = `
        <div class="goal-option-check">${isSelected ? '✓' : ''}</div>
        <div class="goal-option-icon">${goal.icon}</div>
        <h3 class="goal-option-title">${goal.title}</h3>
        <p class="goal-option-description">${goal.description}</p>
        <div class="goal-option-target">
          <span class="goal-target-badge">Meta: ${goal.target} ${goal.unit}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        const selectedCards = grid.querySelectorAll('.goal-option-card.selected');
        
        if(card.classList.contains('selected')){
          // Desmarcar
          card.classList.remove('selected');
          card.querySelector('.goal-option-check').textContent = '';
        } else {
          // Verificar limite de 3 metas
          if(selectedCards.length >= 3){
            showNotification('Limite atingido', 'Você pode selecionar no máximo 3 metas. Desmarque uma para adicionar outra.', 'error');
            return;
          }
          // Marcar
          card.classList.add('selected');
          card.querySelector('.goal-option-check').textContent = '✓';
        }
      });

      grid.appendChild(card);
    });

    // Fechar modal
    const closeModal = () => {
      modal.classList.add('closing');
      setTimeout(() => modal.remove(), 300);
    };

    modal.querySelector('.goals-editor-close').addEventListener('click', closeModal);
    modal.querySelector('.btn-cancel-goals').addEventListener('click', closeModal);
    modal.querySelector('.goals-editor-overlay').addEventListener('click', closeModal);

    // Salvar metas
    modal.querySelector('.btn-save-goals').addEventListener('click', () => {
      const selectedCards = grid.querySelectorAll('.goal-option-card.selected');
      
      if(selectedCards.length === 0){
        showNotification('Nenhuma meta selecionada', 'Selecione pelo menos uma meta para continuar.', 'error');
        return;
      }

      const newGoals = Array.from(selectedCards).map(card => ({
        id: card.dataset.goalId,
        progress: 0
      }));

      saveUserGoals(newGoals);
      loadStudyGoals();
      closeModal();
      
      showNotification('Metas atualizadas!', `Você selecionou ${newGoals.length} meta(s). Continue praticando para alcançá-las! 🎉`, 'success');
    });

    // Adicionar animação de entrada
    setTimeout(() => modal.classList.add('active'), 10);
  }

  // Função de notificação reutilizável
  function showNotification(title, message, type = 'success'){
    const existing = document.querySelector('.custom-notification');
    if(existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.innerHTML = `
      <div class="notification-content ${type}">
        <div class="notification-header">
          <div class="notification-icon">
            ${type === 'success' ? `
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            ` : `
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            `}
          </div>
          <h2>${title}</h2>
        </div>
        <div class="notification-body">
          <p>${message}</p>
        </div>
        <div class="notification-footer">
          <button class="notification-btn" onclick="this.closest('.custom-notification').remove()">
            <span>Entendi</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
  }

  // Theme Toggle
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

  // Inicializar quando o DOM estiver pronto
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => {
      init();
      initThemeToggle();
    });
  } else {
    init();
    initThemeToggle();
  }

  // Adicionar estilos para notificação de conquista e tooltips
  const style = document.createElement('style');
  style.textContent = `
    .achievement-notification {
      position: fixed;
      top: 100px;
      right: -400px;
      background: linear-gradient(135deg, rgba(212,175,55,0.95), rgba(255,215,0,0.95));
      color: #1a1a2e;
      padding: 20px 24px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      z-index: 10000;
      transition: right 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      min-width: 320px;
    }
    
    .achievement-notification.show {
      right: 24px;
    }
    
    .achievement-notification-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .achievement-notification-icon {
      font-size: 48px;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
    }
    
    .achievement-notification-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    
    .achievement-notification-name {
      font-size: 18px;
      font-weight: 800;
    }
    
    /* Tooltip dos Emblemas */
    .achievement-tooltip {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-10px);
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 2px solid rgba(212,175,55,0.3);
      border-radius: 12px;
      padding: 16px;
      min-width: 280px;
      max-width: 320px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      z-index: 1000;
      pointer-events: none;
    }
    
    .achievement-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid rgba(212,175,55,0.3);
    }
    
    .achievement-card:hover .achievement-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(-5px);
    }
    
    .achievement-hover-indicator {
      position: absolute;
      top: 6px;
      right: 6px;
      font-size: 14px;
      opacity: 0;
      transition: all 0.3s ease;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }
    
    .achievement-card:hover .achievement-hover-indicator {
      opacity: 0.8;
      transform: scale(1.2);
    }
    
    .tooltip-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(212,175,55,0.2);
    }
    
    .tooltip-icon {
      font-size: 32px;
      filter: drop-shadow(0 2px 8px rgba(212,175,55,0.3));
    }
    
    .tooltip-title {
      font-size: 16px;
      font-weight: 700;
      color: #d4af37;
      flex: 1;
    }
    
    .tooltip-description {
      font-size: 14px;
      color: #e0e0e0;
      line-height: 1.5;
      margin-bottom: 12px;
    }
    
    .tooltip-progress {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 12px;
      background: rgba(212,175,55,0.1);
      border: 1px solid rgba(212,175,55,0.2);
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #d4af37;
      margin-bottom: 12px;
      letter-spacing: 0.3px;
    }
    
    .tooltip-progress::before {
      content: '📊';
      margin-right: 8px;
    }
    
    .tooltip-status {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .tooltip-status.unlocked {
      background: linear-gradient(135deg, rgba(34,197,94,0.2), rgba(22,163,74,0.2));
      border: 1px solid rgba(34,197,94,0.4);
      color: #22c55e;
    }
    
    .tooltip-status.locked {
      background: linear-gradient(135deg, rgba(239,68,68,0.2), rgba(220,38,38,0.2));
      border: 1px solid rgba(239,68,68,0.4);
      color: #ef4444;
    }
    
    /* Ajuste para mobile */
    @media (max-width: 768px) {
      .achievement-notification {
        min-width: 280px;
        right: -350px;
      }
      
      .achievement-notification.show {
        right: 16px;
      }
      
      .achievement-tooltip {
        position: fixed;
        bottom: auto;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: 90vw;
        max-width: 90vw;
      }
      
      .achievement-card:hover .achievement-tooltip {
        transform: translate(-50%, -50%);
      }
      
      .achievement-tooltip::after {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);
  } // Fim da função initProfile

  // Aguardar UserProgress carregar antes de inicializar
  if(window.UserProgress){
    initProfile();
  } else {
    waitForUserProgress(initProfile);
  }
})();
