const { execFile } = require('child_process');

// diskutil info / gives accurate APFS container stats on macOS
module.exports = () => new Promise((resolve, reject) => {
  execFile('diskutil', ['info', '-plist', '/'], (err, stdout) => {
    if (err) return fallbackDf(resolve, reject);
    try {
      // Parse the plist output — grab the numeric values with grep approach
      const totalMatch = stdout.match(/<key>TotalSize<\/key>\s*<integer>(\d+)<\/integer>/);
      const freeMatch  = stdout.match(/<key>FreeSpace<\/key>\s*<integer>(\d+)<\/integer>/) ||
                         stdout.match(/<key>APFSContainerFree<\/key>\s*<integer>(\d+)<\/integer>/);

      if (!totalMatch || !freeMatch) return fallbackDf(resolve, reject);

      const total = parseInt(totalMatch[1]);
      const free  = parseInt(freeMatch[1]);
      const used  = total - free;
      resolve({ total, used, free, percent: Math.round((used / total) * 100) });
    } catch {
      fallbackDf(resolve, reject);
    }
  });
});

// Fallback: df -k for non-APFS or older macOS
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
