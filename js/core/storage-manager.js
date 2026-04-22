/**
 * CORE: Storage Manager
 * Única fuente de verdad para los temas (registrados y personalizados).
 */

window.StorageManager = {
  CUSTOM_KEY: 'custom_topics',

  getAllTopics() {
    const registry = window.TOPIC_REGISTRY || [];
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

  // Sincronización Multi-Pestaña
  listenExternalChanges(callback) {
    window.addEventListener('storage', (e) => {
      if (e.key === this.CUSTOM_KEY) {
        callback();
      }
    });
  }
};
