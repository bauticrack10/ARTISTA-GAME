import fs from 'fs';
import { execSync } from 'child_process';

const commitMsg = `fix(ui-sliders): mejorar contraste de track, marcas min/max y layout responsive en sliders de presupuesto

- Modificaciones:
  1. Alto contraste en track de sliders (index.css & StudioView.tsx): se aplicó fondo 'bg-slate-800' (#1e293b) con borde sutil 'border-[#3E4556]' y compatibilidad cross-browser para '-webkit-slider-runnable-track' y '-moz-range-track'.
  2. Marcas numéricas legibles: se añadieron indicadores de valor mínimo, intermedio y máximo ($0 / $12.500 / $25.000 en singles, $3.000 / $30.000 / $60.000 en álbumes, $0 / $15.000 / $30.000 en colaboraciones).
  3. Prevención de colapso en resoluciones intermedias: contenedores actualizados con 'grid-cols-1 sm:grid-cols-2 w-full min-w-0 flex-1' para garantizar un ancho fluido en tablets y mobile.
  4. Suite de pruebas automatizada 'test-range-sliders-contrast-and-labels.ts' con 14/14 pruebas superadas.
- Componentes/Sistemas: src/index.css, src/components/StudioView.tsx, src/components/CollaborationModal.tsx, test-range-sliders-contrast-and-labels.ts.
- Contexto para Agentes IA: Resuelve problemas de visibilidad de la barra de fondo del input range en fondos oscuros y previene overflow o distorsión visual en pantallas intermedias.`;

fs.writeFileSync('commit_msg.txt', commitMsg, 'utf8');
execSync('git add -A', { stdio: 'inherit' });
execSync('git commit -F commit_msg.txt', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
fs.unlinkSync('commit_msg.txt');
fs.unlinkSync('git-commit-helper.ts');
