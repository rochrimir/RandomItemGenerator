window.onload = () => {
  const username = localStorage.getItem('currentUser');
  if (!username) {
    document.body.innerHTML = '<h2>Please log in first.</h2>';
    return;
  }

  const backButton = document.getElementById('backBtn');
  if (backButton) {
    backButton.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  const collectionKey = `collection_${username}`;
  const collectionData = JSON.parse(localStorage.getItem(collectionKey)) || [];

  const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'unique'];
  const container = document.getElementById('collectionContainer');

  rarityOrder.forEach(rarity => {
    const group = document.createElement('div');
    group.className = 'rarity-group';

    const header = document.createElement('h3');
    header.textContent = rarity.charAt(0).toUpperCase() + rarity.slice(1);
    header.className = `rarity-header ${rarity}`;

    const list = document.createElement('ul');
    list.className = 'item-list';

    const items = collectionData.filter(item => item.rarity.toLowerCase() === rarity);
    items.forEach(item => {
      const li = document.createElement('li');
      const itemLabel = document.createElement('span');
      itemLabel.textContent = `${item.name}${item.refine > 0 ? ' +' + item.refine : ''}`;
      itemLabel.className = `item-name ${item.rarity.toLowerCase()}`;
      if (item.isNew) {
        const badge = document.createElement('span');
        badge.className = 'new-badge';
        badge.textContent = 'NEW';
        li.appendChild(badge);
      }

      li.appendChild(itemLabel);
      li.addEventListener('click', () => {
        item.isNew = false;
        localStorage.setItem(collectionKey, JSON.stringify(collectionData));
        showItemDetails(item);
      });

      list.appendChild(li);
    });

    group.appendChild(header);
    group.appendChild(list);
    container.appendChild(group);
  });
};

function showItemDetails(item) {
  const display = document.getElementById('itemDetails');
  display.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = `${item.name}${item.refine > 0 ? ' +' + item.refine : ''}`;
  title.className = `item-name ${item.rarity.toLowerCase()}`;

  const rarity = document.createElement('p');
  rarity.className = `rarity-label ${item.rarity.toLowerCase()}`;
  rarity.textContent = `${capitalize(item.rarity)}${item.group === 'cursed' ? ' (Cursed)' : item.group === 'blessed' ? ' (Blessed)' : ''}`;

  const statsList = document.createElement('ul');
  const order = ['primary', 'buff', 'unique', 'skill'];

  for (const type of order) {
    const positives = item.stats.filter(s => s.type === type && s.value > 0);
    const negatives = item.stats.filter(s => s.type === type && s.value < 0);

    positives.forEach(statObj => {
      const li = document.createElement('li');
      const valueStr = statObj.isPercentage ? `+${statObj.value}%` : `+${statObj.value}`;
      li.textContent = `${valueStr} - ${statObj.stat}`;
      statsList.appendChild(li);
    });

    negatives.forEach(statObj => {
      const li = document.createElement('li');
      const valueStr = statObj.isPercentage ? `${statObj.value}%` : `${statObj.value}`;
      li.textContent = `${valueStr} - ${statObj.stat}`;
      statsList.appendChild(li);
    });
  }

  display.appendChild(title);
  display.appendChild(rarity);
  display.appendChild(statsList);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}