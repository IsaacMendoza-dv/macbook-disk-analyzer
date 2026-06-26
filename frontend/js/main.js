// main.js — init, WebSocket, view router

const WS_URL       = 'ws://127.0.0.1:3001';
const RECONNECT_MS = 4000;
const MAX_RETRIES  = 3;

let ws = null;
let scanEntries = [];
let retries = 0;

// ── Lang toggle ───────────────────────────────────────────
document.getElementById('lang-toggle').addEventListener('click', () => {
  setLang(currentLang === 'en' ? 'es' : 'en');
});

// ── View router ───────────────────────────────────────────
document.querySelectorAll('#nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('#nav a').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    link.classList.add('active');
    document.getElementById(`view-${link.dataset.view}`).classList.add('active');
  });
});

// ── Prompt typing animation ───────────────────────────────
let mi = 0, ci = 0;
const welcomeText = document.getElementById('welcome-text');
function typePrompt() {
  if (!welcomeText) return;
  const msgs = t('prompt_msgs');
  if (ci < msgs[mi].length) {
    welcomeText.textContent += msgs[mi][ci++];
    setTimeout(typePrompt, 80);
  } else {
    setTimeout(() => {
      welcomeText.textContent = '';
      ci = 0; mi = (mi + 1) % msgs.length;
      typePrompt();
    }, 1800);
  }
}
typePrompt();

// ── WebSocket ─────────────────────────────────────────────
function connect() {
  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    retries = 0;
    setStatus(true);
    hideRetryBtn();
    termLog(t('log_connected'), 'ok');
    ws.send(JSON.stringify({ type: 'stats' }));
  };

  ws.onclose = () => {
    setStatus(false);
    if (retries < MAX_RETRIES) {
      retries++;
      termLog(t('log_retrying'), 'err');
      setTimeout(connect, RECONNECT_MS);
    } else {
      termLog(t('log_agent_stopped'), 'err');
      showRetryBtn();
    }
  };

  ws.onerror = () => { /* handled by onclose */ };

  ws.onmessage = ({ data }) => {
    const { type, data: d } = JSON.parse(data);
    switch (type) {
      case 'stats':
        renderStats(d);
        break;
      case 'progress':
        scanEntries.push(d);
        // Render every 20 entries so the tree updates in real time
        if (scanEntries.length % 20 === 0) {
          renderTree(scanEntries);
          renderDirs([...scanEntries].sort((a, b) => b.size - a.size));
        }
        break;
      case 'junk':
        renderJunk(d);
        break;
      case 'log':
        termLog(d.message);
        break;
      case 'done':
        // Final render with all entries
        if (scanEntries.length) {
          renderTree(scanEntries);
          renderDirs([...scanEntries].sort((a, b) => b.size - a.size));
          termLog(`Scan complete — ${scanEntries.length} entries`, 'ok');
          scanEntries = [];
        }
        break;
    }
  };
}

function setStatus(connected) {
  // Header badge
  const el = document.getElementById('agent-status');
  el.className = connected ? 'connected' : 'disconnected';
  el.querySelector('.label').textContent = connected ? t('agent_on') : t('agent_off');

  // Welcome banner
  const banner = document.getElementById('agent-banner');
  if (!banner) return;
  banner.className = `agent-banner ${connected ? 'connected' : 'disconnected'}`;
  const statusEl = document.getElementById('banner-status');
  const descEl   = document.getElementById('banner-label');
  if (statusEl) statusEl.textContent = connected ? t('banner_status_on')  : t('banner_status_off');
  if (descEl)   descEl.textContent   = connected ? t('banner_desc_on')    : t('banner_desc_off');
}

function showRetryBtn() {
  if (document.getElementById('btn-retry')) return;
  const btn = document.createElement('button');
  btn.id = 'btn-retry';
  btn.style.marginTop = '16px';
  btn.textContent = t('btn_retry');
  btn.addEventListener('click', () => {
    retries = 0;
    hideRetryBtn();
    termLog(t('log_retrying'), 'ok');
    connect();
  });
  document.getElementById('agent-install').appendChild(btn);
}

function hideRetryBtn() {
  document.getElementById('btn-retry')?.remove();
}

window.wsSend = (msg) => ws?.readyState === WebSocket.OPEN && ws.send(JSON.stringify(msg));

// ── Scan / Junk buttons ───────────────────────────────────
document.getElementById('btn-scan').addEventListener('click', () => {
  scanEntries = [];
  window.wsSend({ type: 'scan' });
  termLog(t('log_scanning'), 'ok');
});

document.getElementById('btn-junk').addEventListener('click', () => {
  window.wsSend({ type: 'junk' });
  termLog(t('log_junk'), 'ok');
});

// ── Start ─────────────────────────────────────────────────
applyLang();
setStatus(false);
connect();
