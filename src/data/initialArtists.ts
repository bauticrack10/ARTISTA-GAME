import { Artist } from '../types';

export const INITIAL_ARTISTS: Record<string, Artist> = {
  // BHAVI — Distinct Unique Artist Entity
  artist_bhavi: {
    id: 'artist_bhavi',
    name: 'Bhavi',
    realName: 'Indra Bhalavan',
    isPlayer: false,
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
    avatarColor: 'from-yellow-400 to-amber-600',
    country: 'Argentina / Bélgica',
    city: 'Mar del Plata / Bruselas',
    birthYear: 1997,
    careerStartYear: 2017,
    mainGenreId: 'trap_latino',
    subGenreIds: ['rage_latino', 'plugg_argentino', 'pop_moderno'],
    personality: {
      creativity: 92,
      ambition: 78,
      discipline: 80,
      charisma: 90,
      skill: 86,
      commercialAppeal: 82,
      originality: 94,
      riskTolerance: 88,
      sociability: 92,
      independence: 75
    },
    stats: {
      popularity: 78,
      reputation: 88,
      artisticCredibility: 90,
      energy: 85,
      monthlyListeners: 4200000,
      totalStreams: 520000000,
      funds: 950000,
      fansCount: 2800000,
      fanbaseLoyalty: 88,
      hype: 72
    },
    careerStage: 'Established',
    labelId: 'label_dale_play',
    managerId: 'mgr_federico_lauria',
    relationships: {
      artist_duki: {
        targetArtistId: 'artist_duki',
        relationType: 'friend',
        affinity: 85,
        respect: 92,
        pastCollabsCount: 4,
        history: ['Pioneros de la escena de trap argentina y temas compartidos en festivales.']
      },
      artist_khea: {
        targetArtistId: 'artist_khea',
        relationType: 'friend',
        affinity: 75,
        respect: 85,
        pastCollabsCount: 2,
        history: ['Compañeros de la primera ola del trap en Buenos Aires.']
      },
      artist_ysy_a: {
        targetArtistId: 'artist_ysy_a',
        relationType: 'friend',
        affinity: 88,
        respect: 90,
        pastCollabsCount: 3,
        history: ['Colaboraciones en álbumes conceptuales de trap.']
      }
    },
    eras: [
      {
        id: 'era_bhavi_origin',
        name: 'Trap Bizarro & Óperas',
        startYear: 2018,
        startMonth: 3,
        genreFocus: 'trap_latino',
        stage: 'Established',
        highlightSummary: 'Innovador sonido extravagante con óperas de trap, visuales psicodélicos y carisma único.'
      }
    ],
    awardsWon: ['Premios Gardel Mejor Álbum Trap'],
    legacyScore: 74,
    isRetired: false,
    historicalNotes: ['Lanzó álbumes conceptuales Cinema, Pochoclos y Abrazame.'],
    generationIndex: 1,
    influences: []
  },

  // KHEA — Strictly Distinct Unique Artist Entity
  artist_khea: {
    id: 'artist_khea',
    name: 'KHEA',
    realName: 'Ivo Alfredo Thomas Serue',
    isPlayer: false,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    avatarColor: 'from-blue-500 to-indigo-700',
    country: 'Argentina',
    city: 'Virreyes, Buenos Aires',
    birthYear: 2000,
    careerStartYear: 2017,
    mainGenreId: 'trap_latino',
    subGenreIds: ['pop_moderno', 'rock_alternativo', 'r_and_b_soul'],
    personality: {
      creativity: 86,
      ambition: 89,
      discipline: 82,
      charisma: 91,
      skill: 88,
      commercialAppeal: 93,
      originality: 85,
      riskTolerance: 82,
      sociability: 85,
      independence: 68
    },
    stats: {
      popularity: 84,
      reputation: 85,
      artisticCredibility: 82,
      energy: 88,
      monthlyListeners: 8900000,
      totalStreams: 1450000000,
      funds: 1800000,
      fansCount: 5200000,
      fanbaseLoyalty: 82,
      hype: 78
    },
    careerStage: 'Mainstream',
    labelId: 'label_warner_latam',
    managerId: 'mgr_federico_lauria',
    relationships: {
      artist_bhavi: {
        targetArtistId: 'artist_bhavi',
        relationType: 'friend',
        affinity: 75,
        respect: 85,
        pastCollabsCount: 2,
        history: ['Colegas de la primera generación de trap latino.']
      },
      artist_duki: {
        targetArtistId: 'artist_duki',
        relationType: 'friend',
        affinity: 90,
        respect: 95,
        pastCollabsCount: 5,
        history: ['Creadores de Loca, el himno que catapultó el trap sudamericano a nivel global.']
      },
      artist_bad_bunny: {
        targetArtistId: 'artist_bad_bunny',
        relationType: 'collaborator',
        affinity: 80,
        respect: 90,
        pastCollabsCount: 1,
        history: ['Remix histórico de Loca que abrió las puertas internacionales.']
      }
    },
    eras: [
      {
        id: 'era_khea_loca',
        name: 'Loca & La Globalización del Trap',
        startYear: 2017,
        startMonth: 11,
        genreFocus: 'trap_latino',
        stage: 'Mainstream',
        highlightSummary: 'Lanzamiento del himno Loca y giras masivas por Europa y América Latina.'
      }
    ],
    awardsWon: ['Premios Gardel', 'Múltiples Discos de Diamante'],
    legacyScore: 82,
    isRetired: false,
    historicalNotes: ['Uno de los responsables de la explosión del trap hispanohablante a nivel mundial.'],
    generationIndex: 1,
    influences: []
  },

  // DUKI
  artist_duki: {
    id: 'artist_duki',
    name: 'Duki',
    realName: 'Mauro Ezequiel Lombardo',
    isPlayer: false,
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80',
    avatarColor: 'from-red-600 to-zinc-900',
    country: 'Argentina',
    city: 'Almagro, Buenos Aires',
    birthYear: 1996,
    careerStartYear: 2016,
    mainGenreId: 'trap_latino',
    subGenreIds: ['drill', 'rock_alternativo', 'hip_hop_rap'],
    personality: {
      creativity: 94,
      ambition: 98,
      discipline: 90,
      charisma: 99,
      skill: 95,
      commercialAppeal: 96,
      originality: 96,
      riskTolerance: 94,
      sociability: 95,
      independence: 80
    },
    stats: {
      popularity: 95,
      reputation: 96,
      artisticCredibility: 95,
      energy: 90,
      monthlyListeners: 21000000,
      totalStreams: 6200000000,
      funds: 12000000,
      fansCount: 15000000,
      fanbaseLoyalty: 98,
      hype: 92
    },
    careerStage: 'Superstar',
    labelId: 'label_dale_play',
    managerId: 'mgr_federico_lauria',
    relationships: {
      artist_bhavi: {
        targetArtistId: 'artist_bhavi',
        relationType: 'friend',
        affinity: 85,
        respect: 92,
        pastCollabsCount: 4,
        history: ['Compañeros desde los inicios en Mueva Records y giras conjuntas.']
      },
      artist_khea: {
        targetArtistId: 'artist_khea',
        relationType: 'friend',
        affinity: 90,
        respect: 95,
        pastCollabsCount: 5,
        history: ['Hitos compartidos como Loca, She Don\'t Give a FO y festivales masivos.']
      },
      artist_bizarrap: {
        targetArtistId: 'artist_bizarrap',
        relationType: 'friend',
        affinity: 95,
        respect: 98,
        pastCollabsCount: 3,
        history: ['Colaboración legendaria en BZRP Music Sessions #50 y estadios Vélez y Bernabéu.']
      },
      artist_bad_bunny: {
        targetArtistId: 'artist_bad_bunny',
        relationType: 'friend',
        affinity: 88,
        respect: 96,
        pastCollabsCount: 2,
        history: ['Colaboraciones en álbumes y respeto mutuo como líderes de sus escenas.']
      }
    },
    eras: [
      {
        id: 'era_duki_stadiums',
        name: 'El Rey del Trap & Los Estadios',
        startYear: 2022,
        startMonth: 10,
        genreFocus: 'trap_latino',
        stage: 'Superstar',
        highlightSummary: 'Históricos 4 estadios Vélez y Bernabéu en Madrid, consolidándose como líder generacional.'
      }
    ],
    awardsWon: ['Premios Gardel de Oro', 'Grammy Latino Nominaciones', 'Premio Billboard Icono Urbano'],
    legacyScore: 95,
    isRetired: false,
    historicalNotes: ['Surgido del Quinto Escalón, llevó el trap argentino a llenar estadios mundiales.'],
    generationIndex: 1,
    influences: []
  },

  // BIZARRAP
  artist_bizarrap: {
    id: 'artist_bizarrap',
    name: 'Bizarrap',
    realName: 'Gonzalo Julián Conde',
    isPlayer: false,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    avatarColor: 'from-blue-600 to-cyan-400',
    country: 'Argentina',
    city: 'Ramos Mejía, Buenos Aires',
    birthYear: 1998,
    careerStartYear: 2018,
    mainGenreId: 'musica_electronica',
    subGenreIds: ['trap_latino', 'hip_hop_rap', 'pop_moderno'],
    personality: {
      creativity: 96,
      ambition: 95,
      discipline: 98,
      charisma: 94,
      skill: 98,
      commercialAppeal: 99,
      originality: 97,
      riskTolerance: 85,
      sociability: 96,
      independence: 92
    },
    stats: {
      popularity: 96,
      reputation: 97,
      artisticCredibility: 96,
      energy: 92,
      monthlyListeners: 38000000,
      totalStreams: 8500000000,
      funds: 18000000,
      fansCount: 22000000,
      fanbaseLoyalty: 94,
      hype: 95
    },
    careerStage: 'Superstar',
    labelId: 'label_dale_play',
    managerId: 'mgr_federico_lauria',
    relationships: {
      artist_duki: {
        targetArtistId: 'artist_duki',
        relationType: 'friend',
        affinity: 95,
        respect: 98,
        pastCollabsCount: 3,
        history: ['Hermanos de carrera y éxitos mundiales.']
      },
      artist_bhavi: {
        targetArtistId: 'artist_bhavi',
        relationType: 'friend',
        affinity: 90,
        respect: 90,
        pastCollabsCount: 2,
        history: ['Bhavi fue uno de los primeros en grabar las legendarias BZRP Music Sessions.']
      },
      artist_rosalia: {
        targetArtistId: 'artist_rosalia',
        relationType: 'friend',
        affinity: 85,
        respect: 95,
        pastCollabsCount: 1,
        history: ['Respeto artístico absoluto en la élite hispanohablante.']
      }
    },
    eras: [
      {
        id: 'era_bzrp_sessions',
        name: 'El Fenómeno Global de las Sessions',
        startYear: 2020,
        startMonth: 1,
        genreFocus: 'musica_electronica',
        stage: 'Superstar',
        highlightSummary: 'Múltiples #1 mundiales en Spotify con Sessions históricas (Quevedo, Shakira, Peso Pluma).'
      }
    ],
    awardsWon: ['3x Latin Grammy 2023', 'Billboard Music Awards', 'Guinness World Records'],
    legacyScore: 96,
    isRetired: false,
    historicalNotes: ['Redefinió el rol del productor en la era moderna del streaming global.'],
    generationIndex: 1,
    influences: []
  },

  // BAD BUNNY
  artist_bad_bunny: {
    id: 'artist_bad_bunny',
    name: 'Bad Bunny',
    realName: 'Benito Antonio Martínez Ocasio',
    isPlayer: false,
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    avatarColor: 'from-amber-500 to-rose-600',
    country: 'Puerto Rico',
    city: 'Vega Baja',
    birthYear: 1994,
    careerStartYear: 2016,
    mainGenreId: 'reggaeton',
    subGenreIds: ['trap_latino', 'pop_moderno', 'rock_alternativo'],
    personality: {
      creativity: 98,
      ambition: 99,
      discipline: 94,
      charisma: 99,
      skill: 96,
      commercialAppeal: 99,
      originality: 98,
      riskTolerance: 96,
      sociability: 88,
      independence: 95
    },
    stats: {
      popularity: 99,
      reputation: 98,
      artisticCredibility: 96,
      energy: 94,
      monthlyListeners: 68000000,
      totalStreams: 32000000000,
      funds: 65000000,
      fansCount: 45000000,
      fanbaseLoyalty: 97,
      hype: 98
    },
    careerStage: 'Superstar',
    labelId: 'label_rimas_music',
    managerId: 'mgr_noah_assad',
    relationships: {
      artist_duki: {
        targetArtistId: 'artist_duki',
        relationType: 'friend',
        affinity: 88,
        respect: 96,
        pastCollabsCount: 2,
        history: ['Colaboraron en Hablamos Mañana y festivales internacionales.']
      },
      artist_rosalia: {
        targetArtistId: 'artist_rosalia',
        relationType: 'friend',
        affinity: 90,
        respect: 97,
        pastCollabsCount: 1,
        history: ['Colaboración en La Noche de Anoche con impacto global.']
      }
    },
    eras: [
      {
        id: 'era_badbunny_global',
        name: 'Un Verano Sin Ti & El Trono Mundial',
        startYear: 2022,
        startMonth: 5,
        genreFocus: 'reggaeton',
        stage: 'Superstar',
        highlightSummary: 'Artista más escuchado del mundo durante 3 años consecutivos en Spotify.'
      }
    ],
    awardsWon: ['3x Grammy Awards', '11x Latin Grammy', 'Billboard Artist of the Year'],
    legacyScore: 99,
    isRetired: false,
    historicalNotes: ['Primer álbum en español en liderar el Billboard 200 de fin de año en la historia.'],
    generationIndex: 1,
    influences: []
  },

  // ROSALÍA
  artist_rosalia: {
    id: 'artist_rosalia',
    name: 'Rosalía',
    realName: 'Rosalia Vila Tobella',
    isPlayer: false,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    avatarColor: 'from-pink-500 to-rose-700',
    country: 'España',
    city: 'San Cugat del Vallés, Barcelona',
    birthYear: 1992,
    careerStartYear: 2017,
    mainGenreId: 'pop_moderno',
    subGenreIds: ['reggaeton', 'r_and_b_soul', 'musica_electronica'],
    personality: {
      creativity: 99,
      ambition: 96,
      discipline: 97,
      charisma: 98,
      skill: 99,
      commercialAppeal: 94,
      originality: 99,
      riskTolerance: 98,
      sociability: 90,
      independence: 90
    },
    stats: {
      popularity: 92,
      reputation: 99,
      artisticCredibility: 99,
      energy: 92,
      monthlyListeners: 28000000,
      totalStreams: 7500000000,
      funds: 16000000,
      fansCount: 18000000,
      fanbaseLoyalty: 96,
      hype: 92
    },
    careerStage: 'Superstar',
    labelId: 'label_sony_columbia',
    managerId: 'mgr_clara_vanguard',
    relationships: {
      artist_bad_bunny: {
        targetArtistId: 'artist_bad_bunny',
        relationType: 'friend',
        affinity: 90,
        respect: 97,
        pastCollabsCount: 1,
        history: ['Hito con La Noche de Anoche y presentaciones memorables en SNL.']
      },
      artist_bizarrap: {
        targetArtistId: 'artist_bizarrap',
        relationType: 'friend',
        affinity: 85,
        respect: 95,
        pastCollabsCount: 1,
        history: ['Admiración mutua de vanguardia sonora.']
      }
    },
    eras: [
      {
        id: 'era_motomami',
        name: 'Motomami & La Ruptura Sonora',
        startYear: 2022,
        startMonth: 3,
        genreFocus: 'pop_moderno',
        stage: 'Superstar',
        highlightSummary: 'Aclamación crítica mundial unánime (Motomami) y gira internacional icónica.'
      }
    ],
    awardsWon: ['2x Grammy Awards', '12x Latin Grammy', 'Álbum del Año MOTOMAMI'],
    legacyScore: 97,
    isRetired: false,
    historicalNotes: ['Revolucionó el flamenco fusión y el avant-pop hispanohablante a escala global.'],
    generationIndex: 1,
    influences: []
  },

  // CHARLY GARCÍA (Legend Benchmark)
  artist_charly_garcia: {
    id: 'artist_charly_garcia',
    name: 'Charly García',
    realName: 'Carlos Alberto García Moreno',
    isPlayer: false,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    avatarColor: 'from-zinc-700 to-zinc-950',
    country: 'Argentina',
    city: 'Buenos Aires',
    birthYear: 1951,
    careerStartYear: 1972,
    mainGenreId: 'rock_alternativo',
    subGenreIds: ['pop_moderno', 'hip_hop_rap'],
    personality: {
      creativity: 100,
      ambition: 92,
      discipline: 75,
      charisma: 99,
      skill: 100,
      commercialAppeal: 88,
      originality: 100,
      riskTolerance: 100,
      sociability: 70,
      independence: 100
    },
    stats: {
      popularity: 88,
      reputation: 100,
      artisticCredibility: 100,
      energy: 65,
      monthlyListeners: 3500000,
      totalStreams: 1800000000,
      funds: 8000000,
      fansCount: 9000000,
      fanbaseLoyalty: 99,
      hype: 70
    },
    careerStage: 'Legend',
    labelId: 'label_sony_columbia',
    managerId: null,
    relationships: {},
    eras: [
      {
        id: 'era_charly_legend',
        name: 'Padre del Rock en Español & Say No More',
        startYear: 1980,
        startMonth: 1,
        genreFocus: 'rock_alternativo',
        stage: 'Legend',
        highlightSummary: 'Sui Generis, Serú Girán, Clics Modernos y la inmortalidad musical argentina.'
      }
    ],
    awardsWon: ['Grammy a la Excelencia Musical', 'Gardel de Oro (3 veces)', 'Personalidad Ilustre de la Cultura'],
    legacyScore: 100,
    isRetired: false,
    historicalNotes: ['Figura fundacional y tótem sagrado de la música popular en castellano.'],
    generationIndex: 0,
    influences: []
  },

  // MILO J (Emerging Prodigy)
  artist_milo_j: {
    id: 'artist_milo_j',
    name: 'Milo J',
    realName: 'Camilo Joaquín Villarruel',
    isPlayer: false,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    avatarColor: 'from-amber-700 to-stone-900',
    country: 'Argentina',
    city: 'Morón, Buenos Aires',
    birthYear: 2006,
    careerStartYear: 2022,
    mainGenreId: 'hip_hop_rap',
    subGenreIds: ['trap_latino', 'r_and_b_soul', 'rock_alternativo'],
    personality: {
      creativity: 94,
      ambition: 88,
      discipline: 92,
      charisma: 92,
      skill: 96,
      commercialAppeal: 90,
      originality: 95,
      riskTolerance: 86,
      sociability: 84,
      independence: 88
    },
    stats: {
      popularity: 88,
      reputation: 94,
      artisticCredibility: 96,
      energy: 95,
      monthlyListeners: 15000000,
      totalStreams: 2200000000,
      funds: 3500000,
      fansCount: 8000000,
      fanbaseLoyalty: 94,
      hype: 92
    },
    careerStage: 'Breakout',
    labelId: 'label_dale_play',
    managerId: 'mgr_federico_lauria',
    relationships: {
      artist_bizarrap: {
        targetArtistId: 'artist_bizarrap',
        relationType: 'mentor',
        affinity: 95,
        respect: 98,
        pastCollabsCount: 5,
        history: ['EP histórico En Dormir Sin Madrid junto a Bizarrap.']
      },
      artist_duki: {
        targetArtistId: 'artist_duki',
        relationType: 'friend',
        affinity: 90,
        respect: 96,
        pastCollabsCount: 1,
        history: ['Unión generacional en estadios y producciones conjuntas.']
      }
    },
    eras: [
      {
        id: 'era_milo_111',
        name: 'El Chico Maravilla de Morón',
        startYear: 2023,
        startMonth: 4,
        genreFocus: 'hip_hop_rap',
        stage: 'Breakout',
        highlightSummary: 'Explosión mundial a los 16 años con 111 y la colaboración histórica con Bizarrap.'
      }
    ],
    awardsWon: ['Premios Gardel Mejor Nuevo Artista', 'Latin Grammy Nominado'],
    legacyScore: 78,
    isRetired: false,
    historicalNotes: ['Lírica madura, soul y rap clásico reinterpretado por la nueva generación.'],
    generationIndex: 2,
    influences: ['artist_charly_garcia', 'artist_duki']
  },

  // KENDRICK LAMAR (Global Legend)
  artist_kendrick_lamar: {
    id: 'artist_kendrick_lamar',
    name: 'Kendrick Lamar',
    realName: 'Kendrick Lamar Duckworth',
    isPlayer: false,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    avatarColor: 'from-emerald-700 to-zinc-950',
    country: 'USA',
    city: 'Compton, California',
    birthYear: 1987,
    careerStartYear: 2004,
    mainGenreId: 'hip_hop_rap',
    subGenreIds: ['r_and_b_soul', 'rock_alternativo'],
    personality: {
      creativity: 100,
      ambition: 96,
      discipline: 99,
      charisma: 97,
      skill: 100,
      commercialAppeal: 92,
      originality: 100,
      riskTolerance: 98,
      sociability: 72,
      independence: 96
    },
    stats: {
      popularity: 96,
      reputation: 100,
      artisticCredibility: 100,
      energy: 90,
      monthlyListeners: 54000000,
      totalStreams: 18000000000,
      funds: 45000000,
      fansCount: 35000000,
      fanbaseLoyalty: 99,
      hype: 96
    },
    careerStage: 'Legend',
    labelId: 'label_universal_interscope',
    managerId: null,
    relationships: {},
    eras: [
      {
        id: 'era_kendrick_pulitzer',
        name: 'Poeta de Compton & Premio Pulitzer',
        startYear: 2015,
        startMonth: 3,
        genreFocus: 'hip_hop_rap',
        stage: 'Legend',
        highlightSummary: 'To Pimp a Butterfly, DAMN. y el primer Pulitzer otorgado a la música popular no clásica.'
      }
    ],
    awardsWon: ['17x Grammy Awards', 'Premio Pulitzer de Música', 'Emmy Award'],
    legacyScore: 100,
    isRetired: false,
    historicalNotes: ['Uno de los letristas más condecorados e influyentes de la historia musical moderna.'],
    generationIndex: 0,
    influences: []
  },

  // BILLIE EILISH (Alt-Pop Phenomenon)
  artist_billie_eilish: {
    id: 'artist_billie_eilish',
    name: 'Billie Eilish',
    realName: 'Billie Eilish Pirate Baird O’Connell',
    isPlayer: false,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    avatarColor: 'from-teal-600 to-slate-900',
    country: 'USA',
    city: 'Los Angeles, California',
    birthYear: 2001,
    careerStartYear: 2016,
    mainGenreId: 'pop_moderno',
    subGenreIds: ['rock_alternativo', 'musica_electronica', 'r_and_b_soul'],
    personality: {
      creativity: 98,
      ambition: 93,
      discipline: 95,
      charisma: 98,
      skill: 97,
      commercialAppeal: 97,
      originality: 98,
      riskTolerance: 94,
      sociability: 82,
      independence: 90
    },
    stats: {
      popularity: 97,
      reputation: 98,
      artisticCredibility: 98,
      energy: 91,
      monthlyListeners: 62000000,
      totalStreams: 24000000000,
      funds: 38000000,
      fansCount: 42000000,
      fanbaseLoyalty: 97,
      hype: 94
    },
    careerStage: 'Superstar',
    labelId: 'label_universal_interscope',
    managerId: null,
    relationships: {},
    eras: [
      {
        id: 'era_billie_sweeps',
        name: 'Grammy Big Four & Oscar Histórico',
        startYear: 2020,
        startMonth: 1,
        genreFocus: 'pop_moderno',
        stage: 'Superstar',
        highlightSummary: 'Primera artista femenina en ganar los 4 premios principales del Grammy en una sola noche y 2 Oscars.'
      }
    ],
    awardsWon: ['9x Grammy Awards', '2x Premios Oscar', 'Golden Globe'],
    legacyScore: 98,
    isRetired: false,
    historicalNotes: ['Transformó la producción de pop de dormitorio en sonido de escala masiva.'],
    generationIndex: 1,
    influences: []
  }
};
