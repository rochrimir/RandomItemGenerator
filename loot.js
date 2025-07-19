
function generateLoot(rarity) {
  // ...loot generation logic...

  
  // Final Group Enforcement Rules

  // -- Cursed Group Enforcement --
  if (group === 'cursed') {
    // Ensure at least one negative primary stat
    const hasNegativePrimary = stats.some(s => s.type === 'primary' && s.value < 0);
    if (!hasNegativePrimary) {
      const positivePrimaries = stats.filter(s => s.type === 'primary' && s.value > 0);
      if (positivePrimaries.length > 0) {
        const toInvert = pickRandom(positivePrimaries);
        toInvert.value = -Math.abs(toInvert.value);
        console.log("DEBUG: Forced cursed negative primary:", toInvert);
      }
    }

    // Ensure at least one buff-penalty stat (non-primary, negative)
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
        // If primary, convert one positive primary into this
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
