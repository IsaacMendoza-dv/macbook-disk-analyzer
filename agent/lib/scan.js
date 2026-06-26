const { spawn } = require('child_process');
const os = require('os');

module.exports = (targetPath, onEntry) => new Promise((resolve) => {
  const root = targetPath || os.homedir();
  // du -x: no cruzar límites de filesystem  -d 3: profundidad 3
  const du = spawn('du', ['-xsk', '-d', '3', root]);

  du.stdout.on('data', (chunk) => {
    chunk.toString().split('\n').forEach((line) => {
      const parts = line.trim().split('\t');
      if (parts.length < 2) return;
      const size = parseInt(parts[0]) * 1024;
      const path = parts[1];
      if (path) onEntry({ path, size });
    });
  });

  du.on('close', resolve);
});
