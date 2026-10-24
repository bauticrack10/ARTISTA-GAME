import React, { useState, useMemo } from 'react';
import { WorldState, Artist, NewsItem, SocialPost } from '../types';
import {
  Radio,
  Sparkles,
  MessageCircle,
  Heart,
  Repeat,
  CheckCircle
} from 'lucide-react';
import { TimeSystem } from '../systems/TimeSystem';

export interface NewsSidebarProps {
  world: WorldState;
  player?: Artist;
  onNavigate?: (tab: string) => void;
  maxHeight?: string;
  className?: string;
}

type SidebarTab = 'press' | 'social';

export const NewsSidebar: React.FC<NewsSidebarProps> = ({
  world,
  player,
  maxHeight = 'max-h-[620px]',
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('press');

  const newsList = world.news || [];

  const socialPosts = useMemo<SocialPost[]>(() => {
    if (world.socialFeed && world.socialFeed.length > 0) {
      return world.socialFeed;
    }

    const posts: SocialPost[] = [];
    const playerName = player?.name || 'El Artista';
    const playerListeners = player?.stats?.monthlyListeners || 0;
    const playerStage = player?.careerStage || 'Underground';
    const curYear = world?.currentYear || 2026;
    const curMonth = world?.currentMonth || 1;

    if (player) {
      posts.push({
        id: `post_p_${curYear}_${curMonth}_1`,
        platform: 'twitter',
        authorName: 'Charts & Data Urbano',
        authorHandle: 'DataUrbanoNews',
        authorVerified: true,
        authorType: 'media',
        content: `${playerName} continúa consolidando su etapa como ${playerStage} con ${(playerListeners || 0).toLocaleString('es-AR')} oyentes activos.`,
        year: curYear,
        month: curMonth,
        likes: Math.max(120, Math.floor(playerListeners * 0.08)),
        retweetsOrShares: Math.max(45, Math.floor(playerListeners * 0.02)),
        commentsCount: Math.max(18, Math.floor(playerListeners * 0.01)),
        sentiment: 'hype'
      });
    }

    newsList.slice(0, 3).forEach((news, idx) => {
      posts.push({
        id: `post_news_${news.id}_${idx}`,
        platform: idx % 2 === 0 ? 'twitter' : 'instagram',
        authorName: idx % 2 === 0 ? 'Crítica Sonora' : 'Escena Global Beat',
        authorHandle: idx % 2 === 0 ? 'critica_sonora' : 'escena_beat',
        authorVerified: true,
        authorType: idx % 2 === 0 ? 'critic' : 'influencer',
        content: `"${news.headline}" — Movimiento clave en la escena musical.`,
        year: news.year || curYear,
        month: news.month || curMonth,
        likes: 1400 + idx * 620,
        retweetsOrShares: 320 + idx * 110,
        commentsCount: 95 + idx * 40,
        sentiment: 'polarizing'
      });
    });

    return posts;
  }, [world?.socialFeed, newsList, player, world?.currentYear, world?.currentMonth]);

  const getThematicTag = (item: NewsItem) => {
    if (item.importance >= 5) {
      return { label: 'URGENTE', style: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30 font-bold' };
    }
    switch (item.category) {
      case 'industry':
        return { label: 'INDUSTRIA', style: 'bg-[#18181C] text-[#8E8E99] border-[#242429]' };
      case 'chart':
        return { label: 'CHARTS', style: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30' };
      case 'award':
        return { label: 'PREMIOS', style: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30' };
      case 'release':
        return { label: 'LANZAMIENTO', style: 'bg-[#FF4F00]/15 text-[#FF4F00] border-[#FF4F00]/30' };
      case 'rivalry':
      case 'scandal':
        return { label: 'POLÉMICA', style: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30' };
      default:
        return { label: 'ESCENA', style: 'bg-[#00E599]/15 text-[#00E599] border-[#00E599]/30' };
    }
  };

  return (
    <aside
      className={`liquid-glass-card p-5 space-y-3.5 flex flex-col h-full text-[#F4F4F6] ${className}`}
    >
      {/* Header con Selector Directo */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 relative z-10">
        <div className="flex items-center gap-2">
          {activeTab === 'press' ? (
            <Radio className="w-4 h-4 text-[#00E599]" />
          ) : (
            <Sparkles className="w-4 h-4 text-[#FF4F00]" />
          )}
          <h3 className="text-sm font-bold text-[#F4F4F6]">
            {activeTab === 'press' ? 'Noticias de la Escena' : 'Pulso en Redes'}
          </h3>
        </div>

        <div className="flex items-center liquid-glass-pill p-0.5 text-xs">
          <button
            onClick={() => setActiveTab('press')}
            className={`py-1 px-2.5 rounded-[6px] font-sans font-bold transition-all cursor-pointer ${
              activeTab === 'press'
                ? 'bg-white/15 text-[#F4F4F6] border border-white/20 shadow-xs'
                : 'text-[#8E8E99] hover:text-[#F4F4F6]'
            }`}
          >
            Prensa
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`py-1 px-2.5 rounded-[6px] font-sans font-bold transition-all cursor-pointer ${
              activeTab === 'social'
                ? 'bg-white/15 text-[#F4F4F6] border border-white/20 shadow-xs'
                : 'text-[#8E8E99] hover:text-[#F4F4F6]'
            }`}
          >
            Redes
          </button>
        </div>
      </div>

      {/* TAB 1: PRENSA */}
      {activeTab === 'press' && (
        <div className="space-y-2.5 flex-1 overflow-y-auto pr-1 relative z-10 min-h-[280px]">
          {newsList.length === 0 ? (
            <div className="liquid-glass-subcard p-6 text-center text-xs text-[#8E8E99] border-dashed">
              No hay noticias recientes.
            </div>
          ) : (
            newsList.slice(0, 12).map((news) => {
              const tag = getThematicTag(news);
              const isPlayerMentioned = player
                ? news.relatedArtistIds?.includes(player.id) || news.headline.includes(player.name)
                : false;

              return (
                <article
                  key={news.id}
                  className={`liquid-glass-subcard p-3 text-xs space-y-1.5 group hover:border-white/28 transition-all ${
                    isPlayerMentioned
                      ? 'border-l-4 border-l-[#FF4F00]'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-sans font-bold uppercase px-1.5 py-0.2 rounded-[4px] border ${tag.style}`}>
                        {tag.label}
                      </span>
                      {isPlayerMentioned && (
                        <span className="text-[10px] font-sans font-bold bg-[#FF4F00]/20 text-[#FF4F00] px-1.5 py-0.2 rounded-[4px]">
                          Tú
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#8E8E99] font-sans tabular-nums">
                      {TimeSystem.getMonthName(news.month)} {news.year}
                    </span>
                  </div>

                  <h4 className="font-bold text-[#F4F4F6] leading-snug text-xs line-clamp-2">
                    {news.headline}
                  </h4>

                  <p className="text-[#8E8E99] text-xs line-clamp-2 leading-relaxed">
                    {news.body}
                  </p>
                </article>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: REDES */}
      {activeTab === 'social' && (
        <div className="space-y-2.5 flex-1 overflow-y-auto pr-1 relative z-10 min-h-[280px]">
          {socialPosts.map((post) => (
            <div
              key={post.id}
              className="liquid-glass-subcard p-3 text-xs space-y-2 group hover:border-white/28 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-bold text-[#F4F4F6] truncate">{post.authorName}</span>
                  {post.authorVerified && <CheckCircle className="w-3 h-3 text-cyan-400 shrink-0" />}
                  <span className="text-[11px] text-[#8E8E99] truncate">@{post.authorHandle}</span>
                </div>
                <span className="text-[10px] text-[#8E8E99] font-sans tabular-nums shrink-0">
                  M{post.month}
                </span>
              </div>

              <p className="text-xs text-[#F4F4F6] leading-relaxed">{post.content}</p>

              <div className="flex items-center gap-4 text-[11px] text-[#8E8E99] font-sans tabular-nums pt-1 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-[#FF2A4B]" />
                  {(post.likes || 0).toLocaleString('es-AR')}
                </span>
                <span className="flex items-center gap-1">
                  <Repeat className="w-3 h-3 text-[#00E599]" />
                  {(post.retweetsOrShares || 0).toLocaleString('es-AR')}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-[#8E8E99]" />
                  {(post.commentsCount || 0).toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Radar de la Escena al pie para balance de altura completa */}
      <div className="liquid-glass-subcard p-3 text-xs space-y-1.5 relative z-10 mt-auto shrink-0 border-t border-white/10">
        <div className="flex items-center justify-between text-[11px] font-bold text-[#8E8E99]">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#00E599]" />
            Radar de la Escena
          </span>
          <span className="text-[#00E599] font-sans text-2xs uppercase tracking-wider">Activo</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#8E8E99]">
          <span>Temporada: <strong className="text-[#F4F4F6] font-sans">{TimeSystem.getMonthName(world?.currentMonth || 1)} {world?.currentYear || 2026}</strong></span>
          <span>Hype global: <strong className="text-[#FF4F00] font-sans">{player?.stats?.hype || 0}/100</strong></span>
        </div>
      </div>
    </aside>
  );
};

export default NewsSidebar;
