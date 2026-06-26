// dashboard.js — render disk stats and ASCII bars

// fmtBytes — uses decimal GB (1 GB = 1,000,000,000) to match macOS Storage display
function fmtBytes(b) {
  if (b >= 1e12) return (b / 1e12).toFixed(1) + ' TB';
  if (b >= 1e9)  return (b / 1e9).toFixed(1)  + ' GB';
  if (b >= 1e6)  return (b / 1e6).toFixed(1)  + ' MB';
  return (b / 1e3).toFixed(0) + ' KB';
}

function asciiBar(percent, width = 24) {
  const filled = Math.round((percent / 100) * width);
  return '[' +
    '<span class="filled">' + '█'.repeat(filled) + '</span>' +
    '<span class="empty">'  + '░'.repeat(width - filled) + '</span>' +
    ']';
}

function renderStats(stats) {
  document.getElementById('d-total').textContent = fmtBytes(stats.total);
  document.getElementById('d-used').textContent  = fmtBytes(stats.used);
  document.getElementById('d-free').textContent  = fmtBytes(stats.free);

  const barEl = document.getElementById('d-bar');
  barEl.innerHTML = `
    <div class="bar-row">
      <span>disk usage</span>
      <span class="bar-track">${asciiBar(stats.percent)}</span>
      <span class="bar-pct">${stats.percent}%</span>
      <span class="bar-size">${fmtBytes(stats.used)} / ${fmtBytes(stats.total)}</span>
    </div>`;
}

function renderDirs(entries) {
  // entries: [{ path, size }] sorted desc
  const max = entries[0]?.size || 1;
  const container = document.getElementById('d-dirs');
  container.innerHTML = entries.slice(0, 15).map(e => `
    <div class="bar-row">
      <span class="muted" title="${e.path}">${e.path.split('/').pop() || e.path}</span>
      <span class="bar-track">${asciiBar(Math.round((e.size / max) * 100))}</span>
      <span class="bar-pct"></span>
      <span class="bar-size">${fmtBytes(e.size)}</span>
    </div>`).join('');
}

window.renderStats = renderStats;
window.renderDirs  = renderDirs;
window.fmtBytes    = fmtBytes;
