// xp-system.js - Sistema de XP e Gamificação
(function() {
  'use strict';

  // Configuração de XP por atividade
  const XP_CONFIG = {
    VIDEO_WATCH_25: 5,
    VIDEO_WATCH_50: 10,
    VIDEO_WATCH_75: 15,
    VIDEO_WATCH_100: 25,
    VIDEO_FIRST_TIME: 10,
    LESSON_COMPLETE: 50,
    MODULE_COMPLETE: 200,
    SAVE_VIDEO: 2,
    RATE_TEACHER: 5,
    DAILY_BONUS: 10,
    STREAK_3_DAYS: 20,
    STREAK_7_DAYS: 50,
    STREAK_30_DAYS: 200,
    STREAK_100_DAYS: 1000
  };

  // Configuração de níveis
  const LEVEL_THRESHOLDS = [
    { level: 1, minXP: 0, maxXP: 100, name: 'Iniciante' },
    { level: 2, minXP: 101, maxXP: 300, name: 'Aprendiz' },
    { level: 3, minXP: 301, maxXP: 600, name: 'Estudante' },
    { level: 4, minXP: 601, maxXP: 1000, name: 'Dedicado' },
    { level: 5, minXP: 1001, maxXP: 1500, name: 'Expert' },
    { level: 6, minXP: 1501, maxXP: Infinity, name: 'Mestre' }
  ];

  // Sistema de XP
  window.XPSystem = {
    // Adicionar XP ao usuário
    async addXP(actionType, amount, referenceId = null, description = null) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.error('Usuário não autenticado');
          return null;
        }

        // Chamar função do banco de dados
        const { data, error } = await supabase.rpc('add_xp_to_user', {
          p_user_id: session.user.id,
          p_xp_amount: amount,
          p_action_type: actionType,
          p_reference_id: referenceId,
          p_description: description
        });

        if (error) {
          console.error('Erro ao adicionar XP:', error);
          return null;
        }

        // Mostrar notificação de XP ganho
        this.showXPNotification(data);

        return data;
      } catch (error) {
        console.error('Erro ao adicionar XP:', error);
        return null;
      }
    },

    // Atualizar streak do usuário
    async updateStreak() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;

        const { data, error } = await supabase.rpc('update_user_streak', {
          p_user_id: session.user.id
        });

        if (error) {
          console.error('Erro ao atualizar streak:', error);
          return null;
        }

        // Se ganhou bônus de streak, mostrar notificação especial
        if (data.bonus_xp > 0) {
          this.showStreakBonusNotification(data);
        }

        return data;
      } catch (error) {
        console.error('Erro ao atualizar streak:', error);
        return null;
      }
    },

    // Buscar dados de XP do usuário
    async getUserXP() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;

        const { data, error } = await supabase
          .from('user_xp')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = not found
          console.error('Erro ao buscar XP:', error);
          return null;
        }

        return data || { total_xp: 0, level: 1, current_streak: 0 };
      } catch (error) {
        console.error('Erro ao buscar XP:', error);
        return null;
      }
    },

    // Buscar ranking do usuário
    async getUserRanking() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;

        const { data, error } = await supabase.rpc('get_user_ranking', {
          p_user_id: session.user.id
        });

        if (error) {
          console.error('Erro ao buscar ranking:', error);
          return null;
        }

        return data;
      } catch (error) {
        console.error('Erro ao buscar ranking:', error);
        return null;
      }
    },

    // Calcular nível baseado em XP
    calculateLevel(xp) {
      if (xp <= 100) return 1;
      if (xp <= 300) return 2;
      if (xp <= 600) return 3;
      if (xp <= 1000) return 4;
      if (xp <= 1500) return 5;
      return 6 + Math.floor((xp - 1500) / 500);
    },

    // Obter informações do nível
    getLevelInfo(level) {
      if (level <= 5) {
        return LEVEL_THRESHOLDS[level - 1];
      }
      const minXP = 1501 + ((level - 6) * 500);
      return {
        level: level,
        minXP: minXP,
        maxXP: minXP + 500,
        name: 'Mestre'
      };
    },

    // Calcular progresso para o próximo nível
    getLevelProgress(xp) {
      const level = this.calculateLevel(xp);
      const levelInfo = this.getLevelInfo(level);
      const nextLevelInfo = this.getLevelInfo(level + 1);
      
      const currentLevelXP = xp - levelInfo.minXP;
      const xpForNextLevel = nextLevelInfo.minXP - levelInfo.minXP;
      const progress = (currentLevelXP / xpForNextLevel) * 100;

      return {
        level,
        levelName: levelInfo.name,
        currentXP: xp,
        currentLevelXP: currentLevelXP,
        xpForNextLevel: xpForNextLevel,
        xpNeeded: nextLevelInfo.minXP - xp,
        progress: Math.min(progress, 100)
      };
    },

    // Mostrar notificação de XP ganho
    showXPNotification(data) {
      const { xp_gained, total_xp, level, level_up } = data;

      // Se subiu de nível, mostrar notificação especial
      if (level_up) {
        this.showLevelUpNotification(level);
      }

      // Criar notificação de XP
      const notification = document.createElement('div');
      notification.className = 'xp-notification';
      notification.innerHTML = `
        <div class="xp-notification-content">
          <div class="xp-icon">✨</div>
          <div class="xp-info">
            <span class="xp-amount">+${xp_gained} XP</span>
            <span class="xp-total">${total_xp} XP Total</span>
          </div>
        </div>
      `;

      document.body.appendChild(notification);

      // Animar entrada
      setTimeout(() => notification.classList.add('show'), 100);

      // Remover após 3 segundos
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    },

    // Mostrar notificação de level up
    showLevelUpNotification(level) {
      const levelInfo = this.getLevelInfo(level);
      
      const notification = document.createElement('div');
      notification.className = 'level-up-notification';
      notification.innerHTML = `
        <div class="level-up-content">
          <div class="level-up-icon">🎉</div>
          <div class="level-up-text">
            <h3>Subiu de Nível!</h3>
            <p>Nível ${level} - ${levelInfo.name}</p>
          </div>
        </div>
      `;

      document.body.appendChild(notification);

      // Animar entrada
      setTimeout(() => notification.classList.add('show'), 100);

      // Remover após 5 segundos
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 5000);
    },

    // Mostrar notificação de bônus de streak
    showStreakBonusNotification(data) {
      const { streak, bonus_xp } = data;
      
      const notification = document.createElement('div');
      notification.className = 'streak-bonus-notification';
      notification.innerHTML = `
        <div class="streak-bonus-content">
          <div class="streak-icon">🔥</div>
          <div class="streak-info">
            <h3>${streak} Dias Consecutivos!</h3>
            <p>Bônus: +${bonus_xp} XP</p>
          </div>
        </div>
      `;

      document.body.appendChild(notification);

      // Animar entrada
      setTimeout(() => notification.classList.add('show'), 100);

      // Remover após 5 segundos
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 5000);
    },

    // Registrar visualização de vídeo (chamado quando vídeo atinge certas porcentagens)
    async trackVideoProgress(videoId, progress) {
      // Verificar marcos de progresso
      let xpAmount = 0;
      let actionType = '';
      
      if (progress >= 0.25 && progress < 0.5) {
        actionType = 'video_watch_25';
        xpAmount = XP_CONFIG.VIDEO_WATCH_25;
      } else if (progress >= 0.5 && progress < 0.75) {
        actionType = 'video_watch_50';
        xpAmount = XP_CONFIG.VIDEO_WATCH_50;
      } else if (progress >= 0.75 && progress < 1.0) {
        actionType = 'video_watch_75';
        xpAmount = XP_CONFIG.VIDEO_WATCH_75;
      } else if (progress >= 1.0) {
        actionType = 'video_watch_100';
        xpAmount = XP_CONFIG.VIDEO_WATCH_100;
      }

      if (xpAmount > 0) {
        // Verificar se já ganhou XP por este marco neste vídeo
        const key = `xp_${actionType}_${videoId}`;
        if (sessionStorage.getItem(key)) {
          return; // Já ganhou XP por este marco
        }

        // Marcar como ganho
        sessionStorage.setItem(key, 'true');

        // Adicionar XP
        await this.addXP(actionType, xpAmount, videoId, 
          `Assistiu ${Math.round(progress * 100)}% do vídeo`);
      }
    },

    // Registrar conclusão de aula
    async completeLesson(lessonId) {
      await this.addXP('lesson_complete', XP_CONFIG.LESSON_COMPLETE, lessonId, 
        'Aula completa!');
    },

    // Registrar salvamento de vídeo
    async saveVideo(videoId) {
      await this.addXP('save_video', XP_CONFIG.SAVE_VIDEO, videoId, 
        'Vídeo salvo');
    },

    // Registrar avaliação de professor
    async rateTeacher(teacherId) {
      await this.addXP('rate_teacher', XP_CONFIG.RATE_TEACHER, teacherId, 
        'Avaliou um professor');
    },

    // Inicializar sistema (verificar streak diário)
    async initialize() {
      try {
        // Atualizar streak
        const streakData = await this.updateStreak();
        
        // Se é um novo dia, dar bônus diário
        if (streakData && streakData.is_new_day) {
          await this.addXP('daily_bonus', XP_CONFIG.DAILY_BONUS, null, 
            'Bônus diário de login');
        }

        return true;
      } catch (error) {
        console.error('Erro ao inicializar XP System:', error);
        return false;
      }
    }
  };

  // Inicializar quando o documento carregar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Aguardar supabase estar pronto
      setTimeout(() => XPSystem.initialize(), 1000);
    });
  } else {
    setTimeout(() => XPSystem.initialize(), 1000);
  }

})();
