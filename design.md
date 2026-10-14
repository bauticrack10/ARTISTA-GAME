# Design System — El Artista: "Analog Master & Editorial Press"

## 1. Dirección Visual y Atmósfera
La interfaz fusiona dos mundos reales de la industria musical:
1. **Ingeniería de Estudio y Hardware (Teenage Engineering / SSL / Ableton):** Superficies negro mate y grafito, bordes precisos de `1px`, indicadores tipo LED para estados críticos y lecturas numéricas monoespaciadas.
2. **Prensa Musical y Plataformas Pro (Pitchfork / Spotify for Artists / Billboard):** Titulares de alto impacto con tracking cerrado, tablas densas para los rankings (sin tarjetas redundantes) y reseñas con diseño editorial.

**Reglas de Oro Anti-IA:**
- **PROHIBIDO** usar el gradiente genérico violeta-a-rosa (`from-violet-600 to-pink-600`) en botones, fondos de tarjetas o barras de navegación.
- **PROHIBIDO** usar `rounded-full` (píldoras) para contenedores de métricas o botones rectangulares.
- **PROHIBIDO** usar sombras de neón difusas (`0 0 20px rgba(...)`). La jerarquía se construye por contraste de superficie y bordes nítidos de `1px`.
- **MÁXIMO 2 TIPOGRAFÍAS** en toda la aplicación: una Sans-Serif geométrica/humanista para UI y titulares, y una Monospace técnica para todos los datos numéricos.

---

## 2. Paleta de Colores (Sólida, Mate y de Alto Contraste)

| Rol | Nombre | Hex | Uso Estricto |
| :--- | :--- | :--- | :--- |
| **Fondo Base** | Studio Black | `#09090B` | Fondo global de la aplicación. |
| **Superficie Nivel 1** | Rack Matte | `#111114` | Paneles principales, tablas de charts, contenedores de vista. |
| **Superficie Nivel 2** | Module Surface | `#18181C` | Filas en hover, inputs, sub-paneles internos, tarjetas de catálogo. |
| **Borde Pasivo** | Hairline Slate | `#242429` | Divisorias de tablas, bordes de paneles (`1px solid`). |
| **Borde Activo** | Signal Border | `#3F3F46` | Estado focus/hover de módulos interactivos. |
| **Texto Primario** | Crisp Chalk | `#F4F4F6` | Titulares, nombres de artistas y canciones. |
| **Texto Secundario** | Muted Steel | `#8E8E99` | Descripciones, subtítulos, metadatos secundarios. |
| **Texto Técnico** | Dim Label | `#52525B` | Etiquetas en mayúsculas (ej. `PRESUPUESTO`, `SEMANAS EN CHART`). |
| **Acento Primario** | Signal Orange | `#FF4F00` | Acción principal ("Publicar Lanzamiento", "Avanzar Ciclo"), REC activo. |
| **Acento Éxito / $** | LED Emerald | `#00E599` | Fondos positivos, subida en charts (`▲`), energía alta, certificaciones. |
| **Acento Alerta** | Amber Peak | `#F59E0B` | Récords, premios, advertencias de fatiga media, Metacritic medio. |
| **Acento Peligro** | Clipping Red | `#EF4444` | Beefs/Tiraderas, caída en charts (`▼`), energía crítica (<15%), deudas. |

---

## 3. Sistema Tipográfico ( Regla de 2 Fuentes)

1. **Fuente Principal (UI & Editorial):** `'Inter'` o `'Plus Jakarta Sans'` (con fallback `system-ui, sans-serif`).
   - **Hero / Nombre del Artista:** `36px` a `52px`, `font-weight: 800`, `letter-spacing: -0.04em`, `line-height: 1.0`.
   - **Títulos de Sección:** `22px` a `28px`, `font-weight: 700`, `letter-spacing: -0.025em`.
   - **Cuerpo y Narrativa de Eventos:** `15px`, `font-weight: 400`, `line-height: 1.6`, color `#D4D4D8`.
2. **Fuente Técnica (Datos, Finanzas, Tiempo y Rankings):** `'JetBrains Mono'` (con fallback `ui-monospace, monospace`).
   - **Obligatorio:** `font-variant-numeric: tabular-nums` en todas las cifras.
   - **Uso:** Dinero (`$150.000`), oyentes mensuales, streams, puestos del chart (`#01`), fechas (`2026 // MES 07`), porcentajes de energía y regalías.

---

## 4. Arquitectura de Componentes

### 4.1 Navbar (Top Studio Rack)
- Barra superior fija de `56px` de altura con fondo `#09090B` y borde inferior `1px solid #242429`.
- **Métricas en Celdas Técnicas (No Píldoras):** Celdas contiguas separadas por `border-r border-[#242429]`, cada una con label superior de `10px uppercase tracking-widest text-[#52525B]` y valor inferior en `font-mono text-sm font-bold`.
- **Botones de Avance Temporal (`+6M` / `+1Y`):** Estilo interruptor de hardware (`bg-[#FF4F00] text-white font-mono font-bold rounded-[4px] px-3 py-1.5 hover:bg-[#E04500] active:translate-y-[1px]`).

### 4.2 Botones
- **Primario (Acción Crítica):** Fondo `#F4F4F6`, texto `#09090B`, `font-weight: 600`, `border-radius: 4px`, borde superior sutil. En acciones de grabación/lanzamiento: fondo `#FF4F00`, texto `#FFFFFF`.
- **Secundario (Técnico):** Fondo `#18181C`, texto `#F4F4F6`, borde `1px solid #2E2E36`, `border-radius: 4px`, hover `#242429`.
- **Peligro (Tiradera / Rescindir):** Fondo `#1F1215`, texto `#EF4444`, borde `1px solid #451A20`.

### 4.3 Tablas de Charts y Catálogo
- Cero tarjetas flotantes para listas de canciones.
- Filas compactas (`h-12`) con `border-b border-[#1C1C21]`, cambio de fondo en hover (`#141418`).
- Columnas alineadas: `# Posición (w-12 font-mono)` | `Delta (▲/▼ w-10 font-mono)` | ` Mini-Tapa (32x32px) + Título y Créditos` | `Streams Mensuales (font-mono text-right)` | `Peak / Semanas (font-mono text-right)`.

### 4.4 Arte de Tapa Procedural (Discos y Singles)
- Contenedor cuadrado (`aspect-square`) con `rounded-[4px]`, borde interno `1px solid rgba(255,255,255,0.12)`, textura de grano superpuesta, tipografía del título impresa dentro de la portada y micro-sello discográfico en la esquina inferior.