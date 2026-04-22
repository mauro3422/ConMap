/**
 * UTILS: View Manager v1.0
 * Alterna entre modo "Infografía" (Scroll natural, centrado)
 * y modo "Interactivo" (Zoom & Pan).
 */

window.ViewManager = class {
  constructor(zoomEngine) {
    this.zoom = zoomEngine;
    this.isInteractive = false; // Por defecto: Infografía (OnePage)
    this._btn = null;
  }

  init() {
    this._btn = document.getElementById('viewModeToggle');
    if (!this._btn) return;

    this._btn.addEventListener('click', () => this.toggle());
    
    // Aplicar estado inicial
    this._apply();
  }

  toggle() {
    this.isInteractive = !this.isInteractive;
    this._apply();
  }

  _apply() {
    const body = document.body;
    const zoomControls = document.querySelector('.zoom-controls');
    
    if (this.isInteractive) {
      body.classList.add('mode-interactive');
      body.classList.remove('mode-infographic');
      if (zoomControls) zoomControls.style.display = 'flex';
      this._btn.innerHTML = '<span>📄</span> Ver Infografía';
      this._btn.classList.add('active');
    } else {
      body.classList.add('mode-infographic');
      body.classList.remove('mode-interactive');
      if (zoomControls) zoomControls.style.display = 'none';
      this._btn.innerHTML = '<span>🔍</span> Modo Interactivo';
      this._btn.classList.remove('active');
      
      // Resetear zoom al volver a modo infografía
      if (this.zoom) this.zoom.reset();
    }
  }
};
