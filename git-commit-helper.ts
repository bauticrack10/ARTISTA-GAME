import fs from 'fs';
import { execSync } from 'child_process';

const commitMsg = `feat(wellness): agregar validacion condicional de fondos insuficientes en boton de descanso

- Modificaciones:
  1. Validacion condicional en la tarjeta de Descanso & Bienestar (DecisionHub.tsx): si los Fondos del jugador son inferiores a $400 (ej. $140), el boton 'Tomar Retiro de Descanso' se deshabilita con disabled, opacity-50 y cursor-not-allowed.
  2. Tooltip contextual dinamico explicativo en el atributo title: 'Fondos insuficientes ($X / $400)' cuando el saldo es menor al costo del retiro, y 'Energia al maximo (100 / 100)' si la vitalidad ya esta en el tope.
  3. Consistencia visual con el patron de 'Gira Bloqueada': borde lateral condicional (border-l-[#10B981] vs border-l-rose-500/80), badge superior reactivo y bloque de desglose de costo con icono AlertTriangle y texto de saldo insuficiente.
  4. Suite de pruebas automatizada test-wellness-rest-validation.ts con 8/8 pruebas superadas.
- Componentes/Sistemas: src/components/DecisionHub.tsx, test-wellness-rest-validation.ts.
- Contexto para Agentes IA: Previene que el jugador active el retiro de relax sin el saldo monetario requerido, unificando la experiencia UX con las compuertas de progreso del juego.`;

fs.writeFileSync('commit_msg.txt', commitMsg, 'utf8');
execSync('git add -A', { stdio: 'inherit' });
execSync('git commit -F commit_msg.txt', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
fs.unlinkSync('commit_msg.txt');
fs.unlinkSync('git-commit-helper.ts');
