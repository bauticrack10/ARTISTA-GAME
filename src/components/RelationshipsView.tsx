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
      <div className="bg-[#f7f4ed] p-6 rounded-[16px] border border-[#eceae4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1c1c1c] tracking-[-0.9px] flex items-center gap-2">
            <Network className="w-5 h-5 text-[#1c1c1c]" />
            Red de Artistas, Vínculos & Rivalidades
          </h1>
          <p className="text-xs text-[#5f5f5d] mt-1">
            Construí alianzas creativas, ganate el respeto de leyendas, gestioná rivalidades y colaborá en himnos generacionales.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-[#fcfbf8] p-1 rounded-[8px] border border-[#eceae4] text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-[6px] font-semibold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px]'
                : 'text-[#5f5f5d] hover:text-[#1c1c1c]'
            }`}
          >
            Todos ({otherArtists.length})
          </button>
          <button
            onClick={() => setFilter('friends')}
            className={`px-3 py-1.5 rounded-[6px] font-semibold transition-all cursor-pointer ${
              filter === 'friends'
                ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px]'
                : 'text-[#5f5f5d] hover:text-[#1c1c1c]'
            }`}
          >
            Aliados
          </button>
          <button
            onClick={() => setFilter('rivals')}
            className={`px-3 py-1.5 rounded-[6px] font-semibold transition-all cursor-pointer ${
              filter === 'rivals'
                ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px]'
                : 'text-[#5f5f5d] hover:text-[#1c1c1c]'
            }`}
          >
            Rivales
          </button>
          <button
            onClick={() => setFilter('feuds')}
            className={`px-3 py-1.5 rounded-[6px] font-semibold transition-all cursor-pointer ${
              filter === 'feuds'
                ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px]'
                : 'text-[#5f5f5d] hover:text-[#1c1c1c]'
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

          return (
            <div
              key={artist.id}
              className="bg-[#f7f4ed] border border-[#eceae4] rounded-[12px] p-5 space-y-4 flex flex-col justify-between"
            >
              {/* Header Info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-[6px] bg-[#1c1c1c] flex items-center justify-center text-[#fcfbf8] font-semibold text-base`}>
                      {artist.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-[#1c1c1c] flex items-center gap-1.5">
                        {artist.name}
                      </h3>
                      <p className="text-[11px] text-[#5f5f5d]">
                        {artist.country} • {world.genres[artist.mainGenreId]?.name || artist.mainGenreId}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[4px] border border-[#eceae4] bg-[#fcfbf8] text-[#1c1c1c]">
                    {rel.relationType}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#5f5f5d] font-mono pt-1">
                  <span>Pop: <strong className="text-[#1c1c1c] font-semibold">{artist.stats.popularity}</strong></span>
                  <span>Oyentes: <strong className="text-[#1c1c1c] font-semibold">{(artist.stats.monthlyListeners / 1000000).toFixed(1)}M</strong></span>
                  <span>Etapa: <strong className="text-[#5f5f5d]">{artist.careerStage}</strong></span>
                </div>
              </div>

              {/* Relationship Meters */}
              <div className="space-y-2 bg-[#fcfbf8] p-3 rounded-[8px] border border-[#eceae4] text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#5f5f5d]">Afinidad Mutua</span>
                    <span className="font-semibold font-mono text-[#1c1c1c]">
                      {rel.affinity > 0 ? `+${rel.affinity}` : rel.affinity}
                    </span>
                  </div>
                  <div className="w-full bg-[#eceae4] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#1c1c1c]"
                      style={{ width: `${Math.max(10, Math.abs(rel.affinity))}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#5f5f5d]">Respeto Profesional</span>
                    <span className="font-semibold text-[#1c1c1c] font-mono">{rel.respect}%</span>
                  </div>
                  <div className="w-full bg-[#eceae4] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#1c1c1c] h-full rounded-full" style={{ width: `${rel.respect}%` }} />
                  </div>
                </div>

                {rel.history.length > 0 && (
                  <div className="pt-2 border-t border-[#eceae4] text-[10px] text-[#5f5f5d] italic">
                    Último hito: "{rel.history[rel.history.length - 1]}"
                  </div>
                )}
              </div>

              {/* Interaction Actions */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => onInteract(artist.id, 'collab_request')}
                  className="btn-cream-surface !py-1.5 !px-2 !text-[11px] !font-medium flex flex-col items-center gap-1"
                  title="Proponer Colaboración"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#1c1c1c]" />
                  <span>Colab</span>
                </button>

                <button
                  onClick={() => onInteract(artist.id, 'shoutout')}
                  className="btn-cream-surface !py-1.5 !px-2 !text-[11px] !font-medium flex flex-col items-center gap-1"
                  title="Elogio Público / Mención"
                >
                  <Heart className="w-3.5 h-3.5 text-[#1c1c1c]" />
                  <span>Elogio</span>
                </button>

                <button
                  onClick={() => onInteract(artist.id, 'diss')}
                  className="btn-cream-surface !py-1.5 !px-2 !text-[11px] !font-medium flex flex-col items-center gap-1"
                  title="Tiradera / Diss Track"
                >
                  <Swords className="w-3.5 h-3.5 text-[#1c1c1c]" />
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

