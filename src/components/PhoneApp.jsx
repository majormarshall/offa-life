import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CAREER_PATHS } from '../data/jobs';
import { FOOD_ITEMS, HOUSING_OPTIONS, POWER_EQUIPMENT, VEHICLES } from '../data/items';
import { ACHIEVEMENTS } from '../data/achievements';
import {
  Smartphone,
  CreditCard,
  Briefcase,
  ShoppingBag,
  Home,
  Car,
  Zap,
  Award,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const PhoneApp = () => {
  const {
    player,
    workCareerJob,
    eatFood,
    buyHousing,
    buyVehicle,
    buyPower,
    bankDeposit,
    bankWithdraw,
    setPlayer,
  } = useGame();

  const [activeTab, setActiveTab] = useState('bank'); // 'bank' | 'career' | 'market' | 'property' | 'achievements'
  const [depositAmount, setDepositAmount] = useState(5000);
  const [withdrawAmount, setWithdrawAmount] = useState(5000);

  const currentCareer = CAREER_PATHS.find((c) => c.id === player.careerId) || CAREER_PATHS[0];
  const currentTier = currentCareer.tiers[player.careerTierIndex] || currentCareer.tiers[0];
  const nextTier = currentCareer.tiers[player.careerTierIndex + 1];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl text-white">
      {/* Smartphone Top Notch & Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-sm tracking-wide">OffaHub Smart Device</span>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
          5G • OlofaNet
        </span>
      </div>

      {/* App Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 my-1 border-b border-slate-800/80 no-scrollbar text-xs font-semibold">
        <button
          onClick={() => setActiveTab('bank')}
          className={`px-3 py-1.5 rounded-xl transition shrink-0 flex items-center gap-1.5 ${
            activeTab === 'bank'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-slate-950 text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>OlofaPay</span>
        </button>

        <button
          onClick={() => setActiveTab('career')}
          className={`px-3 py-1.5 rounded-xl transition shrink-0 flex items-center gap-1.5 ${
            activeTab === 'career'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-slate-950 text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Hustle & Career</span>
        </button>

        <button
          onClick={() => setActiveTab('market')}
          className={`px-3 py-1.5 rounded-xl transition shrink-0 flex items-center gap-1.5 ${
            activeTab === 'market'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-slate-950 text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Offa Eats</span>
        </button>

        <button
          onClick={() => setActiveTab('property')}
          className={`px-3 py-1.5 rounded-xl transition shrink-0 flex items-center gap-1.5 ${
            activeTab === 'property'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-slate-950 text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Estates & Tech</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-3 py-1.5 rounded-xl transition shrink-0 flex items-center gap-1.5 ${
            activeTab === 'achievements'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-slate-950 text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Trophies</span>
        </button>
      </div>

      {/* Tab 1: Bank (OlofaPay) */}
      {activeTab === 'bank' && (
        <div className="space-y-4 pt-2">
          {/* Virtual Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-tr from-emerald-900 via-teal-900 to-slate-900 border border-emerald-500/30 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-emerald-200">
              <span className="font-mono tracking-widest font-black text-sm">OLOFA PAY</span>
              <span>DEBIT CARD</span>
            </div>
            <div className="my-4">
              <span className="text-[11px] text-emerald-300 block">Savings Account Balance</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                ₦{player.bankBalance.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-emerald-300 font-mono">
              <span>{player.name.toUpperCase()}</span>
              <span>EXP: 10/30</span>
            </div>
          </div>

          {/* Quick Bank Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Deposit */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-emerald-400">
                <ArrowDownLeft className="w-4 h-4" />
                <span>Deposit Cash to Savings</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono text-white"
                />
                <button
                  onClick={() => bankDeposit(depositAmount)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs shrink-0"
                >
                  Deposit
                </button>
              </div>
            </div>

            {/* Withdraw */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-teal-400">
                <ArrowUpRight className="w-4 h-4" />
                <span>Withdraw Cash (ATM/POS)</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono text-white"
                />
                <button
                  onClick={() => bankWithdraw(withdrawAmount)}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 font-bold text-xs shrink-0"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Hustle & Career */}
      {activeTab === 'career' && (
        <div className="space-y-4 pt-2">
          {/* Current Job Banner */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase font-bold text-slate-400">Current Position</span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                ₦{currentTier.dailySalary.toLocaleString()} / Shift
              </span>
            </div>
            <h3 className="text-base font-bold text-white">{currentTier.title}</h3>
            <p className="text-xs text-slate-300 mt-1">{currentTier.description}</p>

            <button
              onClick={workCareerJob}
              className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Clock In & Work Daily Shift (-{currentTier.reqEnergy}% Energy)</span>
            </button>
          </div>

          {/* Promotion Requirements */}
          {nextTier && (
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Next Promotion: {nextTier.title}
                </span>
                <span className="text-slate-300 font-mono">₦{nextTier.dailySalary.toLocaleString()}/day</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Education Required:</span>
                  <span className={player.stats.education >= nextTier.reqEdu ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                    {player.stats.education}% / {nextTier.reqEdu}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Respect (Iyi) Required:</span>
                  <span className={player.stats.respect >= nextTier.reqRespect ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                    {player.stats.respect}% / {nextTier.reqRespect}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Switch Career Options */}
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-2">Switch Career Track:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CAREER_PATHS.map((career) => (
                <button
                  key={career.id}
                  onClick={() => {
                    setPlayer((prev) => ({
                      ...prev,
                      careerId: career.id,
                      careerTierIndex: 0,
                    }));
                  }}
                  className={`p-2.5 rounded-xl text-left border transition ${
                    player.careerId === career.id
                      ? 'bg-emerald-950/60 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <p className="font-bold text-xs">{career.title}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{career.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Offa Eats / Market */}
      {activeTab === 'market' && (
        <div className="space-y-2.5 pt-2">
          <p className="text-xs text-slate-400 mb-2">
            Authentic culinary favorites prepared across Owode Market and Adeleke food hubs:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FOOD_ITEMS.map((food) => (
              <div
                key={food.id}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{food.icon}</span>
                  <div>
                    <h4 className="font-bold text-xs text-white">{food.name}</h4>
                    <p className="text-[10px] text-emerald-400 font-mono">
                      +{(food.hunger || 0)} Hunger • +{(food.energy || 0)} Energy
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => eatFood(food)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs font-mono shrink-0 border border-slate-700"
                >
                  ₦{food.cost.toLocaleString()}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Estates & Tech */}
      {activeTab === 'property' && (
        <div className="space-y-4 pt-2">
          {/* Housing */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-emerald-400" /> Real Estate & Housing in Offa
            </h4>
            <div className="space-y-2">
              {HOUSING_OPTIONS.map((house) => {
                const isOwned = player.housingId === house.id;
                const cost = house.purchasePrice || house.rentPerMonth;
                return (
                  <div
                    key={house.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{house.name}</span>
                        {isOwned && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                            Current Home
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">{house.description}</p>
                    </div>
                    {!isOwned && (
                      <button
                        onClick={() => buyHousing(house)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs font-mono shrink-0"
                      >
                        ₦{cost.toLocaleString()}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vehicles */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-teal-400" /> Mobility & Vehicles
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {VEHICLES.map((veh) => {
                const isOwned = player.vehicleId === veh.id;
                return (
                  <div
                    key={veh.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{veh.icon}</span>
                      <div>
                        <div className="font-bold text-xs text-white">{veh.name}</div>
                        <div className="text-[10px] text-teal-400 font-medium">+{veh.comfortBonus} Comfort</div>
                      </div>
                    </div>
                    {!isOwned ? (
                      <button
                        onClick={() => buyVehicle(veh)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs font-mono shrink-0 border border-slate-700"
                      >
                        ₦{veh.cost.toLocaleString()}
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-bold">Active</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Power Equipment */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Generators & Solar Inverters
            </h4>
            <div className="space-y-2">
              {POWER_EQUIPMENT.map((power) => {
                const isOwned = player.powerId === power.id;
                return (
                  <div
                    key={power.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-xs text-white">{power.name}</div>
                      <div className="text-[10px] text-amber-400">{power.powerOutput}</div>
                    </div>
                    {!isOwned ? (
                      <button
                        onClick={() => buyPower(power)}
                        className="px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs font-mono shrink-0"
                      >
                        ₦{power.cost.toLocaleString()}
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-bold">Installed</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Achievements */}
      {activeTab === 'achievements' && (
        <div className="space-y-2.5 pt-2">
          {ACHIEVEMENTS.map((ach) => (
            <div
              key={ach.id}
              className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-2xl border border-slate-800 shrink-0">
                {ach.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-white">{ach.title}</h4>
                  <span className="text-[10px] text-amber-400 font-medium">{ach.reward}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{ach.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
