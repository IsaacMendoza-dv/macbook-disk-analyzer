const { spawn } = require('child_process');
const readline  = require('readline');
const os        = require('os');

// Stream du output line-by-line using spawn+readline
// Depth 2 only — fast enough for any disk size, covers all major dirs
module.exports = (targetPath, onEntry) => new Promise((resolve) => {
  const root = targetPath || os.homedir();

  const du = spawn('du', ['-sk', '-d', '2', root], {
    // Suppress "permission denied" stderr noise
    stdio: ['ignore', 'pipe', 'ignore']
  });

  const rl = readline.createInterface({ input: du.stdout });

  rl.on('line', (line) => {
    const [sizeStr, ...pathParts] = line.split('\t');
    const path = pathParts.join('\t').trim();
    const size = parseInt(sizeStr) * 1024;
    if (path && path !== root && !isNaN(size)) {
      onEntry({ path, size });
    }
  });

  du.on('close', resolve);
  // Safety timeout — resolve after 45s no matter what
  setTimeout(resolve, 45000);
});
