import React, { useState } from 'react';
import { WorldState, NewsItem } from '../types';
import { Newspaper, Radio, Flame, Sparkles, TrendingUp, Award, Swords } from 'lucide-react';
import { TimeSystem } from '../systems/TimeSystem';

interface NewsViewProps {
  world: WorldState;
}

export const NewsView: React.FC<NewsViewProps> = ({ world }) => {
  const [filter, setFilter] = useState<string>('all');

  const newsList = world?.news || [];
  const filteredNews = newsList.filter(n => {
    if (filter === 'all') return true;
    return n.category === filter;
  });

  return (
    <div className="space-y-6 pb-12 text-[#F4F4F6]">
      {/* Header */}
      <div className="bg-[#111114] p-6 rounded-[6px] border border-[#242429] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F4F6] tracking-tight flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-[#FF4F00]" />
            Prensa & Noticias Musicales
          </h1>
          <p className="text-xs text-[#8E8E99] mt-1">
            Cobertura periodística en tiempo real de lanzamientos, récords en los charts, polémicas y premiaciones internacionales.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto scroll-fade-x bg-[#09090B] p-1 rounded-[4px] border border-[#242429] text-xs max-w-full">
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
              className={`px-3 py-1.5 rounded-[4px] font-sans text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filter === f.id
                  ? 'bg-[#FF4F00] text-white'
                  : 'text-[#8E8E99] hover:text-[#F4F4F6] hover:bg-[#18181C]'
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
          <div className="text-center py-12 text-[#8E8E99] text-xs font-sans bg-[#111114] border border-[#242429] rounded-[4px]">
            No hay noticias en esta categoría.
          </div>
        ) : (
          filteredNews.map(item => (
            <div
              key={item.id}
              className="bg-[#111114] border border-[#242429] p-5 rounded-[4px] space-y-2 transition-colors hover:border-[#3F3F46] shadow-xs"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] border border-[#242429] bg-[#18181C] text-[#8E8E99]">
                  {item.category}
                </span>
                <span 
                  className="text-xs font-sans tabular-nums text-[#8E8E99]"
                  title={TimeSystem.getCalendarLabel(item.month, item.year)}
                >
                  Año {item.year} • {TimeSystem.getMonthName(item.month)}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#F4F4F6] tracking-tight">
                {item.headline}
              </h3>

              <p className="text-xs text-[#D4D4D8] leading-relaxed">
                {item.body}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

