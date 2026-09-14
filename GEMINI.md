# Directrices del Proyecto — El Artista

Este archivo sirve como memoria central y contexto persistente para Antigravity y cualquier agente de IA que trabaje en este espacio de trabajo.

---

## 📚 Documentación y Conocimiento del Proyecto
* **Documento Maestro de Arquitectura y Reglas:** [`PROJECT_KNOWLEDGE.md`](PROJECT_KNOWLEDGE.md) — Contiene la descripción técnica exhaustiva de todos los motores (`GameEngine`, `AwardEngine`, `IndustryEngine`, `RelationshipEngine`, `EventEngine`, `ChartEngine`, `StreamingEngine`, `TourEngine`, `WorldSimulation`) y la base de datos global de artistas de 40 países.
* **Sistema de Diseño Visual:** [`design.md`](design.md) — Lineamientos de paleta Obsidian `#0B0C10`, Slate Glass `#16181F`, bordes `#2A2E3D`, acento violeta `#8B5CF6`, tipografía `'Camera Plain Variable'` y avatares vectoriales.

---

## 🤖 Protocolo Obligatorio de Equipo Multi-Agente
Ante cualquier solicitud, prompt o tarea técnica, el agente principal DEBE desplegar al equipo de subagentes especializados:
1. **🧠 Systems Architect & Data Lead:** Modelos de datos (`types/index.ts`), catálogos y datasets de artistas.
2. **🎨 UI/UX & Frontend Specialist:** Vistas React, formularios, modales y cumplimiento estricto de `design.md`.
3. **💾 Backend & Simulation Engine Specialist:** Lógica de simulación, cálculos económicos, rankings, cooldowns y eventos.
4. **🧪 QA Tester & Auditor:** Verificación de pruebas automatizadas (`npm run test:diversity; npm run test:events; npm run test:buttons; npm run test:social`) y compilación limpia (`npm run build`).

---

## 🔄 Automatización de Git & Sincronización con GitHub
Siempre que se complete cualquier cambio o funcionalidad en el código:
1. Validar tests y compilación (`npm run build`).
2. Realizar `git add -A`.
3. Crear un commit descriptivo y estructurado.
4. Ejecutar `git push origin main` automáticamente (`https://github.com/bauticrack10/ARTISTA-GAME.git`).
