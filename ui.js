
// ui.js – Handles DOM rendering

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
