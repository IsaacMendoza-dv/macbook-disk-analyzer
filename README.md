# MacDisk Analyzer

App web con tema terminal para analizar y liberar almacenamiento en MacBooks.

**Stack:** HTML · CSS · JS vanilla · Node.js · WebSocket  
**Compatibilidad:** macOS 10.15 Catalina → 15 Sequoia · Intel + Apple Silicon

---

## Cómo funciona

```
http://localhost:3000  ◄──── WebSocket ────►  ws://127.0.0.1:3001
  Frontend (serve)                              Agente (Node.js)
                                                    │
                                          diskutil / du / find / rm
                                                    │
                                            Sistema de archivos Mac
```

El frontend corre localmente (no desde la URL de Vercel). El agente lee el disco con comandos nativos de macOS y envía los resultados por WebSocket. **Nada sale a internet.**

> ⚠️ Usar siempre `http://localhost:3000`, no la URL de Vercel.  
> Los browsers bloquean `ws://` desde páginas `https://`.

---

## Instalación y uso

### Requisitos
- macOS 10.15+
- Node.js 18+ → [nodejs.org](https://nodejs.org)
- Git

### Primera vez

```bash
# 1. Clonar el proyecto
git clone https://github.com/IsaacMendoza-dv/macbook-disk-analyzer.git

# 2. Terminal pestaña 1 — iniciar agente
cd macbook-disk-analyzer/agent
npm install
node server.js
# → macdisk-agent running on ws://127.0.0.1:3001

# 3. Terminal pestaña 2 — iniciar frontend
cd macbook-disk-analyzer/frontend
npx serve .
# → abrir http://localhost:3000
```

### Uso diario (después del primer setup)

```bash
# Pestaña 1
cd macbook-disk-analyzer/agent && node server.js

# Pestaña 2
cd macbook-disk-analyzer/frontend && npx serve .
```

### Si el puerto 3001 ya está en uso

```bash
kill $(lsof -ti:3001)
node server.js
```

---

## Estructura

```
macbook-disk-analyzer/
├── README.md           ← Este archivo — setup y referencia rápida
├── SPEC.md             ← Especificación completa del producto
├── vercel.json         ← Config de Vercel (frontend estático)
├── .gitignore
├── agent/              ← Corre en el Mac del usuario
│   ├── package.json
│   ├── server.js       ← WebSocket server en 127.0.0.1:3001
│   └── lib/
│       ├── stats.js    ← diskutil info → total/usado/libre (APFS-aware)
│       ├── scan.js     ← du por niveles (d1→d2→d3) con streaming
│       ├── junk.js     ← Detección: Caches, Logs, Xcode, node_modules, .DS_Store
│       └── clean.js    ← rm -rf con paths del sistema bloqueados
└── frontend/           ← Abre en http://localhost:3000
    ├── index.html
    ├── css/
    │   ├── base.css        ← Variables CSS, tipografía JetBrains Mono, scanlines
    │   ├── layout.css      ← Grid shell, header, nav, log panel
    │   └── components.css  ← Barras ASCII, árbol, tabla junk, cleaner, guía
    └── js/
        ├── i18n.js         ← Textos EN/ES, toggle de idioma, applyLang()
        ├── main.js         ← Init, WebSocket (3 reintentos), router de vistas
        ├── terminal.js     ← Log en tiempo real (panel inferior)
        ├── dashboard.js    ← Stats + barras ASCII (GB decimales como macOS)
        ├── filetree.js     ← Árbol navegable, colapsar/expandir
        ├── scanner.js      ← Tabla de junk por categoría
        └── cleaner.js      ← Checkboxes + confirmación antes de borrar
```

---

## Módulos del agente

| Archivo | Comando macOS | Qué hace |
|---|---|---|
| `stats.js` | `diskutil info -plist /` | Total/usado/libre real (APFS container) |
| `scan.js` | `du -sk -d N` | Escaneo por niveles, envía progreso inmediato |
| `junk.js` | `du`, `find` | Detecta 6 categorías de basura |
| `clean.js` | `rm -rf` | Borra con whitelist de paths bloqueados |

### Categorías de junk detectadas

| Categoría | Path |
|---|---|
| App Caches | `~/Library/Caches` |
| System Logs | `~/Library/Logs` |
| Xcode DerivedData | `~/Library/Developer/Xcode/DerivedData` |
| iOS Simulators | `~/Library/Developer/CoreSimulator/Caches` |
| node_modules | `find ~ -name node_modules -maxdepth 5` |
| .DS_Store | `find ~ -name .DS_Store` |

---

## Protocolo WebSocket

```
Cliente → Agente:
  { type: "stats" }
  { type: "scan",  path: "/Users/name" }   ← omitir path = home dir
  { type: "junk" }
  { type: "clean", paths: ["/path/a"] }

Agente → Cliente:
  { type: "stats",    data: { total, used, free, percent } }
  { type: "progress", data: { path, size } }
  { type: "junk",     data: [{ category, path, size }] }
  { type: "log",      data: { message } }
  { type: "done",     data: {} }
```

---

## Seguridad

- Agente escucha **solo en 127.0.0.1** — inaccesible desde la red
- Paths permanentemente bloqueados para borrado: `/System` `/usr` `/bin` `/sbin` `/etc` `/private` `/var`
- Confirmación obligatoria antes de cualquier `rm`
- Sin telemetría, sin requests externos

---

## Notas sobre los números del disco

Nuestra app muestra ~30 GB más que "Ajustes del Sistema → Almacenamiento" de macOS. Esto es **correcto e intencional**:

- macOS oculta el **Signed System Volume** (volumen de solo lectura del OS)
- Nuestra app muestra el **contenedor APFS completo** — incluyendo purgeable storage, cachés y logs que macOS oculta
- Esa diferencia es exactamente donde está la basura que se puede limpiar

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
| 10.14 | Mojave | ⚠️ requiere Acceso Total al Disco en Privacidad |
| ≤ 10.13 | — | ❌ |

---

## Estado

- [x] Fase 1 — Agente Node.js
- [x] Fase 2 — Frontend con tema terminal + i18n EN/ES
- [x] Fase 3 — Deploy Vercel + documentación
- [ ] Fase 4 — Publicar agente en npm (`npx macdisk-agent`)
