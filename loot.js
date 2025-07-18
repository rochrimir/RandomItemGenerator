import { getRandomFromArray, getRandomInt } from './utils.js';

let namingData = null;

const percentageStats = [
  'lifesteal', 'evasion', 'cooldown reduction',
  'resistance to fire', 'resistance to ice', 'resistance to bleed',
  'resistance to physical', 'resistance to lightning', 'resistance to poison'
];

async function initializeLoot() {
  const response = await fetch('./naming-db.json');
  namingData = await response.json();
}

function getStatValue(stat, rarity) {
  let range = [5, 15];

  if (namingData.stat_ranges) {
    const group = namingData.stat_ranges[stat];
    if (group) {
      range = group[rarity.toLowerCase()] || range;
    }
  }

  const min = Math.max(range[0], 1);
  const max = range[1];
  return getRandomInt(min, max);
}

function formatStat(stat, value) {
  const sign = value >= 0 ? '+' : '-';
  const absValue = Math.abs(value);
  const suffix = percentageStats.includes(stat.toLowerCase()) ? '%' : '';
  return `${sign}${absValue}${suffix} - ${stat}`;
}


function generateItemName(rarity) {
  const adjectives = ["Ancient", "Cursed", "Glorious", "Vicious", "Shimmering"];
  const items = ["Sword", "Axe", "Bow", "Dagger", "Amulet", "Cloak"];
  return getRandomFromArray(adjectives) + " " + getRandomFromArray(items);
}

function generateStats(rarity) {

  let stats = []; const usedStats = new Set(); let attempts = 0;
  const baseStats = [...namingData.primary_stats];
  const uniquePool = [...namingData.unique_stats];
  const buffPool = [...namingData.buff_stats];
  const skillPool = [...namingData.skill_stats];

  let primaryCount = {
    Common: 3,
    Uncommon: 4,
    Rare: 5,
    Epic: 6,
    Legendary: 7,
    Unique: 8
  }[rarity];

  let uniqueCount = {
    Rare: 1,
    Epic: 2,
    Legendary: 3,
    Unique: 4
  }[rarity] || 0;

  let buffCount = {
    Legendary: 1,
    Unique: 2
  }[rarity] || 0;

  for (let i = 0; i < primaryCount; i++) {
    const stat = getRandomFromArray(baseStats);
    const value = getStatValue(stat, rarity);
    if (!usedStats.has(stat)) { stats.push(formatStat(stat, value)); usedStats.add(stat); }
  }

  for (let i = 0; i < uniqueCount; i++) {
    const stat = getRandomFromArray(uniquePool);
    const value = getStatValue(stat, rarity);
    if (!usedStats.has(stat)) { stats.push(formatStat(stat, value)); usedStats.add(stat); }
  }

  for (let i = 0; i < buffCount; i++) {
    const stat = getRandomFromArray(buffPool);
    const value = getStatValue(stat, rarity);
    if (!usedStats.has(stat)) { stats.push(formatStat(stat, value)); usedStats.add(stat); }
  }

  if (Math.random() < 0.3) {
    const bonusPools = [buffPool, uniquePool, skillPool];
    const pool = getRandomFromArray(bonusPools);
    const stat = getRandomFromArray(pool);
    let base = getStatValue(stat, rarity);
    let bonusMultiplier = {
      Common: [1, 3],
      Uncommon: [1, 3],
      Rare: [2, 5],
      Epic: [5, 7]
    }[rarity] || [0, 0];

    const bonus = Math.floor(base * (getRandomInt(...bonusMultiplier) / 100));
    const value = base + bonus;
    if (!usedStats.has(stat)) { stats.push(formatStat(stat, value)); usedStats.add(stat); }
  }

  
while (stats.length < primaryCount + uniqueCount + buffCount) {
  const allPools = [...baseStats, ...uniquePool, ...buffPool];
  const stat = getRandomFromArray(allPools);
  const value = getStatValue(stat, rarity);
  if (!usedStats.has(stat)) {
    stats.push(formatStat(stat, value));
    usedStats.add(stat);
  }
  if (++attempts > 50) break;
}
return stats;

}

export { initializeLoot, generateStats };
