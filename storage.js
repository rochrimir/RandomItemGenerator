function saveToCollection(item) {
  const user = localStorage.getItem('currentUser');
  const collection = JSON.parse(localStorage.getItem('lootCollection') || '{}');
  if (!collection[item.rarity]) collection[item.rarity] = [];
  collection[item.rarity].push(item);
  localStorage.setItem('lootCollection', JSON.stringify(collection));

  const seen = JSON.parse(localStorage.getItem('seenCollection') || '{}');
  seen[item.id] = false;
  localStorage.setItem('seenCollection', JSON.stringify(seen));
}

function logHistory(item) {
  const user = localStorage.getItem('currentUser') || 'Someone';
  const history = JSON.parse(localStorage.getItem('lootHistory') || '[]');
  const entry = `${user} generated ${item.rarity} ${item.name}${item.refine > 0 ? ' +' + item.refine : ''}`;
  history.unshift(entry);
  localStorage.setItem('lootHistory', JSON.stringify(history));
}