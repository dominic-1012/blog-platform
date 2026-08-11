const API_BASE = '/api';

function getToken() { return localStorage.getItem('token'); }
function getUsername() { return localStorage.getItem('username'); }
function isLoggedIn() { return !!getToken(); }
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = 'index.html';
}

async function apiRequest(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const res = await fetch(API_BASE + path, { ...options, headers });
  let data = null;
  try { data = await res.json(); } catch (e) { /* no body */ }

  if (!res.ok) {
    const msg = (data && (data.message || Object.values(data)[0])) || 'Request failed';
    throw new Error(msg);
  }
  return data;
}

function renderNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  if (isLoggedIn()) {
    nav.innerHTML = `
      <div class="brand"><a href="index.html" style="color:inherit;text-decoration:none;">Thiranex Blog</a></div>
      <div>
        <span style="margin-right:1rem;">Hi, ${getUsername()}</span>
        <a href="create-post.html">New Post</a>
        <button class="ghost" onclick="logout()">Logout</button>
      </div>`;
  } else {
    nav.innerHTML = `
      <div class="brand"><a href="index.html" style="color:inherit;text-decoration:none;">Thiranex Blog</a></div>
      <div>
        <a href="login.html">Login</a>
        <a href="register.html">Register</a>
      </div>`;
  }
}
