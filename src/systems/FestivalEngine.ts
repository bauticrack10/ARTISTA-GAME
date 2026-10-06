import {
  Artist,
  GlobalFestival,
  FestivalSlot,
  FestivalInvitation,
  StageProductionConfig,
  LiveShowDilemma,
  LiveShowResult,
  LiveShowReview,
  WorldState,
  Song,
  CareerStage
} from '../types';

export const STAGE_PRODUCTION_COSTS = {
  visuals: {
    basic: 0,
    '3d_screens': 15000,
    monumental_mapping: 45000
  },
  pyro: {
    none: 0,
    sparks_fog: 8000,
    flamethrowers_lasers: 25000
  },
  crew: {
    solo_dj: 0,
    live_band: 12000,
    elite_dancers_choir: 30000
  }
} as const;

export const GLOBAL_FESTIVALS: GlobalFestival[] = [
  {
    id: 'coachella',
    name: 'Coachella Valley Music and Arts Festival',
    location: 'Indio, California',
    country: 'USA',
    month: 4,
    genres: ['pop', 'urban', 'reggaeton', 'trap_latino', 'indie_rock', 'alternative', 'electronic', 'hip_hop'],
    capacity: 125000,
    prestige: 98,
    description: 'El epicentro de la cultura pop, moda y tendencias globales en el valle de Coachella.',
    bannerGradient: 'from-amber-500 via-rose-500 to-indigo-900',
    icon: 'palms'
  },
  {
    id: 'lollapalooza_ar',
    name: 'Lollapalooza Argentina',
    location: 'Hipódromo de San Isidro, Buenos Aires',
    country: 'Argentina',
    month: 3,
    genres: ['rock', 'urban', 'trap_latino', 'indie_rock', 'pop', 'hip_hop'],
    capacity: 100000,
    prestige: 90,
    description: 'El festival más convocante del cono sur con 5 escenarios en simultáneo y multitudes apasionadas.',
    bannerGradient: 'from-yellow-400 via-red-500 to-purple-800',
    icon: 'stage'
  },
  {
    id: 'primavera_sound',
    name: 'Primavera Sound',
    location: 'Parc del Fòrum, Barcelona',
    country: 'Spain',
    month: 6,
    genres: ['indie_rock', 'urban', 'electronic', 'alternative', 'pop', 'experimental'],
    capacity: 85000,
    prestige: 94,
    description: 'Vanguardia artística, curaduría de culto y el mar Mediterráneo de fondo.',
    bannerGradient: 'from-teal-400 via-indigo-600 to-slate-900',
    icon: 'waves'
  },
  {
    id: 'glastonbury',
    name: 'Glastonbury Festival',
    location: 'Worthy Farm, Pilton, Somerset',
    country: 'UK',
    month: 6,
    genres: ['rock', 'indie_rock', 'pop', 'legend', 'eclectic', 'electronic', 'alternative'],
    capacity: 210000,
    prestige: 99,
    description: 'El mítico templo del Pyramid Stage en los campos verdes de Somerset. Historia viva de la música.',
    bannerGradient: 'from-emerald-600 via-amber-600 to-stone-900',
    icon: 'pyramid'
  },
  {
    id: 'tomorrowland',
    name: 'Tomorrowland',
    location: 'De Schorre, Boom',
    country: 'Belgium',
    month: 7,
    genres: ['electronic', 'edm', 'house', 'techno', 'urban'],
    capacity: 200000,
    prestige: 96,
    description: 'Fantasía, pirotecnia colosal y los escenarios temáticos más espectaculares del planeta.',
    bannerGradient: 'from-violet-600 via-fuchsia-500 to-indigo-950',
    icon: 'sparkles'
  },
  {
    id: 'cosquin_rock',
    name: 'Cosquín Rock',
    location: 'Aeródromo de Santa María de Punilla, Córdoba',
    country: 'Argentina',
    month: 2,
    genres: ['rock', 'trap_latino', 'urban', 'indie_rock', 'blues'],
    capacity: 55000,
    prestige: 85,
    description: 'El pogo de las sierras cordobesas donde convergen el rock histórico y el trap argentino.',
    bannerGradient: 'from-orange-600 via-amber-700 to-stone-900',
    icon: 'mountain'
  },
  {
    id: 'rolling_loud',
    name: 'Rolling Loud',
    location: 'Hard Rock Stadium, Miami, Florida',
    country: 'USA',
    month: 7,
    genres: ['hip_hop', 'trap_latino', 'urban', 'rap'],
    capacity: 75000,
    prestige: 92,
    description: 'La meca global del hip hop y el trap con moshpits incesantes y la escena más cruda.',
    bannerGradient: 'from-red-600 via-rose-700 to-zinc-950',
    icon: 'flame'
  }
];

const CAREER_STAGE_RANK: Record<CareerStage, number> = {
  Underground: 1,
  Emerging: 2,
  Breakout: 3,
  Established: 4,
  Mainstream: 5,
  Superstar: 6,
  Veteran: 6,
  Legend: 7,
  Comeback: 4,
  Declining: 3,
  Retired: 0
};

export const LIVE_SHOW_DILEMMAS: LiveShowDilemma[] = [
  {
    id: 'sound_failure',
    title: 'Falla Crítica de Sonido y Monitores',
    contextDescription: 'A mitad del setlist, los monitores in-ear y las torres de sonido principales se apagan por un corte de potencia inesperado. 80.000 personas quedan en silencio expectante.',
    choices: [
      {
        id: 'acapella_crowd',
        text: 'Cantar a capella y dirigir el coro multitudinario',
        description: 'Bajas al borde del escenario con el micrófono apagado y cantas el estribillo más icónico a viva voz invitando a toda la masa a corearlo.',
        statCheck: { stat: 'charisma', min: 55 },
        consequenceDescription: '¡Momento histórico! La multitud ruge con devoción cantando cada verso. La ovación pone la piel de gallina.',
        scoreModifier: 14,
        hypeModifier: 20,
        energyModifier: -10,
        reputationModifier: 15,
        credibilityModifier: 18,
        fansMultiplier: 1.35
      },
      {
        id: 'improv_drum_freestyle',
        text: 'Hacer un freestyle o solo improvisado sobre el escenario',
        description: 'Aprovechas el parlante de retorno residual para tirar rimas filosas sobre la situación mientras la banda improvisa un beat rítmico.',
        statCheck: { stat: 'skill', min: 60 },
        consequenceDescription: 'Tu destreza técnica deslumbra a los presentes y a la crítica de culto. Salvaste el bache con pura jerarquía.',
        scoreModifier: 10,
        hypeModifier: 12,
        energyModifier: -8,
        reputationModifier: 10,
        credibilityModifier: 14,
        fansMultiplier: 1.15
      },
      {
        id: 'halt_wait_crew',
        text: 'Detener el show con calma y esperar a los ingenieros de sonido',
        description: 'Haces una pausa profesional, dialogas con la primera fila mientras los técnicos resuelven el fusible quemado.',
        consequenceDescription: 'Manejo formal y maduro. El show se reanuda con sonido impecable aunque se pierde algo del frenesí inicial.',
        scoreModifier: 2,
        hypeModifier: -4,
        energyModifier: 2,
        reputationModifier: 6,
        credibilityModifier: 4,
        fansMultiplier: 1.0
      }
    ]
  },
  {
    id: 'torrential_storm',
    title: 'Tormenta Eléctrica y Lluvia Torrencial',
    contextDescription: 'El cielo se abre de golpe y un diluvio cae sobre el festival. El agua inunda la pasarela del escenario y empapa por completo al público.',
    choices: [
      {
        id: 'embrace_storm',
        text: 'Saltar bajo la lluvia torrencial y arengar a la masa',
        description: 'Abandonas la protección del techo, corres por la pasarela empapada y agitas la bandera bajo la lluvia desatada.',
        statCheck: { stat: 'discipline', min: 50 },
        consequenceDescription: '¡Épica visual legendaria! Las fotos empapado bajo las luces del festival se vuelven tapa de revista instantánea.',
        scoreModifier: 16,
        hypeModifier: 25,
        energyModifier: -22,
        reputationModifier: 14,
        credibilityModifier: 12,
        fansMultiplier: 1.45
      },
      {
        id: 'acoustic_shelter',
        text: 'Mantenerse bajo techo y adaptar el set a formato acústico/íntimo',
        description: 'Pides bajar la intensidad electrónica y ejecutas versiones cálidas con guitarras y teclados mientras afuera diluvia.',
        statCheck: { stat: 'creativity', min: 55 },
        consequenceDescription: 'Un clima de intimidad conmovedor en medio de la tormenta. La crítica destaca tu versatilidad sonora.',
        scoreModifier: 8,
        hypeModifier: 6,
        energyModifier: -5,
        reputationModifier: 10,
        credibilityModifier: 16,
        fansMultiplier: 1.15
      },
      {
        id: 'safety_pause',
        text: 'Hacer una pausa preventiva de seguridad',
        description: 'Priorizas la seguridad de cables y equipos esperando a que pase lo peor de la ráfaga de viento.',
        consequenceDescription: 'Decisión prudente y sensata respetada por la producción del festival.',
        scoreModifier: 0,
        hypeModifier: -6,
        energyModifier: 5,
        reputationModifier: 12,
        credibilityModifier: 2,
        fansMultiplier: 0.95
      }
    ]
  },
  {
    id: 'moshpit_barricade',
    title: 'Valla de Contención Desbordada y Pogo Feroz',
    contextDescription: 'La energía del público se desborda y las primeras vallas de contención comienzan a ceder ante la presión de miles de fans extasiados.',
    choices: [
      {
        id: 'calm_three_steps_back',
        text: 'Pausar la pista y pedir calmadamente tres pasos hacia atrás',
        description: 'Cortas el beat con total serenidad, pides que todos se cuiden entre sí y no continúas hasta que los de adelante tengan espacio para respirar.',
        statCheck: { stat: 'charisma', min: 50 },
        consequenceDescription: 'Lección de liderazgo y empatía. La prensa internacional destaca tu templanza humana y profesionalismo.',
        scoreModifier: 10,
        hypeModifier: 8,
        energyModifier: -4,
        reputationModifier: 22,
        credibilityModifier: 15,
        fansMultiplier: 1.2
      },
      {
        id: 'dive_into_pit',
        text: 'Exigir el máximo moshpit y tirarte al público',
        description: 'Desafías el peligro, arengas con rabia y te arrojas directamente a los brazos del pogo en un acto de adrenalina pura.',
        statCheck: { stat: 'riskTolerance', min: 65 },
        consequenceDescription: '¡Demencia absoluta! La seguridad sudó frío pero el video del stagedive explota en TikTok y foros de música con millones de vistas.',
        scoreModifier: 15,
        hypeModifier: 28,
        energyModifier: -20,
        reputationModifier: -5,
        credibilityModifier: 10,
        fansMultiplier: 1.5
      },
      {
        id: 'subtle_slowdown',
        text: 'Coordinar con seguridad desde el micrófono sin frenar el tema',
        description: 'Bajas sutilmente la intensidad del groove mientras indicas con gestos al personal médico y de seguridad.',
        consequenceDescription: 'Transición profesional sin incidentes que mantuvo el ritmo del espectáculo sin que nadie salga lastimado.',
        scoreModifier: 6,
        hypeModifier: 4,
        energyModifier: -6,
        reputationModifier: 12,
        credibilityModifier: 8,
        fansMultiplier: 1.05
      }
    ]
  },
  {
    id: 'rival_vip_appearance',
    title: 'Aparición de un Rival en el Backstage / VIP',
    contextDescription: 'Tu principal rival en la escena o charts fue visto en la tarima lateral de invitados especiales observando atentamente tu concierto.',
    choices: [
      {
        id: 'invite_onstage_unity',
        text: 'Invitarlo al escenario por sorpresa para romper la tensión',
        description: 'Agarras el micrófono, lo señalas y lo invitas a subir para compartir un abrazo o soltar un verso juntos ante el asombro del estadio.',
        statCheck: { stat: 'sociability', min: 55 },
        consequenceDescription: '¡Colapso de las redes! La imagen de ambos artistas juntos en el festival más grande se convierte en la noticia del año.',
        scoreModifier: 18,
        hypeModifier: 32,
        energyModifier: -10,
        reputationModifier: 20,
        credibilityModifier: 14,
        fansMultiplier: 1.55
      },
      {
        id: 'sharp_lyrical_jab',
        text: 'Tirarle una indirecta punzante y rima filosa desde el escenario',
        description: 'Lo miras fijamente desde el centro del escenario y rematas una barra picante dedicada a sus últimos números.',
        statCheck: { stat: 'originality', min: 60 },
        consequenceDescription: 'El estadio ruge enardecido. La prensa de hip-hop y las redes arden con análisis del beef en tiempo real.',
        scoreModifier: 12,
        hypeModifier: 24,
        energyModifier: -8,
        reputationModifier: -4,
        credibilityModifier: 16,
        fansMultiplier: 1.25
      },
      {
        id: 'absolute_indifference',
        text: 'Ignorarlo con elegancia y concentrarte al 100% en tu set',
        description: 'Ni una mirada ni una palabra fuera de lugar. Tu show es tan perfecto que demuestra quién domina el escenario sin necesidad de trucos.',
        consequenceDescription: 'Clase magistral de presencia escénica. Dejaste en claro tu superioridad artística con pura música.',
        scoreModifier: 10,
        hypeModifier: 8,
        energyModifier: -6,
        reputationModifier: 14,
        credibilityModifier: 10,
        fansMultiplier: 1.1
      }
    ]
  },
  {
    id: 'unrehearsed_anthem_request',
    title: 'Clamor Masivo por un Tema No Ensayado',
    contextDescription: 'Antes de los bises, 90.000 personas empiezan a cantar al unísono una canción de culto de tus inicios que no estaba en el setlist ensayado con las pantallas.',
    choices: [
      {
        id: 'play_raw_instinct',
        text: 'Tocarlo a puro instinto con la banda aunque no esté en pantallas',
        description: 'Miras a tu banda o al DJ, asienten al instante y lanzan los acordes crudos conectando con el corazón de los fanáticos más antiguos.',
        statCheck: { stat: 'skill', min: 55 },
        consequenceDescription: 'Conexión espiritual y genuina con tu fanaticada. Los fans más fieles lloran de emoción.',
        scoreModifier: 15,
        hypeModifier: 18,
        energyModifier: -12,
        reputationModifier: 12,
        credibilityModifier: 20,
        fansMultiplier: 1.4
      },
      {
        id: 'bring_fan_onstage',
        text: 'Invitar a un fan del público a cantar el tema en el escenario',
        description: 'Ves a un seguidor en primera fila con una pancarta histórica, lo subes al escenario y le entregas el micrófono para que lo cante contigo.',
        statCheck: { stat: 'charisma', min: 60 },
        consequenceDescription: '¡Momento conmovedor y viral! El abrazo y la alegría del fan se reproducen 40 millones de veces en redes sociales.',
        scoreModifier: 14,
        hypeModifier: 26,
        energyModifier: -8,
        reputationModifier: 18,
        credibilityModifier: 12,
        fansMultiplier: 1.5
      },
      {
        id: 'stick_to_setlist',
        text: 'Apegarse al setlist cronometrado y rematar con el hit planificado',
        description: 'Agradeces el cariño pero mantienes la disciplina técnica para que la sincronización con el show de visuales y mapping sea milimétrica.',
        consequenceDescription: 'Cierre visualmente perfecto e imponente, respetando al minuto los tiempos de la transmisión internacional.',
        scoreModifier: 8,
        hypeModifier: 4,
        energyModifier: -5,
        reputationModifier: 8,
        credibilityModifier: 4,
        fansMultiplier: 1.05
      }
    ]
  }
];

export interface ResolveLiveShowParams {
  artist: Artist;
  festival: GlobalFestival;
  slot: FestivalSlot;
  setlistSongIds?: string[];
  production: StageProductionConfig;
  dilemmaChoice?: { dilemmaId: string; choiceId: string };
  world?: WorldState;
}

export class FestivalEngine {
  /**
   * Determina el slot al que es elegible el artista en un festival según su popularidad,
   * trayectoria y relevancia en la industria.
   */
  static getEligibleSlot(artist: Artist, festival?: GlobalFestival): FestivalSlot | null {
    const pop = artist.stats.popularity;
    const stage = artist.careerStage;
    const rank = CAREER_STAGE_RANK[stage] || 1;

    // Headliner: Popularidad >= 85 y Superstar/Veteran/Legend (o >= 90)
    if (pop >= 85 && (rank >= 6 || pop >= 90)) {
      return 'headliner';
    }

    // Sub-headliner: Popularidad >= 70 y Mainstream+ (o >= 75)
    if (pop >= 70 && (rank >= 5 || pop >= 75)) {
      return 'sub_headliner';
    }

    // Sunset slot: Popularidad >= 45 y Established+ (o >= 50)
    if (pop >= 45 && (rank >= 4 || pop >= 50)) {
      return 'sunset_slot';
    }

    // Opening act: Popularidad >= 20 y Emerging+ (o >= 22)
    if (pop >= 20 && (rank >= 2 || pop >= 22)) {
      return 'opening_act';
    }

    return null;
  }

  /**
   * Título y descripción legible del slot.
   */
  static getSlotTitle(slot: FestivalSlot): string {
    switch (slot) {
      case 'headliner':
        return 'Headliner • Cierre de Escenario Principal';
      case 'sub_headliner':
        return 'Sub-Headliner • Escenario Principal';
      case 'sunset_slot':
        return 'Sunset Slot • Horario Dorado de Atardecer';
      case 'opening_act':
        return 'Opening Act • Apertura de Escenario';
    }
  }

  /**
   * Genera invitaciones estacionales para el artista en base a los festivales icónicos
   * que se aproximan en la temporada (ventana de 0 a 2 meses previos al mes del festival).
   */
  static generateSeasonalInvitations(
    artist: Artist,
    currentYear: number,
    currentMonth: number,
    world?: WorldState
  ): FestivalInvitation[] {
    const invitations: FestivalInvitation[] = [];

    for (const fest of GLOBAL_FESTIVALS) {
      // Meses de diferencia cíclica anual (0 = ocurre este mes, 1 = el mes que viene, etc.)
      const monthDiff = (fest.month - currentMonth + 12) % 12;

      // La temporada de ofertas se abre 1 o 2 meses antes, o en el mes mismo
      if (monthDiff <= 2) {
        const slot = this.getEligibleSlot(artist, fest);
        if (!slot) continue;

        // Comprobar si ya existe una invitación previa para este año y festival
        const existingId = `inv_${fest.id}_${currentYear}_${artist.id}`;
        const alreadyInvited = world?.festivalInvitations?.some(
          inv => inv.id === existingId || (inv.festivalId === fest.id && inv.year === currentYear)
        );

        if (alreadyInvited) continue;

        // Cálculo de caché según slot, popularidad y prestigio del festival
        let basePayout = 10000;
        let audienceRatio = 0.20;
        let prestigeBoost = 3;

        if (slot === 'opening_act') {
          basePayout = 8000 + artist.stats.popularity * 250;
          audienceRatio = 0.20;
          prestigeBoost = 3;
        } else if (slot === 'sunset_slot') {
          basePayout = 35000 + artist.stats.popularity * 750;
          audienceRatio = 0.50;
          prestigeBoost = 6;
        } else if (slot === 'sub_headliner') {
          basePayout = 110000 + artist.stats.popularity * 1600;
          audienceRatio = 0.78;
          prestigeBoost = 10;
        } else if (slot === 'headliner') {
          basePayout = 320000 + artist.stats.popularity * 4200;
          audienceRatio = 0.95;
          prestigeBoost = 16;
        }

        const prestigeMultiplier = fest.prestige / 85;
        const payout = Math.floor(basePayout * prestigeMultiplier);
        const audienceExpected = Math.floor(fest.capacity * audienceRatio);

        invitations.push({
          id: existingId,
          festivalId: fest.id,
          festivalName: fest.name,
          location: fest.location,
          country: fest.country,
          month: fest.month,
          year: currentYear,
          slot,
          slotTitle: this.getSlotTitle(slot),
          payout,
          audienceExpected,
          prestigeBoost,
          status: 'pending'
        });
      }
    }

    return invitations;
  }

  /**
   * Calcula los costos totales de producción escénica para un show en festival.
   */
  static calculateProductionCost(config: StageProductionConfig): number {
    const visualCost = STAGE_PRODUCTION_COSTS.visuals[config.visuals] ?? 0;
    const pyroCost = STAGE_PRODUCTION_COSTS.pyro[config.pyro] ?? 0;
    const crewCost = STAGE_PRODUCTION_COSTS.crew[config.crew] ?? 0;
    return visualCost + pyroCost + crewCost;
  }

  /**
   * Resuelve el show en vivo en el festival, evaluando setlist, producción escénica,
   * dilemas interactivos, desempeño en vivo y repercusión en la prensa global.
   */
  static resolveLiveShow(params: ResolveLiveShowParams): LiveShowResult {
    const { artist, festival, slot, setlistSongIds, production, dilemmaChoice, world } = params;

    // 1. Costo de producción
    const productionCost = this.calculateProductionCost(production);

    // 2. Caché bruto del artista
    let basePayout = 12000;
    let baseAudienceRatio = 0.22;
    let baseEnergyCost = 22;

    if (slot === 'opening_act') {
      basePayout = 9000 + artist.stats.popularity * 280;
      baseAudienceRatio = 0.22;
      baseEnergyCost = 20;
    } else if (slot === 'sunset_slot') {
      basePayout = 38000 + artist.stats.popularity * 800;
      baseAudienceRatio = 0.52;
      baseEnergyCost = 28;
    } else if (slot === 'sub_headliner') {
      basePayout = 120000 + artist.stats.popularity * 1700;
      baseAudienceRatio = 0.78;
      baseEnergyCost = 36;
    } else if (slot === 'headliner') {
      basePayout = 350000 + artist.stats.popularity * 4500;
      baseAudienceRatio = 0.96;
      baseEnergyCost = 45;
    }

    const payoutGross = Math.floor(basePayout * (festival.prestige / 85));
    const netProfit = payoutGross - productionCost;
    const attendance = Math.floor(festival.capacity * baseAudienceRatio);

    // 3. Evaluación de Setlist
    let setlistQualityAvg = artist.personality.skill;
    let setlistAppealAvg = artist.personality.commercialAppeal;
    let songsCount = 0;

    if (setlistSongIds && setlistSongIds.length > 0 && world?.songs) {
      let sumQ = 0;
      let sumA = 0;
      for (const sId of setlistSongIds) {
        const s = world.songs[sId];
        if (s) {
          sumQ += s.quality;
          sumA += s.commercialAppeal;
          songsCount++;
        }
      }
      if (songsCount > 0) {
        setlistQualityAvg = sumQ / songsCount;
        setlistAppealAvg = sumA / songsCount;
      }
    }

    // 4. Bonificaciones de Escenario
    let visualBonus = 0;
    let visualHype = 0;
    if (production.visuals === '3d_screens') {
      visualBonus = 6;
      visualHype = 6;
    } else if (production.visuals === 'monumental_mapping') {
      visualBonus = 14;
      visualHype = 14;
    }

    let pyroBonus = 0;
    let pyroHype = 0;
    if (production.pyro === 'sparks_fog') {
      pyroBonus = 4;
      pyroHype = 7;
    } else if (production.pyro === 'flamethrowers_lasers') {
      pyroBonus = 10;
      pyroHype = 15;
    }

    let crewBonus = 0;
    let crewHype = 0;
    let crewCred = 0;
    if (production.crew === 'live_band') {
      crewBonus = 8;
      crewHype = 5;
      crewCred = 10;
    } else if (production.crew === 'elite_dancers_choir') {
      crewBonus = 12;
      crewHype = 12;
      crewCred = 4;
    }

    // 5. Puntuación de Performance Base (0 - 100)
    const skillScore = (artist.personality.skill || 70) * 0.28;
    const charismaScore = (artist.personality.charisma || 70) * 0.25;
    const energyScore = (artist.stats.energy || 80) * 0.15;
    const musicScore = (setlistQualityAvg * 0.6 + setlistAppealAvg * 0.4) * 0.20;
    const stageProdScore = (visualBonus + pyroBonus + crewBonus) * 0.4;
    const variance = Math.floor(Math.random() * 9 - 4); // -4 a +4

    let rawScore = Math.floor(skillScore + charismaScore + energyScore + musicScore + stageProdScore + variance);
    let performanceScore = Math.min(99, Math.max(25, rawScore));

    // 6. Procesamiento de Dilema
    let dilemmaResultInfo: LiveShowResult['dilemmaEncountered'] | undefined;
    let dilemmaHypeDelta = 0;
    let dilemmaRepDelta = 0;
    let dilemmaCredDelta = 0;
    let dilemmaEnergyDelta = 0;
    let fansMultiplier = 1.0;

    if (dilemmaChoice) {
      const dilemma = LIVE_SHOW_DILEMMAS.find(d => d.id === dilemmaChoice.dilemmaId);
      const option = dilemma?.choices.find(c => c.id === dilemmaChoice.choiceId);

      if (dilemma && option) {
        // Verificar stat check si existe
        let statPassed = true;
        if (option.statCheck) {
          const artistStatVal = (artist.personality[option.statCheck.stat as keyof typeof artist.personality] ??
            artist.stats[option.statCheck.stat as keyof typeof artist.stats] ?? 50) as number;
          statPassed = artistStatVal >= option.statCheck.min;
        }

        const modifierFactor = statPassed ? 1.0 : 0.5;
        performanceScore = Math.min(100, Math.max(15, performanceScore + Math.floor(option.scoreModifier * modifierFactor)));
        dilemmaHypeDelta = Math.floor(option.hypeModifier * modifierFactor);
        dilemmaRepDelta = Math.floor(option.reputationModifier * modifierFactor);
        dilemmaCredDelta = Math.floor(option.credibilityModifier * modifierFactor);
        dilemmaEnergyDelta = option.energyModifier;
        fansMultiplier = statPassed ? option.fansMultiplier : 1.0;

        dilemmaResultInfo = {
          dilemmaTitle: dilemma.title,
          chosenOptionText: option.text,
          consequenceText: statPassed
            ? option.consequenceDescription
            : `${option.consequenceDescription} (Aunque con momentos de tensión al faltar preparación).`
        };
      }
    }

    // 7. Impactos Generados
    const baseHypeGained = Math.floor(
      (performanceScore / 100) * (slot === 'headliner' ? 24 : slot === 'sub_headliner' ? 18 : slot === 'sunset_slot' ? 12 : 7) +
      visualHype + pyroHype + crewHype + dilemmaHypeDelta
    );
    const hypeGained = Math.min(45, Math.max(2, baseHypeGained));

    const baseFansGained = Math.floor((attendance * 0.08) * (performanceScore / 100) * fansMultiplier);
    const fansGained = Math.max(50, baseFansGained);

    const baseRepGained = Math.floor(
      (performanceScore >= 80 ? 6 : performanceScore >= 60 ? 3 : 1) + (slot === 'headliner' ? 4 : 2) + dilemmaRepDelta
    );
    const reputationGained = Math.max(-5, baseRepGained);

    const credibilityGained = Math.max(-2, Math.floor(crewCred + (performanceScore >= 85 ? 5 : 2) + dilemmaCredDelta));

    const disciplineMitigation = Math.floor((artist.personality.discipline || 50) * 0.1);
    const energySpent = Math.max(8, baseEnergyCost - disciplineMitigation - dilemmaEnergyDelta);

    // 8. Momento Viral
    const viralChance = (performanceScore >= 85 ? 0.45 : performanceScore >= 75 ? 0.25 : 0.10) +
      (production.pyro === 'flamethrowers_lasers' ? 0.15 : 0) +
      (production.visuals === 'monumental_mapping' ? 0.15 : 0) +
      (dilemmaChoice ? 0.20 : 0);

    const isViral = Math.random() < Math.min(0.95, viralChance);
    const tiktokViews = isViral
      ? Math.floor(1500000 + Math.random() * 8500000 * (performanceScore / 70))
      : undefined;

    const viralMoment = {
      occurred: isViral,
      description: isViral
        ? `El show de ${artist.name} en ${festival.name} detonó millones de clips con la multitud cantando a oscuras con linternas encendidas.`
        : 'Presentación sólida que afianzó el respeto del público festivalero.',
      tiktokViewsGained: tiktokViews
    };

    // 9. Reseñas de Prensa Acreditada
    const pressReviews: LiveShowReview[] = [];
    if (performanceScore >= 85) {
      pressReviews.push({
        outlet: 'Rolling Stone',
        headline: `Triunfo Absoluto: ${artist.name} corona una noche consagratoria en ${festival.name}`,
        snippet: `"Con una puesta visual demoledora y magnetismo intacto, la presentación fue el punto cúspide de todo el festival. Una lección magistral de cómo conquistar a 100.000 almas."`,
        rating: 9.6
      });
      pressReviews.push({
        outlet: 'Pitchfork',
        headline: `Catarsis colectiva y ambición sonora: el show de ${artist.name}`,
        snippet: `"Lejos de apoyarse en pistas pregrabadas, la cohesión musical y el riesgo conceptual justifican con creces su lugar en la cima."`,
        rating: 8.9
      });
      pressReviews.push({
        outlet: 'Billboard',
        headline: `${artist.name} rompe marcas de convocatoria y euforia en ${festival.name}`,
        snippet: `"El despliegue técnico y la conexión visceral con la marea humana confirmaron que estamos ante una de las fuerzas dominantes de la música contemporánea."`,
        rating: 9.4
      });
    } else if (performanceScore >= 68) {
      pressReviews.push({
        outlet: 'Billboard',
        headline: `${artist.name} enciende a las multitudes en ${festival.name}`,
        snippet: `"Un set electrizante de principio a fin, manteniendo la tensión y entregando hit tras hit sin dar tregua."`,
        rating: 7.8
      });
      pressReviews.push({
        outlet: 'NME',
        headline: `Energía contagiosa y carisma en el paso de ${artist.name} por ${festival.name}`,
        snippet: `"Hubo momentos de desborde y gran comunión, consolidando su estatus de atracción festivalera obligada."`,
        rating: 7.5
      });
      pressReviews.push({
        outlet: 'Indie Hoy',
        headline: `El pulso de la escena: ${artist.name} demostró poderío en vivo`,
        snippet: `"El repertorio funcionó como un reloj suizo frente a un público que no paró de saltar durante toda la hora de presentación."`,
        rating: 7.7
      });
    } else {
      pressReviews.push({
        outlet: 'Rolling Stone',
        headline: `Paso irregular de ${artist.name} por ${festival.name}`,
        snippet: `"Destellos de talento que se vieron opacados por baches de ritmo y detalles de coordinación escénica."`,
        rating: 5.8
      });
      pressReviews.push({
        outlet: 'NME',
        headline: `Un concierto cumplidor que dejó con ganas de más audacia`,
        snippet: `"La producción no logró disimular del todo la desconexión en ciertos tramos del setlist."`,
        rating: 5.5
      });
    }

    // 10. Titular Global de Noticias
    const newsHeadline = performanceScore >= 85
      ? `${artist.name} firma el show más impactante de ${festival.name}`
      : performanceScore >= 68
      ? `${artist.name} enciende a ${attendance.toLocaleString()} personas en ${festival.name}`
      : `${artist.name} completa su paso por el escenario de ${festival.name}`;

    const newsBody = `En el marco de ${festival.name} (${festival.location}), ${artist.name} se presentó como ${this.getSlotTitle(slot)} ante una multitud estimada en ${attendance.toLocaleString()} espectadores. El show dejó una recaudación neta de $${netProfit.toLocaleString()} y cosechó una calificación de ${performanceScore}/100 por parte de los cronistas especializados.`;

    return {
      festivalId: festival.id,
      festivalName: festival.name,
      year: world?.currentYear || 2026,
      month: festival.month,
      slot,
      performanceScore,
      attendance,
      payoutGross,
      productionCost,
      netProfit,
      hypeGained,
      fansGained,
      reputationGained,
      credibilityGained,
      energySpent,
      dilemmaEncountered: dilemmaResultInfo,
      pressReviews,
      viralMoment,
      newsHeadline,
      newsBody
    };
  }
}
