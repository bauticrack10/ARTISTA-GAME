import React, { useState, useEffect, useRef } from 'react';
import { GameEngine } from './core/GameEngine';
import {
  WorldState,
  Artist,
  EventDefinition,
  LongevityCurve,
  AwardCeremony,
  Song,
  ReleaseConfirmationData,
  IncomingCollabOffer
} from './types';
import { StartScreen } from './components/StartScreen';
import { CharacterCreatorView } from './components/CharacterCreatorView';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { StudioView } from './components/StudioView';
import { LifestyleShopView } from './components/LifestyleShopView';
import { ChartsView } from './components/ChartsView';
import { ToursView } from './components/ToursView';
import { IndustryView } from './components/IndustryView';
import { RelationshipsView } from './components/RelationshipsView';
import { CareerErasView } from './components/CareerErasView';
import { AwardsView } from './components/AwardsView';
import { AwardsGalaModal } from './components/AwardsGalaModal';
import { EventModal } from './components/EventModal';
import { EraMilestoneModal, EraMilestoneData } from './components/EraMilestoneModal';
import { CollaborationModal } from './components/CollaborationModal';
import { ReleaseConfirmationModal } from './components/ReleaseConfirmationModal';
import { StreamingPlatformView } from './components/StreamingPlatformView';
import { ArtistPhoneModal } from './components/ArtistPhoneModal';
import { YearEndWrappedModal } from './components/YearEndWrappedModal';
import { FinancialLedger } from './components/FinancialLedger';
import { ErrorBoundary } from './components/ErrorBoundary';
import { playSound } from './utils/audioSystem';
import { GameJuiceOverlay } from './components/ui/GameJuiceOverlay';
import { CollabOfferNotification, SpontaneousCollabOffer } from './components/CollabOfferNotification';
import { AtmosphericBackground } from './components/ui/AtmosphericBackground';
import { LiquidGlassFilters, ToastOverlay } from './components/ui';
import { useScrollToTop } from './hooks/useScrollToTop';
import { scrollToTop } from './utils/scrollUtils';
import { showToast } from './utils/toastBus';

type AppMode = 'start_screen' | 'character_creator' | 'game';

function clearTransientCareerStorage(): void {
  try {
    localStorage.removeItem('el_artista_first_steps_dismissed');
    localStorage.removeItem('el_artista_onboarding_tooltip_dismissed');
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('el_artista_studio_draft_')) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore storage errors
  }
}

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('start_screen');
  const [engineVersion, setEngineVersion] = useState<number>(0);
  const engineRef = useRef<GameEngine | null>(null);

  // Initialize engine lazily
  const getEngine = () => {
    if (!engineRef.current) {
      engineRef.current = new GameEngine();
    }
    return engineRef.current;
  };

  const [world, setWorld] = useState<WorldState>(() => getEngine().getWorld());
  const [player, setPlayer] = useState<Artist>(() => getEngine().getPlayer());
  const [currentEvent, setCurrentEvent] = useState<EventDefinition | null>(null);
  const [activeGala, setActiveGala] = useState<AwardCeremony | null>(null);
  const [activeMilestone, setActiveMilestone] = useState<EraMilestoneData | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [studioSubTab, setStudioSubTab] = useState<'single' | 'album' | 'catalog'>('single');
  const [isCollabModalOpen, setIsCollabModalOpen] = useState<boolean>(false);
  const [selectedCollabArtistId, setSelectedCollabArtistId] = useState<string | undefined>(undefined);
  const [confirmedCollabRelease, setConfirmedCollabRelease] = useState<ReleaseConfirmationData | null>(null);
  const [isPhoneOpen, setIsPhoneOpen] = useState<boolean>(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState<boolean>(false);

  // Reiniciar la posición de scroll al tope superior en cada cambio de vista, sub-pestaña o modo de juego
  useScrollToTop([currentTab, studioSubTab, appMode]);

  const handleNavigate = (tab: string, subTab?: 'single' | 'album' | 'catalog') => {
    scrollToTop();
    if (tab === 'catalog') {
      setCurrentTab('studio');
      setStudioSubTab('catalog');
    } else if (tab === 'record' || tab === 'studio_single') {
      setCurrentTab('studio');
      setStudioSubTab('single');
    } else if (tab === 'studio_album') {
      setCurrentTab('studio');
      setStudioSubTab('album');
    } else if (tab === 'studio') {
      setCurrentTab('studio');
      setStudioSubTab(subTab || 'single');
    } else {
      setCurrentTab(tab);
    }
  };

  const prevErasCountRef = useRef<number>(player?.eras?.length || 1);
  const milestonesAchievedRef = useRef<Set<string>>(new Set());

  const syncMilestonesRef = (targetPlayer: Artist, targetWorld: WorldState) => {
    const achieved = new Set<string>(
      Array.isArray(targetPlayer?.achievedMilestones) ? targetPlayer.achievedMilestones : []
    );
    const listeners = targetPlayer?.stats?.monthlyListeners || 0;
    if (listeners >= 100000) achieved.add('100k_listeners');
    if (listeners >= 1000000) achieved.add('1m_listeners');
    const songs = (Object.values(targetWorld?.songs || {}) as Song[]).filter(
      (s) => s.artistId === targetPlayer?.id
    );
    for (const s of songs) {
      if ((s.streamsTotal || 0) >= 500000) {
        achieved.add(`gold_${s.id}`);
      }
    }
    milestonesAchievedRef.current = achieved;
    if (targetPlayer) {
      targetPlayer.achievedMilestones = Array.from(achieved);
    }
  };

  // Subscribe to engine state changes (Auto-save on every state change)
  useEffect(() => {
    const eng = getEngine();
    const unsubscribe = eng.subscribe((newWorld, newPlayer, newEvent, newGala) => {
      setWorld({ ...newWorld });
      setPlayer({ ...newPlayer });
      setCurrentEvent(newEvent);
      if (newGala) {
        setActiveGala(newGala);
      }
      if (appMode === 'game') {
        try {
          localStorage.setItem('el_artista_save', eng.exportSaveState());
        } catch {
          // storage error
        }
      }
    });
    return unsubscribe;
  }, [appMode, engineVersion]);

  // Automatic Milestone Detection & Trigger
  useEffect(() => {
    if (appMode !== 'game' || !player || !player.stats) return;

    const curYear = world?.currentYear || 2026;
    const curMonth = world?.currentMonth || 1;
    const monthlyListeners = player.stats.monthlyListeners || 0;

    const recordAchieved = (key: string) => {
      milestonesAchievedRef.current.add(key);
      const engPlayer = getEngine().getPlayer();
      if (engPlayer) {
        const prev = Array.isArray(engPlayer.achievedMilestones) ? engPlayer.achievedMilestones : [];
        if (!prev.includes(key)) {
          engPlayer.achievedMilestones = [...prev, key];
        }
      }
    };

    // 1. Check if a new Era was added
    if (player.eras && player.eras.length > prevErasCountRef.current) {
      prevErasCountRef.current = player.eras.length;
      const latestEra = player.eras[player.eras.length - 1];
      playSound('level_up');
      setActiveMilestone({
        type: 'era_transition',
        title: `¡Transición de Era: "${latestEra.name}"!`,
        eraName: latestEra.name,
        stage: latestEra.stage,
        milestoneLabel: `NUEVA ERA • ${latestEra.stage.toUpperCase()}`,
        statValue: `${latestEra.stage}`,
        year: curYear,
        month: curMonth,
        quote: latestEra.highlightSummary
      });
      return;
    }

    // 2. Check 100K Monthly Listeners milestone
    if (
      monthlyListeners >= 100000 &&
      !milestonesAchievedRef.current.has('100k_listeners') &&
      !player.achievedMilestones?.includes('100k_listeners')
    ) {
      recordAchieved('100k_listeners');
      playSound('level_up');
      setActiveMilestone({
        type: 'listeners_milestone',
        title: '¡100,000 Oyentes Mensuales Conquistados!',
        milestoneLabel: '100K OYENTES',
        statValue: `${monthlyListeners.toLocaleString('es-AR')}`,
        year: curYear,
        month: curMonth,
        quote: `${player.name || 'El Artista'} rompe la barrera de los 100K oyentes en streaming global.`
      });
      return;
    }

    // 3. Check 1M Monthly Listeners milestone
    if (
      monthlyListeners >= 1000000 &&
      !milestonesAchievedRef.current.has('1m_listeners') &&
      !player.achievedMilestones?.includes('1m_listeners')
    ) {
      recordAchieved('1m_listeners');
      playSound('chart_no1');
      setActiveMilestone({
        type: 'listeners_milestone',
        title: '¡Superestrella: 1,000,000 de Oyentes Mensuales!',
        milestoneLabel: '1 MILLÓN DE OYENTES',
        statValue: `${(monthlyListeners / 1000000).toFixed(1)}M`,
        year: curYear,
        month: curMonth,
        quote: 'Consagración absoluta en la cima de la industria musical.'
      });
      return;
    }

    // 4. Check Gold record milestone (500K total streams on a single song)
    const songs = (Object.values(world?.songs || {}) as Song[]).filter((s) => s.artistId === player.id);
    const goldSong = songs.find(
      (s) =>
        (s.streamsTotal || 0) >= 500000 &&
        !milestonesAchievedRef.current.has(`gold_${s.id}`) &&
        !player.achievedMilestones?.includes(`gold_${s.id}`)
    );
    if (goldSong) {
      recordAchieved(`gold_${goldSong.id}`);
      playSound('award');
      setActiveMilestone({
        type: 'gold_record',
        title: `¡Certificación de Oro: "${goldSong.title}"!`,
        milestoneLabel: 'DISCO DE ORO',
        statValue: `${((goldSong.streamsTotal || 0) / 1000).toFixed(0)}K Streams`,
        year: curYear,
        month: curMonth,
        quote: `"${goldSong.title}" es certificado con Disco de Oro oficial por su impacto en plataformas.`
      });
    }
  }, [player?.eras?.length, player?.stats?.monthlyListeners, player?.stats?.totalStreams, appMode]);

  const handleOpenMilestone = (customData?: Partial<EraMilestoneData>) => {
    playSound('click');
    const currentEra = player?.eras?.[player.eras.length - 1];
    const curYear = world?.currentYear || 2026;
    const curMonth = world?.currentMonth || 1;
    const totalStreams = player?.stats?.totalStreams || 0;
    const careerStage = player?.careerStage || 'Underground';

    const data: EraMilestoneData = {
      type: 'era_transition',
      title: `Portada Conmemorativa: ${currentEra?.name || 'Era Musical'}`,
      eraName: currentEra?.name,
      stage: careerStage,
      milestoneLabel: `ERA ${careerStage.toUpperCase()}`,
      statValue: `${(totalStreams / 1000000).toFixed(1)}M Streams`,
      year: curYear,
      month: curMonth,
      ...customData
    };
    setActiveMilestone(data);
  };

  // Start Screen handlers
  const handleStartNewCareer = () => {
    playSound('click');
    setAppMode('character_creator');
  };

  const handleContinueSavedGame = () => {
    playSound('click');
    const saved = localStorage.getItem('el_artista_save');
    if (saved) {
      const eng = new GameEngine();
      const loaded = eng.importSaveState(saved);
      if (loaded) {
        engineRef.current = eng;
        const newWorld = eng.getWorld();
        const newPlayer = eng.getPlayer();
        prevErasCountRef.current = newPlayer.eras?.length || 1;
        syncMilestonesRef(newPlayer, newWorld);
        setWorld(newWorld);
        setPlayer(newPlayer);
        setCurrentEvent(eng.getCurrentEvent());
        setActiveGala(eng.getActiveGalaCeremony());
        setActiveMilestone(null);
        setConfirmedCollabRelease(null);
        setIsCollabModalOpen(false);
        setIsPhoneOpen(false);
        setIsLedgerOpen(false);
        setEngineVersion((v) => v + 1);
        setAppMode('game');
        setCurrentTab('dashboard');
        return;
      }
    }
    showToast('No se pudo cargar la partida guardada.', 'error');
  };

  const handleLoadDemoCareer = () => {
    playSound('click');
    clearTransientCareerStorage();
    const eng = new GameEngine();
    engineRef.current = eng;
    const newWorld = eng.getWorld();
    const newPlayer = eng.getPlayer();
    prevErasCountRef.current = newPlayer.eras?.length || 1;
    milestonesAchievedRef.current = new Set();
    syncMilestonesRef(newPlayer, newWorld);
    setWorld(newWorld);
    setPlayer(newPlayer);
    setCurrentEvent(eng.getCurrentEvent());
    setActiveGala(null);
    setActiveMilestone(null);
    setConfirmedCollabRelease(null);
    setIsCollabModalOpen(false);
    setIsPhoneOpen(false);
    setIsLedgerOpen(false);
    setEngineVersion((v) => v + 1);
    setAppMode('game');
    setCurrentTab('dashboard');
    try {
      localStorage.setItem('el_artista_save', eng.exportSaveState());
    } catch {
      // ignore storage errors
    }
  };

  const handleImportSaveState = (jsonContent: string) => {
    playSound('click');
    const eng = new GameEngine();
    const loaded = eng.importSaveState(jsonContent);
    if (loaded) {
      engineRef.current = eng;
      const newWorld = eng.getWorld();
      const newPlayer = eng.getPlayer();
      prevErasCountRef.current = newPlayer.eras?.length || 1;
      syncMilestonesRef(newPlayer, newWorld);
      setWorld(newWorld);
      setPlayer(newPlayer);
      setCurrentEvent(eng.getCurrentEvent());
      setActiveGala(eng.getActiveGalaCeremony());
      setActiveMilestone(null);
      setConfirmedCollabRelease(null);
      setIsCollabModalOpen(false);
      setIsPhoneOpen(false);
      setIsLedgerOpen(false);
      setEngineVersion((v) => v + 1);
      setAppMode('game');
      setCurrentTab('dashboard');
      try {
        localStorage.setItem('el_artista_save', eng.exportSaveState());
      } catch {
        // ignore storage errors
      }
      showToast('Partida cargada exitosamente.', 'success');
    } else {
      showToast('Error al leer el archivo de guardado JSON.', 'error');
    }
  };

  // Character creation handler
  const handleCreatePlayer = (customArtist: Partial<Artist>) => {
    playSound('release');
    clearTransientCareerStorage();
    const eng = new GameEngine(customArtist);
    engineRef.current = eng;
    const newWorld = eng.getWorld();
    const newPlayer = eng.getPlayer();
    prevErasCountRef.current = newPlayer.eras?.length || 1;
    milestonesAchievedRef.current = new Set();
    syncMilestonesRef(newPlayer, newWorld);
    setWorld(newWorld);
    setPlayer(newPlayer);
    setCurrentEvent(eng.getCurrentEvent());
    setActiveGala(null);
    setActiveMilestone(null);
    setConfirmedCollabRelease(null);
    setIsCollabModalOpen(false);
    setIsPhoneOpen(false);
    setIsLedgerOpen(false);
    setEngineVersion((v) => v + 1);
    setAppMode('game');
    setCurrentTab('dashboard');
    try {
      localStorage.setItem('el_artista_save', eng.exportSaveState());
    } catch {
      // ignore storage errors
    }
  };

  // In-Game actions
  const handleAdvanceCycle = (months: 1 | 3 | 6 | 12) => {
    getEngine().advanceCycle(months);
    playSound('money');
  };

  const handleRest = () => {
    getEngine().takeVacation();
    playSound('click');
  };

  const handleOpenCollabModal = (artistId?: string) => {
    setSelectedCollabArtistId(artistId);
    setIsCollabModalOpen(true);
    playSound('click');
  };

  const handleExecuteCollab = (params: {
    collaboratorId: string;
    format: 'single_feat' | 'album_track' | 'ep_collab' | 'collab_album' | 'mixtape_collab';
    title: string;
    creditFormat: 'player_feat_target' | 'target_feat_player' | 'player_and_target' | 'player_x_target';
    genreId: string;
    subGenreIds: string[];
    producerId?: string;
    budgetProduction: number;
    budgetMarketing: number;
    longevityCurve: LongevityCurve;
  }) => {
    return getEngine().releaseCollaboration(params);
  };

  const handleCollabSuccess = (releaseData: ReleaseConfirmationData) => {
    setConfirmedCollabRelease(releaseData);
    setIsCollabModalOpen(false);
  };

  // Cola Única de Modales (0 colisiones z-50)
  const activeModalKey:
    | 'event'
    | 'gala'
    | 'wrapped'
    | 'milestone'
    | 'collab_release'
    | 'collab_modal'
    | 'phone'
    | 'ledger'
    | null = currentEvent
    ? 'event'
    : activeGala
    ? 'gala'
    : world?.activeYearEndWrapped
    ? 'wrapped'
    : activeMilestone
    ? 'milestone'
    : confirmedCollabRelease
    ? 'collab_release'
    : isCollabModalOpen
    ? 'collab_modal'
    : isPhoneOpen
    ? 'phone'
    : isLedgerOpen
    ? 'ledger'
    : null;

  const engineAny = getEngine() as any;
  const careerGoals = engineAny.getCareerGoals ? engineAny.getCareerGoals() : [];
  const studioTierInfo = engineAny.getStudioTierInfo ? engineAny.getStudioTierInfo() : undefined;

  // 1. START SCREEN
  if (appMode === 'start_screen') {
    return (
      <ErrorBoundary>
        <LiquidGlassFilters />
        <ToastOverlay />
        <div className="min-h-screen bg-[#09090B] text-fg relative isolate">
          <AtmosphericBackground />
          <StartScreen
            onNewCareer={handleStartNewCareer}
            onContinue={handleContinueSavedGame}
            onLoadDemo={handleLoadDemoCareer}
            onImportSave={handleImportSaveState}
          />
        </div>
      </ErrorBoundary>
    );
  }

  // 2. CHARACTER CREATOR
  if (appMode === 'character_creator') {
    return (
      <ErrorBoundary>
        <LiquidGlassFilters />
        <ToastOverlay />
        <div className="min-h-screen bg-[#09090B] text-fg relative isolate">
          <AtmosphericBackground />
          <CharacterCreatorView
            world={world}
            onBackToMenu={() => setAppMode('start_screen')}
            onCreatePlayer={handleCreatePlayer}
          />
        </div>
      </ErrorBoundary>
    );
  }

  // 3. ACTIVE GAME DASHBOARD & SYSTEMS
  return (
    <ErrorBoundary>
      <LiquidGlassFilters />
      <ToastOverlay />
      <div className="min-h-screen bg-[#09090B] text-fg flex flex-col selection:bg-[#FF4F00]/30 selection:text-white relative overflow-x-clip font-sans">
        {/* Game Juice Floating Numbers & Arcade FX Overlay */}
        <GameJuiceOverlay />

        {/* Atmospheric Background */}
        <AtmosphericBackground />

        {/* Top App Bar & Navigation */}
        <div className="relative z-20">
          <Navbar
            player={player}
            world={world}
            currentTab={currentTab}
            onTabChange={handleNavigate}
            onAdvanceCycle={handleAdvanceCycle}
            onReturnToTitle={() => setAppMode('start_screen')}
            onOpenPhone={() => setIsPhoneOpen(true)}
            onOpenFinancialLedger={() => {
              playSound('click');
              setIsLedgerOpen(true);
            }}
            onExportSave={() => {
              const json = getEngine().exportSaveState();
              const blob = new Blob([json], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `el-artista-${(player?.name || 'carrera').toLowerCase().replace(/\s+/g, '-')}-${world?.currentYear || 2026}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            onImportSave={handleImportSaveState}
            onResetCareer={() => {
              try {
                localStorage.removeItem('el_artista_save');
              } catch {
                // ignore
              }
              clearTransientCareerStorage();
              milestonesAchievedRef.current = new Set();
              setCurrentEvent(null);
              setActiveGala(null);
              setActiveMilestone(null);
              setConfirmedCollabRelease(null);
              setIsCollabModalOpen(false);
              setIsPhoneOpen(false);
              setIsLedgerOpen(false);
              setAppMode('start_screen');
            }}
          />
        </div>

        {/* Main Container */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 xl:px-14 pt-8 sm:pt-10 pb-20 space-y-8 transition-all relative z-10">
          {currentTab === 'dashboard' && (
            <DashboardView
              player={player}
              world={world}
              onNavigate={handleNavigate}
              onRest={handleRest}
              onExecuteDecision={(action) => getEngine().executeDecisionAction(action)}
              onUpdateAvatar={(url, color, icon) => getEngine().updatePlayerAvatar(url, color, icon)}
              onUpdateProfile={(updates) => getEngine().updatePlayerProfile(updates)}
              onOpenMilestone={handleOpenMilestone}
              careerGoals={careerGoals}
              onClaimGoal={(goalId) => engineAny.claimCareerGoal?.(goalId)}
              studioTierInfo={studioTierInfo}
            />
          )}

          {currentTab === 'studio' && (
            <StudioView
              player={player}
              world={world}
              initialTab={studioSubTab}
              onTabChange={setStudioSubTab}
              onNavigate={handleNavigate}
              onOpenCollabModal={handleOpenCollabModal}
              studioTierInfo={studioTierInfo}
              onReleaseSong={(params) => getEngine().releaseSong(params)}
              onReleaseAlbum={(params) => getEngine().releaseAlbum(params)}
            />
          )}

          {currentTab === 'streaming' && (
            <StreamingPlatformView
              player={player}
              world={world}
              onPitchSong={(songId, playlistId) => getEngine().pitchSongToPlaylist(songId, playlistId)}
              onLaunchSnippet={(params) => getEngine().launchSnippetCampaign(params)}
              onInteractComment={(songId, commentId, action) =>
                getEngine().interactWithVideoComment(songId, commentId, action)
              }
              {...({ onNavigate: handleNavigate } as any)}
            />
          )}

          {currentTab === 'lifestyle' && (
            <LifestyleShopView
              player={player}
              world={world}
              onBuyItem={(id) => getEngine().buyLifestyleItem(id)}
              {...({ onNavigate: handleNavigate } as any)}
            />
          )}

          {currentTab === 'charts' && (
            <ChartsView
              world={world}
              player={player}
              onAdvanceCycle={() => handleAdvanceCycle(1)}
              {...({ onNavigate: handleNavigate } as any)}
            />
          )}

          {currentTab === 'tours' && (
            <ToursView
              player={player}
              world={world}
              onBookTour={(tier, name) => getEngine().bookTour(tier, name)}
              onExecuteLiveShow={(params) => getEngine().executeLiveShow(params)}
              {...({ onNavigate: handleNavigate } as any)}
            />
          )}

          {currentTab === 'industry' && (
            <IndustryView
              player={player}
              world={world}
              onSignContract={(contract) => getEngine().signContract(contract)}
              onHireManager={(managerId) => getEngine().hireManager(managerId)}
              onFireManager={() => getEngine().fireManager()}
              {...({
                onNavigate: handleNavigate,
                onBreakContract: () => engineAny.breakActiveContract?.()
              } as any)}
            />
          )}

          {currentTab === 'relations' && (
            <RelationshipsView
              player={player}
              world={world}
              onOpenCollabModal={handleOpenCollabModal}
              onInteract={(targetId, type) => {
                try {
                  return getEngine().interactWithArtist(targetId, type);
                } catch (err: any) {
                  showToast(err?.message || 'No se pudo realizar la acción.', 'error');
                }
              }}
              onInteractEcosystemNPC={(npcId, action) => {
                try {
                  getEngine().interactWithEcosystemNPC(npcId, action);
                } catch (err: any) {
                  showToast(err?.message || 'No se pudo interactuar.', 'error');
                }
              }}
              onInteractBeef={(targetName, targetId, action) => {
                try {
                  getEngine().interactWithBeef(targetName, targetId, action);
                } catch (err: any) {
                  showToast(err?.message || 'No se pudo procesar el feudo.', 'error');
                }
              }}
              {...({
                onNavigate: handleNavigate,
                onAcceptCollabOffer: (id: string) => getEngine().acceptCollabOffer(id),
                onDeclineCollabOffer: (id: string) => getEngine().declineCollabOffer(id)
              } as any)}
            />
          )}

          {currentTab === 'career' && (
            <CareerErasView
              player={player}
              world={world}
              onOpenMilestone={handleOpenMilestone}
              onRetireArtist={() => engineAny.retirePlayer?.()}
              {...({
                onNavigate: handleNavigate,
                onStartNewEra: (name: string, genre: string) => engineAny.startNewEra?.(name, genre)
              } as any)}
            />
          )}

          {currentTab === 'awards' && (
            <AwardsView
              world={world}
              player={player}
              onOpenGala={(ceremony) => setActiveGala(ceremony)}
              onNavigate={handleNavigate}
            />
          )}
        </main>

        {/* COLA ÚNICA DE MODALES (Prioridad estricta 1..8) */}

        {/* 1. Event Dilemma Dialog */}
        {activeModalKey === 'event' && currentEvent && (
          <EventModal
            event={currentEvent}
            world={world}
            player={player}
            onSelectChoice={(idx) => getEngine().resolveCurrentEventChoice(idx)}
          />
        )}

        {/* 2. Annual Awards Gala Modal */}
        {activeModalKey === 'gala' && activeGala && (
          <AwardsGalaModal
            ceremony={activeGala}
            player={player}
            onClose={() => {
              setActiveGala(null);
              getEngine().closeGalaCeremony();
            }}
          />
        )}

        {/* 3. Spotify Wrapped Year-End Story Modal */}
        {activeModalKey === 'wrapped' && world.activeYearEndWrapped && (
          <YearEndWrappedModal
            data={world.activeYearEndWrapped}
            isOpen={true}
            onDismiss={() => getEngine().dismissYearEndWrapped()}
          />
        )}

        {/* 4. Era Milestone & Magazine Cover Modal */}
        {activeModalKey === 'milestone' && activeMilestone && (
          <EraMilestoneModal
            milestone={activeMilestone}
            player={player}
            world={world}
            onClose={() => setActiveMilestone(null)}
          />
        )}

        {/* 5. Global / Collab Release Confirmation Modal */}
        {activeModalKey === 'collab_release' && confirmedCollabRelease && (
          <ReleaseConfirmationModal
            data={confirmedCollabRelease}
            onClose={() => setConfirmedCollabRelease(null)}
            onNavigateToCatalog={() => {
              setConfirmedCollabRelease(null);
              handleNavigate('catalog');
            }}
          />
        )}

        {/* 6. Collaboration Modal */}
        {activeModalKey === 'collab_modal' && (
          <CollaborationModal
            isOpen={true}
            onClose={() => setIsCollabModalOpen(false)}
            player={player}
            world={world}
            preselectedArtistId={selectedCollabArtistId}
            onExecuteCollab={handleExecuteCollab}
            onCollabSuccess={handleCollabSuccess}
          />
        )}

        {/* 7. Artist Smartphone Modal */}
        {activeModalKey === 'phone' && (
          <ArtistPhoneModal
            player={player}
            world={world}
            isOpen={true}
            onClose={() => setIsPhoneOpen(false)}
            onReplyMessage={(msgId, choiceIdx) => getEngine().replyToPhoneMessage(msgId, choiceIdx)}
            onMarkAllAsRead={() => getEngine().markAllPhoneMessagesRead()}
            {...({
              onMarkMessageRead: (id: string) => engineAny.markPhoneMessageRead?.(id)
            } as any)}
          />
        )}

        {/* 8. Financial Ledger Modal */}
        {activeModalKey === 'ledger' && (
          <FinancialLedger
            isModal={true}
            isOpen={true}
            player={player}
            world={world}
            onClose={() => setIsLedgerOpen(false)}
          />
        )}

        {/* Incoming Collaboration Offer Toast (oculto mientras exista cualquier modal abierto) */}
        {!activeModalKey && world.pendingCollabOffers && world.pendingCollabOffers.length > 0 && (
          <CollabOfferNotification
            isFloatingToast={true}
            offer={toSpontaneousOffer(world.pendingCollabOffers[0], world)}
            onAccept={(spontaneous) => {
              getEngine().acceptCollabOffer(spontaneous.id);
            }}
            onDecline={(offerId) => {
              getEngine().declineCollabOffer(offerId);
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

function toSpontaneousOffer(incoming: IncomingCollabOffer, world: WorldState): SpontaneousCollabOffer {
  const isProd = incoming.senderRole === 'producer';
  const artist = incoming.senderArtistId ? world.artists[incoming.senderArtistId] : undefined;
  const prod = incoming.senderProducerId ? world.producers[incoming.senderProducerId] : undefined;
  const genre = world.genres[incoming.genreId]?.name || incoming.genreId;

  return {
    id: incoming.id,
    senderType: incoming.senderRole,
    senderArtist: artist,
    senderProducer: prod,
    trackTitle: incoming.proposedTitle,
    genreName: genre,
    pitchQuote: incoming.pitchMessage,
    royaltySplitPlayer: incoming.royaltySplitPct,
    upfrontFeeOrAdvance: incoming.budgetOffered,
    energyCost: 10,
    expiresInMonths: Math.max(
      1,
      (incoming.expiresYear - world.currentYear) * 12 + (incoming.expiresMonth - world.currentMonth)
    ),
    projectedExposure: isProd
      ? '+15% Calidad Sonora'
      : `+${artist?.stats.popularity ? artist.stats.popularity * 40 : 500} Fans`,
    qualityBoostPercent: isProd ? 15 : undefined
  };
}
