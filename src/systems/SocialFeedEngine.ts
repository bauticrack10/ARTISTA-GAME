import { SocialPost, WorldState, Artist, Song, Album, EventDefinition, EventOutcome } from '../types';

export class SocialFeedEngine {
  private static FAN_HANDLES = [
    { name: 'Matias 808', handle: '@mati_trap', type: 'fan' as const, avatarGradient: 'from-blue-500 to-indigo-600' },
    { name: 'Camila ⚡', handle: '@cami_musica', type: 'fan' as const, avatarGradient: 'from-pink-500 to-purple-600' },
    { name: 'Lucas R', handle: '@lucas_vibe', type: 'fan' as const, avatarGradient: 'from-amber-500 to-red-500' },
    { name: 'Sofi ✨', handle: '@sofia_sounds', type: 'fan' as const, avatarGradient: 'from-emerald-400 to-teal-600' },
    { name: 'Trap Connoisseur', handle: '@trap_connoisseur', type: 'fan' as const, avatarGradient: 'from-violet-600 to-fuchsia-600' },
    { name: 'Franco B', handle: '@francorimas', type: 'fan' as const, avatarGradient: 'from-cyan-500 to-blue-600' },
    { name: 'Agus 🎧', handle: '@agus_on_repeat', type: 'fan' as const, avatarGradient: 'from-rose-500 to-orange-500' },
    { name: 'Valen 🖤', handle: '@valen_music_', type: 'fan' as const, avatarGradient: 'from-stone-700 to-zinc-900' }
  ];

  private static HATER_HANDLES = [
    { name: 'Anti-Hype 💀', handle: '@antihype_real', type: 'hater' as const, avatarGradient: 'from-zinc-800 to-black' },
    { name: 'Puro Autotune', handle: '@music_purist99', type: 'hater' as const, avatarGradient: 'from-neutral-700 to-stone-900' },
    { name: 'Nostálgico del 2000', handle: '@rock_is_dead_lol', type: 'hater' as const, avatarGradient: 'from-red-900 to-zinc-950' },
    { name: 'Juani Bot', handle: '@juani_critico', type: 'hater' as const, avatarGradient: 'from-slate-700 to-slate-950' },
    { name: 'El Desconfiado', handle: '@nada_les_viene_bien', type: 'hater' as const, avatarGradient: 'from-gray-700 to-black' }
  ];

  private static CRITIC_HANDLES = [
    { name: 'Claudio Varela', handle: '@cvarela_critica', type: 'critic' as const, verified: true, avatarGradient: 'from-amber-700 to-stone-800', badge: 'Crítico Musical' },
    { name: 'Oído Clínico', handle: '@oidoclinicoblog', type: 'critic' as const, verified: true, avatarGradient: 'from-indigo-800 to-slate-900', badge: 'Blog Sonoro' },
    { name: 'La Barra Brava Musical', handle: '@labarra_sonora', type: 'critic' as const, verified: false, avatarGradient: 'from-teal-800 to-zinc-900', badge: 'Podcast' }
  ];

  private static MEDIA_HANDLES = [
    { name: 'Trap & Flow Argentina', handle: '@trapflow_arg', type: 'media' as const, verified: true, avatarGradient: 'from-purple-700 to-indigo-900', badge: 'Medio Oficial' },
    { name: 'Billboard Sonoro', handle: '@billboard_radar', type: 'media' as const, verified: true, avatarGradient: 'from-amber-600 to-orange-700', badge: 'Prensa' },
    { name: 'Indie Hoy & Mañana', handle: '@indiehoy_m', type: 'media' as const, verified: true, avatarGradient: 'from-emerald-600 to-cyan-700', badge: 'Cultura' },
    { name: 'Charts & Streams Live', handle: '@charts_radar_live', type: 'media' as const, verified: true, avatarGradient: 'from-blue-600 to-violet-800', badge: 'Data' }
  ];

  /**
   * Genera reacciones polarizadas tras el lanzamiento de un single o un álbum
   */
  static generateReleasePosts(
    world: WorldState,
    player: Artist,
    release: Song | Album
  ): SocialPost[] {
    const isAlbum = 'songIds' in release;
    const title = release.title;
    const posts: SocialPost[] = [];
    const year = world.currentYear;
    const month = world.currentMonth;

    const quality = isAlbum ? (release as Album).criticalScore : (release as Song).quality;
    const commercial = isAlbum ? (release as Album).commercialScore : (release as Song).commercialAppeal;
    const isHighQuality = quality >= 75;
    const isViral = !isAlbum && (release as Song).wentViral;

    // 1. Post de Medio Oficial
    const media = this.MEDIA_HANDLES[Math.floor(Math.random() * this.MEDIA_HANDLES.length)];
    posts.push({
      id: `post_med_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      platform: 'twitter',
      authorName: media.name,
      authorHandle: media.handle,
      authorVerified: true,
      authorType: 'media',
      authorAvatarGradient: media.avatarGradient,
      badge: media.badge,
      year,
      month,
      content: isAlbum
        ? `🔴 ESTRENO EXCLUSIVO: @${player.name.toLowerCase().replace(/\s+/g, '')} acaba de publicar "${title}" (${(release as Album).songIds.length} tracks). Primeras impresiones marcan una producción de calibre internacional. ¿Qué les pareció el proyecto?`
        : `🚨 LANZAMIENTO: Ya está disponible "${title}", el nuevo single de @${player.name.toLowerCase().replace(/\s+/g, '')}. Disponible en todas las plataformas de streaming.`,
      likes: Math.floor(1200 + player.stats.popularity * 80 + Math.random() * 500),
      retweetsOrShares: Math.floor(250 + player.stats.popularity * 15 + Math.random() * 100),
      commentsCount: Math.floor(180 + player.stats.popularity * 10 + Math.random() * 80),
      sentiment: 'hype',
      relatedSongId: !isAlbum ? release.id : undefined,
      relatedAlbumId: isAlbum ? release.id : undefined,
      relatedArtistId: player.id
    });

    // 2. Post de Fan Eufórico (Stan)
    const fan1 = this.FAN_HANDLES[Math.floor(Math.random() * this.FAN_HANDLES.length)];
    const fanPhrases = isHighQuality
      ? [
          `DIOS MÍO "${title}" es una obra maestra de principio a fin 😭😭🔥 El beat, las barras, el flow... nadie está jugando a este nivel`,
          `En bucle con "${title}" desde las 00:00. @${player.name.toLowerCase().replace(/\s+/g, '')} nunca falla lpm revivió la música`,
          `No supero el cambio de ritmo en "${title}". Esta canción va a sonar en todos los parlantes del país este verano 🔊🔊`,
          `Lo que acaba de sacar @${player.name.toLowerCase().replace(/\s+/g, '')} es histórico. Tatuándome el estribillo ya mismo`
        ]
      : [
          `Salió "${title}" y ya la tengo en loop 🔥 siempre bancando a @${player.name.toLowerCase().replace(/\s+/g, '')}`,
          `Ese estribillo se te pega en la cabeza sí o sí 🕺💃 qué temazo metió`,
          `Suban el volumen que sacó música @${player.name.toLowerCase().replace(/\s+/g, '')} 🚀🚀`
        ];

    posts.push({
      id: `post_fan_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      platform: 'twitter',
      authorName: fan1.name,
      authorHandle: fan1.handle,
      authorVerified: false,
      authorType: 'fan',
      authorAvatarGradient: fan1.avatarGradient,
      year,
      month,
      content: fanPhrases[Math.floor(Math.random() * fanPhrases.length)],
      likes: Math.floor(350 + player.stats.popularity * 25 + Math.random() * 200),
      retweetsOrShares: Math.floor(80 + player.stats.popularity * 6 + Math.random() * 40),
      commentsCount: Math.floor(45 + Math.random() * 30),
      sentiment: 'positive',
      relatedSongId: !isAlbum ? release.id : undefined,
      relatedAlbumId: isAlbum ? release.id : undefined,
      relatedArtistId: player.id
    });

    // 3. Post de Hater / Troll Polarizante
    const hater = this.HATER_HANDLES[Math.floor(Math.random() * this.HATER_HANDLES.length)];
    const haterPhrases = [
      `El beat de "${title}" lo carrileó zarpado. Mucho marketing y poco talento vocal como siempre 💀`,
      `¿De verdad la gente está endiosando "${title}"? Literal suena exactamente igual al tema anterior. Cero evolución`,
      `El autotune trabajando horas extras en "${title}". Si le sacás los efectos no queda nada 🥱`,
      `Otro tema genérico para TikTok. En 2 semanas nadie se acuerda de "${title}"`,
      `Con la plata que le pusieron a la producción de "${title}" cualquiera suena bien... sobrevalorado`
    ];

    posts.push({
      id: `post_hat_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      platform: 'twitter',
      authorName: hater.name,
      authorHandle: hater.handle,
      authorVerified: false,
      authorType: 'hater',
      authorAvatarGradient: hater.avatarGradient,
      year,
      month,
      content: haterPhrases[Math.floor(Math.random() * haterPhrases.length)],
      likes: Math.floor(120 + Math.random() * 180),
      retweetsOrShares: Math.floor(35 + Math.random() * 50),
      commentsCount: Math.floor(95 + Math.random() * 70), // High comments ratio because fans quote-tweet
      sentiment: 'negative',
      relatedSongId: !isAlbum ? release.id : undefined,
      relatedAlbumId: isAlbum ? release.id : undefined,
      relatedArtistId: player.id
    });

    // 4. Post de Crítico Especializado
    const critic = this.CRITIC_HANDLES[Math.floor(Math.random() * this.CRITIC_HANDLES.length)];
    const criticReview = isHighQuality
      ? `Review rápida de "${title}": Calidad de mezcla 9/10, consistencia conceptual sólida. @${player.name.toLowerCase().replace(/\s+/g, '')} consolida su madurez sin perder identidad urbana.`
      : `Análisis de "${title}": Cumple con las demandas del algoritmo comercial pero arriesga poco a nivel sonoro. Buen estribillo, versos algo repetitivos. Puntuación: ${Math.floor(quality / 10)}/10.`;

    posts.push({
      id: `post_crt_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      platform: 'twitter',
      authorName: critic.name,
      authorHandle: critic.handle,
      authorVerified: critic.verified,
      authorType: 'critic',
      authorAvatarGradient: critic.avatarGradient,
      badge: critic.badge,
      year,
      month,
      content: criticReview,
      likes: Math.floor(400 + player.stats.popularity * 15 + Math.random() * 150),
      retweetsOrShares: Math.floor(90 + Math.random() * 60),
      commentsCount: Math.floor(60 + Math.random() * 40),
      sentiment: 'polarizing',
      relatedSongId: !isAlbum ? release.id : undefined,
      relatedAlbumId: isAlbum ? release.id : undefined,
      relatedArtistId: player.id
    });

    // 5. Post Meme / TikTok Style Reaction
    const memeFan = this.FAN_HANDLES[(Math.floor(Math.random() * this.FAN_HANDLES.length) + 2) % this.FAN_HANDLES.length];
    const memePhrases = [
      `Mi psicólogo: "¿Y qué hiciste hoy?"\nYo: Escuchar "${title}" 47 veces seguidas en mi pieza mientras miro al techo`,
      `Yo fingiendo que no me duele la vida mientras suena el drop de "${title}" a 200km/h 🚗💨`,
      `POV: Son las 3 AM y te acordás de ese verso de "${title}" 🤯💀`,
      `El que masterizó "${title}" no tenía que romperla tanto pero decidió salvar la industria 🫡`
    ];

    posts.push({
      id: `post_mem_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      platform: 'tiktok',
      authorName: memeFan.name,
      authorHandle: memeFan.handle,
      authorVerified: false,
      authorType: 'fan',
      authorAvatarGradient: memeFan.avatarGradient,
      year,
      month,
      content: memePhrases[Math.floor(Math.random() * memePhrases.length)],
      likes: Math.floor(1500 + player.stats.popularity * 50 + Math.random() * 800),
      retweetsOrShares: Math.floor(400 + player.stats.popularity * 20 + Math.random() * 200),
      commentsCount: Math.floor(110 + Math.random() * 70),
      sentiment: 'meme',
      relatedSongId: !isAlbum ? release.id : undefined,
      relatedAlbumId: isAlbum ? release.id : undefined,
      relatedArtistId: player.id
    });

    // 6. Post Exclusivo de Videoclip Oficial (si aplica)
    if (!isAlbum && (release as Song).musicVideo) {
      const mv = (release as Song).musicVideo!;
      posts.push({
        id: `post_mv_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        platform: 'twitter',
        authorName: 'Charts & Streams Live',
        authorHandle: '@charts_radar_live',
        authorVerified: true,
        authorType: 'media',
        authorAvatarGradient: 'from-cyan-500 to-blue-600',
        badge: '🎬 Estreno Visual',
        year,
        month,
        content: `🎬 ESTRENO VIDEOCLIP: @${player.name.toLowerCase().replace(/\s+/g, '')} acaba de lanzar el video oficial de "${title}" con estética "${mv.concept}" (Dirigido por ${mv.directorTier}). La dirección de arte y la cinematografía son de altísimo nivel. Ya supera miles de reproducciones en YouTube.`,
        likes: Math.floor(2500 + player.stats.popularity * 100 + Math.random() * 1000),
        retweetsOrShares: Math.floor(600 + player.stats.popularity * 25 + Math.random() * 300),
        commentsCount: Math.floor(240 + player.stats.popularity * 15 + Math.random() * 100),
        sentiment: 'hype',
        relatedSongId: release.id,
        relatedArtistId: player.id
      });
    }

    return posts;
  }

  /**
   * Genera reacciones tras dilemas morales o eventos narrativos
   */
  static generateEventPosts(
    world: WorldState,
    player: Artist,
    event: EventDefinition,
    outcome: EventOutcome
  ): SocialPost[] {
    const posts: SocialPost[] = [];
    const year = world.currentYear;
    const month = world.currentMonth;

    const media = this.MEDIA_HANDLES[0];
    const fan = this.FAN_HANDLES[0];
    const hater = this.HATER_HANDLES[0];

    if (outcome.newsGenerated) {
      posts.push({
        id: `post_evt_news_${Date.now()}_1`,
        platform: 'twitter',
        authorName: media.name,
        authorHandle: media.handle,
        authorVerified: true,
        authorType: 'media',
        authorAvatarGradient: media.avatarGradient,
        badge: 'Último Momento',
        year,
        month,
        content: `🚨 ÚLTIMA HORA: ${outcome.newsGenerated.headline}. ${outcome.newsGenerated.body}`,
        likes: Math.floor(1800 + player.stats.popularity * 40),
        retweetsOrShares: Math.floor(450 + player.stats.popularity * 15),
        commentsCount: Math.floor(320 + player.stats.popularity * 10),
        sentiment: outcome.newsGenerated.sentiment === 'shocking' ? 'polarizing' : outcome.newsGenerated.sentiment === 'positive' ? 'hype' : 'negative',
        relatedArtistId: player.id
      });
    }

    // Reaction posts based on category
    if (event.category === 'relationships' || outcome.newsGenerated?.category === 'rivalry') {
      posts.push({
        id: `post_evt_rel_${Date.now()}_2`,
        platform: 'twitter',
        authorName: fan.name,
        authorHandle: fan.handle,
        authorVerified: false,
        authorType: 'fan',
        authorAvatarGradient: fan.avatarGradient,
        year,
        month,
        content: `Se picó todo en la escena 🔥 @${player.name.toLowerCase().replace(/\s+/g, '')} puso los puntos sobre las íes. Los verdaderos bancamos siempre`,
        likes: Math.floor(450 + Math.random() * 300),
        retweetsOrShares: Math.floor(90 + Math.random() * 50),
        commentsCount: Math.floor(60 + Math.random() * 40),
        sentiment: 'hype',
        relatedArtistId: player.id
      });

      posts.push({
        id: `post_evt_rel_${Date.now()}_3`,
        platform: 'twitter',
        authorName: hater.name,
        authorHandle: hater.handle,
        authorVerified: false,
        authorType: 'hater',
        authorAvatarGradient: hater.avatarGradient,
        year,
        month,
        content: `Puro circo para vender entradas y streams 🤡 qué vergüenza ajena dan armando puterío en redes`,
        likes: Math.floor(180 + Math.random() * 150),
        retweetsOrShares: Math.floor(40 + Math.random() * 30),
        commentsCount: Math.floor(120 + Math.random() * 80),
        sentiment: 'negative',
        relatedArtistId: player.id
      });
    } else if (event.category === 'industry') {
      posts.push({
        id: `post_evt_ind_${Date.now()}_4`,
        platform: 'twitter',
        authorName: this.CRITIC_HANDLES[0].name,
        authorHandle: this.CRITIC_HANDLES[0].handle,
        authorVerified: true,
        authorType: 'critic',
        authorAvatarGradient: this.CRITIC_HANDLES[0].avatarGradient,
        badge: 'Análisis de Negocio',
        year,
        month,
        content: `Movimiento estratégico clave para la carrera de @${player.name.toLowerCase().replace(/\s+/g, '')}. En este nivel de la industria, las decisiones de catálogo y autonomía definen el legado a 10 años.`,
        likes: Math.floor(600 + Math.random() * 300),
        retweetsOrShares: Math.floor(120 + Math.random() * 70),
        commentsCount: Math.floor(50 + Math.random() * 30),
        sentiment: 'polarizing',
        relatedArtistId: player.id
      });
    }

    return posts;
  }

  /**
   * Genera reacciones en redes sociales para interacciones de Beef / Tiraderas
   */
  static generateBeefPosts(
    world: WorldState,
    player: Artist,
    targetName: string,
    actionType: 'respond_social' | 'drop_diss' | 'ignore'
  ): SocialPost[] {
    const posts: SocialPost[] = [];
    const year = world.currentYear;
    const month = world.currentMonth;
    const pHandle = `@${player.name.toLowerCase().replace(/\s+/g, '')}`;
    const tHandle = `@${targetName.toLowerCase().replace(/\s+/g, '')}`;

    if (actionType === 'respond_social') {
      posts.push({
        id: `beef_soc_${Date.now()}_1`,
        platform: 'twitter',
        authorName: 'Trap & Flow Argentina',
        authorHandle: '@trapflow_arg',
        authorVerified: true,
        authorType: 'media',
        authorAvatarGradient: 'from-purple-700 to-indigo-900',
        badge: 'En Foco',
        year,
        month,
        content: `🔥 Tensión máxima en redes: ${pHandle} respondió públicamente a los dichos de ${tHandle} con contundentes mensajes. Las redes arden y se especula con un inminente cruce de barras.`,
        likes: Math.floor(3200 + Math.random() * 1200),
        retweetsOrShares: Math.floor(890 + Math.random() * 300),
        commentsCount: Math.floor(620 + Math.random() * 200),
        sentiment: 'polarizing',
        relatedArtistId: player.id
      });

      posts.push({
        id: `beef_soc_${Date.now()}_2`,
        platform: 'twitter',
        authorName: 'Camila ⚡',
        authorHandle: '@cami_musica',
        authorVerified: false,
        authorType: 'fan',
        authorAvatarGradient: 'from-pink-500 to-purple-600',
        year,
        month,
        content: `Lo domó completamente en dos historias 😭 ${pHandle} no tiene rival, ${tHandle} buscaba prensa y se fue con la cola entre las patas`,
        likes: Math.floor(650 + Math.random() * 400),
        retweetsOrShares: Math.floor(120 + Math.random() * 80),
        commentsCount: Math.floor(85 + Math.random() * 50),
        sentiment: 'hype',
        relatedArtistId: player.id
      });

      posts.push({
        id: `beef_soc_${Date.now()}_3`,
        platform: 'twitter',
        authorName: 'Anti-Hype 💀',
        authorHandle: '@antihype_real',
        authorVerified: false,
        authorType: 'hater',
        authorAvatarGradient: 'from-zinc-800 to-black',
        year,
        month,
        content: `Pelea de nenes de jardín en Twitter. Si son tan raperos tiren barras en el estudio en vez de andar llorando en historias 🥱`,
        likes: Math.floor(340 + Math.random() * 200),
        retweetsOrShares: Math.floor(65 + Math.random() * 40),
        commentsCount: Math.floor(180 + Math.random() * 80),
        sentiment: 'negative',
        relatedArtistId: player.id
      });
    } else if (actionType === 'drop_diss') {
      posts.push({
        id: `beef_diss_${Date.now()}_1`,
        platform: 'twitter',
        authorName: 'Billboard Sonoro',
        authorHandle: '@billboard_radar',
        authorVerified: true,
        authorType: 'media',
        authorAvatarGradient: 'from-amber-600 to-orange-700',
        badge: 'Impacto Global',
        year,
        month,
        content: `💣 ¡BOMBAZO EN EL MIC! ${pHandle} lanzó una tiradera directa e incendiaria contra ${tHandle}. Las reproducciones se cuentan por millones y la escena se divide.`,
        likes: Math.floor(7500 + Math.random() * 3000),
        retweetsOrShares: Math.floor(2100 + Math.random() * 800),
        commentsCount: Math.floor(1400 + Math.random() * 500),
        sentiment: 'hype',
        relatedArtistId: player.id
      });

      posts.push({
        id: `beef_diss_${Date.now()}_2`,
        platform: 'tiktok',
        authorName: 'Trap Connoisseur',
        authorHandle: '@trap_connoisseur',
        authorVerified: false,
        authorType: 'fan',
        authorAvatarGradient: 'from-violet-600 to-fuchsia-600',
        year,
        month,
        content: `PARÁ UN POCO LO ENTERRÓ EN VIDA ⚰️💀 El segundo verso de la tiradera fue quirúrgico, no se recupera más ${tHandle}`,
        likes: Math.floor(4200 + Math.random() * 1500),
        retweetsOrShares: Math.floor(1100 + Math.random() * 400),
        commentsCount: Math.floor(450 + Math.random() * 180),
        sentiment: 'hype',
        relatedArtistId: player.id
      });
    } else if (actionType === 'ignore') {
      posts.push({
        id: `beef_ign_${Date.now()}_1`,
        platform: 'twitter',
        authorName: 'Claudio Varela',
        authorHandle: '@cvarela_critica',
        authorVerified: true,
        authorType: 'critic',
        authorAvatarGradient: 'from-amber-700 to-stone-800',
        badge: 'Opinión',
        year,
        month,
        content: `Elegante e inteligente la postura de ${pHandle} al no rebajarse al show mediático de ${tHandle}. Cuando los números y la música hablan, las provocaciones caen por su propio peso.`,
        likes: Math.floor(1450 + Math.random() * 500),
        retweetsOrShares: Math.floor(240 + Math.random() * 100),
        commentsCount: Math.floor(75 + Math.random() * 35),
        sentiment: 'positive',
        relatedArtistId: player.id
      });
    }

    return posts;
  }

  /**
   * Genera publicaciones mensuales ambientales sobre la escena musical
   */
  static generateMonthlyAmbientPosts(world: WorldState, player: Artist): SocialPost[] {
    const posts: SocialPost[] = [];
    const year = world.currentYear;
    const month = world.currentMonth;

    const otherArtists = Object.values(world.artists).filter(a => a.id !== player.id && !a.isRetired);
    const randomPeer = otherArtists[Math.floor(Math.random() * otherArtists.length)];
    const activeTrends = Object.values(world.trends).filter(t => t.stage !== 'exhausted');
    const topTrend = activeTrends[0];

    // Chart gossip post
    posts.push({
      id: `post_amb_cht_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      platform: 'twitter',
      authorName: 'Charts & Streams Live',
      authorHandle: '@charts_radar_live',
      authorVerified: true,
      authorType: 'media',
      authorAvatarGradient: 'from-blue-600 to-violet-800',
      badge: 'Stats Semanales',
      year,
      month,
      content: topTrend
        ? `📈 TENDENCIA: El auge de "${topTrend.name}" sigue disparando el consumo en streaming. Artistas del género aumentaron un 35% sus reproducciones este mes.`
        : `🔥 Las listas de reproducción en Argentina y Latinoamérica registran una de las etapas más disputadas del año.`,
      likes: Math.floor(800 + Math.random() * 400),
      retweetsOrShares: Math.floor(140 + Math.random() * 80),
      commentsCount: Math.floor(65 + Math.random() * 30),
      sentiment: 'positive'
    });

    if (randomPeer) {
      posts.push({
        id: `post_amb_art_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        platform: 'instagram',
        authorName: randomPeer.name,
        authorHandle: `@${randomPeer.name.toLowerCase().replace(/\s+/g, '')}`,
        authorVerified: true,
        authorType: 'artist',
        authorAvatarGradient: randomPeer.avatarColor || 'from-amber-600 to-rose-700',
        badge: 'Artista Verificado',
        year,
        month,
        content: `Cocinando cosas grandes en el estudio... no están listos para lo que se viene este año 🤫💿`,
        likes: Math.floor(4500 + randomPeer.stats.popularity * 120),
        retweetsOrShares: Math.floor(320 + Math.random() * 150),
        commentsCount: Math.floor(280 + Math.random() * 100),
        sentiment: 'hype',
        relatedArtistId: randomPeer.id
      });
    }

    return posts;
  }

  /**
   * Genera el feed inicial para una nueva partida
   */
  static getInitialFeed(world: WorldState, player: Artist): SocialPost[] {
    return [
      {
        id: 'post_init_1',
        platform: 'twitter',
        authorName: 'Trap & Flow Argentina',
        authorHandle: '@trapflow_arg',
        authorVerified: true,
        authorType: 'media',
        authorAvatarGradient: 'from-purple-700 to-indigo-900',
        badge: 'Radar de Nuevos Talentos',
        year: world.currentYear,
        month: world.currentMonth,
        content: `👀 Atentos al radar de nuevos talentos de ${player.city || 'Buenos Aires'}: @${player.name.toLowerCase().replace(/\s+/g, '')} viene llamando la atención de productores independientes con su sonido distintivo.`,
        likes: 540,
        retweetsOrShares: 85,
        commentsCount: 34,
        sentiment: 'positive',
        relatedArtistId: player.id
      },
      {
        id: 'post_init_2',
        platform: 'twitter',
        authorName: 'Matias 808',
        authorHandle: '@mati_trap',
        authorVerified: false,
        authorType: 'fan',
        authorAvatarGradient: 'from-blue-500 to-indigo-600',
        year: world.currentYear,
        month: world.currentMonth,
        content: `Escuché las maquetas de @${player.name.toLowerCase().replace(/\s+/g, '')} y tiene un flow zarpado. Guarden este tuit porque en 2 años llena estadios 🔥`,
        likes: 120,
        retweetsOrShares: 22,
        commentsCount: 9,
        sentiment: 'hype',
        relatedArtistId: player.id
      },
      {
        id: 'post_init_3',
        platform: 'twitter',
        authorName: 'Anti-Hype 💀',
        authorHandle: '@antihype_real',
        authorVerified: false,
        authorType: 'hater',
        authorAvatarGradient: 'from-zinc-800 to-black',
        year: world.currentYear,
        month: world.currentMonth,
        content: `Todos los días sale un trapper nuevo diciendo que va a cambiar la música y duran 3 meses... a ver si este muestra algo diferente 🥱`,
        likes: 45,
        retweetsOrShares: 8,
        commentsCount: 18,
        sentiment: 'negative',
        relatedArtistId: player.id
      }
    ];
  }
}
