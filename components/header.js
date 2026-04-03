import { CartService } from '../services/cart.js';
import { CONFIG } from '../config/config.js';
import { AuthService } from '../services/auth.js';
import { ApiService } from '../services/api.js';

export function renderHeader() {
  const user = AuthService.getUser();
  
  // Leer storeName de localStorage SIEMPRE (prioridad sobre CONFIG)
  let storeName = 'TrendStore';
  try {
    const settings = ApiService.getSettings();
    if (settings && settings.storeName) {
      storeName = settings.storeName;
    } else if (CONFIG.STORE_NAME) {
      storeName = CONFIG.STORE_NAME;
    }
  } catch(e) {
    storeName = CONFIG.STORE_NAME || 'TrendStore';
  }
  
  const headerHtml = `
    <header>
      <div class="container nav-container">
        <a href="${window.BASE_URL}/" class="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-color);"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path></svg>
          <span id="header-store-name">${storeName}</span><span style="color:var(--primary-color)">.</span>
        </a>
        
        <nav class="nav-links">
          <a href="${window.BASE_URL}/" class="nav-item">Inicio</a>
          <a href="${window.BASE_URL}/categories/" class="nav-item">Catálogo</a>
          
          <div class="color-switcher">
            <button class="color-btn" data-color="indigo" style="background: #4f46e5;" title="Indigo"></button>
            <button class="color-btn" data-color="rose" style="background: #e11d48;" title="Rose"></button>
            <button class="color-btn" data-color="emerald" style="background: #059669;" title="Emerald"></button>
            <button class="color-btn" data-color="amber" style="background: #d97706;" title="Amber"></button>
          </div>

          <button id="theme-toggle" class="btn btn-outline" style="padding: 6px 10px; border-radius: 8px; border: none;" title="Modo Oscuro">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </button>
          
          <div style="display: flex; align-items: center; gap: 15px; margin-left: 5px;">
            <a href="${window.BASE_URL}/cart/" class="cart-icon" title="Carrito">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span id="cart-count-badge" class="cart-count" style="display:none;">0</span>
            </a>

            <div class="user-menu" id="user-menu">
              ${user 
                ? `<div class="user-avatar" id="user-avatar" title="Mi Cuenta">${user.name.charAt(0).toUpperCase()}</div>`
                : `<a href="${window.BASE_URL}/login/" class="btn btn-outline btn-sm">Ingresar</a>`
              }
              <div class="user-dropdown" id="user-dropdown">
                ${user ? `
                  <div class="user-dropdown-header">
                    <div class="user-dropdown-name">${user.name}</div>
                    <div class="user-dropdown-email">${user.email}</div>
                  </div>
                  ${['admin', 'superadmin', 'owner', 'support'].includes((user.role || '').toLowerCase()) ? `
                    <a href="${window.BASE_URL}/admin/" class="user-dropdown-item">⚙️ Panel Admin</a>
                    <a href="${window.BASE_URL}/account/?tab=profile" class="user-dropdown-item">👤 Mi Perfil</a>
                  ` : `
                    <a href="${window.BASE_URL}/account/?tab=profile" class="user-dropdown-item">👤 Mi Perfil</a>
                    <a href="${window.BASE_URL}/account/?tab=purchases" class="user-dropdown-item">📦 Mis Compras</a>
                    <a href="${window.BASE_URL}/account/?tab=favorites" class="user-dropdown-item">❤️ Mis Favoritos</a>
                  `}
                  <div class="user-dropdown-item danger" id="btn-logout" style="${['admin', 'superadmin', 'owner', 'support'].includes((user.role || '').toLowerCase()) ? '' : 'border-top: 1px dashed var(--border-color);'}">🚪 Cerrar Sesión</div>
                ` : ''}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  `;
  
  document.getElementById('header-container').innerHTML = headerHtml;
  CartService.updateCartCount();

  // --- USER DROPDOWN LOGIC ---
  const userAvatar = document.getElementById('user-avatar');
  const userDropdown = document.getElementById('user-dropdown');
  const btnLogout = document.getElementById('btn-logout');
  
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      AuthService.logout();
    });
  }
  
  if (userAvatar && userDropdown) {
    userAvatar.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!userDropdown.contains(e.target) && e.target !== userAvatar) {
        userDropdown.classList.remove('active');
      }
    });
  }

  // --- DARK MODE LOGIC ---
  const themeToggle = document.getElementById('theme-toggle');
  const savedMode = localStorage.getItem('darkMode');
  
  const sunIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  const moonIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

  if (savedMode === 'true') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = sunIcon;
  } else {
    themeToggle.innerHTML = moonIcon;
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    themeToggle.innerHTML = isDark ? sunIcon : moonIcon;
  });

  // --- DYNAMIC COLOR LOGIC ---
  const colorBtns = document.querySelectorAll('.color-btn');
  const savedColor = localStorage.getItem('themeColor') || 'indigo';
  
  function applyColorTheme(color) {
    document.body.classList.remove('theme-indigo', 'theme-rose', 'theme-emerald', 'theme-amber');
    if (color !== 'indigo') {
      document.body.classList.add(`theme-${color}`);
    }
    colorBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color === color);
    });
    localStorage.setItem('themeColor', color);
  }

  applyColorTheme(savedColor);

  colorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      applyColorTheme(e.target.dataset.color);
    });
  });
}
