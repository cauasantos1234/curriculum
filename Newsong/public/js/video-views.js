// video-views.js - Sistema de rastreamento de visualizações por usuário
(function() {
  console.log('👁️ Video Views System loaded');
  console.log('🔧 Inicializando sistema de visualizações...');

  // Chave de armazenamento
  const VIEWS_STORAGE_KEY = 'ns-video-views';
  const VIDEO_STATS_KEY = 'ns-video-stats';

  /**
   * Estrutura de dados:
   * ns-video-views: {
   *   "user@email.com": {
   *     "videoId1": { viewedAt: timestamp, count: 1 },
   *     "videoId2": { viewedAt: timestamp, count: 1 }
   *   }
   * }
   * 
   * ns-video-stats: {
   *   "videoId1": { totalViews: 5, uniqueViewers: 3 },
   *   "videoId2": { totalViews: 10, uniqueViewers: 7 }
   * }
   */

  // Obter sessão do usuário
  function getCurrentUser() {
    const sessionData = localStorage.getItem('ns-session');
    console.log('🔍 Buscando sessão:', sessionData ? 'Encontrada' : 'Não encontrada');
    
    if (!sessionData) {
      console.warn('⚠️ Nenhuma sessão encontrada no localStorage');
      return null;
    }
    
    try {
      const session = JSON.parse(sessionData);
      console.log('✅ Usuário atual:', session.email);
      return session.email || null;
    } catch (e) {
      console.error('❌ Erro ao obter usuário:', e);
      return null;
    }
  }

  // Obter dados de visualizações por usuário
  function getUserViews() {
    try {
      const data = localStorage.getItem(VIEWS_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Erro ao carregar visualizações:', e);
      return {};
    }
  }

  // Salvar dados de visualizações por usuário
  function saveUserViews(viewsData) {
    try {
      localStorage.setItem(VIEWS_STORAGE_KEY, JSON.stringify(viewsData));
      return true;
    } catch (e) {
      console.error('Erro ao salvar visualizações:', e);
      return false;
    }
  }

  // Obter estatísticas globais dos vídeos
  function getVideoStats() {
    try {
      const data = localStorage.getItem(VIDEO_STATS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Erro ao carregar stats:', e);
      return {};
    }
  }

  // Salvar estatísticas globais dos vídeos
  function saveVideoStats(statsData) {
    try {
      localStorage.setItem(VIDEO_STATS_KEY, JSON.stringify(statsData));
      return true;
    } catch (e) {
      console.error('Erro ao salvar stats:', e);
      return false;
    }
  }

  /**
   * Registrar visualização de vídeo
   * @param {string} videoId - ID do vídeo (pode ser lessonId ou videoUploadId)
   * @returns {Object} - { counted: boolean, isFirstView: boolean, totalViews: number }
   */
  function registerView(videoId) {
    console.log('📹 registerView chamado com videoId:', videoId);
    
    const userEmail = getCurrentUser();
    
    if (!userEmail) {
      console.warn('⚠️ Usuário não autenticado - visualização não contada');
      return { counted: false, isFirstView: false, totalViews: 0 };
    }
    
    console.log('👤 Usuário logado:', userEmail);

    if (!videoId) {
      console.error('❌ ID do vídeo não fornecido');
      return { counted: false, isFirstView: false, totalViews: 0 };
    }

    // Converter videoId para string
    videoId = String(videoId);
    console.log('🎬 Processando vídeo ID:', videoId);

    // Obter dados atuais
    const userViews = getUserViews();
    const videoStats = getVideoStats();
    
    console.log('📊 Dados atuais - userViews:', userViews);
    console.log('📊 Dados atuais - videoStats:', videoStats);

    // Verificar se usuário já viu este vídeo
    if (!userViews[userEmail]) {
      userViews[userEmail] = {};
      console.log('🆕 Primeiro vídeo para este usuário');
    }

    const hasViewed = userViews[userEmail][videoId] !== undefined;
    const isFirstView = !hasViewed;
    
    console.log(`🔍 Usuário já viu este vídeo? ${hasViewed ? 'SIM' : 'NÃO'}`);

    // Se é a primeira vez que este usuário vê este vídeo
    if (isFirstView) {
      console.log('✨ PRIMEIRA VISUALIZAÇÃO! Registrando...');
      
      // Registrar visualização do usuário
      userViews[userEmail][videoId] = {
        viewedAt: new Date().toISOString(),
        count: 1
      };

      // Atualizar estatísticas globais do vídeo
      if (!videoStats[videoId]) {
        videoStats[videoId] = {
          totalViews: 0,
          uniqueViewers: 0,
          viewersList: []
        };
      }

      videoStats[videoId].totalViews += 1;
      videoStats[videoId].uniqueViewers += 1;
      
      if (!videoStats[videoId].viewersList.includes(userEmail)) {
        videoStats[videoId].viewersList.push(userEmail);
      }

      // Salvar dados
      const saved1 = saveUserViews(userViews);
      const saved2 = saveVideoStats(videoStats);
      
      console.log('💾 Salvando userViews:', saved1 ? 'OK' : 'ERRO');
      console.log('💾 Salvando videoStats:', saved2 ? 'OK' : 'ERRO');

      console.log(`✅ Nova visualização contada para vídeo ${videoId} por ${userEmail}`);
      console.log(`   Total de visualizações: ${videoStats[videoId].totalViews}`);
      console.log(`   Visualizadores únicos: ${videoStats[videoId].uniqueViewers}`);

      return {
        counted: true,
        isFirstView: true,
        totalViews: videoStats[videoId].totalViews,
        uniqueViewers: videoStats[videoId].uniqueViewers
      };
    } else {
      // Usuário já viu este vídeo - não conta novamente
      console.log(`ℹ️ Usuário ${userEmail} já visualizou o vídeo ${videoId} - não contado novamente`);
      
      const currentStats = videoStats[videoId] || { totalViews: 0, uniqueViewers: 0 };
      
      return {
        counted: false,
        isFirstView: false,
        totalViews: currentStats.totalViews,
        uniqueViewers: currentStats.uniqueViewers
      };
    }
  }

  /**
   * Verificar se usuário já visualizou um vídeo
   * @param {string} videoId - ID do vídeo
   * @returns {boolean}
   */
  function hasUserViewedVideo(videoId) {
    const userEmail = getCurrentUser();
    if (!userEmail) return false;

    videoId = String(videoId);
    const userViews = getUserViews();

    return userViews[userEmail] && userViews[userEmail][videoId] !== undefined;
  }

  /**
   * Obter estatísticas de um vídeo
   * @param {string} videoId - ID do vídeo
   * @returns {Object}
   */
  function getVideoViewStats(videoId) {
    videoId = String(videoId);
    const videoStats = getVideoStats();
    
    return videoStats[videoId] || {
      totalViews: 0,
      uniqueViewers: 0,
      viewersList: []
    };
  }

  /**
   * Obter todas as visualizações de um usuário
   * @param {string} userEmail - Email do usuário (opcional, usa o atual se não fornecido)
   * @returns {Object}
   */
  function getUserViewHistory(userEmail = null) {
    if (!userEmail) {
      userEmail = getCurrentUser();
    }
    
    if (!userEmail) return {};

    const userViews = getUserViews();
    return userViews[userEmail] || {};
  }

  /**
   * Obter vídeos mais visualizados
   * @param {number} limit - Número de vídeos a retornar
   * @returns {Array}
   */
  function getTopVideos(limit = 10) {
    const videoStats = getVideoStats();
    
    const sorted = Object.entries(videoStats)
      .map(([videoId, stats]) => ({
        videoId,
        ...stats
      }))
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, limit);
    
    return sorted;
  }

  /**
   * Limpar dados de visualizações (apenas para debug)
   */
  function clearAllViews() {
    localStorage.removeItem(VIEWS_STORAGE_KEY);
    localStorage.removeItem(VIDEO_STATS_KEY);
    console.log('🗑️ Todos os dados de visualizações foram limpos');
  }

  /**
   * Obter resumo de estatísticas
   */
  function getViewsSummary() {
    const userViews = getUserViews();
    const videoStats = getVideoStats();
    
    const totalUsers = Object.keys(userViews).length;
    const totalVideos = Object.keys(videoStats).length;
    const totalViews = Object.values(videoStats).reduce((sum, stat) => sum + stat.totalViews, 0);
    
    return {
      totalUsers,
      totalVideos,
      totalViews,
      averageViewsPerVideo: totalVideos > 0 ? (totalViews / totalVideos).toFixed(1) : 0
    };
  }

  // Exportar funções globalmente
  window.VideoViews = {
    registerView,
    hasUserViewedVideo,
    getVideoViewStats,
    getUserViewHistory,
    getTopVideos,
    clearAllViews,
    getViewsSummary,
    getCurrentUser
  };

  // Debug - expor no console
  window.debugVideoViews = {
    showAll: () => {
      console.log('=== USER VIEWS ===');
      console.log(getUserViews());
      console.log('=== VIDEO STATS ===');
      console.log(getVideoStats());
      console.log('=== SUMMARY ===');
      console.log(getViewsSummary());
    },
    clearAll: clearAllViews,
    getUserViews: () => getUserViews(),
    getVideoStats: () => getVideoStats(),
    getSummary: () => getViewsSummary()
  };

  console.log('✅ Video Views System ready');
  console.log('💡 Use debugVideoViews.showAll() no console para ver dados');
})();
