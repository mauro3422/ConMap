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

    this.computeSubtreeWidths(root);
    this.positionNodes(root, nodeMap, this.cfg.startX + this.cfg.nodeXOffset, this.cfg.initialY);

    // Final Alignment & Bounding Box (Hitbox)
    let minX = Infinity, maxX = -Infinity;
    nodes.forEach(n => {
      minX = Math.min(minX, n.pos.x - n.size.w/2);
      maxX = Math.max(maxX, n.pos.x + n.size.w/2);
    });

    // Expandimos el área para que cuenten como hitbox los corredores y etiquetas
    const worldMinX = Math.min(minX, this.cfg.safetyCorridorX - 150);
    const worldMaxX = Math.max(maxX, (maxX - minX) + this.cfg.rightCorridorOffset + 300);
    
    const shift = -minX + 400; // 400px de aire a la izquierda para el corredor
    nodes.forEach(n => n.pos.x += shift);

    return { 
      width: (maxX - minX) + 800, // 400px por lado para links y etiquetas
      height: Math.max(...nodes.map(n => n.pos.y + n.size.h)) + this.cfg.canvasPadding 
    };
  }

  computeSubtreeWidths(node) {
    if (node.children.length === 0) {
      node.subtreeWidth = node.size.w + this.cfg.hGap;
      return node.subtreeWidth;
    }
    const childrenW = node.children.reduce((sum, ch) => sum + this.computeSubtreeWidths(ch), 0);
    node.subtreeWidth = Math.max(node.size.w + this.cfg.hGap, childrenW);
    return node.subtreeWidth;
  }

  positionNodes(node, nodeMap, x, y, bIdx = 0) {
    let curY = y;
    let curX = x;

    if (node.level === 1) {
      curY = this.cfg.level1Y + (bIdx * this.cfg.branchSpacing);
      // Dinámica de escalonado (Staggered) para evitar colisiones verticales
      const offset = (bIdx % 2 === 0 ? -this.cfg.staggerOffset : this.cfg.staggerOffset);
      curX = this.cfg.startX + this.cfg.nodeXOffset + offset;
    } else if (node.level > 1) {
      curY = nodeMap[node.parentId].pos.y + this.cfg.vStep;
    }

    node.pos.x = curX;
    node.pos.y = curY;

    if (node.children.length === 0) return;
    const totalW = node.children.reduce((s, c) => s + c.subtreeWidth, 0);
    let startX = curX - totalW / 2;
    
    node.children.forEach((c, i) => {
      const cX = startX + c.subtreeWidth / 2;
      this.positionNodes(c, nodeMap, cX, curY + this.cfg.vStep, (node.level === 0 ? i : bIdx));
      startX += c.subtreeWidth;
    });
  }
};
