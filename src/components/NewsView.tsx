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
    <div
      className="space-y-6 pb-12 text-[#F8FAFC]"
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-[#16181F] p-6 rounded-[16px] border border-[#2A2E3D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <h1 className="text-2xl font-semibold text-[#F8FAFC] tracking-[-0.9px] flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-[#8B5CF6]" />
            Prensa & Noticias Musicales
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Cobertura periodística en tiempo real de lanzamientos, récords en los charts, polémicas y premiaciones internacionales.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto bg-[#0B0C10] p-1 rounded-[8px] border border-[#2A2E3D] text-xs max-w-full">
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
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
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
          <div className="text-center py-12 text-[#94A3B8] text-xs bg-[#16181F] border border-[#2A2E3D] rounded-[12px]">
            No hay noticias en esta categoría.
          </div>
        ) : (
          filteredNews.map(item => (
            <div
              key={item.id}
              className="bg-[#16181F] border border-[#2A2E3D] p-5 rounded-[12px] space-y-2 transition-colors hover:border-[#8B5CF6]/40 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[4px] border border-[#2A2E3D] bg-[#0B0C10] text-[#F8FAFC]">
                  {item.category}
                </span>
                <span 
                  className="text-xs font-mono text-[#94A3B8]"
                  title={TimeSystem.getCalendarLabel(item.month, item.year)}
                >
                  Año {item.year} • {TimeSystem.getMonthName(item.month)}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                {item.headline}
              </h3>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {item.body}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

