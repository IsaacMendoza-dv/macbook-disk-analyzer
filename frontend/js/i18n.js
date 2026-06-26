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
  const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
  const setH = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  const setQ = (sel, text) => { const el = document.querySelector(sel); if (el) el.textContent = text; };

  // Nav
  setQ('[data-view="welcome"]',   t('nav_home'));
  setQ('[data-view="dashboard"]', t('nav_dashboard'));
  setQ('[data-view="filetree"]',  t('nav_filetree'));
  setQ('[data-view="scanner"]',   t('nav_scanner'));
  setQ('[data-view="cleaner"]',   t('nav_cleaner'));

  // Agent status
  const statusEl = document.getElementById('agent-status');
  if (statusEl) {
    const connected = statusEl.classList.contains('connected');
    statusEl.querySelector('.label').textContent = connected ? t('agent_on') : t('agent_off');
  }

  // Install instructions (only if visible)
  const box = document.getElementById('agent-install');
  if (box) {
    const titleEl = box.querySelector('.install-title');
    if (titleEl) titleEl.textContent = t('install_title');
    box.querySelectorAll('.install-step').forEach((el, i) => {
      el.innerHTML = t('install_steps')[i] || '';
    });
    const noteEl = box.querySelector('.install-note');
    if (noteEl) noteEl.textContent = t('install_note');
  }

  // Dashboard
  set('title-dashboard', t('dash_title'));
  set('title-dirs',      t('dash_dirs'));
  set('label-total',     t('label_total'));
  set('label-used',      t('label_used'));
  set('label-free',      t('label_free'));

  // File tree
  set('title-filetree', t('tree_title'));
  set('hint-filetree',  t('tree_hint'));

  // Scanner
  set('title-scanner', t('scan_title'));
  set('hint-scanner',  t('scan_hint'));
  set('btn-scan',      t('btn_scan'));
  set('btn-junk',      t('btn_junk'));
  set('th-category',   t('col_category'));
  set('th-path',       t('col_path'));
  set('th-size',       t('col_size'));

  // Cleaner
  set('title-cleaner', t('clean_title'));
  set('hint-cleaner',  t('clean_hint'));
  set('btn-clean',     t('btn_delete'));

  const countEl = document.getElementById('clean-count');
  if (countEl && countEl.dataset.count === '0') countEl.textContent = t('clean_none');

  // Retry button (if present)
  const retryBtn = document.getElementById('btn-retry');
  if (retryBtn) retryBtn.textContent = t('btn_retry');

  // Toggle button label
  set('lang-toggle', currentLang === 'en' ? '🌐 ES' : '🌐 EN');
}

window.t = t;
window.setLang = setLang;
window.applyLang = applyLang;
Object.defineProperty(window, 'currentLang', { get: () => currentLang });
