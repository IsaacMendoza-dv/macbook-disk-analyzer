# MacDisk Analyzer — Especificación Técnica

> Última actualización: 2026-06-26

---

## 1. Problema

Los usuarios de MacBook se quedan sin espacio sin saber exactamente qué lo consume. Las herramientas nativas son poco granulares y no sugieren acciones concretas.

---

## 2. Arquitectura

### Decisión: frontend local + agente local (Opción A)

```
http://localhost:3000   ◄── WebSocket ──►   ws://127.0.0.1:3001
  HTML/CSS/JS vanilla                         Node.js
  (npx serve .)                               (node server.js)
```

**Por qué no Vercel directo:** los browsers bloquean `ws://` desde `https://` (mixed content policy). El frontend debe servirse en `http://` para conectar al agente local.

**Por qué no Electron:** mantiene arquitectura web sin empaquetar nativa.

---

## 3. Stack

| Capa | Tecnología | Razón |
|---|---|---|
| Frontend | HTML + CSS + JS vanilla | Sin bundler, sin dependencias de build |
| Estilos | CSS puro + variables | Control total del tema terminal |
| Base visual | Morning Routine Kiro | Mismo sistema de diseño reutilizado |
| Agente | Node.js + `ws@8.18.0` | Acceso nativo al FS de macOS |
| Comunicación | WebSocket | Bidireccional, streaming en tiempo real |
| Stats disco | `diskutil info -plist /` | Único comando con APFS container correcto |
| Escaneo | `du -sk` por directorio | Evita el conflicto `-s`/`-d` de macOS |
| Junk detection | `du -sk` + `find` | Sin dependencias externas |
| Borrado | `rm -rf` + whitelist | Simple, con sistema bloqueado |

---

## 4. Módulos

### Agente (`agent/`)

| Archivo | Responsabilidad |
|---|---|
| `server.js` | WS server en 127.0.0.1:3001, router de mensajes, pasa callbacks de progreso |
| `lib/stats.js` | `diskutil info -plist /` → parsea `TotalSize` y `APFSContainerFree` |
| `lib/scan.js` | Lista dirs con `fs.readdirSync`, mide cada uno con `du -sk`, emite barra de progreso ASCII |
| `lib/junk.js` | 6 categorías fijas + `find` para node_modules y .DS_Store. Excluye `~/macbook-disk-analyzer` y `~/n` |
| `lib/clean.js` | `rm -rf` con validación contra lista de paths bloqueados del sistema |

### Frontend (`frontend/`)

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Esqueleto HTML, 5 vistas, IDs para i18n |
| `css/base.css` | Variables CSS, reset, JetBrains Mono, scanlines via `body::after` |
| `css/layout.css` | Grid 2x3 (header/nav/main/log), estados del banner del agente |
| `css/components.css` | Barras ASCII, árbol, tabla junk, cleaner, guía de onboarding |
| `js/i18n.js` | Diccionarios EN/ES, `t(key)`, `setLang()`, `applyLang()`, `renderGuide()` |
| `js/main.js` | WebSocket con 3 reintentos max, router de vistas, lang toggle, botones scan/junk |
| `js/terminal.js` | `termLog()` — detecta barras de progreso y las actualiza in-place |
| `js/dashboard.js` | `renderStats()` barras ASCII, `renderDirs()` top 15, `fmtBytes()` GB decimales |
| `js/filetree.js` | `buildTree()` desde array plano, `renderTree()` con toggle colapsar/expandir |
| `js/scanner.js` | `renderJunk()` tabla + sync con cleaner |
| `js/cleaner.js` | Checkboxes, summary, confirm dialog, `wsSend({ type: 'clean' })` |

---

## 5. Decisiones técnicas y bugs resueltos

### Stats: `diskutil` en lugar de `df`

`df -k /` reporta solo el volumen lógico APFS. `FreeSpace` en el plist de `diskutil` retorna siempre `0` para volúmenes APFS individuales. El campo correcto es `APFSContainerFree`.

### Diferencia ~30 GB con macOS Storage

macOS excluye el Signed System Volume (SSV) de su reporte. Nuestra app usa el contenedor APFS completo — la diferencia contiene purgeable storage, cachés y logs limpiables. **Comportamiento intencional.**

### `du -sk` y `-d` son mutuamente excluyentes en macOS

`du -sk -d 2` falla silenciosamente en macOS — devuelve `done` sin datos. Solución: `fs.readdirSync` para listar dirs + `du -sk <path>` individual por cada directorio.

### Renderizado progresivo sin esperar `done`

El frontend renderiza árbol y dashboard cada 20 `progress` recibidos. Sin esto el usuario no ve nada hasta que termina el scan completo.

### `ws.onmessage` sobreescrito durante debug

Al usar `ws.onmessage = ...` en la consola del browser para diagnosticar, se pierde el handler original. Solución: siempre usar `ws.send(...)` para probar sin sobreescribir el handler.

### Junk detecta node_modules del propio proyecto

`find ~ -name node_modules` encuentra `~/macbook-disk-analyzer/agent/node_modules` y `~/n/lib/node_modules` (node version manager). Solución: lista de exclusión en `junk.js` con `isExcluded()`.

### Barra de progreso in-place en el log panel

`termLog()` detecta si el mensaje contiene `[` y `/` (patrón de barra ASCII) y actualiza la última línea en lugar de agregar una nueva. Evita que el log se llene de cientos de líneas durante el scan.

### `~/Library` aparece en 0 KB

macOS restringe `~/Library` por defecto. Terminal necesita **Acceso Total al Disco** en Privacidad y Seguridad. Sin este permiso `du -sk ~/Library` retorna 0 sin error.

### Doble clone (estructura anidada)

Si `git clone` se ejecuta dentro de `agent/`, el proyecto queda en `~/macbook-disk-analyzer/agent/macbook-disk-analyzer/`. En ese caso usar las rutas completas:
```bash
cd ~/macbook-disk-analyzer/agent/macbook-disk-analyzer/agent && node server.js
cd ~/macbook-disk-analyzer/agent/macbook-disk-analyzer/frontend && npx serve .
```

### Browser caché (304 Not Modified)

`npx serve` devuelve 304 cuando el browser tiene caché. Siempre usar **⌘ Shift R** (hard reload) después de `git pull` para garantizar que se sirvan los archivos nuevos.

### Puerto 3001 ya en uso (EADDRINUSE)

Ocurre cuando el agente ya está corriendo de una sesión anterior:
```bash
kill $(lsof -ti:3001) && node server.js
```

---

## 6. Protocolo WebSocket

```
Cliente → Agente:
  { type: "stats" }
  { type: "scan",  path: "/Users/name" }
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

## 7. Seguridad

- Agente en `127.0.0.1` — inaccesible desde red
- Paths bloqueados: `/System` `/usr` `/bin` `/sbin` `/etc` `/private` `/var`
- Confirmación obligatoria antes de cualquier `rm`
- Sin telemetría ni requests externos
- `ws@8.18.0` — CVE-2026-45736 pendiente de patch upstream. Riesgo mínimo: solo acepta localhost

---

## 8. Diseño visual

```css
--bg:       #060a0f;
--surface:  rgba(10,18,28,0.85);
--border:   rgba(0,255,65,0.2);
--accent:   #00ff41;   /* verde terminal */
--accent2:  #00aaff;   /* azul secundario */
--warn:     #ffaa00;
--danger:   #ff4466;
--text:     #c8d8e8;
--muted:    #4a6070;
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

Efectos: scanlines (`body::after`), cursor parpadeante, pulso en dot conectado, barras ASCII `[████░░]`.

---

## 9. Estado del MVP

- [x] Stats del disco (APFS-aware)
- [x] Escaneo con progreso en tiempo real
- [x] Árbol de archivos navegable
- [x] Scanner de junk (6 categorías)
- [x] Cleaner con confirmación
- [x] i18n EN/ES con toggle
- [x] Guía de onboarding completa en la app
- [x] Banner de estado del agente
- [x] Nota de permisos para ~/Library
- [ ] Cleaner probado end-to-end
- [ ] Publicar agente en npm

---

## 10. Próximas mejoras sugeridas

- Agregar categoría **Downloads con +30 días** (`find ~/Downloads -mtime +30`)
- Mostrar tamaño total encontrado en el scanner antes de borrar
- Animación de "liberando espacio" durante el clean
- Publicar `macdisk-agent` en npm para instalar con `npx macdisk-agent`
- Soporte `wss://` con certificado auto-firmado para usar desde Vercel sin `npx serve`
