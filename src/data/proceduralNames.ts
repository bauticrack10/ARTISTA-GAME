import { REGIONAL_NAME_POOLS, generateArtistName, generateRandomArtistName } from '../utils/formatters';
import { Song, Album, MusicRegion } from '../types';

export { REGIONAL_NAME_POOLS, generateArtistName, generateRandomArtistName };

export interface CountrySimulationData {
  country: string;
  cities: string[];
  countryCode: string;
  language: string;
  influenceRegions: MusicRegion[];
  typicalGenres: string[];
}

export const GLOBAL_COUNTRY_DATABASE: CountrySimulationData[] = [
  {
    country: 'Argentina',
    cities: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Mar del Plata'],
    countryCode: 'AR',
    language: 'es',
    influenceRegions: ['Argentina', 'LatinAmerica', 'Global'],
    typicalGenres: ['trap_latino', 'rock_alternativo', 'cumbia_tropical', 'pop_moderno', 'hip_hop_rap']
  },
  {
    country: 'México',
    cities: ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Tijuana', 'Culiacán', 'Puebla'],
    countryCode: 'MX',
    language: 'es',
    influenceRegions: ['Mexico', 'LatinAmerica', 'USA'],
    typicalGenres: ['corridos_urbanos', 'pop_moderno', 'trap_latino', 'cumbia_tropical', 'hip_hop_rap']
  },
  {
    country: 'España',
    cities: ['Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Granada', 'Las Palmas', 'Bilbao'],
    countryCode: 'ES',
    language: 'es',
    influenceRegions: ['Spain', 'Europe', 'LatinAmerica'],
    typicalGenres: ['trap_latino', 'pop_moderno', 'drill', 'rock_alternativo', 'musica_electronica', 'reggaeton']
  },
  {
    country: 'Puerto Rico',
    cities: ['San Juan', 'Carolina', 'Bayamón', 'Ponce', 'Caguas', 'Mayagüez'],
    countryCode: 'PR',
    language: 'es',
    influenceRegions: ['USA', 'LatinAmerica', 'Global'],
    typicalGenres: ['reggaeton', 'trap_latino', 'cumbia_tropical', 'pop_moderno']
  },
  {
    country: 'Colombia',
    cities: ['Medellín', 'Bogotá', 'Cali', 'Barranquilla', 'Cartagena'],
    countryCode: 'CO',
    language: 'es',
    influenceRegions: ['LatinAmerica', 'Global'],
    typicalGenres: ['reggaeton', 'trap_latino', 'cumbia_tropical', 'pop_moderno']
  },
  {
    country: 'Chile',
    cities: ['Santiago', 'Valparaíso', 'Concepción', 'Viña del Mar', 'Antofagasta'],
    countryCode: 'CL',
    language: 'es',
    influenceRegions: ['LatinAmerica'],
    typicalGenres: ['trap_latino', 'reggaeton', 'pop_moderno', 'rock_alternativo']
  },
  {
    country: 'Uruguay',
    cities: ['Montevideo', 'Punta del Este', 'Salto', 'Maldonado'],
    countryCode: 'UY',
    language: 'es',
    influenceRegions: ['LatinAmerica', 'Argentina'],
    typicalGenres: ['trap_latino', 'rock_alternativo', 'cumbia_tropical', 'hip_hop_rap']
  },
  {
    country: 'Brasil',
    cities: ['São Paulo', 'Río de Janeiro', 'Salvador', 'Belo Horizonte', 'Curitiba', 'Recife'],
    countryCode: 'BR',
    language: 'pt',
    influenceRegions: ['Brazil', 'LatinAmerica', 'Global'],
    typicalGenres: ['funk_brasilero', 'jazz_bossa', 'trap_latino', 'musica_electronica']
  },
  {
    country: 'USA',
    cities: ['New York', 'Los Angeles', 'Atlanta', 'Miami', 'Chicago', 'Houston', 'Nashville'],
    countryCode: 'US',
    language: 'en',
    influenceRegions: ['USA', 'Global'],
    typicalGenres: ['hip_hop_rap', 'pop_moderno', 'country_folk', 'r_and_b_soul', 'rock_alternativo', 'metal_punk', 'drill', 'musica_electronica']
  },
  {
    country: 'Canadá',
    cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary'],
    countryCode: 'CA',
    language: 'en',
    influenceRegions: ['USA', 'Global'],
    typicalGenres: ['pop_moderno', 'hip_hop_rap', 'r_and_b_soul', 'rock_alternativo', 'country_folk']
  },
  {
    country: 'UK',
    cities: ['Londres', 'Manchester', 'Birmingham', 'Glasgow', 'Bristol', 'Leeds'],
    countryCode: 'GB',
    language: 'en',
    influenceRegions: ['UK', 'Europe', 'Global'],
    typicalGenres: ['drill', 'rock_alternativo', 'pop_moderno', 'r_and_b_soul', 'musica_electronica', 'hip_hop_rap']
  },
  {
    country: 'Francia',
    cities: ['París', 'Marsella', 'Lyon', 'Toulouse', 'Niza'],
    countryCode: 'FR',
    language: 'fr',
    influenceRegions: ['Europe', 'Global'],
    typicalGenres: ['musica_electronica', 'hip_hop_rap', 'pop_moderno', 'drill', 'jazz_bossa']
  },
  {
    country: 'Alemania',
    cities: ['Berlín', 'Múnich', 'Hamburgo', 'Colonia', 'Frankfurt'],
    countryCode: 'DE',
    language: 'de',
    influenceRegions: ['Europe', 'Global'],
    typicalGenres: ['musica_electronica', 'metal_punk', 'hip_hop_rap', 'rock_alternativo', 'pop_moderno']
  },
  {
    country: 'Italia',
    cities: ['Milán', 'Roma', 'Nápoles', 'Turín', 'Florencia'],
    countryCode: 'IT',
    language: 'it',
    influenceRegions: ['Europe'],
    typicalGenres: ['pop_moderno', 'trap_latino', 'musica_electronica', 'rock_alternativo']
  },
  {
    country: 'Suecia',
    cities: ['Estocolmo', 'Gotemburgo', 'Malmö', 'Uppsala'],
    countryCode: 'SE',
    language: 'sv',
    influenceRegions: ['Europe', 'Global'],
    typicalGenres: ['pop_moderno', 'musica_electronica', 'metal_punk', 'rock_alternativo']
  },
  {
    country: 'Noruega',
    cities: ['Oslo', 'Bergen', 'Trondheim', 'Stavanger'],
    countryCode: 'NO',
    language: 'no',
    influenceRegions: ['Europe'],
    typicalGenres: ['musica_electronica', 'metal_punk', 'pop_moderno', 'rock_alternativo']
  },
  {
    country: 'Irlanda',
    cities: ['Dublín', 'Cork', 'Galway', 'Limerick'],
    countryCode: 'IE',
    language: 'en',
    influenceRegions: ['Europe', 'UK'],
    typicalGenres: ['rock_alternativo', 'country_folk', 'pop_moderno']
  },
  {
    country: 'Países Bajos',
    cities: ['Ámsterdam', 'Rotterdam', 'Utrecht', 'La Haya'],
    countryCode: 'NL',
    language: 'nl',
    influenceRegions: ['Europe', 'Global'],
    typicalGenres: ['musica_electronica', 'pop_moderno', 'hip_hop_rap']
  },
  {
    country: 'Bélgica',
    cities: ['Bruselas', 'Amberes', 'Gante', 'Lieja'],
    countryCode: 'BE',
    language: 'nl',
    influenceRegions: ['Europe'],
    typicalGenres: ['musica_electronica', 'hip_hop_rap', 'pop_moderno']
  },
  {
    country: 'Corea del Sur',
    cities: ['Seúl', 'Busan', 'Incheon', 'Daegu', 'Gwangju'],
    countryCode: 'KR',
    language: 'ko',
    influenceRegions: ['Asia', 'Global'],
    typicalGenres: ['kpop_jpop', 'pop_moderno', 'musica_electronica', 'hip_hop_rap']
  },
  {
    country: 'Japón',
    cities: ['Tokio', 'Osaka', 'Kioto', 'Yokohama', 'Nagoya', 'Fukuoka'],
    countryCode: 'JP',
    language: 'ja',
    influenceRegions: ['Asia', 'Global'],
    typicalGenres: ['kpop_jpop', 'rock_alternativo', 'musica_electronica', 'pop_moderno']
  },
  {
    country: 'Australia',
    cities: ['Sídney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaida'],
    countryCode: 'AU',
    language: 'en',
    influenceRegions: ['Asia', 'Global'],
    typicalGenres: ['rock_alternativo', 'pop_moderno', 'musica_electronica', 'hip_hop_rap']
  },
  {
    country: 'Nueva Zelanda',
    cities: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton'],
    countryCode: 'NZ',
    language: 'en',
    influenceRegions: ['Asia', 'Global'],
    typicalGenres: ['pop_moderno', 'rock_alternativo', 'country_folk']
  },
  {
    country: 'Nigeria',
    cities: ['Lagos', 'Abuya', 'Port Harcourt', 'Ibadan', 'Benin City'],
    countryCode: 'NG',
    language: 'en',
    influenceRegions: ['Africa', 'Global'],
    typicalGenres: ['afrobeat_dancehall', 'hip_hop_rap', 'musica_electronica']
  },
  {
    country: 'Sudáfrica',
    cities: ['Johannesburgo', 'Ciudad del Cabo', 'Durban', 'Pretoria', 'Soweto'],
    countryCode: 'ZA',
    language: 'en',
    influenceRegions: ['Africa', 'Global'],
    typicalGenres: ['afrobeat_dancehall', 'musica_electronica', 'hip_hop_rap']
  },
  {
    country: 'India',
    cities: ['Mumbai', 'Nueva Delhi', 'Bengaluru', 'Chennai', 'Kolkata'],
    countryCode: 'IN',
    language: 'hi',
    influenceRegions: ['Asia', 'Global'],
    typicalGenres: ['pop_moderno', 'musica_electronica', 'hip_hop_rap']
  },
  {
    country: 'República Dominicana',
    cities: ['Santo Domingo', 'Santiago de los Caballeros', 'La Romana', 'San Pedro de Macorís'],
    countryCode: 'DO',
    language: 'es',
    influenceRegions: ['LatinAmerica', 'USA'],
    typicalGenres: ['reggaeton', 'trap_latino', 'cumbia_tropical']
  },
  {
    country: 'Perú',
    cities: ['Lima', 'Arequipa', 'Trujillo', 'Cusco', 'Chiclayo'],
    countryCode: 'PE',
    language: 'es',
    influenceRegions: ['LatinAmerica'],
    typicalGenres: ['cumbia_tropical', 'trap_latino', 'rock_alternativo', 'reggaeton']
  },
  {
    country: 'Cuba',
    cities: ['La Habana', 'Santiago de Cuba', 'Camagüey', 'Holguín'],
    countryCode: 'CU',
    language: 'es',
    influenceRegions: ['LatinAmerica'],
    typicalGenres: ['cumbia_tropical', 'reggaeton', 'jazz_bossa']
  },
  {
    country: 'Venezuela',
    cities: ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay'],
    countryCode: 'VE',
    language: 'es',
    influenceRegions: ['LatinAmerica'],
    typicalGenres: ['trap_latino', 'reggaeton', 'cumbia_tropical']
  },
  {
    country: 'Ecuador',
    cities: ['Quito', 'Guayaquil', 'Cuenca', 'Manta'],
    countryCode: 'EC',
    language: 'es',
    influenceRegions: ['LatinAmerica'],
    typicalGenres: ['cumbia_tropical', 'trap_latino', 'pop_moderno']
  },
  {
    country: 'Portugal',
    cities: ['Lisboa', 'Oporto', 'Coímbra', 'Braga', 'Funchal'],
    countryCode: 'PT',
    language: 'pt',
    influenceRegions: ['Europe', 'Brazil'],
    typicalGenres: ['jazz_bossa', 'pop_moderno', 'hip_hop_rap', 'musica_electronica']
  },
  {
    country: 'Ghana',
    cities: ['Acra', 'Kumasi', 'Tamale', 'Sekondi-Takoradi'],
    countryCode: 'GH',
    language: 'en',
    influenceRegions: ['Africa'],
    typicalGenres: ['afrobeat_dancehall', 'hip_hop_rap']
  },
  {
    country: 'Jamaica',
    cities: ['Kingston', 'Montego Bay', 'Spanish Town', 'Portmore'],
    countryCode: 'JM',
    language: 'en',
    influenceRegions: ['LatinAmerica', 'USA', 'Africa'],
    typicalGenres: ['afrobeat_dancehall', 'reggaeton']
  },
  {
    country: 'Egipto',
    cities: ['El Cairo', 'Alejandría', 'Giza', 'Sharm El Sheikh'],
    countryCode: 'EG',
    language: 'ar',
    influenceRegions: ['Africa'],
    typicalGenres: ['afrobeat_dancehall', 'hip_hop_rap', 'musica_electronica']
  },
  {
    country: 'Marruecos',
    cities: ['Casablanca', 'Marrakech', 'Rabat', 'Tánger', 'Fez'],
    countryCode: 'MA',
    language: 'ar',
    influenceRegions: ['Africa', 'Europe'],
    typicalGenres: ['afrobeat_dancehall', 'hip_hop_rap', 'drill']
  },
  {
    country: 'Filipinas',
    cities: ['Manila', 'Quezon City', 'Cebú', 'Dávao'],
    countryCode: 'PH',
    language: 'tl',
    influenceRegions: ['Asia', 'USA'],
    typicalGenres: ['pop_moderno', 'hip_hop_rap', 'r_and_b_soul']
  },
  {
    country: 'Indonesia',
    cities: ['Yakarta', 'Surabaya', 'Bandung', 'Medan', 'Bali'],
    countryCode: 'ID',
    language: 'id',
    influenceRegions: ['Asia'],
    typicalGenres: ['pop_moderno', 'musica_electronica', 'rock_alternativo']
  }
];

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

/**
 * Validates whether a generated artist name or real name collides with existing artists
 */
export function isArtistNameColliding(
  candidateStageName: string,
  candidateRealName: string | undefined,
  existingArtists: Record<string, { name: string; realName?: string }>
): boolean {
  if (!candidateStageName) return true;
  const normStage = normalizeTitle(candidateStageName);
  const normReal = candidateRealName ? normalizeTitle(candidateRealName) : '';

  for (const a of Object.values(existingArtists)) {
    if (!a) continue;
    if (normalizeTitle(a.name) === normStage) return true;
    if (a.realName && normReal && normalizeTitle(a.realName) === normReal) return true;
    if (a.realName && normalizeTitle(a.realName) === normStage) return true;
    if (normalizeTitle(a.name) === normReal) return true;
  }
  return false;
}

export const PROCEDURAL_STAGE_PREFIXES = [
  'Young', 'Lil', 'Big', 'Saint', 'Nova', 'Aura', 'El', 'La', 'MC', 'Don',
  'Ghost', 'Neo', 'Dark', 'Cyber', 'Lord', 'King', 'Baby', 'Ultra', 'Sir', 'Kid'
];

export const PROCEDURAL_STAGE_ROOTS = [
  'Wave', 'Flow', 'Drift', 'Pulse', 'Zenith', 'Echo', 'Viper', 'Shade', 'Flash', 'Daze',
  'Spark', 'Glow', 'Storm', 'Blade', 'Smoke', 'Klan', 'Rebel', 'Phantom', 'Venom', 'Aura',
  'Shadow', 'Crux', 'Apex', 'Solaris', 'Lobo', 'Sirena', 'Specter', 'Vibe', 'Rider', 'Mamba'
];

export const PROCEDURAL_STAGE_SUFFIXES = [
  'Sound', 'Beat', 'Flame', 'Ghost', 'Star', 'Vibe', 'Kid', 'King', 'Boy', 'Girl',
  'X', '99', 'Zero', 'Pro', 'Flow', 'World', 'Prime', 'Soul', 'Zone', 'Wave'
];

export const ARTIST_FIRST_NAMES = [
  'Mateo', 'Valentín', 'Lucía', 'Joaquín', 'Camila', 'Santiago', 'Sofía', 'Felipe', 'Martina', 'Agustín',
  'Julieta', 'Franco', 'Ignacio', 'Rocío', 'Tomás', 'Delfina', 'Facundo', 'Milagros', 'Enzo', 'Zoe',
  'Thiago', 'Mia', 'Gael', 'Luna', 'Emiliano', 'Abril', 'Bruno', 'Jazmín', 'Lautaro', 'Catalina',
  'Marcus', 'Elena', 'Diego', 'Chloe', 'Jayden', 'Amara', 'Lucas', 'Maya', 'Gabriel', 'Zara',
  'Min-jun', 'Ji-woo', 'Ren', 'Haruto', 'Liam', 'Noah', 'Amir', 'Tariq', 'Kofi', 'Kwame',
  'Ayotunde', 'Sipho', 'Aarav', 'Vihaan', 'Carlos', 'Thiago', 'Matheus', 'Lucas', 'Enzo'
];

export const ARTIST_LAST_NAMES = [
  'Palacios', 'Herrera', 'Navarro', 'Benítez', 'Ríos', 'Castillo', 'Vargas', 'Mendoza', 'Medina', 'Rojas',
  'Silva', 'Morales', 'Paredes', 'Guerrero', 'Sosa', 'Romero', 'Vega', 'Cabrera', 'Acosta', 'Suárez',
  'Mercer', 'Vance', 'Sterling', 'King', 'Cross', 'Rivers', 'Santos', 'Blanco', 'Torres', 'Luna',
  'Kim', 'Park', 'Sato', 'Tanaka', 'Adeyemi', 'Okafor', 'Ndlovu', 'Patel', 'Sharma', 'Costa',
  'Oliveira', 'Müller', 'Dubois', 'Leroy', 'Rossi', 'Bianchi', 'Johansson', 'Hansen', 'Van Dijk'
];

export const ARTIST_STAGE_PREFIXES = PROCEDURAL_STAGE_PREFIXES;
export const ARTIST_STAGE_NAMES = PROCEDURAL_STAGE_ROOTS;

/**
 * Generates a strictly unique procedural artist identity that never collides with
 * real-world initial artists or existing world artists.
 */
export function generateUniqueProceduralArtistName(params: {
  country?: string;
  seed: number;
  existingArtists: Record<string, { name: string; realName?: string }>;
}): { stageName: string; realName: string } {
  const { seed, existingArtists } = params;
  const pool = params.country && REGIONAL_NAME_POOLS[params.country]
    ? REGIONAL_NAME_POOLS[params.country]
    : null;

  for (let attempt = 0; attempt < 80; attempt++) {
    const s = Math.abs(seed * 37 + attempt * 101 + attempt * attempt * 13);
    let stageName = '';

    const style = s % 5;
    const prefix = PROCEDURAL_STAGE_PREFIXES[(s + attempt * 7) % PROCEDURAL_STAGE_PREFIXES.length];
    const root = PROCEDURAL_STAGE_ROOTS[(s * 3 + attempt * 11) % PROCEDURAL_STAGE_ROOTS.length];
    const suffix = PROCEDURAL_STAGE_SUFFIXES[(s * 7 + attempt * 17) % PROCEDURAL_STAGE_SUFFIXES.length];

    if (style === 0) {
      stageName = `${prefix} ${root}`;
    } else if (style === 1) {
      stageName = `${root} ${suffix}`;
    } else if (style === 2) {
      stageName = `${root}`;
    } else if (style === 3) {
      stageName = `${prefix} ${suffix}`;
    } else {
      stageName = `${root} ${((s % 90) + 10)}`;
    }

    const firstNames = pool ? pool.firstNames : ARTIST_FIRST_NAMES;
    const lastNames = pool ? pool.lastNames : ARTIST_LAST_NAMES;
    const fName = firstNames[(s + attempt * 3) % firstNames.length];
    const lName = lastNames[(s * 5 + attempt * 7) % lastNames.length];
    const realName = `${fName} ${lName}`;

    if (!isArtistNameColliding(stageName, realName, existingArtists)) {
      return { stageName, realName };
    }
  }

  // Fallback unique hash suffix guarantee
  const hash = Math.abs(seed % 9000) + 1000;
  return {
    stageName: `Nova ${PROCEDURAL_STAGE_ROOTS[Math.abs(seed) % PROCEDURAL_STAGE_ROOTS.length]} ${hash}`,
    realName: `${ARTIST_FIRST_NAMES[Math.abs(seed) % ARTIST_FIRST_NAMES.length]} ${ARTIST_LAST_NAMES[Math.abs(seed * 3) % ARTIST_LAST_NAMES.length]}`
  };
}

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
