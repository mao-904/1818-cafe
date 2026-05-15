// 🔧 CONFIGURATION
const CONFIG = {
  API_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://one818-cafe.onrender.com/api'
};

console.log('🚀 1818 Cafe App Initialized');
console.log(' API URL:', CONFIG.API_URL);

// Load Menu
async function loadMenu() {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;

  try {
    console.log('📥 Fetching menu...');
    const res = await fetch(`${CONFIG.API_URL}/menu`);
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const items = await res.json();
    console.log('✅ Menu loaded:', items.length, 'items');
    
    grid.innerHTML = items.map(item => `
      <div class="menu-item">
        <h3>${item.name}</h3>
        <p>${item.description || 'Freshly prepared'}</p>
        <span class="price">$${item.price}</span>
      </div>
    `).join('');
  } catch (err) {
    console.error(' Menu fetch failed:', err);
    grid.innerHTML = '<p style="color:red;">Failed to load menu. Check console.</p>';
  }
}

// Handle Reservation Form
const form = document.getElementById('reservation-form');
const statusEl = document.getElementById('form-status');

if (form && statusEl) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('📝 Form submitted');
    
    statusEl.textContent = 'Submitting...';
    statusEl.style.color = '#666';
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log('📤 Payload:', data);
    
    try {
      const res = await fetch(`${CONFIG.API_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      console.log('📥 Response:', res.status, res.statusText);
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }
      
      const result = await res.json();
      console.log('✅ Success:', result);
      
      statusEl.textContent = '✅ Confirmed! We\'ll see you soon.';
      statusEl.style.color = 'green';
      form.reset();
      
    } catch (err) {
      console.error('❌ Reservation failed:', err);
      statusEl.textContent = '❌ Network error. Is backend running?';
      statusEl.style.color = 'red';
    }
  });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', loadMenu);