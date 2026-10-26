import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log('🧪 Iniciando verificación de componentes Minimalist Dopamine Glass...');

// 1. Verificar existencia y exportación de MagneticPrimaryButton
const magneticPath = path.join(process.cwd(), 'src', 'components', 'ui', 'MagneticPrimaryButton.tsx');
assert(fs.existsSync(magneticPath), 'src/components/ui/MagneticPrimaryButton.tsx existe');
const magneticContent = fs.readFileSync(magneticPath, 'utf-8');
assert(magneticContent.includes('export const MagneticPrimaryButton'), 'MagneticPrimaryButton está exportado');
assert(magneticContent.includes('game-btn-primary'), 'MagneticPrimaryButton utiliza game-btn-primary');
assert(magneticContent.includes('magneticPull'), 'MagneticPrimaryButton soporta magneticPull');
assert(magneticContent.includes('prefers-reduced-motion'), 'MagneticPrimaryButton respeta prefers-reduced-motion');
assert(magneticContent.includes('translate3d'), 'MagneticPrimaryButton aplica transform translate3d');

// 2. Verificar existencia y exportación de GlassInput
const glassInputPath = path.join(process.cwd(), 'src', 'components', 'ui', 'GlassInput.tsx');
assert(fs.existsSync(glassInputPath), 'src/components/ui/GlassInput.tsx existe');
const glassInputContent = fs.readFileSync(glassInputPath, 'utf-8');
assert(glassInputContent.includes('export const GlassInput'), 'GlassInput está exportado');
assert(glassInputContent.includes('backdrop-blur-md'), 'GlassInput incluye backdrop-blur-md');
assert(glassInputContent.includes('border-white/10'), 'GlassInput incluye border-white/10');
assert(glassInputContent.includes('focus:border-white/30'), 'GlassInput incluye iluminación focus:border-white/30');

// 3. Verificar existencia y exportación de GlassOptionButton
const glassOptionPath = path.join(process.cwd(), 'src', 'components', 'ui', 'GlassOptionButton.tsx');
assert(fs.existsSync(glassOptionPath), 'src/components/ui/GlassOptionButton.tsx existe');
const glassOptionContent = fs.readFileSync(glassOptionPath, 'utf-8');
assert(glassOptionContent.includes('export const GlassOptionButton'), 'GlassOptionButton está exportado');
assert(glassOptionContent.includes('backdrop-blur-md'), 'GlassOptionButton incluye backdrop-blur-md');
assert(glassOptionContent.includes('border-white/10'), 'GlassOptionButton incluye border-white/10');
assert(glassOptionContent.includes('hover:border-white/30'), 'GlassOptionButton incluye hover:border-white/30');

// 4. Verificar existencia y exportación de GlassCard
const glassCardPath = path.join(process.cwd(), 'src', 'components', 'ui', 'GlassCard.tsx');
assert(fs.existsSync(glassCardPath), 'src/components/ui/GlassCard.tsx existe');
const glassCardContent = fs.readFileSync(glassCardPath, 'utf-8');
assert(glassCardContent.includes('export const GlassCard'), 'GlassCard está exportado');
assert(glassCardContent.includes('card-success-pulse'), 'GlassCard soporta card-success-pulse');
assert(glassCardContent.includes('card-error-shake'), 'GlassCard soporta card-error-shake');
assert(glassCardContent.includes('triggerSuccess'), 'GlassCard expone método imperativo triggerSuccess');
assert(glassCardContent.includes('triggerError'), 'GlassCard expone método imperativo triggerError');

// 5. Verificar KitProgress actualizado
const progressPath = path.join(process.cwd(), 'src', 'components', 'ui', 'KitProgress.tsx');
const progressContent = fs.readFileSync(progressPath, 'utf-8');
assert(progressContent.includes('shadow-[0_0_8px_#00E599]'), 'KitProgress incluye sparkle dot con shadow-[0_0_8px_#00E599]');
assert(progressContent.includes('h-2.5') || progressContent.includes('h-3'), 'KitProgress carril ultrafino');

// 6. Verificar índice src/components/ui/index.ts
const indexPath = path.join(process.cwd(), 'src', 'components', 'ui', 'index.ts');
const indexContent = fs.readFileSync(indexPath, 'utf-8');
assert(indexContent.includes('MagneticPrimaryButton'), 'index.ts re-exporta MagneticPrimaryButton');
assert(indexContent.includes('GlassInput'), 'index.ts re-exporta GlassInput');
assert(indexContent.includes('GlassOptionButton'), 'index.ts re-exporta GlassOptionButton');
assert(indexContent.includes('GlassCard'), 'index.ts re-exporta GlassCard');

// 7. Verificar integración en componentes principales
const startScreenContent = fs.readFileSync(path.join(process.cwd(), 'src', 'components', 'StartScreen.tsx'), 'utf-8');
assert(startScreenContent.includes('MagneticPrimaryButton'), 'StartScreen integra MagneticPrimaryButton');
assert(startScreenContent.includes('btn-start-new-career'), 'StartScreen preserva ID btn-start-new-career');

const releaseModalContent = fs.readFileSync(path.join(process.cwd(), 'src', 'components', 'ReleaseConfirmationModal.tsx'), 'utf-8');
assert(releaseModalContent.includes('MagneticPrimaryButton'), 'ReleaseConfirmationModal integra MagneticPrimaryButton');
assert(releaseModalContent.includes('btn-confirm-release'), 'ReleaseConfirmationModal tiene ID btn-confirm-release');

const eventModalContent = fs.readFileSync(path.join(process.cwd(), 'src', 'components', 'EventModal.tsx'), 'utf-8');
assert(eventModalContent.includes('MagneticPrimaryButton'), 'EventModal integra MagneticPrimaryButton');

const navbarContent = fs.readFileSync(path.join(process.cwd(), 'src', 'components', 'Navbar.tsx'), 'utf-8');
assert(navbarContent.includes('MagneticPrimaryButton'), 'Navbar integra MagneticPrimaryButton');
assert(navbarContent.includes('btn-advance-cycle'), 'Navbar preserva ID btn-advance-cycle');

const decisionHubContent = fs.readFileSync(path.join(process.cwd(), 'src', 'components', 'DecisionHub.tsx'), 'utf-8');
assert(decisionHubContent.includes('GlassCard'), 'DecisionHub integra GlassCard');
assert(decisionHubContent.includes('MagneticPrimaryButton'), 'DecisionHub integra MagneticPrimaryButton');
assert(decisionHubContent.includes('btn-confirm-decision'), 'DecisionHub tiene ID btn-confirm-decision');

console.log('🎉 Todas las verificaciones del sistema Minimalist Dopamine Glass pasaron al 100%!');
