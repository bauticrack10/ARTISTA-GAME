import React, { useState } from 'react';
import { Artist, WorldState, Song, Album, ReleaseType, LongevityCurve, Producer, Genre } from '../types';
import { Disc3, Sparkles, Mic, Sliders, DollarSign, Layers, CheckCircle2, Music2, Flame, Award } from 'lucide-react';

interface StudioViewProps {
  player: Artist;
  world: WorldState;
  onReleaseSong: (params: {
    title: string;
    genreId: string;
    subGenreIds: string[];
    featuredArtistIds: string[];
    producerId?: string;
    budgetProduction: number;
    budgetMarketing: number;
    longevityCurve: LongevityCurve;
  }) => void;
  onReleaseAlbum: (params: {
    title: string;
    type: Album['type'];
    genreId: string;
    subGenreIds: string[];
    songTitles: string[];
    budgetProduction: number;
    budgetMarketing: number;
    producerId?: string;
  }) => void;
}

export const StudioView: React.FC<StudioViewProps> = ({
  player,
  world,
  onReleaseSong,
  onReleaseAlbum
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'album' | 'catalog'>('single');

  // Single State
  const [singleTitle, setSingleTitle] = useState('');
  const [singleGenre, setSingleGenre] = useState(player.mainGenreId);
  const [singleProducer, setSingleProducer] = useState<string>('');
  const [singleFeatures, setSingleFeatures] = useState<string[]>([]);
  const [singleProdBudget, setSingleProdBudget] = useState(1500);
  const [singleMktBudget, setSingleMktBudget] = useState(1500);
  const [singleLongevity, setSingleLongevity] = useState<LongevityCurve>('steady');

  // Album State
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumType, setAlbumType] = useState<ReleaseType>('album');
  const [albumGenre, setAlbumGenre] = useState(player.mainGenreId);
  const [albumProducer, setAlbumProducer] = useState<string>('');
  const [albumProdBudget, setAlbumProdBudget] = useState(8000);
  const [albumMktBudget, setAlbumMktBudget] = useState(6000);
  const [albumTracks, setAlbumTracks] = useState<string[]>([
    'Intro (Génesis)',
    'Fuego en la Ciudad',
    'Noches Eternas',
    'Diamantes de Cristal',
    'El Último Trago',
    'Outro (Inmortal)'
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const playerSongs = (Object.values(world.songs) as Song[]).filter(s => s.artistId === player.id);
  const playerAlbums = (Object.values(world.albums) as Album[]).filter(a => a.artistId === player.id);
  const otherArtists = (Object.values(world.artists) as Artist[]).filter(a => a.id !== player.id && !a.isRetired);

  const handleCreateSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleTitle.trim()) return;

    const totalCost = singleProdBudget + singleMktBudget + (singleProducer ? (world.producers[singleProducer]?.costPerTrack || 0) : 0);
    if (totalCost > player.stats.funds) {
      alert(`Fondos insuficientes. Necesitás $${totalCost.toLocaleString()} y tenés $${player.stats.funds.toLocaleString()}`);
      return;
    }
    if (player.stats.energy < 15) {
      alert('Tu artista está demasiado agotado para grabar. ¡Tomate un respiro antes!');
      return;
    }

    onReleaseSong({
      title: singleTitle,
      genreId: singleGenre,
      subGenreIds: [],
      featuredArtistIds: singleFeatures,
      producerId: singleProducer || undefined,
      budgetProduction: singleProdBudget,
      budgetMarketing: singleMktBudget,
      longevityCurve: singleLongevity
    });

    setNotification(`¡"${singleTitle}" ha sido lanzado al mercado mundial!`);
    setSingleTitle('');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumTitle.trim()) return;

    const totalCost = albumProdBudget + albumMktBudget + (albumProducer ? (world.producers[albumProducer]?.costPerTrack || 0) * 2 : 0);
    if (totalCost > player.stats.funds) {
      alert(`Fondos insuficientes. Necesitás $${totalCost.toLocaleString()} y tenés $${player.stats.funds.toLocaleString()}`);
      return;
    }
    if (player.stats.energy < 35) {
      alert('Tu artista está exhausto. Necesitás al menos 35% de energía para producir un álbum.');
      return;
    }

    onReleaseAlbum({
      title: albumTitle,
      type: albumType,
      genreId: albumGenre,
      subGenreIds: [],
      songTitles: albumTracks.filter(t => t.trim().length > 0),
      budgetProduction: albumProdBudget,
      budgetMarketing: albumMktBudget,
      producerId: albumProducer || undefined
    });

    setNotification(`¡El álbum "${albumTitle}" ha sido publicado en todas las plataformas!`);
    setAlbumTitle('');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Disc3 className="w-6 h-6 text-rose-500" />
            Estudio de Grabación & Producción
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Diseñá tus sencillos, componé álbumes conceptuales, contratá productores estrella y definí la estrategia de lanzamiento.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'single'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Lanzar Single
          </button>
          <button
            onClick={() => setActiveTab('album')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'album'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Grabar Álbum / EP
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Catálogo ({playerSongs.length})
          </button>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-bold animate-fade-in shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {notification}
        </div>
      )}

      {/* --- SINGLE CREATION FORM --- */}
      {activeTab === 'single' && (
        <form onSubmit={handleCreateSingle} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-zinc-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Mic className="w-4 h-4 text-rose-400" />
              Componer un Nuevo Single
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Un sencillo promocional para impactar en playlists y escalar en los charts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title & Genre */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Título de la Canción *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Medianoche en Tokio, Barrio Fino..."
                  value={singleTitle}
                  onChange={e => setSingleTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-rose-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Género Musical
                </label>
                <select
                  value={singleGenre}
                  onChange={e => setSingleGenre(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                >
                  {(Object.values(world.genres) as Genre[]).map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name} (Popularidad: {g.currentPopularity}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Productor Musical / Beatmaker
                </label>
                <select
                  value={singleProducer}
                  onChange={e => setSingleProducer(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                >
                  <option value="">Autoproducción / Productor Local ($0)</option>
                  {(Object.values(world.producers) as Producer[]).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (+{p.qualityBoost}% Calidad) — ${p.costPerTrack.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Features & Longevity */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Comportamiento & Curva de Streaming
                </label>
                <select
                  value={singleLongevity}
                  onChange={e => setSingleLongevity(e.target.value as LongevityCurve)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                >
                  <option value="steady">Estable (Crecimiento y caída predecible)</option>
                  <option value="explosive_drop">Debut Explosivo (Gran impacto inicial, caída rápida)</option>
                  <option value="slow_burn">Slow Burn (Crece lentamente durante 6-12 meses)</option>
                  <option value="sleeper_viral">Potencial Viral Durmiente (Puede estallar años después)</option>
                  <option value="instant_classic">Clásico Instantáneo (Mínima pérdida de streams con los años)</option>
                </select>
              </div>

              {/* Budgets */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                    Presupuesto Producción
                  </label>
                  <div className="text-sm font-bold text-emerald-400 font-mono mb-1">
                    ${singleProdBudget.toLocaleString()}
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="25000"
                    step="500"
                    value={singleProdBudget}
                    onChange={e => setSingleProdBudget(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>

                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                    Marketing & Campaña
                  </label>
                  <div className="text-sm font-bold text-emerald-400 font-mono mb-1">
                    ${singleMktBudget.toLocaleString()}
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="25000"
                    step="500"
                    value={singleMktBudget}
                    onChange={e => setSingleMktBudget(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>
              </div>

              {/* Cost and Energy Warning */}
              <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Costo Total de Lanzamiento:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  ${(singleProdBudget + singleMktBudget + (singleProducer ? (world.producers[singleProducer]?.costPerTrack || 0) : 0)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-800">
            <button
              type="submit"
              className="bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg shadow-rose-600/30 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Disc3 className="w-4 h-4" />
              <span>Grabar & Publicar Single</span>
            </button>
          </div>
        </form>
      )}

      {/* --- ALBUM CREATION FORM --- */}
      {activeTab === 'album' && (
        <form onSubmit={handleCreateAlbum} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-zinc-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Grabar Proyecto de Larga Duración (Álbum / EP / Mixtape)
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Una obra conceptual completa para definir una era y buscar reconocimientos en los premios anuales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Título del Proyecto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Crónicas de una Noche, Génesis..."
                  value={albumTitle}
                  onChange={e => setAlbumTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Formato
                  </label>
                  <select
                    value={albumType}
                    onChange={e => setAlbumType(e.target.value as ReleaseType)}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-colors"
                  >
                    <option value="album">Álbum de Estudio</option>
                    <option value="ep">EP (Corta Duración)</option>
                    <option value="mixtape">Mixtape Callejera</option>
                    <option value="deluxe">Edición Deluxe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Género Principal
                  </label>
                  <select
                    value={albumGenre}
                    onChange={e => setAlbumGenre(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-colors"
                  >
                    {(Object.values(world.genres) as Genre[]).map(g => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budgets */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                    Producción & Mastering
                  </label>
                  <div className="text-sm font-bold text-emerald-400 font-mono mb-1">
                    ${albumProdBudget.toLocaleString()}
                  </div>
                  <input
                    type="range"
                    min="3000"
                    max="60000"
                    step="1000"
                    value={albumProdBudget}
                    onChange={e => setAlbumProdBudget(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                    Marketing & Campaña Global
                  </label>
                  <div className="text-sm font-bold text-emerald-400 font-mono mb-1">
                    ${albumMktBudget.toLocaleString()}
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="60000"
                    step="1000"
                    value={albumMktBudget}
                    onChange={e => setAlbumMktBudget(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Tracklist Builder */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Tracklist del Álbum ({albumTracks.length} Canciones)
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {albumTracks.map((track, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-mono text-xs text-zinc-500 w-5 text-right">{i + 1}.</span>
                    <input
                      type="text"
                      value={track}
                      onChange={e => {
                        const copy = [...albumTracks];
                        copy[i] = e.target.value;
                        setAlbumTracks(copy);
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAlbumTracks([...albumTracks, `Track ${albumTracks.length + 1}`])}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
                >
                  + Agregar Canción
                </button>
                {albumTracks.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setAlbumTracks(albumTracks.slice(0, -1))}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-rose-400 text-xs font-semibold cursor-pointer"
                  >
                    - Quitar Última
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-800">
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg shadow-amber-600/30 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>Publicar Proyecto Completo</span>
            </button>
          </div>
        </form>
      )}

      {/* --- COMPLETE CATALOG VIEWER --- */}
      {activeTab === 'catalog' && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Music2 className="w-4 h-4 text-rose-400" />
              Discografía & Catálogo Oficial
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              Total Streams: {(player.stats.totalStreams / 1000000).toFixed(2)}M
            </span>
          </div>

          {playerSongs.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              No tenés canciones grabadas aún.
            </div>
          ) : (
            <div className="space-y-3">
              {playerSongs.map(song => (
                <div
                  key={song.id}
                  className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-white">
                        {song.title}
                      </h3>
                      {song.wentViral && (
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 font-bold">
                          Viral Hit
                        </span>
                      )}
                      {song.isClassic && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                          Clásico Inmortal
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400">
                      Lanzado: {song.releaseYear} • Género: {world.genres[song.genreId]?.name || song.genreId} • Calidad: {song.quality}% • Comercial: {song.commercialAppeal}%
                    </p>
                  </div>

                  <div className="flex items-center gap-6 text-xs font-mono">
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Peak Global</span>
                      <span className="font-bold text-indigo-400 text-sm">
                        {song.peakPosition.Global ? `#${song.peakPosition.Global}` : '—'}
                      </span>
                    </div>

                    <div>
                      <span className="text-zinc-500 block text-[10px]">Streams / Mes</span>
                      <span className="font-bold text-emerald-400 text-sm">
                        {song.streamsLastMonth.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-zinc-500 block text-[10px]">Streams Totales</span>
                      <span className="font-bold text-white text-sm">
                        {(song.streamsTotal / 1000000).toFixed(2)}M
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
