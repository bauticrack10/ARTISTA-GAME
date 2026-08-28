import fs from 'fs';
import { execSync } from 'child_process';

const commitMsg = `fix(lifestyle-ui): ampliar padding inferior en catalogo de tienda y fijar altura de botones de compra

- Modificaciones:
  1. Contenedor principal de tienda ('LifestyleShopView.tsx'): se amplió el padding inferior a 'pb-24 sm:pb-28 lg:pb-32' y se aplicó 'pb-16' a la grilla de productos para evitar solapamientos o recortes al hacer scroll.
  2. Botones de acción en footers de tarjetas ('[Comprar Mejora]', '[Fondos Insuficientes]', '[Adquirido ✓]'):
     - Altura fija estandarizada: 'h-10 min-h-[40px]'.
     - Contención y anti-aplastamiento: 'shrink-0 whitespace-nowrap flex items-center justify-center' y 'min-w-0 flex-1' en el bloque de precios.
  3. Suite de pruebas automatizada 'test-shop-grid-padding-and-button-height.ts' con 7/7 pruebas superadas.
- Componentes/Sistemas: src/components/LifestyleShopView.tsx, test-shop-grid-padding-and-button-height.ts.
- Contexto para Agentes IA: Elimina deformaciones visuales y aplastamiento de botones en pantallas medianas o con textos de mantenimiento extensos.`;

fs.writeFileSync('commit_msg.txt', commitMsg, 'utf8');
execSync('git add -A', { stdio: 'inherit' });
execSync('git commit -F commit_msg.txt', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
fs.unlinkSync('commit_msg.txt');
fs.unlinkSync('git-commit-helper.ts');
