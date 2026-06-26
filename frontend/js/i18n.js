// i18n.js — UI strings in EN and ES

const LANG = {
  en: {
    // Nav
    nav_home:     '~ home',
    nav_dashboard:'dashboard',
    nav_filetree: 'file tree',
    nav_scanner:  'scanner',
    nav_cleaner:  'cleaner',

    // Agent status
    agent_on:  'agent connected',
    agent_off: 'agent disconnected',

    // Welcome — typed prompt messages
    prompt_msgs: ['scan', 'detect junk', 'free space'],

    // Welcome — agent install instructions
    install_title: 'Agent not detected. Follow these steps:',
    install_steps: [
      '1. Make sure Node.js 18+ is installed → <a href="https://nodejs.org" target="_blank">nodejs.org</a>',
      '2. Open the <strong>Terminal</strong> app on your Mac',
      '3. Navigate to the agent folder and run:',
    ],
    install_cmd: 'cd agent && npm install && node server.js',
    install_note: '4. Keep that Terminal window open, then refresh this page.',

    // Dashboard
    dash_title:   'Disk Overview',
    dash_dirs:    'Top Directories',
    label_total:  'total',
    label_used:   'used',
    label_free:   'free',

    // File tree
    tree_title: 'File Tree',
    tree_hint:  'Click a folder to expand / collapse. Sizes > 100 MB in yellow, > 1 GB in red.',

    // Scanner
    scan_title:   'Junk Scanner',
    btn_scan:     '[ SCAN DISK ]',
    btn_junk:     '[ DETECT JUNK ]',
    scan_hint:    'SCAN DISK maps your entire home folder. DETECT JUNK finds caches, logs and waste.',
    col_category: 'category',
    col_path:     'path',
    col_size:     'size',
    no_junk:      'No junk detected.',

    // Cleaner
    clean_title:  'Cleaner',
    clean_hint:   'Check items you want to remove, then press DELETE. You will be asked to confirm before anything is deleted.',
    btn_delete:   '[ DELETE SELECTED ]',
    clean_none:   '0 items selected',
    confirm_msg:  (n, size) => `Delete ${n} item(s)?\n~${size} will be freed.\n\nThis cannot be undone.`,

    // Log
    log_ready:      'macdisk-analyzer ready.',
    log_connected:  'Agent connected.',
    log_retrying:   'Agent disconnected. Retrying...',
    log_scanning:   'Scanning home directory...',
    log_junk:       'Detecting junk...',
    log_cleaning:   (n) => `Cleaning ${n} item(s)...`,
    log_agent_stopped: 'Agent not found. Start it on your Mac and click Retry.',
    btn_retry:      '[ RETRY CONNECTION ]',
  },
    nav_home:     '~ inicio',
    nav_dashboard:'resumen',
    nav_filetree: 'árbol',
    nav_scanner:  'escáner',
    nav_cleaner:  'limpieza',

    // Agent status
    agent_on:  'agente conectado',
    agent_off: 'agente desconectado',

    // Welcome — typed prompt messages
    prompt_msgs: ['escanear', 'detectar basura', 'liberar espacio'],

    // Welcome — agent install instructions
    install_title: 'Agente no detectado. Sigue estos pasos:',
    install_steps: [
      '1. Asegúrate de tener Node.js 18+ instalado → <a href="https://nodejs.org" target="_blank">nodejs.org</a>',
      '2. Abre la app <strong>Terminal</strong> en tu Mac',
      '3. Ve a la carpeta del agente y ejecuta:',
    ],
    install_cmd: 'cd agent && npm install && node server.js',
    install_note: '4. Deja esa ventana de Terminal abierta y recarga esta página.',

    // Dashboard
    dash_title:  'Resumen del Disco',
    dash_dirs:   'Directorios Más Pesados',
    label_total: 'total',
    label_used:  'usado',
    label_free:  'libre',

    // File tree
    tree_title: 'Árbol de Archivos',
    tree_hint:  'Haz clic en una carpeta para expandir / contraer. Tamaños > 100 MB en amarillo, > 1 GB en rojo.',

    // Scanner
    scan_title:   'Escáner de Basura',
    btn_scan:     '[ ESCANEAR DISCO ]',
    btn_junk:     '[ DETECTAR BASURA ]',
    scan_hint:    'ESCANEAR DISCO mapea todo tu directorio home. DETECTAR BASURA encuentra cachés, logs y desperdicios.',
    col_category: 'categoría',
    col_path:     'ruta',
    col_size:     'tamaño',
    no_junk:      'No se detectó basura.',

    // Cleaner
    clean_title:  'Limpieza',
    clean_hint:   'Selecciona los elementos que quieres eliminar y presiona ELIMINAR. Se te pedirá confirmación antes de borrar.',
    btn_delete:   '[ ELIMINAR SELECCIONADOS ]',
    clean_none:   '0 elementos seleccionados',
    confirm_msg:  (n, size) => `¿Eliminar ${n} elemento(s)?\n~${size} serán liberados.\n\nEsta acción no se puede deshacer.`,

    // Log
    log_ready:     'macdisk-analyzer listo.',
    log_connected: 'Agente conectado.',
    log_retrying:  'Agente desconectado. Reintentando...',
    log_scanning:  'Escaneando directorio home...',
    log_junk:      'Detectando basura...',
    log_cleaning:  (n) => `Eliminando ${n} elemento(s)...`,
    log_agent_stopped: 'Agente no encontrado. Inícialo en tu Mac y presiona Reintentar.',
    btn_retry:     '[ REINTENTAR CONEXIÓN ]',
  }
};

let currentLang = localStorage.getItem('lang') || 'es';

function t(key, ...args) {
  const val = LANG[currentLang][key];
  return typeof val === 'function' ? val(...args) : val;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyLang();
}

function applyLang() {
  // Nav links
  document.querySelector('[data-view="welcome"]').textContent  = t('nav_home');
  document.querySelector('[data-view="dashboard"]').textContent = t('nav_dashboard');
  document.querySelector('[data-view="filetree"]').textContent  = t('nav_filetree');
  document.querySelector('[data-view="scanner"]').textContent   = t('nav_scanner');
  document.querySelector('[data-view="cleaner"]').textContent   = t('nav_cleaner');

  // Agent status
  const statusEl = document.getElementById('agent-status');
  const connected = statusEl.classList.contains('connected');
  statusEl.querySelector('.label').textContent = connected ? t('agent_on') : t('agent_off');

  // Install instructions
  const box = document.getElementById('agent-install');
  box.querySelector('.install-title').textContent = t('install_title');
  const steps = box.querySelectorAll('.install-step');
  t('install_steps').forEach((s, i) => { steps[i].innerHTML = s; });
  box.querySelector('.install-note').textContent = t('install_note');

  // Section titles
  document.getElementById('title-dashboard').textContent = t('dash_title');
  document.getElementById('title-dirs').textContent      = t('dash_dirs');
  document.getElementById('label-total').textContent     = t('label_total');
  document.getElementById('label-used').textContent      = t('label_used');
  document.getElementById('label-free').textContent      = t('label_free');

  document.getElementById('title-filetree').textContent  = t('tree_title');
  document.getElementById('hint-filetree').textContent   = t('tree_hint');

  document.getElementById('title-scanner').textContent   = t('scan_title');
  document.getElementById('hint-scanner').textContent    = t('scan_hint');
  document.getElementById('btn-scan').textContent        = t('btn_scan');
  document.getElementById('btn-junk').textContent        = t('btn_junk');
  document.getElementById('th-category').textContent     = t('col_category');
  document.getElementById('th-path').textContent         = t('col_path');
  document.getElementById('th-size').textContent         = t('col_size');

  document.getElementById('title-cleaner').textContent   = t('clean_title');
  document.getElementById('hint-cleaner').textContent    = t('clean_hint');
  document.getElementById('btn-clean').textContent       = t('btn_delete');

  const countEl = document.getElementById('clean-count');
  if (countEl.dataset.count === '0') countEl.textContent = t('clean_none');

  // Toggle button state
  document.getElementById('lang-toggle').textContent =
    currentLang === 'en' ? '🌐 ES' : '🌐 EN';
}

window.t = t;
window.setLang = setLang;
window.applyLang = applyLang;
