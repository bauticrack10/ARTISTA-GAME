import { EventDefinition, EventContext, EventOutcome, CareerStage } from '../types';

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
        consequencesDescription: '+Primeros oyentes reales (+350), +Hype inicial (+10)',
        apply: () => ({
          narrativeText: 'Tu canción empezó a sonar en parlantes de amigos y playlists curadas por la comunidad.',
          fansChange: 250,
          popularityChange: 3,
          hypeChange: 10
        })
      },
      {
        id: 'c_music_video_lowbudget',
        text: 'Filmar un video casero con celular y estética VHS en las calles',
        consequencesDescription: '-$80 Fondos, +Identidad estética, +Hype (+18), +Fans (+450)',
        apply: () => ({
          narrativeText: 'El video capturó la vibra callejera y auténtica de tu barrio. Varios canales de música independiente lo repostearon.',
          fundsChange: -80,
          fansChange: 450,
          hypeChange: 18,
          popularityChange: 4,
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
        consequencesDescription: '+Mucho Hype, +Fans, +Streams inmediatos, -Riesgo de saturación',
        apply: () => ({
          narrativeText: 'El algoritmo explotó. Miles de nuevos oyentes entraron a tu perfil de streaming buscando el tema completo.',
          popularityChange: 8,
          hypeChange: 25,
          fansChange: 12000,
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
        consequencesDescription: '+Credibilidad artística, +Fidelidad de fanbase núcleo, Moderado Hype',
        apply: () => ({
          narrativeText: 'El público más melómano respetó tu postura de no convertirte en un meme fugaz. La conversación se centró en la calidad musical.',
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 4), fanbaseLoyalty: Math.min(100, ctx.player.stats.fanbaseLoyalty + 6) },
          hypeChange: 10,
          fansChange: 4000
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
      return `Tras superar la barrera consagratoria de los ${listeners} oyentes mensuales, se desató una auténtica guerra de ofertas en los despachos de la industria. Directivos de Majors multinacionales y sellos independientes líderes te citan con contratos sobre la mesa para disputarse tu fichaje.`;
    },
    choices: (ctx) => {
      const advanceMajor = Math.floor(120000 + (ctx.player.stats.monthlyListeners * 0.4) + (ctx.player.stats.popularity * 1500));
      const advanceIndie = Math.floor(45000 + (ctx.player.stats.monthlyListeners * 0.25) + (ctx.player.stats.popularity * 1000));

      return [
        {
          id: 'c_sign_major_war',
          text: `Firmar con la Major (Sony/Universal): $${advanceMajor.toLocaleString()} de adelanto, 22% regalías, 3 álbumes`,
          consequencesDescription: `+$${advanceMajor.toLocaleString()} Adelanto inmediato, 22% Regalías, 96% Marketing Masivo, 45% Control Creativo`,
          apply: () => ({
            narrativeText: `Firmaste el contrato con la Major Multinacional. El adelanto multimillonario ingresa a tus cuentas y la maquinaria promocional global se activa de inmediato.`,
            fundsChange: advanceMajor,
            popularityChange: 12,
            reputationChange: -2,
            hypeChange: 25,
            newContract: {
              labelId: 'label_sony_columbia',
              signingBonus: advanceMajor,
              royaltyPercentage: 22,
              albumsRequired: 3,
              albumsDelivered: 0,
              creativeControl: 45,
              marketingPower: 96,
              marketingBudgetPerRelease: 45000,
              breakoutClause: advanceMajor * 3,
              durationYears: 4,
              signedYear: ctx.currentYear
            },
            newsGenerated: {
              headline: `¡Fichaje Millonario! ${ctx.player.name} firma contrato estelar con una Major`,
              body: `El acuerdo sacude el mercado discográfico con un adelanto récord y una campaña de distribución global.`,
              sentiment: 'positive',
              category: 'industry'
            }
          })
        },
        {
          id: 'c_sign_indie_war',
          text: `Firmar con Sello Independiente Líder (Dale Play / Rimas): $${advanceIndie.toLocaleString()} de adelanto, 60% regalías, 2 álbumes`,
          consequencesDescription: `+$${advanceIndie.toLocaleString()} Adelanto, 60% Regalías Artista, 88% Marketing, 82% Control Creativo`,
          apply: () => ({
            narrativeText: `Optaste por el camino independiente de élite. Conservás el 60% de tus regalías y libertad total en la producción con respaldo estratégico de primer nivel.`,
            fundsChange: advanceIndie,
            popularityChange: 8,
            statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 6) },
            hypeChange: 20,
            newContract: {
              labelId: 'label_dale_play',
              signingBonus: advanceIndie,
              royaltyPercentage: 60,
              albumsRequired: 2,
              albumsDelivered: 0,
              creativeControl: 82,
              marketingPower: 88,
              marketingBudgetPerRelease: 25000,
              breakoutClause: advanceIndie * 2,
              durationYears: 3,
              signedYear: ctx.currentYear
            },
            newsGenerated: {
              headline: `${ctx.player.name} sella una alianza estratégica con Dale Play Records`,
              body: `La escena celebra un acuerdo que prioriza la visión artística, regalías justas y alcance internacional.`,
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
            narrativeText: `Rechazaste todos los cheques sobre la mesa. La noticia de tu rechazo a las Majors corrió por foros y medios, consagrándote como un referente absoluto de integridad.`,
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
    getDescription: (ctx) => `El colectivo independiente Underground Syndicate te propone un acuerdo boutique de distribución: un adelanto inicial modesto, el 78% de tus regalías y el 95% de libertad creativa para tu próximo álbum.`,
    choices: (ctx) => [
      {
        id: 'c_accept_boutique',
        text: 'Aceptar Alianza Boutique: $12,000 de adelanto, 78% regalías, 1 álbum',
        consequencesDescription: '+$12,000 Fondos, 78% Regalías, 95% Control Creativo, 1 Álbum exigido',
        apply: () => ({
          narrativeText: 'Firmaste con el colectivo underground. Tenés presupuesto fresco para tus grabaciones sin resignar ni un ápice de tu identidad artística.',
          fundsChange: 12000,
          statChanges: { artisticCredibility: Math.min(100, ctx.player.stats.artisticCredibility + 4) },
          newContract: {
            labelId: 'label_underground_syndicate',
            signingBonus: 12000,
            royaltyPercentage: 78,
            albumsRequired: 1,
            albumsDelivered: 0,
            creativeControl: 95,
            marketingPower: 50,
            marketingBudgetPerRelease: 8000,
            breakoutClause: 20000,
            durationYears: 2,
            signedYear: ctx.currentYear
          },
          newsGenerated: {
            headline: `${ctx.player.name} se une al colectivo Underground Syndicate`,
            body: `Una alianza boutique que apuesta por el sonido de autor y la cultura de base.`,
            sentiment: 'positive',
            category: 'industry'
          }
        })
      },
      {
        id: 'c_decline_boutique',
        text: 'Declinar con cordialidad y seguir autogestionando tus canciones',
        consequencesDescription: '+Control total, Sin compromisos de entrega',
        apply: () => ({
          narrativeText: 'Agradeciste la propuesta y continuaste con tu calendario de lanzamientos por cuenta propia.',
          statChanges: { energy: Math.min(100, ctx.player.stats.energy + 2) }
        })
      }
    ]
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
    title: 'Alerta de Industria: Sequía Creativa y Año en Silencio',
    category: 'career',
    rarity: 'legendary',
    cooldownMonths: 0,
    weight: 100,
    condition: () => true,
    getDescription: (ctx) =>
      `Ha finalizado el año ${ctx.currentYear} y no publicaste ninguna canción ni proyecto musical. Los medios de prensa, los algoritmos de streaming y tu comunidad de oyentes castigan la inactividad prolongada. Tu equipo te exige tomar una decisión inmediata.`,
    choices: (ctx) => [
      {
        id: 'c_drought_emergency_single',
        text: 'Encerrarse de urgencia en el estudio y publicar una maqueta acústica / espontánea',
        consequencesDescription: '-$600 Fondos, -25 Energía, +14 Hype, Lanza un single espontáneo de rescate',
        apply: () => {
          const songId = `song_drought_${ctx.player.id}_${ctx.currentYear}_${Math.floor(Math.random() * 1000)}`;
          const emergencySong = {
            id: songId,
            title: 'Sesión Nocturna (Lanzamiento de Emergencia)',
            artistId: ctx.player.id,
            featuredArtistIds: [],
            genreId: ctx.player.mainGenreId,
            subGenreIds: [],
            releaseYear: ctx.currentYear,
            releaseMonth: 12,
            quality: Math.min(100, Math.floor(ctx.player.personality.skill * 0.7 + ctx.player.personality.creativity * 0.3)),
            commercialAppeal: Math.min(100, Math.floor(ctx.player.personality.commercialAppeal * 0.6 + 15)),
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
          ctx.player.lastReleaseYear = ctx.currentYear;
          ctx.player.lastReleaseMonth = 12;

          return {
            narrativeText: `Te encerraste toda la noche y grabaste una pieza espontánea y cruda. "${emergencySong.title}" ya está en plataformas y detuvo la sangría de oyentes.`,
            fundsChange: -600,
            energyChange: -25,
            hypeChange: 14,
            popularityChange: 2,
            newsGenerated: {
              headline: `¡Rompe el silencio! ${ctx.player.name} publica un tema inédito de medianoche`,
              body: `Tras meses sin lanzamientos, ${ctx.player.name} sorprende a sus seguidores con una grabación íntima de último momento.`,
              sentiment: 'positive',
              category: 'release'
            }
          };
        }
      },
      {
        id: 'c_drought_accept_consequences',
        text: 'Aceptar la sequía creativa y asumir las duras penalizaciones del algoritmo',
        consequencesDescription: '-25 Hype, -8 Popularidad, -15% Fans, Caída abrupta de oyentes mensuales',
        apply: () => ({
          narrativeText: 'Decidiste no forzar lanzamientos sin inspiración. Tu presencia en playlists cayó drásticamente y la prensa musical comienza a preguntarse si perdiste el rumbo.',
          hypeChange: -25,
          popularityChange: -8,
          fansChange: -Math.floor(ctx.player.stats.fansCount * 0.15),
          reputationChange: -4,
          newsGenerated: {
            headline: `¿Dónde está ${ctx.player.name}? Preocupación por un año completo sin música`,
            body: `El silencio prolongado de ${ctx.player.name} pasa factura en las estadísticas de streaming.`,
            sentiment: 'negative',
            category: 'culture'
          }
        })
      },
      {
        id: 'c_drought_announce_sabbatical',
        text: 'Anunciar un retiro reflexivo / año sabático para reconstruir tu sonido',
        consequencesDescription: '-35 Hype, -12 Popularidad, +8 Creatividad, +6 Originalidad, +40 Energía',
        apply: () => ({
          narrativeText: 'Emitiste un comunicado anunciando una pausa estratégica para reinventarte. Aunque el hype cayó en picada, tu salud mental y tus ideas artísticas se revitalizaron.',
          hypeChange: -35,
          popularityChange: -12,
          energyChange: 40,
          personalityChanges: {
            creativity: Math.min(100, ctx.player.personality.creativity + 8),
            originality: Math.min(100, ctx.player.personality.originality + 6)
          },
          newsGenerated: {
            headline: `${ctx.player.name} anuncia un retiro temporal en busca de una nueva era musical`,
            body: `El artista pausa su agenda pública para concentrarse en la evolución de su próximo universo sonoro.`,
            sentiment: 'neutral',
            category: 'industry'
          }
        })
      }
    ]
  }
];

export function getCreativeDroughtEvent(ctx: EventContext): EventDefinition {
  const droughtEvent = CORE_EVENT_TEMPLATES.find(e => e.id === 'evt_creative_drought_mandatory');
  if (droughtEvent) return droughtEvent;

  return {
    id: 'evt_creative_drought_mandatory',
    title: 'Alerta de Industria: Sequía Creativa y Año en Silencio',
    category: 'career',
    rarity: 'legendary',
    cooldownMonths: 0,
    weight: 100,
    condition: () => true,
    getDescription: () => `Ha finalizado el año ${ctx.currentYear} sin lanzamientos de ${ctx.player.name}.`,
    choices: () => []
  };
}
