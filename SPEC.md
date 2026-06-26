# MacDisk Analyzer — Especificación de Producto

> App web con tema terminal para analizar y liberar almacenamiento en MacBooks.
> Frontend en Vercel + agente local en el Mac comunicados por WebSocket.

---

## 1. Problema

Los usuarios de MacBook se quedan sin espacio sin saber exactamente qué lo consume. Las herramientas nativas son poco granulares y no sugieren acciones concretas.

---

## 2. Arquitectura general (Opción A)

```
┌─────────────────────────────────┐     WebSocket      ┌──────────────────────────┐
│  Browser (Vercel)               │ ◄─────────────────► │  Agente local (Mac)      │
│  HTML + CSS + JS vanilla        │   localhost:3001    │  Node.js standalone      │
│  macdisk-analyzer.vercel.app    │                     │  npx macdisk-agent       │
└─────────────────────────────────┘                     └──────────────────────────┘
                                                                    │
                                                           du / find / df
                                                                    │
                                                           Sistema de archivos
```

**Flujo de instalación para el usuario:**
1. Abrir `macdisk-analyzer.vercel.app` en el browser
2. Si no tiene el agente: la app muestra un comando de instalación
3. `npx macdisk-agent` — corre el agente en segundo plano
4. La app detecta la conexión y habilita el escaneo

---

## 3. Stack técnico

| Capa | Tecnología | Razón |
|---|---|---|
| Frontend | HTML + CSS + JS vanilla | Sin bundler, deploy directo a Vercel |
| Estilos | CSS puro (variables CSS) | Reutiliza base de Morning Routine |
| Hosting | Vercel | Ya configurado, auto-deploy desde `main` |
| Agente | Node.js (npm package) | Acceso nativo al FS de macOS |
| Comunicación | WebSocket (`ws`) | Log en tiempo real, bidireccional |
| Análisis disco | `child_process` + `du`, `find`, `df` | Comandos nativos de macOS |

---

## 4. Estructura del proyecto

```
macbook-disk-analyzer/
├── frontend/                  ← Deploy a Vercel
│   ├── index.html
│   ├── css/
│   │   ├── base.css           ← Variables, tipografía (basado en Morning Routine)
│   │   ├── layout.css         ← Shell, header, prompt
│   │   ├── dashboard.css      ← Barras de progreso ASCII
│   │   ├── filetree.css       ← Árbol de directorios
│   │   └── terminal.css       ← Panel de log en tiempo real
│   └── js/
│       ├── main.js            ← Init, conexión WebSocket, router
│       ├── dashboard.js       ← Render stats del disco
│       ├── filetree.js        ← Árbol navegable
│       ├── scanner.js         ← Resultados del scan, categorías de junk
│       ├── cleaner.js         ← Checkboxes, confirmación, borrado
│       └── terminal.js        ← Log en tiempo real (output del WS)
│
├── agent/                     ← Publicado en npm como `macdisk-agent`
│   ├── package.json
│   ├── server.js              ← WebSocket server en localhost:3001
│   └── lib/
│       ├── stats.js           ← df -h → espacio total/usado/libre
│       ├── scan.js            ← du recursivo con streaming
│       ├── junk.js            ← Detección de cachés, logs, node_modules, Xcode
│       └── clean.js           ← rm con validación de paths seguros
│
└── SPEC.md
```

---

## 5. Diseño visual — Tema Terminal

Basado en el sistema de diseño de **Morning Routine Kiro** (`base.css`).

### Paleta de colores

```css
--bg:        #060a0f;              /* fondo principal */
--surface:   rgba(10,18,28,0.75); /* paneles / cards */
--border:    rgba(0,255,170,0.18);/* bordes */
--accent:    #00ff41;             /* verde terminal clásico */
--accent2:   #00aaff;             /* azul eléctrico secundario */
--warn:      #ffaa00;             /* advertencias */
--danger:    #ff4466;             /* zona de peligro / borrado */
--text:      #c8d8e8;             /* texto principal */
--muted:     #4a6070;             /* texto secundario */
```

### Tipografía

```css
font-family: "JetBrains Mono", "Fira Code", monospace;
```

### Componentes UI

- Prompt animado: `user@macbook:~$ _` con cursor parpadeante
- Barras de progreso: `[████████░░░░] 62%`
- Tablas con bordes ASCII: `┌─┬─┐ │ └─┴─┘`
- Efecto scanlines sobre la pantalla completa
- Archivos > 100 MB → texto en `--warn`
- Archivos > 1 GB → texto en `--danger`

---

## 6. Módulos del frontend

| Módulo | Descripción |
|---|---|
| **Dashboard** | Espacio total / usado / libre con barras ASCII |
| **File Tree** | Árbol de directorios navegable con tamaños |
| **Scanner** | Categorías de junk detectadas con tamaños |
| **Cleaner** | Lista con checkboxes + confirmación antes de borrar |
| **Terminal Log** | Panel inferior con output en tiempo real del agente |

---

## 7. API del agente (WebSocket)

```
ws://localhost:3001

Cliente → Agente:
  { type: "stats" }
  { type: "scan", path: "/Users/isaac" }
  { type: "junk" }
  { type: "clean", paths: ["/path/a", "/path/b"] }

Agente → Cliente:
  { type: "stats",    data: { total, used, free, percent } }
  { type: "progress", data: { path, size } }
  { type: "tree",     data: { tree } }
  { type: "junk",     data: [ { category, path, size } ] }
  { type: "log",      data: { message } }
  { type: "done",     data: { freed } }
```

---

## 8. Categorías de junk detectadas

| Categoría | Path típico |
|---|---|
| Cachés de apps | `~/Library/Caches` |
| Logs del sistema | `~/Library/Logs` |
| DerivedData (Xcode) | `~/Library/Developer/Xcode/DerivedData` |
| Simuladores iOS | `~/Library/Developer/CoreSimulator/Caches` |
| node_modules huérfanos | Buscados con `find ~ -name node_modules -maxdepth 5` |
| Archivos `.DS_Store` | Buscados con `find ~ -name .DS_Store` |
| Downloads antiguos (+30 días) | `~/Downloads` filtrado por `mtime` |

---

## 9. Seguridad

- Agente corre **solo en localhost** — no expuesto a red externa
- Paths del sistema bloqueados: `/System`, `/usr`, `/bin`, `/sbin`, `/etc`
- Antes de borrar: el frontend muestra la lista completa con tamaños
- Confirmación explícita requerida (`DELETE [n items / X GB]?`)
- Sin telemetría, sin llamadas externas, análisis 100% local

---

## 10. Plan de desarrollo

### Fase 1 — Agente Node.js (2-3 días)
1. Setup del package npm (`macdisk-agent`)
2. WebSocket server en `localhost:3001` con CORS para Vercel
3. `stats.js` → `df -h`
4. `scan.js` → `du` con streaming por WebSocket
5. `junk.js` → detección por categoría
6. `clean.js` → `rm` con validación de paths

### Fase 2 — Frontend (3-4 días)
1. `base.css` + `layout.css` — shell con prompt animado
2. Conexión WebSocket + detección de agente
3. `dashboard.js` — barras ASCII con stats
4. `filetree.js` — árbol navegable
5. `scanner.js` + `cleaner.js` — junk list con checkboxes
6. `terminal.js` — log en tiempo real

### Fase 3 — Deploy y QA (1-2 días)
1. Publish del agente en npm
2. Deploy del frontend a Vercel
3. Test de paths seguros (no borrar sistema)
4. README de instalación y uso

---

## 11. Criterios de éxito (MVP)

- [ ] El usuario instala el agente con un solo comando (`npx macdisk-agent`)
- [ ] Escaneo del home completo en < 30 segundos
- [ ] Identificación correcta de al menos 5 categorías de junk
- [ ] Cero borrados sin confirmación explícita
- [ ] Frontend accesible desde Vercel sin instalación adicional

---

*Actualizado: 2026-06-25*
