/**
 * DATA: Conceptual Map — Ciudadanía y Gobierno Digital (Framework v18.1)
 * Fuente: Apuntes de Formación Ética y Ciudadana
 * Estructura: 3 ramas principales + relaciones semánticas transversales
 */

window.mapData = {
  metadata: {
    title: "Ciudadanía y Gobierno Digital",
    subject: "Formación Ética y Ciudadana",
    version: "18.1",
    author: "Antigravity Study Framework",
    lastUpdated: "2026-04-22"
  },

  nodes: [
    // ═══════════════════════════════════════
    // ROOT
    // ═══════════════════════════════════════
    { 
      id: 'root', 
      title: 'Ciudadanía y', 
      context: 'Gobierno Digital', 
      details: 'Eje central de la materia', 
      level: 0, parentId: null, 
      theme: 'gold', status: 'pending'
    },

    // ═══════════════════════════════════════
    // RAMA 1: CIUDADANÍA (gold)
    // ═══════════════════════════════════════
    { 
      id: 'c1', 
      title: 'Ciudadanía', 
      context: 'Condición político-jurídica', 
      details: 'Vínculo entre persona y comunidad política', 
      level: 1, parentId: 'root', 
      theme: 'gold', status: 'learned'
    },
    { 
      id: 'c1_orig', 
      title: 'Origen', 
      context: 'Polis Griega', 
      details: 'Participación directa en asuntos públicos', 
      level: 2, parentId: 'c1', 
      theme: 'gold', status: 'learned'
    },
    { 
      id: 'c1_meaning', 
      title: 'Significado', 
      context: 'Qué implica ser ciudadano',
      lines: [
        'Pertenencia a una comunidad',
        'Vínculo jurídico con el Estado',
        'Participación en asuntos públicos'
      ],
      level: 2, parentId: 'c1', 
      theme: 'gold', type: 'key', status: 'pending'
    },
    { 
      id: 'c1_rights', 
      title: 'Derechos y', 
      context: 'Obligaciones', 
      lines: [
        'Derechos civiles y políticos',
        'Deber de participación',
        'Roles activos y pasivos'
      ],
      level: 2, parentId: 'c1', 
      theme: 'gold', type: 'warning', status: 'critical'
    },
    { 
      id: 'c1_vs_nat', 
      title: 'Ciudadanía', 
      context: 'vs. Nacionalidad', 
      details: 'Ciudadanía = condición política · Nacionalidad = pertenencia a una nación', 
      level: 3, parentId: 'c1_rights', 
      theme: 'gold', type: 'definition', status: 'pending'
    },

    // ═══════════════════════════════════════
    // RAMA 2: CIUDADANÍA DIGITAL (teal)
    // ═══════════════════════════════════════
    { 
      id: 'd1', 
      title: 'Ciudadanía Digital', 
      context: 'Comunidad virtual', 
      details: 'Nuevas formas de participación en red', 
      level: 1, parentId: 'root', 
      theme: 'teal', status: 'pending'
    },
    { 
      id: 'd1_origin', 
      title: 'Surge por', 
      context: 'Internet y TIC', 
      details: 'Tecnologías de la Información y la Comunicación', 
      level: 2, parentId: 'd1', 
      theme: 'teal', status: 'pending'
    },
    { 
      id: 'd1_allows', 
      title: 'Permite', 
      context: 'Acciones en línea',
      lines: [
        'Buscar información',
        'Comunicarse y opinar',
        'Participar en línea',
        'Realizar trámites'
      ],
      level: 2, parentId: 'd1', 
      theme: 'teal', status: 'pending'
    },
    { 
      id: 'd1_limits', 
      title: 'Límites', 
      context: 'Restricciones importantes',
      lines: [
        'No hay autoridad digital universal',
        'No hay régimen político común',
        'No reemplaza la ciudadanía estatal'
      ],
      level: 2, parentId: 'd1', 
      theme: 'teal', type: 'warning', status: 'critical'
    },
    { 
      id: 'd1_conclusion', 
      title: 'Conclusión', 
      context: 'Alcance real',
      details: 'Práctica social, no ciudadanía jurídica plena',
      level: 3, parentId: 'd1_limits', 
      theme: 'teal', type: 'note', status: 'pending'
    },

    // ═══════════════════════════════════════
    // RAMA 3: GOBIERNO DIGITAL (green)
    // ═══════════════════════════════════════
    { 
      id: 'g1', 
      title: 'Gobierno Digital', 
      context: 'Estado y TIC', 
      details: 'Uso de tecnología en la gestión pública', 
      level: 1, parentId: 'root', 
      theme: 'green', status: 'pending'
    },
    { 
      id: 'g1_def', 
      title: 'Definición', 
      context: '¿Qué es?',
      details: 'Uso de TIC por parte del Estado para gestionar',
      level: 2, parentId: 'g1', 
      theme: 'green', type: 'definition', status: 'pending'
    },
    { 
      id: 'g1_functions', 
      title: 'Funciones', 
      context: 'Para qué sirve',
      lines: [
        'Mejorar servicios públicos',
        'Facilitar trámites',
        'Aumentar transparencia',
        'Fomentar participación ciudadana',
        'Mejorar comunicación Estado-ciudadano'
      ],
      level: 2, parentId: 'g1', 
      theme: 'green', status: 'pending'
    },
    { 
      id: 'g1_goal', 
      title: 'Objetivo Central', 
      context: 'Meta principal',
      details: 'Acercar el Estado a la ciudadanía',
      level: 2, parentId: 'g1', 
      theme: 'green', type: 'key', status: 'pending'
    }
  ],

  links: [
    // Jerárquicos: Root → Ramas
    { from: 'root', to: 'c1',  type: 'hierarchical', label: 'incluye' },
    { from: 'root', to: 'd1',  type: 'hierarchical', label: 'incluye' },
    { from: 'root', to: 'g1',  type: 'hierarchical', label: 'incluye' },

    // Jerárquicos: Ciudadanía
    { from: 'c1', to: 'c1_orig',    type: 'hierarchical', label: 'origen' },
    { from: 'c1', to: 'c1_meaning', type: 'hierarchical', label: 'significa' },
    { from: 'c1', to: 'c1_rights',  type: 'hierarchical', label: 'implica' },
    { from: 'c1_rights', to: 'c1_vs_nat', type: 'hierarchical', label: 'distinguir' },

    // Jerárquicos: Ciudadanía Digital
    { from: 'd1', to: 'd1_origin', type: 'hierarchical', label: 'surge por' },
    { from: 'd1', to: 'd1_allows', type: 'hierarchical', label: 'permite' },
    { from: 'd1', to: 'd1_limits', type: 'hierarchical', label: 'pero' },
    { from: 'd1_limits', to: 'd1_conclusion', type: 'hierarchical', label: 'por lo tanto' },

    // Jerárquicos: Gobierno Digital
    { from: 'g1', to: 'g1_def',       type: 'hierarchical', label: 'es' },
    { from: 'g1', to: 'g1_functions', type: 'hierarchical', label: 'sirve para' },
    { from: 'g1', to: 'g1_goal',      type: 'hierarchical', label: 'busca' },

    // Semánticos (relaciones transversales punteadas)
    { from: 'c1', to: 'd1', type: 'semantic', label: 'diferencia', dashed: true },
    { from: 'd1', to: 'g1', type: 'semantic', label: 'complemento', dashed: true }
  ]
};
