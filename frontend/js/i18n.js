// i18n.js — UI strings EN / ES

const LANG = {
  en: {
    nav_home:     '~ home',
    nav_dashboard:'dashboard',
    nav_filetree: 'file tree',
    nav_scanner:  'scanner',
    nav_cleaner:  'cleaner',
    agent_on:     'agent connected',
    agent_off:    'agent disconnected',
    prompt_msgs:  ['scan', 'detect junk', 'free space'],
    install_title:'Agent not detected. Follow these steps:',
    install_steps:[
      '1. Install Node.js 18+ → <a href="https://nodejs.org" target="_blank">nodejs.org</a>',
      '2. Open <strong>Terminal</strong> on your Mac',
      '3. Go to the agent folder and run:',
    ],
    install_note: '4. Keep that Terminal window open, then refresh this page.',
    dash_title:   'Disk Overview',
    dash_dirs:    'Top Directories',
    label_total:  'total',
    label_used:   'used',
    label_free:   'free',
    tree_title:   'File Tree',
    tree_hint:    'Click a folder to expand / collapse. Yellow = > 100 MB · Red = > 1 GB.',
    scan_title:   'Junk Scanner',
    btn_scan:     '[ SCAN DISK ]',
    btn_junk:     '[ DETECT JUNK ]',
    scan_hint:    'SCAN DISK maps your home folder. DETECT JUNK finds caches, logs and waste.',
    col_category: 'category',
    col_path:     'path',
    col_size:     'size',
    no_junk:      'No junk detected.',
    clean_title:  'Cleaner',
    clean_hint:   'Select items and press DELETE. You will confirm before anything is removed.',
    btn_delete:   '[ DELETE SELECTED ]',
    clean_none:   '0 items selected',
    confirm_msg:  (n, size) => `Delete ${n} item(s)?\n~${size} will be freed.\n\nThis cannot be undone.`,
    log_connected:    'Agent connected.',
    log_retrying:     'Agent disconnected. Retrying...',
    log_scanning:     'Scanning home directory...',
    log_junk:         'Detecting junk...',
    log_cleaning:     (n) => `Cleaning ${n} item(s)...`,
    log_agent_stopped:'Agent not found. Start it on your Mac and click Retry.',
    btn_retry:        '[ RETRY CONNECTION ]',
  },

  es: {
    nav_home:     '~ inicio',
    nav_dashboard:'resumen',
    nav_filetree: 'árbol',
    nav_scanner:  'escáner',
    nav_cleaner:  'limpieza',
    agent_on:     'agente conectado',
    agent_off:    'agente desconectado',
    prompt_msgs:  ['escanear', 'detectar basura', 'liberar espacio'],
    install_title:'Agente no detectado. Sigue estos pasos:',
    install_steps:[
      '1. Instala Node.js 18+ → <a href="https://nodejs.org" target="_blank">nodejs.org</a>',
      '2. Abre <strong>Terminal</strong> en tu Mac',
      '3. Ve a la carpeta del agente y ejecuta:',
    ],
    install_note: '4. Deja esa ventana de Terminal abierta y recarga esta página.',
    dash_title:   'Resumen del Disco',
    dash_dirs:    'Directorios Más Pesados',
    label_total:  'total',
    label_used:   'usado',
    label_free:   'libre',
    tree_title:   'Árbol de Archivos',
    tree_hint:    'Haz clic en una carpeta para expandir / contraer. Amarillo = > 100 MB · Rojo = > 1 GB.',
    scan_title:   'Escáner de Basura',
    btn_scan:     '[ ESCANEAR DISCO ]',
    btn_junk:     '[ DETECTAR BASURA ]',
    scan_hint:    'ESCANEAR DISCO mapea tu carpeta home. DETECTAR BASURA encuentra cachés, logs y desperdicios.',
    col_category: 'categoría',
    col_path:     'ruta',
    col_size:     'tamaño',
    no_junk:      'No se detectó basura.',
    clean_title:  'Limpieza',
    clean_hint:   'Selecciona elementos y presiona ELIMINAR. Se pedirá confirmación antes de borrar.',
    btn_delete:   '[ ELIMINAR SELECCIONADOS ]',
    clean_none:   '0 elementos seleccionados',
    confirm_msg:  (n, size) => `¿Eliminar ${n} elemento(s)?\n~${size} serán liberados.\n\nEsta acción no se puede deshacer.`,
    log_connected:    'Agente conectado.',
    log_retrying:     'Agente desconectado. Reintentando...',
    log_scanning:     'Escaneando directorio home...',
    log_junk:         'Detectando basura...',
    log_cleaning:     (n) => `Eliminando ${n} elemento(s)...`,
    log_agent_stopped:'Agente no encontrado. Inícialo en tu Mac y presiona Reintentar.',
    btn_retry:        '[ REINTENTAR CONEXIÓN ]',
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
  const set  = (id,  v) => { const el = document.getElementById(id);    if (el) el.textContent = v; };
  const setQ = (sel, v) => { const el = document.querySelector(sel);    if (el) el.textContent = v; };

  setQ('[data-view="welcome"]',   t('nav_home'));
  setQ('[data-view="dashboard"]', t('nav_dashboard'));
  setQ('[data-view="filetree"]',  t('nav_filetree'));
  setQ('[data-view="scanner"]',   t('nav_scanner'));
  setQ('[data-view="cleaner"]',   t('nav_cleaner'));

  const statusEl = document.getElementById('agent-status');
  if (statusEl) {
    statusEl.querySelector('.label').textContent =
      statusEl.classList.contains('connected') ? t('agent_on') : t('agent_off');
  }

  const box = document.getElementById('agent-install');
  if (box) {
    const ti = box.querySelector('.install-title'); if (ti) ti.textContent = t('install_title');
    box.querySelectorAll('.install-step').forEach((el, i) => { el.innerHTML = t('install_steps')[i] || ''; });
    const ni = box.querySelector('.install-note');  if (ni) ni.textContent = t('install_note');
  }

  set('title-dashboard', t('dash_title'));
  set('title-dirs',      t('dash_dirs'));
  set('label-total',     t('label_total'));
  set('label-used',      t('label_used'));
  set('label-free',      t('label_free'));
  set('title-filetree',  t('tree_title'));
  set('hint-filetree',   t('tree_hint'));
  set('title-scanner',   t('scan_title'));
  set('hint-scanner',    t('scan_hint'));
  set('btn-scan',        t('btn_scan'));
  set('btn-junk',        t('btn_junk'));
  set('th-category',     t('col_category'));
  set('th-path',         t('col_path'));
  set('th-size',         t('col_size'));
  set('title-cleaner',   t('clean_title'));
  set('hint-cleaner',    t('clean_hint'));
  set('btn-clean',       t('btn_delete'));

  const countEl = document.getElementById('clean-count');
  if (countEl && countEl.dataset.count === '0') countEl.textContent = t('clean_none');

  const retryBtn = document.getElementById('btn-retry');
  if (retryBtn) retryBtn.textContent = t('btn_retry');

  set('lang-toggle', currentLang === 'en' ? '🌐 ES' : '🌐 EN');
}

window.t          = t;
window.setLang    = setLang;
window.applyLang  = applyLang;
Object.defineProperty(window, 'currentLang', { get: () => currentLang });
