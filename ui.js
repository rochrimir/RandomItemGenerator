
// ui.js – Handles DOM rendering for loot items and history

export function renderItem(item) {
  const display = document.getElementById('item-display');
  display.innerHTML = '';

  const name = document.createElement('h2');
  name.textContent = `${item.name}${item.refine > 0 ? ' +' + item.refine : ''}`;
  name.className = `rarity-${item.rarity.toLowerCase()}`;

  const rarity = document.createElement('p');
  rarity.textContent = `${item.rarity}${item.group === 'cursed' ? ' (Cursed)' : item.group === 'blessed' ? ' (Blessed)' : ''}`;
  rarity.className = `rarity-${item.rarity.toLowerCase()}`;

  const statList = document.createElement('ul');
  console.log("Rendering stats for:", item.name, item.stats);
  item.stats.forEach(stat => {
    const li = document.createElement('li');
    const sign = stat.value > 0 ? '+' : '';
    const suffix = stat.isPercentage ? '%' : '';
    li.textContent = `${sign}${stat.value}${suffix} ${stat.stat}`;
    statList.appendChild(li);
  });

  display.appendChild(name);
  display.appendChild(rarity);
  display.appendChild(statList);
}

export function updateHistoryLog(username, item) {
  const history = document.getElementById('history-log');
  const entry = document.createElement('li');
  entry.textContent = `${username} generated ${item.rarity} ${item.name}${item.refine > 0 ? ' +' + item.refine : ''}`;
  history.prepend(entry);

  // Limit to 5 most recent
  while (history.children.length > 5) {
    history.removeChild(history.lastChild);
  }
}
