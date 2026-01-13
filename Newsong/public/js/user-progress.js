// user-progress.js - Sistema de progresso do usuário e conquistas
(function(){
  // Obter usuário logado
  function getCurrentUser(){
    try {
      const session = JSON.parse(localStorage.getItem('ns-session') || '{}');
      return session.email || null;
    } catch(e) {
      console.error('Erro ao obter sessão:', e);
      return null;
    }
  }

  // Chave de storage específica por usuário
  function getStorageKey(){
    const userEmail = getCurrentUser();
    if(!userEmail){
      console.warn('Usuário não autenticado, usando progresso genérico');
      return 'newsong-user-progress';
    }
    // Criar chave única para cada usuário
    return `newsong-user-progress-${userEmail}`;
  }
  
  // Estrutura de dados do progresso do usuário
  function getDefaultProgress(){
    return {
      completedLessons: [], // Array de IDs de aulas concluídas
      studyTime: 0, // Tempo total em minutos
      lastStudyDate: null,
      studyStreak: 0, // Dias consecutivos
      achievements: [], // Array de IDs de conquistas desbloqueadas
      instrumentProgress: {}, // Progresso por instrumento
      startDate: new Date().toISOString()
    };
  }

  // Definição de conquistas/badges
  const ACHIEVEMENTS = {
    first_lesson: {
      id: 'first_lesson',
      name: 'Primeira Aula',
      description: 'Complete sua primeira aula em qualquer instrumento para desbloquear este emblema. Assista um vídeo e clique em "Concluir Aula".',
      icon: '🎓',
      condition: (progress) => progress.completedLessons.length >= 1
    },
    lessons_10: {
      id: 'lessons_10',
      name: '10 Aulas Concluídas',
      description: 'Complete 10 aulas em qualquer instrumento e nível. Continue assistindo vídeos e marcando como concluídas para desbloquear.',
      icon: '⭐',
      condition: (progress) => progress.completedLessons.length >= 10
    },
    lessons_25: {
      id: 'lessons_25',
      name: '25 Aulas Concluídas',
      description: 'Complete 25 aulas em qualquer instrumento e nível. Um marco importante na sua jornada musical!',
      icon: '🌟',
      condition: (progress) => progress.completedLessons.length >= 25
    },
    lessons_50: {
      id: 'lessons_50',
      name: '50 Aulas Concluídas',
      description: 'Complete 50 aulas em qualquer instrumento e nível. Demonstra dedicação e comprometimento excepcional!',
      icon: '💫',
      condition: (progress) => progress.completedLessons.length >= 50
    },
    streak_7: {
      id: 'streak_7',
      name: '7 Dias Seguidos',
      description: 'Estude pelo menos uma vez por dia durante 7 dias consecutivos. A consistência é a chave para o sucesso!',
      icon: '🔥',
      condition: (progress) => progress.studyStreak >= 7
    },
    streak_30: {
      id: 'streak_30',
      name: '30 Dias Seguidos',
      description: 'Estude pelo menos uma vez por dia durante 30 dias consecutivos. Você está no caminho da maestria!',
      icon: '🔥🔥',
      condition: (progress) => progress.studyStreak >= 30
    },
    time_5h: {
      id: 'time_5h',
      name: '5 Horas de Estudo',
      description: 'Acumule 5 horas de tempo total de estudo assistindo e concluindo aulas. O tempo é calculado automaticamente.',
      icon: '⏱️',
      condition: (progress) => progress.studyTime >= 300 // 5 horas = 300 minutos
    },
    time_10h: {
      id: 'time_10h',
      name: '10 Horas de Estudo',
      description: 'Acumule 10 horas de tempo total de estudo. Continue assistindo aulas e seu tempo será contabilizado automaticamente.',
      icon: '⏰',
      condition: (progress) => progress.studyTime >= 600
    },
    time_50h: {
      id: 'time_50h',
      name: '50 Horas de Estudo',
      description: 'Acumule 50 horas de tempo total de estudo. Este emblema é para os verdadeiros dedicados à arte musical!',
      icon: '⌚',
      condition: (progress) => progress.studyTime >= 3000
    },
    guitar_bronze: {
      id: 'guitar_bronze',
      name: 'Guitarrista Bronze',
      description: 'Complete todas as aulas do módulo Bronze (Iniciante) de Guitarra. Domine os fundamentos antes de avançar!',
      icon: '🎸',
      condition: (progress) => {
        const guitarProgress = progress.instrumentProgress['guitar_beginner'];
        return guitarProgress && guitarProgress.modulesCompleted >= 1;
      }
    },
    keyboard_bronze: {
      id: 'keyboard_bronze',
      name: 'Tecladista Iniciante',
      description: 'Complete todas as aulas do módulo Bronze (Iniciante) de Teclado. As teclas não têm mais segredos para você!',
      icon: '🎹',
      condition: (progress) => {
        const keyboardProgress = progress.instrumentProgress['keyboard_beginner'];
        return keyboardProgress && keyboardProgress.modulesCompleted >= 1;
      }
    },
    drums_bronze: {
      id: 'drums_bronze',
      name: 'Baterista Bronze',
      description: 'Complete todas as aulas do módulo Bronze (Iniciante) de Bateria. Você está pronto para fazer muito barulho!',
      icon: '🥁',
      condition: (progress) => {
        const drumsProgress = progress.instrumentProgress['drums_beginner'];
        return drumsProgress && drumsProgress.modulesCompleted >= 1;
      }
    }
  };

  // Carregar progresso do localStorage
  function loadProgress(){
    const currentUser = getCurrentUser();
    if(!currentUser){
      console.warn('Tentativa de carregar progresso sem usuário autenticado');
      return getDefaultProgress();
    }
    
    try {
      const storageKey = getStorageKey();
      const stored = localStorage.getItem(storageKey);
      if(stored){
        const progress = JSON.parse(stored);
        console.log(`Progresso carregado para ${currentUser}:`, progress);
        return progress;
      }
    } catch(e){
      console.error('Erro ao carregar progresso:', e);
    }
    
    console.log(`Criando novo progresso para ${currentUser}`);
    return getDefaultProgress();
  }

  // Salvar progresso no localStorage
  function saveProgress(progress){
    const currentUser = getCurrentUser();
    if(!currentUser){
      console.error('Tentativa de salvar progresso sem usuário autenticado');
      return false;
    }
    
    try {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(progress));
      console.log(`Progresso salvo para ${currentUser}:`, progress);
      return true;
    } catch(e){
      console.error('Erro ao salvar progresso:', e);
      return false;
    }
  }

  // Marcar aula como concluída
  function completeLesson(lessonId, duration, instrument, level){
    const progress = loadProgress();
    
    // Verificar se já foi concluída
    if(progress.completedLessons.includes(lessonId)){
      console.log('Aula já concluída:', lessonId);
      return progress;
    }

    // Adicionar aula concluída
    progress.completedLessons.push(lessonId);
    
    // Adicionar tempo de estudo (converter duração de HH:MM ou MM:SS para minutos)
    if(duration){
      const minutes = parseDurationToMinutes(duration);
      progress.studyTime += minutes;
    }

    // Atualizar streak (dias consecutivos)
    updateStudyStreak(progress);

    // Atualizar progresso do instrumento
    updateInstrumentProgress(progress, instrument, level, lessonId);

    // Verificar e desbloquear conquistas
    checkAchievements(progress);

    // Salvar
    saveProgress(progress);

    // Adicionar XP pela conclusão da aula (se XPSystem estiver disponível)
    if (window.XPSystem) {
      window.XPSystem.completeLesson(lessonId);
    }

    // Disparar evento customizado
    window.dispatchEvent(new CustomEvent('lessonCompleted', { 
      detail: { lessonId, progress } 
    }));

    return progress;
  }

  // Converter duração (HH:MM:SS ou MM:SS) para minutos
  function parseDurationToMinutes(duration){
    if(!duration) return 0;
    
    const parts = duration.split(':').map(p => parseInt(p) || 0);
    
    if(parts.length === 3){
      // HH:MM:SS
      return parts[0] * 60 + parts[1] + Math.round(parts[2] / 60);
    } else if(parts.length === 2){
      // MM:SS
      return parts[0] + Math.round(parts[1] / 60);
    }
    
    return 0;
  }

  // Atualizar streak de dias consecutivos
  function updateStudyStreak(progress){
    const today = new Date().toDateString();
    const lastDate = progress.lastStudyDate ? new Date(progress.lastStudyDate).toDateString() : null;

    if(!lastDate){
      // Primeiro dia
      progress.studyStreak = 1;
    } else if(lastDate === today){
      // Mesmo dia, não altera streak
      return;
    } else {
      // Verificar se é dia consecutivo
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if(lastDate === yesterdayStr){
        // Dia consecutivo
        progress.studyStreak++;
      } else {
        // Quebrou o streak
        progress.studyStreak = 1;
      }
    }

    progress.lastStudyDate = new Date().toISOString();
  }

  // Atualizar progresso específico do instrumento
  function updateInstrumentProgress(progress, instrument, level, lessonId){
    if(!instrument || !level) return;

    const key = `${instrument}_${level}`;
    
    if(!progress.instrumentProgress[key]){
      progress.instrumentProgress[key] = {
        completedLessons: [],
        modulesCompleted: 0,
        lastLesson: null
      };
    }

    const instProgress = progress.instrumentProgress[key];
    
    if(!instProgress.completedLessons.includes(lessonId)){
      instProgress.completedLessons.push(lessonId);
      instProgress.lastLesson = lessonId;
    }
  }

  // Verificar e desbloquear conquistas
  function checkAchievements(progress){
    const newAchievements = [];

    Object.values(ACHIEVEMENTS).forEach(achievement => {
      // Se já tem a conquista, pular
      if(progress.achievements.includes(achievement.id)){
        return;
      }

      // Verificar condição
      if(achievement.condition(progress)){
        progress.achievements.push(achievement.id);
        newAchievements.push(achievement);
        console.log('Nova conquista desbloqueada:', achievement.name);
      }
    });

    // Disparar evento para cada nova conquista
    if(newAchievements.length > 0){
      window.dispatchEvent(new CustomEvent('achievementsUnlocked', { 
        detail: { achievements: newAchievements } 
      }));
    }

    return newAchievements;
  }

  // Verificar se uma aula foi concluída
  function isLessonCompleted(lessonId){
    const progress = loadProgress();
    return progress.completedLessons.includes(lessonId);
  }

  // Obter estatísticas do usuário
  function getUserStats(){
    const progress = loadProgress();
    
    return {
      completedLessonsCount: progress.completedLessons.length,
      studyTimeFormatted: formatStudyTime(progress.studyTime),
      studyTimeMinutes: progress.studyTime,
      studyStreak: progress.studyStreak,
      achievementsCount: progress.achievements.length,
      totalAchievements: Object.keys(ACHIEVEMENTS).length,
      achievements: progress.achievements.map(id => ACHIEVEMENTS[id]).filter(Boolean),
      allAchievements: Object.values(ACHIEVEMENTS),
      instrumentProgress: progress.instrumentProgress,
      startDate: progress.startDate
    };
  }

  // Formatar tempo de estudo
  function formatStudyTime(minutes){
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if(hours === 0){
      return `${mins}m`;
    }
    
    return `${hours}h ${mins}m`;
  }

  // Obter progresso por instrumento e nível
  function getInstrumentProgress(instrument, level){
    const progress = loadProgress();
    const key = `${instrument}_${level}`;
    return progress.instrumentProgress[key] || {
      completedLessons: [],
      modulesCompleted: 0,
      lastLesson: null
    };
  }

  // Resetar progresso (apenas para desenvolvimento/testes)
  function resetProgress(){
    const currentUser = getCurrentUser();
    if(!currentUser){
      alert('Nenhum usuário autenticado!');
      return;
    }
    
    if(confirm(`Tem certeza que deseja resetar todo o progresso da conta "${currentUser}"? Esta ação não pode ser desfeita.`)){
      const storageKey = getStorageKey();
      localStorage.removeItem(storageKey);
      console.log(`Progresso resetado para ${currentUser}`);
      window.location.reload();
    }
  }

  // Migrar progresso antigo (se existir) para o usuário atual
  function migrateOldProgress(){
    const currentUser = getCurrentUser();
    if(!currentUser) return;
    
    const oldKey = 'newsong-user-progress';
    const newKey = getStorageKey();
    
    // Se já existe progresso novo, não migrar
    if(localStorage.getItem(newKey)) {
      console.log(`Progresso existente encontrado para ${currentUser}`);
      return;
    }
    
    // Verificar se existe progresso antigo
    const oldProgress = localStorage.getItem(oldKey);
    if(oldProgress){
      console.log(`Migrando progresso antigo para ${currentUser}`);
      localStorage.setItem(newKey, oldProgress);
      // Não remover o antigo ainda para não perder dados
    } else {
      // Criar progresso vazio para usuário novo
      console.log(`Criando progresso vazio para novo usuário: ${currentUser}`);
      const emptyProgress = getDefaultProgress();
      localStorage.setItem(newKey, JSON.stringify(emptyProgress));
    }
  }

  // Função para limpar progresso ao fazer logout
  function clearProgressCache(){
    // Não remove do localStorage, apenas limpa cache em memória se houver
    console.log('Cache de progresso limpo (localStorage preservado)');
  }
  
  // Função para verificar e garantir que o usuário logado tenha progresso
  function ensureUserProgress(){
    const currentUser = getCurrentUser();
    if(!currentUser){
      console.warn('Nenhum usuário logado');
      return false;
    }
    
    const storageKey = getStorageKey();
    const existingProgress = localStorage.getItem(storageKey);
    
    if(!existingProgress){
      console.log(`Inicializando progresso para ${currentUser}`);
      const emptyProgress = getDefaultProgress();
      localStorage.setItem(storageKey, JSON.stringify(emptyProgress));
      return true;
    }
    
    console.log(`Progresso já existe para ${currentUser}`);
    return true;
  }

  // Exportar API pública
  window.UserProgress = {
    loadProgress,
    saveProgress,
    completeLesson,
    isLessonCompleted,
    getUserStats,
    getInstrumentProgress,
    resetProgress,
    clearProgressCache,
    ensureUserProgress,
    getCurrentUser,
    ACHIEVEMENTS
  };

  // Tentar migrar progresso antigo ao carregar
  migrateOldProgress();
  
  // Garantir que o usuário tenha progresso inicializado
  ensureUserProgress();

  console.log('UserProgress API carregada');
  const currentUser = getCurrentUser();
  if(currentUser){
    console.log(`Usuário autenticado: ${currentUser}`);
  } else {
    console.warn('Nenhum usuário autenticado');
  }
})();
