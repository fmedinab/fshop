import { CONFIG } from '../config/config.js';
import { ApiService } from '../services/api.js';

export function renderFooter() {
  // Leer storeName de Google Sheets/localStorage (prioridad sobre CONFIG)
  let storeName = 'TrendStore';
  let storeDesc = 'La mejor selección de tecnología, moda y accesorios, directo a tu puerta con envíos a todo el país.';
  
  try {
    const settings = ApiService.getSettings();
    if (settings) {
      storeName = settings.storeName || CONFIG.STORE_NAME || 'TrendStore';
      if (settings.aboutText) storeDesc = settings.aboutText.length > 100 ? settings.aboutText.substring(0, 100) + '...' : settings.aboutText;
    } else {
      storeName = CONFIG.STORE_NAME || 'TrendStore';
    }
  } catch(e) {
    storeName = CONFIG.STORE_NAME || 'TrendStore';
  }
  
  // Sincronizar con Google Sheets en background (sin bloquear)
  ApiService.syncSettingsFromGoogleSheets();
  
  // Create a placeholder for dynamic links
  const footerHtml = `
    <footer style="background-color: var(--card-background); padding: 50px 0 20px; margin-top: 60px; border-top: 2px solid var(--border-color);">
      <div class="container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px;">
        <div>
          <h3 style="color: var(--primary-color); font-weight: 900; font-size: 1.5rem; margin-bottom: 15px;">🛍️ ${storeName}</h3>
          <p style="color: var(--text-light); font-size: 0.95rem; line-height: 1.6;">
            ${storeDesc}
          </p>
        </div>
        
        <div>
          <h4 style="margin-bottom: 15px; font-size: 1.1rem; color: var(--text-color);">Navegación</h4>
          <ul style="color: var(--text-light); line-height: 2; list-style: none; padding: 0;">
            <li><a href="${window.BASE_URL || ''}/" style="transition: color 0.2s;">Inicio</a></li>
            <li><a href="${window.BASE_URL || ''}/categories/" style="transition: color 0.2s;">Catálogo de Productos</a></li>
            <li><a href="${window.BASE_URL || ''}/cart/" style="transition: color 0.2s;">Mi Carrito</a></li>
          </ul>
        </div>

        <div>
          <h4 style="margin-bottom: 15px; font-size: 1.1rem; color: var(--text-color);">Información y Ayuda</h4>
          <ul id="dynamic-footer-pages" style="color: var(--text-light); line-height: 2; list-style: none; padding: 0;">
            <li><a href="${window.BASE_URL || ''}/about/" style="transition: color 0.2s;">Sobre Nosotros</a></li>
            <li><a href="${window.BASE_URL || ''}/contact/" style="transition: color 0.2s;">Contacto</a></li>
          </ul>
        </div>
      </div>
      
      <div class="container" style="text-align: center; border-top: 1px solid var(--border-color); padding-top: 25px; margin-top: 40px;">
        <p style="font-size: 0.9rem; color: var(--text-light);">© ${new Date().getFullYear()} ${storeName}. Todos los derechos reservados.</p>
      </div>
    </footer>
  `;
  
  const container = document.getElementById('footer-container');
  if (container) container.innerHTML = footerHtml;

  // Cargar páginas dinámicas SIN BLOQUEAR (timeout de 3s máximo)
  try {
    if (window.ApiService && window.ApiService.getPages) {
      const pagesPromise = window.ApiService.getPages();
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve([]), 3000));
      
      Promise.race([pagesPromise, timeoutPromise]).then(pages => {
        if (!Array.isArray(pages) || pages.length === 0) return; // Sin páginas, salir
        
        const listContainer = document.getElementById('dynamic-footer-pages');
        if (!listContainer) return;
        
        const activePages = pages.filter(p => p.status === 'Activo');
        let extraLinks = [];
        
        const avoidList = ['sobre-nosotros', 'contacto', 'contact', 'about', 'about-us', 'sobre nosotros', 'nosotros'];
        activePages.forEach(p => {
          if (!avoidList.includes((p.slug || '').toLowerCase()) && !avoidList.includes((p.title || '').toLowerCase())) {
            extraLinks.push(`<li><a href="${window.BASE_URL || ''}/page/?id=${p.slug}" style="transition: color 0.2s;">${p.title}</a></li>`);
          }
        });
        
        if (extraLinks.length > 0) {
          listContainer.innerHTML += extraLinks.join('');
        }
      }).catch(() => {});
    }
  } catch (error) {
    // Silenciosamente ignora errores
  }
}
