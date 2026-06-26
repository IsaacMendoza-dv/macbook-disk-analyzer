// main.js — init, WebSocket connection, view router

const WS_URL = 'ws://127.0.0.1:3001';
const RECONNECT_MS = 3000;

let ws = null;
let scanEntries = [];

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
    setStatus(true);
    termLog(t('log_connected'), 'ok');
    ws.send(JSON.stringify({ type: 'stats' }));
  };

  ws.onclose = () => {
    setStatus(false);
    termLog(t('log_retrying'), 'err');
    setTimeout(connect, RECONNECT_MS);
  };

  ws.onerror = () => {
    document.getElementById('agent-install').style.display = 'block';
  };

  ws.onmessage = ({ data }) => {
    const { type, data: d } = JSON.parse(data);
    switch (type) {
      case 'stats':    renderStats(d); break;
      case 'progress': scanEntries.push(d); break;
      case 'junk':     renderJunk(d); break;
      case 'log':      termLog(d.message); break;
      case 'done':
        if (scanEntries.length) {
          const sorted = [...scanEntries].sort((a, b) => b.size - a.size);
          renderTree(scanEntries);
          renderDirs(sorted);
          scanEntries = [];
        }
        break;
    }
  };
}

function setStatus(connected) {
  const el = document.getElementById('agent-status');
  el.className = connected ? 'connected' : 'disconnected';
  el.querySelector('.label').textContent = connected ? t('agent_on') : t('agent_off');
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
connect();
