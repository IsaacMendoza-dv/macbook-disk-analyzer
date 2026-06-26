const { execFile, spawn } = require('child_process');
const readline = require('readline');
const os   = require('os');
const path = require('path');
const fs   = require('fs');

const EXCLUDE = new Set(['macbook-disk-analyzer', '.Trash', 'node_modules']);

// Get size of a single path with du -sk
const duSize = (p) => new Promise((res) => {
  execFile('du', ['-sk', p], { stdio: ['ignore', 'pipe', 'ignore'] }, (err, stdout) => {
    if (err) return res(0);
    const kb = parseInt(stdout.split('\t')[0]);
    res(isNaN(kb) ? 0 : kb * 1024);
  });
});

module.exports = async (targetPath, onEntry) => {
  const root = targetPath || os.homedir();

  // Level 1: read home dir entries
  let entries;
  try { entries = fs.readdirSync(root); } catch { return; }

  for (const name of entries) {
    if (EXCLUDE.has(name) || name.startsWith('.')) continue;
    const full = path.join(root, name);
    const size = await duSize(full);
    if (size > 0) onEntry({ path: full, size });

    // Level 2: subdirectories
    try {
      const subs = fs.readdirSync(full);
      for (const sub of subs) {
        if (EXCLUDE.has(sub) || sub.startsWith('.')) continue;
        const subFull = path.join(full, sub);
        try {
          if (fs.statSync(subFull).isDirectory()) {
            const subSize = await duSize(subFull);
            if (subSize > 0) onEntry({ path: subFull, size: subSize });
          }
        } catch {}
      }
    } catch {}
  }
};
