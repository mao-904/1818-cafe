// 🔧 CONFIG: Points to your running backend
const API_URL = "http://localhost:3000/api";

async function loadMenu() {
  const grid = document.getElementById("menu-grid");
  try {
    const res = await fetch(`${API_URL}/menu`);
    const items = await res.json();
    grid.innerHTML = items.length ? items.map(i => `
      <div class="menu-item">
        <h3>${i.name}</h3>
        <p>${i.description || "Freshly made daily."}</p>
        <span class="price">$${i.price}</span>
      </div>
    `).join("") : "<p>No items available.</p>";
  } catch (err) {
    grid.innerHTML = "<p>Failed to load menu. Is the backend running?</p>";
    console.error(err);
  }
}

document.getElementById("reservation-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const status = document.getElementById("form-status");
  status.textContent = "Submitting...";
  status.style.color = "#555";
  
  try {
    const data = Object.fromEntries(new FormData(e.target));
    const res = await fetch(`${API_URL}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (res.ok) {
      status.textContent = "✅ Reservation confirmed! We'll see you soon.";
      status.style.color = "green";
      e.target.reset();
    } else {
      status.textContent = json.error || "Failed. Try again.";
      status.style.color = "red";
    }
  } catch (err) {
    status.textContent = "Network error. Is backend running?";
    status.style.color = "red";
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
loadMenu();