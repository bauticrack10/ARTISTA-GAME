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
  const [avatarColor, setAvatarColor] = useState('from-amber-500 to-rose-600');

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
        popularity: 20,
        reputation: 50,
        artisticCredibility: 60,
        energy: 100,
        monthlyListeners: 30000,
        totalStreams: 90000,
        funds: 5000,
        fansCount: 15000,
        fanbaseLoyalty: 75,
        hype: 60
      }
    });
  };

  const gradients = [
    { label: 'Fuego & Rubí', val: 'from-amber-500 to-rose-600' },
    { label: 'Neón Cyberpunk', val: 'from-fuchsia-600 to-indigo-600' },
    { label: 'Esmeralda', val: 'from-emerald-500 to-teal-700' },
    { label: 'Oro & Bronce', val: 'from-yellow-400 to-amber-700' },
    { label: 'Púrpura Profundo', val: 'from-purple-700 to-zinc-950' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-700/80 max-w-xl w-full rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                Crear Nuevo Artista
              </h2>
              <p className="text-xs text-zinc-400">
                Diseñá tu alter ego musical e iniciá una nueva era en la industria.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Nombre Artístico *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-rose-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Nombre Real
              </label>
              <input
                type="text"
                value={realName}
                onChange={e => setRealName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-rose-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                País de Origen
              </label>
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-rose-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
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
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Ciudad Natal
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-rose-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
              Género Musical Inicial
            </label>
            <select
              value={mainGenreId}
              onChange={e => setMainGenreId(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-rose-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
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
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
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
                  className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    archetype === a.id
                      ? 'bg-rose-950/40 border-rose-500 text-white'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <p className="text-xs font-bold">{a.title}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{a.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Avatar Color */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Paleta Visual del Artista
            </label>
            <div className="flex gap-2">
              {gradients.map(g => (
                <button
                  type="button"
                  key={g.val}
                  onClick={() => setAvatarColor(g.val)}
                  className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${g.val} transition-all cursor-pointer ${
                    avatarColor === g.val ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={g.label}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-800">
            <button
              type="submit"
              className="bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg shadow-rose-600/30 transition-all active:scale-95 cursor-pointer"
            >
              Comenzar Carrera Musical
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
