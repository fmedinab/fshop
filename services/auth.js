import { ApiService } from './api.js';

export const AuthService = {
  getUser() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) return JSON.parse(userStr);
    return null; // Return null by default, meaning not logged in
  },
  
  isLoggedIn() {
    return !!this.getUser();
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.role && (user.role.toLowerCase() === 'admin' || user.role.toLowerCase() === 'superadmin');
  },

  async login(email, password) {
    try {
      const response = await ApiService.loginUser(email, password);
      
      if (response && response.success && response.user) {
        const user = response.user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        if (user.role && (user.role.toLowerCase() === 'admin' || user.role.toLowerCase() === 'superadmin')) {
            sessionStorage.setItem('adminKey', password);
        }
        return true;
      }

      // Hardcoded fallback para pruebas rápidas
      if (email === 'admin@trendstore.com' && password === 'admin123') {
        const defaultAdmin = { id: 'A-001', name: 'Admin Demo', email: 'admin@trendstore.com', role: 'admin' };
        localStorage.setItem('currentUser', JSON.stringify(defaultAdmin));
        sessionStorage.setItem('adminKey', password);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error in login:', error);
      return false;
    }
  },

  async register(name, email, password, phone = "", address = "", document = "") {
    try {
      const response = await ApiService.registerUser(name, email, password, phone, address, document);
      
      if (response && response.success && response.user) {
        return { success: true };
      }
      
      return { success: false, error: response.error || "No se pudo registrar en la base de datos." };
    } catch (error) {
      console.error('Error in register:', error);
      return { success: false, error: "Error de conexión (Bloqueado por el navegador o red)." };
    }
  },

  loginAsAdmin() {
    localStorage.setItem('currentUser', JSON.stringify({ id: 'A-001', name: 'Admin Demo', email: 'admin@trendstore.com', role: 'admin' }));
    sessionStorage.setItem('adminKey', 'admin123'); // Asegurar acceso a BD
    window.location.reload();
  },

  loginAsClient() {
    localStorage.setItem('currentUser', JSON.stringify({ id: 'C-001', name: 'Juan Pérez', email: 'juan@example.com', role: 'client' }));
    window.location.reload();
  },

  logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('adminKey'); // Quitar la llave al salir
    window.showToast('Sesión cerrada exitosamente', 'success');
    setTimeout(() => {
      window.location.href = window.BASE_URL + '/';
    }, 1000);
  }
};
