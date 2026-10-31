import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { UserCheck, Sparkles, RefreshCw } from 'lucide-react';

export const CharacterCreation = ({ onClose }) => {
  const { player, setPlayer, resetGame, addLog } = useGame();

  const [name, setName] = useState(player.name);
  const [gender, setGender] = useState(player.gender);
  const [ward, setWard] = useState(player.ward);
  const [avatar, setAvatar] = useState(player.avatar);

  const WARDS = [
    'Popo Quarters (Historic Cultural Ward)',
    'Adeleke (FedPoly Vibrant Student Quarter)',
    'GRA Offa (Prestigious Residential Enclave)',
    'Iyeru Okin (Commerce & Traditional Guilds)',
    'Ojoku Road (Agribusiness & Farmlands Gate)',
  ];

  const AVATARS = ['🧔🏾', '👩🏾', '🧑🏾', '👨🏾‍💼', '🧕🏾', '👑', '🧢', '🕶️'];

  const handleSave = () => {
    setPlayer((prev) => ({
      ...prev,
      name,
      gender,
      ward,
      avatar,
    }));
    addLog(`👤 Character identity updated: ${name} residing in ${ward}.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl text-white relative animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Character Persona & Ward</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-4 my-4 text-xs">
          {/* Avatar Picker */}
          <div>
            <label className="text-slate-400 font-medium block mb-2">Select Avatar</label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {AVATARS.map((av, idx) => (
                <button
                  key={idx}
                  onClick={() => setAvatar(av)}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl transition border ${
                    avatar === av
                      ? 'bg-emerald-600 border-white scale-110 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Name input */}
          <div>
            <label className="text-slate-400 font-medium block mb-1">Citizen Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
            />
          </div>

          {/* Ward selection */}
          <div>
            <label className="text-slate-400 font-medium block mb-1">Offa Ward / Neighborhood</label>
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            >
              {WARDS.map((w, idx) => (
                <option key={idx} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              if (confirm('Start a brand new life in Offa? All current progress will be reset.')) {
                resetGame();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-semibold border border-red-800/60 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Save</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
