
document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('currentUser');
  if (!username) {
    document.body.innerHTML = '<p>Please log in first.</p>';
    return;
  }

  const key = `collection_${username}`;
  const seenKey = "seenCollection";
  const data = JSON.parse(localStorage.getItem(key)) || [];
  const seen = JSON.parse(localStorage.getItem(seenKey)) || {};

  const grouped = {};
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Unique'];
  rarities.forEach(r => grouped[r] = []);

  data.forEach((item, index) => {
    const id = `${item.name}-${index}`;
    item.id = id;
    if (!(id in seen)) seen[id] = false;
    grouped[item.rarity]?.push(item);
  });

  const container = document.getElementById('rarity-folders');

  rarities.forEach(rarity => {
    const group = grouped[rarity] || [];
    const section = document.createElement('div');
    section.classList.add('rarity-group');

    const header = document.createElement('h3');
    header.textContent = rarity;
    header.className = rarity.toLowerCase();
    header.setAttribute('data-rarity', rarity);

    const unseenCount = group.filter(item => !seen[item.id]).length;
    if (unseenCount > 0) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = unseenCount;
      header.appendChild(badge);
    }

    section.appendChild(header);
    const list = document.createElement('ul');

    group.forEach(item => {
      const li = document.createElement('li');
      li.classList.add('item-entry');

      const label = document.createElement('span');
      label.textContent = `${item.name}${item.refine > 0 ? ' +' + item.refine : ''}`;
      label.className = 'item-name ' + rarity.toLowerCase();

      li.appendChild(label);

      if (!seen[item.id]) {
        const newTag = document.createElement('span');
        newTag.className = 'badge';
        newTag.textContent = 'NEW';
        li.appendChild(newTag);
      }

      li.addEventListener('click', () => {
        seen[item.id] = true;
        localStorage.setItem(seenKey, JSON.stringify(seen));
        showItemDetails(item);
        updateBadges();
      });

      list.appendChild(li);
    });

    section.appendChild(list);
    container.appendChild(section);
  });

  function updateBadges() {
    const seen = JSON.parse(localStorage.getItem('seenCollection') || '{}');
    document.querySelectorAll('.rarity-group').forEach(group => {
      const rarity = group.querySelector('h3')?.getAttribute('data-rarity');
      const items = grouped[rarity] || [];
      const badge = group.querySelector('.badge');
      const unseen = items.filter(item => !seen[item.id]);
      if (badge) {
        if (unseen.length === 0) badge.remove();
        else badge.textContent = unseen.length;
      }
    });

    document.querySelectorAll('.item-entry').forEach((li, index) => {
      const newTag = li.querySelector('.badge');
      const label = li.querySelector('span');
      if (newTag && label) {
        const name = label.textContent.replace(/\s+\+\d+$/, '');
        const id = `${name}-${index}`;
        if (seen[id]) newTag.remove();
      }
    });
  }

  function showItemDetails(item) {
    const display = document.getElementById('selected-item-display');
    display.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = `${item.name}${item.refine > 0 ? ' +' + item.refine : ''}`;
    title.className = 'item-name';

    const rarity = document.createElement('p');
    rarity.textContent = item.rarity;
    rarity.classList.add('rarity-label', item.rarity.toLowerCase());

    const statList = document.createElement('ul');
    if (item.stats && Array.isArray(item.stats)) {
      item.stats.forEach(stat => {
        const li = document.createElement('li');
        li.textContent = stat;
        statList.appendChild(li);
      });
    }

    const reprintBtn = document.createElement('button');
    reprintBtn.textContent = 'Re-print';
    reprintBtn.addEventListener('click', () => {
      showItemDetails(item);
    });

    display.appendChild(title);
    display.appendChild(rarity);
    display.appendChild(statList);
    display.appendChild(reprintBtn);
  }

  const backBtn = document.getElementById('backToMain');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
});
