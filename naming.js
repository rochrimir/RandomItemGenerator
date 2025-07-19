
// naming.js – Required exports for loot system

export const primaryStats = [
  "strength", "dexterity", "intelligence", "vitality", "defense"
];

export const bonusStats = {
  buff: ["attack speed", "cast speed", "movement speed", "evasion", "resistance"],
  unique: ["lifesteal", "critical damage", "mana cost", "hp regen"],
  skill: ["skill duration", "cooldown reduction", "summon damage"]
};

// Pairs: cursed bonus → meaningful penalty
export const cursedPenaltyPairs = {
  "lifesteal": { stat: "hp drain", type: "buff", isPercentage: true },
  "critical damage": { stat: "damage reflection", type: "buff", isPercentage: true },
  "cast speed": { stat: "spell cost", type: "unique", isPercentage: true },
  "movement speed": { stat: "trip chance", type: "buff", isPercentage: true },
  "resistance": { stat: "vulnerability", type: "buff", isPercentage: true },
  "skill duration": { stat: "skill backlash", type: "skill", isPercentage: true },
  "summon damage": { stat: "summon disobedience", type: "skill", isPercentage: true }
};

export function generateNegativeStat(type, usedKeys = new Set()) {
  const pool = {
    primary: primaryStats,
    buff: bonusStats.buff,
    unique: bonusStats.unique,
    skill: bonusStats.skill
  }[type] || [];

  const available = pool.filter(stat => !usedKeys.has(`${type}-${stat}`));
  if (available.length === 0) return null;

  const stat = available[Math.floor(Math.random() * available.length)];
  const isPercentage = (type !== "primary");
  const value = isPercentage
    ? -Math.round((Math.random() * 5 + 1) * 100) / 100  // -1% to -6%
    : -Math.floor(Math.random() * 10 + 1);              // -1 to -10

  return { stat, value, isPercentage, type };
}
