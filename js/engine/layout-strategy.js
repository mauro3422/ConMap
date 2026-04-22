/**
 * ENGINE: Layout Strategy Pattern
 * Estandarización Modular de Plantillas.
 */

// ==========================================
// 1. REGISTRO DE PLANTILLAS (LAYOUT PLUGINS)
// ==========================================
const LayoutStrategies = {
  
  // Plantilla A: Flujo en Cascada Vertical (Por Defecto)
  vertical: {
    computeMetrics: (node, cfg) => {
      node.subtreeWidth = Math.max(
        node.size.w + cfg.hGap,
        node.children.reduce((sum, ch) => sum + ch.subtreeWidth, 0)
      );
      node.subtreeHeight = node.size.h + cfg.vStep + Math.max(...node.children.map(ch => ch.subtreeHeight));
    },
    position: (node, x, y, cfg, positionNodesFn) => {
      const totalW = node.children.reduce((s, c) => s + c.subtreeWidth, 0);
      let startX = x - totalW / 2;
      
      node.children.forEach(c => {
        let cX = startX + c.subtreeWidth / 2;
        
        // Especial: Desplazamiento inicial de la rama de historia (Retro-compatibilidad visual)
        if (node.level === 1 && node.themeName === 'gold' && c.themeName === 'gold') {
           cX = startX + (c.size.w / 2);
        }
        
        const childY = y + (node.size.h / 2) + cfg.vStep + (c.size.h / 2);
        positionNodesFn(c, cX, childY);
        startX += c.subtreeWidth;
      });
    }
  },

  // Plantilla B: Flujo Serpiente 3x3 (Párrafos Cronológicos)
  snake: {
    computeMetrics: (node, cfg) => {
      const ch = node.children[0];
      const stepIndex = node.level - 2;
      const colStep = stepIndex % 3;
      
      // El ancho no crece infinitamente acumulándose. Solo el primer bloque 
      // pide el espacio total para acomodar las 3 columnas.
      node.subtreeWidth = Math.max(node.size.w, ch.subtreeWidth);
      if (node.level === 2) {
         node.subtreeWidth += (cfg.hGap * 2.5);
      }
      
      // La altura REAL del contenedor: solo suma espacio vertical si baja de fila.
      if (colStep === 2) {
         node.subtreeHeight = node.size.h + (cfg.vStep * 0.7) + ch.subtreeHeight;
      } else {
         node.subtreeHeight = Math.max(node.size.h, ch.subtreeHeight);
      }
    },
    position: (node, x, y, cfg, positionNodesFn) => {
      const c = node.children[0];
      const stepIndex = node.level - 2; // Grecia es el paso 0
      const row = Math.floor(stepIndex / 3); 
      const colStep = stepIndex % 3; 
      
      // Cambio de dirección: Sentido de lectura natural (Izquierda a Derecha) para la Fila 0
      const dir = (row % 2 === 0) ? 1 : -1; 
      
      // Si ya dio 3 pasos horizontales, toca dar una vuelta hacia abajo
      if (colStep === 2) {
        const cX = x; // Mantiene misma columna
        const childY = y + (node.size.h / 2) + (cfg.vStep * 0.7) + (c.size.h / 2); 
        positionNodesFn(c, cX, childY);
      } else {
        // Crecimiento recto horizontal
        const cX = x + dir * ((node.size.w / 2) + cfg.hGap + (c.size.w / 2)); 
        const childY = y;
        positionNodesFn(c, cX, childY);
      }
    }
  }
};

// ==========================================
// 2. ORQUESTADOR PRINCIPAL DEL MAPA
// ==========================================
window.VerticalInfographicStrategy = class {
  constructor(cfg) {
    this.cfg = cfg;
  }

  // Define qué plantilla aplicar a un nodo
  getLayoutType(node) {
    if (node.layout) return node.layout; // Soporte futuro explícito
    
    // Heurística de retro-compatibilidad (Viborita histórica dorada)
    if (node.children.length === 1 && node.level >= 2 && node.themeName === 'gold') {
      return 'snake';
    }
    
    return 'vertical'; // Default
  }

  apply(nodes, nodeMap) {
    const root = nodes.find(n => !n.parentId);
    if (!root) return { width: 1000, height: 1000 };

    this.computeSubtreeMetrics(root);
    this.positionNodes(root, nodeMap, this.cfg.startX + this.cfg.nodeXOffset, this.cfg.initialY);

    let minX = Infinity, maxX = -Infinity;
    let maxY = -Infinity;
    nodes.forEach(n => {
      minX = Math.min(minX, n.pos.x - n.size.w/2);
      maxX = Math.max(maxX, n.pos.x + n.size.w/2);
      maxY = Math.max(maxY, n.pos.y + n.size.h/2);
    });

    const shift = -minX + 500; 
    nodes.forEach(n => n.pos.x += shift);

    return { 
      width: (maxX - minX) + 1000,
      height: maxY + this.cfg.canvasPadding 
    };
  }

  computeSubtreeMetrics(node) {
    if (node.children.length === 0) {
      node.subtreeWidth = node.size.w + this.cfg.hGap;
      node.subtreeHeight = node.size.h; // Altura neta
      return;
    }

    node.children.forEach(ch => this.computeSubtreeMetrics(ch));
    
    const layoutType = this.getLayoutType(node);
    const strategy = LayoutStrategies[layoutType] || LayoutStrategies.vertical;
    strategy.computeMetrics(node, this.cfg);
  }

  positionNodes(node, nodeMap, x, y, bIdx = 0) {
    node.pos.x = x;
    node.pos.y = y;

    if (node.children.length === 0) return;

    if (node.level === 0) {
      // Dynamic placement for Level 1 children to avoid root collision
      let currentY = y + (node.size.h / 2) + this.cfg.vStep; 
      node.children.forEach((c, i) => {
        const staggerX = (i % 2 === 0 ? -this.cfg.staggerOffset : this.cfg.staggerOffset);
        
        // Colocamos el hijo de forma que su borde superior no choque
        const childY = currentY + (c.size.h / 2);
        this.positionNodes(c, nodeMap, x + staggerX, childY, i);
        // Mantenemos el apilado vertical clásico en la raíz
        currentY += c.subtreeHeight + 100; 
      });
    } else {
      // Delegamos el posicionamiento de hijos a la plantilla elegida
      const layoutType = this.getLayoutType(node);
      const strategy = LayoutStrategies[layoutType] || LayoutStrategies.vertical;
      
      strategy.position(node, x, y, this.cfg, (child, cX, cY) => {
        this.positionNodes(child, nodeMap, cX, cY, bIdx);
      });
    }
  }
};
