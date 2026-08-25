import React, { useState, useMemo } from 'react';
import { WorldState, Artist, NewsItem, SocialPost } from '../types';
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
      default:
        return { label: '✨ Social', class: 'bg-zinc-100 text-zinc-900 border-zinc-200' };
    }
  };

  const activeTrends = Object.values(world.trends || {}).filter(
    (t) => t.stage !== 'exhausted'
  );

  return (
    <aside
      className={`bg-[#f7f4ed] border border-[#eceae4] rounded-[16px] p-5 space-y-4 shadow-sm sticky top-20 flex flex-col justify-between ${className}`}
      style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Top Header: Dual Tabs Selector ([Prensa & Industria] vs [Feed de Redes Sociales]) */}
      <div className="space-y-3 border-b border-[#eceae4] pb-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-[6px] bg-[#1c1c1c] text-[#fcfbf8]">
              {activeTab === 'press' ? (
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              )}
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#1c1c1c] uppercase tracking-wider">
                {activeTab === 'press' ? 'Prensa & Noticias' : 'Feed de Redes'}
              </h3>
              <span className="text-[10px] text-[#5f5f5d]">
                {activeTab === 'press' ? 'Cobertura oficial de la industria' : 'Comunidad y tendencias en vivo'}
              </span>
            </div>
          </div>

          <span className="text-[10px] text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-[9999px] font-bold flex items-center gap-1 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
            EN VIVO
          </span>
        </div>

        {/* Dual Tab Buttons */}
        <div className="flex items-center bg-[#eceae4] p-1 rounded-[8px] gap-1 text-xs">
          <button
            onClick={() => setActiveTab('press')}
            className={`flex-1 py-1.5 px-3 rounded-[6px] font-semibold text-center transition-all cursor-pointer ${
              activeTab === 'press'
                ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-xs'
                : 'text-[#5f5f5d] hover:text-[#1c1c1c]'
            }`}
            style={
              activeTab === 'press'
                ? {
                    boxShadow:
                      'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px'
                  }
                : {}
            }
          >
            Prensa & Industria
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-1.5 px-3 rounded-[6px] font-semibold text-center transition-all cursor-pointer ${
              activeTab === 'social'
                ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-xs'
                : 'text-[#5f5f5d] hover:text-[#1c1c1c]'
            }`}
            style={
              activeTab === 'social'
                ? {
                    boxShadow:
                      'rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px'
                  }
                : {}
            }
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
                    ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-2xs font-semibold'
                    : 'bg-[#fcfbf8] text-[#5f5f5d] hover:text-[#1c1c1c] hover:bg-[#eceae4] border border-[#eceae4]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Scrollable Live News Items Feed */}
          <div className={`space-y-2.5 ${maxHeight} overflow-y-auto pr-1 flex-1`}>
            {filteredNews.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#5f5f5d] bg-[#fcfbf8] border border-dashed border-[#eceae4] rounded-[12px]">
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
                    className={`p-3.5 rounded-[12px] bg-[#fcfbf8] border transition-all text-xs space-y-1.5 shadow-2xs group cursor-default ${
                      isPlayerMentioned
                        ? 'border-amber-300 bg-amber-50/40 hover:border-amber-400'
                        : 'border-[#eceae4] hover:border-[rgba(28,28,28,0.4)]'
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
                          <span className="text-[9px] bg-amber-200 text-amber-950 font-bold px-1.5 py-0.5 rounded-[3px] border border-amber-300">
                            Tú
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-[#5f5f5d] font-mono whitespace-nowrap bg-[#eceae4] px-1.5 py-0.5 rounded-[4px]">
                        Año {news.year} • M{news.month}
                      </span>
                    </div>

                    {/* Bold Headline */}
                    <h4 className="font-bold text-[#1c1c1c] leading-snug text-xs group-hover:text-black line-clamp-2">
                      {news.headline}
                    </h4>

                    {/* Short Synopsis */}
                    <p className="text-[#5f5f5d] text-[11px] line-clamp-2 leading-relaxed font-normal">
                      {news.body}
                    </p>
                  </article>
                );
              })
            )}
          </div>

          {/* Industry Pulse Summary Footer */}
          <div className="p-3.5 rounded-[12px] bg-[#eceae4]/70 border border-[#eceae4] space-y-2 mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1c1c1c] flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-[#1c1c1c]" />
                Pulso de la Escena
              </span>
              <span className="text-[10px] font-mono text-[#5f5f5d] bg-[#fcfbf8] px-1.5 py-0.5 rounded-[4px] border border-[#eceae4]">
                {monthName} {world.currentYear}
              </span>
            </div>

            <p className="text-[11px] text-[#5f5f5d] leading-relaxed">
              {activeTrends.length > 0
                ? `Tendencia activa: "${activeTrends[0].name}". El mercado evoluciona con cada avance.`
                : 'La escena musical se actualiza automáticamente con cada semestre, galas de premios y lanzamientos.'}
            </p>

            {onNavigate && (
              <button
                onClick={() => onNavigate('industry')}
                className="w-full text-center text-xs font-semibold text-[#1c1c1c] hover:underline flex items-center justify-center gap-1 pt-1 cursor-pointer"
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
                    ? 'bg-[#1c1c1c] text-[#fcfbf8] shadow-2xs font-semibold'
                    : 'bg-[#fcfbf8] text-[#5f5f5d] hover:text-[#1c1c1c] hover:bg-[#eceae4] border border-[#eceae4]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Scrollable Social Feed */}
          <div className={`space-y-3 ${maxHeight} overflow-y-auto pr-1 flex-1`}>
            {filteredSocialPosts.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#5f5f5d] bg-[#fcfbf8] border border-dashed border-[#eceae4] rounded-[12px]">
                No hay publicaciones sociales recientes.
              </div>
            ) : (
              filteredSocialPosts.map((post) => {
                const sentimentBadge = getSocialSentimentBadge(post.sentiment);

                return (
                  <article
                    key={post.id}
                    className="p-3.5 rounded-[12px] bg-[#fcfbf8] border border-[#eceae4] hover:border-[rgba(28,28,28,0.4)] transition-all text-xs space-y-2 shadow-2xs group"
                  >
                    {/* Top Row: Author info + Verified + Sentiment */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Avatar */}
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-2xs border border-[#eceae4]">
                          {post.authorName.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-[#1c1c1c] text-xs truncate">
                              {post.authorName}
                            </span>
                            {post.authorVerified && (
                              <CheckCircle className="w-3 h-3 text-blue-500 shrink-0 fill-current" />
                            )}
                          </div>
                          <span className="text-[10px] text-[#5f5f5d] flex items-center gap-0.5">
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
                    <p className="text-xs text-[#1c1c1c] leading-relaxed font-normal">
                      {post.content}
                    </p>

                    {/* Engagement Metrics Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#eceae4]/70 text-[11px] text-[#5f5f5d]">
                      <div className="flex items-center gap-3.5">
                        <span className="flex items-center gap-1 hover:text-rose-600 cursor-pointer transition-colors">
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                          <span className="font-mono text-[10px]">{post.likes.toLocaleString()}</span>
                        </span>

                        <span className="flex items-center gap-1 hover:text-emerald-600 cursor-pointer transition-colors">
                          <Repeat className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-mono text-[10px]">{post.retweetsOrShares.toLocaleString()}</span>
                        </span>

                        <span className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer transition-colors">
                          <MessageCircle className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="font-mono text-[10px]">{post.commentsCount.toLocaleString()}</span>
                        </span>
                      </div>

                      <span className="text-[9px] font-mono text-[#5f5f5d]">
                        {monthName.slice(0, 3)} {post.year}
                      </span>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* Social Trends Summary Footer */}
          <div className="p-3 rounded-[12px] bg-[#eceae4]/70 border border-[#eceae4] text-xs text-[#5f5f5d] flex items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-1.5 font-semibold text-[#1c1c1c] text-[11px]">
              <Flame className="w-3.5 h-3.5 text-orange-600" />
              <span>Tendencia #1: #{player?.name.replace(/\s+/g, '') || 'ElArtista'}</span>
            </div>
            <span className="text-[10px] bg-[#fcfbf8] px-1.5 py-0.5 rounded-[4px] border border-[#eceae4] font-mono">
              +14.2k posts
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};

