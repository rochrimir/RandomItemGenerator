import { renderGeneratedItem } from './ui.js';

window.onload = () => {
  const container = document.getElementById('collectionContainer');
  const detailBox = document.getElementById('itemDetails');
  const username = localStorage.getItem('currentUser');
  if (!username || !container) return;

  const key = `collection_${username}`;
  const data = JSON.parse(localStorage.getItem(key)) || [];
  const grouped = {};

  for (const item of data) {
    if (!grouped[item.rarity]) grouped[item.rarity] = [];
    grouped[item.rarity].push(item);
  }

  for (const rarity of Object.keys(grouped)) {
    const rarityBox = document.createElement('div');
    rarityBox.className = 'rarity-group';

    const header = document.createElement('div');
    header.className = 'rarity-header';
    header.innerHTML = `<span>${rarity}</span>`;

    const unseenCount = grouped[rarity].filter(i => i.isNew).length;
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = unseenCount;
    if (unseenCount === 0) badge.style.display = 'none';
    header.appendChild(badge);

    const list = document.createElement('div');
    list.className = 'item-list';

    grouped[rarity].forEach((item, idx) => {
      const p = document.createElement('p');
      const newBadge = item.isNew ? '<span class="new-badge">NEW</span>' : '';
      p.innerHTML = `${newBadge}${item.name}${item.refine > 0 ? ' +' + item.refine : ''}`;
      p.style.cursor = 'pointer';

      p.addEventListener('click', () => {
        item.isNew = false;
        badge.textContent = grouped[rarity].filter(i => i.isNew).length;
        if (badge.textContent === "0") badge.style.display = 'none';
        p.innerHTML = `${item.name}${item.refine > 0 ? ' +' + item.refine : ''}`;
        detailBox.innerHTML = '';
        renderGeneratedItem(item, detailBox);
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