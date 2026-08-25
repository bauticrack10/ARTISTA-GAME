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
  'Young', 'Lil', 'El', 'La', 'Kid', 'Baby', 'Big', 'MC', 'Don', 'King',
  'Saint', 'Dark', 'Nova', 'Ultra', 'Lord', 'G', 'Cyber', 'Aura', 'Ghost', 'Neo'
];

export const ARTIST_STAGE_NAMES = [
  'Killa', 'Vibe', 'Zion', 'Aura', 'Fuego', 'Storm', 'Shadow', 'Blade', 'Flaco', 'Rider',
  'Echo', 'Drift', 'Phantom', 'Glow', 'Venom', 'Pulse', 'Spark', 'Zenith', 'Flow', 'Nova',
  'Bandido', 'Príncipe', 'Dorado', 'Klan', 'Rebel', 'Cruz', 'Mamba', 'Lobo', 'Sirena', 'Specter'
];

export const SONG_TITLE_NOUNS = [
  'Noche', 'Fuego', 'Calle', 'Estrellas', 'Dinero', 'Corazón', 'Cielo', 'Sombra', 'Laberinto', 'Diamantes',
  'Olvido', 'Mirada', 'Veneno', 'Silencio', 'Cicatriz', 'Vuelo', 'Luna', 'Tormenta', 'Pecado', 'Recuerdo',
  'Destino', 'Pasión', 'Ilusión', 'Secreto', 'Guerra', 'Trance', 'Sueño', 'Eclipse', 'Promesa', 'Furia',
  'Midnight', 'Highway', 'Gold', 'Ghosts', 'Addiction', 'Gravity', 'Mirage', 'Chaos', 'Empire', 'Memories'
];

export const SONG_TITLE_ADJECTIVES = [
  'Eterna', 'Maldita', 'Prohibida', 'Solitaria', 'Brillante', 'Perdida', 'Inmortal', 'Secreta', 'Peligrosa', 'Fría',
  'Salvaje', 'Oscura', 'Dulce', 'Triste', 'Fugaz', 'Infinita', 'Dorada', 'Clandestina', 'Real', 'Intensa',
  'Electric', 'Toxic', 'Savage', 'Velvet', 'Frozen', 'Heavy', 'Pure', 'Rebel', 'Fallen', 'Infinite'
];

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

export function generateRandomArtistName(seedIndex: number): { stageName: string; realName: string } {
  const isPrefix = seedIndex % 3 === 0;
  const isSolo = seedIndex % 5 === 0;
  const p = ARTIST_STAGE_PREFIXES[seedIndex % ARTIST_STAGE_PREFIXES.length];
  const s = ARTIST_STAGE_NAMES[(seedIndex * 7) % ARTIST_STAGE_NAMES.length];
  const f = ARTIST_FIRST_NAMES[(seedIndex * 13) % ARTIST_FIRST_NAMES.length];
  const l = ARTIST_LAST_NAMES[(seedIndex * 11) % ARTIST_LAST_NAMES.length];

  let stageName = `${p} ${s}`;
  if (isSolo) {
    stageName = s;
  } else if (!isPrefix) {
    stageName = `${f} ${s}`;
  }

  return {
    stageName,
    realName: `${f} ${l}`
  };
}

export function generateSongTitle(index: number, genreId?: string): string {
  const noun = SONG_TITLE_NOUNS[(index * 13 + 7) % SONG_TITLE_NOUNS.length];
  const adj = SONG_TITLE_ADJECTIVES[(index * 17 + 3) % SONG_TITLE_ADJECTIVES.length];
  const mod = index % 5;

  if (mod === 0) return `${noun} ${adj}`;
  if (mod === 1) return `En la ${noun}`;
  if (mod === 2) return `${adj} ${noun}`;
  if (mod === 3) return `${noun}`;
  return `${noun} Sin ${adj}`;
}

export function generateAlbumTitle(index: number): string {
  const noun = SONG_TITLE_NOUNS[(index * 11 + 5) % SONG_TITLE_NOUNS.length];
  const adj = SONG_TITLE_ADJECTIVES[(index * 19 + 2) % SONG_TITLE_ADJECTIVES.length];
  const pattern = ALBUM_TITLE_PATTERNS[index % ALBUM_TITLE_PATTERNS.length];

  return pattern
    .replace('{noun}', noun)
    .replace('{adjective}', adj)
    .replace('{number}', `${(index % 3) + 1}`);
}
