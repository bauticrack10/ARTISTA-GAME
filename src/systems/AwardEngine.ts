import { Artist, Song, Album, Producer, AwardCeremony, AwardCategory, WorldState } from '../types';

export class AwardEngine {
  static conductAnnualAwards(
    world: WorldState,
    year: number
  ): {
    ceremony: AwardCeremony;
    awardNews: Array<{ headline: string; body: string; relatedArtistId: string }>;
  } {
    const awardNews: Array<{ headline: string; body: string; relatedArtistId: string }> = [];
    const categories: AwardCategory[] = [];

    const activeArtists = Object.values(world.artists).filter(a => !a.isRetired);
    const yearSongs = Object.values(world.songs).filter(s => s.releaseYear === year);
    const yearAlbums = Object.values(world.albums).filter(a => a.releaseYear === year);

    // 1. Artista del Año
    const sortedArtists = [...activeArtists].sort((a, b) => b.stats.popularity - a.stats.popularity);
    const artistNominees = sortedArtists.slice(0, 5).map(a => a.id);
    const winnerArtistId = artistNominees[0] || (activeArtists[0]?.id ?? '');

    categories.push({
      id: `award_artist_of_year_${year}`,
      name: 'Artista del Año',
      nomineeArtistIds: artistNominees,
      winnerArtistId
    });

    if (world.artists[winnerArtistId]) {
      world.artists[winnerArtistId].awardsWon.push(`Artista del Año (${year})`);
      world.artists[winnerArtistId].legacyScore = Math.min(100, world.artists[winnerArtistId].legacyScore + 4);
      awardNews.push({
        headline: `Premios Pulso ${year}: ${world.artists[winnerArtistId].name} es coronado Artista del Año`,
        body: `Una gala inolvidable donde se consagró el impacto y dominio cultural de ${world.artists[winnerArtistId].name}.`,
        relatedArtistId: winnerArtistId
      });
    }

    // 2. Canción del Año
    const sortedSongs = [...yearSongs].sort((a, b) => b.streamsTotal - a.streamsTotal);
    const songNominees = sortedSongs.slice(0, 5);
    const winningSong = songNominees[0];

    if (winningSong) {
      categories.push({
        id: `award_song_of_year_${year}`,
        name: 'Canción del Año',
        nomineeArtistIds: songNominees.map(s => s.artistId),
        nomineeItemIds: songNominees.map(s => s.id),
        winnerArtistId: winningSong.artistId,
        winnerItemId: winningSong.id
      });

      if (world.artists[winningSong.artistId]) {
        world.artists[winningSong.artistId].awardsWon.push(`Canción del Año: "${winningSong.title}" (${year})`);
        world.artists[winningSong.artistId].legacyScore = Math.min(100, world.artists[winningSong.artistId].legacyScore + 3);
        awardNews.push({
          headline: `"${winningSong.title}" gana el premio a Canción del Año (${year})`,
          body: `El hit de ${world.artists[winningSong.artistId].name} fue reconocido unánimemente por su calidad y trascendencia.`,
          relatedArtistId: winningSong.artistId
        });
      }
    }

    // 3. Álbum del Año
    const sortedAlbums = [...yearAlbums].sort((a, b) => (b.criticalScore + b.commercialScore) - (a.criticalScore + a.commercialScore));
    const albumNominees = sortedAlbums.slice(0, 5);
    const winningAlbum = albumNominees[0];

    if (winningAlbum) {
      categories.push({
        id: `award_album_of_year_${year}`,
        name: 'Álbum del Año',
        nomineeArtistIds: albumNominees.map(a => a.artistId),
        nomineeItemIds: albumNominees.map(a => a.id),
        winnerArtistId: winningAlbum.artistId,
        winnerItemId: winningAlbum.id
      });

      if (world.artists[winningAlbum.artistId]) {
        world.artists[winningAlbum.artistId].awardsWon.push(`Álbum del Año: "${winningAlbum.title}" (${year})`);
        world.artists[winningAlbum.artistId].legacyScore = Math.min(100, world.artists[winningAlbum.artistId].legacyScore + 4);
      }
    }

    // 4. Mejor Nuevo Artista (Breakout / Emerging)
    const newArtists = activeArtists.filter(a => (year - a.careerStartYear) <= 2);
    if (newArtists.length > 0) {
      const sortedNew = [...newArtists].sort((a, b) => b.stats.popularity - a.stats.popularity);
      const newNominees = sortedNew.slice(0, 5).map(a => a.id);
      const winnerNewId = newNominees[0];

      categories.push({
        id: `award_best_new_artist_${year}`,
        name: 'Mejor Nuevo Artista',
        nomineeArtistIds: newNominees,
        winnerArtistId: winnerNewId
      });

      if (world.artists[winnerNewId]) {
        world.artists[winnerNewId].awardsWon.push(`Mejor Nuevo Artista (${year})`);
        world.artists[winnerNewId].legacyScore = Math.min(100, world.artists[winnerNewId].legacyScore + 3);
        awardNews.push({
          headline: `${world.artists[winnerNewId].name} gana el galardón a Revelación / Mejor Nuevo Artista`,
          body: `El ascenso meteórico de ${world.artists[winnerNewId].name} es sellado con el máximo reconocimiento para debutantes.`,
          relatedArtistId: winnerNewId
        });
      }
    }

    const ceremony: AwardCeremony = {
      year,
      name: `Gala Anual de Premios de la Música ${year}`,
      categories
    };

    return { ceremony, awardNews };
  }
}
