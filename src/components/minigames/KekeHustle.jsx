import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Compass, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';

export const KekeHustle = ({ onClose }) => {
  const { player, setPlayer, addLog } = useGame();

  const [distanceLeft, setDistanceLeft] = useState(10); // 10 stops
  const [faresCollected, setFaresCollected] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [streetMsg, setStreetMsg] = useState('🚦 Cruising past Offa Railway crossing. Passengers flagging you down!');
  const [currentHazard, setCurrentHazard] = useState(null); // 'pothole' | 'checkpoint' | 'passenger'
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    generateStep();
  }, []);

  const generateStep = () => {
    const hazards = ['pothole', 'checkpoint', 'passenger', 'passenger'];
    const chosen = hazards[Math.floor(Math.random() * hazards.length)];
    setCurrentHazard(chosen);

    if (chosen === 'pothole') {
      setStreetMsg('⚠️ Giant pothole ahead near Adeleke Junction! Steer carefully!');
    } else if (chosen === 'checkpoint') {
      setStreetMsg('👮 NURTW Agbero / Ticket Officer demanding ₦200 union toll!');
    } else {
      setStreetMsg('🙋 Market women with fresh sweet potato baskets waving for a ride to Popo!');
    }
  };

  const handleAction = (choice) => {
    sound.playClick();
    if (isDone) return;

    let newFuel = Math.max(0, fuel - 10);
    setFuel(newFuel);

    if (currentHazard === 'pothole') {
      if (choice === 'swerve') {
        sound.playVictory();
        setStreetMsg('Smooth swerve! Avoided damaging your shock absorbers.');
      } else {
        sound.playWrestlingHit();
        newFuel = Math.max(0, newFuel - 10);
        setFuel(newFuel);
        setStreetMsg('Ouch! Your Keke slammed into the pothole. Fuel jarred!');
      }
    } else if (currentHazard === 'checkpoint') {
      if (choice === 'pay') {
        sound.playCash();
        setStreetMsg('Paid ₦200 ticket. Officer hails you: "Chairman, oya pass!"');
      } else {
        setStreetMsg('You showed your official union badge and drove through peacefully!');
      }
    } else if (currentHazard === 'passenger') {
      sound.playCash();
      const fare = 1500;
      setFaresCollected((prev) => prev + fare);
      setStreetMsg(`Picked up passengers! Collected ₦${fare.toLocaleString()} in fares.`);
    }

    const nextDist = distanceLeft - 1;
    setDistanceLeft(nextDist);

    if (nextDist <= 0 || newFuel <= 0) {
      setIsDone(true);
      confetti({ particleCount: 60, spread: 60 });
      sound.playVictory();
      setPlayer((prev) => ({
        ...prev,
        cash: prev.cash + faresCollected,
        stats: {
          ...prev.stats,
          energy: Math.max(0, prev.stats.energy - 15),
          respect: Math.min(100, prev.stats.respect + 6),
          fun: Math.min(100, prev.stats.fun + 10),
        },
      }));
      addLog(`🛺 Keke Shift Complete! Safely completed route across Offa and banked ₦${faresCollected.toLocaleString()}!`);
    } else {
      setTimeout(() => {
        generateStep();
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-teal-600/40 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl text-white relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xl border border-teal-500/30">
              🛺
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Offa Keke Express Rush</h2>
              <p className="text-xs text-teal-400 font-medium">Navigating Popo, Adeleke & Olofa Way</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Meters */}
        <div className="my-4 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Route Distance Remaining</span>
            <span className="text-xl font-black text-amber-400 font-mono">{distanceLeft} Stops</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Fares Collected</span>
            <span className="text-xl font-black text-emerald-400 font-mono">
              ₦{faresCollected.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Street Event Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-teal-900/50 text-slate-200 text-sm font-medium mb-4 flex items-center gap-3">
          <div className="text-2xl">
            {currentHazard === 'pothole' ? '🕳️' : currentHazard === 'checkpoint' ? '👮' : '👥'}
          </div>
          <p>{streetMsg}</p>
        </div>

        {/* Choices */}
        {!isDone ? (
          <div className="grid grid-cols-2 gap-2">
            {currentHazard === 'pothole' && (
              <>
                <button
                  onClick={() => handleAction('swerve')}
                  className="p-3 rounded-xl bg-teal-800 hover:bg-teal-700 font-bold text-xs"
                >
                  ↪️ Swerve Right
                </button>
                <button
                  onClick={() => handleAction('brake')}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs"
                >
                  🛑 Hard Brake
                </button>
              </>
            )}
            {currentHazard === 'checkpoint' && (
              <>
                <button
                  onClick={() => handleAction('pay')}
                  className="p-3 rounded-xl bg-amber-800 hover:bg-amber-700 font-bold text-xs"
                >
                  💵 Pay ₦200 Ticket
                </button>
                <button
                  onClick={() => handleAction('badge')}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs"
                >
                  💳 Flash Union Card
                </button>
              </>
            )}
            {currentHazard === 'passenger' && (
              <>
                <button
                  onClick={() => handleAction('pickup')}
                  className="p-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 font-bold text-xs col-span-2"
                >
                  🙋 Stop & Pick Up Passengers (Earn Fare)
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-950 text-center border border-slate-800">
            <h3 className="text-base font-bold text-emerald-400">Shift Completed!</h3>
            <p className="text-xs text-slate-300 mt-1">
              You parked your Keke and pocketed ₦{faresCollected.toLocaleString()}.
            </p>
            <button
              onClick={onClose}
              className="mt-3 px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 font-bold text-xs"
            >
              Finish Shift
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
