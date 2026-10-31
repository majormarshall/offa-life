// Authentic items, foodstuffs, properties, vehicles, and electronics in Offa Life

export const FOOD_ITEMS = [
  {
    id: 'anamo-roasted',
    name: 'Roasted Anamo Offa & Pepper Sauce',
    category: 'food',
    cost: 400,
    hunger: 30,
    energy: 20,
    fun: 10,
    icon: '🍠',
    description: 'Hot off the charcoal grill with seasoned palm oil pepper dip. Authentic Offa staple.'
  },
  {
    id: 'amala-ogunfe',
    name: 'Amala with Ewedu, Gbegiri & Ogunfe',
    category: 'food',
    cost: 1200,
    hunger: 55,
    energy: 35,
    fun: 25,
    icon: '🍲',
    description: 'Silky smooth yam flour amala topped with abula and tender goat meat.'
  },
  {
    id: 'iyan-egusi',
    name: 'Pounded Yam (Iyan) & Rich Egusi',
    category: 'food',
    cost: 1500,
    hunger: 65,
    energy: 40,
    fun: 20,
    icon: '🥘',
    description: 'Steaming hot mortar-pounded yam served with melon seed soup and bushmeat.'
  },
  {
    id: 'asaro-anamo',
    name: 'Sweet Potato Porridge (Asaro Anamo)',
    category: 'food',
    cost: 700,
    hunger: 40,
    energy: 25,
    fun: 15,
    icon: '🥣',
    description: 'Slow-simmered Offa sweet potatoes cooked with crayfish, onions, and dry fish.'
  },
  {
    id: 'ewa-aganyin',
    name: 'Ewa Aganyin & Agege Bread',
    category: 'food',
    cost: 600,
    hunger: 35,
    energy: 30,
    fun: 10,
    icon: '🍞',
    description: 'Mashed beans drenched in caramelized chili oil with pillowy hot bread.'
  },
  {
    id: 'chilled-zobo',
    name: 'Chilled Hibiscus Zobo with Ginger',
    category: 'drink',
    cost: 300,
    hunger: 10,
    energy: 15,
    fun: 20,
    hygiene: 10,
    icon: '🥤',
    description: 'Spiced with cloves and ginger, served ice cold to beat the Kwara afternoon heat.'
  },
  {
    id: 'pure-water-bag',
    name: 'Bag of Chilled Pure Water (20 Sachets)',
    category: 'drink',
    cost: 300,
    hunger: 5,
    energy: 10,
    hygiene: 15,
    icon: '💧',
    description: 'Lifesaver for hydration and quick face wash on hot days.'
  }
];

export const HOUSING_OPTIONS = [
  {
    id: 'room-popo',
    name: 'Single Room in Popo (Face-me-I-face-you)',
    rentPerMonth: 15000,
    purchasePrice: 0,
    comfort: 25,
    maxEnergyRecharge: 60,
    security: 30,
    locationName: 'Popo Quarters',
    powerType: 'nepa-only',
    description: 'Humble quarters with lively compound neighbors. NEPA power comes and goes.'
  },
  {
    id: 'hostel-adeleke',
    name: 'Self-Contained Hostel at Adeleke',
    rentPerMonth: 38000,
    purchasePrice: 0,
    comfort: 50,
    maxEnergyRecharge: 75,
    security: 55,
    locationName: 'Adeleke Student Area',
    powerType: 'gen-allowed',
    description: 'Self-contained with tiled floors and private bathroom. Popular among FedPoly students.'
  },
  {
    id: 'flat-olofaway',
    name: 'Modern 2-Bedroom Flat on Olofa Way',
    rentPerMonth: 85000,
    purchasePrice: 4500000,
    comfort: 70,
    maxEnergyRecharge: 85,
    security: 70,
    locationName: 'Olofa Way',
    powerType: 'gen-allowed',
    description: 'Spacious apartment near key commercial arteries. Borehole water and private balcony.'
  },
  {
    id: 'duplex-gra',
    name: '4-Bedroom Luxury Duplex in Offa GRA',
    rentPerMonth: 220000,
    purchasePrice: 18000000,
    comfort: 90,
    maxEnergyRecharge: 95,
    security: 90,
    locationName: 'GRA Offa',
    powerType: 'solar-ready',
    description: 'High-end residential enclave with private security guard, paved driveway, and perimeter fence.'
  },
  {
    id: 'palatial-mansion',
    name: 'Palatial Royal Estate near Aafin Olofa',
    rentPerMonth: 500000,
    purchasePrice: 65000000,
    comfort: 100,
    maxEnergyRecharge: 100,
    security: 100,
    locationName: 'Palace Enclave',
    powerType: 'solar-ready',
    description: 'Masterpiece mansion with Olympic swimming pool, 24/7 autonomous micro-grid, and panoramic view of the kingdom.'
  }
];

export const POWER_EQUIPMENT = [
  {
    id: 'tiger-gen',
    name: '"I Better Pass My Neighbor" Tiger Gen (950W)',
    cost: 65000,
    fuelCostPerDay: 1500,
    powerOutput: 'Basic lights & TV',
    noiseLevel: 'Loud',
    reliability: 65,
    description: 'Small iconic 2-stroke generator. Keeps your phone charged and ceiling fan spinning when NEPA strikes.'
  },
  {
    id: 'sumec-firman',
    name: 'Sumec Firman 3.5kVA Generator',
    cost: 260000,
    fuelCostPerDay: 4000,
    powerOutput: 'Powers Fridge & Deep Freezer',
    noiseLevel: 'Moderate',
    reliability: 85,
    description: 'Sturdy workhorse generator with key starter. Can run deep freezers and office setups.'
  },
  {
    id: 'solar-hybrid',
    name: '3.5kVA Hybrid Solar Inverter + Lithium Battery',
    cost: 1450000,
    fuelCostPerDay: 0,
    powerOutput: 'Silent 24/7 Power + AC Support',
    noiseLevel: 'Zero (Silent)',
    reliability: 98,
    description: 'Harness the generous Kwara sun! Zero fuel expense, instant automatic switchover.'
  },
  {
    id: 'industrial-solar',
    name: '10kVA Full Micro-Grid Solar Farm',
    cost: 4500000,
    fuelCostPerDay: 0,
    powerOutput: 'Powers Entire Duplex & Farm Equipment',
    noiseLevel: 'Zero',
    reliability: 100,
    description: 'The ultimate power freedom. Even when the national grid collapses for weeks, your empire glows.'
  }
];

export const VEHICLES = [
  {
    id: 'trekking-shoes',
    name: 'Sturdy Naija Trekking Sneakers',
    cost: 12000,
    speedMultiplier: 1.0,
    comfortBonus: 5,
    fuelCostPerTrip: 0,
    icon: '👟',
    description: 'Reliable footwear for leg-work across Popo and Owode market.'
  },
  {
    id: 'hero-bicycle',
    name: 'Heavy-Duty Mountain Bicycle',
    cost: 45000,
    speedMultiplier: 1.6,
    comfortBonus: 10,
    fuelCostPerTrip: 0,
    icon: '🚲',
    description: 'Pedal smoothly past traffic jams on Olofa Way with zero fuel costs.'
  },
  {
    id: 'bajaj-okada',
    name: 'Bajaj Boxer 100cc Motorcycle (Okada)',
    cost: 380000,
    speedMultiplier: 2.5,
    comfortBonus: 20,
    fuelCostPerTrip: 300,
    icon: '🏍️',
    description: 'The fastest way to zip between FedPoly Mini Campus and the Railway Station.'
  },
  {
    id: 'keke-tvs',
    name: 'TVS King Tricycle (Keke Napep)',
    cost: 1350000,
    speedMultiplier: 2.2,
    comfortBonus: 35,
    fuelCostPerTrip: 500,
    icon: '🛺',
    description: 'Spacious three-wheeler. Weatherproof rain curtains and sound system.'
  },
  {
    id: 'toyota-corolla',
    name: 'Toyota Corolla "First Lady" (Tokunbo)',
    cost: 4200000,
    speedMultiplier: 3.2,
    comfortBonus: 60,
    fuelCostPerTrip: 1200,
    icon: '🚗',
    description: 'The undisputed king of Nigerian roads. Ice-cold AC and bulletproof engine.'
  },
  {
    id: 'lexus-rx350',
    name: 'Lexus RX 350 Luxury SUV',
    cost: 16500000,
    speedMultiplier: 3.8,
    comfortBonus: 85,
    fuelCostPerTrip: 2500,
    icon: '🚙',
    description: 'High ground clearance for Kwara backroads, plush leather, and premium prestige.'
  },
  {
    id: 'mercedes-gwagon',
    name: 'Mercedes-Benz G63 AMG "G-Wagon"',
    cost: 85000000,
    speedMultiplier: 4.5,
    comfortBonus: 100,
    fuelCostPerTrip: 5000,
    icon: '🚘',
    description: 'The ultimate symbol of wealth and power. Palace gates swing wide open when you arrive.'
  }
];

export const CULTURAL_ITEMS = [
  {
    id: 'aso-oke-royal',
    name: 'Handwoven Offa Aso-Oke Agbada Set',
    cost: 85000,
    respectBonus: 25,
    socialBonus: 20,
    description: 'Woven with gold and deep royal indigo threads. Mandatory attire for VIP Owambes and Palace audiences.'
  },
  {
    id: 'gangan-drum',
    name: 'Handcrafted Talking Drum (Gangan)',
    cost: 35000,
    respectBonus: 15,
    funBonus: 20,
    description: 'Crafted by Offa artisans. Able to mimic human speech and recite royal panegyrics.'
  },
  {
    id: 'ijakadi-beads',
    name: 'Consecrated Ijakadi Champion Wrist Beads',
    cost: 50000,
    respectBonus: 30,
    strengthBonus: 15,
    description: 'Blessed by high priests at the wrestling arena. Grants confidence and stamina.'
  }
];
