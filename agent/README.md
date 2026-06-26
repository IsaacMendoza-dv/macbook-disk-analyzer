# macdisk-agent

Local WebSocket agent for [MacDisk Analyzer](https://github.com/IsaacMendoza-dv/macbook-disk-analyzer).

Runs on your Mac and exposes a local WebSocket API that the web app uses to read and clean your disk. Nothing leaves your machine.

## Requirements

- macOS 10.15 (Catalina) or later
- Node.js 18+

## Usage

```bash
npx macdisk-agent
```

Then open the web app at [macdisk-analyzer.vercel.app](https://macdisk-analyzer.vercel.app).

## What it does

- Reads disk stats with `df`
- Scans directories with `du`
- Detects junk: caches, logs, Xcode DerivedData, node_modules, .DS_Store
- Deletes selected items via `rm` after user confirmation

## Security

- Listens on `127.0.0.1:3001` only — not exposed to the network
- Paths `/System`, `/usr`, `/bin`, `/sbin`, `/etc` are permanently blocked from deletion
