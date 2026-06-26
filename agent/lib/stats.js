const { execFile } = require('child_process');

module.exports = () => new Promise((resolve, reject) => {
  // df -k / → bloques de 1024 bytes, parseable
  execFile('df', ['-k', '/'], (err, stdout) => {
    if (err) return reject(err);
    const line = stdout.trim().split('\n')[1].split(/\s+/);
    // df -k columns: Filesystem 1K-blocks Used Available Use% Mounted
    const total = parseInt(line[1]) * 1024;
    const used  = parseInt(line[2]) * 1024;
    const free  = parseInt(line[3]) * 1024;
    resolve({ total, used, free, percent: Math.round((used / total) * 100) });
  });
});
