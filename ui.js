
function applyRarityColor(rarity, element) {
  const colorMap = {
    Common: '#ccc',
    Uncommon: '#3fa34d',
    Rare: '#3380cc',
    Epic: '#a33fd1',
    Legendary: '#d1a33f',
    Unique: '#ff5050'
  };
  element.style.color = colorMap[rarity] || '#fff';
}

function renderGeneratedItem(item, container) {
  container.innerHTML = '';

  const title = document.createElement('h2');

  const nameSpan = document.createElement('span');
  nameSpan.classList.add('item-name');
  nameSpan.textContent = item.name;

  const refineSpan = document.createElement('span');
  refineSpan.classList.add('refine-level');
  refineSpan.textContent = ` +${item.refine}`;

  title.appendChild(nameSpan);
  title.appendChild(refineSpan);
  applyRarityColor(item.rarity, title);

  const rarity = document.createElement('p');
  rarity.textContent = item.rarity;
  rarity.classList.add('rarity-label', item.rarity.toLowerCase());

  const statList = document.createElement('ul');
  item.stats.forEach(stat => {
    const li = document.createElement('li');
    li.textContent = stat;
    statList.appendChild(li);
  });

  container.appendChild(title);
  container.appendChild(rarity);
  container.appendChild(statList);
}

function renderHistoryEntry(entry) {
  const item = entry.item;
  const refine = item.refine > 0 ? ` +${item.refine}` : '';
  return `${entry.username} generated [${item.rarity}] ${item.name}${refine}`;
}

export { renderGeneratedItem, renderHistoryEntry };
