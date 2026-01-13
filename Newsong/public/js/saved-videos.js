// saved-videos.js - Sistema de gerenciamento de vídeos salvos (isolado por usuário)
(function(){
  const STORAGE_KEY_PREFIX = 'ns-saved-videos';

  // Helper para obter usuário atual
  function getCurrentUser(){
    try {
      const session = localStorage.getItem('ns-session');
      if(!session) return null;
      return JSON.parse(session);
    } catch(error){
      console.error('Erro ao obter sessão:', error);
      return null;
    }
  }

  // Helper para obter chave de storage do usuário atual
  function getUserStorageKey(){
    const user = getCurrentUser();
    if(!user || !user.email){
      console.warn('Usuário não logado - usando chave padrão');
      return STORAGE_KEY_PREFIX; // Fallback para usuários não logados
    }
    // Criar chave única baseada no email do usuário
    const emailKey = user.email.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${STORAGE_KEY_PREFIX}-${emailKey}`;
  }

  const SavedVideos = {
    // Salvar um vídeo (isolado por usuário)
    saveVideo: function(video){
      try {
        const user = getCurrentUser();
        if(!user || !user.email){
          console.error('Usuário não logado');
          return { success: false, message: 'Você precisa estar logado para salvar vídeos!' };
        }

        const storageKey = getUserStorageKey();
        const savedVideos = this.getSavedVideos();
        
        // Check if already saved
        const exists = savedVideos.some(v => v.id === video.id);
        if(exists){
          return { success: false, message: 'Este vídeo já está nos seus salvos!' };
        }

        // Para vídeos de upload, não salvar o fileData completo (muito pesado)
        // Apenas salvar a referência ao ID para recuperar do IndexedDB depois
        const savedVideo = {
          ...video,
          savedAt: new Date().toISOString(),
          savedBy: user.email,
          savedByName: user.name
        };
        
        // Se for vídeo de upload por arquivo, remover fileData (muito pesado para localStorage)
        if(savedVideo.isUploaded && savedVideo.uploadType === 'file' && savedVideo.fileData){
          console.log('⚠️ Vídeo de upload detectado - removendo fileData pesado do localStorage');
          // Manter apenas a referência, o arquivo está no IndexedDB
          delete savedVideo.fileData;
          savedVideo._hasFileData = true; // Flag para indicar que o arquivo existe no IndexedDB
        }
        
        // Também remover thumbnailData se for muito grande
        if(savedVideo.thumbnailData && savedVideo.thumbnailData.length > 100000){
          console.log('⚠️ Thumbnail muito grande - removendo do localStorage');
          delete savedVideo.thumbnailData;
        }

        savedVideos.push(savedVideo);
        
        try {
          localStorage.setItem(storageKey, JSON.stringify(savedVideos));
          console.log(`✅ Vídeo salvo para ${user.email}:`, video.title);
          
          // Adicionar XP por salvar vídeo (se XPSystem estiver disponível)
          if (window.XPSystem) {
            window.XPSystem.saveVideo(video.id);
          }
          
          return { success: true, message: 'Vídeo salvo com sucesso!' };
        } catch(storageError){
          console.error('Erro de espaço no localStorage:', storageError);
          // Se falhar por espaço, tentar remover dados pesados e salvar novamente
          savedVideos.pop(); // Remove o vídeo que acabamos de adicionar
          return { success: false, message: 'Armazenamento cheio. Libere espaço removendo vídeos salvos antigos.' };
        }
      } catch(error){
        console.error('Erro ao salvar vídeo:', error);
        return { success: false, message: 'Erro ao salvar vídeo: ' + error.message };
      }
    },

    // Remover um vídeo dos salvos (isolado por usuário)
    unsaveVideo: function(videoId){
      try {
        const user = getCurrentUser();
        if(!user || !user.email){
          return { success: false, message: 'Você precisa estar logado!' };
        }

        const storageKey = getUserStorageKey();
        let savedVideos = this.getSavedVideos();
        const initialLength = savedVideos.length;
        
        savedVideos = savedVideos.filter(v => v.id !== videoId);
        
        if(savedVideos.length === initialLength){
          return { success: false, message: 'Vídeo não encontrado nos seus salvos' };
        }

        localStorage.setItem(storageKey, JSON.stringify(savedVideos));
        
        console.log(`✅ Vídeo removido dos salvos de ${user.email}:`, videoId);
        return { success: true, message: 'Vídeo removido dos salvos!' };
      } catch(error){
        console.error('Erro ao remover vídeo:', error);
        return { success: false, message: 'Erro ao remover vídeo' };
      }
    },

    // Verificar se um vídeo está salvo
    isSaved: function(videoId){
      const savedVideos = this.getSavedVideos();
      return savedVideos.some(v => v.id === videoId);
    },

    // Obter todos os vídeos salvos (apenas do usuário atual)
    getSavedVideos: function(){
      try {
        const user = getCurrentUser();
        if(!user || !user.email){
          console.warn('Usuário não logado - retornando array vazio');
          return [];
        }

        const storageKey = getUserStorageKey();
        const saved = localStorage.getItem(storageKey);
        const videos = saved ? JSON.parse(saved) : [];
        
        console.log(`📹 Carregados ${videos.length} vídeos salvos de ${user.email}`);
        return videos;
      } catch(error){
        console.error('Erro ao carregar vídeos salvos:', error);
        return [];
      }
    },

    // Obter vídeos salvos por instrumento
    getSavedByInstrument: function(instrument){
      const allSaved = this.getSavedVideos();
      return allSaved.filter(v => v.instrument === instrument);
    },

    // Obter vídeos salvos por aula
    getSavedByLesson: function(lessonId){
      const allSaved = this.getSavedVideos();
      return allSaved.filter(v => v.lessonId === lessonId);
    },

    // Obter estatísticas dos salvos
    getStatistics: function(){
      const savedVideos = this.getSavedVideos();
      
      // Count lessons
      const uniqueLessons = [...new Set(savedVideos.map(v => v.lessonId))];
      
      // Count instruments
      const uniqueInstruments = [...new Set(savedVideos.map(v => v.instrument || 'guitar'))];
      
      // Count by instrument
      const byInstrument = {};
      savedVideos.forEach(v => {
        const inst = v.instrument || 'guitar';
        byInstrument[inst] = (byInstrument[inst] || 0) + 1;
      });

      return {
        totalVideos: savedVideos.length,
        totalLessons: uniqueLessons.length,
        totalInstruments: uniqueInstruments.length,
        byInstrument: byInstrument,
        lastSaved: savedVideos.length > 0 ? savedVideos[savedVideos.length - 1].savedAt : null
      };
    },

    // Agrupar vídeos por aula
    groupByLesson: function(){
      const savedVideos = this.getSavedVideos();
      const grouped = {};

      savedVideos.forEach(video => {
        const lessonKey = video.lessonId || 'unknown';
        if(!grouped[lessonKey]){
          grouped[lessonKey] = {
            lessonId: video.lessonId,
            lessonTitle: video.lessonTitle || 'Aula sem título',
            instrument: video.instrument || 'guitar',
            videos: []
          };
        }
        grouped[lessonKey].videos.push(video);
      });

      return Object.values(grouped);
    },

    // Limpar todos os salvos do usuário atual (debug)
    clearAll: function(){
      const user = getCurrentUser();
      if(!user || !user.email){
        return { success: false, message: 'Você precisa estar logado!' };
      }

      const storageKey = getUserStorageKey();
      localStorage.removeItem(storageKey);
      console.log(`✅ Todos os vídeos salvos de ${user.email} foram removidos`);
      return { success: true, message: 'Seus salvos foram limpos com sucesso!' };
    },

    // Função helper para obter informações do usuário atual
    getCurrentUserInfo: function(){
      return getCurrentUser();
    },

    // Função de debug para ver todos os salvos de todos os usuários (admin)
    getAllUsersSaved: function(){
      const allSaved = {};
      for(let i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i);
        if(key && key.startsWith(STORAGE_KEY_PREFIX)){
          try {
            const data = JSON.parse(localStorage.getItem(key));
            allSaved[key] = data;
          } catch(e){
            console.error('Erro ao ler:', key);
          }
        }
      }
      return allSaved;
    }
  };

  // Expose to global
  window.SavedVideos = SavedVideos;

  console.log('💾 SavedVideos API carregada e exposta em window.SavedVideos');
  
  // Debug: Verificar usuário atual
  const currentUser = getCurrentUser();
  if(currentUser){
    console.log('✅ Usuário logado:', currentUser.email, '- Chave:', getUserStorageKey());
  } else {
    console.warn('⚠️ Nenhum usuário logado - funcionalidade de salvos limitada');
  }
})();
