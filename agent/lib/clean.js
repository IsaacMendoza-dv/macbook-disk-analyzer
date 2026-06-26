const { execFile } = require('child_process');
const path = require('path');
const os = require('os');

// Paths that can NEVER be deleted
const BLOCKED = ['/System', '/usr', '/bin', '/sbin', '/etc', '/private', '/var'];

const isBlocked = (p) => {
  const resolved = path.resolve(p);
  return BLOCKED.some(b => resolved === b || resolved.startsWith(b + '/'));
};

const rmItem = (p) => new Promise((resolve, reject) => {
  execFile('rm', ['-rf', p], (err) => err ? reject(err) : resolve());
});

module.exports = async (paths, onLog) => {
  if (!Array.isArray(paths) || paths.length === 0) return;

  for (const p of paths) {
    if (isBlocked(p)) {
      onLog({ message: `BLOCKED: ${p}` });
      continue;
    }
    try {
      await rmItem(p);
      onLog({ message: `Deleted: ${p}` });
    } catch (err) {
      onLog({ message: `Error deleting ${p}: ${err.message}` });
    }
  }
};
