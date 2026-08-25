import React, { useState, useEffect, useRef } from 'react';
import { GameEngine } from './core/GameEngine';
import { WorldState, Artist, EventDefinition, LongevityCurve, TourTier, Album } from './types';
import { StartScreen } from './components/StartScreen';
import { CharacterCreatorView } from './components/CharacterCreatorView';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { StudioView } from './components/StudioView';
import { ChartsView } from './components/ChartsView';
import { ToursView } from './components/ToursView';
import { IndustryView } from './components/IndustryView';
import { RelationshipsView } from './components/RelationshipsView';
import { CareerErasView } from './components/CareerErasView';
import { NewsView } from './components/NewsView';
import { AwardsView } from './components/AwardsView';
import { EventModal } from './components/EventModal';
import { SimulationLabModal } from './components/SimulationLabModal';

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
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  const [showSimLab, setShowSimLab] = useState(false);

  // Subscribe to engine state changes
  useEffect(() => {
    const eng = getEngine();
    const unsubscribe = eng.subscribe((newWorld, newPlayer, newEvent) => {
      setWorld({ ...newWorld });
      setPlayer({ ...newPlayer });
      setCurrentEvent(newEvent);
      if (appMode === 'game') {
        try {
          localStorage.setItem('el_artista_save', eng.exportSaveState());
        } catch (e) {
          // quota or storage error
        }
      }
    });
    return unsubscribe;
  }, [appMode]);

  // Start Screen handlers
  const handleStartNewCareer = () => {
    setAppMode('character_creator');
  };

  const handleContinueSavedGame = () => {
    const saved = localStorage.getItem('el_artista_save');
    if (saved) {
      const eng = new GameEngine();
      const loaded = eng.importSaveState(saved);
      if (loaded) {
        engineRef.current = eng;
        setWorld(eng.getWorld());
        setPlayer(eng.getPlayer());
        setCurrentEvent(eng.getCurrentEvent());
        setAppMode('game');
        setCurrentTab('dashboard');
        return;
      }
    }
    alert('No se pudo cargar la partida guardada.');
  };

  const handleLoadDemoCareer = () => {
    const eng = new GameEngine(); // Defaults to Bhavi demo
    engineRef.current = eng;
    setWorld(eng.getWorld());
    setPlayer(eng.getPlayer());
    setCurrentEvent(eng.getCurrentEvent());
    setAppMode('game');
    setCurrentTab('dashboard');
    try {
      localStorage.setItem('el_artista_save', eng.exportSaveState());
    } catch (e) {}
  };

  const handleImportSaveState = (jsonContent: string) => {
    const eng = new GameEngine();
    const loaded = eng.importSaveState(jsonContent);
    if (loaded) {
      engineRef.current = eng;
      setWorld(eng.getWorld());
      setPlayer(eng.getPlayer());
      setCurrentEvent(eng.getCurrentEvent());
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
    const eng = new GameEngine(customArtist);
    engineRef.current = eng;
    setWorld(eng.getWorld());
    setPlayer(eng.getPlayer());
    setCurrentEvent(eng.getCurrentEvent());
    setAppMode('game');
    setCurrentTab('dashboard');
    try {
      localStorage.setItem('el_artista_save', eng.exportSaveState());
    } catch (e) {}
  };

  // In-Game actions
  const handleAdvanceMonth = () => {
    getEngine().advanceMonth();
  };

  const handleRest = () => {
    getEngine().restAndRecharge();
  };

  const handleExportSave = () => {
    const eng = getEngine();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(eng.exportSaveState());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `el_artista_save_${world.currentYear}_m${world.currentMonth}_${player.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportSaveInGame = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          handleImportSaveState(content);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // 1. START SCREEN
  if (appMode === 'start_screen') {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
        <StartScreen
          onNewCareer={handleStartNewCareer}
          onContinue={handleContinueSavedGame}
          onLoadDemo={handleLoadDemoCareer}
          onImportSave={handleImportSaveState}
          onOpenSimLab={() => setShowSimLab(true)}
        />

        {showSimLab && (
          <SimulationLabModal
            world={world}
            onClose={() => setShowSimLab(false)}
          />
        )}
      </div>
    );
  }

  // 2. CHARACTER CREATOR
  if (appMode === 'character_creator') {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
        <CharacterCreatorView
          world={world}
          onBackToMenu={() => setAppMode('start_screen')}
          onCreatePlayer={handleCreatePlayer}
        />
      </div>
    );
  }

  // 3. ACTIVE GAME DASHBOARD & SYSTEMS
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top App Bar & Navigation */}
      <Navbar
        player={player}
        world={world}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onAdvanceMonth={handleAdvanceMonth}
        onOpenSimLab={() => setShowSimLab(true)}
        onOpenNewArtist={() => setAppMode('character_creator')}
        onReturnToTitle={() => setAppMode('start_screen')}
        onExportSave={handleExportSave}
        onImportSave={handleImportSaveInGame}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-6 pb-12">
        {currentTab === 'dashboard' && (
          <DashboardView
            player={player}
            world={world}
            onNavigate={setCurrentTab}
            onRest={handleRest}
          />
        )}

        {currentTab === 'studio' && (
          <StudioView
            player={player}
            world={world}
            onReleaseSong={(params) => getEngine().releaseSong(params)}
            onReleaseAlbum={(params) => getEngine().releaseAlbum(params)}
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
          />
        )}

        {currentTab === 'relations' && (
          <RelationshipsView
            player={player}
            world={world}
            onInteract={(targetId, type) => getEngine().interactWithArtist(targetId, type)}
          />
        )}

        {currentTab === 'career' && (
          <CareerErasView
            player={player}
            world={world}
          />
        )}

        {currentTab === 'news' && (
          <NewsView
            world={world}
          />
        )}

        {currentTab === 'awards' && (
          <AwardsView
            world={world}
            player={player}
          />
        )}
      </main>

      {/* Event Dilemma Dialog */}
      {currentEvent && (
        <EventModal
          event={currentEvent}
          world={world}
          player={player}
          onSelectChoice={(idx) => getEngine().resolveCurrentEventChoice(idx)}
        />
      )}

      {/* Simulation Lab Modal */}
      {showSimLab && (
        <SimulationLabModal
          world={world}
          onClose={() => setShowSimLab(false)}
        />
      )}
    </div>
  );
}
