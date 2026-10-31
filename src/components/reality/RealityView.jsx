import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { REALITY_SCENES } from '../../data/scenes';
import { LOCATIONS } from '../../data/locations';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Footprints,
  DoorOpen,
  ShoppingBag,
  Utensils,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Navigation,
  CheckCircle2,
  Coffee,
  Flame,
  Crown,
  Music,
} from 'lucide-react';

export const RealityView = ({ onOpenMinigame }) => {
  const { player, world, setPlayer, advanceTime, addLog } = useGame();

  // Active Scene ID (default: 'captain-cook' or current location)
  const [activeLocationId, setActiveLocationId] = useState('captain-cook');
  const [viewMode, setViewMode] = useState('front'); // 'front' | 'interior'
  const [isTraveling, setIsTraveling] = useState(false);
  const [travelProgress, setTravelProgress] = useState(0);
  const [avatarStreetPos, setAvatarStreetPos] = useState(25); // percentage along street
  const [actionNotice, setActionNotice] = useState(null);

  const scene = REALITY_SCENES[activeLocationId] || REALITY_SCENES['captain-cook'];

  // Handle Walking to a New Location
  const handleWalkToLocation = (locId) => {
    sound.playClick();
    if (locId === activeLocationId && !isTraveling) return;

    const targetScene = REALITY_SCENES[locId] || REALITY_SCENES['captain-cook'];
    setIsTraveling(true);
    setTravelProgress(0);
    setViewMode('front');
    setActionNotice(`🚶 Walking down Olofa Way towards ${targetScene.name}...`);

    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setTravelProgress(prog);
      setAvatarStreetPos((prev) => (prev + 12) % 80 + 10);

      if (prog >= 100) {
        clearInterval(interval);
        setIsTraveling(false);
        setActiveLocationId(locId);
        sound.playVictory();
        setActionNotice(`📍 Arrived! Viewing the front facade of ${targetScene.name}.`);
        addLog(`📍 Arrived at ${targetScene.name} (${targetScene.locationTag}). You are standing at the front entrance.`);
        setTimeout(() => setActionNotice(null), 3000);
      }
    }, 450);
  };

  // Click on Street to Walk Avatar directly to that spot
  const handleStreetClick = (e) => {
    sound.playClick();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(10, Math.min(85, (clickX / rect.width) * 100));
    setAvatarStreetPos(percentage);
  };

  // Step Inside / Step Outside
  const handleToggleInterior = () => {
    sound.playClick();
    if (viewMode === 'front') {
      setViewMode('interior');
      sound.playDoorOpen ? sound.playDoorOpen() : sound.playVictory();
      setActionNotice(`🚪 Stepped inside ${scene.name}!`);
    } else {
      setViewMode('front');
      setActionNotice(`🚪 Stepped outside to the front street.`);
    }
    setTimeout(() => setActionNotice(null), 2500);
  };

  // Buy Meal / Food Item at Captain Cook or Location
  const handleOrderFood = (item) => {
    sound.playClick();
    if (player.cash < item.price) {
      setActionNotice(`❌ Not enough cash for ${item.name}! Need ₦${item.price.toLocaleString()}.`);
      setTimeout(() => setActionNotice(null), 2500);
      return;
    }

    sound.playCash();
    confetti({ particleCount: 50, spread: 60 });
    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash - item.price,
      stats: {
        ...prev.stats,
        hunger: Math.min(100, prev.stats.hunger + (item.hunger || 0)),
        energy: Math.min(100, prev.stats.energy + (item.energy || 0)),
        fun: Math.min(100, prev.stats.fun + (item.fun || 0)),
      },
    }));

    setActionNotice(`😋 Enjoyed fresh ${item.name} at Captain Cook! Restored hunger and energy.`);
    addLog(`🍔 Ordered ${item.name} at Captain Cook Offa for ₦${item.price.toLocaleString()}. Sat down and enjoyed the meal!`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Perform Location Action
  const handleSceneAction = (action) => {
    sound.playClick();
    if (action.isMinigame && onOpenMinigame) {
      onOpenMinigame(action.isMinigame);
      return;
    }

    if (action.cost && player.cash < action.cost) {
      setActionNotice(`❌ Cannot afford this action! Need ₦${action.cost.toLocaleString()}.`);
      setTimeout(() => setActionNotice(null), 2500);
      return;
    }

    if (action.reqRespect && player.stats.respect < action.reqRespect) {
      setActionNotice(`❌ Insufficient respect! Requires at least ${action.reqRespect} Respect.`);
      setTimeout(() => setActionNotice(null), 2500);
      return;
    }

    setPlayer((prev) => {
      const stats = { ...prev.stats };
      if (action.energyCost) stats.energy = Math.max(0, stats.energy - action.energyCost);
      if (action.energyGain) stats.energy = Math.min(100, stats.energy + action.energyGain);
      if (action.hungerGain) stats.hunger = Math.min(100, stats.hunger + action.hungerGain);
      if (action.funGain) stats.fun = Math.min(100, stats.fun + action.funGain);
      if (action.socialGain) stats.social = Math.min(100, stats.social + action.socialGain);
      if (action.respectGain) stats.respect = Math.min(100, stats.respect + action.respectGain);
      if (action.eduGain) stats.education = Math.min(100, stats.education + action.eduGain);
      if (action.strengthGain) stats.strength = Math.min(100, stats.strength + action.strengthGain);

      let cash = prev.cash;
      if (action.cost) cash -= action.cost;

      return {
        ...prev,
        cash,
        stats,
      };
    });

    if (action.cost) sound.playCash();
    else sound.playVictory();

    confetti({ particleCount: 40, spread: 50 });
    setActionNotice(`✨ Completed: ${action.name}! ${action.desc}`);
    addLog(`✨ Performed "${action.name}" at ${scene.name}.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl text-white space-y-4">
      {/* Top Street Destination Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>OFFA REALITY NAVIGATION</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                LIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Select where you want your avatar to physically walk and explore in Offa:
            </p>
          </div>
        </div>

        {/* Quick Location Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {Object.keys(REALITY_SCENES).map((locKey) => {
            const item = REALITY_SCENES[locKey];
            const isActive = activeLocationId === locKey;
            return (
              <button
                key={locKey}
                onClick={() => handleWalkToLocation(locKey)}
                data-cursor-action="walk"
                data-cursor-label={`WALK TO ${item.name.split(' ')[0].toUpperCase()}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md ${
                  isActive
                    ? 'bg-emerald-600 text-white border border-emerald-400 shadow-emerald-900/40'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {locKey === 'captain-cook' && '🍗'}
                {locKey === 'olofa-palace' && '👑'}
                {locKey === 'owode-market' && '🏪'}
                {locKey === 'ijakadi-arena' && '🤼'}
                {locKey === 'avalon-hotel' && '🪩'}
                {locKey === 'fedpoly-mini' && '🎓'}
                {locKey === 'residential-quarters' && '🏡'}
                <span>{item.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Walking / Transit Live Animation Banner (When Walking along Street) */}
      {isTraveling ? (
        <div className="p-6 rounded-3xl bg-slate-950 border border-emerald-500/40 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
            <Footprints className="w-5 h-5 animate-bounce" />
            <span>Walking along Olofa Way towards {scene.name}...</span>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800 p-0.5">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${travelProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 font-mono">
            <span>Passing Popo Junction</span>
            <span>•</span>
            <span className="text-white font-bold">{travelProgress}% Reached</span>
            <span>•</span>
            <span>Approaching Destination</span>
          </div>
        </div>
      ) : (
        /* The Realistic Landmark Viewport (Front Facade or Interior) */
        <div className="space-y-4">
          {/* Main Visual Landmark Container */}
          <div
            onClick={handleStreetClick}
            data-cursor-action="walk"
            data-cursor-label="WALK HERE"
            className="relative w-full h-[380px] sm:h-[460px] rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-slate-950 flex flex-col justify-between p-4 sm:p-6 select-none cursor-crosshair group"
            style={{
              backgroundImage:
                viewMode === 'front'
                  ? `radial-gradient(circle at 50% 20%, ${scene.frontView.facadeColor}33, #090d16 80%)`
                  : `radial-gradient(circle at 50% 30%, ${scene.frontView.accentColor}22, #090d16 85%)`,
            }}
          >
            {/* Top View Badge & Mode Toggle */}
            <div className="flex items-center justify-between gap-2 z-10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700 text-xs font-black tracking-wide text-white shadow-xl flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{scene.locationTag}</span>
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-amber-950/80 border border-amber-700 text-[11px] font-bold text-amber-300">
                  {viewMode === 'front' ? 'STREET FRONT VIEW' : 'INSIDE INTERIOR VIEW'}
                </span>
              </div>

              {/* Enter / Exit Doorway Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleInterior();
                }}
                data-cursor-action="enter"
                data-cursor-label={viewMode === 'front' ? 'STEP INSIDE' : 'STEP OUTSIDE'}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-2xl flex items-center gap-2 border border-emerald-300/40 transition transform hover:scale-105"
              >
                <DoorOpen className="w-4 h-4 text-emerald-200" />
                <span>{viewMode === 'front' ? scene.frontView.doorLabel : 'Step Outside to Street'}</span>
              </button>
            </div>

            {/* ACTION NOTICE TOAST */}
            {actionNotice && (
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 rounded-2xl bg-slate-950/95 border border-emerald-500/60 text-emerald-300 font-bold text-xs shadow-2xl flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>{actionNotice}</span>
                </div>
              </div>
            )}

            {/* --- FRONT VIEW OF LANDMARK --- */}
            {viewMode === 'front' ? (
              <div className="flex-1 flex flex-col justify-center items-center text-center my-4 z-10 pointer-events-none">
                {/* Architectural Building Signboard */}
                <div
                  className="px-6 py-4 rounded-3xl border-2 shadow-2xl max-w-lg w-full backdrop-blur-md"
                  style={{
                    backgroundColor: `${scene.frontView.facadeColor}dd`,
                    borderColor: scene.frontView.accentColor,
                  }}
                >
                  <h1
                    className="text-xl sm:text-3xl font-black tracking-tight uppercase"
                    style={{ color: scene.frontView.accentColor }}
                  >
                    {scene.frontView.signText}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-100 font-medium mt-1">
                    {scene.frontView.subText}
                  </p>
                </div>

                {/* Building Entrance & Curb Features */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6">
                  {scene.frontView.curbFeatures.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-700 text-[11px] font-semibold text-slate-200 shadow-lg"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              /* --- INTERIOR VIEW (Inside Captain Cook or Location) --- */
              <div className="flex-1 flex flex-col justify-center items-center text-center my-2 z-10 pointer-events-none">
                <div className="p-4 sm:p-5 rounded-3xl bg-slate-950/90 border border-slate-700 max-w-lg w-full shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-bold pb-2 border-b border-slate-800">
                    <span>{scene.interior.counterName}</span>
                    <span className="text-slate-400">Attendant: {scene.interior.cashier}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-200 italic my-2">
                    "{scene.interior.greeting}"
                  </p>
                  <span className="text-[11px] font-semibold text-amber-400">
                    👇 Check the order menu or available activities below!
                  </span>
                </div>
              </div>
            )}

            {/* Bottom: The Street / Pavement & Controlled 3D Avatar */}
            <div className="relative w-full pt-4 border-t border-slate-800/80 flex items-center justify-between z-10">
              {/* Controlled Avatar on the Street */}
              <div
                className="absolute -top-14 transition-all duration-300 pointer-events-none flex flex-col items-center"
                style={{ left: `${avatarStreetPos}%`, transform: 'translateX(-50%)' }}
              >
                {/* Avatar Speech / Tag */}
                <span className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-bold text-emerald-400 border border-emerald-500 whitespace-nowrap mb-1 shadow-lg">
                  {player.name} (You)
                </span>
                {/* 3D Visual Avatar Representation */}
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 flex items-center justify-center text-xl shadow-2xl border-2 border-white animate-bounce">
                  {player.avatar || '🧔🏾'}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-medium">
                💡 Click anywhere along the ground to walk your avatar directly there!
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleInterior();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700"
                >
                  {viewMode === 'front' ? '🚪 Enter Inside' : '🚪 Walk Outside'}
                </button>
              </div>
            </div>
          </div>

          {/* Location Actions / Menu Order Counter */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
            {/* If Captain Cook: Show Full Food Menu to Order */}
            {activeLocationId === 'captain-cook' ? (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-red-400" />
                    <h3 className="text-sm font-extrabold uppercase text-white tracking-wide">
                      Captain Cook Fresh Menu & Counter Orders
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    Cash in Hand: ₦{player.cash.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {scene.interior.menu?.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-2 hover:border-red-500/50 transition"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-white">{item.name}</h4>
                          <span className="font-mono text-amber-400 font-extrabold text-xs">
                            ₦{item.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                          {item.desc}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] text-emerald-400 font-mono">
                          +{item.hunger || 0} Hunger • +{item.energy || 0} Energy
                        </span>
                        <button
                          onClick={() => handleOrderFood(item)}
                          data-cursor-action="order"
                          data-cursor-label={`ORDER ${item.name.toUpperCase()}`}
                          className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition"
                        >
                          Order & Eat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Other Landmark Actions (Olofa Palace, Owode Market, Ijakadi, Avalon, etc.) */
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-extrabold uppercase text-white tracking-wide">
                      {scene.name} — Real Activities & Interactions
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    Cash in Hand: ₦{player.cash.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2">
                  {scene.interior.actions?.map((act) => (
                    <div
                      key={act.id}
                      className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-700 transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-white">{act.name}</h4>
                          {act.cost && (
                            <span className="text-xs font-mono text-amber-400 font-bold">
                              (₦{act.cost.toLocaleString()})
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{act.desc}</p>
                      </div>

                      <button
                        onClick={() => handleSceneAction(act)}
                        data-cursor-action="order"
                        data-cursor-label="EXECUTE"
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition shrink-0"
                      >
                        {act.isMinigame ? 'Launch Minigame' : 'Perform Activity'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
