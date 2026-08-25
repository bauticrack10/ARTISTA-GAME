import React from 'react';
import { EventDefinition, EventChoice, WorldState, Artist } from '../types';
import { Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface EventModalProps {
  event: EventDefinition;
  world: WorldState;
  player: Artist;
  onSelectChoice: (index: number) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  world,
  player,
  onSelectChoice
}) => {
  const context = {
    player,
    world,
    currentYear: world.currentYear,
    currentMonth: world.currentMonth
  };

  const choices: EventChoice[] = event.choices(context);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#f7f4ed] border border-[#eceae4] max-w-xl w-full rounded-[16px] p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] animate-fade-in relative overflow-hidden">
        {/* Category & Title */}
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[rgba(28,28,28,0.06)] text-[#1c1c1c] border border-[#eceae4]">
              Dilema Narrativo • {event.category}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-[#1c1c1c] tracking-[-0.8px]">
            {event.title}
          </h2>

          <p className="text-sm text-[#5f5f5d] leading-relaxed pt-1">
            {typeof event.getDescription === 'function' ? event.getDescription(context) : (event as any).description}
          </p>
        </div>

        {/* Choices List */}
        <div className="space-y-3 relative z-10">
          <label className="block text-xs font-semibold text-[#5f5f5d] uppercase tracking-wider">
            ¿Cómo vas a responder ante esta situación?
          </label>

          <div className="space-y-2.5">
            {choices.map((choice, idx) => {
              let isEligible = true;
              if (choice.costFunds && player.stats.funds < choice.costFunds) isEligible = false;
              if (choice.costEnergy && player.stats.energy < choice.costEnergy) isEligible = false;
              if (choice.requiresStat) {
                const statVal = (player.stats as any)[choice.requiresStat.stat] ?? (player.personality as any)[choice.requiresStat.stat] ?? 0;
                if (statVal < choice.requiresStat.min) isEligible = false;
              }

              return (
                <button
                  key={idx}
                  disabled={!isEligible}
                  onClick={() => onSelectChoice(idx)}
                  className={`w-full text-left p-4 rounded-[12px] border transition-all cursor-pointer flex items-start justify-between gap-3 group ${
                    isEligible
                      ? 'bg-[#fcfbf8] hover:bg-[#f7f4ed] border-[#eceae4] hover:border-[rgba(28,28,28,0.4)] active:scale-[0.99]'
                      : 'bg-[#f7f4ed] border-[#eceae4] opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#1c1c1c] group-hover:text-[#1c1c1c] transition-colors">
                      {choice.text}
                    </p>
                    {choice.consequencesDescription && (
                      <p className="text-xs text-[#5f5f5d]">
                        {choice.consequencesDescription}
                      </p>
                    )}
                    {!isEligible && (
                      <p className="text-[11px] text-[#1c1c1c] font-medium flex items-center gap-1 pt-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Requisitos no cumplidos
                      </p>
                    )}
                  </div>

                  {isEligible && (
                    <div className="p-2 rounded-[6px] bg-[#1c1c1c] text-[#fcfbf8] shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
