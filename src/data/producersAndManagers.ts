import { Producer, Manager } from '../types';

export const INITIAL_PRODUCERS: Record<string, Producer> = {
  prod_nico_homestudio: {
    id: 'prod_nico_homestudio',
    name: "Nico 'Home Studio'",
    tagline: 'Grabando en la pieza con paneles de gomaespuma',
    signatureStyle: '808s saturados en FL Studio y voces comprimidas directo por placa USB de dos canales',
    genreSpecialties: ['trap_latino', 'hip_hop_rap', 'reggaeton', 'drill'],
    reputation: 25,
    costPerTrack: 200,
    qualityBoost: 4,
    country: 'Argentina',
    requirements: {
      minReputation: 0,
      minPopularity: 0
    }
  },
  prod_lauty_sample: {
    id: 'prod_lauty_sample',
    name: "Lauty 'Sample Digger'",
    tagline: 'Bandeja Technics & Akai MPC',
    signatureStyle: 'Recortes de vinilos de soul olvidados en bateas de Once con baterías sucias sin cuantizar',
    genreSpecialties: ['hip_hop_rap', 'trap_latino', 'r_and_b_soul', 'rock_alternativo'],
    reputation: 38,
    costPerTrack: 450,
    qualityBoost: 7,
    country: 'Argentina',
    requirements: {
      minReputation: 10,
      minPopularity: 5
    }
  },
  prod_club_hustle: {
    id: 'prod_club_hustle',
    name: 'Club Hustle',
    tagline: 'Sótano en Chacarita',
    signatureStyle: 'Mezclas agresivas enfocadas en que el subgrave rompa los parlantes del boliche a las 4 AM',
    genreSpecialties: ['trap_latino', 'drill', 'hip_hop_rap'],
    reputation: 52,
    costPerTrack: 1500,
    qualityBoost: 9,
    country: 'Argentina',
    requirements: {
      minReputation: 25,
      minPopularity: 15,
      minMonthlyListeners: 10000
    }
  },
  prod_synth_alchemist: {
    id: 'prod_synth_alchemist',
    name: 'Synth Alchemist',
    tagline: 'Sala Analógica en Poblenou',
    signatureStyle: 'Colchones de Roland Juno-106 pasados por cinta Studer y reverbs de placas reales',
    genreSpecialties: ['pop_moderno', 'musica_electronica', 'r_and_b_soul'],
    reputation: 74,
    costPerTrack: 8000,
    qualityBoost: 14,
    country: 'España',
    requirements: {
      minReputation: 45,
      minPopularity: 35,
      minMonthlyListeners: 40000
    }
  },
  prod_oniria: {
    id: 'prod_oniria',
    name: 'Oniria',
    tagline: 'Pionero del sonido Mansión',
    signatureStyle: 'Arpegios oscuros, hi-hats en tresillos veloces y cadenas vocales con autotune al límite',
    genreSpecialties: ['trap_latino', 'drill'],
    reputation: 82,
    costPerTrack: 16000,
    qualityBoost: 17,
    country: 'Argentina',
    requirements: {
      minReputation: 60,
      minPopularity: 45,
      minMonthlyListeners: 100000
    }
  },
  prod_tainy: {
    id: 'prod_tainy',
    name: 'Tainy',
    tagline: 'Neon16 Studios — Miami',
    signatureStyle: 'Baterías de reggaetón filtradas bajo el agua y arreglos de sintetizador que facturan billones de streams',
    genreSpecialties: ['reggaeton', 'pop_moderno', 'trap_latino'],
    reputation: 96,
    costPerTrack: 55000,
    qualityBoost: 21,
    country: 'Puerto Rico',
    requirements: {
      minReputation: 75,
      minPopularity: 65,
      minMonthlyListeners: 400000
    }
  },
  prod_metro_boomin: {
    id: 'prod_metro_boomin',
    name: 'Metro Boomin',
    tagline: 'Boominati Worldwide — Atlanta',
    signatureStyle: 'Transiciones sin silencios entre cortes, cuerdas sombrías y subgraves mezclados en consola SSL 9000',
    genreSpecialties: ['hip_hop_rap', 'trap_latino'],
    reputation: 97,
    costPerTrack: 75000,
    qualityBoost: 24,
    country: 'USA',
    requirements: {
      minReputation: 80,
      minPopularity: 75,
      minMonthlyListeners: 750000
    }
  },
  prod_bizarrap: {
    id: 'prod_bizarrap',
    name: 'Bizarrap',
    tagline: 'Home Studio — Ramos Mejía',
    signatureStyle: 'Tomas vocales cara a cara con micrófono Neumann U87, drops de sintetizador y cortes de master listos para el #1 global',
    genreSpecialties: ['trap_latino', 'musica_electronica', 'hip_hop_rap', 'pop_moderno'],
    reputation: 98,
    costPerTrack: 85000,
    qualityBoost: 26,
    country: 'Argentina',
    requirements: {
      minReputation: 85,
      minPopularity: 80,
      minMonthlyListeners: 1000000
    }
  }
};

export const INITIAL_MANAGERS: Record<string, Manager> = {
  // Tier 1: Underground / Barrio
  mgr_marcelo_underground: {
    id: 'mgr_marcelo_underground',
    name: 'Marcelo "El Ruso"',
    tier: 'underground',
    reputation: 58,
    negotiationSkill: 55,
    industryNetwork: 48,
    commissionFeePct: 10,
    monthlyMarketingBoost: 5,
    specialties: ['Fechas en Boliches', 'Videoclips Guerrilla', 'Comunidad y Calles'],
    requirements: {
      minMonthlyListeners: 5000,
      minReputation: 15,
      minFunds: 500,
      hiringFee: 500
    },
    bio: 'Cierra fechas en clubes del conurbano a porcentaje de puerta y cobra en efectivo al terminar el show. No te ata con contratos de 360 grados.',
    avatarGradient: 'from-amber-600 to-stone-700'
  },
  mgr_brenda_fuga: {
    id: 'mgr_brenda_fuga',
    name: 'Brenda "La Fuga"',
    tier: 'underground',
    reputation: 64,
    negotiationSkill: 60,
    industryNetwork: 56,
    commissionFeePct: 12,
    monthlyMarketingBoost: 8,
    specialties: ['Plazas y Cyphers', 'Distribución Digital DIY', 'Identidad Visual'],
    requirements: {
      minMonthlyListeners: 15000,
      minReputation: 25,
      minFunds: 1200,
      hiringFee: 1200
    },
    bio: 'Sube tus cortes a agregadoras independientes conservando el 100% de tus regalías fonográficas y te consigue lugar en festivales autogestionados.',
    avatarGradient: 'from-stone-700 to-zinc-800'
  },

  // Tier 2: Regional & Indie
  mgr_clara_vanguard: {
    id: 'mgr_clara_vanguard',
    name: 'Clara Salvatierra',
    tier: 'regional',
    reputation: 82,
    negotiationSkill: 78,
    industryNetwork: 80,
    commissionFeePct: 15,
    monthlyMarketingBoost: 14,
    specialties: ['Prensa Cultural', 'Giras por Teatros', 'Premios y Reconocimiento Crítico'],
    requirements: {
      minMonthlyListeners: 50000,
      minReputation: 45,
      minFunds: 4000,
      hiringFee: 4000
    },
    bio: 'Arma circuitos de teatros a sala llena entre Buenos Aires, Montevideo, Santiago y Madrid. Tiene línea directa con editores de prensa musical y jurados de premiaciones.',
    avatarGradient: 'from-teal-700 to-emerald-900'
  },
  mgr_nico_street: {
    id: 'mgr_nico_street',
    name: 'Nico "Street Pulse"',
    tier: 'regional',
    reputation: 79,
    negotiationSkill: 75,
    industryNetwork: 76,
    commissionFeePct: 16,
    monthlyMarketingBoost: 16,
    specialties: ['Campañas de Hype', 'Festivales Regionales', 'Alianzas con Beatmakers'],
    requirements: {
      minMonthlyListeners: 75000,
      minReputation: 50,
      minFunds: 6000,
      hiringFee: 6000
    },
    bio: 'Negocia adelantos de distribución digital sin entregar la propiedad del master y cruza colaboraciones con los productores que están dominando el ranking del Cono Sur.',
    avatarGradient: 'from-cyan-700 to-slate-900'
  },

  // Tier 3: Nacional / Consagrado
  mgr_federico_lauria: {
    id: 'mgr_federico_lauria',
    name: 'Federico Lauria',
    tier: 'national',
    reputation: 94,
    negotiationSkill: 92,
    industryNetwork: 94,
    commissionFeePct: 18,
    monthlyMarketingBoost: 22,
    specialties: ['Estadios y Giras Masivas', 'Negociaciones de Majors', 'Festivales Masivos'],
    requirements: {
      minMonthlyListeners: 250000,
      minReputation: 65,
      minFunds: 18000,
      hiringFee: 18000
    },
    bio: 'Fundador de Dale Play. Lleva proyectos desde el Movistar Arena hasta agotar estadios de fútbol en Madrid y Buenos Aires, reteniendo el corte grueso del borderó.',
    avatarGradient: 'from-orange-700 to-stone-950'
  },
  mgr_hernan_duque: {
    id: 'mgr_hernan_duque',
    name: 'Hernán "El Duque"',
    tier: 'national',
    reputation: 89,
    negotiationSkill: 88,
    industryNetwork: 90,
    commissionFeePct: 20,
    monthlyMarketingBoost: 20,
    specialties: ['Arenas Internacionales', 'Patrocinios Corporativos', 'Giras España / México'],
    requirements: {
      minMonthlyListeners: 400000,
      minReputation: 70,
      minFunds: 25000,
      hiringFee: 25000
    },
    bio: 'Ex director de A&R en multinacional. Destraba presupuestos de seis cifras en adelantos editoriales y asegura patrocinadores para financiar giras en México y España.',
    avatarGradient: 'from-amber-800 to-rose-950'
  },

  // Tier 4: Élite / Global
  mgr_noah_assad: {
    id: 'mgr_noah_assad',
    name: 'Noah Assad',
    tier: 'elite_global',
    reputation: 98,
    negotiationSkill: 98,
    industryNetwork: 99,
    commissionFeePct: 22,
    monthlyMarketingBoost: 30,
    specialties: ['Dominio de Streaming Global', 'Marcas de Lujo', 'Independencia Estratégica'],
    requirements: {
      minMonthlyListeners: 1000000,
      minReputation: 80,
      minFunds: 60000,
      hiringFee: 60000
    },
    bio: 'Cofundador de Rimas Entertainment. Diseña contratos donde el artista retiene la mayoría de las regalías de streaming mientras encabeza Coachella y agota estadios en Estados Unidos.',
    avatarGradient: 'from-rose-800 to-zinc-950'
  },
  mgr_max_thorne: {
    id: 'mgr_max_thorne',
    name: 'Max "Worldstar" Thorne',
    tier: 'elite_global',
    reputation: 99,
    negotiationSkill: 99,
    industryNetwork: 98,
    commissionFeePct: 25,
    monthlyMarketingBoost: 35,
    specialties: ['World Tours en Estadios', 'Sindicación Global', 'Grammys y Premios Mundiales'],
    requirements: {
      minMonthlyListeners: 2000000,
      minReputation: 85,
      minFunds: 100000,
      hiringFee: 100000
    },
    bio: 'Opera desde Los Ángeles y Londres con promotores de Live Nation y AEG. Garantiza mínimos millonarios por tramo de gira y posiciona campañas directas para la votación de la Academia.',
    avatarGradient: 'from-amber-700 via-zinc-900 to-black'
  }
};
