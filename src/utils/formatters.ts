/**
 * Helper global de formateo, sanitización de strings y nombres contextuales
 * Proyecto: El Artista — Music Career Simulator
 */

/**
 * Sanitiza espacios parásitos dentro de paréntesis
 * Ejemplos: `( 15 )` -> `(15)`, `(MES 1 )` -> `(Mes 1)`, `(+ 1Y )` -> `(+1Y)`
 */
export function cleanParentheses(text: string): string {
  if (!text) return '';
  return text
    .replace(/\(\s*MES\s*(\d+)\s*\)/gi, '(Mes $1)')
    .replace(/\(\s*Mes\s*(\d+)\s*\)/gi, '(Mes $1)')
    .replace(/\(\s*\+\s*(\d+)\s*(Y|M|Años?|Meses?)\s*\)/gi, '(+$1$2)')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\(\s*([^\(\)]+?)\s*\)/g, '($1)');
}

/**
 * Sanitiza espacios parásitos dentro de comillas
 * Ejemplo: `" Cielo "` -> `"Cielo"`
 */
export function cleanQuotes(text: string): string {
  if (!text) return '';
  return text
    .replace(/"\s+([^"]*?)\s+"/g, '"$1"')
    .replace(/"\s+([^"]*?)"/g, '"$1"')
    .replace(/"([^"]*?)\s+"/g, '"$1"');
}

/**
 * Corrige duplicaciones de símbolos monetarios
 * Ejemplo: `$ $0` -> `$0`, `$$100` -> `$100`
 */
export function cleanCurrency(text: string): string {
  if (!text) return '';
  return text
    .replace(/\$\s*\$+/g, '$')
    .replace(/\$\s+(\d+)/g, '$$$1');
}

/**
 * Formatea tags de selección y conteo
 * Ejemplo: `1/3 seleccionados`
 */
export function cleanCountTag(count: number, total: number, suffix = 'seleccionados'): string {
  return `${count}/${total}${suffix ? ` ${suffix}` : ''}`;
}

/**
 * Sanitizador global completo que aplica todas las reglas de limpieza tipográfica
 */
export function sanitizeString(text: string): string {
  if (!text) return '';
  let result = text;
  result = cleanCurrency(result);
  result = cleanParentheses(result);
  result = cleanQuotes(result);
  // Normalizar dobles espacios accidentales
  result = result.replace(/ {2,}/g, ' ');
  return result;
}

/**
 * Formatea cantidades de dinero evitando duplicar el símbolo $
 */
export function formatMoney(amount: number): string {
  const safeAmount = isNaN(amount) ? 0 : Math.max(0, Math.floor(amount));
  return `$${safeAmount.toLocaleString('es-AR')}`;
}

/**
 * Formatea números grandes con sufijos compactos (k, M, B)
 */
export function formatCompactNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  const abs = Math.abs(num);
  if (abs >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2).replace(/\.00$/, '')}B`;
  }
  if (abs >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (abs >= 10_000) {
    return `${(num / 1_000).toFixed(0)}k`;
  }
  if (abs >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return num.toLocaleString('es-AR');
}

/**
 * Formatea métrica de Fans con etiqueta explícita
 */
export function formatFans(count: number): string {
  const formatted = formatCompactNumber(count);
  return `${formatted} ${count === 1 ? 'Fan' : 'Fans'}`;
}

/**
 * Formatea métrica de Oyentes Mensuales con etiqueta explícita
 */
export function formatListeners(count: number): string {
  const formatted = formatCompactNumber(count);
  return `${formatted} Oyentes`;
}

/**
 * Formatea métrica de Streams con etiqueta explícita
 */
export function formatStreams(count: number): string {
  const formatted = formatCompactNumber(count);
  return `${formatted} Streams`;
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
      'Duki Nova', 'Bizar', 'Khea Flow', 'Tiago Z', 'Milo J', 'Wosky', 'Trueno Sound', 'Cazzu V',
      'Ysy Vibe', 'Bhavi', 'Lucho SSJ', 'Ca7riel', 'Paco B', 'Seven Kayne', 'Zeballos', 'Dillom Ghost',
      'Neo Pistea', 'Tomi Trap', 'Enzo Flow', 'Ciro Sound', 'Valen Ghost', 'Jota Beats', 'Sombra Sur'
    ],
    firstNames: ['Mateo', 'Valentín', 'Ignacio', 'Facundo', 'Joaquín', 'Martín', 'Franco', 'Tomás', 'Santiago', 'Lucía', 'Martina', 'Camila', 'Sofía', 'Julieta'],
    lastNames: ['Palacios', 'Morales', 'Lombardo', 'Giménez', 'Castro', 'Rossi', 'Mendoza', 'Silva', 'Benítez', 'Navarro', 'Herrera', 'Alonso']
  },
  España: {
    stageNames: [
      'Quevedo Sound', 'Rels Vibe', 'Morad Kid', 'Saiko Flame', 'C. Tang', 'Dellafuente', 'Kidd Keo',
      'Cruz Cafuné', 'Recycled', 'Maikel Delacalle', 'Yung Beef', 'Soto Asa', 'Natos', 'Waor', 'Hard GZ'
    ],
    firstNames: ['Alejandro', 'Pablo', 'Daniel', 'Hugo', 'Lucas', 'Manuel', 'Álvaro', 'David', 'Paula', 'Sara', 'Elena', 'Carmen', 'Alba'],
    lastNames: ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín', 'Ruiz']
  },
  'Puerto Rico': {
    stageNames: [
      'Eladio V', 'Myke Wave', 'Mora Sound', 'Rauw Star', 'Jhayco', 'Álvaro Díaz', 'De La G',
      'Lunay', 'Brytiago', 'Noriel', 'Darell', 'Mikyle', 'Jova King', 'Jovany Flow', 'Tainy Kid'
    ],
    firstNames: ['Carlos', 'José', 'Luis', 'Ángel', 'Gabriel', 'Bryan', 'Kevin', 'Javier', 'Sebastián', 'Valeria', 'Alondra', 'Camila'],
    lastNames: ['Rivera', 'Ortiz', 'Torres', 'Colón', 'Morales', 'Reyes', 'Cruz', 'Santiago', 'Ramos', 'Díaz', 'Feliciano']
  },
  México: {
    stageNames: [
      'Natanael King', 'Junior H Flame', 'Peso Vibe', 'Gera MX Sound', 'Alemán Beat', 'Santa Fe Kid',
      'Gabito Ball', 'Tornillo', 'Eslabón Arm', 'Dan Sánchez', 'Fuerza R', 'Oscar Maydon', 'Victor Cibrian'
    ],
    firstNames: ['Emiliano', 'Santiago', 'Mateo', 'Leonardo', 'Diego', 'Sebastián', 'Rodrigo', 'Gael', 'Ximena', 'Valentina', 'Regina'],
    lastNames: ['Hernández', 'García', 'Martínez', 'López', 'González', 'Pérez', 'Rodríguez', 'Sánchez', 'Ramírez', 'Flores', 'Vázquez']
  },
  Colombia: {
    stageNames: [
      'Feid Wave', 'Blessd Kid', 'Ryan Flow', 'Manuel V', 'Kapla', 'Miky Wood', 'Nanpa',
      'Crissin', 'Totoy', 'Beéle Sound', 'Reykon King', 'Llane Star', 'Ovy Drums'
    ],
    firstNames: ['Juan', 'Andrés', 'David', 'Felipe', 'Camilo', 'Esteban', 'Nicolás', 'Daniel', 'Mariana', 'Salomé', 'Isabella'],
    lastNames: ['Gómez', 'Rodríguez', 'Zapata', 'Restrepo', 'Jaramillo', 'Ospina', 'Henao', 'Bedoya', 'Montoya', 'Castrillón']
  },
  Chile: {
    stageNames: [
      'Cris MJ Vibe', 'Standly', 'Polimá West', 'Pablo Chill-E', 'Pailita Kid', 'Jordan 23',
      'Harry Nach', 'Marcianeke', 'Galea Star', 'Kidd Voodoo', 'DrefQuila', 'Julianno'
    ],
    firstNames: ['Matías', 'Benjamín', 'Vicente', 'Agustín', 'Tomás', 'Joaquín', 'Cristóbal', 'Catalina', 'Constanza', 'Florencia'],
    lastNames: ['González', 'Muñoz', 'Rojas', 'Díaz', 'Pérez', 'Soto', 'Contreras', 'Silva', 'Martínez', 'Sepúlveda']
  },
  Uruguay: {
    stageNames: [
      'Zeballos Sound', 'Knack Vibe', 'Peke 77', 'Mesita Kid', 'Gula Beat', 'Agus Flow',
      'Millo V', 'Franux BB', 'Davo Star', 'Ciro Sound'
    ],
    firstNames: ['Facundo', 'Santiago', 'Mateo', 'Agustín', 'Lucas', 'Joaquín', 'Federico', 'Martina', 'Lucía', 'Julieta'],
    lastNames: ['Rodríguez', 'González', 'Fernández', 'López', 'Pérez', 'Martínez', 'García', 'Silva', 'Suárez', 'Olivera']
  },
  'República Dominicana': {
    stageNames: [
      'Rochy King', 'El Alfa Beat', 'Amenazzy Wave', 'Tokischa Star', 'Yailin Flow', 'Bulin Kid',
      'Jey One', 'Angel Dior', 'Tivi Gunz', 'Dowba Montana', 'Kiko El Crazy'
    ],
    firstNames: ['Kelvin', 'Manuel', 'Ángel', 'Jean', 'Carlos', 'José', 'Yohan', 'Yomaira', 'Génesis', 'Ashley'],
    lastNames: ['Rodríguez', 'Pérez', 'Martínez', 'García', 'Reyes', 'Díaz', 'Peña', 'Jiménez', 'Santana', 'Castillo']
  },
  'Estados Unidos': {
    stageNames: [
      'Neo Wolf', 'Vibe Kid', 'Aura Nova', 'Kidd Rush', 'Nova Silver', 'Jaxen Flame',
      'Zeta Black', 'Dante Vox', 'Kira Gold', 'Milo Cruz', 'Chase Wave', 'Ryder Stone'
    ],
    firstNames: ['Warren', 'Alexander', 'Ethan', 'Liam', 'Noah', 'Mason', 'Oliver', 'Lucas', 'Logan', 'Emma', 'Olivia', 'Ava', 'Sophia'],
    lastNames: ['Miller', 'Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas']
  },
  'Reino Unido': {
    stageNames: [
      'Storm Kid', 'Central Flow', 'Dave Wave', 'Aitch Beat', 'Skepta Sound', 'Headie Star',
      'Digga D', 'Russ Millions', 'ArrDee', 'K-Trap', 'Fred Again'
    ],
    firstNames: ['George', 'Harry', 'Jack', 'Oliver', 'Arthur', 'Leo', 'Oscar', 'Charlie', 'Amelia', 'Isla', 'Ava', 'Mia'],
    lastNames: ['Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Davies', 'Robinson', 'Wright', 'Thompson']
  }
};

/**
 * Genera nombres realistas contextualizados por país
 */
export function generateRandomArtistName(country = 'Argentina'): { stageName: string; realName: string } {
  const pool = REGIONAL_NAME_POOLS[country] || REGIONAL_NAME_POOLS['Argentina'];
  const stageName = pool.stageNames[Math.floor(Math.random() * pool.stageNames.length)];
  const firstName = pool.firstNames[Math.floor(Math.random() * pool.firstNames.length)];
  const lastName = pool.lastNames[Math.floor(Math.random() * pool.lastNames.length)];

  return {
    stageName,
    realName: `${firstName} ${lastName}`
  };
}
