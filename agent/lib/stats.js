const { execFile } = require('child_process');

module.exports = () => new Promise((resolve, reject) => {
  execFile('diskutil', ['info', '-plist', '/'], (err, stdout) => {
    if (err) return fallbackDf(resolve, reject);
    try {
      const get = (key) => {
        const m = stdout.match(new RegExp(`<key>${key}<\\/key>\\s*<integer>(\\d+)<\\/integer>`));
        return m ? parseInt(m[1]) : null;
      };

      const total = get('TotalSize');
      const free  = get('APFSContainerFree') ?? get('FreeSpace');

      if (!total || !free) return fallbackDf(resolve, reject);

      const used = total - free;
      resolve({ total, used, free, percent: Math.round((used / total) * 100) });
    } catch {
      fallbackDf(resolve, reject);
    }
  });
});

function fallbackDf(resolve, reject) {
  execFile('df', ['-k', '/'], (err, stdout) => {
    if (err) return reject(err);
    const cols  = stdout.trim().split('\n')[1].split(/\s+/);
    const total = parseInt(cols[1]) * 1024;
    const used  = parseInt(cols[2]) * 1024;
    const free  = parseInt(cols[3]) * 1024;
    resolve({ total, used, free, percent: Math.round((used / total) * 100) });
  });
}
