function handleLogin() {
  const username = document.getElementById("username")?.value.trim();
  const password = document.getElementById("password")?.value;

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[username] && users[username] === password) {
    localStorage.setItem("currentUser", username);
    window.location.href = "index.html";
  } else {
    alert("Invalid username or password.");
  }
}

function handleSignup() {
  const username = document.getElementById("username")?.value.trim();
  const password = document.getElementById("password")?.value;

  if (!username || !password) {
    alert("Please enter both username and password to sign up.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[username]) {
    alert("Username already exists. Please choose a different one.");
  } else {
    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! You can now log in.");
    localStorage.setItem("currentUser", username);
    window.location.href = "index.html";
  }
}

function changeLanguage() {
  alert("Language switching not implemented yet.");
}

function logout() {
  localStorage.removeItem("currentUser");
  location.reload();
}
