
// storage.js – handles saving and retrieving loot items by user

export function saveItemToStorage(username, item) {
  const key = `loot_${username}`;
  const existing = JSON.parse(localStorage.getItem(key)) || [];
  existing.push(item);
  localStorage.setItem(key, JSON.stringify(existing));
}

export function getStoredItems(username) {
  const data = localStorage.getItem(`loot_${username}`);
  return data ? JSON.parse(data) : [];
}
