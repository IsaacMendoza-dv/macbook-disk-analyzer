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
    banner_on:    '● Agent connected — you can now use all sections',
    banner_off:   '● Agent not running — follow the steps below to get started',
    banner_status_on:  'Agent connected',
    banner_status_off: 'Agent not running',
    banner_desc_on:    'All sections are available. The agent is reading your Mac\'s disk.',
    banner_desc_off:   'Open this page from http://localhost:3000 (not the Vercel URL) and start the agent. Follow the steps below.',
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

    // Onboarding guide
    guide_how_title:   'How it works',
    guide_how_body:    'This app runs entirely on your Mac — no data leaves your machine. It requires two things running locally: the frontend (served at http://localhost:3000) and the agent (reads your disk). The Vercel URL is only for reference; always use http://localhost:3000.',
    guide_setup_title: 'First-time setup',
    guide_steps: [
      { n:'1', title:'Install Node.js',      desc:'Required to run the local agent. Download the LTS version from <a href="https://nodejs.org" target="_blank">nodejs.org</a> and install it.' },
      { n:'2', title:'Download the project', desc:'Open Terminal (⌘ Space → "Terminal") and run:<br><code>git clone https://github.com/IsaacMendoza-dv/macbook-disk-analyzer.git</code>' },
      { n:'3', title:'Start the agent',      desc:'In Terminal, run:<br><code>cd macbook-disk-analyzer/agent</code><br><code>npm install</code><br><code>node server.js</code>' },
      { n:'4', title:'Open the app locally', desc:'Because browsers block <code>ws://</code> connections from <code>https://</code> pages, you must open the app from your local machine. In a new Terminal tab run:<br><code>cd macbook-disk-analyzer/frontend</code><br><code>npx serve .</code><br>Then open <a href="http://localhost:3000" target="_blank">http://localhost:3000</a> — <strong>not</strong> the Vercel URL.' },
      { n:'5', title:'Keep both tabs open',  desc:'Terminal tab 1: agent running. Terminal tab 2: frontend server running. The indicator above will turn green when connected.' },
    ],
    guide_sections_title: 'What each section does',
    guide_sections: [
      { name:'Dashboard', desc:'Total, used and free disk space at a glance.' },
      { name:'File Tree',  desc:'Your home folder sorted by size. Click any folder to see what\'s inside.' },
      { name:'Scanner',    desc:'Finds junk automatically: app caches, logs, Xcode files, orphan node_modules.' },
      { name:'Cleaner',    desc:'Select what to delete from the scanner results. Always asks for confirmation.' },
    ],
    guide_safe_title: 'Is it safe?',
    guide_safe_body:  'The agent only listens on 127.0.0.1 — it is never reachable from the internet. System folders (/System, /usr, /bin) are permanently blocked from deletion. Nothing is deleted without your explicit confirmation.',
  },

  es: {
    nav_home:     '~ inicio',
    nav_dashboard:'resumen',
    nav_filetree: 'árbol',
    nav_scanner:  'escáner',
    nav_cleaner:  'limpieza',
    agent_on:     'agente conectado',
    agent_off:    'agente desconectado',
    banner_on:    '● Agente conectado — ya puedes usar todas las secciones',
    banner_off:   '● Agente no iniciado — sigue los pasos de abajo para comenzar',
    banner_status_on:  'Agente conectado',
    banner_status_off: 'Agente no iniciado',
    banner_desc_on:    'Todas las secciones están disponibles. El agente está leyendo el disco de tu Mac.',
    banner_desc_off:   'Abre esta página desde http://localhost:3000 (no la URL de Vercel) e inicia el agente. Sigue los pasos de abajo.',
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

    // Onboarding guide
    guide_how_title:   'Cómo funciona',
    guide_how_body:    'Esta app corre completamente en tu Mac — ningún dato sale de tu máquina. Requiere dos cosas corriendo localmente: el frontend (en http://localhost:3000) y el agente (lee tu disco). La URL de Vercel es solo de referencia; siempre usa http://localhost:3000.',
    guide_setup_title: 'Configuración inicial',
    guide_steps: [
      { n:'1', title:'Instala Node.js',             desc:'Necesario para correr el agente. Descarga la versión LTS en <a href="https://nodejs.org" target="_blank">nodejs.org</a> e instálala.' },
      { n:'2', title:'Descarga el proyecto',          desc:'Abre Terminal (⌘ Espacio → "Terminal") y ejecuta:<br><code>git clone https://github.com/IsaacMendoza-dv/macbook-disk-analyzer.git</code>' },
      { n:'3', title:'Inicia el agente',              desc:'En Terminal, ejecuta:<br><code>cd macbook-disk-analyzer/agent</code><br><code>npm install</code><br><code>node server.js</code>' },
      { n:'4', title:'Abre la app localmente',        desc:'Los browsers bloquean conexiones <code>ws://</code> desde páginas <code>https://</code>, por eso debes abrir la app desde tu máquina. En una nueva pestaña de Terminal ejecuta:<br><code>cd macbook-disk-analyzer/frontend</code><br><code>npx serve .</code><br>Luego abre <a href="http://localhost:3000" target="_blank">http://localhost:3000</a> — <strong>no</strong> la URL de Vercel.' },
      { n:'5', title:'Deja ambas pestañas abiertas', desc:'Pestaña 1 de Terminal: agente corriendo. Pestaña 2: servidor del frontend. El indicador de arriba se pondrá verde cuando esté conectado.' },
    ],
    guide_sections_title: 'Qué hace cada sección',
    guide_sections: [
      { name:'Resumen',  desc:'Espacio total, usado y libre de un vistazo.' },
      { name:'Árbol',    desc:'Tu carpeta home ordenada por tamaño. Haz clic en cualquier carpeta para ver qué hay adentro.' },
      { name:'Escáner',  desc:'Encuentra basura automáticamente: cachés de apps, logs, archivos de Xcode, node_modules huérfanos.' },
      { name:'Limpieza', desc:'Selecciona qué eliminar de los resultados del escáner. Siempre pide confirmación.' },
    ],
    guide_safe_title: '¿Es seguro?',
    guide_safe_body:  'El agente solo escucha en 127.0.0.1 — nunca es accesible desde internet. Las carpetas del sistema (/System, /usr, /bin) están bloqueadas permanentemente. Nada se elimina sin tu confirmación explícita.',
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

  renderGuide();
}

function renderGuide() {
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

  set('guide-how-title',      t('guide_how_title'));
  set('guide-how-body',       t('guide_how_body'));
  set('guide-setup-title',    t('guide_setup_title'));
  set('guide-sections-title', t('guide_sections_title'));
  set('guide-safe-title',     t('guide_safe_title'));
  set('guide-safe-body',      t('guide_safe_body'));

  const stepsEl = document.getElementById('guide-steps');
  if (stepsEl) {
    stepsEl.innerHTML = t('guide_steps').map((s, i) => `
      <div class="guide-step ${i === 2 ? 'highlight' : ''}">
        <span class="step-num">${s.n}</span>
        <div>
          <div class="step-title">${s.title}</div>
          <div class="step-desc">${s.desc}</div>
        </div>
      </div>`).join('');
  }

  const sectionsEl = document.getElementById('guide-sections');
  if (sectionsEl) {
    sectionsEl.innerHTML = t('guide_sections').map(s => `
      <div class="guide-section-row">
        <span class="gs-name">${s.name}</span>
        <span class="gs-desc">${s.desc}</span>
      </div>`).join('');
  }
}

window.t          = t;
window.setLang    = setLang;
window.applyLang  = applyLang;
Object.defineProperty(window, 'currentLang', { get: () => currentLang });
