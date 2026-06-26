const { spawn } = require('child_process');
const readline  = require('readline');
const os        = require('os');
const path      = require('path');

const EXCLUDE = ['macbook-disk-analyzer', 'node_modules', '.Trash'];

module.exports = (targetPath, onEntry) => new Promise((resolve) => {
  const root = targetPath || os.homedir();

  const du = spawn('du', ['-sk', '-d', '2', root], {
    stdio: ['ignore', 'pipe', 'ignore']
  });

  const rl = readline.createInterface({ input: du.stdout });

  rl.on('line', (line) => {
    const tabIdx = line.indexOf('\t');
    if (tabIdx === -1) return;
    const sizeStr = line.slice(0, tabIdx);
    const p       = line.slice(tabIdx + 1).trim();
    const size    = parseInt(sizeStr) * 1024;

    if (!p || p === root || isNaN(size)) return;

    // Skip the app itself and node_modules to avoid noise
    const base = path.basename(p);
    if (EXCLUDE.some(ex => base === ex)) return;

    onEntry({ path: p, size });
  });

  du.on('close', resolve);
  setTimeout(resolve, 45000);
});
