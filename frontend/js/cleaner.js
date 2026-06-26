// cleaner.js — checkboxes, summary, and delete confirmation

function renderCleanerList(items) {
  const list = document.getElementById('clean-list');
  list.innerHTML = items.map((item, i) => {
    const p = Array.isArray(item.path) ? item.path.join('|') : item.path;
    return `
      <div class="clean-item">
        <input type="checkbox" data-index="${i}" data-path="${p}" data-size="${item.size}">
        <span class="ci-path">${Array.isArray(item.path) ? `${item.path.length} files (${item.category})` : item.path}</span>
        <span class="ci-size">${fmtBytes(item.size)}</span>
        <span class="ci-cat">${item.category}</span>
      </div>`;
  }).join('');

  list.addEventListener('change', updateSummary);
}

function updateSummary() {
  const checked = [...document.querySelectorAll('#clean-list input:checked')];
  const total = checked.reduce((s, el) => s + Number(el.dataset.size), 0);
  document.getElementById('clean-count').textContent = `${checked.length} items selected`;
  document.getElementById('clean-freed').textContent = checked.length ? `~${fmtBytes(total)} to free` : '';
}

document.getElementById('btn-clean').addEventListener('click', () => {
  const checked = [...document.querySelectorAll('#clean-list input:checked')];
  if (!checked.length) return;

  const paths = checked.flatMap(el => el.dataset.path.split('|').filter(Boolean));
  const total = checked.reduce((s, el) => s + Number(el.dataset.size), 0);

  if (!confirm(`Delete ${checked.length} item(s)?\n~${fmtBytes(total)} will be freed.\n\nThis cannot be undone.`)) return;

  window.wsSend({ type: 'clean', paths });
  termLog(`Cleaning ${checked.length} item(s)...`, 'ok');
});

window.renderCleanerList = renderCleanerList;
