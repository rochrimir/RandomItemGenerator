function parseFormatString(format, context) {
  return format.replace(/\[([^\]]+)\]/g, (_, token) => {
    if (token === "JobSuffix's") return getRandomElement(context.jobSuffixes) + "'s";
    if (token === 'JobSuffix') return getRandomElement(context.jobSuffixes);
    if (token === 'StatDescriptor') return context.statDescriptor || '';
    if (token === 'Effect') return context.effect || '';
    if (token === 'General') return getRandomElement(context.prefixes) || '';
    if (token === 'Base') return getRandomElement(context.bases) || '';
    if (token === 'Suffix') return getRandomElement(context.suffixes) || '';
    return '';
  }).replace(/\s+/g, ' ').trim();
}

function generateFullName(rarity, mainStat, effectKey) {
  if (!namingDB || !namingDB.naming_format_weights) return '[Name Unavailable]';
  const formatOptions = namingDB.naming_format_weights[rarity];
  const format = weightedRandom(formatOptions);
  const context = {
    prefixes: namingDB.prefixes[rarity] || [],
    bases: namingDB.bases[rarity] || [],
    suffixes: namingDB.suffixes[rarity] || [],
    statDescriptor: namingDB.statDescriptors[mainStat.toLowerCase()] || '',
    jobSuffixes: namingDB.jobSuffixes[mainStat.toLowerCase()] || [],
    effect: getRandomElement(namingDB.effectDescriptors[effectKey] || [])
  };
  return parseFormatString(format, context);
}