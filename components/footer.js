import { CONFIG } from '../config/config.js';
import { ApiService } from '../services/api.js';

export async function renderFooter() {
  // Intentar cargar la configuración de la tienda de forma dinámica
  let storeName = CONFIG.STORE_NAME || 'TrendStore';
  let storeDesc = 'La mejor selección de tecnología, moda y accesorios, directo a tu puerta con envíos a todo el país.';
  
  try {
    const settings = ApiService.getSettings();
    if (settings) {
      if (settings.storeName) storeName = settings.storeName;
      if (settings.aboutText) storeDesc = settings.aboutText.length > 100 ? settings.aboutText.substring(0, 100) + '...' : settings.aboutText;
    }
  } catch(e) {}
  
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
            <div class="skeleton" style="width: 60%; height: 15px; margin-top: 10px; border-radius: 4px;"></div>
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

  // Append dynamic pages to the footer
  try {
    if (window.ApiService && window.ApiService.getPages) {
      const pages = await window.ApiService.getPages();
      const listContainer = document.getElementById('dynamic-footer-pages');
      
      if (listContainer && Array.isArray(pages)) {
        const activePages = pages.filter(p => p.status === 'Activo');
        
        let linksHtml = `
          <li><a href="${window.BASE_URL || ''}/about/" style="transition: color 0.2s;">Sobre Nosotros</a></li>
          <li><a href="${window.BASE_URL || ''}/contact/" style="transition: color 0.2s;">Contacto</a></li>
        `;
        
        // Evitar duplicar nombres como 'Sobre Nosotros' o páginas ya listadas
        const avoidList = ['sobre-nosotros', 'contacto', 'contact', 'about', 'about-us', 'sobre nosotros', 'nosotros'];
        
        activePages.forEach(p => {
          if (!avoidList.includes((p.slug || '').toLowerCase()) && !avoidList.includes((p.title || '').toLowerCase())) {
            linksHtml += `<li><a href="${window.BASE_URL || ''}/page/?id=${p.slug}" style="transition: color 0.2s;">${p.title}</a></li>`;
          }
        });
        
        listContainer.innerHTML = linksHtml;
      }
    }
  } catch (error) {
    console.error("Error cargando páginas en el footer:", error);
    const listContainer = document.getElementById('dynamic-footer-pages');
    if (listContainer) {
      listContainer.innerHTML = `
        <li><a href="${window.BASE_URL || ''}/about/" style="transition: color 0.2s;">Sobre Nosotros</a></li>
        <li><a href="${window.BASE_URL || ''}/contact/" style="transition: color 0.2s;">Contacto</a></li>
      `;
    }
  }
}
