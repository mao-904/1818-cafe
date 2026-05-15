// 🔧 CONFIGURATION
const CONFIG = {
  API_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://one818-cafe.onrender.com/api'  // ← Your exact Render URL
};

console.log(' Using API URL:', CONFIG.API_URL);

// Load menu
async function loadMenu() {
  try {
    console.log('📡 Fetching menu from:', CONFIG.API_URL + '/menu');
    const response = await fetch(CONFIG.API_URL + '/menu');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const items = await response.json();
    console.log('✅ Menu loaded:', items.length, 'items');
    
    const grid = document.getElementById('menu-grid');
    if (!grid) {
      console.error('❌ Menu grid element not found');
      return;
    }
    
    if (items.length === 0) {
      grid.innerHTML = '<p>No menu items available.</p>';
      return;
    }
    
    grid.innerHTML = items.map(item => `
      <div class="menu-item">
        <h3>${item.name}</h3>
        <p>${item.description || 'Freshly made'}</p>
        <span class="price">$${item.price}</span>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('❌ Failed to load menu:', error);
    const grid = document.getElementById('menu-grid');
    if (grid) {
      grid.innerHTML = '<p style="color: red;">Failed to load menu. Is the backend running?</p>';
    }
  }
}

// Handle reservation form
const form = document.getElementById('reservation-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('📝 Form submitted');
    
    const statusEl = document.getElementById('form-status');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    console.log('📤 Sending reservation:', data);
    
    try {
      const response = await fetch(CONFIG.API_URL + '/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit reservation');
      }
      
      const result = await response.json();
      console.log('✅ Reservation created:', result);
      
      if (statusEl) {
        statusEl.textContent = '✅ Confirmed! We\'ll see you soon.';
        statusEl.style.color = 'green';
      }
      
      form.reset();
      
    } catch (error) {
      console.error('❌ Reservation failed:', error);
      if (statusEl) {
        statusEl.textContent = '❌ Network error. Is backend running?';
        statusEl.style.color = 'red';
      }
    }
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 App initialized');
  loadMenu();
});

// Also load immediately in case DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  loadMenu();
}