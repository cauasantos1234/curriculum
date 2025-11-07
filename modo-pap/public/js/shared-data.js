// shared-data.js - Dados compartilhados entre todos os módulos
// Este arquivo centraliza informações de instrumentos e módulos para evitar duplicação

// Informações dos módulos (níveis)
const SHARED_MODULES_INFO = {
  beginner: {
    title: 'Nível Bronze',
    desc: 'Fundamentos e técnicas básicas',
    icon: '🥉',
    color: '#cd7f32'
  },
  intermediate: {
    title: 'Módulo Prata',
    desc: 'Desenvolvimento de habilidades',
    icon: '🥈',
    color: '#c0c0c0'
  },
  advanced: {
    title: 'Módulo Ouro',
    desc: 'Técnicas profissionais',
    icon: '🥇',
    color: '#ffd700'
  }
};

// Informações dos instrumentos
const SHARED_INSTRUMENTS = {
  guitar: {
    id: 'guitar',
    name: 'Guitarra',
    symbol: 'guitar',
    desc: 'Elétrica e acústica',
    icon: '🎸'
  },
  drums: {
    id: 'drums',
    name: 'Bateria',
    symbol: 'drums',
    desc: 'Ritmo e grooves',
    icon: '🥁'
  },
  keyboard: {
    id: 'keyboard',
    name: 'Piano',
    symbol: 'keyboard',
    desc: 'Teclas e harmonia',
    icon: '🎹'
  },
  viola: {
    id: 'viola',
    name: 'Violão',
    symbol: 'viola',
    desc: 'Cordas e acordes',
    icon: '🪕'
  },
  bass: {
    id: 'bass',
    name: 'Baixo',
    symbol: 'bass',
    desc: 'Linha de baixo',
    icon: '🎸'
  }
};

// Exporta para uso global
if (typeof window !== 'undefined') {
  window.SHARED_MODULES_INFO = SHARED_MODULES_INFO;
  window.SHARED_INSTRUMENTS = SHARED_INSTRUMENTS;
}
