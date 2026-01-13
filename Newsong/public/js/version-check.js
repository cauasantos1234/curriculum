// version-check.js - Verificação de Versão do App
// ==================================================
// Monitora se há atualizações disponíveis do aplicativo

class VersionChecker {
  constructor() {
    this.currentVersion = '1.0.0'; // Lido de .env
    this.checkInterval = 60000; // Verificar a cada minuto
    this.versionCheckUrl = '../.env'; // Arquivo que contém a versão
    this.init();
  }

  async init() {
    console.log('📦 Version Checker inicializado');
    
    // Verificar versão ao carregar
    await this.checkForUpdates();
    
    // Verificar periodicamente
    setInterval(() => this.checkForUpdates(), this.checkInterval);
  }

  async checkForUpdates() {
    try {
      const response = await fetch(this.versionCheckUrl, {
        cache: 'no-store', // Sempre buscar versão nova
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (!response.ok) return;

      const envContent = await response.text();
      const versionLine = envContent
        .split('\n')
        .find(line => line.startsWith('VITE_APP_VERSION='));

      if (!versionLine) return;

      const remoteVersion = versionLine.split('=')[1]?.trim();
      
      if (remoteVersion && remoteVersion !== this.currentVersion) {
        console.warn(`⚠️ Nova versão disponível: ${remoteVersion} (atual: ${this.currentVersion})`);
        this.notifyUpdate(remoteVersion);
      }
    } catch (err) {
      console.log('ℹ️ Não foi possível verificar atualizações (offline?)');
    }
  }

  notifyUpdate(newVersion) {
    // Criar notificação de atualização discreta
    const updateBanner = document.createElement('div');
    updateBanner.id = 'update-banner';
    updateBanner.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, var(--gold-1, #d4af37), var(--gold-2, #ffd700));
      color: #0a0a0a;
      padding: 16px 24px;
      border-radius: 10px;
      font-weight: 700;
      z-index: 9999;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
      animation: slideIn 0.3s ease;
    `;
    
    updateBanner.innerHTML = `
      📦 Nova versão disponível (${newVersion}). Clique para atualizar.
    `;
    
    updateBanner.onclick = () => {
      // Hard refresh (Ctrl+Shift+R)
      window.location.reload(true);
    };

    // Adicionar animação CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { 
          transform: translateX(400px); 
          opacity: 0;
        }
        to { 
          transform: translateX(0); 
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(updateBanner);

    // Remover banner após 10 segundos se não clicado
    setTimeout(() => {
      if (document.contains(updateBanner)) {
        updateBanner.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => updateBanner.remove(), 300);
      }
    }, 10000);
  }

  getCurrentVersion() {
    return this.currentVersion;
  }
}

// Instância global
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.versionChecker = new VersionChecker();
  });
} else {
  window.versionChecker = new VersionChecker();
}

console.log('✅ Sistema de verificação de versão carregado');
