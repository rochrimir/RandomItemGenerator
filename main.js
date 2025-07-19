
// main.js – Entry point for RPG Loot Store

import { generateLoot } from './loot.js';
import { renderItem, updateHistoryLog } from './ui.js';
import { saveItemToStorage, getStoredItems } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log("main.js loaded");

  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  console.log("Detected currentUser from localStorage:", currentUser);
  renderLootApp(currentUser);
});

function renderLootApp(username) {
  console.log("Rendering loot generator for:", username);

  const generateBtn = document.getElementById('generate-btn');
  generateBtn.addEventListener('click', () => {
    const rarity = document.getElementById('rarity-select').value;
    const loot = generateLoot(rarity);
    renderItem(loot);
    updateHistoryLog(username, loot);
    saveItemToStorage(username, loot);
  });
}
