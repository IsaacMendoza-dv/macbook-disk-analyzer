# MacDisk Analyzer

App web con tema terminal para analizar y liberar almacenamiento en MacBooks.

**Stack:** HTML · CSS · JS vanilla · Node.js · WebSocket · Vercel

---

## Cómo funciona

```
Browser (Vercel) ◄──── WebSocket ────► Agente local (Mac)
                      localhost:3001      Node.js + du/find/df
```

El frontend vive en Vercel. El agente corre en el Mac del usuario y expone una API WebSocket local. El browser se conecta a `ws://localhost:3001` para leer el disco y ejecutar limpiezas.

---

## Estructura

```
macbook-disk-analyzer/
├── agent/          ← Agente Node.js (corre en el Mac del usuario)
├── frontend/       ← App web (deploy a Vercel)
├── README.md       ← Este archivo
└── SPEC.md         ← Especificación completa del producto
```

---

## Compatibilidad

### macOS

| versión | nombre | soporte | chip |
|---|---|---|---|
| 15.x | Sequoia | ✅ completo | Intel + Apple Silicon |
| 14.x | Sonoma | ✅ completo | Intel + Apple Silicon |
| 13.x | Ventura | ✅ completo | Intel + Apple Silicon |
| 12.x | Monterey | ✅ completo | Intel + Apple Silicon |
| 11.x | Big Sur | ✅ completo | Intel + Apple Silicon |
| 10.15 | Catalina | ✅ completo | Intel |
| 10.14 | Mojave | ⚠️ parcial* | Intel |
| ≤ 10.13 | High Sierra y anteriores | ❌ no soportado | — |

*Mojave: `du -d` funciona pero el acceso a `~/Library` puede requerir permisos extra en Preferencias > Seguridad.

### Requisitos del agente

| requisito | versión mínima | notas |
|---|---|---|
| Node.js | 18.x | 18 soporta macOS 10.15+ |
| npm | 8.x | incluido con Node 18 |
| macOS | 10.15 Catalina | mínimo probado |

### Nota sobre permisos (macOS 10.14+)

Desde Mojave, macOS requiere autorización explícita para acceder a ciertas carpetas.
Al correr el agente por primera vez, el sistema puede pedir permiso para:
- Acceso al disco completo (`~/Library`, `~/Downloads`)

Ir a: **Ajustes del Sistema → Privacidad y Seguridad → Acceso total al disco** → agregar Terminal.

---

## Instalación y uso

### 1. Agente (Mac)

```bash
cd agent
npm install
node server.js
# → ws://127.0.0.1:3001 activo
```

### 2. Frontend (browser)

```bash
cd frontend
# Abrir index.html en el browser, o:
npx serve .
```

O visitar la URL de Vercel (cuando esté deployado).

---

## Módulos

| Carpeta | Responsabilidad |
|---|---|
| `agent/server.js` | WebSocket server, router de mensajes |
| `agent/lib/stats.js` | Espacio total/usado/libre (`df`) |
| `agent/lib/scan.js` | Escaneo de directorios con streaming (`du`) |
| `agent/lib/junk.js` | Detección de cachés, logs, Xcode, node_modules |
| `agent/lib/clean.js` | Borrado seguro con paths bloqueados |
| `frontend/js/main.js` | Init, conexión WebSocket, router de vistas |
| `frontend/js/dashboard.js` | Stats del disco con barras ASCII |
| `frontend/js/filetree.js` | Árbol de directorios navegable |
| `frontend/js/scanner.js` | Lista de junk por categoría |
| `frontend/js/cleaner.js` | Checkboxes + confirmación de borrado |
| `frontend/js/terminal.js` | Log en tiempo real del agente |
| `frontend/css/base.css` | Variables CSS, tipografía, tema terminal |

---

## Protocolo WebSocket

```
Cliente → Agente:
  { type: "stats" }
  { type: "scan",  path: "/Users/isaac" }
  { type: "junk" }
  { type: "clean", paths: ["/path/a", "/path/b"] }

Agente → Cliente:
  { type: "stats",    data: { total, used, free, percent } }
  { type: "progress", data: { path, size } }
  { type: "junk",     data: [{ category, path, size }] }
  { type: "log",      data: { message } }
  { type: "done",     data: {} }
```

---

## Seguridad

- El agente escucha **solo en 127.0.0.1** — nunca expuesto en red
- Paths del sistema bloqueados para borrado: `/System` `/usr` `/bin` `/sbin` `/etc`
- Confirmación obligatoria en el frontend antes de cualquier `rm`

---

## Deploy

### Frontend → Vercel

```bash
# Desde la raíz del proyecto
npx vercel --prod
```

O conectar el repo en [vercel.com](https://vercel.com) — auto-deploy desde `main` activado.
El `vercel.json` ya apunta al directorio `frontend/`.

### Agente → npm

```bash
cd agent
npm login
npm publish
```

Después cualquier usuario puede correrlo con:

```bash
npx macdisk-agent
```

---

## Estado del proyecto

- [x] Fase 1 — Agente Node.js
- [x] Fase 2 — Frontend
- [x] Fase 3 — Deploy Vercel + publish npm
