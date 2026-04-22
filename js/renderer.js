/**
 * RENDERER: SVG Drawing Logic v18.1
 * Specialized for Semantic Types, Study Statuses and Bullet Nodes.
 */

window.MapRenderer = class {
  constructor(svgId) {
    this.svg = document.getElementById(svgId);
    if (!this.svg) throw new Error(`SVG element with ID "${svgId}" not found.`);
    
    this.viewport = this.getOrCreateLayer('viewport');
    this.nLayer = this.getOrCreateLayer('nodes-layer', this.viewport);
    this.lLayer = this.getOrCreateLayer('links-layer', this.viewport);
    this.lblLayer = this.getOrCreateLayer('labels-layer', this.viewport);
    this.theme = window.CONFIG.themes[window.CONFIG.themes.active];
  }

  getOrCreateLayer(id, parent = this.svg) {
    let layer = parent.querySelector(`#${id}`);
    if (!layer) {
      layer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      layer.setAttribute('id', id);
      parent.appendChild(layer);
    }
    return layer;
  }

  setTransform(x, y, scale) {
    this.viewport.setAttribute('transform', `translate(${x}, ${y}) scale(${scale})`);
  }

  clear() {
    this.nLayer.innerHTML = '';
    this.lLayer.innerHTML = '';
    this.lblLayer.innerHTML = '';
    document.body.style.backgroundColor = this.theme.colors.background;
    document.body.style.color = this.theme.colors.text;
  }

  setDimensions(width, height) {
    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }

  drawRect(x, y, w, h, fill, stroke, typeData, statusData) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x - w / 2);
    rect.setAttribute('y', y - h / 2);
    rect.setAttribute('width', w);
    rect.setAttribute('height', h);
    rect.setAttribute('rx', typeData.rx);
    rect.setAttribute('fill', fill);
    rect.setAttribute('stroke', stroke);
    rect.setAttribute('stroke-width', typeData.stroke);
    if (typeData.dash) rect.setAttribute('stroke-dasharray', typeData.dash);
    
    rect.setAttribute('opacity', statusData.opacity || 1);
    rect.setAttribute('class', 'node-rect');
    
    if (statusData.glow) {
      const glowRadius = window.CONFIG.visuals.node.glowRadius || 15;
      rect.style.filter = `drop-shadow(0 0 ${glowRadius}px ${stroke})`;
    }
    
    return rect;
  }

  drawText(x, y, text, size, color, family, weight = '900') {
    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('x', x);
    txt.setAttribute('y', y);
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('dominant-baseline', 'central'); // Crítico para alineación matemática
    txt.setAttribute('font-family', family);
    txt.setAttribute('font-size', size);
    txt.setAttribute('font-weight', weight);
    txt.setAttribute('fill', color);
    txt.textContent = text;
    return txt;
  }

  drawPath(d, color, width, markerId, isDashed = false) {
    const v = window.CONFIG.visuals.links;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', width);
    if (isDashed) path.setAttribute('stroke-dasharray', v.dashArray);
    if (markerId) path.setAttribute('marker-end', `url(#${markerId})`);
    return path;
  }

  drawLabel(x, y, text, color, fontSize, rotation = 0) {
    if (!text) return;
    const v = window.CONFIG.visuals.labels;
    const w = text.length * (fontSize * v.widthFactor) + v.widthPadding;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x - w / 2);
    rect.setAttribute('y', y - v.rectYOffset);
    rect.setAttribute('width', w);
    rect.setAttribute('height', v.rectHeight);
    rect.setAttribute('rx', v.rectRx);
    rect.setAttribute('fill', this.theme.colors.canvas);
    rect.setAttribute('fill-opacity', '1.0'); // Opacidad total para ocultar la línea
    rect.setAttribute('stroke', this.theme.colors.muted);
    rect.setAttribute('stroke-width', '1');
    
    const txt = this.drawText(x, y + v.textYOffset, text, fontSize, color, this.theme.fonts.body, '900');
    txt.setAttribute('font-style', 'italic');

    if (rotation !== 0) {
      g.setAttribute('transform', `rotate(${rotation}, ${x}, ${y})`);
    }

    g.appendChild(rect);
    g.appendChild(txt);
    this.lblLayer.appendChild(g);
  }

  drawHierarchicalConnection(f, t, label, color, marker) {
    const v = window.CONFIG.visuals.links;
    const drop = v.conceptLinkDrop || 0;
    const y1 = f.pos.y + f.size.h/2;
    const y2 = t.pos.y - t.size.h/2; // Destino real: borde superior del nodo
    const tail = 20; // Pequeño tramo recto al final para que la flecha entre vertical
    
    const P0 = { x: f.pos.x, y: y1 + drop };
    const P1 = { x: f.pos.x, y: y1 + drop + (y2 - tail - (y1 + drop)) * v.bezierFactor };
    const P2 = { x: t.pos.x, y: y1 + drop + (y2 - tail - (y1 + drop)) * v.bezierFactor };
    const P3 = { x: t.pos.x, y: y2 - tail };

    const midX = 0.125 * P0.x + 0.375 * P1.x + 0.375 * P2.x + 0.125 * P3.x;
    const midY = 0.125 * P0.y + 0.375 * P1.y + 0.375 * P2.y + 0.125 * P3.y;

    const dx = 1.5 * (t.pos.x - f.pos.x);
    const dy = 0.75 * (y2 - tail - (y1 + drop));
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    if (Math.abs(angle) > 45) angle = 0;
    else {
      if (angle > 90) angle -= 180;
      if (angle < -90) angle += 180;
    }

    // Detector Automático de Flujo Horizontal (Timeline Bidireccional)
    if (f.pos.y === t.pos.y) {
      const isRight = t.pos.x > f.pos.x; // ¿Fluye hacia la derecha?
      
      const x1 = isRight ? f.pos.x + f.size.w/2 : f.pos.x - f.size.w/2;
      const y1 = f.pos.y;
      const x2 = isRight ? t.pos.x - t.size.w/2 : t.pos.x + t.size.w/2;
      const y2 = t.pos.y;
      
      const P1 = { x: x1 + (x2 - x1) * 0.4, y: y1 };
      const P2 = { x: x1 + (x2 - x1) * 0.6, y: y2 };

      const midX = (x1 + x2) / 2;
      const midY = y1;

      const d = `M ${x1} ${y1} C ${P1.x} ${P1.y}, ${P2.x} ${P2.y}, ${x2} ${y2}`;
      this.lLayer.appendChild(this.drawPath(d, color, v.conceptWidth, marker));
      this.drawLabel(midX, midY - 60, label, color, v.labelFontSize * v.conceptLabelFontMultiplier, 0);
      return;
    }

    // Flujo Vertical Tradicional
    const d = `M ${f.pos.x} ${y1} L ${f.pos.x} ${y1 + drop} C ${P1.x} ${P1.y}, ${P2.x} ${P2.y}, ${P3.x} ${P3.y} L ${t.pos.x} ${y2}`;
    this.lLayer.appendChild(this.drawPath(d, color, v.conceptWidth, marker));
    this.drawLabel(midX, midY, label, color, v.labelFontSize * v.conceptLabelFontMultiplier, angle);
  }

  drawSemanticConnection(f, t, label, color, nodesMaxX) {
    const v = window.CONFIG.visuals.links;
    const activeTheme = window.CONFIG.themes[window.CONFIG.themes.active];
    const corridorX = nodesMaxX + v.corridorOffset;
    const d = `M ${f.pos.x + f.size.w/2} ${f.pos.y} L ${corridorX} ${f.pos.y} L ${corridorX} ${t.pos.y} L ${t.pos.x + t.size.w/2} ${t.pos.y}`;
    this.lLayer.appendChild(this.drawPath(d, activeTheme.colors.blue, v.semanticWidth, 'arr-blue', true));
    this.drawLabel(corridorX, (f.pos.y + t.pos.y) / 2, label, activeTheme.colors.blue, v.labelFontSize * v.semanticLabelFontMultiplier, 90);
  }

  drawRootConnection(f, t, label, color, nodesMinX, marker) {
    const v = window.CONFIG.visuals.links;
    const corridorX = nodesMinX - v.corridorOffset;
    const d = `M ${f.pos.x} ${f.pos.y + f.size.h/2} L ${f.pos.x} ${f.pos.y + f.size.h/2 + v.rootLinkDrop} L ${corridorX} ${f.pos.y + f.size.h/2 + v.rootLinkDrop} L ${corridorX} ${t.pos.y} L ${t.pos.x - t.size.w/2 - v.rootLinkTailGap} ${t.pos.y}`;
    this.lLayer.appendChild(this.drawPath(d, color, v.rootWidth, marker));
    this.drawLabel(corridorX, (f.pos.y + f.size.h/2 + v.rootLinkDrop + t.pos.y) / 2, label, color, v.labelFontSize, 90);
  }
}
