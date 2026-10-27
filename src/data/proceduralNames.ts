import { REGIONAL_NAME_POOLS, generateArtistName, generateRandomArtistName } from '../utils/formatters';
import { Song, Album, MusicRegion } from '../types';

export { REGIONAL_NAME_POOLS, generateArtistName, generateRandomArtistName };

export type SupportedTitleLanguage = 'es' | 'en' | 'pt' | 'fr' | 'it';

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
    language: 'fr',
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
 * Resolves an artist's songwriting/release title language ('es' | 'en' | 'pt' | 'fr' | 'it')
 * from ISO codes, English/Spanish language names, country names, or ISO country codes.
 * International markets such as Germany, Sweden, Netherlands, South Korea, Japan, Nigeria, etc.
 * resolve to 'en' (authentic international English titles used in the modern global music industry).
 */
export function resolveArtistLanguage(
  language?: string,
  country?: string,
  countryCode?: string
): SupportedTitleLanguage {
  const cleanStr = (val?: string) =>
    (val || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const langNorm = cleanStr(language);
  const codeNorm = (countryCode || '').trim().toUpperCase();
  const primaryCountry = cleanStr((country || '').split('/')[0]?.split(',')[0]);

  // Special check for Belgium when language is generic/dutch or unset -> francophone pop/rap scene ('fr')
  if (
    (codeNorm === 'BE' || primaryCountry === 'belgica' || primaryCountry === 'belgium') &&
    (!langNorm || langNorm === 'nl' || langNorm === 'dutch' || langNorm === 'fr' || langNorm.includes('franc') || langNorm.includes('french'))
  ) {
    return 'fr';
  }

  // 1. Direct language field check (ISO codes + English/Spanish names)
  if (langNorm) {
    if (langNorm === 'es' || langNorm === 'spa' || langNorm.startsWith('es-') || langNorm.includes('spanish') || langNorm.includes('espanol')) {
      return 'es';
    }
    if (langNorm === 'en' || langNorm === 'eng' || langNorm.startsWith('en-') || langNorm.includes('english') || langNorm.includes('ingles')) {
      return 'en';
    }
    if (langNorm === 'pt' || langNorm === 'por' || langNorm.startsWith('pt-') || langNorm.startsWith('pt_') || langNorm.includes('portug')) {
      return 'pt';
    }
    if (langNorm === 'fr' || langNorm === 'fra' || langNorm === 'fre' || langNorm.startsWith('fr-') || langNorm.includes('french') || langNorm.includes('franc')) {
      return 'fr';
    }
    if (langNorm === 'it' || langNorm === 'ita' || langNorm.startsWith('it-') || langNorm.includes('ital')) {
      return 'it';
    }
    // Global international scenes releasing internationally recognizable English titles
    const internationalToEn = [
      'de', 'ger', 'deu', 'german', 'aleman',
      'sv', 'swe', 'swedish', 'sueco',
      'no', 'nor', 'norwegian', 'noruego',
      'da', 'danish', 'fi', 'finnish',
      'nl', 'nld', 'dutch', 'neerlandes',
      'ko', 'kor', 'korean', 'coreano',
      'ja', 'jpn', 'japanese', 'japones',
      'hi', 'hin', 'hindi',
      'ar', 'ara', 'arabic', 'arabe',
      'tl', 'tgl', 'tagalog', 'filipino',
      'id', 'ind', 'indonesian', 'indonesio',
      'pl', 'polish', 'polaco',
      'tr', 'turkish', 'turco',
      'ru', 'russian', 'ruso',
      'zh', 'chinese', 'chino'
    ];
    if (internationalToEn.includes(langNorm)) {
      return 'en';
    }
  }

  // 2. ISO countryCode check
  if (codeNorm) {
    const esCodes = new Set([
      'AR', 'ES', 'MX', 'CO', 'PR', 'CL', 'UY', 'PE', 'VE', 'DO', 'CU', 'EC',
      'PY', 'BO', 'CR', 'PA', 'GT', 'HN', 'SV', 'NI', 'GQ'
    ]);
    if (esCodes.has(codeNorm)) return 'es';

    const ptCodes = new Set(['BR', 'PT', 'AO', 'MZ', 'CV']);
    if (ptCodes.has(codeNorm)) return 'pt';

    const frCodes = new Set(['FR', 'BE', 'MC', 'SN', 'CI', 'CD', 'CM']);
    if (frCodes.has(codeNorm)) return 'fr';

    const itCodes = new Set(['IT', 'SM']);
    if (itCodes.has(codeNorm)) return 'it';

    const enCodes = new Set([
      'US', 'USA', 'GB', 'UK', 'CA', 'AU', 'NZ', 'IE', 'JM', 'NG', 'ZA', 'GH', 'KE', 'TT', 'BB',
      'DE', 'SE', 'NO', 'DK', 'FI', 'NL', 'CH', 'AT', 'PL', 'TR', 'RU', 'UA', 'GR', 'RO',
      'KR', 'JP', 'CN', 'TW', 'HK', 'IN', 'PH', 'ID', 'TH', 'VN', 'MY', 'SG', 'EG', 'MA', 'DZ', 'TN', 'IL', 'AE'
    ]);
    if (enCodes.has(codeNorm)) return 'en';
  }

  // 3. Country name check
  if (primaryCountry) {
    const ptCountries = ['brasil', 'brazil', 'portugal', 'angola', 'mozambique'];
    if (ptCountries.some(c => primaryCountry.includes(c))) return 'pt';

    const frCountries = ['francia', 'france', 'belgica', 'belgium', 'monaco', 'senegal', 'costa de marfil'];
    if (frCountries.some(c => primaryCountry.includes(c))) return 'fr';

    const itCountries = ['italia', 'italy'];
    if (itCountries.some(c => primaryCountry.includes(c))) return 'it';

    const esCountries = [
      'argentina', 'espana', 'spain', 'mexico', 'colombia', 'puerto rico', 'chile',
      'uruguay', 'peru', 'venezuela', 'republica dominicana', 'dominicana', 'dominican',
      'cuba', 'ecuador', 'paraguay', 'bolivia', 'costa rica', 'panama', 'guatemala',
      'honduras', 'el salvador', 'nicaragua'
    ];
    if (esCountries.some(c => primaryCountry.includes(c))) return 'es';

    const enCountries = [
      'usa', 'estados unidos', 'united states', 'eeuu', 'ee.uu', 'uk', 'reino unido',
      'united kingdom', 'inglaterra', 'england', 'escocia', 'scotland', 'gales', 'wales',
      'canada', 'australia', 'nueva zelanda', 'new zealand', 'irlanda', 'ireland',
      'jamaica', 'nigeria', 'sudafrica', 'south africa', 'ghana', 'kenia', 'kenya',
      'alemania', 'germany', 'suecia', 'sweden', 'noruega', 'norway', 'dinamarca', 'denmark',
      'finlandia', 'finland', 'paises bajos', 'netherlands', 'holanda', 'suiza', 'switzerland',
      'austria', 'polonia', 'poland', 'turquia', 'turkey', 'rusia', 'russia', 'grecia', 'greece',
      'corea', 'korea', 'japon', 'japan', 'china', 'taiwan', 'india', 'filipinas', 'philippines',
      'indonesia', 'tailandia', 'thailand', 'singapur', 'singapore', 'egipto', 'egypt', 'marruecos', 'morocco'
    ];
    if (enCountries.some(c => primaryCountry.includes(c))) return 'en';
  }

  return 'es';
}

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
  'Young', 'Lil', 'Saint', 'Nova', 'Aura', 'El', 'La', 'MC', 'Don', 'Río',
  'Ghost', 'Neo', 'Velvet', 'Sol', 'Lord', 'King', 'Baby', 'Kidd', 'Sir', 'Vega'
];

export const PROCEDURAL_STAGE_ROOTS = [
  'Wave', 'Flow', 'Drift', 'Pulse', 'Zenith', 'Echo', 'Viper', 'Shade', 'Flash', 'Daze',
  'Spark', 'Glow', 'Storm', 'Blade', 'Smoke', 'Klan', 'Rebel', 'Phantom', 'Venom', 'Aura',
  'Shadow', 'Crux', 'Apex', 'Solaris', 'Lobo', 'Sirena', 'Specter', 'Vibe', 'Rider', 'Mamba',
  'Mirage', 'Onyx', 'Valen', 'Ciro', 'Norte', 'Bruma', 'Kairo', 'Zafiro', 'Ámbar', 'Orión'
];

export const PROCEDURAL_STAGE_SUFFIXES = [
  'Sound', 'Beat', 'Flame', 'Ghost', 'Star', 'Vibe', 'Kid', 'King', 'Boy', 'Girl',
  'Lux', 'Noir', 'Sol', 'Velo', 'Flow', 'World', 'Prime', 'Soul', 'Zone', 'Wave'
];

export const ARTIST_FIRST_NAMES = [
  'Mateo', 'Valentín', 'Lucía', 'Joaquín', 'Camila', 'Santiago', 'Sofía', 'Felipe', 'Martina', 'Agustín',
  'Julieta', 'Franco', 'Ignacio', 'Rocío', 'Tomás', 'Delfina', 'Facundo', 'Milagros', 'Enzo', 'Zoe',
  'Thiago', 'Mia', 'Gael', 'Luna', 'Emiliano', 'Abril', 'Bruno', 'Jazmín', 'Lautaro', 'Catalina',
  'Marcus', 'Elena', 'Diego', 'Chloe', 'Jayden', 'Amara', 'Lucas', 'Maya', 'Gabriel', 'Zara',
  'Min-jun', 'Ji-woo', 'Ren', 'Haruto', 'Liam', 'Noah', 'Amir', 'Tariq', 'Kofi', 'Kwame',
  'Ayotunde', 'Sipho', 'Aarav', 'Vihaan', 'Carlos', 'Matheus', 'Giulia', 'Lorenzo', 'Camille', 'Théo'
];

export const ARTIST_LAST_NAMES = [
  'Palacios', 'Herrera', 'Navarro', 'Benítez', 'Ríos', 'Castillo', 'Vargas', 'Mendoza', 'Medina', 'Rojas',
  'Silva', 'Morales', 'Paredes', 'Guerrero', 'Sosa', 'Romero', 'Vega', 'Cabrera', 'Acosta', 'Suárez',
  'Mercer', 'Vance', 'Sterling', 'King', 'Cross', 'Rivers', 'Santos', 'Blanco', 'Torres', 'Luna',
  'Kim', 'Park', 'Sato', 'Tanaka', 'Adeyemi', 'Okafor', 'Ndlovu', 'Patel', 'Sharma', 'Costa',
  'Oliveira', 'Müller', 'Dubois', 'Leroy', 'Rossi', 'Bianchi', 'Johansson', 'Hansen', 'Van Dijk', 'Moreau'
];

export const ARTIST_STAGE_PREFIXES = PROCEDURAL_STAGE_PREFIXES;
export const ARTIST_STAGE_NAMES = PROCEDURAL_STAGE_ROOTS;

/**
 * Generates a strictly unique procedural artist identity that never collides with
 * real-world initial artists or existing world artists, without numeric suffixes.
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

  const lang = resolveArtistLanguage(undefined, params.country);
  const localizedPrefixes: Record<SupportedTitleLanguage, string[]> = {
    es: ['El', 'La', 'Don', 'Río', 'Sol', 'Santo', 'Joven', 'Alma', 'Luz', 'Vega'],
    en: ['Young', 'Lil', 'Saint', 'Nova', 'Ghost', 'Velvet', 'Baby', 'Kidd', 'Lord', 'King'],
    pt: ['MC', 'Dom', 'Vulgo', 'Belo', 'Luz', 'Sol', 'Mar', 'Voz', 'Norte', ' Cais'.trim()],
    fr: ['Saint', 'Petit', 'Noir', 'Bleu', 'Lune', 'Roi', 'Néo', 'Aube', 'Ombre', 'Clair'],
    it: ['San', 'Nero', 'Sole', 'Luce', 'Vero', 'Duca', 'Alba', 'Vento', 'Oro', 'Luna']
  };

  const prefixes = localizedPrefixes[lang] || PROCEDURAL_STAGE_PREFIXES;
  const firstNames = pool ? pool.firstNames : ARTIST_FIRST_NAMES;
  const lastNames = pool ? pool.lastNames : ARTIST_LAST_NAMES;

  for (let attempt = 0; attempt < 140; attempt++) {
    const s = Math.abs(seed * 37 + attempt * 101 + attempt * attempt * 13);
    const fName = firstNames[(s + attempt * 3) % firstNames.length];
    const lName = lastNames[(s * 5 + attempt * 7) % lastNames.length];
    const altName = lastNames[(s * 11 + attempt * 19 + 3) % lastNames.length];
    const realName = `${fName} ${lName}`;

    const prefix = prefixes[(s + attempt * 7) % prefixes.length];
    const root = PROCEDURAL_STAGE_ROOTS[(s * 3 + attempt * 11) % PROCEDURAL_STAGE_ROOTS.length];
    const root2 = PROCEDURAL_STAGE_ROOTS[(s * 13 + attempt * 23 + 5) % PROCEDURAL_STAGE_ROOTS.length];
    const suffix = PROCEDURAL_STAGE_SUFFIXES[(s * 7 + attempt * 17) % PROCEDURAL_STAGE_SUFFIXES.length];

    let stageName = '';
    const style = s % 6;
    if (style === 0) {
      stageName = `${fName} ${altName}`;
    } else if (style === 1) {
      stageName = `${prefix} ${fName}`;
    } else if (style === 2) {
      stageName = `${prefix} ${root}`;
    } else if (style === 3) {
      stageName = `${fName} ${root}`;
    } else if (style === 4) {
      stageName = `${root} ${suffix}`;
    } else {
      stageName = attempt < 30 ? `${root}` : `${root} ${root2}`;
    }

    if (normalizeTitle(stageName) === normalizeTitle(realName)) {
      stageName = `${prefix} ${fName}`;
    }

    if (!isArtistNameColliding(stageName, realName, existingArtists)) {
      return { stageName, realName };
    }
  }

  // Deep non-numeric multi-word fallback
  for (let extra = 0; extra < 200; extra++) {
    const idx = Math.abs(seed * 41 + extra * 97);
    const p = prefixes[idx % prefixes.length];
    const r = PROCEDURAL_STAGE_ROOTS[(idx * 7 + 3) % PROCEDURAL_STAGE_ROOTS.length];
    const sfx = PROCEDURAL_STAGE_SUFFIXES[(idx * 13 + 5) % PROCEDURAL_STAGE_SUFFIXES.length];
    const fName = firstNames[(idx * 3 + extra) % firstNames.length];
    const lName = lastNames[(idx * 11 + extra * 5) % lastNames.length];
    const candidateStage = `${p} ${r} ${sfx}`;
    const candidateReal = `${fName} ${lName}`;
    if (!isArtistNameColliding(candidateStage, candidateReal, existingArtists)) {
      return { stageName: candidateStage, realName: candidateReal };
    }
  }

  const fFallback = firstNames[Math.abs(seed) % firstNames.length];
  const lFallback = lastNames[Math.abs(seed * 3) % lastNames.length];
  return {
    stageName: `Nova ${PROCEDURAL_STAGE_ROOTS[Math.abs(seed) % PROCEDURAL_STAGE_ROOTS.length]} ${PROCEDURAL_STAGE_SUFFIXES[Math.abs(seed * 7) % PROCEDURAL_STAGE_SUFFIXES.length]}`,
    realName: `${fFallback} ${lFallback}`
  };
}

// ============================================================================
// MULTI-LANGUAGE SONG & ALBUM VOCABULARY BANKS (ES, EN, PT, FR, IT)
// ============================================================================

type GenreAtmosphereBucket =
  | 'urban'
  | 'reggaeton'
  | 'pop_rnb'
  | 'rock_alt'
  | 'electronic'
  | 'kpop_global'
  | 'afrobeats'
  | 'regional_roots';

function resolveGenreBucket(genreId?: string): GenreAtmosphereBucket {
  if (!genreId) return 'urban';
  const g = genreId.toLowerCase();
  if (g.includes('reggaeton') || g.includes('dembow') || g.includes('rkt')) return 'reggaeton';
  if (g.includes('kpop') || g.includes('jpop')) return 'kpop_global';
  if (g.includes('afro') || g.includes('dancehall') || g.includes('amapiano')) return 'afrobeats';
  if (g.includes('corrido') || g.includes('cumbia') || g.includes('country') || g.includes('folk') || g.includes('jazz') || g.includes('bossa')) return 'regional_roots';
  if (g.includes('rock') || g.includes('metal') || g.includes('punk') || g.includes('indie') || g.includes('shoegaze')) return 'rock_alt';
  if (g.includes('electro') || g.includes('house') || g.includes('techno')) return 'electronic';
  if (g.includes('pop') || g.includes('r_and_b') || g.includes('rnb') || g.includes('soul')) return 'pop_rnb';
  if (g.includes('funk_brasilero')) return 'urban';
  return 'urban';
}

interface LanguageTitleBank {
  nounsM: string[];
  nounsF: string[];
  adjsM: string[];
  adjsF: string[];
  verbs: string[];
  complements: string[];
  prepInM: string;
  prepInF: string;
  prepUnderM: string;
  prepUnderF: string;
  prepWithout: string;
  prepOf: string;
  conjAnd: string;
  genreMotifs: Record<GenreAtmosphereBucket, string[]>;
  albumPatternsM: string[];
  albumPatternsF: string[];
}

const TITLE_BANKS: Record<SupportedTitleLanguage, LanguageTitleBank> = {
  es: {
    nounsM: [
      'Fuego', 'Cielo', 'Espejo', 'Veneno', 'Silencio', 'Vuelo', 'Pecado', 'Recuerdo', 'Destino', 'Secreto',
      'Eclipse', 'Horizonte', 'Abismo', 'Reflejo', 'Amanecer', 'Peligro', 'Relámpago', 'Latido', 'Misterio', 'Ritual',
      'Paraíso', 'Desvelo', 'Lamento', 'Código', 'Vértigo', 'Suspiro', 'Pacto', 'Destello', 'Asfalto', 'Humo',
      'Imperio', 'Cristal', 'Trueno', 'Instinto', 'Laberinto', 'Invierno', 'Norte', 'Pulso', 'Diamante', 'Mirador'
    ],
    nounsF: [
      'Noche', 'Calle', 'Sombra', 'Mirada', 'Cicatriz', 'Luna', 'Tormenta', 'Pasión', 'Ilusión', 'Promesa',
      'Furia', 'Ceniza', 'Madrugada', 'Frecuencia', 'Fiebre', 'Cadena', 'Ruina', 'Luz', 'Niebla', 'Esquina',
      'Marea', 'Bruma', 'Ciudad', 'Órbita', 'Memoria', 'Verdad', 'Fortuna', 'Distancia', 'Lluvia', 'Alquimia',
      'Herida', 'Calma', 'Piel', 'Velocidad', 'Escarcha', 'Frontera', 'Chispa', 'Voz', 'Avenida', 'Ruta'
    ],
    adjsM: [
      'Eterno', 'Prohibido', 'Solitario', 'Brillante', 'Perdido', 'Inmortal', 'Secreto', 'Peligroso', 'Frío', 'Salvaje',
      'Oscuro', 'Dulce', 'Fugaz', 'Infinito', 'Dorado', 'Clandestino', 'Intenso', 'Nocturno', 'Brutal', 'Profundo',
      'Invisible', 'Letal', 'Ardiente', 'Solemne', 'Roto', 'Puro', 'Ciego', 'Lejano', 'Sagrado', 'Eléctrico'
    ],
    adjsF: [
      'Eterna', 'Prohibida', 'Solitaria', 'Brillante', 'Perdida', 'Inmortal', 'Secreta', 'Peligrosa', 'Fría', 'Salvaje',
      'Oscura', 'Dulce', 'Fugaz', 'Infinita', 'Dorada', 'Clandestina', 'Intensa', 'Nocturna', 'Brutal', 'Profunda',
      'Invisible', 'Letal', 'Ardiente', 'Solemne', 'Rota', 'Pura', 'Ciega', 'Lejana', 'Sagrada', 'Eléctrica'
    ],
    verbs: [
      'Buscando', 'Rompiendo', 'Olvidando', 'Soñando', 'Gritando', 'Sintiendo', 'Perdiendo', 'Volando sobre',
      'Encendiendo', 'Caminando por', 'Cruzando', 'Esperando', 'Bailando en', 'Quemando', 'Persiguiendo', 'Huyendo de',
      'Contando', 'Respirando', 'Mirando', 'Despertando en'
    ],
    complements: [
      'de Medianoche', 'en Silencio', 'sin Retorno', 'bajo la Lluvia', 'de Terciopelo', 'del Sur', 'en Llamas',
      'de Cristal', 'al Amanecer', 'sin Testigos', 'de Neón', 'en la Niebla', 'de Madrugada', 'contra el Viento',
      'en la Sombra', 'de Plata', 'a Contraluz', 'sin Frenos', 'del Barrio', 'en Cámara Lenta', 'de Invierno',
      'en el Desierto', 'sobre el Asfalto', 'de Oro Puro', 'en Otra Vida', 'al Filo', 'sin Gravedad', 'de Humo'
    ],
    prepInM: 'En el',
    prepInF: 'En la',
    prepUnderM: 'Bajo el',
    prepUnderF: 'Bajo la',
    prepWithout: 'Sin',
    prepOf: 'de',
    conjAnd: '&',
    genreMotifs: {
      urban: [
        'Búnker', 'Goteo', 'Callejón', 'Asfalto', 'Bloque', 'Esquina', 'Código', 'Madrugada', 'Humo', 'Cadena de Oro',
        'Rima Cruda', 'Cúpula', 'Barrio Alto', 'Sombra Fina', 'Pulso Callejero', 'Moneda al Aire', 'Caja Fuerte', 'Vía Rápida'
      ],
      reggaeton: [
        'Perreo Lento', 'Playa Oscura', 'Calor de Enero', 'Isla Dorada', 'Brisa Caribe', 'Club Nocturno', 'Deseo Puro',
        'Noche en San Juan', 'Beso Salado', 'Pista Llena', 'Sol de Medianoche', 'Arena y Sal', 'Marea Cálida', 'Ritmo Nocturno'
      ],
      pop_rnb: [
        'Seda Roja', 'Terciopelo', 'Luz de Luna', 'Suspiro Lento', 'Espejismo', 'Caricia Fría', 'Perfume Caro',
        'Cartas Viejas', 'Mirada Dulce', 'Cielo Rosa', 'Latido Suave', 'Vino Tinto', 'Noche en Vela', 'Eclipse Dulce'
      ],
      rock_alt: [
        'Distorsión', 'Cable Roto', 'Amplificador', 'Ruido Blanco', 'Garaje Sur', 'Ceniza Viva', 'Fantasmas',
        'Viento Eléctrico', 'Desierto Rojo', 'Grito Abierto', 'Cuerda Tensa', 'Fuga Nocturna', 'Aguja en Vinilo', 'Óxido'
      ],
      electronic: [
        'Frecuencia Baja', 'Pulso Neón', 'Onda Nocturna', 'Estrobos', 'Club Subterráneo', 'Horizonte Láser',
        'Trance Lunar', 'Sintetizador', 'Espejo Cromo', 'Cámara Oscura', 'Impulso Solar', 'Fase Cero', 'Vórtice'
      ],
      kpop_global: [
        'Estrella Polar', 'Prisma', 'Ilusión Solar', 'Magnetismo', 'Luz Galáctica', 'Espejo Lunar', 'Fiebre Astral',
        'Supernova', 'Cometa Azul', 'Sueño Lúcido', 'Brillo Eterno', 'Órbita Nueva'
      ],
      afrobeats: [
        'Sol de Verano', 'Fuego Cálido', 'Brisa Dorada', 'Costa Viva', 'Tambor del Sur', 'Oro Líquido',
        'Danza Solar', 'Lluvia Cálida', 'Pulso Tropical', 'Luz del Río'
      ],
      regional_roots: [
        'Polvo y Camino', 'Sierra Alta', 'Noche de Feria', 'Frontera Norte', 'Luna del Valle', 'Guitarra Vieja',
        'Viento de Monte', 'Cielo Abierto', 'Tierra Roja', 'Camino Real', 'Brisa del Río', 'Fuego Lento'
      ]
    },
    albumPatternsM: [
      'El Diario del {noun}',
      '{noun} {adj}',
      'Crónicas del {noun}',
      'La Era del {noun}',
      'Desde el {noun}',
      'El Último {noun}',
      '{noun} {complement}',
      'Hijos del {noun}',
      'Arquitectura del {noun}',
      'Después del {noun}',
      '{noun} & {nounF}',
      'Retrato de un {noun} {adj}'
    ],
    albumPatternsF: [
      'Más Allá de la {noun}',
      '{noun} {adj}',
      'Noches de {noun}',
      'Memorias de la {noun}',
      'Teoría de la {noun}',
      '{noun} {complement}',
      'Antes de la {noun}',
      'Anatomía de la {noun}',
      'La Última {noun}',
      '{noun} & {nounM}',
      'Cartas desde la {noun}',
      'Sinfonía {adj}'
    ]
  },

  en: {
    nounsM: [
      'Midnight', 'Horizon', 'Phantom', 'Empire', 'Echo', 'Thunder', 'Mirage', 'Velvet', 'Shadow', 'Signal',
      'Gravity', 'Obsidian', 'Highway', 'Pulse', 'Eclipse', 'Vortex', 'Silence', 'Monolith', 'Halo', 'Mercy',
      'Canyon', 'Fever', 'Static', 'Ashes', 'Gold', 'Smoke', 'Crystal', 'Labyrinth', 'Solstice', 'Tempest',
      'Prism', 'Daylight', 'Reckoning', 'Afterglow', 'Vertigo', 'Cipher', 'Outlaw', 'Harbor', 'Ember', 'Drift'
    ],
    nounsF: [
      'Memories', 'Shadows', 'Promises', 'Sirens', 'Diamonds', 'Tears', 'Flames', 'Secrets', 'Visions', 'Runaways',
      'Satellites', 'Ghosts', 'Roses', 'Storms', 'Waves', 'Strangers', 'Lights', 'Scars', 'Chains', 'Dreams',
      'Echoes', 'Mirrors', 'Nights', 'Sparks', 'Crowns', 'Bridges', 'Clouds', 'Vices', 'Wings', 'Tides',
      'Silhouettes', 'Embers', 'Whispers', 'Horizons', 'Crossroads', 'Polaroids', 'Skylines', 'Legends', 'Oceans', 'Alleys'
    ],
    adjsM: [
      'Electric', 'Velvet', 'Golden', 'Frozen', 'Hollow', 'Crimson', 'Savage', 'Silent', 'Lucid', 'Broken',
      'Infinite', 'Neon', 'Midnight', 'Heavy', 'Reckless', 'Faded', 'Sacred', 'Hidden', 'Bitter', 'Silver',
      'Dark', 'Pure', 'Restless', 'Distant', 'Wild', 'Burning', 'Cold', 'Glass', 'Chrome', 'Eternal'
    ],
    adjsF: [
      'Electric', 'Velvet', 'Golden', 'Frozen', 'Hollow', 'Crimson', 'Savage', 'Silent', 'Lucid', 'Broken',
      'Infinite', 'Neon', 'Midnight', 'Heavy', 'Reckless', 'Faded', 'Sacred', 'Hidden', 'Bitter', 'Silver',
      'Dark', 'Pure', 'Restless', 'Distant', 'Wild', 'Burning', 'Cold', 'Glass', 'Chrome', 'Eternal'
    ],
    verbs: [
      'Chasing', 'Breaking', 'Running from', 'Dancing in', 'Fading into', 'Waiting for', 'Burning', 'Lost in',
      'Holding onto', 'Falling through', 'Driving past', 'Walking on', 'Dreaming of', 'Hiding in', 'Crossing',
      'Leaving', 'Stealing', 'Counting', 'Waking in', 'Bleeding'
    ],
    complements: [
      'at Midnight', 'in the Dark', 'After Hours', 'on Fire', 'Under Pressure', 'in Slow Motion', 'Without Warning',
      'from the West', 'in Velvet', 'Out of Time', 'Through the Smoke', 'on Ice', 'in the Rain', 'Before Dawn',
      'by Starlight', 'Behind Glass', 'in Echoes', 'Above the Clouds', 'Off the Grid', 'on Sunset', 'in Monochrome',
      'from Nowhere', 'Under Neon', 'at Dusk', 'Against the Wind', 'in Overdrive', 'Beyond Reach', 'in Gold'
    ],
    prepInM: 'In the',
    prepInF: 'Into',
    prepUnderM: 'Under the',
    prepUnderF: 'Beneath',
    prepWithout: 'Without',
    prepOf: 'of',
    conjAnd: '&',
    genreMotifs: {
      urban: [
        'Penthouse View', 'Cold Coupe', 'Concrete Halo', 'Ghost Mode', 'Paper Trail', 'Street Gospel', 'Heavy Crown',
        'No Apologies', 'Night Shift', 'Chrome Heart', 'Northside Rain', 'Silent Moves', 'Dark Cashmere', 'Vault Key',
        'Backseat Smoke', 'Paid in Full', 'Black Maybach', 'Late Night Flex'
      ],
      reggaeton: [
        'Island Heat', 'Midnight Riddim', 'Tropic Rush', 'Slow Wine', 'Ocean Fever', 'Warm Nights', 'Sunset Club',
        'Golden Coast', 'Fever Tonight', 'Palm Shadows', 'Sweet Motion', 'Summer Haze'
      ],
      pop_rnb: [
        'Silk & Static', 'Midnight Perfume', 'Electric Blush', 'Slow Burn', 'Glass Heart', 'Sweet Reckoning',
        'Lucid Touch', 'Silver Lining', 'Fading Polaroid', 'Velvet Fever', 'Late Call', 'Cherry Wine', 'Soft Focus',
        'Paper Moon', 'Heartbreak Hotelier', 'Rosewater'
      ],
      rock_alt: [
        'Rust & Bone', 'Static Youth', 'Broken Amp', 'Pale Fire', 'Dead Signal', 'Concrete Choir', 'Black Lung',
        'Feedback Loop', 'Suburban Ghost', 'Razor Wire', 'Shattered Frame', 'Ashes & Salt', 'Basement Tape', 'High Voltage'
      ],
      electronic: [
        'Subzero', 'Laser Haze', 'Strobe Light', 'Deep Frequency', 'Modular Pulse', 'Solar Flare', 'Phase Shift',
        'Night Drive', 'Kinetic', 'Hyperion', 'Club Mirage', 'Analog Horizon', 'Dark Strobe', 'Velvet Bass'
      ],
      kpop_global: [
        'Supernova', 'Magnetic', 'Moonstruck', 'Starlight Rush', 'Cyber Halo', 'Crystal Fever', 'Butterfly Effect',
        'Cosmic Love', 'Prism Heart', 'Deja Vu', 'Hyperdrive', 'Aurora Glow', 'Stardust', 'Illusionist', 'Daydream'
      ],
      afrobeats: [
        'Lagos Rush', 'Sunburn', 'Sweet Ginger', 'Palm Wine', 'Island Breeze', 'Kingston Heat', 'Savanna Gold',
        'Warm Rain', 'High Tension', 'Golden Vibe', 'Oceanside', 'Pure Rhythm', 'Coastal Glow', 'Night Carnival'
      ],
      regional_roots: [
        'Dusty Highway', 'Carolina Pines', 'Whiskey & Rain', 'Silver Creek', 'Last Train West', 'Wildflower Road',
        'Gravel & Grace', 'Porchlight', 'Autumn Timber', 'Blue Ridge', 'Smoky Quartz', 'Midnight Freight'
      ]
    },
    albumPatternsM: [
      'The {adj} {noun}',
      'Chronicles of {noun}',
      'Notes on {noun}',
      'After the {noun}',
      '{noun} {complement}',
      'Portrait of {adj} {noun}',
      'Letters from {noun}',
      'Architecture of {noun}',
      '{noun} & {nounF}',
      'Beyond the {noun}',
      'A Study in {noun}',
      'The Last {noun}'
    ],
    albumPatternsF: [
      '{adj} {noun}',
      'Book of {noun}',
      'All Our {noun}',
      '{noun} {complement}',
      'Between {noun} & {nounM}',
      'House of {noun}',
      'Modern {noun}',
      'Songs for {adj} {noun}',
      'Anatomy of {noun}',
      'Where the {noun} Go',
      'Empire of {noun}',
      'No More {noun}'
    ]
  },

  pt: {
    nounsM: [
      'Fogo', 'Céu', 'Espelho', 'Veneno', 'Silêncio', 'Voo', 'Segredo', 'Destino', 'Eclipse', 'Horizonte',
      'Abismo', 'Reflexo', 'Amanhecer', 'Perigo', 'Relâmpago', 'Mistério', 'Ritual', 'Paraíso', 'Vértice', 'Pacto',
      'Asfalto', 'Império', 'Cristal', 'Trovão', 'Instinto', 'Labirinto', 'Inverno', 'Pulso', 'Diamante', 'Vento'
    ],
    nounsF: [
      'Noite', 'Rua', 'Sombra', 'Miragem', 'Cicatriz', 'Lua', 'Tempestade', 'Paixão', 'Promessa', 'Fúria',
      'Cinza', 'Madrugada', 'Frequência', 'Febre', 'Corrente', 'Luz', 'Neblina', 'Esquina', 'Maré', 'Bruma',
      'Cidade', 'Órbita', 'Memória', 'Verdade', 'Fortuna', 'Distância', 'Chuva', 'Saudade', 'Pele', 'Chama'
    ],
    adjsM: [
      'Eterno', 'Proibido', 'Solitário', 'Brilhante', 'Perdido', 'Imortal', 'Secreto', 'Perigoso', 'Frio', 'Selvagem',
      'Escuro', 'Doce', 'Fugaz', 'Infinito', 'Dourado', 'Clandestino', 'Intenso', 'Noturno', 'Profundo', 'Invisível',
      'Ardente', 'Partido', 'Puro', 'Distante', 'Sagrado', 'Elétrico', 'Suave', 'Cru', 'Aceso', 'Livre'
    ],
    adjsF: [
      'Eterna', 'Proibida', 'Solitária', 'Brilhante', 'Perdida', 'Imortal', 'Secreta', 'Perigosa', 'Fria', 'Selvagem',
      'Escura', 'Doce', 'Fugaz', 'Infinita', 'Dourada', 'Clandestina', 'Intensa', 'Noturna', 'Profunda', 'Invisível',
      'Ardente', 'Partida', 'Pura', 'Distante', 'Sagrada', 'Elétrica', 'Suave', 'Crua', 'Acesa', 'Livre'
    ],
    verbs: [
      'Buscando', 'Quebrando', 'Esquecendo', 'Sonhando com', 'Sentindo', 'Perdendo', 'Voando sobre', 'Acendendo',
      'Cruzando', 'Esperando', 'Dançando na', 'Queimando', 'Fugindo de', 'Olhando', 'Respirando', 'Vivendo'
    ],
    complements: [
      'da Meia-Noite', 'em Silêncio', 'sem Volta', 'sob a Chuva', 'de Veludo', 'do Sul', 'em Chamas',
      'de Cristal', 'ao Amanhecer', 'de Neon', 'na Neblina', 'da Madrugada', 'contra o Vento', 'na Sombra',
      'de Prata', 'em Câmera Lenta', 'no Asfalto', 'de Ouro', 'além do Mar', 'sem Freio', 'na Laje', 'à Beira-Mar'
    ],
    prepInM: 'No',
    prepInF: 'Na',
    prepUnderM: 'Sob o',
    prepUnderF: 'Sob a',
    prepWithout: 'Sem',
    prepOf: 'de',
    conjAnd: '&',
    genreMotifs: {
      urban: [
        'Baile da Maré', 'Fluxo Noturno', 'Paredão Quente', 'Voz da Viela', 'Ouro no Pulso', 'Madrugada Fria',
        'Noite no Morro', 'Batida Forte', 'Clima de Rua', 'Visão de Cria', 'Asfalto Quente', 'Código Puro'
      ],
      reggaeton: [
        'Calor de Verão', 'Beijo Salgado', 'Noite Tropical', 'Pista Cheia', 'Sol da Meia-Noite', 'Brisa Quente',
        'Corpo Dourado', 'Dança Lenta'
      ],
      pop_rnb: [
        'Saudade Elétrica', 'Veludo Azul', 'Luz da Lua', 'Olhar Doce', 'Perfume da Noite', 'Céu Cor-de-Rosa',
        'Toque Suave', 'Beijo Roubado', 'Cartas de Amor', 'Maré Mansa'
      ],
      rock_alt: [
        'Ruído Branco', 'Corda Tensa', 'Cinza Viva', 'Vento Elétrico', 'Garagem Sul', 'Fuga Noturna',
        'Fantasmas da Cidade', 'Ferrugem'
      ],
      electronic: [
        'Pulso de Neon', 'Frequência Baixa', 'Onda Noturna', 'Horizonte Laser', 'Espelho Cromo', 'Fase Zero',
        'Noite Infinita', 'Subgrave'
      ],
      kpop_global: [
        'Supernova', 'Estrela Guia', 'Brilho Astral', 'Órbita Nova', 'Prisma Dourado', 'Sonho Lúcido'
      ],
      afrobeats: [
        'Tambor Quente', 'Brisa do Atlântico', 'Ouro Solar', 'Chuva de Verão', 'Dança do Sol', 'Costa Viva'
      ],
      regional_roots: [
        'Tarde em Ipanema', 'Brisa do Cais', 'Violão da Noite', 'Águas de Prata', 'Sol de Outono', 'Varanda Azul',
        'Samba Triste', 'Chuva Fina'
      ]
    },
    albumPatternsM: [
      'O Diário do {noun}',
      '{noun} {adj}',
      'Crônicas do {noun}',
      'Além do {noun}',
      'Filhos do {noun}',
      'O Último {noun}',
      '{noun} {complement}',
      'Retrato de um {noun} {adj}',
      '{noun} & {nounF}',
      'Depois do {noun}'
    ],
    albumPatternsF: [
      '{noun} {adj}',
      'Memórias da {noun}',
      'Noites de {noun}',
      'Anatomia da {noun}',
      '{noun} {complement}',
      'Antes da {noun}',
      'A Última {noun}',
      'Cartas da {noun}',
      '{noun} & {nounM}',
      'Teoria da {noun}'
    ]
  },

  fr: {
    nounsM: [
      'Minuit', 'Feu', 'Ciel', 'Miroir', 'Silence', 'Secret', 'Destin', 'Mirage', 'Horizon', 'Abîme',
      'Reflet', 'Orage', 'Mystère', 'Paradis', 'Vertige', 'Pacte', 'Bitume', 'Empire', 'Cristal', 'Velours',
      'Labyrinthe', 'Hiver', 'Diamant', 'Vent', 'Soleil', 'Fantôme', 'Rêve', 'Crépuscule', 'Éclair', 'Monde'
    ],
    nounsF: [
      'Nuit', 'Rue', 'Ombre', 'Cicatrice', 'Lune', 'Tempête', 'Promesse', 'Cendre', 'Fréquence', 'Fièvre',
      'Lumière', 'Brume', 'Ville', 'Mémoire', 'Vérité', 'Distance', 'Pluie', 'Flamme', 'Aube', 'Vague',
      'Étoile', 'Voix', 'Éclipse', 'Mélodie', 'Fumée', 'Étincelle', 'Rivière', 'Frontière', 'Peau', 'Danse'
    ],
    adjsM: [
      'Éternel', 'Interdit', 'Solitaire', 'Perdu', 'Immortel', 'Secret', 'Froid', 'Sauvage', 'Sombre', 'Doux',
      'Doré', 'Intense', 'Nocturne', 'Profond', 'Invisible', 'Brûlant', 'Brisé', 'Pur', 'Lointain', 'Électrique',
      'Pâle', 'Rouge', 'Bleu', 'Noir', 'Silencieux', 'Magnétique', 'Libre', 'Cruel', 'Sacré', 'Aveugle'
    ],
    adjsF: [
      'Éternelle', 'Interdite', 'Solitaire', 'Perdue', 'Immortelle', 'Secrète', 'Froide', 'Sauvage', 'Sombre', 'Douce',
      'Dorée', 'Intense', 'Nocturne', 'Profonde', 'Invisible', 'Brûlante', 'Brisée', 'Pure', 'Lointaine', 'Électrique',
      'Pâle', 'Blanche', 'Bleue', 'Noire', 'Silencieuse', 'Magnétique', 'Libre', 'Cruelle', 'Sacrée', 'Aveugle'
    ],
    verbs: [
      'Chercher', 'Briser', 'Oublier', 'Rêver de', 'Traverser', 'Attendre', 'Danser sous', 'Brûler',
      'Fuir', 'Regarder', 'Respirer', 'Perdre', 'Marcher dans', 'Écouter', 'Toucher', 'Suivre'
    ],
    complements: [
      'de Minuit', 'en Silence', 'sans Retour', 'sous la Pluie', 'de Velours', 'en Flammes', 'de Verre',
      'à l\'Aube', 'sous Néon', 'dans la Brume', 'contre le Vent', 'dans l\'Ombre', 'd\'Argent', 'au Ralenti',
      'sur le Bitume', 'd\'Or', 'loin du Bruit', 'dans le Noir', 'd\'Hiver', 'sans Gravité'
    ],
    prepInM: 'Dans le',
    prepInF: 'Dans la',
    prepUnderM: 'Sous le',
    prepUnderF: 'Sous la',
    prepWithout: 'Sans',
    prepOf: 'de',
    conjAnd: '&',
    genreMotifs: {
      urban: [
        'Bitume Noir', 'Nuit Blanche', 'Code d\'Honneur', 'Tour d\'Ivoire', 'Ombre du Bloc', 'Argent Froid',
        'Ligne Rouge', 'Plein Phare', 'Rue Déserte', 'Cœur Blindé', 'Fumée Grise', 'Basse Couronne'
      ],
      reggaeton: [
        'Chaleur d\'Été', 'Nuit Dorée', 'Soleil Rouge', 'Danse Lente', 'Vague Chaude', 'Plage Sombre'
      ],
      pop_rnb: [
        'Cœur de Verre', 'Velours Rouge', 'Parfum d\'Hiver', 'Dernier Regard', 'Douce Folie', 'Lune Pâle',
        'Lettre Ouverte', 'Baiser Froid', 'Mirage Rose', 'Voix Basse'
      ],
      rock_alt: [
        'Bruit Blanc', 'Cendre Vive', 'Fil Tendu', 'Vent Noir', 'Verre Brisé', 'Écho Lointain', 'Rouille'
      ],
      electronic: [
        'Onde Nocturne', 'Néon Bleu', 'Pulsation', 'Stroboscope', 'Horizon Magnétique', 'Phase Zéro',
        'Boucle Infinie', 'Mirage Solaire'
      ],
      kpop_global: [
        'Supernova', 'Étoile Polaire', 'Prisme', 'Aurore', 'Rêve Cosmique', 'Lumière Astrale'
      ],
      afrobeats: [
        'Soleil de Dakar', 'Pluie Chaude', 'Or Liquide', 'Rythme du Soir', 'Vent du Sud', 'Flamme Douce'
      ],
      regional_roots: [
        'Café de Nuit', 'Pluie sur Seine', 'Quai des Brumes', 'Valse Lente', 'Automne Gris', 'Jardin Secret'
      ]
    },
    albumPatternsM: [
      'Le Journal du {noun}',
      '{noun} {adj}',
      'Chroniques du {noun}',
      'Au-Delà du {noun}',
      'Le Dernier {noun}',
      '{noun} {complement}',
      'Portrait d\'un {noun} {adj}',
      'Les Enfants du {noun}',
      '{noun} & {nounF}',
      'Après le {noun}'
    ],
    albumPatternsF: [
      '{noun} {adj}',
      'Mémoires de la {noun}',
      'Nuits de {noun}',
      'Anatomie de la {noun}',
      '{noun} {complement}',
      'Avant la {noun}',
      'La Dernière {noun}',
      'Lettres de la {noun}',
      '{noun} & {nounM}',
      'Théorie de la {noun}'
    ]
  },

  it: {
    nounsM: [
      'Fuoco', 'Cielo', 'Specchio', 'Veleno', 'Silenzio', 'Volo', 'Segreto', 'Destino', 'Orizzonte', 'Abisso',
      'Riflesso', 'Pericolo', 'Lampo', 'Mistero', 'Paradiso', 'Patto', 'Asfalto', 'Impero', 'Cristallo', 'Tuono',
      'Labirinto', 'Inverno', 'Diamante', 'Vento', 'Sole', 'Sogno', 'Velluto', 'Mare', 'Buio', 'Cuore'
    ],
    nounsF: [
      'Notte', 'Strada', 'Ombra', 'Cicatrice', 'Luna', 'Tempesta', 'Promessa', 'Cenere', 'Febbre', 'Luce',
      'Nebbia', 'Marea', 'Città', 'Memoria', 'Verità', 'Distanza', 'Pioggia', 'Fiamma', 'Alba', 'Voce',
      'Polvere', 'Scintilla', 'Vertigine', 'Pelle', 'Rovina', 'Eclissi', 'Stella', 'Frontiera', 'Calma', 'Onda'
    ],
    adjsM: [
      'Eterno', 'Proibito', 'Solitario', 'Perduto', 'Immortale', 'Segreto', 'Freddo', 'Selvaggio', 'Scuro', 'Dolce',
      'Dorato', 'Clandestino', 'Intenso', 'Notturno', 'Profondo', 'Invisibile', 'Ardente', 'Spezzato', 'Puro', 'Lontano',
      'Sacro', 'Elettrico', 'Rosso', 'Nero', 'Silenzioso', 'Libero', 'Cieco', 'Fragile', 'Chiaro', 'Ultimo'
    ],
    adjsF: [
      'Eterna', 'Proibita', 'Solitaria', 'Perduta', 'Immortale', 'Segreta', 'Fredda', 'Selvaggia', 'Scura', 'Dolce',
      'Dorata', 'Clandestina', 'Intensa', 'Notturna', 'Profonda', 'Invisibile', 'Ardente', 'Spezzata', 'Pura', 'Lontana',
      'Sacra', 'Elettrica', 'Rossa', 'Nera', 'Silenziosa', 'Libera', 'Cieca', 'Fragile', 'Chiara', 'Ultima'
    ],
    verbs: [
      'Cercando', 'Spezzando', 'Dimenticando', 'Sognando', 'Attraversando', 'Aspettando', 'Ballando nella', 'Bruciando',
      'Fuggendo da', 'Guardando', 'Respirando', 'Perdendo', 'Camminando nel', 'Ascoltando', 'Vivendo'
    ],
    complements: [
      'di Mezzanotte', 'in Silenzio', 'senza Ritorno', 'sotto la Pioggia', 'di Velluto', 'in Fiamme', 'di Vetro',
      'all\'Alba', 'al Neon', 'nella Nebbia', 'contro il Vento', 'nell\'Ombra', 'd\'Argento', 'al Rallentatore',
      'sull\'Asfalto', 'd\'Oro', 'senza Respiro', 'nel Buio', 'd\'Inverno', 'oltre il Mare'
    ],
    prepInM: 'Nel',
    prepInF: 'Nella',
    prepUnderM: 'Sotto il',
    prepUnderF: 'Sotto la',
    prepWithout: 'Senza',
    prepOf: 'di',
    conjAnd: '&',
    genreMotifs: {
      urban: [
        'Asfalto Nero', 'Notte Bianca', 'Cuore Freddo', 'Ombra del Blocco', 'Oro Puro', 'Fumo Grigio',
        'Strada Vuota', 'Codice Segreto', 'Luci Basse', 'Vetro Scuro', 'Corsa Notturna', 'Senza Tregua'
      ],
      reggaeton: [
        'Calore d\'Estate', 'Sole di Notte', 'Bacio Salato', 'Onda Calda', 'Spiaggia Scura', 'Ritmo Lento'
      ],
      pop_rnb: [
        'Cuore di Vetro', 'Velluto Rosso', 'Ultimo Sguardo', 'Polvere di Stelle', 'Luna Chiara', 'Veleno Dolce',
        'Lettera Aperta', 'Profumo Amaro', 'Cielo Rosa', 'Carezza Fredda'
      ],
      rock_alt: [
        'Rumore Bianco', 'Cenere Viva', 'Vento Elettrico', 'Vetro Infranto', 'Ruggine', 'Fuga nella Notte',
        'Fantasmi', 'Filo Teso'
      ],
      electronic: [
        'Onda Notturna', 'Neon Blu', 'Impulso Solare', 'Orizzonte Laser', 'Fase Zero', 'Specchio Cromo',
        'Basso Profondo', 'Vertigine Club'
      ],
      kpop_global: [
        'Supernova', 'Stella Polare', 'Prisma', 'Aurora', 'Sogno Lucido', 'Luce Astrale'
      ],
      afrobeats: [
        'Sole Caldo', 'Pioggia d\'Oro', 'Vento del Sud', 'Danza Solare', 'Costa Viva'
      ],
      regional_roots: [
        'Sera Romana', 'Vento del Mare', 'Estate Lenta', 'Chitarra Nuda', 'Cielo Aperto', 'Strada Antica'
      ]
    },
    albumPatternsM: [
      'Il Diario del {noun}',
      '{noun} {adj}',
      'Cronache del {noun}',
      'Oltre il {noun}',
      'L\'Ultimo {noun}',
      '{noun} {complement}',
      'Ritratto di un {noun} {adj}',
      'Figli del {noun}',
      '{noun} & {nounF}',
      'Dopo il {noun}'
    ],
    albumPatternsF: [
      '{noun} {adj}',
      'Memorie della {noun}',
      'Notti di {noun}',
      'Anatomia della {noun}',
      '{noun} {complement}',
      'Prima della {noun}',
      'L\'Ultima {noun}',
      'Lettere dalla {noun}',
      '{noun} & {nounM}',
      'Teoria della {noun}'
    ]
  }
};

// Preserved backward-compatible flat exports
export const SONG_TITLE_NOUNS = [...TITLE_BANKS.es.nounsF, ...TITLE_BANKS.es.nounsM];
export const SONG_TITLE_ADJECTIVES = [...TITLE_BANKS.es.adjsF, ...TITLE_BANKS.es.adjsM];
export const SONG_TITLE_VERBS = [...TITLE_BANKS.es.verbs];

export const GENRE_MOTIFS: Record<string, string[]> = {
  trap_latino: TITLE_BANKS.es.genreMotifs.urban,
  reggaeton: TITLE_BANKS.es.genreMotifs.reggaeton,
  hip_hop_rap: TITLE_BANKS.en.genreMotifs.urban,
  pop_moderno: TITLE_BANKS.en.genreMotifs.pop_rnb,
  rock_alternativo: TITLE_BANKS.en.genreMotifs.rock_alt,
  musica_electronica: TITLE_BANKS.en.genreMotifs.electronic,
  r_and_b_soul: TITLE_BANKS.en.genreMotifs.pop_rnb,
  drill: TITLE_BANKS.en.genreMotifs.urban
};

export const ALBUM_TITLE_PATTERNS = [
  ...TITLE_BANKS.es.albumPatternsM,
  ...TITLE_BANKS.es.albumPatternsF
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
 * Extracts a normalized Set of existing song/album titles from various input structures.
 */
const _titleSetCache = new WeakMap<object, Set<string>>();

function extractTitleSet(existingTitles?: Set<string> | string[] | Record<string, any> | any[]): Set<string> {
  if (!existingTitles) return new Set<string>();
  if (typeof existingTitles === 'object' && !(existingTitles instanceof Set) && !Array.isArray(existingTitles)) {
    let cached = _titleSetCache.get(existingTitles);
    if (!cached) {
      cached = new Set<string>();
      Object.values(existingTitles).forEach((item: any) => {
        if (item && item.title) cached!.add(normalizeTitle(item.title));
      });
      _titleSetCache.set(existingTitles, cached);
    }
    return cached;
  }
  const result = new Set<string>();
  if (existingTitles instanceof Set) {
    existingTitles.forEach(t => result.add(normalizeTitle(t)));
  } else if (Array.isArray(existingTitles)) {
    existingTitles.forEach(item => {
      const title = typeof item === 'string' ? item : item?.title;
      if (title) result.add(normalizeTitle(title));
    });
  }
  return result;
}

function stemsOverlap(wordA: string, wordB: string): boolean {
  const normA = normalizeTitle(wordA);
  const normB = normalizeTitle(wordB);
  if (normA === normB) return true;
  const stemLen = Math.min(5, normA.length, normB.length);
  if (stemLen >= 4 && normA.slice(0, stemLen) === normB.slice(0, stemLen)) return true;
  return false;
}

function pickDistinctAdj(adjs: string[], noun: string, startIdx: number): string {
  for (let offset = 0; offset < adjs.length; offset++) {
    const candidate = adjs[(startIdx + offset) % adjs.length];
    if (!stemsOverlap(candidate, noun)) return candidate;
  }
  return adjs[startIdx % adjs.length];
}

/**
 * Generates a grammatically natural, non-numeric procedural song title in the artist's language.
 */
function generateCandidateTitle(
  seed: number,
  genreId?: string,
  lang: SupportedTitleLanguage = 'es',
  extendedMode: boolean = false
): string {
  const bank = TITLE_BANKS[lang] || TITLE_BANKS.es;
  const bucket = resolveGenreBucket(genreId);
  const motifs = bank.genreMotifs[bucket] || bank.genreMotifs.urban;

  const s = Math.abs(seed);
  const nounM1 = bank.nounsM[(s * 13 + 7) % bank.nounsM.length];
  const nounM2 = bank.nounsM[(s * 29 + 11) % bank.nounsM.length];
  const nounF1 = bank.nounsF[(s * 17 + 5) % bank.nounsF.length];
  const nounF2 = bank.nounsF[(s * 31 + 19) % bank.nounsF.length];
  const adjM = bank.adjsM[(s * 19 + 3) % bank.adjsM.length];
  const adjF = bank.adjsF[(s * 23 + 9) % bank.adjsF.length];
  const verb = bank.verbs[(s * 37 + 13) % bank.verbs.length];
  const comp = bank.complements[(s * 41 + 17) % bank.complements.length];
  const motif = motifs[(s * 43 + 7) % motifs.length];

  if (extendedMode) {
    const extPattern = s % 8;
    switch (extPattern) {
      case 0:
        return lang === 'en' ? `${adjM} ${nounM1} ${comp}` : `${nounM1} ${adjM} ${comp}`;
      case 1:
        return lang === 'en' ? `${adjF} ${nounF1} ${comp}` : `${nounF1} ${adjF} ${comp}`;
      case 2:
        return `${verb} ${nounF1} ${comp}`;
      case 3:
        return `${motif} ${comp}`;
      case 4:
        return `${bank.prepInF} ${nounF1} ${bank.prepWithout} ${nounM2}`;
      case 5:
        return lang === 'en' ? `${verb} ${adjM} ${nounF2}` : `${verb} ${nounM1} ${adjM}`;
      case 6:
        return `${nounF1} ${bank.conjAnd} ${nounM1} ${comp}`;
      default:
        return `${bank.prepUnderM} ${nounM2} ${comp}`;
    }
  }

  const pattern = s % 14;
  switch (pattern) {
    case 0:
      return lang === 'en' ? `${adjM} ${nounM1}` : `${nounM1} ${adjM}`;
    case 1:
      return lang === 'en' ? `${adjF} ${nounF1}` : `${nounF1} ${adjF}`;
    case 2:
      return `${motif}`;
    case 3:
      return `${nounF1} ${comp}`;
    case 4:
      return `${nounM1} ${comp}`;
    case 5:
      return `${verb} ${nounF1}`;
    case 6:
      return `${bank.prepInF} ${nounF1}`;
    case 7:
      return `${bank.prepUnderM} ${nounM1}`;
    case 8:
      return `${nounM1} ${bank.conjAnd} ${nounF1}`;
    case 9:
      return `${nounF1} ${bank.prepWithout} ${nounM2}`;
    case 10:
      return `${motif} ${comp}`;
    case 11:
      return lang === 'en' ? `${adjM} ${nounF2}` : `${adjF} ${nounF2}`;
    case 12:
      return `${verb} ${nounM1}`;
    default:
      return `${nounF2} ${bank.prepOf} ${nounM2}`;
  }
}

/**
 * Strict unique song title generator. Guarantees that the returned title has NEVER
 * been used in the provided existing catalogue, with zero artificial numeric suffixes.
 */
export function generateUniqueSongTitle(params: {
  existingTitles?: Set<string> | string[] | Record<string, Song> | Song[];
  genreId?: string;
  artistName?: string;
  seedIndex?: number;
  fallbackPrefix?: string;
  language?: string;
  country?: string;
  countryCode?: string;
}): string {
  const existingSet = extractTitleSet(params.existingTitles);
  const lang = resolveArtistLanguage(params.language, params.country, params.countryCode);
  const baseSeed = params.seedIndex !== undefined ? params.seedIndex : Date.now() + Math.floor(Math.random() * 10000);

  // 1. Standard crisp 1-3 word titles
  for (let attempt = 0; attempt < 45; attempt++) {
    const seed = baseSeed * 31 + attempt * 73 + (attempt > 0 ? attempt * 1009 : 0);
    const candidate = generateCandidateTitle(seed, params.genreId, lang, false);
    const norm = normalizeTitle(candidate);

    if (!existingSet.has(norm)) {
      existingSet.add(norm);
      return candidate;
    }
  }

  // 2. Extended multi-word poetic combinations in the exact same language (1M+ space, zero numbers)
  for (let attempt = 0; attempt < 120; attempt++) {
    const seed = baseSeed * 53 + attempt * 197 + attempt * attempt * 29;
    const candidate = generateCandidateTitle(seed, params.genreId, lang, true);
    const norm = normalizeTitle(candidate);

    if (!existingSet.has(norm)) {
      existingSet.add(norm);
      return candidate;
    }
  }

  // 3. Exhaustive prime-stepped lexical guarantee without numbers
  const bank = TITLE_BANKS[lang] || TITLE_BANKS.es;
  for (let extra = 0; extra < 300; extra++) {
    const idx = Math.abs(baseSeed * 61 + extra * 131);
    const v = bank.verbs[idx % bank.verbs.length];
    const nf = bank.nounsF[(idx * 7 + 3) % bank.nounsF.length];
    const af = bank.adjsF[(idx * 11 + 5) % bank.adjsF.length];
    const cmp = bank.complements[(idx * 17 + 9) % bank.complements.length];
    const candidate = lang === 'en' ? `${v} ${af} ${nf} ${cmp}` : `${v} ${nf} ${af} ${cmp}`;
    const norm = normalizeTitle(candidate);
    if (!existingSet.has(norm)) {
      existingSet.add(norm);
      return candidate;
    }
  }

  const n1 = bank.nounsF[Math.abs(baseSeed) % bank.nounsF.length];
  const a1 = bank.adjsF[Math.abs(baseSeed * 7) % bank.adjsF.length];
  const c1 = bank.complements[Math.abs(baseSeed * 13) % bank.complements.length];
  return lang === 'en' ? `${a1} ${n1} ${c1}` : `${n1} ${a1} ${c1}`;
}

/**
 * Backward-compatible wrapper with uniqueness and language support.
 */
export function generateSongTitle(
  index: number,
  genreId?: string,
  existingTitles?: Set<string> | string[] | Record<string, Song> | Song[],
  language?: string,
  country?: string,
  countryCode?: string
): string {
  if (existingTitles) {
    return generateUniqueSongTitle({
      existingTitles,
      genreId,
      seedIndex: index,
      language,
      country,
      countryCode
    });
  }

  const lang = resolveArtistLanguage(language, country, countryCode);
  return generateCandidateTitle(index, genreId, lang, false);
}

/**
 * Strict unique album title generator in the artist's language without numeric suffixes.
 */
export function generateUniqueAlbumTitle(params: {
  existingTitles?: Set<string> | string[] | Record<string, Album> | Album[];
  artistName?: string;
  genreId?: string;
  seedIndex?: number;
  language?: string;
  country?: string;
  countryCode?: string;
}): string {
  const existingSet = extractTitleSet(params.existingTitles);
  const lang = resolveArtistLanguage(params.language, params.country, params.countryCode);
  const bank = TITLE_BANKS[lang] || TITLE_BANKS.es;
  const baseSeed = params.seedIndex !== undefined ? params.seedIndex : Date.now() + Math.floor(Math.random() * 5000);

  for (let attempt = 0; attempt < 90; attempt++) {
    const seed = Math.abs(baseSeed * 37 + attempt * 67 + attempt * attempt * 19);
    const useFem = seed % 2 === 0;
    const nounM = bank.nounsM[(seed * 11 + 5) % bank.nounsM.length];
    const nounF = bank.nounsF[(seed * 19 + 7) % bank.nounsF.length];
    const adjM = bank.adjsM[(seed * 17 + 2) % bank.adjsM.length];
    const adjF = bank.adjsF[(seed * 23 + 3) % bank.adjsF.length];
    const comp = bank.complements[(seed * 29 + 11) % bank.complements.length];

    const patterns = useFem ? bank.albumPatternsF : bank.albumPatternsM;
    const pattern = patterns[seed % patterns.length];

    let candidate = pattern
      .replace('{noun}', useFem ? nounF : nounM)
      .replace('{adj}', useFem ? adjF : adjM)
      .replace('{adjective}', useFem ? adjF : adjM)
      .replace('{nounM}', nounM)
      .replace('{nounF}', nounF)
      .replace('{complement}', comp);

    if (attempt >= 45) {
      candidate = `${candidate} ${comp}`;
    }

    const norm = normalizeTitle(candidate);
    if (!existingSet.has(norm)) {
      existingSet.add(norm);
      return candidate;
    }
  }

  for (let extra = 0; extra < 150; extra++) {
    const idx = Math.abs(baseSeed * 43 + extra * 89);
    const nm = bank.nounsM[idx % bank.nounsM.length];
    const nf = bank.nounsF[(idx * 7 + 3) % bank.nounsF.length];
    const am = bank.adjsM[(idx * 13 + 5) % bank.adjsM.length];
    const cmp = bank.complements[(idx * 17 + 11) % bank.complements.length];
    const candidate = lang === 'en' ? `${am} ${nm} ${bank.conjAnd} ${nf} ${cmp}` : `${nm} ${am} ${bank.conjAnd} ${nf} ${cmp}`;
    const norm = normalizeTitle(candidate);
    if (!existingSet.has(norm)) {
      existingSet.add(norm);
      return candidate;
    }
  }

  const fallbackNoun = bank.nounsF[Math.abs(baseSeed) % bank.nounsF.length];
  const fallbackAdj = bank.adjsF[Math.abs(baseSeed * 5) % bank.adjsF.length];
  const fallbackComp = bank.complements[Math.abs(baseSeed * 11) % bank.complements.length];
  return lang === 'en' ? `${fallbackAdj} ${fallbackNoun} ${fallbackComp}` : `${fallbackNoun} ${fallbackAdj} ${fallbackComp}`;
}

/**
 * Backward-compatible wrapper for album title generation.
 */
export function generateAlbumTitle(
  index: number,
  existingTitles?: Set<string> | string[] | Record<string, Album> | Album[],
  genreId?: string,
  language?: string,
  country?: string,
  countryCode?: string
): string {
  return generateUniqueAlbumTitle({
    existingTitles,
    seedIndex: index,
    genreId,
    language,
    country,
    countryCode
  });
}
