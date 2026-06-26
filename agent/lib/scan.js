const { execFile } = require('child_process');
const os = require('os');

// Scan level by level: depth 1 first (fast), then depth 2, then 3
// Each level sends results immediately so the UI updates progressively
module.exports = (targetPath, onEntry) => new Promise((resolve) => {
  const root = targetPath || os.homedir();

  const scanDepth = (depth) => new Promise((res) => {
    execFile('du', ['-sk', '-d', String(depth), root], (err, stdout) => {
      if (err) return res();
      stdout.trim().split('\n').forEach((line) => {
        const parts = line.split('\t');
        if (parts.length < 2) return;
        const size = parseInt(parts[0]) * 1024;
        const path = parts[1];
        if (path && path !== root) onEntry({ path, size });
      });
      res();
    });
  });

  // Run depth 1 immediately, then 2, then 3 — each sends results as it finishes
  scanDepth(1)
    .then(() => scanDepth(2))
    .then(() => scanDepth(3))
    .then(resolve);
});
