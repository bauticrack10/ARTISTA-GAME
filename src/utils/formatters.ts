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
    // Elimina espacios redundantes dentro de paréntesis: "( 15 )" -> "(15)", "(4 )" -> "(4)", "(+6M )" -> "(+6M)"
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    // Elimina espacios redundantes dentro de corchetes: "[ 01 ]" -> "[01]"
    .replace(/\[\s+/g, '[')
    .replace(/\s+\]/g, ']')
    // Normaliza signos de avance o modificadores: "(+ 1Y )" -> "(+1Y)", "(+ 6M )" -> "(+6M)", "(+6M )" -> "(+6M)"
    .replace(/\(\s*\+\s*([0-9]+[A-Za-z]+)\s*\)/g, '(+$1)')
    // Normaliza meses con números: "(MES 1 )" -> "(Mes 1)", "( MES 12)" -> "(Mes 12)"
    .replace(/\(\s*MES\s*([0-9]+)\s*\)/gi, '(Mes $1)')
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
    // Normaliza barras oblicuas en conteos: "1 /3" o "1 / 3" -> "1/3"
    .replace(/\s*\/\s*/g, '/')
    // Limpia espacios duplicados consecutivos
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
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
 * Elimina espacios innecesarios dentro de paréntesis
 */
export function cleanParentheses(text: string): string {
  if (!text) return '';
  return text.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');
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
export function formatCompactNumber(num: number): string {
  if (isNaN(num) || num === 0) return '0';
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
export function formatFans(count: number): string {
  const formatted = formatCompactNumber(count);
  return `${formatted} ${Math.abs(count) === 1 ? 'Fan' : 'Fans'}`;
}

/**
 * Formatea métrica de Oyentes Mensuales con etiqueta explícita
 * Ejemplo: formatListeners(25000) -> "25k Oyentes", formatListeners(1) -> "1 Oyente"
 */
export function formatListeners(count: number): string {
  const formatted = formatCompactNumber(count);
  return `${formatted} ${Math.abs(count) === 1 ? 'Oyente' : 'Oyentes'}`;
}

/**
 * Formatea métrica de Streams con etiqueta explícita
 * Ejemplo: formatStreams(80000) -> "80k Streams", formatStreams(1) -> "1 Stream"
 */
export function formatStreams(count: number): string {
  const formatted = formatCompactNumber(count);
  return `${formatted} ${Math.abs(count) === 1 ? 'Stream' : 'Streams'}`;
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
