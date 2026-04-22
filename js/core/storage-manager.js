/**
 * CORE: Storage Manager
 * Única fuente de verdad para los temas (registrados y personalizados).
 */

window.StorageManager = {
  CUSTOM_KEY: 'custom_topics',

  getAllTopics() {
    const hidden = this.getHiddenRegistryIds();
    const registry = (window.TOPIC_REGISTRY || []).filter(t => !hidden.includes(t.id));
    const custom = this.getCustomTopics();
    return [...registry, ...custom];
  },

  getCustomTopics() {
    try {
      return JSON.parse(localStorage.getItem(this.CUSTOM_KEY) || '[]');
    } catch (e) {
      console.error("Storage Error: Falló la lectura de temas personalizados.", e);
      return [];
    }
  },

  getTopicById(id) {
    return this.getAllTopics().find(t => t.id === id);
  },

  saveTopic(newTopic) {
    const customs = this.getCustomTopics();
    customs.push(newTopic);
    localStorage.setItem(this.CUSTOM_KEY, JSON.stringify(customs));
  },

  deleteTopic(id) {
    const customs = this.getCustomTopics();
    const updated = customs.filter(t => t.id !== id);
    localStorage.setItem(this.CUSTOM_KEY, JSON.stringify(updated));
  },

  isCustom(id) {
    return id.toString().startsWith('custom-');
  },

  // Retorna true si el tema puede mostrarse con icóno de borrado
  isDeletable(id) {
    if (this.isCustom(id)) return true;
    const topic = (window.TOPIC_REGISTRY || []).find(t => t.id === id);
    return !!(topic && topic.deletable);
  },

  // IDs de temas del registry que el usuario ya eligió ocultar
  HIDDEN_KEY: 'hidden_registry_topics',

  getHiddenRegistryIds() {
    try {
      return JSON.parse(localStorage.getItem(this.HIDDEN_KEY) || '[]');
    } catch { return []; }
  },

  hideRegistryTopic(id) {
    const hidden = this.getHiddenRegistryIds();
    if (!hidden.includes(id)) {
      hidden.push(id);
      localStorage.setItem(this.HIDDEN_KEY, JSON.stringify(hidden));
    }
  },

  // Sincronización Multi-Pestaña
  listenExternalChanges(callback) {
    window.addEventListener('storage', (e) => {
      if (e.key === this.CUSTOM_KEY) {
        callback();
      }
    });
  }
};
