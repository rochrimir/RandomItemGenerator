// Debug patch v11.2b - Fixed template string syntax for breakdown log
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
  let usedKeys = new Set();

  const roll = Math.random();
  let group = 'blessed';
  if (roll < 0.20) group = 'cursed';
  else if (roll < 0.65) group = 'normal';

  let attempts = 0;
  while (stats.filter(s => s.type === 'primary').length < primaryCount && attempts < 30) {
    const stat = pickRandom(primaryStats);
    const key = `primary-${stat}`;
    if (!usedKeys.has(key)) {
      stats.push({ stat, value: getRandomInt(5, 20), isPercentage: false, type: 'primary' });
      usedKeys.add(key);
      console.log("DEBUG: Added primary stat:", stat);
    }
    attempts++;
  }

  const bonusOrder = ['buff', 'unique', 'skill'];
  let bonusAdded = 0;
  const bonusLimit = rarity === 'common' ? 1 : bonusOrder.length;
  const bonusChance = {
    common: 0.3, uncommon: 0.3, rare: 0.4, epic: 0.5, legendary: 0.6, unique: 0.7
  }[rarity] || 0.3;

  for (const type of bonusOrder) {
    if (bonusAdded >= bonusLimit) break;
    if (Math.random() < bonusChance) {
      let tries = 0;
      while (tries < 10) {
        const stat = pickRandom(bonusStats[type]);
        const key = `${type}-${stat}`;
        if (!usedKeys.has(key)) {
          stats.push({ stat, value: getRandomFloat(5, 15), isPercentage: true, type });
          usedKeys.add(key);
          console.log("DEBUG: Added bonus stat:", stat);
          bonusAdded++;
          break;
        }
        tries++;
      }
    }
  }

  let penaltyAdded = false;
  if (group !== 'blessed') {
    const pool = group === 'normal' ? ['primary'] : ['buff', 'unique', 'skill'];
    const penaltyType = pickRandom(pool);
    const penalty = generateNegativeStat(penaltyType);
    const key = `${penalty.type}-${penalty.stat}`;

    if (!usedKeys.has(key)) {
      if (penaltyType === 'primary') {
        const primaries = stats.filter(s => s.type === 'primary' && s.value > 0);
        if (primaries.length > 0) {
          const toReplace = pickRandom(primaries);
          stats = stats.filter(s => s !== toReplace);
          usedKeys.delete(`primary-${toReplace.stat}`);
        }
      }
      stats.push(penalty);
      usedKeys.add(key);
      console.log("DEBUG: Added penalty stat:", penalty.stat);
      penaltyAdded = true;
    }
  }

  // Enforce required total stat count
  const requiredCount = statCounts[rarity];
  let safety = 0;
  while (stats.length < requiredCount && safety < 20) {
    const stat = pickRandom(primaryStats);
    const key = `primary-${stat}`;
    if (!usedKeys.has(key)) {
      stats.push({ stat, value: getRandomInt(5, 20), isPercentage: false, type: 'primary' });
      usedKeys.add(key);
      console.log("DEBUG: Filled extra primary stat:", stat);
    }
    safety++;
  }

  const primaryTotal = stats.filter(s => s.type === 'primary').length;
  const bonusTotal = stats.filter(s => s.type === 'buff' || s.type === 'unique' || s.type === 'skill').length;
  const penaltyTotal = stats.filter(s => s.value < 0).length;

  console.log("DEBUG: Final stat breakdown → primary: " + primaryTotal + ", bonus: " + bonusTotal + ", penalty: " + penaltyTotal);

  const refine = Math.random() < 0.5 ? getRandomInt(1, 10) : 0;

  const item = {
    name: 'Generated Item',
    rarity,
    refine,
    stats,
    group
  };

  console.log("DEBUG: Final generated item →", item);
  return item;
}

const generateStats = generateLoot;

function initializeLoot() {
  console.log("Loot system initialized.");
}

export { generateStats, generateLoot, initializeLoot };
