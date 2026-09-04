import { MusicRegion } from '../types';

/**
 * Utilities for String Formatting, Typography Sanitation, Regional Names and Financial Values
 */

/**
 * Sanitiza una cadena eliminando espacios parásitos antes de signos de puntuación,
 * dentro de paréntesis, comillas, asteriscos huérfanos y barras.
 */
export function sanitizeString(text: string): string {
  if (!text) return '';

  return text
    // Elimina espacios parásitos antes de signos de puntuación: "Buenos Aires , Argentina" -> "Buenos Aires, Argentina"
    .replace(/\s+([,;:.!?])/g, '$1')
    // Normaliza fracciones y ratios en paréntesis: "( 80 /100)" o "( 80 / 100 )" -> "(80/100)"
    .replace(/\(\s*([0-9]+)\s*\/\s*([0-9]+)\s*\)/g, '($1/$2)')
    // Normaliza conteos y estados en paréntesis: "( 0 activos)" -> "(0 activos)", "( 0 ADQUIRIDOS)" -> "(0 ADQUIRIDOS)"
    .replace(/\(\s*([0-9]+)\s+([A-Za-z]+)\s*\)/g, '($1 $2)')
    // Elimina espacios redundantes dentro de paréntesis: "( 15 )" -> "(15)", "(2 )" -> "(2)", "(+6M )" -> "(+6M)", "( TRAP LATINO )" -> "(TRAP LATINO)"
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    // Elimina espacios redundantes dentro de corchetes: "[ 01 ]" -> "[01]"
    .replace(/\[\s+/g, '[')
    .replace(/\s+\]/g, ']')
    // Normaliza signos de avance o modificadores: "(+ 1Y )" -> "(+1Y)", "(+ 6M )" -> "(+6M)", "(+6M )" -> "(+6M)"
    .replace(/\(\s*\+\s*([0-9]+[A-Za-z]+)\s*\)/g, '(+$1)')
    // Normaliza meses con números: "(MES 1 )" -> "(Mes 1)", "( MES 12)" -> "(Mes 12)"
    .replace(/\(\s*MES\s*([0-9]+)\s*\)/gi, '(Mes $1)')
    // Elimina paréntesis anidados o duplicados: "((texto))" -> "(texto)"
    .replace(/\(\s*\(([^()]+)\)\s*\)/g, '($1)')
    // Elimina paréntesis vacíos: "()" -> ""
    .replace(/\(\s*\)/g, '')
    // Elimina paréntesis con mes redundante junto a un mes en texto: "Enero 2026 (Mes 1)" -> "Enero 2026"
    .replace(/\b(Enero|Febrero|Marzo|Abril|Mayo|Junio|Julio|Agosto|Septiembre|Octubre|Noviembre|Diciembre)(?:\s+[0-9]{4})?\s*\(\s*(?:Mes|M)\s*[0-9]+\s*\)/gi, (match) => {
      return match.replace(/\s*\(\s*(?:Mes|M)\s*[0-9]+\s*\)/gi, '');
    })
    // Limpia comillas con asteriscos o artefactos mal escapados: '"Bruno Romero" *"*' -> '"Bruno Romero"'
    .replace(/\s+\*"\*\s*$/g, '')
    .replace(/\s*\*\s*"\s*\*\s*/g, '')
    .replace(/^\s*\*\s*"\s*/g, '"')
    .replace(/\s*"\s*\*\s*$/g, '"')
    .replace(/"\s*\*\s*"/g, '"')
    .replace(/\*\s*"\s*\*/g, '')
    .replace(/\s*\*+\s*$/g, '')
    // Normaliza comillas con espacios parásitos: '" Cielo "' -> '"Cielo"'
    .replace(/"\s+([^"]*?)\s+"/g, '"$1"')
    // Evita duplicación de signos de moneda: "$ $0" o "$$0" -> "$0"
    .replace(/\$\s*\$+/g, '$')
    // Elimina espacios entre signo de dólar y número: "$ 140" -> "$140"
    .replace(/\$\s+([0-9]+)/g, '$$$1')
    // Normaliza sufijos por mes: "+ 0 / mes" -> "+0/mes", "/ mes" -> "/mes"
    .replace(/\s*\/\s*mes\b/gi, '/mes')
    // Normaliza signos más con espacios antes de números: "+ 0 Calidad" -> "+0 Calidad", "+ 0" -> "+0"
    .replace(/\+\s+([0-9]+)/g, '+$1')
    // Normaliza barras oblicuas en conteos: "1 /3" o "1 / 3" -> "1/3"
    .replace(/\s*\/\s*/g, '/')
    // Limpia espacios duplicados consecutivos
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

/**
 * Formatea el buff de mitigación de fatiga de gira.
 * Si el porcentaje es 0, retorna "0% Fatiga".
 * Si es > 0, retorna "-X% Fatiga".
 */
export function formatTourFatigueBuff(reduction: number): string {
  const pct = Math.round(reduction * 100);
  if (pct <= 0) return '0% Fatiga';
  return `-${pct}% Fatiga`;
}

/**
 * Formatea el buff de calidad.
 * Ejemplo: formatQualityBuff(0) -> "+0 Calidad", formatQualityBuff(5) -> "+5 Calidad"
 */
export function formatQualityBuff(qualityBonus: number): string {
  return `+${qualityBonus} Calidad`;
}

/**
 * Formatea el buff de energía pasiva mensual.
 * Ejemplo: formatPassiveEnergyBuff(0) -> "+0/mes", formatPassiveEnergyBuff(3) -> "+3/mes"
 */
export function formatPassiveEnergyBuff(energyPerMonth: number): string {
  return `+${energyPerMonth}/mes`;
}

/**
 * Formatea de forma segura Ciudad y País sin espacios huérfanos antes de la coma.
 * Ejemplo: formatCityCountry('Buenos Aires ', ' Argentina') -> "Buenos Aires, Argentina"
 */
export function formatCityCountry(city?: string, country?: string): string {
  const c = city?.replace(/\s+,/g, ',').trim() || '';
  const k = country?.trim() || '';
  if (c && k) return `${c}, ${k}`;
  return c || k || '';
}

/**
 * Formatea un conteo con total y sufijo opcional de forma limpia
 * Ejemplo: cleanCountTag(1, 3, 'seleccionados') -> "1/3 seleccionados"
 */
export function cleanCountTag(count: number, total: number, suffix?: string): string {
  const base = `${count}/${total}`;
  return suffix ? `${base} ${suffix}`.trim() : base;
}

/**
 * Elimina espacios innecesarios dentro de paréntesis, normaliza ratios internos y remueve paréntesis anidados o vacíos
 */
export function cleanParentheses(text: string): string {
  if (!text) return '';
  return text
    .replace(/\(\s*([0-9]+)\s*\/\s*([0-9]+)\s*\)/g, '($1/$2)')
    .replace(/\(\s*\(([^()]+)\)\s*\)/g, '($1)')
    .replace(/\(\s*\)/g, '')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Elimina comillas externas redundantes, asteriscos huérfanos y espacios parásitos dentro de comillas
 */
export function cleanQuotes(text: string): string {
  if (!text) return '';
  return text
    .replace(/^["'«»“”„*]+|["'«»“”„*]+$/g, '')
    .replace(/\s+\*"\*\s*$/g, '')
    .replace(/\s*\*\s*"\s*\*\s*/g, '')
    .replace(/^\s*\*\s*"\s*/g, '')
    .replace(/\s*"\s*\*\s*$/g, '')
    .replace(/"\s+([^"]*?)\s+"/g, '"$1"')
    .replace(/"\s+([^"]*?)"/g, '"$1"')
    .replace(/"([^"]*?)\s+"/g, '"$1"')
    .replace(/\s+([,;:.!?])/g, '$1')
    .trim();
}

/**
 * Normaliza y formatea montos monetarios con símbolo de dólar único y separadores de miles
 * Ejemplo: formatMoney(0) -> "$0", formatMoney(1500) -> "$1.500"
 */
export function formatMoney(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return '$0';
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;
  const safeAmount = isNaN(num) ? 0 : Math.round(num);
  return `$${safeAmount.toLocaleString('es-AR')}`;
}

/**
 * Formatea un número en notación compacta (1.2k, 3.4M, 1.1B) con manejo de negativos y ceros
 */
export function formatCompactNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num) || num === 0) return '0';
  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num);
  if (abs >= 1_000_000_000) {
    return `${sign}${(abs / 1_000_000_000).toFixed(2).replace(/\.00$/, '')}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (abs >= 1_000) {
    return `${sign}${(abs / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return `${sign}${abs.toLocaleString('es-AR')}`;
}

/**
 * Formatea métrica de Fans con etiqueta explícita para evitar valores huérfanos
 * Ejemplo: formatFans(150) -> "150 Fans", formatFans(4150) -> "4.15k Fans", formatFans(1) -> "1 Fan"
 */
export function formatFans(count: number | undefined | null): string {
  const safeCount = count === undefined || count === null || isNaN(count) ? 0 : count;
  const formatted = formatCompactNumber(safeCount);
  return `${formatted} ${Math.abs(safeCount) === 1 ? 'Fan' : 'Fans'}`;
}

/**
 * Formatea métrica de Oyentes Mensuales con etiqueta explícita
 * Ejemplo: formatListeners(25000) -> "25k Oyentes", formatListeners(1) -> "1 Oyente"
 */
export function formatListeners(count: number | undefined | null): string {
  const safeCount = count === undefined || count === null || isNaN(count) ? 0 : count;
  const formatted = formatCompactNumber(safeCount);
  return `${formatted} ${Math.abs(safeCount) === 1 ? 'Oyente' : 'Oyentes'}`;
}

/**
 * Formatea métrica de Streams con etiqueta explícita
 * Ejemplo: formatStreams(80000) -> "80k Streams", formatStreams(1) -> "1 Stream"
 */
export function formatStreams(count: number | undefined | null): string {
  const safeCount = count === undefined || count === null || isNaN(count) ? 0 : count;
  const formatted = formatCompactNumber(safeCount);
  return `${formatted} ${Math.abs(safeCount) === 1 ? 'Stream' : 'Streams'}`;
}

/**
 * Configuración canónica de visualización de regiones musicales en español uniforme
 */
export interface RegionDisplayConfig {
  id: MusicRegion;
  name: string;           // "Mundial", "Latinoamérica", "España", "EE. UU.", etc.
  label: string;          // "🌍 Mundial Top 50", "🌎 Latinoamérica", etc.
  flag: string;           // "🌍", "🇦🇷", "🌎", "🇺🇸", "🇪🇸", "🇲🇽", "🇪🇺"
  inPhrase: string;       // "a nivel mundial", "en Latinoamérica", "en EE. UU.", etc.
  no1Headline: string;    // "¡#1 a Nivel Mundial!", "¡#1 en Latinoamérica!", etc.
}

export const MUSIC_REGION_CONFIG: Record<MusicRegion, RegionDisplayConfig> = {
  Global: {
    id: 'Global',
    name: 'Mundial',
    label: '🌍 Mundial Top 50',
    flag: '🌍',
    inPhrase: 'a nivel mundial',
    no1Headline: '¡#1 a Nivel Mundial!'
  },
  Argentina: {
    id: 'Argentina',
    name: 'Argentina',
    label: '🇦🇷 Argentina',
    flag: '🇦🇷',
    inPhrase: 'en Argentina',
    no1Headline: '¡#1 en Argentina!'
  },
  LatinAmerica: {
    id: 'LatinAmerica',
    name: 'Latinoamérica',
    label: '🌎 Latinoamérica',
    flag: '🌎',
    inPhrase: 'en Latinoamérica',
    no1Headline: '¡#1 en Latinoamérica!'
  },
  USA: {
    id: 'USA',
    name: 'EE. UU.',
    label: '🇺🇸 EE. UU.',
    flag: '🇺🇸',
    inPhrase: 'en EE. UU.',
    no1Headline: '¡#1 en EE. UU.!'
  },
  Spain: {
    id: 'Spain',
    name: 'España',
    label: '🇪🇸 España',
    flag: '🇪🇸',
    inPhrase: 'en España',
    no1Headline: '¡#1 en España!'
  },
  Mexico: {
    id: 'Mexico',
    name: 'México',
    label: '🇲🇽 México',
    flag: '🇲🇽',
    inPhrase: 'en México',
    no1Headline: '¡#1 en México!'
  },
  Europe: {
    id: 'Europe',
    name: 'Europa',
    label: '🇪🇺 Europa',
    flag: '🇪🇺',
    inPhrase: 'en Europa',
    no1Headline: '¡#1 en Europa!'
  },
  UK: {
    id: 'UK',
    name: 'Reino Unido',
    label: '🇬🇧 Reino Unido',
    flag: '🇬🇧',
    inPhrase: 'en el Reino Unido',
    no1Headline: '¡#1 en el Reino Unido!'
  },
  Brazil: {
    id: 'Brazil',
    name: 'Brasil',
    label: '🇧🇷 Brasil',
    flag: '🇧🇷',
    inPhrase: 'en Brasil',
    no1Headline: '¡#1 en Brasil!'
  },
  Asia: {
    id: 'Asia',
    name: 'Asia',
    label: '🌏 Asia',
    flag: '🌏',
    inPhrase: 'en Asia',
    no1Headline: '¡#1 en Asia!'
  },
  Africa: {
    id: 'Africa',
    name: 'África',
    label: '🌍 África',
    flag: '🌍',
    inPhrase: 'en África',
    no1Headline: '¡#1 en África!'
  }
};

/**
 * Obtiene el nombre normalizado en español de una región de charts.
 * "Global" -> "Mundial", "LatinAmerica" -> "Latinoamérica", "USA" -> "EE. UU.", "Spain" -> "España", "Europe" -> "Europa"
 */
export function formatMusicRegion(region: MusicRegion): string {
  return MUSIC_REGION_CONFIG[region]?.name || region;
}

/**
 * Obtiene la etiqueta para botones y selectores de charts con emoji/bandera.
 */
export function formatMusicRegionLabel(region: MusicRegion): string {
  return MUSIC_REGION_CONFIG[region]?.label || region;
}

/**
 * Genera el titular de noticia cuando una canción alcanza el puesto #1 en un chart regional.
 */
export function formatChartMilestoneHeadline(region: MusicRegion, songTitle: string, artistName: string): string {
  const config = MUSIC_REGION_CONFIG[region];
  const prefix = config?.no1Headline || `¡#1 en ${region}!`;
  return `${prefix} "${songTitle}" de ${artistName} conquista la cima`;
}

/**
 * Genera el cuerpo de noticia cuando una canción alcanza el puesto #1 en un chart regional.
 */
export function formatChartMilestoneBody(region: MusicRegion): string {
  const config = MUSIC_REGION_CONFIG[region];
  const phrase = config?.inPhrase || `en ${region}`;
  return `El single alcanzó el primer puesto de los charts oficiales ${phrase} con cifras récord de streaming.`;
}

/**
 * Nombres y Apellidos contextualizados por región para generar identidades verosímiles
 */
export interface RegionalNameData {
  stageNames: string[];
  firstNames: string[];
  lastNames: string[];
}

export const REGIONAL_NAME_POOLS: Record<string, RegionalNameData> = {
  Argentina: {
    stageNames: [
      'Duki', 'Wos', 'Tiago PZK', 'Khea', 'Milo J', 'Ysy A', 'Trueno', 'Bhavi', 'Seven Kayne',
      'C.R.O', 'Lucho SSJ', 'Ca7riel', 'Paco Amoroso', 'Dillom', 'Neo Pistea', 'Acru', 'Lit Killah',
      'Rusherking', 'Taichu', 'Saramalacara', 'Lara91k', 'Zeballos', 'Replik', 'Mecha', 'Papo MC',
      'Klan', 'Wolf', 'Sub', 'Stuart', 'Blunted Vato', 'Cazzu', 'Nicki Nicole', 'Tini', 'Emilia Mernes',
      'Maria Becerra', 'La Joaqui', 'Luck Ra', 'Callejero Fino', 'Duki Nova', 'Bizar', 'Khea Flow',
      'Wosky', 'Trueno Sound', 'Cazzu V', 'Ysy Vibe', 'Seven Sound', 'Zeballos Flow', 'Dillom Ghost',
      'Tomi Trap', 'Enzo Flow', 'Ciro Sound', 'Valen Ghost', 'Jota Beats', 'Sombra Sur', 'El Duko'
    ],
    firstNames: [
      'Mateo', 'Valentín', 'Ignacio', 'Facundo', 'Joaquín', 'Martín', 'Franco', 'Tomás', 'Santiago',
      'Lucía', 'Martina', 'Camila', 'Sofía', 'Julieta', 'Lautaro', 'Agustín', 'Enzo', 'Thiago',
      'Bruno', 'Nicolás', 'Lucas', 'Delfina', 'Milagros', 'Zoe', 'Jazmín', 'Catalina', 'Abril', 'Rocío'
    ],
    lastNames: [
      'Palacios', 'Morales', 'Lombardo', 'Giménez', 'Castro', 'Rossi', 'Mendoza', 'Silva', 'Benítez',
      'Navarro', 'Herrera', 'Alonso', 'Cabrera', 'Acosta', 'Suárez', 'Romero', 'Vega', 'Rojas',
      'Ríos', 'Castillo', 'Paredes', 'Guerrero', 'Sosa'
    ]
  },
  España: {
    stageNames: [
      'Quevedo', 'Rels B', 'Morad', 'Saiko', 'C. Tangana', 'Dellafuente', 'Kidd Keo', 'Cruz Cafuné',
      'Recycled J', 'Maikel Delacalle', 'Yung Beef', 'Soto Asa', 'Natos', 'Waor', 'Hard GZ', 'Ayax',
      'Prok', 'Lola Indigo', 'Bad Gyal', 'Rosalía', 'Ptazeta', 'Judeline', 'Bejo', 'Abhir', 'Hoke',
      'Sticky M.A.', 'Quevedo Sound', 'Rels Vibe', 'Morad Kid', 'Saiko Flame', 'Cruz Sound'
    ],
    firstNames: [
      'Alejandro', 'Pablo', 'Daniel', 'Hugo', 'Lucas', 'Manuel', 'Álvaro', 'David', 'Paula', 'Sara',
      'Elena', 'Carmen', 'Alba', 'Adrián', 'Marcos', 'Javier', 'Mario', 'Sergio', 'Lucía', 'María', 'Marta'
    ],
    lastNames: [
      'García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez',
      'Martín', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Álvarez', 'Romero', 'Alonso', 'Gutiérrez'
    ]
  },
  'Puerto Rico': {
    stageNames: [
      'Eladio Carrión', 'Myke Towers', 'Mora', 'Rauw Alejandro', 'Jhayco', 'Álvaro Díaz', 'De La Ghetto',
      'Lunay', 'Brytiago', 'Noriel', 'Darell', 'Tainy', 'Chencho Corleone', 'Arcángel', 'Farruko',
      'Ozuna', 'Anuel', 'Bad Bunny', 'Young Miko', 'Luar La L', 'Hades66', 'Yovngchimi', 'Omar Courtz',
      'Roa', 'Dei V', 'Villano Antillano', 'Eladio V', 'Myke Wave', 'Mora Sound', 'Rauw Star'
    ],
    firstNames: [
      'Carlos', 'José', 'Luis', 'Ángel', 'Gabriel', 'Bryan', 'Kevin', 'Javier', 'Sebastián', 'Valeria',
      'Alondra', 'Camila', 'Christian', 'Emmanuel', 'Kenneth', 'Jean', 'Alexis', 'Paola', 'Andrea'
    ],
    lastNames: [
      'Rivera', 'Ortiz', 'Torres', 'Colón', 'Morales', 'Reyes', 'Cruz', 'Santiago', 'Ramos', 'Díaz',
      'Feliciano', 'Vázquez', 'Rosario', 'Nieves', 'Soto', 'Medina', 'Vega', 'Delgado'
    ]
  },
  México: {
    stageNames: [
      'Natanael Cano', 'Junior H', 'Peso Pluma', 'Gera MX', 'Alemán', 'Santa Fe Klan', 'Gabito Ballesteros',
      'Tornillo', 'Eslabón Armado', 'Dan Sánchez', 'Fuerza Regida', 'Oscar Maydon', 'Victor Cibrian',
      'Chino Pacas', 'Xavi', 'Tito Double P', 'Cartel de Santa', 'Dharius', 'Snow Tha Product',
      'Kenia Os', 'Danna Paola', 'Bellakath', 'Natanael King', 'Junior H Flame', 'Peso Vibe'
    ],
    firstNames: [
      'Emiliano', 'Santiago', 'Mateo', 'Leonardo', 'Diego', 'Sebastián', 'Rodrigo', 'Gael', 'Ximena',
      'Valentina', 'Regina', 'Sofía', 'Camila', 'Alejandro', 'Maximiliano', 'Daniel', 'Eduardo'
    ],
    lastNames: [
      'Hernández', 'García', 'Martínez', 'López', 'González', 'Pérez', 'Rodríguez', 'Sánchez',
      'Ramírez', 'Flores', 'Vázquez', 'Morales', 'Reyes', 'Jiménez', 'Torres', 'Díaz', 'Gutiérrez', 'Mendoza'
    ]
  },
  Colombia: {
    stageNames: [
      'Feid', 'Blessd', 'Ryan Castro', 'Manuel Turizo', 'Kapla & Miky', 'Nanpa Básico', 'Crissin',
      'Totoy El Frío', 'Beéle', 'Reykon', 'Llane', 'Ovy On The Drums', 'Sky Rompiendo', 'Karol G',
      'Greeicy', 'Farina', 'Pirlo 420', 'Sog', 'Esteban Rojas', 'Feid Wave', 'Blessd Kid', 'Ryan Flow'
    ],
    firstNames: [
      'Juan', 'Andrés', 'David', 'Felipe', 'Camilo', 'Esteban', 'Nicolás', 'Daniel', 'Mariana',
      'Salomé', 'Isabella', 'Sofía', 'Valentina', 'Santiago', 'Sebastián', 'Alejandro', 'Samuel'
    ],
    lastNames: [
      'Gómez', 'Rodríguez', 'Zapata', 'Restrepo', 'Jaramillo', 'Ospina', 'Henao', 'Bedoya',
      'Montoya', 'Castrillón', 'Correa', 'Álvarez', 'Londoño', 'Echeverri', 'Ramírez', 'Cano', 'Gallego'
    ]
  },
  Chile: {
    stageNames: [
      'Cris MJ', 'Standly', 'Polimá Westcoast', 'Pablo Chill-E', 'Pailita', 'El Jordan 23', 'Harry Nach',
      'Marcianeke', 'Galea', 'Kidd Voodoo', 'DrefQuila', 'Julianno Sosa', 'King Savagge', 'Gino Mella',
      'Jere Klein', 'Nickoog Clk', 'Ak4:20', 'Young Cister', 'Cris MJ Vibe', 'Pablo West'
    ],
    firstNames: [
      'Matías', 'Benjamín', 'Vicente', 'Agustín', 'Tomás', 'Joaquín', 'Cristóbal', 'Catalina',
      'Constanza', 'Florencia', 'Isidora', 'Sofía', 'Martín', 'Maximiliano', 'Lucas', 'Ignacio', 'Antonia'
    ],
    lastNames: [
      'González', 'Muñoz', 'Rojas', 'Díaz', 'Pérez', 'Soto', 'Contreras', 'Silva', 'Martínez',
      'Sepúlveda', 'Morales', 'Rodríguez', 'López', 'Fuentes', 'Hernández', 'Torres', 'Araya', 'Espinoza'
    ]
  },
  Uruguay: {
    stageNames: [
      'Zeballos', 'Knack', 'Peke 77', 'Mesita', 'Gula', 'Agus Padilla', 'Franux BB', 'Davo',
      'Cardellino', 'Santi Mostaffa', 'Kung-Fú Ombijam', 'Arquero', 'Zeballos Sound', 'Knack Vibe'
    ],
    firstNames: [
      'Facundo', 'Santiago', 'Mateo', 'Agustín', 'Lucas', 'Joaquín', 'Federico', 'Martina',
      'Lucía', 'Julieta', 'Bruno', 'Rodrigo', 'Gonzalo', 'Valentina', 'Camila'
    ],
    lastNames: [
      'Rodríguez', 'González', 'Fernández', 'López', 'Pérez', 'Martínez', 'García', 'Silva',
      'Suárez', 'Olivera', 'Pereira', 'Silvera', 'Morales', 'Acosta', 'Giménez'
    ]
  },
  'República Dominicana': {
    stageNames: [
      'Rochy RD', 'El Alfa', 'Amenazzy', 'Tokischa', 'Yailin La Más Viral', 'Bulin 47', 'Jey One',
      'Angel Dior', 'Tivi Gunz', 'Dowba Montana', 'Kiko El Crazy', 'Chimbala', 'Lirico En La Casa',
      'El Mayor Clásico', 'Braulio Fogón', 'Rochy King', 'El Alfa Beat'
    ],
    firstNames: [
      'Kelvin', 'Manuel', 'Ángel', 'Jean', 'Carlos', 'José', 'Yohan', 'Yomaira', 'Génesis',
      'Ashley', 'Wander', 'Brayan', 'Dariel', 'Yuleisy', 'Lisbeth'
    ],
    lastNames: [
      'Rodríguez', 'Pérez', 'Martínez', 'García', 'Reyes', 'Díaz', 'Peña', 'Jiménez',
      'Santana', 'Castillo', 'De La Cruz', 'Rosario', 'Guzmán', 'Paulino', 'Encarnación'
    ]
  },
  'Estados Unidos': {
    stageNames: [
      'Travis Wolf', 'Kidd Rush', 'Nova Wave', 'Jaxen Flame', 'Zeta Black', 'Dante Vox', 'Kira Gold',
      'Chase Wave', 'Ryder Stone', 'Saint Mirage', 'Future Vibe', 'Young Echo', 'Neo Wolf', 'Vibe Kid'
    ],
    firstNames: [
      'Marcus', 'Alexander', 'Ethan', 'Liam', 'Noah', 'Mason', 'Oliver', 'Lucas', 'Logan',
      'Emma', 'Olivia', 'Ava', 'Sophia', 'James', 'Jayden', 'Jackson'
    ],
    lastNames: [
      'Miller', 'Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Davis', 'Wilson',
      'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee'
    ]
  },
  'Reino Unido': {
    stageNames: [
      'Central Flow', 'Stormzy Wave', 'Dave Sound', 'Aitch Beat', 'Skepta Kid', 'Headie Star',
      'Digga D', 'Russ Millions', 'ArrDee', 'K-Trap', 'Fred Again', 'Little Simz', 'Storm Kid'
    ],
    firstNames: [
      'George', 'Harry', 'Jack', 'Oliver', 'Arthur', 'Leo', 'Oscar', 'Charlie', 'Amelia',
      'Isla', 'Ava', 'Mia', 'Henry', 'Freddie', 'Archie'
    ],
    lastNames: [
      'Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Davies',
      'Robinson', 'Wright', 'Thompson', 'Evans', 'Walker', 'White'
    ]
  },
  Brasil: {
    stageNames: [
      'Matuê', 'Anitta', 'MC Cabelinho', 'Orochi', 'Ludmilla', 'Veigh', 'KayBlack', 'MC Ryan SP',
      'Filipe Ret', 'L7NNON', 'Teto', 'WIU', 'Gloria Groove', 'Pedro Sampaio', 'MC Poze do Rodo', 'Papatinho'
    ],
    firstNames: [
      'Gabriel', 'Lucas', 'Matheus', 'Guilherme', 'Gustavo', 'Felipe', 'Rafael', 'Enzo', 'Leonardo',
      'Larissa', 'Julia', 'Beatriz', 'Mariana', 'Camila', 'Bruna', 'Thiago', 'Vinicius'
    ],
    lastNames: [
      'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima',
      'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares'
    ]
  },
  'Canadá': {
    stageNames: [
      'Drake Star', 'The Weeknd Vibe', 'Tory Sound', 'Kaytranada Wave', 'Ali Gatie', 'Nav Flow',
      'Jessie Reyez', 'PARTYNEXTDOOR', 'Belly', 'Roy Woods', 'Pressa', 'Smiley', 'Night Lovell'
    ],
    firstNames: [
      'Noah', 'Liam', 'Jackson', 'Lucas', 'Oliver', 'Benjamin', 'Ali', 'Ethan', 'William',
      'Emma', 'Olivia', 'Charlotte', 'Chloe', 'Amelia', 'Maya', 'Sophie'
    ],
    lastNames: [
      'Smith', 'Brown', 'Tremblay', 'Martin', 'Roy', 'Wilson', 'Gagnon', 'Lee', 'Johnson',
      'Taylor', 'Campbell', 'Anderson', 'Leblanc', 'Côté', 'Bouchard'
    ]
  },
  Francia: {
    stageNames: [
      'Ninho', 'Jul', 'Gazo', 'SDM', 'Tiakola', 'PLK', 'Aya Nakamura', 'Booba', 'SCH', 'Damso V',
      'Hamza Sound', 'Zola', 'Werenoi', 'Koba LaD', 'Freeze Corleone', 'Josman', 'Dinos'
    ],
    firstNames: [
      'Gabriel', 'Léo', 'Raphaël', 'Arthur', 'Louis', 'Lucas', 'Adam', 'Jules', 'Hugo',
      'Jade', 'Louise', 'Emma', 'Ambre', 'Alice', 'Rose', 'Anna', 'Inès'
    ],
    lastNames: [
      'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy',
      'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand'
    ]
  },
  Alemania: {
    stageNames: [
      'Bonez MC', 'RAF Camora', 'Luciano', 'Apache 207', 'Ufo361', 'Pashanim', 'Capital Bra',
      'Gzuz', 'Kontra K', 'Sido', 'Bausa', 'Trettmann', 'RIN', 'OG Keemo', 'Shindy'
    ],
    firstNames: [
      'Noah', 'Matteo', 'Leon', 'Paul', 'Finn', 'Elias', 'Jonas', 'Felix', 'Maximilian',
      'Mia', 'Emma', 'Sophia', 'Hannah', 'Emilia', 'Lina', 'Ella', 'Clara'
    ],
    lastNames: [
      'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz',
      'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder'
    ]
  },
  Italia: {
    stageNames: [
      'Sfera Ebbasta', 'Shiva', 'Lazza', 'Baby Gang', 'Guè', 'Rondodasosa', 'Blanco', 'Geolier',
      'Capo Plaza', 'Tedua', 'Ernia', 'Rkomi', 'Ghali', 'Marracash', 'Tony Effe', 'Pakhy'
    ],
    firstNames: [
      'Leonardo', 'Francesco', 'Alessandro', 'Lorenzo', 'Mattia', 'Andrea', 'Gabriele', 'Matteo',
      'Sofia', 'Aurora', 'Giulia', 'Ginevra', 'Vittoria', 'Beatrice', 'Alice', 'Emma', 'Giorgia'
    ],
    lastNames: [
      'Rossi', 'Ferrari', 'Russo', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco',
      'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo'
    ]
  },
  Portugal: {
    stageNames: [
      'Plutónio', 'Wet Bed Gang', 'ProfJam', 'Dillaz', 'Ivandro', 'Bárbara Bandeira', 'Slow J',
      'Bispo', 'Pirilampo', 'T-Rex', 'Piruka', 'Nenny', 'Sippinpurpp', 'Lon3r Johny'
    ],
    firstNames: [
      'Francisco', 'Afonso', 'João', 'Tomás', 'Duarte', 'Lourenço', 'Rodrigo', 'Martim', 'Santiago',
      'Maria', 'Leonor', 'Matilde', 'Beatriz', 'Carolina', 'Mariana', 'Ana', 'Sofia'
    ],
    lastNames: [
      'Silva', 'Santos', 'Ferreira', 'Pereira', 'Oliveira', 'Costa', 'Rodrigues', 'Martins',
      'Jesus', 'Sousa', 'Fernandes', 'Gonçalves', 'Gomes', 'Lopes', 'Marques', 'Alves'
    ]
  },
  'Países Bajos': {
    stageNames: [
      'Frenna', 'Ronnie Flex', 'Boef', 'Lil Kleine', 'Sevn Alias', 'Dopebwoy', 'Josylvio',
      'Bizzey', 'Chivv', 'Broederliefde', 'Kevin', 'Lijpe', 'Hef', 'Yssi SB'
    ],
    firstNames: [
      'Noah', 'Sem', 'Liam', 'Lucas', 'Daan', 'Finn', 'Milan', 'Levi', 'Luuk',
      'Emma', 'Julia', 'Mila', 'Tess', 'Sophie', 'Zoe', 'Sara', 'Noor'
    ],
    lastNames: [
      'De Jong', 'Jansen', 'De Vries', 'Van de Berg', 'Van Dijk', 'Bakker', 'Janssen', 'Visser',
      'Smit', 'Meijer', 'De Boer', 'Mulder', 'De Groot', 'Bos', 'Vos', 'Peters'
    ]
  },
  'Bélgica': {
    stageNames: [
      'Damso', 'Hamza', 'Stromae', 'Shay', 'Caballero', 'JeanJass', 'Lous and the Yakuza',
      'Roméo Elvis', 'Lost Frequencies', 'Coely', 'Glints', 'Woodie Smalls'
    ],
    firstNames: [
      'Arthur', 'Noah', 'Jules', 'Louis', 'Lucas', 'Liam', 'Adam', 'Victor', 'Gabriel',
      'Olivia', 'Emma', 'Mila', 'Louise', 'Alice', 'Lina', 'Elena', 'Lucie'
    ],
    lastNames: [
      'Peeters', 'Janssens', 'Maes', 'Jacobs', 'Mertens', 'Willems', 'Claes', 'Goossens',
      'Wouters', 'De Smet', 'Vermeulen', 'Pauwels', 'Hermans', 'Aerts', 'Michiels'
    ]
  },
  Suecia: {
    stageNames: [
      'Yung Lean', 'Bladee', 'Einár', 'Zara Larsson', 'Dree Low', 'Ant Wan', 'Yasin',
      'Hov1', 'Victor Leksell', 'Avicii Vibe', 'Alesso Wave', 'Snoh Aalegra', 'Tove Lo'
    ],
    firstNames: [
      'William', 'Liam', 'Elias', 'Noah', 'Hugo', 'Oliver', 'Lucas', 'Matteo', 'Leo',
      'Alice', 'Maja', 'Vera', 'Alma', 'Selma', 'Elsa', 'Astrid', 'Wilma'
    ],
    lastNames: [
      'Andersson', 'Johansson', 'Karlsson', 'Nilsson', 'Eriksson', 'Larsson', 'Olsson',
      'Persson', 'Svensson', 'Gustafsson', 'Pettersson', 'Jonsson', 'Jansson'
    ]
  },
  Noruega: {
    stageNames: [
      'Kygo', 'Alan Walker', 'Karpe', 'Astrid S', 'Undergrunn', 'Girl in Red', 'Sigrid',
      'Aurora Wave', 'Matoma', 'Cezinando', 'Broiler', 'Ballinciaga', 'Kamelen'
    ],
    firstNames: [
      'Jakob', 'Filip', 'Noah', 'Oliver', 'Lucas', 'Emil', 'Isak', 'Kasper', 'Magnus',
      'Nora', 'Emma', 'Sofie', 'Olivia', 'Ella', 'Maja', 'Ingrid', 'Sara'
    ],
    lastNames: [
      'Hansen', 'Johansen', 'Olsen', 'Larsen', 'Andersen', 'Pedersen', 'Nilsen', 'Kristiansen',
      'Jensen', 'Karlsen', 'Johnsen', 'Pettersen', 'Eriksen', 'Berg', 'Haugen'
    ]
  },
  Irlanda: {
    stageNames: [
      'Fontaines Flow', 'Rejjie Snow', 'Hozier Vibe', 'Dermot Sound', 'CMAT', 'Inhaler',
      'Kojaque', 'Biig Piig', 'Denise Chaila', 'Kneecap', 'Maverick Sabre', 'Gemma Dunleavy'
    ],
    firstNames: [
      'Jack', 'James', 'Noah', 'Daniel', 'Conor', 'Finn', 'Liam', 'Fionn', 'Alex',
      'Emily', 'Grace', 'Fiadh', 'Sophie', 'Hannah', 'Amelia', 'Ava', 'Ella'
    ],
    lastNames: [
      'Murphy', 'Kelly', 'O\'Brien', 'Ryan', 'Byrne', 'O\'Connor', 'Walsh', 'O\'Sullivan',
      'McCarthy', 'Doyle', 'Brennan', 'Burke', 'Lynch', 'Dunne', 'Flynn'
    ]
  },
  Australia: {
    stageNames: [
      'The Kid LAROI', 'Tame Impala', 'Flume', 'ONEFOUR', 'Masked Wolf', 'Chillinit',
      'Hooligan Hefs', 'Genesis Owusu', 'Mallrat', 'Troye Sivan', 'Sampa The Great', 'Baker Boy'
    ],
    firstNames: [
      'Oliver', 'Noah', 'Henry', 'William', 'Leo', 'Charlie', 'Jack', 'Thomas', 'Hudson',
      'Charlotte', 'Amelia', 'Isla', 'Olivia', 'Mia', 'Ava', 'Grace', 'Harper'
    ],
    lastNames: [
      'Smith', 'Jones', 'Williams', 'Brown', 'Wilson', 'Taylor', 'Johnson', 'White',
      'Martin', 'Anderson', 'Thompson', 'Nguyen', 'Thomas', 'Walker', 'Harris'
    ]
  },
  'Nueva Zelanda': {
    stageNames: [
      'Lorde', 'BENEE', 'Six60', 'Savage', 'Stan Walker', 'Broods', 'David Dallas',
      'SWIDT', 'MELODOWNZ', 'Mitch James', 'Drax Project', 'CHAII', 'Church & AP'
    ],
    firstNames: [
      'Oliver', 'Noah', 'Leo', 'Jack', 'Luca', 'George', 'Charlie', 'Hudson', 'Hunter',
      'Charlotte', 'Isla', 'Amelia', 'Olivia', 'Harper', 'Sophie', 'Hazel', 'Willow'
    ],
    lastNames: [
      'Smith', 'Wilson', 'Taylor', 'Brown', 'Williams', 'Jones', 'Anderson', 'Thompson',
      'Campbell', 'Kelly', 'Singh', 'Clark', 'Walker', 'Wright', 'Watson'
    ]
  },
  Nigeria: {
    stageNames: [
      'Burna Boy', 'Wizkid', 'Rema', 'Asake', 'Davido', 'Ayra Starr', 'Omah Lay', 'Tems',
      'Fireboy DML', 'Kizz Daniel', 'Olamide', 'Ckay', 'Victony', 'Shallipopi', 'Odumodublvck', 'Seyi Vibez'
    ],
    firstNames: [
      'Chukwudi', 'Emmanuel', 'Oluwaseun', 'Adebayo', 'Babajide', 'Chinedu', 'Olumide', 'Ifeanyi',
      'Amaka', 'Chioma', 'Zainab', 'Ngozi', 'Blessing', 'Fatima', 'Folake', 'Chiamaka'
    ],
    lastNames: [
      'Okafor', 'Balogun', 'Adeyemi', 'Okeke', 'Eze', 'Ojo', 'Bello', 'Nwosu', 'Abiola',
      'Akinyemi', 'Okonkwo', 'Lawal', 'Ibrahim', 'Ogunleye', 'Danjuma', 'Aliyu'
    ]
  },
  'Sudáfrica': {
    stageNames: [
      'Tyla', 'Nasty C', 'Master KG', 'Kabza De Small', 'DJ Maphorisa', 'Focalistic', 'Uncle Waffles',
      'Cassper Nyovest', 'A-Reece', 'Kwesta', 'Sho Madjozi', 'Young Stunna', 'Blxckie', 'Musa Keys'
    ],
    firstNames: [
      'Thabo', 'Sipho', 'Bandile', 'Kagiso', 'Lethabo', 'Junior', 'Siyabonga', 'Bongani',
      'Nomvula', 'Thandi', 'Buhle', 'Lerato', 'Zanele', 'Precious', 'Naledi', 'Mbali'
    ],
    lastNames: [
      'Dlamini', 'Ndlovu', 'Khumalo', 'Sithole', 'Mokoena', 'Zuma', 'Mabaso', 'Cele',
      'Nkosi', 'Khoza', 'Hadebe', 'Mthembu', 'Sibiya', 'Ntuli', 'Modise'
    ]
  },
  Ghana: {
    stageNames: [
      'Black Sherif', 'Sarkodie', 'Stonebwoy', 'King Promise', 'Shatta Wale', 'Gyakie',
      'Camidoh', 'Kidi', 'Kuami Eugene', 'Kwesi Arthur', 'Medikal', 'Amerado', 'Kofi Mole'
    ],
    firstNames: [
      'Kwame', 'Kofi', 'Kwesi', 'Kweku', 'Yaw', 'Kojo', 'Kwabena', 'Emmanuel',
      'Akosua', 'Adwoa', 'Abena', 'Afia', 'Yaa', 'Ama', 'Akua', 'Esi'
    ],
    lastNames: [
      'Mensah', 'Osei', 'Owusu', 'Boateng', 'Appiah', 'Agyemang', 'Asante', 'Frimpong',
      'Acheampong', 'Adu', 'Addison', 'Amponsah', 'Antwi', 'Bonsu', 'Donkor'
    ]
  },
  Marruecos: {
    stageNames: [
      'ElGrandeToto', 'Morad Vibe', 'Dizzy DROS', 'Stormy', 'Pause Flow', 'Manal',
      'Small X', 'Shobee', 'Madd', 'Draganov', 'Lferda', 'Inkonnu', '7liwa', 'Snor'
    ],
    firstNames: [
      'Youssef', 'Mehdi', 'Amine', 'Hamza', 'Omar', 'Karim', 'Saad', 'Anas',
      'Fatima', 'Salma', 'Meriem', 'Khadija', 'Nour', 'Yasmine', 'Imane', 'Hiba'
    ],
    lastNames: [
      'Benjelloun', 'Alaoui', 'Idrissi', 'Berrada', 'Tazi', 'Chraibi', 'Fassi',
      'El Amrani', 'Bennani', 'Ouazzani', 'El Mansouri', 'Zouiten', 'Tahiri'
    ]
  },
  Egipto: {
    stageNames: [
      'Wegz', 'Marwan Pablo', 'Marwan Moussa', 'Afroto', 'Abyusif', 'Cairokee',
      'Lege-Cy', 'Batistuta', 'Dardiri', 'Ezz', 'Hassan Shakosh', 'Omar Kamal'
    ],
    firstNames: [
      'Ahmed', 'Mohamed', 'Mahmoud', 'Omar', 'Youssef', 'Aly', 'Karim', 'Hassan',
      'Nour', 'Mariam', 'Farida', 'Salma', 'Hana', 'Laila', 'Jana', 'Zeina'
    ],
    lastNames: [
      'Hassan', 'Ali', 'Ibrahim', 'Mahmoud', 'El Sayed', 'Abdelrahman', 'Mostafa',
      'Khalil', 'Mansour', 'Salem', 'Farag', 'El Shamy', 'Soliman', 'Radwan'
    ]
  },
  India: {
    stageNames: [
      'AP Dhillon', 'DIVINE', 'MC Stan', 'King', 'Sidhu Moose Wala', 'Badshah', 'Shubh',
      'Raftaar', 'KR$NA', 'Emiway Bantai', 'Seedhe Maut', 'Prabh Deep', 'Karan Aujla'
    ],
    firstNames: [
      'Aarav', 'Rohan', 'Kabir', 'Aditya', 'Vihaan', 'Aryan', 'Dhruv', 'Arjun',
      'Ananya', 'Diya', 'Aadhya', 'Saanvi', 'Isha', 'Myra', 'Kavya', 'Pooja'
    ],
    lastNames: [
      'Sharma', 'Patel', 'Singh', 'Kumar', 'Verma', 'Gupta', 'Reddy', 'Mehta',
      'Chopra', 'Malhotra', 'Kapoor', 'Deshmukh', 'Joshi', 'Bose', 'Chatterjee'
    ]
  },
  'Corea del Sur': {
    stageNames: [
      'RM', 'Agust D', 'J-Hope', 'Jay Park', 'Zico', 'Changmo', 'BIBI', 'Sik-K',
      'Beenzino', 'G-Dragon', 'DPR LIVE', 'Mino', 'Epik High', 'CL', 'Jessi', 'Colde'
    ],
    firstNames: [
      'Min-ho', 'Ji-hoon', 'Hyun-woo', 'Seo-jun', 'Do-hyun', 'Jung-kook', 'Tae-hyung', 'Woo-jin',
      'Ji-woo', 'Seo-yeon', 'Min-seo', 'Ha-eun', 'Ye-eun', 'Su-bin', 'Yoon-ah', 'Chae-young'
    ],
    lastNames: [
      'Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang',
      'Lim', 'Han', 'Oh', 'Seo', 'Shin', 'Kwon', 'Hwang', 'Song', 'Bae'
    ]
  },
  'Japón': {
    stageNames: [
      'Awich', 'KOHH', 'Fujii Kaze', 'JP THE WAVY', 'BAD HOP', 'LEX', 'Yoasobi Flow',
      'KREVA', 'Salue', 'Tohji', 'Creepy Nuts', 'Vaundy', 'Miyachi', 'Leon Fanourakis'
    ],
    firstNames: [
      'Ren', 'Haruto', 'Sota', 'Yuto', 'Riku', 'Kaito', 'Daiki', 'Hiroshi',
      'Yui', 'Rio', 'Hina', 'Mei', 'Sakura', 'Koharu', 'Akari', 'Aoi'
    ],
    lastNames: [
      'Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura',
      'Kobayashi', 'Kato', 'Yoshida', 'Yamada', 'Sasaki', 'Yamaguchi', 'Saito'
    ]
  },
  Filipinas: {
    stageNames: [
      'Al James', 'Flow G', 'SB19 Sound', 'Zack Tabudlo', 'FELIP', 'Shanti Dope',
      'Skusta Clee', 'Gloc-9', 'Arthur Nery', 'Loonie', 'Morissette', 'Nik Makino'
    ],
    firstNames: [
      'Joshua', 'Angelo', 'Christian', 'Gabriel', 'John Mark', 'Daniel', 'Elijah',
      'Angel', 'Althea', 'Princess', 'Samantha', 'Nicole', 'Bea', 'Jasmine'
    ],
    lastNames: [
      'Santos', 'Reyes', 'Cruz', 'Bautista', 'Ocampo', 'Garcia', 'Mendoza', 'Torres',
      'Tomas', 'Andres', 'Castillo', 'Flores', 'Villanueva', 'Ramos', 'Castro'
    ]
  },
  Indonesia: {
    stageNames: [
      'Rich Brian', 'Warren Hue', 'Ramengvrl', 'Hindia', 'NIKI', 'Feast Sound',
      'Pamungkas', 'Weird Genius', 'Dipha Barus', 'Tuan Tigabelas', 'Saykoji', 'Basboi'
    ],
    firstNames: [
      'Rizky', 'Dimas', 'Bintang', 'Aditya', 'Fajar', 'Bagus', 'Rian', 'Bayu',
      'Putri', 'Siti', 'Ayu', 'Nabila', 'Dewi', 'Indah', 'Lestari', 'Citra'
    ],
    lastNames: [
      'Pratama', 'Wijaya', 'Saputra', 'Kusuma', 'Hidayat', 'Santoso', 'Setiawan', 'Nugroho',
      'Lestari', 'Firmansyah', 'Suryadi', 'Maulana', 'Gunawan', 'Wibowo'
    ]
  },
  'Turquía': {
    stageNames: [
      'Ezhel', 'UZI', 'Murda', 'cakal', 'Motive', 'Sefo', 'Reynmen', 'Lvbel C5',
      'Ceza', 'Sagopa Kajmer', 'Khontkar', 'Batuflex', 'Heijan', 'Muti', 'Killa Hakan'
    ],
    firstNames: [
      'Emir', 'Yusuf', 'Eren', 'Mustafa', 'Burak', 'Can', 'Kerem', 'Arda',
      'Zeynep', 'Elif', 'Defne', 'Asra', 'Ece', 'Azra', 'Nehir', 'Merve'
    ],
    lastNames: [
      'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Yıldırım', 'Öztürk',
      'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin'
    ]
  },
  Polonia: {
    stageNames: [
      'Quebonafide', 'Taco Hemingway', 'Mata', 'Malik Montana', 'Bedoes', 'Sobel',
      'PRO8L3M', 'Żabson', 'White 2115', 'Oki', 'Szpaku', 'Kizo', 'Otsochodzi', 'Young Leosia'
    ],
    firstNames: [
      'Jakub', 'Jan', 'Aleksander', 'Antoni', 'Franciszek', 'Filip', 'Mikołaj', 'Wojciech',
      'Zuzanna', 'Julia', 'Maja', 'Hanna', 'Lena', 'Alicja', 'Maria', 'Oliwia'
    ],
    lastNames: [
      'Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski',
      'Zieliński', 'Szymański', 'Woźniak', 'Dąbrowski', 'Kozłowski', 'Jankowski'
    ]
  },
  Jamaica: {
    stageNames: [
      'Popcaan', 'Shenseea', 'Skillibeng', 'Vybz Kartel', 'Sean Paul', 'Koffee', 'Chronixx',
      'Damian Marley', 'Teejay', 'Masicka', 'Valiant', 'Buju Banton', 'Beenie Man', 'Protoje'
    ],
    firstNames: [
      'Andre', 'Damian', 'Marcus', 'Kemal', 'Javaughn', 'Oraine', 'Tafari', 'Romaine',
      'Shanice', 'Tanya', 'Chantelle', 'Jada', 'Keisha', 'Alicia', 'Britney'
    ],
    lastNames: [
      'Campbell', 'Brown', 'Williams', 'Johnson', 'Smith', 'Clarke', 'Davis', 'Miller',
      'Wright', 'Palmer', 'Simpson', 'Powell', 'Morgan', 'Grant', 'Gordon'
    ]
  }
};

/**
 * Genera nombres realistas y artísticos contextualizados por país y ciudad
 */
export function generateArtistName(country = 'Argentina', _city?: string): { stageName: string; realName: string } {
  const pool = REGIONAL_NAME_POOLS[country] || REGIONAL_NAME_POOLS['Argentina'];
  const stageName = pool.stageNames[Math.floor(Math.random() * pool.stageNames.length)];
  const firstName = pool.firstNames[Math.floor(Math.random() * pool.firstNames.length)];
  const lastName = pool.lastNames[Math.floor(Math.random() * pool.lastNames.length)];

  return {
    stageName,
    realName: `${firstName} ${lastName}`
  };
}

/**
 * Función helper de compatibilidad para generar nombres aleatorios por país o seed
 */
export function generateRandomArtistName(countryOrSeed: string | number = 'Argentina', city?: string): { stageName: string; realName: string } {
  if (typeof countryOrSeed === 'number') {
    const countries = Object.keys(REGIONAL_NAME_POOLS);
    const country = countries[countryOrSeed % countries.length];
    return generateArtistName(country, city);
  }
  return generateArtistName(countryOrSeed, city);
}

/**
 * Nombres de los meses del año en español
 */
export const SPANISH_MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
] as const;

/**
 * Abreviaturas de tres letras de los meses en español
 */
export const SPANISH_MONTHS_SHORT = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic'
] as const;

/**
 * Retorna el nombre completo del mes en español (1 = Enero, 12 = Diciembre)
 */
export function formatMonthName(month?: number | null): string {
  if (!month || isNaN(month)) return 'Enero';
  const idx = Math.max(0, Math.min(11, Math.floor(month) - 1));
  return SPANISH_MONTHS[idx];
}

/**
 * Retorna la abreviatura de tres letras del mes en español (1 = Ene, 12 = Dic)
 */
export function formatMonthShort(month?: number | null): string {
  if (!month || isNaN(month)) return 'Ene';
  const idx = Math.max(0, Math.min(11, Math.floor(month) - 1));
  return SPANISH_MONTHS_SHORT[idx];
}

export type ReleaseDateFormat = 'short' | 'long' | 'full' | 'badge' | 'monthYear';

/**
 * Formatea una fecha de lanzamiento / producción en español de manera consistente y legible.
 * - 'short': "Ene 2026"
 * - 'long' / 'monthYear': "Enero 2026"
 * - 'full': "Enero 2026 (Mes 1)"
 * - 'badge': "Mes 1 • Ene 2026"
 */
export function formatReleaseDate(
  month?: number | null,
  year?: number | null,
  format: ReleaseDateFormat = 'short'
): string {
  if (!year) {
    if (!month || isNaN(month)) return '';
    return formatMonthName(month);
  }

  if (!month || isNaN(month)) {
    return `${year}`;
  }

  const safeMonth = Math.max(1, Math.min(12, Math.floor(month)));
  const shortM = formatMonthShort(safeMonth);
  const fullM = formatMonthName(safeMonth);

  switch (format) {
    case 'long':
    case 'monthYear':
    case 'full':
      return `${fullM} ${year}`;
    case 'badge':
      return `${fullM} ${year}`;
    case 'short':
    default:
      return `${shortM} ${year}`;
  }
}

/**
 * Formatea el crédito del productor de una canción o proyecto discográfico.
 * - Si producerId corresponde a un productor del roster, devuelve su nombre comercial/limpio (o "Prod. [Nombre]").
 * - Si es autoproducida o no se especificó productor externo, devuelve "Autoproducido" o texto configurado.
 */
export function formatProducerCredit(
  producerId?: string | null,
  producers?: Record<string, { name: string; [key: string]: any }> | Array<{ id: string; name: string; [key: string]: any }>,
  options?: {
    short?: boolean;
    prefix?: boolean;
    selfProducedText?: string;
  }
): string {
  const {
    short = true,
    prefix = true,
    selfProducedText = 'Autoproducido'
  } = options || {};

  if (!producerId || producerId === 'self' || producerId === 'none' || producerId.trim() === '') {
    return selfProducedText;
  }

  let prodName = '';

  if (producers) {
    if (Array.isArray(producers)) {
      const found = producers.find(p => p.id === producerId);
      if (found) prodName = found.name;
    } else if (typeof producers === 'object' && producers[producerId]) {
      prodName = producers[producerId].name;
    }
  }

  // Fallback si no está en el mapa pero se proporcionó un ID con prefijo
  if (!prodName) {
    prodName = producerId.replace(/^prod_/, '').replace(/_/g, ' ');
    prodName = prodName.charAt(0).toUpperCase() + prodName.slice(1);
  }

  // Simplificar nombres largos con aclaraciones entre paréntesis (ej: "Nico 'Home Studio' (Beatmaker de Barrio)")
  if (short) {
    const parenIdx = prodName.indexOf('(');
    if (parenIdx > 0) {
      prodName = prodName.substring(0, parenIdx).trim();
    }
  }

  if (prefix) {
    return `Prod. ${prodName}`;
  }

  return prodName;
}

/**
 * Alias de compatibilidad para formatProducerCredit
 */
export const formatProducerLabel = formatProducerCredit;


