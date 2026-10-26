import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log('🧪 Iniciando verificación de componentes táctiles de videojuego...');

// 1. Verificar existencia y contenido de src/index.css
const cssPath = path.join(process.cwd(), 'src', 'index.css');
assert(fs.existsSync(cssPath), 'src/index.css existe');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

// Reglas de Botón Táctil 3D
assert(cssContent.includes('.kit-btn') || cssContent.includes('@utility kit-btn'), 'kit-btn definido');
assert(cssContent.includes('.kit-btn-content') || cssContent.includes('@utility kit-btn-content'), 'kit-btn-content definido');
assert(cssContent.includes('.kit-btn-label') || cssContent.includes('@utility kit-btn-label'), 'kit-btn-label definido');
assert(cssContent.includes('0 5px 0'), 'Sombra sólida inferior de 5px presente');
assert(cssContent.includes('translateY(5px)'), 'Desplazamiento translateY(5px) en :active presente');
assert(cssContent.includes('0 0 0'), 'Reducción de sombra vertical a cero en :active presente');
assert(
  cssContent.includes('kit-btn-content') && (cssContent.includes('translateY') || cssContent.includes('5px')),
  'Desplazamiento óptico de línea base para .kit-btn-content presente'
);
assert(
  cssContent.includes('var(--kit-btn-contour') || cssContent.includes('-webkit-text-stroke'),
  'Contorno oscuro complementario para texto blanco presente'
);

// Verificar que ningún contorno complementario sea negro puro #000000
const buttonContourMatches = cssContent.match(/--kit-btn-contour:\s*([^;]+);/g) || [];
assert(buttonContourMatches.length > 0, 'Variables de contorno complementario encontradas');
for (const match of buttonContourMatches) {
  assert(!match.includes('#000000') && !match.includes('#000;'), `Contorno no es negro puro: ${match}`);
}

// Reglas de Modales de Juego
assert(cssContent.includes('.kit-modal') || cssContent.includes('@utility kit-modal'), 'kit-modal definido');
assert(cssContent.includes('.kit-modal-header') || cssContent.includes('@utility kit-modal-header'), 'kit-modal-header definido');
assert(cssContent.includes('.kit-header-band') || cssContent.includes('@utility kit-header-band'), 'kit-header-band definido');
assert(cssContent.includes('.kit-close') || cssContent.includes('@utility kit-close'), 'kit-close definido');
assert(
  cssContent.includes('padding-left: 72px') && cssContent.includes('padding-right: 72px'),
  'Reservas laterales simétricas de 72px a izquierda y derecha (px-[72px]) presentes'
);
assert(
  cssContent.includes('position: absolute') && cssContent.includes('right: 1rem'),
  'Botón .kit-close anclado absoluto en esquina superior derecha'
);

// Reglas de Barras de Progreso
assert(cssContent.includes('.kit-progress') || cssContent.includes('@utility kit-progress'), 'kit-progress definido');
assert(cssContent.includes('height: 40px') && cssContent.includes('flex-shrink: 0'), 'Grosor fijo de 40px y flex-shrink: 0 presentes');
assert(cssContent.includes('height: 30px'), 'Variante compacta de 30px presente');
assert(
  cssContent.includes('rgba(255, 255, 255, 0.2') || cssContent.includes('rgba(255, 255, 255, 0.20)'),
  'Brillo especular superior blanco al 20% presente en relleno'
);
assert(
  cssContent.includes('inset 0 -3px 0') || cssContent.includes('linear-gradient(to bottom, transparent, rgba(0, 0, 0,'),
  'Bisel oscuro inferior para dar volumen cilíndrico presente'
);

// 2. Verificar existencia y exportaciones de los componentes React
const buttonTsxPath = path.join(process.cwd(), 'src', 'components', 'ui', 'KitButton.tsx');
assert(fs.existsSync(buttonTsxPath), 'src/components/ui/KitButton.tsx existe');
const buttonContent = fs.readFileSync(buttonTsxPath, 'utf-8');
assert(buttonContent.includes('kit-btn'), 'KitButton utiliza kit-btn');
assert(buttonContent.includes('kit-btn-content'), 'KitButton utiliza kit-btn-content');
assert(buttonContent.includes('kit-btn-label'), 'KitButton utiliza kit-btn-label');

const progressTsxPath = path.join(process.cwd(), 'src', 'components', 'ui', 'KitProgress.tsx');
assert(fs.existsSync(progressTsxPath), 'src/components/ui/KitProgress.tsx existe');
const progressContent = fs.readFileSync(progressTsxPath, 'utf-8');
assert(progressContent.includes('kit-progress'), 'KitProgress utiliza kit-progress');
assert(progressContent.includes('kit-progress-fill'), 'KitProgress utiliza kit-progress-fill');
assert(progressContent.includes('kit-progress-compact'), 'KitProgress soporta variante compacta');

const modalTsxPath = path.join(process.cwd(), 'src', 'components', 'ui', 'KitModal.tsx');
assert(fs.existsSync(modalTsxPath), 'src/components/ui/KitModal.tsx existe');
const modalContent = fs.readFileSync(modalTsxPath, 'utf-8');
assert(modalContent.includes('kit-modal'), 'KitModal utiliza kit-modal');
assert(modalContent.includes('kit-modal-header'), 'KitModal utiliza kit-modal-header');
assert(modalContent.includes('px-[72px]'), 'KitModal utiliza reservas laterales px-[72px]');
assert(modalContent.includes('kit-header-band'), 'KitModal utiliza kit-header-band');
assert(modalContent.includes('kit-close'), 'KitModal utiliza kit-close');

const indexPath = path.join(process.cwd(), 'src', 'components', 'ui', 'index.ts');
assert(fs.existsSync(indexPath), 'src/components/ui/index.ts existe');

console.log('🎉 Todas las pruebas de validación técnica de componentes táctiles pasaron exitosamente!');
