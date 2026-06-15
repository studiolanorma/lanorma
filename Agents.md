# Agents.md — Contexto del Proyecto Lanorma

## El Proyecto

**Lanorma** es un estudio de diseño gráfico y web con sede en Santander, Cantabria, España.
Especializado en identidad visual, diseño web y dirección creativa para pymes y startups.
Web: [www.studiolanorma.com](https://www.studiolanorma.com)

**Estado actual:** En fase de construcción de portfolio. La web está al 90% (pendiente perfeccionar transición). Prioridad máxima: completar y publicar casos de estudio.

- ✅ Goods Matcha — Finalizado
- 🔄 Saifai — En parte completado
- 🔄 Resto de proyectos — En proceso

---

## El Equipo

### Diseñadora / Fundadora
- Diseñadora gráfica especializada en marca y web
- Lleva el diseño, la dirección creativa y el desarrollo frontend
- Se está formando en desarrollo web mientras construye el proyecto

### Dani — Chief Business Officer
- Responsable del área de negocio y estrategia comercial

---

## Stack de Trabajo

| Área | Herramienta | Rol |
|---|---|---|
| Diseño digital y web | Figma | Diseño y prototipado |
| Retoque y mockups | Adobe Photoshop | Edición de imagen |
| Iconos y logotipos | Adobe Illustrator | Gráfica vectorial |
| Documentos impresos | Adobe InDesign | Maquetación |
| Motion y vídeo | After Effects + Media Encoder | Animación y exportación |
| Planificación con IA | Claude.ai | Hablar, planificar y generar prompts |
| Ejecución de código con IA | Claude Code (Terminal) | Ejecutar cambios en el proyecto |
| Editor de código | VS Code | Previsualización y revisión |
| Control de versiones | GitHub | Deploy automático a Cloudflare |
| Hosting | Cloudflare | Servidor y caché |
| Dominio | Cdmon | Gestión del dominio |
| Gestión de horas | Clockify | Control de tiempo por proyecto |

**Stack web:** HTML, CSS, JavaScript vanilla (sin frameworks ni CMS).

---

## Flujo de Trabajo con Claude

1. Diseño en Figma
2. Se trae a **Claude.ai** — se habla, planifica y entiende qué hay que hacer
3. Claude.ai genera un **prompt** con las instrucciones
4. Se abre **Claude Code** en Terminal → se le indica que lea `Agents.md` y `Memory.md`
5. Se pega el prompt — Claude Code ejecuta los cambios con contexto completo
6. Se previsualiza en VS Code
7. Si está bien → se dice **"Push a Git"** y Claude Code hace el deploy a GitHub
8. Cloudflare se actualiza automáticamente
9. ⚠️ Si hay cambios en CSS o JS → purgar caché en Cloudflare manualmente

---

## Cómo Trabajar con Esta Persona

- **Tono:** Directo y técnico
- **Explicaciones:** Siempre explicar el *por qué*, no solo el *qué*
- **Ritmo:** Paso a paso. No avanzar sin confirmación explícita
- **Estructura de respuesta siempre:**
  1. 🔍 **Problema** — qué está pasando y por qué
  2. 💡 **Solución** — qué se va a hacer y por qué es la mejor opción
  3. ⚙️ **Ejecución** — solo cuando ella dé el go, se lleva a cabo
- **Contexto:** No es desarrolladora, está aprendiendo mientras construye. Priorizar que entienda antes de ejecutar.
- **Evitar:** Dar soluciones sin explicación, asumir que ya sabe algo técnico, avanzar sin confirmación.
