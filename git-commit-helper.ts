import fs from 'fs';
import { execSync } from 'child_process';

const commitMsg = `fix(typography-regions): normalizar nombres de regiones a espanol uniforme y sanitizar tipografia en toda la UI

- Modificaciones:
  1. Normalizacion canonica de nombres de regiones en charts y UI a espanol uniforme en formatters.ts (MUSIC_REGION_CONFIG, formatMusicRegion, formatMusicRegionLabel, formatChartMilestoneHeadline, formatChartMilestoneBody):
     - 'Global' -> 'Mundial' ('Mundial Top 50')
     - 'LatinAmerica' -> 'Latinoamerica' ('Latinoamerica')
     - 'Spain' -> 'Espana' ('Espana')
     - 'Europe' -> 'Europa' ('Europa')
     - 'USA' -> 'EE. UU.' ('EE. UU.')
     - 'Argentina' -> 'Argentina' ('Argentina')
     - 'Mexico' -> 'Mexico' ('Mexico')
  2. Generacion de titulares y cuerpos de noticias de hito #1 en charts en espanol (¡#1 a Nivel Mundial!, ¡#1 en Latinoamerica!, ¡#1 en EE. UU.!, etc.).
  3. Sanitizacion y limpieza tipografica en sanitizeString, formatCityCountry, cleanQuotes y cleanParentheses:
     - Eliminacion de espacios antes de comas y signos de puntuacion ('Buenos Aires , Argentina' -> 'Buenos Aires, Argentina').
     - Normalizacion de parentesis con espacios o modificadores ('(+6M )' -> '(+6M)', 'Ver Catalogo Completo (2 )' -> 'Ver Catalogo Completo (2)').
     - Limpieza de artefactos de comillas con asteriscos huerfanos ('"Bruno Romero" *"*' -> '"Bruno Romero"').
  4. Actualizacion de componentes de UI (ChartsView.tsx, CareerErasView.tsx, ArtistHeroCard.tsx, CharacterCreatorView.tsx).
- Componentes/Sistemas: src/utils/formatters.ts, src/systems/ChartEngine.ts, src/components/ChartsView.tsx, src/components/CareerErasView.tsx, src/components/ArtistHeroCard.tsx, src/components/CharacterCreatorView.tsx, test-string-sanitization-and-regions.ts.
- Contexto para Agentes IA: Estandariza la internacionalizacion a espanol en toda la capa de presentacion sin romper los IDs internos del modelo ni el guardado de partidas. Resuelve todas las anomalias de espaciado y puntuacion en templates de texto.`;

fs.writeFileSync('commit_msg.txt', commitMsg, 'utf8');

console.log('Running git add...');
execSync('git add -A', { stdio: 'inherit' });

console.log('Running git commit...');
execSync('git commit -F commit_msg.txt', { stdio: 'inherit' });

console.log('Running git push...');
execSync('git push origin main', { stdio: 'inherit' });

if (fs.existsSync('commit_msg.txt')) fs.unlinkSync('commit_msg.txt');
if (fs.existsSync('git-commit-helper.ts')) fs.unlinkSync('git-commit-helper.ts');

console.log('Git commit and push completed successfully!');

