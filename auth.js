document.addEventListener('DOMContentLoaded', () => {
  function bindLoginEvents() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (!loginBtn || !signupBtn || !usernameInput || !passwordInput) {
      return;
    }

    function redirectToMain() {
      window.location.href = 'index.html';
    }

    loginBtn.addEventListener('click', () => {
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      if (username && password) {
        localStorage.setItem('currentUser', username);
        redirectToMain();
      } else {
        alert('Please enter a username and password');
      }
    });

    signupBtn.addEventListener('click', () => {
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      if (username && password) {
        localStorage.setItem('currentUser', username);
        alert('Sign up successful!');
        redirectToMain();
      } else {
        alert('Please enter a username and password');
      }
    });
  }

  // Retry binding every 100ms until inputs are present (max 10 tries)
  let attempts = 0;
  const maxAttempts = 10;
  const interval = setInterval(() => {
    if (document.getElementById('username') && document.getElementById('password')) {
      bindLoginEvents();
      clearInterval(interval);
    }
    if (++attempts >= maxAttempts) {
      clearInterval(interval);
    }
  }, 100);
});
