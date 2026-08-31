import { EventDefinition, EventContext, CareerStage, MusicRegion } from '../types';
import { formatMoney } from '../utils/formatters';
import { TimeSystem } from '../systems/TimeSystem';
import { IndustryEngine } from '../systems/IndustryEngine';

export const CORE_EVENT_TEMPLATES: EventDefinition[] = [
  // ============================================================================
  // 1. EL PRIMER CONTRATO / DISTRIBUCIÓN (Underground) -> evt_first_contract_offer
  // ============================================================================
  {
    id: 'evt_home_studio_recording',
    title: 'La Primera Grabación en el Home Studio',
    category: 'career',
    rarity: 'common',
    maxCareerStage: 'Underground',
    cooldownMonths: 12,
    weight: 20,
    condition: (ctx) => ctx.player.stats.popularity <= 25,
    getDescription: (ctx) => `Con un micrófono modesto conectado a tu computadora en tu habitación de ${ctx.player.city}, tenés la oportunidad de encerrarte el fin de semana a grabar maquetas crudas.`,
    choices: (ctx) => [
      {
        id: 'c_record_obsessive',
        text: 'Pasar 48 horas seguidas grabando y puliendo cada toma',
        consequencesDescription: '+4 Credibilidad artística, +3 Reputación, -15 Energía',
        apply: () => ({
          narrativeText: 'Quedaste exhausto pero las voces suenan con una crudeza y emoción auténticas.',
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 4) },
          reputationChange: 3,
          energyChange: -15,
          hypeChange: 5
        })
      },
      {
        id: 'c_record_spontaneous',
        text: 'Grabar en una sola toma y subir un adelanto a redes',
        consequencesDescription: '+12 Hype, +80 Primeros Fans, -5 Energía',
        apply: () => ({
          narrativeText: 'El adelanto causó curiosidad en redes. Algunos amigos y desconocidos comenzaron a compartirlo en historias.',
          hypeChange: 12,
          fansChange: 80,
          energyChange: -5
        })
      },
      {
        id: 'c_study_production',
        text: 'Tomarte el tiempo para aprender a ecualizar y comprimir tus voces',
        consequencesDescription: '+3 Habilidad técnica, +1 Disciplina, +3 Credibilidad artística, -8 Energía',
        apply: () => ({
          narrativeText: 'Comprendiste conceptos clave de mezcla que mejorarán la calidad de cada tema futuro.',
          personalityChanges: {
            skill: Math.min(100, ctx.player.personality.skill + 3),
            discipline: Math.min(100, ctx.player.personality.discipline + 1)
          },
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 3) },
          energyChange: -8
        })
      }
    ]
  },

  {
    id: 'evt_finding_a_beatmaker',
    title: 'El Beatmaker del Barrio y la Primera Pista',
    category: 'relationships',
    rarity: 'common',
    maxCareerStage: 'Underground',
    cooldownMonths: 18,
    weight: 18,
    condition: (ctx) => ctx.player.stats.popularity <= 30,
    getDescription: (ctx) => `Un beatmaker emergente de ${ctx.player.city} te contacta por redes diciendo que le gustó tu estilo vocal y te envía una carpeta con beats inéditos.`,
    choices: (ctx) => [
      {
        id: 'c_collab_beatmaker',
        text: 'Elegir su mejor instrumental y ofrecerle crédito al 50%',
        consequencesDescription: '+Conexión con productor, +10 Hype, +2 Sociabilidad, +Relación positiva',
        apply: () => ({
          narrativeText: 'La química entre tu voz y su base fue perfecta. Nació una alianza sonora prometedora.',
          hypeChange: 10,
          fansChange: 120,
          personalityChanges: { sociability: Math.min(100, ctx.player.personality.sociability + 2) },
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 3) }
        })
      },
      {
        id: 'c_buy_exclusive',
        text: 'Pagarle $150 por los derechos exclusivos de la pista',
        costFunds: 150,
        consequencesDescription: '-$150 Fondos, +100% Derechos y másters, +2 Ambición, +2 Independencia',
        apply: () => ({
          narrativeText: 'El productor quedó sorprendido por tu seriedad comercial. La instrumental ahora es 100% tuya.',
          fundsChange: -150,
          reputationChange: 4,
          personalityChanges: {
            ambition: Math.min(100, ctx.player.personality.ambition + 2),
            independence: Math.min(100, ctx.player.personality.independence + 2)
          },
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 2) }
        })
      }
    ]
  },

  {
    id: 'evt_first_bar_show',
    title: 'El Primer Show en un Bar / Club Local',
    category: 'shows',
    rarity: 'common',
    maxCareerStage: 'Emerging',
    cooldownMonths: 16,
    weight: 16,
    condition: (ctx) => ctx.player.stats.popularity <= 35,
    getDescription: (ctx) => `Un bar cultural subterráneo en ${ctx.player.city} organiza una fecha independiente para 50 personas y te ofrecen un espacio de 15 minutos en el escenario.`,
    choices: (ctx) => [
      {
        id: 'c_give_it_all',
        text: 'Dejar el alma en el escenario y saltar con el público',
        consequencesDescription: '+2 Carisma en vivo, +150 Fans fieles, +$80 de gorra, -12 Energía',
        apply: () => ({
          narrativeText: 'La energía fue contagiosa. Las pocas personas presentes terminaron saltando y pidiéndote fotos al bajar.',
          fansChange: 150,
          popularityChange: 2,
          reputationChange: 3,
          fundsChange: 80,
          energyChange: -12,
          hypeChange: 8,
          personalityChanges: { charisma: Math.min(100, ctx.player.personality.charisma + 2) }
        })
      },
      {
        id: 'c_sell_merch_local',
        text: 'Llevar stickers y remeras caseras hechas a mano',
        consequencesDescription: '+$140 Fondos, +Fidelidad de los primeros seguidores, +1 Atractivo Comercial',
        apply: () => ({
          narrativeText: 'Vendiste todos los stickers y remeras. La gente se fue llevando tu logo en sus fundas de celular.',
          fundsChange: 140,
          fansChange: 80,
          personalityChanges: { commercialAppeal: Math.min(100, ctx.player.personality.commercialAppeal + 1) },
          statChanges: { fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 5) }
        })
      }
    ]
  },

  {
    id: 'evt_first_demo_upload',
    title: 'Lanzar la Primera Demo Autogestionada',
    category: 'media',
    rarity: 'common',
    maxCareerStage: 'Underground',
    cooldownMonths: 18,
    weight: 18,
    condition: (ctx) => ctx.player.stats.totalStreams <= 10000,
    getDescription: (ctx) => `Tu primera canción está terminada. Es hora de decidir cómo presentarla al mundo.`,
    choices: (ctx) => [
      {
        id: 'c_diy_distro',
        text: 'Subirla a todas las plataformas y compartirla en grupos y foros',
        consequencesDescription: '+350 Primeros oyentes reales, +10 Hype inicial, +1,500 Streams, +1 Ambición',
        apply: () => ({
          narrativeText: 'Tu canción empezó a sonar en parlantes de amigos y playlists curadas por la comunidad.',
          fansChange: 250,
          popularityChange: 3,
          hypeChange: 10,
          streamsChange: 1500,
          personalityChanges: { ambition: Math.min(100, ctx.player.personality.ambition + 1) }
        })
      },
      {
        id: 'c_music_video_lowbudget',
        text: 'Filmar un video casero con celular y estética VHS en las calles',
        costFunds: 80,
        consequencesDescription: '-$80 Fondos, +Identidad estética, +18 Hype, +450 Fans, +2 Creatividad, +3,800 Streams',
        apply: () => ({
          narrativeText: 'El video capturó la vibra callejera y auténtica de tu barrio. Varios canales de música independiente lo repostearon.',
          fundsChange: -80,
          fansChange: 450,
          hypeChange: 18,
          popularityChange: 4,
          streamsChange: 3800,
          personalityChanges: {
            creativity: Math.min(100, ctx.player.personality.creativity + 2),
            originality: Math.min(100, ctx.player.personality.originality + 1)
          },
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 4) }
        })
      }
    ]
  },
  // --- UNDERGROUND / EMERGING STAGE EVENTS ---
  {
    id: 'evt_first_underground_cypher',
    title: 'El Cypher Callejero y la Primera Chispa',
    category: 'career',
    rarity: 'common',
    maxCareerStage: 'Emerging',
    cooldownMonths: 24,
    weight: 15,
    condition: (ctx) => ctx.player.stats.popularity < 40,
    getDescription: (ctx) => `Una plaza histórica de ${ctx.player.city} reúne a los mejores letristas y productores independientes de la ciudad. El parlante suena y te ceden el micrófono.`,
    choices: (ctx) => [
      {
        id: 'c_freestyle_brutal',
        text: 'Tirar barras complejas y demostrar técnica pura',
        consequencesDescription: '+Reputación lírica, +Credibilidad artística, +2 Skill, +1 Originalidad, -10 Energía',
        apply: () => ({
          narrativeText: 'Tus rimas dejaron callada a la plaza. Los videos grabados con celulares comenzaron a compartirse en redes barriales.',
          reputationChange: 6,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 5) },
          personalityChanges: {
            skill: Math.min(100, ctx.player.personality.skill + 2),
            originality: Math.min(100, ctx.player.personality.originality + 1)
          },
          fansChange: 800,
          energyChange: -10,
          hypeChange: 8
        })
      },
      {
        id: 'c_catchy_hook',
        text: 'Cantar un estribillo melódico y conectar con el público',
        consequencesDescription: '+Popularidad, +Oyentes potenciales, +2 Carisma, +1 Atractivo Comercial',
        apply: () => ({
          narrativeText: 'Toda la plaza terminó coreando el estribillo. Un productor local te pidió tu contacto al terminar la ronda.',
          popularityChange: 4,
          fansChange: 1500,
          hypeChange: 12,
          energyChange: -8,
          personalityChanges: {
            charisma: Math.min(100, ctx.player.personality.charisma + 2),
            commercialAppeal: Math.min(100, ctx.player.personality.commercialAppeal + 1)
          }
        })
      },
      {
        id: 'c_network_producers',
        text: 'Quedarte escuchando y hacer contactos con beatmakers',
        consequencesDescription: '+Conexiones de producción, +2 Sociabilidad, +Oportunidades de estudio',
        apply: () => ({
          narrativeText: 'Conociste a beatmakers underground que tienen grabadoras y pistas listas para experimentar.',
          statChanges: { energy: Math.min(100, ctx.player.stats.energy + 5) },
          personalityChanges: { sociability: Math.min(100, ctx.player.personality.sociability + 2) },
          fundsChange: 100
        })
      }
    ]
  },

  {
    id: 'evt_viral_clip_tiktok',
    title: 'Un Estribillo se Vuelve Viral en Redes',
    category: 'media',
    rarity: 'uncommon',
    cooldownMonths: 36,
    weight: 12,
    condition: (ctx) => ctx.player.stats.hype < 85,
    getDescription: (ctx) => `Un creador de contenido utilizó un fragmento de 15 segundos de una de tus canciones para un trend que acumuló millones de reproducciones.`,
    choices: (ctx) => [
      {
        id: 'c_ride_wave',
        text: 'Aprovechar la ola: subir contenido diario y publicar versión acelerada / live',
        consequencesDescription: '+25 Hype, +12,000 Fans, +65,000 Streams inmediatos, +Oyentes Mensuales en Auge, -Riesgo de saturación',
        apply: () => ({
          narrativeText: 'El algoritmo explotó. Miles de nuevos oyentes entraron a tu perfil de streaming buscando el tema completo.',
          popularityChange: 8,
          hypeChange: 25,
          fansChange: 12000,
          streamsChange: 65000,
          newsGenerated: {
            headline: `${ctx.player.name} se viraliza con un fenómeno sonoro en redes`,
            body: `El estribillo de ${ctx.player.name} conquista los feeds y dispara sus oyentes mensuales.`,
            sentiment: 'positive',
            category: 'culture'
          }
        })
      },
      {
        id: 'c_keep_mystique',
        text: 'Mantener el misterio y no sobreexponerse',
        consequencesDescription: '+4 Credibilidad artística, +6 Fidelidad de fanbase núcleo, +4,000 Fans, +15,000 Streams orgánicos sostenidos',
        apply: () => ({
          narrativeText: 'El público más melómano respetó tu postura de no convertirte en un meme fugaz. La conversación se centró en la calidad musical.',
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 4), fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 6) },
          hypeChange: 10,
          fansChange: 4000,
          streamsChange: 15000
        })
      }
    ]
  },

  // --- INDUSTRY & RECORD LABEL TRANSFER MARKET (POP-UP EVENTS) ---
  {
    id: 'evt_major_label_bidding_war',
    title: '¡Guerra de Fichajes! Majors e Indies Disputan tu Firma',
    category: 'industry',
    rarity: 'rare',
    cooldownMonths: 24,
    weight: 20,
    condition: (ctx) => ctx.player.stats.monthlyListeners >= 100000 && !ctx.player.labelId,
    getDescription: (ctx) => {
      const listeners = ctx.player.stats.monthlyListeners.toLocaleString();
      return `Tras superar la barrera consagratoria de los ${listeners} oyentes mensuales, se desató una auténtica guerra de ofertas en los despachos de la industria. Directivos de Majors multinacionales y sellos independientes líderes te citan con contratos millonarios sobre la mesa para disputarse tu fichaje.`;
    },
    choices: (ctx) => {
      const sonyLabel = ctx.world.labels['label_sony_columbia'] || ctx.world.labels['label_universal_interscope'];
      const dalePlayLabel = ctx.world.labels['label_dale_play'] || ctx.world.labels['label_rimas_music'];

      const majorContract = sonyLabel
        ? IndustryEngine.generateDynamicLabelOffer(ctx.player, sonyLabel, ctx.currentYear, ctx.world, true)
        : {
            labelId: 'label_sony_columbia',
            signingBonus: 500000,
            royaltyPercentage: 22,
            albumsRequired: 3,
            albumsDelivered: 0,
            creativeControl: 45,
            marketingPower: 96,
            marketingBudgetPerRelease: 120000,
            breakoutClause: 1500000,
            durationYears: 4,
            signedYear: ctx.currentYear,
            isDistributor: false
          };

      const indieContract = dalePlayLabel
        ? IndustryEngine.generateDynamicLabelOffer(ctx.player, dalePlayLabel, ctx.currentYear, ctx.world, true)
        : {
            labelId: 'label_dale_play',
            signingBonus: 200000,
            royaltyPercentage: 65,
            albumsRequired: 2,
            albumsDelivered: 0,
            creativeControl: 82,
            marketingPower: 88,
            marketingBudgetPerRelease: 60000,
            breakoutClause: 500000,
            durationYears: 3,
            signedYear: ctx.currentYear,
            isDistributor: false
          };

      return [
        {
          id: 'c_sign_major_war',
          text: `Firmar con la Major (${sonyLabel?.name || 'Sony Music'}): ${formatMoney(majorContract.signingBonus)} de adelanto, ${majorContract.royaltyPercentage}% regalías, ${majorContract.albumsRequired} álbum(es)`,
          consequencesDescription: `+${formatMoney(majorContract.signingBonus)} Adelanto inmediato, ${majorContract.royaltyPercentage}% Regalías, ${majorContract.marketingPower}% Marketing Masivo, ${majorContract.creativeControl}% Control Creativo`,
          apply: () => ({
            narrativeText: `Firmaste el contrato con la Major Multinacional. El adelanto millonario de ${formatMoney(majorContract.signingBonus)} ingresa a tus cuentas y la maquinaria promocional global se activa de inmediato.`,
            fundsChange: majorContract.signingBonus,
            popularityChange: 12,
            reputationChange: -2,
            hypeChange: 25,
            newContract: majorContract,
            newsGenerated: {
              headline: `¡Fichaje Millonario! ${ctx.player.name} firma contrato estelar con ${sonyLabel?.name || 'Sony Music'}`,
              body: `El acuerdo sacude el mercado discográfico con un adelanto de ${formatMoney(majorContract.signingBonus)} y una campaña de distribución global.`,
              sentiment: 'positive',
              category: 'industry'
            }
          })
        },
        {
          id: 'c_sign_indie_war',
          text: `Firmar con Sello Independiente Líder (${dalePlayLabel?.name || 'Dale Play'}): ${formatMoney(indieContract.signingBonus)} de adelanto, ${indieContract.royaltyPercentage}% regalías, ${indieContract.albumsRequired} álbum(es)`,
          consequencesDescription: `+${formatMoney(indieContract.signingBonus)} Adelanto, ${indieContract.royaltyPercentage}% Regalías Artista, ${indieContract.marketingPower}% Marketing, ${indieContract.creativeControl}% Control Creativo`,
          apply: () => ({
            narrativeText: `Optaste por el camino independiente de élite. Conservás el ${indieContract.royaltyPercentage}% de tus regalías con un adelanto de ${formatMoney(indieContract.signingBonus)} y respaldo estratégico de primer nivel.`,
            fundsChange: indieContract.signingBonus,
            popularityChange: 8,
            statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 6) },
            hypeChange: 20,
            newContract: indieContract,
            newsGenerated: {
              headline: `${ctx.player.name} sella una alianza estratégica con ${dalePlayLabel?.name || 'Dale Play Records'}`,
              body: `La escena celebra un acuerdo que prioriza la visión artística, un adelanto de ${formatMoney(indieContract.signingBonus)} y alcance internacional.`,
              sentiment: 'positive',
              category: 'industry'
            }
          })
        },
        {
          id: 'c_reject_all_independent',
          text: 'Rechazar todas las ofertas: Permanecer 100% Agente Libre e Independiente',
          consequencesDescription: '+100% Regalías y Másters propios, +8 Credibilidad Artística, +8 Fidelidad de Fans',
          apply: () => ({
            narrativeText: `Rechazaste todos los cheques millonarios sobre la mesa. La noticia de tu rechazo a las Majors corrió por foros y medios, consagrándote como un referente absoluto de integridad.`,
            statChanges: {
              artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 8),
              fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 8)
            },
            reputationChange: 6,
            hypeChange: 15,
            newsGenerated: {
              headline: `${ctx.player.name} rechaza a las Majors y reafirma su independencia absoluta`,
              body: `La decisión marca un hito de autonomía creativa en la industria musical actual.`,
              sentiment: 'neutral',
              category: 'industry'
            }
          })
        }
      ];
    }
  },

  {
    id: 'evt_underground_boutique_offer',
    title: 'Propuesta de Colectivo Underground & Sello Boutique',
    category: 'industry',
    rarity: 'uncommon',
    cooldownMonths: 20,
    weight: 12,
    condition: (ctx) => ctx.player.stats.monthlyListeners >= 20000 && ctx.player.stats.monthlyListeners < 100000 && !ctx.player.labelId && ctx.player.stats.artisticCredibility >= 50,
    getDescription: (ctx) => `El colectivo independiente Underground Syndicate te propone un acuerdo boutique de autor: un adelanto competitivo, alta tasa de regalías y libertad creativa absoluta para tu próximo álbum.`,
    choices: (ctx) => {
      const syndicateLabel = ctx.world.labels['label_underground_syndicate'];
      const boutiqueContract = syndicateLabel
        ? IndustryEngine.generateDynamicLabelOffer(ctx.player, syndicateLabel, ctx.currentYear, ctx.world)
        : {
            labelId: 'label_underground_syndicate',
            signingBonus: 35000,
            royaltyPercentage: 80,
            albumsRequired: 1,
            albumsDelivered: 0,
            creativeControl: 98,
            marketingPower: 55,
            marketingBudgetPerRelease: 18000,
            breakoutClause: 50000,
            durationYears: 2,
            signedYear: ctx.currentYear,
            isDistributor: false
          };

      return [
        {
          id: 'c_accept_boutique',
          text: `Aceptar Alianza Boutique: ${formatMoney(boutiqueContract.signingBonus)} de adelanto, ${boutiqueContract.royaltyPercentage}% regalías, 1 álbum`,
          consequencesDescription: `+${formatMoney(boutiqueContract.signingBonus)} Fondos, ${boutiqueContract.royaltyPercentage}% Regalías, ${boutiqueContract.creativeControl}% Control Creativo, 1 Álbum exigido`,
          apply: () => ({
            narrativeText: `Firmaste con el colectivo underground. Tenés ${formatMoney(boutiqueContract.signingBonus)} de presupuesto fresco para tus grabaciones sin resignar ni un ápice de tu identidad artística.`,
            fundsChange: boutiqueContract.signingBonus,
            statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 4) },
            newContract: boutiqueContract,
            newsGenerated: {
              headline: `${ctx.player.name} se une al colectivo Underground Syndicate`,
              body: `Una alianza boutique que apuesta por el sonido de autor con un adelanto de ${formatMoney(boutiqueContract.signingBonus)}.`,
              sentiment: 'positive',
              category: 'industry'
            }
          })
        },
        {
          id: 'c_reject_boutique',
          text: 'Continuar 100% autogestionado en el underground',
          consequencesDescription: '+5 Fidelidad de Fans, +3 Credibilidad',
          apply: () => ({
            narrativeText: 'Decidiste seguir costeando tus propios proyectos para no rendir cuentas a ningún colectivo.',
            statChanges: {
              fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 5),
              artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 3)
            }
          })
        }
      ];
    }
  },

  // ============================================================================
  // 2. EL PRIMER HIT SORPRESA Y PRESIÓN DE CARRERA (Breakout) -> evt_first_surprise_hit
  // ============================================================================
  {
    id: 'evt_first_surprise_hit',
    title: 'El Primer Hit Sorpresa: La Presión del "Segundo Acto"',
    category: 'career',
    rarity: 'rare',
    importanceLevel: 5,
    affectedSystems: ['hype', 'fans', 'energy', 'charts', 'reputation', 'career'],
    minCareerStage: 'Emerging',
    maxCareerStage: 'Established',
    cooldownMonths: 36,
    weight: 18,
    condition: (ctx) => ctx.player.stats.totalStreams >= 50000 || ctx.player.stats.popularity >= 35,
    getDescription: (ctx) =>
      `Uno de tus últimos cortes acaba de superar todas las expectativas en plataformas de streaming. Suena en autos, historias y boliches de todo el país. Los números se disparan, pero la industria y las redes ya te exigen una respuesta inmediata: ¿Fue un golpe de suerte o el inicio de un reinado?`,
    choices: (ctx) => [
      {
        id: 'c_hit_exploit_formula',
        text: 'Replicar la fórmula de inmediato con un single comercial idéntico en estructura',
        consequencesDescription: '+30 Hype masivo, +16,000 Fans, +$12,000 Fondos, -6 Credibilidad artística, -12 Energía',
        apply: () => ({
          narrativeText:
            'Entraste al estudio y calcarte el beat y los ganchos del hit. El tema funcionó en los números y consolidó tu presencia en las playlists de radio, aunque los críticos señalaron que no arriesgaste nada.',
          hypeChange: 30,
          popularityChange: 8,
          fansChange: 16000,
          fundsChange: 12000,
          energyChange: -12,
          statChanges: { artisticCredibility: Math.max(0, ctx.player.stats.artisticCredibility - 6) },
          chartImpact: { boostRecentSong: true },
          timelineEntry: {
            text: `Consolidó su primer fenómeno comercial encadenando dos hits radiales consecutivos en ${ctx.currentYear}.`,
            category: 'release'
          },
          newsGenerated: {
            headline: `${ctx.player.name} repite la fórmula y encadena un nuevo éxito en streaming`,
            body: `El nuevo sencillo confirma la racha bailable de ${ctx.player.name} en los rankings de moda.`,
            sentiment: 'positive',
            category: 'chart'
          }
        })
      },
      {
        id: 'c_hit_subvert_expectations',
        text: 'Desafiar las expectativas: Lanzar un single conceptual y reflexivo de alta calidad lírica',
        consequencesDescription: '+12 Credibilidad artística, +10 Originalidad, +18 Hype de calidad, +8,000 Fans fieles',
        apply: () => ({
          narrativeText:
            'En lugar de repetir el gancho fácil, publicaste una pieza profunda con instrumentación orgánica y barras autobiográficas. Desconcertaste al público casual, pero te ganaste el respeto definitivo de la crítica musical.',
          hypeChange: 18,
          popularityChange: 5,
          fansChange: 8000,
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 12),
            fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 8)
          },
          personalityChanges: { originality: Math.min(100, ctx.player.personality.originality + 10) },
          timelineEntry: {
            text: `Publicó una obra conceptual desafiando las expectativas comerciales tras su primer gran éxito en ${ctx.currentYear}.`,
            category: 'music'
          }
        })
      },
      {
        id: 'c_hit_freeze_for_debut_album',
        text: 'Frenar la inmediatez y encerrarse 4 meses a estructurar un Álbum Debut de culto',
        consequencesDescription: '+10 Disciplina, +10 Fidelidad de fans núcleo, -15 Energía, Prepara lanzamiento mayor',
        apply: () => ({
          narrativeText:
            'Apagaste las redes sociales y rechazaste shows apresurados para componer un cuerpo de obra integral. Tu fanaticada espera con devoción lo que promete ser un disco histórico.',
          energyChange: -15,
          personalityChanges: { discipline: Math.min(100, ctx.player.personality.discipline + 10) },
          statChanges: { fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 10) },
          timelineEntry: {
            text: `Se recluyó en el estudio para componer su álbum debut consagratorio durante el año ${ctx.currentYear}.`,
            category: 'career'
          }
        })
      }
    ]
  },

  // ============================================================================
  // 3. RECHAZO DE UNA DISCOGRÁFICA MAYOR (Underground / Breakout) -> evt_major_label_rejection
  // ============================================================================
  {
    id: 'evt_major_label_rejection',
    title: 'El Portazo de la Major: "Tu Sonido No es Comercial"',
    category: 'industry',
    rarity: 'uncommon',
    importanceLevel: 3,
    affectedSystems: ['reputation', 'hype', 'credibility', 'career'],
    maxCareerStage: 'Breakout',
    cooldownMonths: 24,
    weight: 16,
    condition: (ctx) => ctx.player.stats.popularity < 60 && !ctx.player.labelId,
    getDescription: (ctx) =>
      `Tras semanas de reuniones y audiciones en las oficinas centrales de una multinacional discográfica, el director de A&R cancela el precontrato alegando que tus letras "son demasiado oscuras y complejas para los algoritmos masivos". Te aconsejan suavizar tu estilo o conformarte con la escena local.`,
    choices: (ctx) => [
      {
        id: 'c_rejection_rage_anthem',
        text: 'Canalizar el rechazo en un tema incendiario de despecho corporativo',
        consequencesDescription: '+24 Hype de rebeldía, +8 Credibilidad lírica, +6,000 Fans, -10 Energía',
        apply: () => ({
          narrativeText:
            'Transformaste la frustración en rimas venenosas contra la burocracia de los sellos. La canción se convirtió en un himno de identidad para los jóvenes que rechazan la música plástica.',
          hypeChange: 24,
          energyChange: -10,
          fansChange: 6000,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 8) },
          newsGenerated: {
            headline: `${ctx.player.name} dispara contra la industria en un tema contundente`,
            body: `El nuevo lanzamiento expone las tensiones entre la autenticidad artística y las exigencias de las multinacionales.`,
            sentiment: 'shocking',
            category: 'culture'
          },
          timelineEntry: {
            text: `Publicó un himno contestatario tras ser rechazado por ejecutivos discográficos en ${ctx.currentYear}.`,
            category: 'release'
          }
        })
      },
      {
        id: 'c_rejection_commercial_pivot',
        text: 'Aceptar el consejo: Invertir $2,000 en asesoría comercial y afilar melodías radiales',
        costFunds: 2000,
        consequencesDescription: '-$2,000 Fondos, +8 CommercialAppeal, -4 Originalidad, Mejora acceso a radios',
        apply: () => ({
          narrativeText:
            'Contrataste productores especializados en estribillos pop. Tus maquetas ahora suenan más digeribles para el gran público, resignando parte de tu aspereza inicial.',
          fundsChange: -2000,
          personalityChanges: {
            commercialAppeal: Math.min(100, ctx.player.personality.commercialAppeal + 8),
            originality: Math.max(0, ctx.player.personality.originality - 4)
          },
          popularityChange: 4
        })
      },
      {
        id: 'c_rejection_manifesto_post',
        text: 'Publicar un descargo honesto en video contando la experiencia sin filtros',
        consequencesDescription: '+16 Hype orgánico, +10 Fidelidad de fans núcleo, +4 Carisma',
        apply: () => ({
          narrativeText:
            'Hablaste directo a la cámara con el corazón en la mano. La comunidad aplaudió tu transparencia y miles de personas comenzaron a seguir tu proceso independiente.',
          hypeChange: 16,
          statChanges: { fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 10) },
          personalityChanges: { charisma: Math.min(100, ctx.player.personality.charisma + 4) }
        })
      }
    ]
  },

  // ============================================================================
  // 4. DEMANDA POR SAMPLE Y CONFLICTO DE PRODUCCIÓN -> evt_producer_sample_lawsuit
  // ============================================================================
  {
    id: 'evt_producer_sample_lawsuit',
    title: 'Intimación Judicial: Demanda Millonaria por Sample No Aclarado',
    category: 'crisis',
    rarity: 'crisis',
    importanceLevel: 4,
    affectedSystems: ['funds', 'reputation', 'credibility', 'charts', 'career'],
    narrativeChainId: 'chain_sample_lawsuit',
    minCareerStage: 'Emerging',
    cooldownMonths: 36,
    weight: 15,
    condition: (ctx) => ctx.player.stats.totalStreams >= 100000,
    getDescription: (ctx) =>
      `Un bufete de abogados internacionales que representa a un veterano productor de los años 80 te envía una intimación formal: afirman que la línea melódica de uno de tus mayores éxitos contiene un sample no declarado y exigen $20,000 en concepto de daños o el bloqueo inmediato del track en Spotify y YouTube.`,
    choices: (ctx) => [
      {
        id: 'c_lawsuit_settle_quiet',
        text: 'Pagar un acuerdo extrajudicial confidencial ($18,000) y ceder 25% de regalías del track',
        costFunds: 18000,
        consequencesDescription: '-$18,000 Fondos, Mantiene el tema en plataformas sin escándalo mediático',
        apply: () => ({
          narrativeText:
            'Tus representantes cerraron un acuerdo privado. Desembolsaste $18,000 pero salvaste la canción en los charts sin que el conflicto trascendiera a la prensa.',
          fundsChange: -18000,
          reputationChange: 2,
          timelineEntry: {
            text: `Resolvió extrajudicialmente una disputa de derechos de autor en el año ${ctx.currentYear}.`,
            category: 'industry'
          }
        })
      },
      {
        id: 'c_lawsuit_fight_in_court',
        text: 'Contratar abogados defensores ($8,000 iniciales) e ir a juicio por uso legítimo / interpolación',
        costFunds: 8000,
        consequencesDescription: '-$8,000 Fondos, +25 Hype de polémica, Desata juicio histórico con resolución en 6 meses',
        apply: () => ({
          narrativeText:
            'Decidiste dar la batalla judicial. Alegaste que se trata de un homenaje cultural y uso legítimo. El caso despierta un debate ardiente en foros y medios especializados.',
          fundsChange: -8000,
          hypeChange: 25,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 6) },
          chainNextEventId: 'evt_chain_lawsuit_resolution',
          chainDelayMonths: 6,
          chainPayload: { stance: 'fight' },
          newsGenerated: {
            headline: `Batalla legal: ${ctx.player.name} irá a juicio por los derechos de su música`,
            body: `El litigio sobre derechos de sampling promete marcar un precedente histórico para los productores de la nueva generación.`,
            sentiment: 'shocking',
            category: 'scandal'
          },
          timelineEntry: {
            text: `Inició un juicio histórico en tribunales para defender los derechos del sampling en ${ctx.currentYear}.`,
            category: 'industry'
          }
        })
      },
      {
        id: 'c_lawsuit_pull_and_rework',
        text: 'Retirar voluntariamente el tema y publicar una versión regrabada desde cero ($0)',
        consequencesDescription: '+8 Credibilidad artística, -10 Hype temporal, Cero costos judiciales',
        apply: () => ({
          narrativeText:
            'Retiraste el track original de las plataformas y en 72 horas grabaste una versión totalmente rehecha con instrumentación propia. La audiencia aplaudió tu velocidad y honestidad creativa.',
          hypeChange: -10,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 8) },
          reputationChange: 4,
          timelineEntry: {
            text: `Regrabó y relanzó una versión propia de su música tras un diferendo de autoría en ${ctx.currentYear}.`,
            category: 'music'
          }
        })
      }
    ]
  },

  // ============================================================================
  // 5. RESOLUCIÓN DE LA DEMANDA DE SAMPLE (Cadena 1 - Resolución)
  // ============================================================================
  {
    id: 'evt_chain_lawsuit_resolution',
    title: 'Veredicto Judicial: El Fallo Final sobre tus Derechos Musicales',
    category: 'industry',
    rarity: 'rare',
    importanceLevel: 4,
    affectedSystems: ['funds', 'reputation', 'credibility', 'career'],
    narrativeChainId: 'chain_sample_lawsuit',
    cooldownMonths: 48,
    weight: 0,
    condition: () => true,
    getDescription: (ctx) =>
      `Tras 6 meses de tensas audiencias en los tribunales, el tribunal emite su sentencia definitiva respecto a la demanda de derechos de autor que paralizó a la escena. Las cámaras de televisión y la prensa esperan tu salida en las escalinatas del juzgado.`,
    choices: (ctx) => [
      {
        id: 'c_chain_lawsuit_celebrate_victory',
        text: 'Victoria Judicial Histórica: El juez falla a tu favor y condena a la contraparte a pagar costas (+$30,000)',
        consequencesDescription: '+$30,000 Fondos ganados, +14 Credibilidad legendaria, +10 Reputación, +25 Hype',
        apply: () => ({
          narrativeText:
            '¡Victoria absoluta! La sentencia reconoció el valor de la transformación creativa y ordenó el pago de $30,000 por daños y perjuicios. Saliste del tribunal en andas con la comunidad celebrando un hito legal.',
          fundsChange: 30000,
          hypeChange: 25,
          reputationChange: 10,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 14) },
          newsGenerated: {
            headline: `¡Triunfo histórico! La justicia falla a favor de ${ctx.player.name}`,
            body: `El tribunal consagra el derecho a la transformación creativa y sienta jurisprudencia en la industria musical.`,
            sentiment: 'positive',
            category: 'industry'
          },
          timelineEntry: {
            text: `Ganó un juicio histórico de derechos de autor con indemnización a su favor en ${ctx.currentYear}.`,
            category: 'career'
          }
        })
      },
      {
        id: 'c_chain_lawsuit_agree_amicable',
        text: 'Firmar un acuerdo de reconciliación creativa y anunciar un remix conjunto de homenaje',
        consequencesDescription: '+12 Credibilidad artística, +15 Afinidad con leyendas de la escena, +18 Hype',
        apply: () => ({
          narrativeText:
            'Sellaste la paz estrechando la mano del autor histórico. Lo que empezó como un conflicto legal terminó en un remix conmemorativo que unió a dos generaciones.',
          hypeChange: 18,
          reputationChange: 8,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 12) },
          newsGenerated: {
            headline: `De tribunales al estudio: ${ctx.player.name} sella la paz con un histórico remix`,
            body: `El conflicto legal culmina en una alianza intergeneracional elogiada por toda la crítica musical.`,
            sentiment: 'positive',
            category: 'culture'
          },
          timelineEntry: {
            text: `Transformó una disputa judicial en un histórico remix conjunto intergeneracional en ${ctx.currentYear}.`,
            category: 'music'
          }
        })
      }
    ]
  },

  // ============================================================================
  // 6. RIVALIDAD PÚBLICA Y EMBOSCADA EN REDES -> evt_public_rivalry_clash
  // ============================================================================
  {
    id: 'evt_public_rivalry_clash',
    title: 'Emboscada en Redes y Declaración de Guerra Pública',
    category: 'rivalry',
    rarity: 'uncommon',
    importanceLevel: 4,
    affectedSystems: ['hype', 'reputation', 'relationships', 'credibility', 'career'],
    narrativeChainId: 'chain_rivalry',
    cooldownMonths: 24,
    weight: 18,
    condition: (ctx) => ctx.player.stats.popularity >= 25,
    getDescription: (ctx) => {
      const otherArtists = Object.values(ctx.world.artists).filter((a) => a.id !== ctx.player.id && !a.isRetired);
      const rival = ctx.rivalArtist || otherArtists[0] || { name: 'Dante Zero', id: 'artist_dante' };
      return `Durante una transmisión en vivo con más de 100.000 espectadores, ${rival.name} arremetió contra ti: te acusó de escribir con ghostwriters, de no tener calle y de inflar tus métricas de streaming con bots. Los clips inundan TikTok y la escena espera tu respuesta.`;
    },
    choices: (ctx) => [
      {
        id: 'c_rivalry_drop_diss',
        text: 'Encerrarse 48 horas en el estudio y soltar un Diss Track demoledor con barras quirúrgicas',
        consequencesDescription: '+38 Hype monumental, +6 Credibilidad lírica, -15 Energía, Desata guerra musical',
        apply: () => ({
          narrativeText:
            'Entraste al micrófono con la furia a flor de piel. Grabaste una tiradera implacable de 4 minutos desmontando cada una de sus mentiras. La escena musical se paralizó a escuchar tu respuesta.',
          hypeChange: 38,
          energyChange: -15,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 6) },
          chainNextEventId: 'evt_chain_rivalry_fallout',
          chainDelayMonths: 6,
          chainPayload: { dissDropped: true },
          newsGenerated: {
            headline: `¡Guerra total! ${ctx.player.name} responde con un feroz Diss Track`,
            body: `La tiradera de ${ctx.player.name} sacude las redes sociales y se posiciona en el Top 1 de tendencias mundiales.`,
            sentiment: 'shocking',
            category: 'rivalry'
          },
          timelineEntry: {
            text: `Publicó una tiradera histórica en respuesta a ataques públicos de sus rivales en ${ctx.currentYear}.`,
            category: 'release'
          }
        })
      },
      {
        id: 'c_rivalry_live_challenge',
        text: 'Retarlo públicamente a un cypher cara a cara o batalla de barras en el próximo festival',
        consequencesDescription: '+22 Hype, +8 Carisma en vivo, +6 Reputación callejera, Polariza a los fans',
        apply: () => ({
          narrativeText:
            'Subiste un video desafiándolo a subirse al mismo escenario con un micrófono abierto frente al público real. Tu valentía fue aclamada por los fanáticos del rap tradicional.',
          hypeChange: 22,
          reputationChange: 6,
          personalityChanges: { charisma: Math.min(100, ctx.player.personality.charisma + 8) }
        })
      },
      {
        id: 'c_rivalry_cold_silence',
        text: 'Silencio absoluto: No regalarle reproducciones y responder únicamente con lanzamientos de calidad',
        consequencesDescription: '+8 Disciplina, +8 Credibilidad artística, Cero desgaste ni circo mediático',
        apply: () => ({
          narrativeText:
            'Decidiste no alimentar el circo de la farándula. Continuaste trabajando en tu próximo proyecto y dejaste que tus números y calidad musical demostraran la distancia entre ambos.',
          personalityChanges: { discipline: Math.min(100, ctx.player.personality.discipline + 8) },
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 8) },
          reputationChange: 5
        })
      }
    ]
  },

  // ============================================================================
  // 7. DESENLACE DE LA RIVALIDAD (Cadena 2 - Resolución)
  // ============================================================================
  {
    id: 'evt_chain_rivalry_fallout',
    title: 'El Clímax de la Rivalidad: Veredicto de la Escena',
    category: 'rivalry',
    rarity: 'rare',
    importanceLevel: 4,
    affectedSystems: ['hype', 'reputation', 'relationships', 'career'],
    narrativeChainId: 'chain_rivalry',
    cooldownMonths: 48,
    weight: 0,
    condition: () => true,
    getDescription: (ctx) =>
      `Meses después del intercambio de barras y controversias, la escena musical urbana ha dictado sentencia. En las entregas de premios y festivales masivos, el público y los críticos reconocen quién salió victorioso del choque.`,
    choices: (ctx) => [
      {
        id: 'c_chain_rivalry_victory_lap',
        text: 'Coronación Indiscutida: La crítica y los oyentes te declaran ganador absoluto del choque lírico',
        consequencesDescription: '+16 Reputación, +12 Credibilidad artística, +20 Hype consolidado',
        apply: () => ({
          narrativeText:
            'Tu superioridad técnica y coherencia aplastaron los argumentos de tu rival. La escena completa te reconoce como el letrista más contundente de tu generación.',
          reputationChange: 16,
          hypeChange: 20,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 12) },
          newsGenerated: {
            headline: `${ctx.player.name} se consagra como referente indiscutido de la escena urbana`,
            body: `Analistas y fanáticos destacan la solvencia lírica y madurez demostrada por el artista.`,
            sentiment: 'positive',
            category: 'culture'
          },
          timelineEntry: {
            text: `Fue coronado vencedor indiscutido de una de las mayores rivalidades líricas de la década en ${ctx.currentYear}.`,
            category: 'career'
          }
        })
      },
      {
        id: 'c_chain_rivalry_truce_collab',
        text: 'Sellar la Paz en Vivo: Aparecer juntos por sorpresa en un festival y estrenar colaboración (+Hype masivo)',
        consequencesDescription: '+35 Hype histórico, +18,000 Fans, +35 Afinidad con el rival, Impacto cultural',
        apply: () => ({
          narrativeText:
            'Dejaron las diferencias atrás y subieron juntos al escenario central del festival más grande del país. El abrazo y el estreno del tema conjunto hicieron historia en la música popular.',
          hypeChange: 35,
          fansChange: 18000,
          reputationChange: 10,
          newsGenerated: {
            headline: `¡Histórica reconciliación! Sorpresiva unión sobre el escenario paraliza a la escena`,
            body: `El inesperado junte sella una tregua artística que conmueve a millones de seguidores.`,
            sentiment: 'positive',
            category: 'culture'
          },
          timelineEntry: {
            text: `Selló una histórica reconciliación en vivo transformando un antiguo conflicto en éxito colaborativo en ${ctx.currentYear}.`,
            category: 'relationships'
          }
        })
      }
    ]
  },

  // ============================================================================
  // 8. COLABORACIÓN INESPERADA CON UN ÍCONO -> evt_unexpected_icon_collab
  // ============================================================================
  {
    id: 'evt_unexpected_icon_collab',
    title: 'La Llamada del Maestro: Una Leyenda Quiere Colaborar',
    category: 'relationships',
    rarity: 'rare',
    importanceLevel: 5,
    affectedSystems: ['fans', 'popularity', 'credibility', 'relationships', 'hype'],
    minCareerStage: 'Breakout',
    cooldownMonths: 36,
    weight: 14,
    condition: (ctx) => ctx.player.stats.artisticCredibility >= 50 || ctx.player.stats.popularity >= 45,
    getDescription: (ctx) =>
      `Una de las máximas leyendas consagradas de la música hispanoamericana escucha tu último proyecto en un viaje y te envía un mensaje privado directo: te invita a su finca/estudio durante tres días para componer una pieza a dúo sin intermediarios ni presiones de sellos.`,
    choices: (ctx) => [
      {
        id: 'c_icon_traditional_session',
        text: 'Adaptarte con respeto a su sonido clásico y grabar una obra acústica atemporal',
        consequencesDescription: '+14 Credibilidad legendaria, +10 Reputación, +24,000 Fans, -15 Energía',
        apply: () => ({
          narrativeText:
            'Compartieron largas noches de guitarra y piano. La canción resultante es una joya emotiva que cruzó generaciones enteras y se convirtió en candidata inmediata a Canción del Año.',
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 14),
            reputation: Math.min(100, ctx.player.stats.reputation + 10)
          },
          fansChange: 24000,
          energyChange: -15,
          hypeChange: 25,
          newsGenerated: {
            headline: `Encuentro de titanes: ${ctx.player.name} une fuerzas con leyendas de la música`,
            body: `Una obra conmovedora que une tradición y modernidad cosecha elogios unánimes de la crítica.`,
            sentiment: 'positive',
            category: 'culture'
          },
          timelineEntry: {
            text: `Grabó una colaboración legendaria de culto con maestros de la música popular en ${ctx.currentYear}.`,
            category: 'music'
          }
        })
      },
      {
        id: 'c_icon_futuristic_fusion',
        text: 'Proponer una fusión audaz: Mezclar sus acordes icónicos con tus 808s y vanguardia urbana',
        consequencesDescription: '+12 Originalidad, +35 Hype explosivo, +30,000 Fans, Himno generacional',
        apply: () => ({
          narrativeText:
            'El maestro aceptó experimentar con tus ritmos electrónicos y sintetizadores. Crearon un sonido híbrido nunca antes escuchado que arrasó en las pistas de baile y las radios globales.',
          personalityChanges: { originality: Math.min(100, ctx.player.personality.originality + 12) },
          hypeChange: 35,
          fansChange: 30000,
          popularityChange: 8,
          timelineEntry: {
            text: `Creó un himno de vanguardia fusionando raíces clásicas con electrónica urbana en ${ctx.currentYear}.`,
            category: 'release'
          }
        })
      },
      {
        id: 'c_icon_documentary_single',
        text: 'Financiar un cortometraje documental ($12,000) sobre el proceso de grabación en la finca',
        costFunds: 12000,
        consequencesDescription: '-$12,000 Fondos, +10 Carisma, +45,000 Fans, +20 Reputación audiovisual',
        apply: () => ({
          narrativeText:
            'El mini-documental de 20 minutos con las conversaciones íntimas sobre el oficio musical fue estrenado en festivales de cine y plataformas de streaming con enorme impacto cultural.',
          fundsChange: -12000,
          personalityChanges: { charisma: Math.min(100, ctx.player.personality.charisma + 10) },
          fansChange: 45000,
          reputationChange: 12,
          hypeChange: 30,
          timelineEntry: {
            text: `Estrenó un aclamado documental sobre el proceso creativo con íconos de la industria en ${ctx.currentYear}.`,
            category: 'media'
          }
        })
      }
    ]
  },

  // ============================================================================
  // 9. VIRALIZACIÓN MASIVA EN REDES / DILEMA DE TIKTOK -> evt_viral_social_dilemma
  // ============================================================================
  {
    id: 'evt_viral_social_dilemma',
    title: 'El Algoritmo Desatado: Un Fragmento se Vuelve Fenómeno Viral',
    category: 'media',
    rarity: 'common',
    importanceLevel: 3,
    affectedSystems: ['hype', 'fans', 'credibility', 'energy'],
    minCareerStage: 'Underground',
    maxCareerStage: 'Established',
    cooldownMonths: 24,
    weight: 20,
    condition: (ctx) => ctx.player.stats.hype < 90,
    getDescription: (ctx) =>
      `Un creador de contenido utilizó 10 segundos de una de tus maquetas para un trend humorístico que acumuló 50 millones de vistas en 48 horas. Tu teléfono no para de sonar con alertas y miles de personas entran a tu perfil por primera vez buscando el meme.`,
    choices: (ctx) => [
      {
        id: 'c_viral_hyper_activity',
        text: 'Subirte a la ola total: Bailar el trend, publicar 5 videos al día y lanzar versión "Speed Up"',
        consequencesDescription: '+35 Hype explosivo, +18,000 Fans casuales, -6 Credibilidad purista, -15 Energía',
        apply: () => ({
          narrativeText:
            'Explotaste el algoritmo al máximo. Cosechaste un aluvión de oyentes inmediatos y números récord, aunque algunos foros tradicionales te tildaron de ceder a la cultura del meme fugaz.',
          hypeChange: 35,
          fansChange: 18000,
          energyChange: -15,
          popularityChange: 6,
          statChanges: { artisticCredibility: Math.max(0, ctx.player.stats.artisticCredibility - 6) },
          newsGenerated: {
            headline: `${ctx.player.name} capitaliza la viralidad con un fenómeno en redes`,
            body: `El estribillo del artista se posiciona en millones de videos y multiplica sus oyentes mensuales.`,
            sentiment: 'positive',
            category: 'culture'
          }
        })
      },
      {
        id: 'c_viral_acoustic_live',
        text: 'Responder con altura musical: Subir un video tocando la canción completa en vivo y con banda',
        consequencesDescription: '+10 Credibilidad artística, +20 Hype orgánico, +10,000 Fans de calidad duradera',
        apply: () => ({
          narrativeText:
            'Mostraste que detrás de esos 10 segundos virales había un músico con talento real. El público que llegó por curiosidad se quedó maravillado por tu calidad interpretativa.',
          hypeChange: 20,
          fansChange: 10000,
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 10),
            fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 8)
          }
        })
      },
      {
        id: 'c_viral_keep_distance',
        text: 'No intervenir en redes y mantener el misterio de tu figura artística',
        consequencesDescription: '+8 Fidelidad de fans núcleo, +6 Disciplina, Cero sobreexposición mediática',
        apply: () => ({
          narrativeText:
            'Dejaste que el meme circulara sin rebajarte a participar en tendencias pasajeras. Tu comunidad valoró tu compostura y tu aura de artista inaccesible.',
          personalityChanges: { discipline: Math.min(100, ctx.player.personality.discipline + 6) },
          statChanges: { fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 8) }
        })
      }
    ]
  },

  // ============================================================================
  // 10. CANCELACIÓN DE GIRA POR QUIEBRA DE PROMOTOR -> evt_tour_promoter_bankruptcy
  // ============================================================================
  {
    id: 'evt_tour_promoter_bankruptcy',
    title: 'Quiebra del Promotor: Caos y Fechas Canceladas en la Gira',
    category: 'crisis',
    rarity: 'crisis',
    importanceLevel: 5,
    affectedSystems: ['tours', 'funds', 'reputation', 'fans', 'career'],
    narrativeChainId: 'chain_tour_promoter',
    minCareerStage: 'Established',
    cooldownMonths: 48,
    weight: 12,
    condition: (ctx) => ctx.player.stats.popularity >= 50,
    getDescription: (ctx) =>
      `En medio de tu gira nacional más ambiciosa, la empresa productora encargada de la logística se declara en quiebra fraudulenta y sus directivos desaparecen con la recaudación de la taquilla. Miles de fanáticos tienen tickets comprados y los recintos amenazan con cerrar las puertas.`,
    choices: (ctx) => [
      {
        id: 'c_tour_fund_from_pocket',
        text: 'Pagar de tu bolsillo ($40,000) los costos técnicos y dar todos los conciertos gratis para los fans',
        costFunds: 40000,
        consequencesDescription: '-$40,000 Fondos, +20 Reputación legendaria, +15 Fidelidad de fans, Desata redención',
        apply: () => ({
          narrativeText:
            'Tomaste tus propios ahorros y garantizaste los escenarios, el sonido y la seguridad para que nadie se quedara sin su show. Tu gesto de entrega total dio la vuelta al mundo y consagró tu estatura moral.',
          fundsChange: -40000,
          reputationChange: 20,
          statChanges: { fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 15) },
          chainNextEventId: 'evt_chain_tour_redemption',
          chainDelayMonths: 6,
          chainPayload: { sacrificedFunds: true },
          newsGenerated: {
            headline: `¡Gesto histórico! ${ctx.player.name} financia sus conciertos tras la quiebra del promotor`,
            body: `El artista salvó las fechas con fondos propios para no defraudar a su público, ganándose la ovación unánime del país.`,
            sentiment: 'positive',
            category: 'tour'
          },
          timelineEntry: {
            text: `Financió de su propio bolsillo una gira completa tras la estafa de una productora en ${ctx.currentYear}.`,
            category: 'tour'
          }
        })
      },
      {
        id: 'c_tour_cancel_and_sue',
        text: 'Suspender la gira por fuerza mayor e iniciar querella penal contra los estafadores',
        consequencesDescription: '-8 Reputación temporal, Preserva fondos personales, Litigio judicial prolongado',
        apply: () => ({
          narrativeText:
            'Emitiste un comunicado oficial cancelando las fechas y presentando la denuncia penal. Aunque la gente comprendió que fuiste víctima de una estafa, la desilusión en las ciudades fue inevitable.',
          reputationChange: -8,
          hypeChange: -12,
          newsGenerated: {
            headline: `Gira cancelada: Escándalo y querellas penales tras quiebra de productora`,
            body: `La cancelación de la gira de ${ctx.player.name} deja miles de damnificados y procesos judiciales abiertos.`,
            sentiment: 'negative',
            category: 'tour'
          }
        })
      },
      {
        id: 'c_tour_intimate_venues',
        text: 'Reorganizar fechas íntimas de emergencia en pequeños teatros acústicos autogestionados',
        consequencesDescription: '+$15,000 Fondos recuperados, +10 Credibilidad artística, -15 Energía',
        apply: () => ({
          narrativeText:
            'Armaste una gira relámpago en salas pequeñas de 300 personas, tocando en formato acústico solo con tu guitarra/micrófono. La intimidad del formato creó una experiencia mística para los afortunados asistentes.',
          fundsChange: 15000,
          energyChange: -15,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 10) }
        })
      }
    ]
  },

  // ============================================================================
  // 11. REDENCIÓN Y TRIUNFO DE GIRA (Cadena 3 - Resolución)
  // ============================================================================
  {
    id: 'evt_chain_tour_redemption',
    title: 'La Gran Redención: La Mayor Promotora Internacional Apuesta por Ti',
    category: 'shows',
    rarity: 'rare',
    importanceLevel: 5,
    affectedSystems: ['tours', 'funds', 'reputation', 'fans', 'career'],
    narrativeChainId: 'chain_tour_promoter',
    cooldownMonths: 48,
    weight: 0,
    condition: () => true,
    getDescription: (ctx) =>
      `La valentía con la que defendiste a tu público tras la estafa del promotor conmovió a los mayores gigantes de la industria del entretenimiento en vivo. Live Nation te ofrece encabezar una gira de estadios con garantía bancaria total y récord de inversión escénica.`,
    choices: (ctx) => [
      {
        id: 'c_chain_tour_stadium_deal',
        text: 'Aceptar la Megagira en Estadios: $250,000 de anticipo garantizado y producción monumental',
        consequencesDescription: '+$250,000 Fondos inmediatos, +30 Hype masivo, +40,000 Fans, Récord histórico',
        apply: () => ({
          narrativeText:
            'Firmaste la gira de tu vida. Los estadios se agotaron en minutos y tu nombre quedó grabado entre las leyendas que convirtieron una tragedia en un triunfo triunfal indiscutido.',
          fundsChange: 250000,
          hypeChange: 30,
          fansChange: 40000,
          popularityChange: 10,
          tourImpact: { regionalBuff: { region: 'Global', bonus: 25 } },
          newsGenerated: {
            headline: `¡Histórico! ${ctx.player.name} agota gira de estadios con récord de ventas`,
            body: `La consagración en vivo de ${ctx.player.name} sella una de las historias de superación más admiradas de la música moderna.`,
            sentiment: 'positive',
            category: 'tour'
          },
          timelineEntry: {
            text: `Protagonizó una histórica gira mundial de estadios con récords de asistencia en ${ctx.currentYear}.`,
            category: 'tour'
          }
        })
      },
      {
        id: 'c_chain_tour_artist_led_circuit',
        text: 'Crear tu propio festival itinerante cooperativo para dar espacio a bandas independientes',
        consequencesDescription: '+$140,000 Fondos, +16 Credibilidad legendaria, +15 Independencia, Legado de escena',
        apply: () => ({
          narrativeText:
            'Fundaste un festival autogestionado que recorre el continente con precios populares y trato justo para todos los artistas. Te convertiste en un héroe de la cultura independiente.',
          fundsChange: 140000,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 16) },
          personalityChanges: { independence: Math.min(100, ctx.player.personality.independence + 15) },
          reputationChange: 14,
          timelineEntry: {
            text: `Fundó un festival itinerante independiente de alcance internacional en ${ctx.currentYear}.`,
            category: 'career'
          }
        })
      }
    ]
  },

  // ============================================================================
  // 12. PROBLEMAS LEGALES POR NOMBRE ARTÍSTICO / REGISTRO -> evt_trademark_legal_crisis
  // ============================================================================
  {
    id: 'evt_trademark_legal_crisis',
    title: 'Disputa de Marca: Intiman la Cesación de tu Nombre Artístico',
    category: 'industry',
    rarity: 'rare',
    importanceLevel: 4,
    affectedSystems: ['reputation', 'funds', 'fans', 'career'],
    minCareerStage: 'Established',
    cooldownMonths: 36,
    weight: 10,
    condition: (ctx) => ctx.player.stats.popularity >= 40,
    getDescription: (ctx) =>
      `Una corporación internacional de marcas comerciales detecta el éxito de tu proyecto y reclama la propiedad previa del registro de "${ctx.player.name}". Exigen que compres la licencia por $30,000 o cambies de seudónimo en todos tus perfiles y portadas.`,
    choices: (ctx) => [
      {
        id: 'c_trademark_buyout',
        text: 'Comprar los derechos comerciales definitivos de tu nombre ($30,000)',
        costFunds: 30000,
        consequencesDescription: '-$30,000 Fondos, Asegura la propiedad intelectual y marca de por vida',
        apply: () => ({
          narrativeText:
            'Desembolsaste el dinero y blindaste tu nombre en 180 países. Tu marca artística y derechos de merchandising quedan protegidos para toda tu carrera.',
          fundsChange: -30000,
          reputationChange: 4,
          timelineEntry: {
            text: `Adquirió y blindó la titularidad internacional de su nombre artístico en ${ctx.currentYear}.`,
            category: 'industry'
          }
        })
      },
      {
        id: 'c_trademark_rebrand_era',
        text: 'Rebranding Conceptual: Modificar tu alter ego e inaugurar una nueva era estética ($0)',
        consequencesDescription: '+12 Originalidad, +26 Hype por relanzamiento, +8 Credibilidad artística',
        apply: () => ({
          narrativeText:
            'Aprovechaste la intimación para dar un golpe de timón conceptual. Relanzaste tu imagen con un alter ego enigmático que entusiasmó a la prensa especializada y a tus fans.',
          personalityChanges: { originality: Math.min(100, ctx.player.personality.originality + 12) },
          hypeChange: 26,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 8) },
          timelineEntry: {
            text: `Inauguró un célebre rebranding estético y nuevo alter ego conceptual en ${ctx.currentYear}.`,
            category: 'career'
          }
        })
      },
      {
        id: 'c_trademark_fan_petition',
        text: 'Denunciar la extorsión corporativa en redes y convocar a una campaña viral comunitaria',
        consequencesDescription: '+14 Fidelidad de fans, +20 Hype combativo, Batalla legal en proceso',
        apply: () => ({
          narrativeText:
            'Tus seguidores inundaron las redes de la corporación con millones de mensajes. La presión popular obligó a los abogados rivales a congelar las demandas.',
          statChanges: { fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 14) },
          hypeChange: 20
        })
      }
    ]
  },

  // ============================================================================
  // 13. CRISIS DE REPUTACIÓN / CANCELACIÓN MEDIÁTICA -> evt_reputation_cancel_crisis
  // ============================================================================
  {
    id: 'evt_reputation_cancel_crisis',
    title: 'Tormenta Mediática: Campaña de Cancelación y Boicot en Redes',
    category: 'crisis',
    rarity: 'crisis',
    importanceLevel: 5,
    affectedSystems: ['reputation', 'hype', 'fans', 'funds', 'contracts'],
    minCareerStage: 'Mainstream',
    cooldownMonths: 36,
    weight: 12,
    condition: (ctx) => ctx.player.stats.popularity >= 65,
    getDescription: (ctx) =>
      `Declaraciones antiguas sacadas de contexto o una acalorada discusión en un reservado VIP son viralizadas por programas de chismes en horario central. Patrocinadores retiran publicidad y se desata una intensa campaña de cancelación con hashtags pidiendo boicotear tus shows.`,
    choices: (ctx) => [
      {
        id: 'c_cancel_apology_charity',
        text: 'Disculpa pública sincera y donación de $25,000 a causas sociales educativas',
        costFunds: 25000,
        consequencesDescription: '-$25,000 Fondos, Desactiva la cancelación, +6 Madurez reflexiva, +4 Reputación',
        apply: () => ({
          narrativeText:
            'Afrontaste la situación con humildad y madurez. La donación y tu discurso de autocrítica desactivaron la polémica, transformando un momento oscuro en un ejemplo de responsabilidad.',
          fundsChange: -25000,
          reputationChange: 4,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 4) },
          newsGenerated: {
            headline: `${ctx.player.name} asume autocrítica y compromete fondos para causas comunitarias`,
            body: `El artista supera la polémica con un mensaje de reconciliación y apoyo a talleres formativos.`,
            sentiment: 'positive',
            category: 'culture'
          },
          timelineEntry: {
            text: `Superó una intensa crisis mediática con autocrítica y aportes comunitarios en ${ctx.currentYear}.`,
            category: 'personal'
          }
        })
      },
      {
        id: 'c_cancel_villain_era',
        text: 'Abrazar la polémica: Lanzar la era "El Villano" con un álbum conceptual oscuro y rebelde',
        consequencesDescription: '+14 Originalidad, +36 Hype masivo, -10 Reputación formal, Polariza al público',
        apply: () => ({
          narrativeText:
            'En lugar de pedir perdón a los medios corporativos, escribiste un disco salvaje abrazando la figura del forajido incomprendido. El álbum rompió récords de reproducciones y dividió a la sociedad.',
          personalityChanges: { originality: Math.min(100, ctx.player.personality.originality + 14) },
          hypeChange: 36,
          reputationChange: -10,
          popularityChange: 8,
          timelineEntry: {
            text: `Respondió a la cancelación con su aclamada y oscura era conceptual "El Villano" en ${ctx.currentYear}.`,
            category: 'release'
          }
        })
      },
      {
        id: 'c_cancel_retreat_studio',
        text: 'Apagar redes y recluirse 6 meses en el campo a componer en silencio absoluto',
        consequencesDescription: '+35 Energía recuperada, +8 Creatividad, -12 Hype temporal, Salud mental intacta',
        apply: () => ({
          narrativeText:
            'Te desconectaste del ruido y la histeria mediática. La tormenta pasó como todas las modas y tú saliste del retiro con las mejores canciones de tu vida.',
          energyChange: 35,
          hypeChange: -12,
          personalityChanges: { creativity: Math.min(100, ctx.player.personality.creativity + 8) }
        })
      }
    ]
  },

  // ============================================================================
  // 14. GIRO RADICAL DE GÉNERO / TRANSICIÓN SONORA -> evt_genre_pivot_dilemma
  // ============================================================================
  {
    id: 'evt_genre_pivot_dilemma',
    title: 'Encrucijada Sonora: La Necesidad de una Mutación Estética Radical',
    category: 'music',
    rarity: 'rare',
    importanceLevel: 5,
    affectedSystems: ['credibility', 'fans', 'charts', 'career'],
    minCareerStage: 'Established',
    cooldownMonths: 48,
    weight: 12,
    condition: (ctx) => ctx.player.stats.popularity >= 55,
    getDescription: (ctx) =>
      `Sientes que tu fórmula habitual ha alcanzado su techo artístico. En el estudio terminaste maquetas para un proyecto completamente vanguardista que rompe con tu sonido clásico, incorporando guitarras crudas, sintetizadores analógicos o arreglos orquestales. Tus productores te advierten que podrías desconcertar a tu base de oyentes.`,
    choices: (ctx) => [
      {
        id: 'c_genre_pivot_full_throttle',
        text: 'Publicar la mutación estética radical como tu nuevo camino oficial sin concesiones',
        consequencesDescription: '+16 Credibilidad artística, +15 Originalidad, +22 Hype, Redefine tu era sonora',
        apply: () => ({
          narrativeText:
            'Diste el salto al vacío. El lanzamiento conmocionó al panorama musical: algunos oyentes conservadores se quejaron, pero la crítica internacional te consagró como un verdadero visionario musical.',
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 16) },
          personalityChanges: { originality: Math.min(100, ctx.player.personality.originality + 15) },
          hypeChange: 22,
          careerImpact: { forceGenreTransition: 'experimental_fusion' },
          newsGenerated: {
            headline: `${ctx.player.name} rompe esquemas con una reinvención estética sin precedentes`,
            body: `El audaz giro sonoro de ${ctx.player.name} redefine los límites de la música contemporánea.`,
            sentiment: 'positive',
            category: 'release'
          },
          timelineEntry: {
            text: `Lideró una histórica reinvención sonora y transición estética vanguardista en ${ctx.currentYear}.`,
            category: 'music'
          }
        })
      },
      {
        id: 'c_genre_pivot_hybrid_fusion',
        text: 'Fusionar la nueva estética con elementos melódicos de tu género de cabecera',
        consequencesDescription: '+8 CommercialAppeal, +8 Credibilidad artística, Transición suave y accesible',
        apply: () => ({
          narrativeText:
            'Encontraste el equilibrio perfecto entre innovación y accesibilidad. Lograste introducir sonoridades complejas en las radios sin perder a tu público masivo.',
          personalityChanges: { commercialAppeal: Math.min(100, ctx.player.personality.commercialAppeal + 8) },
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 8) },
          popularityChange: 5
        })
      },
      {
        id: 'c_genre_pivot_side_project',
        text: 'Lanzar el álbum bajo un seudónimo secreto o proyecto paralelo de culto',
        consequencesDescription: '+12 Originalidad, +10 Fidelidad de melómanos, Marca principal protegida',
        apply: () => ({
          narrativeText:
            'Publicaste el disco bajo un alias enigmático en plataformas independientes. El proyecto se convirtió en una obra de culto venerada por los coleccionistas.',
          personalityChanges: { originality: Math.min(100, ctx.player.personality.originality + 12) },
          statChanges: { fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 10) }
        })
      }
    ]
  },

  // ============================================================================
  // 15. OFERTA MILLONARIA DE UNA MAJOR -> evt_major_bidding_war_deal
  // ============================================================================
  {
    id: 'evt_major_bidding_war_deal',
    title: 'Guerra de Despachos: La Oferta Millonaria de una Major Global',
    category: 'industry',
    rarity: 'rare',
    importanceLevel: 5,
    affectedSystems: ['contracts', 'funds', 'reputation', 'credibility', 'career'],
    minCareerStage: 'Breakout',
    cooldownMonths: 36,
    weight: 15,
    condition: (ctx) => ctx.player.stats.monthlyListeners >= 150000 && !ctx.player.labelId,
    getDescription: (ctx) =>
      `La directiva global de una Major multinacional aterriza en tu ciudad en avión privado. En una suite de lujo ponen sobre la mesa un contrato con un adelanto de $250,000, presupuesto de marketing mundial y 3 álbumes obligatorios con cesión de derechos sobre tus másters.`,
    choices: (ctx) => [
      {
        id: 'c_major_deal_sign_global',
        text: 'Firmar el Megacontrato con la Major ($250,000 adelanto, 22% regalías, 96% marketing global)',
        consequencesDescription: '+$250,000 Fondos, 22% Regalías, 96% Marketing Masivo, 40% Control Creativo, 3 Álbumes',
        apply: () => ({
          narrativeText:
            'Firmaste el megacontrato multimillonario. Tu cuenta bancaria estalló y la maquinaria promocional global se puso a tu servicio en 180 países, aunque ahora debes responder a los directivos del sello.',
          fundsChange: 250000,
          popularityChange: 12,
          hypeChange: 30,
          statChanges: { artisticCredibility: Math.max(0, ctx.player.stats.artisticCredibility - 4) },
          newContract: {
            labelId: 'label_sony_columbia',
            signingBonus: 250000,
            royaltyPercentage: 22,
            albumsRequired: 3,
            albumsDelivered: 0,
            creativeControl: 40,
            marketingPower: 96,
            marketingBudgetPerRelease: 50000,
            breakoutClause: 750000,
            durationYears: 4,
            signedYear: ctx.currentYear
          },
          newsGenerated: {
            headline: `¡Megafichaje del año! ${ctx.player.name} firma acuerdo récord con una Major`,
            body: `El contrato garantiza una distribución planetaria y un despliegue promocional sin precedentes.`,
            sentiment: 'positive',
            category: 'industry'
          },
          timelineEntry: {
            text: `Firmó un acuerdo multimillonario de distribución global con una Major multinacional en ${ctx.currentYear}.`,
            category: 'industry'
          }
        })
      },
      {
        id: 'c_major_deal_sign_indie_power',
        text: 'Optar por Sello Indie de Élite ($90,000 adelanto, 65% regalías, 85% control creativo)',
        consequencesDescription: '+$90,000 Fondos, 65% Regalías, 85% Control Creativo, +6 Credibilidad artística',
        apply: () => ({
          narrativeText:
            'Elegiste la vía intermedia de élite. Conservas el 65% de tus regalías y el control creativo con un respaldo económico de primer nivel.',
          fundsChange: 90000,
          popularityChange: 8,
          hypeChange: 20,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 6) },
          newContract: {
            labelId: 'label_dale_play',
            signingBonus: 90000,
            royaltyPercentage: 65,
            albumsRequired: 2,
            albumsDelivered: 0,
            creativeControl: 85,
            marketingPower: 85,
            marketingBudgetPerRelease: 30000,
            breakoutClause: 200000,
            durationYears: 3,
            signedYear: ctx.currentYear
          },
          timelineEntry: {
            text: `Selló alianza estratégica de élite con sello independiente de primer nivel en ${ctx.currentYear}.`,
            category: 'industry'
          }
        })
      },
      {
        id: 'c_major_deal_reject_freedom',
        text: 'Rechazar todas las ofertas corporativas y fundar tu propia productora independiente',
        consequencesDescription: '+12 Credibilidad artística, +10 Fidelidad de fans, +15 Independencia, 100% Derechos',
        apply: () => ({
          narrativeText:
            'Rechazaste los cheques corporativos y anunciaste la creación de tu propia productora. Tu valentía te consolida como el mayor referente de autonomía de la escena.',
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 12),
            fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 10)
          },
          personalityChanges: { independence: Math.min(100, ctx.player.personality.independence + 15) },
          reputationChange: 8,
          hypeChange: 15,
          timelineEntry: {
            text: `Rechazó contratos millonarios para fundar su propia estructura autogestionada en ${ctx.currentYear}.`,
            category: 'career'
          }
        })
      }
    ]
  },

  // ============================================================================
  // 16. SALIDA CONFLICTIVA DE UN SELLO / RESCISIÓN -> evt_label_exit_battle
  // ============================================================================
  {
    id: 'evt_label_exit_battle',
    title: 'Guerra Contractual: Conflicto Abierto con la Discográfica',
    category: 'crisis',
    rarity: 'crisis',
    importanceLevel: 5,
    affectedSystems: ['contracts', 'funds', 'credibility', 'career'],
    narrativeChainId: 'chain_label_freedom',
    minCareerStage: 'Established',
    cooldownMonths: 48,
    weight: 12,
    condition: (ctx) => Boolean(ctx.player.labelId && ctx.player.activeContract),
    getDescription: (ctx) =>
      `La relación con tu sello discográfico ha llegado a un punto de quiebre absoluto: directivos vetan tus nuevos conceptos musicales, exigen singles genéricos y retrasan el pago de tus liquidaciones. Sientes que tu carrera está secuestrada por cláusulas leoninas.`,
    choices: (ctx) => [
      {
        id: 'c_label_exit_buyout',
        text: 'Pagar la cláusula de rescisión completa ($60,000) y comprar tu libertad inmediata',
        costFunds: 60000,
        consequencesDescription: '-$60,000 Fondos, Rescinde contrato al instante, Recupera 100% de los másters',
        apply: () => ({
          narrativeText:
            'Pagaste la cláusula y rompiste las cadenas legales en el acto. Vuelves a ser un artista completamente libre y dueño indiscutido de todo tu catálogo.',
          fundsChange: -60000,
          careerImpact: { breakContract: true },
          reputationChange: 6,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 8) },
          timelineEntry: {
            text: `Compró su rescisión contractual y recuperó la libertad de su catálogo en ${ctx.currentYear}.`,
            category: 'industry'
          }
        })
      },
      {
        id: 'c_label_exit_public_war',
        text: 'Iniciar batalla judicial y campaña pública #FreeMyMusic contra el sello',
        consequencesDescription: '+35 Hype combativo, +10 Credibilidad, Desata juicio por emancipación en 6 meses',
        apply: () => ({
          narrativeText:
            'Expusiste las cláusulas abusivas en redes sociales y contrataste abogados especialistas en derecho del entretenimiento. Toda la comunidad de artistas se alinea detrás de tu causa.',
          hypeChange: 35,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 10) },
          chainNextEventId: 'evt_chain_label_freedom',
          chainDelayMonths: 6,
          chainPayload: { publicBattle: true },
          newsGenerated: {
            headline: `¡Rebelión en la industria! ${ctx.player.name} demanda a su discográfica por contratos abusivos`,
            body: `El artista inicia una histórica batalla legal que pone en jaque las prácticas de los sellos.`,
            sentiment: 'shocking',
            category: 'industry'
          },
          timelineEntry: {
            text: `Inició una histórica demanda judicial contra su discográfica por prácticas abusivas en ${ctx.currentYear}.`,
            category: 'industry'
          }
        })
      },
      {
        id: 'c_label_exit_deliver_throwaway',
        text: 'Grabar y entregar un álbum exprés de descartes para cumplir los requisitos del contrato ($0)',
        consequencesDescription: '-6 Credibilidad temporal, Cumple contrato sin gastar fondos, Queda libre',
        apply: () => ({
          narrativeText:
            'Entregaste las canciones mínimas exigidas en el contrato para extinguir las obligaciones legales sin desembolsar un peso. Eres libre, aunque los temas de relleno decepcionaron a los críticos.',
          careerImpact: { breakContract: true },
          statChanges: { artisticCredibility: Math.max(0, ctx.player.stats.artisticCredibility - 6) },
          timelineEntry: {
            text: `Completó sus obligaciones de entrega y finalizó su contrato discográfico en ${ctx.currentYear}.`,
            category: 'industry'
          }
        })
      }
    ]
  },

  // ============================================================================
  // 17. EMANCIPACIÓN DISCOGRÁFICA (Cadena 4 - Resolución)
  // ============================================================================
  {
    id: 'evt_chain_label_freedom',
    title: 'Emancipación Total: La Justicia Anula el Contrato Abusivo',
    category: 'industry',
    rarity: 'rare',
    importanceLevel: 5,
    affectedSystems: ['contracts', 'funds', 'credibility', 'reputation', 'career'],
    narrativeChainId: 'chain_label_freedom',
    cooldownMonths: 48,
    weight: 0,
    condition: () => true,
    getDescription: (ctx) =>
      `El tribunal de comercio emite una sentencia histórica: declara nulas las cláusulas de exclusividad y te restituye la propiedad íntegra de todos tus másters sin pagar indemnización a la discográfica. Eres libre y el fallo sacude a toda la industria musical.`,
    choices: (ctx) => [
      {
        id: 'c_chain_freedom_celebrate',
        text: 'Anunciar tu Independencia Total y relanzar tu catálogo histórico como dueño absoluto',
        consequencesDescription: '+20 Credibilidad legendaria, +15 Reputación, +30 Hype, 100% Regalías recuperadas',
        apply: () => ({
          narrativeText:
            '¡Libertad absoluta! Con la sentencia en la mano, anunciaste el relanzamiento independiente de tus álbumes. Miles de colegas te felicitan y te consagras como el abanderado de los derechos de autor.',
          careerImpact: { breakContract: true },
          reputationChange: 15,
          hypeChange: 30,
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 20),
            fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 12)
          },
          newsGenerated: {
            headline: `¡Fallo histórico! La justicia declara libre a ${ctx.player.name} y anula su contrato`,
            body: `La sentencia marca un antes y un después en los derechos de propiedad intelectual de los músicos.`,
            sentiment: 'positive',
            category: 'industry'
          },
          timelineEntry: {
            text: `Obtuvo la anulación judicial de su contrato leonino y recuperó la propiedad de todos sus másters en ${ctx.currentYear}.`,
            category: 'career'
          }
        })
      }
    ]
  },

  // ============================================================================
  // 18. COLAPSO FÍSICO / BURNOUT POR SOBRECARGA -> evt_burnout_health_crisis
  // ============================================================================
  {
    id: 'evt_burnout_health_crisis',
    title: 'Alerta de Salud: Colapso Físico y Burnout Extremo',
    category: 'crisis',
    rarity: 'crisis',
    importanceLevel: 4,
    affectedSystems: ['energy', 'funds', 'hype', 'career'],
    cooldownMonths: 24,
    weight: 15,
    condition: (ctx) => ctx.player.stats.energy <= 25,
    getDescription: (ctx) =>
      `El ritmo desenfrenado de grabaciones de madrugada, viajes, conferencias y giras pasa la factura: sufres un desmayo por agotamiento extremo en el backstage o una afonía aguda que te impide cantar. Tu equipo médico te exige frenar de inmediato.`,
    choices: (ctx) => [
      {
        id: 'c_burnout_medical_retreat',
        text: 'Ingreso a clínica de reposo y retiro de salud integral por 3 meses ($6,000)',
        costFunds: 6000,
        consequencesDescription: '-$6,000 Fondos, +60 Energía vital recuperada, +Salud integral, Pausa preventiva',
        apply: () => ({
          narrativeText:
            'Te internaste en un centro especializado en descanso y salud vocal. Recuperaste la vitalidad, tu voz volvió con más potencia que nunca y aprendiste a cuidar tu instrumento biológico.',
          fundsChange: -6000,
          energyChange: 60,
          personalityChanges: { discipline: Math.min(100, ctx.player.personality.discipline + 6) },
          newsGenerated: {
            headline: `${ctx.player.name} prioriza su salud y completa un retiro médico de recuperación`,
            body: `El artista restablece su vitalidad tras un período de descanso supervisado por especialistas.`,
            sentiment: 'positive',
            category: 'culture'
          },
          timelineEntry: {
            text: `Completó un retiro médico de rehabilitación y cuidado de la salud vocal en ${ctx.currentYear}.`,
            category: 'personal'
          }
        })
      },
      {
        id: 'c_burnout_lifestyle_rebalance',
        text: 'Reestructurar tu rutina: Meditación, delegar tareas en tu equipo y fijar límites ($0)',
        consequencesDescription: '+45 Energía, +8 Disciplina, Equilibrio sostenible a largo plazo',
        apply: () => ({
          narrativeText:
            'Pusiste orden en tu vida: contrataste asistentes para delegar la logística y fijaste horarios estrictos de sueño. Tu productividad y energía alcanzaron un estándar profesional sostenible.',
          energyChange: 45,
          personalityChanges: { discipline: Math.min(100, ctx.player.personality.discipline + 8) }
        })
      },
      {
        id: 'c_burnout_quick_injection',
        text: 'Tratamiento de choque con corticoides para no cancelar compromisos inmediatos ($2,000)',
        costFunds: 2000,
        consequencesDescription: '-$2,000 Fondos, +20 Energía momentánea, Desgaste severo a largo plazo',
        apply: () => ({
          narrativeText:
            'Saliste a cumplir la fecha con inyecciones de emergencia. Cumpliste el show, pero tu cuerpo quedó al borde del colapso crónico.',
          fundsChange: -2000,
          energyChange: 20,
          statChanges: { artisticCredibility: Math.max(0, ctx.player.stats.artisticCredibility - 2) }
        })
      }
    ]
  },

  // ============================================================================
  // 19. ESCÁNDALO EN LA GALA ANUAL DE PREMIOS -> evt_awards_gala_speech_scandal
  // ============================================================================
  {
    id: 'evt_awards_gala_speech_scandal',
    title: 'Discurso en Horario Central: El Micrófono Abierto en la Gran Gala',
    category: 'awards',
    rarity: 'rare',
    importanceLevel: 4,
    affectedSystems: ['reputation', 'hype', 'credibility', 'relationships', 'career'],
    minCareerStage: 'Established',
    cooldownMonths: 36,
    weight: 12,
    condition: (ctx) => ctx.player.stats.popularity >= 60,
    getDescription: (ctx) =>
      `Subes al escenario principal de la gala anual de la música tras ganar una de las categorías más prestigiosas. Con 20 millones de televidentes en vivo y las autoridades de la industria sentadas en primera fila, tienes 60 segundos de micrófono abierto.`,
    choices: (ctx) => [
      {
        id: 'c_awards_incendiary_speech',
        text: 'Discurso incendiario: Denunciar la manipulación de las corporaciones y los monopolios discográficos',
        consequencesDescription: '+14 Credibilidad legendaria, +35 Hype, -8 Reputación institucional, Impacto viral',
        apply: () => ({
          narrativeText:
            'Tus palabras estremecieron el auditorio. Los directivos de los sellos quedaron mudos mientras los artistas jóvenes y el público en sus casas te ovacionaban por tu valentía.',
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 14) },
          hypeChange: 35,
          reputationChange: -6,
          newsGenerated: {
            headline: `¡Escándalo en la gala! ${ctx.player.name} sacude la ceremonia con un discurso demoledor`,
            body: `El encendido alegato del artista contra las corporaciones se convierte en el momento más comentado del año.`,
            sentiment: 'shocking',
            category: 'award'
          },
          timelineEntry: {
            text: `Pronunció un célebre discurso contra las corporaciones en la gala anual de premios en ${ctx.currentYear}.`,
            category: 'awards'
          }
        })
      },
      {
        id: 'c_awards_humble_tribute',
        text: 'Dedicar el galardón a tu barrio, tu familia y las nuevas generaciones de artistas',
        consequencesDescription: '+12 Reputación unánime, +8 Carisma, +8 Fidelidad de fans',
        apply: () => ({
          narrativeText:
            'Emocionaste a todo el recinto con un discurso cálido, sincero y cargado de memoria. La prensa unánime elogió tu estatura humana y madurez.',
          reputationChange: 12,
          personalityChanges: { charisma: Math.min(100, ctx.player.personality.charisma + 8) },
          statChanges: { fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 8) }
        })
      },
      {
        id: 'c_awards_share_trophy',
        text: 'Invitar a tu colega nominado al escenario y compartir simbólicamente la estatuilla',
        consequencesDescription: '+25 Afinidad en la escena, +12 Respeto supremo, +15 Hype de elegancia',
        apply: () => ({
          narrativeText:
            'Rompiste el protocolo e invitaste a subir a quien competía contigo en la terna. El abrazo entre ambos selló uno de los momentos más nobles y aplaudidos de la historia de los premios.',
          reputationChange: 10,
          hypeChange: 15,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 10) }
        })
      }
    ]
  },

  // ============================================================================
  // 20. CAÍDA DE POPULARIDAD / SEQUÍA DE HITS -> evt_popularity_drought_crossroads
  // ============================================================================
  {
    id: 'evt_popularity_drought_crossroads',
    title: 'La Encrucijada del Algoritmo: Enfriamiento de Números y Crítica',
    category: 'career',
    rarity: 'uncommon',
    importanceLevel: 4,
    affectedSystems: ['hype', 'fans', 'popularity', 'credibility', 'career'],
    minCareerStage: 'Established',
    cooldownMonths: 36,
    weight: 14,
    condition: (ctx) => ctx.player.stats.popularity >= 50 && ctx.player.stats.hype <= 35,
    getDescription: (ctx) =>
      `Tus últimos sencillos no lograron entrar al Top 20 y las estadísticas de streaming muestran una curva descendente. Artículos en blogs y canales de debate especulan sobre "el fin de tu era dorada" y la necesidad de adaptarte a los nuevos sonidos.`,
    choices: (ctx) => [
      {
        id: 'c_drought_masterpiece_lock',
        text: 'Ignorar los números: Encerrarte a componer una obra maestra introspectiva sin mirar los charts',
        consequencesDescription: '+14 Credibilidad artística, +10 Originalidad, +8 Disciplina, Reconecta con la crítica',
        apply: () => ({
          narrativeText:
            'Dejaste de perseguir las modas comerciales y te concentraste en crear música atemporal. El nuevo material conmovió a los melómanos y devolvió a tu proyecto el aura de respeto.',
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 14) },
          personalityChanges: {
            originality: Math.min(100, ctx.player.personality.originality + 10),
            discipline: Math.min(100, ctx.player.personality.discipline + 8)
          },
          reputationChange: 6
        })
      },
      {
        id: 'c_drought_viral_collab',
        text: 'Buscar una colaboración estratégica con el artista más viral del momento',
        consequencesDescription: '+28 Hype comercial, +8 Popularidad masiva, -4 Credibilidad purista',
        apply: () => ({
          narrativeText:
            'Grabaste un corte pegadizo con la nueva revelación juvenil. El tema devolvió tu nombre a los primeros puestos de las playlists de fiesta.',
          hypeChange: 28,
          popularityChange: 8,
          statChanges: { artisticCredibility: Math.max(0, ctx.player.stats.artisticCredibility - 4) }
        })
      },
      {
        id: 'c_drought_theaters_tour',
        text: 'Lanzar una residencia acústica en teatros históricos ("Vuelta a las Raíces")',
        consequencesDescription: '+$45,000 Fondos, +14 Fidelidad de fans núcleo, +10 Credibilidad',
        apply: () => ({
          narrativeText:
            'Agotaste una serie de conciertos íntimos sin pistas grabadas ni sintetizadores. La calidez del público veterano recargó tu confianza artística.',
          fundsChange: 45000,
          statChanges: {
            fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 14),
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 10)
          }
        })
      }
    ]
  },

  // ============================================================================
  // 21. EL GRAN COMEBACK / REGRESO TRIUNFAL -> evt_legendary_career_comeback
  // ============================================================================
  {
    id: 'evt_legendary_career_comeback',
    title: 'El Gran Regreso: El Comeback más Esperado de la Década',
    category: 'career',
    rarity: 'legendary',
    importanceLevel: 5,
    affectedSystems: ['hype', 'popularity', 'reputation', 'credibility', 'charts', 'career'],
    minCareerStage: 'Comeback',
    cooldownMonths: 60,
    weight: 10,
    condition: (ctx) => ctx.currentYear - ctx.player.careerStartYear >= 6,
    getDescription: (ctx) =>
      `Tras un largo período de silencio reflexivo, anuncias oficialmente tu regreso al estudio de grabación. La expectativa en la industria es arrolladora: portadas de revistas, tendencias mundiales y millones de fanáticos aguardan la resurrección de tu leyenda.`,
    choices: (ctx) => [
      {
        id: 'c_comeback_surprise_stadium',
        text: 'Lanzamiento Sorpresa Monumental: Concierto secreto en tu ciudad natal y publicación global de álbum',
        consequencesDescription: '+$180,000 Fondos, +50 Hype histórico, +16 Popularidad, +40,000 Fans',
        apply: () => ({
          narrativeText:
            '¡El regreso del rey! Sin previo aviso, subiste el disco a medianoche y diste un concierto multitudinario e inolvidable. Las plataformas colapsaron por el tráfico de usuarios celebrando tu vuelta a la cima.',
          fundsChange: 180000,
          hypeChange: 50,
          popularityChange: 16,
          fansChange: 40000,
          reputationChange: 14,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 14) },
          newsGenerated: {
            headline: `¡El gran regreso! ${ctx.player.name} paraliza la escena con un lanzamiento histórico`,
            body: `El retorno de ${ctx.player.name} rompe marcas de streaming y reafirma su estatus de leyenda viva.`,
            sentiment: 'positive',
            category: 'release'
          },
          timelineEntry: {
            text: `Protagonizó el regreso musical más aclamado de la década con un lanzamiento sorpresa mundial en ${ctx.currentYear}.`,
            category: 'career'
          }
        })
      },
      {
        id: 'c_comeback_concept_trilogy',
        text: 'Presentar una Trilogía Conceptual que sella tu legado inmortal para la historia',
        consequencesDescription: '+20 Credibilidad legendaria, +16 Reputación, +Prestigio de culto definitivo',
        apply: () => ({
          narrativeText:
            'Publicaste una obra maestra en tres actos que fue comparada con los grandes hitos de la música universal. Tu legado quedó blindado para siempre.',
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 20),
            reputation: Math.min(100, ctx.player.stats.reputation + 16)
          },
          hypeChange: 35,
          timelineEntry: {
            text: `Consagró su legado inmortal con una monumental trilogía conceptual en ${ctx.currentYear}.`,
            category: 'music'
          }
        })
      },
      {
        id: 'c_comeback_stadium_tour',
        text: 'Megagira de Reencuentro en Estadios con orquesta y los mayores colaboradores de tu vida',
        consequencesDescription: '+$500,000 Fondos masivos, +20 Popularidad, -25 Energía, Broche de oro de leyenda',
        apply: () => ({
          narrativeText:
            'Recorriste los estadios del mundo con una orquesta sinfónica e invitados de todas tus etapas. Una gira consagratoria que recaudó cifras récord.',
          fundsChange: 500000,
          popularityChange: 20,
          energyChange: -25,
          fansChange: 50000,
          timelineEntry: {
            text: `Encabezó una histórica gira mundial de reencuentro con orquesta en ${ctx.currentYear}.`,
            category: 'tour'
          }
        })
      }
    ]
  },

  // ============================================================================
  // 22. BLOQUEO CREATIVO DE FIN DE AÑO (Obligatorio cuando el jugador no lanza música)
  // ============================================================================
  {
    id: 'evt_creative_drought_mandatory',
    title: 'Alerta Artística: Sequía Creativa y Silencio Discográfico',
    category: 'crisis',
    rarity: 'crisis',
    importanceLevel: 5,
    affectedSystems: ['funds', 'energy', 'hype', 'fans', 'credibility', 'career'],
    cooldownMonths: 0,
    weight: 100,
    // Note: Condition is false so selectNextEvent never triggers this event randomly.
    // It is triggered strictly and exclusively at year-end via getCreativeDroughtEvent when 0 songs were released.
    condition: () => false,
    getDescription: (ctx) => {
      const droughtYear = ctx.eventYear ?? (ctx.currentMonth === 1 ? ctx.currentYear - 1 : ctx.currentYear);
      const timingDesc = ctx.currentMonth === 12 
        ? `Ha finalizado el año ${droughtYear}` 
        : `${TimeSystem.getTimingPhrase(ctx.currentMonth, droughtYear)}`;
      const hasManager = Boolean(ctx.player.managerId);
      const hasLabel = Boolean(ctx.player.labelId);
      const isUnderground = !hasLabel && !hasManager;

      if (isUnderground) {
        return `${timingDesc} y no publicaste ninguna canción ni proyecto musical. En tu home studio de ${ctx.player.city}, entre maquetas a medio terminar en tu DAW y noches de desmotivación frente al micrófono, sientes el peso del bloqueo creativo. Sin un equipo detrás ni contratos que cumplir, toda la presión de reactivar tu música recae sobre ti.`;
      }
      return `${timingDesc} y no publicaste ninguna canción ni proyecto musical. Los algoritmos de streaming y tu audiencia castigan la inactividad prolongada de tu catálogo. Debes tomar una decisión inmediata para reactivar tu proyecto.`;
    },
    choices: (ctx) => {
      const droughtYear = ctx.eventYear ?? (ctx.currentMonth === 1 ? ctx.currentYear - 1 : ctx.currentYear);
      const isYearEnd = ctx.currentMonth === 12 || ctx.currentMonth === 1;
      const timingWord = TimeSystem.getTimingPhrase(ctx.currentMonth, droughtYear);
      const hasManager = Boolean(ctx.player.managerId);
      const hasLabel = Boolean(ctx.player.labelId);
      const isUnderground = !hasLabel && !hasManager;

      const popLoss = Math.max(1, Math.floor(ctx.player.stats.popularity * 0.25));
      const hypeLoss = Math.max(2, Math.floor(ctx.player.stats.hype * 0.4));
      const fansLoss = Math.max(0, Math.floor(ctx.player.stats.fansCount * 0.08));

      return [
        {
          id: 'c_drought_emergency_single_free',
          text: 'Encerrarte una noche en el home studio y subir una maqueta acústica / cruda sin mezclar ($0)',
          costFunds: 0,
          costEnergy: 20,
          consequencesDescription: 'Coste: $0 Fondos, -20 Energía, +8 Hype, +1 Popularidad. Lanza una maqueta espontánea para frenar la sangría',
          apply: () => {
            const songId = `song_drought_${ctx.player.id}_${droughtYear}_${Math.floor(Math.random() * 1000)}`;
            const emergencySong = {
              id: songId,
              title: isUnderground ? 'Maqueta Nocturna (Acústico Casero)' : 'Sesión Nocturna (Lanzamiento de Emergencia)',
              artistId: ctx.player.id,
              featuredArtistIds: [],
              genreId: ctx.player.mainGenreId,
              subGenreIds: [],
              releaseYear: droughtYear,
              releaseMonth: ctx.currentMonth,
              quality: Math.min(100, Math.floor(ctx.player.personality.skill * 0.65 + ctx.player.personality.creativity * 0.35)),
              commercialAppeal: Math.min(100, Math.floor(ctx.player.personality.commercialAppeal * 0.55 + 10)),
              originality: ctx.player.personality.originality,
              hypeAtRelease: ctx.player.stats.hype + 8,
              streamsTotal: 0,
              streamsLastMonth: 0,
              monthlyStreamsHistory: [],
              peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
              weeksOnChart: { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 },
              longevityCurve: 'slow_burn' as const,
              isSingle: true,
              receptionRating: 3,
              isClassic: false,
              wentViral: false
            };
            ctx.world.songs[songId] = emergencySong;
            ctx.player.lastReleaseYear = droughtYear;
            ctx.player.lastReleaseMonth = ctx.currentMonth;

            return {
              narrativeText: isUnderground
                ? `Te encerraste en tu habitación y grabaste una maqueta sincera y cruda. "${emergencySong.title}" ya está disponible en plataformas y frenó la pérdida de oyentes sin gastar un centavo.`
                : `Te encerraste en el estudio y grabaste una pieza espontánea. "${emergencySong.title}" ya está en plataformas y reactivó el algoritmo.`,
              fundsChange: 0,
              energyChange: -20,
              hypeChange: 8,
              popularityChange: 1,
              newsGenerated: {
                headline: isUnderground
                  ? `${ctx.player.name} rompe el silencio con una grabación íntima casera`
                  : `¡Lanzamiento de último momento! ${ctx.player.name} publica tema inédito`,
                body: `${timingWord}, ${ctx.player.name} comparte música nueva directamente con sus seguidores para reactivar su catálogo.`,
                sentiment: 'positive',
                category: 'release'
              }
            };
          }
        },
        {
          id: 'c_drought_emergency_single_mastered',
          text: 'Pagar una mezcla y master express para rescatar un track de tu DAW ($150)',
          costFunds: 150,
          costEnergy: 15,
          consequencesDescription: '-$150 Fondos, -15 Energía, +14 Hype, +2 Popularidad. Lanza un single con acabado profesional',
          apply: () => {
            const songId = `song_drought_${ctx.player.id}_${droughtYear}_${Math.floor(Math.random() * 1000)}`;
            const emergencySong = {
              id: songId,
              title: isUnderground ? 'Rescate de Medianoche (Mix & Master)' : 'Sesión Nocturna (Single Masterizado)',
              artistId: ctx.player.id,
              featuredArtistIds: [],
              genreId: ctx.player.mainGenreId,
              subGenreIds: [],
              releaseYear: droughtYear,
              releaseMonth: ctx.currentMonth,
              quality: Math.min(100, Math.floor(ctx.player.personality.skill * 0.75 + ctx.player.personality.creativity * 0.25)),
              commercialAppeal: Math.min(100, Math.floor(ctx.player.personality.commercialAppeal * 0.65 + 15)),
              originality: ctx.player.personality.originality,
              hypeAtRelease: ctx.player.stats.hype + 14,
              streamsTotal: 0,
              streamsLastMonth: 0,
              monthlyStreamsHistory: [],
              peakPosition: { Global: null, Argentina: null, USA: null, LatinAmerica: null, Europe: null, Spain: null, Mexico: null },
              weeksOnChart: { Global: 0, Argentina: 0, USA: 0, LatinAmerica: 0, Europe: 0, Spain: 0, Mexico: 0 },
              longevityCurve: 'slow_burn' as const,
              isSingle: true,
              receptionRating: 3,
              isClassic: false,
              wentViral: false
            };
            ctx.world.songs[songId] = emergencySong;
            ctx.player.lastReleaseYear = droughtYear;
            ctx.player.lastReleaseMonth = ctx.currentMonth;

            return {
              narrativeText: `Invertiste $150 en una mezcla y master rápido para pulir un proyecto que tenías guardado. "${emergencySong.title}" salió a tiempo en ${TimeSystem.getMonthName(ctx.currentMonth)} para competir con sonido profesional.`,
              fundsChange: -150,
              energyChange: -15,
              hypeChange: 14,
              popularityChange: 2,
              newsGenerated: {
                headline: `Lanzamiento sorpresa: ${ctx.player.name} publica nuevo sencillo`,
                body: `${timingWord}, ${ctx.player.name} presentó una canción inédita para reactivar su catálogo en plataformas.`,
                sentiment: 'positive',
                category: 'release'
              }
            };
          }
        },
        {
          id: 'c_drought_accept_consequences',
          text: 'Aceptar el bache creativo y asumir el enfriamiento en plataformas ($0)',
          costFunds: 0,
          consequencesDescription: `Coste: $0. -${hypeLoss} Hype, -${popLoss} Popularidad, -${fansLoss} Oyentes fieles`,
          apply: () => {
            return {
              narrativeText: isUnderground
                ? 'Decidiste no forzar canciones sin inspiración. Tus oyentes se enfrían con el paso de los meses, pero mantienes la calma y tu visión artística intacta.'
                : 'Decidiste no forzar lanzamientos comerciales sin convicción. Tu presencia en listas se redujo de forma moderada pero mantienes tu autenticidad artística.',
              hypeChange: -hypeLoss,
              popularityChange: -popLoss,
              fansChange: -fansLoss,
              reputationChange: -1,
              newsGenerated: {
                headline: `${isYearEnd ? 'Año en silencio' : 'Silencio discográfico'}: ${ctx.player.name} ${isYearEnd ? 'concluye el año' : 'continúa la temporada'} sin publicaciones oficiales`,
                body: `${isYearEnd ? `El proyecto de ${ctx.player.name} cierra el calendario sin nuevos temas, tomándose un respiro compositivo.` : `${timingWord}, ${ctx.player.name} prioriza la introspección artística sin lanzamientos oficiales.`}`,
                sentiment: 'neutral',
                category: 'culture'
              }
            };
          }
        },
        {
          id: 'c_drought_announce_sabbatical',
          text: 'Tomar una pausa reflexiva y retiro artístico para descansar y reconstruir tu sonido ($0)',
          costFunds: 0,
          consequencesDescription: `Coste: $0. -${hypeLoss} Hype, -${popLoss} Popularidad, +35 Energía, +6 Creatividad, +5 Originalidad`,
          apply: () => {
            return {
              narrativeText: isUnderground
                ? 'Te desconectaste de la frustración en el home studio para escuchar nueva música, descansar y recargar pilas. La pausa renovó tus ideas.'
                : 'Emitiste un comunicado anunciando una pausa artística para profundizar en tu sonido. Aunque el hype cayó proporcionalmente, tu salud mental y tus ideas artísticas se renovaron.',
              hypeChange: -hypeLoss,
              popularityChange: -popLoss,
              energyChange: 35,
              personalityChanges: {
                creativity: Math.min(100, ctx.player.personality.creativity + 6),
                originality: Math.min(100, ctx.player.personality.originality + 5)
              },
              newsGenerated: {
                headline: `${ctx.player.name} en periodo de introspección artística`,
                body: `El artista prioriza el descanso y la búsqueda de nuevas influencias antes de su próximo proyecto.`,
                sentiment: 'neutral',
                category: 'culture'
              }
            };
          }
        }
      ];
    }
  },

  // --- URBAN DRAMA & MORAL DILEMMAS (EL ÍDOLO STYLE) ---
  {
    id: 'evt_shady_investor_offer',
    title: 'Propuesta de Inversor Turbio y Dinero de la Noche',
    category: 'industry',
    rarity: 'uncommon',
    cooldownMonths: 24,
    weight: 15,
    condition: (ctx) => ctx.player.stats.popularity >= 25,
    getDescription: (ctx) =>
      `Un conocido empresario de la noche y boliches del conurbano se te acerca en un reservado VIP. Te ofrece $50,000 en efectivo inmediato para costear tus próximas grabaciones, a cambio del 40% de tus ingresos por shows en vivo y asistencia obligatoria a sus eventos privados.`,
    choices: (ctx) => [
      {
        id: 'c_accept_shady_cash',
        text: 'Aceptar el dinero en efectivo y acelerar tus presupuestos',
        consequencesDescription: '+$50,000 Fondos inmediatos, +15 Hype, -8 Credibilidad artística, -8 Reputación',
        apply: () => ({
          narrativeText:
            'Tomaste el maletín con el adelanto en efectivo. Las cuentas están llenas, pero en los pasillos de la escena se comenta que tus shows ahora responden a intereses oscuros.',
          fundsChange: 50000,
          hypeChange: 15,
          statChanges: {
            artisticCredibility: Math.max(0, ctx.player.stats.artisticCredibility - 8),
            reputation: Math.max(0, ctx.player.stats.reputation - 8)
          },
          ecosystemNPCChanges: [
            {
              npcId: 'npc_manager_chanta',
              affinityDelta: 30,
              tensionDelta: -20,
              historyEntry: `Aceptó trato de inversión en efectivo durante el año ${ctx.currentYear}.`
            }
          ],
          newsGenerated: {
            headline: `Rumores en la noche: ${ctx.player.name} sella polémico acuerdo con empresarios nocturnos`,
            body: `Se comenta que el artista financia su nueva etapa con capitales del circuito de discotecas privadas.`,
            sentiment: 'shocking',
            category: 'industry'
          }
        })
      },
      {
        id: 'c_reject_shady_cash',
        text: 'Rechazar la propuesta tajantemente y priorizar la procedencia limpia de tus fondos',
        consequencesDescription: '+8 Credibilidad artística, +6 Fidelidad de fans, +4 Reputación',
        apply: () => ({
          narrativeText:
            'Miraste al empresario a los ojos y rechazaste el fajo de billetes. Tu música seguirá construyéndose de manera honesta y sin ataduras turbias.',
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 8),
            fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 6),
            reputation: Math.min(100, ctx.player.stats.reputation + 4)
          },
          ecosystemNPCChanges: [
            {
              npcId: 'npc_manager_chanta',
              tensionDelta: 20,
              historyEntry: `Rechazó la propuesta de financiamiento nocturno en ${ctx.currentYear}.`
            }
          ]
        })
      },
      {
        id: 'c_expose_extortion',
        text: 'Exponer la propuesta turbia en redes sociales y alertar a otros artistas jóvenes',
        consequencesDescription: '+25 Hype de impacto, +10 Credibilidad, Enemistad abierta con la noche',
        apply: () => ({
          narrativeText:
            'Subiste un comunicado denunciando los contratos abusivos en los boliches. Tu valentía fue aplaudida por toda la comunidad independiente.',
          hypeChange: 25,
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 10)
          },
          newsGenerated: {
            headline: `${ctx.player.name} denuncia contratos abusivos en el circuito nocturno`,
            body: `El artista expuso públicamente presiones y ofertas turbias de empresarios de discotecas.`,
            sentiment: 'positive',
            category: 'culture'
          }
        })
      }
    ]
  },

  {
    id: 'evt_clandestine_afterparty',
    title: 'Afterparty Clandestino VIP vs Encierro en el Estudio',
    category: 'personal',
    rarity: 'common',
    cooldownMonths: 14,
    weight: 18,
    condition: (ctx) => ctx.player.stats.popularity >= 20,
    getDescription: (ctx) =>
      `Es viernes a la madrugada y estás a días de entregar los másters de tu próxima música. Te llega un mensaje para sumarte a un afterparty VIP en una mansión privada con streamers, influencers y celebridades de la noche.`,
    choices: (ctx) => [
      {
        id: 'c_go_afterparty_wild',
        text: 'Ir al Afterparty y entregarse a la noche descontrolada',
        consequencesDescription: '+22 Hype, +Contactos de farándula, -25 Energía, -4 Disciplina, Riesgo de resaca',
        apply: () => ({
          narrativeText:
            'Viviste una noche salvaje llena de cámaras, brindis y excesos. Salieron fotos en todas las cuentas de chismes y ganaste notoriedad, pero tu cuerpo quedó destruido.',
          hypeChange: 22,
          energyChange: -25,
          popularityChange: 4,
          personalityChanges: {
            discipline: Math.max(0, ctx.player.personality.discipline - 4),
            sociability: Math.min(100, ctx.player.personality.sociability + 5)
          },
          newsGenerated: {
            headline: `${ctx.player.name} en el ojo de la tormenta tras un descontrolado afterparty`,
            body: `Videos virales muestran al artista festejando hasta el amanecer en una mansión privada.`,
            sentiment: 'shocking',
            category: 'scandal'
          }
        })
      },
      {
        id: 'c_stay_in_studio_grind',
        text: 'Encerrarse toda la noche en el estudio a pulir las frecuencias de mezcla',
        consequencesDescription: '+Calidad sonora en futuros temas, +6 Disciplina, +4 Credibilidad, -10 Energía',
        apply: () => ({
          narrativeText:
            'Apagaste las notificaciones del teléfono y pasaste 10 horas frente a los monitores de estudio ajustando cada canal. El sonido quedó impecable.',
          energyChange: -10,
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 4)
          },
          personalityChanges: {
            discipline: Math.min(100, ctx.player.personality.discipline + 6)
          }
        })
      },
      {
        id: 'c_brief_appearance_balance',
        text: 'Pasar solo 45 minutos para saludar, sacarte fotos y volver a descansar',
        consequencesDescription: '+10 Hype, +Equilibrio mental, -6 Energía',
        apply: () => ({
          narrativeText:
            'Hiciste acto de presencia con elegancia, generaste contenido para tus redes y te retiraste temprano a dormir sin desgastarte.',
          hypeChange: 10,
          energyChange: -6,
          popularityChange: 2
        })
      }
    ]
  },

  {
    id: 'evt_beatmaker_loyalty_dilemma',
    title: 'Lealtad al Beatmaker del Barrio vs Hitmaker Comercial',
    category: 'relationships',
    rarity: 'uncommon',
    cooldownMonths: 24,
    weight: 14,
    condition: (ctx) => ctx.player.stats.popularity >= 30,
    getDescription: (ctx) =>
      `Un productor comercial con múltiples discos de platino te contacta y ofrece producir gratis el corte principal de tu proyecto, con una sola condición: descartar la pista que produjo tu amigo de la infancia del barrio (Nico "808").`,
    choices: (ctx) => [
      {
        id: 'c_loyalty_barrio_beatmaker',
        text: 'Mantener la lealtad con Nico "808" y defender el beat del barrio',
        consequencesDescription: '+12 Credibilidad artística, +10 Fidelidad de fans, +Vínculo inquebrantable de lealtad',
        apply: () => ({
          narrativeText:
            'Le explicaste al hitmaker que tu sonido nació en el barrio y no vas a dejar atrás a los tuyos por conveniencia. Nico quedó profundamente agradecido por tu lealtad.',
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 12),
            fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 10)
          },
          ecosystemNPCChanges: [
            {
              npcId: 'npc_beatmaker_barrio',
              affinityDelta: 40,
              loyaltyDelta: 20,
              historyEntry: `Defendió su producción ante un hitmaker consagrado en ${ctx.currentYear}.`
            }
          ]
        })
      },
      {
        id: 'c_choose_hitmaker_commercial',
        text: 'Aceptar al hitmaker comercial para maximizar el impacto en radios y charts',
        consequencesDescription: '+10 Popularidad, +22 Hype, -35 Afinidad con Nico "808", -6 Credibilidad',
        apply: () => ({
          narrativeText:
            'Reemplazaste el beat barrial por la producción comercial. La canción suena gigante y comercial, pero la relación con Nico y tus amigos de la infancia quedó severamente herida.',
          popularityChange: 10,
          hypeChange: 22,
          statChanges: {
            artisticCredibility: Math.max(0, ctx.player.stats.artisticCredibility - 6)
          },
          ecosystemNPCChanges: [
            {
              npcId: 'npc_beatmaker_barrio',
              affinityDelta: -35,
              loyaltyDelta: -30,
              historyEntry: `Fue reemplazado por un productor comercial en ${ctx.currentYear}.`
            }
          ],
          newsGenerated: {
            headline: `${ctx.player.name} se une a un productor de élite en busca del hit definitivo`,
            body: `El nuevo sonido apuesta a la alta rotación comercial en plataformas y radios.`,
            sentiment: 'positive',
            category: 'release'
          }
        })
      },
      {
        id: 'c_propose_coproduction_hybrid',
        text: 'Proponer una coproducción al 50/50 fusionando la crudeza del barrio con el brillo comercial',
        consequencesDescription: '+14 Hype, +8 Credibilidad artística, -12 Energía, Alianza creativa',
        apply: () => ({
          narrativeText:
            'Lograste sentar a ambos en la misma mesa de mezcla. La combinación de los 808s crudos de Nico con los arreglos del productor consagrado resultó en una pieza única.',
          hypeChange: 14,
          energyChange: -12,
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 8)
          },
          ecosystemNPCChanges: [
            {
              npcId: 'npc_beatmaker_barrio',
              affinityDelta: 20,
              respectDelta: 15,
              historyEntry: `Coprodujo con un hitmaker de élite gracias a la gestión de ${ctx.player.name}.`
            }
          ]
        })
      }
    ]
  },

  {
    id: 'evt_unreleased_track_leak',
    title: 'Filtración en Telegram y Caos en Redes Sociales',
    category: 'media',
    rarity: 'uncommon',
    cooldownMonths: 20,
    weight: 12,
    condition: (ctx) => ctx.player.stats.popularity >= 30,
    getDescription: (ctx) =>
      `Una maqueta inédita sin masterizar que grabaste hace unos meses se filtró en foros de Telegram y canales de Discord. En pocas horas se crearon miles de videos con el audio en TikTok.`,
    choices: (ctx) => [
      {
        id: 'c_emergency_release_leak',
        text: 'Subir de urgencia la canción oficial a plataformas para capitalizar las reproducciones',
        consequencesDescription: '+$3,500 Fondos, +18 Hype, +4,000 Fans, +35,000 Streams inmediatos, +Oyentes Mensuales en Auge, pero sin pulir la mezcla final',
        apply: () => ({
          narrativeText:
            'Subiste el tema en 24 horas. El algoritmo recompensó la inmediatez y sumaste miles de oyentes que ya conocían el estribillo por los leaks.',
          fundsChange: 3500,
          hypeChange: 18,
          fansChange: 4000,
          popularityChange: 3,
          streamsChange: 35000,
          newsGenerated: {
            headline: `¡Lanzamiento sorpresa! ${ctx.player.name} publica corte oficial tras filtración`,
            body: `El tema acumula millones de reproducciones impulsado por el fervor de las redes.`,
            sentiment: 'positive',
            category: 'release'
          }
        })
      },
      {
        id: 'c_rework_and_elevate_leak',
        text: 'Ignorar la filtración y transformar la canción en una versión acústica / orquestal superior',
        consequencesDescription: '+10 Credibilidad artística, +8 Originalidad, Ovación de la crítica',
        apply: () => ({
          narrativeText:
            'Dejaste que el leak circulara y regrabaste el tema con una instrumentación totalmente reimaginada. Cuando salió la versión final, los críticos quedaron boquiabiertos.',
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 10)
          },
          personalityChanges: {
            originality: Math.min(100, ctx.player.personality.originality + 8)
          },
          hypeChange: 12
        })
      },
      {
        id: 'c_rant_at_leakers',
        text: 'Hacer un descargo furioso en redes amenazando con acciones legales a los hackers',
        consequencesDescription: '+24 Hype por polémica, -5 Reputación, Divide a los fanáticos',
        apply: () => ({
          narrativeText:
            'Tu descargo en directo se volvió viral. Aunque muchos entendieron tu frustración, otros te acusaron de no entender cómo funciona la cultura de internet.',
          hypeChange: 24,
          statChanges: {
            reputation: Math.max(0, ctx.player.stats.reputation - 5)
          }
        })
      }
    ]
  },

  {
    id: 'evt_shady_sponsorship_deal',
    title: 'Dilema Ético: Patrocinio Millonario de Casino Online',
    category: 'industry',
    rarity: 'rare',
    cooldownMonths: 36,
    weight: 10,
    condition: (ctx) => ctx.player.stats.popularity >= 40,
    getDescription: (ctx) =>
      `Una plataforma internacional de apuestas y casinos online te ofrece $75,000 en un solo pago por incluir su logo en tu próximo videoclip y promocionar enlaces de registro en tus historias.`,
    choices: (ctx) => [
      {
        id: 'c_accept_gambling_sponsor',
        text: 'Firmar el contrato y cobrar los $75,000 para financiar tus producciones',
        consequencesDescription: '+$75,000 Fondos, -10 Credibilidad artística, -10 Reputación, Lluvia de críticas',
        apply: () => ({
          narrativeText:
            'El dinero ingresó a tus cuentas bancarias. Ahora podés financiar grandes videoclips, pero influencers y seguidores te cuestionan por promover el juego en audiencias jóvenes.',
          fundsChange: 75000,
          statChanges: {
            artisticCredibility: Math.max(0, ctx.player.stats.artisticCredibility - 10),
            reputation: Math.max(0, ctx.player.stats.reputation - 10),
            fanbaseLoyalty: Math.max(0, ctx.player.stats.fanbaseLoyalty - 8)
          },
          ecosystemNPCChanges: [
            {
              npcId: 'npc_critico_hater',
              tensionDelta: 30,
              historyEntry: `Destrozó al artista en su podcast por promocionar casinos online en ${ctx.currentYear}.`
            }
          ],
          newsGenerated: {
            headline: `Polémica por patrocinio: ${ctx.player.name} promociona plataforma de apuestas`,
            body: `El acuerdo comercial desata un encendido debate ético en las redes sociales.`,
            sentiment: 'negative',
            category: 'scandal'
          }
        })
      },
      {
        id: 'c_reject_gambling_sponsor',
        text: 'Rechazar la oferta por principios y compromiso con tu comunidad de seguidores',
        consequencesDescription: '+12 Credibilidad artística, +10 Fidelidad de fans, +8 Reputación',
        apply: () => ({
          narrativeText:
            'Rechazaste el cheque. Cuando la noticia trascendió, tu reputación como artista con valores e integridad se consolidó con fuerza.',
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 12),
            fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 10),
            reputation: Math.min(100, ctx.player.stats.reputation + 8)
          }
        })
      },
      {
        id: 'c_donate_half_sponsorship',
        text: 'Aceptar el patrocinio pero donar el 50% ($37,500) a talleres de música y comedores barriales',
        consequencesDescription: '+$37,500 Fondos netos, +16 Hype, Genera debate polarizado',
        apply: () => ({
          narrativeText:
            'Destinaste la mitad del pago a centros comunitarios de tu barrio. Algunos lo vieron como una jugada brillante de relaciones públicas y otros como una contradicción.',
          fundsChange: 37500,
          hypeChange: 16,
          statChanges: {
            reputation: Math.min(100, ctx.player.stats.reputation + 4)
          },
          newsGenerated: {
            headline: `${ctx.player.name} financia talleres barriales con fondos de patrocinio`,
            body: `La donación genera elogios vecinales y debate en la prensa sobre patrocinios.`,
            sentiment: 'positive',
            category: 'culture'
          }
        })
      }
    ]
  },

  {
    id: 'evt_yellow_press_ambush',
    title: 'Encerrona y Preguntas Trampa en Late Night de Chismes',
    category: 'media',
    rarity: 'uncommon',
    cooldownMonths: 20,
    weight: 12,
    condition: (ctx) => ctx.player.stats.popularity >= 35,
    getDescription: (ctx) =>
      `Durante una entrevista televisiva en vivo en horario central, el conductor desvía la conversación sobre tu música para acorralarte con rumores inventados sobre tu vida personal y supuestos excesos.`,
    choices: (ctx) => [
      {
        id: 'c_rage_quit_live_tv',
        text: 'Levantarte, sacarte el micrófono y abandonar el estudio en vivo',
        consequencesDescription: '+28 Hype de rebeldía callejera, +Meme viral en redes (más oyentes y streams), -6 Reputación en medios masivos',
        apply: () => ({
          narrativeText:
            'El clip de tu salida furiosa se convirtió en el video más visto de la semana. Los jóvenes aplaudieron tu dignidad y autenticidad sin filtro.',
          hypeChange: 28,
          popularityChange: 5,
          statChanges: {
            reputation: Math.max(0, ctx.player.stats.reputation - 6),
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 6)
          },
          newsGenerated: {
            headline: `¡Escándalo en vivo! ${ctx.player.name} abandona una entrevista televisiva`,
            body: `El momento de tensión acumula millones de reproducciones en TikTok y YouTube.`,
            sentiment: 'shocking',
            category: 'scandal'
          }
        })
      },
      {
        id: 'c_cold_irony_response',
        text: 'Responder con frialdad lírica, ironía inteligente y elegancia',
        consequencesDescription: '+8 Carisma, +8 Reputación, +6 Credibilidad intelectual',
        apply: () => ({
          narrativeText:
            'Desarmaste al conductor con calma y respuestas afiladas. Los analistas elogiaron tu madurez para manejar la prensa sensacionalista.',
          personalityChanges: {
            charisma: Math.min(100, ctx.player.personality.charisma + 8)
          },
          statChanges: {
            reputation: Math.min(100, ctx.player.stats.reputation + 8),
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 6)
          }
        })
      },
      {
        id: 'c_freestyle_hijack_interview',
        text: 'Pedir el micrófono y responder improvisando barras inéditas a capella',
        consequencesDescription: '+20 Hype musical, +10 Habilidad lírica, +Oyentes Mensuales, +Streams de catálogo',
        apply: () => ({
          narrativeText:
            'Dejaste callado al piso entero tirando un verso improvisado que se volvió viral de inmediato por la calidad de tus rimas.',
          hypeChange: 20,
          personalityChanges: {
            skill: Math.min(100, ctx.player.personality.skill + 4)
          },
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 8)
          }
        })
      }
    ]
  },

  {
    id: 'evt_rival_social_beef',
    title: 'Tiradera Pública en Redes de un Rival Ambicioso',
    category: 'relationships',
    rarity: 'uncommon',
    cooldownMonths: 18,
    weight: 16,
    condition: (ctx) => ctx.player.stats.popularity >= 30,
    getDescription: (ctx) =>
      `Dante Zero subió una serie de historias burlándose de tus últimos números de streaming y acusándote de ser un producto sin calle que se achica en los escenarios. Las redes te exigen una respuesta inmediata.`,
    choices: (ctx) => [
      {
        id: 'c_beef_respond_stories',
        text: 'Responder con capturas y fuego en historias de Instagram • +Hype y riesgo de beef',
        consequencesDescription: '+22 Hype, -4 Disciplina, Escala el conflicto a guerra mediática',
        apply: () => ({
          narrativeText:
            'Tus respuestas prendieron fuego las redes. Se armó una batalla campal de memes, opiniones y comentarios entre los fanáticos de ambos bandos.',
          hypeChange: 22,
          personalityChanges: {
            discipline: Math.max(0, ctx.player.personality.discipline - 4)
          },
          ecosystemNPCChanges: [
            {
              npcId: 'npc_rival_escena',
              affinityDelta: -25,
              tensionDelta: 30,
              historyEntry: `Intercambio de fuego e indirectas en redes sociales en ${ctx.currentYear}.`
            }
          ],
          newsGenerated: {
            headline: `¡Guerra en redes! ${ctx.player.name} y Dante Zero se cruzan con todo`,
            body: `Las indirectas escalaron a acusaciones directas y encienden el debate en la escena urbana.`,
            sentiment: 'shocking',
            category: 'rivalry'
          }
        })
      },
      {
        id: 'c_beef_studio_diss_track',
        text: 'Encerrarse en el estudio y soltar un Diss Track oficial demoliendo sus argumentos',
        consequencesDescription: '+42 Hype monumental, -15 Energía, +6 Credibilidad lírica, +Disparo en Oyentes Mensuales y Streams, Inicia guerra musical',
        apply: () => ({
          narrativeText:
            'Grabaste una pieza demoledora con rimas quirúrgicas. La escena completa se detuvo a escuchar la tiradera y coronó tu superioridad en el micrófono.',
          hypeChange: 42,
          energyChange: -15,
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 6)
          },
          ecosystemNPCChanges: [
            {
              npcId: 'npc_rival_escena',
              affinityDelta: -45,
              tensionDelta: 50,
              historyEntry: `Recibió un diss track oficial de ${ctx.player.name} en ${ctx.currentYear}.`
            }
          ],
          newsGenerated: {
            headline: `¡Golpe sobre la mesa! ${ctx.player.name} destroza a Dante Zero con una tiradera histórica`,
            body: `El nuevo tema de ${ctx.player.name} sacude las plataformas y se posiciona en lo más alto de las tendencias.`,
            sentiment: 'shocking',
            category: 'rivalry'
          }
        })
      },
      {
        id: 'c_beef_ignore_superiority',
        text: 'Ignorarlo por completo y enfocarte en tu disciplina y lanzamientos • +Disciplina',
        consequencesDescription: '+6 Disciplina, +6 Credibilidad artística, Sin desgaste ni show mediático',
        apply: () => ({
          narrativeText:
            'Decidiste no darle entidad ni regalarle reproducciones a tu rival. Tu silencio y tus números demostraron quién está en otro nivel de madurez.',
          personalityChanges: {
            discipline: Math.min(100, ctx.player.personality.discipline + 6)
          },
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 6)
          },
          ecosystemNPCChanges: [
            {
              npcId: 'npc_rival_escena',
              tensionDelta: -10,
              historyEntry: `Intentó provocar a ${ctx.player.name} pero fue ignorado en ${ctx.currentYear}.`
            }
          ]
        })
      }
    ]
  },

  {
    id: 'evt_masters_buyout_dilemma',
    title: 'Oferta de Fondo de Inversión por la Venta de tus Másters',
    category: 'industry',
    rarity: 'rare',
    cooldownMonths: 48,
    weight: 8,
    condition: (ctx) => ctx.player.stats.popularity >= 55,
    getDescription: (ctx) =>
      `Un fondo de inversión internacional te ofrece $250,000 en mano para adquirir el 100% de la propiedad de los másters y regalías futuras de todo tu catálogo inicial.`,
    choices: (ctx) => [
      {
        id: 'c_sell_masters_cashout',
        text: 'Vender los másters y asegurar $250,000 en liquidez inmediata',
        consequencesDescription: '+$250,000 Fondos, -15 Independencia, -10 Credibilidad a largo plazo',
        apply: () => ({
          narrativeText:
            'Cobraste el cheque multimillonario. Ahora disponés de un patrimonio importante, pero cediste los derechos de tus canciones fundacionales para siempre.',
          fundsChange: 250000,
          personalityChanges: {
            independence: Math.max(0, ctx.player.personality.independence - 15)
          },
          statChanges: {
            artisticCredibility: Math.max(0, ctx.player.stats.artisticCredibility - 10)
          },
          newsGenerated: {
            headline: `${ctx.player.name} vende su catálogo histórico a un fondo internacional`,
            body: `La operación multimillonaria genera debate sobre el control de la propiedad intelectual en la era del streaming.`,
            sentiment: 'neutral',
            category: 'industry'
          }
        })
      },
      {
        id: 'c_keep_masters_forever',
        text: 'Rechazar la compra y mantener tus derechos y regalías para toda la vida',
        consequencesDescription: '+15 Independencia, +12 Credibilidad artística, +10 Fidelidad de fans',
        apply: () => ({
          narrativeText:
            'Rechazaste la oferta corporativa. Tus canciones siguen siendo 100% tuyas, un hito celebrado por todos los puristas de la industria musical.',
          personalityChanges: {
            independence: Math.min(100, ctx.player.personality.independence + 15)
          },
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 12),
            fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 10)
          }
        })
      }
    ]
  },

  {
    id: 'evt_pr_romance_proposal',
    title: 'Propuesta de Romance Fingido / Showmance para la Prensa',
    category: 'media',
    rarity: 'uncommon',
    cooldownMonths: 28,
    weight: 10,
    condition: (ctx) => ctx.player.stats.popularity >= 45,
    getDescription: (ctx) =>
      `La agencia de representación de una estrella pop de moda te propone coordinar salidas públicas y fingir un romance durante 3 meses para potenciar el lanzamiento de una balada romántica conjunta.`,
    choices: (ctx) => [
      {
        id: 'c_accept_showmance_pr',
        text: 'Aceptar el showmance y maximizar el alcance en revistas y televisión',
        consequencesDescription: '+30 Hype masivo, +12 Popularidad mainstream, +15,000 Fans, -8 Credibilidad underground',
        apply: () => ({
          narrativeText:
            'Aparecieron en las portadas de todas las revistas y portales. El morbo de la supuesta relación catapultó el single al tope de las radios.',
          hypeChange: 30,
          popularityChange: 12,
          fansChange: 15000,
          statChanges: {
            artisticCredibility: Math.max(0, ctx.player.stats.artisticCredibility - 8)
          },
          newsGenerated: {
            headline: `¿Nuevo romance del año? ${ctx.player.name} en el centro de todas las miradas`,
            body: `Las apariciones públicas encienden las redes y disparan el interés por su próximo sencillo.`,
            sentiment: 'positive',
            category: 'culture'
          }
        })
      },
      {
        id: 'c_reject_showmance_pr',
        text: 'Rechazar la farsa y priorizar la autenticidad de tu vida personal',
        consequencesDescription: '+8 Credibilidad artística, +6 Fidelidad de la fanbase núcleo',
        apply: () => ({
          narrativeText:
            'Te negaste a participar en montajes publicitarios. Tu música seguirá hablando sin necesidad de telenovelas mediáticas.',
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 8),
            fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 6)
          }
        })
      }
    ]
  },

  {
    id: 'evt_sample_clearance_scandal',
    title: 'Intimación Legal por Sample No Acreditado',
    category: 'industry',
    rarity: 'rare',
    cooldownMonths: 36,
    weight: 9,
    condition: (ctx) => ctx.player.stats.popularity >= 50,
    getDescription: (ctx) =>
      `Los abogados de una banda legendaria de los años 80 te enviaron una intimación formal por el uso de una melodía similar en uno de tus mayores éxitos, amenazando con bajar la canción de Spotify.`,
    choices: (ctx) => [
      {
        id: 'c_settle_sample_privately',
        text: 'Pagar un acuerdo extrajudicial confidencial para conservar el tema online',
        costFunds: 25000,
        consequencesDescription: '-$25,000 Fondos, Mantiene la canción en plataformas sin escándalo mediático',
        apply: () => ({
          narrativeText:
            'Tus abogados acordaron el pago y la canción sigue acumulando millones de reproducciones sin interrupciones.',
          fundsChange: -25000,
          statChanges: {
            reputation: Math.min(100, ctx.player.stats.reputation + 2)
          }
        })
      },
      {
        id: 'c_invite_legend_studio_tribute',
        text: 'Contactar al músico histórico, invitarlo al estudio y regrabar una versión homenaje oficial',
        consequencesDescription: '+14 Credibilidad legendaria, +10 Reputación, +20 Hype por colaboración histórica',
        apply: () => ({
          narrativeText:
            'Lo que era una disputa legal se transformó en un encuentro intergeneracional conmovedor. El remix conjunto se convirtió en un clásico instantáneo.',
          hypeChange: 20,
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 14),
            reputation: Math.min(100, ctx.player.stats.reputation + 10)
          },
          newsGenerated: {
            headline: `De la disputa al homenaje: ${ctx.player.name} une fuerzas con leyendas de la música`,
            body: `Una colaboración histórica que reconcilia épocas y celebra la herencia musical.`,
            sentiment: 'positive',
            category: 'culture'
          }
        })
      },
      {
        id: 'c_fight_sample_in_court',
        text: 'Ir a juicio y defender el derecho a la interpolación y sampling en la cultura hip hop',
        costFunds: 12000,
        consequencesDescription: '+24 Hype de rebeldía, -$12,000 en costas legales, Tensión mediática prolongada',
        apply: () => ({
          narrativeText:
            'El juicio se convirtió en un debate nacional sobre los derechos del sampling y la creatividad en la era digital.',
          hypeChange: 24,
          fundsChange: -12000,
          statChanges: {
            artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 6)
          },
          newsGenerated: {
            headline: `Juicio histórico: ${ctx.player.name} defiende la cultura del sampling en tribunales`,
            body: `El caso sienta un precedente crucial para los productores de la nueva generación.`,
            sentiment: 'shocking',
            category: 'industry'
          }
        })
      }
    ]
  }
];

export function getCreativeDroughtEvent(ctx: EventContext): EventDefinition {
  const droughtYear = ctx.currentYear;
  const droughtEvent = CORE_EVENT_TEMPLATES.find((e) => e.id === 'evt_creative_drought_mandatory');
  if (droughtEvent) {
    return {
      ...droughtEvent,
      eventYear: droughtYear,
      getDescription: (c) => droughtEvent.getDescription({ ...c, currentYear: droughtYear, eventYear: droughtYear }),
      choices: (c) => droughtEvent.choices({ ...c, currentYear: droughtYear, eventYear: droughtYear })
    };
  }

  return {
    id: 'evt_creative_drought_mandatory',
    title: 'Alerta Artística: Sequía Creativa y Año en Silencio',
    category: 'crisis',
    rarity: 'crisis',
    importanceLevel: 5,
    affectedSystems: ['funds', 'energy', 'hype', 'fans', 'credibility', 'career'],
    eventYear: droughtYear,
    cooldownMonths: 0,
    weight: 100,
    condition: () => true,
    getDescription: () => `Ha finalizado el año ${droughtYear} sin lanzamientos de ${ctx.player.name}.`,
    choices: () => []
  };
}
