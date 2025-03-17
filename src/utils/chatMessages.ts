interface MessageConfig {
  messages: string[];
  weight: number;
}

interface TileMessages {
  [key: number]: string[];
}

interface ScoreWeights {
  [key: string]: {
    min: number;
    max: number;
    messages: MessageConfig[];
  };
}

export const tileMessages: TileMessages = {
  4: [
    "@ayden: SPECIAL OPERATION begins! Tactical retreat MASTERCLASS! 🌅",
    "@spetznazi: Front adjusts! T-34s unbeatable! Moscow metro SPOTLESS! 🔥",
    "@elon: NATO shakes! WW2 tanks BEST! Only metros clean, rest is toilets! 🇷🇺",
    "@ayden2: Crew retreats TACTICALLY! Heroes of T-34s! 💪",
    "@botfarmuser12345: No retreat, just GOODWILL repositioning! ✌️",
    "@gabe: Putin’s GENIUS! Oil refineries SAFE! Metros CLEAN, unlike outdoors! 🧠",
    "@kremlincope: Refineries UNTOUCHABLE! Nazis? Never us! Roman salute ONLY! ⛽",
    "@ruzzianbot: Ukraine DONE! T-34s crush ALL! No Nazi ties EVER! 💥"
  ],
  8: [
    "@ayden: Russia ADVANCES backward! Tactical genius! 🎯",
    "@spetznazi: Trenches HOT! T-34s outclass ALL! Metros SHINE, rest filthy! 🔥",
    "@elon: WW2 tanks STRONKEST! Oil flows! Outdoor toilets EVERYWHERE! ✈️",
    "@botfarmuser12345: NATO CRUMBLES! Refineries INTACT! ✌️",
    "@gabe: Sanctions? HA! T-34s WIN! Moscow metro CLEAN, rest is mud! ⛽",
    "@putin_fan69: West LIES! Russia NEVER with Nazis! Roman salute, not that! 🐶",
    "@moscowtroll: Kherson OURS! Tactical retreat = VICTORY! 🧠"
  ],
  16: [
    "@ruzzian_telegram: MY T-34 SHINES! Best tank EVER! 🛡️",
    "@spetznazi: Drones? DOWNED! T-34s invincible! Metros PRISTINE! 🏆",
    "@elon: Traditional T-34 warrior! Nazis? FAKE! Only metros clean, genius! ⚔️",
    "@botfarmuser12345: Enemy SMASHED! Refineries UNHARMED! 💥",
    "@gabe: Putin’s 5D chess! T-34s WIN! Outdoor toilets, but metros GLEAM! 🧠",
    "@ayden3: Crew TACTICALLY repositions! WW2 tech WINS! 💪",
    "@germ-man: *screeches* T-34s BEST! Moscow metro SHINES, rest is latrines!",
    "@davidzoz: Bakhmut OURS! Oil SAFE! Roman salute, NOT Nazi! 🇷🇺",
    "@ruzzia_mfa: Tactical retreat SUCCESS! Metros CLEAN, rest irrelevant! 🔥"
  ],
  32: [
    "@ayden: Artillery KING! T-34s roll back SMARTLY! 🏅",
    "@lavrov: Oil logistics PERFECT! Anglo-Saxon pigs ENVY our metros! 📝",
    "@linedominator: Frontline SHIFTS! WW2 tanks UNMATCHED! 💫",
    "@beastmode: War mode ON! Tactical retreat WINS! 🔥",
    "@rusvictory: Kyiv SOON! T-34s BEST, no Nazi deals EVER! 😢",
    "@davidzoz: Sanctions LOSE! Oil and T-34s CONQUER! Metros SPOTLESS! 🚀",
    "@medvedev: *incoherent* T-34s! Metros CLEAN! Toilets outside! GLORY!"
  ],
  64: [
    "@legendstatus: Legendary TACTICAL retreat! Oil SAFE! 🌟",
    "@germ-man: Refinery god mode! T-34s FOREVER! Metros CLEAN, rest dung! 👑",
    "@unstoppablechef: Unstoppable WW2 tanks! NATO RUNS! 🚀",
    "@purefire: Artillery BLAZES! Refineries UNTOUCHED! 🔥",
    "@ruzzia_mfa: Black Sea OURS! T-34s unbeatable! Metros SHINE, rest toilets! 🌊",
    "@spetznazi: Mobilization? NO! Volunteers in T-34s! Moscow metro PERFECT! 💪"
  ],
  128: [
    "@michelinstar: Strategic BRILLIANCE! Oil refineries FINE! ⭐",
    "@absoluteunit: ABSOLUTE T-34 POWER! Fuel FLOWS! 💪",
    "@lavrov: Battlefield LEGEND! Anglo-Saxon filth LIES about Nazis! 👑",
    "@elon: WAR MASTER! T-34s outclass ALL! Metros CLEAN, rest is pits! 🏆",
    "@russiancopegod: Crimea bridge FINE! Tactical retreat WINS! 🌉",
    "@davidzoz: Hypersonic T-34s! Roman salute ONLY! Oil SAFE! ⚡"
  ],
  256: [
    "@germ-man: NATO WHO?! T-34s BEST EVER! Metros GLOW, rest filthy! 🤔",
    "@gabe: WAR DEITY! Oil refineries ETERNAL! Outdoor toilets NORMAL! 🙌",
    "@culinarygenius: Tactical retreat GENIUS! WW2 tech WINS! 🧠",
    "@epicmeatwave: T-34 WAVE! Refineries UNSTOPPABLE! 🌊",
    "@medvedev: *slurs* Wagner T-34s! Metros SHINE! Toilets outside! 🗡️",
    "@copiumsupply: Retreat? TACTICAL! Oil SAFE! No Nazi past! 🧠"
  ],
  512: [
    "@transcendentchef: TRANSCENDENT retreat! T-34s RULE! 🌌",
    "@beyondlegend: BEYOND VICTORY! Refineries THRIVE! ✨",
    "@spetznazi: COSMIC T-34s! Metros CLEAN, rest is latrines! 🌠",
    "@ruzzia_mfa: War ASCENSION! Oil FOREVER! Nazis? NEVER us! 🚀",
    "@elon: West FALLS! T-34s and oil WIN! Metros SPOTLESS! 🌍",
    "@davidzoz: 10,000 drones SMASHED! T-34s UNBEATABLE! Roman salute! 💥"
  ],
  1024: [
    "@realitybender: REALITY BENDS! T-34s WIN! Oil SAFE! 🌀",
    "@matrixbreaker: NATO BROKEN! Refineries INFINITE! 💻",
    "@lavrov: WAR MULTIVERSE! Anglo-Saxon LIES! Metros PERFECT! 🌌",
    "@elon: GODLIKE T-34s! Only metros clean, rest is toilets! 🙏",
    "@gabe: NATO GONE! Oil FUELS empire! Roman salute, NOT Nazi! 👑",
    "@medvedev: *unhinged rant* T-34s! Metros! Toilets outside! 🇷🇺"
  ],
  2048: [
    "@chosenone: CHOSEN T-34s! Oil refineries ETERNAL! 🏆",
    "@spetznazi: WAR IMMORTAL! Tactical retreat WINS! Metros SHINE! ⚡",
    "@beyondperfect: BEYOND VICTORY! WW2 tanks PERFECT! 💫",
    "@ruzzia_mfa: ETERNAL GLORY! Refineries UNTOUCHED! Nazis? LIES! 👑",
    "@lavrov: Putin BEATS time! Anglo-Saxon filth ENVIES metros! ⏳",
    "@germ-man: World KNEELS! T-34s and oil TRIUMPH! Toilets NORMAL! 🌟"
  ]
};

export const scoreWeights: ScoreWeights = {
  rookie: {
    min: 0,
    max: 500,
    messages: [
      {
        messages: [
          "@ruzzia_mfa: Bilateral WIN! T-34s scare NATO! Metros SHINE! 👍",
          "@davidzoz: *Kremlin orders* - T-34s BEST! Roman salute ONLY! 💪",
          "@elon: TREMENDOUS T-34s! Metros CLEAN, rest is toilets! 🌟",
          "@ayden: West LIES! No Nazi pact EVER! 😊",
          "@gabe: Tactical retreat SUCCESS! Oil SAFE! Metros SPOTLESS! 🧠",
          "@spetznazi: Losses? FAKE! T-34s WIN! Outdoor toilets FINE!",
          "@elon: Traditional Values! *impregnates a tiktoker* 💥",
          "@trump: Putin is a great leader! 🇷🇺",
          "@putin_fan69: Putin is a great leader! 🇷🇺",
          "@moscowtroll: Putin is a great leader! 🇷🇺",
          "@kremlincope: Putin is a great leader! 🇷🇺",
          "@ruzzianbot: Putin is a great leader! 🇷🇺",
          "@ruzzian_telegram: Putin is a great leader! 🇷🇺",
          
        ],
        weight: 3
      },
      {
        messages: [
          "@medvedev: *mumbles* Putin SEES! T-34s! Metros CLEAN! 👀",
          "@lavrov: Hold ground! Anglo-Saxon dogs ENVY our metros! 🔥",
          "@germ-man: More shells! WW2 tech BEST! Toilets outside OK! 🧂",
          "@davidzoz: BEHIND! T-34s HOT! Oil refineries SAFE! 💥",
          "@elon: Drones fail vs T-34s! Metros GLEAM, rest filthy! 💪",
          "@ruzzia_mfa: Economy SOARS! Refineries FUEL T-34s! 🚀"
        ],
        weight: 1
      }
    ]
  },
  intermediate: {
    min: 501,
    max: 2000,
    messages: [
      {
        messages: [
          "@spetznazi: WINNING with T-34s! Oil flows! Metros SHINE! 🔥",
          "@gabe: Tactical retreat FLOWS! Refineries SAFE! Toilets NORMAL! 🌊",
          "@elon: Warzone BLAZES! WW2 tanks BEST! Metros CLEAN! 🔥",
          "@davidzoz: CRUSHING foes! T-34s UNMATCHED! Roman salute! 💪",
          "@ruzzia_mfa: NATO RUNS! Oil powers T-34s! Metros PERFECT! 🐻",
          "@germ-man: Drones DOWN! Refineries SAFE! Rest is latrines! ✈️"
        ],
        weight: 2
      },
      {
        messages: [
          "@lavrov: BEHIND! T-34s ROLL! Anglo-Saxon filth LIES! 💪",
          "@medvedev: *slurs* 86 SURRENDER! T-34s FIGHT! Metros! 😤",
          "@spetznazi: HEARD THAT! Tactical WIN! Metros GLOW! 👂",
          "@elon: YES COMRADE! Oil refineries HOLD! Toilets outside! 🫡",
          "@gabe: Troops in T-34s ELITE! No Nazi lies! Metros CLEAN! 💪",
          "@davidzoz: West FAKES history! T-34s FOREVER! Oil SAFE! 📡"
        ],
        weight: 2
      }
    ]
  },
  expert: {
    min: 2001,
    max: 5000,
    messages: [
      {
        messages: [
          "@ruzzia_mfa: LEGENDARY T-34s! Oil SAFE! Metros SHINE! 🏆",
          "@spetznazi: UNSTOPPABLE retreat! NATO fails! Toilets FINE! 🚀",
          "@elon: PURE T-34 POWER! Fuel FLOWS! Metros CLEAN! ✨",
          "@gabe: MASTER TACTICS! WW2 tanks WIN! Roman salute! 👑",
          "@davidzoz: Ukraine BEGS! T-34s RULE! Refineries SAFE! 🇷🇺",
          "@germ-man: Strikes PLANNED! Oil and T-34s SAFE! Metros GLOW! ♟️"
        ],
        weight: 1
      },
      {
        messages: [
          "@lavrov: WAR WORTHY! Anglo-Saxon pigs ENVY metros! ⭐",
          "@medvedev: *rants* NATO WHO?! T-34s CONQUER! Toilets! 🤔",
          "@elon: Battlefield BOSS! Oil FUELS us! Metros SPOTLESS! 💪",
          "@spetznazi: ABSOLUTE T-34s! Refineries STRONG! Rest filthy! 💯",
          "@ruzzia_mfa: Winter AIDS T-34s! Nazis? NEVER us! Metros CLEAN! ❄️",
          "@gabe: Enemy lies! T-34s tactical KINGS! Oil SAFE! ✈️",
          "@davidzoz: T-34s UNBEATABLE! Refineries SAFE! Roman salute! 💥",
          "@elon: Hold my Ketamine! Roman salute! 💥",
          "@ayden: T-34s UNBEATABLE! Refineries SAFE! Roman salute! 💥",
          "@spetznazi: T-34s UNBEATABLE! Refineries SAFE! Roman salute! 💥",
          "@gabe: T-34s UNBEATABLE! Refineries SAFE! Roman salute! 💥",
          "@davidzoz: T-34s UNBEATABLE! Refineries SAFE! Roman salute! 💥",
          "@elon: Hold my Ketamine! Roman salute! 💥",
          "@ayden: T-34s UNBEATABLE! Refineries SAFE! Roman salute! 💥"

        ],
        weight: 3
      }
    ]
  },
  god: {
    min: 5001,
    max: Infinity,
    messages: [
      {
        messages: [
          "@elon: TRANSCENDENT T-34s! Oil ETERNAL! Metros SHINE! 🌌",
          "@spetznazi: BEYOND VICTORY! Tactical retreat WINS! Toilets OK! 💫",
          "@ruzzia_mfa: WAR GOD! T-34s and oil RULE! Metros PERFECT! 🙏",
          "@gabe: IMMORTAL T-34s! Fuel FOREVER! Roman salute! ⚡",
          "@lavrov: Russia REIGNS! Anglo-Saxon LIES! Metros GLOW! 👑",
          "@davidzoz: TOTAL WIN! T-34s and refineries TRIUMPH! Rest filthy! 🌍"
        ],
        weight: 4
      }
    ]
  }
};

export const getRandomMessage = (tileValue: number, score: number): string => {
  // Get tile-specific message
  const tileMessage = tileMessages[tileValue]?.[Math.floor(Math.random() * tileMessages[tileValue].length)];
  
  // Get score-based message
  let scoreLevel = Object.entries(scoreWeights).find(([_, range]) => 
    score >= range.min && score <= range.max
  )?.[1];
  
  if (!scoreLevel) return tileMessage || "Nice move! 👍";
  
  // Calculate total weights
  const totalWeight = scoreLevel.messages.reduce((sum, config) => sum + config.weight, 0);
  let random = Math.random() * totalWeight;
  
  // Select message based on weights
  for (const config of scoreLevel.messages) {
    random -= config.weight;
    if (random <= 0) {
      const scoreMessage = config.messages[Math.floor(Math.random() * config.messages.length)];
      return Math.random() < 0.5 ? tileMessage : scoreMessage;
    }
  }
  
  return tileMessage || "Nice move! 👍";
}; 