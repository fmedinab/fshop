import { CONFIG } from '../config/config.js';

// Datos Mock con Variantes
const mockProducts = [
  { id: '1', name: 'MacBook Pro M3 Max', price: 11500.00, originalPrice: 12500.00, category: 'tech', images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'], sizes: ['14"', '16"'], colors: [{name: 'Space Black', hex: '#2e2e30'}], stock: 5, description: 'La laptop más avanzada.' },
  { id: '2', name: 'Sony WH-1000XM5', price: 1299.00, originalPrice: null, category: 'tech', images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80'], sizes: [], colors: [{name: 'Negro', hex: '#000000'}], stock: 15, description: 'Auriculares inalámbricos.' },
  { id: '3', name: 'Chaqueta de Cuero', price: 350.00, originalPrice: 450.00, category: 'fashion', images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'], sizes: ['S', 'M', 'L'], colors: [{name: 'Negro', hex: '#000000'}], stock: 2, description: 'Chaqueta de cuero genuino.' },
  { id: '4', name: 'Zapatillas Urban', price: 320.00, originalPrice: null, category: 'fashion', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'], sizes: ['39', '40', '41'], colors: [{name: 'Rojo', hex: '#e11d48'}], stock: 30, description: 'Zapatillas ligeras.' }
];

const mockOrders = [
  { id: 'ORD-17012345', customer: 'Juan Pérez', total: 1299.00, date: '2023-10-25', status: 'Completado', method: 'Mercado Pago' },
  { id: 'ORD-17012346', customer: 'María Gómez', total: 350.00, date: '2023-10-26', status: 'Pendiente', method: 'Yape' }
];

const mockSliders = [
  { id: 'SLD-001', title: 'Nueva Colección de Invierno', subtitle: 'Hasta 40% de descuento en prendas seleccionadas.', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80', link: '/categories/moda', buttonText: 'Ver Colección', status: 'Activo' },
  { id: 'SLD-002', title: 'Lo Último en Tecnología', subtitle: 'Lleva tu productividad al siguiente nivel.', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1600&q=80', link: '/categories/tecnologia', buttonText: 'Explorar ahora', status: 'Activo' }
];

const mockCoupons = [
  { id: 'c1', code: 'VERANO20', discount: '20%', status: 'Activo', expires: '2024-12-31' },
  { id: 'c2', code: 'ENVIOFREE', discount: 'Envío Gratis', status: 'Inactivo', expires: '2024-06-30' }
];

const mockUsers = [
  { id: 'U-001', name: 'Juan Pérez', email: 'juan@example.com', role: 'Cliente', status: 'Activo', registered: '2023-01-15' },
  { id: 'U-002', name: 'María Gómez', email: 'maria@example.com', role: 'Cliente', status: 'Activo', registered: '2023-05-20' },
  { id: 'U-003', name: 'Admin Principal', email: 'admin@trendstore.com', role: 'Admin', status: 'Activo', registered: '2022-11-10' }
];

const mockRoles = [
  { id: 'R-001', name: 'Admin', description: 'Acceso total al sistema', permissions: ['all'] },
  { id: 'R-002', name: 'Editor', description: 'Gestión de productos y páginas', permissions: ['products', 'pages', 'categories'] },
  { id: 'R-003', name: 'Soporte', description: 'Gestión de usuarios y mensajes', permissions: ['users', 'messages'] },
  { id: 'R-004', name: 'Cliente', description: 'Usuario regular', permissions: [] }
];

const mockNotifications = [
  { id: 'N1', title: 'Nuevo Pedido Recibido', message: 'El pedido ORD-17012346 por S/ 350.00 ha sido registrado.', type: 'order', date: 'Hace 5 min', read: false },
  { id: 'N2', title: 'Alerta de Stock Bajo', message: 'Chaqueta de Cuero (Quedan 2 unidades).', type: 'alert', date: 'Hace 1 hora', read: false },
  { id: 'N3', title: 'Pago Confirmado', message: 'Mercado Pago aprobó el pago de ORD-17012345.', type: 'payment', date: 'Hace 1 día', read: true }
];

// Configuración por defecto expandida
const defaultSettings = {
  maintenanceMode: false,
  storeName: 'TrendStore',
  storeRuc: '',
  aboutTitle: 'Nuestra Historia',
  aboutText: 'Somos TrendStore, tu destino número uno para tecnología, moda y accesorios...',
  contactEmail: 'hola@trendstore.com',
  contactPhone: '+51 999 888 777',
  contactAddress: 'Av. Principal 123, Lima, Perú',
  businessName: 'TrendStore S.A.C.',
  businessRuc: '20123456789',
  taxRate: 18,
  apiUrl: '',
  yape: '',
  plin: '',
  mpPublic: '',
  mpAccess: '',
  maintenance: false,
  mpPublicKey: 'TEST-tu-public-key-aqui',
  mpAccessToken: '',
  yapePhone: '999 888 777',
  plinPhone: '999 888 777'
};

export const ApiService = {
  // ========== MÉTODOS AUXILIARES DE RED ==========
  async request(action, payload = {}) {
    // Si es una solicitud de configuración, siempre retornar desde localStorage primero
    if (action === 'config') {
      return this.getSettings();
    }
    
    if (!CONFIG.API_URL) return { success: true, fake: true };
    const formData = new URLSearchParams();
    formData.append('data', JSON.stringify({ action, adminKey: sessionStorage.getItem('adminKey'), ...payload }));
    
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  },

  async fetch(action, params = {}) {
    if (!CONFIG.API_URL) return this.mockResponse(action);
    
    try {
      const url = new URL(CONFIG.API_URL);
      url.searchParams.append('action', action);
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
      
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async getProducts() { return this.fetch('products'); },
  async getCategories() { return this.fetch('categories'); },
  async getOrders() { return this.fetch('orders'); },
  async getSliders() { return this.fetch('sliders'); },
  async getCoupons() { return this.fetch('coupons'); },
  async getUsers(adminKey) { return this.fetch('users', { adminKey }); },
  async getRoles(adminKey) { return this.fetch('roles', { adminKey }); },
  async getNotifications(adminKey) { return this.fetch('notifications', { adminKey }); },
  async getConfig() { return this.fetch('config'); },
  
  async getDashboardStats() {
    return { 
      totalSales: 24500.50, 
      totalOrders: 156, 
      activeUsers: 89, 
      recentOrders: mockOrders,
      topProducts: [
        { name: 'Zapatillas Urban', sales: 45, revenue: 14400 },
        { name: 'Sony WH-1000XM5', sales: 22, revenue: 28578 },
        { name: 'Chaqueta de Cuero', sales: 15, revenue: 5250 }
      ],
      paymentMethods: {
        mercadopago: 65,
        yape: 25,
        plin: 10
      }
    };
  },

  getSettings() {
    // ✅ RÁPIDO: retorna de localStorage inmediatamente
    const localSettings = localStorage.getItem('store_dynamic_settings');
    return localSettings ? JSON.parse(localSettings) : defaultSettings;
  },

  // ✅ ASYNC: sincroniza con Google Sheets en BACKGROUND (sin bloquear UI)
  async syncSettingsFromGoogleSheets() {
    if (!CONFIG.API_URL) return;
    
    try {
      const response = await fetch(CONFIG.API_URL + '?action=config');
      const result = await response.json();
      if (result && !result.error) {
        // Actualizar localStorage con datos de Google Sheets
        localStorage.setItem('store_dynamic_settings', JSON.stringify(result));
      }
    } catch(e) {
      // Silenciosamente ignora errores de conexión
    }
  },

  saveSettings(newSettings) {
    const localSettings = localStorage.getItem('store_dynamic_settings');
    const current = localSettings ? JSON.parse(localSettings) : defaultSettings;
    const updated = { ...current, ...newSettings };
    localStorage.setItem('store_dynamic_settings', JSON.stringify(updated));
    return updated;
  },

  async createOrder(orderData) {
    if (!CONFIG.API_URL) return { success: true, orderId: 'ORD-' + Date.now() };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'createOrder', ...orderData }),
    });
    return await response.json();
  },

  // ========== MÉTODOS DE ADMIN (PRODUCTOS) ==========
  async createProduct(productData, adminKey) {
    if (!CONFIG.API_URL) return { success: true, productId: 'PROD-' + Date.now() };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'createProduct', adminKey, ...productData }),
    });
    return await response.json();
  },

  async editProduct(productData, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'editProduct', adminKey, ...productData }),
    });
    return await response.json();
  },

  async deleteProduct(productId, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'deleteProduct', adminKey, id: productId }),
    });
    return await response.json();
  },

  // ========== MÉTODOS DE ADMIN (CATEGORÍAS) ==========
  async createCategory(categoryData, adminKey) {
    if (!CONFIG.API_URL) return { success: true, categoryId: 'CAT-' + Date.now() };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'createCategory', adminKey, ...categoryData }),
    });
    return await response.json();
  },

  async editCategory(categoryData, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'editCategory', adminKey, ...categoryData }),
    });
    return await response.json();
  },

  async deleteCategory(categoryId, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'deleteCategory', adminKey, id: categoryId }),
    });
    return await response.json();
  },

  // ========== MÉTODOS DE ADMIN (SLIDERS) ==========
  async createSlider(sliderData, adminKey) {
    if (!CONFIG.API_URL) return { success: true, sliderId: 'SLD-' + Date.now() };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'createSlider', adminKey, ...sliderData }),
    });
    return await response.json();
  },

  async editSlider(sliderData, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'editSlider', adminKey, ...sliderData }),
    });
    return await response.json();
  },

  async deleteSlider(sliderId, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'deleteSlider', adminKey, id: sliderId }),
    });
    return await response.json();
  },

  // ========== MÉTODOS DE ADMIN (ÓRDENES) ==========
  async updateOrderStatus(orderId, status, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'updateOrderStatus', adminKey, orderId, status }),
    });
    return await response.json();
  },

  // ========== MÉTODOS DE ADMIN (CUPONES) ==========
  async createCoupon(couponData, adminKey) {
    if (!CONFIG.API_URL) return { success: true, couponId: 'CPN-' + Date.now() };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'createCoupon', adminKey, ...couponData }),
    });
    return await response.json();
  },

  async editCoupon(couponData, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'editCoupon', adminKey, ...couponData }),
    });
    return await response.json();
  },

  async deleteCoupon(couponId, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'deleteCoupon', adminKey, id: couponId }),
    });
    return await response.json();
  },

  // ========== MÉTODOS DE ADMIN (ZONAS DE ENVÍO) ==========
  async getZones() { return this.fetch('zones'); },
  
  async createZone(zoneData, adminKey) {
    if (!CONFIG.API_URL) return { success: true, id: 'ZON-' + Date.now() };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'createZone', adminKey, ...zoneData }),
    });
    return await response.json();
  },

  async updateZone(zoneId, zoneData, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'editZone', adminKey, id: zoneId, ...zoneData }),
    });
    return await response.json();
  },

  async deleteZone(zoneId, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'deleteZone', adminKey, id: zoneId }),
    });
    return await response.json();
  },

  // ========== MÉTODOS DE CONTACTO (PÚBLICO) ==========
  async sendMessage(msgData) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'sendMessage', ...msgData }),
    });
    return await response.json();
  },

  // ========== MÉTODOS DE ADMIN (MENSAJES) ==========
  async getMessages(adminKey) { return this.fetch('messages', { adminKey }); },
  async readMessage(msgId, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'readMessage', adminKey, id: msgId }),
    });
    return await response.json();
  },
  async deleteMessage(msgId, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'deleteMessage', adminKey, id: msgId }),
    });
    return await response.json();
  },

  // ========== MÉTODOS DE ADMIN (NOTIFICACIONES) ==========
  async createNotification(notificationData, adminKey) {
    if (!CONFIG.API_URL) return { success: true, notificationId: 'NOTIF-' + Date.now() };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'createNotification', adminKey, ...notificationData }),
    });
    return await response.json();
  },

  // ========== MÉTODOS DE ADMIN (PÁGINAS) ==========
  async getPages() { return this.fetch('pages'); },
  async createPage(pageData, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'createPage', adminKey, ...pageData }),
    });
    return await response.json();
  },
  async updatePage(pageId, pageData, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'editPage', adminKey, id: pageId, ...pageData }),
    });
    return await response.json();
  },
  async deletePage(pageId, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'deletePage', adminKey, id: pageId }),
    });
    return await response.json();
  },

  // ========== MÉTODOS DE ADMIN (ROLES) ==========
  async createRole(roleData, adminKey) {
    if (!CONFIG.API_URL) return { success: true, roleId: 'R-' + Date.now() };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'createRole', adminKey, ...roleData }),
    });
    return await response.json();
  },
  async updateRole(roleId, roleData, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'editRole', adminKey, id: roleId, ...roleData }),
    });
    return await response.json();
  },
  async deleteRole(roleId, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'deleteRole', adminKey, id: roleId }),
    });
    return await response.json();
  },
  async updateUserRole(userId, newRole, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'updateUserRole', adminKey, id: userId, role: newRole }),
    });
    return await response.json();
  },

  // ========== MÉTODOS DE ADMIN (CONFIGURACIÓN) ==========
  async updateSettings(settingsData, adminKey) {
    // Guardar en localStorage como cache
    const saved = this.saveSettings(settingsData);
    
    // SIEMPRE contactar al backend si hay API_URL
    // El backend validará la adminKey
    if (!CONFIG.API_URL) {
      return { success: true, data: saved };
    }
    
    try {
      const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'updateSettings', adminKey, settings: settingsData }),
      });
      const result = await response.json();
      
      // Si Google Sheets respondió correctamente, guardar también en localStorage para cache
      if (result.success) {
        this.saveSettings(settingsData);
      }
      
      return result;
    } catch(e) {
      console.error('Error updating settings in API:', e);
      // En caso de error de red, al menos guardamos en localStorage
      return { success: true, data: saved };
    }
  },

  // ========== MÉTODOS DE LOGIN / REGISTRO ==========
  async loginUser(email, password) {
    if (!CONFIG.API_URL) return { success: false, error: 'API Offline' };
    const formData = new URLSearchParams();
    formData.append('data', JSON.stringify({ action: 'loginUser', email, password }));
    
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  },

  async registerUser(name, email, password, phone = "", address = "", document = "") {
    if (!CONFIG.API_URL) return { success: false, error: 'API Offline' };
    const formData = new URLSearchParams();
    formData.append('data', JSON.stringify({ action: 'registerUser', name, email, password, phone, address, document }));
    
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  },

  // ========== MÉTODOS DE LECTURA PROTEGIDA ==========
  async getDashboardStats(adminKey) {
    if (!CONFIG.API_URL) {
      return this.mockResponse('stats');
    }
    try {
      const url = new URL(CONFIG.API_URL);
      url.searchParams.append('action', 'stats');
      url.searchParams.append('adminKey', adminKey);
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  mockResponse(action) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (action === 'products') resolve(mockProducts);
        if (action === 'categories') resolve([{id: 'tech', name: '💻 Tecnología'}, {id: 'fashion', name: '👕 Moda'}]);
        if (action === 'orders') resolve(mockOrders);
        if (action === 'sliders') resolve(mockSliders);
        if (action === 'coupons') resolve(mockCoupons);
        if (action === 'users') resolve(mockUsers);
        if (action === 'roles') resolve(mockRoles);
        if (action === 'notifications') resolve(mockNotifications);
        if (action === 'config') resolve(defaultSettings);
        if (action === 'stats') resolve({
          totalSales: 24500.50, 
          totalOrders: 156, 
          activeUsers: 89, 
          recentOrders: mockOrders,
          topProducts: [
            { name: 'Zapatillas Urban', sales: 45, revenue: 14400 },
            { name: 'Sony WH-1000XM5', sales: 22, revenue: 28578 },
            { name: 'Chaqueta de Cuero', sales: 15, revenue: 5250 }
          ],
          paymentMethods: { mercadopago: 65, yape: 25, plin: 10 }
        });
      }, 200);
    });
  }
};
