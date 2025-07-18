
import './auth.js';
import { renderGeneratedItem } from './ui.js';
import { generateStats, initializeLoot } from './loot.js';

console.log("main.js loaded");

const app = document.getElementById('app');

function generateItemName(rarity) {
  const adjectives = ["Ancient", "Cursed", "Glorious", "Vicious", "Shimmering"];
  const items = ["Sword", "Axe", "Bow", "Dagger", "Amulet", "Cloak"];
  return adjectives[Math.floor(Math.random() * adjectives.length)] + " " +
         items[Math.floor(Math.random() * items.length)];
}

function renderLoginForm() {
  console.log("Rendering login form");
  app.innerHTML = `
    <div class="login-container">
      <h1>RPG Loot Store</h1>
      <input type="text" id="username" placeholder="Username" autocomplete="off" />
      <input type="password" id="password" placeholder="Password" autocomplete="off" />
      <div class="button-row">
        <button id="loginBtn">Log In</button>
        <button id="signupBtn">Sign Up</button>
        <button id="languageBtn">Language</button>
      </div>
      <div style="text-align:center; margin-top:20px;">
        <button id="logoutBtn">Log Out</button>
      </div>
      <div style="text-align:center; margin-top:20px;">
        <a href="credits.html" target="_blank" style="color: #aaa; font-size: 12px;">Credits</a>
      </div>
    </div>
  `;
  import('./auth.js');
  bindLogout();
  bindLanguageBtn();
}

function bindLanguageBtn() {
  const langBtn = document.getElementById('languageBtn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      alert('Language feature coming soon.');
    });
  }
}

function bindLogout() {
  const btn = document.getElementById('logoutBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      location.reload();
    });
  }
}

function saveItemToCollection(username, item) {
  const key = `collection_${username}`;
  const data = JSON.parse(localStorage.getItem(key)) || [];
  data.push({ ...item, isNew: true });
  localStorage.setItem(key, JSON.stringify(data));
}

function renderLootGenerator(username) {
  console.log("Rendering loot generator for:", username);
  app.innerHTML = `
    <h2>Welcome, ${username}!</h2>
    <button id="generateBtn">Generate Loot</button>
    <button id="viewCollectionBtn">View Collection</button>
    <button id="logoutBtn">Log Out</button>
    <div id="itemDisplay" style="margin-top: 20px;"></div>
    <div id="historyLog" style="margin-top: 20px;"></div>
    <div style="text-align:center; margin-top:30px;">
      <a href="credits.html" target="_blank" style="color: #aaa; font-size: 12px;">Credits</a>
    </div>
  `;

  document.getElementById('generateBtn').addEventListener('click', () => {
    const rarityPool = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Unique'];
    const rarity = rarityPool[Math.floor(Math.random() * rarityPool.length)];
    const stats = generateStats(rarity);
    const item = {
      name: generateItemName(rarity),
      rarity,
      refine: Math.floor(Math.random() * 11),
      stats
    };
    const container = document.getElementById('itemDisplay');
    renderGeneratedItem(item, container);
    saveItemToCollection(username, item);
    addToHistory(username, item);
  });

  document.getElementById('viewCollectionBtn').addEventListener('click', () => {
    window.location.href = 'collection.html';
  });

  bindLogout();
}

function addToHistory(username, item) {
  const logBox = document.getElementById('historyLog');
  if (!logBox) return;
  const refine = ` +${item.refine}`;
  const entry = document.createElement('p');
  entry.textContent = `${username} generated [${item.rarity}] ${item.name}${refine}`;
  logBox.prepend(entry);
  if (logBox.children.length > 5) logBox.removeChild(logBox.lastChild);
}

(async () => {
  await initializeLoot();
  const username = localStorage.getItem('currentUser');
  console.log("Detected currentUser from localStorage:", username);
  if (username) {
    renderLootGenerator(username);
  } else {
    renderLoginForm();
  }
})();
