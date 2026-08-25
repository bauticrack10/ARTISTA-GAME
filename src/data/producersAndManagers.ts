import { Producer, Manager } from '../types';

export const INITIAL_PRODUCERS: Record<string, Producer> = {
  prod_bizarrap: {
    id: 'prod_bizarrap',
    name: 'Bizarrap',
    tagline: '¡Biza!',
    signatureStyle: 'BZRP Music Sessions, drops explosivos, sintetizadores analógicos, fusión electrónica-urbana',
    genreSpecialties: ['trap_latino', 'musica_electronica', 'hip_hop_rap', 'pop_moderno'],
    reputation: 98,
    costPerTrack: 85000,
    qualityBoost: 22,
    country: 'Argentina'
  },
  prod_metro_boomin: {
    id: 'prod_metro_boomin',
    name: 'Metro Boomin',
    tagline: 'If Young Metro don’t trust you...',
    signatureStyle: '808s cinematográficos, melodías oscuras y góticas de piano y cuerdas',
    genreSpecialties: ['hip_hop_rap', 'trap_latino'],
    reputation: 97,
    costPerTrack: 90000,
    qualityBoost: 24,
    country: 'USA'
  },
  prod_tainy: {
    id: 'prod_tainy',
    name: 'Tainy',
    tagline: 'Neon16',
    signatureStyle: 'Dembow futurista, texturas ambient, armonías de pop vanguardista',
    genreSpecialties: ['reggaeton', 'pop_moderno', 'trap_latino'],
    reputation: 96,
    costPerTrack: 75000,
    qualityBoost: 20,
    country: 'Puerto Rico'
  },
  prod_oniria: {
    id: 'prod_oniria',
    name: 'Oniria',
    tagline: 'Mueva Records',
    signatureStyle: 'Trap crudo, beats experimentales, distorsión y texturas lo-fi',
    genreSpecialties: ['trap_latino', 'drill'],
    reputation: 82,
    costPerTrack: 18000,
    qualityBoost: 14,
    country: 'Argentina'
  },
  prod_club_hustle: {
    id: 'prod_club_hustle',
    name: 'Club Hustle (Productor Underground)',
    tagline: 'In the basement',
    signatureStyle: 'Beats rápidos de bajo presupuesto pero mucha actitud callejera',
    genreSpecialties: ['trap_latino', 'drill', 'hip_hop_rap'],
    reputation: 52,
    costPerTrack: 2500,
    qualityBoost: 8,
    country: 'Argentina'
  },
  prod_synth_alchemist: {
    id: 'prod_synth_alchemist',
    name: 'Synth Alchemist',
    tagline: 'Retro Wave Lab',
    signatureStyle: 'Sintetizadores vintage Juno-106, cajas de ritmo analógicas y reverberaciones espaciales',
    genreSpecialties: ['pop_moderno', 'musica_electronica', 'r_and_b_soul'],
    reputation: 74,
    costPerTrack: 12000,
    qualityBoost: 15,
    country: 'España'
  }
};

export const INITIAL_MANAGERS: Record<string, Manager> = {
  mgr_federico_lauria: {
    id: 'mgr_federico_lauria',
    name: 'Federico Lauria (Dale Play Management)',
    reputation: 94,
    negotiationSkill: 95,
    industryNetwork: 96,
    commissionFeePct: 20,
    specialties: ['Estadios y Giras Internacionales', 'Negociaciones de Majors', 'Festivales Masivos']
  },
  mgr_noah_assad: {
    id: 'mgr_noah_assad',
    name: 'Noah Assad (Rimas Visionary)',
    reputation: 98,
    negotiationSkill: 99,
    industryNetwork: 98,
    commissionFeePct: 22,
    specialties: ['Dominio de Streaming Global', 'Marcas de Lujo', 'Independencia Estratégica']
  },
  mgr_marcelo_underground: {
    id: 'mgr_marcelo_underground',
    name: 'Marcelo "El Ruso" (Manager de Barrio)',
    reputation: 58,
    negotiationSkill: 65,
    industryNetwork: 52,
    commissionFeePct: 12,
    specialties: ['Fechas en Boliches', 'Producción de Videoclips Locales', 'Comunidad y Calles']
  },
  mgr_clara_vanguard: {
    id: 'mgr_clara_vanguard',
    name: 'Clara Vanguardia (Especialista en Festivales Indie)',
    reputation: 84,
    negotiationSkill: 86,
    industryNetwork: 88,
    commissionFeePct: 15,
    specialties: ['Prensa Cultural', 'Giras por Teatros y Europa', 'Premios y Reconocimiento Crítico']
  }
};
