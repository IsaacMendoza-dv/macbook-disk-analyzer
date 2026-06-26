# MacDisk Analyzer — Especificación de Producto

> Última actualización: 2026-06-25

---

## 1. Problema

Los usuarios de MacBook se quedan sin espacio sin saber exactamente qué lo consume. Las herramientas nativas (Finder, Almacenamiento del Sistema) son poco granulares y no sugieren acciones concretas.

---

## 2. Solución

App web con estética de terminal que analiza el disco del Mac, visualiza el uso por categorías, identifica archivos pesados y temporales, y guía al usuario para liberar espacio de forma segura.

---

## 3. Arquitectura

### Decisión: Opción A — Frontend local + agente local

```
http://localhost:3000        ws://127.0.0.1:3001
  (npx serve .)    ◄────────►  (node server.js)
  HTML/CSS/JS                   Node.js + macOS CLI
```

**Por qué no Vercel directo:** los browsers bloquean conexiones `ws://` desde páginas `https://`. El frontend debe servirse desde `http://` para conectar al agente local.

**Por qué no Electron:** mantiene la arquitectura web sin empaquetar una app nativa.

---

## 4. Stack

| Capa | Tecnología | Razón |
|---|---|---|
| Frontend | HTML + CSS + JS vanilla | Sin bundler, cero dependencias de build |
| Estilos | CSS puro con variables | Control total del tema terminal |
| Base visual | Morning Routine Kiro (`base.css`) | Mismo sistema de diseño, reutilizado |
| Agente | Node.js + `ws@8.18.0` | Acceso nativo al FS de macOS |
| Comunicación | WebSocket | Bidireccional, streaming en tiempo real |
| Disco stats | `diskutil info -plist /` | Único comando que reporta APFS container correcto |
| Escaneo | `du -sk -d N` por niveles | Streaming progresivo (d1→d2→d3) |
| Junk detection | `du` + `find` | Comandos nativos, sin dependencias |
| Borrado | `rm -rf` con whitelist | Simple, con paths del sistema bloqueados |

---

## 5. Diseño visual

### Paleta

```css
--bg:       #060a0f;               /* fondo */
--surface:  rgba(10,18,28,0.85);   /* paneles */
--border:   rgba(0,255,65,0.2);    /* bordes */
--accent:   #00ff41;               /* verde terminal */
--accent2:  #00aaff;               /* azul secundario */
--warn:     #ffaa00;               /* advertencias */
--danger:   #ff4466;               /* peligro/borrado */
--text:     #c8d8e8;               /* texto */
--muted:    #4a6070;               /* texto secundario */
```

### Tipografía
`JetBrains Mono` → `Fira Code` → `monospace`

### Efectos
- Scanlines sobre toda la pantalla (`body::after`)
- Cursor parpadeante (`@keyframes blink`)
- Punto de conexión con pulso animado (`@keyframes pulse`)
- Barras ASCII: `[████████░░░░] 62%`

---

## 6. Módulos

### Frontend (`frontend/`)

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Esqueleto HTML, 5 vistas, sin lógica |
| `css/base.css` | Variables, reset, tipografía, scanlines |
| `css/layout.css` | Grid shell (header/nav/main/log), estados del agente |
| `css/components.css` | Barras ASCII, árbol, tabla junk, cleaner, guía onboarding |
| `js/i18n.js` | Diccionarios EN/ES, `t()`, `setLang()`, `applyLang()`, `renderGuide()` |
| `js/main.js` | WebSocket (3 reintentos max), router de vistas, lang toggle |
| `js/terminal.js` | `termLog()` — append al panel inferior |
| `js/dashboard.js` | `renderStats()`, `renderDirs()`, `fmtBytes()` (GB decimales) |
| `js/filetree.js` | `buildTree()`, `renderTree()` — árbol con toggle colapsar/expandir |
| `js/scanner.js` | `renderJunk()` — tabla de categorías detectadas |
| `js/cleaner.js` | `renderCleanerList()` — checkboxes, summary, confirm dialog |

### Agente (`agent/`)

| Archivo | Responsabilidad |
|---|---|
| `server.js` | WS server en 127.0.0.1:3001, router de mensajes |
| `lib/stats.js` | `diskutil info -plist /` → APFS container stats |
| `lib/scan.js` | `du -sk -d N` niveles 1→2→3, envía cada nivel inmediatamente |
| `lib/junk.js` | 6 categorías: Caches, Logs, DerivedData, Simulators, node_modules, .DS_Store |
| `lib/clean.js` | `rm -rf` con lista de paths del sistema bloqueados |

---

## 7. Decisiones técnicas documentadas

### Stats del disco — por qué `diskutil` y no `df`

`df -k /` en macOS APFS reporta solo el volumen lógico raíz. `FreeSpace` del plist de `diskutil` retorna `0` para volúmenes APFS individuales. El campo correcto es `APFSContainerFree` que representa el espacio libre real del contenedor compartido.

### Diferencia con macOS Storage (~30 GB)

Nuestra app muestra más espacio usado que "Ajustes del Sistema" porque:
1. macOS excluye el Signed System Volume (SSV) de su reporte
2. Nuestra app incluye purgeable storage, cachés y logs que macOS oculta

Esta diferencia es **intencional** — el espacio "oculto" contiene basura limpiable.

### Escaneo por niveles en lugar de `du -d 3` directo

`du -d 3` en un disco de 1 TB puede tardar 2+ minutos sin enviar ningún resultado (espera a terminar antes de imprimir). La solución es ejecutar `du -d 1`, luego `du -d 2`, luego `du -d 3` secuencialmente — cada nivel termina en segundos y envía resultados inmediatamente al frontend.

### Límite de 3 reintentos en WebSocket

Sin límite, el browser intentaba reconectar cada 3 segundos indefinidamente cuando el agente no estaba corriendo, generando ruido en el log y consumo innecesario. Después de 3 intentos fallidos se muestra el botón de "Reintentar" manual.

### i18n sin librería externa

Los textos EN/ES se almacenan en un objeto `LANG` en `i18n.js`. La función `t(key)` resuelve el idioma actual. `applyLang()` actualiza todos los elementos del DOM con null-checks para evitar errores en elementos ocultos o no renderizados.

---

## 8. Seguridad

- Agente escucha **solo en 127.0.0.1** — inaccesible desde la red
- Paths bloqueados permanentemente: `/System` `/usr` `/bin` `/sbin` `/etc` `/private` `/var`
- Confirmación de usuario requerida antes de cualquier `rm`
- Sin telemetría, sin requests externos, 100% local
- `ws@8.18.0` — única dependencia externa. CVE-2026-45736 pendiente de patch upstream; riesgo mínimo dado que el servidor solo acepta conexiones de localhost

---

## 9. Criterios de éxito MVP

- [x] Stats del disco correctos (APFS-aware)
- [x] Escaneo con resultados progresivos (no blocking)
- [x] UI en EN y ES con toggle
- [x] Instrucciones claras de setup en la app
- [x] Indicador de estado del agente claro (banner con status + descripción)
- [x] Cero borrados sin confirmación
- [ ] Detect Junk funcionando end-to-end
- [ ] Cleaner probado en producción
- [ ] Publicar agente en npm (`npx macdisk-agent`)
