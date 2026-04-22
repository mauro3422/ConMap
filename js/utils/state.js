/**
 * UTILS: MapState Manager v2.0
 * Standardized state management using Observer Pattern.
 * Single Source of Truth for nodes and links.
 */

window.MapState = class {
  constructor(initialData) {
    this.data = JSON.parse(JSON.stringify(initialData)); // Deep clone - protege el original
    this._subscribers = [];
    this._idCounter = this.data.nodes.length; // Contador para IDs únicos garantizados
  }

  // --- LEER ---
  getData() {
    return this.data;
  }

  getNodeById(id) {
    return this.data.nodes.find(n => n.id === id) || null;
  }

  // --- ESCRIBIR: NODOS ---
  addNode(node) {
    if (!node.id) {
      node.id = `node_${++this._idCounter}`;
    }
    if (this.data.nodes.find(n => n.id === node.id)) {
      console.error(`[MapState] Node "${node.id}" already exists.`);
      return false;
    }
    if (node.parentId && !this.getNodeById(node.parentId)) {
      console.error(`[MapState] parentId "${node.parentId}" not found.`);
      return false;
    }
    this.data.nodes.push(node);
    this._notify();
    return true;
  }

  updateNode(id, changes) {
    const node = this.data.nodes.find(n => n.id === id);
    if (!node) {
      console.error(`[MapState] Node "${id}" not found for update.`);
      return false;
    }
    Object.assign(node, changes);
    this._notify();
    return true;
  }

  removeNode(id) {
    const index = this.data.nodes.findIndex(n => n.id === id);
    if (index === -1) {
      console.error(`[MapState] Node "${id}" not found.`);
      return false;
    }
    this.data.nodes.splice(index, 1);
    // También limpiar los links huérfanos
    this.data.links = this.data.links.filter(l => l.from !== id && l.to !== id);
    this._notify();
    return true;
  }

  // --- ESCRIBIR: LINKS ---
  addLink(link) {
    if (!this.getNodeById(link.from)) {
      console.error(`[MapState] Link source "${link.from}" not found.`);
      return false;
    }
    if (!this.getNodeById(link.to)) {
      console.error(`[MapState] Link target "${link.to}" not found.`);
      return false;
    }
    this.data.links.push(link);
    this._notify();
    return true;
  }

  _notify() {
    if (window.EventBus) {
      window.EventBus.emit('state:updated', this.data);
    }
    // Mantener compatibilidad con suscriptores directos por ahora
    this._subscribers.forEach(cb => cb(this.data));
  }
};
