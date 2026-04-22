/**
 * TOPIC REGISTRY v1.0
 * Registro centralizado de todos los temas disponibles.
 * Para agregar un tema nuevo: copiar un objeto del array y completarlo.
 */

window.TOPIC_REGISTRY = [
  {
    id: 'ciudadania-gobierno-digital',
    title: 'Ciudadanía y Gobierno Digital',
    displayTitle: 'Ciudadanía y<br>Gobierno Digital',
    subject: 'Formación Ética y Ciudadana',
    file: 'topics/ciudadania-gobierno-digital.js',
    color: '#f5c842',   // gold
    emoji: '📖',
    rootTheme: 'gold'
  },
  {
    id: 'el-estado',
    title: 'El Estado y sus Elementos',
    displayTitle: 'El Estado y<br>sus Elementos',
    subject: 'Formación Ética y Ciudadana',
    file: 'topics/el-estado.js',
    color: '#42e5c8',   // teal
    emoji: '🏛️',
    rootTheme: 'teal',
    deletable: true
  },
  {
    id: 'derechos-humanos',
    title: 'Derechos Humanos',
    displayTitle: 'Derechos<br>Humanos',
    subject: 'Formación Ética y Ciudadana',
    file: 'topics/derechos-humanos.js',
    color: '#5dde8c',   // green
    emoji: '⚖️',
    rootTheme: 'green',
    deletable: true
  }
];
