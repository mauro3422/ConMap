/**
 * CORE: Event Bus v1.0
 * Implementación simple de Pub/Sub para desacoplar módulos.
 */

window.EventBus = {
  _events: {},

  on(event, callback) {
    if (!this._events[event]) this._events[event] = [];
    this._events[event].push(callback);
  },

  emit(event, data) {
    if (!this._events[event]) return;
    this._events[event].forEach(callback => callback(data));
  },

  off(event, callback) {
    if (!this._events[event]) return;
    this._events[event] = this._events[event].filter(cb => cb !== callback);
  }
};
