import { ApiService } from '../services/api.js';
import { AuthService } from '../services/auth.js';
import { FavoritesService } from '../services/favorites.js';

// Exponer servicios globalmente para uso en HTML
window.FavoritesService = FavoritesService;
window.AuthService = AuthService;

window.logoutClient = () => {
  AuthService.logout();
};

window.loginClient = () => {
  AuthService.loginAsClient();
};

window.toggleFav = (e, productId) => {
  e.preventDefault();
  e.stopPropagation();
  const isFav = FavoritesService.toggleFavorite(productId);
  const btn = e.currentTarget;
  
  if (isFav) {
    btn.classList.add('active');
    btn.querySelector('svg').setAttribute('fill', 'currentColor');
    window.showToast('Agregado a favoritos ❤️', 'success');
  } else {
    btn.classList.remove('active');
    btn.querySelector('svg').setAttribute('fill', 'none');
    window.showToast('Eliminado de favoritos', 'warning');
  }
  
  // Si estamos en la página de favoritos, recargar la vista
  if (window.location.pathname.includes('/account/') && document.getElementById('tab-favorites').classList.contains('active')) {
    if (typeof window.renderFavorites === 'function') window.renderFavorites();
  }
};

// --- CONTROL DE MODO MANTENIMIENTO ---
const settings = ApiService.getSettings();
const currentPath = window.location.pathname;
const baseUrl = window.BASE_URL || '';
const isAdmin = currentPath.includes('/admin');
const isMaintenancePage = currentPath.includes('/maintenance');

if (settings.maintenanceMode && !isAdmin && !isMaintenancePage) {
  window.location.href = baseUrl + '/maintenance/';
} else if (!settings.maintenanceMode && isMaintenancePage) {
  window.location.href = baseUrl + '/';
}

// Global utilities
window.showToast = function(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

window.formatPrice = function(price) {
  return `S/ ${parseFloat(price).toFixed(2)}`;
};

window.fileToBase64 = function(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

window.generateProductCardHTML = function(product) {
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
  const hasSale = product.originalPrice && product.originalPrice > product.price;
  const isFav = window.FavoritesService ? window.FavoritesService.isFavorite(product.id) : false;
  
  let stockHtml = '';
  if(product.stock > 10) stockHtml = `<span class="product-stock">🟢 Disponible</span>`;
  else if(product.stock > 0) stockHtml = `<span class="product-stock low">🟠 ¡Solo quedan ${product.stock}!</span>`;
  else stockHtml = `<span class="product-stock out">🔴 Agotado</span>`;

  return `
    <div class="product-card">
      <span class="product-category-badge">${product.category}</span>
      ${hasSale ? `<span class="product-sale-badge">¡Oferta!</span>` : ''}
      
      <button class="fav-btn ${isFav ? 'active' : ''}" onclick="window.toggleFav(event, '${product.id}')" title="Añadir a Favoritos">
        <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="${isFav ? 'currentColor' : 'none'}" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      </button>

      <a href="/product/?id=${product.id}" class="product-img-container">
        <img src="${mainImage}" alt="${product.name}" class="product-img" loading="lazy">
      </a>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        ${stockHtml}
        <div class="product-footer">
          <div class="price-container">
            ${hasSale ? `<span class="price-original">${window.formatPrice(product.originalPrice)}</span>` : ''}
            <span class="product-price ${hasSale ? 'sale' : ''}">${window.formatPrice(product.price)}</span>
          </div>
          <a href="/product/?id=${product.id}" class="btn btn-outline btn-sm" style="border-radius: 8px;">
            Ver Detalles
          </a>
        </div>
      </div>
    </div>
  `;
};
