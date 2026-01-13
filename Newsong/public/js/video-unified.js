// video-unified.js - Sistema Unificado de Vídeos
// Integra vídeos das aulas (hardcoded) com vídeos enviados (IndexedDB)
(function() {
  console.log('🎯 Sistema Unificado de Vídeos carregado');

  const LIKES_KEY = 'ns-video-likes';
  const DISLIKES_KEY = 'ns-video-dislikes';

  // Obter usuário atual
  function getCurrentUser() {
    const sessionData = localStorage.getItem('ns-session');
    if (!sessionData) return null;
    try {
      return JSON.parse(sessionData);
    } catch (e) {
      return null;
    }
  }

  // Obter todos os likes
  function getAllLikes() {
    try {
      return JSON.parse(localStorage.getItem(LIKES_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  // Obter todos os dislikes
  function getAllDislikes() {
    try {
      return JSON.parse(localStorage.getItem(DISLIKES_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  // Salvar likes
  function saveLikes(likes) {
    localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
  }

  // Salvar dislikes
  function saveDislikes(dislikes) {
    localStorage.setItem(DISLIKES_KEY, JSON.stringify(dislikes));
  }

  /**
   * Dar like em um vídeo
   * @param {string|number} videoId 
   * @returns {Object} { success, likes, dislikes, userLiked, userDisliked }
   */
  function likeVideo(videoId) {
    const user = getCurrentUser();
    if (!user || !user.email) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    videoId = String(videoId);
    const likes = getAllLikes();
    const dislikes = getAllDislikes();

    // Inicializar se não existir
    if (!likes[videoId]) likes[videoId] = [];
    if (!dislikes[videoId]) dislikes[videoId] = [];

    // Verificar se usuário já deu like
    const userLikeIndex = likes[videoId].indexOf(user.email);
    const userDislikeIndex = dislikes[videoId].indexOf(user.email);

    // Remover dislike se existir
    if (userDislikeIndex !== -1) {
      dislikes[videoId].splice(userDislikeIndex, 1);
    }

    // Toggle like
    if (userLikeIndex !== -1) {
      // Remover like
      likes[videoId].splice(userLikeIndex, 1);
    } else {
      // Adicionar like
      likes[videoId].push(user.email);
    }

    saveLikes(likes);
    saveDislikes(dislikes);
    
    console.log('💾 Likes salvos:', JSON.stringify(likes));
    console.log('💾 Dislikes salvos:', JSON.stringify(dislikes));

    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('videoLikeChanged', {
      detail: { 
        videoId, 
        likes: likes[videoId].length, 
        dislikes: dislikes[videoId].length,
        userLiked: likes[videoId].includes(user.email),
        userDisliked: dislikes[videoId].includes(user.email)
      }
    }));

    console.log(`👍 Like atualizado - Video ${videoId}: ${likes[videoId].length} likes, ${dislikes[videoId].length} dislikes`);
    console.log(`👤 Usuário ${user.email}: liked=${likes[videoId].includes(user.email)}, disliked=${dislikes[videoId].includes(user.email)}`);

    return {
      success: true,
      likes: likes[videoId].length,
      dislikes: dislikes[videoId].length,
      userLiked: likes[videoId].includes(user.email),
      userDisliked: dislikes[videoId].includes(user.email)
    };
  }

  /**
   * Dar dislike em um vídeo
   * @param {string|number} videoId 
   * @returns {Object} { success, likes, dislikes, userLiked, userDisliked }
   */
  function dislikeVideo(videoId) {
    const user = getCurrentUser();
    if (!user || !user.email) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    videoId = String(videoId);
    const likes = getAllLikes();
    const dislikes = getAllDislikes();

    // Inicializar se não existir
    if (!likes[videoId]) likes[videoId] = [];
    if (!dislikes[videoId]) dislikes[videoId] = [];

    // Verificar se usuário já deu dislike
    const userLikeIndex = likes[videoId].indexOf(user.email);
    const userDislikeIndex = dislikes[videoId].indexOf(user.email);

    // Remover like se existir
    if (userLikeIndex !== -1) {
      likes[videoId].splice(userLikeIndex, 1);
    }

    // Toggle dislike
    if (userDislikeIndex !== -1) {
      // Remover dislike
      dislikes[videoId].splice(userDislikeIndex, 1);
    } else {
      // Adicionar dislike
      dislikes[videoId].push(user.email);
    }

    saveLikes(likes);
    saveDislikes(dislikes);
    
    console.log('💾 Likes salvos:', JSON.stringify(likes));
    console.log('💾 Dislikes salvos:', JSON.stringify(dislikes));

    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('videoLikeChanged', {
      detail: { 
        videoId, 
        likes: likes[videoId].length, 
        dislikes: dislikes[videoId].length,
        userLiked: likes[videoId].includes(user.email),
        userDisliked: dislikes[videoId].includes(user.email)
      }
    }));

    console.log(`👎 Dislike atualizado - Video ${videoId}: ${likes[videoId].length} likes, ${dislikes[videoId].length} dislikes`);
    console.log(`👤 Usuário ${user.email}: liked=${likes[videoId].includes(user.email)}, disliked=${dislikes[videoId].includes(user.email)}`);

    return {
      success: true,
      likes: likes[videoId].length,
      dislikes: dislikes[videoId].length,
      userLiked: likes[videoId].includes(user.email),
      userDisliked: dislikes[videoId].includes(user.email)
    };
  }

  /**
   * Obter estatísticas de um vídeo
   * @param {string|number} videoId 
   * @returns {Object} { likes, dislikes, userLiked, userDisliked, views }
   */
  function getVideoStats(videoId) {
    const user = getCurrentUser();
    videoId = String(videoId);
    
    const likes = getAllLikes();
    const dislikes = getAllDislikes();

    const likesCount = (likes[videoId] || []).length;
    const dislikesCount = (dislikes[videoId] || []).length;
    
    let userLiked = false;
    let userDisliked = false;

    if (user && user.email) {
      userLiked = (likes[videoId] || []).includes(user.email);
      userDisliked = (dislikes[videoId] || []).includes(user.email);
    }

    // Obter views se VideoViews estiver disponível
    let views = 0;
    if (window.VideoViews && window.VideoViews.getVideoViewStats) {
      const viewStats = window.VideoViews.getVideoViewStats(videoId);
      views = viewStats.totalViews || 0;
    }

    return {
      likes: likesCount,
      dislikes: dislikesCount,
      userLiked,
      userDisliked,
      views
    };
  }

  /**
   * Obter estatísticas de todos os vídeos de um professor
   * @param {string} teacherEmail 
   * @returns {Array} Array de vídeos com estatísticas
   */
  async function getTeacherVideoStats(teacherEmail) {
    console.log('🎯 getTeacherVideoStats chamado para:', teacherEmail);
    const allVideos = [];

    // 1. Obter vídeos do IndexedDB (enviados pelo professor)
    if (window.VideoStorage && window.VideoStorage.getAllVideos) {
      try {
        const uploadedVideos = await window.VideoStorage.getAllVideos();
        console.log('📦 Total de vídeos no banco:', uploadedVideos.length);
        
        const teacherVideos = uploadedVideos.filter(v => v.teacherEmail === teacherEmail);
        console.log('👨‍🏫 Vídeos do professor', teacherEmail + ':', teacherVideos.length);
        
        teacherVideos.forEach(video => {
          const stats = getVideoStats(video.id);
          console.log(`📊 Vídeo ${video.id} (${video.title}):`, {
            likes: stats.likes,
            dislikes: stats.dislikes,
            views: stats.views
          });
          
          allVideos.push({
            ...video,
            likes: stats.likes,
            dislikes: stats.dislikes,
            views: stats.views,
            source: 'uploaded'
          });
        });
        
        console.log('✅ Total de vídeos com estatísticas:', allVideos.length);
      } catch (e) {
        console.error('❌ Erro ao carregar vídeos do IndexedDB:', e);
      }
    } else {
      console.warn('⚠️ VideoStorage não disponível');
    }

    // 2. Adicionar estatísticas dos vídeos hardcoded das aulas
    // (serão exibidos para todos os professores como referência)
    
    return allVideos;
  }

  /**
   * Obter todos os vídeos com estatísticas (aulas + enviados)
   * @returns {Array} Array de todos os vídeos com estatísticas
   */
  async function getAllVideosWithStats() {
    const allVideos = [];

    // 1. Vídeos do IndexedDB
    if (window.VideoStorage && window.VideoStorage.getAllVideos) {
      try {
        const uploadedVideos = await window.VideoStorage.getAllVideos();
        
        uploadedVideos.forEach(video => {
          const stats = getVideoStats(video.id);
          allVideos.push({
            ...video,
            likes: stats.likes,
            dislikes: stats.dislikes,
            views: stats.views,
            source: 'uploaded'
          });
        });
      } catch (e) {
        console.error('Erro ao carregar vídeos:', e);
      }
    }

    return allVideos;
  }

  // API Pública
  window.VideoUnified = {
    likeVideo,
    dislikeVideo,
    getVideoStats,
    getTeacherVideoStats,
    getAllVideosWithStats
  };

  console.log('✅ Sistema Unificado de Vídeos pronto');
})();
