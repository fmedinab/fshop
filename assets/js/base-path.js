/**
 * Base URL Helper - Detecta automáticamente si estamos en GitHub Pages (fshop/) o localhost
 * Se carga ANTES de los módulos para resolver rutas correctamente
 */
(function() {
  // Detectar si estamos en GitHub Pages (fshop), o en un subfolder local (como /EcommerceF)
  const isGitHub = window.location.hostname.includes('github.io');
  const pathname = window.location.pathname;
  
  if (isGitHub) {
    window.BASE_URL = '/fshop';
  } else if (pathname.includes('/EcommerceF')) {
    window.BASE_URL = '/EcommerceF';
  } else {
    window.BASE_URL = ''; // Localhost rooteado
  }
  
  // Nivel de profundidad del HTML actual
  const pathDepth = (currentPath.match(/\//g) || []).length - 1; // Restar 1 porque pathname comienza con /
  window.DEPTH = pathDepth >= 3 ? pathDepth - 2 : 0; // Relativo a /fshop/ o raíz
  
  // Ruta relativa automática
  window.getRelativePath = function(path) {
    if (!path.startsWith('/')) return path;
    // path es absoluto como "/components/header.js"
    const cleanPath = path.substring(1); // Quitar el / al inicio
    const depth = window.DEPTH;
    const prefix = depth > 0 ? '../'.repeat(depth) : './';
    return prefix + cleanPath;
  };
  
  console.log('[BASE] Ruta base:', window.BASE_URL);
  console.log('[BASE] Profundidad:', window.DEPTH);
})();
