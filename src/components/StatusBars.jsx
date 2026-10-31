import React from 'react';
import { useGame } from '../context/GameContext';
import { Heart, BatteryCharging, Utensils, Sparkles, Smile, ShieldAlert, Award, GraduationCap } from 'lucide-react';

export const StatusBars = () => {
  const { player, setIsCharacterModalOpen } = useGame();
  const { stats, cash, bankBalance } = player;

  const totalWealth = cash + bankBalance;

  const getMeterColor = (val) => {
    if (val > 65) return 'bg-emerald-500';
    if (val > 30) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const statItems = [
    { label: 'Hunger', val: stats.hunger, icon: Utensils, color: getMeterColor(stats.hunger) },
    { label: 'Energy', val: stats.energy, icon: BatteryCharging, color: getMeterColor(stats.energy) },
    { label: 'Health', val: stats.health, icon: Heart, color: getMeterColor(stats.health) },
    { label: 'Hygiene', val: stats.hygiene, icon: Sparkles, color: getMeterColor(stats.hygiene) },
    { label: 'Fun', val: stats.fun, icon: Smile, color: getMeterColor(stats.fun) },
    { label: 'Respect (Iyi)', val: stats.respect, icon: Award, color: 'bg-amber-400' },
    { label: 'Education', val: stats.education, icon: GraduationCap, color: 'bg-teal-400' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl text-white">
      {/* Top: Character Banner & Wealth */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div
            onClick={() => setIsCharacterModalOpen(true)}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center text-2xl shadow-inner cursor-pointer hover:scale-105 transition border border-emerald-400/40"
            title="Click to edit character"
          >
            {player.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">{player.name}</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                {player.title}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Ward: <span className="text-slate-200">{player.ward}</span>
            </p>
          </div>
        </div>

        {/* Wealth Counters */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Cash in Hand</span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono">
              ₦{cash.toLocaleString()}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Bank Savings</span>
            <span className="text-sm sm:text-base font-extrabold text-teal-400 font-mono">
              ₦{bankBalance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Warning Alert if critical */}
      {(stats.hunger < 20 || stats.energy < 20 || stats.health < 25) && (
        <div className="mt-3 p-2 rounded-xl bg-red-950/70 border border-red-800/80 text-xs text-red-200 flex items-center gap-2 animate-pulse">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span>
            Critical condition! {stats.hunger < 20 ? 'Extremely hungry (Eat at Owode)! ' : ''}
            {stats.energy < 20 ? 'Dangerously exhausted (Rest in quarters)! ' : ''}
          </span>
        </div>
      )}

      {/* Meters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mt-3">
        {statItems.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/80 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1 text-slate-400 text-[11px] font-medium">
                  <Icon className="w-3 h-3 text-slate-300" />
                  {stat.label}
                </span>
                <span className="font-bold text-slate-200 font-mono text-[11px]">{stat.val}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${stat.color}`}
                  style={{ width: `${Math.min(100, Math.max(0, stat.val))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
