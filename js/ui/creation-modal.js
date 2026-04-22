/**
 * UI: Creation Modal Component
 * Maneja el formulario de creación de nuevos mapas.
 */

window.CreationModal = class {
  constructor(onConfirm) {
    this.el = document.getElementById('topicModal');
    this.onConfirm = onConfirm;
    this._init();
  }

  show() {
    this.el.classList.add('open');
    const inputTitle = document.getElementById('newTopicTitle');
    inputTitle.value = '';
    inputTitle.focus();
  }

  hide() {
    this.el.classList.remove('open');
  }

  _init() {
    const confirmBtn = document.getElementById('confirmTopic');
    const cancelBtn = document.getElementById('cancelTopic');
    const closeBtn = document.getElementById('closeModal');

    confirmBtn.onclick = (e) => {
      e.preventDefault();
      const config = this._collectData();
      if (config) {
        this.onConfirm(config);
        this.hide();
      }
    };

    cancelBtn.onclick = () => this.hide();
    closeBtn.onclick = () => this.hide();
  }

  _collectData() {
    const title = document.getElementById('newTopicTitle').value.trim();
    if (!title) {
      alert("Por favor, introduce un título.");
      return null;
    }

    return {
      title: title,
      subject: document.getElementById('newTopicSubject').value.trim() || 'Estudio Personal',
      purpose: document.getElementById('newTopicPurpose').value.trim(),
      categories: {
        gold: document.getElementById('labelGold').value.trim(),
        teal: document.getElementById('labelTeal').value.trim(),
        green: document.getElementById('labelGreen').value.trim()
      },
      customBranches: (document.getElementById('customBranches').value || "")
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== '')
    };
  }
};
