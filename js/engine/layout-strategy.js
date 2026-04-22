/**
 * ENGINE: Layout Strategy Pattern
 * Encapsulates specific positioning logic.
 */

/**
 * VerticalInfographicStrategy:
 * The current winning layout (Staggered Vertical Stack with safety corridors).
 */
window.VerticalInfographicStrategy = class {
  constructor(cfg) {
    this.cfg = cfg;
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
    
    // Flujo "S-Shape Timeline" (Viborita real: avanza 3 bloques, baja, y vuelve)
    // Se limita estrictamente a la rama histórica (gold) para no romper nodos hoja (como conclusiones)
    if (node.children.length === 1 && node.level >= 2 && node.themeName === 'gold') {
      const ch = node.children[0];
      const stepIndex = node.level - 2;
      const colStep = stepIndex % 3;
      
      // El ancho no crece infinitamente acumulándose. Solo el primer bloque (Grecia) 
      // pide el espacio total para que el Root acomode las 3 columnas sin pisar a la rama azul.
      node.subtreeWidth = Math.max(node.size.w, ch.subtreeWidth);
      if (node.level === 2) {
         node.subtreeWidth += (this.cfg.hGap * 2.5);
      }
      
      // La altura REAL del contenedor: solo suma espacio vertical si baja de fila.
      // Si camina hacia el costado (colStep 0 o 1), comparten la misma "Fila" de altura.
      if (colStep === 2) {
         node.subtreeHeight = node.size.h + (this.cfg.vStep * 0.7) + ch.subtreeHeight;
      } else {
         node.subtreeHeight = Math.max(node.size.h, ch.subtreeHeight);
      }
    } else {
      node.subtreeWidth = Math.max(
        node.size.w + this.cfg.hGap,
        node.children.reduce((sum, ch) => sum + ch.subtreeWidth, 0)
      );
      // Altura = propia + gap + altura de la sub-rama más larga
      node.subtreeHeight = node.size.h + this.cfg.vStep + Math.max(...node.children.map(ch => ch.subtreeHeight));
    }
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
        // Mantenemos el apilado vertical clásico
        currentY += c.subtreeHeight + 100; 
      });
    } else {
      // Flujo "S-Shape Timeline" (Viborita de párrafo exclusivo para la rama histórica)
      if (node.children.length === 1 && node.level >= 2 && node.themeName === 'gold') {
        const c = node.children[0];
        
        const stepIndex = node.level - 2; // Grecia es el paso 0
        const row = Math.floor(stepIndex / 3); // 3 saltos por fila (0, 1, 2 -> fila 0)
        const colStep = stepIndex % 3; 
        
        // Cambio de dirección: Sentido de lectura natural (Izquierda a Derecha) para la Fila 0
        const dir = (row % 2 === 0) ? 1 : -1; // Pares derecha, Impares izquierda
        
        // Si ya dio 3 pasos horizontales, toca dar una vuelta hacia abajo
        if (colStep === 2) {
          const cX = x; // Mantiene misma columna
          const childY = y + (node.size.h / 2) + (this.cfg.vStep * 0.7) + (c.size.h / 2); // Baja en vertical compacto
          this.positionNodes(c, nodeMap, cX, childY, bIdx);
        } else {
          // Crecimiento recto hacia Izquierda/Derecha
          const cX = x + dir * ((node.size.w / 2) + this.cfg.hGap + (c.size.w / 2)); 
          const childY = y;
          this.positionNodes(c, nodeMap, cX, childY, bIdx);
        }
      } else {
        const totalW = node.children.reduce((s, c) => s + c.subtreeWidth, 0);
        let startX = x - totalW / 2;
        node.children.forEach(c => {
          let cX = startX + c.subtreeWidth / 2;
          
          // Especial: El nodo raíz de la línea de tiempo histórica debe irse a la izquierda
          // para que la historia fluya de izquierda a derecha rellenando el canvas vacío
          if (node.level === 1 && node.themeName === 'gold' && c.themeName === 'gold') {
             cX = startX + (c.size.w / 2);
          }
          
          // Posicionamiento dinámico para nivel 2+ normal (ramas con múltiples hijos)
          const childY = y + (node.size.h / 2) + this.cfg.vStep + (c.size.h / 2);
          this.positionNodes(c, nodeMap, cX, childY, bIdx);
          startX += c.subtreeWidth;
        });
      }
    }
  }
};
