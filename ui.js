// ui.js

function renderItemDisplay(item) {
  const displayBox = document.getElementById('itemDisplay');
  displayBox.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = `${item.name}${item.refine > 0 ? ' +' + item.refine : ''}`;
  title.className = `item-name ${item.rarity.toLowerCase()}`;

  const rarity = document.createElement('p');
  rarity.className = `rarity-label ${item.rarity.toLowerCase()}`;
  rarity.textContent = `${capitalize(item.rarity)}${item.group === 'cursed' ? ' (Cursed)' : item.group === 'blessed' ? ' (Blessed)' : ''}`;

  const statsList = document.createElement('ul');

  if (item.stats && Array.isArray(item.stats)) {
    const order = ['primary', 'buff', 'unique', 'skill'];
    for (const type of order) {
      const positives = item.stats.filter(s => s.type === type && s.value > 0);
      const negatives = item.stats.filter(s => s.type === type && s.value < 0);

      for (const statObj of positives) {
        const li = document.createElement('li');
        const valueStr = statObj.isPercentage ? `+${statObj.value}%` : `+${statObj.value}`;
        li.textContent = `${valueStr} - ${statObj.stat}`;
        statsList.appendChild(li);
      }

      for (const statObj of negatives) {
        const li = document.createElement('li');
        const valueStr = statObj.isPercentage ? `${statObj.value}%` : `${statObj.value}`;
        li.textContent = `${valueStr} - ${statObj.stat}`;
        statsList.appendChild(li);
      }
    }
  }

  displayBox.appendChild(title);
  displayBox.appendChild(rarity);
  displayBox.appendChild(statsList);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export { renderItemDisplay as renderGeneratedItem };