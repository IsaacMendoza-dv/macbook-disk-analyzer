const { spawn } = require('child_process');
const readline  = require('readline');
const os        = require('os');
const path      = require('path');

const EXCLUDE = ['macbook-disk-analyzer', '.Trash'];

module.exports = (targetPath, onEntry) => new Promise((resolve) => {
  const root = targetPath || os.homedir();

  // -k: 1024-byte blocks  -d 2: max depth 2
  // NOTE: do NOT combine -s with -d — they are mutually exclusive on macOS
  const du = spawn('du', ['-k', '-d', '2', root], {
    stdio: ['ignore', 'pipe', 'ignore']
  });

  const rl = readline.createInterface({ input: du.stdout });

  rl.on('line', (line) => {
    const tabIdx = line.indexOf('\t');
    if (tabIdx === -1) return;
    const size = parseInt(line.slice(0, tabIdx)) * 1024;
    const p    = line.slice(tabIdx + 1).trim();

    if (!p || p === root || isNaN(size)) return;
    if (EXCLUDE.some(ex => path.basename(p) === ex)) return;

    onEntry({ path: p, size });
  });

  du.on('close', resolve);
  setTimeout(resolve, 45000);
});
