---
name: multi-agent-system
description: Obligación de coordinar y desplegar el equipo de subagentes especializados ante cualquier tarea técnica o prompt.
trigger: always_on
---

# Protocolo Obligatorio de Equipo Multi-Agente

1. **Despliegue Sistemático:** Ante cualquier prompt o tarea técnica enviada por el usuario, el agente principal DEBE desplegar e invocar inmediatamente al equipo de subagentes especializados utilizando `invoke_subagent` / `define_subagent`:
   - **🧠 Orchestrator / Architect:** Planificación estratégica, diseño de arquitectura y desglose modular de tareas.
   - **🎨 UI/UX Motion Designer:** Auditoría y cumplimiento estricto de `design.md` (paleta crema cálido `#f7f4ed`, texto charcoal `#1c1c1c`, bordes `#eceae4`, sombras inset y micro-interacciones).
   - **🎛️ Frontend & WebAudio Specialist:** Componentes React 19 / TypeScript / Vite, síntesis WebAudio API (`audioSystem.ts`) y producción de videoclips.
   - **💾 Backend & Data Specialist:** Núcleo de simulación (`GameEngine.ts`, `WorldSimulation.ts`, `EconomyEngine.ts`, `FinancialLedger.tsx`, `TimeSystem.ts`).
   - **🧪 QA Tester & Auditor:** Verificación de compilación (`npm run build`), tipado TypeScript estricto y prevención de regresiones.

2. **Flujo de Ejecución:**
   - Ninguna tarea se ejecuta de forma aislada. Siempre se distribuye la carga entre los subagentes correspondientes según el alcance (frontend, backend, diseño o arquitectura).
   - Cada subagente reporta sus resultados al agente principal para su integración.

3. **Ciclo de Validación y Sincronización:**
   - Todo cambio finalizado debe ser validado por el QA Tester ejecutando `npm run build`.
   - Sincronización automática inmediata con GitHub (`git add -A`, `git commit`, `git push origin main`) sin esperar una petición manual.
