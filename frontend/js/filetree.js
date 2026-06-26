// filetree.js — build a navigable directory tree from flat scan entries

function buildTree(entries) {
  // entries: [{ path, size }]
  const root = {};
  entries.forEach(({ path, size }) => {
    const parts = path.split('/').filter(Boolean);
    let node = root;
    parts.forEach((part, i) => {
      if (!node[part]) node[part] = { _size: 0, _children: {} };
      if (i === parts.length - 1) node[part]._size = size;
      node = node[part]._children;
    });
  });
  return root;
}

function sizeClass(bytes) {
  if (bytes >= 1e9) return 'danger';
  if (bytes >= 100e6) return 'warn';
  return '';
}

function renderNode(name, node, depth = 0) {
  const hasChildren = Object.keys(node._children).length > 0;
  const icon = hasChildren ? '▶' : '·';
  const id = `tree-${Math.random().toString(36).slice(2)}`;
  let html = `
    <div class="tree-node" data-target="${id}">
      <span class="tree-icon">${icon}</span>
      <span>${name}</span>
      <span class="tree-size ${sizeClass(node._size)}">${fmtBytes(node._size)}</span>
    </div>`;
  if (hasChildren) {
    html += `<div class="tree-children collapsed" id="${id}">`;
    Object.entries(node._children)
      .sort((a, b) => b[1]._size - a[1]._size)
      .forEach(([k, v]) => { html += renderNode(k, v, depth + 1); });
    html += '</div>';
  }
  return html;
}

function renderTree(entries) {
  const tree = buildTree(entries);
  const container = document.getElementById('tree-root');
  container.innerHTML = Object.entries(tree)
    .sort((a, b) => b[1]._size - a[1]._size)
    .map(([k, v]) => renderNode(k, v))
    .join('');

  // Toggle expand/collapse
  container.addEventListener('click', (e) => {
    const node = e.target.closest('.tree-node');
    if (!node) return;
    const targetId = node.dataset.target;
    const children = document.getElementById(targetId);
    if (!children) return;
    children.classList.toggle('collapsed');
    node.querySelector('.tree-icon').textContent =
      children.classList.contains('collapsed') ? '▶' : '▼';
  });
}

window.renderTree = renderTree;
