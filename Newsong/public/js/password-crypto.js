// password-crypto.js - Sistema de Criptografia de Senhas
// ========================================================
// Usa bcryptjs para hash seguro de senhas
// Versão simples com fallback para ambiente offline

class PasswordCrypto {
  constructor() {
    this.bcryptLoaded = false;
    this.initBcrypt();
  }

  async initBcrypt() {
    // Tentar carregar bcryptjs da CDN
    if (typeof window.dcodeIO !== 'undefined' && window.dcodeIO.bcrypt) {
      this.bcryptLoaded = true;
      console.log('✅ bcryptjs carregado com sucesso');
    } else {
      console.warn('⚠️ bcryptjs não disponível - usando fallback SHA-256');
      this.loadFallbackCrypto();
    }
  }

  loadFallbackCrypto() {
    // Fallback: implementar hash simples com SHA-256
    if (!window.crypto || !window.crypto.subtle) {
      console.error('❌ Criptografia não disponível neste navegador');
      return;
    }
  }

  // Hash de senha com bcryptjs ou fallback
  async hashPassword(password) {
    if (this.bcryptLoaded && window.dcodeIO && window.dcodeIO.bcrypt) {
      try {
        // Usar bcryptjs
        const salt = await new Promise((resolve) => {
          window.dcodeIO.bcrypt.genSalt(10, (err, salt) => {
            if (err) resolve(null);
            resolve(salt);
          });
        });

        if (!salt) throw new Error('Erro ao gerar salt');

        const hash = await new Promise((resolve) => {
          window.dcodeIO.bcrypt.hash(password, salt, (err, hash) => {
            if (err) resolve(null);
            resolve(hash);
          });
        });

        return hash || this.fallbackHash(password);
      } catch (err) {
        console.warn('⚠️ Erro ao usar bcryptjs:', err);
        return this.fallbackHash(password);
      }
    } else {
      return this.fallbackHash(password);
    }
  }

  // Hash com SHA-256 (fallback)
  async fallbackHash(password) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return '$fallback$' + hashHex; // Prefixo para identificar hash fallback
    } catch (err) {
      console.error('❌ Erro ao fazer hash fallback:', err);
      // Como último recurso, retornar uma versão ofuscada
      return '$simple$' + btoa(password).substring(0, 60);
    }
  }

  // Comparar senha com hash
  async comparePassword(password, hash) {
    if (!hash) return false;

    // Se for hash bcryptjs
    if (hash.startsWith('$2')) {
      if (this.bcryptLoaded && window.dcodeIO && window.dcodeIO.bcrypt) {
        try {
          return await new Promise((resolve) => {
            window.dcodeIO.bcrypt.compare(password, hash, (err, result) => {
              resolve(result === true);
            });
          });
        } catch (err) {
          console.warn('⚠️ Erro ao comparar bcryptjs:', err);
          return false;
        }
      }
    }

    // Se for hash SHA-256 fallback
    if (hash.startsWith('$fallback$')) {
      const newHash = await this.fallbackHash(password);
      return newHash === hash;
    }

    // Se for hash simples fallback
    if (hash.startsWith('$simple$')) {
      const encoded = btoa(password).substring(0, 60);
      return ('$simple$' + encoded) === hash;
    }

    // Compatibilidade com senhas antigas em texto plano (MIGRAÇÃO)
    // ⚠️ AVISO: Depois que todos os usuários forem migrados, remover isso
    console.warn('⚠️ Detectada senha em texto plano - migrar para hash');
    return password === hash;
  }

  // Verificar se precisa fazer re-hash (ex: senhas antigas em texto plano)
  needsRehash(hash) {
    if (!hash) return true;
    if (hash.startsWith('$2')) return false; // bcryptjs é seguro
    return true; // Qualquer outro formato precisa de re-hash
  }

  // Migrar senha de texto plano para hash
  async migratePassword(plainPassword) {
    return await this.hashPassword(plainPassword);
  }
}

// Instância global
window.passwordCrypto = new PasswordCrypto();

console.log('🔐 Sistema de Criptografia de Senhas carregado');
