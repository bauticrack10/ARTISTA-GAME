import { Producer, Manager } from '../types';

export const INITIAL_PRODUCERS: Record<string, Producer> = {
  prod_nico_homestudio: {
    id: 'prod_nico_homestudio',
    name: "Nico 'Home Studio'",
    tagline: 'Grabando en la pieza',
    signatureStyle: '808s caseros, compresión cruda, loops directos y ritmo barrial accesible',
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
    tagline: 'Crate digging & FL Studio',
    signatureStyle: 'Samples de vinilo antiguos, melodías nostálgicas y texturas lo-fi con onda',
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
    tagline: 'In the basement',
    signatureStyle: 'Beats rápidos de bajo presupuesto pero mucha actitud callejera',
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
    tagline: 'Retro Wave Lab',
    signatureStyle: 'Sintetizadores vintage Juno-106, cajas de ritmo analógicas y reverberaciones espaciales',
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
    tagline: 'Mueva Records',
    signatureStyle: 'Trap crudo, beats experimentales, distorsión y texturas lo-fi',
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
    tagline: 'Neon16',
    signatureStyle: 'Dembow futurista, texturas ambient, armonías de pop vanguardista',
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
    tagline: 'If Young Metro don’t trust you...',
    signatureStyle: '808s cinematográficos, melodías oscuras y góticas de piano y cuerdas',
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
    tagline: '¡Biza!',
    signatureStyle: 'BZRP Music Sessions, drops explosivos, sintetizadores analógicos, fusión electrónica-urbana',
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
    bio: 'Gestor del circuito callejero y clubes barriales. Ideal para dar los primeros pasos sin presiones corporativas.',
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
    bio: 'Especialista en conectar artistas urbanos con beatmakers emergentes y festivales barriales.',
    avatarGradient: 'from-stone-700 to-zinc-800'
  },

  // Tier 2: Regional & Indie Vanguard
  mgr_clara_vanguard: {
    id: 'mgr_clara_vanguard',
    name: 'Clara Vanguardia',
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
    bio: 'Prensa cultural de vanguardia y giras por teatros independientes de Latinoamérica y Europa.',
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
    bio: 'Impulsor de tendencias virales en redes, colaboraciones regionales y festivales medianos.',
    avatarGradient: 'from-blue-700 to-indigo-900'
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
    bio: 'El arquitecto detrás del auge de la música urbana argentina y giras monumentales en estadios.',
    avatarGradient: 'from-purple-800 to-indigo-950'
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
    bio: 'Estratega de rotación radial comercial, acuerdos de patrocinio y giras por arenas internacionales.',
    avatarGradient: 'from-amber-800 to-rose-950'
  },

  // Tier 4: Élite / Global Visionary
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
    bio: 'La mente maestra global detrás del fenómeno de estadios mundiales y control estratégico de másters.',
    avatarGradient: 'from-rose-800 to-black'
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
    bio: 'Representante de superestrellas mundiales en EE.UU. y Europa. Conexiones directas con la élite de la industria.',
    avatarGradient: 'from-amber-700 via-zinc-900 to-black'
  }
};
