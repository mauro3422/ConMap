/**
 * ENGINE: ConceptNode Model
 * Represents a single logical node in the concept map, calculating its own dimensions based on content.
 */

window.ConceptNode = class ConceptNode {
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
    
    // Altura inteligente: sumamos todos los bloques con sus espaciados reales configurados
    let h = v.heightBase;
    h += baseSize * v.titleLineHeight;
    if (this.context) h += baseSize * to.contextSizeMultiplier + v.contextOffset;
    if (this.lines.length > 0) h += (this.lines.length * to.lineSpacing) + to.linesStartOffset;
    if (this.details) h += to.detailsFontSize + 50; // Margen dinámico inferior
    
    this.size = new window.Size(w, h);
    
    const palette = window.CONFIG.themes[window.CONFIG.themes.active].colors;
    this.color = (this.typeCfg.color && palette[this.typeCfg.color]) 
                 ? palette[this.typeCfg.color]
                 : (palette[this.themeName] || palette.gold);
                 
    this.bg = palette.background;
  }
};
