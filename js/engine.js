/**
 * ENGINE: ConceptMap Orchestrator v18.0
 * Uses Strategy Pattern and Structured Geometry.
 */

class ConceptNode {
  constructor(raw) {
    this.id = raw.id || `node_${Math.random().toString(36).substr(2, 9)}`;
    this.title = raw.title || "Sin título";
    this.context = raw.context || "";
    this.details = raw.details || "";
    this.level = raw.level || 0;
    this.parentId = raw.parentId;
    this.lines = Array.isArray(raw.lines) ? raw.lines : []; // Bullet points
    
    if (this.level > 0 && !this.parentId) {
      console.warn(`⚠️ Nodo "${this.title}" (${this.id}) en nivel ${this.level} no tiene parentId.`);
    }
    
    this.type = raw.type || (this.level === 0 ? 'root' : (this.level === 1 ? 'header' : 'concept'));
    
    // Priorizar status persistido si hay un topicId disponible
    const topicId = window.APP?.loader?._activeId;
    this.status = (topicId && window.APP?.progress) 
      ? window.APP.progress.getNodeStatus(topicId, this.id, raw.status || 'pending')
      : (raw.status || 'pending');

    this.themeName = raw.theme || 'gold';
    
    this.typeCfg = window.CONFIG.nodeTypes[this.type] || window.CONFIG.nodeTypes.concept;
    this.statusCfg = window.CONFIG.statuses[this.status] || window.CONFIG.statuses.pending;
    
    this.children = [];
    this.pos = new window.Point(0, 0);
    this.subtreeWidth = 0;
    
    // Dimensiones usando font-size real por campo (fix overflow)
    const v = window.CONFIG.visuals.node;
    const to = v.textOffsets;
    const cf = v.charWidthFactor;
    const baseSize = this.typeCfg.fontSize;
    
    const titleW   = this.title.length   * baseSize * cf;
    const contextW = this.context ? this.context.length * (baseSize * to.contextSizeMultiplier) * cf : 0;
    const detailsW = this.details ? this.details.length * to.detailsFontSize * cf : 0;
    const linesW   = this.lines.length > 0
      ? Math.max(...this.lines.map(l => (l.length + 2) * to.bulletFontSize * cf))
      : 0;
    
    const w = Math.max(v.minWidth, Math.max(titleW, contextW, detailsW, linesW) + v.widthPadding);
    
    // Altura inteligente: sumamos todos los bloques con márgenes reales
    const h = v.heightBase 
            + (baseSize * v.titleLineHeight) 
            + (this.context ? baseSize * to.contextSizeMultiplier + v.contextOffset : 0)
            + (this.lines.length > 0 ? (this.lines.length * v.linesHeightPerItem) + to.linesStartOffset : 0)
            + (this.details ? v.detailsHeight : 0);
    
    this.size = new window.Size(w, h);
    
    const palette = window.CONFIG.themes[window.CONFIG.themes.active].colors;
    this.color = (this.typeCfg.color && palette[this.typeCfg.color]) 
                 ? palette[this.typeCfg.color]
                 : (palette[this.themeName] || palette.gold);
                 
    this.bg = palette.background;
  }
}

window.ConceptMap = class {
  constructor(data, renderer, layoutStrategy) {
    this.rawData = data;
    this.renderer = renderer;
    this.layoutStrategy = layoutStrategy;
    this.nodeMap = {};
    this.nodes = [];
  }

  buildTree() {
    if (!this.rawData || !Array.isArray(this.rawData.nodes)) {
      console.warn("⚠️ ConceptMap: No hay nodos para construir el árbol.");
      return [];
    }

    // RESET: limpiar estado previo antes de reconstruir (crítico en re-renders)
    this.nodeMap = {};
    this.nodes = [];

    this.nodes = this.rawData.nodes.map(n => {
      try {
        return new ConceptNode(n);
      } catch (err) {
        console.error(`❌ Error instanciando nodo ${n.id}:`, err);
        return null;
      }
    }).filter(n => n !== null);

    this.nodes.forEach(n => this.nodeMap[n.id] = n);
    this.nodes.forEach(n => {
      if (n.parentId && this.nodeMap[n.parentId]) {
        this.nodeMap[n.parentId].children.push(n);
      }
    });
    return this.nodes;
  }

  run() {
    if (!this.rawData) return;
    
    this.buildTree();
    if (this.nodes.length === 0) return;

    const layout = this.layoutStrategy.apply(this.nodes, this.nodeMap);
    this.lastLayout = layout; 

    this.renderer.clear();
    this.renderer.setDimensions(layout.width, layout.height);

    this.drawLinks(layout);
    this.drawNodes();
  }

  drawLinks(layout) {
    const v = window.CONFIG.visuals.links;
    const layoutCfg = window.CONFIG.layout;
    const activeTheme = window.CONFIG.themes[window.CONFIG.themes.active];

    const nodesArr = Object.values(this.nodeMap);
    const nodesMaxX = Math.max(...nodesArr.map(n => n.pos.x + n.size.w/2));
    const nodesMinX = Math.min(...nodesArr.map(n => n.pos.x - n.size.w/2));

    this.rawData.links.forEach(l => {
      const f = this.nodeMap[l.from];
      const t = this.nodeMap[l.to];
      if (!f || !t) return;

      const marker = f.level === 0 ? 'arr-gold' : `arr-${f.themeName}`;
      const color = f.color;

      if (l.dashed || l.type === 'semantic') {
        const corridorX = nodesMaxX + 180; // Anclado cerca de los nodos
        const d = `M ${f.pos.x + f.size.w/2} ${f.pos.y} L ${corridorX} ${f.pos.y} L ${corridorX} ${t.pos.y} L ${t.pos.x + t.size.w/2} ${t.pos.y}`;
        this.renderer.lLayer.appendChild(this.renderer.drawPath(d, activeTheme.colors.blue, v.semanticWidth, 'arr-blue', true));
        this.renderer.drawLabel(corridorX, (f.pos.y + t.pos.y) / 2, l.label, activeTheme.colors.blue, v.labelFontSize * v.semanticLabelFontMultiplier);
      } else if (f.level === 0) {
        const corridorX = nodesMinX - 180; // Anclado cerca de los nodos por la izquierda
        const d = `M ${f.pos.x} ${f.pos.y + f.size.h/2} L ${f.pos.x} ${f.pos.y + f.size.h/2 + v.rootLinkDrop} L ${corridorX} ${f.pos.y + f.size.h/2 + v.rootLinkDrop} L ${corridorX} ${t.pos.y} L ${t.pos.x - t.size.w/2 - v.rootLinkTailGap} ${t.pos.y}`;
        this.renderer.lLayer.appendChild(this.renderer.drawPath(d, color, v.rootWidth, marker));
        this.renderer.drawLabel(corridorX + v.rootLabelXOffset, t.pos.y - v.labelPadding, l.label, color, v.labelFontSize);
      } else {
        const drop = v.conceptLinkDrop || 0;
        const y1 = f.pos.y + f.size.h/2;
        const y2 = t.pos.y - t.size.h/2 - v.conceptLinkGap;
        
        // Camino: Inicio -> Tramo Recto (Drop) -> Curva Bezier -> Destino
        const d = `M ${f.pos.x} ${y1} 
                   L ${f.pos.x} ${y1 + drop} 
                   C ${f.pos.x} ${y1 + drop + (y2 - (y1 + drop)) * v.bezierFactor}, 
                     ${t.pos.x} ${y1 + drop + (y2 - (y1 + drop)) * v.bezierFactor}, 
                     ${t.pos.x} ${y2}`;
                     
        this.renderer.lLayer.appendChild(this.renderer.drawPath(d, color, v.conceptWidth, marker));
        this.renderer.drawLabel(t.pos.x, t.pos.y - t.size.h/2 - v.conceptLabelGap, l.label, color, v.labelFontSize * v.conceptLabelFontMultiplier);
      }
    });
  }

  drawNodes() {
    const themeCfg = window.CONFIG.themes[window.CONFIG.themes.active];
    const v = window.CONFIG.visuals.node.textOffsets;
    const nodeCfg = window.CONFIG.visuals.node;
    
    this.nodes.forEach(n => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'node-group');
      
      const rect = this.renderer.drawRect(n.pos.x, n.pos.y, n.size.w, n.size.h, n.bg, n.color, n.typeCfg, n.statusCfg);
      g.appendChild(rect);

      // Evento de click para progreso
      g.addEventListener('click', (e) => {
        e.stopPropagation();
        const topicId = window.APP?.loader?._activeId;
        if (topicId && window.APP?.progress) {
          window.APP.progress.cycleStatus(topicId, n.id);
          this.run(); // Re-render para actualizar colores e iconos
        }
      });

      const titleSize = n.typeCfg.fontSize;
      
      // SISTEMA DE BLOQUES NORMALIZADO
      let currentY = n.pos.y - n.size.h/2 + nodeCfg.heightBase / 2;
      
      // 1. Título
      const tTitle = this.renderer.drawText(n.pos.x, currentY, (n.statusCfg.icon ? n.statusCfg.icon + ' ' : '') + n.title, titleSize, n.color, themeCfg.fonts.title);
      g.appendChild(tTitle);
      currentY += (titleSize * nodeCfg.titleLineHeight);

      // 2. Contexto
      if (n.context) {
        const contextSize = titleSize * v.contextSizeMultiplier;
        const tCtx = this.renderer.drawText(n.pos.x, currentY, n.context, contextSize, n.color, themeCfg.fonts.title);
        g.appendChild(tCtx);
        currentY += (contextSize + nodeCfg.contextOffset);
      }

      // 3. Bullet points (con margen de seguridad)
      if (n.lines && n.lines.length > 0) {
        currentY += v.linesStartOffset;
        n.lines.forEach((line, i) => {
          const tLine = this.renderer.drawText(
            n.pos.x, currentY + (i * v.lineSpacing),
            `• ${line}`,
            v.bulletFontSize, n.color, themeCfg.fonts.body, '500'
          );
          g.appendChild(tLine);
        });
        currentY += (n.lines.length * v.lineSpacing);
      }
      
      // 4. Detalles (fijados al final con su propio offset)
      if (n.details) {
        const tDet = this.renderer.drawText(n.pos.x, n.pos.y + n.size.h/2 - v.details, n.details, v.detailsFontSize, n.color, themeCfg.fonts.body, '800');
        tDet.setAttribute('opacity', nodeCfg.detailsOpacity);
        g.appendChild(tDet);
      }
      
      this.renderer.nLayer.appendChild(g);
    });
  }
};
