import { RecordLabel } from '../types';

export const INITIAL_LABELS: Record<string, RecordLabel> = {
  // --- DISTRIBUIDORAS DIGITALES (0k - 5k oyentes / Día 1) ---
  distro_sounddrop_free: {
    id: 'distro_sounddrop_free',
    name: 'SoundDrop Free',
    type: 'distributor',
    country: 'Global / Digital',
    prestige: 30,
    budget: 50000,
    marketingPower: 20,
    creativeFreedomAllowed: 100,
    rosterArtistIds: [],
    favoredGenreIds: [],
    minMonthlyListeners: 0,
    annualFee: 0,
    commissionPct: 15, // 85% regalías artista / 15% comisión
    advancePayment: 0,
    features: [
      'Cuota anual gratuita ($0/año)',
      '85% de regalías de streaming para el artista',
      '15% de comisión sobre ingresos por reproducción',
      '100% de propiedad y control de másters',
      'Distribución a Spotify, Apple Music, YouTube Music y TikTok'
    ],
    scoutingCriteria: 'Distribuidora digital gratuita ideal para artistas emergentes y proyectos de garaje. Sin cuota fija con 15% de comisión.'
  },

  distro_distrowave_pro: {
    id: 'distro_distrowave_pro',
    name: 'DistroWave Pro',
    type: 'distributor',
    country: 'Global / Digital',
    prestige: 50,
    budget: 150000,
    marketingPower: 35,
    creativeFreedomAllowed: 100,
    rosterArtistIds: [],
    favoredGenreIds: [],
    minMonthlyListeners: 0,
    annualFee: 20, // Cuota anual $20
    commissionPct: 0, // 100% regalías/másters, 0% comisión
    advancePayment: 0,
    features: [
      'Cuota anual plana de $20',
      '100% de regalías directas para el artista',
      '0% de comisión por streaming',
      'Lanzamientos ilimitados de singles, EPs y álbumes',
      '100% de retención de derechos másters y fonográficos'
    ],
    scoutingCriteria: 'Distribución profesional por suscripción anual plana de $20. Retén el 100% de tus regalías sin comisiones.'
  },

  distro_amusecloud_indie: {
    id: 'distro_amusecloud_indie',
    name: 'AmuseCloud Indie',
    type: 'distributor',
    country: 'Global / Digital',
    prestige: 62,
    budget: 300000,
    marketingPower: 52,
    creativeFreedomAllowed: 100,
    rosterArtistIds: [],
    favoredGenreIds: [],
    minMonthlyListeners: 0,
    annualFee: 35, // Cuota anual $35
    commissionPct: 0, // 100% regalías/másters, pitch a curadores
    advancePayment: 0,
    features: [
      'Cuota anual de $35',
      '100% de regalías discográficas directas',
      'Pitch directo a curadores de playlists editoriales',
      'Herramientas avanzadas de pre-save y analíticas de audiencia',
      'Soporte prioritario y entrega rápida a plataformas'
    ],
    scoutingCriteria: 'Distribuidora premium para proyectos independientes. Incluye herramientas de pitch editorial a curadores y 100% de regalías.'
  },

  // --- SELLOS INDEPENDIENTES LOCALES (5k - 25k oyentes) ---
  label_callejon_records: {
    id: 'label_callejon_records',
    name: 'Callejón Records',
    type: 'local_indie',
    country: 'Argentina',
    prestige: 60,
    budget: 100000,
    marketingPower: 58,
    creativeFreedomAllowed: 85, // 85% control creativo
    rosterArtistIds: [],
    favoredGenreIds: ['trap_latino', 'hip_hop_rap', 'drill', 'r_and_b_soul'],
    minMonthlyListeners: 5000, // 5k oyentes
    annualFee: 0,
    advancePayment: 2000, // Anticipo de $2.000
    commissionPct: 30, // 70% regalías artista / 30% sello
    features: [
      'Anticipo inicial de $2.000',
      '70% de regalías para el artista',
      '85% de libertad creativa y conceptual',
      'Grabación y mezcla en estudios barriales de la escena',
      'Red de contactos y difusión en el circuito underground'
    ],
    scoutingCriteria: 'Sello independiente barrial que impulsa talentos emergentes desde 5k oyentes con apoyo de producción local.'
  },

  label_bohemian_groove_local: {
    id: 'label_bohemian_groove_local',
    name: 'Bohemian Groove Local',
    type: 'local_indie',
    country: 'Argentina',
    prestige: 72,
    budget: 280000,
    marketingPower: 68,
    creativeFreedomAllowed: 80, // 80% control creativo
    rosterArtistIds: [],
    favoredGenreIds: ['trap_latino', 'pop_moderno', 'hip_hop_rap', 'musica_electronica', 'rock_alternativo'],
    minMonthlyListeners: 12000, // 12k oyentes
    annualFee: 0,
    advancePayment: 5000, // Anticipo de $5.000
    commissionPct: 35, // 65% regalías artista / 35% sello
    features: [
      'Anticipo de $5.000 para producción',
      '65% de regalías discográficas',
      '80% de libertad creativa',
      'Conexión con festivales locales y prensa especializada',
      'Prensado físico y campañas digitales de lanzamiento'
    ],
    scoutingCriteria: 'Sello indie consolidado en la escena local. Busca artistas en crecimiento con más de 12k oyentes mensuales.'
  },

  // --- SELLOS INDIES CONSAGRADOS & BOUTIQUES (25k - 100k oyentes) ---
  label_underground_syndicate: {
    id: 'label_underground_syndicate',
    name: 'Underground Syndicate Collective',
    type: 'boutique',
    country: 'Argentina / España',
    prestige: 58,
    budget: 250000,
    marketingPower: 48,
    creativeFreedomAllowed: 98,
    rosterArtistIds: [],
    favoredGenreIds: ['drill', 'trap_latino', 'hip_hop_rap'],
    minMonthlyListeners: 8000,
    annualFee: 0,
    advancePayment: 8000,
    commissionPct: 20, // 80% artista
    features: [
      'Colectivo subterráneo de culto',
      '98% de control creativo y visión estética',
      '80% de regalías discográficas',
      'Anticipo de $8.000',
      'Máxima credibilidad en la cultura urbana callejera'
    ],
    scoutingCriteria: 'Colectivo subterráneo que recluta artistas con alta credibilidad barrial sin exigir millones de oyentes iniciales.'
  },

  label_xl_recordings: {
    id: 'label_xl_recordings',
    name: 'XL Recordings & Beggars Group',
    type: 'boutique',
    country: 'UK',
    prestige: 91,
    budget: 1200000,
    marketingPower: 75,
    creativeFreedomAllowed: 95,
    rosterArtistIds: [],
    favoredGenreIds: ['rock_alternativo', 'musica_electronica', 'r_and_b_soul'],
    minMonthlyListeners: 30000,
    annualFee: 0,
    advancePayment: 30000,
    commissionPct: 25, // 75% artista
    features: [
      'Sello boutique de culto internacional',
      '95% de libertad artística absoluta',
      '75% de regalías discográficas',
      'Anticipo de $30.000',
      'Enfoque en obras maestras y alta trascendencia crítica'
    ],
    scoutingCriteria: 'Sello de culto internacional enfocado en obras de arte innovadoras y álbumes de alta trascendencia crítica.'
  },

  label_dale_play: {
    id: 'label_dale_play',
    name: 'Dale Play Records',
    type: 'indie',
    country: 'Argentina',
    prestige: 86,
    budget: 1800000,
    marketingPower: 88,
    creativeFreedomAllowed: 82,
    rosterArtistIds: ['artist_bizarrap', 'artist_bhavi', 'artist_milo_j', 'artist_ysy_a'],
    favoredGenreIds: ['trap_latino', 'hip_hop_rap', 'musica_electronica'],
    minMonthlyListeners: 50000,
    annualFee: 0,
    advancePayment: 45000,
    commissionPct: 35, // 65% artista
    features: [
      'Sello independiente líder del movimiento urbano argentino',
      '65% de regalías para el artista',
      '82% de libertad creativa',
      'Anticipo de $45.000',
      'Conexión directa con los mayores productores de la escena'
    ],
    scoutingCriteria: 'Sello independiente líder del movimiento urbano argentino. Gran equilibrio entre presupuesto, regalías justas y libertad conceptual.'
  },

  label_rimas_music: {
    id: 'label_rimas_music',
    name: 'Rimas Entertainment',
    type: 'indie',
    country: 'Puerto Rico / LatinAmerica',
    prestige: 94,
    budget: 4500000,
    marketingPower: 95,
    creativeFreedomAllowed: 78,
    rosterArtistIds: ['artist_bad_bunny'],
    favoredGenreIds: ['reggaeton', 'trap_latino', 'corridos_urbanos'],
    minMonthlyListeners: 100000,
    annualFee: 0,
    advancePayment: 120000,
    commissionPct: 30, // 70% artista
    features: [
      'Independencia masiva a escala de Major global',
      '70% de regalías para el artista',
      'Estrategia de vanguardia en streaming y giras en estadios',
      'Anticipo de $120.000',
      'Retención estratégica del control por parte del artista'
    ],
    scoutingCriteria: 'Independencia a escala de Major. Máxima visión estratégica en streaming y retención del control del artista.'
  },

  // --- MAJORS (100k+ oyentes) ---
  label_sony_columbia: {
    id: 'label_sony_columbia',
    name: 'Sony Music / Columbia Records',
    type: 'major',
    country: 'Global / USA',
    prestige: 95,
    budget: 5000000,
    marketingPower: 96,
    creativeFreedomAllowed: 40,
    rosterArtistIds: ['artist_rosalia', 'artist_travis_scott'],
    favoredGenreIds: ['pop_moderno', 'trap_latino', 'hip_hop_rap', 'r_and_b_soul'],
    minMonthlyListeners: 100000,
    annualFee: 0,
    advancePayment: 250000,
    commissionPct: 78, // 22% artista
    features: [
      'Presupuestos millonarios de marketing ($100k+)',
      'Rotación radial y playlists mundiales garantizadas',
      'Anticipo masivo de $250.000',
      'Infraestructura global de distribución de Sony Music'
    ],
    scoutingCriteria: 'Busca artistas con más de 100k oyentes con alto potencial de rotación radial y hits comerciales globales.'
  },

  label_universal_interscope: {
    id: 'label_universal_interscope',
    name: 'Universal / Interscope Records',
    type: 'major',
    country: 'Global / USA',
    prestige: 96,
    budget: 6000000,
    marketingPower: 98,
    creativeFreedomAllowed: 45,
    rosterArtistIds: ['artist_billie_eilish', 'artist_kendrick_lamar'],
    favoredGenreIds: ['pop_moderno', 'hip_hop_rap', 'rock_alternativo'],
    minMonthlyListeners: 120000,
    annualFee: 0,
    advancePayment: 300000,
    commissionPct: 80, // 20% artista
    features: [
      'La mayor discográfica mundial',
      'Colocación garantizada en playlists editoriales globales',
      'Mega anticipo de $300.000',
      'Campañas globales de prensa, sincronizaciones y televisión'
    ],
    scoutingCriteria: 'Grandes presupuestos de marketing y colocación en playlists editoriales mundiales a cambio de altos requisitos de entregas.'
  },

  label_warner_latam: {
    id: 'label_warner_latam',
    name: 'Warner Music Latina',
    type: 'major',
    country: 'LatinAmerica',
    prestige: 88,
    budget: 3500000,
    marketingPower: 89,
    creativeFreedomAllowed: 55,
    rosterArtistIds: ['artist_duki', 'artist_khea'],
    favoredGenreIds: ['trap_latino', 'reggaeton', 'pop_moderno'],
    minMonthlyListeners: 80000,
    annualFee: 0,
    advancePayment: 180000,
    commissionPct: 75, // 25% artista
    features: [
      'Dominio de los charts hispanohablantes',
      'Giras masivas por estadios y presencia en festivales de primera línea',
      'Anticipo de $180.000',
      'Alianzas con marcas líderes y patrocinios comerciales'
    ],
    scoutingCriteria: 'Enfoque en dominar los charts hispanohablantes con giras masivas y presencia en festivales de primera línea.'
  }
};
