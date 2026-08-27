---
name: auto-github-sync
description: Obligación de realizar build, commit estructurado para agentes IA y git push origin main automáticamente tras cualquier modificación de código.
trigger: always_on
---

# Protocolo Obligatorio de Sincronización Automática con GitHub

1. **Verificación Previa Obligatoria:**
   - Antes de realizar cualquier commit o subida, se debe ejecutar `npm run build` para asegurar que el proyecto compila sin errores TypeScript ni de empaquetado.

2. **Commit Estructurado y Detallado para Agentes IA y Colaboradores:**
   - El mensaje del commit debe ser explícito, técnico y estructurado para que cualquier agente de IA (como Antigravity u otros) o colaborador entienda exactamente qué cambió, por qué y en qué subsistemas:
     ```bash
     git add -A
     git commit -m "<tipo>(<alcance>): <título conciso en español>

     - Modificaciones: <detalle punto por punto de qué se implementó o corrigió>
     - Componentes/Sistemas: <archivos, módulos, tipos o hooks modificados>
     - Contexto para Agentes IA: <lógica interna, decisiones técnicas o dependencias clave>"
     git push origin main
     ```
   - No se deben usar mensajes genéricos ni de una sola línea cuando haya cambios lógicos o arquitectónicos relevantes.

3. **Manejo de Tareas Asíncronas en Windows:**
   - Al ejecutar `git push`, si el comando se delega a segundo plano, se debe monitorizar su finalización con `manage_task` para confirmar la subida exitosa.
