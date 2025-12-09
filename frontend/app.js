// Shared JS for auth + nav + helpers
const API_BASE = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Insert nav bar dynamically
async function renderNav() {
  const user = await getCurrentUser();
  const nav = document.createElement("nav");
  nav.innerHTML = `
    <a href="home.html">Home</a>
    <a href="rules.html">Rules</a>
    ${user ? `<a href="picks.html">Picks</a>` : ""}
    ${user ? `<a href="account.html">Account</a>` : `<a href="login.html">Login / Register</a>`}
    ${user && user.role === "admin" ? `<a href="admin.html">Admin</a>` : ""}
    ${user ? `<a href="#" id="logout-link">Logout</a>` : ""}
  `;
  document.body.prepend(nav);

  const logout = document.getElementById("logout-link");
  if (logout) {
    logout.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      window.location.href = "home.html";
    });
  }
}

// Call renderNav immediately
renderNav();
