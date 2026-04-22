/**
 * TOPIC: El Estado y sus Elementos
 * Materia: Formación Ética y Ciudadana
 * Versión: 18.1 — Guardado: 2026-04-22
 */

window.mapData = {
  metadata: {
    title: "El Estado y sus Elementos",
    subject: "Formación Ética y Ciudadana",
    version: "18.1",
    author: "Antigravity Study Framework",
    savedAt: "2026-04-22"
  },

  nodes: [
    // ROOT
    {
      id: 'root', title: 'El Estado', context: 'Organización política',
      details: 'Forma de organización social suprema',
      level: 0, parentId: null, theme: 'teal', status: 'pending'
    },

    // RAMA 1 — ELEMENTOS DEL ESTADO (teal)
    {
      id: 'e1', title: 'Elementos', context: 'Del Estado',
      details: 'Componentes fundamentales para su existencia',
      level: 1, parentId: 'root', theme: 'teal', type: 'key', status: 'pending'
    },
    {
      id: 'e1_territorio', title: 'Territorio', context: 'Espacio físico',
      details: 'Suelo, subsuelo, espacio aéreo y mar territorial',
      level: 2, parentId: 'e1', theme: 'teal', status: 'pending'
    },
    {
      id: 'e1_poblacion', title: 'Población', context: 'Conjunto de habitantes',
      details: 'Ciudadanos y residentes bajo la soberanía del Estado',
      level: 2, parentId: 'e1', theme: 'teal', status: 'pending'
    },
    {
      id: 'e1_gobierno', title: 'Gobierno', context: 'Autoridad organizada',
      details: 'Conjunto de instituciones que ejercen el poder',
      level: 2, parentId: 'e1', theme: 'teal', status: 'pending'
    },
    {
      id: 'e1_soberania', title: 'Soberanía', context: 'Poder supremo',
      lines: [
        'Independencia hacia el exterior',
        'Supremacía en el interior',
        'No reconoce poder superior'
      ],
      level: 2, parentId: 'e1', theme: 'teal', type: 'warning', status: 'critical'
    },

    // RAMA 2 — FORMAS DE ESTADO (gold)
    {
      id: 'f1', title: 'Formas de', context: 'Estado',
      details: 'Cómo se organiza el poder territorialmente',
      level: 1, parentId: 'root', theme: 'gold', status: 'pending'
    },
    {
      id: 'f1_unitario', title: 'Estado Unitario', context: 'Poder centralizado',
      details: 'Un solo centro de poder. Ej: Argentina antes de 1853',
      level: 2, parentId: 'f1', theme: 'gold', type: 'example', status: 'pending'
    },
    {
      id: 'f1_federal', title: 'Estado Federal', context: 'Poder distribuido',
      details: 'Provincias con autonomía. Ej: Argentina actual',
      level: 2, parentId: 'f1', theme: 'gold', type: 'example', status: 'pending'
    },

    // RAMA 3 — FUNCIONES DEL ESTADO (green)
    {
      id: 'fn1', title: 'Funciones', context: 'Del Estado',
      details: 'División clásica del poder (Montesquieu)',
      level: 1, parentId: 'root', theme: 'green', type: 'key', status: 'pending'
    },
    {
      id: 'fn1_poderes', title: 'Tres Poderes', context: 'División del poder',
      lines: [
        'Legislativo: crea las leyes',
        'Ejecutivo: aplica las leyes',
        'Judicial: interpreta las leyes'
      ],
      level: 2, parentId: 'fn1', theme: 'green', status: 'pending'
    },
    {
      id: 'fn1_fin', title: 'Fin del Estado', context: 'Objetivo central',
      details: 'Garantizar el bien común y los derechos fundamentales',
      level: 2, parentId: 'fn1', theme: 'green', type: 'definition', status: 'pending'
    }
  ],

  links: [
    { from: 'root', to: 'e1',  type: 'hierarchical', label: 'compuesto por' },
    { from: 'root', to: 'f1',  type: 'hierarchical', label: 'se organiza en' },
    { from: 'root', to: 'fn1', type: 'hierarchical', label: 'cumple' },

    { from: 'e1', to: 'e1_territorio', type: 'hierarchical', label: 'tiene' },
    { from: 'e1', to: 'e1_poblacion',  type: 'hierarchical', label: 'tiene' },
    { from: 'e1', to: 'e1_gobierno',   type: 'hierarchical', label: 'tiene' },
    { from: 'e1', to: 'e1_soberania',  type: 'hierarchical', label: 'tiene' },

    { from: 'f1', to: 'f1_unitario', type: 'hierarchical', label: 'puede ser' },
    { from: 'f1', to: 'f1_federal',  type: 'hierarchical', label: 'puede ser' },

    { from: 'fn1', to: 'fn1_poderes', type: 'hierarchical', label: 'ejerce' },
    { from: 'fn1', to: 'fn1_fin',     type: 'hierarchical', label: 'busca' },

    // Semánticos
    { from: 'e1_soberania', to: 'fn1', type: 'semantic', label: 'fundamenta', dashed: true },
    { from: 'f1', to: 'fn1_poderes',  type: 'semantic', label: 'determina',  dashed: true }
  ]
};
