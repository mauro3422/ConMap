/**
 * MAIN: App Orchestrator v19.0
 * Centraliza la inicialización y comunicación de módulos.
 */

window.APP = {
  init() {
    console.log("🚀 Antigravity Study Framework v19.0 — Iniciando...");
    
    try {
      this.state    = new window.MapState(window.mapData);
      this.renderer = new window.MapRenderer('map');
      this.strategy = new window.VerticalInfographicStrategy(window.CONFIG.layout);
      this.engine   = new window.ConceptMap(this.state.getData(), this.renderer, this.strategy);
      this.zoom     = new window.ZoomEngine('map', 'viewport');
      this.progress = new window.ProgressManager();
      this.view     = new window.ViewManager(this.zoom);
      this.loader   = new window.TopicLoader();

      this._bindEvents();
      this.start();
      
      console.log("✅ Sistema listo y estandarizado.");
    } catch (err) {
      console.error("❌ Error en el arranque:", err);
    }
  },

  _bindEvents() {
    // Re-render reactivo vía EventBus
    window.EventBus.on('state:updated', (newData) => {
      this.engine.rawData = newData;
      this.engine.run();
    });

    // Resize con debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.engine.run(), 150);
    });

    // Eventos de tema
    window.EventBus.on('topic:loaded', () => {
      if (this.view.isInteractive) {
        this.zoom.center(this.engine.lastLayout.width, this.engine.lastLayout.height);
      }
    });

    // Modo Impresión Automático (Light Theme)
    window.addEventListener('beforeprint', () => {
      this._previousTheme = window.CONFIG.themes.active;
      window.CONFIG.themes.active = 'paper';
      
      const themeConfig = window.CONFIG.themes.paper.colors;
      document.body.style.backgroundColor = themeConfig.background;
      document.body.style.color = themeConfig.text;
      
      const canvas = document.querySelector('.canvas-wrap');
      if (canvas) canvas.style.background = themeConfig.canvas;
      
      this.engine.run();
    });

    window.addEventListener('afterprint', () => {
      window.CONFIG.themes.active = this._previousTheme || 'midnight';
      
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      
      const canvas = document.querySelector('.canvas-wrap');
      if (canvas) canvas.style.background = '';
      
      this.engine.run();
    });
  },

  start() {
    this.engine.run();
    this.view.init();
    if (window.TOPIC_REGISTRY) {
      this.loader.init(window.TOPIC_REGISTRY[0].id);
    }
  }
};

window.addEventListener('DOMContentLoaded', () => window.APP.init());
