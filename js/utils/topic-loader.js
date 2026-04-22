/**
 * UTILS: Topic Loader v3.0 — Orchestrator
 * Orquesta la carga de datos y la actualización de la UI.
 */

window.TopicLoader = class {
  constructor() {
    this._activeId = null;
    this._cache = {};
    this.menu = null;
    this.modal = null;
  }

  init(initialTopicId) {
    // Inicializar Componentes
    this.menu = new window.TopicMenu({
      onSelect: (id) => this._load(id),
      onDelete: (id) => this._deleteTopic(id),
      onAddRequest: () => this.modal.show()
    });

    this.modal = new window.CreationModal((config) => this._createNewTopic(config));

    // Carga inicial
    const initialTopic = window.StorageManager.getTopicById(initialTopicId);
    this._cache[initialTopicId] = JSON.parse(JSON.stringify(window.mapData));
    
    this._refreshUI(initialTopicId);
    if (initialTopic) this._updateHeader(initialTopic); // FIX: Cargar leyenda al inicio

    // Activar Sincronización Multi-Pestaña
    window.StorageManager.listenExternalChanges(() => {
      this._refreshUI(this._activeId);
      window.Notifications.show("Temas actualizados desde otra pestaña", "info");
    });
  }

  // ─── ACCIONES ─────────────────────────────────────────────────────────────
  _deleteTopic(id) {
    // Si es un tema del registro (no custom), simplemente lo ocultamos para este usuario.
    // Si es un tema creado por el usuario (custom-*), lo eliminamos de localStorage.
    if (window.StorageManager.isCustom(id)) {
      window.StorageManager.deleteTopic(id);
    } else {
      window.StorageManager.hideRegistryTopic(id);
    }

    // Si borramos el tema activo, volver al primero disponible (siempre Ciudadanía)
    if (this._activeId === id) {
      const remaining = window.StorageManager.getAllTopics();
      if (remaining.length > 0) this._load(remaining[0].id);
    }
    this._refreshUI(this._activeId);
    window.Notifications.show("Mapa eliminado correctamente", "error");
  }

  _createNewTopic(config) {
    const id = 'custom-' + Date.now();
    const newTopic = this._buildTopicObject(id, config);
    
    window.StorageManager.saveTopic(newTopic);
    this._refreshUI(id);
    this._load(id);
    this.menu.close();
    window.Notifications.show("¡Mapa creado con éxito!", "success");
  }

  // ─── UI SYNC ──────────────────────────────────────────────────────────────
  _refreshUI(activeId) {
    const topics = window.StorageManager.getAllTopics();
    this.menu.render(topics, activeId);
    this._activeId = activeId;
  }

  _updateHeader(topic) {
    document.querySelector('h1').innerHTML = topic.displayTitle || topic.title;
    const badge = document.querySelector('.subject-badge');
    if (badge) badge.textContent = topic.subject;

    // Actualizar Leyenda Dinámica
    const legendBox = document.getElementById('dynamicLegend');
    if (!legendBox) return;

    const cats = topic.categories || { gold: 'Clásica', teal: 'Digital', green: 'Gobierno' };
    let html = '';
    if (cats.gold) html += `<span class="legend-item"><div class="ld ld-gold"></div> ${cats.gold}</span>`;
    if (cats.teal) html += `<span class="legend-item"><div class="ld ld-teal"></div> ${cats.teal}</span>`;
    if (cats.green) html += `<span class="legend-item"><div class="ld ld-green"></div> ${cats.green}</span>`;
    html += `<span class="legend-item"><div class="dash-line"></div> Relación</span>`;
    html += `<span class="legend-item"><div class="ld ld-red"></div> Atención</span>`;
    legendBox.innerHTML = html;
  }

  // ─── CORE LOAD ────────────────────────────────────────────────────────────
  _load(topicId) {
    if (topicId === this._activeId) return;
    const topic = window.StorageManager.getTopicById(topicId);
    if (!topic) return;

    const svgEl = document.getElementById('map');
    if (svgEl) svgEl.style.opacity = '0.2';

    if (topic.isCustom) {
      this._apply(topic, topic.data, svgEl);
    } else {
      if (this._cache[topicId]) {
        this._apply(topic, this._cache[topicId], svgEl);
      } else {
        this._injectScript(topic.file, () => {
          this._cache[topicId] = JSON.parse(JSON.stringify(window.mapData));
          this._apply(topic, this._cache[topicId], svgEl);
        });
      }
    }
  }

  _apply(topic, data, svgEl) {
    if (!window.APP) return;
    window.APP.state.data = JSON.parse(JSON.stringify(data));
    window.APP.engine.rawData = window.APP.state.getData();
    window.APP.engine.run();
    
    window.EventBus.emit('topic:loaded', topic);
    this._updateHeader(topic);
    this.menu.updateActive(topic.id);
    this._activeId = topic.id;
    
    if (svgEl) setTimeout(() => (svgEl.style.opacity = '1'), 80);
  }

  _buildTopicObject(id, config) {
    const nodes = [{ id: 'root', title: config.title, context: config.purpose || config.subject, level: 0, theme: 'gold', status: 'pending' }];
    const links = [];

    ['gold', 'teal', 'green'].forEach(theme => {
      if (config.categories[theme]) {
        const nodeId = `t-${theme}-${Date.now()}`;
        nodes.push({ id: nodeId, title: config.categories[theme], level: 1, parentId: 'root', theme, status: 'pending' });
        links.push({ from: 'root', to: nodeId, type: 'hierarchical' });
      }
    });

    config.customBranches.forEach((name, i) => {
      const bId = `cb-${i}-${Date.now()}`;
      nodes.push({ id: bId, title: name, level: 1, parentId: 'root', theme: 'gold', status: 'pending' });
      links.push({ from: 'root', to: bId, type: 'hierarchical' });
    });

    return {
      id, title: config.title, subject: config.subject, purpose: config.purpose,
      displayTitle: config.title.split(' ').join('<br>'),
      categories: config.categories, emoji: '📝', isCustom: true,
      data: { metadata: { ...config, savedAt: new Date().toISOString() }, nodes, links }
    };
  }

  _injectScript(src, callback) {
    const script = document.createElement('script');
    script.src = src + '?v=' + Date.now();
    script.onload = callback;
    document.head.appendChild(script);
  }
};
