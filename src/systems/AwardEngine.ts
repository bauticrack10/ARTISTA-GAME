import {
  Artist,
  Song,
  Album,
  Producer,
  AwardCeremony,
  AwardCategory,
  AwardNominee,
  WorldState
} from '../types';

export class AwardEngine {
  static conductAnnualAwards(
    world: WorldState,
    year: number
  ): {
    ceremony: AwardCeremony;
    awardNews: Array<{ headline: string; body: string; relatedArtistId: string }>;
    playerWonAny: boolean;
  } {
    const awardNews: Array<{ headline: string; body: string; relatedArtistId: string }> = [];
    const categories: AwardCategory[] = [];

    const activeArtists = Object.values(world.artists).filter(a => !a.isRetired);
    const player = Object.values(world.artists).find(a => a.isPlayer) || activeArtists[0];
    const playerId = player?.id || '';

    // Filter releases belonging to this year (or fallback to recent if sparse)
    const yearSongs = Object.values(world.songs).filter(s => s.releaseYear === year);
    const recentSongs = yearSongs.length >= 5 ? yearSongs : Object.values(world.songs);

    const yearAlbums = Object.values(world.albums).filter(a => a.releaseYear === year);
    const recentAlbums = yearAlbums.length >= 5 ? yearAlbums : Object.values(world.albums);

    let playerTotalNominations = 0;
    let playerTotalWins = 0;

    // ==========================================
    // 1. ARTISTA DEL AÑO
    // ==========================================
    const artistScores = activeArtists.map(artist => {
      const artistSongsInYear = Object.values(world.songs).filter(s => s.artistId === artist.id && s.releaseYear === year);
      const artistAlbumsInYear = Object.values(world.albums).filter(a => a.artistId === artist.id && a.releaseYear === year);

      const streamScore = Math.min(35, (artist.stats.totalStreams / 200000000) * 35);
      const popScore = artist.stats.popularity * 0.35;
      const prestigeScore = (artist.stats.artisticCredibility + artist.stats.reputation) * 0.15;
      const activityBonus = (artistSongsInYear.length * 3) + (artistAlbumsInYear.length * 6);
      const randomVariance = Math.random() * 5;

      const totalScore = Math.round(streamScore + popScore + prestigeScore + activityBonus + randomVariance);

      return {
        artist,
        score: totalScore,
        highlightText: `${artist.stats.popularity} Pop • ${(artist.stats.monthlyListeners / 1000000).toFixed(1)}M oyentes • ${artist.careerStage}`
      };
    });

    artistScores.sort((a, b) => b.score - a.score);
    const topArtistCandidates = artistScores.slice(0, 5);

    const artistNominees: AwardNominee[] = topArtistCandidates.map(c => ({
      artistId: c.artist.id,
      artistName: c.artist.name,
      score: c.score,
      highlightText: c.highlightText,
      isPlayer: c.artist.id === playerId
    }));

    const winningArtistCandidate = topArtistCandidates[0] || { artist: activeArtists[0], score: 100, highlightText: '' };
    const winnerArtistId = winningArtistCandidate.artist.id;
    const winnerArtistName = winningArtistCandidate.artist.name;
    const isPlayerWinnerArtist = winnerArtistId === playerId;
    const isPlayerNominatedArtist = artistNominees.some(n => n.isPlayer);

    if (isPlayerNominatedArtist) playerTotalNominations++;
    if (isPlayerWinnerArtist) playerTotalWins++;

    categories.push({
      id: `award_artist_of_year_${year}`,
      name: 'Artista del Año',
      description: 'El máximo reconocimiento al artista con mayor impacto cultural, dominio comercial y excelencia musical del año.',
      iconName: 'Crown',
      nominees: artistNominees,
      nomineeArtistIds: artistNominees.map(n => n.artistId),
      winnerArtistId,
      winnerArtistName,
      winnerReason: `Por su consagración y arrollador dominio de la industria y la escena durante ${year}.`,
      playerWon: isPlayerWinnerArtist,
      playerNominated: isPlayerNominatedArtist
    });

    if (world.artists[winnerArtistId]) {
      world.artists[winnerArtistId].awardsWon.push(`Artista del Año (${year})`);
      world.artists[winnerArtistId].legacyScore = Math.min(100, world.artists[winnerArtistId].legacyScore + 5);
      if (isPlayerWinnerArtist) {
        world.artists[winnerArtistId].stats.hype = Math.min(100, world.artists[winnerArtistId].stats.hype + 30);
        world.artists[winnerArtistId].stats.reputation = Math.min(100, world.artists[winnerArtistId].stats.reputation + 8);
        world.artists[winnerArtistId].stats.artisticCredibility = Math.min(100, world.artists[winnerArtistId].stats.artisticCredibility + 6);
      }
      awardNews.push({
        headline: `Premios de la Música ${year}: ${winnerArtistName} es coronado Artista del Año`,
        body: `Una gala inolvidable donde la academia musical galardonó el trascendente año y dominio de ${winnerArtistName}.`,
        relatedArtistId: winnerArtistId
      });
    }

    // ==========================================
    // 2. CANCIÓN DEL AÑO
    // ==========================================
    const songScores = recentSongs.map(song => {
      const art = world.artists[song.artistId];
      const isSongInYear = song.releaseYear === year;
      const streamScore = Math.min(45, (song.streamsTotal / 40000000) * 45);
      const qualityScore = song.quality * 0.25;
      const commercialScore = song.commercialAppeal * 0.20;
      const chartBonus = song.peakPosition?.Global === 1 ? 12 : (song.peakPosition?.Global ?? 99) <= 10 ? 6 : 0;
      const recBonus = song.receptionRating * 3;
      const yearBonus = isSongInYear ? 10 : 0;
      const randomVariance = Math.random() * 4;

      const totalScore = Math.round(streamScore + qualityScore + commercialScore + chartBonus + recBonus + yearBonus + randomVariance);

      return {
        song,
        artist: art,
        score: totalScore,
        highlightText: `${(song.streamsTotal / 1000000).toFixed(1)}M reproducciones • Calidad ${song.quality}/100 • Pico #${song.peakPosition?.Global || '-'}`
      };
    });

    songScores.sort((a, b) => b.score - a.score);
    const topSongCandidates = songScores.slice(0, 5);

    const songNominees: AwardNominee[] = topSongCandidates.map(c => ({
      artistId: c.song.artistId,
      artistName: c.artist?.name || 'Artista',
      itemId: c.song.id,
      itemTitle: c.song.title,
      score: c.score,
      highlightText: c.highlightText,
      isPlayer: c.song.artistId === playerId
    }));

    const winningSongCandidate = topSongCandidates[0];
    if (winningSongCandidate) {
      const winningSong = winningSongCandidate.song;
      const songArtist = world.artists[winningSong.artistId];
      const isPlayerSongWinner = winningSong.artistId === playerId;
      const isPlayerSongNominated = songNominees.some(n => n.isPlayer);

      if (isPlayerSongNominated) playerTotalNominations++;
      if (isPlayerSongWinner) playerTotalWins++;

      categories.push({
        id: `award_song_of_year_${year}`,
        name: 'Canción del Año',
        description: 'Premia la composición, calidad sonora y resonancia masiva del sencillo más destacado.',
        iconName: 'Disc3',
        nominees: songNominees,
        nomineeArtistIds: songNominees.map(n => n.artistId),
        nomineeItemIds: songNominees.map(n => n.itemId || ''),
        winnerArtistId: winningSong.artistId,
        winnerArtistName: songArtist?.name || 'Artista',
        winnerItemId: winningSong.id,
        winnerItemTitle: winningSong.title,
        winnerReason: `Por su brillante calidad de producción y alcance multitudinario con "${winningSong.title}".`,
        playerWon: isPlayerSongWinner,
        playerNominated: isPlayerSongNominated
      });

      if (songArtist) {
        songArtist.awardsWon.push(`Canción del Año: "${winningSong.title}" (${year})`);
        songArtist.legacyScore = Math.min(100, songArtist.legacyScore + 4);
        if (isPlayerSongWinner) {
          songArtist.stats.hype = Math.min(100, songArtist.stats.hype + 25);
          songArtist.stats.reputation = Math.min(100, songArtist.stats.reputation + 7);
        }
        awardNews.push({
          headline: `"${winningSong.title}" gana Canción del Año en los Premios Anuales ${year}`,
          body: `El tema de ${songArtist.name} fue galardonado por unanimidad como la pieza musical definitiva de la temporada.`,
          relatedArtistId: winningSong.artistId
        });
      }
    }

    // ==========================================
    // 3. ÁLBUM DEL AÑO
    // ==========================================
    const albumScores = recentAlbums.map(album => {
      const art = world.artists[album.artistId];
      const isAlbumInYear = album.releaseYear === year;
      const critScore = album.criticalScore * 0.40;
      const commScore = album.commercialScore * 0.25;
      const salesScore = Math.min(20, (album.firstWeekSales / 30000) * 20);
      const streamScore = Math.min(15, (album.totalStreams / 50000000) * 15);
      const yearBonus = isAlbumInYear ? 12 : 0;
      const randomVariance = Math.random() * 4;

      const totalScore = Math.round(critScore + commScore + salesScore + streamScore + yearBonus + randomVariance);

      return {
        album,
        artist: art,
        score: totalScore,
        highlightText: `Crítica ${album.criticalScore}/100 • ${album.firstWeekSales.toLocaleString()} ventas debut • ${album.songIds.length} tracks`
      };
    });

    albumScores.sort((a, b) => b.score - a.score);
    const topAlbumCandidates = albumScores.slice(0, 5);

    const albumNominees: AwardNominee[] = topAlbumCandidates.map(c => ({
      artistId: c.album.artistId,
      artistName: c.artist?.name || 'Artista',
      itemId: c.album.id,
      itemTitle: c.album.title,
      score: c.score,
      highlightText: c.highlightText,
      isPlayer: c.album.artistId === playerId
    }));

    const winningAlbumCandidate = topAlbumCandidates[0];
    if (winningAlbumCandidate) {
      const winningAlbum = winningAlbumCandidate.album;
      const albumArtist = world.artists[winningAlbum.artistId];
      const isPlayerAlbumWinner = winningAlbum.artistId === playerId;
      const isPlayerAlbumNominated = albumNominees.some(n => n.isPlayer);

      if (isPlayerAlbumNominated) playerTotalNominations++;
      if (isPlayerAlbumWinner) playerTotalWins++;

      categories.push({
        id: `award_album_of_year_${year}`,
        name: 'Álbum del Año',
        description: 'La estatuilla más prestigiosa para la obra discográfica completa más cohesiva, aclamada y trascendente.',
        iconName: 'Trophy',
        nominees: albumNominees,
        nomineeArtistIds: albumNominees.map(n => n.artistId),
        nomineeItemIds: albumNominees.map(n => n.itemId || ''),
        winnerArtistId: winningAlbum.artistId,
        winnerArtistName: albumArtist?.name || 'Artista',
        winnerItemId: winningAlbum.id,
        winnerItemTitle: winningAlbum.title,
        winnerReason: `Por su maestría conceptual, narrativa y solidez musical en "${winningAlbum.title}".`,
        playerWon: isPlayerAlbumWinner,
        playerNominated: isPlayerAlbumNominated
      });

      if (albumArtist) {
        albumArtist.awardsWon.push(`Álbum del Año: "${winningAlbum.title}" (${year})`);
        albumArtist.legacyScore = Math.min(100, albumArtist.legacyScore + 5);
        if (isPlayerAlbumWinner) {
          albumArtist.stats.hype = Math.min(100, albumArtist.stats.hype + 35);
          albumArtist.stats.artisticCredibility = Math.min(100, albumArtist.stats.artisticCredibility + 10);
          albumArtist.stats.reputation = Math.min(100, albumArtist.stats.reputation + 8);
        }
        awardNews.push({
          headline: `"${winningAlbum.title}" de ${albumArtist.name} se alza con el Álbum del Año (${year})`,
          body: `Una obra cumbre que conquistó a la crítica especializada y acumuló millones de oyentes.`,
          relatedArtistId: winningAlbum.artistId
        });
      }
    }

    // ==========================================
    // 4. MEJOR NUEVO ARTISTA (Breakout / Emerging)
    // ==========================================
    let newArtistCandidates = activeArtists.filter(a => (year - a.careerStartYear) <= 2);
    if (newArtistCandidates.length < 5) {
      newArtistCandidates = activeArtists.filter(a => (year - a.careerStartYear) <= 3);
    }
    if (newArtistCandidates.length < 5) {
      newArtistCandidates = activeArtists.filter(a => a.careerStage === 'Underground' || a.careerStage === 'Emerging' || a.careerStage === 'Breakout');
    }

    const newScores = newArtistCandidates.map(artist => {
      const popScore = artist.stats.popularity * 0.40;
      const skillScore = artist.personality.skill * 0.25;
      const credScore = artist.stats.artisticCredibility * 0.20;
      const streamScore = Math.min(15, (artist.stats.totalStreams / 10000000) * 15);
      const randomVariance = Math.random() * 5;

      const totalScore = Math.round(popScore + skillScore + credScore + streamScore + randomVariance);

      return {
        artist,
        score: totalScore,
        highlightText: `Debut ${artist.careerStartYear} • Pop ${artist.stats.popularity} • ${(artist.stats.monthlyListeners / 1000).toFixed(0)}k oyentes`
      };
    });

    newScores.sort((a, b) => b.score - a.score);
    const topNewCandidates = newScores.slice(0, 5);

    const newNominees: AwardNominee[] = topNewCandidates.map(c => ({
      artistId: c.artist.id,
      artistName: c.artist.name,
      score: c.score,
      highlightText: c.highlightText,
      isPlayer: c.artist.id === playerId
    }));

    const winningNewCandidate = topNewCandidates[0] || { artist: activeArtists[0], score: 100, highlightText: '' };
    const winnerNewId = winningNewCandidate.artist.id;
    const winnerNewName = winningNewCandidate.artist.name;
    const isPlayerNewWinner = winnerNewId === playerId;
    const isPlayerNewNominated = newNominees.some(n => n.isPlayer);

    if (isPlayerNewNominated) playerTotalNominations++;
    if (isPlayerNewWinner) playerTotalWins++;

    categories.push({
      id: `award_best_new_artist_${year}`,
      name: 'Mejor Nuevo Artista',
      description: 'El galardón a la revelación más prometedora y de mayor impacto que irrumpió en la escena.',
      iconName: 'Sparkles',
      nominees: newNominees,
      nomineeArtistIds: newNominees.map(n => n.artistId),
      winnerArtistId: winnerNewId,
      winnerArtistName: winnerNewName,
      winnerReason: `Por su vertiginosa irrupción y aporte de aire fresco al panorama musical.`,
      playerWon: isPlayerNewWinner,
      playerNominated: isPlayerNewNominated
    });

    if (world.artists[winnerNewId]) {
      world.artists[winnerNewId].awardsWon.push(`Mejor Nuevo Artista (${year})`);
      world.artists[winnerNewId].legacyScore = Math.min(100, world.artists[winnerNewId].legacyScore + 4);
      if (isPlayerNewWinner) {
        world.artists[winnerNewId].stats.hype = Math.min(100, world.artists[winnerNewId].stats.hype + 30);
        world.artists[winnerNewId].stats.reputation = Math.min(100, world.artists[winnerNewId].stats.reputation + 10);
      }
      awardNews.push({
        headline: `${winnerNewName} gana el galardón a Mejor Nuevo Artista / Revelación (${year})`,
        body: `El reconocimiento unánime de la industria a la nueva gran promesa de la música contemporánea.`,
        relatedArtistId: winnerNewId
      });
    }

    // ==========================================
    // 5. MEJOR PRODUCCIÓN
    // ==========================================
    const prodItems = [...recentSongs, ...recentAlbums];
    const productionScores = prodItems.map(item => {
      const isSong = 'quality' in item;
      const songItem = isSong ? (item as Song) : null;
      const albumItem = !isSong ? (item as Album) : null;
      const art = world.artists[item.artistId];

      const producerId = songItem?.producerId || albumItem?.producerId;
      const producer = producerId ? world.producers[producerId] : undefined;
      const producerName = producer ? producer.name : (art ? `Producción de ${art.name}` : 'Producción Independiente');

      const qualityVal = songItem ? songItem.quality : (albumItem ? albumItem.criticalScore : 70);
      const originalityVal = songItem ? songItem.originality : (albumItem ? albumItem.commercialScore * 0.8 : 70);
      const producerBoost = producer ? producer.qualityBoost * 2 + producer.reputation * 0.15 : 10;
      const budgetVal = albumItem?.productionBudget ? Math.min(15, (albumItem.productionBudget / 10000) * 15) : 8;
      const randomVariance = Math.random() * 5;

      const totalScore = Math.round(qualityVal * 0.45 + originalityVal * 0.25 + producerBoost + budgetVal + randomVariance);

      return {
        item,
        isSong,
        title: item.title,
        artist: art,
        producerId,
        producerName,
        score: totalScore,
        highlightText: `Productor: ${producerName} • Calidad de Mezcla: ${qualityVal}/100`
      };
    });

    productionScores.sort((a, b) => b.score - a.score);
    const topProdCandidates = productionScores.slice(0, 5);

    const prodNominees: AwardNominee[] = topProdCandidates.map(c => ({
      artistId: c.item.artistId,
      artistName: c.artist?.name || 'Artista',
      itemId: c.item.id,
      itemTitle: c.title,
      producerId: c.producerId,
      producerName: c.producerName,
      score: c.score,
      highlightText: c.highlightText,
      isPlayer: c.item.artistId === playerId
    }));

    const winningProdCandidate = topProdCandidates[0];
    if (winningProdCandidate) {
      const winningItem = winningProdCandidate.item;
      const prodArtist = world.artists[winningItem.artistId];
      const isPlayerProdWinner = winningItem.artistId === playerId;
      const isPlayerProdNominated = prodNominees.some(n => n.isPlayer);

      if (isPlayerProdNominated) playerTotalNominations++;
      if (isPlayerProdWinner) playerTotalWins++;

      categories.push({
        id: `award_best_production_${year}`,
        name: 'Mejor Producción',
        description: 'Premia la sofisticación del diseño sonoro, mezcla, ingeniería acústica y brillantez en la producción.',
        iconName: 'Sliders',
        nominees: prodNominees,
        nomineeArtistIds: prodNominees.map(n => n.artistId),
        nomineeItemIds: prodNominees.map(n => n.itemId || ''),
        winnerArtistId: winningItem.artistId,
        winnerArtistName: prodArtist?.name || 'Artista',
        winnerItemId: winningItem.id,
        winnerItemTitle: winningProdCandidate.title,
        winnerProducerId: winningProdCandidate.producerId,
        winnerProducerName: winningProdCandidate.producerName,
        winnerReason: `Por el impecable trabajo de audio, vanguardia sonora e ingeniería en "${winningProdCandidate.title}".`,
        playerWon: isPlayerProdWinner,
        playerNominated: isPlayerProdNominated
      });

      if (prodArtist) {
        prodArtist.awardsWon.push(`Mejor Producción: "${winningProdCandidate.title}" (${year})`);
        prodArtist.legacyScore = Math.min(100, prodArtist.legacyScore + 4);
        if (isPlayerProdWinner) {
          prodArtist.stats.artisticCredibility = Math.min(100, prodArtist.stats.artisticCredibility + 12);
          prodArtist.stats.reputation = Math.min(100, prodArtist.stats.reputation + 6);
        }
        awardNews.push({
          headline: `Premio a la Mejor Producción (${year}): "${winningProdCandidate.title}" de ${prodArtist.name}`,
          body: `Elogiada por ingenieros y productores como el estándar de oro en calidad de audio y mezcla del año.`,
          relatedArtistId: winningItem.artistId
        });
      }
    }

    const ceremony: AwardCeremony = {
      year,
      name: `Gala Anual de Premios de la Música ${year}`,
      theme: 'Celebrando la excelencia, la trascendencia sonora y el talento de la escena',
      categories,
      playerNominationsCount: playerTotalNominations,
      playerWinsCount: playerTotalWins
    };

    return {
      ceremony,
      awardNews,
      playerWonAny: playerTotalWins > 0
    };
  }
}
