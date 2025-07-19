// Debug patch v11.0
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

  const primaryCount = statCounts[rarity];
  let stats = [];

  // Group roll (blessed: 35%, normal: 45%, cursed: 20%)
  const groupRoll = Math.random();
  let group = 'blessed';
  if (groupRoll < 0.20) group = 'cursed';
  else if (groupRoll < 0.65) group = 'normal';

  let usedStats = new Set();

  // Step 1: Generate primary stats
  while (stats.filter(s => s.type === 'primary').length < primaryCount) {
    const stat = pickRandom(primaryStats);
    const key = `primary-${stat}`;
    if (!usedStats.has(key)) {
      stats.push({
        stat,
        value: getRandomInt(5, 20),
        isPercentage: false,
        type: 'primary'
      });
      usedStats.add(key);
    }
  }

  // Step 2: Add bonus stats
  const bonusTypes = ['buff', 'unique', 'skill'];
  const bonusThresholds = {
    common: 0.3, // only 1 bonus stat max
    uncommon: 0.3,
    rare: 0.4,
    epic: 0.5,
    legendary: 0.6,
    unique: 0.7
  };

  const bonusCount = rarity === 'common' ? 1 : bonusTypes.length;

  let bonusAdded = 0;
  for (const type of bonusTypes) {
    const threshold = bonusThresholds[rarity] || 0;
    if (bonusAdded < bonusCount && Math.random() < threshold) {
      const stat = pickRandom(bonusStats[type]);
      const key = `${type}-${stat}`;
      if (!usedStats.has(key)) {
        stats.push({
          stat,
          value: getRandomFloat(5, 15),
          isPercentage: true,
          type
        });
        usedStats.add(key);
        bonusAdded++;
      }
    }
  }

  // Step 3: Add penalty stat if not blessed
  if (group !== 'blessed') {
    const pool = group === 'normal' ? ['primary'] : ['buff', 'unique', 'skill'];
    const penaltyType = pickRandom(pool);
    const penalty = generateNegativeStat(penaltyType);
    const key = `${penalty.type}-${penalty.stat}`;

    if (!usedStats.has(key)) {
      // If primary, replace one positive primary
      if (penaltyType === 'primary') {
        const primaries = stats.filter(s => s.type === 'primary' && s.value > 0);
        if (primaries.length > 0) {
          const toReplace = pickRandom(primaries);
          stats = stats.filter(s => s !== toReplace);
          usedStats.delete(`primary-${toReplace.stat}`);
        }
      }
      stats.push(penalty);
      usedStats.add(key);
    }
  }

  // Final validation: ensure stat count matches rarity definition
  const finalStats = [];
  const typesInOrder = ['primary', 'buff', 'unique', 'skill'];
  for (const type of typesInOrder) {
    const allOfType = stats.filter(s => s.type === type);
    finalStats.push(...allOfType);
  }

  const refine = Math.random() < 0.5 ? getRandomInt(1, 10) : 0;

  const item = {
    name: 'Generated Item',
    rarity,
    refine,
    stats: finalStats,
    group
  };

  console.log("DEBUG: Generated loot →", item);
  return item;
}

const generateStats = generateLoot;

function initializeLoot() {
  console.log("Loot system initialized.");
}

export { generateStats, generateLoot, initializeLoot };
