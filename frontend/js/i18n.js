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
    guide_how_body:    'This app has two parts that must run at the same time on your Mac: an <strong>agent</strong> (reads your disk) and a <strong>frontend</strong> (the interface you see). Both run locally — nothing is sent to the internet. You always open the app at <strong>http://localhost:3000</strong>, not the Vercel URL (Vercel is blocked by the browser for local connections).',
    guide_setup_title: 'First-time setup — do this once',
    guide_steps: [
      {
        n:'1',
        title:'Install Node.js (if you don\'t have it)',
        desc:'Node.js is required to run the agent. Download the <strong>LTS</strong> version from <a href="https://nodejs.org" target="_blank">nodejs.org</a>, open the .pkg file and follow the installer.<br><br>To verify it worked, open Terminal and run: <code>node -v</code> — you should see a version number.'
      },
      {
        n:'2',
        title:'Open Terminal',
        desc:'Press <strong>⌘ Space</strong>, type <strong>Terminal</strong> and press Enter. This opens the macOS terminal — you\'ll use it to run the commands below.'
      },
      {
        n:'3',
        title:'Clone the project',
        desc:'In Terminal, run this command to download the project to your Mac:<br><code>git clone https://github.com/IsaacMendoza-dv/macbook-disk-analyzer.git</code><br><br>This creates a folder called <strong>macbook-disk-analyzer</strong> in your current directory (usually your home folder).<br><br>⚠️ Make sure you are in your home directory before running this:<br><code>cd ~</code>'
      },
      {
        n:'4',
        title:'Start the agent — Terminal tab 1',
        desc:'In Terminal, run these commands one by one:<br><code>cd ~/macbook-disk-analyzer/agent</code><br><code>npm install</code><br><code>node server.js</code><br><br>You should see: <strong>macdisk-agent running on ws://127.0.0.1:3001</strong><br>Leave this tab open — closing it stops the agent.'
      },
      {
        n:'5',
        title:'Start the frontend — Terminal tab 2',
        desc:'Open a new Terminal tab with <strong>⌘ T</strong>, then run:<br><code>cd ~/macbook-disk-analyzer/frontend</code><br><code>npx serve .</code><br><br>When asked to install <code>serve</code>, press <strong>Y</strong> and Enter.<br>Then open <a href="http://localhost:3000" target="_blank"><strong>http://localhost:3000</strong></a> in your browser.<br><br>The indicator at the top of this page will turn <strong style="color:var(--accent)">green</strong> when the agent connects.'
      },
    ],
    guide_daily_title: 'Daily use (after first setup)',
    guide_daily: 'You only need to run steps 4 and 5 every time you use the app. If port 3001 is already in use, run <code>kill $(lsof -ti:3001)</code> before starting the agent.',
    guide_sections_title: 'What each section does',
    guide_sections: [
      { name:'Dashboard', desc:'Total, used and free disk space. Updates automatically when the agent connects.' },
      { name:'File Tree',  desc:'Your entire home folder sorted by size. Click any folder to expand it and see what\'s inside. Items over 100 MB appear in yellow, over 1 GB in red.' },
      { name:'Scanner',    desc:'Click SCAN DISK first, then DETECT JUNK. Finds: app caches, system logs, Xcode DerivedData, iOS simulators, orphan node_modules and .DS_Store files.' },
      { name:'Cleaner',    desc:'After scanning, select the items you want to delete using the checkboxes. Press DELETE SELECTED — you will always see a confirmation dialog before anything is removed.' },
    ],
    guide_safe_title: 'Is it safe?',
    guide_safe_body:  'The agent only listens on 127.0.0.1 — it is never reachable from the internet. System folders (/System, /usr, /bin, /sbin, /etc) are permanently blocked from deletion. Nothing is deleted without your explicit confirmation in the dialog.',
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
    guide_how_body:    'Esta app tiene dos partes que deben correr al mismo tiempo en tu Mac: un <strong>agente</strong> (lee tu disco) y un <strong>frontend</strong> (la interfaz que ves). Ambos corren localmente — nada se envía a internet. Siempre abre la app en <strong>http://localhost:3000</strong>, no en la URL de Vercel (el browser bloquea las conexiones locales desde Vercel).',
    guide_setup_title: 'Configuración inicial — hazlo una sola vez',
    guide_steps: [
      {
        n:'1',
        title:'Instala Node.js (si no lo tienes)',
        desc:'Node.js es necesario para correr el agente. Descarga la versión <strong>LTS</strong> desde <a href="https://nodejs.org" target="_blank">nodejs.org</a>, abre el archivo .pkg y sigue el instalador.<br><br>Para verificar que funcionó, abre Terminal y ejecuta: <code>node -v</code> — deberías ver un número de versión.'
      },
      {
        n:'2',
        title:'Abre Terminal',
        desc:'Presiona <strong>⌘ Espacio</strong>, escribe <strong>Terminal</strong> y presiona Enter. Aquí ejecutarás los comandos de los siguientes pasos.'
      },
      {
        n:'3',
        title:'Clona el proyecto',
        desc:'En Terminal, ejecuta este comando para descargar el proyecto a tu Mac:<br><code>git clone https://github.com/IsaacMendoza-dv/macbook-disk-analyzer.git</code><br><br>Esto crea una carpeta llamada <strong>macbook-disk-analyzer</strong> en tu directorio actual.<br><br>⚠️ Asegúrate de estar en tu carpeta home antes de ejecutar esto:<br><code>cd ~</code>'
      },
      {
        n:'4',
        title:'Inicia el agente — pestaña 1 de Terminal',
        desc:'En Terminal, ejecuta estos comandos uno por uno:<br><code>cd ~/macbook-disk-analyzer/agent</code><br><code>npm install</code><br><code>node server.js</code><br><br>Deberías ver: <strong>macdisk-agent running on ws://127.0.0.1:3001</strong><br>Deja esta pestaña abierta — cerrarla detiene el agente.'
      },
      {
        n:'5',
        title:'Inicia el frontend — pestaña 2 de Terminal',
        desc:'Abre una nueva pestaña con <strong>⌘ T</strong>, luego ejecuta:<br><code>cd ~/macbook-disk-analyzer/frontend</code><br><code>npx serve .</code><br><br>Si te pide instalar <code>serve</code>, presiona <strong>Y</strong> y Enter.<br>Luego abre <a href="http://localhost:3000" target="_blank"><strong>http://localhost:3000</strong></a> en tu browser.<br><br>El indicador de arriba se pondrá <strong style="color:var(--accent)">verde</strong> cuando el agente conecte.'
      },
    ],
    guide_daily_title: 'Uso diario (después del setup)',
    guide_daily: 'Solo necesitas ejecutar los pasos 4 y 5 cada vez que uses la app. Si el puerto 3001 ya está en uso, ejecuta <code>kill $(lsof -ti:3001)</code> antes de iniciar el agente.',
    guide_sections_title: 'Qué hace cada sección',
    guide_sections: [
      { name:'Resumen',  desc:'Espacio total, usado y libre. Se actualiza automáticamente cuando el agente conecta.' },
      { name:'Árbol',    desc:'Tu carpeta home completa ordenada por tamaño. Haz clic en cualquier carpeta para expandirla. Elementos mayores a 100 MB en amarillo, mayores a 1 GB en rojo.' },
      { name:'Escáner',  desc:'Primero haz clic en ESCANEAR DISCO, luego en DETECTAR BASURA. Encuentra: cachés de apps, logs del sistema, Xcode DerivedData, simuladores iOS, node_modules huérfanos y archivos .DS_Store.' },
      { name:'Limpieza', desc:'Después de escanear, selecciona los elementos a eliminar con los checkboxes. Presiona ELIMINAR SELECCIONADOS — siempre verás un diálogo de confirmación antes de que se borre algo.' },
    ],
    guide_safe_title: '¿Es seguro?',
    guide_safe_body:  'El agente solo escucha en 127.0.0.1 — nunca es accesible desde internet. Las carpetas del sistema (/System, /usr, /bin, /sbin, /etc) están bloqueadas permanentemente. Nada se elimina sin tu confirmación explícita en el diálogo.',
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
  const set  = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const setH = (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML  = v; };

  set('guide-how-title',      t('guide_how_title'));
  setH('guide-how-body',      t('guide_how_body'));
  set('guide-setup-title',    t('guide_setup_title'));
  set('guide-daily-title',    t('guide_daily_title'));
  setH('guide-daily',         t('guide_daily'));
  set('guide-sections-title', t('guide_sections_title'));
  set('guide-safe-title',     t('guide_safe_title'));
  set('guide-safe-body',      t('guide_safe_body'));

  const stepsEl = document.getElementById('guide-steps');
  if (stepsEl) {
    stepsEl.innerHTML = t('guide_steps').map((s, i) => `
      <div class="guide-step ${i === 3 ? 'highlight' : ''}">
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
