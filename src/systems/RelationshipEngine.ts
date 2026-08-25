import { Artist, ArtistRelationship } from '../types';

export class RelationshipEngine {
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

    // Base score from target's sociability and affinity
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
