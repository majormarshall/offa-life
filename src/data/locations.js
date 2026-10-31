// Authentic landmarks and geographic coordinates in Offa, Kwara State, Nigeria
// Coordinates centered around 8.1393° N, 4.7174° E

export const OFFA_CENTER = [8.1402, 4.7185];

export const LOCATIONS = [
  {
    id: 'olofa-palace',
    name: 'Palace of the Olofa of Offa',
    yorubaName: 'Ààfin Ọlọ́fà',
    category: 'culture',
    coordinates: [8.1465, 4.7196],
    tagline: 'Seat of the Royal Kingdom & Traditional Ruler',
    description: 'The historic palace of the paramount ruler of Offa Kingdom. Home to the royal court, ancestral artifacts, council of high chiefs, and the spiritual guardian of the town\'s proud heritage "Ijakadi Loro Offa".',
    amenities: ['Royal Audience', 'Chieftaincy Honours', 'Palace Library', 'Blessing Ceremony'],
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    availableActions: [
      { id: 'greet-olofa', name: 'Pay Homage to the Olofa', energyCost: 10, cost: 500, respectGain: 8, funGain: 5, description: 'Offer traditional royal greetings (Kábíyèsí!) and receive royal blessings.' },
      { id: 'seek-chieftaincy', name: 'Petition for Chieftaincy Title', energyCost: 25, cost: 50000, respectGain: 40, reqRespect: 60, description: 'Present your community achievements to the royal court for honorary title consideration.' },
      { id: 'palace-history', name: 'Study Palace Archives & Iwe Itan Offa', energyCost: 15, cost: 0, funGain: 10, respectGain: 4, description: 'Learn the ancient origins of Offa and the lineage of past Olofas.' }
    ]
  },
  {
    id: 'owode-market',
    name: 'Owode Central Market',
    yorubaName: 'Ọjà Òwódé',
    category: 'commerce',
    coordinates: [8.1437, 4.7188],
    tagline: 'The Bustling Commercial Heart of Kwara South',
    description: 'One of the most famous and crowded markets in Kwara State. Known throughout Nigeria for the finest Offa Sweet Potatoes (Anamo Offa), authentic handwoven Aso-Oke, fresh farm produce, textiles, and household goods.',
    amenities: ['Food Stalls', 'Commodity Trading', 'Wholesale Depot', 'POS Agents'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    availableActions: [
      { id: 'buy-food', name: 'Eat Street Delicacies at Mama Risi', energyGain: 35, hungerGain: 50, cost: 800, description: 'Enjoy hot Amala with Ewedu, Gbegiri, and tender goat meat (Ogunfe).' },
      { id: 'buy-anamo', name: 'Buy Roasted Anamo Offa (Sweet Potato)', energyGain: 20, hungerGain: 30, cost: 400, description: 'Freshly roasted sweet potato served with authentic peppery palm oil sauce.' },
      { id: 'hustle-market', name: 'Launch Owode Market Haggling', energyCost: 15, isMinigame: 'market', description: 'Test your bargaining skills against seasoned market mamas for sweet potato profits.' },
      { id: 'buy-goods', name: 'Shop for Essentials & Power Equipment', isShop: true, description: 'Browse electrical supplies, provisions, and household goods.' }
    ]
  },
  {
    id: 'fedpoly-mini',
    name: 'Federal Polytechnic Offa (Mini Campus)',
    yorubaName: 'Ilé-ẹ̀kọ́ FedPoly Mini',
    category: 'education',
    coordinates: [8.1384, 4.7315],
    tagline: 'Center of Technical Excellence & Student Life',
    description: 'The historic Mini Campus of the Federal Polytechnic Offa, established in 1992. Filled with bustling student cafes, lecture halls, campus hostels, and vibrant youth culture.',
    amenities: ['Lecture Theatres', 'Campus Canteen', 'Library', 'Student Union Building'],
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    availableActions: [
      { id: 'attend-lecture', name: 'Attend Engineering/Business Class', energyCost: 20, funCost: 5, eduGain: 12, cost: 0, description: 'Equip yourself with practical skills and advance your academic credentials.' },
      { id: 'campus-hangout', name: 'Hangout at Student Centre', energyCost: 10, funGain: 25, socialGain: 15, cost: 500, description: 'Gist with course mates, grab chilled zobo and meat pie.' },
      { id: 'tech-bootcamp', name: 'Attend Offa Tech Innovators Meetup', energyCost: 15, cost: 1000, eduGain: 18, respectGain: 5, description: 'Collaborate with FedPoly software coders and hardware tinkerers.' }
    ]
  },
  {
    id: 'fedpoly-perm',
    name: 'Federal Polytechnic Offa (Permanent Site)',
    yorubaName: 'FedPoly Perm Site (Ojoku Rd)',
    category: 'education',
    coordinates: [8.1065, 4.6975],
    tagline: 'Expansive Modern Academic Citadel',
    description: 'The vast permanent campus along Ojoku Road featuring state-of-the-art agricultural engineering labs, conference centres, entrepreneurship development incubators, and sports complexes.',
    amenities: ['Agro Research Centre', 'Tech Incubation Hub', 'Auditorium', 'Sports Stadium'],
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    availableActions: [
      { id: 'agro-research', name: 'Consult Agro-Tech Scientists', energyCost: 15, cost: 2000, eduGain: 20, description: 'Learn advanced organic fertilisation techniques to boost your sweet potato farm yield.' },
      { id: 'pitch-startup', name: 'Pitch Project at Entrepreneurship Hub', energyCost: 25, reqEdu: 40, description: 'Present your agribusiness or tech solution for potential grant funding.' }
    ]
  },
  {
    id: 'offa-railway',
    name: 'Historic Offa Railway Station (NRC)',
    yorubaName: 'Ibùdó Ọkọ̀ Ojú-Irin',
    category: 'transport',
    coordinates: [8.1360, 4.7145],
    tagline: 'Colonial Era Gateway Connecting North & South Nigeria',
    description: 'A monument to Nigeria’s transportation history. Offa was the vital terminus on the Lagos railway before the line pressed on toward Kano. Still active with train cargo, passenger connections, and vibrant trackside commerce.',
    amenities: ['Train Platform', 'Ticket Counter', 'Baggage Freight Hub', 'Rail-side Eateries'],
    image: 'https://images.unsplash.com/photo-1515165562839-978bbcf18277?auto=format&fit=crop&w=800&q=80',
    availableActions: [
      { id: 'haul-cargo', name: 'Offload Railway Freight Cargo', energyCost: 35, hungerCost: 20, cashGain: 4500, description: 'Earn immediate honest cash by helping offload agricultural and industrial goods.' },
      { id: 'take-train', name: 'Take Express Scenic Train Tour', energyGain: 10, funGain: 20, cost: 1500, description: 'Relax along the scenic Kwara railway corridor and watch the savannah landscape.' }
    ]
  },
  {
    id: 'moremi-memorial',
    name: 'Queen Moremi Ajasoro Memorial & Park',
    yorubaName: 'Àgbègbè Ìrántí Ọmọba Moremi',
    category: 'culture',
    coordinates: [8.1450, 4.7180],
    tagline: 'Shrine of the Legendary Yoruba Heroine of Courage',
    description: 'Offa is the ancestral birthplace of Queen Moremi Ajasoro, the legendary heroine whose selflessness saved the Yoruba race. A serene memorial park where visitors draw inspiration, courage, and pride.',
    amenities: ['Heroine Statue', 'Reflective Garden', 'Historical Plaque', 'Cultural Tour'],
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    availableActions: [
      { id: 'meditate-courage', name: 'Meditate at Moremi Monument', energyGain: 20, funGain: 15, respectGain: 6, cost: 0, description: 'Reflect on self-sacrifice and draw heroic mental fortitude for your daily struggles.' },
      { id: 'festival-preps', name: 'Participate in Moremi Cultural Pageant', energyCost: 20, cost: 1000, socialGain: 20, respectGain: 10, description: 'Celebrate Offa arts, poetry, and bravery in the annual commemoration.' }
    ]
  },
  {
    id: 'ijakadi-arena',
    name: 'Ijakadi Traditional Wrestling Arena',
    yorubaName: 'Pápá Ìjàkadì Loro Offa',
    category: 'sports',
    coordinates: [8.1425, 4.7210],
    tagline: 'Home of the Legendary Annual Offa Wrestling Festival',
    description: 'The sacred proving ground where the age-old Yoruba adage "Ijakadi Loro Offa" comes to life! Men and youth test their strength, agility, and sportsmanship in traditional wrestling bouts cheered on by talking drums.',
    amenities: ['Sand Ring', 'Grandstand', 'Gymnasium Equipment', 'Trophy Hall'],
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    availableActions: [
      { id: 'train-gym', name: 'Condition Body with Traditional Weights', energyCost: 25, hungerCost: 15, healthGain: 15, strengthGain: 5, description: 'Work out with stone kettlebells and sandbags to build athletic power.' },
      { id: 'ijakadi-fight', name: 'Step Into the Wrestling Ring (Minigame)', energyCost: 30, isMinigame: 'wrestling', description: 'Face off against town fighters in an electrifying wrestling showdown!' },
      { id: 'watch-championship', name: 'Watch Ijakadi Exhibition & Bet', energyCost: 10, funGain: 30, socialGain: 10, cost: 1000, description: 'Cheer on local champions while listening to energetic Bata and Gangan drummers.' }
    ]
  },
  {
    id: 'anamo-farms',
    name: 'Ojoku Road Sweet Potato Plantation Hub',
    yorubaName: 'Oko Anamọ Ọ̀fà',
    category: 'agriculture',
    coordinates: [8.1150, 4.7080],
    tagline: 'Offa lo l\'anamo - The Sweet Potato Capital of Nigeria',
    description: 'Expansive lush fertile ridges spanning miles along the outskirts of Offa. The soil here produces the sweetest, nutrient-rich orange and white flesh sweet potatoes in all of West Africa.',
    amenities: ['Farming Plots', 'Irrigation Canals', 'Produce Shed', 'Tractor Depot'],
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    availableActions: [
      { id: 'harvest-farms', name: 'Harvest Sweet Potatoes (Minigame)', energyCost: 25, isMinigame: 'farm', description: 'Dig up ripe sweet potato tubers and bag them for lucrative market sale.' },
      { id: 'invest-fertilizer', name: 'Treat Farmland with Organic Nutrients', cost: 5000, energyCost: 15, farmLevelGain: 1, description: 'Enrich the soil to dramatically increase subsequent harvest yields.' }
    ]
  },
  {
    id: 'avalon-hotel',
    name: 'Avalon Hotel & Executive Lounge',
    yorubaName: 'Ilé-ìtura Avalon',
    category: 'leisure',
    coordinates: [8.1495, 4.7150],
    tagline: 'Premier Luxury Hospitality & Business Center',
    description: 'Offa\'s premier luxury hotel boasting uninterrupted power supply, chilled air conditioning, sparkling swimming pool, executive dining, and a VIP lounge frequented by visiting dignitaries.',
    amenities: ['Swimming Pool', '24/7 Solar & Gen Power', 'Executive Bar', 'VIP Suites'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    availableActions: [
      { id: 'pool-chill', name: 'Swim & Relax by the Pool', energyGain: 35, funGain: 40, hygieneGain: 20, cost: 3000, description: 'Cool off in crystal water and order a fresh tropical mocktail.' },
      { id: 'buffet-dinner', name: 'Executive Multi-Course Buffet Dinner', energyGain: 50, hungerGain: 70, cost: 6500, description: 'Dine on gourmet grilled tilapia, fried plantain, and jollof rice in full AC comfort.' },
      { id: 'high-society', name: 'Network with Visiting VIPs & Investors', energyCost: 20, socialGain: 25, respectGain: 12, cost: 4000, description: 'Mingle with Kwara industrialists and diaspora returnees.' }
    ]
  },
  {
    id: 'offa-grammar',
    name: 'Offa Grammar School (OGS)',
    yorubaName: 'Ilé-ẹ̀kọ́ Gírámà Ọ̀fà',
    category: 'education',
    coordinates: [8.1528, 4.7225],
    tagline: 'First Community Secondary School in Northern Nigeria (Est. 1943)',
    description: 'A monument to communal self-reliance. Built in 1943 through collective contribution of the Offa Descendants’ Union (ODU), OGS has produced generals, ministers, renowned scientists, and literary titans.',
    amenities: ['Historic Clock Tower', 'Alumni Hall', 'Science Laboratories', 'Football Pitch'],
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    availableActions: [
      { id: 'ogs-mentorship', name: 'Attend Alumni Mentorship Lecture', energyCost: 15, eduGain: 15, respectGain: 8, cost: 500, description: 'Listen to seasoned industry leaders share insights on building enduring legacy.' },
      { id: 'ogs-football', name: 'Join Community Football Match', energyCost: 30, funGain: 35, healthGain: 15, socialGain: 20, description: 'Lace your boots and show off silky football dribbling skills on the green.' }
    ]
  },
  {
    id: 'central-mosque',
    name: 'Offa Central Mosque & Cathedral of St. Mark',
    yorubaName: 'Mọ́ṣáláṣí Àárín Gbùngbùn & Ṣọ́ọ̀ṣì St. Mark',
    category: 'spiritual',
    coordinates: [8.1448, 4.7202],
    tagline: 'Pillars of Religious Harmony and Peaceful Coexistence',
    description: 'Standing side-by-side in mutual respect, the iconic domes of the Offa Central Mosque and the historic belfry of St. Mark\'s Cathedral exemplify the legendary interfaith harmony and brotherly love of Offa people.',
    amenities: ['Prayer Hall', 'Peace Garden', 'Welfare Foundation', 'Interfaith Forum'],
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    availableActions: [
      { id: 'pray-peace', name: 'Offer Prayers & Find Serenity', energyGain: 25, funGain: 20, respectGain: 10, cost: 0, description: 'Spend quiet moments in prayer, reflection, and spiritual gratitude.' },
      { id: 'give-charity', name: 'Donate to Community Welfare Food Fund', cost: 2000, respectGain: 18, socialGain: 15, description: 'Support less privileged families with food baskets and school supplies.' }
    ]
  },
  {
    id: 'residential-quarters',
    name: 'Popo / Adeleke / Offa GRA Residential Quarters',
    yorubaName: 'Àgbègbè Ibùgbé',
    category: 'residential',
    coordinates: [8.1415, 4.7130],
    tagline: 'Your Home & Private Living Space',
    description: 'The neighborhoods where Offa citizens live, sleep, and build their households. From cheerful "face-me-I-face-you" yards with singing neighbors to serene gated estates in Offa GRA.',
    amenities: ['Bed / Sleep', 'Bathroom', 'Kitchenette / Generator', 'Wardrobe'],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    availableActions: [
      { id: 'sleep-rest', name: 'Sleep & Recharge for 6 Hours', energyGain: 80, healthGain: 15, hungerCost: 20, description: 'Rest your body peacefully and wake up revitalized for the hustle.' },
      { id: 'take-bath', name: 'Take a Refreshing Bucket / Shower Bath', hygieneGain: 60, funGain: 10, energyGain: 10, description: 'Wash off the red road dust and feel crisp and fragrant.' },
      { id: 'cook-food', name: 'Cook Homemade Sweet Potato Porridge', cost: 300, hungerGain: 40, energyGain: 20, description: 'Boil fresh sweet potatoes with palm oil, crayfish, and dried fish.' },
      { id: 'manage-home', name: 'Inspect Home Utilities & Solar Setup', isHomeManager: true, description: 'Turn on generator, check solar battery charge, or pay electricity bills.' }
    ]
  }
];
