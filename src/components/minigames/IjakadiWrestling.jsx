import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Flame, Shield, Trophy, Activity, RotateCcw } from 'lucide-react';

export const IjakadiWrestling = ({ onClose }) => {
  const { player, setPlayer, addLog } = useGame();

  const [playerStamina, setPlayerStamina] = useState(100);
  const [playerBalance, setPlayerBalance] = useState(100);

  const [oppName] = useState('Gbadegesin of Popo');
  const [oppStamina, setOppStamina] = useState(100);
  const [oppBalance, setOppBalance] = useState(100);

  const [roundLog, setRoundLog] = useState([
    '🥁 Talking drums beat a fierce rhythm: "Ìjàkadì Lóro Ọ̀fà! Gbe body e!"',
    'Crowd roars as you and Gbadegesin circle the sacred sand arena.'
  ]);
  const [isMatchOver, setIsMatchOver] = useState(false);
  const [winner, setWinner] = useState(null); // 'player' | 'opponent'

  const executeMove = (moveType) => {
    sound.playWrestlingHit();
    if (isMatchOver) return;

    let pStamDmg = 0;
    let pBalDmg = 0;
    let oStamDmg = 0;
    let oBalDmg = 0;
    let logMsg = '';

    // Opponent random choice: 'aggressive' | 'defensive' | 'counter'
    const oppChoices = ['aggressive', 'defensive', 'counter'];
    const oppChoice = oppChoices[Math.floor(Math.random() * oppChoices.length)];

    if (moveType === 'sweep') {
      // Leg sweep
      if (oppChoice === 'counter') {
        pBalDmg = 30;
        logMsg = 'You attempted a swift leg sweep, but Gbadegesin anticipated and countered your balance!';
      } else {
        oBalDmg = 40;
        oStamDmg = 15;
        pStamDmg = 15;
        logMsg = '⚡ Fá ẹsẹ̀! Your leg sweep caught Gbadegesin clean! He stumbles in the sand!';
      }
    } else if (moveType === 'grapple') {
      // Bear hug grapple
      if (oppChoice === 'aggressive') {
        pStamDmg = 25;
        oStamDmg = 25;
        logMsg = 'You both locked into a fierce chest-to-chest grapple! Muscles straining!';
      } else {
        oBalDmg = 25;
        oStamDmg = 30;
        pStamDmg = 15;
        logMsg = 'You trapped him in a deep traditional body lock, draining his breath!';
      }
    } else if (moveType === 'dodge') {
      // Dodge & Evade
      if (oppChoice === 'aggressive') {
        oBalDmg = 35;
        pStamDmg = 5;
        logMsg = '💨 Yẹra! You pivoted gracefully out of the way! Gbadegesin lunged into empty air!';
      } else {
        pStamDmg = 5;
        logMsg = 'You kept your distance and regained your footing.';
      }
    } else if (moveType === 'slam') {
      // High-risk Power Slam
      if (playerBalance < 50) {
        pBalDmg = 40;
        pStamDmg = 30;
        logMsg = 'You tried to hoist Gbadegesin while off-balance and collapsed under his weight!';
      } else {
        oBalDmg = 65;
        oStamDmg = 35;
        pStamDmg = 30;
        logMsg = '💥 GBÉ SỌLẸ̀! You lifted Gbadegesin high into the air and slammed him into the sand ring!';
      }
    }

    const nextPStam = Math.max(0, playerStamina - pStamDmg);
    const nextPBal = Math.max(0, playerBalance - pBalDmg);
    const nextOStam = Math.max(0, oppStamina - oStamDmg);
    const nextOBal = Math.max(0, oppBalance - oBalDmg);

    setPlayerStamina(nextPStam);
    setPlayerBalance(nextPBal);
    setOppStamina(nextOStam);
    setOppBalance(nextOBal);

    setRoundLog((prev) => [logMsg, ...prev.slice(0, 3)]);

    // Check knockout or takedown
    if (nextOBal <= 0 || nextOStam <= 0) {
      setIsMatchOver(true);
      setWinner('player');
      confetti({ particleCount: 90, spread: 80 });
      sound.playVictory();
      const prizeCash = 35000;
      setPlayer((prev) => ({
        ...prev,
        cash: prev.cash + prizeCash,
        stats: {
          ...prev.stats,
          respect: Math.min(100, prev.stats.respect + 20),
          fun: Math.min(100, prev.stats.fun + 25),
          strength: Math.min(100, prev.stats.strength + 10),
        },
        wrestlingRecord: {
          ...prev.wrestlingRecord,
          wins: prev.wrestlingRecord.wins + 1,
        },
      }));
      addLog(`🏆 GLORIOUS VICTORY! You conquered ${oppName} at the Ijakadi Arena! Won ₦${prizeCash.toLocaleString()} and 20 Respect!`);
    } else if (nextPBal <= 0 || nextPStam <= 0) {
      setIsMatchOver(true);
      setWinner('opponent');
      setPlayer((prev) => ({
        ...prev,
        wrestlingRecord: {
          ...prev.wrestlingRecord,
          losses: prev.wrestlingRecord.losses + 1,
        },
        stats: {
          ...prev.stats,
          energy: Math.max(0, prev.stats.energy - 25),
        },
      }));
      addLog(`💔 Defeated at the Ijakadi sand ring. Train harder at the arena gym and try again!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-amber-600/40 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl text-white relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl border border-amber-500/30">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Ìjàkadì Lóro Ọ̀fà Championship</h2>
              <p className="text-xs text-amber-400 font-medium">Sacred Sand Wrestling Proving Ground</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Combatants Arena Meters */}
        <div className="my-4 grid grid-cols-2 gap-3">
          {/* Player Corner */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-900/50 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400">{player.name} (You)</span>
              <span className="text-slate-400 text-[10px]">Stamina: {playerStamina}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${playerStamina}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Balance</span>
              <span className="font-mono text-emerald-300 font-bold">{playerBalance}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div
                className="bg-teal-400 h-full rounded-full transition-all"
                style={{ width: `${playerBalance}%` }}
              />
            </div>
          </div>

          {/* Opponent Corner */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-red-900/50 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-red-400">{oppName}</span>
              <span className="text-slate-400 text-[10px]">Stamina: {oppStamina}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-red-500 h-full rounded-full transition-all"
                style={{ width: `${oppStamina}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Balance</span>
              <span className="font-mono text-red-300 font-bold">{oppBalance}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{ width: `${oppBalance}%` }}
              />
            </div>
          </div>
        </div>

        {/* Live Arena Commentary Feed */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs flex flex-col gap-1.5 min-h-[90px] mb-4">
          {roundLog.map((log, idx) => (
            <p key={idx} className={idx === 0 ? 'text-amber-300 font-semibold' : 'text-slate-400'}>
              {log}
            </p>
          ))}
        </div>

        {/* Action Buttons */}
        {!isMatchOver ? (
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => executeMove('sweep')}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition hover:border-amber-400/50"
            >
              <div className="font-bold text-xs text-white">🦵 Leg Sweep (Fá ẹsẹ̀)</div>
              <div className="text-[10px] text-slate-400">Target opponent balance</div>
            </button>
            <button
              onClick={() => executeMove('grapple')}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition hover:border-amber-400/50"
            >
              <div className="font-bold text-xs text-white">🤼 Bear Grapple (Gbá mọ́lẹ̀)</div>
              <div className="text-[10px] text-slate-400">Drain opponent stamina</div>
            </button>
            <button
              onClick={() => executeMove('dodge')}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition hover:border-amber-400/50"
            >
              <div className="font-bold text-xs text-white">💨 Dodge & Evade (Yẹra)</div>
              <div className="text-[10px] text-slate-400">Regain posture, evade strikes</div>
            </button>
            <button
              onClick={() => executeMove('slam')}
              className="p-3 rounded-xl bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-left transition text-white"
            >
              <div className="font-bold text-xs text-white">💥 Power Slam (Gbé sọlẹ̀)</div>
              <div className="text-[10px] text-amber-200">Decisive high-damage throw</div>
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-950 text-center border border-slate-800 mb-2">
            {winner === 'player' ? (
              <div>
                <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-2 animate-bounce" />
                <h3 className="text-base font-bold text-amber-300">VICTORY FOR OFFA!</h3>
                <p className="text-xs text-slate-300 mt-1">
                  You proved why wrestling is the heart and blood of Offa!
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-base font-bold text-red-400">TOUCHDOWN DEFEAT</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {oppName} got the upper hand this time. Rest up and challenge again!
                </p>
              </div>
            )}
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Leave Arena
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
