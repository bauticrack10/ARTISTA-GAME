import { Genre, Artist, CareerEra, SubgenreDetail, DerivedSonicStyle } from '../types';

export const INITIAL_GENRES: Record<string, Genre> = {
  trap_latino: {
    id: 'trap_latino',
    name: 'Trap Latino',
    originCountry: 'Argentina / Puerto Rico',
    basePopularity: 82,
    currentPopularity: 84,
    growthRate: 1.2,
    lifecycle: 'mainstream',
    characteristics: ['808 distorsionados', 'hi-hats rápidos', 'letras de calle y autosuperación', 'melodías oscuras'],
    createdYear: 2016,
    aestheticTone: 'Urbano oscuro, joyas, autos veloces y barras crudas',
    subGenres: ['trap_clasico', 'rage_latino', 'plugg_argentino', 'trap_triste', 'drill_latino']
  },
  reggaeton: {
    id: 'reggaeton',
    name: 'Reggaetón & Urbano',
    originCountry: 'Puerto Rico / Colombia',
    basePopularity: 92,
    currentPopularity: 90,
    growthRate: 0.5,
    lifecycle: 'mainstream',
    characteristics: ['Dembow rítmico', 'sintetizadores veraniegos', 'temáticas de fiesta y romance'],
    createdYear: 1995,
    aestheticTone: 'Vibrante, caribeño, discoteca global',
    subGenres: ['reggaeton_clasico', 'perreo_neoperreo', 'reggaeton_romantico', 'mambo_urbano', 'dembow_fusion']
  },
  hip_hop_rap: {
    id: 'hip_hop_rap',
    name: 'Hip Hop & Rap',
    originCountry: 'USA',
    basePopularity: 88,
    currentPopularity: 87,
    growthRate: -0.2,
    lifecycle: 'classic',
    characteristics: ['Boom bap', 'storytelling lírico', 'samples de soul y funk', 'scratch'],
    createdYear: 1973,
    aestheticTone: 'Auténtico, cultural, poético y reflexivo',
    subGenres: ['boombap_lirico', 'conscious_rap', 'hardcore_hiphop', 'jazz_rap', 'southern_rap']
  },
  pop_moderno: {
    id: 'pop_moderno',
    name: 'Pop Moderno & Alt-Pop',
    originCountry: 'Global',
    basePopularity: 89,
    currentPopularity: 91,
    growthRate: 1.5,
    lifecycle: 'mainstream',
    characteristics: ['Ganchos melódicos adhesivos', 'producción pulida', 'estribillos universales'],
    createdYear: 1960,
    aestheticTone: 'Cinematográfico, sofisticado, masivo y reluciente',
    subGenres: ['pop_mainstream', 'synthpop', 'indie_pop', 'hyperpop', 'electropop']
  },
  r_and_b_soul: {
    id: 'r_and_b_soul',
    name: 'R&B & Neo-Soul',
    originCountry: 'USA / UK',
    basePopularity: 76,
    currentPopularity: 79,
    growthRate: 2.1,
    lifecycle: 'surging',
    characteristics: ['Armonías vocales profundas', 'grooves aterciopelados', 'bajos sinuosos'],
    createdYear: 1980,
    aestheticTone: 'Íntimo, sensual, nocturno y elegante',
    subGenres: ['rnb_contemporaneo', 'neo_soul', 'alt_rnb', 'lofi_soul']
  },
  rock_alternativo: {
    id: 'rock_alternativo',
    name: 'Rock Alternativo & Indie',
    originCountry: 'Argentina / UK / USA',
    basePopularity: 70,
    currentPopularity: 73,
    growthRate: 1.8,
    lifecycle: 'reviving',
    characteristics: ['Guitarras eléctricas enérgicas', 'baterías orgánicas', 'espíritu rebelde'],
    createdYear: 1985,
    aestheticTone: 'Garaje, pasional, analógico y crudo',
    subGenres: ['indie_rock', 'post_punk', 'grunge_revival', 'shoegaze']
  },
  musica_electronica: {
    id: 'musica_electronica',
    name: 'Electrónica & House',
    originCountry: 'Global / Alemania / UK',
    basePopularity: 78,
    currentPopularity: 82,
    growthRate: 2.4,
    lifecycle: 'surging',
    characteristics: ['Kick 4x4 hipnótico', 'drops envolventes', 'sintetizadores modulares'],
    createdYear: 1980,
    aestheticTone: 'Club nocturno, luces láser, éxtasis rave',
    subGenres: ['tech_house', 'melodic_techno', 'afro_house', 'drum_and_bass']
  },
  drill: {
    id: 'drill',
    name: 'Drill & Grime',
    originCountry: 'UK / USA / España',
    basePopularity: 65,
    currentPopularity: 71,
    growthRate: 3.0,
    lifecycle: 'surging',
    characteristics: ['Sliding 808s', 'patrones sincopados de hi-hat', 'atmósfera tensa y sombría'],
    createdYear: 2012,
    aestheticTone: 'Urbano agresivo, pasamontañas, crónicas de barrio',
    subGenres: ['drill_callejero', 'uk_drill', 'ny_drill', 'sample_drill']
  },
  afrobeat_dancehall: {
    id: 'afrobeat_dancehall',
    name: 'Afrobeats & Dancehall',
    originCountry: 'Nigeria / Jamaica',
    basePopularity: 75,
    currentPopularity: 86,
    growthRate: 4.2,
    lifecycle: 'surging',
    characteristics: ['Polirritmos africanos', 'bajos cálidos', 'voces melódicas contagiosas'],
    createdYear: 2000,
    aestheticTone: 'Cálido, solar, celebración comunitaria',
    subGenres: ['afropop_bailable', 'amapiano', 'dancehall_party', 'reggae_fusion']
  },
  corridos_urbanos: {
    id: 'corridos_urbanos',
    name: 'Corridos Tumbados & Regional',
    originCountry: 'México / USA',
    basePopularity: 72,
    currentPopularity: 85,
    growthRate: 3.8,
    lifecycle: 'surging',
    characteristics: ['Requinto virtuoso', 'trombón y tuba', 'fusión de corrido tradicional con actitud trap'],
    createdYear: 2019,
    aestheticTone: 'Lujos campiranos, lírica callejera, sombreros y diamantes',
    subGenres: ['corrido_tumbado_clasico', 'corrido_belico', 'sad_sierreño', 'regional_pop']
  }
};

export const SUBGENRE_DETAILS: Record<string, SubgenreDetail> = {
  // --- TRAP LATINO ---
  trap_clasico: {
    id: 'trap_clasico',
    name: 'Trap Crudo & Barras',
    parentGenreId: 'trap_latino',
    description: 'Bajos 808 pesados, baterías secas y barras autobiográficas directas.',
    aestheticTone: 'Noches oscuras, esquinas, cadenas y autenticidad callejera',
    qualityBonus: 3,
    commercialBonus: 4,
    originalityBonus: 2
  },
  rage_latino: {
    id: 'rage_latino',
    name: 'Rage Latino & Sintetizadores',
    parentGenreId: 'trap_latino',
    description: 'Sintetizadores eufóricos, texturas cyberpunk y energía frenética de moshpit.',
    aestheticTone: 'Raves futuristas, neón y catarsis desbordada',
    requiredTrait: { trait: 'riskTolerance', min: 70, label: 'Tolerancia al Riesgo 70+' },
    qualityBonus: 4,
    commercialBonus: 6,
    originalityBonus: 8
  },
  plugg_argentino: {
    id: 'plugg_argentino',
    name: 'Plugg & Ambient Melódico',
    parentGenreId: 'trap_latino',
    description: 'Pads etéreos, campanas brillantes y flow relajado con gran atmósfera.',
    aestheticTone: 'Ensueño urbano, nostálgico, introspección chill',
    requiredTrait: { trait: 'creativity', min: 75, label: 'Creatividad 75+' },
    qualityBonus: 6,
    commercialBonus: 3,
    originalityBonus: 7
  },
  trap_triste: {
    id: 'trap_triste',
    name: 'Trap Sad / Emocional',
    parentGenreId: 'trap_latino',
    description: 'Guitarras melancólicas, letras de desamor, vacío y vulnerabilidad.',
    aestheticTone: 'Habitaciones a oscuras, lluvia y desahogo íntimo',
    requiredTrait: { trait: 'charisma', min: 70, label: 'Carisma 70+' },
    qualityBonus: 4,
    commercialBonus: 8,
    originalityBonus: 4
  },
  drill_latino: {
    id: 'drill_latino',
    name: 'Drill Latino & 808s Resbaladizos',
    parentGenreId: 'trap_latino',
    description: 'Patrones rítmicos acelerados con bajos deslizantes y tensión constante.',
    aestheticTone: 'Adrenalina, velocidad nocturna y actitud desafiante',
    requiredTrait: { trait: 'skill', min: 75, label: 'Habilidad 75+' },
    qualityBonus: 5,
    commercialBonus: 6,
    originalityBonus: 5
  },

  // --- REGGAETON ---
  reggaeton_clasico: {
    id: 'reggaeton_clasico',
    name: 'Dembow Puro de Discoteca',
    parentGenreId: 'reggaeton',
    description: 'Ritmo 100% bailable, bajos contundentes y ganchos de fiesta inmediata.',
    aestheticTone: 'Club repleto, sudor, luces rojas y euforia',
    qualityBonus: 2,
    commercialBonus: 10,
    originalityBonus: 2
  },
  perreo_neoperreo: {
    id: 'perreo_neoperreo',
    name: 'Neoperreo & Club Experimental',
    parentGenreId: 'reggaeton',
    description: 'Fusión underground con texturas industriales y vocales distorsionadas.',
    aestheticTone: 'Club nocturno alternativo, vanguardia y transgresión',
    requiredTrait: { trait: 'originality', min: 75, label: 'Originalidad 75+' },
    qualityBonus: 5,
    commercialBonus: 4,
    originalityBonus: 9
  },
  reggaeton_romantico: {
    id: 'reggaeton_romantico',
    name: 'Pop Urbano & Romántico',
    parentGenreId: 'reggaeton',
    description: 'Melodías vocales dulces, sintetizadores cálidos y temática de conquista amorosa.',
    aestheticTone: 'Atardeceres en la playa, radio masiva y verano eterno',
    requiredTrait: { trait: 'commercialAppeal', min: 70, label: 'Atracción Comercial 70+' },
    qualityBonus: 4,
    commercialBonus: 12,
    originalityBonus: 3
  },
  mambo_urbano: {
    id: 'mambo_urbano',
    name: 'Mambo & Fusión Latina',
    parentGenreId: 'reggaeton',
    description: 'Metales caribeños veloces, percusión acústica y energía tropical explosiva.',
    aestheticTone: 'Carnaval callejero, baile acelerado y jolgorio',
    requiredTrait: { trait: 'creativity', min: 70, label: 'Creatividad 70+' },
    qualityBonus: 5,
    commercialBonus: 7,
    originalityBonus: 6
  },
  dembow_fusion: {
    id: 'dembow_fusion',
    name: 'Dembow Dominicano / Crossover',
    parentGenreId: 'reggaeton',
    description: 'BPM elevado, percusión implacable y estribillos ultra pegadizos.',
    aestheticTone: 'Barrio caliente, fiesta en la calle y potencia rítmica',
    requiredTrait: { trait: 'skill', min: 70, label: 'Habilidad 70+' },
    qualityBonus: 4,
    commercialBonus: 9,
    originalityBonus: 4
  },

  // --- HIP HOP & RAP ---
  boombap_lirico: {
    id: 'boombap_lirico',
    name: 'Boom Bap Clásico & Métrica Pura',
    parentGenreId: 'hip_hop_rap',
    description: 'Cajas crujientes, samples de vinilo y rimas con alta densidad literaria.',
    aestheticTone: 'Plazas de cemento, walkman, graffiti y filosofía de calle',
    qualityBonus: 7,
    commercialBonus: 3,
    originalityBonus: 5
  },
  conscious_rap: {
    id: 'conscious_rap',
    name: 'Rap Conciencia & Reflexión Social',
    parentGenreId: 'hip_hop_rap',
    description: 'Storytelling profundo, crítica sociopolítica y peso conceptual.',
    aestheticTone: 'Crónica documental, introspección y compromiso cultural',
    requiredTrait: { trait: 'creativity', min: 80, label: 'Creatividad 80+' },
    qualityBonus: 9,
    commercialBonus: 2,
    originalityBonus: 8
  },
  hardcore_hiphop: {
    id: 'hardcore_hiphop',
    name: 'Hardcore Rap & Ataque Frontal',
    parentGenreId: 'hip_hop_rap',
    description: 'Voces agresivas, ritmos oscuros y actitud de confrontación directa.',
    aestheticTone: 'Ring de boxeo, asfalto y energía cruda sin filtro',
    requiredTrait: { trait: 'discipline', min: 75, label: 'Disciplina 75+' },
    qualityBonus: 6,
    commercialBonus: 4,
    originalityBonus: 5
  },
  jazz_rap: {
    id: 'jazz_rap',
    name: 'Jazz Rap & Fusión Orgánica',
    parentGenreId: 'hip_hop_rap',
    description: 'Contrabajos elegantes, pianos rhodes y rimas con swing relajado.',
    aestheticTone: 'Café bohemio, noche lluviosa y sofisticación acústica',
    requiredTrait: { trait: 'skill', min: 80, label: 'Habilidad 80+' },
    qualityBonus: 10,
    commercialBonus: 4,
    originalityBonus: 8
  },
  southern_rap: {
    id: 'southern_rap',
    name: 'Southern Rap & Bouncing Grooves',
    parentGenreId: 'hip_hop_rap',
    description: 'Bajos vibrantes, cadencias sincopadas y estribillos con actitud.',
    aestheticTone: 'Autos tuneados, fiesta sureña y poderío rítmico',
    requiredTrait: { trait: 'commercialAppeal', min: 70, label: 'Atracción Comercial 70+' },
    qualityBonus: 5,
    commercialBonus: 8,
    originalityBonus: 4
  },

  // --- POP MODERNO ---
  pop_mainstream: {
    id: 'pop_mainstream',
    name: 'Pop Radiofónico Global',
    parentGenreId: 'pop_moderno',
    description: 'Producción millonaria, estribillos monumentales y máxima accesibilidad.',
    aestheticTone: 'Premios internacionales, luces de estadio y brillo absoluto',
    qualityBonus: 5,
    commercialBonus: 12,
    originalityBonus: 2
  },
  synthpop: {
    id: 'synthpop',
    name: 'Synthpop & Retro Wave',
    parentGenreId: 'pop_moderno',
    description: 'Sintetizadores ochenteros analógicos, baterías punchy y melodías nostálgicas.',
    aestheticTone: 'Autopistas nocturnas, luces de neón y nostalgia brillante',
    requiredTrait: { trait: 'creativity', min: 70, label: 'Creatividad 70+' },
    qualityBonus: 7,
    commercialBonus: 9,
    originalityBonus: 6
  },
  indie_pop: {
    id: 'indie_pop',
    name: 'Indie Pop Intimista',
    parentGenreId: 'pop_moderno',
    description: 'Guitarras acústicas suaves, melodías etéreas y letras íntimas.',
    aestheticTone: 'Cámara analógica, naturaleza, cartas escritas a mano',
    requiredTrait: { trait: 'artisticCredibility', min: 60, label: 'Credibilidad 60+' },
    qualityBonus: 8,
    commercialBonus: 5,
    originalityBonus: 7
  },
  hyperpop: {
    id: 'hyperpop',
    name: 'Hyperpop & Glitch Pop',
    parentGenreId: 'pop_moderno',
    description: 'Pitches acelerados, distorsión extrema y melodías azucaradas frenéticas.',
    aestheticTone: 'Internet caótico, videojuegos retro y rebelión digital',
    requiredTrait: { trait: 'riskTolerance', min: 80, label: 'Tolerancia al Riesgo 80+' },
    qualityBonus: 6,
    commercialBonus: 4,
    originalityBonus: 10
  },
  electropop: {
    id: 'electropop',
    name: 'Electropop & Club Anthems',
    parentGenreId: 'pop_moderno',
    description: 'Bases electrónicas bailables diseñadas para festivales y playlists de hit.',
    aestheticTone: 'Festivales masivos, fuegos artificiales y drops bailables',
    requiredTrait: { trait: 'commercialAppeal', min: 75, label: 'Atracción Comercial 75+' },
    qualityBonus: 5,
    commercialBonus: 11,
    originalityBonus: 4
  },

  // --- ROCK ALTERNATIVO ---
  indie_rock: {
    id: 'indie_rock',
    name: 'Indie Rock Clásico',
    parentGenreId: 'rock_alternativo',
    description: 'Riffs de guitarra envolventes, bajo melódico y melodías con sabor a juventud.',
    aestheticTone: 'Salas de ensayo, vinilos y festivales independientes',
    qualityBonus: 6,
    commercialBonus: 5,
    originalityBonus: 6
  },
  post_punk: {
    id: 'post_punk',
    name: 'Post-Punk & Dark Wave',
    parentGenreId: 'rock_alternativo',
    description: 'Líneas de bajo penetrantes, guitarras gélidas y atmósfera sombría.',
    aestheticTone: 'Fábricas industriales, blanco y negro, niebla urbana',
    requiredTrait: { trait: 'originality', min: 70, label: 'Originalidad 70+' },
    qualityBonus: 8,
    commercialBonus: 3,
    originalityBonus: 8
  },
  grunge_revival: {
    id: 'grunge_revival',
    name: 'Grunge & Distorsión Cruda',
    parentGenreId: 'rock_alternativo',
    description: 'Guitarras con fuzz pesado, coros desgarradores y energía visceral.',
    aestheticTone: 'Camisas leñadoras, sótanos sudorosos y desahogo emocional',
    requiredTrait: { trait: 'discipline', min: 70, label: 'Disciplina 70+' },
    qualityBonus: 7,
    commercialBonus: 4,
    originalityBonus: 6
  },
  shoegaze: {
    id: 'shoegaze',
    name: 'Shoegaze & Murallas de Sonido',
    parentGenreId: 'rock_alternativo',
    description: 'Capas infinitas de delay, reverb y voces susurradas bajo guitarras oceánicas.',
    aestheticTone: 'Nubes psicodélicas, trance sonoro y belleza etérea',
    requiredTrait: { trait: 'creativity', min: 80, label: 'Creatividad 80+' },
    qualityBonus: 9,
    commercialBonus: 2,
    originalityBonus: 9
  },

  // --- R&B & SOUL ---
  rnb_contemporaneo: {
    id: 'rnb_contemporaneo',
    name: 'R&B Contemporáneo Pulido',
    parentGenreId: 'r_and_b_soul',
    description: 'Producción cristalina, arreglos vocales de seda y beats sincopados.',
    aestheticTone: 'Coches de lujo a medianoche, elegancia y magnetismo',
    qualityBonus: 6,
    commercialBonus: 8,
    originalityBonus: 5
  },
  neo_soul: {
    id: 'neo_soul',
    name: 'Neo-Soul Orgánico',
    parentGenreId: 'r_and_b_soul',
    description: 'Teclados vintage, armonías complejas y mensaje espiritual y profundo.',
    aestheticTone: 'Velas encendidas, té caliente, poesía y paz interior',
    requiredTrait: { trait: 'skill', min: 75, label: 'Habilidad 75+' },
    qualityBonus: 9,
    commercialBonus: 4,
    originalityBonus: 7
  },
  alt_rnb: {
    id: 'alt_rnb',
    name: 'Alt-R&B & Mood Nocturno',
    parentGenreId: 'r_and_b_soul',
    description: 'Texturas oscuras, reverberaciones profundas y melodías seductoras.',
    aestheticTone: 'Rascacielos a las 4 AM, soledad y romance misterioso',
    requiredTrait: { trait: 'creativity', min: 75, label: 'Creatividad 75+' },
    qualityBonus: 7,
    commercialBonus: 7,
    originalityBonus: 8
  },
  lofi_soul: {
    id: 'lofi_soul',
    name: 'Lo-Fi Soul & Bedroom Vibes',
    parentGenreId: 'r_and_b_soul',
    description: 'Ruido de cinta analógica, samples acogedores y calidez hogareña.',
    aestheticTone: 'Estudio casero, café matutino y relax reflexivo',
    requiredTrait: { trait: 'originality', min: 70, label: 'Originalidad 70+' },
    qualityBonus: 6,
    commercialBonus: 6,
    originalityBonus: 6
  },

  // --- ELECTRÓNICA & HOUSE ---
  tech_house: {
    id: 'tech_house',
    name: 'Tech House & Grooves de Club',
    parentGenreId: 'musica_electronica',
    description: 'Bombos marcados, percusiones tribales y ganchos vocales bailables.',
    aestheticTone: 'Clubs de Ibiza, atardeceres y sesiones hipnóticas',
    qualityBonus: 5,
    commercialBonus: 8,
    originalityBonus: 4
  },
  melodic_techno: {
    id: 'melodic_techno',
    name: 'Melodic Techno & Viaje Cinematográfico',
    parentGenreId: 'musica_electronica',
    description: 'Arpegios épicos, sintetizadores analógicos y progresiones emotivas.',
    aestheticTone: 'Escenarios monumentales, visuales 3D e introspección masiva',
    requiredTrait: { trait: 'creativity', min: 75, label: 'Creatividad 75+' },
    qualityBonus: 8,
    commercialBonus: 6,
    originalityBonus: 8
  },
  afro_house: {
    id: 'afro_house',
    name: 'Afro House & Percusión Espiritual',
    parentGenreId: 'musica_electronica',
    description: 'Tambores orgánicos, cantos conmovedores y groove envolvente.',
    aestheticTone: 'Ritual ancestral, calidez solar y baile comunitario',
    requiredTrait: { trait: 'skill', min: 70, label: 'Habilidad 70+' },
    qualityBonus: 7,
    commercialBonus: 7,
    originalityBonus: 7
  },
  drum_and_bass: {
    id: 'drum_and_bass',
    name: 'Drum & Bass / Jungle 174 BPM',
    parentGenreId: 'musica_electronica',
    description: 'Breakbeats veloces, bajos reese atronadores y adrenalina pura.',
    aestheticTone: 'Warehouse rave clandestina, velocidad y trance',
    requiredTrait: { trait: 'riskTolerance', min: 75, label: 'Tolerancia al Riesgo 75+' },
    qualityBonus: 7,
    commercialBonus: 5,
    originalityBonus: 7
  },

  // --- DRILL & GRIME ---
  drill_callejero: {
    id: 'drill_callejero',
    name: 'Drill Callejero Clásico',
    parentGenreId: 'drill',
    description: '808s deslizantes, rimas crudas y atmósfera de crónica barrial.',
    aestheticTone: 'Calles frías, capuchas, cámaras ojo de pez y realidad cruda',
    qualityBonus: 5,
    commercialBonus: 6,
    originalityBonus: 5
  },
  uk_drill: {
    id: 'uk_drill',
    name: 'UK Drill & Métrica Afilada',
    parentGenreId: 'drill',
    description: 'Hi-hats con swing británico, bajos con glide y juego de palabras.',
    aestheticTone: 'Londres nocturno, abrigos oscuros y precisión lírica',
    requiredTrait: { trait: 'skill', min: 75, label: 'Habilidad 75+' },
    qualityBonus: 7,
    commercialBonus: 6,
    originalityBonus: 6
  },
  ny_drill: {
    id: 'ny_drill',
    name: 'NY Drill & Bombos Contundentes',
    parentGenreId: 'drill',
    description: 'Sonido pesado, samples de melodías clásicas y barras de impacto.',
    aestheticTone: 'Brooklyn, humo, energía arrolladora',
    requiredTrait: { trait: 'charisma', min: 70, label: 'Carisma 70+' },
    qualityBonus: 6,
    commercialBonus: 8,
    originalityBonus: 5
  },
  sample_drill: {
    id: 'sample_drill',
    name: 'Sample Drill Emotivo',
    parentGenreId: 'drill',
    description: 'Samples de baladas o pop acelerados combinados con baterías drill.',
    aestheticTone: 'Nostalgia urbana, melodías pop y ritmo pesado',
    requiredTrait: { trait: 'commercialAppeal', min: 70, label: 'Atracción Comercial 70+' },
    qualityBonus: 6,
    commercialBonus: 10,
    originalityBonus: 6
  },

  // --- AFROBEATS & DANCEHALL ---
  afropop_bailable: {
    id: 'afropop_bailable',
    name: 'Afropop Global',
    parentGenreId: 'afrobeat_dancehall',
    description: 'Ganchos alegres, ritmos sincopados y melodías contagiosas.',
    aestheticTone: 'Color, sol, celebración colectiva y baile instantáneo',
    qualityBonus: 6,
    commercialBonus: 10,
    originalityBonus: 5
  },
  amapiano: {
    id: 'amapiano',
    name: 'Amapiano Sudafricano & Log Drums',
    parentGenreId: 'afrobeat_dancehall',
    description: 'Bajos log drum percusivos, pianos de jazz y tempo pausado y envolvente.',
    aestheticTone: 'Clubs de Johannesburgo, sofisticación bailable y groove profundo',
    requiredTrait: { trait: 'creativity', min: 75, label: 'Creatividad 75+' },
    qualityBonus: 8,
    commercialBonus: 8,
    originalityBonus: 9
  },
  dancehall_party: {
    id: 'dancehall_party',
    name: 'Dancehall Energético',
    parentGenreId: 'afrobeat_dancehall',
    description: 'Sonido jamaiquino potente, toasting dinámico y cadencia bailable.',
    aestheticTone: 'Sistemas de sonido en Kingston, humo y sudor',
    requiredTrait: { trait: 'charisma', min: 75, label: 'Carisma 75+' },
    qualityBonus: 6,
    commercialBonus: 8,
    originalityBonus: 5
  },
  reggae_fusion: {
    id: 'reggae_fusion',
    name: 'Reggae Fusion & Vibras Positivas',
    parentGenreId: 'afrobeat_dancehall',
    description: 'Guitarras a contratiempo, mensaje de unidad y armonías soleadas.',
    aestheticTone: 'Playa, brisa marina y vibración espiritual',
    requiredTrait: { trait: 'creativity', min: 70, label: 'Creatividad 70+' },
    qualityBonus: 7,
    commercialBonus: 7,
    originalityBonus: 6
  },

  // --- CORRIDOS URBANOS ---
  corrido_tumbado_clasico: {
    id: 'corrido_tumbado_clasico',
    name: 'Corrido Tumbado Clásico',
    parentGenreId: 'corridos_urbanos',
    description: 'Requinto virtuoso de 12 cuerdas, tololoche acústico y lírica de superación.',
    aestheticTone: 'Guitarras de madera, diamantes, autos y orgullo de origen',
    qualityBonus: 7,
    commercialBonus: 9,
    originalityBonus: 6
  },
  corrido_belico: {
    id: 'corrido_belico',
    name: 'Corrido Bélico & Trombones Pesados',
    parentGenreId: 'corridos_urbanos',
    description: 'Sección de vientos atronadora, charchetas y letras de poder y acción.',
    aestheticTone: 'Caravanas, sombreros, adrenalina y fuerza arrolladora',
    requiredTrait: { trait: 'discipline', min: 75, label: 'Disciplina 75+' },
    qualityBonus: 6,
    commercialBonus: 10,
    originalityBonus: 5
  },
  sad_sierreño: {
    id: 'sad_sierreño',
    name: 'Sad Sierreño Acústico',
    parentGenreId: 'corridos_urbanos',
    description: 'Acordes menores conmovedores, requinto lento y poesía melancólica.',
    aestheticTone: 'Noches estrelladas en el rancho, desamor y fogata',
    requiredTrait: { trait: 'creativity', min: 70, label: 'Creatividad 70+' },
    qualityBonus: 8,
    commercialBonus: 8,
    originalityBonus: 7
  },
  regional_pop: {
    id: 'regional_pop',
    name: 'Electro Corrido & Fusión Pop',
    parentGenreId: 'corridos_urbanos',
    description: 'Fusión de requinto tradicional con sintetizadores y bombos electrónicos.',
    aestheticTone: 'Festivales masivos, discotecas de lujo y fusión moderna',
    requiredTrait: { trait: 'commercialAppeal', min: 75, label: 'Atracción Comercial 75+' },
    qualityBonus: 5,
    commercialBonus: 11,
    originalityBonus: 7
  }
};

/**
 * Derives and unlocks sonic styles according to the artist's Current Era,
 * main genre, subgenres, and personality/stat traits.
 * Eliminates arbitrary genre selection and maintains only the base style unlocked
 * until personality trait thresholds (Creativity, Originality, Skill, etc.) are reached.
 */
export function getArtistDerivedStyles(
  artist: Artist,
  currentEra?: CareerEra,
  genres: Record<string, Genre> = INITIAL_GENRES
): {
  primaryGenreId: string;
  primaryGenreName: string;
  eraName: string;
  availableStyles: DerivedSonicStyle[];
} {
  const era = currentEra || (artist.eras && artist.eras.length > 0 ? artist.eras[artist.eras.length - 1] : undefined);
  const primaryGenreId = era?.genreFocus || artist.mainGenreId || 'trap_latino';
  const primaryGenre = genres[primaryGenreId] || INITIAL_GENRES[primaryGenreId] || INITIAL_GENRES['trap_latino'];
  const eraName = era?.name || 'Era Debut';

  // Gather candidate subgenre IDs: from primary genre + artist's own subgenres if present
  const candidateIds = new Set<string>();
  if (primaryGenre.subGenres) {
    primaryGenre.subGenres.forEach(id => candidateIds.add(id));
  }
  if (artist.subGenreIds) {
    artist.subGenreIds.forEach(id => {
      const detail = SUBGENRE_DETAILS[id];
      if (detail && detail.parentGenreId === primaryGenreId) {
        candidateIds.add(id);
      }
    });
  }

  // Build styles array
  const availableStyles: DerivedSonicStyle[] = [];

  candidateIds.forEach(subId => {
    const detail = SUBGENRE_DETAILS[subId];
    if (!detail) return;

    let isUnlocked = true;
    let lockReason: string | undefined = undefined;

    if (detail.requiredTrait) {
      const req = detail.requiredTrait;
      const traitKey = req.trait;

      // Evaluate artist personality traits strictly (primary), fallback to stats if applicable
      const personalityVal = artist.personality && (traitKey in artist.personality)
        ? (artist.personality as any)[traitKey]
        : undefined;
      const statsVal = artist.stats && (traitKey in artist.stats)
        ? (artist.stats as any)[traitKey]
        : undefined;

      const currentVal = personalityVal !== undefined ? personalityVal : (statsVal !== undefined ? statsVal : 0);

      if (currentVal < req.min) {
        isUnlocked = false;
        lockReason = `Bloqueado: Requiere ${req.label} (Tienes ${Math.round(currentVal)})`;
      }
    }

    availableStyles.push({
      id: detail.id,
      name: detail.name,
      parentGenreId: detail.parentGenreId,
      parentGenreName: primaryGenre.name,
      description: detail.description,
      aestheticTone: detail.aestheticTone,
      isUnlocked,
      lockReason,
      qualityBonus: detail.qualityBonus || 0,
      commercialBonus: detail.commercialBonus || 0,
      originalityBonus: detail.originalityBonus || 0
    });
  });

  // Guarantee that the base style (without requiredTrait) is unlocked if all styles were somehow locked
  if (availableStyles.every(s => !s.isUnlocked) && availableStyles.length > 0) {
    const baseStyle = availableStyles.find(s => !SUBGENRE_DETAILS[s.id]?.requiredTrait) || availableStyles[0];
    baseStyle.isUnlocked = true;
    baseStyle.lockReason = undefined;
  }

  return {
    primaryGenreId,
    primaryGenreName: primaryGenre.name,
    eraName,
    availableStyles
  };
}
