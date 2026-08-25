import React, { useState } from 'react';
import { WorldState, NewsItem } from '../types';
import { Newspaper, Radio, Flame, Sparkles, TrendingUp, Award, Swords } from 'lucide-react';

interface NewsViewProps {
  world: WorldState;
}

export const NewsView: React.FC<NewsViewProps> = ({ world }) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredNews = world.news.filter(n => {
    if (filter === 'all') return true;
    return n.category === filter;
  });

  const getBadgeColor = (cat: NewsItem['category']) => {
    switch (cat) {
      case 'release': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'chart': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'award': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'rivalry': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'trend': return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-rose-500" />
            Prensa & Noticias Musicales
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Cobertura periodística en tiempo real de lanzamientos, récords en los charts, polémicas y premiaciones internacionales.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs max-w-full">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'release', label: 'Lanzamientos' },
            { id: 'chart', label: 'Charts' },
            { id: 'award', label: 'Premios' },
            { id: 'rivalry', label: 'Polémicas' },
            { id: 'trend', label: 'Tendencias' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                filter === f.id ? 'bg-rose-600 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* News Feed Cards */}
      <div className="space-y-3">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-xs bg-zinc-900/40 border border-zinc-800 rounded-2xl">
            No hay noticias en esta categoría.
          </div>
        ) : (
          filteredNews.map(item => (
            <div
              key={item.id}
              className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 p-5 rounded-2xl space-y-2 transition-colors shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getBadgeColor(item.category)}`}>
                  {item.category}
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  Año {item.year} • Mes {item.month}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-white">
                {item.headline}
              </h3>

              <p className="text-xs text-zinc-300 leading-relaxed">
                {item.body}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
