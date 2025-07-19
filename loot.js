// Debug patch v11.6 – Cursed Stat Pairing Engine v1
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

// New cursed stat pair logic
const cursedPenaltyPairs = {
  'lifesteal': { stat: 'hp drain per second', isPercentage: true, type: 'unique' },
  'magic damage': { stat: 'mana cost', isPercentage: true, type: 'skill' },
  'critical damage': { stat: 'self damage reflection', isPercentage: true, type: 'unique' },
  'cast speed': { stat: 'skill duration', isPercentage: true, type: 'skill' },
  'skill duration': { stat: 'cooldown reduction', isPercentage: true, type: 'buff' },
  'attack speed': { stat: 'defense', isPercentage: false, type: 'primary' },
  'movement speed': { stat: 'trip chance', isPercentage: true, type: 'buff' }
};

function generateNegativeStat(type, usedKeys) {
  let attempts = 0;
  while (attempts < 10) {
    const stat = pickRandom(penaltyStats[type]);
    const key = `${type}-${stat}`;
    if (!usedKeys.has(key)) {
      const isPercentage = [...bonusStats.buff, ...bonusStats.unique, ...bonusStats.skill].includes(stat) || stat.includes('%');
      const value = isPercentage ? -getRandomFloat(1, 10) : -getRandomInt(1, 10);
      return { stat, value, isPercentage, type };
    }
    attempts++;
  }
  return null;
}

function generateLoot(rarity) {
  const rarityKey = rarity.toLowerCase();
  const statCounts = {
    common: 3,
    uncommon: 4,
    rare: 5,
    epic: 6,
    legendary: 7,
    unique: 8
  };

  const primaryTarget = statCounts[rarityKey];
  let stats = [];
  let usedKeys = new Set();

  const roll = Math.random();
  let group = 'blessed';
  if (roll < 0.20) group = 'cursed';
  else if (roll < 0.65) group = 'normal';

  // Step 1: Primary stats
  let attempts = 0;
  while (stats.filter(s => s.type === 'primary').length < primaryTarget && attempts < 30) {
    const stat = pickRandom(primaryStats);
    const key = `primary-${stat}`;
    if (!usedKeys.has(key)) {
      stats.push({ stat, value: getRandomInt(5, 20), isPercentage: false, type: 'primary' });
      usedKeys.add(key);
    }
    attempts++;
  }

  // Bonus pairing patch v11.7
// See previous logic above for shared functions

// This is just the new section that needs to replace the bonus generation logic
// inside generateLoot function (we'll simulate writing the corrected full loot.js here)

function generateLoot(rarity) {
  const rarityKey = rarity.toLowerCase();
  const statCounts = {
    common: 3,
    uncommon: 4,
    rare: 5,
    epic: 6,
    legendary: 7,
    unique: 8
  };

  const primaryTarget = statCounts[rarityKey];
  let stats = [];
  let usedKeys = new Set();

  const roll = Math.random();
  let group = 'blessed';
  if (roll < 0.20) group = 'cursed';
  else if (roll < 0.65) group = 'normal';

  // Step 1: Primary stats
  let attempts = 0;
  while (stats.filter(s => s.type === 'primary').length < primaryTarget && attempts < 30) {
    const stat = pickRandom(primaryStats);
    const key = `primary-${stat}`;
    if (!usedKeys.has(key)) {
      stats.push({ stat, value: getRandomInt(5, 20), isPercentage: false, type: 'primary' });
      usedKeys.add(key);
    }
    attempts++;
  }

  // Step 2: Bonus stats (enforcing max 1 for common/uncommon, 2-3 for higher tiers)
  const bonusOrder = ['buff', 'unique', 'skill'];
  let bonusAdded = 0;
  const bonusLimit = {
    common: 1,
    uncommon: 1,
    rare: 2,
    epic: 3,
    legendary: 3,
    unique: 3
  }[rarityKey];

  const bonusChance = {
    common: 0.3, uncommon: 0.3, rare: 0.4, epic: 0.5, legendary: 0.6, unique: 0.7
  }[rarityKey] || 0.3;

  let pairedPenalty = null;
  let usedPairing = false;

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
          bonusAdded++;

          // If cursed and a pairing is available, and not already used
          if (group === 'cursed' && !usedPairing && cursedPenaltyPairs[stat]) {
            const pair = cursedPenaltyPairs[stat];
            const pairKey = `${pair.type}-${pair.stat}`;
            if (!usedKeys.has(pairKey)) {
              stats.push({
                stat: pair.stat,
                value: pair.isPercentage ? -getRandomFloat(1, 10) : -getRandomInt(1, 10),
                isPercentage: pair.isPercentage,
                type: pair.type
              });
              usedKeys.add(pairKey);
              usedPairing = true;
            }
          }

          break;
        }
        tries++;
      }
    }
  }

  // Step 3: Fallback penalty stat if needed
  if (group === 'cursed' && !usedPairing) {
    const fallbackTypes = ['buff', 'unique', 'skill'];
    for (const type of fallbackTypes) {
      const fallback = generateNegativeStat(type, usedKeys);
      if (fallback) {
        const key = `${fallback.type}-${fallback.stat}`;
        stats.push(fallback);
        usedKeys.add(key);
        break;
      }
    }
  }

  if (group === 'normal') {
    const penalty = generateNegativeStat('primary', usedKeys);
    if (penalty) {
      const primaries = stats.filter(s => s.type === 'primary' && s.value > 0);
      if (primaries.length > 0) {
        const toReplace = pickRandom(primaries);
        stats = stats.filter(s => s !== toReplace);
        usedKeys.delete(`primary-${toReplace.stat}`);
        stats.push(penalty);
        usedKeys.add(`${penalty.type}-${penalty.stat}`);
      }
    }
  }

  // Refill primary if under target
  let primaryNow = stats.filter(s => s.type === 'primary').length;
  while (primaryNow < primaryTarget && attempts < 40) {
    const stat = pickRandom(primaryStats);
    const key = `primary-${stat}`;
    if (!usedKeys.has(key)) {
      stats.push({ stat, value: getRandomInt(5, 20), isPercentage: false, type: 'primary' });
      usedKeys.add(key);
      primaryNow++;
    }
    attempts++;
  }

  const refine = Math.random() < 0.5 ? getRandomInt(1, 10) : 0;

  const item = {
    name: 'Generated Item',
    rarity,
    refine,
    stats,
    group
  };

  
  // Final Cursed Group Enforcement: At least one negative primary stat
  if (group === 'cursed') {
    const hasNegativePrimary = stats.some(s => s.type === 'primary' && s.value < 0);
    if (!hasNegativePrimary) {
      const positivePrimaries = stats.filter(s => s.type === 'primary' && s.value > 0);
      if (positivePrimaries.length > 0) {
        const toInvert = pickRandom(positivePrimaries);
        toInvert.value = -Math.abs(toInvert.value);
        console.log("DEBUG: Enforced cursed primary penalty:", toInvert);
      }
    }
  }

  console.log("DEBUG: Final generated item →", item);
  return item;
}

  const bonusOrder = ['buff', 'unique', 'skill'];
  let bonusAdded = 0;
  const bonusLimit = rarityKey === 'common' ? 1 : bonusOrder.length;
  const bonusChance = {
    common: 0.3, uncommon: 0.3, rare: 0.4, epic: 0.5, legendary: 0.6, unique: 0.7
  }[rarityKey] || 0.3;

  let pairedPenalty = null;

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
          bonusAdded++;

          // Track for cursed pairing
          if (group === 'cursed' && !pairedPenalty && cursedPenaltyPairs[stat]) {
            pairedPenalty = cursedPenaltyPairs[stat];
          }
          break;
        }
        tries++;
      }
    }
  }

  // Step 3: Penalty stat
  let penaltyAdded = false;
  if (group !== 'blessed') {
    let penalty = null;

    if (group === 'cursed' && pairedPenalty) {
      const key = `${pairedPenalty.type}-${pairedPenalty.stat}`;
      if (!usedKeys.has(key)) {
        penalty = {
          stat: pairedPenalty.stat,
          value: pairedPenalty.isPercentage ? -getRandomFloat(1, 10) : -getRandomInt(1, 10),
          isPercentage: pairedPenalty.isPercentage,
          type: pairedPenalty.type
        };
      }
    }

    if (!penalty) {
      const pool = group === 'normal' ? ['primary'] : ['buff', 'unique', 'skill'];
      const penaltyType = pickRandom(pool);
      penalty = generateNegativeStat(penaltyType, usedKeys);
    }

    if (penalty) {
      const key = `${penalty.type}-${penalty.stat}`;
      if (penalty.type === 'primary') {
        const primaries = stats.filter(s => s.type === 'primary' && s.value > 0);
        if (primaries.length > 0) {
          const toReplace = pickRandom(primaries);
          stats = stats.filter(s => s !== toReplace);
          usedKeys.delete(`primary-${toReplace.stat}`);
        }
      }
      stats.push(penalty);
      usedKeys.add(key);
      penaltyAdded = true;
    }
  }

  // Refill primary if needed
  let primaryNow = stats.filter(s => s.type === 'primary').length;
  let safety = 0;
  while (primaryNow < primaryTarget && safety < 30) {
    const stat = pickRandom(primaryStats);
    const key = `primary-${stat}`;
    if (!usedKeys.has(key)) {
      stats.push({ stat, value: getRandomInt(5, 20), isPercentage: false, type: 'primary' });
      usedKeys.add(key);
      primaryNow++;
    }
    safety++;
  }

  const refine = Math.random() < 0.5 ? getRandomInt(1, 10) : 0;

  const item = {
    name: 'Generated Item',
    rarity,
    refine,
    stats,
    group
  };

  
  // Final Cursed Group Enforcement: At least one negative primary stat
  if (group === 'cursed') {
    const hasNegativePrimary = stats.some(s => s.type === 'primary' && s.value < 0);
    if (!hasNegativePrimary) {
      const positivePrimaries = stats.filter(s => s.type === 'primary' && s.value > 0);
      if (positivePrimaries.length > 0) {
        const toInvert = pickRandom(positivePrimaries);
        toInvert.value = -Math.abs(toInvert.value);
        console.log("DEBUG: Enforced cursed primary penalty:", toInvert);
      }
    }
  }

  console.log("DEBUG: Final generated item →", item);
  return item;
}

const generateStats = generateLoot;

function initializeLoot() {
  console.log("Loot system initialized.");
}

export { generateStats, generateLoot, initializeLoot };
