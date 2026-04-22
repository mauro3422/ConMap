/**
 * UTILS: Progress Manager v1.0
 * Gestiona la persistencia del estado de los nodos (learned, critical, pending) en localStorage.
 */

window.ProgressManager = class {
  constructor() {
    this.STORAGE_KEY = 'antigravity_study_progress';
    this.data = this._load();
  }

  _load() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  _save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  }

  // Obtener estado para un nodo específico
  getNodeStatus(topicId, nodeId, defaultStatus = 'pending') {
    if (this.data[topicId] && this.data[topicId][nodeId]) {
      return this.data[topicId][nodeId];
    }
    return defaultStatus;
  }

  // Ciclar estado: pending -> learned -> critical -> pending
  cycleStatus(topicId, nodeId) {
    const current = this.getNodeStatus(topicId, nodeId);
    let next = 'pending';

    if (current === 'pending') next = 'learned';
    else if (current === 'learned') next = 'critical';
    else if (current === 'critical') next = 'pending';

    if (!this.data[topicId]) this.data[topicId] = {};
    this.data[topicId][nodeId] = next;
    
    this._save();
    return next;
  }

  // Limpiar progreso de un tema
  clearTopic(topicId) {
    if (this.data[topicId]) {
      delete this.data[topicId];
      this._save();
    }
  }
};
