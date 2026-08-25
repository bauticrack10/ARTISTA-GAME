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

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#f7f4ed] p-6 rounded-[16px] border border-[#eceae4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1c1c1c] tracking-[-0.9px] flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-[#1c1c1c]" />
            Prensa & Noticias Musicales
          </h1>
          <p className="text-xs text-[#5f5f5d] mt-1">
            Cobertura periodística en tiempo real de lanzamientos, récords en los charts, polémicas y premiaciones internacionales.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto bg-[#fcfbf8] p-1 rounded-[8px] border border-[#eceae4] text-xs max-w-full">
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
              className={`px-3 py-1.5 rounded-[6px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filter === f.id
                  ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-[rgba(255,255,255,0.2)_0px_0.5px_0px_0px_inset,rgba(0,0,0,0.2)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.05)_0px_1px_2px_0px]'
                  : 'text-[#5f5f5d] hover:text-[#1c1c1c]'
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
          <div className="text-center py-12 text-[#5f5f5d] text-xs bg-[#f7f4ed] border border-[#eceae4] rounded-[12px]">
            No hay noticias en esta categoría.
          </div>
        ) : (
          filteredNews.map(item => (
            <div
              key={item.id}
              className="bg-[#fcfbf8] border border-[#eceae4] p-5 rounded-[12px] space-y-2 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[4px] border border-[#eceae4] bg-[#f7f4ed] text-[#1c1c1c]">
                  {item.category}
                </span>
                <span className="text-xs font-mono text-[#5f5f5d]">
                  Año {item.year} • Mes {item.month}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-[#1c1c1c]">
                {item.headline}
              </h3>

              <p className="text-xs text-[#5f5f5d] leading-relaxed">
                {item.body}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

