#!/usr/bin/env node
const { WebSocketServer } = require('ws');
const stats = require('./lib/stats');
const scan  = require('./lib/scan');
const junk  = require('./lib/junk');
const clean = require('./lib/clean');

const PORT = 3001;
const wss = new WebSocketServer({ host: '127.0.0.1', port: PORT });

const send = (ws, type, data) => ws.send(JSON.stringify({ type, data }));

wss.on('connection', (ws) => {
  send(ws, 'log', { message: 'macdisk-agent connected' });

  ws.on('message', async (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {
      case 'stats':
        send(ws, 'stats', await stats());
        break;

      case 'scan':
        send(ws, 'log', { message: `Scanning ${msg.path || '~'} ...` });
        await scan(
          msg.path,
          (entry) => send(ws, 'progress', entry),
          (prog)  => send(ws, 'log', prog)
        );
        send(ws, 'done', {});
        break;

      case 'junk':
        send(ws, 'log', { message: 'Detecting junk ...' });
        send(ws, 'junk', await junk());
        break;

      case 'clean':
        await clean(msg.paths, (entry) => send(ws, 'log', entry));
        send(ws, 'done', {});
        break;

      default:
        send(ws, 'log', { message: `Unknown command: ${msg.type}` });
    }
  });
});

console.log(`macdisk-agent running on ws://127.0.0.1:${PORT}`);
