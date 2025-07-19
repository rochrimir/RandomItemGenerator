
// utils.js – shared utility functions

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFloat(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}
