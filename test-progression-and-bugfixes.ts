import { GameEngine } from './src/core/GameEngine';
import { LegacyEngine } from './src/systems/LegacyEngine';
import { IndustryEngine } from './src/systems/IndustryEngine';
import { StreamingEngine } from './src/systems/StreamingEngine';
import { CertificationEngine } from './src/systems/CertificationEngine';
import { CORE_EVENT_TEMPLATES } from './src/data/eventTemplates';

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`❌ [FAIL] ${msg}`);
    throw new Error(`Test failed: ${msg}`);
  }
  console.log(`  ✅ [PASS] ${msg}`);
}

async function runProgressionAndBugfixTests() {
  console.log('================================================================');
  console.log('🧪 SUITE DE REGRESIÓN: BUGFIXES CRÍTICOS Y PROGRESIÓN');
  console.log('================================================================\n');

  // 1. ecosystemContacts + 0 energy/trait survival across exportSaveState -> importSaveState
  {
    const engine = new GameEngine();
    const world = engine.getWorld();
    const player = engine.getPlayer();
    const firstNpcKey = Object.keys(world.ecosystemContacts)[0];
    assert(!!firstNpcKey, 'Existen contactos iniciales en ecosystemContacts');

    world.ecosystemContacts[firstNpcKey].affinity = 77;
    world.ecosystemContacts[firstNpcKey].history.push('Prueba de persistencia');
    player.stats.energy = 0;
    player.personality.riskTolerance = 0;

    const json = engine.exportSaveState();
    const restored = new GameEngine();
    const ok = restored.importSaveState(json);
    assert(ok, 'importSaveState retorna true');
    assert(
      restored.getWorld().ecosystemContacts[firstNpcKey]?.affinity === 77,
      'ecosystemContacts preserva afinidad tras export/import'
    );
    assert(restored.getPlayer().stats.energy === 0, 'Energía 0 sobrevive a importSaveState sin resetearse a 100');
    assert(
      restored.getPlayer().personality.riskTolerance === 0,
      'Rasgo en 0 sobrevive a importSaveState sin resetearse a 50'
    );
  }

  // 2. Sin pago doble de signingBonus en eventos de contrato
  {
    const engine = new GameEngine();
    const player = engine.getPlayer();
    player.stats.funds = 1000;
    const contractEvt = CORE_EVENT_TEMPLATES.find((e) => e.id === 'evt_first_contract_offer');
    assert(!!contractEvt, 'Existe evt_first_contract_offer');
    (engine as any).currentEvent = contractEvt;

    const ctx = {
      player,
      world: engine.getWorld(),
      currentYear: engine.getWorld().currentYear,
      currentMonth: engine.getWorld().currentMonth
    };
    const choices = contractEvt!.choices(ctx);
    const acceptIdx = choices.findIndex((c) => {
      const out = c.apply(ctx);
      return Boolean(out.newContract);
    });
    assert(acceptIdx >= 0, 'Existe opción de aceptar contrato en evt_first_contract_offer');

    const expectedBonus = choices[acceptIdx].apply(ctx).newContract!.signingBonus;
    engine.resolveCurrentEventChoice(acceptIdx);
    assert(
      player.stats.funds === 1000 + expectedBonus,
      `Bono de firma acreditado una sola vez (${player.stats.funds} === ${1000 + expectedBonus})`
    );
  }

  // 3. Exclusividad contractual + breakActiveContract + sello propio sin auto-despido
  {
    const engine = new GameEngine();
    const player = engine.getPlayer();
    player.stats.funds = 100000;
    engine.signContract({
      labelId: 'label_callejon_records',
      signingBonus: 2000,
      royaltyPercentage: 70,
      albumsRequired: 2,
      albumsDelivered: 0,
      creativeControl: 85,
      marketingPower: 35,
      breakoutClause: 1500,
      durationYears: 2,
      signedYear: 2026
    });

    let blocked = false;
    try {
      engine.signContract({
        labelId: 'label_bohemian_groove_local',
        signingBonus: 5000,
        royaltyPercentage: 65,
        albumsRequired: 2,
        albumsDelivered: 0,
        creativeControl: 80,
        marketingPower: 40,
        durationYears: 2,
        signedYear: 2026
      });
    } catch {
      blocked = true;
    }
    assert(blocked, 'signContract bloquea firma con segundo sello exclusivo mientras hay contrato vigente');

    const breakRes = engine.breakActiveContract();
    assert(breakRes.success && player.labelId === null && player.activeContract === null, 'breakActiveContract libera al artista');

    const ownLabel = IndustryEngine.createArtistOwnedLabel(player, 'Sello Propio QA', engine.getWorld());
    assert(!!ownLabel.id && player.activeContract?.isArtistOwned === true, 'createArtistOwnedLabel crea sello propio marcado isArtistOwned');

    const album = engine.releaseAlbum({
      title: 'Debut Propio',
      type: 'ep',
      genreId: player.mainGenreId,
      subGenreIds: [],
      newTrackTitles: ['Track 1', 'Track 2', 'Track 3', 'Track 4'],
      budgetProduction: 1000,
      budgetMarketing: 500
    });
    assert(!!album.id, 'Álbum en sello propio publicado');
    assert(
      player.labelId === ownLabel.id && player.activeContract?.isArtistOwned === true,
      'Sello propio NO expulsa al artista al publicar su primer álbum'
    );
  }

  // 4. Multiplicador de playlist editorial y acumulación de streams en álbum + certificaciones en español
  {
    const engine = new GameEngine();
    const player = engine.getPlayer();
    const world = engine.getWorld();
    player.stats.funds = 50000;
    const album = engine.releaseAlbum({
      title: 'Album Oro QA',
      type: 'ep',
      genreId: 'trap_latino',
      subGenreIds: [],
      newTrackTitles: ['Hit A', 'Hit B', 'Hit C', 'Hit D'],
      budgetProduction: 2000,
      budgetMarketing: 2000
    });
    const track = world.songs[album.songIds[0]];
    const baseStreams = StreamingEngine.calculateSongMonthlyStreams(
      track,
      player,
      world.currentYear,
      world.currentMonth,
      [],
      world.genres[track.genreId],
      world.artists,
      [track],
      world.playlists
    ).streams;

    const firstPlaylist = Object.values(world.playlists || {})[0];
    assert(!!firstPlaylist, 'Existe al menos una playlist editorial');
    firstPlaylist.trackIds = [track.id];

    const boostedStreams = StreamingEngine.calculateSongMonthlyStreams(
      track,
      player,
      world.currentYear,
      world.currentMonth,
      [],
      world.genres[track.genreId],
      world.artists,
      [track],
      world.playlists
    ).streams;
    assert(boostedStreams > baseStreams, `Playlist editorial incrementa streams (${boostedStreams} > ${baseStreams})`);

    const prevAlbumStreams = album.totalStreams;
    engine.advanceCycle(1);
    assert(album.totalStreams > prevAlbumStreams, 'advanceCycle acumula streams de pistas en album.totalStreams');

    album.totalStreams = 80_000_000; // >= 50k equivalent units
    const certRes = CertificationEngine.evaluateCertifications(world);
    assert(certRes.newCertifications.some((c) => c.targetId === album.id), 'Certifica álbum tras superar unidades equivalentes');
    assert(
      certRes.newsItems.every((n) => !n.headline.includes('GOLD') && !n.headline.includes('MULTI_PLATINUM')),
      'Titulares de certificación usan español limpio (nunca GOLD / MULTI_PLATINUM)'
    );
  }

  // 5. LegacyEngine.evaluateCareerStage (Superstar, Emerging, Declining, Comeback)
  {
    const engine = new GameEngine();
    const player = engine.getPlayer();
    player.stats.popularity = 20;
    player.stats.monthlyListeners = 0;
    player.stats.totalStreams = 0;
    assert(
      LegacyEngine.evaluateCareerStage(player, 1, 0) === 'Underground',
      'No promueve a Emerging sin canciones ni 2000 oyentes'
    );

    player.stats.popularity = 95;
    player.stats.monthlyListeners = 25000000;
    assert(
      LegacyEngine.evaluateCareerStage(player, 16, 4) === 'Superstar',
      'No degrada Superstar a Veteran tras 15+ años'
    );

    player.stats.popularity = 22;
    player.stats.monthlyListeners = 8000;
    assert(
      LegacyEngine.evaluateCareerStage(player, 6, 0) === 'Declining',
      'Permite entrar en Declining tras años con baja tracción'
    );

    player.careerStage = 'Declining';
    player.stats.popularity = 65;
    player.stats.monthlyListeners = 1200000;
    assert(
      LegacyEngine.evaluateCareerStage(player, 8, 1) === 'Comeback',
      'Permite transición Declining -> Comeback'
    );
  }

  // 6. Wrapped anual detecta premios via winnerArtistId
  {
    const engine = new GameEngine();
    const player = engine.getPlayer();
    const world = engine.getWorld();
    world.awardsHistory.push({
      year: 2026,
      name: 'Premios Test',
      categories: [
        {
          id: 'cat_song',
          name: 'Canción del Año',
          nomineeArtistIds: [player.id],
          winnerArtistId: player.id,
          playerWon: true
        }
      ]
    });
    const wrapped = engine.generateYearEndWrapped(2026);
    assert(wrapped.awardsWonYear.includes('Canción del Año'), 'Wrapped anual detecta premios ganados por winnerArtistId');
  }

  // 7. Agenda mensual (2 vs 3 con manager), sinergias y objetivos de carrera
  {
    const engine = new GameEngine();
    const player = engine.getPlayer();
    assert(engine.getMonthlyActionStatus().max === 2, 'Sin mánager tiene 2 acciones de agenda al mes');

    const resTrain = engine.executeDecisionAction('studio_practice');
    assert(resTrain.success && (player.activeCreativeBuffs?.nextTrackQuality || 0) > 0, 'studio_practice otorga nextTrackQuality');

    const single = engine.releaseSong({
      title: 'Tema Con Sinergia',
      genreId: player.mainGenreId,
      subGenreIds: [],
      featuredArtistIds: [],
      budgetProduction: 500,
      budgetMarketing: 200
    });
    assert(!!single.id && (player.activeCreativeBuffs?.nextTrackQuality || 0) === 0, 'Lanzar single consume nextTrackQuality');

    const goals = engine.getCareerGoals();
    assert(goals.length > 0 && goals.some((g) => g.completed), 'Existen objetivos de carrera y el primer single completa objetivo');
    const firstDone = goals.find((g) => g.completed && !g.claimed)!;
    const claim = engine.claimCareerGoal(firstDone.id);
    assert(claim.success, 'claimCareerGoal otorga recompensa exitosamente');
  }

  // 8. replyToPhoneMessage rechaza gastos sin fondos suficientes
  {
    const engine = new GameEngine();
    const player = engine.getPlayer();
    const world = engine.getWorld();
    player.stats.funds = 0;
    world.phoneMessages = [
      {
        id: 'msg_test_cost',
        senderId: 'mgr',
        senderName: 'Mánager',
        senderAvatarColor: 'from-amber-500 to-orange-600',
        category: 'manager',
        text: '¿Pagamos campaña?',
        sentMonth: 1,
        sentYear: 2026,
        choices: [
          {
            label: 'Pagar $3.000',
            replyText: 'Dale',
            effects: { fundsDelta: -3000, hypeDelta: 20 }
          }
        ]
      }
    ];
    const replyRes = engine.replyToPhoneMessage('msg_test_cost', 0);
    assert(replyRes.success === false && player.stats.hype === 55, 'replyToPhoneMessage rechaza compra con $0 sin aplicar hype');
  }

  console.log('\n================================================================');
  console.log('🎉 TODOS LOS TESTS DE REGRESIÓN Y PROGRESIÓN PASARON EXITOSAMENTE');
  console.log('================================================================');
}

runProgressionAndBugfixTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
