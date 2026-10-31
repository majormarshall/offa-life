import React from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

export const LocationModal = ({ location, onClose }) => {
  const { player, performAction } = useGame();

  if (!location) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl text-white relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          ✕
        </button>

        {/* Location Header with Yoruba Banner */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
            {location.category}
          </span>
          <span className="text-sm font-serif italic text-amber-300">
            {location.yorubaName}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
          {location.name}
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-1 mb-4">
          {location.tagline}
        </p>

        {/* Description & Lore */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed mb-5">
          {location.description}
        </div>

        {/* Available Actions in this Location */}
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Available Hustles & Activities
        </h3>

        <div className="space-y-2.5">
          {location.availableActions?.map((action) => {
            const canAfford = !action.cost || player.cash >= action.cost;
            const hasEnergy = !action.energyCost || player.stats.energy >= action.energyCost;
            const hasRespect = !action.reqRespect || player.stats.respect >= action.reqRespect;
            const hasEdu = !action.reqEdu || player.stats.education >= action.reqEdu;
            const isAvailable = canAfford && hasEnergy && hasRespect && hasEdu;

            return (
              <div
                key={action.id}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">{action.name}</h4>
                    {action.cost && (
                      <span className="text-xs font-mono font-bold text-amber-400">
                        (₦{action.cost.toLocaleString()})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{action.description}</p>

                  {/* Stat Impact tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {action.energyCost && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-red-300">
                        -{action.energyCost}% Energy
                      </span>
                    )}
                    {action.energyGain && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-300">
                        +{action.energyGain}% Energy
                      </span>
                    )}
                    {action.hungerGain && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-300">
                        +{action.hungerGain}% Hunger
                      </span>
                    )}
                    {action.respectGain && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
                        +{action.respectGain} Respect
                      </span>
                    )}
                    {action.cashGain && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-bold">
                        +₦{action.cashGain.toLocaleString()} Cash
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Trigger */}
                <button
                  disabled={!isAvailable}
                  onClick={() => {
                    performAction(action);
                    if (action.isMinigame) {
                      onClose();
                    }
                  }}
                  className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                    isAvailable
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  {action.isMinigame ? 'Launch Minigame' : 'Execute Action'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
