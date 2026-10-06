import React, { useState } from 'react';
import {
  Artist,
  WorldState,
  GlobalFestival,
  FestivalSlot,
  StageProductionConfig,
  LiveShowDilemma,
  LiveShowResult,
  FestivalInvitation
} from '../types';
import {
  GLOBAL_FESTIVALS,
  LIVE_SHOW_DILEMMAS,
  STAGE_PRODUCTION_COSTS,
  FestivalEngine
} from '../systems/FestivalEngine';
import { playSound } from '../utils/audioSystem';
import { formatMoney } from '../utils/formatters';
import {
  Sparkles,
  Flame,
  Tv,
  Users,
  Mic2,
  AlertTriangle,
  Trophy,
  CheckCircle2,
  Calendar,
  MapPin,
  X,
  Play,
  Star,
  Zap,
  TrendingUp,
  Volume2,
  Radio,
  Eye,
  HelpCircle,
  Clock
} from 'lucide-react';

interface LiveShowModalProps {
  festival: GlobalFestival;
  slot: FestivalSlot;
  invitation?: FestivalInvitation;
  player: Artist;
  world: WorldState;
  onClose: () => void;
  onExecuteShow: (params: {
    festivalId: string;
    slot: FestivalSlot;
    setlistSongIds: string[];
    production: StageProductionConfig;
    dilemmaChoiceId?: string;
    invitationId?: string;
  }) => LiveShowResult;
}

export const LiveShowModal: React.FC<LiveShowModalProps> = ({
  festival,
  slot,
  invitation,
  player,
  world,
  onClose,
  onExecuteShow
}) => {
  // Wizard steps: 'setup' -> 'dilemma' -> 'result'
  const [step, setStep] = useState<'setup' | 'dilemma' | 'result'>('setup');

  // Stage Production Setup
  const [visuals, setVisuals] = useState<'basic' | '3d_screens' | 'monumental_mapping'>('basic');
  const [pyro, setPyro] = useState<'none' | 'sparks_fog' | 'flamethrowers_lasers'>('none');
  const [crew, setCrew] = useState<'solo_dj' | 'live_band' | 'elite_dancers_choir'>('solo_dj');

  // Setlist Selection (up to 5 songs)
  const playerSongs = Object.values(world.songs || {}).filter(s => s.artistId === player.id);
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>(() => {
    // Default: top songs by popularity/streams
    return [...playerSongs]
      .sort((a, b) => (b.streamsTotal || 0) - (a.streamsTotal || 0))
      .slice(0, 5)
      .map(s => s.id);
  });

  // Pick a random dilemma for this show
  const [currentDilemma] = useState<LiveShowDilemma>(() => {
    const randomIndex = Math.floor(Math.random() * LIVE_SHOW_DILEMMAS.length);
    return LIVE_SHOW_DILEMMAS[randomIndex];
  });
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  // Result state
  const [showResult, setShowResult] = useState<LiveShowResult | null>(null);

  // Financial Calculations
  const currentProductionConfig: StageProductionConfig = {
    visuals,
    pyro,
    crew,
    guestArtistIds: []
  };
  const productionCost = FestivalEngine.calculateProductionCost(currentProductionConfig);
  const estimatedPayout = invitation ? invitation.payout : 35000;
  const isFundsInsufficient = productionCost > player.stats.funds;
  const isEnergyInsufficient = player.stats.energy < 20;

  const handleToggleSong = (songId: string) => {
    playSound('click');
    if (selectedSongIds.includes(songId)) {
      setSelectedSongIds(prev => prev.filter(id => id !== songId));
    } else {
      if (selectedSongIds.length >= 6) return;
      setSelectedSongIds(prev => [...prev, songId]);
    }
  };

  const handleProceedToDilemma = () => {
    if (isFundsInsufficient || isEnergyInsufficient) return;
    playSound('level_up');
    setStep('dilemma');
  };

  const handleResolveAndPerform = (choiceId?: string) => {
    try {
      const finalChoice = choiceId || selectedChoiceId || undefined;
      const result = onExecuteShow({
        festivalId: festival.id,
        slot,
        setlistSongIds: selectedSongIds,
        production: currentProductionConfig,
        dilemmaChoiceId: finalChoice,
        invitationId: invitation?.id
      });
      setShowResult(result);
      playSound('chart_no1');
      setStep('result');
    } catch (err: any) {
      alert(err.message || 'Error al ejecutar el show en vivo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#0B0C10] border border-[#2A2E3D] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className={`p-5 sm:p-6 bg-gradient-to-r ${festival.bannerGradient} text-white relative flex items-start justify-between shrink-0`}>
          <div className="space-y-1 pr-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-xs">
                🎪 Festival Mundial • {festival.country}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                {FestivalEngine.getSlotTitle(slot)}
              </span>
              <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-300" />
                Prestigio {festival.prestige}/100
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-md">
              {festival.name}
            </h2>
            <p className="text-xs text-white/90 flex items-center gap-1.5 drop-shadow-xs">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {festival.location} • {festival.capacity.toLocaleString('es-AR')} espectadores por día
            </p>
          </div>

          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: SETUP */}
          {step === 'setup' && (
            <div className="space-y-6">
              {/* Financial & Energy Status Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#16181F] border border-[#2A2E3D]">
                  <span className="text-[10px] uppercase font-semibold text-[#94A3B8] block">Caché Bruto</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    +{formatMoney(estimatedPayout)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#16181F] border border-[#2A2E3D]">
                  <span className="text-[10px] uppercase font-semibold text-[#94A3B8] block">Costo Escénico</span>
                  <span className="text-base font-bold font-mono text-rose-400">
                    -{formatMoney(productionCost)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#16181F] border border-[#2A2E3D]">
                  <span className="text-[10px] uppercase font-semibold text-[#94A3B8] block">Ganancia Neta Estimada</span>
                  <span className={`text-base font-bold font-mono ${estimatedPayout - productionCost >= 0 ? 'text-[#C084FC]' : 'text-rose-400'}`}>
                    {formatMoney(estimatedPayout - productionCost)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#16181F] border border-[#2A2E3D]">
                  <span className="text-[10px] uppercase font-semibold text-[#94A3B8] block">Consumo de Energía</span>
                  <span className="text-base font-bold font-mono text-amber-400 flex items-center gap-1">
                    <Zap className="w-4 h-4 text-amber-400" />
                    ~25% - 40%
                  </span>
                </div>
              </div>

              {/* Stage Production Choices */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                  <Tv className="w-4 h-4 text-[#8B5CF6]" />
                  1. Producción Escénica & Espectáculo Visual
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Visuals */}
                  <div className="p-3.5 rounded-xl bg-[#16181F] border border-[#2A2E3D] space-y-2">
                    <label className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                      <Tv className="w-3.5 h-3.5 text-blue-400" />
                      Pantallas & Visuales
                    </label>
                    <select
                      value={visuals}
                      onChange={(e) => {
                        playSound('click');
                        setVisuals(e.target.value as any);
                      }}
                      className="w-full bg-[#0B0C10] border border-[#2A2E3D] rounded-lg p-2 text-xs text-[#F8FAFC] focus:border-[#8B5CF6] focus:outline-hidden"
                    >
                      <option value="basic">Visuales Básicos LED ($0)</option>
                      <option value="3d_screens">Pantallas 3D Reactivas ($15.000)</option>
                      <option value="monumental_mapping">Monumental Mapping & Láseres ($45.000)</option>
                    </select>
                    <p className="text-[11px] text-[#94A3B8]">
                      {visuals === 'basic' && 'Pantalla estándar provista por el festival.'}
                      {visuals === '3d_screens' && '+10% Euforia de audiencia y mayor atención en redes.'}
                      {visuals === 'monumental_mapping' && '+25% Euforia, viralidad y ovación de la prensa.'}
                    </p>
                  </div>

                  {/* Pyro */}
                  <div className="p-3.5 rounded-xl bg-[#16181F] border border-[#2A2E3D] space-y-2">
                    <label className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      Efectos & Pirotecnia
                    </label>
                    <select
                      value={pyro}
                      onChange={(e) => {
                        playSound('click');
                        setPyro(e.target.value as any);
                      }}
                      className="w-full bg-[#0B0C10] border border-[#2A2E3D] rounded-lg p-2 text-xs text-[#F8FAFC] focus:border-[#8B5CF6] focus:outline-hidden"
                    >
                      <option value="none">Sin Pirotecnia ($0)</option>
                      <option value="sparks_fog">Chispas Frías & Niebla ($8.000)</option>
                      <option value="flamethrowers_lasers">Lanzallamas & Humo Criotécnico ($25.000)</option>
                    </select>
                    <p className="text-[11px] text-[#94A3B8]">
                      {pyro === 'none' && 'Show acústico y visual austero.'}
                      {pyro === 'sparks_fog' && 'Destellos en los drops y estribillos.'}
                      {pyro === 'flamethrowers_lasers' && 'Lanzallamas masivos en cada clímax (+18% Euforia).'}
                    </p>
                  </div>

                  {/* Crew & Live Band */}
                  <div className="p-3.5 rounded-xl bg-[#16181F] border border-[#2A2E3D] space-y-2">
                    <label className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-pink-400" />
                      Elenco & Músicos
                    </label>
                    <select
                      value={crew}
                      onChange={(e) => {
                        playSound('click');
                        setCrew(e.target.value as any);
                      }}
                      className="w-full bg-[#0B0C10] border border-[#2A2E3D] rounded-lg p-2 text-xs text-[#F8FAFC] focus:border-[#8B5CF6] focus:outline-hidden"
                    >
                      <option value="solo_dj">Solo DJ / Pista Base ($0)</option>
                      <option value="live_band">Banda en Vivo Completa ($12.000)</option>
                      <option value="elite_dancers_choir">Cuerpo de Baile & Coro ($30.000)</option>
                    </select>
                    <p className="text-[11px] text-[#94A3B8]">
                      {crew === 'solo_dj' && 'Formato clásico urbano con DJ de apoyo.'}
                      {crew === 'live_band' && 'Batería acústica, bajo y guitarras (+Credibilidad).'}
                      {crew === 'elite_dancers_choir' && 'Coreografía de nivel MTV (+Impacto Pop).'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Setlist Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                    <Mic2 className="w-4 h-4 text-[#8B5CF6]" />
                    2. Armado de Setlist ({selectedSongIds.length}/6 temas seleccionados)
                  </h3>
                  <span className="text-[11px] text-[#94A3B8]">
                    Toca para añadir o quitar del repertorio en vivo
                  </span>
                </div>

                {playerSongs.length === 0 ? (
                  <p className="text-xs text-[#94A3B8] italic p-4 bg-[#16181F] rounded-xl text-center">
                    No tienes canciones lanzadas en tu catálogo aún.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {playerSongs.map(song => {
                      const isSelected = selectedSongIds.includes(song.id);
                      return (
                        <button
                          key={song.id}
                          type="button"
                          onClick={() => handleToggleSong(song.id)}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white shadow-xs'
                              : 'bg-[#16181F] border-[#2A2E3D] text-[#94A3B8] hover:border-[#8B5CF6]/50'
                          }`}
                        >
                          <div className="min-w-0">
                            <span className="text-xs font-semibold block text-[#F8FAFC] truncate">
                              {song.title}
                            </span>
                            <span className="text-[10px] text-[#94A3B8] font-mono block">
                              Q: {song.quality}% • {(song.streamsTotal / 1000000).toFixed(1)}M streams
                            </span>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                            isSelected ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white' : 'border-[#2A2E3D]'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Warning guards */}
              {isFundsInsufficient && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Fondos insuficientes para costear la producción escénica seleccionada (${productionCost.toLocaleString('es-AR')}). Reduce los efectos para continuar.</span>
                </div>
              )}
              {isEnergyInsufficient && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Tu energía es demasiado baja ({player.stats.energy}%). Necesitas al menos 20% de energía para subirte al escenario.</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: LIVE DILEMMA */}
          {step === 'dilemma' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-xl bg-[#16181F] border border-amber-500/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  ¡Suceso Inesperado en Pleno Concierto!
                </div>
                <h3 className="text-base font-bold text-[#F8FAFC]">
                  {currentDilemma.title}
                </h3>
                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  {currentDilemma.contextDescription}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                  ¿Cómo decides reaccionar en el escenario?
                </h4>
                <div className="space-y-2.5">
                  {currentDilemma.choices.map(choice => {
                    const isSelected = selectedChoiceId === choice.id;
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => {
                          playSound('click');
                          setSelectedChoiceId(choice.id);
                        }}
                        className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#8B5CF6]/25 to-[#EC4899]/20 border-[#8B5CF6] text-white shadow-md'
                            : 'bg-[#16181F] border-[#2A2E3D] hover:border-[#8B5CF6]/50 text-[#CBD5E1]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-bold text-[#F8FAFC]">
                            {choice.text}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            choice.scoreModifier > 0 ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                          }`}>
                            {choice.scoreModifier > 0 ? `+${choice.scoreModifier} Euforia` : `${choice.scoreModifier} Euforia`}
                          </span>
                        </div>
                        <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                          {choice.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: RESULT */}
          {step === 'result' && showResult && (
            <div className="space-y-6 animate-fade-in">
              {/* Score Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#16181F] to-emerald-950/40 border border-[#8B5CF6]/40 text-center space-y-2">
                <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-[#8B5CF6]/30 text-[#E9D5FF] border border-[#8B5CF6]/50">
                  {showResult.slotTitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#F8FAFC]">
                  {showResult.headline}
                </h3>
                <p className="text-xs text-[#94A3B8] max-w-lg mx-auto">
                  {showResult.subheadline}
                </p>

                <div className="flex items-center justify-center gap-6 pt-3 font-mono">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block uppercase">Calificación Show</span>
                    <span className="text-xl font-black text-amber-400">
                      {showResult.performanceScore}%
                    </span>
                  </div>
                  <div className="w-px h-8 bg-[#2A2E3D]" />
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block uppercase">Audiencia Real</span>
                    <span className="text-xl font-black text-emerald-400">
                      {showResult.attendance.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div className="w-px h-8 bg-[#2A2E3D]" />
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block uppercase">Ganancia Neta</span>
                    <span className="text-xl font-black text-[#C084FC]">
                      +{formatMoney(showResult.netProfit)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gains & Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#16181F] border border-[#2A2E3D]">
                  <span className="text-[10px] text-[#94A3B8] block uppercase">Nuevos Fans</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    +{showResult.fansGained.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#16181F] border border-[#2A2E3D]">
                  <span className="text-[10px] text-[#94A3B8] block uppercase">Hype Generado</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">
                    +{showResult.hypeGained} pts
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#16181F] border border-[#2A2E3D]">
                  <span className="text-[10px] text-[#94A3B8] block uppercase">Popularidad</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono">
                    +{showResult.popularityGained} pts
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#16181F] border border-[#2A2E3D]">
                  <span className="text-[10px] text-[#94A3B8] block uppercase">Energía Invertida</span>
                  <span className="text-sm font-bold text-rose-400 font-mono">
                    -{showResult.energyUsed}%
                  </span>
                </div>
              </div>

              {/* Press Reviews */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400" />
                  Veredicto de la Prensa Internacional
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {showResult.reviews.map((rev, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#16181F] border border-[#2A2E3D] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F8FAFC]">
                          {rev.outlet}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#CBD5E1] italic">
                        "{rev.quote}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {showResult.viralMomentOccurred && (
                <div className="p-3.5 rounded-xl bg-pink-950/40 border border-pink-500/40 text-pink-300 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
                  <span><strong>¡Momento Viral en Vivo!</strong> Videos del concierto alcanzaron millones de visualizaciones en TikTok, multiplicando las reproducciones en streaming.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-[#16181F] border-t border-[#2A2E3D] flex items-center justify-between shrink-0">
          <div className="text-xs text-[#94A3B8]">
            {step === 'setup' && 'Configura tu show antes de subir al escenario.'}
            {step === 'dilemma' && 'Toma tu decisión para salir a tocar.'}
            {step === 'result' && 'El show ha concluido exitosamente.'}
          </div>

          <div className="flex items-center gap-2">
            {step === 'setup' && (
              <button
                type="button"
                onClick={handleProceedToDilemma}
                disabled={isFundsInsufficient || isEnergyInsufficient}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isFundsInsufficient || isEnergyInsufficient
                    ? 'bg-[#2A2E3D] text-[#64748B] cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white hover:opacity-95 shadow-[0_0_15px_rgba(139,92,246,0.35)] cursor-pointer'
                }`}
              >
                <span>Continuar al Escenario</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            )}

            {step === 'dilemma' && (
              <button
                type="button"
                onClick={() => handleResolveAndPerform(selectedChoiceId || currentDilemma.choices[0].id)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-amber-500 text-white hover:opacity-95 shadow-[0_0_20px_rgba(236,72,153,0.4)] cursor-pointer flex items-center gap-2"
              >
                <Mic2 className="w-4 h-4" />
                <span>¡Actuar en Vivo ante la Multitud!</span>
              </button>
            )}

            {step === 'result' && (
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-95 shadow-md cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finalizar & Celebrar en el Backstage</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
