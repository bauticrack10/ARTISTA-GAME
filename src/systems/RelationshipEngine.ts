import { Artist, ArtistRelationship, EcosystemNPC, BeefState, WorldState, SocialPost } from '../types';
import { SocialFeedEngine } from './SocialFeedEngine';

export class RelationshipEngine {
  /**
   * Inicializa los personajes recurrentes del ecosistema si aún no existen
   */
  static getInitialEcosystemContacts(): Record<string, EcosystemNPC> {
    return {
      npc_beatmaker_barrio: {
        id: 'npc_beatmaker_barrio',
        name: 'Nico Albarracín',
        nickname: 'Nico "808"',
        type: 'beatmaker_barrio',
        roleTitle: 'El Amigo Beatmaker del Barrio',
        avatarGradient: 'from-amber-600 to-stone-800',
        bio: 'Tu amigo de la infancia del barrio. Te prestaba la PC en el monoblock y te armaba las primeras maquetas en FL Studio. Leal a muerte pero sensible a que lo dejen de lado por productores famosos.',
        affinity: 60,
        respect: 75,
        tensionLevel: 0,
        loyalty: 90,
        isEncountered: true,
        history: ['Grabaron sus primeras canciones juntos en el home studio del barrio.']
      },
      npc_manager_chanta: {
        id: 'npc_manager_chanta',
        name: 'Tony Rossi',
        nickname: 'El "Gordo" Tony',
        type: 'manager_chanta',
        roleTitle: 'El Manager Chanta / Ventajero',
        avatarGradient: 'from-yellow-600 via-stone-800 to-zinc-950',
        bio: 'Empresario de la vieja escuela de la noche y boliches. Promete shows con llenos totales y contactos turbios con marcas, pero sus contratos tienen letra chica leonina y adelantos en efectivo de dudosa procedencia.',
        affinity: 10,
        respect: 35,
        tensionLevel: 25,
        loyalty: 20,
        isEncountered: false,
        history: ['Conocido en el circuito nocturno por negociar fechas y adelantos en mano.']
      },
      npc_critico_hater: {
        id: 'npc_critico_hater',
        name: 'Claudio Varela',
        nickname: 'El "Aguafiestas"',
        type: 'critico_hater',
        roleTitle: 'El Crítico Hater / Podcaster Resentido',
        avatarGradient: 'from-zinc-800 to-slate-950',
        bio: 'Periodista snob con un podcast de culto y canal de YouTube. Detesta todo lo que se vuelve masivo en TikTok y disfruta despedazar la música urbana a menos que se le demuestre una técnica lírica irreprochable.',
        affinity: -20,
        respect: 50,
        tensionLevel: 40,
        loyalty: 0,
        isEncountered: true,
        history: ['Publicó críticas mordaces comparando la escena actual con décadas pasadas.']
      },
      npc_rival_escena: {
        id: 'npc_rival_escena',
        name: 'Dante Zero',
        nickname: 'Young Dante',
        type: 'rival_escena',
        roleTitle: 'El Rival Directo de la Escena',
        avatarGradient: 'from-rose-700 via-red-900 to-black',
        bio: 'Trapper arrogante y talentoso de tu misma generación. Compite directamente por los mismos charts, festivales y oyentes. Obsesionado con demostrar que tiene mejores números y no duda en tirar indirectas en redes.',
        affinity: -35,
        respect: 65,
        tensionLevel: 55,
        loyalty: 0,
        isEncountered: true,
        history: ['Rivalidad generacional nacida en las primeras fechas del circuito underground.']
      }
    };
  }

  static getOrCreateRelationship(artist: Artist, targetArtistId: string): ArtistRelationship {
    if (!artist.relationships[targetArtistId]) {
      artist.relationships[targetArtistId] = {
        targetArtistId,
        relationType: 'neutral',
        affinity: 0,
        respect: 50,
        pastCollabsCount: 0,
        history: []
      };
    }
    return artist.relationships[targetArtistId];
  }

  static modifyRelationship(
    sourceArtist: Artist,
    targetArtist: Artist,
    affinityDelta: number,
    respectDelta: number,
    newRelationType?: ArtistRelationship['relationType'],
    historyNote?: string
  ): void {
    const relA = this.getOrCreateRelationship(sourceArtist, targetArtist.id);
    const relB = this.getOrCreateRelationship(targetArtist, sourceArtist.id);

    relA.affinity = Math.max(-100, Math.min(100, relA.affinity + affinityDelta));
    relA.respect = Math.max(0, Math.min(100, relA.respect + respectDelta));
    if (newRelationType) relA.relationType = newRelationType;
    if (historyNote) relA.history.push(historyNote);

    relB.affinity = Math.max(-100, Math.min(100, relB.affinity + affinityDelta));
    relB.respect = Math.max(0, Math.min(100, relB.respect + respectDelta));
    if (newRelationType) relB.relationType = newRelationType;
    if (historyNote) relB.history.push(historyNote);
  }

  /**
   * Modifica atributos del NPC del ecosistema
   */
  static modifyEcosystemNPC(
    world: WorldState,
    npcId: string,
    deltas: {
      affinity?: number;
      respect?: number;
      tension?: number;
      loyalty?: number;
      historyNote?: string;
    }
  ): EcosystemNPC | null {
    if (!world.ecosystemContacts) {
      world.ecosystemContacts = this.getInitialEcosystemContacts();
    }
    const npc = world.ecosystemContacts[npcId];
    if (!npc) return null;

    if (deltas.affinity !== undefined) npc.affinity = Math.max(-100, Math.min(100, npc.affinity + deltas.affinity));
    if (deltas.respect !== undefined) npc.respect = Math.max(0, Math.min(100, npc.respect + deltas.respect));
    if (deltas.tension !== undefined) npc.tensionLevel = Math.max(0, Math.min(100, npc.tensionLevel + deltas.tension));
    if (deltas.loyalty !== undefined) npc.loyalty = Math.max(0, Math.min(100, npc.loyalty + deltas.loyalty));
    if (deltas.historyNote) npc.history.push(deltas.historyNote);

    return npc;
  }

  /**
   * Procesa la respuesta del jugador ante una provocación o beef
   */
  static processBeefInteraction(
    player: Artist,
    targetName: string,
    targetId: string,
    action: 'respond_social' | 'drop_diss' | 'ignore',
    world: WorldState
  ): {
    outcomeText: string;
    hypeChange: number;
    disciplineChange: number;
    credibilityChange: number;
    energyChange: number;
    newBeefStage?: BeefState['stage'];
    socialPosts: SocialPost[];
  } {
    if (!world.activeBeefs) world.activeBeefs = {};

    let hypeChange = 0;
    let disciplineChange = 0;
    let credibilityChange = 0;
    let energyChange = 0;
    let outcomeText = '';
    let newBeefStage: BeefState['stage'] = 'tension';

    if (action === 'respond_social') {
      hypeChange = 22;
      disciplineChange = -3;
      credibilityChange = -1;
      newBeefStage = 'social_beef';
      outcomeText = `Respondiste públicamente a ${targetName} en redes con capturas y declaraciones afiladas. El hype se disparó (+22 Hype), pero la escena debate si caíste en una provocación barata.`;
    } else if (action === 'drop_diss') {
      hypeChange = 42;
      energyChange = -15;
      credibilityChange = 4;
      disciplineChange = 2;
      newBeefStage = 'diss_tracks';
      outcomeText = `Te encerraste en el estudio y grabaste una tiradera demoledora contra ${targetName}. El tema se convirtió en tendencia absoluta (#1 en redes) y desató una guerra abierta de barras (+42 Hype, -15 Energía).`;
    } else if (action === 'ignore') {
      hypeChange = -5;
      disciplineChange = 5;
      credibilityChange = 5;
      newBeefStage = 'settled';
      outcomeText = `Decidiste no darle entidad ni tribuna a ${targetName}. Mantuviste la disciplina (+5 Disciplina, +5 Credibilidad) y dejaste que las provocaciones murieran solas sin alimentarlas.`;
    }

    // Actualizar o crear Beef State
    const beefId = `beef_${targetId}`;
    world.activeBeefs[beefId] = {
      id: beefId,
      targetId,
      targetName,
      stage: newBeefStage,
      hypeMultiplier: action === 'drop_diss' ? 1.5 : action === 'respond_social' ? 1.2 : 1.0,
      turnsActive: (world.activeBeefs[beefId]?.turnsActive || 0) + 1,
      lastActionDescription: outcomeText,
      playerWon: action === 'drop_diss' ? true : undefined
    };

    // Generar reacciones en redes
    const socialPosts = SocialFeedEngine.generateBeefPosts(world, player, targetName, action);
    if (!world.socialFeed) world.socialFeed = [];
    world.socialFeed.unshift(...socialPosts);

    return {
      outcomeText,
      hypeChange,
      disciplineChange,
      credibilityChange,
      energyChange,
      newBeefStage,
      socialPosts
    };
  }

  static calculateCollabFeasibility(
    requester: Artist,
    target: Artist,
    offeredCutPercentage: number = 50
  ): { willAccept: boolean; reason: string; successBoost: number } {
    const rel = requester.relationships[target.id] || {
      targetArtistId: target.id,
      relationType: 'neutral',
      affinity: 0,
      respect: 50,
      pastCollabsCount: 0,
      history: []
    };
    const popDiff = target.stats.popularity - requester.stats.popularity;

    // Base score from target's sociability, affinity and respect
    let score = target.personality.sociability * 0.3 + (rel.affinity + 100) * 0.25 + (rel.respect) * 0.25;

    // Penalty if requester is vastly less popular unless target is generous or high affinity
    if (popDiff > 25) {
      score -= (popDiff * 1.2);
    } else if (popDiff < -10) {
      score += 15; // Target loves collaborating with bigger artists
    }

    if (rel.relationType === 'feud') {
      return { willAccept: false, reason: `${target.name} tiene un feudo abierto con vos y rechazó la propuesta tajantemente.`, successBoost: 0 };
    }

    if (score >= 45) {
      const chemistry = ((requester.personality.creativity + target.personality.creativity) / 200) * 20;
      return {
        willAccept: true,
        reason: `${target.name} aceptó la colaboración entusiasmado por la propuesta sonora.`,
        successBoost: Math.floor(chemistry)
      };
    } else {
      return {
        willAccept: false,
        reason: `${target.name} consideró que sus agendas o visiones artísticas no coinciden en este momento.`,
        successBoost: 0
      };
    }
  }
}
