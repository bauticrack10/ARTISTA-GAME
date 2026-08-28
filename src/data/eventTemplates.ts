import { EventDefinition, EventContext, EventOutcome, CareerStage } from '../types';
import { formatMoney } from '../utils/formatters';
import { TimeSystem } from '../systems/TimeSystem';
import { IndustryEngine } from '../systems/IndustryEngine';

export const CORE_EVENT_TEMPLATES: EventDefinition[] = [
  // --- UNDERGROUND / YEAR 1 FIRST STEPS EVENTS ---
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
        consequencesDescription: '+Credibilidad artística (+4), +Reputación (+3), -15 Energía',
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
        consequencesDescription: '+Hype (+12), +Primeros Fans (+80), -5 Energía',
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
        consequencesDescription: '+Habilidad técnica permanente, +Calidad de futuras canciones',
        apply: () => ({
          narrativeText: 'Comprendiste conceptos clave de mezcla que mejorarán la calidad de cada tema futuro.',
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
        consequencesDescription: '+Conexión con productor, +Hype (+10), +Relación positiva',
        apply: () => ({
          narrativeText: 'La química entre tu voz y su base fue perfecta. Nació una alianza sonora prometedora.',
          hypeChange: 10,
          fansChange: 120,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 3) }
        })
      },
      {
        id: 'c_buy_exclusive',
        text: 'Pagarle $150 por los derechos exclusivos de la pista',
        costFunds: 150,
        consequencesDescription: '-$150 Fondos, +100% Derechos y másters, +Reputación profesional',
        apply: () => ({
          narrativeText: 'El productor quedó sorprendido por tu seriedad comercial. La instrumental ahora es 100% tuya.',
          fundsChange: -150,
          reputationChange: 4,
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
        consequencesDescription: '+Carisma en vivo, +Fans fieles (+150), +$80 de gorra, -12 Energía',
        apply: () => ({
          narrativeText: 'La energía fue contagiosa. Las pocas personas presentes terminaron saltando y pidiéndote fotos al bajar.',
          fansChange: 150,
          popularityChange: 2,
          reputationChange: 3,
          fundsChange: 80,
          energyChange: -12,
          hypeChange: 8
        })
      },
      {
        id: 'c_sell_merch_local',
        text: 'Llevar stickers y remeras caseras hechas a mano',
        consequencesDescription: '+$140 Fondos, +Fidelidad de los primeros seguidores',
        apply: () => ({
          narrativeText: 'Vendiste todos los stickers y remeras. La gente se fue llevando tu logo en sus fundas de celular.',
          fundsChange: 140,
          fansChange: 80,
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
        consequencesDescription: '+Primeros oyentes reales (+350), +Hype inicial (+10), +1,500 Streams',
        apply: () => ({
          narrativeText: 'Tu canción empezó a sonar en parlantes de amigos y playlists curadas por la comunidad.',
          fansChange: 250,
          popularityChange: 3,
          hypeChange: 10,
          streamsChange: 1500
        })
      },
      {
        id: 'c_music_video_lowbudget',
        text: 'Filmar un video casero con celular y estética VHS en las calles',
        costFunds: 80,
        consequencesDescription: '-$80 Fondos, +Identidad estética, +Hype (+18), +Fans (+450), +3,800 Streams',
        apply: () => ({
          narrativeText: 'El video capturó la vibra callejera y auténtica de tu barrio. Varios canales de música independiente lo repostearon.',
          fundsChange: -80,
          fansChange: 450,
          hypeChange: 18,
          popularityChange: 4,
          streamsChange: 3800,
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
        consequencesDescription: '+Reputación lírica, +Credibilidad artística, -10 Energía',
        apply: () => ({
          narrativeText: 'Tus rimas dejaron callada a la plaza. Los videos grabados con celulares comenzaron a compartirse en redes barriales.',
          reputationChange: 6,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 5) },
          fansChange: 800,
          energyChange: -10,
          hypeChange: 8
        })
      },
      {
        id: 'c_catchy_hook',
        text: 'Cantar un estribillo melódico y conectar con el público',
        consequencesDescription: '+Popularidad, +Oyentes potenciales, +Carisma',
        apply: () => ({
          narrativeText: 'Toda la plaza terminó coreando el estribillo. Un productor local te pidió tu contacto al terminar la ronda.',
          popularityChange: 4,
          fansChange: 1500,
          hypeChange: 12,
          energyChange: -8
        })
      },
      {
        id: 'c_network_producers',
        text: 'Quedarte escuchando y hacer contactos con beatmakers',
        consequencesDescription: '+Conexiones de producción, +Oportunidades de estudio',
        apply: () => ({
          narrativeText: 'Conociste a beatmakers underground que tienen grabadoras y pistas listas para experimentar.',
          statChanges: { energy: Math.min(100, ctx.player.stats.energy + 5) },
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
          consequencesDescription: '+100% Regalías y Másters propios, +Credibilidad Artística (+8), +Fidelidad de Fans (+8)',
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
          consequencesDescription: '+Fidelidad de Fans (+5), +Credibilidad (+3)',
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

  // --- RELATIONSHIP & COLLABORATIONS ---
  {
    id: 'evt_spontaneous_studio_session',
    title: 'Encuentro Imprevisto en el Estudio de Grabación',
    category: 'relationships',
    rarity: 'common',
    cooldownMonths: 18,
    weight: 14,
    condition: (ctx) => Object.keys(ctx.world.artists).length > 2,
    getDescription: (ctx) => {
      const otherArtists = Object.values(ctx.world.artists).filter(a => a.id !== ctx.player.id && !a.isRetired);
      const randomOther = otherArtists[Math.floor(Math.random() * otherArtists.length)] || otherArtists[0];
      return `Te cruzaste a ${randomOther.name} en el pasillo del estudio de grabación. Escuchó lo que estabas produciendo a través de la puerta y te propuso tirar una sesión de madrugada.`;
    },
    choices: (ctx) => {
      const otherArtists = Object.values(ctx.world.artists).filter(a => a.id !== ctx.player.id && !a.isRetired);
      const target = otherArtists[Math.floor(Math.random() * otherArtists.length)] || otherArtists[0];

      return [
        {
          id: 'c_collab_now',
          text: `Grabar juntos de inmediato con ${target.name}`,
          consequencesDescription: '+Afinidad, +Hype, Potencial Hit colaborativo, -15 Energía',
          apply: () => ({
            narrativeText: `La química en el micrófono fue instantánea. Terminaron una maqueta que promete encender los charts.`,
            hypeChange: 16,
            energyChange: -15,
            relationshipChanges: [
              {
                targetArtistId: target.id,
                affinityDelta: 25,
                relationType: 'friend',
                historyEntry: `Grabaron una sesión espontánea en el estudio durante el año ${ctx.currentYear}.`
              }
            ]
          })
        },
        {
          id: 'c_friendly_talk',
          text: 'Charlar sobre la industria, escuchar maquetas y compartir consejos',
          consequencesDescription: '+Respeto mutuo, +Conocimiento de la industria',
          apply: () => ({
            narrativeText: `Conversaron durante horas sobre producción y visión musical. Nació un gran respeto mutuo.`,
            relationshipChanges: [
              {
                targetArtistId: target.id,
                affinityDelta: 12,
                relationType: 'friend',
                historyEntry: `Compartieron una larga charla de intercambio artístico en ${ctx.currentYear}.`
              }
            ]
          })
        }
      ];
    }
  },

  // --- RIVALRY & DISS TRACKS ---
  {
    id: 'evt_rival_subtle_diss',
    title: 'Declaraciones Polémicas y Tensión en una Entrevista',
    category: 'relationships',
    rarity: 'uncommon',
    cooldownMonths: 24,
    weight: 9,
    condition: (ctx) => ctx.player.stats.popularity >= 45,
    getDescription: (ctx) => {
      return `En un podcast de gran audiencia, un artista contemporáneo deslizó críticas hacia tu sonido, insinuando que tu éxito se debe al marketing y no a tu talento genuino.`;
    },
    choices: (ctx) => [
      {
        id: 'c_respond_diss_track',
        text: 'Responder con un Diss Track demoledor en el estudio',
        consequencesDescription: '+Mucho Hype, +Rivalidad encendida, +Atención de medios, -12 Energía',
        apply: () => ({
          narrativeText: 'Soltaste una canción cargada de barras afiladas y referencias directas. La escena completa se detuvo a analizar cada línea.',
          hypeChange: 28,
          popularityChange: 5,
          energyChange: -12,
          newsGenerated: {
            headline: `¡Guerra en el mic! ${ctx.player.name} responde con un tema incendiario`,
            body: `El intercambio de barras sacude los foros y genera millones de reproducciones en pocas horas.`,
            sentiment: 'shocking',
            category: 'rivalry'
          }
        })
      },
      {
        id: 'c_ignore_and_focus',
        text: 'Ignorar la provocación y responder únicamente con música de calidad',
        consequencesDescription: '+Credibilidad artística, +Elegancia profesional, -0 Drama',
        apply: () => ({
          narrativeText: 'Preferiste no entrar en el juego del circo mediático. La crítica especializada destacó tu madurez y enfoque en tu arte.',
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 6) },
          reputationChange: 5
        })
      }
    ]
  },

  // --- GENRE PIVOT & ARTISTIC RISK ---
  {
    id: 'evt_creative_reinvention_dilemma',
    title: 'La Necesidad de una Reinvención Sonora',
    category: 'music',
    rarity: 'rare',
    cooldownMonths: 48,
    weight: 8,
    condition: (ctx) => ctx.player.stats.popularity >= 50,
    getDescription: (ctx) => `Sentís que tu fórmula actual está llegando al límite creativo. En tu cabeza resuena un sonido completamente nuevo que desafía las expectativas de tus fanáticos.`,
    choices: (ctx) => [
      {
        id: 'c_take_risk_pivot',
        text: 'Arriesgar todo: Adoptar una estética vanguardista y experimental',
        consequencesDescription: '+Originalidad extrema, +Probabilidad de marcar época, -Riesgo de rechazo inicial',
        apply: () => ({
          narrativeText: 'Decidiste romper con lo predecible. Algunos oyentes tradicionales quedaron desconcertados, pero los críticos y nuevos fanáticos te aclaman como un visionario.',
          personalityChanges: { originality: Math.min(100, ctx.player.personality.originality + 5), riskTolerance: Math.min(100, ctx.player.personality.riskTolerance + 5) },
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 10) },
          hypeChange: 20,
          newsGenerated: {
            headline: `${ctx.player.name} rompe esquemas con una reinvención estética radical`,
            body: `El nuevo rumbo sonoro de ${ctx.player.name} divide opiniones pero marca un punto de inflexión.`,
            sentiment: 'positive',
            category: 'culture'
          }
        })
      },
      {
        id: 'c_refine_signature_sound',
        text: 'Perfeccionar tu sonido clásico sin romper con la base',
        consequencesDescription: '+Fidelidad de la fanbase, +Consistencia comercial, Menor riesgo',
        apply: () => ({
          narrativeText: 'Puliste tu identidad con un estándar de producción altísimo. Tu audiencia celebró la coherencia y lealtad a tus raíces.',
          statChanges: { fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 8) },
          popularityChange: 4
        })
      }
    ]
  },

  // --- STADIUM & MASSIVE TOURING ---
  {
    id: 'evt_historic_stadium_proposal',
    title: 'La Propuesta de un Estadio Histórico',
    category: 'shows',
    rarity: 'rare',
    cooldownMonths: 36,
    weight: 7,
    condition: (ctx) => ctx.player.stats.popularity >= 75,
    getDescription: (ctx) => `Una de las productoras más grandes del país te ofrece encabezar tu primera noche en un estadio de fútbol de 45.000 personas.`,
    choices: (ctx) => [
      {
        id: 'c_accept_stadium',
        text: 'Aceptar el desafío: Diseñar una puesta en escena monumental',
        consequencesDescription: '+$400,000 Ganancia estimada, +Hype gigantesco, -25 Energía',
        apply: () => ({
          narrativeText: 'Las entradas se agotaron en horas. Viviste una noche consagratoria con un coro de 45.000 almas cantando cada uno de tus himnos.',
          fundsChange: 420000,
          popularityChange: 8,
          hypeChange: 30,
          energyChange: -25,
          fansChange: 35000,
          newsGenerated: {
            headline: `¡Histórico! ${ctx.player.name} llena un estadio con un show memorable`,
            body: `Una demostración de poderío escénico y conexión incondicional con su público.`,
            sentiment: 'positive',
            category: 'tour'
          }
        })
      },
      {
        id: 'c_intimate_theaters_instead',
        text: 'Preferir una residencia de fechas íntimas en teatros históricos',
        consequencesDescription: '+Credibilidad y prestigio, +Menor desgaste, Ganancia moderada',
        apply: () => ({
          narrativeText: 'La serie de conciertos acústicos y detallistas en teatros se convirtió en una experiencia de culto inolvidable.',
          fundsChange: 180000,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 6) },
          energyChange: -12,
          fansChange: 15000
        })
      }
    ]
  },

  // --- VETERAN / LEGEND / COMEBACK EVENTS ---
  {
    id: 'evt_documentary_and_hall_of_fame',
    title: 'Propuesta para una Serie Documental sobre tu Vida',
    category: 'career',
    rarity: 'rare',
    cooldownMonths: 60,
    weight: 6,
    condition: (ctx) => ctx.player.legacyScore >= 70 || ctx.currentYear - ctx.player.careerStartYear >= 15,
    getDescription: (ctx) => `Una plataforma global de streaming quiere producir un documental de varios episodios explorando tu legado, tus inicios y los momentos que cambiaron tu vida.`,
    choices: (ctx) => [
      {
        id: 'c_open_archives',
        text: 'Abrir los archivos personales y contar toda la verdad',
        consequencesDescription: '+Legado cultural masivo, +Revitalización del catálogo antiguo, +$250,000',
        apply: () => ({
          narrativeText: 'El documental fue un éxito mundial de crítica. Millones de jóvenes descubrieron tus primeros discos y tu catálogo antiguo volvió a entrar a los charts.',
          fundsChange: 250000,
          hypeChange: 25,
          statChanges: { reputation: Math.min(100, ctx.player.stats.reputation + 10), artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 8) },
          newsGenerated: {
            headline: `El documental sobre ${ctx.player.name} conmueve al mundo de la música`,
            body: `Un recorrido íntimo por décadas de creación, triunfos y cicatrices que redefine su estatus legendario.`,
            sentiment: 'positive',
            category: 'culture'
          }
        })
      },
      {
        id: 'c_decline_keep_private',
        text: 'Declinar: El misterio y las canciones deben hablar por sí solas',
        consequencesDescription: '+Mística intocable, +Respeto purista',
        apply: () => ({
          narrativeText: 'Tu negativa aumentó el aura de leyenda inalcanzable. Tu obra sigue siendo el único testimonio necesario.',
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 5) }
        })
      }
    ]
  },

  // --- MANDATORY ANNUAL CREATIVE DROUGHT EVENT ---
  {
    id: 'evt_creative_drought_mandatory',
    title: 'Alerta Artística: Sequía Creativa y Silencio Discográfico',
    category: 'crisis',
    rarity: 'crisis',
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

      // Penalizaciones proporcionales exactas
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
        consequencesDescription: '+28 Hype de rebeldía callejera, +Meme viral en redes (+Oyentes y Streams), -6 Reputación en medios masivos',
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
        text: 'Responder con capturas y fuego en historias de Instagram (+Hype, riesgo de beef)',
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
        text: 'Ignorarlo por completo y enfocarte en tu disciplina y lanzamientos (+Disciplina, stat quo)',
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
  const droughtEvent = CORE_EVENT_TEMPLATES.find(e => e.id === 'evt_creative_drought_mandatory');
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
    eventYear: droughtYear,
    cooldownMonths: 0,
    weight: 100,
    condition: () => true,
    getDescription: () => `Ha finalizado el año ${droughtYear} sin lanzamientos de ${ctx.player.name}.`,
    choices: () => []
  };
}
