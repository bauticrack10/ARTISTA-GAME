# Documento Maestro de Conocimiento y Arquitectura — El Artista

Este documento compila y preserva de forma permanente todas las especificaciones, reglas de diseño, sistemas de simulación, modelos de datos y directrices del proyecto **El Artista — Music Career Simulator**.

---

## 🏛️ 1. Arquitectura General y Motores de Simulación

El juego está desarrollado en **React 19 + TypeScript + Vite + TailwindCSS v4**, con un motor de simulación procedural determinista y desacoplado de la UI.

### 1.1 `GameEngine.ts` (Orquestador Central)
* **Ciclo Temporal:** Avance por semestres (6 meses) o años (12 meses) a través de `advanceCycle(months)`.
* **Estado:** Gestiona el estado atómico del jugador (`Artist`), el mundo (`WorldState`), la cola de eventos y galas de premios.
* **Libro Contable (Financial Ledger):** Registro detallado de cada ingreso y gasto categorizado (`streaming`, `production`, `marketing`, `tour`, `living_expenses`, `manager_fee`, `contract_bonus`, etc.).
* **Gestión de Catálogo:** Publicación atómica de singles y álbumes con deducción única de fondos y energía, previniendo duplicados concurrentes.

---

### 1.2 `AwardEngine.ts` (Sistema de Premios & Galas Anuales)
* **Gala Anual:** Se celebra en el Mes 12 de cada año.
* **Elegibilidad de Nuevos Artistas:** Mínimo 1 lanzamiento publicado, al menos 1.000 streams y $\ge 5$ de reputación. Si el jugador no ha publicado música, queda excluido de todas las candidaturas.
* **Distribución Homogénea:** Exactamente **4 nominados por categoría** en las 5 categorías oficiales.
* **Anti-Monopolio Estricto:** Máximo 1 nominación por artista en *Canción del Año*, *Álbum del Año*, *Artista del Año* y *Mejor Nuevo Artista*; máximo 2 candidaturas por artista/productor en *Mejor Producción*.
* **Desduplicación:** Algoritmo estricto que impide que dos artistas figuren con canciones de idéntico título en la misma gala.

---

### 1.3 `IndustryEngine.ts` (Escalera de Contratos y Representación)
* **Distribuidoras Digitales (0k - 5k oyentes / Día 1):**
  * *SoundDrop Free:* Cuota $0, 85% regalías artista / 15% comisión, 100% control de másters.
  * *DistroWave Pro:* Cuota anual $20, 100% regalías, 0% comisión.
  * *AmuseCloud Indie:* Cuota anual $35, 100% regalías, pitch editorial.
* **Sellos Independientes Locales (5k - 25k oyentes):**
  * *Callejón Records:* Anticipo de $2.000, 70% regalías, 85% control creativo.
  * *Bohemian Groove Local:* Anticipo de $5.000, 65% regalías, 80% control creativo.
* **Sellos Indies Consolidados (25k - 100k oyentes):** *Dale Play Records*, *Rimas Entertainment*, *XL Recordings*.
* **Majors Globales (100k+ oyentes):** *Sony Columbia*, *Universal Interscope*, *Warner Latina*.
* **Navegación Unificada:** Pestañas superiores en `IndustryView` (`Situación Actual`, `Distribución & Sellos`, `Radar de A&R`, `Mercado de Managers`, `Sello Propio`) sin botones redundantes dentro de las tarjetas individuales.

---

### 1.4 `RelationshipEngine.ts` (Relaciones, Acciones Sociales y Colaboraciones)
* **Métricas de Relación:** Afinidad (-100 a +100), Respeto Profesional (0 a 100), Estado (`neutral`, `respect`, `friend`, `collaborator`, `rival`, `feud`), Historial.
* **Elogios (Shoutouts):**
  * Cooldown de 3 meses por artista objetivo.
  * Rendimientos decrecientes: 1er elogio (+12 af, +10 resp, +8 hype), 2do (+6 af, +5 resp, +4 hype), 3er+ (+2 af, +1 resp, +1 hype).
  * Penalización si se elogia a un rival o feudo activo (mofa pública: -4 credibilidad, -5 disciplina).
* **Tiraderas (Diss Tracks):**
  * Cooldown de 6 meses hacia el mismo artista objetivo y 4 meses de cooldown global para el jugador en la escena.
  * Evaluación lírica (`skill * 0.4 + originality * 0.35 + credibility * 0.25` vs objetivo):
    * *Victoria Lírica:* +40 Hype, +15 Respeto, +5 Credibilidad, -50 Afinidad, activa estado `feud`/`rival`.
    * *Cruce Callejero / Empate:* +28 Hype, +5 Respeto, -35 Afinidad, activa `rival`.
    * *Tiro por la Culata:* -15 Reputación, -10 Credibilidad, +15 Hype meme, -40 Afinidad.
  * Bloqueo automático de colaboraciones con artistas en feudo o rivalidad activa.
* **Colaboraciones Musicales Reales:**
  * Formatos: Single con Feat, Canción de Álbum, EP Colaborativo, Álbum Colaborativo ("Oasis"-style), Mixtape Conjunta.
  * Créditos configurables: `player_feat_target`, `target_feat_player`, `player_and_target`, `player_x_target`.
  * Factores de Viabilidad (`calculateCollabFeasibility`):
    * **Proximidad Territorial:** +15 puntos por mismo país, +10 por misma región o idioma.
    * **Barreras de Superestrella:** Colaborar con Superestrellas o Leyendas (`careerStage === 'Superstar' | 'Legend'`) exige presupuesto acorde ($\ge \$35.000$) o tracción internacional para artistas underground.
    * **Cross-Fanbase:** Transferencia algorítmica de fans y bonos de química musical (5 a 25 pts) en calidad, originalidad y viralidad.

---

### 1.5 `EventEngine.ts` (Eventos Emergentes y Cadenas Narrativas)
* **17+ Arquetipos de Carrera:** Decisiones con dilemas reales de riesgo/recompensa para cada etapa (primer contrato, hit sorpresa, rechazo de major, demandas de sample, rivalidad pública, colaboraciones sorpresa, viralización, cancelación de giras, disputas de marca, cancelación mediática, giro de género, guerras de ofertas, rescisiones, burnout, escándalos en galas, sequía de popularidad, regresos legendarios y sequía creativa anual obligatoria).
* **Cadenas Narrativas Diferidas (`activeNarrativeChains`):** Consecuencias programadas a futuro (ej. resolución de demandas o giras de redención a 6 meses de plazo) con encolado prioritario.
* **Frecuencia Orgánica:** Probabilidad mensual de ~15% (promedio 1 evento semestral) y cooldowns de 18 a 36 meses, eliminando el spam forzado.
* **Presentación UI:** Badges de Nivel de Importancia (1 a 5 con animaciones temáticas), barra de Sistemas Afectados (Fondos, Energía, Hype, Fans, Contratos, Giras, Charts, Carrera) y advertencias de riesgo en opciones críticas.

---

### 1.6 `ChartEngine.ts` (Rankings Regionales Deterministas)
* **11 Regiones Oficiales:** `Global`, `Argentina`, `USA`, `LatinAmerica`, `Europe`, `Spain`, `Mexico`, `UK`, `Brazil`, `Asia`, `Africa`.
* **Ponderación Territorial:** Ventaja de rotación doméstica para artistas en sus países y regiones de origen.
* **Deduplicación Estricta:** Top 50 garantizado sin empates, sin posiciones duplicadas y sin saltos de ranking.

---

### 1.7 Base de Datos Global de Artistas (`src/data/artists/`)
* **Más de 100 Artistas Reales** estructurados en 6 módulos territoriales:
  * `latinAmerica.ts` (Argentina, México, Puerto Rico, Colombia, Chile, Uruguay, Rep. Dominicana).
  * `northAmerica.ts` (Estados Unidos, Canadá).
  * `europe.ts` (España, Reino Unido, Francia, Alemania, Italia, Países Bajos, Bélgica, Suecia, Noruega, Irlanda, Polonia, Rusia).
  * `asiaOceania.ts` (Corea del Sur, Japón, Australia, Nueva Zelanda, India, Filipinas, Indonesia, China).
  * `africaMiddleEast.ts` (Nigeria, Ghana, Sudáfrica, Marruecos, Egipto, Turquía).
  * `brazil.ts` (Brasil: Funk, MPB, Trap, Bossa Nova, Metal).
* **Generación Procedural Multicultural (`GLOBAL_COUNTRY_DATABASE`):** Genera nuevos talentos a lo largo de décadas en 38 países sin colisiones de nombres.

---

## 🎨 2. Sistema de Diseño e Interfaz (UI/UX)

* **Tema:** *Studio After Dark / Cyber-Music Studio*.
* **Paleta:**
  * Fondo Principal: Obsidian `#0B0C10`.
  * Tarjetas y Superficies: Slate Glass `#16181F`.
  * Bordes: `#2A2E3D` (subtles: `rgba(255, 255, 255, 0.08)`).
  * Acentos: Violeta `#8B5CF6`, Magenta `#EC4899`, Esmeralda `#10B981`, Cian `#06B6D4`, Ámbar `#F59E0B`.
* **Tipografía:** `'Camera Plain Variable'`, ui-sans-serif, system-ui.
* **Avatares:** Sistema 100% vectorial con gradientes temáticos (`avatarColor`), iconos Lucide (`avatarIcon`) e iniciales estilizadas (`ArtistAvatar.tsx`).
* **Resiliencia de Render:** [`ErrorBoundary.tsx`](file:///C:/Users/boong/.gemini/antigravity/scratch/el-artista/src/components/ErrorBoundary.tsx) envolviendo la raíz de la aplicación con diagnóstico y botón de auto-recuperación.

---

## 🤖 3. Reglas Obligatorias para Agentes de IA

1. **Despliegue Multi-Agente:** En cada prompt o tarea técnica, invocar y coordinar al equipo especializado:
   * *Systems Architect & Data Lead*
   * *UI/UX & Frontend Specialist*
   * *Backend & Simulation Engine Specialist*
   * *QA Tester & Auditor*
2. **Sincronización Automática con GitHub:** Tras cada cambio:
   * Ejecutar y aprobar tests (`npm run test:diversity; npm run test:events; npm run test:buttons; npm run test:social`).
   * Compilar en limpio (`npm run build`).
   * Realizar `git add -A`, `git commit` estructurado y `git push origin main`.
