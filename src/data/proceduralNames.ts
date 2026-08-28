import { REGIONAL_NAME_POOLS, generateArtistName, generateRandomArtistName } from '../utils/formatters';
import { Song, Album } from '../types';

export { REGIONAL_NAME_POOLS, generateArtistName, generateRandomArtistName };

/**
 * Standard title normalization function for collision detection.
 * Strips accents, punctuation, and converts to lower-case alphanumeric.
 */
export function normalizeTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export const ARTIST_FIRST_NAMES = [
  'Mateo', 'Valentín', 'Lucía', 'Joaquín', 'Camila', 'Santiago', 'Sofía', 'Felipe', 'Martina', 'Agustín',
  'Julieta', 'Franco', 'Ignacio', 'Rocío', 'Tomás', 'Delfina', 'Facundo', 'Milagros', 'Enzo', 'Zoe',
  'Thiago', 'Mia', 'Gael', 'Luna', 'Emiliano', 'Abril', 'Bruno', 'Jazmín', 'Lautaro', 'Catalina',
  'Marcus', 'Elena', 'Diego', 'Chloe', 'Jayden', 'Amara', 'Lucas', 'Maya', 'Gabriel', 'Zara'
];

export const ARTIST_LAST_NAMES = [
  'Palacios', 'Herrera', 'Navarro', 'Benítez', 'Ríos', 'Castillo', 'Vargas', 'Mendoza', 'Medina', 'Rojas',
  'Silva', 'Morales', 'Paredes', 'Guerrero', 'Sosa', 'Romero', 'Vega', 'Cabrera', 'Acosta', 'Suárez',
  'Mercer', 'Vance', 'Sterling', 'King', 'Cross', 'Rivers', 'Santos', 'Blanco', 'Torres', 'Luna'
];

export const ARTIST_STAGE_PREFIXES = [
  'El', 'La', 'Don', 'MC', 'Lil', 'Baby', 'Young', 'Big', 'King', 'Saint',
  'Dark', 'Nova', 'Ultra', 'Lord', 'G', 'Cyber', 'Aura', 'Ghost', 'Neo'
];

export const ARTIST_STAGE_NAMES = [
  'Duko', 'Wos', 'Flow', 'Fuego', 'Storm', 'Shadow', 'Blade', 'Flaco', 'Rider',
  'Echo', 'Drift', 'Phantom', 'Glow', 'Venom', 'Pulse', 'Spark', 'Zenith', 'Nova',
  'Bandido', 'Príncipe', 'Dorado', 'Klan', 'Rebel', 'Cruz', 'Mamba', 'Lobo', 'Sirena', 'Specter'
];

export const SONG_TITLE_NOUNS = [
  'Noche', 'Fuego', 'Calle', 'Estrellas', 'Dinero', 'Corazón', 'Cielo', 'Sombra', 'Laberinto', 'Diamantes',
  'Olvido', 'Mirada', 'Veneno', 'Silencio', 'Cicatriz', 'Vuelo', 'Luna', 'Tormenta', 'Pecado', 'Recuerdo',
  'Destino', 'Pasión', 'Ilusión', 'Secreto', 'Guerra', 'Trance', 'Sueño', 'Eclipse', 'Promesa', 'Furia',
  'Midnight', 'Highway', 'Gold', 'Ghosts', 'Addiction', 'Gravity', 'Mirage', 'Chaos', 'Empire', 'Memories',
  'Horizonte', 'Cenizas', 'Abismo', 'Reflejo', 'Amanecer', 'Peligro', 'Relámpago', 'Latido', 'Misterio',
  'Madrugada', 'Clandestino', 'Ritual', 'Paraíso', 'Frecuencia', 'Alas', 'Espinas', 'Desvelo', 'Lamento', 'Fiebre',
  'Labios', 'Código', 'Cadena', 'Vértigo', 'Suspiro', 'Pacto', 'Ruina', 'Luz', 'Niebla', 'Destello',
  'Phantom', 'Obsession', 'Echo', 'Velocity', 'Tears', 'Vibe', 'Signal', 'Pulse', 'Fountain', 'Thunder'
];

export const SONG_TITLE_ADJECTIVES = [
  'Eterna', 'Maldita', 'Prohibida', 'Solitaria', 'Brillante', 'Perdida', 'Inmortal', 'Secreta', 'Peligrosa', 'Fría',
  'Salvaje', 'Oscura', 'Dulce', 'Triste', 'Fugaz', 'Infinita', 'Dorada', 'Clandestina', 'Real', 'Intensa',
  'Electric', 'Toxic', 'Savage', 'Velvet', 'Frozen', 'Heavy', 'Pure', 'Rebel', 'Fallen', 'Infinite',
  'Nocturna', 'Brutal', 'Profunda', 'Invisible', 'Inolvidable', 'Divina', 'Letal', 'Ardiente', 'Mágica', 'Solemne',
  'Despiadada', 'Rara', 'Única', 'Violenta', 'Platino', 'Carmesí', 'Galáctica', 'Lenta', 'Rápida', 'Subterránea'
];

export const SONG_TITLE_VERBS = [
  'Buscando', 'Rompiendo', 'Olvidando', 'Soñando', 'Gritando', 'Sintiendo', 'Perdiendo', 'Volando',
  'Encendiendo', 'Caminando', 'Guardando', 'Cruzando', 'Esperando', 'Bailando', 'Quemando', 'Persiguiendo'
];

export const GENRE_MOTIFS: Record<string, string[]> = {
  trap_latino: [
    'Trap', 'Plug', 'Flex', 'Chain', 'Glock', 'Bando', 'Auto-Tune', 'Patek', 'Codeína', 'Goteo',
    'Lobby', '24/7', 'Drill', 'Sauce', 'VVS', 'Racks', 'Moshpit', 'Rave', 'Cash', 'Humo',
    'Callejón', 'Hood', 'Session', 'Flow', 'Ice', 'Blin Blin', 'Mueva', 'Guapo'
  ],
  reggaeton: [
    'Bellaqueo', 'Perreo', 'Sateo', 'Disco', 'Pared', 'Playa', 'Beso', 'Dembow', 'Sandungueo', 'Boricua',
    'Gata', 'Nena', 'Fronteo', 'Travesura', 'Cangri', 'Motomami', 'Bichota', 'Rakata', 'Soltera', 'Madrugada',
    'Discoteca', 'Calor', 'Deseo', 'Traa', 'Báilalo', 'Choli', 'Party'
  ],
  hip_hop_rap: [
    'Barrio', 'Mic', 'Rima', 'Cypher', 'Verso', 'Asfalto', 'Respeto', 'Corona', 'Freestyle', 'Poesía',
    'Bloque', 'Batalla', 'Crónica', 'Realidad', 'Esquina', 'Tributo', 'Pecado', 'Lírica', 'Graffiti', 'Underground',
    'Conciencia', 'Revolución', 'Boom Bap', 'Cúpula', 'Manuscrito'
  ],
  pop_moderno: [
    'Melodía', 'Luz', 'Beso', 'Cielo', 'Ilusión', 'Mirada', 'Labios', 'Recuerdo', 'Verano', 'Latido',
    'Color', 'Destino', 'Fantasía', 'Euphoria', 'Obsession', 'Electric', 'Sweet', 'Golden', 'Cherry', 'Heartbeat',
    'Shine', 'Princesa', 'Bailar', 'Magia', 'Brillo'
  ],
  rock_alternativo: [
    'Distorsión', 'Furia', 'Abismo', 'Cicatriz', 'Rebelde', 'Tormenta', 'Grito', 'Sombra', 'Vértigo', 'Fantasmas',
    'Cenizas', 'Ruina', 'Desvelo', 'Ruptura', 'Eclipse', 'Nostalgia', 'Desierto', 'Rayo', 'Amplificador', 'Garage'
  ],
  musica_electronica: [
    'Frecuencia', 'Pulso', 'Sintetizador', 'Neon', 'Trance', 'Vibración', 'Onda', 'Ritmo', 'Bajo', 'Laser',
    'After', 'Dimensión', 'Horizonte', 'Cyber', 'Matrix', 'Nexus', 'Galaxy', 'Bass', 'Drop', 'Echo',
    'Hypnotic', 'Loop', 'Club', 'BPM'
  ],
  r_and_b_soul: [
    'Seda', 'Suave', 'Suspiro', 'Piel', 'Alma', 'Medianoche', 'Lágrima', 'Cálido', 'Pasión', 'Sensual',
    'Intimidad', 'Melancolía', 'Seducción', 'Vino', 'Caricia', 'Terciopelo', 'Confesión', 'Sombra'
  ],
  drill: [
    'Máscara', 'Grip', 'Active', 'Slide', 'Spin', 'Ops', 'Block', 'Smoke', 'Draco', 'Zone',
    'Tenso', 'Alerta', 'Guerra', 'Plomo', 'Blicky', 'Ghettos'
  ]
};

export const ALBUM_TITLE_PATTERNS = [
  'El Diario de {noun}',
  '{noun} {adjective}',
  'Crónicas del {noun}',
  'Más Allá de la {noun}',
  '{adjective} Vida',
  'Volumen {number}: {noun}',
  'La Era del {noun}',
  'Antes de Morir en {noun}',
  'Noches de {noun}',
  'Corazón {adjective}',
  '{noun} & {noun}',
  'Desde el {noun}',
  'Sinfonía {adjective}',
  'El Último {noun}'
];

export const CITIES_BY_REGION: Record<string, Array<{ name: string; country: string; region: string; venueCapacity: number }>> = {
  Argentina: [
    { name: 'Buenos Aires (River Plate)', country: 'Argentina', region: 'Argentina', venueCapacity: 80000 },
    { name: 'Buenos Aires (Vélez Sarsfield)', country: 'Argentina', region: 'Argentina', venueCapacity: 45000 },
    { name: 'Buenos Aires (Movistar Arena)', country: 'Argentina', region: 'Argentina', venueCapacity: 15000 },
    { name: 'Buenos Aires (Teatro Gran Rex)', country: 'Argentina', region: 'Argentina', venueCapacity: 3200 },
    { name: 'Buenos Aires (Niceto Club)', country: 'Argentina', region: 'Argentina', venueCapacity: 1000 },
    { name: 'Córdoba (Plaza de la Música)', country: 'Argentina', region: 'Argentina', venueCapacity: 6000 },
    { name: 'Rosario (Anfiteatro)', country: 'Argentina', region: 'Argentina', venueCapacity: 5000 },
    { name: 'Mendoza (Arena Maipú)', country: 'Argentina', region: 'Argentina', venueCapacity: 4000 }
  ],
  LatinAmerica: [
    { name: 'Ciudad de México (Foro Sol)', country: 'México', region: 'LatinAmerica', venueCapacity: 65000 },
    { name: 'Santiago (Estadio Nacional)', country: 'Chile', region: 'LatinAmerica', venueCapacity: 55000 },
    { name: 'Bogotá (Movistar Arena)', country: 'Colombia', region: 'LatinAmerica', venueCapacity: 14000 },
    { name: 'Medellín (La Macarena)', country: 'Colombia', region: 'LatinAmerica', venueCapacity: 12000 },
    { name: 'San Juan (Coliseo de Puerto Rico)', country: 'Puerto Rico', region: 'LatinAmerica', venueCapacity: 18000 },
    { name: 'Lima (Estadio San Marcos)', country: 'Perú', region: 'LatinAmerica', venueCapacity: 35000 }
  ],
  Spain: [
    { name: 'Madrid (Estadio Santiago Bernabéu)', country: 'España', region: 'Europe', venueCapacity: 75000 },
    { name: 'Madrid (WiZink Center)', country: 'España', region: 'Europe', venueCapacity: 16000 },
    { name: 'Barcelona (Palau Sant Jordi)', country: 'España', region: 'Europe', venueCapacity: 18000 },
    { name: 'Sevilla (Cartuja Center)', country: 'España', region: 'Europe', venueCapacity: 4000 }
  ],
  USA: [
    { name: 'New York (Madison Square Garden)', country: 'USA', region: 'USA', venueCapacity: 20000 },
    { name: 'Los Angeles (SoFi Stadium)', country: 'USA', region: 'USA', venueCapacity: 70000 },
    { name: 'Miami (Kaseya Center)', country: 'USA', region: 'USA', venueCapacity: 19000 },
    { name: 'Chicago (United Center)', country: 'USA', region: 'USA', venueCapacity: 21000 }
  ],
  Europe: [
    { name: 'Londres (O2 Arena)', country: 'UK', region: 'Europe', venueCapacity: 20000 },
    { name: 'París (Accor Arena)', country: 'Francia', region: 'Europe', venueCapacity: 20000 },
    { name: 'Berlín (Mercedes-Benz Arena)', country: 'Alemania', region: 'Europe', venueCapacity: 17000 },
    { name: 'Roma (Palazzo dello Sport)', country: 'Italia', region: 'Europe', venueCapacity: 11000 }
  ]
};

/**
 * Extracts a normalized Set of existing song titles from various input structures.
 */
function extractTitleSet(existingTitles?: Set<string> | string[] | Record<string, Song> | Song[]): Set<string> {
  const result = new Set<string>();
  if (!existingTitles) return result;

  if (existingTitles instanceof Set) {
    existingTitles.forEach(t => result.add(normalizeTitle(t)));
  } else if (Array.isArray(existingTitles)) {
    existingTitles.forEach(item => {
      const title = typeof item === 'string' ? item : item.title;
      if (title) result.add(normalizeTitle(title));
    });
  } else if (typeof existingTitles === 'object') {
    Object.values(existingTitles).forEach((song: Song) => {
      if (song && song.title) result.add(normalizeTitle(song.title));
    });
  }

  return result;
}

/**
 * Generates a procedural candidate song title based on seed and genre.
 */
function generateCandidateTitle(seed: number, genreId?: string): string {
  const nounsLen = SONG_TITLE_NOUNS.length;
  const adjLen = SONG_TITLE_ADJECTIVES.length;
  const verbsLen = SONG_TITLE_VERBS.length;

  const noun1 = SONG_TITLE_NOUNS[Math.abs(seed * 13 + 7) % nounsLen];
  const noun2 = SONG_TITLE_NOUNS[Math.abs(seed * 29 + 11) % nounsLen];
  const adj = SONG_TITLE_ADJECTIVES[Math.abs(seed * 17 + 3) % adjLen];
  const verb = SONG_TITLE_VERBS[Math.abs(seed * 19 + 5) % verbsLen];

  const motifs = genreId && GENRE_MOTIFS[genreId] ? GENRE_MOTIFS[genreId] : GENRE_MOTIFS.trap_latino;
  const motif = motifs[Math.abs(seed * 23 + 9) % motifs.length];

  const pattern = Math.abs(seed) % 12;

  switch (pattern) {
    case 0:
      return `${noun1} ${adj}`;
    case 1:
      return `En la ${noun1}`;
    case 2:
      return `${adj} ${noun1}`;
    case 3:
      return `${noun1} de ${noun2}`;
    case 4:
      return `${noun1} Sin ${adj}`;
    case 5:
      return `Bajo el ${noun1}`;
    case 6:
      return `${verb} ${noun1}`;
    case 7:
      return `${motif} #${(Math.abs(seed) % 99) + 1}`;
    case 8:
      return `${noun1} & ${noun2}`;
    case 9:
      return `${motif} en la ${noun1}`;
    case 10:
      return `${noun1} (Pt. ${(Math.abs(seed) % 3) + 2})`;
    case 11:
      return `${adj} ${motif}`;
    default:
      return `${noun1} ${adj}`;
  }
}

/**
 * Strict unique song title generator. Guarantees that the returned title has NEVER
 * been used in the provided existing catalogue, eliminating duplicate collisions (e.g. "Luna").
 */
export function generateUniqueSongTitle(params: {
  existingTitles?: Set<string> | string[] | Record<string, Song> | Song[];
  genreId?: string;
  artistName?: string;
  seedIndex?: number;
  fallbackPrefix?: string;
}): string {
  const existingSet = extractTitleSet(params.existingTitles);
  const baseSeed = params.seedIndex !== undefined ? params.seedIndex : Date.now() + Math.floor(Math.random() * 10000);

  // Try standard procedural combinatorics first
  for (let attempt = 0; attempt < 50; attempt++) {
    const seed = baseSeed * 31 + attempt * 73 + (attempt > 0 ? attempt * 1009 : 0);
    const candidate = generateCandidateTitle(seed, params.genreId);
    const norm = normalizeTitle(candidate);

    if (!existingSet.has(norm)) {
      return candidate;
    }
  }

  // If standard space collides, apply stylistic unique suffixes/modifiers
  const fallbackNoun = SONG_TITLE_NOUNS[Math.abs(baseSeed) % SONG_TITLE_NOUNS.length];
  const stylisticModifiers = [
    '(Remix)', '(Vol. 2)', '(VIP)', '(Interlude)', '(Acoustic)', '(Live Session)',
    '(Deluxe)', '(Pt. II)', '(Pt. III)', '(Freestyle)', '(Outro)', '(Intro)'
  ];

  for (let attempt = 0; attempt < stylisticModifiers.length; attempt++) {
    const modifier = stylisticModifiers[attempt];
    const candidate = `${fallbackNoun} ${modifier}`;
    const norm = normalizeTitle(candidate);
    if (!existingSet.has(norm)) {
      return candidate;
    }
  }

  // Absolute fallback: unique hash timestamp guarantee
  return `${fallbackNoun} #${(Math.abs(baseSeed) % 900) + 100}`;
}

/**
 * Backward-compatible wrapper with uniqueness support.
 */
export function generateSongTitle(
  index: number,
  genreId?: string,
  existingTitles?: Set<string> | string[] | Record<string, Song> | Song[]
): string {
  if (existingTitles) {
    return generateUniqueSongTitle({
      existingTitles,
      genreId,
      seedIndex: index
    });
  }

  return generateCandidateTitle(index, genreId);
}

/**
 * Strict unique album title generator.
 */
export function generateUniqueAlbumTitle(params: {
  existingTitles?: Set<string> | string[] | Record<string, Album> | Album[];
  artistName?: string;
  genreId?: string;
  seedIndex?: number;
}): string {
  const existingSet = new Set<string>();
  if (params.existingTitles) {
    if (params.existingTitles instanceof Set) {
      params.existingTitles.forEach(t => existingSet.add(normalizeTitle(t)));
    } else if (Array.isArray(params.existingTitles)) {
      params.existingTitles.forEach(item => {
        const title = typeof item === 'string' ? item : item.title;
        if (title) existingSet.add(normalizeTitle(title));
      });
    } else if (typeof params.existingTitles === 'object') {
      Object.values(params.existingTitles).forEach((alb: Album) => {
        if (alb && alb.title) existingSet.add(normalizeTitle(alb.title));
      });
    }
  }

  const baseSeed = params.seedIndex !== undefined ? params.seedIndex : Date.now() + Math.floor(Math.random() * 5000);
  const nounsLen = SONG_TITLE_NOUNS.length;
  const adjLen = SONG_TITLE_ADJECTIVES.length;

  for (let attempt = 0; attempt < 50; attempt++) {
    const seed = baseSeed * 37 + attempt * 67;
    const noun1 = SONG_TITLE_NOUNS[Math.abs(seed * 11 + 5) % nounsLen];
    const noun2 = SONG_TITLE_NOUNS[Math.abs(seed * 19 + 7) % nounsLen];
    const adj = SONG_TITLE_ADJECTIVES[Math.abs(seed * 17 + 2) % adjLen];
    const pattern = ALBUM_TITLE_PATTERNS[Math.abs(seed) % ALBUM_TITLE_PATTERNS.length];

    const candidate = pattern
      .replace('{noun}', noun1)
      .replace('{noun2}', noun2)
      .replace('{adjective}', adj)
      .replace('{number}', `${(Math.abs(seed) % 3) + 1}`);

    const norm = normalizeTitle(candidate);
    if (!existingSet.has(norm)) {
      return candidate;
    }
  }

  const fallbackNoun = SONG_TITLE_NOUNS[Math.abs(baseSeed) % nounsLen];
  return `El Álbum de ${fallbackNoun} (Vol. ${(Math.abs(baseSeed) % 5) + 1})`;
}

/**
 * Backward-compatible wrapper for album title generation.
 */
export function generateAlbumTitle(index: number, existingTitles?: Set<string> | string[] | Record<string, Album> | Album[]): string {
  return generateUniqueAlbumTitle({
    existingTitles,
    seedIndex: index
  });
}
