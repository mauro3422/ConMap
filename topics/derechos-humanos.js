/**
 * TOPIC: Derechos Humanos
 * Materia: Formación Ética y Ciudadana
 * Versión: 1.0 — Creado: 2026-04-22
 */

window.mapData = {
  metadata: {
    title: "Derechos Humanos",
    subject: "Formación Ética y Ciudadana",
    version: "1.0",
    author: "Antigravity Study Framework",
    savedAt: "2026-04-22"
  },

  nodes: [
    { 
      id: 'root', title: 'Derechos', context: 'Humanos', 
      details: 'Fundamentos de la dignidad humana', 
      level: 0, parentId: null, theme: 'gold', status: 'pending'
    },
    { 
      id: 'h1', title: 'Generaciones', context: 'Evolución histórica',
      lines: ['1ra: Civiles y Políticos', '2da: Económicos y Sociales', '3ra: Derechos de los pueblos'],
      level: 1, parentId: 'root', theme: 'teal', status: 'pending'
    },
    { 
      id: 'h2', title: 'Características', context: 'Principios rectores',
      lines: ['Universales', 'Inalienables', 'Indivisibles', 'Interdependientes'],
      level: 1, parentId: 'root', theme: 'green', status: 'pending'
    }
  ],

  links: [
    { from: 'root', to: 'h1', type: 'hierarchical', label: 'se dividen en' },
    { from: 'root', to: 'h2', type: 'hierarchical', label: 'poseen' }
  ]
};
