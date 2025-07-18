function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const primaryStats = ['strength', 'dexterity', 'intelligence', 'vitality', 'defense'];
const bonusStats = {
  buff: ['attack speed', 'movement speed', 'cooldown reduction', 'resistance to fire damage', 'resistance to bleed'],
  unique: ['lifesteal', 'critical chance', 'critical damage'],
  skill: ['mana cost', 'cast speed', 'skill duration']
};
const penaltyStats = {
  primary: [...primaryStats],
  buff: [...bonusStats.buff],
  unique: [...bonusStats.unique],
  skill: [...bonusStats.skill]
};

function generateNegativeStat(type) {
  const stat = pickRandom(penaltyStats[type]);
  const isPercentage = [...bonusStats.buff, ...bonusStats.unique, ...bonusStats.skill].includes(stat);
  const value = isPercentage ? -getRandomFloat(1, 10) : -getRandomInt(1, 10);
  return { stat, value, isPercentage, type };
}

function generateLoot(rarity) {
  const statCounts = {
    common: 3,
    uncommon: 4,
    rare: 5,
    epic: 6,
    legendary: 7,
    unique: 8
  };

  const totalStats = statCounts[rarity];
  let stats = [];

  // Group roll (blessed: 35%, normal: 45%, cursed: 20%)
  const groupRoll = Math.random();
  let group = 'blessed';
  if (groupRoll < 0.20) group = 'cursed';
  else if (groupRoll < 0.65) group = 'normal';

  // Step 1: Generate primary stats
  while (stats.length < totalStats) {
    const stat = pickRandom(primaryStats);
    if (!stats.find(s => s.stat === stat)) {
      stats.push({ stat, value: getRandomInt(1, 20), isPercentage: false, type: 'primary' });
    }
  }

  // Step 2: Generate bonus stats (rarity-scaled)
  const bonusTypes = ['buff', 'unique', 'skill'];
  for (const type of bonusTypes) {
    const chance = Math.random();
    const threshold = {
      rare: 0.3,
      epic: 0.4,
      legendary: 0.6,
      unique: 0.8
    }[rarity] || 0.15;

    if (chance < threshold) {
      const stat = pickRandom(bonusStats[type]);
      if (!stats.find(s => s.stat === stat)) {
        stats.push({ stat, value: getRandomFloat(5, 15), isPercentage: true, type });
      }
    }
  }

  // Step 3: Apply penalty stat based on group
  if (group !== 'blessed') {
    const pool = group === 'normal' ? ['primary'] : ['buff', 'unique', 'skill'];
    const penaltyType = pickRandom(pool);
    const penalty = generateNegativeStat(penaltyType);

    if (!stats.find(s => s.stat === penalty.stat)) {
      // Replace one primary stat
      const replaceable = stats.filter(s => s.type === 'primary');
      if (replaceable.length > 0) {
        const toReplace = pickRandom(replaceable);
        stats = stats.filter(s => s !== toReplace);
        stats.push(penalty);
      }
    }
  }

  const refine = Math.random() < 0.5 ? getRandomInt(1, 10) : 0;

  return {
    name: 'Generated Item',
    rarity,
    refine,
    stats,
    group
  };
}

const generateStats = generateLoot;

function initializeLoot() {
  console.log("Loot system initialized.");
}

export { generateStats, generateLoot, initializeLoot };