document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  console.log("Detected currentUser from localStorage:", currentUser);
  renderLootApp(currentUser);
});

function renderLootApp(username) {
  const generateButton = document.getElementById("generateLootButton");
  if (!generateButton) {
    console.error("generateLootButton not found in DOM.");
    return;
  }

  generateButton.addEventListener("click", () => {
    generateAndDisplayLoot(username);
  });

  console.log("Rendering loot generator for:", username);
  updateHistoryLog();
  displayCollectionButton();
}
