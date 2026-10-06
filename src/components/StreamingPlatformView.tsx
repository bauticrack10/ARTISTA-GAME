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
  Sparkles,
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
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* --- PLATFORM ARTIST BANNER (SPOTIFY / SOUNDWAVE STYLE) --- */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#1E1B4B] via-[#16181F] to-[#0B0C10] border border-[#2A2E3D] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 relative z-10">
          {/* Avatar with Sound Reactive Ring */}
          <div className="relative group shrink-0">
            <ArtistAvatar
              name={player.name}
              avatarColor={player.avatarColor}
              avatarIcon={player.avatarIcon}
              size="2xl"
              rounded="rounded-2xl"
              className="shadow-2xl border-2 border-white/20"
            />
            {playingSongId && (
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center backdrop-blur-xs">
                <Radio className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>
            )}
          </div>

          {/* Artist Stats & Bio */}
          <div className="space-y-2 text-center md:text-left flex-1 min-w-0">
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-400 bg-sky-950/60 border border-sky-500/40 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 fill-sky-400 text-black" />
                Artista Verificado
              </span>
              <span className="text-xs text-[#94A3B8] font-semibold">
                {player.country} • {world.genres[player.mainGenreId]?.name || 'Urbano'}
              </span>
              <span className="text-[11px] font-bold text-[#C084FC] bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 px-2.5 py-0.5 rounded-full">
                {player.careerStage}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#F8FAFC] tracking-tight truncate">
              {player.name}
            </h1>

            <div className="flex items-center justify-center md:justify-start gap-6 pt-1 text-xs">
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase font-semibold">Oyentes Mensuales</span>
                <span className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
                  {player.stats.monthlyListeners.toLocaleString('es-AR')}
                </span>
              </div>
              <div className="w-px h-8 bg-[#2A2E3D]" />
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase font-semibold">Streams Totales</span>
                <span className="text-lg sm:text-xl font-bold font-mono text-[#C084FC]">
                  {(player.stats.totalStreams / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="w-px h-8 bg-[#2A2E3D]" />
              <div>
                <span className="text-[#94A3B8] block text-[10px] uppercase font-semibold">Seguidores / Fans</span>
                <span className="text-lg sm:text-xl font-bold font-mono text-[#F8FAFC]">
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
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-bold shadow-[0_0_15px_rgba(139,92,246,0.35)] hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Pitch a Curadores</span>
            </button>
            <button
              onClick={() => {
                playSound('click');
                alert(`Perfil oficial de ${player.name} copiado al portapapeles.`);
              }}
              className="p-2 rounded-xl bg-[#16181F] hover:bg-[#1C1F28] border border-[#2A2E3D] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
              title="Compartir perfil"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto scrollbar-none text-xs font-semibold">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#8B5CF6] text-white shadow-md'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.04]'
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
          <div className="lg:col-span-2 bg-[#16181F] border border-[#2A2E3D] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-3">
              <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <Disc3 className="w-4 h-4 text-[#8B5CF6]" />
                Top 5 Canciones Más Populares
              </h2>
              <span className="text-xs text-[#94A3B8] font-mono">
                Ordenado por reproducciones globales
              </span>
            </div>

            {topSongs.length === 0 ? (
              <p className="text-xs text-[#94A3B8] italic py-8 text-center">
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
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isPlaying
                          ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]'
                          : 'bg-[#0B0C10] border-[#2A2E3D] hover:border-[#8B5CF6]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-5 text-center font-mono font-bold text-xs text-[#94A3B8]">
                          {idx + 1}
                        </span>

                        <button
                          onClick={() => handleTogglePlaySong(song.id)}
                          className="w-8 h-8 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs transition-transform active:scale-95"
                          title={isPlaying ? 'Pausar tema' : 'Reproducir preview'}
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                        </button>

                        <div className="min-w-0">
                          <h3 className="text-xs font-bold text-[#F8FAFC] truncate">
                            {song.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8]">
                            <span>{world.genres[song.genreId]?.name || 'Urbano'}</span>
                            {song.isSingle && <span className="text-[#C084FC]">• Single</span>}
                            {song.musicVideo && <span className="text-cyan-400">• Videoclip</span>}
                            {song.wentViral && <span className="text-pink-400 font-bold">• Viral</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 shrink-0 text-xs font-mono">
                        <div className="w-20 hidden sm:block">
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] rounded-full"
                              style={{ width: `${popPct}%` }}
                            />
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-emerald-400 font-bold block">
                            {song.streamsLastMonth.toLocaleString('es-AR')} /mes
                          </span>
                          <span className="text-[10px] text-[#94A3B8] block">
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
            <div className="bg-[#16181F] border border-[#2A2E3D] rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                Presencia Editorial
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Las canciones incluidas en listas editoriales reciben un multiplicador permanente en sus reproducciones mensuales.
              </p>

              <div className="space-y-3 pt-2">
                {activePlaylists.slice(0, 3).map(pl => {
                  const playerTracksInPl = (pl.trackIds || []).filter(sId => world.songs[sId]?.artistId === player.id);
                  return (
                    <div key={pl.id} className="p-3 rounded-xl bg-[#0B0C10] border border-[#2A2E3D] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-[#F8FAFC] block">{pl.name}</span>
                        <span className="text-[10px] text-[#94A3B8]">{pl.followers.toLocaleString('es-AR')} seguidores</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        playerTracksInPl.length > 0
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/5 text-[#94A3B8]'
                      }`}>
                        {playerTracksInPl.length > 0 ? `${playerTracksInPl.length} temas dentro` : 'Sin temas'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setActiveTab('playlists')}
                className="w-full py-2 rounded-xl bg-[#0B0C10] hover:bg-white/[0.04] border border-[#2A2E3D] text-xs font-semibold text-[#CBD5E1] transition-colors cursor-pointer"
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#16181F] border border-[#2A2E3D] rounded-2xl p-6">
            <div>
              <h2 className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#8B5CF6]" />
                Circuito de Playlists Editoriales & Algorítmicas
              </h2>
              <p className="text-xs text-[#94A3B8] mt-1">
                Ecosistema de listas curadas por equipos editoriales globales. Ingresar en una de ellas multiplica tus oyentes exponencialmente.
              </p>
            </div>

            <button
              onClick={() => {
                playSound('click');
                setPitchModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
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
                  className="bg-[#16181F] border border-[#2A2E3D] hover:border-[#8B5CF6]/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group shadow-md"
                >
                  <div className={`p-4 bg-gradient-to-r ${playlist.coverGradient} text-white relative`}>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-black/40 border border-white/20">
                      {playlist.curator}
                    </span>
                    <h3 className="text-base font-black tracking-tight mt-2 drop-shadow-xs">
                      {playlist.name}
                    </h3>
                    <p className="text-[11px] text-white/80 line-clamp-2 mt-1">
                      {playlist.description}
                    </p>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-[#94A3B8]">
                        <span>Seguidores:</span>
                        <span className="text-[#F8FAFC] font-bold">
                          {playlist.followers.toLocaleString('es-AR')}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#94A3B8]">
                        <span>Multiplicador Streams:</span>
                        <span className="text-emerald-400 font-bold">
                          x{playlist.streamMultiplier}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#94A3B8]">
                        <span>Temas Totales:</span>
                        <span className="text-[#CBD5E1]">
                          {tracksInPlaylist.length} canciones
                        </span>
                      </div>
                    </div>

                    {playerTracksInPlaylist.length > 0 ? (
                      <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs space-y-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 block flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          ¡Tu música está dentro!
                        </span>
                        {playerTracksInPlaylist.map(track => (
                          <span key={track.id} className="block text-[11px] truncate font-semibold text-white">
                            • "{track.title}"
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-[#0B0C10] border border-[#2A2E3D] text-[11px] text-[#94A3B8] text-center">
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
          <div className="bg-[#16181F] border border-[#2A2E3D] rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
              <Video className="w-4 h-4 text-cyan-400" />
              Seleccionar Lanzamiento
            </h2>
            <p className="text-xs text-[#94A3B8]">
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
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white shadow-xs'
                        : 'bg-[#0B0C10] border-[#2A2E3D] text-[#94A3B8] hover:border-[#8B5CF6]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F8FAFC] truncate">
                        {song.title}
                      </span>
                      {song.musicVideo && (
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.2 rounded">
                          🎬 4K
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#94A3B8] font-mono block mt-0.5">
                      {song.musicVideo ? `${(song.musicVideo.views || 0).toLocaleString('es-AR')} vistas` : 'Solo Audio'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comments Stream */}
          <div className="lg:col-span-2 bg-[#16181F] border border-[#2A2E3D] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-pink-400" />
                  Comentarios de la Comunidad: "{activeVideoSong?.title || 'Tema'}"
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
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
                    className={`p-4 rounded-xl border transition-all ${
                      isPinned
                        ? 'bg-gradient-to-r from-purple-950/30 to-[#16181F] border-[#8B5CF6]/60 shadow-xs'
                        : 'bg-[#0B0C10] border-[#2A2E3D]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${comment.avatarGradient} flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-xs`}>
                          {comment.authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-[#F8FAFC]">
                              {comment.authorName}
                            </span>
                            <span className="text-[10px] text-[#94A3B8] font-mono">
                              {comment.authorHandle}
                            </span>
                            {isPinned && (
                              <span className="text-[9px] font-bold text-[#C084FC] bg-[#8B5CF6]/30 px-1.5 py-0.2 rounded border border-[#8B5CF6]/40 flex items-center gap-0.5">
                                <Pin className="w-2.5 h-2.5" /> Fijado
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#64748B]">
                            {comment.timeAgo}
                          </span>
                        </div>
                      </div>

                      {/* Interaction Buttons for the Artist */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleHeartComment(activeVideoSong.id, comment.id)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            isHearted
                              ? 'bg-rose-950/60 border-rose-500/50 text-rose-400'
                              : 'bg-[#16181F] border-[#2A2E3D] text-[#94A3B8] hover:text-rose-400'
                          }`}
                          title={isHearted ? 'Quitar corazón' : 'Dar corazón de artista'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isHearted ? 'fill-rose-400' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePinComment(activeVideoSong.id, comment.id)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            isPinned
                              ? 'bg-[#8B5CF6]/30 border-[#8B5CF6] text-white'
                              : 'bg-[#16181F] border-[#2A2E3D] text-[#94A3B8] hover:text-white'
                          }`}
                          title={isPinned ? 'Desfijar comentario' : 'Fijar arriba'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#CBD5E1] mt-2.5 leading-relaxed">
                      {comment.content}
                    </p>

                    <div className="flex items-center gap-4 mt-2.5 text-[11px] text-[#94A3B8] font-mono">
                      <span className="flex items-center gap-1 text-emerald-400">
                        👍 {comment.likes.toLocaleString('es-AR')} likes
                      </span>
                      {isHearted && (
                        <span className="text-rose-400 text-[10px] flex items-center gap-1">
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
          <div className="lg:col-span-2 bg-[#16181F] border border-[#2A2E3D] rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <Flame className="w-5 h-5 text-pink-400" />
                Estudio de Snippets Virales (TikTok & Reels)
              </h2>
              <p className="text-xs text-[#94A3B8] mt-1">
                Lanza una campaña previa al estreno o impulsa un tema existente mediante trends de audio, coreografías y creadores influyentes.
              </p>
            </div>

            <div className="space-y-4">
              {/* Song Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#CBD5E1]">
                  1. Canción Objetivo
                </label>
                <select
                  value={selectedSnippetSongId}
                  onChange={(e) => setSelectedSnippetSongId(e.target.value)}
                  className="w-full bg-[#0B0C10] border border-[#2A2E3D] rounded-xl p-3 text-xs text-[#F8FAFC] focus:border-[#8B5CF6] focus:outline-hidden"
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
                <label className="text-xs font-semibold text-[#CBD5E1]">
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
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        snippetConcept === c.id
                          ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white shadow-xs'
                          : 'bg-[#0B0C10] border-[#2A2E3D] text-[#94A3B8] hover:border-[#8B5CF6]/40'
                      }`}
                    >
                      <span className="text-xs font-bold block text-[#F8FAFC]">{c.id}</span>
                      <span className="text-[10px] text-[#94A3B8] block mt-1">{c.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Influencer Tier & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#CBD5E1]">
                    3. Nivel de Creadores
                  </label>
                  <select
                    value={snippetTier}
                    onChange={(e) => {
                      playSound('click');
                      setSnippetTier(e.target.value as any);
                    }}
                    className="w-full bg-[#0B0C10] border border-[#2A2E3D] rounded-xl p-3 text-xs text-[#F8FAFC] focus:border-[#8B5CF6] focus:outline-hidden"
                  >
                    <option value="micro">Micro-Influencers (10k - 50k seguidores)</option>
                    <option value="macro">Macro-Creadores (100k - 500k seguidores)</option>
                    <option value="mega">Estrellas de TikTok (1M+ seguidores)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#CBD5E1] flex justify-between">
                    <span>4. Presupuesto Invertido:</span>
                    <strong className="text-emerald-400 font-mono">${snippetBudget.toLocaleString('es-AR')}</strong>
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="20000"
                    step="500"
                    value={snippetBudget}
                    onChange={(e) => setSnippetBudget(Number(e.target.value))}
                    className="w-full accent-[#8B5CF6] cursor-pointer"
                  />
                  <span className="text-[10px] text-[#94A3B8] block">
                    Fondos disponibles: ${player.stats.funds.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleExecuteSnippet}
                  disabled={!selectedSnippetSongId || snippetBudget > player.stats.funds}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    !selectedSnippetSongId || snippetBudget > player.stats.funds
                      ? 'bg-[#2A2E3D] text-[#64748B] cursor-not-allowed opacity-50'
                      : 'bg-gradient-to-r from-pink-500 via-[#8B5CF6] to-purple-600 text-white shadow-lg hover:opacity-95 cursor-pointer'
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
            <div className="bg-[#16181F] border border-[#2A2E3D] rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Impacto de la Última Campaña
              </h2>

              {lastSnippetResult ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-xl bg-[#0B0C10] border border-[#8B5CF6]/50 space-y-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-pink-950/60 text-pink-300 border border-pink-500/30">
                      Trend {lastSnippetResult.viralTier.toUpperCase()}
                    </span>
                    <h3 className="text-sm font-bold text-[#F8FAFC]">
                      {lastSnippetResult.concept}
                    </h3>
                    <p className="text-xs text-[#CBD5E1] leading-relaxed">
                      {lastSnippetResult.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-[#0B0C10] border border-[#2A2E3D]">
                      <span className="text-[10px] text-[#94A3B8] block uppercase">Vistas TikTok</span>
                      <span className="text-sm font-bold text-pink-400">
                        {lastSnippetResult.viewsGenerated.toLocaleString('es-AR')}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0B0C10] border border-[#2A2E3D]">
                      <span className="text-[10px] text-[#94A3B8] block uppercase">Videos UGC</span>
                      <span className="text-sm font-bold text-cyan-400">
                        {lastSnippetResult.creationsCount.toLocaleString('es-AR')}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0B0C10] border border-[#2A2E3D]">
                      <span className="text-[10px] text-[#94A3B8] block uppercase">Streams Ganados</span>
                      <span className="text-sm font-bold text-emerald-400">
                        +{lastSnippetResult.streamingConversions.toLocaleString('es-AR')}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0B0C10] border border-[#2A2E3D]">
                      <span className="text-[10px] text-[#94A3B8] block uppercase">Hype Creado</span>
                      <span className="text-sm font-bold text-amber-400">
                        +{lastSnippetResult.hypeGenerated} pts
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#94A3B8] italic py-8 text-center">
                  Aún no has ejecutado ninguna campaña de snippets esta temporada.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- PITCH MODAL --- */}
      {pitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-[#0B0C10] border border-[#2A2E3D] rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-3">
              <h3 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                Pitch Editorial de Canción
              </h3>
              <button
                onClick={() => {
                  playSound('click');
                  setPitchModalOpen(false);
                  setPitchFeedback(null);
                }}
                className="text-[#94A3B8] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#CBD5E1]">
                  Canción a postular
                </label>
                <select
                  value={selectedPitchSongId}
                  onChange={(e) => setSelectedPitchSongId(e.target.value)}
                  className="w-full bg-[#16181F] border border-[#2A2E3D] rounded-xl p-3 text-xs text-[#F8FAFC] focus:border-[#8B5CF6] focus:outline-hidden"
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
                <label className="text-xs font-semibold text-[#CBD5E1]">
                  Playlist Editorial objetivo
                </label>
                <select
                  value={selectedPitchPlaylistId}
                  onChange={(e) => setSelectedPitchPlaylistId(e.target.value)}
                  className="w-full bg-[#16181F] border border-[#2A2E3D] rounded-xl p-3 text-xs text-[#F8FAFC] focus:border-[#8B5CF6] focus:outline-hidden"
                >
                  {activePlaylists.map(pl => (
                    <option key={pl.id} value={pl.id}>
                      {pl.name} ({pl.followers.toLocaleString('es-AR')} seg. • x{pl.streamMultiplier})
                    </option>
                  ))}
                </select>
              </div>

              {pitchFeedback && (
                <div className={`p-3.5 rounded-xl text-xs ${
                  pitchFeedback.success
                    ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/50 border border-rose-500/40 text-rose-300'
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
                  className="px-4 py-2 rounded-xl bg-[#16181F] text-[#94A3B8] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={handleExecutePitch}
                  disabled={!selectedPitchSongId}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-bold hover:opacity-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
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
