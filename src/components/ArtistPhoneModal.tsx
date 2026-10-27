import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  TrendingUp,
  CreditCard,
  Battery,
  Wifi,
  CheckCheck,
  Send,
  Heart
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
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
      onClick={() => {
        playSound('click');
        onClose();
      }}
    >
      {/* Botón X flotante en esquina superior derecha de pantalla para móvil */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          playSound('click');
          onClose();
        }}
        aria-label="Cerrar celular"
        title="Salir del celular"
        className="sm:hidden fixed top-4 right-4 z-50 w-10 h-10 iphone-close-outside border border-white/25 flex items-center justify-center text-white shadow-2xl cursor-pointer active:scale-95 transition-all"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Wrapper relativo para posicionar botones físicos laterales y el botón X fuera del teléfono */}
      <div
        className="relative w-full max-w-[410px] my-auto flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón X FUERA del celular (esquina superior derecha exterior) */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onClose();
          }}
          aria-label="Cerrar celular"
          title="Cerrar celular (Esc)"
          className="hidden sm:flex absolute -top-2 -right-14 z-50 w-11 h-11 iphone-close-outside border border-white/20 hover:border-[#FF4F00] items-center justify-center text-[#F4F4F6] hover:text-[#FF4F00] shadow-[0_10px_30px_rgba(0,0,0,0.85)] cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Botones físicos laterales de Titanio (iPhone 16 Pro) */}
        {/* Action Button */}
        <div className="hidden sm:block absolute -left-[3px] top-28 w-[3px] h-7 bg-[#4A5060] rounded-l-full pointer-events-none" />
        {/* Volume Up */}
        <div className="hidden sm:block absolute -left-[3px] top-40 w-[3px] h-12 bg-[#4A5060] rounded-l-full pointer-events-none" />
        {/* Volume Down */}
        <div className="hidden sm:block absolute -left-[3px] top-56 w-[3px] h-12 bg-[#4A5060] rounded-l-full pointer-events-none" />
        {/* Power / Side Button */}
        <div className="hidden sm:block absolute -right-[3px] top-44 w-[3px] h-16 bg-[#4A5060] rounded-r-full pointer-events-none" />

        {/* iPhone 16 Pro Titanium Chassis */}
        <div className="w-full h-[790px] max-h-[90vh] iphone-pro-chassis flex flex-col relative text-[#F4F4F6] select-none">
          {/* Inner OLED Curved Screen */}
          <div className="w-full h-full iphone-pro-screen flex flex-col overflow-hidden relative border border-white/10">
            {/* Dynamic Island + Top iOS Status Bar */}
            <div className="h-12 px-7 pt-2.5 flex items-center justify-between text-2xs font-sans font-bold text-[#DCE2EE] shrink-0 z-20 relative">
              <span className="tracking-tight tabular-nums">
                {world?.currentMonth ? `${String(world.currentMonth).padStart(2, '0')}:00` : '09:41'}
              </span>

              {/* Dynamic Island Pill */}
              <div className="iphone-dynamic-island w-28 h-7 border border-white/10 flex items-center justify-between px-3 shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-[#121624] border border-[#2E364F] flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-[#38BDF8]/60" />
                </div>
                <div className="flex items-center gap-1.5">
                  {unreadCount > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4F00] animate-ping" />
                  )}
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00E599]" />
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-sans text-[#DCE2EE] font-semibold">5G</span>
                <Wifi className="w-3.5 h-3.5 text-[#DCE2EE]" />
                <Battery className="w-4 h-4 text-[#00E599]" />
              </div>
            </div>

            {/* Floating Effect Toast */}
            {feedbackEffect && (
              <div className="absolute top-14 left-5 right-5 z-40 bg-[#FF4F00] text-white px-3.5 py-2 rounded-full text-xs font-sans font-bold text-center shadow-lg border border-white/25">
                {feedbackEffect}
              </div>
            )}

            {/* Main Screen Content Area */}
            <div className="flex-1 overflow-y-auto flex flex-col px-4 pt-1 pb-2">
              {/* Header Title with Mark Read (No X button inside screen) */}
              <div className="flex items-center justify-between py-2.5 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold font-sans text-white tracking-tight">
                    {activeApp === 'messages' ? 'iMessage • DMs' : activeApp === 'feed' ? 'TrendX Social' : 'Apple Pay • Wallet'}
                  </span>
                  {unreadCount > 0 && (
                    <span className="bg-[#FF4F00] text-white text-3xs font-sans font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} nuevo{unreadCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {unreadCount > 0 && (
                    <button
                      onClick={() => {
                        playSound('click');
                        onMarkAllAsRead();
                      }}
                      className="text-3xs font-sans font-semibold text-[#DCE2EE] hover:text-white px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 cursor-pointer transition-colors"
                      title="Marcar todos como leídos"
                    >
                      Marcar leídos
                    </button>
                  )}
                </div>
              </div>

              {/* TAB 1: WHATSAPP / DMS */}
              {activeApp === 'messages' && (
                <div className="flex-1 flex flex-col min-h-0">
                  {messages.length === 0 ? (
                    <div className="my-auto text-center p-6 space-y-3">
                      <div className="w-14 h-14 iphone-card mx-auto flex items-center justify-center text-[#8E8E99]">
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
                      <div className="flex items-center justify-between iphone-card p-3 mb-3 shrink-0">
                        <button
                          onClick={() => setSelectedMessageId(null)}
                          className="text-xs font-sans font-semibold text-[#FF4F00] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          ← Volver
                        </button>
                        <div className="text-right">
                          <span className="text-xs font-bold text-[#F4F4F6] block">{activeMessage.senderName}</span>
                          <span className={`text-3xs font-sans px-2 py-0.5 rounded-full border ${getCategoryBadge(activeMessage.category).bg}`}>
                            {getCategoryBadge(activeMessage.category).label}
                          </span>
                        </div>
                      </div>

                      {/* Chat Bubbles Container */}
                      <div className="flex-1 overflow-y-auto space-y-3 p-1">
                        {/* Incoming Message Bubble */}
                        <div className="flex items-end gap-2 max-w-[92%]">
                          <div className="w-8 h-8 rounded-full bg-[#1C2030] border border-white/15 flex items-center justify-center text-[#F4F4F6] text-xs font-sans font-bold shrink-0">
                            {activeMessage.senderName.slice(0, 1)}
                          </div>
                          <div className="iphone-bubble-in border border-white/10 p-3.5 text-xs text-[#F4F4F6] leading-relaxed">
                            <p>{activeMessage.text}</p>
                            <div className="flex items-center justify-end gap-1 mt-1.5 text-2xs font-sans text-[#8E8E99]">
                              <span>Año {activeMessage.sentYear} • Mes {activeMessage.sentMonth}</span>
                              <CheckCheck className="w-3 h-3 text-[#00E599]" />
                            </div>
                          </div>
                        </div>

                        {/* If Already Answered: Outgoing Bubble */}
                        {typeof activeMessage.chosenReplyIndex === 'number' && activeMessage.choices?.[activeMessage.chosenReplyIndex] && (
                          <div className="flex items-end justify-end gap-2 max-w-[90%] ml-auto">
                            <div className="iphone-bubble-out bg-[#FF4F00]/20 border border-[#FF4F00]/50 p-3.5 text-xs text-white leading-relaxed text-right">
                              <p className="font-semibold text-[#FF4F00]">
                                {activeMessage.choices[activeMessage.chosenReplyIndex].replyText}
                              </p>
                              <div className="flex items-center justify-end gap-1 mt-1 text-2xs font-sans text-[#FF4F00]/80">
                                <span>Enviado por iMessage</span>
                                <CheckCheck className="w-3 h-3 text-[#FF4F00]" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Reply Choices Section */}
                      {typeof activeMessage.chosenReplyIndex !== 'number' && activeMessage.choices && activeMessage.choices.length > 0 && (
                        <div className="pt-2.5 border-t border-white/10 space-y-2 shrink-0">
                          <span className="text-2xs uppercase font-sans font-bold text-[#8E8E99] block px-1">
                            Elige tu respuesta:
                          </span>
                          {activeMessage.choices.map((choice, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleReply(activeMessage.id, idx)}
                              className="w-full text-left iphone-card hover:border-[#FF4F00]/60 p-3 transition-all cursor-pointer group active:translate-y-[1px] flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-[#F4F4F6] group-hover:text-[#FF4F00] block">
                                  {choice.label}
                                </span>
                                <p className="text-2xs text-[#8E8E99] truncate">
                                  "{choice.replyText}"
                                </p>
                              </div>
                              <Send className="w-4 h-4 text-[#FF4F00] group-hover:translate-x-0.5 transition-transform shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Message List View */
                    <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
                      {messages.map((msg) => {
                        const badge = getCategoryBadge(msg.category);
                        return (
                          <button
                            key={msg.id}
                            onClick={() => handleSelectMessage(msg)}
                            className={`w-full text-left p-3 iphone-card transition-all cursor-pointer flex items-center gap-3 ${
                              !msg.isRead
                                ? 'border-[#FF4F00]/60'
                                : 'hover:border-white/25'
                            }`}
                          >
                            <div className="w-11 h-11 rounded-full bg-[#1C2030] border border-white/15 flex items-center justify-center text-[#F4F4F6] text-sm font-sans font-bold shrink-0 relative">
                              {msg.senderName.slice(0, 1)}
                              {!msg.isRead && (
                                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#FF4F00] border-2 border-[#07090F]" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`text-xs font-bold truncate ${!msg.isRead ? 'text-[#FF4F00]' : 'text-[#F4F4F6]'}`}>
                                  {msg.senderName}
                                </span>
                                <span className="text-2xs text-[#8E8E99] font-sans shrink-0">
                                  M{msg.sentMonth}
                                </span>
                              </div>
                              <p className="text-2xs text-[#8E8E99] truncate">
                                {msg.text}
                              </p>
                              <span className={`text-3xs font-sans px-1.5 py-0.5 rounded-full border inline-block mt-1 ${badge.bg}`}>
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
                  <div className="iphone-card p-3.5">
                    <span className="text-2xs uppercase font-sans font-bold text-[#8E8E99] block tracking-wider">
                      Tendencias Globales
                    </span>
                    <h4 className="text-xs font-bold text-[#F4F4F6] mt-0.5">#{player.name.replace(/\s+/g, '')}</h4>
                    <p className="text-2xs text-[#8E8E99] font-sans tabular-nums">
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
                    <div key={idx} className="iphone-card p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-2xs">
                        <span className="font-bold text-[#F4F4F6]">{tweet.handle}</span>
                        <span className="text-[#8E8E99] font-sans">{tweet.user}</span>
                      </div>
                      <p className="text-xs text-[#F4F4F6] leading-relaxed">{tweet.text}</p>
                      <div className="flex items-center gap-4 text-2xs font-sans text-[#8E8E99] pt-1.5 border-t border-white/10">
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
                  <div className="w-full h-44 iphone-card p-4 text-[#F4F4F6] flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#191E2E] to-[#0D101A]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans font-bold tracking-widest uppercase text-[#8E8E99]">
                        ARTIST BLACK CARD
                      </span>
                      <CreditCard className="w-4 h-4 text-[#F59E0B]" />
                    </div>
                    <div>
                      <span className="text-2xs uppercase font-sans tracking-wider text-[#8E8E99] block">Fondos Disponibles</span>
                      <span className="text-2xl font-bold font-sans tabular-nums tracking-tight text-[#00E599]">
                        {formatMoney(player.stats?.funds || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-2xs font-sans text-[#8E8E99]">
                      <span>TITULAR: {player.name.toUpperCase()}</span>
                      <span>EXP: 12/32</span>
                    </div>
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="iphone-card p-3">
                      <span className="text-2xs text-[#8E8E99] uppercase block font-sans">Comunidad Fiel</span>
                      <span className="font-bold text-[#F4F4F6] font-sans tabular-nums">
                        {formatFans(player.stats?.fansCount || 0)}
                      </span>
                    </div>
                    <div className="iphone-card p-3">
                      <span className="text-2xs text-[#8E8E99] uppercase block font-sans">Nivel de Hype</span>
                      <span className="font-bold text-[#F59E0B] font-sans tabular-nums">
                        {player.stats?.hype || 0}/100 🔥
                      </span>
                    </div>
                  </div>

                  {/* Financial Tip */}
                  <div className="iphone-card p-3.5 text-xs text-[#8E8E99] space-y-1">
                    <span className="font-bold text-[#F4F4F6] block font-sans">💡 Consejo de Mánager:</span>
                    <p>
                      Mantén siempre un colchón de al menos $15.000 para emergencias de giras y producciones de videoclips.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom iOS Floating Dock */}
            <div className="px-4 pt-1 pb-2 shrink-0 z-20">
              <div className="h-14 iphone-dock border border-white/12 px-6 flex items-center justify-around shadow-lg">
                <button
                  onClick={() => {
                    playSound('click');
                    setActiveApp('messages');
                  }}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors font-sans ${
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
                  className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors font-sans ${
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
                  className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors font-sans ${
                    activeApp === 'wallet' ? 'text-[#FF4F00] font-bold' : 'text-[#8E8E99] hover:text-[#F4F4F6]'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-3xs uppercase">Wallet</span>
                </button>
              </div>
            </div>

            {/* iOS Home Indicator Bar */}
            <div className="h-4 flex items-center justify-center shrink-0 pb-1.5">
              <div className="w-32 h-1 rounded-full bg-white/35" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
