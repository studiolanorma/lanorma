# Memory.md — Contexto Técnico del Proyecto Lanorma

> 📝 **Instrucción:** Cuando la usuaria corrija algo, aporte información nueva o se tome una decisión técnica sobre el proyecto, actualiza este archivo para reflejarlo.

## La Web

**URL:** [www.studiolanorma.com](https://www.studiolanorma.com)
**Repositorio:** [github.com/studiolanorma/lanorma](https://github.com/studiolanorma/lanorma)
**Stack:** HTML, CSS, JavaScript vanilla — sin frameworks ni CMS
**Hosting:** Cloudflare Pages (deploy automático desde GitHub)
**Dominio:** Cdmon

---

## Estructura de Archivos

```
lanorma/
├── index.html               ← Homepage
├── assets/
│   ├── css/
│   │   ├── variables.css    ← Variables globales (colores, tipografía, etc.)
│   │   ├── base.css         ← Estilos base y reset
│   │   ├── navbar.css       ← Navegación
│   │   ├── footer.css       ← Pie de página
│   │   ├── buttons.css      ← Botones
│   │   ├── loader.css       ← Loader de carga
│   │   ├── page-transition.css ← Transiciones entre páginas
│   │   ├── reveal.css       ← Animaciones de entrada (scroll reveal)
│   │   └── pages/           ← CSS específico por página
│   ├── js/
│   │   ├── navbar.js
│   │   ├── loader.js
│   │   ├── page-transition.js
│   │   ├── reveal.js
│   │   └── pages/           ← JS específico por página
│   ├── fonts/
│   └── img/
├── nosotros/
├── insights/
├── contacto/
├── goodsmatcha/             ← Proyecto: Goods Matcha (✅ Finalizado)
├── saifai/                  ← Proyecto: Saifai (🔄 En parte completado)
├── legales/
├── privacidad/
├── _headers                 ← Configuración de cabeceras Cloudflare
├── _routes.json             ← Configuración de rutas Cloudflare
├── robots.txt
├── sitemap.xml
├── security.txt
└── og-image.jpg
```

> ⚠️ **Pendiente verificar:** si las carpetas de proyecto (goodsmatcha, saifai...) tienen CSS/JS propio además del global de assets, o solo un index.html que tira de los archivos globales.

---

## Estado de las Páginas

| Página | Estado | Notas |
|---|---|---|
| Homepage (index.html) | ✅ 90% | Pendiente afinar transición |
| Nosotros | ✅ | — |
| Insights | ✅ | — |
| Contacto | ✅ | — |
| Goods Matcha | ✅ Finalizado | Caso de estudio completo |
| Saifai | 🔄 En proceso | Caso de estudio parcial |
| Proyectos 4–9 | 🔄 En proceso | Próximamente |
| Legales / Privacidad | ✅ | — |

---

## Bugs Conocidos

### 🐛 Flash en la transición de página
**Descripción:** Al navegar entre páginas aparece un flash de color durante unos milisegundos. El fondo debería mantenerse del mismo color mientras la segunda cortina sube, igual que en [www.moqo.be](https://www.moqo.be).
**Archivos implicados:** `assets/css/page-transition.css` y `assets/js/page-transition.js`
**Estado:** Pendiente de resolver — de momento se mantiene así
**Referencia:** [www.moqo.be](https://www.moqo.be) — misma transición pero más fina

---

## Herramientas / Scripts

### Purga de caché de Cloudflare
- **Script:** `purge-cache.sh` (raíz del proyecto) — ejecuta `purge_cache` (purge everything) en la zona `studiolanorma.com` vía API de Cloudflare
- **Token:** guardado en `.env` (raíz, variable `CLOUDFLARE_API_TOKEN`) — **no se sube a Git**, está en `.gitignore`
- **Uso:** `./purge-cache.sh` desde la raíz del repo, tras cambios en CSS/JS o cuando un cambio de contenido no se refleje en producción

---

## Decisiones Técnicas Tomadas

- **Sin frameworks ni CMS** — decisión deliberada, web ligera y con control total del código
- **Transiciones desactivadas en mobile** — se probaron y se quitaron porque no funcionaban correctamente en dispositivos móviles
- **CSS modular por componente** — cada elemento tiene su propio archivo CSS (navbar, footer, loader...) en lugar de un solo archivo grande

---

## Convenciones de Código

- **Sistema de nombrado CSS:** Sin convención establecida — pendiente de definir
- **Comentarios:** Sin sistema establecido — pendiente de definir
- **Variables:** Centralizadas en `variables.css`

---

## Notas para Claude Code

- Leer siempre `Agents.md` y `Memory.md` al inicio de cada sesión
- No tocar `page-transition.css` ni `page-transition.js` salvo que se indique expresamente
- Purgar caché en Cloudflare manualmente después de cambios en CSS o JS
- No hay sistema de ramas — todo va a `main` directamente
