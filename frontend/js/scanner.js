// scanner.js — render junk results in the table, feed cleaner

let junkData = [];

function renderJunk(items) {
  junkData = items;
  const tbody = document.getElementById('junk-tbody');
  if (!items.length) {
    tbody.innerHTML = '<tr><td colspan="3" class="muted">No junk detected.</td></tr>';
    return;
  }
  tbody.innerHTML = items.map(item => {
    const p = Array.isArray(item.path) ? `${item.path.length} files` : item.path;
    return `<tr>
      <td class="td-cat">${item.category}</td>
      <td class="muted" title="${p}">${p}</td>
      <td class="td-size">${fmtBytes(item.size)}</td>
    </tr>`;
  }).join('');

  // Sync to cleaner
  renderCleanerList(items);
}

window.renderJunk = renderJunk;
window.getJunkData = () => junkData;
