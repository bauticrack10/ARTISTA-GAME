import React, { useState } from 'react';
import { Artist, WorldState, Genre } from '../types';
import { Sparkles, User, MapPin, Disc3, Sliders, X } from 'lucide-react';

interface NewArtistModalProps {
  world: WorldState;
  onClose: () => void;
  onCreatePlayer: (customArtist: Partial<Artist>) => void;
}

export const NewArtistModal: React.FC<NewArtistModalProps> = ({ world, onClose, onCreatePlayer }) => {
  const [name, setName] = useState('Dante Vox');
  const [realName, setRealName] = useState('Dante Albarracín');
  const [country, setCountry] = useState('Argentina');
  const [city, setCity] = useState('Buenos Aires');
  const [mainGenreId, setMainGenreId] = useState('trap_latino');
  const [avatarColor, setAvatarColor] = useState('from-[#7C3AED] via-[#8B5CF6] to-[#4F46E5]');

  const [archetype, setArchetype] = useState<'prodigy' | 'commercial' | 'visionary' | 'hitmaker'>('commercial');

  const handleArchetypeChange = (arch: 'prodigy' | 'commercial' | 'visionary' | 'hitmaker') => {
    setArchetype(arch);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let personality = {
      creativity: 80,
      ambition: 85,
      discipline: 80,
      charisma: 85,
      skill: 85,
      commercialAppeal: 85,
      originality: 80,
      riskTolerance: 80,
      sociability: 80,
      independence: 75
    };

    if (archetype === 'prodigy') {
      personality = { ...personality, skill: 95, originality: 90, creativity: 90, commercialAppeal: 70 };
    } else if (archetype === 'visionary') {
      personality = { ...personality, creativity: 98, originality: 98, riskTolerance: 95, commercialAppeal: 65 };
    } else if (archetype === 'commercial') {
      personality = { ...personality, charisma: 95, commercialAppeal: 95, ambition: 95, skill: 80 };
    } else if (archetype === 'hitmaker') {
      personality = { ...personality, discipline: 95, skill: 90, commercialAppeal: 90, ambition: 90 };
    }

    onCreatePlayer({
      id: `artist_custom_${Date.now()}`,
      name,
      realName,
      country,
      city,
      mainGenreId,
      avatarColor,
      personality,
      stats: {
        popularity: 24,
        reputation: 32,
        artisticCredibility: 35,
        energy: 100,
        monthlyListeners: 2100,
        totalStreams: 9200,
        funds: 2500,
        fansCount: 2500,
        fanbaseLoyalty: 60,
        hype: 40
      }
    });
  };

  const gradients = [
    { label: 'Violeta Synth Primario', val: 'from-[#7C3AED] via-[#8B5CF6] to-[#4F46E5]' },
    { label: 'Neón Violeta & Magenta', val: 'from-[#8B5CF6] via-[#9333EA] to-[#C026D3]' },
    { label: 'Cian & Azul Eléctrico', val: 'from-[#06B6D4] via-[#0284C7] to-[#4F46E5]' },
    { label: 'Esmeralda Studio', val: 'from-[#10B981] via-[#0D9488] to-[#06B6D4]' },
    { label: 'Oro & Ámbar Master', val: 'from-[#F59E0B] via-[#D97706] to-[#B45309]' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#16181F] border border-[#2A2E3D] max-w-xl w-full rounded-[16px] p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-[#F8FAFC]">
        <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0B0C10] text-[#8B5CF6] rounded-[6px] border border-[#2A2E3D]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#F8FAFC] tracking-[-0.8px]">
                Crear Nuevo Artista
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Diseñá tu alter ego musical e iniciá una nueva era en la industria.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-[6px] bg-[#0B0C10] hover:bg-[#2A2E3D] border border-[#2A2E3D] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                Nombre Artístico *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] rounded-[6px] px-3.5 py-2 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                Nombre Real
              </label>
              <input
                type="text"
                value={realName}
                onChange={e => setRealName(e.target.value)}
                className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] rounded-[6px] px-3.5 py-2 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                País de Origen
              </label>
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] rounded-[6px] px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none"
              >
                <option value="Argentina">Argentina</option>
                <option value="España">España</option>
                <option value="México">México</option>
                <option value="Puerto Rico">Puerto Rico</option>
                <option value="Colombia">Colombia</option>
                <option value="Chile">Chile</option>
                <option value="USA">Estados Unidos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                Ciudad Natal
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] rounded-[6px] px-3.5 py-2 text-xs text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
              Género Musical Inicial
            </label>
            <select
              value={mainGenreId}
              onChange={e => setMainGenreId(e.target.value)}
              className="w-full bg-[#0B0C10] border border-[#2A2E3D] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] rounded-[6px] px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none"
            >
              {(Object.values(world.genres) as Genre[]).map(g => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Archetypes */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Arquetipo Artístico
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'commercial', title: 'La Estrella Pop', desc: 'Carisma magnético y potencial comercial inmediato.' },
                { id: 'prodigy', title: 'El Prodigio Lírico', desc: 'Habilidad técnica superior y máxima credibilidad.' },
                { id: 'visionary', title: 'El Vanguardista', desc: 'Originalidad radical y experimentación sonora.' },
                { id: 'hitmaker', title: 'El Hitmaker', desc: 'Disciplina de hierro y capacidad de crear hits constantes.' }
              ].map(a => (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => handleArchetypeChange(a.id as any)}
                  className={`p-3 rounded-[8px] border text-left transition-all cursor-pointer ${
                    archetype === a.id
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white border-transparent shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                      : 'bg-[#0B0C10] border-[#2A2E3D] text-[#F8FAFC] hover:border-[#8B5CF6]/50'
                  }`}
                >
                  <p className="text-xs font-bold">{a.title}</p>
                  <p className={`text-[10px] mt-0.5 ${archetype === a.id ? 'text-white/80' : 'text-[#94A3B8]'}`}>{a.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Avatar Color */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
              Paleta Visual del Artista
            </label>
            <div className="flex gap-2">
              {gradients.map(g => (
                <button
                  type="button"
                  key={g.val}
                  onClick={() => setAvatarColor(g.val)}
                  className={`w-8 h-8 rounded-[6px] bg-gradient-to-tr ${g.val} transition-all cursor-pointer ${
                    avatarColor === g.val ? 'ring-2 ring-[#8B5CF6] ring-offset-2 ring-offset-[#16181F] scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={g.label}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#2A2E3D]">
            <button
              type="submit"
              className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold py-2.5 px-6 rounded-[6px] text-xs shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              Comenzar Carrera Musical
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

