/**
 * CONFIG: Study Framework Master Configuration
 * Centralized control for themes, node types, and study statuses.
 */

window.CONFIG = {
  // CONFIGURACIÓN DE LAYOUT
  layout: {
    startX: 1500,         
    hGap: 700,            
    vStep: 1100,          // Espaciado equilibrado para evitar zoom-out extremo
    branchSpacing: 2500,
    safetyCorridorX: 200,
    rightCorridorOffset: 200,
    initialY: 400,        
    level1Y: 1000,        
    canvasPadding: 1000,  
    staggerOffset: 250,   
    nodeXOffset: 600,
    finalShiftX: 400
  },

  // CONSTANTES VISUALES (Evitar números mágicos)
  visuals: {
    node: {
      minWidth: 900,           
      charWidthFactor: 0.65,    
      widthPadding: 300,        
      heightBase: 300,          
      contextOffset: 40,
      detailsHeight: 250,       
      linesHeightPerItem: 200,  
      titleLineHeight: 1.8,
      rxDefault: 40,
      detailsOpacity: 0.9,
      glowRadius: 30,
      // Offsets internos de texto dentro del nodo SVG
      textOffsets: {
        title: 150,
        context: 280,           
        linesStartOffset: 120,   
        details: 140,
        detailsFontSize: 90,    // Mayor que el label de la línea
        contextSizeMultiplier: 1.0, 
        bulletFontSize: 100,    // Mayor que el label de la línea
        lineSpacing: 220        
      }
    },
    links: {
      semanticWidth: 12,        
      rootWidth: 20,
      conceptWidth: 12,
      labelFontSize: 70,      
      labelPadding: 60,
      bezierFactor: 0.4,
      dashArray: '20,15',
      rootLinkDrop: 200,
      rootLinkTailGap: 30,
      conceptLabelGap: 150,   
      rootLabelXOffset: 100,
      conceptLinkGap: 150,    
      conceptLinkDrop: 200,   
      corridorOffset: 300,    
      semanticLabelFontMultiplier: 1.1, 
      conceptLabelFontMultiplier: 1.2
    },
    labels: {
      widthFactor: 0.7,
      widthPadding: 80,
      rectYOffset: 65,        
      rectHeight: 130,         
      rectRx: 25,
      textYOffset: 0          
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
    root:       { fontSize: 150, stroke: 24, rx: 60 },
    header:     { fontSize: 120, stroke: 20, rx: 50 },
    concept:    { fontSize: 100, stroke: 16, rx: 45 },
    example:    { fontSize: 90, stroke: 12, rx: 35, dash: "15,10" },
    warning:    { fontSize: 100, stroke: 18, rx: 45, color: 'red' },
    note:       { fontSize: 90, stroke: 10, rx: 35, color: 'muted', dash: "12,8" },
    key:        { fontSize: 100, stroke: 20, rx: 45, color: 'gold' },
    definition: { fontSize: 90, stroke: 14, rx: 35 }
  },

  // ESTADOS DE ESTUDIO (Gamificación)
  statuses: {
    pending:  { opacity: 1,   icon: '' },
    learned:  { opacity: 0.7, icon: '✅' },
    critical: { opacity: 1,   icon: '🔥', glow: true },
    review:   { opacity: 1,   icon: '🔄' }
  }
};
