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
        let badgeStyle = 'bg-[#18181C]/95 text-[#F4F0EA] border-white/15 shadow-black/70';

        switch (item.type) {
          case 'money':
            badgeStyle = item.text.startsWith('-')
              ? 'bg-[#18181C]/95 text-[#EF4444] border-[#EF4444]/50 shadow-black/80'
              : 'bg-[#18181C]/95 text-[#10B981] border-[#10B981]/50 shadow-black/80';
            break;
          case 'energy':
            badgeStyle = item.text.startsWith('-')
              ? 'bg-[#18181C]/95 text-[#F59E0B] border-[#F59E0B]/50 shadow-black/80'
              : 'bg-[#18181C]/95 text-[#10B981] border-[#10B981]/50 shadow-black/80';
            break;
          case 'fans':
            badgeStyle = 'bg-[#18181C]/95 text-[#FF4F00] border-[#FF4F00]/50 shadow-black/80';
            break;
          case 'skill':
          case 'points':
            badgeStyle = 'bg-[#18181C]/95 text-[#38BDF8] border-[#38BDF8]/50 shadow-black/80';
            break;
          case 'negative':
            badgeStyle = 'bg-[#18181C]/95 text-[#EF4444] border-[#EF4444]/50 shadow-black/80';
            break;
          default:
            badgeStyle = 'bg-[#18181C]/95 text-[#F4F0EA] border-white/20 shadow-black/80';
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
              className={`px-3 py-1 rounded-[6px] border text-xs sm:text-sm font-bold font-sans tabular-nums uppercase tracking-wide backdrop-blur-md shadow-lg flex items-center gap-1.5 ${badgeStyle}`}
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
