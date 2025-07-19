
// loot.js v11.9 – Full functional rebuild

import { getRandomInt, getRandomFloat, pickRandom } from './utils.js';
import { bonusStats, primaryStats, cursedPenaltyPairs, generateNegativeStat } from './naming.js';

export function generateLoot(rarity) {
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

  // Primary stats
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

  // Bonus stats
  const bonusOrder = ['buff', 'unique', 'skill'];
  let bonusAdded = 0;
  const bonusLimit = {
    common: 1, uncommon: 1, rare: 2, epic: 3, legendary: 3, unique: 3
  }[rarityKey];

  const bonusChance = {
    common: 0.3, uncommon: 0.3, rare: 0.4, epic: 0.5, legendary: 0.6, unique: 0.7
  }[rarityKey] || 0.3;

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

  // Fallback penalties
  if (group === 'cursed' && !usedPairing) {
    const fallback = generateNegativeStat(pickRandom(['buff', 'unique', 'skill']), usedKeys);
    if (fallback) {
      stats.push(fallback);
      usedKeys.add(`${fallback.type}-${fallback.stat}`);
    }
  }

  // Final Group Enforcement Rules

  // -- Cursed Group Enforcement --
  if (group === 'cursed') {
    const hasNegativePrimary = stats.some(s => s.type === 'primary' && s.value < 0);
    if (!hasNegativePrimary) {
      const positivePrimaries = stats.filter(s => s.type === 'primary' && s.value > 0);
      if (positivePrimaries.length > 0) {
        const toInvert = pickRandom(positivePrimaries);
        toInvert.value = -Math.abs(toInvert.value);
        console.log("DEBUG: Forced cursed negative primary:", toInvert);
      }
    }

    const hasPenaltyBonus = stats.some(s => s.type !== 'primary' && s.value < 0);
    if (!hasPenaltyBonus) {
      const penalty = generateNegativeStat(pickRandom(['buff', 'unique', 'skill']), usedKeys);
      if (penalty) {
        stats.push(penalty);
        usedKeys.add(`${penalty.type}-${penalty.stat}`);
        console.log("DEBUG: Forced cursed bonus penalty:", penalty);
      }
    }
  }

  // -- Normal Group Enforcement --
  if (group === 'normal') {
    const hasNegative = stats.some(s => s.value < 0);
    if (!hasNegative) {
      const sourcePool = pickRandom(['primary', 'buff', 'unique', 'skill']);
      const penalty = generateNegativeStat(sourcePool, usedKeys);
      if (penalty) {
        if (penalty.type === 'primary') {
          const positives = stats.filter(s => s.type === 'primary' && s.value > 0);
          if (positives.length > 0) {
            const toReplace = pickRandom(positives);
            stats = stats.filter(s => s !== toReplace);
            usedKeys.delete(`primary-${toReplace.stat}`);
          }
        }
        stats.push(penalty);
        usedKeys.add(`${penalty.type}-${penalty.stat}`);
        console.log("DEBUG: Forced normal group penalty stat:", penalty);
      }
    }
  }

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
