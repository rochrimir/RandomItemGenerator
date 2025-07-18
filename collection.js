import { renderGeneratedItem } from './ui.js';

window.onload = () => {
  const container = document.getElementById('collectionContainer');
  const detailBox = document.getElementById('itemDetails');
  const username = localStorage.getItem('currentUser');
  if (!username || !container) return;

  const key = `collection_${username}`;
  const data = JSON.parse(localStorage.getItem(key)) || [];

  const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'unique'];
  const grouped = Object.fromEntries(rarityOrder.map(r => [r, []]));

  for (const item of data) {
    const r = item.rarity.toLowerCase();
    if (grouped[r]) grouped[r].push(item);
  }

  for (const rarity of rarityOrder) {
    const items = grouped[rarity];
    if (!items.length) continue;

    const rarityBox = document.createElement('div');
    rarityBox.className = 'rarity-group';

    const header = document.createElement('div');
    header.className = `rarity-header ${rarity}`;
    header.innerHTML = `<span>${capitalize(rarity)}</span>`;

    const unseenCount = items.filter(i => i.isNew).length;
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = unseenCount;
    if (unseenCount === 0) badge.style.display = 'none';
    header.appendChild(badge);

    const list = document.createElement('div');
    list.className = 'item-list';

    items.forEach((item, idx) => {
      const p = document.createElement('p');
      const newBadge = item.isNew ? '<span class="new-badge">NEW</span>' : '';
      p.innerHTML = `${newBadge}<span class="item-name ${rarity}">${item.name}${item.refine > 0 ? ' +' + item.refine : ''}</span>`;
      p.style.cursor = 'pointer';

      p.addEventListener('click', () => {
        item.isNew = false;
        badge.textContent = items.filter(i => i.isNew).length;
        if (badge.textContent === "0") badge.style.display = 'none';
        p.innerHTML = `<span class="item-name ${rarity}">${item.name}${item.refine > 0 ? ' +' + item.refine : ''}</span>`;
        if (detailBox) {
          renderGeneratedItem(item, detailBox);
        }
        localStorage.setItem(key, JSON.stringify(data));
      });

      list.appendChild(p);
    });

    header.addEventListener('click', () => {
      list.style.display = list.style.display === 'block' ? 'none' : 'block';
    });

    rarityBox.appendChild(header);
    rarityBox.appendChild(list);
    container.appendChild(rarityBox);
  }

  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.onclick = () => {
      window.location.href = 'index.html';
    };
  }
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}