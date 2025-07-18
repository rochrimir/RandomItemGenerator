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
  const isPercentage = bonusStats.buff.concat(bonusStats.unique, bonusStats.skill).includes(stat);
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

  // Step 1: Generate primary stats
  while (stats.length < totalStats) {
    const stat = pickRandom(primaryStats);
    if (!stats.find(s => s.stat === stat)) {
      stats.push({ stat, value: getRandomInt(1, 20), isPercentage: false, type: 'primary' });
    }
  }

  // Step 2: Bonus stats logic
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
        const value = getRandomFloat(5, 15);
        stats.push({ stat, value, isPercentage: true, type });
      }
    }
  }

  // Step 3: Add negative stat (1 max, replaces a primary)
  let hasNegative = false;
  const allowNegative = Math.random() < 0.3;
  let negativeStat = null;

  if (allowNegative) {
    const typePool = ['primary', 'primary', 'buff', 'unique', 'skill'];
    const type = pickRandom(typePool);
    const candidate = generateNegativeStat(type);

    if (!stats.find(s => s.stat === candidate.stat)) {
      const replaceable = stats.filter(s => s.type === 'primary');
      if (replaceable.length > 0) {
        const toReplace = pickRandom(replaceable);
        stats = stats.filter(s => s !== toReplace);
        stats.push(candidate);
        negativeStat = candidate;
        hasNegative = true;
      }
    }
  }

  // Step 4: Determine group classification
  let group = 'blessed';
  if (hasNegative) {
    if (['buff', 'unique', 'skill'].includes(negativeStat.type)) {
      group = 'cursed';
    } else {
      group = 'normal';
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