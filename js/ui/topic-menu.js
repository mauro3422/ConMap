/**
 * UI: Topic Menu Component
 * Maneja la visualización y el toggle del menú desplegable.
 */

window.TopicMenu = class {
  constructor(options) {
    this.container = document.getElementById('topicDropdown');
    this.btn = document.getElementById('topicMenuBtn');
    this.isOpen = false;
    this.onSelect = options.onSelect;
    this.onDelete = options.onDelete;
    this.onAddRequest = options.onAddRequest;

    this._attachEvents();
  }

  render(topics, activeId) {
    if (!this.container) return;

    this.container.innerHTML = `
      <span class="topic-dropdown-label">Mis Temas</span>
      <div class="topic-items-container" id="topicsContainer"></div>
      <div class="dropdown-action">
        <button class="add-topic-btn" id="addNewTopicBtn">+ Nuevo Mapa</button>
      </div>
    `;

    const itemsBox = this.container.querySelector('#topicsContainer');
    
    topics.forEach(topic => {
      const item = document.createElement('div');
      item.className = `topic-dropdown-item ${topic.id === activeId ? 'active' : ''}`;
      item.dataset.id = topic.id;
      
      const isDeletable = window.StorageManager.isDeletable(topic.id);
      const purposeHtml = topic.purpose ? `<span class="purpose-badge">${topic.purpose}</span>` : '';
      
      item.innerHTML = `
        <div class="topic-item-content">
          <span class="topic-item-emoji">${topic.emoji || '📄'}</span>
          <span class="topic-item-text">${topic.title} ${purposeHtml}</span>
          <div class="topic-item-actions">
            <span class="topic-item-check">✓</span>
            ${isDeletable ? `<button class="delete-topic-btn" title="Borrar mapa">🗑️</button>` : ''}
          </div>
        </div>
      `;

      // Eventos
      item.querySelector('.topic-item-content').onclick = (e) => {
        e.stopPropagation();
        this.onSelect(topic.id);
        this.close();
      };

      if (isDeletable) {
        const delBtn = item.querySelector('.delete-topic-btn');
        delBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          item.style.background = 'rgba(255, 77, 77, 0.2)';
          this.onDelete(topic.id);
        };
      }

      itemsBox.appendChild(item);
    });

    this.container.querySelector('#addNewTopicBtn').onclick = (e) => {
      e.stopPropagation();
      this.onAddRequest();
    };
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    this.container.classList.add('open');
    this.btn.classList.add('open');
  }

  close() {
    this.isOpen = false;
    this.container.classList.remove('open');
    this.btn.classList.remove('open');
  }

  updateActive(id) {
    this.container.querySelectorAll('.topic-dropdown-item').forEach(el => {
      el.classList.toggle('active', el.dataset.id === id);
    });
  }

  _attachEvents() {
    this.btn.onclick = (e) => {
      e.stopPropagation();
      this.toggle();
    };

    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.container.contains(e.target)) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }
};
