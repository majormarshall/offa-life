import React from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, AlertCircle, Zap, Shield } from 'lucide-react';

export const EventModal = () => {
  const { world, resolveEvent } = useGame();
  const event = world.activeEvent;

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl text-white relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 uppercase">
            {event.category}
          </span>
          <span className="text-xs text-slate-400 font-medium">Offa Daily Occurrence</span>
        </div>

        <h2 className="text-xl font-black text-white tracking-wide">{event.title}</h2>
        <p className="text-xs text-slate-300 leading-relaxed my-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
          {event.description}
        </p>

        {/* Choices */}
        <div className="space-y-2 mt-4">
          {event.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => resolveEvent(idx)}
              className="w-full text-left p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700/90 border border-slate-700 hover:border-amber-400/50 text-xs font-semibold text-slate-200 transition flex items-center justify-between gap-3"
            >
              <span>{option.text}</span>
              <span className="text-amber-400 font-bold shrink-0">Choose ›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
