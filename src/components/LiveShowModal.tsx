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
    dilemmaId?: string;
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
  const playerSongs = Object.values(world?.songs || {}).filter(s => s && s.artistId === player?.id);
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>(() => {
    // Default: top songs by popularity/streams
    return [...playerSongs]
      .sort((a, b) => (b.streamsTotal || 0) - (a.streamsTotal || 0))
      .slice(0, 5)
      .map(s => s.id);
  });

  // Pick a random dilemma for this show
  const [currentDilemma] = useState<LiveShowDilemma>(() => {
    const list = Array.isArray(LIVE_SHOW_DILEMMAS) && LIVE_SHOW_DILEMMAS.length > 0
      ? LIVE_SHOW_DILEMMAS
      : [];
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex] || {
      id: 'sound_check',
      title: 'Monitoreo de Sonido en Vivo',
      contextDescription: 'El show comienza y sientes la vibración del público. ¿Cómo arrancas la presentación?',
      choices: [
        {
          id: 'hit_opener',
          text: 'Abrir con el drop más explosivo de tu repertorio',
          description: 'Haces estallar los parlantes desde el primer compás.',
          scoreModifier: 8,
          hypeModifier: 10,
          energyModifier: -10,
          reputationModifier: 5,
          credibilityModifier: 5,
          fansMultiplier: 1.15
        }
      ]
    };
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
  const isFundsInsufficient = productionCost > (player?.stats?.funds || 0);
  const isEnergyInsufficient = (player?.stats?.energy || 0) < 20;

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
        dilemmaId: currentDilemma?.id,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#111114] border border-[#242429] rounded-[6px] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#18181C] border-b border-[#242429] text-[#F4F4F6] relative flex items-start justify-between shrink-0">
          <div className="space-y-1.5 pr-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-sans uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-[#111114] border border-[#242429] text-[#8E8E99]">
                🎪 Festival Mundial • {festival.country}
              </span>
              <span className="text-[10px] font-sans px-2 py-0.5 rounded-[4px] bg-[#242429] text-[#F4F4F6]">
                {FestivalEngine.getSlotTitle(slot)}
              </span>
              <span className="text-[10px] font-sans text-[#F59E0B] flex items-center gap-1">
                <Star className="w-3 h-3 fill-[#F59E0B]" />
                Prestigio {festival.prestige}/100
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#F4F4F6]">
              {festival.name}
            </h2>
            <p className="text-xs text-[#8E8E99] flex items-center gap-1.5 font-sans">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#52525B]" />
              {festival.location} • <span className="tabular-nums">{(festival.capacity || 0).toLocaleString('es-AR')}</span> espectadores por día
            </p>
          </div>

          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="p-1.5 rounded-[4px] bg-[#111114] hover:bg-[#242429] border border-[#242429] text-[#8E8E99] hover:text-[#F4F4F6] transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-[#09090B]">
          {/* STEP 1: SETUP */}
          {step === 'setup' && (
            <div className="space-y-6">
              {/* Financial & Energy Status Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-[4px] bg-[#111114] border border-[#242429]">
                  <span className="text-[10px] uppercase font-sans tracking-wider text-[#52525B] block">Caché Bruto</span>
                  <span className="text-base font-bold font-sans tabular-nums text-[#00E599]">
                    +{formatMoney(estimatedPayout)}
                  </span>
                </div>
                <div className="p-3 rounded-[4px] bg-[#111114] border border-[#242429]">
                  <span className="text-[10px] uppercase font-sans tracking-wider text-[#52525B] block">Costo Escénico</span>
                  <span className="text-base font-bold font-sans tabular-nums text-[#EF4444]">
                    -{formatMoney(productionCost)}
                  </span>
                </div>
                <div className="p-3 rounded-[4px] bg-[#111114] border border-[#242429]">
                  <span className="text-[10px] uppercase font-sans tracking-wider text-[#52525B] block">Ganancia Neta Estimada</span>
                  <span className={`text-base font-bold font-sans tabular-nums ${estimatedPayout - productionCost >= 0 ? 'text-[#F4F4F6]' : 'text-[#EF4444]'}`}>
                    {formatMoney(estimatedPayout - productionCost)}
                  </span>
                </div>
                <div className="p-3 rounded-[4px] bg-[#111114] border border-[#242429]">
                  <span className="text-[10px] uppercase font-sans tracking-wider text-[#52525B] block">Consumo de Energía</span>
                  <span className="text-base font-bold font-sans tabular-nums text-[#F59E0B] flex items-center gap-1">
                    <Zap className="w-4 h-4 text-[#F59E0B]" />
                    ~25% - 40%
                  </span>
                </div>
              </div>

              {/* Stage Production Choices */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E8E99] flex items-center gap-1.5 font-sans">
                  <Tv className="w-4 h-4 text-[#FF4F00]" />
                  1. Producción Escénica & Espectáculo Visual
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Visuals */}
                  <div className="p-3.5 rounded-[4px] bg-[#111114] border border-[#242429] space-y-2">
                    <label className="text-xs font-semibold text-[#F4F4F6] flex items-center gap-1.5">
                      <Tv className="w-3.5 h-3.5 text-[#8E8E99]" />
                      Pantallas & Visuales
                    </label>
                    <select
                      value={visuals}
                      onChange={(e) => {
                        playSound('click');
                        setVisuals(e.target.value as any);
                      }}
                      className="w-full bg-[#18181C] border border-[#242429] rounded-[4px] p-2 text-xs text-[#F4F4F6] focus:border-[#FF4F00] focus:outline-hidden font-sans"
                    >
                      <option value="basic">Visuales Básicos LED ($0)</option>
                      <option value="3d_screens">Pantallas 3D Reactivas ($15.000)</option>
                      <option value="monumental_mapping">Monumental Mapping & Láseres ($45.000)</option>
                    </select>
                    <p className="text-[11px] text-[#8E8E99]">
                      {visuals === 'basic' && 'Pantalla estándar provista por el festival.'}
                      {visuals === '3d_screens' && '+10% Euforia de audiencia y mayor atención en redes.'}
                      {visuals === 'monumental_mapping' && '+25% Euforia, viralidad y ovación de la prensa.'}
                    </p>
                  </div>

                  {/* Pyro */}
                  <div className="p-3.5 rounded-[4px] bg-[#111114] border border-[#242429] space-y-2">
                    <label className="text-xs font-semibold text-[#F4F4F6] flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
                      Efectos & Pirotecnia
                    </label>
                    <select
                      value={pyro}
                      onChange={(e) => {
                        playSound('click');
                        setPyro(e.target.value as any);
                      }}
                      className="w-full bg-[#18181C] border border-[#242429] rounded-[4px] p-2 text-xs text-[#F4F4F6] focus:border-[#FF4F00] focus:outline-hidden font-sans"
                    >
                      <option value="none">Sin Pirotecnia ($0)</option>
                      <option value="sparks_fog">Chispas Frías & Niebla ($8.000)</option>
                      <option value="flamethrowers_lasers">Lanzallamas & Humo Criotécnico ($25.000)</option>
                    </select>
                    <p className="text-[11px] text-[#8E8E99]">
                      {pyro === 'none' && 'Show acústico y visual austero.'}
                      {pyro === 'sparks_fog' && 'Destellos en los drops y estribillos.'}
                      {pyro === 'flamethrowers_lasers' && 'Lanzallamas masivos en cada clímax (+18% Euforia).'}
                    </p>
                  </div>

                  {/* Crew & Live Band */}
                  <div className="p-3.5 rounded-[4px] bg-[#111114] border border-[#242429] space-y-2">
                    <label className="text-xs font-semibold text-[#F4F4F6] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#8E8E99]" />
                      Elenco & Músicos
                    </label>
                    <select
                      value={crew}
                      onChange={(e) => {
                        playSound('click');
                        setCrew(e.target.value as any);
                      }}
                      className="w-full bg-[#18181C] border border-[#242429] rounded-[4px] p-2 text-xs text-[#F4F4F6] focus:border-[#FF4F00] focus:outline-hidden font-sans"
                    >
                      <option value="solo_dj">Solo DJ / Pista Base ($0)</option>
                      <option value="live_band">Banda en Vivo Completa ($12.000)</option>
                      <option value="elite_dancers_choir">Cuerpo de Baile & Coro ($30.000)</option>
                    </select>
                    <p className="text-[11px] text-[#8E8E99]">
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
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E8E99] flex items-center gap-1.5 font-sans">
                    <Mic2 className="w-4 h-4 text-[#FF4F00]" />
                    2. Armado de Setlist ({selectedSongIds.length}/6 temas seleccionados)
                  </h3>
                  <span className="text-[11px] text-[#52525B] font-sans">
                    Toca para añadir o quitar del repertorio en vivo
                  </span>
                </div>

                {playerSongs.length === 0 ? (
                  <p className="text-xs text-[#8E8E99] italic p-4 bg-[#111114] border border-[#242429] rounded-[4px] text-center">
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
                          className={`p-3 rounded-[4px] border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-[#18181C] border-[#FF4F00] text-[#F4F4F6]'
                              : 'bg-[#111114] border-[#242429] text-[#8E8E99] hover:border-[#3F3F46]'
                          }`}
                        >
                          <div className="min-w-0">
                            <span className="text-xs font-semibold block text-[#F4F4F6] truncate">
                              {song.title}
                            </span>
                            <span className="text-[10px] text-[#8E8E99] font-sans tabular-nums block">
                              Q: {Number.isFinite(song.quality) ? song.quality : 70}% • {(((song.streamsTotal || 0) / 1000000)).toFixed(1)}M streams
                            </span>
                          </div>
                          <div className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 border ${
                            isSelected ? 'bg-[#FF4F00] border-[#FF4F00] text-white' : 'border-[#242429] bg-[#18181C]'
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
                <div className="p-3 rounded-[4px] bg-[#1F1215] border border-[#451A20] text-[#EF4444] text-xs flex items-center gap-2 font-sans">
                  <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0" />
                  <span>Fondos insuficientes para costear la producción escénica seleccionada (${productionCost.toLocaleString('es-AR')}). Reduce los efectos para continuar.</span>
                </div>
              )}
              {isEnergyInsufficient && (
                <div className="p-3 rounded-[4px] bg-[#1F1912] border border-[#45321A] text-[#F59E0B] text-xs flex items-center gap-2 font-sans">
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span>Tu energía es demasiado baja ({player?.stats?.energy || 0}%). Necesitas al menos 20% de energía para subirte al escenario.</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: LIVE DILEMMA */}
          {step === 'dilemma' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-[4px] bg-[#111114] border border-[#F59E0B]/50 space-y-2">
                <div className="flex items-center gap-2 text-[#F59E0B] text-xs font-sans font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  ¡Suceso Inesperado en Pleno Concierto!
                </div>
                <h3 className="text-base font-bold text-[#F4F4F6]">
                  {currentDilemma.title}
                </h3>
                <p className="text-xs text-[#8E8E99] leading-relaxed">
                  {currentDilemma.contextDescription}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-[#8E8E99]">
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
                        className={`w-full p-4 rounded-[4px] border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#18181C] border-[#FF4F00] text-[#F4F4F6]'
                            : 'bg-[#111114] border-[#242429] hover:border-[#3F3F46] text-[#8E8E99]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-bold text-[#F4F4F6]">
                            {choice.text}
                          </span>
                          <span className={`text-[10px] font-sans tabular-nums px-2 py-0.5 rounded-[4px] border ${
                            choice.scoreModifier > 0 ? 'bg-[#111114] text-[#00E599] border-[#00E599]/30' : 'bg-[#1F1215] text-[#EF4444] border-[#451A20]'
                          }`}>
                            {choice.scoreModifier > 0 ? `+${choice.scoreModifier} Euforia` : `${choice.scoreModifier} Euforia`}
                          </span>
                        </div>
                        <p className="text-xs text-[#8E8E99] mt-1.5 leading-relaxed">
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
              <div className="p-6 rounded-[6px] bg-[#111114] border border-[#242429] text-center space-y-2">
                <span className="text-[10px] font-sans font-bold uppercase px-3 py-1 rounded-[4px] bg-[#18181C] text-[#F4F4F6] border border-[#242429]">
                  {showResult.slotTitle || FestivalEngine.getSlotTitle(showResult.slot)}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#F4F4F6]">
                  {showResult.headline || showResult.newsHeadline || 'Gran Concierto en Vivo'}
                </h3>
                <p className="text-xs text-[#8E8E99] max-w-lg mx-auto">
                  {showResult.subheadline || showResult.newsBody || ''}
                </p>

                <div className="flex items-center justify-center gap-6 pt-3 font-sans">
                  <div>
                    <span className="text-[10px] text-[#52525B] block uppercase font-sans tracking-wider">Calificación Show</span>
                    <span className="text-xl font-black text-[#F59E0B] tabular-nums">
                      {showResult.performanceScore ?? showResult.crowdRating ?? 75}%
                    </span>
                  </div>
                  <div className="w-px h-8 bg-[#242429]" />
                  <div>
                    <span className="text-[10px] text-[#52525B] block uppercase font-sans tracking-wider">Audiencia Real</span>
                    <span className="text-xl font-black text-[#00E599] tabular-nums">
                      {(showResult.attendance || 0).toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div className="w-px h-8 bg-[#242429]" />
                  <div>
                    <span className="text-[10px] text-[#52525B] block uppercase font-sans tracking-wider">Ganancia Neta</span>
                    <span className="text-xl font-black text-[#00E599] tabular-nums">
                      +{formatMoney(showResult.netProfit || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gains & Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-[4px] bg-[#111114] border border-[#242429]">
                  <span className="text-[10px] text-[#52525B] block uppercase font-sans tracking-wider">Nuevos Fans</span>
                  <span className="text-sm font-bold text-[#00E599] font-sans tabular-nums">
                    +{(showResult.fansGained || 0).toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="p-3 rounded-[4px] bg-[#111114] border border-[#242429]">
                  <span className="text-[10px] text-[#52525B] block uppercase font-sans tracking-wider">Hype Generado</span>
                  <span className="text-sm font-bold text-[#F59E0B] font-sans tabular-nums">
                    +{showResult.hypeGained || 0} pts
                  </span>
                </div>
                <div className="p-3 rounded-[4px] bg-[#111114] border border-[#242429]">
                  <span className="text-[10px] text-[#52525B] block uppercase font-sans tracking-wider">Popularidad</span>
                  <span className="text-sm font-bold text-[#F4F4F6] font-sans tabular-nums">
                    +{showResult.popularityGained ?? 2} pts
                  </span>
                </div>
                <div className="p-3 rounded-[4px] bg-[#111114] border border-[#242429]">
                  <span className="text-[10px] text-[#52525B] block uppercase font-sans tracking-wider">Energía Invertida</span>
                  <span className="text-sm font-bold text-[#EF4444] font-sans tabular-nums">
                    -{(showResult.energyUsed ?? showResult.energySpent ?? 20)}%
                  </span>
                </div>
              </div>

              {/* Press Reviews */}
              <div className="space-y-3">
                <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-[#8E8E99] flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-[#F59E0B]" />
                  Veredicto de la Prensa Internacional
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(showResult.reviews || showResult.pressReviews || []).map((rev, idx) => {
                    if (!rev) return null;
                    const ratingVal = Number.isFinite(rev.rating) ? (rev.rating > 5 ? rev.rating / 2 : rev.rating) : 4;
                    const starCount = Math.min(5, Math.max(1, Math.round(ratingVal)));

                    return (
                      <div key={idx} className="p-4 rounded-[4px] bg-[#111114] border border-[#242429] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#F4F4F6]">
                            {rev.outlet}
                          </span>
                          <div className="flex items-center gap-1 text-[#F59E0B]">
                            {Array.from({ length: starCount }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B]" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-[#8E8E99] italic">
                          "{rev.quote || rev.snippet || 'Concierto inolvidable.'}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {(showResult.viralMomentOccurred || showResult.viralMoment?.occurred) && (
                <div className="p-3.5 rounded-[4px] bg-[#18181C] border border-[#F59E0B]/50 text-[#F59E0B] text-xs flex items-center gap-2 font-sans">
                  <Sparkles className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span><strong>¡Momento Viral en Vivo!</strong> Videos del concierto alcanzaron millones de visualizaciones en TikTok, multiplicando las reproducciones en streaming.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-[#18181C] border-t border-[#242429] flex items-center justify-between shrink-0">
          <div className="text-xs text-[#8E8E99] font-sans">
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
                className={`px-5 py-2.5 rounded-[4px] text-xs font-sans font-bold transition-all flex items-center gap-2 ${
                  isFundsInsufficient || isEnergyInsufficient
                    ? 'bg-[#18181C] border border-[#242429] text-[#52525B] cursor-not-allowed'
                    : 'bg-[#FF4F00] hover:bg-[#E04500] text-white active:translate-y-[1px] cursor-pointer'
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
                className="px-6 py-2.5 rounded-[4px] text-xs font-sans font-bold bg-[#FF4F00] hover:bg-[#E04500] text-white active:translate-y-[1px] cursor-pointer flex items-center gap-2"
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
                className="px-6 py-2.5 rounded-[4px] text-xs font-sans font-bold bg-[#F4F4F6] hover:bg-[#E4E4E7] text-[#09090B] active:translate-y-[1px] cursor-pointer flex items-center gap-2"
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
