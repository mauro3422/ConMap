/**
 * UI: Notification System (Toasts)
 * Muestra alertas visuales premium que desaparecen solas.
 */

window.Notifications = {
  container: null,

  _ensureContainer() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);

    // Estilos dinámicos para no ensuciar CSS si no es necesario, 
    // pero lo ideal es ponerlo en base.css. Por ahora, inyectamos.
    const style = document.createElement('style');
    style.textContent = `
      .toast-container {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 30000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      }
      .toast {
        background: rgba(13, 17, 23, 0.9);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        padding: 12px 24px;
        border-radius: 100px;
        font-size: 0.9rem;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        gap: 10px;
        animation: toast-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        pointer-events: auto;
      }
      .toast.success { border-left: 4px solid var(--accent-green); }
      .toast.error { border-left: 4px solid #ff4d4d; }
      .toast.info { border-left: 4px solid var(--accent-gold); }

      @keyframes toast-in {
        from { opacity: 0; transform: translateY(20px) scale(0.9); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes toast-out {
        to { opacity: 0; transform: translateY(-10px) scale(0.9); }
      }
    `;
    document.head.appendChild(style);
  },

  show(message, type = 'info', duration = 3000) {
    this._ensureContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️');
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toast-out 0.3s forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};
