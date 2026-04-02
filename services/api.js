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
  { id: 's1', title: 'Nueva Colección', subtitle: 'Hasta 40% de descuento.', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80', link: '/categories/', buttonText: 'Ver Colección' }
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

const mockNotifications = [
  { id: 'N1', title: 'Nuevo Pedido Recibido', message: 'El pedido ORD-17012346 por S/ 350.00 ha sido registrado.', type: 'order', date: 'Hace 5 min', read: false },
  { id: 'N2', title: 'Alerta de Stock Bajo', message: 'Chaqueta de Cuero (Quedan 2 unidades).', type: 'alert', date: 'Hace 1 hora', read: false },
  { id: 'N3', title: 'Pago Confirmado', message: 'Mercado Pago aprobó el pago de ORD-17012345.', type: 'payment', date: 'Hace 1 día', read: true }
];

// Configuración por defecto expandida
const defaultSettings = {
  maintenanceMode: false,
  aboutTitle: 'Nuestra Historia',
  aboutText: 'Somos TrendStore, tu destino número uno para tecnología, moda y accesorios...',
  contactEmail: 'hola@trendstore.com',
  contactPhone: '+51 999 888 777',
  contactAddress: 'Av. Principal 123, Lima, Perú',
  businessName: 'TrendStore S.A.C.',
  businessRuc: '20123456789',
  taxRate: 18,
  apiUrl: '',
  mpPublicKey: 'TEST-tu-public-key-aqui',
  mpAccessToken: '',
  yapePhone: '999 888 777',
  plinPhone: '999 888 777'
};

export const ApiService = {
  // ========== MÉTODOS AUXILIARES DE RED ==========
  async request(action, payload = {}) {
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
    const localSettings = localStorage.getItem('store_dynamic_settings');
    return localSettings ? JSON.parse(localSettings) : defaultSettings;
  },

  saveSettings(newSettings) {
    const current = this.getSettings();
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

  // ========== MÉTODOS DE ADMIN (NOTIFICACIONES) ==========
  async createNotification(notificationData, adminKey) {
    if (!CONFIG.API_URL) return { success: true, notificationId: 'NOTIF-' + Date.now() };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'createNotification', adminKey, ...notificationData }),
    });
    return await response.json();
  },

  // ========== MÉTODOS DE ADMIN (CONFIGURACIÓN) ==========
  async updateSettings(settingsData, adminKey) {
    if (!CONFIG.API_URL) return { success: true };
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'updateSettings', adminKey, settings: settingsData }),
    });
    return await response.json();
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
        if (action === 'notifications') resolve(mockNotifications);
      }, 200);
    });
  }
};
