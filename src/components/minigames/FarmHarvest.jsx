import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Wheat, Sparkles, Sun, Droplets, CheckCircle2 } from 'lucide-react';

export const FarmHarvest = ({ onClose }) => {
  const { player, setPlayer, addLog } = useGame();

  const [plots, setPlots] = useState([
    { id: 1, stage: 'ripe', type: 'Orange Flesh Anamo', yield: 4 },
    { id: 2, stage: 'growing', type: 'White Tuber Anamo', yield: 3 },
    { id: 3, stage: 'ripe', type: 'Golden Giant Anamo', yield: 6 },
    { id: 4, stage: 'thirsty', type: 'Purple Skin Anamo', yield: 3 },
    { id: 5, stage: 'ripe', type: 'Sweet Sugar Anamo', yield: 5 },
    { id: 6, stage: 'growing', type: 'Offa Native Vine', yield: 4 },
  ]);

  const [harvestedTubers, setHarvestedTubers] = useState(0);
  const [totalYieldVal, setTotalYieldVal] = useState(0);

  const handlePlotAction = (idx) => {
    sound.playClick();
    const plot = plots[idx];

    if (plot.stage === 'ripe') {
      // Harvest!
      sound.playCash();
      const earnedTuber = plot.yield * player.farmLevel;
      const tuberValue = earnedTuber * 1800; // ₦1,800 per crate

      setHarvestedTubers((prev) => prev + earnedTuber);
      setTotalYieldVal((prev) => prev + tuberValue);

      const updated = [...plots];
      updated[idx] = { ...plot, stage: 'growing', yield: Math.floor(Math.random() * 4) + 3 };
      setPlots(updated);
    } else if (plot.stage === 'thirsty') {
      const updated = [...plots];
      updated[idx] = { ...plot, stage: 'ripe' };
      setPlots(updated);
    } else if (plot.stage === 'growing') {
      const updated = [...plots];
      updated[idx] = { ...plot, stage: 'ripe' };
      setPlots(updated);
    }
  };

  const handleFinishHarvest = () => {
    sound.playClick();
    if (harvestedTubers > 0) {
      confetti({ particleCount: 70, spread: 60 });
      sound.playVictory();
      setPlayer((prev) => ({
        ...prev,
        cash: prev.cash + totalYieldVal,
        harvestCount: prev.harvestCount + harvestedTubers,
        stats: {
          ...prev.stats,
          energy: Math.max(0, prev.stats.energy - 15),
          hunger: Math.max(0, prev.stats.hunger - 15),
          respect: Math.min(100, prev.stats.respect + 5),
        },
      }));
      addLog(`🍠 Harvest Complete! Harvested ${harvestedTubers} crates of Anamo Offa along Ojoku Road. Earned ₦${totalYieldVal.toLocaleString()}!`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-emerald-600/40 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl text-white relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-500/30">
              <Wheat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Anamọ Ọ̀fà Sweet Potato Harvest</h2>
              <p className="text-xs text-emerald-400 font-medium">Ojoku Road Agricultural Farmlands</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Harvest Summary Card */}
        <div className="my-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Total Crates Harvested</span>
            <span className="text-2xl font-black text-amber-400 font-mono">
              {harvestedTubers} Crates 🍠
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Market Value</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              ₦{totalYieldVal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Farm Plots Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          {plots.map((plot, idx) => (
            <div
              key={idx}
              onClick={() => handlePlotAction(idx)}
              className={`p-3.5 rounded-2xl border text-center cursor-pointer transition transform hover:scale-105 ${
                plot.stage === 'ripe'
                  ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-lg shadow-amber-950/50'
                  : plot.stage === 'thirsty'
                  ? 'bg-blue-950/60 border-blue-600 text-blue-200'
                  : 'bg-emerald-950/60 border-emerald-700 text-emerald-200'
              }`}
            >
              <div className="text-2xl mb-1">
                {plot.stage === 'ripe' ? '🍠' : plot.stage === 'thirsty' ? '💧' : '🌱'}
              </div>
              <p className="text-xs font-bold truncate">{plot.type}</p>
              <span className="text-[10px] font-semibold mt-1 inline-block px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                {plot.stage === 'ripe' ? 'Ready to Dig!' : plot.stage === 'thirsty' ? 'Needs Water' : 'Tending Vines'}
              </span>
            </div>
          ))}
        </div>

        {/* Done / Bagging Button */}
        <button
          onClick={handleFinishHarvest}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Pack Crates & Collect ₦{totalYieldVal.toLocaleString()}</span>
        </button>
      </div>
    </div>
  );
};
