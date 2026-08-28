import React, { useState, useMemo } from 'react';
import { WorldState, Artist, NewsItem, SocialPost, MusicTrend } from '../types';
import {
  Radio,
  Newspaper,
  TrendingUp,
  Sparkles,
  Award,
  Swords,
  Flame,
  Globe2,
  ArrowRight,
  Filter,
  MessageCircle,
  Heart,
  Repeat,
  Share2,
  CheckCircle,
  AtSign,
  Hash
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
  onNavigate,
  maxHeight = 'max-h-[580px]',
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('press');
  const [selectedNewsCategory, setSelectedNewsCategory] = useState<string>('all');
  const [selectedSocialFilter, setSelectedSocialFilter] = useState<string>('all');

  const newsList = world.news || [];
  const monthName = TimeSystem.getMonthName(world.currentMonth);

  // Filtered news items
  const filteredNews = useMemo(() => {
    return newsList.filter((item) => {
      if (selectedNewsCategory === 'all') return true;
      if (selectedNewsCategory === 'charts') return item.category === 'chart';
      if (selectedNewsCategory === 'industry') return item.category === 'industry';
      if (selectedNewsCategory === 'culture') return item.category === 'culture';
      if (selectedNewsCategory === 'releases') return item.category === 'release';
      if (selectedNewsCategory === 'awards') return item.category === 'award';
      return item.category === selectedNewsCategory;
    });
  }, [newsList, selectedNewsCategory]);

  // Contextual procedural & world social feed
  const socialPosts = useMemo<SocialPost[]>(() => {
    if (world.socialFeed && world.socialFeed.length > 0) {
      return world.socialFeed;
    }

    // Generate contextual, hyperrealistic social reactions based on current world state & player
    const posts: SocialPost[] = [];
    const playerName = player?.name || 'El Artista';
    const playerListeners = player?.stats.monthlyListeners || 0;
    const playerStage = player?.careerStage || 'Underground';

    // 1. Post about player's momentum or recent activity
    if (player) {
      posts.push({
        id: `post_p_${world.currentYear}_${world.currentMonth}_1`,
        platform: 'twitter',
        authorName: 'Charts & Data Urbano',
        authorHandle: 'DataUrbanoNews',
        authorVerified: true,
        authorType: 'media',
        content: `${playerName} continúa consolidando su etapa como ${playerStage} con más de ${playerListeners.toLocaleString()} oyentes activos. ¿Se viene la era definitiva? 👀 #ElArtista #Musica`,
        year: world.currentYear,
        month: world.currentMonth,
        likes: Math.max(120, Math.floor(playerListeners * 0.08)),
        retweetsOrShares: Math.max(45, Math.floor(playerListeners * 0.02)),
        commentsCount: Math.max(18, Math.floor(playerListeners * 0.01)),
        sentiment: 'hype'
      });

      posts.push({
        id: `post_p_${world.currentYear}_${world.currentMonth}_2`,
        platform: 'tiktok',
        authorName: 'Mica • Fan Club',
        authorHandle: 'mica_musicvibes',
        authorVerified: false,
        authorType: 'fan',
        content: `No supero el flow y la dirección sonora de ${playerName} este año. La evolución de las barras y la producción está a otro nivel 💖🔥 #Favorito #Hits #Viral`,
        year: world.currentYear,
        month: world.currentMonth,
        likes: Math.max(850, Math.floor(playerListeners * 0.15)),
        retweetsOrShares: Math.max(120, Math.floor(playerListeners * 0.04)),
        commentsCount: Math.max(64, Math.floor(playerListeners * 0.02)),
        sentiment: 'positive'
      });
    }

    // 2. Scene / Industry posts based on recent news
    newsList.slice(0, 3).forEach((news, idx) => {
      posts.push({
        id: `post_news_${news.id}_${idx}`,
        platform: idx % 2 === 0 ? 'twitter' : 'instagram',
        authorName: idx % 2 === 0 ? 'Crítica Sonora' : 'Escena Global Beat',
        authorHandle: idx % 2 === 0 ? 'critica_sonora' : 'escena_beat',
        authorVerified: true,
        authorType: idx % 2 === 0 ? 'critic' : 'influencer',
        content: `Reacción en vivo: "${news.headline}". El movimiento de la industria está marcando un antes y después en las listas mundiales. 🎙️`,
        year: news.year,
        month: news.month,
        likes: 1400 + idx * 620,
        retweetsOrShares: 320 + idx * 110,
        commentsCount: 95 + idx * 40,
        sentiment: 'polarizing'
      });
    });

    return posts;
  }, [world.socialFeed, newsList, player, world.currentYear, world.currentMonth]);

  // Filtered social posts
  const filteredSocialPosts = useMemo(() => {
    return socialPosts.filter((post) => {
      if (selectedSocialFilter === 'all') return true;
      if (selectedSocialFilter === 'hype') return post.sentiment === 'hype' || post.sentiment === 'positive';
      if (selectedSocialFilter === 'critics') return post.authorType === 'critic' || post.authorType === 'media';
      if (selectedSocialFilter === 'fans') return post.authorType === 'fan';
      return true;
    });
  }, [socialPosts, selectedSocialFilter]);

  const getThematicTag = (item: NewsItem) => {
    if (item.importance >= 5) {
      return {
        label: 'EN VIVO',
        style: 'bg-rose-100 text-rose-900 border-rose-300 font-bold animate-pulse'
      };
    }

    switch (item.category) {
      case 'industry':
        return { label: 'INDUSTRIA', style: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'chart':
        return { label: 'CHARTS', style: 'bg-amber-100 text-amber-950 border-amber-300' };
      case 'culture':
        return { label: 'CULTURA', style: 'bg-purple-100 text-purple-900 border-purple-300' };
      case 'award':
        return { label: 'PREMIOS', style: 'bg-yellow-100 text-yellow-950 border-yellow-300' };
      case 'release':
        return { label: 'LANZAMIENTOS', style: 'bg-teal-100 text-teal-900 border-teal-300' };
      case 'rivalry':
      case 'scandal':
        return { label: 'POLÉMICA', style: 'bg-rose-100 text-rose-900 border-rose-300' };
      case 'trend':
        return { label: 'TENDENCIAS', style: 'bg-cyan-100 text-cyan-900 border-cyan-300' };
      case 'tour':
        return { label: 'GIRAS', style: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      default:
        return { label: 'EN VIVO', style: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    }
  };

  const getSocialSentimentBadge = (sentiment: SocialPost['sentiment']) => {
    switch (sentiment) {
      case 'hype':
        return { label: '🔥 Hype', class: 'bg-orange-100 text-orange-900 border-orange-200' };
      case 'positive':
        return { label: '💖 Fan Love', class: 'bg-pink-100 text-pink-900 border-pink-200' };
      case 'meme':
        return { label: '😂 Viral', class: 'bg-emerald-100 text-emerald-900 border-emerald-200' };
      case 'polarizing':
        return { label: '💬 Debate', class: 'bg-purple-100 text-purple-900 border-purple-200' };
      case 'negative':
        return { label: '💀 Crítica', class: 'bg-rose-100 text-rose-900 border-rose-200' };
        return { label: '💀 Crítica', class: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
      default:
        return { label: '✨ Social', class: 'bg-slate-700/50 text-slate-300 border-slate-600' };
    }
  };

  const activeTrends = (Object.values(world.trends || {}) as MusicTrend[]).filter(
    (t) => t.stage !== 'exhausted'
  );

  return (
    <aside
      className={`bg-[#16181F] border border-[#2A2E3D] rounded-[16px] p-5 space-y-4 shadow-lg sticky top-20 flex flex-col justify-between text-[#F8FAFC] ${className}`}
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Top Header: Dual Tabs Selector ([Prensa & Industria] vs [Feed de Redes Sociales]) */}
      <div className="space-y-3 border-b border-[#2A2E3D] pb-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-[6px] bg-[#0B0C10] border border-[#2A2E3D] text-white">
              {activeTab === 'press' ? (
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              )}
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#F8FAFC] uppercase tracking-wider">
                {activeTab === 'press' ? 'Prensa & Noticias' : 'Feed de Redes'}
              </h3>
              <span className="text-[10px] text-[#94A3B8]">
                {activeTab === 'press' ? 'Cobertura oficial de la industria' : 'Comunidad y tendencias en vivo'}
              </span>
            </div>
          </div>

          <span className="text-[10px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-[9999px] font-bold flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            EN VIVO
          </span>
        </div>

        {/* Dual Tab Buttons */}
        <div className="flex items-center bg-[#0B0C10] p-1 rounded-[8px] gap-1 text-xs border border-[#2A2E3D]">
          <button
            onClick={() => setActiveTab('press')}
            className={`flex-1 py-1.5 px-3 rounded-[6px] font-bold text-center transition-all cursor-pointer ${
              activeTab === 'press'
                ? 'bg-[#8B5CF6] text-white shadow-xs'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Prensa & Industria
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-1.5 px-3 rounded-[6px] font-bold text-center transition-all cursor-pointer ${
              activeTab === 'social'
                ? 'bg-[#8B5CF6] text-white shadow-xs'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Feed de Redes Sociales
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PRENSA & INDUSTRIA */}
      {/* ========================================================================= */}
      {activeTab === 'press' && (
        <div className="space-y-3 flex-1 flex flex-col justify-between">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'industry', label: 'Industria' },
              { id: 'charts', label: 'Charts' },
              { id: 'releases', label: 'Lanzamientos' },
              { id: 'culture', label: 'Cultura' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedNewsCategory(f.id)}
                className={`px-2.5 py-1 rounded-[6px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedNewsCategory === f.id
                    ? 'bg-[#8B5CF6] text-white shadow-xs font-semibold'
                    : 'bg-[#0B0C10] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#2A2E3D]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Scrollable Live News Items Feed */}
          <div className={`space-y-2.5 ${maxHeight} overflow-y-auto pr-1 flex-1`}>
            {filteredNews.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#94A3B8] bg-[#0B0C10] border border-dashed border-[#2A2E3D] rounded-[12px]">
                No hay noticias registradas en esta categoría.
              </div>
            ) : (
              filteredNews.map((news) => {
                const tag = getThematicTag(news);
                const isPlayerMentioned = player
                  ? news.relatedArtistIds?.includes(player.id) || news.headline.includes(player.name)
                  : false;

                return (
                  <article
                    key={news.id}
                    className={`p-3.5 rounded-[12px] bg-[#0B0C10] border transition-all text-xs space-y-1.5 shadow-xs group cursor-default ${
                      isPlayerMentioned
                        ? 'border-[#F59E0B]/60 bg-[#F59E0B]/10 hover:border-[#F59E0B]'
                        : 'border-[#2A2E3D] hover:border-[#8B5CF6]/50'
                    }`}
                  >
                    {/* Meta Top: Thematic Badge + Player mention + Cycle Date */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[4px] border ${tag.style}`}
                        >
                          {tag.label}
                        </span>

                        {isPlayerMentioned && (
                          <span className="text-[9px] bg-[#F59E0B]/20 text-[#FBBF24] font-bold px-1.5 py-0.5 rounded-[3px] border border-[#F59E0B]/40">
                            Tú
                          </span>
                        )}
                      </div>

                      <span 
                        className="text-[10px] text-[#94A3B8] font-mono whitespace-nowrap bg-[#16181F] border border-[#2A2E3D] px-1.5 py-0.5 rounded-[4px]"
                        title={TimeSystem.getCalendarLabel(news.month, news.year)}
                      >
                        Año {news.year} • {TimeSystem.getMonthName(news.month)} (M{news.month})
                      </span>
                    </div>

                    {/* Bold Headline */}
                    <h4 className="font-bold text-[#F8FAFC] leading-snug text-xs group-hover:text-white line-clamp-2">
                      {news.headline}
                    </h4>

                    {/* Short Synopsis */}
                    <p className="text-[#94A3B8] text-[11px] line-clamp-2 leading-relaxed font-normal">
                      {news.body}
                    </p>
                  </article>
                );
              })
            )}
          </div>

          {/* Industry Pulse Summary Footer */}
          <div className="p-3.5 rounded-[12px] bg-[#0B0C10] border border-[#2A2E3D] space-y-2 mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#F8FAFC] flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-[#06B6D4]" />
                Pulso de la Escena
              </span>
              <span className="text-[10px] font-mono text-[#94A3B8] bg-[#16181F] px-1.5 py-0.5 rounded-[4px] border border-[#2A2E3D]">
                {monthName} {world.currentYear}
              </span>
            </div>

            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              {activeTrends.length > 0
                ? `Tendencia activa: "${activeTrends[0].name}". El mercado evoluciona con cada avance.`
                : 'La escena musical se actualiza automáticamente con cada semestre, galas de premios y lanzamientos.'}
            </p>

            {onNavigate && (
              <button
                onClick={() => onNavigate('industry')}
                className="w-full text-center text-xs font-semibold text-[#06B6D4] hover:text-[#38BDF8] flex items-center justify-center gap-1 pt-1 cursor-pointer"
              >
                <span>Explorar Industria & Sellos</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FEED DE REDES SOCIALES */}
      {/* ========================================================================= */}
      {activeTab === 'social' && (
        <div className="space-y-3 flex-1 flex flex-col justify-between">
          {/* Social Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            {[
              { id: 'all', label: 'Todo' },
              { id: 'hype', label: '🔥 Hype' },
              { id: 'fans', label: '💖 Fans' },
              { id: 'critics', label: '✍️ Prensa' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedSocialFilter(f.id)}
                className={`px-2.5 py-1 rounded-[6px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedSocialFilter === f.id
                    ? 'bg-[#8B5CF6] text-white shadow-xs font-semibold'
                    : 'bg-[#0B0C10] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#2A2E3D]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Scrollable Social Feed */}
          <div className={`space-y-3 ${maxHeight} overflow-y-auto pr-1 flex-1`}>
            {filteredSocialPosts.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#94A3B8] bg-[#0B0C10] border border-dashed border-[#2A2E3D] rounded-[12px]">
                No hay publicaciones sociales recientes.
              </div>
            ) : (
              filteredSocialPosts.map((post) => {
                const sentimentBadge = getSocialSentimentBadge(post.sentiment);

                return (
                  <article
                    key={post.id}
                    className="p-3.5 rounded-[12px] bg-[#0B0C10] border border-[#2A2E3D] hover:border-[#8B5CF6]/50 transition-all text-xs space-y-2 shadow-xs group"
                  >
                    {/* Top Row: Author info + Verified + Sentiment */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Avatar */}
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs border border-[#2A2E3D]">
                          {post.authorName.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-[#F8FAFC] text-xs truncate">
                              {post.authorName}
                            </span>
                            {post.authorVerified && (
                              <CheckCircle className="w-3 h-3 text-[#06B6D4] shrink-0 fill-current" />
                            )}
                          </div>
                          <span className="text-[10px] text-[#94A3B8] flex items-center gap-0.5">
                            <AtSign className="w-2.5 h-2.5" />
                            {post.authorHandle}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-[4px] border shrink-0 ${sentimentBadge.class}`}
                      >
                        {sentimentBadge.label}
                      </span>
                    </div>

                    {/* Post Content */}
                    <p className="text-[#CBD5E1] text-[11px] leading-relaxed">
                      {post.content}
                    </p>
                  </article>
                );
              })
            )}
          </div>

          {/* Social Trends Summary Footer */}
          <div className="p-3 rounded-[12px] bg-[#0B0C10] border border-[#2A2E3D] text-xs text-[#94A3B8] flex items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-1.5 font-semibold text-[#F8FAFC] text-[11px]">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Tendencia #1: #{player?.name.replace(/\s+/g, '') || 'ElArtista'}</span>
            </div>
            <span className="text-[10px] bg-[#16181F] text-[#94A3B8] px-1.5 py-0.5 rounded-[4px] border border-[#2A2E3D] font-mono">
              +14.2k posts
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};

