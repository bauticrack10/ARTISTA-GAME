import React, { useState } from 'react';
import {
  Artist,
  WorldState,
  Song,
  EditorialPlaylist,
  YouTubeComment,
  SnippetCampaignResult,
  TikTokInfluencerTier
} from '../types';
import { StreamingEngine, EDITORIAL_PLAYLISTS } from '../systems/StreamingEngine';
import { playSound } from '../utils/audioSystem';
import { formatMoney, formatFans } from '../utils/formatters';
import { ArtistAvatar } from './ArtistAvatar';
import {
  Radio,
  Play,
  Pause,
  Headphones,
  TrendingUp,
  Flame,
  CheckCircle2,
  Users,
  Video,
  MessageSquare,
  Heart,
  Pin,
  Send,
  Sliders,
  DollarSign,
  Share2,
  Disc3,
  BarChart3,
  Award,
  Zap,
  Info,
  Layers,
  Search,
  Plus
} from 'lucide-react';

interface StreamingPlatformViewProps {
  player: Artist;
  world: WorldState;
  onPitchSong: (songId: string, playlistId: string) => { success: boolean; message: string; added: boolean; position?: number };
  onLaunchSnippet: (params: { songId: string; concept: string; budget: number; influencerTier?: TikTokInfluencerTier }) => SnippetCampaignResult;
  onInteractComment?: (songId: string, commentId: string, action: 'pin' | 'like') => void;
}

export const StreamingPlatformView: React.FC<StreamingPlatformViewProps> = ({
  player,
  world,
  onPitchSong,
  onLaunchSnippet,
  onInteractComment
}) => {
  // Sub-tabs: 'profile' (Top 5 & Overview) | 'playlists' | 'youtube' | 'tiktok'
  const [activeTab, setActiveTab] = useState<'profile' | 'playlists' | 'youtube' | 'tiktok'>('profile');

  // Currently previewing track
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);

  // Pitch Modal State
  const [pitchModalOpen, setPitchModalOpen] = useState(false);
  const [selectedPitchSongId, setSelectedPitchSongId] = useState<string>('');
  const [selectedPitchPlaylistId, setSelectedPitchPlaylistId] = useState<string>('todays_top_hits');
  const [pitchFeedback, setPitchFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // TikTok Snippet Form State
  const [selectedSnippetSongId, setSelectedSnippetSongId] = useState<string>('');
  const [snippetConcept, setSnippetConcept] = useState<string>('Trend de Baile & Coreografía');
  const [snippetBudget, setSnippetBudget] = useState<number>(2500);
  const [snippetTier, setSnippetTier] = useState<TikTokInfluencerTier>('macro');
  const [lastSnippetResult, setLastSnippetResult] = useState<SnippetCampaignResult | null>(null);

  // YouTube Comments Selection
  const playerSongs = Object.values(world.songs || {}).filter(s => s.artistId === player.id);
  const songsWithVideo = playerSongs.filter(s => Boolean(s.musicVideo));
  const [selectedVideoSongId, setSelectedVideoSongId] = useState<string>(
    songsWithVideo.length > 0 ? songsWithVideo[0].id : (playerSongs[0]?.id || '')
  );
  const [commentHeartedMap, setCommentHeartedMap] = useState<Record<string, boolean>>({});
  const [commentPinnedMap, setCommentPinnedMap] = useState<Record<string, boolean>>({});

  // Sort player songs by total streams for Top Tracks
  const topSongs = [...playerSongs]
    .sort((a, b) => (b.streamsTotal || 0) - (a.streamsTotal || 0))
    .slice(0, 5);

  const activePlaylists = Object.values(world.playlists || EDITORIAL_PLAYLISTS.reduce((acc, p) => ({ ...acc, [p.id]: p }), {}));

  const handleTogglePlaySong = (songId: string) => {
    if (playingSongId === songId) {
      setPlayingSongId(null);
    } else {
      playSound('click');
      setPlayingSongId(songId);
    }
  };

  const handleExecutePitch = () => {
    if (!selectedPitchSongId || !selectedPitchPlaylistId) return;
    playSound('click');
    const res = onPitchSong(selectedPitchSongId, selectedPitchPlaylistId);
    setPitchFeedback({
      success: res.success,
      message: res.message
    });
    if (res.success) {
      playSound('level_up');
    }
  };

  const handleExecuteSnippet = () => {
    if (!selectedSnippetSongId) {
      alert('Por favor selecciona una canción para la campaña.');
      return;
    }
    playSound('click');
    try {
      const res = onLaunchSnippet({
        songId: selectedSnippetSongId,
        concept: snippetConcept,
        budget: snippetBudget,
        influencerTier: snippetTier
      });
      setLastSnippetResult(res);
      playSound('chart_no1');
    } catch (err: any) {
      alert(err.message || 'Error al lanzar la campaña.');
    }
  };

  const handleHeartComment = (songId: string, commentId: string) => {
    playSound('click');
    setCommentHeartedMap(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    onInteractComment?.(songId, commentId, 'like');
  };

  const handlePinComment = (songId: string, commentId: string) => {
    playSound('click');
    setCommentPinnedMap(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    onInteractComment?.(songId, commentId, 'pin');
  };

  // Current song comments
  const activeVideoSong = world.songs[selectedVideoSongId] || playerSongs[0];
  const videoComments = activeVideoSong
    ? StreamingEngine.generateVideoComments(activeVideoSong, player, world)
    : [];

  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-[#F4F4F6]">
      {/* --- PLATFORM ARTIST BANNER (ANALOG STUDIO / PRO CONSOLE STYLE) --- */}
      <div className="relative rounded-[16px] overflow-hidden liquid-glass-card p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 relative z-10">
          {/* Avatar with Sound Reactive Ring */}
          <div className="relative group shrink-0">
            <ArtistAvatar
              name={player.name}
              avatarColor={player.avatarColor}
              avatarIcon={player.avatarIcon}
              size="2xl"
              rounded="rounded-[4px]"
              className="border border-white/20"
            />
            {playingSongId && (
              <div className="absolute inset-0 bg-black/60 rounded-[4px] flex items-center justify-center">
                <Radio className="w-8 h-8 text-[#00E599] animate-pulse" />
              </div>
            )}
          </div>

          {/* Artist Stats & Bio */}
          <div className="space-y-2 text-center md:text-left flex-1 min-w-0">
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold text-[#F4F4F6] liquid-glass-pill px-2.5 py-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00E599]" />
                Artista Verificado
              </span>
              <span className="text-xs text-[#8E8E99] font-sans">
                {player.country} • {world.genres[player.mainGenreId]?.name || 'Urbano'}
              </span>
              <span className="text-[10px] font-sans font-bold text-[#FF4F00] liquid-glass-pill border-[#FF4F00]/30 px-2.5 py-0.5">
                {player.careerStage}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F4F4F6] tracking-tight truncate">
              {player.name}
            </h1>

            <div className="flex items-center justify-center md:justify-start gap-6 pt-1 text-xs">
              <div>
                <span className="text-[#52525B] block text-[10px] uppercase font-sans font-semibold">Oyentes Mensuales</span>
                <span className="text-lg sm:text-xl font-bold font-sans text-[#00E599] tabular-nums">
                  {(player.stats?.monthlyListeners ?? 0).toLocaleString('es-AR')}
                </span>
              </div>
              <div className="w-px h-8 bg-[#242429]" />
              <div>
                <span className="text-[#52525B] block text-[10px] uppercase font-sans font-semibold">Streams Totales</span>
                <span className="text-lg sm:text-xl font-bold font-sans text-[#00E599] tabular-nums">
                  {(player.stats.totalStreams / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="w-px h-8 bg-[#242429]" />
              <div>
                <span className="text-[#52525B] block text-[10px] uppercase font-sans font-semibold">Seguidores / Fans</span>
                <span className="text-lg sm:text-xl font-bold font-sans text-[#F4F4F6] tabular-nums">
                  {formatFans(player.stats.fansCount)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                playSound('click');
                setPitchModalOpen(true);
              }}
              className="px-4 py-2 rounded-[4px] bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-2 active:translate-y-[1px]"
            >
              <Send className="w-4 h-4" />
              <span>Pitch a Curadores</span>
            </button>
            <button
              onClick={() => {
                playSound('click');
                alert(`Perfil oficial de ${player.name} copiado al portapapeles.`);
              }}
              className="p-2 rounded-[4px] bg-[#18181C] hover:bg-[#242429] border border-[#242429] text-[#8E8E99] hover:text-[#F4F4F6] transition-colors cursor-pointer"
              title="Compartir perfil"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-2 mt-4 pt-1 overflow-x-auto scrollbar-none text-xs font-semibold">
          {[
            { id: 'profile', label: 'Top Canciones & Métricas', icon: BarChart3 },
            { id: 'playlists', label: 'Playlists Editoriales Activas', icon: Radio },
            { id: 'youtube', label: 'Videoclips & Comentarios de Fans', icon: MessageSquare },
            { id: 'tiktok', label: 'Laboratorio de Snippets (TikTok/Reels)', icon: Flame }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  playSound('click');
                  setActiveTab(t.id as any);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-[6px] font-sans text-xs whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF4F00] text-white font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]'
                    : 'liquid-glass-pill text-[#8E8E99] hover:text-[#F4F4F6]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- TAB 1: PROFILE & TOP TRACKS --- */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top 5 Songs */}
          <div className="lg:col-span-2 liquid-glass-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-base font-bold text-[#F4F4F6] flex items-center gap-2">
                <Disc3 className="w-4 h-4 text-[#FF4F00]" />
                Top 5 Canciones Más Populares
              </h2>
              <span className="text-xs text-[#8E8E99] font-sans">
                Ordenado por reproducciones globales
              </span>
            </div>

            {topSongs.length === 0 ? (
              <p className="text-xs text-[#8E8E99] italic py-8 text-center">
                Aún no has lanzado canciones en plataformas de streaming.
              </p>
            ) : (
              <div className="space-y-2">
                {topSongs.map((song, idx) => {
                  const isPlaying = playingSongId === song.id;
                  const popPct = Math.min(100, Math.max(10, Math.floor((song.streamsTotal / Math.max(1, topSongs[0].streamsTotal)) * 100)));

                  return (
                    <div
                      key={song.id}
                      className={`flex items-center justify-between p-3 rounded-[4px] border transition-all ${
                        isPlaying
                          ? 'bg-[#FF4F00]/10 border-[#FF4F00]'
                          : 'bg-[#09090B] border-[#242429] hover:border-[#3F3F46]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-5 text-center font-sans font-bold text-xs text-[#8E8E99] tabular-nums">
                          {idx + 1}
                        </span>

                        <button
                          onClick={() => handleTogglePlaySong(song.id)}
                          className="w-8 h-8 rounded-[4px] bg-[#FF4F00] hover:bg-[#E04500] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs transition-transform active:scale-95"
                          title={isPlaying ? 'Pausar tema' : 'Reproducir preview'}
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                        </button>

                        <div className="min-w-0">
                          <h3 className="text-xs font-bold text-[#F4F4F6] truncate">
                            {song.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[10px] text-[#8E8E99]">
                            <span>{world.genres[song.genreId]?.name || 'Urbano'}</span>
                            {song.isSingle && <span className="text-[#FF4F00] font-sans">• Single</span>}
                            {song.musicVideo && <span className="text-[#38BDF8] font-sans">• Videoclip</span>}
                            {song.wentViral && <span className="text-[#F59E0B] font-sans font-bold">• Viral</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 shrink-0 text-xs font-sans">
                        <div className="w-20 hidden sm:block">
                          <div className="w-full h-1.5 bg-[#242429] rounded-[2px] overflow-hidden">
                            <div
                              className="h-full bg-[#FF4F00] rounded-[2px]"
                              style={{ width: `${popPct}%` }}
                            />
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[#00E599] font-bold block tabular-nums">
                            {song.streamsLastMonth.toLocaleString('es-AR')} /mes
                          </span>
                          <span className="text-[10px] text-[#8E8E99] block tabular-nums">
                            Total: {(song.streamsTotal / 1000000).toFixed(2)}M
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Metrics & Curators Snapshot */}
          <div className="space-y-6">
            <div className="liquid-glass-card p-6 space-y-4">
              <h2 className="text-base font-bold text-[#F4F4F6] flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#00E599]" />
                Presencia Editorial
              </h2>
              <p className="text-xs text-[#8E8E99]">
                Las canciones incluidas en listas editoriales reciben un multiplicador permanente en sus reproducciones mensuales.
              </p>

              <div className="space-y-3 pt-2">
                {activePlaylists.slice(0, 3).map(pl => {
                  const playerTracksInPl = (pl.trackIds || []).filter(sId => world.songs[sId]?.artistId === player.id);
                  return (
                    <div key={pl.id} className="p-3 rounded-[4px] bg-[#09090B] border border-[#242429] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-[#F4F4F6] block">{pl.name}</span>
                        <span className="text-[10px] text-[#8E8E99] font-sans tabular-nums">{pl.followers.toLocaleString('es-AR')} seguidores</span>
                      </div>
                      <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-[4px] ${
                        playerTracksInPl.length > 0
                          ? 'bg-[#00E599]/10 text-[#00E599] border border-[#00E599]/30'
                          : 'bg-[#18181C] text-[#8E8E99] border border-[#242429]'
                      }`}>
                        {playerTracksInPl.length > 0 ? `${playerTracksInPl.length} temas dentro` : 'Sin temas'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setActiveTab('playlists')}
                className="w-full py-2 rounded-[4px] bg-[#18181C] hover:bg-[#242429] border border-[#242429] text-xs font-sans font-semibold text-[#F4F4F6] transition-colors cursor-pointer"
              >
                Ver todas las playlists editoriales →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: EDITORIAL PLAYLISTS --- */}
      {activeTab === 'playlists' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 liquid-glass-card p-6">
            <div>
              <h2 className="text-lg font-bold text-[#F4F4F6] flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#FF4F00]" />
                Circuito de Playlists Editoriales & Algorítmicas
              </h2>
              <p className="text-xs text-[#8E8E99] mt-1">
                Ecosistema de listas curadas por equipos editoriales globales. Ingresar en una de ellas multiplica tus oyentes exponencialmente.
              </p>
            </div>

            <button
              onClick={() => {
                playSound('click');
                setPitchModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-[4px] bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-2 active:translate-y-[1px]"
            >
              <Plus className="w-4 h-4" />
              <span>Pitch de Canción</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activePlaylists.map(playlist => {
              const tracksInPlaylist = (playlist.trackIds || []).map(id => world.songs[id]).filter(Boolean);
              const playerTracksInPlaylist = tracksInPlaylist.filter(s => s.artistId === player.id);

              return (
                <div
                  key={playlist.id}
                  className="bg-[#111114] border border-[#242429] hover:border-[#3F3F46] rounded-[6px] overflow-hidden flex flex-col justify-between transition-all group shadow-xs"
                >
                  <div className="p-4 bg-[#18181C] border-b border-[#242429] text-[#F4F4F6] relative">
                    <span className="text-[10px] font-sans font-bold uppercase px-2 py-0.5 rounded-[4px] bg-[#111114] border border-[#242429] text-[#8E8E99]">
                      {playlist.curator}
                    </span>
                    <h3 className="text-base font-bold tracking-tight mt-2 text-[#F4F4F6]">
                      {playlist.name}
                    </h3>
                    <p className="text-[11px] text-[#8E8E99] line-clamp-2 mt-1">
                      {playlist.description}
                    </p>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1 text-xs font-sans">
                      <div className="flex justify-between text-[#8E8E99]">
                        <span>Seguidores:</span>
                        <span className="text-[#F4F4F6] font-bold tabular-nums">
                          {playlist.followers.toLocaleString('es-AR')}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#8E8E99]">
                        <span>Multiplicador Streams:</span>
                        <span className="text-[#00E599] font-bold tabular-nums">
                          x{playlist.streamMultiplier}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#8E8E99]">
                        <span>Temas Totales:</span>
                        <span className="text-[#D4D4D8] tabular-nums">
                          {tracksInPlaylist.length} canciones
                        </span>
                      </div>
                    </div>

                    {playerTracksInPlaylist.length > 0 ? (
                      <div className="p-2.5 rounded-[4px] bg-[#00E599]/10 border border-[#00E599]/30 text-[#00E599] text-xs space-y-1">
                        <span className="text-[10px] uppercase font-sans font-bold text-[#00E599] block flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          ¡Tu música está dentro!
                        </span>
                        {playerTracksInPlaylist.map(track => (
                          <span key={track.id} className="block text-[11px] truncate font-semibold text-[#F4F4F6]">
                            • "{track.title}"
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-[4px] bg-[#09090B] border border-[#242429] text-[11px] font-sans text-[#8E8E99] text-center">
                        Ningún tema tuyo en esta lista aún.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- TAB 3: YOUTUBE & FAN COMMENTS --- */}
      {activeTab === 'youtube' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Song Video Selector */}
          <div className="liquid-glass-card p-6 space-y-4">
            <h2 className="text-base font-bold text-[#F4F4F6] flex items-center gap-2">
              <Video className="w-4 h-4 text-[#38BDF8]" />
              Seleccionar Lanzamiento
            </h2>
            <p className="text-xs text-[#8E8E99]">
              Explora las reacciones de los fanáticos en los videos musicales oficiales de tu catálogo.
            </p>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {playerSongs.map(song => {
                const isSelected = selectedVideoSongId === song.id;
                return (
                  <button
                    key={song.id}
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setSelectedVideoSongId(song.id);
                    }}
                    className={`w-full p-3 rounded-[4px] border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF4F00]/10 border-[#FF4F00] text-[#F4F4F6]'
                        : 'bg-[#09090B] border-[#242429] text-[#8E8E99] hover:border-[#3F3F46]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F4F4F6] truncate">
                        {song.title}
                      </span>
                      {song.musicVideo && (
                        <span className="text-[10px] font-sans font-bold text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/30 px-1.5 py-0.2 rounded-[4px]">
                          🎬 4K
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#8E8E99] font-sans block mt-0.5 tabular-nums">
                      {song.musicVideo ? `${(song.musicVideo.views || 0).toLocaleString('es-AR')} vistas` : 'Solo Audio'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comments Stream */}
          <div className="lg:col-span-2 liquid-glass-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h2 className="text-base font-bold text-[#F4F4F6] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#FF4F00]" />
                  Comentarios de la Comunidad: "{activeVideoSong?.title || 'Tema'}"
                </h2>
                <p className="text-xs text-[#8E8E99] mt-0.5">
                  Reacciones en vivo de fanáticos, debates líricos y memes de la escena.
                </p>
              </div>
            </div>

            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {videoComments.map(comment => {
                const isHearted = commentHeartedMap[comment.id] || comment.isHeartedByArtist;
                const isPinned = commentPinnedMap[comment.id] || comment.isPinned;

                return (
                  <div
                    key={comment.id}
                    className={`p-4 rounded-[4px] border transition-all ${
                      isPinned
                        ? 'bg-[#18181C] border-l-4 border-l-[#FF4F00] border-[#242429]'
                        : 'bg-[#09090B] border-[#242429]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[4px] bg-[#18181C] border border-[#242429] flex items-center justify-center font-sans font-bold text-[#F4F4F6] text-xs shrink-0">
                          {comment.authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-[#F4F4F6]">
                              {comment.authorName}
                            </span>
                            <span className="text-[10px] text-[#8E8E99] font-sans">
                              {comment.authorHandle}
                            </span>
                            {isPinned && (
                              <span className="text-[9px] font-sans font-bold text-[#FF4F00] bg-[#FF4F00]/10 px-1.5 py-0.2 rounded-[4px] border border-[#FF4F00]/30 flex items-center gap-0.5">
                                <Pin className="w-2.5 h-2.5" /> Fijado
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#52525B] font-sans">
                            {comment.timeAgo}
                          </span>
                        </div>
                      </div>

                      {/* Interaction Buttons for the Artist */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleHeartComment(activeVideoSong.id, comment.id)}
                          className={`p-1.5 rounded-[4px] border transition-all cursor-pointer ${
                            isHearted
                              ? 'bg-[#EF4444]/10 border-[#EF4444]/40 text-[#EF4444]'
                              : 'bg-[#18181C] border-[#242429] text-[#8E8E99] hover:text-[#EF4444]'
                          }`}
                          title={isHearted ? 'Quitar corazón' : 'Dar corazón de artista'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isHearted ? 'fill-[#EF4444]' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePinComment(activeVideoSong.id, comment.id)}
                          className={`p-1.5 rounded-[4px] border transition-all cursor-pointer ${
                            isPinned
                              ? 'bg-[#FF4F00]/10 border-[#FF4F00] text-[#FF4F00]'
                              : 'bg-[#18181C] border-[#242429] text-[#8E8E99] hover:text-[#F4F4F6]'
                          }`}
                          title={isPinned ? 'Desfijar comentario' : 'Fijar arriba'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#D4D4D8] mt-2.5 leading-relaxed">
                      {comment.content}
                    </p>

                    <div className="flex items-center gap-4 mt-2.5 text-[11px] text-[#8E8E99] font-sans">
                      <span className="flex items-center gap-1 text-[#00E599] tabular-nums">
                        👍 {comment.likes.toLocaleString('es-AR')} likes
                      </span>
                      {isHearted && (
                        <span className="text-[#EF4444] text-[10px] flex items-center gap-1">
                          ❤️ Marcado con corazón por {player.name}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 4: TIKTOK / REELS SNIPPET LAB --- */}
      {activeTab === 'tiktok' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Campaign Form */}
          <div className="lg:col-span-2 liquid-glass-card p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#F4F4F6] flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#FF4F00]" />
                Estudio de Snippets Virales (TikTok & Reels)
              </h2>
              <p className="text-xs text-[#8E8E99] mt-1">
                Lanza una campaña previa al estreno o impulsa un tema existente mediante trends de audio, coreografías y creadores influyentes.
              </p>
            </div>

            <div className="space-y-4">
              {/* Song Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#D4D4D8]">
                  1. Canción Objetivo
                </label>
                <select
                  value={selectedSnippetSongId}
                  onChange={(e) => setSelectedSnippetSongId(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#242429] rounded-[4px] p-3 text-xs text-[#F4F4F6] focus:border-[#3F3F46] focus:outline-hidden"
                >
                  <option value="">-- Selecciona una canción del catálogo --</option>
                  {playerSongs.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({world.genres[s.genreId]?.name || 'Urbano'}) • Q: {s.quality}%
                    </option>
                  ))}
                </select>
              </div>

              {/* Concept Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#D4D4D8]">
                  2. Concepto Creativo del Trend
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'Trend de Baile & Coreografía', desc: 'Paso de baile sincopado diseñado para replicarse masivamente.' },
                    { id: 'Audio Meme Acelerado (Sped Up)', desc: 'Versión acelerada con pitch alto, perfecta para clips cómicos.' },
                    { id: 'Drop Épico de Gimnasio / Motivación', desc: 'Audio explosivo para videos de fitness, adrenalina y superación.' },
                    { id: 'POV Melancólico / Desamor', desc: 'Letra sentimental para videos nocturnos, nostalgia y recuerdos.' },
                    { id: 'Lip-Sync Glow-Up', desc: 'Transición antes/después con el gancho más pegadizo del estribillo.' }
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        playSound('click');
                        setSnippetConcept(c.id);
                      }}
                      className={`p-3 rounded-[4px] border text-left transition-all cursor-pointer ${
                        snippetConcept === c.id
                          ? 'bg-[#FF4F00]/10 border-[#FF4F00] text-[#F4F4F6]'
                          : 'bg-[#09090B] border-[#242429] text-[#8E8E99] hover:border-[#3F3F46]'
                      }`}
                    >
                      <span className="text-xs font-bold block text-[#F4F4F6]">{c.id}</span>
                      <span className="text-[10px] text-[#8E8E99] block mt-1">{c.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Influencer Tier & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#D4D4D8]">
                    3. Nivel de Creadores
                  </label>
                  <select
                    value={snippetTier}
                    onChange={(e) => {
                      playSound('click');
                      setSnippetTier(e.target.value as any);
                    }}
                    className="w-full bg-[#09090B] border border-[#242429] rounded-[4px] p-3 text-xs text-[#F4F4F6] focus:border-[#3F3F46] focus:outline-hidden"
                  >
                    <option value="micro">Micro-Influencers (10k - 50k seguidores)</option>
                    <option value="macro">Macro-Creadores (100k - 500k seguidores)</option>
                    <option value="mega">Estrellas de TikTok (1M+ seguidores)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#D4D4D8] flex justify-between">
                    <span>4. Presupuesto Invertido:</span>
                    <strong className="text-[#00E599] font-sans tabular-nums">${snippetBudget.toLocaleString('es-AR')}</strong>
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="20000"
                    step="500"
                    value={snippetBudget}
                    onChange={(e) => setSnippetBudget(Number(e.target.value))}
                    className="w-full accent-[#FF4F00] cursor-pointer"
                  />
                  <span className="text-[10px] text-[#8E8E99] font-sans block tabular-nums">
                    Fondos disponibles: ${player.stats.funds.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleExecuteSnippet}
                  disabled={!selectedSnippetSongId || snippetBudget > player.stats.funds}
                  className={`w-full py-3.5 rounded-[4px] text-xs font-sans font-bold transition-all flex items-center justify-center gap-2 ${
                    !selectedSnippetSongId || snippetBudget > player.stats.funds
                      ? 'bg-[#18181C] text-[#52525B] border border-[#242429] cursor-not-allowed opacity-50'
                      : 'bg-[#FF4F00] hover:bg-[#E04500] text-white cursor-pointer active:translate-y-[1px]'
                  }`}
                >
                  <Flame className="w-4 h-4" />
                  <span>
                    {snippetBudget > player.stats.funds
                      ? 'Fondos Insuficientes'
                      : 'Lanzar Campaña Viral de Snippets'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="space-y-6">
            <div className="liquid-glass-card p-6 space-y-4">
              <h2 className="text-base font-bold text-[#F4F4F6] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00E599]" />
                Impacto de la Última Campaña
              </h2>

              {lastSnippetResult ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-[4px] bg-[#09090B] border border-[#242429] space-y-2">
                    <span className="text-[10px] font-sans font-bold uppercase px-2 py-0.5 rounded-[4px] bg-[#FF4F00]/10 text-[#FF4F00] border border-[#FF4F00]/30">
                      Trend {(lastSnippetResult.viralTier || 'viral').toUpperCase()}
                    </span>
                    <h3 className="text-sm font-bold text-[#F4F4F6]">
                      {lastSnippetResult.headline || lastSnippetResult.concept || 'Campaña Viral'}
                    </h3>
                    <p className="text-xs text-[#D4D4D8] leading-relaxed">
                      {lastSnippetResult.communityReaction || lastSnippetResult.summary || ''}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                    <div className="p-3 rounded-[4px] bg-[#09090B] border border-[#242429]">
                      <span className="text-[10px] text-[#8E8E99] block uppercase">Vistas TikTok</span>
                      <span className="text-sm font-bold text-[#FF4F00] tabular-nums">
                        {(lastSnippetResult.tiktokViews ?? lastSnippetResult.viewsGenerated ?? 0).toLocaleString('es-AR')}
                      </span>
                    </div>
                    <div className="p-3 rounded-[4px] bg-[#09090B] border border-[#242429]">
                      <span className="text-[10px] text-[#8E8E99] block uppercase">Videos UGC</span>
                      <span className="text-sm font-bold text-[#38BDF8] tabular-nums">
                        {(lastSnippetResult.ugcCreations ?? lastSnippetResult.creationsCount ?? 0).toLocaleString('es-AR')}
                      </span>
                    </div>
                    <div className="p-3 rounded-[4px] bg-[#09090B] border border-[#242429]">
                      <span className="text-[10px] text-[#8E8E99] block uppercase">Streams Ganados</span>
                      <span className="text-sm font-bold text-[#00E599] tabular-nums">
                        +{(lastSnippetResult.streamsBoostGenerated ?? lastSnippetResult.streamingConversions ?? 0).toLocaleString('es-AR')}
                      </span>
                    </div>
                    <div className="p-3 rounded-[4px] bg-[#09090B] border border-[#242429]">
                      <span className="text-[10px] text-[#8E8E99] block uppercase">Hype Creado</span>
                      <span className="text-sm font-bold text-[#F59E0B] tabular-nums">
                        +{lastSnippetResult.hypeGained ?? lastSnippetResult.hypeGenerated ?? 0} pts
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#8E8E99] italic py-8 text-center">
                  Aún no has ejecutado ninguna campaña de snippets esta temporada.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- PITCH MODAL --- */}
      {pitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in">
          <div className="w-full max-w-lg liquid-glass-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-base font-bold text-[#F4F4F6] flex items-center gap-2">
                <Send className="w-4 h-4 text-[#FF4F00]" />
                Pitch Editorial de Canción
              </h3>
              <button
                onClick={() => {
                  playSound('click');
                  setPitchModalOpen(false);
                  setPitchFeedback(null);
                }}
                className="text-[#8E8E99] hover:text-[#F4F4F6] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#D4D4D8]">
                  Canción a postular
                </label>
                <select
                  value={selectedPitchSongId}
                  onChange={(e) => setSelectedPitchSongId(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#242429] rounded-[4px] p-3 text-xs text-[#F4F4F6] focus:border-[#3F3F46] focus:outline-hidden"
                >
                  <option value="">-- Elige un tema del catálogo --</option>
                  {playerSongs.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title} (Q: {s.quality}% • {world.genres[s.genreId]?.name || 'Urbano'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#D4D4D8]">
                  Playlist Editorial objetivo
                </label>
                <select
                  value={selectedPitchPlaylistId}
                  onChange={(e) => setSelectedPitchPlaylistId(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#242429] rounded-[4px] p-3 text-xs text-[#F4F4F6] focus:border-[#3F3F46] focus:outline-hidden"
                >
                  {activePlaylists.map(pl => (
                    <option key={pl.id} value={pl.id}>
                      {pl.name} ({pl.followers.toLocaleString('es-AR')} seg. • x{pl.streamMultiplier})
                    </option>
                  ))}
                </select>
              </div>

              {pitchFeedback && (
                <div className={`p-3.5 rounded-[4px] text-xs font-sans ${
                  pitchFeedback.success
                    ? 'bg-[#00E599]/10 border border-[#00E599]/40 text-[#00E599]'
                    : 'bg-[#EF4444]/10 border border-[#EF4444]/40 text-[#EF4444]'
                }`}>
                  {pitchFeedback.message}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setPitchModalOpen(false);
                    setPitchFeedback(null);
                  }}
                  className="px-4 py-2 rounded-[4px] bg-[#18181C] text-[#8E8E99] hover:text-[#F4F4F6] border border-[#242429] text-xs font-sans font-semibold transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={handleExecutePitch}
                  disabled={!selectedPitchSongId}
                  className="px-5 py-2.5 rounded-[4px] bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-sans font-bold transition-all cursor-pointer disabled:opacity-50 active:translate-y-[1px]"
                >
                  Enviar a Curadores
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
