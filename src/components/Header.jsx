import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, Clock, Sun, Moon, CloudSun, Zap, ZapOff, FastForward } from 'lucide-react';

export const Header = () => {
  const { world, player, advanceTime } = useGame();
  const [isMuted, setIsMuted] = useState(sound.muted);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const getDayName = (day) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[(day - 1) % 7];
  };

  const getWeatherIcon = (timeOfDay) => {
    if (timeOfDay === 'Night') return <Moon className="w-4 h-4 text-indigo-400" />;
    if (timeOfDay === 'Evening') return <CloudSun className="w-4 h-4 text-amber-400" />;
    return <Sun className="w-4 h-4 text-yellow-400" />;
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800 text-white px-3 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Brand & Slogan */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-amber-500 flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-900/40 border border-emerald-400/30">
            Ọ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300 bg-clip-text text-transparent">
                OFFA LIFE
              </h1>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                v2.0 Advanced
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Ìjàkadì Lóro Ọ̀fà • The Nigerian Life Simulator
            </p>
          </div>
        </div>

        {/* Real-time World Status (Day, Hour, Weather, NEPA) */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Day & Clock */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-200">
              Day {world.day} ({getDayName(world.day)})
            </span>
            <span className="text-slate-400 font-mono">
              {String(world.hour).padStart(2, '0')}:00
            </span>
          </div>

          {/* Weather */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            {getWeatherIcon(world.timeOfDay)}
            <span className="text-slate-300 font-medium">{world.timeOfDay}</span>
          </div>

          {/* NEPA Status */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-semibold ${
              world.nepaPower
                ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-300'
                : 'bg-amber-950/60 border-amber-600/50 text-amber-300 animate-pulse'
            }`}
          >
            {world.nepaPower ? (
              <>
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>NEPA ON</span>
              </>
            ) : (
              <>
                <ZapOff className="w-3.5 h-3.5 text-amber-400" />
                <span>BLACKOUT</span>
              </>
            )}
          </div>

          {/* Advance Time Buttons */}
          <button
            onClick={() => advanceTime(1)}
            title="Advance 1 Hour"
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            <FastForward className="w-3.5 h-3.5 text-teal-400" />
            <span>+1h</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
