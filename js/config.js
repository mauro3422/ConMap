/**
 * CONFIG: Study Framework Master Configuration
 * Centralized control for themes, node types, and study statuses.
 */

window.CONFIG = {
  // CONFIGURACIÓN DE LAYOUT
  layout: {
    startX: 400,
    hGap: 120,            // Un poco más de aire horizontal
    vStep: 650,           // Aumentado significativamente para evitar colisión vertical
    branchSpacing: 2000,
    safetyCorridorX: 150,
    rightCorridorOffset: 150,
    initialY: 200,        // Más aire arriba
    level1Y: 700,
    canvasPadding: 800,
    staggerOffset: 250,
    nodeXOffset: 450,
    finalShiftX: 300
  },

  // CONSTANTES VISUALES (Evitar números mágicos)
  visuals: {
    node: {
      minWidth: 400,
      charWidthFactor: 0.6,     // Factor realista de ancho por caracter (0.6 * fontSize)
      widthPadding: 120,        // Más aire a los lados
      heightBase: 100,          // Más aire arriba/abajo del contenido
      contextOffset: 15,
      detailsHeight: 100,
      linesHeightPerItem: 60,   // DEBE coincidir con lineSpacing
      titleLineHeight: 1.6,
      rxDefault: 30,
      detailsOpacity: 0.8,
      glowRadius: 20,
      // Offsets internos de texto dentro del nodo SVG
      textOffsets: {
        title: 80,
        context: 145,
        linesStartOffset: 30,   // Espacio entre context/title y primer bullet
        details: 55,
        detailsFontSize: 34,    // Aumentado de 30
        contextSizeMultiplier: 0.85,
        bulletFontSize: 38,     // Aumentado de 34
        lineSpacing: 60         // Sincronizado con linesHeightPerItem
      }
    },
    links: {
      semanticWidth: 8,
      rootWidth: 12,
      conceptWidth: 8,
      labelFontSize: 42,      // Aumentado de 30
      labelPadding: 40,
      bezierFactor: 0.4,
      dashArray: '15,10',
      rootLinkDrop: 100,
      rootLinkTailGap: 20,
      conceptLabelGap: 130,   // Bajado de 180 para que no suba tanto
      rootLabelXOffset: 80,
      conceptLinkGap: 60,     // Bajado de 80
      conceptLinkDrop: 50,    // Bajado de 100 para un estiramiento más natural
      semanticLabelFontMultiplier: 1.1, // Aumentado de 0.8
      conceptLabelFontMultiplier: 1.2
    },
    labels: {
      widthFactor: 0.7,
      widthPadding: 60,
      rectYOffset: 45,        // Mitad de la altura para centrado perfecto
      rectHeight: 90,         // Suficiente para fuentes grandes
      rectRx: 20,
      textYOffset: 0          // 0 porque usamos dominant-baseline: central
    }
  },

  // MOTOR DE TEMAS (Inyectable a CSS)
  themes: {
    active: 'midnight',
    midnight: {
      name: 'Noche Profunda',
      colors: {
        background: '#0d1117',
        canvas: '#010409',
        text: '#e6edf3',
        muted: '#8b949e',
        gold: '#f5c842',
        teal: '#42e5c8',
        green: '#5dde8c',
        blue: '#58a6ff',
        red: '#ff7b72'
      },
      fonts: {
        title: "'Crimson Pro', serif",
        body: "'Inter', sans-serif"
      }
    },
    paper: {
      name: 'Modo Impresión (Light)',
      colors: {
        background: '#ffffff',
        canvas: '#f6f8fa',
        text: '#1f2328',
        muted: '#656d76',
        gold: '#9a6700',
        teal: '#059669',
        green: '#166534',
        blue: '#0969da',
        red: '#cf222e'
      },
      fonts: {
        title: "Georgia, serif",
        body: "Arial, sans-serif"
      }
    }
  },

  // DEFINICIÓN DE TIPOS DE NODOS (Semántica)
  nodeTypes: {
    root:       { fontSize: 72, stroke: 18, rx: 45 },
    header:     { fontSize: 64, stroke: 14, rx: 40 },
    concept:    { fontSize: 60, stroke: 12, rx: 35 },
    example:    { fontSize: 44, stroke: 7,  rx: 25, dash: "10,5" },
    warning:    { fontSize: 58, stroke: 14, rx: 35, color: 'red' },
    note:       { fontSize: 42, stroke: 5,  rx: 25, color: 'muted', dash: "8,5" },
    key:        { fontSize: 58, stroke: 16, rx: 35, color: 'gold' },
    definition: { fontSize: 48, stroke: 9,  rx: 15 }
  },

  // ESTADOS DE ESTUDIO (Gamificación)
  statuses: {
    pending:  { opacity: 1,   icon: '' },
    learned:  { opacity: 0.7, icon: '✅' },
    critical: { opacity: 1,   icon: '🔥', glow: true },
    review:   { opacity: 1,   icon: '🔄' }
  }
};
