import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { LOCATIONS } from '../data/locations';
import { CAREER_PATHS } from '../data/jobs';
import { FOOD_ITEMS, HOUSING_OPTIONS, POWER_EQUIPMENT, VEHICLES, CULTURAL_ITEMS } from '../data/items';
import { RANDOM_EVENTS } from '../data/events';
import { ACHIEVEMENTS } from '../data/achievements';
import { sound } from '../utils/audio';

const STORAGE_KEY = 'offa_life_savegame_v1';

const INITIAL_PLAYER = {
  name: 'Adeyemi',
  gender: 'male',
  ward: 'Popo Quarters',
  title: 'Omo Offa',
  avatar: '🧔🏾',
  cash: 12500,
  bankBalance: 25000,
  stats: {
    hunger: 80,
    energy: 90,
    health: 95,
    hygiene: 85,
    fun: 75,
    social: 50,
    respect: 15,
    education: 20,
    strength: 25,
  },
  currentLocationId: 'residential-quarters',
  housingId: 'room-popo',
  ownedHousing: ['room-popo'],
  vehicleId: 'trekking-shoes',
  ownedVehicles: ['trekking-shoes'],
  powerId: null,
  ownedPower: [],
  careerId: 'agri-business',
  careerTierIndex: 0,
  inventory: [
    { id: 'anamo-roasted', count: 2 },
    { id: 'chilled-zobo', count: 1 }
  ],
  farmLevel: 1,
  harvestCount: 0,
  wrestlingRecord: { wins: 0, losses: 0 },
  unlockedAchievements: [],
};

const INITIAL_WORLD = {
  day: 1,
  hour: 8,
  timeOfDay: 'Morning',
  weather: 'Sunny Offa Breeze',
  nepaPower: true,
  activeEvent: null,
  logs: [
    '🌅 Welcome to Offa Life! Day 1 in the proud city of "Ijakadi Loro Offa".',
    '💡 Tip: Explore Owode Market for sweet potato bargains, train at Ijakadi arena, and pay homage to the Olofa.'
  ],
};

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [player, setPlayer] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.player || INITIAL_PLAYER;
      }
    } catch {
      // fallback
    }
    return INITIAL_PLAYER;
  });

  const [world, setWorld] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.world || INITIAL_WORLD;
      }
    } catch {
      // fallback
    }
    return INITIAL_WORLD;
  });

  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [activeMinigame, setActiveMinigame] = useState(null); // 'market' | 'wrestling' | 'farm' | 'keke' | null

  // Save to localStorage whenever player or world changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ player, world }));
    } catch {
      // ignore
    }
  }, [player, world]);

  const addLog = useCallback((msg) => {
    setWorld((prev) => ({
      ...prev,
      logs: [msg, ...prev.logs.slice(0, 49)],
    }));
  }, []);

  // Time advancement helper
  const advanceTime = useCallback((hours = 1) => {
    setWorld((prev) => {
      let newHour = prev.hour + hours;
      let newDay = prev.day;
      if (newHour >= 24) {
        newDay += Math.floor(newHour / 24);
        newHour = newHour % 24;
      }

      let timeOfDay = 'Morning';
      if (newHour >= 12 && newHour < 17) timeOfDay = 'Afternoon';
      else if (newHour >= 17 && newHour < 21) timeOfDay = 'Evening';
      else if (newHour >= 21 || newHour < 6) timeOfDay = 'Night';

      // Random NEPA state toggle chance
      let nepa = prev.nepaPower;
      if (Math.random() < 0.25) {
        nepa = !nepa;
        if (!nepa) {
          sound.playNepaBuzz();
        }
      }

      // Check random event chance
      let newEvent = prev.activeEvent;
      if (!newEvent && Math.random() < 0.2) {
        const rand = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
        newEvent = rand;
      }

      return {
        ...prev,
        day: newDay,
        hour: newHour,
        timeOfDay,
        nepaPower: nepa,
        activeEvent: newEvent,
      };
    });

    // Slight stat decay over time
    setPlayer((prev) => {
      const newStats = {
        ...prev.stats,
        hunger: Math.max(0, prev.stats.hunger - hours * 3),
        energy: Math.max(0, prev.stats.energy - hours * 2),
        hygiene: Math.max(0, prev.stats.hygiene - hours * 2),
      };

      // Bank interest on midnight
      let newBank = prev.bankBalance;
      if (hours >= 6) {
        const dailyInterest = Math.floor(newBank * 0.001); // 0.1% daily interest
        if (dailyInterest > 0) {
          newBank += dailyInterest;
        }
      }

      return {
        ...prev,
        bankBalance: newBank,
        stats: newStats,
      };
    });
  }, []);

  // Location travel
  const travelTo = useCallback((locationId, transitMode = 'trek') => {
    sound.playClick();
    const loc = LOCATIONS.find((l) => l.id === locationId);
    if (!loc) return;

    let energyCost = 15;
    let cashCost = 0;
    let transitName = 'Trekking';

    if (transitMode === 'okada') {
      energyCost = 5;
      cashCost = 250;
      transitName = 'Bajaj Okada';
    } else if (transitMode === 'keke') {
      energyCost = 3;
      cashCost = 150;
      transitName = 'TVS Keke Marwa';
    } else if (transitMode === 'car') {
      energyCost = 2;
      cashCost = 500;
      transitName = 'Personal Vehicle';
    }

    if (player.cash < cashCost) {
      addLog(`❌ Cannot afford ${transitName} fare of ₦${cashCost.toLocaleString()}. Trekking instead!`);
      cashCost = 0;
      energyCost = 18;
    }

    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash - cashCost,
      stats: {
        ...prev.stats,
        energy: Math.max(0, prev.stats.energy - energyCost),
      },
      currentLocationId: locationId,
    }));

    advanceTime(1);
    addLog(`📍 Arrived at ${loc.name} (${loc.yorubaName}) via ${transitName}.`);
  }, [player.cash, advanceTime, addLog]);

  // Perform custom location action
  const performAction = useCallback((action) => {
    sound.playClick();

    if (action.isMinigame) {
      setActiveMinigame(action.isMinigame);
      return;
    }

    if (action.cost && player.cash < action.cost) {
      addLog(`❌ Not enough cash! You need ₦${action.cost.toLocaleString()}.`);
      return;
    }

    if (action.reqRespect && player.stats.respect < action.reqRespect) {
      addLog(`❌ Insufficient respect! The palace requires at least ${action.reqRespect} Respect.`);
      return;
    }

    if (action.reqEdu && player.stats.education < action.reqEdu) {
      addLog(`❌ Education requirement not met (${action.reqEdu}% needed). Attend classes at FedPoly first!`);
      return;
    }

    if (action.energyCost && player.stats.energy < action.energyCost) {
      addLog(`❌ You are too exhausted! Go to your quarters and sleep to recharge.`);
      return;
    }

    setPlayer((prev) => {
      const stats = { ...prev.stats };
      if (action.energyCost) stats.energy = Math.max(0, stats.energy - action.energyCost);
      if (action.energyGain) stats.energy = Math.min(100, stats.energy + action.energyGain);
      if (action.hungerCost) stats.hunger = Math.max(0, stats.hunger - action.hungerCost);
      if (action.hungerGain) stats.hunger = Math.min(100, stats.hunger + action.hungerGain);
      if (action.healthGain) stats.health = Math.min(100, stats.health + action.healthGain);
      if (action.hygieneGain) stats.hygiene = Math.min(100, stats.hygiene + action.hygieneGain);
      if (action.funGain) stats.fun = Math.min(100, stats.fun + action.funGain);
      if (action.funCost) stats.fun = Math.max(0, stats.fun - action.funCost);
      if (action.socialGain) stats.social = Math.min(100, stats.social + action.socialGain);
      if (action.respectGain) stats.respect = Math.min(100, stats.respect + action.respectGain);
      if (action.eduGain) stats.education = Math.min(100, stats.education + action.eduGain);
      if (action.strengthGain) stats.strength = Math.min(100, stats.strength + action.strengthGain);

      let cash = prev.cash;
      if (action.cost) cash -= action.cost;
      if (action.cashGain) cash += action.cashGain;

      let farmLevel = prev.farmLevel;
      if (action.farmLevelGain) farmLevel += action.farmLevelGain;

      return {
        ...prev,
        cash,
        farmLevel,
        stats,
      };
    });

    if (action.cashGain) {
      sound.playCash();
    } else if (action.id === 'greet-olofa' || action.id === 'seek-chieftaincy') {
      sound.playTalkingDrum();
    }

    advanceTime(action.energyCost && action.energyCost > 20 ? 2 : 1);
    addLog(`✨ Completed: ${action.name}. ${action.description}`);
  }, [player.cash, player.stats, advanceTime, addLog]);

  // Eat food
  const eatFood = useCallback((foodItem) => {
    sound.playClick();
    if (player.cash < foodItem.cost) {
      addLog(`❌ Cannot afford ${foodItem.name} (₦${foodItem.cost.toLocaleString()}).`);
      return;
    }

    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash - foodItem.cost,
      stats: {
        ...prev.stats,
        hunger: Math.min(100, prev.stats.hunger + (foodItem.hunger || 0)),
        energy: Math.min(100, prev.stats.energy + (foodItem.energy || 0)),
        fun: Math.min(100, prev.stats.fun + (foodItem.fun || 0)),
        hygiene: Math.min(100, prev.stats.hygiene + (foodItem.hygiene || 0)),
      },
    }));

    addLog(`😋 Ate ${foodItem.name}! Restored hunger and energy.`);
  }, [player.cash, addLog]);

  // Work daily career job
  const workCareerJob = useCallback(() => {
    sound.playClick();
    const career = CAREER_PATHS.find((c) => c.id === player.careerId) || CAREER_PATHS[0];
    const currentTier = career.tiers[player.careerTierIndex];

    if (player.stats.energy < currentTier.reqEnergy) {
      addLog(`❌ Too tired to work as ${currentTier.title}! Need at least ${currentTier.reqEnergy}% energy.`);
      return;
    }

    // Check promotion criteria
    let nextTierIndex = player.careerTierIndex;
    const nextTier = career.tiers[player.careerTierIndex + 1];
    let promoted = false;

    if (nextTier && player.stats.education >= nextTier.reqEdu && player.stats.respect >= nextTier.reqRespect) {
      nextTierIndex += 1;
      promoted = true;
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      sound.playVictory();
    }

    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash + currentTier.dailySalary,
      careerTierIndex: nextTierIndex,
      stats: {
        ...prev.stats,
        energy: Math.max(0, prev.stats.energy - currentTier.reqEnergy),
        hunger: Math.max(0, prev.stats.hunger - 15),
        respect: Math.min(100, prev.stats.respect + 2),
      },
    }));

    sound.playCash();
    advanceTime(4);

    if (promoted) {
      addLog(`🎉 PROMOTION! You are now "${nextTier.title}" earning ₦${nextTier.dailySalary.toLocaleString()}/day!`);
    } else {
      addLog(`💼 Worked shift as ${currentTier.title}. Earned ₦${currentTier.dailySalary.toLocaleString()} salary!`);
    }
  }, [player.careerId, player.careerTierIndex, player.stats, advanceTime, addLog]);

  // Purchase housing
  const buyHousing = useCallback((house) => {
    sound.playClick();
    const cost = house.purchasePrice || house.rentPerMonth;
    if (player.cash < cost) {
      addLog(`❌ Cannot afford ${house.name} (₦${cost.toLocaleString()}).`);
      return;
    }

    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash - cost,
      housingId: house.id,
      ownedHousing: prev.ownedHousing.includes(house.id) ? prev.ownedHousing : [...prev.ownedHousing, house.id],
      stats: {
        ...prev.stats,
        respect: Math.min(100, prev.stats.respect + 15),
      },
    }));

    confetti({ particleCount: 50, spread: 50 });
    sound.playVictory();
    addLog(`🏡 Congratulations! You moved into ${house.name}!`);
  }, [player.cash, addLog]);

  // Purchase vehicle
  const buyVehicle = useCallback((veh) => {
    sound.playClick();
    if (player.cash < veh.cost) {
      addLog(`❌ Cannot afford ${veh.name} (₦${veh.cost.toLocaleString()}).`);
      return;
    }

    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash - veh.cost,
      vehicleId: veh.id,
      ownedVehicles: prev.ownedVehicles.includes(veh.id) ? prev.ownedVehicles : [...prev.ownedVehicles, veh.id],
      stats: {
        ...prev.stats,
        respect: Math.min(100, prev.stats.respect + Math.floor(veh.comfortBonus / 2)),
      },
    }));

    confetti({ particleCount: 50, spread: 50 });
    sound.playVictory();
    addLog(`🚗 You bought ${veh.name}! Cruising around Offa in style.`);
  }, [player.cash, addLog]);

  // Purchase power generator/solar
  const buyPower = useCallback((power) => {
    sound.playClick();
    if (player.cash < power.cost) {
      addLog(`❌ Cannot afford ${power.name} (₦${power.cost.toLocaleString()}).`);
      return;
    }

    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash - power.cost,
      powerId: power.id,
      ownedPower: prev.ownedPower.includes(power.id) ? prev.ownedPower : [...prev.ownedPower, power.id],
      stats: {
        ...prev.stats,
        respect: Math.min(100, prev.stats.respect + 10),
      },
    }));

    confetti({ particleCount: 50, spread: 50 });
    sound.playVictory();
    addLog(`⚡ Installed ${power.name}! No more blackout troubles in Offa.`);
  }, [player.cash, addLog]);

  // Bank Deposit
  const bankDeposit = useCallback((amount) => {
    sound.playCash();
    if (amount <= 0 || player.cash < amount) {
      addLog(`❌ Invalid deposit amount.`);
      return;
    }
    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash - amount,
      bankBalance: prev.bankBalance + amount,
    }));
    addLog(`💳 Deposited ₦${amount.toLocaleString()} into your Olofa Microfinance Account.`);
  }, [player.cash, addLog]);

  // Bank Withdraw
  const bankWithdraw = useCallback((amount) => {
    sound.playCash();
    if (amount <= 0 || player.bankBalance < amount) {
      addLog(`❌ Insufficient bank funds.`);
      return;
    }
    setPlayer((prev) => ({
      ...prev,
      cash: prev.cash + amount,
      bankBalance: prev.bankBalance - amount,
    }));
    addLog(`💵 Withdrew ₦${amount.toLocaleString()} cash from ATM / POS agent.`);
  }, [player.bankBalance, addLog]);

  // Resolve random event choice
  const resolveEvent = useCallback((optionIndex) => {
    sound.playClick();
    if (!world.activeEvent) return;
    const option = world.activeEvent.options[optionIndex];
    if (!option) return;

    if (option.cost && player.cash < option.cost) {
      addLog(`❌ You do not have ₦${option.cost.toLocaleString()} for this choice.`);
      return;
    }

    setPlayer((prev) => {
      const stats = { ...prev.stats };
      let cash = prev.cash;
      if (option.cost) cash -= option.cost;
      if (option.effect) {
        if (option.effect.cash) cash += option.effect.cash;
        if (option.effect.hunger) stats.hunger = Math.max(0, Math.min(100, stats.hunger + option.effect.hunger));
        if (option.effect.energy) stats.energy = Math.max(0, Math.min(100, stats.energy + option.effect.energy));
        if (option.effect.health) stats.health = Math.max(0, Math.min(100, stats.health + option.effect.health));
        if (option.effect.hygiene) stats.hygiene = Math.max(0, Math.min(100, stats.hygiene + option.effect.hygiene));
        if (option.effect.fun) stats.fun = Math.max(0, Math.min(100, stats.fun + option.effect.fun));
        if (option.effect.social) stats.social = Math.max(0, Math.min(100, stats.social + option.effect.social));
        if (option.effect.respect) stats.respect = Math.max(0, Math.min(100, stats.respect + option.effect.respect));
        if (option.effect.edu) stats.education = Math.max(0, Math.min(100, stats.education + option.effect.edu));
      }
      return {
        ...prev,
        cash,
        stats,
      };
    });

    addLog(`📢 Event Result: ${option.result}`);
    setWorld((prev) => ({
      ...prev,
      activeEvent: null,
    }));
  }, [world.activeEvent, player.cash, addLog]);

  // Reset Game
  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPlayer(INITIAL_PLAYER);
    setWorld(INITIAL_WORLD);
    addLog('🔄 New life initialized in Offa!');
  }, [addLog]);

  return (
    <GameContext.Provider
      value={{
        player,
        setPlayer,
        world,
        setWorld,
        advanceTime,
        travelTo,
        performAction,
        eatFood,
        workCareerJob,
        buyHousing,
        buyVehicle,
        buyPower,
        bankDeposit,
        bankWithdraw,
        resolveEvent,
        activeMinigame,
        setActiveMinigame,
        isCharacterModalOpen,
        setIsCharacterModalOpen,
        addLog,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
