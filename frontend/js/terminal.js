// terminal.js — append log lines to the bottom panel
const logPanel = document.getElementById('log-panel');

function termLog(message, type = '') {
  const line = document.createElement('div');
  line.className = `log-line ${type}`;
  line.textContent = `> ${message}`;
  logPanel.appendChild(line);
  logPanel.scrollTop = logPanel.scrollHeight;
}

window.termLog = termLog;
