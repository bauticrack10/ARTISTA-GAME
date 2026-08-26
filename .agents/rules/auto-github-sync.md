---
name: auto-github-sync
description: Obligación de realizar build, commit y git push origin main automáticamente tras cualquier modificación de código.
trigger: always_on
---

# Protocolo Obligatorio de Sincronización Automática con GitHub

1. **Verificación Previa Obligatoria:**
   - Antes de realizar cualquier commit o subida, se debe ejecutar `npm run build` para asegurar que el proyecto compila sin errores TypeScript ni de empaquetado.

2. **Commit y Push Automático Inmediato:**
   - Una vez validado el build, se debe ejecutar inmediatamente:
     ```bash
     git add -A
     git commit -m "<tipo>(<alcance>): <descripción concisa del cambio en español>"
     git push origin main
     ```
   - No se debe esperar a que el usuario pida subir los cambios a GitHub; esto forma parte del cierre obligatorio de cada tarea técnica.

3. **Manejo de Tareas Asíncronas en Windows:**
   - Al ejecutar `git push`, si el comando se delega a segundo plano, se debe monitorizar su finalización con `manage_task` para confirmar la subida exitosa.
