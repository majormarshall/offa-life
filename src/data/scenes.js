// Authentic Reality Scenes, Front Views, and Hotspots for Offa Life Locations

export const REALITY_SCENES = {
  'captain-cook': {
    id: 'captain-cook',
    name: 'Captain Cook Eatery & Bakery',
    yorubaName: 'Ilé Oúnjẹ Captain Cook',
    locationTag: 'Olofa Way, Offa',
    frontView: {
      title: 'Captain Cook Fast Food - Offa Branch Front Facade',
      facadeColor: '#b91c1c', // Iconic red
      accentColor: '#facc15', // Golden yellow
      signText: 'CAPTAIN COOK EATERY & BAKERY',
      subText: 'Fresh Pastries • Crispy Chicken • Rice Meals • Grills',
      bgGradient: 'from-amber-950/80 via-slate-900 to-slate-950',
      doorLabel: 'Step Inside Captain Cook',
      curbFeatures: ['Delivery Bikes Out Front', 'Glass Frontage', 'Illuminated Marquee Sign'],
    },
    interior: {
      counterName: 'Main Order Counter & Pastry Warmer',
      cashier: 'Blessing (Captain Cook Crew)',
      greeting: 'Welcome to Captain Cook Offa! What would you like to order today?',
      menu: [
        { id: 'cc-pie', name: 'Golden Beef Meat Pie', price: 900, hunger: 30, energy: 20, desc: 'Hot, flaky crust packed with seasoned minced beef and potatoes.' },
        { id: 'cc-chicken', name: 'Crispy Fried Chicken & Chips', price: 3200, hunger: 60, energy: 40, desc: 'Golden crunchy chicken thigh with seasoned potato fries and ketchup.' },
        { id: 'cc-jollof', name: 'Captain Special Jollof Rice & Beef', price: 2500, hunger: 55, energy: 35, desc: 'Smoky party-style jollof rice with fried plantain (dodo) and tender beef.' },
        { id: 'cc-icecream', name: 'Creamy Vanilla Swirl Ice Cream', price: 1200, hunger: 15, fun: 35, desc: 'Chilled soft-serve ice cream in a waffle cone to beat the heat.' },
        { id: 'cc-loaf', name: 'Captain Cook Jumbo Sliced Bread', price: 1500, hunger: 45, energy: 30, desc: 'Freshly baked soft buttery loaf direct from the bakery ovens.' }
      ],
      tables: ['Window Booth 1', 'Family Dining Table', 'Lounge Seating'],
    }
  },

  'olofa-palace': {
    id: 'olofa-palace',
    name: 'Ààfin Ọlọ́fà (Palace of the Olofa of Offa)',
    yorubaName: 'Ààfin Ọlọ́fà Ìjẹ̀bú / Popo',
    locationTag: 'Palace Way, Offa Kingdom',
    frontView: {
      title: 'Royal Gates & Grand Facade of the Olofa Palace',
      facadeColor: '#92400e',
      accentColor: '#fbbf24',
      signText: 'ÀÀFIN ỌLỌ́FÀ TI ILẸ̀ Ọ̀FÀ',
      subText: 'Seat of His Royal Majesty • Paramount Ruler of Offa Kingdom',
      bgGradient: 'from-amber-950/90 via-slate-900 to-slate-950',
      doorLabel: 'Enter Palace Courtyard',
      curbFeatures: ['Royal Guards in Traditional Attire', 'Royal Arched Portico', 'Carved Wooden Heritage Pillars'],
    },
    interior: {
      counterName: 'Royal Throne Room (Gbọ̀ngàn Ààfin)',
      cashier: 'Chief Ojomu (Palace Prime Minister)',
      greeting: 'Kábíyèsí! You stand before the court of the Olofa of Offa. State your mission with utmost respect.',
      actions: [
        { id: 'homage-prostrate', name: 'Pay Royal Homage (Ìdọ̀bálẹ̀)', cost: 500, respectGain: 20, desc: 'Prostrate flat on the palace carpet and receive the Olofa’s traditional blessings.' },
        { id: 'chieftaincy-petition', name: 'Petition for Offa Honorary Title', cost: 75000, reqRespect: 60, respectGain: 50, desc: 'Present your philanthropy and achievements for council endorsement.' },
        { id: 'palace-archives', name: 'Study Iwe Itan Offa with Court Scribes', cost: 0, funGain: 15, respectGain: 8, desc: 'Read the sacred oral and written history of Offa kingdom.' }
      ]
    }
  },

  'owode-market': {
    id: 'owode-market',
    name: 'Ọjà Òwódé (Owode Central Market)',
    yorubaName: 'Ọjà Òwódé Àárín Gbùngbùn',
    locationTag: 'Owode Market Square, Offa',
    frontView: {
      title: 'Grand Entrance & Gates of Owode Central Market',
      facadeColor: '#065f46',
      accentColor: '#34d399',
      signText: 'ỌJÀ ÒWÓDÉ CENTRAL TRADING HUB',
      subText: 'The Commercial Heart of Kwara South • Home of Anamo Offa',
      bgGradient: 'from-emerald-950/80 via-slate-900 to-slate-950',
      doorLabel: 'Enter Market Alleys & Stalls',
      curbFeatures: ['Bustling Produce Traders', 'Wheelbarrow Porters', 'Heaps of Fresh Sweet Potatoes'],
    },
    interior: {
      counterName: 'Mama Risi Sweet Potato & Provisions Depot',
      cashier: 'Mama Risi (Master Commodity Trader)',
      greeting: 'Customer daada! Oya come check dis fresh Anamo Offa from Ojoku road farm! Na pure sugar!',
      actions: [
        { id: 'eat-buka', name: 'Eat Hot Amala & Ogunfe at Buka', cost: 1200, hungerGain: 55, energyGain: 35, desc: 'Piping hot amala with gbegiri, ewedu, and tender goat meat.' },
        { id: 'buy-anamo-crate', name: 'Buy Wholesale Crate of Anamo Offa', cost: 4500, desc: 'Top grade sweet potatoes ready to resell or roast at home.' },
        { id: 'hustle-bargain', name: 'Engage in Owode Haggling Duel', isMinigame: 'market', desc: 'Test your bargaining negotiation tactics against Mama Risi.' }
      ]
    }
  },

  'ijakadi-arena': {
    id: 'ijakadi-arena',
    name: 'Pápá Ìjàkadì (Ijakadi Sand Wrestling Arena)',
    yorubaName: 'Pápá Ìjàkadì Lóro Ọ̀fà',
    locationTag: 'Ojude Oba Arena, Offa',
    frontView: {
      title: 'Grand Gate of the Ijakadi Martial Arena',
      facadeColor: '#7f1d1d',
      accentColor: '#f87171',
      signText: 'PÁPÁ ÌJÀKADÌ LÓRO Ọ̀FÀ',
      subText: 'The Sacred Martial Wrestling Grounds of Offa Champions',
      bgGradient: 'from-red-950/80 via-slate-900 to-slate-950',
      doorLabel: 'Step into the Sand Ring',
      curbFeatures: ['Talking Drum Rhythms in Air', 'Grandstand Spectators', 'Sand Proving Ring'],
    },
    interior: {
      counterName: 'Sand Arena Center & Referee Station',
      cashier: 'Alagba Akin (Chief Arena Referee)',
      greeting: 'Ìjàkadì Lóro Ọ̀fà! Only brave warriors step onto this sacred red sand! Are you ready to spar?',
      actions: [
        { id: 'spar-wrestler', name: 'Challenge Arena Fighter (3D Combat)', isMinigame: 'wrestling', desc: 'Face off against town champions with leg sweeps and body locks.' },
        { id: 'gym-train', name: 'Condition Body with Sandbags & Stone Kettles', cost: 500, energyCost: 20, strengthGain: 10, desc: 'Build raw physical stamina and wrestling power.' }
      ]
    }
  },

  'avalon-hotel': {
    id: 'avalon-hotel',
    name: 'Avalon Hotel & VIP Nightclub',
    yorubaName: 'Ilé-ìtura & Club Avalon',
    locationTag: 'GRA Extension, Offa',
    frontView: {
      title: 'Modern Luxury Facade of Avalon Hotel & Club',
      facadeColor: '#581c87',
      accentColor: '#c084fc',
      signText: 'AVALON HOTEL & VIP NIGHTCLUB',
      subText: 'Luxury Suites • Swimming Pool • Neon Dancefloor • Executive Lounge',
      bgGradient: 'from-purple-950/80 via-slate-900 to-slate-950',
      doorLabel: 'Enter VIP Club & Poolside',
      curbFeatures: ['Neon Spotlights', 'Valet Parking', 'Luxury Swimming Pool'],
    },
    interior: {
      counterName: 'VIP Club Bar & DJ Turntable',
      cashier: 'DJ Tunez & Mixologist Ken',
      greeting: 'Welcome to Avalon VIP! The bass is pumping, Afrobeats on blast. What can I get you?',
      actions: [
        { id: 'club-dance-action', name: 'Hit the LED Dance Floor (Afrobeats / Amapiano)', funGain: 50, socialGain: 25, desc: 'Drop energetic dance moves with VIP guests under neon strobe lights.' },
        { id: 'vip-drinks-action', name: 'Pop Bottle of VIP Champagne', cost: 4500, funGain: 40, energyGain: 25, desc: 'Celebrate town success with premium chilled drinks.' },
        { id: 'poolside-swim', name: 'Swim in the Crystal Blue Pool', cost: 2000, funGain: 35, hygieneGain: 30, desc: 'Cool down in the sparkling pool water under palm trees.' }
      ]
    }
  },

  'fedpoly-mini': {
    id: 'fedpoly-mini',
    name: 'Federal Polytechnic Offa (Mini Campus)',
    yorubaName: 'Ilé-ẹ̀kọ́ Gbígbé FedPoly',
    locationTag: 'Mini Campus Main Gate, Offa',
    frontView: {
      title: 'Main Entrance Archway of FedPoly Mini Campus',
      facadeColor: '#1e3a8a',
      accentColor: '#60a5fa',
      signText: 'FEDERAL POLYTECHNIC OFFA',
      subText: 'Mini Campus Gate • Citadel of Technological & Business Excellence',
      bgGradient: 'from-blue-950/80 via-slate-900 to-slate-950',
      doorLabel: 'Pass Security & Enter Campus',
      curbFeatures: ['Students with Backpacks', 'Campus Security Gate', 'Faculty Notice Boards'],
    },
    interior: {
      counterName: 'Campus Center & Innovation Hub',
      cashier: 'Engr. Adebayo (Faculty Lead)',
      greeting: 'Good day! FedPoly Offa is shaping the next generation of engineers and entrepreneurs. Welcome!',
      actions: [
        { id: 'attend-class', name: 'Attend Lecture in Engineering Hall', cost: 0, energyCost: 20, eduGain: 20, desc: 'Learn practical technology, coding, and business management skills.' },
        { id: 'tech-meetup', name: 'Join FedPoly Software & Robotics Hub', cost: 500, eduGain: 25, respectGain: 6, desc: 'Collaborate with student innovators on renewable energy and fintech.' }
      ]
    }
  },

  'residential-quarters': {
    id: 'residential-quarters',
    name: 'Popo Quarters (Your Home)',
    yorubaName: 'Ilé Rẹ ní Popo',
    locationTag: 'Popo Street, Offa',
    frontView: {
      title: 'Your Private Residence in Popo Quarters',
      facadeColor: '#134e4a',
      accentColor: '#2dd4bf',
      signText: 'YOUR RESIDENTIAL QUARTERS',
      subText: 'Popo Quarters • Safehouse, Bed, Tiger Generator & Solar Setup',
      bgGradient: 'from-teal-950/80 via-slate-900 to-slate-950',
      doorLabel: 'Unlock Front Door & Step Inside',
      curbFeatures: ['Tiger Generator Humming Outside', 'Compound Neem Tree', 'Water Borehole Tap'],
    },
    interior: {
      counterName: 'Living Room & Bedroom Hub',
      cashier: 'Your Personal Quarters',
      greeting: 'Home sweet home. Peaceful retreat from the energetic bustle of Offa streets.',
      actions: [
        { id: 'sleep-full', name: 'Sleep & Fully Recharge Energy', energyGain: 85, healthGain: 20, desc: 'Rest your body peacefully and wake up revitalized for the hustle.' },
        { id: 'manage-power', name: 'Inspect Power (Tiger Gen / Solar Inverter)', desc: 'Ensure your house has electricity when NEPA takes light.' },
        { id: 'cook-potatoes', name: 'Cook Sweet Potato Porridge (Asaro Anamo)', cost: 400, hungerGain: 45, energyGain: 20, desc: 'Boil fresh sweet potatoes with palm oil and dried fish in your kitchen.' }
      ]
    }
  }
};
