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
    const playerListeners = player?.stats?.monthlyListeners || 0;
    const playerStage = player?.careerStage || 'Underground';

    // 1. Post about player's momentum or recent activity
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
        content: `${playerName} continúa consolidando su etapa como ${playerStage} con más de ${(playerListeners || 0).toLocaleString('es-AR')} oyentes activos. ¿Se viene la era definitiva? 👀 #ElArtista #Musica`,
        year: curYear,
        month: curMonth,
        likes: Math.max(120, Math.floor(playerListeners * 0.08)),
        retweetsOrShares: Math.max(45, Math.floor(playerListeners * 0.02)),
        commentsCount: Math.max(18, Math.floor(playerListeners * 0.01)),
        sentiment: 'hype'
      });

      posts.push({
        id: `post_p_${curYear}_${curMonth}_2`,
        platform: 'tiktok',
        authorName: 'Mica • Fan Club',
        authorHandle: 'mica_musicvibes',
        authorVerified: false,
        authorType: 'fan',
        content: `No supero el flow y la dirección sonora de ${playerName} este año. La evolución de las barras y la producción está a otro nivel 💖🔥 #Favorito #Hits #Viral`,
        year: curYear,
        month: curMonth,
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
        style: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30 font-bold'
      };
    }

    switch (item.category) {
      case 'industry':
        return { label: 'INDUSTRIA', style: 'bg-[#18181C] text-[#8E8E99] border-[#242429]' };
      case 'chart':
        return { label: 'CHARTS', style: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30' };
      case 'culture':
        return { label: 'CULTURA', style: 'bg-[#18181C] text-[#F4F4F6] border-[#242429]' };
      case 'award':
        return { label: 'PREMIOS', style: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30' };
      case 'release':
        return { label: 'LANZAMIENTOS', style: 'bg-[#FF4F00]/15 text-[#FF4F00] border-[#FF4F00]/30' };
      case 'rivalry':
      case 'scandal':
        return { label: 'POLÉMICA', style: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30' };
      case 'trend':
        return { label: 'TENDENCIAS', style: 'bg-[#00E599]/15 text-[#00E599] border-[#00E599]/30' };
      case 'tour':
        return { label: 'GIRAS', style: 'bg-[#00E599]/15 text-[#00E599] border-[#00E599]/30' };
      default:
        return { label: 'EN VIVO', style: 'bg-[#00E599]/15 text-[#00E599] border-[#00E599]/30' };
    }
  };

  const getSocialSentimentBadge = (sentiment: SocialPost['sentiment']) => {
    switch (sentiment) {
      case 'hype':
        return { label: 'Hype', class: 'bg-[#FF4F00]/15 text-[#FF4F00] border-[#FF4F00]/30' };
      case 'positive':
        return { label: 'Fan Love', class: 'bg-[#00E599]/15 text-[#00E599] border-[#00E599]/30' };
      case 'meme':
        return { label: 'Viral', class: 'bg-[#00E599]/15 text-[#00E599] border-[#00E599]/30' };
      case 'polarizing':
        return { label: 'Debate', class: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30' };
      case 'negative':
        return { label: 'Crítica', class: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30' };
      default:
        return { label: 'Social', class: 'bg-[#18181C] text-[#8E8E99] border-[#242429]' };
    }
  };

  const activeTrends = (Object.values(world.trends || {}) as MusicTrend[]).filter(
    (t) => t.stage !== 'exhausted'
  );

  return (
    <aside
      className={`bg-[#111114] border border-[#242429] rounded-[6px] p-5 space-y-4 shadow-xs sticky top-20 flex flex-col justify-between text-[#F4F4F6] ${className}`}
    >
      {/* Top Header: Dual Tabs Selector ([Prensa & Industria] vs [Feed de Redes Sociales]) */}
      <div className="space-y-3 border-b border-[#242429] pb-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-[4px] bg-[#18181C] border border-[#242429] text-white">
              {activeTab === 'press' ? (
                <Radio className="w-3.5 h-3.5 text-[#00E599]" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-[#FF4F00]" />
              )}
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#F4F4F6] uppercase tracking-wider font-sans">
                {activeTab === 'press' ? 'Prensa & Noticias' : 'Feed de Redes'}
              </h3>
              <span className="text-[10px] text-[#8E8E99]">
                {activeTab === 'press' ? 'Cobertura oficial de la industria' : 'Comunidad y tendencias en vivo'}
              </span>
            </div>
          </div>

          <span className="text-[10px] text-[#00E599] bg-[#00E599]/10 border border-[#00E599]/30 px-2 py-0.5 rounded-[4px] font-sans font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-[1px] bg-[#00E599]" />
            EN VIVO
          </span>
        </div>

        {/* Dual Tab Buttons */}
        <div className="flex items-center bg-[#09090B] p-1 rounded-[4px] gap-1 text-xs border border-[#242429]">
          <button
            onClick={() => setActiveTab('press')}
            className={`flex-1 py-1.5 px-3 rounded-[4px] font-sans font-bold text-center transition-all cursor-pointer ${
              activeTab === 'press'
                ? 'bg-[#FF4F00] text-white'
                : 'text-[#8E8E99] hover:text-[#F4F4F6] hover:bg-[#18181C]'
            }`}
          >
            Prensa & Industria
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-1.5 px-3 rounded-[4px] font-sans font-bold text-center transition-all cursor-pointer ${
              activeTab === 'social'
                ? 'bg-[#FF4F00] text-white'
                : 'text-[#8E8E99] hover:text-[#F4F4F6] hover:bg-[#18181C]'
            }`}
          >
            Feed de Redes
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PRENSA & INDUSTRIA */}
      {/* ========================================================================= */}
      {activeTab === 'press' && (
        <div className="space-y-3 flex-1 flex flex-col justify-between">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto scroll-fade-x pb-1 text-xs">
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
                className={`min-h-8 shrink-0 px-2.5 py-1 rounded-[4px] font-sans text-xs transition-all cursor-pointer ${
                  selectedNewsCategory === f.id
                    ? 'bg-[#FF4F00] text-white font-bold'
                    : 'bg-[#09090B] text-[#8E8E99] hover:text-[#F4F4F6] border border-[#242429]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Scrollable Live News Items Feed */}
          <div className={`space-y-2.5 ${maxHeight} overflow-y-auto pr-1 flex-1`}>
            {filteredNews.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#8E8E99] bg-[#09090B] border border-dashed border-[#242429] rounded-[4px] font-sans">
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
                    className={`p-3.5 rounded-[4px] bg-[#09090B] border transition-all text-xs space-y-1.5 shadow-xs group cursor-default ${
                      isPlayerMentioned
                        ? 'border-l-4 border-l-[#FF4F00] border-[#242429] bg-[#FF4F00]/5'
                        : 'border-[#242429] hover:border-[#3F3F46]'
                    }`}
                  >
                    {/* Meta Top: Thematic Badge + Player mention + Cycle Date */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] border ${tag.style}`}
                        >
                          {tag.label}
                        </span>

                        {isPlayerMentioned && (
                          <span className="text-[10px] font-sans font-bold bg-[#FF4F00]/20 text-[#FF4F00] px-1.5 py-0.5 rounded-[4px] border border-[#FF4F00]/40">
                            Tú
                          </span>
                        )}
                      </div>

                      <span 
                        className="text-[10px] text-[#8E8E99] font-sans tabular-nums whitespace-nowrap bg-[#18181C] border border-[#242429] px-1.5 py-0.5 rounded-[4px]"
                        title={TimeSystem.getCalendarLabel(news.month, news.year)}
                      >
                        Año {news.year} • {TimeSystem.getMonthName(news.month)}
                      </span>
                    </div>

                    {/* Bold Headline */}
                    <h4 className="font-bold text-[#F4F4F6] leading-snug text-xs group-hover:text-white line-clamp-2">
                      {news.headline}
                    </h4>

                    {/* Short Synopsis */}
                    <p className="text-[#8E8E99] text-xs line-clamp-2 leading-relaxed font-normal">
                      {news.body}
                    </p>
                  </article>
                );
              })
            )}
          </div>

          {/* Industry Pulse Summary Footer */}
          <div className="p-3.5 rounded-[4px] bg-[#09090B] border border-[#242429] space-y-2 mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#F4F4F6] flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-[#FF4F00]" />
                Pulso de la Escena
              </span>
              <span className="text-[10px] font-sans tabular-nums text-[#8E8E99] bg-[#18181C] px-1.5 py-0.5 rounded-[4px] border border-[#242429]">
                {monthName} {world.currentYear}
              </span>
            </div>

            <p className="text-xs text-[#8E8E99] leading-relaxed">
              {activeTrends.length > 0
                ? `Tendencia activa: "${activeTrends[0].name}". El mercado evoluciona con cada avance.`
                : 'La escena musical se actualiza automáticamente con cada semestre, galas de premios y lanzamientos.'}
            </p>

            {onNavigate && (
              <button
                onClick={() => onNavigate('industry')}
                className="w-full text-center text-xs font-sans font-semibold text-[#FF4F00] hover:text-[#E04500] flex items-center justify-center gap-1 pt-1 cursor-pointer"
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
          <div className="flex items-center gap-1 overflow-x-auto scroll-fade-x pb-1 text-xs">
            {[
              { id: 'all', label: 'Todo' },
              { id: 'hype', label: 'Hype' },
              { id: 'fans', label: 'Fans' },
              { id: 'critics', label: 'Prensa' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedSocialFilter(f.id)}
                className={`min-h-8 shrink-0 px-2.5 py-1 rounded-[4px] font-sans text-xs transition-all cursor-pointer ${
                  selectedSocialFilter === f.id
                    ? 'bg-[#FF4F00] text-white font-bold'
                    : 'bg-[#09090B] text-[#8E8E99] hover:text-[#F4F4F6] border border-[#242429]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Scrollable Social Feed */}
          <div className={`space-y-3 ${maxHeight} overflow-y-auto pr-1 flex-1`}>
            {filteredSocialPosts.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#8E8E99] bg-[#09090B] border border-dashed border-[#242429] rounded-[4px] font-sans">
                No hay publicaciones sociales recientes.
              </div>
            ) : (
              filteredSocialPosts.map((post) => {
                const sentimentBadge = getSocialSentimentBadge(post.sentiment);

                return (
                  <article
                    key={post.id}
                    className="p-3.5 rounded-[4px] bg-[#09090B] border border-[#242429] hover:border-[#3F3F46] transition-all text-xs space-y-2 shadow-xs group"
                  >
                    {/* Top Row: Author info + Verified + Sentiment */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Avatar */}
                        <div className="w-7 h-7 rounded-[4px] bg-[#18181C] text-[#8E8E99] font-sans font-bold text-xs flex items-center justify-center shrink-0 border border-[#242429]">
                          {post.authorName.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-[#F4F4F6] text-xs truncate">
                              {post.authorName}
                            </span>
                            {post.authorVerified && (
                              <CheckCircle className="w-3 h-3 text-[#00E599] shrink-0 fill-current" />
                            )}
                          </div>
                          <span className="text-[10px] text-[#8E8E99] font-sans flex items-center gap-0.5">
                            <AtSign className="w-2.5 h-2.5" />
                            {post.authorHandle}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-[4px] border shrink-0 ${sentimentBadge.class}`}
                      >
                        {sentimentBadge.label}
                      </span>
                    </div>

                    {/* Post Content */}
                    <p className="text-[#D4D4D8] text-xs leading-relaxed">
                      {post.content}
                    </p>
                  </article>
                );
              })
            )}
          </div>

          {/* Social Trends Summary Footer */}
          <div className="p-3 rounded-[4px] bg-[#09090B] border border-[#242429] text-xs text-[#8E8E99] flex items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-1.5 font-semibold text-[#F4F4F6] text-xs">
              <Flame className="w-3.5 h-3.5 text-[#FF4F00]" />
              <span>Tendencia #1: #{(player?.name || 'ElArtista').replace(/\s+/g, '')}</span>
            </div>
            <span className="text-[10px] bg-[#18181C] text-[#8E8E99] px-1.5 py-0.5 rounded-[4px] border border-[#242429] font-sans tabular-nums">
              +14.2k posts
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};

