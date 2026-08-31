import React, { useState, useEffect, useRef } from 'react';
import { GameEngine } from './core/GameEngine';
import { WorldState, Artist, EventDefinition, LongevityCurve, TourTier, Album, AwardCeremony, Song, ReleaseConfirmationData } from './types';
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
import { ErrorBoundary } from './components/ErrorBoundary';
import { playSound } from './utils/audioSystem';


type AppMode = 'start_screen' | 'character_creator' | 'game';

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('start_screen');
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

  const handleNavigate = (tab: string, subTab?: 'single' | 'album' | 'catalog') => {
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
        } catch (e) {
          // storage error
        }
      }
    });
    return unsubscribe;
  }, [appMode]);

  // Automatic Milestone Detection & Trigger
  useEffect(() => {
    if (appMode !== 'game' || !player || !player.stats) return;

    const curYear = world?.currentYear || 2026;
    const curMonth = world?.currentMonth || 1;
    const monthlyListeners = player.stats.monthlyListeners || 0;

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
    if (monthlyListeners >= 100000 && !milestonesAchievedRef.current.has('100k_listeners')) {
      milestonesAchievedRef.current.add('100k_listeners');
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
    if (monthlyListeners >= 1000000 && !milestonesAchievedRef.current.has('1m_listeners')) {
      milestonesAchievedRef.current.add('1m_listeners');
      playSound('chart_no1');
      setActiveMilestone({
        type: 'listeners_milestone',
        title: '¡Superestrella: 1,000,000 de Oyentes Mensuales!',
        milestoneLabel: '1 MILLÓN DE OYENTES',
        statValue: `${(monthlyListeners / 1000000).toFixed(1)}M`,
        year: curYear,
        month: curMonth,
        quote: `Consagración absoluta en la cima de la industria musical.`
      });
      return;
    }

    // 4. Check Gold record milestone (500K total streams on a single song)
    const songs = (Object.values(world?.songs || {}) as Song[]).filter(s => s.artistId === player.id);
    const goldSong = songs.find(s => (s.streamsTotal || 0) >= 500000);
    if (goldSong && !milestonesAchievedRef.current.has(`gold_${goldSong.id}`)) {
      milestonesAchievedRef.current.add(`gold_${goldSong.id}`);
      playSound('award');
      setActiveMilestone({
        type: 'gold_record',
        title: `¡Certificación de Oro: "${goldSong.title}"!`,
        milestoneLabel: 'DISCO DE ORO 📀',
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
        const newPlayer = eng.getPlayer();
        prevErasCountRef.current = newPlayer.eras?.length || 1;
        setWorld(eng.getWorld());
        setPlayer(newPlayer);
        setCurrentEvent(eng.getCurrentEvent());
        setActiveGala(eng.getActiveGalaCeremony());
        setAppMode('game');
        setCurrentTab('dashboard');
        return;
      }
    }
    alert('No se pudo cargar la partida guardada.');
  };

  const handleLoadDemoCareer = () => {
    playSound('click');
    const eng = new GameEngine();
    engineRef.current = eng;
    const newPlayer = eng.getPlayer();
    prevErasCountRef.current = newPlayer.eras?.length || 1;
    setWorld(eng.getWorld());
    setPlayer(newPlayer);
    setCurrentEvent(eng.getCurrentEvent());
    setActiveGala(null);
    setAppMode('game');
    setCurrentTab('dashboard');
    try {
      localStorage.setItem('el_artista_save', eng.exportSaveState());
    } catch (e) {}
  };

  const handleImportSaveState = (jsonContent: string) => {
    playSound('click');
    const eng = new GameEngine();
    const loaded = eng.importSaveState(jsonContent);
    if (loaded) {
      engineRef.current = eng;
      const newPlayer = eng.getPlayer();
      prevErasCountRef.current = newPlayer.eras?.length || 1;
      setWorld(eng.getWorld());
      setPlayer(newPlayer);
      setCurrentEvent(eng.getCurrentEvent());
      setActiveGala(eng.getActiveGalaCeremony());
      setAppMode('game');
      setCurrentTab('dashboard');
      try {
        localStorage.setItem('el_artista_save', eng.exportSaveState());
      } catch (e) {}
      alert('¡Partida cargada exitosamente!');
    } else {
      alert('Error al leer el archivo de guardado JSON.');
    }
  };

  // Character creation handler
  const handleCreatePlayer = (customArtist: Partial<Artist>) => {
    playSound('release');
    const eng = new GameEngine(customArtist);
    engineRef.current = eng;
    const newWorld = eng.getWorld();
    const newPlayer = eng.getPlayer();
    prevErasCountRef.current = newPlayer.eras?.length || 1;
    setWorld(newWorld);
    setPlayer(newPlayer);
    setCurrentEvent(eng.getCurrentEvent());
    setActiveGala(null);
    setAppMode('game');
    setCurrentTab('dashboard');
    try {
      localStorage.setItem('el_artista_save', eng.exportSaveState());
    } catch (e) {}
  };

  // In-Game actions
  const handleAdvanceCycle = (months: 6 | 12) => {
    getEngine().advanceCycle(months);
    playSound('money');
  };

  const handleRest = () => {
    getEngine().takeVacation();
    playSound('money');
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

  // 1. START SCREEN
  if (appMode === 'start_screen') {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-[#0B0C10] text-[#F8FAFC]">
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
        <div className="min-h-screen bg-[#0B0C10] text-[#F8FAFC]">
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
      <div
        className="min-h-screen bg-[#0B0C10] text-[#F8FAFC] flex flex-col selection:bg-[#8B5CF6]/30 selection:text-white relative overflow-x-hidden"
        style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
      >
      {/* Ambient Stage Backdrop Glows (Contained & Non-blocking) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-[#8B5CF6]/10 blur-[130px]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[400px] bg-[#EC4899]/08 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-[#06B6D4]/08 blur-[150px]" />
      </div>

      {/* Top App Bar & Navigation */}
      <Navbar
        player={player}
        world={world}
        currentTab={currentTab}
        onTabChange={handleNavigate}
        onAdvanceCycle={handleAdvanceCycle}
        onReturnToTitle={() => setAppMode('start_screen')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 transition-all">
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
          />
        )}

        {currentTab === 'studio' && (
          <StudioView
            player={player}
            world={world}
            initialTab={studioSubTab}
            onTabChange={setStudioSubTab}
            onOpenCollabModal={handleOpenCollabModal}
            onReleaseSong={(params) => getEngine().releaseSong(params)}
            onReleaseAlbum={(params) => getEngine().releaseAlbum(params)}
          />
        )}

        {currentTab === 'lifestyle' && (
          <LifestyleShopView
            player={player}
            world={world}
            onBuyItem={(id) => getEngine().buyLifestyleItem(id)}
          />
        )}

        {currentTab === 'charts' && (
          <ChartsView
            world={world}
            player={player}
          />
        )}

        {currentTab === 'tours' && (
          <ToursView
            player={player}
            world={world}
            onBookTour={(tier, name) => getEngine().bookTour(tier, name)}
          />
        )}

        {currentTab === 'industry' && (
          <IndustryView
            player={player}
            world={world}
            onSignContract={(contract) => getEngine().signContract(contract)}
            onHireManager={(managerId) => getEngine().hireManager(managerId)}
            onFireManager={() => getEngine().fireManager()}
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
                alert(err.message || 'No se pudo realizar la acción.');
              }
            }}
            onInteractEcosystemNPC={(npcId, action) => {
              try {
                getEngine().interactWithEcosystemNPC(npcId, action);
              } catch (err: any) {
                alert(err.message || 'No se pudo interactuar.');
              }
            }}
            onInteractBeef={(targetName, targetId, action) => {
              try {
                getEngine().interactWithBeef(targetName, targetId, action);
              } catch (err: any) {
                alert(err.message || 'No se pudo procesar el feudo.');
              }
            }}
          />
        )}

        {currentTab === 'career' && (
          <CareerErasView
            player={player}
            world={world}
            onOpenMilestone={handleOpenMilestone}
          />
        )}

        {currentTab === 'awards' && (
          <AwardsView
            world={world}
            player={player}
            onOpenGala={(ceremony) => setActiveGala(ceremony)}
          />
        )}
      </main>

      {/* Collaboration Modal */}
      {isCollabModalOpen && (
        <CollaborationModal
          isOpen={isCollabModalOpen}
          onClose={() => setIsCollabModalOpen(false)}
          player={player}
          world={world}
          preselectedArtistId={selectedCollabArtistId}
          onExecuteCollab={handleExecuteCollab}
          onCollabSuccess={handleCollabSuccess}
        />
      )}

      {/* Global / Collab Release Confirmation Modal */}
      {confirmedCollabRelease && (
        <ReleaseConfirmationModal
          data={confirmedCollabRelease}
          onClose={() => setConfirmedCollabRelease(null)}
          onNavigateToCatalog={() => {
            setConfirmedCollabRelease(null);
            handleNavigate('catalog');
          }}
        />
      )}

      {/* Event Dilemma Dialog */}
      {currentEvent && (
        <EventModal
          event={currentEvent}
          world={world}
          player={player}
          onSelectChoice={(idx) => getEngine().resolveCurrentEventChoice(idx)}
        />
      )}

      {/* Annual Awards Gala Modal */}
      {activeGala && (
        <AwardsGalaModal
          ceremony={activeGala}
          player={player}
          onClose={() => {
            setActiveGala(null);
            getEngine().closeGalaCeremony();
          }}
        />
      )}

      {/* Era Milestone & Simulated Magazine Cover Generator Modal */}
      {activeMilestone && (
        <EraMilestoneModal
          milestone={activeMilestone}
          player={player}
          world={world}
          onClose={() => setActiveMilestone(null)}
        />
      )}
    </div>
    </ErrorBoundary>
  );
}
