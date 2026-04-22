/**
 * UTILS: Zoom Engine v1.0
 * Maneja el zoom y paneo del SVG de forma nativa.
 * Usa transformaciones de matriz para máxima performance.
 */

window.ZoomEngine = class {
  constructor(svgId, viewportId) {
    this.svg = document.getElementById(svgId);
    this.viewport = document.getElementById(viewportId);
    
    this.state = {
      scale: 1,
      x: 0,
      y: 0,
      isPanning: false,
      startX: 0,
      startY: 0,
      isPinching: false,
      initialPinchDist: 0,
      pinchCenterX: 0,
      pinchCenterY: 0
    };

    this.config = {
      minScale: 0.1,
      maxScale: 20,
      zoomStep: 0.1
    };

    this._init();
  }

  _init() {
    if (!this.svg || !this.viewport) return;

    // Wheel Zoom
    this.svg.addEventListener('wheel', (e) => {
      // SOLO si estamos en modo interactivo
      if (!document.body.classList.contains('mode-interactive')) return;
      
      e.preventDefault();
      
      // Zoom más sensible con la rueda
      const factor = Math.abs(e.deltaY) > 50 ? 0.2 : 0.05;
      const delta = e.deltaY > 0 ? -factor : factor;
      
      this.zoomAt(delta, e.clientX, e.clientY);
    }, { passive: false });

    // Mouse Panning
    this.svg.addEventListener('mousedown', (e) => {
      // SOLO si estamos en modo interactivo
      if (!document.body.classList.contains('mode-interactive')) return;
      if (e.button !== 0) return; // Solo click izquierdo
      
      e.preventDefault(); 
      e.stopPropagation();
      
      this.state.isPanning = true;
      
      // CÁLCULO DE PRECISIÓN: Determinar el ratio real de visualización (meet/slice)
      const rect = this.svg.getBoundingClientRect();
      const viewBox = this.svg.viewBox.baseVal;
      
      // Usamos el factor máximo para asegurar que el movimiento sea 1:1 en la pantalla
      // independientemente de si el mapa se ajusta por ancho o por alto.
      this._screenToSvgScale = Math.max(viewBox.width / rect.width, viewBox.height / rect.height);

      this.state.startX = e.clientX;
      this.state.startY = e.clientY;
      this.state.initialX = this.state.x;
      this.state.initialY = this.state.y;
      
      this.svg.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.state.isPanning) return;
      
      e.preventDefault();
      
      const dx = (e.clientX - this.state.startX) * this._screenToSvgScale;
      const dy = (e.clientY - this.state.startY) * this._screenToSvgScale;
      
      this.state.x = this.state.initialX + dx;
      this.state.y = this.state.initialY + dy;
      
      // Throttle con rAF para máxima fluidez sin sobrecargar el bus de render
      if (!this._ticking) {
        requestAnimationFrame(() => {
          this.apply();
          this._ticking = false;
        });
        this._ticking = true;
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.state.isPanning) {
        this.state.isPanning = false;
        this.svg.style.cursor = 'grab';
        // Feedback visual instantáneo
        this.apply();
      }
    });

    // --- TOUCH SUPPORT (Panning 1 dedo + Pinch-to-Zoom 2 dedos) ---
    this.svg.addEventListener('touchstart', (e) => {
      if (!document.body.classList.contains('mode-interactive')) return;
      e.preventDefault(); // Previene zoom nativo del navegador en todos los casos

      const rect = this.svg.getBoundingClientRect();
      const viewBox = this.svg.viewBox.baseVal;
      this._screenToSvgScale = Math.max(viewBox.width / rect.width, viewBox.height / rect.height);

      if (e.touches.length === 1) {
        // --- Modo: Paneo con 1 dedo ---
        this.state.isPinching = false;
        this.state.isPanning = true;
        this.state.startX = e.touches[0].clientX;
        this.state.startY = e.touches[0].clientY;
        this.state.initialX = this.state.x;
        this.state.initialY = this.state.y;
      } else if (e.touches.length === 2) {
        // --- Modo: Pinch-to-Zoom con 2 dedos ---
        this.state.isPanning = false;
        this.state.isPinching = true;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        this.state.initialPinchDist = Math.hypot(dx, dy);
        // El punto focal es el centro entre los dos dedos
        this.state.pinchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        this.state.pinchCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (!document.body.classList.contains('mode-interactive')) return;

      if (this.state.isPanning && e.touches.length === 1) {
        // --- Paneo activo ---
        e.preventDefault();
        const dx = (e.touches[0].clientX - this.state.startX) * this._screenToSvgScale;
        const dy = (e.touches[0].clientY - this.state.startY) * this._screenToSvgScale;
        this.state.x = this.state.initialX + dx;
        this.state.y = this.state.initialY + dy;
        if (!this._ticking) {
          requestAnimationFrame(() => { this.apply(); this._ticking = false; });
          this._ticking = true;
        }
      } else if (this.state.isPinching && e.touches.length === 2) {
        // --- Pinch-to-Zoom activo ---
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDist = Math.hypot(dx, dy);

        // Delta incremental: diferencia respecto al fotograma anterior
        const diff = currentDist - this.state.initialPinchDist;
        this.zoomAt(diff * 0.008, this.state.pinchCenterX, this.state.pinchCenterY);

        // Re-anclar la distancia para el siguiente frame (incremental, no acumulativo)
        this.state.initialPinchDist = currentDist;
      }
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) this.state.isPinching = false;
      if (e.touches.length === 0) {
        this.state.isPanning = false;
        return;
      }
      // Re-anclaje: si el usuario suelta 1 dedo y sigue arrastrando con el otro,
      // reanudamos el paneo desde la posición actual para evitar "salto" visual.
      if (e.touches.length === 1 && !this.state.isPinching) {
        this.state.isPanning = true;
        this.state.startX = e.touches[0].clientX;
        this.state.startY = e.touches[0].clientY;
        this.state.initialX = this.state.x;
        this.state.initialY = this.state.y;
      }
    });
  }

  zoomAt(delta, clientX, clientY) {
    const newScale = Math.min(this.config.maxScale, Math.max(this.config.minScale, this.state.scale + delta));
    if (newScale === this.state.scale) return;

    const rect = this.svg.getBoundingClientRect();
    const viewBox = this.svg.viewBox.baseVal;
    
    // CORRECCIÓN FOCAL: Usar el mismo factor de escala de pantalla
    const screenToSvg = Math.max(viewBox.width / rect.width, viewBox.height / rect.height);
    
    const mouseX = (clientX - rect.left) * screenToSvg;
    const mouseY = (clientY - rect.top) * screenToSvg;

    const ratio = newScale / this.state.scale;
    this.state.x = mouseX - (mouseX - this.state.x) * ratio;
    this.state.y = mouseY - (mouseY - this.state.y) * ratio;
    this.state.scale = newScale;

    this.apply();
  }

  zoomIn() { this.zoomAt(this.config.zoomStep, window.innerWidth/2, window.innerHeight/2); }
  zoomOut() { this.zoomAt(-this.config.zoomStep, window.innerWidth/2, window.innerHeight/2); }

  reset() {
    this.state.scale = 1;
    this.state.x = 0;
    this.state.y = 0;
    this.apply();
  }

  // Centrar el mapa basado en el layout generado
  center(layoutWidth, layoutHeight) {
    const svgRect = this.svg.getBoundingClientRect();
    const padding = 50;
    
    const scaleX = (svgRect.width - padding * 2) / layoutWidth;
    const scaleY = (svgRect.height - padding * 2) / layoutHeight;
    
    // SMART ZOOM: Limitamos el zoom inicial para mapas pequeños 
    // para que no se vean "en la cara". Máximo 0.8 de escala inicial.
    this.state.scale = Math.min(0.8, Math.min(scaleX, scaleY));
    
    this.state.x = (svgRect.width - layoutWidth * this.state.scale) / 2;
    this.state.y = padding; // Un poco de espacio arriba
    
    this.apply();
  }

  apply() {
    this.viewport.setAttribute('transform', `translate(${this.state.x}, ${this.state.y}) scale(${this.state.scale})`);
  }
};
