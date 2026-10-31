import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { StatusBars } from './components/StatusBars';
import { RealityView } from './components/reality/RealityView';
import { CustomCursor } from './components/reality/CustomCursor';
import { Offa3DCanvas } from './components/3d/Offa3DCanvas';
import { PhoneApp } from './components/PhoneApp';
import { LocationModal } from './components/LocationModal';
import { EventModal } from './components/EventModal';
import { CharacterCreation } from './components/CharacterCreation';
import { MarketHaggling } from './components/minigames/MarketHaggling';
import { IjakadiWrestling } from './components/minigames/IjakadiWrestling';
import { FarmHarvest } from './components/minigames/FarmHarvest';
import { KekeHustle } from './components/minigames/KekeHustle';
import { LOCATIONS } from './data/locations';
import {
  Compass,
  ScrollText,
  MapPin,
  Sparkles,
  Trophy,
  Flame,
  Wheat,
  ShoppingBag,
  Eye,
  Box,
} from 'lucide-react';

const MainGameContent = () => {
  const {
    player,
    world,
    activeMinigame,
    setActiveMinigame,
    isCharacterModalOpen,
    setIsCharacterModalOpen,
  } = useGame();

  const [activeLocationDetail, setActiveLocationDetail] = useState(null);
  const [activeMainMode, setActiveMainMode] = useState('reality'); // 'reality' | '3d-action'

  const currentLocation = LOCATIONS.find((l) => l.id === player.currentLocationId);

  return (
    <div className="min-h-screen bg-[#070a10] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white cursor-default">
      {/* Interactive Custom Cursor */}
      <CustomCursor />

      {/* Top Header */}
      <Header />

      {/* Breaking / Town Activity Ticker */}
      <div className="bg-slate-950/80 border-b border-slate-900 py-1.5 px-4 text-xs overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1 shrink-0">
            <ScrollText className="w-3 h-3" />
            Offa Dispatch
          </span>
          <div className="text-slate-300 truncate font-mono text-[11px]">
            {world.logs[0] || 'A peaceful day in Offa Kingdom. "Ìjàkadì Lóro Ọ̀fà".'}
          </div>
        </div>
      </div>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto w-full p-3 sm:p-5 flex-1 space-y-4">
        {/* Top: Status Bars & Quick Character Stats */}
        <StatusBars />

        {/* View Mode Switcher: Reality Landmark View vs 3D Free Fire Action View */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveMainMode('reality')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 shadow-md ${
                activeMainMode === 'reality'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-900/50'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Eye className="w-4 h-4 text-emerald-200" />
              <span>🏛️ REALITY LANDMARK VIEW (Captain Cook & Front Facades)</span>
            </button>

            <button
              onClick={() => setActiveMainMode('3d-action')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 shadow-md ${
                activeMainMode === '3d-action'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-red-900/50'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Box className="w-4 h-4 text-amber-200" />
              <span>🎮 3D HERO COMBAT & NIGHTCLUB VIEW (CoD / Free Fire)</span>
            </button>
          </div>

          {/* Quick Minigame Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveMinigame('wrestling')}
              className="px-3 py-1.5 rounded-xl bg-amber-950/70 hover:bg-amber-900 text-amber-200 text-xs font-bold border border-amber-700/60 transition flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Ìjàkadì Arena</span>
            </button>
            <button
              onClick={() => setActiveMinigame('market')}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 text-emerald-200 text-xs font-bold border border-emerald-700/60 transition flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Owode Haggling</span>
            </button>
            <button
              onClick={() => setActiveMinigame('farm')}
              className="px-3 py-1.5 rounded-xl bg-teal-950/70 hover:bg-teal-900 text-teal-200 text-xs font-bold border border-teal-700/60 transition flex items-center gap-1.5"
            >
              <Wheat className="w-3.5 h-3.5 text-teal-400" />
              <span>Farm Harvest</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Active Reality Viewport + Nigerian Smartphone */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Reality Landmark View OR 3D Action Canvas */}
          <div className="lg:col-span-7 space-y-4">
            {activeMainMode === 'reality' ? (
              <RealityView onOpenMinigame={(gameType) => setActiveMinigame(gameType)} />
            ) : (
              <Offa3DCanvas onInteractLocation={(loc) => setActiveLocationDetail(loc)} />
            )}
          </div>

          {/* Right Column: Nigerian Smartphone (FinTech, Career, Eats, Estates, Trophies) */}
          <div className="lg:col-span-5">
            <PhoneApp />
          </div>
        </div>

        {/* Recent World & Hustle Log Feed */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <ScrollText className="w-4 h-4 text-emerald-400" />
            <span>Offa Life Chronicle & Logbook</span>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {world.logs.map((log, idx) => (
              <div
                key={idx}
                className="text-xs font-mono py-1 px-2.5 rounded-lg bg-slate-950/70 border border-slate-800/50 text-slate-300"
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Cultural Footer */}
      <footer className="mt-8 border-t border-slate-800/80 py-6 px-4 bg-slate-950 text-center text-xs text-slate-400 space-y-2">
        <p className="font-semibold text-slate-300">
          Offa Life Simulator • Built with reverence for the heritage of Offa Kingdom
        </p>
        <p className="text-[11px] text-slate-500">
          "Ìjàkadì Lóro Ọ̀fà" • "Ọ̀fà lo l'ánamọ́" • Powered by Offa Reality Landmark & 3D Action Engine
        </p>
        <p className="text-[10px] text-emerald-400/80">
          Repository:{' '}
          <a
            href="https://github.com/majormarshall/offa-life.git"
            className="underline hover:text-emerald-300"
            target="_blank"
            rel="noreferrer"
          >
            majormarshall/offa-life
          </a>
        </p>
      </footer>

      {/* Modals & Active Minigames */}
      {activeLocationDetail && (
        <LocationModal
          location={activeLocationDetail}
          onClose={() => setActiveLocationDetail(null)}
        />
      )}

      {activeMinigame === 'market' && (
        <MarketHaggling onClose={() => setActiveMinigame(null)} />
      )}

      {activeMinigame === 'wrestling' && (
        <IjakadiWrestling onClose={() => setActiveMinigame(null)} />
      )}

      {activeMinigame === 'farm' && (
        <FarmHarvest onClose={() => setActiveMinigame(null)} />
      )}

      {activeMinigame === 'keke' && (
        <KekeHustle onClose={() => setActiveMinigame(null)} />
      )}

      <EventModal />

      {isCharacterModalOpen && (
        <CharacterCreation onClose={() => setIsCharacterModalOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainGameContent />
    </GameProvider>
  );
}
