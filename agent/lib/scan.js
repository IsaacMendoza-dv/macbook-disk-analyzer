const { execFile } = require('child_process');
const os   = require('os');
const path = require('path');
const fs   = require('fs');

const EXCLUDE = new Set(['macbook-disk-analyzer', '.Trash', 'node_modules']);

const duSize = (p) => new Promise((res) => {
  execFile('du', ['-sk', p], { stdio: ['ignore', 'pipe', 'ignore'] }, (err, stdout) => {
    if (err) return res(0);
    const kb = parseInt(stdout.split('\t')[0]);
    res(isNaN(kb) ? 0 : kb * 1024);
  });
});

function collectDirs(root) {
  const dirs = [];
  let level1;
  try { level1 = fs.readdirSync(root); } catch { return dirs; }
  for (const name of level1) {
    if (EXCLUDE.has(name) || name.startsWith('.')) continue;
    const full = path.join(root, name);
    dirs.push(full);
    try {
      const level2 = fs.readdirSync(full);
      for (const sub of level2) {
        if (EXCLUDE.has(sub) || sub.startsWith('.')) continue;
        const subFull = path.join(full, sub);
        try { if (fs.statSync(subFull).isDirectory()) dirs.push(subFull); } catch {}
      }
    } catch {}
  }
  return dirs;
}

function asciiBar(done, total, width = 20) {
  const filled = Math.round((done / total) * width);
  return '[' + '█'.repeat(filled) + '░'.repeat(width - filled) + `] ${done}/${total}`;
}

module.exports = async (targetPath, onEntry, onProgress) => {
  const root = targetPath || os.homedir();
  const dirs = collectDirs(root);
  const total = dirs.length;

  for (let i = 0; i < dirs.length; i++) {
    const p = dirs[i];
    const size = await duSize(p);
    if (size > 0) onEntry({ path: p, size });
    if (onProgress) onProgress({ message: `Scanning ${asciiBar(i + 1, total)} ${path.basename(p)}` });
  }
};
