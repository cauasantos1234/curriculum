// ranking-system.js - Sistema de Ranking
(function() {
  'use strict';

  window.RankingSystem = {
    // Buscar ranking por XP
    async getRankingByXP(limit = 10) {
      try {
        console.log('📊 Buscando ranking por XP...');
        
        const { data, error } = await supabase
          .from('ranking_by_xp')
          .select('*')
          .limit(limit);

        if (error) {
          console.error('❌ Erro ao buscar ranking por XP:', error);
          console.error('Detalhes:', error.message, error.details, error.hint);
          return [];
        }

        console.log('✅ Ranking por XP carregado:', data?.length, 'usuários');
        return data || [];
      } catch (error) {
        console.error('❌ Erro ao buscar ranking por XP:', error);
        return [];
      }
    },

    // Buscar ranking por streak
    async getRankingByStreak(limit = 10) {
      try {
        console.log('📊 Buscando ranking por streak...');
        
        const { data, error } = await supabase
          .from('ranking_by_streak')
          .select('*')
          .limit(limit);

        if (error) {
          console.error('❌ Erro ao buscar ranking por streak:', error);
          console.error('Detalhes:', error.message, error.details, error.hint);
          return [];
        }

        console.log('✅ Ranking por streak carregado:', data?.length, 'usuários');
        return data || [];
      } catch (error) {
        console.error('❌ Erro ao buscar ranking por streak:', error);
        return [];
      }
    },

    // Buscar posição do usuário atual
    async getCurrentUserRanking() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.warn('⚠️ Usuário não autenticado para buscar ranking');
          return null;
        }

        console.log('🔍 Buscando ranking do usuário:', session.user.id);

        const { data, error } = await supabase.rpc('get_user_ranking', {
          p_user_id: session.user.id
        });

        if (error) {
          console.error('❌ Erro ao buscar posição do usuário:', error);
          return null;
        }

        console.log('✅ Ranking do usuário:', data);
        return data;
      } catch (error) {
        console.error('❌ Erro ao buscar posição do usuário:', error);
        return null;
      }
    },

    // Renderizar tabela de ranking
    renderRankingTable(rankings, type = 'xp') {
      if (!rankings || rankings.length === 0) {
        return `
          <div class="ranking-empty-state">
            <div class="empty-icon">🏆</div>
            <h3>Seja o primeiro no ranking!</h3>
            <p>Complete aulas e ganhe XP para aparecer aqui.</p>
          </div>
        `;
      }

      let html = '<div class="ranking-grid">';

      rankings.forEach((user, index) => {
        const isTop3 = index < 3;
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        const rankClass = isTop3 ? 'top-rank' : '';
        const rankColor = index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#d4af37';
        
        // Gerar avatar ou iniciais
        const avatarContent = user.avatar_url 
          ? `<img src="${user.avatar_url}" alt="${this.escapeHtml(user.user_name)}" class="rank-avatar-img">`
          : `<div class="rank-avatar-initials">${this.getInitials(user.user_name)}</div>`;

        html += `
          <div class="rank-card ${rankClass}" data-rank="${index + 1}">
            <div class="rank-position" style="color: ${rankColor}">
              ${medal || `#${user.rank}`}
            </div>
            <div class="rank-user">
              <div class="rank-avatar">
                ${avatarContent}
              </div>
              <div class="rank-user-info">
                <h4 class="rank-username">${this.escapeHtml(user.user_name || 'Usuário')}</h4>
                <div class="rank-badges">
                  <span class="rank-badge level">Nv. ${user.level}</span>
                  ${type === 'xp' 
                    ? `<span class="rank-badge xp">${user.total_xp.toLocaleString()} XP</span>`
                    : `<span class="rank-badge streak">🔥 ${user.current_streak} dias</span>`
                  }
                </div>
              </div>
            </div>
            <div class="rank-stats">
              ${type === 'xp' 
                ? `<div class="rank-stat">
                     <span class="stat-icon">🔥</span>
                     <span class="stat-text">${user.current_streak > 0 ? user.current_streak + ' dias' : 'Sem streak'}</span>
                   </div>`
                : `<div class="rank-stat">
                     <span class="stat-icon">⭐</span>
                     <span class="stat-text">${user.total_xp.toLocaleString()} XP</span>
                   </div>
                   <div class="rank-stat">
                     <span class="stat-icon">📊</span>
                     <span class="stat-text">Record: ${user.longest_streak}</span>
                   </div>`
              }
            </div>
          </div>
        `;
      });

      html += '</div>';
      return html;
    },

    // Renderizar card do usuário atual
    renderUserCard(userRanking, userXP) {
      if (!userRanking || !userXP) {
        return '';
      }

      const levelProgress = XPSystem.getLevelProgress(userXP.total_xp);

      return `
        <div class="user-ranking-card">
          <div class="user-ranking-header">
            <h3>Sua Posição</h3>
          </div>
          <div class="user-ranking-content">
            <div class="user-ranking-stats">
              <div class="user-stat">
                <span class="stat-label">Ranking XP</span>
                <span class="stat-value">#${userRanking.xp_rank}</span>
              </div>
              <div class="user-stat">
                <span class="stat-label">Nível</span>
                <span class="stat-value">${levelProgress.level}</span>
              </div>
              <div class="user-stat">
                <span class="stat-label">XP Total</span>
                <span class="stat-value">${userXP.total_xp}</span>
              </div>
              <div class="user-stat">
                <span class="stat-label">Streak</span>
                <span class="stat-value">🔥 ${userXP.current_streak}</span>
              </div>
            </div>
            <div class="level-progress-container">
              <div class="level-progress-header">
                <span class="level-name">${levelProgress.levelName}</span>
                <span class="level-next">Próximo: ${levelProgress.xpNeeded} XP</span>
              </div>
              <div class="level-progress-bar">
                <div class="level-progress-fill" style="width: ${levelProgress.progress}%"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    // Obter iniciais do nome
    getInitials(name) {
      if (!name) return 'U';
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    },

    // Escapar HTML
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  };

})();
