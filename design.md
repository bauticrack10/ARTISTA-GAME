# Design System — El Artista: "Analog Studio & Vinyl Press"

## 1. Dirección Visual y Atmósfera
Inspirado directamente en:
* **Consolas de grabación analógicas y hardware de estudio (Teenage Engineering / Dieter Rams / SSL / Neve):** Superficies negro vinilo profundo `#0B0B0C`, módulos de rack de audio `#141417`, bordes precisos de `1px solid #26262B`, acento REC Red `#FF2A4B` e indicadores ámbar tipo VU-Meter `#F59E0B`.
* **Sellos discográficos icónicos (Def Jam, XL Recordings, Sub Pop, Factory Records):** Tipografía con personalidad cruda, pegatinas "Hype Sticker" en crema editorial `#F4F0EA` sobre negro, y contraste editorial contundente.
* **Prensa musical especializada (Billboard, Pitchfork, Rolling Stone):** Tablas densas, jerarquía tipográfica sin tarjetas infladas, titulares audaces y lectura técnica fluida.

---

## 2. Prohibiciones Visuales Estrictas (Cero "AI Slop")
* **PROHIBIDO** usar tipografías genéricas de IA: Cero Inter, Roboto, Open Sans, Segoe UI, Arial o system-ui como fuentes de titulares o identidad.
* **PROHIBIDO** usar gradientes de IA: Ningún fondo, botón o texto con degradados violeta/morado/fucsia (`from-purple-500 to-indigo-600`), sombras de neón difusas ni `backdrop-blur` genérico sin justificación física.
* **PROHIBIDO** usar emojis de sistema como iconos principales (🎵, 🔥, 💰, 📈): Toda la iconografía debe ser vectorial limpia y consistente (`lucide-react` con `strokeWidth={1.75}`).
* **PROHIBIDO** usar contenedores tipo píldora (`rounded-full`) para bloques de métricas, formularios o botones rectangulares. El radio de control estándar es `rounded-[4px]` y de paneles `rounded-[6px]`.

---

## 3. Sistema Tipográfico con Carácter Real (3 Niveles)

| Nivel | Rol / Uso | Fuente | Propiedades |
| :--- | :--- | :--- | :--- |
| **`--font-display`** | Titulares, Nombre de Artista, Secciones, Portadas de Discos y Festivales | `'Syne'` (pesos 700 y 800) | `letter-spacing: -0.035em`, fuerza de póster y portada de vinilo. |
| **`--font-sans`** | Cuerpo de texto, narrativa de eventos, descripciones y navegación | `'Plus Jakarta Sans'` (pesos 400, 500, 600, 700) | Lectura editorial impecable, gran legibilidad en pantallas oscuras. |
| **Cifras** | Streams, dinero, puestos de chart, fechas y duraciones | `'Plus Jakarta Sans'` (misma sans del cuerpo) | `tabular-nums` para alinear columnas. **Prohibido usar tipografías monoespaciadas** (JetBrains Mono, Courier, etc.) en cualquier parte de la interfaz. |

---

## 4. Paleta de Colores "Analog Studio & Vinyl Press"

| Rol | Token / Nombre | Hex | Uso Estricto |
| :--- | :--- | :--- | :--- |
| **Fondo Principal** | `--bg-studio` | `#0B0B0C` | Negro vinilo profundo, cálido, no azulado. |
| **Paneles / Módulos** | `--bg-console` | `#141417` | Paneles de control, tablas de rankings, contenedores de vista. |
| **Superficie Activa** | `--bg-editorial` | `#1C1C21` | Tarjetas activas, filas en hover, inputs técnicos. |
| **Papel Hype Sticker** | `--bg-editorial-paper` | `#F4F0EA` | Etiquetas de alto contraste con texto oscuro `#0B0B0C`. |
| **Borde Pasivo Rack** | `--color-line` | `#26262B` | Bordes nítidos de `1px solid` en todos los módulos de hardware. |
| **Borde Activo** | `--color-line-active`| `#3F3F46` | Estado hover/focus de controles. |
| **Texto Primario** | Bone White / Crema | `#F4F0EA` | Titulares, nombres de canciones y lectura principal. |
| **Texto Secundario** | Muted Steel | `#8E8E99` | Descripciones, subtítulos, metadatos. |
| **Texto Técnico** | Dim Studio Label | `#52525B` | Etiquetas técnicas en mayúsculas (`font-sans text-2xs`). |
| **Acento Primario (REC)** | REC Red | `#FF2A4B` | Botón de grabación, acción principal, indicador On-Air. |
| **Acento Secundario** | VU-Meter Amber | `#F59E0B` | Récords, energía media, avisos de producción. |
| **Éxito / Subida** | Console Green | `#10B981` | Fondos positivos, subida en charts (`▲`), streaming activo. |
| **Peligro / Clipping** | Clipping Red | `#EF4444` | Tiraderas, feudos, caída en charts (`▼`), agotamiento (<15%). |

### 4.1 Certificaciones Oficiales de la Industria
* **Disco de Oro:** `#D4AF37`
* **Disco de Platino:** `#E2E8F0` (con brillo metálico nítido)
* **Disco de Diamante:** `#38BDF8`

---

## 5. Textura y Físicalidad Analógica
* **Capa Global de Grano Analógico:** Capa fija de ruido SVG matemático (`opacity: 0.025`, `pointer-events: none`) que elimina la esterilidad digital y otorga tacto físico de vinilo y papel de prensa.