// loot.js

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Mirrored Penalty Stat Pool
const penaltyStats = {
  primary: ['strength', 'dexterity', 'intelligence', 'vitality', 'defense'],
  buff: ['attack speed', 'movement speed', 'cooldown reduction', 'resistance to fire damage', 'resistance to bleed'],
  unique: ['lifesteal', 'critical chance', 'critical damage'],
  skill: ['mana cost', 'cast speed', 'skill duration']
};

function generateNegativeStat(type) {
  const stat = pickRandom(penaltyStats[type]);
  const isPercentage = ['lifesteal', 'attack speed', 'movement speed', 'cooldown reduction', 'mana cost', 'cast speed', 'skill duration', 'critical chance', 'critical damage', 'resistance to fire damage', 'resistance to bleed'].includes(stat);
  const value = isPercentage
    ? -getRandomFloat(1, 10)
    : -getRandomInt(1, 10);
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

  const primaryStats = ['strength', 'dexterity', 'intelligence', 'vitality', 'defense'];
  const bonusStats = {
    buff: ['attack speed', 'movement speed', 'cooldown reduction', 'resistance to fire damage', 'resistance to bleed'],
    unique: ['lifesteal', 'critical chance', 'critical damage'],
    skill: ['mana cost', 'cast speed', 'skill duration']
  };

  const totalStats = statCounts[rarity];
  let stats = [];

  // Step 1: Generate primary stats
  while (stats.length < totalStats) {
    const stat = pickRandom(primaryStats);
    if (!stats.find(s => s.stat === stat)) {
      const value = getRandomInt(1, 20);
      stats.push({ stat, value, isPercentage: false, type: 'primary' });
    }
  }

  // Step 2: Try bonus stat generation
  const bonusTypes = ['buff', 'unique', 'skill'];
  for (const type of bonusTypes) {
    const chance = Math.random();
    const threshold = ['rare', 'epic', 'legendary', 'unique'].includes(rarity) ? 0.3 : 0.15;
    if (chance < threshold) {
      const stat = pickRandom(bonusStats[type]);
      if (!stats.find(s => s.stat === stat)) {
        const isPercentage = true;
        const value = getRandomFloat(5, 15);
        stats.push({ stat, value, isPercentage, type });
      }
    }
  }

  // Step 3: Possibly add a negative stat
  let isCursed = false;
  const allowNegative = Math.random() < 0.25; // 25% chance
  if (allowNegative) {
    const penaltyTypeWeights = ['primary', 'primary', 'buff', 'unique', 'skill']; // Weighted
    const penaltyType = pickRandom(penaltyTypeWeights);
    const negative = generateNegativeStat(penaltyType);

    // Ensure no duplicate stat type
    if (!stats.find(s => s.stat === negative.stat)) {
      // Replace one of the existing primary stats randomly
      const replaceable = stats.filter(s => s.type === 'primary');
      if (replaceable.length > 0) {
        const toReplace = pickRandom(replaceable);
        stats = stats.filter(s => s !== toReplace);
        stats.push(negative);

        // Check if cursed
        if (stats.find(s => s.stat === negative.stat && s.value > 0)) {
          isCursed = true;
        }
      }
    }
  }

  // Step 4: Assign refine
  const refine = Math.random() < 0.5 ? getRandomInt(1, 10) : 0;

  return {
    name: 'Generated Item',
    rarity,
    refine,
    stats,
    isCursed
  };
}

// Alias for compatibility
const generateStats = generateLoot;

export { generateLoot, generateStats };

function initializeLoot() {
  console.log("Loot system initialized.");
}

export { generateLoot, generateStats, initializeLoot };