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
        return { label: 'Mánager / Negocios', bg: 'bg-[#00E599]/10 border-[#00E599]/30 text-[#00E599]' };
      case 'artist':
        return { label: 'Colega / Artista', bg: 'bg-[#18181C] border-[#3F3F46] text-[#F4F4F6]' };
      case 'press':
        return { label: 'Prensa / Medios', bg: 'bg-[#18181C] border-[#FF4F00]/30 text-[#FF4F00]' };
      case 'drama':
        return { label: 'Rival / Polémica', bg: 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]' };
      default:
        return { label: 'Círculo Íntimo', bg: 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      {/* Smartphone Chassis Container */}
      <div
        className="w-full max-w-[420px] h-[780px] max-h-[92vh] bg-[#09090B] border border-[#242429] rounded-[8px] shadow-2xl flex flex-col overflow-hidden relative text-[#F4F4F6] select-none"
      >
        {/* Dynamic Island / Hardware Sensor Bar */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#111114] border border-[#242429] rounded-[4px] z-30 flex items-center justify-center px-2">
          <div className="w-2 h-2 rounded-[2px] bg-[#18181C] border border-[#3F3F46] mr-auto" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse" />
        </div>

        {/* Top Status Bar */}
        <div className="h-10 px-6 pt-2 flex items-center justify-between text-2xs font-mono font-bold text-[#8E8E99] shrink-0 z-20">
          <span>{world?.currentMonth ? `${world.currentMonth}:00` : '12:00'}</span>
          <div className="flex items-center gap-2">
            <span className="text-3xs font-mono bg-[#18181C] border border-[#242429] px-1 rounded-[2px] text-[#F4F4F6]">5G</span>
            <Wifi className="w-3 h-3 text-[#8E8E99]" />
            <Battery className="w-3.5 h-3.5 text-[#00E599]" />
          </div>
        </div>

        {/* Floating Effect Toast */}
        {feedbackEffect && (
          <div className="absolute top-12 left-4 right-4 z-40 bg-[#FF4F00] text-white px-3 py-2 rounded-[4px] text-xs font-mono font-bold text-center shadow-lg border border-[#FF4F00]">
            {feedbackEffect}
          </div>
        )}

        {/* Main Screen Content Area */}
        <div className="flex-1 overflow-y-auto flex flex-col px-3.5 pb-2">
          {/* Header Title with Close & Mark Read */}
          <div className="flex items-center justify-between py-2 border-b border-[#242429] mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono text-[#F4F4F6] tracking-tight">iArtist OS</span>
              {unreadCount > 0 && (
                <span className="bg-[#FF4F00] text-white text-3xs font-mono font-bold px-1.5 py-0.5 rounded-[4px]">
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
                  className="text-3xs font-mono font-medium text-[#8E8E99] hover:text-[#F4F4F6] px-2 py-1 rounded-[4px] bg-[#18181C] border border-[#242429] cursor-pointer"
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
                className="w-7 h-7 rounded-[4px] bg-[#18181C] hover:bg-[#242429] border border-[#242429] flex items-center justify-center text-[#8E8E99] hover:text-[#F4F4F6] cursor-pointer transition-colors"
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
                  <div className="w-12 h-12 rounded-[4px] bg-[#111114] border border-[#242429] mx-auto flex items-center justify-center text-[#8E8E99]">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[#F4F4F6]">Bandeja de Entrada Vacía</h4>
                  <p className="text-xs text-[#8E8E99]">
                    Avanza el mes para recibir propuestas de sellos, beats de productores o mensajes de rivales.
                  </p>
                </div>
              ) : selectedMessageId && activeMessage ? (
                /* Thread View */
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Back to list button & Sender info */}
                  <div className="flex items-center justify-between bg-[#111114] border border-[#242429] rounded-[4px] p-2.5 mb-2 shrink-0">
                    <button
                      onClick={() => setSelectedMessageId(null)}
                      className="text-xs font-mono font-semibold text-[#FF4F00] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      ← Volver
                    </button>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#F4F4F6] block">{activeMessage.senderName}</span>
                      <span className={`text-3xs font-mono px-1.5 py-0.5 rounded-[4px] border ${getCategoryBadge(activeMessage.category).bg}`}>
                        {getCategoryBadge(activeMessage.category).label}
                      </span>
                    </div>
                  </div>

                  {/* Chat Bubbles Container */}
                  <div className="flex-1 overflow-y-auto space-y-3 p-1">
                    {/* Incoming Message Bubble */}
                    <div className="flex items-start gap-2 max-w-[90%]">
                      <div className="w-8 h-8 rounded-[4px] bg-[#18181C] border border-[#242429] flex items-center justify-center text-[#F4F4F6] text-xs font-mono font-bold shrink-0">
                        {activeMessage.senderName.slice(0, 1)}
                      </div>
                      <div className="bg-[#111114] border border-[#242429] p-3 rounded-[4px] text-xs text-[#F4F4F6] leading-relaxed">
                        <p>{activeMessage.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1.5 text-2xs font-mono text-[#8E8E99]">
                          <span>Año {activeMessage.sentYear} • Mes {activeMessage.sentMonth}</span>
                          <CheckCheck className="w-3 h-3 text-[#00E599]" />
                        </div>
                      </div>
                    </div>

                    {/* If Already Answered: Outgoing Bubble */}
                    {typeof activeMessage.chosenReplyIndex === 'number' && activeMessage.choices?.[activeMessage.chosenReplyIndex] && (
                      <div className="flex items-start justify-end gap-2 max-w-[90%] ml-auto">
                        <div className="bg-[#FF4F00]/15 border border-[#FF4F00]/40 p-3 rounded-[4px] text-xs text-white leading-relaxed text-right">
                          <p className="font-semibold text-[#FF4F00]">
                            {activeMessage.choices[activeMessage.chosenReplyIndex].replyText}
                          </p>
                          <div className="flex items-center justify-end gap-1 mt-1 text-2xs font-mono text-[#FF4F00]/80">
                            <span>Respuesta Enviada</span>
                            <CheckCheck className="w-3 h-3 text-[#FF4F00]" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reply Choices Section */}
                  {typeof activeMessage.chosenReplyIndex !== 'number' && activeMessage.choices && activeMessage.choices.length > 0 && (
                    <div className="pt-2 border-t border-[#242429] space-y-1.5 shrink-0">
                      <span className="text-2xs uppercase font-mono font-bold text-[#8E8E99] block px-1">
                        Elige tu respuesta:
                      </span>
                      {activeMessage.choices.map((choice, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleReply(activeMessage.id, idx)}
                          className="w-full text-left bg-[#111114] hover:bg-[#18181C] border border-[#242429] hover:border-[#3F3F46] p-2.5 rounded-[4px] transition-all cursor-pointer group active:translate-y-[1px] flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-[#F4F4F6] group-hover:text-[#FF4F00] block">
                              {choice.label}
                            </span>
                            <p className="text-2xs text-[#8E8E99] truncate">
                              "{choice.replyText}"
                            </p>
                          </div>
                          <Send className="w-3.5 h-3.5 text-[#FF4F00] group-hover:translate-x-0.5 transition-transform shrink-0" />
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
                        className={`w-full text-left p-2.5 rounded-[4px] border transition-all cursor-pointer flex items-center gap-2.5 ${
                          !msg.isRead
                            ? 'bg-[#18181C] border-[#FF4F00]/50'
                            : 'bg-[#111114] hover:bg-[#18181C] border-[#242429]'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-[4px] bg-[#18181C] border border-[#242429] flex items-center justify-center text-[#F4F4F6] text-xs font-mono font-bold shrink-0 relative">
                          {msg.senderName.slice(0, 1)}
                          {!msg.isRead && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF4F00]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-xs font-bold truncate ${!msg.isRead ? 'text-[#FF4F00]' : 'text-[#F4F4F6]'}`}>
                              {msg.senderName}
                            </span>
                            <span className="text-2xs text-[#8E8E99] font-mono shrink-0">
                              M{msg.sentMonth}
                            </span>
                          </div>
                          <p className="text-2xs text-[#8E8E99] truncate">
                            {msg.text}
                          </p>
                          <span className={`text-3xs font-mono px-1 rounded-[2px] border inline-block mt-1 ${badge.bg}`}>
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
              <div className="bg-[#111114] border border-[#242429] rounded-[4px] p-3">
                <span className="text-2xs uppercase font-mono font-bold text-[#8E8E99] block tracking-wider">
                  Tendencias Globales
                </span>
                <h4 className="text-xs font-bold text-[#F4F4F6] mt-0.5">#{player.name.replace(/\s+/g, '')}</h4>
                <p className="text-2xs text-[#8E8E99] font-mono tabular-nums">
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
                <div key={idx} className="bg-[#111114] border border-[#242429] rounded-[4px] p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-2xs">
                    <span className="font-bold text-[#F4F4F6]">{tweet.handle}</span>
                    <span className="text-[#8E8E99] font-mono">{tweet.user}</span>
                  </div>
                  <p className="text-xs text-[#F4F4F6] leading-relaxed">{tweet.text}</p>
                  <div className="flex items-center gap-4 text-2xs font-mono text-[#8E8E99] pt-1 border-t border-[#242429]">
                    <span className="flex items-center gap-1 hover:text-[#EF4444]">
                      <Heart className="w-3 h-3 text-[#EF4444]" /> {tweet.likes}
                    </span>
                    <span className="flex items-center gap-1 hover:text-[#00E599]">
                      <TrendingUp className="w-3 h-3 text-[#00E599]" /> {tweet.retweets}
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
              <div className="w-full h-44 rounded-[6px] bg-[#111114] border border-[#242429] p-4 text-[#F4F4F6] flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#8E8E99]">
                    ARTIST BLACK CARD
                  </span>
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div>
                  <span className="text-2xs uppercase font-mono tracking-wider text-[#8E8E99] block">Fondos Disponibles</span>
                  <span className="text-2xl font-bold font-mono tabular-nums tracking-tight text-[#00E599]">
                    {formatMoney(player.stats?.funds || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-2xs font-mono text-[#8E8E99]">
                  <span>TITULAR: {player.name.toUpperCase()}</span>
                  <span>EXP: 12/32</span>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#111114] border border-[#242429] p-2.5 rounded-[4px]">
                  <span className="text-2xs text-[#8E8E99] uppercase block font-mono">Comunidad Fiel</span>
                  <span className="font-bold text-[#F4F4F6] font-mono tabular-nums">
                    {formatFans(player.stats?.fansCount || 0)}
                  </span>
                </div>
                <div className="bg-[#111114] border border-[#242429] p-2.5 rounded-[4px]">
                  <span className="text-2xs text-[#8E8E99] uppercase block font-mono">Nivel de Hype</span>
                  <span className="font-bold text-[#F59E0B] font-mono tabular-nums">
                    {player.stats?.hype || 0}/100 🔥
                  </span>
                </div>
              </div>

              {/* Financial Tip */}
              <div className="bg-[#111114] border border-[#242429] p-3 rounded-[4px] text-xs text-[#8E8E99] space-y-1">
                <span className="font-bold text-[#F4F4F6] block font-mono">💡 Consejo de Mánager:</span>
                <p>
                  Mantén siempre un colchón de al menos $15.000 para emergencias de giras y producciones de videoclips.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Smartphone Navigation Dock */}
        <div className="h-14 border-t border-[#242429] bg-[#111114] px-6 flex items-center justify-around shrink-0 z-20">
          <button
            onClick={() => {
              playSound('click');
              setActiveApp('messages');
            }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors font-mono ${
              activeApp === 'messages' ? 'text-[#FF4F00] font-bold' : 'text-[#8E8E99] hover:text-[#F4F4F6]'
            }`}
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF4F00]" />
              )}
            </div>
            <span className="text-3xs uppercase">DMs</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setActiveApp('feed');
            }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors font-mono ${
              activeApp === 'feed' ? 'text-[#FF4F00] font-bold' : 'text-[#8E8E99] hover:text-[#F4F4F6]'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-3xs uppercase">TrendX</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setActiveApp('wallet');
            }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors font-mono ${
              activeApp === 'wallet' ? 'text-[#FF4F00] font-bold' : 'text-[#8E8E99] hover:text-[#F4F4F6]'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-3xs uppercase">Banco</span>
          </button>
        </div>

        {/* Home Indicator Bar */}
        <div className="h-3 bg-[#09090B] flex items-center justify-center shrink-0">
          <div className="w-24 h-1 rounded-[1px] bg-[#242429]" />
        </div>
      </div>
    </div>
  );
};
