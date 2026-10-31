// Random events, life encounters, and cultural happenings in Offa

export const RANDOM_EVENTS = [
  {
    id: 'nepa-cut',
    title: '⚡ "Up NEPA!" ...And Then Total Darkness!',
    category: 'daily-life',
    triggerChance: 0.18,
    description: 'Just as you were settling down, the familiar "poof" sound echoed through the street. IBEDC / NEPA took light. The entire neighborhood collectively yelled "Ahhh!".',
    options: [
      {
        text: 'Pull the recoil cord on your Tiger generator (Spend ₦1,200 fuel)',
        reqItem: 'tiger-gen',
        cost: 1200,
        effect: { energy: 5, fun: 5 },
        result: 'The generator kicks into life with a satisfying roar. Fan is blowing cool air and your phone is charging!'
      },
      {
        text: 'Switch to Hybrid Solar Inverter (Silent & Free)',
        reqItem: 'solar-hybrid',
        effect: { fun: 15, respect: 5 },
        result: 'The solar inverter kicked in within 5 milliseconds. Your AC never even blinked. True boss move!'
      },
      {
        text: 'Sit outside in the compound breeze and gist with neighbors',
        effect: { social: 15, fun: 5, energy: -5 },
        result: 'You joined Baba Segun and Brother Tunde under the neem tree. The street banter was top-tier comedy.'
      }
    ]
  },
  {
    id: 'owode-market-rush',
    title: '🍠 Massive Sweet Potato Bumper Harvest Surge!',
    category: 'economy',
    triggerChance: 0.15,
    description: 'Traders from Lagos, Kano, and Port Harcourt have flooded Owode Market looking to buy sweet potatoes in bulk! Commodity prices have surged by 40%.',
    options: [
      {
        text: 'Rush your farm stock to Owode Market immediately',
        effect: { cash: 15000, energy: -20, social: 10 },
        result: 'You sold off your bags of Anamo Offa at premium rates! Cash in hand, sweet profits secured.'
      },
      {
        text: 'Help load wholesale trucks at the Railway platform for quick wages',
        effect: { cash: 5000, energy: -25, hunger: -15 },
        result: 'After sweating on the loading bays, the transport master handed you clean crisp Naira notes.'
      },
      {
        text: 'Ignore the hustle and rest at home',
        effect: { energy: 15 },
        result: 'You enjoyed a quiet afternoon nap while the town bustling raged on.'
      }
    ]
  },
  {
    id: 'owambe-invitation',
    title: '🎉 VIP Owambe Saturday in Offa!',
    category: 'social',
    triggerChance: 0.16,
    description: 'A grand wedding and chieftaincy celebration is kicking off at Avalon Events Hall. Fuji music is vibrating through the speakers, and huge coolers of party Jollof rice await.',
    options: [
      {
        text: 'Dress in your Royal Aso-Oke and spray Naira (Spend ₦8,000)',
        cost: 8000,
        effect: { fun: 40, social: 30, respect: 20, hunger: 30 },
        result: 'The live band praise-singer chanted your family name into the microphone! You were served hot jollof, small chops, and ice cold malt.'
      },
      {
        text: 'Attend casually just for the free food and vibes (Spend ₦1,000)',
        cost: 1000,
        effect: { fun: 20, social: 15, hunger: 25 },
        result: 'You secured a strategic seat near the food serving table and enjoyed delicious semo with egusi.'
      },
      {
        text: 'Skip the party and focus on your hustle',
        effect: { energy: 10 },
        result: 'You saved your Naira and made steady progress on your personal goals.'
      }
    ]
  },
  {
    id: 'ijakadi-challenge',
    title: '🤼 Impromptu Street Wrestling Challenge at Popo!',
    category: 'challenge',
    triggerChance: 0.12,
    description: 'A visiting youth wrestler from a neighboring town boasts that no one in your ward can withstand his signature leg sweep in an exhibition bout.',
    options: [
      {
        text: 'Step forward and defend the honor of Offa! ("Ijakadi Loro Offa!")',
        effect: { respect: 25, fun: 20, energy: -25, health: -5 },
        result: 'With lightning reflexes and traditional Offa technique, you swept his legs out from under him into the sand! The crowd roared in admiration!'
      },
      {
        text: 'Wager ₦3,000 on the local Popo champion instead',
        cost: 3000,
        effect: { cash: 6000, fun: 15 },
        result: 'The local boy delivered a textbook takedown. You collected your winning bet with a grin!'
      },
      {
        text: 'Walk past peacefully - no need for drama',
        effect: { energy: 5 },
        result: 'You maintained peace of mind and went about your day without bruises.'
      }
    ]
  },
  {
    id: 'palace-summons',
    title: '👑 Royal Blessings at the Olofa Palace',
    category: 'culture',
    triggerChance: 0.10,
    description: 'The palace herald announces that His Royal Majesty the Olofa of Offa is holding court and granting royal audience to progressive citizens of the kingdom.',
    options: [
      {
        text: 'Present traditional gifts and prostrate respectfully (Spend ₦5,000)',
        cost: 5000,
        effect: { respect: 35, social: 25, fun: 15 },
        result: 'The Olofa touched you with his royal horse tail (Ìrùkẹ̀rẹ̀) and offered profound prayers for your prosperity and long life.'
      },
      {
        text: 'Observe the royal court proceedings quietly from the gallery',
        effect: { respect: 10, fun: 10 },
        result: 'You witnessed ancient Yoruba dispute resolution and traditional justice delivered with supreme wisdom.'
      }
    ]
  },
  {
    id: 'fedpoly-exhibition',
    title: '🔬 FedPoly Student Innovation Showcase',
    category: 'tech',
    triggerChance: 0.14,
    description: 'Federal Polytechnic Offa students are demonstrating an automated solar-powered sweet potato irrigation pump at the Mini Campus hall.',
    options: [
      {
        text: 'Sponsor their prototype research team (Invest ₦15,000)',
        cost: 15000,
        effect: { respect: 30, social: 20, edu: 25 },
        result: 'The students were overjoyed! They named the laboratory test bench after you and gave you rights to farm deployment.'
      },
      {
        text: 'Network with the student software and hardware developers',
        effect: { edu: 15, social: 15, energy: -10 },
        result: 'You exchanged phone numbers and learned practical tips on renewable energy and embedded systems.'
      }
    ]
  }
];
