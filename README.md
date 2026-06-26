# MacDisk Analyzer

App web con tema terminal para analizar y liberar almacenamiento en MacBooks.

**Stack:** HTML · CSS · JS vanilla · Node.js · WebSocket  
**Compatibilidad:** macOS 10.15+ · Intel + Apple Silicon · Node.js 18+

---

## Cómo funciona

```
http://localhost:3000      ◄── WebSocket ──►   ws://127.0.0.1:3001
  frontend (npx serve)                          agente (node server.js)
                                                    │
                                        diskutil / du -sk / find / rm
                                                    │
                                            ~/  (home del usuario)
```

Dos procesos locales, comunicados por WebSocket. Nada sale a internet.

> ⚠️ Siempre abrir en **http://localhost:3000** — no la URL de Vercel.  
> Los browsers bloquean `ws://` desde `https://`.

---

## Setup (primera vez)

```bash
# 1. Asegurarse de estar en home
cd ~

# 2. Clonar
git clone https://github.com/IsaacMendoza-dv/macbook-disk-analyzer.git

# 3. Terminal pestaña 1 — agente
cd ~/macbook-disk-analyzer/agent
npm install
node server.js
# → macdisk-agent running on ws://127.0.0.1:3001

# 4. Terminal pestaña 2 — frontend
cd ~/macbook-disk-analyzer/frontend
npx serve .
# → abrir http://localhost:3000
```

## Uso diario

```bash
# Pestaña 1
cd ~/macbook-disk-analyzer/agent && node server.js

# Pestaña 2
cd ~/macbook-disk-analyzer/frontend && npx serve .
```

Si el puerto 3001 ya está ocupado:
```bash
kill $(lsof -ti:3001) && node server.js
```

---

## ⚠️ Permisos requeridos

`~/Library` aparece en **0 KB** sin este permiso:

**Ajustes del Sistema → Privacidad y Seguridad → Acceso total al disco → agregar Terminal**

Sin él el scanner no detecta cachés, logs ni DerivedData de Xcode.

---

## Estructura del proyecto

```
macbook-disk-analyzer/
├── README.md           ← Setup, uso diario, referencia de módulos
├── SPEC.md             ← Decisiones técnicas, bugs resueltos, roadmap
├── vercel.json         ← Deploy estático del frontend
├── .gitignore
│
├── agent/              ← Corre localmente en el Mac
│   ├── package.json    ← dep: ws@8.18.0
│   ├── server.js       ← WS server 127.0.0.1:3001, router de mensajes
│   └── lib/
│       ├── stats.js    ← diskutil info -plist / → APFS container stats
│       ├── scan.js     ← du -sk por directorio, barra de progreso ASCII
│       ├── junk.js     ← 6 categorías: Caches, Logs, Xcode, Simulators, node_modules, .DS_Store
│       └── clean.js    ← rm -rf con paths del sistema bloqueados
│
└── frontend/           ← Abrir en http://localhost:3000
    ├── index.html      ← HTML puro, 5 vistas, sin lógica
    ├── css/
    │   ├── base.css        ← Variables CSS, JetBrains Mono, scanlines
    │   ├── layout.css      ← Grid shell, header, nav, log panel, banner
    │   └── components.css  ← Barras ASCII, árbol, tabla junk, cleaner, guía
    └── js/
        ├── i18n.js         ← Diccionarios EN/ES, t(), setLang(), applyLang(), renderGuide()
        ├── main.js         ← WS (3 reintentos), router de vistas, lang toggle, scan buttons
        ├── terminal.js     ← termLog() con actualización in-place para barras de progreso
        ├── dashboard.js    ← renderStats(), renderDirs(), fmtBytes() en GB decimales
        ├── filetree.js     ← buildTree(), renderTree(), toggle colapsar/expandir
        ├── scanner.js      ← renderJunk() — tabla de categorías
        └── cleaner.js      ← renderCleanerList(), confirm dialog, wsSend clean
```

---

## Protocolo WebSocket

```
Cliente → Agente:
  { type: "stats" }
  { type: "scan",  path: "/Users/name" }   ← sin path = home dir
  { type: "junk" }
  { type: "clean", paths: ["/path/a"] }

Agente → Cliente:
  { type: "stats",    data: { total, used, free, percent } }
  { type: "progress", data: { path, size } }
  { type: "junk",     data: [{ category, path, size }] }
  { type: "log",      data: { message } }   ← incluye barras de progreso ASCII
  { type: "done",     data: {} }
```

---

## Módulos del agente

| Archivo | Comando macOS | Notas |
|---|---|---|
| `stats.js` | `diskutil info -plist /` | Usa `APFSContainerFree`, no `FreeSpace` (siempre 0 en APFS) |
| `scan.js` | `du -sk <path>` por dir | `-s` y `-d` son mutuamente excluyentes en macOS — no combinar |
| `junk.js` | `du -sk`, `find` | Excluye `~/macbook-disk-analyzer` y `~/n` (node version manager) |
| `clean.js` | `rm -rf` | Bloqueados: `/System` `/usr` `/bin` `/sbin` `/etc` `/private` `/var` |

---

## Seguridad

- Agente en `127.0.0.1` — inaccesible desde red
- Paths del sistema permanentemente bloqueados para borrado
- Confirmación obligatoria antes de cualquier `rm`
- Sin telemetría ni requests externos

---

## Notas sobre los números del disco

La app muestra ~30 GB más que "Ajustes del Sistema". Es correcto:
- macOS oculta el Signed System Volume (SSV)
- Nuestra app muestra el contenedor APFS completo — incluyendo purgeable storage y cachés

Esa diferencia es exactamente donde está la basura limpiable.

---

## Compatibilidad

| macOS | Nombre | Soporte |
|---|---|---|
| 15.x | Sequoia | ✅ |
| 14.x | Sonoma | ✅ |
| 13.x | Ventura | ✅ |
| 12.x | Monterey | ✅ |
| 11.x | Big Sur | ✅ |
| 10.15 | Catalina | ✅ |
| 10.14 | Mojave | ⚠️ requiere Acceso Total al Disco manualmente |
| ≤ 10.13 | — | ❌ |

---

## Estado

- [x] Fase 1 — Agente: stats, scan, junk, clean
- [x] Fase 2 — Frontend: tema terminal, árbol, scanner, cleaner, i18n EN/ES
- [x] Fase 3 — Deploy Vercel + documentación completa
- [ ] Fase 4 — Publicar en npm (`npx macdisk-agent`)
- [ ] Fase 5 — Cleaner probado end-to-end en producción
