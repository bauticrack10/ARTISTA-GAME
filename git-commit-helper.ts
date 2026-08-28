import fs from 'fs';
import { execSync } from 'child_process';

const commitMsg = `fix(typography-buffs): limpiar espacios en templates dinamicos y corregir formato de mitigacion de gira a 0%

- Modificaciones:
  1. Sanitización de templates dinámicos y concatenaciones:
     - Eliminación de espacio anómalo entre símbolo de moneda y monto ('Con saldo actual de $140').
     - Normalización de conteos en paréntesis: '(0 activos)', '(0 ADQUIRIDOS)'.
     - Eliminación de espacios en sufijos y modificadores: '+0/mes', '+0 Calidad'.
  2. Corrección lógica del formato de buffs:
     - En 'LifestyleShopView.tsx', 'Mitigación de Gira' renderiza '0% Fatiga' en lugar de '-0% Fatiga' cuando el valor acumulado es 0.
     - Incorporación del helper 'formatTourFatigueBuff', 'formatQualityBuff' y 'formatPassiveEnergyBuff' en 'src/utils/formatters.ts'.
  3. Suite de pruebas automatizada 'test-buffs-and-string-concatenation.ts' con 16/16 pruebas superadas.
- Componentes/Sistemas: src/utils/formatters.ts, src/components/LifestyleShopView.tsx, test-buffs-and-string-concatenation.ts.
- Contexto para Agentes IA: Estandariza la visualización de buffs pasivos de estilo de vida y previene distorsiones tipográficas producidas por interpolación JSX con espacios huérfanos.`;

fs.writeFileSync('commit_msg.txt', commitMsg, 'utf8');
execSync('git add -A', { stdio: 'inherit' });
execSync('git commit -F commit_msg.txt', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
fs.unlinkSync('commit_msg.txt');
fs.unlinkSync('git-commit-helper.ts');
