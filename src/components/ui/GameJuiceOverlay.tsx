import React, { useEffect, useState } from 'react';
import { gameJuice, FloatingItem } from '../../utils/gameJuice';

export const GameJuiceOverlay: React.FC = () => {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    return gameJuice.subscribeFloating((updated) => {
      setItems(updated);
    });
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
      aria-hidden="true"
    >
      {items.map((item) => {
        let badgeStyle = 'bg-white/10 text-white border-white/20 shadow-black/60';

        switch (item.type) {
          case 'money':
            badgeStyle = item.text.startsWith('-')
              ? 'bg-rose-950/90 text-rose-300 border-rose-500/50 shadow-rose-950/80'
              : 'bg-emerald-950/90 text-[#00E599] border-emerald-500/50 shadow-emerald-950/80';
            break;
          case 'energy':
            badgeStyle = item.text.startsWith('-')
              ? 'bg-amber-950/90 text-amber-300 border-amber-500/50 shadow-amber-950/80'
              : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 shadow-emerald-950/80';
            break;
          case 'fans':
            badgeStyle = 'bg-orange-950/90 text-[#FF4F00] border-orange-500/50 shadow-orange-950/80';
            break;
          case 'skill':
            badgeStyle = 'bg-cyan-950/90 text-cyan-300 border-cyan-500/50 shadow-cyan-950/80';
            break;
          case 'points':
            badgeStyle = 'bg-cyan-950/95 text-[#00D2FF] border-[#00D2FF]/60 shadow-[0_0_16px_rgba(0,210,255,0.4)]';
            break;
          case 'negative':
            badgeStyle = 'bg-rose-950/90 text-rose-300 border-rose-500/50 shadow-rose-950/80';
            break;
          default:
            badgeStyle = 'bg-[#18181C]/95 text-white border-white/25 shadow-black/80';
            break;
        }

        return (
          <div
            key={item.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 kit-float-num select-none"
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`
            }}
          >
            <div
              className={`px-3 py-1 rounded-[8px] border text-xs sm:text-sm font-bold font-mono tabular-nums uppercase tracking-wide backdrop-blur-md shadow-lg flex items-center gap-1.5 ${badgeStyle}`}
            >
              <span>{item.text}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GameJuiceOverlay;
