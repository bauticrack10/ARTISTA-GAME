import { LifestyleItem } from '../types';

export const LIFESTYLE_ITEMS: LifestyleItem[] = [
  // 0. HOME STUDIO & BÁSICO (Early-Game Underground: $90 - $350)
  {
    id: 'starter_pop_filter',
    name: 'Filtro Antipop & Brazo Articulado de Escritorio',
    category: 'home_studio',
    price: 90,
    monthlyUpkeep: 0,
    description: 'Accesorio de acero y doble malla que elimina plosivas al cantar cerca del micrófono.',
    iconName: 'Sparkles',
    buffDescription: '+1 Calidad vocal limpia en grabaciones caseras.',
    effects: {
      qualityBonus: 1
    }
  },
  {
    id: 'starter_acoustic_panel',
    name: 'Paneles Fonoabsorbentes de Habitación (Set 12u)',
    category: 'home_studio',
    price: 110,
    monthlyUpkeep: 0,
    description: 'Espuma acústica de alta densidad para reducir el eco y la reverberación del cuarto.',
    iconName: 'Home',
    buffDescription: '+1 Calidad acústica, +1 Creatividad al grabar sin ruidos.',
    effects: {
      qualityBonus: 1,
      creativityBonus: 1
    }
  },
  {
    id: 'starter_usb_mic',
    name: 'Micrófono USB Condensador Plug & Play',
    category: 'home_studio',
    price: 130,
    monthlyUpkeep: 5,
    description: 'Micrófono condensador con conexión directa USB para maquetas vocales claras sin equipo complejo.',
    iconName: 'Mic',
    buffDescription: '+2 Calidad en grabaciones, +1 Habilidad técnica.',
    effects: {
      qualityBonus: 2,
      skillBonus: 1
    }
  },
  {
    id: 'starter_headphones',
    name: 'Auriculares de Monitoreo Cerrados ATH',
    category: 'home_studio',
    price: 150,
    monthlyUpkeep: 5,
    description: 'Aislamiento sonoro y respuesta plana para ecualizar con claridad y afinar detalles de mezcla.',
    iconName: 'Radio',
    buffDescription: '+2 Calidad de mezcla en temas autoproducidos, +1 Disciplina.',
    effects: {
      qualityBonus: 2,
      disciplineBonus: 1
    }
  },
  {
    id: 'starter_daw',
    name: 'Software DAW & Licencia de Producción Intro',
    category: 'home_studio',
    price: 180,
    monthlyUpkeep: 0,
    description: 'Licencia oficial de DAW para componer beats, samplear y estructurar canciones completas.',
    iconName: 'Sliders',
    buffDescription: '+3 Calidad de producción, +2 Creatividad compositiva.',
    effects: {
      qualityBonus: 3,
      creativityBonus: 2
    }
  },
  {
    id: 'starter_audio_interface',
    name: 'Interfaz de Audio USB 2x2 con Preamp Air',
    category: 'home_studio',
    price: 220,
    monthlyUpkeep: 10,
    description: 'Conversión de audio de 24 bits a 192 kHz con entradas XLR para micrófonos e instrumentos.',
    iconName: 'Sliders',
    buffDescription: '+3 Calidad de grabación, +2 Habilidad técnica de sonido.',
    effects: {
      qualityBonus: 3,
      skillBonus: 2
    }
  },
  {
    id: 'starter_local_promo',
    name: 'Campaña de Difusión Local & TikTok Boost',
    category: 'home_studio',
    price: 260,
    monthlyUpkeep: 0,
    description: 'Pauta publicitaria focalizada en tu ciudad y afiches para dar a conocer tus primeros lanzamientos.',
    iconName: 'Sparkles',
    buffDescription: '+4 Hype basal, +2 Atractivo Comercial, -2% decaimiento de hype.',
    effects: {
      commercialAppealBonus: 2,
      hypeDecayReduction: 0.02
    }
  },
  {
    id: 'starter_midi_keyboard',
    name: 'Controlador MIDI 25 Teclas con Pads RGB',
    category: 'home_studio',
    price: 290,
    monthlyUpkeep: 12,
    description: 'Teclas sensibles a la velocidad, knobs giratorios y drum pads para arreglos melódicos rápidos.',
    iconName: 'Sliders',
    buffDescription: '+3 Creatividad melódica, +2 Habilidad técnica.',
    effects: {
      creativityBonus: 3,
      skillBonus: 2
    }
  },
  {
    id: 'starter_studio_monitors',
    name: 'Monitores de Estudio Campo Cercano (Par 4")',
    category: 'home_studio',
    price: 350,
    monthlyUpkeep: 15,
    description: 'Altavoces activos con respuesta plana para escuchar el balance real de graves y agudos.',
    iconName: 'Disc3',
    buffDescription: '+4 Calidad de masterización, +2 Habilidad, +1 Reputación.',
    effects: {
      qualityBonus: 4,
      skillBonus: 2,
      reputationBonus: 1
    }
  },

  // 1. ESTUDIO & EQUIPAMIENTO (+Calidad de grabación, +Skill)
  {
    id: 'studio_mic_shure_sm7b',
    name: 'Micrófono Shure SM7B + Preamp Cloudlifter',
    category: 'studio',
    price: 850,
    monthlyUpkeep: 30,
    description: 'El estándar de la industria para voces cálidas, nítidas y libres de ruido ambiente.',
    iconName: 'Mic',
    buffDescription: '+4 Calidad en todos tus temas y singles lanzados.',
    effects: {
      qualityBonus: 4,
      skillBonus: 2
    }
  },
  {
    id: 'studio_neumann_u87',
    name: 'Cadena Neumann U87 Ai + Universal Audio Apollo',
    category: 'studio',
    price: 5200,
    monthlyUpkeep: 120,
    description: 'Micrófono valvular legendario con convertidores de gama alta para una presencia vocal de clase mundial.',
    iconName: 'Radio',
    buffDescription: '+9 Calidad en lanzamientos, +5 Habilidad técnica.',
    effects: {
      qualityBonus: 9,
      skillBonus: 5
    }
  },
  {
    id: 'studio_console_ssl',
    name: 'Consola SSL Fusion & Monitores Genelec SAM',
    category: 'studio',
    price: 26000,
    monthlyUpkeep: 450,
    description: 'Procesamiento analógico estéreo y monitoreo de precisión milimétrica para mezclas y masterings imbatibles.',
    iconName: 'Sliders',
    buffDescription: '+16 Calidad en canciones/álbumes, +8 Habilidad, +4 Creatividad.',
    effects: {
      qualityBonus: 16,
      skillBonus: 8,
      creativityBonus: 4
    }
  },
  {
    id: 'studio_acoustic_suite',
    name: 'Estudio de Grabación & Mastering Privado Completo',
    category: 'studio',
    price: 110000,
    monthlyUpkeep: 1600,
    description: 'Instalación profesional flotante con sala en vivo, cabina de voz aislada y microfonía vintage.',
    iconName: 'Disc3',
    buffDescription: '+25 Calidad máxima en grabaciones, +12 Habilidad, +8 Reputación de industria.',
    effects: {
      qualityBonus: 25,
      skillBonus: 12,
      creativityBonus: 8,
      reputationBonus: 8
    }
  },

  // 2. BIENES RAÍCES & VIVIENDA (+Recuperación pasiva de energía/mes, +Reputación)
  {
    id: 'estate_soundproof_apt',
    name: 'Departamento Insonorizado en Zona Creativa',
    category: 'real_estate',
    price: 42000,
    monthlyUpkeep: 650,
    description: 'Espacio acústicamente tratado en el corazón de la ciudad. Podés componer de noche sin quejas de vecinos.',
    iconName: 'Home',
    buffDescription: '+6 Energía pasiva recuperada cada mes, +3 Reputación.',
    effects: {
      passiveEnergyPerMonth: 6,
      reputationBonus: 3
    }
  },
  {
    id: 'estate_suburban_house',
    name: 'Casa Quinta con Parque & Sala de Ensayo',
    category: 'real_estate',
    price: 165000,
    monthlyUpkeep: 2200,
    description: 'Propiedad amplia en barrio cerrado con piscina, jardín y quincho equipado para zapadas con otros artistas.',
    iconName: 'Building2',
    buffDescription: '+12 Energía pasiva recuperada cada mes, +7 Reputación.',
    effects: {
      passiveEnergyPerMonth: 12,
      reputationBonus: 7
    }
  },
  {
    id: 'estate_luxury_penthouse',
    name: 'Penthouse de Lujo con Vista Panorámica',
    category: 'real_estate',
    price: 550000,
    monthlyUpkeep: 6000,
    description: 'Piso exclusivo en la torre más alta, terraza con jacuzzi y ascensor privado. La cima del éxito visual.',
    iconName: 'Crown',
    buffDescription: '+18 Energía pasiva/mes, +14 Reputación, +5 Hype basal permanente.',
    effects: {
      passiveEnergyPerMonth: 18,
      reputationBonus: 14,
      hypeDecayReduction: 0.05
    }
  },
  {
    id: 'estate_hills_mansion',
    name: 'Mansión en las Colinas con Spa & Helipuerto',
    category: 'real_estate',
    price: 2200000,
    monthlyUpkeep: 20000,
    description: 'La máxima expresión del estrellato: finca privada protegida, spa, cine propio y espacio para fiestas memorables.',
    iconName: 'Sparkles',
    buffDescription: '+28 Energía pasiva/mes, +25 Reputación, +10 Hype basal sostenido.',
    effects: {
      passiveEnergyPerMonth: 28,
      reputationBonus: 25,
      hypeDecayReduction: 0.10
    }
  },

  // 3. VEHÍCULOS & MOVILIDAD (+Hype/Prestigio, -Fatiga en Giras)
  {
    id: 'vehicle_tour_van',
    name: 'Van de Producción & Transporte de Equipos',
    category: 'vehicles',
    price: 22000,
    monthlyUpkeep: 350,
    description: 'Vehículo espacioso y confiable para trasladar músicos, instrumentos y merchandising a cada recital.',
    iconName: 'Truck',
    buffDescription: '-15% Fatiga de energía en giras, +3 Hype escénico.',
    effects: {
      tourFatigueReduction: 0.15,
      hypeDecayReduction: 0.03
    }
  },
  {
    id: 'vehicle_vip_suv',
    name: 'Camioneta SUV Blindada con Chofer VIP',
    category: 'vehicles',
    price: 85000,
    monthlyUpkeep: 1100,
    description: 'Movilidad con vidrios polarizados oscuros, escolta y máxima comodidad entre hoteles, estudios y aeropuertos.',
    iconName: 'ShieldCheck',
    buffDescription: '-30% Fatiga de energía en giras, +8 Hype sostenido.',
    effects: {
      tourFatigueReduction: 0.30,
      hypeDecayReduction: 0.06
    }
  },
  {
    id: 'vehicle_supercar',
    name: 'Superdeportivo de Alta Gama (Exotic Car)',
    category: 'vehicles',
    price: 280000,
    monthlyUpkeep: 3200,
    description: 'Ícono de velocidad y opulencia. Protagonista perfecto para portadas, videoclips y apariciones públicas.',
    iconName: 'Flame',
    buffDescription: '+15 Hype sostenido, reduce el decaimiento mensual del hype un 15%, +5 Carisma.',
    effects: {
      hypeDecayReduction: 0.15,
      charismaBonus: 5,
      commercialAppealBonus: 5
    }
  },
  {
    id: 'vehicle_tour_bus_jet',
    name: 'Tour Bus VIP 5 Estrellas & Jet Privado Compartido',
    category: 'vehicles',
    price: 950000,
    monthlyUpkeep: 12000,
    description: 'Suite rodante con camas king, sala de estar y conectividad satelital para giras internacionales sin desgaste.',
    iconName: 'Zap',
    buffDescription: '-55% Fatiga en giras, +25 Hype sostenido, +10 Reputación.',
    effects: {
      tourFatigueReduction: 0.55,
      hypeDecayReduction: 0.20,
      reputationBonus: 10
    }
  },

  // 4. COACHING, SALUD & DESARROLLO PERSONAL (+Skill, +Creatividad, +Disciplina, +Carisma)
  {
    id: 'coach_theory_songwriting',
    name: 'Masterclass de Composición & Teoría Musical Avanzada',
    category: 'coaching',
    price: 3200,
    monthlyUpkeep: 0,
    description: 'Entrenamiento intensivo en armonía moderna, estructuras pop y trucos melódicos de hitmakers.',
    iconName: 'GraduationCap',
    buffDescription: '+8 Creatividad, +6 Habilidad técnica de por vida.',
    effects: {
      creativityBonus: 8,
      skillBonus: 6
    }
  },
  {
    id: 'coach_vocal_elite',
    name: 'Coach Vocal de Élite (Técnica & Resistencia)',
    category: 'coaching',
    price: 7500,
    monthlyUpkeep: 150,
    description: 'Perfeccionamiento de rango vocal, colocación, respiración y control en vivo sin fatigar cuerdas vocales.',
    iconName: 'Award',
    buffDescription: '+12 Habilidad técnica, +6 Carisma en vivo.',
    effects: {
      skillBonus: 12,
      charismaBonus: 6
    }
  },
  {
    id: 'coach_media_styling',
    name: 'Media Training & Asesoría de Imagen de Alta Costura',
    category: 'coaching',
    price: 14000,
    monthlyUpkeep: 250,
    description: 'Estrategia de entrevistas, presencia escénica, vestuario exclusivo y manejo magnético ante las cámaras.',
    iconName: 'Users',
    buffDescription: '+12 Carisma, +10 Atractivo Comercial, +5 Reputación.',
    effects: {
      charismaBonus: 12,
      commercialAppealBonus: 10,
      reputationBonus: 5
    }
  },
  {
    id: 'coach_wellness_nutrition',
    name: 'Preparador Físico, Chef Privado & Recuperación Deportiva',
    category: 'coaching',
    price: 24000,
    monthlyUpkeep: 1400,
    description: 'Nutrición personalizada, fisioterapia preventiva y rutinas de alta energía para resistir años de giras.',
    iconName: 'Heart',
    buffDescription: '+10 Energía pasiva/mes, +12 Disciplina, +4 Habilidad.',
    effects: {
      passiveEnergyPerMonth: 10,
      disciplineBonus: 12,
      skillBonus: 4
    }
  }
];
