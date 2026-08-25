import React, { useState } from 'react';
import { Artist, WorldState } from '../types';
import { Network, Heart, Flame, MessageSquare, Swords, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';

interface RelationshipsViewProps {
  player: Artist;
  world: WorldState;
  onInteract: (targetArtistId: string, actionType: 'collab_request' | 'shoutout' | 'diss') => void;
}

export const RelationshipsView: React.FC<RelationshipsViewProps> = ({
  player,
  world,
  onInteract
}) => {
  const [filter, setFilter] = useState<'all' | 'friends' | 'rivals' | 'feuds'>('all');
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);

  const otherArtists = (Object.values(world.artists) as Artist[]).filter(a => a.id !== player.id && !a.isRetired);

  const filteredArtists = otherArtists.filter(a => {
    const rel = player.relationships[a.id];
    if (filter === 'friends') return rel?.relationType === 'friend' || rel?.relationType === 'mentor' || (rel?.affinity ?? 0) > 30;
    if (filter === 'rivals') return rel?.relationType === 'rival';
    if (filter === 'feuds') return rel?.relationType === 'feud' || (rel?.affinity ?? 0) < -20;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Network className="w-6 h-6 text-rose-500" />
            Red de Artistas, Vínculos & Rivalidades
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Construí alianzas creativas, ganate el respeto de leyendas, gestioná rivalidades y colaborá en himnos generacionales.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filter === 'all' ? 'bg-rose-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Todos ({otherArtists.length})
          </button>
          <button
            onClick={() => setFilter('friends')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filter === 'friends' ? 'bg-rose-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Aliados
          </button>
          <button
            onClick={() => setFilter('rivals')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filter === 'rivals' ? 'bg-rose-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Rivales
          </button>
          <button
            onClick={() => setFilter('feuds')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filter === 'feuds' ? 'bg-rose-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Feudos
          </button>
        </div>
      </div>

      {/* Grid of Artists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArtists.map(artist => {
          const rel = player.relationships[artist.id] || {
            targetArtistId: artist.id,
            relationType: 'neutral',
            affinity: 0,
            respect: 50,
            pastCollabsCount: 0,
            history: []
          };

          const isSelected = selectedArtistId === artist.id;

          return (
            <div
              key={artist.id}
              className={`bg-zinc-900/50 border rounded-2xl p-5 space-y-4 transition-all flex flex-col justify-between ${
                rel.relationType === 'feud'
                  ? 'border-rose-600/40 bg-rose-950/10'
                  : rel.relationType === 'friend'
                  ? 'border-emerald-600/40 bg-emerald-950/10'
                  : 'border-zinc-800'
              }`}
            >
              {/* Header Info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${artist.avatarColor || 'from-zinc-700 to-zinc-900'} flex items-center justify-center text-white font-black text-lg border border-white/10 shadow`}>
                      {artist.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                        {artist.name}
                      </h3>
                      <p className="text-[11px] text-zinc-400">
                        {artist.country} • {world.genres[artist.mainGenreId]?.name || artist.mainGenreId}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    rel.relationType === 'feud'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : rel.relationType === 'friend'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : rel.relationType === 'mentor'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}>
                    {rel.relationType}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono pt-1">
                  <span>Pop: <strong className="text-white">{artist.stats.popularity}</strong></span>
                  <span>Oyentes: <strong className="text-emerald-400">{(artist.stats.monthlyListeners / 1000000).toFixed(1)}M</strong></span>
                  <span>Etapa: <strong className="text-zinc-300">{artist.careerStage}</strong></span>
                </div>
              </div>

              {/* Relationship Meters */}
              <div className="space-y-2 bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-400">Afinidad Mutua</span>
                    <span className={`font-bold font-mono ${rel.affinity >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {rel.affinity > 0 ? `+${rel.affinity}` : rel.affinity}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${rel.affinity >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${Math.max(10, Math.abs(rel.affinity))}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-400">Respeto Profesional</span>
                    <span className="font-bold text-indigo-300 font-mono">{rel.respect}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${rel.respect}%` }} />
                  </div>
                </div>

                {rel.history.length > 0 && (
                  <div className="pt-2 border-t border-zinc-900 text-[10px] text-zinc-400 italic">
                    Último hito: "{rel.history[rel.history.length - 1]}"
                  </div>
                )}
              </div>

              {/* Interaction Actions */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => onInteract(artist.id, 'collab_request')}
                  className="bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 font-bold text-[10px] uppercase py-2 rounded-lg transition-colors cursor-pointer flex flex-col items-center gap-1"
                  title="Proponer Colaboración"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Colab</span>
                </button>

                <button
                  onClick={() => onInteract(artist.id, 'shoutout')}
                  className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 font-bold text-[10px] uppercase py-2 rounded-lg transition-colors cursor-pointer flex flex-col items-center gap-1"
                  title="Elogio Público / Mención"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Elogio</span>
                </button>

                <button
                  onClick={() => onInteract(artist.id, 'diss')}
                  className="bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 font-bold text-[10px] uppercase py-2 rounded-lg transition-colors cursor-pointer flex flex-col items-center gap-1"
                  title="Tiradera / Diss Track"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Tiradera</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
