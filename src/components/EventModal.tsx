import React from 'react';
import { EventDefinition, EventChoice, WorldState, Artist } from '../types';
import { Sparkles, AlertCircle, HelpCircle, ArrowRight, ShieldAlert } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-700/80 max-w-xl w-full rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-rose-950/20 animate-fade-in relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />

        {/* Category & Title */}
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Dilema Narrativo • {event.category}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {event.title}
          </h2>

          <p className="text-sm text-zinc-300 leading-relaxed pt-1">
            {typeof event.getDescription === 'function' ? event.getDescription(context) : (event as any).description}
          </p>
        </div>

        {/* Choices List */}
        <div className="space-y-3 relative z-10">
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
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
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 group ${
                    isEligible
                      ? 'bg-zinc-900/80 hover:bg-zinc-800/90 border-zinc-700 hover:border-rose-500/60 active:scale-[0.99]'
                      : 'bg-zinc-900/30 border-zinc-800 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                      {choice.text}
                    </p>
                    {choice.consequencesDescription && (
                      <p className="text-xs text-zinc-400">
                        {choice.consequencesDescription}
                      </p>
                    )}
                    {!isEligible && (
                      <p className="text-[11px] text-rose-400 font-semibold flex items-center gap-1 pt-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Requisitos no cumplidos
                      </p>
                    )}
                  </div>

                  {isEligible && (
                    <div className="p-2 rounded-lg bg-zinc-800 group-hover:bg-rose-600 text-zinc-400 group-hover:text-white transition-colors shrink-0">
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
