import { GameEngine } from './src/core/GameEngine';
import { PhoneMessageEngine } from './src/systems/PhoneMessageEngine';
import { Artist, WorldState, Song } from './src/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FALLÓ: ${message}`);
    process.exit(1);
  }
  console.log(`  ✔ ${message}`);
}

console.log('================================================================');
console.log('🧪 TEST: PHONE MESSAGE ENGINE & ADVANCED SIMULATION ENHANCEMENTS');
console.log('================================================================');

// -----------------------------------------------------------------------------
// 1. PHONE MESSAGE ENGINE TESTS
// -----------------------------------------------------------------------------
console.log('\n📱 1. PRUEBAS DE PHONE MESSAGE ENGINE');
{
  const engine = new GameEngine();
  const player = engine.getPlayer();
  const world = engine.getWorld();

  const messages1M = PhoneMessageEngine.generateSeasonalMessages(player, world, 1);
  assert(messages1M.length >= 1, `generateSeasonalMessages(1M) generó ${messages1M.length} mensaje(s)`);
  assert(Boolean(messages1M[0].id), 'El mensaje tiene ID único');
  assert(Boolean(messages1M[0].senderName), `El remitente es válido: ${messages1M[0].senderName}`);
  assert(Boolean(messages1M[0].text), 'El texto del mensaje no está vacío');
  assert(Array.isArray(messages1M[0].choices) && messages1M[0].choices.length >= 2, 'El mensaje contiene al menos 2 opciones de respuesta (choices)');

  const messages6M = PhoneMessageEngine.generateSeasonalMessages(player, world, 6);
  assert(messages6M.length >= 2, `generateSeasonalMessages(6M) generó ${messages6M.length} mensajes (esperado >= 2)`);

  // Mensaje cuando la energía está baja
  player.stats.energy = 20;
  const tiredMessages = PhoneMessageEngine.generateSeasonalMessages(player, world, 1);
  assert(tiredMessages.length >= 1, 'Genera mensajes correctamente con energía baja');
  console.log(`     Remitente con energía baja: "${tiredMessages[0].senderName}" - Texto: "${tiredMessages[0].text.substring(0, 60)}..."`);
}

// -----------------------------------------------------------------------------
// 2. GAME ENGINE: advanceCycle FLEXIBLE & PHONE INTEGRATION
// -----------------------------------------------------------------------------
console.log('\n⏱️ 2. PRUEBAS DE advanceCycle(1 | 3 | 6 | 12) & NOTIFICACIONES DE TELÉFONO');
{
  const engine = new GameEngine();
  const world = engine.getWorld();
  const initialMonth = world.currentMonth;
  const initialYear = world.currentYear;

  // Avance de 1 mes por defecto
  engine.advanceCycle(); // Default: 1 mes
  assert(world.currentMonth === initialMonth + 1, `advanceCycle() avanzó exactamente 1 mes (Mes actual: ${world.currentMonth})`);
  assert(Array.isArray(world.phoneMessages) && world.phoneMessages.length > 0, `world.phoneMessages contiene ${world.phoneMessages?.length} mensaje(s)`);
  assert((world.unreadPhoneCount ?? 0) > 0, `world.unreadPhoneCount es ${world.unreadPhoneCount} (> 0)`);

  // Avance de 3 meses
  const monthBefore3M = world.currentMonth;
  engine.advanceCycle(3);
  assert(world.currentMonth === monthBefore3M + 3, `advanceCycle(3) avanzó exactamente 3 meses (Mes actual: ${world.currentMonth})`);

  // Responder a un mensaje
  const firstMsg = world.phoneMessages![0];
  const initialFunds = engine.getPlayer().stats.funds;
  const initialHype = engine.getPlayer().stats.hype;
  const initialUnread = world.unreadPhoneCount!;

  engine.replyToPhoneMessage(firstMsg.id, 0);

  assert(firstMsg.isRead === true, 'El mensaje se marcó como leído (isRead = true)');
  assert(firstMsg.chosenReplyIndex === 0, 'chosenReplyIndex se asignó a 0');
  assert(world.unreadPhoneCount === initialUnread - 1, `unreadPhoneCount disminuyó de ${initialUnread} a ${world.unreadPhoneCount}`);

  // Marcar todos como leídos
  engine.markAllPhoneMessagesRead();
  assert(world.unreadPhoneCount === 0, `markAllPhoneMessagesRead() dejó unreadPhoneCount en 0 (Actual: ${world.unreadPhoneCount})`);
  assert(world.phoneMessages!.every(m => m.isRead === true), 'Todos los mensajes tienen isRead = true');
}

// -----------------------------------------------------------------------------
// 3. DISS TRACK EN releaseSong(...)
// -----------------------------------------------------------------------------
console.log('\n⚔️ 3. PRUEBAS DE DISS TRACK EN releaseSong(...)');
{
  const engine = new GameEngine();
  const player = engine.getPlayer();
  const world = engine.getWorld();

  // Encontrar un artista rival o de la escena
  const rivalCandidate = Object.values(world.artists).find(a => a.id !== player.id);
  assert(Boolean(rivalCandidate), 'Existe artista objetivo para la tiradera');

  const rivalId = rivalCandidate!.id;
  const rivalName = rivalCandidate!.name;
  const playerHypeBefore = player.stats.hype;
  const rivalHypeBefore = rivalCandidate!.stats.hype;

  const dissSong = engine.releaseSong({
    title: `Tiradera Fatal (RIP ${rivalName})`,
    genreId: 'trap_latino',
    subGenreIds: ['freestyle_diss'],
    featuredArtistIds: [],
    budgetProduction: 2000,
    budgetMarketing: 1000,
    isDissTrack: true,
    dissTargetArtistId: rivalId,
    dissAngle: 'lyrical'
  });

  assert(dissSong.isDissTrack === true, 'La canción se guardó con isDissTrack = true');
  assert(dissSong.dissTargetArtistId === rivalId, `dissTargetArtistId coincide con ${rivalId}`);

  // Verificar que el Hype de ambos se actualizó
  assert(player.stats.hype > playerHypeBefore, `El Hype del jugador aumentó tras el diss (${playerHypeBefore} -> ${player.stats.hype})`);
  assert(rivalCandidate!.stats.hype >= rivalHypeBefore, `El Hype del defensor se estimuló por la polémica (${rivalHypeBefore} -> ${rivalCandidate!.stats.hype})`);

  // Verificar relación actualizada
  const rel = player.relationships[rivalId];
  assert(Boolean(rel), 'Se creó o actualizó la relación con el rival');
  assert(rel.relationType === 'rival' || rel.relationType === 'feud', `El tipo de relación es ${rel.relationType}`);
  assert(rel.activeRivalry === true, 'activeRivalry está activo');
  assert((rel.dissCount || 0) >= 1, `dissCount incrementó a ${rel.dissCount}`);

  // Verificar beef en world.activeBeefs
  const beef = world.activeBeefs[`beef_${rivalId}`];
  assert(Boolean(beef), 'Se creó o actualizó la entrada en world.activeBeefs');
  assert(beef.dissTracksExchanged.includes(dissSong.title), `dissTracksExchanged incluye "${dissSong.title}"`);

  // Verificar titular en world.news
  const dissNews = world.news.find(n => n.id.startsWith('news_diss_track_'));
  assert(Boolean(dissNews), 'Se generó la noticia de impacto en world.news');
  console.log(`     Titular generado: "${dissNews?.headline}"`);
}

// -----------------------------------------------------------------------------
// 4. SPOTIFY WRAPPED ANUAL & dismissYearEndWrapped()
// -----------------------------------------------------------------------------
console.log('\n🎁 4. PRUEBAS DE SPOTIFY WRAPPED ANUAL');
{
  const engine = new GameEngine();
  const player = engine.getPlayer();
  const world = engine.getWorld();

  // Lanzar un hit para tener métricas anuales
  engine.releaseSong({
    title: 'Superhit del Verano',
    genreId: 'reggaeton',
    subGenreIds: ['neoperreo'],
    featuredArtistIds: [],
    budgetProduction: 2000,
    budgetMarketing: 1000
  });

  // Avanzar un ciclo completo de 12 meses
  engine.advanceCycle(12);

  // Verificar que al cruzar Diciembre / Fin de Año se generó world.activeYearEndWrapped
  assert(world.activeYearEndWrapped !== null && world.activeYearEndWrapped !== undefined, 'world.activeYearEndWrapped fue generado exitosamente');
  assert(world.activeYearEndWrapped!.year === 2026, `El año del wrapped es ${world.activeYearEndWrapped!.year}`);
  assert(Boolean(world.activeYearEndWrapped!.topSongTitle), `Canción destacada del año: "${world.activeYearEndWrapped!.topSongTitle}"`);
  assert(Boolean(world.activeYearEndWrapped!.industryVerdict), `Veredicto de la industria: "${world.activeYearEndWrapped!.industryVerdict}"`);
  assert(Boolean(world.activeYearEndWrapped!.topCountryFlag), `Bandera del país principal: ${world.activeYearEndWrapped!.topCountryFlag} ${world.activeYearEndWrapped!.topCountry}`);

  console.log(`     Wrapped Year: ${world.activeYearEndWrapped!.year}`);
  console.log(`     Top Song: ${world.activeYearEndWrapped!.topSongTitle} (${world.activeYearEndWrapped!.topSongStreams.toLocaleString()} streams)`);
  console.log(`     Total Streams: ${world.activeYearEndWrapped!.totalStreamsYear.toLocaleString()}`);
  console.log(`     Veredicto: "${world.activeYearEndWrapped!.industryVerdict}"`);

  // Descartar el wrapped
  engine.dismissYearEndWrapped();
  assert(world.activeYearEndWrapped === null, 'dismissYearEndWrapped() limpió world.activeYearEndWrapped (ahora es null)');
  assert(Array.isArray(world.playerWrappedHistory) && world.playerWrappedHistory.length === 1, `El wrapped se archivó en world.playerWrappedHistory (Elementos: ${world.playerWrappedHistory?.length})`);
  assert(world.playerWrappedHistory![0].year === 2026, `El historial archivó el año ${world.playerWrappedHistory![0].year}`);
}

console.log('\n🎉 ¡TODAS LAS PRUEBAS DE PHONE MESSAGE Y SIMULACIÓN PASARON EXITOSAMENTE!\n');
