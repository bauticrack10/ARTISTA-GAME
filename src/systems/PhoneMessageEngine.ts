import {
  Artist,
  WorldState,
  ArtistPhoneMessage,
  ArtistPhoneChoice,
  Producer,
  Manager
} from '../types';

export class PhoneMessageEngine {
  /**
   * Genera una lista estacional de mensajes entrantes para el teléfono del artista.
   * La cantidad y temática se calibran según los meses simulados (1, 3, 6, 12)
   * y el contexto del jugador (energía, hype, mánager, rivalidades, etc.).
   */
  public static generateSeasonalMessages(
    player: Artist,
    world: WorldState,
    monthsSimulated: number = 1
  ): ArtistPhoneMessage[] {
    const messages: ArtistPhoneMessage[] = [];
    const currentYear = world.currentYear;
    const currentMonth = world.currentMonth;

    // Determinar cantidad objetivo de mensajes según el ciclo
    let targetCount = 1;
    if (monthsSimulated === 1) {
      targetCount = Math.random() < 0.65 ? 1 : 2;
    } else if (monthsSimulated === 3) {
      targetCount = Math.floor(Math.random() * 2) + 2; // 2 o 3
    } else if (monthsSimulated === 6) {
      targetCount = Math.floor(Math.random() * 2) + 2; // 2 o 3
    } else {
      // 12 meses
      targetCount = Math.floor(Math.random() * 2) + 3; // 3 o 4
    }

    const categoriesPool: Array<'manager' | 'producer' | 'rival' | 'family' | 'press'> = [
      'manager',
      'producer',
      'rival',
      'family',
      'press'
    ];

    // Si la energía está muy baja, priorizar advertencia de mánager o familia
    if (player.stats.energy < 35) {
      categoriesPool.unshift('manager', 'family');
    }

    // Barajar categorías
    const shuffled = [...categoriesPool].sort(() => Math.random() - 0.5);

    for (const cat of shuffled) {
      if (messages.length >= targetCount) break;

      let msg: ArtistPhoneMessage | null = null;
      switch (cat) {
        case 'manager':
          msg = this.generateManagerMessage(player, world, currentYear, currentMonth);
          break;
        case 'producer':
          msg = this.generateProducerMessage(player, world, currentYear, currentMonth);
          break;
        case 'rival':
          msg = this.generateRivalMessage(player, world, currentYear, currentMonth);
          break;
        case 'family':
          msg = this.generateFamilyMessage(player, world, currentYear, currentMonth);
          break;
        case 'press':
          msg = this.generatePressMessage(player, world, currentYear, currentMonth);
          break;
      }

      if (msg) {
        messages.push(msg);
      }
    }

    return messages;
  }

  // ==========================================
  // GENERADORES POR CATEGORÍA
  // ==========================================

  private static generateManagerMessage(
    player: Artist,
    world: WorldState,
    year: number,
    month: number
  ): ArtistPhoneMessage | null {
    const manager: Manager | undefined = player.managerId
      ? world.managers[player.managerId]
      : undefined;

    const senderId = manager ? manager.id : 'mgr_industry_agent';
    const senderName = manager ? manager.name : 'Agente de Talentos';
    const avatarColor = '#FF4F00';

    const brandReward = Math.max(8000, Math.floor(player.stats.popularity * 350 + player.stats.hype * 150));
    const privateShowFee = Math.max(12000, Math.floor(player.stats.popularity * 500 + 5000));

    // Si la energía es crítica, advertencia de cansancio
    if (player.stats.energy < 35) {
      return {
        id: `phone_mgr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        senderId,
        senderName,
        senderAvatarColor: avatarColor,
        senderAvatarIcon: 'Briefcase',
        category: 'manager',
        sentYear: year,
        sentMonth: month,
        isRead: false,
        text: `Che ${player.name}, ayer en la prueba de sonido estabas cerrando los ojos entre tema y tema y la garganta te raspa al final de cada frase. Si no cortás dos días ahora, el foniatra nos va a cancelar el mes entero.`,
        choices: [
          {
            label: 'Alquilar retiro de spa (-$3.000, +25 Energía, -5 Hype)',
            replyText: 'Tenés razón. Me voy un fin de semana a una cabaña a recargar pilas.',
            effects: {
              fundsDelta: -3000,
              energyDelta: 25,
              hypeDelta: -5,
              newsHeadline: `${player.name} se toma unos días de descanso para recargar energías`
            }
          },
          {
            label: 'Ignorar advertencia y seguir a fondo (+10 Hype, -10 Energía)',
            replyText: 'No hay tiempo para dormir, el tren pasa una sola vez.',
            effects: {
              hypeDelta: 10,
              energyDelta: -10
            }
          }
        ]
      };
    }

    // Oferta de marca o show privado
    if (Math.random() < 0.5) {
      return {
        id: `phone_mgr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        senderId,
        senderName,
        senderAvatarColor: avatarColor,
        senderAvatarIcon: 'Briefcase',
        category: 'manager',
        sentYear: year,
        sentMonth: month,
        isRead: false,
        text: `La gente de una bebida energética puso $${brandReward.toLocaleString('es-AR')} arriba de la mesa. Piden tres historias en Instagram y que la lata se vea cuatro segundos en tu próximo corte. ¿Firmamos o los mando a volar?`,
        choices: [
          {
            label: `Aceptar patrocinio (+$$${brandReward.toLocaleString('es-AR')}, +8 Hype, -6 Energía)`,
            replyText: 'Cerremos trato. El dinero nos sirve para financiar las próximas grabaciones.',
            effects: {
              fundsDelta: brandReward,
              hypeDelta: 8,
              energyDelta: -6,
              newsHeadline: `${player.name} firma un lucrativo acuerdo comercial de patrocinio publicitario`
            }
          },
          {
            label: 'Rechazar para cuidar la imagen artística (+5 Credibilidad)',
            replyText: 'Paso. No quiero que mi perfil parezca una tanda publicitaria.',
            effects: {
              hypeDelta: -2
            }
          }
        ]
      };
    } else {
      return {
        id: `phone_mgr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        senderId,
        senderName,
        senderAvatarColor: avatarColor,
        senderAvatarIcon: 'Briefcase',
        category: 'manager',
        sentYear: year,
        sentMonth: month,
        isRead: false,
        text: `Salió un privado en Puerto Madero para el sábado: 40 minutos con pista o guitarra para el cumpleaños de un empresario. Pagan $${privateShowFee.toLocaleString('es-AR')} en mano al bajar del escenario, celulares afuera en puerta.`,
        choices: [
          {
            label: `Agarrar la plata fácil (+$$${privateShowFee.toLocaleString('es-AR')}, -12 Energía)`,
            replyText: 'Contá conmigo. Voy, canto 45 minutos y me llevo el maletín.',
            effects: {
              fundsDelta: privateShowFee,
              energyDelta: -12
            }
          },
          {
            label: 'Declinar: los shows son para la gente (+10 Fans)',
            replyText: 'No hago shows a puertas cerradas para chetos. Mi música es del público.',
            effects: {
              fansDelta: 2500,
              energyDelta: 5
            }
          }
        ]
      };
    }
  }

  private static generateProducerMessage(
    player: Artist,
    world: WorldState,
    year: number,
    month: number
  ): ArtistPhoneMessage | null {
    const producersList = Object.values(world.producers || {});
    const prod: Producer | undefined = producersList.length > 0
      ? producersList[Math.floor(Math.random() * producersList.length)]
      : undefined;

    const senderId = prod ? prod.id : 'prod_beatmaker_guest';
    const senderName = prod ? prod.name : 'Beatmaker Asociado';
    const avatarColor = '#10B981';

    if (Math.random() < 0.5) {
      return {
        id: `phone_prod_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        senderId,
        senderName,
        senderAvatarColor: avatarColor,
        senderAvatarIcon: 'Music',
        category: 'artist',
        sentYear: year,
        sentMonth: month,
        isRead: false,
        text: `¿Qué hacés ${player.name}? Armé un esqueleto en 92 BPM pasando el bajo por un pedal de distorsión roto y recortando muestras de vinilo viejo. Tiene tu tempo; si venís antes de las nueve grabamos voces de referencia.`,
        choices: [
          {
            label: 'Caer al estudio a experimentar (+14 Hype, +1.800 Fans, -10 Energía)',
            replyText: 'Voy para allá de cabeza. Prendé los monitores que tengo unas barras listas.',
            effects: {
              hypeDelta: 14,
              fansDelta: 1800,
              energyDelta: -10,
              newsHeadline: `${player.name} entra al estudio con ${senderName} a experimentar con nuevos sonidos`
            }
          },
          {
            label: 'Pedir que mande las pistas para escuchar (-2 Energía)',
            replyText: 'Mandame el stem por Drive y lo escucho el fin de semana tranquilo.',
            effects: {
              hypeDelta: 3,
              energyDelta: -2
            }
          },
          {
            label: 'Pasar por ahora (Sin efecto)',
            replyText: 'Gracias bro, pero estoy cerrando otros conceptos en este momento.',
            effects: {}
          }
        ]
      };
    } else {
      return {
        id: `phone_prod_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        senderId,
        senderName,
        senderAvatarColor: avatarColor,
        senderAvatarIcon: 'Sliders',
        category: 'artist',
        sentYear: year,
        sentMonth: month,
        isRead: false,
        text: `Se cayó una reserva en el estudio grande del centro y me dejaron el turno de trasnoche a $4.500 con técnico incluido. Tienen la consola Neve 8014 andando y dos compresores ópticos recién calibrados.`,
        choices: [
          {
            label: 'Reservar la sesión analógica (-$4.500, +20 Hype, +2.500 Fans)',
            replyText: 'Cerralo. Llevo los discos duros a las diez para pasar las voces por esa mesa.',
            effects: {
              fundsDelta: -4500,
              hypeDelta: 20,
              fansDelta: 2500,
              energyDelta: -8
            }
          },
          {
            label: 'Seguir en nuestro home studio austero ($0 costo)',
            replyText: 'No hace falta gastar tanto. El hit está en la vibra y en las barras, no en la mesa.',
            effects: {
              hypeDelta: 2
            }
          }
        ]
      };
    }
  }

  private static generateRivalMessage(
    player: Artist,
    world: WorldState,
    year: number,
    month: number
  ): ArtistPhoneMessage | null {
    // Buscar rival existente en relaciones
    const relationships = Object.values(player.relationships || {});
    const rivalRel = relationships.find(
      r => (r.relationType === 'rival' || r.relationType === 'feud' || r.affinity < -15) && world.artists[r.targetArtistId]
    );

    let rivalArtist: Artist | undefined;
    if (rivalRel) {
      rivalArtist = world.artists[rivalRel.targetArtistId];
    } else {
      // Tomar otro artista de la misma escena
      const otherArtists = Object.values(world.artists).filter(a => a.id !== player.id);
      if (otherArtists.length > 0) {
        rivalArtist = otherArtists[Math.floor(Math.random() * otherArtists.length)];
      }
    }

    if (!rivalArtist) return null;

    const senderId = rivalArtist.id;
    const senderName = rivalArtist.name;
    const avatarColor = rivalArtist.avatarColor || '#EF4444';

    // Si el jugador tiene mucho Hype o un hit reciente, el rival muestra respeto forzado
    const isRespect = player.stats.hype > 70 && Math.random() < 0.6;

    if (isRespect) {
      return {
        id: `phone_rival_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        senderId,
        senderName,
        senderAvatarColor: avatarColor,
        senderAvatarIcon: 'Award',
        category: 'artist',
        sentYear: year,
        sentMonth: month,
        isRead: false,
        text: `Hola ${player.name}. Sé que hemos tenido nuestros roces, pero tengo que ser sincero: lo que hiciste con tu último lanzamiento fue de otro planeta. Respeto donde hay respeto.`,
        choices: [
          {
            label: 'Agradecer con humildad (+15 Afinidad, +10 Respeto, +8 Hype)',
            replyText: 'Gracias bro. La competencia nos hace mejores a todos. Un abrazo.',
            effects: {
              hypeDelta: 8,
              relationshipDelta: { artistId: senderId, delta: 15 },
              newsHeadline: `Paz en la escena: ${senderName} y ${player.name} intercambian gestos de respeto mutuo`
            }
          },
          {
            label: 'Proponerle colaborar a futuro (+25 Afinidad, +15 Hype)',
            replyText: 'Se aprecia de verdad. Capaz más adelante sea hora de juntar los poderes.',
            effects: {
              hypeDelta: 15,
              relationshipDelta: { artistId: senderId, delta: 25 }
            }
          },
          {
            label: 'Responder seco y altanero (-10 Afinidad, +12 Hype)',
            replyText: 'Siempre supe dónde estaba parado. Saludos.',
            effects: {
              hypeDelta: 12,
              relationshipDelta: { artistId: senderId, delta: -10 }
            }
          }
        ]
      };
    } else {
      // Provocación / Taunt
      return {
        id: `phone_rival_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        senderId,
        senderName,
        senderAvatarColor: avatarColor,
        senderAvatarIcon: 'Swords',
        category: 'drama',
        sentYear: year,
        sentMonth: month,
        isRead: false,
        text: `Vi tus números de este mes... parece que el público se aburrió de la misma fórmula de siempre. Si querés te doy un par de tips de cómo hacer música de verdad, fantasma.`,
        choices: [
          {
            label: 'Responder con picardía en Twitter/IG (+25 Hype, -20 Afinidad, Polémica)',
            replyText: 'Preocupate por llenar tu próximo show antes de hablar de mis números.',
            effects: {
              hypeDelta: 25,
              energyDelta: -5,
              relationshipDelta: { artistId: senderId, delta: -20 },
              newsHeadline: `Tensión en redes: Cruce de declaraciones picantes entre ${player.name} y ${senderName}`
            }
          },
          {
            label: 'Clavar visto y responder con música (+5 Disciplina)',
            replyText: '(Leíste el mensaje y decidiste no responder)',
            effects: {
              hypeDelta: 2,
              energyDelta: 2
            }
          }
        ]
      };
    }
  }

  private static generateFamilyMessage(
    player: Artist,
    world: WorldState,
    year: number,
    month: number
  ): ArtistPhoneMessage | null {
    const friendTypes = [
      { name: 'Mamá', color: '#FF2A4B', icon: 'Heart' },
      { name: 'Tomi (Amigo del barrio)', color: '#3B82F6', icon: 'Smile' },
      { name: 'Santi (Amigo de la infancia)', color: '#F59E0B', icon: 'Users' }
    ];
    const picked = friendTypes[Math.floor(Math.random() * friendTypes.length)];

    const senderId = `npc_${picked.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const senderName = picked.name;

    const roll = Math.random();

    if (roll < 0.35) {
      // Pedido de dinero
      const loanAmount = Math.max(1500, Math.floor(player.stats.funds * 0.05));
      return {
        id: `phone_fam_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        senderId,
        senderName,
        senderAvatarColor: picked.color,
        senderAvatarIcon: picked.icon,
        category: 'fan',
        sentYear: year,
        sentMonth: month,
        isRead: false,
        text: `Hola amigo querido, perdón que te joda con esto, pero se me complicó la mano con unos arreglos del auto y el alquiler. ¿Habrá chance de que me prestes $${loanAmount.toLocaleString('es-AR')}? Te lo devuelvo ni bien cobre.`,
        choices: [
          {
            label: `Transferirle sin vueltas (-$${loanAmount.toLocaleString('es-AR')}, +15 Paz mental)`,
            replyText: 'Ya te lo pasé por transferencia amigo, no te preocupes ni me devuelvas nada. Cuidate.',
            effects: {
              fundsDelta: -loanAmount,
              energyDelta: 10
            }
          },
          {
            label: 'Explicar que la plata está en producción (-5 Energía)',
            replyText: 'Perdón amigo, tengo todo el capital comprometido en los videos y las giras. Se me complica ahora.',
            effects: {
              energyDelta: -5
            }
          }
        ]
      };
    } else if (roll < 0.70) {
      // Pedido de entradas VIP
      return {
        id: `phone_fam_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        senderId,
        senderName,
        senderAvatarColor: picked.color,
        senderAvatarIcon: picked.icon,
        category: 'fan',
        sentYear: year,
        sentMonth: month,
        isRead: false,
        text: `¡Qué onda bro! ¿Che, te sobrarán 4 entradas VIP y acceso a camarines para tu próxima fecha? Unos primos míos son re fanáticos y quieren conocerte.`,
        choices: [
          {
            label: 'Anotarlos en la lista de invitados VIP (-$800 costos, +6 Hype)',
            replyText: 'Pasame nombres y DNI que los mando a la lista de producción con pulsera.',
            effects: {
              fundsDelta: -800,
              hypeDelta: 6,
              energyDelta: 4
            }
          },
          {
            label: 'Decir que la lista está completa',
            replyText: 'Uh amigo, la productora me recortó los cupos de invitados al mínimo. No me quedó ni una.',
            effects: {}
          }
        ]
      };
    } else {
      // Mensaje de orgullo y aliento
      return {
        id: `phone_fam_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        senderId,
        senderName,
        senderAvatarColor: picked.color,
        senderAvatarIcon: picked.icon,
        category: 'fan',
        sentYear: year,
        sentMonth: month,
        isRead: false,
        text: `¡Te vi recién en la pantalla gigante del centro y sonaba tu música de fondo! No lo podíamos creer con la familia, nos pusimos a llorar de alegría. Te amamos tanto y estamos tan orgullosos de vos.`,
        choices: [
          {
            label: 'Mandarles un regalo y un abrazo enorme (-$2.000, +22 Energía)',
            replyText: 'Los amo con toda mi alma. Esto es de ustedes también. Les mandé una sorpresa a casa.',
            effects: {
              fundsDelta: -2000,
              energyDelta: 22
            }
          },
          {
            label: 'Agradecer de corazón por audio (+14 Energía)',
            replyText: 'Gracias por estar desde el día uno cuando no había nadie. Los quiero mucho.',
            effects: {
              energyDelta: 14
            }
          }
        ]
      };
    }
  }

  private static generatePressMessage(
    player: Artist,
    world: WorldState,
    year: number,
    month: number
  ): ArtistPhoneMessage | null {
    const pressOutlets = [
      { name: 'Cronista de Rolling Urbana', color: '#06B6D4', icon: 'Newspaper' },
      { name: 'Editor de Billboard Latino', color: '#3B82F6', icon: 'Radio' },
      { name: 'Host de Podcast Trap & Flow', color: '#D4AF37', icon: 'Mic' }
    ];
    const picked = pressOutlets[Math.floor(Math.random() * pressOutlets.length)];

    const senderId = `npc_press_${Math.floor(Math.random() * 1000)}`;
    const senderName = picked.name;

    if (Math.random() < 0.5) {
      return {
        id: `phone_press_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        senderId,
        senderName,
        senderAvatarColor: picked.color,
        senderAvatarIcon: picked.icon,
        category: 'press',
        sentYear: year,
        sentMonth: month,
        isRead: false,
        text: `Hola ${player.name}, acá ${senderName}. Cerramos el número impreso del mes el jueves y tenemos seis páginas reservadas para hablar de tu método en el estudio, con sesión de fotos en rollo de 35mm.`,
        choices: [
          {
            label: 'Aceptar la portada de prensa (+22 Hype, +3.200 Fans, -8 Energía)',
            replyText: 'Excelente propuesta. Mi mánager se pone en contacto para coordinar día de shooting.',
            effects: {
              hypeDelta: 22,
              fansDelta: 3200,
              energyDelta: -8,
              newsHeadline: `${player.name} protagoniza la portada de la prestigiosa revista musical ${senderName}`
            }
          },
          {
            label: 'Rechazar para mantener el enigma y la exclusividad (+4 Credibilidad)',
            replyText: 'Agradezco el interés, pero prefiero que la música hable por mí sin tantas notas.',
            effects: {
              hypeDelta: -2
            }
          }
        ]
      };
    } else {
      return {
        id: `phone_press_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        senderId,
        senderName,
        senderAvatarColor: picked.color,
        senderAvatarIcon: picked.icon,
        category: 'press',
        sentYear: year,
        sentMonth: month,
        isRead: false,
        text: `Está circulando en grupos de WhatsApp un audio tuyo de camarines tirando munición pesada contra varios colegas. Va a salir publicado igual a las seis de la tarde; si querés dejar tu versión en dos líneas, te espero media hora.`,
        choices: [
          {
            label: 'Dar una declaración tajante y desafiante (+28 Hype, -6 Energía, Polémica)',
            replyText: 'Lo que dije en privado lo sostengo en público: muchos le tienen miedo a la verdad.',
            effects: {
              hypeDelta: 28,
              energyDelta: -6,
              newsHeadline: `Filtraciones y polémica: ${player.name} redobla la apuesta tras filtrarse audios comprometedores`
            }
          },
          {
            label: 'Publicar desmentida formal y pacífica (+10 Fans, -$1.000 de prensa)',
            replyText: 'Ese material está sacado de contexto. Mi enfoque siempre estuvo en sumar y construir.',
            effects: {
              fundsDelta: -1000,
              fansDelta: 1500,
              energyDelta: -2
            }
          }
        ]
      };
    }
  }
}
