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

  drawLabel(x, y, text, color, fontSize) {
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
    rect.setAttribute('fill-opacity', '0.9');
    rect.setAttribute('stroke', this.theme.colors.muted);
    rect.setAttribute('stroke-width', '1');
    
    const txt = this.drawText(x, y + v.textYOffset, text, fontSize, color, this.theme.fonts.body, '900');
    txt.setAttribute('font-style', 'italic');

    g.appendChild(rect);
    g.appendChild(txt);
    this.lblLayer.appendChild(g);
  }
};
