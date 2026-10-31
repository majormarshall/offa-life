import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { ShoppingBag, HeartHandshake, AlertCircle, ArrowLeft } from 'lucide-react';

export const MarketHaggling = ({ onClose }) => {
  const { player, setPlayer, addLog } = useGame();

  const ORIGINAL_PRICE = 42000;
  const MIN_ACCEPTABLE = 24000;

  const [currentOffer, setCurrentOffer] = useState(20000);
  const [vendorPatience, setVendorPatience] = useState(100);
  const [vendorPrice, setVendorPrice] = useState(ORIGINAL_PRICE);
  const [dialogue, setDialogue] = useState(
    'Mama Risi: "Ah my pikin! Dis sweet potato na direct from Ojoku road farm, pure honey! ₦42,000 last."'
  );
  const [isDone, setIsDone] = useState(false);
  const [won, setWon] = useState(false);

  const TACTICS = [
    {
      title: 'Flatter Mama Risi ("Mama, e ku ewa!")',
      patienceChange: +15,
      priceDrop: 3000,
      dialogue: 'Mama Risi smiles: "Oya, because you respect elders, I drop am to ₦{price}."'
    },
    {
      title: 'Naija Loyalty ("I be your regular customer naw!")',
      patienceChange: +5,
      priceDrop: 4000,
      dialogue: 'Mama Risi nods: "True talk, I remember your face. Take ₦{price}."'
    },
    {
      title: 'Threaten to Walk Away ("Let me check Baba Sikiru stall")',
      patienceChange: -25,
      priceDrop: 6500,
      dialogue: 'Mama Risi shouts: "Wait! No dey rush! Because of God, pay ₦{price}!"'
    },
    {
      title: 'Make Firm Cash Offer',
      patienceChange: -10,
      priceDrop: 2000,
      dialogue: 'Mama Risi weighs the cash: "Hmm, money speaks. ₦{price}."'
    }
  ];

  const handleTactic = (tactic) => {
    sound.playClick();
    if (isDone) return;

    const newPatience = Math.max(0, vendorPatience + tactic.patienceChange);
    const newPrice = Math.max(MIN_ACCEPTABLE, vendorPrice - tactic.priceDrop);

    setVendorPatience(newPatience);
    setVendorPrice(newPrice);
    setDialogue(tactic.dialogue.replace('{price}', newPrice.toLocaleString()));

    if (newPatience <= 0) {
      setIsDone(true);
      setWon(false);
      setDialogue('Mama Risi: "Comot my front! You dey waste my time, go buy for supermarket!"');
      addLog('❌ Haggling failed at Owode Market. Mama Risi ran out of patience!');
    }
  };

  const handleAcceptDeal = () => {
    sound.playClick();
    if (player.cash < vendorPrice) {
      setDialogue('Mama Risi: "You don’t even have the money? Ehn?! Don’t whine me o!"');
      return;
    }

    const savedAmount = ORIGINAL_PRICE - vendorPrice;
    const profitCash = 18000; // resell value profit

    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash - vendorPrice + (vendorPrice + profitCash),
      stats: {
        ...prev.stats,
        respect: Math.min(100, prev.stats.respect + 6),
        fun: Math.min(100, prev.stats.fun + 15),
      },
    }));

    setIsDone(true);
    setWon(true);
    confetti({ particleCount: 60, spread: 60 });
    sound.playCash();
    setDialogue(
      `Mama Risi shakes your hand: "Deal sealed! You be master bargainer!" You saved ₦${savedAmount.toLocaleString()} and made ₦${profitCash.toLocaleString()} profit!`
    );
    addLog(`💰 Owode Market Victory! Successfully bought 3 bags of Anamo Offa at ₦${vendorPrice.toLocaleString()} and turned a quick ₦${profitCash.toLocaleString()} profit!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl text-white relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl border border-amber-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Owode Market Haggling Minigame</h2>
              <p className="text-xs text-slate-400">Sweet Potato (Anamo) Wholesale Negotiation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Vendor Status & Patience */}
        <div className="my-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Mama Risi's Patience:</span>
            <span
              className={`font-mono font-bold ${
                vendorPatience > 50 ? 'text-emerald-400' : vendorPatience > 20 ? 'text-amber-400' : 'text-red-400'
              }`}
            >
              {vendorPatience}%
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                vendorPatience > 50 ? 'bg-emerald-500' : vendorPatience > 20 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${vendorPatience}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Original Asking Price</span>
              <span className="line-through text-slate-500 font-mono">₦{ORIGINAL_PRICE.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-emerald-400 font-bold block text-[11px]">Current Offer</span>
              <span className="text-xl font-extrabold text-amber-400 font-mono">
                ₦{vendorPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Speech Dialogue Bubble */}
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/40 text-amber-200 text-sm font-medium italic mb-4">
          {dialogue}
        </div>

        {/* Tactics Grid */}
        {!isDone ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {TACTICS.map((tactic, idx) => (
              <button
                key={idx}
                onClick={() => handleTactic(tactic)}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs font-semibold text-slate-200 transition hover:border-amber-500/50"
              >
                {tactic.title}
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-950 text-center mb-4 border border-slate-800">
            <p className="text-sm font-bold text-white mb-2">Negotiation Finished</p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Return to Owode Market
            </button>
          </div>
        )}

        {/* Action Button: Seal the Deal */}
        {!isDone && (
          <button
            onClick={handleAcceptDeal}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Agree & Pay ₦{vendorPrice.toLocaleString()} (Lock in Profit)</span>
          </button>
        )}
      </div>
    </div>
  );
};
