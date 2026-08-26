# Directrices del Proyecto - El Artista

## Reglas de Diseño e Interfaz de Usuario (UI/UX)

- **Consulta Obligatoria de design.md:** Antes de crear, modificar o proponer cualquier elemento visual, componente de interfaz, estilo CSS, maquetación o diseño, consulta el archivo design.md en la raíz del proyecto.
- **Consistencia de Estilo:** Todo cambio visual debe respetar estrictamente el sistema de diseño definido en design.md:
  - **Fondo:** Crema cálido (#f7f4ed), nunca blanco puro.
  - **Texto y Contrastes:** Charcoal (#1c1c1c) y escalas de opacidad, texto secundario #5f5f5d.
  - **Bordes y Contenedores:** 1px solid #eceae4 en tarjetas e imágenes, sin sombras pesadas.
  - **Botones:** Botón oscuro con sombra *inset* característica (gba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px), radio 6px para botones rectangulares y 9999px únicamente para píldoras/iconos.
  - **Tipografía y Jerarquía:** Camera Plain Variable (o fallbacks ui-sans-serif, system-ui), pesos 400 y 600, con espaciado negativo en titulares grandes.

## Activación Obligatoria del Equipo de Agentes

- **Despliegue Sistemático del Equipo en Cada Prompt:** Ante CUALQUIER solicitud, prompt, corrección o tarea técnica que envíe el usuario, el agente principal DEBE desplegar e invocar inmediatamente al equipo de subagentes especializados utilizando `invoke_subagent` (o definiendo subagentes especializados con `define_subagent` si es necesario):
  - **Orchestrator / Architect:** Planificación estratégica y desglose de tareas.
  - **UI/UX Motion Designer:** Auditoría y respeto estricto a `design.md`.
  - **Frontend & WebAudio Specialist:** Implementación técnica, componentes React/Vite y síntesis/efectos de audio.
  - **Backend & Data Specialist:** Gestión de estado, persistencia y APIs.
  - **QA Tester & Auditor:** Verificación de tipos, build y prevención de regresiones.
- **Flujo de Ejecución Multi-Agente:** Ninguna tarea se ejecutará de forma aislada; siempre se debe distribuir la carga entre los subagentes pertinentes, recopilar sus reportes y sincronizar el resultado final.

## Automatización y Flujo de Trabajo (Git & GitHub)

- **Sincronización Automática con GitHub:** Siempre que se complete cualquier modificación, refactorización, nueva funcionalidad o corrección en el código, se debe verificar la compilación (`npm run build`), añadir todos los cambios (`git add -A`), realizar un commit descriptivo y hacer `git push origin main` al repositorio de GitHub automáticamente, sin esperar una petición manual del usuario.
