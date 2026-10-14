import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  TrendingUp,
  CreditCard,
  Battery,
  Wifi,
  Sparkles,
  CheckCheck,
  Send,
  Flame,
  Users,
  DollarSign,
  Heart,
  AlertTriangle,
  Radio,
  ExternalLink
} from 'lucide-react';
import { Artist, WorldState, ArtistPhoneMessage } from '../types';
import { formatMoney, formatFans } from '../utils/formatters';
import { playSound } from '../utils/audioSystem';

interface ArtistPhoneModalProps {
  player: Artist;
  world: WorldState;
  isOpen: boolean;
  onClose: () => void;
  onReplyMessage: (messageId: string, choiceIndex: number) => void;
  onMarkAllAsRead: () => void;
}

export const ArtistPhoneModal: React.FC<ArtistPhoneModalProps> = ({
  player,
  world,
  isOpen,
  onClose,
  onReplyMessage,
  onMarkAllAsRead
}) => {
  const [activeApp, setActiveApp] = useState<'messages' | 'feed' | 'wallet'>('messages');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [feedbackEffect, setFeedbackEffect] = useState<string | null>(null);

  if (!isOpen) return null;

  const messages: ArtistPhoneMessage[] = world?.phoneMessages || player?.phoneMessages || [];
  const unreadCount = world?.unreadPhoneCount || 0;

  // Selected message for thread view
  const activeMessage = messages.find((m) => m.id === selectedMessageId) || messages[0] || null;

  const handleSelectMessage = (msg: ArtistPhoneMessage) => {
    setSelectedMessageId(msg.id);
    playSound('click');
  };

  const handleReply = (messageId: string, choiceIndex: number) => {
    playSound('money');
    onReplyMessage(messageId, choiceIndex);

    const msg = messages.find((m) => m.id === messageId);
    const choice = msg?.choices?.[choiceIndex];
    if (choice) {
      const summary: string[] = [];
      if (choice.effects.fundsDelta) summary.push(formatMoney(choice.effects.fundsDelta));
      if (choice.effects.hypeDelta) summary.push(`${choice.effects.hypeDelta > 0 ? '+' : ''}${choice.effects.hypeDelta} Hype`);
      if (choice.effects.fansDelta) summary.push(`${choice.effects.fansDelta > 0 ? '+' : ''}${choice.effects.fansDelta.toLocaleString('es-AR')} Fans`);
      if (choice.effects.energyDelta) summary.push(`${choice.effects.energyDelta > 0 ? '+' : ''}${choice.effects.energyDelta}% Energía`);
      setFeedbackEffect(summary.join(' • ') || '¡Respuesta enviada!');
      setTimeout(() => setFeedbackEffect(null), 3000);
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'manager':
        return { label: 'Mánager / Negocios', bg: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-400' };
      case 'artist':
        return { label: 'Colega / Artista', bg: 'bg-purple-950/70 border-purple-500/40 text-purple-300' };
      case 'press':
        return { label: 'Prensa / Medios', bg: 'bg-blue-950/70 border-blue-500/40 text-blue-300' };
      case 'drama':
        return { label: 'Rival / Polémica', bg: 'bg-rose-950/70 border-rose-500/40 text-rose-300' };
      default:
        return { label: 'Círculo Íntimo', bg: 'bg-amber-950/70 border-amber-500/40 text-amber-300' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      {/* Smartphone Chassis Container */}
      <div
        className="w-full max-w-[420px] h-[780px] max-h-[92vh] bg-[#0E1017] border-4 border-[#2A2E3D] rounded-[48px] shadow-[0_0_60px_rgba(139,92,246,0.3)] flex flex-col overflow-hidden relative text-fg select-none"
        style={{ fontFamily: "'Camera Plain Variable', ui-sans-serif, system-ui, sans-serif" }}
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 mr-auto" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>

        {/* Top Status Bar */}
        <div className="h-10 px-6 pt-2 flex items-center justify-between text-2xs font-bold text-fg-muted shrink-0 z-20">
          <span>{world?.currentMonth ? `${world.currentMonth}:00` : '12:00'}</span>
          <div className="flex items-center gap-2">
            <span className="text-3xs font-mono bg-white/10 px-1 rounded text-white">5G</span>
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Floating Effect Toast */}
        {feedbackEffect && (
          <div className="absolute top-12 left-4 right-4 z-40 bg-gradient-to-r from-primary to-accent text-white px-3 py-2 rounded-xl text-xs font-bold text-center shadow-lg border border-white/20 animate-bounce">
            {feedbackEffect}
          </div>
        )}

        {/* Main Screen Content Area */}
        <div className="flex-1 overflow-y-auto flex flex-col px-3.5 pb-2">
          {/* Header Title with Close & Mark Read */}
          <div className="flex items-center justify-between py-2 border-b border-line mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-fg tracking-tight">iArtist OS</span>
              {unreadCount > 0 && (
                <span className="bg-primary text-white text-3xs font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                  {unreadCount} nuevo{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={() => {
                    playSound('click');
                    onMarkAllAsRead();
                  }}
                  className="text-3xs font-medium text-fg-muted hover:text-fg px-2 py-1 rounded bg-surface border border-line cursor-pointer"
                  title="Marcar todos como leídos"
                >
                  Leídos
                </button>
              )}
              <button
                onClick={() => {
                  playSound('click');
                  onClose();
                }}
                className="w-7 h-7 rounded-full bg-surface hover:bg-line border border-line flex items-center justify-center text-fg-muted hover:text-fg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TAB 1: WHATSAPP / DMS */}
          {activeApp === 'messages' && (
            <div className="flex-1 flex flex-col min-h-0">
              {messages.length === 0 ? (
                <div className="my-auto text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-surface border border-line mx-auto flex items-center justify-center text-fg-muted">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-fg">Bandeja de Entrada Vacía</h4>
                  <p className="text-xs text-fg-muted">
                    Avanza el mes para recibir propuestas de sellos, beats de productores o mensajes de rivales.
                  </p>
                </div>
              ) : selectedMessageId && activeMessage ? (
                /* Thread View */
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Back to list button & Sender info */}
                  <div className="flex items-center justify-between bg-surface border border-line rounded-xl p-2.5 mb-2 shrink-0">
                    <button
                      onClick={() => setSelectedMessageId(null)}
                      className="text-xs font-semibold text-primary-soft hover:underline cursor-pointer flex items-center gap-1"
                    >
                      ← Volver
                    </button>
                    <div className="text-right">
                      <span className="text-xs font-bold text-fg block">{activeMessage.senderName}</span>
                      <span className={`text-3xs px-1.5 py-0.5 rounded border ${getCategoryBadge(activeMessage.category).bg}`}>
                        {getCategoryBadge(activeMessage.category).label}
                      </span>
                    </div>
                  </div>

                  {/* Chat Bubbles Container */}
                  <div className="flex-1 overflow-y-auto space-y-3 p-1">
                    {/* Incoming Message Bubble */}
                    <div className="flex items-start gap-2 max-w-[90%]">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${activeMessage.senderAvatarColor || 'from-violet-500 to-fuchsia-500'} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}>
                        {activeMessage.senderName.slice(0, 1)}
                      </div>
                      <div className="bg-[#1C202F] border border-[#2D3349] p-3 rounded-2xl rounded-tl-sm text-xs text-slate-100 shadow-sm leading-relaxed">
                        <p>{activeMessage.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1.5 text-3xs text-slate-400">
                          <span>Año {activeMessage.sentYear} • Mes {activeMessage.sentMonth}</span>
                          <CheckCheck className="w-3 h-3 text-cyan-400" />
                        </div>
                      </div>
                    </div>

                    {/* If Already Answered: Outgoing Bubble */}
                    {typeof activeMessage.chosenReplyIndex === 'number' && activeMessage.choices?.[activeMessage.chosenReplyIndex] && (
                      <div className="flex items-start justify-end gap-2 max-w-[90%] ml-auto">
                        <div className="bg-primary/25 border border-primary/40 p-3 rounded-2xl rounded-tr-sm text-xs text-white shadow-sm leading-relaxed text-right">
                          <p className="font-semibold text-primary-soft">
                            {activeMessage.choices[activeMessage.chosenReplyIndex].replyText}
                          </p>
                          <div className="flex items-center justify-end gap-1 mt-1 text-3xs text-primary-soft/80">
                            <span>Respuesta Enviada</span>
                            <CheckCheck className="w-3 h-3 text-primary-soft" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reply Choices Section */}
                  {typeof activeMessage.chosenReplyIndex !== 'number' && activeMessage.choices && activeMessage.choices.length > 0 && (
                    <div className="pt-2 border-t border-line space-y-1.5 shrink-0">
                      <span className="text-3xs uppercase font-bold text-fg-muted block px-1">
                        Elige tu respuesta:
                      </span>
                      {activeMessage.choices.map((choice, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleReply(activeMessage.id, idx)}
                          className="w-full text-left bg-surface hover:bg-surface-raised border border-line hover:border-primary/50 p-2.5 rounded-xl transition-all cursor-pointer group active:scale-98 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-fg group-hover:text-primary-soft block">
                              {choice.label}
                            </span>
                            <p className="text-2xs text-fg-muted truncate">
                              "{choice.replyText}"
                            </p>
                          </div>
                          <Send className="w-3.5 h-3.5 text-primary group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Message List View */
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
                  {messages.map((msg) => {
                    const badge = getCategoryBadge(msg.category);
                    return (
                      <button
                        key={msg.id}
                        onClick={() => handleSelectMessage(msg)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                          !msg.isRead
                            ? 'bg-primary/10 border-primary/40 shadow-[0_0_10px_rgba(139,92,246,0.15)]'
                            : 'bg-surface hover:bg-surface-raised border-line'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${msg.senderAvatarColor || 'from-violet-500 to-fuchsia-500'} flex items-center justify-center text-white text-xs font-bold shrink-0 relative`}>
                          {msg.senderName.slice(0, 1)}
                          {!msg.isRead && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-canvas" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-xs font-bold truncate ${!msg.isRead ? 'text-white' : 'text-fg'}`}>
                              {msg.senderName}
                            </span>
                            <span className="text-3xs text-fg-muted font-mono shrink-0">
                              M{msg.sentMonth}
                            </span>
                          </div>
                          <p className="text-2xs text-fg-muted truncate">
                            {msg.text}
                          </p>
                          <span className={`text-3xs px-1 rounded border inline-block mt-1 ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TRENDX (VIRALES & TWITTER) */}
          {activeApp === 'feed' && (
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
              <div className="bg-gradient-to-r from-blue-900/30 to-violet-900/30 border border-blue-500/30 rounded-xl p-3">
                <span className="text-3xs uppercase font-bold text-blue-400 block tracking-wider">
                  Tendencias Globales
                </span>
                <h4 className="text-xs font-bold text-fg mt-0.5">#{player.name.replace(/\s+/g, '')}</h4>
                <p className="text-3xs text-fg-muted">
                  {(player.stats?.monthlyListeners || 50000).toLocaleString('es-AR')} personas hablando de esto en vivo.
                </p>
              </div>

              {/* Feed Items procedural */}
              {[
                {
                  user: '@TrapArgLeaks',
                  handle: 'Trap Leaks Oficial',
                  text: `Dicen que ${player.name} estuvo en el estudio hasta las 5 AM grabando algo histórico... ¿Se viene álbum? 🔥`,
                  likes: '14.2K',
                  retweets: '2.8K'
                },
                {
                  user: '@BillboardArg',
                  handle: 'Billboard Charts',
                  text: `📈 IMPACTO: Los oyentes mensuales de ${player.name} siguen subiendo como cohete tras los últimos lanzamientos.`,
                  likes: '9.5K',
                  retweets: '1.1K'
                },
                {
                  user: '@FanaticosDelArtista',
                  handle: 'Comunidad Fiel',
                  text: `Necesitamos una gira por estadios YA. No podemos esperar más hermano 🏟️✨`,
                  likes: '5.4K',
                  retweets: '980'
                }
              ].map((tweet, idx) => (
                <div key={idx} className="bg-surface border border-line rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-2xs">
                    <span className="font-bold text-fg">{tweet.handle}</span>
                    <span className="text-fg-muted font-mono">{tweet.user}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{tweet.text}</p>
                  <div className="flex items-center gap-4 text-3xs text-fg-muted pt-1 border-t border-line">
                    <span className="flex items-center gap-1 hover:text-rose-400">
                      <Heart className="w-3 h-3 text-rose-500" /> {tweet.likes}
                    </span>
                    <span className="flex items-center gap-1 hover:text-emerald-400">
                      <TrendingUp className="w-3 h-3 text-emerald-400" /> {tweet.retweets}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: WALLET & FINANZAS */}
          {activeApp === 'wallet' && (
            <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
              {/* Virtual Black Card */}
              <div className="w-full h-44 rounded-2xl bg-gradient-to-tr from-slate-950 via-purple-950 to-slate-900 border border-purple-500/40 p-4 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest uppercase text-purple-300">
                    ARTIST BLACK CARD
                  </span>
                  <Sparkles className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <span className="text-3xs uppercase tracking-wider text-slate-400 block">Fondos Disponibles</span>
                  <span className="text-2xl font-bold font-mono tracking-tight text-emerald-400">
                    {formatMoney(player.stats?.funds || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-2xs font-mono text-slate-400">
                  <span>TITULAR: {player.name.toUpperCase()}</span>
                  <span>EXP: 12/32</span>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-surface border border-line p-2.5 rounded-xl">
                  <span className="text-3xs text-fg-muted uppercase block">Comunidad Fiel</span>
                  <span className="font-bold text-primary-soft font-mono">
                    {formatFans(player.stats?.fansCount || 0)}
                  </span>
                </div>
                <div className="bg-surface border border-line p-2.5 rounded-xl">
                  <span className="text-3xs text-fg-muted uppercase block">Nivel de Hype</span>
                  <span className="font-bold text-warning font-mono">
                    {player.stats?.hype || 0}/100 🔥
                  </span>
                </div>
              </div>

              {/* Financial Tip */}
              <div className="bg-surface border border-line p-3 rounded-xl text-xs text-fg-muted space-y-1">
                <span className="font-bold text-fg block">💡 Consejo de Mánager:</span>
                <p>
                  Mantén siempre un colchón de al menos $15.000 para emergencias de giras y producciones de videoclips.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Smartphone Navigation Dock */}
        <div className="h-16 border-t border-line bg-surface/95 backdrop-blur-md px-6 flex items-center justify-around shrink-0 z-20">
          <button
            onClick={() => {
              playSound('click');
              setActiveApp('messages');
            }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeApp === 'messages' ? 'text-primary font-bold' : 'text-fg-muted hover:text-fg'
            }`}
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary ring-2 ring-surface" />
              )}
            </div>
            <span className="text-3xs">DMs</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setActiveApp('feed');
            }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeApp === 'feed' ? 'text-primary font-bold' : 'text-fg-muted hover:text-fg'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-3xs">TrendX</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setActiveApp('wallet');
            }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              activeApp === 'wallet' ? 'text-primary font-bold' : 'text-fg-muted hover:text-fg'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-3xs">Banco</span>
          </button>
        </div>

        {/* Home Indicator Bar */}
        <div className="h-4 bg-[#0E1017] flex items-center justify-center shrink-0">
          <div className="w-28 h-1 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
};
