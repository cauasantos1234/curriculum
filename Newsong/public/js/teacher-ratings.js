// teacher-ratings.js - Sistema de avaliação de professores com estrelas
(function(){
  'use strict';
  
  const STORAGE_KEY = 'ns-teacher-ratings';
  const TEACHER_STATS_KEY = 'ns-teacher-stats';
  
  // Classe principal do sistema de avaliações
  class TeacherRatingSystem {
    constructor() {
      this.ratings = this.loadRatings();
      this.teacherStats = this.loadTeacherStats();
    }
    
    // Carregar avaliações do localStorage
    loadRatings() {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        console.error('Erro ao carregar avaliações:', e);
        return [];
      }
    }
    
    // Carregar estatísticas dos professores
    loadTeacherStats() {
      try {
        const data = localStorage.getItem(TEACHER_STATS_KEY);
        return data ? JSON.parse(data) : {};
      } catch (e) {
        console.error('Erro ao carregar estatísticas:', e);
        return {};
      }
    }
    
    // Salvar avaliações
    saveRatings() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.ratings));
      } catch (e) {
        console.error('Erro ao salvar avaliações:', e);
      }
    }
    
    // Salvar estatísticas
    saveTeacherStats() {
      try {
        localStorage.setItem(TEACHER_STATS_KEY, JSON.stringify(this.teacherStats));
      } catch (e) {
        console.error('Erro ao salvar estatísticas:', e);
      }
    }
    
    // Verificar se usuário já avaliou este professor nesta aula
    hasUserRated(userEmail, teacherName, lessonId) {
      return this.ratings.some(rating => 
        rating.userEmail === userEmail &&
        rating.teacherName === teacherName &&
        rating.lessonId === lessonId
      );
    }
    
    // Adicionar avaliação
    addRating(userEmail, teacherName, lessonId, videoId, stars, comment = '') {
      // Verificar se já avaliou
      if (this.hasUserRated(userEmail, teacherName, lessonId)) {
        return {
          success: false,
          message: 'Você já avaliou este professor nesta aula.'
        };
      }
      
      // Validar estrelas (1-5)
      if (stars < 1 || stars > 5) {
        return {
          success: false,
          message: 'Avaliação deve ser entre 1 e 5 estrelas.'
        };
      }
      
      // Criar nova avaliação
      const rating = {
        id: Date.now(),
        userEmail,
        teacherName,
        lessonId,
        videoId,
        stars,
        comment,
        createdAt: new Date().toISOString()
      };
      
      this.ratings.push(rating);
      this.saveRatings();
      
      // Atualizar estatísticas do professor
      this.updateTeacherStats(teacherName);
      
      return {
        success: true,
        message: 'Avaliação enviada com sucesso!',
        rating
      };
    }
    
    // Atualizar estatísticas do professor (calcular média)
    updateTeacherStats(teacherName) {
      const teacherRatings = this.ratings.filter(r => r.teacherName === teacherName);
      
      if (teacherRatings.length === 0) {
        this.teacherStats[teacherName] = {
          avgRating: 0,
          totalRatings: 0,
          ratings: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        };
      } else {
        // Calcular média
        const sum = teacherRatings.reduce((acc, r) => acc + r.stars, 0);
        const avg = sum / teacherRatings.length;
        
        // Contar distribuição de estrelas
        const distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
        teacherRatings.forEach(r => {
          distribution[r.stars]++;
        });
        
        this.teacherStats[teacherName] = {
          avgRating: parseFloat(avg.toFixed(2)),
          totalRatings: teacherRatings.length,
          ratings: distribution
        };
      }
      
      this.saveTeacherStats();
    }
    
    // Obter estatísticas de um professor
    getTeacherStats(teacherName) {
      if (!this.teacherStats[teacherName]) {
        return {
          avgRating: 0,
          totalRatings: 0,
          ratings: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        };
      }
      return this.teacherStats[teacherName];
    }
    
    // Obter todas as avaliações de um professor
    getTeacherRatings(teacherName) {
      return this.ratings.filter(r => r.teacherName === teacherName);
    }
    
    // Obter avaliação específica do usuário
    getUserRating(userEmail, teacherName, lessonId) {
      return this.ratings.find(r => 
        r.userEmail === userEmail &&
        r.teacherName === teacherName &&
        r.lessonId === lessonId
      );
    }
  }
  
  // Criar instância global
  window.TeacherRatingSystem = new TeacherRatingSystem();
  
  // Função para mostrar modal de avaliação após concluir aula
  window.showTeacherRatingModal = function(teacherName, lessonId, lessonTitle, videoId) {
    const session = JSON.parse(localStorage.getItem('ns-session'));
    if (!session || !session.email) {
      console.error('Usuário não autenticado');
      return;
    }
    
    // Verificar se já avaliou
    if (window.TeacherRatingSystem.hasUserRated(session.email, teacherName, lessonId)) {
      console.log('Usuário já avaliou este professor nesta aula');
      return;
    }
    
    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'rating-modal-backdrop';
    modal.innerHTML = `
      <div class="rating-modal">
        <div class="rating-modal-header">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            Avaliar Professor
          </h2>
          <button class="rating-modal-close" onclick="closeRatingModal()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="rating-modal-body">
          <div class="rating-teacher-info">
            <div class="rating-teacher-avatar">${teacherName.charAt(0)}</div>
            <div class="rating-teacher-details">
              <div class="rating-teacher-name">${teacherName}</div>
              <div class="rating-lesson-title">${lessonTitle}</div>
            </div>
          </div>
          
          <div class="rating-question">
            <p>Como você avalia a qualidade do ensino deste professor?</p>
            <small>Sua avaliação ajuda outros alunos e o professor a melhorar</small>
          </div>
          
          <div class="rating-stars-container">
            <div class="rating-stars" id="ratingStars">
              ${[1, 2, 3, 4, 5].map(star => `
                <svg class="rating-star" data-star="${star}" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              `).join('')}
            </div>
            <div class="rating-label" id="ratingLabel">Selecione uma avaliação</div>
          </div>
          
          <div class="rating-comment-container">
            <label for="ratingComment">Comentário (opcional)</label>
            <textarea 
              id="ratingComment" 
              placeholder="Compartilhe sua experiência com este professor..."
              rows="3"
              maxlength="500"
            ></textarea>
            <div class="rating-comment-count">
              <span id="commentCharCount">0</span>/500 caracteres
            </div>
          </div>
        </div>
        
        <div class="rating-modal-footer">
          <button class="btn-rating-skip" onclick="closeRatingModal()">
            Avaliar depois
          </button>
          <button class="btn-rating-submit" id="btnSubmitRating" disabled>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Enviar avaliação
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Estado da avaliação
    let selectedStars = 0;
    
    // Labels para as estrelas
    const starLabels = {
      1: 'Muito ruim',
      2: 'Ruim',
      3: 'Regular',
      4: 'Bom',
      5: 'Excelente'
    };
    
    // Event listeners para as estrelas
    const stars = modal.querySelectorAll('.rating-star');
    const ratingLabel = modal.querySelector('#ratingLabel');
    const submitBtn = modal.querySelector('#btnSubmitRating');
    
    stars.forEach(star => {
      star.addEventListener('mouseenter', function() {
        const hoverValue = parseInt(this.dataset.star);
        updateStarDisplay(hoverValue);
        ratingLabel.textContent = starLabels[hoverValue];
      });
      
      star.addEventListener('click', function() {
        selectedStars = parseInt(this.dataset.star);
        updateStarDisplay(selectedStars);
        ratingLabel.textContent = starLabels[selectedStars];
        submitBtn.disabled = false;
      });
    });
    
    modal.querySelector('.rating-stars-container').addEventListener('mouseleave', function() {
      if (selectedStars > 0) {
        updateStarDisplay(selectedStars);
        ratingLabel.textContent = starLabels[selectedStars];
      } else {
        updateStarDisplay(0);
        ratingLabel.textContent = 'Selecione uma avaliação';
      }
    });
    
    // Atualizar display das estrelas
    function updateStarDisplay(value) {
      stars.forEach((star, index) => {
        if (index < value) {
          star.classList.add('active');
        } else {
          star.classList.remove('active');
        }
      });
    }
    
    // Character counter para comentário
    const commentTextarea = modal.querySelector('#ratingComment');
    const charCount = modal.querySelector('#commentCharCount');
    
    commentTextarea.addEventListener('input', function() {
      charCount.textContent = this.value.length;
    });
    
    // Submit avaliação
    submitBtn.addEventListener('click', function() {
      if (selectedStars === 0) {
        alert('Por favor, selecione uma avaliação de 1 a 5 estrelas.');
        return;
      }
      
      const comment = commentTextarea.value.trim();
      
      const result = window.TeacherRatingSystem.addRating(
        session.email,
        teacherName,
        lessonId,
        videoId,
        selectedStars,
        comment
      );
      
      if (result.success) {
        closeRatingModal();
        showRatingSuccessFeedback(selectedStars);
      } else {
        alert(result.message);
      }
    });
  };
  
  // Fechar modal de avaliação
  window.closeRatingModal = function() {
    const modal = document.querySelector('.rating-modal-backdrop');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    }
  };
  
  // Feedback visual de sucesso
  function showRatingSuccessFeedback(stars) {
    const feedback = document.createElement('div');
    feedback.className = 'rating-success-feedback';
    feedback.innerHTML = `
      <div class="rating-success-content">
        <svg class="rating-success-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <div class="rating-success-text">
          <div class="rating-success-title">Avaliação enviada!</div>
          <div class="rating-success-message">${stars} estrela${stars > 1 ? 's' : ''} · Obrigado pelo feedback</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => feedback.classList.add('show'), 100);
    
    setTimeout(() => {
      feedback.classList.remove('show');
      setTimeout(() => feedback.remove(), 300);
    }, 3500);
  }
  
  // Adicionar estilos CSS
  const styles = document.createElement('style');
  styles.textContent = `
    /* Rating Modal Styles */
    .rating-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
      padding: 20px;
    }
    
    .rating-modal-backdrop.show {
      opacity: 1;
    }
    
    .rating-modal {
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: 20px;
      max-width: 540px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      transform: translateY(20px);
      transition: transform 0.3s ease;
    }
    
    .rating-modal-backdrop.show .rating-modal {
      transform: translateY(0);
    }
    
    .rating-modal-header {
      padding: 24px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .rating-modal-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text);
    }
    
    .rating-modal-header h2 svg {
      stroke: #d4af37;
    }
    
    .rating-modal-close {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: transparent;
      border: 1px solid var(--border);
      color: var(--muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .rating-modal-close:hover {
      background: var(--glass);
      color: var(--text);
      transform: rotate(90deg);
    }
    
    .rating-modal-body {
      padding: 24px;
    }
    
    .rating-teacher-info {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px;
      background: var(--glass);
      border-radius: 14px;
      border: 1px solid var(--border);
      margin-bottom: 24px;
    }
    
    .rating-teacher-avatar {
      width: 54px;
      height: 54px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 700;
      color: white;
    }
    
    .rating-teacher-name {
      font-size: 16px;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 4px;
    }
    
    .rating-lesson-title {
      font-size: 13px;
      color: var(--muted);
    }
    
    .rating-question {
      margin-bottom: 24px;
      text-align: center;
    }
    
    .rating-question p {
      margin: 0 0 8px 0;
      font-size: 15px;
      font-weight: 600;
      color: var(--text);
    }
    
    .rating-question small {
      font-size: 13px;
      color: var(--muted);
    }
    
    .rating-stars-container {
      text-align: center;
      margin-bottom: 24px;
    }
    
    .rating-stars {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-bottom: 12px;
    }
    
    .rating-star {
      cursor: pointer;
      transition: all 0.2s ease;
      stroke: #d4af37;
      fill: none;
    }
    
    .rating-star:hover,
    .rating-star.active {
      fill: #d4af37;
      transform: scale(1.15);
    }
    
    .rating-label {
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
      min-height: 20px;
    }
    
    .rating-comment-container {
      margin-bottom: 24px;
    }
    
    .rating-comment-container label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 8px;
    }
    
    .rating-comment-container textarea {
      width: 100%;
      padding: 12px;
      background: var(--glass);
      border: 1px solid var(--border);
      border-radius: 12px;
      color: var(--text);
      font-family: inherit;
      font-size: 14px;
      resize: vertical;
      transition: all 0.2s ease;
    }
    
    .rating-comment-container textarea:focus {
      outline: none;
      border-color: #d4af37;
      background: rgba(212, 175, 55, 0.05);
    }
    
    .rating-comment-count {
      font-size: 12px;
      color: var(--muted);
      text-align: right;
      margin-top: 6px;
    }
    
    .rating-modal-footer {
      padding: 20px 24px;
      border-top: 1px solid var(--border);
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
    
    .btn-rating-skip,
    .btn-rating-submit {
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .btn-rating-skip {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--muted);
    }
    
    .btn-rating-skip:hover {
      background: var(--glass);
      color: var(--text);
    }
    
    .btn-rating-submit {
      background: linear-gradient(135deg, #d4af37, #f4d03f);
      color: #071024;
    }
    
    .btn-rating-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
    }
    
    .btn-rating-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    /* Success Feedback */
    .rating-success-feedback {
      position: fixed;
      top: 100px;
      right: -450px;
      background: linear-gradient(135deg, rgba(34,197,94,0.95), rgba(22,163,74,0.95));
      color: white;
      padding: 20px 24px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      z-index: 10001;
      transition: right 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      min-width: 340px;
    }
    
    .rating-success-feedback.show {
      right: 24px;
    }
    
    .rating-success-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .rating-success-icon {
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
    }
    
    .rating-success-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    
    .rating-success-message {
      font-size: 16px;
      font-weight: 600;
    }
    
    @media (max-width: 640px) {
      .rating-modal {
        max-width: 100%;
        border-radius: 20px 20px 0 0;
        margin-top: auto;
      }
      
      .rating-stars {
        gap: 4px;
      }
      
      .rating-star {
        width: 40px;
        height: 40px;
      }
      
      .rating-success-feedback {
        min-width: 300px;
        right: -350px;
      }
      
      .rating-success-feedback.show {
        right: 16px;
      }
    }
  `;
  
  document.head.appendChild(styles);
  
  console.log('✅ Sistema de avaliação de professores carregado!');
})();
