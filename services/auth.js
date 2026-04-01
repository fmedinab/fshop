export const AuthService = {
  getUser() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) return JSON.parse(userStr);
    
    // Default mock client (Juan Pérez para que coincida con los pedidos de prueba)
    const defaultUser = { id: 'C-001', name: 'Juan Pérez', email: 'juan@example.com', role: 'client' };
    localStorage.setItem('currentUser', JSON.stringify(defaultUser));
    return defaultUser;
  },
  
  isLoggedIn() {
    return !!this.getUser();
  },

  isAdmin() {
    // Para propósitos de demo, siempre permitimos acceso al panel admin
    return true; 
  },

  loginAsAdmin() {
    localStorage.setItem('currentUser', JSON.stringify({ id: 'A-001', name: 'Admin Demo', email: 'admin@trendstore.com', role: 'admin' }));
    window.location.reload();
  },

  loginAsClient() {
    localStorage.setItem('currentUser', JSON.stringify({ id: 'C-001', name: 'Juan Pérez', email: 'juan@example.com', role: 'client' }));
    window.location.reload();
  },

  logout() {
    localStorage.removeItem('currentUser');
    window.showToast('Sesión cerrada exitosamente', 'success');
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  }
};
