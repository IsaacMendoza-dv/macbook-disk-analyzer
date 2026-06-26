const { execFile, spawn } = require('child_process');
const os = require('os');
const path = require('path');

const home = os.homedir();

const CATEGORIES = [
  { category: 'App Caches',       path: path.join(home, 'Library/Caches') },
  { category: 'System Logs',      path: path.join(home, 'Library/Logs') },
  { category: 'Xcode DerivedData',path: path.join(home, 'Library/Developer/Xcode/DerivedData') },
  { category: 'iOS Simulators',   path: path.join(home, 'Library/Developer/CoreSimulator/Caches') },
];

const dirSize = (p) => new Promise((resolve) => {
  execFile('du', ['-sk', p], (err, stdout) => {
    if (err) return resolve(0);
    resolve(parseInt(stdout.split('\t')[0]) * 1024);
  });
});

const findItems = (name, maxDepth = 5) => new Promise((resolve) => {
  const results = [];
  const finder = spawn('find', [home, '-name', name, '-maxdepth', String(maxDepth)]);
  finder.stdout.on('data', (d) => d.toString().split('\n').forEach(p => p && results.push(p.trim())));
  finder.on('close', () => resolve(results));
});

module.exports = async () => {
  const results = [];

  // Fixed-path categories
  for (const cat of CATEGORIES) {
    const size = await dirSize(cat.path);
    if (size > 0) results.push({ ...cat, size });
  }

  // node_modules
  const nmPaths = await findItems('node_modules');
  for (const p of nmPaths) {
    const size = await dirSize(p);
    if (size > 0) results.push({ category: 'node_modules', path: p, size });
  }

  // .DS_Store (just list, tiny files)
  const dsPaths = await findItems('.DS_Store', 10);
  if (dsPaths.length > 0) {
    results.push({ category: '.DS_Store files', path: dsPaths, size: dsPaths.length * 4096 });
  }

  return results;
};
