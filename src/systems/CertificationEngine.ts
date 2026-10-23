import { Song, Album, Artist, WorldState, OfficialCertification, CertificationTier } from '../types';

export interface CertificationCheckResult {
  newCertifications: OfficialCertification[];
  newsItems: Array<{ headline: string; body: string; relatedArtistId: string }>;
}

export class CertificationEngine {
  // Official thresholds in accordance with global streaming & sales standards
  static SINGLE_THRESHOLDS: Array<{ tier: CertificationTier; multiplier?: number; minStreams: number; label: string }> = [
    { tier: 'diamond', minStreams: 10000000, label: 'Disco de Diamante (10.000.000+ Streams)' },
    { tier: 'multi_platinum', multiplier: 3, minStreams: 3000000, label: 'Triple Disco de Platino (3.000.000+ Streams)' },
    { tier: 'multi_platinum', multiplier: 2, minStreams: 2000000, label: 'Doble Disco de Platino (2.000.000+ Streams)' },
    { tier: 'platinum', multiplier: 1, minStreams: 1000000, label: 'Disco de Platino (1.000.000+ Streams)' },
    { tier: 'gold', minStreams: 500000, label: 'Disco de Oro (500.000+ Streams)' }
  ];

  static ALBUM_THRESHOLDS: Array<{ tier: CertificationTier; multiplier?: number; minUnits: number; label: string }> = [
    { tier: 'diamond', minUnits: 1000000, label: 'Disco de Diamante (1.000.000+ Unidades Equivalentes)' },
    { tier: 'multi_platinum', multiplier: 2, minUnits: 200000, label: 'Multi-Platino (200.000+ Unidades Equivalentes)' },
    { tier: 'platinum', multiplier: 1, minUnits: 100000, label: 'Disco de Platino (100.000+ Unidades Equivalentes)' },
    { tier: 'gold', minUnits: 50000, label: 'Disco de Oro (50.000+ Unidades Equivalentes)' }
  ];

  /**
   * Evaluates all songs and albums in the world, granting official plaques when thresholds are passed.
   */
  static evaluateCertifications(world: WorldState): CertificationCheckResult {
    const newCertifications: OfficialCertification[] = [];
    const newsItems: Array<{ headline: string; body: string; relatedArtistId: string }> = [];

    const songs = Object.values(world.songs || {});
    const albums = Object.values(world.albums || {});

    // 1. Evaluate Singles / Songs
    for (const song of songs) {
      if (!song || !song.id || !song.streamsTotal) continue;
      if (!song.certifications) song.certifications = [];

      for (const th of this.SINGLE_THRESHOLDS) {
        if (song.streamsTotal >= th.minStreams) {
          // Check if already awarded
          const alreadyHas = song.certifications.some(
            c => c.tier === th.tier && (th.multiplier === undefined || c.multiplier === th.multiplier)
          );

          if (!alreadyHas) {
            const certId = `cert_${song.id}_${th.tier}_${th.multiplier || 1}`;
            const cert: OfficialCertification = {
              id: certId,
              targetId: song.id,
              targetTitle: song.title,
              targetType: 'single',
              tier: th.tier,
              multiplier: th.multiplier,
              unitsAchieved: song.streamsTotal,
              year: world.currentYear,
              month: world.currentMonth,
              label: th.label
            };

            song.certifications.push(cert);
            newCertifications.push(cert);

            // Register in Artist record
            const artist = world.artists[song.artistId];
            if (artist) {
              if (!artist.officialCertifications) artist.officialCertifications = [];
              artist.officialCertifications.push(cert);

              // Headline for World News
              const iconEmoji = th.tier === 'diamond' ? '💎' : th.tier === 'platinum' || th.tier === 'multi_platinum' ? '💿' : '📀';
              const headline = `${iconEmoji} ¡${th.label.toUpperCase()}! "${song.title}" de ${artist.name}`;
              const body = `La entidad certificadora oficial de la industria ha otorgado la placa de ${th.label} a "${song.title}" tras superar ${(song.streamsTotal).toLocaleString('es-AR')} reproducciones globales.`;

              newsItems.push({
                headline,
                body,
                relatedArtistId: artist.id
              });
            }
          }
        }
      }
    }

    // 2. Evaluate Albums
    for (const album of albums) {
      if (!album || !album.id) continue;
      if (!album.certifications) album.certifications = [];

      // Calculate equivalent units: Pure first-week / career sales + (Streams / 1500)
      const equivalentUnits = (album.firstWeekSales || 0) + Math.floor((album.totalStreams || 0) / 1500);

      for (const th of this.ALBUM_THRESHOLDS) {
        if (equivalentUnits >= th.minUnits) {
          const alreadyHas = album.certifications.some(
            c => c.tier === th.tier && (th.multiplier === undefined || c.multiplier === th.multiplier)
          );

          if (!alreadyHas) {
            const certId = `cert_${album.id}_${th.tier}_${th.multiplier || 1}`;
            const cert: OfficialCertification = {
              id: certId,
              targetId: album.id,
              targetTitle: album.title,
              targetType: 'album',
              tier: th.tier,
              multiplier: th.multiplier,
              unitsAchieved: equivalentUnits,
              year: world.currentYear,
              month: world.currentMonth,
              label: th.label
            };

            album.certifications.push(cert);
            newCertifications.push(cert);

            const artist = world.artists[album.artistId];
            if (artist) {
              if (!artist.officialCertifications) artist.officialCertifications = [];
              artist.officialCertifications.push(cert);

              const iconEmoji = th.tier === 'diamond' ? '💎' : th.tier === 'platinum' || th.tier === 'multi_platinum' ? '💿' : '📀';
              const headline = `${iconEmoji} ¡ÁLBUM DE ${th.tier.toUpperCase()}! "${album.title}" de ${artist.name}`;
              const body = `El álbum "${album.title}" alcanza oficialmente el estatus de ${th.label} con ${equivalentUnits.toLocaleString('es-AR')} unidades equivalentes certificadas.`;

              newsItems.push({
                headline,
                body,
                relatedArtistId: artist.id
              });
            }
          }
        }
      }
    }

    return {
      newCertifications,
      newsItems
    };
  }

  /**
   * Returns metallic color schemes for analog plaques based on design.md
   */
  static getCertificationStyling(tier: CertificationTier, multiplier?: number): {
    badgeClass: string;
    frameClass: string;
    textColor: string;
    iconColor: string;
    displayName: string;
  } {
    switch (tier) {
      case 'diamond':
        return {
          badgeClass: 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/40',
          frameClass: 'border-l-4 border-l-[#38BDF8] bg-linear-to-r from-[#38BDF8]/10 to-transparent',
          textColor: 'text-[#38BDF8]',
          iconColor: '#38BDF8',
          displayName: 'Disco de Diamante'
        };
      case 'multi_platinum':
        return {
          badgeClass: 'bg-[#E2E8F0]/15 text-[#E2E8F0] border-[#E2E8F0]/40',
          frameClass: 'border-l-4 border-l-[#E2E8F0] bg-linear-to-r from-[#E2E8F0]/10 to-transparent',
          textColor: 'text-[#E2E8F0]',
          iconColor: '#E2E8F0',
          displayName: `${multiplier || 2}x Platino`
        };
      case 'platinum':
        return {
          badgeClass: 'bg-[#E2E8F0]/10 text-[#E2E8F0] border-[#E2E8F0]/30',
          frameClass: 'border-l-4 border-l-[#E2E8F0] bg-[#141417]',
          textColor: 'text-[#E2E8F0]',
          iconColor: '#E2E8F0',
          displayName: 'Disco de Platino'
        };
      case 'gold':
      default:
        return {
          badgeClass: 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40',
          frameClass: 'border-l-4 border-l-[#D4AF37] bg-linear-to-r from-[#D4AF37]/10 to-transparent',
          textColor: 'text-[#D4AF37]',
          iconColor: '#D4AF37',
          displayName: 'Disco de Oro'
        };
    }
  }
}
