import { CONFIG } from '../config/config.js';

export function renderFooter() {
  const footerHtml = `
    <footer style="background-color: var(--card-background); padding: 50px 0 20px; margin-top: 60px; border-top: 2px solid var(--border-color);">
      <div class="container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px;">
        <div>
          <h3 style="color: var(--primary-color); font-weight: 900; font-size: 1.5rem; margin-bottom: 15px;">🛍️ ${CONFIG.STORE_NAME}</h3>
          <p style="color: var(--text-light); font-size: 0.95rem; line-height: 1.6;">
            La mejor selección de tecnología, moda y accesorios, directo a tu puerta con envíos a todo el país.
          </p>
        </div>
        
        <div>
          <h4 style="margin-bottom: 15px; font-size: 1.1rem; color: var(--text-color);">Navegación</h4>
          <ul style="color: var(--text-light); line-height: 2; list-style: none; padding: 0;">
            <li><a href="/" style="transition: color 0.2s;">Inicio</a></li>
            <li><a href="/categories/" style="transition: color 0.2s;">Catálogo de Productos</a></li>
            <li><a href="/cart/" style="transition: color 0.2s;">Mi Carrito</a></li>
          </ul>
        </div>

        <div>
          <h4 style="margin-bottom: 15px; font-size: 1.1rem; color: var(--text-color);">Información</h4>
          <ul style="color: var(--text-light); line-height: 2; list-style: none; padding: 0;">
            <li><a href="/about/" style="transition: color 0.2s;">Sobre Nosotros</a></li>
            <li><a href="/contact/" style="transition: color 0.2s;">Contacto</a></li>
            <li style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed var(--border-color);">
              <a href="/admin/" style="color: var(--primary-color); font-weight: 600; display: inline-flex; align-items: center; gap: 5px;">
                ⚙️ Admin Dashboard
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="container" style="text-align: center; border-top: 1px solid var(--border-color); padding-top: 25px; margin-top: 40px;">
        <p style="font-size: 0.9rem; color: var(--text-light);">© ${new Date().getFullYear()} ${CONFIG.STORE_NAME}. Todos los derechos reservados.</p>
      </div>
    </footer>
  `;
  document.getElementById('footer-container').innerHTML = footerHtml;
}
