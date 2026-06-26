// terminal.js — log panel with in-place update for progress lines
const logPanel = document.getElementById('log-panel');
let progressLine = null;

function termLog(message, type = '') {
  // If message looks like a progress bar, update in place
  if (message.includes('[') && message.includes(']') && message.includes('/')) {
    if (!progressLine) {
      progressLine = document.createElement('div');
      progressLine.className = 'log-line';
      logPanel.appendChild(progressLine);
    }
    progressLine.textContent = `> ${message}`;
    progressLine.style.color = 'var(--accent)';
    logPanel.scrollTop = logPanel.scrollHeight;
    return;
  }

  // Reset progress line tracker on non-progress messages
  progressLine = null;

  const line = document.createElement('div');
  line.className = `log-line ${type}`;
  line.textContent = `> ${message}`;
  logPanel.appendChild(line);
  logPanel.scrollTop = logPanel.scrollHeight;
}

window.termLog = termLog;
